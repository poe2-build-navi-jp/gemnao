// Fixed QA-only metadata; no import-time effects or credential access.
import { sha256, TARGET } from '../feedback-preview/controller.mjs';
import { readOnlyTransport } from '../feedback-preview/diagnostics.mjs';
import { validateProductionHealthContext, PRODUCTION_HEALTH_AUTHORIZATION } from '../diagnosis-production/cleanup-health.mjs';
import { account, database } from './scope.mjs';
import { settingsPath, queryPath, readinessQueries as queries, allowed, readinessGuard as boundedScope, settingsSummary } from './readiness-scope.mjs';
const getPaths = [settingsPath];
export const operation = 'private-qa-readiness';
export const mode = 'observe-existing-private-qa-readiness';
export const planHash = sha256(JSON.stringify({operation,mode,account,database,getPaths,queries,maximumCloudflareRequests:3,writes:0,retries:0,artifacts:0,authorization:PRODUCTION_HEALTH_AUTHORIZATION}));
export function validateContext(context) {
  return Object.freeze({...validateProductionHealthContext(context),operation,mode,planHash});
}
export { allowed };
export function scopedTransport(inner) {
  const github = readOnlyTransport(inner), guard = boundedScope();
  return (url,options) => {
    if(url.startsWith(`https://api.github.com/repos/${TARGET.repository}/`)) return github(url,options);
    const root='https://api.cloudflare.com/client/v4';
    if(!url.startsWith(root)) throw new Error('BLOCKED:TRANSPORT_SCOPE');
    guard(url.slice(root.length),options?.method,options?.body);
    return inner(url,options);
  };
}
function rows(value,max) {
  if(!Array.isArray(value)||value.length!==1||value[0]?.success!==true||value[0].meta?.rows_written!==0||value[0].meta?.changed_db!==false||!Array.isArray(value[0].results)||value[0].results.length>max) throw new Error('BLOCKED:SCHEMA_RESULTS');
  return value[0].results;
}
export async function collect(read, now = Date.now()) {
  const settings = settingsSummary((await read(settingsPath))?.bindings, now);
  const heartbeat = rows(await read(queryPath,queries[0]),1);
  const objects = rows(await read(queryPath,queries[1]),33);
  if (objects.some(r => typeof r.name !== 'string' || !r.name.startsWith('private_diagnostic_') || typeof r.type !== 'string')) throw new Error('BLOCKED:SCHEMA_RESULTS');
  const stamp = heartbeat[0]?.last_cleanup;
  if (heartbeat.length && (!Number.isSafeInteger(stamp) || Object.keys(heartbeat[0]).length !== 1)) throw new Error('BLOCKED:HEARTBEAT_SHAPE');
  return {...settings, cleanupHealthy:heartbeat.length === 1 && stamp * 1000 <= now && now - stamp * 1000 <= 7200000,
    privateNamespaceEmpty:objects.length === 0, payloadRead:false, readOnly:true};
}
