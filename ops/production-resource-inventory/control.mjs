// Manual metadata inventory only. No SQL, mutation, login or credential export.
import { appendFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const TARGET = Object.freeze({
  repository: 'poe2-build-navi-jp/gemnao',
  branch: 'gemunao',
  environment: 'gemnao-d1-production',
  workflow: 'Gemnao production resource inventory',
  account: '6a09a32cba1288cccce5912015086a35',
  project: 'gemnao',
});
const PROPOSED = Object.freeze([
  'gemnao-diagnosis-production',
  'gemnao-diagnostic-feedback-production',
]);
const UUID = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
const SHA = /^[a-f0-9]{40}$/;
export class Blocked extends Error {}
const check = (ok, code) => {
  if (!ok) throw new Blocked(code);
};
const credential = (value) =>
  typeof value === 'string' && /^[\x21-\x7e]+$/.test(value);

export function assertContext(env) {
  check(
    env.GITHUB_ACTIONS === 'true' &&
      env.GITHUB_REPOSITORY === TARGET.repository &&
      env.GITHUB_REF === `refs/heads/${TARGET.branch}` &&
      env.GITHUB_EVENT_NAME === 'workflow_dispatch' &&
      env.GITHUB_WORKFLOW === TARGET.workflow &&
      env.GITHUB_RUN_ATTEMPT === '1' &&
      /^[1-9][0-9]*$/.test(env.GITHUB_RUN_ID || '') &&
      SHA.test(env.GITHUB_SHA || ''),
    'MANUAL_FIRST_RUN_CONTEXT_REQUIRED',
  );
}

// Every caller supplies an internally constructed URL. No redirects or retries.
async function getJson(fetcher, url, token, category) {
  let response;
  try {
    response = await fetcher(url, {
      method: 'GET',
      redirect: 'error',
      signal: AbortSignal.timeout(30000),
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    });
  } catch {
    throw new Blocked(`${category}_REQUEST_FAILED`);
  }
  check(response.ok, `${category}_HTTP_${response.status}`);
  try {
    return await response.json();
  } catch {
    throw new Blocked(`${category}_INVALID_JSON`);
  }
}

export async function gate(env, fetcher = fetch) {
  assertContext(env);
  check(credential(env.GH_TOKEN), 'EXISTING_GITHUB_AUTH_REQUIRED');
  const base = `https://api.github.com/repos/${TARGET.repository}/environments/${TARGET.environment}`;
  const environment = await getJson(fetcher, base, env.GH_TOKEN, 'ENVIRONMENT');
  const policies = await getJson(
    fetcher,
    `${base}/deployment-branch-policies?per_page=100`,
    env.GH_TOKEN,
    'ENVIRONMENT',
  );
  check(
    environment.name === TARGET.environment &&
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
      policies.branch_policies[0].name === TARGET.branch &&
      policies.branch_policies[0].type === 'branch',
    'EXISTING_BRANCH_POLICY_REQUIRED',
  );
  return TARGET.environment;
}

export async function inventory(env, fetcher = fetch, now = Date.now) {
  assertContext(env);
  check(
    env.INVENTORY_PROTECTED_ENVIRONMENT === TARGET.environment,
    'PROTECTED_ENVIRONMENT_REQUIRED',
  );
  // Recheck protection after the existing owner's approval wait.
  await gate(env, fetcher);
  check(
    credential(env.CLOUDFLARE_API_TOKEN),
    'EXISTING_CLOUDFLARE_AUTH_REQUIRED',
  );
  const started = now();
  const base = `https://api.cloudflare.com/client/v4/accounts/${TARGET.account}`;
  const read = async (suffix) => {
    check(
      suffix === '' ||
        suffix === `/pages/projects/${TARGET.project}` ||
        /^\/d1\/database\?per_page=100&page=(?:[1-9]|10)$/.test(suffix),
      'FIXED_GET_TARGET_REQUIRED',
    );
    const data = await getJson(
      fetcher,
      base + suffix,
      env.CLOUDFLARE_API_TOKEN,
      'CLOUDFLARE',
    );
    check(
      data.success === true &&
        Array.isArray(data.errors) &&
        data.errors.length === 0,
      'CLOUDFLARE_RESPONSE_FAILED',
    );
    return data;
  };
  check((await read('')).result?.id === TARGET.account, 'ACCOUNT_ID_MISMATCH');
  const pages = (await read(`/pages/projects/${TARGET.project}`)).result;
  check(
    pages?.name === TARGET.project &&
      pages.production_branch === TARGET.branch &&
      pages.source?.config?.owner === 'poe2-build-navi-jp' &&
      pages.source?.config?.repo_name === 'gemnao',
    'PAGES_IDENTITY_MISMATCH',
  );
  const bindings = {};
  for (const [name, binding] of Object.entries(
    pages.deployment_configs?.production?.d1_databases || {},
  )) {
    check(
      /^[A-Za-z_][A-Za-z0-9_]*$/.test(name) && UUID.test(binding?.id || ''),
      'PAGES_BINDING_INVALID',
    );
    bindings[name] = binding.id;
  }
  const deployment = pages.canonical_deployment;
  check(
    deployment?.environment === 'production' &&
      UUID.test(deployment.id || '') &&
      SHA.test(deployment.deployment_trigger?.metadata?.commit_hash || ''),
    'PAGES_DEPLOYMENT_INVALID',
  );
  const databases = [],
    ids = new Set();
  let total;
  for (let page = 1; page <= 10; page++) {
    const data = await read(`/d1/database?per_page=100&page=${page}`);
    const info = data.result_info;
    check(
      Array.isArray(data.result) &&
        info?.page === page &&
        info.per_page === 100 &&
        Number.isSafeInteger(info.total_count) &&
        info.total_count >= 0 &&
        info.total_count <= 1000 &&
        (info.count === undefined || info.count === data.result.length),
      'DATABASE_PAGINATION_INVALID',
    );
    if (total === undefined) total = info.total_count;
    check(
      total === info.total_count &&
        data.result.length === Math.min(100, total - databases.length),
      'DATABASE_INVENTORY_CHANGED',
    );
    for (const db of data.result) {
      check(
        UUID.test(db?.uuid || '') &&
          !ids.has(db.uuid) &&
          typeof db.name === 'string' &&
          db.name.length > 0 &&
          db.name.length <= 256 &&
          Array.from(db.name).every(
            (char) => char.charCodeAt(0) >= 32 && char.charCodeAt(0) !== 127,
          ),
        'DATABASE_IDENTITY_INVALID',
      );
      ids.add(db.uuid);
      databases.push({ id: db.uuid, name: db.name });
    }
    if (databases.length === total) break;
  }
  check(databases.length === total, 'DATABASE_INVENTORY_INCOMPLETE');
  const observed = now();
  check(
    Number.isSafeInteger(started) &&
      observed >= started &&
      observed - started <= 300000,
    'OBSERVATION_NOT_CURRENT',
  );
  return {
    version: 1,
    purpose: 'production-resource-metadata-only',
    mutationAllowed: false,
    runId: env.GITHUB_RUN_ID,
    sourceSha: env.GITHUB_SHA,
    startedAtUtc: new Date(started).toISOString(),
    observedAtUtc: new Date(observed).toISOString(),
    utcUsageDay: new Date(observed).toISOString().slice(0, 10),
    accountId: TARGET.account,
    pages: {
      name: TARGET.project,
      productionBranch: TARGET.branch,
      productionD1Bindings: bindings,
      deploymentId: deployment.id,
      deploymentCommit: deployment.deployment_trigger.metadata.commit_hash,
    },
    databases,
    databaseCount: databases.length,
    // Published Free limit, not proof of this account's plan or usage headroom.
    freePlanDatabaseLimit: 10,
    slotsUnderFreePlanLimit: Math.max(0, 10 - databases.length),
    accountPlanVerified: false,
    usageHeadroomVerified: false,
    creationPermissionVerified: false,
    proposedNames: PROPOSED.map((name) => ({
      name,
      exists: databases.some((db) => db.name === name),
    })),
  };
}

export function failureReport(error) {
  return {
    status: 'blocked',
    code: error instanceof Blocked ? error.message : 'INVENTORY_FAILED',
  };
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  try {
    const mode = process.argv[2];
    check(['gate', 'inventory'].includes(mode), 'INVALID_MODE');
    if (mode === 'gate') {
      const environment = await gate(process.env);
      if (process.env.GITHUB_OUTPUT)
        await appendFile(
          process.env.GITHUB_OUTPUT,
          `environment=${environment}\n`,
        );
      console.log(
        'Existing protected Environment verified; no Cloudflare request made.',
      );
    } else {
      const report = JSON.stringify(await inventory(process.env), null, 2);
      if (process.env.GITHUB_STEP_SUMMARY)
        await appendFile(
          process.env.GITHUB_STEP_SUMMARY,
          `\n\`\`\`json\n${report}\n\`\`\`\n`,
        );
      console.log(report);
    }
  } catch (error) {
    console.error(JSON.stringify(failureReport(error)));
    process.exitCode = 1;
  }
}
