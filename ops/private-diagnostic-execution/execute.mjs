import {execute,allowed,operation,planHash} from './profile.mjs';
import {TARGET} from '../feedback-preview/controller.mjs';
const check=(v,c)=>{if(!v)throw Error('BLOCKED:'+c);};
export async function runFiniteProtected({env,transport,reviewerId,now=Date.now,onStage=()=>{},invokeFetch=fetch}){
 let calls=0;
 async function readJson(url,options,missing=false){
  const r=await transport(url,{...options,redirect:'error',signal:AbortSignal.timeout(30000)});
  check(!r.redirected&&r.url===url,'RESPONSE_IDENTITY');
  if(missing&&r.status===404)return null;
  check(r.status>=200&&r.status<300,'PROVIDER_STOP_NO_RETRY');
  const reader=r.body.getReader();let n=0;const chunks=[];
  while(true){const x=await reader.read();if(x.done)break;n+=x.value.length;check(n<=1048576,'RESPONSE_SIZE');chunks.push(Buffer.from(x.value));}
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
 }
 const gh=path=>readJson('https://api.github.com/repos/'+TARGET.repository+path,{method:'GET'});
 const run=await gh('/actions/runs/'+env.GITHUB_RUN_ID);
 check(run.id===Number(env.GITHUB_RUN_ID)&&run.run_attempt===1&&run.status==='in_progress'&&run.event==='workflow_dispatch'&&run.head_sha===env.GITHUB_SHA&&'refs/heads/'+run.head_branch===env.GITHUB_REF&&run.path==='.github/workflows/feedback-preview-control.yml'&&run.repository?.full_name===TARGET.repository,'EXACT_RUN');
 check((await gh('/git/ref/heads/'+run.head_branch)).object?.sha===env.GITHUB_SHA,'BRANCH_MOVED');
 const history=await gh('/actions/workflows/feedback-preview-control.yml/runs?per_page=100&page=1');
 check(history.total_count===history.workflow_runs?.length&&history.total_count<=100&&history.workflow_runs.filter(r=>r.head_sha===env.GITHUB_SHA).length===1&&history.workflow_runs.every(r=>r.id===run.id||r.status==='completed'),'RUN_RECONCILIATION');
 const approvals=await gh('/actions/runs/'+run.id+'/approvals');
 const matching=approvals.filter(r=>r.environments?.some(e=>e.id===23658815122&&e.name==='gemnao-preview-data'));
 check(matching.length===1&&matching[0].state==='approved'&&matching[0].user?.id===reviewerId&&reviewerId===325773421,'OWNER_APPROVAL');
 const api=async(path,method='GET',body,missing=false)=>{
  check(++calls<=20&&allowed(path,method,body),'FINITE_PROVIDER_BOUND');
  const data=await readJson('https://api.cloudflare.com/client/v4'+path,{method,...(body===undefined?{}:{body}),headers:typeof body==='string'?{'Content-Type':'application/json'}:{}},missing);
  if(data===null&&missing)return null;
  check(data?.success===true,'PROVIDER_ENVELOPE');return data.result;
 };
 const invoke=async(origin,passphrase,end)=>{
  check(now()<end,'WINDOW_EXPIRED');
  const r=await invokeFetch(origin+'/api/private-qa/run',{method:'POST',headers:{origin,authorization:'Basic '+Buffer.from('qa:'+passphrase).toString('base64')},redirect:'error',signal:AbortSignal.timeout(Math.min(120000,end-now()))});
  check(r.status===200&&!r.redirected&&r.url===origin+'/api/private-qa/run','DRIVER_OUTCOME_UNKNOWN_NO_RETRY');
  const text=await r.text();check(text.length<=64,'DRIVER_RESULT_SIZE');return JSON.parse(text);
 };
 onStage('private-qa-exact-run-authorized');
 const result=await execute({api,invoke,passphrase:env.GEMNAO_QA_ACCESS_PASSPHRASE,now,onStage});
 return {operation,planHash,providerRequests:calls,...result};
}
