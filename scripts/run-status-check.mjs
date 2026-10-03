import { build } from 'esbuild';
import { writeFile, unlink } from 'node:fs/promises';

const result = await build({
  entryPoints: ['scripts/check-status.tsx'],
  platform: 'node',
  format: 'esm',
  target: 'node22',
  bundle: true,
  packages: 'external',
  write: false,
  logLevel: 'warning',
  plugins: [
    {
      name: 'status-test-runtime',
      setup(build) {
        build.onResolve({ filter: /^cloudflare:workers$/ }, () => ({
          path: 'cloudflare',
          namespace: 'status-test',
        }));
        build.onResolve({ filter: /^react$/ }, (args) =>
          args.importer.endsWith('/components/status-board.tsx')
            ? { path: 'hooks', namespace: 'status-test' }
            : undefined,
        );
        build.onLoad({ filter: /.*/, namespace: 'status-test' }, (args) => ({
          contents:
            args.path === 'cloudflare'
              ? 'export const env = {};'
              : `
      export const useEffect = (fn) => { globalThis.__statusEffect = fn; };
      export const useState = () => { const i = globalThis.__statusIndex++; return [globalThis.__statusValues[i], (value) => { globalThis.__statusValues[i] = typeof value === 'function' ? value(globalThis.__statusValues[i]) : value; }]; };
    `,
        }));
      },
    },
  ],
});
const output = new URL('./.status-check.mjs', import.meta.url);
try {
  await writeFile(output, result.outputFiles[0].contents);
  await import(output.href);
} finally {
  await unlink(output);
}
