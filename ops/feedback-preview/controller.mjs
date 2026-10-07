// Offline controller. No network, credential reader, SDK, subprocess or apply path.
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

export const TARGET = Object.freeze({
  repository: 'poe2-build-navi-jp/gemnao',
  accountId: '6a09a32cba1288cccce5912015086a35',
  database: 'gemnao-diagnostic-feedback-preview-20261007',
  worker: 'gemnao-diagnostic-feedback-cleanup-preview',
  binding: 'FEEDBACK_DB',
  environment: 'gemnao-preview-data',
  cron: '0 * * * *',
});
export const SHARING = Object.freeze({
  database: 'gemnao-diagnosis-preview-20261007',
  worker: 'gemnao-diagnosis-cleanup-preview',
  binding: 'DIAGNOSIS_DB',
  environment: 'gemnao-preview-data',
  cron: '17 * * * *',
  schemaCommit: '7ef1df53bc9ee4b2c3f9b852dfa4ad30e06d8631',
  schemaTree: '45594676b1ec971bcd9fc93c691ad28ba24b030a',
  schemaStatements: 7,
  cleanupSource: Object.freeze({
    commit: 'b2c51a26cd323492f9fdc0f4939d2967b1956e7f',
    tree: '51d849805ca36914046289626241d32bbd1b9cd5',
    worker: 'reviewed/diagnosis/cloudflare/diagnosis-cleanup.ts',
    dependency: 'reviewed/diagnosis/lib/diagnosis/cleanup.ts',
    bundle: 'reviewed/diagnosis/cleanup.bundle',
  }),
  status: 'BLOCKED: dormant artifacts only; legacy-data continuity and live HTTP/browser/retention verification outstanding',
});
export const SOURCE = Object.freeze({
  base: '35e931b3163b85394b7ac7e44ddde9e54f3e6e87',
  commit: 'feb866d6dc0391a76b8e7f16228de8b9788b9583',
  tree: 'e49c2b6c6e5be8a2eb31730a9f3105d47a51bd40',
});
export const ARTIFACTS = Object.freeze({
  'reviewed/diagnosis/cloudflare/diagnosis-cleanup.ts': 'eebb5081080768fe06f2037074e849f452dfd277c4e12a92fa511d93f4f737f1',
  'reviewed/diagnosis/lib/diagnosis/cleanup.ts': 'ded590732fc5c0ec667af1ecee418f45fedb6f09dc8596156a9a45c9930836de',
  'reviewed/diagnosis/cleanup.bundle': '601934e05c896c320d34b779937774b3a80ba3df99fda0facd01c413c52a5012',
  'reviewed/diagnosis/0001.sql': 'f50e5b9c723f64668c482be86ab590910c474d57a1222124b87d7adfc1fe6681',
  'reviewed/0001.sql': '06cd366d4269986d33170e6325e02c651801586cce4caa8169b48dbef0ff7405',
  'reviewed/cleanup.ts': 'fe3a5c1f8fc8358f3cb676f0dd51ba9214b57874eb2a2de8703c206973a8ea86',
  'reviewed/cleanup.mjs': 'fc9be025bfd8d559afd5dcb1c1ee7b6e5461a6a204bfd773dc4224dc9f1e74c3',
});
// These are deliberately unchosen. Dispatch inputs/environment variables cannot
// approve a ref, reviewer, cleanup schedule, alert destination or expenditure.
export const APPROVAL = Object.freeze({
  ref: null,
  commit: null,
  reviewers: Object.freeze([]),
  reviewerPolicy: null,
  requireOwnerInitiator: null,
  cleanup: false,
  alertDestination: null,
  quotaReservation: null,
});
export const WRITES = Object.freeze([
  'create_database',
  'apply_schema',
  'create_private_worker',
  'deploy_pinned_version_by_id',
  'set_hourly_schedule',
]);

export function sha256(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}
export function checkArtifact(bytes, expectedHash) {
  if (sha256(bytes) !== expectedHash) throw new Error('Reviewed artifact hash mismatch');
}
export async function verifyArtifacts() {
  for (const [path, expected] of Object.entries(ARTIFACTS)) {
    checkArtifact(await readFile(new URL(path, import.meta.url)), expected);
  }
}
export function plan() {
  return {
    status: 'DISABLED: bounded adapters prepared with injected transport; no live transport or approval record',
    executionAllowed: false,
    feedbackTargets: TARGET,
    sharingTargets: SHARING,
    source: SOURCE,
    artifacts: ARTIFACTS,
    approvals: APPROVAL,
    maximumProposedMutations: {
      databaseCreates: 1,
      schemaBatches: 1,
      schemaStatements: 9,
      privateWorkerCreates: 1,
      versionDeploysById: 1,
      hourlyScheduleWrites: 1,
      automaticRetries: 0,
      allowedPaidChargesUSD: 0,
    },
    maximumCloudflareMutations: 10,
    additionalGitHubClaim: { uploads: 1, maxArchiveBytes: 8192, retentionDays: 1, access: 'existing-repository' },
    sharingAdapterPrepared: true,
    approvedRecordHash: null,
    exclusions: ['Pages/application deploy', 'production binding', 'existing resource adoption',
      'account/role/global settings', 'resource deletion', 'alert configuration'],
    blockers: ['No approved ref/commit/reviewer policy', 'Account identity unverified',
      'Reviewed owner-UI plan/remaining-quota evidence pending',
      'Residual name-targeted Cron rename race needs explicit review', 'Cleanup not approved',
      'Alert destination unchosen; monitoring not implemented'],
  };
}

// Executable policy specification for synthetic tests ONLY. Caller-supplied
// booleans/JSON are not provider evidence or authorization. There is no adapter
// that promotes these synthetic booleans into live authorization; adapter.mjs
// instead requires an exact independently reviewed approval-record hash.
export function modelPreflight(observation, approval = APPROVAL, now = Date.now()) {
  const o = observation ?? {};
  const blockers = [];
  const require = (condition, reason) => { if (!condition) blockers.push(reason); };
  require(o.synthetic === true, 'Model accepts synthetic observations only');
  require(o.repository === TARGET.repository && o.event === 'workflow_dispatch', 'Repository/event mismatch');
  require(o.runAttempt === 1, 'Reruns require read-only reconciliation');
  require(typeof approval.ref === 'string' && /^refs\/heads\/[A-Za-z0-9._/-]+$/.test(approval.ref)
    && o.ref === approval.ref, 'Reviewed ref missing/mismatched');
  require(typeof approval.commit === 'string' && /^[a-f0-9]{40}$/.test(approval.commit)
    && o.commit === approval.commit, 'Reviewed commit missing/mismatched');
  require(Number.isFinite(o.observedAt) && o.observedAt <= now && now - o.observedAt <= 300_000,
    'Evidence absent/stale/future-dated');
  const e = o.environment;
  require(e?.name === TARGET.environment && e.can_admins_bypass === false, 'Environment/bypass mismatch');
  require(e?.deployment_branch_policy?.protected_branches === false
    && e?.deployment_branch_policy?.custom_branch_policies === true
    && o.branchPolicies?.length === 1 && o.branchPolicies[0].type === 'branch'
    && `refs/heads/${o.branchPolicies[0].name}` === approval.ref, 'Exact branch restriction missing');
  const review = e?.protection_rules?.find((rule) => rule.type === 'required_reviewers');
  const reviewerIds = review?.reviewers?.map((entry) => entry.reviewer?.id);
  const independent = approval.reviewerPolicy === 'independent';
  const ownerManual = approval.reviewerPolicy === 'owner-manual';
  require((independent || ownerManual) && typeof approval.requireOwnerInitiator === 'boolean', 'Reviewer policy unchosen/unknown');
  require(approval.reviewers?.length > 0
    && reviewerIds?.length === approval.reviewers.length
    && reviewerIds.every((id) => approval.reviewers.includes(id))
    && approval.reviewers.every((id) => reviewerIds.includes(id)), 'Required reviewers not exact');
  require((independent && review?.prevent_self_review === true)
    || (ownerManual && review?.prevent_self_review === false
      && approval.reviewers?.length === 1 && review?.reviewers?.[0]?.type === 'User'),
    'Environment does not match the explicitly chosen reviewer policy');
  require(Number.isSafeInteger(o.approvedReviewerId) && approval.reviewers?.includes(o.approvedReviewerId)
    && ((independent && o.approvedReviewerId !== o.actorId)
      || (ownerManual && (!approval.requireOwnerInitiator || o.approvedReviewerId === o.actorId)))
    && typeof o.runId === 'string' && o.runId.length > 0 && o.approvedRunId === o.runId,
    'Chosen reviewer policy and approval for this run are required');
  require(o.account?.authenticated === true && o.account.id === TARGET.accountId, 'Account identity unverified');
  require(o.billing?.providerEvidenceVerified === true && o.billing.plan === 'workers-free'
    && o.billing.maximumChargeUSD === 0, 'Free plan/zero-cost evidence missing; paid charges denied');
  const reservation = approval.quotaReservation;
  require(reservation != null && o.quota?.providerEvidenceVerified === true
    && o.quota.completeAccountUsage === true, 'Remaining account quota unknown');
  const dimensions = ['databaseSlots', 'workerSlots', 'cronSlots', 'd1RowsRead', 'd1RowsWritten',
    'storageBytes', 'workerRequests'];
  for (const dimension of dimensions) {
    require(Number.isSafeInteger(reservation?.[dimension]) && reservation[dimension] > 0
      && Number.isSafeInteger(o.quota?.remaining?.[dimension])
      && o.quota.remaining[dimension] >= reservation[dimension], `Quota insufficient/unknown: ${dimension}`);
  }
  require(o.inventory?.complete === true && Array.isArray(o.inventory.databaseIds)
    && Array.isArray(o.inventory.databaseNames) && Array.isArray(o.inventory.workerNames), 'Inventory incomplete');
  require(o.inventory?.databaseNames?.includes(TARGET.database) === false
    && o.inventory?.workerNames?.includes(TARGET.worker) === false, 'Name collision; never adopt/overwrite');
  require(o.workerCreateMethod === 'post-new-worker-id', 'Worker creation method unreviewed');
  require(approval.cleanup === true, 'Hourly cleanup not approved');
  require(typeof approval.alertDestination === 'string' && approval.alertDestination.length > 0
    && o.alert?.destination === approval.alertDestination && o.alert.deliveryTestVerified === true,
    'Alert destination/verified delivery missing');
  require(o.artifacts?.schema === ARTIFACTS['reviewed/0001.sql']
    && o.artifacts?.worker === ARTIFACTS['reviewed/cleanup.mjs'], 'Artifact mismatch');
  return { executionAllowed: false, modelBlockers: blockers };
}

// Pure write-order model: emits a label, never a URL, SQL, command or request.
// An in-flight, uncertain, failed or completed attempt is never retried. Real
// execution needs a durable one-shot journal and a separately reviewed adapter.
export function modelNextWrite(observation, approval, journal = [], now = Date.now()) {
  const { modelBlockers } = modelPreflight(observation, approval, now);
  if (modelBlockers.length) return { executionAllowed: false, next: null, reasons: modelBlockers };
  if (!Array.isArray(journal) || journal.length > WRITES.length
    || journal.some((entry, i) => entry.action !== WRITES[i] || entry.outcome !== 'confirmed')) {
    return { executionAllowed: false, next: null, reasons: ['Uncertain/invalid attempt: read-only reconciliation, no retry'] };
  }
  if (journal.length) {
    const created = journal[0];
    if (created.accountId !== TARGET.accountId || created.name !== TARGET.database
      || !/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/.test(created.databaseId ?? '')
      || observation.inventory.databaseIds.includes(created.databaseId)) {
      return { executionAllowed: false, next: null, reasons: ['New database receipt invalid; existing IDs forbidden'] };
    }
  }
  return { executionAllowed: false, next: WRITES[journal.length] ?? null, reasons: [] };
}

export function denyExecution() {
  throw new Error('BLOCKED: provisioning and authenticated preflight are hard-disabled; a separately reviewed implementation and action-time approvals are required');
}
export async function main(args) {
  if (args.length !== 1 || !['plan', 'preflight', 'provision'].includes(args[0])) {
    throw new Error('Usage: node ops/feedback-preview/controller.mjs plan');
  }
  if (args[0] !== 'plan') denyExecution();
  await verifyArtifacts();
  return plan();
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    console.log(JSON.stringify(await main(process.argv.slice(2)), null, 2));
  } catch {
    // Fixed message only: never echo args, environment, raw provider errors or data.
    console.error('BLOCKED: offline plan only. Provisioning/preflight unsupported; check reviewed artifacts and invocation.');
    process.exitCode = 1;
  }
}
