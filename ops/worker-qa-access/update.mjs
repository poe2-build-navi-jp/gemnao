import { classifyQaAccessSecret } from './secret-format.mjs';
// Reuses pinned, reviewed verification. No provider request/credential on import.
import { createHash } from 'node:crypto';
import { readFile, writeFile, appendFile, mkdtemp, rm } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { need, validateRecord as validateBaseRecord, verifyArtifact, deploymentConfig, createApi } from '../../reviewed-controller/ops/worker-qa/deploy.mjs';
import { verifyConfiguredEnvironment, credentialTransport, loadPinnedArtifactClient, SETUP } from '../../reviewed-controller/ops/feedback-preview/live.mjs';
import { createArtifactClaims, artifactClaimName, ARTIFACT_CLIENT_PIN } from '../../reviewed-controller/ops/feedback-preview/artifact-claim.mjs';
import { PLAN_HASH } from '../../reviewed-controller/ops/feedback-preview/adapter.mjs';
export const TARGET = Object.freeze({
  accountId:'6a09a32cba1288cccce5912015086a35', worker:'gemnao-diagnostic-qa',
  workerId:'4cde2e6602024e6b9650d26b28955010', owner:325773421,
  origin:'https://gemnao-diagnostic-qa.soykururu143.workers.dev',
  workflow:'.github/workflows/worker-qa-access.yml',
  reviewedController:'f53724eefe8aa60cc2522e12adbc97f821e6f122',
});
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const canonical = x => Array.isArray(x) ? '['+x.map(canonical).join(',')+']' :
  x && typeof x==='object' ? '{'+Object.keys(x).sort().map(k=>JSON.stringify(k)+':'+canonical(x[k])).join(',')+'}' : JSON.stringify(x);
export const OPERATIONS = Object.freeze({
  install:'install-existing-qa-gate-intake-off',
  on:'enable-existing-gated-qa-synthetic', off:'disable-existing-gated-qa-intake',
  updateOff:'update-existing-gated-qa-code-intake-off',
});
export const SYNTHETIC_FLAGS = Object.freeze(['DIAGNOSIS_ENABLED','DIAGNOSIS_STORAGE_ENABLED',
  'DIAGNOSIS_SHARING_ENABLED','DIAGNOSIS_WRITES_ENABLED','DIAGNOSIS_PREVIEW_SHARING_ENABLED',
  'FEEDBACK_ENABLED','FEEDBACK_PREVIEW_ENABLED']);
const HASH = /^[a-f0-9]{64}$/;
const windowShape = a => Number.isSafeInteger(a?.notBefore) && Number.isSafeInteger(a?.expiresAt) &&
  a.notBefore > 0 && a.expiresAt > a.notBefore && a.expiresAt-a.notBefore <= 3600000;
export function validateTransition(r,now=Date.now()) {
  const install=r.operation===OPERATIONS.install, on=r.operation===OPERATIONS.on, off=r.operation===OPERATIONS.off, updateOff=r.operation===OPERATIONS.updateOff;
  need((install||on||off||updateOff) && r.workerId===TARGET.workerId &&
    r.access?.secretName==='GEMNAO_QA_ACCESS_PASSPHRASE' &&
    r.access.entropyReview==='owner-generated-unique-random-token-at-least-128-bits' && windowShape(r.access) &&
    r.access.notBefore<=now && r.residualUpdateRace==='exists-before-call-not-atomic-against-external-delete-rename-accepted', 'UPDATE_SCOPE');
  if(install) need(r.intakeEnabled===false && r.expectedState==='existing-public-qa-intake-off-without-access-gate' &&
    r.access.expiresAt>r.expiresAt && r.access.notBefore>=r.approvedAt, 'UPDATE_SCOPE');
  else {
    const prior=r.priorDeployment;
    need(windowShape(prior?.access) && Number.isSafeInteger(prior.runId) && prior.runId!==r.runId &&
      /^[a-f0-9]{40}$/.test(prior.commit??'') && HASH.test(prior.receiptSha256??'') &&
      prior.intakeEnabled===off && r.expectedState===(off?'existing-gated-qa-synthetic-on':'existing-gated-qa-intake-off') &&
      Array.isArray(r.reconciledWriteRuns) && r.reconciledWriteRuns.some(x=>x.id===prior.runId &&
        x.headSha===prior.commit && x.evidenceSha256===prior.receiptSha256), 'PRIOR_DEPLOYMENT');
    if(on) need(r.intakeEnabled===true && r.syntheticOnly===true && HASH.test(r.syntheticPlanSha256??'') &&
      r.access.notBefore>=r.approvedAt && r.access.expiresAt>r.expiresAt &&
      r.costReview?.validUntil>=r.access.expiresAt, 'SYNTHETIC_SCOPE');
    // OFF remains available after access expiry and MUST NOT extend the gate.
    if(off||updateOff) need(r.intakeEnabled===false && canonical(r.access.notBefore)===canonical(prior.access.notBefore) &&
      r.access.expiresAt===prior.access.expiresAt, 'OFF_GATE_PRESERVATION');
  }
  need(Array.isArray(r.reconciledWriteRuns??[]) && (r.reconciledWriteRuns??[]).every(x=>
    Number.isSafeInteger(x.id) && /^[a-f0-9]{40}$/.test(x.headSha??'') && HASH.test(x.evidenceSha256??'')), 'WRITE_RECONCILIATION');
}
export function validateUpdateRecord(bytes,digest,env,pins,now=Date.now()) {
  need(typeof bytes==='string' && bytes.length>0 && bytes.length<=16384 && sha256(bytes)===digest,'RECORD_DIGEST');
  const r=JSON.parse(bytes); validateTransition(r,now);
  // The common helper validates exact run/artifact/cost/token data. Transition
  // scope above is authoritative; this normalized copy is never sent to a provider.
  const normalized=JSON.stringify({...r,operation:'create-public-qa-worker-disabled-intake',intakeEnabled:false});
  validateBaseRecord(normalized,sha256(normalized),env,pins,now);
  return r;
}
export function transitionConfigs(base,record,vars) {
  const withState=(enabled,access)=>({...base,vars:{...base.vars,...Object.fromEntries(SYNTHETIC_FLAGS.map(k=>[k,String(enabled)])),...access}});
  if(record.operation===OPERATIONS.install) return {expected:base,desired:withState(false,vars)};
  need([OPERATIONS.on,OPERATIONS.off,OPERATIONS.updateOff].includes(record.operation),'UPDATE_SCOPE');
  const prior=record.priorDeployment;
  const expectedAccess={...vars,QA_ACCESS_NOT_BEFORE:String(prior.access.notBefore),QA_ACCESS_EXPIRES_AT:String(prior.access.expiresAt)};
  return {expected:withState(prior.intakeEnabled,expectedAccess),desired:withState(record.operation===OPERATIONS.on,vars)};
}
export function verifyUpdateContext(env,checkoutSha,job) {
  need(env.GITHUB_ACTIONS==='true' && env.GITHUB_REPOSITORY==='poe2-build-navi-jp/gemnao' &&
    env.GITHUB_EVENT_NAME==='workflow_dispatch' && env.GITHUB_REF===SETUP.ref &&
    env.GITHUB_RUN_ATTEMPT==='1' && env.GITHUB_SHA===checkoutSha &&
    env.GITHUB_WORKFLOW_SHA===checkoutSha && env.RUNNER_ENVIRONMENT==='github-hosted' &&
    env.GITHUB_JOB===job && env.RUNNER_DEBUG!=='1' &&
    env.GITHUB_WORKFLOW_REF===`poe2-build-navi-jp/gemnao/${TARGET.workflow}@${SETUP.ref}`,
    'WORKFLOW_CONTEXT');
}
export function accessVars(secret,record) {
  need(classifyQaAccessSecret(secret)==='valid','QA_ACCESS_SECRET_FORMAT');
  return {QA_ACCESS_SHA256:sha256(secret),QA_ACCESS_NOT_BEFORE:String(record.access.notBefore),
    QA_ACCESS_EXPIRES_AT:String(record.access.expiresAt)};
}
export async function existingIdentity(api) {
  const byId=(await api('cf','/workers/workers/'+TARGET.workerId)).result;
  const byName=(await api('cf','/workers/workers/'+TARGET.worker)).result;
  need(byId?.id===TARGET.workerId && byName?.id===TARGET.workerId &&
    byId.name===TARGET.worker && byName.name===TARGET.worker,'EXISTING_WORKER_REQUIRED');
  for(const w of [byId,byName]) need(w.subdomain?.enabled===true && w.subdomain?.previews_enabled===false &&
    w.logpush===false && w.observability?.enabled===false,'EXISTING_WORKER_SETTINGS');
  return byId;
}
export async function verifyExistingSettings(api,config) {
  const s=(await api('cf','/workers/scripts/'+TARGET.worker+'/settings')).result;
  need(Array.isArray(s?.bindings) && s.bindings.every(x=>['d1','assets','plain_text'].includes(x.type)),'BINDING_TYPES');
  const d1=s.bindings.filter(x=>x.type==='d1').map(x=>({binding:x.name,database_id:x.id})).sort((a,b)=>a.binding.localeCompare(b.binding));
  need(canonical(d1)===canonical(config.d1_databases.map(({binding,database_id})=>({binding,database_id})).sort((a,b)=>a.binding.localeCompare(b.binding))),'EXACT_D1_BINDINGS');
  need(s.bindings.filter(x=>x.type==='assets').length===1 &&
    s.bindings.find(x=>x.type==='assets').name==='ASSETS','ASSET_BINDING');
  const pairs=s.bindings.filter(x=>x.type==='plain_text').map(x=>[x.name,x.text]);
  need(new Set(pairs.map(x=>x[0])).size===pairs.length &&
    canonical(Object.fromEntries(pairs))===canonical(config.vars),'EXACT_RUNTIME_VARS');
  const schedules=(await api('cf','/workers/scripts/'+TARGET.worker+'/schedules')).result?.schedules;
  need(Array.isArray(schedules) && schedules.length===0,'UNEXPECTED_CRON');
}
export async function preflightUpdate({api,transport,record,baseConfig,expectedConfig=baseConfig}) {
  need(await verifyConfiguredEnvironment(transport)===TARGET.owner,'OWNER_PROTECTION');
  const run=await api('gh','/actions/runs/'+record.runId);
  need(run.status==='in_progress' && run.run_attempt===1 && run.id===record.runId &&
    run.head_sha===record.commit && run.path===TARGET.workflow &&
    run.event==='workflow_dispatch' && 'refs/heads/'+run.head_branch===SETUP.ref &&
    run.repository?.full_name==='poe2-build-navi-jp/gemnao','RUN_IDENTITY');
  need((await api('gh','/git/ref/heads/'+SETUP.ref.slice(11))).object?.sha===record.commit,'BRANCH_MOVED');
  const reviews=await api('gh','/actions/runs/'+record.runId+'/approvals');
  const matches=reviews.filter(x=>x.environments?.some(e=>e.id===SETUP.environmentId && e.name===SETUP.environment));
  need(matches.length===1 && matches[0].state==='approved' && matches[0].user?.id===TARGET.owner,'OWNER_APPROVAL');
  const history=await api('gh','/actions/workflows/worker-qa-access.yml/runs?per_page=100&page=1');
  need(history.total_count<=100 && history.total_count===history.workflow_runs?.length &&
    new Set(history.workflow_runs.map(x=>x.id)).size===history.total_count &&
    history.workflow_runs.some(x=>x.id===record.runId),'HISTORY_INCOMPLETE');
  for(const old of history.workflow_runs) if(old.id!==record.runId) {
    const noWrite=record.reconciledNoWriteRuns.filter(x=>x.id===old.id && x.headSha===old.head_sha);
    const written=(record.reconciledWriteRuns??[]).filter(x=>x.id===old.id && x.headSha===old.head_sha);
    // A failed post-write readback may be reconciled by explicit confirmed-write
    // evidence. Never relabel it no-write merely because the run failed.
    need(old.status==='completed' && old.run_attempt===1 && noWrite.length+written.length===1 &&
      (old.conclusion!=='success' || written.length===1),'UNRECONCILED_RUN');
  }
  if(record.operation!==OPERATIONS.install)
    need(history.workflow_runs.some(x=>x.id===record.priorDeployment.runId &&
      x.head_sha===record.priorDeployment.commit && x.status==='completed'),'PRIOR_RUN');
  // Current exact gated settings below, not run creation-time ordering, establish
  // that the receipt's baseline still matches the target immediately before use.
  const artifact=await api('gh','/actions/artifacts/'+record.artifact.id);
  need(artifact.expired===false && artifact.id===record.artifact.id && artifact.workflow_run?.id===record.runId &&
    artifact.workflow_run.head_sha===record.commit && artifact.digest==='sha256:'+record.artifact.archiveSha256 &&
    artifact.size_in_bytes>0 && artifact.size_in_bytes<=80*1024*1024,'ARTIFACT_PROVENANCE');
  need((await api('cf','')).result?.id===TARGET.accountId,'ACCOUNT_ID');
  need('https://'+TARGET.worker+'.'+(await api('cf','/workers/subdomain')).result?.subdomain+'.workers.dev'===TARGET.origin,'SUBDOMAIN');
  await existingIdentity(api);
  await verifyExistingSettings(api,expectedConfig);
  for(const db of baseConfig.d1_databases) {
    const got=(await api('cf','/d1/database/'+db.database_id)).result;
    need(got?.uuid===db.database_id && got.name===db.database_name,'D1_IDENTITY');
  }
}
export async function updateExistingOnce({api,record,baseConfig,vars,claim,runWrangler,reverify,now=Date.now,journal=()=>{}}) {
  const fresh=()=>need(now()<record.expiresAt && now()<record.costReview.validUntil &&
    now()>=record.access.notBefore && ([OPERATIONS.off,OPERATIONS.updateOff].includes(record.operation) || now()<record.access.expiresAt),'APPROVAL_EXPIRED');
  const {expected,desired:config}=transitionConfigs(baseConfig,record,vars);
  fresh(); await reverify(); await existingIdentity(api); await verifyExistingSettings(api,expected);
  await claim(); fresh(); await reverify();
  // Final existence checks occur immediately before the one name-targeted CLI.
  // This is NOT a provider-atomic condition; an external actor can race it.
  await existingIdentity(api); await verifyExistingSettings(api,expected); fresh();
  journal({stage:'existing-worker-update',workerId:TARGET.workerId,outcome:'in-progress'});
  await runWrangler(config); // One invocation; official internal retries disclosed.
  await existingIdentity(api); await verifyExistingSettings(api,config);
  return {workerId:TARGET.workerId,worker:TARGET.worker,origin:TARGET.origin,
    gateInstalled:true,accessNotBefore:record.access.notBefore,accessExpiresAt:record.access.expiresAt,
    operation:record.operation,intakeEnabled:record.operation===OPERATIONS.on,syntheticOnly:true,actualQaVerified:false};
}
async function runPinnedWrangler(artifact,config,token,expiresAt) {
  const home=await mkdtemp(join(tmpdir(),'gemnao-qa-access-'));
  try {
    const configPath=join(home,'qa.json');
    await writeFile(configPath,JSON.stringify({...config,main:resolve(artifact.app,config.main),
      assets:{...config.assets,directory:resolve(artifact.app,config.assets.directory)}}),{mode:0o600,flag:'wx'});
    execFileSync(process.execPath,[artifact.cli,'deploy','--config',configPath,'--no-bundle'],{
      cwd:artifact.app,timeout:Math.min(300000,Math.max(1,expiresAt-Date.now())),maxBuffer:1048576,stdio:['ignore','pipe','pipe'],
      env:{PATH:process.env.PATH,HOME:home,XDG_CONFIG_HOME:home,CI:'true',CLOUDFLARE_API_TOKEN:token,
        CLOUDFLARE_ACCOUNT_ID:TARGET.accountId,WRANGLER_SEND_METRICS:'false',WRANGLER_LOG:'error',
        WRANGLER_LOG_PATH:'/dev/null'},
    });
  } catch {throw new Error('BLOCKED:WRANGLER_OUTCOME_UNKNOWN_NO_RERUN');}
  finally {await rm(home,{recursive:true,force:true});}
}
if(process.argv[1]===fileURLToPath(import.meta.url)) {
  try {
    const env=process.env,mode=process.argv[2]??'update';
    need(['gate','verify','update'].includes(mode) && process.argv.length<=3,'INVOCATION');
    const git=args=>execFileSync('git',args,{encoding:'utf8'}).trim();
    verifyUpdateContext(env,git(['rev-parse','HEAD']),mode==='gate'?'gate':'update');
    need(git(['-C','reviewed-controller','rev-parse','HEAD'])===TARGET.reviewedController &&
      git(['-C','reviewed-controller','diff','--name-only','HEAD'])==='','REVIEWED_DEPENDENCY');
    const pins=JSON.parse(await readFile(new URL('pins.json',import.meta.url),'utf8'));
    const transport=credentialTransport({githubToken:()=>env.PREVIEW_GITHUB_TOKEN,cloudflareToken:()=>{
      need(mode==='update','NO_CF_CREDENTIAL_HERE');return env.GEMNAO_PREVIEW_CLOUDFLARE_API_TOKEN;
    }});
    if(mode==='gate') {
      need(['PREVIEW_OUTSIDE_RECORD_PRESENT','PREVIEW_OUTSIDE_DIGEST_PRESENT','PREVIEW_OUTSIDE_TOKEN_PRESENT','QA_OUTSIDE_ACCESS_PRESENT']
        .every(k=>env[k]==='false'),'UNPROTECTED_SECRET');
      need(await verifyConfiguredEnvironment(transport)===TARGET.owner,'OWNER_PROTECTION');
      await appendFile(env.GITHUB_OUTPUT,'environment='+SETUP.environment+'\nsource='+pins.sourceCommit+'\n');
      console.log(JSON.stringify({runId:env.GITHUB_RUN_ID,pinsSha256:sha256(canonical(pins)),intakeEnabled:false}));
    } else {
      const record=validateUpdateRecord(env.PREVIEW_APPROVAL_RECORD,env.PREVIEW_APPROVAL_SHA256,env,pins);
      const artifactPins={...pins,manifestSha256:record.artifact.manifestSha256,bundleSha256:record.artifact.bundleSha256,
        deploymentConfigSha256:record.artifact.deploymentConfigSha256};
      const artifact=await verifyArtifact(artifactPins,resolve('application'));
      const baseConfig=deploymentConfig(JSON.parse(await readFile('application/wrangler.worker-preview.json','utf8')),TARGET.origin);
      if(mode==='verify') console.log('Verified exact gated source and secret-free deployment artifact.');
      else {
        const vars=accessVars(env.GEMNAO_QA_ACCESS_PASSPHRASE,record);
        const expectedConfig=transitionConfigs(baseConfig,record,vars).expected;
        const api=createApi(transport);await preflightUpdate({api,transport,record,baseConfig,expectedConfig});
        const claims=createArtifactClaims({client:await loadPinnedArtifactClient(),clientVersion:ARTIFACT_CLIENT_PIN.version,runId:record.runId});
        const claim=async()=>{
          const payload={runId:record.runId,planHash:PLAN_HASH,workerId:TARGET.workerId,recordSha256:env.PREVIEW_APPROVAL_SHA256};
          const receipt=await claims.createExclusive(artifactClaimName(record.runId),payload);
          need(canonical((await claims.read(receipt.id)).payload)===canonical(payload),'CLAIM_READBACK');
        };
        const result=await updateExistingOnce({api,record,baseConfig,vars,claim,reverify:()=>verifyArtifact(artifactPins),
          runWrangler:config=>runPinnedWrangler(artifact,config,env.GEMNAO_PREVIEW_CLOUDFLARE_API_TOKEN,record.expiresAt),
          journal:value=>console.log(JSON.stringify(value))});
        console.log(JSON.stringify(result));
      }
    }
  } catch(error) {
    console.error(/^BLOCKED:[A-Z0-9_]+$/.test(error.message??'')?error.message:'BLOCKED:UNCLASSIFIED');
    console.error('Do not rerun. Reconcile the existing Worker read-only.');process.exitCode=1;
  }
}


