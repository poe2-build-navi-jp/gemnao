import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import {
  readFile,
  writeFile,
  mkdtemp,
  rm,
  symlink,
  copyFile,
  mkdir,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import {
  main,
  TARGET,
  verifySource,
  safeFailure,
} from '../../ops/community-reports/closed-setup.mjs';
import { configProjection } from '../../ops/community-reports/managed-config.mjs';
import {
  RESUME,
  cleanupMetadata,
  cleanupClient,
  resumeCleanup,
  verifyCleanupArtifact,
} from '../../ops/community-reports/cleanup-resume.mjs';
const hash = (value) => createHash('sha256').update(value).digest('hex');
const bytes = Buffer.from(
  'export default {fetch(){return new Response("Not found",{status:404})}}',
);
const artifact = { bytes, codeSha256: hash(bytes) };
const baseline = JSON.parse(
  execFileSync('git', ['show', TARGET.base + ':wrangler.json'], {
    encoding: 'utf8',
  }),
);
const envelope = (result) => ({ success: true, errors: [], result });
const receipt = () => ({
  sourceSha: 'a'.repeat(40),
  runId: '987654321',
  completed: [],
  intakeEnabled: false,
});
function fixture(options = {}) {
  const { vars, ...bindings } = configProjection(baseline);
  const project = {
    name: TARGET.pages,
    production_branch: TARGET.branch,
    canonical_deployment: { id: RESUME.recovery.deploymentId },
    build_config: {
      destination_dir: 'dist/client',
      build_command: 'pnpm build',
    },
    deployment_configs: {
      production: {
        ...bindings,
        wrangler_config_hash: 'synthetic-managed',
        env_vars: {
          ...Object.fromEntries(
            Object.entries(vars).map(([name, value]) => [
              name,
              { type: 'plain_text', value },
            ]),
          ),
          EXISTING_SECRET: {
            type: 'secret_text',
            value: 'SYNTHETIC_DO_NOT_LOG',
          },
        },
      },
      preview: { d1_databases: {}, env_vars: {} },
    },
  };
  const calls = [],
    checkpoints = [];
  let created = false,
    disabled = false,
    lists = 0;
  const fetcher = async (url, request) => {
    const path = url.slice(
      url.indexOf('/accounts/' + TARGET.account) +
        ('/accounts/' + TARGET.account).length,
    );
    const call = {
      method: request.method,
      path,
      headers: request.headers,
      body: request.body,
    };
    calls.push(call);
    if (request.method === 'PUT') {
      assert.equal(path, '/workers/scripts/' + TARGET.cleanup);
      assert.equal(new Headers(request.headers).get('If-None-Match'), '*');
      if (options.uploadUncertain) throw Error('SYNTHETIC_DO_NOT_LOG');
      if (options.uploadStatus)
        return new Response('SYNTHETIC_DO_NOT_LOG', {
          status: options.uploadStatus,
        });
      created = true;
      return Response.json(
        envelope({ id: options.badUploadIdentity ? 'other' : TARGET.cleanup }),
      );
    }
    if (request.method === 'POST') {
      assert.equal(path, '/workers/scripts/' + TARGET.cleanup + '/subdomain');
      assert.equal(created, true);
      assert.deepEqual(JSON.parse(request.body), {
        enabled: false,
        previews_enabled: false,
      });
      if (options.disableStatus)
        return new Response('SYNTHETIC_DO_NOT_LOG', {
          status: options.disableStatus,
        });
      disabled = true;
      return Response.json(
        envelope({ enabled: false, previews_enabled: false }),
      );
    }
    assert.equal(request.method, 'GET');
    if (path === '/d1/database/' + RESUME.databaseId)
      return Response.json(
        envelope({
          uuid: options.wrongDatabase ? '1'.repeat(36) : RESUME.databaseId,
          name: TARGET.database,
        }),
      );
    if (path === '/workers/scripts') {
      lists++;
      return Response.json(
        envelope([
          ...(options.noGuard ? [] : [{ id: TARGET.guard }]),
          ...(created || options.cleanupExists || (options.race && lists >= 2)
            ? [{ id: TARGET.cleanup }]
            : []),
        ]),
      );
    }
    const guard = path.includes(TARGET.guard + '/');
    if (path.endsWith('/settings'))
      return Response.json(
        envelope({
          bindings: guard
            ? [
                {
                  type: 'durable_object_namespace',
                  name: 'GUARD',
                  class_name: 'CommunityReportLedger',
                  namespace_id: options.wrongNamespace
                    ? 'f'.repeat(32)
                    : RESUME.guardNamespaceId,
                },
              ]
            : cleanupMetadata().bindings.map((binding) =>
                options.cleanupFlagOpen && binding.name === 'REPORTS_ENABLED'
                  ? { ...binding, text: 'true' }
                  : binding,
              ),
        }),
      );
    if (path.endsWith('/subdomain'))
      return Response.json(
        envelope({
          enabled: guard
            ? !!options.guardPublic
            : !disabled || !!options.cleanupPublic,
          previews_enabled: guard
            ? !!options.guardPreview
            : !disabled || !!options.cleanupPreview,
        }),
      );
    if (path.endsWith('/schedules'))
      return Response.json(
        envelope({
          schedules: (guard ? options.guardCron : options.cleanupCron)
            ? [{ cron: '*/15 * * * *' }]
            : [],
        }),
      );
    if (path === '/pages/projects/gemnao') {
      const result = structuredClone(project);
      if (created && options.previewAfterUpload)
        result.deployment_configs.preview = { changed: true };
      if (created && options.secretAfterUpload)
        result.deployment_configs.production.env_vars.EXISTING_SECRET = {
          type: 'secret_text',
          value: 'SYNTHETIC_CHANGED_DO_NOT_LOG',
        };
      if (options.pagesFlagOpen || (created && options.pagesFlagAfterUpload))
        result.deployment_configs.production.env_vars.REPORTS_ENABLED = {
          type: 'plain_text',
          value: 'true',
        };
      return Response.json(envelope(result));
    }
    if (path.startsWith('/pages/projects/gemnao/deployments/'))
      return Response.json(
        envelope({
          id: RESUME.recovery.deploymentId,
          environment: 'production',
          latest_stage: { name: 'deploy', status: 'success' },
          deployment_trigger: {
            metadata: {
              commit_hash: options.wrongRecovery
                ? 'b'.repeat(40)
                : RESUME.recovery.sourceSha,
            },
          },
        }),
      );
    assert.fail('Unexpected synthetic request: ' + path);
  };
  return {
    api: cleanupClient('s'.repeat(30), artifact.codeSha256, fetcher),
    fetcher,
    calls,
    checkpoints,
    persist: async (value) => checkpoints.push(structuredClone(value)),
  };
}
const writes = (f) => f.calls.filter((call) => call.method !== 'GET');

await test('cleanup-only resume preserves D1, guard namespace and Pages; exactly two bounded cleanup writes and no cron', async () => {
  const f = fixture(),
    result = receipt();
  await resumeCleanup(f.api, baseline, artifact, result, () =>
    f.persist(result),
  );
  assert.deepEqual(
    writes(f).map(({ method, path }) => ({ method, path })),
    [
      { method: 'PUT', path: '/workers/scripts/' + TARGET.cleanup },
      {
        method: 'POST',
        path: '/workers/scripts/' + TARGET.cleanup + '/subdomain',
      },
    ],
  );
  const form = writes(f)[0].body;
  const metadata = JSON.parse(await form.get('metadata').text());
  assert.deepEqual(metadata, cleanupMetadata());
  assert.ok(!('migrations' in metadata));
  assert.ok(!('schedules' in metadata));
  assert.equal(result.resourceRecord.databaseId, RESUME.databaseId);
  assert.equal(result.resourceRecord.guardNamespaceId, RESUME.guardNamespaceId);
  assert.equal(result.readbackAfter.pages.intakeClosed, true);
  assert.equal(result.readbackAfter.workers[TARGET.cleanup].cron.empty, true);
  assert.equal(
    result.readbackAfter.workers[TARGET.cleanup].publicUrls.enabled,
    false,
  );
  assert.equal(result.pagesChanged, false);
  assert.equal(result.intakeEnabled, false);
  assert.equal(result.completed.at(-1), 'cleanup-closed-readback-verified');
  assert.ok(
    f.checkpoints.some(
      (checkpoint) =>
        checkpoint.completed.includes('cleanup-upload-requested') &&
        !checkpoint.completed.includes('cleanup-uploaded'),
    ),
  );
  assert.ok(!JSON.stringify(result).includes('SYNTHETIC_DO_NOT_LOG'));
});

await test('drift, existing cleanup or an absence-check race stops before every write', async () => {
  for (const options of [
    { cleanupExists: true },
    { race: true },
    { wrongNamespace: true },
    { noGuard: true },
    { wrongDatabase: true },
    { guardPublic: true },
    { guardPreview: true },
    { guardCron: true },
    { pagesFlagOpen: true },
    { wrongRecovery: true },
  ]) {
    const f = fixture(options),
      result = receipt();
    await assert.rejects(resumeCleanup(f.api, baseline, artifact, result));
    assert.equal(writes(f).length, 0);
    assert.equal(result.resourceRecord, undefined);
  }
});

await test('uncertain upload, 412 race rejection, wrong identity and 405 URL failure never retry or invoke other mutations', async () => {
  for (const options of [
    { uploadUncertain: true },
    { uploadStatus: 412 },
    { badUploadIdentity: true },
    { disableStatus: 405 },
  ]) {
    const f = fixture(options),
      result = receipt();
    try {
      await resumeCleanup(f.api, baseline, artifact, result, () =>
        f.persist(result),
      );
      assert.fail('expected stop');
    } catch (error) {
      assert.ok(
        !JSON.stringify(safeFailure(error)).includes('SYNTHETIC_DO_NOT_LOG'),
      );
    }
    assert.equal(writes(f).filter((call) => call.method === 'PUT').length, 1);
    assert.equal(
      writes(f).filter((call) => call.method === 'POST').length,
      options.disableStatus ? 1 : 0,
    );
    assert.equal(result.resourceRecord, undefined);
    assert.ok(
      f.checkpoints.at(-1).completed.includes('cleanup-upload-requested'),
    );
    await assert.rejects(
      f.api(
        'POST',
        '/workers/scripts/' + TARGET.cleanup + '/subdomain',
        { enabled: false, previews_enabled: false },
        'RETRY',
      ),
      /CLEANUP_WRITES_STOPPED/,
    );
  }
});

await test('post-create URLs, cron, flags or Pages drift never yield a completed resource record or automatic repair', async () => {
  for (const options of [
    { cleanupPublic: true },
    { cleanupPreview: true },
    { cleanupCron: true },
    { cleanupFlagOpen: true },
    { pagesFlagAfterUpload: true },
    { previewAfterUpload: true },
    { secretAfterUpload: true },
  ]) {
    const f = fixture(options),
      result = receipt();
    await assert.rejects(resumeCleanup(f.api, baseline, artifact, result));
    assert.equal(writes(f).length, 2);
    assert.equal(result.resourceRecord, undefined);
    assert.ok(!result.completed.includes('cleanup-closed-readback-verified'));
    assert.ok(result.readbackAfter);
  }
});

function uploadForm(metadata = cleanupMetadata(), code = bytes) {
  const form = new FormData();
  form.set('metadata', new Blob([JSON.stringify(metadata)]));
  form.set('worker.mjs', new Blob([code]), 'worker.mjs');
  return form;
}
await test('transport prohibits D1/guard/Pages/schedules, token APIs, deletion, enabled URLs, schema, migration and mismatched bindings', async () => {
  let count = 0;
  const api = cleanupClient('s'.repeat(30), artifact.codeSha256, async () => {
    count++;
    assert.fail('network forbidden');
  });
  for (const [method, path, body] of [
    ['POST', '/d1/database', { name: TARGET.database }],
    [
      'POST',
      '/d1/database/' + RESUME.databaseId + '/query',
      { sql: 'SELECT 1', params: [] },
    ],
    ['PUT', '/workers/scripts/' + TARGET.guard, uploadForm()],
    [
      'POST',
      '/workers/scripts/' + TARGET.guard + '/subdomain',
      { enabled: false, previews_enabled: false },
    ],
    ['PUT', '/workers/scripts/' + TARGET.cleanup + '/schedules', {}],
    ['PATCH', '/pages/projects/gemnao', {}],
    ['DELETE', '/workers/scripts/' + TARGET.cleanup, undefined],
    ['GET', '/tokens', undefined],
    ['GET', '/d1/database/11111111-1111-4111-8111-111111111111', undefined],
  ])
    await assert.rejects(api(method, path, body, 'FORBIDDEN'));
  for (const metadata of [
    { ...cleanupMetadata(), migrations: { new_tag: 'v2' } },
    { ...cleanupMetadata(), bindings: [] },
    { ...cleanupMetadata(), schedules: ['*/15 * * * *'] },
    {
      ...cleanupMetadata(),
      bindings: cleanupMetadata().bindings.map((binding) =>
        binding.name === 'REPORTS_ENABLED'
          ? { ...binding, text: 'true' }
          : binding,
      ),
    },
  ])
    await assert.rejects(
      api(
        'PUT',
        '/workers/scripts/' + TARGET.cleanup,
        uploadForm(metadata),
        'FORBIDDEN',
      ),
    );
  await assert.rejects(
    api(
      'PUT',
      '/workers/scripts/' + TARGET.cleanup,
      uploadForm(cleanupMetadata(), Buffer.from('different')),
      'FORBIDDEN',
    ),
  );
  await assert.rejects(
    api(
      'POST',
      '/workers/scripts/' + TARGET.cleanup + '/subdomain',
      { enabled: true, previews_enabled: true },
      'FORBIDDEN',
    ),
  );
  assert.equal(count, 0);
});

await test('transport consumes each write once, rejects unsafe URL body after upload, and never repeats a successful upload', async () => {
  const f = fixture();
  await f.api(
    'PUT',
    '/workers/scripts/' + TARGET.cleanup,
    uploadForm(),
    'UPLOAD',
  );
  await assert.rejects(
    f.api('PUT', '/workers/scripts/' + TARGET.cleanup, uploadForm(), 'UPLOAD'),
    /CLEANUP_UPLOAD_ONCE_ONLY/,
  );
  for (const body of [
    { enabled: true, previews_enabled: false },
    { enabled: false, previews_enabled: true },
    { enabled: false },
    { enabled: false, previews_enabled: false, extra: true },
  ])
    await assert.rejects(
      f.api(
        'POST',
        '/workers/scripts/' + TARGET.cleanup + '/subdomain',
        body,
        'URLS',
      ),
      /CLEANUP_DISABLE_ONCE_ONLY/,
    );
  await f.api(
    'POST',
    '/workers/scripts/' + TARGET.cleanup + '/subdomain',
    { enabled: false, previews_enabled: false },
    'URLS',
  );
  await assert.rejects(
    f.api(
      'POST',
      '/workers/scripts/' + TARGET.cleanup + '/subdomain',
      { enabled: false, previews_enabled: false },
      'URLS',
    ),
    /CLEANUP_DISABLE_ONCE_ONLY/,
  );
  assert.equal(writes(f).length, 2);
});

async function withArtifact(callback) {
  const directory = await mkdtemp(join(tmpdir(), 'cleanup-artifact-'));
  try {
    await writeFile(join(directory, 'cleanup.mjs'), bytes);
    const manifest = JSON.stringify({
      sourceSha: 'a'.repeat(40),
      scopeBase: TARGET.scopeBase,
      readbackRunId: RESUME.readbackRunId,
      metadata: cleanupMetadata(),
      codeSha256: artifact.codeSha256,
    });
    await writeFile(join(directory, 'manifest.json'), manifest);
    await callback(directory, hash(manifest), manifest);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}
await test('artifact verifies exact source, digest, cleanup bytes and fixed bindings, refusing extra files or symlinks', async () => {
  await withArtifact(async (directory, digest, manifest) => {
    assert.deepEqual(
      (await verifyCleanupArtifact(directory, digest, 'a'.repeat(40))).bytes,
      bytes,
    );
    await assert.rejects(
      verifyCleanupArtifact(directory, '0'.repeat(64), 'a'.repeat(40)),
    );
    await assert.rejects(
      verifyCleanupArtifact(directory, digest, 'b'.repeat(40)),
    );
    await writeFile(join(directory, 'cleanup.mjs'), 'changed');
    await assert.rejects(
      verifyCleanupArtifact(directory, digest, 'a'.repeat(40)),
      /CLEANUP_ARTIFACT_BYTES/,
    );
    await writeFile(join(directory, 'cleanup.mjs'), bytes);
    await writeFile(join(directory, 'schema.sql'), 'synthetic');
    await assert.rejects(
      verifyCleanupArtifact(directory, digest, 'a'.repeat(40)),
      /CLEANUP_ARTIFACT_FILE_SET/,
    );
    await rm(join(directory, 'schema.sql'));
    await rm(join(directory, 'cleanup.mjs'));
    await symlink(
      join(directory, 'manifest.json'),
      join(directory, 'cleanup.mjs'),
    );
    await assert.rejects(
      verifyCleanupArtifact(directory, digest, 'a'.repeat(40)),
      /CLEANUP_ARTIFACT_FILE_TYPE_OR_SIZE/,
    );
    assert.equal(
      hash(await readFile(join(directory, 'manifest.json'))),
      hash(manifest),
    );
  });
});

await test('source scope accepts published articles as baseline but rejects new editorial changes, untracked files, runtime hash drift or a different base', async () => {
  await verifySource();
  const directory = await mkdtemp(join(tmpdir(), 'cleanup-scope-'));
  try {
    execFileSync('git', [
      '-c',
      'advice.detachedHead=false',
      'clone',
      '--quiet',
      '--shared',
      '--no-hardlinks',
      process.cwd(),
      directory,
    ]);
    const paths = [
      'ops/community-reports/closed-setup.mjs',
      'ops/community-reports/closed-source.json',
      'ops/community-reports/cleanup-resume.mjs',
      'tests/community-reports/cleanup-resume.test.mjs',
      '.github/workflows/community-reports-closed-setup.yml',
    ];
    for (const path of paths) {
      await mkdir(dirname(join(directory, path)), { recursive: true });
      await copyFile(path, join(directory, path));
    }
    const verify = () =>
      execFileSync(
        process.execPath,
        [
          '--input-type=module',
          '-e',
          'import {verifySource} from "./ops/community-reports/closed-setup.mjs"; await verifySource();',
        ],
        { cwd: directory, stdio: 'pipe' },
      );
    verify();
    const marker = join(directory, 'dist/client/.gitkeep');
    await rm(marker);
    verify();
    await writeFile(marker, 'not-empty');
    assert.throws(verify, /BUILD_PLACEHOLDER_NOT_EMPTY/);
    await writeFile(marker, '');
    verify();
    const article = join(directory, 'lib/followups/ace-combat-hotas.ts'),
      original = await readFile(article);
    await writeFile(
      article,
      Buffer.concat([original, Buffer.from('\n// synthetic drift\n')]),
    );
    assert.throws(verify, /SOURCE_OUTSIDE_CLOSED_SCOPE/);
    await writeFile(article, original);
    await writeFile(join(directory, 'unreviewed-synthetic.txt'), 'not allowed');
    assert.throws(verify, /SOURCE_OUTSIDE_CLOSED_SCOPE/);
    await rm(join(directory, 'unreviewed-synthetic.txt'));
    const runtime = join(directory, 'cloudflare/community-reports-cleanup.ts'),
      runtimeBytes = await readFile(runtime);
    await writeFile(
      runtime,
      Buffer.concat([runtimeBytes, Buffer.from('\n// synthetic hash drift\n')]),
    );
    assert.throws(verify, /REVIEWED_SOURCE_HASH_MISMATCH/);
    await writeFile(runtime, runtimeBytes);
    const specificationPath = join(
      directory,
      'ops/community-reports/closed-source.json',
    );
    const specification = JSON.parse(await readFile(specificationPath));
    specification.scopeBase = TARGET.base;
    await writeFile(specificationPath, JSON.stringify(specification));
    assert.throws(verify, /REVIEWED_SCOPE_BASE_REQUIRED/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

await test('resume entry point requires exact confirmation, existing reviewer, protected environment and first attempt before any Cloudflare call', async () => {
  const previous = await readFile('closed-setup-receipt.json').catch(
    (error) => {
      if (error.code === 'ENOENT') return null;
      throw error;
    },
  );
  const oldExit = process.exitCode,
    oldLog = console.log;
  console.log = () => {};
  try {
    await withArtifact(async (directory, digest) => {
      for (const patch of [
        {},
        { REPORTS_SETUP_CONFIRMATION: 'SETUP_CLOSED_REPORTS_ONLY' },
        { REPORTS_SETUP_ENVIRONMENT: 'other' },
        { GITHUB_RUN_ATTEMPT: '2' },
        { syntheticMissingReviewer: true },
      ]) {
        await rm('closed-setup-receipt.json', { force: true });
        process.exitCode = 0;
        const f = fixture();
        const fetcher = async (url, options) => {
          if (url.startsWith('https://api.cloudflare.com/'))
            return f.fetcher(url, options);
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
            GITHUB_SHA: 'a'.repeat(40),
            GITHUB_RUN_ID: '987654321',
            GH_TOKEN: 'synthetic',
            CLOUDFLARE_API_TOKEN: 's'.repeat(30),
            REPORTS_SETUP_ENVIRONMENT: TARGET.environment,
            REPORTS_SETUP_OPERATION: 'resume-cleanup',
            REPORTS_SETUP_CONFIRMATION: 'CREATE_CLOSED_REPORTS_CLEANUP_ONLY',
            REPORTS_ARTIFACT_DIR: directory,
            REPORTS_ARTIFACT_DIGEST: digest,
            ...patch,
          },
          fetcher,
          'run',
        );
        const result = JSON.parse(await readFile('closed-setup-receipt.json'));
        if (Object.keys(patch).length) {
          assert.equal(result.ok, false);
          assert.equal(f.calls.length, 0);
        } else {
          assert.equal(result.ok, true);
          assert.equal(writes(f).length, 2);
        }
      }
    });
  } finally {
    console.log = oldLog;
    process.exitCode = oldExit;
    if (previous) await writeFile('closed-setup-receipt.json', previous);
    else await rm('closed-setup-receipt.json', { force: true });
  }
});
