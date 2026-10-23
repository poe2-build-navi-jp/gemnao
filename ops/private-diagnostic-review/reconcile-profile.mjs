import {sha256,TARGET} from '../feedback-preview/controller.mjs';
import {readOnlyTransport} from '../feedback-preview/diagnostics.mjs';
import {validateProductionHealthContext,PRODUCTION_HEALTH_AUTHORIZATION} from '../diagnosis-production/cleanup-health.mjs';
import {settingsPath,queryPath,countSql,allowed,boundedScope,summarizeSettings,summarizeCounts} from './reconcile-scope.mjs';
export const operation='private-qa-readiness';
export const mode='reconcile-failed-finite-private-qa-read-only';
export const planHash=sha256(JSON.stringify({operation,mode,failedRun:39952074873,failedHead:'136a26e5ec48c49e906cf1734ca45871827cd880',settingsPath,queryPath,countSql,maximumCloudflareRequests:2,writes:0,driverRequests:0,retries:0,artifacts:0,publishExactCounts:false,authorization:PRODUCTION_HEALTH_AUTHORIZATION}));
export function validateContext(c){return Object.freeze({...validateProductionHealthContext(c),operation,mode,planHash});}
export {allowed};
export function scopedTransport(inner){const gh=readOnlyTransport(inner),guard=boundedScope();return (url,options)=>{if(url.startsWith(`https://api.github.com/repos/${TARGET.repository}/`))return gh(url,options);const root='https://api.cloudflare.com/client/v4';if(!url.startsWith(root))throw Error('BLOCKED:TRANSPORT_SCOPE');guard(url.slice(root.length),options?.method,options?.body);return inner(url,options);};}
export async function collect(read,now=Date.now()){
 const settings=summarizeSettings(await read(settingsPath),now);
 const counts=summarizeCounts(await read(queryPath,countSql));
 return {...settings,...counts,readOnly:true,receiptActivationAuthorized:false};
}
