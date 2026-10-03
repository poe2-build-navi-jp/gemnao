import assert from 'node:assert/strict';
import { MobileNavigation } from '../components/mobile-navigation';

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
  __mobileOpen: boolean;
  __mobileEffects: (() => void | (() => void))[];
  window: {
    addEventListener: (
      name: string,
      fn: (event: { key: string }) => void,
    ) => void;
    removeEventListener: (
      name: string,
      fn: (event: { key: string }) => void,
    ) => void;
  };
};
const listeners = new Set<(event: { key: string }) => void>();
runtime.window = {
  addEventListener: (name, fn) => {
    assert.equal(name, 'keydown');
    listeners.add(fn);
  },
  removeEventListener: (name, fn) => {
    assert.equal(name, 'keydown');
    listeners.delete(fn);
  },
};
let cleanups: (() => void)[] = [];
const click = (node: Element) => (node.props!.onClick as () => void)();
for (const locale of ['ja', 'en', 'zh', 'es'] as const) {
  runtime.__mobileOpen = false;
  const render = () => {
    cleanups.forEach((fn) => fn());
    runtime.__mobileEffects = [];
    const tree = MobileNavigation({
      locale,
      root: locale === 'ja' ? '/' : `/${locale}`,
      gamesLabel: 'Games',
      basicsLabel: 'Basics',
      aboutLabel: 'About',
    });
    cleanups = runtime.__mobileEffects
      .map((fn) => fn())
      .filter((fn): fn is () => void => typeof fn === 'function');
    return tree;
  };
  const toggle = (tree: unknown) =>
    find(tree, (node) => node.props?.className === 'mobile-menu')!;
  let tree = render();
  assert.equal(toggle(tree).props!['aria-expanded'], false);
  assert.ok(!find(tree, (node) => node.type === 'aside'));
  click(toggle(tree));
  tree = render();
  assert.equal(toggle(tree).props!['aria-expanded'], true);
  assert.ok(find(tree, (node) => node.props?.id === 'mobile-navigation-panel'));
  listeners.forEach((fn) => fn({ key: 'a' }));
  assert.equal(runtime.__mobileOpen, true);
  listeners.forEach((fn) => fn({ key: 'Escape' }));
  tree = render();
  assert.equal(toggle(tree).props!['aria-expanded'], false);
  assert.equal(listeners.size, 0);
  click(toggle(tree));
  tree = render();
  click(
    find(
      tree,
      (node) => node.props?.className === 'mobile-navigation-backdrop',
    )!,
  );
  tree = render();
  assert.equal(toggle(tree).props!['aria-expanded'], false);
  click(toggle(tree));
  tree = render();
  click(toggle(tree));
  tree = render();
  assert.equal(toggle(tree).props!['aria-expanded'], false);
  assert.equal(listeners.size, 0);
}
console.log(
  'PASS: four-language mobile menu handler tests: repeated toggle, backdrop dismissal, Escape dismissal, listener cleanup, aria-expanded/panel state. Not browser/focus/layout validation.',
);
