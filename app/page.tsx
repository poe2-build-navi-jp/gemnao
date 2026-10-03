import type { Metadata } from 'next';
import { WikiHome, type LaunchItem } from '@/components/wiki-home';
import { latestWeeklyReport } from '@/lib/weekly-reports';
import { articlesForGame } from '@/lib/game-articles';
import { gameBySlug } from '@/lib/games';
import { activeLaunches } from '@/lib/launch-calendar';
import { siteConfig } from '@/lib/site-config';
import { languageAlternates } from '@/lib/localized/index';

export const metadata: Metadata = {
  description: siteConfig.description,
  openGraph: {
    title: 'ゲムなお｜PCゲームのお直しWiki',
    description: siteConfig.description,
    siteName: siteConfig.name,
    url: '/',
    images: ['/og-default.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ゲムなお｜PCゲームのお直しWiki',
    description: siteConfig.description,
    images: ['/og-default.png'],
  },
  alternates: {
    canonical: '/',
    languages: languageAlternates(''),
  },
};

// New games around their launch, with their troubleshooting articles, so
// readers (and crawlers) reach launch-week pages from the home page first.
function launchItems(now: number): LaunchItem[] {
  return activeLaunches(now).flatMap((launch) => {
    const game = gameBySlug(launch.gameSlug);
    const articles = articlesForGame(launch.gameSlug).filter(
      (article) => !['draft', 'thin'].includes(article.status || 'verified'),
    );
    if (!game || !articles.length) return [];
    return [
      {
        slug: game.slug,
        name: game.shortTitle,
        release: launch.release,
        earlyAccess: launch.earlyAccess,
        released: Date.parse(launch.release) <= now,
        articles: articles.slice(0, 3).map((article) => ({
          href: `/games/${game.slug}/${article.slug}`,
          label: article.shortTitle,
        })),
      },
    ];
  });
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const { view } = await searchParams;
  return (
    <WikiHome
      view={view === 'games' || view === 'articles' ? view : undefined}
      launches={launchItems(new Date().getTime())}
      weekly={{
        slug: latestWeeklyReport.slug,
        period: latestWeeklyReport.period,
      }}
    />
  );
}
