import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('./Code.js',import.meta.url),'utf8');
function fixture(){
 const data={NOTIFY_ENABLED:'true',NOTIFY_READ_TOKEN:'a'.repeat(64)};let cursor=null,sends=0,fetches=0,fail=false,quota=10,status=200;
 const context=vm.createContext({LockService:{getScriptLock:()=>({tryLock:()=>true,releaseLock(){}})},PropertiesService:{getScriptProperties:()=>({getProperty:k=>data[k]??null,setProperty:(k,v)=>{data[k]=v;},setProperties:v=>Object.assign(data,v),deleteProperty:k=>delete data[k]})},UrlFetchApp:{fetch:(url,options)=>{fetches++;assert.equal(url,'https://synthetic.invalid/api/private-diagnostic/notifications');assert.equal(options.followRedirects,false);assert.equal(options.headers.Authorization,'Bearer '+data.NOTIFY_READ_TOKEN);return{getResponseCode:()=>status,getContentText:()=>JSON.stringify({version:1,cursor})};}},MailApp:{getRemainingDailyQuota:()=>quota,sendEmail:(to,subject,body)=>{sends++;assert.equal(to,'fixture@example.invalid');assert.equal(body,'新しい診断結果が届いた');if(fail)throw Error('synthetic-private-error');}}});
 vm.runInContext(source.replace('https://reviewed-host.invalid','https://synthetic.invalid').replace("const OWNER_EMAIL = 'owner@example.invalid'","const OWNER_EMAIL = 'fixture@example.invalid'").replace("OWNER_EMAIL.endsWith('.invalid')","false").replace("NOTIFICATION_ENDPOINT.includes('.invalid/')","false"),context);
 return {data,run:()=>context.checkPrivateDiagnostic(),setCursor:v=>cursor=v,setFail:v=>fail=v,setQuota:v=>quota=v,setStatus:v=>status=v,sends:()=>sends,fetches:()=>fetches};
}
test('default off does not read or send',()=>{const f=fixture();delete f.data.NOTIFY_ENABLED;assert.equal(f.run(),'disabled');assert.equal(f.fetches(),0);});
test('baseline, new receipt, duplicate, empty expiry and new receipt',()=>{const f=fixture();f.setCursor('b'.repeat(32));assert.equal(f.run(),'baseline');assert.equal(f.sends(),0);assert.equal(f.run(),'unchanged');f.setCursor('c'.repeat(32));assert.equal(f.run(),'mail-call-completed');assert.equal(f.run(),'unchanged');assert.equal(f.sends(),1);f.setCursor(null);assert.equal(f.run(),'empty');f.setCursor('d'.repeat(32));assert.equal(f.run(),'mail-call-completed');});
test('uncertain send holds intent and never automatically repeats',()=>{const f=fixture();f.run();f.setCursor('b'.repeat(32));f.setFail(true);assert.equal(f.run(),'uncertain');assert.equal(f.run(),'send-uncertain');assert.equal(f.sends(),1);});
test('quota and read denial leave cursor unacknowledged',()=>{const f=fixture();f.run();f.setCursor('c'.repeat(32));f.setQuota(0);assert.equal(f.run(),'quota-exhausted');assert.equal(f.data.LAST_CURSOR,'');f.setStatus(403);assert.equal(f.run(),'read-failed');assert.equal(f.sends(),0);});
test('manifest has send/external only; no Gmail read or trigger-management scope',()=>{const m=JSON.parse(readFileSync(new URL('./appsscript.json',import.meta.url),'utf8'));assert.deepEqual(m.oauthScopes,['https://www.googleapis.com/auth/script.send_mail','https://www.googleapis.com/auth/script.external_request']);});
