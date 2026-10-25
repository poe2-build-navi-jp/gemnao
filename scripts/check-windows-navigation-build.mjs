import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const snapshots = JSON.parse(await readFile('dist/editorial-snapshots.json', 'utf8'));
const sitemap = await readFile('dist/client/sitemap.xml', 'utf8');
for (const locale of ['ja', 'en', 'zh', 'es']) {
  const prefix = locale === 'ja' ? '' : `/${locale}`;
  const path = `${prefix}/tools/windows-diagnosis`;
  assert.ok(snapshots[path], path);
  const html = await readFile(`dist/client${snapshots[path]}`, 'utf8');
  assert.match(html, /id="download"/);
  assert.match(html, new RegExp(`<html lang="${locale === 'zh' ? 'zh-Hans' : locale}"`));
  assert.ok(html.includes(`rel="canonical" href="https://gemnao.pages.dev${path}"`));
  // zh/es are published but noindex: not in the sitemap or hreflang.
  const indexed = locale === 'ja' || locale === 'en';
  assert.equal(sitemap.includes(`https://gemnao.pages.dev${path}<`), indexed, `${path} sitemap`);
  for (const [language, root] of [['ja', ''], ['en', '/en'], ['zh-Hans', '/zh'], ['es', '/es']]) {
    const tags = [...html.matchAll(/<link[^>]+>/g)].map(m => m[0]);
    assert.equal(tags.some(t => t.toLowerCase().includes(`hreflang="${language.toLowerCase()}"`) && t.includes(`href="https://gemnao.pages.dev${root}/tools/windows-diagnosis"`)), language === 'ja' || language === 'en', `${path} ${language}`);
  }
  const homePath = prefix || '/';
  // Japanese home is live; its navigation is covered by the browser test.
  if (snapshots[homePath]) {
    const home = await readFile(`dist/client${snapshots[homePath]}`, 'utf8');
    assert.ok(home.includes(`href="${path}#download"`), homePath);
  }
  console.log(`PASS built ${locale}: snapshot, anchor, language, canonical, reciprocal alternates, sitemap, home link`);
}
