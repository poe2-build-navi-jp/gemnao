// Existing resources, reviewed bytes, unchanged configuration. No data-plane calls.
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import {
  TARGET,
  FLAGS,
  SetupFailure,
  client,
  context,
  packageArtifact,
  verifyArtifact,
} from './closed-setup.mjs';
import {
  normalized,
  managedBaseline,
  productionAnchor,
  verifyManagedDeployment,
} from './managed-config.mjs';
export const RELEASE = Object.freeze({
  codeSha: '9afbc63211a16c7e3584fe261c6b27dec26999a1',
  databaseId: '3141aae6-8dc9-47e9-a8a2-7a05f642f94f',
  namespaceId: '54f03069afc249779996d92530e835e1',
  instanceId: 'c3cdfc3f-6ba1-495e-b3fd-a377b610b25e',
  deploymentId: 'a7ed93fa-b823-40a0-a8e6-6e0198dd8337',
  deployedSha: 'fa5f0f5904423aff596b671ad7b3c187c8acefc6',
});
export const OPERATION = 'deploy-code-only';
export const confirmation = (sha) => 'DEPLOY_REPORTS_CODE_ONLY:' + sha;
const need = (ok, code) => {
  if (!ok) throw new SetupFailure(code);
};
export const hash = (value) => createHash('sha256').update(value).digest('hex');
const operationalFiles = [
  '.github/workflows/community-reports-closed-setup.yml',
  'ops/community-reports/closed-setup.mjs',
  'ops/community-reports/code-deploy.mjs',
  'tests/community-reports/code-deploy.test.mjs',
  'docs/community-reports-code-deploy-2026-10-17.md',
];
export function verifyCodeContext(env) {
  context(env);
  need(
    env.REPORTS_SETUP_OPERATION === OPERATION &&
      env.REPORTS_SETUP_SOURCE_SHA === env.GITHUB_SHA &&
      env.REPORTS_SETUP_CONFIRMATION === confirmation(env.GITHUB_SHA),
    'CODE_EXACT_SOURCE_AND_CONFIRMATION_REQUIRED',
  );
}
export async function verifyCodeSource(env) {
  verifyCodeContext(env);
  const git = (...args) =>
    execFileSync('git', args, { encoding: 'utf8' }).trim();
  need(
    git('rev-parse', 'HEAD') === env.GITHUB_SHA,
    'CODE_CHECKOUT_SHA_MISMATCH',
  );
  try {
    git('merge-base', '--is-ancestor', RELEASE.codeSha, 'HEAD');
  } catch {
    throw new SetupFailure('CODE_BASE_NOT_ANCESTOR');
  }
  const changed = git('diff', '--name-only', RELEASE.codeSha, 'HEAD')
    .split('\n')
    .filter(Boolean);
  need(
    changed.every((path) => operationalFiles.includes(path)),
    'CODE_OUTSIDE_REVIEWED_RELEASE',
  );
  const dirty = git('diff', '--name-only', 'HEAD').split('\n').filter(Boolean);
  // The standard build removes the tracked empty output placeholder only.
  need(
    dirty.every((path) => path === 'dist/client/.gitkeep'),
    'CODE_DIRTY_SOURCE',
  );
  const untracked = git('ls-files', '--others', '--exclude-standard')
    .split('\n')
    .filter(Boolean);
  need(untracked.length === 0, 'CODE_UNTRACKED_SOURCE');
  const config = JSON.parse(await readFile('wrangler.json', 'utf8'));
  need(
    FLAGS.every((flag) => config.vars?.[flag] === 'false') &&
      config.vars.REPORTS_GUARD_INSTANCE === RELEASE.instanceId &&
      !config.vars.REPORTS_BUDGET_MODE,
    'CODE_SOURCE_MUST_REMAIN_CLOSED',
  );
  return config;
}
export async function packageCodeArtifact(directory, sourceSha, env) {
  need(sourceSha === env.GITHUB_SHA, 'CODE_ARTIFACT_SHA_MISMATCH');
  return packageArtifact(directory, sourceSha, () => verifyCodeSource(env));
}
const settingsKeys = [
  'compatibility_date',
  'compatibility_flags',
  'usage_model',
  'limits',
  'observability',
  'logpush',
  'tail_consumers',
  'tags',
  'placement',
  'cache_options',
];
export function settingsProjection(s) {
  return Object.fromEntries(
    settingsKeys.filter((k) => Object.hasOwn(s, k)).map((k) => [k, s[k]]),
  );
}
export function validateSettings(name, s) {
  need(
    s &&
      Array.isArray(s.bindings) &&
      /^\d{4}-\d{2}-\d{2}$/.test(s.compatibility_date || ''),
    'CODE_SETTINGS_REQUIRED',
  );
  need(
    !Object.entries(s.annotations || {}).some(
      ([key, value]) =>
        key !== 'workers/triggered_by' && value !== '' && value != null,
    ),
    'CODE_ANNOTATIONS_REQUIRE_REVIEW',
  );
  need(
    !s.assets && !s.containers && !s.exports && !s.dispatch_namespace,
    'CODE_UNREVIEWED_WORKER_SETTINGS',
  );
  const bindings = s.bindings;
  if (name === TARGET.guard) {
    need(
      bindings.length === 1 &&
        bindings[0].type === 'durable_object_namespace' &&
        bindings[0].name === 'GUARD' &&
        bindings[0].class_name === 'CommunityReportLedger' &&
        bindings[0].namespace_id === RELEASE.namespaceId &&
        !bindings[0].script_name,
      'CODE_GUARD_IDENTITY',
    );
  } else {
    need(
      name === TARGET.cleanup &&
        bindings.length === FLAGS.length + 3 &&
        new Set(bindings.map((b) => b.name)).size === bindings.length,
      'CODE_CLEANUP_BINDING_SET',
    );
    for (const flag of FLAGS)
      need(
        bindings.some(
          (b) =>
            b.type === 'plain_text' && b.name === flag && b.text === 'false',
        ),
        'CODE_CLEANUP_FLAGS',
      );
    need(
      bindings.some(
        (b) =>
          b.type === 'plain_text' &&
          b.name === 'REPORTS_GUARD_INSTANCE' &&
          b.text === RELEASE.instanceId,
      ) &&
        bindings.some(
          (b) =>
            b.type === 'd1' &&
            b.name === 'REPORTS_DB' &&
            b.id === RELEASE.databaseId,
        ) &&
        bindings.some(
          (b) =>
            b.type === 'service' &&
            b.name === 'REPORTS_GUARD' &&
            b.service === TARGET.guard &&
            b.entrypoint === 'ReportsGuardService' &&
            (!b.environment || b.environment === 'production'),
        ),
      'CODE_CLEANUP_IDENTITY',
    );
  }
  return s;
}
export function uploadMetadata(name, settings) {
  validateSettings(name, settings);
  // Provider retains these existing types. No binding values, secrets, migrations,
  // new classes, tags, namespaces, schedules or URLs are created/changed here.
  return {
    main_module: 'worker.mjs',
    ...settingsProjection(settings),
    bindings: [],
    keep_bindings:
      name === TARGET.guard
        ? ['durable_object_namespace']
        : ['d1', 'service', 'plain_text'],
  };
}
export function codeClient(token, uploads, fetcher = fetch) {
  const raw = client(token, fetcher, RELEASE.databaseId);
  const attempted = new Set();
  let stopped = false;
  return async (method, path, body, label) => {
    if (method === 'GET') {
      need(
        body === undefined &&
          (path === '/pages/projects/gemnao' ||
            /^\/pages\/projects\/gemnao\/deployments\/[a-f0-9-]{36}$/.test(
              path,
            ) ||
            path === '/d1/database/' + RELEASE.databaseId ||
            path === '/workers/scripts' ||
            /^\/workers\/scripts\/gemnao-community-reports-(guard|cleanup)\/(settings|subdomain|schedules)$/.test(
              path,
            )),
        'CODE_READ_OUTSIDE_SCOPE',
      );
    } else {
      const name = path.slice('/workers/scripts/'.length),
        expected = uploads[name];
      need(
        !stopped &&
          method === 'PUT' &&
          path === '/workers/scripts/' + name &&
          expected &&
          !attempted.has(name),
        'CODE_WRITE_OUTSIDE_SCOPE_OR_RETRY',
      );
      need(
        body instanceof FormData &&
          normalized([...body.keys()].sort()) ===
            normalized(['metadata', 'worker.mjs']),
        'CODE_UPLOAD_PARTS',
      );
      const meta = body.get('metadata'),
        code = body.get('worker.mjs');
      need(
        meta instanceof Blob &&
          code instanceof Blob &&
          code.name === 'worker.mjs' &&
          normalized(JSON.parse(await meta.text())) ===
            normalized(expected.metadata) &&
          hash(Buffer.from(await code.arrayBuffer())) === expected.hash,
        'CODE_UPLOAD_BYTES_OR_METADATA',
      );
      attempted.add(name); // A lost acknowledgement is not retried.
    }
    try {
      return await raw(method, path, body, label);
    } catch (error) {
      stopped = true;
      throw error;
    }
  };
}
async function readState(api, config) {
  const get = async (path) =>
    (await api('GET', path, undefined, 'CODE_READ')).result;
  const project = await get('/pages/projects/gemnao');
  need(
    project?.name === TARGET.pages &&
      project.production_branch === TARGET.branch,
    'CODE_PAGES_IDENTITY',
  );
  const anchor = productionAnchor(
    project,
    await get(
      '/pages/projects/gemnao/deployments/' + project.canonical_deployment?.id,
    ),
  );
  const baseline = managedBaseline(project, config);
  const db = await get('/d1/database/' + RELEASE.databaseId);
  need(
    db?.uuid === RELEASE.databaseId && db.name === TARGET.database,
    'CODE_D1_IDENTITY',
  );
  const scripts = await get('/workers/scripts');
  need(Array.isArray(scripts), 'CODE_WORKER_INVENTORY');
  const workers = {};
  for (const name of [TARGET.guard, TARGET.cleanup]) {
    const matches = scripts.filter((s) => s.id === name);
    need(
      matches.length === 1 &&
        typeof matches[0].etag === 'string' &&
        matches[0].etag.length > 0,
      'CODE_EXISTING_WORKER_REQUIRED',
    );
    if (name === TARGET.guard)
      need(matches[0].migration_tag === 'v1', 'CODE_GUARD_MIGRATION_DRIFT');
    const settings = validateSettings(
      name,
      await get('/workers/scripts/' + name + '/settings'),
    );
    const urls = await get('/workers/scripts/' + name + '/subdomain');
    const cron = await get('/workers/scripts/' + name + '/schedules');
    need(
      urls?.enabled === false &&
        urls.previews_enabled === false &&
        Array.isArray(cron?.schedules) &&
        cron.schedules.length === 0,
      'CODE_URL_OR_CRON_NOT_CLOSED',
    );
    workers[name] = {
      settings,
      etag: matches[0].etag,
      migrationTag: matches[0].migration_tag ?? null,
    };
  }
  return { project, anchor, baseline, workers };
}
const comparableSettings = (s) => ({
  ...settingsProjection(s),
  bindings: s.bindings,
});
function sameConfig(before, after) {
  need(
    normalized(before.project.deployment_configs) ===
      normalized(after.project.deployment_configs) &&
      normalized(before.project.build_config) ===
        normalized(after.project.build_config) &&
      normalized(before.anchor) === normalized(after.anchor),
    'CODE_CONCURRENT_PAGES_CHANGE',
  );
  for (const name of [TARGET.guard, TARGET.cleanup])
    need(
      normalized(comparableSettings(before.workers[name].settings)) ===
        normalized(comparableSettings(after.workers[name].settings)) &&
        before.workers[name].migrationTag === after.workers[name].migrationTag,
      'CODE_WORKER_SETTINGS_CHANGED',
    );
}
export async function deployCodeOnly(
  apiFactory,
  config,
  bytes,
  receipt,
  uploader,
  persist = async () => {},
) {
  need(
    FLAGS.every((flag) => config.vars?.[flag] === 'false') &&
      config.vars.REPORTS_GUARD_INSTANCE === RELEASE.instanceId &&
      !config.vars.REPORTS_BUDGET_MODE,
    'CODE_CLOSED_CONFIG_REQUIRED',
  );
  // No write authorizations are handed to the API client before fixed reads pass.
  const before = await readState(apiFactory({}), config);
  need(
    before.anchor.deploymentId === RELEASE.deploymentId &&
      before.anchor.sourceSha === RELEASE.deployedSha,
    'CODE_PRODUCTION_ANCHOR_CHANGED',
  );
  const uploads = Object.fromEntries(
    [
      ['guard', TARGET.guard],
      ['cleanup', TARGET.cleanup],
    ].map(([key, name]) => [
      name,
      {
        metadata: uploadMetadata(name, before.workers[name].settings),
        hash: hash(bytes[key]),
      },
    ]),
  );
  const api = apiFactory(uploads);
  const current = await readState(api, config);
  sameConfig(before, current);
  need(
    Object.keys(uploads).every(
      (name) => before.workers[name].etag === current.workers[name].etag,
    ),
    'CODE_CONCURRENT_WORKER_CHANGE',
  );
  Object.assign(receipt, {
    codeBaseSha: RELEASE.codeSha,
    instanceId: RELEASE.instanceId,
    databaseId: RELEASE.databaseId,
    guardNamespaceId: RELEASE.namespaceId,
    recovery: {
      ...before.anchor,
      productionConfigSha256: before.baseline.productionConfigSha256,
    },
    workerHashes: Object.fromEntries(
      Object.entries(uploads).map(([n, u]) => [n, u.hash]),
    ),
    nextWrite: null,
  });
  let prior = current;
  for (const [key, name] of [
    ['guard', TARGET.guard],
    ['cleanup', TARGET.cleanup],
  ]) {
    const checked = await readState(api, config);
    sameConfig(before, checked);
    need(
      Object.keys(uploads).every(
        (n) => prior.workers[n].etag === checked.workers[n].etag,
      ),
      'CODE_CONCURRENT_WORKER_CHANGE',
    );
    const body = new FormData();
    body.set(
      'metadata',
      new Blob([JSON.stringify(uploads[name].metadata)], {
        type: 'application/json',
      }),
    );
    body.set(
      'worker.mjs',
      new Blob([bytes[key]], { type: 'application/javascript+module' }),
      'worker.mjs',
    );
    receipt.nextWrite = 'upload-code:' + name;
    await persist();
    await api('PUT', '/workers/scripts/' + name, body, 'CODE_UPLOAD');
    receipt.completed.push('code-upload:' + name);
    receipt.nextWrite = null;
    await persist();
    const after = await readState(api, config);
    sameConfig(before, after);
    need(
      Object.keys(uploads)
        .filter((n) => n !== name)
        .every((n) => prior.workers[n].etag === after.workers[n].etag),
      'CODE_OTHER_WORKER_CHANGED',
    );
    prior = after;
  }
  receipt.nextWrite = 'pages-code-upload';
  await persist();
  await uploader(config);
  receipt.completed.push('pages-code-upload');
  receipt.nextWrite = null;
  await persist();
  const after = await readState(api, config);
  verifyManagedDeployment(before.project, after.project, config, TARGET);
  need(
    after.anchor.sourceSha === receipt.sourceSha,
    'CODE_PAGES_SOURCE_MISMATCH',
  );
  for (const name of Object.keys(uploads))
    need(
      normalized(comparableSettings(before.workers[name].settings)) ===
        normalized(comparableSettings(after.workers[name].settings)) &&
        prior.workers[name].etag === after.workers[name].etag &&
        before.workers[name].migrationTag === after.workers[name].migrationTag,
      'CODE_FINAL_WORKER_DRIFT',
    );
  Object.assign(receipt, {
    deployment: after.anchor,
    settingsVerified: true,
    generalReportingUiIncluded: true,
    intakeEnabled: false,
    bootstrapAllowed: false,
    cronStarted: false,
    cleanupExecuted: false,
    budgetModeEnabled: false,
  });
  await persist();
}
export async function runCodeDeployment(
  env,
  receipt,
  uploader,
  persist,
  fetcher = fetch,
) {
  const config = await verifyCodeSource(env);
  await verifyArtifact(
    env.REPORTS_ARTIFACT_DIR,
    env.REPORTS_ARTIFACT_DIGEST,
    env.GITHUB_SHA,
  );
  const bytes = {
    guard: await readFile(join(env.REPORTS_ARTIFACT_DIR, 'workers/guard.mjs')),
    cleanup: await readFile(
      join(env.REPORTS_ARTIFACT_DIR, 'workers/cleanup.mjs'),
    ),
  };
  return deployCodeOnly(
    (uploads) => codeClient(env.CLOUDFLARE_API_TOKEN, uploads, fetcher),
    config,
    bytes,
    receipt,
    uploader,
    persist,
  );
}
