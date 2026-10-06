// Fixed, operator-triggered D1 control. Never imported by the website.
import { createHash } from 'node:crypto';
import {
  readFile,
  readdir,
  writeFile,
  mkdtemp,
  rm,
  appendFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

export const target = Object.freeze({
  repository: 'poe2-build-navi-jp/gemnao',
  branch: 'gemunao',
  project: 'gemnao',
  // Expected identities, NOT proof of the current binding. Verify Pages first.
  account: '6a09a32cba1288cccce5912015086a35',
  database: '385a194f-5119-4bbe-9afe-2e6ce4ceb341',
  databaseName: 'gemnao-db',
  environment: 'gemnao-d1-production',
  migration: '0004_step_result_reports.sql',
  migrationSHA256:
    'e46f69fc9ea8d9d769f24c2370e0164b610241441a05c4a5fc91591404f5d095',
});
export const history = [
  '0000_chemical_baron_zemo.sql',
  '0001_illegal_wrecking_crew.sql',
  '0002_lying_sheva_callister.sql',
  '0003_empty_jackpot.sql',
];
export class Blocked extends Error {
  constructor(code, stage) {
    super(code);
    this.code = code;
    if (stage) this.stage = stage;
  }
}
const requireThat = (value, code) => {
  if (!value) throw new Blocked(code);
};
export const digest = (value) =>
  createHash('sha256')
    .update(typeof value === 'string' ? value : JSON.stringify(value))
    .digest('hex');
const cleanSQL = (s) =>
  String(s || '')
    .toLowerCase()
    .replace(/[\s"`[\]]/g, '')
    .replaceAll('step_result_receipts.', '');

export function assertContext(env, operation) {
  requireThat(
    env.GITHUB_ACTIONS === 'true' &&
      env.GITHUB_REPOSITORY === target.repository &&
      env.GITHUB_REF === `refs/heads/${target.branch}` &&
      env.GITHUB_EVENT_NAME === 'workflow_dispatch',
    'PRODUCTION_MANUAL_CONTEXT_REQUIRED',
  );
  requireThat(
    ['settings', 'preflight', 'apply'].includes(operation),
    'INVALID_OPERATION',
  );
  if (operation === 'apply') {
    requireThat(
      env.GITHUB_RUN_ATTEMPT === '1',
      'APPLY_RERUN_FORBIDDEN_RUN_PREFLIGHT',
    );
    requireThat(
      env.D1_CONFIRMATION === 'APPLY_0004_TO_GEMNAO',
      'EXPLICIT_APPLY_CONFIRMATION_REQUIRED',
    );
    requireThat(
      /^[a-f0-9]{64}$/.test(env.D1_PREFLIGHT_SHA256 || ''),
      'PREFLIGHT_FINGERPRINT_REQUIRED',
    );
  }
}

// This projection is the only Pages data retained. Never log/store env_vars,
// raw provider responses, headers, or request/secret values.
export function pagesProjection(project) {
  return {
    name: project?.name,
    productionBranch: project?.production_branch,
    owner: project?.source?.config?.owner,
    repository: project?.source?.config?.repo_name,
    productionDB: project?.deployment_configs?.production?.d1_databases?.DB?.id,
    previewDBs: Object.values(
      project?.deployment_configs?.preview?.d1_databases || {},
    )
      .map((item) => item?.id)
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b)),
    deploymentId: project?.canonical_deployment?.id,
    deploymentStatus: project?.canonical_deployment?.latest_stage?.status,
    deploymentEnvironment: project?.canonical_deployment?.environment,
    deploymentBranch:
      project?.canonical_deployment?.deployment_trigger?.metadata?.branch,
    deploymentCommit:
      project?.canonical_deployment?.deployment_trigger?.metadata?.commit_hash,
  };
}
export function assertBinding(pages, database) {
  requireThat(
    pages.name === target.project &&
      pages.productionBranch === target.branch &&
      pages.owner === 'poe2-build-navi-jp' &&
      pages.repository === 'gemnao',
    'PAGES_PROJECT_OR_SOURCE_MISMATCH',
  );
  requireThat(
    pages.productionDB === target.database,
    'CURRENT_PRODUCTION_BINDING_MISMATCH',
  );
  requireThat(
    pages.deploymentEnvironment === 'production' &&
      pages.deploymentStatus === 'success' &&
      pages.deploymentBranch === target.branch &&
      typeof pages.deploymentId === 'string' &&
      /^[a-f0-9]{40}$/.test(pages.deploymentCommit || ''),
    'CURRENT_PRODUCTION_DEPLOYMENT_UNVERIFIED',
  );
  if (database !== undefined)
    requireThat(
      database?.uuid === target.database &&
        database?.name === target.databaseName,
      'D1_IDENTITY_MISMATCH',
    );
  // A preview sharing this DB is not an authorized migration/test target.
  requireThat(
    !pages.previewDBs.includes(target.database),
    'PREVIEW_SHARES_PRODUCTION_DB_REVIEW_REQUIRED',
  );
}

const expectedIssue = {
  game_slug: ['TEXT', 1],
  topic: ['TEXT', 2],
  struggling_count: ['INTEGER', 0, '0'],
  resolved_count: ['INTEGER', 0, '0'],
  updated_at: ['TEXT', 0, "''"],
};
const expectedMethod = {
  context_slug: ['TEXT', 1],
  topic: ['TEXT', 2],
  method_id: ['TEXT', 3],
  method_label: ['TEXT', 0],
  response_count: ['INTEGER', 0, '0'],
  updated_at: ['TEXT', 0, "''"],
};
const expectedReceipt = {
  request_id: ['TEXT', 1],
  requested_at: ['TEXT', 0],
  context_slug: ['TEXT', 0],
  topic: ['TEXT', 0],
  method_id: ['TEXT', 0],
  outcome: ['TEXT', 0],
  report_struggling: ['INTEGER', 0],
};
function matches(columns, expected) {
  return (
    columns.length === Object.keys(expected).length &&
    Object.entries(expected).every(([name, [type, pk, defaultValue]]) =>
      columns.some(
        (c) =>
          c.name === name &&
          String(c.type).toUpperCase() === type &&
          c.pk === pk &&
          c.notnull === 1 &&
          (defaultValue === undefined || String(c.dflt_value) === defaultValue),
      ),
    )
  );
}
export function classify(snapshot) {
  requireThat(matches(snapshot.issue, expectedIssue), 'ISSUE_SCHEMA_DRIFT');
  requireThat(
    snapshot.registry.some(
      (c) => c.name === 'name' && String(c.type).toUpperCase() === 'TEXT',
    ) && snapshot.registry.some((c) => c.name === 'id' && c.pk === 1),
    'MIGRATION_REGISTRY_MISSING_OR_UNRECOGNIZED',
  );
  requireThat(
    snapshot.names.every(
      (name) => history.includes(name) || name === target.migration,
    ) &&
      new Set(snapshot.names).size === snapshot.names.length &&
      history.every((name) => snapshot.names.includes(name)),
    'MIGRATION_HISTORY_MISMATCH',
  );
  const newMethod = {
    ...expectedMethod,
    not_resolved_count: ['INTEGER', 0, '0'],
  };
  const ready =
    matches(snapshot.method, newMethod) &&
    matches(snapshot.receipt, expectedReceipt) &&
    snapshot.index.length === 1 &&
    snapshot.index[0].name === 'requested_at' &&
    cleanSQL(snapshot.receiptSQL).includes(
      "check(outcomein('resolved','not-resolved'))",
    ) &&
    cleanSQL(snapshot.receiptSQL).includes('check(report_strugglingin(0,1))');
  if (ready && snapshot.names.includes(target.migration))
    return 'already_applied';
  if (
    matches(snapshot.method, expectedMethod) &&
    snapshot.receipt.length === 0 &&
    snapshot.index.length === 0 &&
    !snapshot.receiptSQL &&
    !snapshot.names.includes(target.migration)
  )
    return 'ready_for_0004';
  throw new Blocked('PARTIAL_OR_UNRECOGNIZED_SCHEMA_STOP');
}
// Only fixed expected identifiers, booleans, counts and hashes may leave this
// diagnostic. Unknown provider identifiers/defaults/SQL never reach logs.
export function metadataDiagnostic(pages, snapshot) {
  const knownNames = [...history, target.migration];
  const names = snapshot.names || [];
  const unknown = names.filter((name) => !knownNames.includes(name));
  const columnChecks = (rows, expected) => ({
    matches: matches(rows, expected),
    missing: Object.keys(expected).filter((name) => !rows.some((c) => c.name === name)),
    unexpectedCount: rows.filter((c) => !Object.hasOwn(expected, c.name)).length,
    columns: Object.entries(expected).map(([name, [type, pk, defaultValue]]) => {
      const actual = rows.find((c) => c.name === name);
      return {
        name,
        present: Boolean(actual),
        typeMatches: Boolean(actual && String(actual.type).toUpperCase() === type),
        primaryKeyMatches: Boolean(actual && actual.pk === pk),
        notNullMatches: Boolean(actual && actual.notnull === 1),
        defaultMatches: Boolean(actual && (defaultValue === undefined || String(actual.dflt_value) === defaultValue)),
      };
    }),
  });
  return {
    diagnosticVersion: 1,
    applyAllowed: false,
    binding: {
      identityChecksPassed: true,
      previewBindingCount: pages.previewDBs.length,
      previewSharesProduction: pages.previewDBs.includes(target.database),
    },
    history: {
      readable: snapshot.historyReadable !== false,
      expected: knownNames.map((name) => ({ name, count: names.filter((item) => item === name).length })),
      unknownCount: unknown.length,
      unknownFingerprints: [...new Set(unknown.map((name) => digest(JSON.stringify(name))))].sort((a, b) => a.localeCompare(b)).slice(0, 20),
      unknownSetSHA256: digest([...new Set(unknown.map((name) => digest(JSON.stringify(name))))].sort((a, b) => a.localeCompare(b))),
      duplicateCount: names.length - new Set(names).size,
    },
    schema: {
      issue: columnChecks(snapshot.issue, expectedIssue),
      methodLegacy: columnChecks(snapshot.method, expectedMethod),
      methodMigrated: columnChecks(snapshot.method, { ...expectedMethod, not_resolved_count: ['INTEGER', 0, '0'] }),
      receipt: columnChecks(snapshot.receipt, expectedReceipt),
      registry: {
        present: snapshot.registry.length > 0,
        nameText: snapshot.registry.some((c) => c.name === 'name' && String(c.type).toUpperCase() === 'TEXT'),
        idPrimaryKey: snapshot.registry.some((c) => c.name === 'id' && c.pk === 1),
      },
      receiptIndex: {
        columnCount: snapshot.index.length,
        expectedRequestedAtOnly: snapshot.index.length === 1 && snapshot.index[0].name === 'requested_at',
      },
      receiptChecks: {
        definitionPresent: Boolean(snapshot.receiptSQL),
        outcome: cleanSQL(snapshot.receiptSQL).includes("check(outcomein('resolved','not-resolved'))"),
        reportStruggling: cleanSQL(snapshot.receiptSQL).includes('check(report_strugglingin(0,1))'),
        definitionSHA256: digest(snapshot.receiptSQL || ''),
      },
    },
  };
}
export function reportFor(pages, snapshot) {
  const state = classify(snapshot);
  // Keep only schema identities/types/keys and known numeric/empty defaults.
  const columns = (rows) =>
    rows.map((c) => ({
      name: c.name,
      type: c.type,
      notnull: c.notnull,
      pk: c.pk,
      defaultKind:
        c.dflt_value === null
          ? 'none'
          : ['0', "''"].includes(String(c.dflt_value))
            ? String(c.dflt_value)
            : 'other',
    }));
  const metadata = {
    target: {
      account: target.account,
      project: target.project,
      database: target.database,
      databaseName: target.databaseName,
    },
    pages,
    state,
    migrations: [...snapshot.names].sort((a, b) => a.localeCompare(b)),
    schema: {
      issue: columns(snapshot.issue),
      method: columns(snapshot.method),
      receipt: columns(snapshot.receipt),
      index: snapshot.index.map((c) => c.name),
      receiptDefinitionSHA256: digest(snapshot.receiptSQL || ''),
    },
    migrationSHA256: target.migrationSHA256,
  };
  return { ...metadata, preflightSHA256: digest(metadata) };
}

// Only fixed categories may leave this boundary. Never retain the original error,
// its message/stack/cause, or credential values (including length/fragments).
export function validateCredential(token) {
  requireThat(
    typeof token === 'string' && token.length > 0,
    'CLOUDFLARE_CREDENTIAL_NOT_CONFIGURED',
  );
  requireThat(!/\s/u.test(token), 'CLOUDFLARE_CREDENTIAL_WHITESPACE');
  requireThat(
    [...token].every((character) => character.charCodeAt(0) <= 127),
    'CLOUDFLARE_CREDENTIAL_NON_ASCII',
  );
  requireThat(
    [...token].every(
      (character) =>
        character.charCodeAt(0) >= 32 && character.charCodeAt(0) !== 127,
    ),
    'CLOUDFLARE_CREDENTIAL_INVALID_HEADER',
  );
}
const requestStages = new Map([
  [
    `/accounts/${target.account}/pages/projects/${target.project}`,
    'pagesproject',
  ],
  [`/accounts/${target.account}/d1/database/${target.database}`, 'd1identity'],
  [
    `/accounts/${target.account}/d1/database/${target.database}/query`,
    'd1schema',
  ],
  [
    `/accounts/${target.account}/d1/database/${target.database}/time_travel/bookmark`,
    'restorebookmark',
  ],
]);
const failureCodes = new Map([
  ['ETIMEDOUT', 'TIMEOUT'],
  ['UND_ERR_CONNECT_TIMEOUT', 'TIMEOUT'],
  ['UND_ERR_HEADERS_TIMEOUT', 'TIMEOUT'],
  ['UND_ERR_BODY_TIMEOUT', 'TIMEOUT'],
  ['ENOTFOUND', 'DNS'],
  ['EAI_AGAIN', 'DNS'],
  ['ECONNREFUSED', 'CONNECT'],
  ['ECONNRESET', 'CONNECT'],
  ['ENETUNREACH', 'CONNECT'],
  ['EHOSTUNREACH', 'CONNECT'],
  ['UND_ERR_SOCKET', 'CONNECT'],
  ['CERT_HAS_EXPIRED', 'TLS'],
  ['CERT_NOT_YET_VALID', 'TLS'],
  ['DEPTH_ZERO_SELF_SIGNED_CERT', 'TLS'],
  ['SELF_SIGNED_CERT_IN_CHAIN', 'TLS'],
  ['UNABLE_TO_VERIFY_LEAF_SIGNATURE', 'TLS'],
  ['UNABLE_TO_GET_ISSUER_CERT_LOCALLY', 'TLS'],
  ['ERR_TLS_CERT_ALTNAME_INVALID', 'TLS'],
  ['ERR_SSL_WRONG_VERSION_NUMBER', 'TLS'],
  ['ERR_INVALID_HTTP_TOKEN', 'INVALID_HEADER'],
  ['ERR_HTTP_INVALID_HEADER_VALUE', 'INVALID_HEADER'],
  ['ERR_INVALID_CHAR', 'INVALID_HEADER'],
]);
function requestFailure(error) {
  const pending = [error];
  // Bound traversal even for cyclic or unusually large AggregateError causes.
  for (let i = 0; i < 8 && i < pending.length; i++) {
    const item = pending[i];
    if (!item || typeof item !== 'object') continue;
    if (item.name === 'TimeoutError' || item.name === 'AbortError')
      return 'TIMEOUT';
    const category = failureCodes.get(item.code);
    if (category) return category;
    if (item.cause) pending.push(item.cause);
    if (Array.isArray(item.errors)) pending.push(...item.errors.slice(0, 8));
  }
  return 'OTHER';
}
export function cloudflareClient(token, fetcher = fetch) {
  validateCredential(token);
  return async function api(path, sql) {
    const stage = requestStages.get(path);
    requireThat(stage, 'UNEXPECTED_API_TARGET');
    let response;
    try {
      response = await fetcher(`https://api.cloudflare.com/client/v4${path}`, {
        method: sql ? 'POST' : 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        ...(sql ? { body: JSON.stringify({ sql }) } : {}),
        signal: AbortSignal.timeout(30000),
        redirect: 'error',
      });
    } catch (error) {
      throw new Blocked(`CLOUDFLARE_REQUEST_${requestFailure(error)}`, stage);
    }
    if (!response.ok)
      throw new Blocked(`CLOUDFLARE_HTTP_${response.status}`, stage);
    let data;
    try {
      data = await response.json();
    } catch {
      throw new Blocked('CLOUDFLARE_RESPONSE_INVALID', stage);
    }
    if (data?.success !== true)
      throw new Blocked('CLOUDFLARE_OPERATION_FAILED', stage);
    return data.result;
  };
}
export async function collect(api, { diagnostic = false } = {}) {
  const pages = pagesProjection(
    await api(`/accounts/${target.account}/pages/projects/${target.project}`),
  );
  assertBinding(pages);
  const database = await api(
    `/accounts/${target.account}/d1/database/${target.database}`,
  );
  assertBinding(pages, database);
  const query = async (sql) => {
    const result = await api(
      `/accounts/${target.account}/d1/database/${target.database}/query`,
      sql,
    );
    requireThat(
      Array.isArray(result) &&
        result.length === 1 &&
        result[0].success === true &&
        !result[0].meta?.changed_db,
      'PREFLIGHT_RESPONSE_NOT_READ_ONLY',
    );
    return result[0].results;
  };
  const snapshot = {
    issue: await query('PRAGMA table_info(issue_feedback)'),
    method: await query('PRAGMA table_info(solution_method_feedback)'),
    receipt: await query('PRAGMA table_info(step_result_receipts)'),
    index: await query('PRAGMA index_info(step_result_receipts_requested_at)'),
    registry: await query('PRAGMA table_info(d1_migrations)'),
  };
  snapshot.historyReadable = snapshot.registry.some((c) => c.name === 'name') &&
    snapshot.registry.some((c) => c.name === 'id');
  if (!diagnostic) requireThat(snapshot.historyReadable, 'MIGRATION_REGISTRY_MISSING_OR_UNRECOGNIZED');
  snapshot.names = snapshot.historyReadable
    ? (await query('SELECT name FROM d1_migrations ORDER BY id')).map((row) => row.name)
    : [];
  snapshot.receiptSQL =
    (
      await query(
        "SELECT sql FROM sqlite_master WHERE type='table' AND name='step_result_receipts'",
      )
    )[0]?.sql || '';
  try {
    return reportFor(pages, snapshot);
  } catch (error) {
    if (diagnostic && error instanceof Blocked) {
      error.diagnostic = metadataDiagnostic(pages, snapshot);
    }
    throw error;
  }
}
export async function verifyMigration(root = process.cwd()) {
  const files = await readdir(resolve(root, 'ops/d1/migrations'));
  requireThat(
    files.length === 1 && files[0] === target.migration,
    'UNEXPECTED_MIGRATION_FILE',
  );
  const sql = await readFile(
    resolve(root, 'ops/d1/migrations', target.migration),
    'utf8',
  );
  requireThat(
    digest(sql) === target.migrationSHA256,
    'MIGRATION_FILE_HASH_MISMATCH',
  );
}
export async function applyOnce(
  token,
  root = process.cwd(),
  runner = spawnSync,
) {
  await verifyMigration(root);
  const pkg = JSON.parse(
    await readFile(resolve(root, 'node_modules/wrangler/package.json'), 'utf8'),
  );
  requireThat(pkg.version === '4.92.0', 'WRANGLER_VERSION_MISMATCH');
  const temporary = await mkdtemp(join(tmpdir(), 'gemnao-d1-control-'));
  try {
    const config = join(temporary, 'wrangler.json');
    await writeFile(
      config,
      JSON.stringify({
        name: 'gemnao-d1-control',
        account_id: target.account,
        d1_databases: [
          {
            binding: 'DB',
            database_name: target.databaseName,
            database_id: target.database,
            migrations_dir: resolve(root, 'ops/d1/migrations'),
            migrations_table: 'd1_migrations',
          },
        ],
      }),
    );
    const result = runner(
      process.execPath,
      [
        resolve(root, 'node_modules/wrangler/bin/wrangler.js'),
        'd1',
        'migrations',
        'apply',
        'DB',
        '--remote',
        '--config',
        config,
      ],
      {
        cwd: root,
        timeout: 180000,
        maxBuffer: 2 * 1024 * 1024,
        stdio: ['ignore', 'pipe', 'pipe'],
        env: {
          PATH: process.env.PATH,
          HOME: temporary,
          CI: 'true',
          CLOUDFLARE_ACCOUNT_ID: target.account,
          CLOUDFLARE_API_TOKEN: token,
          WRANGLER_SEND_METRICS: 'false',
          WRANGLER_WRITE_LOGS: 'false',
          WRANGLER_LOG: 'error',
        },
      },
    );
    // Do not print child stdout/stderr; uncertain writes require a fresh preflight.
    requireThat(
      result.status === 0 && !result.error,
      'APPLY_OUTCOME_UNCONFIRMED_RUN_PREFLIGHT',
    );
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
}
export async function execute(
  env,
  { api, apply, verify = verifyMigration, checkpoint = async () => {} } = {},
) {
  const operation = env.D1_OPERATION;
  assertContext(env, operation);
  requireThat(
    env.D1_PROTECTED_ENVIRONMENT === target.environment,
    'PROTECTED_ENVIRONMENT_REQUIRED',
  );
  await verify();
  const token = env.CLOUDFLARE_API_TOKEN;
  if (operation === 'settings')
    return {
      operation,
      credentialConfigured: Boolean(token),
      noCloudflareRequests: true,
    };
  validateCredential(token);
  const client = api || cloudflareClient(token);
  const before = await collect(client, { diagnostic: operation === 'preflight' });
  if (operation === 'preflight') return { ...before, operation };
  requireThat(operation === 'apply', 'SETTINGS_MODE_HAS_NO_DB_ACTION');
  if (before.state === 'already_applied')
    return { ...before, operation, result: 'already_applied_no_write' };
  requireThat(
    before.preflightSHA256 === env.D1_PREFLIGHT_SHA256,
    'PREFLIGHT_CHANGED_REVIEW_REQUIRED',
  );
  const restore = await client(
    `/accounts/${target.account}/d1/database/${target.database}/time_travel/bookmark`,
  );
  requireThat(
    typeof restore?.bookmark === 'string' &&
      /^[A-Za-z0-9._:=-]{1,512}$/.test(restore.bookmark),
    'RESTORE_BOOKMARK_UNVERIFIED',
  );
  const restorePoint = {
    bookmark: restore.bookmark,
    capturedAt: new Date().toISOString(),
  };
  await checkpoint({
    phase: 'before_apply',
    restorePoint,
    preflightSHA256: before.preflightSHA256,
  });
  await (apply || (() => applyOnce(token)))();
  const after = await collect(client);
  requireThat(
    after.state === 'already_applied',
    'READBACK_INCOMPLETE_RUN_PREFLIGHT',
  );
  return { ...after, operation, result: 'applied_and_read_back', restorePoint };
}
async function main() {
  try {
    const report = await execute(process.env, {
      checkpoint: async (record) => {
        const text = JSON.stringify(record);
        console.log(text);
        if (process.env.GITHUB_STEP_SUMMARY)
          await appendFile(
            process.env.GITHUB_STEP_SUMMARY,
            `\nPre-apply restore metadata: \`${text}\`\n`,
          );
      },
    });
    const json = JSON.stringify(report, null, 2);
    console.log(json);
    if (process.env.GITHUB_STEP_SUMMARY)
      await appendFile(
        process.env.GITHUB_STEP_SUMMARY,
        `\n### D1 ${report.operation}\n\n\`\`\`json\n${json}\n\`\`\`\n`,
      );
  } catch (error) {
    console.error(
      JSON.stringify({
        status: 'blocked',
        ...(error instanceof Blocked && error.diagnostic ? { diagnostic: error.diagnostic } : {}),
        ...(error instanceof Blocked &&
        [...requestStages.values()].includes(error.stage)
          ? { stage: error.stage }
          : {}),
        code:
          error instanceof Blocked
            ? error.code
            : 'UNEXPECTED_FAILURE_NO_AUTOMATIC_RETRY',
      }),
    );
    process.exitCode = 1;
  }
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
)
  await main();
