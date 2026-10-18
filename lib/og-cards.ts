import { englishHomeCopy, englishDirectoryCopy } from '@/lib/localized/home-copy-en';
import { remainingPagesEn } from '@/lib/localized/remaining-pages-en';
import { finalGamesEn } from '@/lib/localized/final-games-en';
import { aionGearsEn } from '@/lib/localized/aion-gears-en';
import { fallReleaseEn } from '@/lib/localized/fall-release-en';
import { codMw4En } from '@/lib/localized/cod-mw4-en';
import { dqmDemoEn } from '@/lib/localized/dqm-demo-en';
import { upcomingLaunchEn } from '@/lib/localized/upcoming-launch-en';
import { pcDiskEn } from '@/lib/localized/pc-disk-en';
import { starWarsBacklogEn } from '@/lib/localized/star-wars-backlog-en';
import { dawnwalkerBacklogEn } from '@/lib/localized/dawnwalker-backlog-en';
import { aniimoBacklogEn } from '@/lib/localized/aniimo-backlog-en';
import { dogmaPerformanceEn } from '@/lib/localized/dogma-performance-en';
import { palworldBacklogEn } from '@/lib/localized/palworld-backlog-en';
import { wildsBacklogEn } from '@/lib/localized/wilds-backlog-en';
import { eldenBacklogEn } from '@/lib/localized/elden-backlog-en';
import { discordRecommendedBotsEn } from '@/lib/localized/discord-recommended-bots-en';
import { pcHardwareEn } from '@/lib/localized/pc-hardware-en';
import { pcSecurityEn } from '@/lib/localized/pc-security-en';
import { pcUpdateStuckEn } from '@/lib/localized/pc-update-stuck-en';
import { pcUpdateExplorerEn } from '@/lib/localized/pc-update-explorer-en';
import { pcSleepSigninEn } from '@/lib/localized/pc-sleep-signin-en';
import { pcNetworkEn } from '@/lib/localized/pc-network-en';
import { pcGamingEn } from '@/lib/localized/pc-gaming-en';
import { pcUsbDisplayEn } from '@/lib/localized/pc-usb-display-en';
import { pcDeviceRecoveryEn } from '@/lib/localized/pc-device-recovery-en';
import { pcAudioEn } from '@/lib/localized/pc-audio-en';
import { discordListeningSpeechEn } from '@/lib/localized/discord-listening-speech-en';
import { discordPerformanceVersionEn } from '@/lib/localized/discord-performance-version-en';
import { discordRtcScreenHelperEn } from '@/lib/localized/discord-rtc-screen-helper-en';
import { discordNotificationsOverlayPhoneEn } from '@/lib/localized/discord-notifications-overlay-phone-en';
import { discordLoginMicNetworkEn } from '@/lib/localized/discord-login-mic-network-en';
import { discordEchoActivityVolumeEn } from '@/lib/localized/discord-echo-activity-volume-en';
import { discordCallCameraCrashEn } from '@/lib/localized/discord-call-camera-crash-en';
import { discordBluetoothBotsEn } from '@/lib/localized/discord-bluetooth-bots-en';
import { discordAudioChecksEn } from '@/lib/localized/discord-audio-checks-en';
import { discordLaunchEn } from '@/lib/localized/discord-launch-en';
import { translatedCommonGuides } from '@/lib/localized/save-guides-zh-es';
import { guideUi } from '@/lib/localized/guide-ui';
import { palworldBackupEn } from '@/lib/localized/palworld-backup-en';
import { discordCoreEn } from '@/lib/localized/discord-core-en';
import { commonGuidesEn } from '@/lib/localized/common-guides-en';
import { reportedCases, casePath } from '@/lib/reported-cases';
import { localizedPcRepairArticles } from '@/lib/localized/pc-repair-articles';
import { followupLocalizedArticles } from '@/lib/followups';
import { arcRaidersLocalizedArticles } from '@/lib/localized/arc-raiders';
import { nightreignLocalizedArticles } from '@/lib/localized/nightreign';
import { marvelRivalsLocalizedArticles } from '@/lib/localized/marvel-rivals';
import { aceCombatLaunchArticles } from '@/lib/localized/ace-combat-launch-articles';
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
      path: '/tools/refresh-rate',
      eyebrow: 'ブラウザ描画の確認ツール',
      title: 'モニターのHzとブラウザの値を比べる',
      itemsLabel: '測定の使い方と限界',
      items: [
        'Windowsの設定Hzを控える',
        'タブを表示して約4秒測る',
        'ゲームFPS・実Hzとは分けて判断',
      ],
    },
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
    ...reportedCases.flatMap((item) =>
      (['ja', 'en', 'zh', 'es'] as const).map((locale) => ({
        path: casePath(item, locale),
        eyebrow: item.copy[locale].badge,
        title: item.copy[locale].title,
        itemsLabel: item.copy[locale].limits,
        items: [item.cpu, item.gpu, item.copy[locale].unknown],
      })),
    ),
    ...discordCards,
    ...troubleCards,
    ...roundupCards,
    ...weeklyCards,
    ...pcCards,
    ...[
      ...pcAudioEn,
      ...pcDeviceRecoveryEn,
      ...pcUsbDisplayEn,
      ...pcGamingEn,
      ...pcNetworkEn,
      ...pcSleepSigninEn,
      ...pcUpdateExplorerEn,
      ...pcUpdateStuckEn,
      ...pcHardwareEn,
      ...pcSecurityEn,
      ...pcDiskEn,
    ].map((article) => ({
      path: `/en/pc/${article.slug}`,
      locale: article.locale,
      eyebrow: 'Windows PC troubleshooting',
      title: article.title,
      itemsLabel: 'Choose the matching check',
      items: article.steps.map((step) => step.title),
    })),
    ...localizedPcRepairArticles.map((article) => ({
      path: `/${article.locale}/pc/${article.slug}`,
      locale: article.locale,
      eyebrow: {
        en: 'PC repair and replacement',
        zh: '电脑维修与换新',
        es: 'Reparar o cambiar de PC',
      }[article.locale],
      title: article.title,
      itemsLabel: {
        en: 'Compare before buying',
        zh: '购买前先比较',
        es: 'Compara antes de comprar',
      }[article.locale],
      items:
        article.locale === 'es'
          ? [
              'Revisa seguridad, datos y garantía',
              'Distingue ajustes y falta de rendimiento',
              'Confirma si una ampliación basta',
              'Compara costes y condiciones',
            ]
          : article.steps.map((step) => step.title),
    })),
    ...gearCards,
    ...[
      ...arcRaidersLocalizedArticles,
      ...nightreignLocalizedArticles,
      ...marvelRivalsLocalizedArticles,
      ...aceCombatLaunchArticles,
      ...rocketLeagueLocalizedArticles,
      ...localizedDiscordUploadArticles,
      ...discordCoreEn,
      ...discordLaunchEn,
      ...discordAudioChecksEn,
      ...discordBluetoothBotsEn,
      ...discordCallCameraCrashEn,
      ...discordEchoActivityVolumeEn,
      ...discordNotificationsOverlayPhoneEn,
      ...discordLoginMicNetworkEn,
      ...discordRtcScreenHelperEn,
      ...discordPerformanceVersionEn,
      ...discordListeningSpeechEn,
      ...discordRecommendedBotsEn,
      ...followupLocalizedArticles,
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
    ...[
      'aniimo',
      'ace-combat-8',
      'star-wars-zero-company',
      'the-blood-of-dawnwalker',
    ].map((gameSlug) => ({
      path: `/en/games/${gameSlug}`,
      locale: 'en' as const,
      eyebrow: 'PC troubleshooting guides',
      title: localizedHubs[gameSlug].title!.en!,
      itemsLabel: 'Choose the matching check',
      items: localizedHubs[gameSlug].checklist!.en!.slice(0, 4),
    })),
    ...[
      'overwatch-2',
      'pubg',
      'arc-raiders',
      'elden-ring-nightreign',
      'marvel-rivals',
      'valorant',
      'apex-legends',
      'fortnite',
      'battlefield-6',
    ].flatMap((gameSlug) =>
      (['en', 'zh', 'es'] as const).map((locale) => ({
        path: `/${locale}/games/${gameSlug}`,
        locale,
        eyebrow: {
          en: 'PC troubleshooting guides',
          zh: 'PC 版问题排查',
          es: 'Guías para resolver problemas en PC',
        }[locale],
        title: localizedHubs[gameSlug].title![locale]!,
        itemsLabel: {
          en: 'Choose your symptom',
          zh: '选择你的症状',
          es: 'Elige el síntoma',
        }[locale],
        items: [
          ...arcRaidersLocalizedArticles,
          ...nightreignLocalizedArticles,
          ...marvelRivalsLocalizedArticles,
          ...followupLocalizedArticles,
        ]
          .filter(
            (article) =>
              article.gameSlug === gameSlug && article.locale === locale,
          )
          .map((article) => article.shortTitle),
      })),
    ),
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
    ...[
      ...finalGamesEn,
      ...aionGearsEn,
      ...fallReleaseEn,
      ...codMw4En,
      ...dqmDemoEn,
      ...upcomingLaunchEn,
      ...starWarsBacklogEn,
      ...dawnwalkerBacklogEn,
      ...aniimoBacklogEn,
      ...dogmaPerformanceEn,
      ...palworldBacklogEn,
      ...wildsBacklogEn,
      ...eldenBacklogEn,
      ...palworldBackupEn,
      ...recentGameArticlesEn,
      ...onimushaArticlesEn,
    ].map((article) => ({
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
    ...[
      {path:'/en',title:englishHomeCopy.title,items:['Choose a symptom','Find your game','Windows and Discord help']},
      {path:'/en/articles',title:englishDirectoryCopy.title,items:['Game-specific fixes','Windows and Discord','Tools and reference pages']},
    ].map(p=>({...p,locale:'en' as const,eyebrow:'PC troubleshooting',itemsLabel:'Find your next check'})),
    {
      path: '/en/pc',
      locale: 'en' as const,
      eyebrow: 'Windows PC troubleshooting',
      title: 'Windows PC troubleshooting guides',
      itemsLabel: 'Compare one change at a time',
      items: [
        'Audio output and microphones',
        'Bluetooth detection and pairing',
        'Update-related changes',
        'Repair and replacement decisions',
      ],
    },
    {
      path: '/en/discord',
      locale: 'en' as const,
      eyebrow: 'Discord troubleshooting',
      title: 'Discord launch, update, voice and sharing checks',
      itemsLabel: 'Find the affected part',
      items: [
        'Launch and updates',
        'Installation errors',
        'Voice and screen share',
        'File uploads',
      ],
    },
    {
      path: '/en/guide',
      locale: 'en' as const,
      eyebrow: 'PC game troubleshooting',
      title: 'Find your next PC game check',
      itemsLabel: 'Choose your symptom',
      items: [
        'Launch and file repair',
        'Crashes and black screens',
        'GPU drivers',
        'Low FPS and stutter',
      ],
    },
    ...(['zh', 'es'] as const).map((locale) => ({
      path: `/${locale}/guide`,
      locale,
      eyebrow: guideUi[locale].index,
      title: guideUi[locale].indexTitle,
      itemsLabel: guideUi[locale].read,
      items: translatedCommonGuides
        .filter((g) => g.locale === locale)
        .map((g) => g.shortTitle),
    })),
    ...translatedCommonGuides.map((g) => ({
      path: `/${g.locale}${g.path}`,
      locale: g.locale,
      eyebrow: g.category,
      title: g.title,
      itemsLabel: guideUi[g.locale].read,
      items: g.steps.map((s) => s.title),
    })),
    ...commonGuidesEn.map((guide) => ({
      path: `/en${guide.path}`,
      locale: 'en' as const,
      eyebrow: 'PC game troubleshooting',
      title: guide.title,
      itemsLabel: 'Find your next check',
      items: guide.steps.map((step) => step.title),
    })),
    ...[
      {path:'/en/my',title:'My Page: Saved Articles, Games and PC',items:['Reading list','Your PC specifications','Diagnosis and solution notes','Browser-only storage']},
      {path:'/en/my-games',title:'My Games: Keep Your Progress and Solutions',items:['Find and save games','Record settings and checks','Back up your records','Continue where you left off']},
      {path:'/en/reports',title:'Share a PC Game Problem Report',items:['Review the public preview','Describe what you tried','Keep personal information out','Submission and review status']},
      {path:'/en/discord-servers/submit',title:'Apply for a Discord Server Listing',items:['Japanese-speaking communities','Describe joining conditions','Review the listing guidelines','Applications are reviewed']},
    ].map(p=>({...p,locale:'en' as const,eyebrow:'Tools and community',itemsLabel:'What you can do'})),
    ...remainingPagesEn.map((p) => ({
      ...p,
      path: `/en${p.path}`,
      locale: 'en' as const,
      eyebrow: 'Gemnao · PC gaming help',
      itemsLabel: 'What this page covers',
    })),
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
