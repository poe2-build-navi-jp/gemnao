import test from 'node:test';
import assert from 'node:assert/strict';
import {FiniteQaBudget,runFiniteQaStep,limits} from './budget.mjs';
function fixture(){
 let data,queue=Promise.resolve(),now=1000,fail=false;
 const store={get:async()=>structuredClone(data),put:async(_k,v)=>{if(fail)throw Error('synthetic');data=structuredClone(v);}};
 const state={storage:{transaction(fn){const p=queue.then(()=>fn(store));queue=p.catch(()=>{});return p;}}};
 const env={PRIVATE_QA_MODE:'finite-synthetic-v1',PRIVATE_QA_START:'1000',PRIVATE_QA_END:'1900'};
 let guard=new FiniteQaBudget(state,env,()=>now);env.PRIVATE_QA_GUARD={fetch:r=>guard.fetch(r)};
 const call=(kind='general')=>guard.fetch(new Request('https://test.invalid/admit',{method:'POST',headers:{'x-qa-kind':kind}}));
 return {env,call,state,get:()=>data,set:v=>data=v,clock:v=>now=v,fail:()=>fail=true,restart:()=>guard=new FiniteQaBudget(state,env,()=>now),close:()=>guard.fetch(new Request('https://test.invalid/close',{method:'POST'}))};
}
test('concurrent cap persists through object recreation; rejects never enter D1',async()=>{
 const f=fixture();let d1=0;
 const a=await Promise.allSettled(Array.from({length:40},()=>runFiniteQaStep(f.env,'general',async()=>true,async()=>++d1)));
 assert.equal(a.filter(x=>x.status==='fulfilled').length,12);assert.equal(d1,12);
 f.restart();await assert.rejects(runFiniteQaStep(f.env,'general',async()=>true,async()=>++d1));assert.equal(d1,12);
});
test('failures and retries consume, independent deletion/cleanup stay available',async()=>{
 const f=fixture();for(let i=0;i<12;i++)await assert.rejects(runFiniteQaStep(f.env,'general',async()=>true,async()=>{throw Error('synthetic invalid input or DB failure');}));
 assert.equal((await f.call()).status,429);
 for(const k of ['deletion','admin','notification','cleanup']){for(let i=0;i<limits[k];i++)assert.equal((await f.call(k)).status,204);assert.equal((await f.call(k)).status,429);}
});
test('before start, expiry, clock rollback and config extension fail closed',async()=>{
 const f=fixture();f.clock(999);assert.equal((await f.call()).status,503);f.clock(1001);assert.equal((await f.call()).status,204);
 f.clock(1000);assert.equal((await f.call()).status,503);f.clock(1900);assert.equal((await f.call()).status,503);assert.equal(f.get().closed,true);
 f.env.PRIVATE_QA_END='2000';assert.equal((await f.call()).status,503);
});
test('close is persistent, even before the first request; no reset endpoint',async()=>{
 const f=fixture();assert.equal((await f.close()).status,204);f.restart();assert.equal((await f.call()).status,503);
});
test('missing mode/auth/binding, corrupt state and storage failure never run operation',async()=>{
 const no=async()=>assert.fail('D1 called');const f=fixture();
 await assert.rejects(runFiniteQaStep({...f.env,PRIVATE_QA_MODE:undefined},'general',async()=>true,no));
 await assert.rejects(runFiniteQaStep(f.env,'general',async()=>false,no));
 await assert.rejects(runFiniteQaStep({...f.env,PRIVATE_QA_GUARD:undefined},'general',async()=>true,no));
 f.set({used:{general:0}});assert.equal((await f.call()).status,503);f.set(undefined);f.fail();await assert.rejects(runFiniteQaStep(f.env,'general',async()=>true,no));
});
