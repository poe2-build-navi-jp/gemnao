// Candidate only: private namespace even when the physical DB is shared with QA.
// No deployed binding or cron. Never run the legacy cleanup as a substitute.
const cleanup = {
  async scheduled(_event: ScheduledEvent, env: { PRIVATE_DIAGNOSTIC_DB?: D1Database }) {
    if (!env.PRIVATE_DIAGNOSTIC_DB) throw new Error('PRIVATE_DIAGNOSTIC_DB binding is required');
    const now = Math.floor(Date.now() / 1000);
    try {
      const results = await env.PRIVATE_DIAGNOSTIC_DB.batch([
        env.PRIVATE_DIAGNOSTIC_DB.prepare(
          'DELETE FROM private_diagnostic_rate_attempts WHERE created_at<unixepoch()-60',
        ),
        env.PRIVATE_DIAGNOSTIC_DB.prepare(
          'DELETE FROM private_diagnostic_rate_salt WHERE day<CAST(unixepoch()/86400 AS INTEGER)',
        ),
        env.PRIVATE_DIAGNOSTIC_DB.prepare(
          'DELETE FROM private_diagnostic_report_tombstones WHERE expires_at <= ?',
        ).bind(now),
        env.PRIVATE_DIAGNOSTIC_DB.prepare(
          'DELETE FROM private_diagnostic_reports WHERE expires_at <= ?',
        ).bind(now),
        env.PRIVATE_DIAGNOSTIC_DB.prepare(
          'INSERT INTO private_diagnostic_retention_health(singleton,last_cleanup) VALUES(1,?) ON CONFLICT(singleton) DO UPDATE SET last_cleanup=excluded.last_cleanup',
        ).bind(now),
      ]);
      if (results.length !== 5 || results.some((result) => !result.success))
        throw new Error('Diagnostic retention cleanup failed');
    } catch {
      console.error('private_diagnostic_cleanup_failed');
      throw new Error('Diagnostic retention cleanup failed');
    }
    console.log('private_diagnostic_cleanup_success');
  },
  fetch() {
    return new Response('Not found', {
      status: 404,
      headers: { 'Cache-Control': 'no-store' },
    });
  },
};

export default cleanup;
