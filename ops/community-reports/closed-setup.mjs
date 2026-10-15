// Fixed-target, owner-approved closed setup. No token/protection management,
// restore, cleanup invocation, user data mutation or activation operation.
import { createHash } from 'node:crypto';
import {
  readFile,
  writeFile,
  readdir,
  lstat,
  mkdir,
  cp,
  mkdtemp,
} from 'node:fs/promises';
import { execFileSync, execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
export const TARGET = Object.freeze({
  repository: 'poe2-build-navi-jp/gemnao',
  branch: 'gemunao',
  environment: 'gemnao-d1-production',
  workflow: 'Community reports closed setup',
  account: '6a09a32cba1288cccce5912015086a35',
  pages: 'gemnao',
  database: 'gemnao-community-reports-production',
  guard: 'gemnao-community-reports-guard',
  cleanup: 'gemnao-community-reports-cleanup',
  base: '3d2f8d9d57ca41614882841062e44950e0702d63',
  schemaHash:
    '35bc54bf504a175c8261bf603e01a781b95ce2b97967101c218e6a4de97f8bbb',
});
export const FLAGS = Object.freeze([
  'REPORTS_ENABLED',
  'REPORTS_PUBLIC_ENABLED',
  'REPORTS_REVIEW_ENABLED',
  'REPORTS_BUDGET_VERIFIED',
  'REPORTS_AUTO_OBSERVATION_ENABLED',
  'REPORTS_USAGE_PROFILE_VERIFIED',
  'REPORTS_PUBLIC_MONITOR_VERIFIED',
  'REPORTS_BOOTSTRAP_ALLOWED',
  'REPORTS_VERIFICATION_ALLOWED',
]);
const UUID = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
const sha = (value) => createHash('sha256').update(value).digest('hex');
const fixed = (condition, code) => {
  if (!condition) throw new SetupFailure(code);
};
export class SetupFailure extends Error {
  constructor(code, status = null) {
    super(code);
    this.status = status;
  }
}
export function safeFailure(error) {
  return {
    error: error instanceof SetupFailure ? error.message : 'SETUP_FAILED',
    httpStatus: error instanceof SetupFailure ? error.status : null,
  };
}
export function context(env) {
  fixed(
    env.GITHUB_ACTIONS === 'true' &&
      env.GITHUB_REPOSITORY === TARGET.repository &&
      env.GITHUB_REF === 'refs/heads/' + TARGET.branch &&
      env.GITHUB_WORKFLOW === TARGET.workflow &&
      env.GITHUB_EVENT_NAME === 'workflow_dispatch' &&
      env.GITHUB_RUN_ATTEMPT === '1' &&
      /^[a-f0-9]{40}$/.test(env.GITHUB_SHA || '') &&
      /^[1-9][0-9]*$/.test(env.GITHUB_RUN_ID || ''),
    'FIXED_MANUAL_CONTEXT_REQUIRED',
  );
}
async function jsonResponse(response, label) {
  if (!response.ok) {
    await response.body?.cancel();
    throw new SetupFailure(label + '_HTTP', response.status);
  }
  fixed(response.body, label + '_EMPTY');
  const reader = response.body.getReader(),
    parts = [];
  let size = 0;
  for (;;) {
    const part = await reader.read();
    if (part.done) break;
    size += part.value.byteLength;
    if (size > 2_000_000) {
      await reader.cancel();
      throw new SetupFailure(label + '_SIZE');
    }
    parts.push(part.value);
  }
  try {
    return JSON.parse(Buffer.concat(parts).toString('utf8'));
  } catch {
    throw new SetupFailure(label + '_JSON');
  }
}
export async function gate(env, fetcher = fetch) {
  context(env);
  fixed(env.GH_TOKEN, 'EXISTING_GITHUB_AUTH_REQUIRED');
  const base = `https://api.github.com/repos/${TARGET.repository}/environments/${TARGET.environment}`;
  const get = async (suffix) =>
    jsonResponse(
      await fetcher(base + suffix, {
        method: 'GET',
        redirect: 'error',
        signal: AbortSignal.timeout(10000),
        headers: {
          Authorization: 'Bearer ' + env.GH_TOKEN,
          Accept: 'application/vnd.github+json',
        },
      }),
      'ENVIRONMENT',
    );
  const e = await get(''),
    p = await get('/deployment-branch-policies?per_page=100');
  fixed(
    e.name === TARGET.environment &&
      e.protection_rules?.some(
        (rule) =>
          rule.type === 'required_reviewers' && rule.reviewers?.length > 0,
      ),
    'EXISTING_REVIEWER_REQUIRED',
  );
  fixed(
    e.deployment_branch_policy?.custom_branch_policies === true &&
      e.deployment_branch_policy?.protected_branches === false &&
      p.total_count === 1 &&
      p.branch_policies?.length === 1 &&
      p.branch_policies[0].name === TARGET.branch &&
      p.branch_policies[0].type === 'branch',
    'EXISTING_EXACT_BRANCH_REQUIRED',
  );
  return TARGET.environment;
}
export function client(token, fetcher = fetch) {
  fixed(
    typeof token === 'string' && /^[\x21-\x7e]{20,256}$/.test(token),
    'EXISTING_CLOUDFLARE_AUTH_REQUIRED',
  );
  const base = `https://api.cloudflare.com/client/v4/accounts/${TARGET.account}`;
  let createdId = null;
  const allowed = (method, path) => {
    if (method === 'GET')
      return (
        /^\/d1\/database\?per_page=100&page=1$/.test(path) ||
        path === '/workers/scripts' ||
        path === '/pages/projects/gemnao' ||
        /^\/d1\/database\/[a-f0-9-]{36}$/.test(path) ||
        /^\/workers\/scripts\/gemnao-community-reports-(guard|cleanup)\/(settings|subdomain|schedules)$/.test(
          path,
        )
      );
    if (method === 'POST')
      return (
        path === '/d1/database' ||
        /^\/d1\/database\/[a-f0-9-]{36}\/query$/.test(path)
      );
    if (method === 'PUT')
      return /^\/workers\/scripts\/gemnao-community-reports-(guard|cleanup)(\/subdomain)?$/.test(
        path,
      );
    return method === 'PATCH' && path === '/pages/projects/gemnao';
  };
  return async (method, path, body, label) => {
    fixed(allowed(method, path), 'REQUEST_OUTSIDE_FIXED_BOUNDARY');
    if (method === 'PATCH') {
      fixed(
        body &&
          normalized(Object.keys(body)) ===
            normalized(['deployment_configs']) &&
          normalized(Object.keys(body.deployment_configs || {})) ===
            normalized(['production']) &&
          normalized(
            Object.keys(body.deployment_configs.production || {}).sort(),
          ) === normalized(['d1_databases', 'services']),
        'ONLY_PRODUCTION_BINDING_ADDITIONS_ALLOWED',
      );
    }
    if (method === 'PUT' && path.endsWith('/subdomain'))
      fixed(
        normalized(body) ===
          normalized({ enabled: false, previews_enabled: false }),
        'PUBLIC_URL_ENABLE_FORBIDDEN',
      );
    if (path === '/d1/database' && method === 'POST')
      fixed(
        !createdId &&
          normalized(body) === normalized({ name: TARGET.database }),
        'FIXED_DATABASE_CREATE_REQUIRED',
      );
    const databasePath = path.match(
      /^\/d1\/database\/([a-f0-9-]{36})(\/query)?$/,
    );
    if (databasePath) {
      fixed(
        createdId && databasePath[1] === createdId,
        'ONLY_NEW_DATABASE_ALLOWED',
      );
      if (method === 'POST')
        fixed(
          body &&
            Array.isArray(body.params) &&
            body.params.length === 0 &&
            (sha(body.sql || '') === TARGET.schemaHash ||
              [
                "SELECT name FROM sqlite_schema WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_cf_%'",
                "SELECT value FROM community_operations WHERE key='total'",
              ].includes(body.sql)),
          'FIXED_SCHEMA_QUERIES_ONLY',
        );
    }
    let response;
    try {
      response = await fetcher(base + path, {
        method,
        redirect: 'error',
        signal: AbortSignal.timeout(30000),
        headers: {
          Authorization: 'Bearer ' + token,
          Accept: 'application/json',
          ...(body instanceof FormData
            ? {}
            : { 'Content-Type': 'application/json' }),
        },
        ...(body === undefined
          ? {}
          : { body: body instanceof FormData ? body : JSON.stringify(body) }),
      });
    } catch {
      throw new SetupFailure(label + '_REQUEST_UNCERTAIN');
    }
    const data = await jsonResponse(response, label);
    fixed(
      data.success === true &&
        Array.isArray(data.errors) &&
        data.errors.length === 0,
      label + '_PROVIDER_FAILURE',
    );
    if (method === 'POST' && path === '/d1/database') {
      fixed(
        UUID.test(data.result?.uuid || '') &&
          data.result?.name === TARGET.database,
        'NEW_D1_IDENTITY_MISMATCH',
      );
      createdId = data.result.uuid;
    }
    return data;
  };
}
export function checkProject(project, baseline) {
  fixed(
    project.name === TARGET.pages &&
      project.production_branch === TARGET.branch,
    'PAGES_IDENTITY_MISMATCH',
  );
  const production = project.deployment_configs?.production;
  fixed(
    production && project.deployment_configs?.preview,
    'PAGES_CONFIG_INCOMPLETE',
  );
  for (const db of baseline.d1_databases)
    fixed(
      production.d1_databases?.[db.binding]?.id === db.database_id,
      'EXISTING_D1_BINDING_MISMATCH',
    );
  for (const flag of FLAGS) {
    const variable = production.env_vars?.[flag];
    fixed(
      !variable ||
        (variable.type === 'plain_text' && variable.value === 'false'),
      'REPORT_FLAGS_NOT_CLOSED',
    );
  }
  fixed(
    !production.d1_databases?.REPORTS_DB &&
      !production.services?.REPORTS_GUARD &&
      !production.env_vars?.REPORTS_GUARD_INSTANCE &&
      !production.env_vars?.REPORTS_VERIFICATION_DB_ID,
    'REPORT_TARGET_ALREADY_CONFIGURED',
  );
  return production;
}
export async function inspect(api, baseline) {
  const databases = await api(
    'GET',
    '/d1/database?per_page=100&page=1',
    undefined,
    'D1_LIST',
  );
  fixed(
    Array.isArray(databases.result) &&
      databases.result_info?.total_count === databases.result.length &&
      databases.result.length < 10,
    'DATABASE_LIST_OR_CAPACITY',
  );
  fixed(
    databases.result.every(
      (db) => UUID.test(db.uuid) && typeof db.name === 'string',
    ),
    'DATABASE_METADATA_INVALID',
  );
  const workers = await api(
    'GET',
    '/workers/scripts',
    undefined,
    'WORKER_LIST',
  );
  fixed(
    Array.isArray(workers.result) &&
      workers.result.length <= 98 &&
      workers.result.every((worker) => typeof worker.id === 'string'),
    'WORKER_LIST_OR_CAPACITY',
  );
  fixed(
    !databases.result.some((db) => db.name === TARGET.database),
    'DATABASE_NAME_ALREADY_EXISTS',
  );
  fixed(
    !workers.result.some((worker) =>
      [TARGET.guard, TARGET.cleanup].includes(worker.id),
    ),
    'WORKER_NAME_ALREADY_EXISTS',
  );
  const response = await api(
    'GET',
    '/pages/projects/gemnao',
    undefined,
    'PAGES_READ',
  );
  checkProject(response.result, baseline);
  return {
    project: response.result,
    existingDatabaseIds: databases.result.map((db) => db.uuid),
    receipt: {
      metadataReadable: true,
      existingD1BindingsMatched: true,
      targetNamesAbsent: true,
      flagsClosed: true,
      wranglerManaged:
        !!response.result.deployment_configs.production.wrangler_config_hash,
      writePermissionsVerified: false,
    },
  };
}
async function files(directory, prefix = '') {
  const result = [];
  for (const item of (await readdir(join(directory, prefix))).sort()) {
    const name = prefix ? prefix + '/' + item : item,
      info = await lstat(join(directory, name));
    fixed(!info.isSymbolicLink(), 'ARTIFACT_SYMLINK');
    if (info.isDirectory()) result.push(...(await files(directory, name)));
    else {
      fixed(info.isFile(), 'ARTIFACT_FILE_TYPE');
      result.push(name);
    }
  }
  return result;
}
export async function verifySource() {
  const specification = JSON.parse(
    await readFile('ops/community-reports/closed-source.json', 'utf8'),
  );
  const allowed = [
    ...Object.keys(specification.hashes),
    'tests/community-reports/preflight.test.mjs',
    '.github/workflows/community-reports-closed-setup.yml',
    'ops/community-reports/closed-setup.mjs',
    'ops/community-reports/closed-source.json',
    'tests/community-reports/closed-setup.test.mjs',
  ];
  const changed = execFileSync(
    'git',
    ['diff', '--name-only', TARGET.base, 'HEAD'],
    { encoding: 'utf8' },
  )
    .trim()
    .split('\n')
    .filter(Boolean);
  fixed(
    changed.every((path) => allowed.includes(path)),
    'SOURCE_OUTSIDE_CLOSED_SCOPE',
  );
  for (const [path, hash] of Object.entries(specification.hashes))
    fixed(sha(await readFile(path)) === hash, 'REVIEWED_SOURCE_HASH_MISMATCH');
  const baseline = execFileSync('git', [
    'show',
    TARGET.base + ':wrangler.json',
  ]);
  fixed(
    sha(await readFile('wrangler.json')) === sha(baseline),
    'ROOT_CONFIG_CHANGED',
  );
}
export async function packageArtifact(directory, sourceSha) {
  await verifySource();
  fixed(/^[a-f0-9]{40}$/.test(sourceSha), 'SOURCE_SHA_REQUIRED');
  const { build } = await import('esbuild');
  await mkdir(join(directory, 'workers'), { recursive: true });
  await cp('dist/client', join(directory, 'pages'), { recursive: true });
  for (const [name, entry] of [
    ['guard', 'cloudflare/community-reports-guard.ts'],
    ['cleanup', 'cloudflare/community-reports-cleanup.ts'],
  ])
    await build({
      entryPoints: [entry],
      outfile: join(directory, 'workers', name + '.mjs'),
      bundle: true,
      format: 'esm',
      platform: 'neutral',
      external: ['cloudflare:workers'],
    });
  const schema = await readFile('migrations/community-reports/0001.sql');
  fixed(sha(schema) === TARGET.schemaHash, 'SCHEMA_HASH_MISMATCH');
  await writeFile(join(directory, 'schema.sql'), schema);
  const hashes = {};
  for (const path of await files(directory)) {
    fixed(
      !/(^|\/)(?:wrangler\.(?:json|jsonc|toml)|\.env(?:\..*)?)$/.test(path),
      'CONFIG_IN_UPLOAD_ARTIFACT',
    );
    hashes[path] = sha(await readFile(join(directory, path)));
  }
  const manifest = JSON.stringify({ sourceSha, base: TARGET.base, hashes });
  await writeFile(join(directory, 'manifest.json'), manifest);
  return sha(manifest);
}
export async function verifyArtifact(directory, digest, sourceSha) {
  const text = await readFile(join(directory, 'manifest.json'), 'utf8');
  fixed(
    /^[a-f0-9]{64}$/.test(digest || '') && sha(text) === digest,
    'ARTIFACT_DIGEST_MISMATCH',
  );
  const manifest = JSON.parse(text);
  fixed(
    manifest.sourceSha === sourceSha && manifest.base === TARGET.base,
    'ARTIFACT_SOURCE_MISMATCH',
  );
  fixed(
    JSON.stringify(
      (await files(directory))
        .filter((path) => path !== 'manifest.json')
        .sort(),
    ) === JSON.stringify(Object.keys(manifest.hashes).sort()),
    'ARTIFACT_FILE_SET_CHANGED',
  );
  for (const [path, hash] of Object.entries(manifest.hashes)) {
    fixed(
      /^(pages\/.+|workers\/(guard|cleanup)\.mjs|schema\.sql)$/.test(path) &&
        !path.split('/').includes('..'),
      'ARTIFACT_PATH',
    );
    fixed(
      sha(await readFile(join(directory, path))) === hash,
      'ARTIFACT_BYTES_CHANGED',
    );
  }
  fixed(
    manifest.hashes['schema.sql'] === TARGET.schemaHash &&
      manifest.hashes['pages/_worker.js'] &&
      manifest.hashes['pages/_worker.bundle.js'] &&
      manifest.hashes['workers/guard.mjs'] &&
      manifest.hashes['workers/cleanup.mjs'],
    'ARTIFACT_INCOMPLETE',
  );
}
const canonical = (value) =>
  Array.isArray(value)
    ? value.map(canonical)
    : value && typeof value === 'object'
      ? Object.fromEntries(
          Object.keys(value)
            .sort()
            .map((key) => [key, canonical(value[key])]),
        )
      : value;
const normalized = (value) => JSON.stringify(canonical(value));
export async function setup(api, baseline, artifact, receipt, uploader) {
  const inventory = await inspect(api, baseline);
  receipt.inspection = inventory.receipt;
  const created = await api(
    'POST',
    '/d1/database',
    { name: TARGET.database },
    'D1_CREATE',
  );
  const id = created.result?.uuid;
  fixed(
    UUID.test(id || '') &&
      created.result?.name === TARGET.database &&
      !inventory.existingDatabaseIds.includes(id),
    'NEW_D1_IDENTITY_MISMATCH',
  );
  receipt.databaseId = id;
  receipt.completed.push('dedicated-d1-created');
  const identity = await api(
    'GET',
    '/d1/database/' + id,
    undefined,
    'D1_IDENTITY',
  );
  fixed(
    identity.result?.uuid === id && identity.result?.name === TARGET.database,
    'NEW_D1_IDENTITY_MISMATCH',
  );
  const query = async (sql, label) => {
    const response = await api(
      'POST',
      '/d1/database/' + id + '/query',
      { sql, params: [] },
      label,
    );
    fixed(
      Array.isArray(response.result) &&
        response.result.length > 0 &&
        response.result.every(
          (result) => result.success === true && Array.isArray(result.results),
        ),
      label + '_RESULT',
    );
    return response.result;
  };
  const tables = await query(
    "SELECT name FROM sqlite_schema WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_cf_%'",
    'D1_EMPTY',
  );
  fixed(
    tables.length === 1 && tables[0].results.length === 0,
    'NEW_D1_NOT_EMPTY',
  );
  const schema = await readFile(join(artifact, 'schema.sql'), 'utf8');
  fixed(sha(schema) === TARGET.schemaHash, 'SCHEMA_HASH_MISMATCH');
  await query(schema, 'D1_SCHEMA');
  const total = await query(
    "SELECT value FROM community_operations WHERE key='total'",
    'D1_TOTAL',
  );
  fixed(
    total.length === 1 &&
      total[0].results.length === 1 &&
      total[0].results[0].value === '0',
    'NEW_D1_TOTAL_MISMATCH',
  );
  receipt.completed.push('dedicated-schema-applied');
  for (const name of [TARGET.guard, TARGET.cleanup]) {
    const guard = name === TARGET.guard;
    const bindings = guard
      ? [
          {
            type: 'durable_object_namespace',
            name: 'GUARD',
            class_name: 'CommunityReportLedger',
          },
        ]
      : [
          { type: 'd1', name: 'REPORTS_DB', id },
          {
            type: 'service',
            name: 'REPORTS_GUARD',
            service: TARGET.guard,
            entrypoint: 'ReportsGuardService',
          },
          ...FLAGS.map((flag) => ({
            type: 'plain_text',
            name: flag,
            text: 'false',
          })),
        ];
    const form = new FormData();
    form.set(
      'metadata',
      new Blob(
        [
          JSON.stringify({
            main_module: 'worker.mjs',
            compatibility_date: '2026-05-22',
            bindings,
            observability: { enabled: false },
            ...(guard
              ? {
                  migrations: {
                    new_tag: 'v1',
                    new_sqlite_classes: ['CommunityReportLedger'],
                  },
                }
              : {}),
          }),
        ],
        { type: 'application/json' },
      ),
    );
    form.set(
      'worker.mjs',
      new Blob(
        [
          await readFile(
            join(artifact, 'workers', guard ? 'guard.mjs' : 'cleanup.mjs'),
          ),
        ],
        { type: 'application/javascript+module' },
      ),
      'worker.mjs',
    );
    await api(
      'PUT',
      '/workers/scripts/' + name,
      form,
      guard ? 'GUARD_UPLOAD' : 'CLEANUP_UPLOAD',
    );
    receipt.completed.push(guard ? 'guard-uploaded' : 'cleanup-uploaded');
    await api(
      'PUT',
      '/workers/scripts/' + name + '/subdomain',
      { enabled: false, previews_enabled: false },
      'PUBLIC_URL_DISABLE',
    );
    const publicSetting = await api(
      'GET',
      '/workers/scripts/' + name + '/subdomain',
      undefined,
      'PUBLIC_URL_READ',
    );
    fixed(
      publicSetting.result?.enabled === false &&
        publicSetting.result?.previews_enabled === false,
      'WORKER_PUBLIC_URL_NOT_DISABLED',
    );
    const schedules = await api(
      'GET',
      '/workers/scripts/' + name + '/schedules',
      undefined,
      'CRON_READ',
    );
    fixed(
      Array.isArray(schedules.result?.schedules) &&
        schedules.result.schedules.length === 0,
      'CRON_NOT_EMPTY',
    );
    const settings = await api(
      'GET',
      '/workers/scripts/' + name + '/settings',
      undefined,
      'WORKER_BINDINGS_READ',
    );
    const actual = settings.result?.bindings;
    fixed(Array.isArray(actual), 'WORKER_BINDINGS_MISSING');
    if (guard)
      fixed(
        actual.some(
          (binding) =>
            binding.name === 'GUARD' &&
            binding.type === 'durable_object_namespace' &&
            binding.class_name === 'CommunityReportLedger' &&
            typeof binding.namespace_id === 'string',
        ),
        'GUARD_BINDING_MISMATCH',
      );
    else
      fixed(
        actual.some(
          (binding) =>
            binding.name === 'REPORTS_DB' &&
            binding.type === 'd1' &&
            binding.id === id,
        ) &&
          actual.some(
            (binding) =>
              binding.name === 'REPORTS_GUARD' &&
              binding.type === 'service' &&
              binding.service === TARGET.guard &&
              binding.entrypoint === 'ReportsGuardService',
          ) &&
          FLAGS.every((flag) =>
            actual.some(
              (binding) => binding.name === flag && binding.text === 'false',
            ),
          ),
        'CLEANUP_BINDING_MISMATCH',
      );
  }
  const reread = await api(
    'GET',
    '/pages/projects/gemnao',
    undefined,
    'PAGES_RECHECK',
  );
  checkProject(reread.result, baseline);
  fixed(
    normalized(reread.result.deployment_configs) ===
      normalized(inventory.project.deployment_configs),
    'PAGES_SETTINGS_CHANGED_DURING_SETUP',
  );
  const before = reread.result.deployment_configs;
  const additions = {
    d1_databases: { ...before.production.d1_databases, REPORTS_DB: { id } },
    services: {
      ...before.production.services,
      REPORTS_GUARD: {
        service: TARGET.guard,
        environment: 'production',
        entrypoint: 'ReportsGuardService',
      },
    },
  };
  await api(
    'PATCH',
    '/pages/projects/gemnao',
    { deployment_configs: { production: additions } },
    'PAGES_BINDINGS_WRITE',
  );
  receipt.completed.push('pages-production-bindings-added');
  const after = (
    await api('GET', '/pages/projects/gemnao', undefined, 'PAGES_BINDINGS_READ')
  ).result.deployment_configs;
  fixed(
    normalized(after.preview) === normalized(before.preview),
    'PREVIEW_SETTINGS_CHANGED',
  );
  fixed(
    after.production?.d1_databases?.REPORTS_DB?.id === id &&
      after.production.services?.REPORTS_GUARD?.entrypoint ===
        'ReportsGuardService' &&
      after.production.services.REPORTS_GUARD.service === TARGET.guard,
    'PAGES_ADDED_BINDINGS_MISMATCH',
  );
  const rest = structuredClone(after.production);
  delete rest.d1_databases.REPORTS_DB;
  delete rest.services.REPORTS_GUARD;
  if (!before.production.services) delete rest.services;
  fixed(
    normalized(rest) === normalized(before.production),
    'EXISTING_PRODUCTION_SETTINGS_CHANGED',
  );
  await uploader();
  receipt.completed.push('closed-backend-pages-upload-requested');
  receipt.intakeEnabled = false;
  receipt.generalReportingUiIncluded = false;
  receipt.bootstrapInvoked = false;
  receipt.verificationEraseInvoked = false;
}
async function uploadPages(env, artifact) {
  fixed(
    env.RUNNER_TEMP &&
      resolve(artifact).startsWith(resolve(env.RUNNER_TEMP) + '/'),
    'ISOLATED_UPLOAD_DIRECTORY_REQUIRED',
  );
  const cli = resolve('node_modules/wrangler/bin/wrangler.js');
  const clean = await mkdtemp(join(env.RUNNER_TEMP, 'closed-pages-upload-'));
  await cp(join(artifact, 'pages'), join(clean, 'pages'), { recursive: true });
  try {
    await promisify(execFile)(
      process.execPath,
      [
        cli,
        'pages',
        'deploy',
        'pages',
        '--project-name',
        TARGET.pages,
        '--branch',
        TARGET.branch,
        '--commit-hash',
        env.GITHUB_SHA,
        '--commit-message',
        'Closed community backend; intake OFF',
        '--commit-dirty=true',
      ],
      {
        cwd: clean,
        timeout: 240000,
        maxBuffer: 2_000_000,
        env: {
          ...env,
          CLOUDFLARE_ACCOUNT_ID: TARGET.account,
          WRANGLER_SEND_METRICS: 'false',
          CI: 'true',
        },
      },
    );
  } catch {
    throw new SetupFailure('PAGES_UPLOAD_FAILED_OR_UNCERTAIN');
  }
}
async function main(env) {
  const mode = process.argv[2];
  if (mode === 'gate') {
    await verifySource();
    const environment = await gate(env);
    if (env.GITHUB_OUTPUT)
      await writeFile(env.GITHUB_OUTPUT, 'environment=' + environment + '\n', {
        flag: 'a',
      });
    return;
  }
  if (mode === 'package') {
    context(env);
    const digest = await packageArtifact(
      env.REPORTS_ARTIFACT_DIR,
      env.GITHUB_SHA,
    );
    if (env.GITHUB_OUTPUT)
      await writeFile(env.GITHUB_OUTPUT, 'digest=' + digest + '\n', {
        flag: 'a',
      });
    console.log(
      JSON.stringify({
        sourceSha: env.GITHUB_SHA,
        artifactDigest: digest,
        intakeEnabled: false,
      }),
    );
    return;
  }
  fixed(
    mode === 'run' &&
      ['inspect', 'setup'].includes(env.REPORTS_SETUP_OPERATION),
    'FIXED_OPERATION_REQUIRED',
  );
  const receipt = {
    operation: env.REPORTS_SETUP_OPERATION,
    sourceSha: env.GITHUB_SHA,
    completed: [],
    intakeEnabled: false,
    generalReportingUiIncluded: false,
  };
  try {
    await gate(env);
    fixed(
      env.REPORTS_SETUP_ENVIRONMENT === TARGET.environment,
      'PROTECTED_ENVIRONMENT_REQUIRED',
    );
    await verifySource();
    await verifyArtifact(
      env.REPORTS_ARTIFACT_DIR,
      env.REPORTS_ARTIFACT_DIGEST,
      env.GITHUB_SHA,
    );
    const api = client(env.CLOUDFLARE_API_TOKEN),
      baseline = JSON.parse(await readFile('wrangler.json', 'utf8'));
    if (env.REPORTS_SETUP_OPERATION === 'inspect')
      receipt.inspection = (await inspect(api, baseline)).receipt;
    else {
      fixed(
        env.REPORTS_SETUP_CONFIRMATION === 'SETUP_CLOSED_REPORTS_ONLY',
        'EXPLICIT_CLOSED_SETUP_REQUIRED',
      );
      await setup(api, baseline, env.REPORTS_ARTIFACT_DIR, receipt, () =>
        uploadPages(env, env.REPORTS_ARTIFACT_DIR),
      );
    }
    receipt.ok = true;
  } catch (error) {
    Object.assign(receipt, { ok: false }, safeFailure(error));
    process.exitCode = 1;
  }
  await writeFile(
    'closed-setup-receipt.json',
    JSON.stringify(receipt, null, 2) + '\n',
  );
  console.log(JSON.stringify(receipt));
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
)
  main(process.env).catch((error) => {
    console.error(JSON.stringify(safeFailure(error)));
    process.exitCode = 1;
  });
