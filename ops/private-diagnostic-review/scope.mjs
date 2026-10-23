// Fixed scope used only by the separately approved existing protected controller.
// An execution adapter must retain the existing protected exact-run owner gate.
export const account = '6a09a32cba1288cccce5912015086a35';
export const database = '3a714aee-e602-4590-afd0-3c2ddd9aea8f';
export const databaseName = 'gemnao-diagnostic-feedback-preview-20261007';
const root = `/accounts/${account}`;
export const queries = Object.freeze([
  "SELECT name,type FROM sqlite_schema WHERE type='table' AND name IN ('diagnostic_reports','diagnostic_report_tombstones','diagnostic_retention_health','diagnostic_rate_salt','diagnostic_rate_attempts') ORDER BY name;",
  "SELECT cid,name,type,pk FROM pragma_table_info('diagnostic_reports') ORDER BY cid;",
]);
export const getPaths = Object.freeze([
  `${root}/d1/database/${database}`,
  `${root}/workers/workers/4cde2e6602024e6b9650d26b28955010`,
  `${root}/workers/scripts/gemnao-diagnostic-feedback-cleanup-preview/schedules`,
]);
export function allowed(path, method, body) {
  if (method === 'GET') return body === undefined && getPaths.includes(path);
  return method === 'POST' && path === `${root}/d1/database/${database}/query`
    && queries.some(sql => body === JSON.stringify({sql}));
}
export function boundedScope() {
  const seen = new Set();
  return (path, method, body) => {
    const key = JSON.stringify([path, method, body]);
    if (!allowed(path, method, body) || seen.has(key) || seen.size >= 5)
      throw new Error('BLOCKED:REVIEW_SCOPE');
    // Mark before any transport; no automatic retry after failed/uncertain reads.
    seen.add(key);
  };
}
export function databaseSummary(value) {
  if (!value || value.uuid !== database || value.name !== databaseName)
    throw new Error('BLOCKED:DATABASE_IDENTITY');
  const bytes = Number.isSafeInteger(value.file_size) && value.file_size >= 0
    ? value.file_size : null;
  // Never spread a provider object; no rows, settings, credentials or errors.
  return { target: 'existing-feedback-qa', identityVerified: true,
    storageBytes: bytes, storageKnown: bytes !== null, reuseAuthorized: false,
    accountQuotaKnown: false, currentPlanVerified: false };
}
