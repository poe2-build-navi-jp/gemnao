import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { LocalizedArticle } from '../components/localized-article';
import { LocalizedGamePage } from '../components/localized-game-page';
import { LocalizedHome } from '../components/localized-home';
import { articleBySlug, hubIndexable } from '../lib/game-articles';
import { gameBySlug } from '../lib/games';
import { discordArticleBySlug } from '../lib/discord-articles';
import {
  hasTranslation,
  languageAlternates,
  localizedArticle,
  localizedDiscordArticle,
} from '../lib/localized/index';
import { generateMetadata as gameMeta } from '../app/games/[slug]/[article]/page';
import { generateMetadata as discordMeta } from '../app/discord/[slug]/page';
import { generateMetadata as localGameMeta } from '../app/[locale]/games/[slug]/[article]/page';
import {
  generateMetadata as localDiscordMeta,
  generateStaticParams as discordParams,
} from '../app/[locale]/discord/[slug]/page';
import { generateMetadata as hubMeta } from '../app/games/[slug]/page';
import { generateMetadata as localHubMeta } from '../app/[locale]/games/[slug]/page';
import sitemap from '../app/sitemap';
import { ogImageManifest } from '../lib/og-image-manifest';
import {
  safeReadingPath,
  saveReadingItem,
  readReadingList,
} from '../lib/reading-list';
import { searchArticles } from '../lib/site-search';
import { isEditorialSnapshotPath } from '../cloudflare/prerender-policy.mjs';

const game = gameBySlug('rocket-league')!;
const gamePath = '/games/rocket-league/dualsense-not-working';
const discordPath = '/discord/upload-failed';
const languages = ['ja', 'en', 'zh', 'es'] as const;
const locales = ['en', 'zh', 'es'] as const;
const routes = sitemap().map((entry) => new URL(entry.url).pathname);
assert.equal(hubIndexable(game), false);
assert(articleBySlug('rocket-league', 'dualsense-not-working'));
assert(discordArticleBySlug('upload-failed'));
assert.deepEqual(
  discordParams(),
  locales.map((locale) => ({ locale, slug: 'upload-failed' })),
);
for (const basePath of [gamePath, discordPath]) {
  const expectedAlternates = {
    ja: basePath,
    'x-default': basePath,
    en: `/en${basePath}`,
    'zh-Hans': `/zh${basePath}`,
    es: `/es${basePath}`,
  };
  assert.deepEqual(languageAlternates(basePath), expectedAlternates);
  for (const locale of languages) {
    const path = locale === 'ja' ? basePath : `/${locale}${basePath}`;
    const isDiscord = basePath === discordPath;
    const metadata =
      locale === 'ja'
        ? isDiscord
          ? await discordMeta({
              params: Promise.resolve({ slug: 'upload-failed' }),
            })
          : await gameMeta({
              params: Promise.resolve({
                slug: 'rocket-league',
                article: 'dualsense-not-working',
              }),
            })
        : isDiscord
          ? await localDiscordMeta({
              params: Promise.resolve({ locale, slug: 'upload-failed' }),
            })
          : await localGameMeta({
              params: Promise.resolve({
                locale,
                slug: 'rocket-league',
                article: 'dualsense-not-working',
              }),
            });
    assert.equal(metadata.alternates?.canonical, path);
    assert.deepEqual(metadata.alternates?.languages, expectedAlternates);
    assert(
      !JSON.stringify(metadata.robots ?? {}).includes('false'),
      `${path}: article must be indexable`,
    );
    assert(routes.includes(path), `${path}: sitemap`);
    assert(isEditorialSnapshotPath(path), `${path}: snapshot policy`);
    assert(safeReadingPath(path), `${path}: saved reading`);
    assert(ogImageManifest[path], `${path}: OG manifest`);
    assert(readFileSync(`public/images/og${path}.png`).length > 1000);
    assert(
      JSON.stringify(metadata.openGraph?.images).includes(
        `/images/og${path}.png`,
      ),
    );
    const store = new Map<string, string>();
    const storage = {
      getItem: (key: string) => store.get(key) || null,
      setItem: (key: string, value: string) => {
        store.set(key, value);
      },
    };
    assert(saveReadingItem(storage, { path, title: 'Article test' }));
    assert.equal(readReadingList(storage)[0].path, path);
    if (locale !== 'ja') {
      const article = isDiscord
        ? localizedDiscordArticle(locale, 'upload-failed')!
        : localizedArticle(locale, 'rocket-league', 'dualsense-not-working')!;
      const html = renderToStaticMarkup(
        isDiscord ? (
          <LocalizedArticle section="discord" article={article} />
        ) : (
          <LocalizedArticle game={game} article={article} />
        ),
      );
      const home = renderToStaticMarkup(<LocalizedHome locale={locale} />);
      assert(home.includes(`href="${path}"`), `${path}: discovery`);
      const menu =
        html.match(
          /<details class="language-menu">([\s\S]*?)<\/details>/,
        )?.[1] || '';
      Object.values(expectedAlternates).forEach((route) =>
        assert(
          menu.includes(`href="${route}"`),
          `${path}: reciprocal menu ${route}`,
        ),
      );
      assert(html.includes('href="/about"'), `${path}: editorial byline`);
      assert(html.includes('class="save-article"'), `${path}: save UI`);
      const schemas = [
        ...html.matchAll(
          /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
        ),
      ].flatMap((match) => JSON.parse(match[1]));
      const tech = schemas.find((schema) => schema['@type'] === 'TechArticle');
      assert.equal(tech.mainEntityOfPage, `https://gemnao.pages.dev${path}`);
      assert.equal(tech.inLanguage, locale === 'zh' ? 'zh-Hans' : locale);
      assert.equal(
        tech.about['@type'],
        isDiscord ? 'SoftwareApplication' : 'VideoGame',
      );
      assert.deepEqual(
        tech.citation,
        article.sources.map((source) => source.url),
      );
      assert.equal(
        schemas.find((schema) => schema['@type'] === 'FAQPage').mainEntity
          .length,
        article.faqs.length,
      );
    }
  }
}
for (const locale of languages) {
  const path = `${locale === 'ja' ? '' : `/${locale}`}/games/rocket-league`;
  const metadata =
    locale === 'ja'
      ? await hubMeta({ params: Promise.resolve({ slug: 'rocket-league' }) })
      : await localHubMeta({
          params: Promise.resolve({ locale, slug: 'rocket-league' }),
        });
  assert.deepEqual(metadata.robots, { index: false, follow: true });
  assert.deepEqual(metadata.alternates?.languages, {});
  assert(!routes.includes(path), 'Discovery hub excluded from sitemap');
  assert(
    JSON.stringify(metadata.title).includes('DualSense'),
    'Honest focused hub title',
  );
  if (locale !== 'ja') {
    const html = renderToStaticMarkup(
      <LocalizedGamePage game={game} locale={locale} />,
    );
    assert(
      !html.includes('id="saves"') &&
        !html.includes('id="requirements"') &&
        !html.includes('id="languages"'),
      'No invented reference facts',
    );
    assert(hasTranslation(locale, '/games/rocket-league'));
    assert(!hasTranslation(locale, '/discord'));
    assert(!hasTranslation(locale, '/discord/mic-not-working'));
  }
}
assert(
  searchArticles('Rocket League DualSense').some(
    (article) => article.href === gamePath,
  ),
);
assert(
  searchArticles('Discord 画像').some(
    (article) => article.href === discordPath,
  ),
);
assert(!isEditorialSnapshotPath('/en/discord-servers'));
assert(!isEditorialSnapshotPath('/api/feedback'));
console.log(
  'PASS: two new four-language article families; real routes, canonical/hreflang, indexability, noindex focused hubs, sitemap, OG, schema, saved reading and discovery',
);
