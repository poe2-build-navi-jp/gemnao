// Capability probe only: no WebSocket, event collection, deployment or D1 operation.
import { appendFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { gate as inventoryGate, TARGET } from '../production-resource-inventory/control.mjs';

export const WORKFLOW = 'Pages tail access check';
export const DEPLOYMENT = '9f78778f-8f9d-4651-818d-9c550909c5db';
export const COMMIT = '72ac318b78183bbc209e8f244e9dbb04003e84ae';
const BASE = `https://api.cloudflare.com/client/v4/accounts/${TARGET.account}/pages/projects/gemnao`;
class ProbeError extends Error {}
const check = (ok, code) => { if (!ok) throw new ProbeError(code); };

export async function gate(env, fetcher = fetch) {
  check(env.GITHUB_WORKFLOW === WORKFLOW, 'WORKFLOW_MISMATCH');
  // Reuse the existing protected-environment policy verification, after binding
  // this entry point to its own workflow. All other context checks are retained.
  return inventoryGate({ ...env, GITHUB_WORKFLOW: TARGET.workflow }, fetcher);
}

export async function probe(env, fetcher = fetch) {
  check(env.TAIL_PROTECTED_ENVIRONMENT === TARGET.environment, 'PROTECTED_ENVIRONMENT_REQUIRED');
  await gate(env, fetcher);
  const token = env.CLOUDFLARE_API_TOKEN;
  check(typeof token === 'string' && /^[\x21-\x7e]+$/.test(token), 'EXISTING_AUTH_REQUIRED');
  const report = { project: 'gemnao', deployment: DEPLOYMENT, sessionCreated: false,
    sessionDeleted: false, websocketAttempted: false, logsReceived: false };
  const request = async (method, suffix) => {
    let response;
    try {
      response = await fetcher(BASE + suffix, { method, redirect: 'error',
        signal: AbortSignal.timeout(10000),
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        ...(method === 'POST' ? { body: '{}' } : {}) });
    } catch { throw new ProbeError(method === 'POST' ? 'CREATE_OUTCOME_UNKNOWN_NO_RETRY' : `${method}_REQUEST_FAILED`); }
    check(response.ok, `${method}_HTTP_${response.status}`);
    let data;
    try { data = await response.json(); } catch { throw new ProbeError(`${method}_INVALID_JSON`); }
    check(data.success === true && Array.isArray(data.errors) && data.errors.length === 0, `${method}_API_FAILED`);
    return data.result;
  };
  let tailId;
  try {
    const project = await request('GET', '');
    check(project?.name === 'gemnao' && project.production_branch === 'gemunao' &&
      project.source?.config?.owner === 'poe2-build-navi-jp' && project.source?.config?.repo_name === 'gemnao' &&
      project.canonical_deployment?.id === DEPLOYMENT &&
      project.canonical_deployment.environment === 'production' &&
      project.canonical_deployment.deployment_trigger?.metadata?.commit_hash === COMMIT,
    'PROJECT_OR_PRODUCTION_CHANGED');
    const result = await request('POST', `/deployments/${DEPLOYMENT}/tails`);
    report.sessionCreated = true;
    check(typeof result?.id === 'string' && /^(?:[a-f0-9]{32}|[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12})$/.test(result.id), 'CREATED_SESSION_ID_INVALID_CLEANUP_UNKNOWN');
    tailId = result.id;
    // The returned URL is a session capability: never print, store or connect.
  } catch (error) {
    report.failure = error instanceof ProbeError ? error.message : 'PROBE_FAILED';
  } finally {
    if (tailId) {
      try {
        await request('DELETE', `/deployments/${DEPLOYMENT}/tails/${tailId}`);
        report.sessionDeleted = true;
      } catch { report.cleanup = 'DELETE_UNCONFIRMED_NO_RETRY'; }
    }
  }
  report.status = report.sessionCreated && report.sessionDeleted && !report.failure ? 'session-access-confirmed' : 'blocked-or-unknown';
  return report;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    if (process.argv[2] === 'gate') {
      const environment = await gate(process.env);
      await appendFile(process.env.GITHUB_OUTPUT, `environment=${environment}\n`);
      console.log('Existing environment protection verified.');
    } else {
      check(process.argv[2] === 'probe', 'INVALID_MODE');
      const report = await probe(process.env);
      console.log(JSON.stringify(report));
      if (report.status !== 'session-access-confirmed') process.exitCode = 1;
    }
  } catch { console.error('Tail access check blocked before probe; no raw error output.'); process.exitCode = 1; }
}
