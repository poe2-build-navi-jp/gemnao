import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { readdir, stat } from 'node:fs/promises';
await build({
  entryPoints: ['cloudflare/worker-source.mjs'], outfile: '.wrangler/search-ocr/worker.mjs',
  bundle: true, format: 'esm', platform: 'node', plugins: [{
    name: 'synthetic-renderer', setup(builder) {
      builder.onResolve({ filter: /dist\/server\/index\.js$/ }, () => ({ path: 'renderer', namespace: 'test' }));
      builder.onLoad({ filter: /.*/, namespace: 'test' }, () => ({ contents: "export default { fetch() { return new Response('application', {status:404}); } };" }));
    },
  }],
});
const { default: worker } = await import('../../.wrangler/search-ocr/worker.mjs');
const paths = await readdir('public/ocr/v7');
for (const path of paths) {
  assert((await stat(`public/ocr/v7/${path}`)).size < 25 * 1024 * 1024);
  let assetRead = false;
  const response = await worker.fetch(new Request(`https://gemnao.test/ocr/v7/${path}`), {
    ASSETS: { fetch(request) { assetRead = true; assert.equal(new URL(request.url).pathname, `/ocr/v7/${path}`); return new Response('asset'); } },
    DB: { prepare() { throw new Error('OCR asset cannot access DB'); } },
  }, {});
  assert(assetRead, path); assert.equal(response.status, 200, path);
}
console.log(`PASS: actual Pages wrapper routes all ${paths.length} generated OCR assets to ASSETS; no DB access; each asset below 25MB`);
