// Two fixed heartbeat SELECTs only. No credentials, caller SQL, or network on import.
import { TARGET, sha256 } from '../feedback-preview/controller.mjs';
import { readOnlyTransport } from '../feedback-preview/diagnostics.mjs';

export const PRODUCTION_HEALTH_OPERATION = 'production-cleanup-health';
export const PRODUCTION_HEALTH_MODE = 'observe-production-cleanup-heartbeats';
export const PRODUCTION_HEALTH_AUTHORIZATION = Object.freeze({ kind: 'github-environment-owner-review',
  repository: TARGET.repository, environment: TARGET.environment, environmentId: 23658815122,
  ref: 'refs/heads/prepare/feedback-preview-controller-20261007', reviewerId: 325773421, runAttempt: 1 });
export const CLEANUP_INSTALLATION = Object.freeze({ runId: 38207736391,
  sourceSha: 'a7a0c08dcf89e9c2f99ca19863a5ea545ffb70c4', jobId: 114674925272,
  receiptSha256: '4136e7743345a54c063ce9b4279bc1d90d701973d3d794273a7e28c78e000cfc' });
export const PRODUCTION_HEALTH_TARGETS = Object.freeze([
  Object.freeze({ feature: 'sharing', databaseName: 'gemnao-diagnosis-production',
    databaseId: '1ef1f798-7518-4b1a-a5a6-4f6f7dddfcfe',
    workerId: '7877071bb4e84f14a4b9fdfcd49a5b37', versionId: 'bb186989-25ec-483b-b53b-e33f61a6f689',
    confirmedAt: 1791787485688, firstScheduledAt: Date.parse('2026-10-12T07:17:00Z'),
    sql: "SELECT value,expires_at FROM diagnosis_operations WHERE key='cleanup_success' LIMIT 1;",
    sqlSha256: '687966446eb2e3911382151bcea3619338452f5313127718f9d7a31bb3de1876' }),
  Object.freeze({ feature: 'feedback', databaseName: 'gemnao-diagnostic-feedback-production',
    databaseId: 'f3379342-bb5e-461c-bad3-1175be8836c5',
    workerId: '0a170accbee241c797763136fbfed06f', versionId: '514bbe61-9261-466e-bc6e-7a60246defb7',
    confirmedAt: 1791787488641, firstScheduledAt: Date.parse('2026-10-12T07:43:00Z'),
    sql: 'SELECT last_cleanup FROM diagnostic_retention_health WHERE singleton=1 LIMIT 1;',
    sqlSha256: '89def89f72a3609f179571566d369fb67ffcdb5fc2ed05d213d0acda42b41b26' }),
]);
export const PRODUCTION_HEALTH_PLAN_HASH = sha256(JSON.stringify({ operation: PRODUCTION_HEALTH_MODE,
  accountId: TARGET.accountId, installation: CLEANUP_INSTALLATION, targets: PRODUCTION_HEALTH_TARGETS,
  maximumQueries: 2, maximumRowsPerQuery: 1, maximumAgeMs: 7_200_000,
  cloudflareWrites: 0, artifacts: 0, authorization: PRODUCTION_HEALTH_AUTHORIZATION }));
const ACCOUNT = `/accounts/${TARGET.accountId}`;
function need(ok, code) { if (!ok) throw new Error(`BLOCKED:${code}`); }

// Context identifies the run; it is not approval evidence. Before any Cloudflare
// request the shared GitHub gate independently verifies this exact run/head,
// current protected Environment and its actual owner approval through the API.
// No approval timestamp, old record, cost attestation or self-signed digest exists.
export function validateProductionHealthContext(context) {
  const keys = ['repository', 'ref', 'commit', 'runId', 'reviewerId'];
  need(context && typeof context === 'object' && !Array.isArray(context)
    && Object.keys(context).length === keys.length && Object.keys(context).every(k => keys.includes(k))
    && context.repository === TARGET.repository, 'WORKFLOW_CONTEXT');
  need(context.ref === PRODUCTION_HEALTH_AUTHORIZATION.ref
    && /^[a-f0-9]{40}$/.test(context.commit ?? ''), 'REVIEWED_REF');
  need(Number.isSafeInteger(context.runId) && context.runId > 0
    && context.runId !== CLEANUP_INSTALLATION.runId, 'REVIEWED_RUN');
  need(context.reviewerId === PRODUCTION_HEALTH_AUTHORIZATION.reviewerId, 'EXACT_OWNER_RECORD');
  return Object.freeze({ mode: PRODUCTION_HEALTH_MODE, operation: PRODUCTION_HEALTH_MODE,
    planHash: PRODUCTION_HEALTH_PLAN_HASH, accountId: TARGET.accountId, ref: context.ref,
    commit: context.commit, runId: context.runId, reviewerPolicy: 'owner-manual',
    reviewers: Object.freeze([context.reviewerId]), requireOwnerInitiator: false,
    reconciledPriorRuns: Object.freeze([]) });
}

export function productionHealthRequestAllowed(path, method, body) {
  const target = PRODUCTION_HEALTH_TARGETS.find(t => path === `${ACCOUNT}/d1/database/${t.databaseId}`
    || path === `${ACCOUNT}/d1/database/${t.databaseId}/query`);
  if (!target) return false;
  if (method === 'GET') return path === `${ACCOUNT}/d1/database/${target.databaseId}` && body === undefined;
  return method === 'POST' && path === `${ACCOUNT}/d1/database/${target.databaseId}/query`
    && sha256(target.sql) === target.sqlSha256 && body === JSON.stringify({ sql: target.sql });
}
export function productionHealthTransport(transport) {
  const reads = readOnlyTransport(transport); const queried = new Set();
  return (url, options) => {
    if (url.startsWith(`https://api.github.com/repos/${TARGET.repository}/`)) return reads(url, options);
    const root = 'https://api.cloudflare.com/client/v4';
    need(url.startsWith(root) && productionHealthRequestAllowed(url.slice(root.length), options?.method, options?.body), 'HEALTH_REQUEST_SCOPE');
    if (options.method === 'POST') {
      need(!queried.has(url), 'HEALTH_QUERY_ONCE'); queried.add(url);
    }
    return transport(url, options);
  };
}

export function productionHeartbeatStatus(feature, result, now) {
  need(Array.isArray(result) && result.length === 1 && result[0]?.success === true
    && Array.isArray(result[0].results) && result[0].results.length <= 1
    && result[0].meta?.rows_written === 0 && result[0].meta.changed_db === false, 'HEALTH_QUERY_RESULT');
  const target = PRODUCTION_HEALTH_TARGETS.find(t => t.feature === feature);
  need(target, 'HEALTH_REQUEST_SCOPE');
  if (result[0].results.length === 0) return { lastSuccessAt: null, healthy: false, pending: true };
  const row = result[0].results[0];
  need(row && typeof row === 'object' && !Array.isArray(row), 'HEALTH_HEARTBEAT_SHAPE');
  let stamp;
  if (feature === 'feedback') {
    need(Object.keys(row).length === 1 && Number.isSafeInteger(row.last_cleanup), 'HEALTH_HEARTBEAT_SHAPE');
    stamp = row.last_cleanup * 1000;
  } else {
    need(Object.keys(row).length === 2 && typeof row.value === 'string' && /^[0-9]{13}$/.test(row.value)
      && Number.isSafeInteger(row.expires_at), 'HEALTH_HEARTBEAT_SHAPE');
    stamp = Number(row.value); need(row.expires_at === stamp + 7_200_000, 'HEALTH_HEARTBEAT_SHAPE');
  }
  need(Number.isSafeInteger(stamp) && stamp >= 0 && stamp <= 8_640_000_000_000_000, 'HEALTH_HEARTBEAT_SHAPE');
  const healthy = stamp >= target.firstScheduledAt && stamp >= target.confirmedAt
    && stamp <= now && now - stamp <= 7_200_000
    && (feature === 'feedback' || row.expires_at > now);
  return { lastSuccessAt: new Date(stamp).toISOString(), healthy, pending: !healthy };
}
