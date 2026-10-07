import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { build } from 'esbuild';
import { isEditorialSnapshotPath } from '../cloudflare/prerender-policy.mjs';
const read = (path) => readFileSync(path, 'utf8');
const config = JSON.parse(read('wrangler.json'));
assert.ok(!Object.keys(config.vars || {}).some((key) => key.startsWith('FEEDBACK_')));
assert.ok(!config.d1_databases.some((entry) => entry.binding === 'FEEDBACK_DB'));
assert.deepEqual(config.env.preview.d1_databases, []);
assert.ok(!readdirSync('.openai/drizzle').some((path) => path.includes('diagnostic')));
assert.ok(!read('lib/diagnostic-feedback/service.ts').includes('env.DB'));
for (const path of ['/diagnostic-feedback', '/api/diagnostic-feedback']) assert.equal(isEditorialSnapshotPath(path), false);
assert.match(read('app/layout.tsx'), /location.origin !==/);
assert.match(read('app/layout.tsx'), /p === '\/diagnostic-feedback'/);
assert.match(read('components/adsense-loader.tsx'), /diagnostic-feedback/);
assert.match(read('lib/analytics.ts'), /diagnostic-feedback/);
await build({
  entryPoints: ['cloudflare/worker-source.mjs'], outfile: '.tmp-feedback-test/worker-integration.mjs',
  bundle: true, format: 'esm', platform: 'node', plugins: [{
    name: 'synthetic-renderer', setup(build) {
      build.onResolve({ filter: /dist\/server\/index\.js$/ }, () => ({ path: 'synthetic', namespace: 'test-renderer' }));
      build.onLoad({ filter: /.*/, namespace: 'test-renderer' }, () => ({ contents: `export default { fetch() { return new Response('synthetic HTML', {headers:{'Content-Type':'text/html'}}); } };` }));
    },
  }],
});
const { default: worker } = await import('../.tmp-feedback-test/worker-integration.mjs');
const response = await worker.fetch(new Request('https://gemnao.test/diagnostic-feedback'), { ASSETS: { fetch() { throw new Error('private page must not use public snapshot'); } } }, {});
assert.equal(response.status, 200);
assert.equal(response.headers.get('Cache-Control'), 'private, no-store');
assert.match(response.headers.get('X-Robots-Tag'), /noindex/);
assert.equal(response.headers.get('Referrer-Policy'), 'no-referrer');
assert.match(response.headers.get('Content-Security-Policy'), /connect-src 'self'/);
assert.match(response.headers.get('Content-Security-Policy'), /frame-src 'none'/);
console.log('PASS: isolated binding, staged schema, default-off configuration, origin-scoped analytics and private worker response');
