import { operation as QA_READY_OPERATION, mode as QA_READY_MODE, planHash as QA_READY_PLAN, validateContext as validateQaReady, allowed as qaReadyAllowed, scopedTransport as qaReadyTransport, collect as collectQaReady } from '../private-diagnostic-review/readiness-profile.mjs';
import { operation as QA_META_OPERATION, mode as QA_META_MODE, planHash as QA_META_PLAN, validateContext as validateQaMeta, allowed as qaMetaAllowed, scopedTransport as qaMetaTransport, collect as collectQaMeta } from '../private-diagnostic-review/profile.mjs';
import { PAGES_LOG_OPERATION, PAGES_LOG_MODE, PAGES_LOG_PLAN_HASH, PAGES_LOG_PATH, PAGES_PROJECT_PATH, validatePagesLogContext, pagesLogRequestAllowed, pagesLogTransport, projectLogs, projectPagesState } from '../diagnosis-production/pages-deployment-log.mjs';
import { collectDiagnosisReadiness } from '../d1/diagnosis-readiness.mjs';
import { READINESS_OPERATION, READINESS_MODE, READINESS_PLAN_HASH, READINESS_PAGES_PATH, READINESS_DATABASE_PATH, validateReadinessContext, readinessRequestAllowed, readinessTransport } from '../diagnosis-production/readiness-profile.mjs';
// Fixed-scope request implementation, exercised only with injected mock transport.
// There is intentionally no fetch default, credential reader or CLI entry point.
import { readFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { boundedFailure, readOnlyTransport, providerEnvelopeSummary, failureSummary, classifyReadFailure } from './diagnostics.mjs';
import { HEALTH_TARGETS, HEALTH_PLAN_HASH, healthTransport, heartbeatStatus, QA_DISCOVERY, plannedQaOrigin } from './health.mjs';
import { TARGET, SHARING, ARTIFACTS, sha256, checkArtifact, denyExecution } from './controller.mjs';
import { isProductionOperation, PRODUCTION_FEATURES, PRODUCTION_ARTIFACTS, PRODUCTION_PLAN_HASH, PRODUCTION_MODE, PRODUCTION_RECORD_OPERATION, PRODUCTION_COST_POLICY, EXCLUDED_DATABASE_IDS, productionDatabaseRequestAllowed } from '../diagnosis-production/database-profile.mjs';

import { CLEANUP_OPERATION, CLEANUP_MODE, CLEANUP_RECORD_OPERATION, CLEANUP_FEATURES, CLEANUP_ARTIFACTS, CLEANUP_PLAN_HASH, RETENTION_SCOPE, RETENTION_SCOPE_HASH, CLEANUP_SETUP_RUN, cleanupRequestAllowed } from '../diagnosis-production/cleanup-profile.mjs';
import { PRODUCTION_HEALTH_OPERATION, PRODUCTION_HEALTH_MODE, PRODUCTION_HEALTH_PLAN_HASH, PRODUCTION_HEALTH_TARGETS,
  validateProductionHealthContext, productionHealthRequestAllowed, productionHealthTransport, productionHeartbeatStatus } from '../diagnosis-production/cleanup-health.mjs';
import { PUBLIC_HEALTH_OPERATION, PUBLIC_HEALTH_MODE, PUBLIC_HEALTH_PLAN_HASH, PUBLIC_HEALTH_FEATURE, PUBLIC_HEALTH_ARTIFACTS,
  PUBLIC_HEALTH_BINDINGS, PUBLIC_HEALTH_URL, validatePublicHealthRecord, publicHealthRequestAllowed, matchesPublicHealthBindings } from '../diagnosis-production/public-health-profile.mjs';

const ACCOUNT = `/accounts/${TARGET.accountId}`;
const REPO = `/repos/${TARGET.repository}`;
const WORKFLOW = 'feedback-preview-control.yml';
const UUID = /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/;
const WORKER_ID = /^[a-f0-9]{32}$/;
const HASH = /^[a-f0-9]{64}$/;
const DIMENSIONS = ['databaseSlots', 'workerSlots', 'cronSlots', 'd1RowsRead', 'd1RowsWritten', 'storageBytes', 'workerRequests'];
export const FEATURES = Object.freeze([
  Object.freeze({ key: 'feedback', ...TARGET, schema: 'reviewed/0001.sql', module: 'reviewed/cleanup.mjs', statements: 9 }),
  Object.freeze({ key: 'sharing', ...SHARING, schema: 'reviewed/diagnosis/0001.sql', module: 'reviewed/diagnosis/cleanup.bundle', statements: 7 }),
]);
export function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map(k => `${JSON.stringify(k)}:${canonical(value[k])}`).join(',')}}`;
  return JSON.stringify(value);
}
export const PLAN_HASH = sha256(canonical({ account: TARGET.accountId, artifacts: ARTIFACTS,
  pairs: FEATURES.map(f => ({ database: f.database, worker: f.worker, binding: f.binding, environment: f.environment, cron: f.cron })),
  writes: ['D1_CREATE', 'SCHEMA', 'WORKER_CREATE_PRIVATE', 'VERSION_DEPLOY_BY_ID', 'CRON_BY_NAME'],
  compatibilityDate: '2026-05-22', maxCloudflareWrites: 10, paidUSD: 0,
  claim: { backend: 'github-artifact-v4', uploads: 1, archiveBytes: 8192, retentionDays: 1, access: 'existing-repository', overwrite: false } }));
export const APPROVED_RECORD_HASH = null;
export function createApprovedAdapter() { denyExecution(); }
function need(ok, code) { if (!ok) throw new Error(`BLOCKED:${code}`); }
const fresh = (stamp, now, age) => Number.isSafeInteger(stamp) && stamp <= now && now - stamp <= age;

// trustedRecordHash MUST come from independently reviewed protected setup, never
// dispatch JSON or the record itself. Tests use synthetic records and hashes.
// Screenshots remain private: only their hashes and reviewed assessment belong
// in a future record. A hash proves byte identity, not authenticity or plan truth.
export function validateRecord(recordBytes, trustedRecordHash, now, operation = 'preview') {
  need(![PRODUCTION_HEALTH_OPERATION, READINESS_OPERATION, PAGES_LOG_OPERATION].includes(operation), 'HEALTH_MODE');
  if (operation === PUBLIC_HEALTH_OPERATION) return validatePublicHealthRecord(recordBytes, trustedRecordHash, now);
  const production = isProductionOperation(operation);
  const cleanup = operation === CLEANUP_OPERATION;
  const planHash = cleanup ? CLEANUP_PLAN_HASH : production ? PRODUCTION_PLAN_HASH : PLAN_HASH;
  need(Buffer.byteLength(recordBytes) <= 65_536, 'APPROVAL_RECORD_SIZE');
  need(HASH.test(trustedRecordHash ?? '') && sha256(recordBytes) === trustedRecordHash, 'APPROVAL_RECORD_PIN');
  let r;
  try { r = JSON.parse(recordBytes); } catch { throw new Error('BLOCKED:APPROVAL_RECORD_JSON'); }
  need((production ? r.mode === (cleanup ? CLEANUP_MODE : PRODUCTION_MODE) : ['create-empty-preview-pairs', 'read-only-preflight', 'cleanup-health'].includes(r.mode))
    && r.operation === (cleanup ? CLEANUP_RECORD_OPERATION : production ? PRODUCTION_RECORD_OPERATION : 'create-two-preview-pairs-20261007') && r.planHash === planHash
    && r.accountId === TARGET.accountId, 'RECORD_SCOPE');
  need(r.mode !== 'cleanup-health' || r.healthPlanHash === HEALTH_PLAN_HASH, 'HEALTH_PLAN_PIN');
  need(/^refs\/heads\/[A-Za-z0-9][A-Za-z0-9._/-]*$/.test(r.ref ?? '')
    && !r.ref.includes('..') && !r.ref.includes('//') && !r.ref.endsWith('/')
    && /^[a-f0-9]{40}$/.test(r.commit ?? ''), 'REVIEWED_REF');
  need(Number.isSafeInteger(r.runId) && r.runId > 0 && fresh(r.approvedAt, now, 3_600_000), 'REVIEWED_RUN');
  need(['owner-manual', 'independent'].includes(r.reviewerPolicy)
    && Array.isArray(r.reviewers) && r.reviewers.length > 0 && new Set(r.reviewers).size === r.reviewers.length
    && r.reviewers.every(id => Number.isSafeInteger(id) && id > 0), 'REVIEWER_POLICY');
  need(r.reviewerPolicy !== 'owner-manual' || r.reviewers.length === 1, 'OWNER_REVIEWER');
  need(typeof r.requireOwnerInitiator === 'boolean', 'INITIATOR_POLICY_UNCHOSEN');
  const e = r.costEvidence;
  if (production) {
    // This hash identifies the actual current owner confirmation and its account
    // context, not an image or an API verification. It proves identity, not truth.
    // It must be prepared only after that reply is received and reviewed.
    const fields = ['kind', 'accountId', 'operation', 'planHash', 'workersPlan', 'maximumChargeUSD',
      'quotaPolicy', 'usageHeadroom', 'confirmedAt', 'confirmationEvidenceSha256', 'databaseLimit', 'reserve', ...(cleanup ? ['workerLimit', 'cronLimit'] : [])];
    need(e?.kind === PRODUCTION_COST_POLICY.kind && Object.keys(e).every(key => fields.includes(key))
      && e.accountId === TARGET.accountId && e.operation === r.operation && e.planHash === planHash
      && e.workersPlan === 'workers-free' && e.maximumChargeUSD === 0
      && e.quotaPolicy === 'provider-enforced-free-stop' && e.usageHeadroom === PRODUCTION_COST_POLICY.usageHeadroom
      && fresh(e.confirmedAt, now, PRODUCTION_COST_POLICY.maximumConfirmationAgeMs)
      && HASH.test(e.confirmationEvidenceSha256 ?? ''), 'CURRENT_FREE_PLAN_EVIDENCE');
    need(e.databaseLimit === 10 && e.reserve?.databaseSlots === (cleanup ? 0 : 2), 'QUOTA_RESERVATION');
    if (cleanup) need(e.workerLimit === 100 && e.cronLimit === 5 && e.reserve.workerSlots === 2 && e.reserve.cronSlots === 2, 'QUOTA_RESERVATION');
  } else {
    const dayStart = Math.floor(now / 86_400_000) * 86_400_000;
    need(e?.kind === 'owner-ui-reviewed' && e.accountId === TARGET.accountId && e.operation === r.operation
      && e.planHash === planHash && e.workersPlan === 'workers-free' && e.maximumChargeUSD === 0
      && e.assessment === 'within-reviewed-zero-charge-envelope'
      && ['explicit-plan-label', 'enforced-free-cap-pattern'].includes(e.planBasis)
      && HASH.test(e.screenshotSha256 ?? '') && HASH.test(e.reviewEvidenceSha256 ?? '')
      && HASH.test(e.unchangedPlanReviewSha256 ?? '')
      && fresh(e.capturedAt, now, 86_400_000) && e.capturedAt >= dayStart
      && fresh(e.reviewedAt, now, 86_400_000) && e.reviewedAt >= e.capturedAt
      && e.quotaDateUTC === new Date(dayStart).toISOString().slice(0, 10)
      && e.resetAt === dayStart + 86_400_000 && e.validUntil > now && e.validUntil <= e.resetAt,
    'OWNER_UI_COST_EVIDENCE');
    for (const key of DIMENSIONS) need(Number.isSafeInteger(e.reserve?.[key]) && e.reserve[key] > 0, 'QUOTA_RESERVATION');
    for (const key of ['d1RowsRead', 'd1RowsWritten', 'storageBytes', 'workerRequests'])
      need(Number.isSafeInteger(e.remaining?.[key]) && Number.isSafeInteger(e.interveningUsageAllowance?.[key])
        && e.interveningUsageAllowance[key] > 0
        && e.remaining[key] - e.interveningUsageAllowance[key] >= e.reserve[key], 'QUOTA_ASSESSMENT');
    need(e.reserve.databaseSlots >= 2 && e.reserve.workerSlots >= 2 && e.reserve.cronSlots >= 2
      && e.reserve.workerRequests >= 48 && e.databaseLimit === 10 && e.workerLimit === 100
      && e.cronLimit === 5, 'TWO_PAIR_FREE_RESERVATION');
  }
  need(r.claimArtifact?.archiveBytes === 8192 && r.claimArtifact.retentionDays === 1
    && r.claimArtifact.access === 'existing-repository'
    && HASH.test(r.claimArtifact.storageBudgetReviewSha256 ?? ''), 'CLAIM_ARTIFACT_BUDGET');
  if (!production) {
    need(r.cleanupApproval === 'both-pinned-hourly-crons' && HASH.test(r.alert?.destinationChoiceSha256 ?? '')
      && r.alert?.deliveryStatus === 'pending' && fresh(r.alert?.reviewedAt, now, 86_400_000), 'CLEANUP_ALERT_APPROVAL');
    need(r.cronTargeting === 'name-after-id-recheck-residual-rename-risk-accepted', 'CRON_RENAME_RISK');
  }
  if (cleanup) {
    need(r.cleanupApproval === 'both-pinned-production-hourly-crons'
      && r.retentionScopeHash === RETENTION_SCOPE_HASH && r.persistentBindingAndCron === true
      && r.notificationStatus === 'parent-conversation-approved-not-connected'
      && HASH.test(r.cleanupApprovalEvidenceSha256 ?? ''), 'CLEANUP_ALERT_APPROVAL');
    need(r.cronTargeting === 'name-after-id-recheck-residual-rename-risk-accepted', 'CRON_RENAME_RISK');
  }
  const reconciled = production ? r.reconciledPriorRuns : r.reconciledNoWriteRuns;
  need(Array.isArray(reconciled), 'DURABLE_RUN_RECONCILIATION');
  for (const safe of reconciled) need(Number.isSafeInteger(safe.id) && safe.id !== r.runId
    && /^[a-f0-9]{40}$/.test(safe.headSha ?? '') && HASH.test(safe.reviewEvidenceSha256 ?? '')
    && (safe.classification === 'independently-reviewed-no-mutations'
      || (production && safe.classification === 'independently-reviewed-preview-only'
        && safe.planHash === PLAN_HASH)
      || (cleanup && safe.classification === 'independently-reviewed-production-databases-only'
        && safe.id === CLEANUP_SETUP_RUN.id && safe.headSha === CLEANUP_SETUP_RUN.headSha
        && safe.planHash === CLEANUP_SETUP_RUN.planHash)), 'RECONCILED_RUN');
  return r;
}

async function createAdapter({ transport, durableClaims, recordBytes, trustedRecordHash, readContext, now = Date.now, onStage = () => {}, onEnvelope = () => {}, onReceipt = () => {}, operation = 'preview', logSecrets = [] }) {
  const production = isProductionOperation(operation);
  const productionHealth = operation === PRODUCTION_HEALTH_OPERATION;
  const readiness = operation === READINESS_OPERATION;
  const pagesLog = operation === PAGES_LOG_OPERATION;
  const qaReady = operation === QA_READY_OPERATION;
  const qaMeta = operation === QA_META_OPERATION;
  const observation = productionHealth || readiness || pagesLog || qaMeta || qaReady;
  const publicHealth = operation === PUBLIC_HEALTH_OPERATION;
  const cleanup = operation === CLEANUP_OPERATION;
  const features = observation ? [] : publicHealth ? [PUBLIC_HEALTH_FEATURE] : cleanup ? CLEANUP_FEATURES : production ? PRODUCTION_FEATURES : FEATURES;
  const pinnedArtifacts = publicHealth ? PUBLIC_HEALTH_ARTIFACTS : cleanup ? CLEANUP_ARTIFACTS : production ? PRODUCTION_ARTIFACTS : ARTIFACTS;
  const planHash = qaReady ? QA_READY_PLAN : qaMeta ? QA_META_PLAN : pagesLog ? PAGES_LOG_PLAN_HASH : readiness ? READINESS_PLAN_HASH : publicHealth ? PUBLIC_HEALTH_PLAN_HASH : productionHealth ? PRODUCTION_HEALTH_PLAN_HASH : cleanup ? CLEANUP_PLAN_HASH : production ? PRODUCTION_PLAN_HASH : PLAN_HASH;
  const readSnapshot = observation ? Object.freeze(structuredClone(readContext)) : null;
  const validateApproval = () => qaReady ? validateQaReady(readSnapshot) : qaMeta ? validateQaMeta(readSnapshot) : pagesLog ? validatePagesLogContext(readSnapshot) : readiness ? validateReadinessContext(readSnapshot) : productionHealth ? validateProductionHealthContext(readSnapshot)
    : validateRecord(approvedBytes, trustedRecordHash, now(), operation);
  need(typeof transport === 'function', 'NO_TRANSPORT');
  const approvedBytes = String(recordBytes);
  const record = validateApproval();
  const artifacts = {};
  for (const f of features) for (const path of (publicHealth || cleanup ? [f.module] : production ? [f.schema] : [f.schema, f.module])) {
    const bytes = await readFile(new URL(path, import.meta.url));
    checkArtifact(bytes, pinnedArtifacts[path]); artifacts[path] = bytes;
  }
  const journal = [];
  let started = false;
  let requests = 0;
  let preflightAt = null;
  let inventory;
  async function request(service, method, path, body) {
    need(!production || service === 'github' || (qaReady ? qaReadyAllowed(path, method, body === undefined ? undefined : JSON.stringify(body)) : qaMeta ? qaMetaAllowed(path, method, body === undefined ? undefined : JSON.stringify(body)) : pagesLog ? pagesLogRequestAllowed(path, method, body === undefined ? undefined : JSON.stringify(body)) : readiness ? readinessRequestAllowed(path, method, body === undefined ? undefined : JSON.stringify(body)) : productionHealth ? productionHealthRequestAllowed(path, method, body === undefined ? undefined : JSON.stringify(body))
      : (publicHealth ? publicHealthRequestAllowed : cleanup ? cleanupRequestAllowed : productionDatabaseRequestAllowed)(path, method)), 'TRANSPORT_SCOPE');
    need(++requests <= 120, 'REQUEST_BOUND');
    const root = service === 'github' ? 'https://api.github.com' : 'https://api.cloudflare.com/client/v4';
    const url = root + path;
    const controller = new AbortController();
    const observedRead = pagesLog && service === 'cloudflare';
    const timeoutMs = observedRead && path === PAGES_LOG_PATH ? 30_000 : 10_000;
    const requestedAt = performance.now();
    let timer, deadlineExpired = false, responseStatus = null, phase = 'awaiting-response';
    try {
      const timeout = new Promise((_, reject) => { timer = setTimeout(() => {
        deadlineExpired = true; controller.abort(); reject(new Error('BLOCKED:REQUEST_DEADLINE_EXCEEDED'));
      }, timeoutMs); });
      const operation = (async () => {
        const response = await transport(url, { method, redirect: 'error', signal: controller.signal,
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
        need(!deadlineExpired, 'REQUEST_DEADLINE_EXCEEDED');
        responseStatus = Number.isInteger(response.status) && response.status >= 100 && response.status <= 599 ? response.status : null;
        phase = 'response-validation';
        need(response.url === url && response.redirected === false && [200, 201].includes(response.status), 'RESPONSE_IDENTITY_STATUS');
        need(response.headers.get('content-type')?.includes('application/json'), 'RESPONSE_TYPE');
        phase = 'reading-body';
        const reader = response.body?.getReader(); need(reader, 'RESPONSE_BODY');
        const chunks = []; let size = 0;
        try { while (true) { const { done, value } = await reader.read(); if (done) break;
          size += value.byteLength; need(size <= 1_048_576, 'RESPONSE_SIZE'); chunks.push(Buffer.from(value));
        } } finally { reader.releaseLock(); }
        need(!deadlineExpired, 'REQUEST_DEADLINE_EXCEEDED');
        phase = 'parsing-body';
        const json = JSON.parse(Buffer.concat(chunks).toString('utf8'));
        phase = 'provider-validation';
        if (service === 'cloudflare') {
          const envelope = providerEnvelopeSummary(json); onEnvelope(envelope);
          // Official beta Workers SDK methods unwrap result without requiring errors.
          // Match only this controller's list/create/get/version endpoints; never D1/Cron.
          const workerPath = path.startsWith(ACCOUNT + '/') ? path.split('?')[0].slice(ACCOUNT.length) : '';
          const workersEnvelope = (['GET', 'POST'].includes(method) && workerPath === '/workers/workers')
            || (method === 'GET' && /^\/workers\/workers\/[a-f0-9]{32}$/.test(workerPath))
            || (method === 'GET' && features.some(f => workerPath === `/workers/workers/${f.worker}`))
            || (method === 'POST' && /^\/workers\/workers\/[a-f0-9]{32}\/versions$/.test(workerPath))
            || (method === 'GET' && /^\/workers\/workers\/[a-f0-9]{32}\/versions\/[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/.test(workerPath));
          const noErrors = envelope.errors === 'empty'
            || (workersEnvelope && ['absent', 'null'].includes(envelope.errors));
          need(envelope.success === 'true' && noErrors, 'PROVIDER_RESULT');
        }
        return json;
      })();
      return await Promise.race([operation, timeout]);
    } catch (error) {
      controller.abort();
      const failure = boundedFailure('REQUEST_UNCERTAIN_OR_INVALID', error);
      if (observedRead) failure.readFailure = classifyReadFailure(error, {
        deadlineExpired, timeoutMs, elapsedMs: Math.round(performance.now() - requestedAt),
        status: responseStatus, phase });
      throw failure;
    }
    finally { clearTimeout(timer); }
  }
  const gh = path => request('github', 'GET', REPO + path);
  const cf = path => request('cloudflare', 'GET', ACCOUNT + path);
  async function listResources(path, idKey) {
    const rows = []; let total;
    for (let page = 1; page <= 10; page++) {
      const data = await cf(`${path}?page=${page}&per_page=100`);
      const info = data.result_info;
      need(Array.isArray(data.result) && data.result.length <= 100 && info?.page === page
        && info.per_page === 100 && Number.isSafeInteger(info.total_count) && info.total_count >= 0
        && info.total_count <= 1000, 'INVENTORY_COMPLETENESS');
      total ??= info.total_count; need(info.total_count === total, 'INVENTORY_CHANGED');
      for (const row of data.result) need(typeof row.name === 'string'
        && (idKey === 'uuid' ? UUID : WORKER_ID).test(row[idKey] ?? ''), 'INVENTORY_ID');
      rows.push(...data.result.map(row => ({ id: row[idKey], name: row.name })));
      need(new Set(rows.map(r => r.id)).size === rows.length && rows.length <= total, 'INVENTORY_DUPLICATE');
      if (rows.length === total) return rows;
      need(data.result.length === 100, 'INVENTORY_TRUNCATED');
    }
    throw new Error('BLOCKED:INVENTORY_PAGE_BOUND');
  }
  async function githubGate() {
    onStage('github-preflight');
    const run = await gh(`/actions/runs/${record.runId}`);
    need(run.id === record.runId && run.run_attempt === 1 && run.event === 'workflow_dispatch'
      && run.head_sha === record.commit && `refs/heads/${run.head_branch}` === record.ref
      && run.path === `.github/workflows/${WORKFLOW}` && run.repository?.full_name === TARGET.repository
      && Number.isSafeInteger(run.workflow_id) && Number.isSafeInteger(run.actor?.id)
      && Number.isSafeInteger(run.triggering_actor?.id) && run.status === 'in_progress', 'RUN_IDENTITY');
    const branch = await gh(`/git/ref/heads/${record.ref.slice('refs/heads/'.length)}`);
    need(branch.ref === record.ref && branch.object?.sha === record.commit, 'BRANCH_MOVED');
    const history = await gh(`/actions/workflows/${WORKFLOW}/runs?per_page=100&page=1`);
    need(Array.isArray(history.workflow_runs) && history.total_count === history.workflow_runs.length
      && history.total_count <= 100 && new Set(history.workflow_runs.map(r => r.id)).size === history.total_count
      && history.workflow_runs.every(r => Number.isSafeInteger(r.id) && r.workflow_id === run.workflow_id && r.path === run.path)
      && history.workflow_runs.some(r => r.id === record.runId && r.head_sha === record.commit && r.run_attempt === 1), 'RUN_HISTORY_INCOMPLETE');
    let unreconciledPriorRunCount = 0;
    for (const prior of history.workflow_runs) {
      if (prior.id === record.runId) continue;
      const safe = (production ? record.reconciledPriorRuns : record.reconciledNoWriteRuns).find(r => r.id === prior.id);
      const reconciled = safe && safe.headSha === prior.head_sha && prior.status === 'completed' && prior.run_attempt === 1;
      if (!reconciled) unreconciledPriorRunCount++;
      need(reconciled || ['read-only-preflight', 'cleanup-health', PRODUCTION_HEALTH_MODE, READINESS_MODE, PAGES_LOG_MODE, QA_META_MODE, QA_READY_MODE].includes(record.mode), 'PRIOR_RUN_REQUIRES_READ_ONLY_RECONCILIATION');
    }
    const reviews = await gh(`/actions/runs/${record.runId}/approvals`);
    need(Array.isArray(reviews), 'RUN_REVIEWS');
    for (const environmentName of [TARGET.environment]) {
      const environment = await gh(`/environments/${environmentName}`);
      need(environment.name === environmentName && Number.isSafeInteger(environment.id)
        && environment.can_admins_bypass === false && environment.deployment_branch_policy?.protected_branches === false
        && environment.deployment_branch_policy.custom_branch_policies === true, 'ENVIRONMENT');
      const rules = environment.protection_rules?.filter(r => r.type === 'required_reviewers');
      need(rules?.length === 1 && rules[0].prevent_self_review === (record.reviewerPolicy === 'independent')
        && Array.isArray(rules[0].reviewers) && rules[0].reviewers.length === record.reviewers.length
        && rules[0].reviewers.every(r => r.type === 'User' && record.reviewers.includes(r.reviewer?.id))
        && record.reviewers.every(id => rules[0].reviewers.some(r => r.reviewer.id === id)), 'ENVIRONMENT_REVIEWERS');
      const policies = await gh(`/environments/${environmentName}/deployment-branch-policies?per_page=100&page=1`);
      need(policies.total_count === 1 && policies.branch_policies?.length === 1
        && policies.branch_policies[0].type === 'branch' && `refs/heads/${policies.branch_policies[0].name}` === record.ref, 'ENVIRONMENT_REF');
      const matches = reviews.filter(r => r.environments?.some(e => e.id === environment.id && e.name === environmentName));
      need(matches.length === 1 && matches[0].state === 'approved' && record.reviewers.includes(matches[0].user?.id), 'RUN_ENVIRONMENT_APPROVAL');
      if (record.reviewerPolicy === 'independent') need(matches[0].user.id !== run.actor?.id
        && matches[0].user.id !== run.triggering_actor?.id, 'SELF_REVIEW');
      if (record.reviewerPolicy === 'owner-manual' && record.requireOwnerInitiator)
        need(run.actor?.id === record.reviewers[0] && run.triggering_actor?.id === record.reviewers[0], 'OWNER_INITIATOR');
    }
    return { unreconciledPriorRunCount };
  }
  async function inspect() {
    validateApproval();
    const { unreconciledPriorRunCount } = await githubGate();
    if (publicHealth) {
      onStage('inventory-preflight');
      const workers = await listResources('/workers/workers', 'id');
      need(!workers.some(w => w.name === PUBLIC_HEALTH_FEATURE.worker), 'COLLISION');
      need(workers.length + 1 <= 100, 'RESOURCE_SLOTS');
      need((await cf('/workers/subdomain')).result?.subdomain === 'soykururu143', 'ACCOUNT');
      for (const t of PRODUCTION_HEALTH_TARGETS) {
        const d = (await cf(`/d1/database/${t.databaseId}`)).result;
        need(d?.uuid === t.databaseId && d.name === t.databaseName, 'DATABASE_READBACK');
      }
      inventory = { workers, databases: PRODUCTION_HEALTH_TARGETS.map(t => ({ id: t.databaseId, name: t.databaseName })) };
      preflightAt = now();
      return { accountId: TARGET.accountId, planHash, workerCount: workers.length, targetsAbsent: true,
        capacityAvailable: true, unreconciledPriorRunCount, observedAt: preflightAt,
        costProvenance: 'historical-owner-declaration; no current-plan API verification; no billing/plan changes' };
    }
    if (!production) {
      onStage('account-preflight');
      const account = await cf(''); need(account.result?.id === TARGET.accountId, 'ACCOUNT');
    }
    onStage('inventory-preflight');
    const databases = await listResources('/d1/database', 'uuid');
    const workers = production && !cleanup ? [] : await listResources('/workers/workers', 'id');
    const targetsAbsent = features.every(f => (cleanup || !databases.some(d => d.name === f.database)) && !workers.some(w => w.name === f.worker));
    if (cleanup) {
      for (const f of features) {
        need(databases.filter(d => d.id === f.databaseId && d.name === f.database).length === 1
          && databases.filter(d => d.name === f.database).length === 1, 'DATABASE_READBACK');
        const d = (await cf(`/d1/database/${f.databaseId}`)).result;
        need(d?.uuid === f.databaseId && d.name === f.database, 'DATABASE_READBACK');
      }
    }
    need(targetsAbsent || record.mode === 'read-only-preflight', 'COLLISION');
    let cronCount = 0;
    for (const worker of workers) {
      const schedules = (await cf(`/workers/scripts/${encodeURIComponent(worker.name)}/schedules`)).result?.schedules;
      need(Array.isArray(schedules) && schedules.every(s => typeof s?.cron === 'string'), 'CRON_INVENTORY');
      cronCount += schedules.length;
    }
    const evidence = record.costEvidence;
    const capacityAvailable = evidence.databaseLimit - databases.length >= evidence.reserve.databaseSlots
      && ((production && !cleanup) || (evidence.workerLimit - workers.length >= evidence.reserve.workerSlots
        && evidence.cronLimit - cronCount >= evidence.reserve.cronSlots));
    need(capacityAvailable || record.mode === 'read-only-preflight', 'RESOURCE_SLOTS');
    inventory = { databases, workers }; preflightAt = now();
    return { accountId: TARGET.accountId, planHash, databaseCount: databases.length,
      workerCount: workers.length, cronCount, unreconciledPriorRunCount, targetsAbsent, capacityAvailable, costProvenance: production
        ? 'owner-current-free-plan-confirmation; usage headroom not measured; not authenticated plan/quota API evidence'
        : 'owner-ui-reviewed; not authenticated billing/quota API evidence',
      observedAt: preflightAt, executionEnabled: false };
  }
  async function pagesDeploymentLog() {
    need(pagesLog && record.mode === PAGES_LOG_MODE, 'READ_ONLY_MODE');
    need(!started, 'ATTEMPT_ALREADY_STARTED'); started = true;
    validateApproval(); await githubGate();
    const observations = { logs: null, pages: null }, failures = {};
    // These are independently authorized GETs. Failure of either never retries it
    // or suppresses the other; actual HTTP refusals stay explicit in the report.
    for (const [key, stage, endpoint, path, project] of [
      ['logs', 'pageslog', 'pages-deployment-log', PAGES_LOG_PATH, value => projectLogs(value, logSecrets)],
      ['pages', 'pagesproject', 'pages-project', PAGES_PROJECT_PATH, projectPagesState],
    ]) {
      onStage(stage);
      try {
        observations[key] = project((await request('cloudflare', 'GET', path)).result);
        onReceipt({ mode: PAGES_LOG_MODE, observation: key, result: observations[key] });
      } catch (error) {
        failures[key] = { endpoint, ...failureSummary(error),
          ...(error.readFailure ? { request: error.readFailure } : { classification: 'projection-invalid' }) };
        onReceipt({ mode: PAGES_LOG_MODE, observation: key, failure: failures[key] });
      }
    }
    return { mode: PAGES_LOG_MODE, planHash, readOnly: true, ...observations, failures,
      completed: Object.keys(failures).length === 0, cloudflareReadsAttempted: 2,
      cloudflareWrites: 0, databaseQueries: 0, liveIntakeVerified: false,
      observedAt: new Date(now()).toISOString() };
  }
  async function qaMetadata() {
    need(qaMeta && record.mode === QA_META_MODE, 'READ_ONLY_MODE');
    need(!started, 'ATTEMPT_ALREADY_STARTED'); started = true;
    validateApproval(); await githubGate();
    const result = await collectQaMeta(async (path, sql) =>
      (await request('cloudflare', sql === undefined ? 'GET' : 'POST', path, sql === undefined ? undefined : {sql})).result);
    return {...result, mode: QA_META_MODE, planHash, readOnly: true, intakeEnabled: false, observedAt: new Date(now()).toISOString()};
  }
  async function qaReadiness() {
    need(qaReady && record.mode === QA_READY_MODE, 'READ_ONLY_MODE');
    need(!started, 'ATTEMPT_ALREADY_STARTED'); started = true;
    validateApproval(); await githubGate();
    const result = await collectQaReady(async (path, sql) =>
      (await request('cloudflare', sql === undefined ? 'GET' : 'POST', path, sql === undefined ? undefined : {sql})).result, now());
    return {...result, mode: QA_READY_MODE, planHash, readOnly: true, intakeEnabled: false, observedAt: new Date(now()).toISOString()};
  }
  async function readinessInventory() {
    need(readiness && record.mode === READINESS_MODE, 'READ_ONLY_MODE');
    need(!started, 'ATTEMPT_ALREADY_STARTED'); started = true;
    validateApproval(); await githubGate();
    const result = await collectDiagnosisReadiness(async (path, sql) => {
      onStage(path === READINESS_PAGES_PATH ? 'pagesproject' : path === READINESS_DATABASE_PATH ? 'd1identity' : 'd1schema');
      return (await request('cloudflare', sql === undefined ? 'GET' : 'POST', path, sql === undefined ? undefined : { sql })).result;
    });
    return { ...result, mode: READINESS_MODE, planHash, readOnly: true, intakeEnabled: false, observedAt: new Date(now()).toISOString() };
  }
  async function health() {
    need(record.mode === (productionHealth ? PRODUCTION_HEALTH_MODE : 'cleanup-health'), 'HEALTH_MODE');
    need(!started, 'ATTEMPT_ALREADY_STARTED'); started = true;
    validateApproval();
    await githubGate();
    let qaOrigin = plannedQaOrigin(null);
    if (!productionHealth) {
      onStage('account-preflight');
      need((await cf('')).result?.id === TARGET.accountId, 'ACCOUNT');
      onStage('health-subdomain');
      try { qaOrigin = plannedQaOrigin((await request('cloudflare', 'GET', QA_DISCOVERY.path)).result); }
      catch { /* Discovery remains explicitly unknown; heartbeat checks are independent. */ }
    }
    const targets = productionHealth ? PRODUCTION_HEALTH_TARGETS : HEALTH_TARGETS;
    onStage('health-identities');
    for (const target of targets) {
      const database = (await cf(`/d1/database/${target.databaseId}`)).result;
      need(database?.uuid === target.databaseId && database.name === target.databaseName, 'HEALTH_DATABASE_IDENTITY');
    }
    onStage('health-heartbeats');
    const result = productionHealth ? { mode: PRODUCTION_HEALTH_MODE, readOnly: true, intakeEnabled: false,
      alertDeliveryVerified: false } : { mode: 'cleanup-health', qaOrigin, intakeEnabled: false };
    for (const target of targets) {
      validateApproval();
      const response = await request('cloudflare', 'POST', `${ACCOUNT}/d1/database/${target.databaseId}/query`, { sql: target.sql });
      result[target.feature] = (productionHealth ? productionHeartbeatStatus : heartbeatStatus)(target.feature, response.result, now());
    }
    if (productionHealth) { result.observedAt = new Date(now()).toISOString(); result.actualHeartbeatVerified = result.sharing.healthy && result.feedback.healthy; }
    return result;
  }
  async function write(f, step, path, body, validate) {
    need(journal.length < (publicHealth ? 2 : cleanup ? 6 : production ? 4 : 10) && !journal.some(x => x.feature === f.key && x.step === step), 'WRITE_BOUND');
    validateApproval();
    onStage(`write-${step}`);
    const entry = { feature: f.key, step, startedAt: now(), outcome: 'in-progress', requestHash: sha256(canonical(body)) };
    journal.push(entry); // Set BEFORE transport; any exception permanently poisons this instance.
    try { const response = await request('cloudflare', step === 'cron' ? 'PUT' : 'POST', ACCOUNT + path, body);
      validate(response.result); entry.outcome = 'confirmed'; entry.confirmedAt = now(); return response.result;
    } catch (error) { entry.outcome = 'uncertain'; throw boundedFailure('WRITE_REQUIRES_READ_ONLY_RECONCILIATION', error); }
  }
  function workerIdentity(worker, f, id) {
    need(WORKER_ID.test(worker?.id ?? '') && worker.name === f.worker && (!id || worker.id === id)
      && !inventory.workers.some(w => w.id === worker.id) && worker.logpush === false
      && worker.observability?.enabled === false && worker.subdomain?.enabled === publicHealth
      && worker.subdomain.previews_enabled === false, 'NEW_WORKER_IDENTITY');
  }
  function matchesD1Binding(bindings, expected) {
    if (!Array.isArray(bindings) || bindings.length !== 1) return false;
    const binding = bindings[0];
    if (!binding || typeof binding !== 'object' || Array.isArray(binding)) return false;
    return Object.keys(binding).every(key => ['type', 'name', 'database_id', 'id'].includes(key))
      && binding.type === expected.type && binding.name === expected.name && binding.database_id === expected.database_id
      && (!Object.hasOwn(binding, 'id') || binding.id === expected.database_id);
  }
  async function provision() {
    need(record.mode === (publicHealth ? PUBLIC_HEALTH_MODE : cleanup ? CLEANUP_MODE : production ? PRODUCTION_MODE : 'create-empty-preview-pairs'), 'READ_ONLY_MODE');
    need(!started, 'ATTEMPT_ALREADY_STARTED');
    started = true; // Poison even a failed preflight; prohibit concurrent/repeated attempts.
    const inspected = await inspect(); // Never use a caller-provided preflight receipt.
    need(fresh(preflightAt, now(), 300_000), 'PREFLIGHT_STALE');
    need(requests + (cleanup ? 18 : production ? 6 : 22) <= 120, 'REQUEST_BUDGET_BEFORE_WRITES');
    // This separate trusted integration MUST implement durable, atomic create-if-absent.
    // artifact-claim.mjs supplies the pinned official client wrapper; no SDK is
    // installed/wired by default. An ephemeral Map/file is only a test fake.
    need(typeof durableClaims?.createExclusive === 'function' && typeof durableClaims?.read === 'function', 'DURABLE_CLAIM_UNCONFIGURED');
    onStage('claim');
    const claimName = `${publicHealth ? 'gemnao-production-public-health' : cleanup ? 'gemnao-production-cleanup' : production ? 'gemnao-production-databases' : 'gemnao-preview-data'}-claim-${record.runId}-${planHash}`;
    const claim = { runId: record.runId, repository: TARGET.repository, planHash,
      recordHash: trustedRecordHash, nonce: randomUUID() };
    try {
      const receipt = await durableClaims.createExclusive(claimName, structuredClone(claim));
      need(typeof receipt?.id === 'string' && receipt.id.length > 0, 'DURABLE_CLAIM_RECEIPT');
      const persisted = await durableClaims.read(receipt.id);
      need(persisted?.name === claimName && canonical(persisted.payload) === canonical(claim), 'DURABLE_CLAIM_READBACK');
    } catch (error) { throw boundedFailure('DURABLE_CLAIM_REQUIRES_READ_ONLY_RECONCILIATION', error); }
    if (publicHealth) {
      const f = PUBLIC_HEALTH_FEATURE;
      const worker = await write(f, 'worker', '/workers/workers', { name: f.worker,
        subdomain: { enabled: true, previews_enabled: false }, logpush: false, observability: { enabled: false } }, w => {
        workerIdentity(w, f); need(fresh(Date.parse(w.created_on), now(), 300_000), 'NEW_WORKER_TIMESTAMP');
      });
      workerIdentity((await cf(`/workers/workers/${worker.id}`)).result, f, worker.id);
      onReceipt({ step: 'worker-created', workerName: f.worker, workerId: worker.id, publicSubdomain: true, confirmedAt: now() });
      const body = { compatibility_date: '2026-05-22', main_module: 'health.mjs', bindings: PUBLIC_HEALTH_BINDINGS,
        modules: [{ name: 'health.mjs', content_type: 'application/javascript+module', content_base64: artifacts[f.module].toString('base64') }] };
      const version = await write(f, 'version', `/workers/workers/${worker.id}/versions?deploy=true`, body, v => {
        need(UUID.test(v?.id ?? '') && v.main_module === body.main_module && matchesPublicHealthBindings(v.bindings), 'VERSION_RESPONSE');
      });
      const readback = (await cf(`/workers/workers/${worker.id}/versions/${version.id}?include=modules`)).result;
      need(readback?.id === version.id && readback.main_module === body.main_module
        && matchesPublicHealthBindings(readback.bindings) && canonical(readback.modules) === canonical(body.modules), 'VERSION_READBACK');
      workerIdentity((await cf(`/workers/workers/${worker.id}`)).result, f, worker.id);
      const receipt = { workerName: f.worker, workerId: worker.id, versionId: version.id, publicUrl: PUBLIC_HEALTH_URL,
        databaseIds: PRODUCTION_HEALTH_TARGETS.map(t => t.databaseId), persistentBindings: true,
        moduleHash: pinnedArtifacts[f.module], cacheSeconds: 300, rateLimit: { limit: 1, period: 60, scope: 'per-location-best-effort' }, confirmedAt: now() };
      onReceipt({ step: 'version-deployed', ...receipt });
      return { mode: PUBLIC_HEALTH_MODE, receipts: [receipt], journal: structuredClone(journal),
        publicEndpointVerified: false, alertDeliveryVerified: false, intakeEnabled: false };
    }
    const receipts = [];
    for (const f of features) {
      let db;
      if (cleanup) {
        db = (await cf(`/d1/database/${f.databaseId}`)).result;
        need(db?.uuid === f.databaseId && db.name === f.database, 'DATABASE_READBACK');
      } else {
        db = await write(f, 'database', '/d1/database', { name: f.database }, d => {
          need(UUID.test(d?.uuid ?? '') && d.name === f.database && !inventory.databases.some(x => x.id === d.uuid)
            && (!production || !EXCLUDED_DATABASE_IDS.includes(d.uuid))
            && fresh(Date.parse(d.created_at), now(), 300_000), 'NEW_DATABASE');
        });
        const readback = await cf(`/d1/database/${db.uuid}`);
        need(readback.result?.uuid === db.uuid && readback.result.name === f.database, 'DATABASE_READBACK');
        await write(f, 'schema', `/d1/database/${db.uuid}/query`, { sql: artifacts[f.schema].toString('utf8') }, rows => {
          need(Array.isArray(rows) && rows.length === f.statements && rows.every(r => r.success === true), 'SCHEMA_RESULTS');
        });
        if (production) {
          receipts.push({ feature: f.key, accountId: TARGET.accountId, databaseName: f.database, databaseId: db.uuid,
            schemaHash: pinnedArtifacts[f.schema], statementCount: f.statements, confirmedAt: now() });
          inventory.databases.push({ id: db.uuid, name: f.database });
          continue;
        }
      }
      const worker = await write(f, 'worker', '/workers/workers', { name: f.worker,
        subdomain: { enabled: false, previews_enabled: false }, logpush: false, observability: { enabled: false } }, w => {
        workerIdentity(w, f); need(fresh(Date.parse(w.created_on), now(), 300_000), 'NEW_WORKER_TIMESTAMP');
      });
      workerIdentity((await cf(`/workers/workers/${worker.id}`)).result, f, worker.id);
      if (cleanup) onReceipt({ step: 'worker-created', accountId: TARGET.accountId, workerName: f.worker, workerId: worker.id, confirmedAt: now() });
      const versionBody = { compatibility_date: '2026-05-22', main_module: 'cleanup.mjs',
        bindings: [{ type: 'd1', name: f.binding, database_id: db.uuid }],
        modules: [{ name: 'cleanup.mjs', content_type: 'application/javascript+module', content_base64: artifacts[f.module].toString('base64') }] };
      const version = await write(f, 'version', `/workers/workers/${worker.id}/versions?deploy=true`, versionBody, v => {
        need(UUID.test(v?.id ?? '') && v.main_module === versionBody.main_module
          && matchesD1Binding(v.bindings, versionBody.bindings[0]), 'VERSION_RESPONSE');
      });
      const versionReadback = (await cf(`/workers/workers/${worker.id}/versions/${version.id}?include=modules`)).result;
      need(versionReadback?.id === version.id && versionReadback.main_module === versionBody.main_module
        && matchesD1Binding(versionReadback.bindings, versionBody.bindings[0])
        && canonical(versionReadback.modules) === canonical(versionBody.modules), 'VERSION_READBACK');
      if (cleanup) onReceipt({ step: 'version-deployed', accountId: TARGET.accountId, workerName: f.worker, workerId: worker.id, versionId: version.id, databaseId: f.databaseId, binding: f.binding, moduleHash: pinnedArtifacts[f.module], confirmedAt: now() });
      // Name-targeted Cron has a residual concurrent-rename race. Two-way identity
      // readback detects prior changes, not an atomic conditional write guarantee.
      workerIdentity((await cf(`/workers/workers/${worker.id}`)).result, f, worker.id);
      workerIdentity((await cf(`/workers/workers/${f.worker}`)).result, f, worker.id);
      await write(f, 'cron', `/workers/scripts/${f.worker}/schedules`, [{ cron: f.cron }], result => {
        const schedules = result?.schedules;
        need(Array.isArray(schedules) && schedules.length === 1 && schedules[0]?.cron === f.cron, 'CRON_RESPONSE');
      });
      workerIdentity((await cf(`/workers/workers/${worker.id}`)).result, f, worker.id);
      receipts.push({ feature: f.key, accountId: TARGET.accountId, databaseName: f.database, databaseId: db.uuid,
        workerName: f.worker, workerId: worker.id, versionId: version.id,
        ...(cleanup ? { cron: f.cron, persistentBindingAndCron: true, retentionScopeHash: RETENTION_SCOPE_HASH, scheduledDeletionScope: RETENTION_SCOPE[f.key], scheduledDeletionMayStartAfterCronRegistration: true } : { schemaHash: ARTIFACTS[f.schema] }),
        moduleHash: pinnedArtifacts[f.module], confirmedAt: now() });
      if (cleanup) onReceipt({ step: 'cron-registered', ...receipts.at(-1) });
      if (!cleanup) inventory.databases.push({ id: db.uuid, name: f.database });
      inventory.workers.push({ id: worker.id, name: f.worker });
    }
    return { ...(production ? { mode: cleanup ? CLEANUP_MODE : PRODUCTION_MODE } : {}), receipts, ...(cleanup ? { installationPreflight: { observedAt: inspected.observedAt, databaseCount: inspected.databaseCount, workerCount: inspected.workerCount, cronCount: inspected.cronCount, usageHeadroom: 'not-measured' } } : {}), journal: structuredClone(journal), actualHeartbeatVerified: false, alertDeliveryVerified: false, intakeEnabled: false };
  }
  return Object.freeze({ preflight: async () => { need(!started, 'ATTEMPT_ALREADY_STARTED'); return inspect(); },
    provision, health, readinessInventory, pagesDeploymentLog, qaMetadata, qaReadiness, journal: () => structuredClone(journal) });
}

// Write/legacy factories cannot accept the record-free production-health scope.
export async function createPreparedAdapter(options) {
  need(![PRODUCTION_HEALTH_OPERATION, READINESS_OPERATION, PAGES_LOG_OPERATION, QA_META_OPERATION, QA_READY_OPERATION].includes(options.operation), 'HEALTH_MODE');
  return createAdapter(options);
}

// This capability exposes no provision method, accepts no claim client, and its
// transport rejects all mutations even if a future preflight change attempts one.
export async function createReadOnlyAdapter({ transport, recordBytes, trustedRecordHash, now = Date.now, onStage, onEnvelope }) {
  need(validateRecord(recordBytes, trustedRecordHash, now()).mode === 'read-only-preflight', 'READ_ONLY_MODE');
  const adapter = await createPreparedAdapter({ transport: readOnlyTransport(transport), recordBytes, trustedRecordHash, now, onStage, onEnvelope });
  return Object.freeze({ preflight: adapter.preflight });
}

export async function createHealthAdapter({ transport, recordBytes, trustedRecordHash, now = Date.now, onStage, onEnvelope }) {
  need(validateRecord(recordBytes, trustedRecordHash, now()).mode === 'cleanup-health', 'HEALTH_MODE');
  const adapter = await createPreparedAdapter({ transport: healthTransport(transport), recordBytes, trustedRecordHash, now, onStage, onEnvelope });
  return Object.freeze({ health: adapter.health });
}

export async function createProductionHealthAdapter({ transport, context, now = Date.now, onStage, onEnvelope }) {
  validateProductionHealthContext(context);
  const adapter = await createAdapter({ transport: productionHealthTransport(transport), readContext: context,
    now, onStage, onEnvelope, operation: PRODUCTION_HEALTH_OPERATION });
  return Object.freeze({ health: adapter.health });
}

export async function createDiagnosisReadinessAdapter({ transport, context, now = Date.now, onStage, onEnvelope }) {
  validateReadinessContext(context);
  const adapter = await createAdapter({ transport: readinessTransport(transport), readContext: context,
    now, onStage, onEnvelope, operation: READINESS_OPERATION });
  return Object.freeze({ readiness: adapter.readinessInventory });
}

export async function createPagesDeploymentLogAdapter({ transport, context, now = Date.now, onStage, onEnvelope, onReceipt, logSecrets = [] }) {
  validatePagesLogContext(context);
  const adapter = await createAdapter({ transport: pagesLogTransport(transport), readContext: context,
    now, onStage, onEnvelope, onReceipt, logSecrets, operation: PAGES_LOG_OPERATION });
  return Object.freeze({ deploymentLog: adapter.pagesDeploymentLog });
}

export async function createQaMetadataAdapter({transport,context,now=Date.now,onStage,onEnvelope}) {
  validateQaMeta(context);
  const adapter=await createAdapter({transport:qaMetaTransport(transport),readContext:context,now,onStage,onEnvelope,operation:QA_META_OPERATION});
  return Object.freeze({metadata:adapter.qaMetadata});
}

export async function createQaReadinessAdapter({transport,context,now=Date.now,onStage,onEnvelope}) {
  validateQaReady(context);
  const adapter=await createAdapter({transport:qaReadyTransport(transport),readContext:context,now,onStage,onEnvelope,operation:QA_READY_OPERATION});
  return Object.freeze({readiness:adapter.qaReadiness});
}
