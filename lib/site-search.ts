import {
  document,
  rank,
  searchClusters,
  searchGames,
  type SearchArticle,
  type SearchDocument,
} from './search-core';
export {
  matchesNaturalQuery,
  normalizeSearchQuery,
  searchGames,
  searchQueryTerms,
  type SearchArticle,
} from './search-core';
import { games } from './games';
import { articleCategoryLabel, gameArticles } from './game-articles';
import { commonGuides } from './common-guides';
import { discordArticles } from './discord-articles';
import { pcArticles } from './pc-articles';
import { articleMatchesTrouble, troubleHubForGuide } from './trouble-hubs';

const gameBySlug = new Map(games.map((game) => [game.slug, game]));
const articleIndex: SearchDocument<SearchArticle>[] = [
  ...gameArticles.map((article) => {
    const game = gameBySlug.get(article.gameSlug);
    return document<SearchArticle>(
      {
        key: `game-${article.gameSlug}-${article.slug}`,
        href: `/games/${article.gameSlug}/${article.slug}`,
        label: `${game?.shortTitle ?? ''}・${articleCategoryLabel(article)}`,
        title: article.shortTitle,
        checkedAt: article.checkedAt,
        kind: 'game',
        gameArticle: article,
      },
      [article.title, article.shortTitle],
      [
        game?.title ?? '',
        game?.shortTitle ?? '',
        articleCategoryLabel(article),
      ],
      [article.symptom, article.description, article.metaDescription],
    );
  }),
  ...commonGuides
    .filter((guide) => guide.status === 'verified')
    .map((guide) =>
      document<SearchArticle>(
        {
          key: `guide-${guide.slug}`,
          href: `/guide/${guide.slug}`,
          label: 'PC共通ガイド',
          title: guide.shortTitle,
          checkedAt: guide.checkedAt,
          kind: 'guide',
          cluster: troubleHubForGuide(guide)?.slug,
        },
        [guide.title, guide.shortTitle],
        [],
        [guide.description, ...guide.causes],
      ),
    ),
  ...discordArticles
    .filter((article) => article.status === 'verified')
    .map((article) =>
      document<SearchArticle>(
        {
          key: `discord-${article.slug}`,
          href: `/discord/${article.slug}`,
          label: 'Discord',
          title: article.shortTitle,
          checkedAt: article.checkedAt,
          kind: 'discord',
          cluster: 'discord',
        },
        [article.title, article.shortTitle],
        ['Discord'],
        [article.symptom, article.metaDescription, ...article.quickFixes],
      ),
    ),
  ...pcArticles.map((article) =>
    document<SearchArticle>(
      {
        key: `pc-${article.slug}`,
        href: `/pc/${article.slug}`,
        label: 'PC・Windows',
        title: article.shortTitle,
        checkedAt: article.checkedAt,
        kind: 'pc',
        cluster: 'pc',
      },
      [article.title, article.shortTitle],
      ['PC Windows'],
      [article.lead, article.description, ...article.quickChecks],
    ),
  ),
];

export function searchArticles(
  query: string,
  cluster = 'all',
): SearchArticle[] {
  return rank(
    articleIndex.filter(
      ({ item }) =>
        cluster === 'all' ||
        (item.gameArticle
          ? articleMatchesTrouble(item.gameArticle, cluster)
          : item.cluster === cluster),
    ),
    query,
    (a, b) => b.checkedAt.localeCompare(a.checkedAt),
  );
}

/** Use the same index and matching rules as the UI for zero-result telemetry. */
export function hasSiteSearchResult(query: string) {
  return searchGames(query).length > 0 || searchArticles(query).length > 0;
}

/**
 * The article index without article bodies, for the browser. Each game
 * article carries the clusters it matches so filtering works client-side.
 */
export function compactSearchIndex(): SearchDocument<SearchArticle>[] {
  return articleIndex.map(({ item, ...entry }) => {
    const { gameArticle, ...rest } = item;
    return {
      ...entry,
      item: gameArticle
        ? {
            ...rest,
            troubles: searchClusters.filter((cluster) =>
              articleMatchesTrouble(gameArticle, cluster),
            ),
          }
        : rest,
    };
  });
}
