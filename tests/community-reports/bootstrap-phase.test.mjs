import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import {
  readFile,
  writeFile,
  mkdtemp,
  mkdir,
  rm,
  stat,
  copyFile,
} from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import {
  TARGET,
  FLAGS,
  verifySource,
  safeFailure,
  main,
} from '../../ops/community-reports/closed-setup.mjs';
import {
  normalized,
  persistedConfig,
  configProjection,
} from '../../ops/community-reports/managed-config.mjs';
import {
  PHASE_PATH,
  CONFIRMATIONS,
  STAGE1,
  initialPhase,
  validatePhase,
  phaseConfig,
  nextPhase,
  preparePhase,
  configHash,
  cleanupBindings,
  phaseClient,
  runBootstrapStage,
} from '../../ops/community-reports/bootstrap-phase.mjs';

const record = JSON.parse(
  await readFile('ops/community-reports/closed-binding-state.json', 'utf8'),
);
const baseline = JSON.parse(
  execFileSync('git', ['show', TARGET.base + ':wrangler.json'], {
    encoding: 'utf8',
  }),
);
const closed = persistedConfig(baseline, record, TARGET, FLAGS);
const id = '11111111-1111-4111-8111-111111111111';
const otherId = '22222222-2222-4222-8222-222222222222';
const openSha = 'a'.repeat(40),
  pinSha = 'b'.repeat(40);
const openDeployment = '33333333-3333-4333-8333-333333333333';
const pinDeployment = '44444444-4444-4444-8444-444444444444';
const hash = (value) =>
  createHash('sha256').update(normalized(value)).digest('hex');
const open = initialPhase(closed, record);
const openConfig = phaseConfig(closed, open, record);
const openReceipt = () => ({
  ok: true,
  operation: 'bootstrap-open',
  sourceSha: openSha,
  runId: '987654321',
  settingsVerified: true,
  nextWrite: null,
  phaseHash: hash(open),
  resourceHash: hash(record),
  configSha256: configHash(openConfig),
  deployment: { deploymentId: openDeployment, sourceSha: openSha },
});
const pin = () =>
  nextPhase(closed, record, openReceipt(), { ok: true, instanceId: id });
const receipt = (state) => ({
  operation: 'bootstrap-' + state.phase,
  sourceSha: state.phase === 'open' ? openSha : pinSha,
  runId: '987654322',
  completed: [],
});
const envelope = (result) => ({ success: true, errors: [], result });
function production(config) {
  const { vars, ...bindings } = configProjection(config);
  return {
    ...bindings,
    wrangler_config_hash: 'synthetic',
    env_vars: {
      ...Object.fromEntries(
        Object.entries(vars).map(([name, value]) => [
          name,
          { type: 'plain_text', value },
        ]),
      ),
      EXISTING_SECRET: {
        type: 'secret_text',
        value: 'SYNTHETIC_NOT_FOR_LOGGING',
      },
    },
  };
}
function fixture(state = open, options = {}) {
  const previous = state.phase === 'open' ? closed : openConfig;
  const project = {
    name: TARGET.pages,
    production_branch: TARGET.branch,
    canonical_deployment: { id: state.expectedPrevious.deploymentId },
    build_config: {
      destination_dir: 'dist/client',
      build_command: 'pnpm build',
    },
    deployment_configs: {
      production: production(previous),
      preview: { env_vars: {}, d1_databases: {} },
    },
  };
  let sourceSha = state.expectedPrevious.sourceSha;
  const settings = {
    [TARGET.guard]: {
      compatibility_date: '2026-10-15',
      bindings: [
        {
          type: 'durable_object_namespace',
          name: 'GUARD',
          class_name: 'CommunityReportLedger',
          namespace_id: STAGE1.guardNamespaceId,
        },
      ],
    },
    [TARGET.cleanup]: {
      compatibility_date: '2026-10-15',
      observability: { enabled: false },
      bindings: cleanupBindings(options.existingPin || null),
    },
  };
  if (options.annotations)
    settings[TARGET.cleanup].annotations = {
      'workers/message': 'preserve operator message',
    };
  const calls = [],
    writes = [],
    checkpoints = [];
  let projectReads = 0,
    failPatch = options.failPatch;
  const fetcher = async (url, request) => {
    const path = new URL(url).pathname.replace(
      '/client/v4/accounts/' + TARGET.account,
      '',
    );
    calls.push({ method: request.method, path });
    if (request.method !== 'GET') {
      assert.equal(request.method, 'PATCH');
      assert.equal(path, '/workers/scripts/' + TARGET.cleanup + '/settings');
      // Closure on Pages is a precondition of the only Worker mutation.
      assert.equal(
        project.deployment_configs.production.env_vars.REPORTS_BOOTSTRAP_ALLOWED
          .value,
        'false',
      );
      assert.equal(
        project.deployment_configs.production.env_vars.REPORTS_GUARD_INSTANCE
          .value,
        id,
      );
      const body = JSON.parse(request.body.get('settings'));
      assert.deepEqual(body, { bindings: cleanupBindings(id) });
      writes.push('cleanup-pin');
      if (failPatch) {
        failPatch = false;
        throw Error('SYNTHETIC_NOT_FOR_LOGGING');
      }
      settings[TARGET.cleanup].bindings = body.bindings;
      return Response.json(envelope(settings[TARGET.cleanup]));
    }
    if (path === '/pages/projects/gemnao') {
      projectReads++;
      if (options.pagesDrift && projectReads === 2)
        project.build_config.build_command = 'changed';
      return Response.json(envelope(project));
    }
    if (path.startsWith('/pages/projects/gemnao/deployments/'))
      return Response.json(
        envelope({
          id: project.canonical_deployment.id,
          environment: 'production',
          latest_stage: { name: 'deploy', status: 'success' },
          deployment_trigger: { metadata: { commit_hash: sourceSha } },
        }),
      );
    if (path === '/d1/database/' + STAGE1.databaseId)
      return Response.json(
        envelope({
          uuid: options.wrongDatabase ? otherId : STAGE1.databaseId,
          name: TARGET.database,
        }),
      );
    const worker =
      /^\/workers\/scripts\/(gemnao-community-reports-(?:guard|cleanup))\/(settings|subdomain|schedules)$/.exec(
        path,
      );
    assert.ok(worker, path);
    const [, name, kind] = worker;
    if (kind === 'settings') {
      const value = structuredClone(settings[name]);
      if (options.wrongGuard && name === TARGET.guard)
        value.bindings[0].namespace_id = '0'.repeat(32);
      if (options.extraSecret && name === TARGET.cleanup)
        value.bindings.push({ type: 'secret_text', name: 'UNEXPECTED' });
      return Response.json(envelope(value));
    }
    if (kind === 'subdomain')
      return Response.json(
        envelope({
          enabled: options.workerUrl === true,
          previews_enabled: false,
        }),
      );
    return Response.json(
      envelope({ schedules: options.cron ? [{ cron: '* * * * *' }] : [] }),
    );
  };
  const uploader = async (config) => {
    writes.push('pages-' + state.phase);
    if (options.uploadFailure) throw Error('SYNTHETIC_NOT_FOR_LOGGING');
    const secrets =
      project.deployment_configs.production.env_vars.EXISTING_SECRET;
    project.deployment_configs.production = production(config);
    project.deployment_configs.production.env_vars.EXISTING_SECRET = secrets;
    project.canonical_deployment.id =
      state.phase === 'open' ? openDeployment : pinDeployment;
    sourceSha = receipt(state).sourceSha;
    if (options.previewDrift)
      project.deployment_configs.preview.env_vars.CHANGED = {
        type: 'plain_text',
        value: 'x',
      };
    if (options.badSource) sourceSha = 'c'.repeat(40);
  };
  const persist = async () => checkpoints.push(structuredClone(result));
  const result = receipt(state);
  const run = () =>
    runBootstrapStage(
      phaseClient(
        'SYNTHETIC_TOKEN_LONG_ENOUGH_FOR_TEST',
        state,
        record,
        closed,
        fetcher,
      ),
      closed,
      record,
      state,
      result,
      uploader,
      persist,
    );
  return {
    run,
    project,
    settings,
    calls,
    writes,
    checkpoints,
    result,
    fetcher,
  };
}

test('phase projections allow one bootstrap flag or one exact returned pin; intake always OFF', () => {
  assert.equal(openConfig.vars.REPORTS_BOOTSTRAP_ALLOWED, 'true');
  for (const flag of FLAGS.filter((x) => x !== 'REPORTS_BOOTSTRAP_ALLOWED'))
    assert.equal(openConfig.vars[flag], 'false');
  assert.deepEqual(
    {
      ...openConfig,
      vars: { ...openConfig.vars, REPORTS_BOOTSTRAP_ALLOWED: 'false' },
    },
    closed,
  );
  const pinned = phaseConfig(closed, pin(), record);
  assert.ok(FLAGS.every((flag) => pinned.vars[flag] === 'false'));
  assert.equal(pinned.vars.REPORTS_GUARD_INSTANCE, id);
  assert.deepEqual(pinned.d1_databases, closed.d1_databases);
  assert.deepEqual(pinned.env, closed.env);
  for (const mutation of [
    { ...open, extra: true },
    { ...open, instanceId: id },
    {
      ...open,
      expectedPrevious: { ...open.expectedPrevious, sourceSha: openSha },
    },
    { ...pin(), instanceId: otherId },
  ])
    assert.throws(() => validatePhase(mutation, closed, record));
  assert.throws(() => initialPhase(closed, { ...record, databaseId: otherId }));
  assert.throws(
    () =>
      initialPhase(
        { ...closed, vars: { ...closed.vars, REPORTS_ENABLED: 'true' } },
        record,
      ),
    /BOOTSTRAP_CLOSED_FLAGS_REQUIRED/,
  );
  assert.throws(
    () =>
      initialPhase(
        { ...closed, vars: { ...closed.vars, REPORTS_GUARD_INSTANCE: id } },
        record,
      ),
    /BOOTSTRAP_CLOSED_FLAGS_REQUIRED/,
  );
});

test('only exact successful non-secret owner response and successful opening proof produce pin', () => {
  for (const response of [
    null,
    {},
    { ok: false, instanceId: id },
    { ok: true, instanceId: 'placeholder' },
    { ok: true, instanceId: id, cookie: 'NOT_ACCEPTED' },
    { ok: true, instanceId: id, total: 0 },
  ])
    assert.throws(() => nextPhase(closed, record, openReceipt(), response));
  for (const mutation of [
    { ok: false },
    { settingsVerified: false },
    { nextWrite: 'pending' },
    { configSha256: '0'.repeat(64) },
    { sourceSha: pinSha },
    { resourceHash: '0'.repeat(64) },
  ])
    assert.throws(() =>
      nextPhase(
        closed,
        record,
        { ...openReceipt(), ...mutation },
        { ok: true, instanceId: id },
      ),
    );
});

test('offline preparation changes two files only, same UUID replay writes nothing, replacement/reopen rejected', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'reports-phase-'));
  try {
    await mkdir(dirname(join(dir, PHASE_PATH)), { recursive: true });
    await writeFile(join(dir, 'wrangler.json'), JSON.stringify(closed));
    await writeFile(join(dir, 'keep.txt'), 'unchanged');
    assert.equal(
      (await preparePhase(dir, closed, record, 'open')).unchanged,
      false,
    );
    assert.equal(
      (await preparePhase(dir, closed, record, 'open')).unchanged,
      true,
    );
    await preparePhase(dir, closed, record, 'pin', openReceipt(), {
      ok: true,
      instanceId: id,
    });
    const before = await Promise.all(
      [PHASE_PATH, 'wrangler.json'].map((path) => stat(join(dir, path))),
    );
    assert.equal(
      (
        await preparePhase(dir, closed, record, 'pin', openReceipt(), {
          ok: true,
          instanceId: id,
        })
      ).unchanged,
      true,
    );
    const after = await Promise.all(
      [PHASE_PATH, 'wrangler.json'].map((path) => stat(join(dir, path))),
    );
    assert.deepEqual(
      after.map((x) => x.mtimeNs ?? x.mtimeMs),
      before.map((x) => x.mtimeNs ?? x.mtimeMs),
    );
    await assert.rejects(
      preparePhase(dir, closed, record, 'pin', openReceipt(), {
        ok: true,
        instanceId: otherId,
      }),
      /PINNED_INSTANCE/,
    );
    await assert.rejects(
      preparePhase(dir, closed, record, 'open'),
      /PINNED_INSTANCE/,
    );
    await assert.rejects(
      preparePhase(dir, closed, record, 'close', openReceipt()),
      /PINNED_INSTANCE/,
    );
    assert.equal(await readFile(join(dir, 'keep.txt'), 'utf8'), 'unchanged');
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('unknown/failed owner response can close without pin or any ledger operation', async () => {
  const state = nextPhase(closed, record, openReceipt(), null, true);
  assert.equal(state.instanceId, null);
  assert.deepEqual(phaseConfig(closed, state, record), closed);
  const f = fixture(state);
  await f.run();
  assert.deepEqual(f.writes, ['pages-close']);
  assert.equal(f.result.bootstrapAllowed, false);
  assert.equal(f.result.initializationExecutedByWorkflow, false);
  assert.ok(f.calls.every((x) => x.method === 'GET'));
});

test('opening deploys Pages only and records exact identities; never invokes bootstrap or SQL', async () => {
  const f = fixture();
  await f.run();
  assert.deepEqual(f.writes, ['pages-open']);
  assert.ok(
    f.calls.every(
      (x) =>
        x.method === 'GET' &&
        !x.path.includes('/query') &&
        !x.path.includes('/initialize'),
    ),
  );
  assert.equal(f.result.databaseId, STAGE1.databaseId);
  assert.equal(f.result.guardNamespaceId, STAGE1.guardNamespaceId);
  assert.equal(f.result.nextWrite, null);
  assert.equal(f.result.settingsVerified, true);
  assert.equal(f.result.intakeEnabled, false);
  assert.equal(f.result.bootstrapAllowed, true);
  assert.equal(f.result.initializationExecutedByWorkflow, false);
  assert.equal(
    JSON.stringify(f.result).includes('SYNTHETIC_NOT_FOR_LOGGING'),
    false,
  );
  await f.run();
  assert.deepEqual(f.writes, ['pages-open']);
  assert.equal(f.result.replayedWithoutPagesDeployment, true);
});

test('pin closes Pages first, pins same UUID on cleanup only, same execution replay makes no writes', async () => {
  const f = fixture(pin());
  await f.run();
  assert.deepEqual(f.writes, ['pages-pin', 'cleanup-pin']);
  assert.equal(f.result.bootstrapAllowed, false);
  assert.equal(f.result.instanceId, id);
  assert.ok(
    FLAGS.every(
      (flag) =>
        f.project.deployment_configs.production.env_vars[flag].value ===
        'false',
    ),
  );
  assert.deepEqual(f.settings[TARGET.cleanup].bindings, cleanupBindings(id));
  assert.equal(f.result.nextWrite, null);
  await f.run();
  assert.deepEqual(f.writes, ['pages-pin', 'cleanup-pin']);
  assert.equal(f.result.replayedWithoutPagesDeployment, true);
});

test('uncertain cleanup pin stops without retry; Pages remains closed; fresh exact-source run completes same pin', async () => {
  const state = pin(),
    f = fixture(state, { failPatch: true });
  await assert.rejects(f.run(), /BOOTSTRAP_PIN_REQUEST_UNCERTAIN/);
  assert.deepEqual(f.writes, ['pages-pin', 'cleanup-pin']);
  assert.equal(
    f.project.deployment_configs.production.env_vars.REPORTS_BOOTSTRAP_ALLOWED
      .value,
    'false',
  );
  assert.equal(
    f.project.deployment_configs.production.env_vars.REPORTS_GUARD_INSTANCE
      .value,
    id,
  );
  assert.equal(f.result.nextWrite, 'pin-existing-cleanup-instance-only');
  // New controller/transport instance after explicit operator review, same source.
  const fresh = receipt(state);
  await runBootstrapStage(
    phaseClient(
      'SYNTHETIC_TOKEN_LONG_ENOUGH_FOR_TEST',
      state,
      record,
      closed,
      f.fetcher,
    ),
    closed,
    record,
    state,
    fresh,
    async () => assert.fail('must not deploy again'),
  );
  assert.equal(fresh.settingsVerified, true);
  assert.deepEqual(f.writes, ['pages-pin', 'cleanup-pin', 'cleanup-pin']);
});

for (const [name, options] of Object.entries({
  'wrong D1': { wrongDatabase: true },
  'wrong namespace': { wrongGuard: true },
  'public URL enabled': { workerUrl: true },
  'nonempty cron': { cron: true },
  'unexpected runtime secret': { extraSecret: true },
  'existing user version annotation': { annotations: true },
  'another existing pin': { existingPin: otherId },
  'concurrent Pages settings drift': { pagesDrift: true },
}))
  test(name + ' stops before any write', async () => {
    const f = fixture(pin(), options);
    await assert.rejects(f.run());
    assert.deepEqual(f.writes, []);
  });

for (const [name, options] of Object.entries({
  'upload uncertain': { uploadFailure: true },
  'wrong deployed source': { badSource: true },
  'preview changed': { previewDrift: true },
}))
  test(
    name + ' never writes cleanup, retries, rolls back or deletes',
    async () => {
      const f = fixture(pin(), options);
      await assert.rejects(f.run());
      assert.deepEqual(f.writes, ['pages-pin']);
      assert.ok(f.calls.every((x) => x.method === 'GET'));
    },
  );

test('transport refuses every other mutation and malformed pin before fetch; one accepted PATCH maximum', async () => {
  let network = 0;
  const state = pin(),
    api = phaseClient(
      'SYNTHETIC_TOKEN_LONG_ENOUGH_FOR_TEST',
      state,
      record,
      closed,
      async () => {
        network++;
        return Response.json(envelope({}));
      },
    );
  const valid = () => {
    const form = new FormData();
    form.set('settings', JSON.stringify({ bindings: cleanupBindings(id) }));
    return form;
  };
  const badBody = valid();
  badBody.set('script', 'code');
  for (const [method, path, body] of [
    ['POST', '/d1/database/' + STAGE1.databaseId + '/query', {}],
    ['POST', '/workers/scripts/' + TARGET.cleanup + '/subdomain', {}],
    ['PUT', '/workers/scripts/' + TARGET.cleanup, valid()],
    ['PATCH', '/workers/scripts/' + TARGET.guard + '/settings', valid()],
    [
      'PATCH',
      '/workers/scripts/' + TARGET.cleanup + '/script-settings',
      valid(),
    ],
    ['PATCH', '/workers/scripts/' + TARGET.cleanup + '/settings', badBody],
    ['DELETE', '/workers/scripts/' + TARGET.cleanup, undefined],
    ['GET', '/workers/scripts/' + TARGET.cleanup + '/secrets', undefined],
    ['POST', '/admin/community-reports/bootstrap', undefined],
  ])
    await assert.rejects(api(method, path, body, 'TEST'));
  assert.equal(network, 0);
  await api(
    'PATCH',
    '/workers/scripts/' + TARGET.cleanup + '/settings',
    valid(),
    'TEST',
  );
  await assert.rejects(
    api(
      'PATCH',
      '/workers/scripts/' + TARGET.cleanup + '/settings',
      valid(),
      'TEST',
    ),
  );
  assert.equal(network, 1);
  const closedApi = phaseClient(
    'SYNTHETIC_TOKEN_LONG_ENOUGH_FOR_TEST',
    open,
    record,
    closed,
    async () => assert.fail('network'),
  );
  await assert.rejects(
    closedApi(
      'PATCH',
      '/workers/scripts/' + TARGET.cleanup + '/settings',
      valid(),
      'TEST',
    ),
  );
});

test('source verification accepts deterministic phase only; partial pair/runtime or intake drift fails closed', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'reports-phase-source-'));
  try {
    execFileSync('git', [
      'clone',
      '--quiet',
      '--shared',
      '--no-hardlinks',
      process.cwd(),
      dir,
    ]);
    for (const path of [
      'ops/community-reports/closed-setup.mjs',
      'ops/community-reports/closed-source.json',
      'ops/community-reports/bootstrap-phase.mjs',
    ]) {
      await mkdir(dirname(join(dir, path)), { recursive: true });
      await copyFile(path, join(dir, path));
    }
    const verify = () =>
      execFileSync(
        process.execPath,
        [
          '--input-type=module',
          '-e',
          'import {verifySource} from "./ops/community-reports/closed-setup.mjs"; await verifySource();',
        ],
        { cwd: dir, stdio: 'pipe' },
      );
    // Establish a closed starting pair even when HEAD already commits an
    // opening/pinned phase. This test must also run on the actual CI SHA.
    await rm(join(dir, PHASE_PATH), { force: true });
    await writeFile(join(dir, 'wrangler.json'), JSON.stringify(closed));
    verify();
    await writeFile(join(dir, PHASE_PATH), JSON.stringify(open));
    assert.throws(verify);
    await writeFile(join(dir, 'wrangler.json'), JSON.stringify(openConfig));
    verify();
    await writeFile(
      join(dir, 'wrangler.json'),
      JSON.stringify({
        ...openConfig,
        vars: { ...openConfig.vars, REPORTS_ENABLED: 'true' },
      }),
    );
    assert.throws(verify);
    await writeFile(join(dir, 'wrangler.json'), JSON.stringify(openConfig));
    await writeFile(
      join(dir, 'lib/community-reports/bootstrap.ts'),
      '// altered runtime',
    );
    assert.throws(verify);
    const safe = safeFailure(Error('SYNTHETIC_NOT_FOR_LOGGING'));
    assert.equal(
      JSON.stringify(safe).includes('SYNTHETIC_NOT_FOR_LOGGING'),
      false,
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
  await verifySource();
});

test('all bootstrap entry points retain owner protection, exact confirmation and first-attempt context before Cloudflare', async () => {
  const previous = await readFile('closed-setup-receipt.json').catch(
    () => null,
  );
  const oldLog = console.log,
    oldExit = process.exitCode;
  console.log = () => {};
  try {
    for (const operation of Object.keys(CONFIRMATIONS)) {
      for (const patch of [
        { REPORTS_SETUP_CONFIRMATION: '' },
        { REPORTS_SETUP_CONFIRMATION: 'DEPLOY_CLOSED_REPORTS_ONLY' },
        { REPORTS_SETUP_ENVIRONMENT: 'other' },
        { GITHUB_RUN_ATTEMPT: '2' },
        { GITHUB_REF: 'refs/heads/other' },
        { syntheticMissingReviewer: true },
        { REPORTS_ARTIFACT_DIR: '/tmp/nonexistent-bootstrap-artifact' },
      ]) {
        let cloudflare = 0;
        const fetcher = async (url, options) => {
          if (url.startsWith('https://api.cloudflare.com/')) {
            cloudflare++;
            assert.fail('Cloudflare must not be reached');
          }
          assert.equal(options.method, 'GET');
          return Response.json(
            url.includes('branch-policies')
              ? {
                  total_count: 1,
                  branch_policies: [{ name: TARGET.branch, type: 'branch' }],
                }
              : {
                  name: TARGET.environment,
                  protection_rules: patch.syntheticMissingReviewer
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
            GITHUB_ACTIONS: 'true',
            GITHUB_REPOSITORY: TARGET.repository,
            GITHUB_REF: 'refs/heads/' + TARGET.branch,
            GITHUB_WORKFLOW: TARGET.workflow,
            GITHUB_EVENT_NAME: 'workflow_dispatch',
            GITHUB_RUN_ATTEMPT: '1',
            GITHUB_SHA: openSha,
            GITHUB_RUN_ID: '987654321',
            GH_TOKEN: 'synthetic',
            CLOUDFLARE_API_TOKEN: 'SYNTHETIC_TOKEN_LONG_ENOUGH_FOR_TEST',
            REPORTS_SETUP_ENVIRONMENT: TARGET.environment,
            REPORTS_SETUP_OPERATION: operation,
            REPORTS_SETUP_CONFIRMATION: CONFIRMATIONS[operation],
            ...patch,
          },
          fetcher,
          'run',
        );
        const result = JSON.parse(
          await readFile('closed-setup-receipt.json', 'utf8'),
        );
        assert.equal(result.ok, false);
        assert.equal(cloudflare, 0);
        assert.equal(result.intakeEnabled, false);
        assert.equal(JSON.stringify(result).includes('SYNTHETIC_TOKEN'), false);
      }
    }
  } finally {
    console.log = oldLog;
    process.exitCode = oldExit;
    if (previous) await writeFile('closed-setup-receipt.json', previous);
    else await rm('closed-setup-receipt.json', { force: true });
  }
});
