import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { lstat, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { previewAssetAllowed } from './prepare-worker-preview.mjs';

export async function verifyWorkerPreviewArtifact(root = process.cwd()) {
  const output = path.join(root, 'dist/worker-preview');
  for (const file of ['dist', 'dist/worker-preview', 'dist/worker-preview/assets', 'dist/worker-preview/asset-manifest.json']) assert.ok(!(await lstat(path.join(root, file))).isSymbolicLink(), file);
  const manifest = JSON.parse(await readFile(path.join(output, 'asset-manifest.json'), 'utf8'));
  const hash = (data) => createHash('sha256').update(data).digest('hex');
  assert.deepEqual(manifest.inputs.map((entry) => entry.path), ['dist/client/_worker.bundle.js', 'cloudflare/worker-preview.mjs', 'cloudflare/worker-preview-policy.mjs', 'lib/preview/worker-origin.ts', 'wrangler.worker-preview.json']);
  for (const entry of manifest.inputs) {
    assert.ok(!(await lstat(path.join(root, entry.path))).isSymbolicLink());
    const data = await readFile(path.join(root, entry.path));
    assert.equal(data.byteLength, entry.bytes, entry.path);
    assert.equal(hash(data), entry.sha256, entry.path);
  }
  assert.equal(manifest.sourceWorkerSha256, manifest.inputs[0].sha256);
  const files = [];
  async function walk(directory, prefix = '') {
    for (const item of await readdir(directory, { withFileTypes: true })) {
      const relative = prefix + item.name;
      assert.ok(!item.isSymbolicLink(), relative);
      if (item.isDirectory()) await walk(path.join(directory, item.name), relative + '/');
      else { assert.ok(item.isFile(), relative); files.push(relative); }
    }
  }
  await walk(path.join(output, 'assets'));
  assert.equal(new Set(manifest.assets.map((entry) => entry.path)).size, manifest.assets.length);
  const compare = (a, b) => a.localeCompare(b);
  assert.deepEqual(files.sort(compare), [...manifest.assets.map((entry) => entry.path), '.assetsignore'].sort(compare));
  assert.equal(hash(await readFile(path.join(output, 'assets/.assetsignore'))), manifest.ignoreSha256);
  for (const entry of manifest.assets) {
    assert.ok(previewAssetAllowed(entry.path), entry.path);
    const data = await readFile(path.join(output, 'assets', entry.path));
    assert.equal(data.byteLength, entry.bytes, entry.path);
    assert.equal(hash(data), entry.sha256, entry.path);
  }
  console.log(`PASS: ${manifest.assets.length} exact QA assets and five deployment inputs match the integrity manifest; no unexpected files.`);
  return manifest;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await verifyWorkerPreviewArtifact();
