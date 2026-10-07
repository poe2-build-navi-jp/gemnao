import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {FIXED,validatePins,validateContext,validateRecord,deploymentConfig,createApi,deployOnce,preflight} from '../../ops/worker-qa/deploy.mjs';
import {SETUP} from '../../ops/feedback-preview/live.mjs';
import {TARGET,sha256} from '../../ops/feedback-preview/controller.mjs';
import {canonical} from '../../ops/feedback-preview/adapter.mjs';
const now=Date.UTC(2026,9,7,16), hash='a'.repeat(64), sha='b'.repeat(40);
const pins={executionReviewed:true,sourceCommit:sha,sourceTree:'c'.repeat(40),sourceLockSha256:hash,origin:'https://gemnao-diagnostic-qa.synthetic-test.workers.dev'};
const env={GITHUB_RUN_ID:'1234',GITHUB_SHA:sha,QA_ARTIFACT_ID:'789'};
function record() {return {operation:'create-public-qa-worker-disabled-intake',accountId:TARGET.accountId,worker:FIXED.worker,runId:1234,
 commit:sha,ref:SETUP.ref,ownerId:FIXED.owner,pinsSha256:sha256(canonical(pins)),creationReceiptSha256:FIXED.receiptSha256,
 origin:pins.origin,approvedAt:now-1000,expiresAt:now+60000,nameTargeting:'immutable-id-rechecks-with-residual-name-race-accepted',
 wranglerRetries:'pinned-official-internal-retries-accepted-no-cli-rerun',intakeEnabled:false,syntheticOnly:true,
 tokenReview:{kind:'owner-reviewed-scope',secretName:SETUP.secret,accountId:TARGET.accountId,scopeKnown:true,noExpansion:true,accountOnly:true,permissionsReviewed:true,evidenceSha256:hash,reviewedAt:now-1000,expiresAt:now+120000},
 costReview:{accountId:TARGET.accountId,workersPlan:'workers-free',maximumChargeUSD:0,evidenceSha256:hash,reviewedAt:now-1000,validUntil:now+120000,workerLimit:100,workerSlotsReserved:1,assetFileLimit:20000,scriptGzipLimitBytes:3*1024*1024,publicTrafficRiskAccepted:true,
 budgets:Object.fromEntries(['workerRequests','d1RowsRead','d1RowsWritten','storageBytes'].map(k=>[k,{remaining:10,reserve:1,existingTrafficAllowance:1}]))},
 artifactStorageReviewSha256:hash,reconciledNoWriteRuns:[],artifact:{id:789,archiveSha256:hash,manifestSha256:hash,bundleSha256:hash,deploymentConfigSha256:hash}};}
function check(r,p=pins,e=env){const bytes=JSON.stringify(r);return validateRecord(bytes,sha256(bytes),e,p,now);}
function config(){return {$schema:'./node_modules/wrangler/config-schema.json',name:FIXED.worker,account_id:TARGET.accountId,
 main:'./cloudflare/worker-preview.mjs',compatibility_date:'2026-05-22',compatibility_flags:['nodejs_compat'],workers_dev:true,
 preview_urls:false,send_metrics:false,upload_source_maps:false,assets:{directory:'./dist/worker-preview/assets',binding:'ASSETS',run_worker_first:true,html_handling:'none',not_found_handling:'none'},
 vars:{QA_PREVIEW_ORIGIN:pins.origin,DIAGNOSIS_LOCAL_BETA:'true',DIAGNOSIS_ENABLED:'false',DIAGNOSIS_STORAGE_ENABLED:'false',DIAGNOSIS_SHARING_ENABLED:'false',DIAGNOSIS_WRITES_ENABLED:'false',DIAGNOSIS_METRICS_ENABLED:'false',DIAGNOSIS_PREVIEW_SHARING_ENABLED:'false',DIAGNOSIS_PREVIEW_ORIGIN:pins.origin,FEEDBACK_ENABLED:'false',FEEDBACK_PREVIEW_ENABLED:'false',FEEDBACK_PREVIEW_ORIGIN:pins.origin},d1_databases:structuredClone(FIXED.databases)};}
test('reviewed committed pins validate; disabled or incomplete pins fail before provider action',async()=>{
 const p=JSON.parse(await readFile(new URL('../../ops/worker-qa/pins.json',import.meta.url),'utf8'));
 assert.equal(validatePins(p),p);
 assert.throws(()=>validatePins({...p,executionReviewed:false}),/UNREVIEWED_PINS/);
 for(const field of ['sourceCommit','sourceTree','origin','sourceLockSha256'])
  assert.throws(()=>validatePins({...p,[field]:null}),/UNREVIEWED_PINS/);
});
test('only a complete exact-run synthetic record validates',()=>assert.equal(check(record()).runId,1234));
for(const [label,mutate] of Object.entries({
 'unknown token scope':r=>r.tokenReview.scopeKnown=false,
 'unknown free plan':r=>r.costReview.workersPlan='unknown',
 'expired record':r=>r.expiresAt=now,
 'wrong owner':r=>r.ownerId++,
 'another artifact':r=>r.artifact.id++,
 'unaccepted retry behavior':r=>delete r.wranglerRetries,
 'insufficient traffic headroom':r=>r.costReview.budgets.workerRequests.remaining=0,
 'intake activation':r=>r.intakeEnabled=true,
 'wrong D1 receipt':r=>r.creationReceiptSha256='d'.repeat(64),
})) test(label+' blocks',()=>{const r=record();mutate(r);assert.throws(()=>check(r),/BLOCKED/);});
test('workflow is exact manual, controller branch, first attempt and hosted',()=>{
 const e={...env,GITHUB_ACTIONS:'true',GITHUB_REPOSITORY:TARGET.repository,GITHUB_EVENT_NAME:'workflow_dispatch',GITHUB_REF:SETUP.ref,GITHUB_RUN_ATTEMPT:'1',GITHUB_WORKFLOW_SHA:sha,GITHUB_WORKFLOW_REF:`${TARGET.repository}/${FIXED.workflow}@${SETUP.ref}`,RUNNER_ENVIRONMENT:'github-hosted',GITHUB_JOB:'deploy'};
 validateContext(e,sha,'deploy');for(const key of ['GITHUB_RUN_ATTEMPT','GITHUB_REF','GITHUB_JOB','GITHUB_WORKFLOW_SHA'])assert.throws(()=>validateContext({...e,[key]:'wrong'},sha,'deploy'));
});
test('derivative config disables rebundling and keeps only two exact D1s plus assets',()=>{
 const d=deploymentConfig(config(),pins.origin);assert.equal(d.no_bundle,true);assert.equal(d.observability.enabled,false);assert.equal(d.logpush,false);assert.deepEqual(d.d1_databases,FIXED.databases);
});
for(const [label,mutate] of Object.entries({
 'ordinary DB':c=>c.d1_databases.push({binding:'DB',database_id:'fake'}),
 'Cron':c=>c.triggers={crons:['* * * * *']},'build hook':c=>c.build={command:'evil'},
 'custom route':c=>c.routes=['example.com/*'],'GA variable':c=>c.vars.GA_ID='G-FAKE',
 'enabled intake':c=>c.vars.FEEDBACK_ENABLED='true','wrong hostname':c=>c.vars.QA_PREVIEW_ORIGIN='https://example.com',
}))test(label+' config blocks',()=>{const c=config();mutate(c);assert.throws(()=>deploymentConfig(c,pins.origin));});
function fakeDeployment(options={}) {
 const calls=[],id='d'.repeat(32),r=record(),vars=config().vars;let deployed=false;
 const api=async(service,path,method='GET',body)=>{
  calls.push({service,path,method,body});
  if(method==='POST'){if(options.createError)throw new Error('uncertain');return {result:{id,name:FIXED.worker,subdomain:{enabled:false,previews_enabled:false}}};}
  if(path.includes('/workers/workers/'))return {result:{id,name:options.identityDrift&&deployed?'another-worker':FIXED.worker,subdomain:{enabled:deployed,previews_enabled:false},logpush:false,observability:{enabled:false}}};
  if(path.endsWith('/settings'))return {result:{bindings:[...FIXED.databases.map(x=>({type:'d1',name:x.binding,id:options.bindingDrift?'bad':x.database_id})),{type:'assets',name:'ASSETS'},...Object.entries(vars).map(([name,text])=>({type:'plain_text',name,text}))]}};
  if(path.endsWith('/schedules'))return {result:options.cronResult ?? {schedules:[]}};throw Error('unexpected');
 };
 let claims=0,deploys=0,verifies=0;
 return {calls,counts:()=>({claims,deploys,verifies}),run:()=>deployOnce({api,record:r,pins,expectedVars:vars,existingIds:options.existingIds??[],now:()=>now,
 claim:async()=>{claims++;if(options.claimError)throw Error('claim conflict');},reverify:async()=>{verifies++;},
 runWrangler:async()=>{deploys++;if(options.deployError)throw Error('uncertain');deployed=true;}})};
}
test('one fresh identity, rechecks, one Wrangler invocation, exact readbacks',async()=>{
 const f=fakeDeployment();const got=await f.run();assert.equal(got.intakeEnabled,false);assert.equal(got.actualQaVerified,false);assert.equal(got.origin,pins.origin);
 assert.deepEqual(f.counts(),{claims:1,deploys:1,verifies:2});assert.equal(f.calls.filter(x=>x.method!=='GET').length,1);
 assert.ok(!f.calls.some(x=>x.method==='DELETE'||x.path.includes('/query')));
});
for(const option of ['claimError','createError','deployError','identityDrift','bindingDrift'])test(option+' stops without retry or deletion',async()=>{
 const f=fakeDeployment({[option]:true});await assert.rejects(f.run());assert.ok(f.counts().deploys<=1);assert.ok(f.calls.filter(x=>x.method==='POST').length<=1);assert.ok(!f.calls.some(x=>x.method==='DELETE'));
});
test('a returned pre-existing immutable ID is rejected',async()=>{const f=fakeDeployment({existingIds:['d'.repeat(32)]});await assert.rejects(f.run(),/CREATE_OUTCOME_UNKNOWN/);assert.equal(f.counts().deploys,0);});
test('bounded API rejects mutation outside create and malformed provider response',async()=>{
 let sent=0;const api=createApi(async(url)=>{sent++;const r=new Response(JSON.stringify({success:false,result:{},errors:[]} ),{headers:{'content-type':'application/json'}});Object.defineProperty(r,'url',{value:url});return r;});
 await assert.rejects(api('cf','/workers/scripts/anything','DELETE'),/REQUEST_SCOPE/);assert.equal(sent,0);
 await assert.rejects(api('cf',''),/CF_ENVELOPE/);assert.equal(sent,1);
});
test('workflow only injects Cloudflare credential in final action; artifact is immutable',async()=>{
 const y=await readFile(new URL('../../.github/workflows/worker-qa-deploy.yml',import.meta.url),'utf8');
 assert.equal((y.match(/GEMNAO_PREVIEW_CLOUDFLARE_API_TOKEN: \$\{\{/g)||[]).length,1);
 assert.match(y,/overwrite: false/);assert.match(y,/retention-days: 1/);assert.match(y,/artifact-ids:/);
 assert.ok(y.lastIndexOf('pnpm build')<y.indexOf('  deploy:'));assert.ok(!y.includes('cancel-in-progress: true'));
});
function preflightFixture(change=()=>{}) {
 const r=record(),id='e'.repeat(32),rows=[{id,name:'existing-unrelated'}],calls=[];
 const data={
  [`/actions/runs/${r.runId}`]:{id:r.runId,head_sha:sha,run_attempt:1,status:'in_progress',event:'workflow_dispatch',path:FIXED.workflow,repository:{full_name:TARGET.repository},head_branch:SETUP.ref.slice(11)},
  [`/git/ref/heads/${SETUP.ref.slice(11)}`]:{object:{sha}},
  [`/actions/runs/${r.runId}/approvals`]:[{environments:[{id:SETUP.environmentId,name:SETUP.environment}],state:'approved',user:{id:FIXED.owner}}],
  '/actions/workflows/worker-qa-deploy.yml/runs?per_page=100&page=1':{total_count:1,workflow_runs:[{id:r.runId,head_sha:sha}]},
  [`/actions/artifacts/${r.artifact.id}`]:{id:r.artifact.id,expired:false,workflow_run:{id:r.runId,head_sha:sha},digest:`sha256:${hash}`,size_in_bytes:1234},
  '':{result:{id:TARGET.accountId}},'/workers/subdomain':{result:{subdomain:'synthetic-test'}},
  '/workers/workers?per_page=100&page=1':{result:rows,result_info:{total_count:1,page:1,per_page:100}},
  ...Object.fromEntries(FIXED.databases.map(d=>[`/d1/database/${d.database_id}`,{result:{uuid:d.database_id,name:d.database_name}}])),
 };
 change(data);
 const api=async(service,path,method='GET')=>{assert.equal(method,'GET');calls.push(path);assert.ok(Object.hasOwn(data,path),path);return data[path];};
 const transport=async(url,options)=>{
  assert.equal(options.method,'GET');let body;
  if(url.includes('deployment-branch-policies'))body={total_count:1,branch_policies:[{type:'branch',name:SETUP.ref.slice(11)}]};
  else body={id:SETUP.environmentId,name:SETUP.environment,can_admins_bypass:false,deployment_branch_policy:{protected_branches:false,custom_branch_policies:true},protection_rules:[{type:'required_reviewers',prevent_self_review:false,reviewers:[{type:'User',reviewer:{login:SETUP.reviewerLogin,id:FIXED.owner}}]}]};
  const response=new Response(JSON.stringify(body),{headers:{'content-type':'application/json'}});Object.defineProperty(response,'url',{value:url});return response;
 };
 return {calls,run:()=>preflight({api,transport,record:r,pins})};
}
test('preflight authenticates exact owner, run, artifact, account, origin and receipt DBs using reads only',async()=>{
 const f=preflightFixture();assert.equal((await f.run()).length,1);assert.ok(f.calls.every(x=>!x.includes('/query')));
});
for(const [label,edit] of Object.entries({
 'collision':d=>d['/workers/workers?per_page=100&page=1'].result[0].name=FIXED.worker,
 'wrong account':d=>d[''].result.id='0'.repeat(32),
 'wrong subdomain':d=>d['/workers/subdomain'].result.subdomain='other',
 'truncated inventory':d=>d['/workers/workers?per_page=100&page=1'].result_info.total_count=2,
 'wrong artifact run':d=>d['/actions/artifacts/789'].workflow_run.id=999,
 'wrong D1':d=>d[`/d1/database/${FIXED.databases[0].database_id}`].result.uuid='wrong',
 'missing owner approval':d=>d['/actions/runs/1234/approvals']=[],
 'unreconciled prior run':d=>{const h=d['/actions/workflows/worker-qa-deploy.yml/runs?per_page=100&page=1'];h.total_count=2;h.workflow_runs.push({id:1233,head_sha:sha,run_attempt:1,status:'completed'});},
}))test(label+' preflight fails without a mutation',async()=>await assert.rejects(preflightFixture(edit).run(),/BLOCKED/));
test('documented Cron result.schedules is required; arrays and malformed objects fail',async()=>{
 for(const cronResult of [[],{},null,{schedules:null},{schedules:[null]},{schedules:[{cron:'* * * * *'}]}]) {
  // null is provided directly by a transport fixture because undefined means default.
  const f=fakeDeployment({cronResult:cronResult===null?{schedules:null}:cronResult});
  await assert.rejects(f.run(),/UNEXPECTED_CRON/);assert.equal(f.counts().deploys,1);
 }
});
function envelopeApi(json) {return createApi(async url=>{
 const response=new Response(JSON.stringify(json),{headers:{'content-type':'application/json'}});
 Object.defineProperty(response,'url',{value:url});return response;
});}
test('beta Worker create/get/version and list accept absent/null errors with explicit success only',async()=>{
 for(const errors of [undefined,null])for(const [method,path] of [
  ['POST','/workers/workers'],['GET','/workers/workers?per_page=100&page=1'],
  ['GET',`/workers/workers/${'a'.repeat(32)}`],['GET',`/workers/workers/${FIXED.worker}`],
  ['GET',`/workers/workers/${'a'.repeat(32)}/versions/11111111-1111-1111-1111-111111111111?include=modules`],
 ]) await envelopeApi({success:true,errors,result:{}})('cf',path,method);
});
test('envelope compatibility never relaxes explicit success, errors or other endpoint families',async()=>{
 for(const json of [{result:{}},{success:false,result:{}},{success:'true',result:{}},
  {success:true,errors:{},result:{}},{success:true,errors:[{message:'synthetic'}],result:{}}])
  await assert.rejects(envelopeApi(json)('cf','/workers/workers','POST'),/CF_ENVELOPE/);
 for(const path of ['',`/d1/database/${FIXED.databases[0].database_id}`,
  `/workers/scripts/${FIXED.worker}/schedules`,`/workers/scripts/${FIXED.worker}/settings`,'/workers/subdomain'])
  for(const errors of [undefined,null])await assert.rejects(envelopeApi({success:true,errors,result:{}})('cf',path),/CF_ENVELOPE/);
 // Version writes remain unsupported by the wrapper; official Wrangler owns them.
 await assert.rejects(envelopeApi({success:true,result:{}})('cf',`/workers/workers/${'a'.repeat(32)}/versions`,'POST'),/REQUEST_SCOPE/);
});
test('explicit user-configured token scope with fixed authenticated receipt preserves unverified restrictions/expiry',()=>{
 const r=record();r.tokenReview={kind:'user-configured-scope-plus-authenticated-target-receipt',secretName:SETUP.secret,
  accountId:TARGET.accountId,noExpansion:true,evidenceSha256:hash,creationRunId:37640786041,
  creationReceiptSha256:FIXED.receiptSha256,accountRestriction:'unverified',expiry:'unverified'};
 assert.equal(check(r).tokenReview.expiry,'unverified');
 for(const [key,value] of [['creationRunId',1],['creationReceiptSha256','f'.repeat(64)],['accountRestriction','verified'],['expiry','safe-until'],['noExpansion',false],['evidenceSha256','missing']]) {
  const changed=structuredClone(r);changed.tokenReview[key]=value;assert.throws(()=>check(changed),/TOKEN/);
 }
});
