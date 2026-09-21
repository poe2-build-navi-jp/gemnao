import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LocalizedHome } from '@/components/localized-home';
import { copy, isLocale, locales } from '@/lib/i18n';

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
  const ui = copy[locale];
  return {
    title: { absolute: `${ui.hero} | Gemnao` },
    description: ui.heroBody,
    openGraph: {
      title: `${ui.hero} | Gemnao`,
      description: ui.heroBody,
      locale: locale === 'en' ? 'en_US' : locale === 'zh' ? 'zh_CN' : 'es_ES',
      url: `/${locale}`,
      images: [],
    },
    twitter: {
      card: 'summary',
      title: `${ui.hero} | Gemnao`,
      description: ui.heroBody,
      images: [],
    },
    robots: {
      index: false,
      follow: true,
    },
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'ja-JP': '/',
        en: '/en',
        'zh-CN': '/zh',
        es: '/es',
        'x-default': '/',
      },
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
