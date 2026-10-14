// Real form callbacks with synthetic storage/hooks/gtag only; no network.
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { mkdir } from 'node:fs/promises';
await mkdir('.wrangler/growth-review', { recursive: true });
const hooks = { slots: [], cursor: 0 };
globalThis.__growthSaveHooks = hooks;
await build({
  stdin: {
    contents: `export {SolutionForm} from './components/solution-form';
      export {parseSolutions,SOLUTIONS_KEY} from './lib/saved-solutions';
      export {resolvedDraft} from './lib/fix-save';`,
    loader: 'tsx',
    resolveDir: process.cwd(),
  },
  jsx: 'automatic',
  bundle: true,
  platform: 'node',
  format: 'esm',
  packages: 'external',
  outfile: '.wrangler/growth-review/save-handlers.mjs',
  plugins: [
    {
      name: 'synthetic-hooks',
      setup(b) {
        b.onResolve({ filter: /^react$/ }, () => ({
          path: 'react',
          namespace: 'fixture',
        }));
        b.onResolve({ filter: /\/use-saved-solutions$/ }, () => ({
          path: 'announce',
          namespace: 'fixture',
        }));
        b.onLoad({ filter: /.*/, namespace: 'fixture' }, ({ path }) => ({
          contents:
            path === 'announce'
              ? 'export const announceMyData=()=>{};'
              : `const h=globalThis.__growthSaveHooks;
      export function useState(v){const i=h.cursor++;if(!(i in h.slots))h.slots[i]=v;return [h.slots[i],v=>{h.slots[i]=typeof v==='function'?v(h.slots[i]):v;}];}
      export function useRef(v){const i=h.cursor++;if(!(i in h.slots))h.slots[i]={current:v};return h.slots[i];}`,
        }));
      },
    },
  ],
});
const m = await import('../.wrangler/growth-review/save-handlers.mjs');
let values, events, quota;
globalThis.localStorage = {
  getItem: (k) => values.get(k) ?? null,
  setItem: (k, v) => {
    if (quota) throw Error('quota');
    values.set(k, v);
  },
};
globalThis.window = {
  location: {
    hostname: 'gemnao.pages.dev',
    pathname: '/games/monster-hunter-wilds/not-launching',
    origin: 'https://gemnao.pages.dev',
  },
  gtag: (...args) => events.push(args),
};
globalThis.location = globalThis.window.location;
globalThis.fetch = () => {
  throw Error('Network is forbidden in this test');
};
function all(node, predicate, result = []) {
  if (Array.isArray(node)) node.forEach((n) => all(n, predicate, result));
  else if (node?.props) {
    if (predicate(node)) result.push(node);
    all(node.props.children, predicate, result);
  }
  return result;
}
function reset() {
  hooks.slots = [];
  hooks.cursor = 0;
  values = new Map();
  events = [];
  quota = false;
}
function render(props) {
  hooks.cursor = 0;
  return m.SolutionForm(props);
}
const attempt = {
  path: '/games/monster-hunter-wilds/not-launching',
  stepId: 'steam-client-isolation',
  label: 'synthetic fix',
  result: 'resolved',
  at: '2026-10-14T00:00:00.000Z',
};
let cases = 0;
for (const locale of ['ja', 'en', 'zh', 'es']) {
  reset();
  const draft = m.resolvedDraft(
    'game-monster-hunter-wilds-not-launching',
    attempt.stepId,
    'Synthetic private title',
    locale,
  );
  const props = {
    initial: draft,
    attempt,
    locale,
    onSaved: () => {},
    onCancel: () => {},
  };
  let tree = render(props);
  const notes = all(tree, (n) => n.type === 'textarea').at(-1);
  const limit = notes.props.maxLength;
  assert.ok(limit < 4000 && limit > 3500);
  notes.props.onChange({ target: { value: 'n'.repeat(limit) } });
  all(tree, (n) => n.type === 'input')
    .at(-1)
    .props.onChange({ target: { value: 'v'.repeat(120) } });
  tree = render(props);
  const submit = () => tree.props.onSubmit({ preventDefault() {} });
  quota = true;
  submit();
  assert.equal(values.get(m.SOLUTIONS_KEY), undefined);
  assert.equal(events.length, 0);
  quota = false;
  submit();
  submit();
  submit();
  const saved = m.parseSolutions(values.get(m.SOLUTIONS_KEY));
  assert.equal(saved.length, 1);
  assert.equal(saved[0].notes.length, 4000);
  assert.ok(saved[0].notes.startsWith('n'.repeat(limit)));
  assert.ok(saved[0].notes.includes('v'.repeat(120)));
  assert.ok(saved[0].notes.includes('2026-10-13'));
  assert.equal(events.length, 1);
  assert.equal(events[0][1], 'solution_saved');
  assert.ok(!JSON.stringify(events).includes('Synthetic private title'));
  // Editing a saved record preserves the full existing 4000-character budget.
  hooks.slots = [];
  const edit = {
    ...props,
    id: saved[0].id,
    initial: { ...saved[0], notes: 'e'.repeat(4000) },
  };
  tree = render(edit);
  assert.equal(
    all(tree, (n) => n.type === 'textarea').at(-1).props.maxLength,
    4000,
  );
  assert.equal(all(tree, (n) => n.type === 'input').length, 1);
  tree.props.onSubmit({ preventDefault() {} });
  assert.equal(
    m.parseSolutions(values.get(m.SOLUTIONS_KEY))[0].notes,
    'e'.repeat(4000),
  );
  assert.equal(events.length, 1);
  cases += 3;
}
console.log(
  `PASS: ${cases} real detailed-save callback scenarios across four languages; maximum notes/version, failed storage retry, repeated submit, legacy edit and private analytics.`,
);
