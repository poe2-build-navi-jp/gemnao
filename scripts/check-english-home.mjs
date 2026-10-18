import assert from 'node:assert/strict';
import { build } from 'esbuild';
const base = process.env.TEST_BASE_URL || 'http://localhost:3065';
assert.ok(['localhost', '127.0.0.1'].includes(new URL(base).hostname));
const bundle = await build({
  stdin: {
    contents: "export {englishSearchEntries} from './lib/localized/home-en'",
    resolveDir: process.cwd(),
    loader: 'ts',
  },
  bundle: true,
  platform: 'node',
  format: 'esm',
  write: false,
});
const { englishSearchEntries: entries } = await import(
  `data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}`
);
const read = async (path) => {
  const r = await fetch(base + path);
  assert.equal(r.status, 200, path);
  return r.text();
};
const home = await read('/en'),
  directory = await read('/en/articles');
const links = (html) =>
  [...html.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map((m) =>
    m[1].replaceAll('&amp;', '&'),
  );
for (const [path, html] of [
  ['/en', home],
  ['/en/articles', directory],
]) {
  assert.equal((html.match(/<h1\b/g) || []).length, 1, path);
  assert.match(html, /<main[^>]*lang="en"/);
  assert.match(
    html,
    new RegExp(
      `<link[^>]*rel="canonical"[^>]*href="https://gemnao.pages.dev${path}"`,
    ),
  );
  assert.ok(!/<meta[^>]*name="robots"[^>]*content="[^"]*noindex/.test(html));
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
  assert.ok(title && !/ゲムなお/.test(title));
  const schemas = [
    ...html.matchAll(
      /<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs,
    ),
  ].map((m) => JSON.parse(m[1]));
  assert.ok(
    schemas.some(
      (s) =>
        s['@type'] === 'CollectionPage' &&
        s.inLanguage === 'en' &&
        s.url === `https://gemnao.pages.dev${path}`,
    ),
  );
  for (const href of links(html).filter((h) => h.startsWith('#')))
    assert.ok(html.includes(`id="${href.slice(1)}"`), `${path}: ${href}`);
}
const all = new Set(links(directory));
for (const e of entries) assert.ok(all.has(e.href), `Directory lost ${e.href}`);
assert.ok(links(home).includes('/en/articles'));
for (const slug of [
  'not-launching',
  'crash',
  'fps',
  'save',
  'mod',
  'controller',
  'server',
])
  assert.ok(links(home).includes('/en/trouble/' + slug));
for (const id of ['games', 'articles', 'tools'])
  assert.ok(home.includes(`id="${id}"`));
assert.ok(
  home.indexOf('/en/trouble/not-launching') < home.lastIndexOf('/en/reports'),
  'Exploration must precede report entry',
);
assert.ok(!all.has('/articles'), 'No nonexistent Japanese directory');
assert.ok(!/hreflang="ja"[^>]*href="[^"]*\/articles"/.test(directory));
assert.ok(
  (await read('/sitemap.xml')).includes('https://gemnao.pages.dev/en/articles'),
);
const paths = [
  ...new Set(
    [...links(home), ...all]
      .filter((p) => p.startsWith('/en'))
      .map((p) => p.split('#')[0].split('?')[0]),
  ),
];
for (const path of paths) await read(path);
const query = await read('/en?q=wilds');
assert.match(
  query,
  /rel="canonical"[^>]*href="https:\/\/gemnao.pages.dev\/en"/,
);
console.log(
  `PASS English home SEO: ${entries.length} existing destinations retained in SSR directory; ${paths.length} English targets return 200; headings, canonical, schema, sitemap, legacy anchors.`,
);
