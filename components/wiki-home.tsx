'use client';
import { useSearchQuery } from './use-search-query';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */

import { useEffect, useMemo, useRef } from 'react';
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
import { commonGuides } from '@/lib/common-guides';
import { pcArticles } from '@/lib/pc-articles';
import { siteConfig } from '@/lib/site-config';
import {
  searchGames,
  searchArticles,
  normalizeSearchQuery,
} from '@/lib/site-search';
import { ContinueNotes } from './continue-notes';
import { DiagnosisCta } from './diagnosis-cta';
import { RecentTroubles } from './recent-troubles';
import { MyShortcut } from './my-shortcut';
import { HomeBookmarkHelp } from './home-bookmark-help';
import { StatusTicker } from './status-board';
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
  { slug: 'pc', label: 'PC・Windows' },
];

const featuredGuideSlugs = [
  'steam-game-not-launching',
  'pc-game-crash',
  'stutter-fix',
  'save-data-backup',
];

export type LaunchItem = {
  slug: string;
  name: string;
  release: string;
  earlyAccess?: string;
  released: boolean;
  articles: { href: string; label: string }[];
};

const md = (iso: string) => {
  const [, m, d] = iso.split('-');
  return `${Number(m)}/${Number(d)}`;
};

export function WikiHome({
  view,
  launches = [],
  weekly,
}: {
  view?: 'games' | 'articles';
  launches?: LaunchItem[];
  /** Latest weekly roundup, passed from the server to keep it out of the bundle. */
  weekly?: { slug: string; period: string };
}) {
  const [query, setQuery] = useSearchQuery();
  const searchInput = useRef<HTMLInputElement>(null);
  const [articleCluster, setArticleCluster] = useSearchQuery('topic', 'all');
  const visible = useMemo(() => searchGames(query), [query]);
  const visibleArticles = useMemo(
    () => searchArticles(query, articleCluster),
    [articleCluster, query],
  );
  const isSearching = Boolean(query.trim());
  const isArticleFiltering = articleCluster !== 'all';
  const displayedGames =
    isSearching || view === 'games' ? visible : visible.slice(0, 6);
  // Keep the existing game-only home preview. Search ranks all article types
  // together, so a title match cannot be buried below incidental game mentions.
  const displayedArticles =
    isSearching || isArticleFiltering || view === 'articles'
      ? visibleArticles
      : visibleArticles
          .filter((article) => article.kind === 'game')
          .slice(0, 6);
  const displayedArticleCount = displayedArticles.length;
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
      <section
        className={`hero${isSearching ? ' hero-searching' : ''}`}
        id="site-search"
      >
        <div className="hero-copy" hidden={isSearching}>
          <p className="kicker">
            <Wrench size={15} /> WINDOWS PC TROUBLESHOOTING
          </p>
          <h1>
            PCゲームの
            <br />
            <span>「困った」を、すぐ解決。</span>
          </h1>
          <p>
            起動しない・クラッシュ・重い・セーブ・MOD・Discord・Windowsなど、
            <br />
            PCゲームのトラブルを症状から探せます。
          </p>
        </div>
        {isSearching ? (
          <h1 className="search-heading">ゲーム・症状から検索</h1>
        ) : null}
        <div className="search-box">
          <Search size={20} aria-hidden="true" />
          <input
            ref={searchInput}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="ゲーム名や症状を検索"
            placeholder="ゲーム名・Windows・症状を入力"
          />
          {query && (
            <button
              className="clear-search"
              type="button"
              onClick={() => {
                setQuery('');
                searchInput.current?.focus();
              }}
            >
              クリア
            </button>
          )}
        </div>
        <div
          className="search-examples home-search-examples"
          hidden={isSearching}
          aria-label="検索例"
        >
          <span>検索例：</span>
          {['Aniimo 黒画面', 'Steam 起動しない', 'Discord マイク'].map(
            (example) => (
              <button
                key={example}
                type="button"
                onClick={() => {
                  setQuery(example);
                  setArticleCluster('all');
                  searchInput.current?.focus();
                }}
                aria-label={`${example}で検索`}
              >
                {example}
              </button>
            ),
          )}
        </div>
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
      {!isSearching ? <DiagnosisCta home /> : null}

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
            <a className="home-saved-entry" href="/my#my-reading-list">
              保存した記事を開く →
            </a>
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
            <a href="/pc">
              <Wrench size={19} />
              PC・Windows
            </a>
          </div>
        </section>
      )}

      {!isSearching ? <ContinueNotes /> : null}
      {!isSearching ? (
        <div className="content home-my-shortcut">
          <MyShortcut />
          <HomeBookmarkHelp />
        </div>
      ) : null}

      {!isSearching ? <RecentTroubles /> : null}

      {!isSearching ? (
        <section
          className="content home-tools"
          id="home-tools"
          aria-labelledby="home-tools-title"
        >
          <div className="section-heading compact-heading">
            <div>
              <p>QUICK TOOLS</p>
              <h2 id="home-tools-title">プレイ前・設定変更後の確認に</h2>
            </div>
            <a href="/tools">便利ツール一覧 →</a>
          </div>
          <div className="home-tool-grid">
            <a href="/tools/save-locations">
              <Save size={20} aria-hidden="true" />
              <strong>セーブの保存場所を調べる</strong>
              <span>
                バックアップ前に。ゲーム別の保存先と、コピー・復元の注意点を確認。
              </span>
              <b>保存場所一覧を見る →</b>
            </a>
            <a href="/tools/refresh-rate">
              <Gauge size={20} aria-hidden="true" />
              <strong>モニターのHzを確認する</strong>
              <span>
                設定や接続を変えた後に。ブラウザ描画の目安を測り、Windowsの設定値と比較。
              </span>
              <b>Hzの目安を測る →</b>
            </a>
            <a href="/tools/windows-diagnosis">
              <Wrench size={20} aria-hidden="true" />
              <strong>PCゲームの不具合を調べる</strong>
              <span>
                起動しない・落ちる時に。PCの記録と次の確認を整理するWindows用の試作版。
              </span>
              <b>PCゲーム診断ツールの使い方 →</b>
            </a>
          </div>
          <p className="home-tools-note">
            Hzは測定の目安です。診断ツールは原因の確定・自動修復・すべてのゲームでの動作を保証しません。
          </p>
        </section>
      ) : null}

      {!isSearching && launches.length ? (
        <section
          className="content launch-watch"
          aria-labelledby="launch-watch-title"
        >
          <div className="section-heading compact-heading">
            <div>
              <p>LAUNCH WATCH</p>
              <h2 id="launch-watch-title">発売直後の新作｜不具合・対処法</h2>
            </div>
            <a href="/status">公式の障害・メンテ情報</a>
          </div>
          {weekly ? (
            <a className="weekly-banner" href={`/weekly/${weekly.slug}`}>
              <span>今週の不具合まとめ</span>
              {weekly.period}の公式パッチ・障害・エラー情報
              <ChevronRight size={16} />
            </a>
          ) : null}
          <div className="launch-watch-grid">
            {launches.map((launch) => (
              <div className="launch-watch-card" key={launch.slug}>
                <p>
                  <a href={`/games/${launch.slug}`}>{launch.name}</a>
                  <span>
                    {launch.released ? '発売' : '発売予定'} {md(launch.release)}
                    {launch.earlyAccess
                      ? `（先行 ${md(launch.earlyAccess)}）`
                      : ''}
                  </span>
                </p>
                {launch.articles.map((article) => (
                  <a href={article.href} key={article.href}>
                    {article.label}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {!isSearching ? (
        <div className="content home-personal">
          <StatusTicker />
        </div>
      ) : null}

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
            <>
              <a className="section-more" href="/?view=games#games">
                ゲームをすべて見る <ChevronRight size={16} />
              </a>
              <a className="section-more" href="/new-releases/2026-10">
                10月の新作PCゲーム 動作環境まとめ <ChevronRight size={16} />
              </a>
              <a className="section-more" href="/new-releases/2026-11">
                11月の新作PCゲーム 動作環境まとめ <ChevronRight size={16} />
              </a>
            </>
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
              {displayedArticles.map((article) => (
                <a href={article.href} key={article.key}>
                  <span>{article.label}</span>
                  <h3>{article.title}</h3>
                  <p>確認日：{article.checkedAt.replaceAll('-', '.')}</p>
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
      <section className="content discord-entrances" aria-labelledby="pc-title">
        <div className="section-heading">
          <div>
            <p>PC &amp; WINDOWS</p>
            <h2 id="pc-title">PCトラブル・Windowsの不具合</h2>
          </div>
        </div>
        <div className="guide-index-grid">
          {pcArticles.slice(0, 3).map((article) => (
            <a href={`/pc/${article.slug}`} key={article.slug}>
              <strong>{article.shortTitle}</strong>
              <span>{article.lead}</span>
              <small>
                確認手順を見る <ChevronRight size={14} />
              </small>
            </a>
          ))}
          <a href="/pc">
            <strong>PCトラブルの症状別判断表</strong>
            <span>起動・画面・通信・音声から、確認結果に合う次の対処へ</span>
            <small>
              PCトラブルの対処法一覧 <ChevronRight size={14} />
            </small>
          </a>
        </div>
      </section>
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
          <a href="/discord/recommended-bots">
            <strong>ゲームサーバーにおすすめのBot</strong>
            <span>日程調整・ゲーム別ロール・管理・個別相談</span>
            <small>
              比較して導入する <ChevronRight size={14} />
            </small>
          </a>
        </div>
      </section>
      <section className="content" aria-labelledby="about-gemnao-title">
        <div className="section-heading compact-heading">
          <div>
            <p>ABOUT GEMNAO</p>
            <h2 id="about-gemnao-title">ゲムなおとは？</h2>
          </div>
        </div>
        <p>{siteConfig.description}</p>
        <p>
          PCゲームの起動・セーブ・画面表示の問題、Discordの音声・接続・画面共有、Windowsの更新・周辺機器の不具合を扱います。公式情報を出典として示し、確認した結果から次の操作を選べるように整理しています。
        </p>
        <p>
          記事の閲覧とDiscordサーバー募集の掲載申請は無料です。個別の修理を代行するサービスではありません。運営方針と連絡先は
          <a href="/about">サイト運営者情報</a>、記事の訂正は
          <a href="/contact">お問い合わせ</a>をご覧ください。
        </p>
      </section>
      <WikiFooter />
    </main>
  );
}
