// Only fixed local codes and endpoint classes may enter public diagnostics.
import { TARGET } from './controller.mjs';
const CODES = new Set(`
ACCOUNT APPROVAL_RECORD_JSON APPROVAL_RECORD_PIN APPROVAL_RECORD_SIZE ARTIFACT_CLAIM
ARTIFACT_CREATE_UNCERTAIN_OR_CONFLICT ARTIFACT_INSTALLED_VERSION ARTIFACT_LOCK_PIN ARTIFACT_READBACK_UNCERTAIN
ATTEMPT_ALREADY_STARTED BRANCH_MOVED CLAIM_ARTIFACT_BUDGET CLEANUP_ALERT_APPROVAL CLOUDFLARE_IN_GATE COLLISION
CONFIGURED_BRANCH CONFIGURED_PROTECTIONS CREDENTIAL_MISSING CRON_INVENTORY CRON_RENAME_RISK CRON_RESPONSE
DATABASE_READBACK DURABLE_CLAIM_READBACK DURABLE_CLAIM_RECEIPT DURABLE_CLAIM_REQUIRES_READ_ONLY_RECONCILIATION
DURABLE_CLAIM_UNCONFIGURED DURABLE_RUN_RECONCILIATION ENVIRONMENT ENVIRONMENT_RECORD_MISSING_OR_MISMATCHED
ENVIRONMENT_REF ENVIRONMENT_REVIEWERS EXACT_OWNER_RECORD EXACT_RUN_RECORD GITHUB_METADATA_UNAVAILABLE
HEALTH_DATABASE_IDENTITY HEALTH_DISCOVERY_ONCE HEALTH_HEARTBEAT_SHAPE HEALTH_MODE HEALTH_PLAN_PIN HEALTH_QUERY_ONCE
HEALTH_QUERY_RESULT HEALTH_REQUEST_SCOPE HEALTH_SQL_PIN GITHUB_RESPONSE GITHUB_RESPONSE_SIZE INITIATOR_POLICY_UNCHOSEN INVENTORY_CHANGED INVENTORY_COMPLETENESS
INVENTORY_DUPLICATE INVENTORY_ID INVENTORY_PAGE_BOUND INVENTORY_TRUNCATED INVOCATION JOB_CONTEXT NEW_DATABASE
NEW_WORKER_IDENTITY NEW_WORKER_TIMESTAMP NO_TRANSPORT OWNER_INITIATOR OWNER_REVIEWER OWNER_UI_COST_EVIDENCE
PREFLIGHT_STALE PRIOR_RUN_REQUIRES_READ_ONLY_RECONCILIATION PROTECTED_ENVIRONMENT PROVIDER_RESULT
QUOTA_ASSESSMENT QUOTA_RESERVATION READ_ONLY_ENDPOINT READ_ONLY_METHOD READ_ONLY_MODE RECONCILED_RUN
RECORD_SCOPE REQUEST_BOUND REQUEST_BUDGET_BEFORE_WRITES REQUEST_UNCERTAIN_OR_INVALID RESOURCE_SLOTS
RESPONSE_BODY RESPONSE_IDENTITY_STATUS RESPONSE_SIZE RESPONSE_TYPE REVIEWED_REF REVIEWED_RUN REVIEWER_POLICY
RUN_ENVIRONMENT_APPROVAL RUN_HISTORY_INCOMPLETE RUN_IDENTITY RUN_REVIEWS SCHEMA_RESULTS SELF_REVIEW
TRANSPORT_METHOD TRANSPORT_SCOPE TWO_PAIR_FREE_RESERVATION UNPROTECTED_RECORD_SECRET VERSION_READBACK
VERSION_RESPONSE WORKFLOW_CONTEXT WRITE_BOUND WRITE_REQUIRES_READ_ONLY_RECONCILIATION
`.trim().split(/\s+/));
const STAGES = new Set(['context', 'record', 'environment', 'artifact-sdk', 'github-preflight', 'account-preflight', 'inventory-preflight', 'health-subdomain', 'health-identities', 'health-heartbeats', 'claim', 'write-database', 'write-schema', 'write-worker', 'write-version', 'write-cron', 'complete']);
export function safeCode(error) {
  const message = typeof error?.message === 'string' ? error.message : '';
  const code = message.startsWith('BLOCKED:') ? message.slice(8) : '';
  return CODES.has(code) ? code : 'UNCLASSIFIED_FAILURE';
}
export function boundedFailure(code, cause) {
  const error = new Error(`BLOCKED:${CODES.has(code) ? code : 'UNCLASSIFIED_FAILURE'}`);
  error.safeCauseCode = safeCode(cause);
  return error;
}
export function failureSummary(error) {
  return { code: safeCode(error), ...(CODES.has(error?.safeCauseCode) ? { causeCode: error.safeCauseCode } : {}) };
}
function requestClass(url, method) {
  const info = { service: 'unknown', method: ['GET', 'POST', 'PUT', 'DELETE'].includes(method) ? method : 'unknown', endpoint: 'unknown', status: null };
  try {
    const u = new URL(url);
    const repo = `/repos/${TARGET.repository}`;
    const account = `/client/v4/accounts/${TARGET.accountId}`;
    let path;
    if (u.origin === 'https://api.github.com' && u.pathname.startsWith(repo + '/')) {
      info.service = 'github'; path = u.pathname.slice(repo.length);
      if (/^\/environments\/[^/]+\/deployment-branch-policies$/.test(path)) info.endpoint = 'environment-branch-policies';
      else if (/^\/environments\/[^/]+$/.test(path)) info.endpoint = 'environment';
      else if (/^\/actions\/runs\/[0-9]+\/approvals$/.test(path)) info.endpoint = 'run-approvals';
      else if (/^\/actions\/runs\/[0-9]+$/.test(path)) info.endpoint = 'run';
      else if (/^\/actions\/workflows\/[^/]+\/runs$/.test(path)) info.endpoint = 'run-history';
      else if (path.startsWith('/git/ref/heads/')) info.endpoint = 'branch-ref';
    } else if (u.origin === 'https://api.cloudflare.com' && (u.pathname === account || u.pathname.startsWith(account + '/'))) {
      info.service = 'cloudflare'; path = u.pathname.slice(account.length);
      if (path === '') info.endpoint = 'account';
      else if (path === '/d1/database') info.endpoint = 'd1-databases';
      else if (/^\/d1\/database\/[^/]+\/query$/.test(path)) info.endpoint = 'd1-query';
      else if (/^\/d1\/database\/[^/]+$/.test(path)) info.endpoint = 'd1-metadata';
      else if (path === '/workers/subdomain') info.endpoint = 'workers-subdomain';
      else if (path === '/workers/workers') info.endpoint = 'workers';
      else if (/^\/workers\/workers\/[^/]+\/versions(?:\/[^/]+)?$/.test(path)) info.endpoint = 'worker-versions';
      else if (/^\/workers\/workers\/[^/]+$/.test(path)) info.endpoint = 'worker-metadata';
      else if (/^\/workers\/scripts\/[^/]+\/schedules$/.test(path)) info.endpoint = 'worker-schedules';
    }
  } catch { /* Never return URL text or parsing error. */ }
  return info;
}
export function providerEnvelopeSummary(value) {
  const object = value !== null && typeof value === 'object' && !Array.isArray(value);
  if (!object) return { success: 'invalid', errors: 'invalid' };
  const success = !Object.hasOwn(value, 'success') ? 'missing'
    : value.success === true ? 'true' : value.success === false ? 'false' : 'invalid';
  const errors = !Object.hasOwn(value, 'errors') ? 'absent' : value.errors === null ? 'null'
    : Array.isArray(value.errors) ? (value.errors.length === 0 ? 'empty' : 'nonempty') : 'invalid';
  return { success, errors };
}
export function createDiagnostics(emit = () => {}) {
  let stage = 'context'; let request = null; let envelope = null;
  return Object.freeze({
    stage(value) { stage = STAGES.has(value) ? value : 'context'; emit({ stage }); },
    envelope(value) {
      envelope = { success: ['true', 'false', 'missing', 'invalid'].includes(value?.success) ? value.success : 'invalid',
        errors: ['absent', 'null', 'empty', 'nonempty', 'invalid'].includes(value?.errors) ? value.errors : 'invalid' };
    },
    transport(inner) { return async (url, options) => {
      envelope = null;
      request = requestClass(url, options?.method);
      const response = await inner(url, options);
      request.status = Number.isInteger(response?.status) && response.status >= 100 && response.status <= 599 ? response.status : null;
      return response;
    }; },
    failure(error) { return { stage, ...failureSummary(error), request, ...(envelope ? { envelope } : {}) }; },
  });
}
export function readOnlyTransport(transport) {
  return (url, options) => {
    if (options?.method !== 'GET') throw new Error('BLOCKED:READ_ONLY_METHOD');
    const endpoint = requestClass(url, options.method).endpoint;
    if (!['environment', 'environment-branch-policies', 'run', 'run-history', 'run-approvals', 'branch-ref', 'account', 'd1-databases', 'workers', 'worker-schedules'].includes(endpoint))
      throw new Error('BLOCKED:READ_ONLY_ENDPOINT');
    return transport(url, options);
  };
}
