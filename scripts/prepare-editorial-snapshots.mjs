import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { isEditorialSnapshotPath } from '../cloudflare/prerender-policy.mjs';

export async function prepareEditorialSnapshots() {
  const prerender = JSON.parse(await readFile('dist/server/vinext-prerender.json', 'utf8'));
  const manifest = {};
  const output = 'dist/client/_gemnao-snapshots';
  await mkdir(output, { recursive: true });
  for (const route of prerender.routes) {
    const path = route.path || route.route;
    if (route.status !== 'rendered' || !isEditorialSnapshotPath(path)) continue;
    let html = await readFile(join('dist/server/prerendered-routes', `${path.slice(1)}.html`), 'utf8');
    // Match the live wrapper's language handling, without runtime HTML rewriting.
    const locale = path.match(/^\/(en|zh|es)(?:\/|$)/)?.[1];
    if (locale) html = html.replace(/<html([^>]*?)\blang="[^"]*"/, `<html$1lang="${locale === 'zh' ? 'zh-Hans' : locale}"`);
    const head = html.match(/<head>([\s\S]*?)<\/head>/)?.[1] || '';
    if (!/<title>[^<]+<\/title>/.test(head) || !head.includes('rel="canonical"') || !/<h1[\s>]/.test(html) || !html.includes('</html>')) {
      throw new Error(`Incomplete editorial snapshot: ${path}`);
    }
    // A non-HTML extension avoids Pages' clean-URL redirects. The worker sets
    // text/html at the original canonical URL; direct snapshot URLs are denied.
    const name = `${Buffer.from(path).toString('base64url')}.snapshot`;
    await writeFile(join(output, name), html);
    manifest[path] = `/_gemnao-snapshots/${name}`;
  }
  // Missing core groups is a build failure, never a silent runtime fallback.
  for (const required of ['/guide/verify-steam-files', '/pc/disk-usage-100', '/tools/windows-diagnosis', '/en', '/zh', '/es']) {
    if (!manifest[required]) throw new Error(`Missing required editorial snapshot: ${required}`);
  }
  await writeFile('dist/editorial-snapshots.json', JSON.stringify(manifest));
  console.log(`Prepared editorial HTML snapshots: ${Object.keys(manifest).length} (dynamic routes excluded)`);
}
