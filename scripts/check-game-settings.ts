import assert from 'node:assert/strict';
import {
  parseSettingsSnapshots,
  saveSettingsSnapshot,
  deleteSettingsSnapshot,
  settingsDifferences,
  copySettingsNote,
  SETTINGS_SNAPSHOTS_KEY,
  emptySettingsDraft,
  isCalendarDate,
  localDay,
} from '../lib/game-settings-snapshots';
import { freshLocal, readLocal, saveLocal } from '../lib/diagnosis/local';
import {
  upsertSolution,
  readSolutions,
  SOLUTIONS_KEY,
  type SavedSolution,
} from '../lib/saved-solutions';
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
const note: SavedSolution = {
  id: 'legacy-note',
  gameSlug: 'apex-legends',
  title: 'Legacy note',
  diagnosis: 'prior diagnosis',
  settings: '1920 × 1080\nLegacy preset',
  notes: 'private note',
  articlePath: '',
  stepId: '',
  completedSteps: [],
  status: 'unresolved',
  createdAt: now.toISOString(),
  updatedAt: now.toISOString(),
  support: {
    attempts: [],
    seenUpdates: ['old'],
    reversions: [
      {
        id: 'r1',
        setting: 'Overlay',
        original: 'On',
        restore: 'Enable manually',
        state: 'pending',
      },
    ],
  },
};
upsertSolution(storage, note);
assert(saveLocal({ ...freshLocal(), game: 'apex-legends' }));
values.set('gemnao-my-games', '["apex-legends"]');
values.set('gemnao-my-pc', 'legacy-pc');
values.set(
  'gemnao-official-changes-read-v1',
  '{"version":1,"read":["apex-javelin-20260929-v1"]}',
);
const legacy = new Map(values);
const empty = emptySettingsDraft();
assert.deepEqual(parseSettingsSnapshots(null), []);
assert.throws(() =>
  saveSettingsSnapshot(storage, 'apex-legends', empty, 's1', now),
);
const copied = copySettingsNote(
  { ...empty, memo: 'My draft' },
  note,
  'apex-legends',
);
assert.equal(copied.memo, 'My draft\n\n' + note.settings);
assert.equal(copied.resolution, '');
assert.equal(copied.sourceNoteId, note.id);
assert.throws(() => copySettingsNote(empty, note, 'pubg'));
assert.throws(() =>
  copySettingsNote({ ...empty, memo: 'x'.repeat(4000) }, note, 'apex-legends'),
);
const first = saveSettingsSnapshot(
  storage,
  'apex-legends',
  {
    ...copied,
    resolution: '1920x1080',
    fpsLimit: '',
    checkedOn: '2026-10-13',
    comfortable: true,
  },
  'first',
  now,
);
const second = saveSettingsSnapshot(
  storage,
  'apex-legends',
  {
    ...empty,
    resolution: '2560x1440',
    fpsLimit: '0',
    controller: 'custom',
    memo: 'x'.repeat(4000),
  },
  'second',
  now,
);
const other = saveSettingsSnapshot(
  storage,
  'pubg',
  { ...empty, preset: 'Medium' },
  'other',
  now,
);
assert.equal(first.comfortable, true);
assert.equal(second.comfortable, false);
assert.equal(second.checkedOn, '');
const rows = settingsDifferences(first, second);
assert.deepEqual(
  rows.find((r) => r.field === 'fpsLimit'),
  { field: 'fpsLimit', left: '', right: '0', changed: true },
);
assert.throws(() => settingsDifferences(first, other));
assert.throws(
  () =>
    saveSettingsSnapshot(
      storage,
      'apex-legends',
      { ...empty, memo: 'x' },
      'first',
      now,
    ),
  'immutable IDs',
);
for (const checkedOn of ['2026-02-30', '2026-10-15', 'bad'])
  assert.throws(() =>
    saveSettingsSnapshot(
      storage,
      'apex-legends',
      { ...empty, preset: 'low', checkedOn },
      'invalid-date',
      now,
    ),
  );
assert.equal(isCalendarDate('2024-02-29'), true);
assert.equal(localDay(new Date(2026, 9, 14)), '2026-10-14');
assert.throws(() =>
  saveSettingsSnapshot(
    storage,
    'apex-legends',
    { ...empty, controller: 'x'.repeat(201) },
    'long',
    now,
  ),
);
assert.throws(() =>
  saveSettingsSnapshot(
    storage,
    'apex-legends',
    { ...empty, memo: 'x'.repeat(4001) },
    'long',
    now,
  ),
);
const bytes = storage.getItem(SETTINGS_SNAPSHOTS_KEY);
const blocked = {
  ...storage,
  setItem: () => {
    throw new Error('quota');
  },
};
assert.throws(() =>
  saveSettingsSnapshot(
    blocked,
    'apex-legends',
    { ...empty, preset: 'low' },
    'quota',
    now,
  ),
);
assert.throws(() => deleteSettingsSnapshot(blocked, 'first', 'apex-legends'));
assert.equal(storage.getItem(SETTINGS_SNAPSHOTS_KEY), bytes);
assert.throws(() => deleteSettingsSnapshot(storage, 'first', 'pubg'));
deleteSettingsSnapshot(storage, 'first', 'apex-legends');
assert.equal(
  parseSettingsSnapshots(storage.getItem(SETTINGS_SNAPSHOTS_KEY)).length,
  2,
);
assert.equal(
  parseSettingsSnapshots(storage.getItem(SETTINGS_SNAPSHOTS_KEY)).find(
    (s) => s.id === 'other',
  )?.gameSlug,
  'pubg',
);
for (const [k, v] of legacy)
  assert.equal(storage.getItem(k), v, 'old keys unchanged');
assert.deepEqual(readSolutions(storage)[0], note);
assert.equal(readLocal()?.game, 'apex-legends');
for (const bad of [
  '',
  '{',
  'null',
  '{"version":2,"items":[]}',
  '{"version":1,"items":[{}]}',
  JSON.stringify({ version: 1, items: [second, second] }),
]) {
  values.set(SETTINGS_SNAPSHOTS_KEY, bad);
  assert.throws(() =>
    saveSettingsSnapshot(
      storage,
      'pubg',
      { ...empty, memo: 'safe' },
      'save',
      now,
    ),
  );
  assert.equal(storage.getItem(SETTINGS_SNAPSHOTS_KEY), bad);
}
values.delete(SETTINGS_SNAPSHOTS_KEY);
for (let i = 0; i < 10; i++)
  saveSettingsSnapshot(
    storage,
    'apex-legends',
    { ...empty, preset: String(i) },
    `limit-${i}`,
    now,
  );
assert.throws(() =>
  saveSettingsSnapshot(
    storage,
    'apex-legends',
    { ...empty, preset: 'Extra' },
    'limit-extra',
    now,
  ),
);
saveSettingsSnapshot(
  storage,
  'pubg',
  { ...empty, preset: 'allowed' },
  'pubg-allowed',
  now,
);
assert.equal(
  parseSettingsSnapshots(storage.getItem(SETTINGS_SNAPSHOTS_KEY)).length,
  11,
);
assert.equal(storage.getItem(SOLUTIONS_KEY), legacy.get(SOLUTIONS_KEY));
console.log(
  'PASS: immutable per-game snapshots, blanks vs zero, dates/limits, legacy copy without migration, comparisons, delete isolation, quota/corruption preservation, existing notes and diagnosis resume',
);
