// Operator-only, fixed metadata inventory. No row reads, writes, or arbitrary SQL.
import { createHash } from 'node:crypto';
import { appendFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
export const target = Object.freeze({
  repository: 'poe2-build-navi-jp/gemnao',
  branch: 'gemunao',
  environment: 'gemnao-d1-production',
  project: 'gemnao',
  account: '6a09a32cba1288cccce5912015086a35',
  database: '385a194f-5119-4bbe-9afe-2e6ce4ceb341',
  databaseName: 'gemnao-db',
});
export class Blocked extends Error {
  constructor(code) {
    super(code);
    this.code = code;
  }
}
const check = (condition, code) => {
  if (!condition) throw new Blocked(code);
};
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
const hash = (value) =>
  createHash('sha256')
    .update(JSON.stringify(canonical(value)))
    .digest('hex');
export const tables = Object.freeze([
  'game_requests',
  'game_request_daily_salts',
  'game_request_attempts',
]);
const indexes = Object.freeze([
  'sqlite_autoindex_game_requests_1',
  'sqlite_autoindex_game_requests_2',
  'game_requests_pending',
  'sqlite_autoindex_game_request_daily_salts_1',
  'sqlite_autoindex_game_request_attempts_1',
  'game_request_attempts_network',
  'game_request_attempts_day',
]);
const columns = Object.freeze({
  game_requests: [
    'id',
    'game_name',
    'normalized_name',
    'locale',
    'status',
    'canonical_game',
    'reason_code',
    'lease_token',
    'lease_until',
    'attempt_count',
    'publication_url',
    'publication_sha',
    'created_at',
    'updated_at',
  ],
  game_request_daily_salts: ['day', 'salt', 'expires_at'],
  game_request_attempts: ['id', 'day', 'fingerprint', 'created_at'],
});
export const queries = Object.freeze({
  objects:
    "SELECT type,name,tbl_name,sql FROM sqlite_schema WHERE tbl_name IN ('game_requests','game_request_daily_salts','game_request_attempts') OR name IN ('game_requests','game_request_daily_salts','game_request_attempts','game_requests_pending','game_request_attempts_network','game_request_attempts_day') ORDER BY type,name",
  ...Object.fromEntries(
    tables.flatMap((name) => [
      [`${name}:columns`, `PRAGMA table_xinfo(${name})`],
      [`${name}:indexes`, `PRAGMA index_list(${name})`],
      [`${name}:foreignKeys`, `PRAGMA foreign_key_list(${name})`],
    ]),
  ),
  ...Object.fromEntries(
    indexes.map((name) => [
      `${name}:indexColumns`,
      `PRAGMA index_xinfo(${name})`,
    ]),
  ),
  registryObject:
    "SELECT type,name,sql FROM sqlite_schema WHERE name='d1_migrations'",
  registryColumns: 'PRAGMA table_xinfo(d1_migrations)',
  history: 'SELECT id,name FROM d1_migrations ORDER BY id',
});
export function assertContext(env, mode) {
  check(
    env.GITHUB_ACTIONS === 'true' &&
      env.GITHUB_REPOSITORY === target.repository &&
      env.GITHUB_REF === `refs/heads/${target.branch}` &&
      env.GITHUB_EVENT_NAME === 'workflow_dispatch' &&
      env.GITHUB_WORKFLOW === 'Gemnao game request metadata inventory' &&
      env.GITHUB_RUN_ATTEMPT === '1',
    'MANUAL_FIRST_RUN_PRODUCTION_CONTEXT_REQUIRED',
  );
  check(['gate', 'inventory'].includes(mode), 'INVALID_MODE');
  if (mode === 'inventory')
    check(
      env.INVENTORY_PROTECTED_ENVIRONMENT === target.environment,
      'PROTECTED_ENVIRONMENT_REQUIRED',
    );
}
async function readJson(fetcher, url, init, category) {
  let response, data;
  try {
    response = await fetcher(url, {
      ...init,
      redirect: 'error',
      signal: AbortSignal.timeout(30000),
    });
  } catch {
    throw new Blocked(`${category}_REQUEST_FAILED`);
  }
  check(response.ok, `${category}_HTTP_FAILED`);
  try {
    data = await response.json();
  } catch {
    throw new Blocked(`${category}_INVALID_JSON`);
  }
  return data;
}
export async function gate(env, fetcher = fetch) {
  assertContext(env, 'gate');
  check(
    typeof env.GH_TOKEN === 'string' && env.GH_TOKEN.length > 0,
    'GITHUB_AUTH_REQUIRED',
  );
  const base = `https://api.github.com/repos/${target.repository}/environments/${target.environment}`;
  const init = {
    headers: {
      Authorization: `Bearer ${env.GH_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  };
  const environment = await readJson(fetcher, base, init, 'ENVIRONMENT');
  const policies = await readJson(
    fetcher,
    `${base}/deployment-branch-policies?per_page=100`,
    init,
    'ENVIRONMENT',
  );
  check(
    environment.name === target.environment &&
      environment.protection_rules?.some(
        (r) => r.type === 'required_reviewers' && r.reviewers?.length > 0,
      ),
    'EXISTING_REVIEWER_PROTECTION_REQUIRED',
  );
  check(
    environment.deployment_branch_policy?.custom_branch_policies === true &&
      environment.deployment_branch_policy?.protected_branches === false &&
      policies.total_count === 1 &&
      policies.branch_policies?.length === 1 &&
      policies.branch_policies[0].name === target.branch &&
      policies.branch_policies[0].type === 'branch',
    'EXISTING_PRODUCTION_BRANCH_POLICY_REQUIRED',
  );
  return target.environment;
}
export function summarize(raw, deploymentCommit) {
  // Raw DDL, defaults, identifiers and history stay in memory. Only fixed labels,
  // counts, booleans, and fingerprints reach public workflow logs.
  const result = {
    version: 1,
    purpose: 'game-request-metadata-only',
    mutationAllowed: false,
    deploymentCommit,
    tables: Object.fromEntries(
      tables.map((name) => {
        const own = raw.objects.filter((o) => o.tbl_name === name);
        const actual = raw[`${name}:columns`];
        return [
          name,
          {
            present: own.some((o) => o.type === 'table' && o.name === name),
            columnCount: actual.length,
            expectedColumnNamesInOrder:
              actual.length === columns[name].length &&
              actual.every((c, i) => c.name === columns[name][i]),
            indexCount: raw[`${name}:indexes`].length,
            triggerCount: own.filter((o) => o.type === 'trigger').length,
            foreignKeyCount: raw[`${name}:foreignKeys`].length,
            structureSHA256: hash({
              objects: own,
              columns: actual,
              indexes: raw[`${name}:indexes`],
              foreignKeys: raw[`${name}:foreignKeys`],
              indexColumns: indexes
                .filter((idx) =>
                  raw[`${name}:indexes`].some((entry) => entry.name === idx),
                )
                .map((idx) => [idx, raw[`${idx}:indexColumns`]]),
            }),
          },
        ];
      }),
    ),
    history: {
      readable: raw.history !== null,
      recordCount: raw.history?.length ?? 0,
      validIdNameShape:
        raw.history !== null &&
        raw.history.every(
          (r) =>
            Number.isSafeInteger(r.id) &&
            r.id > 0 &&
            typeof r.name === 'string',
        ),
      idNameSHA256: hash(raw.history),
      registryStructureSHA256: hash({
        objects: raw.registryObject,
        columns: raw.registryColumns,
      }),
    },
  };
  return { ...result, inventorySHA256: hash(result) };
}
export async function inventory(env, fetcher = fetch) {
  assertContext(env, 'inventory');
  // Recheck after the owner approval wait; stale gate evidence is insufficient.
  await gate(env, fetcher);
  const token = env.CLOUDFLARE_API_TOKEN;
  check(
    typeof token === 'string' && /^[\x21-\x7e]+$/.test(token),
    'EXISTING_CLOUDFLARE_CREDENTIAL_REQUIRED',
  );
  const base = `https://api.cloudflare.com/client/v4/accounts/${target.account}`;
  const api = async (suffix, sql) => {
    check(
      [
        `/pages/projects/${target.project}`,
        `/d1/database/${target.database}`,
        `/d1/database/${target.database}/query`,
      ].includes(suffix),
      'FIXED_TARGET_REQUIRED',
    );
    if (sql !== undefined)
      check(
        Object.values(queries).includes(sql) && suffix.endsWith('/query'),
        'FIXED_METADATA_QUERY_REQUIRED',
      );
    const body = await readJson(
      fetcher,
      base + suffix,
      {
        method: sql === undefined ? 'GET' : 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        ...(sql === undefined ? {} : { body: JSON.stringify({ sql }) }),
      },
      'CLOUDFLARE',
    );
    check(body.success === true, 'CLOUDFLARE_OPERATION_FAILED');
    return body.result;
  };
  const pages = await api(`/pages/projects/${target.project}`);
  const deployment = pages.canonical_deployment;
  check(
    pages.name === target.project &&
      pages.production_branch === target.branch &&
      pages.source?.config?.owner === 'poe2-build-navi-jp' &&
      pages.source?.config?.repo_name === 'gemnao' &&
      pages.deployment_configs?.production?.d1_databases?.DB?.id ===
        target.database,
    'CURRENT_PRODUCTION_BINDING_MISMATCH',
  );
  check(
    !Object.values(pages.deployment_configs?.preview?.d1_databases || {}).some(
      (d) => d?.id === target.database,
    ),
    'PREVIEW_SHARES_PRODUCTION_DB',
  );
  check(
    deployment?.environment === 'production' &&
      deployment.latest_stage?.status === 'success' &&
      deployment.deployment_trigger?.metadata?.branch === target.branch &&
      /^[a-f0-9]{40}$/.test(
        deployment.deployment_trigger?.metadata?.commit_hash || '',
      ),
    'CURRENT_DEPLOYMENT_UNVERIFIED',
  );
  const database = await api(`/d1/database/${target.database}`);
  check(
    database.uuid === target.database && database.name === target.databaseName,
    'D1_IDENTITY_MISMATCH',
  );
  const raw = {};
  for (const [key, sql] of Object.entries(queries)) {
    if (
      key === 'history' &&
      !(
        raw.registryObject.length === 1 &&
        raw.registryObject[0].type === 'table' &&
        raw.registryObject[0].name === 'd1_migrations' &&
        ['id', 'name'].every((name) =>
          raw.registryColumns.some((c) => c.name === name && c.hidden === 0),
        )
      )
    ) {
      raw.history = null;
      continue;
    }
    const result = await api(`/d1/database/${target.database}/query`, sql);
    check(
      Array.isArray(result) &&
        result.length === 1 &&
        result[0].success === true &&
        result[0].meta?.changed_db === false &&
        Array.isArray(result[0].results),
      'READ_ONLY_RESPONSE_REQUIRED',
    );
    raw[key] = result[0].results;
  }
  return summarize(raw, deployment.deployment_trigger.metadata.commit_hash);
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  try {
    const mode = process.argv[2];
    assertContext(process.env, mode);
    if (mode === 'gate') {
      const environment = await gate(process.env);
      check(Boolean(process.env.GITHUB_OUTPUT), 'GITHUB_OUTPUT_REQUIRED');
      await appendFile(
        process.env.GITHUB_OUTPUT,
        `environment=${environment}\n`,
      );
      console.log(
        'Existing production reviewer and branch protection verified. No Cloudflare request made.',
      );
    } else {
      const report = await inventory(process.env);
      const json = JSON.stringify(report, null, 2);
      console.log(json);
      if (process.env.GITHUB_STEP_SUMMARY)
        await appendFile(
          process.env.GITHUB_STEP_SUMMARY,
          `\n### Game request metadata inventory\n\n\`\`\`json\n${json}\n\`\`\`\n`,
        );
    }
  } catch (error) {
    console.error(
      JSON.stringify({
        status: 'blocked',
        code: error instanceof Blocked ? error.code : 'INVENTORY_FAILED',
      }),
    );
    process.exitCode = 1;
  }
}
