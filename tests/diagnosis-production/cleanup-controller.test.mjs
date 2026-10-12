import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { createPreparedAdapter, validateRecord } from '../../ops/feedback-preview/adapter.mjs';
import { sha256, TARGET } from '../../ops/feedback-preview/controller.mjs';
import { artifactClaimName } from '../../ops/feedback-preview/artifact-claim.mjs';
import { SETUP, runGate, runProtected, credentialTransport } from '../../ops/feedback-preview/live.mjs';
import { CLEANUP_OPERATION as operation, CLEANUP_MODE, CLEANUP_RECORD_OPERATION, CLEANUP_PLAN_HASH,
  CLEANUP_FEATURES as features, CLEANUP_ARTIFACTS as artifacts, RETENTION_SCOPE_HASH, CLEANUP_SETUP_RUN } from '../../ops/diagnosis-production/cleanup-profile.mjs';
import { fixtureRecord, mock, claimStore, now, account, workflow } from '../feedback-preview/fixtures.mjs';
function recordFixture() {
  const r = fixtureRecord();
  Object.assign(r, { mode: CLEANUP_MODE, operation: CLEANUP_RECORD_OPERATION, planHash: CLEANUP_PLAN_HASH,
    ref: SETUP.ref, reconciledPriorRuns: [], cleanupApproval: 'both-pinned-production-hourly-crons',
    retentionScopeHash: RETENTION_SCOPE_HASH, persistentBindingAndCron: true,
    cleanupApprovalEvidenceSha256: sha256('SYNTHETIC explicit production retention approval'),
    notificationStatus: 'parent-conversation-approved-not-connected' });
  delete r.reconciledNoWriteRuns; delete r.alert;
  r.costEvidence = { kind: 'owner-current-free-plan-confirmation', accountId: TARGET.accountId,
    operation: r.operation, planHash: r.planHash, workersPlan: 'workers-free', maximumChargeUSD: 0,
    quotaPolicy: 'provider-enforced-free-stop', usageHeadroom: 'not-measured', confirmedAt: now,
    confirmationEvidenceSha256: sha256('SYNTHETIC Free confirmation'), databaseLimit: 10,
    workerLimit: 100, cronLimit: 5, reserve: { databaseSlots: 0, workerSlots: 2, cronSlots: 2 } };
  return r;
}
function network(r, mutate = () => {}, failure = 0) {
  return mock(r, (c, v) => {
    if (c.path.endsWith(`/environments/${SETUP.environment}`)) {
      v.id = SETUP.environmentId; v.protection_rules[0].reviewers[0].reviewer.login = SETUP.reviewerLogin;
    }
    if (c.path.endsWith('/approvals')) v[0].environments[0].id = SETUP.environmentId;
    mutate(c, v);
  }, failure, { features, artifacts, databaseIds: features.map(f => f.databaseId),
    existingDatabases: features.map(f => ({ uuid: f.databaseId, name: f.database })) });
}
async function prepare(r = recordFixture(), mutate, failure, durableClaims = claimStore()) {
  const receipts = []; const n = network(r, mutate, failure), recordBytes = JSON.stringify(r);
  return { ...n, receipts, adapter: await createPreparedAdapter({ ...n, operation, recordBytes,
    trustedRecordHash: sha256(recordBytes), now: () => now, durableClaims, onReceipt: r => receipts.push(r) }) };
}
function context(r, job = 'provision') {
  const bytes = JSON.stringify(r);
  return { GITHUB_ACTIONS: 'true', GITHUB_REPOSITORY: TARGET.repository, GITHUB_EVENT_NAME: 'workflow_dispatch',
    GITHUB_REF: SETUP.ref, GITHUB_RUN_ATTEMPT: '1', GITHUB_RUN_ID: String(r.runId), GITHUB_SHA: r.commit,
    GITHUB_WORKFLOW_SHA: r.commit, GITHUB_WORKFLOW_REF: `${TARGET.repository}/.github/workflows/${workflow}@${SETUP.ref}`,
    RUNNER_ENVIRONMENT: 'github-hosted', GITHUB_JOB: job, PREVIEW_PROTECTED_ENVIRONMENT: SETUP.environment,
    PREVIEW_OUTSIDE_RECORD_PRESENT: 'false', PREVIEW_OUTSIDE_DIGEST_PRESENT: 'false', PREVIEW_OPERATION: operation,
    PREVIEW_APPROVAL_RECORD: bytes, PREVIEW_APPROVAL_SHA256: sha256(bytes) };
}
await test('cleanup installation uses existing fixed DBs, six Worker writes, private ingress and explicit persistent receipts', async () => {
  const { adapter, calls, receipts } = await prepare(); const result = await adapter.provision();
  assert.deepEqual(receipts.map(r => r.step), ['worker-created','version-deployed','cron-registered','worker-created','version-deployed','cron-registered']);
  assert.equal(result.installationPreflight.usageHeadroom, 'not-measured');
  assert.equal(result.mode, CLEANUP_MODE); assert.equal(result.intakeEnabled, false);
  assert.equal(result.actualHeartbeatVerified, false); assert.equal(result.alertDeliveryVerified, false);
  assert.deepEqual(result.journal.map(j => j.step), ['worker','version','cron','worker','version','cron']);
  assert.ok(result.journal.every(j => j.outcome === 'confirmed'));
  for (const [i, receipt] of result.receipts.entries()) {
    assert.equal(receipt.databaseId, features[i].databaseId); assert.equal(receipt.workerName, features[i].worker);
    assert.equal(receipt.cron, features[i].cron); assert.equal(receipt.retentionScopeHash, RETENTION_SCOPE_HASH);
    assert.equal(receipt.moduleHash, artifacts[features[i].module]);
    assert.equal(receipt.scheduledDeletionMayStartAfterCronRegistration, true);
  }
  assert.ok(calls.filter(c => c.method !== 'GET').every(c => c.path.includes('/workers/')));
  assert.ok(calls.every(c => !c.path.endsWith('/query') && c.method !== 'DELETE'));
  const before = calls.length; await assert.rejects(adapter.provision(), /ALREADY_STARTED/); assert.equal(calls.length, before);
});
await test('read-only preflight validates fixed DB metadata and lists schedules before any claim or mutation', async () => {
  const { adapter, calls } = await prepare(); const result = await adapter.preflight();
  assert.equal(result.cronCount, 0); assert.equal(result.capacityAvailable, true);
  assert.match(result.costProvenance, /headroom not measured/);
  assert.ok(calls.every(c => c.method === 'GET'));
  for (const f of features) assert.ok(calls.some(c => c.path === `${account}/d1/database/${f.databaseId}`));
});
await test('collision, cron exhaustion, DB mismatch, incomplete inventory and missing approval stop before mutations', async () => {
  const existingWorker = { id: '9'.repeat(32), name: 'existing-retention' };
  for (const mutate of [
    (c,v) => { if (c.method === 'GET' && c.path === account+'/workers/workers') {v.result.push({...existingWorker,name:features[0].worker});v.result_info.total_count++;} },
    (c,v) => { if (c.method === 'GET' && c.path === account+'/workers/workers') {v.result.push(existingWorker);v.result_info.total_count++;} if (c.path.endsWith('/schedules')) v.result.schedules=Array.from({length:4},()=>({cron:'0 * * * *'})); },
    (c,v) => { if (c.path.endsWith(features[0].databaseId)) v.result.name='wrong-db'; },
    (c,v) => { if (c.path === account+'/d1/database') v.result[0].uuid='72c728f5-1656-4e26-bc11-7c508ae155c3'; },
    (c,v) => { if (c.path === account+'/workers/workers') v.result_info.total_count=1; },
    (c,v) => { if (c.path.endsWith('/approvals')) v.splice(0); },
    (c,v) => { if (c.path.includes('/git/ref/')) v.object.sha='b'.repeat(40); },
  ]) {
    const { adapter,calls }=await prepare(recordFixture(),mutate);
    await assert.rejects(adapter.provision(),/BLOCKED/); assert.ok(calls.every(c=>c.method==='GET'));
  }
});
await test('each uncertain write poisons the attempt and immutable claim forbids same-run retry', async () => {
  for (let failure=1;failure<=6;failure++) {
    const claims=claimStore(); const {adapter,calls}=await prepare(recordFixture(),undefined,failure,claims);
    await assert.rejects(adapter.provision(),/WRITE_REQUIRES/);
    assert.equal(calls.filter(c=>c.method!=='GET').length,failure);
    const before=calls.length;await assert.rejects(adapter.provision(),/ALREADY_STARTED/);assert.equal(calls.length,before);
    const second=await prepare(recordFixture(),undefined,0,claims);
    await assert.rejects(second.adapter.provision(),/DURABLE_CLAIM_REQUIRES/);
    assert.ok(second.calls.every(c=>c.method==='GET'));
  }
});
await test('wrong version binding or module readback stops before cron', async () => {
  for (const mutate of [
    (c,v)=>{if(c.path.endsWith('/versions')&&c.method==='POST')v.result.bindings[0].database_id=features[1].databaseId;},
    (c,v)=>{if(c.path.includes('/versions/')&&c.method==='GET')v.result.modules[0].content_base64='d3Jvbmc=';},
  ]) {
    const {adapter,calls}=await prepare(recordFixture(),mutate);await assert.rejects(adapter.provision(),/BLOCKED/);
    assert.ok(!calls.some(c=>c.method==='PUT'));
  }
});
await test('only explicit cleanup scope and current Free confirmation authorize this mode', async () => {
  for (const mutate of [r=>{r.persistentBindingAndCron=false;},r=>{r.retentionScopeHash='0'.repeat(64);},
    r=>{r.costEvidence.confirmedAt=now-3600001;},r=>{r.costEvidence.workersPlan='workers-paid';},
    r=>{r.costEvidence.reserve.cronSlots=1;},r=>{r.costEvidence.usageHeadroom='measured';}]) {
    const r=recordFixture();mutate(r);await assert.rejects(prepare(r),/BLOCKED/);
  }
  const bytes=JSON.stringify(fixtureRecord());assert.throws(()=>validateRecord(bytes,sha256(bytes),now,operation),/SCOPE/);
  assert.notEqual(artifactClaimName(12345,operation),artifactClaimName(12345,'production-databases'));
});
await test('completed DB-only predecessor needs pinned reconciliation', async () => {
  const prior=(c,v)=>{if(c.path.endsWith(`/${workflow}/runs`)){v.workflow_runs.push({id:CLEANUP_SETUP_RUN.id,
    head_sha:CLEANUP_SETUP_RUN.headSha,workflow_id:88,path:`.github/workflows/${workflow}`,status:'completed',run_attempt:1});v.total_count++;}};
  await assert.rejects((await prepare(recordFixture(),prior)).adapter.provision(),/RECONCILIATION/);
  const r=recordFixture();r.reconciledPriorRuns=[{...CLEANUP_SETUP_RUN,classification:'independently-reviewed-production-databases-only',reviewEvidenceSha256:'c'.repeat(64)}];
  await (await prepare(r,prior)).adapter.provision();
});
await test('live protected path selects cleanup plan/claim while credential boundary rejects DB writes and foreign cron', async () => {
  const r=recordFixture(),n=network(r);const gate=await runGate({env:context(r,'gate'),checkoutSha:r.commit,transport:n.transport});
  assert.equal(gate.planHash,CLEANUP_PLAN_HASH);assert.ok(n.calls.every(c=>c.url.startsWith('https://api.github.com/')));
  let row;const client={async uploadArtifact(name,files){const text=await readFile(files[0],'utf8');row={id:777,name,text,size:Buffer.byteLength(text),digest:sha256(text)};return row;},async getArtifact(){return{artifact:row};},async downloadArtifact(id,o){assert.equal(id,777);await writeFile(join(o.path,'claim.json'),row.text);return{downloadPath:o.path,digestMismatch:false};}};
  const result=await runProtected({env:context(r),checkoutSha:r.commit,transport:n.transport,loadClient:async()=>client,now:()=>now});
  assert.equal(result.journal.length,6);assert.equal(row.name,artifactClaimName(r.runId,operation));
  let tokenReads=0;const t=credentialTransport({operation,githubToken:()=>'',cloudflareToken:()=>{tokenReads++;return'synthetic';},fetchImpl:async()=>new Response('{}')});
  for(const [method,path] of [['POST','/d1/database'],['POST',`/d1/database/${features[0].databaseId}/query`],['PUT','/workers/scripts/gemnao-diagnosis-cleanup-preview/schedules'],['DELETE',`/workers/workers/${'1'.repeat(32)}`]])
    await assert.rejects(t('https://api.cloudflare.com/client/v4'+account+path,{method}),/SCOPE/);
  assert.equal(tokenReads,0);
});
await test('pinned scheduled modules delete only expired rows and keep unrelated/fresh data; no HTTP cleanup', async () => {
  for (const f of features) {
    const bytes=await readFile(new URL('../../ops/feedback-preview/'+f.module,import.meta.url));assert.equal(sha256(bytes),artifacts[f.module]);
    const {default:worker}=await import(new URL('../../ops/feedback-preview/'+f.module,import.meta.url));
    const sql=new DatabaseSync(':memory:');const isSharing=f.key==='sharing';const stamp=Date.now();const unit=isSharing?stamp:Math.floor(stamp/1000);
    sql.exec(await readFile(new URL('../../ops/feedback-preview/reviewed/'+(isSharing?'diagnosis/0001.sql':'0001.sql'),import.meta.url),'utf8'));
    sql.exec('CREATE TABLE unrelated(value TEXT); INSERT INTO unrelated VALUES (\'keep\');');
    const table=isSharing?'diagnosis_shared':'diagnostic_reports';
    if(isSharing) {
      const insert=sql.prepare('INSERT INTO diagnosis_shared(id,owner_hash,recovery_hash,request_id,snapshot,rule_version,created_at,updated_at,expires_at) VALUES(?,?,?,?,?,?,?,?,?)');
      for(const [id,expiry] of [['expired',unit-1],['fresh',unit+86400000]])insert.run(id,'owner','recovery',id,'{}','v1',stamp-30*86400000,stamp,expiry);
    } else {
      const insert=sql.prepare('INSERT INTO diagnostic_reports VALUES(?,?,?,1,?,?)');
      for(const [id,expiry] of [['expired',unit-1],['fresh',unit+86400]])insert.run(id,'delete-hash','{}',unit-30*86400,expiry);
    }
    const db={prepare(query){let args=[];return{bind(...values){args=values;return this;},run(){sql.prepare(query).run(...args);return{success:true};}};},async batch(statements){sql.exec('BEGIN');try{const rows=statements.map(s=>s.run());sql.exec('COMMIT');return rows;}catch(error){sql.exec('ROLLBACK');throw error;}}};
    const http=worker.fetch();assert.equal(http.status,404);assert.equal(sql.prepare(`SELECT count(*) AS n FROM ${table}`).get().n,2);
    await worker.scheduled({}, {[f.binding]:db},{});
    assert.equal(sql.prepare(`SELECT count(*) AS n FROM ${table}`).get().n,1);
    assert.equal(sql.prepare('SELECT value FROM unrelated').get().value,'keep');
    const health=isSharing?sql.prepare("SELECT value FROM diagnosis_operations WHERE key='cleanup_success'").get():sql.prepare('SELECT last_cleanup FROM diagnostic_retention_health').get();assert.ok(health);
    sql.close();
  }
});
