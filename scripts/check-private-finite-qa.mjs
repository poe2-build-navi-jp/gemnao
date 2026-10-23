// Isolated local Workers/SQLite only; no remote config or credentials.
import assert from 'node:assert/strict';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createRequire} from 'node:module';
import {build} from 'esbuild';
const require=createRequire(import.meta.url);
const {Miniflare}=createRequire(require.resolve('wrangler/package.json'))('miniflare');
const path=await mkdtemp(join(tmpdir(),'finite-private-qa-'));
const b=await build({stdin:{contents:`import {FiniteQaBudget,runFiniteQaStep} from './ops/private-diagnostic-qa/budget.mjs';export {FiniteQaBudget};export default {async fetch(r,e){const guard=e.BUDGET.get(e.BUDGET.idFromName('synthetic'));if(new URL(r.url).pathname==='/close')return guard.fetch(new Request('https://test.invalid/close',{method:'POST'}));try{return await runFiniteQaStep({...e,PRIVATE_QA_GUARD:guard},'general',async()=>true,async()=>{await e.TEST_DB.prepare('INSERT INTO calls(v) VALUES(1)').run();if(r.headers.has('x-fail'))throw Error('synthetic');return new Response(null,{status:204});});}catch{return new Response(null,{status:503});}}};`,resolveDir:process.cwd(),loader:'js'},bundle:true,write:false,platform:'browser',format:'esm'});
const now=Math.floor(Date.now()/1000);
const options={modules:true,script:b.outputFiles[0].text,compatibilityDate:'2026-05-22',durableObjects:{BUDGET:{className:'FiniteQaBudget',useSQLite:true}},durableObjectsPersist:join(path,'do'),d1Databases:['TEST_DB'],d1Persist:join(path,'d1'),bindings:{PRIVATE_QA_MODE:'finite-synthetic-v1',PRIVATE_QA_START:String(now),PRIVATE_QA_END:String(now+900)}};
let mf=new Miniflare(options);
try{
 let db=await mf.getD1Database('TEST_DB');await db.exec('CREATE TABLE calls(v INTEGER); CREATE TABLE legacy(v TEXT); INSERT INTO legacy VALUES(\'unchanged\');');
 const responses=await Promise.all(Array.from({length:40},(_,i)=>mf.dispatchFetch('https://synthetic.invalid/',{headers:i===0?{'x-fail':'1'}:{}})));
 assert.ok(responses.filter(r=>r.status===204).length<=12);
 assert.equal(await db.prepare('SELECT count(*) n FROM calls').first('n'),12);
 await mf.dispose();mf=new Miniflare(options);db=await mf.getD1Database('TEST_DB');
 assert.equal((await mf.dispatchFetch('https://synthetic.invalid/')).status,503);
 assert.equal(await db.prepare('SELECT count(*) n FROM calls').first('n'),12);
 assert.equal(await db.prepare('SELECT v FROM legacy').first('v'),'unchanged');
 assert.equal((await mf.dispatchFetch('https://synthetic.invalid/close')).status,204);
 assert.equal((await mf.dispatchFetch('https://synthetic.invalid/')).status,503);
 console.log('PASS actual local SQLite Durable Object: 40 concurrent attempts, 12 D1 admissions including failure, persistent cap across runtime restart, legacy untouched, closed state');
}finally{await mf.dispose();await rm(path,{recursive:true,force:true});}
