import { ogImageFor } from '@/lib/og-images';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LocalizedGamePage } from '@/components/localized-game-page';
import { gameBySlug } from '@/lib/games';
import { isLocale, locales } from '@/lib/i18n';
import { gameFacts } from '@/lib/localized/game-facts';
import { localizedHubs, hasLocalizedHub } from '@/lib/localized/hubs';
import {
  languageAlternates,
  localizedGameSlugsFor,
  ogLocale,
} from '@/lib/localized/index';
import { ui } from '@/lib/localized/ui';

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    localizedGameSlugsFor(locale).map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const game = gameBySlug(slug);
  if (!isLocale(locale) || !game || !hasLocalizedHub(locale, slug)) return {};
  const t = ui[locale];
  const title = `${gameFacts[slug].names[locale]} — ${t.gameLabel} | Gemnao`;
  const description = localizedHubs[slug].lead[locale];
  return {
    title: { absolute: title },
    description,
    openGraph: {
      title,
      description,
      locale: ogLocale[locale],
      images: [ogImageFor(`/${locale}/games/${slug}`)],
      url: `/${locale}/games/${slug}`,
    },
    twitter: {
      card:
        slug === 'onimusha-way-of-the-sword'
          ? 'summary_large_image'
          : 'summary',
      title,
      description,
      images: [ogImageFor(`/${locale}/games/${slug}`)],
    },
    alternates: {
      canonical: `/${locale}/games/${slug}`,
      languages: languageAlternates(`/games/${slug}`),
    },
  };
}

export default async function LocaleGame({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const game = gameBySlug(slug);
  if (!isLocale(locale) || !game || !hasLocalizedHub(locale, slug)) notFound();
  return <LocalizedGamePage game={game} locale={locale} />;
}
