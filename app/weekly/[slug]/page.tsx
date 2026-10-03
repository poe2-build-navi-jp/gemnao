import type { Metadata } from 'next';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { notFound } from 'next/navigation';
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { WikiFooter, WikiHeader } from '@/components/wiki-header';
import { ShareButtons } from '@/components/share-buttons';
import { ogImageFor } from '@/lib/og-images';
import {
  weeklyKindLabels,
  weeklyReportBySlug,
  weeklyReports,
} from '@/lib/weekly-reports';

const SITE = 'https://gemnao.pages.dev';

export function generateStaticParams() {
  return weeklyReports.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const report = weeklyReportBySlug(slug);
  if (!report) return {};
  const path = `/weekly/${slug}`;
  return {
    title: report.title,
    description: report.description,
    alternates: { canonical: path },
    openGraph: {
      type: 'article',
      title: report.title,
      description: report.description,
      url: path,
      locale: 'ja_JP',
      publishedTime: report.publishedAt,
      images: [ogImageFor(path)],
    },
    twitter: {
      card: 'summary_large_image',
      title: report.title,
      description: report.description,
      images: [ogImageFor(path)],
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const report = weeklyReportBySlug(slug);
  if (!report) notFound();
  const path = `/weekly/${slug}`;
  const canonical = `${SITE}${path}`;
  const games = [...new Set(report.items.map((item) => item.game))];
  const index = weeklyReports.findIndex((other) => other.slug === slug);
  const newer = weeklyReports[index - 1];
  const older = weeklyReports[index + 1];
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: report.title,
      description: report.description,
      datePublished: report.publishedAt,
      dateModified: report.publishedAt,
      author: { '@type': 'Organization', name: 'ゲムなお編集部' },
      inLanguage: 'ja-JP',
      mainEntityOfPage: canonical,
      image: `${SITE}${ogImageFor(path)}`,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'ゲムなお',
          item: `${SITE}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: '今週のPCゲーム不具合まとめ',
          item: `${SITE}/weekly`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: report.shortTitle,
          item: canonical,
        },
      ],
    },
  ];
  return (
    <main>
      <WikiHeader pagePath={path} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <header className="article-hero issue-hero">
        <div className="article-hero-inner">
          <nav className="breadcrumbs" aria-label="パンくず">
            <a href="/">ゲムなお</a>
            <span>›</span>
            <a href="/weekly">今週の不具合まとめ</a>
            <span>›</span>
            <b>{report.shortTitle}</b>
          </nav>
          <p className="article-label">週刊・PCゲーム不具合まとめ</p>
          <h1>{report.title}</h1>
          <p className="article-lead">{report.lead}</p>
          <div className="article-meta">
            <span>
              <CalendarDays size={15} /> 対象期間：{report.period}
            </span>
            <span>公開：{report.publishedAt.replaceAll('-', '.')}</span>
            <span>公式のお知らせだけを掲載</span>
          </div>
        </div>
      </header>
      <div className="article-layout issue-layout">
        <aside className="toc issue-toc">
          <strong>このページの内容</strong>
          <a href="#highlights">今週の要点</a>
          {games.map((game, gameIndex) => (
            <a href={`#game-${gameIndex + 1}`} key={game}>
              {game}
            </a>
          ))}
          <a href="#upcoming">来週以降の予定</a>
        </aside>
        <article className="guide-article">
          <section
            className="answer-summary"
            id="highlights"
            aria-labelledby="highlights-title"
          >
            <p className="evidence-label">{report.period}</p>
            <h2 id="highlights-title">
              <CheckCircle2 size={23} />
              今週の要点
            </h2>
            <ul>
              {report.highlights.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </section>
          {games.map((game, gameIndex) => (
            <section
              className="weekly-game"
              id={`game-${gameIndex + 1}`}
              key={game}
            >
              <h2>{game}</h2>
              <ol className="weekly-items">
                {report.items
                  .filter((item) => item.game === game)
                  .map((item) => (
                    <li key={`${item.date}-${item.title}`}>
                      <div className="weekly-item-meta">
                        <time>{item.date}</time>
                        <span
                          className={`weekly-kind weekly-kind-${item.kind}`}
                        >
                          {weeklyKindLabels[item.kind]}
                        </span>
                      </div>
                      <h3>{item.title}</h3>
                      <p>{item.summary}</p>
                      <div className="weekly-item-links">
                        {item.article ? (
                          <a href={item.article.href}>
                            {item.article.label} <ArrowRight size={14} />
                          </a>
                        ) : null}
                        <a
                          href={item.source.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {item.source.label} <ExternalLink size={14} />
                        </a>
                      </div>
                    </li>
                  ))}
              </ol>
            </section>
          ))}
          <section className="diagnosis-table" id="upcoming">
            <h2>来週以降の予定</h2>
            <table>
              <thead>
                <tr>
                  <th scope="col">日付（日本時間）</th>
                  <th scope="col">ゲーム</th>
                  <th scope="col">予定</th>
                </tr>
              </thead>
              <tbody>
                {report.upcoming.map((row) => (
                  <tr key={`${row.date}-${row.game}`}>
                    <td data-label="日付">{row.date}</td>
                    <td data-label="ゲーム">
                      {row.href ? <a href={row.href}>{row.game}</a> : row.game}
                    </td>
                    <td data-label="予定">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p>
              障害やメンテナンスの最新情報は
              <a href="/status">障害・メンテ情報</a>
              でも確認できます。予定は変更されることがあります。
            </p>
          </section>
          <nav className="article-parent-links" aria-label="ほかの号">
            {newer ? (
              <a href={`/weekly/${newer.slug}`}>次の号（{newer.shortTitle}）</a>
            ) : null}
            {older ? (
              <a href={`/weekly/${older.slug}`}>前の号（{older.shortTitle}）</a>
            ) : null}
            <a href="/weekly">これまでの号</a>
          </nav>
          <ShareButtons title={report.title} path={path} hashtag="PCゲーム" />
          <p className="correction-link">
            この記事の情報に問題がありますか？{' '}
            <a href={`/contact?url=${encodeURIComponent(canonical)}`}>
              誤りを報告する
            </a>
          </p>
          <section className="sources" id="references">
            <h2>掲載の方針</h2>
            <p className="source-policy">
              各ゲームの公式のお知らせ（Steamニュースなど）で確認した内容だけを、日本時間の日付でまとめています。各項目の「Steamニュース（公式）」から原文を開けます。
            </p>
          </section>
        </article>
      </div>
      <WikiFooter />
    </main>
  );
}
