import type { MetadataRoute } from 'next';
import { gearGuidesEn } from '@/lib/localized/gear-guides-en';
import { games } from '@/lib/games';
import { gameArticles, hubIndexable } from '@/lib/game-articles';
import { commonGuides } from '@/lib/common-guides';
import { discordArticles } from '@/lib/discord-articles-all';
import { troubleHubs } from '@/lib/trouble-hubs';
import { releaseRoundups } from '@/lib/release-roundups';
import { weeklyReports } from '@/lib/weekly-reports';
import { pcArticles } from '@/lib/pc-articles';
import { locales } from '@/lib/i18n';
import { gameFacts } from '@/lib/localized/game-facts';
import { localizedHubs } from '@/lib/localized/hubs';
import {
  localizedArticles,
  localizedDiscordArticles,
  localizedGameSlugsFor,
} from '@/lib/localized/index';
import { gearArticles } from '@/lib/gear-articles';
import { gearGuides } from '@/lib/gear-guides';
export default function sitemap(): MetadataRoute.Sitemap {
  if (process.env.NEXT_PUBLIC_SITE_PUBLIC === 'false') return [];
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://gemnao.pages.dev';
  const fixed = [
    { path: '', updated: '2026-09-30' },
    { path: '/guide', updated: '2026-09-12' },
    { path: '/discord', updated: '2026-09-30' },
    { path: '/status', updated: '2026-10-01' },
    { path: '/tools', updated: '2026-10-03' },
    { path: '/tools/windows-diagnosis', updated: '2026-10-03' },
    { path: '/tools/save-locations', updated: '2026-10-01' },
    { path: '/tools/refresh-rate', updated: '2026-10-01' },
    { path: '/pc', updated: '2026-10-01' },
    { path: '/discord-servers', updated: '2026-09-30' },
    { path: '/discord-servers/guidelines', updated: '2026-09-17' },
    { path: '/about', updated: '2026-09-30' },
    { path: '/contact', updated: '2026-09-17' },
    { path: '/privacy', updated: '2026-09-17' },
    { path: '/terms', updated: '2026-09-17' },
  ];
  const articles = gameArticles
    .filter(
      (article) => !['draft', 'thin'].includes(article.status || 'verified'),
    )
    .map((article) => ({
      url: `${base}/games/${article.gameSlug}/${article.slug}`,
      lastModified: new Date(article.checkedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    }));
  const common = commonGuides
    .filter((item) => item.status === 'verified')
    .map((item) => ({
      url: `${base}/guide/${item.slug}`,
      lastModified: new Date(item.checkedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.82,
    }));
  const discord = discordArticles
    .filter((item) => item.status === 'verified')
    .map((item) => ({
      url: `${base}/discord/${item.slug}`,
      lastModified: new Date(item.checkedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.82,
    }));
  return [
    ...fixed.map(({ path, updated }) => ({
      url: `${base}${path}`,
      lastModified: new Date(updated),
    })),
    ...games.filter(hubIndexable).map((game) => ({
      url: `${base}/games/${game.slug}`,
      lastModified: new Date(game.updated),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...troubleHubs.map((hub) => ({
      url: `${base}/trouble/${hub.slug}`,
      lastModified: new Date(hub.updated),
      changeFrequency: 'weekly' as const,
      priority: 0.86,
    })),
    ...articles,
    ...common,
    ...discord,
    {
      url: `${base}/weekly`,
      lastModified: new Date(weeklyReports[0].publishedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    },
    ...weeklyReports.map((report) => ({
      url: `${base}/weekly/${report.slug}`,
      lastModified: new Date(report.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.84,
    })),
    ...releaseRoundups.map((roundup) => ({
      url: `${base}/new-releases/${roundup.slug}`,
      lastModified: new Date(roundup.checkedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.84,
    })),
    ...pcArticles.map((article) => ({
      url: `${base}/pc/${article.slug}`,
      lastModified: new Date(article.checkedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.82,
    })),
    {
      url: `${base}/gear`,
      lastModified: new Date(
        [...gearArticles, ...gearGuides]
          .map((article) => article.checkedAt)
          .sort()
          .at(-1)!,
      ),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    ...[...gearArticles, ...gearGuides].map((article) => ({
      url: `${base}/gear/${article.slug}`,
      lastModified: new Date(article.checkedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...[
      { path: '/en/guide/pc-game-crash', updated: '2026-10-03' },
      ...gearGuidesEn.map((guide) => ({
        path: `/en/gear/${guide.slug}`,
        updated: guide.checkedAt,
      })),
      { path: '/en/tools', updated: '2026-10-03' },
      { path: '/en/tools/windows-diagnosis', updated: '2026-10-03' },
    ].map(({ path, updated }) => ({
      url: `${base}${path}`,
      lastModified: new Date(updated),
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    })),
    // Translated pages (hreflang alternates are declared on each page).
    ...locales.map((locale) => ({
      url: `${base}/${locale}`,
      lastModified: new Date(locale === 'en' ? '2026-10-03' : '2026-10-01'),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...locales.flatMap((locale) =>
      localizedGameSlugsFor(locale)
        .filter((slug) => !localizedHubs[slug].noindex)
        .map((slug) => ({
          url: `${base}/${locale}/games/${slug}`,
          lastModified: new Date(
            localizedHubs[slug].checkedAt || gameFacts[slug].checkedAt,
          ),
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        })),
    ),
    ...localizedArticles.map((article) => ({
      url: `${base}/${article.locale}/games/${article.gameSlug}/${article.slug}`,
      lastModified: new Date(article.checkedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    })),
    ...localizedDiscordArticles.map((article) => ({
      url: `${base}/${article.locale}/discord/${article.slug}`,
      lastModified: new Date(article.checkedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    })),
  ];
}
