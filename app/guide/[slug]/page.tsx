import {
  GpuDriverBeforeSteps,
  GpuDriverAfterSteps,
} from '@/components/gpu-driver-details';
import { BsodBeforeSteps, BsodAfterSteps } from '@/components/bsod-details';
import {
  PowerShutdownBeforeSteps,
  PowerShutdownAfterSteps,
} from '@/components/power-shutdown-details';
import {
  SteamCloudBeforeSteps,
  SteamCloudAfterSteps,
} from '@/components/steam-cloud-details';
import {
  BlackScreenBeforeSteps,
  BlackScreenAfterSteps,
} from '@/components/black-screen-details';
import {
  FreezeBeforeSteps,
  FreezeAfterSteps,
} from '@/components/freeze-details';
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
          {slug === 'steam-cloud-sync-error' ? (
            <>
              <a href="#cloud-first">選択前に保全する</a>
              <a href="#cloud-devices">1台／複数PCの分岐</a>
              <a href="#cloud-progress">進行状況を照合する</a>
              <a href="#cloud-examples">ローカル／クラウドの例</a>
              <a href="#cloud-verify">選択後の確認</a>
              <a href="#cloud-error">同期できない場合</a>
            </>
          ) : null}
          {slug === 'pc-shuts-down-while-gaming' ? (
            <>
              <a href="#power-symptoms">症状別の確認表</a>
              <a href="#power-history">イベント41の読み方</a>
              <a href="#power-temperature">温度の確認と判断</a>
              <a href="#power-safe">自分で確認できる範囲</a>
              <a href="#power-service">点検依頼の目安</a>
            </>
          ) : null}
          {slug === 'bsod-while-gaming' ? (
            <>
              <a href="#bsod-first">最初に記録する3点</a>
              <a href="#bsod-codes">停止コード別の確認先</a>
              <a href="#bsod-memory">メモリ診断と結果</a>
              <a href="#bsod-dump">ミニダンプの場所</a>
              <a href="#bsod-report">相談時のメモ</a>
            </>
          ) : null}
          {slug === 'gpu-driver-update' ? (
            <>
              <a href="#gpu-prepare">更新前の記録</a>
              <a href="#gpu-vendors">メーカー別の入口</a>
              <a href="#gpu-nvidia">NVIDIAの更新画面</a>
              <a href="#gpu-amd">AMDの更新画面</a>
              <a href="#gpu-intel">Intelの更新画面</a>
              <a href="#gpu-compare">同じ条件で比較</a>
              <a href="#gpu-rollback">悪化した時の戻し方</a>
              <a href="#gpu-record">更新記録メモ</a>
            </>
          ) : null}
          {slug === 'black-screen' ? (
            <>
              <a href="#black-symptoms">症状別の切り分け</a>
              <a href="#black-windows">Windowsも映らない場合</a>
              <a href="#black-display">ゲームの表示設定を戻す</a>
              <a href="#black-config">設定ファイルの具体例</a>
              <a href="#black-next">比較結果から次を選ぶ</a>
              <a href="#black-record">相談用メモ</a>
            </>
          ) : null}
          {slug === 'pc-game-freezes' ? (
            <>
              <a href="#freeze-scope">ゲームだけ？ PC全体？</a>
              <a href="#freeze-memory">メモリの確認と読み方</a>
              <a href="#freeze-temperature">温度を確認する方法</a>
              <a href="#freeze-history">停止後の履歴を調べる</a>
              <a href="#freeze-compare">比較手順と相談用メモ</a>
            </>
          ) : null}
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
              <a href="/guide/stutter-fix">
                ゲームがカクつく・一瞬止まる時の確認手順
              </a>
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
          {slug === 'black-screen' ? <BlackScreenBeforeSteps /> : null}
          {slug === 'gpu-driver-update' ? <GpuDriverBeforeSteps /> : null}
          {slug === 'bsod-while-gaming' ? <BsodBeforeSteps /> : null}
          {slug === 'steam-cloud-sync-error' ? <SteamCloudBeforeSteps /> : null}
          {slug === 'pc-shuts-down-while-gaming' ? (
            <PowerShutdownBeforeSteps />
          ) : null}
          {slug === 'pc-game-freezes' ? <FreezeBeforeSteps /> : null}
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
          {slug === 'black-screen' ? <BlackScreenAfterSteps /> : null}
          {slug === 'gpu-driver-update' ? <GpuDriverAfterSteps /> : null}
          {slug === 'bsod-while-gaming' ? <BsodAfterSteps /> : null}
          {slug === 'steam-cloud-sync-error' ? <SteamCloudAfterSteps /> : null}
          {slug === 'pc-shuts-down-while-gaming' ? (
            <PowerShutdownAfterSteps />
          ) : null}
          {slug === 'pc-game-freezes' ? <FreezeAfterSteps /> : null}
          {slug === 'stutter-fix' ? <StutterAfterSteps /> : null}
          <section className="caution-block">
            <h2>
              <AlertTriangle size={22} />
              注意
            </h2>
            <p>
              {slug === 'steam-cloud-sync-error'
                ? '競合画面で選択すると、別の端末やクラウド側の進行が上書きされる可能性があります。複数PCの場合は各PCでゲームを起動しないままコピーを残し、セーブの保存先を推測して削除しないでください。通信エラー中の強行起動や、新しいセーブでの上書きも避けてください。'
                : slug === 'pc-shuts-down-while-gaming'
                  ? '焦げた臭い・煙・火花・変形・損傷を見つけたら使用を止めてください。電源ユニットやバッテリーを分解せず、損傷した電源コードを差し直して試さないでください。症状を繰り返し再現させず、PCメーカーまたは修理窓口に相談してください。'
                  : slug === 'bsod-while-gaming'
                    ? '停止を繰り返すPCで無理にゲームを再起動しないでください。ダンプには作業中の情報が含まれる可能性があるため、公開せずサポートの案内に沿って提出します。停止コードやファイル名だけで部品の故障と判断せず、診断結果と時刻を合わせて確認してください。'
                    : slug === 'gpu-driver-update'
                      ? '対象GPUとPC型番に合う公式配布を使い、今の版を控えてから更新してください。AMDのFactory Resetは以前の版へ戻せなくなるため通常の比較では選びません。画面が映らない場合は別のPCやメーカーサポートで復旧方法を確認し、無関係なドライバーを削除しないでください。'
                      : slug === 'black-screen'
                        ? '設定ファイルの退避前にバックアップを作り、セーブのフォルダーや不明なDLLを丸ごと削除しないでください。強制終了は未保存の進行を失う可能性があります。モニター・PC内部の分解や、原因不明のままWindowsを初期化する操作は、この手順には含みません。'
                        : slug === 'pc-game-freezes'
                          ? '強制終了は未保存データを失う可能性があるため最後の手段です。原因不明のままWindowsのプロセスを終了したり、メモリ解放ソフト・ページファイル無効化・電圧変更をまとめて試したりしないでください。MODや設定を変更する前はセーブをバックアップします。'
                          : slug === 'stutter-fix'
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
