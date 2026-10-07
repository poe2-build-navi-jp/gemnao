import { build } from 'esbuild';
import { mkdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
await mkdir('.wrangler/diagnosis-tests', { recursive: true });
const entries = process.argv.slice(2);
await build({
  entryPoints: entries.length ? entries : ['tests/diagnosis/rules.test.ts'],
  outdir: '.wrangler/diagnosis-tests',
  bundle: true,
  format: 'esm',
  platform: 'node',
  packages: 'external',
});
const files = (
  entries.length ? entries : ['tests/diagnosis/rules.test.ts']
).map(
  (f) =>
    '.wrangler/diagnosis-tests/' + f.split('/').pop().replace(/\.ts$/, '.js'),
);
const result = spawnSync(process.execPath, ['--test', ...files], {
  stdio: 'inherit',
});
process.exitCode = result.status ?? 1;
