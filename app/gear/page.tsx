import type { Metadata } from 'next';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { ArrowRight } from 'lucide-react';
import { WikiFooter, WikiHeader } from '@/components/wiki-header';
import { gearArticles } from '@/lib/gear-articles';
import { gearGuides } from '@/lib/gear-guides';
import { ogImageFor } from '@/lib/og-images';

export const metadata: Metadata = {
  title: 'ゲーマー向けデバイス｜できること・買う前の確認点',
  description:
    'Discord用マイクや左手デバイスなどゲーマー向けデバイスを、メーカー公式の仕様から整理。できること、向いている人、買う前に確認したい端子・対応OS・サイズをまとめています。',
  alternates: { canonical: '/gear' },
  openGraph: {
    title: 'ゲーマー向けデバイス｜できること・買う前の確認点',
    url: '/gear',
    images: [ogImageFor('/gear')],
  },
  twitter: { card: 'summary_large_image', images: [ogImageFor('/gear')] },
};

export default function GearHub() {
  return (
    <main>
      <WikiHeader pagePath="/gear" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'ゲーマー向けデバイス',
            url: 'https://gemnao.pages.dev/gear',
            inLanguage: 'ja-JP',
          }),
        }}
      />
      <article className="static-page">
        <nav className="breadcrumbs" aria-label="パンくず">
          <a href="/">ゲムなお</a>
          <span>›</span>
          <b>ゲーマー向けデバイス</b>
        </nav>
        <p className="page-kicker">GAMING GEAR</p>
        <h1>ゲーマー向けデバイス</h1>
        <p className="page-lead">
          まず困りごとを切り分け、手持ちの機器で足りるか確認します。追加が必要な場合だけ、端子・対応OS・置き場所などの条件から選んでください。
        </p>
        <section className="caution-block" aria-labelledby="gear-start">
          <h2 id="gear-start">買う前に、いま困っていることから</h2>
          <ul>
            <li>
              声が小さい・届かない：
              <a href="/discord/mic-volume-low">無料の入力設定の確認</a>
              から。別マイクが必要かは
              <a href="/gear/discord-microphone-guide">マイクの選び方</a>
              で判断できます。
            </li>
            <li>
              セーブを別に残したい：
              <a href="/tools/save-locations">保存場所を確認</a>し、
              <a href="/gear/save-backup-storage-guide">
                手持ちの保存先と必要容量
              </a>
              を調べます。
            </li>
            <li>
              配信・編集の操作をまとめたい：よく使う操作を書き出し、いまのキーボードのショートカットで足りるか確認。そのうえで
              <a href="/gear/stream-deck-plus-xl">
                Stream Deck + XLの条件と小型モデルの違い
              </a>
              を比べます。
            </li>
            <li>
              ゲームが落ちる・重い：原因不明のままGPUやPCを買い替えず、
              <a href="/guide">症状別のトラブル対処</a>を先に確認してください。
            </li>
          </ul>
        </section>
        <h2>選び方と購入前の確認点</h2>
        <div className="guide-index-grid">
          {[...gearGuides, ...gearArticles].map((article) => (
            <a href={`/gear/${article.slug}`} key={article.slug}>
              <strong>{article.shortTitle}</strong>
              <span>{article.lead}</span>
              <small>
                選び方・確認点を見る <ArrowRight size={14} />
              </small>
            </a>
          ))}
        </div>
        <p className="source-policy">
          このカテゴリの一部の記事には広告（Amazonアソシエイトのリンク）を含みます。仕様はメーカー公式ページで確認して編集しており、価格は販売店や時期で変わるため記載していません。
        </p>
      </article>
      <WikiFooter />
    </main>
  );
}
