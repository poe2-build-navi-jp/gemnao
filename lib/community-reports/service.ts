import { reportStatement as stmt, reportBatch as batch } from './database';
import { strictJson } from '../diagnostic-feedback/json';
import { feedbackNetwork } from '../diagnostic-feedback/rate-limit';
import { articleReview } from '../fix-save';
import { callGuard, GuardFailure, type GuardEnv } from './guard-client';
import {
  ID,
  SECRET,
  MAX_REVISIONS,
  RETENTION_SECONDS,
  exact,
  parseContent,
  parseEvidence,
  reasons,
  symptoms,
  type Content,
  type Evidence,
} from './model';
export type ReportsEnv = GuardEnv & {
  REPORTS_DB?: D1Database;
  REPORTS_ENABLED?: string;
  REPORTS_PUBLIC_ENABLED?: string;
  REPORTS_REVIEW_ENABLED?: string;
  REPORTS_BUDGET_VERIFIED?: string;
  REPORTS_MONITOR_MODE?: string;
  REPORTS_PUBLIC_MONITOR_VERIFIED?: string;
  REPORTS_USAGE_PROFILE_VERIFIED?: string;
};
type Row = {
  id: string;
  owner_hash: string;
  revision: number;
  game_slug: string;
  symptom: string;
  content_json: string;
  state: string;
  approved_revision: number | null;
  public_json: string | null;
  last_request: string;
  created_at: number;
  updated_at: number;
  expires_at: number;
};
export const reportHeaders = {
  'Cache-Control': 'private, no-store',
  'X-Robots-Tag': 'noindex, nofollow, noarchive',
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
  'Content-Type': 'application/json',
};
const reply = (value: unknown, status = 200) =>
  new Response(JSON.stringify(value), { status, headers: reportHeaders });
export const digest = async (s: string) =>
  Array.from(
    new Uint8Array(
      await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)),
    ),
    (v) => v.toString(16).padStart(2, '0'),
  ).join('');
async function body(request: Request) {
  if (
    !request.headers
      .get('content-type')
      ?.toLowerCase()
      .startsWith('application/json') ||
    !request.body
  )
    throw Error('input');
  const reader = request.body.getReader(),
    chunks: Uint8Array[] = [];
  let bytes = 0;
  while (true) {
    const r = await reader.read();
    if (r.done) break;
    bytes += r.value.length;
    if (bytes > 8192) {
      await reader.cancel();
      throw Error('input');
    }
    chunks.push(r.value);
  }
  const data = new Uint8Array(bytes);
  let at = 0;
  for (const c of chunks) {
    data.set(c, at);
    at += c.length;
  }
  return strictJson(new TextDecoder('utf-8', { fatal: true }).decode(data));
}
export async function reportsHealthy(
  env: ReportsEnv,
  now: number,
  withGuard = true,
) {
  if (
    !env.REPORTS_DB ||
    !env.REPORTS_GUARD ||
    !env.REPORTS_GUARD_INSTANCE ||
    env.REPORTS_BUDGET_VERIFIED !== 'true'
  )
    return false;
  const publicMonitor = env.REPORTS_MONITOR_MODE === 'public-status';
  if (
    env.REPORTS_AUTO_OBSERVATION_ENABLED === 'true' &&
    (!publicMonitor ||
      env.REPORTS_USAGE_PROFILE_VERIFIED !== 'true' ||
      env.REPORTS_PUBLIC_MONITOR_VERIFIED !== 'true')
  )
    return false;
  if (
    publicMonitor &&
    (env.REPORTS_PUBLIC_MONITOR_VERIFIED !== 'true' ||
      env.REPORTS_AUTO_OBSERVATION_ENABLED !== 'true')
  )
    return false;
  if (withGuard && !(await callGuard(env, '/check', { ids: [] })).ready)
    return false;
  const h = await stmt(
    env.REPORTS_DB,
    "SELECT key,value FROM community_operations WHERE key IN ('cleanup','monitor')",
  ).all<{ key: string; value: string }>();
  return (publicMonitor ? ['cleanup'] : ['cleanup', 'monitor']).every((key) => {
    const at = Number(h.results.find((x) => x.key === key)?.value);
    return Number.isFinite(at) && at <= now && at >= now - 7200;
  });
}
// Separate atomic rolling quotas. No raw IPs; no reuse of another feature's ledger.
async function quota(
  db: D1Database,
  request: Request,
  bucket: string,
  now: number,
) {
  const network = feedbackNetwork(request.headers.get('cf-connecting-ip'));
  if (!network) throw Error('rate');
  const day = Math.floor(now / 86400);
  const salt = `${day}:${Array.from(crypto.getRandomValues(new Uint8Array(32)), (v) => v.toString(16).padStart(2, '0')).join('')}`;
  await stmt(
    db,
    `INSERT INTO community_operations(key,value) VALUES('salt',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value WHERE CAST(substr(value,1,instr(value,':')-1) AS INTEGER)<?`,
    salt,
    day,
  ).run();
  const stored = await stmt(
    db,
    "SELECT value FROM community_operations WHERE key='salt'",
  ).first<{ value: string }>();
  if (!stored?.value.startsWith(`${day}:`)) throw Error('rate');
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(stored.value),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const fp = Array.from(
    new Uint8Array(
      await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(network)),
    ),
    (v) => v.toString(16).padStart(2, '0'),
  ).join('');
  const limit = bucket === 'public' ? 20 : 10;
  const r = await batch(db, [
    stmt(db, 'DELETE FROM community_rate WHERE at<?', now - 60),
    stmt(
      db,
      `INSERT INTO community_rate SELECT ?,?,?,? WHERE (SELECT count(*) FROM community_rate WHERE bucket=?)<? AND (SELECT count(*) FROM community_rate WHERE bucket=? AND network_hash=?)<5`,
      crypto.randomUUID(),
      bucket,
      fp,
      now,
      bucket,
      limit,
      bucket,
      fp,
    ),
  ]);
  return r[1].meta.changes === 1;
}
const row = (db: D1Database, id: string) =>
  stmt(db, 'SELECT * FROM community_reports WHERE id=?', id).first<Row>();
async function withdrawal(db: D1Database, id: string) {
  return !!(await stmt(
    db,
    'SELECT report_id FROM community_article_refs WHERE report_id=? AND withdrawal_at IS NOT NULL AND completed_at IS NULL LIMIT 1',
    id,
  ).first());
}
async function ownerView(db: D1Database, r: Row, now: number, blocked = false) {
  const pending = await withdrawal(db, r.id);
  if (r.state === 'deleted' || r.expires_at <= now || blocked)
    return {
      id: r.id,
      revision: r.revision,
      state: 'deleted',
      deleted: true,
      withdrawalPending: pending,
    };
  const history = await stmt(
    db,
    'SELECT revision,content_json,action,at FROM community_revisions WHERE report_id=? ORDER BY revision LIMIT 20',
    r.id,
  ).all<{
    revision: number;
    content_json: string;
    action: string;
    at: number;
  }>();
  const audit = await stmt(
    db,
    'SELECT revision,action,reason,evidence_json,details_json,at FROM community_audit WHERE report_id=? ORDER BY at,id LIMIT 120',
    r.id,
  ).all<{
    revision: number;
    action: string;
    reason: string;
    evidence_json: string | null;
    details_json: string;
    at: number;
  }>();
  return {
    id: r.id,
    revision: r.revision,
    content: JSON.parse(r.content_json),
    state: r.state,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    expiresAt: r.expires_at,
    history: history.results.map((h) => ({
      revision: h.revision,
      content: JSON.parse(h.content_json),
      action: h.action,
      at: h.at,
    })),
    audit: audit.results.map((a) => ({
      revision: a.revision,
      action: a.action,
      reason: a.reason,
      details: JSON.parse(a.details_json),
      evidence: a.evidence_json ? JSON.parse(a.evidence_json) : null,
      at: a.at,
    })),
    withdrawalPending: pending,
  };
}
export async function handleReports(
  request: Request,
  env: ReportsEnv,
  now = Math.floor(Date.now() / 1000),
  admin?: () => Promise<boolean>,
) {
  try {
    const url = new URL(request.url),
      path = url.pathname;
    if (
      request.headers.get('sec-fetch-site') &&
      request.headers.get('sec-fetch-site') !== 'same-origin'
    )
      return reply({ error: 'origin' }, 403);
    if (
      request.method !== 'GET' &&
      request.headers.get('origin') !== url.origin
    )
      return reply({ error: 'origin' }, 403);
    const isReview = path === '/api/admin/reports';
    const match = path.match(/^\/api\/reports\/([a-f0-9]{32})(?:\/(flag))?$/);
    if (
      !isReview &&
      !match &&
      !['/api/reports', '/api/reports/status', '/api/reports/public'].includes(
        path,
      )
    )
      return reply({ error: 'missing' }, 404);
    if (path === '/api/reports/status' && request.method === 'GET') {
      if (url.search) return reply({ error: 'input' }, 400);
      const active =
        env.REPORTS_ENABLED === 'true' || env.REPORTS_PUBLIC_ENABLED === 'true';
      if (
        active &&
        env.REPORTS_DB &&
        env.REPORTS_GUARD &&
        env.REPORTS_GUARD_INSTANCE &&
        env.REPORTS_BUDGET_VERIFIED === 'true' &&
        !(await quota(env.REPORTS_DB, request, 'status', now))
      )
        return reply({ error: 'rate' }, 429);
      const healthy =
        active && (await reportsHealthy(env, now).catch(() => false));
      return reply({
        enabled: healthy && env.REPORTS_ENABLED === 'true',
        publicEnabled: healthy && env.REPORTS_PUBLIC_ENABLED === 'true',
        canDelete:
          !!env.REPORTS_DB &&
          !!env.REPORTS_GUARD &&
          !!env.REPORTS_GUARD_INSTANCE,
      });
    }
    if (
      isReview &&
      (env.REPORTS_REVIEW_ENABLED !== 'true' || !admin || !(await admin()))
    )
      return reply({ error: 'unauthorized' }, 401);
    const db = env.REPORTS_DB;
    if (!db) return reply({ error: 'unavailable' }, 503);
    const deletion = !!match && !match[2] && request.method === 'DELETE';
    const ownerRead = !!match && !match[2] && request.method === 'GET';
    const publicRead =
      path === '/api/reports/public' && request.method === 'GET';
    const flag = !!match?.[2] && request.method === 'POST';
    if (
      !isReview &&
      !deletion &&
      !ownerRead &&
      !(await reportsHealthy(env, now, false))
    )
      return reply({ error: 'unavailable' }, 503);
    if (
      !isReview &&
      !deletion &&
      !ownerRead &&
      (publicRead || flag
        ? env.REPORTS_PUBLIC_ENABLED !== 'true'
        : env.REPORTS_ENABLED !== 'true')
    )
      return reply({ error: 'unavailable' }, 503);
    if (
      !(await quota(
        db,
        request,
        isReview
          ? 'review'
          : deletion
            ? 'delete'
            : flag
              ? 'flag'
              : publicRead
                ? 'public'
                : 'owner',
        now,
      ))
    )
      return reply({ error: 'rate' }, 429);
    if (isReview) return await review(request, db, now, env);
    if (publicRead) {
      if (
        [...url.searchParams.keys()].some(
          (k) => !['game', 'symptom'].includes(k),
        )
      )
        return reply({ error: 'input' }, 400);
      const game = url.searchParams.get('game') || '',
        symptom = url.searchParams.get('symptom') || '';
      if (
        !/^[a-z0-9-]{1,80}$/.test(game) ||
        (symptom && !symptoms.includes(symptom as Content['symptom']))
      )
        return reply({ error: 'input' }, 400);
      const q = await stmt(
        db,
        `SELECT id,revision,public_json,created_at,updated_at FROM community_reports WHERE state='approved' AND approved_revision=revision AND game_slug=? AND (?='' OR symptom=?) AND expires_at>? ORDER BY updated_at DESC,id LIMIT 20`,
        game,
        symptom,
        symptom,
        now,
      ).all<{
        id: string;
        revision: number;
        public_json: string;
        created_at: number;
        updated_at: number;
      }>();
      const guard = await callGuard(env, '/check', {
        ids: q.results.map((r) => r.id),
      });
      if (!guard.ready) return reply({ error: 'unavailable' }, 503);
      return reply({
        reports: q.results
          .filter(
            (r) => guard.known.includes(r.id) && !guard.blocked.includes(r.id),
          )
          .map((r) => ({
            id: r.id,
            revision: r.revision,
            ...JSON.parse(r.public_json),
            postedAt: r.created_at,
            updatedAt: r.updated_at,
          })),
        limit: 20,
      });
    }
    if (url.search) return reply({ error: 'input' }, 400);
    if (flag) {
      const input = await body(request).catch(() => null);
      if (
        !exact(input, ['requestId', 'reason']) ||
        typeof input.requestId !== 'string' ||
        !ID.test(input.requestId) ||
        !reasons.includes(input.reason as (typeof reasons)[number])
      )
        return reply({ error: 'input' }, 400);
      const r = await row(db, match![1]);
      if (!r || r.state !== 'approved' || r.expires_at <= now)
        return reply({ error: 'missing' }, 404);
      const guard = await callGuard(env, '/check', { ids: [r.id] });
      if (!guard.ready) return reply({ error: 'unavailable' }, 503);
      if (!guard.known.includes(r.id) || guard.blocked.includes(r.id))
        return reply({ error: 'missing' }, 404);
      const previous = await stmt(
        db,
        'SELECT report_id,reason FROM community_flags WHERE id=?',
        input.requestId,
      ).first<{ report_id: string; reason: string }>();
      if (previous)
        return previous.report_id === r.id && previous.reason === input.reason
          ? reply({ ok: true })
          : reply({ error: 'conflict' }, 409);
      const f = await stmt(
        db,
        'INSERT OR IGNORE INTO community_flags SELECT ?,?,?,? WHERE (SELECT count(*) FROM community_flags WHERE report_id=?)<20',
        input.requestId,
        r.id,
        input.reason as string,
        now,
        r.id,
      ).run();
      return f.meta.changes === 1
        ? reply({ ok: true }, 201)
        : reply({ error: 'capacity' }, 429);
    }
    const token = request.headers.get('x-report-owner') || '';
    if (!SECRET.test(token)) return reply({ error: 'owner' }, 404);
    const ownerHash = await digest(token);
    if (ownerRead) {
      const r = await row(db, match![1]);
      if (!r || r.owner_hash !== ownerHash || r.expires_at <= now)
        return reply({ error: 'owner' }, 404);
      const guard = await callGuard(env, '/check', { ids: [r.id] });
      if (!guard.known.includes(r.id)) throw Error('unavailable');
      return reply(await ownerView(db, r, now, guard.blocked.includes(r.id)));
    }
    if (
      !['POST', 'PATCH', 'DELETE'].includes(request.method) ||
      (!match && request.method !== 'POST')
    )
      return reply({ error: 'method' }, 405);
    const input = await body(request).catch(() => null);
    const creating = request.method === 'POST';
    if (
      !exact(
        input,
        creating
          ? ['id', 'requestId', 'content', 'consent']
          : deletion
            ? ['requestId']
            : ['requestId', 'content', 'consent', 'revision'],
      ) ||
      typeof input.requestId !== 'string' ||
      !ID.test(input.requestId)
    )
      return reply({ error: 'input' }, 400);
    const id = creating ? input.id : match![1];
    if (
      typeof id !== 'string' ||
      !ID.test(id) ||
      id.slice(8) !== ownerHash.slice(0, 24)
    )
      return reply({ error: 'owner' }, 404);
    const current = await row(db, id),
      issued = parseInt(id.slice(0, 8), 16);
    if (current && current.owner_hash !== ownerHash)
      return reply({ error: 'owner' }, 404);
    if (current && current.expires_at <= now && !deletion)
      return reply({ error: 'expired' }, 410);
    if (deletion) {
      if (!current && issued > now + 300)
        return reply({ error: 'expired' }, 410);
      // Persist the deletion outside D1 before erasing D1's current copy.
      if (issued >= now - 31 * 86400) await callGuard(env, '/delete', { id });
      if (!current && issued < now - 86400)
        return reply({ ok: true, deleted: true, withdrawalPending: false });
      await batch(db, [
        stmt(
          db,
          `INSERT OR IGNORE INTO community_reports SELECT ?,?,1,'','other','{}','deleted',NULL,NULL,?,?,?,? WHERE (SELECT count(*) FROM community_reports)<200`,
          id,
          ownerHash,
          input.requestId,
          now,
          now,
          now + RETENTION_SECONDS,
        ),
        stmt(
          db,
          "UPDATE community_reports SET state='deleted',content_json='{}',public_json=NULL,approved_revision=NULL,updated_at=? WHERE id=? AND owner_hash=?",
          now,
          id,
          ownerHash,
        ),
        stmt(
          db,
          "UPDATE community_revisions SET content_json='{}',payload_hash='' WHERE report_id=?",
          id,
        ),
        stmt(
          db,
          'UPDATE community_audit SET evidence_json=NULL WHERE report_id=?',
          id,
        ),
        stmt(db, 'DELETE FROM community_flags WHERE report_id=?', id),
        stmt(
          db,
          'UPDATE community_article_refs SET withdrawal_at=?,completed_at=NULL WHERE report_id=? AND withdrawal_at IS NULL',
          now,
          id,
        ),
      ]);
      if (!(await row(db, id))) return reply({ error: 'capacity' }, 429);
      return reply({
        ok: true,
        deleted: true,
        withdrawalPending: await withdrawal(db, id),
      });
    }
    const guard = await callGuard(env, '/check', { ids: [id] });
    if (!guard.ready) return reply({ error: 'unavailable' }, 503);
    if (guard.blocked.includes(id)) return reply({ error: 'deleted' }, 409);
    if (current && !guard.known.includes(id)) throw Error('unavailable');
    if (current?.state === 'deleted') return reply({ error: 'deleted' }, 409);
    if (input.consent !== 1) return reply({ error: 'consent' }, 400);
    let content: Content;
    try {
      content = parseContent(input.content, now);
    } catch {
      return reply({ error: 'input' }, 400);
    }
    const json = JSON.stringify(content),
      payloadHash = await digest(json);
    const previous = await stmt(
      db,
      'SELECT payload_hash,action FROM community_revisions WHERE report_id=? AND request_id=?',
      id,
      input.requestId,
    ).first<{ payload_hash: string; action: string }>();
    if (previous)
      return previous.payload_hash === payloadHash &&
        previous.action === (creating ? 'create' : 'update') &&
        current
        ? reply({ ok: true, id, revision: current.revision })
        : reply({ error: 'conflict' }, 409);
    const game = articleReview(content.articlePath)!.gameSlug;
    if (creating) {
      if (current) return reply({ error: 'conflict' }, 409);
      if (issued > now + 300 || issued < now - 86400)
        return reply({ error: 'expired' }, 410);
      await callGuard(env, '/reserve', { id });
      const claim = crypto.randomUUID();
      const r = await batch(db, [
        stmt(
          db,
          `INSERT OR IGNORE INTO community_reports SELECT ?,?,1,?,?,?,'pending',NULL,NULL,?,?,?,? WHERE (SELECT count(*) FROM community_reports)<200 AND EXISTS(SELECT 1 FROM community_operations WHERE key='total' AND value=CAST(CAST(value AS INTEGER) AS TEXT) AND CAST(value AS INTEGER) BETWEEN 0 AND 99)`,
          id,
          ownerHash,
          game,
          content.symptom,
          json,
          claim,
          now,
          now,
          now + RETENTION_SECONDS,
        ),
        stmt(
          db,
          "INSERT OR IGNORE INTO community_revisions SELECT id,revision,?,?,content_json,?,? FROM community_reports WHERE id=? AND last_request=? AND owner_hash=? AND state='pending'",
          input.requestId,
          payloadHash,
          'create',
          now,
          id,
          claim,
          ownerHash,
        ),
        stmt(
          db,
          `UPDATE community_operations SET value=CAST(CAST(value AS INTEGER)+1 AS TEXT) WHERE key='total' AND EXISTS(SELECT 1 FROM community_reports WHERE id=? AND owner_hash=? AND last_request=?)`,
          id,
          ownerHash,
          claim,
        ),
      ]);
      return r[0].meta.changes === 1
        ? reply({ ok: true, id, revision: 1 }, 201)
        : reply({ error: 'capacity' }, 429);
    }
    if (!current) return reply({ error: 'owner' }, 404);
    if (!Number.isInteger(input.revision))
      return reply({ error: 'input' }, 400);
    if (input.revision !== current.revision)
      return reply({ error: 'revision-conflict' }, 409);
    if (current.revision >= MAX_REVISIONS)
      return reply({ error: 'capacity' }, 429);
    const r = await batch(db, [
      stmt(
        db,
        `UPDATE community_reports SET revision=revision+1,game_slug=?,symptom=?,content_json=?,state='pending',public_json=NULL,approved_revision=NULL,last_request=?,updated_at=? WHERE id=? AND owner_hash=? AND revision=? AND state<>'deleted'`,
        game,
        content.symptom,
        json,
        input.requestId,
        now,
        id,
        ownerHash,
        current.revision,
      ),
      stmt(
        db,
        `INSERT OR IGNORE INTO community_revisions SELECT id,revision,?,?,content_json,'update',? FROM community_reports WHERE id=? AND owner_hash=? AND revision=? AND last_request=?`,
        input.requestId,
        payloadHash,
        now,
        id,
        ownerHash,
        current.revision + 1,
        input.requestId,
      ),
      stmt(
        db,
        'UPDATE community_article_refs SET withdrawal_at=?,completed_at=NULL WHERE report_id=? AND changes()>0 AND EXISTS(SELECT 1 FROM community_reports WHERE id=? AND last_request=?)',
        now,
        id,
        id,
        input.requestId,
      ),
    ]);
    if (r[0].meta.changes === 1)
      return reply({
        ok: true,
        id,
        revision: current.revision + 1,
        withdrawalPending: await withdrawal(db, id),
      });
    // Another tab can accept this exact retry after our preflight reads.
    // Only a different operation proves that this proposed edit was rejected.
    const accepted = await stmt(
      db,
      `SELECT v.payload_hash,v.action,v.revision,r.state FROM community_revisions v JOIN community_reports r ON r.id=v.report_id WHERE v.report_id=? AND v.request_id=? AND r.owner_hash=?`,
      id,
      input.requestId,
      ownerHash,
    ).first<{
      payload_hash: string;
      action: string;
      revision: number;
      state: string;
    }>();
    if (accepted)
      return accepted.payload_hash === payloadHash &&
        accepted.action === 'update' &&
        accepted.state !== 'deleted'
        ? reply({
            ok: true,
            id,
            revision: accepted.revision,
            withdrawalPending: await withdrawal(db, id),
          })
        : reply({ error: 'conflict' }, 409);
    return (await row(db, id))?.state === 'deleted'
      ? reply({ error: 'deleted' }, 409)
      : reply({ error: 'revision-conflict' }, 409);
  } catch (error) {
    if (error instanceof GuardFailure)
      return reply({ error: error.message }, error.status);
    return reply({ error: 'unavailable' }, 503);
  }
}
async function review(
  request: Request,
  db: D1Database,
  now: number,
  env: ReportsEnv,
) {
  const url = new URL(request.url);
  if (request.method !== 'GET' && url.search)
    return reply({ error: 'input' }, 400);
  if (request.method === 'GET') {
    if (
      [...url.searchParams.keys()].some((k) => !['all', 'before'].includes(k))
    )
      return reply({ error: 'input' }, 400);
    const cursor = url.searchParams.get('before') || '';
    if (cursor && !/^[0-9]{1,11}:[a-f0-9]{32}$/.test(cursor))
      return reply({ error: 'input' }, 400);
    const [at, id] = cursor.split(':');
    const rows = await stmt(
      db,
      `SELECT id,updated_at FROM community_reports WHERE ((expires_at>? AND (state='pending' OR state='hidden' OR (?=1 AND state<>'deleted') OR EXISTS(SELECT 1 FROM community_flags WHERE report_id=community_reports.id))) OR EXISTS(SELECT 1 FROM community_article_refs WHERE report_id=community_reports.id AND withdrawal_at IS NOT NULL AND completed_at IS NULL)) AND (?='' OR updated_at<? OR (updated_at=? AND id<?)) ORDER BY updated_at DESC,id DESC LIMIT 6`,
      now,
      url.searchParams.get('all') === 'true' ? 1 : 0,
      cursor,
      Number(at) || now + 1,
      Number(at) || now + 1,
      id || '',
    ).all<{ id: string; updated_at: number }>();
    const reports = [];
    const guard = await callGuard(env, '/check', {
      ids: rows.results.map((r) => r.id),
    });
    for (const r of rows.results) {
      const current = await row(db, r.id);
      if (current)
        reports.push({
          ...(await ownerView(
            db,
            current,
            now,
            guard.blocked.includes(r.id) || !guard.known.includes(r.id),
          )),
          flags: (
            await stmt(
              db,
              'SELECT reason,count(*) AS count FROM community_flags WHERE report_id=? GROUP BY reason',
              r.id,
            ).all()
          ).results,
          references: (
            await stmt(
              db,
              'SELECT article_path,revision,withdrawal_at,completed_at FROM community_article_refs WHERE report_id=?',
              r.id,
            ).all()
          ).results,
        });
    }
    const last = rows.results[4];
    return reply({
      reports: reports.slice(0, 5),
      next:
        rows.results.length > 5 && last
          ? `${last.updated_at}:${last.id}`
          : null,
    });
  }
  if (request.method !== 'PATCH') return reply({ error: 'method' }, 405);
  const input = await body(request).catch(() => null);
  if (
    !exact(input, [
      'id',
      'revision',
      'requestId',
      'action',
      'reason',
      'evidence',
      'articlePath',
      'duplicateOf',
      'redactOptional',
    ]) ||
    typeof input.id !== 'string' ||
    !ID.test(input.id) ||
    typeof input.requestId !== 'string' ||
    !ID.test(input.requestId) ||
    !reasons.includes(input.reason as (typeof reasons)[number]) ||
    (input.redactOptional !== undefined &&
      typeof input.redactOptional !== 'boolean')
  )
    return reply({ error: 'input' }, 400);
  // Current consent does not authorize article republication. No feature flag
  // can enable it; a separate consent contract must be implemented and reviewed.
  if (input.action === 'cite')
    return reply({ error: 'republication-disabled' }, 403);
  const current = await row(db, input.id);
  if (!current || (current.expires_at <= now && input.action !== 'withdrawn'))
    return reply({ error: 'missing' }, 404);
  const ledgerStatus = await callGuard(env, '/check', { ids: [input.id] });
  if (
    input.action !== 'withdrawn' &&
    (!ledgerStatus.known.includes(input.id) ||
      ledgerStatus.blocked.includes(input.id))
  )
    return reply({ error: 'deleted' }, 409);
  const requestHash = await digest(JSON.stringify(input));
  const previous = await stmt(
    db,
    'SELECT action,revision,request_hash FROM community_audit WHERE id=? AND report_id=?',
    input.requestId,
    input.id,
  ).first<{ action: string; revision: number; request_hash: string }>();
  if (previous)
    return previous.action === input.action &&
      previous.revision === input.revision &&
      previous.request_hash === requestHash
      ? reply({ ok: true })
      : reply({ error: 'conflict' }, 409);
  if (input.revision !== current.revision)
    return reply({ error: 'conflict' }, 409);
  if (
    input.action !== 'withdrawn' &&
    (await stmt(
      db,
      "SELECT count(*) AS n FROM community_audit WHERE report_id=? AND action<>'withdrawn'",
      input.id,
    ).first<{ n: number }>())!.n >= 60
  )
    return reply({ error: 'capacity' }, 429);
  const action = input.action;
  let evidence: Evidence | null = null,
    update: D1PreparedStatement;
  if (action === 'withdrawn') {
    if (typeof input.articlePath !== 'string')
      return reply({ error: 'input' }, 400);
    update = stmt(
      db,
      'UPDATE community_article_refs SET completed_at=? WHERE report_id=? AND article_path=? AND withdrawal_at IS NOT NULL AND completed_at IS NULL',
      now,
      input.id,
      input.articlePath,
    );
  } else {
    if (current.state === 'deleted') return reply({ error: 'deleted' }, 409);
    if (action === 'approve') {
      if (!ledgerStatus.ready || !(await reportsHealthy(env, now, false)))
        return reply({ error: 'unavailable' }, 503);
      try {
        evidence = parseEvidence(input.evidence, now);
      } catch {
        return reply({ error: 'evidence' }, 400);
      }
      const content = JSON.parse(current.content_json) as Content;
      const publicContent =
        input.redactOptional !== false
          ? {
              ...content,
              version: '',
              os: 'unknown',
              gpu: 'unknown',
              sources: [],
            }
          : content;
      const publicJson = JSON.stringify({ content: publicContent, evidence });
      update = stmt(
        db,
        "UPDATE community_reports SET state='approved',approved_revision=revision,public_json=? WHERE id=? AND revision=? AND state<>'deleted'",
        publicJson,
        input.id,
        current.revision,
      );
    } else if (action === 'hide' || action === 'reject') {
      if (input.reason === 'duplicate') {
        if (
          typeof input.duplicateOf !== 'string' ||
          input.duplicateOf === current.id
        )
          return reply({ error: 'input' }, 400);
        const target = await row(db, input.duplicateOf);
        if (
          !target ||
          target.game_slug !== current.game_slug ||
          target.symptom !== current.symptom ||
          target.state !== 'approved'
        )
          return reply({ error: 'input' }, 400);
      }
      update = stmt(
        db,
        "UPDATE community_reports SET state=? WHERE id=? AND revision=? AND state<>'deleted'",
        action === 'hide' ? 'hidden' : 'rejected',
        input.id,
        current.revision,
      );
    } else if (action === 'restore') {
      if (
        !ledgerStatus.ready ||
        !(await reportsHealthy(env, now, false)) ||
        current.state !== 'hidden' ||
        current.approved_revision !== current.revision ||
        !current.public_json
      )
        return reply({ error: 'review-required' }, 409);
      update = stmt(
        db,
        "UPDATE community_reports SET state='approved' WHERE id=? AND state='hidden' AND revision=? AND approved_revision=revision",
        input.id,
        current.revision,
      );
    } else return reply({ error: 'input' }, 400);
  }
  // Every state mutation and its audit record commit together. The read revision
  // can change while awaiting SQL; each mutation must recheck the revision/state.
  const claimed = crypto.randomUUID();
  const guard = stmt(
    db,
    `INSERT INTO community_operations(key,value) SELECT ?,? WHERE EXISTS(SELECT 1 FROM community_reports WHERE id=? AND revision=? AND (?='withdrawn' OR state<>'deleted')) AND (?='withdrawn' OR (SELECT count(*) FROM community_audit WHERE report_id=? AND action<>'withdrawn')<60)`,
    claimed,
    '1',
    current.id,
    current.revision,
    String(action),
    String(action),
    current.id,
  );
  // SQL operations below execute in one transaction; guard failure rolls back
  // by a NOT NULL constraint sentinel rather than allowing an unchecked mutation.
  const checked = stmt(
    db,
    `INSERT INTO community_operations(key,value) SELECT ?,NULL WHERE NOT EXISTS(SELECT 1 FROM community_operations WHERE key=?)`,
    claimed,
    claimed,
  );
  const r = await batch(db, [
    guard,
    checked,
    update,
    stmt(
      db,
      'INSERT INTO community_audit SELECT ?,?,?,?,?,?,?,?,?,? WHERE changes()>0',
      input.requestId,
      current.id,
      current.revision,
      String(action),
      input.reason as string,
      evidence ? JSON.stringify(evidence) : null,
      'existing-admin',
      now,
      requestHash,
      JSON.stringify({
        ...(typeof input.articlePath === 'string'
          ? { articlePath: input.articlePath }
          : {}),
        ...(typeof input.duplicateOf === 'string'
          ? { duplicateOf: input.duplicateOf }
          : {}),
        ...(input.redactOptional !== undefined
          ? { redactOptional: input.redactOptional }
          : {}),
      }),
    ),
    ...(action === 'approve' || action === 'hide' || action === 'reject'
      ? [
          stmt(
            db,
            "UPDATE community_article_refs SET withdrawal_at=?,completed_at=NULL WHERE report_id=? AND EXISTS(SELECT 1 FROM community_reports WHERE id=? AND revision=? AND state IN ('approved','hidden','rejected'))",
            now,
            current.id,
            current.id,
            current.revision,
          ),
        ]
      : []),
    stmt(db, 'DELETE FROM community_operations WHERE key=?', claimed),
  ]);
  return r[2].meta.changes
    ? reply({ ok: true })
    : reply({ error: 'conflict' }, 409);
}
export { cleanupReports } from './retention';
