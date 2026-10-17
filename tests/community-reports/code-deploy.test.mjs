import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdtemp, rm } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  TARGET,
  FLAGS,
  gate,
} from '../../ops/community-reports/closed-setup.mjs';
import { configProjection } from '../../ops/community-reports/managed-config.mjs';
import {
  RELEASE,
  OPERATION,
  confirmation,
  verifyCodeContext,
  uploadMetadata,
  codeClient,
  deployCodeOnly,
  hash,
} from '../../ops/community-reports/code-deploy.mjs';
const sha = 'a'.repeat(40),
  token = 'synthetic-not-a-credential';
const env = {
  GITHUB_ACTIONS: 'true',
  GITHUB_REPOSITORY: TARGET.repository,
  GITHUB_REF: 'refs/heads/gemunao',
  GITHUB_WORKFLOW: TARGET.workflow,
  GITHUB_EVENT_NAME: 'workflow_dispatch',
  GITHUB_RUN_ATTEMPT: '1',
  GITHUB_SHA: sha,
  GITHUB_RUN_ID: '12345',
  REPORTS_SETUP_OPERATION: OPERATION,
  REPORTS_SETUP_SOURCE_SHA: sha,
  REPORTS_SETUP_CONFIRMATION: confirmation(sha),
  GH_TOKEN: token,
};
const config = JSON.parse(await readFile('wrangler.json', 'utf8'));
const bytes = {
  guard: Buffer.from('synthetic guard'),
  cleanup: Buffer.from('synthetic cleanup'),
};
const envelope = (result) =>
  Response.json({ success: true, errors: [], result });
function fixture(options = {}) {
  const { vars, ...rest } = configProjection(config);
  const project = {
    name: TARGET.pages,
    production_branch: TARGET.branch,
    canonical_deployment: { id: RELEASE.deploymentId },
    build_config: { build_command: 'pnpm build' },
    deployment_configs: {
      production: {
        ...rest,
        wrangler_config_hash: 'synthetic',
        env_vars: {
          ...Object.fromEntries(
            Object.entries(vars).map(([k, v]) => [
              k,
              { type: 'plain_text', value: v },
            ]),
          ),
          UNCHANGED: { type: 'secret_text', value: 'SYNTHETIC_PRIVATE' },
        },
      },
      preview: { env_vars: {} },
    },
  };
  let source = RELEASE.deployedSha;
  const settings = {
    [TARGET.guard]: {
      compatibility_date: '2026-05-22',
      observability: { enabled: false },
      bindings: [
        {
          type: 'durable_object_namespace',
          name: 'GUARD',
          class_name: 'CommunityReportLedger',
          namespace_id: RELEASE.namespaceId,
        },
      ],
    },
    [TARGET.cleanup]: {
      compatibility_date: '2026-05-22',
      observability: { enabled: false },
      bindings: [
        { type: 'd1', name: 'REPORTS_DB', id: RELEASE.databaseId },
        {
          type: 'service',
          name: 'REPORTS_GUARD',
          service: TARGET.guard,
          entrypoint: 'ReportsGuardService',
        },
        ...FLAGS.map((name) => ({ type: 'plain_text', name, text: 'false' })),
        {
          type: 'plain_text',
          name: 'REPORTS_GUARD_INSTANCE',
          text: RELEASE.instanceId,
        },
      ],
    },
  };
  const tags = { [TARGET.guard]: 'v1', [TARGET.cleanup]: null };
  const etags = {
    [TARGET.guard]: 'old-guard',
    [TARGET.cleanup]: 'old-cleanup',
  };
  const writes = [],
    calls = [],
    checkpoints = [];
  let uploads = 0;
  const fetcher = async (url, init) => {
    const path = new URL(url).pathname.replace(
      '/client/v4/accounts/' + TARGET.account,
      '',
    );
    calls.push({ method: init.method, path });
    assert.equal(init.redirect, 'error');
    if (init.method === 'PUT') {
      const name = path.split('/').at(-1);
      writes.push(name);
      uploads++;
      const metadata = JSON.parse(await init.body.get('metadata').text());
      assert.equal(metadata.bindings.length, 0);
      assert.ok(!metadata.migrations);
      assert.deepEqual(
        metadata.keep_bindings,
        name === TARGET.guard
          ? ['durable_object_namespace']
          : ['d1', 'service', 'plain_text'],
      );
      if (options.failUpload === name) throw Error('PRIVATE network failure');
      etags[name] = 'new-' + name;
      if (options.driftAfterUpload)
        settings[TARGET.cleanup].bindings.find(
          (b) => b.name === 'REPORTS_ENABLED',
        ).text = 'true';
      return envelope({ id: name, etag: etags[name] });
    }
    assert.equal(init.method, 'GET');
    if (path === '/pages/projects/gemnao') return envelope(project);
    if (path.startsWith('/pages/projects/gemnao/deployments/'))
      return envelope({
        id: project.canonical_deployment.id,
        environment: 'production',
        latest_stage: { name: 'deploy', status: 'success' },
        deployment_trigger: { metadata: { commit_hash: source } },
      });
    if (path === '/d1/database/' + RELEASE.databaseId)
      return envelope({ uuid: RELEASE.databaseId, name: TARGET.database });
    if (path === '/workers/scripts')
      return envelope(
        Object.keys(settings).map((id) => ({
          id,
          etag: etags[id],
          migration_tag: tags[id],
        })),
      );
    const match = path.match(
      /^\/workers\/scripts\/(.+)\/(settings|subdomain|schedules)$/,
    );
    assert.ok(match);
    if (match[2] === 'settings') return envelope(settings[match[1]]);
    if (match[2] === 'subdomain')
      return envelope({
        enabled: !!options.publicUrl,
        previews_enabled: false,
      });
    return envelope({ schedules: options.cron ? [{ cron: '* * * * *' }] : [] });
  };
  const uploader = async (desired) => {
    assert.equal(uploads, 2);
    assert.deepEqual(desired, config);
    writes.push('pages');
    if (options.failPages) throw Error('synthetic uncertain Pages');
    project.canonical_deployment.id = '11111111-1111-4111-8111-111111111111';
    source = sha;
    if (options.previewDrift)
      project.deployment_configs.preview.env_vars.X = {
        type: 'plain_text',
        value: 'changed',
      };
  };
  const receipt = { operation: OPERATION, sourceSha: sha, completed: [] };
  const run = () =>
    deployCodeOnly(
      (u) => codeClient(token, u, fetcher),
      config,
      bytes,
      receipt,
      uploader,
      async () => checkpoints.push(structuredClone(receipt)),
    );
  return {
    run,
    settings,
    tags,
    project,
    receipt,
    calls,
    writes,
    checkpoints,
    fetcher,
  };
}
await test('exact manual commit/confirmation and first attempt are mandatory; existing Environment reviewer and branch protection stay required', async () => {
  verifyCodeContext(env);
  for (const patch of [
    { REPORTS_SETUP_SOURCE_SHA: 'b'.repeat(40) },
    { REPORTS_SETUP_CONFIRMATION: 'DEPLOY_REPORTS_CODE_ONLY' },
    { GITHUB_RUN_ATTEMPT: '2' },
    { GITHUB_REF: 'refs/heads/main' },
    { REPORTS_SETUP_OPERATION: 'bootstrap-pin' },
  ])
    assert.throws(() => verifyCodeContext({ ...env, ...patch }));
  await assert.rejects(
    gate(env, async () =>
      Response.json({ name: TARGET.environment, protection_rules: [] }),
    ),
    /EXISTING_REVIEWER_REQUIRED/,
  );
});
await test('only two exact code uploads and one unchanged Pages deployment; no SQL, initialization, mode, URL, schedule, credential or flag writes', async () => {
  const f = fixture();
  await f.run();
  assert.deepEqual(f.writes, [TARGET.guard, TARGET.cleanup, 'pages']);
  assert.equal(f.receipt.settingsVerified, true);
  assert.equal(f.receipt.cleanupExecuted, false);
  assert.equal(f.receipt.budgetModeEnabled, false);
  assert.equal(f.receipt.workerHashes[TARGET.guard], hash(bytes.guard));
  assert(!JSON.stringify(f.receipt).includes('SYNTHETIC_PRIVATE'));
  assert(
    f.calls.every(
      (c) =>
        c.method === 'GET' ||
        (c.method === 'PUT' &&
          [TARGET.guard, TARGET.cleanup].some(
            (n) => c.path === '/workers/scripts/' + n,
          )),
    ),
  );
  assert(
    f.checkpoints.some((c) => c.nextWrite === 'upload-code:' + TARGET.guard),
  );
});
await test('wrong D1/instance/namespace, open flags, secrets, migration drift, cron, URLs and changed production anchor reject before any upload', async () => {
  const mutations = [
    (f) => (f.settings[TARGET.guard].bindings[0].namespace_id = 'wrong'),
    (f) => (f.settings[TARGET.cleanup].bindings[0].id = 'wrong'),
    (f) => (f.settings[TARGET.cleanup].bindings.at(-1).text = 'wrong'),
    (f) =>
      (f.settings[TARGET.cleanup].bindings.find(
        (b) => b.name === 'REPORTS_ENABLED',
      ).text = 'true'),
    (f) =>
      f.settings[TARGET.cleanup].bindings.push({
        type: 'secret_text',
        name: 'NEW',
      }),
    (f) => (f.tags[TARGET.guard] = 'v2'),
    (f) =>
      (f.project.canonical_deployment.id =
        '22222222-2222-4222-8222-222222222222'),
    (f) =>
      (f.settings[TARGET.cleanup].annotations = {
        'workers/message': 'preserve',
      }),
  ];
  for (const mutate of mutations) {
    const f = fixture();
    mutate(f);
    await assert.rejects(f.run());
    assert.equal(f.writes.length, 0);
  }
  for (const option of [{ cron: true }, { publicUrl: true }]) {
    const f = fixture(option);
    await assert.rejects(f.run());
    assert.equal(f.writes.length, 0);
  }
});
await test('uncertain upload is never retried and blocks later upload/Pages; post-upload drift and Pages failure never claim success', async () => {
  for (const name of [TARGET.guard, TARGET.cleanup]) {
    const f = fixture({ failUpload: name });
    await assert.rejects(f.run(), /REQUEST_UNCERTAIN/);
    assert.deepEqual(
      f.writes,
      name === TARGET.guard ? [name] : [TARGET.guard, name],
    );
    assert.notEqual(f.receipt.settingsVerified, true);
  }
  const drift = fixture({ driftAfterUpload: true });
  await assert.rejects(drift.run());
  assert.deepEqual(drift.writes, [TARGET.guard]);
  for (const opt of [{ failPages: true }, { previewDrift: true }]) {
    const f = fixture(opt);
    await assert.rejects(f.run());
    assert.notEqual(f.receipt.settingsVerified, true);
  }
});
await test('API boundary rejects data-plane/cron/settings/secret/other-origin paths and modified upload bytes before fetch; duplicate PUT refused', async () => {
  const f = fixture(),
    metadata = uploadMetadata(TARGET.guard, f.settings[TARGET.guard]);
  const api = codeClient(
    token,
    { [TARGET.guard]: { metadata, hash: hash(bytes.guard) } },
    f.fetcher,
  );
  for (const [method, path] of [
    ['POST', '/d1/database/' + RELEASE.databaseId + '/query'],
    ['PUT', '/workers/scripts/' + TARGET.guard + '/schedules'],
    ['PATCH', '/workers/scripts/' + TARGET.cleanup + '/settings'],
    ['PUT', '/workers/scripts/other'],
    ['GET', 'https://other.invalid'],
    ['POST', '/initialize'],
    ['PUT', '/workers/scripts/' + TARGET.cleanup + '/secrets'],
  ])
    await assert.rejects(api(method, path, {}, 'TEST'));
  assert.equal(f.calls.length, 0);
  const form = (code) => {
    const body = new FormData();
    body.set('metadata', new Blob([JSON.stringify(metadata)]));
    body.set('worker.mjs', new Blob([code]), 'worker.mjs');
    return body;
  };
  await assert.rejects(
    api('PUT', '/workers/scripts/' + TARGET.guard, form('changed'), 'TEST'),
    /BYTES_OR_METADATA/,
  );
  assert.equal(f.calls.length, 0);
  await api(
    'PUT',
    '/workers/scripts/' + TARGET.guard,
    form(bytes.guard),
    'TEST',
  );
  await assert.rejects(
    api('PUT', '/workers/scripts/' + TARGET.guard, form(bytes.guard), 'TEST'),
    /RETRY/,
  );
  assert.equal(f.writes.length, 1);
});

await test('source gate accepts the pinned app tree but rejects untracked/dirty runtime and a committed runtime change even with matching dispatch SHA', async () => {
  const root = process.cwd(),
    directory = await mkdtemp(join(tmpdir(), 'reports-code-source-'));
  try {
    execFileSync('git', [
      'clone',
      '--quiet',
      '--shared',
      '--no-hardlinks',
      root,
      directory,
    ]);
    const git = (...args) =>
      execFileSync('git', args, { cwd: directory, encoding: 'utf8' }).trim();
    const moduleUrl = pathToFileURL(
      resolve('ops/community-reports/code-deploy.mjs'),
    ).href;
    const verify = () => {
      const source = git('rev-parse', 'HEAD');
      execFileSync(
        process.execPath,
        [
          '--input-type=module',
          '-e',
          `import {verifyCodeSource} from ${JSON.stringify(moduleUrl)}; await verifyCodeSource(JSON.parse(process.env.CODE_TEST_CONTEXT));`,
        ],
        {
          cwd: directory,
          env: {
            ...process.env,
            CODE_TEST_CONTEXT: JSON.stringify({
              ...env,
              GITHUB_SHA: source,
              REPORTS_SETUP_SOURCE_SHA: source,
              REPORTS_SETUP_CONFIRMATION: confirmation(source),
            }),
          },
          stdio: 'pipe',
        },
      );
    };
    verify();
    await writeFile(join(directory, 'unexpected.txt'), 'synthetic');
    assert.throws(verify);
    await rm(join(directory, 'unexpected.txt'));
    verify();
    await writeFile(
      join(directory, 'lib/community-reports/admission.ts'),
      '\n// unauthorized runtime edit\n',
      { flag: 'a' },
    );
    assert.throws(verify);
    git(
      '-c',
      'user.name=synthetic',
      '-c',
      'user.email=synthetic@example.invalid',
      'commit',
      '-am',
      'synthetic forbidden runtime change',
    );
    assert.throws(verify);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
