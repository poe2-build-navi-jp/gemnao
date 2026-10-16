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
import {
  ManagedConfigFailure,
  normalized,
  productionAnchor,
  validateRecord,
  persistedConfig,
  managedBaseline,
  verifyManagedDeployment,
} from './managed-config.mjs';
const STATE_PATH = 'ops/community-reports/closed-binding-state.json';
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
  scopeBase: '776a8a216fa3ab922817dc57d6a8b15daefb2738',
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
// Non-secret identity returned by the failed run. Never infer/adopt a database
// from its name, and never use this partial receipt as a full resourceRecord.
export const PARTIAL_SETUP = Object.freeze({
  runId: '38792112604',
  sourceSha: 'c6d411241d6b8c3d79bbb76bcb84f0f8937177d2',
  databaseId: '3141aae6-8dc9-47e9-a8a2-7a05f642f94f',
});
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
    error:
      error instanceof SetupFailure || error instanceof ManagedConfigFailure
        ? error.message
        : 'SETUP_FAILED',
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
export async function jsonResponse(response, label) {
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
export function client(
  token,
  fetcher = fetch,
  persistedId = null,
  readOnly = false,
) {
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
        /^\/pages\/projects\/gemnao\/deployments\/[a-f0-9-]{36}$/.test(path) ||
        /^\/d1\/database\/[a-f0-9-]{36}$/.test(path) ||
        /^\/workers\/scripts\/gemnao-community-reports-(guard|cleanup)\/(settings|subdomain|schedules)$/.test(
          path,
        )
      );
    if (method === 'POST')
      return (
        path === '/d1/database' ||
        /^\/d1\/database\/[a-f0-9-]{36}\/query$/.test(path) ||
        /^\/workers\/scripts\/gemnao-community-reports-(guard|cleanup)\/subdomain$/.test(
          path,
        )
      );
    if (method === 'PUT')
      return /^\/workers\/scripts\/gemnao-community-reports-(guard|cleanup)$/.test(
        path,
      );
    return false;
  };
  return async (method, path, body, label) => {
    fixed(
      !readOnly || (method === 'GET' && body === undefined),
      'READ_ONLY_REQUEST_REQUIRED',
    );
    fixed(allowed(method, path), 'REQUEST_OUTSIDE_FIXED_BOUNDARY');
    if (method === 'POST' && path.endsWith('/subdomain'))
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
        (createdId && databasePath[1] === createdId) ||
          (method === 'GET' && persistedId && databasePath[1] === persistedId),
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
  const configuration = managedBaseline(response.result, baseline);
  const recovery = await readAnchor(api, response.result);
  recovery.productionConfigSha256 = configuration.productionConfigSha256;
  return {
    project: response.result,
    recovery,
    existingDatabaseIds: databases.result.map((db) => db.uuid),
    receipt: {
      metadataReadable: true,
      existingD1BindingsMatched: true,
      targetNamesAbsent: true,
      flagsClosed: true,
      wranglerManaged:
        !!response.result.deployment_configs.production.wrangler_config_hash,
      writePermissionsVerified: false,
      managedConfigurationAligned: true,
      recovery,
    },
  };
}
// Partial-state inspection deliberately does not call inspect(): that operation
// requires absent names and is unsafe as a recovery/retry plan. No SQL is read.
export async function readbackPartial(api, baseline) {
  const result = {
    originalRunId: PARTIAL_SETUP.runId,
    originalSourceSha: PARTIAL_SETUP.sourceSha,
    readOnly: true,
    errors: [],
    database: null,
    workers: {},
    pages: null,
  };
  const get = async (path, label) => {
    try {
      return await api('GET', path, undefined, label);
    } catch (error) {
      result.errors.push({ stage: label, ...safeFailure(error) });
      return null;
    }
  };
  const database = await get(
    '/d1/database/' + PARTIAL_SETUP.databaseId,
    'PARTIAL_D1_IDENTITY',
  );
  if (database) {
    result.database = {
      databaseId: PARTIAL_SETUP.databaseId,
      identityMatches:
        database.result?.uuid === PARTIAL_SETUP.databaseId &&
        database.result?.name === TARGET.database,
    };
    if (!result.database.identityMatches)
      result.errors.push({
        stage: 'PARTIAL_D1_IDENTITY',
        error: 'PARTIAL_D1_IDENTITY_MISMATCH',
      });
  }
  const inventory = await get('/workers/scripts', 'PARTIAL_WORKER_LIST');
  const workers = inventory?.result;
  const validList =
    Array.isArray(workers) &&
    workers.length <= 98 &&
    workers.every((worker) => typeof worker.id === 'string') &&
    new Set(workers.map((worker) => worker.id)).size === workers.length;
  if (inventory && !validList)
    result.errors.push({
      stage: 'PARTIAL_WORKER_LIST',
      error: 'WORKER_LIST_INCOMPLETE',
    });
  for (const name of [TARGET.guard, TARGET.cleanup]) {
    const state = {
      exists: validList ? workers.some((worker) => worker.id === name) : null,
      publicUrls: null,
      cron: null,
      bindings: null,
    };
    result.workers[name] = state;
    if (state.exists === false) {
      if (name === TARGET.guard)
        result.errors.push({
          stage: 'PARTIAL_WORKER_LIST',
          error: 'PARTIAL_GUARD_MISSING',
        });
      continue;
    }
    // Collect all three observations even when URL state is unsafe/unknown.
    const settings = await get(
      '/workers/scripts/' + name + '/settings',
      'PARTIAL_' + (name === TARGET.guard ? 'GUARD' : 'CLEANUP') + '_SETTINGS',
    );
    const urls = await get(
      '/workers/scripts/' + name + '/subdomain',
      'PARTIAL_' + (name === TARGET.guard ? 'GUARD' : 'CLEANUP') + '_URLS',
    );
    const schedules = await get(
      '/workers/scripts/' + name + '/schedules',
      'PARTIAL_' + (name === TARGET.guard ? 'GUARD' : 'CLEANUP') + '_CRON',
    );
    if (urls) {
      state.publicUrls = {
        enabled:
          typeof urls.result?.enabled === 'boolean'
            ? urls.result.enabled
            : null,
        previewsEnabled:
          typeof urls.result?.previews_enabled === 'boolean'
            ? urls.result.previews_enabled
            : null,
      };
      if (Object.values(state.publicUrls).some((value) => value === null))
        result.errors.push({
          stage: name,
          error: 'WORKER_URL_RESPONSE_INCOMPLETE',
        });
    }
    if (schedules) {
      const entries = schedules.result?.schedules;
      if (
        Array.isArray(entries) &&
        entries.length <= 100 &&
        entries.every(
          (item) => typeof item.cron === 'string' && item.cron.length <= 100,
        )
      )
        state.cron = {
          empty: entries.length === 0,
          expressions: entries.map((item) => item.cron),
        };
      else
        result.errors.push({
          stage: name,
          error: 'WORKER_CRON_RESPONSE_INCOMPLETE',
        });
    }
    if (settings) {
      const bindings = settings.result?.bindings;
      if (!Array.isArray(bindings)) {
        result.errors.push({
          stage: name,
          error: 'WORKER_BINDINGS_RESPONSE_INCOMPLETE',
        });
      } else if (name === TARGET.guard) {
        const binding = bindings.find((item) => item.name === 'GUARD');
        const matches =
          bindings.length === 1 &&
          binding?.type === 'durable_object_namespace' &&
          binding.class_name === 'CommunityReportLedger' &&
          /^[a-f0-9]{32}$/.test(binding.namespace_id || '') &&
          (!binding.script_name || binding.script_name === TARGET.guard);
        state.bindings = {
          identityMatches: matches,
          guardNamespaceId: matches ? binding.namespace_id : null,
        };
        if (!matches)
          result.errors.push({
            stage: name,
            error: 'PARTIAL_GUARD_BINDING_MISMATCH',
          });
      } else {
        const flags = Object.fromEntries(
          FLAGS.map((flag) => [
            flag,
            bindings.some(
              (item) =>
                item.name === flag &&
                item.type === 'plain_text' &&
                item.text === 'false',
            ),
          ]),
        );
        state.bindings = {
          databaseMatches: bindings.some(
            (item) =>
              item.name === 'REPORTS_DB' &&
              item.type === 'd1' &&
              item.id === PARTIAL_SETUP.databaseId,
          ),
          serviceMatches: bindings.some(
            (item) =>
              item.name === 'REPORTS_GUARD' &&
              item.type === 'service' &&
              item.service === TARGET.guard &&
              item.entrypoint === 'ReportsGuardService',
          ),
          flagsOff: flags,
        };
      }
    }
  }
  const pages = await get('/pages/projects/gemnao', 'PARTIAL_PAGES');
  if (pages) {
    const production = pages.result?.deployment_configs?.production;
    const flags = Object.fromEntries(
      FLAGS.map((flag) => {
        if (!production || !production.env_vars) return [flag, null];
        const variable = production.env_vars[flag];
        return [
          flag,
          !variable ||
            (variable.type === 'plain_text' && variable.value === 'false'),
        ];
      }),
    );
    result.pages = {
      flagsOff: flags,
      intakeClosed: Object.values(flags).includes(null)
        ? null
        : Object.values(flags).every(Boolean),
      unchangedClosedConfiguration: false,
      recovery: null,
    };
    try {
      checkProject(pages.result, baseline);
      const configuration = managedBaseline(pages.result, baseline);
      result.pages.unchangedClosedConfiguration = true;
      const anchor = await readAnchor((method, path, body, label) => {
        fixed(
          method === 'GET' && body === undefined,
          'READ_ONLY_REQUEST_REQUIRED',
        );
        return api(method, path, body, label);
      }, pages.result);
      result.pages.recovery = {
        ...anchor,
        productionConfigSha256: configuration.productionConfigSha256,
      };
    } catch (error) {
      result.errors.push({
        stage: 'PARTIAL_PAGES_CONFIGURATION',
        ...safeFailure(error),
      });
    }
  }
  result.readbackComplete = result.errors.length === 0;
  // This is a status report, never an executable provisioning record/permission.
  result.readyForAutomaticResume = false;
  return result;
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
  fixed(
    specification.scopeBase === TARGET.scopeBase,
    'REVIEWED_SCOPE_BASE_REQUIRED',
  );
  try {
    execFileSync('git', [
      'merge-base',
      '--is-ancestor',
      TARGET.scopeBase,
      'HEAD',
    ]);
  } catch {
    throw new SetupFailure('REVIEWED_SCOPE_BASE_NOT_ANCESTOR');
  }
  const allowed = [
    ...Object.keys(specification.hashes),
    'tests/community-reports/preflight.test.mjs',
    '.github/workflows/community-reports-closed-setup.yml',
    'ops/community-reports/closed-setup.mjs',
    'ops/community-reports/closed-source.json',
    'tests/community-reports/closed-setup.test.mjs',
    'ops/community-reports/managed-config.mjs',
    'ops/community-reports/closed-setup.md',
    'tests/community-reports/managed-wrangler.mjs',
    'ops/community-reports/cleanup-resume.mjs',
    'tests/community-reports/cleanup-resume.test.mjs',
    'ops/community-reports/bootstrap-phase.mjs',
    'ops/community-reports/bootstrap-phase-state.json',
    'tests/community-reports/bootstrap-phase.test.mjs',
    'dist/client/.gitkeep',
    'wrangler.json',
    STATE_PATH,
  ];
  const changed = (
    execFileSync('git', ['diff', '--name-only', TARGET.scopeBase], {
      encoding: 'utf8',
    }) +
    '\n' +
    execFileSync('git', ['ls-files', '--others', '--exclude-standard'], {
      encoding: 'utf8',
    })
  )
    .trim()
    .split('\n')
    .filter(Boolean);
  fixed(
    changed.every((path) => allowed.includes(path)),
    'SOURCE_OUTSIDE_CLOSED_SCOPE',
  );
  // Existing Pages builds remove this tracked, empty output placeholder.
  try {
    fixed(
      (await readFile('dist/client/.gitkeep')).length === 0,
      'BUILD_PLACEHOLDER_NOT_EMPTY',
    );
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  for (const [path, hash] of Object.entries(specification.hashes))
    fixed(sha(await readFile(path)) === hash, 'REVIEWED_SOURCE_HASH_MISMATCH');
  const baseline = execFileSync('git', [
    'show',
    TARGET.base + ':wrangler.json',
  ]);
  const record = await optionalRecord();
  let expected = record
    ? persistedConfig(JSON.parse(baseline), record, TARGET, FLAGS)
    : JSON.parse(baseline);
  let phase = null;
  try {
    phase = JSON.parse(
      await readFile(
        'ops/community-reports/bootstrap-phase-state.json',
        'utf8',
      ),
    );
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  if (phase) {
    fixed(record, 'BOOTSTRAP_PERSISTED_RECORD_REQUIRED');
    const { phaseConfig } = await import('./bootstrap-phase.mjs');
    expected = phaseConfig(expected, phase, record);
  }
  fixed(
    normalized(JSON.parse(await readFile('wrangler.json', 'utf8'))) ===
      normalized(expected),
    'ROOT_CONFIG_OUTSIDE_PERSISTED_CLOSED_SCOPE',
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
export async function setup(
  api,
  baseline,
  artifact,
  receipt,
  persist = async () => {},
) {
  const inventory = await inspect(api, baseline);
  receipt.inspection = inventory.receipt;
  receipt.recovery = inventory.recovery;
  await persist();

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
  await persist();
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
  await persist();
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
    await persist();
    await api(
      'POST',
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
    if (guard)
      receipt.guardNamespaceId = actual.find(
        (binding) => binding.name === 'GUARD',
      ).namespace_id;
    if (!guard)
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
  fixed(
    normalized(reread.result.deployment_configs) ===
      normalized(inventory.project.deployment_configs),
    'PAGES_SETTINGS_CHANGED_DURING_SETUP',
  );
  receipt.resourceRecord = validateRecord(
    {
      version: 1,
      accountId: TARGET.account,
      databaseName: TARGET.database,
      databaseId: id,
      guardName: TARGET.guard,
      guardNamespaceId: receipt.guardNamespaceId,
      cleanupName: TARGET.cleanup,
      provisionedSourceSha: receipt.sourceSha,
      provisionedRunId: receipt.runId,
      recovery: inventory.recovery,
    },
    TARGET,
  );
  receipt.pagesChanged = false;
  receipt.nextStep =
    'Commit reviewed resourceRecord and deterministic wrangler additions before deploy';
  await persist();
}
async function optionalRecord() {
  try {
    return validateRecord(
      JSON.parse(await readFile(STATE_PATH, 'utf8')),
      TARGET,
    );
  } catch (error) {
    if (error?.code === 'ENOENT') return null;
    throw error;
  }
}
function baselineConfig() {
  return JSON.parse(
    execFileSync('git', ['show', TARGET.base + ':wrangler.json'], {
      encoding: 'utf8',
    }),
  );
}
async function readAnchor(api, project) {
  const id = project.canonical_deployment?.id;
  fixed(UUID.test(id || ''), 'VERIFIED_PRODUCTION_ROLLBACK_ANCHOR_REQUIRED');
  const result = await api(
    'GET',
    '/pages/projects/gemnao/deployments/' + id,
    undefined,
    'PRODUCTION_ANCHOR_READ',
  );
  return productionAnchor(project, result.result);
}
export async function deployClosed(
  api,
  baseline,
  record,
  desired,
  receipt,
  uploader,
  persist = async () => {},
) {
  validateRecord(record, TARGET);
  fixed(
    normalized(desired) ===
      normalized(persistedConfig(baseline, record, TARGET, FLAGS)),
    'PERSISTED_WRANGLER_CONFIG_REQUIRED',
  );
  const response = await api(
    'GET',
    '/pages/projects/gemnao',
    undefined,
    'PAGES_DEPLOY_PRECHECK',
  );
  checkProject(response.result, baseline);
  const snapshot = managedBaseline(response.result, baseline);
  const anchor = await readAnchor(api, response.result);
  fixed(
    anchor.deploymentId === record.recovery.deploymentId &&
      anchor.sourceSha === record.recovery.sourceSha &&
      snapshot.productionConfigSha256 ===
        record.recovery.productionConfigSha256,
    'PRODUCTION_RECOVERY_BASELINE_CHANGED',
  );
  const database = await api(
    'GET',
    '/d1/database/' + record.databaseId,
    undefined,
    'PERSISTED_D1_IDENTITY',
  );
  fixed(
    database.result?.uuid === record.databaseId &&
      database.result?.name === TARGET.database,
    'PERSISTED_D1_IDENTITY_MISMATCH',
  );
  for (const name of [TARGET.guard, TARGET.cleanup]) {
    const settings = await api(
      'GET',
      '/workers/scripts/' + name + '/settings',
      undefined,
      'PERSISTED_WORKER_BINDINGS',
    );
    const bindings = settings.result?.bindings;
    fixed(Array.isArray(bindings), 'PERSISTED_WORKER_BINDINGS_MISSING');
    if (name === TARGET.guard)
      fixed(
        bindings.some(
          (binding) =>
            binding.name === 'GUARD' &&
            binding.class_name === 'CommunityReportLedger' &&
            binding.namespace_id === record.guardNamespaceId,
        ),
        'PERSISTED_GUARD_MISMATCH',
      );
    else
      fixed(
        bindings.some(
          (binding) =>
            binding.name === 'REPORTS_DB' && binding.id === record.databaseId,
        ) &&
          bindings.some(
            (binding) =>
              binding.name === 'REPORTS_GUARD' &&
              binding.service === TARGET.guard &&
              binding.entrypoint === 'ReportsGuardService',
          ) &&
          FLAGS.every((flag) =>
            bindings.some(
              (binding) =>
                binding.name === flag &&
                binding.type === 'plain_text' &&
                binding.text === 'false',
            ),
          ),
        'PERSISTED_CLEANUP_MISMATCH',
      );
    const urls = await api(
      'GET',
      '/workers/scripts/' + name + '/subdomain',
      undefined,
      'PERSISTED_WORKER_URLS',
    );
    fixed(
      urls.result?.enabled === false && urls.result?.previews_enabled === false,
      'WORKER_PUBLIC_URL_NOT_DISABLED',
    );
    const cron = await api(
      'GET',
      '/workers/scripts/' + name + '/schedules',
      undefined,
      'PERSISTED_CRON',
    );
    fixed(
      Array.isArray(cron.result?.schedules) &&
        cron.result.schedules.length === 0,
      'CRON_NOT_EMPTY',
    );
  }
  receipt.recovery = record.recovery;
  receipt.nextWrite = 'closed-managed-pages-deployment';
  await persist();
  await uploader(desired);
  receipt.completed.push('closed-managed-pages-upload-requested');
  await persist();
  const after = (
    await api(
      'GET',
      '/pages/projects/gemnao',
      undefined,
      'PAGES_DEPLOY_READBACK',
    )
  ).result;
  verifyManagedDeployment(response.result, after, desired, TARGET);
  const deployed = await readAnchor(api, after);
  fixed(deployed.sourceSha === receipt.sourceSha, 'DEPLOYED_SOURCE_MISMATCH');
  receipt.deployment = deployed;
  receipt.settingsVerified = true;
  receipt.intakeEnabled = false;
  receipt.generalReportingUiIncluded = false;
  await persist();
}
export async function prepareManagedUpload(directory, artifact, desired) {
  fixed(
    desired.pages_build_output_dir === './dist/client',
    'UNCHANGED_OUTPUT_DIRECTORY_REQUIRED',
  );
  await mkdir(join(directory, 'dist'), { recursive: true });
  await cp(join(artifact, 'pages'), join(directory, 'dist/client'), {
    recursive: true,
  });
  await writeFile(
    join(directory, 'wrangler.json'),
    JSON.stringify(desired, null, 2) + '\n',
  );
}
async function uploadPages(env, artifact, desired) {
  fixed(
    env.RUNNER_TEMP &&
      resolve(artifact).startsWith(resolve(env.RUNNER_TEMP) + '/'),
    'ISOLATED_UPLOAD_DIRECTORY_REQUIRED',
  );
  const cli = resolve('node_modules/wrangler/bin/wrangler.js');
  const clean = await mkdtemp(join(env.RUNNER_TEMP, 'closed-pages-upload-'));
  await prepareManagedUpload(clean, artifact, desired);
  try {
    await promisify(execFile)(
      process.execPath,
      [
        cli,
        'pages',
        'deploy',
        'dist/client',
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
export async function main(env, fetcher = fetch, mode = process.argv[2]) {
  if (mode === 'prepare-bindings') {
    fixed(
      !process.env.CLOUDFLARE_API_TOKEN && env.REPORTS_RESOURCE_RECORD,
      'OFFLINE_REVIEWED_RECORD_REQUIRED',
    );
    const record = validateRecord(
      JSON.parse(await readFile(env.REPORTS_RESOURCE_RECORD, 'utf8')),
      TARGET,
    );
    fixed(!(await optionalRecord()), 'PERSISTED_RECORD_ALREADY_EXISTS');
    fixed(
      normalized(JSON.parse(await readFile('wrangler.json', 'utf8'))) ===
        normalized(baselineConfig()),
      'ROOT_CONFIG_CHANGED',
    );
    const config = persistedConfig(baselineConfig(), record, TARGET, FLAGS);
    await writeFile(STATE_PATH, JSON.stringify(record, null, 2) + '\n');
    await writeFile('wrangler.json', JSON.stringify(config, null, 2) + '\n');
    console.log(
      'Prepared only non-secret resource identity and deterministic closed Wrangler additions; review and commit before deploy.',
    );
    return;
  }
  if (mode === 'gate') {
    // The historic mutation allowlist correctly rejects later article commits.
    // Readback has a GET-only client and does not build/upload artifact bytes.
    if (env.REPORTS_SETUP_OPERATION !== 'readback') await verifySource();
    const environment = await gate(env, fetcher);
    if (env.GITHUB_OUTPUT)
      await writeFile(env.GITHUB_OUTPUT, 'environment=' + environment + '\n', {
        flag: 'a',
      });
    return;
  }
  if (mode === 'package') {
    context(env);
    const packager =
      env.REPORTS_SETUP_OPERATION === 'resume-cleanup'
        ? (await import('./cleanup-resume.mjs')).packageCleanupArtifact
        : packageArtifact;
    const digest = await packager(env.REPORTS_ARTIFACT_DIR, env.GITHUB_SHA);
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
      [
        'inspect',
        'setup',
        'deploy',
        'readback',
        'resume-cleanup',
        'bootstrap-open',
        'bootstrap-pin',
        'bootstrap-close',
      ].includes(env.REPORTS_SETUP_OPERATION),
    'FIXED_OPERATION_REQUIRED',
  );
  const receipt = {
    operation: env.REPORTS_SETUP_OPERATION,
    sourceSha: env.GITHUB_SHA,
    runId: env.GITHUB_RUN_ID,
    completed: [],
    intakeEnabled: env.REPORTS_SETUP_OPERATION === 'readback' ? null : false,
    generalReportingUiIncluded: false,
  };
  try {
    await gate(env, fetcher);
    fixed(
      env.REPORTS_SETUP_ENVIRONMENT === TARGET.environment,
      'PROTECTED_ENVIRONMENT_REQUIRED',
    );
    if (env.REPORTS_SETUP_OPERATION === 'readback') {
      fixed(
        !env.REPORTS_SETUP_CONFIRMATION,
        'READBACK_CONFIRMATION_MUST_BE_EMPTY',
      );
      receipt.readback = await readbackPartial(
        client(
          env.CLOUDFLARE_API_TOKEN,
          fetcher,
          PARTIAL_SETUP.databaseId,
          true,
        ),
        baselineConfig(),
      );
      fixed(receipt.readback.readbackComplete, 'PARTIAL_READBACK_INCOMPLETE');
    } else if (env.REPORTS_SETUP_OPERATION.startsWith('bootstrap-')) {
      const {
        CONFIRMATIONS,
        optionalPhase,
        phaseConfig,
        phaseClient,
        runBootstrapStage,
      } = await import('./bootstrap-phase.mjs');
      fixed(
        env.REPORTS_SETUP_CONFIRMATION ===
          CONFIRMATIONS[env.REPORTS_SETUP_OPERATION],
        'EXPLICIT_BOOTSTRAP_PHASE_REQUIRED',
      );
      await verifySource();
      await verifyArtifact(
        env.REPORTS_ARTIFACT_DIR,
        env.REPORTS_ARTIFACT_DIGEST,
        env.GITHUB_SHA,
      );
      const record = await optionalRecord();
      const phase = await optionalPhase();
      fixed(record && phase, 'REVIEWED_BOOTSTRAP_PHASE_REQUIRED');
      const closed = persistedConfig(baselineConfig(), record, TARGET, FLAGS);
      fixed(
        normalized(JSON.parse(await readFile('wrangler.json', 'utf8'))) ===
          normalized(phaseConfig(closed, phase, record)),
        'BOOTSTRAP_SOURCE_CONFIG_MISMATCH',
      );
      const persist = async () => {
        await writeFile(
          'closed-setup-receipt.json',
          JSON.stringify(receipt, null, 2) + '\n',
        );
        console.log(
          JSON.stringify({
            checkpoint: true,
            operation: receipt.operation,
            completed: receipt.completed,
            databaseId: receipt.databaseId,
            guardNamespaceId: receipt.guardNamespaceId,
            instanceId: receipt.instanceId,
            nextWrite: receipt.nextWrite,
          }),
        );
      };
      await runBootstrapStage(
        phaseClient(env.CLOUDFLARE_API_TOKEN, phase, record, closed, fetcher),
        closed,
        record,
        phase,
        receipt,
        (config) => uploadPages(env, env.REPORTS_ARTIFACT_DIR, config),
        persist,
      );
    } else if (env.REPORTS_SETUP_OPERATION === 'resume-cleanup') {
      fixed(
        env.REPORTS_SETUP_CONFIRMATION === 'CREATE_CLOSED_REPORTS_CLEANUP_ONLY',
        'EXPLICIT_CLEANUP_RESUME_REQUIRED',
      );
      await verifySource();
      const { verifyCleanupArtifact, cleanupClient, resumeCleanup } =
        await import('./cleanup-resume.mjs');
      const artifact = await verifyCleanupArtifact(
        env.REPORTS_ARTIFACT_DIR,
        env.REPORTS_ARTIFACT_DIGEST,
        env.GITHUB_SHA,
      );
      const persist = async () => {
        await writeFile(
          'closed-setup-receipt.json',
          JSON.stringify(receipt, null, 2) + '\n',
        );
        console.log(
          JSON.stringify({
            checkpoint: true,
            operation: 'resume-cleanup',
            completed: receipt.completed,
            databaseId: receipt.databaseId || null,
            guardNamespaceId: receipt.guardNamespaceId || null,
            nextWrite: receipt.nextWrite || null,
          }),
        );
      };
      await resumeCleanup(
        cleanupClient(env.CLOUDFLARE_API_TOKEN, artifact.codeSha256, fetcher),
        baselineConfig(),
        artifact,
        receipt,
        persist,
      );
    } else {
      await verifySource();
      await verifyArtifact(
        env.REPORTS_ARTIFACT_DIR,
        env.REPORTS_ARTIFACT_DIGEST,
        env.GITHUB_SHA,
      );
      const record = await optionalRecord();
      const api = client(env.CLOUDFLARE_API_TOKEN, fetcher, record?.databaseId),
        baseline = baselineConfig();
      const persist = async () => {
        await writeFile(
          'closed-setup-receipt.json',
          JSON.stringify(receipt, null, 2) + '\n',
        );
        // Bounded non-secret checkpoint reaches the run log before mutations too.
        console.log(
          JSON.stringify({
            checkpoint: true,
            recovery: receipt.recovery,
            completed: receipt.completed,
            databaseId: receipt.databaseId || null,
            guardNamespaceId: receipt.guardNamespaceId || null,
            nextWrite: receipt.nextWrite || null,
          }),
        );
      };
      if (env.REPORTS_SETUP_OPERATION === 'inspect')
        receipt.inspection = (await inspect(api, baseline)).receipt;
      else if (env.REPORTS_SETUP_OPERATION === 'setup') {
        fixed(
          !record &&
            env.REPORTS_SETUP_CONFIRMATION === 'SETUP_CLOSED_REPORTS_ONLY',
          'EXPLICIT_CLOSED_SETUP_REQUIRED',
        );
        await setup(api, baseline, env.REPORTS_ARTIFACT_DIR, receipt, persist);
      } else {
        fixed(
          record &&
            env.REPORTS_SETUP_CONFIRMATION === 'DEPLOY_CLOSED_REPORTS_ONLY',
          'PERSISTED_CLOSED_DEPLOY_REQUIRED',
        );
        const desired = JSON.parse(await readFile('wrangler.json', 'utf8'));
        await deployClosed(
          api,
          baseline,
          record,
          desired,
          receipt,
          (config) => uploadPages(env, env.REPORTS_ARTIFACT_DIR, config),
          persist,
        );
      }
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
