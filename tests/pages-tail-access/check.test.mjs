import test from 'node:test';
import assert from 'node:assert/strict';
import { probe, WORKFLOW, DEPLOYMENT, COMMIT } from '../../ops/pages-tail-access/check.mjs';
const env = { GITHUB_ACTIONS:'true', GITHUB_REPOSITORY:'poe2-build-navi-jp/gemnao', GITHUB_REF:'refs/heads/gemunao', GITHUB_EVENT_NAME:'workflow_dispatch', GITHUB_WORKFLOW:WORKFLOW, GITHUB_RUN_ATTEMPT:'1', GITHUB_RUN_ID:'123', GITHUB_SHA:'a'.repeat(40), GH_TOKEN:'synthetic-gh', CLOUDFLARE_API_TOKEN:'synthetic-secret', TAIL_PROTECTED_ENVIRONMENT:'gemnao-d1-production' };
const session = 'b'.repeat(32);
function mock({ status=200, failDelete=false, timeout=false, changed=false }={}) {
  const calls=[];
  const fetcher=async(url, options)=>{
    calls.push({url,method:options.method});
    assert.equal(options.redirect,'error');
    let data;
    if(url.includes('/deployment-branch-policies')) data={total_count:1,branch_policies:[{name:'gemunao',type:'branch'}]};
    else if(url.includes('api.github.com')) data={name:'gemnao-d1-production', protection_rules:[{type:'required_reviewers',reviewers:[{}]}],deployment_branch_policy:{custom_branch_policies:true,protected_branches:false}};
    else {
      assert.ok(url.startsWith('https://api.cloudflare.com/client/v4/accounts/6a09a32cba1288cccce5912015086a35/pages/projects/gemnao'));
      assert.equal(options.headers.Authorization,'Bearer synthetic-secret');
      if(options.method==='GET') data={name:'gemnao',production_branch:'gemunao',source:{config:{owner:'poe2-build-navi-jp',repo_name:'gemnao'}},canonical_deployment:{id:changed?'changed':DEPLOYMENT,environment:'production',deployment_trigger:{metadata:{commit_hash:COMMIT}}}};
      if(options.method==='POST') {
        assert.equal(options.body,'{}');
        if(timeout) throw Error('synthetic-secret cookie IP raw error');
        if(status!==200) return new Response('synthetic-secret',{status});
        data={id:session,url:'wss://tail.developers.workers.dev/PRIVATE-CAPABILITY'};
      }
      if(options.method==='DELETE') {
        assert.ok(url.endsWith('/tails/'+session));
        if(failDelete) throw Error('PRIVATE-CAPABILITY');
        data=null;
      }
      data={success:true,errors:[],result:data};
    }
    return Response.json(data);
  };
  return {fetcher,calls};
}
test('fixed GET/create/delete, no returned capability leakage',async()=>{
  const m=mock(); const r=await probe(env,m.fetcher);
  assert.equal(r.status,'session-access-confirmed');
  assert.deepEqual(m.calls.map(x=>x.method),['GET','GET','GET','POST','DELETE']);
  assert.equal(r.websocketAttempted,false);
  assert.doesNotMatch(JSON.stringify(r),/synthetic|PRIVATE|bbbb/);
});
for(const status of [401,403,429]) test(`HTTP ${status} stops without retry`,async()=>{
  const m=mock({status}); const r=await probe(env,m.fetcher);
  assert.equal(r.failure,`POST_HTTP_${status}`); assert.equal(m.calls.length,4);
});
test('uncertain creation is not retried',async()=>{
  const m=mock({timeout:true}); const r=await probe(env,m.fetcher);
  assert.equal(r.failure,'CREATE_OUTCOME_UNKNOWN_NO_RETRY'); assert.equal(m.calls.length,4);
});
test('delete failure is explicitly unconfirmed',async()=>{
  const m=mock({failDelete:true}); const r=await probe(env,m.fetcher);
  assert.equal(r.cleanup,'DELETE_UNCONFIRMED_NO_RETRY'); assert.equal(r.sessionDeleted,false);
});
test('changed production prevents session creation',async()=>{
  const m=mock({changed:true}); const r=await probe(env,m.fetcher);
  assert.equal(r.failure,'PROJECT_OR_PRODUCTION_CHANGED'); assert.equal(m.calls.length,3);
});
test('wrong workflow, branch, attempt, environment blocked before CF',async()=>{
  for(const override of [{GITHUB_WORKFLOW:'other'},{GITHUB_REF:'refs/heads/other'},{GITHUB_RUN_ATTEMPT:'2'},{TAIL_PROTECTED_ENVIRONMENT:'other'}]) {
    const m=mock(); await assert.rejects(probe({...env,...override},m.fetcher)); assert.equal(m.calls.length,0);
  }
});
