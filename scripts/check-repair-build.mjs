import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
const manifest = JSON.parse(
  readFileSync('dist/editorial-snapshots.json', 'utf8'),
);
const sitemap = readFileSync('dist/client/sitemap.xml', 'utf8');
const paths = ['', '/en', '/zh', '/es'].map((p) => `${p}/pc/repair-or-replace`);
for (const path of paths) {
  assert.ok(manifest[path], `${path} snapshot registered`);
  const html = readFileSync('dist/client' + manifest[path], 'utf8');
  const head = html.match(/<head>([\s\S]*?)<\/head>/)?.[1] || '';
  assert.ok(
    head.includes(`href="https://gemnao.pages.dev${path}"`),
    `${path} self canonical in head`,
  );
  assert.match(head, /<title>/);
  assert.match(head, /property="og:image"/);
  for (const lang of ['ja', 'en', 'zh-Hans', 'es', 'x-default'])
    assert.ok(
      head.includes(`hrefLang="${lang}"`) ||
        head.includes(`hreflang="${lang}"`),
      `${path} ${lang}`,
    );
  for (let i = 1; i <= 4; i++)
    assert.ok(html.includes(`id="step-${i}"`), `${path} step${i}`);
  assert.ok(html.includes('id="repair-costs"'));
  assert.ok(
    html.includes('FAQPage') &&
      html.includes('TechArticle') &&
      html.includes('BreadcrumbList'),
  );
  assert.ok(sitemap.includes('https://gemnao.pages.dev' + path));
  const assets = [
    ...html.matchAll(/(?:href|src)="(\/_next\/static\/[^"?]+)(?:\?[^"]*)?"/g),
  ].map((m) => m[1]);
  assert.ok(assets.some((p) => p.endsWith('.css')));
  assert.ok(assets.some((p) => p.endsWith('.js')));
  for (const asset of assets)
    assert.ok(existsSync('dist/client' + asset), `${path} missing ${asset}`);
}
assert.ok(!manifest['/diagnose']);
assert.ok(!sitemap.includes('<loc>https://gemnao.pages.dev/diagnose</loc>'));
assert.ok(existsSync('dist/client/ads.txt'));
console.log(
  'PASS: four built HTML snapshots, head metadata, hreflang, schema, step anchors, cost tables, referenced CSS/JS, sitemap and private route exclusion. File inspection; not a browser-rendering test.',
);
