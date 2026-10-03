// Renders every translated page and fails if Japanese text leaks into it,
// if a page lacks hreflang alternates, or if an article and its Japanese
// original drift apart (different step ids). Run: pnpm check:localized
import { EnglishGearGuide } from '../components/english-gear-guide';
import { EnglishCrashGuide } from '../components/english-crash-guide';
import { gearGuidesEn } from '../lib/localized/gear-guides-en';
import { gearGuideBySlug } from '../lib/gear-guides';
import { recentGameArticlesEn } from '../lib/localized/recent-game-articles-en';
import { articlesEn } from '../lib/localized/articles-en';
import { localizedHubs } from '../lib/localized/hubs';
import { hasTranslation } from '../lib/localized/index';
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
for (const guide of gearGuidesEn) {
  const original = gearGuideBySlug(guide.slug);
  assert(original);
  const path = `/gear/${guide.slug}`;
  assert.deepEqual(
    guide.sections.map((section) => section.id),
    original.sections.map((section) => section.id),
  );
  assert.equal(guide.beforeBuying.length, original.beforeBuying.length);
  assert.equal(guide.setup.length, original.setup.length);
  assert.equal(guide.faqs.length, original.faqs.length);
  assert.deepEqual(
    guide.sources.map((source) => source.url),
    original.sources!.map((source) => source.url),
  );
  check(
    `/en${path}`,
    'en',
    renderToStaticMarkup(<EnglishGearGuide guide={guide} />),
  );
  assert.equal(languageAlternates(path).en, `/en${path}`);
  assert.equal(hasTranslation('zh', path), false);
  assert.equal(hasTranslation('es', path), false);
  pages++;
}
check(
  '/en/guide/pc-game-crash',
  'en',
  renderToStaticMarkup(<EnglishCrashGuide />),
);
pages++;
for (const article of recentGameArticlesEn) {
  const original = articleBySlug(article.gameSlug, article.slug)!;
  assert.deepEqual(
    article.sources.map((source) => source.url),
    original.sources!.map((source) => source.url),
  );
  assert.equal(article.faqs.length, original.faqs?.length);
  article.steps.forEach((step, index) => {
    assert.equal(
      step.actions.length,
      original.steps[index].actions.length,
      `${step.id}: omitted actions`,
    );
    assert.equal(
      step.risk,
      original.steps[index].risk,
      `${step.id}: risk drift`,
    );
  });
  assert.equal(
    languageAlternates(`/games/${article.gameSlug}/${article.slug}`).en,
    `/en/games/${article.gameSlug}/${article.slug}`,
  );
}
assert.equal(
  hasTranslation('en', '/games/ace-combat-8'),
  false,
  'Do not fabricate a hub',
);
assert.equal(
  hasTranslation('en', '/games/ace-combat-8/error-st-3100001'),
  true,
);
assert.equal(
  hasTranslation('zh', '/games/ace-combat-8/error-st-3100001'),
  false,
);
assert.equal(
  hasTranslation('en', '/games/monster-hunter-wilds/system-requirements'),
  false,
);
assert.equal(hasTranslation('en', '/guide/save-data-backup'), false);
const existingEnglishText = JSON.stringify(articlesEn);
for (const unsafe of [
  'fully reversible',
  'Close antivirus, firewalls',
  'close hardware monitors, antivirus',
  'delete the newly created folder',
  'add the game folder as an exception',
  'add the exception and switch it back on',
  'Close as many apps as you can',
])
  assert.ok(
    !existingEnglishText.includes(unsafe),
    `Unsafe English instruction: ${unsafe}`,
  );
assert.ok(
  existingEnglishText.includes(
    'Keep antivirus and firewall protection enabled',
  ),
);
assert.ok(
  existingEnglishText.includes(
    'Do not exclude the entire game folder automatically',
  ),
);
assert.ok(
  localizedHubs['baldurs-gate-3'].intro.en.includes(
    "Larian Studios\\Baldur's Gate 3",
  ),
);
assert.ok(
  !localizedHubs['cyberpunk-2077'].intro.en.includes(
    'reinstalling does not remove them',
  ),
);
console.log(`PASS: ${pages} translated pages`);
