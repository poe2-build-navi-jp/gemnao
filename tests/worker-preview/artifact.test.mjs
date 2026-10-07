import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, mkdtemp, rm, symlink, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { verifyWorkerPreviewArtifact } from '../../scripts/verify-worker-preview-artifact.mjs';

const digest = (data) => createHash('sha256').update(data).digest('hex');
async function fixture() {
  const root = await mkdtemp(path.join(os.tmpdir(), 'gemnao-artifact-test.'));
  const inputs = [];
  for (const file of ['dist/client/_worker.bundle.js', 'cloudflare/worker-preview.mjs', 'cloudflare/worker-preview-policy.mjs', 'lib/preview/worker-origin.ts', 'wrangler.worker-preview.json']) {
    const data = 'synthetic ' + file;
    await mkdir(path.dirname(path.join(root, file)), { recursive: true });
    await writeFile(path.join(root, file), data);
    inputs.push({ path: file, bytes: Buffer.byteLength(data), sha256: digest(data) });
  }
  const assets = path.join(root, 'dist/worker-preview/assets');
  await mkdir(path.join(assets, '_next/static/chunks'), { recursive: true });
  await writeFile(path.join(assets, '_next/static/chunks/a.js'), 'client');
  await writeFile(path.join(assets, '.assetsignore'), 'ignore');
  await writeFile(path.join(root, 'dist/worker-preview/asset-manifest.json'), JSON.stringify({ inputs, sourceWorkerSha256: inputs[0].sha256, ignoreSha256: digest('ignore'), assets: [{ path: '_next/static/chunks/a.js', bytes: 6, sha256: digest('client') }] }));
  return { root, assets };
}

void test('artifact verifier accepts exact inputs and rejects tampering, extra files and symlinks', async () => {
  for (const mutation of ['none', 'asset', 'input', 'extra', 'missing', 'symlink']) {
    const { root, assets } = await fixture();
    try {
      if (mutation === 'asset') await writeFile(path.join(assets, '_next/static/chunks/a.js'), 'edited');
      if (mutation === 'input') await writeFile(path.join(root, 'cloudflare/worker-preview-policy.mjs'), 'edited');
      if (mutation === 'extra') await writeFile(path.join(assets, '_worker.bundle.js'), 'server source');
      if (mutation === 'missing') await rm(path.join(assets, '_next/static/chunks/a.js'));
      if (mutation === 'symlink') {
        await rm(path.join(assets, '_next/static/chunks/a.js'));
        await symlink(path.join(root, 'dist/client/_worker.bundle.js'), path.join(assets, '_next/static/chunks/a.js'));
      }
      if (mutation === 'none') await verifyWorkerPreviewArtifact(root);
      else await assert.rejects(verifyWorkerPreviewArtifact(root), undefined, mutation);
    } finally { await rm(root, { recursive: true, force: true }); }
  }
});
