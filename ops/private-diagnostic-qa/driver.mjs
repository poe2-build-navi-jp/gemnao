// Candidate: all requests/fixtures are fixed here, never taken from incoming HTTP.
import {handlePrivateDiagnostic} from '../../lib/private-diagnostic/service';
import {handlePrivateAdmin} from '../../lib/private-diagnostic/admin';
import {handleNotificationMetadata} from '../../lib/private-diagnostic/notifications';
import cleanup from '../../cloudflare/private-diagnostic-cleanup';
import fixture from './fixture.json';
import {runFiniteQaStep} from './budget.mjs';
import {wrapQaAccess} from './existing-qa-policy.mjs';
const tables=['reports','report_tombstones','retention_health','rate_salt','rate_attempts','notification_state'].map(n=>'private_diagnostic_'+n);
const origin='https://synthetic.invalid';
const digest=async s=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s))),v=>v.toString(16).padStart(2,'0')).join('');
const need=ok=>{if(!ok)throw Error('QA_STOPPED');};
const response=(ok,status)=>new Response(JSON.stringify({ok}),{status,headers:{'Content-Type':'application/json','Cache-Control':'private, no-store'}});
export async function runFixedQa(env) {
 let claimed=false;
 const guard=path=>env.PRIVATE_QA_GUARD.fetch(new Request('https://qa-budget.invalid/'+path,{method:'POST'}));
 const step=(kind,fn)=>runFiniteQaStep(env,kind,async()=>true,()=>fn(env.PRIVATE_DIAGNOSTIC_DB));
 try {
  need(env.PRIVATE_QA_MODE==='finite-synthetic-v1'&&env.PRIVATE_QA_GUARD&&env.PRIVATE_DIAGNOSTIC_DB);
  need((await guard('claim')).status===204);claimed=true;
  // Fail before ANY mutation when private data already exists. No legacy SELECT.
  await step('admin',async db=>{for(const t of tables)need(await db.prepare('SELECT count(*) n FROM '+t).first('n')===0);});
  const now=Math.floor(Date.now()/1000), key='1'.repeat(64), hash=await digest(key);
  const envelope={receipt_id:now.toString(16).padStart(8,'0')+hash.slice(0,24),delete_key:key,consent_version:1,report:fixture};
  const runtime=db=>({PRIVATE_DIAGNOSTIC_DB:db,PRIVATE_DIAGNOSTIC_ENABLED:'true',PRIVATE_DIAGNOSTIC_OWNER_REVIEW_ENABLED:'true'});
  const request=(method,value)=>new Request(origin+'/api/private-diagnostic',{method,headers:{origin,'content-type':'application/json','cf-connecting-ip':'192.0.2.1'},...(value===undefined?{}:{body:JSON.stringify(value)})});
  await step('cleanup',db=>cleanup.scheduled({},runtime(db)));
  await step('general',async db=>need((await handlePrivateDiagnostic(request('POST',{}),runtime(db))).status===400));
  await step('general',async db=>need([200,201].includes((await handlePrivateDiagnostic(request('POST',envelope),runtime(db))).status)));
  await step('general',async db=>need((await handlePrivateDiagnostic(request('POST',envelope),runtime(db))).status===200));
  await step('admin',async db=>{const r=await handlePrivateAdmin(new Request(origin+'/admin'),runtime(db),async()=>true);need(r.status===200&&(await r.json()).items.length===1);});
  await step('admin',async db=>{const r=await handlePrivateAdmin(new Request(origin+'/admin?id='+envelope.receipt_id),runtime(db),async()=>true);need(r.status===200&&(await r.json()).report.kind==='private-diagnostic');});
  // Fixed public test string, NEVER an operational notification credential; no mail.
  await step('notification',async db=>{const token='2'.repeat(64);const r=await handleNotificationMetadata(new Request(origin+'/notification',{headers:{authorization:'Bearer '+token}}),{PRIVATE_DIAGNOSTIC_DB:db,PRIVATE_DIAGNOSTIC_NOTIFY_ENABLED:'true',PRIVATE_DIAGNOSTIC_NOTIFY_TOKEN_SHA256:await digest(token)});need(r.status===200&&!!(await r.json()).cursor);});
  const deletion={receipt_id:envelope.receipt_id,delete_key:key};
  await step('deletion',async db=>need((await handlePrivateDiagnostic(request('DELETE',deletion),runtime(db))).status===200));
  await step('deletion',async db=>need((await handlePrivateDiagnostic(request('DELETE',deletion),runtime(db))).status===200));
  await step('general',async db=>need((await handlePrivateDiagnostic(request('POST',envelope),runtime(db))).status===409));
  // Targeted cleanup: snapshot only bounded private rows; delete by ALL column values.
  // Any unexpected shape/row count stops; no whole-table or legacy deletion.
  await step('cleanup',async db=>{
   const caps=[0,1,1,1,6,1], snapshots=[];
   for(let i=0;i<tables.length;i++){const rows=(await db.prepare('SELECT * FROM '+tables[i]+' LIMIT '+(caps[i]+1)).all()).results;need(rows.length<=caps[i]);snapshots.push(rows);}
   need(snapshots[1].every(r=>r.receipt_id===envelope.receipt_id&&r.delete_hash===hash));
   need(snapshots[2].every(r=>r.last_cleanup===now||Math.abs(r.last_cleanup-now)<=2));
   need(snapshots[3].length===1);
   const salt=snapshots[3][0];need(salt.singleton===1&&salt.day===Math.floor(now/86400));
   const hmac=await crypto.subtle.importKey('raw',new TextEncoder().encode(salt.salt),{name:'HMAC',hash:'SHA-256'},false,['sign']);
   const expected={};for(const bucket of ['intake','delete'])expected[bucket]=Array.from(new Uint8Array(await crypto.subtle.sign('HMAC',hmac,new TextEncoder().encode(`private-diagnostic-v1:${salt.day}:${bucket}:v4:192.0.2.1`))),v=>v.toString(16).padStart(2,'0')).join('');
   need(snapshots[4].every(r=>r.network_hash===expected[r.bucket]&&r.created_at>=now&&r.created_at<=now+900));
   need(snapshots[5].every(r=>r.singleton===1&&r.expires_at>=now+30*86400&&r.expires_at<=now+30*86400+900));

   for(let i=0;i<tables.length;i++)for(const row of snapshots[i]){
    const cols=Object.keys(row);need(cols.every(c=>/^[a-z_]+$/.test(c)));
    await db.prepare('DELETE FROM '+tables[i]+' WHERE '+cols.map(c=>c+' IS ?').join(' AND ')).bind(...cols.map(c=>row[c])).run();
   }
  });
  await step('admin',async db=>{for(const t of tables)need(await db.prepare('SELECT count(*) n FROM '+t).first('n')===0);});
  need((await guard('close')).status===204);claimed=false;
  return response(true,200);
 }catch{return response(false,503);}
 finally{if(claimed)await guard('close').catch(()=>{});}
}
// Insert in place of the existing outer wrapQaAccess call. Same gate unchanged.
export function wrapFiniteQaApplication(application,approvedOrigin) {
 return wrapQaAccess({async fetch(request,env,ctx){
  const u=new URL(request.url);
  if(u.pathname!=='/api/private-qa/run')return application.fetch(request,env,ctx);
  if(request.method!=='POST'||u.search)return response(false,400);
  if(request.body){const reader=request.body.getReader();const part=await reader.read();await reader.cancel();if(!part.done)return response(false,400);}
  return runFixedQa(env);
 }},approvedOrigin);
}
