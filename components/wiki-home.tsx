'use client';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */

import { useMemo, useState } from 'react';
import { ChevronRight, Search, Wrench } from 'lucide-react';
import { games } from '@/lib/games';
import { categoryLabels, gameArticles } from '@/lib/game-articles';
import { WikiFooter, WikiHeader } from './wiki-header';

const topics = [
  { id: 'all', label: 'すべて' },
  { id: 'launch', label: '起動しない' },
  { id: 'save', label: 'セーブ場所' },
  { id: 'mods', label: 'MODの入れ方' },
  { id: 'display', label: 'FPS上限' },
  { id: 'controller', label: 'コントローラー' },
  { id: 'specs', label: '推奨スペック' },
  { id: 'server', label: '専用サーバー' },
];
const topicKeywords: Record<string, string[]> = {
  launch: ['起動', 'クラッシュ', '白画面', 'GameGuard'],
  save: ['セーブ', '保存'],
  mods: ['MOD', 'SKSE', 'SMAPI', 'REDmod'],
  display: ['FPS', 'カクつき', 'HDR', 'ウルトラワイド', '21:9'],
  controller: ['コントローラー', 'DualSense'],
  specs: ['推奨スペック', '最低スペック', 'VRAM', 'メモリ', 'SSD'],
  server: ['専用サーバー', 'PalWorldSettings.ini', 'ポート', 'バックアップ'],
};

function articleMatchesTopic(category: string, topic: string) {
  if (topic === 'display')
    return category === 'display' || category === 'settings';
  return category === topic;
}

export function WikiHome() {
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
      gameArticles.filter((article) => {
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
          haystack.includes(query.trim().toLowerCase()) &&
          (topic === 'all' || articleMatchesTopic(article.category, topic))
        );
      }),
    [query, topic],
  );

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
            セーブデータの場所、起動トラブル、FPS設定、MOD導入。
            <br />
            人気PCゲームの実用情報を、日本語で短く整理します。
          </p>
        </div>
        <label className="search-box">
          <Search size={20} aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="ゲーム名や症状を検索"
            placeholder="例：エルデンリング FPS上限"
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
        <div className="quick-links" aria-label="絞り込み">
          <span>テーマで絞る</span>
          {topics.slice(1).map((item) => (
            <button
              className={topic === item.id ? 'active' : ''}
              type="button"
              key={item.id}
              onClick={() => setTopic(topic === item.id ? 'all' : item.id)}
              aria-pressed={topic === item.id}
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      <section className="content" id="games">
        <div className="section-heading">
          <div>
            <p>2026 SELECTION</p>
            <h2>
              {query || topic !== 'all'
                ? '検索結果'
                : '今、困っている人が多いゲーム'}
            </h2>
          </div>
          <span>{visible.length}タイトル</span>
        </div>
        {visible.length ? (
          <div className="game-grid">
            {visible.map((game, index) => (
              <a
                className="game-card"
                href={`/games/${game.slug}`}
                key={game.slug}
                style={{ '--game-accent': game.accent } as React.CSSProperties}
              >
                <span className="rank">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <p className="demand">{game.demand}</p>
                  <h3>{game.title}</h3>
                  <div className="tags">
                    {game.tags.slice(0, 3).map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
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
      </section>

      {visibleArticles.length > 0 && (
        <section
          className="content article-index"
          aria-labelledby="article-index-title"
        >
          <div className="section-heading">
            <div>
              <p>ISSUE GUIDES</p>
              <h2 id="article-index-title">
                {query || topic !== 'all'
                  ? '該当するトラブル記事'
                  : '新着の個別トラブル記事'}
              </h2>
            </div>
            <span>{visibleArticles.length}記事</span>
          </div>
          <div className="home-article-grid">
            {visibleArticles.map((article) => {
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
                  <p>{article.symptom}</p>
                  <b>
                    解決手順を見る <ChevronRight size={16} />
                  </b>
                </a>
              );
            })}
          </div>
        </section>
      )}
      <section className="content" aria-labelledby="beyond-games-title">
        <div className="section-heading">
          <div>
            <p>PC GAME +</p>
            <h2 id="beyond-games-title">PCゲーム以外のトラブルもチェック</h2>
          </div>
        </div>
        <div className="guide-index-grid">
          <a href="/guide">
            <strong>PCゲーム共通トラブル解決ガイド</strong>
            <span>起動しない、FPS低下、コントローラー、MODなど、ゲーム名を問わない共通の切り分け手順。</span>
            <small>
              ガイドを見る <ChevronRight size={14} />
            </small>
          </a>
          <a href="/discord">
            <strong>アプリ・ボイスチャットのトラブル（Discord）</strong>
            <span>Discordが起動しない、声が聞こえない、画面共有できないなど、症状別に確認できます。</span>
            <small>
              Discordを見る <ChevronRight size={14} />
            </small>
          </a>
          <a href="/discord-servers">
            <strong>PCゲームのDiscordサーバー募集・検索</strong>
            <span>ゲーム、募集目的、活動時間、VC条件から、日本語で遊べるコミュニティを探せます。</span>
            <small>
              サーバー募集を見る <ChevronRight size={14} />
            </small>
          </a>
        </div>
      </section>
      <WikiFooter />
    </main>
  );
}
