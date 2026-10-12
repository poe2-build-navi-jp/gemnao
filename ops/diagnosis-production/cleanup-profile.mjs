// Fixed production retention installation. No credentials or network on import.
import { TARGET, sha256 } from '../feedback-preview/controller.mjs';
import { PRODUCTION_COST_POLICY, PRODUCTION_PLAN_HASH } from './database-profile.mjs';
export const CLEANUP_OPERATION = 'production-cleanup';
export const CLEANUP_MODE = 'install-production-cleanup';
export const CLEANUP_RECORD_OPERATION = 'install-two-production-cleanups-20261012';
export const CLEANUP_FEATURES = Object.freeze([
  Object.freeze({ key: 'sharing', database: 'gemnao-diagnosis-production',
    databaseId: '1ef1f798-7518-4b1a-a5a6-4f6f7dddfcfe', binding: 'DIAGNOSIS_DB',
    worker: 'gemnao-diagnosis-cleanup-production', cron: '17 * * * *',
    module: '../diagnosis-production/reviewed/diagnosis-cleanup.mjs' }),
  Object.freeze({ key: 'feedback', database: 'gemnao-diagnostic-feedback-production',
    databaseId: 'f3379342-bb5e-461c-bad3-1175be8836c5', binding: 'FEEDBACK_DB',
    worker: 'gemnao-diagnostic-feedback-cleanup-production', cron: '43 * * * *',
    module: '../diagnosis-production/reviewed/feedback-cleanup.mjs' }),
]);
export const CLEANUP_ARTIFACTS = Object.freeze({
  '../diagnosis-production/reviewed/diagnosis-cleanup.mjs': 'b0ffa2293a185a31579d00bdc36bf751bc75f69142bac103007b7929e30d20b9',
  '../diagnosis-production/reviewed/feedback-cleanup.mjs': '766d8636297ecfde0d3c4bb12d423a33015744026b83b7b4ad22c6a8339843d9',
});
export const RETENTION_SCOPE = Object.freeze({
  execution: 'hourly-scheduled-only; persists after installation approval expires',
  sharing: Object.freeze({ diagnosis_shared: 'expires_at<=now OR revoked_at IS NOT NULL; whole rows; created+30d expiry',
    diagnosis_rate_limits: 'expires_at<=now', diagnosis_operations: 'salt:* and expires_at<=now only',
    diagnosis_metrics: 'day<=UTC-date(now-30d)', heartbeat: 'upsert cleanup_success only after successful deletion; expires now+2h' }),
  feedback: Object.freeze({ diagnostic_reports: 'expires_at<=now; whole rows; created+30d expiry',
    diagnostic_report_tombstones: 'expires_at<=now; deletion/cancellation+30d expiry',
    diagnostic_rate_attempts: 'created_at<unixepoch()-60', diagnostic_rate_salt: 'day<current UTC day',
    heartbeat: 'upsert diagnostic_retention_health singleton=1 in successful deletion batch' }),
  http: 'disabled; fetch returns 404', intakeEnabled: false,
  excludes: Object.freeze(['ordinary DB', 'QA DBs/Workers', 'other DBs', 'schema changes', 'new user data', 'routes', 'paid upgrade', 'token/permission changes']),
});
export const RETENTION_SCOPE_HASH = sha256(JSON.stringify(RETENTION_SCOPE));
export const CLEANUP_SETUP_RUN = Object.freeze({ id: 38204547053,
  headSha: 'd3420e65281692ba8518d1ca995607802d046a06', planHash: PRODUCTION_PLAN_HASH });
export const CLEANUP_PLAN_HASH = sha256(JSON.stringify({ operation: CLEANUP_RECORD_OPERATION,
  accountId: TARGET.accountId, environment: TARGET.environment, features: CLEANUP_FEATURES,
  artifacts: CLEANUP_ARTIFACTS, retentionScope: RETENTION_SCOPE, setupRun: CLEANUP_SETUP_RUN,
  compatibilityDate: '2026-05-22', writes: ['WORKER_CREATE_PRIVATE', 'VERSION_DEPLOY_BY_ID', 'CRON_BY_NAME'],
  maximumInstallationWrites: 6, databaseWritesDuringInstallation: 0,
  paidUSD: 0, quotaPolicy: 'provider-enforced-free-stop', usageHeadroom: 'not-measured',
  costEvidencePolicy: PRODUCTION_COST_POLICY, claim: { uploads: 1, archiveBytes: 8192, retentionDays: 1, overwrite: false },
}));
export function cleanupRequestAllowed(path, method) {
  const base = `/accounts/${TARGET.accountId}`;
  const p = path.split('?')[0];
  if (method === 'GET') return p === `${base}/d1/database` || p === `${base}/workers/workers`
    || CLEANUP_FEATURES.some(f => p === `${base}/d1/database/${f.databaseId}` || p === `${base}/workers/workers/${f.worker}`)
    || new RegExp(`^${base}/workers/workers/[a-f0-9]{32}(?:/versions/[a-f0-9-]{36})?$`).test(p)
    || new RegExp(`^${base}/workers/scripts/[A-Za-z0-9_-]+/schedules$`).test(p);
  if (method === 'POST') return p === `${base}/workers/workers`
    || new RegExp(`^${base}/workers/workers/[a-f0-9]{32}/versions$`).test(p);
  return method === 'PUT' && CLEANUP_FEATURES.some(f => p === `${base}/workers/scripts/${f.worker}/schedules`);
}
