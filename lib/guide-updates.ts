import { articlesForGame } from './game-articles';
import { games } from './games';
import { localizedArticlesFor } from './localized/index';
import { gameDisplayName } from './game-display-name';
import type { MyGamesLocale } from './my-games-copy';
export type GuideUpdate = {
  id: string;
  gameSlug: string;
  gameName: string;
  title: string;
  href: string;
  date: string;
  kind: 'edited' | 'reviewed';
};
// Editorial revisions are separate from official patch announcements. No build-time dates.
export function guideUpdates(locale: MyGamesLocale): GuideUpdate[] {
  return games.flatMap((game) => {
    const articles =
      locale === 'ja'
        ? articlesForGame(game.slug).filter(
            (a) => (a.status || 'verified') === 'verified',
          )
        : localizedArticlesFor(locale, game.slug);
    return articles
      .map((article) => {
        const date = article.updatedAt ?? article.checkedAt;
        return {
          id: `${locale}-${game.slug}-${article.slug}-${date}`,
          gameSlug: game.slug,
          gameName: gameDisplayName(game, locale),
          title: article.shortTitle,
          href: `${locale === 'ja' ? '' : `/${locale}`}/games/${game.slug}/${article.slug}`,
          date,
          kind: article.updatedAt ? ('edited' as const) : ('reviewed' as const),
        };
      })
      .sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id))
      .slice(0, 4);
  });
}
