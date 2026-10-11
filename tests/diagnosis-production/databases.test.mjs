import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { createPreparedAdapter, validateRecord, PLAN_HASH } from '../../ops/feedback-preview/adapter.mjs';
import { TARGET, sha256 } from '../../ops/feedback-preview/controller.mjs';
import { artifactClaimName } from '../../ops/feedback-preview/artifact-claim.mjs';
import { SETUP, runGate, runProtected, credentialTransport } from '../../ops/feedback-preview/live.mjs';
import { PRODUCTION_OPERATION as operation, PRODUCTION_MODE, PRODUCTION_RECORD_OPERATION,
  PRODUCTION_PLAN_HASH, PRODUCTION_FEATURES as features, PRODUCTION_ARTIFACTS as artifacts,
  EXCLUDED_DATABASE_IDS, isProductionOperation } from '../../ops/diagnosis-production/database-profile.mjs';
import { fixtureRecord, mock, claimStore, now, account, workflow, dbIds } from '../feedback-preview/fixtures.mjs';
function recordFixture() {
  const r = fixtureRecord();
  Object.assign(r, { mode: PRODUCTION_MODE, operation: PRODUCTION_RECORD_OPERATION,
    planHash: PRODUCTION_PLAN_HASH, ref: SETUP.ref, reconciledPriorRuns: [] });
  Object.assign(r.costEvidence, { operation: r.operation, planHash: r.planHash, reserve: { databaseSlots: 2 } });
  for (const key of ['remaining', 'interveningUsageAllowance', 'workerLimit', 'cronLimit']) delete r.costEvidence[key];
  for (const key of ['cleanupApproval', 'cronTargeting', 'alert', 'reconciledNoWriteRuns']) delete r[key];
  return r;
}
function network(r, mutate = () => {}, failure = 0) {
  return mock(r, (c, v) => {
    if (c.path.endsWith(`/environments/${SETUP.environment}`)) {
      v.id = SETUP.environmentId; v.protection_rules[0].reviewers[0].reviewer.login = SETUP.reviewerLogin;
    }
    if (c.path.endsWith('/approvals')) v[0].environments[0].id = SETUP.environmentId;
    mutate(c, v);
  }, failure, { features, artifacts });
}
async function prepare(r = recordFixture(), mutate, failure, durableClaims = claimStore()) {
  const n = network(r, mutate, failure); const recordBytes = JSON.stringify(r);
  return { ...n, adapter: await createPreparedAdapter({ ...n, operation, recordBytes,
    trustedRecordHash: sha256(recordBytes), now: () => now, durableClaims }) };
}
function context(r, job = 'provision') {
  const bytes = JSON.stringify(r);
  return { GITHUB_ACTIONS: 'true', GITHUB_REPOSITORY: TARGET.repository, GITHUB_EVENT_NAME: 'workflow_dispatch',
    GITHUB_REF: SETUP.ref, GITHUB_RUN_ATTEMPT: '1', GITHUB_RUN_ID: String(r.runId),
    GITHUB_SHA: r.commit, GITHUB_WORKFLOW_SHA: r.commit,
    GITHUB_WORKFLOW_REF: `${TARGET.repository}/.github/workflows/feedback-preview-control.yml@${SETUP.ref}`,
    RUNNER_ENVIRONMENT: 'github-hosted', GITHUB_JOB: job, PREVIEW_PROTECTED_ENVIRONMENT: SETUP.environment,
    PREVIEW_OUTSIDE_RECORD_PRESENT: 'false', PREVIEW_OUTSIDE_DIGEST_PRESENT: 'false',
    PREVIEW_OPERATION: operation, PREVIEW_APPROVAL_RECORD: bytes, PREVIEW_APPROVAL_SHA256: sha256(bytes) };
}
function client() {
  let row;
  return {
    async uploadArtifact(name, files) {
      assert.equal(row, undefined); const text = await readFile(files[0], 'utf8');
      row = { id: 777, name, text, size: Buffer.byteLength(text), digest: sha256(text) }; return row;
    },
    async getArtifact() { return { artifact: row }; },
    async downloadArtifact(id, options) { assert.equal(id, row.id); await writeFile(join(options.path, 'claim.json'), row.text);
      return { downloadPath: options.path, digestMismatch: false }; },
  };
}
await test('production fixed schemas create empty tables, no heartbeat or user data', async () => {
  for (const f of features) {
    const sql = await readFile(new URL('../../ops/feedback-preview/' + f.schema, import.meta.url), 'utf8');
    assert.equal(sha256(sql), artifacts[f.schema]);
    const db = new DatabaseSync(':memory:');
    try {
      db.exec(sql);
      const tables = db.prepare("SELECT name FROM sqlite_master WHERE type = 'table'").all();
      assert.ok(tables.length >= 4);
      for (const table of tables) assert.equal(db.prepare(`SELECT count(*) AS n FROM "${String(table.name)}"`).get().n, 0);
    } finally { db.close(); }
  }
});
await test('production performs only create/schema twice on fresh IDs; no account metadata or Workers access', async () => {
  const { adapter, calls } = await prepare(); const result = await adapter.provision();
  assert.equal(result.mode, PRODUCTION_MODE); assert.equal(result.intakeEnabled, false);
  assert.equal(result.receipts.length, 2); assert.equal(result.journal.length, 4);
  assert.ok(result.journal.every(e => e.outcome === 'confirmed'));
  const cf = calls.filter(c => c.url.startsWith('https://api.cloudflare.com/'));
  assert.ok(cf.every(c => c.path.startsWith(account + '/d1/database')));
  assert.deepEqual(cf.filter(c => c.method !== 'GET').map(c => [c.method, c.path, c.body.name ?? sha256(c.body.sql)]), [
    ['POST', account + '/d1/database', features[0].database],
    ['POST', account + '/d1/database/' + dbIds[0] + '/query', artifacts[features[0].schema]],
    ['POST', account + '/d1/database', features[1].database],
    ['POST', account + '/d1/database/' + dbIds[1] + '/query', artifacts[features[1].schema]],
  ]);
  const prior = calls.length; await assert.rejects(adapter.provision(), /ALREADY_STARTED/); assert.equal(calls.length, prior);
});
await test('profile, record and protected digest must agree; old QA approvals cannot authorize production', async () => {
  for (const r of [fixtureRecord(), { ...recordFixture(), planHash: PLAN_HASH }]) {
    const bytes = JSON.stringify(r); assert.throws(() => validateRecord(bytes, sha256(bytes), now, operation), /SCOPE/);
  }
  const bytes = JSON.stringify(recordFixture());
  assert.throws(() => validateRecord(bytes, sha256(bytes), now), /SCOPE/);
  assert.throws(() => isProductionOperation('arbitrary'), /SCOPE/);
  assert.notEqual(artifactClaimName(12345), artifactClaimName(12345, operation));
});
await test('reviewed Free plan and two available slots remain required, unused Worker budgets do not', async () => {
  for (const change of [r => { r.costEvidence.workersPlan = 'workers-paid'; },
    r => { r.costEvidence.reserve.databaseSlots = 1; }, r => { r.costEvidence.maximumChargeUSD = 1; },
    r => { r.costEvidence.screenshotSha256 = ''; }, r => { r.costEvidence.validUntil = now; }]) {
    const r = recordFixture(); change(r); await assert.rejects(prepare(r), /BLOCKED/);
  }
  const { adapter, calls } = await prepare(recordFixture(), (c, v) => {
    if (c.path === account + '/d1/database' && c.method === 'GET') {
      v.result = Array.from({ length: 9 }, (_, i) => ({ name: 'existing-' + i,
        uuid: `30000000-0000-4000-8000-${String(i).padStart(12, '0')}` })); v.result_info.total_count = 9;
    }
  });
  await assert.rejects(adapter.provision(), /RESOURCE_SLOTS/); assert.ok(calls.every(c => c.method === 'GET'));
});
await test('same-name collision never adopts, schemas, deletes or overwrites an existing DB', async () => {
  for (const f of features) {
    const { adapter, calls } = await prepare(recordFixture(), (c, v) => {
      if (c.path === account + '/d1/database' && c.method === 'GET') {
        v.result = [{ name: f.database, uuid: dbIds[0] }]; v.result_info.total_count = 1;
      }
    });
    await assert.rejects(adapter.provision(), /COLLISION/); assert.ok(calls.every(c => c.method === 'GET'));
  }
});
await test('ordinary and QA database IDs cannot be returned as new production resources', async () => {
  for (const id of EXCLUDED_DATABASE_IDS) {
    const { adapter, calls } = await prepare(recordFixture(), (c, v) => {
      if (c.path === account + '/d1/database' && c.method === 'POST') v.result.uuid = id;
    });
    await assert.rejects(adapter.provision(), /RECONCILIATION/);
    assert.equal(calls.filter(c => c.method !== 'GET').length, 1);
    assert.ok(calls.every(c => !c.path.endsWith('/query')));
  }
});
await test('each uncertain production mutation poisons the attempt and requires reconciliation', async () => {
  for (let i = 1; i <= 4; i++) {
    const { adapter, calls } = await prepare(recordFixture(), undefined, i);
    await assert.rejects(adapter.provision(), /WRITE_REQUIRES/);
    assert.equal(calls.filter(c => c.method !== 'GET').length, i);
    const before = calls.length; await assert.rejects(adapter.provision(), /ALREADY_STARTED/); assert.equal(calls.length, before);
  }
});
await test('schema partial failure and identity readback mismatch stop before the second DB', async () => {
  for (const change of [
    (c, v) => { if (c.path.endsWith('/query')) v.result[0].success = false; },
    (c, v) => { if (c.method === 'GET' && c.path.endsWith(dbIds[0])) v.result.name = 'unexpected'; },
  ]) {
    const { adapter, calls } = await prepare(recordFixture(), change);
    await assert.rejects(adapter.provision(), /BLOCKED/);
    assert.equal(calls.filter(c => c.method === 'POST' && c.path === account + '/d1/database').length, 1);
  }
});
await test('same-run durable production claim cannot be reused after an uncertain create', async () => {
  const claims = claimStore();
  await assert.rejects((await prepare(recordFixture(), undefined, 1, claims)).adapter.provision(), /WRITE_REQUIRES/);
  const second = await prepare(recordFixture(), undefined, 0, claims);
  await assert.rejects(second.adapter.provision(), /DURABLE_CLAIM_REQUIRES/);
  assert.ok(second.calls.every(c => c.method === 'GET'));
});
await test('existing Environment approval, branch and first-attempt protections remain enforced', async () => {
  for (const change of [
    (c, v) => { if (c.path.endsWith('/approvals')) v.splice(0); },
    (c, v) => { if (c.path.endsWith('/runs/12345')) v.run_attempt = 2; },
    (c, v) => { if (c.path.includes('/git/ref/')) v.object.sha = 'b'.repeat(40); },
    (c, v) => { if (c.path.endsWith('/gemnao-preview-data')) v.can_admins_bypass = true; },
  ]) {
    const { adapter, calls } = await prepare(recordFixture(), change);
    await assert.rejects(adapter.provision(), /BLOCKED/); assert.ok(calls.every(c => c.method === 'GET'));
  }
});
await test('prior QA success can be explicitly reconciled outside this scope; unknown attempts still block', async () => {
  const addPrior = (c, v) => {
    if (c.path.endsWith(`/${workflow}/runs`)) {
      v.workflow_runs.push({ id: 777, workflow_id: 88, path: `.github/workflows/${workflow}`, status: 'completed',
        head_sha: 'b'.repeat(40), run_attempt: 1 }); v.total_count++;
    }
  };
  await assert.rejects((await prepare(recordFixture(), addPrior)).adapter.provision(), /RECONCILIATION/);
  const r = recordFixture(); r.reconciledPriorRuns = [{ id: 777, headSha: 'b'.repeat(40),
    classification: 'independently-reviewed-preview-only', planHash: PLAN_HASH, reviewEvidenceSha256: 'e'.repeat(64) }];
  await (await prepare(r, addPrior)).adapter.provision();
  r.reconciledPriorRuns[0].planHash = PRODUCTION_PLAN_HASH; await assert.rejects(prepare(r), /RECONCILED_RUN/);
});
await test('live existing Environment path connects the production choice to its own claim and four writes', async () => {
  const r = recordFixture(); const n = network(r);
  const gate = await runGate({ env: context(r, 'gate'), checkoutSha: r.commit, transport: n.transport });
  assert.equal(gate.planHash, PRODUCTION_PLAN_HASH); assert.equal(gate.environment, SETUP.environment);
  assert.ok(n.calls.every(c => c.url.startsWith('https://api.github.com/')));
  const result = await runProtected({ env: context(r), checkoutSha: r.commit, transport: n.transport,
    loadClient: async () => client(), now: () => now });
  assert.equal(result.mode, PRODUCTION_MODE); assert.equal(n.calls.filter(c => c.method !== 'GET').length, 4);
});
await test('production credential transport cannot send its token to Workers or account metadata', async () => {
  let reads = 0;
  const transport = credentialTransport({ operation, githubToken: () => 'synthetic-gh',
    cloudflareToken: () => { reads++; return 'synthetic-cf'; }, fetchImpl: async () => new Response('{}') });
  for (const path of [account, account + '/workers/workers', account + '/workers/scripts/x/schedules'])
    await assert.rejects(transport('https://api.cloudflare.com/client/v4' + path, { method: 'GET' }), /SCOPE/);
  assert.equal(reads, 0);
  await transport('https://api.cloudflare.com/client/v4' + account + '/d1/database?page=1&per_page=100', { method: 'GET' });
  assert.equal(reads, 1);
});
