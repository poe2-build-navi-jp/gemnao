import type { Metadata } from 'next';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { notFound } from 'next/navigation';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { WikiFooter, WikiHeader } from '@/components/wiki-header';
import { SolutionIllustration } from '@/components/solution-illustration';
import { commonGuideCategoryFor } from '@/lib/common-guide-categories';
import { commonGuideBySlug } from '@/lib/common-guides';
import { gameArticles } from '@/lib/game-articles';
import { gameBySlug } from '@/lib/games';
import {
  articleMatchesTrouble,
  troubleHubBySlug,
  troubleHubs,
} from '@/lib/trouble-hubs';
import { troubleVisualBySlug } from '@/lib/visual-guides';

export function generateStaticParams() {
  return troubleHubs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const hub = troubleHubBySlug(slug);
  if (!hub) return {};
  const visual = troubleVisualBySlug(slug);
  const canonical = `/trouble/${hub.slug}`;
  return {
    title: hub.title,
    description: hub.description,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      title: `${hub.title}｜ゲムなお`,
      description: hub.description,
      url: canonical,
      locale: 'ja_JP',
      images: [visual?.ogImage || '/og-default.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${hub.title}｜ゲムなお`,
      description: hub.description,
      images: [visual?.ogImage || '/og-default.png'],
    },
  };
}

export default async function TroubleHubPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const hub = troubleHubBySlug(slug);
  if (!hub) notFound();
  const visual = troubleVisualBySlug(slug);
  const articles = gameArticles.filter(
    (article) =>
      !['draft', 'thin'].includes(article.status || 'verified') &&
      articleMatchesTrouble(article, hub.slug),
  );
  const guides = hub.guideSlugs
    .map((guideSlug) => commonGuideBySlug(guideSlug))
    .filter((guide): guide is NonNullable<typeof guide> => Boolean(guide));
  const primaryGuideCategory = guides[0]
    ? commonGuideCategoryFor(guides[0])
    : undefined;
  const related = hub.relatedSlugs
    .map((relatedSlug) => troubleHubBySlug(relatedSlug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const canonical = `https://gemnao.pages.dev/trouble/${hub.slug}`;
  const schema = [
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
          name: hub.label,
          item: canonical,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: hub.title,
      description: hub.description,
      url: canonical,
      inLanguage: 'ja-JP',
      ...(visual ? { image: `https://gemnao.pages.dev${visual.image}` } : {}),
    },
  ];
  return (
    <main>
      <WikiHeader pagePath={`/trouble/${hub.slug}`} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <header className="article-hero trouble-hero">
        <div className="article-hero-inner">
          <nav className="breadcrumbs" aria-label="パンくず">
            <a href="/">ゲムなお</a>
            <span>›</span>
            <b>{hub.label}</b>
          </nav>
          <p className="article-label">症状からPCゲームの対処法を探す</p>
          <h1>{hub.title}</h1>
          <p className="article-lead">{hub.description}</p>
        </div>
      </header>
      <article className="content trouble-hub-page">
        <section className="answer-summary">
          <p className="evidence-label">FIRST CHECK</p>
          <h2>
            <CheckCircle2 size={23} />
            まず試す共通対処
          </h2>
          <ol>
            {hub.quickChecks.map((check) => (
              <li key={check}>{check}</li>
            ))}
          </ol>
          <p>
            1項目ずつ試し、改善しなければ元へ戻してください。ゲーム固有の公式案内がある場合は、下の記事を優先します。
          </p>
        </section>

        {visual ? <SolutionIllustration visual={visual} /> : null}

        <section className="trouble-hub-section">
          <h2>PC共通の解決ガイド</h2>
          {primaryGuideCategory ? (
            <p>
              <a href={`/guide#${primaryGuideCategory.id}`}>
                {primaryGuideCategory.label}カテゴリから探す
                <ArrowRight size={14} />
              </a>
            </p>
          ) : null}
          <div className="guide-index-grid">
            {guides.map((guide) => (
              <a href={`/guide/${guide.slug}`} key={guide.slug}>
                <strong>{guide.shortTitle}</strong>
                <span>{guide.description}</span>
                <small>
                  手順を見る <ArrowRight size={14} />
                </small>
              </a>
            ))}
          </div>
        </section>

        <section className="trouble-hub-section">
          <h2>ゲーム別の{hub.label}記事</h2>
          {articles.length ? (
            <div className="trouble-article-grid">
              {articles.map((article) => {
                const game = gameBySlug(article.gameSlug);
                return (
                  <a
                    href={`/games/${article.gameSlug}/${article.slug}`}
                    key={`${article.gameSlug}-${article.slug}`}
                  >
                    <span>{game?.shortTitle}</span>
                    <strong>{article.shortTitle}</strong>
                    <p>{article.symptom}</p>
                    <b>
                      ゲーム固有の手順を見る <ArrowRight size={14} />
                    </b>
                  </a>
                );
              })}
            </div>
          ) : (
            <p>
              現在、確認済みのゲーム固有記事はありません。上の共通ガイドをご利用ください。
            </p>
          )}
        </section>

        <section className="trouble-hub-section">
          <h2>関連する症状</h2>
          <div className="trouble-related-links">
            {related.map((item) => (
              <a href={`/trouble/${item.slug}`} key={item.slug}>
                {item.label} <ArrowRight size={15} />
              </a>
            ))}
            <a href="/discord">
              Discordの不具合 <ArrowRight size={15} />
            </a>
          </div>
        </section>
      </article>
      <WikiFooter />
    </main>
  );
}
