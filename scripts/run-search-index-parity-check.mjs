import { build } from 'esbuild';
import { mkdir } from 'node:fs/promises';

const outfile = 'node_modules/.cache/gemnao/search-index-parity.mjs';
await mkdir('node_modules/.cache/gemnao', { recursive: true });
await build({
  entryPoints: ['scripts/check-search-index-parity.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  outfile,
  alias: { '@': '.' },
  logLevel: 'warning',
});
await import(`../${outfile}`);
