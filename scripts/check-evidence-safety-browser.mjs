import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:3001';
assert.ok(['127.0.0.1', 'localhost'].includes(new URL(base).hostname));
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROMIUM_PATH,
  args: ['--no-sandbox'],
});
const routes = [
  'baldurs-gate-3/crash-on-startup',
  'helldivers-2/gameguard-error-114',
  'hogwarts-legacy/crash',
].flatMap((p) => ['', '/en', '/zh', '/es'].map((l) => `${l}/games/${p}`));
routes.push(
  '/games/onimusha-way-of-the-sword/not-launching',
  '/games/aion2/login-error',
  '/games/gears-of-war-e-day/not-launching',
);
const banned = [
  'セキュリティソフト・ファイアウォール・グラフィック調整',
  '关闭杀毒软件、防火墙',
  'Cierra el antivirus, el cortafuegos',
  'セキュリティソフトを一時停止して接続できたら',
  'ゲームのフォルダを例外に追加する',
  'Añade excepciones para nProtect',
  '查看安全软件的隔离记录，把游戏文件夹添加为例外',
];
await mkdir('outputs/evidence-safety', { recursive: true });
let checked = 0;
try {
  for (const width of [375, 390, 430, 1440]) {
    const ctx = await browser.newContext({ viewport: { width, height: 960 } });
    await ctx.route('**/*', (r) => {
      const u = new URL(r.request().url());
      if (u.origin !== new URL(base).origin) return r.abort();
      if (u.pathname.startsWith('/api/'))
        return r.fulfill({ json: { rows: [], methods: [] } });
      return r.continue();
    });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    for (const path of routes) {
      const response = await page.goto(base + path, {
        waitUntil: 'networkidle',
      });
      assert.equal(response.status(), 200, path);
      const text = await page.locator('main').innerText();
      for (const needle of banned)
        assert.ok(
          !text.includes(needle),
          `${path}: unsafe instruction ${needle}`,
        );
      assert.ok(
        await page
          .locator(
            'a[href*="support.microsoft.com/en-us/windows/security/threat-malware-protection"]',
          )
          .count(),
        `${path}: missing primary source`,
      );
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
        `${path} overflow at ${width}`,
      );
      checked++;
    }
    await page.goto(
      base + '/games/helldivers-2/gameguard-error-114#utilities',
      { waitUntil: 'networkidle' },
    );
    await page.locator('#utilities').scrollIntoViewIfNeeded();
    await page.screenshot({
      path: `outputs/evidence-safety/helldivers-${width}.png`,
    });
    assert.deepEqual(errors, []);
    await ctx.close();
  }
  console.log(
    `PASS: ${checked} page/width combinations, 4 locales, primary links, no blanket disabling instructions, no overflow/JS errors; APIs mocked, external requests blocked`,
  );
} finally {
  await browser.close();
}
