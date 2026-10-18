import { LocalizedGuideIndex } from '@/components/localized-guide-index';
import { guideUi } from '@/lib/localized/guide-ui';
import { notFound } from 'next/navigation';
import { EnglishGuideIndex } from '@/components/english-guide-index';
import { guideIndexEn } from '@/lib/localized/guide-index-en';
import { englishEditorialMetadata } from '@/lib/localized/editorial-metadata';
type Props = { params: Promise<{ locale: string }> };
export const generateStaticParams = () =>
  ['en', 'zh', 'es'].map((locale) => ({ locale }));
export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  if (locale === 'zh' || locale === 'es') {
    const t = guideUi[locale];
    const metadata = englishEditorialMetadata(
      '/guide',
      {
        title: t.indexTitle,
        description: t.indexDescription,
        checkedAt: '2026-10-18',
      },
      locale,
    );
    return {
      ...metadata,
      openGraph: { ...metadata.openGraph, type: 'website' },
    };
  }
  if (locale !== 'en') return {};
  const metadata = englishEditorialMetadata('/guide', guideIndexEn);
  return { ...metadata, openGraph: { ...metadata.openGraph, type: 'website' } };
}
export default async function Page({ params }: Props) {
  const { locale } = await params;
  if (locale === 'zh' || locale === 'es')
    return <LocalizedGuideIndex locale={locale} />;
  if (locale !== 'en') notFound();
  return <EnglishGuideIndex />;
}
