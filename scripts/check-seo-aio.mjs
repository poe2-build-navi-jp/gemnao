// Validate rendered output, not only source templates. Never infer Google indexing.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const decode = (text) => text.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const attribute = (tag, name) => decode(tag.match(new RegExp(`\\b${name}="([^"]*)"`, 'i'))?.[1] || '');
const nodes = (value) => Array.isArray(value) ? value.flatMap(nodes) : value?.['@graph'] ? value['@graph'].flatMap(nodes) : [value];

export function inspectSeo(html, path, origin = 'https://gemnao.pages.dev') {
  const head = html.split('</head>')[0];
  const title = decode(head.match(/<title>([\s\S]*?)<\/title>/)?.[1] || '');
  const tags = head.match(/<(?:meta|link)\b[^>]*>/g) || [];
  const description = attribute(tags.find((tag) => attribute(tag, 'name') === 'description') || '', 'content');
  const canonical = attribute(tags.find((tag) => attribute(tag, 'rel') === 'canonical') || '', 'href');
  assert.ok(title.trim(), `${path}: missing title`);
  assert.ok(description.trim(), `${path}: missing description`);
  assert.equal(canonical, `${origin}${path}`, `${path}: canonical`);
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, `${path}: H1 count`);
  const schemas = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].flatMap((match) => nodes(JSON.parse(match[1])));
  const articles = schemas.filter((node) => ['Article', 'TechArticle', 'NewsArticle', 'BlogPosting'].includes(node?.['@type']));
  for (const article of articles) {
    assert.ok(article.author?.url, `${path}: article author URL`);
    assert.equal(article.author['@id'], `${origin}/about#editorial-team`, `${path}: author identity`);
    assert.equal(article.publisher?.['@id'], `${origin}/#operator`, `${path}: publisher identity`);
    assert.equal(article.mainEntityOfPage, canonical, `${path}: article canonical`);
    for (const url of article.citation || []) {
      assert.ok(decode(html).includes(`href="${url}"`), `${path}: citation absent from visible links: ${url}`);
    }
  }
  if (/^\/(?:en\/)?games\/[^/]+$/.test(path)) {
    assert.equal(articles.length, 1, `${path}: game hub article`);
    assert.ok(articles[0].citation?.length, `${path}: hub sources`);
    assert.ok(articles[0].image, `${path}: hub image`);
    assert.ok(html.includes('hrefLang="en"') || html.includes('hrefLang="ja"'), `${path}: editorial policy link`);
  }
  for (const faq of schemas.filter((node) => node?.['@type'] === 'FAQPage')) {
    assert.ok(faq.mainEntity?.length, `${path}: empty FAQ schema`);
  }
  return { title, description, articles: articles.length };
}

async function checkBuild() {
  const manifest = JSON.parse(await readFile('dist/editorial-snapshots.json', 'utf8'));
  const sitemap = await readFile('dist/client/sitemap.xml', 'utf8');
  const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => decode(match[1]));
  const titles = new Map(), descriptions = new Map();
  let checked = 0, articles = 0;
  const dynamic = [];
  for (const url of urls) {
    const path = new URL(url).pathname;
    if (!manifest[path]) {
      assert.ok(!/^\/(?:en\/)?(?:games\/[^/]+(?:\/[^/]+)?|(?:guide|pc|discord)\/[^/]+)$/.test(path), `${path}: missing editorial snapshot`);
      dynamic.push(path);
      continue;
    }
    const html = await readFile(`dist/client${manifest[path]}`, 'utf8');
    const head = html.split('</head>')[0];
    assert.ok(!/<meta[^>]*name="robots"[^>]*content="[^"]*\bnoindex\b/i.test(head), `${path}: noindex in sitemap`);
    const result = inspectSeo(html, path, new URL(url).origin);
    for (const [map, value, label] of [[titles, result.title, 'title'], [descriptions, result.description, 'description']]) {
      assert.ok(!map.has(value), `${path}: duplicate ${label} with ${map.get(value)}`);
      map.set(value, path);
    }
    checked++;
    articles += result.articles;
  }
  console.log(`PASS: SEO/AIO output checks on ${checked} indexable snapshots (${articles} articles); ${urls.length} sitemap URLs. Dynamic pages excluded: ${dynamic.join(', ')}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await checkBuild();
