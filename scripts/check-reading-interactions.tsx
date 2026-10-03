import assert from 'node:assert/strict';
import { SaveArticle } from '../components/save-article';
import { CopyShareLink } from '../components/copy-share-link';
import { ReadingList } from '../components/reading-list';
import { READING_LIST_KEY, readReadingList } from '../lib/reading-list';

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
      const found = find(child, match);
      if (found) return found;
    }
  } else if (node && typeof node === 'object') {
    const element = node as Element;
    return match(element) ? element : find(element.props?.children, match);
  }
}
const values = new Map<string, string>();
let failWrite = false;
const storage = {
  getItem: (key: string) => values.get(key) ?? null,
  setItem: (key: string, value: string) => {
    if (failWrite) throw new Error('quota');
    values.set(key, value);
  },
};
const calls: unknown[][] = [];
const changes: unknown[] = [];
let clipboard = '';
const root = globalThis as unknown as {
  localStorage: typeof storage;
  location: { origin: string; pathname: string };
  window: {
    localStorage: typeof storage;
    gtag: (...args: unknown[]) => void;
    dispatchEvent: () => boolean;
  };
  navigator: { clipboard: { writeText: (text: string) => Promise<void> } };
  __readingUiStates: unknown[];
};
root.localStorage = storage;
root.location = {
  origin: 'https://gemnao.pages.dev',
  pathname: '/guide/pc-game-crash',
};
root.window = {
  localStorage: storage,
  gtag: (...args) => {
    calls.push(args);
  },
  dispatchEvent: () => true,
};
Object.defineProperty(globalThis, 'navigator', {
  configurable: true,
  value: {
    clipboard: {
      writeText: async (text: string) => {
        clipboard = text;
      },
    },
  },
});
root.__readingUiStates = changes;
const props = { path: '/guide/pc-game-crash', title: 'Private saved title' };
const button = () =>
  find(SaveArticle(props), (node) => node.type === 'button')!;
const click = (node: Element) => (node.props!.onClick as () => unknown)();
const add = button();
assert.equal(add.props!.disabled, false);
click(add);
click(add);
assert.equal(readReadingList(storage).length, 1);
assert.equal(calls.length, 1);
assert.ok(!JSON.stringify(calls).includes(props.title));
assert.ok(!JSON.stringify(calls).includes(props.path));
assert.equal(button().props!['aria-pressed'], true);
click(button());
assert.equal(readReadingList(storage).length, 0);
assert.equal(calls.length, 1);
failWrite = true;
click(button());
assert.equal(readReadingList(storage).length, 0);
assert.equal(calls.length, 1);
failWrite = false;
root.window.gtag = () => {
  throw new Error('analytics blocked');
};
assert.doesNotThrow(() => click(button()));
assert.equal(readReadingList(storage).length, 1);
root.window.gtag = (...args) => {
  calls.push(args);
};
const open = find(
  ReadingList(),
  (node) => node.type === 'a' && node.props?.href === props.path,
)!;
click(open);
assert.equal(calls.at(-1)?.[1], 'saved_article_opened');
values.set(READING_LIST_KEY, 'corrupt');
assert.equal(button().props!.disabled, true);
assert.equal(values.get(READING_LIST_KEY), 'corrupt');
values.delete(READING_LIST_KEY);
const copy = find(
  CopyShareLink({ path: props.path }),
  (node) => node.type === 'button',
)!;
await click(copy);
assert.equal(clipboard, `https://gemnao.pages.dev${props.path}`);
assert.equal(changes.at(-1), 'copied');
const count = calls.length;
root.navigator.clipboard.writeText = async () => {
  throw new Error('denied');
};
await click(copy);
assert.equal(changes.at(-1), 'fallback');
assert.equal(calls.length, count);
console.log(
  'PASS: real save/open/remove/copy handlers, repeated clicks, failed writes, blocked analytics, corrupt data, canonical copying and denied clipboard fallback',
);
