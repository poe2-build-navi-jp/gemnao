import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { writeFile, unlink } from 'node:fs/promises';
const h = { slots: [], cursor: 0, effects: [], context: null };
globalThis.__localizedResults = h;
const output = new URL('./.localized-results-check.mjs', import.meta.url);
const result = await build({
  entryPoints: ['components/step-result-collection.tsx'],
  bundle: true,
  write: false,
  platform: 'node',
  format: 'esm',
  packages: 'external',
  plugins: [
    {
      name: 'hooks',
      setup(b) {
        b.onResolve({ filter: /^react$/ }, () => ({
          path: 'react',
          namespace: 'test',
        }));
        b.onLoad({ filter: /.*/, namespace: 'test' }, () => ({
          contents: `
const h=globalThis.__localizedResults;
export const createContext=()=>({Provider:'provider'});
export const useContext=()=>h.context;
export function useState(initial){const i=h.cursor++;if(!(i in h.slots))h.slots[i]=initial;return[h.slots[i],v=>{h.slots[i]=typeof v==='function'?v(h.slots[i]):v}];}
export function useEffect(fn,deps){const i=h.cursor++;const previous=h.slots[i];if(!previous||deps.some((v,j)=>v!==previous[j])){h.slots[i]=deps;h.effects.push(fn);}}
`,
        }));
      },
    },
  ],
});
const values = new Map();
globalThis.localStorage = {
  getItem: (k) => values.get(k) || null,
  setItem: (k, v) => values.set(k, v),
  removeItem: (k) => values.delete(k),
};
const posts = [];
let ready = true,
  fail = false;
globalThis.fetch = async (url, options) => {
  if (options?.method === 'POST') {
    posts.push(JSON.parse(options.body));
    if (fail) throw Error('offline');
    return Response.json({ ok: true });
  }
  return Response.json({ rows: [], methods: [], stepResultsAvailable: ready });
};
const text = (n) =>
  Array.isArray(n)
    ? n.map(text).join('')
    : n && typeof n === 'object'
      ? text(n.props?.children)
      : typeof n === 'string'
        ? n
        : '';
const nodes = (n, p, out = []) => {
  if (Array.isArray(n)) n.forEach((x) => nodes(x, p, out));
  else if (n?.props) {
    if (p(n)) out.push(n);
    nodes(n.props.children, p, out);
  }
  return out;
};
const flush = async () => {
  for (let i = 0; i < 6; i++) await new Promise((r) => setImmediate(r));
};
try {
  await writeFile(output, result.outputFiles[0].contents);
  const { StepResultCollection, StepResultButtons } = await import(output.href);
  const steps = [
    { id: 'one', title: 'Step One' },
    { id: 'two', title: 'Step Two' },
  ];
  for (const locale of ['en', 'zh', 'es']) {
    h.slots = [];
    h.cursor = 0;
    h.effects = [];
    ready = false;
    fail = false;
    const props = {
      contextSlug: `localized-${locale}`,
      topic: 'launch',
      locale,
      steps,
      children: null,
    };
    const render = () => {
      h.cursor = 0;
      const tree = StepResultCollection(props);
      h.context = tree.props.value;
      for (const e of h.effects.splice(0)) e();
      return tree;
    };
    let tree = render();
    let controls = StepResultButtons({ method: 'one' });
    assert.ok(
      nodes(controls, (n) => n.type === 'button').every(
        (b) => b.props.disabled,
      ),
    );
    await flush();
    tree = render();
    assert.equal(h.context.ready, false);
    ready = true;
    nodes(tree, (n) => n.type === 'button')[0].props.onClick();
    tree = render();
    await flush();
    tree = render();
    assert.equal(h.context.ready, true);
    fail = true;
    controls = StepResultButtons({ method: 'one' });
    nodes(controls, (n) => n.type === 'button')[0].props.onClick();
    await flush();
    tree = render();
    controls = StepResultButtons({ method: 'one' });
    const original = posts.at(-1);
    assert.equal(original.outcome, 'resolved');
    assert.ok(nodes(controls, (n) => n.type === 'output').length);
    assert.ok(!/[ぁ-んァ-ヶ]/.test(text(tree) + text(controls)));
    fail = false;
    nodes(controls, (n) => n.type === 'button')
      .at(-1)
      .props.onClick();
    await flush();
    tree = render();
    controls = StepResultButtons({ method: 'one' });
    assert.equal(posts.at(-1).requestId, original.requestId);
    assert.equal(h.context.reports['one:resolved'].state, 'sent');
    const before = posts.length;
    nodes(controls, (n) => n.type === 'button')[0].props.onClick();
    await flush();
    tree = render();
    assert.equal(posts.length, before);
    assert.equal(h.context.reports['one:resolved'].state, 'already');
    controls = StepResultButtons({ method: 'two' });
    nodes(controls, (n) => n.type === 'button')[1].props.onClick();
    await flush();
    tree = render();
    assert.equal(posts.at(-1).reportStruggling, true);
    assert.equal(posts.at(-1).method, 'two');
  }
  console.log(
    'PASS: EN/ZH/ES loading/unavailable/reconnect, localized failure+same-token retry, repeated-result dedupe, final-only flag, no Japanese messages. Mocked transport only.',
  );
} finally {
  await unlink(output);
  delete globalThis.__localizedResults;
}
// Verify every surfaced translation uses the canonical shared STEP namespace.
const catalog = await build({
  stdin: {
    contents: `import{localizedArticles,localizedDiscordArticles}from'./lib/localized/index';import{articleSteps,articleFeedbackTopic}from'./lib/article-step-data';import{crashSectionsEn}from'./lib/localized/crash-guide-en';export const rows=[...localizedArticles.map(a=>({a,context:'game-'+a.gameSlug+'-'+a.slug})),...localizedDiscordArticles.map(a=>({a,context:'discord-'+a.slug}))];export{articleSteps,articleFeedbackTopic,crashSectionsEn};`,
    resolveDir: process.cwd(),
    loader: 'ts',
  },
  bundle: true,
  write: false,
  platform: 'node',
  format: 'esm',
});
const data = await import(
  'data:text/javascript;base64,' +
    Buffer.from(catalog.outputFiles[0].text).toString('base64')
);
assert.equal(data.rows.length, 39);
for (const { a, context } of data.rows) {
  assert.ok(data.articleFeedbackTopic(context));
  assert.deepEqual(
    a.steps.map((s) => s.id),
    data.articleSteps(context).map((s) => s.id),
  );
}
assert.deepEqual(
  data.crashSectionsEn
    .filter((s) => /^step-[123]$/.test(s.id))
    .map((s) => s.id),
  data.articleSteps('guide-pc-game-crash').map((s) => s.id),
);
console.log(
  'PASS: 39 translated articles plus English crash guide share exact canonical STEP IDs and article topics.',
);
