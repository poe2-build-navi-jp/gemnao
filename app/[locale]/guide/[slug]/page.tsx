import { notFound } from 'next/navigation';
import { EnglishCrashGuide } from '@/components/english-crash-guide';
import { crashGuideEn } from '@/lib/localized/crash-guide-en';
import { englishEditorialMetadata } from '@/lib/localized/editorial-metadata';

type Props = { params: Promise<{ locale: string; slug: string }> };
export const generateStaticParams = () => [
  { locale: 'en', slug: 'pc-game-crash' },
];
export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  return locale === 'en' && slug === 'pc-game-crash'
    ? englishEditorialMetadata(crashGuideEn.path, crashGuideEn)
    : {};
}
export default async function Page({ params }: Props) {
  const { locale, slug } = await params;
  if (locale !== 'en' || slug !== 'pc-game-crash') notFound();
  return <EnglishCrashGuide />;
}
