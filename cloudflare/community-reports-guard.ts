import { WorkerEntrypoint } from 'cloudflare:workers';
export { CommunityReportLedger } from '../lib/community-reports/ledger';
type Env = { GUARD: DurableObjectNamespace };
// Named service binding only. The default public Worker never forwards calls.
export class ReportsGuardService extends WorkerEntrypoint<Env> {
  async fetch(request: Request) {
    return this.env.GUARD.get(
      this.env.GUARD.idFromName('community-reports-v1'),
    ).fetch(request);
  }
}
const publicWorker = {
  fetch() {
    return new Response('Not found', { status: 404 });
  },
};
export default publicWorker;
