import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createArtifactClaims } from '../../ops/feedback-preview/artifact-claim.mjs';
import { createPreparedAdapter, createApprovedAdapter, validateRecord, PLAN_HASH, FEATURES } from '../../ops/feedback-preview/adapter.mjs';
import { TARGET, ARTIFACTS, sha256 } from '../../ops/feedback-preview/controller.mjs';
const now = Date.parse('2026-10-07T07:00:00Z');
const account = `/accounts/${TARGET.accountId}`;
const repo = `/repos/${TARGET.repository}`;
const workflow = 'feedback-preview-control.yml';
const dbIds = ['10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000002'];
const workerIds = ['1'.repeat(32), '2'.repeat(32)];
const versionIds = ['20000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000002'];
function fixtureRecord() {
  return { operation: 'create-two-preview-pairs-20261007', planHash: PLAN_HASH, accountId: TARGET.accountId,
    ref: 'refs/heads/synthetic-reviewed', commit: 'a'.repeat(40), runId: 12345, approvedAt: now,
    reviewerPolicy: 'owner-manual', reviewers: [123], requireOwnerInitiator: false,
    claimArtifact: { archiveBytes: 8192, retentionDays: 1, access: 'existing-repository', storageBudgetReviewSha256: 'a'.repeat(64) },
    cleanupApproval: 'both-pinned-hourly-crons', cronTargeting: 'name-after-id-recheck-residual-rename-risk-accepted',
    alert: { destinationChoiceSha256: 'b'.repeat(64), deliveryEvidenceSha256: 'c'.repeat(64), reviewedAt: now },
    costEvidence: { kind: 'owner-ui-reviewed', accountId: TARGET.accountId, operation: 'create-two-preview-pairs-20261007',
      planHash: PLAN_HASH, workersPlan: 'workers-free', maximumChargeUSD: 0,
      assessment: 'within-reviewed-zero-charge-envelope', screenshotSha256: 'd'.repeat(64), reviewEvidenceSha256: 'e'.repeat(64),
      capturedAt: now, reviewedAt: now, validUntil: Date.parse('2026-10-08T00:00:00Z'),
      quotaDateUTC: '2026-10-07', resetAt: Date.parse('2026-10-08T00:00:00Z'),
      planBasis: 'enforced-free-cap-pattern', unchangedPlanReviewSha256: 'f'.repeat(64),
      databaseLimit: 10, workerLimit: 100, cronLimit: 5,
      interveningUsageAllowance: { d1RowsRead: 1, d1RowsWritten: 1, storageBytes: 1, workerRequests: 1 },
      remaining: { databaseSlots: 2, workerSlots: 2, cronSlots: 2, d1RowsRead: 1001, d1RowsWritten: 1001, storageBytes: 1_000_001, workerRequests: 49 },
      reserve: { databaseSlots: 2, workerSlots: 2, cronSlots: 2, d1RowsRead: 1000, d1RowsWritten: 1000, storageBytes: 1_000_000, workerRequests: 48 } },
    reconciledNoWriteRuns: [] };
}
function mock(record, mutate = () => {}, failureWrite = 0) {
  const calls = []; const databases = []; const workers = []; const versions = new Map(); let writes = 0;
  const run = { id: record.runId, workflow_id: 88, run_attempt: 1, event: 'workflow_dispatch',
    head_sha: record.commit, head_branch: 'synthetic-reviewed', path: `.github/workflows/${workflow}`,
    repository: { full_name: TARGET.repository }, status: 'in_progress', actor: { id: 456 }, triggering_actor: { id: 456 } };
  const transport = async (url, options) => {
    const parsed = new URL(url); const path = parsed.pathname.replace(/^\/client\/v4/, '');
    const query = parsed.search; const body = options.body ? JSON.parse(options.body) : undefined;
    const call = { url, method: options.method, path, query, body }; calls.push(call);
    assert.equal(options.redirect, 'error'); assert.ok(options.signal);
    const isCF = parsed.hostname === 'api.cloudflare.com'; let value;
    if (!isCF) {
      assert.equal(options.method, 'GET');
      if (path === `${repo}/actions/runs/${record.runId}`) value = structuredClone(run);
      else if (path === `${repo}/git/ref/heads/synthetic-reviewed`) value = { ref: record.ref, object: { sha: record.commit } };
      else if (path === `${repo}/actions/workflows/${workflow}/runs`) value = { total_count: 1, workflow_runs: [structuredClone(run)] };
      else if (path === `${repo}/actions/runs/${record.runId}/approvals`) value = [{ state: 'approved', user: { id: 123 }, environments: [{ id: 1, name: TARGET.environment }] }];
      else {
        const index = FEATURES.findIndex(f => path.startsWith(`${repo}/environments/${f.environment}`)); assert.ok(index >= 0);
        const f = FEATURES[index];
        value = path.endsWith('/deployment-branch-policies') ? { total_count: 1, branch_policies: [{ type: 'branch', name: 'synthetic-reviewed' }] }
          : { id: index + 1, name: f.environment, can_admins_bypass: false,
            deployment_branch_policy: { protected_branches: false, custom_branch_policies: true },
            protection_rules: [{ type: 'required_reviewers', prevent_self_review: record.reviewerPolicy === 'independent', reviewers: [{ type: 'User', reviewer: { id: 123 } }] }] };
      }
    } else {
      let result;
      if (options.method !== 'GET' && ++writes === failureWrite) throw new Error('SYNTHETIC_SECRET_DO_NOT_LOG');
      if (path === account) result = { id: TARGET.accountId };
      else if (path === `${account}/d1/database` && options.method === 'GET') result = databases;
      else if (path === `${account}/workers/workers` && options.method === 'GET') result = workers;
      else if (path === `${account}/d1/database`) {
        const i = FEATURES.findIndex(f => f.database === body.name); assert.ok(i >= 0);
        result = { uuid: dbIds[i], name: body.name, created_at: new Date(now).toISOString() }; databases.push(result);
      } else if (path.endsWith('/query')) {
        const i = dbIds.findIndex(id => path.includes(id)); assert.ok(i >= 0);
        assert.equal(sha256(body.sql), ARTIFACTS[FEATURES[i].schema]);
        result = Array.from({ length: FEATURES[i].statements }, () => ({ success: true }));
      } else if (path.startsWith(`${account}/d1/database/`)) result = databases.find(d => path.endsWith(d.uuid));
      else if (path === `${account}/workers/workers`) {
        const i = FEATURES.findIndex(f => f.worker === body.name); assert.ok(i >= 0);
        result = { ...body, id: workerIds[i], created_on: new Date(now).toISOString() }; workers.push(result);
      } else if (path.endsWith('/versions')) {
        const i = workerIds.findIndex(id => path.includes(id)); assert.ok(i >= 0); assert.equal(query, '?deploy=true');
        assert.deepEqual(body.bindings, [{ name: FEATURES[i].binding, type: 'd1', database_id: dbIds[i] }]);
        assert.equal(body.modules.length, 1); assert.equal(sha256(Buffer.from(body.modules[0].content_base64, 'base64')), ARTIFACTS[FEATURES[i].module]);
        result = { ...body, id: versionIds[i] }; versions.set(versionIds[i], result);
      } else if (path.includes('/versions/')) { assert.equal(query, '?include=modules'); result = versions.get(path.split('/').at(-1)); }
      else if (path.endsWith('/schedules') && options.method === 'GET') result = [];
      else if (path.endsWith('/schedules')) {
        const f = FEATURES.find(f => path.includes(f.worker)); assert.ok(f); assert.deepEqual(body, [{ cron: f.cron }]); result = body;
      } else result = workers.find(w => path.endsWith(w.id) || path.endsWith(w.name));
      assert.notEqual(result, undefined, path);
      value = { success: true, errors: [], result: structuredClone(result) };
      if (options.method === 'GET' && [account + '/d1/database', account + '/workers/workers'].includes(path))
        value.result_info = { page: 1, per_page: 100, total_count: result.length };
    }
    mutate(call, value);
    const response = new Response(JSON.stringify(value), { status: 200, headers: { 'content-type': 'application/json' } });
    Object.defineProperty(response, 'url', { value: url }); return response;
  };
  return { transport, calls };
}
function claimStore() {
  const rows = new Map();
  return { async createExclusive(name, payload) {
    if (rows.has(name)) throw new Error('already claimed');
    rows.set(name, structuredClone(payload)); return { id: name };
  }, async read(id) { return { name: id, payload: structuredClone(rows.get(id)) }; } };
}
async function prepare(record = fixtureRecord(), mutate, failWrite, durableClaims = claimStore()) {
  const network = mock(record, mutate, failWrite); const recordBytes = JSON.stringify(record);
  const adapter = await createPreparedAdapter({ ...network, durableClaims, recordBytes, trustedRecordHash: sha256(recordBytes), now: () => now });
  return { adapter, ...network };
}
await test('default production factory and absent/mismatched approval pins deny before transport', async () => {
  assert.throws(createApprovedAdapter, /hard-disabled/);
  const record = JSON.stringify(fixtureRecord());
  assert.throws(() => validateRecord(record, null, now), /PIN/);
  assert.throws(() => validateRecord(record, '0'.repeat(64), now), /PIN/);
  const network = mock(fixtureRecord());
  await assert.rejects(createPreparedAdapter({ ...network, recordBytes: record, now: () => now }), /PIN/);
  assert.equal(network.calls.length, 0);
});
await test('owner-UI records require reviewed hashes, exact scope, freshness and capacity; typed FREE is not evidence', async () => {
  for (const change of [r => { r.costEvidence = { plan: 'FREE' }; }, r => { r.costEvidence.kind = 'authenticated-provider'; },
    r => { r.costEvidence.accountId = 'other'; }, r => { r.costEvidence.screenshotSha256 = ''; },
    r => { r.costEvidence.reviewEvidenceSha256 = ''; }, r => { r.costEvidence.capturedAt -= 86_400_001; },
    r => { r.costEvidence.workersPlan = 'workers-paid'; }, r => { r.costEvidence.maximumChargeUSD = 1; },
    r => { r.costEvidence.remaining.workerRequests = 47; }, r => { r.alert = null; },
    r => { r.claimArtifact = null; }, r => { r.reviewerPolicy = null; }, r => { r.ref = 'refs/heads/../unsafe'; }, r => { delete r.requireOwnerInitiator; }, r => { r.planHash = '0'.repeat(64); }]) {
    const record = fixtureRecord(); change(record); await assert.rejects(prepare(record), /BLOCKED/);
  }
});
await test('actual fixed read-only preflight uses only allowlisted metadata and identifies owner-UI evidence honestly', async () => {
  const { adapter, calls } = await prepare(); const receipt = await adapter.preflight();
  assert.match(receipt.costProvenance, /not authenticated/); assert.equal(receipt.executionEnabled, false);
  assert.ok(calls.every(c => c.method === 'GET'));
  assert.ok(calls.every(c => !/subscriptions|billing|entitlements|secrets|\/query|\/scripts\//.test(c.path)));
});
await test('two pairs execute exactly ten mock mutations, create private Workers, deploy by new immutable IDs, no legacy PUT', async () => {
  const { adapter, calls } = await prepare(); const result = await adapter.provision();
  assert.equal(result.receipts.length, 2); assert.equal(result.journal.length, 10);
  assert.ok(result.journal.every(e => e.outcome === 'confirmed'));
  assert.equal(result.actualHeartbeatVerified, false); assert.equal(result.intakeEnabled, false);
  assert.equal(calls.filter(c => c.method !== 'GET').length, 10);
  assert.ok(calls.filter(c => c.method === 'PUT').every(c => c.path.endsWith('/schedules')));
  for (const call of calls.filter(c => c.method === 'POST' && c.path.endsWith('/workers/workers')))
    assert.deepEqual(call.body.subdomain, { enabled: false, previews_enabled: false });
  const prior = calls.length; await assert.rejects(adapter.provision(), /ALREADY_STARTED/); assert.equal(calls.length, prior);
});
await test('every uncertain mutation poisons attempt; no retry, no resource deletion, no leaked provider errors', async () => {
  for (let failure = 1; failure <= 10; failure++) {
    const { adapter, calls } = await prepare(fixtureRecord(), undefined, failure);
    await assert.rejects(adapter.provision(), error => /RECONCILIATION/.test(error.message) && !error.message.includes('SYNTHETIC_SECRET'));
    assert.equal(adapter.journal().at(-1).outcome, 'uncertain');
    assert.equal(calls.filter(c => c.method !== 'GET').length, failure);
    const prior = calls.length; await assert.rejects(adapter.provision()); assert.equal(calls.length, prior);
    assert.ok(calls.every(c => c.method !== 'DELETE'));
  }
});
await test('unknown prior runs, reruns, branch drift, bypass and missing manual review block before writes', async () => {
  for (const change of [
    (c,v) => { if (c.path.endsWith('/runs/12345')) v.run_attempt = 2; },
    (c,v) => { if (c.path.endsWith('/runs/12345')) delete v.actor; },
    (c,v) => { if (c.path.endsWith(`/${workflow}/runs`)) { v.workflow_runs.push({ id: 1, workflow_id: 88, path: `.github/workflows/${workflow}`, status: 'completed', head_sha: 'a'.repeat(40), run_attempt: 1 }); v.total_count++; } },
    (c,v) => { if (c.path.includes('/git/ref/')) v.object.sha = 'b'.repeat(40); },
    (c,v) => { if (c.path.endsWith('/approvals')) v.splice(0); },
    (c,v) => { if (c.path.endsWith('/gemnao-preview-data')) v.can_admins_bypass = true; },
    (c,v) => { if (c.path.endsWith('/gemnao-preview-data')) v.protection_rules[0].prevent_self_review = true; },
  ]) {
    const { adapter, calls } = await prepare(fixtureRecord(), change); await assert.rejects(adapter.provision(), /BLOCKED/);
    assert.ok(calls.every(c => c.method === 'GET'));
  }
});
await test('owner can approve bot-originated run unless explicitly restricted; independent policy retains separation', async () => {
  const owner = fixtureRecord(); owner.requireOwnerInitiator = true;
  await assert.rejects((await prepare(owner)).adapter.preflight(), /OWNER_INITIATOR/);
  const independent = fixtureRecord(); independent.reviewerPolicy = 'independent';
  await (await prepare(independent)).adapter.preflight();
  const { adapter } = await prepare(independent, (c,v) => { if (c.path.endsWith('/runs/12345')) v.actor.id = 123; });
  await assert.rejects(adapter.preflight(), /SELF_REVIEW/);
});
await test('collisions, incomplete inventory, wrong account and unexpected returned IDs stop safely', async () => {
  const variants = [
    (c,v) => { if (c.path === account) v.result.id = 'other'; },
    (c,v) => { if (c.path.endsWith('/d1/database') && c.method === 'GET') delete v.result_info; },
    (c,v) => { if (c.path.endsWith('/d1/database') && c.method === 'GET') { v.result.push({ uuid: dbIds[0], name: FEATURES[0].database }); v.result_info.total_count++; } },
    (c,v) => { if (c.path.endsWith('/workers/workers') && c.method === 'POST') v.result.id = '../existing'; },
    (c,v) => { if (c.path.endsWith('/query')) v.result[0].success = false; },
    (c,v) => { if (c.path.endsWith(`/workers/workers/${workerIds[0]}`)) v.result.name = 'renamed'; },
    (c,v) => { if (c.path.includes('/versions/')) v.result.bindings[0].database_id = dbIds[1]; },
  ];
  for (const mutate of variants) { const { adapter, calls } = await prepare(fixtureRecord(), mutate);
    await assert.rejects(adapter.provision(), /BLOCKED/); assert.ok(calls.every(c => c.method !== 'DELETE')); }
});
await test('transport rejects redirects, bad content types, oversized responses and wrong response URL', async () => {
  for (const mode of ['redirect', 'html', 'oversize', 'url']) {
    const r = fixtureRecord(); const bytes = JSON.stringify(r);
    const transport = async url => { const response = new Response(mode === 'oversize' ? 'x'.repeat(1_048_577) : '{}', {
      status: mode === 'redirect' ? 302 : 200, headers: { 'content-type': mode === 'html' ? 'text/html' : 'application/json' } });
      Object.defineProperty(response, 'url', { value: mode === 'url' ? 'https://other.invalid' : url }); return response; };
    const adapter = await createPreparedAdapter({ transport, recordBytes: bytes, trustedRecordHash: sha256(bytes), now: () => now });
    await assert.rejects(adapter.preflight(), /REQUEST_UNCERTAIN/);
  }
});

await test('failed preflight and concurrent provision cannot initiate a second attempt', async () => {
  const { adapter, calls } = await prepare(fixtureRecord(), (c,v) => { if (c.path === account) v.result.id = 'other'; });
  await assert.rejects(adapter.provision()); const prior = calls.length;
  await assert.rejects(adapter.provision(), /ALREADY_STARTED/); assert.equal(calls.length, prior);
  const concurrent = await prepare(); const first = concurrent.adapter.provision();
  await assert.rejects(concurrent.adapter.provision(), /ALREADY_STARTED/); await first;
  assert.equal(concurrent.calls.filter(c => c.method !== 'GET').length, 10);
});
await test('a new process must reconcile any prior durable run, even after ephemeral journal loss', async () => {
  const record = fixtureRecord();
  const addPrior = (c,v) => { if (c.path.endsWith(`/${workflow}/runs`)) {
    v.workflow_runs.push({ id: 777, workflow_id: 88, path: `.github/workflows/${workflow}`, status: 'completed', conclusion: 'failure', head_sha: 'a'.repeat(40), run_attempt: 1 }); v.total_count++;
  } };
  await assert.rejects((await prepare(record, addPrior)).adapter.provision(), /RECONCILIATION/);
  record.reconciledNoWriteRuns = [{ id: 777, headSha: 'a'.repeat(40), classification: 'independently-reviewed-no-mutations', reviewEvidenceSha256: 'f'.repeat(64) }];
  await (await prepare(record, addPrior)).adapter.preflight();
  await assert.rejects((await prepare(record, (c,v) => { addPrior(c,v); if (c.path.endsWith(`/${workflow}/runs`)) v.workflow_runs[1].status = 'in_progress'; })).adapter.preflight(), /RECONCILIATION/);
});

await test('same-run fresh instances cannot replay an ambiguous write after losing their local journal', async () => {
  const durable = claimStore();
  const first = await prepare(fixtureRecord(), undefined, 1, durable);
  await assert.rejects(first.adapter.provision(), /WRITE_REQUIRES/);
  assert.equal(first.calls.filter(c => c.method !== 'GET').length, 1);
  // Fresh process equivalent: no local inventory/journal from the first attempt;
  // provider list still empty, but the independent durable claim remains.
  const restarted = await prepare(fixtureRecord(), undefined, 0, durable);
  await assert.rejects(restarted.adapter.provision(), /DURABLE_CLAIM_REQUIRES/);
  assert.equal(restarted.calls.filter(c => c.method !== 'GET').length, 0);
});
await test('missing, uncertain or mismatched durable claim never permits the first Cloudflare write', async () => {
  for (const claims of [null, { async createExclusive() { throw new Error('ambiguous claim'); }, async read() {} },
    { async createExclusive() { return { id: 'fake' }; }, async read() { return { name: 'other', payload: {} }; } }]) {
    const { adapter, calls } = await prepare(fixtureRecord(), undefined, 0, claims);
    await assert.rejects(adapter.provision(), /DURABLE_CLAIM/);
    assert.equal(calls.filter(c => c.method !== 'GET').length, 0);
  }
});

await test('official Artifact client integration attempts upload per process and cannot reuse an existing same-run claim', async () => {
  const rows = new Map(); let uploads = 0; let downloads = 0;
  const client = {
    async uploadArtifact(name, files, root, options) {
      uploads++; assert.equal(files.length, 1); assert.equal(files[0], join(root, 'claim.json'));
      assert.deepEqual(options, { retentionDays: 1, compressionLevel: 0 });
      if (rows.has(name)) throw new Error('409 artifact name already exists');
      const text = await readFile(files[0], 'utf8');
      const row = { id: 777, name, text, digest: sha256(text), size: Buffer.byteLength(text) };
      rows.set(name, row); return row;
    },
    async getArtifact(name) { return { artifact: rows.get(name) }; },
    async downloadArtifact(id, options) {
      downloads++; assert.equal(id, 777); assert.deepEqual(Object.keys(options).sort(), ['expectedHash', 'path']);
      const row = [...rows.values()][0]; assert.equal(options.expectedHash, row.digest);
      await writeFile(join(options.path, 'claim.json'), row.text);
      return { downloadPath: options.path, digestMismatch: false };
    },
    deleteArtifact() { assert.fail('claim deletion is forbidden'); },
  };
  const first = await prepare(fixtureRecord(), undefined, 1,
    createArtifactClaims({ client, clientVersion: '2.3.2', runId: 12345 }));
  await assert.rejects(first.adapter.provision(), /WRITE_REQUIRES/);
  const restarted = await prepare(fixtureRecord(), undefined, 0,
    createArtifactClaims({ client, clientVersion: '2.3.2', runId: 12345 }));
  await assert.rejects(restarted.adapter.provision(), /DURABLE_CLAIM_REQUIRES/);
  assert.equal(uploads, 2); assert.equal(downloads, 1);
  assert.equal(restarted.calls.filter(c => c.method !== 'GET').length, 0);
  assert.equal(rows.size, 1);
});

await test('same-UTC-day evidence survives setup delay, but reset/date/allowance/plan-change uncertainty blocks', async () => {
  const r = fixtureRecord(); r.costEvidence.capturedAt -= 3_600_000; r.costEvidence.reviewedAt -= 1_800_000;
  await (await prepare(r)).adapter.preflight();
  for (const change of [e => { e.quotaDateUTC = '2026-10-06'; }, e => { e.resetAt--; },
    e => { e.unchangedPlanReviewSha256 = ''; }, e => { delete e.interveningUsageAllowance; },
    e => { e.interveningUsageAllowance.d1RowsWritten = 2; }, e => { e.cronLimit = 250; }]) {
    const copy = fixtureRecord(); change(copy.costEvidence); await assert.rejects(prepare(copy), /BLOCKED/);
  }
});
await test('authenticated inventory counts existing Cron triggers; Worker/DB count alone cannot establish headroom', async () => {
  const { adapter, calls } = await prepare(fixtureRecord(), (c,v) => {
    if (c.path.endsWith('/workers/workers') && c.method === 'GET') {
      v.result.push({ id: 'f'.repeat(32), name: 'existing-metadata-only' }); v.result_info.total_count++;
    }
    if (c.path.endsWith('/existing-metadata-only/schedules')) v.result = Array.from({ length: 4 }, () => ({ cron: '0 * * * *' }));
  });
  await assert.rejects(adapter.provision(), /RESOURCE_SLOTS/);
  assert.ok(calls.some(c => c.path.endsWith('/existing-metadata-only/schedules')));
  assert.ok(calls.every(c => c.method === 'GET'));
});
await test('request budget reserves both pairs before writes, including prior read-only preflights', async () => {
  const inventory = count => (call, value) => {
    if (call.method === 'GET' && call.path.endsWith('/workers/workers')) {
      value.result = Array.from({ length: count }, (_, i) => ({ id: (i + 1).toString(16).padStart(32, '8'), name: `existing-metadata-${i}` }));
      value.result_info.total_count = count;
    }
  };
  const full = await prepare(fixtureRecord(), inventory(90));
  await assert.rejects(full.adapter.provision(), /REQUEST_BUDGET_BEFORE_WRITES/);
  assert.ok(full.calls.every(c => c.method === 'GET'));
  const boundary = await prepare(fixtureRecord(), inventory(89));
  assert.equal((await boundary.adapter.provision()).receipts.length, 2);
  assert.equal(boundary.calls.length, 120);
  const repeated = await prepare(fixtureRecord(), inventory(45));
  await repeated.adapter.preflight();
  await assert.rejects(repeated.adapter.provision(), /REQUEST_BUDGET_BEFORE_WRITES/);
  assert.ok(repeated.calls.every(c => c.method === 'GET'));
});
