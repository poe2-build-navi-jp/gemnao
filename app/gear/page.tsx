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
      <WikiHeader />
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
          気になるデバイスを、メーカー公式の仕様から整理しています。買う前に確認したい端子・対応OS・置き場所のサイズもまとめました。
        </p>
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
          このカテゴリの記事には広告（Amazonアソシエイトのリンク）を含みます。仕様はメーカー公式ページで確認して編集しており、価格は販売店や時期で変わるため記載していません。
        </p>
      </article>
      <WikiFooter />
    </main>
  );
}
