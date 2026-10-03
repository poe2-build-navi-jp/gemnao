import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  buildStatus,
  buildGameNews,
  type StatusData,
} from '../lib/status/data';
import {
  maintenanceSchedule,
  steamAppIds,
  type Maintenance,
} from '../lib/status/sources';
import {
  currentMaintenance,
  isActiveOfficialStatus,
  officialSteamNoticeUrl,
  resolvedNoticePattern,
} from '../lib/status/policy';
import { StatusBoard, StatusTicker } from '../components/status-board';

const now = Date.parse('2026-10-03T08:38:00Z');
const originalNow = Date.now;
Date.now = () => now;
const knownUrl =
  'https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1845383656388561';
assert.equal(officialSteamNoticeUrl(knownUrl), knownUrl);
for (const url of [
  'javascript:alert(1)',
  'http://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/123',
  'https://steamstore-a.akamaihd.net.evil.test/news/externalpost/steam_community_announcements/123',
  'https://example.com/123',
  'https://store.steampowered.com/news/app/3393110/view/123?redirect=https://evil.test',
  'https://steamcommunity.com/other/detail/123',
])
  assert.equal(officialSteamNoticeUrl(url), null);
for (const status of ['resolved', 'completed', 'cancelled', 'postmortem'])
  assert.equal(isActiveOfficialStatus(status), false);
for (const status of [
  'investigating',
  'identified',
  'monitoring',
  'scheduled',
  'in_progress',
  'verifying',
])
  assert.equal(isActiveOfficialStatus(status), true);
for (const title of [
  'Maintenance is over, welcome back!',
  '[Resolved] Login outage',
  'Maintenance Completed',
])
  assert.ok(resolvedNoticePattern.test(title));
for (const title of [
  'Unresolved server issues',
  'Server issues are not resolved',
  'Servers online but login is failing',
  'Advanced Access Known Issues (Updated: 10/2)',
  'Patch notes',
])
  assert.equal(resolvedNoticePattern.test(title), false);
const maintenance = maintenanceSchedule[0];
assert.equal(currentMaintenance([maintenance], now)[0].state, 'upcoming');
assert.equal(
  currentMaintenance([maintenance], Date.parse(maintenance.start))[0].state,
  'scheduled-window',
);
assert.equal(
  currentMaintenance(
    [{ ...maintenance, status: 'in_progress' }],
    Date.parse(maintenance.start),
  )[0].state,
  'ongoing',
);
assert.equal(
  currentMaintenance([maintenance], Date.parse(maintenance.end))[0].state,
  'unconfirmed',
);
const completed: Maintenance = {
  ...maintenance,
  status: 'completed',
  resolution: { confirmedAt: maintenance.end, source: maintenance.source },
};
assert.equal(currentMaintenance([completed], now).length, 0);
assert.equal(
  currentMaintenance([{ ...completed, status: 'cancelled' }], now).length,
  0,
);

let mode = 'success';
const fetchOriginal = globalThis.fetch;
globalThis.fetch = async (input) => {
  const url = new URL(input instanceof Request ? input.url : input);
  if (mode === 'network-failure') throw new Error('offline');
  if (mode === 'http-failure') return new Response('', { status: 503 });
  if (mode === 'malformed') return Response.json({});
  if (url.hostname === 'discordstatus.com')
    return Response.json({
      status: { indicator: 'minor', description: 'Minor issue' },
      incidents: ['investigating', 'monitoring', 'resolved', 'postmortem'].map(
        (status) => ({
          name: status,
          status,
          updated_at: new Date(now).toISOString(),
          shortlink: `https://discordstatus.com/incidents/${status}`,
        }),
      ),
      scheduled_maintenances: [
        'scheduled',
        'in_progress',
        'verifying',
        'completed',
      ].map((status) => ({
        name: status,
        status,
        scheduled_for: '2026-10-01T00:00:00Z',
        scheduled_until: '2026-10-01T01:00:00Z',
        shortlink: `https://discordstatus.com/incidents/${status}`,
      })),
    });
  const appid = Number(url.searchParams.get('appid'));
  if (mode === 'partial' && appid === 3393110)
    return new Response('', { status: 503 });
  return Response.json({
    appnews: {
      appid,
      newsitems:
        appid === 3393110
          ? [
              {
                title: 'Known Issues',
                date: now / 1000 - 600,
                gid: '1845383656388561',
                url: knownUrl,
                feedname: 'steam_community_announcements',
                appid,
              },
              {
                title: 'Maintenance is over, welcome back!',
                date: now / 1000 - 600,
                gid: '2',
                url: knownUrl.replace(/\d+$/, '2'),
                feedname: 'steam_community_announcements',
                appid,
              },
              {
                title: 'Unofficial outage claim',
                date: now / 1000 - 600,
                gid: '3',
                url: knownUrl.replace(/\d+$/, '3'),
                feedname: 'pcgamer',
                appid,
              },
              {
                title: 'Future server maintenance',
                date: now / 1000 + 600,
                gid: '4',
                url: knownUrl.replace(/\d+$/, '4'),
                feedname: 'steam_community_announcements',
                appid,
              },
            ]
          : [],
    },
  });
};
const good = await buildStatus();
assert.deepEqual(
  good.discord?.incidents.map((item) => item.status),
  ['investigating', 'monitoring'],
);
assert.deepEqual(
  good.discord?.maintenances.map((item) => item.status),
  ['scheduled', 'in_progress', 'verifying'],
);
assert.equal(good.notices.length, 1);
assert.equal(
  good.notices[0].url,
  knownUrl,
  'preserve official URL instead of constructing /view/gid',
);
assert.equal(good.steamSources.length, Object.keys(steamAppIds).length);
assert.ok(
  good.steamSources.every(
    (source) => source.available && source.lastSuccessfulAt,
  ),
);
const gameNews = await buildGameNews(['aion2']);
assert.equal(gameNews.aion2[0].url, knownUrl);
assert.ok(
  !gameNews.aion2.some((item) => item.title === 'Unofficial outage claim'),
);
const providerFetch = globalThis.fetch;
for (const field of ['name', 'status', 'shortlink']) {
  globalThis.fetch = async (input, init) => {
    const response = await providerFetch(input, init);
    if (
      (input instanceof Request ? input.url : input.toString()).includes(
        'discordstatus.com',
      )
    ) {
      const payload = (await response.json()) as {
        incidents: Record<string, unknown>[];
      };
      payload.incidents[0][field] = { unexpected: true };
      return Response.json(payload);
    }
    return response;
  };
  assert.equal(
    (await buildStatus()).discord,
    null,
    `invalid Discord ${field} is unavailable`,
  );
}
globalThis.fetch = providerFetch;

const runtime = globalThis as unknown as {
  __statusValues: unknown[];
  __statusIndex: number;
  __statusEffect: () => () => void;
};
const render = (
  component: typeof StatusBoard,
  data: StatusData | null,
  failed = false,
) => {
  runtime.__statusValues = [data, failed];
  runtime.__statusIndex = 0;
  return renderToStaticMarkup(component());
};
mode = 'partial';
const partial = await buildStatus();
assert.equal(
  partial.steamSources.filter((source) => !source.available).length,
  1,
);
assert.match(
  render(StatusBoard, partial),
  /お知らせの有無や復旧状況は判断できません/,
);
for (mode of ['network-failure', 'http-failure', 'malformed']) {
  const unavailable = await buildStatus();
  assert.equal(unavailable.discord, null);
  assert.ok(unavailable.steamSources.every((source) => !source.available));
  const noMaintenance = { ...unavailable, maintenance: [] };
  const html = render(StatusTicker, noMaintenance);
  assert.match(html, /現在の状況は確認できません/);
  assert.ok(!html.includes('障害・メンテナンスはありません'));
}
const newsOnly = {
  ...good,
  maintenance: [],
  discord: {
    ...good.discord!,
    indicator: 'none',
    incidents: [],
    maintenances: [],
  },
};
assert.ok(
  !render(StatusTicker, newsOnly).includes('情報 1件'),
  'patch/known issue news must not count as current outages',
);
assert.match(render(StatusBoard, good, true), /前回取得した情報/);
const maintenanceOnly = {
  ...newsOnly,
  discord: {
    ...newsOnly.discord,
    indicator: 'maintenance',
    maintenances: good.discord!.maintenances.slice(0, 1),
  },
};
assert.match(
  render(StatusTicker, maintenanceOnly),
  /情報 1件/,
  'overall maintenance indicator and its detail are counted once',
);
const twoIncidentsAndMaintenance = {
  ...maintenanceOnly,
  discord: { ...maintenanceOnly.discord, incidents: good.discord!.incidents },
};
assert.match(render(StatusTicker, twoIncidentsAndMaintenance), /情報 3件/);

const staleTicker = render(StatusTicker, newsOnly, true);
assert.match(staleTicker, /前回取得した情報：/);
assert.match(staleTicker, /日本時間/);
assert.ok(
  !staleTicker.includes('Discord：正常に稼働中'),
  'a previous healthy Discord snapshot must not sound current after total refresh failure',
);
assert.match(
  render(StatusTicker, { ...newsOnly, steamSources: partial.steamSources }),
  /Discord：正常に稼働中/,
  'fresh Discord success can be shown despite a partial Steam failure',
);
assert.match(
  render(StatusBoard, {
    ...good,
    maintenance: currentMaintenance(
      [maintenance],
      Date.parse(maintenance.end),
    ).map((item) => ({ ...item, game: 'AION2' })),
  }),
  /終了未確認/,
);
assert.match(render(StatusBoard, null, true), /読み込めませんでした/);

// Exercise the real effect: interval, visibility, retry after failure and cleanup.
let interval: (() => void) | null = null;
let listener: (() => void) | null = null;
let cleared = false;
const documentMock = {
  visibilityState: 'visible',
  addEventListener: (_type: string, fn: () => void) => {
    listener = fn;
  },
  removeEventListener: () => {
    listener = null;
  },
};
Object.assign(globalThis, {
  document: documentMock,
  window: {
    setInterval: (fn: () => void, ms: number) => {
      assert.equal(ms, 600_000);
      interval = fn;
      return 1;
    },
    clearInterval: () => {
      cleared = true;
    },
  },
});
let requests = 0;
let hookFails = false;
let signal: AbortSignal | null = null;
globalThis.fetch = async (_input, init) => {
  requests++;
  signal = init?.signal ?? null;
  if (hookFails) throw new Error('failed refresh');
  return Response.json(good);
};
const tick = () => new Promise((resolve) => setTimeout(resolve, 0));
render(StatusBoard, null);
const cleanup = runtime.__statusEffect();
await tick();
assert.equal(requests, 1);
assert.ok(runtime.__statusValues[0]);
hookFails = true;
(interval as unknown as () => void)();
await tick();
assert.equal(runtime.__statusValues[1], true);
assert.ok(
  runtime.__statusValues[0],
  'failed refresh preserves last successful payload',
);
hookFails = false;
(interval as unknown as () => void)();
await tick();
assert.equal(runtime.__statusValues[1], false);
documentMock.visibilityState = 'hidden';
(interval as unknown as () => void)();
assert.equal(requests, 3, 'hidden page does not poll');
documentMock.visibilityState = 'visible';
Date.now = () => now + 600_001;
(listener as unknown as () => void)();
await tick();
assert.equal(requests, 4);
// Hold a request in flight to ensure unmount cancels it and late replies cannot update state.
globalThis.fetch = async (_input, init) => {
  signal = init?.signal ?? null;
  return await new Promise<Response>(() => {});
};
(interval as unknown as () => void)();
cleanup();
assert.equal((signal as unknown as AbortSignal).aborted, true);
assert.equal(cleared, true);
assert.equal(listener, null);
Date.now = originalNow;
globalThis.fetch = fetchOriginal;
console.log(
  'PASS: status lifecycle, resolved/completed exclusion, official URLs, provider failures, non-outage news, source times, refresh/visibility/cleanup',
);
