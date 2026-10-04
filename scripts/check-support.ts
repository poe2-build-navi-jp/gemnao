import assert from 'node:assert/strict';
import {
  parseSolutions,
  serializeSolutions,
  upsertSolution,
  readSolutions,
  SOLUTIONS_KEY,
  type SavedSolution,
} from '../lib/saved-solutions';
import {
  recordAttempt,
  changeSupport,
  emptySupport,
} from '../lib/support-record';
import { defaultShareFields, supportSummary } from '../lib/support-summary';
import {
  matchingUpdates,
  markUpdatesRead,
  supportUpdates,
  type SupportUpdate,
} from '../lib/support-updates';
const values = new Map<string, string>();
const storage = {
  getItem: (k: string) => values.get(k) || null,
  setItem: (k: string, v: string) => {
    values.set(k, v);
  },
};
const old: SavedSolution = {
  id: 'legacy',
  title: 'SECRET NAME',
  gameSlug: 'elden-ring',
  status: 'unresolved',
  diagnosis: 'C:\\Users\\alice\\log.txt account: alice',
  settings: 'password: secret',
  notes: 'alice@example.com',
  articlePath: '/games/elden-ring/not-launching',
  stepId: '',
  completedSteps: ['old step'],
  createdAt: '2026-10-01T00:00:00Z',
  updatedAt: '2026-10-01T00:00:00Z',
};
upsertSolution(storage, old);
assert.deepEqual(parseSolutions(serializeSolutions([old])), [old]);
const attempt = {
  path: '/guide/no-game-audio',
  stepId: 'step-1',
  label: 'Check audio',
  result: 'unresolved' as const,
  at: '2026-10-04T00:00:00Z',
};
for (let i = 0; i < 5; i++) recordAttempt(storage, old.id, attempt);
assert.equal(readSolutions(storage)[0].support?.attempts.length, 1);
recordAttempt(storage, old.id, {
  ...attempt,
  path: old.articlePath,
  result: 'resolved',
});
assert.equal(readSolutions(storage)[0].support?.attempts.length, 2);
assert.equal(readSolutions(storage)[0].status, 'resolved');
changeSupport(storage, old.id, (current) => ({
  ...current,
  support: {
    ...(current.support || emptySupport()),
    reversions: [
      {
        id: 'r1',
        setting: 'Overlay',
        original: 'On',
        restore: 'Enable it',
        state: 'pending',
      },
    ],
  },
}));
assert.equal(
  parseSolutions(storage.getItem(SOLUTIONS_KEY))[0].support?.reversions[0]
    .state,
  'pending',
);
const before = storage.getItem(SOLUTIONS_KEY);
assert.throws(() =>
  recordAttempt(
    {
      getItem: storage.getItem,
      setItem() {
        throw new DOMException('full', 'QuotaExceededError');
      },
    },
    old.id,
    attempt,
  ),
);
assert.equal(storage.getItem(SOLUTIONS_KEY), before);
assert.throws(() =>
  parseSolutions(
    JSON.stringify({
      version: 1,
      items: [
        {
          ...old,
          support: {
            attempts: [{ ...attempt, path: 'https://evil.test' }],
            reversions: [],
            seenUpdates: [],
          },
        },
      ],
    }),
  ),
);
for (const lang of ['ja', 'en', 'zh', 'es'] as const) {
  const summary = supportSummary(
    old,
    defaultShareFields,
    lang,
    'Elden Ring',
    null,
  );
  assert.ok(!summary.includes('alice'));
  assert.ok(!summary.includes('SECRET'));
  assert.ok(!summary.includes('password'));
}
const english = supportSummary(
  old,
  { game: true, symptoms: true, pc: true, attempts: true, notes: true },
  'en',
  'Elden Ring',
  { gpu: 'rtx-3060', ramGb: 16, windows: 11 },
);
assert.match(english, /not automatically translated/);
assert.match(english, /RAM: 16 GB/);
assert.ok(!english.includes('alice'));
const update: SupportUpdate = {
  id: 'fixture-only',
  gameSlug: old.gameSlug,
  symptomPaths: [old.articlePath],
  kind: 'official',
  sourceUrl: 'https://example.test/evidence',
  verifiedOn: '2026-10-03',
  publishedAt: '2026-10-03',
  text: { ja: 'test', en: 'test', zh: 'test', es: 'test' },
};
const now = Date.parse('2026-10-04');
assert.deepEqual(supportUpdates, []);
assert.equal(matchingUpdates(old, [update], now).length, 1);
assert.equal(
  matchingUpdates({ ...old, status: 'resolved' }, [update], now).length,
  0,
);
assert.equal(
  matchingUpdates({ ...old, gameSlug: 'other' }, [update], now).length,
  0,
);
assert.equal(
  matchingUpdates({ ...old, articlePath: '/guide/other' }, [update], now)
    .length,
  0,
);
assert.equal(
  matchingUpdates(old, [{ ...update, verifiedOn: '2027-01-01' }], now).length,
  0,
);
assert.equal(
  matchingUpdates(
    { ...old, support: { ...emptySupport(), seenUpdates: [update.id] } },
    [update],
    now,
  ).length,
  0,
);
console.log(
  'PASS support: legacy round-trip, cross-article attempts, repeat writes, restore metadata, quota preservation, schema rejection, four-language privacy, honest English, evidence matching and empty feed',
);

markUpdatesRead(storage, [{ id: old.id, updates: [update.id] }]);
assert.deepEqual(readSolutions(storage)[0].support?.seenUpdates, [update.id]);
const readBefore = storage.getItem(SOLUTIONS_KEY);
assert.throws(() =>
  markUpdatesRead(
    {
      getItem: storage.getItem,
      setItem() {
        throw new Error('quota');
      },
    },
    [{ id: old.id, updates: ['another'] }],
  ),
);
assert.equal(storage.getItem(SOLUTIONS_KEY), readBefore);
