import { test as base, expect } from '@playwright/test';
import {
  requestPolicy,
  localOrigin,
} from '../../scripts/quality/local-policy.mjs';
type Audit = {
  blockedWrites: string[];
  externalBlocked: number;
  apiMocked: number;
  errors: string[];
  badAssets: string[];
};
export const test = base.extend<{ audit: Audit }>({
  audit: [
    async ({ context, baseURL }, use, testInfo) => {
      const origin = localOrigin(baseURL!);
      const audit: Audit = {
        blockedWrites: [],
        externalBlocked: 0,
        apiMocked: 0,
        errors: [],
        badAssets: [],
      };
      await context.route('**/*', async (route) => {
        const request = route.request(),
          policy = requestPolicy(request.url(), request.method(), origin);
        if (policy === 'block-write') {
          audit.blockedWrites.push(new URL(request.url()).pathname);
          return route.abort();
        }
        if (policy === 'block-external') {
          audit.externalBlocked++;
          return route.abort();
        }
        if (policy === 'mock-api') {
          audit.apiMocked++;
          const path = new URL(request.url()).pathname;
          if (path === '/api/discord-servers')
            return route.fulfill({ json: { servers: [] } });
          if (path === '/api/reports/status')
            return route.fulfill({
              json: { enabled: false, publicEnabled: false, canDelete: false },
            });
          if (path === '/api/feedback')
            return route.fulfill({
              json: { rows: [], methods: [], stepResultsAvailable: false },
            });
          return route.fulfill({
            status: 503,
            json: { error: 'local QA fixture: unavailable' },
          });
        }
        return route.continue();
      });
      await context.routeWebSocket('**/*', (socket) => socket.close());
      context.on('page', (page) => {
        page.on('pageerror', (error) => audit.errors.push(error.message));
        page.on('response', (r) => {
          if (
            new URL(r.url()).origin === origin &&
            /\.(css|js|png|webp|svg)(?:\?|$)/.test(r.url()) &&
            r.status() >= 400
          )
            audit.badAssets.push(r.url());
        });
      });
      await use(audit);
      await testInfo.attach('network-and-runtime-audit', {
        body: JSON.stringify(audit, null, 2),
        contentType: 'application/json',
      });
      expect(
        audit.blockedWrites,
        'Unexpected write attempted (blocked before network)',
      ).toEqual([]);
      expect(audit.errors, 'Browser JavaScript errors').toEqual([]);
      expect(audit.badAssets, 'Failed local assets').toEqual([]);
    },
    { auto: true },
  ],
});
export { expect };
