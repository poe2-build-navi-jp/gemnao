import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';
const manifest = JSON.parse(await readFile('dist/editorial-snapshots.json', 'utf8'));
const htmlFor = async (path) => { assert.ok(manifest[path], path); return readFile(`dist/client${manifest[path]}`, 'utf8'); };
for (const path of ['/games/aniimo/login-error', '/guide/pc-game-crash', '/tools/windows-diagnosis', '/gear/save-backup-storage-guide']) {
  const html = await htmlFor(path);
  assert.match(html, /あとで読むに保存/); assert.match(html, /\/my#my-reading-list/);
  assert.match(html, /マイページ/);
  assert.match(html, new RegExp(`<link[^>]+rel="canonical"[^>]+href="https://gemnao.pages.dev${path}"`));
}
for (const path of ['/en/guide/pc-game-crash', '/en/tools/windows-diagnosis', '/en/gear/save-backup-storage-guide', '/en/games/monster-hunter-wilds/not-launching']) {
  const html = await htmlFor(path); assert.match(html, /Save for later/); assert.ok(!html.includes('あとで読むに保存'));
}
const login = await htmlFor('/games/aniimo/login-error');
assert.match(login, /別の症状がある場合/); assert.match(login, /ほかのサイトもつながらない場合/);
assert.match(login, /href="\/status"/); assert.ok(!login.includes('href="/guide/steam-game-not-launching"'));
assert.match(login, /リンクをコピー/);
const bootstrap = [...login.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map((match) => match[1]).find((source) => source.includes('window.gtag = function'));
assert.ok(bootstrap, 'GA bootstrap is present for canonical-host evaluation');
for (const origin of ['https://preview.gemnao.pages.dev', 'http://localhost:5177', 'https://gemnao.pages.dev.evil.example']) {
  const context = { location: { origin, pathname: '/games/aniimo/login-error' } }; context.window = context;
  runInNewContext(bootstrap, context); assert.equal(context.gtag, undefined); assert.equal(context.dataLayer, undefined);
}
for (const pathname of ['/admin', '/admin/settings']) {
  const context = { location: { origin: 'https://gemnao.pages.dev', pathname } }; context.window = context;
  runInNewContext(bootstrap, context); assert.equal(context.gtag, undefined);
}
const production = { location: { origin: 'https://gemnao.pages.dev', pathname: '/games/aniimo/login-error' } }; production.window = production;
runInNewContext(bootstrap, production); assert.equal(production.dataLayer.length, 2); assert.equal(production.dataLayer[1][0], 'config');
console.log('PASS: built JP/EN save UI and canonical, contextual login links, share copy, production GA bootstrap and preview/local/admin exclusion');
