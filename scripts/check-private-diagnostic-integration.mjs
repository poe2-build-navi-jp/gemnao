import assert from 'node:assert/strict';
import { readFile, mkdir } from 'node:fs/promises';
import { build } from 'esbuild';
import { isEditorialSnapshotPath } from '../cloudflare/prerender-policy.mjs';
const read = (p) => readFile(p, 'utf8');
const config = JSON.parse(await read('wrangler.json'));
assert(
  !Object.keys(config.vars).some((k) => k.startsWith('PRIVATE_DIAGNOSTIC')),
);
assert(!config.d1_databases.some((d) => d.binding === 'PRIVATE_DIAGNOSTIC_DB'));
assert.deepEqual(config.env.preview.d1_databases, []);
for (const route of [
  '/private-diagnostic',
  '/admin/private-diagnostic',
  '/api/private-diagnostic',
  '/api/admin/private-diagnostic',
])
  assert.equal(isEditorialSnapshotPath(route), false);
for (const file of [
  'lib/analytics.ts',
  'components/adsense-loader.tsx',
  'app/layout.tsx',
])
  assert((await read(file)).includes('private-diagnostic'));
assert(
  (await read('app/api/admin/private-diagnostic/route.ts')).includes(
    'isDiscordAdmin(request)',
  ),
);
assert(
  !(await read('lib/private-diagnostic/service.ts')).includes(
    'env.FEEDBACK_DB',
  ),
);
assert(
  !(await read('lib/private-diagnostic/service.ts')).includes(
    'env.DIAGNOSIS_DB',
  ),
);
assert(
  !(await read('lib/private-diagnostic/service.ts')).includes('env.REPORTS_DB'),
);
await mkdir('.tmp-feedback-test', { recursive: true });
await build({
  entryPoints: ['cloudflare/worker-source.mjs'],
  outfile: '.tmp-feedback-test/private-worker.mjs',
  bundle: true,
  format: 'esm',
  platform: 'node',
  plugins: [
    {
      name: 'synthetic-render',
      setup(b) {
        b.onResolve({ filter: /dist\/server\/index\.js$/ }, () => ({
          path: 'synthetic',
          namespace: 'private-test',
        }));
        b.onLoad({ filter: /.*/, namespace: 'private-test' }, () => ({
          contents:
            "export default {fetch(){return new Response('<h1>Synthetic private screen</h1>',{headers:{'Content-Type':'text/html'}})}};",
        }));
      },
    },
  ],
});
const { default: worker } =
  await import('../.tmp-feedback-test/private-worker.mjs');
for (const path of ['/private-diagnostic', '/admin/private-diagnostic']) {
  const r = await worker.fetch(
    new Request('https://gemnao.test' + path),
    {
      ASSETS: {
        fetch() {
          throw Error('private page entered public asset routing');
        },
      },
    },
    {},
  );
  assert.equal(r.status, 200);
  assert.match(r.headers.get('Cache-Control'), /private, no-store/);
  assert.match(r.headers.get('X-Robots-Tag'), /noindex/);
  assert.equal(r.headers.get('Referrer-Policy'), 'no-referrer');
  assert.match(r.headers.get('Content-Security-Policy'), /connect-src 'self'/);
  assert.match(
    r.headers.get('Content-Security-Policy'),
    /frame-ancestors 'none'/,
  );
}
const code = await build({
  entryPoints: ['lib/admin-cookie.ts'],
  bundle: true,
  write: false,
  format: 'esm',
  platform: 'node',
});
const { configuredAdmin } = await import(
  'data:text/javascript;base64,' +
    Buffer.from(code.outputFiles[0].text).toString('base64')
);
const request = (token) =>
  new Request('https://gemnao.test/api/admin/private-diagnostic', {
    headers: { cookie: 'gemnao_discord_admin=' + token },
  });
assert.equal(await configuredAdmin(request('synthetic-owner-key'), {}), false);
assert.equal(
  await configuredAdmin(request('wrong'), { token: 'synthetic-owner-key' }),
  false,
);
assert.equal(
  await configuredAdmin(request('synthetic-owner-key'), {
    token: 'synthetic-owner-key',
  }),
  true,
);
console.log(
  'PASS private route security headers, no snapshots/analytics, default-off isolated binding, existing cookie verifier with synthetic keys; no live authentication',
);
