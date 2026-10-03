import { ogImageFor } from '@/lib/og-images';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LocalizedArticle } from '@/components/localized-article';
import { gameBySlug } from '@/lib/games';
import { isLocale } from '@/lib/i18n';
import {
  languageAlternates,
  localizedArticle,
  localizedArticles,
  ogLocale,
} from '@/lib/localized/index';

export function generateStaticParams() {
  return localizedArticles.map((article) => ({
    locale: article.locale,
    slug: article.gameSlug,
    article: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string; article: string }>;
}): Promise<Metadata> {
  const { locale, slug, article: articleSlug } = await params;
  if (!isLocale(locale)) return {};
  const article = localizedArticle(locale, slug, articleSlug);
  if (!article) return {};
  const path = `/${locale}/games/${slug}/${articleSlug}`;
  return {
    title: { absolute: `${article.title} | Gemnao` },
    description: article.description,
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.description,
      locale: ogLocale[locale],
      images: [ogImageFor(path)],
      url: path,
      modifiedTime: article.checkedAt,
    },
    twitter: {
      card: 'summary_large_image',
      images: [ogImageFor(path)],
      title: article.title,
      description: article.description,
    },
    alternates: {
      canonical: path,
      languages: languageAlternates(`/games/${slug}/${articleSlug}`),
    },
  };
}

export default async function LocaleArticle({
  params,
}: {
  params: Promise<{ locale: string; slug: string; article: string }>;
}) {
  const { locale, slug, article: articleSlug } = await params;
  const game = gameBySlug(slug);
  if (!isLocale(locale) || !game) notFound();
  const article = localizedArticle(locale, slug, articleSlug);
  if (!article) notFound();
  return <LocalizedArticle game={game} article={article} />;
}
