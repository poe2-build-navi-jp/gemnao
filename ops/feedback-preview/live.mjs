// Runs only as the reviewed local JavaScript action in the protected job.
import { readFile, appendFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { TARGET, sha256 } from './controller.mjs';
import { PLAN_HASH, validateRecord, createPreparedAdapter } from './adapter.mjs';
import { ARTIFACT_CLIENT_PIN, createArtifactClaims } from './artifact-claim.mjs';

export const SETUP = Object.freeze({
  ref: 'refs/heads/prepare/feedback-preview-controller-20261007',
  environment: 'gemnao-preview-data', environmentId: 23658815122,
  reviewerLogin: 'poe2-build-navi-jp',
  recordSecret: 'GEMNAO_PREVIEW_APPROVAL_RECORD', digestSecret: 'GEMNAO_PREVIEW_APPROVAL_SHA256',
  secret: 'GEMNAO_PREVIEW_CLOUDFLARE_API_TOKEN',
});
const repoPath = `/repos/${TARGET.repository}`;
const workflowPath = '.github/workflows/feedback-preview-control.yml';
function need(ok, code) { if (!ok) throw new Error(`BLOCKED:${code}`); }
export function validateContext(env, checkoutSha, protectedJob) {
  need(env.GITHUB_ACTIONS === 'true' && env.GITHUB_REPOSITORY === TARGET.repository
    && env.GITHUB_EVENT_NAME === 'workflow_dispatch' && env.GITHUB_REF === SETUP.ref
    && env.GITHUB_RUN_ATTEMPT === '1' && /^[1-9][0-9]*$/.test(env.GITHUB_RUN_ID ?? '')
    && /^[a-f0-9]{40}$/.test(env.GITHUB_SHA ?? '') && checkoutSha === env.GITHUB_SHA
    && env.GITHUB_WORKFLOW_SHA === env.GITHUB_SHA
    && env.GITHUB_WORKFLOW_REF === `${TARGET.repository}/${workflowPath}@${SETUP.ref}`
    && env.RUNNER_ENVIRONMENT === 'github-hosted' && env.RUNNER_DEBUG !== '1', 'WORKFLOW_CONTEXT');
  need(env.GITHUB_JOB === (protectedJob ? 'provision' : 'gate'), 'JOB_CONTEXT');
  if (protectedJob) need(env.PREVIEW_PROTECTED_ENVIRONMENT === SETUP.environment, 'PROTECTED_ENVIRONMENT');
}
export function credentialTransport({ githubToken, cloudflareToken, fetchImpl = globalThis.fetch }) {
  // Credentials are confined to these exact origins/account. Redirects cannot
  // forward Authorization. Cloudflare credential is read lazily on its first GET.
  return async (url, options) => {
    const u = new URL(url);
    const github = u.origin === 'https://api.github.com' && u.pathname.startsWith(repoPath + '/');
    const cloudflare = u.origin === 'https://api.cloudflare.com'
      && (u.pathname === `/client/v4/accounts/${TARGET.accountId}`
        || u.pathname.startsWith(`/client/v4/accounts/${TARGET.accountId}/d1/database`)
        || u.pathname.startsWith(`/client/v4/accounts/${TARGET.accountId}/workers/`));
    need(!u.username && !u.password && !u.hash && (github || cloudflare), 'TRANSPORT_SCOPE');
    need(github ? options.method === 'GET' : ['GET', 'POST', 'PUT'].includes(options.method), 'TRANSPORT_METHOD');
    const token = github ? githubToken() : cloudflareToken();
    need(typeof token === 'string' && token.length > 0 && !/[\r\n]/.test(token), 'CREDENTIAL_MISSING');
    const headers = new Headers(options.headers);
    headers.set('Authorization', `Bearer ${token}`);
    if (github) headers.set('X-GitHub-Api-Version', '2022-11-28');
    return fetchImpl(url, { ...options, headers, redirect: 'error' });
  };
}
async function boundedGitHubGet(transport, path) {
  const url = `https://api.github.com${repoPath}${path}`;
  const signal = AbortSignal.timeout(10_000);
  try {
    const response = await transport(url, { method: 'GET', signal, redirect: 'error', headers: { Accept: 'application/vnd.github+json' } });
    need(response.status === 200 && response.url === url && !response.redirected
      && response.headers.get('content-type')?.includes('application/json'), 'GITHUB_RESPONSE');
    const chunks = []; let bytes = 0;
    for await (const chunk of response.body) { bytes += chunk.byteLength; need(bytes <= 1_048_576, 'GITHUB_RESPONSE_SIZE'); chunks.push(Buffer.from(chunk)); }
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch { throw new Error('BLOCKED:GITHUB_METADATA_UNAVAILABLE'); }
}
export async function verifyConfiguredEnvironment(transport) {
  const e = await boundedGitHubGet(transport, `/environments/${SETUP.environment}`);
  const rules = e.protection_rules?.filter(r => r.type === 'required_reviewers');
  need(e.id === SETUP.environmentId && e.name === SETUP.environment && e.can_admins_bypass === false
    && e.deployment_branch_policy?.protected_branches === false && e.deployment_branch_policy?.custom_branch_policies === true
    && rules?.length === 1 && rules[0].prevent_self_review === false
    && rules[0].reviewers?.length === 1 && rules[0].reviewers[0].type === 'User'
    && rules[0].reviewers[0].reviewer?.login === SETUP.reviewerLogin
    && Number.isSafeInteger(rules[0].reviewers[0].reviewer.id), 'CONFIGURED_PROTECTIONS');
  const branches = await boundedGitHubGet(transport, `/environments/${SETUP.environment}/deployment-branch-policies?per_page=100&page=1`);
  need(branches.total_count === 1 && branches.branch_policies?.length === 1
    && branches.branch_policies[0].type === 'branch'
    && `refs/heads/${branches.branch_policies[0].name}` === SETUP.ref, 'CONFIGURED_BRANCH');
  return rules[0].reviewers[0].reviewer.id;
}
export async function runGate({ env, checkoutSha, transport }) {
  validateContext(env, checkoutSha, false);
  // This job has no Environment and receives only secret-presence booleans.
  // Reject repo/org fallbacks before they can become trusted authorization.
  need(env.PREVIEW_OUTSIDE_RECORD_PRESENT === 'false' && env.PREVIEW_OUTSIDE_DIGEST_PRESENT === 'false', 'UNPROTECTED_RECORD_SECRET');
  const reviewerId = await verifyConfiguredEnvironment(transport);
  return { environment: SETUP.environment, runId: Number(env.GITHUB_RUN_ID), commit: env.GITHUB_SHA,
    ref: SETUP.ref, reviewerId, planHash: PLAN_HASH };
}
export async function loadPinnedArtifactClient() {
  const lock = JSON.parse(await readFile(new URL('runtime/package-lock.json', import.meta.url), 'utf8'));
  const pinned = lock.packages?.['node_modules/@actions/artifact'];
  need(pinned?.version === ARTIFACT_CLIENT_PIN.version && pinned.integrity === ARTIFACT_CLIENT_PIN.integrity
    && pinned.resolved === 'https://registry.npmjs.org/@actions/artifact/-/artifact-2.3.2.tgz', 'ARTIFACT_LOCK_PIN');
  const require = createRequire(new URL('runtime/package.json', import.meta.url));
  const installed = require('@actions/artifact/package.json');
  need(installed.version === pinned.version, 'ARTIFACT_INSTALLED_VERSION');
  // npm ci --ignore-scripts verifies every locked package integrity before this
  // action receives credentials. No install or dependency resolution happens here.
  const { DefaultArtifactClient } = require('@actions/artifact');
  return new DefaultArtifactClient();
}
export async function runProtected({ env, checkoutSha, transport, loadClient = loadPinnedArtifactClient, now = Date.now }) {
  validateContext(env, checkoutSha, true);
  const bytes = env.PREVIEW_APPROVAL_RECORD;
  const digest = env.PREVIEW_APPROVAL_SHA256;
  need(typeof bytes === 'string' && bytes.length > 0 && typeof digest === 'string'
    && sha256(bytes) === digest, 'ENVIRONMENT_RECORD_MISSING_OR_MISMATCHED');
  const record = validateRecord(bytes, digest, now());
  need(record.ref === SETUP.ref && record.commit === env.GITHUB_SHA && record.runId === Number(env.GITHUB_RUN_ID)
    && record.reviewerPolicy === 'owner-manual' && record.requireOwnerInitiator === false, 'EXACT_RUN_RECORD');
  const reviewerId = await verifyConfiguredEnvironment(transport);
  need(record.reviewers.length === 1 && record.reviewers[0] === reviewerId, 'EXACT_OWNER_RECORD');
  const client = await loadClient();
  const durableClaims = createArtifactClaims({ client, clientVersion: ARTIFACT_CLIENT_PIN.version, runId: record.runId });
  const adapter = await createPreparedAdapter({ transport, durableClaims, recordBytes: bytes, trustedRecordHash: digest, now });
  return adapter.provision();
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    const env = process.env;
    const protectedJob = process.argv[2] !== 'gate';
    need(process.argv.length === (protectedJob ? 2 : 3), 'INVOCATION');
    const checkoutSha = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
    validateContext(env, checkoutSha, protectedJob);
    const transport = credentialTransport({ githubToken: () => env.PREVIEW_GITHUB_TOKEN,
      cloudflareToken: () => { need(protectedJob, 'CLOUDFLARE_IN_GATE'); return env.GEMNAO_PREVIEW_CLOUDFLARE_API_TOKEN; } });
    if (protectedJob) console.log(JSON.stringify(await runProtected({ env, checkoutSha, transport })));
    else {
      const gate = await runGate({ env, checkoutSha, transport });
      await appendFile(env.GITHUB_OUTPUT, `environment=${gate.environment}\n`);
      console.log(JSON.stringify(gate));
    }
  } catch {
    console.error('BLOCKED: exact protected setup, approval record or verified operation failed. Do not rerun; reconcile read-only.');
    process.exitCode = 1;
  }
}
