// JSX/hook boundary tests, not a substitute for viewport/browser QA.
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { writeFile, unlink } from 'node:fs/promises';
const output = new URL('./.step-result-ui-check.mjs', import.meta.url);
const h = {
  slots: [],
  cursor: 0,
  effects: [],
  activeCase: 'case-a',
  notes: [],
};
globalThis.__stepUI = h;
const compiled = await build({
  entryPoints: ['components/interactive-steps.tsx'],
  bundle: true,
  write: false,
  platform: 'node',
  format: 'esm',
  packages: 'external',
  plugins: [
    {
      name: 'isolated-step-hooks',
      setup(b) {
        b.onResolve({ filter: /^react$/ }, () => ({
          path: 'react',
          namespace: 'fixture',
        }));
        b.onResolve(
          {
            filter:
              /\/(use-saved-solutions|support-workspace|result-note|save-solution|troubleshooting-product|analytics)$/,
          },
          (args) => ({
            path: args.path.split('/').at(-1),
            namespace: 'fixture',
          }),
        );
        b.onLoad({ filter: /.*/, namespace: 'fixture' }, ({ path }) => ({
          contents:
            path === 'react'
              ? `
 const h=globalThis.__stepUI;
 export function useState(initial){const i=h.cursor++;if(!(i in h.slots))h.slots[i]=typeof initial==='function'?initial():initial;return [h.slots[i],v=>{h.slots[i]=typeof v==='function'?v(h.slots[i]):v;}];}
 export function useRef(initial){const i=h.cursor++;if(!(i in h.slots))h.slots[i]={current:initial};return h.slots[i];}
 export function useEffect(fn,deps){const i=h.cursor++;const old=h.slots[i];if(!old||deps.some((v,j)=>v!==old[j])){h.slots[i]=deps;h.effects.push(fn);}}
 export const useMemo=fn=>fn();
 `
              : path === 'use-saved-solutions'
                ? 'export const useSavedSolutions=()=>({items:globalThis.__stepUI.notes});'
                : path === 'support-workspace'
                  ? 'export const useActiveCase=()=>globalThis.__stepUI.activeCase;'
                  : path === 'analytics'
                    ? 'export const trackEvent=(...args)=>globalThis.__stepUI.analytics.push(args);'
                    : `export const ${{ 'result-note': 'ResultNote', 'save-solution': 'SaveSolution', 'troubleshooting-product': 'TroubleshootingProduct' }[path]}=()=>null;`,
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
Object.defineProperty(globalThis, 'navigator', {
  value: {},
  configurable: true,
});
let posts = [],
  capability = true,
  postHandler = async () => Response.json({ ok: true });
let getHandler = async () =>
  Response.json({ rows: [], methods: [], stepResultsAvailable: capability });
globalThis.fetch = async (url, options) => {
  if (options?.method === 'POST') {
    const body = JSON.parse(options.body);
    posts.push(body);
    return postHandler(body);
  }
  return getHandler();
};
const props = {
  contextSlug: 'guide-ui-fixture',
  topic: 'display',
  articleTitle: 'Fixture',
  articlePath: '/guide/ui-fixture',
  steps: [
    { id: 'one', title: 'First', actions: ['Try first'] },
    { id: 'two', title: 'Second', actions: ['Try second'] },
  ],
};
function all(node, predicate, result = []) {
  if (Array.isArray(node)) node.forEach((n) => all(n, predicate, result));
  else if (node && typeof node === 'object' && node.props) {
    if (predicate(node)) result.push(node);
    all(node.props.children, predicate, result);
  }
  return result;
}
function text(node) {
  if (Array.isArray(node)) return node.map(text).join('');
  if (node && typeof node === 'object') return text(node.props?.children);
  return typeof node === 'string' || typeof node === 'number'
    ? String(node)
    : '';
}
const button = (tree, label) =>
  all(tree, (n) => n.type === 'button' && text(n).includes(label))[0];
const flush = async () => {
  for (let i = 0; i < 8; i++)
    await new Promise((resolve) => setImmediate(resolve));
};
try {
  await writeFile(output, compiled.outputFiles[0].contents);
  const { InteractiveSteps } = await import(output.href);
  const render = (extra = {}) => {
    h.cursor = 0;
    const tree = InteractiveSteps({ ...props, ...extra });
    for (const effect of h.effects.splice(0)) effect();
    return tree;
  };
  const reset = () => {
    h.slots = [];
    h.cursor = 0;
    h.effects = [];
    h.activeCase = 'case-a';
    h.notes = [];
    h.analytics = [];
    posts = [];
  };
  reset();
  let tree = render();
  await flush();
  tree = render();
  assert.ok(text(tree).includes('症状・STEP・結果を匿名'));
  // An intermediate negative click progresses and offers a private note; only
  // the explicit public identifiers/result enter the network payload.
  button(tree, '試したが直らない').props.onClick();
  await flush();
  tree = render();
  assert.equal(posts.length, 1);
  assert.equal(posts[0].method, 'one');
  assert.equal(posts[0].outcome, 'not-resolved');
  assert.equal(posts[0].reportStruggling, false);
  assert.ok(text(tree).includes('匿名回答を記録しました'));
  assert.equal(
    all(tree, (n) => n.props.attempt?.stepId === 'one')[0].props.attempt.result,
    'unresolved',
  );
  assert.equal(h.analytics.length, 0, 'new outcome payload never goes to GA');
  // Same anonymous negative action does not count again, but note actions remain.
  button(tree, '試したが直らない').props.onClick();
  await flush();
  tree = render();
  assert.equal(posts.length, 1);
  assert.ok(all(tree, (n) => n.props.attempt?.stepId === 'one').length);
  // Failure remains retryable after local solved state disables the action.
  postHandler = async () => {
    throw Error('offline');
  };
  button(tree, 'これで直った').props.onClick();
  await flush();
  tree = render();
  assert.ok(button(tree, '同じ回答を再送'));
  const failed = posts.at(-1);
  assert.equal(button(tree, 'この方法で解決済み').props.disabled, true);
  postHandler = async () => Response.json({ ok: true });
  button(tree, '同じ回答を再送').props.onClick();
  await flush();
  tree = render();
  assert.equal(posts.at(-1).requestId, failed.requestId);
  assert.ok(!button(tree, '同じ回答を再送'));
  // An old request completion is attached only to its captured saved-case scope.
  reset();
  const switched = {
    ...props,
    contextSlug: 'guide-ui-switch',
    articlePath: '/guide/ui-switch',
  };
  tree = render(switched);
  await flush();
  tree = render(switched);
  let release;
  postHandler = () =>
    new Promise((resolve) => {
      release = resolve;
    });
  button(tree, '試したが直らない').props.onClick();
  await flush();
  h.activeCase = 'case-b';
  tree = render(switched);
  assert.ok(!text(tree).includes('送信中'));
  release(Response.json({ ok: true }));
  await flush();
  tree = render(switched);
  assert.ok(!text(tree).includes('匿名回答を記録しました'));
  assert.equal(
    all(tree, (n) => Boolean(n.props.attempt)).length,
    0,
    'case B receives no result note from case A',
  );
  h.activeCase = 'case-a';
  tree = render(switched);
  assert.ok(text(tree).includes('匿名回答を記録しました'));
  // No capability: never send the new kind for an intermediate failure.
  reset();
  capability = false;
  postHandler = async () => Response.json({ ok: true });
  tree = render({ contextSlug: 'guide-ui-old' });
  await flush();
  tree = render({ contextSlug: 'guide-ui-old' });
  assert.ok(text(tree).includes('現在このページでは利用できません'));
  button(tree, '試したが直らない').props.onClick();
  await flush();
  assert.equal(posts.length, 0);
  // Prerequisite recognition and skip/next links are navigation, never votes.
  reset();
  capability = true;
  const prerequisite = {
    ...props,
    contextSlug: 'guide-ui-check',
    steps: [
      {
        ...props.steps[0],
        advanceCheck: {
          prompt: 'Check recognition',
          resolvedLabel: '音が出た',
          unresolvedLabel: '認識されない',
          unresolvedHref: '/guide/check',
          confirmedLabel: '認識できた',
        },
      },
      props.steps[1],
    ],
  };
  tree = render(prerequisite);
  await flush();
  tree = render(prerequisite);
  all(
    tree,
    (n) => n.type === 'a' && text(n) === '認識できた',
  )[0].props.onClick();
  await flush();
  assert.equal(posts.length, 0);
  assert.ok(
    !all(
      tree,
      (n) => n.type === 'button' && text(n).includes('試したが直らない'),
    ).some((n) => n.props.onClick === undefined),
  );
  // Saving the same private note revision must not swallow a late failure.
  reset();
  const savedProps = {
    ...props,
    contextSlug: 'guide-ui-save-race',
    articlePath: '/guide/ui-save-race',
  };
  h.notes = [
    {
      id: 'case-a',
      articlePath: savedProps.articlePath,
      stepId: 'one',
      status: 'investigating',
      updatedAt: '2026-10-01',
    },
  ];
  tree = render(savedProps);
  await flush();
  tree = render(savedProps);
  let rejectPost;
  postHandler = () =>
    new Promise((_, reject) => {
      rejectPost = reject;
    });
  button(tree, 'これで直った').props.onClick();
  await flush();
  const savedRequest = posts.at(-1);
  h.notes = [{ ...h.notes[0], status: 'resolved', updatedAt: '2026-10-02' }];
  tree = render(savedProps);
  rejectPost(Error('offline'));
  await flush();
  tree = render(savedProps);
  assert.ok(
    button(tree, '同じ回答を再送'),
    'saved revision keeps original submission retry',
  );
  assert.equal(
    all(tree, (n) => Boolean(n.props.attempt)).length,
    0,
    'saved revision does not resurrect private draft',
  );
  postHandler = async () => Response.json({ ok: true });
  button(tree, '同じ回答を再送').props.onClick();
  await flush();
  tree = render(savedProps);
  assert.equal(posts.at(-1).requestId, savedRequest.requestId);
  // After reload/new private case, original public request can be recovered
  // even when a different local solved STEP disabled the article buttons.
  reset();
  const recoveryProps = {
    ...props,
    contextSlug: 'guide-ui-recovery',
    articlePath: '/guide/ui-recovery',
  };
  const pending = {
    game: recoveryProps.contextSlug,
    topic: 'display',
    method: 'one',
    outcome: 'resolved',
    reportStruggling: false,
    requestId: crypto.randomUUID(),
    requestedAt: new Date().toISOString(),
  };
  values.set(
    `gemnao-feedback:${pending.game}:display:resolved:request`,
    JSON.stringify(pending),
  );
  tree = render(recoveryProps);
  await flush();
  tree = render(recoveryProps);
  all(
    tree,
    (n) => n.type === 'button' && text(n).includes('これで直った'),
  )[1].props.onClick();
  await flush();
  tree = render(recoveryProps);
  assert.equal(
    posts.length,
    0,
    'conflicting STEP never relabels pending write',
  );
  assert.ok(button(tree, '元の回答の送信を確認'));
  const beforeDraft = all(tree, (n) => Boolean(n.props.attempt))[0].props
    .attempt;
  button(tree, '元の回答の送信を確認').props.onClick();
  await flush();
  tree = render(recoveryProps);
  assert.equal(posts[0].method, 'one');
  assert.equal(posts[0].requestId, pending.requestId);
  assert.deepEqual(
    all(tree, (n) => Boolean(n.props.attempt))[0].props.attempt,
    beforeDraft,
    'public recovery cannot edit private outcome',
  );
  // No legacy fallback while capability is unresolved or failed.
  reset();
  let releaseGet;
  getHandler = () =>
    new Promise((resolve) => {
      releaseGet = resolve;
    });
  const loadingProps = { ...props, contextSlug: 'guide-ui-loading' };
  tree = render(loadingProps);
  await flush();
  button(tree, 'これで直った').props.onClick();
  await flush();
  tree = render(loadingProps);
  assert.equal(posts.length, 0);
  assert.equal(h.analytics.length, 0);
  assert.ok(text(tree).includes('回答は送信していません'));
  releaseGet(
    Response.json({ rows: [], methods: [], stepResultsAvailable: true }),
  );
  await flush();
  tree = render(loadingProps);
  assert.ok(
    button(tree, '同じ回答を再送'),
    'explicit send is offered once capability is known',
  );
  reset();
  getHandler = async () => {
    throw Error('GET failed');
  };
  const unavailableProps = { ...props, contextSlug: 'guide-ui-unavailable' };
  tree = render(unavailableProps);
  await flush();
  tree = render(unavailableProps);
  button(tree, 'これで直った').props.onClick();
  await flush();
  tree = render(unavailableProps);
  assert.equal(posts.length, 0);
  assert.equal(h.analytics.length, 0);
  assert.ok(!button(tree, '同じ回答を再送'));
  console.log(
    'PASS: capability disclosure, intermediate result/note separation, repeat-click dedupe, solved failure/retry, captured-case completion isolation, no new GA events, old-schema no-new-write, prerequisite navigation; saved-revision retry; original-request recovery across reload/cases; loading/error no legacy fallback. Shallow JSX/hook tests only.',
  );
} finally {
  await unlink(output);
  delete globalThis.__stepUI;
}
