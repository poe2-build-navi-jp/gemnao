import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {TARGET} from '../feedback-preview/controller.mjs';
import {runGate,runProtected,credentialTransport,SETUP} from '../feedback-preview/live.mjs';
import {createQaReadinessAdapter,createPreparedAdapter} from '../feedback-preview/adapter.mjs';
import {operation,mode,planHash,scopedTransport} from './reconcile-profile.mjs';
import {account,database} from './scope.mjs';
import {settingsPath,schemaSql,countQueries,categories} from './reconcile-scope.mjs';
const queries=[schemaSql,...Object.values(countQueries)];
const getPaths=[settingsPath];
import {fixtureRecord,mock,workflow} from '../../tests/feedback-preview/fixtures.mjs';
const root='https://api.cloudflare.com/client/v4', marker='SYNTHETIC_PRIVATE_VALUE';
function setup(mutate = () => {}, failedRequest = 0) {
  const r = { ...fixtureRecord(), ref: SETUP.ref, reviewers: [325773421] };
  const network = mock(r, (call, value) => {
    if (call.path.endsWith(`/environments/${SETUP.environment}`)) {
      value.id = SETUP.environmentId;
      value.protection_rules[0].reviewers[0].reviewer = {
        id: r.reviewers[0],
        login: SETUP.reviewerLogin,
      };
    }
    if (call.path.endsWith("/approvals")) {
      value[0].environments[0].id = SETUP.environmentId;
      value[0].user.id = r.reviewers[0];
    }
    mutate(call, value);
  });
  const calls = [];
  let cfCount = 0;
  const transport = async (url, options) => {
    calls.push({ url, options });
    if (!url.startsWith(root)) return network.transport(url, options);
    const path = url.slice(root.length);
    cfCount++;
    let result;
    if(path === settingsPath) result={bindings:[],private:marker};
    else {
      assert.equal(path, `/accounts/${account}/d1/database/${database}/query`);
      const {sql}=JSON.parse(options.body);assert.ok(queries.includes(sql));
      result=[{success:true,meta:{rows_written:0,changed_db:false},results:sql===schemaSql?categories.map(c=>({name:'private_diagnostic_'+c})):[{n:0}]}];
    }
    const value = { success: true, errors: [], result };
    mutate({ path, method: options.method }, value);
    const response = new Response(JSON.stringify(value), {
      status: cfCount === failedRequest ? 403 : 200,
      headers: { "content-type": "application/json" },
    });
    Object.defineProperty(response, "url", { value: url });
    return response;
  };
  const env = (job = "provision") => ({
    GITHUB_ACTIONS: "true",
    GITHUB_REPOSITORY: TARGET.repository,
    GITHUB_EVENT_NAME: "workflow_dispatch",
    GITHUB_REF: SETUP.ref,
    GITHUB_RUN_ATTEMPT: "1",
    GITHUB_RUN_ID: String(r.runId),
    GITHUB_SHA: r.commit,
    GITHUB_WORKFLOW_SHA: r.commit,
    GITHUB_WORKFLOW_REF: `${TARGET.repository}/.github/workflows/${workflow}@${SETUP.ref}`,
    RUNNER_ENVIRONMENT: "github-hosted",
    GITHUB_JOB: job,
    PREVIEW_PROTECTED_ENVIRONMENT: SETUP.environment,
    PREVIEW_OPERATION: operation,
    PREVIEW_OUTSIDE_RECORD_PRESENT: "false",
    PREVIEW_OUTSIDE_DIGEST_PRESENT: "false",
  });
  return {
    r,
    calls,
    transport,
    env,
    context: {
      repository: TARGET.repository,
      ref: r.ref,
      commit: r.commit,
      runId: r.runId,
      reviewerId: r.reviewers[0],
    },
  };
}

test('existing exact-run owner gate, no records/SDK, schema first then bounded existing-table counts and projected output',async()=>{
 const f=setup(),env=f.env();
 for(const k of ['PREVIEW_APPROVAL_RECORD','PREVIEW_APPROVAL_SHA256'])Object.defineProperty(env,k,{get:()=>assert.fail('old secret read')});
 const gate=await runGate({env:f.env('gate'),checkoutSha:f.r.commit,transport:f.transport});
 assert.equal(gate.planHash,planHash);assert.ok(f.calls.every(x=>!x.url.startsWith(root)));
 const r=await runProtected({env,checkoutSha:f.r.commit,transport:f.transport,loadClient:()=>assert.fail('SDK')});
 assert.equal(r.mode,mode);assert.equal(r.privateDbBindingMatches,false);assert.equal(r.allPrivateTablesEmpty,true);assert.equal(r.configuredWindowExpired,null);
 assert.equal(r.receiptActivationAuthorized,false);assert.equal(JSON.stringify(r).includes(marker),false);
 assert.deepEqual(f.calls.filter(x=>x.url.startsWith(root)).map(x=>x.options.method),['GET',...Array(7).fill('POST')]);
});
test("owner, exact run/head, branch and Environment checks still precede every Cloudflare call", async () => {
  for (const mutate of [
    (c, v) => {
      if (c.path.endsWith("/approvals")) v.splice(0);
    },
    (c, v) => {
      if (c.path.endsWith("/approvals")) v[0].user.id = 123;
    },
    (c, v) => {
      if (c.path.endsWith("/approvals")) v[0].state = "rejected";
    },
    (c, v) => {
      if (c.path.endsWith("/approvals")) v[0].environments[0].id = 123;
    },
    (c, v) => {
      if (c.path.includes("/git/ref/")) v.object.sha = "b".repeat(40);
    },
    (c, v) => {
      if (c.path.endsWith("/actions/runs/12345")) v.run_attempt = 2;
    },
    (c, v) => {
      if (c.path.endsWith(`/environments/${SETUP.environment}`)) v.can_admins_bypass = true;
    },
    (c, v) => {
      if (c.path.endsWith(`/environments/${SETUP.environment}`)) v.id = 123;
    },
    (c, v) => {
      if (c.path.endsWith("/deployment-branch-policies")) v.branch_policies[0].name = "*";
    },
  ]) {
    const f = setup(mutate);
    await assert.rejects(
      runProtected({ env: f.env(), checkoutSha: f.r.commit, transport: f.transport }),
      /BLOCKED/,
    );
    assert.ok(f.calls.every((c) => !c.url.startsWith(root)));
  }
});

test('403 at any request stops with no retry or remaining requests',async()=>{
 for(let i=1;i<=8;i++){const f=setup(()=>{},i);await assert.rejects(runProtected({env:f.env(),checkoutSha:f.r.commit,transport:f.transport}));assert.equal(f.calls.filter(x=>x.url.startsWith(root)).length,i);}
});
test('both transports forbid production, settings, arbitrary SQL and mutation',async()=>{
 for(const [url,options] of [[root+getPaths[0],{method:'DELETE'}],[root+getPaths[0]+'/query',{method:'POST',body:JSON.stringify({sql:'SELECT * FROM diagnostic_reports'})}],[root+getPaths[0]+'/versions',{method:'GET'}],[root+'/accounts/'+account+'/pages/projects/gemnao',{method:'GET'}]]){
  const outer=credentialTransport({operation,githubToken:()=>assert.fail('token'),cloudflareToken:()=>assert.fail('token'),fetchImpl:()=>assert.fail('network')});
  await assert.rejects(outer(url,options));assert.throws(()=>scopedTransport(()=>assert.fail('network'))(url,options));
 }
});
test('capability is single-use and cannot expose provisioning',async()=>{
 const f=setup(),a=await createQaReadinessAdapter({transport:f.transport,context:f.context});
 assert.deepEqual(Object.keys(a),['readiness']);await a.readiness();await assert.rejects(a.readiness());
 await assert.rejects(createPreparedAdapter({operation,transport:f.transport,context:f.context}));
});
test('workflow uses existing job and token, excludes records and installs for metadata',async()=>{
 const s=await readFile('.github/workflows/feedback-preview-control.yml','utf8');
 assert.match(s,/- private-qa-readiness/);assert.match(s,/PREVIEW_PROTECTED_ENVIRONMENT: gemnao-preview-data/);
 assert.equal(s.split("inputs.operation != 'private-qa-readiness'").length-1,4);
 assert.equal((s.match(/GEMNAO_PREVIEW_CLOUDFLARE_API_TOKEN:/g)||[]).length,1);
});
test('write-marked or unknown schema never proves reuse and provider fields never escape',async()=>{
 for(const mutate of [(c,v)=>{if(c.path.endsWith('/query'))v.result[0].meta.rows_written=1;},(c,v)=>{if(c.path.endsWith('/query'))v.result[0].meta.changed_db=true;}]){
  const f=setup(mutate);await assert.rejects(runProtected({env:f.env(),checkoutSha:f.r.commit,transport:f.transport}));
 }
 const f=setup((c,v)=>{if(c.path.endsWith('/query'))v.result[0].results=[];});
 const r=await runProtected({env:f.env(),checkoutSha:f.r.commit,transport:f.transport});assert.equal(r.schemaComplete,false);assert.equal(r.allPrivateTablesEmpty,null);assert.equal(f.calls.filter(c=>c.url.startsWith(root)).length,2);
});
test('401 and redirected responses stop before any subsequent Cloudflare request',async()=>{
 for(const status of [401,302]){
  const f=setup();let n=0;
  const transport=async(url,options)=>{if(!url.startsWith(root))return f.transport(url,options);n++;const r=new Response('{}',{status,headers:{'Content-Type':'application/json'}});Object.defineProperty(r,'url',{value:url});return r;};
  await assert.rejects(runProtected({env:f.env(),checkoutSha:f.r.commit,transport}));assert.equal(n,1);
 }
});

test('settings checkpoint survives DB 400 and only numeric provider error codes escape',async()=>{
 const f=setup(),receipts=[];
 const transport=async(url,options)=>{if(!url.startsWith(root)||options.method!=='POST')return f.transport(url,options);const response=new Response(JSON.stringify({errors:[{code:7500,message:marker,documentation_url:marker}],result:marker}),{status:400,headers:{'content-type':'application/json'}});Object.defineProperty(response,'url',{value:url});return response;};
 await assert.rejects(runProtected({env:f.env(),checkoutSha:f.r.commit,transport,onReceipt:r=>receipts.push(r)}));
 assert.equal(receipts[0].kind,'worker-settings');assert.deepEqual(receipts[1],{kind:'provider-error',httpStatus:400,providerCodes:[7500]});assert.ok(!JSON.stringify(receipts).includes(marker));
});
