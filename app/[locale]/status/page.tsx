import { commonGuidesEn } from '@/lib/localized/common-guides-en';
import { crashGuideEn } from '@/lib/localized/crash-guide-en';
import { games } from '@/lib/games';
import { hasLocalizedHub } from '@/lib/localized/hubs';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid the existing vinext client-link runtime issue. */
import { notFound } from 'next/navigation';
import { EnglishStaticPage } from '@/components/english-static-page';
import { EnglishStatusBoard } from '@/components/english-status-board';
import { englishEditorialMetadata } from '@/lib/localized/editorial-metadata';
import { gameFacts } from '@/lib/localized/game-facts';
import {
  localizedArticles,
  localizedDiscordArticles,
  localizedPcArticles,
} from '@/lib/localized/index';
import { officialStatusPages } from '@/lib/status/sources';
const info = {
  title: 'PC Game and Discord Service Status',
  description:
    'Check official maintenance and outage information before changing your PC. Fix announcements and increased reader responses are shown separately from active incidents.',
  checkedAt: '2026-10-18',
};
export const generateStaticParams = () => [{ locale: 'en' }];
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return (await params).locale === 'en'
    ? englishEditorialMetadata('/status', info)
    : {};
}
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  if ((await params).locale !== 'en') notFound();
  const names = Object.fromEntries(
    Object.entries(gameFacts).map(([k, v]) => [k, v.names.en]),
  );
  for (const a of localizedArticles.filter((a) => a.locale === 'en'))
    if (a.gameName) names[a.gameSlug] = a.gameName;
  const hubs=Object.fromEntries(games.map(g=>[g.slug,`${hasLocalizedHub('en',g.slug)?'/en':''}/games/${g.slug}`]));
  const links = Object.fromEntries(
    [
      ...commonGuidesEn.map(g=>({path:g.path,label:g.title})),
      {path:crashGuideEn.path,label:crashGuideEn.title},
      ...localizedArticles
        .filter((a) => a.locale === 'en')
        .map((a) => ({
          path: `/games/${a.gameSlug}/${a.slug}`,
          label: a.title,
        })),
      ...localizedDiscordArticles
        .filter((a) => a.locale === 'en')
        .map((a) => ({ path: `/discord/${a.slug}`, label: a.title })),
      ...localizedPcArticles
        .filter((a) => a.locale === 'en')
        .map((a) => ({ path: `/pc/${a.slug}`, label: a.title })),
    ].map((a) => [a.path, { href: `/en${a.path}`, label: a.label }]),
  );
  const labels = [
    'Discord',
    'Steam support',
    'Xbox / Game Pass / Xbox app',
    'PlayStation Network for PC games using PSN',
    'Gears of War: E-Day',
    'EA Help (Japanese)',
  ];
  const notes = [
    'Official Discord service status, also fetched above.',
    'Official Steam support. Use official Steam announcements for service information.',
    'Official Xbox service status.',
    'Official PlayStation service status.',
    'Official Gears service status linked by its launch announcement.',
    'Official EA help; service information is organized by game.',
  ];
  return (
    <EnglishStaticPage path="/status" {...info}>
      <EnglishStatusBoard names={names} links={links} hubs={hubs} />
      <section aria-labelledby="status-official">
        <h2 id="status-official">Official service and support pages</h2>
        <ul className="status-list">
          {officialStatusPages.map((p, i) => (
            <li key={p.url}>
              <div>
                <a href={p.url} target="_blank" rel="noreferrer">
                  {labels[i]} →
                </a>
                <p>{notes[i]}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <section aria-labelledby="status-next">
        <h2 id="status-next">
          If no outage is confirmed but you still cannot connect
        </h2>
        <ul>
          <li>
            <a href="/en/trouble/server">Game server and connection checks</a>
          </li>
          <li>
            <a href="/en/pc/wifi-connected-no-internet">
              Wi-Fi connected but no internet
            </a>
          </li>
          <li>
            <a href="/en/discord">Discord troubleshooting</a>
          </li>
        </ul>
      </section>
    </EnglishStaticPage>
  );
}
