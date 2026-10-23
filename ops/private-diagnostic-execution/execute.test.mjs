import test from 'node:test';
import assert from 'node:assert/strict';
import {runFiniteProtected} from './execute.mjs';
import {credentialTransport,runGate} from '../feedback-preview/live.mjs';
import {operation,scriptPath} from './profile.mjs';
import {queryPath} from '../private-diagnostic-review/readiness-scope.mjs';
const sha='a'.repeat(40),branch='prepare/feedback-preview-controller-20261007';
const env={GITHUB_RUN_ID:'99',GITHUB_SHA:sha,GITHUB_REF:'refs/heads/'+branch};
function mock({approved=true,duplicate=false,moved=false}={}){
 const calls=[];
 return {calls,transport:async url=>{calls.push(url);assert.ok(url.startsWith('https://api.github.com/'));let data;
 if(url.endsWith('/actions/runs/99'))data={id:99,run_attempt:1,status:'in_progress',event:'workflow_dispatch',head_sha:sha,head_branch:branch,path:'.github/workflows/feedback-preview-control.yml',repository:{full_name:'poe2-build-navi-jp/gemnao'}};
 else if(url.includes('/git/ref/'))data={object:{sha:moved?'b'.repeat(40):sha}};
 else if(url.endsWith('/approvals'))data=[{state:approved?'approved':'rejected',user:{id:325773421},environments:[{id:23658815122,name:'gemnao-preview-data'}]}];
 else data={total_count:duplicate?2:1,workflow_runs:[{id:99,head_sha:sha,status:'in_progress'},...(duplicate?[{id:98,head_sha:sha,status:'completed'}]:[])]};
 const r=new Response(JSON.stringify(data));Object.defineProperty(r,'url',{value:url});return r;
 }};
}
test('wrong approval, duplicate run or moved head never reaches CF',async()=>{for(const changes of [{approved:false},{duplicate:true},{moved:true}]){const m=mock(changes);await assert.rejects(()=>runFiniteProtected({env,reviewerId:325773421,transport:m.transport}));assert.ok(m.calls.every(u=>u.includes('api.github.com')));}});
test('new transport rejects arbitrary SQL, schedules and deletion before credentials',async()=>{let reads=0;const t=credentialTransport({operation,githubToken:()=>{throw Error('unused')},cloudflareToken:()=>{reads++;return 'synthetic';},fetchImpl:()=>{throw Error('must not fetch')}});for(const [path,method,body]of [[queryPath,'POST',JSON.stringify({sql:'DELETE FROM diagnostic_reports'})],[scriptPath+'/schedules','PUT','{}'],[scriptPath,'DELETE',undefined]])await assert.rejects(()=>t('https://api.cloudflare.com/client/v4'+path,{method,body}));assert.equal(reads,0);});
test('gate refuses unprotected QA credential fallback before environment read',async()=>{let reads=0;const gateEnv={GITHUB_ACTIONS:'true',GITHUB_REPOSITORY:'poe2-build-navi-jp/gemnao',GITHUB_EVENT_NAME:'workflow_dispatch',GITHUB_REF:'refs/heads/'+branch,GITHUB_RUN_ATTEMPT:'1',GITHUB_RUN_ID:'99',GITHUB_SHA:sha,GITHUB_WORKFLOW_SHA:sha,GITHUB_WORKFLOW_REF:'poe2-build-navi-jp/gemnao/.github/workflows/feedback-preview-control.yml@refs/heads/'+branch,RUNNER_ENVIRONMENT:'github-hosted',GITHUB_JOB:'gate',PREVIEW_OPERATION:operation,PREVIEW_OUTSIDE_RECORD_PRESENT:'false',PREVIEW_OUTSIDE_DIGEST_PRESENT:'false',QA_OUTSIDE_ACCESS_PRESENT:'true'};await assert.rejects(()=>runGate({env:gateEnv,checkoutSha:sha,transport:()=>{reads++}}),/UNPROTECTED_QA_SECRET/);assert.equal(reads,0);});
