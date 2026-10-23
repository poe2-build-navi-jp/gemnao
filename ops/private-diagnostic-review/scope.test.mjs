import test from 'node:test';
import assert from 'node:assert/strict';
import {account,database,databaseName,queries,getPaths,allowed,boundedScope,databaseSummary} from './scope.mjs';
test('only exact QA metadata endpoints and schema SQL; no payload or production reads',()=>{
 for(const p of getPaths) assert.equal(allowed(p,'GET'),true);
 const q=`/accounts/${account}/d1/database/${database}/query`;
 for(const sql of queries) assert.equal(allowed(q,'POST',JSON.stringify({sql})),true);
 for(const sql of ['SELECT * FROM diagnostic_reports;','SELECT count(*) FROM diagnostic_reports;','DELETE FROM diagnostic_reports;'])
  assert.equal(allowed(q,'POST',JSON.stringify({sql})),false);
 for(const p of [q+'?extra=1',`/accounts/${account}/pages/projects/gemnao`,q.replace(database,'f3379342-bb5e-461c-bad3-1175be8836c5')])
  assert.equal(allowed(p,'POST',JSON.stringify({sql:queries[0]})),false);
 assert.equal(allowed(getPaths[0],'GET','{}'),false);
 assert.equal(allowed(getPaths[0],'DELETE'),false);
});
test('one attempt per exact request, denied requests cannot broaden scope',()=>{
 const guard=boundedScope(); guard(getPaths[0],'GET');
 assert.throws(()=>guard(getPaths[0],'GET'));
 assert.throws(()=>guard('/anything','GET'));
});
test('allowlist projection drops provider fields; missing storage stays unknown',()=>{
 const input={uuid:database,name:databaseName,file_size:12345,report_json:'SYNTHETIC_DO_NOT_OUTPUT',token:'SYNTHETIC_DO_NOT_OUTPUT'};
 const result=databaseSummary(input);
 assert.equal(result.storageBytes,12345);assert.equal(result.reuseAuthorized,false);
 assert.equal(JSON.stringify(result).includes('SYNTHETIC_DO_NOT_OUTPUT'),false);
 assert.equal(databaseSummary({...input,file_size:undefined}).storageKnown,false);
 assert.throws(()=>databaseSummary({...input,uuid:'wrong'}));
});
