import type { Metadata } from 'next';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { ArrowRight } from 'lucide-react';
import { WikiFooter, WikiHeader } from '@/components/wiki-header';
import { groupedCommonGuides } from '@/lib/common-guide-categories';
import { commonGuides } from '@/lib/common-guides';
export const metadata: Metadata = {
  title: 'PCゲーム共通トラブル解決ガイド',
  description:
    '起動しない、クラッシュ、FPS低下、コントローラー、MOD、セーブの問題を症状別に解決。',
  alternates: { canonical: '/guide' },
};
export default function Guide() {
  const groups = groupedCommonGuides(commonGuides);
  return (
    <main>
      <WikiHeader />
      <article className="static-page">
        <p className="page-kicker">PC GAME FIX GUIDE</p>
        <h1>PCゲーム共通トラブル解決ガイド</h1>
        <p className="page-lead">
          ゲーム名に関係なく使える確認手順を、1つの検索意図につき1ページでまとめました。
        </p>
        <nav className="symptom-nav" aria-label="共通ガイドのカテゴリ">
          <strong>何に困っていますか？</strong>
          <div>
            {groups.map((group) => (
              <a href={`#${group.id}`} key={group.id}>
                {group.label}
              </a>
            ))}
          </div>
        </nav>
        {groups.map((group) => (
          <section className="guide-category" id={group.id} key={group.id}>
            <h2>{group.heading}</h2>
            <p>{group.description}</p>
            <div className="guide-index-grid">
              {group.guides.map((item) => (
                <a href={`/guide/${item.slug}`} key={item.slug}>
                  <strong>{item.shortTitle}</strong>
                  <span>{item.description}</span>
                  <small>
                    {group.label}・手順を見る <ArrowRight size={14} />
                  </small>
                </a>
              ))}
            </div>
          </section>
        ))}
        <p className="correction-link">
          Discordの起動・音声・画面共有のトラブルは{' '}
          <a href="/discord">Discordの不具合・トラブル解決</a> で確認できます。
        </p>
      </article>
      <WikiFooter />
    </main>
  );
}
