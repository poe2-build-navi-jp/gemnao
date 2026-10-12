// Fixed, empty-production-database scope. No credential reader or network on import.
import { TARGET, sha256 } from '../feedback-preview/controller.mjs';
export const PRODUCTION_OPERATION = 'production-databases';
export const PRODUCTION_MODE = 'create-empty-production-databases';
export const PRODUCTION_RECORD_OPERATION = 'create-two-production-databases-20261012';
export const PRODUCTION_FEATURES = Object.freeze([
  Object.freeze({ key: 'sharing', database: 'gemnao-diagnosis-production', binding: 'DIAGNOSIS_DB',
    schema: 'reviewed/diagnosis/0001.sql', statements: 7 }),
  Object.freeze({ key: 'feedback', database: 'gemnao-diagnostic-feedback-production', binding: 'FEEDBACK_DB',
    schema: 'reviewed/0001.sql', statements: 9 }),
]);
export const PRODUCTION_ARTIFACTS = Object.freeze({
  'reviewed/diagnosis/0001.sql': 'f50e5b9c723f64668c482be86ab590910c474d57a1222124b87d7adfc1fe6681',
  'reviewed/0001.sql': '06cd366d4269986d33170e6325e02c651801586cce4caa8169b48dbef0ff7405',
});
export const EXCLUDED_DATABASE_IDS = Object.freeze([
  '385a194f-5119-4bbe-9afe-2e6ce4ceb341',
  '72c728f5-1656-4e26-bc11-7c508ae155c3',
  '3a714aee-e602-4590-afd0-3c2ddd9aea8f',
]);
// The actual owner reply and its context stay with the reviewer. This policy
// records a current plan confirmation, never measured usage or a renewed image.
export const PRODUCTION_COST_POLICY = Object.freeze({
  version: 2,
  kind: 'owner-current-free-plan-confirmation',
  maximumConfirmationAgeMs: 3_600_000,
  usageHeadroom: 'not-measured',
  screenshotRequired: false,
});
export const PRODUCTION_PLAN_HASH = sha256(JSON.stringify({
  operation: PRODUCTION_RECORD_OPERATION, accountId: TARGET.accountId, environment: TARGET.environment,
  features: PRODUCTION_FEATURES, artifacts: PRODUCTION_ARTIFACTS, excludedDatabaseIds: EXCLUDED_DATABASE_IDS,
  writes: ['D1_CREATE', 'SCHEMA'], maxCloudflareWrites: 4, paidUSD: 0,
  quotaPolicy: 'provider-enforced-free-stop', costEvidencePolicy: PRODUCTION_COST_POLICY, intakeEnabled: false,
  claim: { backend: 'github-artifact-v4', uploads: 1, archiveBytes: 8192, retentionDays: 1,
    access: 'existing-repository', overwrite: false },
}));
export function isProductionOperation(operation = 'preview') {
  if (!['preview', PRODUCTION_OPERATION].includes(operation)) throw new Error('BLOCKED:RECORD_SCOPE');
  return operation === PRODUCTION_OPERATION;
}

export function productionDatabaseRequestAllowed(path, method) {
  const base = `/accounts/${TARGET.accountId}/d1/database`;
  const pathname = path.split('?')[0];
  if (pathname === base) return ['GET', 'POST'].includes(method);
  const suffix = pathname.startsWith(base + '/') ? pathname.slice(base.length + 1) : '';
  return (method === 'GET' && /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/.test(suffix))
    || (method === 'POST' && /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}\/query$/.test(suffix));
}
