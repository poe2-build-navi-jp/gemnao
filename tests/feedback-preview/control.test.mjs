import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';
import { APPROVAL, ARTIFACTS, TARGET, SHARING, SOURCE, WRITES, checkArtifact, denyExecution,
  main, modelNextWrite, modelPreflight, plan, verifyArtifacts } from '../../ops/feedback-preview/controller.mjs';

const now = 1_791_350_000_000;
const fakeId = '11111111-2222-4333-8444-555555555555';
function fixture() {
  const approval = {
    ref: 'refs/heads/synthetic-reviewed-preview', commit: 'a'.repeat(40), reviewers: [123], reviewerPolicy: 'independent', requireOwnerInitiator: false,
    cleanup: true, alertDestination: 'synthetic-selected-channel',
    quotaReservation: { databaseSlots: 1, workerSlots: 1, cronSlots: 1,
      d1RowsRead: 100, d1RowsWritten: 100, storageBytes: 1_000_000, workerRequests: 24 },
  };
  const observation = {
    synthetic: true, repository: TARGET.repository, event: 'workflow_dispatch',
    ref: approval.ref, commit: approval.commit, runId: 'synthetic-run', runAttempt: 1,
    actorId: 456, approvedReviewerId: 123, approvedRunId: 'synthetic-run', observedAt: now,
    environment: {
      name: TARGET.environment, can_admins_bypass: false,
      deployment_branch_policy: { protected_branches: false, custom_branch_policies: true },
      protection_rules: [{ type: 'required_reviewers', prevent_self_review: true,
        reviewers: [{ type: 'User', reviewer: { id: 123 } }] }],
    },
    branchPolicies: [{ type: 'branch', name: 'synthetic-reviewed-preview' }],
    account: { authenticated: true, id: TARGET.accountId },
    billing: { providerEvidenceVerified: true, plan: 'workers-free', maximumChargeUSD: 0 },
    quota: { providerEvidenceVerified: true, completeAccountUsage: true,
      remaining: { ...approval.quotaReservation } },
    inventory: { complete: true, databaseIds: [], databaseNames: [], workerNames: [] },
    workerCreateMethod: 'post-new-worker-id',
    alert: { destination: approval.alertDestination, deliveryTestVerified: true },
    artifacts: { schema: ARTIFACTS['reviewed/0001.sql'], worker: ARTIFACTS['reviewed/cleanup.mjs'] },
  };
  return { approval, observation };
}
function denied(change) {
  const f = fixture();
  change(f.observation, f.approval);
  const result = modelNextWrite(f.observation, f.approval, [], now);
  assert.equal(result.executionAllowed, false);
  assert.equal(result.next, null);
  assert.ok(result.reasons.length > 0);
}

await test('fixed target/source identities and artifact hashes', async () => {
  assert.equal(TARGET.accountId, '6a09a32cba1288cccce5912015086a35');
  assert.equal(TARGET.database, 'gemnao-diagnostic-feedback-preview-20261007');
  assert.equal(TARGET.worker, 'gemnao-diagnostic-feedback-cleanup-preview');
  assert.equal(TARGET.binding, 'FEEDBACK_DB');
  assert.equal(TARGET.cron, '0 * * * *');
  assert.equal(SOURCE.base, '35e931b3163b85394b7ac7e44ddde9e54f3e6e87');
  assert.equal(SOURCE.tree, 'e49c2b6c6e5be8a2eb31730a9f3105d47a51bd40');
  await verifyArtifacts();
  assert.throws(() => checkArtifact('changed', ARTIFACTS['reviewed/0001.sql']), /mismatch/);
});
await test('off gate cannot be enabled by args, variables or even perfect model evidence', async () => {
  assert.equal(APPROVAL.ref, null);
  assert.deepEqual(APPROVAL.reviewers, []);
  assert.equal(APPROVAL.reviewerPolicy, null);
  assert.equal(APPROVAL.alertDestination, null);
  assert.equal(plan().executionAllowed, false);
  assert.throws(denyExecution, /hard-disabled/);
  await assert.rejects(main(['preflight']), /hard-disabled/);
  await assert.rejects(main(['provision']), /hard-disabled/);
  await assert.rejects(main(['plan', '--database=anything']), /Usage/);
  const f = fixture();
  assert.deepEqual(modelPreflight(f.observation, f.approval, now).modelBlockers, []);
  assert.equal(modelPreflight(f.observation, f.approval, now).executionAllowed, false);
  denied((_o, a) => Object.assign(a, APPROVAL));
});
await test('unknown/non-synthetic evidence is never authorization', () => {
  assert.ok(modelPreflight(null).modelBlockers.length > 0);
  denied(o => { o.synthetic = false; });
  denied(o => { o.account.authenticated = false; });
  denied(o => { o.account.id = 'wrong-account'; });
  denied(o => { o.observedAt -= 300_001; });
  denied(o => { o.observedAt += 1; });
});
await test('reject unexpected repository/event/ref/commit and reruns', () => {
  for (const [key, value] of Object.entries({ repository: 'other/repo', event: 'push',
    ref: 'refs/heads/unreviewed', commit: 'b'.repeat(40), runAttempt: 2 })) denied(o => { o[key] = value; });
  denied((_o, a) => { a.ref = 'refs/heads/*'; });
});
await test('reject missing/mismatched Environment, wildcard/tag/additional branch rules or admin bypass', () => {
  denied(o => { delete o.environment; });
  denied(o => { o.environment.name = 'unapproved'; });
  denied(o => { o.environment.can_admins_bypass = true; });
  denied(o => { delete o.environment.can_admins_bypass; });
  denied(o => { o.environment.deployment_branch_policy.protected_branches = true; });
  denied(o => { o.branchPolicies[0].name = '*'; });
  denied(o => { o.branchPolicies[0].type = 'tag'; });
  denied(o => { o.branchPolicies.push({ type: 'branch', name: 'other' }); });
});
await test('explicit independent policy requires exact reviewers, self-review prevention and per-run evidence', () => {
  denied(o => { o.environment.protection_rules = []; });
  denied(o => { o.environment.protection_rules[0].prevent_self_review = false; });
  denied(o => { o.environment.protection_rules[0].reviewers[0].reviewer.id = 999; });
  denied(o => { o.approvedReviewerId = o.actorId; });
  denied(o => { o.approvedRunId = 'old-run'; });
});
await test('typed FREE, unverified billing, paid plans and unknown/exhausted shared quotas fail closed', () => {
  denied(o => { o.billing = { plan: 'FREE' }; });
  denied(o => { o.billing.plan = 'workers-paid'; });
  denied(o => { o.billing.maximumChargeUSD = 0.01; });
  denied(o => { o.billing.providerEvidenceVerified = false; });
  denied(o => { delete o.quota; });
  denied(o => { o.quota.completeAccountUsage = false; });
  for (const dimension of Object.keys(fixture().approval.quotaReservation)) {
    denied(o => { delete o.quota.remaining[dimension]; });
    denied(o => { o.quota.remaining[dimension] = 0; });
  }
});
await test('collisions, incomplete inventory and an unreviewed Worker creation method halt', () => {
  denied(o => { o.inventory.complete = false; });
  denied(o => { o.inventory.databaseNames.push(TARGET.database); });
  denied(o => { o.inventory.workerNames.push(TARGET.worker); });
  denied(o => { o.workerCreateMethod = 'legacy-put'; });
});
await test('cleanup/alert choice and fixed hashes cannot be skipped', () => {
  denied((_o, a) => { a.cleanup = false; });
  denied((_o, a) => { a.alertDestination = null; });
  denied(o => { o.alert.deliveryTestVerified = false; });
  denied(o => { o.artifacts.schema = 'changed'; });
  denied(o => { o.artifacts.worker = 'changed'; });
});
await test('synthetic one-shot journal caps each fixed mutation, without any real transport', () => {
  const f = fixture();
  const journal = [];
  const calls = [];
  const mock = (action) => { calls.push(action); return { action, outcome: 'confirmed',
    accountId: TARGET.accountId, name: TARGET.database, databaseId: fakeId }; };
  for (const expected of WRITES) {
    const result = modelNextWrite(f.observation, f.approval, journal, now);
    assert.equal(result.executionAllowed, false);
    assert.equal(result.next, expected);
    journal.push(mock(result.next));
  }
  assert.deepEqual(calls, WRITES);
  assert.equal(modelNextWrite(f.observation, f.approval, journal, now).next, null);
  assert.equal(new Set(calls).size, 5);
});
await test('uncertain create is never retried; every uncertain later mutation also stops', () => {
  const f = fixture();
  for (let index = 0; index < WRITES.length; index++) {
    const journal = WRITES.slice(0, index + 1).map((action, i) => ({ action,
      outcome: i === index ? 'uncertain' : 'confirmed', accountId: TARGET.accountId,
      name: TARGET.database, databaseId: fakeId }));
    for (let check = 0; check < 3; check++) {
      const result = modelNextWrite(f.observation, f.approval, journal, now);
      assert.equal(result.next, null);
      assert.match(result.reasons.join(), /no retry/);
    }
  }
  for (const outcome of ['failed', 'in-flight', 'unknown']) {
    assert.equal(modelNextWrite(f.observation, f.approval, [{ action: WRITES[0], outcome }], now).next, null);
  }
});
await test('schema cannot target an existing DB or a mismatched creation receipt', () => {
  const f = fixture();
  const receipt = { action: WRITES[0], outcome: 'confirmed', accountId: TARGET.accountId,
    name: TARGET.database, databaseId: fakeId };
  for (const patch of [{ accountId: 'wrong' }, { name: 'existing-database' }, { databaseId: '../unsafe' }]) {
    assert.equal(modelNextWrite(f.observation, f.approval, [{ ...receipt, ...patch }], now).next, null);
  }
  f.observation.inventory.databaseIds.push(fakeId);
  assert.equal(modelNextWrite(f.observation, f.approval, [receipt], now).next, null);
});
await test('CLI never reads/logs synthetic credentials or unexpected arguments', () => {
  const marker = 'SYNTHETIC-DO-NOT-LOG-NOT-A-REAL-SECRET';
  for (const args of [['plan'], ['provision'], [marker]]) {
    const result = spawnSync(process.execPath, ['ops/feedback-preview/controller.mjs', ...args], {
      encoding: 'utf8', env: { CLOUDFLARE_API_TOKEN: marker, ENABLE_PROVISIONING: 'true', PLAN: 'FREE' },
    });
    assert.equal(result.status, args[0] === 'plan' ? 0 : 1);
    assert.ok(!(result.stdout + result.stderr).includes(marker));
  }
});
await test('workflow stays manual-only, zero secrets, literal disabled protected job', async () => {
  const workflow = await readFile('.github/workflows/feedback-preview-control.yml', 'utf8');
  assert.match(workflow, /on:\n  workflow_dispatch:\npermissions:/);
  assert.doesNotMatch(workflow, /inputs:|secrets\.|schedule:|pull_request:|push:|workflow_call:|id-token:|write/);
  assert.match(workflow, /if: \$\{\{ false \}\}/);
  assert.match(workflow, /environment: gemnao-preview-data/);
  assert.doesNotMatch(workflow.split('  provision:')[0], /environment:/);
  const controller = await readFile('ops/feedback-preview/controller.mjs', 'utf8');
  assert.doesNotMatch(controller, /process\.env|fetch\(|https?:\/\/|node:(?:https?|child_process)|wrangler/);
});
await test('new artifacts contain no production DB IDs, root migrations or fallback binding', async () => {
  const config = JSON.parse(await readFile('wrangler.json', 'utf8'));
  for (const path of ['ops/feedback-preview/controller.mjs', ...Object.keys(ARTIFACTS).map(p => `ops/feedback-preview/${p}`)]) {
    const source = await readFile(path, 'utf8');
    for (const db of config.d1_databases) assert.ok(!source.includes(db.database_id));
    assert.doesNotMatch(source, /env\.DB\b|\.openai\/drizzle|ops\/d1/);
  }
});

await test('sharing targets and pinned artifacts are distinct; preparation cannot enable provisioning', async () => {
  assert.equal(SHARING.database, 'gemnao-diagnosis-preview-20261007');
  assert.equal(SHARING.worker, 'gemnao-diagnosis-cleanup-preview');
  assert.equal(SHARING.binding, 'DIAGNOSIS_DB');
  assert.notEqual(SHARING.database, TARGET.database);
  assert.notEqual(SHARING.worker, TARGET.worker);
  assert.equal(SHARING.cleanupSource.commit, 'b2c51a26cd323492f9fdc0f4939d2967b1956e7f');
  assert.equal(SHARING.cleanupSource.tree, '51d849805ca36914046289626241d32bbd1b9cd5');
  assert.match(SHARING.status, /legacy-data continuity/);
  assert.equal(plan().sharingAdapterPrepared, true);
  assert.equal(plan().maximumCloudflareMutations, 10);
  await assert.rejects(main(['provision', '--sharing']), /Usage/);
});

await test('unknown reviewer policy blocks; owner-manual must be explicitly chosen and match actual settings', () => {
  denied((_o, a) => { a.reviewerPolicy = null; });
  denied((_o, a) => { delete a.reviewerPolicy; });
  denied((_o, a) => { a.reviewerPolicy = 'automatic'; });
  const { observation: o, approval: a } = fixture();
  a.reviewerPolicy = 'owner-manual';
  o.actorId = 123;
  o.environment.protection_rules[0].prevent_self_review = false;
  assert.deepEqual(modelPreflight(o, a, now).modelBlockers, []);
  assert.equal(modelNextWrite(o, a, [], now).next, 'create_database');
  assert.equal(modelNextWrite(o, a, [], now).executionAllowed, false);
  const reject = (change) => {
    const candidate = structuredClone(o);
    change(candidate);
    assert.equal(modelNextWrite(candidate, a, [], now).next, null);
  };
  reject(candidate => { candidate.environment.protection_rules[0].prevent_self_review = true; });
  reject(candidate => { candidate.environment.protection_rules[0].reviewers[0].type = 'Team'; });
  const botStarted = structuredClone(o); botStarted.actorId = 456;
  assert.deepEqual(modelPreflight(botStarted, a, now).modelBlockers, []);
  a.requireOwnerInitiator = true;
  assert.equal(modelNextWrite(botStarted, a, [], now).next, null);
  a.requireOwnerInitiator = false;
  reject(candidate => { candidate.approvedReviewerId = 456; });
  reject(candidate => { candidate.approvedRunId = 'old-run'; });
  reject(candidate => { candidate.environment.can_admins_bypass = true; });
  a.reviewerPolicy = 'independent';
  assert.equal(modelNextWrite(o, a, [], now).next, null);
});
