'use client';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { useEffect, useState } from 'react';
import { Check, Plus, Gamepad2, ArrowRight } from 'lucide-react';
import { useMyGames } from '@/components/use-my-pc';
import { MY_GAMES_KEY } from '@/lib/my-pc';
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
  const [message, setMessage] = useState('');
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
  function toggle(slug: string) {
    try {
      const value: unknown = JSON.parse(
        localStorage.getItem(MY_GAMES_KEY) || '[]',
      );
      if (
        !Array.isArray(value) ||
        !value.every((item) => typeof item === 'string')
      )
        throw new Error(t.corrupt);
      const current = [...new Set(value as string[])];
      const removing = current.includes(slug);
      if (!removing && current.length >= 10) {
        setMessage(t.limit);
        return;
      }
      if (
        !save(
          removing
            ? current.filter((item) => item !== slug)
            : [...current, slug],
        )
      )
        throw new Error(t.error);
      if (!removing) trackMyGameAdded();
      setMessage(removing ? t.removed : t.success);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : t.error);
    }
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
  return (
    <div className="my-games-experience">
      <section
        id="my-games"
        aria-labelledby="choose-games-title"
        className="my-games-choose"
      >
        <p className="page-kicker">1 / 2</p>
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
              onClick={() => toggle(game.slug)}
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
        {!matches.length ? <p>{t.noResults}</p> : null}
        <output className="my-games-message" aria-live="polite">
          {message}
        </output>
        {ready && mine.length ? (
          <a className="my-games-view" href="#my-feed">
            {t.return} ({mine.length}) ↓
          </a>
        ) : null}
      </section>
      <section id="my-feed" aria-labelledby="saved-games-title">
        <p className="page-kicker">2 / 2</p>
        <h2 id="saved-games-title">{t.savedTitle}</h2>
        {ready && mine.length ? (
          <div className="my-games-results">
            {mine.map((game) => (
              <article className="my-game-card" key={game.slug}>
                <div className="my-games-card-heading">
                  <h3>{game.name}</h3>
                  <button
                    type="button"
                    onClick={() => toggle(game.slug)}
                    aria-label={`${t.remove}: ${game.name}`}
                  >
                    {t.remove}
                  </button>
                </div>
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
    </div>
  );
}
