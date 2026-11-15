import { gearArticlesEn } from '@/lib/localized/gear-articles-en';
import { EnglishGearArticle } from '@/components/english-gear-article';
import { notFound } from 'next/navigation';
import { EnglishGearGuide } from '@/components/english-gear-guide';
import {
  gearGuideEnBySlug,
  gearGuidesEn,
} from '@/lib/localized/gear-guides-en';
import { englishEditorialMetadata } from '@/lib/localized/editorial-metadata';
import { PcUpgradeBuyerGuide } from '@/components/pc-upgrade-buyer-guide';
import {
  pcUpgradeGuideBySlug,
  pcUpgradeGuidesZhEs,
} from '@/lib/pc-upgrade-guides';
import { isLocale } from '@/lib/i18n';

type Props = { params: Promise<{ locale: string; slug: string }> };
export const generateStaticParams = () => [
  ...[...gearGuidesEn, ...gearArticlesEn].map((guide) => ({
    locale: 'en',
    slug: guide.slug,
  })),
  ...pcUpgradeGuidesZhEs.map(({ locale, guide }) => ({
    locale,
    slug: guide.slug,
  })),
];
export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const upgrade = isLocale(locale)
    ? pcUpgradeGuideBySlug(slug, locale)
    : undefined;
  if (upgrade && isLocale(locale))
    return englishEditorialMetadata(`/gear/${slug}`, upgrade, locale);
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
  const upgrade = isLocale(locale)
    ? pcUpgradeGuideBySlug(slug, locale)
    : undefined;
  if (upgrade && isLocale(locale))
    return <PcUpgradeBuyerGuide guide={upgrade} locale={locale} />;
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
