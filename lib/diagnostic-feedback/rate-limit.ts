import { isIP } from 'node:net';

type Bucket = 'intake' | 'delete';
type DailySalt = { day: number; salt: string };
const encoder = new TextEncoder();

// Only the trusted CF-Connecting-IP header reaches this function. Never use
// X-Forwarded-For or a caller-supplied body/query value as a substitute.
export function feedbackNetwork(ip: string | null): string | null {
  if (!ip || ip.length > 45 || ip.includes('%')) return null;
  if (isIP(ip) === 4) return `v4:${ip}`;
  if (isIP(ip) !== 6) return null;
  // URL canonicalizes equivalent IPv6 spellings, including dotted IPv4 tails.
  const canonical = new URL(`http://[${ip}]/`).hostname.slice(1, -1);
  const halves = canonical.split('::');
  const left = halves[0] ? halves[0].split(':') : [];
  const right = halves[1] ? halves[1].split(':') : [];
  const words =
    halves.length === 2
      ? [...left, ...Array(8 - left.length - right.length).fill('0'), ...right]
      : left;
  const numbers = words.map((word) => parseInt(word, 16));
  if (numbers.slice(0, 5).every((word) => word === 0) && numbers[5] === 0xffff)
    return `v4:${numbers[6] >> 8}.${numbers[6] & 255}.${numbers[7] >> 8}.${numbers[7] & 255}`;
  return `v6:${numbers
    .slice(0, 4)
    .map((word) => word.toString(16))
    .join(':')}/64`;
}

async function dailySalt(db: D1Database): Promise<DailySalt> {
  const select = () =>
    db
      .prepare(
        'SELECT day,salt FROM diagnostic_rate_salt WHERE singleton=1 AND day=CAST(unixepoch()/86400 AS INTEGER)',
      )
      .first<DailySalt>();
  let row = await select();
  if (!row) {
    // One row ever. Concurrent first requests retain the winner's random salt.
    // This is a short-lived HMAC salt, not an authentication credential.
    const result = await db
      .prepare(
        `INSERT INTO diagnostic_rate_salt(singleton,day,salt)
       VALUES(1,CAST(unixepoch()/86400 AS INTEGER),?)
       ON CONFLICT(singleton) DO UPDATE SET day=excluded.day,salt=excluded.salt
       WHERE diagnostic_rate_salt.day<excluded.day`,
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

export async function takeFeedbackQuota(
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
    encoder.encode(`${row.day}:${bucket}:${network}`),
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
      'DELETE FROM diagnostic_rate_attempts WHERE created_at<unixepoch()-60',
    ),
    db
      .prepare(
        `INSERT INTO diagnostic_rate_attempts(id,bucket,network_hash,created_at)
       SELECT ?,?,?,unixepoch()
       WHERE EXISTS(SELECT 1 FROM diagnostic_rate_salt WHERE singleton=1 AND day=?
                    AND salt=? AND day=CAST(unixepoch()/86400 AS INTEGER))
       AND (SELECT count(*) FROM diagnostic_rate_attempts WHERE bucket=?)<10
       AND (SELECT count(*) FROM diagnostic_rate_attempts WHERE bucket=? AND network_hash=?)<10`,
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
