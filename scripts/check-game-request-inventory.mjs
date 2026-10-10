import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import {
  assertContext,
  gate,
  inventory,
  queries,
  summarize,
  target,
} from '../ops/game-request-inventory/control.mjs';
const env = {
  GITHUB_ACTIONS: 'true',
  GITHUB_REPOSITORY: target.repository,
  GITHUB_REF: `refs/heads/${target.branch}`,
  GITHUB_EVENT_NAME: 'workflow_dispatch',
  GITHUB_WORKFLOW: 'Gemnao game request metadata inventory',
  GITHUB_RUN_ATTEMPT: '1',
  INVENTORY_PROTECTED_ENVIRONMENT: target.environment,
  GH_TOKEN: 'synthetic-github',
  CLOUDFLARE_API_TOKEN: 'synthetic-cloudflare',
};
// SQLite in memory only. Never execute a remote D1 operation in these tests.
const sql = readFileSync(
  'migrations/game-requests/0001_game_requests.sql',
  'utf8',
);
const python = spawnSync(
  'python3',
  [
    '-c',
    `import sqlite3,json,sys
x=json.load(sys.stdin)
c=sqlite3.connect(':memory:');c.row_factory=sqlite3.Row
c.executescript(x['schema'])
c.execute('CREATE TABLE d1_migrations(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT UNIQUE,applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL)')
c.execute("INSERT INTO d1_migrations(name) VALUES ('0004_step_result_reports.sql')")
print(json.dumps({k:[dict(r) for r in c.execute(q).fetchall()] for k,q in x['queries'].items()}))`,
  ],
  { input: JSON.stringify({ schema: sql, queries }), encoding: 'utf8' },
);
assert.equal(python.status, 0, python.stderr);
const raw = JSON.parse(python.stdout);
const pages = {
  name: target.project,
  production_branch: target.branch,
  source: { config: { owner: 'poe2-build-navi-jp', repo_name: 'gemnao' } },
  deployment_configs: {
    production: { d1_databases: { DB: { id: target.database } } },
    preview: { d1_databases: {} },
  },
  canonical_deployment: {
    environment: 'production',
    latest_stage: { status: 'success' },
    deployment_trigger: {
      metadata: { branch: target.branch, commit_hash: 'a'.repeat(40) },
    },
  },
};
const protection = {
  name: target.environment,
  protection_rules: [{ type: 'required_reviewers', reviewers: [{}] }],
  deployment_branch_policy: {
    custom_branch_policies: true,
    protected_branches: false,
  },
};
const policies = {
  total_count: 1,
  branch_policies: [{ name: target.branch, type: 'branch' }],
};
function fixture(options = {}) {
  const calls = [];
  const fetcher = async (url, init) => {
    calls.push({ url, init });
    assert.equal(init.redirect, 'error');
    if (options.throw && !url.includes('api.github.com'))
      throw new Error('SECRET_DO_NOT_LOG');
    let result;
    if (url.includes('api.github.com'))
      return Response.json(
        url.includes('deployment-branch-policies')
          ? options.policies || policies
          : options.protection || protection,
      );
    if (url.endsWith(`/pages/projects/${target.project}`))
      result = options.pages || pages;
    else if (url.endsWith(`/d1/database/${target.database}`))
      result = options.database || {
        uuid: target.database,
        name: target.databaseName,
      };
    else {
      assert.equal(
        url,
        `https://api.cloudflare.com/client/v4/accounts/${target.account}/d1/database/${target.database}/query`,
      );
      assert.equal(init.method, 'POST');
      const { sql: statement } = JSON.parse(init.body);
      const key = Object.keys(queries).find((k) => queries[k] === statement);
      assert.ok(key, 'only fixed metadata queries allowed');
      result = [
        {
          success: true,
          meta: options.meta || { changed_db: false },
          results: (options.raw || raw)[key],
        },
      ];
    }
    return Response.json({ success: true, result });
  };
  return { calls, fetcher };
}
const f = fixture();
assert.equal(await gate(env, f.fetcher), target.environment);
const report = await inventory(env, f.fetcher);
assert.equal(report.mutationAllowed, false);
assert.equal(report.history.recordCount, 1);
for (const table of Object.values(report.tables)) {
  assert.equal(table.present, true);
  assert.equal(table.expectedColumnNamesInOrder, true);
  assert.equal(table.triggerCount, 0);
}
assert.equal(f.calls.length, 6 + Object.keys(queries).length);
for (const change of [
  { GITHUB_EVENT_NAME: 'push' },
  { GITHUB_REF: 'refs/heads/preview' },
  { GITHUB_RUN_ATTEMPT: '2' },
  { GITHUB_WORKFLOW: 'other' },
  { GITHUB_REPOSITORY: 'other/repo' },
  { INVENTORY_PROTECTED_ENVIRONMENT: '' },
]) {
  const local = fixture();
  await assert.rejects(inventory({ ...env, ...change }, local.fetcher));
  assert.equal(local.calls.length, 0);
}
for (const mode of ['apply', '', undefined])
  assert.throws(() => assertContext(env, mode));
for (const token of ['', undefined, 'bad\nsecret', 'non-ascii-秘密']) {
  const local = fixture();
  await assert.rejects(
    inventory({ ...env, CLOUDFLARE_API_TOKEN: token }, local.fetcher),
  );
  assert.equal(local.calls.length, 2);
}
for (const options of [
  { protection: { ...protection, protection_rules: [] } },
  { policies: { total_count: 0, branch_policies: [] } },
  { policies: { ...policies, total_count: 2 } },
])
  await assert.rejects(gate(env, fixture(options).fetcher));
for (const changedPages of [
  { ...pages, production_branch: 'other' },
  { ...pages, canonical_deployment: {} },
  {
    ...pages,
    deployment_configs: {
      ...pages.deployment_configs,
      preview: { d1_databases: { DB: { id: target.database } } },
    },
  },
]) {
  const local = fixture({ pages: changedPages });
  await assert.rejects(inventory(env, local.fetcher));
  assert.equal(local.calls.length, 3);
}
await assert.rejects(
  inventory(
    env,
    fixture({ database: { uuid: 'other', name: target.databaseName } }).fetcher,
  ),
);
for (const meta of [{}, { changed_db: true }])
  await assert.rejects(
    inventory(env, fixture({ meta }).fetcher),
    /READ_ONLY_RESPONSE_REQUIRED/,
  );
await assert.rejects(
  inventory(env, fixture({ throw: true }).fetcher),
  (error) =>
    error.code === 'CLOUDFLARE_REQUEST_FAILED' &&
    !String(error).includes('SECRET'),
);
const missing = { ...raw, registryColumns: [] };
const absent = fixture({ raw: missing });
assert.equal((await inventory(env, absent.fetcher)).history.readable, false);
assert.ok(
  !absent.calls.some(
    (c) => c.init.body && JSON.parse(c.init.body).sql === queries.history,
  ),
);
const tainted = structuredClone(raw);
tainted.objects.push({
  type: 'trigger',
  name: 'PRIVATE_SCHEMA_TEXT',
  tbl_name: 'game_requests',
  sql: 'PRIVATE_DDL_VALUE',
});
tainted.history[0].name = 'PRIVATE_MIGRATION_NAME';
tainted['game_requests:columns'][0].dflt_value = 'PRIVATE_DEFAULT';
assert.ok(
  !JSON.stringify(summarize(tainted, 'a'.repeat(40))).includes('PRIVATE_'),
);
assert.equal(
  summarize(tainted, 'a'.repeat(40)).tables.game_requests.triggerCount,
  1,
);
const workflow = readFileSync(
  '.github/workflows/game-request-inventory.yml',
  'utf8',
);
assert.ok(!/schedule:|pull_request:|workflow_run:|inputs:/.test(workflow));
assert.match(workflow, /workflow_dispatch:/);
assert.match(
  workflow,
  /environment: \$\{\{ needs.gate.outputs.environment \}\}/,
);
assert.ok(
  !/wrangler|pnpm install|GAME_REQUESTS_ENABLED|GAME_REQUEST_CONSUMER_READY|apply/i.test(
    workflow,
  ),
);
for (const statement of Object.values(queries)) {
  assert.ok(/^(SELECT|PRAGMA) /.test(statement));
  assert.ok(
    !/^(INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|REPLACE) /i.test(statement),
  );
}

const changedProtection = fixture({
  protection: { ...protection, protection_rules: [] },
});
await assert.rejects(
  inventory(env, changedProtection.fetcher),
  /EXISTING_REVIEWER_PROTECTION_REQUIRED/,
);
assert.ok(
  changedProtection.calls.every((c) =>
    c.url.startsWith('https://api.github.com/'),
  ),
);

const reverseKeys = (value) =>
  Array.isArray(value)
    ? value.map(reverseKeys)
    : value && typeof value === 'object'
      ? Object.fromEntries(
          Object.keys(value)
            .reverse()
            .map((key) => [key, reverseKeys(value[key])]),
        )
      : value;
assert.deepEqual(
  summarize(reverseKeys(raw), 'a'.repeat(40)),
  summarize(raw, 'a'.repeat(40)),
);
const indexDrift = structuredClone(raw);
indexDrift['game_requests_pending:indexColumns'][0].desc = 1;
const driftReport = summarize(indexDrift, 'a'.repeat(40));
assert.notEqual(
  driftReport.tables.game_requests.structureSHA256,
  report.tables.game_requests.structureSHA256,
);
assert.equal(
  driftReport.tables.game_request_attempts.structureSHA256,
  report.tables.game_request_attempts.structureSHA256,
);
assert.equal(
  driftReport.tables.game_request_daily_salts.structureSHA256,
  report.tables.game_request_daily_salts.structureSHA256,
);
const disguisedRegistry = fixture({
  raw: { ...raw, registryObject: [{ type: 'view', name: 'd1_migrations' }] },
});
assert.equal(
  (await inventory(env, disguisedRegistry.fetcher)).history.readable,
  false,
);
assert.ok(
  !disguisedRegistry.calls.some(
    (c) => c.init.body && JSON.parse(c.init.body).sql === queries.history,
  ),
);
console.log(
  'PASS: SQLite metadata, fixed read-only request allowlist, production identity, existing reviewer/branch gate, no reruns, missing registry, mutation-response denial, and sanitized reports. No remote calls.',
);
console.log(
  'Local staged-schema fingerprints (comparison only): ' +
    JSON.stringify(report.tables),
);
