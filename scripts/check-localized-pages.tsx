// Renders every translated page and fails if Japanese text leaks into it,
// if a page lacks hreflang alternates, or if an article and its Japanese
// original drift apart (different step ids). Run: pnpm check:localized
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { LocalizedArticle } from '../components/localized-article';
import { LocalizedGamePage } from '../components/localized-game-page';
import { LocalizedHome } from '../components/localized-home';
import { articleBySlug } from '../lib/game-articles';
import { gameBySlug } from '../lib/games';
import { locales } from '../lib/i18n';
import {
  languageAlternates,
  localizedArticles,
  localizedGameSlugs,
} from '../lib/localized/index';

// Kana always means untranslated Japanese. Kanji is allowed on Chinese
// pages but must not appear on English or Spanish ones.
const kana = /[ぁ-んァ-ヶ]/u;
const cjk = /[ぁ-んァ-ヶ一-龯]/u;

function visibleText(html: string) {
  return html
    .replace(/<details class="language-menu">[\s\S]*?<\/details>/g, '')
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;|&#\d+;/g, ' ');
}

function check(name: string, locale: string, html: string) {
  const text = visibleText(html);
  const pattern = locale === 'zh' ? kana : cjk;
  const leak = text.match(new RegExp(`.{0,20}${pattern.source}.{0,20}`, 'u'));
  assert(!leak, `${name}: untranslated Japanese: ${leak?.[0]}`);
  assert(!/EVIDENCE STATUS|Relative demand/.test(html), `${name}: old panel`);
}

let pages = 0;
for (const locale of locales) {
  check(
    `/${locale}`,
    locale,
    renderToStaticMarkup(<LocalizedHome locale={locale} />),
  );
  pages++;
  for (const slug of localizedGameSlugs) {
    const game = gameBySlug(slug);
    assert(game, `missing game ${slug}`);
    check(
      `/${locale}/games/${slug}`,
      locale,
      renderToStaticMarkup(<LocalizedGamePage game={game} locale={locale} />),
    );
    assert(
      languageAlternates(`/games/${slug}`)[
        locale === 'zh' ? 'zh-Hans' : locale
      ],
      `${slug}: missing hreflang for ${locale}`,
    );
    pages++;
  }
}
for (const article of localizedArticles) {
  const name = `/${article.locale}/games/${article.gameSlug}/${article.slug}`;
  const game = gameBySlug(article.gameSlug);
  const original = articleBySlug(article.gameSlug, article.slug);
  assert(game && original, `${name}: no Japanese original`);
  assert.deepEqual(
    article.steps.map((step) => step.id),
    original.steps.map((step) => step.id),
    `${name}: step ids differ from the Japanese article`,
  );
  for (const row of article.diagnosis)
    assert(
      article.steps.some((step) => step.id === row.stepId),
      `${name}: diagnosis points to missing ${row.stepId}`,
    );
  check(
    name,
    article.locale,
    renderToStaticMarkup(<LocalizedArticle game={game} article={article} />),
  );
  pages++;
}
console.log(`PASS: ${pages} translated pages`);
