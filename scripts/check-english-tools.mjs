// Run after build. Checks the shipped HTML, not just JSX source strings.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { build } from 'esbuild';

const bundle = await build({
  entryPoints: ['lib/windows-diagnosis-release.ts'],
  bundle: true,
  write: false,
  format: 'esm',
  platform: 'node',
});
const { windowsDiagnosisRelease: release } = await import(
  `data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}`
);
const snapshots = JSON.parse(
  await readFile('dist/editorial-snapshots.json', 'utf8'),
);
const prerender = JSON.parse(
  await readFile('dist/server/vinext-prerender.json', 'utf8'),
);
const knownPaths = new Set(
  prerender.routes
    .filter(
      (route) =>
        route.status === 'rendered' ||
        (route.reason === 'dynamic' && !route.route.includes(':')),
    )
    .map((route) => route.path || route.route),
);
const htmlFor = async (path) => {
  assert.ok(snapshots[path], `Missing public snapshot: ${path}`);
  return readFile(`dist/client${snapshots[path]}`, 'utf8');
};
let links = 0;
for (const path of ['/tools', '/tools/windows-diagnosis']) {
  const english = `/en${path}`;
  for (const target of [path, english]) {
    const html = await htmlFor(target);
    const head = html.match(/<head>([\s\S]*?)<\/head>/)?.[1] || '';
    const canonical = head.match(/rel="canonical" href="([^"]+)"/)?.[1];
    assert.equal(new URL(canonical).pathname, target, `Canonical: ${target}`);
    for (const [lang, href] of [
      ['ja', path],
      ['en', english],
      ['x-default', path],
    ]) {
      const tag = [...head.matchAll(/<link\b[^>]*>/g)]
        .map((m) => m[0])
        .find((t) => new RegExp(`hrefLang="${lang}"`, 'i').test(t));
      assert.ok(tag, `Missing ${lang} alternate: ${target}`);
      assert.equal(new URL(tag.match(/href="([^"]+)"/)?.[1]).pathname, href);
    }
    assert.ok(
      !/name="robots" content="[^"]*noindex/.test(head),
      `Unexpected noindex: ${target}`,
    );
    if (!target.startsWith('/en')) continue;
    assert.match(html, /<html lang="en"/);
    assert.match(html, /<main lang="en"/);
    assert.match(head, /property="og:locale" content="en_US"/);
    assert.ok(head.includes(`/images/og${target}.png`));
    await readFile(`public/images/og${target}.png`);
    assert.ok(/<title>[^<]+\| Gemnao<\/title>/.test(head));
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
    const schemas = [
      ...html.matchAll(
        /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
      ),
    ].flatMap((m) => {
      const json = JSON.parse(m[1]);
      return json['@graph'] || [json];
    });
    assert.ok(
      schemas.some(
        (s) => s.inLanguage === 'en' && new URL(s.url).pathname === target,
      ),
      `English schema: ${target}`,
    );
    const visible = html
      .replace(/<details class="language-menu">[\s\S]*?<\/details>/g, '')
      .replace(/<script[\s\S]*?<\/script>/g, '')
      .replace(/<[^>]+>/g, ' ');
    assert.ok(
      !/[ぁ-んァ-ヶ一-龯]/u.test(visible),
      `Japanese visible copy: ${target}`,
    );
    for (const match of html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>/g)) {
      const href = match[1].replaceAll('&amp;', '&');
      if (!href.startsWith('/') && !href.startsWith('#')) continue;
      const url = new URL(href, `https://gemnao.pages.dev${target}`);
      const pathname = url.pathname.replace(/\/$/, '') || '/';
      if (pathname.startsWith('/downloads/')) {
        await readFile(`dist/client${pathname}`);
      } else {
        assert.ok(
          knownPaths.has(pathname),
          `Missing internal route: ${target} -> ${pathname}`,
        );
      }
      if (url.hash && snapshots[pathname]) {
        const linked = await htmlFor(pathname);
        assert.ok(
          linked.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`),
          `Missing anchor: ${target} -> ${href}`,
        );
      }
      links++;
    }
  }
}
// Keep the native application's deliberately small English guide whitelist real.
for (const target of [
  '/en/guide/pc-game-crash',
  '/en/games/monster-hunter-wilds/not-launching',
  '/en/games/monster-hunter-wilds#requirements',
]) {
  const [pathname, fragment] = target.split('#');
  const html = await htmlFor(pathname);
  assert.ok(knownPaths.has(pathname), `Native guide route: ${target}`);
  if (fragment)
    assert.ok(
      html.includes(`id="${fragment}"`),
      `Native guide anchor: ${target}`,
    );
}
const page = await htmlFor('/en/tools/windows-diagnosis');
assert.match(page, /Windows 11 x64 and \.NET Framework 4\.8 or later/);
assert.ok(
  !/\.NET Desktop Runtime 8|requires? \.NET 8/i.test(page),
  'Do not substitute modern .NET for the net48 requirement',
);
const validationDoc = await readFile(
  'docs/english-content-2026-10-03.md',
  'utf8',
);
assert.ok(validationDoc.includes('.NET Framework 4.8 or later'));
assert.ok(!validationDoc.includes('.NET Desktop Runtime 8'));

for (const expected of [
  'unsigned prototype',
  'real Windows PC',
  'Zero records',
  'not fully anonymous',
  'Web feedback submission is not available',
  'Extract All',
  'Gemnao.Diagnostics.exe',
  'Windows DPAPI',
  'Other / not sure',
])
  assert.ok(page.includes(expected), expected);
if (release?.languages.includes('en')) {
  assert.notEqual(release.version, '0.5.0');
  assert.ok(page.includes(`href="/downloads/${release.file}"`));
  assert.ok(page.includes(release.sha256));
  assert.ok(!page.includes('bilingual package is being verified'));
  const zip = await readFile(`dist/client/downloads/${release.file}`);
  assert.equal(zip.length, release.bytes);
  assert.equal(createHash('sha256').update(zip).digest('hex'), release.sha256);
} else {
  assert.ok(page.includes('bilingual package is being verified'));
  assert.ok(
    !/href="\/downloads\//.test(page),
    'No old binary offered as an English download',
  );
}
for (const locale of ['zh', 'es', 'fr']) {
  assert.ok(!snapshots[`/${locale}/tools`]);
  assert.ok(!snapshots[`/${locale}/tools/windows-diagnosis`]);
}
console.log(
  `PASS: English tools HTML, paired canonical/hreflang, schema, language, ${links} real internal links/anchors, and ${release?.languages.includes('en') ? release.version + ' download identity' : 'unavailable-English-artifact guard'}`,
);
