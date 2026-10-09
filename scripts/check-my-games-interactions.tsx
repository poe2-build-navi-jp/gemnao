import assert from 'node:assert/strict';
import { MyGamesPanel } from '../components/my-games-panel';
import { SaveGame } from '../components/save-game';
import { MyDashboard } from '../components/my-dashboard';
import { MY_GAMES_KEY } from '../lib/my-pc';

// This test's runner supplies shallow React hooks. Exercise the real handlers
// and real useStored persistence callback, without DOM, network, or live GA.
type Node = {
  type?: unknown;
  props?: { children?: unknown; [key: string]: unknown };
};
function find(node: unknown, test: (node: Node) => boolean): Node | undefined {
  if (Array.isArray(node)) {
    for (const child of node) {
      const match = find(child, test);
      if (match) return match;
    }
  } else if (node && typeof node === 'object') {
    const element = node as Node;
    if (test(element)) return element;
    return find(element.props?.children, test);
  }
}
const values = new Map<string, string>();
const calls: unknown[][] = [];
const capture = (...args: unknown[]) => {
  calls.push(args);
};
let failure = '';
let notifications = 0;
const root = globalThis as unknown as {
  localStorage: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
  window: { gtag?: (...args: unknown[]) => void; dispatchEvent: () => boolean };
  location: { origin: string; pathname: string };
  __myGamesServerSnapshot: boolean;
};
root.localStorage = {
  getItem: (key) => {
    if (failure === 'get') throw new Error('Storage read blocked');
    return values.get(key) ?? null;
  },
  setItem: (key, value) => {
    if (failure === 'set') throw new Error('Storage quota exceeded');
    values.set(key, value);
  },
  removeItem: (key) => {
    values.delete(key);
  },
};
root.location = { origin: 'https://gemnao.pages.dev', pathname: '/my' };
root.window = {
  gtag: capture,
  dispatchEvent: () => {
    notifications++;
    return true;
  },
};
const selected = () => JSON.parse(values.get(MY_GAMES_KEY) ?? '[]') as string[];
const expected = [
  'event',
  'my_game_added',
  {
    page_location: 'https://gemnao.pages.dev/my',
    page_title: 'My Games',
    page_referrer: '',
  },
];
function reset(saved: string[] = []) {
  values.clear();
  values.set(MY_GAMES_KEY, JSON.stringify(saved));
  calls.length = 0;
  notifications = 0;
  failure = '';
  root.__myGamesServerSnapshot = false;
  root.window.gtag = capture;
}
const game = {
  slug: 'elden-ring',
  name: 'Private game title',
  articles: [],
  maintenance: [],
  hasNews: false,
  updates: [],
};
for (const source of [
  'game-page',
  'focused-ja',
  'focused-en',
  'focused-zh',
  'focused-es',
]) {
  const render = () =>
    source === 'game-page'
      ? SaveGame({ slug: game.slug })
      : MyGamesPanel({
          games: [
            {
              ...game,
              searchNames: game.name,
              hub: '/games/elden-ring',
              hubJapanese: false,
            },
          ],
          locale: source.slice(-2) as 'ja' | 'en' | 'zh' | 'es',
        });
  const handler = () => {
    const control = find(render(), (node) => node.type === 'button');
    assert.ok(control, source);
    return control.props!.onClick as () => void;
  };
  reset();
  render();
  assert.equal(calls.length, 0, `${source}: render is not an addition`);
  const click = handler();
  click();
  assert.deepEqual(selected(), ['elden-ring']);
  assert.deepEqual(calls, [expected]);
  assert.equal(notifications, 1);
  click(); // Repeat the exact same callback; current storage wins over its snapshot.
  assert.deepEqual(selected(), []);
  assert.equal(calls.length, 1, `${source}: removal does not count`);
  click();
  assert.equal(calls.length, 2, `${source}: genuine re-addition counts`);
  render();
  assert.equal(calls.length, 2, `${source}: re-render does not count`);

  reset(['elden-ring', 'elden-ring']);
  handler()();
  assert.deepEqual(selected(), []);
  assert.equal(
    calls.length,
    0,
    `${source}: existing duplicate entries are not additions`,
  );

  reset();
  const stale = handler();
  values.set(MY_GAMES_KEY, '["another-game"]');
  stale();
  assert.deepEqual(selected(), ['another-game', 'elden-ring']);
  assert.equal(calls.length, 1, `${source}: another tab's selections survive`);
  reset();
  const staleUnchecked = handler();
  values.set(MY_GAMES_KEY, '["elden-ring"]');
  staleUnchecked();
  assert.deepEqual(selected(), []);
  assert.equal(
    calls.length,
    0,
    `${source}: stale unchecked UI must not count a removal`,
  );

  for (const blocked of [
    'get',
    'set',
    'corrupt-json',
    'corrupt-shape',
    'cap',
  ]) {
    reset();
    const act = handler();
    if (blocked === 'corrupt-json') values.set(MY_GAMES_KEY, 'not-json');
    else if (blocked === 'corrupt-shape')
      values.set(MY_GAMES_KEY, '["elden-ring",null]');
    else if (blocked === 'cap')
      values.set(
        MY_GAMES_KEY,
        JSON.stringify(Array.from({ length: 10 }, (_, i) => `other-${i}`)),
      );
    else failure = blocked;
    const before = values.get(MY_GAMES_KEY);
    assert.doesNotThrow(act);
    assert.equal(
      values.get(MY_GAMES_KEY),
      before,
      `${source}: ${blocked} preserves storage`,
    );
    assert.equal(calls.length, 0, `${source}: ${blocked} must not count`);
    assert.equal(notifications, 0);
  }
  for (const analytics of ['missing', 'throwing']) {
    reset();
    root.window.gtag =
      analytics === 'missing'
        ? undefined
        : () => {
            throw new Error('GA blocked');
          };
    assert.doesNotThrow(handler());
    assert.deepEqual(
      selected(),
      ['elden-ring'],
      `${source}: ${analytics} GA does not break saving`,
    );
    assert.equal(notifications, 1);
  }
  reset(['elden-ring']);
  root.__myGamesServerSnapshot = true;
  render();
  root.__myGamesServerSnapshot = false;
  render();
  assert.equal(
    calls.length,
    0,
    `${source}: existing selections never become synthetic additions`,
  );
}
console.log(
  'My Games real-handler checks passed for article and all four focused-page languages: add/remove/re-add, repeated callbacks, duplicates, stale storage, read/write failures, corrupt data, cap, unavailable GA, server snapshots, and existing selections.',
);

// Synthetic schedules only: the dashboard must distinguish each active state.
function nodeText(node: unknown): string {
  if (Array.isArray(node)) return node.map(nodeText).join('');
  if (node && typeof node === 'object') return nodeText((node as Node).props?.children);
  return typeof node === 'string' || typeof node === 'number' ? String(node) : '';
}
for (const [state, label] of [
  ['upcoming', '予定'], ['scheduled-window', '予定時間内'],
  ['ongoing', '実施中'], ['unconfirmed', '終了未確認'],
] as const) {
  reset([game.slug]);
  const tree = MyDashboard({ games: [{ ...game, maintenance: [{
    title: 'fixture maintenance', start: '2026-10-05T05:00:00Z',
    end: '2026-10-05T13:00:00Z', url: 'https://example.com/official-fixture', state,
  }] }] });
  assert.ok(nodeText(tree).includes(`メンテ（${label}）`));
  assert.ok(nodeText(tree).includes('予定：'));
  assert.equal(calls.length, 0, 'maintenance rendering does not track personal data');
}
reset([game.slug]);
assert.ok(!nodeText(MyDashboard({ games: [game] })).includes('メンテ（'));
console.log('PASS: dashboard maintenance labels, planned times, empty schedule, no new analytics');

// The legacy anchor now opens the same editor; rendering it never rewrites data.
reset([game.slug, 'previously-saved-game']);
const dashboardStorage = values.get(MY_GAMES_KEY);
const dashboard = MyDashboard({ games: [game] });
assert.ok(find(dashboard, (node) => node.props?.id === 'my-games'));
assert.ok(find(dashboard, (node) => node.type === 'a' && node.props?.href === '/my-games#my-games'));
assert.ok(!find(dashboard, (node) => node.type === 'input' && node.props?.type === 'checkbox'));
assert.equal(values.get(MY_GAMES_KEY), dashboardStorage);
assert.equal(calls.length, 0);
assert.equal(notifications, 0);
console.log('PASS: legacy My Games anchor routes to the shared search editor and preserves existing saved data.');
