import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LocalizedPcArticle } from '@/components/localized-pc-article';
import { isLocale } from '@/lib/i18n';
import {
  languageAlternates,
  localizedPcArticle,
  localizedPcArticles,
  ogLocale,
} from '@/lib/localized/index';
import { ogImageFor } from '@/lib/og-images';

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return localizedPcArticles.map(({ locale, slug }) => ({ locale, slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const article = localizedPcArticle(locale, slug);
  if (!article) return {};
  const path = `/${locale}/pc/${slug}`;
  return {
    title: { absolute: `${article.seoTitle} | Gemnao` },
    description: article.description,
    alternates: {
      canonical: path,
      languages: languageAlternates(`/pc/${slug}`),
    },
    openGraph: {
      type: 'article',
      locale: ogLocale[locale],
      title: article.seoTitle,
      description: article.description,
      url: path,
      modifiedTime: article.checkedAt,
      images: [ogImageFor(path)],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.seoTitle,
      description: article.description,
      images: [ogImageFor(path)],
    },
  };
}

export default async function Page({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const article = localizedPcArticle(locale, slug);
  if (!article) notFound();
  return <LocalizedPcArticle article={article} />;
}
