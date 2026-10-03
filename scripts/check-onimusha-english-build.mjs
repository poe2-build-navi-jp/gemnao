// Run after a successful build/prepare-pages step. Source checks are separate.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const manifest = JSON.parse(
  await readFile('dist/editorial-snapshots.json', 'utf8'),
);
const base = '/games/onimusha-way-of-the-sword';
const paths = [
  base,
  ...[
    'not-launching',
    'crash-report',
    'low-fps',
    'shader-cache',
    'black-screen',
    'hdr',
    'gpu-driver-version',
  ].map((slug) => `${base}/${slug}`),
];
const sitemap = await readFile('dist/client/sitemap.xml', 'utf8');
const htmlFor = async (path) => {
  assert.ok(manifest[path], `Missing snapshot: ${path}`);
  return readFile(`dist/client${manifest[path]}`, 'utf8');
};
for (const original of paths) {
  const english = `/en${original}`;
  for (const path of [original, english]) {
    const html = await htmlFor(path);
    const head = html.match(/<head>([\s\S]*?)<\/head>/)?.[1] || '';
    assert.equal(
      new URL(head.match(/rel="canonical" href="([^"]+)"/)?.[1]).pathname,
      path,
    );
    assert.ok(!/name="robots" content="[^"]*noindex/.test(head));
    const alternates = [...head.matchAll(/<link\b[^>]*>/g)]
      .map((match) => match[0])
      .filter((tag) => /hrefLang=/i.test(tag));
    for (const [language, target] of [
      ['ja', original],
      ['en', english],
      ['x-default', original],
    ]) {
      const tag = alternates.find((tag) =>
        new RegExp(`hrefLang="${language}"`, 'i').test(tag),
      );
      assert.ok(tag, `${path}: missing ${language}`);
      assert.equal(new URL(tag.match(/href="([^"]+)"/)?.[1]).pathname, target);
    }
    assert.ok(
      !alternates.some((tag) => /hrefLang="(?:zh-Hans|es)"/i.test(tag)),
    );
    const menu =
      html.match(/<details class="language-menu">([\s\S]*?)<\/details>/)?.[1] ||
      '';
    assert.ok(
      menu.includes(`href="${path === original ? english : original}"`),
    );
    if (path === original) continue;
    assert.match(html, /<html lang="en"/);
    assert.match(html, /<main lang="en"/);
    assert.match(head, /property="og:locale" content="en_US"/);
    assert.ok(head.includes(`/images/og${english}.png`));
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
    const visible = html
      .replace(/<details class="language-menu">[\s\S]*?<\/details>/g, '')
      .replace(/<script[\s\S]*?<\/script>/g, '')
      .replace(/<[^>]+>/g, ' ');
    assert.ok(!/[ぁ-んァ-ヶ一-龯]/u.test(visible));
    assert.ok(visible.length > (original === base ? 2500 : 5500));
    if (original !== base) assert.ok(html.includes('Save for later'));
  }
  assert.ok(sitemap.includes(`https://gemnao.pages.dev${english}</loc>`));
  for (const locale of ['zh', 'es']) {
    assert.ok(!manifest[`/${locale}${original}`]);
    assert.ok(
      !sitemap.includes(`https://gemnao.pages.dev/${locale}${original}</loc>`),
    );
  }
}
const hub = await htmlFor(`/en${base}`);
for (const original of paths.slice(1))
  assert.ok(hub.includes(`href="/en${original}"`));
console.log(
  'PASS: eight English Onimusha production snapshots and reciprocal Japanese metadata; language, OG, sitemap, discovery and no invented translations',
);
