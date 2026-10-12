// One permanent aggregate; individual deduplication fingerprints expire after
// 30 days. The existing diagnosis cleanup Worker already removes expired
// salt:% operations (including other temporary ledgers); no schema/cron change.
export const ADMISSION_TOTAL_KEY = 'admission:total:v1';
export const ADMISSION_PREFIX = 'salt:admission:v1:';
export const ADMISSION_LIMIT = 500;
export const ADMISSION_TTL = 30 * 86400000;
const unavailable = () => new Error('Admission storage unavailable');
const counter = (value: string | undefined) => {
  if (value === undefined) return 0;
  const n = Number(value);
  if (
    !Number.isInteger(n) ||
    n < 0 ||
    n > ADMISSION_LIMIT ||
    String(n) !== value
  )
    throw unavailable();
  return n;
};
export async function admissionOpen(db: D1Database) {
  const row = await db
    .prepare('SELECT value FROM diagnosis_operations WHERE key=?')
    .bind(ADMISSION_TOTAL_KEY)
    .first<{ value: string }>();
  return counter(row?.value) < ADMISSION_LIMIT;
}
export async function admissionCleanupReady(db: D1Database, now: number) {
  const row = await db
    .prepare(
      "SELECT value FROM diagnosis_operations WHERE key='cleanup_success'",
    )
    .first<{ value: string }>();
  const at = Number(row?.value);
  return Number.isFinite(at) && at <= now + 60000 && now - at < 7200000;
}
export async function reserveAdmission(
  db: D1Database,
  kind: 'diagnosis' | 'feedback',
  identity: string,
  now: number,
): Promise<'new' | 'used' | 'full'> {
  if (!(await admissionCleanupReady(db, now))) throw unavailable();
  const digest = Array.from(
    new Uint8Array(
      await crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode(`gemnao-admission-v1:${kind}:${identity}`),
      ),
    ),
    (v) => v.toString(16).padStart(2, '0'),
  ).join('');
  const key = ADMISSION_PREFIX + digest;
  const claim = crypto.randomUUID(); // transaction ownership only, never authentication
  const results = await db.batch([
    db
      .prepare(
        "INSERT OR IGNORE INTO diagnosis_operations(key,value,expires_at) VALUES (?,'0',0)",
      )
      .bind(ADMISSION_TOTAL_KEY),
    db
      .prepare('DELETE FROM diagnosis_operations WHERE key=? AND expires_at<=?')
      .bind(key, now),
    db
      .prepare(`INSERT OR IGNORE INTO diagnosis_operations(key,value,expires_at)
      SELECT ?,?,? FROM diagnosis_operations WHERE key=?
      AND value=CAST(CAST(value AS INTEGER) AS TEXT) AND CAST(value AS INTEGER) BETWEEN 0 AND 499`)
      .bind(key, claim, now + ADMISSION_TTL, ADMISSION_TOTAL_KEY),
    db
      .prepare(`UPDATE diagnosis_operations SET value=CAST(CAST(value AS INTEGER)+1 AS TEXT)
      WHERE key=? AND value=CAST(CAST(value AS INTEGER) AS TEXT)
      AND CAST(value AS INTEGER) BETWEEN 0 AND 499
      AND EXISTS(SELECT 1 FROM diagnosis_operations WHERE key=? AND value=?)`)
      .bind(ADMISSION_TOTAL_KEY, key, claim),
  ]);
  if (results.length !== 4 || results.some((r) => !r.success))
    throw unavailable();
  const inserted = results[2].meta.changes,
    incremented = results[3].meta.changes;
  if (inserted === 1 && incremented === 1) return 'new';
  if (inserted !== 0 || incremented !== 0) throw unavailable();
  const existing = await db
    .prepare(
      'SELECT value FROM diagnosis_operations WHERE key=? AND expires_at>?',
    )
    .bind(key, now)
    .first();
  if (existing) return 'used';
  if (!(await admissionOpen(db))) return 'full';
  throw unavailable();
}
