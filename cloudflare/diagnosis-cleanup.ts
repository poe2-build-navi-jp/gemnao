import { cleanupDiagnosis } from '../lib/diagnosis/cleanup';
const cleanupWorker = {
  async scheduled(
    _controller: ScheduledController,
    env: { DIAGNOSIS_DB?: D1Database },
    _ctx: ExecutionContext,
  ) {
    // Missing binding is a failed cleanup, never a fallback to the site database.
    if (!env.DIAGNOSIS_DB) throw new Error('DIAGNOSIS_DB binding is required');
    try {
      await cleanupDiagnosis(env.DIAGNOSIS_DB);
    } catch {
      // Provider exceptions may contain SQL; expose only a fixed event/message.
      console.error('diagnosis_cleanup_failed');
      throw new Error('Diagnosis retention cleanup failed');
    }
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
