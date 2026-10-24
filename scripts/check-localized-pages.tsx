import { finalGamesEn } from '../lib/localized/final-games-en';
import { aionGearsEn } from '../lib/localized/aion-gears-en';
import { fallReleaseEn } from '../lib/localized/fall-release-en';
import { codMw4En } from '../lib/localized/cod-mw4-en';
import { dqmDemoEn } from '../lib/localized/dqm-demo-en';
import { upcomingLaunchEn } from '../lib/localized/upcoming-launch-en';
import { starWarsBacklogEn } from '../lib/localized/star-wars-backlog-en';
import { dawnwalkerBacklogEn } from '../lib/localized/dawnwalker-backlog-en';
import { aniimoBacklogEn } from '../lib/localized/aniimo-backlog-en';
import { dogmaPerformanceEn } from '../lib/localized/dogma-performance-en';
import { palworldBacklogEn } from '../lib/localized/palworld-backlog-en';
import { wildsBacklogEn } from '../lib/localized/wilds-backlog-en';
import { EnglishPcIndex } from '../components/english-pc-index';
import { crashGuideEn, crashSectionsEn } from '../lib/localized/crash-guide-en';
import { translatedCommonGuides } from '../lib/localized/save-guides-zh-es';
import { LocalizedGuideIndex } from '../components/localized-guide-index';
import { EnglishDiscordIndex } from '../components/english-discord-index';
import { EnglishGuideIndex } from '../components/english-guide-index';
import { guideGroupsEn } from '../lib/localized/guide-index-en';
import { EnglishCommonGuide } from '../components/english-common-guide';
import { commonGuidesEn } from '../lib/localized/common-guides-en';
import { commonGuideBySlug } from '../lib/common-guides';
import { LocalizedPcArticle } from '../components/localized-pc-article';
import { localizedPcArticles } from '../lib/localized/index';
import { pcArticleBySlug } from '../lib/pc-articles';
import { localizedRepairCosts } from '../lib/localized/repair-costs';
import { repairCostExamples } from '../lib/repair-costs';
import sitemap from '../app/sitemap';
import { isEditorialSnapshotPath } from '../cloudflare/prerender-policy.mjs';
import { gameArticles, hubIndexable } from '../lib/game-articles';
import { ogCardSpecs } from '../lib/og-cards';
// Renders every translated page and fails if Japanese text leaks into it,
// if a page lacks hreflang alternates, or if an article and its Japanese
// original drift apart (different step ids). Run: pnpm check:localized
import { EnglishGearGuide } from '../components/english-gear-guide';
import { EnglishCrashGuide } from '../components/english-crash-guide';
import { gearGuidesEn } from '../lib/localized/gear-guides-en';
import { gearGuideBySlug } from '../lib/gear-guides';
import { eldenBacklogEn } from '../lib/localized/elden-backlog-en';
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
// zh/es pages stay published but are noindex, so hreflang lists ja/en only.
const alternateFor = (path: string, locale: string) =>
  languageAlternates(path)[locale === 'zh' ? 'zh-Hans' : locale];
const expectedAlternate = (locale: string, href: string) =>
  locale === 'zh' || locale === 'es' ? undefined : href;

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

const indexGuides = guideGroupsEn.flatMap(group => group.guides);
assert.equal(indexGuides.length, 28);
assert.equal(new Set(indexGuides.map(guide => guide.path)).size, 28);
const guideIndexHtml = renderToStaticMarkup(<EnglishGuideIndex />);
check('/en/guide', 'en', guideIndexHtml);
assert.equal(languageAlternates('/guide').en, '/en/guide');
assert.equal(hasTranslation('zh', '/guide'), true);
assert.equal(hasTranslation('es', '/guide'), true);
for (const guide of indexGuides) assert.ok(guideIndexHtml.includes(`href="/en${guide.path}"`));
check('/en/discord', 'en', renderToStaticMarkup(<EnglishDiscordIndex />));
assert.equal(localizedDiscordArticles.filter(a => a.locale === 'en').length, 38);
check('/en/pc', 'en', renderToStaticMarkup(<EnglishPcIndex />));
let pages = 3;
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
      assert.equal(
        Boolean(alternateFor(`/games/${slug}`, locale)),
        locale === 'en',
        `${slug}: hreflang for ${locale} only when indexed`,
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
const officialSourceKey = (value: string) => {
 const url = new URL(value);
 if (url.hostname === 'support.discord.com' || url.hostname === 'support.focusrite.com') return `${url.hostname}/articles/${url.pathname.match(/articles\/(\d+)/)?.[1]}`;
 if (url.hostname === 'support.google.com' && url.pathname === '/chrome/answer/95414') url.searchParams.set('hl', 'en');
 if (url.hostname === 'support.mozilla.org') url.pathname = url.pathname.replace(/^\/(ja|en-US)\//, '/en-US/');
 return url.href.replace('/ja-jp/', '/en-us/').replace('chrome/answer/2693767?hl=ja', 'chrome/answer/2693767?hl=en');
};
for (const article of localizedDiscordArticles) {
  const path = `/discord/${article.slug}`;
  const original = discordArticleBySlug(article.slug);
  assert(original, `${path}: Japanese original missing`);
  assert.deepEqual(
    article.steps.map((step) => step.id),
    original.causes.map((_, index) => `cause-${index + 1}`),
  );
  assert.deepEqual(
    article.sources.map((source) => officialSourceKey(source.url)),
    original.sources.map((source) => officialSourceKey(source.url)),
  );
  assert.equal(article.faqs.length, original.faqs.length, 'Discord FAQ parity');
  assert.equal(
    article.diagnosis.length,
    original.diagnosis?.length ?? original.causes.length,
    'Discord diagnosis parity (or one decision per cause without a Japanese diagnosis table)',
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
  if (original.botRecommendations) {
    assert.deepEqual(article.botRecommendations?.map(bot => bot.id), original.botRecommendations.map(bot => bot.id));
    article.botRecommendations!.forEach((bot, i) => {
      const source = original.botRecommendations![i];
      assert.equal(bot.steps.length, source.steps.length, 'Bot setup action parity');
      for (const key of ['purpose','useCase','fit','skip','cost','example','success','failure','undo'] as const) assert.ok(bot[key].trim(), `Bot ${bot.id}: missing ${key}`);
      assert.equal(bot.entry.url, source.entry.url);
      assert.equal(bot.dashboard, source.dashboard);
      assert.equal(bot.manual, source.manual);
    });
  }
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
  assert.equal(alternateFor(path, article.locale), expectedAlternate(article.locale, `/${article.locale}${path}`));
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
  assert.equal(alternateFor(`/games/${article.gameSlug}/${article.slug}`, article.locale), expectedAlternate(article.locale, `/${article.locale}/games/${article.gameSlug}/${article.slug}`));
}
for (const locale of locales) {
  assert(hasTranslation(locale, '/discord/upload-failed'));
  assert.equal(
    hasTranslation(locale, '/discord'),
    locale === 'en',
    'Do not invent a translated Discord hub',
  );
  assert.equal(
    hasTranslation(locale, '/discord/mic-not-working'),
    locale === 'en',
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
for (const guide of commonGuidesEn) {
  const original = commonGuideBySlug(guide.slug)!;
  assert.ok(original);
  assert.deepEqual(guide.steps.map(step => step.id), original.steps.map((_, i) => `step-${i + 1}`));
  check(`/en${guide.path}`, 'en', renderToStaticMarkup(<EnglishCommonGuide guide={guide} />));
  assert.equal(languageAlternates(guide.path).en, `/en${guide.path}`);
  assert.equal(hasTranslation('zh', guide.path), translatedCommonGuides.some(g => g.locale === 'zh' && g.slug === guide.slug));
  assert.equal(hasTranslation('es', guide.path), translatedCommonGuides.some(g => g.locale === 'es' && g.slug === guide.slug));
  if (['tpm-secure-boot', 'windows-11-required', 'ray-tracing-gpu', 'reset-config-file', 'pc-shuts-down-while-gaming', 'bsod-while-gaming', 'reshade-uninstall', 'remove-mods-safely', 'uninstall-save-data', 'shader-cache-delete', 'steam-disk-write-error', 'pc-game-freezes', 'vram-shortage', 'low-gpu-usage', 'directx-error', 'visual-c-runtime-error', 'no-game-audio', 'steam-input-controller', 'controller-double-input'].includes(guide.slug)) {
    assert.deepEqual(guide.steps.map(s => s.actions.length), original.steps.map(s => s.actions.length), `${guide.slug}: action parity`);
    assert.equal(guide.faqs.length, original.faqs?.length, `${guide.slug}: FAQ parity`);
    const sourceKey = (url: string) => url.replace('/ja-jp/', '/en-us/').replace('steampowered.com/ja/', 'steampowered.com/en/').replace('?view=msvc-170', '');
    const supplements: Record<string, string[]> = { 'windows-11-required': ['https://enso-order.acecombat.jp/'], 'ray-tracing-gpu': ['https://www.nvidia.com/en-us/geforce/news/geforce-gtx-dxr-ray-tracing-available-now/'] };
    assert.deepEqual(guide.sources.map(s => sourceKey(s.url)), [...original.sources.map(s => sourceKey(s.url)), ...(supplements[guide.slug] || [])], `${guide.slug}: source parity`);
  }
  for (const branch of guide.branches) assert.ok([...guide.steps, ...(guide.extraSections || [])].some(step => step.id === branch.step));
  pages++;
}
for (const locale of ['zh','es'] as const) {
  check(`/${locale}/guide`, locale, renderToStaticMarkup(<LocalizedGuideIndex locale={locale} />));
  assert.equal(alternateFor('/guide', locale), expectedAlternate(locale, `/${locale}/guide`));
  pages++;
}
for (const guide of translatedCommonGuides) {
  if (guide.crashSections) {
    assert.deepEqual(guide.crashSections.map(s => s.id),crashSectionsEn.map(s => s.id));
    const shape = (s: {items?: string[];paragraphs?:string[];table?:{rows:string[][]};links?:unknown[]}) => [s.items?.length,s.paragraphs?.length,s.table?.rows.map(r=>r.length),s.links?.length];
    assert.deepEqual(guide.crashSections.map(shape),crashSectionsEn.map(shape));
    assert.deepEqual(guide.sources.map(s=>s.url),crashGuideEn.sources.map(s=>s.url));
    assert.equal(guide.faqs.length,crashGuideEn.faqs.length);
    check(`/${guide.locale}${guide.path}`,guide.locale,renderToStaticMarkup(<EnglishCrashGuide guide={guide} sections={guide.crashSections} locale={guide.locale} />));
    pages++; continue;
  }
  const en = commonGuidesEn.find(g => g.slug === guide.slug)!;
  assert.deepEqual(guide.steps.map(s => s.id), en.steps.map(s => s.id));
  assert.deepEqual(guide.steps.map(s => s.actions.length), en.steps.map(s => s.actions.length));
  assert.deepEqual(guide.extraSections?.map(s => [s.id,s.actions.length]), en.extraSections?.map(s => [s.id,s.actions.length]));
  assert.equal(guide.faqs.length,en.faqs.length);
  assert.equal(guide.cautions.length,en.cautions.length);
  assert.deepEqual(guide.sources.map(s => s.url), en.sources.map(s => s.url));
  check(`/${guide.locale}${guide.path}`, guide.locale, renderToStaticMarkup(<EnglishCommonGuide guide={guide} locale={guide.locale} />));
  assert.equal(alternateFor(guide.path, guide.locale), expectedAlternate(guide.locale, `/${guide.locale}${guide.path}`));
  for (const b of guide.branches) assert.ok([...guide.steps,...(guide.extraSections||[])].some(s => s.id === b.step));
  pages++;
}
for (const article of [...finalGamesEn, ...aionGearsEn, ...fallReleaseEn, ...codMw4En, ...dqmDemoEn, ...upcomingLaunchEn, ...recentGameArticlesEn, ...eldenBacklogEn, ...wildsBacklogEn, ...palworldBacklogEn, ...dogmaPerformanceEn, ...aniimoBacklogEn, ...dawnwalkerBacklogEn, ...starWarsBacklogEn]) {
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
  true,
  'The reviewed English hub exists',
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
  true,
);
assert.equal(hasTranslation('en', '/guide/uninstall-save-data'), true);
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
    assert.equal(alternateFor(`/games/${gameSlug}`, locale), expectedAlternate(locale, `/${locale}/games/${gameSlug}`));
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
      assert.equal(alternateFor(path, locale), expectedAlternate(locale, `/${locale}${path}`));
    }
  }
  for (const prefix of ['', '/en', '/zh', '/es']) {
    const paths = [`${prefix}/games/${gameSlug}`, ...originals.map((article) => `${prefix}/games/${gameSlug}/${article.slug}`)];
    for (const path of paths)
      assert.equal(expansionCards.filter((card) => card.path === path).length, 1, `${path}: exactly one OG specification`);
  }
}

// Reviewed disk-source replacements: the former pages omitted the cited controls.
const reviewedDiskSources: Record<string,string> = {
  'https://techcommunity.microsoft.com/blog/askperf/windows-8--windows-server-2012-the-new-task-manager/375149': 'https://learn.microsoft.com/en-us/previous-versions/windows/desktop/mttmprov/msft-mtdisk',
  'https://support.microsoft.com/ja-jp/windows/experience/system-configuration-tools-in-windows': 'https://learn.microsoft.com/en-us/azure/site-recovery/monitoring-high-churn',
  'https://support.microsoft.com/ja-jp/windows/experience/performance-optimization/tips-to-improve-pc-performance-in-windows': 'https://learn.microsoft.com/en-us/troubleshoot/windows-client/performance/how-to-determine-the-appropriate-page-file-size-for-64-bit-versions-of-windows',
};
const reviewedPcSource=(url:string,slug:string)=>slug==='disk-usage-100'?(reviewedDiskSources[url]||url):url;

// Repair decision: real localized routes with the same safety and source scope.
const repairCards = ogCardSpecs();
const sitemapPaths = new Set(
  sitemap().map((entry) => new URL(entry.url).pathname),
);
for (const article of localizedPcArticles) {
  const original = pcArticleBySlug(article.slug);
  const originalPath = `/pc/${article.slug}`;
  const path = `/${article.locale}${originalPath}`;
  assert(original, `${path}: Japanese original missing`);
  if (article.slug === 'repair-or-replace') assert.equal(article.steps.length, 4, `${path}: exactly four decision steps`);
  assert.equal(
    article.steps.length,
    original.steps.length,
    `${path}: step parity`,
  );
  assert.deepEqual(
    article.diagnosis.map((row) => row.next),
    original.diagnosis.map((row) => row.next),
    `${path}: diagnosis parity`,
  );
  assert.equal(
    article.quickChecks.length,
    original.quickChecks.length,
    `${path}: safety-check parity`,
  );
  assert.equal(
    article.faqs.length,
    original.faqs.length,
    `${path}: FAQ parity`,
  );
  if (article.slug === 'repair-or-replace') {
    assert.equal(article.checkedAt, original.checkedAt, `${path}: verification-date parity`);
  } else {
    assert(article.checkedAt >= original.checkedAt, `${path}: verification date must not precede original`);
  }
  assert.deepEqual(
    article.sources.map((source) => source.url.replace('support.microsoft.com/ja-jp/', 'support.microsoft.com/en-us/').replace('learn.microsoft.com/ja-jp/', 'learn.microsoft.com/en-us/').replace('help.steampowered.com/ja/', 'help.steampowered.com/en/').replace(/\/windows\/[^/?]+19bc41ca-ad72-ae67-af3c-89ce169755dd$/, '/windows/windows-update-troubleshooter-19bc41ca-ad72-ae67-af3c-89ce169755dd')),
    [...original.sources.map((source) => reviewedPcSource(source.url, article.slug).replace('support.microsoft.com/ja-jp/', 'support.microsoft.com/en-us/').replace('learn.microsoft.com/ja-jp/', 'learn.microsoft.com/en-us/').replace('help.steampowered.com/ja/', 'help.steampowered.com/en/').replace(/\/windows\/[^/?]+19bc41ca-ad72-ae67-af3c-89ce169755dd$/, '/windows/windows-update-troubleshooter-19bc41ca-ad72-ae67-af3c-89ce169755dd')), ...(article.slug === 'gaming-shortcut-keys' ? ['https://store.steampowered.com/oldnews/5047'] : article.slug === 'disk-usage-100' ? ['https://learn.microsoft.com/en-us/troubleshoot/windows-client/performance/slow-page-file-growth-memory-allocation-errors','https://store.steampowered.com/oldnews/88497'] : [])],
    `${path}: official-source parity`,
  );
  assert.deepEqual(
    article.evidenceSummary?.sources.map((source) => source.url.replace('support.microsoft.com/ja-jp/', 'support.microsoft.com/en-us/').replace('learn.microsoft.com/ja-jp/', 'learn.microsoft.com/en-us/').replace('help.steampowered.com/ja/', 'help.steampowered.com/en/').replace(/\/windows\/[^/?]+19bc41ca-ad72-ae67-af3c-89ce169755dd$/, '/windows/windows-update-troubleshooter-19bc41ca-ad72-ae67-af3c-89ce169755dd')),
    original.evidenceSummary?.sources.map((source) => reviewedPcSource(source.url, article.slug).replace('support.microsoft.com/ja-jp/', 'support.microsoft.com/en-us/').replace('learn.microsoft.com/ja-jp/', 'learn.microsoft.com/en-us/').replace('help.steampowered.com/ja/', 'help.steampowered.com/en/').replace(/\/windows\/[^/?]+19bc41ca-ad72-ae67-af3c-89ce169755dd$/, '/windows/windows-update-troubleshooter-19bc41ca-ad72-ae67-af3c-89ce169755dd')),
    `${path}: decision-source parity`,
  );
  assert.equal(
    article.evidenceSummary?.items.length,
    original.evidenceSummary?.items.length,
    `${path}: four-way decision parity`,
  );
  assert.deepEqual(article.shortcutRows?.map(row => row.step), original.shortcutRows?.map(row => row.step), `${path}: shortcut row and step parity`);
  for (const row of article.shortcutRows || []) {
    assert(row.situation && row.keys && row.effect && row.condition);
    assert(row.step >= 1 && row.step <= article.steps.length);
  }
  article.steps.forEach((step, index) => {
    assert.equal(
      step.actions.length,
      original.steps[index].actions.length,
      `${path}: step-${index + 1} action parity`,
    );
    assert.equal(
      step.resultRows?.length,
      original.steps[index].resultRows?.length,
      `${path}: step-${index + 1} outcome parity`,
    );
    assert(
      step.expected && step.unexpected && step.revert,
      `${path}: result and safety copy`,
    );
  });
  if (article.slug === 'repair-or-replace') {
    const liquidWarning = { en: /liquid/i, zh: /液体/u, es: /líquido/iu }[article.locale];
    for (const warning of [article.quickChecks[0], article.diagnosis[0].symptom, article.steps[0].actions[0]])
      assert(liquidWarning.test(warning), `${path}: liquid exposure must retain its immediate-stop warning`);
  }
  const html = renderToStaticMarkup(<LocalizedPcArticle article={article} />);
  for (const row of article.shortcutRows || []) assert(html.includes('id="shortcut-list"') && html.includes(row.keys));
  check(path, article.locale, html);
  for (const id of article.steps.map((_, index) => `step-${index + 1}`)) {
    assert.equal(
      (html.match(new RegExp(`id="${id}"`, 'g')) ?? []).length,
      1,
      `${path}: unique ${id}`,
    );
    assert(html.includes(`href="#${id}"`), `${path}: valid step link ${id}`);
  }
  assert(
    html.includes('TechArticle') &&
      html.includes('FAQPage') &&
      html.includes('BreadcrumbList'),
    `${path}: structured data`,
  );
  assert(
    html.includes(`"mainEntityOfPage":"https://gemnao.pages.dev${path}"`),
    `${path}: schema self URL`,
  );
  assert(
    (article.locale === 'en') === html.includes(`href="/${article.locale}/pc"`),
    `${path}: only registered PC hub links`,
  );
  assert.equal(alternateFor(originalPath, article.locale), expectedAlternate(article.locale, path));
  assert.equal(languageAlternates(originalPath).ja, originalPath);
  assert.equal(languageAlternates(originalPath)['x-default'], originalPath);
  assert.equal(
    sitemapPaths.has(path),
    article.locale === 'en',
    `${path}: only indexed locales in sitemap`,
  );
  assert(
    isEditorialSnapshotPath(path),
    `${path}: public HTML snapshot allowed`,
  );
  assert.equal(
    repairCards.filter((card) => card.path === path).length,
    1,
    `${path}: one localized OG specification`,
  );
  if (article.slug === 'repair-or-replace') {
    assert.deepEqual(
      Object.keys(localizedRepairCosts[article.locale]).sort(),
      repairCostExamples.map((item) => item.id).sort(),
      `${path}: every cost example translated`,
    );
    for (const item of repairCostExamples) {
      const translation = localizedRepairCosts[article.locale][item.id];
      assert(
        translation.label && translation.conditions && translation.provider,
        `${path}: complete cost copy for ${item.id}`,
      );
      assert(
        html.includes(item.source.replaceAll('&', '&amp;')),
        `${path}: cost source ${item.id}`,
      );
    }
  }
  pages++;
}
for (const locale of locales) {
  assert.equal(hasTranslation(locale, '/pc/repair-or-replace'), true);
  assert.equal(
    hasTranslation(locale, '/pc'),
    locale === 'en',
    'Do not invent a translated PC hub',
  );
  assert.equal(
    hasTranslation(locale, '/pc/pc-broken'),
    locale === 'en',
    'Only the reviewed English hardware translation exists',
  );
  assert.equal(hasTranslation(locale, '/pc/repair-or-replace/extra'), false);
  assert.equal(
    isEditorialSnapshotPath(`/${locale}/diagnose`),
    false,
    'Diagnosis stays outside public snapshots',
  );
}
assert.equal(
  isEditorialSnapshotPath('/diagnose'),
  false,
  'Diagnosis stays outside public snapshots',
);

console.log(`PASS: ${pages} translated pages and three-game expansion parity`);
