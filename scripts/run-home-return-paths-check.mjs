import { build } from 'esbuild';
import { writeFile, unlink } from 'node:fs/promises';

for (const [name, interaction] of [
  ['home-return-paths', false],
  ['home-search-interactions', true],
]) {
  const result = await build({
    entryPoints: [`scripts/check-${name}.tsx`],
    platform: 'node',
    format: 'esm',
    target: 'node22',
    bundle: true,
    packages: 'external',
    write: false,
    logLevel: 'warning',
    plugins: interaction
      ? [
          {
            name: 'home-hooks',
            setup(build) {
              build.onResolve({ filter: /^react$/ }, (args) =>
                args.importer.endsWith('/components/wiki-home.tsx')
                  ? { path: 'home-hooks', namespace: 'home-test' }
                  : undefined,
              );
              build.onLoad({ filter: /.*/, namespace: 'home-test' }, () => ({
                contents: `
          export const useMemo = (fn) => fn();
          export const useEffect = () => {};
          export const useRef = () => globalThis.__homeRef;
          export const useState = () => {
            const index = globalThis.__homeIndex++;
            return [globalThis.__homeValues[index], (value) => { globalThis.__homeValues[index] = value; }];
          };
        `,
              }));
            },
          },
        ]
      : [],
  });
  const output = new URL(`./.${name}-check.mjs`, import.meta.url);
  try {
    await writeFile(output, result.outputFiles[0].contents);
    await import(output.href);
  } finally {
    await unlink(output);
  }
}
