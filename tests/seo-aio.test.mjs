import test from 'node:test';
import assert from 'node:assert/strict';
import { inspectSeo } from '../scripts/check-seo-aio.mjs';

const origin = 'https://gemnao.pages.dev';
const path = '/guide/example';
const article = {
  '@type': 'TechArticle',
  author: { '@id': `${origin}/about#editorial-team`, url: `${origin}/about` },
  publisher: { '@id': `${origin}/#operator` },
  mainEntityOfPage: origin + path,
  citation: ['https://example.com/support?a=1&b=2'],
};
const render = (value = article) => `<html><head><title>Example</title><meta name="description" content="Example guide"><link rel="canonical" href="${origin}${path}"></head><body><h1>Example</h1><a href="https://example.com/support?a=1&amp;b=2">Support</a><script type="application/ld+json">${JSON.stringify(value)}</script></body></html>`;
await test('structured-data citations match encoded visible URLs', () => {
  assert.equal(inspectSeo(render(), path).articles, 1);
});
await test('rejects metadata that diverges from the page or visible evidence', () => {
  assert.throws(() => inspectSeo(render({ ...article, mainEntityOfPage: origin + '/wrong' }), path), /article canonical/);
  assert.throws(() => inspectSeo(render({ ...article, citation: ['https://example.com/hidden'] }), path), /citation absent/);
  assert.throws(() => inspectSeo(render({ ...article, author: { name: 'Unknown' } }), path), /author URL/);
  assert.throws(() => inspectSeo(render({ '@type': 'FAQPage', mainEntity: [] }), path), /empty FAQ/);
});
