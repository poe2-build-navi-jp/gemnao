import { notFound } from 'next/navigation';
import { EnglishGuideIndex } from '@/components/english-guide-index';
import { guideIndexEn } from '@/lib/localized/guide-index-en';
import { englishEditorialMetadata } from '@/lib/localized/editorial-metadata';
type Props = { params: Promise<{ locale: string }> };
export const generateStaticParams = () => [{ locale: 'en' }];
export async function generateMetadata({ params }: Props) {
  if ((await params).locale !== 'en') return {};
  const metadata = englishEditorialMetadata('/guide', guideIndexEn);
  return { ...metadata, openGraph: { ...metadata.openGraph, type: 'website' } };
}
export default async function Page({ params }: Props) {
  if ((await params).locale !== 'en') notFound();
  return <EnglishGuideIndex />;
}
