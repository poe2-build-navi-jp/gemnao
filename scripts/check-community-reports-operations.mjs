// Isolated synthetic provider + real local SQLite. No external requests/secrets.
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { build } from 'esbuild';
import { guardFixture } from './community-reports-fixtures.mjs';
const out = '.wrangler/community-reports-review';
await mkdir(out, { recursive: true });
await build({
  stdin: {
    contents: `export * from './lib/community-reports/control';export * from './lib/community-reports/collector';export * from './lib/community-reports/cycle';export * from './lib/community-reports/health';export * from './lib/community-reports/service';export * from './lib/community-reports/ledger';export * from './lib/community-reports/model';export * from './lib/community-reports/local';export * from './ops/community-reports/operating-plan.mjs';`,
    resolveDir: process.cwd(),
    loader: 'ts',
  },
  outfile: out + '/operations.mjs',
  bundle: true,
  platform: 'node',
  format: 'esm',
});
const m = await import('../.wrangler/community-reports-review/operations.mjs');
const dbIds = [
    '11111111-1111-4111-8111-111111111111',
    '22222222-2222-4222-8222-222222222222',
  ],
  nsIds = ['a'.repeat(32), 'b'.repeat(32)];
const metricKeys = Object.keys(m.usageLimits).filter(
  (k) => k !== 'largestDatabaseBytes',
);
// These field names are deliberately synthetic. This is NOT a verified
// Cloudflare profile and is never written to a deployment configuration.
const profile = {
  version: 1,
  metrics: Object.fromEntries(
    metricKeys.map((k, i) => [
      k,
      {
        dataset:
          k === 'workerRequestsToday'
            ? 'workersInvocationsAdaptive'
            : k.startsWith('durableObject')
              ? 'durableObjectsStorageGroups'
              : 'd1AnalyticsAdaptiveGroups',
        field: `syntheticMetric${i}`,
        aggregate: k.endsWith('StorageBytes') ? 'max' : 'sum',
        window: 'datetime',
        dimension:
          k === 'accountStorageBytes'
            ? 'databaseId'
            : k === 'durableObjectStorageBytes'
              ? 'namespaceId'
              : null,
        factor: k === 'durableObjectGbMillisecondsToday' ? 1000 : 1,
        freshnessField: 'syntheticCoverageThrough',
      },
    ]),
  ),
};
const schema = await readFile('migrations/community-reports/0001.sql', 'utf8');
async function setup() {
  const state = {
    now: Date.parse('2026-10-15T12:00:00.000Z') / 1000,
    fail: null,
    dbFail: false,
    requests: [],
    sqlReads: [],
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
          if (state.dbFail) throw Error('synthetic database failure');
          state.sqlReads.push(q);
          return sql.prepare(q).get(...args) ?? null;
        },
        async all() {
          if (state.dbFail) throw Error('synthetic database failure');
          state.sqlReads.push(q);
          return { success: true, results: sql.prepare(q).all(...args) };
        },
        async run() {
          if (state.dbFail) throw Error('synthetic database failure');
          const r = sql.prepare(q).run(...args);
          return { success: true, meta: { changes: Number(r.changes) } };
        },
      };
    },
    async batch(items) {
      if (state.dbFail) throw Error('synthetic database failure');
      sql.exec('BEGIN');
      try {
        const r = [];
        for (const item of items) r.push(await item.run());
        sql.exec('COMMIT');
        return r;
      } catch (e) {
        sql.exec('ROLLBACK');
        throw e;
      }
    },
  };
  const guard = await guardFixture(
    m.CommunityReportLedger,
    () => state.now,
    false,
  );
  const env = {
    REPORTS_DB: db,
    REPORTS_GUARD: guard.binding,
    REPORTS_GUARD_INSTANCE: guard.instanceId,
    REPORTS_ENABLED: 'true',
    REPORTS_PUBLIC_ENABLED: 'true',
    REPORTS_BUDGET_VERIFIED: 'true',
    REPORTS_REVIEW_ENABLED: 'true',
    REPORTS_AUTO_OBSERVATION_ENABLED: 'true',
    REPORTS_MONITOR_MODE: 'public-status',
    REPORTS_PUBLIC_MONITOR_VERIFIED: 'true',
    REPORTS_CLOUDFLARE_READ_TOKEN: 'SYNTHETIC_TOKEN_NOT_A_REAL_SECRET',
    REPORTS_USAGE_PROFILE_VERIFIED: 'true',
    REPORTS_USAGE_PROFILE_JSON: JSON.stringify(profile),
  };
  const response = (data, status = 200, date = state.now) =>
    new Response(JSON.stringify(data), {
      status,
      headers: {
        'Content-Type': 'application/json',
        Date: new Date(date * 1000).toUTCString(),
      },
    });
  const fetcher = async (url, options) => {
    const u = new URL(url);
    assert.equal(u.origin, 'https://api.cloudflare.com');
    assert.equal(options.redirect, 'error');
    assert.equal(
      options.headers.Authorization,
      'Bearer ' + env.REPORTS_CLOUDFLARE_READ_TOKEN,
    );
    state.requests.push({
      path: u.pathname + u.search,
      method: options.method,
      body: options.body,
    });
    if (state.fail === 'throw')
      throw Error('synthetic transport with secret-shaped details');
    if (state.fail === 'permission')
      return response({ errors: [{ code: 10000 }] }, 403);
    if (state.fail === 'stale')
      return response(
        { errors: [], success: true, result: [] },
        200,
        state.now - 3600,
      );
    if (u.pathname.endsWith('/d1/database'))
      return response({
        errors: [],
        success: true,
        result: dbIds.map((uuid) => ({ uuid })),
        result_info: {
          page: 1,
          total_count: state.fail === 'pagination' ? 3 : 2,
        },
      });
    if (u.pathname.endsWith('/workers/scripts'))
      return response({
        errors: [],
        success: true,
        result: Array.from(
          { length: state.fail === 'too-many-workers' ? 25 : 1 },
          (_, i) => ({ id: `synthetic-worker-${i}` }),
        ),
      });
    if (u.pathname.endsWith('/workers/durable_objects/namespaces'))
      return response({
        errors: [],
        success: true,
        result: nsIds.map((id) => ({ id, use_sqlite: state.fail !== 'kv' })),
        result_info: { page: 1, total_count: 2 },
      });
    if (u.pathname.endsWith('/schedules'))
      return response({
        errors: [],
        success: true,
        result: { schedules: [{ cron: '*/15 * * * *' }] },
      });
    assert.equal(u.pathname, '/client/v4/graphql');
    assert.equal(options.method, 'POST');
    const query = JSON.parse(options.body).query;
    assert.ok(query.startsWith('query CommunityReportsUsage'));
    assert.ok(!query.includes('mutation'));
    assert.ok(!query.includes(env.REPORTS_CLOUDFLARE_READ_TOKEN));
    const account = {};
    metricKeys.forEach((key, i) => {
      const p = profile.metrics[key];
      if (p.dimension)
        account[`m${i}`] = (p.dimension === 'databaseId' ? dbIds : nsIds).map(
          (id, j) => ({
            dimensions: { [p.dimension]: id },
            [p.aggregate]: { [p.field]: (j + 1) * 100 },
          }),
        );
      else
        account[`m${i}`] = [
          {
            [p.aggregate]: {
              [p.field]:
                state.fail === 'limit' && key === 'rowsReadToday'
                  ? 4_000_000
                  : 1,
            },
          },
        ];
      if (state.fail === 'empty') account[`m${i}`] = [];
      if (state.fail === 'missing-field' && i === 0)
        account[`m${i}`] = [{ sum: {} }];
      if (state.fail === 'overflow' && i === 0)
        account[`m${i}`] = [
          { sum: { [p.field]: Number.MAX_SAFE_INTEGER * 2 } },
        ];
      if (state.fail === 'truncated' && i === 0)
        account[`m${i}`] = Array(1000).fill(account[`m${i}`][0]);
      if (state.fail === 'storage-gap' && key === 'accountStorageBytes')
        account[`m${i}`].pop();
      for (const row of account[`m${i}`]) {
        row.max = { ...row.max };
        if (state.fail !== 'missing-asof')
          row.max[p.freshnessField] = new Date(
            (state.now -
              (state.fail === 'old-data'
                ? 3601
                : state.fail === 'future-data'
                  ? -1
                  : state.fail === 'mixed-age' && i === 0
                    ? 600
                    : 120)) *
              1000,
          ).toISOString();
      }
    });
    return response({
      errors: state.fail === 'partial' ? [{ message: 'synthetic error' }] : [],
      data: { viewer: { accounts: [account] } },
    });
  };
  const health = (override = {}) =>
    m.reportsHealth(
      new Request('https://local.test/api/reports/health'),
      { ...env, ...override },
      state.now,
    );
  return { state, sql, db, guard, env, fetcher, health };
}
const checks = [];
const pass = (name) => {
  checks.push(name);
  console.log('PASS: ' + name);
};
let f = await setup();
const usage = await m.readCloudflareUsage(f.env, f.state.now, f.fetcher);
assert.equal(usage.accountStorageBytes, 300);
assert.equal(usage.largestDatabaseBytes, 200);
assert.equal(usage.durableObjectStorageBytes, 300);
assert.equal(usage.durableObjectGbMillisecondsToday, 1000);
assert.equal(usage.databaseCount, 2);
assert.equal(usage.cronCount, 1);
assert.equal(
  usage.observedAt,
  new Date((f.state.now - 120) * 1000).toISOString(),
);
assert.equal(f.state.requests.length, 5);
assert.ok(
  f.state.requests.every(
    (r) => r.method === 'GET' || r.path === '/client/v4/graphql',
  ),
);
pass(
  'fixed read-only provider targets, account totals, maximum-per-resource storage, units, UTC window and ingestion allowance',
);
f.state.fail = 'mixed-age';
const olderCoverage = await m.readCloudflareUsage(
  f.env,
  f.state.now,
  f.fetcher,
);
assert.equal(
  olderCoverage.observedAt,
  new Date((f.state.now - 600) * 1000).toISOString(),
);
f.state.fail = null;
pass(
  'observation time uses the oldest provider data-coverage timestamp, not HTTP Date or query end',
);
const cycle = await m.runReportsCycle(f.env, f.state.now, f.fetcher);
assert.deepEqual(cycle, {
  collectionOk: true,
  cleanupRan: true,
  cleanupOk: true,
});
assert.equal((await f.health()).status, 200);
f.state.now += 900;
assert.deepEqual(await m.runReportsCycle(f.env, f.state.now, f.fetcher), {
  collectionOk: true,
  cleanupRan: false,
  cleanupOk: true,
});
f.state.now += 2700;
assert.deepEqual(await m.runReportsCycle(f.env, f.state.now, f.fetcher), {
  collectionOk: true,
  cleanupRan: true,
  cleanupOk: true,
});
pass(
  '15-minute collection renews automatically; cleanup runs initially and hourly without manual observation or daily monitor input',
);
const beforeGuard = JSON.stringify([...f.guard.values]),
  beforeSql = f.sql.prepare('SELECT total_changes() AS n').get().n,
  beforeRequests = f.state.requests.length;
f.state.sqlReads.length = 0;
for (let i = 0; i < 20; i++) {
  const r = await f.health();
  assert.equal(r.status, 200);
  assert.match(r.headers.get('cache-control'), /no-store/);
  const d = await r.json();
  assert.deepEqual(
    Object.keys(d).sort(),
    [
      'schemaVersion',
      'ok',
      'intakeEnabled',
      'publicEnabled',
      'checkedAt',
      'observedAt',
      'validUntil',
      'cleanupAt',
      'reason',
    ].sort(),
  );
  assert.ok(
    !JSON.stringify(d).includes('SYNTHETIC') &&
      !JSON.stringify(d).includes(m.REPORTS_ACCOUNT),
  );
}
assert.equal(JSON.stringify([...f.guard.values]), beforeGuard);
assert.equal(f.sql.prepare('SELECT total_changes() AS n').get().n, beforeSql);
assert.equal(f.state.requests.length, beforeRequests);
assert.ok(
  f.state.sqlReads.every(
    (q) => q === "SELECT value FROM community_operations WHERE key='cleanup'",
  ),
);
pass(
  'public health is read-only: zero SQL/DO mutations and provider calls; fixed schema excludes reports, keys, metrics and identities',
);
const key = m.randomHex(32),
  id =
    f.state.now.toString(16).padStart(8, '0') +
    (await m.digest(key)).slice(0, 24);
const request = (path, method, data) =>
  new Request('https://local.test' + path, {
    method,
    headers: {
      origin: 'https://local.test',
      'Content-Type': 'application/json',
      'cf-connecting-ip': '192.0.2.1',
      'X-Report-Owner': key,
    },
    ...(data ? { body: JSON.stringify(data) } : {}),
  });
const content = {
  articlePath: '/games/monster-hunter-wilds/not-launching',
  symptom: 'launch',
  stepIds: ['steam-client-isolation'],
  outcome: 'unresolved',
  observedOn: null,
  version: '',
  os: 'unknown',
  gpu: 'unknown',
  sources: [],
};
assert.equal(
  (
    await m.handleReports(
      request('/api/reports', 'POST', {
        id,
        requestId: m.randomHex(),
        consent: 1,
        content,
      }),
      f.env,
      f.state.now,
    )
  ).status,
  201,
);
f.state.now += 1681;
assert.equal((await f.health()).status, 503);
assert.equal(await m.reportsHealthy(f.env, f.state.now), false);
assert.equal(
  (
    await m.handleReports(
      request('/api/reports', 'POST', {
        id,
        requestId: m.randomHex(),
        consent: 1,
        content,
      }),
      f.env,
      f.state.now,
    )
  ).status,
  503,
);
assert.equal(
  (
    await m.handleReports(
      request('/api/reports/' + id, 'DELETE', { requestId: m.randomHex() }),
      f.env,
      f.state.now,
    )
  ).status,
  200,
);
pass(
  'stopped collector expires intake in the actual API while owner deletion remains available',
);
for (const failure of [
  'permission',
  'partial',
  'empty',
  'missing-field',
  'overflow',
  'truncated',
  'storage-gap',
  'pagination',
  'too-many-workers',
  'kv',
  'stale',
  'old-data',
  'future-data',
  'missing-asof',
  'throw',
  'limit',
]) {
  f = await setup();
  await m.runReportsCycle(f.env, f.state.now, f.fetcher);
  f.state.now += 900;
  f.state.fail = failure;
  const r = await m.collectReportsUsage(f.env, f.state.now, f.fetcher);
  assert.equal(r.ok, false, failure);
  assert.equal((await f.health()).status, 503, failure);
  if (failure !== 'limit') {
    const health = await (await f.health()).json();
    assert.equal(health.observedAt, null, 'failure receipt is not a provider observation');
    assert.equal(health.validUntil, null);
  }
  assert.equal(await m.reportsHealthy(f.env, f.state.now), false, failure);
}
pass(
  'provider denial, partial/empty/missing/overflow/truncated data, incomplete inventories, budget limits, KV storage, stale responses, network and 80% all close intake',
);
for (const [key, value] of [
  ['REPORTS_CLOUDFLARE_READ_TOKEN', undefined],
  ['REPORTS_USAGE_PROFILE_JSON', undefined],
  ['REPORTS_USAGE_PROFILE_VERIFIED', undefined],
  ['REPORTS_PUBLIC_MONITOR_VERIFIED', undefined],
  ['REPORTS_MONITOR_MODE', undefined],
  ['REPORTS_AUTO_OBSERVATION_ENABLED', undefined],
]) {
  f = await setup();
  f.env[key] = value;
  assert.equal(
    (await m.collectReportsUsage(f.env, f.state.now, f.fetcher)).ok,
    false,
  );
  assert.equal(f.state.requests.length, 0);
  assert.equal((await f.health()).status, 503);
}
pass(
  'missing credentials/profile/verification/monitor mode stay closed without contacting the provider',
);
f = await setup();
await m.runReportsCycle(f.env, f.state.now, f.fetcher);
f.state.now += 3600;
f.state.dbFail = true;
const failed = await m.runReportsCycle(f.env, f.state.now, f.fetcher);
assert.equal(failed.cleanupOk, false);
assert.equal((await f.health()).status, 503);
f.state.dbFail = false;
assert.equal((await f.health()).status, 503);
f.state.now += 900;
assert.equal(
  (await m.runReportsCycle(f.env, f.state.now, f.fetcher)).cleanupOk,
  true,
);
assert.equal((await f.health()).status, 200);
pass(
  'cleanup failure survives a restored D1 heartbeat and recovers only after a newer successful cleanup',
);
f = await setup();
await m.runReportsCycle(f.env, f.state.now, f.fetcher);
f.state.now += 900;
assert.equal(
  (await m.runReportsCycle(f.env, f.state.now, f.fetcher, '37 * * * *'))
    .collectionOk,
  false,
);
assert.equal((await f.health()).status, 503);
f.state.now += 900;
await m.runReportsCycle(f.env, f.state.now, f.fetcher);
assert.equal((await f.health()).status, 200);
f.state.now += 7201;
assert.equal((await f.health()).status, 503);
pass(
  'wrong cron configuration closes a prior lease and missing hourly cleanup never remains healthy',
);
f = await setup();
f.state.now = Date.parse('2026-10-16T00:00:30.000Z') / 1000;
assert.equal(
  (await m.runReportsCycle(f.env, f.state.now, f.fetcher)).collectionOk,
  false,
);
assert.equal((await f.health()).status, 503);
f.state.now += 900;
assert.equal(
  (await m.runReportsCycle(f.env, f.state.now, f.fetcher)).collectionOk,
  true,
);
assert.equal((await f.health()).status, 200);
pass(
  'UTC day rollover rejects previous-day usage and recovers with an actual new-day observation',
);
f = await setup();
assert.equal(
  (
    await m.reportsHealth(
      new Request('https://local.test/api/reports/health?owner=synthetic'),
      f.env,
      f.state.now,
    )
  ).status,
  400,
);
assert.equal(
  (
    await m.reportsHealth(
      new Request('https://local.test/api/reports/health', { method: 'POST' }),
      f.env,
      f.state.now,
    )
  ).status,
  405,
);
assert.equal(
  (await f.health({ REPORTS_GUARD_INSTANCE: 'wrong-instance' })).status,
  503,
);
for (const raw of [
  '{}',
  JSON.stringify({
    ...profile,
    metrics: {
      ...profile.metrics,
      rowsReadToday: {
        ...profile.metrics.rowsReadToday,
        field: 'x } mutation { destroy',
      },
    },
  }),
  JSON.stringify({
    ...profile,
    metrics: {
      ...profile.metrics,
      accountStorageBytes: {
        ...profile.metrics.accountStorageBytes,
        aggregate: 'sum',
      },
    },
  }),
])
  assert.throws(() => m.parseUsageProfile(raw));
pass(
  'health rejects query/non-GET/wrong instance and profile validation rejects query injection or unsafe storage aggregation',
);
f = await setup();
await m.runReportsCycle(f.env, f.state.now, f.fetcher);
const trustedState = f.guard.values.get('ledger').runtime;
const beforeControl = JSON.stringify([...f.guard.values]);
const controlRequest = (state) =>
  new Request('https://local.test/api/admin/reports-control', {
    method: 'POST',
    headers: {
      origin: 'https://local.test',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ state }),
  });
assert.equal(
  (
    await m.observeReports(
      controlRequest(trustedState),
      f.env,
      async () => true,
    )
  ).status,
  409,
);
assert.equal(
  (
    await m.observeReports(
      controlRequest(trustedState),
      { ...f.env, REPORTS_AUTO_OBSERVATION_ENABLED: undefined },
      async () => true,
    )
  ).status,
  409,
);
assert.equal(JSON.stringify([...f.guard.values]), beforeControl);
assert.equal(
  (await m.observeReports(controlRequest(''), f.env, async () => true)).status,
  200,
);
assert.equal((await f.health()).status, 503);
pass(
  'manual HTTP control cannot impersonate internal automatic observations; automatic mode permits emergency stop only',
);
await writeFile(
  out + '/operations-results.json',
  JSON.stringify(
    {
      checks,
      remoteRequests: 0,
      productionWrites: 0,
      tokensCreated: 0,
      profileSource: 'synthetic-only-not-production',
    },
    null,
    2,
  ),
);
console.log(
  `PASS: ${checks.length} automated-operations groups; synthetic HTTP only, local SQLite and isolated guard.`,
);
