import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { TARGET, sha256 } from '../../ops/feedback-preview/controller.mjs';
import { runGate, runProtected, credentialTransport, SETUP } from '../../ops/feedback-preview/live.mjs';
import { createPagesDeploymentLogAdapter, createPreparedAdapter, validateRecord } from '../../ops/feedback-preview/adapter.mjs';
import { createDiagnostics, classifyReadFailure } from '../../ops/feedback-preview/diagnostics.mjs';
import { PAGES_LOG_OPERATION as operation, PAGES_LOG_MODE as mode, PAGES_LOG_PLAN_HASH as planHash,
  PAGES_LOG_PATH as logPath, PAGES_PROJECT_PATH as projectPath, DEPLOYMENT,
  pagesLogTransport, projectLogs, projectPagesState } from '../../ops/diagnosis-production/pages-deployment-log.mjs';
import { fixtureRecord, mock, workflow } from '../feedback-preview/fixtures.mjs';
const root = 'https://api.cloudflare.com/client/v4';
const marker = 'synthetic-private';
const project = () => ({ name: 'gemnao', production_branch: 'gemunao',
  source: { config: { owner: 'poe2-build-navi-jp', repo_name: 'gemnao' } },
  deployment_configs: { production: { env_vars: { PRIVATE: { type: 'secret_text', value: marker },
    DIAGNOSIS_ENABLED: { type: 'plain_text', value: 'true' } } } },
  canonical_deployment: { id: 'e86e4d69-f66d-4dd7-9dd6-ee817c8e906d',
    deployment_trigger: { metadata: { branch: 'gemunao', commit_hash: 'bce9beb7602ebf0e34d711a70ce793c776d4d0f3' } },
    environment: 'production', latest_stage: { status: 'success' },
    env_vars: { DIAGNOSIS_ENABLED: { type: 'plain_text', value: 'false' } } } });
const logs = () => ({ data: [{ line: 'Error: build failed', ts: '2026-10-12T13:07:50Z' },
  { line: 'Error authorization ' + marker }], total: 2, includes_container_logs: true });
function setup(mutate = () => {}, failedRequest = 0) {
  const r = { ...fixtureRecord(), ref: SETUP.ref, reviewers: [325773421] }, calls = [];
  const network = mock(r, (call, value) => {
    if (call.path.endsWith(`/environments/${SETUP.environment}`)) {
      value.id = SETUP.environmentId;
      value.protection_rules[0].reviewers[0].reviewer = { id: r.reviewers[0], login: SETUP.reviewerLogin };
    }
    if (call.path.endsWith('/approvals')) {
      value[0].environments[0].id = SETUP.environmentId; value[0].user.id = r.reviewers[0];
    }
    mutate(call, value);
  });
  let count = 0;
  const transport = async (url, options) => {
    calls.push({ url, options });
    if (!url.startsWith(root)) return network.transport(url, options);
    const path = url.slice(root.length); count++;
    assert.equal(options.method, 'GET'); assert.equal(options.body, undefined);
    assert.ok([logPath, projectPath].includes(path));
    const body = { success: true, errors: [], result: path === logPath ? logs() : project() };
    mutate({ path, method: options.method }, body);
    const response = new Response(JSON.stringify(body), { status: count === failedRequest ? 403 : 200,
      headers: { 'content-type': 'application/json' } });
    Object.defineProperty(response, 'url', { value: url }); return response;
  };
  const env = (job = 'provision') => ({ GITHUB_ACTIONS: 'true', GITHUB_REPOSITORY: TARGET.repository,
    GITHUB_EVENT_NAME: 'workflow_dispatch', GITHUB_REF: SETUP.ref, GITHUB_RUN_ATTEMPT: '1',
    GITHUB_RUN_ID: String(r.runId), GITHUB_SHA: r.commit, GITHUB_WORKFLOW_SHA: r.commit,
    GITHUB_WORKFLOW_REF: `${TARGET.repository}/.github/workflows/${workflow}@${SETUP.ref}`,
    RUNNER_ENVIRONMENT: 'github-hosted', GITHUB_JOB: job, PREVIEW_PROTECTED_ENVIRONMENT: SETUP.environment,
    PREVIEW_OPERATION: operation, PREVIEW_OUTSIDE_RECORD_PRESENT: 'false', PREVIEW_OUTSIDE_DIGEST_PRESENT: 'false' });
  return { r, calls, transport, env, context: { repository: TARGET.repository, ref: r.ref,
    commit: r.commit, runId: r.runId, reviewerId: r.reviewers[0] } };
}
test('existing owner gate authorizes one fixed log GET and one Pages GET without records, SDK, DB or writes', async () => {
  const f = setup(), env = f.env(), receipts = [];
  for (const name of ['PREVIEW_APPROVAL_RECORD', 'PREVIEW_APPROVAL_SHA256'])
    Object.defineProperty(env, name, { get: () => assert.fail('record secret was read') });
  const gate = await runGate({ env: f.env('gate'), checkoutSha: f.r.commit, transport: f.transport });
  assert.equal(gate.planHash, planHash);
  assert.ok(f.calls.every(c => !c.url.startsWith(root)));
  const result = await runProtected({ env, checkoutSha: f.r.commit, transport: f.transport,
    loadClient: () => assert.fail('SDK was loaded'), onReceipt: r => receipts.push(r) });
  assert.equal(result.mode, mode); assert.equal(result.readOnly, true);
  assert.equal(result.databaseQueries, 0); assert.equal(result.cloudflareWrites, 0);
  assert.equal(result.liveIntakeVerified, false);
  assert.equal(result.logs.deployment, DEPLOYMENT);
  assert.equal(result.logs.errors.length, 1);
  assert.equal(JSON.stringify([result, receipts]).includes(marker), false);
  assert.equal(receipts.length, 2);
  assert.equal(result.completed, true);
  assert.deepEqual(f.calls.filter(c => c.url.startsWith(root)).map(c => c.url), [root + logPath, root + projectPath]);
  assert.equal(result.pages.canonicalDeployment.flags.DIAGNOSIS_ENABLED, 'false');
  assert.equal(result.pages.projectConfigurationFlags.DIAGNOSIS_ENABLED, 'true');
});
test('owner approval, exact run/head, branch and existing Environment checks precede Cloudflare', async () => {
  for (const mutate of [
    (c,v) => { if(c.path.endsWith('/approvals')) v.splice(0); },
    (c,v) => { if(c.path.endsWith('/approvals')) v[0].user.id = 123; },
    (c,v) => { if(c.path.endsWith('/approvals')) v[0].state = 'rejected'; },
    (c,v) => { if(c.path.endsWith('/approvals')) v[0].environments[0].id = 123; },
    (c,v) => { if(c.path.includes('/git/ref/')) v.object.sha = 'b'.repeat(40); },
    (c,v) => { if(c.path.endsWith('/actions/runs/12345')) v.run_attempt = 2; },
    (c,v) => { if(c.path.endsWith('/actions/runs/12345')) v.head_sha = 'b'.repeat(40); },
    (c,v) => { if(c.path.endsWith(`/environments/${SETUP.environment}`)) v.can_admins_bypass = true; },
    (c,v) => { if(c.path.endsWith(`/environments/${SETUP.environment}`)) v.id = 123; },
    (c,v) => { if(c.path.endsWith('/deployment-branch-policies')) v.branch_policies[0].name = '*'; },
  ]) {
    const f = setup(mutate);
    await assert.rejects(runProtected({ env: f.env(), checkoutSha: f.r.commit, transport: f.transport }), /BLOCKED/);
    assert.ok(f.calls.every(c => !c.url.startsWith(root)));
  }
});
for(let n=1;n<=2;n++) test(`403 at GET ${n} is recorded independently with no retry`, async () => {
  const f = setup(() => {}, n), d = createDiagnostics(), receipts=[];
  const result = await runProtected({ env: f.env(), checkoutSha: f.r.commit, transport: d.transport(f.transport),
    onStage: d.stage, onEnvelope: d.envelope, onReceipt: r => receipts.push(r) });
  const key = n===1 ? 'logs' : 'pages', other = n===1 ? 'pages' : 'logs';
  assert.equal(result.completed,false); assert.equal(result[key],null); assert.ok(result[other]);
  assert.equal(result.failures[key].request.status,403);
  assert.equal(result.failures[key].request.classification,'http-access-denied');
  assert.equal(result.failures[key].request.httpResponseReceived,true);
  assert.equal(result.failures[key].endpoint,n===1 ? 'pages-deployment-log' : 'pages-project');
  assert.deepEqual(f.calls.filter(c => c.url.startsWith(root)).map(c=>c.url),[root+logPath,root+projectPath]);
  assert.equal(receipts.length,2);
});
test('both transport boundaries reject mutations, SQL, other deployments, parameters and repeat reads', async () => {
  let count=0;
  const inner = () => { count++; return {}; };
  const transport = pagesLogTransport(inner);
  const credential = credentialTransport({ operation, githubToken: () => assert.fail(),
    cloudflareToken: () => 'SYNTHETIC', fetchImpl: inner });
  const bad = [
    [root+logPath, {method:'POST'}], [root+projectPath, {method:'PUT',body:'{}'}],
    [root+logPath, {method:'GET',body:'{}'}], [root+logPath+'?page=2',{method:'GET'}],
    [root+logPath.replace(DEPLOYMENT,'e86e4d69-f66d-4dd7-9dd6-ee817c8e906d'),{method:'GET'}],
    [root+`/accounts/${TARGET.accountId}/d1/database/385a194f-5119-4bbe-9afe-2e6ce4ceb341/query`, {method:'POST',body:'{}'}],
    [root+projectPath+'/deployments',{method:'GET'}],
  ];
  for(const [url,options] of bad) {
    assert.throws(() => transport(url,options), /TRANSPORT_SCOPE/);
    await assert.rejects(credential(url,options), /TRANSPORT_SCOPE|TRANSPORT_METHOD/);
  }
  assert.equal(count,0);
  transport(root+logPath,{method:'GET'});
  assert.throws(() => transport(root+logPath,{method:'GET'}),/REQUEST_BOUND/);
  transport(root+projectPath,{method:'GET'});
  assert.throws(() => transport(root+projectPath,{method:'GET'}),/REQUEST_BOUND/);
  assert.equal(count,2);
  await credential(root+logPath,{method:'GET'});
  assert.equal(count,3);
});
test('read-only capability cannot be reused or turned into write authorization', async () => {
  const f=setup(), adapter=await createPagesDeploymentLogAdapter({transport:f.transport,context:f.context});
  assert.deepEqual(Object.keys(adapter),['deploymentLog']);
  await adapter.deploymentLog();const count=f.calls.length;
  await assert.rejects(adapter.deploymentLog(),/ATTEMPT_ALREADY_STARTED/);
  assert.equal(f.calls.length,count);
  await assert.rejects(createPreparedAdapter({operation}),/HEALTH_MODE/);
  const bytes=JSON.stringify(f.context);
  assert.throws(()=>validateRecord(bytes,sha256(bytes),Date.now(),operation),/HEALTH_MODE/);
});
test('log projection bounds and sanitizes untrusted output and reports incomplete logs', () => {
  const input={data:[{line:'Error: '+marker},{line:'Fatal KEY_VALUE=abc https://example.test/private'},
    {line:'Error token=private'},{line:'ok: build completed'}, {line:'\u001b[31mFailed: '+ 'a'.repeat(40)}],total:20};
  const result=projectLogs(input,[marker]);const text=JSON.stringify(result);
  assert.equal(text.includes(marker),false);assert.equal(text.includes('example.test'),false);
  assert.equal(text.includes('a'.repeat(40)),false);assert.equal(result.allProviderLinesReceived,false);
  assert.equal(result.omittedSensitive,1);assert.equal(result.rawLogsStored,false);
  assert.equal(projectLogs({data:Array.from({length:120},()=>({line:'Error: '+'.'.repeat(1500)})),total:120}).errors.length,100);
  assert.equal(projectLogs({data:[{line:'Error: '+'.'.repeat(1500)}],total:1}).errors[0].line.length,1000);
  assert.throws(()=>projectLogs({data:[],total:-1}),/PAGES_LOG_SHAPE_INVALID/);
});
test('Pages projection does not inspect secret values or mistake desired flags for deployed flags', () => {
  const p=project();
  const hidden={type:'secret_text'};Object.defineProperty(hidden,'value',{get:()=>assert.fail('secret read')});
  p.deployment_configs.production.env_vars.DIAGNOSIS_STORAGE_ENABLED=hidden;
  p.canonical_deployment.env_vars.DIAGNOSIS_WRITES_ENABLED=hidden;
  const result=projectPagesState(p);
  assert.equal(result.canonicalDeployment.flags.DIAGNOSIS_WRITES_ENABLED,'unknown');
  assert.equal(result.projectConfigurationFlags.DIAGNOSIS_STORAGE_ENABLED,'unknown');
  assert.equal(result.configurationIsNotRuntimeEvidence,true);assert.equal(result.liveIntakeVerified,false);
  delete p.canonical_deployment;
  assert.equal(projectPagesState(p).canonicalDeployment.commit,null);
  p.name='other';assert.throws(()=>projectPagesState(p),/PAGES_PROJECT_OR_SOURCE_MISMATCH/);
});
test('workflow uses existing Environment/secret, with no SDK, record or schedule for this mode',async()=>{
  const f=await readFile('.github/workflows/feedback-preview-control.yml','utf8');
  assert.match(f,/- pages-deployment-log/);
  assert.match(f,/PREVIEW_PROTECTED_ENVIRONMENT: gemnao-preview-data/);
  assert.match(f,/GEMNAO_PREVIEW_CLOUDFLARE_API_TOKEN: \$\{\{ secrets.GEMNAO_PREVIEW_CLOUDFLARE_API_TOKEN \}\}/);
  assert.equal((f.match(/inputs.operation != 'pages-deployment-log'/g)||[]).length,4);
  assert.doesNotMatch(f,/\n  (?:push|schedule|pull_request):/);
});

test('log request may take 15 seconds and still succeeds; response wait is 30 seconds', async t => {
  t.mock.timers.enable({apis:['setTimeout']});
  const f=setup();
  const transport=async (url,options)=>{
    if(url===root+logPath) {
      t.mock.timers.tick(15_000);
      assert.equal(options.signal.aborted,false);
    }
    return f.transport(url,options);
  };
  const result=await runProtected({env:f.env(),checkoutSha:f.r.commit,transport});
  assert.equal(result.completed,true);
  assert.equal(f.calls.filter(c=>c.url===root+logPath).length,1);
});
test('exact 30 second pre-response deadline is classified and canonical read still runs once',async t=>{
  t.mock.timers.enable({apis:['setTimeout']});
  const f=setup(),calls=[];
  const transport=async(url,options)=>{
    calls.push(url);
    if(url!==root+logPath) return f.transport(url,options);
    const pending=new Promise((resolve,reject)=>options.signal.addEventListener('abort',()=>reject(new Error(marker))));
    t.mock.timers.tick(10_000);assert.equal(options.signal.aborted,false);
    t.mock.timers.tick(19_999);assert.equal(options.signal.aborted,false);
    t.mock.timers.tick(1);assert.equal(options.signal.aborted,true);
    return pending;
  };
  const result=await runProtected({env:f.env(),checkoutSha:f.r.commit,transport});
  assert.equal(result.completed,false);assert.ok(result.pages);assert.equal(result.logs,null);
  assert.deepEqual(result.failures.logs.request,{classification:'deadline-exceeded',status:null,
    httpResponseReceived:false,deadlineExceeded:true,phase:'awaiting-response',transportCode:null,
    timeoutMs:30_000,elapsedMs:result.failures.logs.request.elapsedMs});
  assert.equal(JSON.stringify(result).includes(marker),false);
  assert.deepEqual(calls.filter(u=>u.startsWith(root)),[root+logPath,root+projectPath]);
});
test('connect timeout without HTTP response is not reported as an access refusal',async()=>{
  const f=setup(),calls=[];
  const transport=async(url,options)=>{
    calls.push(url);
    if(url===root+logPath) throw new TypeError(marker,{cause:Object.assign(new Error(marker),{code:'UND_ERR_CONNECT_TIMEOUT'})});
    return f.transport(url,options);
  };
  const result=await runProtected({env:f.env(),checkoutSha:f.r.commit,transport});
  assert.equal(result.completed,false);assert.ok(result.pages);
  assert.equal(result.failures.logs.request.status,null);
  assert.equal(result.failures.logs.request.classification,'transport-error');
  assert.equal(result.failures.logs.request.transportCode,'UND_ERR_CONNECT_TIMEOUT');
  assert.equal(result.failures.logs.request.deadlineExceeded,false);
  assert.equal(JSON.stringify(result).includes(marker),false);
  assert.deepEqual(calls.filter(u=>u.startsWith(root)),[root+logPath,root+projectPath]);
});
test('body deadline retains observed HTTP 200 and still returns canonical metadata',async t=>{
  t.mock.timers.enable({apis:['setTimeout']});
  const f=setup();
  const transport=async(url,options)=>{
    if(url!==root+logPath) return f.transport(url,options);
    let ticked=false;
    const body=new ReadableStream({pull(){if(!ticked){ticked=true;queueMicrotask(()=>t.mock.timers.tick(30_000));}}});
    const response=new Response(body,{status:200,headers:{'content-type':'application/json'}});
    Object.defineProperty(response,'url',{value:url});return response;
  };
  const result=await runProtected({env:f.env(),checkoutSha:f.r.commit,transport});
  assert.equal(result.completed,false);assert.ok(result.pages);
  assert.equal(result.failures.logs.request.classification,'deadline-exceeded');
  assert.equal(result.failures.logs.request.status,200);
  assert.equal(result.failures.logs.request.httpResponseReceived,true);
  assert.equal(result.failures.logs.request.phase,'reading-body');
});
test('HTTP and malformed response classifications expose no arbitrary error strings',async()=>{
  const observation={deadlineExpired:false,timeoutMs:30_000,elapsedMs:5,phase:'response-validation'};
  for(const status of [401,403,429,500]) {
    const result=classifyReadFailure(new Error(marker),{...observation,status});
    assert.equal(result.classification,[401,403].includes(status)?'http-access-denied':'http-error');
    assert.equal(result.httpResponseReceived,true);assert.equal(JSON.stringify(result).includes(marker),false);
  }
  assert.equal(classifyReadFailure(Object.assign(new Error(marker),{code:marker}),{...observation,status:null}).transportCode,null);
  const f=setup((c,v)=>{if(c.path===logPath)v.result={data:'malformed'};});
  const result=await runProtected({env:f.env(),checkoutSha:f.r.commit,transport:f.transport});
  assert.equal(result.completed,false);assert.ok(result.pages);
  assert.equal(result.failures.logs.classification,'projection-invalid');
  assert.equal(result.failures.logs.code,'PAGES_LOG_SHAPE_INVALID');
});
test('late completion of an aborted request cannot overwrite the current endpoint status',async()=>{
  const d=createDiagnostics();let resolveLog;
  const transport=d.transport(async url=>url===root+logPath?new Promise(resolve=>{resolveLog=resolve;}):{status:200});
  const pending=transport(root+logPath,{method:'GET'});
  await transport(root+projectPath,{method:'GET'});
  resolveLog({status:403});await pending;
  const result=d.failure(new Error('BLOCKED:REQUEST_UNCERTAIN_OR_INVALID'));
  assert.equal(result.request.endpoint,'pages-project');assert.equal(result.request.status,200);
});
