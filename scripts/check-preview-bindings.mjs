import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { unstable_readConfig } from 'wrangler';

// Local configuration parsing only: never contact Cloudflare or submit votes.
const raw = JSON.parse(await readFile('wrangler.json', 'utf8'));
assert.deepEqual(raw.env.preview.d1_databases, []);
assert.equal(raw.env.preview.vars.DIAGNOSIS_LOCAL_BETA, 'true');
for (const flag of ['DIAGNOSIS_ENABLED','DIAGNOSIS_STORAGE_ENABLED','DIAGNOSIS_SHARING_ENABLED','DIAGNOSIS_WRITES_ENABLED','GAME_REQUESTS_ENABLED']) assert.notEqual(raw.env.preview.vars[flag], 'true', flag+' must not inherit production activation');
assert.equal(raw.env.production, undefined);
const production = unstable_readConfig({ config: 'wrangler.json', env: 'production' });
const preview = unstable_readConfig({ config: 'wrangler.json', env: 'preview' });
assert.deepEqual(production.d1_databases, raw.d1_databases);
assert.deepEqual(production.vars, raw.vars);
assert.deepEqual(preview.d1_databases, []);
assert.deepEqual(preview.vars, raw.env.preview.vars);
for (const key of ['pages_build_output_dir', 'compatibility_date', 'compatibility_flags']) {
  assert.deepEqual(preview[key], production[key]);
}
if (process.argv.includes('--built')) {
  await access('dist/client/_worker.js');
  await access('dist/client/_worker.bundle.js');
  for (const path of ['dist/server/wrangler.json', '.wrangler/deploy/config.json']) {
    await assert.rejects(access(path), { code: 'ENOENT' });
  }
}
console.log('PASS: production bindings unchanged; preview has no D1; Pages config is authoritative.');
