// Fixed Pages Read observation through the existing owner-reviewed preview controller.
import { TARGET, sha256 } from '../feedback-preview/controller.mjs';
import { readOnlyTransport } from '../feedback-preview/diagnostics.mjs';
import { PRODUCTION_HEALTH_AUTHORIZATION, validateProductionHealthContext } from './cleanup-health.mjs';

export const PAGES_LOG_OPERATION = 'pages-deployment-log';
export const PAGES_LOG_MODE = 'observe-fixed-failed-pages-deployment';
export const DEPLOYMENT = 'fb3a8300-71e2-44ff-b5ef-d260a44eb0ed';
export const COMMIT = 'ea8f609f1149158a5f93e249924696edd3894ea5';
export const PAGES_PROJECT_PATH = `/accounts/${TARGET.accountId}/pages/projects/gemnao`;
export const PAGES_LOG_PATH = `${PAGES_PROJECT_PATH}/deployments/${DEPLOYMENT}/history/logs`;
const FLAGS = Object.freeze(['DIAGNOSIS_LOCAL_BETA', 'DIAGNOSIS_ENABLED',
  'DIAGNOSIS_STORAGE_ENABLED', 'DIAGNOSIS_SHARING_ENABLED', 'DIAGNOSIS_WRITES_ENABLED',
  'DIAGNOSIS_METRICS_ENABLED', 'FEEDBACK_ENABLED']);
export const PAGES_LOG_PLAN_HASH = sha256(JSON.stringify({ operation: PAGES_LOG_MODE,
  paths: [PAGES_LOG_PATH, PAGES_PROJECT_PATH], failedCommit: COMMIT,
  maximumCloudflareRequests: 2, cloudflareWrites: 0, databaseQueries: 0,
  artifacts: 0, retries: 0, rawLogsStored: false, maximumErrorLines: 100,
  flags: FLAGS, authorization: PRODUCTION_HEALTH_AUTHORIZATION }));
function need(ok, code) { if (!ok) throw new Error(`BLOCKED:${code}`); }
export function validatePagesLogContext(context) {
  return Object.freeze({ ...validateProductionHealthContext(context),
    mode: PAGES_LOG_MODE, operation: PAGES_LOG_MODE, planHash: PAGES_LOG_PLAN_HASH });
}
export function pagesLogRequestAllowed(path, method, body) {
  return method === 'GET' && body === undefined && [PAGES_LOG_PATH, PAGES_PROJECT_PATH].includes(path);
}
export function pagesLogTransport(transport) {
  const githubReads = readOnlyTransport(transport), seen = new Set();
  return (url, options) => {
    if (url.startsWith(`https://api.github.com/repos/${TARGET.repository}/`)) return githubReads(url, options);
    const root = 'https://api.cloudflare.com/client/v4';
    need(url.startsWith(root) && pagesLogRequestAllowed(url.slice(root.length), options?.method, options?.body), 'TRANSPORT_SCOPE');
    need(!seen.has(url) && seen.size < 2, 'REQUEST_BOUND');
    seen.add(url);
    return transport(url, options);
  };
}
export function projectLogs(result, secrets = []) {
  need(Array.isArray(result?.data) && result.data.length <= 20000 &&
    Number.isSafeInteger(result.total) && result.total >= result.data.length, 'PAGES_LOG_SHAPE_INVALID');
  const errors = [];
  let omittedSensitive = 0;
  for (const row of result.data) {
    if (typeof row?.line !== 'string' || row.line.length > 32768) continue;
    // Log text is untrusted provider data, never an instruction or raw artifact.
    // eslint-disable-next-line no-control-regex
    let line = row.line.replace(/\x1b\[[0-9;]*m/g, '').replace(/[\x00-\x1f\x7f]/g, ' ');
    if (!/error|fail|fatal|exceed|limit|invalid|not found|could not|cannot|denied|unsupported|unable|exit code/i.test(line)) continue;
    if (/token|secret|password|authorization|cookie|credential|env_vars|private[_ -]?key|api[_ -]?key/i.test(line)) {
      omittedSensitive++; continue;
    }
    for (const secret of secrets) if (secret) line = line.replaceAll(secret, '[REDACTED]');
    line = line.replace(/https?:\/\/\S+/g, '[URL]')
      .replace(/[A-Za-z0-9_+/=-]{32,}/g, '[OPAQUE]')
      .replace(/([A-Z][A-Z0-9_]{2,})\s*=\s*(?:"[^"]*"|'[^']*'|\S+)/g, '$1=[REDACTED]');
    errors.push({ at: typeof row.ts === 'string' && /^\d{4}-\d\d-\d\dT[\d:.]{8,20}Z$/.test(row.ts) ? row.ts : null,
      line: line.slice(0, 1000) });
  }
  return { deployment: DEPLOYMENT, expectedFailedCommit: COMMIT,
    totalProviderLines: result.total, receivedLines: result.data.length,
    allProviderLinesReceived: result.total === result.data.length,
    includesContainerLogs: result.includes_container_logs === true,
    omittedSensitive, matchingErrorLines: errors.length, errors: errors.slice(-100),
    logTextIsUntrusted: true, rawLogsStored: false };
}
function flags(vars) {
  return Object.fromEntries(FLAGS.map(key => {
    const entry = vars?.[key];
    // Never inspect a secret_text value, including for a recognized flag name.
    return [key, entry?.type === 'plain_text' && ['true', 'false'].includes(entry.value) ? entry.value : 'unknown'];
  }));
}
export function projectPagesState(project) {
  need(project?.name === 'gemnao' && project.production_branch === 'gemunao' &&
    project.source?.config?.owner === 'poe2-build-navi-jp' && project.source.config.repo_name === 'gemnao',
  'PAGES_PROJECT_OR_SOURCE_MISMATCH');
  const d = project.canonical_deployment;
  const uuid = /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/;
  const sha = /^[a-f0-9]{40}$/;
  const statuses = ['idle', 'active', 'success', 'failure', 'canceled'];
  const canonical = { id: uuid.test(d?.id ?? '') ? d.id : null,
    commit: sha.test(d?.deployment_trigger?.metadata?.commit_hash ?? '') ? d.deployment_trigger.metadata.commit_hash : null,
    status: statuses.includes(d?.latest_stage?.status) ? d.latest_stage.status : 'unknown',
    production: d?.environment === 'production' && d?.deployment_trigger?.metadata?.branch === 'gemunao',
    flags: flags(d?.env_vars) };
  return { project: 'gemnao', productionBranch: 'gemunao', canonicalDeployment: canonical,
    projectConfigurationFlags: flags(project.deployment_configs?.production?.env_vars),
    configurationIsNotRuntimeEvidence: true, liveIntakeVerified: false,
    secretValuesIncluded: false };
}
