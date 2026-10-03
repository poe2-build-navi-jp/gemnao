import { build } from 'esbuild';
import { writeFile, unlink } from 'node:fs/promises';
const result = await build({
  entryPoints: ['scripts/check-reading-experience.tsx'],
  platform: 'node',
  format: 'esm',
  target: 'node22',
  bundle: true,
  packages: 'external',
  write: false,
  logLevel: 'warning',
});
const output = new URL('./.reading-experience-check.mjs', import.meta.url);
try {
  await writeFile(output, result.outputFiles[0].contents);
  await import(output.href);
} finally {
  await unlink(output);
}

const interactions = await build({
  entryPoints: ['scripts/check-reading-interactions.tsx'],
  platform: 'node',
  format: 'esm',
  target: 'node22',
  bundle: true,
  packages: 'external',
  write: false,
  logLevel: 'warning',
  plugins: [
    {
      name: 'shallow-react-hooks',
      setup(build) {
        build.onResolve({ filter: /^react$/ }, () => ({
          path: 'react-hooks',
          namespace: 'shallow',
        }));
        build.onLoad({ filter: /.*/, namespace: 'shallow' }, () => ({
          contents: `
      export const useMemo = (fn) => fn();
      export const useState = (initial) => [initial, (value) => globalThis.__readingUiStates.push(value)];
      export const useEffect = () => {};
      export const useSyncExternalStore = (_, client) => client();
    `,
        }));
      },
    },
  ],
});
const interactionOutput = new URL(
  './.reading-interactions-check.mjs',
  import.meta.url,
);
try {
  await writeFile(interactionOutput, interactions.outputFiles[0].contents);
  await import(interactionOutput.href);
} finally {
  await unlink(interactionOutput);
}
