import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { SaveGame } from '../components/save-game';
import { SaveSolution } from '../components/save-solution';
import { SolutionNotebook } from '../components/solution-notebook';
import { InteractiveSteps } from '../components/interactive-steps';
import { MyDashboard } from '../components/my-dashboard';
import {
  deleteSolution,
  importSolutions,
  MAX_SOLUTIONS,
  parseSolutions,
  readSolutions,
  safeArticlePath,
  serializeSolutions,
  SOLUTIONS_KEY,
  upsertSolution,
  type SavedSolution,
} from '../lib/saved-solutions';

const record: SavedSolution = {
  id: 'article:/guide/no-game-audio',
  title: 'ゲームだけ音が出ない',
  gameSlug: 'elden-ring',
  status: 'resolved',
  diagnosis: 'Windowsのテスト音は聞こえた。',
  settings: '出力先：モニター → ヘッドセット',
  notes: '同じ場面で再確認し、再起動後も音が出た。',
  articlePath: '/guide/no-game-audio',
  stepId: 'step-2',
  completedSteps: ['出力先を確認'],
  createdAt: '2026-10-02T06:00:00.000Z',
  updatedAt: '2026-10-02T06:00:00.000Z',
};
const data = new Map<string, string>();
const storage = {
  getItem: (key: string) => data.get(key) ?? null,
  setItem: (key: string, value: string) => {
    data.set(key, value);
  },
};
data.set('gemnao-progress:elden-ring', 'existing-progress');
data.set('gemnao-my-games', '["elden-ring"]');
data.set('gemnao-feedback:elden-ring:launch:resolved', '1');
assert.deepEqual(readSolutions(storage), []);
upsertSolution(storage, record);
assert.deepEqual(readSolutions(storage), [record]);
// A fresh reader simulates reload; the persisted record retains all fields.
assert.deepEqual(parseSolutions(data.get(SOLUTIONS_KEY)!), [record]);
const updated = {
  ...record,
  settings: 'FPS上限：無制限 → 60fps',
  updatedAt: '2026-10-02T07:00:00.000Z',
};
upsertSolution(storage, updated);
assert.deepEqual(readSolutions(storage), [updated]);
assert.equal(data.get('gemnao-progress:elden-ring'), 'existing-progress');
assert.equal(data.get('gemnao-my-games'), '["elden-ring"]');
assert.equal(data.get('gemnao-feedback:elden-ring:launch:resolved'), '1');
const backup = serializeSolutions([record]);
assert.equal(importSolutions(storage, backup), 0);
assert.deepEqual(readSolutions(storage), [updated]); // Never overwrite edits.
deleteSolution(storage, record.id);
assert.deepEqual(readSolutions(storage), []);
assert.equal(importSolutions(storage, backup), 1);
assert.deepEqual(readSolutions(storage), [record]);

for (const raw of [
  'broken',
  '{"version":2,"items":[]}',
  '{"version":1,"items":null}',
  JSON.stringify({ version: 1, items: [record, record] }),
  ...[
    { status: '__proto__' },
    { title: '' },
    { title: 'a'.repeat(201) },
    { diagnosis: 'a'.repeat(4001) },
    { completedSteps: [null] },
    { articlePath: '//evil.example' },
    { articlePath: 'javascript:alert(1)' },
    { articlePath: '/guide/no-game-audio?email=private' },
    { stepId: '"onclick=' },
    { updatedAt: 'not a date' },
    { gameSlug: '<script>' },
    { id: '' },
  ].map((patch) =>
    JSON.stringify({ version: 1, items: [{ ...record, ...patch }] }),
  ),
]) {
  const before = data.get(SOLUTIONS_KEY);
  assert.throws(() => importSolutions(storage, raw));
  assert.equal(data.get(SOLUTIONS_KEY), before);
}
for (const path of [
  '',
  '/games/elden-ring/not-launching',
  '/discord/no-route',
  '/pc/disk-usage-100',
])
  assert.equal(safeArticlePath(path), true);
const corrupt = '{"version":99}';
data.set(SOLUTIONS_KEY, corrupt);
assert.throws(() => upsertSolution(storage, record));
assert.throws(() => deleteSolution(storage, record.id));
assert.throws(() => importSolutions(storage, backup));
assert.equal(data.get(SOLUTIONS_KEY), corrupt);
data.set(
  SOLUTIONS_KEY,
  serializeSolutions(
    Array.from({ length: MAX_SOLUTIONS }, (_, i) => ({
      ...record,
      id: `manual-${i}`,
    })),
  ),
);
const full = data.get(SOLUTIONS_KEY);
assert.throws(() => upsertSolution(storage, record), /100件/);
assert.throws(() => importSolutions(storage, backup), /100件/);
assert.equal(data.get(SOLUTIONS_KEY), full);
assert.doesNotThrow(() =>
  upsertSolution(storage, { ...record, id: 'manual-0' }),
);
const blocked = {
  getItem() {
    throw new DOMException('blocked', 'SecurityError');
  },
  setItem() {},
};
assert.throws(() => upsertSolution(blocked, record));
const quota = {
  getItem: () => null,
  setItem() {
    throw new DOMException('full', 'QuotaExceededError');
  },
};
assert.throws(() => upsertSolution(quota, record));
assert.throws(() => importSolutions(quota, backup));
assert.throws(() => parseSolutions('a'.repeat(2_000_001)));
const enriched = JSON.stringify({
  version: 1,
  items: [{ ...record, unexpected: 'discard' }],
});
assert.deepEqual(parseSolutions(enriched), [record]);

// Server rendering has no localStorage/window/crypto access or private notes.
const notebook = renderToStaticMarkup(<SolutionNotebook />);
assert.match(notebook, /診断結果・解決した設定/);
assert.match(notebook, /読み込んでいます/);
assert.ok(!notebook.includes(record.settings));
assert.match(
  renderToStaticMarkup(<SaveGame slug="elden-ring" />),
  /遊ぶゲームとして保存/,
);
assert.match(
  renderToStaticMarkup(<SaveSolution draft={record} />),
  /診断結果・設定を保存/,
);
assert.match(
  renderToStaticMarkup(<MyDashboard games={[]} />),
  /id="my-solutions"/,
);
const steps = renderToStaticMarkup(
  <InteractiveSteps
    contextSlug="test"
    topic="launch"
    articleTitle="Test"
    articlePath="/guide/no-game-audio"
    steps={[{ id: 'step-1', title: 'Test', actions: ['確認する'] }]}
  />,
);
assert.equal((steps.match(/診断結果・設定を保存/g) || []).length, 1);
assert.match(steps, /これで直った/);
console.log(
  'Saved solutions checks passed: save/edit/reload/delete/restore, non-destructive merge, validation, limits, blocked/quota storage, legacy keys, and SSR.',
);
