import { remainingPagesEn } from './remaining-pages-en';
import {
  localizedArticles,
  localizedDiscordArticles,
  localizedPcArticles,
} from './index';
import { games } from '@/lib/games';
import { gameFacts } from './game-facts';
import { localizedHubs, hasLocalizedHub } from './hubs';
import { commonGuidesEn } from './common-guides-en';
import { crashGuideEn } from './crash-guide-en';
import { gearGuidesEn } from './gear-guides-en';
import type { EnglishSearchEntry } from '@/lib/english-search';
export const englishHomeGames = games
  .filter((g) => hasLocalizedHub('en', g.slug))
  .map((g) => ({
    slug: g.slug,
    name: localizedHubs[g.slug].names?.en || gameFacts[g.slug].names.en,
    lead: localizedHubs[g.slug].lead.en || '',
    accent: g.accent,
  }))
  .sort((a, b) => a.name.localeCompare(b.name, 'en'));
const translatedGames = games.filter((g) => hasLocalizedHub('en', g.slug));
export const englishHomeArticles = [
  ...localizedArticles,
  ...localizedDiscordArticles,
].filter((a) => a.locale === 'en');
const articles = englishHomeArticles;
export const englishSearchEntries: EnglishSearchEntry[] = [
  ...remainingPagesEn.map((p) => ({
    href: `/en${p.path}`,
    title: p.title,
    label: 'Tools and references',
    body: p.items.join(' '),
  })),
  ...articles.map((article) => ({
    href:
      article.gameSlug === 'discord'
        ? `/en/discord/${article.slug}`
        : `/en/games/${article.gameSlug}/${article.slug}`,
    title: article.title,
    label:
      article.gameSlug === 'discord'
        ? 'Discord'
        : article.gameName || gameFacts[article.gameSlug].names.en,
    body: `${article.lead} ${article.summary} ${article.diagnosis.map((row) => `${row.symptom} ${row.cause}`).join(' ')}`,
  })),
  ...translatedGames.map((game) => ({
    href: `/en/games/${game.slug}`,
    title: localizedHubs[game.slug].names?.en || gameFacts[game.slug].names.en,
    label: 'Game troubleshooting',
    body: localizedHubs[game.slug].lead.en || '',
  })),
  {
    href: '/en/pc',
    title: 'Windows PC Troubleshooting Guides',
    label: 'Windows PC index',
    body: 'Audio, microphones, Bluetooth, updates, repair and replacement.',
  },
  {
    href: '/en/discord',
    title: 'Discord troubleshooting guides',
    label: 'Discord index',
    body: 'Microphone, stream audio, screen share black screen and file uploads.',
  },
  {
    href: '/en/guide',
    title: 'PC game troubleshooting guides',
    label: 'Guide index',
    body: 'Steam verification, GPU drivers, black screen, low FPS, launch, crash and stutter.',
  },
  ...localizedPcArticles
    .filter((article) => article.locale === 'en')
    .map((article) => ({
      href: `/en/pc/${article.slug}`,
      title: article.title,
      label: 'Windows PC',
      body: article.description,
    })),
  ...commonGuidesEn.map((guide) => ({
    href: `/en${guide.path}`,
    title: guide.title,
    label: 'PC troubleshooting',
    body: guide.description || '',
  })),
  {
    href: `/en${crashGuideEn.path}`,
    title: crashGuideEn.title,
    label: 'PC troubleshooting',
    body: crashGuideEn.description || '',
  },
  ...gearGuidesEn.map((guide) => ({
    href: `/en/gear/${guide.slug}`,
    title: guide.title,
    label: 'Before you buy',
    body: guide.description || '',
  })),
  {
    href: '/en/tools/windows-diagnosis',
    title: 'Windows game diagnosis: instructions and download',
    label: 'Windows prototype',
    body: 'Game launch, crash, black screen, freeze, low FPS and stutter. Windows 11 x64.',
  },
];
