import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { AffiliateLink } from '../components/affiliate-link';
import { TroubleshootingProduct } from '../components/troubleshooting-product';
import {
  affiliateClickParams,
  listenForAffiliateClicks,
  trackAffiliateClick,
} from '../lib/affiliate-analytics';
import { trackEvent } from '../lib/analytics';

// No live Google script, network, or production events are used in these tests.
const data = {
  affiliatePath: '/gear/stream-deck-plus-xl',
  affiliateAsin: 'B0GQRRF1LC',
  affiliatePosition: 'after-answer',
};
const expected = {
  affiliate_partner: 'amazon',
  article_path: '/gear/stream-deck-plus-xl',
  product_id: 'B0GQRRF1LC',
  link_position: 'after-answer',
  page_location: 'https://gemnao.pages.dev/gear/stream-deck-plus-xl',
  page_referrer: '',
};
assert.deepEqual(affiliateClickParams(data), expected);
assert.deepEqual(
  affiliateClickParams({
    ...data,
    affiliatePath: '/en/gear/discord-microphone-guide',
    affiliateAsin: 'B08H6X6G28',
  }),
  {
    ...expected,
    article_path: '/en/gear/discord-microphone-guide',
    product_id: 'B08H6X6G28',
    page_location: 'https://gemnao.pages.dev/en/gear/discord-microphone-guide',
  },
);
assert.equal(
  affiliateClickParams({
    ...data,
    affiliatePath: '/en/gear/discord-microphone-guide?email=private',
  }),
  null,
);
assert.equal(
  affiliateClickParams({
    ...data,
    affiliatePath: '/en/gear/discord-microphone-guide#private',
  }),
  null,
);

assert.deepEqual(
  affiliateClickParams({ ...data, affiliatePosition: 'after-fit-check' }),
  { ...expected, link_position: 'after-fit-check' },
);
for (const [field, value] of [
  ['affiliatePath', '/gear/stream-deck-plus-xl?email=private'],
  ['affiliatePath', '/gear/stream-deck-plus-xl#private'],
  ['affiliatePath', '/admin/dashboard'],
  ['affiliatePath', '/contact'],
  ['affiliateAsin', 'private@example.com'],
  ['affiliatePosition', 'private text'],
  ['affiliatePosition', 'diagnostic-step-0'],
])
  assert.equal(affiliateClickParams({ ...data, [field]: value }), null);
assert.equal(affiliateClickParams({}), null);

class Anchor {
  dataset = { ...data };
  closest() {
    return this;
  }
}
const root = globalThis as unknown as {
  window?: { gtag?: (...args: unknown[]) => void };
  location: { origin: string; pathname: string; search: string; hash: string };
  HTMLAnchorElement: typeof Anchor;
};
// Server use is harmless.
trackEvent('affiliate_click', expected);
const calls: unknown[][] = [];
root.window = {
  gtag: (...args) => {
    calls.push(args);
  },
};
root.location = {
  origin: 'https://gemnao.pages.dev',
  pathname: '/gear/stream-deck-plus-xl',
  search: '?private=1',
  hash: '#private',
};
root.HTMLAnchorElement = Anchor;
const anchor = new Anchor();
function click(overrides: Record<string, unknown> = {}) {
  const event = {
    type: 'click',
    button: 0,
    defaultPrevented: false,
    target: anchor,
    ...overrides,
  };
  trackAffiliateClick(event as unknown as MouseEvent);
  assert.equal(event.defaultPrevented, overrides.defaultPrevented ?? false);
}
click();
assert.deepEqual(calls.pop(), ['event', 'affiliate_click', expected]);
// Keyboard, modifier clicks, and nested icon targets all produce exactly one event.
for (const extra of [
  { detail: 0 },
  { ctrlKey: true },
  { metaKey: true },
  { shiftKey: true },
  { target: { closest: () => anchor } },
  { type: 'auxclick', button: 1 },
]) {
  click(extra);
  assert.equal(calls.length, 1);
  calls.length = 0;
}
for (const extra of [
  { defaultPrevented: true },
  { button: 1 },
  { button: 2 },
  { type: 'auxclick', button: 0 },
  { type: 'auxclick', button: 2 },
  { type: 'keydown' },
  { target: null },
  { target: {} },
])
  click(extra);
assert.equal(calls.length, 0);
root.location.pathname = '/admin/settings';
click();
assert.equal(calls.length, 0);
root.location.pathname = data.affiliatePath;
root.window.gtag = undefined;
assert.doesNotThrow(() => click());
root.window.gtag = () => {
  throw new Error('blocked analytics');
};
assert.doesNotThrow(() => click());
root.window.gtag = (...args) => {
  calls.push(args);
};

// Effect cleanup prevents duplicated listeners after a Strict Mode remount.
const listeners = new Map<string, Set<unknown>>();
const documentStub = {
  addEventListener(type: string, listener: unknown) {
    if (!listeners.has(type)) listeners.set(type, new Set());
    listeners.get(type)!.add(listener);
  },
  removeEventListener(type: string, listener: unknown) {
    listeners.get(type)?.delete(listener);
  },
};
const stop = listenForAffiliateClicks(documentStub as unknown as Document);
assert.equal(listeners.get('click')!.size, 1);
assert.equal(listeners.get('auxclick')!.size, 1);
stop();
const stopAgain = listenForAffiliateClicks(documentStub as unknown as Document);
assert.equal(listeners.get('click')!.size, 1);
stopAgain();
assert.equal(listeners.get('click')!.size, 0);
assert.equal(listeners.get('auxclick')!.size, 0);

// Links are native SSR anchors: their destination and affiliate tag work without JS.
for (const position of [
  'after-answer',
  'after-faq',
  'after-fit-check',
] as const) {
  const html = renderToStaticMarkup(
    <AffiliateLink
      asin={data.affiliateAsin}
      articlePath={data.affiliatePath}
      position={position}
    >
      Amazon
    </AffiliateLink>,
  );
  assert.ok(
    html.includes(
      'href="https://www.amazon.co.jp/dp/B0GQRRF1LC?tag=aquaponyo06-22"',
    ),
  );
  assert.ok(html.includes('target="_blank"'));
  assert.ok(html.includes('rel="sponsored nofollow noopener"'));
  assert.ok(html.includes(`data-affiliate-position="${position}"`));
  assert.ok(!html.includes('onclick'));
}
for (const [path, step, asin] of [
  ['/discord/bluetooth-audio-problem', 2, 'B08H6X6G28'],
  ['/guide/save-data-backup', 2, 'B0CQYF95V6'],
  ['/pc/usb-c-device-not-recognized', 1, 'B0CVQM2TWH'],
] as const) {
  const html = renderToStaticMarkup(
    <TroubleshootingProduct articlePath={path} step={step} />,
  );
  assert.ok(html.includes(`data-affiliate-asin="${asin}"`));
  assert.ok(html.includes(`data-affiliate-path="${path}"`));
  assert.ok(html.includes(`data-affiliate-position="diagnostic-step-${step}"`));
  assert.equal(
    renderToStaticMarkup(
      <TroubleshootingProduct articlePath={path} step={step + 1} />,
    ),
    '',
  );
}
console.log(
  'Affiliate analytics checks passed (payload, input modes, cleanup, disabled/throwing analytics, native SSR links).',
);
