import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { WikiHome } from '../components/wiki-home';
import { LocalizedHome } from '../components/localized-home';
import { HomeBookmarkHelp } from '../components/home-bookmark-help';
import { searchArticles } from '../lib/site-search';

const html = renderToStaticMarkup(<WikiHome />);
assert.ok(html.indexOf('id="symptoms"') < html.indexOf('my-shortcut-title'));
assert.ok(html.indexOf('home-saved-entry') < html.indexOf('symptom-grid'));
assert.ok(html.indexOf('my-shortcut-title') < html.indexOf('id="home-tools"'));
for (const anchor of [
  'site-search',
  'symptoms',
  'games',
  'articles',
  'home-tools',
]) {
  assert.equal(html.split(`id="${anchor}"`).length - 1, 1, anchor);
}
for (const route of [
  '/my#my-reading-list',
  '/tools/save-locations',
  '/tools/refresh-rate',
  '/tools/windows-diagnosis',
]) {
  assert.ok(html.includes(`href="${route}"`), route);
}
assert.match(html, /type="search"/);
assert.match(html, /Windows用の試作版/);
assert.match(html, /原因の確定・自動修復/);
assert.match(html, /Hzは測定の目安/);
for (const query of ['Aniimo 黒画面', 'Steam 起動しない', 'Discord マイク']) {
  assert.ok(searchArticles(query).length > 0, query);
  assert.match(html, new RegExp(`aria-label="${query}で検索"`));
}
for (const locale of ['ja', 'en', 'zh', 'es'] as const) {
  const help = renderToStaticMarkup(<HomeBookmarkHelp locale={locale} />);
  assert.match(help, /<details class="home-bookmark-help"><summary>/);
  assert.ok(!help.includes(' open='));
  assert.match(help, /Ctrl \+ D/);
  assert.match(help, /Command \+ D/);
  assert.ok(!help.includes('<button'));
  if (locale !== 'ja') {
    const home = renderToStaticMarkup(<LocalizedHome locale={locale} />);
    assert.ok(home.includes(help));
    assert.ok(!help.includes('ブックマーク'));
    assert.ok(!home.includes(`/${locale}/tools/save-locations`));
    assert.ok(!home.includes(`/${locale}/tools/refresh-rate`));
  }
}
const source = readFileSync('components/home-bookmark-help.tsx', 'utf8');
assert.ok(
  !/onToggle|onClick|gtag|fetch\(|localStorage|sessionStorage/.test(source),
);
const css = readFileSync('app/globals.css', 'utf8');
assert.match(css, /\.search-box:focus-within/);
assert.match(css, /\.home-search-examples button:focus-visible/);
assert.match(
  css,
  /\.home-tool-grid\s*\{\s*grid-template-columns: minmax\(0, 1fr\)/,
);
console.log(
  'PASS: home order, saved shortcut, real tools/examples, 4 localized native bookmark disclosures, CSS safeguards',
);
