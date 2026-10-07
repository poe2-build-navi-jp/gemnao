const TTL = 30 * 86400000;

/** Hourly scheduled operation; touches diagnosis tables only. */
export async function cleanupDiagnosis(db: D1Database, now = Date.now()) {
  await db.batch([
    db
      .prepare(
        'DELETE FROM diagnosis_shared WHERE expires_at <= ? OR revoked_at IS NOT NULL',
      )
      .bind(now),
    db
      .prepare('DELETE FROM diagnosis_rate_limits WHERE expires_at <= ?')
      .bind(now),
    db
      .prepare(
        "DELETE FROM diagnosis_operations WHERE key LIKE 'salt:%' AND expires_at <= ?",
      )
      .bind(now),
    db
      .prepare('DELETE FROM diagnosis_metrics WHERE day <= ?')
      .bind(new Date(now - TTL).toISOString().slice(0, 10)),
  ]);
  // Mark success only after deletion committed. Never refresh on a failed cleanup.
  await db
    .prepare(
      "INSERT INTO diagnosis_operations (key,value,expires_at) VALUES ('cleanup_success',?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value, expires_at=excluded.expires_at",
    )
    .bind(String(now), now + 2 * 3600000)
    .run();
}
