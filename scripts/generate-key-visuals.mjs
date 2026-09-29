// Renders the keyboard diagrams listed in lib/key-visuals.ts (pnpm visuals:keys).
import { build } from 'esbuild';
import { spawnSync } from 'node:child_process';

const result = await build({
  entryPoints: ['lib/key-visuals.ts'],
  bundle: true,
  write: false,
  platform: 'node',
  format: 'esm',
});
const { keyVisuals, keyCheatSheets } = await import(
  `data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`
);
const run = spawnSync('python3', ['scripts/render-key-visuals.py'], {
  input: JSON.stringify({ visuals: keyVisuals, sheets: keyCheatSheets }),
  encoding: 'utf8',
});
if (run.stdout) console.log(run.stdout.trim());
if (run.stderr) console.error(run.stderr.trim());
if (run.status !== 0) throw new Error('Keyboard diagram generation failed');
