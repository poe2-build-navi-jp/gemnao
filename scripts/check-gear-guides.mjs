import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { build } from 'esbuild';

const result = await build({
  stdin: { contents: "export { gearGuides } from './lib/gear-guides';", resolveDir: process.cwd(), loader: 'ts' },
  bundle: true, platform: 'node', format: 'esm', write: false,
});
const { gearGuides } = await import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`);
const storage = gearGuides.find((guide) => guide.slug === 'save-backup-storage-guide');
assert.ok(storage);
assert.equal(storage.example, undefined, 'Never introduce an unverified product mapping');
assert.ok(storage.answer.includes('新しい機器は不要'));
assert.ok(storage.sections.some((section) => section.id === 'capacity'));
assert.ok(storage.related.some((link) => link.href === '/tools/save-locations'));
assert.ok(gearGuides.find((guide) => guide.slug === 'discord-microphone-guide')?.example?.asin === 'B08H6X6G28');
for (const guide of gearGuides) {
  assert.equal(new Set(guide.sections.map((section) => section.id)).size, guide.sections.length);
  assert.ok(guide.sources.length >= 2);
  for (const row of guide.compare.rows) assert.equal(row.length, guide.compare.headers.length);
}
const template = await readFile('components/gear-buyer-guide.tsx', 'utf8');
assert.ok(template.includes('about: guide.shortTitle'));
assert.ok(template.includes('guide.example &&'));
const affiliate = await readFile('components/affiliate-link.tsx', 'utf8');
assert.ok(affiliate.includes('rel="sponsored nofollow noopener"'));
const hub = await readFile('app/gear/page.tsx', 'utf8');
const tool = await readFile('app/tools/save-locations/page.tsx', 'utf8');
for (const text of [hub, tool]) assert.ok(text.includes('/gear/save-backup-storage-guide'));
console.log(`PASS: ${gearGuides.length} buyer guides, optional product gate, existing ASIN, disclosures, and inbound links`);
