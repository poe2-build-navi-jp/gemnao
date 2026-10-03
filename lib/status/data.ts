import { games } from '@/lib/games';
import { gameArticles } from '@/lib/game-articles';
import { readSpikes } from '@/lib/status/events-db';
import {
  maintenanceSchedule,
  noticePattern,
  steamAppIds,
} from '@/lib/status/sources';
import {
  currentMaintenance,
  isActiveOfficialStatus,
  officialSteamNoticeUrl,
  resolvedNoticePattern,
  type MaintenanceState,
} from '@/lib/status/policy';

// Builds the status board data on the server. Every item links to its
// official source; nothing is inferred except the vote "spike" (shown as
// reader reports, not as an outage).

export type StatusData = {
  checkedAt: string;
  discordSource: {
    checkedAt: string;
    lastSuccessfulAt: string | null;
    available: boolean;
  };
  discord: {
    checkedAt: string;
    indicator: string;
    description: string;
    incidents: {
      name: string;
      status: string;
      updatedAt: string;
      url: string;
    }[];
    maintenances: {
      name: string;
      start: string;
      end: string;
      url: string;
      status: string;
    }[];
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
    state: MaintenanceState;
    verifiedAt: string;
    note?: string;
    source: { label: string; url: string };
  }[];
  steamSources: {
    gameSlug: string;
    game: string;
    url: string;
    checkedAt: string;
    available: boolean;
    lastSuccessfulAt: string | null;
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
        status: string;
        scheduled_for: string;
        scheduled_until: string;
        shortlink: string;
      }[];
    };
    if (
      !data.status ||
      typeof data.status.indicator !== 'string' ||
      typeof data.status.description !== 'string' ||
      !Array.isArray(data.incidents) ||
      !Array.isArray(data.scheduled_maintenances) ||
      data.incidents.some(
        (item) =>
          typeof item.name !== 'string' ||
          typeof item.status !== 'string' ||
          typeof item.shortlink !== 'string' ||
          typeof item.updated_at !== 'string' ||
          !Number.isFinite(Date.parse(item.updated_at)),
      ) ||
      data.scheduled_maintenances.some(
        (item) =>
          typeof item.name !== 'string' ||
          typeof item.status !== 'string' ||
          typeof item.shortlink !== 'string' ||
          typeof item.scheduled_for !== 'string' ||
          typeof item.scheduled_until !== 'string' ||
          !Number.isFinite(Date.parse(item.scheduled_for)) ||
          !Number.isFinite(Date.parse(item.scheduled_until)),
      )
    )
      return null;
    return {
      checkedAt: new Date().toISOString(),
      indicator: data.status.indicator,
      description: data.status.description,
      incidents: data.incidents
        .filter((item) => isActiveOfficialStatus(item.status))
        .map((item) => ({
          name: item.name,
          status: item.status,
          updatedAt: item.updated_at,
          url: item.shortlink,
        })),
      maintenances: data.scheduled_maintenances
        .filter((item) => isActiveOfficialStatus(item.status))
        .map((item) => ({
          name: item.name,
          status: item.status,
          start: item.scheduled_for,
          end: item.scheduled_until,
          url: item.shortlink,
        })),
    };
  } catch {
    return null;
  }
}

async function steamNotices(now: number) {
  const since = now / 1000 - 3 * 86_400;
  const results = await Promise.all(
    Object.entries(steamAppIds).map(async ([gameSlug, appId]) => {
      const source = {
        gameSlug,
        game: gameName(gameSlug),
        url: `https://store.steampowered.com/news/app/${appId}`,
        checkedAt: new Date(now).toISOString(),
      };
      try {
        const response = await fetch(
          `https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=${appId}&count=5&maxlength=1&feeds=steam_community_announcements&format=json`,
          { signal: AbortSignal.timeout(4000) },
        );
        if (!response.ok) throw new Error('Steam source unavailable');
        const data = (await response.json()) as {
          appnews?: {
            appid: number;
            newsitems?: {
              title: string;
              date: number;
              gid: string;
              url: string;
              feedname: string;
              appid: number;
            }[];
          };
        };
        if (
          data.appnews?.appid !== Number(appId) ||
          !Array.isArray(data.appnews?.newsitems) ||
          data.appnews.newsitems.some(
            (item) =>
              typeof item.title !== 'string' ||
              !Number.isFinite(item.date) ||
              typeof item.gid !== 'string' ||
              typeof item.url !== 'string',
          )
        )
          throw new Error('Invalid Steam source');
        return {
          source: {
            ...source,
            checkedAt: new Date().toISOString(),
            available: true,
            lastSuccessfulAt: new Date().toISOString(),
          },
          notices: data.appnews.newsitems
            .filter(
              (item) =>
                item.appid === Number(appId) &&
                item.feedname === 'steam_community_announcements' &&
                officialSteamNoticeUrl(item.url) &&
                item.date >= since &&
                item.date <= now / 1000 &&
                noticePattern.test(item.title) &&
                !resolvedNoticePattern.test(item.title),
            )
            .map((item) => ({
              gameSlug,
              game: gameName(gameSlug),
              title: item.title,
              date: new Date(item.date * 1000).toISOString(),
              url: officialSteamNoticeUrl(item.url)!,
            })),
        };
      } catch {
        return {
          source: {
            ...source,
            checkedAt: new Date().toISOString(),
            available: false,
            lastSuccessfulAt: null,
          },
          notices: [],
        };
      }
    }),
  );
  return {
    sources: results.map((result) => result.source),
    notices: results
      .flatMap((result) => result.notices)
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 12),
  };
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
    steamNotices(now),
    spikes(),
  ]);
  return {
    checkedAt: new Date().toISOString(),
    discord,
    discordSource: {
      checkedAt: new Date().toISOString(),
      available: !!discord,
      lastSuccessfulAt: discord?.checkedAt ?? null,
    },
    notices: notices.notices,
    steamSources: notices.sources,
    maintenance: currentMaintenance(maintenanceSchedule, now).map((item) => ({
      ...item,
      game: gameName(item.gameSlug),
    })),
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
              appid: number;
              newsitems?: {
                title: string;
                date: number;
                gid: string;
                url: string;
                feedname: string;
                appid: number;
              }[];
            };
          };
          return [
            slug,
            (data.appnews?.newsitems ?? [])
              .filter(
                (item) =>
                  item.appid === Number(appId) &&
                  item.date >= since &&
                  item.date <= Date.now() / 1000 &&
                  item.feedname === 'steam_community_announcements' &&
                  officialSteamNoticeUrl(item.url),
              )
              .map((item) => ({
                title: item.title,
                date: new Date(item.date * 1000).toISOString(),
                url: officialSteamNoticeUrl(item.url)!,
              })),
          ] as const;
        } catch {
          return [slug, []] as const;
        }
      }),
  );
  return Object.fromEntries(entries);
}
