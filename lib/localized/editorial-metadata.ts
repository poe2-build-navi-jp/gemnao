import type { Locale } from '@/lib/i18n';
import type { Metadata } from 'next';
import { languageAlternates, ogLocale } from '@/lib/localized/index';
import { ogImageFor } from '@/lib/og-images';

export function englishEditorialMetadata(
  path: string,
  article: { title: string; description: string; checkedAt: string },
  locale: Locale = 'en',
): Metadata {
  const englishPath = `/${locale}${path}`;
  const image = ogImageFor(englishPath);
  return {
    title: { absolute: `${article.title} | Gemnao` },
    description: article.description,
    alternates: { canonical: englishPath, languages: languageAlternates(path) },
    openGraph: {
      type: 'article',
      locale: ogLocale[locale],
      title: article.title,
      description: article.description,
      url: englishPath,
      modifiedTime: article.checkedAt,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
      images: [image],
    },
  };
}
