// Isolated private inbox; reuses audited feedback receipt/quota design. No shared admission ledger.
import { parseEnvelope } from './contract';
import { strictJson } from '../diagnostic-feedback/json';
import { takeFeedbackQuota } from '../diagnostic-feedback/rate-limit';
export type PrivateDiagnosticEnv = {
  PRIVATE_DIAGNOSTIC_ENABLED?: string;
  PRIVATE_DIAGNOSTIC_DB?: D1Database;
  PRIVATE_DIAGNOSTIC_OWNER_REVIEW_ENABLED?: string;
};
export const privateHeaders = {
  'Cache-Control': 'private, no-store',
  'X-Robots-Tag': 'noindex, nofollow, noarchive',
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
  'Content-Type': 'application/json',
};
const reply = (value: unknown, status = 200) =>
  new Response(JSON.stringify(value), { status, headers: privateHeaders });
const hash = async (s: string) =>
  Array.from(
    new Uint8Array(
      await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)),
    ),
  )
    .map((v) => v.toString(16).padStart(2, '0'))
    .join('');
export async function healthy(env: PrivateDiagnosticEnv, now: number) {
  if (
    env.PRIVATE_DIAGNOSTIC_ENABLED !== 'true' ||
    env.PRIVATE_DIAGNOSTIC_OWNER_REVIEW_ENABLED !== 'true' ||
    !env.PRIVATE_DIAGNOSTIC_DB
  )
    return false;
  const row = await env.PRIVATE_DIAGNOSTIC_DB.prepare(
    'SELECT last_cleanup FROM diagnostic_retention_health WHERE singleton=1',
  ).first<{ last_cleanup: number }>();
  return !!row && row.last_cleanup <= now && row.last_cleanup >= now - 7200;
}
async function body(request: Request) {
  if (
    !request.headers
      .get('content-type')
      ?.toLowerCase()
      .startsWith('application/json')
  )
    throw new Error('type');
  if (
    Number(request.headers.get('content-length') || 0) > 6144 ||
    !request.body
  )
    throw new Error('size');
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    length += value.length;
    if (length > 6144) {
      await reader.cancel();
      throw new Error('size');
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const c of chunks) {
    bytes.set(c, offset);
    offset += c.length;
  }
  return strictJson(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
}
export async function handlePrivateDiagnostic(
  request: Request,
  env: PrivateDiagnosticEnv,
  now = Math.floor(Date.now() / 1000),
): Promise<Response> {
  try {
    if (!['GET', 'POST', 'DELETE'].includes(request.method))
      return reply({ error: 'method' }, 405);
    // Browser same-origin only. No CORS, no URL payload, and no cookie credentials.
    if (
      new URL(request.url).search ||
      (request.method !== 'GET' &&
        request.headers.get('origin') !== new URL(request.url).origin) ||
      (request.headers.get('sec-fetch-site') &&
        request.headers.get('sec-fetch-site') !== 'same-origin')
    )
      return reply({ error: 'origin' }, 403);
    if (!env.PRIVATE_DIAGNOSTIC_DB)
      return request.method === 'GET'
        ? reply({ enabled: false, canDelete: false })
        : reply({ error: '受付は準備中です' }, 503);
    // A verified isolated binding permits owner deletion even while intake is stopped.
    if (env.PRIVATE_DIAGNOSTIC_ENABLED !== 'true') {
      if (request.method === 'GET')
        return reply({ enabled: false, canDelete: true });
      if (request.method === 'POST')
        return reply({ error: '受付は準備中です' }, 503);
    }
    // Only an edge-supplied address is used transiently; D1 stores a daily HMAC.
    // GET/POST share intake quota; neither can consume DELETE quota.
    if (
      !(await takeFeedbackQuota(
        env.PRIVATE_DIAGNOSTIC_DB,
        request.method === 'DELETE' ? 'delete' : 'intake',
        request.headers.get('cf-connecting-ip'),
      ))
    )
      return reply(
        {
          error: '時間を空けてください',
          ...(request.method === 'GET'
            ? { enabled: false, canDelete: true }
            : {}),
        },
        429,
      );
    // Cleanup failure must stop collection, not the owner's removal request.
    if (request.method !== 'DELETE') {
      const ready = await healthy(env, now).catch(() => false);
      if (request.method === 'GET')
        return reply({ enabled: ready, canDelete: true });
      if (!ready) return reply({ error: '受付は準備中です' }, 503);
    }
    let input;
    try {
      input = parseEnvelope(await body(request), request.method === 'DELETE');
    } catch {
      return reply({ error: '入力形式が不正です（最大6KB）' }, 400);
    }
    const db = env.PRIVATE_DIAGNOSTIC_DB;
    const keyHash = await hash(input.delete_key);
    if (input.receipt_id.slice(8) !== keyHash.slice(0, 24))
      return reply({ error: '受付番号と削除キーが一致しません' }, 409);
    if (request.method === 'DELETE') {
      if (
        await db
          .prepare(
            'SELECT receipt_id FROM diagnostic_report_tombstones WHERE receipt_id=? AND delete_hash=?',
          )
          .bind(input.receipt_id, keyHash)
          .first()
      )
        return reply({ ok: true });
      const issued = parseInt(input.receipt_id.slice(0, 8), 16);
      const existing = await db
        .prepare(
          'SELECT receipt_id FROM diagnostic_reports WHERE receipt_id=? AND delete_hash=?',
        )
        .bind(input.receipt_id, keyHash)
        .first();
      if (!existing && (issued > now + 300 || issued < now - 86400))
        return reply(
          { error: 'キャンセル用受付番号の期限が切れています' },
          400,
        );
      const results = await db.batch([
        db
          .prepare(
            'INSERT OR IGNORE INTO diagnostic_report_tombstones(receipt_id,delete_hash,expires_at) SELECT ?,?,? WHERE NOT EXISTS(SELECT 1 FROM diagnostic_reports WHERE receipt_id=? AND delete_hash<>?) AND ((SELECT count(*) FROM diagnostic_reports)+(SELECT count(*) FROM diagnostic_report_tombstones)<1000 OR EXISTS(SELECT 1 FROM diagnostic_reports WHERE receipt_id=? AND delete_hash=?))',
          )
          .bind(
            input.receipt_id,
            keyHash,
            now + 30 * 86400,
            input.receipt_id,
            keyHash,
            input.receipt_id,
            keyHash,
          ),
        db
          .prepare(
            'DELETE FROM diagnostic_reports WHERE receipt_id=? AND delete_hash=? AND EXISTS(SELECT 1 FROM diagnostic_report_tombstones WHERE receipt_id=? AND delete_hash=?)',
          )
          .bind(input.receipt_id, keyHash, input.receipt_id, keyHash),
      ]);
      if (results.length !== 2 || results.some((r) => !r.success))
        throw new Error('storage');
      if (results[0].meta.changes !== 1)
        return reply(
          { error: 'Cancellation capacity reached; no deletion confirmed' },
          429,
        );
      return reply({ ok: true }); // Does not disclose whether an unrelated ID exists.
    }
    if (
      await db
        .prepare(
          'SELECT receipt_id FROM diagnostic_report_tombstones WHERE receipt_id=?',
        )
        .bind(input.receipt_id)
        .first()
    )
      return reply({ error: '削除済みの受付番号です' }, 409);
    const json = JSON.stringify(input.report);
    const previous = await db
      .prepare(
        'SELECT delete_hash,report_json,expires_at FROM diagnostic_reports WHERE receipt_id=? AND expires_at>?',
      )
      .bind(input.receipt_id, now)
      .first<{
        delete_hash: string;
        report_json: string;
        expires_at: number;
      }>();
    if (previous)
      return previous.delete_hash === keyHash && previous.report_json === json
        ? reply({
            ok: true,
            receipt_id: input.receipt_id,
            expires_at: previous.expires_at,
          })
        : reply({ error: '受付番号が競合しています' }, 409);
    // The first 8 receipt hex digits encode browser creation time; 96 key-digest bits bind cancellation to the independent secret.
    // New submissions expire after 24h; 30-day tombstones therefore cannot resurrect.
    const issued = parseInt(input.receipt_id.slice(0, 8), 16);
    if (issued > now + 300 || issued < now - 86400)
      return reply(
        {
          error:
            '受付番号の期限が切れています。新しい送信内容を確認してください',
        },
        400,
      );
    // A single SQLite statement enforces the global daily stored-report ceiling,
    // even with concurrent requests. Quota also bounds failed/repeated attempts.
    const values: (string | number)[] = [
      input.receipt_id,
      keyHash,
      json,
      now,
      now + 30 * 86400,
      Math.floor(now / 86400) * 86400,
      input.receipt_id,
    ];
    const result = await db
      .prepare(
        `INSERT OR IGNORE INTO diagnostic_reports(receipt_id,delete_hash,report_json,consent_version,created_at,expires_at) SELECT ?,?,?,1,?,? WHERE (SELECT count(*) FROM diagnostic_reports WHERE created_at>=?)<200 AND NOT EXISTS(SELECT 1 FROM diagnostic_report_tombstones WHERE receipt_id=?) AND (SELECT count(*) FROM diagnostic_reports)+(SELECT count(*) FROM diagnostic_report_tombstones)<1000`,
      )
      .bind(...values)
      .run();
    if (!result.success) throw new Error('storage');
    if (result.meta.changes !== 1) {
      const retry = await db
        .prepare(
          'SELECT delete_hash,report_json,expires_at FROM diagnostic_reports WHERE receipt_id=? AND expires_at>?',
        )
        .bind(input.receipt_id, now)
        .first<{
          delete_hash: string;
          report_json: string;
          expires_at: number;
        }>();
      if (retry?.delete_hash === keyHash && retry.report_json === json)
        return reply({
          ok: true,
          receipt_id: input.receipt_id,
          expires_at: retry.expires_at,
        });
      return reply({ error: '受付上限または受付番号の競合です' }, 429);
    }
    return reply(
      { ok: true, receipt_id: input.receipt_id, expires_at: now + 30 * 86400 },
      201,
    );
  } catch {
    return reply(
      { error: '保存を確認できませんでした。同じ受付番号で再試行してください' },
      503,
    );
  }
}
