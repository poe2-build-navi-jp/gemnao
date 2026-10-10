import { build } from 'esbuild';
import { writeFile, unlink } from 'node:fs/promises';

const result = await build({
  entryPoints: ['scripts/check-game-request-admin.tsx'],
  platform: 'node',
  format: 'esm',
  target: 'node22',
  bundle: true,
  packages: 'external',
  write: false,
  logLevel: 'warning',
  plugins: [
    {
      name: 'shallow-admin-hooks',
      setup(builder) {
        builder.onResolve({ filter: /^react$/ }, () => ({
          path: 'hooks',
          namespace: 'shallow',
        }));
        builder.onLoad({ filter: /.*/, namespace: 'shallow' }, () => ({
          contents: `
            export const useState = initial => {
              const index = globalThis.__index++;
              if (!(index in globalThis.__states)) globalThis.__states[index] = typeof initial === 'function' ? initial() : initial;
              return [globalThis.__states[index], value => { globalThis.__states[index] = typeof value === 'function' ? value(globalThis.__states[index]) : value; }];
            };
            export const useRef = current => {
              const index = globalThis.__refIndex++;
              return globalThis.__refs[index] ??= {current};
            };
            export const useEffect = effect => {
              const index = globalThis.__effectIndex++;
              if (!(index in globalThis.__effects)) globalThis.__effects[index] = effect() ?? (() => {});
            };
          `,
        }));
      },
    },
  ],
});
const output = new URL('./.game-request-admin-check.mjs', import.meta.url);
try {
  await writeFile(output, result.outputFiles[0].contents);
  await import(output.href);
} finally {
  await unlink(output);
}
