// Fixed-scope request implementation, exercised only with injected mock transport.
// There is intentionally no fetch default, credential reader or CLI entry point.
import { readFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { TARGET, SHARING, ARTIFACTS, sha256, checkArtifact, denyExecution } from './controller.mjs';

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
export function validateRecord(recordBytes, trustedRecordHash, now) {
  need(Buffer.byteLength(recordBytes) <= 65_536, 'APPROVAL_RECORD_SIZE');
  need(HASH.test(trustedRecordHash ?? '') && sha256(recordBytes) === trustedRecordHash, 'APPROVAL_RECORD_PIN');
  let r;
  try { r = JSON.parse(recordBytes); } catch { throw new Error('BLOCKED:APPROVAL_RECORD_JSON'); }
  need(r.operation === 'create-two-preview-pairs-20261007' && r.planHash === PLAN_HASH
    && r.accountId === TARGET.accountId, 'RECORD_SCOPE');
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
  const dayStart = Math.floor(now / 86_400_000) * 86_400_000;
  need(e?.kind === 'owner-ui-reviewed' && e.accountId === TARGET.accountId && e.operation === r.operation
    && e.planHash === PLAN_HASH && e.workersPlan === 'workers-free' && e.maximumChargeUSD === 0
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
  need(r.claimArtifact?.archiveBytes === 8192 && r.claimArtifact.retentionDays === 1
    && r.claimArtifact.access === 'existing-repository'
    && HASH.test(r.claimArtifact.storageBudgetReviewSha256 ?? ''), 'CLAIM_ARTIFACT_BUDGET');
  need(r.cleanupApproval === 'both-pinned-hourly-crons' && HASH.test(r.alert?.destinationChoiceSha256 ?? '')
    && HASH.test(r.alert?.deliveryEvidenceSha256 ?? '') && fresh(r.alert?.reviewedAt, now, 86_400_000), 'CLEANUP_ALERT_APPROVAL');
  need(r.cronTargeting === 'name-after-id-recheck-residual-rename-risk-accepted', 'CRON_RENAME_RISK');
  need(Array.isArray(r.reconciledNoWriteRuns), 'DURABLE_RUN_RECONCILIATION');
  for (const safe of r.reconciledNoWriteRuns) need(Number.isSafeInteger(safe.id) && safe.id !== r.runId
    && /^[a-f0-9]{40}$/.test(safe.headSha ?? '') && HASH.test(safe.reviewEvidenceSha256 ?? '')
    && safe.classification === 'independently-reviewed-no-mutations', 'RECONCILED_RUN');
  return r;
}

export async function createPreparedAdapter({ transport, durableClaims, recordBytes, trustedRecordHash, now = Date.now }) {
  need(typeof transport === 'function', 'NO_TRANSPORT');
  const approvedBytes = String(recordBytes);
  const record = validateRecord(approvedBytes, trustedRecordHash, now());
  const artifacts = {};
  for (const f of FEATURES) for (const path of [f.schema, f.module]) {
    const bytes = await readFile(new URL(path, import.meta.url));
    checkArtifact(bytes, ARTIFACTS[path]); artifacts[path] = bytes;
  }
  const journal = [];
  let started = false;
  let requests = 0;
  let preflightAt = null;
  let inventory;
  async function request(service, method, path, body) {
    need(++requests <= 120, 'REQUEST_BOUND');
    const root = service === 'github' ? 'https://api.github.com' : 'https://api.cloudflare.com/client/v4';
    const url = root + path;
    const controller = new AbortController();
    let timer;
    try {
      const timeout = new Promise((_, reject) => { timer = setTimeout(() => {
        controller.abort(); reject(new Error('timeout'));
      }, 10_000); });
      const operation = (async () => {
        const response = await transport(url, { method, redirect: 'error', signal: controller.signal,
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
        need(response.url === url && response.redirected === false && [200, 201].includes(response.status), 'RESPONSE_IDENTITY_STATUS');
        need(response.headers.get('content-type')?.includes('application/json'), 'RESPONSE_TYPE');
        const reader = response.body?.getReader(); need(reader, 'RESPONSE_BODY');
        const chunks = []; let size = 0;
        try { while (true) { const { done, value } = await reader.read(); if (done) break;
          size += value.byteLength; need(size <= 1_048_576, 'RESPONSE_SIZE'); chunks.push(Buffer.from(value));
        } } finally { reader.releaseLock(); }
        const json = JSON.parse(Buffer.concat(chunks).toString('utf8'));
        if (service === 'cloudflare') need(json.success === true && Array.isArray(json.errors) && json.errors.length === 0, 'PROVIDER_RESULT');
        return json;
      })();
      return await Promise.race([operation, timeout]);
    } catch { controller.abort(); throw new Error('BLOCKED:REQUEST_UNCERTAIN_OR_INVALID'); }
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
    for (const prior of history.workflow_runs) {
      if (prior.id === record.runId) continue;
      const safe = record.reconciledNoWriteRuns.find(r => r.id === prior.id);
      need(safe && safe.headSha === prior.head_sha && prior.status === 'completed' && prior.run_attempt === 1,
        'PRIOR_RUN_REQUIRES_READ_ONLY_RECONCILIATION');
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
    return run;
  }
  async function inspect() {
    validateRecord(approvedBytes, trustedRecordHash, now());
    await githubGate();
    const account = await cf(''); need(account.result?.id === TARGET.accountId, 'ACCOUNT');
    const databases = await listResources('/d1/database', 'uuid');
    const workers = await listResources('/workers/workers', 'id');
    need(FEATURES.every(f => !databases.some(d => d.name === f.database) && !workers.some(w => w.name === f.worker)), 'COLLISION');
    let cronCount = 0;
    for (const worker of workers) {
      const schedules = (await cf(`/workers/scripts/${encodeURIComponent(worker.name)}/schedules`)).result;
      need(Array.isArray(schedules) && schedules.every(s => typeof s.cron === 'string'), 'CRON_INVENTORY');
      cronCount += schedules.length;
    }
    const evidence = record.costEvidence;
    need(evidence.databaseLimit - databases.length >= evidence.reserve.databaseSlots
      && evidence.workerLimit - workers.length >= evidence.reserve.workerSlots
      && evidence.cronLimit - cronCount >= evidence.reserve.cronSlots, 'RESOURCE_SLOTS');
    inventory = { databases, workers }; preflightAt = now();
    return { accountId: TARGET.accountId, planHash: PLAN_HASH, databaseCount: databases.length,
      workerCount: workers.length, cronCount, costProvenance: 'owner-ui-reviewed; not authenticated billing/quota API evidence',
      observedAt: preflightAt, executionEnabled: false };
  }
  async function write(f, step, path, body, validate) {
    need(journal.length < 10 && !journal.some(x => x.feature === f.key && x.step === step), 'WRITE_BOUND');
    validateRecord(approvedBytes, trustedRecordHash, now());
    const entry = { feature: f.key, step, startedAt: now(), outcome: 'in-progress', requestHash: sha256(canonical(body)) };
    journal.push(entry); // Set BEFORE transport; any exception permanently poisons this instance.
    try { const response = await request('cloudflare', step === 'cron' ? 'PUT' : 'POST', ACCOUNT + path, body);
      validate(response.result); entry.outcome = 'confirmed'; entry.confirmedAt = now(); return response.result;
    } catch { entry.outcome = 'uncertain'; throw new Error('BLOCKED:WRITE_REQUIRES_READ_ONLY_RECONCILIATION'); }
  }
  function workerIdentity(worker, f, id) {
    need(WORKER_ID.test(worker?.id ?? '') && worker.name === f.worker && (!id || worker.id === id)
      && !inventory.workers.some(w => w.id === worker.id) && worker.logpush === false
      && worker.observability?.enabled === false && worker.subdomain?.enabled === false
      && worker.subdomain.previews_enabled === false, 'NEW_WORKER_IDENTITY');
  }
  async function provision() {
    need(!started, 'ATTEMPT_ALREADY_STARTED');
    started = true; // Poison even a failed preflight; prohibit concurrent/repeated attempts.
    await inspect(); // Never use a caller-provided preflight receipt.
    need(fresh(preflightAt, now(), 300_000), 'PREFLIGHT_STALE');
    need(requests + 22 <= 120, 'REQUEST_BUDGET_BEFORE_WRITES');
    // This separate trusted integration MUST implement durable, atomic create-if-absent.
    // artifact-claim.mjs supplies the pinned official client wrapper; no SDK is
    // installed/wired by default. An ephemeral Map/file is only a test fake.
    need(typeof durableClaims?.createExclusive === 'function' && typeof durableClaims?.read === 'function', 'DURABLE_CLAIM_UNCONFIGURED');
    const claimName = `gemnao-preview-data-claim-${record.runId}-${PLAN_HASH}`;
    const claim = { runId: record.runId, repository: TARGET.repository, planHash: PLAN_HASH,
      recordHash: trustedRecordHash, nonce: randomUUID() };
    try {
      const receipt = await durableClaims.createExclusive(claimName, structuredClone(claim));
      need(typeof receipt?.id === 'string' && receipt.id.length > 0, 'DURABLE_CLAIM_RECEIPT');
      const persisted = await durableClaims.read(receipt.id);
      need(persisted?.name === claimName && canonical(persisted.payload) === canonical(claim), 'DURABLE_CLAIM_READBACK');
    } catch { throw new Error('BLOCKED:DURABLE_CLAIM_REQUIRES_READ_ONLY_RECONCILIATION'); }
    const receipts = [];
    for (const f of FEATURES) {
      const db = await write(f, 'database', '/d1/database', { name: f.database }, d => {
        need(UUID.test(d?.uuid ?? '') && d.name === f.database && !inventory.databases.some(x => x.id === d.uuid)
          && fresh(Date.parse(d.created_at), now(), 300_000), 'NEW_DATABASE');
      });
      const readback = await cf(`/d1/database/${db.uuid}`);
      need(readback.result?.uuid === db.uuid && readback.result.name === f.database, 'DATABASE_READBACK');
      await write(f, 'schema', `/d1/database/${db.uuid}/query`, { sql: artifacts[f.schema].toString('utf8') }, rows => {
        need(Array.isArray(rows) && rows.length === f.statements && rows.every(r => r.success === true), 'SCHEMA_RESULTS');
      });
      const worker = await write(f, 'worker', '/workers/workers', { name: f.worker,
        subdomain: { enabled: false, previews_enabled: false }, logpush: false, observability: { enabled: false } }, w => {
        workerIdentity(w, f); need(fresh(Date.parse(w.created_on), now(), 300_000), 'NEW_WORKER_TIMESTAMP');
      });
      workerIdentity((await cf(`/workers/workers/${worker.id}`)).result, f, worker.id);
      const versionBody = { compatibility_date: '2026-05-22', main_module: 'cleanup.mjs',
        bindings: [{ type: 'd1', name: f.binding, database_id: db.uuid }],
        modules: [{ name: 'cleanup.mjs', content_type: 'application/javascript+module', content_base64: artifacts[f.module].toString('base64') }] };
      const version = await write(f, 'version', `/workers/workers/${worker.id}/versions?deploy=true`, versionBody, v => {
        need(UUID.test(v?.id ?? '') && v.main_module === versionBody.main_module
          && canonical(v.bindings) === canonical(versionBody.bindings), 'VERSION_RESPONSE');
      });
      const versionReadback = (await cf(`/workers/workers/${worker.id}/versions/${version.id}?include=modules`)).result;
      need(versionReadback?.id === version.id && versionReadback.main_module === versionBody.main_module
        && canonical(versionReadback.bindings) === canonical(versionBody.bindings)
        && canonical(versionReadback.modules) === canonical(versionBody.modules), 'VERSION_READBACK');
      // Name-targeted Cron has a residual concurrent-rename race. Two-way identity
      // readback detects prior changes, not an atomic conditional write guarantee.
      workerIdentity((await cf(`/workers/workers/${worker.id}`)).result, f, worker.id);
      workerIdentity((await cf(`/workers/workers/${f.worker}`)).result, f, worker.id);
      await write(f, 'cron', `/workers/scripts/${f.worker}/schedules`, [{ cron: f.cron }], schedules => {
        need(Array.isArray(schedules) && schedules.length === 1 && schedules[0].cron === f.cron, 'CRON_RESPONSE');
      });
      workerIdentity((await cf(`/workers/workers/${worker.id}`)).result, f, worker.id);
      receipts.push({ feature: f.key, accountId: TARGET.accountId, databaseName: f.database, databaseId: db.uuid,
        workerName: f.worker, workerId: worker.id, versionId: version.id, schemaHash: ARTIFACTS[f.schema],
        moduleHash: ARTIFACTS[f.module], confirmedAt: now() });
      inventory.databases.push({ id: db.uuid, name: f.database });
      inventory.workers.push({ id: worker.id, name: f.worker });
    }
    return { receipts, journal: structuredClone(journal), actualHeartbeatVerified: false, intakeEnabled: false };
  }
  return Object.freeze({ preflight: async () => { need(!started, 'ATTEMPT_ALREADY_STARTED'); return inspect(); },
    provision, journal: () => structuredClone(journal) });
}
