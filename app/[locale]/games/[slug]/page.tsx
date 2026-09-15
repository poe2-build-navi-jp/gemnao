import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LocalizedGamePage } from '@/components/localized-game-page';
import { gameBySlug, games } from '@/lib/games';
import { copy, isLocale, locales, localizedGames } from '@/lib/i18n';

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    games
      .filter((game) => localizedGames[locale][game.slug])
      .map((game) => ({ locale, slug: game.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const game = gameBySlug(slug);
  if (!isLocale(locale) || !game || !localizedGames[locale][slug]) return {};
  const ui = copy[locale];
  return {
    title: `${game.shortTitle} – ${ui.launch}`,
    description: `${game.title}: ${ui.heroBody}`,
    robots: {
      index: false,
      follow: true,
    },
    alternates: {
      canonical: `/${locale}/games/${slug}`,
      languages: {
        'ja-JP': `/games/${slug}`,
        en: `/en/games/${slug}`,
        'zh-CN': `/zh/games/${slug}`,
        es: `/es/games/${slug}`,
        'x-default': `/games/${slug}`,
      },
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
  if (!isLocale(locale) || !game || !localizedGames[locale][slug]) notFound();
  return <LocalizedGamePage game={game} locale={locale} />;
}
