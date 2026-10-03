import { env } from 'cloudflare:workers';
import type { parseGameRequest } from './game-request-input';
const DAY = 86_400_000;
function runtime() {
  return env as unknown as {
    DB?: D1Database;
    GAME_REQUESTS_ENABLED?: string;
    GAME_REQUEST_CONSUMER_READY?: string;
  };
}
function database() {
  const db = runtime().DB;
  if (!db) throw new Error('unavailable');
  return db;
}
export function gameRequestsEnabled() {
  const e = runtime();
  return (
    e.GAME_REQUESTS_ENABLED === 'true' &&
    e.GAME_REQUEST_CONSUMER_READY === 'true' &&
    Boolean(e.DB)
  );
}
export async function gameRequestsAvailable() {
  if (!gameRequestsEnabled()) return false;
  try {
    const schema = await database()
      .prepare(
        "SELECT COUNT(*) AS n FROM sqlite_master WHERE type='table' AND name IN ('game_requests','game_request_daily_salts','game_request_attempts')",
      )
      .first<{ n: number }>();
    return schema?.n === 3;
  } catch {
    return false;
  }
}
async function networkFingerprint(ip: string, day: string, now: number) {
  const db = database();
  await db
    .prepare(
      'INSERT OR IGNORE INTO game_request_daily_salts (day,salt,expires_at) VALUES (?,?,?)',
    )
    .bind(day, crypto.randomUUID(), now + 2 * DAY)
    .run();
  const row = await db
    .prepare('SELECT salt FROM game_request_daily_salts WHERE day=?')
    .bind(day)
    .first<{ salt: string }>();
  if (!row) throw new Error('unavailable');
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(row.salt),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const hash = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(ip),
  );
  return Array.from(new Uint8Array(hash), (v) =>
    v.toString(16).padStart(2, '0'),
  ).join('');
}
export async function persistGameRequest(
  input: NonNullable<ReturnType<typeof parseGameRequest>>,
  ip: string,
) {
  const db = database(),
    now = Date.now(),
    day = new Date(now).toISOString().slice(0, 10);
  const fingerprint = await networkFingerprint(ip, day, now),
    id = crypto.randomUUID(),
    attemptId = crypto.randomUUID();
  // One D1 transaction: conditional admission, insertion, and receipt are linked
  // by an unguessable attempt ID. Never split these statements across calls.
  const results = await db.batch([
    db
      .prepare('DELETE FROM game_request_attempts WHERE created_at < ?')
      .bind(now - 2 * DAY),
    db
      .prepare('DELETE FROM game_request_daily_salts WHERE expires_at < ?')
      .bind(now),
    db
      .prepare(
        'DELETE FROM game_requests WHERE updated_at < ? AND (lease_until IS NULL OR lease_until < ?)',
      )
      .bind(now - 90 * DAY, now),
    db
      .prepare(
        `INSERT INTO game_request_attempts (id,day,fingerprint,created_at) SELECT ?,?,?,?
         WHERE (SELECT COUNT(*) FROM game_request_attempts WHERE day=? AND fingerprint=?) < 5
         AND (SELECT COUNT(*) FROM game_request_attempts WHERE day=?) < 100`,
      )
      .bind(attemptId, day, fingerprint, now, day, fingerprint, day),
    db
      .prepare(
        `INSERT INTO game_requests (id,game_name,normalized_name,locale,created_at,updated_at) SELECT ?,?,?,?,?,?
         WHERE EXISTS (SELECT 1 FROM game_request_attempts WHERE id=?)
         ON CONFLICT(normalized_name) DO NOTHING`,
      )
      .bind(
        id,
        input.gameName,
        input.normalizedName,
        input.locale,
        now,
        now,
        attemptId,
      ),
    db
      .prepare(
        'SELECT id FROM game_requests WHERE normalized_name=? AND EXISTS (SELECT 1 FROM game_request_attempts WHERE id=?)',
      )
      .bind(input.normalizedName, attemptId),
  ]);
  if (results[3].meta.changes !== 1) throw new Error('game_request_rate_limit');
  const stored = results[5].results[0] as { id?: string } | undefined;
  if (!stored?.id) throw new Error('unavailable');
  return { duplicate: stored.id !== id };
}
export async function listGameRequests(after: string | null) {
  const result = await database()
    .prepare(
      'SELECT id,game_name,locale,status,canonical_game,reason_code,attempt_count,publication_url,publication_sha,created_at,updated_at FROM game_requests WHERE id > ? ORDER BY id LIMIT 51',
    )
    .bind(after || '')
    .all();
  const rows = result.results.slice(0, 50);
  return {
    requests: rows,
    next: result.results.length > 50 ? rows[49].id : null,
  };
}
export async function claimGameRequest(id: string) {
  const now = Date.now(),
    token = crypto.randomUUID(),
    db = database();
  // A crashed operation may be reclaimed twice; then hold for explicit review.
  await db
    .prepare(`UPDATE game_requests SET status='held',reason_code='retry_later',lease_token=NULL,lease_until=NULL,updated_at=?
    WHERE id=? AND attempt_count>=3 AND status IN ('verifying','researching','drafting','qa') AND lease_until < ?`)
    .bind(now, id, now)
    .run();
  // Globally serial consumer: at most one active game, maximum 1 game per run.
  return db
    .prepare(`UPDATE game_requests SET lease_token=?,lease_until=?,status=CASE WHEN status='received' THEN 'verifying' ELSE status END,attempt_count=attempt_count+1,updated_at=?
    WHERE id=? AND attempt_count<3 AND status IN ('received','verifying','researching','drafting','qa') AND (lease_until IS NULL OR lease_until < ?)
    AND NOT EXISTS (SELECT 1 FROM game_requests WHERE lease_until >= ?)
    RETURNING id,game_name,locale,status,canonical_game,attempt_count,lease_token,lease_until`)
    .bind(token, now + 30 * 60_000, now, id, now, now)
    .first();
}
export const requestStates = [
  'verifying',
  'researching',
  'drafting',
  'qa',
  'published',
  'covered',
  'held',
  'rejected',
] as const;
export const requestReasons = [
  'invalid_game',
  'not_pc_game',
  'already_covered',
  'demand_data_unavailable',
  'sources_unavailable',
  'translation_incomplete',
  'qa_failed',
  'access_unavailable',
  'retry_later',
] as const;
export async function updateGameRequest(input: {
  id: string;
  leaseToken: string;
  status: string;
  canonicalGame: string | null;
  reasonCode: string | null;
  publicationUrl: string | null;
  publicationSha: string | null;
}) {
  const now = Date.now(),
    terminal = ['published', 'covered', 'held', 'rejected'].includes(
      input.status,
    );
  return database()
    .prepare(`UPDATE game_requests SET status=?,canonical_game=COALESCE(?,canonical_game),reason_code=?,publication_url=?,publication_sha=?,lease_token=?,lease_until=?,updated_at=?
    WHERE id=? AND lease_token=? AND lease_until>=?
    AND (status=? OR ? IN ('held','rejected','covered') OR
      (status='verifying' AND ?='researching') OR
      (status='researching' AND ?='drafting') OR
      (status='drafting' AND ?='qa') OR
      (status='qa' AND ?='published')) RETURNING id,status`)
    .bind(
      input.status,
      input.canonicalGame,
      input.reasonCode,
      input.publicationUrl,
      input.publicationSha,
      terminal ? null : input.leaseToken,
      terminal ? null : now + 30 * 60_000,
      now,
      input.id,
      input.leaseToken,
      now,
      input.status,
      input.status,
      input.status,
      input.status,
      input.status,
      input.status,
    )
    .first();
}
