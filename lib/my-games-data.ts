import { changesForGame, type VisibleGameChange } from '@/lib/my-game-changes';
import { games } from '@/lib/games';
import { articlesForGame } from '@/lib/game-articles';
import { gameFacts } from '@/lib/localized/game-facts';
import { gameDisplayName } from '@/lib/game-display-name';
import { localizedHubs } from '@/lib/localized/hubs';
import { hasTranslation, localizedArticlesFor } from '@/lib/localized/index';
import { steamAppIds } from '@/lib/status/sources';
import type { MyGamesLocale } from '@/lib/my-games-copy';

export type SavedGameChoice = {
  slug: string;
  name: string;
  searchNames: string;
  hub: string;
  hubJapanese: boolean;
  articles: { href: string; label: string; japanese: boolean }[];
  hasNews: boolean;
  officialChanges?: VisibleGameChange[];
};
export function myGamesData(locale: MyGamesLocale): SavedGameChoice[] {
  return games.map((game) => {
    const translated =
      locale === 'ja' ? [] : localizedArticlesFor(locale, game.slug);
    const path = `/games/${game.slug}`;
    const localHub = locale !== 'ja' && hasTranslation(locale, path);
    const fallbackName = gameDisplayName(game, 'en');
    const name =
      locale === 'ja'
        ? game.shortTitle
        : gameFacts[game.slug]?.names[locale] ||
          localizedHubs[game.slug]?.names?.[locale] ||
          translated.find((article) => article.gameName)?.gameName ||
          fallbackName;
    return {
      slug: game.slug,
      name,
      searchNames: [
        name,
        fallbackName,
        game.slug,
        game.slug.replaceAll('-', ' '),
        game.title,
        game.shortTitle,
        ...Object.values(gameFacts[game.slug]?.names || {}),
        ...Object.values(localizedHubs[game.slug]?.names || {}),
      ].join(' '),
      hub: localHub ? `/${locale}${path}` : path,
      hubJapanese: locale !== 'ja' && !localHub,
      articles: translated.length
        ? translated.slice(0, 4).map((article) => ({
            href: `/${locale}${path}/${article.slug}`,
            label: article.shortTitle,
            japanese: false,
          }))
        : articlesForGame(game.slug)
            .filter(
              (article) =>
                !['draft', 'thin'].includes(article.status || 'verified'),
            )
            .slice(0, 4)
            .map((article) => ({
              href: `${path}/${article.slug}`,
              label: article.shortTitle,
              japanese: locale !== 'ja',
            })),
      hasNews: Boolean(steamAppIds[game.slug]),
      officialChanges: changesForGame(game.slug, locale),
    };
  });
}
