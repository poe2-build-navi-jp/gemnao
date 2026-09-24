import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { readFile, readdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { Miniflare } = createRequire(require.resolve('wrangler/package.json'))(
  'miniflare',
);
const compiled = await build({
  stdin: {
    contents: `import {GET,POST} from './app/api/feedback/route.ts'; export default {fetch(request) {return request.method === 'POST' ? POST(request) : GET({nextUrl: new URL(request.url)});}};`,
    resolveDir: process.cwd(),
    loader: 'ts',
  },
  bundle: true,
  write: false,
  format: 'esm',
  platform: 'browser',
  external: ['cloudflare:workers'],
  plugins: [
    {
      name: 'next-response',
      setup(b) {
        b.onResolve({ filter: /^next\/server$/ }, () => ({
          path: 'response',
          namespace: 'test',
        }));
        b.onLoad({ filter: /.*/, namespace: 'test' }, () => ({
          contents:
            'export const NextResponse={json:(body,options)=>Response.json(body,options)}',
        }));
      },
    },
  ],
});
const mf = new Miniflare({
  modules: true,
  script: compiled.outputFiles[0].text,
  compatibilityDate: '2026-05-15',
  d1Databases: ['DB'],
});
try {
  const db = await mf.getD1Database('DB');
  for (const file of (await readdir('.openai/drizzle'))
    .filter((f) => f.endsWith('.sql'))
    .sort()) {
    const sql = await readFile(`.openai/drizzle/${file}`, 'utf8');
    for (const statement of sql
      .split(';')
      .map((s) => s.replace(/--> statement-breakpoint/g, '').trim())
      .filter(Boolean))
      await db.prepare(statement).run();
  }
  const game = 'guide-low-fps',
    topic = 'display';
  const get = async () =>
    (await mf.dispatchFetch(`http://test/api/feedback?game=${game}`)).json();
  const post = async (body) =>
    mf.dispatchFetch('http://test/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ game, topic, ...body }),
    });
  assert.deepEqual(await get(), { rows: [], methods: [] });
  for (let i = 0; i < 8; i++)
    assert.equal((await post({ kind: 'struggling' })).status, 200);
  let response = await post({
    kind: 'step-solved',
    method: 'step-2',
    label: 'untrusted',
  });
  let data = await response.json();
  assert.deepEqual(data.rows, [{ topic, struggling: 8, resolved: 1 }]);
  assert.equal(data.methods[0].responses, 1);
  assert.equal(data.methods[0].methodLabel, 'レイトレーシングと影を下げる');
  response = await post({ kind: 'step-solved', method: 'step-1' });
  data = await response.json();
  assert.deepEqual(data.rows, [{ topic, struggling: 8, resolved: 2 }]);
  assert.equal(
    data.methods.reduce((n, m) => n + m.responses, 0),
    2,
  );
  assert.deepEqual(await get(), { rows: data.rows, methods: data.methods });
  const before = await get();
  assert.equal(
    (await post({ kind: 'step-solved', method: 'unknown' })).status,
    400,
  );
  assert.equal(
    (await post({ kind: 'step-solved', method: 'step-1', topic: 'save' }))
      .status,
    400,
  );
  assert.deepEqual(await get(), before);
  // Historical rows from unrelated topics must not inflate article STEP counts.
  await db
    .prepare('INSERT INTO solution_method_feedback VALUES (?, ?, ?, ?, ?, ?)')
    .bind(game, 'save', 'step-1', 'wrong topic', 50, 'test')
    .run();
  assert.deepEqual(await get(), before);
  const plan = await db
    .prepare(
      'EXPLAIN QUERY PLAN SELECT * FROM solution_method_feedback WHERE context_slug=? AND topic=?',
    )
    .bind(game, topic)
    .all();
  assert(plan.results.some((row) => String(row.detail).includes('SEARCH')));
  console.log(
    'PASS: local D1 migrations, zero/9/10 totals, atomic solved+STEP writes, immediate GET, trusted labels, invalid STEP/topic rejection, topic isolation, indexed query. No production writes.',
  );
} finally {
  await mf.dispose();
}
