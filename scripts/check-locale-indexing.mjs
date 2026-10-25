// zh/es pages get X-Robots-Tag: noindex from the worker; ja/en stay indexable.
// `node scripts/check-locale-indexing.mjs` (no network).
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { applyLocaleIndexing } from '../cloudflare/locale-indexing.mjs';

const run = (path, init) =>
  applyLocaleIndexing(
    new Request(`https://gemnao.pages.dev${path}`),
    new Response('body', init),
  );
for (const path of ['/zh', '/zh/', '/es/guide', '/zh/games/aion2/login-error'])
  assert.equal(run(path).headers.get('X-Robots-Tag'), 'noindex', path);
for (const path of [
  '/',
  '/en',
  '/en/guide',
  '/games/zhuge/x',
  '/esports',
  '/zhx',
])
  assert.equal(run(path).headers.get('X-Robots-Tag'), null, path);
const kept = run('/es', {
  status: 404,
  headers: { 'X-Robots-Tag': 'max-image-preview:large', 'Cache-Control': 'x' },
});
assert.equal(kept.status, 404);
assert.equal(kept.headers.get('Cache-Control'), 'x');
assert.equal(
  kept.headers.get('X-Robots-Tag'),
  'max-image-preview:large, noindex',
);
assert.equal(
  run('/zh', { headers: { 'X-Robots-Tag': 'noindex' } }).headers.get(
    'X-Robots-Tag',
  ),
  'noindex',
);
assert.equal(await run('/zh').text(), 'body');
const sitemap = await readFile('dist/client/sitemap.xml', 'utf8');
assert.ok(!/<loc>https:\/\/gemnao\.pages\.dev\/(zh|es)(\/|<)/.test(sitemap));
assert.ok(sitemap.includes('<loc>https://gemnao.pages.dev/en</loc>'));
console.log(
  'PASS: zh/es noindex header, ja/en untouched, status/headers/body kept, sitemap ja/en only.',
);
