// Per-page social preview cards. Everything is derived from the article
// registries, so a new article gets a card spec without extra data.
// Run `pnpm og:cards` after adding or renaming articles to render the PNGs.
import { commonGuides } from '@/lib/common-guides';
import { discordArticles } from '@/lib/discord-articles-all';
import { gameArticles } from '@/lib/game-articles';
import { games } from '@/lib/games';
import { releaseRoundups } from '@/lib/release-roundups';
import { troubleHubs } from '@/lib/trouble-hubs';
import { pcArticles } from '@/lib/pc-articles';
import { gearArticles } from '@/lib/gear-articles';
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
        title:
          game.slug === 'aniimo'
            ? game.hubTitle!
            : `${game.shortTitle} PC版の不具合・エラー対処法`,
        itemsLabel: '症状から探す',
        items: articles.slice(0, 4).map((article) => article.shortTitle),
      },
      ...articles.map((article) => ({
        path: `/games/${game.slug}/${article.slug}`,
        eyebrow: `${game.shortTitle}｜PC版トラブル解決`,
        title: article.ogTitle || article.title,
        itemsLabel: '上から順番に試す',
        items:
          article.ogSteps ||
          article.steps.slice(0, 4).map((step) => step.title),
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
      itemsLabel:
        guide.slug === 'directx-error'
          ? 'エラー名から対処を選ぶ'
          : '上から順番に試す',
      items: guide.steps.slice(0, 4).map((step) => step.title),
    }));
  const discordCards = discordArticles
    .filter((article) => article.status === 'verified')
    .filter((article) => !discordArticleVisualBySlug(article.slug))
    .map((article) => ({
      path: `/discord/${article.slug}`,
      eyebrow: 'Discordトラブル解決',
      title: article.ogTitle || article.title,
      itemsLabel: '原因と対処法',
      items:
        article.ogSteps ||
        article.causes.slice(0, 4).map((cause) => cause.title),
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
  const roundupCards = releaseRoundups.map((roundup) => ({
    path: `/new-releases/${roundup.slug}`,
    eyebrow: '新作PCゲームの動作環境',
    title: roundup.title,
    itemsLabel: 'GTX 1660では最低環境に届かない',
    items: roundup.games
      .filter((game) => game.gtx1660 === 'no')
      .slice(0, 4)
      .map((game) => game.name),
  }));
  const pcCards = [
    {
      path: '/pc',
      eyebrow: 'PC・Windowsの不具合',
      title: 'PC・Windowsの不具合を症状から探す',
      itemsLabel: '発生条件から探す',
      items: pcArticles.slice(0, 4).map((a) => a.shortTitle),
    },
    ...pcArticles.map((article) => ({
      path: `/pc/${article.slug}`,
      eyebrow: 'PC・Windowsの不具合',
      title: article.title,
      itemsLabel: '順番に確認',
      items: article.steps.map((step) => step.title),
    })),
  ];
  const gearCards = [
    {
      path: '/gear',
      eyebrow: 'ゲーマー向けデバイス',
      title: 'ゲーマー向けデバイス｜できること・買う前の確認点',
      itemsLabel: '掲載デバイス',
      items: gearArticles.slice(0, 4).map((a) => a.shortTitle),
    },
    ...gearArticles.map((article) => ({
      path: `/gear/${article.slug}`,
      eyebrow: 'ゲーマー向けデバイス',
      title: article.title,
      itemsLabel: 'できること',
      items: article.features.slice(0, 4).map((f) => f.title),
    })),
  ];
  return [
    {
      path: '/discord-servers',
      eyebrow: 'PCゲーム｜Discordサーバー募集',
      title: 'Discordサーバー募集を条件から探す',
      itemsLabel: '参加前に確認',
      items: [
        'ゲームと募集目的',
        '活動時間',
        'VC条件と参加ルール',
        '招待リンクと募集継続',
      ],
    },
    ...gameCards,
    ...guideCards,
    ...discordCards,
    ...troubleCards,
    ...roundupCards,
    ...pcCards,
    ...gearCards,
  ].filter((card) => card.items.length);
}
