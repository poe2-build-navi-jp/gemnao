// Every page listed in the sitemap, grouped and titled for the HTML page
// index (/all-pages). The footer links it from every page, so each indexed
// page is at most two clicks from anywhere even when crawlers do not read
// sitemap.xml. Pages without a known title fall back to their path.
import sitemap from '@/app/sitemap';
import { games } from '@/lib/games';
import { gameArticles } from '@/lib/game-articles';
import { commonGuides } from '@/lib/common-guides';
import { discordArticles } from '@/lib/discord-articles-all';
import { troubleHubs } from '@/lib/trouble-hubs';
import { releaseRoundups } from '@/lib/release-roundups';
import { weeklyReports } from '@/lib/weekly-reports';
import { pcArticles } from '@/lib/pc-articles';
import { gearArticles } from '@/lib/gear-articles';
import { gearGuides } from '@/lib/gear-guides';
import {
  localizedArticles,
  localizedDiscordArticles,
  localizedPcArticles,
} from '@/lib/localized/index';
import { commonGuidesEn } from '@/lib/localized/common-guides-en';
import { gearGuidesEn } from '@/lib/localized/gear-guides-en';
import { remainingPagesEn } from '@/lib/localized/remaining-pages-en';

const fixedTitles: Record<string, string> = {
  '/': 'ゲムなお トップ',
  '/guide': '共通ガイド一覧',
  '/discord': 'Discordの不具合',
  '/status': '障害・メンテ情報',
  '/tools': '便利ツール',
  '/tools/windows-diagnosis': 'Windows版診断ツール',
  '/tools/save-locations': 'セーブデータの場所',
  '/tools/refresh-rate': 'リフレッシュレートの確認',
  '/pc': 'PC・Windowsの不具合',
  '/discord-servers': 'Discordサーバー募集',
  '/discord-servers/guidelines': 'Discordサーバー掲載のガイドライン',
  '/about': '運営情報',
  '/contact': 'お問い合わせ',
  '/privacy': 'プライバシーポリシー',
  '/terms': '利用規約・免責',
  '/weekly': '週刊まとめ一覧',
  '/gear': 'ゲーマー向けデバイス',
  '/en': 'Gemnao (English home)',
  '/en/articles': 'All English guides',
  '/en/pc': 'PC and Windows problems',
  '/en/discord': 'Discord problems',
  '/en/guide': 'General guides',
  '/en/tools': 'Tools',
};

function titles() {
  const map = new Map<string, string>(Object.entries(fixedTitles));
  const add = (path: string, title: string) => {
    if (!map.has(path)) map.set(path, title);
  };
  for (const g of games) add(`/games/${g.slug}`, g.title);
  for (const a of gameArticles) add(`/games/${a.gameSlug}/${a.slug}`, a.title);
  for (const g of commonGuides) add(`/guide/${g.slug}`, g.title);
  for (const d of discordArticles) add(`/discord/${d.slug}`, d.title);
  for (const h of troubleHubs) add(`/trouble/${h.slug}`, h.title);
  for (const r of releaseRoundups) add(`/new-releases/${r.slug}`, r.title);
  for (const r of weeklyReports) add(`/weekly/${r.slug}`, r.title);
  for (const p of pcArticles) add(`/pc/${p.slug}`, p.title);
  for (const g of [...gearArticles, ...gearGuides])
    add(`/gear/${g.slug}`, g.title);
  for (const a of localizedArticles)
    add(`/${a.locale}/games/${a.gameSlug}/${a.slug}`, a.title);
  for (const a of localizedPcArticles)
    add(`/${a.locale}/pc/${a.slug}`, a.title);
  for (const a of localizedDiscordArticles)
    add(`/${a.locale}/discord/${a.slug}`, a.title);
  for (const g of commonGuidesEn) add(`/en${g.path}`, g.title);
  for (const g of gearGuidesEn) add(`/en/gear/${g.slug}`, g.title);
  for (const p of remainingPagesEn) add(`/en${p.path}`, p.title);
  return map;
}

const sectionOf = (path: string): [string, string] => {
  const en = path === '/en' || path.startsWith('/en/');
  const rest = en ? path.slice(3) || '/' : path;
  const first = rest.split('/')[1] || '';
  const ja: Record<string, string> = {
    games: 'ゲーム別の記事',
    trouble: '症状別のまとめ',
    guide: '共通ガイド',
    discord: 'Discord',
    pc: 'PC・Windows',
    weekly: '週刊まとめ',
    'new-releases': '新作PCゲームの動作環境',
    gear: 'ゲーマー向けデバイス',
    examples: '解決事例',
  };
  const english: Record<string, string> = {
    games: 'Game guides',
    trouble: 'Guides by symptom',
    guide: 'General guides',
    discord: 'Discord',
    pc: 'PC and Windows',
    weekly: 'PC Gaming Weekly',
    'new-releases': 'New PC releases',
    gear: 'Gaming devices',
    examples: 'Reported cases',
  };
  return en
    ? ['English', english[first] || 'Other pages']
    : ['日本語', ja[first] || 'サイトのページ'];
};

export type PageIndexSection = {
  language: string;
  name: string;
  pages: { path: string; title: string }[];
};

export function pageIndex(): PageIndexSection[] {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://gemnao.pages.dev';
  const map = titles();
  const sections = new Map<string, PageIndexSection>();
  const seen = new Set<string>();
  for (const { url } of sitemap()) {
    const path = url.slice(base.length) || '/';
    if (seen.has(path)) continue;
    seen.add(path);
    const [language, name] = sectionOf(path);
    const key = `${language}:${name}`;
    if (!sections.has(key)) sections.set(key, { language, name, pages: [] });
    sections.get(key)!.pages.push({ path, title: map.get(path) || path });
  }
  return [...sections.values()];
}
