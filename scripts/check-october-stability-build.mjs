import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const manifest = JSON.parse(
  await readFile('dist/editorial-snapshots.json', 'utf8'),
);
const sitemap = await readFile('dist/client/sitemap.xml', 'utf8');
const origins = [
  '/games/ace-combat-8/crashing-memory',
  '/games/planet-zoo-2/crashing-autosave',
];
let checkedLinks = 0;
for (const original of origins) {
  for (const prefix of ['', '/en']) {
    const path = prefix + original;
    assert.ok(manifest[path], `snapshot ${path}`);
    const html = await readFile('dist/client' + manifest[path], 'utf8');
    const head = html.match(/<head>([\s\S]*?)<\/head>/)?.[1] || '';
    assert.ok(
      head.includes(`rel="canonical" href="https://gemnao.pages.dev${path}"`),
      path,
    );
    assert.ok(!/name="robots" content="[^"]*noindex/.test(head));
    assert.ok(head.includes(`/images/og${path}.png`));
    assert.ok(sitemap.includes(`https://gemnao.pages.dev${path}</loc>`));
    for (const [lang, target] of [
      ['ja', original],
      ['en', '/en' + original],
    ]) {
      assert.ok(
        new RegExp(
          `hrefLang="${lang}" href="https://gemnao.pages.dev${target}"`,
          'i',
        ).test(head),
      );
      assert.ok(html.includes(`href="${target}"`));
    }
    assert.ok(!/hrefLang="(?:es|zh-Hans)"/i.test(head));
    for (const id of original.includes('ace-combat')
      ? ['status', 'memory', 'compare', 'report']
      : ['protect', 'status', 'isolate', 'report']) {
      assert.ok(html.includes(`id="${id}"`), `${path} #${id}`);
    }
    assert.ok(html.includes('2026-10-22'));
    for (const href of new Set(
      [...html.matchAll(/href="(\/(?:en\/)?(?:games|guide)\/[^"?#]+)"/g)].map(
        (m) => m[1],
      ),
    )) {
      assert.ok(manifest[href], `${path} broken editorial link ${href}`);
      checkedLinks++;
    }
    if (prefix) {
      const visible = html
        .replace(/<details class="language-menu">[\s\S]*?<\/details>/g, '')
        .replace(/<script[\s\S]*?<\/script>/g, '')
        .replace(/<[^>]+>/g, ' ');
      assert.ok(!/[ぁ-んァ-ヶ一-龯]/u.test(visible), 'Japanese leakage');
    }
    const hub = path.split('/').slice(0, -1).join('/');
    const hubHtml = await readFile('dist/client' + manifest[hub], 'utf8');
    assert.ok(hubHtml.includes(`href="${path}"`), 'hub discovery');
  }
  for (const locale of ['es', 'zh']) {
    assert.ok(!manifest[`/${locale}${original}`]);
    assert.ok(
      !sitemap.includes(`https://gemnao.pages.dev/${locale}${original}</loc>`),
    );
  }
}
for (const prefix of ['', '/en']) {
  for (const slug of ['not-launching', 'stutter-audio-cutting-out']) {
    const html = await readFile(
      'dist/client' + manifest[`${prefix}/games/ace-combat-8/${slug}`],
      'utf8',
    );
    assert.ok(
      html.includes(`href="${prefix}/games/ace-combat-8/crashing-memory"`),
    );
  }
  const hub = `${prefix}/games/planet-zoo-2`;
  const html = await readFile('dist/client' + manifest[hub], 'utf8');
  assert.match(html, /name="robots" content="noindex, follow"/);
  assert.ok(!sitemap.includes(`https://gemnao.pages.dev${hub}</loc>`));
}
console.log(
  `PASS: 4 article snapshots, canonical/hreflang, sitemap, OG, step anchors, English copy, hub/backlinks and ${checkedLinks} editorial links; single-article hubs remain noindex`,
);
