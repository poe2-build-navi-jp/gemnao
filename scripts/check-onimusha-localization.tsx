import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { LocalizedArticle } from '../components/localized-article';
import { LocalizedGamePage } from '../components/localized-game-page';
import { LocalizedHome } from '../components/localized-home';
import { articleBySlug } from '../lib/game-articles';
import { gameBySlug } from '../lib/games';
import { onimushaArticlesEn } from '../lib/localized/onimusha-articles-en';
import { hasTranslation, languageAlternates } from '../lib/localized/index';
import {
  generateStaticParams,
  generateMetadata,
} from '../app/[locale]/games/[slug]/page';
import { generateMetadata as articleMetadata } from '../app/[locale]/games/[slug]/[article]/page';
import sitemap from '../app/sitemap';
import { ogImageManifest } from '../lib/og-image-manifest';
import { isEditorialSnapshotPath } from '../cloudflare/prerender-policy.mjs';

const slug = 'onimusha-way-of-the-sword';
const base = `/games/${slug}`;
const game = gameBySlug(slug)!;
const slugs = [
  'not-launching',
  'crash-report',
  'low-fps',
  'shader-cache',
  'black-screen',
  'hdr',
  'gpu-driver-version',
];
assert.deepEqual(
  onimushaArticlesEn.map((article) => article.slug),
  slugs,
);
assert.deepEqual(
  generateStaticParams().filter((entry) => entry.slug === slug),
  [{ locale: 'en', slug }],
);
const routes = sitemap().map((entry) => new URL(entry.url).pathname);
const englishHome = renderToStaticMarkup(<LocalizedHome locale="en" />);
for (const locale of ['zh', 'es'] as const) {
  const home = renderToStaticMarkup(<LocalizedHome locale={locale} />);
  assert.ok(!home.includes(`href="/${locale}${base}`));
  assert.deepEqual(
    await generateMetadata({ params: Promise.resolve({ locale, slug }) }),
    {},
  );
}
for (const path of [base, ...slugs.map((article) => `${base}/${article}`)]) {
  const en = `/en${path}`;
  assert.equal(hasTranslation('en', path), true);
  assert.equal(hasTranslation('zh', path), false);
  assert.equal(hasTranslation('es', path), false);
  assert.deepEqual(languageAlternates(path), {
    ja: path,
    'x-default': path,
    en,
  });
  assert.ok(routes.includes(en));
  assert.ok(!routes.includes(`/zh${path}`) && !routes.includes(`/es${path}`));
  assert.ok(isEditorialSnapshotPath(en));
  assert.ok(ogImageManifest[en]);
  assert.ok(readFileSync(`public/images/og${en}.png`).length > 1000);
  assert.ok(englishHome.includes(`href="${en}"`));
  const article = onimushaArticlesEn.find((entry) =>
    path.endsWith(`/${entry.slug}`),
  );
  const html = article
    ? renderToStaticMarkup(<LocalizedArticle game={game} article={article} />)
    : renderToStaticMarkup(<LocalizedGamePage game={game} locale="en" />);
  const metadata = article
    ? await articleMetadata({
        params: Promise.resolve({ locale: 'en', slug, article: article.slug }),
      })
    : await generateMetadata({
        params: Promise.resolve({ locale: 'en', slug }),
      });
  assert.equal(metadata.alternates?.canonical, en);
  assert.deepEqual(metadata.alternates?.languages, languageAlternates(path));
  assert.equal(metadata.openGraph?.locale, 'en_US');
  assert.ok(
    JSON.stringify(metadata.openGraph?.images).includes(`/images/og${en}.png`),
  );
  const menu =
    html.match(/<details class="language-menu">([\s\S]*?)<\/details>/)?.[1] ||
    '';
  assert.ok(menu.includes(`href="${path}"`) && menu.includes(`href="${en}"`));
  assert.ok(!menu.includes(`/zh${path}`) && !menu.includes(`/es${path}`));
  assert.ok(html.includes('lang="en"'));
  const visible = html
    .replace(/<details class="language-menu">[\s\S]*?<\/details>/g, '')
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<[^>]+>/g, ' ');
  assert.ok(!/[ぁ-んァ-ヶ一-龯]/u.test(visible));
  const schemas = [
    ...html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
    ),
  ].flatMap((match) => JSON.parse(match[1]));
  assert.ok(
    schemas.some(
      (schema) =>
        schema.inLanguage === 'en' &&
        schema.mainEntityOfPage === `https://gemnao.pages.dev${en}`,
    ),
  );
  if (article) {
    const original = articleBySlug(slug, article.slug)!;
    assert.deepEqual(
      article.steps.map((step) => step.id),
      original.steps.map((step) => step.id),
    );
    assert.equal(article.faqs.length, original.faqs?.length);
    article.steps.forEach((step, index) => {
      assert.equal(step.actions.length, original.steps[index].actions.length);
      assert.equal(step.risk, original.steps[index].risk);
    });
    assert.ok(visible.length > 5500, `${en}: incomplete article`);
    assert.ok(
      html.includes('Save for later'),
      `${en}: saved-reading UI missing`,
    );
    for (const link of article.related || [])
      assert.ok(routes.includes(link.href), `Missing ${link.href}`);
    assert.ok(
      article.sources.some((source) =>
        source.url.endsWith('/589562598193771781/'),
      ),
    );
  } else {
    for (const articleSlug of slugs)
      assert.ok(html.includes(`href="/en${base}/${articleSlug}"`));
    assert.ok(
      html.includes('not independently verified the PC save-file path'),
    );
    assert.ok(!html.includes('win64_save'));
  }
}
const fps = onimushaArticlesEn.find((article) => article.slug === 'low-fps')!;
const originalFps = articleBySlug(slug, 'low-fps')!;
assert.equal(originalFps.checkedAt, '2026-10-03');
assert.deepEqual(
  fps.sources.map((source) => source.url),
  originalFps.sources!.map((source) =>
    source.url.replace('589562598193771782', '589562598193771781'),
  ),
);
assert.ok(JSON.stringify(fps).includes('base frame rate'));
assert.ok(
  JSON.stringify(fps).includes(
    'raising the limit alone will not add performance',
  ),
);
assert.ok(
  JSON.stringify(fps).includes('preference screen alone does not prove'),
);
assert.ok(
  JSON.stringify(fps).includes('High memory use alone does not establish'),
);
const text = JSON.stringify(onimushaArticlesEn);
for (const unsafe of [
  'add the game folder as an exception',
  'lowest graphics preset',
  '32:9',
  '30–360',
  'not yet generated',
])
  assert.ok(!text.includes(unsafe), unsafe);
assert.ok(text.includes('not a claim that we tested every fix'));
assert.ok(text.includes('anyone with that link can view it'));
assert.ok(text.includes('do not exclude the whole game folder'));
assert.ok(text.includes('If neither file exists, skip this step'));
assert.ok(text.includes('missing switch alone does not prove'));
console.log(
  'PASS: seven complete English Onimusha articles and English-only hub; source parity, safety, locales, routes, links, metadata, sitemap, schema, OG and saved-reading UI',
);
