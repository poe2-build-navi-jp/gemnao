import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFile, writeFile, mkdir, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  client,
  context,
  gate,
  inspect,
  setup,
  deployClosed,
  prepareManagedUpload,
  safeFailure,
  verifyArtifact,
  TARGET,
  FLAGS,
  PARTIAL_SETUP,
  readbackPartial,
  SetupFailure,
  main,
} from '../../ops/community-reports/closed-setup.mjs';
import {
  configProjection,
  persistedConfig,
  validateRecord,
  managedBaseline,
  productionAnchor,
  verifyManagedDeployment,
} from '../../ops/community-reports/managed-config.mjs';
const baseline = JSON.parse(
  execFileSync('git', ['show', TARGET.base + ':wrangler.json'], {
    encoding: 'utf8',
  }),
);
const schema = await readFile('migrations/community-reports/0001.sql', 'utf8');
const id = '11111111-1111-4111-8111-111111111111';
const oldDeployment = '22222222-2222-4222-8222-222222222222';
const newDeployment = '33333333-3333-4333-8333-333333333333';
const env = {
  GITHUB_ACTIONS: 'true',
  GITHUB_REPOSITORY: TARGET.repository,
  GITHUB_REF: 'refs/heads/gemunao',
  GITHUB_WORKFLOW: TARGET.workflow,
  GITHUB_EVENT_NAME: 'workflow_dispatch',
  GITHUB_RUN_ATTEMPT: '1',
  GITHUB_SHA: 'a'.repeat(40),
  GITHUB_RUN_ID: '123',
  GH_TOKEN: 'synthetic',
};
const envelope = (result) => ({ success: true, errors: [], result });
const hash = (value) => createHash('sha256').update(value).digest('hex');
const receipt = () => ({
  sourceSha: env.GITHUB_SHA,
  runId: env.GITHUB_RUN_ID,
  completed: [],
});
function production(config) {
  const projected = configProjection(config),
    { vars, ...bindings } = projected;
  return {
    ...bindings,
    wrangler_config_hash: 'synthetic-managed-hash',
    env_vars: {
      ...Object.fromEntries(
        Object.entries(vars).map(([name, value]) => [
          name,
          { type: 'plain_text', value },
        ]),
      ),
      EXISTING_SECRET: { type: 'secret_text', value: 'SYNTHETIC_MUST_NOT_LOG' },
    },
  };
}
function fixture(options = {}) {
  const project = {
    name: TARGET.pages,
    production_branch: TARGET.branch,
    canonical_deployment: { id: oldDeployment },
    build_config: {
      destination_dir: 'dist/client',
      build_command: 'pnpm build',
    },
    deployment_configs: {
      production: production(baseline),
      preview: {
        d1_databases: {},
        env_vars: { PREVIEW_ONLY: { type: 'plain_text', value: 'keep' } },
      },
    },
  };
  const calls = [],
    checkpoints = [],
    uploads = new Map();
  let pagesReads = 0;
  const original = structuredClone(project);
  const api = async (method, path, body, label) => {
    calls.push({ method, path, body, label });
    if (options.failLabel === label) {
      if (options.failStatus)
        throw new SetupFailure(label + '_HTTP', options.failStatus);
      throw Error('SYNTHETIC_MUST_NOT_LOG');
    }
    if (path.startsWith('/d1/database?'))
      return {
        ...envelope(
          baseline.d1_databases.map((db) => ({
            uuid: db.database_id,
            name: db.database_name,
          })),
        ),
        result_info: {
          total_count: options.incomplete ? 99 : baseline.d1_databases.length,
        },
      };
    if (path === '/workers/scripts')
      return envelope(options.workerExists ? [{ id: TARGET.guard }] : []);
    if (path === '/pages/projects/gemnao') {
      pagesReads++;
      if (options.liveFlag)
        project.deployment_configs.production.env_vars.REPORTS_ENABLED = {
          type: 'plain_text',
          value: 'true',
        };
      if (options.wrongBinding)
        project.deployment_configs.production.d1_databases.DB.id = id;
      if (options.unmanaged)
        delete project.deployment_configs.production.wrangler_config_hash;
      if (options.extraVar)
        project.deployment_configs.production.env_vars.UNREPRESENTED = {
          type: 'plain_text',
          value: 'unknown',
        };
      if (options.noAnchor) delete project.canonical_deployment;
      if (options.race && pagesReads === 2)
        project.deployment_configs.preview.env_vars.EXTRA = {
          type: 'plain_text',
          value: 'changed',
        };
      return envelope(structuredClone(project));
    }
    if (path.startsWith('/pages/projects/gemnao/deployments/'))
      return envelope({
        id: path.split('/').at(-1),
        environment: options.previewAnchor ? 'preview' : 'production',
        latest_stage: {
          name: 'deploy',
          status: options.failedAnchor ? 'failure' : 'success',
        },
        deployment_trigger: {
          metadata: {
            commit_hash: path.endsWith(oldDeployment)
              ? 'b'.repeat(40)
              : env.GITHUB_SHA,
          },
        },
      });
    if (method === 'POST' && path === '/d1/database')
      return envelope({
        uuid: options.reusedId ? baseline.d1_databases[0].database_id : id,
        name: TARGET.database,
      });
    if (method === 'GET' && path === '/d1/database/' + id)
      return envelope({
        uuid: id,
        name: options.wrongDedicatedName ? 'other' : TARGET.database,
      });
    if (method === 'POST' && path === '/d1/database/' + id + '/query') {
      assert.deepEqual(body.params, []);
      if (label === 'D1_EMPTY')
        return envelope([
          {
            success: true,
            results: options.notEmpty ? [{ name: 'unexpected' }] : [],
          },
        ]);
      if (label === 'D1_SCHEMA') {
        assert.equal(body.sql, schema);
        return envelope([{ success: true, results: [] }]);
      }
      if (label === 'D1_TOTAL')
        return envelope([{ success: true, results: [{ value: '0' }] }]);
    }
    const match = path.match(
      /^\/workers\/scripts\/(gemnao-community-reports-(guard|cleanup))(?:\/(subdomain|settings|schedules))?$/,
    );
    if (match) {
      const name = match[1],
        tail = match[3];
      if (method === 'PUT' && !tail) {
        uploads.set(name, JSON.parse(await body.get('metadata').text()));
        return envelope({ id: name });
      }
      if (method === 'POST' && tail === 'subdomain') {
        assert.deepEqual(body, { enabled: false, previews_enabled: false });
        return envelope(body);
      }
      if (method === 'GET' && tail === 'subdomain')
        return envelope({ enabled: false, previews_enabled: false });
      if (method === 'GET' && tail === 'schedules')
        return envelope({
          schedules: options.cron ? [{ cron: '* * * * *' }] : [],
        });
      if (method === 'GET' && tail === 'settings')
        return envelope({
          bindings: (uploads.get(name)?.bindings || []).map((binding) =>
            binding.type === 'durable_object_namespace'
              ? {
                  ...binding,
                  namespace_id: options.wrongNamespace
                    ? 'e'.repeat(32)
                    : 'f'.repeat(32),
                }
              : binding,
          ),
        });
    }
    throw Error('Unexpected request');
  };
  const persist = async (current) => {
    checkpoints.push(structuredClone(current));
  };
  const uploader = async (desired) => {
    project.deployment_configs.production = production(desired);
    project.canonical_deployment = { id: newDeployment };
    if (options.changePreview) project.deployment_configs.preview = {};
    if (options.removeSecret)
      delete project.deployment_configs.production.env_vars.EXISTING_SECRET;
    if (options.changeBuild) project.build_config.destination_dir = 'pages';
  };
  return {
    project,
    original,
    api,
    calls,
    uploads,
    checkpoints,
    persist,
    uploader,
  };
}
async function withArtifacts(callback) {
  const directory = await mkdtemp(join(tmpdir(), 'closed-managed-'));
  try {
    await mkdir(join(directory, 'workers'));
    await mkdir(join(directory, 'pages'));
    await writeFile(join(directory, 'schema.sql'), schema);
    for (const name of ['guard', 'cleanup'])
      await writeFile(
        join(directory, 'workers', name + '.mjs'),
        'export default {}',
      );
    await writeFile(join(directory, 'pages/_worker.js'), 'export default {}');
    await callback(directory);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}
async function provision(f, directory) {
  const result = receipt();
  await setup(f.api, baseline, directory, result, () => f.persist(result));
  return result;
}
await test('fixed context rejects reruns and other workflow, branch, event or repository', () => {
  context(env);
  for (const patch of [
    { GITHUB_RUN_ATTEMPT: '2' },
    { GITHUB_REF: 'refs/heads/main' },
    { GITHUB_EVENT_NAME: 'push' },
    { GITHUB_WORKFLOW: 'Community reports analytics preflight' },
    { GITHUB_REPOSITORY: 'other/repo' },
  ])
    assert.throws(() => context({ ...env, ...patch }));
});
await test('existing reviewer and exact branch protection remain mandatory and GET-only', async () => {
  const calls = [];
  const fetcher = async (url, options) => {
    calls.push(options);
    return Response.json(
      url.includes('branch-policies')
        ? {
            total_count: 1,
            branch_policies: [{ name: 'gemunao', type: 'branch' }],
          }
        : {
            name: TARGET.environment,
            protection_rules: [{ type: 'required_reviewers', reviewers: [{}] }],
            deployment_branch_policy: {
              custom_branch_policies: true,
              protected_branches: false,
            },
          },
    );
  };
  assert.equal(await gate(env, fetcher), TARGET.environment);
  assert.ok(calls.every((call) => call.method === 'GET'));
  await assert.rejects(
    gate(env, async () => Response.json({})),
    /EXISTING_REVIEWER_REQUIRED/,
  );
});
await test('provider boundary rejects direct Pages PATCH, restore, existing DB SQL and credentials endpoints', async () => {
  let count = 0;
  const api = client('s'.repeat(30), async () => {
    count++;
    return Response.json(envelope({ uuid: id, name: TARGET.database }));
  });
  for (const [method, path, body] of [
    ['PATCH', '/pages/projects/gemnao', {}],
    ['GET', '/tokens', undefined],
    [
      'POST',
      '/d1/database/' + id + '/query',
      { sql: 'DELETE FROM x', params: [] },
    ],
    ['POST', '/d1/database/' + id + '/time_travel/restore', {}],
    [
      'POST',
      '/workers/scripts/' + TARGET.guard + '/subdomain',
      { enabled: true, previews_enabled: false },
    ],
    ['POST', '/d1/database', { name: 'other' }],
  ])
    await assert.rejects(api(method, path, body, 'FIXED'));
  assert.equal(count, 0);
  await api('POST', '/d1/database', { name: TARGET.database }, 'CREATE');
  await assert.rejects(
    api(
      'POST',
      '/d1/database/' + id + '/query',
      { sql: 'DELETE FROM x', params: [] },
      'QUERY',
    ),
  );
  assert.equal(count, 1);
});
await test('HTTP denial, partial errors and exceptions are bounded and never expose raw secrets or retry', async () => {
  for (const fetcher of [
    async () => new Response('SYNTHETIC_MUST_NOT_LOG', { status: 403 }),
    async () =>
      Response.json({
        success: true,
        errors: [{ message: 'SYNTHETIC_MUST_NOT_LOG' }],
      }),
    async () => {
      throw Error('SYNTHETIC_MUST_NOT_LOG');
    },
  ]) {
    let count = 0;
    const api = client('s'.repeat(30), async (...args) => {
      count++;
      return fetcher(...args);
    });
    try {
      await api('GET', '/workers/scripts', undefined, 'WORKER_LIST');
      assert.fail();
    } catch (error) {
      assert.ok(!JSON.stringify(safeFailure(error)).includes('SYNTHETIC'));
    }
    assert.equal(count, 1);
  }
});
await test('artifact source, file set, digest and every compiled byte remain pinned', async () => {
  await withArtifacts(async (directory) => {
    await writeFile(join(directory, 'pages/_worker.bundle.js'), 'bundle');
    const entries = [
      'schema.sql',
      'workers/guard.mjs',
      'workers/cleanup.mjs',
      'pages/_worker.js',
      'pages/_worker.bundle.js',
    ];
    const hashes = {};
    for (const path of entries)
      hashes[path] = hash(await readFile(join(directory, path)));
    const text = JSON.stringify({
      sourceSha: env.GITHUB_SHA,
      base: TARGET.base,
      hashes,
    });
    await writeFile(join(directory, 'manifest.json'), text);
    await verifyArtifact(directory, hash(text), env.GITHUB_SHA);
    await assert.rejects(
      verifyArtifact(directory, '0'.repeat(64), env.GITHUB_SHA),
      /DIGEST/,
    );
    await assert.rejects(
      verifyArtifact(directory, hash(text), 'd'.repeat(40)),
      /SOURCE/,
    );
    await writeFile(join(directory, 'pages/_worker.bundle.js'), 'changed');
    await assert.rejects(
      verifyArtifact(directory, hash(text), env.GITHUB_SHA),
      /BYTES/,
    );
    await writeFile(join(directory, 'extra'), 'extra');
    await assert.rejects(
      verifyArtifact(directory, hash(text), env.GITHUB_SHA),
      /FILE_SET/,
    );
  });
});
await test('managed inspect verifies a successful production anchor without secret values or writes', async () => {
  const f = fixture(),
    result = await inspect(f.api, baseline);
  assert.ok(f.calls.every((call) => call.method === 'GET'));
  assert.equal(result.recovery.deploymentId, oldDeployment);
  assert.equal(result.receipt.managedConfigurationAligned, true);
  assert.equal(result.receipt.writePermissionsVerified, false);
  assert.ok(!JSON.stringify(result.receipt).includes('SYNTHETIC'));
  assert.equal(result.recovery.sourceSha, 'b'.repeat(40));
});
await test('unmanaged or mismatched config, missing/failed/preview anchor and incomplete inventory stop before all writes', async () => {
  for (const options of [
    { unmanaged: true },
    { extraVar: true },
    { noAnchor: true },
    { failedAnchor: true },
    { previewAnchor: true },
    { incomplete: true },
    { workerExists: true },
    { liveFlag: true },
    { wrongBinding: true },
  ]) {
    const f = fixture(options);
    await assert.rejects(inspect(f.api, baseline));
    assert.ok(f.calls.every((call) => call.method === 'GET'));
  }
});
await test('setup checkpoints recovery before creating dedicated resources and never mutates Pages', async () => {
  await withArtifacts(async (directory) => {
    const f = fixture(),
      result = await provision(f, directory);
    assert.equal(f.checkpoints[0].recovery.deploymentId, oldDeployment);
    assert.deepEqual(f.checkpoints[0].completed, []);
    assert.equal(result.resourceRecord.databaseId, id);
    assert.equal(result.resourceRecord.guardNamespaceId, 'f'.repeat(32));
    assert.equal(result.pagesChanged, false);
    assert.deepEqual(f.project, f.original);
    assert.ok(
      !f.calls.some(
        (call) => call.method !== 'GET' && call.path.startsWith('/pages/'),
      ),
    );
    const metadata = f.uploads.get(TARGET.cleanup);
    assert.ok(
      FLAGS.every((flag) =>
        metadata.bindings.some(
          (binding) => binding.name === flag && binding.text === 'false',
        ),
      ),
    );
    assert.ok(!JSON.stringify(result).includes('SYNTHETIC'));
    validateRecord(result.resourceRecord, TARGET);
  });
});
await test('reused DB identity or nonempty database stops before schema; failures retain recovery and no Pages writes', async () => {
  await withArtifacts(async (directory) => {
    for (const options of [
      { reusedId: true },
      { notEmpty: true },
      { failLabel: 'GUARD_UPLOAD' },
      { cron: true },
      { race: true },
    ]) {
      const f = fixture(options),
        result = receipt();
      await assert.rejects(
        setup(f.api, baseline, directory, result, () => f.persist(result)),
      );
      assert.equal(result.recovery.deploymentId, oldDeployment);
      assert.ok(!f.calls.some((call) => call.method === 'PATCH'));
      if (options.reusedId || options.notEmpty)
        assert.ok(!f.calls.some((call) => call.label === 'D1_SCHEMA'));
    }
  });
});
await test('persisted Wrangler additions retain the same bindings on subsequent normal builds', async () => {
  await withArtifacts(async (directory) => {
    const f = fixture(),
      result = await provision(f, directory),
      desired = persistedConfig(baseline, result.resourceRecord, TARGET, FLAGS);
    assert.deepEqual(desired.d1_databases.slice(0, -1), baseline.d1_databases);
    assert.deepEqual(desired.env, baseline.env);
    for (const [key, value] of Object.entries(baseline.vars))
      assert.equal(desired.vars[key], value);
    assert.ok(FLAGS.every((flag) => desired.vars[flag] === 'false'));
    assert.deepEqual(JSON.parse(JSON.stringify(desired)), desired);
    assert.equal(desired.d1_databases.at(-1).database_id, id);
    assert.equal(desired.services.at(-1).entrypoint, 'ReportsGuardService');
    assert.ok(!JSON.stringify(desired).includes('SYNTHETIC'));
    assert.throws(() =>
      validateRecord({ ...result.resourceRecord, token: 'forbidden' }, TARGET),
    );
  });
});
await test('deploy requires persisted configuration and exact recorded D1, guard and production anchor', async () => {
  await withArtifacts(async (directory) => {
    for (const change of ['config', 'database', 'guard', 'anchor']) {
      const f = fixture(),
        result = await provision(f, directory),
        record = result.resourceRecord;
      const desired = persistedConfig(baseline, record, TARGET, FLAGS);
      f.calls.length = 0;
      if (change === 'config') desired.vars.REPORTS_ENABLED = 'true';
      if (change === 'database')
        record.databaseId = baseline.d1_databases[0].database_id;
      if (change === 'guard') record.guardNamespaceId = 'e'.repeat(32);
      if (change === 'anchor') record.recovery.deploymentId = newDeployment;
      let uploads = 0;
      await assert.rejects(
        deployClosed(f.api, baseline, record, desired, receipt(), async () => {
          uploads++;
        }),
      );
      assert.equal(uploads, 0);
      assert.ok(f.calls.every((call) => call.method === 'GET'));
    }
  });
});
await test('managed deploy supplies explicit persisted Wrangler config and checks production, preview, secrets and build settings', async () => {
  await withArtifacts(async (directory) => {
    const f = fixture(),
      result = await provision(f, directory),
      desired = persistedConfig(baseline, result.resourceRecord, TARGET, FLAGS);
    f.calls.length = 0;
    const deployment = receipt();
    let uploads = 0;
    await deployClosed(
      f.api,
      baseline,
      result.resourceRecord,
      desired,
      deployment,
      async (config) => {
        uploads++;
        assert.deepEqual(config, desired);
        await f.uploader(config);
      },
      () => f.persist(deployment),
    );
    assert.equal(uploads, 1);
    assert.ok(f.calls.every((call) => call.method === 'GET'));
    assert.equal(deployment.deployment.sourceSha, env.GITHUB_SHA);
    assert.equal(deployment.settingsVerified, true);
    assert.deepEqual(
      f.project.deployment_configs.preview,
      f.original.deployment_configs.preview,
    );
    assert.deepEqual(f.project.build_config, f.original.build_config);
    assert.equal(
      f.project.deployment_configs.production.env_vars.EXISTING_SECRET.value,
      'SYNTHETIC_MUST_NOT_LOG',
    );
    assert.ok(!JSON.stringify(deployment).includes('SYNTHETIC'));
  });
});
await test('post-upload preview, secret or output directory changes fail readback without rollback or retry', async () => {
  await withArtifacts(async (directory) => {
    for (const options of [
      { changePreview: true },
      { removeSecret: true },
      { changeBuild: true },
    ]) {
      const f = fixture(options),
        result = await provision(f, directory),
        desired = persistedConfig(
          baseline,
          result.resourceRecord,
          TARGET,
          FLAGS,
        );
      let uploads = 0;
      await assert.rejects(
        deployClosed(
          f.api,
          baseline,
          result.resourceRecord,
          desired,
          receipt(),
          async (config) => {
            uploads++;
            await f.uploader(config);
          },
        ),
      );
      assert.equal(uploads, 1);
      assert.ok(!f.calls.some((call) => /rollback|restore/.test(call.path)));
    }
  });
});
await test('isolated upload writes an explicit Wrangler file and retains original dist/client path', async () => {
  await withArtifacts(async (directory) => {
    const f = fixture(),
      result = await provision(f, directory),
      desired = persistedConfig(baseline, result.resourceRecord, TARGET, FLAGS);
    const upload = join(directory, 'upload');
    await prepareManagedUpload(upload, directory, desired);
    assert.deepEqual(
      JSON.parse(await readFile(join(upload, 'wrangler.json'), 'utf8')),
      desired,
    );
    assert.equal(
      await readFile(join(upload, 'dist/client/_worker.js'), 'utf8'),
      'export default {}',
    );
    assert.ok(!JSON.stringify(desired).includes('SYNTHETIC'));
    assert.equal(desired.pages_build_output_dir, './dist/client');
  });
});
await test('managed projection rejects unrepresented bindings and failed recovery anchor', () => {
  const f = fixture();
  f.project.deployment_configs.production.ai_bindings = { AI: {} };
  assert.throws(() => managedBaseline(f.project, baseline), /UNREPRESENTED/);
  assert.throws(
    () =>
      productionAnchor(f.project, {
        id: oldDeployment,
        environment: 'preview',
      }),
    /ANCHOR/,
  );
  const next = structuredClone(f.original);
  next.deployment_configs.production.env_vars.EXISTING_SECRET.value = 'changed';
  assert.throws(
    () => verifyManagedDeployment(f.original, next, baseline, TARGET),
    /SECRET_DESCRIPTOR/,
  );
});

await test('Cloudflare subdomain contract uses POST; PUT and every enable/extra-field payload stop before fetch', async () => {
  const calls = [];
  const api = client('s'.repeat(30), async (url, options) => {
    calls.push({ url, ...options });
    assert.equal(options.method, 'POST');
    assert.deepEqual(JSON.parse(options.body), {
      enabled: false,
      previews_enabled: false,
    });
    return Response.json(envelope({ enabled: false, previews_enabled: false }));
  });
  for (const name of [TARGET.guard, TARGET.cleanup]) {
    const path = '/workers/scripts/' + name + '/subdomain';
    for (const body of [
      { enabled: true, previews_enabled: false },
      { enabled: false, previews_enabled: true },
      { enabled: false },
      { enabled: false, previews_enabled: false, extra: true },
    ])
      await assert.rejects(
        api('POST', path, body, 'URLS'),
        /PUBLIC_URL_ENABLE_FORBIDDEN/,
      );
    await assert.rejects(
      api('PUT', path, { enabled: false, previews_enabled: false }, 'URLS'),
      /REQUEST_OUTSIDE_FIXED_BOUNDARY/,
    );
    await api(
      'POST',
      path,
      { enabled: false, previews_enabled: false },
      'URLS',
    );
  }
  assert.equal(calls.length, 2);
});

await test('405 after guard upload preserves exact partial receipt without cleanup, cron reads or retry', async () => {
  await withArtifacts(async (directory) => {
    const f = fixture({ failLabel: 'PUBLIC_URL_DISABLE', failStatus: 405 });
    const partial = receipt();
    await assert.rejects(
      setup(f.api, baseline, directory, partial, () => f.persist(partial)),
      /PUBLIC_URL_DISABLE_HTTP/,
    );
    assert.deepEqual(partial.completed, [
      'dedicated-d1-created',
      'dedicated-schema-applied',
      'guard-uploaded',
    ]);
    assert.equal(partial.databaseId, id);
    assert.equal(partial.guardNamespaceId, undefined);
    assert.equal(partial.resourceRecord, undefined);
    assert.equal(f.calls.at(-1).method, 'POST');
    assert.equal(
      f.calls.filter((call) => call.label === 'PUBLIC_URL_DISABLE').length,
      1,
    );
    assert.ok(
      !f.calls.some(
        (call) =>
          call.path.includes(TARGET.cleanup) ||
          call.path.endsWith('/schedules'),
      ),
    );
    assert.deepEqual(f.project, f.original);
  });
});

await test('old setup refuses partial resources before any creation or schema request', async () => {
  await withArtifacts(async (directory) => {
    for (const resource of ['database', 'guard']) {
      const f = fixture({ workerExists: resource === 'guard' });
      const calls = [],
        partial = receipt();
      const api = async (method, path, body, label) => {
        calls.push({ method, path });
        if (resource === 'database' && path.startsWith('/d1/database?')) {
          const existing = baseline.d1_databases.map((db) => ({
            uuid: db.database_id,
            name: db.database_name,
          }));
          existing.push({
            uuid: PARTIAL_SETUP.databaseId,
            name: TARGET.database,
          });
          return {
            ...envelope(existing),
            result_info: { total_count: existing.length },
          };
        }
        return f.api(method, path, body, label);
      };
      await assert.rejects(
        setup(api, baseline, directory, partial),
        resource === 'database'
          ? /DATABASE_NAME_ALREADY_EXISTS/
          : /WORKER_NAME_ALREADY_EXISTS/,
      );
      assert.ok(calls.every((call) => call.method === 'GET'));
      assert.deepEqual(partial.completed, []);
      assert.equal(partial.resourceRecord, undefined);
    }
  });
});

function partialFixture(options = {}) {
  const f = fixture(options),
    calls = [];
  const fetcher = async (url, request) => {
    const path = url.slice(
      url.indexOf('/accounts/' + TARGET.account) +
        ('/accounts/' + TARGET.account).length,
    );
    calls.push({ method: request.method, path, body: request.body });
    assert.equal(request.method, 'GET');
    assert.equal(request.body, undefined);
    if (path === options.deniedPath)
      return new Response('SYNTHETIC_MUST_NOT_LOG', { status: 403 });
    if (path === '/d1/database/' + PARTIAL_SETUP.databaseId)
      return Response.json(
        envelope({
          uuid: options.wrongId ? id : PARTIAL_SETUP.databaseId,
          name: TARGET.database,
        }),
      );
    if (path === '/workers/scripts')
      return Response.json(
        envelope([
          ...(options.noGuard ? [] : [{ id: TARGET.guard }]),
          ...(options.cleanup ? [{ id: TARGET.cleanup }] : []),
        ]),
      );
    if (path.endsWith('/settings')) {
      const guard = path.includes(TARGET.guard + '/');
      return Response.json(
        envelope({
          bindings: guard
            ? [
                {
                  type: 'durable_object_namespace',
                  name: 'GUARD',
                  class_name: 'CommunityReportLedger',
                  namespace_id: options.badNamespace
                    ? 'invalid'
                    : 'f'.repeat(32),
                },
              ]
            : [
                {
                  type: 'd1',
                  name: 'REPORTS_DB',
                  id: PARTIAL_SETUP.databaseId,
                },
                {
                  type: 'service',
                  name: 'REPORTS_GUARD',
                  service: TARGET.guard,
                  entrypoint: 'ReportsGuardService',
                },
                ...FLAGS.map((flag) => ({
                  type: 'plain_text',
                  name: flag,
                  text:
                    flag === 'REPORTS_ENABLED' && options.cleanupLive
                      ? 'true'
                      : 'false',
                })),
              ],
        }),
      );
    }
    if (path.endsWith('/subdomain'))
      return Response.json(
        envelope(
          options.badUrls
            ? { enabled: false }
            : {
                enabled: !!options.publicUrl,
                previews_enabled: !!options.previewUrl,
              },
        ),
      );
    if (path.endsWith('/schedules'))
      return Response.json(
        envelope({ schedules: options.cron ? [{ cron: '*/15 * * * *' }] : [] }),
      );
    return Response.json(
      await f.api('GET', path, undefined, 'SYNTHETIC_READBACK'),
    );
  };
  return {
    api: client('s'.repeat(30), fetcher, PARTIAL_SETUP.databaseId, true),
    calls,
    fetcher,
  };
}

await test('partial readback uses pinned D1 UUID, captures namespace, URLs, preview, cron and Pages OFF without secret output', async () => {
  const f = partialFixture({ publicUrl: true, previewUrl: true, cron: true });
  const result = await readbackPartial(f.api, baseline);
  assert.equal(result.readbackComplete, true);
  assert.equal(result.database.identityMatches, true);
  const guard = result.workers[TARGET.guard];
  assert.equal(guard.bindings.guardNamespaceId, 'f'.repeat(32));
  assert.deepEqual(guard.publicUrls, { enabled: true, previewsEnabled: true });
  assert.deepEqual(guard.cron, { empty: false, expressions: ['*/15 * * * *'] });
  assert.equal(result.workers[TARGET.cleanup].exists, false);
  assert.equal(result.pages.intakeClosed, true);
  assert.equal(result.readyForAutomaticResume, false);
  assert.ok(
    f.calls.every((call) => call.method === 'GET' && call.body === undefined),
  );
  assert.ok(
    !f.calls.some(
      (call) =>
        call.path.includes('/query') || call.path.includes(TARGET.cleanup),
    ),
  );
  assert.ok(!JSON.stringify(result).includes('SYNTHETIC_MUST_NOT_LOG'));
  assert.equal(result.resourceRecord, undefined);
});

await test('read-only transport rejects every mutation, old SQL, unrelated DB and credential endpoints before network', async () => {
  let calls = 0;
  const api = client(
    's'.repeat(30),
    async () => {
      calls++;
      assert.fail('network forbidden');
    },
    PARTIAL_SETUP.databaseId,
    true,
  );
  for (const [method, path, body] of [
    ['POST', '/d1/database', { name: TARGET.database }],
    [
      'POST',
      '/workers/scripts/' + TARGET.guard + '/subdomain',
      { enabled: false, previews_enabled: false },
    ],
    ['PUT', '/workers/scripts/' + TARGET.guard, new FormData()],
    ['DELETE', '/d1/database/' + PARTIAL_SETUP.databaseId, undefined],
    ['PATCH', '/pages/projects/gemnao', {}],
    [
      'POST',
      '/d1/database/' + PARTIAL_SETUP.databaseId + '/query',
      { sql: 'SELECT 1', params: [] },
    ],
    ['GET', '/d1/database/' + PARTIAL_SETUP.databaseId, {}],
  ])
    await assert.rejects(
      api(method, path, body, 'READBACK'),
      /READ_ONLY_REQUEST_REQUIRED/,
    );
  await assert.rejects(
    api('GET', '/d1/database/' + id, undefined, 'READBACK'),
    /ONLY_NEW_DATABASE_ALLOWED/,
  );
  await assert.rejects(
    api('GET', '/tokens', undefined, 'READBACK'),
    /REQUEST_OUTSIDE_FIXED_BOUNDARY/,
  );
  assert.equal(calls, 0);
});

await test('partial readback keeps remaining observations on denial, missing guard, malformed responses, identity drift or open Pages flags', async () => {
  for (const options of [
    { deniedPath: '/workers/scripts/' + TARGET.guard + '/subdomain' },
    { noGuard: true },
    { badNamespace: true },
    { wrongId: true },
    { badUrls: true },
    { liveFlag: true },
  ]) {
    const f = partialFixture(options);
    const result = await readbackPartial(f.api, baseline);
    assert.equal(result.readbackComplete, false);
    assert.equal(result.readyForAutomaticResume, false);
    assert.ok(result.pages);
    assert.ok(result.errors.length);
    assert.ok(!JSON.stringify(result).includes('SYNTHETIC_MUST_NOT_LOG'));
    if (options.deniedPath) {
      assert.equal(result.workers[TARGET.guard].publicUrls, null);
      assert.equal(result.workers[TARGET.guard].cron.empty, true);
      assert.equal(result.errors[0].httpStatus, 403);
      assert.equal(
        f.calls.filter((call) => call.path === options.deniedPath).length,
        1,
      );
    }
    if (options.liveFlag) assert.equal(result.pages.intakeClosed, false);
    assert.ok(f.calls.every((call) => call.method === 'GET'));
  }
});

await test('an unexpectedly existing cleanup is observed including OFF flags, never adopted or overwritten', async () => {
  const f = partialFixture({ cleanup: true, cleanupLive: true });
  const result = await readbackPartial(f.api, baseline);
  assert.equal(result.workers[TARGET.cleanup].exists, true);
  assert.equal(
    result.workers[TARGET.cleanup].bindings.flagsOff.REPORTS_ENABLED,
    false,
  );
  assert.equal(result.workers[TARGET.cleanup].bindings.databaseMatches, true);
  assert.equal(result.readyForAutomaticResume, false);
  assert.ok(f.calls.every((call) => call.method === 'GET'));
});

await test('protected readback entry point skips artifacts, uses GET only and refuses missing owner protection/context/credential', async () => {
  const file = 'closed-setup-receipt.json';
  const previous = await readFile(file).catch((error) => {
    if (error.code === 'ENOENT') return null;
    throw error;
  });
  const previousExit = process.exitCode,
    previousLog = console.log;
  const logs = [];
  console.log = (value) => logs.push(value);
  try {
    for (const patch of [
      {},
      { REPORTS_SETUP_ENVIRONMENT: 'other' },
      { GITHUB_RUN_ATTEMPT: '2' },
      { CLOUDFLARE_API_TOKEN: '' },
      { REPORTS_SETUP_CONFIRMATION: 'SETUP_CLOSED_REPORTS_ONLY' },
      { syntheticMissingReviewers: true },
    ]) {
      process.exitCode = 0;
      const f = partialFixture(),
        githubCalls = [];
      const fetcher = async (url, options) => {
        if (url.startsWith('https://api.cloudflare.com/'))
          return f.fetcher(url, options);
        githubCalls.push({ url, ...options });
        assert.equal(options.method, 'GET');
        return Response.json(
          url.includes('branch-policies')
            ? {
                total_count: 1,
                branch_policies: [{ name: TARGET.branch, type: 'branch' }],
              }
            : {
                name: TARGET.environment,
                protection_rules: patch.syntheticMissingReviewers
                  ? []
                  : [{ type: 'required_reviewers', reviewers: [{}] }],
                deployment_branch_policy: {
                  custom_branch_policies: true,
                  protected_branches: false,
                },
              },
        );
      };
      await main(
        {
          ...env,
          CLOUDFLARE_API_TOKEN: 's'.repeat(30),
          REPORTS_SETUP_ENVIRONMENT: TARGET.environment,
          REPORTS_SETUP_OPERATION: 'readback',
          // No artifact exists: readback must never invoke build/upload helpers.
          REPORTS_ARTIFACT_DIR: '/does-not-exist-synthetic',
          ...patch,
        },
        fetcher,
        'run',
      );
      const result = JSON.parse(await readFile(file, 'utf8'));
      if (Object.keys(patch).length === 0) {
        assert.equal(result.ok, true);
        assert.equal(result.intakeEnabled, null);
        assert.equal(result.readback.pages.intakeClosed, true);
        assert.equal(
          result.readback.database.databaseId,
          PARTIAL_SETUP.databaseId,
        );
        assert.equal(result.readback.readyForAutomaticResume, false);
        assert.ok(f.calls.length > 0);
      } else {
        assert.equal(result.ok, false);
        assert.equal(f.calls.length, 0);
        assert.equal(process.exitCode, 1);
      }
      assert.ok(githubCalls.every((call) => call.method === 'GET'));
      assert.ok(f.calls.every((call) => call.method === 'GET'));
    }
    assert.ok(!logs.join('\n').includes('SYNTHETIC_MUST_NOT_LOG'));
  } finally {
    console.log = previousLog;
    process.exitCode = previousExit;
    if (previous) await writeFile(file, previous);
    else await rm(file, { force: true });
  }
});
