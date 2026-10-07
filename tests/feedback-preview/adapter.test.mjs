import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createArtifactClaims } from '../../ops/feedback-preview/artifact-claim.mjs';
import { createPreparedAdapter, createApprovedAdapter, validateRecord, FEATURES } from '../../ops/feedback-preview/adapter.mjs';
import { sha256 } from '../../ops/feedback-preview/controller.mjs';
import { fixtureRecord, mock, prepare, claimStore, now, account, workflow, dbIds, workerIds } from './fixtures.mjs';
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
