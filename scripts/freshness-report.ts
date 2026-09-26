import { gameArticles } from '../lib/game-articles';
import { games } from '../lib/games';
import { commonGuides } from '../lib/common-guides';
import { discordArticles } from '../lib/discord-articles';

const today = new Date();
const daysSince = (date: string) =>
  Math.floor(
    (today.getTime() - new Date(`${date}T00:00:00Z`).getTime()) / 86_400_000,
  );
const rows = [
  ...gameArticles.map((article) => {
    const game = games.find((item) => item.slug === article.gameSlug);
    return {
      url: `/games/${article.gameSlug}/${article.slug}`,
      title: article.shortTitle,
      category: game?.shortTitle || article.gameSlug,
      lastReviewed: article.checkedAt,
      status: article.status || 'verified',
      reviewAfterDays: game?.focused ? 14 : 60,
    };
  }),
  ...commonGuides.map((guide) => ({
    url: `/guide/${guide.slug}`,
    title: guide.shortTitle,
    category: 'PC共通',
    lastReviewed: guide.checkedAt,
    status: guide.status || 'verified',
    reviewAfterDays: 90,
  })),
  ...discordArticles.map((article) => ({
    url: `/discord/${article.slug}`,
    title: article.shortTitle,
    category: 'Discord',
    lastReviewed: article.checkedAt,
    status: article.status || 'verified',
    reviewAfterDays: 60,
  })),
]
  .map((row) => {
    const days = daysSince(row.lastReviewed);
    return {
      ...row,
      daysSinceReview: Number.isFinite(days) ? days : null,
      needsReview:
        row.status === 'needs-review' ||
        !Number.isFinite(days) ||
        days >= row.reviewAfterDays,
    };
  })
  .sort(
    (a, b) =>
      Number(b.needsReview) - Number(a.needsReview) ||
      (b.daysSinceReview ?? Infinity) / b.reviewAfterDays -
        (a.daysSinceReview ?? Infinity) / a.reviewAfterDays ||
      a.url.localeCompare(b.url),
  );

console.log(
  JSON.stringify(
    {
      generatedAt: today.toISOString(),
      summary: {
        total: rows.length,
        needsReview: rows.filter((row) => row.needsReview).length,
        nextUp: rows.filter((row) => !row.needsReview).slice(0, 10).length,
      },
      // Review dates change only after a human checks the article and its sources.
      queue: rows,
    },
    null,
    2,
  ),
);
