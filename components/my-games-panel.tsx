'use client';
import { MyReportLinks } from './my-report-links';
import { GameMaintenance } from './game-maintenance';
import { GameOpenIssues } from './game-open-issues';
import { SavedGameFixes } from './saved-game-fixes';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { useEffect, useState } from 'react';
import { PlayPlanCard, TodayGames } from '@/components/play-plan';
import { MyGameChanges } from '@/components/my-game-changes';
import { GameSettingsSnapshots } from '@/components/game-settings-snapshots';
import { gameChangesCopy } from '@/lib/my-game-changes-copy';
import { Check, Plus, Gamepad2, ArrowRight } from 'lucide-react';
import { useMyGames } from '@/components/use-my-pc';
import {
  changeMyGames,
  type MyGamesNotice as Notice,
} from '@/lib/my-games-selection';
import { MyGamesNotice } from '@/components/my-games-notice';
import { trackMyGameAdded } from '@/lib/analytics';
import { myGamesCopy, type MyGamesLocale } from '@/lib/my-games-copy';
import type { SavedGameChoice } from '@/lib/my-games-data';

type News = Record<string, { title: string; date: string; url: string }[]>;
export function MyGamesPanel({
  games,
  locale = 'ja',
}: {
  games: SavedGameChoice[];
  locale?: MyGamesLocale;
}) {
  const t = myGamesCopy[locale];
  const [saved, save, ready] = useMyGames();
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState<Notice | null>(null);
  const [news, setNews] = useState<News>({});
  const mine = games.filter((game) => saved.includes(game.slug));
  const matches = games.filter((game) =>
    game.searchNames
      .toLocaleLowerCase()
      .includes(query.trim().toLocaleLowerCase()),
  );
  const newsKey = mine
    .filter((game) => game.hasNews)
    .map((game) => game.slug)
    .join(',');
  useEffect(() => {
    if (!newsKey) return;
    const controller = new AbortController();
    fetch(`/api/game-news?games=${newsKey}`, { signal: controller.signal })
      .then((response) =>
        response.ok ? (response.json() as Promise<News>) : {},
      )
      .then(setNews)
      .catch(() => undefined);
    return () => controller.abort();
  }, [newsKey]);
  function change(slug: string, operation: 'add' | 'remove') {
    const result = changeMyGames(() => localStorage, save, slug, operation);
    setMessage(result);
    if (result.added) trackMyGameAdded();
  }
  function links(game: SavedGameChoice) {
    return (
      <>
        <h4>{t.guides}</h4>
        {game.articles.length ? (
          <ul>
            {game.articles.map((article) => (
              <li key={article.href}>
                <a
                  href={article.href}
                  hrefLang={article.japanese ? 'ja' : locale}
                >
                  {article.label}
                  {article.japanese ? t.ja : ''}
                  <ArrowRight size={14} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>{t.noGuides}</p>
        )}
        <a href={game.hub} hrefLang={game.hubJapanese ? 'ja' : locale}>
          {t.hub}
          {game.hubJapanese ? t.ja : ''} →
        </a>
      </>
    );
  }
  const example =
    matches.find((game) =>
      game.articles.some((article) => !article.japanese),
    ) || matches[0];
  const choose = (
    <section
      id="my-games"
      aria-labelledby="choose-games-title"
      className="my-games-choose"
    >
      <h2 id="choose-games-title">
        <Gamepad2 size={22} aria-hidden="true" />
        {t.choose}
      </h2>
      <p>{t.hint}</p>
      <label className="my-games-search">
        {t.search}
        <input
          type="search"
          value={query}
          placeholder={t.placeholder}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>
      <p className="my-games-count">
        {ready ? `${saved.length} / 10 ${t.count}` : t.loading}
      </p>
      <div className="my-games-choices">
        {matches.map((game) => (
          <button
            key={game.slug}
            type="button"
            aria-pressed={saved.includes(game.slug)}
            disabled={!ready}
            onClick={() => change(game.slug, 'add')}
          >
            <span>{game.name}</span>
            <small>
              {saved.includes(game.slug) ? (
                <Check size={16} aria-hidden="true" />
              ) : (
                <Plus size={16} aria-hidden="true" />
              )}
              {saved.includes(game.slug) ? t.selected : t.add}
            </small>
          </button>
        ))}
      </div>
      {!matches.length ? (
        <div className="my-games-no-results">
          <p>{t.noResults}</p>
          <a href="#game-request">{t.requestGame} →</a>
        </div>
      ) : null}
      <MyGamesNotice notice={message} locale={locale} />
      {ready && mine.length ? (
        <a className="my-games-view" href="#my-feed">
          {t.return} ({mine.length}) ↓
        </a>
      ) : null}
    </section>
  );
  const feed = (
    <section id="my-feed" aria-labelledby="saved-games-title">
      <h2 id="saved-games-title">{t.savedTitle}</h2>
      <a href="#my-games">{t.choose} ↓</a>
      <TodayGames games={mine} locale={locale} ready={ready} />
      <p>{gameChangesCopy[locale].scope}</p>
      <p className="my-game-changes-rules">{gameChangesCopy[locale].rules}</p>
      {ready && mine.length ? (
        <div className="my-games-results">
          {mine.map((game) => (
            <article
              className="my-game-card"
              id={`my-game-${game.slug}`}
              key={game.slug}
            >
              <div className="my-games-card-heading">
                <h3>{game.name}</h3>
                <button
                  type="button"
                  onClick={() => change(game.slug, 'remove')}
                  aria-label={`${t.remove}: ${game.name}`}
                >
                  {t.remove}
                </button>
              </div>
              <GameOpenIssues gameSlug={game.slug} locale={locale} />
              <SavedGameFixes gameSlug={game.slug} locale={locale} />
              <PlayPlanCard gameSlug={game.slug} locale={locale} />
              <GameMaintenance gameSlug={game.slug} locale={locale} />
              <MyGameChanges changes={game.officialChanges} locale={locale} />
              <GameSettingsSnapshots gameSlug={game.slug} locale={locale} />
              {links(game)}
              {news[game.slug]?.length ? (
                <details>
                  <summary>{t.news}</summary>
                  <p>
                    {t.newsNote} {t.original}.
                  </p>
                  <ul>
                    {news[game.slug].map((item) => (
                      <li key={item.url}>
                        <a href={item.url} target="_blank" rel="noreferrer">
                          {item.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </details>
              ) : null}
            </article>
          ))}
        </div>
      ) : (
        <>
          <p>{ready ? t.empty : t.loading}</p>
          {example ? (
            <aside className="my-games-example">
              <p className="page-kicker">{t.preview}</p>
              <h3>
                {t.example}
                {example.name}
              </h3>
              <p>{t.previewNote}</p>
              {links(example)}
            </aside>
          ) : null}
        </>
      )}
    </section>
  );
  return (
    <div className="my-games-experience">
      <MyReportLinks locale={locale} />
      {ready && mine.length ? (
        <>
          {feed}
          {choose}
        </>
      ) : (
        <>
          {choose}
          {feed}
        </>
      )}
    </div>
  );
}
