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
    if (options.failLabel === label) throw Error('SYNTHETIC_MUST_NOT_LOG');
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
      if (method === 'PUT' && tail === 'subdomain') {
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
      'PUT',
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
