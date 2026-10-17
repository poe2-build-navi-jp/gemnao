// Synthetic SQLite and serializable Durable Object storage; no network/credentials.
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFile, mkdir } from 'node:fs/promises';
import { build } from 'esbuild';
import { guardFixture } from './community-reports-fixtures.mjs';
const out = '.wrangler/community-reports-review/admission.mjs';
await mkdir('.wrangler/community-reports-review', { recursive: true });
await build({
  stdin: {
    contents: `export * from './lib/community-reports/admission'; export * from './lib/community-reports/ledger'; export * from './lib/community-reports/guard-client'; export * from './lib/community-reports/service'; export * from './lib/community-reports/maintenance'; export * from './lib/community-reports/health'; export * from './lib/community-reports/cycle';`,
    resolveDir: process.cwd(),
    loader: 'ts',
  },
  outfile: out,
  bundle: true,
  platform: 'node',
  format: 'esm',
});
const m = await import('../' + out);
const schema = await readFile('migrations/community-reports/0001.sql', 'utf8');
async function setup() {
  const state = {
    now: Date.parse('2026-10-17T12:00:00Z') / 1000,
    calls: [],
    fail: false,
  };
  const sql = new DatabaseSync(':memory:');
  sql.exec('PRAGMA foreign_keys=ON');
  sql.exec(schema);
  const db = {
    prepare(q) {
      let args = [];
      return {
        bind(...a) {
          args = a;
          return this;
        },
        async first() {
          state.calls.push(q);
          if (state.fail) throw Error('synthetic');
          return sql.prepare(q).get(...args) ?? null;
        },
        async all() {
          state.calls.push(q);
          if (state.fail) throw Error('synthetic');
          return { success: true, results: sql.prepare(q).all(...args) };
        },
        async run() {
          state.calls.push(q);
          if (state.fail) throw Error('synthetic');
          const r = sql.prepare(q).run(...args);
          return { success: true, meta: { changes: Number(r.changes) } };
        },
      };
    },
    async batch(items) {
      sql.exec('BEGIN');
      try {
        const result = [];
        for (const item of items) result.push(await item.run());
        sql.exec('COMMIT');
        return result;
      } catch (e) {
        sql.exec('ROLLBACK');
        throw e;
      }
    },
  };
  const config = { REPORTS_BUDGET_MODE: m.FREE_BUDGET_MODE };
  const guard = await guardFixture(
    m.CommunityReportLedger,
    () => state.now,
    false,
    config,
  );
  const env = {
    ...config,
    REPORTS_DB: db,
    REPORTS_GUARD: guard.binding,
    REPORTS_GUARD_INSTANCE: guard.instanceId,
    REPORTS_ENABLED: 'true',
    REPORTS_PUBLIC_ENABLED: 'true',
    REPORTS_REVIEW_ENABLED: 'true',
    REPORTS_BUDGET_VERIFIED: 'true',
    REPORTS_MONITOR_MODE: 'public-status',
    REPORTS_PUBLIC_MONITOR_VERIFIED: 'true',
  };
  const request = (path, method = 'GET') =>
    new Request('https://test.invalid' + path, {
      method,
      headers: {
        origin: 'https://test.invalid',
        'CF-Connecting-IP': '192.0.2.1',
        'Content-Type': 'application/json',
      },
    });
  return { state, sql, guard, env, request };
}
{
  const { guard, env, state } = await setup();
  const ledger = structuredClone(guard.values.get('ledger'));
  const results = await Promise.allSettled(
    Array.from({ length: 150 }, () => m.admitReports(env, 'general')),
  );
  assert.equal(results.filter((r) => r.status === 'fulfilled').length, 128);
  assert(
    results
      .filter((r) => r.status === 'rejected')
      .every((r) => r.reason.status === 429),
  );
  assert.deepEqual(
    guard.values.get('ledger'),
    ledger,
    'budget never overwrites identity/tombstones',
  );
  guard.restart();
  await assert.rejects(m.admitReports(env, 'general'), (e) => e.status === 429);
  for (const kind of ['deletion', 'admin', 'cleanup'])
    await m.admitReports(env, kind);
  state.now = Math.floor(state.now / 86400) * 86400 + 86399;
  await assert.rejects(m.admitReports(env, 'general'), (e) => e.status === 429);
  state.now++;
  await m.admitReports(env, 'general');
  assert.equal(guard.values.get('daily-budget-v1').used.general, 1);
  state.now--;
  await assert.rejects(
    m.admitReports(env, 'deletion'),
    (e) => e.status === 503,
  );
  console.log(
    'PASS: concurrency, persisted restart, separate budgets, exact UTC reset and rollback refusal',
  );
}
{
  const { guard, env, state, request } = await setup();
  for (const invalid of [
    null,
    {},
    {
      day: 1,
      lastAt: 1,
      used: { general: -1, deletion: 0, admin: 0, cleanup: 0 },
    },
  ]) {
    guard.values.set('daily-budget-v1', invalid);
    assert.equal(
      (await m.handleReports(request('/api/reports/status'), env, state.now))
        .status,
      503,
    );
    assert.equal(state.calls.length, 0);
  }
  guard.values.delete('daily-budget-v1');
  guard.control.fail = true;
  assert.equal(
    (
      await m.handleReports(
        request('/api/reports/public?game=test-game'),
        env,
        state.now,
      )
    ).status,
    503,
  );
  assert.equal(state.calls.length, 0);
  guard.control.fail = false;
  state.fail = true;
  await m.handleReports(
    request('/api/reports/public?game=test-game'),
    env,
    state.now,
  );
  assert.equal(
    guard.values.get('daily-budget-v1').used.general,
    1,
    'no refund after downstream failure',
  );
  console.log(
    'PASS: malformed counters and storage faults deny before D1; failed downstream requests consume admission',
  );
}
{
  const { guard, env, state, request } = await setup();
  for (let i = 0; i < 128; i++) await m.admitReports(env, 'general');
  for (const path of [
    '/api/reports/status',
    '/api/reports/public',
    '/api/reports',
  ]) {
    assert.equal(
      (await m.handleReports(request(path), env, state.now)).status,
      429,
    );
    assert.equal(state.calls.length, 0);
  }
  const token = 'a'.repeat(64);
  const id =
    state.now.toString(16).padStart(8, '0') +
    (await m.digest(token)).slice(0, 24);
  const removed = await m.handleReports(
    new Request('https://test.invalid/api/reports/' + id, {
      method: 'DELETE',
      headers: {
        origin: 'https://test.invalid',
        'CF-Connecting-IP': '192.0.2.1',
        'Content-Type': 'application/json',
        'X-Report-Owner': token,
      },
      body: JSON.stringify({ requestId: 'b'.repeat(32) }),
    }),
    env,
    state.now,
  );
  assert.equal(removed.status, 200);
  assert.equal(guard.values.get('ledger').entries[id].blocked, true);
  assert(state.calls.length > 0);
  assert.equal(guard.values.get('daily-budget-v1').used.deletion, 1);
  state.calls = [];
  assert.equal(
    (
      await m.handleReports(
        request('/api/admin/reports'),
        env,
        state.now,
        async () => false,
      )
    ).status,
    401,
  );
  assert.equal(guard.values.get('daily-budget-v1').used.admin, 0);
  await m.handleReports(
    request('/api/admin/reports'),
    env,
    state.now,
    async () => true,
  );
  assert.equal(guard.values.get('daily-budget-v1').used.admin, 1);
  assert(state.calls.length > 0);
  for (let i = 0; i < 48; i++) await m.admitReports(env, 'cleanup');
  state.calls = [];
  await assert.rejects(
    m.runReportsMaintenance(env, state.now),
    (e) => e.status === 429,
  );
  assert.equal(
    state.calls.length,
    0,
    'denied maintenance cannot enter D1 failure receipt handler',
  );
  console.log(
    'PASS: general exhaustion leaves deletion/admin independent; unauthenticated admin and denied cleanup execute zero SQL',
  );
}
{
  const { guard, env, state, request } = await setup();
  const result = await m.runReportsCycle(env, state.now, async () => {
    throw Error('must not query analytics');
  });
  assert.equal(result.collectionOk, null);
  assert.equal(result.cleanupOk, true);
  assert.equal(result.budgetOk, true);
  console.log('COST: empty cleanup SQL statements=' + state.calls.length);
  const before = structuredClone(guard.values);
  const health = await m.reportsHealth(
    request('/api/reports/health'),
    env,
    state.now,
  );
  assert.equal(health.status, 200);
  const data = await health.json();
  assert.equal(data.schemaVersion, 2);
  assert.equal(data.observedAt, null);
  assert.equal(data.validUntil, null);
  assert.equal(data.budgetMode, m.FREE_BUDGET_MODE);
  assert.deepEqual(guard.values, before, 'health has no writes');
  state.calls = [];
  assert.equal(
    (
      await m.handleReports(
        request('/api/reports/public?game=test-game'),
        env,
        state.now,
      )
    ).status,
    200,
  );
  console.log('COST: empty public read SQL statements=' + state.calls.length);
  state.calls = [];
  assert.equal(
    (await m.handleReports(request('/api/reports/status'), env, state.now))
      .status,
    200,
  );
  console.log('COST: status SQL statements=' + state.calls.length);
  state.now += 7201;
  assert.equal(
    (await m.reportsHealth(request('/api/reports/health'), env, state.now))
      .status,
    503,
  );
  assert.equal(
    (
      await m.handleReports(
        request('/api/reports/public?game=test-game'),
        env,
        state.now,
      )
    ).status,
    503,
  );
  state.calls = [];
  const wrong = await m.runReportsCycle(
    env,
    state.now,
    async () => {
      throw Error('no network');
    },
    'wrong',
  );
  assert.equal(wrong.cleanupRan, false);
  assert.equal(state.calls.length, 0);
  console.log(
    'PASS: free mode uses real cleanup receipts without fabricated analytics; stale cleanup closes intake; wrong cron never runs cleanup',
  );
}
{
  const { env, state, request, guard } = await setup();
  const legacy = await guardFixture(m.CommunityReportLedger, () => state.now);
  const mismatched = {
    ...env,
    REPORTS_GUARD: legacy.binding,
    REPORTS_GUARD_INSTANCE: legacy.instanceId,
  };
  assert.equal(
    (
      await m.handleReports(
        request('/api/reports/public?game=test-game'),
        mismatched,
        state.now,
      )
    ).status,
    503,
  );
  assert.equal(state.calls.length, 0);
  const bad = { ...env, REPORTS_BUDGET_MODE: 'typo' };
  assert.equal(
    (await m.handleReports(request('/api/reports/status'), bad, state.now))
      .status,
    503,
  );
  assert.equal(state.calls.length, 0);
  const malformed = await guard.binding.fetch(
    new Request('https://guard.test/admit', {
      method: 'POST',
      headers: { 'X-Report-Instance': guard.instanceId },
      body: JSON.stringify({ kind: ['general'] }),
    }),
  );
  assert.equal(malformed.status, 400);
  console.log(
    'PASS: old guard, unknown policy and malformed category fail closed',
  );
}
{
  const { env, guard, state } = await setup();
  await m.runReportsMaintenance(env, state.now);
  await m.callGuard(env, '/observe', { state: '' });
  guard.restart();
  await assert.rejects(m.admitReports(env, 'general'), (e) => e.status === 503);
  await m.admitReports(env, 'deletion');
  state.now++;
  await m.runReportsMaintenance(env, state.now);
  assert.equal((await m.callGuard(env, '/health', {})).ready, false);
  console.log(
    'PASS: authenticated emergency stop persists across restart and cleanup; deletion remains independent',
  );
}
{
  const { env, state, request, sql } = await setup();
  await m.runReportsMaintenance(env, state.now);
  const token = 'c'.repeat(64),
    id =
      state.now.toString(16).padStart(8, '0') +
      (await m.digest(token)).slice(0, 24);
  const write = (path, deletion, body) =>
    new Request('https://test.invalid' + path, {
      method: deletion ? 'DELETE' : 'POST',
      headers: {
        origin: 'https://test.invalid',
        'CF-Connecting-IP': '192.0.2.2',
        'Content-Type': 'application/json',
        'X-Report-Owner': token,
      },
      body: JSON.stringify(body),
    });
  const content = {
    articlePath: '/games/monster-hunter-wilds/not-launching',
    symptom: 'launch',
    stepIds: ['steam-client-isolation'],
    outcome: 'unresolved',
    observedOn: null,
    version: '1.042.00.02',
    os: 'windows-11',
    gpu: 'nvidia',
    sources: [],
  };
  state.calls = [];
  const created = await m.handleReports(
    write('/api/reports', false, {
      id,
      requestId: 'd'.repeat(32),
      content,
      consent: 1,
    }),
    env,
    state.now,
  );
  assert.equal(created.status, 201);
  console.log('COST: create SQL statements=' + state.calls.length);
  state.calls = [];
  const queue = await m.handleReports(
    request('/api/admin/reports'),
    env,
    state.now,
    async () => true,
  );
  assert.equal(queue.status, 200);
  console.log(
    'COST: one-report admin queue SQL statements=' + state.calls.length,
  );
  state.calls = [];
  const deleted = await m.handleReports(
    write('/api/reports/' + id, true, { requestId: 'e'.repeat(32) }),
    env,
    state.now,
  );
  assert.equal(deleted.status, 200);
  console.log('COST: one-report deletion SQL statements=' + state.calls.length);
  const changes = () =>
    Number(sql.prepare('SELECT total_changes() AS n').get().n);
  state.now++;
  await m.runReportsMaintenance(env, state.now);
  const before = changes();
  state.now++;
  await m.runReportsMaintenance(env, state.now);
  assert.equal(
    changes() - before,
    1,
    'repeat cleanup only updates heartbeat after payloads already erased',
  );
  console.log(
    'PASS: real create/admin/deletion cost paths and repeated cleanup skips erased payload writes',
  );
}
console.log('PASS: 7 daily admission groups; local only');
