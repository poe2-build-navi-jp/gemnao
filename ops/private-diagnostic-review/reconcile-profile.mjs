import {sha256,TARGET} from '../feedback-preview/controller.mjs';
import {readOnlyTransport} from '../feedback-preview/diagnostics.mjs';
import {validateProductionHealthContext,PRODUCTION_HEALTH_AUTHORIZATION} from '../diagnosis-production/cleanup-health.mjs';
import {settingsPath,queryPath,schemaSql,countQueries,categories,allowed,boundedScope,summarizeSettings,schemaPresence,countIsEmpty} from './reconcile-scope.mjs';
export const operation='private-qa-readiness';
export const mode='reconcile-failed-finite-private-qa-read-only';
export const planHash=sha256(JSON.stringify({operation,mode,settingsPath,queryPath,schemaSql,countQueries,maximumCloudflareRequests:8,writes:0,driverRequests:0,retries:0,artifacts:0,publishExactCounts:false,authorization:PRODUCTION_HEALTH_AUTHORIZATION}));
export function validateContext(c){return Object.freeze({...validateProductionHealthContext(c),operation,mode,planHash});}
export {allowed};
export function scopedTransport(inner){const gh=readOnlyTransport(inner),guard=boundedScope();return (url,options)=>{if(url.startsWith(`https://api.github.com/repos/${TARGET.repository}/`))return gh(url,options);const root='https://api.cloudflare.com/client/v4';if(!url.startsWith(root))throw Error('BLOCKED:TRANSPORT_SCOPE');guard(url.slice(root.length),options?.method,options?.body);return inner(url,options);};}
export async function collect(read,now=Date.now(),checkpoint=()=>{}){
 const settings=summarizeSettings(await read(settingsPath),now);
 checkpoint({kind:'worker-settings',...settings});
 const present=schemaPresence(await read(queryPath,schemaSql));
 checkpoint({kind:'schema-presence',privateTablesPresent:present});
 const empty=Object.fromEntries(categories.map(c=>[c,null]));
 for(const category of categories){if(!present[category])continue;empty[category]=countIsEmpty(await read(queryPath,countQueries[category]));checkpoint({kind:'table-empty',table:category,empty:empty[category]});}
 const all=Object.values(empty);
 return {...settings,privateTablesPresent:present,schemaComplete:Object.values(present).every(Boolean),privateTablesEmpty:empty,allPrivateTablesEmpty:all.includes(false)?false:all.every(v=>v===true)?true:null,payloadRead:false,exactCountsPublished:false,readOnly:true,receiptActivationAuthorized:false};
}
