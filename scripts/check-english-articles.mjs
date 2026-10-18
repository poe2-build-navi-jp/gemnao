// Post-build regression: complete English articles and their Japanese pairs.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { isEditorialSnapshotPath } from '../cloudflare/prerender-policy.mjs';

const manifest = JSON.parse(
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
// This real, locale-validated dynamic route has no static params.
if (prerender.routes.some(route => route.route === '/:locale/reports' && route.reason === 'no-static-params')) {
  for (const locale of ['en', 'zh', 'es']) knownPaths.add(`/${locale}/reports`);
}
const paths = [
  ...['shader-compilation-crash','stutter-windowed','controller-sprint'].map(slug => `/games/the-blood-of-dawnwalker/${slug}`),
  ...['not-launching','black-screen','login-error','video-memory-error','launcher-display'].map(slug => `/games/aniimo/${slug}`),
  '/games/dragons-dogma-2/performance',
  ...['save-data','not-launching','system-requirements','dedicated-server-settings','dedicated-server-port'].map(slug => `/games/palworld/${slug}`),
  ...['save-data','fps','controller','mod','config-file','system-requirements','hdr','ultrawide'].map(slug => `/games/monster-hunter-wilds/${slug}`),
  ...['save-data','not-launching','fps','ultrawide','hdr','mod'].map(slug => `/games/elden-ring/${slug}`),
  '/discord/recommended-bots',
  '/pc/pc-broken',
  '/pc/pc-hacked-signs',
  '/pc/windows-update-stuck',
  '/pc/windows-update-0x800f081f',
  '/pc/file-explorer-freezes-on-right-click',
  '/pc/sleep-wakes-up-by-itself',
  '/pc/black-screen-after-sign-in',
  '/pc/wifi-option-missing',
  '/pc/wifi-connected-no-internet',
  '/pc/refresh-rate-stuck-60hz',
  '/pc/gaming-shortcut-keys',
  '/pc/usb-c-device-not-recognized',
  '/pc/second-monitor-not-detected',
  '/pc/audio-after-update',
  '/pc/bluetooth-option-missing',
  '/pc/microphone-after-update',
  '/pc/call-starts-audio-disappears',
  '/pc/bluetooth-connected-no-sound',
  '/games/palworld/dedicated-server-backup',
  '/gear/save-backup-storage-guide',
  '/gear/discord-microphone-guide',
  '/guide/pc-game-crash',
  '/guide/steam-game-not-launching',
  '/guide/stutter-fix',
  '/guide/verify-steam-files',
  '/guide/gpu-driver-update',
  '/guide/black-screen',
  '/guide/low-fps',
  '/guide/save-data-backup',
  '/guide/steam-cloud-sync-error',
  '/guide/pc-game-freezes',
  '/guide/pc-shuts-down-while-gaming',
  '/guide/bsod-while-gaming',
  '/guide/reshade-uninstall',
  '/guide/tpm-secure-boot',
  '/guide/windows-11-required',
  '/guide/ray-tracing-gpu',
  '/guide/reset-config-file',
  '/guide/remove-mods-safely',
  '/guide/uninstall-save-data',
  '/guide/shader-cache-delete',
  '/guide/steam-disk-write-error',
  '/guide/vram-shortage',
  '/guide/low-gpu-usage',
  '/guide/directx-error',
  '/guide/visual-c-runtime-error',
  '/guide/no-game-audio',
  '/guide/steam-input-controller',
  '/guide/controller-double-input',
  '/discord/cant-hear-voice',
  '/discord/audio-input-not-found',
  '/discord/error-1001',
  '/discord/error-1002',
  '/discord/error-1003',
  '/discord/bluetooth-audio-problem',
  '/discord/bot-add',
  '/discord/bot-not-responding',
  '/discord/bot-remove',
  '/discord/call-disconnects',
  '/discord/camera-not-working',
  '/discord/crashing',
  '/discord/echo-double-voice',
  '/discord/game-not-detected',
  '/discord/game-volume-lowers',
  '/discord/login-error',
  '/discord/mic-volume-low',
  '/discord/no-route',
  '/discord/user-volume-low',
  '/discord/voice-cutting-out',
  '/discord/slow-performance',
  '/discord/stream-stuttering',
  '/discord/voice-client-outdated',
  '/discord/rtc-connecting',
  '/discord/screen-share-not-working',
  '/discord/system-helper',
  '/discord/notifications-not-working',
  '/discord/overlay-not-showing',
  '/discord/phone-verification-error',
  '/discord/not-opening',
  '/discord/loading-stuck',
  '/discord/update-failed',
  '/discord/installation-failed',
  '/discord/mic-not-working',
  '/discord/stream-no-audio',
  '/discord/screen-share-black-screen',
  '/games/monster-hunter-wilds/not-launching',
  '/games/ace-combat-8/error-st-3100001',
];
const htmlFor = async (path) => {
  assert.ok(manifest[path], `Missing editorial snapshot: ${path}`);
  return readFile(`dist/client${manifest[path]}`, 'utf8');
};
let links = 0;
for (const original of paths) {
  const english = `/en${original}`;
  assert.ok(isEditorialSnapshotPath(english), english);
  for (const path of [original, english]) {
    const html = await htmlFor(path);
    const head = html.match(/<head>([\s\S]*?)<\/head>/)?.[1] || '';
    assert.equal(
      new URL(head.match(/rel="canonical" href="([^"]+)"/)?.[1]).pathname,
      path,
    );
    assert.ok(!/name="robots" content="[^"]*noindex/.test(head), path);
    for (const [language, target] of [
      ['ja', original],
      ['en', english],
      ['x-default', original],
    ]) {
      const tag = [...head.matchAll(/<link\b[^>]*>/g)]
        .map((m) => m[0])
        .find((tag) => new RegExp(`hrefLang="${language}"`, 'i').test(tag));
      assert.ok(tag, `${path}: missing ${language}`);
      assert.equal(new URL(tag.match(/href="([^"]+)"/)?.[1]).pathname, target);
    }
    const menu =
      html.match(/<details class="language-menu">([\s\S]*?)<\/details>/)?.[1] ||
      '';
    assert.ok(
      menu.includes(`href="${path === original ? english : original}"`),
      `Reciprocal switch: ${path}`,
    );
    if (path === original) continue;
    assert.match(html, /<html lang="en"/);
    assert.match(html, /<main lang="en"/);
    assert.match(head, /property="og:locale" content="en_US"/);
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
    assert.ok(head.includes(`/images/og${english}.png`), `English OG: ${path}`);
    await readFile(`public/images/og${english}.png`);
    const schemas = [
      ...html.matchAll(
        /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
      ),
    ].flatMap((m) => {
      const json = JSON.parse(m[1]);
      return Array.isArray(json) ? json : json['@graph'] || [json];
    });
    assert.ok(
      schemas.some(
        (schema) =>
          schema.inLanguage === 'en' &&
          schema.mainEntityOfPage === `https://gemnao.pages.dev${path}`,
      ),
      `English schema: ${path}`,
    );
    const visible = html
      .replace(/<details class="language-menu">[\s\S]*?<\/details>/g, '')
      .replace(/<script[\s\S]*?<\/script>/g, '')
      .replace(/<[^>]+>/g, ' ');
    assert.ok(
      !/[ぁ-んァ-ヶ一-龯]/u.test(visible),
      `Untranslated text: ${path}`,
    );
    assert.ok(
      visible.length > 5000,
      `Suspiciously incomplete article: ${path}`,
    );
    for (const match of html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>/g)) {
      const href = match[1].replaceAll('&amp;', '&');
      if (!href.startsWith('/') && !href.startsWith('#')) continue;
      const url = new URL(href, `https://gemnao.pages.dev${path}`);
      const target = url.pathname.replace(/\/$/, '') || '/';
      assert.ok(knownPaths.has(target), `${path}: missing ${href}`);
      if (url.hash && manifest[target])
        assert.ok(
          (await htmlFor(target)).includes(
            `id="${decodeURIComponent(url.hash.slice(1))}"`,
          ),
          `${path}: missing anchor ${href}`,
        );
      links++;
    }
  }
}
const index = await htmlFor('/en/guide');
const indexJa = await htmlFor('/guide');
for (const html of [index, indexJa]) {
  assert.ok(html.includes('hrefLang="en" href="https://gemnao.pages.dev/en/guide"'));
  assert.ok(html.includes('hrefLang="ja" href="https://gemnao.pages.dev/guide"'));
  assert.ok(html.includes('hrefLang="zh-Hans" href="https://gemnao.pages.dev/zh/guide"'));
  assert.ok(html.includes('hrefLang="es" href="https://gemnao.pages.dev/es/guide"'));
}
assert.ok(index.includes('rel="canonical" href="https://gemnao.pages.dev/en/guide"'));
assert.ok(!/name="robots" content="[^"]*noindex/.test(index));
assert.ok(index.includes('"numberOfItems":28'));
for (const path of paths.filter(path => path.startsWith('/guide/'))) {
  assert.ok(index.includes(`href="/en${path}"`), `Index discovery: ${path}`);
  assert.ok((await htmlFor(`/en${path}`)).includes('href="/en/guide"'));
}
assert.ok(index.includes('/images/og/en/guide.png'));
assert.ok(index.includes('href="/zh/guide"') && index.includes('href="/es/guide"'));
const discordIndex = await htmlFor('/en/discord');
assert.ok(discordIndex.includes('"numberOfItems":38'));
for (const html of [discordIndex, await htmlFor('/discord')]) {
 const head = html.match(/<head>([\s\S]*?)<\/head>/)?.[1] || '';
 assert.ok(head.includes('hrefLang="en" href="https://gemnao.pages.dev/en/discord"'));
 assert.ok(!/hrefLang="(?:zh-Hans|es)"/.test(head));
}
for (const slug of ['recommended-bots','upload-failed','mic-not-working','stream-no-audio','screen-share-black-screen','not-opening','loading-stuck','update-failed','installation-failed','cant-hear-voice','audio-input-not-found','error-1001','error-1002','error-1003','bluetooth-audio-problem','bot-add','bot-not-responding','bot-remove','call-disconnects','camera-not-working','crashing','echo-double-voice','game-not-detected','game-volume-lowers','login-error','mic-volume-low','no-route','notifications-not-working','overlay-not-showing','phone-verification-error','rtc-connecting','screen-share-not-working','system-helper','slow-performance','stream-stuttering','voice-client-outdated','user-volume-low','voice-cutting-out']) assert.ok(discordIndex.includes(`href="/en/discord/${slug}"`));
assert.ok(discordIndex.includes('rel="canonical" href="https://gemnao.pages.dev/en/discord"'));
assert.ok(discordIndex.includes('/images/og/en/discord.png'));
const microphone = await htmlFor('/en/gear/discord-microphone-guide');
assert.match(microphone, /amazon\.co\.jp\/dp\/B08H6X6G28/);
assert.match(microphone, /rel="sponsored nofollow noopener"/);
assert.ok(
  microphone.includes('Amazon Japan') &&
    microphone.includes('As an Amazon Associate'),
);
assert.ok(
  microphone.indexOf('id="before-buying"') <
    microphone.indexOf('data-affiliate-asin'),
);
assert.ok(!/AggregateRating|ratingValue/.test(microphone));
const storage = await htmlFor('/en/gear/save-backup-storage-guide');
assert.ok(!storage.includes('data-affiliate-asin'));
assert.ok(
  storage.includes('You do not need new hardware') &&
    storage.includes('Matching counts and sizes alone'),
);
const wilds = await htmlFor('/en/games/monster-hunter-wilds/not-launching');
for (const required of [
  'one anonymous user report',
  'System32',
  'unverified',
  'Two loaders were temporarily disabled together',
  'Risk: high',
  'do not re-enable extensions',
  'external cloud storage',
  'not a publisher-endorsed fix',
])
  assert.ok(wilds.includes(required), required);
const ace = await htmlFor('/en/games/ace-combat-8/error-st-3100001');
assert.ok(ace.includes('href="/en/games/ace-combat-8"'));
assert.ok(ace.includes('correct time zone for your location'));

for (const path of [
  '/zh/guide/stutter-fix',
  '/es/gear/discord-microphone-guide',
])
  assert.ok(!manifest[path], `Invented translation: ${path}`);
const sitemap = await readFile('dist/client/sitemap.xml', 'utf8');
for (const original of paths)
  assert.ok(
    sitemap.includes(`https://gemnao.pages.dev/en${original}</loc>`),
    original,
  );
assert.ok(sitemap.includes('https://gemnao.pages.dev/en/guide</loc>'));
const home = await htmlFor('/en');
for (const original of paths)
  assert.ok(
    home.includes(`href="/en${original}"`),
    `English home discovery: ${original}`,
  );
assert.ok(home.includes('href="/en/tools/windows-diagnosis"'));
console.log(
  `PASS: ${paths.length} complete English articles; reciprocal metadata/menu, language/schema/OG/sitemap, ${links} internal links and anchors, safe case wording, existing Japan affiliate and no phantom translations`,
);

for (const locale of ['zh','es']) for (const suffix of ['/guide','/guide/save-data-backup','/guide/steam-cloud-sync-error','/guide/steam-game-not-launching','/guide/pc-game-crash','/guide/verify-steam-files','/guide/low-fps']) {
  const path = `/${locale}${suffix}`;
  const html = await htmlFor(path);
  const head = html.match(/<head>([\s\S]*?)<\/head>/)?.[1] || '';
  const tag = locale === 'zh' ? 'zh-Hans' : 'es';
  assert.ok(head.includes(`rel="canonical" href="https://gemnao.pages.dev${path}"`));
  assert.ok(!/name="robots" content="[^"]*noindex/.test(head));
  assert.ok(head.includes(`/images/og${path}.png`));
  await readFile(`public/images/og${path}.png`);
  assert.ok(html.includes(`<main lang="${tag}"`));
  assert.ok(html.includes(`"inLanguage":"${tag}"`));
  assert.ok(sitemap.includes(`https://gemnao.pages.dev${path}</loc>`));
  for (const counterpart of ['', '/en','/zh','/es']) {
    const pair = await htmlFor(`${counterpart}${suffix}`);
    assert.ok(pair.includes(`hrefLang="${tag}" href="https://gemnao.pages.dev${path}"`));
  }
  const visible = html.replace(/<details class="language-menu">[\s\S]*?<\/details>/g,'').replace(/<script[\s\S]*?<\/script>/g,'').replace(/<[^>]+>/g,' ');
  assert.ok(!(locale === 'zh' ? /[ぁ-んァ-ヶ]/u : /[ぁ-んァ-ヶ一-龯]/u).test(visible));
  for (const match of html.matchAll(/<a\b[^>]*href="([^"?#]*)([^" ]*)"/g)) {
    const href = match[1];
    if (!href.startsWith('/')) continue;
    const target = new URL(href,'https://gemnao.pages.dev').pathname.replace(/\/$/, '') || '/';
    assert.ok(knownPaths.has(target), `New localized guide broken link: ${path} -> ${target}`);
  }
  if (['/guide/steam-cloud-sync-error','/guide/steam-game-not-launching','/guide/verify-steam-files','/guide/low-fps'].includes(suffix)) for (const id of ['step-1','step-2','step-3','step-4']) assert.ok(html.includes(`id="${id}"`));
  if (suffix.endsWith('pc-game-crash')) for (const id of ['step-1','step-2','step-3','crash-history','crash-record-examples','steam-client-case']) assert.ok(html.includes(`id="${id}"`));
  if (suffix === '/guide') assert.ok(html.includes('"numberOfItems":6'));
  if (suffix.endsWith('save-data-backup')) for (const id of ['step-1','step-2','step-3','safe-restore']) assert.ok(html.includes(`id="${id}"`));
  assert.ok((await htmlFor(`/${locale}`)).includes(`href="${path}"`));
}
console.log('PASS: zh/es guide indexes, save backup and Cloud pages; reciprocal four-language metadata, sources, navigation and sitemap');

const pcIndex = await htmlFor('/en/pc');
assert.ok(pcIndex.includes('"numberOfItems":19'));
for (const html of [pcIndex, await htmlFor('/pc')]) {
 const head = html.match(/<head>([\s\S]*?)<\/head>/)?.[1] || '';
 assert.ok(head.includes('hrefLang="en" href="https://gemnao.pages.dev/en/pc"'));
 assert.ok(head.includes('hrefLang="ja" href="https://gemnao.pages.dev/pc"'));
 assert.ok(!/hrefLang="(?:zh-Hans|es)"/.test(head));
}
assert.ok(pcIndex.includes('/images/og/en/pc.png'));
for (const slug of ['pc-broken','pc-hacked-signs','windows-update-stuck','windows-update-0x800f081f','file-explorer-freezes-on-right-click','sleep-wakes-up-by-itself','black-screen-after-sign-in','wifi-option-missing','wifi-connected-no-internet','refresh-rate-stuck-60hz','gaming-shortcut-keys','usb-c-device-not-recognized','second-monitor-not-detected','repair-or-replace','microphone-after-update','call-starts-audio-disappears','bluetooth-connected-no-sound','audio-after-update','bluetooth-option-missing']) {
 assert.ok(pcIndex.includes(`href="/en/pc/${slug}"`));
 assert.ok((await htmlFor(`/en/pc/${slug}`)).includes('href="/en/pc"'));
}
console.log('PASS: English PC index and nineteen reciprocal article links');

const shortcuts = await htmlFor('/en/pc/gaming-shortcut-keys');
assert.ok(shortcuts.includes('id="shortcut-list"'));
for (const key of ['Windows + Ctrl + Shift + B','Ctrl + Shift + Esc','Alt + Enter','Windows + Alt + B','F12','Windows + Shift + S','Windows + R']) assert.ok(shortcuts.includes(key));
