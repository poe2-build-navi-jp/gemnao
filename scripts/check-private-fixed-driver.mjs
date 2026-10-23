// Local only. The deployed policy copy is exercised with a synthetic credential.
import assert from 'node:assert/strict';
import {readFile,mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createHash,randomBytes} from 'node:crypto';
import {createRequire} from 'node:module';
import {build} from 'esbuild';
const require=createRequire(import.meta.url);
const {Miniflare}=createRequire(require.resolve('wrangler/package.json'))('miniflare');
const code=await build({stdin:{contents:`import {wrapFiniteQaApplication} from './ops/private-diagnostic-qa/driver.mjs';export {FiniteQaBudget} from './ops/private-diagnostic-qa/budget.mjs';const app=wrapFiniteQaApplication({fetch(){return new Response(null,{status:404})}},'https://gemnao-diagnostic-qa.synthetic.workers.dev');export default{fetch(r,e,c){if(e.TEST_FAIL){const db=e.PRIVATE_DIAGNOSTIC_DB;e={...e,PRIVATE_DIAGNOSTIC_DB:{prepare(sql){if(sql.startsWith('INSERT OR IGNORE INTO private_diagnostic_reports'))throw Error('synthetic storage failure');return db.prepare(sql)},batch(q){return db.batch(q)}}};}return app.fetch(r,{...e,PRIVATE_QA_GUARD:e.BUDGET.get(e.BUDGET.idFromName('finite-private-qa-once-v1'))},c)}};`,resolveDir:process.cwd(),loader:'js'},bundle:true,write:false,platform:'browser',format:'esm',external:['node:crypto','node:net']});
const root=await mkdtemp(join(tmpdir(),'fixed-qa-'));
const origin='https://gemnao-diagnostic-qa.synthetic.workers.dev';
const token=randomBytes(32).toString('hex');
const now=Date.now();
const bindings={PRIVATE_QA_MODE:'finite-synthetic-v1',PRIVATE_QA_START:String(Math.floor(now/1000)),PRIVATE_QA_END:String(Math.floor(now/1000)+900),QA_PREVIEW_ORIGIN:origin,QA_ACCESS_SHA256:createHash('sha256').update(token).digest('hex'),QA_ACCESS_NOT_BEFORE:String(now),QA_ACCESS_EXPIRES_AT:String(now+900000)};
const options={modules:true,script:code.outputFiles[0].text,compatibilityDate:'2026-05-22',compatibilityFlags:['nodejs_compat'],durableObjects:{BUDGET:{className:'FiniteQaBudget',useSQLite:true}},d1Databases:['PRIVATE_DIAGNOSTIC_DB'],bindings};
const headers={authorization:'Basic '+Buffer.from('qa:'+token).toString('base64'),origin};
const tables=['reports','report_tombstones','retention_health','rate_salt','rate_attempts','notification_state'].map(t=>'private_diagnostic_'+t);
async function init(mf){const db=await mf.getD1Database('PRIVATE_DIAGNOSTIC_DB');for(const p of ['migrations/private-diagnostic/0001.sql','migrations/private-diagnostic/0002-notification-state.sql','migrations/diagnostic-feedback/0001.sql'])await db.exec((await readFile(p,'utf8')).replace(/--[^\n]*/g,'').replace(/\n/g,' '));await db.exec("INSERT INTO diagnostic_reports VALUES('legacy','hash','{}',1,1,2)");return db;}
let mf;
try{
 const opts={...options,durableObjectsPersist:join(root,'do'),d1Persist:join(root,'d1')};
 mf=new Miniflare(opts);let db=await init(mf);
 const call=(h=headers,extra={})=>mf.dispatchFetch(origin+'/api/private-qa/run',{method:'POST',headers:h,...extra});
 assert.equal((await call({origin})).status,401);
 assert.equal((await call({...headers,origin:'https://other.invalid'})).status,403);
 assert.equal((await call(headers,{body:'{}'})).status,400);
 const results=await Promise.all([call(),call(),call()]);
 assert.deepEqual(results.map(r=>r.status).sort((a,b)=>a-b),[200,503,503]);
 for(const t of tables)assert.equal(await db.prepare('SELECT count(*) n FROM '+t).first('n'),0,t);
 assert.equal(await db.prepare('SELECT receipt_id FROM diagnostic_reports').first('receipt_id'),'legacy');
 await mf.dispose();mf=new Miniflare(opts);db=await mf.getD1Database('PRIVATE_DIAGNOSTIC_DB');
 assert.equal((await call()).status,503);
 for(const t of tables)assert.equal(await db.prepare('SELECT count(*) n FROM '+t).first('n'),0);
 await mf.dispose();
 mf=new Miniflare(options);db=await init(mf);
 await db.exec('INSERT INTO private_diagnostic_retention_health VALUES(1,1)');
 assert.equal((await call()).status,503);
 assert.equal(await db.prepare('SELECT last_cleanup FROM private_diagnostic_retention_health').first('last_cleanup'),1);
 assert.equal((await call()).status,503);
 await mf.dispose();mf=new Miniflare({...options,bindings:{...bindings,TEST_FAIL:'true'}});db=await init(mf);
 assert.equal((await call()).status,503);
 const remaining=await db.prepare('SELECT count(*) n FROM private_diagnostic_rate_attempts').first('n');assert.ok(remaining>0);
 assert.equal((await call()).status,503);assert.equal(await db.prepare('SELECT count(*) n FROM private_diagnostic_rate_attempts').first('n'),remaining);
 assert.equal(await db.prepare('SELECT count(*) n FROM private_diagnostic_reports').first('n'),0);
 assert.equal(await db.prepare('SELECT receipt_id FROM diagnostic_reports').first('receipt_id'),'legacy');
 console.log('PASS fixed QA driver: existing authentication/CSRF, fixed bodyless route, single concurrent run, real intake/dedupe/admin/metadata/delete, targeted cleanup, empty namespace, legacy unchanged, persisted close, nonempty preflight stops without mutation, mid-run storage failure closes without retry and retains recovery evidence');
}finally{await mf?.dispose();await rm(root,{recursive:true,force:true});}
