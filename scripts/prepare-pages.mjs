import { unlink } from 'node:fs/promises';
import { build } from 'esbuild';

await build({
  entryPoints: ['cloudflare/worker-wrapper.mjs'],
  outfile: 'dist/client/_worker.js',
  bundle: true,
  format: 'esm',
  platform: 'node',
  external: ['cloudflare:workers'],
});

// Cloudflare Pages validates every generated Wrangler configuration it finds.
// Vinext's server config is for Workers and contains `main`/`assets`, which
// conflicts with this Pages project's `pages_build_output_dir` config.
await unlink('dist/server/wrangler.json').catch((error) => {
  if (error?.code !== 'ENOENT') throw error;
});
