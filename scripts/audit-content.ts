import { commonGuides } from '../lib/common-guides';
import { commonGuideCategories } from '../lib/common-guide-categories';
import { discordArticles } from '../lib/discord-articles';
import { gameArticles } from '../lib/game-articles';
import { gameBySlug } from '../lib/games';

type InventoryRow = {
  url: string;
  title: string;
  h1: string;
  description: string;
  category: string;
  game: string;
  symptom: string;
  tags: string[];
  searchIntent: string;
  lastReviewed: string;
};

const visible = <T extends { status?: string }>(item: T) =>
  !['draft', 'thin'].includes(item.status || 'verified');

const gameRows: InventoryRow[] = gameArticles
  .filter(visible)
  .map((article) => ({
    lastReviewed: article.checkedAt,
    url: `/games/${article.gameSlug}/${article.slug}`,
    title: article.seoTitle,
    h1: article.title,
    description: article.metaDescription,
    category: article.category,
    game: gameBySlug(article.gameSlug)?.title || article.gameSlug,
    symptom: article.symptom,
    tags: article.symptoms.map((item) => item.label),
    searchIntent: `${gameBySlug(article.gameSlug)?.shortTitle || article.gameSlug}で${article.symptom}`,
  }));

const discordRows: InventoryRow[] = discordArticles
  .filter(visible)
  .map((article) => ({
    lastReviewed: article.checkedAt,
    url: `/discord/${article.slug}`,
    title: article.seoTitle,
    h1: article.title,
    description: article.metaDescription,
    category: `discord-${article.category}`,
    game: 'Discord',
    symptom: article.symptom,
    tags: article.causes.map((item) => item.title),
    searchIntent: `Discordで${article.symptom}`,
  }));

const guideRows: InventoryRow[] = commonGuides.filter(visible).map((guide) => ({
  lastReviewed: guide.checkedAt,
  url: `/guide/${guide.slug}`,
  title: guide.title,
  h1: guide.title,
  description: guide.description,
  category: 'pc-common',
  game: 'PCゲーム共通',
  symptom: guide.description,
  tags: guide.causes,
  searchIntent: guide.description,
}));

const inventory = [...gameRows, ...discordRows, ...guideRows];
const normalized = (value: string) => value.replaceAll(/\s|【.*?】|｜.*$/g, '');
const duplicateTitles = Object.entries(
  Object.groupBy(inventory, (row) => normalized(row.title)),
)
  .filter(([, rows]) => (rows?.length || 0) > 1)
  .map(([key, rows]) => ({ key, urls: rows?.map((row) => row.url) }));
const duplicateH1s = Object.entries(
  Object.groupBy(inventory, (row) => normalized(row.h1)),
)
  .filter(([, rows]) => (rows?.length || 0) > 1)
  .map(([key, rows]) => ({ key, urls: rows?.map((row) => row.url) }));
const categorySlugs = commonGuideCategories.flatMap((category) =>
  category.slugs.map((slug) => ({ category: category.id, slug })),
);
const publishedGuideSlugs = new Set(guideRows.map((row) => row.url.slice(7)));
const missingGuideCategories = [...publishedGuideSlugs].filter(
  (slug) => !categorySlugs.some((item) => item.slug === slug),
);
const unknownCategorySlugs = categorySlugs.filter(
  (item) => !publishedGuideSlugs.has(item.slug),
);
const duplicateCategorySlugs = Object.entries(
  Object.groupBy(categorySlugs, (item) => item.slug),
)
  .filter(([, rows]) => (rows?.length || 0) > 1)
  .map(([slug, rows]) => ({
    slug,
    categories: rows?.map((row) => row.category),
  }));

const genericSteps = [
  ...gameArticles.flatMap((a) =>
    a.steps.map((step) => ({
      url: `/games/${a.gameSlug}/${a.slug}`,
      step: step.title,
      actions: step.actions,
    })),
  ),
  ...commonGuides.flatMap((a) =>
    a.steps.map((step) => ({
      url: `/guide/${a.slug}`,
      step: step.title,
      actions: step.actions,
    })),
  ),
].filter((step) =>
  step.actions.some((action) => /」(?:だけ)?を実施し/.test(action)),
);

console.log(
  JSON.stringify(
    {
      counts: {
        allArticles: inventory.length,
        gameArticles: gameRows.length,
        discordArticles: discordRows.length,
        commonGuides: guideRows.length,
      },
      genericSteps,
      duplicateTitles,
      duplicateH1s,
      commonGuideCategoryCoverage: {
        categorized: categorySlugs.length,
        missingGuideCategories,
        unknownCategorySlugs,
        duplicateCategorySlugs,
      },
      inventory,
    },
    null,
    2,
  ),
);
