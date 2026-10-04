import { ArticleToc } from '@/components/article-toc';
import { ArticleDiagnosisEntry } from '@/components/article-diagnosis-entry';
import { EditorialByline } from '@/components/editorial-byline';
import { editorialAuthor, editorialPublisher } from '@/lib/editorial-identity';
import { SaveArticle } from '@/components/save-article';
import { hasTranslation, languageAlternates } from '@/lib/localized/index';
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
import { CrashBeforeSteps, CrashAfterSteps } from '@/components/crash-details';
import { DirectxBeforeSteps, DirectxAfterSteps } from '@/components/directx-details';
import {
  SteamLaunchBeforeSteps,
  SteamLaunchAfterSteps,
} from '@/components/steam-launch-details';
import { AudioBeforeSteps, AudioAfterSteps } from '@/components/audio-details';
import { VramBeforeSteps, VramAfterSteps } from '@/components/vram-details';
import { LowFpsBeforeSteps, LowFpsAfterSteps } from '@/components/low-fps-details';
import { LowGpuUsageBeforeSteps, LowGpuUsageAfterSteps } from '@/components/low-gpu-usage-details';
import { SteamDiskWriteBeforeSteps, SteamDiskWriteAfterSteps } from '@/components/steam-disk-write-details';
import { SteamInputBeforeSteps, SteamInputAfterSteps } from '@/components/steam-input-details';
import { ControllerDoubleBeforeSteps, ControllerDoubleAfterSteps } from '@/components/controller-double-input-details';
import { RemoveModsBeforeSteps, RemoveModsAfterSteps } from '@/components/remove-mods-details';
import { VisualCBeforeSteps, VisualCAfterSteps } from '@/components/visual-c-details';
import { VerifySteamBeforeSteps, VerifySteamAfterSteps } from '@/components/verify-steam-details';
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
        alternates: { canonical: `/guide/${slug}`, ...(hasTranslation('en', `/guide/${slug}`) ? { languages: languageAlternates(`/guide/${slug}`) } : {}) },
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
      author: editorialAuthor,
      publisher: editorialPublisher,
      citation: item.sources.map((source) => source.url),
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
      <WikiHeader pagePath={`/guide/${slug}`} />
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
            <EditorialByline />
            <span>最終確認：{item.checkedAt.replaceAll('-', '.')}</span>
            <span>公式資料を優先して確認</span>
          </div>
          <SaveArticle path={`/guide/${item.slug}`} title={item.title} />
        </div>
      </header>
      <div className="article-layout issue-layout">
        <ArticleToc title={'このページの内容'} className="issue-toc">
          <a href="#answer">まず試すこと</a>
          {slug === 'verify-steam-files' ? (
            <>
              <a href="#verify-what">整合性確認で分かること</a>
              <a href="#verify-outcomes">結果別の早見表</a>
              <a href="#verify-mods">MOD・セーブへの影響</a>
            </>
          ) : null}
          {slug === 'visual-c-runtime-error' ? (
            <>
              <a href="#vc-error-table">DLL名・エラー別の判断表</a>
              <a href="#vc-architecture">x86／x64の選び方</a>
              <a href="#vc-installed">Windowsの導入済み一覧</a>
            </>
          ) : null}
          {slug === 'controller-double-input' ? (
            <>
              <a href="#double-quick">1回押しで症状を確認</a>
              <a href="#double-devices">実機と仮想パッドの見分け方</a>
              <a href="#double-results">結果別の判断表</a>
              <a href="#double-options">外部ツールが必要な場合</a>
              <a href="#double-steam">Steam・ゲーム側の確認</a>
            </>
          ) : null}
          {slug === 'steam-input-controller' ? (
            <>
              <a href="#input-branches">認識地点別の確認表</a>
              <a href="#input-device">Steamが認識しない場合</a>
              <a href="#input-game">Steamでは認識する場合</a>
              <a href="#input-results">設定変更後の期待結果</a>
              <a href="#input-conflicts">部分的・二重入力</a>
            </>
          ) : null}
          {slug === 'low-gpu-usage' ? (
            <>
              <a href="#gpu-normal">正常な低使用率</a>
              <a href="#gpu-readings">FPS・CPU・使用GPUの確認</a>
              <a href="#gpu-table">組み合わせ判断表</a>
              <a href="#gpu-cpu">CPU側の比較</a>
              <a href="#gpu-select">ゲームのGPU選択</a>
              <a href="#gpu-next">改善しない場合</a>
            </>
          ) : null}
          {slug === 'steam-disk-write-error' ? (
            <>
              <a href="#disk-target">保存先ドライブの特定</a>
              <a href="#disk-space">空き容量の判断</a>
              <a href="#disk-repair">修復後の確認</a>
              <a href="#disk-results">結果別の次の行動</a>
              <a href="#disk-check">ドライブ点検の条件</a>
            </>
          ) : null}
          {slug === 'low-fps' ? (
            <>
              <a href="#fps-measure">同じ場面での計測</a>
              <a href="#fps-branches">上限・CPU・GPUの分岐</a>
              <a href="#fps-limit">FPS上限の確認</a>
              <a href="#fps-compare">解像度を変えた数値例</a>
              <a href="#fps-next">結果別の次の行動</a>
            </>
          ) : null}
          {slug === 'vram-shortage' ? (
            <>
              <a href="#vram-readings">専用・共有メモリの読み方</a>
              <a href="#vram-observe">症状と数値の照合</a>
              <a href="#vram-compare">設定変更前後の比較例</a>
              <a href="#vram-next">結果別の次の行動</a>
            </>
          ) : null}
          {slug === 'no-game-audio' ? (
            <>
              <a href="#audio-scope">PC全体？ ゲームだけ？</a>
              <a href="#audio-output">① Windowsの出力先</a>
              <a href="#audio-mixer">② 音量ミキサー</a>
              <a href="#audio-game">③ ゲーム内設定</a>
              <a href="#audio-next">結果別の次の行動</a>
            </>
          ) : null}
          {slug === 'steam-game-not-launching' ? (
            <>
              <a href="#steam-launch-symptoms">症状別の対処表</a>
              <a href="#steam-launch-process">プロセスを確認</a>
              <a href="#steam-launch-history">起動履歴の見方</a>
              <a href="#steam-launch-results">結果から次を選ぶ</a>
            </>
          ) : null}
          {slug === 'directx-error' ? (
            <>
              <a href="#directx-error-types">エラー名別の分岐</a>
              <a href="#directx-feature">機能レベルの見方</a>
              <a href="#directx-dll">追加DLLが不足する時</a>
              <a href="#directx-gpu">GPU関連エラー</a>
              <a href="#directx-system">Windows標準DLL</a>
            </>
          ) : null}
          {slug === 'pc-game-crash' ? (
            <>
              <a href="#crash-scope">ゲームだけ落ちる？</a>
              <a href="#crash-timing">タイミング別の対処表</a>
              <a href="#crash-history">エラーなし時の履歴</a>
              <a href="#steam-client-case">ワイルズの実際の改善報告</a>
              <a href="#crash-compare">結果から次を選ぶ</a>
            </>
          ) : null}
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
          {slug === 'remove-mods-safely' ? (
            <>
              <a href="#mods-methods">導入方法別の判断表</a>
              <a href="#mods-backup">セーブと記録の退避</a>
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
          {slug === 'verify-steam-files' ? (
            <>
              <a href="#verify-repeat">再発した時の確認先</a>
              <a href="#verify-record">相談用の確認メモ</a>
            </>
          ) : null}
          {slug === 'visual-c-runtime-error' ? (
            <>
              <a href="#vc-failed">修復失敗時の判断表</a>
              <a href="#vc-record">問い合わせ用の記録</a>
            </>
          ) : null}
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
          {slug === 'remove-mods-safely' ? (
            <>
              <a href="#mods-residue">残存確認の判断表</a>
              <a href="#mods-restore">元に戻す手順</a>
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
        </ArticleToc>
        <article className="guide-article">
          <section className="answer-summary" id="answer">
            <p className="evidence-label">まずこれを試す</p>
            <h2>
              <CheckCircle2 size={23} />
              結論
            </h2>
            <p>{item.conclusion}</p>
            <ol>
              {item.steps.map((s, index) => (
                <li key={s.title}>
                  <a className="summary-step-link" href={`#step-${index + 1}`}>
                    STEP {index + 1}｜{s.title}
                  </a>
                </li>
              ))}
            </ol>
            {item.related.length ? (
              <a className="article-next-jump" href="#related-guides">
                この手順で直らない場合：症状に合う次の確認 →
              </a>
            ) : null}
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
          {slug === 'remove-mods-safely' ? <RemoveModsBeforeSteps /> : null}
          {slug === 'visual-c-runtime-error' ? <VisualCBeforeSteps /> : null}
          {slug === 'verify-steam-files' ? <VerifySteamBeforeSteps /> : null}
          {slug === 'shader-cache-delete' ? <ShaderCacheBeforeSteps /> : null}
          {slug === 'save-data-backup' ? <SaveBackupBeforeSteps /> : null}
          {slug === 'uninstall-save-data' ? <UninstallSaveBeforeSteps /> : null}
          {slug === 'black-screen' ? <BlackScreenBeforeSteps /> : null}
          {slug === 'gpu-driver-update' ? <GpuDriverBeforeSteps /> : null}
          {slug === 'bsod-while-gaming' ? <BsodBeforeSteps /> : null}
          {slug === 'steam-cloud-sync-error' ? <SteamCloudBeforeSteps /> : null}
          {slug === 'pc-game-crash' ? <CrashBeforeSteps /> : null}
          {slug === 'directx-error' ? <DirectxBeforeSteps /> : null}
          {slug === 'steam-game-not-launching' ? (
            <SteamLaunchBeforeSteps />
          ) : null}
          {slug === 'no-game-audio' ? <AudioBeforeSteps /> : null}
          {slug === 'vram-shortage' ? <VramBeforeSteps /> : null}
          {slug === 'low-fps' ? <LowFpsBeforeSteps /> : null}
          {slug === 'low-gpu-usage' ? <LowGpuUsageBeforeSteps /> : null}
          {slug === 'steam-input-controller' ? <SteamInputBeforeSteps /> : null}
          {slug === 'controller-double-input' ? <ControllerDoubleBeforeSteps /> : null}
          {slug === 'steam-disk-write-error' ? <SteamDiskWriteBeforeSteps /> : null}
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
          {slug === 'remove-mods-safely' ? <RemoveModsAfterSteps /> : null}
          {slug === 'visual-c-runtime-error' ? <VisualCAfterSteps /> : null}
          {slug === 'verify-steam-files' ? <VerifySteamAfterSteps /> : null}
          {slug === 'shader-cache-delete' ? <ShaderCacheAfterSteps /> : null}
          {slug === 'save-data-backup' ? <SaveBackupAfterSteps /> : null}
          {slug === 'uninstall-save-data' ? <UninstallSaveAfterSteps /> : null}
          {slug === 'black-screen' ? <BlackScreenAfterSteps /> : null}
          {slug === 'gpu-driver-update' ? <GpuDriverAfterSteps /> : null}
          {slug === 'bsod-while-gaming' ? <BsodAfterSteps /> : null}
          {slug === 'steam-cloud-sync-error' ? <SteamCloudAfterSteps /> : null}
          {slug === 'pc-game-crash' ? <CrashAfterSteps /> : null}
          {slug === 'directx-error' ? <DirectxAfterSteps /> : null}
          {slug === 'steam-game-not-launching' ? (
            <SteamLaunchAfterSteps />
          ) : null}
          {slug === 'no-game-audio' ? <AudioAfterSteps /> : null}
          {slug === 'vram-shortage' ? <VramAfterSteps /> : null}
          {slug === 'low-fps' ? <LowFpsAfterSteps /> : null}
          {slug === 'low-gpu-usage' ? <LowGpuUsageAfterSteps /> : null}
          {slug === 'steam-input-controller' ? <SteamInputAfterSteps /> : null}
          {slug === 'controller-double-input' ? <ControllerDoubleAfterSteps /> : null}
          {slug === 'steam-disk-write-error' ? <SteamDiskWriteAfterSteps /> : null}
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
              {slug === 'controller-double-input'
                ? '実機やドライバーを名前だけで推測して削除・無効化しないでください。HidHideなどの表示制御があるとWindowsの一覧に実機が出ない場合もあります。Steam Inputと外部ツールは一条件ずつ変え、無反応になったら変更前の状態へ戻してください。'
                : slug === 'steam-input-controller'
                ? 'Steamが機器を認識しない時点でゲーム別Steam Inputを切り替えても、接続の不具合は解決しません。ゲーム側を比較する場合は、変更前の設定を控え、ゲームを終了してから一項目ずつ変えてください。変換ツールを複数同時に動かすと入力が重複する場合があります。'
                : slug === 'low-gpu-usage'
                ? '使用率の数字だけでGPUやCPUの故障を判断しないでください。FPS上限と実際の使用GPU名を先に確認し、比較中は一項目だけ変更します。画面切り替えで負荷が下がる場合があるため、プレイ中の同じ場面で記録したFPSも合わせて判断してください。'
                : slug === 'steam-disk-write-error'
                ? 'Steamやゲームのフォルダーを容量確保のために手動削除しないでください。隔離されたファイルを出所の確認前に復元したり、セキュリティ機能を無効にしたりしないでください。ドライブの異音や認識切れがある場合は修復の反復を止め、重要データの保全とメーカーへの相談を優先します。'
                : slug === 'low-fps'
                ? '計測中はFPS上限、V-Sync、フレーム生成、解像度を同時に変えず、ゲーム中の同じ場面で比較してください。タスクマネージャーへ画面を切り替えると負荷が変わるため、GPU・CPU使用率は傾向として読みます。平均CPU使用率やGPU使用率だけで故障を断定しないでください。'
                : slug === 'vram-shortage'
                ? '「共有GPUメモリ」の容量をグラフィックボードの専用VRAM容量に加算しないでください。ゲーム内の推定値とWindowsの実使用量を同じ数字として比較せず、GPU名・場面・設定をそろえて記録します。高解像度DLC・MOD以外のゲームファイルは削除しないでください。'
                : slug === 'no-game-audio'
                ? '出力先や音量は1項目ずつ変更して同じ場面で比較してください。別アプリまで無音なら、そのゲームのファイルを削除・再インストールする前にWindowsと出力機器を確認します。音声ドライバーやオーディオ拡張は変更前の状態を控え、結果が変わらなければ戻してください。'
                : slug === 'steam-game-not-launching'
                ? 'セーブ中・更新中・クラウド同期中にSteamを強制終了しないでください。MODを使うゲームでは変更前にセーブをコピーし、MODが必要な既存データを上書きしないでください。隔離された実行ファイルを確認せずに許可したり、セキュリティ機能を無効にしたりしないでください。'
                : slug === 'verify-steam-files'
                ? '更新・検証・クラウド同期中にSteamを強制終了しないでください。MODの上書き分やセーブは事前に記録・保全し、検証後の再取得数だけで故障と決めないでください。隔離ファイルを確認せず許可したり、ゲームフォルダーを一括削除したりしないでください。'
                : slug === 'directx-error'
                ? '不明な配布サイトのDLLをSystem32やゲームフォルダーにコピーしないでください。WindowsのDirectXバージョンとGPUの機能レベルは別の情報です。機能レベルが不足するGPUを旧ランタイムやWindows Updateだけで対応させることはできません。'
                : slug === 'pc-game-crash'
                ? 'MODのあるセーブは退避せずに上書きしないでください。障害モジュール名だけを根拠にDLLを入れ替えたり、不明なダウンロード先からファイルを入手したりしないでください。変更は1項目ずつ、セーブと設定を保全してから試します。'
                : slug === 'steam-cloud-sync-error'
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
                                    : slug === 'remove-mods-safely'
                                      ? 'ゲーム・セーブ・MODの共有フォルダーを丸ごと削除しないでください。オンラインゲームでは運営のMOD利用方針を確認し、起動制限の回避に使わないでください。'
                                    : slug === 'visual-c-runtime-error'
                                      ? 'DLL単体の配布サイトからファイルを入手したり、System32・SysWOW64・ゲームフォルダーへ推測でコピーしたりしないでください。別のゲームが使うVisual C++の旧版やx86版を一括削除しないでください。'
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
          <ArticleDiagnosisEntry path={`/guide/${slug}`} />
          <section className="related-section" id="related-guides">
            <h2>まだ直りませんか？ 次に試す記事</h2>
            <div>
              {item.related.map((s) => {
                const r = commonGuideBySlug(s);
                return r ? (
                  <a data-related="true" href={`/guide/${s}`} key={s}>
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
                  data-related="true"
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
              {['steam-game-not-launching', 'steam-input-controller'].includes(slug)
                ? '本文の「期待結果」は、設定を変えた後に読者が判断する目安です。編集部が実機で改善を確認した結果ではありません。変化がなければ元の設定へ戻し、症状に合う次の確認先へ進んでください。'
                : null}
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
