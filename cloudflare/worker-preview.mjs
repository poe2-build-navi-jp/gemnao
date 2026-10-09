import application from '../dist/client/_worker.bundle.js';
import { VERIFIED_WORKER_PREVIEW_ORIGIN } from '../lib/preview/worker-origin';
import { wrapPreviewApplication } from './worker-preview-policy.mjs';

export default wrapPreviewApplication(application, VERIFIED_WORKER_PREVIEW_ORIGIN);
