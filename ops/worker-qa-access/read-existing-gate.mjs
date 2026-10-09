// Read-only diagnostic. No approval-record validator or deployment code is changed.
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { verifyConfiguredEnvironment, SETUP } from '../../reviewed-controller/ops/feedback-preview/live.mjs';
const REPO='poe2-build-navi-jp/gemnao', ACCOUNT='6a09a32cba1288cccce5912015086a35';
const WORKER='gemnao-diagnostic-qa', ID='4cde2e6602024e6b9650d26b28955010', OWNER=325773421;
const WORKFLOW='.github/workflows/qa-secret-format.yml';
export const FLAGS=Object.freeze(['DIAGNOSIS_ENABLED','DIAGNOSIS_STORAGE_ENABLED','DIAGNOSIS_SHARING_ENABLED',
  'DIAGNOSIS_WRITES_ENABLED','DIAGNOSIS_PREVIEW_SHARING_ENABLED','FEEDBACK_ENABLED','FEEDBACK_PREVIEW_ENABLED']);
const need=(ok)=>{if(!ok) throw new Error('BLOCKED:QA_GATE_READ');};
export function validateContext(env,sha,phase) {
  need(['gate','read'].includes(phase) && env.QA_DIAGNOSTIC_MODE==='read-existing-qa-gate' &&
    env.GITHUB_ACTIONS==='true' && env.GITHUB_REPOSITORY===REPO && env.GITHUB_EVENT_NAME==='workflow_dispatch' &&
    env.GITHUB_REF===SETUP.ref && env.GITHUB_RUN_ATTEMPT==='1' && /^[1-9][0-9]*$/.test(env.GITHUB_RUN_ID??'') &&
    Number.isSafeInteger(Number(env.GITHUB_RUN_ID)) && /^[a-f0-9]{40}$/.test(sha??'') && env.GITHUB_SHA===sha &&
    env.GITHUB_WORKFLOW_SHA===sha && env.GITHUB_WORKFLOW_REF===`${REPO}/${WORKFLOW}@${SETUP.ref}` &&
    env.RUNNER_ENVIRONMENT==='github-hosted' && env.RUNNER_DEBUG!=='1' &&
    env.GITHUB_JOB===(phase==='gate'?'protected-scope':'read-existing-gate'));
}
// Exact URL/method allowlist applies even to the reused Environment verifier.
// Every endpoint can be called at most once; errors never contain provider text.
export function createReader({env,phase,fetchImpl=globalThis.fetch}) {
  const gh=`https://api.github.com/repos/${REPO}`, cf=`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT}`;
  const ghPaths=[`/environments/${SETUP.environment}`,`/environments/${SETUP.environment}/deployment-branch-policies?per_page=100&page=1`,
    `/actions/runs/${env.GITHUB_RUN_ID}`,`/actions/runs/${env.GITHUB_RUN_ID}/approvals`,`/git/ref/heads/${SETUP.ref.slice(11)}`];
  const cfPaths=['','/workers/workers?per_page=100&page=1',`/workers/workers/${ID}`,`/workers/workers/${WORKER}`,`/workers/scripts/${WORKER}/settings`];
  const allowed=new Set([...ghPaths.map(p=>gh+p),...(phase==='read'?cfPaths.map(p=>cf+p):[])]), seen=new Set();
  const transport=async(url,options)=>{
    try {
      need(allowed.has(url) && !seen.has(url) && options?.method==='GET' && options.body===undefined);
      seen.add(url);
      const token=url.startsWith(gh+'/')?env.PREVIEW_GITHUB_TOKEN:env.GEMNAO_PREVIEW_CLOUDFLARE_API_TOKEN;
      need(typeof token==='string' && token.length>0 && !/[\r\n]/.test(token));
      const response=await fetchImpl(url,{method:'GET',redirect:'error',signal:AbortSignal.timeout(10000),
        headers:{Accept:'application/json',Authorization:`Bearer ${token}`,'X-GitHub-Api-Version':'2022-11-28'}});
      need(response.status===200 && response.url===url && !response.redirected && response.headers.get('content-type')?.includes('application/json'));
      return response;
    } catch {throw new Error('BLOCKED:QA_GATE_READ');}
  };
  const get=async(service,path)=>{
    try {
      need(service==='gh'||service==='cf');
      const response=await transport((service==='gh'?gh:cf)+path,{method:'GET'});
      const chunks=[];let size=0;
      for await(const chunk of response.body){size+=chunk.byteLength;need(size<=1048576);chunks.push(Buffer.from(chunk));}
      const body=JSON.parse(Buffer.concat(chunks).toString('utf8'));
      if(service==='cf') need(body.success===true && (Array.isArray(body.errors)&&body.errors.length===0 ||
        path.startsWith('/workers/workers')&&body.errors==null));
      return body;
    } catch {throw new Error('BLOCKED:QA_GATE_READ');}
  };
  return {transport,get};
}
export async function diagnose({env,checkoutSha,phase,fetchImpl,now=Date.now}) {
  try {
    validateContext(env,checkoutSha,phase);
    if(phase==='gate') need(env.QA_OUTSIDE_CF_PRESENT==='false' && env.QA_OUTSIDE_ACCESS_PRESENT==='false');
    const {transport,get}=createReader({env,phase,fetchImpl});
    need(await verifyConfiguredEnvironment(transport)===OWNER);
    const run=await get('gh',`/actions/runs/${env.GITHUB_RUN_ID}`);
    need(run.id===Number(env.GITHUB_RUN_ID) && run.run_attempt===1 && run.status==='in_progress' &&
      run.head_sha===checkoutSha && run.path===WORKFLOW && run.event==='workflow_dispatch' &&
      'refs/heads/'+run.head_branch===SETUP.ref && run.repository?.full_name===REPO);
    need((await get('gh',`/git/ref/heads/${SETUP.ref.slice(11)}`)).object?.sha===checkoutSha);
    if(phase==='gate') return null;
    const reviews=await get('gh',`/actions/runs/${env.GITHUB_RUN_ID}/approvals`);
    need(Array.isArray(reviews));
    const matches=reviews.filter(r=>r.environments?.some(e=>e.id===SETUP.environmentId && e.name===SETUP.environment));
    need(matches.length===1 && matches[0].state==='approved' && matches[0].user?.id===OWNER);
    need((await get('cf','')).result?.id===ACCOUNT);
    const inventory=await get('cf','/workers/workers?per_page=100&page=1');
    need(Array.isArray(inventory.result) && inventory.result.length<=100 && inventory.result_info?.total_count===inventory.result.length &&
      inventory.result_info.page===1 && inventory.result_info.per_page===100 &&
      inventory.result.every(w=>/^[a-f0-9]{32}$/.test(w.id??'') && typeof w.name==='string') &&
      new Set(inventory.result.map(w=>w.id)).size===inventory.result.length);
    const matchesWorker=inventory.result.filter(w=>w.id===ID||w.name===WORKER);
    need(matchesWorker.length===1 && matchesWorker[0].id===ID && matchesWorker[0].name===WORKER);
    for(const key of [ID,WORKER]){const w=(await get('cf',`/workers/workers/${key}`)).result;need(w?.id===ID&&w.name===WORKER);}
    const bindings=(await get('cf',`/workers/scripts/${WORKER}/settings`)).result?.bindings;
    need(Array.isArray(bindings));
    const readText=name=>{const found=bindings.filter(b=>b.name===name);need(found.length===1&&found[0].type==='plain_text');return found[0].text;};
    const timestamp=name=>{const value=readText(name);need(typeof value==='string'&&/^[1-9][0-9]{12}$/.test(value)&&Number.isSafeInteger(Number(value)));return Number(value);};
    const start=timestamp('QA_ACCESS_NOT_BEFORE'),end=timestamp('QA_ACCESS_EXPIRES_AT');
    need(end>start && end-start<=3600000);
    const flags=Object.fromEntries(FLAGS.map(name=>{const value=readText(name);need(value==='true'||value==='false');return [name,value==='true'];}));
    const readAt=now();need(Number.isSafeInteger(readAt)&&readAt>0);
    // Explicit construction: never spread provider objects or output the verifier.
    return {workerId:ID,QA_ACCESS_NOT_BEFORE:start,QA_ACCESS_EXPIRES_AT:end,...flags,readAt,runId:Number(env.GITHUB_RUN_ID),headSha:checkoutSha};
  } catch {throw new Error('BLOCKED:QA_GATE_READ');}
}
if(process.argv[1]===fileURLToPath(import.meta.url)) {
  try {
    need(process.argv.length===3);
    const result=await diagnose({env:process.env,phase:process.argv[2],checkoutSha:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8',stdio:['ignore','pipe','ignore']}).trim()});
    if(result) process.stdout.write(JSON.stringify(result)+'\n');
  } catch {process.stderr.write('BLOCKED:QA_GATE_READ\n');process.exitCode=1;}
}
