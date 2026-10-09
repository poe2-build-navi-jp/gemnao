import assert from 'node:assert/strict';
import { build } from 'esbuild';
const built = await build({
  stdin: {
    contents: `export {gameArticles} from './lib/game-articles';
      export {articleStepEndpoints, stepsWithEndpoints} from './lib/article-step-endpoints';
      export {nextStepIndex} from './lib/step-navigation';
      export {troubleHubs} from './lib/trouble-hubs';`,
    resolveDir: process.cwd(),
  },
  bundle: true,
  write: false,
  platform: 'node',
  format: 'esm',
});
const {
  gameArticles,
  articleStepEndpoints,
  stepsWithEndpoints,
  nextStepIndex,
  troubleHubs,
} = await import(
  `data:text/javascript;base64,${Buffer.from(built.outputFiles[0].text).toString('base64')}`
);
let endpoints = 0;
for (const [path, boundaries] of Object.entries(articleStepEndpoints)) {
  const article = gameArticles.find((a) => `${a.gameSlug}/${a.slug}` === path);
  assert.ok(article, path);
  const steps = stepsWithEndpoints(article);
  assert.deepEqual(
    steps.map(({ endpoint: _endpoint, ...step }) => step),
    article.steps,
    `${path}: content and feedback IDs retained`,
  );
  for (const [id, endpoint] of Object.entries(boundaries)) {
    const index = steps.findIndex((step) => step.id === id);
    assert.ok(index >= 0, `${path}#${id}`);
    assert.equal(
      nextStepIndex(steps, steps[index], index),
      index,
      `${path}#${id}: no unrelated continuation/resume`,
    );
    if (endpoint.href)
      assert.ok(
        troubleHubs.some((hub) => endpoint.href === `/trouble/${hub.slug}`),
        endpoint.href,
      );
    endpoints++;
  }
  for (const [index, step] of steps.entries()) {
    if (!step.endpoint && !step.nextStepId)
      assert.equal(
        nextStepIndex(steps, step, index),
        Math.min(index + 1, steps.length - 1),
      );
  }
}
const ff = stepsWithEndpoints(
  gameArticles.find((a) => a.gameSlug === 'final-fantasy-resonance'),
);
assert.equal(ff[1].endpoint.href, '/trouble/not-launching');
const dd = stepsWithEndpoints(
  gameArticles.find((a) => a.gameSlug === 'dragons-dogma-2'),
);
assert.equal(dd[4].endpoint.href, '/trouble/fps');
const arc = stepsWithEndpoints(
  gameArticles.find(
    (a) => a.gameSlug === 'arc-raiders' && a.slug === 'matchmaking',
  ),
);
assert.equal(arc.filter((step) => step.endpoint).length, 0);
for (const article of gameArticles) {
  for (const [index, step] of article.steps.entries()) {
    if (step.nextStepId)
      assert.equal(
        nextStepIndex(article.steps, step, index),
        article.steps.findIndex((next) => next.id === step.nextStepId),
      );
  }
}
console.log(
  `PASS: ${Object.keys(articleStepEndpoints).length} mixed-topic articles / ${endpoints} symptom endpoints; valid links, unchanged content/IDs, existing explicit and sequential paths retained`,
);
