import { cleanupDiagnosis } from '../lib/diagnosis/server';
const cleanupWorker = {
  async scheduled(
    _controller: ScheduledController,
    env: { DB: D1Database },
    _ctx: ExecutionContext,
  ) {
    await cleanupDiagnosis(env.DB);
    console.log('diagnosis_cleanup_success');
  },
  fetch() {
    return new Response('Not found', {
      status: 404,
      headers: { 'Cache-Control': 'no-store' },
    });
  },
};

export default cleanupWorker;
