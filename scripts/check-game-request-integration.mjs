import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { isEditorialSnapshotPath } from '../cloudflare/prerender-policy.mjs';
const read = (path) => readFileSync(path, 'utf8');
const config = JSON.parse(read('wrangler.json'));
assert.deepEqual(Object.fromEntries(Object.entries(config.vars || {}).filter(([key]) => key.startsWith('GAME_REQUEST'))), {
  GAME_REQUEST_REVIEW_MODE: 'manual',
  GAME_REQUEST_MANUAL_REVIEW_READY: 'true',
  GAME_REQUESTS_ENABLED: 'true',
});
assert.ok(!Object.keys(config.env.preview.vars || {}).some((key) => key.startsWith('GAME_REQUEST')));
assert.deepEqual(config.env.preview.d1_databases, []);
assert.ok(readdirSync('.openai/drizzle').includes('0004_step_result_reports.sql'));
assert.ok(!readdirSync('.openai/drizzle').some((path) => path.includes('game_requests')));
assert.match(read('migrations/game-requests/0001_game_requests.sql'), /CREATE TABLE IF NOT EXISTS game_requests/);
for (const path of ['/admin/game-requests', '/api/game-requests', '/api/admin/game-requests', '/api/automation/game-requests']) assert.equal(isEditorialSnapshotPath(path), false);
const my = read('components/my-games-page.tsx');
assert.match(my, /<SupportWorkspace locale=\{locale\}/);
assert.match(my, /<SupportUpdates locale=\{locale\}/);
assert.match(my, /<GameRequestForm locale=\{locale\}/);
for (const path of ['ops/d1/control.mjs', '.github/workflows/d1-control.yml']) assert.ok(!read(path).includes('0001_game_requests'));
console.log('PASS: staged request schema, explicit manual flags without consumer credential, private APIs, preview DB isolation and current private notebook retained');
