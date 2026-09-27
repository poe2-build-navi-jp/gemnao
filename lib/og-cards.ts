// Per-page social preview cards. Everything is derived from the article
// registries, so a new article gets a card spec without extra data.
// Run `pnpm og:cards` after adding or renaming articles to render the PNGs.
import { commonGuides } from '@/lib/common-guides';
import { discordArticles } from '@/lib/discord-articles-all';
import { gameArticles } from '@/lib/game-articles';
import { games } from '@/lib/games';
import { troubleHubs } from '@/lib/trouble-hubs';
import {
  discordArticleVisualBySlug,
  guideVisualBySlug,
  troubleVisualBySlug,
} from '@/lib/visual-guides';

export type OgCardSpec = {
  path: string;
  eyebrow: string;
  title: string;
  itemsLabel: string;
  items: string[];
};

const indexable = (status?: string) =>
  !['draft', 'thin'].includes(status || 'verified');

export function ogCardSpecs(): OgCardSpec[] {
  const gameCards = games.flatMap((game) => {
    const articles = gameArticles.filter(
      (article) => article.gameSlug === game.slug && indexable(article.status),
    );
    return [
      {
        path: `/games/${game.slug}`,
        eyebrow: 'PC版トラブル解決まとめ',
        title: `${game.shortTitle} PC版の不具合・エラー対処法`,
        itemsLabel: '症状から探す',
        items: articles.slice(0, 4).map((article) => article.shortTitle),
      },
      ...articles.map((article) => ({
        path: `/games/${game.slug}/${article.slug}`,
        eyebrow: `${game.shortTitle}｜PC版トラブル解決`,
        title: article.title,
        itemsLabel: '上から順番に試す',
        items: article.steps.slice(0, 4).map((step) => step.title),
      })),
    ];
  });
  // Pages that already have a hand-made flow chart keep that image.
  const guideCards = commonGuides
    .filter((guide) => guide.status === 'verified')
    .filter((guide) => !guideVisualBySlug(guide.slug))
    .map((guide) => ({
      path: `/guide/${guide.slug}`,
      eyebrow: 'PCゲーム共通トラブル',
      title: guide.title,
      itemsLabel: '上から順番に試す',
      items: guide.steps.slice(0, 4).map((step) => step.title),
    }));
  const discordCards = discordArticles
    .filter((article) => article.status === 'verified')
    .filter((article) => !discordArticleVisualBySlug(article.slug))
    .map((article) => ({
      path: `/discord/${article.slug}`,
      eyebrow: 'Discordトラブル解決',
      title: article.title,
      itemsLabel: '原因と対処法',
      items: article.causes.slice(0, 4).map((cause) => cause.title),
    }));
  const troubleCards = troubleHubs
    .filter((hub) => !troubleVisualBySlug(hub.slug))
    .map((hub) => ({
      path: `/trouble/${hub.slug}`,
      eyebrow: '症状から探す',
      title: hub.title,
      itemsLabel: 'まず試すこと',
      items: hub.quickChecks.slice(0, 4),
    }));
  return [...gameCards, ...guideCards, ...discordCards, ...troubleCards].filter(
    (card) => card.items.length,
  );
}
