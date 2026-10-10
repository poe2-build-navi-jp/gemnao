import { env } from 'cloudflare:workers';
import type { parseGameRequest } from './game-request-input';
import { parseGameRequestValidationWindow } from './game-request-validation';
const DAY = 86_400_000;
const MANUAL_REQUEST_LIMIT = 500;
function retainedManualMode() {
  return runtime().GAME_REQUEST_REVIEW_MODE === 'manual';
}
function runtime() {
  return env as unknown as {
    DB?: D1Database;
    GAME_REQUESTS_ENABLED?: string;
    GAME_REQUEST_CONSUMER_READY?: string;
    GAME_REQUEST_REVIEW_MODE?: string;
    GAME_REQUEST_MANUAL_REVIEW_READY?: string;
    GAME_REQUEST_VALIDATION_FROM?: string;
    GAME_REQUEST_VALIDATION_UNTIL?: string;
  };
}
function database() {
  const db = runtime().DB;
  if (!db) throw new Error('unavailable');
  return db;
}
export function gameRequestReviewMode():
  | 'manual'
  | 'automatic'
  | 'unavailable' {
  const e = runtime();
  if (
    e.GAME_REQUEST_REVIEW_MODE === 'manual' ||
    e.GAME_REQUEST_REVIEW_MODE === 'manual-validation'
  )
    return e.GAME_REQUEST_MANUAL_REVIEW_READY === 'true' && Boolean(e.DB)
      ? 'manual'
      : 'unavailable';
  if (
    e.GAME_REQUEST_REVIEW_MODE === undefined ||
    e.GAME_REQUEST_REVIEW_MODE === 'automatic'
  )
    return e.GAME_REQUEST_CONSUMER_READY === 'true' && Boolean(e.DB)
      ? 'automatic'
      : 'unavailable';
  return 'unavailable';
}
export function automaticGameRequestConsumerAllowed() {
  const mode = runtime().GAME_REQUEST_REVIEW_MODE;
  return mode === undefined || mode === 'automatic';
}
function manualValidationMode() {
  return runtime().GAME_REQUEST_REVIEW_MODE === 'manual-validation';
}
function currentValidationWindow(now = Date.now()) {
  const e = runtime();
  const window = parseGameRequestValidationWindow(
    e.GAME_REQUEST_VALIDATION_FROM,
    e.GAME_REQUEST_VALIDATION_UNTIL,
  );
  return window && now >= window.from && now < window.until ? window : null;
}
export function gameRequestsEnabled() {
  return (
    runtime().GAME_REQUESTS_ENABLED === 'true' &&
    gameRequestReviewMode() !== 'unavailable' &&
    (!manualValidationMode() || Boolean(currentValidationWindow()))
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
    if (schema?.n !== 3) return false;
    if (!retainedManualMode()) return true;
    const capacity = await database()
      .prepare('SELECT COUNT(*) AS n FROM game_requests')
      .first<{ n: number }>();
    return !!capacity && capacity.n < MANUAL_REQUEST_LIMIT;
  } catch {
    return false;
  }
}
async function networkFingerprint(
  ip: string,
  day: string,
  now: number,
  window: { from: number; until: number } | null,
) {
  const db = database();
  await db
    .prepare(
      `INSERT OR IGNORE INTO game_request_daily_salts (day,salt,expires_at) SELECT ?,?,?
      WHERE (?=0 OR (CAST((julianday('now')-2440587.5)*86400000 AS INTEGER) >= ?
        AND CAST((julianday('now')-2440587.5)*86400000 AS INTEGER) < ?))`,
    )
    .bind(
      day,
      crypto.randomUUID(),
      now + 2 * DAY,
      window ? 1 : 0,
      window?.from ?? 0,
      window?.until ?? 0,
    )
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
  const validation = manualValidationMode();
  const window = validation ? currentValidationWindow(now) : null;
  if (validation && !window) throw new Error('unavailable');
  const fingerprint = await networkFingerprint(ip, day, now, window),
    id = crypto.randomUUID(),
    attemptId = crypto.randomUUID();
  // One D1 transaction: conditional admission, insertion, and receipt are linked
  // by an unguessable attempt ID. Never split these statements across calls.
  const cleanup = validation
    ? []
    : [
        db
          .prepare('DELETE FROM game_request_attempts WHERE created_at < ?')
          .bind(now - 2 * DAY),
        db
          .prepare('DELETE FROM game_request_daily_salts WHERE expires_at < ?')
          .bind(now),
        ...(retainedManualMode()
          ? []
          : [
              db
                .prepare(
                  'DELETE FROM game_requests WHERE updated_at < ? AND (lease_until IS NULL OR lease_until < ?)',
                )
                .bind(now - 90 * DAY, now),
            ]),
      ];
  if (validation && !currentValidationWindow()) throw new Error('unavailable');
  const results = await db.batch([
    ...cleanup,
    db
      .prepare(
        `INSERT INTO game_request_attempts (id,day,fingerprint,created_at) SELECT ?,?,?,?
         WHERE (SELECT COUNT(*) FROM game_request_attempts WHERE day=? AND fingerprint=?) < 5
         AND (SELECT COUNT(*) FROM game_request_attempts WHERE day=?) < 100
         AND (?=0 OR (SELECT COUNT(*) FROM game_requests) < ?)
         AND (?=0 OR (CAST((julianday('now')-2440587.5)*86400000 AS INTEGER) >= ?
           AND CAST((julianday('now')-2440587.5)*86400000 AS INTEGER) < ?))`,
      )
      .bind(
        attemptId,
        day,
        fingerprint,
        now,
        day,
        fingerprint,
        day,
        retainedManualMode() ? 1 : 0,
        MANUAL_REQUEST_LIMIT,
        validation ? 1 : 0,
        window?.from ?? 0,
        window?.until ?? 0,
      ),
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
  if (results[cleanup.length].meta.changes !== 1) {
    if (
      (validation && !currentValidationWindow()) ||
      (retainedManualMode() && !(await gameRequestsAvailable()))
    )
      throw new Error('unavailable');
    throw new Error('game_request_rate_limit');
  }
  const stored = results[cleanup.length + 2].results[0] as
    | { id?: string }
    | undefined;
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

export async function admitGameRequestConsumerCall() {
  const db = database(),
    now = Date.now();
  // Server-generated namespace cannot collide with public YYYY-MM-DD rate rows.
  const minute = 'consumer:' + new Date(now).toISOString().slice(0, 16);
  const result = await db.batch([
    db
      .prepare(
        "DELETE FROM game_request_attempts WHERE day >= 'consumer:' AND day < 'consumer;' AND fingerprint='consumer' AND created_at < ?",
      )
      .bind(now - 2 * DAY),
    db
      .prepare(`INSERT INTO game_request_attempts (id,day,fingerprint,created_at) SELECT ?,?,'consumer',?
      WHERE (SELECT COUNT(*) FROM game_request_attempts WHERE day=? AND fingerprint='consumer') < 120`)
      .bind(crypto.randomUUID(), minute, now, minute),
  ]);
  return result[1].meta.changes === 1;
}

// Manual review uses existing states, never the unattended consumer credential.
// An adopted item is an editorial plan, not a publication or completed request.
export async function reviewGameRequest(input: {
  id: string;
  expectedUpdatedAt: number;
  decision: 'adopt' | 'hold';
}) {
  const now = Date.now();
  return database()
    .prepare(`UPDATE game_requests
    SET status=?,reason_code=?,updated_at=?,lease_token=NULL,lease_until=NULL
    WHERE id=? AND updated_at=? AND status IN ('received','researching','held')
    AND (lease_until IS NULL OR lease_until < ?)
    RETURNING id,status,updated_at`)
    .bind(
      input.decision === 'adopt' ? 'researching' : 'held',
      input.decision === 'hold' ? 'retry_later' : null,
      Math.max(now, input.expectedUpdatedAt + 1),
      input.id,
      input.expectedUpdatedAt,
      now,
    )
    .first();
}
export async function admitGameRequestManualReviewCall() {
  const db = database(),
    now = Date.now();
  const minute = 'manual:' + new Date(now).toISOString().slice(0, 16);
  const cleanup = manualValidationMode()
    ? []
    : [
        db
          .prepare(
            "DELETE FROM game_request_attempts WHERE day >= 'manual:' AND day < 'manual;' AND fingerprint='manual' AND created_at < ?",
          )
          .bind(now - 2 * DAY),
      ];
  const result = await db.batch([
    ...cleanup,
    db
      .prepare(`INSERT INTO game_request_attempts (id,day,fingerprint,created_at) SELECT ?,?,'manual',?
      WHERE (SELECT COUNT(*) FROM game_request_attempts WHERE day=? AND fingerprint='manual') < 30`)
      .bind(crypto.randomUUID(), minute, now, minute),
  ]);
  return result[cleanup.length].meta.changes === 1;
}
