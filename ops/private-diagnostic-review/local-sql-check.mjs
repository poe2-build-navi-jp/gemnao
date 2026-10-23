// Isolated local SQLite D1 and staged Worker. No provider API or live settings.
import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';import {execFileSync} from 'node:child_process';import {createRequire} from 'node:module';import {createHash,randomBytes} from 'node:crypto';
import {categories,schemaSql,countQueries} from './reconcile-scope.mjs';
const require=createRequire(import.meta.url),{Miniflare}=createRequire(require.resolve('wrangler/package.json'))('miniflare');
// SQLite's complete_statement preserves CREATE TRIGGER bodies and comment/newline semantics.
const statements=JSON.parse(execFileSync('python',['-c',`import sqlite3,json,pathlib
s=pathlib.Path('ops/private-diagnostic-execution/migration.sql').read_text();out=[];buf=''
for c in s:
 buf+=c
 if c==';' and sqlite3.complete_statement(buf):out.append(buf);buf=''
assert not buf.strip()
print(json.dumps(out))`],{encoding:'utf8'}));
const oldUnion=categories.map(n=>`SELECT '${n}' AS category,count(*) AS n FROM private_diagnostic_${n}`).join(' UNION ALL ')+';';
const token=randomBytes(32).toString('hex'),start=Date.now(),origin='https://synthetic.workers.dev';
const mf=new Miniflare({modules:true,script:await readFile('ops/private-diagnostic-execution/worker.mjs','utf8'),compatibilityDate:'2026-05-22',compatibilityFlags:['nodejs_compat'],durableObjects:{PRIVATE_QA_BUDGET:{className:'FiniteQaBudget',useSQLite:true}},d1Databases:['PRIVATE_DIAGNOSTIC_DB'],bindings:{PRIVATE_QA_MODE:'finite-synthetic-v1',PRIVATE_QA_START:String(Math.floor(start/1000)),PRIVATE_QA_END:String(Math.floor(start/1000)+900),QA_PREVIEW_ORIGIN:origin,QA_ACCESS_SHA256:createHash('sha256').update(token).digest('hex'),QA_ACCESS_NOT_BEFORE:String(start),QA_ACCESS_EXPIRES_AT:String(start+900000)}});
try{const db=await mf.getD1Database('PRIVATE_DIAGNOSTIC_DB');
 const result=await db.batch(statements.map(sql=>db.prepare(sql)));assert.equal(result.length,statements.length);assert.ok(result.every(r=>r.success));
 await assert.rejects(()=>db.prepare(oldUnion).all(),/too many terms in compound SELECT/);
 assert.equal((await db.prepare("SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5").all()).results.length,5);
 assert.equal((await db.prepare(schemaSql).all()).results.length,6);
 for(const sql of Object.values(countQueries))assert.equal(await db.prepare(sql).first('n'),0);
 // Synthetic missing-table scenario, NOT a claim about the remote DB.
 await db.prepare('DROP TABLE private_diagnostic_rate_attempts').run();
 await assert.rejects(()=>db.prepare(countQueries.rate_attempts).all(),/no such table/);
 const existing=(await db.prepare(schemaSql).all()).results;assert.equal(existing.length,5);
 for(const c of categories)if(existing.some(r=>r.name==='private_diagnostic_'+c))assert.equal(await db.prepare(countQueries[c]).first('n'),0);
 const r=await mf.dispatchFetch(origin+'/api/private-qa/run',{method:'POST',headers:{origin,authorization:'Basic '+Buffer.from('qa:'+token).toString('base64')}});assert.equal(r.status,503);
 assert.equal(await db.prepare('SELECT count(*) n FROM private_diagnostic_reports').first('n'),0);
 console.log(JSON.stringify({localOnly:true,rawMigrationStatements:statements.length,fullSchemaValid:true,sixTermUnionFailsWithCompleteSchema:true,fiveTermUnionPasses:true,missingTableReproducesCountFailureAndDriver503:true,schemaFirstReadsAvoidMissingTable:true}));
}finally{await mf.dispose();}
