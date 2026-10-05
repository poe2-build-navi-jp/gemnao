Object.defineProperty(globalThis, 'window', { configurable: true, value: { location: { href: 'https://gemnao.pages.dev/' }, history: { state: null, replaceState() {} } } });
import assert from 'node:assert/strict';
import { WikiHome } from '../components/wiki-home';
import { RecentTroubles } from '../components/recent-troubles';

type Element = {
  type?: unknown;
  props?: { children?: unknown; [key: string]: unknown };
};
function find(
  node: unknown,
  match: (node: Element) => boolean,
): Element | undefined {
  if (Array.isArray(node)) {
    for (const child of node) {
      const result = find(child, match);
      if (result) return result;
    }
  } else if (node && typeof node === 'object') {
    const element = node as Element;
    return match(element) ? element : find(element.props?.children, match);
  }
}
const runtime = globalThis as unknown as {
  __homeValues: unknown[];
  __homeIndex: number;
  __homeRef: { current: { focus: () => void } };
};
let focused = 0;
runtime.__homeRef = {
  current: {
    focus: () => {
      focused++;
    },
  },
};
const render = (query = '', cluster = 'all') => {
  runtime.__homeValues = [query, cluster];
  runtime.__homeIndex = 0;
  return WikiHome({ view: 'articles' });
};
const click = (node: Element) => (node.props!.onClick as () => void)();
for (const example of ['Aniimo 黒画面', 'Steam 起動しない', 'Discord マイク']) {
  const tree = render('no-match', 'mod');
  const button = find(
    tree,
    (node) => node.props?.['aria-label'] === `${example}で検索`,
  )!;
  assert.equal(button.type, 'button');
  assert.equal(button.props!.type, 'button');
  click(button);
  assert.deepEqual(runtime.__homeValues, [example, 'all']);
  const results = render(example);
  assert.ok(
    find(results, (node) => node.props?.className === 'search-result-summary'),
  );
  assert.ok(!find(results, (node) => node.props?.id === 'home-tools'));
  assert.ok(!find(results, (node) => node.props?.id === 'symptoms'));
  const clear = find(
    results,
    (node) => node.props?.className === 'clear-search',
  )!;
  click(clear);
  assert.equal(runtime.__homeValues[0], '');
}
assert.equal(
  focused,
  6,
  'example and clear controls return keyboard focus to the search input',
);
const children = render().props.children as unknown as Element[];
assert.ok(
  children.findIndex((node) => node?.type === RecentTroubles) <
    children.findIndex((node) => node?.props?.id === 'home-tools'),
);
const noResults = render('an-unknown-game-that-is-not-covered');
assert.ok(
  find(noResults, (node) => node.props?.className === 'search-no-results'),
);
console.log(
  'PASS: example click/filter reset, results visibility, clear focus, empty recovery, recent-before-tools',
);
