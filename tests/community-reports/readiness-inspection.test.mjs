import test from 'node:test';
import assert from 'node:assert/strict';
import {
  inspectReadiness,
  inspectionQuery,
  storageHistoryQuery,
  collectorSchemaCompatibility,
} from '../../ops/community-reports/readiness-inspection.mjs';
import { target } from '../../ops/community-reports/preflight.mjs';

const now = Date.parse('2026-10-16T19:00:00.000Z');
const dedicatedId = '3141aae6-8dc9-47e9-a8a2-7a05f642f94f';
const specs = {
  d1AnalyticsAdaptiveGroups: { sum: ['rowsRead', 'rowsWritten'] },
  d1StorageAdaptiveGroups: {
    max: ['databaseSizeBytes'],
    dimensions: ['databaseId'],
  },
  workersInvocationsAdaptive: { sum: ['requests'] },
  durableObjectsInvocationsAdaptiveGroups: { sum: ['requests'] },
  durableObjectsPeriodicGroups: {
    sum: ['duration', 'rowsRead', 'rowsWritten'],
  },
  durableObjectsSqlStorageGroups: {
    max: ['storedBytes'],
    dimensions: ['namespaceId'],
  },
};
const schemas = () =>
  Object.fromEntries(
    Object.entries(specs).map(([name, fields]) => [
      name,
      { ...fields, filter: ['datetime_geq', 'datetime_leq'] },
    ]),
  );
const environment = () => ({
  GITHUB_ACTIONS: 'true',
  GITHUB_REPOSITORY: target.repository,
  GITHUB_REF: 'refs/heads/gemunao',
  GITHUB_EVENT_NAME: 'workflow_dispatch',
  GITHUB_WORKFLOW: target.workflow,
  GITHUB_RUN_ATTEMPT: '1',
  GITHUB_RUN_ID: '123',
  GITHUB_SHA: 'a'.repeat(40),
  GH_TOKEN: 'SYNTHETIC_GITHUB_NOT_FOR_LOGS',
  CLOUDFLARE_API_TOKEN: 'SYNTHETIC_CLOUDFLARE_NOT_FOR_LOGS',
  REPORTS_PREFLIGHT_ENVIRONMENT: target.environment,
  REPORTS_READINESS_INSPECTION: 'true',
});
function fixture(mode) {
  const calls = [],
    ref = (name) => ({ name });
  const types = [
    {
      name: 'Account',
      fields: Object.keys(specs).map((name) => ({
        name,
        args: [{ name: 'filter', type: ref('Filter') }],
        type: ref(name + 'Row'),
      })),
    },
    {
      name: 'Filter',
      inputFields: [{ name: 'datetime_geq' }, { name: 'datetime_leq' }],
    },
  ];
  for (const [dataset, fields] of Object.entries(specs)) {
    types.push({
      name: dataset + 'Row',
      fields: Object.keys(fields).map((name) => ({
        name,
        type: ref(dataset + name),
      })),
    });
    for (const [name, names] of Object.entries(fields))
      types.push({
        name: dataset + name,
        fields: names.map((field) => ({ name: field })),
      });
  }
  const response = (data, status = 200) =>
    new Response(JSON.stringify(data), {
      status,
      headers: {
        'cache-control': 'no-store',
        'content-type': 'application/json',
      },
    });
  const fetcher = async (url, options) => {
    calls.push({ url, options });
    assert.equal(options.redirect, 'error');
    if (url.startsWith('https://api.github.com/')) {
      assert.equal(options.method, 'GET');
      assert.ok(url.includes('/environments/gemnao-d1-production'));
      return response(
        url.includes('deployment-branch-policies')
          ? {
              total_count: 1,
              branch_policies: [{ name: target.branch, type: 'branch' }],
            }
          : {
              name: target.environment,
              protection_rules: [
                {
                  type: 'required_reviewers',
                  reviewers: [{ type: 'User', id: 1 }],
                },
              ],
              deployment_branch_policy: {
                custom_branch_policies: true,
                protected_branches: false,
              },
            },
      );
    }
    if (url === 'https://gemnao.pages.dev/api/reports/health') {
      assert.equal(options.method, 'GET');
      assert.equal(options.credentials, 'omit');
      assert.equal(options.headers.Authorization, undefined);
      if (mode === 'health-blocked')
        return response({ private: 'DO_NOT_RETURN_BODY' }, 403);
      return response(
        {
          schemaVersion: 1,
          ok: false,
          intakeEnabled: false,
          publicEnabled: false,
          checkedAt: new Date(
            mode === 'health-stale' ? now - 600_000 : now,
          ).toISOString(),
          observedAt: null,
          validUntil: null,
          cleanupAt: null,
          reason: 'not-configured',
        },
        503,
      );
    }
    assert.ok(url.startsWith('https://api.cloudflare.com/client/v4/'));
    assert.equal(
      options.headers.Authorization,
      'Bearer SYNTHETIC_CLOUDFLARE_NOT_FOR_LOGS',
    );
    const path = new URL(url).pathname;
    if (path.endsWith(`/d1/database/${dedicatedId}/query`)) {
      assert.equal(options.method, 'POST');
      const body = JSON.parse(options.body);
      assert.match(body.sql, /^SELECT\s/);
      assert.ok(
        !/UPDATE|INSERT|DELETE|DROP|ALTER|PRAGMA|;|content_json|owner_hash/i.test(
          body.sql,
        ),
      );
      assert.deepEqual(body.params, [
        Math.floor(now / 1000),
        Math.floor(now / 1000) - 60,
      ]);
      return response({
        success: true,
        errors: [],
        result: [
          {
            success: true,
            results: [
              {
                report_count: mode === 'expired' ? 1 : 0,
                expired_count: mode === 'expired' ? 1 : 0,
                old_rate_count: 0,
                withdrawal_count: 0,
                cleanup_at: null,
                monitor_at: null,
              },
            ],
          },
        ],
      });
    }
    if (path === '/client/v4/graphql') {
      assert.equal(options.method, 'POST');
      const query = JSON.parse(options.body).query;
      assert.ok(!query.includes('mutation'));
      if (query.includes('__schema'))
        return response({ data: { __schema: { types } } });
      if (query.includes('settings{'))
        return response({
          data: {
            viewer: {
              accounts: [
                {
                  settings: Object.fromEntries(
                    Object.keys(specs).map((name) => [
                      name,
                      { enabled: mode !== 'disabled' },
                    ]),
                  ),
                },
              ],
            },
          },
        });
      if (query.startsWith('query CommunityReportsStorageHistory')) {
        if (mode === 'history-failed') throw Error('PRIVATE_PROVIDER_ERROR');
        const rows =
          mode === 'history-present'
            ? [
                {
                  max: { storedBytes: 123456 },
                  dimensions: { namespaceId: 'ns-one' },
                },
              ]
            : [];
        return response({
          data: { viewer: { accounts: [{ doStorage: rows }] } },
        });
      }
      assert.ok(query.startsWith('query CommunityReportsReadinessUsage'));
      if (mode === 'provider-error')
        return response({
          errors: [{ message: 'DO_NOT_RETURN_PROVIDER_ERROR' }],
          data: {},
        });
      const row = (aggregate, data, dimensions) => [
        { [aggregate]: data, ...(dimensions ? { dimensions } : {}) },
      ];
      const account = {
        d1: row('sum', {
          rowsRead: mode === 'limit' ? 4_000_000 : 10,
          rowsWritten: 2,
        }),
        d1Storage: row(
          'max',
          { databaseSizeBytes: 12_345 },
          { databaseId: mode === 'storage-missing' ? 'unknown' : dedicatedId },
        ),
        workers: mode === 'empty' ? [] : row('sum', { requests: 200 }),
        doRequests: row('sum', { requests: 20 }),
        doPeriodic: row('sum', {
          duration: 5,
          rowsRead: 15,
          rowsWritten:
            mode === 'negative' ? -1 : mode === 'fractional' ? 0.5 : 10,
        }),
        doStorage: row(
          'max',
          { storedBytes: 12_288 },
          { namespaceId: 'ns-one' },
        ),
      };
      if (['do-empty', 'history-present', 'history-failed'].includes(mode))
        account.doStorage = [];
      if (mode === 'run8-no-do-activity') {
        account.doRequests = [];
        account.doPeriodic = [];
      }
      if (mode === 'do-missing') delete account.doStorage;
      if (mode === 'do-unexpected')
        account.doStorage[0].dimensions.namespaceId = 'other-private-id';
      if (mode === 'do-duplicate') account.doStorage.push(account.doStorage[0]);
      if (mode === 'do-limit')
        account.doStorage = Array(1000).fill(account.doStorage[0]);
      if (mode === 'do-invalid') account.doStorage[0].max.storedBytes = 0.5;
      if (mode === 'do-missing-aggregate') delete account.doStorage[0].max;
      if (mode === 'do-zero') account.doStorage[0].max.storedBytes = 0;
      return response({ data: { viewer: { accounts: [account] } } });
    }
    assert.equal(options.method, 'GET');
    let result;
    if (path.endsWith('/d1/database'))
      result = [
        {
          uuid: mode === 'wrong-db' ? 'other-database' : dedicatedId,
          name: 'gemnao-community-reports-production',
        },
      ];
    else if (path.endsWith('/workers/scripts'))
      result = [{ id: 'gemnao-community-reports-cleanup' }];
    else if (path.endsWith('/workers/durable_objects/namespaces'))
      result =
        mode === 'do-uncovered'
          ? [{ id: 'ns-one' }, { id: 'private-unused-namespace' }]
          : [{ id: 'ns-one' }];
    else if (
      path.endsWith(
        '/workers/scripts/gemnao-community-reports-cleanup/schedules',
      )
    )
      result = { schedules: mode === 'cron' ? [{ cron: '*/15 * * * *' }] : [] };
    else
      assert.fail(
        'No other endpoints, settings, SQL, secret or mutation API is permitted',
      );
    return response({
      success: true,
      errors: [],
      result,
      result_info: { total_count: Array.isArray(result) ? result.length : 1 },
    });
  };
  return { fetcher, calls };
}
await test('one protected inspection uses only fixed GETs and three read-only GraphQL requests; values and credentials stay out of output', async () => {
  const f = fixture(),
    result = await inspectReadiness(environment(), f.fetcher, now);
  assert.equal(
    f.calls.filter((call) => new URL(call.url).pathname.endsWith('/graphql'))
      .length,
    3,
  );
  assert.ok(
    Object.values(result.usage.reportedBelow80Percent).every((v) => v === true),
  );
  assert.deepEqual(result.cleanup, {
    scheduleReadable: true,
    expectedSchedulePresent: false,
    executionVerified: false,
    dedicatedDatabaseMatched: true,
    reportRowsPresent: false,
    expiredReportRowsPresent: false,
    oldRateRowsPresent: false,
    unfinishedWithdrawalsPresent: false,
    lastCleanupReceiptAt: null,
    lastMonitorReceiptAt: null,
  });
  assert.equal(result.publicHealth.validSchema, true);
  assert.equal(result.publicHealth.intakeEnabled, false);
  for (const value of [
    'SYNTHETIC_GITHUB_NOT_FOR_LOGS',
    'SYNTHETIC_CLOUDFLARE_NOT_FOR_LOGS',
    dedicatedId,
    'ns-one',
    '12345',
    '12288',
  ])
    assert.ok(!JSON.stringify(result).includes(value));
  for (const key of [
    'productionChanged',
    'secretsExported',
    'authorizesActivation',
    'notificationDeliveryVerified',
    'automaticCollectorCompatible',
  ])
    assert.equal(result[key], false);
  assert.equal(result.usage.coverageWatermarkVerified, false);
  assert.equal(result.usage.durationUnitAndBillingVerified, false);
});
await test('missing protected mode, branch or Environment blocks before provider requests', async () => {
  for (const change of [
    { REPORTS_READINESS_INSPECTION: 'false' },
    { GITHUB_REF: 'refs/heads/other' },
    { REPORTS_PREFLIGHT_ENVIRONMENT: 'other' },
  ]) {
    const f = fixture();
    await assert.rejects(
      inspectReadiness({ ...environment(), ...change }, f.fetcher, now),
    );
    assert.equal(
      f.calls.filter((call) => !call.url.startsWith('https://api.github.com/'))
        .length,
      0,
    );
  }
});
await test('empty, negative and incompletely covered storage never become invented zeros or passing observations', async () => {
  for (const [mode, metric] of [
    ['empty', 'workerRequests'],
    ['negative', 'durableObjectRowsWritten'],
    ['storage-missing', 'd1AccountStorage'],
  ]) {
    const f = fixture(mode),
      result = await inspectReadiness(environment(), f.fetcher, now);
    assert.equal(result.usage.reportedBelow80Percent[metric], null);
    assert.equal(result.authorizesActivation, false);
  }
});
await test('80-percent boundary reports exceeded without writing stop flags or claiming complete usage', async () => {
  const f = fixture('limit'),
    result = await inspectReadiness(environment(), f.fetcher, now);
  assert.equal(result.usage.reportedBelow80Percent.d1RowsRead, false);
  assert.equal(result.usage.usageHeadroomVerified, false);
});
await test('existing cron is metadata only, never proof that cleanup ran', async () => {
  const f = fixture('cron'),
    result = await inspectReadiness(environment(), f.fetcher, now);
  assert.equal(result.cleanup.expectedSchedulePresent, true);
  assert.equal(result.cleanup.executionVerified, false);
});
await test('blocked or stale public health cannot prove monitoring or expose raw content', async () => {
  for (const mode of ['health-blocked', 'health-stale']) {
    const f = fixture(mode),
      result = await inspectReadiness(environment(), f.fetcher, now);
    assert.equal(result.publicHealth.reachable, false);
    assert.equal(result.notificationDeliveryVerified, false);
    assert.ok(!JSON.stringify(result).includes('DO_NOT_RETURN_BODY'));
  }
});
await test('partial provider errors stop inspection without leaking provider output', async () => {
  const f = fixture('provider-error');
  await assert.rejects(
    inspectReadiness(environment(), f.fetcher, now),
    /READINESS_INSPECTION_FAILED/,
  );
});
await test('a disabled dataset stops before the usage query', async () => {
  const f = fixture('disabled');
  await assert.rejects(
    inspectReadiness(environment(), f.fetcher, now),
    /READINESS_INSPECTION_FAILED/,
  );
  assert.equal(
    f.calls.filter((call) => call.options.method === 'POST').length,
    2,
  );
});
await test('dedicated DB identity mismatch stops before SQL; expired counts never execute erasure', async () => {
  const wrong = fixture('wrong-db');
  await assert.rejects(inspectReadiness(environment(), wrong.fetcher, now));
  assert.equal(
    wrong.calls.filter((call) => new URL(call.url).pathname.endsWith('/query'))
      .length,
    0,
  );
  const expired = fixture('expired'),
    result = await inspectReadiness(environment(), expired.fetcher, now);
  assert.equal(result.cleanup.expiredReportRowsPresent, true);
  assert.equal(result.cleanup.executionVerified, false);
  assert.equal(result.productionChanged, false);
  assert.equal(
    expired.calls.filter((call) =>
      new URL(call.url).pathname.endsWith('/query'),
    ).length,
    1,
  );
});
await test('query requires actual schema fields and same UTC day; uses fixed account and no mutation', () => {
  const schema = schemas(),
    plan = inspectionQuery(schema, now);
  assert.ok(plan.query.includes(target.account));
  assert.ok(!plan.query.includes('mutation'));
  assert.equal(plan.end, '2026-10-16T18:55:00.000Z');
  schema.durableObjectsPeriodicGroups.sum = [];
  assert.throws(() => inspectionQuery(schema, now));
  assert.equal(
    inspectionQuery(schemas(), Date.parse('2026-10-17T00:02:00.000Z')),
    null,
  );
});

await test('DO storage distinguishes absent, truncated and mismatched data without inventing zeros or exposing identities', async () => {
  for (const [mode, reason] of [
    ['do-empty', 'empty-rows'],
    ['do-missing', 'missing-rows'],
    ['do-unexpected', 'unexpected-resource'],
    ['do-duplicate', 'duplicate-resource'],
    ['do-limit', 'row-limit-reached'],
    ['do-invalid', 'invalid-value'],
    ['do-missing-aggregate', 'missing-aggregate'],
    ['do-uncovered', 'inventory-coverage-incomplete'],
  ]) {
    const f = fixture(mode);
    const result = await inspectReadiness(environment(), f.fetcher, now);
    assert.equal(
      result.usage.reportedBelow80Percent.durableObjectStorage,
      null,
    );
    assert.equal(result.usage.unknownReasons.doStorage, reason);
    assert.equal(result.usage.usageHeadroomVerified, false);
    assert.ok(!JSON.stringify(result).includes('private-'));
    assert.ok(!JSON.stringify(result).includes('ns-one'));
  }
  const f = fixture('do-zero');
  const result = await inspectReadiness(environment(), f.fetcher, now);
  assert.equal(result.usage.reportedBelow80Percent.durableObjectStorage, true);
  assert.equal(result.usage.unknownReasons.doStorage, undefined);
  assert.equal(result.authorizesActivation, false);
});
await test('fractional row counts cannot pass the usage threshold', async () => {
  const f = fixture('fractional');
  const result = await inspectReadiness(environment(), f.fetcher, now);
  assert.equal(
    result.usage.reportedBelow80Percent.durableObjectRowsWritten,
    null,
  );
  assert.equal(result.usage.unknownReasons.doPeriodic, 'invalid-value');
});
await test('observed schema permits read-only metrics but cannot satisfy collector coverage contract', () => {
  // Aggregate fields confirmed in schema run 38957022668; no synthetic watermark.
  const observed = schemas();
  observed.durableObjectsInvocationsAdaptiveGroups.max = [
    'datetime',
    'responseBodySize',
    'wallTime',
  ];
  observed.durableObjectsPeriodicGroups.max = [
    'activeWebsocketConnections',
    'memoryUsageBytes',
  ];
  observed.workersInvocationsAdaptive.max = [
    'cpuTime',
    'duration',
    'memoryUsageBytes',
    'requestDuration',
    'responseBodySize',
    'wallTime',
    'wasmMemoryBytes',
  ];
  const result = collectorSchemaCompatibility(observed);
  assert.deepEqual(result.missingMaxAggregate, ['d1AnalyticsAdaptiveGroups']);
  assert.equal(result.coverageSemanticsVerified, false);
  assert.equal(result.profileGenerated, false);
  const query = inspectionQuery(observed, now).query;
  assert.ok(!query.includes('freshnessField'));
  assert.ok(!query.includes('max{datetime'));
  assert.ok(query.includes('doStorage:durableObjectsSqlStorageGroups'));
});

await test('prior-day diagnostic never replaces empty current storage, even when old rows exist', async () => {
  for (const [mode, expected] of [
    ['do-empty', 'empty-rows'],
    ['history-present', 'rows-returned-inventory-covered'],
    ['history-failed', 'unavailable'],
  ]) {
    const f = fixture(mode);
    const result = await inspectReadiness(environment(), f.fetcher, now);
    assert.equal(result.storageHistory.result, expected);
    assert.equal(result.storageHistory.historicalOnly, true);
    assert.equal(
      result.storageHistory.requestedStart,
      '2026-10-15T00:00:00.000Z',
    );
    assert.equal(
      result.storageHistory.requestedEnd,
      '2026-10-15T23:59:59.999Z',
    );
    assert.equal(result.usage.unknownReasons.doStorage, 'empty-rows');
    assert.equal(
      result.usage.reportedBelow80Percent.durableObjectStorage,
      null,
    );
    assert.equal(result.authorizesActivation, false);
    assert.equal(result.automaticCollectorCompatible, false);
    assert.equal(
      f.calls.filter((c) =>
        c.options.body?.includes('CommunityReportsStorageHistory'),
      ).length,
      1,
    );
    assert.ok(
      !/123456|ns-one|PRIVATE_PROVIDER_ERROR/.test(JSON.stringify(result)),
    );
  }
});
await test('nonempty current storage does not trigger historical reads; history query is fixed and schema checked', async () => {
  const f = fixture();
  const result = await inspectReadiness(environment(), f.fetcher, now);
  assert.equal(result.storageHistory.attempted, false);
  assert.equal(
    f.calls.filter((c) =>
      c.options.body?.includes('CommunityReportsStorageHistory'),
    ).length,
    0,
  );
  const schema = schemas();
  const q = storageHistoryQuery(schema, Date.parse('2026-11-01T00:01:00.000Z'));
  assert.equal(q.start, '2026-10-31T00:00:00.000Z');
  assert.equal(q.end, '2026-10-31T23:59:59.999Z');
  assert.match(q.query, /limit:1000/);
  assert.ok(!/mutation|objectId|scriptName/.test(q.query));
  schema.durableObjectsSqlStorageGroups.filter = [];
  assert.throws(() => storageHistoryQuery(schema, now));
});

await test('run 39001009305 shape: known storage never turns missing DO activity into zeros or runtime readiness', async () => {
  // Reproduce the returned shape, not private metric values or a new live sample.
  const f = fixture('run8-no-do-activity');
  const result = await inspectReadiness(environment(), f.fetcher, now);
  assert.equal(result.usage.reportedBelow80Percent.durableObjectStorage, true);
  assert.deepEqual(result.usage.unknownReasons, {
    doRequests: 'empty-rows',
    doPeriodic: 'empty-rows',
  });
  for (const metric of [
    'durableObjectRequests',
    'durableObjectRowsRead',
    'durableObjectRowsWritten',
  ])
    assert.equal(result.usage.reportedBelow80Percent[metric], null);
  assert.equal(result.usage.durationValueReturned, false);
  assert.equal(result.storageHistory.attempted, false);
  assert.equal(result.usage.usageHeadroomVerified, false);
  assert.equal(result.automaticCollectorCompatible, false);
  assert.equal(result.authorizesActivation, false);
  assert.equal(
    f.calls.filter((c) =>
      c.options.body?.includes('CommunityReportsStorageHistory'),
    ).length,
    0,
  );
});
