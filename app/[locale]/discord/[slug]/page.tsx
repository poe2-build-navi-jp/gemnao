import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LocalizedArticle } from '@/components/localized-article';
import { isLocale } from '@/lib/i18n';
import { ogImageFor } from '@/lib/og-images';
import {
  languageAlternates,
  localizedDiscordArticle,
  localizedDiscordArticles,
  ogLocale,
} from '@/lib/localized/index';

type Props = { params: Promise<{ locale: string; slug: string }> };
export function generateStaticParams() {
  return localizedDiscordArticles.map(({ locale, slug }) => ({ locale, slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const article = localizedDiscordArticle(locale, slug);
  if (!article) return {};
  const path = `/${locale}/discord/${slug}`;
  return {
    title: { absolute: `${article.title} | Gemnao` },
    description: article.description,
    alternates: {
      canonical: path,
      languages: languageAlternates(`/discord/${slug}`),
    },
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.description,
      locale: ogLocale[locale],
      url: path,
      modifiedTime: article.checkedAt,
      images: [ogImageFor(path)],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
      images: [ogImageFor(path)],
    },
  };
}
export default async function Page({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const article = localizedDiscordArticle(locale, slug);
  if (!article) notFound();
  return <LocalizedArticle section="discord" article={article} />;
}
