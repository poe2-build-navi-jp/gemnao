import assert from 'node:assert/strict';
import {
  PLAY_PLANS_KEY,
  emptyPlayDraft,
  savePlayPlan,
  parsePlayPlans,
  chooseToday,
  safeGuideUrl,
} from '../lib/play-plans';
import {
  SETTINGS_SNAPSHOTS_KEY,
  emptySettingsDraft,
  saveSettingsSnapshot,
  deleteSettingsSnapshot,
} from '../lib/game-settings-snapshots';
const values = new Map<string, string>();
const storage = {
  getItem: (k: string) => values.get(k) ?? null,
  setItem: (k: string, v: string) => {
    values.set(k, v);
  },
};
const original = new Map(
  [
    'gemnao-my-games',
    'gemnao-my-pc',
    'gemnao-solutions-v1',
    'gemnao-diagnosis-v1',
    'gemnao-game-experiments-v1',
    'gemnao-official-changes-read-v1',
  ].map((k) => [k, `untouched ${k}`]),
);
for (const [k, v] of original) values.set(k, v);
const snapshot = saveSettingsSnapshot(
  storage,
  'apex-legends',
  { ...emptySettingsDraft(), name: 'reference', resolution: '1920x1080' },
  'snapshot-1',
);
let p = savePlayPlan(
  storage,
  'apex-legends',
  {
    ...emptyPlayDraft(),
    progress: 'chapter 2',
    next: 'boss',
    guideUrl: 'https://example.com/guide',
    minutes: '30',
    company: 'either',
    prepared: 'yes',
    snapshotId: snapshot.id,
  },
  0,
);
assert.equal(p.snapshot?.resolution, '1920x1080');
deleteSettingsSnapshot(storage, snapshot.id, 'apex-legends');
p = savePlayPlan(
  storage,
  'apex-legends',
  { ...p, snapshotId: snapshot.id, next: 'continue' },
  p.revision,
);
assert.equal(p.snapshot?.resolution, '1920x1080');
assert.equal(
  parsePlayPlans(values.get(PLAY_PLANS_KEY)!).at(0)?.next,
  'continue',
);
const saved = values.get(PLAY_PLANS_KEY);
assert.throws(
  () => savePlayPlan(storage, 'apex-legends', emptyPlayDraft(), 1),
  /conflict/,
);
assert.equal(values.get(PLAY_PLANS_KEY), saved);
for (const url of [
  'javascript:alert(1)',
  'data:text/html,test',
  '/relative',
  'https://user:password@example.com',
  'https://exa\nmple.com',
])
  assert.throws(() => safeGuideUrl(url));
assert.equal(safeGuideUrl(' https://example.com '), 'https://example.com/');
assert.throws(
  () =>
    savePlayPlan(
      {
        ...storage,
        setItem: () => {
          throw Error('quota');
        },
      },
      'apex-legends',
      { ...emptyPlayDraft(), progress: 'new' },
      p.revision,
    ),
  /quota/,
);
assert.equal(values.get(PLAY_PLANS_KEY), saved);
for (const raw of [
  '',
  '{',
  '{"version":2,"items":[]}',
  '{"version":1,"items":[{}]}',
]) {
  values.set(PLAY_PLANS_KEY, raw);
  assert.throws(() => savePlayPlan(storage, 'new', emptyPlayDraft(), 0));
  assert.equal(values.get(PLAY_PLANS_KEY), raw);
}
values.set(PLAY_PLANS_KEY, saved!);
for (const slug of ['a', 'b', 'c', 'd'])
  savePlayPlan(
    storage,
    slug,
    { ...emptyPlayDraft(), minutes: '20', company: 'solo', prepared: 'yes' },
    0,
  );
savePlayPlan(
  storage,
  'not-ready',
  { ...emptyPlayDraft(), minutes: '20', company: 'solo', prepared: 'no' },
  0,
);
const plans = parsePlayPlans(values.get(PLAY_PLANS_KEY)!);
assert.deepEqual(
  chooseToday(
    ['a', 'b', 'c', 'd', 'not-ready', 'missing'],
    plans,
    '30',
    'solo',
  ).matches.map((p) => p.gameSlug),
  ['a', 'b', 'c'],
);
assert.equal(
  chooseToday(['a', 'b', 'c', 'd', 'not-ready', 'missing'], plans, '30', 'solo')
    .unconfigured,
  1,
);
assert.equal(chooseToday(['a'], plans, '10', 'solo').total, 0);
assert.equal(chooseToday(['a'], plans, '30', 'friends').total, 0);
assert.equal(chooseToday(['apex-legends'], plans, '30', 'friends').total, 1);
assert.throws(() => chooseToday([], plans, '', 'solo'));
for (const [k, v] of original) assert.equal(values.get(k), v);
assert.equal(values.get(SETTINGS_SNAPSHOTS_KEY), '{"version":1,"items":[]}');
console.log(
  'PASS: continuation persistence, snapshot capture, unsafe URLs, conflicts, quota, invalid versions, deterministic max-three matching, no-match/unset and old-key preservation',
);
const { PLAY_ACTIVITY_KEY, parsePlayActivity, changePlayTask, saveTrouble } =
  await import('../lib/play-activity');
const preservedPlans = values.get(PLAY_PLANS_KEY);
let activity = changePlayTask(
  storage,
  'apex-legends',
  { kind: 'add', id: 'task-1', text: 'Next level' },
  0,
);
activity = changePlayTask(
  storage,
  'apex-legends',
  { kind: 'toggle', id: 'task-1' },
  activity.revision,
);
activity = changePlayTask(
  storage,
  'apex-legends',
  { kind: 'delete', id: 'task-1' },
  activity.revision,
);
assert.equal(
  parsePlayActivity(values.get(PLAY_ACTIVITY_KEY)!).at(0)?.tasks[0].deleted,
  true,
);
activity = changePlayTask(
  storage,
  'apex-legends',
  { kind: 'restore', id: 'task-1' },
  activity.revision,
);
assert.equal(activity.tasks[0].done, true);
activity = saveTrouble(
  storage,
  'apex-legends',
  {
    tried: 'restart: same error',
    nextFix: 'check exact code',
    noteId: 'existing-note',
  },
  activity.revision,
);
assert.equal(activity.tasks[0].text, 'Next level');
assert.equal(
  parsePlayActivity(values.get(PLAY_ACTIVITY_KEY)!).at(0)?.nextFix,
  'check exact code',
);
assert.throws(
  () =>
    saveTrouble(
      storage,
      'apex-legends',
      { tried: 'stale', nextFix: '', noteId: '' },
      0,
    ),
  /conflict/,
);
for (let i = 2; i <= 8; i++)
  activity = changePlayTask(
    storage,
    'apex-legends',
    { kind: 'add', id: `task-${i}`, text: `Task ${i}` },
    activity.revision,
  );
assert.throws(
  () =>
    changePlayTask(
      storage,
      'apex-legends',
      { kind: 'add', id: 'over', text: 'limit' },
      activity.revision,
    ),
  /limit/,
);
const activityRaw = values.get(PLAY_ACTIVITY_KEY)!;
assert.throws(
  () =>
    changePlayTask(
      {
        ...storage,
        setItem: () => {
          throw Error('quota');
        },
      },
      'apex-legends',
      { kind: 'toggle', id: 'task-1' },
      activity.revision,
    ),
  /quota/,
);
assert.equal(values.get(PLAY_ACTIVITY_KEY), activityRaw);
for (const raw of [
  '',
  '{',
  '{"version":99,"items":[]}',
  activityRaw.replace('"done":true', '"done":"true"'),
]) {
  values.set(PLAY_ACTIVITY_KEY, raw);
  assert.throws(() =>
    changePlayTask(
      storage,
      'apex-legends',
      { kind: 'toggle', id: 'task-1' },
      activity.revision,
    ),
  );
  assert.equal(values.get(PLAY_ACTIVITY_KEY), raw);
}
values.set(PLAY_ACTIVITY_KEY, activityRaw);
activity = changePlayTask(
  storage,
  'apex-legends',
  { kind: 'delete', id: 'task-1' },
  activity.revision,
);
activity = changePlayTask(
  storage,
  'apex-legends',
  { kind: 'purge', id: 'task-1' },
  activity.revision,
);
assert(!activity.tasks.some((t) => t.id === 'task-1'));
assert.equal(activity.tried, 'restart: same error');
assert.equal(values.get(PLAY_PLANS_KEY), preservedPlans);
for (const [k, v] of original) assert.equal(values.get(k), v);
const { TODAY_CHOICES_KEY, parseTodayChoices, saveTodayChoice } =
  await import('../lib/play-plans');
saveTodayChoice(storage, { minutes: '45', company: 'friends' });
assert.deepEqual(parseTodayChoices(values.get(TODAY_CHOICES_KEY)!), [
  { minutes: '45', company: 'friends' },
]);
assert.throws(() =>
  saveTodayChoice(storage, { minutes: '0', company: 'solo' }),
);
console.log(
  'PASS: checked tasks survive delete/reload/restore; limits, purge, troubleshooting persistence, conflicts, quota, corrupt activity and legacy keys; today choices persist',
);
let trashRevision = 0;
for (let i = 0; i < 20; i++) {
  const added = changePlayTask(
    storage,
    'trash-test',
    { kind: 'add', id: `trash-${i}`, text: 'keep restorable' },
    trashRevision,
  );
  const deleted = changePlayTask(
    storage,
    'trash-test',
    { kind: 'delete', id: `trash-${i}` },
    added.revision,
  );
  trashRevision = deleted.revision;
}
const last = changePlayTask(
  storage,
  'trash-test',
  { kind: 'add', id: 'last-task', text: 'preserve at limit' },
  trashRevision,
);
const trashBytes = values.get(PLAY_ACTIVITY_KEY);
assert.throws(
  () =>
    changePlayTask(
      storage,
      'trash-test',
      { kind: 'delete', id: 'last-task' },
      last.revision,
    ),
  /limit/,
);
assert.equal(values.get(PLAY_ACTIVITY_KEY), trashBytes);
assert.equal(
  parsePlayActivity(trashBytes!)
    .find((v) => v.gameSlug === 'trash-test')
    ?.tasks.filter((t) => t.deleted).length,
  20,
);
console.log(
  'PASS: full trash refuses deletion without dropping an older restorable task',
);
