import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import GuidePage from '../app/guide/[slug]/page';
import DiscordPage from '../app/discord/[slug]/page';
import { LocalizedArticle } from '../components/localized-article';
import { EnglishGuideShell } from '../components/english-guide-shell';
import { commonGuides } from '../lib/common-guides';
import {
  localizedArticles,
  localizedDiscordArticles,
} from '../lib/localized/index';
import { gameBySlug } from '../lib/games';
import { crashGuideEn } from '../lib/localized/crash-guide-en';

function checkRelated(html: string, expected: boolean) {
  const shortcut = html.match(/<a\b[^>]*class="article-next-jump"[^>]*>/)?.[0];
  assert.equal(Boolean(shortcut), expected);
  if (shortcut) {
    assert.match(shortcut, /href="#related-guides"/);
    assert.ok(
      !shortcut.includes('data-related'),
      'same-page jumps are not onward article events',
    );
    assert.equal((html.match(/id="related-guides"/g) || []).length, 1);
  }
  for (const tag of html.match(/<a\b[^>]*data-related="true"[^>]*>/g) || []) {
    assert.match(tag, /href="\/(?!\/)/);
    assert.ok(!tag.includes('href="#'), 'only actual destination links count');
  }
}
for (const guide of commonGuides.filter(
  ({ status }) => status === 'verified',
)) {
  const html = renderToStaticMarkup(
    await GuidePage({ params: Promise.resolve({ slug: guide.slug }) }),
  );
  checkRelated(html, guide.related.length > 0);
  guide.steps.forEach((_, index) => {
    assert.match(
      html,
      new RegExp(`class="summary-step-link" href="#step-${index + 1}"`),
    );
    assert.equal(
      (html.match(new RegExp(`id="step-${index + 1}"`, 'g')) || []).length,
      1,
    );
  });
}
for (const article of [...localizedArticles, ...localizedDiscordArticles]) {
  const props =
    article.gameSlug === 'discord'
      ? { article, section: 'discord' as const }
      : { article, game: gameBySlug(article.gameSlug)! };
  const html = renderToStaticMarkup(<LocalizedArticle {...props} />);
  checkRelated(html, Boolean(article.related?.length));
  if (article.related?.length) assert.match(html, /data-related="true"/);
  // No empty target/shortcut is introduced when related links are absent.
  checkRelated(
    renderToStaticMarkup(
      <LocalizedArticle {...props} article={{ ...article, related: [] }} />,
    ),
    false,
  );
}
for (const slug of ['upload-failed', 'mic-not-working']) {
  const html = renderToStaticMarkup(
    await DiscordPage({ params: Promise.resolve({ slug }) }),
  );
  checkRelated(html, true);
  assert.match(html, /data-related="true"/);
}
checkRelated(
  renderToStaticMarkup(
    <EnglishGuideShell guide={crashGuideEn} contents={[]}>
      <p>Guide steps</p>
    </EnglishGuideShell>,
  ),
  true,
);
console.log(
  'PASS: all verified common-guide STEP targets, all localized article shortcuts, empty related links, JA Discord and EN shell, and navigation-only event markers',
);
