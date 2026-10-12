import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createPreparedAdapter } from '../../ops/feedback-preview/adapter.mjs';
import { TARGET, sha256 } from '../../ops/feedback-preview/controller.mjs';
import { SETUP, runGate, runProtected, credentialTransport } from '../../ops/feedback-preview/live.mjs';
import { artifactClaimName } from '../../ops/feedback-preview/artifact-claim.mjs';
import { PUBLIC_HEALTH_OPERATION as operation, PUBLIC_HEALTH_MODE, PUBLIC_HEALTH_PLAN_HASH,
  PUBLIC_HEALTH_FEATURE, PUBLIC_HEALTH_ARTIFACTS, PUBLIC_HEALTH_BINDINGS, PUBLIC_HEALTH_URL, PUBLIC_HEALTH_APPROVAL } from '../../ops/diagnosis-production/public-health-profile.mjs';
import { PRODUCTION_HEALTH_TARGETS } from '../../ops/diagnosis-production/cleanup-health.mjs';
import { mock, claimStore, account, workflow } from '../feedback-preview/fixtures.mjs';

const now = Date.parse('2026-10-12T07:50:00Z');
const template = JSON.parse(await readFile(new URL('../../ops/diagnosis-production/public-health-record.template.json', import.meta.url), 'utf8'));
function recordFixture() { return { ...structuredClone(template), commit: 'a'.repeat(40), runId: 12345, reconciledPriorRuns: [] }; }
function network(record, mutate = () => {}, failureWrite = 0) {
  const calls = [], workers = [], versions = new Map(); let writes = 0;
  const github = mock(record, (c,v) => {
    if (c.path.endsWith(`/environments/${SETUP.environment}`)) {
      v.id = SETUP.environmentId; Object.assign(v.protection_rules[0].reviewers[0].reviewer,
        { id: 325773421, login: SETUP.reviewerLogin });
    }
    if (c.path.endsWith('/approvals')) { v[0].environments[0].id = SETUP.environmentId; v[0].user.id = 325773421; }
    mutate(c,v);
  });
  return { calls, transport: async (url, options) => {
    const u = new URL(url), path = u.pathname.replace(/^\/client\/v4/, '');
    const body = options.body ? JSON.parse(options.body) : undefined;
    const c = { url, path, method: options.method, query: u.search, body }; calls.push(c);
    if (u.hostname === 'api.github.com') return github.transport(url, options);
    assert.equal(u.hostname, 'api.cloudflare.com'); assert.equal(options.redirect, 'error');
    if (options.method !== 'GET' && ++writes === failureWrite) throw new Error('SYNTHETIC_SECRET_DO_NOT_LOG');
    let result;
    if (path === account+'/workers/workers' && c.method === 'GET') result = workers;
    else if (path === account+'/workers/subdomain') result = { subdomain: 'soykururu143' };
    else if (path.startsWith(account+'/d1/database/')) {
      const t = PRODUCTION_HEALTH_TARGETS.find(t => path.endsWith(t.databaseId)); assert.ok(t);
      assert.equal(c.method,'GET'); result = { uuid: t.databaseId, name: t.databaseName };
    } else if (path === account+'/workers/workers') {
      assert.equal(c.method,'POST'); result = { ...body, id:'1'.repeat(32), created_on:new Date(now).toISOString() }; workers.push(result);
    } else if (path.endsWith('/versions')) {
      assert.equal(c.method,'POST'); assert.equal(c.query,'?deploy=true');
      result = { ...body, id:'20000000-0000-4000-8000-000000000001' }; versions.set(result.id,result);
    } else if (path.includes('/versions/')) {
      assert.equal(c.method,'GET'); assert.equal(c.query,'?include=modules'); result = versions.get(path.split('/').at(-1));
    } else result = workers.find(w => path.endsWith(w.id) || path.endsWith(w.name));
    assert.ok(result,path);
    const value = { success:true, errors:[], result:structuredClone(result) };
    if (path === account+'/workers/workers' && c.method === 'GET') value.result_info = {page:1,per_page:100,total_count:workers.length};
    mutate(c,value);
    const response = new Response(JSON.stringify(value),{status:200,headers:{'content-type':'application/json'}});
    Object.defineProperty(response,'url',{value:url}); return response;
  } };
}
async function prepare(record = recordFixture(), mutate, failure, durableClaims = claimStore(), clock = () => now) {
  const n = network(record,mutate,failure), bytes = JSON.stringify(record), receipts = [];
  return { ...n, receipts, adapter:await createPreparedAdapter({ ...n, operation, recordBytes:bytes,
    trustedRecordHash:sha256(bytes), now:clock, durableClaims, onReceipt:r => receipts.push(r) }) };
}
function context(r,job='provision') {
  const bytes = JSON.stringify(r);
  return { GITHUB_ACTIONS:'true', GITHUB_REPOSITORY:TARGET.repository, GITHUB_EVENT_NAME:'workflow_dispatch',
    GITHUB_REF:SETUP.ref, GITHUB_RUN_ATTEMPT:'1', GITHUB_RUN_ID:String(r.runId), GITHUB_SHA:r.commit,
    GITHUB_WORKFLOW_SHA:r.commit, GITHUB_WORKFLOW_REF:`${TARGET.repository}/.github/workflows/${workflow}@${SETUP.ref}`,
    RUNNER_ENVIRONMENT:'github-hosted', GITHUB_JOB:job, PREVIEW_PROTECTED_ENVIRONMENT:SETUP.environment,
    PREVIEW_OUTSIDE_RECORD_PRESENT:'false', PREVIEW_OUTSIDE_DIGEST_PRESENT:'false', PREVIEW_OPERATION:operation,
    PREVIEW_APPROVAL_RECORD:bytes, PREVIEW_APPROVAL_SHA256:sha256(bytes) };
}
await test('public health creates only its fixed Worker and version with two DBs and a mandatory limiter',async()=>{
  const {adapter,calls,receipts}=await prepare(); const result=await adapter.provision();
  const writes=calls.filter(c=>c.method!=='GET'); assert.equal(writes.length,2);
  assert.ok(writes.every(c=>c.method==='POST'&&c.path.includes('/workers/workers')));
  assert.equal(writes[0].body.name,PUBLIC_HEALTH_FEATURE.worker); assert.equal(writes[0].body.subdomain.enabled,true);
  assert.deepEqual(writes[1].body.bindings,PUBLIC_HEALTH_BINDINGS);
  assert.equal(result.mode,PUBLIC_HEALTH_MODE); assert.equal(result.intakeEnabled,false);
  assert.equal(result.publicEndpointVerified,false); assert.equal(result.alertDeliveryVerified,false);
  assert.equal(result.receipts[0].publicUrl,PUBLIC_HEALTH_URL);
  assert.deepEqual(receipts.map(r=>r.step),['worker-created','version-deployed']);
  assert.ok(result.journal.every(j=>j.outcome==='confirmed'));
  assert.ok(calls.every(c=>!c.path.endsWith('/query')&&!c.path.endsWith('/schedules')));
  await assert.rejects(adapter.provision(),/ALREADY_STARTED/);
});
await test('owner review, protected branch, target identity, complete inventory and capacity fail before writes',async()=>{
  for(const mutate of [
    (c,v)=>{if(c.path.endsWith('/approvals'))v.splice(0);},
    (c,v)=>{if(c.path.includes('/git/ref/'))v.object.sha='b'.repeat(40);},
    (c,v)=>{if(c.path.endsWith(`/environments/${SETUP.environment}`))v.can_admins_bypass=true;},
    (c,v)=>{if(c.path===account+'/workers/subdomain')v.result.subdomain='wrong';},
    (c,v)=>{if(c.path.endsWith(PRODUCTION_HEALTH_TARGETS[0].databaseId))v.result.name='wrong';},
    (c,v)=>{if(c.path===account+'/workers/workers'){v.result=[{id:'9'.repeat(32),name:PUBLIC_HEALTH_FEATURE.worker}];v.result_info.total_count=1;}},
    (c,v)=>{if(c.path===account+'/workers/workers')v.result_info.total_count=1;},
    (c,v)=>{if(c.path===account+'/workers/workers'){v.result=Array.from({length:100},(_,i)=>({id:(i+1).toString(16).padStart(32,'0'),name:'existing-'+i}));v.result_info.total_count=100;}},
  ]) { const {adapter,calls}=await prepare(recordFixture(),mutate); await assert.rejects(adapter.provision(),/BLOCKED/); assert.ok(calls.every(c=>c.method==='GET')); }
});
await test('each uncertain write poisons the attempt and its durable claim prevents a retry',async()=>{
  for(let failure=1;failure<=2;failure++) {
    const claims=claimStore(),{adapter,calls}=await prepare(recordFixture(),undefined,failure,claims);
    await assert.rejects(adapter.provision(),/WRITE_REQUIRES/); assert.equal(calls.filter(c=>c.method!=='GET').length,failure);
    const before=calls.length; await assert.rejects(adapter.provision(),/ALREADY_STARTED/); assert.equal(calls.length,before);
    const retry=await prepare(recordFixture(),undefined,0,claims); await assert.rejects(retry.adapter.provision(),/DURABLE_CLAIM_REQUIRES/);
    assert.ok(retry.calls.every(c=>c.method==='GET'));
  }
});
await test('missing limiter, wrong DB, extra secret and altered module readback stop publication receipts',async()=>{
  for(const mutate of [
    (c,v)=>{if(c.path.endsWith('/versions'))v.result.bindings.pop();},
    (c,v)=>{if(c.path.endsWith('/versions'))v.result.bindings[0].database_id=PRODUCTION_HEALTH_TARGETS[1].databaseId;},
    (c,v)=>{if(c.path.endsWith('/versions'))v.result.bindings.push({type:'secret_text',name:'TOKEN'});},
    (c,v)=>{if(c.path.includes('/versions/'))v.result.modules[0].content_base64='d3Jvbmc=';},
  ]) { const {adapter,calls,receipts}=await prepare(recordFixture(),mutate); await assert.rejects(adapter.provision(),/BLOCKED/);
    assert.equal(calls.filter(c=>c.method!=='GET').length,2); assert.deepEqual(receipts.map(r=>r.step),['worker-created']); }
});
await test('actual publication approval expires, while historical Free evidence is never re-dated or overstated',async()=>{
  for(const mutate of [r=>{r.approvedAt=now;},r=>{r.publicationApprovalEvidenceSha256='0'.repeat(64);},
    r=>{r.costBasis.confirmedAt=now;},r=>{r.costBasis.currentPlanApiVerified=true;},r=>{r.costBasis.originalScope='public-health';},
    r=>{r.persistentBindings=false;},r=>{r.publicUrl='https://wrong.invalid';}]) {
    const r=recordFixture();mutate(r);await assert.rejects(prepare(r),/BLOCKED/);
  }
  await assert.rejects(prepare(recordFixture(),undefined,0,claimStore(),()=>PUBLIC_HEALTH_APPROVAL.approvedAt+3_600_001),/REVIEWED_RUN/);
  const {adapter}=await prepare(); assert.match((await adapter.preflight()).costProvenance,/historical-owner-declaration/);
  assert.notEqual(artifactClaimName(12345,operation),artifactClaimName(12345,'production-cleanup'));
});
await test('pinned runtime and real approval bytes match review evidence; prior run classifications retain their exact scope',async()=>{
  const source=await readFile(new URL('../../cloudflare/retention-health.mjs',import.meta.url));
  const reviewed=await readFile(new URL('../../ops/diagnosis-production/reviewed/public-health.mjs',import.meta.url));
  assert.deepEqual(source,reviewed);assert.equal(sha256(reviewed),PUBLIC_HEALTH_ARTIFACTS[PUBLIC_HEALTH_FEATURE.module]);
  const proof=await readFile(new URL('../../ops/diagnosis-production/public-health-approval.canonical.json',import.meta.url));
  assert.equal(sha256(proof),PUBLIC_HEALTH_APPROVAL.evidenceSha256);
  const r=recordFixture();r.reconciledPriorRuns=structuredClone(template.reconciledPriorRuns);
  await prepare(r);
  for(const classification of ['independently-reviewed-preview-only','independently-reviewed-production-databases-only','independently-reviewed-production-cleanup-only']){
    const changed=structuredClone(r),prior=changed.reconciledPriorRuns.find(p=>p.classification===classification);assert.ok(prior);
    if(classification==='independently-reviewed-preview-only')prior.planHash='0'.repeat(64);else prior.id=999;
    await assert.rejects(prepare(changed),/RECONCILED_RUN/);
  }
});
await test('live path uses the new plan and durable SDK claim; credential scope excludes D1 writes and all Cron changes',async()=>{
  const r=recordFixture(),n=network(r); const gate=await runGate({env:context(r,'gate'),checkoutSha:r.commit,transport:n.transport});
  assert.equal(gate.planHash,PUBLIC_HEALTH_PLAN_HASH); assert.ok(n.calls.every(c=>c.url.startsWith('https://api.github.com/')));
  let row;const client={async uploadArtifact(name,files){const text=await readFile(files[0],'utf8');row={id:777,name,text,size:Buffer.byteLength(text),digest:sha256(text)};return row;},async getArtifact(){return{artifact:row};},async downloadArtifact(id,o){assert.equal(id,777);await writeFile(join(o.path,'claim.json'),row.text);return{downloadPath:o.path,digestMismatch:false};}};
  const result=await runProtected({env:context(r),checkoutSha:r.commit,transport:n.transport,loadClient:async()=>client,now:()=>now});
  assert.equal(result.journal.length,2);assert.equal(row.name,artifactClaimName(r.runId,operation));
  let tokenReads=0;const t=credentialTransport({operation,githubToken:()=>'',cloudflareToken:()=>{tokenReads++;return'synthetic';},fetchImpl:async()=>new Response('{}')});
  for(const [method,path] of [['POST','/d1/database'],['POST',`/d1/database/${PRODUCTION_HEALTH_TARGETS[0].databaseId}/query`],['PUT','/workers/scripts/gemnao-retention-health/schedules'],['DELETE',`/workers/workers/${'1'.repeat(32)}`],['GET','/subscriptions']])
    await assert.rejects(t('https://api.cloudflare.com/client/v4'+account+path,{method}),/SCOPE/);
  await assert.rejects(t('https://wrong.invalid/health',{method:'GET'}),/SCOPE/);assert.equal(tokenReads,0);
});
