// Separate Worker, same isolated FEEDBACK_DB. No HTTP/admin endpoint.
const cleanup = {
  async scheduled(_event: ScheduledEvent, env: { FEEDBACK_DB: D1Database }) {
    const now = Math.floor(Date.now() / 1000);
    const results = await env.FEEDBACK_DB.batch([
      env.FEEDBACK_DB.prepare(
        'DELETE FROM diagnostic_rate_attempts WHERE created_at<unixepoch()-60',
      ),
      env.FEEDBACK_DB.prepare(
        'DELETE FROM diagnostic_rate_salt WHERE day<CAST(unixepoch()/86400 AS INTEGER)',
      ),
      env.FEEDBACK_DB.prepare(
        'DELETE FROM diagnostic_report_tombstones WHERE expires_at <= ?',
      ).bind(now),
      env.FEEDBACK_DB.prepare(
        'DELETE FROM diagnostic_reports WHERE expires_at <= ?',
      ).bind(now),
      env.FEEDBACK_DB.prepare(
        'INSERT INTO diagnostic_retention_health(singleton,last_cleanup) VALUES(1,?) ON CONFLICT(singleton) DO UPDATE SET last_cleanup=excluded.last_cleanup',
      ).bind(now),
    ]);
    if (results.some((result) => !result.success))
      throw new Error('Diagnostic retention cleanup failed');
  },
};

export default cleanup;
