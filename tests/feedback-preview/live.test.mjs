import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';
import { SETUP, validateContext, credentialTransport, runGate, runProtected } from '../../ops/feedback-preview/live.mjs';
import { TARGET, sha256 } from '../../ops/feedback-preview/controller.mjs';
import { fixtureRecord, mock, now } from './fixtures.mjs';
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
await test('unprotected gate rejects repo/org authorization fallback and verifies exact existing Environment', async () => {
  const f = setup(); const env = context(f.record, 'gate');
  const gate = await runGate({ env, checkoutSha: f.record.commit, transport: f.transport });
  assert.equal(gate.environment, SETUP.environment); assert.equal(gate.reviewerId, 123);
  assert.ok(f.calls.every(c => c.method === 'GET' && c.url.startsWith('https://api.github.com')));
  const prior = f.calls.length;
  await assert.rejects(runGate({ env: { ...env, PREVIEW_OUTSIDE_RECORD_PRESENT: 'true' }, checkoutSha: f.record.commit, transport: f.transport }), /UNPROTECTED/);
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
