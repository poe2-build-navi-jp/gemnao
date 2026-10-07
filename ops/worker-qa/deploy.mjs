// Local preparation by default. No credential is read on import; all live work
// is confined to the final protected action. No source/assets protocol is forked.
import { readFile, writeFile, appendFile, mkdtemp, rm, lstat, readdir } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { sha256, TARGET } from '../feedback-preview/controller.mjs';
import { canonical, PLAN_HASH } from '../feedback-preview/adapter.mjs';
import { SETUP, verifyConfiguredEnvironment, credentialTransport, loadPinnedArtifactClient } from '../feedback-preview/live.mjs';
import { createArtifactClaims, artifactClaimName, ARTIFACT_CLIENT_PIN } from '../feedback-preview/artifact-claim.mjs';

export const FIXED = Object.freeze({
  worker: 'gemnao-diagnostic-qa', owner: 325773421,
  workflow: '.github/workflows/worker-qa-deploy.yml', wrangler: '4.92.0',
  wranglerCliSha256: 'fc1aa72afc91906759a3555e76e6dae1b13504f71dec6d3bbfa0fe24c351ebd7',
  receiptSha256: 'a60571f40ecd9a37db31a42e98841ad2ba2f993de0ec016488fc688d599e43d0',
  databases: [
    { binding: 'DIAGNOSIS_DB', database_name: 'gemnao-diagnosis-preview-20261007', database_id: '72c728f5-1656-4e26-bc11-7c508ae155c3' },
    { binding: 'FEEDBACK_DB', database_name: 'gemnao-diagnostic-feedback-preview-20261007', database_id: '3a714aee-e602-4590-afd0-3c2ddd9aea8f' },
  ],
});
const HASH = /^[a-f0-9]{64}$/;
const SHA = /^[a-f0-9]{40}$/;
const ID = /^[a-f0-9]{32}$/;
const ACCOUNT = `/accounts/${TARGET.accountId}`;
const REPO = `/repos/${TARGET.repository}`;
export function need(ok, code) { if (!ok) throw new Error(`BLOCKED:${code}`); }
export function validatePins(p) {
  need(p.executionReviewed === true && SHA.test(p.sourceCommit ?? '') && SHA.test(p.sourceTree ?? '')
    && /^https:\/\/gemnao-diagnostic-qa\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.workers\.dev$/.test(p.origin ?? '')
    && HASH.test(p.sourceLockSha256 ?? ''), 'UNREVIEWED_PINS');
  return p;
}
export function validateContext(env, sha, job) {
  need(env.GITHUB_ACTIONS === 'true' && env.GITHUB_REPOSITORY === TARGET.repository
    && env.GITHUB_EVENT_NAME === 'workflow_dispatch' && env.GITHUB_REF === SETUP.ref
    && env.GITHUB_RUN_ATTEMPT === '1' && /^[1-9][0-9]*$/.test(env.GITHUB_RUN_ID ?? '')
    && SHA.test(env.GITHUB_SHA ?? '') && sha === env.GITHUB_SHA && env.GITHUB_WORKFLOW_SHA === sha
    && env.GITHUB_WORKFLOW_REF === `${TARGET.repository}/${FIXED.workflow}@${SETUP.ref}`
    && env.RUNNER_ENVIRONMENT === 'github-hosted' && env.RUNNER_DEBUG !== '1'
    && env.GITHUB_JOB === job, 'WORKFLOW_CONTEXT');
}
export function validateRecord(bytes, digest, env, p, now = Date.now()) {
  need(typeof bytes === 'string' && bytes.length <= 16384 && HASH.test(digest ?? '') && sha256(bytes) === digest, 'RECORD_DIGEST');
  const r = JSON.parse(bytes); validatePins(p);
  need(r.operation === 'create-public-qa-worker-disabled-intake' && r.accountId === TARGET.accountId
    && r.worker === FIXED.worker && r.runId === Number(env.GITHUB_RUN_ID) && r.commit === env.GITHUB_SHA
    && r.ref === SETUP.ref && r.ownerId === FIXED.owner && r.pinsSha256 === sha256(canonical(p))
    && r.creationReceiptSha256 === FIXED.receiptSha256 && r.origin === p.origin
    && Number.isSafeInteger(r.approvedAt) && r.approvedAt <= now && now - r.approvedAt < 3600000
    && r.expiresAt > now && r.expiresAt <= r.approvedAt + 3600000, 'EXACT_RUN_RECORD');
  need(r.nameTargeting === 'immutable-id-rechecks-with-residual-name-race-accepted'
    && r.wranglerRetries === 'pinned-official-internal-retries-accepted-no-cli-rerun'
    && r.intakeEnabled === false && r.syntheticOnly === true, 'DEPLOY_SCOPE');
  const t = r.tokenReview;
  need(t?.secretName === SETUP.secret && t.accountId === TARGET.accountId && t.noExpansion === true
    && HASH.test(t.evidenceSha256 ?? ''), 'TOKEN_EVIDENCE');
  if (t.kind === 'user-configured-scope-plus-authenticated-target-receipt') {
    // Successful target access is evidence of access only. It does not prove
    // account restriction, least privilege, resource isolation or future validity.
    need(t.creationRunId === 37640786041 && t.creationReceiptSha256 === FIXED.receiptSha256
      && t.accountRestriction === 'unverified' && t.expiry === 'unverified', 'TOKEN_RECEIPT_EVIDENCE');
  } else {
    need(t.kind === 'owner-reviewed-scope' && t.scopeKnown === true && t.accountOnly === true
      && t.permissionsReviewed === true && t.expiresAt > r.expiresAt
      && t.reviewedAt <= now && now - t.reviewedAt < 3600000, 'TOKEN_SCOPE_UNPROVEN');
  }
  const c = r.costReview;
  need(c?.accountId === TARGET.accountId && c.workersPlan === 'workers-free' && c.maximumChargeUSD === 0
    && HASH.test(c.evidenceSha256 ?? '') && c.reviewedAt <= now && now - c.reviewedAt < 3600000
    && c.validUntil >= r.expiresAt && c.validUntil <= (Math.floor(now / 86400000) + 1) * 86400000
    && c.workerLimit === 100 && c.workerSlotsReserved === 1 && c.assetFileLimit === 20000
    && c.scriptGzipLimitBytes === 3 * 1024 * 1024
    && c.publicTrafficRiskAccepted === true, 'COST_UNPROVEN');
  for (const key of ['workerRequests', 'd1RowsRead', 'd1RowsWritten', 'storageBytes']) {
    const b = c.budgets?.[key];
    need(Number.isSafeInteger(b?.remaining) && Number.isSafeInteger(b?.reserve) && b.reserve > 0
      && Number.isSafeInteger(b?.existingTrafficAllowance) && b.existingTrafficAllowance > 0
      && b.remaining - b.existingTrafficAllowance >= b.reserve, 'COST_HEADROOM');
  }
  need(HASH.test(r.artifactStorageReviewSha256 ?? '') && Array.isArray(r.reconciledNoWriteRuns)
    && r.reconciledNoWriteRuns.every(x => Number.isSafeInteger(x.id) && SHA.test(x.headSha ?? '')
      && HASH.test(x.evidenceSha256 ?? '')), 'RUN_RECONCILIATION');
  need(['manifestSha256','bundleSha256','deploymentConfigSha256'].every(k=>HASH.test(r.artifact?.[k] ?? ''))
    && HASH.test(r.artifact.archiveSha256 ?? '') && Number.isSafeInteger(r.artifact.id) && r.artifact.id > 0 && r.artifact.id === Number(env.QA_ARTIFACT_ID), 'APPROVED_ARTIFACT');
  return r;
}
export function deploymentConfig(config, origin) {
  need(canonical(Object.keys(config).sort()) === canonical(['$schema','name','account_id','main','compatibility_date',
    'compatibility_flags','workers_dev','preview_urls','send_metrics','upload_source_maps','assets','vars','d1_databases'].sort()), 'CONFIG_KEYS');
  need(config.name === FIXED.worker && config.account_id === TARGET.accountId && config.workers_dev === true
    && config.preview_urls === false && config.send_metrics === false && config.upload_source_maps === false
    && config.main === './cloudflare/worker-preview.mjs' && config.compatibility_date === '2026-05-22'
    && canonical(config.compatibility_flags) === canonical(['nodejs_compat'])
    && canonical(config.d1_databases) === canonical(FIXED.databases)
    && canonical(config.assets) === canonical({directory:'./dist/worker-preview/assets',binding:'ASSETS',run_worker_first:true,html_handling:'none',not_found_handling:'none'}), 'CONFIG_SCOPE');
  const expected = {QA_PREVIEW_ORIGIN:origin,DIAGNOSIS_LOCAL_BETA:'true',DIAGNOSIS_ENABLED:'false',DIAGNOSIS_STORAGE_ENABLED:'false',
    DIAGNOSIS_SHARING_ENABLED:'false',DIAGNOSIS_WRITES_ENABLED:'false',DIAGNOSIS_METRICS_ENABLED:'false',
    DIAGNOSIS_PREVIEW_SHARING_ENABLED:'false',DIAGNOSIS_PREVIEW_ORIGIN:origin,FEEDBACK_ENABLED:'false',FEEDBACK_PREVIEW_ENABLED:'false',FEEDBACK_PREVIEW_ORIGIN:origin};
  need(canonical(config.vars) === canonical(expected), 'INTAKE_OR_ORIGIN');
  const {$schema: _schema, ...rest} = config;
  return {...rest, main:'./.wrangler/worker-preview-dry-run/worker-preview.js', no_bundle:true, logpush:false, observability:{enabled:false}};
}
export async function verifyArtifact(p, app = resolve('application'), {writeConfig = false} = {}) {
  validatePins(p);
  const git = args => execFileSync('git', ['-C', app, ...args], {encoding:'utf8'}).trim();
  need(git(['rev-parse','HEAD']) === p.sourceCommit && git(['rev-parse','HEAD^{tree}']) === p.sourceTree
    && git(['diff','--name-only','HEAD']) === '', 'SOURCE_CHANGED');
  need(sha256(await readFile(join(app,'pnpm-lock.yaml'))) === p.sourceLockSha256, 'SOURCE_LOCK');
  const manifestBytes = await readFile(join(app,'dist/worker-preview/asset-manifest.json'));
  need(sha256(manifestBytes) === p.manifestSha256, 'ARTIFACT_MANIFEST');
  // Only this controller's reviewed byte checker runs in the credential step.
  // Application build scripts and its verifier are executed earlier, without it.
  const manifest = JSON.parse(manifestBytes);
  need(canonical(manifest.inputs.map(x=>x.path)) === canonical(['dist/client/_worker.bundle.js','cloudflare/worker-preview.mjs','cloudflare/worker-preview-policy.mjs','lib/preview/worker-origin.ts','wrangler.worker-preview.json']), 'MANIFEST_INPUTS');
  for (const f of manifest.inputs) {
    need((await lstat(join(app,f.path))).isFile() && !(await lstat(join(app,f.path))).isSymbolicLink(),'ARTIFACT_TYPE');
    const b = await readFile(join(app,f.path)); need(b.length === f.bytes && sha256(b) === f.sha256,'ARTIFACT_CHANGED');
  }
  const actual = [];
  async function walk(dir,prefix='') {
    for (const f of await readdir(dir,{withFileTypes:true})) {
      need(!f.isSymbolicLink(),'ASSET_SYMLINK');
      if(f.isDirectory()) await walk(join(dir,f.name),prefix+f.name+'/');
      else { need(f.isFile(),'ASSET_TYPE'); actual.push(prefix+f.name); }
    }
  }
  const assets = join(app,'dist/worker-preview/assets'); await walk(assets);
  need(manifest.assets.length < 20000 && canonical(actual.sort((a,b)=>a.localeCompare(b))) === canonical([...manifest.assets.map(x=>x.path),'.assetsignore'].sort((a,b)=>a.localeCompare(b))),'ASSET_SET');
  need(sha256(await readFile(join(assets,'.assetsignore'))) === manifest.ignoreSha256,'ASSET_IGNORE');
  for(const f of manifest.assets) {
    need(!f.path.includes('..') && !f.path.startsWith('/') && !f.path.includes('\\'),'ASSET_PATH');
    const b = await readFile(join(assets,f.path));
    need(b.length === f.bytes && b.length <= 25*1024*1024 && sha256(b) === f.sha256,'ASSET_CHANGED');
  }
  const config = deploymentConfig(JSON.parse(await readFile(join(app,'wrangler.worker-preview.json'),'utf8')), p.origin);
  const bytes = JSON.stringify(config, null, 2) + '\n';
  need(sha256(bytes) === p.deploymentConfigSha256, 'DEPLOY_CONFIG_HASH');
  const bundle = await readFile(join(app,config.main));
  need(sha256(bundle) === p.bundleSha256 && gzipSync(bundle).length <= 3*1024*1024, 'BUNDLE_HASH_OR_LIMIT');
  const require = createRequire(join(app,'package.json'));
  need(require('wrangler/package.json').version === FIXED.wrangler, 'WRANGLER_VERSION');
  need(sha256(await readFile(require.resolve('wrangler/wrangler-dist/cli.js'))) === FIXED.wranglerCliSha256, 'WRANGLER_BYTES');
  const configPath = join(app,'wrangler.qa-deploy.json');
  if (writeConfig) await writeFile(configPath,bytes,{flag:'wx'});
  else need(await readFile(configPath,'utf8') === bytes, 'DEPLOY_CONFIG_CHANGED');
  return {app,configPath,cli:require.resolve('wrangler/wrangler-dist/cli.js')};
}
export function createApi(transport) {
  let count = 0;
  return async (service, path, method = 'GET', body) => {
    need(++count <= 40 && (method === 'GET' || (service === 'cf' && method === 'POST' && path === '/workers/workers')), 'REQUEST_SCOPE');
    const url = service === 'gh' ? `https://api.github.com${REPO}${path}` : `https://api.cloudflare.com/client/v4${ACCOUNT}${path}`;
    const response = await transport(url,{method,redirect:'error',signal:AbortSignal.timeout(10000),headers:{Accept:'application/json','Content-Type':'application/json'},...(body ? {body:JSON.stringify(body)}:{})});
    need([200,201].includes(response.status) && response.url === url && !response.redirected
      && response.headers.get('content-type')?.includes('application/json'), 'API_RESPONSE');
    const chunks = []; let size = 0;
    for await (const chunk of response.body) { size += chunk.byteLength; need(size <= 1048576,'API_SIZE'); chunks.push(chunk); }
    const json = JSON.parse(Buffer.concat(chunks).toString());
    if (service === 'cf') {
      // Same documented beta Workers envelope compatibility as reviewed controller.
      // This never expands the permitted write methods/paths above.
      const workerPath = path.split('?')[0];
      const workersEnvelope = (['GET','POST'].includes(method) && workerPath === '/workers/workers')
        || (method === 'GET' && /^\/workers\/workers\/[a-f0-9]{32}$/.test(workerPath))
        || (method === 'GET' && workerPath === `/workers/workers/${FIXED.worker}`)
        || (method === 'POST' && /^\/workers\/workers\/[a-f0-9]{32}\/versions$/.test(workerPath))
        || (method === 'GET' && /^\/workers\/workers\/[a-f0-9]{32}\/versions\/[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/.test(workerPath));
      need(json.success === true && (Array.isArray(json.errors) && json.errors.length === 0
        || (workersEnvelope && json.errors == null)), 'CF_ENVELOPE');
    }
    return service === 'cf' ? json : json;
  };
}
export async function preflight({api,transport,record,pins}) {
  need(await verifyConfiguredEnvironment(transport) === FIXED.owner,'EXACT_OWNER');
  const run = await api('gh',`/actions/runs/${record.runId}`);
  need(run.id === record.runId && run.head_sha === record.commit && run.run_attempt === 1
    && run.status === 'in_progress' && run.event === 'workflow_dispatch' && run.path === FIXED.workflow
    && run.repository?.full_name === TARGET.repository && `refs/heads/${run.head_branch}` === SETUP.ref,'RUN_IDENTITY');
  const ref = await api('gh',`/git/ref/heads/${SETUP.ref.slice(11)}`); need(ref.object?.sha === record.commit,'BRANCH_MOVED');
  const reviews = await api('gh',`/actions/runs/${record.runId}/approvals`);
  const matches = reviews.filter(x => x.environments?.some(e => e.id === SETUP.environmentId && e.name === SETUP.environment));
  need(matches.length === 1 && matches[0].state === 'approved' && matches[0].user?.id === FIXED.owner,'OWNER_APPROVAL');
  const history = await api('gh','/actions/workflows/worker-qa-deploy.yml/runs?per_page=100&page=1');
  need(history.total_count <= 100 && history.total_count === history.workflow_runs?.length
    && new Set(history.workflow_runs.map(x=>x.id)).size === history.total_count
    && history.workflow_runs.some(x=>x.id === record.runId && x.head_sha === record.commit),'HISTORY_INCOMPLETE');
  for (const old of history.workflow_runs) if (old.id !== record.runId)
    need(old.status === 'completed' && old.run_attempt === 1 && record.reconciledNoWriteRuns.some(x=>x.id === old.id && x.headSha === old.head_sha),'UNRESOLVED_PRIOR_RUN');
  const artifact = await api('gh',`/actions/artifacts/${record.artifact.id}`);
  need(artifact.id === record.artifact.id && artifact.expired === false && artifact.workflow_run?.id === record.runId
    && artifact.workflow_run.head_sha === record.commit && artifact.digest === `sha256:${record.artifact.archiveSha256}`
    && artifact.size_in_bytes > 0 && artifact.size_in_bytes <= 80*1024*1024,'ARTIFACT_PROVENANCE');
  need((await api('cf','')).result?.id === TARGET.accountId,'ACCOUNT_ID');
  const subdomain = (await api('cf','/workers/subdomain')).result?.subdomain;
  need(`https://${FIXED.worker}.${subdomain}.workers.dev` === pins.origin,'HOSTNAME_CHANGED');
  const inventory = await api('cf','/workers/workers?per_page=100&page=1');
  need(inventory.result_info?.total_count === inventory.result?.length && inventory.result_info.page === 1
    && inventory.result_info.per_page === 100 && inventory.result.length < record.costReview.workerLimit
    && inventory.result.every(x=>ID.test(x.id ?? '') && typeof x.name === 'string')
    && new Set(inventory.result.map(x=>x.id)).size === inventory.result.length,'INVENTORY_INCOMPLETE');
  need(!inventory.result.some(x=>x.name === FIXED.worker),'WORKER_COLLISION');
  for (const db of FIXED.databases) {
    const got = (await api('cf',`/d1/database/${db.database_id}`)).result;
    need(got?.uuid === db.database_id && got.name === db.database_name,'D1_RECEIPT_IDENTITY');
  }
  return inventory.result;
}
export async function deployOnce({api,record,pins,claim,runWrangler,expectedVars,existingIds=[],now=Date.now, reverify=async()=>{},journal=()=>{}}) {
  let attempted = false;
  const fresh = () => { need(now() < record.expiresAt && now() < record.costReview.validUntil,'APPROVAL_EXPIRED'); };
  fresh(); await reverify(); await claim(); fresh();
  need(!attempted,'ALREADY_ATTEMPTED'); attempted = true;
  journal({stage:'worker-create',outcome:'in-progress'});
  const worker = (await api('cf','/workers/workers','POST',{name:FIXED.worker,subdomain:{enabled:false,previews_enabled:false},logpush:false,observability:{enabled:false}})).result;
  need(ID.test(worker?.id ?? '') && !existingIds.includes(worker.id) && worker.name === FIXED.worker && worker.subdomain?.enabled === false
    && worker.subdomain?.previews_enabled === false,'CREATE_OUTCOME_UNKNOWN');
  journal({stage:'worker-created',workerId:worker.id,outcome:'confirmed'});
  const identity = async () => {
    const got = (await api('cf',`/workers/workers/${worker.id}`)).result;
    need(got?.id === worker.id && got.name === FIXED.worker,'WORKER_IDENTITY_CHANGED'); return got;
  };
  await identity(); fresh(); await reverify();
  journal({stage:'wrangler-deploy',workerId:worker.id,outcome:'in-progress'});
  await runWrangler(); // exactly one invocation; upstream has reviewed internal retries
  const got = await identity();
  need(got.subdomain?.enabled === true && got.subdomain?.previews_enabled === false
    && got.logpush === false && got.observability?.enabled === false,'POST_DEPLOY_SETTINGS');
  const settings = (await api('cf',`/workers/scripts/${FIXED.worker}/settings`)).result;
  const d1 = settings.bindings?.filter(b=>b.type === 'd1').map(b=>({binding:b.name,database_id:b.id}));
  need(canonical(d1?.sort((a,b)=>a.binding.localeCompare(b.binding))) === canonical(FIXED.databases.map(({binding,database_id})=>({binding,database_id})).sort((a,b)=>a.binding.localeCompare(b.binding)))
    && settings.bindings.every(b=>['d1','assets','plain_text'].includes(b.type))
    && settings.bindings.filter(b=>b.type === 'assets').length === 1
    && settings.bindings.find(b=>b.type === 'assets').name === 'ASSETS','POST_DEPLOY_BINDINGS');
  const vars = Object.fromEntries(settings.bindings.filter(b=>b.type === 'plain_text').map(b=>[b.name,b.text]));
  need(canonical(vars) === canonical(expectedVars),'POST_DEPLOY_VARS');
  const schedules = (await api('cf',`/workers/scripts/${FIXED.worker}/schedules`)).result?.schedules;
  need(Array.isArray(schedules) && schedules.length === 0,'UNEXPECTED_CRON');
  await identity();
  return {workerId:worker.id,worker:FIXED.worker,origin:pins.origin,intakeEnabled:false,syntheticOnly:true,actualQaVerified:false};
}
async function runCli(artifact,token,expiresAt) {
  const home = await mkdtemp(join(tmpdir(),'gemnao-qa-wrangler-'));
  try {
    execFileSync(process.execPath,[artifact.cli,'deploy','--config',artifact.configPath,'--no-bundle'],{
      cwd:artifact.app,timeout:Math.min(300000,Math.max(1,expiresAt-Date.now())),maxBuffer:1048576,stdio:['ignore','pipe','pipe'],
      env:{PATH:process.env.PATH,HOME:home,XDG_CONFIG_HOME:home,CI:'true',CLOUDFLARE_API_TOKEN:token,
        CLOUDFLARE_ACCOUNT_ID:TARGET.accountId,WRANGLER_SEND_METRICS:'false',WRANGLER_LOG:'error',WRANGLER_LOG_PATH:join(home,'wrangler.log')},
    });
  } catch { throw new Error('BLOCKED:WRANGLER_OUTCOME_UNKNOWN_NO_RERUN'); }
  finally { await rm(home,{recursive:true,force:true}); }
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    const env = process.env, mode = process.argv[2] ?? 'deploy';
    need(['gate','verify','deploy'].includes(mode) && process.argv.length <= 3,'INVOCATION');
    const pins = validatePins(JSON.parse(await readFile(new URL('pins.json',import.meta.url),'utf8')));
    validateContext(env,execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),mode === 'gate' ? 'gate' : 'deploy');
    const transport = credentialTransport({githubToken:()=>env.PREVIEW_GITHUB_TOKEN,cloudflareToken:()=>{
      need(mode === 'deploy','NO_CF_CREDENTIAL_HERE'); return env.GEMNAO_PREVIEW_CLOUDFLARE_API_TOKEN;
    }});
    if (mode === 'gate') {
      need(env.PREVIEW_OUTSIDE_RECORD_PRESENT === 'false' && env.PREVIEW_OUTSIDE_DIGEST_PRESENT === 'false'
        && env.PREVIEW_OUTSIDE_TOKEN_PRESENT === 'false','UNPROTECTED_SECRET');
      need(await verifyConfiguredEnvironment(transport) === FIXED.owner,'EXACT_OWNER');
      await appendFile(env.GITHUB_OUTPUT,`environment=${SETUP.environment}\nsource=${pins.sourceCommit}\n`);
      console.log(JSON.stringify({runId:env.GITHUB_RUN_ID,commit:env.GITHUB_SHA,pinsSha256:sha256(canonical(pins)),intakeEnabled:false}));
    } else {
      const record = validateRecord(env.PREVIEW_APPROVAL_RECORD,env.PREVIEW_APPROVAL_SHA256,env,pins);
      const artifactPins = {...pins,manifestSha256:record.artifact.manifestSha256,
        bundleSha256:record.artifact.bundleSha256,deploymentConfigSha256:record.artifact.deploymentConfigSha256};
      const artifact = await verifyArtifact(artifactPins,resolve('application')); 
      if (mode === 'deploy') {
        const api = createApi(transport);
        const inventory = await preflight({api,transport,record,pins});
        const claims = createArtifactClaims({client:await loadPinnedArtifactClient(),clientVersion:ARTIFACT_CLIENT_PIN.version,runId:record.runId});
        const payload = {runId:record.runId,planHash:PLAN_HASH,qaPinsSha256:record.pinsSha256,recordSha256:env.PREVIEW_APPROVAL_SHA256,instance:randomUUID()};
        const claim = async () => { const receipt = await claims.createExclusive(artifactClaimName(record.runId),payload);
          need(canonical((await claims.read(receipt.id)).payload) === canonical(payload),'CLAIM_READBACK'); };
        const expectedVars = deploymentConfig(JSON.parse(await readFile('application/wrangler.worker-preview.json','utf8')),pins.origin).vars;
        const result = await deployOnce({api,record,pins,claim,expectedVars,existingIds:inventory.map(x=>x.id),runWrangler:()=>runCli(artifact,env.GEMNAO_PREVIEW_CLOUDFLARE_API_TOKEN,record.expiresAt),
          reverify:()=>verifyArtifact(artifactPins),journal:entry=>console.log(JSON.stringify(entry))});
        console.log(JSON.stringify(result));
      } else console.log('Verified exact source, assets, compiled bundle and config before Cloudflare secret injection.');
    }
  } catch (error) {
    const code = /^BLOCKED:[A-Z0-9_]+$/.test(error.message ?? '') ? error.message : 'BLOCKED:UNCLASSIFIED';
    console.error(code); console.error('Do not rerun. Reconcile read-only and obtain a fresh exact-run approval.'); process.exitCode = 1;
  }
}
