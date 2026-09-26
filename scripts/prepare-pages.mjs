import { copyFile, unlink, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { build } from 'esbuild';

await build({
  entryPoints: ['cloudflare/worker-source.mjs'],
  outfile: 'dist/client/_worker.bundle.js',
  bundle: true,
  format: 'esm',
  platform: 'node',
  external: ['cloudflare:workers'],
  // Scopes the edge HTML cache to this deployment (see worker-source.mjs).
  define: {
    __BUILD_ID__: JSON.stringify(
      `${process.env.CF_PAGES_COMMIT_SHA || 'local'}-${Date.now().toString(36)}`,
    ),
  },
});

// Keep `_worker.js` as a tiny stable entry point. The Cloudflare project still
// has a legacy post-build copy command for this file, so copying it again is
// harmless and no dashboard change is required.
await copyFile('cloudflare/worker-wrapper.mjs', 'dist/client/_worker.js');

// Cloudflare Pages validates every generated Wrangler configuration it finds.
// Vinext's server config is for Workers and contains `main`/`assets`, which
// conflicts with this Pages project's `pages_build_output_dir` config.
await unlink('dist/server/wrangler.json').catch((error) => {
  if (error?.code !== 'ENOENT') throw error;
});

// Vinext also leaves a Wrangler redirect that points back to the removed
// Workers config. Pages follows this redirect unless it is removed as well.
await unlink('.wrangler/deploy/config.json').catch((error) => {
  if (error?.code !== 'ENOENT') throw error;
});

// Use the same registry as the route: new verified articles cannot be omitted
// from the static sitemap served by Pages. Do not invent fresh review dates.
const sitemapBuild = await build({
  entryPoints: ['app/sitemap.ts'],
  bundle: true,
  write: false,
  platform: 'node',
  format: 'esm',
});
const { default: sitemap } = await import(
  `data:text/javascript;base64,${Buffer.from(sitemapBuild.outputFiles[0].text).toString('base64')}`
);
const escapeXml = (value) =>
  String(value).replace(
    /[<>&"']/g,
    (char) =>
      ({
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;',
        "'": '&apos;',
      })[char],
  );
const urls = sitemap();
if (new Set(urls.map((item) => item.url)).size !== urls.length)
  throw new Error('Duplicate sitemap URLs');
const xml =
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls
    .map(
      (item) =>
        `<url><loc>${escapeXml(item.url)}</loc><lastmod>${new Date(item.lastModified).toISOString().slice(0, 10)}</lastmod></url>`,
    )
    .join('\n') +
  '\n</urlset>\n';
await writeFile('dist/client/sitemap.xml', xml);
console.log(`Generated sitemap: ${urls.length} URLs`);

// Only list diagrams that are embedded by an indexable page. Keep the existing
// canonical sitemap unchanged and expose images via a separate small sitemap.
const visualBuild = await build({
  entryPoints: ['lib/visual-guides.ts'],
  bundle: true,
  write: false,
  platform: 'node',
  format: 'esm',
});
const { visualGuides, troubleVisualBySlug } = await import(
  `data:text/javascript;base64,${Buffer.from(visualBuild.outputFiles[0].text).toString('base64')}`
);
for (const { image, ogImage } of visualGuides) {
  if (!existsSync(`dist/client${image}`) || !existsSync(`dist/client${ogImage}`))
    throw new Error(`Missing visual asset for ${image}`);
}
const imageByPage = new Map(visualGuides.map((item) => [item.page, item.image]));
for (const slug of ['not-launching', 'crash', 'fps', 'save', 'controller']) {
  imageByPage.set(`/trouble/${slug}`, troubleVisualBySlug(slug).image);
}
const imageEntries = urls
  .map(({ url }) => ({ url, image: imageByPage.get(new URL(url).pathname) }))
  .filter(({ image }) => image);
if (imageEntries.length !== imageByPage.size)
  throw new Error('Image sitemap includes a page missing from the canonical sitemap');
const imageXml =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n' +
  imageEntries
    .map(({ url, image }) =>
      `<url><loc>${escapeXml(url)}</loc><image:image><image:loc>${escapeXml(new URL(image, url).href)}</image:loc></image:image></url>`,
    )
    .join('\n') +
  '\n</urlset>\n';
await writeFile('dist/client/image-sitemap.xml', imageXml);
console.log(`Generated image sitemap: ${imageEntries.length} pages`);
