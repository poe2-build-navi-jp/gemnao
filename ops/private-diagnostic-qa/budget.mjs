// Candidate only. Dedicated QA namespace; never bind to a production guard.
export const limits = Object.freeze({ general:12, deletion:8, admin:8, notification:4, cleanup:4 });
const mode = 'finite-synthetic-v1';
const deny = () => new Response(null,{status:503});
export class FiniteQaBudget {
  constructor(state,env,clock=()=>Math.floor(Date.now()/1000)) {this.state=state;this.env=env;this.clock=clock;}
  async fetch(request) {
    try {
      if(request.method!=='POST' || new URL(request.url).search) return deny();
      const path=new URL(request.url).pathname;
      if(!['/admit','/close','/claim'].includes(path)) return deny();
      if(this.env.PRIVATE_QA_MODE!==mode) return deny();
      const start=Number(this.env.PRIVATE_QA_START),end=Number(this.env.PRIVATE_QA_END),now=this.clock();
      if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||!Number.isSafeInteger(now)||start<=0||end<=start||end-start>900) return deny();
      const kind=request.headers.get('x-qa-kind');
      if(path==='/admit'&&!Object.hasOwn(limits,kind)) return deny();
      return await this.state.storage.transaction(async store=>{
        let saved=await store.get('finite-qa-v1');
        if(saved && (!valid(saved)||saved.start!==start||saved.end!==end||saved.closed||now<saved.last)) return deny();
        if(!saved) saved={start,end,last:start,closed:false,used:Object.fromEntries(Object.keys(limits).map(k=>[k,0]))};
        if(path==='/close'||now>=end){saved.closed=true;saved.last=Math.max(now,saved.last);await store.put('finite-qa-v1',saved);return path==='/close'?new Response(null,{status:204}):deny();}
        if(now<start) return deny();
        if(path==='/claim'){if(saved.claimed)return deny();saved.claimed=true;saved.last=now;await store.put('finite-qa-v1',saved);return new Response(null,{status:204});}
        if(saved.used[kind]>=limits[kind]) return new Response(null,{status:429});
        saved.used[kind]++;saved.last=now;
        await store.put('finite-qa-v1',saved); // Consume before any D1; never refund.
        return new Response(null,{status:204});
      });
    } catch {return deny();}
  }
}
function valid(s) {
  return Number.isSafeInteger(s.start)&&Number.isSafeInteger(s.end)&&s.end>s.start&&s.end-s.start<=900
    &&Number.isSafeInteger(s.last)&&s.last>=s.start&&typeof s.closed==='boolean'
    &&(s.claimed===undefined||typeof s.claimed==='boolean')
    &&s.used&&Object.keys(s.used).length===Object.keys(limits).length
    &&Object.entries(limits).every(([k,n])=>Number.isSafeInteger(s.used[k])&&s.used[k]>=0&&s.used[k]<=n);
}
// The driver must supply reviewed, fixed synthetic fixtures, never HTTP-supplied reports.
export async function runFiniteQaStep(env,kind,authorize,syntheticOperation) {
  if(env.PRIVATE_QA_MODE!==mode||!env.PRIVATE_QA_GUARD||!Object.hasOwn(limits,kind)||!await authorize().catch(()=>false)) throw Error('QA_CLOSED');
  const r=await env.PRIVATE_QA_GUARD.fetch(new Request('https://qa-budget.invalid/admit',{method:'POST',headers:{'x-qa-kind':kind}}));
  if(r.status!==204) throw Error('QA_CLOSED');
  return syntheticOperation(); // All handler/rate/health/D1 work belongs inside this callback.
}
