import { compactSearchIndex } from './site-search';
import { englishSearchEntries } from './localized/home-en';
import { localizedArticles, localizedDiscordArticles } from './localized/index';
import { translatedCommonGuides } from './localized/save-guides-zh-es';
import { gameFacts } from './localized/game-facts';
import { guideUi } from './localized/guide-ui';
function translatedEntries(locale: 'zh' | 'es') {
  return [
    ...[...localizedArticles, ...localizedDiscordArticles].filter(a => a.locale === locale).map(a => ({
      href: a.gameSlug === 'discord' ? `/${locale}/discord/${a.slug}` : `/${locale}/games/${a.gameSlug}/${a.slug}`,
      title: a.title, label: a.gameName || (a.gameSlug === 'discord' ? 'Discord' : gameFacts[a.gameSlug].names[locale]), body: `${a.lead} ${a.summary}`,
    })),
    ...translatedCommonGuides.filter(g => g.locale === locale).map(g => ({ href: `/${locale}${g.path}`, title: g.title, label: guideUi[locale].index, body: g.description })),
    { href: `/${locale}/guide`, title: guideUi[locale].indexTitle, label: guideUi[locale].index, body: guideUi[locale].indexDescription },
  ];
}
export function ocrSearchIndexes() {
  return { ja: compactSearchIndex(), en: englishSearchEntries, zh: translatedEntries('zh'), es: translatedEntries('es') };
}
export type OcrSearchIndexes = ReturnType<typeof ocrSearchIndexes>;
