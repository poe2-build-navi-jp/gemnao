import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { WikiHeader, languageFallbackLabels } from '../components/wiki-header';
import { hasTranslation, localizedArticles } from '../lib/localized/index';
import { localeNames } from '../lib/i18n';

const locales = ['ja', 'en', 'zh', 'es'] as const;
const paths = [
  '',
  '/pc/microphone-after-update',
  '/my',
  '/guide/pc-game-crash',
  '/tools/windows-diagnosis',
  ...new Set(
    localizedArticles.map(
      (article) => `/games/${article.gameSlug}/${article.slug}`,
    ),
  ),
];
let checked = 0;
for (const locale of locales) {
  for (const pagePath of paths) {
    // Only exercise real source languages for this page.
    if (locale !== 'ja' && !hasTranslation(locale, pagePath)) continue;
    const html = renderToStaticMarkup(
      <WikiHeader locale={locale} pagePath={pagePath} />,
    );
    const menu = html.match(
      /<details class="language-menu">([\s\S]*?)<\/details>/,
    )?.[1];
    assert.ok(menu);
    assert.ok(
      menu.includes(`: ${localeNames[locale]}"`),
      'Language control includes its visible label in its accessible name',
    );
    const links = [...menu.matchAll(/<a href="([^"]+)"[^>]*>(.*?)<\/a>/g)];
    assert.equal(links.length, 4);
    for (const [index, item] of locales.entries()) {
      const fallback = item !== 'ja' && !hasTranslation(item, pagePath);
      const expected =
        item === 'ja'
          ? pagePath || '/'
          : fallback
            ? `/${item}`
            : `/${item}${pagePath}`;
      assert.equal(links[index][1], expected);
      assert.equal(
        links[index][2],
        localeNames[item] + (fallback ? `<small lang="${item}">${languageFallbackLabels[item]}</small>` : ''),
      );
    }
    assert.equal(
      menu.includes('language-menu-note'),
      locales.some((item) => item !== 'ja' && !hasTranslation(item, pagePath)),
    );
    assert.equal((menu.match(/aria-current="page"/g) ?? []).length, 1);
    checked++;
  }
}
for (const section of ['pc', 'gear']) {
  const source = readFileSync(`app/${section}/[slug]/page.tsx`, 'utf8');
  assert.ok(
    source.includes('<WikiHeader pagePath={`/' + section + '/${slug}`} />'),
  );
}
console.log(
  `PASS: ${checked} language menus; translated destinations preserved, home fallbacks labeled in all four UI languages, Japanese article identity retained.`,
);
