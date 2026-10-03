/* oxlint-disable react/rules-of-hooks -- The hook test branch runs only with the runner's shallow hook harness. */
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  MAX_READING_ITEMS,
  parseReadingList,
  readReadingList,
  readingListError,
  READING_LIST_KEY,
  removeReadingItem,
  safeReadingPath,
  saveReadingItem,
  type ReadingItem,
} from '../lib/reading-list';
import {
  announceReadingListChange,
  useReadingList,
} from '../components/use-reading-list';
import { MY_DATA_EVENT } from '../lib/saved-solutions';

const record: ReadingItem = {
  path: '/guide/no-game-audio',
  title: 'ゲームだけ音が出ない',
  savedAt: '2026-10-03T00:00:00.000Z',
};
const envelope = (items: unknown[]) => JSON.stringify({ version: 1, items });
const values = new Map<string, string>();
let writes = 0;
let failure = '';
const storage = {
  getItem(key: string) {
    if (failure === 'read') throw new DOMException('blocked', 'SecurityError');
    return values.get(key) ?? null;
  },
  setItem(key: string, value: string) {
    if (failure === 'write')
      throw new DOMException('full', 'QuotaExceededError');
    writes++;
    values.set(key, value);
  },
};
type HookHarness = {
  enabled: boolean;
  server?: boolean;
  store?: {
    subscribe: (callback: () => void) => () => void;
    client: () => unknown;
    server: () => unknown;
  };
};
const root = globalThis as unknown as {
  window: EventTarget & { localStorage: typeof storage };
  __readingListHookHarness?: HookHarness;
};

if (!root.__readingListHookHarness?.enabled) {
  const legacy = [
    ['gemnao-my-games', '["elden-ring"]'],
    ['gemnao-solutions-v1', 'private note'],
    ['gemnao-progress:elden-ring', 'existing progress'],
  ] as const;
  for (const [key, value] of legacy) values.set(key, value);
  assert.deepEqual(readReadingList(storage), []);
  assert.equal(writes, 0, 'reading an empty list never saves it');
  assert.equal(saveReadingItem(storage, record), true);
  const saved = readReadingList(storage);
  assert.equal(saved.length, 1);
  assert.equal(saved[0].path, record.path);
  assert.equal(saved[0].title, record.title);
  assert.equal(new Date(saved[0].savedAt).toISOString(), saved[0].savedAt);
  assert.deepEqual(parseReadingList(values.get(READING_LIST_KEY)!), saved);
  assert.deepEqual(
    readReadingList({ ...storage }),
    saved,
    'a fresh reader reloads',
  );
  const beforeDuplicate = values.get(READING_LIST_KEY);
  const previousWrites = writes;
  assert.equal(
    saveReadingItem(storage, { ...record, title: 'A newer title' }),
    false,
  );
  assert.equal(values.get(READING_LIST_KEY), beforeDuplicate);
  assert.equal(writes, previousWrites, 'duplicate add does not touch storage');

  // The component's old snapshot cannot overwrite a more recent mutation.
  const other = { path: '/pc/disk-usage-100', title: 'ディスク使用率100%' };
  const staleSave = () => saveReadingItem(storage, other);
  const acrossTabs = { ...record, path: '/discord/no-route' };
  values.set(READING_LIST_KEY, envelope([acrossTabs, ...saved]));
  assert.equal(staleSave(), true);
  assert.deepEqual(
    readReadingList(storage).map((item) => item.path),
    [other.path, acrossTabs.path, record.path],
  );
  assert.equal(removeReadingItem(storage, record.path), true);
  assert.deepEqual(
    readReadingList(storage).map((item) => item.path),
    [other.path, acrossTabs.path],
  );
  const beforeNoop = writes;
  assert.equal(removeReadingItem(storage, record.path), false);
  assert.equal(writes, beforeNoop, 'removing a missing item is a no-op');
  for (const [key, value] of legacy) assert.equal(values.get(key), value);

  const allowedPaths = [
    '/guide/no-game-audio',
    '/games/elden-ring/not-launching',
    '/pc/disk-usage-100',
    '/discord/no-route',
    '/en/guide/no-game-audio',
    '/en/games/elden-ring/not-launching',
    '/zh/pc/disk-usage-100',
    '/es/discord/no-route',
    '/gear/gaming-headset',
    '/en/gear/gaming-headset',
    '/tools/windows-diagnosis',
    '/en/tools/windows-diagnosis',
  ];
  for (const path of allowedPaths) {
    assert.equal(safeReadingPath(path), true, path);
    assert.deepEqual(parseReadingList(envelope([{ ...record, path }])), [
      { ...record, path },
    ]);
  }
  const hostilePaths = [
    '',
    '//evil.example/guide/no-game-audio',
    'https://evil.example/guide/no-game-audio',
    'https://gemnao.pages.dev/guide/no-game-audio',
    'javascript:alert(1)',
    '/guide/no-game-audio?email=private',
    '/guide/no-game-audio#private',
    '/guide/no-game-audio/',
    '/guide/no-game-audio\n',
    '/guide/../admin',
    '/guide/%2e%2e',
    '/guide/%2f%2fevil.example',
    '/guide/\\evil',
    '/guide/日本語',
    '/guide/a_b',
    '/guide/-audio',
    '/guide/audio-',
    '/guide/audio--missing',
    '/guide/a' + 'a'.repeat(300),
    '/games/elden-ring',
    '/my',
    '/admin',
    '/api/feedback',
    '/fr/guide/no-game-audio',
    '/en/en/guide/no-game-audio',
    '/zh/tools/windows-diagnosis',
    '/tools/another-tool',
  ];
  for (const path of hostilePaths) {
    assert.equal(safeReadingPath(path), false, JSON.stringify(path));
    const before = values.get(READING_LIST_KEY);
    assert.throws(() => saveReadingItem(storage, { ...record, path }));
    assert.throws(() => removeReadingItem(storage, path));
    assert.equal(values.get(READING_LIST_KEY), before);
  }

  const corruptValues = [
    '',
    'broken',
    'null',
    '[]',
    '{"version":2,"items":[]}',
    '{"version":1,"items":null}',
    envelope([record, record]),
    envelope(
      Array.from({ length: MAX_READING_ITEMS + 1 }, (_, i) => ({
        ...record,
        path: `/guide/article-${i}`,
      })),
    ),
    'a'.repeat(100_001),
    'あ'.repeat(33_334),
    ...[
      { title: '' },
      { title: '   ' },
      { title: 'a'.repeat(201) },
      { title: '\u0000private' },
      { title: 123 },
      { savedAt: 'not a date' },
      { savedAt: '2026-02-30T00:00:00.000Z' },
      { savedAt: '2026-10-03' },
      { savedAt: '2026-10-03T00:00:00.000+00:00' },
      { savedAt: 123 },
      ...hostilePaths.map((path) => ({ path })),
    ].map((patch) => envelope([{ ...record, ...patch }])),
  ];
  for (const raw of corruptValues) {
    assert.throws(() => parseReadingList(raw));
    values.set(READING_LIST_KEY, raw);
    const oldWrites: number = writes;
    assert.throws(() => saveReadingItem(storage, record));
    assert.throws(() => removeReadingItem(storage, record.path));
    assert.equal(values.get(READING_LIST_KEY), raw);
    assert.equal(writes, oldWrites, 'corrupt data is never replaced');
  }
  assert.deepEqual(
    parseReadingList(envelope([{ ...record, unexpected: 'discard' }])),
    [record],
  );

  const full = envelope(
    Array.from({ length: MAX_READING_ITEMS }, (_, i) => ({
      ...record,
      path: `/guide/article-${i}`,
    })),
  );
  values.set(READING_LIST_KEY, full);
  assert.throws(() => saveReadingItem(storage, record), /50件/);
  assert.equal(values.get(READING_LIST_KEY), full);
  assert.equal(
    saveReadingItem(storage, { ...record, path: '/guide/article-0' }),
    false,
  );
  assert.equal(values.get(READING_LIST_KEY), full);
  assert.equal(removeReadingItem(storage, '/guide/article-0'), true);
  assert.equal(saveReadingItem(storage, record), true);
  assert.equal(readReadingList(storage).length, MAX_READING_ITEMS);

  for (const blocked of ['read', 'write']) {
    values.set(READING_LIST_KEY, envelope([record]));
    const before = values.get(READING_LIST_KEY);
    failure = blocked;
    assert.throws(() => saveReadingItem(storage, other));
    assert.throws(() => removeReadingItem(storage, record.path));
    assert.equal(values.get(READING_LIST_KEY), before);
    failure = '';
  }
  assert.match(
    readingListError(new DOMException('secret', 'SecurityError')),
    /ブラウザ/,
  );
  assert.match(
    readingListError(new DOMException('secret', 'QuotaExceededError')),
    /空き容量/,
  );
  assert.ok(!readingListError(new Error('secret')).includes('secret'));
  assert.match(readingListError(new Error('blocked'), 'en'), /browser/);
  assert.match(readingListError(new Error('blocked'), 'zh'), /浏览器/);
  assert.match(readingListError(new Error('blocked'), 'es'), /navegador/);

  function Probe() {
    const { items, ready, error } = useReadingList();
    return <output>{JSON.stringify({ items, ready, error })}</output>;
  }
  assert.equal(typeof window, 'undefined');
  assert.doesNotThrow(announceReadingListChange);
  const html = renderToStaticMarkup(<Probe />);
  assert.match(html, /&quot;ready&quot;:false/);
  assert.match(html, /&quot;items&quot;:\[\]/);
  assert.ok(
    !html.includes(record.title),
    'SSR never includes private saved articles',
  );
  console.log(
    'Reading list storage checks passed: save/reload/remove, duplicate no-op, click-time reads, cap, corrupt-data preservation, hostile paths, blocked/quota storage, localized errors, and SSR.',
  );
} else {
  // The runner exposes real external-store callbacks with shallow hooks.
  // This exercises subscription wiring, not a substitute for browser hydration QA.
  const harness = root.__readingListHookHarness;
  const browser = new EventTarget() as typeof root.window;
  let denied = false;
  Object.defineProperty(browser, 'localStorage', {
    get() {
      if (denied) throw new DOMException('blocked', 'SecurityError');
      return storage;
    },
  });
  root.window = browser;
  assert.deepEqual(useReadingList(), { items: [], ready: true, error: '' });
  assert.ok(harness.store);
  const store = harness.store;
  assert.equal(store.client(), store.client(), 'empty snapshots are stable');
  assert.equal(store.server(), undefined);

  let notifications = 0;
  let latest = useReadingList();
  const unsubscribe = store.subscribe(() => {
    notifications++;
    latest = useReadingList();
  });
  assert.equal(saveReadingItem(storage, record), true);
  assert.equal(
    notifications,
    0,
    'save does not emit automatic/synthetic events',
  );
  announceReadingListChange();
  assert.equal(notifications, 1);
  assert.equal(latest.items[0].path, record.path);
  assert.equal(
    store.client(),
    store.client(),
    'persisted string snapshots are stable',
  );
  const storageEvent = (key: string | null, area: unknown = storage) => {
    browser.dispatchEvent(
      Object.assign(new Event('storage'), {
        key,
        storageArea: area,
      }),
    );
  };
  storageEvent('unrelated-key');
  assert.equal(notifications, 1);
  storageEvent(READING_LIST_KEY, {});
  assert.equal(notifications, 1, 'sessionStorage events are ignored');
  values.set(
    READING_LIST_KEY,
    envelope([{ ...record, path: '/discord/no-route' }]),
  );
  storageEvent(READING_LIST_KEY);
  assert.equal(notifications, 2);
  assert.equal(latest.items[0].path, '/discord/no-route');
  values.delete(READING_LIST_KEY);
  storageEvent(null);
  assert.equal(notifications, 3);
  assert.deepEqual(latest.items, []);
  values.set(READING_LIST_KEY, 'broken');
  browser.dispatchEvent(new Event(MY_DATA_EVENT));
  assert.match(latest.error, /上書きしていません/);
  assert.equal(latest.ready, true);
  assert.equal(values.get(READING_LIST_KEY), 'broken');
  denied = true;
  browser.dispatchEvent(new Event(MY_DATA_EVENT));
  assert.match(latest.error, /ブラウザ/);
  assert.equal(store.client(), store.client(), 'blocked snapshots are stable');
  assert.match(useReadingList('en').error, /browser/);
  denied = false;
  values.delete(READING_LIST_KEY);
  browser.dispatchEvent(new Event(MY_DATA_EVENT));
  assert.deepEqual(latest, { items: [], ready: true, error: '' });
  harness.server = true;
  assert.deepEqual(useReadingList(), { items: [], ready: false, error: '' });
  harness.server = false;
  unsubscribe();
  const beforeUnsubscribed = notifications;
  announceReadingListChange();
  storageEvent(READING_LIST_KEY);
  assert.equal(
    notifications,
    beforeUnsubscribed,
    'unmount cleans up both listeners',
  );
  console.log(
    'Reading list hook checks passed: stable snapshots, local notification, cross-tab update/clear, key and storage-area filtering, corruption, storage denial/recovery, server readiness, and cleanup.',
  );
}
