import { TARGET, sha256 } from '../feedback-preview/controller.mjs';
import { PRODUCTION_HEALTH_TARGETS, CLEANUP_INSTALLATION } from './cleanup-health.mjs';
import { CLEANUP_SETUP_RUN } from './cleanup-profile.mjs';

export const PUBLIC_HEALTH_OPERATION = 'production-health-publish';
export const PUBLIC_HEALTH_MODE = 'publish-production-health';
export const PUBLIC_HEALTH_RECORD_OPERATION = 'publish-production-health-20261012';
export const PUBLIC_HEALTH_URL = 'https://gemnao-retention-health.soykururu143.workers.dev/health';
export const PUBLIC_HEALTH_FEATURE = Object.freeze({ key: 'public-health', worker: 'gemnao-retention-health',
  module: '../diagnosis-production/reviewed/public-health.mjs' });
export const PUBLIC_HEALTH_ARTIFACTS = Object.freeze({
  '../diagnosis-production/reviewed/public-health.mjs': '562816b573ed3428b6d8f8b4c28665088d49cac5c91760f3d6244132511f4af9',
});
export const PUBLIC_HEALTH_BINDINGS = Object.freeze([
  ...PRODUCTION_HEALTH_TARGETS.map(t => Object.freeze({ type: 'd1',
    name: t.feature === 'sharing' ? 'DIAGNOSIS_DB' : 'FEEDBACK_DB', database_id: t.databaseId })),
  Object.freeze({ type: 'ratelimit', name: 'HEALTH_READ_LIMIT', namespace_id: '2026101201',
    simple: Object.freeze({ limit: 1, period: 60 }) }),
]);
export const PUBLIC_HEALTH_APPROVAL = Object.freeze({ approvedAt: 1791790192000,
  evidenceSha256: '280935a45fc16b00df610a7dba4b9c7653d1f800b1c7c7d3eac9b373070b4ead',
  publicFields: Object.freeze(['fixed-feature-name', 'last-success-time', 'fixed-status']),
  destination: 'parent-conversation', persistentBindings: true });
// Historical owner declaration, NOT a new confirmation or authenticated plan read.
// This newly approved fixed operation makes no billing/plan change. It does not
// re-date the 06:29:58 answer or apply an hourly re-confirmation to that fact.
export const PUBLIC_HEALTH_COST_BASIS = Object.freeze({ kind: 'historical-owner-free-plan-declaration',
  confirmedAt: 1791786598000,
  confirmationEvidenceSha256: '16c98a232509d5eb7a79d0f0b54f9ae8b9d16c76e9007f17ac9298093fdcd117',
  originalScope: 'cleanup-installation', currentPlanApiVerified: false, usageHeadroom: 'not-measured',
  planChangesAllowed: false, paidUpgradeAllowed: false });
export const PUBLIC_HEALTH_PLAN_HASH = sha256(JSON.stringify({ operation: PUBLIC_HEALTH_RECORD_OPERATION,
  accountId: TARGET.accountId, feature: PUBLIC_HEALTH_FEATURE, artifacts: PUBLIC_HEALTH_ARTIFACTS,
  bindings: PUBLIC_HEALTH_BINDINGS, url: PUBLIC_HEALTH_URL, cacheSeconds: 300,
  approval: PUBLIC_HEALTH_APPROVAL, costBasis: PUBLIC_HEALTH_COST_BASIS,
  writes: ['NEW_WORKER_PUBLIC_SUBDOMAIN', 'NEW_VERSION_DEPLOY_BY_ID'], maximumWrites: 2,
  databaseWrites: 0, additionalCrons: 0, intakeEnabled: false,
  claim: { archiveBytes: 8192, retentionDays: 1, overwrite: false } }));
const ACCOUNT = `/accounts/${TARGET.accountId}`;
const HASH = /^[a-f0-9]{64}$/;
function need(ok, code) { if (!ok) throw new Error(`BLOCKED:${code}`); }
export function publicHealthRequestAllowed(path, method) {
  const p = path.split('?')[0];
  if (method === 'GET') return p === `${ACCOUNT}/workers/workers` || p === `${ACCOUNT}/workers/subdomain`
    || PRODUCTION_HEALTH_TARGETS.some(t => p === `${ACCOUNT}/d1/database/${t.databaseId}`)
    || p === `${ACCOUNT}/workers/workers/${PUBLIC_HEALTH_FEATURE.worker}`
    || new RegExp(`^${ACCOUNT}/workers/workers/[a-f0-9]{32}(?:/versions/[a-f0-9-]{36})?$`).test(p);
  return method === 'POST' && (path === `${ACCOUNT}/workers/workers`
    || new RegExp(`^${ACCOUNT}/workers/workers/[a-f0-9]{32}/versions\\?deploy=true$`).test(path));
}
export function validatePublicHealthRecord(bytes, digest, now) {
  need(typeof bytes === 'string' && Buffer.byteLength(bytes) <= 65_536, 'APPROVAL_RECORD_SIZE');
  need(HASH.test(digest ?? '') && sha256(bytes) === digest, 'APPROVAL_RECORD_PIN');
  let r; try { r = JSON.parse(bytes); } catch { throw new Error('BLOCKED:APPROVAL_RECORD_JSON'); }
  need(r?.mode === PUBLIC_HEALTH_MODE && r.operation === PUBLIC_HEALTH_RECORD_OPERATION
    && r.planHash === PUBLIC_HEALTH_PLAN_HASH && r.accountId === TARGET.accountId, 'RECORD_SCOPE');
  need(r.ref === 'refs/heads/prepare/feedback-preview-controller-20261007'
    && /^[a-f0-9]{40}$/.test(r.commit ?? ''), 'REVIEWED_REF');
  need(Number.isSafeInteger(r.runId) && r.runId > 0 && r.runId !== CLEANUP_INSTALLATION.runId
    && r.approvedAt === PUBLIC_HEALTH_APPROVAL.approvedAt && r.approvedAt <= now
    && now - r.approvedAt <= 3_600_000, 'REVIEWED_RUN');
  need(r.reviewerPolicy === 'owner-manual' && r.requireOwnerInitiator === false
    && Array.isArray(r.reviewers) && r.reviewers.length === 1 && r.reviewers[0] === 325773421, 'REVIEWER_POLICY');
  need(r.publicationApprovalEvidenceSha256 === PUBLIC_HEALTH_APPROVAL.evidenceSha256
    && r.publicUrl === PUBLIC_HEALTH_URL && r.persistentBindings === true
    && r.notificationDestination === 'parent-conversation', 'CLEANUP_ALERT_APPROVAL');
  need(r.costBasis && Object.keys(r.costBasis).length === Object.keys(PUBLIC_HEALTH_COST_BASIS).length
    && Object.entries(PUBLIC_HEALTH_COST_BASIS).every(([k,v]) => r.costBasis[k] === v), 'CURRENT_FREE_PLAN_EVIDENCE');
  need(r.claimArtifact?.archiveBytes === 8192 && r.claimArtifact.retentionDays === 1
    && r.claimArtifact.access === 'existing-repository' && HASH.test(r.claimArtifact.storageBudgetReviewSha256 ?? ''), 'CLAIM_ARTIFACT_BUDGET');
  need(Array.isArray(r.reconciledPriorRuns), 'DURABLE_RUN_RECONCILIATION');
  for (const safe of r.reconciledPriorRuns) {
    need(Number.isSafeInteger(safe.id) && safe.id !== r.runId && /^[a-f0-9]{40}$/.test(safe.headSha ?? '')
      && HASH.test(safe.reviewEvidenceSha256 ?? '') && ['independently-reviewed-no-mutations',
        'independently-reviewed-preview-only', 'independently-reviewed-production-databases-only',
        'independently-reviewed-production-cleanup-only'].includes(safe.classification), 'RECONCILED_RUN');
    if (safe.classification === 'independently-reviewed-production-cleanup-only')
      need(safe.id === CLEANUP_INSTALLATION.runId && safe.headSha === CLEANUP_INSTALLATION.sourceSha
        && safe.reviewEvidenceSha256 === CLEANUP_INSTALLATION.receiptSha256, 'RECONCILED_RUN');
    if (safe.classification === 'independently-reviewed-preview-only')
      need(safe.planHash === '1f8493cbbe703be117e4e14037a5d3e36cbf3df2e6b9f9c0263f7f4cef1b2978', 'RECONCILED_RUN');
    if (safe.classification === 'independently-reviewed-production-databases-only')
      need(safe.id === CLEANUP_SETUP_RUN.id && safe.headSha === CLEANUP_SETUP_RUN.headSha
        && safe.planHash === CLEANUP_SETUP_RUN.planHash, 'RECONCILED_RUN');
  }
  return r;
}

export function matchesPublicHealthBindings(bindings) {
  if (!Array.isArray(bindings) || bindings.length !== PUBLIC_HEALTH_BINDINGS.length) return false;
  return PUBLIC_HEALTH_BINDINGS.every(expected => {
    const rows = bindings.filter(b => b?.name === expected.name); if (rows.length !== 1) return false;
    const b = rows[0];
    if (expected.type === 'd1') return Object.keys(b).every(k => ['type','name','database_id','id'].includes(k))
      && b.type === 'd1' && b.database_id === expected.database_id && (!Object.hasOwn(b,'id') || b.id === expected.database_id);
    return Object.keys(b).every(k => ['type','name','namespace_id','simple'].includes(k))
      && b.type === 'ratelimit' && b.namespace_id === expected.namespace_id
      && b.simple?.limit === 1 && b.simple.period === 60
      && Object.keys(b.simple).every(k => ['limit','period','mitigation_timeout'].includes(k))
      && (!Object.hasOwn(b.simple,'mitigation_timeout') || b.simple.mitigation_timeout === 0);
  });
}
