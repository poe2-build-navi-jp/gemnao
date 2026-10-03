import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { SaveGame } from '../components/save-game';
import { MyDashboard } from '../components/my-dashboard';
import { trackMyGameAdded } from '../lib/analytics';
import { importSolutions, serializeSolutions } from '../lib/saved-solutions';

// No Google script, network requests, or live analytics events in this check.
const root = globalThis as unknown as {
  window?: { gtag?: (...args: unknown[]) => void };
  location: { origin: string; pathname: string; search: string; hash: string };
};
assert.doesNotThrow(trackMyGameAdded); // SSR / analytics not available.
const calls: unknown[][] = [];
const capture = (...args: unknown[]) => calls.push(args);
root.location = {
  origin: 'https://gemnao.pages.dev',
  pathname: '/games/private-game',
  search: '?email=private@example.com',
  hash: '#private-note',
};
root.window = { gtag: capture };
trackMyGameAdded();
assert.deepEqual(calls, [
  [
    'event',
    'my_game_added',
    {
      page_location: 'https://gemnao.pages.dev/my',
      page_title: 'My Games',
      page_referrer: '',
    },
  ],
]);
calls.length = 0;
for (const pathname of ['/admin', '/admin/settings']) {
  root.location.pathname = pathname;
  trackMyGameAdded();
}
assert.equal(calls.length, 0);
root.location.pathname = '/my';
root.window.gtag = undefined;
assert.doesNotThrow(trackMyGameAdded);
root.window.gtag = () => {
  throw new Error('Analytics blocked');
};
assert.doesNotThrow(trackMyGameAdded);
root.window.gtag = capture;

// Server rendering must not invent additions. Local imports are unrelated.
const gameHtml = renderToStaticMarkup(<SaveGame slug="elden-ring" />);
const dashboardHtml = renderToStaticMarkup(<MyDashboard games={[]} />);
assert.match(gameHtml, /disabled/);
assert.match(dashboardHtml, /id="my-games"/);
assert.equal(calls.length, 0);
const values = new Map<string, string>([['gemnao-my-games', '["elden-ring"]']]);
const storage = {
  getItem: (key: string) => values.get(key) ?? null,
  setItem: (key: string, value: string) => values.set(key, value),
};
assert.equal(
  importSolutions(
    storage,
    serializeSolutions([
      {
        id: 'private-note',
        title: 'Private restored title',
        gameSlug: 'elden-ring',
        status: 'resolved',
        diagnosis: 'Private diagnosis',
        settings: 'Private settings',
        notes: 'Private note',
        articlePath: '/games/elden-ring/not-launching',
        stepId: 'step-1',
        completedSteps: [],
        createdAt: '2026-10-03T00:00:00.000Z',
        updatedAt: '2026-10-03T00:00:00.000Z',
      },
    ]),
  ),
  1,
);
assert.equal(values.get('gemnao-my-games'), '["elden-ring"]');
assert.equal(calls.length, 0);
assert.ok(!gameHtml.includes('my_game_added'));
assert.ok(!dashboardHtml.includes('my_game_added'));
console.log(
  'My Games analytics checks passed: fixed payload, no source URL/title/private data, SSR, admin exclusion, disabled/throwing analytics, and unrelated imports.',
);
