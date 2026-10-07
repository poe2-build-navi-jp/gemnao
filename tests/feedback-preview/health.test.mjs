import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';
import { HEALTH_TARGETS, HEALTH_PLAN_HASH, healthTransport, heartbeatStatus } from '../../ops/feedback-preview/health.mjs';
import { createHealthAdapter, createPreparedAdapter } from '../../ops/feedback-preview/adapter.mjs';
import { runProtected, publicRunResult, SETUP } from '../../ops/feedback-preview/live.mjs';
import { TARGET, sha256 } from '../../ops/feedback-preview/controller.mjs';
import { readOnlyTransport } from '../../ops/feedback-preview/diagnostics.mjs';
import { fixtureRecord, mock } from './fixtures.mjs';
const now = Date.parse('2026-10-07T16:01:00Z');
const account = `https://api.cloudflare.com/client/v4/accounts/${TARGET.accountId}`;
function response(url, result) {
  const r = new Response(JSON.stringify({ success: true, errors: [], result }), { status: 200, headers: { 'content-type': 'application/json' } });
  Object.defineProperty(r, 'url', { value: url }); return r;
}
function setup(change = () => {}) {
  const record = fixtureRecord(); record.mode = 'cleanup-health'; record.healthPlanHash = HEALTH_PLAN_HASH;
  record.approvedAt = now; record.ref = SETUP.ref;
  const network = mock(record, (c,v) => {
    if (c.path.endsWith(`/environments/${SETUP.environment}`)) {
      v.id = SETUP.environmentId; v.protection_rules[0].reviewers[0].reviewer.login = SETUP.reviewerLogin;
    }
    if (c.path.endsWith('/approvals')) v[0].environments[0].id = SETUP.environmentId;
  });
  const calls = [];
  const transport = async (url, options) => {
    calls.push({ url, options });
    const target = HEALTH_TARGETS.find(t => url.startsWith(`${account}/d1/database/${t.databaseId}`));
    if (!target) return network.transport(url, options);
    let result;
    if (options.method === 'GET') result = { uuid: target.databaseId, name: target.databaseName };
    else {
      assert.equal(options.method, 'POST'); assert.equal(options.body, JSON.stringify({ sql: target.sql }));
      // D1 /query returns an array of QueryResult objects, each with results rows.
      result = [{ success: true, results: target.feature === 'feedback'
        ? [{ last_cleanup: Math.floor(now / 1000) - 60 }]
        : [{ value: String(now - 60_000), expires_at: now - 60_000 + 7_200_000 }],
      meta: { rows_read: 1, rows_written: 0, changed_db: false } }];
    }
    change(target, options, result); return response(url, result);
  };
  const bytes = () => JSON.stringify(record);
  const env = () => ({ GITHUB_ACTIONS: 'true', GITHUB_REPOSITORY: TARGET.repository, GITHUB_EVENT_NAME: 'workflow_dispatch',
    GITHUB_REF: SETUP.ref, GITHUB_RUN_ATTEMPT: '1', GITHUB_RUN_ID: String(record.runId), GITHUB_SHA: record.commit,
    GITHUB_WORKFLOW_SHA: record.commit, GITHUB_WORKFLOW_REF: `${TARGET.repository}/.github/workflows/feedback-preview-control.yml@${SETUP.ref}`,
    RUNNER_ENVIRONMENT: 'github-hosted', GITHUB_JOB: 'provision', PREVIEW_PROTECTED_ENVIRONMENT: SETUP.environment,
    PREVIEW_APPROVAL_RECORD: bytes(), PREVIEW_APPROVAL_SHA256: sha256(bytes()) });
  return { record, calls, transport, bytes, env };
}
await test('protected health verifies both exact identities before two SELECTs, never loads SDK, outputs only booleans', async () => {
  const f = setup();
  const result = await runProtected({ env: f.env(), checkoutSha: f.record.commit, transport: f.transport,
    loadClient: () => assert.fail('health cannot load SDK'), now: () => now });
  assert.deepEqual(publicRunResult(result), { feedback: { healthy: true, pending: false }, sharing: { healthy: true, pending: false }, intakeEnabled: false });
  const cf = f.calls.filter(c => c.url.startsWith(account));
  assert.deepEqual(cf.map(c => c.options.method), ['GET', 'GET', 'GET', 'POST', 'POST']);
  assert.ok(cf.filter(c => c.options.method === 'POST').every(c => HEALTH_TARGETS.some(t =>
    c.url === `${account}/d1/database/${t.databaseId}/query` && c.options.body === JSON.stringify({ sql: t.sql }))));
  assert.ok(!f.calls.some(c => /workers|artifacts/.test(c.url)));
});
await test('health transport allows only exact new DB heartbeat SQL once and leaves old GET-only mode unchanged', () => {
  let calls = 0; const transport = healthTransport(() => { calls++; });
  const target = HEALTH_TARGETS[0]; const url = `${account}/d1/database/${target.databaseId}/query`;
  for (const method of ['PUT', 'DELETE', 'PATCH']) assert.throws(() => transport(url, { method }), /HEALTH_REQUEST_SCOPE/);
  for (const sql of ['SELECT * FROM diagnostic_reports;', target.sql + ' DELETE FROM diagnostic_reports;', target.sql + ' '])
    assert.throws(() => transport(url, { method: 'POST', body: JSON.stringify({ sql }) }), /HEALTH_SQL_PIN/);
  assert.throws(() => transport(`${account}/d1/database/existing`, { method: 'GET' }), /HEALTH_REQUEST_SCOPE/);
  assert.throws(() => transport(`${account}/workers/workers`, { method: 'GET' }), /HEALTH_REQUEST_SCOPE/);
  assert.equal(calls, 0);
  transport(url, { method: 'POST', body: JSON.stringify({ sql: target.sql }) });
  assert.throws(() => transport(url, { method: 'POST', body: JSON.stringify({ sql: target.sql }) }), /HEALTH_QUERY_ONCE/);
  assert.equal(calls, 1);
  assert.throws(() => readOnlyTransport(() => assert.fail())(url, { method: 'POST' }), /READ_ONLY_METHOD/);
});
await test('health rejects wrong identity/plan/expired record and exposes no provisioning capability', async () => {
  const identity = setup((t, options, result) => { if (options.method === 'GET' && t.feature === 'sharing') result.uuid = HEALTH_TARGETS[0].databaseId; });
  await assert.rejects(runProtected({ env: identity.env(), checkoutSha: identity.record.commit, transport: identity.transport,
    loadClient: () => assert.fail(), now: () => now }), /HEALTH_DATABASE_IDENTITY/);
  assert.ok(identity.calls.every(c => c.options.method === 'GET'));
  for (const mutate of [r => { delete r.healthPlanHash; }, r => { r.approvedAt -= 3_600_001; }]) {
    const f = setup(); mutate(f.record);
    await assert.rejects(runProtected({ env: f.env(), checkoutSha: f.record.commit, transport: f.transport,
      loadClient: () => assert.fail(), now: () => now }), /BLOCKED/);
    assert.equal(f.calls.length, 0);
  }
  const f = setup(); const options = { transport: f.transport, recordBytes: f.bytes(), trustedRecordHash: sha256(f.bytes()), now: () => now };
  const adapter = await createHealthAdapter(options); assert.deepEqual(Object.keys(adapter), ['health']);
  await adapter.health(); const count = f.calls.length;
  await assert.rejects(adapter.health(), /ALREADY_STARTED/); assert.equal(f.calls.length, count);
  const creation = await createPreparedAdapter(options);
  await assert.rejects(creation.provision(), /READ_ONLY_MODE/); assert.equal(f.calls.length, count);
});
await test('missing/stale/future heartbeats remain pending; malformed or write-marked query results block', () => {
  const result = rows => [{ success: true, results: rows, meta: { rows_written: 0, changed_db: false } }];
  assert.deepEqual(heartbeatStatus('feedback', result([]), now), { healthy: false, pending: true });
  for (const stamp of [Math.floor((now - 7_200_001) / 1000), Math.floor(now / 1000) + 1, 0])
    assert.equal(heartbeatStatus('feedback', result([{ last_cleanup: stamp }]), now).healthy, false);
  for (const malformed of [[], [{ success: false, results: [] }], result([{}, {}]), result([null]), result([false]), result([{ last_cleanup: 'bad' }]),
    [{ success: true, results: [], meta: { rows_written: 1 } }], [{ success: true, results: [], meta: { changed_db: true } }]])
    assert.throws(() => heartbeatStatus('feedback', malformed, now), /HEALTH_/);
  assert.throws(() => heartbeatStatus('sharing', result([{ value: String(now), expires_at: now }]), now), /HEALTH_HEARTBEAT_SHAPE/);
});
await test('pinned SELECTs execute under SQLite authorizer with only heartbeat-column reads permitted', async () => {
  for (const target of HEALTH_TARGETS) {
    assert.equal(sha256(target.sql), target.sqlSha256);
    assert.match(target.sql, /^SELECT /); assert.equal((target.sql.match(/;/g) ?? []).length, 1);
  }
  const schemas = [await readFile('ops/feedback-preview/reviewed/0001.sql', 'utf8'),
    await readFile('ops/feedback-preview/reviewed/diagnosis/0001.sql', 'utf8')];
  const code = `import sqlite3,json,sys
x=json.load(sys.stdin)
for schema,target in zip(x['schemas'],x['targets']):
 db=sqlite3.connect(':memory:');db.executescript(schema)
 allowed={'diagnostic_retention_health':{'last_cleanup','singleton'},'diagnosis_operations':{'value','expires_at','key'}}
 def auth(action,a,b,c,d):
  if action==sqlite3.SQLITE_SELECT:return sqlite3.SQLITE_OK
  if action==sqlite3.SQLITE_READ and a in allowed and b in allowed[a]:return sqlite3.SQLITE_OK
  return sqlite3.SQLITE_DENY
 db.set_authorizer(auth)
 assert db.execute(target['sql']).fetchall()==[]
 print('read-only heartbeat SELECT passed')
`;
  const run = spawnSync('python3', ['-c', code], { input: JSON.stringify({ schemas, targets: HEALTH_TARGETS }), encoding: 'utf8' });
  assert.equal(run.status, 0, run.stderr); assert.equal(run.stdout.trim().split('\n').length, 2);
});
