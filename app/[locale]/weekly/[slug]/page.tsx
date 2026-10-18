import { languageAlternates } from '@/lib/localized';
import { ArticleToc } from '@/components/article-toc';
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
  weeklyKindLabelsEn as weeklyKindLabels,
  weeklyReportsEn as weeklyReports,
} from '@/lib/localized/weekly-reports-en';

const weeklyReportBySlug = (slug: string) =>
  weeklyReports.find((r) => r.slug === slug);
const SITE = 'https://gemnao.pages.dev';

export function generateStaticParams() {
  return weeklyReports.map(({ slug }) => ({ locale: 'en', slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (locale !== 'en') notFound();
  const report = weeklyReportBySlug(slug);
  if (!report) return {};
  const path = `/en/weekly/${slug}`;
  return {
    title: { absolute: `${report.title} | Gemnao` },
    description: report.description,
    alternates: {
      canonical: path,
      languages: languageAlternates(`/weekly/${slug}`),
    },
    openGraph: {
      type: 'article',
      title: report.title,
      description: report.description,
      url: path,
      locale: 'en_US',
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
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (locale !== 'en') notFound();
  const report = weeklyReportBySlug(slug);
  if (!report) notFound();
  const path = `/en/weekly/${slug}`;
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
      author: { '@type': 'Organization', name: 'Gemnao editorial team' },
      inLanguage: 'en',
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
          name: 'Home',
          item: `${SITE}/en`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'PC Gaming Weekly',
          item: `${SITE}/en/weekly`,
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
    <main lang="en">
      <WikiHeader locale="en" pagePath={`/weekly/${slug}`} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <header className="article-hero issue-hero">
        <div className="article-hero-inner">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <a href="/en">Home</a>
            <span>›</span>
            <a href="/en/weekly">PC Gaming Weekly</a>
            <span>›</span>
            <b>{report.shortTitle}</b>
          </nav>
          <p className="article-label">PC Gaming Weekly</p>
          <h1>{report.title}</h1>
          <p className="article-lead">{report.lead}</p>
          <div className="article-meta">
            <span>
              <CalendarDays size={15} /> Reporting period: {report.period}
            </span>
            <span>Published: {report.publishedAt.replaceAll('-', '.')}</span>
            <span>Official announcements only</span>
          </div>
        </div>
      </header>
      <div className="article-layout issue-layout">
        <ArticleToc title={'Contents'} className="issue-toc">
          <a href="#highlights">Week in review</a>
          {games.map((game, gameIndex) => (
            <a href={`#game-${gameIndex + 1}`} key={game}>
              {game}
            </a>
          ))}
          <a href="#upcoming">Schedule announced at publication</a>
        </ArticleToc>
        <article className="guide-article">
          <section
            className="answer-summary"
            id="highlights"
            aria-labelledby="highlights-title"
          >
            <p className="evidence-label">{report.period}</p>
            <h2 id="highlights-title">
              <CheckCircle2 size={23} />
              Week in review
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
            <h2>Schedule announced at publication</h2>
            <table>
              <thead>
                <tr>
                  <th scope="col">Date (JST)</th>
                  <th scope="col">Game</th>
                  <th scope="col">Schedule</th>
                </tr>
              </thead>
              <tbody>
                {report.upcoming.map((row) => (
                  <tr key={`${row.date}-${row.game}`}>
                    <td data-label="Date">{row.date}</td>
                    <td data-label="Game">
                      {row.href ? <a href={row.href}>{row.game}</a> : row.game}
                    </td>
                    <td data-label="Schedule">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p>
              For current outages and maintenance, see
              <a href="/en/status">Service status</a>. Schedules can change.
            </p>
          </section>
          <nav className="article-parent-links" aria-label="Other editions">
            {newer ? (
              <a href={`/en/weekly/${newer.slug}`}>
                Newer edition ({newer.shortTitle})
              </a>
            ) : null}
            {older ? (
              <a href={`/en/weekly/${older.slug}`}>
                Older edition ({older.shortTitle})
              </a>
            ) : null}
            <a href="/en/weekly">All editions</a>
          </nav>
          <ShareButtons
            title={report.title}
            path={path}
            hashtag="PCGaming"
            locale="en"
          />
          <p className="correction-link">
            Found an error in this article?{' '}
            <a href={`/en/contact?url=${encodeURIComponent(canonical)}`}>
              Report a correction
            </a>
          </p>
          <section className="sources" id="references">
            <h2>Sources and archive policy</h2>
            <p className="source-policy">
              This translation preserves the original edition’s official source
              links and reporting dates. Open each item’s source for the
              original announcement. This archive does not establish current
              outage status or freshly verify historical notices.
            </p>
          </section>
        </article>
      </div>
      <WikiFooter locale="en" />
    </main>
  );
}
