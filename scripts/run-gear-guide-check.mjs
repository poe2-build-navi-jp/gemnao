import { build } from 'esbuild';

const result = await build({
  entryPoints: ['scripts/check-gear-guide.tsx'],
  platform: 'node',
  format: 'esm',
  target: 'node22',
  bundle: true,
  packages: 'external',
  write: false,
  logLevel: 'warning',
});
// A temporary module beside this runner keeps external React imports resolvable.
const { writeFile, unlink } = await import('node:fs/promises');
const output = new URL('./.gear-guide-check.mjs', import.meta.url);
try {
  await writeFile(output, result.outputFiles[0].contents);
  await import(output.href);
} finally {
  await unlink(output);
}
