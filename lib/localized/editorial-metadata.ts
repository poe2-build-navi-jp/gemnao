import type { Metadata } from 'next';
import { languageAlternates } from '@/lib/localized/index';
import { ogImageFor } from '@/lib/og-images';

export function englishEditorialMetadata(
  path: string,
  article: { title: string; description: string; checkedAt: string },
): Metadata {
  const englishPath = `/en${path}`;
  const image = ogImageFor(englishPath);
  return {
    title: { absolute: `${article.title} | Gemnao` },
    description: article.description,
    alternates: { canonical: englishPath, languages: languageAlternates(path) },
    openGraph: {
      type: 'article',
      locale: 'en_US',
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
