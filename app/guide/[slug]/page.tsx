import {
  StutterBeforeSteps,
  StutterAfterSteps,
} from '@/components/stutter-details';
import {
  UninstallSaveBeforeSteps,
  UninstallSaveAfterSteps,
} from '@/components/uninstall-save-details';
import {
  SaveBackupBeforeSteps,
  SaveBackupAfterSteps,
} from '@/components/save-backup-details';
import {
  ShaderCacheBeforeSteps,
  ShaderCacheAfterSteps,
} from '@/components/shader-cache-details';
import {
  ReShadeBeforeSteps,
  ReShadeAfterSteps,
} from '@/components/reshade-details';
import type { Metadata } from 'next';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { notFound } from 'next/navigation';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { WikiFooter, WikiHeader } from '@/components/wiki-header';
import { InteractiveSteps } from '@/components/interactive-steps';
import {
  ResetConfigBeforeSteps,
  ResetConfigAfterSteps,
} from '@/components/reset-config-details';
import { ShareButtons } from '@/components/share-buttons';
import { SolutionIllustration } from '@/components/solution-illustration';
import { gameArticles } from '@/lib/game-articles';
import { gameBySlug } from '@/lib/games';
import { commonGuideBySlug, commonGuides } from '@/lib/common-guides';
import { troubleHubForGuide } from '@/lib/trouble-hubs';
import { guideVisualBySlug } from '@/lib/visual-guides';
import { ogImageFor } from '@/lib/og-images';
export function generateStaticParams() {
  return commonGuides
    .filter(({ status }) => status === 'verified')
    .map(({ slug }) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = commonGuideBySlug(slug);
  const visual = guideVisualBySlug(slug);
  return item
    ? {
        title: item.title,
        description: item.description,
        alternates: { canonical: `/guide/${slug}` },
        openGraph: {
          type: 'article',
          title: item.title,
          description: item.description,
          url: `/guide/${slug}`,
          locale: 'ja_JP',
          modifiedTime: item.checkedAt,
          images: [visual?.ogImage || ogImageFor(`/guide/${slug}`)],
        },
        twitter: {
          card: 'summary_large_image',
          title: item.title,
          description: item.description,
          images: [visual?.ogImage || ogImageFor(`/guide/${slug}`)],
        },
      }
    : {};
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = commonGuideBySlug(slug);
  if (!item) notFound();
  if (item.status === 'draft' || item.status === 'thin') notFound();
  const visual = guideVisualBySlug(slug);
  const canonical = `https://gemnao.pages.dev/guide/${item.slug}`;
  const faq = item.faqs ?? [
    {
      question: `${item.shortTitle}は何から試しますか？`,
      answer: item.conclusion,
    },
    {
      question: '複数の対策を同時に行ってよいですか？',
      answer:
        '原因が分からなくなるため、1項目ずつ試し、毎回起動して確認します。',
    },
  ];
  const topic =
    item.slug.includes('save') || item.slug.includes('uninstall')
      ? 'save'
      : item.slug.includes('controller')
        ? 'controller'
        : item.slug.includes('mod') || item.slug.includes('reshade')
          ? 'mods'
          : item.slug.includes('fps') ||
              item.slug.includes('vram') ||
              item.slug.includes('stutter') ||
              item.slug.includes('shader')
            ? 'display'
            : 'launch';
  const gameLinks = gameArticles
    .filter(
      (article) =>
        article.category === (slug === 'reshade-uninstall' ? 'mods' : topic) ||
        (topic === 'display' && article.category === 'settings'),
    )
    .slice(0, 5);
  const troubleHub = troubleHubForGuide(item);
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: item.title,
      description: item.description,
      dateModified: item.checkedAt,
      author: { '@type': 'Organization', name: 'ゲムなお編集部' },
      inLanguage: 'ja-JP',
      mainEntityOfPage: canonical,
      image: `https://gemnao.pages.dev${visual?.image || ogImageFor(`/guide/${slug}`)}`,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'ゲムなお',
          item: 'https://gemnao.pages.dev/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'PC共通ガイド',
          item: 'https://gemnao.pages.dev/guide',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: item.shortTitle,
          item: canonical,
        },
      ],
    },
  ];
  return (
    <main>
      <WikiHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <header className="article-hero issue-hero">
        <div className="article-hero-inner">
          <nav className="breadcrumbs">
            <a href="/">ゲムなお</a>
            <span>›</span>
            <a href="/guide">共通ガイド</a>
            <span>›</span>
            <b>{item.shortTitle}</b>
          </nav>
          <p className="article-label">PCゲーム共通トラブル解決</p>
          <h1>{item.title}</h1>
          <p className="article-lead">{item.description}</p>
          <div className="article-meta">
            <span>最終確認：{item.checkedAt.replaceAll('-', '.')}</span>
            <span>公式資料を優先して確認</span>
          </div>
        </div>
      </header>
      <div className="article-layout issue-layout">
        <aside className="toc issue-toc">
          <strong>このページの内容</strong>
          <a href="#answer">まず試すこと</a>
          {slug === 'stutter-fix' ? (
            <>
              <a href="#stutter-symptoms">症状別の切り分け</a>
              <a href="#stutter-limit">FPS上限の設定場所</a>
              <a href="#stutter-values">数値の決め方</a>
            </>
          ) : null}
          {slug === 'uninstall-save-data' ? (
            <>
              <a href="#uninstall-decision">削除方法で判断する</a>
              <a href="#uninstall-examples">ゲーム別の具体例</a>
            </>
          ) : null}
          {slug === 'save-data-backup' ? (
            <a href="#save-locations">ゲーム別の保存先3例</a>
          ) : null}
          {slug === 'shader-cache-delete' ? (
            <>
              <a href="#shader-route">操作する対象を選ぶ</a>
              <a href="#shader-windows">Windowsの削除画面</a>
              <a href="#shader-nvidia">NVIDIAの削除手順</a>
              <a href="#shader-amd">AMDのリセット</a>
              <a href="#shader-game">ゲーム内の具体例</a>
              <a href="#shader-rebuild">再構築中の判断</a>
              <a href="#shader-record">確認メモ</a>
            </>
          ) : null}
          {slug === 'reshade-uninstall' ? (
            <>
              <a href="#reshade-route">導入方法で選ぶ</a>
              <a href="#reshade-files">ファイルの見分け方</a>
            </>
          ) : null}
          {slug === 'reset-config-file' ? (
            <>
              <a href="#config-location">ゲーム別の保存先3例</a>
              <a href="#reset-decision">初期化すべき症状</a>
              <a href="#reset-checklist">作業前チェック</a>
            </>
          ) : null}
          {item.steps.map((s, i) => (
            <a href={`#step-${i + 1}`} key={s.title}>
              {i + 1}. {s.title}
            </a>
          ))}
          {slug === 'reset-config-file' ? (
            <>
              <a href="#reset-troubleshooting">再生成できない時</a>
              <a href="#reset-record">保存・共有用メモ</a>
            </>
          ) : null}
          {slug === 'reshade-uninstall' ? (
            <>
              <a href="#reshade-still-loaded">まだ表示される場合</a>
              <a href="#reshade-restore">元に戻す方法</a>
              <a href="#reshade-record">確認メモ</a>
            </>
          ) : null}
          {slug === 'save-data-backup' ? (
            <>
              <a href="#save-verify">コピー成功の確認方法</a>
              <a href="#save-restore">バックアップの復元</a>
              <a href="#save-trouble">失敗した時の確認表</a>
              <a href="#save-record">バックアップ記録</a>
            </>
          ) : null}
          {slug === 'uninstall-save-data' ? (
            <>
              <a href="#uninstall-normal">通常アンインストール</a>
              <a href="#uninstall-after">再インストール後の確認</a>
              <a href="#uninstall-record">削除前の3行メモ</a>
            </>
          ) : null}
          {slug === 'stutter-fix' ? (
            <>
              <a href="#stutter-compare">同じ場面で比較する</a>
              <a href="#stutter-record">比較メモ</a>
              <a href="#stutter-next">改善しない時</a>
            </>
          ) : null}
          <a href="#faq">よくある質問</a>
        </aside>
        <article className="guide-article">
          <section className="answer-summary" id="answer">
            <p className="evidence-label">まずこれを試す</p>
            <h2>
              <CheckCircle2 size={23} />
              結論
            </h2>
            <p>{item.conclusion}</p>
            <ol>
              {item.steps.map((s) => (
                <li key={s.title}>{s.title}</li>
              ))}
            </ol>
          </section>
          {visual ? <SolutionIllustration visual={visual} /> : null}
          {slug === 'low-fps' ? (
            <p>
              平均FPSは出ているのに一瞬止まる場合は、{' '}
              <a href="/guide/stutter-fix">ゲームがカクつく・一瞬止まる時の確認手順</a>
              をご覧ください。
            </p>
          ) : null}
          <section className="cause-block" aria-labelledby="cause-title">
            <h2 id="cause-title">原因候補</h2>
            <ul>
              {item.causes.map((cause) => (
                <li key={cause}>{cause}</li>
              ))}
            </ul>
          </section>
          {troubleHub ? (
            <nav className="article-parent-links" aria-label="この記事の分類">
              <a href="/guide">PC共通ガイド一覧</a>
              <a href={`/trouble/${troubleHub.slug}`}>
                {troubleHub.label}の症状別ガイド
              </a>
            </nav>
          ) : null}
          {slug === 'reset-config-file' ? <ResetConfigBeforeSteps /> : null}
          {slug === 'reshade-uninstall' ? <ReShadeBeforeSteps /> : null}
          {slug === 'shader-cache-delete' ? <ShaderCacheBeforeSteps /> : null}
          {slug === 'save-data-backup' ? <SaveBackupBeforeSteps /> : null}
          {slug === 'uninstall-save-data' ? <UninstallSaveBeforeSteps /> : null}
          {slug === 'stutter-fix' ? <StutterBeforeSteps /> : null}
          <InteractiveSteps
            contextSlug={`guide-${item.slug}`}
            topic={topic}
            articleTitle={item.title}
            articlePath={`/guide/${item.slug}`}
            shareHashtag="PCゲーム"
            steps={item.steps.map((step, index) => ({
              id: `step-${index + 1}`,
              title: step.title,
              actions: step.actions,
            }))}
            nextLinks={[
              ...item.related
                .map((slug) => commonGuideBySlug(slug))
                .filter((guide): guide is NonNullable<typeof guide> =>
                  Boolean(guide),
                )
                .map((guide) => ({
                  href: `/guide/${guide.slug}`,
                  label: guide.shortTitle,
                })),
              ...(troubleHub
                ? [
                    {
                      href: `/trouble/${troubleHub.slug}`,
                      label: `${troubleHub.label}の症状別ガイド`,
                    },
                  ]
                : []),
              { href: '/guide', label: 'PC共通ガイド一覧へ戻る' },
            ]}
          />
          {slug === 'reset-config-file' ? <ResetConfigAfterSteps /> : null}
          {slug === 'reshade-uninstall' ? <ReShadeAfterSteps /> : null}
          {slug === 'shader-cache-delete' ? <ShaderCacheAfterSteps /> : null}
          {slug === 'save-data-backup' ? <SaveBackupAfterSteps /> : null}
          {slug === 'uninstall-save-data' ? <UninstallSaveAfterSteps /> : null}
          {slug === 'stutter-fix' ? <StutterAfterSteps /> : null}
          <section className="caution-block">
            <h2>
              <AlertTriangle size={22} />
              注意
            </h2>
            <p>
              {slug === 'stutter-fix'
                ? '比較中にキャッシュ削除・画質変更・ドライバー更新をまとめて行わないでください。変更前の値を残し、悪化した設定は戻します。PC全体の再起動やブルースクリーンは、ゲームが一瞬カクつく症状とは分けて調べてください。'
                : slug === 'uninstall-save-data'
                  ? 'AppData・Documents・Saved Games・Steamのuserdataを、残存ファイルという理由で丸ごと消さないでください。追加のクリーナーによる削除は通常アンインストールとは別操作です。バックアップは再インストール後の読み込み確認まで残します。'
                  : slug === 'save-data-backup'
                    ? 'ゲームや同期が動いている最中にセーブを入れ替えないでください。バックアップ原本と復元前のデータは残し、別アカウントや別ストアのデータを推測で上書きしないでください。'
                    : slug === 'shader-cache-delete'
                      ? 'キャッシュ以外の項目をまとめて削除しないでください。AppDataやゲームフォルダー全体、セーブ、設定、配布されたシェーダーファイルは削除対象ではありません。対象を特定できない時は操作を止めます。'
                      : slug === 'reshade-uninstall'
                        ? '同名のDLLを一括削除したり、セキュリティ機能やアンチチートを無効にしたりしないでください。オンラインゲームでは運営の利用規約・MOD方針を確認し、起動制限の回避に使わないでください。'
                        : slug === 'reset-config-file'
                          ? 'AppData・Documents・Saved・Steamのuserdataを丸ごと削除しないでください。レジストリ編集やWindowsの初期化は、この手順には必要ありません。公式の対象ファイルを特定できない時は操作を止めてください。'
                          : '変更前にセーブと設定をバックアップし、対策は1項目ずつ試してください。'}
            </p>
          </section>
          <section className="faq-section" id="faq">
            <h2>よくある質問</h2>
            <div>
              {faq.map((f) => (
                <details key={f.question}>
                  <summary>{f.question}</summary>
                  <p>{f.answer}</p>
                </details>
              ))}
            </div>
          </section>
          <section className="related-section">
            <h2>まだ直りませんか？ 次に試す記事</h2>
            <div>
              {item.related.map((s) => {
                const r = commonGuideBySlug(s);
                return r ? (
                  <a href={`/guide/${s}`} key={s}>
                    {r.shortTitle}
                    <ArrowRight size={15} />
                  </a>
                ) : null;
              })}
            </div>
          </section>
          <section className="related-section">
            <h2>ゲーム別の対処法</h2>
            <div>
              {gameLinks.map((article) => (
                <a
                  href={`/games/${article.gameSlug}/${article.slug}`}
                  key={`${article.gameSlug}-${article.slug}`}
                >
                  {gameBySlug(article.gameSlug)?.shortTitle}：
                  {article.shortTitle}
                  <ArrowRight size={15} />
                </a>
              ))}
            </div>
          </section>
          <ShareButtons
            title={item.title}
            path={`/guide/${item.slug}`}
            hashtag="PCゲーム"
          />
          <p className="correction-link">
            この記事の情報に問題がありますか？{' '}
            <a href={`/contact?url=${encodeURIComponent(canonical)}`}>
              誤りを報告する
            </a>
          </p>
          <section className="sources" id="references">
            <h2>参考情報・出典</h2>
            <p className="source-policy">
              公式資料を確認し、本文は独自の表現で要約しています。
            </p>
            {item.sources.map((s) => (
              <a href={s.url} target="_blank" rel="noreferrer" key={s.url}>
                {s.label}
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
