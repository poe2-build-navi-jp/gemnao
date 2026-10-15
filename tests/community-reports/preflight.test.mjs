import test from 'node:test';
import assert from 'node:assert/strict';
import {
  context,
  gate,
  discover,
  target,
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
  const ref = (name) => ({ name, kind: 'OBJECT' });
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
