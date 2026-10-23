// Adapted from the existing audited quota algorithm; only private tables/salt.
import { feedbackNetwork } from '../diagnostic-feedback/rate-limit';
type Bucket = 'intake' | 'delete';
type DailySalt = { day: number; salt: string };
const encoder = new TextEncoder();

async function dailySalt(db: D1Database): Promise<DailySalt> {
  const select = () =>
    db
      .prepare(
        'SELECT day,salt FROM private_diagnostic_rate_salt WHERE singleton=1 AND day=CAST(unixepoch()/86400 AS INTEGER)',
      )
      .first<DailySalt>();
  let row = await select();
  if (!row) {
    // One row ever. Concurrent first requests retain the winner's random salt.
    // This is a short-lived HMAC salt, not an authentication credential.
    const result = await db
      .prepare(
        `INSERT INTO private_diagnostic_rate_salt(singleton,day,salt)
       VALUES(1,CAST(unixepoch()/86400 AS INTEGER),?)
       ON CONFLICT(singleton) DO UPDATE SET day=excluded.day,salt=excluded.salt
       WHERE private_diagnostic_rate_salt.day<excluded.day`,
      )
      .bind(
        Array.from(crypto.getRandomValues(new Uint8Array(32)), (v) =>
          v.toString(16).padStart(2, '0'),
        ).join(''),
      )
      .run();
    if (!result.success) throw new Error('quota unavailable');
    row = await select();
  }
  if (!row || !/^[a-f0-9]{64}$/.test(row.salt))
    throw new Error('quota unavailable');
  return row;
}

export async function takePrivateDiagnosticQuota(
  db: D1Database,
  bucket: Bucket,
  ip: string | null,
): Promise<boolean> {
  const network = feedbackNetwork(ip);
  if (!network) throw new Error('network unavailable');
  const row = await dailySalt(db);
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(row.salt),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const digest = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(`private-diagnostic-v1:${row.day}:${bucket}:${network}`),
  );
  const fingerprint = Array.from(new Uint8Array(digest), (v) =>
    v.toString(16).padStart(2, '0'),
  ).join('');
  // D1 serializes writes. Both bounds are checked within the SAME conditional
  // INSERT, never a read/check/write sequence. The transactional prune keeps at
  // most 20 attempt rows (10 per bucket), even if scheduled cleanup stops.
  // Use D1's clock, not edge/client time. Inclusive seconds conservatively retain
  // an attempt for at least 60 seconds; fixed-minute/day resets cannot burst.
  // Count ALL remaining rows after pruning: if the clock ticks between batch
  // statements, stale rows deny conservatively rather than exceed the row bound.
  const results = await db.batch([
    db.prepare(
      'DELETE FROM private_diagnostic_rate_attempts WHERE created_at<unixepoch()-60',
    ),
    db
      .prepare(
        `INSERT INTO private_diagnostic_rate_attempts(id,bucket,network_hash,created_at)
       SELECT ?,?,?,unixepoch()
       WHERE EXISTS(SELECT 1 FROM private_diagnostic_rate_salt WHERE singleton=1 AND day=?
                    AND salt=? AND day=CAST(unixepoch()/86400 AS INTEGER))
       AND (SELECT count(*) FROM private_diagnostic_rate_attempts WHERE bucket=?)<10
       AND (SELECT count(*) FROM private_diagnostic_rate_attempts WHERE bucket=? AND network_hash=?)<10`,
      )
      .bind(
        crypto.randomUUID(),
        bucket,
        fingerprint,
        row.day,
        row.salt,
        bucket,
        bucket,
        fingerprint,
      ),
  ]);
  if (results.length !== 2 || results.some((result) => !result.success))
    throw new Error('quota unavailable');
  // A salt rollover mid-request denies conservatively; retry uses the new day.
  // Never refund a failed/invalid/repeated request after admission.
  return results[1].meta.changes === 1;
}
