import { runReportsCycle, type CycleEnv } from '../lib/community-reports/cycle';
// Candidate only: no cron, bindings or production identity configured here.
const cleanupWorker = {
  async scheduled(event: ScheduledController, env: CycleEnv) {
    const result = await runReportsCycle(
      env,
      Math.floor(Date.now() / 1000),
      fetch,
      event.cron,
    );
    if (
      event.cron !== '*/15 * * * *' ||
      !(result.collectionOk || result.budgetOk) ||
      !result.cleanupOk
    )
      throw Error('Community reports scheduled operation failed');
  },
  fetch() {
    return new Response('Not found', {
      status: 404,
      headers: { 'Cache-Control': 'no-store' },
    });
  },
};
export default cleanupWorker;
