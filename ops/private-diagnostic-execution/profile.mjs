// Narrow new-QA-only operation. No production/list/billing endpoints.
import {readFile} from 'node:fs/promises';
import {sha256} from '../feedback-preview/controller.mjs';
import {account,database,databaseName} from '../private-diagnostic-review/scope.mjs';
import {settingsPath,queryPath,readinessQueries,settingsSummary} from '../private-diagnostic-review/readiness-scope.mjs';
export const operation='private-qa-finite';
export const source='941e0a156473b9fff5963aeefacc6afda9891399';
export const worker='gemnao-private-diagnostic-finite-qa';
const root=`/accounts/${account}`;
export const scriptPath=`${root}/workers/scripts/${worker}`;
const dbPath=`${root}/d1/database/${database}`;
const check=ok=>{if(!ok)throw Error('BLOCKED:FINITE_QA_SCOPE');};
const pins=JSON.parse(await readFile(new URL('pins.json',import.meta.url),'utf8'));
export const plan=Object.freeze({operation,source,worker,existingQaDatabase:'reviewed-private-scope-target',artifacts:pins,maximumSeconds:900,driverAdmissions:13,driverHardCeiling:36,maximumProviderRequests:20,retries:0,production:false,mail:false,paidUpgrade:false,legacyMutations:false,existingQaWorkerMutation:false,resources:{workers:1,sqliteDurableObjectNamespaces:1,d1Databases:0,cron:0},authorization:'existing-exact-head-run-owner-environment-review'});
export const planHash=sha256(JSON.stringify(plan));
export function allowed(path,method,body){
 if(method==='GET')return body===undefined&&[dbPath,settingsPath,scriptPath,scriptPath+'/settings'].includes(path);
 if(method==='POST'&&path===scriptPath+'/subdomain')return body===JSON.stringify({enabled:true,previews_enabled:false});
 if(method==='POST'&&path===queryPath){try{const v=JSON.parse(body);return Object.keys(v).length===1&&typeof v.sql==='string'&&(readinessQueries.includes(v.sql)||sha256(v.sql)===pins['migration.sql']);}catch{return false;}}
 if(method==='PUT'&&path===scriptPath&&body instanceof FormData){try{const m=JSON.parse(body.get('metadata'));return [...body.keys()].length===2&&body.get('worker.mjs') instanceof Blob&&m.main_module==='worker.mjs'&&m.bindings?.filter(x=>x.type==='d1').length===1&&m.bindings.find(x=>x.type==='d1').id===database&&m.bindings.find(x=>x.type==='durable_object_namespace')?.class_name==='FiniteQaBudget'&&m.logpush===false&&m.observability?.enabled===false;}catch{return false;}}
 return false;
}
export async function artifacts(){
 const result={};for(const [name,hash]of Object.entries(pins)){const bytes=await readFile(new URL(name,import.meta.url));check(sha256(bytes)===hash);result[name]=bytes.toString('utf8');}return result;
}
export async function execute({api,invoke,passphrase,now=Date.now,onStage=()=>{}}){
 const bytes=await artifacts();
 // No caller SQL, body, credentials or remote settings are ever logged.
 check(typeof passphrase==='string'&&/^[\x21-\x7e]{43,128}$/.test(passphrase));
 const db=await api(dbPath);check(db.uuid===database&&db.name===databaseName);
 const settings=await api(settingsPath),summary=settingsSummary(settings.bindings,now());
 check(summary.bindingsMatch&&summary.legacyIntakeOff&&summary.privateBindingAbsent);
 const existingOrigin=settings.bindings.find(b=>b.name==='QA_PREVIEW_ORIGIN'&&b.type==='plain_text')?.text;
 check(sha256(existingOrigin)==='8a1d25c1c6aadc2569f1d2a5c88a619f6ef146a38acc61af828fc68d24f68fcf');
 const parsed=new URL(existingOrigin);check(parsed.protocol==='https:'&&!parsed.port&&/^gemnao-diagnostic-qa\.[a-z0-9-]+\.workers\.dev$/.test(parsed.hostname));
 const origin='https://'+worker+parsed.hostname.slice('gemnao-diagnostic-qa'.length);
 const query=async sql=>{const r=await api(queryPath,'POST',JSON.stringify({sql}));check(Array.isArray(r)&&r.every(x=>x.success===true));return r;};
 const heartbeat=(await query(readinessQueries[0]))[0].results;
 check(heartbeat.length===1&&heartbeat[0].last_cleanup*1000<=now()&&heartbeat[0].last_cleanup*1000>=now()-7200000);
 check((await query(readinessQueries[1]))[0].results.length===0);
 check(await api(scriptPath,'GET',undefined,true)===null); // Only exact 404 is absence.
 const start=now(),end=start+900000;
 const vars={QA_PREVIEW_ORIGIN:origin,QA_ACCESS_SHA256:sha256(passphrase),QA_ACCESS_NOT_BEFORE:String(start),QA_ACCESS_EXPIRES_AT:String(end),PRIVATE_QA_MODE:'finite-synthetic-v1',PRIVATE_QA_START:String(Math.floor(start/1000)),PRIVATE_QA_END:String(Math.floor(end/1000)),PRIVATE_DIAGNOSTIC_ENABLED:'false',PRIVATE_DIAGNOSTIC_OWNER_REVIEW_ENABLED:'false',PRIVATE_DIAGNOSTIC_NOTIFY_ENABLED:'false'};
 const metadata=(initial,off=false)=>({main_module:'worker.mjs',compatibility_date:'2026-05-22',compatibility_flags:['nodejs_compat'],logpush:false,observability:{enabled:false},bindings:[{type:'d1',name:'PRIVATE_DIAGNOSTIC_DB',id:database},{type:'durable_object_namespace',name:'PRIVATE_QA_BUDGET',class_name:'FiniteQaBudget'},...Object.entries({...vars,...(off?{PRIVATE_QA_MODE:'closed',QA_ACCESS_EXPIRES_AT:String(start)}:{})}).map(([name,text])=>({type:'plain_text',name,text}))],...(initial?{migrations:{new_tag:'finite-private-qa-v1',new_sqlite_classes:['FiniteQaBudget']}}:{})});
 const upload=async(initial,off)=>{check(now()<end);const body=new FormData();body.set('metadata',JSON.stringify(metadata(initial,off)));body.set('worker.mjs',new Blob([bytes['worker.mjs']],{type:'application/javascript+module'}),'worker.mjs');await api(scriptPath,'PUT',body);};
 // First write creates the collision marker. Any uncertain result blocks all retries.
 onStage('create-new-qa');await upload(true,false);
 onStage('private-schema');await query(bytes['migration.sql']);
 onStage('enable-gated-worker-url');await api(scriptPath+'/subdomain','POST',JSON.stringify({enabled:true,previews_enabled:false}));
 check(now()<end);
 onStage('synthetic-driver');const result=await invoke(origin,passphrase,end);
 check(result?.ok===true&&Object.keys(result).length===1);
 onStage('close-runtime');await upload(false,true);
 const final=await api(scriptPath+'/settings');
 const value=name=>final.bindings?.find(x=>x.name===name&&x.type==='plain_text')?.text;
 check(value('PRIVATE_QA_MODE')==='closed'&&value('PRIVATE_DIAGNOSTIC_ENABLED')==='false'&&value('QA_ACCESS_EXPIRES_AT')===String(start));
 return {syntheticOnly:true,driverSucceeded:true,syntheticRowsRemoved:true,guardClosed:true,runtimeClosed:true,receiptOperational:false,notificationOperational:false,existingQaUnchanged:true,remainingWorkers:1,remainingDoNamespaces:1,remainingPrivateSchema:true,maximumWindowSeconds:900};
}
