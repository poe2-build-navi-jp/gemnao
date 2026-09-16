import { copyFile, unlink } from 'node:fs/promises';
import { build } from 'esbuild';

await build({
  entryPoints: ['cloudflare/worker-source.mjs'],
  outfile: 'dist/client/_worker.bundle.js',
  bundle: true,
  format: 'esm',
  platform: 'node',
  external: ['cloudflare:workers'],
});

// Keep `_worker.js` as a tiny stable entry point. The Cloudflare project still
// has a legacy post-build copy command for this file, so copying it again is
// harmless and no dashboard change is required.
await copyFile('cloudflare/worker-wrapper.mjs', 'dist/client/_worker.js');

// Cloudflare Pages validates every generated Wrangler configuration it finds.
// Vinext's server config is for Workers and contains `main`/`assets`, which
// conflicts with this Pages project's `pages_build_output_dir` config.
await unlink('dist/server/wrangler.json').catch((error) => {
  if (error?.code !== 'ENOENT') throw error;
});
