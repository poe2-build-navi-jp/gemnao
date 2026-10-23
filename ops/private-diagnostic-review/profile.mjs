// Fixed QA-only metadata; no import-time effects or credential access.
import { sha256, TARGET } from '../feedback-preview/controller.mjs';
import { readOnlyTransport } from '../feedback-preview/diagnostics.mjs';
import { validateProductionHealthContext, PRODUCTION_HEALTH_AUTHORIZATION } from '../diagnosis-production/cleanup-health.mjs';
import { account, database, getPaths, queries, allowed, boundedScope, databaseSummary } from './scope.mjs';
export const operation = 'private-qa-metadata';
export const mode = 'observe-existing-private-qa-metadata';
export const planHash = sha256(JSON.stringify({operation,mode,account,database,getPaths,queries,maximumCloudflareRequests:5,writes:0,retries:0,artifacts:0,authorization:PRODUCTION_HEALTH_AUTHORIZATION}));
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
const tables=['diagnostic_rate_attempts','diagnostic_rate_salt','diagnostic_report_tombstones','diagnostic_reports','diagnostic_retention_health'];
const columns=[['receipt_id','TEXT',1],['delete_hash','TEXT',0],['report_json','TEXT',0],['consent_version','INTEGER',0],['created_at','INTEGER',0],['expires_at','INTEGER',0]];
export async function collect(read) {
  const db=databaseSummary(await read(getPaths[0]));
  const worker=await read(getPaths[1]);
  if(worker?.id!=='4cde2e6602024e6b9650d26b28955010'||worker.name!=='gemnao-diagnostic-qa') throw new Error('BLOCKED:WORKER_IDENTITY');
  const cron=await read(getPaths[2]);
  if(!Array.isArray(cron?.schedules)) throw new Error('BLOCKED:CRON_RESPONSE');
  const path=`/accounts/${account}/d1/database/${database}/query`;
  const ts=rows(await read(path,queries[0]),5);
  const cs=rows(await read(path,queries[1]),128);
  return {...db,workerIdentityVerified:true,
    hourlyCronMatches:cron.schedules.length===1&&cron.schedules[0]?.cron==='0 * * * *',
    expectedTablesMatch:ts.length===tables.length&&ts.every((r,i)=>r.name===tables[i]&&r.type==='table'),
    reportColumnsMatch:cs.length===columns.length&&cs.every((r,i)=>r.cid===i&&r.name===columns[i][0]&&r.type===columns[i][1]&&r.pk===columns[i][2]),
    payloadRead:false,bindingsRead:false,heartbeatRead:false,reuseAuthorized:false};
}
