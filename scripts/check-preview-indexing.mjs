import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { applyPreviewIndexing } from '../cloudflare/preview-indexing.mjs';
for (const host of [
  '59953d9e.gemnao.pages.dev',
  '0e1b140c.gemnao.pages.dev',
  '8f045628.gemnao.pages.dev',
  'd19259f6.gemnao.pages.dev',
  'gemunao.gemnao.pages.dev',
  'feature-test.gemnao.pages.dev',
]) {
  for (const path of [
    '/',
    '/about',
    '/en/games/monster-hunter-wilds/not-launching',
    '/sitemap.xml',
    '/robots.txt',
    '/_next/static/test.js',
  ]) {
    for (const method of ['GET', 'HEAD']) {
      const input = new Response(method === 'HEAD' ? null : 'unchanged', {
        headers: {
          'Content-Type': 'text/html',
          'Cache-Control': 'public, max-age=0',
          'X-Gemnao-Cache': 'HIT',
        },
      });
      const result = applyPreviewIndexing(
        new Request(`https://${host}${path}`, { method }),
        input,
      );
      assert.equal(result.status, 200);
      assert.equal(result.headers.get('X-Robots-Tag'), 'noindex');
      assert.equal(
        result.headers.get('Cache-Control'),
        input.headers.get('Cache-Control'),
      );
      assert.equal(result.headers.get('X-Gemnao-Cache'), 'HIT');
      assert.equal(await result.text(), method === 'HEAD' ? '' : 'unchanged');
    }
  }
}
for (const host of [
  'gemnao.pages.dev',
  'localhost',
  'other.pages.dev',
  'gemnao.pages.dev.example.com',
  'evilgemnao.pages.dev',
]) {
  const input = new Response('unchanged');
  assert.equal(
    applyPreviewIndexing(new Request(`https://${host}/`), input),
    input,
  );
  assert.equal(input.headers.get('X-Robots-Tag'), null);
}
for (const existing of [
  'noindex, nofollow, noarchive',
  'nofollow',
  'googlebot: noindex',
]) {
  const input = new Response(null, {
    status: 403,
    headers: {
      'X-Robots-Tag': existing,
      'Cache-Control': 'private, no-store',
      'Set-Cookie': 'fixture=1',
    },
  });
  const result = applyPreviewIndexing(
    new Request('https://test.gemnao.pages.dev/api/feedback', {
      method: 'POST',
    }),
    input,
  );
  assert.equal(result.status, 403);
  assert.ok(result.headers.get('X-Robots-Tag').includes('noindex'));
  assert.ok(result.headers.get('X-Robots-Tag').includes(existing));
  assert.equal(result.headers.get('Cache-Control'), 'private, no-store');
  assert.equal(result.headers.get('Set-Cookie'), 'fixture=1');
}
const redirect = applyPreviewIndexing(
  new Request('https://test.gemnao.pages.dev/old'),
  Response.redirect('https://gemnao.pages.dev/', 308),
);
assert.equal(redirect.status, 308);
assert.equal(redirect.headers.get('Location'), 'https://gemnao.pages.dev/');
const rule = (await readFile('public/_headers', 'utf8'))
  .split('\n')
  .filter((s) => s.trim() && !s.startsWith('#'));
assert.deepEqual(rule, [
  'https://:deployment.gemnao.pages.dev/*',
  '  X-Robots-Tag: noindex',
]);
assert.match(
  await readFile('cloudflare/worker-source.mjs', 'utf8'),
  /applyPreviewIndexing\(\s*request,\s*await worker\.fetch\(request, env, context\)/,
);
console.log(
  'PASS: preview hashes/branch aliases noindex, production/lookalikes unchanged; GET/HEAD/POST, cache and private headers, status/body/redirect preserved; static-only host rule. No network.',
);
