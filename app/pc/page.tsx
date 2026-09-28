import type { Metadata } from 'next';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { ArrowRight } from 'lucide-react';
import { WikiFooter, WikiHeader } from '@/components/wiki-header';
import { pcArticles } from '@/lib/pc-articles';
import { ogImageFor } from '@/lib/og-images';

export const metadata: Metadata = {
  title: 'PC・Windowsの不具合｜発生条件から探す解決ガイド',
  description:
    'Windows 11のサインイン後の黒い画面、Wi-Fi消失、更新エラー、スリープからの勝手な復帰、マイクや音声などの不具合を症状別に切り分け。結果別の対処を掲載。',
  alternates: { canonical: '/pc' },
  openGraph: {
    title: 'PC・Windowsの不具合｜発生条件から探す解決ガイド',
    url: '/pc',
    images: [ogImageFor('/pc')],
  },
  twitter: { card: 'summary_large_image', images: [ogImageFor('/pc')] },
};

export default function PcHub() {
  return (
    <main>
      <WikiHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'PC・Windowsの不具合',
            url: 'https://gemnao.pages.dev/pc',
            inLanguage: 'ja-JP',
          }),
        }}
      />
      <article className="static-page">
        <nav className="breadcrumbs" aria-label="パンくず">
          <a href="/">ゲムなお</a>
          <span>›</span>
          <b>PC・Windowsの不具合</b>
        </nav>
        <p className="page-kicker">PC &amp; WINDOWS TROUBLESHOOTING</p>
        <h1>PC・Windowsの不具合</h1>
        <p className="page-lead">
          「更新後だけ」「通話を始めたら」「接続済みなのに」など、発生条件から探してください。Windows
          11の実際の設定画面へ進み、結果を比べながら対処できます。
        </p>
        <div className="guide-index-grid">
          {pcArticles.map((article) => (
            <a href={`/pc/${article.slug}`} key={article.slug}>
              <strong>{article.shortTitle}</strong>
              <span>{article.lead}</span>
              <small>
                確認手順を見る <ArrowRight size={14} />
              </small>
            </a>
          ))}
        </div>
        <p className="correction-link">
          ゲームの起動・FPS・セーブの問題は
          <a href="/guide">PCゲーム共通ガイド</a>
          、Discordの音声・接続・共有の問題は
          <a href="/discord">Discordトラブル一覧</a>から探せます。
        </p>
        <p className="source-policy">
          掲載手順はMicrosoftの公式サポートを確認して編集しています。機器・Windowsの更新状況により項目名が異なることがあります。実機で全ての組合せを試した結果を示すものではありません。
        </p>
      </article>
      <WikiFooter />
    </main>
  );
}
