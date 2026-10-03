import assert from 'node:assert/strict';
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
  location: { pathname: string };
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
root.location = { pathname: '/my' };
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
};
for (const source of ['game-page', 'my-page']) {
  const render = () =>
    source === 'game-page'
      ? SaveGame({ slug: game.slug })
      : MyDashboard({ games: [game] });
  const handler = () => {
    const control = find(render(), (node) =>
      source === 'game-page'
        ? node.type === 'button'
        : node.type === 'input' && node.props?.type === 'checkbox',
    );
    assert.ok(control, source);
    return control.props![
      source === 'game-page' ? 'onClick' : 'onChange'
    ] as () => void;
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
  'My Games real-handler checks passed for both entry points: add/remove/re-add, repeated callbacks, duplicates, stale storage, read/write failures, corrupt data, cap, unavailable GA, server snapshots, and existing selections.',
);
