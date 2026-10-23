// Read-only reconciliation of the failed finite synthetic QA. Never invokes driver.
import {account,database} from './scope.mjs';
export const settingsPath=`/accounts/${account}/workers/scripts/gemnao-private-diagnostic-finite-qa/settings`;
export const queryPath=`/accounts/${account}/d1/database/${database}/query`;
export const categories=['reports','report_tombstones','retention_health','rate_salt','rate_attempts','notification_state'];
export const schemaSql="SELECT name FROM sqlite_schema WHERE type='table' AND name IN ("+categories.map(n=>"'private_diagnostic_"+n+"'").join(',')+") ORDER BY name;";
export const countQueries=Object.freeze(Object.fromEntries(categories.map(n=>[n,`SELECT count(*) AS n FROM private_diagnostic_${n};`])));
export function allowed(path,method,body){return method==='GET'&&path===settingsPath&&body===undefined||method==='POST'&&path===queryPath&&[schemaSql,...Object.values(countQueries)].some(sql=>body===JSON.stringify({sql}));}
export function boundedScope(){const seen=new Set();return (p,m,b)=>{const key=JSON.stringify([p,m,b]);if(!allowed(p,m,b)||seen.has(key)||seen.size>=8)throw Error('BLOCKED:TRANSPORT_SCOPE');seen.add(key);};}
export function readRows(result,max){
 if(!Array.isArray(result)||result.length!==1||result[0].success!==true||result[0].meta?.rows_written!==0||result[0].meta?.changed_db!==false||!Array.isArray(result[0].results)||result[0].results.length>max)throw Error('BLOCKED:SCHEMA_RESULTS');
 return result[0].results;
}
export function schemaPresence(result){const rows=readRows(result,6);if(rows.some(r=>Object.keys(r).length!==1||!categories.some(c=>'private_diagnostic_'+c===r.name))||new Set(rows.map(r=>r.name)).size!==rows.length)throw Error('BLOCKED:SCHEMA_RESULTS');return Object.fromEntries(categories.map(c=>[c,rows.some(r=>r.name==='private_diagnostic_'+c)]));}
export function countIsEmpty(result){const rows=readRows(result,1);if(rows.length!==1||Object.keys(rows[0]).length!==1||!Number.isSafeInteger(rows[0].n)||rows[0].n<0)throw Error('BLOCKED:SCHEMA_RESULTS');return rows[0].n===0;}
export function summarizeSettings(settings,now){
 const bindings=settings?.bindings;if(!Array.isArray(bindings)||!Number.isSafeInteger(now))throw Error('BLOCKED:SETTINGS_SHAPE');
 const plain=name=>{const rows=bindings.filter(b=>b.name===name);return rows.length===1&&rows[0].type==='plain_text'?rows[0].text:undefined;};
 const start=plain('QA_ACCESS_NOT_BEFORE'),end=plain('QA_ACCESS_EXPIRES_AT');
 const valid=/^[1-9][0-9]{12}$/.test(start??'')&&/^[1-9][0-9]{12}$/.test(end??'')&&Number(end)>Number(start)&&Number(end)-Number(start)<=900000;
 const qaStart=plain('PRIVATE_QA_START'),qaEnd=plain('PRIVATE_QA_END');
 const guardWindowMatches=valid&&Number(qaStart)===Math.floor(Number(start)/1000)&&Number(qaEnd)===Math.floor(Number(end)/1000);
 const mode=plain('PRIVATE_QA_MODE');
 return {privateDbBindingMatches:bindings.filter(b=>b.type==='d1').length===1&&bindings.some(b=>b.type==='d1'&&b.name==='PRIVATE_DIAGNOSTIC_DB'&&b.id===database),
  dedicatedDoBindingPresent:bindings.some(b=>b.type==='durable_object_namespace'&&b.name==='PRIVATE_QA_BUDGET'),
  configuredWindowAtMost15Minutes:valid,guardWindowMatches,configuredWindowExpired:valid?now>=Number(end):null,
  runtimeModeClosed:mode==='closed',runtimeModeFinite:mode==='finite-synthetic-v1',
  intakeOff:plain('PRIVATE_DIAGNOSTIC_ENABLED')==='false',ownerReviewOff:plain('PRIVATE_DIAGNOSTIC_OWNER_REVIEW_ENABLED')==='false',notificationOff:plain('PRIVATE_DIAGNOSTIC_NOTIFY_ENABLED')==='false',
  doPersistedCloseVerified:false,driverOutcomeKnown:false};
}
