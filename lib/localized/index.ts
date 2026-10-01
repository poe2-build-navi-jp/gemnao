import type { Locale } from '@/lib/i18n';
import { articlesEn } from '@/lib/localized/articles-en';
import { articlesEs } from '@/lib/localized/articles-es';
import { articlesZh } from '@/lib/localized/articles-zh';
import { localizedHubs } from '@/lib/localized/hubs';
import type { LocalizedArticle } from '@/lib/localized/types';

export const localizedArticles: LocalizedArticle[] = [
  ...articlesEn,
  ...articlesZh,
  ...articlesEs,
];

/** Games that have a translated page in every locale. */
export const localizedGameSlugs = Object.keys(localizedHubs);

export const localizedArticle = (
  locale: Locale,
  gameSlug: string,
  slug: string,
) =>
  localizedArticles.find(
    (article) =>
      article.locale === locale &&
      article.gameSlug === gameSlug &&
      article.slug === slug,
  );

export const localizedArticlesFor = (locale: Locale, gameSlug: string) =>
  localizedArticles.filter(
    (article) => article.locale === locale && article.gameSlug === gameSlug,
  );

/** BCP 47 tag used for <html lang>, hreflang and JSON-LD inLanguage. */
export const languageTag: Record<'ja' | Locale, string> = {
  ja: 'ja',
  en: 'en',
  zh: 'zh-Hans',
  es: 'es',
};

/** Open Graph locale. */
export const ogLocale: Record<Locale, string> = {
  en: 'en_US',
  zh: 'zh_CN',
  es: 'es_ES',
};

/**
 * Whether `/{locale}{path}` exists. `path` is the Japanese path ('' for
 * the home page). Used for hreflang and the language menu, so no link
 * points to a missing translation.
 */
export function hasTranslation(locale: Locale, path: string) {
  if (path === '' || path === '/') return true;
  const [, section, gameSlug, slug, extra] = path.split('/');
  if (section !== 'games' || !gameSlug || extra) return false;
  if (!localizedGameSlugs.includes(gameSlug)) return false;
  return slug ? Boolean(localizedArticle(locale, gameSlug, slug)) : true;
}

/**
 * Next.js `alternates.languages` for a page that exists in Japanese at
 * `path` ('' for home). Includes only translations that exist; x-default
 * points to the Japanese original.
 */
export function languageAlternates(path: string) {
  const languages: Record<string, string> = {
    ja: path || '/',
    'x-default': path || '/',
  };
  for (const locale of ['en', 'zh', 'es'] as const) {
    if (hasTranslation(locale, path))
      languages[languageTag[locale]] = `/${locale}${path}`;
  }
  return languages;
}
