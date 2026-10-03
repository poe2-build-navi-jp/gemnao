import { onimushaArticlesEn } from '@/lib/localized/onimusha-articles-en';
import { rocketLeagueLocalizedArticles } from '@/lib/localized/rocket-league-articles';
import { localizedDiscordUploadArticles } from '@/lib/localized/discord-upload-articles';
import { localizedHubs } from '@/lib/localized/hubs';
import { recentGameArticlesEn } from '@/lib/localized/recent-game-articles-en';
import { gearGuidesEn } from '@/lib/localized/gear-guides-en';
import { crashGuideEn, crashSectionsEn } from '@/lib/localized/crash-guide-en';
import { pcHub } from '@/lib/pc-hub';
// Per-page social preview cards. Everything is derived from the article
// registries, so a new article gets a card spec without extra data.
// Run `pnpm og:cards` after adding or renaming articles to render the PNGs.
import { commonGuides } from '@/lib/common-guides';
import { discordArticles } from '@/lib/discord-articles-all';
import { gameArticles } from '@/lib/game-articles';
import { games } from '@/lib/games';
import { releaseRoundups } from '@/lib/release-roundups';
import { weeklyReports } from '@/lib/weekly-reports';
import { troubleHubs } from '@/lib/trouble-hubs';
import { pcArticles } from '@/lib/pc-articles';
import { gearArticles } from '@/lib/gear-articles';
import { gearGuides } from '@/lib/gear-guides';
import {
  discordArticleVisualBySlug,
  guideVisualBySlug,
  troubleVisualBySlug,
} from '@/lib/visual-guides';

export type OgCardSpec = {
  locale?: 'en' | 'zh' | 'es';
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
          game.hubTitle ||
          (game.slug === 'aniimo'
            ? game.hubTitle!
            : `${game.shortTitle} PC版の不具合・エラー対処法`),
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
  const weeklyCards = weeklyReports.map((report) => ({
    path: `/weekly/${report.slug}`,
    eyebrow: '今週のPCゲーム不具合まとめ',
    title: `${report.period}の公式パッチ・障害・エラー`,
    itemsLabel: '今週の主なゲーム',
    items: [...new Set(report.items.map((item) => item.game))].slice(0, 4),
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
      title: pcHub.title,
      itemsLabel: '症状に合う確認先へ',
      items: [
        '黒い画面・起動しない',
        'Wi-Fi・インターネット',
        '音声・マイク',
        'USB-C・モニター',
      ],
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
      items: [...gearGuides, ...gearArticles]
        .slice(0, 4)
        .map((a) => a.shortTitle),
    },
    ...gearGuides.map((guide) => ({
      path: `/gear/${guide.slug}`,
      eyebrow: 'ゲーマー向けデバイス',
      title: guide.title,
      itemsLabel: '買う前の判断',
      items: guide.sections.slice(0, 4).map((section) => section.title),
    })),
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
    ...weeklyCards,
    ...pcCards,
    ...gearCards,
    ...[
      ...rocketLeagueLocalizedArticles,
      ...localizedDiscordUploadArticles,
    ].map((article) => ({
      path:
        article.gameSlug === 'discord'
          ? `/${article.locale}/discord/${article.slug}`
          : `/${article.locale}/games/${article.gameSlug}/${article.slug}`,
      locale: article.locale,
      eyebrow: {
        en: 'Troubleshooting guide',
        zh: '故障排查指南',
        es: 'Guía de solución de problemas',
      }[article.locale],
      title: article.title,
      itemsLabel: {
        en: 'Choose the matching check',
        zh: '选择对应的检查步骤',
        es: 'Elige la comprobación adecuada',
      }[article.locale],
      items: article.steps.slice(0, 4).map((step) => step.title),
    })),
    ...(['en', 'zh', 'es'] as const).map((locale) => ({
      path: `/${locale}/games/rocket-league`,
      locale,
      eyebrow: {
        en: 'Rocket League PC help',
        zh: 'Rocket League PC 版帮助',
        es: 'Ayuda de Rocket League para PC',
      }[locale],
      title: {
        en: 'DualSense not working in Rocket League?',
        zh: 'Rocket League 无法使用 DualSense 手柄？',
        es: '¿Tu DualSense no funciona en Rocket League?',
      }[locale],
      itemsLabel: {
        en: 'Start with your setup',
        zh: '先确认使用环境',
        es: 'Empieza por tu configuración',
      }[locale],
      items:
        localizedHubs['rocket-league'].checklist?.[locale]?.slice(0, 4) || [],
    })),
    {
      path: '/en/tools',
      locale: 'en' as const,
      eyebrow: 'PC gaming tools and guides',
      title: 'PC gaming tools and quick references',
      itemsLabel: 'Choose what you need',
      items: [
        'Windows game diagnosis',
        'Crash troubleshooting',
        'Save backups and storage',
      ],
    },
    {
      path: '/en/tools/windows-diagnosis',
      locale: 'en' as const,
      eyebrow: 'Unsigned Windows prototype',
      title: 'PC Game Diagnosis for Windows',
      itemsLabel: 'English and Japanese',
      items: [
        'Choose a game and symptom',
        'Review local Windows records',
        'Track one step at a time',
        'Read privacy and safety limits',
      ],
    },
    ...[...recentGameArticlesEn, ...onimushaArticlesEn].map((article) => ({
      path: `/en/games/${article.gameSlug}/${article.slug}`,
      locale: 'en' as const,
      eyebrow: 'PC game troubleshooting',
      title: article.title,
      itemsLabel: 'Checks in order',
      items: article.steps.slice(0, 4).map((step) => step.title),
    })),
    {
      path: '/en/games/onimusha-way-of-the-sword',
      locale: 'en' as const,
      eyebrow: 'PC troubleshooting guides',
      title: 'Onimusha: Way of the Sword PC Help',
      itemsLabel: 'Choose your symptom',
      items: [
        'Launch crashes and CrashReport',
        'GPU drivers and shader caches',
        'Black screens and HDR',
        'Low FPS and stuttering',
      ],
    },
    ...gearGuidesEn.map((guide) => ({
      path: `/en/gear/${guide.slug}`,
      locale: 'en' as const,
      eyebrow: 'Before-you-buy guide',
      title: guide.title,
      itemsLabel: 'Check before spending',
      items: guide.sections.slice(0, 4).map((section) => section.title),
    })),
    {
      path: `/en${crashGuideEn.path}`,
      locale: 'en' as const,
      eyebrow: 'PC game troubleshooting',
      title: crashGuideEn.title,
      itemsLabel: 'Find your next check',
      items: crashSectionsEn
        .filter((section) =>
          [
            'crash-scope',
            'crash-timing',
            'crash-history',
            'steam-client-case',
          ].includes(section.id),
        )
        .map((section) => section.title),
    },
  ].filter((card) => card.items.length);
}
