// Verified by the protected account-subdomain read in run 37648312766,
// 2026-10-07T16:11:08Z. Only this exact application Worker origin is admitted.
export const VERIFIED_WORKER_PREVIEW_ORIGIN: string = 'https://gemnao-diagnostic-qa.soykururu143.workers.dev';

export function isWorkerPreviewOrigin(value: string): boolean {
  return /^https:\/\/gemnao-diagnostic-qa\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.workers\.dev$/.test(value) &&
    VERIFIED_WORKER_PREVIEW_ORIGIN !== '' && value === VERIFIED_WORKER_PREVIEW_ORIGIN;
}
