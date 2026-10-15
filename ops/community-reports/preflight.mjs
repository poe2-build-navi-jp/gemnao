// Read-only, manual capability discovery. Never registers/retrieves secrets,
// writes Cloudflare resources, queries SQL or changes the existing Environment.
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
export const target = Object.freeze({
  repository: 'poe2-build-navi-jp/gemnao',
  branch: 'gemunao',
  environment: 'gemnao-d1-production',
  account: '6a09a32cba1288cccce5912015086a35',
  workflow: 'Community reports analytics preflight',
});
class PreflightFailure extends Error {
  constructor(code, diagnostic) {
    super(code);
    this.diagnostic = diagnostic;
  }
}
const need = (ok, code) => {
  if (!ok) throw new PreflightFailure(code);
};
// Only locally constructed failures can supply log text. Provider exceptions,
// messages, headers, keys, URLs and resource values never enter this projection.
export function failureLines(error) {
  if (!(error instanceof PreflightFailure)) return ['BLOCKED: READ_FAILED'];
  return [
    'BLOCKED: ' + error.message,
    ...(error.diagnostic
      ? ['DIAGNOSTIC: ' + JSON.stringify(error.diagnostic)]
      : []),
  ];
}
const metadataLabels = new Set([
  'D1_LIST',
  'WORKER_LIST',
  'CRON_LIST',
  'NAMESPACE_LIST',
]);
const valueType = (value) =>
  value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value;
function responseDiagnostic(label, status, data, read = false) {
  return {
    endpoint: label,
    httpStatus:
      Number.isInteger(status) && status >= 100 && status <= 599 ? status : null,
    envelopeType: read ? valueType(data) : 'unread',
    ...(read
      ? {
          successType: valueType(data?.success),
          success: typeof data?.success === 'boolean' ? data.success : null,
          errorsType: valueType(data?.errors),
          errorCodes: Array.isArray(data?.errors)
            ? data.errors.slice(0, 8).flatMap((error) =>
                Number.isSafeInteger(error?.code) &&
                error.code >= 0 && error.code <= 999999
                  ? [error.code]
                  : [],
              )
            : [],
          resultType: valueType(data?.result),
        }
      : {}),
  };
}
export function context(env) {
  need(
    env.GITHUB_ACTIONS === 'true' &&
      env.GITHUB_REPOSITORY === target.repository &&
      env.GITHUB_REF === `refs/heads/${target.branch}` &&
      env.GITHUB_EVENT_NAME === 'workflow_dispatch' &&
      env.GITHUB_WORKFLOW === target.workflow &&
      env.GITHUB_RUN_ATTEMPT === '1' &&
      /^[a-f0-9]{40}$/.test(env.GITHUB_SHA || '') &&
      /^[1-9][0-9]*$/.test(env.GITHUB_RUN_ID || ''),
    'MANUAL_FIXED_CONTEXT_REQUIRED',
  );
}
async function request(fetcher, url, token, body) {
  const path = new URL(url).pathname;
  const label = url.startsWith('https://api.github.com/')
    ? 'ENVIRONMENT'
    : path.endsWith('/d1/database')
      ? 'D1_LIST'
      : path.endsWith('/workers/scripts')
        ? 'WORKER_LIST'
        : path.endsWith('/schedules')
          ? 'CRON_LIST'
          : path.endsWith('/workers/durable_objects/namespaces')
            ? 'NAMESPACE_LIST'
            : body?.query?.includes('__schema')
              ? 'GRAPHQL_SCHEMA'
              : 'GRAPHQL_SETTINGS';
  let r;
  try {
    r = await fetcher(url, {
      method: body === undefined ? 'GET' : 'POST',
      redirect: 'error',
      signal: AbortSignal.timeout(10000),
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
  } catch {
    throw new PreflightFailure(label + '_REQUEST_FAILED');
  }
  const httpStatus =
    Number.isInteger(r.status) && r.status >= 100 && r.status <= 599
      ? r.status : null;
  if (!(r.ok && r.body))
    throw new PreflightFailure(
      label + '_HTTP_' + (httpStatus ?? 'UNKNOWN'),
      responseDiagnostic(label, httpStatus),
    );
  const reader = r.body.getReader(),
    chunks = [];
  let size = 0;
  for (;;) {
    const p = await reader.read();
    if (p.done) break;
    size += p.value.length;
    if (size > 4_000_000) {
      await reader.cancel();
      throw new PreflightFailure('READ_TOO_LARGE');
    }
    chunks.push(p.value);
  }
  const b = new Uint8Array(size);
  let at = 0;
  for (const c of chunks) {
    b.set(c, at);
    at += c.length;
  }
  let data;
  try {
    data = JSON.parse(new TextDecoder('utf8', { fatal: true }).decode(b));
  } catch {
    throw new PreflightFailure('READ_INVALID_JSON');
  }
  // Same strict REST-envelope requirement as before. Diagnose failures without
  // accepting alternate envelopes, suppressing errors or continuing to GraphQL.
  if (
    metadataLabels.has(label) &&
    !(data?.success === true &&
      Array.isArray(data?.errors) && data.errors.length === 0)
  )
    throw new PreflightFailure(
      label + '_METADATA_READ_FAILED',
      responseDiagnostic(label, httpStatus, data, true),
    );
  return data;
}
export async function gate(env, fetcher = fetch) {
  context(env);
  need(env.GH_TOKEN, 'EXISTING_GITHUB_AUTH_REQUIRED');
  const base = `https://api.github.com/repos/${target.repository}/environments/${target.environment}`;
  const e = await request(fetcher, base, env.GH_TOKEN),
    p = await request(
      fetcher,
      base + '/deployment-branch-policies?per_page=100',
      env.GH_TOKEN,
    );
  need(
    e.name === target.environment &&
      e.protection_rules?.some(
        (r) => r.type === 'required_reviewers' && r.reviewers?.length > 0,
      ),
    'EXISTING_REVIEWER_REQUIRED',
  );
  need(
    e.deployment_branch_policy?.custom_branch_policies === true &&
      e.deployment_branch_policy?.protected_branches === false &&
      p.total_count === 1 &&
      p.branch_policies?.length === 1 &&
      p.branch_policies[0].name === target.branch &&
      p.branch_policies[0].type === 'branch',
    'EXISTING_EXACT_BRANCH_REQUIRED',
  );
  return target.environment;
}
const unwrap = (t) => t?.name || (t?.ofType ? unwrap(t.ofType) : null);
// Only names and type structure are kept; descriptions, provider errors, account
// values, SQL, query samples and credential payloads never enter the receipt.
export async function discover(env, fetcher = fetch) {
  await gate(env, fetcher);
  need(
    env.REPORTS_PREFLIGHT_ENVIRONMENT === target.environment,
    'PROTECTED_ENVIRONMENT_REQUIRED',
  );
  need(
    typeof env.CLOUDFLARE_API_TOKEN === 'string' &&
      /^[\x21-\x7e]{20,256}$/.test(env.CLOUDFLARE_API_TOKEN),
    'EXISTING_CLOUDFLARE_AUTH_REQUIRED',
  );
  const token = env.CLOUDFLARE_API_TOKEN,
    base = `https://api.cloudflare.com/client/v4/accounts/${target.account}`;
  const rest = (suffix) => request(fetcher, base + suffix, token);
  const dbs = await rest('/d1/database?per_page=100&page=1');
  need(
    Array.isArray(dbs.result) &&
      dbs.result_info?.total_count === dbs.result.length,
    'DATABASE_LIST_INCOMPLETE',
  );
  const workers = await rest('/workers/scripts');
  need(
    Array.isArray(workers.result) && workers.result.length <= 24,
    'WORKER_LIST_BUDGET',
  );
  for (const w of workers.result) {
    need(
      typeof w.id === 'string' && /^[A-Za-z0-9_-]{1,63}$/.test(w.id),
      'WORKER_ID_INVALID',
    );
    await rest(`/workers/scripts/${w.id}/schedules`);
  }
  const namespaces = await rest(
    '/workers/durable_objects/namespaces?per_page=1000&page=1',
  );
  need(
    Array.isArray(namespaces.result) &&
      namespaces.result_info?.total_count === namespaces.result.length,
    'NAMESPACE_LIST_INCOMPLETE',
  );
  const q =
    'query CommunityReportsSchema { __schema { types { name inputFields { name } fields { name type { name kind ofType { name kind ofType { name kind } } } args { name type { name kind ofType { name kind } } } } } } }';
  const schema = await request(
    fetcher,
    'https://api.cloudflare.com/client/v4/graphql',
    token,
    { query: q },
  );
  need(
    (schema.errors === undefined ||
      schema.errors === null ||
      (Array.isArray(schema.errors) && schema.errors.length === 0)) &&
      Array.isArray(schema.data?.__schema?.types),
    'ANALYTICS_SCHEMA_UNAVAILABLE',
  );
  const types = new Map(schema.data.__schema.types.map((t) => [t.name, t]));
  const roots = [];
  for (const t of types.values())
    for (const f of t.fields || []) {
      if (
        f.args?.some((a) => a.name === 'filter') &&
        /^(?:workersInvocationsAdaptive|d1(?:AnalyticsAdaptiveGroups|StorageAdaptiveGroups)|durableObjects[A-Z][A-Za-z0-9]*Groups)$/.test(
          f.name,
        )
      )
        roots.push(f);
    }
  const selected = new Map();
  for (const root of roots) {
    const row = types.get(unwrap(root.type));
    const fields = {};
    for (const f of row?.fields || []) {
      if (['sum', 'max', 'dimensions'].includes(f.name)) {
        fields[f.name] = (types.get(unwrap(f.type))?.fields || [])
          .map((x) => x.name)
          .filter((n) => /^[A-Za-z][A-Za-z0-9_]{0,100}$/.test(n));
      }
    }
    const filter = root.args?.find((a) => a.name === 'filter');
    fields.filter = (types.get(unwrap(filter?.type))?.inputFields || []).map(
      (x) => x.name,
    );
    selected.set(root.name, fields);
  }
  need(
    selected.has('workersInvocationsAdaptive') &&
      selected.has('d1AnalyticsAdaptiveGroups') &&
      [...selected.keys()].some((x) => x.startsWith('durableObjects')),
    'REQUIRED_DATASETS_UNAVAILABLE',
  );
  const datasets = Object.fromEntries(
    [...selected].sort(([a], [b]) => a.localeCompare(b)),
  );
  // Root availability requires an account-scoped request, not introspection alone.
  const settingsQuery = `query CommunityReportsAccess {viewer{accounts(filter:{accountTag:"${target.account}"}){settings{${Object.keys(
    datasets,
  )
    .map((k) => `${k}{enabled availableFields}`)
    .join(' ')}}}}}`;
  const availability = await request(
    fetcher,
    'https://api.cloudflare.com/client/v4/graphql',
    token,
    { query: settingsQuery },
  );
  need(
    (availability.errors === undefined ||
      availability.errors === null ||
      (Array.isArray(availability.errors) &&
        availability.errors.length === 0)) &&
      availability.data?.viewer?.accounts?.length === 1,
    'ANALYTICS_ACCOUNT_ACCESS_UNAVAILABLE',
  );
  const settings = availability.data.viewer.accounts[0]?.settings;
  need(
    settings && typeof settings === 'object',
    'ANALYTICS_SETTINGS_UNAVAILABLE',
  );
  return {
    operation: 'read-community-reports-capabilities',
    metadataReadable: true,
    accountAnalyticsReadable: true,
    datasets,
    enabled: Object.fromEntries(
      Object.keys(datasets).map((k) => [k, settings[k]?.enabled === true]),
    ),
    usageValuesVerified: false,
    profileVerified: false,
    productionChanged: false,
    secretsExported: false,
  };
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  try {
    if (process.argv[2] === 'gate') {
      const e = await gate(process.env);
      const { appendFile } = await import('node:fs/promises');
      need(process.env.GITHUB_OUTPUT, 'JOB_OUTPUT_REQUIRED');
      await appendFile(process.env.GITHUB_OUTPUT, `environment=${e}\n`);
      console.log('PASS: existing protected Environment verified.');
    } else {
      need(process.argv[2] === 'discover', 'MODE_REQUIRED');
      console.log(JSON.stringify(await discover(process.env), null, 2));
    }
  } catch (e) {
    for (const line of failureLines(e)) console.error(line);
    process.exitCode = 1;
  }
}
