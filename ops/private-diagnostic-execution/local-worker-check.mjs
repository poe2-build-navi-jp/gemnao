// Local SQLite only; does not load any live config or credential.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash,randomBytes} from 'node:crypto';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {Miniflare}=createRequire(require.resolve('wrangler/package.json'))('miniflare');
const token=randomBytes(32).toString('hex'),start=Date.now(),origin='https://finite.synthetic.workers.dev';
const vars={PRIVATE_QA_MODE:'finite-synthetic-v1',PRIVATE_QA_START:String(Math.floor(start/1000)),PRIVATE_QA_END:String(Math.floor(start/1000)+900),QA_PREVIEW_ORIGIN:origin,QA_ACCESS_SHA256:createHash('sha256').update(token).digest('hex'),QA_ACCESS_NOT_BEFORE:String(start),QA_ACCESS_EXPIRES_AT:String(start+900000)};
const mf=new Miniflare({modules:true,script:await readFile(new URL('worker.mjs',import.meta.url),'utf8'),compatibilityDate:'2026-05-22',compatibilityFlags:['nodejs_compat'],durableObjects:{PRIVATE_QA_BUDGET:{className:'FiniteQaBudget',useSQLite:true}},d1Databases:['PRIVATE_DIAGNOSTIC_DB'],bindings:vars});
try{
 const db=await mf.getD1Database('PRIVATE_DIAGNOSTIC_DB');await db.exec((await readFile(new URL('migration.sql',import.meta.url),'utf8')).replace(/--[^\n]*/g,'').replace(/\n/g,' '));
 await db.exec("CREATE TABLE legacy_fixture(v TEXT); INSERT INTO legacy_fixture VALUES('unchanged');");
 const call=(headers={},body)=>mf.dispatchFetch(origin+'/api/private-qa/run',{method:'POST',headers,...(body===undefined?{}:{body})});
 assert.equal((await call()).status,403);
 assert.equal((await call({origin})).status,401);
 const headers={origin,authorization:'Basic '+Buffer.from('qa:'+token).toString('base64')};
 assert.equal((await call(headers,'{}')).status,400);
 assert.equal((await call({...headers,origin:'https://other.invalid'})).status,403);
 assert.equal((await mf.dispatchFetch(origin+'/api/private-diagnostic')).status,404);
 const results=await Promise.all([call(headers),call(headers)]);assert.deepEqual(results.map(r=>r.status).sort((a,b)=>a-b),[200,503]);
 for(const name of ['reports','report_tombstones','retention_health','rate_salt','rate_attempts','notification_state'])assert.equal(await db.prepare('SELECT count(*) n FROM private_diagnostic_'+name).first('n'),0);
 assert.equal(await db.prepare('SELECT v FROM legacy_fixture').first('v'),'unchanged');
 assert.equal((await call(headers)).status,503);
 console.log('PASS exact staged Worker bundle: authentication, CSRF, body refusal, one fixed lifecycle, targeted cleanup, legacy preserved, closed');
}finally{await mf.dispose();}
