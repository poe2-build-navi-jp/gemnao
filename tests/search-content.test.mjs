import { build } from 'esbuild';
import { mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
await mkdir('.wrangler/search-content', { recursive: true });
await build({
  stdin: {
    contents: `export * from './lib/backup-readiness'; export * from './lib/steam-entry-guides'; export * from './components/backup-readiness-checklist'; export * from './components/steam-intent-links'; export { hasTranslation } from './lib/localized/index';`,
    resolveDir: process.cwd(),
  },
  outfile: '.wrangler/search-content/code.mjs',
  bundle: true,
  platform: 'node',
  format: 'esm',
  packages: 'external',
  jsx: 'automatic',
});
const {
  backupCheckIds,
  backupReadiness,
  steamEntryGuides,
  steamEntryGuidesEn,
  steamEntryGuidesZhEs,
  BackupReadinessChecklist,
  SteamIntentLinks,
  hasTranslation,
} = await import('../.wrangler/search-content/code.mjs');
await test('a condition must be selected even if all checklist IDs are supplied', () => {
  assert.equal(backupReadiness('', [...backupCheckIds]).state, 'choose');
});
await test('conflict and missing progress always take preservation precedence', () => {
  for (const condition of ['conflict', 'missing'])
    assert.equal(
      backupReadiness(condition, [...backupCheckIds]).state,
      'preserve',
    );
});
await test('only distinct known confirmations count; no copy success is inferred', () => {
  assert.equal(
    backupReadiness('normal', ['closed', 'closed', 'invented']).completed,
    1,
  );
  assert.equal(backupReadiness('normal', ['closed']).state, 'checking');
  assert.equal(
    backupReadiness('normal', [...backupCheckIds]).state,
    'reviewed',
  );
});
for (const locale of ['ja', 'en', 'zh', 'es']) {
  await test(`${locale}: both topics have complete content and real translated routes`, () => {
    const guides =
      locale === 'ja'
        ? steamEntryGuides
        : locale === 'en'
          ? steamEntryGuidesEn
          : steamEntryGuidesZhEs.filter((g) => g.locale === locale);
    assert.equal(guides.length, 2);
    for (const guide of guides) {
      assert.equal(guide.steps.length, 4);
      assert.equal(guide.faqs.length, 4);
      assert.ok(
        guide.sources.every((source) => source.url.startsWith('https://')),
      );
      assert.ok(guide.title && guide.description && guide.checkedAt);
      assert.ok(
        locale === 'ja' || hasTranslation(locale, `/guide/${guide.slug}`),
      );
      for (const link of guide.related) {
        if (typeof link !== 'string' && link.href.startsWith(`/${locale}/`))
          assert.ok(
            hasTranslation(locale, link.href.slice(locale.length + 1)),
            link.href,
          );
      }
    }
  });
  await test(`${locale}: checklist starts without pre-checked attestations or submissions`, () => {
    const html = renderToStaticMarkup(h(BackupReadinessChecklist, { locale }));
    assert.match(html, /id="backup-readiness"/);
    assert.match(html, /<select/);
    assert.doesNotMatch(html, /<form|type="submit"|checked=""/);
  });
  await test(`${locale}: generic Steam searches can reach the client-specific guide`, () => {
    const html = renderToStaticMarkup(
      h(SteamIntentLinks, { slug: 'steam-game-not-launching', locale }),
    );
    assert.match(
      html,
      new RegExp(
        `href="${locale === 'ja' ? '' : '/' + locale}/guide/steam-client-not-opening"`,
      ),
    );
  });
}
