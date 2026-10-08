import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { TARGET, existingIdentity, verifyExistingSettings, updateExistingOnce,
  validateUpdateRecord, verifyUpdateContext, accessVars, preflightUpdate } from '../../ops/worker-qa-access/update.mjs';
import { FIXED } from '../../reviewed-controller/ops/worker-qa/deploy.mjs';
import { SETUP } from '../../reviewed-controller/ops/feedback-preview/live.mjs';

const time = 1791471600000;
const base = JSON.parse(readFileSync('wrangler.worker-preview.json', 'utf8'));
const token = 'SYNTHETIC_TEST_FIXTURE_NOT_A_REAL_PASSWORD_0001';
const record = () => ({ expiresAt: time + 60000, costReview: { validUntil: time + 60000 },
  access: { notBefore: time, expiresAt: time + 3600000 } });
const identity = () => ({ id: TARGET.workerId, name: TARGET.worker,
  subdomain: { enabled: true, previews_enabled: false }, logpush: false,
  observability: { enabled: false } });
const settings = config => ({ bindings: [
  ...config.d1_databases.map(x => ({ type: 'd1', name: x.binding, id: x.database_id })),
  { type: 'assets', name: 'ASSETS' },
  ...Object.entries(config.vars).map(([name, text]) => ({ type: 'plain_text', name, text })),
] });
function harness(overrides = {}) {
  const calls = [];
  let current = structuredClone(base), cliCalls = 0, claims = 0, reverifies = 0;
  const api = async (provider, path) => {
    calls.push([provider, path]);
    assert.equal(provider, 'cf');
    if (overrides.api) {
      const result = await overrides.api(path, calls);
      if (result !== undefined) return result;
    }
    if (path === '/workers/workers/' + TARGET.workerId || path === '/workers/workers/' + TARGET.worker)
      return { result: identity() };
    if (path === '/workers/scripts/' + TARGET.worker + '/settings') return { result: settings(current) };
    if (path === '/workers/scripts/' + TARGET.worker + '/schedules') return { result: { schedules: [] } };
    throw new Error('Unexpected mocked endpoint: ' + path);
  };
  const options = { api, record: record(), baseConfig: structuredClone(base),
    vars: accessVars(token, record()), now: () => time,
    claim: async () => { claims++; if (overrides.claim) await overrides.claim(); },
    reverify: async () => { reverifies++; if (overrides.reverify) await overrides.reverify(reverifies); },
    runWrangler: async config => {
      cliCalls++;
      if (overrides.cli) await overrides.cli(config);
      current = structuredClone(config);
    },
    ...overrides.options,
  };
  return { options, calls, counts: () => ({ cliCalls, claims, reverifies }) };
}

void test('missing initial immutable ID and mismatched name refuse before claim or CLI', async () => {
  for (const api of [
    path => { if (path.endsWith(TARGET.workerId)) throw new Error('MOCK_NOT_FOUND'); },
    path => path.endsWith(TARGET.workerId) ? { result: null } : undefined,
    path => path.endsWith(TARGET.worker) ? { result: { ...identity(), id: 'other-id' } } : undefined,
    path => path.endsWith(TARGET.workerId) ? { result: { ...identity(), name: 'other-worker' } } : undefined,
  ]) {
    const h = harness({ api });
    await assert.rejects(updateExistingOnce(h.options));
    assert.equal(h.counts().cliCalls, 0); assert.equal(h.counts().claims, 0);
  }
});

void test('existing settings, binding types, exact D1 and variables reject drift', async () => {
  for (const change of [
    s => { s.bindings.find(x => x.type === 'd1').id = 'not-approved-database'; },
    s => { s.bindings.push({ type: 'service', name: 'EXTRA', service: 'other' }); },
    s => { s.bindings.find(x => x.type === 'assets').name = 'OTHER_ASSETS'; },
    s => { s.bindings.push({ type: 'plain_text', name: 'EXTRA', text: 'true' }); },
    s => { s.bindings.push({ ...s.bindings.find(x => x.type === 'plain_text') }); },
    s => { s.bindings.find(x => x.name === 'DIAGNOSIS_ENABLED').text = 'true'; },
  ]) {
    const altered = settings(base); change(altered);
    const h = harness({ api: path => path.endsWith('/settings') ? { result: altered } : undefined });
    await assert.rejects(updateExistingOnce(h.options)); assert.equal(h.counts().cliCalls, 0);
  }
  for (const change of [w => { w.logpush = true; }, w => { w.observability.enabled = true; },
    w => { w.subdomain.previews_enabled = true; }, w => { w.subdomain.enabled = false; }]) {
    const altered = identity(); change(altered);
    await assert.rejects(existingIdentity(async () => ({ result: altered })));
  }
  const h = harness({ api: path => path.endsWith('/schedules') ? { result: { schedules: [{}] } } : undefined });
  await assert.rejects(verifyExistingSettings(h.options.api, base));
});

void test('claim error prevents CLI and is not retried', async () => {
  const h = harness({ claim: () => { throw new Error('MOCK_CLAIM_AMBIGUOUS'); } });
  await assert.rejects(updateExistingOnce(h.options), /MOCK_CLAIM_AMBIGUOUS/);
  assert.deepEqual(h.counts(), { cliCalls: 0, claims: 1, reverifies: 1 });
});

void test('identity or exact binding drift after claim still blocks the final CLI', async () => {
  for (const drift of ['identity', 'bindings']) {
    let claimed = false;
    const h = harness({ claim: () => { claimed = true; }, api: path => {
      if (!claimed) return;
      if (drift === 'identity' && path.endsWith(TARGET.workerId)) return { result: null };
      if (drift === 'bindings' && path.endsWith('/settings')) {
        const altered = settings(base); altered.bindings.find(x => x.type === 'd1').id = 'wrong-db';
        return { result: altered };
      }
    } });
    await assert.rejects(updateExistingOnce(h.options));
    assert.equal(h.counts().claims, 1); assert.equal(h.counts().cliCalls, 0);
  }
});

void test('expired approval, cost review or access window fails before CLI', async () => {
  for (const mutate of [r => { r.expiresAt = time; }, r => { r.costReview.validUntil = time; },
    r => { r.access.expiresAt = time; }, r => { r.access.notBefore = time + 1; }]) {
    const r = record(); mutate(r);
    const h = harness({ options: { record: r } });
    await assert.rejects(updateExistingOnce(h.options), /APPROVAL_EXPIRED/);
    assert.equal(h.counts().cliCalls, 0); assert.equal(h.counts().claims, 0);
  }
  let now = time;
  const h = harness({ claim: () => { now = time + 60000; }, options: { now: () => now } });
  await assert.rejects(updateExistingOnce(h.options), /APPROVAL_EXPIRED/);
  assert.equal(h.counts().cliCalls, 0); assert.equal(h.counts().claims, 1);
});

void test('ambiguous CLI failure invokes once and never retries or reports success', async () => {
  const h = harness({ cli: () => { throw new Error('BLOCKED:WRANGLER_OUTCOME_UNKNOWN_NO_RERUN'); } });
  await assert.rejects(updateExistingOnce(h.options), /OUTCOME_UNKNOWN_NO_RERUN/);
  assert.deepEqual(h.counts(), { cliCalls: 1, claims: 1, reverifies: 2 });
  assert.equal(h.calls.filter(([, p]) => p.endsWith('/settings')).length, 2);
});

void test('successful update invokes once, preserves OFF flags and reads back identity/settings', async () => {
  const h = harness({ cli: config => {
    assert.equal(config.name, TARGET.worker);
    assert.deepEqual(config.d1_databases, base.d1_databases);
    for (const [key, value] of Object.entries(config.vars)) if (key.endsWith('_ENABLED')) assert.equal(value, 'false');
    assert.match(config.vars.QA_ACCESS_SHA256, /^[a-f0-9]{64}$/);
    assert.equal(JSON.stringify(config).includes(token), false);
  } });
  const result = await updateExistingOnce(h.options);
  assert.deepEqual(h.counts(), { cliCalls: 1, claims: 1, reverifies: 2 });
  assert.equal(result.gateInstalled, true); assert.equal(result.intakeEnabled, false);
  assert.equal(result.actualQaVerified, false); assert.equal(result.workerId, TARGET.workerId);
  assert.equal(h.calls.filter(([, p]) => p.endsWith('/settings')).length, 3);
  assert.equal(h.calls.filter(([, p]) => p === '/workers/workers/' + TARGET.workerId).length, 3);
});

void test('post-write identity/settings failure does not retry an already invoked CLI', async () => {
  let written = false;
  const h = harness({ cli: () => { written = true; }, api: path =>
    written && path.endsWith(TARGET.workerId) ? { result: { ...identity(), id: 'changed-id' } } : undefined });
  await assert.rejects(updateExistingOnce(h.options)); assert.equal(h.counts().cliCalls, 1);
});

void test('update record rejects bypass scope, missing race disclosure and digest tampering', () => {
  const validScope = { ...record(), approvedAt: time, workerId: TARGET.workerId,
    operation: 'install-existing-qa-gate-intake-off', expectedState: 'existing-public-qa-intake-off-without-access-gate',
    residualUpdateRace: 'exists-before-call-not-atomic-against-external-delete-rename-accepted',
    access: { ...record().access, secretName: 'GEMNAO_QA_ACCESS_PASSPHRASE',
      entropyReview: 'owner-generated-unique-random-token-at-least-128-bits' } };
  for (const patch of [{ operation: 'create-public-qa-worker-disabled-intake' }, { workerId: 'other' },
    { expectedState: 'anything' }, { residualUpdateRace: undefined },
    { access: { ...validScope.access, expiresAt: time + 3600001 } },
    { access: { ...validScope.access, secretName: 'OTHER_SECRET' } }]) {
    const bytes = JSON.stringify({ ...validScope, ...patch });
    const digest = createHash('sha256').update(bytes).digest('hex');
    assert.throws(() => validateUpdateRecord(bytes, digest, {}, {}, time), /UPDATE_SCOPE/);
  }
  assert.throws(() => validateUpdateRecord(JSON.stringify(validScope), '0'.repeat(64), {}, {}, time), /RECORD_DIGEST/);
});

void test('exact workflow context rejects wrong repository, ref, event, attempt, SHA, job and debug', () => {
  const sha = 'a'.repeat(40);
  const env = { GITHUB_ACTIONS: 'true', GITHUB_REPOSITORY: 'poe2-build-navi-jp/gemnao',
    GITHUB_EVENT_NAME: 'workflow_dispatch', GITHUB_REF: SETUP.ref, GITHUB_RUN_ATTEMPT: '1',
    GITHUB_SHA: sha, GITHUB_WORKFLOW_SHA: sha, RUNNER_ENVIRONMENT: 'github-hosted', GITHUB_JOB: 'update',
    GITHUB_WORKFLOW_REF: `poe2-build-navi-jp/gemnao/${TARGET.workflow}@${SETUP.ref}` };
  assert.doesNotThrow(() => verifyUpdateContext(env, sha, 'update'));
  for (const patch of [{ GITHUB_ACTIONS: 'false' }, { GITHUB_REPOSITORY: 'other/repo' },
    { GITHUB_EVENT_NAME: 'pull_request' }, { GITHUB_REF: 'refs/heads/main' }, { GITHUB_RUN_ATTEMPT: '2' },
    { GITHUB_SHA: 'b'.repeat(40) }, { GITHUB_WORKFLOW_SHA: 'b'.repeat(40) },
    { RUNNER_ENVIRONMENT: 'self-hosted' }, { GITHUB_JOB: 'gate' }, { RUNNER_DEBUG: '1' },
    { GITHUB_WORKFLOW_REF: `other/repo/${TARGET.workflow}@${SETUP.ref}` }])
    assert.throws(() => verifyUpdateContext({ ...env, ...patch }, sha, 'update'), /WORKFLOW_CONTEXT/);
});

const hash = 'a'.repeat(64), commit = 'b'.repeat(40);
const canonical = x => Array.isArray(x) ? '[' + x.map(canonical).join(',') + ']' :
  x && typeof x === 'object' ? '{' + Object.keys(x).sort().map(k => JSON.stringify(k) + ':' + canonical(x[k])).join(',') + '}' : JSON.stringify(x);
const digest = x => createHash('sha256').update(x).digest('hex');
const pins = { executionReviewed: true, sourceCommit: commit, sourceTree: 'c'.repeat(40),
  sourceLockSha256: hash, origin: TARGET.origin };
const recordEnv = { GITHUB_RUN_ID: '1234', GITHUB_SHA: commit, QA_ARTIFACT_ID: '789' };
function completeRecord() {
  return { ...record(), operation: 'install-existing-qa-gate-intake-off', workerId: TARGET.workerId,
    expectedState: 'existing-public-qa-intake-off-without-access-gate',
    residualUpdateRace: 'exists-before-call-not-atomic-against-external-delete-rename-accepted',
    access: { ...record().access, secretName: 'GEMNAO_QA_ACCESS_PASSPHRASE',
      entropyReview: 'owner-generated-unique-random-token-at-least-128-bits' },
    accountId: TARGET.accountId, worker: TARGET.worker, runId: 1234, commit, ref: SETUP.ref,
    ownerId: TARGET.owner, pinsSha256: digest(canonical(pins)), creationReceiptSha256: FIXED.receiptSha256,
    origin: TARGET.origin, approvedAt: time - 1000,
    nameTargeting: 'immutable-id-rechecks-with-residual-name-race-accepted',
    wranglerRetries: 'pinned-official-internal-retries-accepted-no-cli-rerun', intakeEnabled: false, syntheticOnly: true,
    tokenReview: { kind: 'owner-reviewed-scope', secretName: SETUP.secret, accountId: TARGET.accountId,
      scopeKnown: true, noExpansion: true, accountOnly: true, permissionsReviewed: true,
      evidenceSha256: hash, reviewedAt: time - 1000, expiresAt: time + 120000 },
    costReview: { accountId: TARGET.accountId, workersPlan: 'workers-free', maximumChargeUSD: 0,
      evidenceSha256: hash, reviewedAt: time - 1000, validUntil: time + 120000, workerLimit: 100,
      workerSlotsReserved: 1, assetFileLimit: 20000, scriptGzipLimitBytes: 3 * 1024 * 1024,
      publicTrafficRiskAccepted: true, budgets: Object.fromEntries(
        ['workerRequests', 'd1RowsRead', 'd1RowsWritten', 'storageBytes'].map(k => [k, { remaining: 10, reserve: 1, existingTrafficAllowance: 1 }])) },
    artifactStorageReviewSha256: hash, reconciledNoWriteRuns: [],
    artifact: { id: 789, archiveSha256: hash, manifestSha256: hash, bundleSha256: hash, deploymentConfigSha256: hash } };
}
function checkComplete(r, env = recordEnv, p = pins) {
  const bytes = JSON.stringify(r); return validateUpdateRecord(bytes, digest(bytes), env, p, time);
}
void test('complete exact-run update record validates without changing its operation', () => {
  const r = completeRecord(); assert.deepEqual(checkComplete(r), r);
});
void test('inherited owner, token, cost, artifact and exact-run schema cannot be bypassed', () => {
  for (const mutate of [r => { r.ownerId++; }, r => { r.runId++; }, r => { r.commit = 'd'.repeat(40); },
    r => { r.tokenReview.scopeKnown = false; }, r => { r.tokenReview.noExpansion = false; },
    r => { delete r.wranglerRetries; }, r => { delete r.nameTargeting; },
    r => { r.intakeEnabled = true; }, r => { r.syntheticOnly = false; },
    r => { r.costReview.maximumChargeUSD = 1; }, r => { r.costReview.budgets.workerRequests.remaining = 0; },
    r => { r.creationReceiptSha256 = 'd'.repeat(64); }, r => { r.artifact.id++; },
    r => { r.artifact.bundleSha256 = 'bad'; }, r => { r.pinsSha256 = 'd'.repeat(64); }]) {
    const r = completeRecord(); mutate(r); assert.throws(() => checkComplete(r), /BLOCKED:/);
  }
  assert.throws(() => checkComplete(completeRecord(), recordEnv, { ...pins, executionReviewed: false }), /UNREVIEWED_PINS/);
});

function preflightHarness(change = () => {}) {
  const r = completeRecord(), h = harness();
  const environment = { id: SETUP.environmentId, name: SETUP.environment, can_admins_bypass: false,
    deployment_branch_policy: { protected_branches: false, custom_branch_policies: true },
    protection_rules: [{ type: 'required_reviewers', prevent_self_review: false,
      reviewers: [{ type: 'User', reviewer: { login: SETUP.reviewerLogin, id: TARGET.owner } }] }] };
  const branches = { total_count: 1, branch_policies: [{ type: 'branch', name: SETUP.ref.slice(11) }] };
  const data = {
    ['/actions/runs/' + r.runId]: { id: r.runId, status: 'in_progress', run_attempt: 1, head_sha: commit,
      path: TARGET.workflow, event: 'workflow_dispatch', head_branch: SETUP.ref.slice(11),
      repository: { full_name: 'poe2-build-navi-jp/gemnao' } },
    ['/git/ref/heads/' + SETUP.ref.slice(11)]: { object: { sha: commit } },
    ['/actions/runs/' + r.runId + '/approvals']: [{ state: 'approved', user: { id: TARGET.owner },
      environments: [{ id: SETUP.environmentId, name: SETUP.environment }] }],
    '/actions/workflows/worker-qa-access.yml/runs?per_page=100&page=1': { total_count: 1, workflow_runs: [{ id: r.runId }] },
    ['/actions/artifacts/' + r.artifact.id]: { expired: false, id: r.artifact.id, workflow_run: { id: r.runId, head_sha: commit },
      digest: 'sha256:' + r.artifact.archiveSha256, size_in_bytes: 1024 },
  };
  change({ data, environment, branches, record: r });
  let cfCalls = 0;
  const transport = async (url, options) => {
    assert.equal(options.method, 'GET');
    assert.ok(url.startsWith('https://api.github.com/repos/poe2-build-navi-jp/gemnao/environments/'));
    const body = url.includes('/deployment-branch-policies?') ? branches : environment;
    const response = new Response(JSON.stringify(body), { headers: { 'Content-Type': 'application/json' } });
    Object.defineProperty(response, 'url', { value: url }); return response;
  };
  const api = async (provider, path, method = 'GET') => {
    assert.equal(method, 'GET');
    if (provider === 'gh') { assert.ok(path in data, path); return data[path]; }
    cfCalls++;
    if (path === '') return { result: { id: TARGET.accountId } };
    if (path === '/workers/subdomain') return { result: { subdomain: TARGET.origin.split('.')[1] } };
    const db = base.d1_databases.find(x => path === '/d1/database/' + x.database_id);
    if (db) return { result: { uuid: db.database_id, name: db.database_name } };
    return h.options.api(provider, path);
  };
  return { run: () => preflightUpdate({ api, transport, record: r, baseConfig: base }), cfCalls: () => cfCalls };
}
void test('mocked full owner approval, artifact provenance and exact provider identity preflight succeeds with GETs only', async () => {
  const f = preflightHarness(); await f.run(); assert.ok(f.cfCalls() > 0);
});
void test('preflight rejects protection, owner, workflow, branch, history and artifact drift before CF access', async () => {
  for (const change of [
    f => { f.environment.can_admins_bypass = true; },
    f => { f.environment.protection_rules[0].reviewers[0].reviewer.id++; },
    f => { f.branches.total_count = 2; },
    f => { f.data['/actions/runs/1234'].path = '.github/workflows/other.yml'; },
    f => { f.data['/actions/runs/1234'].run_attempt = 2; },
    f => { f.data['/git/ref/heads/' + SETUP.ref.slice(11)].object.sha = 'd'.repeat(40); },
    f => { f.data['/actions/runs/1234/approvals'][0].user.id++; },
    f => { f.data['/actions/workflows/worker-qa-access.yml/runs?per_page=100&page=1'].total_count = 101; },
    f => { f.data['/actions/artifacts/789'].expired = true; },
    f => { f.data['/actions/artifacts/789'].workflow_run.head_sha = 'd'.repeat(40); },
    f => { f.data['/actions/artifacts/789'].digest = 'sha256:' + 'd'.repeat(64); },
  ]) {
    const f = preflightHarness(change); await assert.rejects(f.run(), /BLOCKED:/); assert.equal(f.cfCalls(), 0);
  }
});
