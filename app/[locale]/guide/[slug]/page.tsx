import { translatedCommonGuides } from '@/lib/localized/save-guides-zh-es';
import { commonGuidesEn } from '@/lib/localized/common-guides-en';
import { EnglishCommonGuide } from '@/components/english-common-guide';
import { notFound } from 'next/navigation';
import { EnglishCrashGuide } from '@/components/english-crash-guide';
import { crashGuideEn } from '@/lib/localized/crash-guide-en';
import { englishEditorialMetadata } from '@/lib/localized/editorial-metadata';

type Props = { params: Promise<{ locale: string; slug: string }> };
export const generateStaticParams = () => [
  ...translatedCommonGuides.map(({ locale, slug }) => ({ locale, slug })),
  { locale: 'en', slug: 'pc-game-crash' },
  ...commonGuidesEn.map(({ slug }) => ({ locale: 'en', slug })),
];
export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const translated = translatedCommonGuides.find(
    (g) => g.locale === locale && g.slug === slug,
  );
  if (translated)
    return englishEditorialMetadata(
      translated.path,
      translated,
      translated.locale,
    );
  const guide =
    slug === 'pc-game-crash'
      ? crashGuideEn
      : commonGuidesEn.find((guide) => guide.slug === slug);
  return locale === 'en' && guide
    ? englishEditorialMetadata(guide.path, guide)
    : {};
}
export default async function Page({ params }: Props) {
  const { locale, slug } = await params;
  const translated = translatedCommonGuides.find(
    (g) => g.locale === locale && g.slug === slug,
  );
  if (translated?.crashSections)
    return (
      <EnglishCrashGuide
        guide={translated}
        sections={translated.crashSections}
        locale={translated.locale}
      />
    );
  if (translated)
    return <EnglishCommonGuide guide={translated} locale={translated.locale} />;
  if (locale !== 'en') notFound();
  if (slug === 'pc-game-crash') return <EnglishCrashGuide />;
  const guide = commonGuidesEn.find((guide) => guide.slug === slug);
  if (!guide) notFound();
  return <EnglishCommonGuide guide={guide} />;
}
