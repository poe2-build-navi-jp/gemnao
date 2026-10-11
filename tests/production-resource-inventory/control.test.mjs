import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import {
  TARGET,
  assertContext,
  inventory,
  failureReport,
} from '../../ops/production-resource-inventory/control.mjs';

const env = {
  GITHUB_ACTIONS: 'true',
  GITHUB_REPOSITORY: TARGET.repository,
  GITHUB_REF: `refs/heads/${TARGET.branch}`,
  GITHUB_EVENT_NAME: 'workflow_dispatch',
  GITHUB_WORKFLOW: TARGET.workflow,
  GITHUB_RUN_ATTEMPT: '1',
  GITHUB_RUN_ID: '12345',
  GITHUB_SHA: 'a'.repeat(40),
  INVENTORY_PROTECTED_ENVIRONMENT: TARGET.environment,
  GH_TOKEN: 'SYNTHETIC_GITHUB',
  CLOUDFLARE_API_TOKEN: 'SYNTHETIC_CLOUDFLARE',
};
const id = (n) => `00000000-0000-0000-0000-${String(n).padStart(12, '0')}`;
const db = (n) => ({ uuid: id(n), name: `synthetic-${n}`, ignored: 'PRIVATE' });
const cfBase = `https://api.cloudflare.com/client/v4/accounts/${TARGET.account}`;
const ghBase = `https://api.github.com/repos/${TARGET.repository}/environments/${TARGET.environment}`;
function fixture(rows = [db(1)], transform = (value) => value) {
  const calls = [];
  const responses = new Map([
    [
      ghBase,
      {
        name: TARGET.environment,
        protection_rules: [
          { type: 'required_reviewers', reviewers: [{ id: 1 }] },
        ],
        deployment_branch_policy: {
          custom_branch_policies: true,
          protected_branches: false,
        },
      },
    ],
    [
      ghBase + '/deployment-branch-policies?per_page=100',
      {
        total_count: 1,
        branch_policies: [{ name: TARGET.branch, type: 'branch' }],
      },
    ],
    [
      cfBase,
      {
        success: true,
        errors: [],
        result: { id: TARGET.account, name: 'PRIVATE' },
      },
    ],
    [
      cfBase + '/pages/projects/gemnao',
      {
        success: true,
        errors: [],
        result: {
          name: TARGET.project,
          production_branch: TARGET.branch,
          source: {
            config: { owner: 'poe2-build-navi-jp', repo_name: 'gemnao' },
          },
          deployment_configs: {
            production: {
              env_vars: { TOKEN: { value: 'PRIVATE' } },
              d1_databases: {},
            },
          },
          canonical_deployment: {
            environment: 'production',
            id: id(999),
            deployment_trigger: { metadata: { commit_hash: 'b'.repeat(40) } },
          },
        },
      },
    ],
  ]);
  for (
    let page = 1;
    page <= Math.max(1, Math.ceil(rows.length / 100));
    page++
  ) {
    const result = rows.slice((page - 1) * 100, page * 100);
    responses.set(cfBase + `/d1/database?per_page=100&page=${page}`, {
      success: true,
      errors: [],
      result,
      result_info: {
        page,
        per_page: 100,
        count: result.length,
        total_count: rows.length,
      },
    });
  }
  const fetcher = async (url, init) => {
    calls.push(url);
    assert.equal(init.method, 'GET');
    assert.equal(init.redirect, 'error');
    assert.equal(init.body, undefined);
    assert.ok(responses.has(url), 'unapproved target');
    assert.equal(
      init.headers.Authorization,
      `Bearer ${url.startsWith('https://api.github.com/') ? env.GH_TOKEN : env.CLOUDFLARE_API_TOKEN}`,
    );
    const value = transform(structuredClone(responses.get(url)), url);
    return { ok: true, status: 200, json: async () => value };
  };
  return { calls, fetcher };
}

await test('fixed GETs yield only selected metadata and conditional Free capacity', async () => {
  const f = fixture([db(1), db(2), db(3)]);
  const result = await inventory(env, f.fetcher, () => 1791732000000);
  assert.equal(f.calls.length, 5);
  assert.equal(result.databaseCount, 3);
  assert.equal(result.slotsUnderFreePlanLimit, 7);
  assert.equal(result.creationPermissionVerified, false);
  assert.equal(result.accountPlanVerified, false);
  assert.equal(result.usageHeadroomVerified, false);
  assert.equal(result.mutationAllowed, false);
  assert.ok(!JSON.stringify(result).includes('PRIVATE'));
  assert.ok(!JSON.stringify(result).includes('SYNTHETIC_'));
  assert.deepEqual(result.databases[0], { id: id(1), name: 'synthetic-1' });
});

await test('complete pagination is counted and proposed name collisions are reported', async () => {
  const rows = Array.from({ length: 101 }, (_, n) => db(n + 1));
  rows[100].name = 'gemnao-diagnosis-production';
  const f = fixture(rows);
  const result = await inventory(env, f.fetcher);
  assert.equal(result.databaseCount, 101);
  assert.equal(result.slotsUnderFreePlanLimit, 0);
  assert.equal(result.proposedNames[0].exists, true);
  assert.equal(f.calls.length, 6);
});

await test('wrong source context and reruns stop before network', async () => {
  for (const override of [
    { GITHUB_REF: 'refs/heads/feature' },
    { GITHUB_EVENT_NAME: 'push' },
    { GITHUB_RUN_ATTEMPT: '2' },
    { GITHUB_REPOSITORY: 'other/repo' },
    { GITHUB_SHA: '' },
    { GITHUB_WORKFLOW: 'Other' },
  ]) {
    const f = fixture();
    await assert.rejects(
      inventory({ ...env, ...override }, f.fetcher),
      /MANUAL_FIRST_RUN_CONTEXT_REQUIRED/,
    );
    assert.equal(f.calls.length, 0);
  }
  assert.doesNotThrow(() => assertContext(env));
});

await test('missing Environment marker, credential or protection cannot reach Cloudflare', async () => {
  for (const override of [
    { INVENTORY_PROTECTED_ENVIRONMENT: '' },
    { GH_TOKEN: '' },
    { CLOUDFLARE_API_TOKEN: '' },
  ]) {
    const f = fixture();
    await assert.rejects(inventory({ ...env, ...override }, f.fetcher));
    assert.ok(
      f.calls.every((url) => url.startsWith('https://api.github.com/')),
    );
  }
  for (const mutate of [
    (value) => {
      value.protection_rules = [];
    },
    (value) => {
      value.deployment_branch_policy.custom_branch_policies = false;
    },
  ]) {
    const f = fixture([db(1)], (value, url) => {
      if (url === ghBase) mutate(value);
      return value;
    });
    await assert.rejects(inventory(env, f.fetcher));
    assert.ok(
      f.calls.every((url) => url.startsWith('https://api.github.com/')),
    );
  }
});

await test('expanded Environment branch policy is refused', async () => {
  const f = fixture([db(1)], (value, url) => {
    if (url.startsWith(ghBase + '/')) {
      value.total_count = 2;
      value.branch_policies.push({ name: '*', type: 'branch' });
    }
    return value;
  });
  await assert.rejects(
    inventory(env, f.fetcher),
    /EXISTING_BRANCH_POLICY_REQUIRED/,
  );
  assert.equal(f.calls.length, 2);
});

await test('account and Pages identity mismatch stop before database listing', async () => {
  for (const field of [
    'account',
    'project',
    'branch',
    'repository',
    'deployment',
  ]) {
    const f = fixture([db(1)], (value, url) => {
      if (field === 'account' && url === cfBase) value.result.id = 'wrong';
      if (url.endsWith('/pages/projects/gemnao')) {
        if (field === 'project') value.result.name = 'other';
        if (field === 'branch') value.result.production_branch = 'other';
        if (field === 'repository')
          value.result.source.config.repo_name = 'other';
        if (field === 'deployment')
          value.result.canonical_deployment.environment = 'preview';
      }
      return value;
    });
    await assert.rejects(inventory(env, f.fetcher));
    assert.ok(f.calls.every((url) => !url.includes('/d1/database')));
  }
});

await test('missing pagination, duplicate IDs, partial pages and inconsistent totals fail closed', async () => {
  for (const mutation of [
    (value) => {
      delete value.result_info;
    },
    (value) => {
      value.result_info.total_count = 3;
    },
    (value) => {
      value.result[1].uuid = value.result[0].uuid;
    },
    (value) => {
      value.result_info.page = 2;
    },
    (value) => {
      value.result_info.total_count = 1001;
    },
  ]) {
    const f = fixture([db(1), db(2)], (value, url) => {
      if (url.includes('/d1/database')) mutation(value);
      return value;
    });
    await assert.rejects(inventory(env, f.fetcher));
  }
  const f = fixture(
    Array.from({ length: 101 }, (_, n) => db(n + 1)),
    (value, url) => {
      if (url.endsWith('page=2')) value.result_info.total_count = 102;
      return value;
    },
  );
  await assert.rejects(inventory(env, f.fetcher), /DATABASE_INVENTORY_CHANGED/);
});

await test('provider failure, denial and JSON errors are not retried or printed', async () => {
  for (const response of [
    () => {
      throw new Error('PRIVATE provider error');
    },
    () => ({ ok: false, status: 403 }),
    () => ({
      ok: true,
      status: 200,
      json: () => {
        throw new Error('PRIVATE');
      },
    }),
    () => ({
      ok: true,
      status: 200,
      json: () => ({ success: false, errors: [{ message: 'PRIVATE' }] }),
    }),
  ]) {
    const f = fixture();
    let cfCalls = 0;
    await assert.rejects(
      inventory(env, (url, init) => {
        if (url.startsWith(cfBase)) {
          cfCalls++;
          return response();
        }
        return f.fetcher(url, init);
      }),
      (error) => {
        assert.ok(!JSON.stringify(failureReport(error)).includes('PRIVATE'));
        return true;
      },
    );
    assert.equal(cfCalls, 1);
  }
  assert.deepEqual(failureReport(new Error('PRIVATE')), {
    status: 'blocked',
    code: 'INVENTORY_FAILED',
  });
});

await test('observation timeout blocks a successful-looking result', async () => {
  const f = fixture();
  let calls = 0;
  await assert.rejects(
    inventory(env, f.fetcher, () => 1791732000000 + calls++ * 300001),
    /OBSERVATION_NOT_CURRENT/,
  );
});

await test('workflow has only manual trigger, existing protected Environment and no deployment steps', () => {
  const source = readFileSync(
    '.github/workflows/production-resource-inventory.yml',
    'utf8',
  );
  assert.match(source, /on:\n  workflow_dispatch:\npermissions:/);
  assert.match(
    source,
    /environment: \$\{\{ needs.gate.outputs.environment \}\}/,
  );
  assert.match(source, /secrets.CLOUDFLARE_API_TOKEN/);
  assert.match(source, /cancel-in-progress: false/);
  assert.doesNotMatch(
    source,
    /pull_request:|push:|schedule:|wrangler|pnpm|npm|curl|write-all|: write/,
  );
  assert.ok(
    source.indexOf('CLOUDFLARE_API_TOKEN') > source.indexOf('  inventory:'),
  );
});
