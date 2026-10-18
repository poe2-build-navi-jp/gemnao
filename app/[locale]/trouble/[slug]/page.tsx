/* oxlint-disable next/no-html-link-for-pages -- Native links avoid the existing vinext client-link runtime issue. */
import { notFound } from 'next/navigation';
import { WikiHeader, WikiFooter } from '@/components/wiki-header';
import {
  troubleHubsEn,
  troubleHubEnBySlug,
} from '@/lib/localized/trouble-hubs-en';
import { articleMatchesTrouble } from '@/lib/trouble-hubs';
import { gameArticles } from '@/lib/game-articles';
import { localizedArticle } from '@/lib/localized/index';
import { guideGroupsEn } from '@/lib/localized/guide-index-en';
import { gameFacts } from '@/lib/localized/game-facts';
import { englishEditorialMetadata } from '@/lib/localized/editorial-metadata';
type Props = { params: Promise<{ locale: string; slug: string }> };
export const generateStaticParams = () =>
  troubleHubsEn.map((h) => ({ locale: 'en', slug: h.slug }));
export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const h = locale === 'en' ? troubleHubEnBySlug(slug) : undefined;
  return h
    ? englishEditorialMetadata(`/trouble/${slug}`, {
        ...h,
        checkedAt: h.updated,
      })
    : {};
}
export default async function Page({ params }: Props) {
  const { locale, slug } = await params;
  const h = locale === 'en' ? troubleHubEnBySlug(slug) : undefined;
  if (!h) notFound();
  const articles = gameArticles
    .filter(
      (a) =>
        !['draft', 'thin'].includes(a.status || 'verified') &&
        articleMatchesTrouble(a, slug),
    )
    .map((a) => localizedArticle('en', a.gameSlug, a.slug))
    .filter((a) => !!a);
  const guides = h.guideSlugs
    .map((s) =>
      guideGroupsEn
        .flatMap((g) => g.guides)
        .find((g) => g.path === `/guide/${s}`),
    )
    .filter((g) => !!g);
  const path = `/trouble/${slug}`;
  return (
    <main lang="en">
      <WikiHeader locale="en" pagePath={path} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'CollectionPage',
              name: h.title,
              description: h.description,
              url: `https://gemnao.pages.dev/en${path}`,
              inLanguage: 'en',
            },
            {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Gemnao',
                  item: 'https://gemnao.pages.dev/en',
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: h.label,
                  item: `https://gemnao.pages.dev/en${path}`,
                },
              ],
            },
          ]),
        }}
      />
      <header className="article-hero trouble-hero">
        <div className="article-hero-inner">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <a href="/en">Home</a>
            <span>›</span>
            <b>{h.label}</b>
          </nav>
          <p className="article-label">FIND PC GAME HELP BY SYMPTOM</p>
          <h1>{h.title}</h1>
          <p className="article-lead">{h.description}</p>
        </div>
      </header>
      <article className="content trouble-hub-page">
        <section className="answer-summary">
          <p className="evidence-label">FIRST CHECK</p>
          <h2>Start with these checks</h2>
          <ol>
            {h.quickChecks.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ol>
          <p>
            Try one change at a time and undo it if it does not help. Follow the
            game’s specific official instructions where they differ.
          </p>
        </section>
        <section className="trouble-hub-section">
          <h2>General PC game guides</h2>
          <p>
            <a href="/en/guide">Browse all general troubleshooting guides →</a>
          </p>
          <div className="guide-index-grid">
            {guides.map((g) => (
              <a href={`/en${g.path}`} key={g.path}>
                <strong>{g.shortTitle}</strong>
                <span>{g.description}</span>
                <small>Read the steps →</small>
              </a>
            ))}
          </div>
        </section>
        <section className="trouble-hub-section">
          <h2>Game-specific checks</h2>
          {articles.length ? (
            <div className="trouble-article-grid">
              {articles.map((a) => (
                <a
                  key={`${a.gameSlug}/${a.slug}`}
                  href={`/en/games/${a.gameSlug}/${a.slug}`}
                >
                  <span>
                    {a.gameName ||
                      gameFacts[a.gameSlug]?.names.en ||
                      a.gameSlug}
                  </span>
                  <strong>{a.shortTitle}</strong>
                  <p>{a.lead}</p>
                  <b>Read the game-specific steps →</b>
                </a>
              ))}
            </div>
          ) : (
            <p>
              No reviewed game-specific article is available yet. Use the
              general guides above.
            </p>
          )}
        </section>
        <section className="trouble-hub-section">
          <h2>Related symptoms</h2>
          <div className="trouble-related-links">
            {h.relatedSlugs.map((s) => (
              <a key={s} href={`/en/trouble/${s}`}>
                {troubleHubEnBySlug(s)!.label} →
              </a>
            ))}
            <a href="/en/discord">Discord troubleshooting →</a>
          </div>
        </section>
      </article>
      <WikiFooter locale="en" />
    </main>
  );
}
