import type { MetadataRoute } from 'next';
import { games } from '@/lib/games';
import { gameArticles } from '@/lib/game-articles';
import { commonGuides } from '@/lib/common-guides';
export default function sitemap(): MetadataRoute.Sitemap {
  if (process.env.NEXT_PUBLIC_SITE_PUBLIC === 'false') return [];
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://gemnao.pages.dev';
  const fixed = ['', '/guide', '/about', '/contact', '/privacy', '/terms'];
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
  return [
    ...fixed.map((path) => ({
      url: `${base}${path}`,
      lastModified: new Date('2026-09-12'),
    })),
    ...games.map((game) => ({
      url: `${base}/games/${game.slug}`,
      lastModified: new Date(game.updated),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...articles,
    ...common,
  ];
}
