import application from '../dist/client/_worker.bundle.js';
import { VERIFIED_WORKER_PREVIEW_ORIGIN } from '../lib/preview/worker-origin';
import { wrapPreviewApplication, wrapQaAccess } from './worker-preview-policy.mjs';

export default wrapQaAccess(wrapPreviewApplication(application, VERIFIED_WORKER_PREVIEW_ORIGIN), VERIFIED_WORKER_PREVIEW_ORIGIN);
