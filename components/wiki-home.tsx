'use client';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */

import { useEffect, useMemo, useState } from 'react';
import {
  Bug,
  ChevronRight,
  Gamepad2,
  Gauge,
  MessageCircle,
  Power,
  Puzzle,
  Save,
  Search,
  Server,
  Wrench,
} from 'lucide-react';
import { games } from '@/lib/games';
import { categoryLabels, gameArticles } from '@/lib/game-articles';
import { commonGuides } from '@/lib/common-guides';
import { discordArticles } from '@/lib/discord-articles';
import { articleMatchesTrouble, troubleHubForGuide } from '@/lib/trouble-hubs';
import { matchesNaturalQuery, normalizeSearchQuery } from '@/lib/site-search';
import { RecentTroubles } from './recent-troubles';
import { WikiFooter, WikiHeader } from './wiki-header';

const topics = [
  { slug: 'not-launching', label: '起動しない', icon: Power },
  { slug: 'crash', label: 'クラッシュ', icon: Bug },
  { slug: 'fps', label: '重い・カクつく', icon: Gauge },
  { slug: 'save', label: 'セーブ', icon: Save },
  { slug: 'mod', label: 'MOD', icon: Puzzle },
  { slug: 'controller', label: 'コントローラー', icon: Gamepad2 },
  { slug: 'server', label: 'サーバー', icon: Server },
];

const articleFilters = [
  ...topics.map(({ slug, label }) => ({ slug, label })),
  { slug: 'discord', label: 'Discord' },
];

const featuredGuideSlugs = [
  'steam-game-not-launching',
  'pc-game-crash',
  'stutter-fix',
  'save-data-backup',
];

export function WikiHome({ view }: { view?: 'games' | 'articles' }) {
  const [query, setQuery] = useState('');
  const [articleCluster, setArticleCluster] = useState('all');
  const visible = useMemo(
    () =>
      games.filter((game) => {
        const haystack = [game.title, game.shortTitle, game.lead, ...game.tags]
          .join(' ')
          .toLowerCase();
        return matchesNaturalQuery(haystack, query);
      }),
    [query],
  );
  const visibleArticles = useMemo(
    () =>
      [...gameArticles]
        .filter((article) => {
          const game = games.find((item) => item.slug === article.gameSlug);
          const haystack = [
            game?.title,
            game?.shortTitle,
            article.title,
            article.shortTitle,
            article.symptom,
            article.description,
            article.metaDescription,
            categoryLabels[article.category],
          ]
            .join(' ')
            .toLowerCase();
          return (
            matchesNaturalQuery(haystack, query) &&
            (articleCluster === 'all' ||
              articleMatchesTrouble(article, articleCluster))
          );
        })
        .sort((a, b) => b.checkedAt.localeCompare(a.checkedAt)),
    [articleCluster, query],
  );
  const isSearching = Boolean(query.trim());
  const isArticleFiltering = articleCluster !== 'all';
  const displayedGames =
    isSearching || view === 'games' ? visible : visible.slice(0, 6);
  const displayedArticles =
    isSearching || isArticleFiltering || view === 'articles'
      ? visibleArticles
      : visibleArticles.slice(0, 6);
  const supplementalArticles = useMemo(() => {
    if (view !== 'articles' && !isSearching) return [];
    const guides = commonGuides
      .filter((guide) => guide.status === 'verified')
      .filter(
        (guide) =>
          articleCluster === 'all' ||
          troubleHubForGuide(guide)?.slug === articleCluster,
      )
      .filter((guide) =>
        matchesNaturalQuery(
          [
            guide.title,
            guide.shortTitle,
            guide.description,
            ...guide.causes,
          ].join(' '),
          query,
        ),
      )
      .map((guide) => ({
        key: `guide-${guide.slug}`,
        href: `/guide/${guide.slug}`,
        label: 'PC共通ガイド',
        title: guide.shortTitle,
        checkedAt: guide.checkedAt,
      }));
    const discord = discordArticles
      .filter((article) => article.status === 'verified')
      .filter(() => articleCluster === 'all' || articleCluster === 'discord')
      .filter((article) =>
        matchesNaturalQuery(
          [
            article.title,
            article.shortTitle,
            article.symptom,
            article.metaDescription,
            ...article.quickFixes,
          ].join(' '),
          query,
        ),
      )
      .map((article) => ({
        key: `discord-${article.slug}`,
        href: `/discord/${article.slug}`,
        label: 'Discord',
        title: article.shortTitle,
        checkedAt: article.checkedAt,
      }));
    return [...guides, ...discord].sort((a, b) =>
      b.checkedAt.localeCompare(a.checkedAt),
    );
  }, [articleCluster, isSearching, query, view]);
  const displayedArticleCount =
    displayedArticles.length + supplementalArticles.length;
  const featuredGuides = featuredGuideSlugs
    .map((slug) => commonGuides.find((guide) => guide.slug === slug))
    .filter((guide): guide is NonNullable<typeof guide> => Boolean(guide));
  const searchResultCount = displayedGames.length + displayedArticleCount;
  const noSearchResults = isSearching && searchResultCount === 0;

  useEffect(() => {
    const normalized = normalizeSearchQuery(query);
    if (!noSearchResults || normalized.length < 2 || normalized.length > 80)
      return;
    const timer = window.setTimeout(() => {
      try {
        const key = `gemnao-zero-search:${normalized}`;
        if (sessionStorage.getItem(key)) return;
        sessionStorage.setItem(key, '1');
        void fetch('/api/search-demand', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, locale: 'ja' }),
        });
      } catch {
        // Search remains usable when storage or telemetry is unavailable.
      }
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [noSearchResults, query]);

  return (
    <main>
      <WikiHeader />
      <section className="hero" id="site-search">
        <div className="hero-copy">
          <p className="kicker">
            <Wrench size={15} /> WINDOWS PC TROUBLESHOOTING
          </p>
          <h1>
            PCゲームの
            <br />
            <span>「困った」を、すぐ解決。</span>
          </h1>
          <p>
            起動しない・クラッシュ・重い・セーブ・MOD・Discordなど、
            <br />
            PCゲームのトラブルを症状から探せます。
          </p>
        </div>
        <label className="search-box">
          <Search size={20} aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="ゲーム名や症状を検索"
            placeholder="ゲーム名・症状を入力"
          />
          {query && (
            <button
              className="clear-search"
              type="button"
              onClick={() => setQuery('')}
            >
              クリア
            </button>
          )}
        </label>
        <p className="search-examples">
          例：Aniimo 黒画面 / WARDOGS 起動しない / パルワールド セーブ
        </p>
        {isSearching && !noSearchResults ? (
          <output className="search-result-summary" aria-live="polite">
            検索結果：{searchResultCount}件
            {displayedGames.length > 0
              ? `・ゲーム ${displayedGames.length}タイトル`
              : ''}
            {displayedArticleCount > 0
              ? `・解決記事 ${displayedArticleCount}件`
              : ''}
          </output>
        ) : null}
        {noSearchResults ? (
          <output className="search-no-results">
            <strong>該当する記事はまだありません。</strong>
            <span>近い症状から探す：</span>
            <a href="/trouble/not-launching">起動しない</a>
            <a href="/trouble/crash">クラッシュ</a>
            <a href="/trouble/fps">FPS・カクつき</a>
            <a href="/guide">PC共通ガイド</a>
          </output>
        ) : null}
      </section>

      {!isSearching ? <RecentTroubles /> : null}

      {!isSearching && (
        <section
          className="content symptom-section"
          id="symptoms"
          aria-labelledby="symptom-title"
        >
          <div className="section-heading compact-heading">
            <div>
              <p>TROUBLE TYPE</p>
              <h2 id="symptom-title">何に困っていますか？</h2>
            </div>
          </div>
          <div className="symptom-grid" aria-label="症状から探す">
            {topics.map((item) => {
              const Icon = item.icon;
              return (
                <a href={`/trouble/${item.slug}`} key={item.slug}>
                  <Icon size={19} />
                  {item.label}
                </a>
              );
            })}
            <a href="/discord">
              <MessageCircle size={19} />
              Discord
            </a>
          </div>
        </section>
      )}

      {(!isSearching || displayedGames.length > 0) && (
        <section className="content home-compact" id="games">
          <div className="section-heading">
            <div>
              <p>2026 SELECTION</p>
              <h2>
                {isSearching
                  ? '該当するゲーム'
                  : view === 'games'
                    ? 'PCゲーム一覧'
                    : '注目のPCゲーム'}
              </h2>
            </div>
            <span>{displayedGames.length}タイトル</span>
          </div>
          {visible.length > 0 && (
            <div className="game-grid">
              {displayedGames.map((game) => (
                <a
                  className="game-card"
                  href={`/games/${game.slug}`}
                  key={game.slug}
                  style={
                    { '--game-accent': game.accent } as React.CSSProperties
                  }
                >
                  <div>
                    <h3>{game.title}</h3>
                    <div className="tags">
                      {game.tags.slice(0, 3).map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                  <b className="card-cta">トラブルを見る</b>
                  <ChevronRight className="arrow" size={20} />
                </a>
              ))}
            </div>
          )}
          {!isSearching && view !== 'games' ? (
            <a className="section-more" href="/?view=games#games">
              ゲームをすべて見る <ChevronRight size={16} />
            </a>
          ) : null}
        </section>
      )}

      {!isSearching && (
        <section
          className="content home-guide-section"
          aria-labelledby="guide-title"
        >
          <div className="section-heading">
            <div>
              <p>PC TROUBLE GUIDE</p>
              <h2 id="guide-title">よく使うPCトラブルガイド</h2>
            </div>
            <span>{featuredGuides.length}件</span>
          </div>
          <div className="guide-index-grid compact-guide-grid">
            {featuredGuides.map((guide) => (
              <a href={`/guide/${guide.slug}`} key={guide.slug}>
                <strong>{guide.shortTitle}</strong>
                <span>{guide.description}</span>
                <small>
                  手順を見る <ChevronRight size={14} />
                </small>
              </a>
            ))}
          </div>
          <a className="section-more" href="/guide">
            PCトラブルガイドをすべて見る <ChevronRight size={16} />
          </a>
        </section>
      )}

      {(displayedArticleCount > 0 || view === 'articles') && (
        <section
          className="content article-index"
          id="articles"
          aria-labelledby="article-index-title"
        >
          <div className="section-heading">
            <div>
              <p>ISSUE GUIDES</p>
              <h2 id="article-index-title">
                {query
                  ? '該当するトラブル記事'
                  : view === 'articles'
                    ? '解決記事一覧'
                    : '新着の解決記事'}
              </h2>
            </div>
            <span>{displayedArticleCount}記事</span>
          </div>
          {view === 'articles' ? (
            <div
              className="article-cluster-filter"
              aria-label="症状で記事を絞り込む"
            >
              <button
                type="button"
                className={articleCluster === 'all' ? 'active' : ''}
                onClick={() => setArticleCluster('all')}
              >
                すべて
              </button>
              {articleFilters.map((topic) => (
                <button
                  type="button"
                  className={articleCluster === topic.slug ? 'active' : ''}
                  onClick={() => setArticleCluster(topic.slug)}
                  key={topic.slug}
                >
                  {topic.label}
                </button>
              ))}
            </div>
          ) : null}
          {displayedArticleCount ? (
            <div className="home-article-grid">
              {displayedArticles.map((article) => {
                const game = games.find(
                  (item) => item.slug === article.gameSlug,
                );
                return (
                  <a
                    href={`/games/${article.gameSlug}/${article.slug}`}
                    key={`${article.gameSlug}-${article.slug}`}
                  >
                    <span>
                      {game?.shortTitle}・{categoryLabels[article.category]}
                    </span>
                    <h3>{article.shortTitle}</h3>
                    <p>更新日：{article.checkedAt.replaceAll('-', '.')}</p>
                    <b>
                      解決手順を見る <ChevronRight size={16} />
                    </b>
                  </a>
                );
              })}
              {supplementalArticles.map((article) => (
                <a href={article.href} key={article.key}>
                  <span>{article.label}</span>
                  <h3>{article.title}</h3>
                  <p>更新日：{article.checkedAt.replaceAll('-', '.')}</p>
                  <b>
                    解決手順を見る <ChevronRight size={16} />
                  </b>
                </a>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Search size={28} />
              <h3>該当する記事はありません</h3>
              <p>別の症状を選ぶか、検索語を短くしてください。</p>
            </div>
          )}
          {!isSearching && view !== 'articles' ? (
            <a className="section-more" href="/?view=articles#articles">
              新着記事をすべて見る <ChevronRight size={16} />
            </a>
          ) : null}
        </section>
      )}
      <section
        className="content discord-entrances"
        aria-labelledby="discord-title"
      >
        <div className="section-heading">
          <div>
            <p>DISCORD</p>
            <h2 id="discord-title">Discord</h2>
          </div>
        </div>
        <div className="guide-index-grid">
          <a href="/discord">
            <strong>Discordの不具合を直す</strong>
            <span>マイク・RTC・画面共有・起動など</span>
            <small>
              Discordトラブルを見る <ChevronRight size={14} />
            </small>
          </a>
          <a href="/discord-servers/submit">
            <strong>Discordサーバーを無料掲載する</strong>
            <span>PCゲームコミュニティの掲載者を募集中</span>
            <small>
              掲載を申し込む <ChevronRight size={14} />
            </small>
          </a>
        </div>
      </section>
      <WikiFooter />
    </main>
  );
}
