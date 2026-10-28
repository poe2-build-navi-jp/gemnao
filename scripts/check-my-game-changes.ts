import { freshLocal, saveLocal, readLocal } from '../lib/diagnosis/local';
import assert from 'node:assert/strict';
import {
  changesForGame,
  officialGameChanges,
  validChangeDate,
} from '../lib/my-game-changes';
import {
  CHANGES_READ_KEY,
  parseReadChanges,
  setChangeRead,
} from '../lib/my-game-changes-read';
import { myGamesData } from '../lib/my-games-data';
for (const locale of ['ja', 'en', 'zh', 'es'] as const) {
  const games = myGamesData(locale);
  for (const slug of ['apex-legends', 'pubg']) {
    const cards = changesForGame(slug, locale, '2026-10-14');
    assert.equal(cards.length, 1);
    assert.equal(cards[0].copyLocale, locale);
    assert.equal(
      cards[0].articleHref,
      `${locale === 'ja' ? '' : '/' + locale}${cards[0].articlePath}`,
    );
    assert.equal(
      games.find((g) => g.slug === slug)?.officialChanges?.length,
      1,
    );
  }
  assert.deepEqual(changesForGame('unknown', locale), []);
}
assert.equal(changesForGame('apex-legends', 'ja', '2026-10-13').length, 0);
assert.equal(validChangeDate('2026-02-30'), false);
assert.equal(validChangeDate('2026-2-01'), false);
assert.equal(validChangeDate('2024-02-29'), true);
const original = officialGameChanges.find(
  (item) => item.gameSlug === 'apex-legends',
)!;
for (const bad of [
  { publishedOn: '2026-02-30' },
  { checkedOn: '2026-09-01' },
  { sourceUrl: 'javascript:bad' },
]) {
  assert.equal(
    changesForGame(original.gameSlug, 'ja', '2026-10-14', [
      { ...original, ...bad },
    ]).length,
    0,
  );
}
assert.deepEqual(
  changesForGame('apex-legends', 'en', '2026-10-14', [
    { ...original, copy: {} },
  ]),
  [],
);
const fallback = changesForGame('apex-legends', 'en', '2026-10-14', [
  { ...original, copy: { ja: original.copy.ja } },
]);
assert.equal(fallback[0].copyLocale, 'ja');
assert.deepEqual(changesForGame('apex-legends', 'ja', '2026-10-14', []), []);
// A new key is the only mutation, including when old user data is not a known schema.
const values = new Map([
  ['gemnao-my-games', '["apex-legends","unknown"]'],
  ['gemnao-my-pc', 'legacy pc'],
  ['gemnao-solutions-v1', 'legacy notes'],
  ['gemnao-diagnosis-v1', 'legacy diagnosis'],
]);
const originalValues = new Map(values);
const storage = {
  getItem: (key: string) => values.get(key) ?? null,
  setItem: (key: string, value: string) => {
    values.set(key, value);
  },
};
assert.deepEqual(parseReadChanges(null), { version: 1, read: [] });
setChangeRead(storage, original.id, true);
setChangeRead(storage, officialGameChanges[1].id, true);
assert.equal(
  parseReadChanges(storage.getItem(CHANGES_READ_KEY)).read.length,
  2,
);
setChangeRead(storage, original.id, false);
assert.deepEqual(parseReadChanges(storage.getItem(CHANGES_READ_KEY)).read, [
  officialGameChanges[1].id,
]);
for (const [key, value] of originalValues) assert.equal(values.get(key), value);
for (const bad of [
  '{',
  'null',
  '',
  '{"version":2,"read":[]}',
  '{"version":1,"read":[42]}',
]) {
  values.set(CHANGES_READ_KEY, bad);
  assert.throws(() => setChangeRead(storage, original.id, true));
  assert.equal(values.get(CHANGES_READ_KEY), bad);
}
values.delete(CHANGES_READ_KEY);
assert.throws(() =>
  setChangeRead(
    {
      ...storage,
      setItem: () => {
        throw new Error('quota');
      },
    },
    original.id,
    true,
  ),
);
assert.equal(values.has(CHANGES_READ_KEY), false);
assert.throws(() =>
  setChangeRead(
    {
      ...storage,
      getItem: () => {
        throw new Error('blocked');
      },
    },
    original.id,
    true,
  ),
);
assert.deepEqual(
  parseReadChanges('{"version":1,"read":["retired-card-v1"]}').read,
  ['retired-card-v1'],
);
console.log(
  'PASS: official change locales, dates, missing data/fallback, read state, failed storage and legacy key isolation',
);

// A real current diagnosis draft remains resumable after new read-state writes.
Object.defineProperty(globalThis, 'localStorage', {
  value: storage,
  configurable: true,
});
const diagnosis = { ...freshLocal(), game: 'apex-legends' };
assert.equal(saveLocal(diagnosis), true);
const diagnosisBytes = storage.getItem('gemnao-diagnosis-v1');
setChangeRead(storage, original.id, true);
assert.equal(storage.getItem('gemnao-diagnosis-v1'), diagnosisBytes);
assert.equal(readLocal()?.game, 'apex-legends');
assert.equal(readLocal()?.step, 'safety');
console.log('PASS: current diagnosis save/resume remains intact');

for (const game of ['enshrouded', 'planet-zoo-2', 'battlefield-6']) {
  for (const locale of ['ja', 'en', 'zh', 'es'] as const) {
    const [card] = changesForGame(game, locale, '2026-10-24');
    assert.ok(card);
    assert.equal(card.sourceLanguage, 'en');
    assert.equal(card.checkedOn, '2026-10-24');
    assert.equal(card.copyLocale, locale === 'en' ? 'en' : 'ja');
    assert.equal(card.articleJapanese, locale === 'zh' || locale === 'es');
    assert.ok(
      card.copy.condition &&
        card.copy.check &&
        card.sourceUrl.startsWith('https://'),
    );
  }
}
console.log(
  'PASS: three reviewed update cards, JA/EN copy and explicit JA fallback for ZH/ES; dated source conditions retained.',
);

// Saved articles reuse the reviewed registry, with independent enrollment/read state.
const { initializeSavedChanges, savedArticleChanges, SAVED_CHANGES_KEY } =
  await import('../lib/saved-article-changes');
const savedMemory = new Map<string, string>([
  ['gemnao-my-games', '["apex-legends"]'],
  ['gemnao-diagnosis-v1', 'preserve-diagnosis'],
]);
const savedStorage = {
  getItem: (k: string) => savedMemory.get(k) ?? null,
  setItem: (k: string, v: string) => {
    savedMemory.set(k, v);
  },
};
initializeSavedChanges(savedStorage);
assert.deepEqual(
  parseReadChanges(savedStorage.getItem(SAVED_CHANGES_KEY)).read,
  officialGameChanges.map((c) => c.id),
  'initial records are not new',
);
const baseline = savedStorage.getItem(SAVED_CHANGES_KEY);
initializeSavedChanges(savedStorage);
assert.equal(
  savedStorage.getItem(SAVED_CHANGES_KEY),
  baseline,
  'unchanged revisit preserves state',
);
const book = {
  path: '/en/games/apex-legends/javelin-launch-error',
  title: 'Saved guide',
  savedAt: '2026-10-01T00:00:00.000Z',
};
const matched = savedArticleChanges([book], 'en');
assert.equal(matched.length, 1);
assert.equal(matched[0].articleHref, book.path);
assert.equal(
  savedArticleChanges([{ ...book, path: '/games/apex-legends/fps' }], 'ja')
    .length,
  0,
  'same game is not sufficient',
);
setChangeRead(savedStorage, matched[0].id, false, SAVED_CHANGES_KEY);
initializeSavedChanges(savedStorage);
assert(
  !parseReadChanges(savedStorage.getItem(SAVED_CHANGES_KEY)).read.includes(
    matched[0].id,
  ),
  'revisit does not re-enroll',
);
assert.equal(
  savedArticleChanges([], 'ja').length,
  0,
  'removing saves removes cards',
);
assert.equal(
  savedArticleChanges([book], 'ja').length,
  1,
  're-add shows the record',
);
assert(
  !parseReadChanges(savedStorage.getItem(SAVED_CHANGES_KEY)).read.includes(
    matched[0].id,
  ),
  're-add preserves unread',
);
setChangeRead(savedStorage, matched[0].id, true, SAVED_CHANGES_KEY);
assert(
  parseReadChanges(savedStorage.getItem(SAVED_CHANGES_KEY)).read.includes(
    matched[0].id,
  ),
);
assert(
  !parseReadChanges(savedStorage.getItem(SAVED_CHANGES_KEY)).read.includes(
    'future-reviewed-revision',
  ),
  'new revision is unread',
);
assert.equal(savedStorage.getItem('gemnao-my-games'), '["apex-legends"]');
assert.equal(savedStorage.getItem('gemnao-diagnosis-v1'), 'preserve-diagnosis');
assert.equal(
  savedStorage.getItem(CHANGES_READ_KEY),
  null,
  'My Games read state untouched',
);
savedStorage.setItem(SAVED_CHANGES_KEY, '{"version":2,"read":[]}');
assert.throws(() => initializeSavedChanges(savedStorage));
assert.equal(
  savedStorage.getItem(SAVED_CHANGES_KEY),
  '{"version":2,"read":[]}',
);
console.log(
  'Saved article changes: enrollment, exact path, revisit, mark read, removal/re-add and preservation passed',
);
