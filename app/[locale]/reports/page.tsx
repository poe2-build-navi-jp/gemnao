import { englishEditorialMetadata } from '@/lib/localized/editorial-metadata';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale } from '@/lib/i18n';
import { CommunityReportsPage } from '@/components/community-reports-page';
import { reportCopy } from '@/lib/community-reports/copy';
import { languageAlternates } from '@/lib/localized/index';
export const dynamic = 'force-dynamic';
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  if(locale==='en') return {...englishEditorialMetadata('/reports',{title:reportCopy.en.title,description:reportCopy.en.intro,checkedAt:'2026-10-18'}),robots:{index:false,follow:false,noarchive:true}};
  return {
    title: { absolute: `${reportCopy[locale].title} | Gemnao` },
    description: reportCopy[locale].intro,
    alternates: {
      canonical: `/${locale}/reports`,
      languages: languageAlternates('/reports'),
    },
    robots: { index: false, follow: false, noarchive: true },
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <CommunityReportsPage locale={locale} />;
}
