import { build } from 'esbuild';
import { writeFile, unlink } from 'node:fs/promises';

const result = await build({
  entryPoints: ['scripts/check-my-games-analytics.tsx'],
  platform: 'node',
  format: 'esm',
  target: 'node22',
  bundle: true,
  packages: 'external',
  write: false,
  logLevel: 'warning',
});
const output = new URL('./.my-games-analytics-check.mjs', import.meta.url);
try {
  await writeFile(output, result.outputFiles[0].contents);
  await import(output.href);
} finally {
  await unlink(output);
}

// Shallow hooks expose the real JSX callbacks and persistence code for unit
// interaction tests. This does not claim to replace browser/hydration QA.
const interactions = await build({
  entryPoints: ['scripts/check-my-games-interactions.tsx'],
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
        export const useCallback = (callback) => callback;
        export const useMemo = (calculate) => calculate();
        export const useState = (initial) => [typeof initial === 'function' ? initial() : initial, () => {}];
        export const useRef = (current) => ({ current });
        export const useEffect = () => {};
        export const useSyncExternalStore = (_, client, server) =>
          globalThis.__myGamesServerSnapshot ? server() : client();
      `,
        }));
      },
    },
  ],
});
const interactionOutput = new URL(
  './.my-games-interactions-check.mjs',
  import.meta.url,
);
try {
  await writeFile(interactionOutput, interactions.outputFiles[0].contents);
  await import(interactionOutput.href);
} finally {
  await unlink(interactionOutput);
}
