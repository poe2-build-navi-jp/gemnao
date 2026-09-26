import { build } from 'esbuild';

const result = await build({
  entryPoints: ['scripts/freshness-report.ts'],
  platform: 'node',
  format: 'esm',
  target: 'node22',
  bundle: true,
  write: false,
  logLevel: 'warning',
});
await import(
  `data:text/javascript;base64,${Buffer.from(result.outputFiles[0].contents).toString('base64')}`
);
