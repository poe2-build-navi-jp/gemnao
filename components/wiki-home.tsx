'use client';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */

import { useMemo, useState } from 'react';
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
import { WikiFooter, WikiHeader } from './wiki-header';

const topics = [
  { id: 'launch', label: '起動しない', icon: Power },
  { id: 'crash', label: 'クラッシュ', icon: Bug },
  { id: 'display', label: '重い・カクつく', icon: Gauge },
  { id: 'save', label: 'セーブ', icon: Save },
  { id: 'mods', label: 'MOD', icon: Puzzle },
  { id: 'controller', label: 'コントローラー', icon: Gamepad2 },
  { id: 'server', label: 'サーバー', icon: Server },
];
const topicKeywords: Record<string, string[]> = {
  launch: ['起動', '白画面', '黒画面', 'GameGuard'],
  crash: ['クラッシュ', '落ちる', 'フリーズ'],
  save: ['セーブ', '保存'],
  mods: ['MOD', 'SKSE', 'SMAPI', 'REDmod'],
  display: ['FPS', 'カクつき', 'HDR', 'ウルトラワイド', '21:9'],
  controller: ['コントローラー', 'DualSense'],
  server: ['専用サーバー', 'PalWorldSettings.ini', 'ポート', 'バックアップ'],
};

function articleMatchesTopic(category: string, topic: string) {
  if (topic === 'display')
    return category === 'display' || category === 'settings';
  if (topic === 'crash') return category === 'launch';
  return category === topic;
}

const featuredGuideSlugs = [
  'steam-game-not-launching',
  'pc-game-crash',
  'stutter-fix',
  'save-data-backup',
];

export function WikiHome({ view }: { view?: 'games' | 'articles' }) {
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState('all');
  const visible = useMemo(
    () =>
      games.filter((game) => {
        const haystack = [game.title, game.shortTitle, game.lead, ...game.tags]
          .join(' ')
          .toLowerCase();
        const keywords = topicKeywords[topic] || [];
        const matchesTopic =
          topic === 'all' ||
          keywords.some((keyword) =>
            haystack.includes(keyword.toLowerCase()),
          ) ||
          gameArticles.some(
            (article) =>
              article.gameSlug === game.slug &&
              articleMatchesTopic(article.category, topic),
          );
        return haystack.includes(query.trim().toLowerCase()) && matchesTopic;
      }),
    [query, topic],
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
          const matchesTopic =
            topic === 'all' ||
            (topic === 'crash'
              ? topicKeywords.crash.some((keyword) =>
                  haystack.includes(keyword.toLowerCase()),
                )
              : articleMatchesTopic(article.category, topic));
          return haystack.includes(query.trim().toLowerCase()) && matchesTopic;
        })
        .sort((a, b) => b.checkedAt.localeCompare(a.checkedAt)),
    [query, topic],
  );
  const isFiltering = Boolean(query.trim()) || topic !== 'all';
  const displayedGames =
    isFiltering || view === 'games' ? visible : visible.slice(0, 6);
  const displayedArticles =
    isFiltering || view === 'articles'
      ? visibleArticles
      : visibleArticles.slice(0, 6);
  const featuredGuides = featuredGuideSlugs
    .map((slug) => commonGuides.find((guide) => guide.slug === slug))
    .filter((guide): guide is NonNullable<typeof guide> => Boolean(guide));

  return (
    <main>
      <WikiHeader />
      <section className="hero">
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
      </section>

      <section
        className="content symptom-section"
        aria-labelledby="symptom-title"
      >
        <div className="section-heading compact-heading">
          <div>
            <p>TROUBLE TYPE</p>
            <h2 id="symptom-title">何に困っていますか？</h2>
          </div>
        </div>
        <div className="symptom-grid" aria-label="症状で絞り込み">
          {topics.map((item) => {
            const Icon = item.icon;
            return (
              <button
                className={topic === item.id ? 'active' : ''}
                type="button"
                key={item.id}
                onClick={() => setTopic(topic === item.id ? 'all' : item.id)}
                aria-pressed={topic === item.id}
              >
                <Icon size={19} />
                {item.label}
              </button>
            );
          })}
          <a href="/discord">
            <MessageCircle size={19} />
            Discord
          </a>
        </div>
      </section>

      <section className="content home-compact" id="games">
        <div className="section-heading">
          <div>
            <p>2026 SELECTION</p>
            <h2>
              {query || topic !== 'all'
                ? '検索結果'
                : view === 'games'
                  ? 'PCゲーム一覧'
                  : '注目のPCゲーム'}
            </h2>
          </div>
          <span>{displayedGames.length}タイトル</span>
        </div>
        {visible.length ? (
          <div className="game-grid">
            {displayedGames.map((game) => (
              <a
                className="game-card"
                href={`/games/${game.slug}`}
                key={game.slug}
                style={{ '--game-accent': game.accent } as React.CSSProperties}
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
        ) : (
          <div className="empty-state">
            <Search size={28} />
            <h3>該当するガイドはまだありません</h3>
            <p>ゲーム名を短くするか、テーマの絞り込みを外してください。</p>
          </div>
        )}
        {!isFiltering && view !== 'games' ? (
          <a className="section-more" href="/?view=games#games">
            ゲームをすべて見る <ChevronRight size={16} />
          </a>
        ) : null}
      </section>

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

      {displayedArticles.length > 0 && (
        <section
          className="content article-index"
          id="articles"
          aria-labelledby="article-index-title"
        >
          <div className="section-heading">
            <div>
              <p>ISSUE GUIDES</p>
              <h2 id="article-index-title">
                {query || topic !== 'all'
                  ? '該当するトラブル記事'
                  : view === 'articles'
                    ? '解決記事一覧'
                    : '新着の解決記事'}
              </h2>
            </div>
            <span>{displayedArticles.length}記事</span>
          </div>
          <div className="home-article-grid">
            {displayedArticles.map((article) => {
              const game = games.find((item) => item.slug === article.gameSlug);
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
          </div>
          {!isFiltering && view !== 'articles' ? (
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
          <a href="/discord-servers">
            <strong>一緒に遊ぶDiscordを探す</strong>
            <span>日本語PCゲーム向けDiscordサーバー</span>
            <small>
              Discordサーバーを探す <ChevronRight size={14} />
            </small>
          </a>
        </div>
      </section>
      <WikiFooter />
    </main>
  );
}
