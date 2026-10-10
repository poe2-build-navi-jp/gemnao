import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { readFileSync } from 'node:fs';
const bundle = await build({
  entryPoints: ['lib/pc-repair-articles.ts', 'lib/repair-costs.ts'],
  bundle: true,
  write: false,
  platform: 'node',
  format: 'esm',
  outdir: '.wrangler/repair-check',
});
const load = async (name) =>
  import(
    'data:text/javascript;base64,' +
      Buffer.from(
        bundle.outputFiles.find((f) => f.path.endsWith(name + '.js')).text,
      ).toString('base64')
  );
const {
  pcRepairArticles: [a],
} = await load('pc-repair-articles');
const { repairCostExamples: costs } = await load('repair-costs');
assert.equal(a.slug, 'repair-or-replace');
assert.equal(a.steps.length, 4);
for (const row of a.diagnosis)
  assert.ok(row.next >= 1 && row.next <= a.steps.length);
assert.equal(new Set(costs.map((c) => c.id)).size, costs.length);
assert.ok(costs.length >= 26);
for (const c of costs) {
  assert.ok(c.label && c.price && c.conditions && c.parts);
  if (c.basis === 'labor') assert.equal(c.parts, 'extra');
  if (c.parts === 'included') assert.equal(c.id, 'ssd-migration');
  assert.match(c.source, /^https:\/\//);
  assert.ok(
    ['labor', 'repair', 'service', 'example', 'quote'].includes(c.basis),
  );
}
assert.match(a.answer, /情報が不足/);
assert.match(a.answer, /一律/);
assert.ok(a.quickChecks.some((x) => /異臭/.test(x) && /起動しない/.test(x)));
assert.ok(
  a.quickChecks.some((x) => /ストレージ/.test(x) && /バックアップ/.test(x)),
);
const table = readFileSync('components/repair-cost-table.tsx', 'utf8');
assert.match(table, /平均価格やあなたのPCの見積額ではありません/);
assert.match(table, /工賃のみ/);
assert.match(table, /診断料込みの確認はありません/);
assert.match(readFileSync('lib/analytics.ts', 'utf8'), /diagnose\|diagnosis/);
assert.match(
  readFileSync('components/wiki-home.tsx', 'utf8'),
  /href="\/pc\/repair-or-replace"/,
);
assert.match(
  readFileSync('lib/pc-hardware-articles.ts', 'utf8'),
  /\/pc\/repair-or-replace/,
);
console.log(
  `PASS: article, ${costs.length} itemized official examples, safety copy, links and analytics exclusion`,
);
