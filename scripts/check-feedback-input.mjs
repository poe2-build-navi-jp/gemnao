import assert from 'node:assert/strict';
import { build } from 'esbuild';
const result = await build({
  entryPoints: ['app/api/feedback/route.ts'],
  bundle: true,
  write: false,
  platform: 'node',
  format: 'esm',
  plugins: [
    {
      name: 'isolated-feedback-boundaries',
      setup(builder) {
        builder.onResolve({ filter: /^next\/server$/ }, () => ({
          path: 'response',
          namespace: 'test',
        }));
        builder.onResolve({ filter: /feedback-db$/ }, () => ({
          path: 'database',
          namespace: 'test',
        }));
        builder.onLoad({ filter: /.*/, namespace: 'test' }, ({ path }) => ({
          contents:
            path === 'response'
              ? 'export const NextResponse = {json: (body, options) => Response.json(body, options)};'
              : 'const fail=()=>{throw new Error("Invalid input reached database")}; export const incrementFeedback=fail,incrementSolutionMethod=fail,readSolutionMethods=fail,readFeedback=fail,recordStepSolved=fail;',
          loader: 'js',
        }));
      },
    },
  ],
});
const { POST } = await import(
  `data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`
);
const invalid = [
  null,
  [],
  { game: 123, topic: 'launch', kind: 'method' },
  { game: 'aniimo', topic: 'launch', kind: 'method', method: 123, label: 'x' },
  { game: 'aniimo', topic: 'launch', kind: 'method', method: 'a', label: {} },
  {
    game: 'guide-verify-steam-files',
    topic: 'launch',
    kind: 'step-solved',
    method: 'unknown',
  },
  {
    game: 'guide-verify-steam-files',
    topic: 'launch',
    kind: 'method',
    method: 'step-1',
    label: 'untrusted',
  },
];
for (const body of invalid)
  assert.equal((await POST({ json: async () => body })).status, 400);
assert.equal(
  (
    await POST({
      json: async () => {
        throw new Error('Malformed JSON');
      },
    })
  ).status,
  400,
);
console.log(
  'PASS: malformed JSON, wrong types, unknown step and legacy article method rejected before database',
);
