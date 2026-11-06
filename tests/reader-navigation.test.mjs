import { build } from 'esbuild';
import { mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

await mkdir('.wrangler/reader-navigation', { recursive: true });
await build({
  stdin: {
    contents: `export { InteractiveSteps } from './components/interactive-steps';
      export { StepResultCollection, StepResultButtons } from './components/step-result-collection';`,
    resolveDir: process.cwd(),
  },
  outfile: '.wrangler/reader-navigation/components.mjs',
  bundle: true,
  platform: 'node',
  format: 'esm',
  packages: 'external',
  jsx: 'automatic',
});
const { InteractiveSteps, StepResultCollection, StepResultButtons } =
  await import('../.wrangler/reader-navigation/components.mjs');
const steps = [
  { id: 'first', title: 'First', actions: ['Check first'] },
  { id: 'last', title: 'Last', actions: ['Check last'] },
];
const props = {
  contextSlug: 'navigation-test',
  topic: 'test',
  articleTitle: 'Test',
  articlePath: '/guide/test',
  steps,
};
// Server rendering has no browser progress and cannot submit feedback. Readers
// (and no-JS clients) must still see valid exits before any votes are recorded.
await test('Japanese first visit exposes next actions, notebook and official sources', () => {
  const html = renderToStaticMarkup(
    h(InteractiveSteps, {
      ...props,
      nextLinks: [{ href: '/guide/other', label: 'Other symptom' }],
    }),
  );
  assert.match(html, /id="step-next-actions"/);
  assert.match(html, /href="#step-next-actions"/);
  assert.match(html, /id="step-notebook"/);
  assert.match(html, /href="#step-notebook"/);
  assert.match(html, /href="#references"/);
  assert.match(html, /href="\/guide\/other"/);
});
await test('no related links still offers a final exit instead of a dead end', () => {
  const html = renderToStaticMarkup(h(InteractiveSteps, props));
  assert.match(html, /id="step-next-actions"/);
  assert.match(html, /まだ直らない・これ以上試せない場合/);
});
await test('symptom endpoints retain their own destination instead of unrelated steps', () => {
  const html = renderToStaticMarkup(
    h(InteractiveSteps, {
      ...props,
      steps: [
        {
          ...steps[0],
          endpoint: {
            symptom: 'Controller',
            href: '/trouble/controller',
            label: 'Controller',
          },
        },
        steps[1],
      ],
    }),
  );
  assert.match(html, /href="\/trouble\/controller"/);
  assert.doesNotMatch(html, /対象外なら「Last」/);
});
for (const locale of ['en', 'zh', 'es']) {
  const render = (method, customSteps = steps) =>
    renderToStaticMarkup(
      h(
        StepResultCollection,
        {
          contextSlug: 'navigation-test',
          topic: 'test',
          locale,
          steps: customSteps,
        },
        h(StepResultButtons, { method }),
      ),
    );
  await test(`${locale}: unavailable reporting does not hide next or final navigation`, () => {
    assert.match(render('first'), /href="#last"/);
    assert.match(render('last'), /href="#references"/);
  });
  await test(`${locale}: explicit branches and symptom stops remain intact`, () => {
    assert.match(
      render('first', [
        { ...steps[0], nextStepId: 'target' },
        steps[1],
        { id: 'target', title: 'Target' },
      ]),
      /href="#target"/,
    );
    assert.match(
      render('first', [{ ...steps[0], stopAfter: true }, steps[1]]),
      /href="#references"/,
    );
    assert.doesNotMatch(
      render('first', [{ ...steps[0], stopAfter: true }, steps[1]]),
      /href="#last"/,
    );
  });
}
