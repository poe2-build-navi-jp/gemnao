// Newest checked articles for the site footer. Every page links to them, so
// crawlers revisiting the few already-indexed pages also find new articles.
import { gameArticles } from './game-articles';
import { games } from './games';
import { localizedArticles } from './localized/index';

const byNewest = <T extends { checkedAt: string }>(items: T[]) =>
  items
    .map((item, index) => ({ item, index }))
    .sort(
      (a, b) =>
        b.item.checkedAt.localeCompare(a.item.checkedAt) || a.index - b.index,
    )
    .map(({ item }) => item);

export function latestJapaneseArticles(limit = 8) {
  const names = new Map(games.map((game) => [game.slug, game.shortTitle]));
  return byNewest(
    gameArticles.filter(
      (article) => !['draft', 'thin'].includes(article.status || 'verified'),
    ),
  )
    .slice(0, limit)
    .map((article) => ({
      href: `/games/${article.gameSlug}/${article.slug}`,
      label: `${names.get(article.gameSlug) || article.gameSlug}：${article.shortTitle}`,
    }));
}

export function latestEnglishArticles(limit = 6) {
  return byNewest(localizedArticles.filter((a) => a.locale === 'en'))
    .slice(0, limit)
    .map((article) => ({
      href: `/en/games/${article.gameSlug}/${article.slug}`,
      label: `${article.gameName || article.gameSlug}: ${article.shortTitle}`,
    }));
}
