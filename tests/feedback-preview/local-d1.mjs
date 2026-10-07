// Synthetic fixtures only. No Wrangler config, credentials, remote D1 or HTTP listener.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { build, transformSync } from 'esbuild';
import { fileURLToPath } from 'node:url';
import cleanup from '../../ops/feedback-preview/reviewed/cleanup.mjs';
import { ARTIFACTS, checkArtifact, verifyArtifacts } from '../../ops/feedback-preview/controller.mjs';
const require = createRequire(import.meta.url);
const { Miniflare } = createRequire(require.resolve('wrangler/package.json'))('miniflare');
await verifyArtifacts();
const schema = await readFile('ops/feedback-preview/reviewed/0001.sql', 'utf8');
const source = await readFile('ops/feedback-preview/reviewed/cleanup.ts', 'utf8');
checkArtifact(transformSync(source, { loader: 'ts', target: 'es2022',
  legalComments: 'none' }).code, ARTIFACTS['reviewed/cleanup.mjs']);
const sharingBuild = await build({
  absWorkingDir: fileURLToPath(new URL('../../ops/feedback-preview/reviewed/diagnosis/', import.meta.url)),
  entryPoints: ['cloudflare/diagnosis-cleanup.ts'], outfile: '.wrangler/diagnosis-tests/cleanup-worker.mjs',
  bundle: true, format: 'esm', platform: 'neutral', metafile: true, write: false,
});
assert.deepEqual(Object.keys(sharingBuild.metafile.inputs).sort(), ['cloudflare/diagnosis-cleanup.ts', 'lib/diagnosis/cleanup.ts']);
checkArtifact(sharingBuild.outputFiles[0].contents, ARTIFACTS['reviewed/diagnosis/cleanup.bundle']);
const { default: sharingCleanup } = await import('data:text/javascript,' + encodeURIComponent(sharingBuild.outputFiles[0].text));
assert.equal(sharingCleanup.fetch().status, 404);
let ordinaryTouched = false;
await assert.rejects(sharingCleanup.scheduled({}, { DB: { prepare() { ordinaryTouched = true; } } }, {}), /DIAGNOSIS_DB/);
assert.equal(ordinaryTouched, false);
const mf = new Miniflare({ modules: true, script: 'export default {};',
  compatibilityDate: '2026-05-22', d1Databases: ['FEEDBACK_DB', 'DIAGNOSIS_DB'] });
try {
  const db = await mf.getD1Database('FEEDBACK_DB');
  const diagnosis = await mf.getD1Database('DIAGNOSIS_DB');
  const diagnosisSchema = await readFile('ops/feedback-preview/reviewed/diagnosis/0001.sql', 'utf8');
  await diagnosis.exec(diagnosisSchema.replace(/--[^\n]*/g, '').replace(/\n/g, ' '));
  const sharingTables = await diagnosis.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'diagnosis_%' ORDER BY name").all();
  assert.deepEqual(sharingTables.results.map(r => r.name), ['diagnosis_metrics', 'diagnosis_operations', 'diagnosis_rate_limits', 'diagnosis_shared']);
  assert.equal((await diagnosis.prepare('SELECT count(*) AS n FROM diagnosis_operations').first()).n, 0);
  await assert.rejects(diagnosis.prepare('SELECT count(*) FROM diagnostic_reports').first());
  await assert.rejects(db.prepare('SELECT count(*) FROM diagnosis_shared').first());
  console.log('PASS 0: distinct local sharing schema, no heartbeat, no cross-feature tables/bindings');
  const sharingNow = Date.now();
  await diagnosis.prepare('INSERT INTO diagnosis_shared (id,owner_hash,recovery_hash,request_id,snapshot,rule_version,created_at,updated_at,expires_at) VALUES(?,?,?,?,?,?,?,?,?),(?,?,?,?,?,?,?,?,?)')
    .bind('expired', 'fake-owner', 'fake-recovery', 'expired', '{}', 'synthetic', sharingNow, sharingNow, sharingNow - 86400000,
      'retained', 'fake-owner', 'fake-recovery', 'retained', '{}', 'synthetic', sharingNow, sharingNow, sharingNow + 86400000).run();
  await sharingCleanup.scheduled({}, { DIAGNOSIS_DB: diagnosis, DB: { prepare() { throw new Error('ordinary DB must remain untouched'); } } }, {});
  assert.equal((await diagnosis.prepare('SELECT count(*) AS n FROM diagnosis_shared').first()).n, 1);
  assert.equal((await diagnosis.prepare('SELECT id FROM diagnosis_shared').first()).id, 'retained');
  const sharingHealth = await diagnosis.prepare("SELECT value FROM diagnosis_operations WHERE key='cleanup_success'").first();
  assert.ok(Number(sharingHealth.value) >= sharingNow);
  await diagnosis.prepare("UPDATE diagnosis_operations SET value='123' WHERE key='cleanup_success'").run();
  await diagnosis.exec('DROP TABLE diagnosis_rate_limits');
  await assert.rejects(sharingCleanup.scheduled({}, { DIAGNOSIS_DB: diagnosis }, {}));
  assert.equal((await diagnosis.prepare("SELECT value FROM diagnosis_operations WHERE key='cleanup_success'").first()).value, '123');
  console.log('PASS sharing: exact two-input bundle, denied HTTP/ordinary DB, local expiry and failed-cleanup heartbeat preserved');
  const apply = () => db.exec(schema.replace(/--[^\n]*/g, '').replace(/\n/g, ' '));
  await apply();
  const count = async (table) => (await db.prepare(`SELECT count(*) AS n FROM ${table}`).first()).n;
  const tables = await db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'diagnostic_%' ORDER BY name").all();
  assert.deepEqual(tables.results.map(r => r.name), ['diagnostic_rate_attempts', 'diagnostic_rate_salt',
    'diagnostic_report_tombstones', 'diagnostic_reports', 'diagnostic_retention_health']);
  const indexes = await db.prepare("SELECT name FROM sqlite_master WHERE type='index' AND name LIKE 'diagnostic_%'").all();
  assert.equal(indexes.results.length, 4);
  assert.equal(await count('diagnostic_retention_health'), 0);
  await assert.rejects(apply); // Fresh-only migration, never silently adopt existing tables.
  console.log('PASS 1: exact fresh schema, four indexes, no fabricated heartbeat, reapply refused');

  const report = (id, expires, body = '{}', consent = 1) => db.prepare(
    'INSERT INTO diagnostic_reports VALUES(?,?,?,?,unixepoch(),?)').bind(id, 'synthetic-hash', body, consent, expires).run();
  await assert.rejects(report('large', 1, 'x'.repeat(4097)));
  await assert.rejects(report('consent', 1, '{}', 0));
  await assert.rejects(db.prepare("INSERT INTO diagnostic_rate_salt VALUES(1,0,'bad')").run());
  await assert.rejects(db.prepare("INSERT INTO diagnostic_rate_attempts VALUES('bad','other',?,unixepoch())").bind('a'.repeat(64)).run());
  console.log('PASS 2: report/consent/quota constraints preserved');

  const now = Math.floor(Date.now() / 1000);
  await report('expired', now - 86400);
  await report('retained', now + 86400);
  await db.prepare('INSERT INTO diagnostic_report_tombstones VALUES(?,?,?),(?,?,?)')
    .bind('expired-tombstone', 'synthetic-hash', now - 86400, 'retained-tombstone', 'synthetic-hash', now + 86400).run();
  await db.prepare('INSERT INTO diagnostic_rate_salt VALUES(1,?,?)').bind(Math.floor(now / 86400) - 1, 'a'.repeat(64)).run();
  await db.prepare('INSERT INTO diagnostic_rate_attempts VALUES(?,?,?,?),(?,?,?,?)')
    .bind('expired-attempt', 'intake', 'a'.repeat(64), now - 3600, 'fresh-attempt', 'delete', 'b'.repeat(64), now).run();
  await db.exec('CREATE TABLE unrelated_local_sentinel(value INTEGER); INSERT INTO unrelated_local_sentinel VALUES(42);');
  assert.equal(typeof cleanup.fetch, 'undefined');
  await cleanup.scheduled({}, { FEEDBACK_DB: db });
  assert.equal(await count('diagnostic_reports'), 1);
  assert.equal((await db.prepare('SELECT receipt_id FROM diagnostic_reports').first()).receipt_id, 'retained');
  assert.equal(await count('diagnostic_report_tombstones'), 1);
  assert.equal(await count('diagnostic_rate_attempts'), 1);
  assert.equal(await count('diagnostic_rate_salt'), 0);
  const health = await db.prepare('SELECT last_cleanup FROM diagnostic_retention_health').first();
  assert.ok(health.last_cleanup >= now && health.last_cleanup <= Math.floor(Date.now() / 1000));
  assert.equal((await db.prepare('SELECT value FROM unrelated_local_sentinel').first()).value, 42);
  console.log('PASS 3: real local D1 cleanup deletes only expired data and updates heartbeat; no HTTP handler');

  await db.prepare('UPDATE diagnostic_retention_health SET last_cleanup=123').run();
  await db.prepare('INSERT INTO diagnostic_rate_attempts VALUES(?,?,?,?)').bind('rollback-attempt', 'intake', 'c'.repeat(64), now - 3600).run();
  // Deliberately corrupt a synthetic local table late in the batch to prove rollback.
  await db.exec('DROP TABLE diagnostic_reports');
  await assert.rejects(cleanup.scheduled({}, { FEEDBACK_DB: db }));
  assert.equal((await db.prepare("SELECT count(*) AS n FROM diagnostic_rate_attempts WHERE id='rollback-attempt'").first()).n, 1);
  assert.equal((await db.prepare('SELECT last_cleanup FROM diagnostic_retention_health').first()).last_cleanup, 123);
  console.log('PASS 4: failed cleanup transaction rolls back pruning and cannot refresh heartbeat');
} finally {
  await mf.dispose();
}
