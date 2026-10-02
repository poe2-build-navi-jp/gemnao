import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { isEditorialSnapshotPath, snapshotAssetFor } from '../cloudflare/prerender-policy.mjs';

const manifest = JSON.parse(await readFile('dist/editorial-snapshots.json', 'utf8'));
assert.ok(Object.keys(manifest).length > 200);
for (const path of ['/', '/contact', '/contact?category=business', '/admin/contacts', '/api/contact', '/api/feedback', '/discord-servers', '/discord-servers/submit', '/status', '/my', '/diagnose', '/diagnosis/example']) {
  assert.equal(isEditorialSnapshotPath(path), false, path);
  assert.equal(manifest[path], undefined, path);
}
const url = 'https://gemnao.pages.dev/pc/disk-usage-100';
assert.ok(snapshotAssetFor(new Request(url), manifest));
assert.ok(snapshotAssetFor(new Request(url, { method: 'HEAD' }), manifest));
for (const init of [
  { method: 'POST' },
  ...['rsc','next-router-state-tree','next-router-prefetch','next-router-segment-prefetch'].map((h) => ({ headers: { [h]: '1' } })),
  { headers: { accept: 'text/x-component' } },
  { headers: { cookie: '__prerender_bypass=1' } },
  { headers: { cookie: '__next_preview_data=1' } },
]) assert.equal(snapshotAssetFor(new Request(url, init), manifest), null);
assert.equal(snapshotAssetFor(new Request(`${url}?test=1`), manifest), null);
assert.equal(snapshotAssetFor(new Request('https://gemnao.pages.dev/pc/not-a-real-article'), manifest), null);
for (const [path, asset] of Object.entries(manifest)) {
  assert.ok(isEditorialSnapshotPath(path));
  assert.match(asset, /^\/_gemnao-snapshots\/[\w-]+\.snapshot$/);
  const html = await readFile(`dist/client${asset}`, 'utf8');
  assert.match(html, /<title>[^<]+<\/title>/);
  assert.ok(html.match(/<head>([\s\S]*?)<\/head>/)?.[1].includes('property="og:image"'), path);
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, path);
  assert.ok(html.includes('google-site-verification'), path);
  assert.ok(html.includes('google-adsense-account'), path);
  assert.ok(html.includes('<script type="application/ld+json">'), path);
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  assert.equal(new URL(canonical).pathname, path, path);
  if (path.startsWith('/zh')) assert.match(html, /<html lang="zh-Hans"/);
  if (path.startsWith('/en')) assert.match(html, /<html lang="en"/);
  if (path.startsWith('/es')) assert.match(html, /<html lang="es"/);
  if (path === '/gear/stream-deck-plus-xl') {
    assert.ok(html.indexOf('id="before-buying"') < html.indexOf('data-affiliate-asin'));
    assert.ok(html.indexOf('id="compare"') < html.indexOf('data-affiliate-asin'));
    assert.ok(html.includes('data-affiliate-position="after-fit-check"'));
    assert.ok(html.includes('rel="sponsored nofollow noopener"'));
    assert.ok(!html.includes('AggregateRating'));
  }
}
console.log(`PASS: ${Object.keys(manifest).length} complete canonical editorial snapshots, locale language, verification/ads/schema retained, dynamic/private/query/RSC routes excluded`);
