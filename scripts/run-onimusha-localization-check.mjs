import { build } from 'esbuild';
import { spawnSync } from 'node:child_process';
const outfile = 'node_modules/.cache/gemnao/check-onimusha-localization.mjs';
await build({
  entryPoints: ['scripts/check-onimusha-localization.tsx'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  jsx: 'automatic',
  alias: { '@': '.', 'next/navigation': 'vinext/shims/navigation' },
  packages: 'external',
  outfile,
  logLevel: 'error',
});
const result = spawnSync('node', [outfile], { stdio: 'inherit' });
process.exit(result.status ?? 1);
