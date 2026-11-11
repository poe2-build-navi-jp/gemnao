import { build } from 'esbuild';
import { writeFile, unlink } from 'node:fs/promises';
const output = new URL('./.mw4-comparison-check.mjs', import.meta.url);
try {
  const result = await build({
    entryPoints: ['scripts/check-mw4-comparison.tsx'],
    bundle: true,
    platform: 'node',
    format: 'esm',
    jsx: 'automatic',
    alias: { '@': '.', 'next/navigation': 'vinext/shims/navigation' },
    packages: 'external',
    write: false,
    logLevel: 'error',
  });
  await writeFile(output, result.outputFiles[0].contents);
  await import(output.href);
} finally {
  await unlink(output).catch(() => {});
}
