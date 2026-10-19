import { test } from '@playwright/test';
import { execFileSync } from 'node:child_process';
test('Existing English SSR, SEO and link check (HTTP, not a DOM/browser test)', async ({
  baseURL,
}, testInfo) => {
  const output = execFileSync(
    process.execPath,
    ['scripts/check-english-home.mjs'],
    {
      env: { ...process.env, TEST_BASE_URL: baseURL },
      timeout: 90000,
      encoding: 'utf8',
    },
  );
  await testInfo.attach('english-links', {
    body: output,
    contentType: 'text/plain',
  });
});
