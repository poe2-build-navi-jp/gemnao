import { gearArticlesEn } from '@/lib/localized/gear-articles-en';
import { EnglishGearArticle } from '@/components/english-gear-article';
import { notFound } from 'next/navigation';
import { EnglishGearGuide } from '@/components/english-gear-guide';
import {
  gearGuideEnBySlug,
  gearGuidesEn,
} from '@/lib/localized/gear-guides-en';
import { englishEditorialMetadata } from '@/lib/localized/editorial-metadata';

type Props = { params: Promise<{ locale: string; slug: string }> };
export const generateStaticParams = () =>
  [...gearGuidesEn, ...gearArticlesEn].map((guide) => ({
    locale: 'en',
    slug: guide.slug,
  }));
export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const guide =
    locale === 'en'
      ? gearGuideEnBySlug(slug) || gearArticlesEn.find((a) => a.slug === slug)
      : undefined;
  return guide
    ? englishEditorialMetadata(`/gear/${slug}`, {
        ...guide,
        title: guide.seoTitle,
      })
    : {};
}
export default async function Page({ params }: Props) {
  const { locale, slug } = await params;
  const guide =
    locale === 'en'
      ? gearGuideEnBySlug(slug) || gearArticlesEn.find((a) => a.slug === slug)
      : undefined;
  if (!guide) notFound();
  return 'product' in guide ? (
    <EnglishGearArticle article={guide} />
  ) : (
    <EnglishGearGuide guide={guide} />
  );
}
