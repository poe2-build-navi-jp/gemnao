import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { copyFile, lstat, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const rootFiles = new Set(['favicon.svg', 'gemnao-logo.png', 'og-default.png', 'og-default.svg', 'ads.txt']);
export function previewAssetAllowed(relative) {
  if (relative.includes('\\') || relative.split('/').some((part) => !part || part.startsWith('.'))) return false;
  if (/\.(?:map|json|jsonc|sql|toml|ya?ml|tsx?)$/i.test(relative)) return false;
  return rootFiles.has(relative) ||
    /^_next\/static\/[a-zA-Z0-9_./-]+\.(?:js|css|woff2?|ttf|otf|png|jpe?g|webp|avif|svg)$/i.test(relative) ||
    /^images\/[a-zA-Z0-9_./-]+\.(?:png|jpe?g|webp|avif|gif|svg|ico)$/i.test(relative) ||
    /^_gemnao-snapshots\/[a-zA-Z0-9_-]+\.snapshot$/.test(relative);
}

export async function prepareWorkerPreview(source = 'dist/client', output = 'dist/worker-preview') {
  const assets = path.join(output, 'assets');
  const root = path.resolve(source);
  assert.notEqual(root, path.resolve(output));
  assert.ok(path.resolve(output).startsWith(path.resolve('dist') + path.sep));
  for (const directory of ['dist', root]) assert.ok(!(await lstat(directory)).isSymbolicLink(), directory);
  await lstat(output).then((stat) => assert.ok(!stat.isSymbolicLink())).catch((error) => { if (error.code !== 'ENOENT') throw error; });
  const worker = await readFile(path.join(root, '_worker.bundle.js'));
  const selected = [];
  async function walk(dir, prefix = '') {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const relative = prefix + entry.name;
      assert.ok(!entry.isSymbolicLink(), 'No symlinks in preview inputs: ' + relative);
      if (entry.isDirectory()) await walk(path.join(dir, entry.name), relative + '/');
      else if (entry.isFile() && previewAssetAllowed(relative)) {
        const file = await readFile(path.join(dir, entry.name));
        assert.ok(file.byteLength <= 25 * 1024 * 1024, 'Asset too large: ' + relative);
        selected.push({ path: relative, bytes: file.byteLength, sha256: createHash('sha256').update(file).digest('hex') });
      }
    }
  }
  await walk(root);
  assert.ok(selected.some((entry) => entry.path.startsWith('_next/static/') && entry.path.endsWith('.js')));
  assert.ok(selected.some((entry) => entry.path.endsWith('.css')));
  assert.ok(selected.length < 20000);
  await lstat(assets).then((stat) => assert.ok(!stat.isSymbolicLink())).catch((error) => { if (error.code !== 'ENOENT') throw error; });
  await rm(assets, { recursive: true, force: true });
  await mkdir(assets, { recursive: true });
  for (const entry of selected) {
    const target = path.join(assets, entry.path);
    await mkdir(path.dirname(target), { recursive: true });
    await copyFile(path.join(root, entry.path), target);
  }
  // Defense in depth; only the allowlisted copies above enter this directory.
  const ignore = '_worker*\n**/*.map\n**/*.json\n**/*.jsonc\n**/*.sql\n**/*.toml\n**/*.yaml\n**/*.yml\n**/*.ts\n**/*.tsx\n**/.*\n';
  await writeFile(path.join(assets, '.assetsignore'), ignore);
  const inputs = [];
  for (const file of ['dist/client/_worker.bundle.js', 'cloudflare/worker-preview.mjs', 'cloudflare/worker-preview-policy.mjs', 'lib/preview/worker-origin.ts', 'wrangler.worker-preview.json']) {
    const content = await readFile(file);
    inputs.push({ path: file, bytes: content.byteLength, sha256: createHash('sha256').update(content).digest('hex') });
  }
  const manifest = { sourceWorkerSha256: createHash('sha256').update(worker).digest('hex'), ignoreSha256: createHash('sha256').update(ignore).digest('hex'), inputs, assets: selected.sort((a, b) => a.path.localeCompare(b.path)) };
  await writeFile(path.join(output, 'asset-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  console.log(`Prepared ${selected.length} allowlisted QA assets; no Worker source, source maps or configuration uploaded as assets.`);
  return manifest;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await prepareWorkerPreview();
