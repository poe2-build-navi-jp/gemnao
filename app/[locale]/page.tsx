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
  const title = `${t.homeTitle} | Gemnao`;
  return {
    title: { absolute: title },
    description: t.homeBody,
    openGraph: {
      title,
      description: t.homeBody,
      locale: ogLocale[locale],
      images: ['/og-default.png'],
      url: `/${locale}`,
    },
    twitter: { card: 'summary', title, description: t.homeBody, images: ['/og-default.png'] },
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
