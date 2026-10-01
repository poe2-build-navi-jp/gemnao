// Bundles scripts/check-localized-pages.tsx (path alias @ → repo root) and runs it.
import { build } from 'esbuild';
import { spawnSync } from 'node:child_process';

// Inside node_modules so the bundle resolves the project's packages.
const outfile = 'node_modules/.cache/gemnao/check-localized-pages.mjs';
await build({
  entryPoints: ['scripts/check-localized-pages.tsx'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  jsx: 'automatic',
  alias: { '@': '.' },
  packages: 'external',
  outfile,
  logLevel: 'error',
});
const run = spawnSync('node', [outfile], { stdio: 'inherit' });
process.exit(run.status ?? 1);
