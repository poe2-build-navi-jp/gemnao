import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/diagnosis',
  testMatch: 'browser.spec.ts',
  fullyParallel: false,
  workers: 1,
  timeout: 40000,
  retries: 0,
  reporter: [
    ['list'],
    ['json', { outputFile: 'test-results/diagnosis-results.json' }],
  ],
  use: {
    baseURL: process.env.DIAGNOSIS_TEST_URL || 'http://127.0.0.1:8788',
    browserName: 'chromium',
    headless: true,
    launchOptions: {
      executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
      args: ['--no-sandbox'],
    },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
});
