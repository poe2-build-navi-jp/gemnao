// Separate Worker, same isolated FEEDBACK_DB. No HTTP/admin endpoint.
const cleanup = {
  async scheduled(_event: ScheduledEvent, env: { FEEDBACK_DB?: D1Database }) {
    if (!env.FEEDBACK_DB) throw new Error('FEEDBACK_DB binding is required');
    const now = Math.floor(Date.now() / 1000);
    try {
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
      if (results.length !== 5 || results.some((result) => !result.success))
        throw new Error('Diagnostic retention cleanup failed');
    } catch {
      console.error('diagnostic_feedback_cleanup_failed');
      throw new Error('Diagnostic retention cleanup failed');
    }
    console.log('diagnostic_feedback_cleanup_success');
  },
  fetch() {
    return new Response('Not found', {
      status: 404,
      headers: { 'Cache-Control': 'no-store' },
    });
  },
};

export default cleanup;
