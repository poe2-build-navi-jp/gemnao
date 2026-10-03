import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { SaveArticle } from '../components/save-article';
import { ReadingList } from '../components/reading-list';
import { ShareButtons } from '../components/share-buttons';
import { MyDashboard } from '../components/my-dashboard';
import { trackReadingAction } from '../lib/analytics';
import {
  parseRecentTroubles,
  rememberTrouble,
  RECENT_TROUBLES_KEY,
} from '../lib/recent-troubles';

const item = {
  title: 'Public article',
  path: '/games/aniimo/login-error',
  viewedAt: '2026-10-03T00:00:00.000Z',
};
const values = new Map<string, string>();
const storage = {
  getItem: (key: string) => values.get(key) ?? null,
  setItem: (key: string, raw: string) => {
    values.set(key, raw);
  },
};
rememberTrouble(storage, item);
rememberTrouble(storage, item);
assert.deepEqual(parseRecentTroubles(values.get(RECENT_TROUBLES_KEY)!), [item]);
for (const raw of [
  'broken',
  '{}',
  '[null]',
  '[{"path":"javascript:alert(1)"}]',
  'a'.repeat(100_001),
]) {
  values.set(RECENT_TROUBLES_KEY, raw);
  rememberTrouble(storage, item);
  assert.equal(values.get(RECENT_TROUBLES_KEY), raw);
}
assert.doesNotThrow(() =>
  rememberTrouble(
    {
      getItem: () => {
        throw new Error('denied');
      },
      setItem: () => {
        throw new Error('denied');
      },
    },
    item,
  ),
);
assert.equal(
  parseRecentTroubles(JSON.stringify([{ ...item, path: '//evil.example' }]))
    .length,
  0,
);
assert.equal(
  parseRecentTroubles(
    JSON.stringify([{ ...item, path: '/guide/pc-game-crash?private=data' }]),
  ).length,
  0,
);
values.delete(RECENT_TROUBLES_KEY);
for (let i = 0; i < 8; i++)
  rememberTrouble(storage, { ...item, path: `/guide/item-${i}` });
assert.equal(parseRecentTroubles(values.get(RECENT_TROUBLES_KEY)!).length, 5);
// Existing history with legacy contextSlug is read without a migration/reset.
assert.deepEqual(
  parseRecentTroubles(JSON.stringify([{ ...item, contextSlug: 'legacy' }])),
  [item],
);

const ja = renderToStaticMarkup(
  <SaveArticle path={item.path} title={item.title} />,
);
assert.match(ja, /あとで読むに保存/);
assert.match(ja, /disabled/);
assert.match(ja, /aria-pressed="false"/);
for (const locale of ['en', 'zh', 'es'] as const) {
  const html = renderToStaticMarkup(
    <SaveArticle
      path={`/${locale}${item.path}`}
      title="Public translated title"
      locale={locale}
    />,
  );
  assert.ok(!html.includes('あとで読む'));
  assert.match(html, /href="\/my#my-reading-list"/);
}
const empty = renderToStaticMarkup(<ReadingList />);
assert.match(empty, /id="my-reading-list"/);
const dashboard = renderToStaticMarkup(<MyDashboard games={[]} />);
assert.ok(
  dashboard.indexOf('id="my-reading-list"') < dashboard.indexOf('id="my-pc"'),
);
const share = renderToStaticMarkup(
  <ShareButtons title="Public title" path={item.path} />,
);
assert.match(share, /twitter\.com\/intent\/tweet/);
assert.match(share, /リンクをコピー/);
assert.match(share, /noopener noreferrer/);
const enShare = renderToStaticMarkup(
  <ShareButtons title="Public title" path={`/en${item.path}`} locale="en" />,
);
assert.match(enShare, /Copy link/);
assert.ok(!enShare.includes('コピー'));
const root = globalThis as unknown as {
  window?: { gtag?: (...args: unknown[]) => void };
  location: { origin: string; pathname: string };
};
assert.doesNotThrow(() => trackReadingAction('article_saved'));
const calls: unknown[][] = [];
root.window = {
  gtag: (...args) => {
    calls.push(args);
  },
};
root.location = {
  origin: 'https://gemnao.pages.dev',
  pathname: '/games/secret-name?personal=data',
};
for (const name of [
  'article_saved',
  'saved_article_opened',
  'related_article_opened',
] as const)
  trackReadingAction(name);
assert.equal(calls.length, 3);
assert.ok(!JSON.stringify(calls).includes('secret'));
assert.ok(!JSON.stringify(calls).includes(item.path));
root.window.gtag = () => {
  throw new Error('blocked');
};
assert.doesNotThrow(() => trackReadingAction('article_saved'));
root.window.gtag = (...args) => {
  calls.push(args);
};
root.location.pathname = '/admin/settings';
trackReadingAction('article_saved');
assert.equal(calls.length, 3);
console.log(
  'PASS: reading history validation/preservation/limits, SSR/hydration markup, translations, canonical social links, dashboard order, and private aggregate analytics',
);

root.location.pathname = '/my';
for (const origin of [
  'https://preview.gemnao.pages.dev',
  'http://localhost:5177',
  'https://gemnao.pages.dev.evil.example',
]) {
  root.location.origin = origin;
  trackReadingAction('article_saved');
}
assert.equal(calls.length, 3);
console.log('PASS: preview, local and lookalike origins never emit analytics');
