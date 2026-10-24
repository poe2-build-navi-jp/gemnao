import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const code=readFileSync(new URL('./Code.js',import.meta.url),'utf8');
function fixture(){
 const values=new Map([['NOTIFY_READ_TOKEN','a'.repeat(64)],['OWNER_EMAIL','fixture@gmail.com'],['RECIPIENT_VERIFIED','true']]);
 const mails=[];let reads=0,throwSend=false,throwCheckpoint=false,status=200;
 let data={version:1,baseline:true,cursor:'b'.repeat(64),counts:{contact:0,discord_listing:0}};
 const context=vm.createContext({LockService:{getScriptLock:()=>({tryLock:()=>true,releaseLock(){}})},PropertiesService:{getScriptProperties:()=>({getProperty:k=>values.get(k)||null,setProperty(k,v){if(throwCheckpoint&&k==='LAST_CURSOR')throw Error('synthetic');values.set(k,v)},deleteProperty:k=>values.delete(k)})},UrlFetchApp:{fetch(url,o){reads++;assert.equal(url,'https://gemnao.pages.dev/api/private-inbox/notifications');assert.equal(o.followRedirects,false);return {getResponseCode:()=>status,getContentText:()=>JSON.stringify(data)}}},MailApp:{getRemainingDailyQuota:()=>1,sendEmail(...args){mails.push(args);if(throwSend)throw Error('synthetic')}}});
 vm.runInContext(code,context);
 return {values,mails,context,get reads(){return reads},set status(v){status=v},set data(v){data=v},set throwSend(v){throwSend=v},set throwCheckpoint(v){throwCheckpoint=v}};
}
let f=fixture();assert.equal(f.context.checkInboxNotifications(),'disabled');assert.equal(f.reads,0);
assert.equal(f.context.initializeInboxBaseline(),'baseline');assert.equal(f.mails.length,0);
assert.equal(f.context.initializeInboxBaseline(),'already-initialized');
f.values.set('NOTIFY_ENABLED','true');f.data={version:1,baseline:false,cursor:'c'.repeat(64),counts:{contact:2,discord_listing:1}};
assert.equal(f.context.checkInboxNotifications(),'mail-call-completed');assert.equal(f.mails.length,1);
assert.equal(f.mails[0][0],'fixture@gmail.com');assert.ok(!f.mails[0].join('').includes('c'.repeat(64)));
f.data={version:1,baseline:false,cursor:'c'.repeat(64),counts:{contact:0,discord_listing:0}};assert.equal(f.context.checkInboxNotifications(),'unchanged');assert.equal(f.mails.length,1);
for(const mode of ['throwSend','throwCheckpoint']){
 f=fixture();f.context.initializeInboxBaseline();f.values.set('NOTIFY_ENABLED','true');f.data={version:1,baseline:false,cursor:'c'.repeat(64),counts:{contact:1,discord_listing:0}};f[mode]=true;
 assert.equal(f.context.checkInboxNotifications(),'uncertain');assert.equal(f.mails.length,1);assert.equal(f.context.checkInboxNotifications(),'send-uncertain');assert.equal(f.mails.length,1);
}
f=fixture();f.values.delete('RECIPIENT_VERIFIED');assert.equal(f.context.initializeInboxBaseline(),'not-configured');assert.equal(f.reads,0);
f=fixture();f.data={version:1,baseline:true,cursor:'b'.repeat(64),counts:{contact:0,discord_listing:0},body:'PRIVATE'};assert.equal(f.context.initializeInboxBaseline(),'invalid-response');assert.equal(f.mails.length,0);
console.log('PASS synthetic runner: OFF, baseline, fixed private recipient, no cursor in email, checkpoint/dedup, uncertain send/checkpoint stop, unexpected payload rejection; no actual mail.');

f=fixture();f.values.set('NOTIFY_ENABLED','true');f.status=401;assert.equal(f.context.checkInboxNotifications(),'authorization-or-cursor-stopped');assert.equal(f.context.checkInboxNotifications(),'disabled');assert.equal(f.reads,1);
