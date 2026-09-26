// npm build runs this after the article registry is bundled. The same STEP
// titles feed the page, the portrait graphic and the social preview.
import { build } from 'esbuild';
import { spawnSync } from 'node:child_process';

const result = await build({
  entryPoints: ['lib/visual-guides.ts'],
  bundle: true,
  write: false,
  platform: 'node',
  format: 'esm',
});
const { visualGuides } = await import(
  `data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`
);
const process = spawnSync('python3', ['scripts/render-visuals.py'], {
  input: JSON.stringify(visualGuides),
  encoding: 'utf8',
  maxBuffer: 1024 * 1024,
});
if (process.stdout) console.log(process.stdout.trim());
if (process.stderr) console.error(process.stderr.trim());
if (process.status !== 0) throw new Error('Visual asset generation failed');
