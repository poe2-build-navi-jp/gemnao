import { build } from 'esbuild';
import { mkdir, readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
await mkdir('.wrangler/growth-20261110', { recursive: true });
await build({
  stdin: {
    contents: `
  export { parseContent, redactReportContent } from './lib/community-reports/model';
  export { validEnvironment } from './lib/community-reports/environment';
  export { guideUpdates } from './lib/guide-updates';
  export { parseReadChanges, setChangeRead } from './lib/my-game-changes-read';
  export { GUIDE_UPDATES_READ_KEY } from './lib/guide-updates-read';
  export { socialGuideAssets, socialGuideUrl } from './lib/social-guide-assets';
  export { localizedArticle } from './lib/localized/index';
  export { StepResultCollection, StepResultButtons } from './components/step-result-collection';
`,
    resolveDir: process.cwd(),
  },
  outfile: '.wrangler/growth-20261110/code.mjs',
  bundle: true,
  platform: 'node',
  format: 'esm',
  packages: 'external',
  jsx: 'automatic',
});
const api = await import('../.wrangler/growth-20261110/code.mjs');
const legacy = {
  articlePath: '/games/ace-combat-8/error-st-3100001',
  symptom: 'network',
  stepIds: ['sync-time'],
  outcome: 'resolved',
  observedOn: '2026-11-10',
  version: '',
  os: 'unknown',
  gpu: 'unknown',
  sources: [],
};
const now = Date.parse('2026-11-10T12:00:00Z') / 1000;
await test('legacy report payloads remain byte-equivalent after parsing', () => {
  assert.equal(
    JSON.stringify(api.parseContent(legacy, now)),
    JSON.stringify(legacy),
  );
  assert.equal(
    Object.hasOwn(api.parseContent(legacy, now), 'environment'),
    false,
  );
});
await test('hardware comparisons validate on the server and redact with other optional details', () => {
  const environment = {
    cpuModel: 'Core i5-14400F',
    gpuModel: 'RTX 4060 Ti',
    ramGb: '32',
    driverVersion: '566.36',
  };
  const parsed = api.parseContent({ ...legacy, environment }, now);
  assert.deepEqual(parsed.environment, environment);
  assert.equal(
    Object.hasOwn(api.redactReportContent(parsed), 'environment'),
    false,
  );
  for (const invalid of [
    { ramGb: '-1' },
    { ramGb: '32 GB' },
    { cpuModel: '<script>' },
    { gpuModel: 'a@b.com' },
    { other: 'unknown' },
    { driverVersion: 'a'.repeat(61) },
    null,
  ]) {
    assert.equal(api.validEnvironment(invalid), false);
    assert.throws(() =>
      api.parseContent({ ...legacy, environment: invalid }, now),
    );
  }
});
await test('guide updates use language-specific edit dates and only translated destinations', () => {
  const en = api.guideUpdates('en');
  const st = en.find(
    (u) => u.href === '/en/games/ace-combat-8/error-st-3100001',
  );
  assert.equal(st.date, '2026-11-10');
  assert.equal(st.kind, 'edited');
  for (const u of en) {
    assert.match(u.id, /^[a-z0-9-]{1,160}$/);
    const [, locale, , game, article] = u.href.split('/');
    assert.ok(api.localizedArticle(locale, game, article), u.href);
  }
  const ja = api
    .guideUpdates('ja')
    .find((u) => u.href === '/games/ace-combat-8/error-st-3100001');
  if (ja) assert.notEqual(ja.date, '2026-11-10');
});
await test('guide read state never overwrites other saved data or corrupt state', () => {
  const records = new Map([['gemnao-my-games', '["ace-combat-8"]']]);
  const storage = {
    getItem: (k) => records.get(k) ?? null,
    setItem: (k, v) => records.set(k, v),
  };
  api.setChangeRead(
    storage,
    'en-ace-combat-8-error-st-3100001-2026-11-10',
    true,
    api.GUIDE_UPDATES_READ_KEY,
  );
  assert.equal(records.get('gemnao-my-games'), '["ace-combat-8"]');
  assert.equal(
    api.parseReadChanges(records.get(api.GUIDE_UPDATES_READ_KEY)).read.length,
    1,
  );
  records.set(api.GUIDE_UPDATES_READ_KEY, '{broken');
  assert.throws(() =>
    api.setChangeRead(
      storage,
      'another-update',
      true,
      api.GUIDE_UPDATES_READ_KEY,
    ),
  );
  assert.equal(records.get(api.GUIDE_UPDATES_READ_KEY), '{broken');
});
await test('next-check routes remain readable when reporting is unavailable', () => {
  const steps = [
    {
      id: 'sync-time',
      title: 'Sync time',
      guideLink: {
        href: '/en/games/ace-combat-8/time-sync-failed',
        label: 'Sync failed',
      },
    },
    { id: 'check-status', title: 'Check connection' },
  ];
  const html = renderToStaticMarkup(
    h(
      api.StepResultCollection,
      {
        contextSlug: 'game-ace-combat-8-error-st-3100001',
        topic: 'launch',
        locale: 'en',
        steps,
      },
      h(api.StepResultButtons, { method: 'sync-time' }),
    ),
  );
  assert.match(html, /href="#check-status"/);
  const article = api.localizedArticle('en', 'ace-combat-8', 'error-st-3100001');
  const branched = renderToStaticMarkup(h(api.StepResultCollection, {
    contextSlug: 'game-ace-combat-8-error-st-3100001', topic: 'launch', locale: 'en', steps: article.steps,
  }, h(api.StepResultButtons, { method: 'sync-time' })));
  assert.match(branched, /href="\/en\/games\/ace-combat-8\/time-sync-failed"/);
  assert.match(branched, /href="\/en\/games\/ace-combat-8\/connection-after-time-sync"/);
  assert.doesNotMatch(branched, /href="#check-offset"/);
  assert.match(
    html,
    /data-related="true" href="\/en\/games\/ace-combat-8\/time-sync-failed"/,
  );
});
await test('six campaign assets link directly to matching articles with stable attribution', async () => {
  assert.equal(api.socialGuideAssets.length, 6);
  for (const a of api.socialGuideAssets) {
    const url = new URL(api.socialGuideUrl(a));
    assert.equal(url.origin, 'https://gemnao.pages.dev');
    assert.equal(url.pathname, a.path);
    assert.equal(url.searchParams.get('utm_medium'), 'social');
    assert.equal(url.searchParams.get('utm_content'), a.id);
    assert.equal(a.path.startsWith('/en/'), a.lang === 'en');
    const png = await readFile(`public/images/social-guides/${a.id}.png`);
    assert.equal(png.subarray(1, 4).toString(), 'PNG');
    assert.equal(png.readUInt32BE(16), 1200);
    assert.equal(png.readUInt32BE(20), 1200);
  }
});
