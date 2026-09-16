import type { Metadata } from 'next';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { ArrowRight } from 'lucide-react';
import { WikiFooter, WikiHeader } from '@/components/wiki-header';
import { commonGuides } from '@/lib/common-guides';
export const metadata: Metadata = {
  title: 'PCゲーム共通トラブル解決ガイド',
  description:
    '起動しない、クラッシュ、FPS低下、コントローラー、MOD、セーブの問題を症状別に解決。',
  alternates: { canonical: '/guide' },
};
export default function Guide() {
  return (
    <main>
      <WikiHeader />
      <article className="static-page">
        <p className="page-kicker">PC GAME FIX GUIDE</p>
        <h1>PCゲーム共通トラブル解決ガイド</h1>
        <p className="page-lead">
          ゲーム名に関係なく使える確認手順を、1つの検索意図につき1ページでまとめました。
        </p>
        <div className="guide-index-grid">
          {commonGuides.map((item) => (
            <a href={`/guide/${item.slug}`} key={item.slug}>
              <strong>{item.shortTitle}</strong>
              <span>{item.description}</span>
              <small>
                手順を見る <ArrowRight size={14} />
              </small>
            </a>
          ))}
        </div>
        <p className="correction-link">
          Discordの起動・音声・画面共有のトラブルは{' '}
          <a href="/discord">Discordの不具合・トラブル解決</a>{' '}
          で確認できます。
        </p>
      </article>
      <WikiFooter />
    </main>
  );
}
