import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { LocalizedHome } from '../components/localized-home';
import { LocalizedGamePage } from '../components/localized-game-page';
import { games } from '../lib/games';
import { localizedGames } from '../lib/i18n';
import { generateMetadata as homeMetadata } from '../app/[locale]/page';
import { generateMetadata as gameMetadata } from '../app/[locale]/games/[slug]/page';

const pages = [
  { name: '/en', html: renderToStaticMarkup(<LocalizedHome locale="en" />) },
];
for (const game of games.filter((game) => localizedGames.en[game.slug])) {
  pages.push({
    name: `/en/games/${game.slug}`,
    html: renderToStaticMarkup(<LocalizedGamePage game={game} locale="en" />),
  });
  const metadata = await gameMetadata({
    params: Promise.resolve({ locale: 'en', slug: game.slug }),
  });
  assert(
    !/[ぁ-んァ-ヶ一-龯]/u.test(JSON.stringify(metadata.title)),
    `${game.slug}: title`,
  );
  assert.equal((metadata.robots as { index: boolean }).index, false);
}
for (const page of pages) {
  // Language names in the language selector intentionally retain native script.
  const withoutSelector = page.html.replace(
    /<details class="language-menu">[\s\S]*?<\/details>/g,
    '',
  );
  const text = withoutSelector
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<[^>]+>/g, '');
  assert(
    !/[ぁ-んァ-ヶ一-龯]/u.test(text),
    `${page.name}: untranslated visible text: ${text.match(/.{0,25}[ぁ-んァ-ヶ一-龯].{0,25}/gu)?.join(' | ')}`,
  );
  assert(
    !page.html.includes('Relative demand'),
    `${page.name}: unsupported demand claim`,
  );
  assert(page.html.includes('lang="en"'), `${page.name}: main language`);
}
const metadata = await homeMetadata({
  params: Promise.resolve({ locale: 'en' }),
});
assert(!/[ぁ-んァ-ヶ一-龯]/u.test(JSON.stringify(metadata.title)));
console.log(
  `PASS: ${pages.length} English pages; language, metadata, noindex and evidence checks.`,
);
