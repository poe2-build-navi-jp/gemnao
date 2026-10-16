import test from 'node:test';
import assert from 'node:assert/strict';
import {
  context,
  gate,
  discover,
  target,
  failureLines,
} from '../../ops/community-reports/preflight.mjs';
const env = () => ({
  GITHUB_ACTIONS: 'true',
  GITHUB_REPOSITORY: target.repository,
  GITHUB_REF: 'refs/heads/gemunao',
  GITHUB_EVENT_NAME: 'workflow_dispatch',
  GITHUB_WORKFLOW: target.workflow,
  GITHUB_RUN_ATTEMPT: '1',
  GITHUB_RUN_ID: '123',
  GITHUB_SHA: 'a'.repeat(40),
  GH_TOKEN: 'SYNTHETIC_GITHUB',
  CLOUDFLARE_API_TOKEN: 'SYNTHETIC_CLOUDFLARE_READ_TOKEN',
  REPORTS_PREFLIGHT_ENVIRONMENT: target.environment,
});
function fixture(mode) {
  const calls = [];
  const ref = (name) => {
    if (mode === 'unresolved-row' && name === 'Row0')
      return { name: null, kind: 'NON_NULL' };
    if (mode === 'unresolved-aggregate' && name === 'Sum')
      return { name: null, kind: 'NON_NULL' };
    if (mode === 'unresolved-filter' && name === 'Filter')
      return { name: null, kind: 'NON_NULL' };
    const named = { name, kind: 'OBJECT' };
    return mode === 'wrapped'
      ? { name: null, kind: 'NON_NULL', ofType: {
          name: null, kind: 'LIST', ofType: {
            name: null, kind: 'NON_NULL', ofType: named,
          },
        } }
      : named;
  };
  const roots = [
    'workersInvocationsAdaptive',
    'd1AnalyticsAdaptiveGroups',
    'd1StorageAdaptiveGroups',
    'durableObjectsStorageGroups',
  ];
  const fields = roots.map((name, i) => ({
    name,
    type: ref(`Row${i}`),
    args: [{ name: 'filter', type: ref('Filter') }],
  }));
  const types = [
    { name: 'Account', fields },
    {
      name: 'Filter',
      inputFields: [{ name: 'datetime_geq' }, { name: 'datetime_leq' }],
    },
    ...roots.map((_, i) => ({
      name: `Row${i}`,
      fields: [
        { name: 'sum', type: ref('Sum') },
        { name: 'max', type: ref('Max') },
        { name: 'dimensions', type: ref('Dimensions') },
      ],
    })),
    { name: 'Sum', fields: [{ name: 'syntheticSum' }] },
    { name: 'Max', fields: [{ name: 'syntheticMax' }] },
    {
      name: 'Dimensions',
      fields: [{ name: 'databaseId' }, { name: 'namespaceId' }],
    }, // Matching settings names must not overwrite dataset row fields.
    {
      name: 'Settings',
      fields: roots.map((name) => ({ name, type: ref('Setting'), args: [] })),
    },
    { name: 'Setting', fields: [{ name: 'enabled' }] },
  ];
  const fetcher = async (url, options) => {
    calls.push({ url, method: options.method, body: options.body });
    assert.equal(options.redirect, 'error');
    let body;
    if (url.startsWith('https://api.github.com/')) {
      assert.equal(options.headers.Authorization, 'Bearer SYNTHETIC_GITHUB');
      assert.equal(options.method, 'GET');
      body = url.includes('deployment-branch-policies')
        ? {
            total_count: 1,
            branch_policies: [
              {
                name: mode === 'branch' ? 'other' : target.branch,
                type: 'branch',
              },
            ],
          }
        : {
            name: target.environment,
            protection_rules:
              mode === 'review'
                ? []
                : [
                    {
                      type: 'required_reviewers',
                      reviewers: [{ type: 'User', id: 1 }],
                    },
                  ],
            deployment_branch_policy: {
              custom_branch_policies: true,
              protected_branches: false,
            },
          };
    } else {
      assert.equal(
        options.headers.Authorization,
        'Bearer SYNTHETIC_CLOUDFLARE_READ_TOKEN',
      );
      if (mode === 'denied')
        return new Response('raw provider error with credentials', {
          status: 403,
        });
      const path = new URL(url).pathname;
      if (path.endsWith('/graphql')) {
        assert.equal(options.method, 'POST');
        const q = JSON.parse(options.body).query;
        assert.ok(q.startsWith('query CommunityReports'));
        assert.ok(!q.includes('mutation'));
        assert.ok(!q.includes('SYNTHETIC_CLOUDFLARE_READ_TOKEN'));
        if (mode === 'wrapped' && q.includes('__schema'))
          assert.ok(
            /ofType\s*\{\s*name kind ofType\s*\{\s*name kind ofType\s*\{/.test(q),
            'Schema query must reach a named type below three wrappers',
          );
        body = {
          errors: mode === 'partial' ? [{ message: 'raw-error' }] : [],
          data: q.includes('__schema')
            ? { __schema: { types } }
            : {
                viewer: {
                  accounts: [
                    {
                      settings: Object.fromEntries(
                        roots.map((k) => [
                          k,
                          {
                            enabled: mode !== 'disabled',
                            availableFields: ['syntheticSum'],
                          },
                        ]),
                      ),
                    },
                  ],
                },
              },
        };
      } else {
        assert.equal(options.method, 'GET');
        assert.ok(path.startsWith(`/client/v4/accounts/${target.account}/`));
        body = path.endsWith('/d1/database')
          ? {
              success: true,
              errors: [],
              result: [{ uuid: 'synthetic' }],
              result_info: { total_count: mode === 'pagination' ? 2 : 1 },
            }
          : path.endsWith('/workers/scripts')
            ? {
                success: true,
                errors: [],
                result: [{ id: 'synthetic-worker' }],
              }
            : path.endsWith('/schedules')
              ? { success: true, errors: [], result: { schedules: [] } }
              : path.endsWith('/workers/durable_objects/namespaces')
                ? {
                    success: true,
                    errors: [],
                    result: [{ id: 'synthetic' }],
                    result_info: { total_count: 1 },
                  }
                : null;
        assert.ok(body, 'No other Cloudflare endpoint permitted');
      }
    }
    return new Response(JSON.stringify(body), { status: 200 });
  };
  return { fetcher, calls };
}
await test('fixed manual context rejects PRs, reruns and other branches before requests', () => {
  for (const [k, v] of [
    ['GITHUB_REF', 'refs/heads/other'],
    ['GITHUB_EVENT_NAME', 'pull_request'],
    ['GITHUB_RUN_ATTEMPT', '2'],
    ['GITHUB_WORKFLOW', 'other'],
  ])
    assert.throws(
      () => context({ ...env(), [k]: v }),
      /MANUAL_FIXED_CONTEXT_REQUIRED/,
    );
});
await test('existing reviewer and exact branch protections are required, never created or bypassed', async () => {
  for (const mode of ['review', 'branch']) {
    const f = fixture(mode);
    await assert.rejects(gate(env(), f.fetcher));
    assert.ok(
      f.calls.every(
        (c) =>
          c.method === 'GET' && c.url.startsWith('https://api.github.com/'),
      ),
    );
  }
});
await test('protected execution is required before any Cloudflare request', async () => {
  const f = fixture();
  await assert.rejects(
    discover({ ...env(), REPORTS_PREFLIGHT_ENVIRONMENT: undefined }, f.fetcher),
    /PROTECTED_ENVIRONMENT_REQUIRED/,
  );
  assert.equal(
    f.calls.filter((c) => c.url.includes('api.cloudflare.com')).length,
    0,
  );
});
await test('discovery sends fixed metadata GETs and read-only GraphQL; receipts contain no credentials or account values', async () => {
  const f = fixture(),
    r = await discover(env(), f.fetcher);
  assert.equal(r.metadataReadable, true);
  assert.equal(r.accountAnalyticsReadable, true);
  assert.deepEqual(r.datasets.d1AnalyticsAdaptiveGroups.sum, ['syntheticSum']);
  assert.deepEqual(r.datasets.d1AnalyticsAdaptiveGroups.filter, [
    'datetime_geq',
    'datetime_leq',
  ]);
  assert.equal(r.usageValuesVerified, false);
  assert.equal(r.profileVerified, false);
  assert.equal(r.productionChanged, false);
  assert.equal(r.secretsExported, false);
  const raw = JSON.stringify(r);
  assert.ok(
    !raw.includes(env().CLOUDFLARE_API_TOKEN) && !raw.includes(target.account),
  );
  assert.equal(f.calls.filter((c) => c.method === 'POST').length, 2);
});
await test('denial, partial GraphQL and incomplete pagination never prove access', async () => {
  for (const mode of ['denied', 'partial', 'pagination']) {
    const f = fixture(mode);
    await assert.rejects(discover(env(), f.fetcher));
  }
});
await test('disabled datasets are explicit and do not become a verified usage profile', async () => {
  const f = fixture('disabled'),
    r = await discover(env(), f.fetcher);
  assert.ok(Object.values(r.enabled).every((x) => x === false));
  assert.equal(r.profileVerified, false);
});
await test('nested non-null/list dataset types retain actual aggregate and dimension field names', async () => {
  const f = fixture('wrapped');
  const r = await discover(env(), f.fetcher);
  assert.deepEqual(r.datasets.d1AnalyticsAdaptiveGroups.sum, ['syntheticSum']);
  assert.deepEqual(r.datasets.durableObjectsStorageGroups.max, ['syntheticMax']);
  assert.deepEqual(r.datasets.durableObjectsStorageGroups.dimensions, ['databaseId', 'namespaceId']);
  assert.equal(r.usageValuesVerified, false);
  assert.equal(r.profileVerified, false);
});
await test('unresolved schema types stop before account settings and never report successful empty discovery', async () => {
  for (const [mode, code] of [
    ['unresolved-row', 'ANALYTICS_ROW_TYPE_UNRESOLVED'],
    ['unresolved-aggregate', 'ANALYTICS_AGGREGATE_TYPE_UNRESOLVED'],
    ['unresolved-filter', 'ANALYTICS_FILTER_TYPE_UNRESOLVED'],
  ]) {
    const f = fixture(mode);
    await assert.rejects(discover(env(), f.fetcher), new RegExp(code));
    const graphql = f.calls.filter((c) => new URL(c.url).pathname.endsWith('/graphql'));
    assert.equal(graphql.length, 1);
    assert.ok(JSON.parse(graphql[0].body).query.includes('__schema'));
  }
});

await test('each failed metadata envelope reports only fixed stage, status, types, booleans and numeric codes', async () => {
  const cases = [
    ['/d1/database', 'D1_LIST'],
    ['/workers/scripts', 'WORKER_LIST'],
    ['/schedules', 'CRON_LIST'],
    ['/workers/durable_objects/namespaces', 'NAMESPACE_LIST'],
  ];
  const poison = 'SYNTHETIC_RESOURCE_SECRET_RAW_BODY';
  for (const [suffix, label] of cases) {
    const f = fixture();
    const fetcher = async (url, options) => {
      if (!new URL(url).pathname.endsWith(suffix)) return f.fetcher(url, options);
      f.calls.push({ url, method: options.method });
      return new Response(JSON.stringify({
        success: false,
        errors: [
          { code: 10000, message: poison, source: { pointer: poison } },
          { code: poison }, { code: '10001' }, { code: -1 },
          { code: 1000000 }, { code: 1.5 }, null,
          { code: 7003 }, { code: 9999 },
        ],
        result: [{ name: poison, token: env().CLOUDFLARE_API_TOKEN }],
        [poison]: env().GH_TOKEN,
      }), { status: 200, headers: { 'X-Unsafe': poison } });
    };
    let error;
    await assert.rejects(discover(env(), fetcher), (e) => { error = e; return true; });
    const lines = failureLines(error);
    assert.equal(lines[0], `BLOCKED: ${label}_METADATA_READ_FAILED`);
    assert.deepEqual(JSON.parse(lines[1].slice('DIAGNOSTIC: '.length)), {
      endpoint: label, httpStatus: 200, envelopeType: 'object',
      successType: 'boolean', success: false, errorsType: 'array',
      errorCodes: [10000, 7003], resultType: 'array',
    });
    for (const forbidden of [poison, env().GH_TOKEN, env().CLOUDFLARE_API_TOKEN,
      target.account, 'synthetic-worker', 'Authorization', 'X-Unsafe'])
      assert.ok(!lines.join('\n').includes(forbidden));
    assert.equal(f.calls.at(-1).url.endsWith(suffix) ||
      new URL(f.calls.at(-1).url).pathname.endsWith(suffix), true);
    assert.equal(f.calls.some(c => c.method === 'POST'), false);
  }
});

await test('non-object or missing REST envelopes stay blocked and expose no payload values', async () => {
  for (const body of [null, [], 'SYNTHETIC_RESOURCE', 123, true,
    { success: true, result: 'SYNTHETIC_RESOURCE' },
    { success: 'SYNTHETIC_RESOURCE', errors: [] }]) {
    const f = fixture();
    const fetcher = (url, options) => new URL(url).pathname.endsWith('/d1/database')
      ? Promise.resolve(new Response(JSON.stringify(body), { status: 200 }))
      : f.fetcher(url, options);
    await assert.rejects(discover(env(), fetcher), (error) => {
      const lines = failureLines(error);
      assert.equal(lines[0], 'BLOCKED: D1_LIST_METADATA_READ_FAILED');
      assert.ok(!lines.join('\n').includes('SYNTHETIC_RESOURCE'));
      assert.deepEqual(Object.keys(JSON.parse(lines[1].slice(12))), [
        'endpoint', 'httpStatus', 'envelopeType', 'successType', 'success',
        'errorsType', 'errorCodes', 'resultType',
      ]);
      return true;
    });
  }
});

await test('HTTP denial never reads body or headers and cannot continue past namespace refusal', async () => {
  const f = fixture();
  let bodyRead = false, headersRead = false;
  const fetcher = (url, options) => {
    if (!new URL(url).pathname.endsWith('/workers/durable_objects/namespaces'))
      return f.fetcher(url, options);
    f.calls.push({ url, method: options.method });
    return Promise.resolve({ ok: false, status: 403,
      get body() { bodyRead = true; throw Error('UNSAFE_BODY'); },
      get headers() { headersRead = true; throw Error('UNSAFE_HEADERS'); },
    });
  };
  await assert.rejects(discover(env(), fetcher), error => {
    assert.deepEqual(failureLines(error), [
      'BLOCKED: NAMESPACE_LIST_HTTP_403',
      'DIAGNOSTIC: {"endpoint":"NAMESPACE_LIST","httpStatus":403,"envelopeType":"unread"}',
    ]);
    return true;
  });
  assert.equal(bodyRead, false);
  assert.equal(headersRead, false);
  assert.equal(f.calls.some(c => c.method === 'POST'), false);
});

await test('untrusted exceptions and forged diagnostic fields never reach failure output', async () => {
  const poison = 'SYNTHETIC_RESOURCE_SECRET_RAW_BODY';
  assert.deepEqual(failureLines(Object.assign(Error(poison), {
    diagnostic: { endpoint: poison, token: env().CLOUDFLARE_API_TOKEN },
  })), ['BLOCKED: READ_FAILED']);
  const f = fixture();
  await assert.rejects(discover(env(), (url, options) => {
    if (url.startsWith('https://api.cloudflare.com/')) throw Error(poison);
    return f.fetcher(url, options);
  }), error => {
    assert.deepEqual(failureLines(error), ['BLOCKED: D1_LIST_REQUEST_FAILED']);
    return true;
  });
});

function namespaceFixture(body, status = 200) {
  const f = fixture();
  return {
    calls: f.calls,
    fetcher: (url, options) => {
      if (!new URL(url).pathname.endsWith('/workers/durable_objects/namespaces'))
        return f.fetcher(url, options);
      f.calls.push({ url, method: options.method });
      return Promise.resolve(new Response(JSON.stringify(body), { status }));
    },
  };
}
const namespaceSuccess = () => ({
  success: true,
  errors: null,
  result: [{ id: 'synthetic-namespace' }],
  result_info: { total_count: 1 },
});

await test('HTTP200 namespace errors:null accepts only complete successful lists without proving usage', async () => {
  for (const result of [[], [{ id: 'synthetic-namespace' }]]) {
    const f = namespaceFixture({
      ...namespaceSuccess(), result, result_info: { total_count: result.length },
    });
    const report = await discover(env(), f.fetcher);
    assert.equal(report.metadataReadable, true);
    assert.equal(report.usageValuesVerified, false);
    assert.equal(report.profileVerified, false);
    assert.equal(report.productionChanged, false);
    assert.equal(f.calls.filter(c => c.method === 'POST').length, 2);
  }
});

await test('namespace null-errors compatibility preserves status, success, error and completeness refusals', async () => {
  /** @type {Array<[Record<string, unknown>, number, string]>} */
  const cases = [
    [{ success: undefined }, 200, 'NAMESPACE_LIST_METADATA_READ_FAILED'],
    [{ success: false }, 200, 'NAMESPACE_LIST_METADATA_READ_FAILED'],
    [{ success: 'true' }, 200, 'NAMESPACE_LIST_METADATA_READ_FAILED'],
    [{ errors: undefined }, 200, 'NAMESPACE_LIST_METADATA_READ_FAILED'],
    [{ errors: [{ code: 10000 }] }, 200, 'NAMESPACE_LIST_METADATA_READ_FAILED'],
    [{ errors: {} }, 200, 'NAMESPACE_LIST_METADATA_READ_FAILED'],
    [{ errors: 'null' }, 200, 'NAMESPACE_LIST_METADATA_READ_FAILED'],
    [{ result: undefined }, 200, 'NAMESPACE_LIST_INCOMPLETE'],
    [{ result: null }, 200, 'NAMESPACE_LIST_INCOMPLETE'],
    [{ result: {} }, 200, 'NAMESPACE_LIST_INCOMPLETE'],
    [{ result: 'synthetic' }, 200, 'NAMESPACE_LIST_INCOMPLETE'],
    [{ result_info: undefined }, 200, 'NAMESPACE_LIST_INCOMPLETE'],
    [{ result_info: { total_count: 2 } }, 200, 'NAMESPACE_LIST_INCOMPLETE'],
    [{ result_info: { total_count: '1' } }, 200, 'NAMESPACE_LIST_INCOMPLETE'],
    [{}, 201, 'NAMESPACE_LIST_METADATA_READ_FAILED'],
    [{}, 403, 'NAMESPACE_LIST_HTTP_403'],
    [{}, 500, 'NAMESPACE_LIST_HTTP_500'],
  ];
  for (const [change, status, code] of cases) {
    const f = namespaceFixture({ ...namespaceSuccess(), ...change }, status);
    await assert.rejects(discover(env(), f.fetcher), error => {
      assert.equal(failureLines(error)[0], 'BLOCKED: ' + code);
      return true;
    });
    assert.equal(f.calls.some(c => c.method === 'POST'), false);
  }
});

await test('errors:null remains invalid for D1, Worker and cron metadata responses', async () => {
  for (const [suffix, label] of [
    ['/d1/database', 'D1_LIST'], ['/workers/scripts', 'WORKER_LIST'],
    ['/schedules', 'CRON_LIST'],
  ]) {
    const f = fixture();
    const fetcher = async (url, options) => {
      const response = await f.fetcher(url, options);
      if (!new URL(url).pathname.endsWith(suffix)) return response;
      return new Response(JSON.stringify({ ...(await response.json()), errors: null }),
        { status: 200 });
    };
    await assert.rejects(discover(env(), fetcher), error => {
      assert.equal(failureLines(error)[0], `BLOCKED: ${label}_METADATA_READ_FAILED`);
      return true;
    });
    assert.equal(f.calls.some(c => c.method === 'POST'), false);
  }
});
