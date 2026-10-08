import { gameArticles, hubIndexable } from '../lib/game-articles';
import { ogCardSpecs } from '../lib/og-cards';
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
import { localizedDiscordArticles } from '../lib/localized/index';
import { discordArticleBySlug } from '../lib/discord-articles';
import { rocketLeagueLocalizedArticles } from '../lib/localized/rocket-league-articles';
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
  localizedGameSlugsFor,
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
  for (const slug of localizedGameSlugsFor(locale)) {
    const game = gameBySlug(slug);
    assert(game, `missing game ${slug}`);
    check(
      `/${locale}/games/${slug}`,
      locale,
      renderToStaticMarkup(<LocalizedGamePage game={game} locale={locale} />),
    );
    if (localizedHubs[slug].noindex) {
      assert.deepEqual(
        languageAlternates(`/games/${slug}`),
        {},
        'No hreflang to a noindex discovery hub',
      );
    } else
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
for (const article of localizedDiscordArticles) {
  const path = `/discord/${article.slug}`;
  const original = discordArticleBySlug(article.slug);
  assert(original, `${path}: Japanese original missing`);
  assert.deepEqual(
    article.steps.map((step) => step.id),
    original.causes.map((_, index) => `cause-${index + 1}`),
  );
  assert.deepEqual(
    article.sources.map((source) => source.url),
    original.sources.map((source) => source.url),
  );
  assert.equal(article.faqs.length, original.faqs.length, 'Discord FAQ parity');
  assert.equal(
    article.diagnosis.length,
    original.diagnosis?.length,
    'Discord diagnosis parity',
  );
  article.steps.forEach((step, index) => {
    assert.equal(
      step.actions.length,
      original.causes[index].actions.length,
      `${path}: action parity`,
    );
    assert.equal(
      step.risk,
      original.causes[index].risk,
      `${path}: risk parity`,
    );
    assert.equal(
      Boolean(step.note),
      Boolean(original.causes[index].note),
      `${path}: note parity`,
    );
  });
  article.diagnosis.forEach((row) =>
    assert(article.steps.some((step) => step.id === row.stepId)),
  );
  const html = renderToStaticMarkup(
    <LocalizedArticle section="discord" article={article} />,
  );
  check(`/${article.locale}${path}`, article.locale, html);
  assert(html.includes(`/${article.locale}${path}`), 'Correct Discord path');
  assert(!html.includes('/games/discord/'), 'No invented Discord game path');
  assert(html.includes('SoftwareApplication'), 'Discord schema entity type');
  assert.equal(
    languageAlternates(path)[
      article.locale === 'zh' ? 'zh-Hans' : article.locale
    ],
    `/${article.locale}${path}`,
  );
  pages++;
}
for (const article of rocketLeagueLocalizedArticles) {
  const original = articleBySlug(article.gameSlug, article.slug)!;
  assert.deepEqual(
    article.sources.map((source) => source.url),
    original.sources!.map((source) => source.url),
  );
  assert.equal(
    article.faqs.length,
    original.faqs?.length,
    'Rocket League FAQ parity',
  );
  assert.equal(
    article.diagnosis.length,
    original.diagnosis?.length,
    'Rocket League diagnosis parity',
  );
  assert.equal(
    article.avoid.length,
    original.avoid?.length,
    'Rocket League safety parity',
  );
  assert.equal(
    article.cautions.length,
    original.cautions.length,
    'Rocket League cautions parity',
  );
  article.steps.forEach((step, index) => {
    assert.equal(
      step.actions.length,
      original.steps[index].actions.length,
      'Rocket League action parity',
    );
    assert.equal(
      step.risk,
      original.steps[index].risk,
      'Rocket League risk parity',
    );
    assert.equal(
      Boolean(step.note),
      Boolean(original.steps[index].note),
      'Rocket League note parity',
    );
  });
  assert(article.title.includes('DualSense'), 'Scope must remain DualSense');
  assert.equal(
    languageAlternates(`/games/${article.gameSlug}/${article.slug}`)[
      article.locale === 'zh' ? 'zh-Hans' : article.locale
    ],
    `/${article.locale}/games/${article.gameSlug}/${article.slug}`,
  );
}
for (const locale of locales) {
  assert(hasTranslation(locale, '/discord/upload-failed'));
  assert.equal(
    hasTranslation(locale, '/discord'),
    false,
    'Do not invent a translated Discord hub',
  );
  assert.equal(
    hasTranslation(locale, '/discord/mic-not-working'),
    false,
    'Do not invent other Discord translations',
  );
  assert.equal(hasTranslation(locale, '/games/discord/upload-failed'), false);
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
  localizedHubs['baldurs-gate-3'].intro.en?.includes(
    "Larian Studios\\Baldur's Gate 3",
  ),
);
assert.ok(
  !localizedHubs['cyberpunk-2077'].intro.en?.includes(
    'reinstalling does not remove them',
  ),
);


// New game expansion: four-language parity and registry-backed navigation.
const expansionGames = ['arc-raiders', 'elden-ring-nightreign', 'marvel-rivals'];
const expansionCards = ogCardSpecs();
for (const gameSlug of expansionGames) {
  const game = gameBySlug(gameSlug);
  assert(game?.focused, `${gameSlug}: expected a source-scoped hub`);
  const originals = gameArticles.filter((article) => article.gameSlug === gameSlug);
  assert.equal(originals.length, 2, `${gameSlug}: two distinct symptom guides`);
  assert(hubIndexable(game), `${gameSlug}: two-article hub is indexable`);
  const hub = localizedHubs[gameSlug];
  assert(hub.focused && !hub.noindex && hub.checkedAt, `${gameSlug}: complete focused hub`);
  for (const locale of locales) {
    assert(hub.names?.[locale] && hub.title?.[locale], `${gameSlug}: localized hub identity`);
    assert.equal(languageAlternates(`/games/${gameSlug}`)[locale === 'zh' ? 'zh-Hans' : locale], `/${locale}/games/${gameSlug}`);
  }
  for (const original of originals) {
    const path = `/games/${gameSlug}/${original.slug}`;
    for (const related of original.related)
      assert(originals.some((article) => article.slug === related), `${path}: related guide exists`);
    for (const locale of locales) {
      const translations = localizedArticles.filter((article) => article.gameSlug === gameSlug && article.slug === original.slug && article.locale === locale);
      assert.equal(translations.length, 1, `${path}: exactly one ${locale} translation`);
      const translation = translations[0];
      assert(translation.gameName, `${path}: no unsupported game-facts fallback`);
      assert.deepEqual(translation.sources.map((source) => source.url), original.sources!.map((source) => source.url), `${path}: source parity`);
      assert.equal(translation.faqs.length, original.faqs!.length, `${path}: FAQ parity`);
      assert.equal(translation.avoid.length, original.avoid!.length, `${path}: safety parity`);
      assert.equal(translation.cautions.length, original.cautions.length, `${path}: caution parity`);
      assert.equal(languageAlternates(path)[locale === 'zh' ? 'zh-Hans' : locale], `/${locale}${path}`);
    }
  }
  for (const prefix of ['', '/en', '/zh', '/es']) {
    const paths = [`${prefix}/games/${gameSlug}`, ...originals.map((article) => `${prefix}/games/${gameSlug}/${article.slug}`)];
    for (const path of paths)
      assert.equal(expansionCards.filter((card) => card.path === path).length, 1, `${path}: exactly one OG specification`);
  }
}

console.log(`PASS: ${pages} translated pages and three-game expansion parity`);
