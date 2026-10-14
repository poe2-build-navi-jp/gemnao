import assert from 'node:assert/strict';
import {
  GAME_EXPERIMENTS_KEY,
  emptyExperiment,
  parseGameExperiments,
  saveGameExperiment,
  deleteGameExperiment,
  validMeasuredFps,
} from '../lib/game-experiments';
import {
  SETTINGS_SNAPSHOTS_KEY,
  saveSettingsSnapshot,
  deleteSettingsSnapshot,
  emptySettingsDraft,
} from '../lib/game-settings-snapshots';
import { freshLocal, saveLocal, readLocal } from '../lib/diagnosis/local';
const values = new Map<string, string>();
const storage = {
  getItem: (k: string) => values.get(k) ?? null,
  setItem: (k: string, v: string) => {
    values.set(k, v);
  },
};
Object.defineProperty(globalThis, 'localStorage', {
  value: storage,
  configurable: true,
});
const now = new Date('2026-10-14T12:00:00Z');
values.set('gemnao-my-games', '["apex-legends"]');
values.set('gemnao-my-pc', 'legacy pc');
values.set('gemnao-solutions-v1', 'legacy note bytes');
values.set('gemnao-official-changes-read-v1', '{"version":1,"read":[]}');
assert(saveLocal({ ...freshLocal(), game: 'apex-legends' }));
const legacy = new Map(values);
const before = saveSettingsSnapshot(
  storage,
  'apex-legends',
  {
    ...emptySettingsDraft(),
    name: 'Before',
    resolution: '1920x1080',
    memo: 'PRIVATE_SENTINEL',
    comfortable: true,
  },
  'snapshot-before',
  now,
);
const after = saveSettingsSnapshot(
  storage,
  'apex-legends',
  { ...emptySettingsDraft(), name: 'After', preset: 'High' },
  'snapshot-after',
  now,
);
saveSettingsSnapshot(
  storage,
  'pubg',
  { ...emptySettingsDraft(), preset: 'Low' },
  'other-game',
  now,
);
const draft = {
  ...emptyExperiment(),
  changed: 'Preset',
  purpose: 'Image quality',
  beforeId: before.id,
  afterId: after.id,
  fpsBefore: '',
  fpsAfter: '0',
  performedOn: '2026-10-13',
  result: 'My own impressions',
  decision: 'revert' as const,
};
const sourceBytes = storage.getItem(SETTINGS_SNAPSHOTS_KEY);
const saved = saveGameExperiment(
  storage,
  'apex-legends',
  draft,
  'experiment-1',
  now,
);
assert.equal(saved.fpsBefore, '');
assert.equal(saved.fpsAfter, '0');
assert.equal(saved.decision, 'revert');
assert.deepEqual(saved.before, before);
assert.equal(
  storage.getItem(SETTINGS_SNAPSHOTS_KEY),
  sourceBytes,
  'decision does not change original settings',
);
const logBytes = storage.getItem(GAME_EXPERIMENTS_KEY);
deleteSettingsSnapshot(storage, before.id, 'apex-legends');
assert.equal(storage.getItem(GAME_EXPERIMENTS_KEY), logBytes);
assert.equal(
  parseGameExperiments(logBytes)[0].before?.memo,
  'PRIVATE_SENTINEL',
);
assert.throws(() =>
  saveGameExperiment(storage, 'apex-legends', draft, 'stale-ref', now),
);
assert.equal(storage.getItem(GAME_EXPERIMENTS_KEY), logBytes);
assert.throws(() =>
  saveGameExperiment(
    storage,
    'apex-legends',
    { ...draft, beforeId: 'other-game' },
    'wrong-ref',
    now,
  ),
);
// Corrupt original snapshot data cannot destroy already captured values.
values.set(SETTINGS_SNAPSHOTS_KEY, 'broken');
assert.equal(parseGameExperiments(logBytes)[0].before?.resolution, '1920x1080');
assert.throws(() =>
  saveGameExperiment(storage, 'apex-legends', draft, 'corrupt-ref', now),
);
assert.equal(storage.getItem(SETTINGS_SNAPSHOTS_KEY), 'broken');
const plain = { ...emptyExperiment(), result: 'Subjective only' };
const noRef = saveGameExperiment(
  storage,
  'apex-legends',
  plain,
  'no-reference',
  now,
);
assert.equal(noRef.before, null);
assert.equal(noRef.after, null);
assert.equal(noRef.performedOn, '');
assert.equal(noRef.decision, 'pending');
assert.equal(storage.getItem(SETTINGS_SNAPSHOTS_KEY), 'broken');
for (const value of ['', '0', '0.0', '60', '60.25', '99999.99'])
  assert(validMeasuredFps(value));
for (const value of [
  '-1',
  'NaN',
  'Infinity',
  '1e3',
  '100000',
  '60.001',
  0,
  null,
  [],
])
  assert(!validMeasuredFps(value));
for (const bad of [
  { fpsBefore: 'NaN' },
  { fpsAfter: '-1' },
  { performedOn: '2026-02-30' },
  { performedOn: '2026-10-15' },
  { changed: 'x'.repeat(201) },
  { result: 'x'.repeat(2001) },
])
  assert.throws(() =>
    saveGameExperiment(
      storage,
      'apex-legends',
      { ...plain, ...bad },
      'invalid',
      now,
    ),
  );
assert.throws(() =>
  saveGameExperiment(storage, 'apex-legends', emptyExperiment(), 'empty', now),
);
assert.throws(
  () => saveGameExperiment(storage, 'apex-legends', plain, 'no-reference', now),
  'cannot rewrite history by ID',
);
const validBytes = storage.getItem(GAME_EXPERIMENTS_KEY);
const blocked = {
  ...storage,
  setItem: () => {
    throw new Error('quota');
  },
};
assert.throws(() =>
  saveGameExperiment(blocked, 'apex-legends', plain, 'quota', now),
);
assert.throws(() =>
  deleteGameExperiment(blocked, 'experiment-1', 'apex-legends'),
);
assert.throws(() =>
  saveGameExperiment(
    {
      ...storage,
      getItem: () => {
        throw new Error('blocked read');
      },
    },
    'apex-legends',
    plain,
    'blocked',
    now,
  ),
);
assert.equal(storage.getItem(GAME_EXPERIMENTS_KEY), validBytes);
assert.throws(() => deleteGameExperiment(storage, 'experiment-1', 'pubg'));
for (const bad of [
  '',
  '{',
  'null',
  '{"version":2,"items":[]}',
  JSON.stringify({ version: 1, items: [{ ...saved, decision: ['pending'] }] }),
  JSON.stringify({
    version: 1,
    items: [{ ...saved, before: { ...before, gameSlug: 'pubg' } }],
  }),
  JSON.stringify({ version: 1, items: [saved, saved] }),
]) {
  values.set(GAME_EXPERIMENTS_KEY, bad);
  assert.throws(() =>
    saveGameExperiment(storage, 'apex-legends', plain, 'bad-save', now),
  );
  assert.throws(() =>
    deleteGameExperiment(storage, 'experiment-1', 'apex-legends'),
  );
  assert.equal(storage.getItem(GAME_EXPERIMENTS_KEY), bad);
}
// Read copies strip unknown fields and never return aliases to source objects.
const polluted = JSON.stringify({
  version: 1,
  items: [
    { ...saved, extra: 'discard', before: { ...before, extra: 'discard' } },
  ],
});
const clean = parseGameExperiments(polluted)[0];
assert(!('extra' in clean));
assert(!('extra' in clean.before!));
values.set(GAME_EXPERIMENTS_KEY, logBytes!);
deleteGameExperiment(storage, 'experiment-1', 'apex-legends');
assert.deepEqual(
  parseGameExperiments(storage.getItem(GAME_EXPERIMENTS_KEY)),
  [],
);
for (let i = 0; i < 20; i++)
  saveGameExperiment(storage, 'apex-legends', plain, `limit-${i}`, now);
assert.throws(() =>
  saveGameExperiment(storage, 'apex-legends', plain, 'limit-extra', now),
);
saveGameExperiment(storage, 'pubg', plain, 'pubg-allowed', now);
for (const [k, v] of legacy)
  assert.equal(storage.getItem(k), v, 'old keys untouched');
assert.equal(readLocal()?.game, 'apex-legends');
console.log(
  'PASS experiments: immutable captured references survive deletion/corruption; optional data, unmeasured/zero, date/size limits; cross-game guards, unknown schemas, quota/read failures, no source or legacy writes, diagnosis resume',
);
