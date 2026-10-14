import { build } from 'esbuild';
import { writeFile, unlink } from 'node:fs/promises';
const result = await build({
  entryPoints: ['scripts/check-play-plans.ts'],
  platform: 'node',
  format: 'esm',
  target: 'node22',
  bundle: true,
  packages: 'external',
  write: false,
  logLevel: 'warning',
});
const output = new URL('./.play-plans-check.mjs', import.meta.url);
try {
  await writeFile(output, result.outputFiles[0].contents);
  await import(output.href);
} finally {
  await unlink(output);
}
