import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile } from 'node:fs/promises';
import { createPublicHealthWorker, PUBLIC_HEALTH_URL, CACHE_TTL_MS, READ_LIMIT_KEY, HEALTH_READS } from '../../cloudflare/retention-health.mjs';
import { PRODUCTION_HEALTH_TARGETS } from '../../ops/diagnosis-production/cleanup-health.mjs';
const start = Date.parse('2026-10-12T07:46:00Z');
function setup({ mutate = () => {}, cacheThrows = false, quota = 100 } = {}) {
  let clock = start; const calls = []; let hits = 0; let entry;
  const cache = {
    async match(key) { assert.equal(key.url,PUBLIC_HEALTH_URL);if(cacheThrows)throw Error('PRIVATE_CACHE_FAILURE');return entry?.clone(); },
    async put(key,response) {assert.equal(key.url,PUBLIC_HEALTH_URL);assert.equal(response.headers.get('cache-control'),'public, max-age=300');entry=response.clone();},
  };
  const env = { HEALTH_READ_LIMIT: { async limit(input) { assert.deepEqual(input,{key:READ_LIMIT_KEY});hits++;return {success:hits<=quota}; } } };
  for(const target of HEALTH_READS)env[target.binding]={prepare(sql){
    assert.equal(sql,target.sql);calls.push({feature:target.feature,sql});
    return {async all(){const result={success:true,results:target.feature==='sharing'
      ? [{value:String(target.firstScheduledAt),expires_at:target.firstScheduledAt+7_200_000}]
      : [{last_cleanup:target.firstScheduledAt/1000}],meta:{rows_written:0,changed_db:false}};
    mutate(target,result);return result;}};
  }};
  const worker=()=>createPublicHealthWorker({now:()=>clock,cache:()=>cache});
  const request=()=>new Request(PUBLIC_HEALTH_URL);
  return {env,worker,request,calls,hits:()=>hits,setTime:t=>{clock=t;},clear:()=>{entry=undefined;}};
}
await test('OFF intake still returns only two fixed feature names, success times and states using two SELECTs',async()=>{
  const f=setup();for(const flag of ['DIAGNOSIS_ENABLED','DIAGNOSIS_STORAGE_ENABLED','DIAGNOSIS_SHARING_ENABLED','FEEDBACK_ENABLED'])
    Object.defineProperty(f.env,flag,{get(){return assert.fail('monitor must not depend on intake flags');}});
  const response=await f.worker().fetch(f.request(),f.env);
  assert.equal(response.status,200);assert.equal(response.headers.get('cache-control'),'no-store');
  assert.equal(response.headers.get('set-cookie'),null);
  assert.deepEqual(await response.json(),{sharing:{lastSuccessAt:'2026-10-12T07:17:00.000Z',status:'ok'},feedback:{lastSuccessAt:'2026-10-12T07:43:00.000Z',status:'ok'}});
  assert.equal(f.calls.length,2);assert.equal(f.hits(),1);
});
await test('one hundred concurrent requests share one refresh and edge cache is reused across isolates',async()=>{
  const f=setup(),worker=f.worker();
  const responses=await Promise.all(Array.from({length:100},()=>worker.fetch(f.request(),f.env)));
  assert.ok(responses.every(r=>r.status===200));assert.equal(f.calls.length,2);assert.equal(f.hits(),1);
  await f.worker().fetch(f.request(),f.env);assert.equal(f.calls.length,2);assert.equal(f.hits(),1);
  f.setTime(start+CACHE_TTL_MS);
  await worker.fetch(f.request(),f.env);assert.equal(f.calls.length,4);assert.equal(f.hits(),2);
});
await test('paths, query strings, alternate hosts and methods cannot create cache keys or reach D1',async()=>{
  const f=setup(),worker=f.worker();
  for(const url of [PUBLIC_HEALTH_URL+'?x=1',PUBLIC_HEALTH_URL+'/other',PUBLIC_HEALTH_URL.replace('gemnao-retention-health.','other.')])
    assert.equal((await worker.fetch(new Request(url),f.env)).status,404);
  for(const method of ['POST','PUT','DELETE','HEAD'])assert.equal((await worker.fetch(new Request(PUBLIC_HEALTH_URL,{method}),f.env)).status,404);
  assert.equal(f.calls.length,0);assert.equal(f.hits(),0);
  for(const ip of ['192.0.2.1','192.0.2.2'])await worker.fetch(new Request(PUBLIC_HEALTH_URL,{headers:{'CF-Connecting-IP':ip,Cookie:'PRIVATE_COOKIE','Cache-Control':'no-cache',Authorization:'Bearer PRIVATE_TOKEN'}}),f.env);
  assert.equal(f.calls.length,2);assert.equal(f.hits(),1);
});
await test('missing or failed cache and missing, failed or denied limiter each stop before D1',async()=>{
  for(const limiter of [undefined,{async limit(){throw Error('PRIVATE_LIMIT_FAILURE');}},{async limit(){return {success:false};}}]){
    const f=setup();f.env.HEALTH_READ_LIMIT=limiter;
    const r=await f.worker().fetch(f.request(),f.env);assert.equal(r.status,503);assert.equal(f.calls.length,0);
    assert.deepEqual(await r.json(),{sharing:{lastSuccessAt:null,status:'unknown'},feedback:{lastSuccessAt:null,status:'unknown'}});
  }
  const noCache=setup();const missing=createPublicHealthWorker({now:()=>start,cache:()=>undefined});
  assert.equal((await missing.fetch(noCache.request(),noCache.env)).status,503);assert.equal(noCache.calls.length,0);
  const broken=setup({cacheThrows:true});await broken.worker().fetch(broken.request(),broken.env);assert.equal(broken.calls.length,0);
  const f=setup({quota:1});await f.worker().fetch(f.request(),f.env);f.clear();
  assert.equal((await f.worker().fetch(f.request(),f.env)).status,503);assert.equal(f.calls.length,2);
});
await test('malformed, private, future and write-marked results never enter public output',async()=>{
  for(const mutate of [(_t,r)=>{r.results[0].body='PRIVATE_ROW';},(_t,r)=>{r.meta.rows_written=1;},
    (_t,r)=>{r.meta.changed_db=true;},(_t,r)=>{r.results=[];},(_t,r)=>{r.results.push(r.results[0]);},
    (_t,_r)=>{throw Error('PRIVATE_PROVIDER_ERROR');},(t,r)=>{if(t.feature==='feedback')r.results[0].last_cleanup=start/1000+1;else r.results[0].expires_at=0;}]){
    const f=setup({mutate});const body=await (await f.worker().fetch(f.request(),f.env)).text();
    assert.ok(!body.includes('PRIVATE'));assert.deepEqual(JSON.parse(body),{sharing:{lastSuccessAt:null,status:'unknown'},feedback:{lastSuccessAt:null,status:'unknown'}});
    assert.equal(f.calls.length,2);
  }
});
await test('cached timestamps are re-evaluated against current time and stale values are never healthy',async()=>{
  const f=setup(),worker=f.worker();f.setTime(Date.parse('2026-10-12T08:46:00Z'));
  let r=await (await worker.fetch(f.request(),f.env)).json();assert.equal(r.sharing.status,'ok');
  f.setTime(Date.parse('2026-10-12T08:48:00Z'));
  r=await (await worker.fetch(f.request(),f.env)).json();assert.equal(r.sharing.status,'delayed');assert.equal(f.calls.length,2);
  f.setTime(Date.parse('2026-10-12T09:43:00Z'));
  r=await (await worker.fetch(f.request(),f.env)).json();assert.equal(r.sharing.status,'stale');assert.equal(r.feedback.status,'stale');
});
await test('public SELECTs match protected controller and proposal has only fixed bindings, no publication or cron',async()=>{
  for(const t of HEALTH_READS)assert.equal(t.sql,PRODUCTION_HEALTH_TARGETS.find(p=>p.feature===t.feature).sql);
  const c=JSON.parse(await readFile('cloudflare/wrangler.retention-health.proposal.json','utf8'));
  assert.equal(c.workers_dev,false);assert.equal(c.preview_urls,false);assert.equal(c.observability.enabled,false);assert.equal(c.logpush,false);
  assert.equal(c.triggers,undefined);assert.equal(c.routes,undefined);assert.equal(c.vars,undefined);
  assert.deepEqual(c.d1_databases.map(d=>d.database_id),PRODUCTION_HEALTH_TARGETS.map(t=>t.databaseId));
  assert.deepEqual(c.ratelimits,[{name:'HEALTH_READ_LIMIT',namespace_id:'2026101201',simple:{limit:1,period:60}}]);
});
