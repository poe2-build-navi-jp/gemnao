import type { Metadata } from 'next';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { notFound } from 'next/navigation';
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  ExternalLink,
  FolderOpen,
  Gauge,
  Gamepad2,
  Languages,
  MonitorUp,
  Puzzle,
  Sparkles,
} from 'lucide-react';
import { IssueFeedback } from '@/components/issue-feedback';
import { GameArticleLinks } from '@/components/game-article-links';
import { PathCopy } from '@/components/path-copy';
import { WikiFooter, WikiHeader } from '@/components/wiki-header';
import { articlesForGame } from '@/lib/game-articles';
import { gameBySlug, games } from '@/lib/games';

export function generateStaticParams() {
  return games.map((game) => ({ slug: game.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const game = gameBySlug(slug);
  if (!game) return {};
  const title =
    game.slug === 'aniimo'
      ? 'アニモ（Aniimo）PC版の不具合・エラー対処法'
      : `${game.shortTitle} PC版｜起動しない・セーブ場所・推奨スペック`;
  const description =
    game.slug === 'aniimo'
      ? 'アニモ（Aniimo）PC版が起動しない、クラッシュ、黒画面、ログインできない、ビデオメモリ不足、ランチャー表示の問題を症状別に解決します。'
      : `${game.shortTitle}のセーブデータと設定ファイルの場所、FPS上限、ウルトラワイド、HDR、コントローラー、起動・クラッシュ対策、MOD、日本語対応を解説。`;
  return {
    title,
    description,
    alternates: {
      canonical: `/games/${game.slug}`,
      languages: {
        'ja-JP': `/games/${game.slug}`,
        en: `/en/games/${game.slug}`,
        'zh-CN': `/zh/games/${game.slug}`,
        es: `/es/games/${game.slug}`,
        'x-default': `/games/${game.slug}`,
      },
    },
    openGraph: {
      type: 'website',
      title,
      description,
      url: `/games/${game.slug}`,
      locale: 'ja_JP',
      images: ['/og-default.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-default.png'],
    },
  };
}

function InfoSection({
  id,
  icon,
  title,
  children,
}: {
  id: string;
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="guide-section" id={id}>
      <h2>
        {icon}
        {title}
      </h2>
      {children}
    </section>
  );
}

export default async function GamePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const game = gameBySlug(slug);
  if (!game) notFound();
  const gameArticles = articlesForGame(game.slug).filter(
    (article) => !['draft', 'thin'].includes(article.status || 'verified'),
  );
  const feedbackTopics = gameArticles.map((article) => ({
    id: article.slug,
    label: article.shortTitle,
  }));
  const faq = game.focused
    ? [
        {
          q: `${game.shortTitle}では何を確認できますか？`,
          a: `${game.launchFixes.join('。')}。確認済みの問題だけを個別記事で案内しています。`,
        },
      ]
    : [
        { q: `${game.shortTitle}のセーブデータはどこ？`, a: game.savePath },
        {
          q: `${game.shortTitle}が起動しないときは？`,
          a: game.launchFixes.slice(0, 2).join('。'),
        },
        { q: `${game.shortTitle}は日本語化が必要？`, a: game.japanese },
      ];
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: `${game.shortTitle} PC版トラブル解決ガイド`,
      dateModified: game.updated,
      author: { '@type': 'Organization', name: 'ゲムなお編集部' },
      inLanguage: 'ja-JP',
      about: game.title,
      mainEntityOfPage: `https://gemnao.pages.dev/games/${game.slug}`,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    },
  ];
  return (
    <main>
      <WikiHeader pagePath={`/games/${game.slug}`} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div
        className="article-hero"
        style={{ '--game-accent': game.accent } as React.CSSProperties}
      >
        <div className="article-hero-inner">
          <nav className="breadcrumbs" aria-label="パンくず">
            <a href="/">ゲムなお</a>
            <span>/</span>
            <a href="/#games">ゲーム一覧</a>
            <span>/</span>
            <b>{game.shortTitle}</b>
          </nav>
          <p className="article-label">PC版 トラブル解決・設定ガイド</p>
          <h1>{game.hubTitle || game.title}</h1>
          <p className="article-lead">{game.lead}</p>
          <div className="article-meta">
            <span>最終確認 {game.updated.replaceAll('-', '.')}</span>
            <span>{game.demand}</span>
          </div>
        </div>
      </div>

      <div className="article-layout">
        <aside className="toc">
          <strong>このページの内容</strong>
          {game.focused ? (
            <>
              <a href="#article-links-title">症状から探す</a>
              <a href="#references">参考情報</a>
            </>
          ) : (
            <>
              <a href="#save">1. 保存場所</a>
              <a href="#display">2. FPS・表示・HDR</a>
              <a href="#controller">3. コントローラー</a>
              <a href="#launch">4. 起動・クラッシュ</a>
              <a href="#mods">5. MOD・日本語</a>
              <a href="#specs">6. 推奨スペック</a>
              <a href="#faq">7. よくある質問</a>
            </>
          )}
        </aside>
        <article className="guide-article">
          <div className="safety-note">
            <AlertTriangle size={20} />
            <div>
              <strong>変更前にバックアップ</strong>
              <p>
                セーブと設定ファイルは、フォルダごと別の場所へコピーしてから操作してください。
              </p>
            </div>
          </div>

          <GameArticleLinks game={game} />

          <section className="evidence-panel" aria-labelledby="evidence-title">
            <div className="evidence-copy">
              <p className="evidence-label">EVIDENCE STATUS</p>
              <h2 id="evidence-title">
                <BarChart3 size={22} />
                このガイドの根拠
              </h2>
              <p>
                公式ストアと技術資料を照合し、実行可能な手順だけを要約しています。外部サイトの文章は転載していません。
              </p>
            </div>
            <div className="evidence-stats">
              <div>
                <span>困りごとの需要</span>
                <b>{game.issueScale || '高い'}</b>
                <small>プレイ動向と公開情報からの相対評価</small>
              </div>
              <div>
                <span>確認した出典</span>
                <b>{game.sources.length}件</b>
                <small>本ページから確認可能</small>
              </div>
              <div>
                <span>優先度付き対策</span>
                <b>{game.launchFixes.length}件</b>
                <small>上から順に切り分け</small>
              </div>
            </div>
            <p className="evidence-caveat">
              ※
              需要は正確な利用者数や成功率ではありません。外部サービスは「困った人数」と「解決した人数」を公式集計していないため、数値を推計していません。
            </p>
          </section>

          {feedbackTopics.length ? (
            <IssueFeedback
              gameSlug={game.slug}
              topicOptions={feedbackTopics}
              heading={`${game.shortTitle}で困っていること`}
            />
          ) : null}

          {!game.focused && (
            <>
              <InfoSection
                id="save"
                icon={<FolderOpen />}
                title="セーブデータと設定ファイルの場所"
              >
                <h3>セーブデータ</h3>
                <div className="path-box">
                  <code>{game.savePath}</code>
                  <PathCopy value={game.savePath} />
                </div>
                <h3>設定ファイル</h3>
                <div className="path-box">
                  <code>{game.configPath}</code>
                  <PathCopy value={game.configPath} />
                </div>
                <p className="tip">
                  <b>開き方：</b> <kbd>Windows</kbd> + <kbd>R</kbd> を押し、上の{' '}
                  <code>%APPDATA%</code> または <code>%LOCALAPPDATA%</code>{' '}
                  から始まるパスを貼り付けます。
                </p>
              </InfoSection>

              <InfoSection
                id="display"
                icon={<MonitorUp />}
                title="FPS上限・ウルトラワイド・HDR"
              >
                <div className="fact-grid">
                  <div>
                    <span>
                      <Gauge size={17} /> FPS
                    </span>
                    <p>{game.fps}</p>
                  </div>
                  <div>
                    <span>
                      <MonitorUp size={17} /> 21:9 / 32:9
                    </span>
                    <p>{game.ultrawide}</p>
                  </div>
                  <div>
                    <span>
                      <Sparkles size={17} /> HDR
                    </span>
                    <p>{game.hdr}</p>
                  </div>
                </div>
              </InfoSection>

              <InfoSection
                id="controller"
                icon={<Gamepad2 />}
                title="コントローラー対応"
              >
                <p>{game.controller}</p>
                <p className="tip">
                  Steam
                  InputとDS4Windowsなどを同時に使うと、2回入力やボタン表示の乱れが起こることがあります。変換手段は1つずつ試します。
                </p>
              </InfoSection>

              <InfoSection
                id="launch"
                icon={<AlertTriangle />}
                title="起動しない・クラッシュ時の対策"
              >
                <p>
                  上から1つずつ試し、毎回起動を確認します。複数を同時に変えると原因が分からなくなります。
                </p>
                <ol className="fix-list">
                  {game.launchFixes.map((fix, index) => (
                    <li key={fix}>
                      <span>{index + 1}</span>
                      <div>
                        <b>{fix}</b>
                        {index === 0 && (
                          <small>
                            ここで直るケースが最も多いため、最初に実施します。
                          </small>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </InfoSection>

              <InfoSection
                id="mods"
                icon={<Puzzle />}
                title="MODの入れ方・日本語化"
              >
                <h3>MOD</h3>
                <p>{game.mod}</p>
                <h3>
                  <Languages size={18} /> 日本語対応
                </h3>
                <p>{game.japanese}</p>
              </InfoSection>

              <InfoSection
                id="specs"
                icon={<CheckCircle2 />}
                title="スペックの目安"
              >
                <div className="spec-table">
                  <div>
                    <b>最低の目安</b>
                    <span>{game.specs.minimum}</span>
                  </div>
                  <div>
                    <b>推奨の目安</b>
                    <span>{game.specs.recommended}</span>
                  </div>
                  <div>
                    <b>ストレージ</b>
                    <span>{game.specs.storage}</span>
                  </div>
                </div>
                <p className="source-note">
                  公式要件はアップデートで変更されることがあります。購入前はストアの最新表示も確認してください。
                </p>
              </InfoSection>

              <section className="faq-section" id="faq">
                <h2>よくある質問</h2>
                <div>
                  {faq.map((item) => (
                    <details key={item.q}>
                      <summary>{item.q}</summary>
                      <p>{item.a}</p>
                    </details>
                  ))}
                </div>
              </section>
            </>
          )}

          <section className="sources" id="references">
            <h2>参考・確認先</h2>
            {game.sources.map((source) => (
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                key={source.url}
              >
                {source.label}
                <ExternalLink size={15} />
              </a>
            ))}
          </section>
        </article>
      </div>
      <WikiFooter />
    </main>
  );
}
