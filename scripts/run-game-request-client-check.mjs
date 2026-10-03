import { build } from 'esbuild';
import { writeFile, unlink } from 'node:fs/promises';
const result = await build({
  entryPoints: ['scripts/check-game-request-client.tsx'],
  platform: 'node',
  format: 'esm',
  target: 'node22',
  bundle: true,
  packages: 'external',
  write: false,
  logLevel: 'warning',
});
const output = new URL('./.game-request-client-check.mjs', import.meta.url);
try {
  await writeFile(output, result.outputFiles[0].contents);
  await import(output.href);
} finally {
  await unlink(output);
}
const interactions = await build({
  entryPoints: ['scripts/check-game-request-interactions.tsx'],
  platform: 'node',
  format: 'esm',
  target: 'node22',
  bundle: true,
  packages: 'external',
  write: false,
  logLevel: 'warning',
  plugins: [
    {
      name: 'shallow-request-hooks',
      setup(builder) {
        builder.onResolve({ filter: /^react$/ }, () => ({
          path: 'hooks',
          namespace: 'shallow',
        }));
        builder.onLoad({ filter: /.*/, namespace: 'shallow' }, () => ({
          contents: `
      export const useState = () => { const i = globalThis.__index++; return [globalThis.__states[i], value => { globalThis.__states[i] = typeof value === 'function' ? value(globalThis.__states[i]) : value; }]; };
      export const useRef = current => { const i = globalThis.__refIndex++; return globalThis.__refs[i] ??= {current}; };
      export const useId = () => 'test-request';
      export const useEffect = () => {};
    `,
        }));
      },
    },
  ],
});
const interactionOutput = new URL(
  './.game-request-interactions-check.mjs',
  import.meta.url,
);
try {
  await writeFile(interactionOutput, interactions.outputFiles[0].contents);
  await import(interactionOutput.href);
} finally {
  await unlink(interactionOutput);
}
