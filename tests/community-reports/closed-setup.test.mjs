import test from 'node:test';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  client,
  context,
  gate,
  inspect,
  setup,
  safeFailure,
  verifyArtifact,
  TARGET,
  FLAGS,
} from '../../ops/community-reports/closed-setup.mjs';
const baseline = JSON.parse(await readFile('wrangler.json', 'utf8'));
const schema = await readFile('migrations/community-reports/0001.sql', 'utf8');
const id = '11111111-1111-4111-8111-111111111111';
const env = {
  GITHUB_ACTIONS: 'true',
  GITHUB_REPOSITORY: TARGET.repository,
  GITHUB_REF: 'refs/heads/gemunao',
  GITHUB_WORKFLOW: TARGET.workflow,
  GITHUB_EVENT_NAME: 'workflow_dispatch',
  GITHUB_RUN_ATTEMPT: '1',
  GITHUB_SHA: 'a'.repeat(40),
  GITHUB_RUN_ID: '1',
  GH_TOKEN: 'synthetic',
};
const envelope = (result) => ({ success: true, errors: [], result });
await test('artifact digest pins source, exact file set and every compiled byte', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'closed-artifact-test-'));
  const hash = (value) => createHash('sha256').update(value).digest('hex');
  try {
    await mkdir(join(directory, 'pages'));
    await mkdir(join(directory, 'workers'));
    const entries = {
      'pages/_worker.js': 'wrapper',
      'pages/_worker.bundle.js': 'bundle',
      'workers/guard.mjs': 'guard',
      'workers/cleanup.mjs': 'cleanup',
      'schema.sql': schema,
    };
    for (const [path, text] of Object.entries(entries))
      await writeFile(join(directory, path), text);
    const manifest = JSON.stringify({
      sourceSha: env.GITHUB_SHA,
      base: TARGET.base,
      hashes: Object.fromEntries(
        Object.entries(entries).map(([path, text]) => [path, hash(text)]),
      ),
    });
    await writeFile(join(directory, 'manifest.json'), manifest);
    await verifyArtifact(directory, hash(manifest), env.GITHUB_SHA);
    await assert.rejects(
      verifyArtifact(directory, '0'.repeat(64), env.GITHUB_SHA),
      /ARTIFACT_DIGEST_MISMATCH/,
    );
    await assert.rejects(
      verifyArtifact(directory, hash(manifest), 'b'.repeat(40)),
      /ARTIFACT_SOURCE_MISMATCH/,
    );
    await writeFile(join(directory, 'pages/_worker.bundle.js'), 'changed');
    await assert.rejects(
      verifyArtifact(directory, hash(manifest), env.GITHUB_SHA),
      /ARTIFACT_BYTES_CHANGED/,
    );
    await writeFile(join(directory, 'pages/_worker.bundle.js'), 'bundle');
    await writeFile(join(directory, 'unexpected'), 'extra');
    await assert.rejects(
      verifyArtifact(directory, hash(manifest), env.GITHUB_SHA),
      /ARTIFACT_FILE_SET_CHANGED/,
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
function fixture(options = {}) {
  const project = {
    name: TARGET.pages,
    production_branch: TARGET.branch,
    deployment_configs: {
      production: {
        d1_databases: Object.fromEntries(
          baseline.d1_databases.map((db) => [
            db.binding,
            { id: db.database_id },
          ]),
        ),
        services: {
          EXISTING_SERVICE: {
            service: 'existing-service',
            environment: 'production',
          },
        },
        env_vars: {
          EXISTING_SECRET: {
            type: 'secret_text',
            value: 'SYNTHETIC_MUST_NOT_LOG',
          },
        },
        compatibility_flags: ['nodejs_compat'],
        placement: { mode: 'smart' },
      },
      preview: {
        d1_databases: {},
        env_vars: { PREVIEW_ONLY: { type: 'plain_text', value: 'keep' } },
      },
    },
  };
  const original = structuredClone(project),
    calls = [],
    uploads = new Map();
  let pagesReads = 0,
    uploadedPages = 0;
  const api = async (method, path, body, label) => {
    calls.push({ method, path, body, label });
    if (options.failLabel === label) throw Error('SYNTHETIC_MUST_NOT_LOG');
    if (method === 'GET' && path.startsWith('/d1/database?'))
      return {
        ...envelope(
          baseline.d1_databases.map((db) => ({
            uuid: db.database_id,
            name: db.database_name,
          })),
        ),
        result_info: { total_count: options.incomplete ? 4 : 3 },
      };
    if (method === 'GET' && path === '/workers/scripts')
      return envelope(options.workerExists ? [{ id: TARGET.guard }] : []);
    if (method === 'GET' && path === '/pages/projects/gemnao') {
      pagesReads++;
      if (options.liveFlag)
        project.deployment_configs.production.env_vars.REPORTS_ENABLED = {
          type: 'plain_text',
          value: 'true',
        };
      if (options.wrongBinding)
        project.deployment_configs.production.d1_databases.DB.id = id;
      if (options.race && pagesReads === 2)
        project.deployment_configs.preview.env_vars.EXTRA = {
          value: 'changed',
        };
      return envelope(structuredClone(project));
    }
    if (method === 'POST' && path === '/d1/database')
      return envelope({
        uuid: options.reusedId ? baseline.d1_databases[0].database_id : id,
        name: TARGET.database,
      });
    if (method === 'GET' && path === '/d1/database/' + id)
      return envelope({ uuid: id, name: TARGET.database });
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
    const worker = path.match(
      /^\/workers\/scripts\/(gemnao-community-reports-(guard|cleanup))(?:\/(subdomain|settings|schedules))?$/,
    );
    if (worker) {
      const name = worker[1],
        tail = worker[3];
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
          bindings: uploads
            .get(name)
            .bindings.map((binding) =>
              binding.type === 'durable_object_namespace'
                ? { ...binding, namespace_id: 'f'.repeat(32) }
                : binding,
            ),
        });
    }
    if (method === 'PATCH' && path === '/pages/projects/gemnao') {
      assert.deepEqual(Object.keys(body), ['deployment_configs']);
      assert.deepEqual(Object.keys(body.deployment_configs), ['production']);
      assert.deepEqual(Object.keys(body.deployment_configs.production).sort(), [
        'd1_databases',
        'services',
      ]);
      Object.assign(
        project.deployment_configs.production,
        structuredClone(body.deployment_configs.production),
      );
      if (options.corruptAfterPatch)
        project.deployment_configs.production.env_vars.EXISTING_SECRET.value =
          'changed';
      return envelope(project);
    }
    throw Error('unexpected fixed request');
  };
  return {
    api,
    calls,
    project,
    original,
    uploads,
    uploader: async () => {
      uploadedPages++;
    },
    pagesUploads: () => uploadedPages,
  };
}
await test('manual fixed context refuses reruns, other workflows, repositories and branches', () => {
  context(env);
  for (const input of [
    { GITHUB_RUN_ATTEMPT: '2' },
    { GITHUB_REF: 'refs/heads/main' },
    { GITHUB_REPOSITORY: 'other/repo' },
    { GITHUB_WORKFLOW: 'Community reports analytics preflight' },
    { GITHUB_EVENT_NAME: 'push' },
  ])
    assert.throws(() => context({ ...env, ...input }));
});
await test('existing reviewer and exact branch protections are mandatory and never modified', async () => {
  const calls = [];
  const fetcher = async (url, options) => {
    calls.push({ url, options });
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
  assert.ok(
    calls.every(
      (call) =>
        call.options.method === 'GET' && call.options.redirect === 'error',
    ),
  );
  await assert.rejects(
    gate(env, async () => Response.json({})),
    /EXISTING_REVIEWER_REQUIRED/,
  );
});
await test('HTTP boundary rejects other accounts, existing DB SQL, restore, arbitrary SQL and credential endpoints before fetch', async () => {
  let requests = 0;
  const api = client('s'.repeat(30), async () => {
    requests++;
    return Response.json(envelope({ uuid: id, name: TARGET.database }));
  });
  for (const [method, path, body] of [
    ['GET', 'https://outside.invalid', undefined],
    [
      'POST',
      '/d1/database/' + baseline.d1_databases[0].database_id + '/query',
      { sql: 'DROP TABLE x', params: [] },
    ],
    ['POST', '/d1/database/' + id + '/time_travel/restore', {}],
    ['GET', '/tokens', undefined],
    ['DELETE', '/workers/scripts/' + TARGET.guard, undefined],
    ['POST', '/d1/database', { name: 'wrong' }],
  ])
    await assert.rejects(api(method, path, body, 'FIXED'));
  assert.equal(requests, 0);
  await api('POST', '/d1/database', { name: TARGET.database }, 'CREATE');
  await assert.rejects(
    api(
      'POST',
      '/d1/database/' + id + '/query',
      { sql: 'DELETE FROM x', params: [] },
      'QUERY',
    ),
  );
  assert.equal(requests, 1);
});
await test('403, redirects, partial errors and raw provider exceptions stop without retries or secret output', async () => {
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
await test('inspect is GET-only and does not claim write permission verification', async () => {
  const f = fixture(),
    result = await inspect(f.api, baseline);
  assert.ok(f.calls.every((call) => call.method === 'GET'));
  assert.equal(result.receipt.writePermissionsVerified, false);
  assert.ok(!JSON.stringify(result.receipt).includes('SYNTHETIC'));
});
await test('incomplete inventory, target collision, wrong existing bindings and enabled flags stop before mutation', async () => {
  for (const options of [
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
await test('setup uses only newly created UUID; rejects a provider returning an existing DB before SQL', async () => {
  const f = fixture({ reusedId: true });
  await assert.rejects(
    setup(f.api, baseline, '', { completed: [] }, f.uploader),
    /NEW_D1_IDENTITY_MISMATCH/,
  );
  assert.ok(!f.calls.some((call) => call.path.endsWith('/query')));
  assert.equal(f.pagesUploads(), 0);
});
await test('closed setup preserves existing data/settings, disables Worker URLs, leaves cron and activation absent', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'closed-setup-test-'));
  try {
    await mkdir(join(directory, 'workers'));
    await writeFile(join(directory, 'schema.sql'), schema);
    for (const name of ['guard', 'cleanup'])
      await writeFile(
        join(directory, 'workers', name + '.mjs'),
        'export default {}',
      );
    const f = fixture(),
      receipt = { completed: [] };
    await setup(f.api, baseline, directory, receipt, f.uploader);
    assert.equal(f.pagesUploads(), 1);
    assert.equal(receipt.intakeEnabled, false);
    assert.equal(receipt.bootstrapInvoked, false);
    assert.equal(receipt.verificationEraseInvoked, false);
    assert.deepEqual(
      f.project.deployment_configs.preview,
      f.original.deployment_configs.preview,
    );
    assert.deepEqual(
      f.project.deployment_configs.production.env_vars,
      f.original.deployment_configs.production.env_vars,
    );
    for (const db of baseline.d1_databases)
      assert.equal(
        f.project.deployment_configs.production.d1_databases[db.binding].id,
        db.database_id,
      );
    const metadata = f.uploads.get(TARGET.cleanup);
    assert.ok(
      FLAGS.every((flag) =>
        metadata.bindings.some(
          (binding) => binding.name === flag && binding.text === 'false',
        ),
      ),
    );
    assert.deepEqual(f.uploads.get(TARGET.guard).migrations, {
      new_tag: 'v1',
      new_sqlite_classes: ['CommunityReportLedger'],
    });
    assert.ok(
      !f.calls.some((call) =>
        /restore|\/operation|\/observe|secrets|tokens/.test(call.path),
      ),
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
await test('nonempty new D1, worker upload failure, cron, concurrent settings change and nested secret change stop before Pages upload', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'closed-setup-fail-'));
  try {
    await mkdir(join(directory, 'workers'));
    await writeFile(join(directory, 'schema.sql'), schema);
    for (const name of ['guard', 'cleanup'])
      await writeFile(
        join(directory, 'workers', name + '.mjs'),
        'export default {}',
      );
    for (const options of [
      { notEmpty: true },
      { failLabel: 'GUARD_UPLOAD' },
      { cron: true },
      { race: true },
      { corruptAfterPatch: true },
    ]) {
      const f = fixture(options);
      await assert.rejects(
        setup(f.api, baseline, directory, { completed: [] }, f.uploader),
      );
      assert.equal(f.pagesUploads(), 0);
    }
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
