// Not registered in any deployment configuration or workflow.
import {WorkerEntrypoint} from 'cloudflare:workers';
export {FiniteQaBudget} from './budget.mjs';
export class PrivateQaGuardService extends WorkerEntrypoint {
  fetch(request) {
    return this.env.PRIVATE_QA_BUDGET.get(this.env.PRIVATE_QA_BUDGET.idFromName('finite-private-qa-once-v1')).fetch(request);
  }
}
const publicWorker = {fetch(){return new Response(null,{status:404});}};
export default publicWorker;
