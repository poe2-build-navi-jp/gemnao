import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MyGamesPage } from '@/components/my-games-page';
import { isLocale, locales } from '@/lib/i18n';
import { myGamesCopy } from '@/lib/my-games-copy';
import { languageAlternates } from '@/lib/localized/index';
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    title: { absolute: `${myGamesCopy[locale].title} | Gemnao` },
    description: myGamesCopy[locale].lead,
    alternates: {
      canonical: `/${locale}/my-games`,
      languages: languageAlternates('/my-games'),
    },
    robots: { index: false, follow: true },
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <MyGamesPage locale={locale} />;
}
