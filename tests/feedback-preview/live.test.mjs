import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';
import { SETUP, validateContext, credentialTransport, runGate, runProtected, publicRunResult } from '../../ops/feedback-preview/live.mjs';
import { TARGET, sha256 } from '../../ops/feedback-preview/controller.mjs';
import { createDiagnostics, boundedFailure, failureSummary, readOnlyTransport, providerEnvelopeSummary } from '../../ops/feedback-preview/diagnostics.mjs';
import { createReadOnlyAdapter, createPreparedAdapter } from '../../ops/feedback-preview/adapter.mjs';
import { fixtureRecord, mock, now, workflow, account, dbIds } from './fixtures.mjs';
function context(record, job = 'provision') {
  return { GITHUB_ACTIONS: 'true', GITHUB_REPOSITORY: TARGET.repository, GITHUB_EVENT_NAME: 'workflow_dispatch',
    GITHUB_REF: SETUP.ref, GITHUB_RUN_ATTEMPT: '1', GITHUB_RUN_ID: String(record.runId),
    GITHUB_SHA: record.commit, GITHUB_WORKFLOW_SHA: record.commit,
    GITHUB_WORKFLOW_REF: `${TARGET.repository}/.github/workflows/feedback-preview-control.yml@${SETUP.ref}`,
    RUNNER_ENVIRONMENT: 'github-hosted', GITHUB_JOB: job, PREVIEW_PROTECTED_ENVIRONMENT: SETUP.environment,
    PREVIEW_OUTSIDE_RECORD_PRESENT: 'false', PREVIEW_OUTSIDE_DIGEST_PRESENT: 'false',
    PREVIEW_APPROVAL_RECORD: JSON.stringify(record), PREVIEW_APPROVAL_SHA256: sha256(JSON.stringify(record)) };
}
function setup() {
  const record = fixtureRecord(); record.ref = SETUP.ref;
  const network = mock(record, (call, value) => {
    if (call.path.endsWith(`/environments/${SETUP.environment}`)) {
      value.id = SETUP.environmentId; value.protection_rules[0].reviewers[0].reviewer.login = SETUP.reviewerLogin;
    }
    if (call.path.endsWith('/approvals')) value[0].environments[0].id = SETUP.environmentId;
  });
  return { record, env: context(record), ...network };
}
function artifactClient() {
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
await test('live action rejects non-GitHub, wrong ref/job/SHA/attempt/debug before token use', () => {
  const { record, env } = setup(); validateContext(env, record.commit, true);
  for (const [key, value] of Object.entries({ GITHUB_ACTIONS: 'false', GITHUB_REF: 'refs/heads/gemunao',
    GITHUB_JOB: 'gate', GITHUB_SHA: 'b'.repeat(40), GITHUB_RUN_ATTEMPT: '2', RUNNER_DEBUG: '1' }))
    assert.throws(() => validateContext({ ...env, [key]: value }, record.commit, true), /BLOCKED/);
});
await test('unprotected gate rejects repo/org secret fallback and verifies exact existing Environment', async () => {
  const f = setup(); const env = context(f.record, 'gate');
  const gate = await runGate({ env, checkoutSha: f.record.commit, transport: f.transport });
  assert.equal(gate.environment, SETUP.environment); assert.equal(gate.reviewerId, 123);
  assert.ok(f.calls.every(c => c.method === 'GET' && c.url.startsWith('https://api.github.com')));
  const prior = f.calls.length;
  for (const key of ['PREVIEW_OUTSIDE_RECORD_PRESENT', 'PREVIEW_OUTSIDE_DIGEST_PRESENT'])
    await assert.rejects(runGate({ env: { ...env, [key]: 'true' }, checkoutSha: f.record.commit, transport: f.transport }), /UNPROTECTED_RECORD_SECRET/);
  assert.equal(f.calls.length, prior);
});
await test('protected action defaults to deny missing/mismatched record without transport or SDK', async () => {
  for (const patch of [{ PREVIEW_APPROVAL_RECORD: '' }, { PREVIEW_APPROVAL_SHA256: '' }, { PREVIEW_APPROVAL_SHA256: '0'.repeat(64) }]) {
    const f = setup();
    await assert.rejects(runProtected({ env: { ...f.env, ...patch }, checkoutSha: f.record.commit,
      transport: f.transport, loadClient: () => assert.fail('SDK cannot load'), now: () => now }), /RECORD/);
    assert.equal(f.calls.length, 0);
  }
});
await test('expired exact record fails before any API, SDK or durable claim', async () => {
  const f = setup();
  await assert.rejects(runProtected({ env: f.env, checkoutSha: f.record.commit,
    transport: f.transport, loadClient: () => assert.fail('SDK cannot load'),
    now: () => f.record.approvedAt + 3_600_001 }), /BLOCKED:REVIEWED_RUN/);
  assert.equal(f.calls.length, 0);
});
await test('protected exact owner-approved run reaches bounded adapter with concrete Artifact wrapper, no live calls', async () => {
  const f = setup();
  const result = await runProtected({ env: f.env, checkoutSha: f.record.commit, transport: f.transport,
    loadClient: async () => artifactClient(), now: () => now });
  assert.equal(result.receipts.length, 2); assert.equal(result.alertDeliveryVerified, false);
  assert.equal(result.intakeEnabled, false); assert.equal(f.calls.filter(c => c.method !== 'GET').length, 10);
});
await test('credential transport is origin/account separated, lazy and redirect-denying', async () => {
  const calls = []; let cfReads = 0;
  const transport = credentialTransport({ githubToken: () => 'synthetic-github', cloudflareToken: () => { cfReads++; return 'synthetic-cloudflare'; },
    fetchImpl: async (url, options) => { calls.push({ url, options }); return new Response('{}'); } });
  await transport(`https://api.github.com/repos/${TARGET.repository}/actions/runs/1`, { method: 'GET', headers: {} });
  assert.equal(cfReads, 0); assert.equal(calls[0].options.headers.get('authorization'), 'Bearer synthetic-github');
  await transport(`https://api.cloudflare.com/client/v4/accounts/${TARGET.accountId}`, { method: 'GET', headers: {} });
  assert.equal(cfReads, 1); assert.equal(calls[1].options.headers.get('authorization'), 'Bearer synthetic-cloudflare');
  assert.ok(calls.every(c => c.options.redirect === 'error'));
  for (const url of ['https://other.invalid', 'https://api.cloudflare.com/client/v4/accounts/other', 'https://api.github.com/repos/other/repo'])
    await assert.rejects(transport(url, { method: 'GET' }), /SCOPE/);
});
await test('installed SDK matches exact lock and loads with no runtime token or network call', () => {
  const result = spawnSync(process.execPath, ['--input-type=module', '-e',
    "import {loadPinnedArtifactClient} from './ops/feedback-preview/live.mjs'; globalThis.fetch=()=>{throw Error('network forbidden')}; const client=await loadPinnedArtifactClient(); if(typeof client.uploadArtifact!=='function') process.exit(1);"],
  { encoding: 'utf8', env: { PATH: process.env.PATH } });
  assert.equal(result.status, 0, result.stderr);
});

await test('diagnostics expose only known stage/codes and static request classes/status', async () => {
  const marker = 'SYNTHETIC_PRIVATE_DO_NOT_LOG';
  const events = [];
  const diagnostics = createDiagnostics(event => events.push(event));
  diagnostics.stage(marker);
  const transport = diagnostics.transport(async () => new Response(marker, { status: 403, headers: { authorization: marker } }));
  await transport(`https://api.cloudflare.com/client/v4/accounts/${TARGET.accountId}/d1/database?private=${marker}`, { method: 'GET', headers: { authorization: marker } });
  const safe = diagnostics.failure(boundedFailure('REQUEST_UNCERTAIN_OR_INVALID', new Error(`BLOCKED:RESPONSE_IDENTITY_STATUS ${marker}`)));
  assert.deepEqual(safe, { stage: 'context', code: 'REQUEST_UNCERTAIN_OR_INVALID',
    request: { service: 'cloudflare', method: 'GET', endpoint: 'd1-databases', status: 403 } });
  const output = JSON.stringify({ events, safe });
  assert.ok(!output.includes(marker) && !output.includes(TARGET.accountId) && !output.includes('https:'));
  assert.deepEqual(failureSummary(boundedFailure('REQUEST_UNCERTAIN_OR_INVALID', new Error('BLOCKED:RESPONSE_TYPE'))),
    { code: 'REQUEST_UNCERTAIN_OR_INVALID', causeCode: 'RESPONSE_TYPE' });
  assert.deepEqual(failureSummary(new Error(marker)), { code: 'UNCLASSIFIED_FAILURE' });
});
await test('read-only capability rejects every mutation and non-preflight endpoint before transport', async () => {
  let calls = 0; const transport = readOnlyTransport(() => { calls++; });
  for (const method of ['POST', 'PUT', 'PATCH', 'DELETE', undefined])
    assert.throws(() => transport(`https://api.cloudflare.com/client/v4${account}/d1/database`, { method }), /READ_ONLY_METHOD/);
  for (const path of ['/d1/database/existing/query', '/workers/workers/existing/versions', '/subscriptions'])
    assert.throws(() => transport(`https://api.cloudflare.com/client/v4${account}${path}`, { method: 'GET' }), /READ_ONLY_ENDPOINT/);
  assert.equal(calls, 0);
});
await test('protected read-only reconciliation permits unresolved runs and collisions, never initializes SDK or writes', async () => {
  const f = setup(); f.record.mode = 'read-only-preflight';
  const network = mock(f.record, (c,v) => {
    if (c.path.endsWith(`/environments/${SETUP.environment}`)) {
      v.id = SETUP.environmentId; v.protection_rules[0].reviewers[0].reviewer.login = SETUP.reviewerLogin;
    }
    if (c.path.endsWith('/approvals')) v[0].environments[0].id = SETUP.environmentId;
    if (c.path.endsWith(`/${workflow}/runs`)) {
      v.workflow_runs.push({ id: 777, workflow_id: 88, path: `.github/workflows/${workflow}`, status: 'completed', head_sha: 'b'.repeat(40), run_attempt: 1 }); v.total_count++;
    }
    if (c.path.endsWith('/d1/database')) {
      v.result.push({ uuid: dbIds[0], name: TARGET.database }); v.result_info.total_count++;
    }
  });
  const stages = [];
  const result = await runProtected({ env: context(f.record), checkoutSha: f.record.commit,
    transport: network.transport, loadClient: () => assert.fail('read-only must never initialize SDK'), now: () => now,
    onStage: stage => stages.push(stage) });
  assert.equal(result.mode, 'read-only-preflight'); assert.equal(result.unreconciledPriorRunCount, 1);
  assert.equal(result.targetsAbsent, false); assert.equal(result.intakeEnabled, false); assert.equal(result.executionEnabled, false);
  assert.deepEqual(publicRunResult(result), { mode: 'read-only-preflight', completed: true, readOnly: true, intakeEnabled: false });
  assert.ok(network.calls.every(c => c.method === 'GET'));
  assert.ok(!stages.includes('artifact-sdk') && !stages.includes('claim'));
  const bytes = JSON.stringify(f.record);
  const adapter = await createReadOnlyAdapter({ transport: network.transport, recordBytes: bytes, trustedRecordHash: sha256(bytes), now: () => now });
  assert.deepEqual(Object.keys(adapter), ['preflight']);
  const ordinary = await createPreparedAdapter({ transport: network.transport, recordBytes: bytes, trustedRecordHash: sha256(bytes), now: () => now });
  const count = network.calls.length;
  await assert.rejects(ordinary.provision(), /READ_ONLY_MODE/); assert.equal(network.calls.length, count);
});
await test('read-only still requires a fresh exact-run record and actual owner approval', async () => {
  for (const mutate of [r => { r.approvedAt = now - 3_600_001; }, r => { r.runId++; }, r => { r.commit = 'b'.repeat(40); }]) {
    const f = setup(); f.record.mode = 'read-only-preflight'; const env = context(f.record); mutate(f.record);
    const bytes = JSON.stringify(f.record); env.PREVIEW_APPROVAL_RECORD = bytes; env.PREVIEW_APPROVAL_SHA256 = sha256(bytes);
    await assert.rejects(runProtected({ env, checkoutSha: env.GITHUB_SHA, transport: f.transport,
      loadClient: () => assert.fail('SDK cannot load'), now: () => now }), /BLOCKED/);
    assert.equal(f.calls.length, 0);
  }
  const f = setup(); f.record.mode = 'read-only-preflight';
  const network = mock(f.record, (c,v) => {
    if (c.path.endsWith(`/environments/${SETUP.environment}`)) {
      v.id = SETUP.environmentId; v.protection_rules[0].reviewers[0].reviewer.login = SETUP.reviewerLogin;
    }
    if (c.path.endsWith('/approvals')) v.splice(0);
  });
  await assert.rejects(runProtected({ env: context(f.record), checkoutSha: f.record.commit, transport: network.transport,
    loadClient: () => assert.fail('SDK cannot load'), now: () => now }), /RUN_ENVIRONMENT_APPROVAL/);
  assert.ok(network.calls.every(c => c.url.startsWith('https://api.github.com')));
});
await test('failed metadata response retains safe status/cause and never provider text', async () => {
  const f = setup(); const diagnostics = createDiagnostics();
  const transport = diagnostics.transport(async (url, options) => {
    if (url.startsWith('https://api.cloudflare.com')) {
      const response = new Response('SYNTHETIC_PRIVATE_PROVIDER_BODY', { status: 403, headers: { 'content-type': 'application/json' } });
      Object.defineProperty(response, 'url', { value: url }); return response;
    }
    return f.transport(url, options);
  });
  f.record.mode = 'read-only-preflight';
  let failure;
  try { await runProtected({ env: context(f.record), checkoutSha: f.record.commit, transport,
    loadClient: () => assert.fail('SDK cannot load'), now: () => now, onStage: diagnostics.stage }); }
  catch (error) { failure = diagnostics.failure(error); }
  assert.deepEqual(failure, { stage: 'account-preflight', code: 'REQUEST_UNCERTAIN_OR_INVALID',
    causeCode: 'RESPONSE_IDENTITY_STATUS', request: { service: 'cloudflare', method: 'GET', endpoint: 'account', status: 403 } });
});

await test('Cloudflare envelope diagnostics emit only fixed enums, never provider contents', () => {
  const marker = 'SYNTHETIC_PRIVATE_PROVIDER_VALUE';
  const variants = [
    [null, { success: 'invalid', errors: 'invalid' }],
    [{}, { success: 'missing', errors: 'absent' }],
    [{ success: true, errors: null }, { success: 'true', errors: 'null' }],
    [{ success: true, errors: [] }, { success: 'true', errors: 'empty' }],
    [{ success: false, errors: [{ message: marker }] }, { success: 'false', errors: 'nonempty' }],
    [{ success: marker, errors: marker }, { success: 'invalid', errors: 'invalid' }],
  ];
  for (const [body, expected] of variants) {
    assert.deepEqual(providerEnvelopeSummary(body), expected);
    const diagnostics = createDiagnostics(); diagnostics.envelope(providerEnvelopeSummary(body));
    assert.deepEqual(diagnostics.failure(new Error('BLOCKED:PROVIDER_RESULT')).envelope, expected);
    assert.ok(!JSON.stringify(diagnostics.failure(new Error(marker))).includes(marker));
  }
  const diagnostics = createDiagnostics(); diagnostics.envelope({ success: marker, errors: marker, extra: marker });
  assert.deepEqual(diagnostics.failure(new Error(marker)).envelope, { success: 'invalid', errors: 'invalid' });
});
await test('Workers list alone tolerates missing/null errors with true success and complete strict inventory', async () => {
  for (const errors of [undefined, null, []]) {
    const record = fixtureRecord(); record.mode = 'read-only-preflight';
    const network = mock(record, (c,v) => {
      if (c.path === account + '/workers/workers' && c.method === 'GET') {
        if (errors === undefined) delete v.errors; else v.errors = errors;
      }
    });
    const bytes = JSON.stringify(record);
    const adapter = await createReadOnlyAdapter({ transport: network.transport, recordBytes: bytes, trustedRecordHash: sha256(bytes), now: () => now });
    assert.equal((await adapter.preflight()).executionEnabled, false);
    assert.ok(network.calls.every(c => c.method === 'GET'));
  }
});
await test('Workers malformed envelopes/schema remain denied and other endpoints keep strict errors arrays', async () => {
  const variants = [
    v => { delete v.success; }, v => { v.success = false; }, v => { v.success = 'true'; },
    v => { v.errors = [{ message: 'SYNTHETIC_PRIVATE_PROVIDER_VALUE' }]; }, v => { v.errors = {}; },
    v => { v.errors = ''; }, v => { v.errors = null; v.result = {}; },
    v => { delete v.errors; delete v.result_info.total_count; },
    v => { delete v.errors; v.result = [{ id: 'invalid', name: 'invalid' }]; v.result_info.total_count = 1; },
  ];
  for (const mutate of variants) {
    const record = fixtureRecord(); record.mode = 'read-only-preflight';
    const network = mock(record, (c,v) => { if (c.path === account + '/workers/workers') mutate(v); });
    const bytes = JSON.stringify(record);
    const adapter = await createReadOnlyAdapter({ transport: network.transport, recordBytes: bytes, trustedRecordHash: sha256(bytes), now: () => now });
    await assert.rejects(adapter.preflight(), /BLOCKED/); assert.ok(network.calls.every(c => c.method === 'GET'));
  }
  for (const target of [account, account + '/d1/database']) {
    const record = fixtureRecord(); const network = mock(record, (c,v) => { if (c.path === target) delete v.errors; });
    const bytes = JSON.stringify(record);
    const adapter = await createPreparedAdapter({ transport: network.transport, recordBytes: bytes, trustedRecordHash: sha256(bytes), now: () => now });
    await assert.rejects(adapter.preflight(), /REQUEST_UNCERTAIN_OR_INVALID/);
  }
});
await test('Workers rejection reports safe envelope enums beside static request metadata', async () => {
  const f = setup(); f.record.mode = 'read-only-preflight'; const diagnostics = createDiagnostics();
  const transport = diagnostics.transport(async (url, options) => {
    const response = await f.transport(url, options);
    if (!url.includes('/workers/workers')) return response;
    const body = await response.json(); body.success = false; body.errors = null;
    const changed = new Response(JSON.stringify(body), { status: 200, headers: { 'content-type': 'application/json' } });
    Object.defineProperty(changed, 'url', { value: url }); return changed;
  });
  let failure;
  try { await runProtected({ env: context(f.record), checkoutSha: f.record.commit, transport,
    loadClient: () => assert.fail('SDK cannot load'), now: () => now,
    onStage: diagnostics.stage, onEnvelope: diagnostics.envelope }); }
  catch (error) { failure = diagnostics.failure(error); }
  assert.deepEqual(failure, { stage: 'inventory-preflight', code: 'REQUEST_UNCERTAIN_OR_INVALID', causeCode: 'PROVIDER_RESULT',
    request: { service: 'cloudflare', method: 'GET', endpoint: 'workers', status: 200 }, envelope: { success: 'false', errors: 'null' } });
});
