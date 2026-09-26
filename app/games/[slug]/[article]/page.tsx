import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TroubleshootingArticle } from '@/components/troubleshooting-article';
import { articleBySlug, gameArticles } from '@/lib/game-articles';
import { gameBySlug } from '@/lib/games';
import { ogImageFor } from '@/lib/og-images';

export function generateStaticParams() {
  return gameArticles.map((article) => ({
    slug: article.gameSlug,
    article: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; article: string }>;
}): Promise<Metadata> {
  const { slug, article: articleSlug } = await params;
  const article = articleBySlug(slug, articleSlug);
  if (!article) return {};
  const canonical = `/games/${slug}/${articleSlug}`;
  return {
    title: article.seoTitle,
    description: article.metaDescription,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      title: article.seoTitle,
      description: article.metaDescription,
      url: canonical,
      locale: 'ja_JP',
      modifiedTime: article.checkedAt,
      images: [ogImageFor(canonical)],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.seoTitle,
      description: article.metaDescription,
      images: [ogImageFor(canonical)],
    },
  };
}

export default async function GameIssuePage({
  params,
}: {
  params: Promise<{ slug: string; article: string }>;
}) {
  const { slug, article: articleSlug } = await params;
  const game = gameBySlug(slug);
  const article = articleBySlug(slug, articleSlug);
  if (!game || !article) notFound();
  return <TroubleshootingArticle game={game} article={article} />;
}
