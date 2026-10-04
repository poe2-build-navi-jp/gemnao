import type { Metadata } from 'next';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { ArrowRight } from 'lucide-react';
import { WikiFooter, WikiHeader } from '@/components/wiki-header';
import { weeklyReports } from '@/lib/weekly-reports';

const title = '今週のPCゲーム不具合まとめ｜公式のパッチ・障害・エラー情報';
const description =
  '毎週、PCゲームの公式パッチ・障害・メンテナンス・エラーコードの情報を1ページにまとめています。新作の発売直後に起きた不具合と、公式の修正状況を確認できます。';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/weekly' },
  openGraph: { title, description, url: '/weekly', locale: 'ja_JP', images: ['/og-default.png'] },
};

export default function Page() {
  return (
    <main>
      <WikiHeader pagePath="/weekly" />
      <header className="article-hero issue-hero">
        <div className="article-hero-inner">
          <nav className="breadcrumbs" aria-label="パンくず">
            <a href="/">ゲムなお</a>
            <span>›</span>
            <b>今週の不具合まとめ</b>
          </nav>
          <p className="article-label">週刊・PCゲーム不具合まとめ</p>
          <h1>今週のPCゲーム不具合まとめ</h1>
          <p className="article-lead">{description}</p>
        </div>
      </header>
      <div className="article-layout issue-layout">
        <article className="guide-article">
          <section className="related-section">
            <h2>これまでの号</h2>
            <div>
              {weeklyReports.map((report) => (
                <a href={`/weekly/${report.slug}`} key={report.slug}>
                  <span>{report.period}</span>
                  {report.title}
                  <ArrowRight size={15} />
                </a>
              ))}
            </div>
          </section>
          <p className="source-policy">
            毎週月曜日ごろに、前の週（月曜〜日曜）の情報をまとめて公開します。
          </p>
        </article>
      </div>
      <WikiFooter />
    </main>
  );
}
