import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { qaAccessWindow, qaAccessVerifier, wrapQaAccess, wrapPreviewApplication } from '../../cloudflare/worker-preview-policy.mjs';

const origin = 'https://gemnao-diagnostic-qa.synthetic-test.workers.dev';
const time = 1791471600000;
const token = 'SYNTHETIC_TEST_FIXTURE_NOT_A_REAL_PASSWORD_0001';
const other = 'SYNTHETIC_TEST_FIXTURE_NOT_A_REAL_PASSWORD_0002';
const env = { QA_PREVIEW_ORIGIN: origin, QA_ACCESS_SHA256: await qaAccessVerifier(token),
  QA_ACCESS_NOT_BEFORE: String(time), QA_ACCESS_EXPIRES_AT: String(time + 3600000),
  DIAGNOSIS_ENABLED: 'false', DIAGNOSIS_STORAGE_ENABLED: 'false', DIAGNOSIS_SHARING_ENABLED: 'false',
  DIAGNOSIS_WRITES_ENABLED: 'false', DIAGNOSIS_METRICS_ENABLED: 'false', FEEDBACK_ENABLED: 'false' };
const auth = value => 'Basic ' + btoa('qa:' + value);
const request = (path='/diagnose', value=token, options={}) => new Request(origin + path, {
  ...options, headers: { ...(value === null ? {} : { Authorization: auth(value) }), ...options.headers },
});

test('missing, malformed, future, reversed, oversized and expired windows fail closed', async () => {
  let calls = 0;
  const worker = wrapQaAccess({ fetch() { calls++; return new Response('SECRET'); } }, origin, () => time);
  for (const changes of [
    {QA_ACCESS_SHA256:undefined}, {QA_ACCESS_SHA256:'x'.repeat(64)}, {QA_ACCESS_SHA256:'A'.repeat(64)},
    {QA_ACCESS_NOT_BEFORE:undefined}, {QA_ACCESS_NOT_BEFORE:String(time+1)}, {QA_ACCESS_NOT_BEFORE:'NaN'},
    {QA_ACCESS_EXPIRES_AT:String(time)}, {QA_ACCESS_EXPIRES_AT:String(time-1)},
    {QA_ACCESS_EXPIRES_AT:String(time+3600001)}, {QA_ACCESS_EXPIRES_AT:'Infinity'},
  ]) {
    const r = await worker.fetch(request(), {...env,...changes}, {});
    assert.equal(r.status,503); assert.doesNotMatch(await r.text(),/SECRET/);
  }
  assert.equal(calls,0); assert.equal(qaAccessWindow(env,time),true);
  assert.equal(qaAccessWindow(env,time+3599999),true); assert.equal(qaAccessWindow(env,time+3600000),false);
});

test('origin pin and runtime origin cannot be replaced by a client Origin header', async () => {
  let calls=0; const worker=wrapQaAccess({fetch(){calls++;return new Response('secret');}},origin,()=>time);
  for(const url of ['https://gemnao.pages.dev/diagnose','http://gemnao-diagnostic-qa.synthetic-test.workers.dev/diagnose',
    'https://gemnao-diagnostic-qa.synthetic-test.workers.dev:444/diagnose','https://gemnao-diagnostic-qa.other.workers.dev/diagnose']){
    assert.equal((await worker.fetch(new Request(url,{headers:{Authorization:auth(token),Origin:origin}}),env,{})).status,503);
  }
  assert.equal((await worker.fetch(request(),{...env,QA_PREVIEW_ORIGIN:origin+'/'},{})).status,503);
  assert.equal((await wrapQaAccess({fetch(){calls++;}},'https://gemnao.pages.dev',()=>time).fetch(request(),env,{})).status,503);
  assert.equal(calls,0);
});

test('all routes including assets, root redirects, APIs, HEAD and OPTIONS authenticate first', async () => {
  let calls=0;const worker=wrapQaAccess({fetch(){calls++;return new Response('protected');}},origin,()=>time);
  for(const path of ['/','/diagnose','/diagnose/privacy','/_next/static/a.js','/images/a.png','/robots.txt',
    '/api/diagnosis/config','/api/diagnostic-feedback','/diagnosis/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa']){
    for(const method of ['GET','HEAD','POST','PATCH','DELETE','OPTIONS']){
      const r=await worker.fetch(request(path,null,{method}),env,{});
      assert.equal(r.status,401);assert.match(r.headers.get('WWW-Authenticate'),/^Basic /);
      assert.equal(r.headers.get('Cache-Control'),'private, no-store');
      assert.equal(r.headers.get('X-Robots-Tag'),'noindex, nofollow, noarchive');
      assert.match(r.headers.get('Content-Security-Policy'),/frame-ancestors 'none'/);
      assert.equal(r.headers.get('Access-Control-Allow-Origin'),null);
    }
  }
  assert.equal(calls,0);
});

test('malformed, wrong-user, wrong-password and oversized auth is rejected without app calls', async () => {
  let calls=0;const worker=wrapQaAccess({fetch(){calls++;return new Response('protected');}},origin,()=>time);
  for(const authorization of ['Bearer '+token,'Basic '+btoa('other:'+token),auth(other),'Basic %%%',
    'Basic '+btoa('qa:short'),'Basic '+btoa('qa:'+token+'\n'),'Basic '+btoa('qa:'+'x'.repeat(129)),
    'Basic '+btoa('qa:'+token).replace(/=+$/,''),'Basic '+'A'.repeat(300)]){
    const r=await worker.fetch(new Request(origin+'/diagnose',{headers:{Authorization:authorization}}),env,{});
    assert.equal(r.status,401,authorization.slice(0,20));
  }
  assert.equal(calls,0);
});

test('approved credentials never reach application env or forwarded request', async () => {
  let calls=0;const worker=wrapQaAccess({fetch(req,appEnv){
    calls++;assert.equal(req.headers.get('Authorization'),null);assert.equal(req.headers.get('Cookie'),'existing=owner');
    for(const key of ['QA_ACCESS_SHA256','QA_ACCESS_NOT_BEFORE','QA_ACCESS_EXPIRES_AT']) assert.equal(appEnv[key],undefined);
    assert.equal(appEnv.DIAGNOSIS_STORAGE_ENABLED,'false');assert.equal(appEnv.FEEDBACK_ENABLED,'false');
    return new Response('OK',{headers:{'Cache-Control':'public, max-age=3600'}});
  }},origin,()=>time);
  const r=await worker.fetch(request('/diagnose',token,{headers:{Cookie:'existing=owner'}}),env,{});
  assert.equal(r.status,200);assert.equal(await r.text(),'OK');assert.equal(r.headers.get('Cache-Control'),'private, no-store');
  assert.equal((await worker.fetch(request('/diagnose',null),env,{})).status,401);assert.equal(calls,1);
});

test('Basic authentication does not bypass independent same-origin mutation checks', async () => {
  let calls=0;const worker=wrapQaAccess({fetch(){calls++;return new Response('OK');}},origin,()=>time);
  for(const method of ['POST','PATCH','DELETE','OPTIONS']){
    for(const headers of [{},{Origin:'https://other.example'},{Origin:origin,'Sec-Fetch-Site':'cross-site'}])
      assert.equal((await worker.fetch(request('/api/diagnosis',token,{method,headers}),env,{})).status,403);
    assert.equal((await worker.fetch(request('/api/diagnosis',token,{method,headers:{Origin:origin,'Sec-Fetch-Site':'same-origin'}}),env,{})).status,200);
  }
  assert.equal(calls,4);
});

test('expiry never reopens access and late responses/errors disclose no app data', async () => {
  let now=time,calls=0;
  const worker=wrapQaAccess({fetch(){calls++;now=time+3600000;return new Response('protected');}},origin,()=>now);
  const r=await worker.fetch(request(),env,{});assert.equal(r.status,503);assert.doesNotMatch(await r.text(),/protected/);
  assert.equal((await worker.fetch(request(),env,{})).status,503);assert.equal(calls,1);
  const failed=wrapQaAccess({fetch(){throw new Error('PRIVATE');}},origin,()=>time);
  const response=await failed.fetch(request(),env,{});assert.equal(response.status,503);assert.doesNotMatch(await response.text(),/PRIVATE/);
});

test('outer gate covers inner preview redirects and assets with no ungated export', async () => {
  const worker=wrapQaAccess(wrapPreviewApplication({fetch(){return new Response('asset');}},origin),origin,()=>time);
  assert.equal((await worker.fetch(request('/',null),env,{})).status,401);
  const allowed=await worker.fetch(request('/'),env,{});assert.equal(allowed.status,302);assert.equal(allowed.headers.get('Location'),'/diagnose');
  assert.equal((await worker.fetch(request('/_next/static/a.js'),env,{})).status,200);
  assert.equal((await worker.fetch(request('/api/feedback'),env,{})).status,404);
  const wrapper=readFileSync('cloudflare/worker-preview.mjs','utf8');
  assert.match(wrapper,/export default wrapQaAccess\(wrapPreviewApplication/);
  const config=JSON.parse(readFileSync('wrangler.worker-preview.json','utf8'));
  assert.equal(config.assets.run_worker_first,true);assert.equal(config.preview_urls,false);
  for(const [key,value] of Object.entries(config.vars)) if(key.endsWith('_ENABLED'))assert.equal(value,'false',key);
  assert.equal(config.vars.QA_ACCESS_SHA256,undefined);
});

test('configuration and token validation reject coercion, final newline and bad boundaries', async () => {
  for(const key of ['QA_ACCESS_SHA256','QA_ACCESS_NOT_BEFORE','QA_ACCESS_EXPIRES_AT']){
    for(const value of [env[key]+'\n', env[key]+'\r\n', Number(env[key]), {}, null, true]){
      assert.equal(qaAccessWindow({...env,[key]:value},time),false,key);
    }
  }
  assert.equal(qaAccessWindow(null,time),false);
  for(const value of [token+'\n',token+'\r','x'.repeat(42),'x'.repeat(129),123,{},'x'.repeat(42)+' '])
    await assert.rejects(qaAccessVerifier(value));
  assert.match(await qaAccessVerifier('x'.repeat(43)),/^[a-f0-9]{64}$/);
  assert.match(await qaAccessVerifier('x'.repeat(128)),/^[a-f0-9]{64}$/);
});

test('successful HEAD, valid origin-only mutations, and hostile fetch-site values', async () => {
  let calls=0; const worker=wrapQaAccess({fetch(){calls++;return new Response(null,{status:204});}},origin,()=>time);
  assert.equal((await worker.fetch(request('/diagnose',token,{method:'HEAD'}),env,{})).status,204);
  assert.equal((await worker.fetch(request('/api/diagnosis',token,{method:'POST',headers:{Origin:origin}}),env,{})).status,204);
  for(const value of ['same-site','none','cross-site'])
    assert.equal((await worker.fetch(request('/api/diagnosis',token,{method:'POST',headers:{Origin:origin,'Sec-Fetch-Site':value}}),env,{})).status,403);
  assert.equal((await worker.fetch(request('/api/diagnosis',token,{method:'POST',headers:{Origin:'null'}}),env,{})).status,403);
  const headers=new Headers();headers.append('Authorization',auth(token));headers.append('Authorization',auth(token));
  assert.equal((await worker.fetch(new Request(origin+'/diagnose',{headers}),env,{})).status,401);
  assert.equal(calls,2);
});
