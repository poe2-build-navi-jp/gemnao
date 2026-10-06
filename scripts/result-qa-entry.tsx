import React from 'react';
import { createRoot } from 'react-dom/client';
import { InteractiveSteps } from '../components/interactive-steps';
import { StepResultCollection, StepResultButtons } from '../components/step-result-collection';

// This file is preview-only test infrastructure, never production source.
const preview = /^[a-z0-9-]+\.gemnao\.pages\.dev$/.test(location.hostname);
if (!preview) throw Error('QA harness disabled outside a Gemnao preview host');
const key='gemnao-result-qa-synthetic-v1';
let fixture = JSON.parse(sessionStorage.getItem(key) || '{"storage":{},"receipts":{}}');
const save=()=>sessionStorage.setItem(key,JSON.stringify(fixture));
const storage={getItem:(name)=>fixture.storage[name]??null,setItem:(name,value)=>{fixture.storage[name]=String(value);save();},removeItem:(name)=>{delete fixture.storage[name];save();},clear:()=>{fixture.storage={};save();},key:i=>Object.keys(fixture.storage)[i]??null,get length(){return Object.keys(fixture.storage).length;}};
Object.defineProperty(window,'localStorage',{value:storage,configurable:true});
window.gtag=()=>{throw Error('Analytics is disabled in QA');};
let getMode='ready',postMode='success',getHeld=[],postHeld=[],requests=[],sequence=0;
const log=(event)=>{requests.push({n:++sequence,event});document.getElementById('requests').textContent=JSON.stringify({mode:{get:getMode,post:postMode},answers:Object.keys(fixture.receipts).length,postRequests:requests.filter(x=>x.event.startsWith('POST')).length,events:requests.slice(-12)},null,2);};
const snapshot=()=>{const answers=Object.values(fixture.receipts);const solved=answers.filter(a=>a.outcome==='resolved').length;const struggling=answers.filter(a=>a.reportStruggling).length;return {stepResultsAvailable:true,rows:[{topic:'display',resolved:3+solved,struggling:1+struggling}],methods:[{methodId:'step-1',methodLabel:'Synthetic step one',responses:2+answers.filter(a=>a.method==='step-1'&&a.outcome==='resolved').length,notResolved:3+answers.filter(a=>a.method==='step-1'&&a.outcome==='not-resolved').length},{methodId:'step-2',methodLabel:'Synthetic step two',responses:1+answers.filter(a=>a.method==='step-2'&&a.outcome==='resolved').length,notResolved:1+answers.filter(a=>a.method==='step-2'&&a.outcome==='not-resolved').length}]};};
const ack=(body)=>{fixture.receipts[body.requestId||'legacy-'+sequence]=body;save();log('Mock acknowledgement');return Response.json({ok:true});};
window.fetch=async(input,init={})=>{
 const url=new URL(typeof input==='string'?input:input.url,location.href);
 if(url.pathname!=='/api/feedback')throw Error('Blocked unexpected request: '+url.pathname);
 if((init.method||'GET')==='GET'){
  log('GET capability');if(getMode==='loading')return new Promise((resolve,reject)=>{getHeld.push(resolve);init.signal?.addEventListener('abort',()=>reject(new DOMException('aborted','AbortError')));});
  return getMode==='unavailable'?Response.json({error:'fixture unavailable'},{status:503}):Response.json(snapshot());
 }
 const body=JSON.parse(init.body||'{}');log('POST '+body.method+' '+body.outcome+' '+body.requestId);
 if(postMode==='hold')return new Promise((resolve,reject)=>postHeld.push({body,resolve,reject}));
 if(postMode==='offline')throw Error('Fixture offline');
 const response=ack(body);if(postMode==='lost')throw Error('Fixture response lost after commit');return response;
};
document.addEventListener('click',event=>{const a=event.target.closest?.('a');if(a&&new URL(a.href,location.href).origin!==location.origin){event.preventDefault();log('Blocked external navigation');}});
const locale=new URLSearchParams(location.search).get('locale')||'ja';
const steps=[{id:'step-1',title:locale==='ja'?'表示設定を一つ変えて確認する':'Change one display setting',actions:[locale==='ja'?'これは架空のQA手順です。実際の設定は変更しません。':'Synthetic QA instructions. Do not change real settings.']},{id:'step-2',title:locale==='ja'?'同じ場面で比較する':'Compare the same scene',actions:[locale==='ja'?'架空の結果を報告して動作を確認します。':'Report a synthetic result to test the controls.']}];
const props={contextSlug:'guide-low-fps',topic:'display',articleTitle:'QA synthetic symptom',articlePath:'/guide/low-fps',steps};
function Fixture(){const [mounted,setMounted]=React.useState(true);return <>
 <section style={{padding:12,background:'#eef4f8',border:'1px solid #879bab'}}>
  <strong>Preview-only mock QA · {locale}</strong>
  <p>All displayed counts are synthetic fixtures. No real API requests, analytics or private browser storage. The actual feature components run below.</p>
  <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
   <label>GET <select defaultValue="ready" onChange={e=>{getMode=e.target.value;log('GET mode '+getMode);}}><option>ready</option><option>loading</option><option>unavailable</option></select></label>
   <label>POST <select defaultValue="success" onChange={e=>{postMode=e.target.value;log('POST mode '+postMode);}}><option>success</option><option>offline</option><option>lost</option><option>hold</option></select></label>
   <button onClick={()=>{setMounted(false);setTimeout(()=>setMounted(true),50);}}>Remount controls</button>
   <button onClick={()=>{getMode='ready';getHeld.splice(0).forEach(resolve=>resolve(Response.json(snapshot())));log('Released GET');}}>Release GET</button>
   <button onClick={()=>{postHeld.splice(0).forEach(item=>item.reject(Error('Fixture held failure')));log('Failed held POST');}}>Fail held POST</button>
   <button onClick={()=>{postHeld.splice(0).forEach(item=>item.resolve(ack(item.body)));log('Completed held POST');}}>Complete held POST</button>
   <button onClick={()=>location.reload()}>Reload (keep fixture data)</button>
   <button onClick={()=>{sessionStorage.removeItem(key);location.reload();}}>Reset synthetic data</button>
  </div>
  <details><summary>QA steps and request log</summary><ol>
   <li>Choose GET loading, Remount, then Release GET. No POST should appear from loading state.</li>
   <li>Choose POST lost, report one result, choose success, retry. Answer count stays one while POST count increases.</li>
   <li>Japanese: choose POST hold, click fixed, save the offered private note, then Fail held POST. Recover the original answer after choosing success. Reload preserves only fixture data.</li>
   <li>Switch language or width in the outer toolbar. Test Tab/Enter and read the overflow measurements.</li>
  </ol><pre id="requests" style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere'}}></pre></details>
 </section>
 {mounted&&(locale==='ja'?<InteractiveSteps {...props}/>:<StepResultCollection key={locale} contextSlug={props.contextSlug} topic={props.topic} locale={locale} steps={steps}>{steps.map(step=><section className="pc-step" key={step.id} id={step.id}><h2>{step.title}</h2><p>{step.actions[0]}</p><StepResultButtons method={step.id}/></section>)}</StepResultCollection>)}
 </>}
createRoot(document.getElementById('root')).render(<Fixture/>);
