import test from 'node:test';
import assert from 'node:assert/strict';
import {readinessGuard,readinessQueries,settingsPath,queryPath,settingsSummary} from './readiness-scope.mjs';
test('only three fixed requests, once each, no payload, inventory or writes',()=>{
 const guard=readinessGuard(); guard(settingsPath,'GET');
 for(const sql of readinessQueries) guard(queryPath,'POST',JSON.stringify({sql}));
 assert.throws(()=>guard(settingsPath,'GET'));
 for(const sql of ['SELECT * FROM diagnostic_reports;','SELECT count(*) FROM diagnostic_reports;','DELETE FROM diagnostic_reports;'])
  assert.throws(()=>readinessGuard()(queryPath,'POST',JSON.stringify({sql})));
 assert.throws(()=>readinessGuard()(settingsPath+'?extra=1','GET'));
 assert.throws(()=>readinessGuard()(settingsPath,'PUT','{}'));
});
test('projection never accesses verifier or secret values; no quota inference',()=>{
 const forbidden={name:'QA_ACCESS_SHA256',type:'plain_text',get text(){throw new Error('secret accessed');}};
 const result=settingsSummary([forbidden,{name:'SECRET',type:'secret_text',get text(){throw new Error('secret accessed');}}],1791724477299);
 assert.equal(result.bindingsMatch,false);assert.equal(result.gateWindowActive,false);
 assert.equal(result.accountQuotaKnown,false);assert.equal(result.receiptActivationAuthorized,false);
 assert.equal(JSON.stringify(result).includes('SHA256'),false);
});
test('exact expected bindings and bounded gate, expired window fails closed',()=>{
 const now=1791724477299;
 const bindings=[{type:'d1',name:'DIAGNOSIS_DB',id:'72c728f5-1656-4e26-bc11-7c508ae155c3'},
 {type:'d1',name:'FEEDBACK_DB',id:'3a714aee-e602-4590-afd0-3c2ddd9aea8f'},
 {type:'plain_text',name:'QA_ACCESS_NOT_BEFORE',text:String(now)},
 {type:'plain_text',name:'QA_ACCESS_EXPIRES_AT',text:String(now+3600000)}];
 assert.equal(settingsSummary(bindings,now).bindingsMatch,true);
 assert.equal(settingsSummary(bindings,now).gateWindowActive,true);
 assert.equal(settingsSummary(bindings,now+3600000).gateWindowActive,false);
 assert.equal(settingsSummary([...bindings,bindings[0]],now).bindingsMatch,false);
});
