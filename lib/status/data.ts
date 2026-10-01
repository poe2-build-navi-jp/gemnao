import { games } from '@/lib/games';
import { gameArticles } from '@/lib/game-articles';
import { readSpikes } from '@/lib/status/events-db';
import {
  maintenanceSchedule,
  noticePattern,
  steamAppIds,
} from '@/lib/status/sources';

// Builds the status board data on the server. Every item links to its
// official source; nothing is inferred except the vote "spike" (shown as
// reader reports, not as an outage).

export type StatusData = {
  checkedAt: string;
  discord: {
    indicator: string;
    description: string;
    incidents: {
      name: string;
      status: string;
      updatedAt: string;
      url: string;
    }[];
    maintenances: { name: string; start: string; end: string; url: string }[];
  } | null;
  notices: {
    gameSlug: string;
    game: string;
    title: string;
    date: string;
    url: string;
  }[];
  maintenance: {
    gameSlug: string;
    game: string;
    title: string;
    start: string;
    end: string;
    state: 'upcoming' | 'ongoing';
    note?: string;
    source: { label: string; url: string };
  }[];
  spikes: { label: string; href: string; last24h: number }[];
};

const gameName = (slug: string) =>
  games.find((game) => game.slug === slug)?.shortTitle ?? slug;

async function discordStatus(): Promise<StatusData['discord']> {
  try {
    const response = await fetch(
      'https://discordstatus.com/api/v2/summary.json',
      { signal: AbortSignal.timeout(4000) },
    );
    if (!response.ok) return null;
    const data = (await response.json()) as {
      status: { indicator: string; description: string };
      incidents: {
        name: string;
        status: string;
        updated_at: string;
        shortlink: string;
      }[];
      scheduled_maintenances: {
        name: string;
        scheduled_for: string;
        scheduled_until: string;
        shortlink: string;
      }[];
    };
    return {
      indicator: data.status.indicator,
      description: data.status.description,
      incidents: data.incidents.map((item) => ({
        name: item.name,
        status: item.status,
        updatedAt: item.updated_at,
        url: item.shortlink,
      })),
      maintenances: data.scheduled_maintenances.map((item) => ({
        name: item.name,
        start: item.scheduled_for,
        end: item.scheduled_until,
        url: item.shortlink,
      })),
    };
  } catch {
    return null;
  }
}

async function steamNotices(): Promise<StatusData['notices']> {
  const since = Date.now() / 1000 - 3 * 86_400;
  const results = await Promise.all(
    Object.entries(steamAppIds).map(async ([gameSlug, appId]) => {
      try {
        const response = await fetch(
          `https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=${appId}&count=5&maxlength=1&feeds=steam_community_announcements&format=json`,
          { signal: AbortSignal.timeout(4000) },
        );
        if (!response.ok) return [];
        const data = (await response.json()) as {
          appnews?: {
            newsitems?: { title: string; date: number; gid: string }[];
          };
        };
        return (data.appnews?.newsitems ?? [])
          .filter(
            (item) => item.date >= since && noticePattern.test(item.title),
          )
          .map((item) => ({
            gameSlug,
            game: gameName(gameSlug),
            title: item.title,
            date: new Date(item.date * 1000).toISOString(),
            url: `https://store.steampowered.com/news/app/${appId}/view/${item.gid}`,
          }));
      } catch {
        return [];
      }
    }),
  );
  return results
    .flat()
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 12);
}

function currentMaintenance(now: number): StatusData['maintenance'] {
  return maintenanceSchedule
    .filter((item) => Date.parse(item.end) > now)
    .map((item) => ({
      ...item,
      game: gameName(item.gameSlug),
      state:
        Date.parse(item.start) <= now
          ? ('ongoing' as const)
          : ('upcoming' as const),
    }))
    .sort((a, b) => a.start.localeCompare(b.start));
}

/** Turn a feedback context ("game-aion2-login-error") into a readable link. */
function spikeLink(groupKey: string) {
  const article = gameArticles.find(
    (item) => `game-${item.gameSlug}-${item.slug}` === groupKey,
  );
  if (article)
    return {
      label: `${gameName(article.gameSlug)}：${article.shortTitle}`,
      href: `/games/${article.gameSlug}/${article.slug}`,
    };
  if (games.some((game) => game.slug === groupKey))
    return { label: gameName(groupKey), href: `/games/${groupKey}` };
  if (groupKey.startsWith('discord-'))
    return { label: 'Discord', href: `/discord/${groupKey.slice(8)}` };
  if (groupKey.startsWith('guide-'))
    return { label: 'PCゲーム共通', href: `/guide/${groupKey.slice(6)}` };
  return null;
}

async function spikes(): Promise<StatusData['spikes']> {
  try {
    return (await readSpikes()).flatMap((spike) => {
      const link = spikeLink(spike.groupKey);
      return link ? [{ ...link, last24h: spike.last24h }] : [];
    });
  } catch {
    return [];
  }
}

export async function buildStatus(): Promise<StatusData> {
  const now = Date.now();
  const [discord, notices, spikeList] = await Promise.all([
    discordStatus(),
    steamNotices(),
    spikes(),
  ]);
  return {
    checkedAt: new Date(now).toISOString(),
    discord,
    notices,
    maintenance: currentMaintenance(now),
    spikes: spikeList,
  };
}

export type GameNews = Record<
  string,
  { title: string; date: string; url: string }[]
>;

/** Latest official Steam announcements (30 days, up to 3) per game. */
export async function buildGameNews(slugs: string[]): Promise<GameNews> {
  const since = Date.now() / 1000 - 30 * 86_400;
  const entries = await Promise.all(
    slugs
      .filter((slug) => steamAppIds[slug])
      .map(async (slug) => {
        const appId = steamAppIds[slug];
        try {
          const response = await fetch(
            `https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=${appId}&count=3&maxlength=1&feeds=steam_community_announcements&format=json`,
            { signal: AbortSignal.timeout(4000) },
          );
          if (!response.ok) return [slug, []] as const;
          const data = (await response.json()) as {
            appnews?: {
              newsitems?: { title: string; date: number; gid: string }[];
            };
          };
          return [
            slug,
            (data.appnews?.newsitems ?? [])
              .filter((item) => item.date >= since)
              .map((item) => ({
                title: item.title,
                date: new Date(item.date * 1000).toISOString(),
                url: `https://store.steampowered.com/news/app/${appId}/view/${item.gid}`,
              })),
          ] as const;
        } catch {
          return [slug, []] as const;
        }
      }),
  );
  return Object.fromEntries(entries);
}
