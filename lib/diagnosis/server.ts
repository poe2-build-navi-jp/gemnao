import { previewRequestAllowed } from '../preview/origin';
import { RULE_VERSION, statuses } from './model';
import { actions } from './rules';
import {
  buildSnapshot,
  validateStatuses,
  record,
  exactKeys,
  type Snapshot,
} from './validation';
export type DiagnosisEnv = {
  // Diagnosis data must never use the ordinary site DB binding.
  DIAGNOSIS_DB?: D1Database;
  DIAGNOSIS_ENABLED?: string;
  DIAGNOSIS_LOCAL_BETA?: string;
  DIAGNOSIS_PREVIEW_SHARING_ENABLED?: string;
  DIAGNOSIS_PREVIEW_ORIGIN?: string;
  DIAGNOSIS_STORAGE_ENABLED?: string;
  DIAGNOSIS_SHARING_ENABLED?: string;
  DIAGNOSIS_WRITES_ENABLED?: string;
  DIAGNOSIS_METRICS_ENABLED?: string;
};
export const previewSharingAllowed = (request: Request, env: DiagnosisEnv) =>
  previewRequestAllowed(request, env.DIAGNOSIS_PREVIEW_SHARING_ENABLED, env.DIAGNOSIS_PREVIEW_ORIGIN);

export const diagnosisCollectionAllowed = (request: Request, env: DiagnosisEnv) =>
  (env.DIAGNOSIS_LOCAL_BETA !== 'true' && env.DIAGNOSIS_PREVIEW_SHARING_ENABLED === undefined && env.DIAGNOSIS_PREVIEW_ORIGIN === undefined) || previewSharingAllowed(request, env);

const TTL = 30 * 86400000;
const COOKIE = '__Host-gemnao-diagnosis';
const ID = /^[a-f0-9]{32}$/;
const SECRET = /^[a-f0-9]{64}$/;
const headers = {
  'Cache-Control': 'private, no-store',
  'X-Robots-Tag': 'noindex, nofollow',
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
  Vary: 'Cookie',
};
export const privateHeaders = headers;
const reply = (
  body: unknown,
  status = 200,
  extra: Record<string, string> = {},
) => Response.json(body, { status, headers: { ...headers, ...extra } });
const fail = (status: number, message: string) =>
  reply({ error: message }, status);
const random = (bytes: number) =>
  Array.from(crypto.getRandomValues(new Uint8Array(bytes)), (b) =>
    b.toString(16).padStart(2, '0'),
  ).join('');
const hash = async (value: string) =>
  Array.from(
    new Uint8Array(
      await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)),
    ),
    (b) => b.toString(16).padStart(2, '0'),
  ).join('');
const owner = (request: Request) =>
  request.headers
    .get('Cookie')
    ?.split(';')
    .map((x) => x.trim())
    .find((x) => x.startsWith(COOKIE + '='))
    ?.slice(COOKIE.length + 1) || '';
const setCookie = (token: string) =>
  `${COOKIE}=${token}; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=2592000`;
const enabled = (env: DiagnosisEnv) => env.DIAGNOSIS_ENABLED === 'true';
const sharing = (env: DiagnosisEnv) =>
  enabled(env) && env.DIAGNOSIS_SHARING_ENABLED === 'true';
const writes = (env: DiagnosisEnv) =>
  sharing(env) && env.DIAGNOSIS_WRITES_ENABLED !== 'false';
export type ShareRow = {
  id: string;
  owner_hash: string;
  recovery_hash: string;
  request_id: string;
  snapshot: string;
  rule_version: string;
  created_at: number;
  updated_at: number;
  expires_at: number;
  revoked_at: number | null;
  revision: number;
};
const active = (row: ShareRow | null, now: number) =>
  !!row && !row.revoked_at && row.expires_at > now;
export async function readShare(
  db: D1Database,
  id: string,
  _now = Date.now(),
): Promise<ShareRow | null> {
  if (!ID.test(id)) return null;
  return db
    .prepare('SELECT * FROM diagnosis_shared WHERE id = ?')
    .bind(id)
    .first<ShareRow>();
}
export async function cleanupReady(db: D1Database, now = Date.now()) {
  const row = await db
    .prepare(
      "SELECT value FROM diagnosis_operations WHERE key = 'cleanup_success'",
    )
    .first<{ value: string }>();
  const at = Number(row?.value);
  return Number.isFinite(at) && at <= now + 60000 && now - at < 2 * 3600000;
}
/** No user-provided free text, network address, owner token, recovery hash or key in this DTO. */
const publicShare = (row: ShareRow) => ({
  id: row.id,
  snapshot: JSON.parse(row.snapshot) as Snapshot,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  expiresAt: row.expires_at,
  revision: row.revision,
});
async function bodyOf(request: Request): Promise<unknown> {
  if (request.headers.get('Content-Type')?.split(';')[0] !== 'application/json')
    throw new Error('input');
  if (Number(request.headers.get('Content-Length') || 0) > 16384)
    throw new Error('size');
  const reader = request.body?.getReader();
  if (!reader) throw new Error('input');
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const part = await reader.read();
    if (part.done) break;
    size += part.value.length;
    if (size > 16384) {
      await reader.cancel();
      throw new Error('size');
    }
    chunks.push(part.value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }
  return JSON.parse(new TextDecoder().decode(bytes));
}
function sameOrigin(request: Request) {
  const url = new URL(request.url);
  return (
    request.headers.get('Origin') === url.origin &&
    request.headers.get('X-Diagnosis-Request') === '1' &&
    (!request.headers.has('Sec-Fetch-Site') ||
      request.headers.get('Sec-Fetch-Site') === 'same-origin')
  );
}
async function limited(
  db: D1Database,
  key: string,
  limit: number,
  expires: number,
) {
  const row = await db
    .prepare(
      'INSERT INTO diagnosis_rate_limits (key,count,expires_at) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count = count + 1 WHERE count < ? RETURNING count',
    )
    .bind(key, expires, limit)
    .first<{ count: number }>();
  return !!row;
}
/** HMAC address for a ten-minute rate window only; never keep the raw IP. Random daily salts expire. */
async function rate(
  db: D1Database,
  request: Request,
  kind: string,
  limit: number,
  now: number,
) {
  const day = Math.floor(now / 86400000),
    window = Math.floor(now / 600000);
  const globalOk = await limited(
    db,
    `global:${kind}:${day}`,
    kind === 'create' ? 200 : kind === 'event' ? 10000 : 10000,
    (day + 2) * 86400000,
  );
  if (!globalOk) return false;
  await db
    .prepare(
      'INSERT OR IGNORE INTO diagnosis_operations (key,value,expires_at) VALUES (?,?,?)',
    )
    .bind(`salt:${day}`, random(32), (day + 2) * 86400000)
    .run();
  const salt = await db
    .prepare('SELECT value FROM diagnosis_operations WHERE key = ?')
    .bind(`salt:${day}`)
    .first<{ value: string }>();
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(salt!.value),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  // Cloudflare overwrites CF-Connecting-IP. Local previews use the shared local bucket.
  const ip = request.headers.get('CF-Connecting-IP') || 'local';
  const digest = Array.from(
    new Uint8Array(
      await crypto.subtle.sign(
        'HMAC',
        key,
        new TextEncoder().encode(`${window}:${ip}`),
      ),
    ),
    (b) => b.toString(16).padStart(2, '0'),
  ).join('');
  return limited(db, `${kind}:${window}:${digest}`, limit, now + 86400000);
}
const rateFail = () =>
  reply(
    { error: '操作回数が多いため、時間を空けて再試行してください。' },
    429,
    { 'Retry-After': '600' },
  );
async function count(
  db: D1Database,
  event: string,
  step = 'none',
  action = 'none',
  status = 'none',
  now = Date.now(),
) {
  await db
    .prepare(
      'INSERT INTO diagnosis_metrics (day,event,step,action,status,count) VALUES (?,?,?,?,?,1) ON CONFLICT(day,event,step,action,status) DO UPDATE SET count=count+1',
    )
    .bind(new Date(now).toISOString().slice(0, 10), event, step, action, status)
    .run();
}
export async function handleDiagnosis(
  request: Request,
  env: DiagnosisEnv,
  now = Date.now(),
): Promise<Response> {
  const path = new URL(request.url).pathname.replace(/^\/api\/diagnosis/, '');
  const previewSharing = previewSharingAllowed(request, env);
  const collectionAllowed = diagnosisCollectionAllowed(request, env);
  const writesEnabled = writes(env) && (!previewSharing || env.DIAGNOSIS_WRITES_ENABLED === 'true');
  const localOnly = env.DIAGNOSIS_LOCAL_BETA === 'true' && !previewSharing;
  // Preview QA never records events, even if an old metrics flag is present.
  const metricsEnabled = !previewSharing && env.DIAGNOSIS_METRICS_ENABLED === 'true';
  // Production/local config stays storage-free under conflicting stale flags.
  if (path === '/config' && request.method === 'GET' && localOnly)
    return reply({ enabled: true, sharing: false, metrics: false, localOnly: true });
  if (path === '/config' && request.method === 'GET' && !collectionAllowed)
    return reply({ enabled: enabled(env), sharing: false, metrics: false });
  const db = env.DIAGNOSIS_STORAGE_ENABLED === 'true' ? env.DIAGNOSIS_DB : undefined;
  try {
    if (path === '/config' && request.method === 'GET') {
      let ready = false;
      if (
        db &&
        enabled(env) &&
        (writesEnabled || metricsEnabled)
      )
        ready = await cleanupReady(db, now).catch(() => false);
      return reply({
        enabled: enabled(env),
        sharing: writesEnabled && ready,
        metrics:
          ready && enabled(env) && metricsEnabled,
        ...(previewSharing ? { localOnly: false, previewSharing: true } : {}),
      });
    }
    if (!db)
      return fail(503, '保存機能は準備中です。端末内の診断は利用できます。');
    const match = path.match(/^\/([a-f0-9]{32})(?:\/(owner|recover|revoke))?$/);
    const administrative =
      (match && ['owner', 'recover', 'revoke'].includes(match[2])) ||
      (!!match && request.method === 'DELETE');
    if (!administrative && (!collectionAllowed || !enabled(env)))
      return fail(503, '診断機能は現在停止しています。');
    if (request.method === 'GET') {
      if (!match) return fail(404, '見つかりません。');
      if (match[2] && match[2] !== 'owner')
        return fail(405, 'この操作は利用できません。');
      if (!match[2] && !sharing(env))
        return fail(503, '共有機能は現在停止しています。');
      if (!(await rate(db, request, 'read', 120, now))) return rateFail();
      const row = await readShare(db, match[1], now);
      if (match[2] === 'owner') {
        const token = owner(request);
        if (
          !SECRET.test(token) ||
          !row ||
          (await hash(token)) !== row.owner_hash
        )
          return fail(403, 'このブラウザには管理権限がありません。');
        if (!active(row, now))
          return reply({
            id: row.id,
            inactive: true,
            expired: row.expires_at <= now,
            expiresAt: row.expires_at,
            revoked: !!row.revoked_at,
          });
      } else if (!active(row, now))
        return fail(
          404,
          '共有ページは見つからないか、期限切れ・失効・削除されています。',
        );
      return reply(publicShare(row!));
    }
    if (!['POST', 'PATCH', 'DELETE'].includes(request.method))
      return fail(405, 'この操作は利用できません。');
    if (!sameOrigin(request))
      return fail(403, '同じサイトから操作してください。');
    let input: unknown;
    try {
      input = await bodyOf(request);
    } catch {
      return fail(400, '入力形式またはサイズが正しくありません。');
    }
    if (!record(input)) return fail(400, '入力が正しくありません。');
    if (path === '/events' && request.method === 'POST') {
      if (!metricsEnabled)
        return reply({ ok: true, recorded: false });
      if (
        !exactKeys(input, ['event', 'step', 'action', 'status']) ||
        ![
          'start',
          'complete',
          'step',
          'leave',
          'article',
          'record',
          'copy',
        ].includes(String(input.event)) ||
        ![
          'none',
          'symptom',
          'scope',
          'observation',
          'error',
          'change',
          'launcher',
          'environment',
          'game',
          'tried',
        ].includes(String(input.step)) ||
        (input.action !== 'none' &&
          !Object.hasOwn(actions, String(input.action))) ||
        (input.status !== 'none' &&
          !Object.hasOwn(statuses, String(input.status)))
      )
        return fail(400, '入力が正しくありません。');
      if (!(await cleanupReady(db, now)))
        return fail(503, '保存期間を守るため、集計を一時停止しています。');
      if (!(await rate(db, request, 'event', 100, now))) return rateFail();
      await count(
        db,
        String(input.event),
        String(input.step),
        String(input.action),
        String(input.status),
        now,
      );
      return reply({ ok: true });
    }
    if (!administrative && !writesEnabled)
      return fail(503, '共有の作成・更新は現在停止しています。');
    if (
      (path === '' || path === '/session' || request.method === 'PATCH') &&
      !(await cleanupReady(db, now))
    )
      return fail(
        503,
        '保存期間を守るため、共有の作成・更新を一時停止しています。',
      );
    if (path === '/session' && request.method === 'POST') {
      if (!exactKeys(input, [])) return fail(400, '入力が正しくありません。');
      if (!(await rate(db, request, 'session', 10, now))) return rateFail();
      const current = owner(request),
        token = SECRET.test(current) ? current : random(32);
      return reply({ ok: true }, 200, { 'Set-Cookie': setCookie(token) });
    }
    if (path === '' && request.method === 'POST') {
      if (
        !exactKeys(input, ['snapshot', 'requestId']) ||
        typeof input.requestId !== 'string' ||
        !ID.test(input.requestId)
      )
        return fail(400, '入力が正しくありません。');
      const snapshot = buildSnapshot(input.snapshot);
      if (!snapshot)
        return fail(400, '回答やルール版を確認し、診断をやり直してください。');
      const token = owner(request);
      if (!SECRET.test(token))
        return fail(403, '管理用セッションを準備してから再試行してください。');
      const ownerHash = await hash(token);
      const previous = await db
        .prepare(
          'SELECT * FROM diagnosis_shared WHERE owner_hash = ? AND request_id = ?',
        )
        .bind(ownerHash, input.requestId)
        .first<ShareRow>();
      if (previous) {
        if (!active(previous, now))
          return fail(
            409,
            'この共有操作はすでに終了しています。新しい診断から作成してください。',
          );
        return reply({
          ...publicShare(previous),
          recoveryKey: null,
          repeated: true,
        });
      }
      if (!(await rate(db, request, 'create', 5, now))) return rateFail();
      const id = random(16),
        recovery = random(32);
      await db
        .prepare(
          'INSERT INTO diagnosis_shared (id,owner_hash,recovery_hash,request_id,snapshot,rule_version,created_at,updated_at,expires_at,revision) VALUES (?,?,?,?,?,?,?,?,?,1)',
        )
        .bind(
          id,
          ownerHash,
          await hash(recovery),
          input.requestId,
          JSON.stringify(snapshot),
          RULE_VERSION,
          now,
          now,
          now + TTL,
        )
        .run();
      if (metricsEnabled)
        await count(db, 'create', 'none', 'none', 'none', now).catch(() => {});
      return reply(
        {
          id,
          createdAt: now,
          updatedAt: now,
          expiresAt: now + TTL,
          revision: 1,
          recoveryKey: recovery,
        },
        201,
      );
    }
    if (!match) return fail(404, '見つかりません。');
    if (
      !(await rate(
        db,
        request,
        match[2] === 'recover' ? 'recover' : 'manage',
        match[2] === 'recover' ? 5 : 60,
        now,
      ))
    )
      return rateFail();
    const row = await readShare(db, match[1], now);
    if (!row) return fail(404, '共有ページは見つかりません。');
    if (match[2] === 'recover' && request.method === 'POST') {
      if (
        !exactKeys(input, ['key']) ||
        typeof input.key !== 'string' ||
        !SECRET.test(input.key) ||
        (await hash(input.key)) !== row.recovery_hash
      )
        return fail(403, '管理キーを確認してください。');
      const current = owner(request),
        token = SECRET.test(current) ? current : random(32);
      await db
        .prepare('UPDATE diagnosis_shared SET owner_hash = ? WHERE id = ?')
        .bind(await hash(token), row.id)
        .run();
      return reply({ ok: true }, 200, { 'Set-Cookie': setCookie(token) });
    }
    const token = owner(request);
    if (!SECRET.test(token) || (await hash(token)) !== row.owner_hash)
      return fail(403, 'このブラウザには管理権限がありません。');
    if (request.method === 'DELETE' && !match[2]) {
      if (!exactKeys(input, [])) return fail(400, '入力が正しくありません。');
      await db
        .prepare('DELETE FROM diagnosis_shared WHERE id = ? AND owner_hash = ?')
        .bind(row.id, row.owner_hash)
        .run();
      return reply({ ok: true });
    }
    if (match[2] === 'revoke' && request.method === 'POST') {
      if (!exactKeys(input, [])) return fail(400, '入力が正しくありません。');
      // Immediate access revocation; discard the snapshot to minimize retained data.
      await db
        .prepare(
          "UPDATE diagnosis_shared SET revoked_at = ?, snapshot = '{}', updated_at = ?, revision = revision + 1 WHERE id = ? AND owner_hash = ?",
        )
        .bind(now, now, row.id, row.owner_hash)
        .run();
      return reply({ ok: true });
    }
    if (request.method === 'PATCH' && !match[2]) {
      if (!active(row, now))
        return fail(404, '期限切れまたは失効した共有は更新できません。');
      if (
        !exactKeys(input, ['results', 'revision']) ||
        !Number.isInteger(input.revision)
      )
        return fail(400, '入力が正しくありません。');
      const results = validateStatuses(input.results);
      const snapshot = JSON.parse(row.snapshot) as Snapshot;
      const allowed = new Set([
        ...Object.keys(snapshot.tried),
        ...snapshot.result.recommendations.map((r) => r.action.id),
      ]);
      if (!results || Object.keys(results).some((k) => !allowed.has(k)))
        return fail(400, '対処の記録が正しくありません。');
      snapshot.results = results;
      const updated = await db
        .prepare(
          'UPDATE diagnosis_shared SET snapshot = ?, updated_at = ?, revision = revision + 1 WHERE id = ? AND owner_hash = ? AND revision = ? AND revoked_at IS NULL AND expires_at > ? RETURNING revision',
        )
        .bind(
          JSON.stringify(snapshot),
          now,
          row.id,
          row.owner_hash,
          input.revision,
          now,
        )
        .first<{ revision: number }>();
      if (!updated)
        return fail(
          409,
          '別の操作で更新されています。再読み込みして内容を確認してください。',
        );
      return reply({
        ok: true,
        revision: updated.revision,
        updatedAt: now,
        expiresAt: row.expires_at,
      });
    }
    return fail(405, 'この操作は利用できません。');
  } catch {
    // Deliberately no request bodies, cookies, IPs, keys or SQL in logs/responses.
    return fail(
      503,
      '保存機能を利用できません。入力は残っています。時間を空けて再試行してください。',
    );
  }
}
export { cleanupDiagnosis } from './cleanup';
export const isShareActive = active;
