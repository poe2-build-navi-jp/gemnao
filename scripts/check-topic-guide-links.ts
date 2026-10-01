import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { articleBySlug } from '../lib/game-articles';
import { gameBySlug } from '../lib/games';
import { saveGuideByGame } from '../lib/tool-guide-links';
import { discordArticleBySlug } from '../lib/discord-articles';
import { pcGamingArticles } from '../lib/pc-gaming-articles';

// Every reciprocal save link must point to an existing, published local-save
// article and an actual anchor emitted by the tool's game filter.
for (const [gameSlug, link] of Object.entries(saveGuideByGame)) {
  const game = gameBySlug(gameSlug);
  assert.ok(
    game?.savePath && !game.focused,
    `Missing tool anchor: ${gameSlug}`,
  );
  const article = articleBySlug(gameSlug, link.slug);
  assert.ok(article, `Missing save article: ${gameSlug}/${link.slug}`);
  assert.equal(article.category, 'save');
  assert.ok(!['draft', 'thin'].includes(article.status ?? 'verified'));
}
assert.equal(
  saveGuideByGame['gta-v-enhanced'],
  undefined,
  'Migration is not local restore',
);

const audio = discordArticleBySlug('stream-no-audio');
assert.ok(audio);
assert.deepEqual(audio.quickFixCauseIndexes, [1, 2, 3]);
assert.equal(audio.quickFixCauseIndexes.length, audio.quickFixes.length);
for (const [index, target] of audio.quickFixCauseIndexes.entries()) {
  assert.ok(audio.causes[target - 1], `Missing cause-${target}`);
  assert.equal(audio.diagnosis?.[index].causeIndex, target);
}
assert.match(audio.quickFixes[0], /配信者本人/);
assert.match(audio.quickFixes[1], /視聴者全員/);
assert.match(audio.quickFixes[2], /視聴者1人/);

const refresh = pcGamingArticles.find(
  (article) => article.slug === 'refresh-rate-stuck-60hz',
);
assert.ok(refresh && refresh.steps.length >= 3);
const toolPage = readFileSync('app/tools/refresh-rate/page.tsx', 'utf8');
const pcPage = readFileSync('app/pc/[slug]/page.tsx', 'utf8');
assert.ok(toolPage.includes('id="retest"'));
assert.ok(pcPage.includes('/tools/refresh-rate#retest'));
for (const target of ['diagnosis', 'step-2', 'step-3']) {
  assert.ok(toolPage.includes(`/pc/refresh-rate-stuck-60hz#${target}`));
}
assert.ok(pcPage.includes('id="diagnosis"'));
assert.ok(pcPage.includes('id={`step-${i + 1}`}'));
console.log(
  'Topic guide links: save targets, Discord branches, and Hz round trip passed.',
);

const mic = discordArticleBySlug('mic-volume-low');
assert.ok(mic?.symptomGuide);
assert.equal(mic.symptomGuide.href, '/discord/user-volume-low');
assert.ok(discordArticleBySlug('user-volume-low'));
assert.ok(mic.related.includes('user-volume-low'));
assert.equal(new Set(mic.related).size, mic.related.length);
const discordPage = readFileSync('app/discord/[slug]/page.tsx', 'utf8');
assert.ok(
  discordPage.indexOf('item.symptomGuide.href') <
    discordPage.indexOf('id="answer"'),
);
const fps = articleBySlug('onimusha-way-of-the-sword', 'low-fps');
assert.ok(fps);
const upscaling = fps.steps.find((step) => step.id === 'step-4');
assert.ok(upscaling);
assert.match(upscaling.actions.join(' '), /対応するGeForce RTX/);
assert.match(upscaling.actions.join(' '), /GTX 1660.*非対応.*FSR/);
assert.match(upscaling.actions.join(' '), /同じ場所・同じ場面/);
assert.doesNotMatch(JSON.stringify(fps), /DLSS 4\.[05]/);
assert.ok(
  fps.sources?.some(
    (source) =>
      source.url === 'https://forums.developer.nvidia.com/t/dlss-4-faq/321939',
  ),
);
console.log(
  'Article clarity: DLSS compatibility and early Discord listening route passed.',
);
