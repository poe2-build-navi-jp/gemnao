import { englishHomeCopy } from '@/lib/localized/home-copy-en';
import { ogImageFor } from '@/lib/og-images';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LocalizedHome } from '@/components/localized-home';
import { isLocale, locales } from '@/lib/i18n';
import { languageAlternates, ogLocale } from '@/lib/localized/index';
import { ui } from '@/lib/localized/ui';

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
  const t = ui[locale];
  const title = `${locale === 'en' ? englishHomeCopy.title : t.homeTitle} | Gemnao`;
  const description =
    locale === 'en' ? englishHomeCopy.description : t.homeBody;
  const image = locale === 'en' ? ogImageFor('/en') : '/og-default.png';
  return {
    title: { absolute: title },
    description,
    openGraph: {
      title,
      description,
      locale: ogLocale[locale],
      images: [image],
      url: `/${locale}`,
    },
    twitter: { card: 'summary', title, description, images: [image] },
    alternates: {
      canonical: `/${locale}`,
      languages: languageAlternates(''),
    },
  };
}

export default async function LocaleHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <LocalizedHome locale={locale} />;
}
