import { englishEditorialMetadata } from '@/lib/localized/editorial-metadata';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid the existing vinext client-link runtime issue. */
import { hasLocalizedHub } from '@/lib/localized/hubs';
import { notFound } from 'next/navigation';
import { localizedArticles } from '@/lib/localized';
import { gameDisplayName } from '@/lib/game-display-name';
import type { Metadata } from 'next';
import { MyDashboard, type DashboardGame } from '@/components/my-dashboard';
import { WikiFooter, WikiHeader } from '@/components/wiki-header';
const articlesForGame = (slug: string) =>
  localizedArticles.filter((a) => a.locale === 'en' && a.gameSlug === slug);
import { games } from '@/lib/games';
import { releaseRoundupsEn as releaseRoundups } from '@/lib/localized/release-roundups-en';
import { currentMaintenance } from '@/lib/status/policy';
import { maintenanceSchedule, steamAppIds } from '@/lib/status/sources';
import {
  weeklyKindLabelsEn as weeklyKindLabels,
  weeklyReportsEn as weeklyReports,
} from '@/lib/localized/weekly-reports-en';

// Personal page: everything is stored in the reader's browser, so there is
// nothing for search engines to index.
export const metadata: Metadata = {
  ...englishEditorialMetadata('/my', {title:'My Page: Games, PC Details and Saved Solutions',description:'Save articles, PC details and solution notes in this browser. Review updates and troubleshooting guides for your games.',checkedAt:'2026-10-18'}),
  robots: { index: false, follow: true },
};

function specFor(slug: string) {
  for (const roundup of releaseRoundups)
    for (const game of roundup.games)
      if (game.spec && game.article?.href.startsWith(`/en/games/${slug}/`))
        return game.spec;
  return undefined;
}

const DAY = 86_400_000;

/** 'M/D' in a weekly report → 'YYYY-MM-DD' (the report's year, or the year before). */
function weeklyDate(monthDay: string, publishedAt: string) {
  const [month, date] = monthDay.split('/').map(Number);
  const [year, publishedMonth] = publishedAt.split('-').map(Number);
  const y = month > publishedMonth ? year - 1 : year;
  return `${y}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
}

/** Article check dates and weekly items from the last 30 days, newest first. */
function updatesFor(slug: string, now: number) {
  const since = now - 30 * DAY;
  const articles = articlesForGame(slug).map((article) => ({
    date: article.checkedAt,
    label: `Article reviewed: ${article.shortTitle}`,
    href: `/en/games/${slug}/${article.slug}`,
  }));
  const weekly = weeklyReports.flatMap((report) =>
    report.items
      .filter((item) => item.gameSlug === slug)
      .map((item) => ({
        date: weeklyDate(item.date, report.publishedAt),
        label: `${weeklyKindLabels[item.kind]}：${item.title}`,
        href: `/en/weekly/${report.slug}`,
      })),
  );
  return [...articles, ...weekly]
    .filter((item) => Date.parse(item.date) >= since)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 6);
}

function dashboardGames(now: number): DashboardGame[] {
  return games
    .map((game) => ({
      slug: game.slug,
      href: `${hasLocalizedHub('en',game.slug) ? '/en' : ''}/games/${game.slug}`,
      name: gameDisplayName(game, 'en'),
      articles: articlesForGame(game.slug)
        .slice(0, 4)
        .map((article) => ({
          href: `/en/games/${game.slug}/${article.slug}`,
          label: article.shortTitle,
        })),
      maintenance: currentMaintenance(maintenanceSchedule, now)
        .filter((item) => item.gameSlug === game.slug)
        .map((item) => ({
          title: /[\u3040-\u30ff\u3400-\u9fff]/.test(item.title)
            ? 'Official maintenance notice (Japanese source)'
            : item.title,
          start: item.start,
          end: item.end,
          url: item.source.url,
          state: item.state,
        })),
      spec: specFor(game.slug),
      updates: updatesFor(game.slug, now),
      hasNews: Boolean(steamAppIds[game.slug]),
    }));
}

export default async function MyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  if ((await params).locale !== 'en') notFound();
  const data = dashboardGames(new Date().getTime());
  return (
    <main lang="en">
      <WikiHeader locale="en" pagePath="/my" />
      <article className="static-page">
        <p className="page-kicker">MY PAGE</p>
        <h1>Your Saved Articles, Games and PC</h1>
        <p className="page-lead">
          Return to saved articles, recent guides and updates for your games.
          Keep diagnosis results and settings that helped. No login is needed;
          your records stay in this browser.
        </p>
        <nav className="my-page-links" aria-label="My page sections">
          <a href="#my-reading-list">Reading list</a>
          <a href="#my-feed">Game updates</a>
          <a href="#my-games">Saved games</a>
          <a href="#my-solutions">Diagnosis and solution notes</a>
          <a href="#my-pc">PC details</a>
        </nav>
        <MyDashboard games={data} locale="en" />
      </article>
      <WikiFooter locale="en" />
    </main>
  );
}

export const generateStaticParams = () => [{ locale: "en" }];
