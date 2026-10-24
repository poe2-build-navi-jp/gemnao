// Builds the compact article index used by lib/fix-save.ts. Only the fields
// that saving a fix and the report link need (title, game, check date, step
// ids and titles, category) are kept, so browser code does not have to ship
// the full article bodies.
// Regenerate lib/article-review-index.ts with `pnpm review:index`.
import { gameArticles } from './game-articles';
import { commonGuides } from './common-guides';
import { discordArticles } from './discord-articles';

export type ArticleReview = {
  path: string;
  title: string;
  gameSlug: string;
  checkedOn: string;
  steps: { id: string; title: string }[];
};

export function buildArticleReviewIndex() {
  const reviews: Record<string, Omit<ArticleReview, 'path'>> = {};
  const add = (path: string, review: Omit<ArticleReview, 'path'>) => {
    // The first match wins, as with the previous Array.find lookups.
    if (!(path in reviews)) reviews[path] = review;
  };
  for (const a of gameArticles)
    if (!['draft', 'thin'].includes(a.status || 'verified'))
      add(`/games/${a.gameSlug}/${a.slug}`, {
        title: a.title,
        gameSlug: a.gameSlug,
        checkedOn: a.checkedAt,
        steps: a.steps.map((s) => ({ id: s.id, title: s.title })),
      });
  for (const g of commonGuides)
    if (g.status === 'verified')
      add(`/guide/${g.slug}`, {
        title: g.title,
        gameSlug: '',
        checkedOn: g.checkedAt,
        steps: g.steps.map((s, i) => ({ id: `step-${i + 1}`, title: s.title })),
      });
  for (const d of discordArticles)
    if (d.status === 'verified')
      add(`/discord/${d.slug}`, {
        title: d.title,
        gameSlug: '',
        checkedOn: d.checkedAt,
        steps: d.causes.map((s, i) => ({
          id: `cause-${i + 1}`,
          title: s.title,
        })),
      });
  // Contexts resolve through every game article (any status), as before.
  const gameContexts: Record<string, string> = {};
  for (const a of gameArticles) {
    const context = `game-${a.gameSlug}-${a.slug}`;
    if (!(context in gameContexts))
      gameContexts[context] = `/games/${a.gameSlug}/${a.slug}`;
  }
  // ReportEntryLink: an article's category (first match, any status) and the
  // games that have at least one published article.
  const categories: Record<string, string> = {};
  for (const a of gameArticles) {
    const path = `/games/${a.gameSlug}/${a.slug}`;
    if (!(path in categories)) categories[path] = a.category;
  }
  const reportableGames = [
    ...new Set(
      gameArticles
        .filter((a) => !['draft', 'thin'].includes(a.status || 'verified'))
        .map((a) => a.gameSlug),
    ),
  ];
  return { reviews, gameContexts, categories, reportableGames };
}
