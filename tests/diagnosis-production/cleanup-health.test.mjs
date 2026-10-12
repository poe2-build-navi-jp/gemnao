import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { TARGET, sha256 } from '../../ops/feedback-preview/controller.mjs';
import { validateRecord, createProductionHealthAdapter, createPreparedAdapter } from '../../ops/feedback-preview/adapter.mjs';
import { runProtected, runGate, credentialTransport, publicRunResult, SETUP } from '../../ops/feedback-preview/live.mjs';
import { PRODUCTION_HEALTH_OPERATION as operation, PRODUCTION_HEALTH_MODE as mode, PRODUCTION_HEALTH_PLAN_HASH as planHash,
  PRODUCTION_HEALTH_TARGETS as targets, CLEANUP_INSTALLATION, productionHealthTransport,
  productionHeartbeatStatus, PRODUCTION_HEALTH_AUTHORIZATION, validateProductionHealthContext } from '../../ops/diagnosis-production/cleanup-health.mjs';
import { PRODUCTION_PLAN_HASH } from '../../ops/diagnosis-production/database-profile.mjs';
import { CLEANUP_PLAN_HASH } from '../../ops/diagnosis-production/cleanup-profile.mjs';
import { fixtureRecord, mock, workflow } from '../feedback-preview/fixtures.mjs';
const now = Date.parse('2026-10-12T07:45:00Z');
const account = `https://api.cloudflare.com/client/v4/accounts/${TARGET.accountId}`;
function setup(mutate = () => {}) {
  const base = fixtureRecord();
  const r = { ...base, ref: SETUP.ref, reviewers: [PRODUCTION_HEALTH_AUTHORIZATION.reviewerId] };
  const network = mock(r, (c,v) => {
    if (c.path.endsWith(`/environments/${SETUP.environment}`)) {
      v.id = SETUP.environmentId; v.protection_rules[0].reviewers[0].reviewer.login = SETUP.reviewerLogin;
      v.protection_rules[0].reviewers[0].reviewer.id = r.reviewers[0];
    }
    if (c.path.endsWith('/approvals')) { v[0].environments[0].id = SETUP.environmentId; v[0].user.id = r.reviewers[0]; }
    mutate(c,v);
  });
  const calls = [];
  const transport = async (url, options) => {
    calls.push({url,options});
    if (!url.startsWith(account)) return network.transport(url, options);
    const target = targets.find(t => url === `${account}/d1/database/${t.databaseId}` || url === `${account}/d1/database/${t.databaseId}/query`);
    assert.ok(target, 'no inventory, Worker, account, or QA request allowed');
    const result = options.method === 'GET' ? { uuid: target.databaseId, name: target.databaseName }
      : [{ success: true, results: target.feature === 'sharing'
        ? [{ value: String(target.firstScheduledAt), expires_at: target.firstScheduledAt + 7_200_000 }]
        : [{ last_cleanup: target.firstScheduledAt / 1000 }], meta: { rows_read: 1, rows_written: 0, changed_db: false } }];
    if (options.method !== 'GET') { assert.equal(options.method,'POST'); assert.equal(options.body,JSON.stringify({sql:target.sql})); }
    const value = {success:true,errors:[],result};
    mutate({path:new URL(url).pathname.replace('/client/v4',''),method:options.method,target},value);
    const response = new Response(JSON.stringify(value),{status:200,headers:{'content-type':'application/json'}});
    Object.defineProperty(response,'url',{value:url}); return response;
  };
  const env = (job = 'provision') => ({ GITHUB_ACTIONS:'true', GITHUB_REPOSITORY:TARGET.repository,
    GITHUB_EVENT_NAME:'workflow_dispatch', GITHUB_REF:SETUP.ref, GITHUB_RUN_ATTEMPT:'1', GITHUB_RUN_ID:String(r.runId),
    GITHUB_SHA:r.commit, GITHUB_WORKFLOW_SHA:r.commit, GITHUB_WORKFLOW_REF:`${TARGET.repository}/.github/workflows/${workflow}@${SETUP.ref}`,
    RUNNER_ENVIRONMENT:'github-hosted', GITHUB_JOB:job, PREVIEW_PROTECTED_ENVIRONMENT:SETUP.environment,
    PREVIEW_OPERATION:operation,
    PREVIEW_OUTSIDE_RECORD_PRESENT:'false', PREVIEW_OUTSIDE_DIGEST_PRESENT:'false' });
  const context = () => ({repository:TARGET.repository,ref:r.ref,commit:r.commit,runId:r.runId,reviewerId:r.reviewers[0]});
  const options = () => ({transport, context:context(), now:()=>now});
  return {r,calls,transport,context,env,options};
}
await test('protected production heartbeat path uses exactly two identity GETs and two pinned SELECTs, no SDK',async()=>{
  const f=setup();
  const gate=await runGate({env:f.env('gate'),checkoutSha:f.r.commit,transport:f.transport});
  assert.equal(gate.planHash,planHash); assert.ok(f.calls.every(c=>c.url.startsWith('https://api.github.com/')));
  const result=await runProtected({env:f.env(),checkoutSha:f.r.commit,transport:f.transport,now:()=>now,
    loadClient:()=>assert.fail('read-only operation must not load an artifact client')});
  assert.deepEqual(publicRunResult(result),{mode,readOnly:true,intakeEnabled:false,alertDeliveryVerified:false,
    sharing:{lastSuccessAt:'2026-10-12T07:17:00.000Z',healthy:true,pending:false},
    feedback:{lastSuccessAt:'2026-10-12T07:43:00.000Z',healthy:true,pending:false},
    observedAt:'2026-10-12T07:45:00.000Z',actualHeartbeatVerified:true});
  assert.deepEqual(f.calls.filter(c=>c.url.startsWith(account)).map(c=>c.options.method),['GET','GET','POST','POST']);
  assert.ok(!f.calls.some(c=>/workers|artifacts/.test(c.url)));
});
await test('transport and credential boundary reject other DBs, changed SQL, parameters, retries and all writes',async()=>{
  let calls=0;const inner=()=>{calls++;return {};};
  const transport=productionHealthTransport(inner);const t=targets[0],url=`${account}/d1/database/${t.databaseId}/query`;
  const credential=credentialTransport({operation,githubToken:()=>assert.fail(),cloudflareToken:()=> 'SYNTHETIC',fetchImpl:inner});
  const bad=[{url,options:{method:'DELETE'}},{url,options:{method:'PUT'}},
    {url,options:{method:'POST',body:JSON.stringify({sql:t.sql+' DELETE FROM diagnosis_shared;'})}},
    {url,options:{method:'POST',body:JSON.stringify({sql:t.sql,params:[]})}},
    {url,options:{method:'POST',body:JSON.stringify({sql:'SELECT * FROM diagnosis_shared;'})}},
    {url:`${account}/d1/database/72c728f5-1656-4e26-bc11-7c508ae155c3/query`,options:{method:'POST',body:JSON.stringify({sql:t.sql})}},
    {url:`${account}/workers/workers`,options:{method:'GET'}},
    {url:url+'?extra=1',options:{method:'POST',body:JSON.stringify({sql:t.sql})}}];
  for(const b of bad){assert.throws(()=>transport(b.url,b.options),/HEALTH_REQUEST_SCOPE/);await assert.rejects(credential(b.url,b.options),/TRANSPORT_SCOPE|TRANSPORT_METHOD/);}
  assert.equal(calls,0);transport(url,{method:'POST',body:JSON.stringify({sql:t.sql})});
  assert.throws(()=>transport(url,{method:'POST',body:JSON.stringify({sql:t.sql})}),/HEALTH_QUERY_ONCE/);assert.equal(calls,1);
});
await test('actual owner review, exact run/head, Environment and bypass protections precede every Cloudflare request',async()=>{
  for(const mutate of [(c,v)=>{if(c.path.endsWith('/approvals'))v.splice(0);},
    (c,v)=>{if(c.path.endsWith('/approvals'))v[0].state='rejected';},
    (c,v)=>{if(c.path.endsWith('/approvals'))v[0].user.id=123;},
    (c,v)=>{if(c.path.endsWith('/approvals'))v[0].environments[0].id=123;},
    (c,v)=>{if(c.path.includes('/git/ref/'))v.object.sha='b'.repeat(40);},
    (c,v)=>{if(c.path.endsWith('/actions/runs/12345'))v.head_sha='b'.repeat(40);},
    (c,v)=>{if(c.path.endsWith('/actions/runs/12345'))v.id=99999;},
    (c,v)=>{if(c.path.endsWith('/actions/runs/12345'))v.run_attempt=2;},
    (c,v)=>{if(c.path.endsWith(`/environments/${SETUP.environment}`))v.can_admins_bypass=true;},
    (c,v)=>{if(c.path.endsWith(`/environments/${SETUP.environment}`))v.id=123;},
    (c,v)=>{if(c.path.endsWith('/deployment-branch-policies'))v.branch_policies[0].name='*';}]){
    const f=setup(mutate);await assert.rejects(runProtected({env:f.env(),checkoutSha:f.r.commit,transport:f.transport,now:()=>now}),/BLOCKED/);
    assert.ok(f.calls.every(c=>!c.url.startsWith(account)));
  }
  for(const mutate of [e=>{e.GITHUB_RUN_ATTEMPT='2';},e=>{e.GITHUB_REF='refs/heads/main';},
    e=>{e.GITHUB_SHA='b'.repeat(40);},e=>{e.GITHUB_WORKFLOW_SHA='b'.repeat(40);}]){
    const f=setup(),e=f.env();mutate(e);
    await assert.rejects(runProtected({env:e,checkoutSha:f.r.commit,transport:f.transport,now:()=>now}),/WORKFLOW_CONTEXT/);assert.equal(f.calls.length,0);
  }
});
await test('health never accesses approval-record secrets or invents approval time and rejects old record inputs',async()=>{
  const f=setup(),e=f.env();
  for(const key of ['PREVIEW_APPROVAL_RECORD','PREVIEW_APPROVAL_SHA256'])Object.defineProperty(e,key,{get(){return assert.fail('health must not read old approval records');}});
  const result=await runProtected({env:e,checkoutSha:f.r.commit,transport:f.transport,now:()=>now,loadClient:()=>assert.fail()});
  assert.equal(result.actualHeartbeatVerified,true);
  const context=validateProductionHealthContext(f.context());
  assert.ok(!('approvedAt' in context));assert.ok(!('costEvidence' in context));assert.ok(!('trustedRecordHash' in context));
  assert.throws(()=>validateProductionHealthContext({...f.context(),approvedAt:now}),/WORKFLOW_CONTEXT/);
  assert.throws(()=>validateProductionHealthContext({...f.context(),reviewerId:123}),/EXACT_OWNER_RECORD/);
  const oldBytes=JSON.stringify(f.r);assert.throws(()=>validateRecord(oldBytes,sha256(oldBytes),now,operation),/HEALTH_MODE/);
});
await test('record-free health context cannot authorize any write operation',async()=>{
  for(const writeOperation of ['preview','production-databases','production-cleanup']){
    const f=setup(),e=f.env();e.PREVIEW_OPERATION=writeOperation;
    await assert.rejects(runProtected({env:e,checkoutSha:f.r.commit,transport:f.transport,now:()=>now}),/ENVIRONMENT_RECORD_MISSING_OR_MISMATCHED/);
    assert.equal(f.calls.length,0);
  }
});
await test('identity mismatch precedes SELECTs; health capability cannot provision or retry uncertain responses',async()=>{
  const bad=setup((c,v)=>{if(c.target?.feature==='feedback'&&c.method==='GET')v.result.uuid=targets[0].databaseId;});
  await assert.rejects((await createProductionHealthAdapter(bad.options())).health(),/HEALTH_DATABASE_IDENTITY/);
  assert.ok(bad.calls.every(c=>c.options.method==='GET'));
  const f=setup((c)=>{if(c.target&&c.method==='POST')throw Error('SYNTHETIC_PRIVATE');});
  const adapter=await createProductionHealthAdapter(f.options());assert.deepEqual(Object.keys(adapter),['health']);
  await assert.rejects(adapter.health(),/REQUEST_UNCERTAIN_OR_INVALID/);const count=f.calls.length;
  await assert.rejects(adapter.health(),/ATTEMPT_ALREADY_STARTED/);assert.equal(f.calls.length,count);
  await assert.rejects(createPreparedAdapter({...f.options(),operation}),/HEALTH_MODE/);assert.equal(f.calls.length,count);
});
await test('only post-installation scheduled, recent heartbeat stamps verify; malformed/private/write-marked rows fail closed',()=>{
  const result=rows=>[{success:true,results:rows,meta:{rows_written:0,changed_db:false}}];
  assert.deepEqual(productionHeartbeatStatus('sharing',result([]),now),{lastSuccessAt:null,healthy:false,pending:true});
  for(const stamp of [0,targets[1].confirmedAt-1000,targets[1].firstScheduledAt-1000,now+1000,now-7_200_001])
    assert.equal(productionHeartbeatStatus('feedback',result([{last_cleanup:Math.floor(stamp/1000)}]),now).healthy,false);
  for(const bad of [result([{last_cleanup:now/1000,body:'SYNTHETIC_PRIVATE'}]),result([{last_cleanup:'bad'}]),
    result([{},{}]),result([null]),[{success:true,results:[],meta:{rows_written:1,changed_db:true}}],
    [{success:true,results:[],meta:{}}]])assert.throws(()=>productionHeartbeatStatus('feedback',bad,now),/HEALTH_/);
  assert.throws(()=>productionHeartbeatStatus('sharing',result([{value:String(now),expires_at:now}]),now),/HEALTH_HEARTBEAT_SHAPE/);
});
await test('receipt identity and existing installation/database plan hashes remain pinned',async()=>{
  const bytes=await readFile('ops/diagnosis-production/cleanup-installation.receipt.json');assert.equal(sha256(bytes),CLEANUP_INSTALLATION.receiptSha256);
  const receipt=JSON.parse(bytes);assert.equal(receipt.runId,CLEANUP_INSTALLATION.runId);assert.equal(receipt.sourceSha,CLEANUP_INSTALLATION.sourceSha);
  assert.equal(receipt.result.journal.length,6);assert.ok(receipt.result.journal.every(j=>j.outcome==='confirmed'));
  for(const t of targets){const r=receipt.result.receipts.find(r=>r.feature===t.feature);
    for(const key of ['databaseId','databaseName','workerId','versionId','confirmedAt'])assert.equal(t[key],r[key]);assert.equal(sha256(t.sql),t.sqlSha256);}
  assert.equal(PRODUCTION_PLAN_HASH,'44ef66446ead162f4f18aa60b3b6481c9e04d1e2f1b38276638c1d400985138b');
  assert.equal(CLEANUP_PLAN_HASH,'3b8d0e7b0e59a88abb0bbefd51f75d1a169b6b511e057f283914c72dc249d25f');
  const f=setup();assert.equal(validateProductionHealthContext(f.context()).planHash,planHash);
});
await test('production SQL runs with only heartbeat-column reads authorized by SQLite',async()=>{
  const schemas=await Promise.all(['ops/feedback-preview/reviewed/diagnosis/0001.sql','ops/feedback-preview/reviewed/0001.sql'].map(p=>readFile(p,'utf8')));
  const code=`import sqlite3,json,sys
x=json.load(sys.stdin)
for schema,target in zip(x['schemas'],x['targets']):
 db=sqlite3.connect(':memory:');db.executescript(schema)
 allowed={'diagnostic_retention_health':{'last_cleanup','singleton'},'diagnosis_operations':{'value','expires_at','key'}}
 def auth(action,a,b,c,d):
  if action==sqlite3.SQLITE_SELECT:return sqlite3.SQLITE_OK
  if action==sqlite3.SQLITE_READ and a in allowed and b in allowed[a]:return sqlite3.SQLITE_OK
  return sqlite3.SQLITE_DENY
 db.set_authorizer(auth)
 assert db.execute(target['sql']).fetchall()==[]
`;
  const p=spawnSync('python3',['-c',code],{input:JSON.stringify({schemas,targets}),encoding:'utf8'});assert.equal(p.status,0,p.stderr);
});
