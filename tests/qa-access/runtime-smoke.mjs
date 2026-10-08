// Synthetic, in-process local Workerd only. No remote D1, CF API or real token.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { build } from 'esbuild';
import { qaAccessVerifier } from '../../cloudflare/worker-preview-policy.mjs';
const require = createRequire(import.meta.url);
const { Miniflare } = createRequire(require.resolve('wrangler/package.json'))('miniflare');
const origin = 'https://gemnao-diagnostic-qa.synthetic-test.workers.dev';
const token = 'SYNTHETIC_TEST_FIXTURE_NOT_A_REAL_PASSWORD_0001';
const output = await build({
  stdin: { contents: `import { wrapQaAccess, wrapPreviewApplication } from './cloudflare/worker-preview-policy.mjs';
    const app={fetch(request,env){return new Response(JSON.stringify({authorization:request.headers.has('Authorization'),verifier:env.QA_ACCESS_SHA256??null,path:new URL(request.url).pathname}));}};
    export default wrapQaAccess(wrapPreviewApplication(app,'${origin}'),'${origin}');`,
    resolveDir: process.cwd(), sourcefile:'synthetic-qa-entry.mjs' },
  bundle:true, write:false, platform:'neutral', format:'esm', external:['node:crypto'],
});
const now = Date.now();
const mf = new Miniflare({ modules:true, script:output.outputFiles[0].text,
  compatibilityDate:'2026-05-22', compatibilityFlags:['nodejs_compat'],
  bindings:{QA_PREVIEW_ORIGIN:origin,QA_ACCESS_SHA256:await qaAccessVerifier(token),
    QA_ACCESS_NOT_BEFORE:String(now-1000),QA_ACCESS_EXPIRES_AT:String(now+60000)} });
try {
  for(const path of ['/diagnose','/_next/static/a.js','/api/diagnosis/config'])
    assert.equal((await mf.dispatchFetch(origin+path)).status,401);
  const headers={Authorization:'Basic '+btoa('qa:'+token)};
  const response=await mf.dispatchFetch(origin+'/_next/static/a.js',{headers});
  assert.equal(response.status,200);
  assert.deepEqual(await response.json(),{authorization:false,verifier:null,path:'/_next/static/a.js'});
  assert.equal(response.headers.get('Cache-Control'),'private, no-store');
  assert.equal((await mf.dispatchFetch(origin+'/api/diagnosis',{method:'POST',headers})).status,403);
  assert.equal((await mf.dispatchFetch(origin+'/api/diagnosis',{method:'POST',headers:{...headers,Origin:origin}})).status,200);
  assert.equal((await mf.dispatchFetch(origin+'/_next/static/a.js')).status,401);
  console.log('PASS: local Workerd nodejs_compat authentication, runtime timingSafeEqual, forwarding scrub and CSRF checks.');
} finally { await mf.dispose(); }
