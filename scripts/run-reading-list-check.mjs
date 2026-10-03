import { build } from 'esbuild';
import { writeFile, unlink } from 'node:fs/promises';

async function run(suffix, plugins = []) {
  const result = await build({
    entryPoints: ['scripts/check-reading-list.tsx'],
    platform: 'node',
    format: 'esm',
    target: 'node22',
    bundle: true,
    packages: 'external',
    write: false,
    logLevel: 'warning',
    plugins,
  });
  const output = new URL(
    `./.reading-list-${suffix}-check.mjs`,
    import.meta.url,
  );
  try {
    await writeFile(output, result.outputFiles[0].contents);
    await import(output.href);
  } finally {
    await unlink(output);
  }
}

await run('storage');
globalThis.__readingListHookHarness = { enabled: true };
try {
  await run('hooks', [
    {
      name: 'reading-list-shallow-hooks',
      setup(build) {
        build.onResolve({ filter: /^react$/ }, () => ({
          path: 'react-hooks',
          namespace: 'shallow',
        }));
        build.onLoad({ filter: /.*/, namespace: 'shallow' }, () => ({
          contents: `
          export const useMemo = (calculate) => calculate();
          export const useSyncExternalStore = (subscribe, client, server) => {
            const harness = globalThis.__readingListHookHarness;
            harness.store = { subscribe, client, server };
            return harness.server ? server() : client();
          };
        `,
        }));
      },
    },
  ]);
} finally {
  delete globalThis.__readingListHookHarness;
}
