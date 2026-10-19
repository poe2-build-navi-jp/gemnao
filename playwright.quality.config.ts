import { defineConfig } from '@playwright/test';
const port = Number(process.env.QUALITY_PORT || 3099);
if (!Number.isInteger(port) || port < 1024 || port > 65535)
  throw new Error('Invalid QUALITY_PORT');
export default defineConfig({
  testDir: './tests/quality',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 120000,
  outputDir: 'test-results/quality/artifacts',
  reporter: [
    ['list'],
    ['json', { outputFile: 'test-results/quality/results.json' }],
    ['html', { outputFolder: 'playwright-report/quality', open: 'never' }],
  ],
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    browserName: 'chromium',
    headless: true,
    serviceWorkers: 'block',
    launchOptions: {
      ...(process.env.CHROMIUM_PATH
        ? { executablePath: process.env.CHROMIUM_PATH }
        : {}),
      args: process.env.QUALITY_NO_SANDBOX === '1' ? ['--no-sandbox'] : [],
    },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },
  projects: [
    { name: 'links', testMatch: 'links.spec.ts' },
    ...[375, 390, 430, 1440].map((width) => ({
      name: `width-${width}`,
      testMatch: 'browser.spec.ts',
      use: { viewport: { width, height: 900 } },
    })),
  ],
  webServer: {
    command: `node node_modules/vinext/dist/cli.js start --hostname 127.0.0.1 --port ${port}`,
    url: `http://127.0.0.1:${port}/en`,
    reuseExistingServer: false,
    timeout: 60000,
    env: { WRANGLER_SEND_METRICS: 'false' },
  },
});
