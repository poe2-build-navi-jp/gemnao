import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { sql, workflow, confirmation, read, summarize } from '../../ops/feedback-stats/control.mjs';
import { target } from '../../ops/d1/control.mjs';
const sha = 'a'.repeat(40);
const env = { GITHUB_ACTIONS:'true', GITHUB_REPOSITORY:target.repository, GITHUB_REF:'refs/heads/gemunao', GITHUB_EVENT_NAME:'workflow_dispatch', GITHUB_RUN_ATTEMPT:'1', GITHUB_WORKFLOW:workflow, GITHUB_SHA:sha, FEEDBACK_STATS_SOURCE_SHA:sha, FEEDBACK_STATS_CONFIRMATION:confirmation, FEEDBACK_STATS_PROTECTED_ENVIRONMENT:target.environment, GH_TOKEN:'synthetic-github', CLOUDFLARE_API_TOKEN:'synthetic-cloudflare' };
const row = { observed_at:'2026-10-18T04:00:00.000Z', issue_rows:2, issue_contexts:1, issue_resolved:7, issue_struggling:3, method_rows:2, method_contexts:1, method_resolved:7, method_not_resolved:4, invalid_issue_rows:0, invalid_method_rows:0 };
const result = () => [{success:true,meta:{changed_db:false},results:[{...row}]}];
function fake({ deny=0, badBinding=false, reviewer=true, changed=false }={}) {
 const calls=[];
 const fetcher=async (url,init)=>{
  calls.push({url,init});
  if(calls.length===deny)return new Response('PRIVATE_SENTINEL',{status:403});
  assert.equal(init.redirect,'error'); assert.ok(init.signal);
  let data;
  if(url.includes('/deployment-branch-policies'))data={total_count:1,branch_policies:[{name:'gemunao',type:'branch'}]};
  else if(url.includes('/environments/'))data={name:target.environment,protection_rules:reviewer?[{type:'required_reviewers',reviewers:[{}]}]:[],deployment_branch_policy:{custom_branch_policies:true,protected_branches:false}};
  else if(url.endsWith('/query')){
    assert.equal(init.method,'POST'); assert.deepEqual(JSON.parse(init.body),{sql}); data={success:true,result:result()}; data.result[0].meta.changed_db=changed;
  } else if(url.includes('/pages/projects/'))data={success:true,result:{name:target.project,production_branch:'gemunao',source:{config:{owner:'poe2-build-navi-jp',repo_name:'gemnao'}},deployment_configs:{production:{d1_databases:{DB:{id:badBinding?'wrong':target.database}}},preview:{d1_databases:{}}},canonical_deployment:{id:'fixture-deployment',environment:'production',latest_stage:{status:'success'},deployment_trigger:{metadata:{branch:'gemunao',commit_hash:sha}}}}};
  else data={success:true,result:{uuid:target.database,name:target.databaseName}};
  return Response.json(data);
 };
 return {calls,fetcher};
}
await test('existing protection, identity then a single fixed SELECT; separate counters',async()=>{
 const f=fake();const report=await read(env,f.fetcher);assert.equal(f.calls.length,5);assert.equal(f.calls.filter(c=>c.init.method==='POST').length,1);assert.equal(report.issue_feedback.resolved,7);assert.equal(report.solution_method_feedback.resolved,7);assert.equal(report.combine_tables,false);assert.equal(report.complete,true);assert.ok(!JSON.stringify(report).includes('synthetic-cloudflare'));
});
await test('manual source SHA, branch, approval, rerun, credential and identity gates fail closed',async()=>{
 for(const patch of [{GITHUB_REF:'refs/heads/other'},{GITHUB_EVENT_NAME:'push'},{GITHUB_RUN_ATTEMPT:'2'},{FEEDBACK_STATS_SOURCE_SHA:'b'.repeat(40)},{FEEDBACK_STATS_CONFIRMATION:''},{FEEDBACK_STATS_PROTECTED_ENVIRONMENT:''},{CLOUDFLARE_API_TOKEN:''}]){
  const f=fake();await assert.rejects(read({...env,...patch},f.fetcher));assert.equal(f.calls.filter(c=>c.init.method==='POST').length,0);
 }
 for(const option of [{badBinding:true},{reviewer:false}]){const f=fake(option);await assert.rejects(read(env,f.fetcher));assert.equal(f.calls.filter(c=>c.init.method==='POST').length,0);}
});
await test('403 at each stage stops without retry and never exposes provider text',async()=>{
 for(let deny=1;deny<=5;deny++){const f=fake({deny});await assert.rejects(read(env,f.fetcher),e=>!String(e).includes('PRIVATE_SENTINEL'));assert.equal(f.calls.length,deny);}
});
await test('invalid counts, unexpected fields, partial or changed results cannot become zero/success',()=>{
 for(const mutate of [r=>{r[0].meta.changed_db=true;},r=>{delete r[0].meta.changed_db;},r=>{r[0].results[0].issue_resolved=-1;},r=>{r[0].results[0].invalid_method_rows=1;},r=>{r[0].results[0].private='secret';},r=>{r[0].results=[];},r=>{r.push(r[0]);}]){const r=result();mutate(r);assert.throws(()=>summarize(r,sha,sha));}
});
await test('fixed SELECT executes on synthetic SQLite, including empty state, without writes',()=>{
 const code=`import sqlite3,json,sys
sql=sys.stdin.read()
c=sqlite3.connect(':memory:')
c.row_factory=sqlite3.Row
c.executescript('CREATE TABLE issue_feedback(game_slug TEXT,topic TEXT,resolved_count INTEGER,struggling_count INTEGER); CREATE TABLE solution_method_feedback(context_slug TEXT,topic TEXT,method_id TEXT,response_count INTEGER,not_resolved_count INTEGER);')
empty=dict(c.execute(sql).fetchone())
c.executescript("INSERT INTO issue_feedback VALUES ('fixture','launch',7,3); INSERT INTO solution_method_feedback VALUES ('fixture','launch','step-1',7,4);")
c.execute('PRAGMA query_only=ON')
before=c.total_changes
full=dict(c.execute(sql).fetchone())
print(json.dumps({'empty':empty,'full':full,'unchanged':before==c.total_changes}))`;
 const out=JSON.parse(execFileSync('python3',['-c',code],{input:sql,encoding:'utf8'}));assert.equal(out.empty.issue_resolved,0);assert.equal(out.full.issue_resolved,7);assert.equal(out.full.method_resolved,7);assert.equal(out.unchanged,true);
 assert.ok(!/\b(INSERT|UPDATE|DELETE|DROP|ALTER|PRAGMA)\b/i.test(sql));
});
await test('workflow has no schedule, arbitrary SQL, new credentials or approval bypass',()=>{
 const yaml=readFileSync('.github/workflows/feedback-stats-read.yml','utf8');assert.ok(yaml.includes('workflow_dispatch:'));assert.ok(!/schedule:|pull_request:|push:|write-all/.test(yaml));assert.ok(yaml.includes('retention-days: 7'));assert.ok(yaml.includes('environment: ${{ needs.gate.outputs.environment }}'));assert.ok(yaml.includes('secrets.CLOUDFLARE_API_TOKEN'));
});
