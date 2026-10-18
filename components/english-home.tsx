/* oxlint-disable next/no-html-link-for-pages -- Native navigation preserves existing search history. */
import { ArrowRight, Wrench } from 'lucide-react';
import { WikiHeader, WikiFooter } from './wiki-header';
import { EnglishHomeSearch } from './english-home-search';
import { LatestArticles } from './latest-articles';
import { ContinueNotes } from './continue-notes';
import { MyGamesHomeEntry } from './my-games-home-entry';
import { HomeBookmarkHelp } from './home-bookmark-help';
import { ReportEntryLink } from './report-entry-link';
import { troubleHubsEn } from '@/lib/localized/trouble-hubs-en';
import {
  englishHomeArticles,
  englishHomeGames,
  englishSearchEntries,
} from '@/lib/localized/home-en';
import { englishHomeCopy } from '@/lib/localized/home-copy-en';
import { gameFacts } from '@/lib/localized/game-facts';

const topics = [
  {
    title: 'Game launch and performance',
    href: '/en/guide',
    link: 'All PC game troubleshooting guides',
    description:
      'Start with a general check when the problem affects more than one game.',
    paths: [
      '/en/guide/steam-game-not-launching',
      '/en/guide/pc-game-crash',
      '/en/guide/low-fps',
    ],
  },
  {
    title: 'Windows and devices',
    href: '/en/pc',
    link: 'All Windows and device guides',
    description:
      'Separate a game issue from a system, sound or connection problem.',
    paths: [
      '/en/pc/audio-after-update',
      '/en/pc/black-screen-after-sign-in',
      '/en/pc/wifi-connected-no-internet',
    ],
  },
  {
    title: 'Discord voice and streaming',
    href: '/en/discord',
    link: 'All Discord troubleshooting guides',
    description:
      'Check voice, microphone and screen-sharing problems independently of the game.',
    paths: [
      '/en/discord/cant-hear-voice',
      '/en/discord/audio-input-not-found',
      '/en/discord/stream-no-audio',
    ],
  },
];
export function EnglishHome() {
  const latest = [...englishHomeArticles]
    .sort(
      (a, b) =>
        b.checkedAt.localeCompare(a.checkedAt) ||
        a.title.localeCompare(b.title, 'en'),
    )
    .slice(0, 3);
  return (
    <main lang="en" className="english-home">
      <WikiHeader locale="en" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            '@id': 'https://gemnao.pages.dev/en#webpage',
            url: 'https://gemnao.pages.dev/en',
            name: englishHomeCopy.title,
            description: englishHomeCopy.description,
            inLanguage: 'en',
            isPartOf: { '@id': 'https://gemnao.pages.dev/#website' },
            about: { '@type': 'Thing', name: 'PC game troubleshooting' },
          }),
        }}
      />
      <section
        className="hero english-home-hero"
        aria-labelledby="english-home-title"
      >
        <div className="hero-copy">
          <p className="kicker">
            <Wrench size={15} /> PC GAME TROUBLESHOOTING
          </p>
          <h1 id="english-home-title">
            Find the next check for your PC game problem
          </h1>
          <p>
            Start with the symptom, game name or error code. Follow
            source-linked steps for launch failures, crashes, low FPS, saves and
            more.
          </p>
        </div>
        <EnglishHomeSearch entries={englishSearchEntries} />
        <p className="english-search-hint">
          Try “Wilds crash”, “Discord microphone” or “ST-3100001”.
        </p>
      </section>
      <section
        className="content symptom-section"
        aria-labelledby="symptom-title"
      >
        <div className="section-heading">
          <div>
            <p className="kicker">START WITH THE SYMPTOM</p>
            <h2 id="symptom-title">What is going wrong?</h2>
          </div>
        </div>
        <div className="symptom-grid">
          {troubleHubsEn.map((h) => (
            <a href={`/en/trouble/${h.slug}`} key={h.slug}>
              <span>{h.label}</span>
              <ArrowRight size={17} />
            </a>
          ))}
        </div>
        <p className="english-home-help">
          Sound or chat problem?{' '}
          <a href="/en/guide/no-game-audio">Game audio checks</a> ·{' '}
          <a href="/en/discord">Discord troubleshooting</a> ·{' '}
          <a href="/en/status">Service status</a>
        </p>
      </section>
      <section
        className="content"
        id="games"
        aria-labelledby="english-games-title"
      >
        <div className="section-heading">
          <div>
            <p className="kicker">GAME-SPECIFIC STEPS</p>
            <h2 id="english-games-title">Find your game</h2>
          </div>
          <a href="/en/articles#games">All game guides →</a>
        </div>
        <p>
          Choose a game for its launch, performance and save guides. Games are
          listed alphabetically.
        </p>
        <div className="english-home-game-grid">
          {englishHomeGames.slice(0, 6).map((g) => (
            <a href={`/en/games/${g.slug}`} key={g.slug}>
              <h3>{g.name}</h3>
              <span>Game troubleshooting guides →</span>
            </a>
          ))}
        </div>
        <details className="english-home-more-games">
          <summary>Show all {englishHomeGames.length} games</summary>
          <ul>
            {englishHomeGames.slice(6).map((g) => (
              <li key={g.slug}>
                <a href={`/en/games/${g.slug}`}>{g.name} troubleshooting</a>
              </li>
            ))}
          </ul>
        </details>
      </section>
      <section
        className="content"
        id="articles"
        aria-labelledby="english-topics-title"
      >
        <div className="section-heading">
          <div>
            <p className="kicker">BROWSE BY TOPIC</p>
            <h2 id="english-topics-title">
              Guides for games, Windows and Discord
            </h2>
          </div>
          <a href="/en/articles">All English guides and resources →</a>
        </div>
        <div className="english-home-topics">
          {topics.map((t) => (
            <section key={t.href}>
              <h3>{t.title}</h3>
              <p>{t.description}</p>
              <ul>
                {t.paths.map((path) => {
                  const entry = englishSearchEntries.find(
                    (e) => e.href === path,
                  );
                  if (!entry)
                    throw new Error(`Missing English home link: ${path}`);
                  return (
                    <li key={path}>
                      <a href={path}>{entry.title}</a>
                    </li>
                  );
                })}
              </ul>
              <a className="english-topic-all" href={t.href}>
                {t.link} →
              </a>
            </section>
          ))}
        </div>
      </section>
      <section
        className="content english-home-diagnosis"
        id="tools"
        aria-labelledby="english-diagnosis-title"
      >
        <div>
          <p className="kicker">NEED HELP NARROWING IT DOWN?</p>
          <h2 id="english-diagnosis-title">Windows game diagnosis</h2>
          <p>
            Read the instructions before downloading the free Windows 11 x64
            prototype. It helps organize checks; it does not guarantee a
            diagnosis or a fix.
          </p>
        </div>
        <a href="/en/tools/windows-diagnosis">
          Read diagnosis instructions and download →
        </a>
      </section>
      <LatestArticles
        locale="en"
        allHref="/en/articles"
        articles={latest.map((a) => ({
          href:
            a.gameSlug === 'discord'
              ? `/en/discord/${a.slug}`
              : `/en/games/${a.gameSlug}/${a.slug}`,
          title: a.title,
          checkedAt: a.checkedAt,
          label:
            a.gameName ||
            (a.gameSlug === 'discord'
              ? 'Discord'
              : gameFacts[a.gameSlug].names.en),
        }))}
      />
      <section
        className="content english-home-resources"
        aria-labelledby="english-reference-title"
      >
        <h2 id="english-reference-title">
          Tools, requirements and reference pages
        </h2>
        <ul>
          <li>
            <a href="/en/tools">
              Save paths, refresh-rate checks and diagnosis tools
            </a>
          </li>
          <li>
            <a href="/en/new-releases/2026-10">
              October 2026 PC game requirements
            </a>
          </li>
          <li>
            <a href="/en/new-releases/2026-11">
              November 2026 PC game requirements
            </a>
          </li>
          <li>
            <a href="/en/weekly">Weekly official-announcement archives</a>
          </li>
          <li>
            <a href="/en/gear">PC gaming equipment guides</a>
          </li>
          <li>
            <a href="/en/discord-servers">
              Find Japanese-speaking Discord communities
            </a>
          </li>
        </ul>
      </section>
      <ContinueNotes locale="en" />
      <div className="content home-my-shortcut">
        <MyGamesHomeEntry locale="en" />
      </div>
      <div className="content home-bookmark-slot">
        <HomeBookmarkHelp locale="en" />
      </div>
      <section
        className="content english-home-about"
        aria-labelledby="english-about-title"
      >
        <h2 id="english-about-title">How to use these guides safely</h2>
        <p>
          Read the scope and source dates, preserve your saves, and change one
          thing at a time. These English guides use the same source material as
          our Japanese editions. User reports are labeled separately and are not
          proof that a fix will work for everyone.
        </p>
        <a href="/en/about">About Gemnao and the editorial policy →</a>
        <ReportEntryLink prominent locale="en" />
      </section>
      <WikiFooter locale="en" />
    </main>
  );
}
