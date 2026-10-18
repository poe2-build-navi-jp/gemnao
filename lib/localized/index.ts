import { codMw4En } from '@/lib/localized/cod-mw4-en';
import { dqmDemoEn } from '@/lib/localized/dqm-demo-en';
import { upcomingLaunchEn } from '@/lib/localized/upcoming-launch-en';
import { pcDiskEn } from '@/lib/localized/pc-disk-en';
import { starWarsBacklogEn } from '@/lib/localized/star-wars-backlog-en';
import { dawnwalkerBacklogEn } from '@/lib/localized/dawnwalker-backlog-en';
import { aniimoBacklogEn } from '@/lib/localized/aniimo-backlog-en';
import { dogmaPerformanceEn } from '@/lib/localized/dogma-performance-en';
import { palworldBacklogEn } from '@/lib/localized/palworld-backlog-en';
import { wildsBacklogEn } from '@/lib/localized/wilds-backlog-en';
import { eldenBacklogEn } from '@/lib/localized/elden-backlog-en';
import { discordRecommendedBotsEn } from '@/lib/localized/discord-recommended-bots-en';
import { pcHardwareEn } from '@/lib/localized/pc-hardware-en';
import { pcSecurityEn } from '@/lib/localized/pc-security-en';
import { pcUpdateStuckEn } from '@/lib/localized/pc-update-stuck-en';
import { pcUpdateExplorerEn } from '@/lib/localized/pc-update-explorer-en';
import { pcSleepSigninEn } from '@/lib/localized/pc-sleep-signin-en';
import { pcNetworkEn } from '@/lib/localized/pc-network-en';
import { pcGamingEn } from '@/lib/localized/pc-gaming-en';
import { pcUsbDisplayEn } from '@/lib/localized/pc-usb-display-en';
import { pcDeviceRecoveryEn } from '@/lib/localized/pc-device-recovery-en';
import { pcAudioEn } from '@/lib/localized/pc-audio-en';
import { discordListeningSpeechEn } from './discord-listening-speech-en';
import { discordPerformanceVersionEn } from './discord-performance-version-en';
import { discordRtcScreenHelperEn } from './discord-rtc-screen-helper-en';
import { discordNotificationsOverlayPhoneEn } from './discord-notifications-overlay-phone-en';
import { discordLoginMicNetworkEn } from './discord-login-mic-network-en';
import { discordEchoActivityVolumeEn } from './discord-echo-activity-volume-en';
import { discordCallCameraCrashEn } from './discord-call-camera-crash-en';
import { discordBluetoothBotsEn } from './discord-bluetooth-bots-en';
import { discordAudioChecksEn } from './discord-audio-checks-en';
import { discordLaunchEn } from './discord-launch-en';
import { translatedCommonGuides } from './save-guides-zh-es';
import { palworldBackupEn } from './palworld-backup-en';
import { discordCoreEn } from './discord-core-en';
import { commonGuidesEn } from '@/lib/localized/common-guides-en';
import { reportedCaseBySlug } from '@/lib/reported-cases';
import { localizedPcRepairArticles } from '@/lib/localized/pc-repair-articles';
import { arcRaidersLocalizedArticles } from '@/lib/localized/arc-raiders';
import { nightreignLocalizedArticles } from '@/lib/localized/nightreign';
import { marvelRivalsLocalizedArticles } from '@/lib/localized/marvel-rivals';
import { aceCombatLaunchArticles } from '@/lib/localized/ace-combat-launch-articles';
import { recentGameArticlesEn } from '@/lib/localized/recent-game-articles-en';
import { rocketLeagueLocalizedArticles } from '@/lib/localized/rocket-league-articles';
import { localizedDiscordUploadArticles } from '@/lib/localized/discord-upload-articles';
import { gearGuidesEn } from '@/lib/localized/gear-guides-en';
import type { Locale } from '@/lib/i18n';
import { articlesEn } from '@/lib/localized/articles-en';
import { articlesEs } from '@/lib/localized/articles-es';
import { articlesZh } from '@/lib/localized/articles-zh';
import { localizedHubs, hasLocalizedHub } from '@/lib/localized/hubs';
export { localizedGameSlugsFor } from '@/lib/localized/hubs';
import { onimushaArticlesEn } from '@/lib/localized/onimusha-articles-en';
import type { LocalizedArticle } from '@/lib/localized/types';
import { followupLocalizedArticles } from '@/lib/followups';

export const localizedArticles: LocalizedArticle[] = [
  ...codMw4En, ...dqmDemoEn, ...upcomingLaunchEn,
  ...starWarsBacklogEn,
  ...dawnwalkerBacklogEn,
  ...aniimoBacklogEn,
  ...dogmaPerformanceEn,
  ...palworldBacklogEn,
  ...wildsBacklogEn,
  ...eldenBacklogEn,
  ...palworldBackupEn,
  ...followupLocalizedArticles,
  ...arcRaidersLocalizedArticles,
  ...nightreignLocalizedArticles,
  ...marvelRivalsLocalizedArticles,
  ...aceCombatLaunchArticles,
  ...articlesEn,
  ...recentGameArticlesEn,
  ...onimushaArticlesEn,
  ...articlesZh,
  ...articlesEs,
  ...rocketLeagueLocalizedArticles,
];

export const localizedPcArticles = [...localizedPcRepairArticles, ...pcAudioEn, ...pcDeviceRecoveryEn, ...pcUsbDisplayEn, ...pcGamingEn, ...pcNetworkEn, ...pcSleepSigninEn, ...pcUpdateExplorerEn, ...pcUpdateStuckEn, ...pcHardwareEn, ...pcSecurityEn, ...pcDiskEn];
export const localizedPcArticle = (locale: Locale, slug: string) =>
  localizedPcArticles.find(
    (article) => article.locale === locale && article.slug === slug,
  );

export const localizedDiscordArticles = [...localizedDiscordUploadArticles, ...discordCoreEn, ...discordLaunchEn, ...discordAudioChecksEn, ...discordBluetoothBotsEn, ...discordCallCameraCrashEn, ...discordEchoActivityVolumeEn, ...discordNotificationsOverlayPhoneEn, ...discordLoginMicNetworkEn, ...discordRtcScreenHelperEn, ...discordPerformanceVersionEn, ...discordListeningSpeechEn, ...discordRecommendedBotsEn];
export const localizedDiscordArticle = (locale: Locale, slug: string) =>
  localizedDiscordArticles.find(
    (article) => article.locale === locale && article.slug === slug,
  );

/** Union of translated hubs; use localizedGameSlugsFor for locale-specific routes. */
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

/** English-only editorial routes. Do not infer translations from a prefix. */
export const englishEditorialPaths = [
  '/pc',
  '/discord',
  '/guide',
  '/guide/pc-game-crash',
  ...commonGuidesEn.map(guide => guide.path),
  ...gearGuidesEn.map((guide) => `/gear/${guide.slug}`),
  '/tools',
  '/tools/windows-diagnosis',
];

/**
 * Whether `/{locale}{path}` exists. `path` is the Japanese path ('' for
 * the home page). Used for hreflang and the language menu, so no link
 * points to a missing translation.
 */
export function hasTranslation(locale: Locale, path: string) {
  if (
    path === '' ||
    path === '/' ||
    path === '/my-games' ||
    path === '/reports'
  )
    return true;
  if (locale === 'en' && englishEditorialPaths.includes(path)) return true;
  if (path === '/guide' && translatedCommonGuides.some(g => g.locale === locale)) return true;
  if (translatedCommonGuides.some(g => g.locale === locale && g.path === path)) return true;
  const [, section, gameSlug, slug, extra] = path.split('/');
  if (section === 'examples' && gameSlug && !slug && !extra)
    return Boolean(reportedCaseBySlug(gameSlug));
  if (section === 'pc' && gameSlug && !slug && !extra)
    return Boolean(localizedPcArticle(locale, gameSlug));
  if (section === 'discord' && gameSlug && !slug && !extra)
    return Boolean(localizedDiscordArticle(locale, gameSlug));
  if (section !== 'games' || !gameSlug || extra) return false;
  return slug
    ? Boolean(localizedArticle(locale, gameSlug, slug))
    : hasLocalizedHub(locale, gameSlug);
}

/**
 * Next.js `alternates.languages` for a page that exists in Japanese at
 * `path` ('' for home). Includes only translations that exist; x-default
 * points to the Japanese original.
 */
export function languageAlternates(path: string) {
  const [, section, gameSlug, articleSlug] = path.split('/');
  if (section === 'games' && !articleSlug && localizedHubs[gameSlug]?.noindex)
    return {};
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
