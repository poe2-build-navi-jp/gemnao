import test from 'node:test';
import assert from 'node:assert/strict';
import {createReceiptSignal} from './relay-policy.mjs';
test('off by default and only literal true enables; no provider call',async()=>{
 for(const enabled of [undefined,false,'true',1]) {
  const notify=createReceiptSignal({enabled,sendFixedSignal:()=>assert.fail('called')});
  assert.deepEqual(await notify({kind:'new-receipt-committed'}),{status:'disabled'});
 }
});
test('only committed-new event; no extra report/person/id/content accepted',async()=>{
 const notify=createReceiptSignal({enabled:true,sendFixedSignal:()=>assert.fail('called')});
 for(const event of [null,[],{}, {kind:'retry'}, {kind:'new-receipt-committed',receiptId:'synthetic'},
  {kind:'new-receipt-committed',report:'synthetic'}, {kind:'new-receipt-committed',to:'synthetic@example.invalid'}])
   assert.deepEqual(await notify(event),{status:'invalid-event'});
});
test('fixed signal only; provider acceptance is not delivery',async()=>{
 let calls=0;
 const notify=createReceiptSignal({enabled:true,sendFixedSignal:async message=>{
  calls++;assert.deepEqual(Object.keys(message).sort(),['subject','text']);
  assert.equal(message.text,'新しい診断結果が届いた');
  assert.ok(Object.isFrozen(message));return 'accepted';
 }});
 assert.deepEqual(await notify({kind:'new-receipt-committed'}),{status:'provider-accepted'});assert.equal(calls,1);
});
test('missing provider, rejection and uncertainty remain separate; no retry/error leak',async()=>{
 assert.deepEqual(await createReceiptSignal({enabled:true})({kind:'new-receipt-committed'}),{status:'not-configured'});
 for(const behavior of ['rejected','unknown','throw']){
  let calls=0;const notify=createReceiptSignal({enabled:true,sendFixedSignal:async()=>{calls++;if(behavior==='throw')throw new Error('SYNTHETIC_SECRET');return behavior;}});
  assert.deepEqual(await notify({kind:'new-receipt-committed'}),{status:behavior==='rejected'?'rejected':'uncertain'});assert.equal(calls,1);
 }
});
