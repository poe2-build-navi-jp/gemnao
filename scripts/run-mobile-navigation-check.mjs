import { build } from 'esbuild';
import { writeFile, unlink } from 'node:fs/promises';
const result = await build({
  entryPoints: ['scripts/check-mobile-navigation.tsx'],
  platform: 'node',
  format: 'esm',
  target: 'node22',
  bundle: true,
  packages: 'external',
  write: false,
  logLevel: 'warning',
  plugins: [
    {
      name: 'mobile-hooks',
      setup(build) {
        build.onResolve({ filter: /^react$/ }, (args) =>
          args.importer.endsWith('/components/mobile-navigation.tsx')
            ? { path: 'mobile-hooks', namespace: 'mobile-test' }
            : undefined,
        );
        build.onLoad({ filter: /.*/, namespace: 'mobile-test' }, () => ({
          contents: `
        export const useState = () => [globalThis.__mobileOpen, (value) => {
          globalThis.__mobileOpen = typeof value === 'function' ? value(globalThis.__mobileOpen) : value;
        }];
        export const useRef = () => globalThis.__mobileTrigger;
        export const useEffect = (fn) => globalThis.__mobileEffects.push(fn);
      `,
        }));
      },
    },
  ],
});
const output = new URL('./.mobile-navigation-check.mjs', import.meta.url);
try {
  await writeFile(output, result.outputFiles[0].contents);
  await import(output.href);
} finally {
  await unlink(output);
}
