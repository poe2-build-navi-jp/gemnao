import test from 'node:test';
import assert from 'node:assert/strict';
import {execute,allowed,scriptPath,artifacts,plan,planHash} from './profile.mjs';
import {database,databaseName} from '../private-diagnostic-review/scope.mjs';
import {settingsPath,queryPath,readinessQueries} from '../private-diagnostic-review/readiness-scope.mjs';
const now=1792750000000;
const bindings=[{type:'d1',name:'DIAGNOSIS_DB',id:'72c728f5-1656-4e26-bc11-7c508ae155c3'},{type:'d1',name:'FEEDBACK_DB',id:database},...['DIAGNOSIS_ENABLED','DIAGNOSIS_STORAGE_ENABLED','DIAGNOSIS_SHARING_ENABLED','DIAGNOSIS_WRITES_ENABLED','DIAGNOSIS_PREVIEW_SHARING_ENABLED','FEEDBACK_ENABLED','FEEDBACK_PREVIEW_ENABLED'].map(name=>({type:'plain_text',name,text:'false'})),{type:'plain_text',name:'QA_PREVIEW_ORIGIN',text:'https://gemnao-diagnostic-qa.soykururu143.workers.dev'}];
function setup(failAt=0,override={}){
 const calls=[];let metadata;
 return {calls,api:async(path,method='GET',body)=>{
  calls.push({path,method});if(calls.length===failAt)throw Error('synthetic denied or uncertain');
  assert.ok(allowed(path,method,body));
  if(path.endsWith('/d1/database/'+database))return {uuid:database,name:databaseName};
  if(path===settingsPath)return {bindings,...override};
  if(path===queryPath){const sql=JSON.parse(body).sql;if(sql===readinessQueries[0])return [{success:true,results:[{last_cleanup:now/1000}]}];if(sql===readinessQueries[1])return [{success:true,results:[]}];assert.match(sql,/CREATE TABLE private_diagnostic_reports/);assert.ok(!sql.includes('DROP TABLE'));return [{success:true,results:[]}];}
  if(path===scriptPath&&method==='GET')return null;
  if(method==='PUT'){metadata=JSON.parse(body.get('metadata'));assert.equal(metadata.bindings.find(x=>x.name==='PRIVATE_DIAGNOSTIC_DB').id,database);assert.equal(metadata.logpush,false);assert.equal(metadata.observability.enabled,false);assert.equal(metadata.bindings.find(x=>x.name==='PRIVATE_DIAGNOSTIC_ENABLED').text,'false');return {};}
  if(path===scriptPath+'/subdomain'){assert.deepEqual(JSON.parse(body),{enabled:true,previews_enabled:false});return {};}
  if(path===scriptPath+'/settings')return {bindings:metadata.bindings};
  throw Error('unexpected');
 },invoke:async(origin,token,end)=>{assert.match(origin,/^https:\/\/gemnao-private-diagnostic-finite-qa\./);assert.equal(token,'x'.repeat(64));assert.equal(end-now,900000);return {ok:true};},passphrase:'x'.repeat(64),now:()=>now};
}
test('fixed artifacts, caps, isolated bindings, successful close',async()=>{await artifacts();assert.match(planHash,/^[a-f0-9]{64}$/);assert.equal(plan.driverAdmissions,13);const s=setup();const r=await execute(s);assert.equal(r.runtimeClosed,true);assert.equal(r.receiptOperational,false);assert.equal(s.calls.length,10);assert.ok(s.calls.every(c=>!c.path.includes('production')));});
test('every provider failure/uncertainty stops without retry',async()=>{for(let i=1;i<=10;i++){const s=setup(i);await assert.rejects(()=>execute(s));assert.equal(s.calls.length,i);}});
test('collision, unexpected existing binding or intake, no writes',async()=>{const s=setup(0,{bindings:[...bindings,{type:'d1',name:'PRIVATE_DIAGNOSTIC_DB',id:database}]});await assert.rejects(()=>execute(s));assert.ok(s.calls.every(c=>c.method==='GET'));const t=setup();const inner=t.api;t.api=(p,m,b)=>p===scriptPath&&m==='GET'?{}:inner(p,m,b);await assert.rejects(()=>execute(t));assert.ok(t.calls.every(c=>c.method!=='PUT'));});
test('no production, list, billing, deletion, arbitrary account or endpoint',()=>{for(const p of ['/accounts/other/workers/scripts/x',scriptPath+'/secrets',scriptPath+'/schedules',scriptPath.replace(/\/scripts\/.*/,'/scripts'),queryPath+'/extra'])for(const m of ['GET','PUT','POST','DELETE'])assert.equal(allowed(p,m),false);assert.equal(allowed(scriptPath,'DELETE'),false);});
test('driver uncertainty forbids close-write retry and reports no success',async()=>{const s=setup();s.invoke=async()=>{throw Error('uncertain')};await assert.rejects(()=>execute(s));assert.equal(s.calls.filter(c=>c.method==='PUT').length,1);});
