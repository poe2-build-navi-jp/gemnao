import type { Metadata } from 'next';
import { WikiHome, type LaunchItem } from '@/components/wiki-home';
import { latestWeeklyReport } from '@/lib/weekly-reports';
import { ReportEntryLink } from '@/components/report-entry-link';
import { searchArticles } from '@/lib/site-search';
import { WikiFooter, WikiHeader } from '@/components/wiki-header';
import { commonGuides } from '@/lib/common-guides';
import { pcArticles } from '@/lib/pc-articles';

const featuredGuideSlugs = [
  'steam-game-not-launching',
  'pc-game-crash',
  'stutter-fix',
  'save-data-backup',
];
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
// The five launches closest to today are shown first; the rest fold away so
// the section stays short on phones.
const FEATURED_LAUNCHES = 5;

function launchItems(now: number): LaunchItem[] {
  const items = activeLaunches(now).flatMap((launch) => {
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
        featured: false,
        articles: articles.slice(0, 3).map((article) => ({
          href: `/games/${game.slug}/${article.slug}`,
          label: article.shortTitle,
        })),
      },
    ];
  });
  const closest = [...items]
    .sort(
      (a, b) =>
        Math.abs(Date.parse(a.release) - now) -
        Math.abs(Date.parse(b.release) - now),
    )
    .slice(0, FEATURED_LAUNCHES)
    .map((item) => item.slug);
  return items.map((item) => ({
    ...item,
    featured: closest.includes(item.slug),
  }));
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
      defaultArticles={searchArticles('')
        .filter((article) => article.kind === 'game')
        .slice(0, 6)
        .map(({ gameArticle: _omit, ...article }) => article)}
      reportEntry={<ReportEntryLink prominent />}
      header={<WikiHeader />}
      footer={<WikiFooter />}
      featuredGuides={featuredGuideSlugs.flatMap((slug) => {
        const guide = commonGuides.find((item) => item.slug === slug);
        return guide
          ? [
              {
                slug: guide.slug,
                shortTitle: guide.shortTitle,
                description: guide.description,
              },
            ]
          : [];
      })}
      pcHighlights={pcArticles.slice(0, 3).map((article) => ({
        slug: article.slug,
        shortTitle: article.shortTitle,
        lead: article.lead,
      }))}
    />
  );
}
