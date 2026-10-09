import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {diagnose,createReader,FLAGS} from '../../ops/worker-qa-access/read-existing-gate.mjs';
const sha='a'.repeat(40),id='4cde2e6602024e6b9650d26b28955010',name='gemnao-diagnostic-qa';
const account='6a09a32cba1288cccce5912015086a35',repo='poe2-build-navi-jp/gemnao';
const branch='prepare/feedback-preview-controller-20261007',envName='gemnao-preview-data';
const now=1791497400001;
function fixture(phase='read'){
 const env={QA_DIAGNOSTIC_MODE:'read-existing-qa-gate',GITHUB_ACTIONS:'true',GITHUB_REPOSITORY:repo,GITHUB_EVENT_NAME:'workflow_dispatch',
 GITHUB_REF:'refs/heads/'+branch,GITHUB_RUN_ATTEMPT:'1',GITHUB_RUN_ID:'123',GITHUB_SHA:sha,GITHUB_WORKFLOW_SHA:sha,
 GITHUB_WORKFLOW_REF:`${repo}/.github/workflows/qa-secret-format.yml@refs/heads/${branch}`,RUNNER_ENVIRONMENT:'github-hosted',
 GITHUB_JOB:phase==='gate'?'protected-scope':'read-existing-gate',PREVIEW_GITHUB_TOKEN:'SYNTHETIC_GH',GEMNAO_PREVIEW_CLOUDFLARE_API_TOKEN:'SYNTHETIC_CF',
 QA_OUTSIDE_CF_PRESENT:'false',QA_OUTSIDE_ACCESS_PRESENT:'false'};
 const gh=`https://api.github.com/repos/${repo}`,cf=`https://api.cloudflare.com/client/v4/accounts/${account}`;
 const worker={id,name};
 const bindings=[{name:'QA_ACCESS_SHA256',type:'plain_text',text:'SYNTHETIC_VERIFIER_NEVER_OUTPUT'},
 ...[['QA_ACCESS_NOT_BEFORE','1791493800000'],['QA_ACCESS_EXPIRES_AT','1791497400000'],...FLAGS.map(f=>[f,'false'])].map(([name,text])=>({name,type:'plain_text',text}))];
 const cfBody=result=>({success:true,errors:[],result});
 const data=new Map([
 [gh+'/environments/'+envName,{id:23658815122,name:envName,can_admins_bypass:false,deployment_branch_policy:{protected_branches:false,custom_branch_policies:true},protection_rules:[{type:'required_reviewers',prevent_self_review:false,reviewers:[{type:'User',reviewer:{login:'poe2-build-navi-jp',id:325773421}}]}]}],
 [gh+`/environments/${envName}/deployment-branch-policies?per_page=100&page=1`,{total_count:1,branch_policies:[{type:'branch',name:branch}]}],
 [gh+'/actions/runs/123',{id:123,run_attempt:1,status:'in_progress',head_sha:sha,path:'.github/workflows/qa-secret-format.yml',event:'workflow_dispatch',head_branch:branch,repository:{full_name:repo}}],
 [gh+'/actions/runs/123/approvals',[{state:'approved',user:{id:325773421},environments:[{id:23658815122,name:envName}]}]],
 [gh+'/git/ref/heads/'+branch,{object:{sha}}],
 [cf,cfBody({id:account})],
 [cf+'/workers/workers?per_page=100&page=1',{...cfBody([worker]),result_info:{total_count:1,page:1,per_page:100}}],
 [cf+'/workers/workers/'+id,cfBody(worker)], [cf+'/workers/workers/'+name,cfBody(worker)],
 [cf+`/workers/scripts/${name}/settings`,cfBody({bindings})]
 ]);
 const calls=[];
 const fetchImpl=async(url,options)=>{calls.push({url,options});assert.equal(options.method,'GET');assert.equal(options.redirect,'error');assert.equal(options.body,undefined);assert(data.has(url));
 const r=new Response(JSON.stringify(data.get(url)),{headers:{'content-type':'application/json'}});Object.defineProperty(r,'url',{value:url});return r;};
 return {env,gh,cf,data,calls,bindings,fetchImpl,phase,checkoutSha:sha,now:()=>now};
}
test('expired gate yields only exact permitted fields, no verifier or credentials',async()=>{
 const f=fixture(),result=await diagnose(f);
 assert.deepEqual(Object.keys(result).sort(),['workerId','QA_ACCESS_NOT_BEFORE','QA_ACCESS_EXPIRES_AT',...FLAGS,'readAt','runId','headSha'].sort());
 assert.equal(result.QA_ACCESS_NOT_BEFORE,1791493800000);assert.equal(result.QA_ACCESS_EXPIRES_AT,1791497400000);
 assert(FLAGS.every(k=>result[k]===false));assert.equal(result.readAt,now);assert.equal(result.workerId,id);
 assert(!JSON.stringify(result).includes('SYNTHETIC'));assert.equal(f.calls.filter(c=>c.url.startsWith(f.cf)).length,5);
});
test('gate verifies protections without any Cloudflare request',async()=>{const f=fixture('gate');assert.equal(await diagnose(f),null);assert(f.calls.every(c=>c.url.startsWith(f.gh)));});
test('context drift and repo/org fallback fail closed',async()=>{
 for(const [key,value] of [['GITHUB_RUN_ATTEMPT','2'],['GITHUB_SHA','b'.repeat(40)],['GITHUB_REF','refs/heads/main'],['QA_DIAGNOSTIC_MODE',''],['GITHUB_EVENT_NAME','pull_request'],['RUNNER_DEBUG','1'],['GITHUB_JOB','classify'],['GITHUB_RUN_ID','9007199254740993']]){
 const f=fixture();f.env[key]=value;await assert.rejects(diagnose(f),/^Error: BLOCKED:QA_GATE_READ$/);assert.equal(f.calls.length,0);}
 for(const key of ['QA_OUTSIDE_CF_PRESENT','QA_OUTSIDE_ACCESS_PRESENT']){const f=fixture('gate');f.env[key]='true';await assert.rejects(diagnose(f));assert.equal(f.calls.length,0);}
});
test('wrong Environment, branch, owner approval and current run stop before CF',async()=>{
 for(const mutate of [
 f=>f.data.get(f.gh+'/environments/'+envName).can_admins_bypass=true,
 f=>f.data.get(f.gh+'/environments/'+envName).protection_rules[0].reviewers[0].reviewer.id=1,
 f=>f.data.get(f.gh+'/git/ref/heads/'+branch).object.sha='b'.repeat(40),
 f=>f.data.get(f.gh+'/actions/runs/123').run_attempt=2,
 f=>f.data.get(f.gh+'/actions/runs/123/approvals')[0].user.id=1,
 f=>f.data.get(f.gh+'/actions/runs/123/approvals')[0].state='rejected',
 f=>f.data.set(f.gh+'/actions/runs/123/approvals',[])]){
 const f=fixture();mutate(f);await assert.rejects(diagnose(f),/^Error: BLOCKED:QA_GATE_READ$/);assert(f.calls.every(c=>c.url.startsWith(f.gh)));}
});
test('account, incomplete inventory and ID/name drift deny receipt',async()=>{
 for(const mutate of [
 f=>f.data.get(f.cf).result.id='wrong',
 f=>f.data.get(f.cf+'/workers/workers?per_page=100&page=1').result_info.total_count=2,
 f=>f.data.get(f.cf+'/workers/workers/'+name).result.id='b'.repeat(32),
 f=>f.data.get(f.cf+'/workers/workers?per_page=100&page=1').result.push({id:'b'.repeat(32),name})]){
 const f=fixture();mutate(f);await assert.rejects(diagnose(f),/^Error: BLOCKED:QA_GATE_READ$/);}
});
test('invalid/duplicate timestamps and flags never emit partial receipt',async()=>{
 for(const mutate of [
 f=>f.bindings.find(b=>b.name==='QA_ACCESS_NOT_BEFORE').text='1791493800000x',
 f=>f.bindings.find(b=>b.name==='QA_ACCESS_EXPIRES_AT').text='1791493800000',
 f=>f.bindings.find(b=>b.name==='QA_ACCESS_EXPIRES_AT').text='1791497400001',
 f=>f.bindings.find(b=>b.name===FLAGS[0]).text='1',
 f=>f.bindings.push({name:FLAGS[0],type:'plain_text',text:'false'}),
 f=>f.bindings.find(b=>b.name===FLAGS[0]).type='secret_text']){
 const f=fixture();mutate(f);await assert.rejects(diagnose(f),/^Error: BLOCKED:QA_GATE_READ$/);}
});
test('transport rejects writes, DB queries, other resources, repeated GET and gate CF access',async()=>{
 const f=fixture();const r=createReader(f);
 for(const [url,options] of [[f.cf+'/d1/database/x/query',{method:'POST'}],[f.cf,{method:'PUT'}],[f.cf,{method:'GET',body:'x'}],['https://example.invalid',{method:'GET'}],[f.cf+'/workers/scripts/other/settings',{method:'GET'}]])await assert.rejects(r.transport(url,options));
 assert.equal(f.calls.length,0);await r.get('cf','');await assert.rejects(r.get('cf',''));assert.equal(f.calls.length,1);
 await assert.rejects(createReader({...f,phase:'gate'}).get('cf',''));
});
test('provider errors, redirects, bad JSON and oversize responses use fixed code without retry',async()=>{
 for(const variant of ['throw','redirect','wrong-url','bad-json','oversize','status','type']){
 const f=fixture();let calls=0;
 f.fetchImpl=async(url)=>{calls++;if(variant==='throw')throw new Error('SYNTHETIC_SECRET_PROVIDER_TEXT');
 const response=new Response(variant==='oversize'?'x'.repeat(1048577):'SYNTHETIC_SECRET_PROVIDER_TEXT',{status:variant==='status'?403:200,headers:{'content-type':variant==='type'?'text/html':'application/json'}});
 Object.defineProperty(response,'url',{value:variant==='wrong-url'?'https://example.invalid':url});if(variant==='redirect')Object.defineProperty(response,'redirected',{value:true});return response;};
 await assert.rejects(diagnose(f),/^Error: BLOCKED:QA_GATE_READ$/);assert.equal(calls,1);}
});
test('workflow keeps read mode explicit, protected and separate from secret classifier',()=>{
 const w=readFileSync('.github/workflows/qa-secret-format.yml','utf8');
 assert(w.includes('options: [classify-secret-format, read-existing-qa-gate]'));
 const read=w.split('  read-existing-gate:\n')[1];assert(read.includes('environment: gemnao-preview-data'));assert(!read.includes('GEMNAO_QA_ACCESS_PASSPHRASE'));assert(!read.includes('PREVIEW_APPROVAL_RECORD'));
 assert(read.includes('read-existing-gate.mjs read'));assert(w.includes('read-existing-gate.mjs gate'));
});
test('CF malformed or failed envelopes produce no receipt and no retry',async()=>{
 for(const value of [{success:false,errors:[],result:{id:account}},{success:true,errors:[{message:'SYNTHETIC_SECRET'}],result:{id:account}},{success:true,result:{id:account}}]){
 const f=fixture();f.data.set(f.cf,value);await assert.rejects(diagnose(f),/^Error: BLOCKED:QA_GATE_READ$/);assert.equal(f.calls.filter(c=>c.url===f.cf).length,1);}
});
test('boolean true flags are faithfully read, never interpreted as permission to mutate',async()=>{
 const f=fixture();for(const binding of f.bindings)if(FLAGS.includes(binding.name))binding.text='true';
 const result=await diagnose(f);assert(FLAGS.every(k=>result[k]===true));assert(f.calls.every(c=>c.options.method==='GET'));
});
