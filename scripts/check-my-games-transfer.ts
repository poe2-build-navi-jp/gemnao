import assert from 'node:assert/strict';
import {
  exportMyGames,
  parseMyGamesBackup,
  previewMyGamesRestore,
  restoreMyGames,
  recoverMyGames,
  exportRecovery,
  parseRecoveryRecords,
  BACKUP_RECOVERY_KEY,
  BACKUP_MAX_BYTES,
  backupKeys,
  BackupError,
} from '../lib/my-games-backup';
import { nextGameAction } from '../lib/my-game-next';
import { parseRegisteredGames } from '../lib/my-games-selection';
import { settingsShareText } from '../lib/settings-share';
import {
  saveSettingsSnapshot,
  emptySettingsDraft,
  deleteSettingsSnapshot,
  parseSettingsSnapshots,
  SETTINGS_SNAPSHOTS_KEY,
} from '../lib/game-settings-snapshots';
import { saveGameExperiment, emptyExperiment } from '../lib/game-experiments';
import {
  savePlayPlan,
  emptyPlayDraft,
  PLAY_PLANS_KEY,
  parsePlayPlans,
  saveTodayChoice,
} from '../lib/play-plans';
import {
  changePlayTask,
  saveTrouble,
  PLAY_ACTIVITY_KEY,
} from '../lib/play-activity';
import { SOLUTIONS_KEY, type SavedSolution } from '../lib/saved-solutions';
import { MY_GAMES_KEY, MY_PC_KEY } from '../lib/my-pc';
function memory() {
  const values = new Map<string, string>();
  return {
    values,
    getItem: (k: string) => values.get(k) ?? null,
    setItem: (k: string, v: string) => {
      values.set(k, v);
    },
    removeItem: (k: string) => {
      values.delete(k);
    },
  };
}
function fails(code: string, fn: () => unknown) {
  assert.throws(fn, (e) => e instanceof BackupError && e.code === code);
}
const source = memory();
source.setItem(MY_GAMES_KEY, '["apex-legends","valorant"]');
source.setItem(MY_PC_KEY, '{"gpu":"rtx-3060","ramGb":16,"windows":11}');
const note: SavedSolution = {
  id: 'note-1',
  title: 'Original case',
  gameSlug: 'apex-legends',
  status: 'unresolved',
  diagnosis: 'Recorded',
  settings: 'Low',
  notes: 'PRIVATE_NOTE',
  articlePath: '/games/apex-legends/javelin-launch-error',
  stepId: 'update-restart',
  completedSteps: [],
  createdAt: '2026-10-14T00:00:00Z',
  updatedAt: '2026-10-14T00:00:00Z',
  support: {
    attempts: [
      {
        path: '/games/apex-legends/javelin-launch-error',
        stepId: 'update-restart',
        label: 'Restart',
        result: 'unresolved',
        at: '2026-10-14T00:00:00Z',
      },
    ],
    reversions: [],
    seenUpdates: [],
  },
};
source.setItem(SOLUTIONS_KEY, JSON.stringify({ version: 1, items: [note] }));
const snapshot = saveSettingsSnapshot(
  source,
  'apex-legends',
  {
    ...emptySettingsDraft(),
    name: 'Stable',
    resolution: '2560x1440',
    preset: 'Low',
    fpsLimit: '0',
    memo: 'PRIVATE_MEMO',
    sourceNoteId: note.id,
    checkedOn: '2026-10-14',
  },
  'snapshot-1',
);
const deleted = saveSettingsSnapshot(
  source,
  'apex-legends',
  { ...emptySettingsDraft(), name: 'Deleted source', resolution: '1920x1080' },
  'snapshot-2',
);
saveGameExperiment(
  source,
  'apex-legends',
  {
    ...emptyExperiment(),
    changed: 'Resolution',
    beforeId: snapshot.id,
    afterId: deleted.id,
    result: 'PRIVATE_EXPERIMENT',
  },
  'experiment-1',
);
deleteSettingsSnapshot(source, deleted.id, 'apex-legends');
const plan = savePlayPlan(
  source,
  'apex-legends',
  {
    ...emptyPlayDraft(),
    progress: 'PRIVATE_PROGRESS',
    next: 'Next quest',
    snapshotId: snapshot.id,
    guideUrl: 'https://example.com/guide',
    minutes: '30',
    company: 'either',
    prepared: 'yes',
  },
  0,
);
let activity = changePlayTask(
  source,
  'apex-legends',
  { kind: 'add', id: 'task-1', text: 'PRIVATE_TASK' },
  0,
);
activity = changePlayTask(
  source,
  'apex-legends',
  { kind: 'toggle', id: 'task-1' },
  activity.revision,
);
activity = changePlayTask(
  source,
  'apex-legends',
  { kind: 'delete', id: 'task-1' },
  activity.revision,
);
saveTrouble(
  source,
  'apex-legends',
  { tried: 'PRIVATE_TRIED', nextFix: 'Record code', noteId: note.id },
  activity.revision,
);
source.setItem(
  'gemnao-official-changes-read-v1',
  '{"version":1,"read":["apex-javelin-20260929-v1"]}',
);
saveTodayChoice(source, { minutes: '45', company: 'solo' });
source.setItem('auth-secret', 'DO_NOT_TRANSFER');
source.setItem('gemnao-diagnosis-v1', 'DO_NOT_TRANSFER_DIAGNOSIS');
const raw = exportMyGames(source);
assert(!raw.includes('DO_NOT_TRANSFER'));
const original = parseMyGamesBackup(raw).data;
const target = memory();
target.setItem('auth-secret', 'PRESERVE_AUTH');
const preview = previewMyGamesRestore(target, raw);
assert.equal(preview.rows.find((r) => r.category === 'plans')?.added, 1);
assert.equal(target.getItem(PLAY_PLANS_KEY), null);
restoreMyGames(target, preview);
assert.deepEqual(parseMyGamesBackup(exportMyGames(target)).data, original);
assert.equal(target.getItem('auth-secret'), 'PRESERVE_AUTH');
assert.equal(target.getItem(BACKUP_RECOVERY_KEY), null);
const once = new Map(target.values);
const repeat = previewMyGamesRestore(target, raw);
assert(repeat.rows.every((r) => !r.added && !r.conflict));
restoreMyGames(target, repeat);
assert.deepEqual(target.values, once);
const legacy = memory();
legacy.setItem(MY_GAMES_KEY, '["pubg"]');
const legacyPreview = previewMyGamesRestore(
  legacy,
  JSON.stringify({ version: 1, items: [note] }),
);
assert(legacyPreview.legacy);
restoreMyGames(legacy, legacyPreview);
assert.equal(legacy.getItem(MY_GAMES_KEY), '["pubg"]');
assert.equal(JSON.parse(legacy.getItem(SOLUTIONS_KEY)!).items.length, 1);
const conflict = memory();
conflict.setItem(
  SOLUTIONS_KEY,
  JSON.stringify({ version: 1, items: [{ ...note, notes: 'Current wins' }] }),
);
conflict.setItem(
  SETTINGS_SNAPSHOTS_KEY,
  JSON.stringify({
    version: 1,
    items: [{ ...snapshot, resolution: '3840x2160' }],
  }),
);
const conflicting = previewMyGamesRestore(conflict, raw);
assert.equal(
  conflicting.rows.find((r) => r.category === 'snapshots')?.conflict,
  1,
);
restoreMyGames(conflict, conflicting);
assert.equal(
  parseSettingsSnapshots(conflict.getItem(SETTINGS_SNAPSHOTS_KEY))[0]
    .resolution,
  '3840x2160',
);
const captured = parsePlayPlans(conflict.getItem(PLAY_PLANS_KEY))[0].snapshot!;
assert.notEqual(captured.id, snapshot.id);
assert.equal(captured.resolution, '2560x1440');
assert.notEqual(captured.sourceNoteId, note.id);
assert.notEqual(
  JSON.parse(conflict.getItem(PLAY_ACTIVITY_KEY)!).items[0].noteId,
  note.id,
);
const conflictBefore = new Map(conflict.values);
const conflictAgain = previewMyGamesRestore(conflict, raw);
assert(conflictAgain.rows.every((r) => !r.added));
restoreMyGames(conflict, conflictAgain);
assert.deepEqual(conflict.values, conflictBefore);
const competing = previewMyGamesRestore(target, raw);
target.setItem(MY_GAMES_KEY, '["pubg"]');
fails('changed', () => restoreMyGames(target, competing));
assert.equal(target.getItem(MY_GAMES_KEY), '["pubg"]');
assert.equal(target.getItem(BACKUP_RECOVERY_KEY), null);
const invalids = [
  '',
  '{',
  JSON.stringify({ ...JSON.parse(raw), version: 99 }),
  JSON.stringify({ ...JSON.parse(raw), auth: 'secret' }),
  raw.replace('https://example.com/guide', 'javascript:alert(1)'),
  JSON.stringify({ ...JSON.parse(raw), data: { ...original, auth: 'secret' } }),
];
for (const v of invalids) fails('invalid', () => parseMyGamesBackup(v));
fails('size', () => parseMyGamesBackup(' '.repeat(BACKUP_MAX_BYTES + 1)));
assert.throws(() => parseRegisteredGames('["apex-legends","apex-legends"]'));
const caps = memory();
caps.setItem(
  MY_GAMES_KEY,
  JSON.stringify(Array.from({ length: 10 }, (_, i) => `game-${i}`)),
);
fails('limit', () => previewMyGamesRestore(caps, raw));
assert.equal(caps.getItem(BACKUP_RECOVERY_KEY), null);
const corrupt = memory();
corrupt.setItem(PLAY_ACTIVITY_KEY, 'broken');
fails('currentInvalid', () => previewMyGamesRestore(corrupt, raw));
assert.equal(corrupt.getItem(PLAY_ACTIVITY_KEY), 'broken');
// Fail before any mutation: no recovery key and no data changes.
const quota = memory();
const quotaPreview = previewMyGamesRestore(quota, raw);
fails('storage', () =>
  restoreMyGames(
    {
      ...quota,
      setItem: () => {
        throw Error('quota');
      },
    },
    quotaPreview,
  ),
);
assert.equal(quota.values.size, 0);
// Fail after one data key, then permit rollback: byte-for-byte recovery.
const rollback = memory();
rollback.setItem('auth-secret', 'unrelated');
const rollbackPreview = previewMyGamesRestore(rollback, raw);
let fail = true;
fails('rolledBack', () =>
  restoreMyGames(
    {
      ...rollback,
      setItem: (k, v) => {
        if (k === MY_PC_KEY && fail) {
          fail = false;
          throw Error('quota');
        }
        rollback.setItem(k, v);
      },
    },
    rollbackPreview,
  ),
);
assert.deepEqual([...rollback.values], [['auth-secret', 'unrelated']]);
// A second failure blocks rollback. Journal survives a restart and can be retried.
const interrupted = memory();
const interruptedPreview = previewMyGamesRestore(interrupted, raw);
let writing = false;
fails('storage', () =>
  restoreMyGames(
    {
      ...interrupted,
      setItem: (k, v) => {
        if (k === MY_PC_KEY) {
          writing = true;
          throw Error('unavailable');
        }
        interrupted.setItem(k, v);
      },
      removeItem: (k) => {
        if (writing) throw Error('unavailable');
        interrupted.removeItem(k);
      },
    },
    interruptedPreview,
  ),
);
assert(interrupted.getItem(BACKUP_RECOVERY_KEY));
assert.equal(
  parseRecoveryRecords(interrupted.getItem(BACKUP_RECOVERY_KEY)).length,
  1,
);
fails('pending', () => previewMyGamesRestore(interrupted, raw));
assert.deepEqual(
  parseMyGamesBackup(exportRecovery(interrupted)).data,
  parseMyGamesBackup(exportMyGames(memory())).data,
);
recoverMyGames(interrupted);
assert.equal(interrupted.values.size, 0);
// Recovery never overwrites a later edit.
const later = memory();
later.setItem(
  BACKUP_RECOVERY_KEY,
  JSON.stringify({
    version: 1,
    before: interruptedPreview.before,
    after: interruptedPreview.after,
  }),
);
later.setItem(MY_GAMES_KEY, '["pubg"]');
fails('recoveryConflict', () => recoverMyGames(later));
assert.equal(later.getItem(MY_GAMES_KEY), '["pubg"]');
assert(later.getItem(BACKUP_RECOVERY_KEY));
fails('recoveryInvalid', () =>
  parseRecoveryRecords('{"version":1,"before":{"auth-secret":"x"},"after":{}}'),
);
assert.equal(
  nextGameAction(['apex-legends'], [plan], ['apex-legends'])?.next,
  'Next quest',
);
assert.equal(nextGameAction([], [plan], ['apex-legends']), undefined);
assert.equal(
  nextGameAction(['apex-legends'], [{ ...plan, next: '  ' }], ['apex-legends']),
  undefined,
);
assert.equal(nextGameAction(['apex-legends'], [plan], []), undefined);
for (const locale of ['ja', 'en', 'zh', 'es'] as const) {
  const shared = settingsShareText('Apex Legends', snapshot, locale);
  assert(shared.includes('Apex Legends'));
  assert(shared.includes('2560x1440'));
  assert(shared.includes('0'));
  assert(shared.includes('2026-10-14'));
  assert(!shared.includes('PRIVATE_MEMO'));
  assert(!shared.includes('note-1'));
  assert(
    settingsShareText('Apex Legends', snapshot, locale, true).includes(
      'PRIVATE_MEMO',
    ),
  );
}
assert(!backupKeys.some((k) => k.includes('auth') || k.includes('diagnosis')));
console.log(
  'PASS: full backup round-trip and repeated restore, legacy notes, references and current-wins conflicts, caps, invalid/unsafe files, excluded keys, quota, rollback, restart recovery and later edits; home actual next action and four-language share text',
);
fails('size', () => parseMyGamesBackup('😀'.repeat(1_300_000)));
const tooManySnapshots = {
  ...JSON.parse(raw),
  data: {
    ...original,
    snapshots: Array.from({ length: 11 }, (_, i) => ({
      ...snapshot,
      id: `many-${i}`,
    })),
  },
};
fails('limit', () => parseMyGamesBackup(JSON.stringify(tooManySnapshots)));
fails('invalid', () =>
  parseMyGamesBackup(
    JSON.stringify({
      ...JSON.parse(raw),
      data: {
        ...original,
        plans: [{ ...plan, snapshot: { ...snapshot, gameSlug: 'pubg' } }],
      },
    }),
  ),
);
// Losing a journal claim must not recover a different tab's journal.
const raced = memory();
const racedPreview = previewMyGamesRestore(raced, raw);
fails('changed', () =>
  restoreMyGames(
    {
      ...raced,
      setItem: (k, v) => {
        raced.setItem(k, v);
        if (k === BACKUP_RECOVERY_KEY) raced.setItem(k, 'other-claim');
      },
    },
    racedPreview,
  ),
);
assert.equal(raced.getItem(MY_GAMES_KEY), null);
assert.equal(raced.getItem(BACKUP_RECOVERY_KEY), 'other-claim');
console.log(
  'PASS: UTF-8 capacity, per-game limits, cross-game reference rejection and lost recovery-journal claim',
);
