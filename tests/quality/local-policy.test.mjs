import { createServer } from 'node:http';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  localOrigin,
  requestPolicy,
  readLocal,
} from '../../scripts/quality/local-policy.mjs';
const base = 'http://127.0.0.1:3099';
await test('reject production URLs, credentials, non-HTTP and ambiguous bases', () => {
  for (const value of [
    'https://gemnao.pages.dev',
    'http://localhost.example.com',
    'file:///tmp/a',
    'http://user:pass@localhost',
    'http://localhost/api',
    'http://localhost?q=x',
  ])
    assert.throws(() => localOrigin(value));
  assert.equal(localOrigin(base), base);
});
await test('only same-origin reads reach the local server', () => {
  assert.equal(requestPolicy(base + '/en', 'GET', base), 'allow-read');
  assert.equal(
    requestPolicy(base + '/api/reports/status', 'GET', base),
    'mock-api',
  );
  assert.equal(
    requestPolicy('https://www.google-analytics.com/g/collect', 'GET', base),
    'block-external',
  );
  for (const verb of ['POST', 'PUT', 'PATCH', 'DELETE'])
    assert.equal(
      requestPolicy(base + '/api/feedback', verb, base),
      'block-write',
    );
});
await test('HTTP link reader rejects external targets before requesting', async () => {
  await assert.rejects(readLocal(base, 'https://gemnao.pages.dev/en'));
});

await test('allow bounded local redirects but reject external redirects without following them', async () => {
  const server = createServer((req, res) => {
    if (req.url === '/local') {
      res.writeHead(302, { location: '/ok' });
      res.end();
    } else if (req.url === '/external') {
      res.writeHead(302, { location: 'https://gemnao.pages.dev/en' });
      res.end();
    } else {
      res.end('local fixture');
    }
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  try {
    const address = server.address();
    assert.ok(address && typeof address === 'object');
    const origin = `http://127.0.0.1:${address.port}`;
    assert.equal(await readLocal(origin, '/local'), 'local fixture');
    await assert.rejects(readLocal(origin, '/external'), /external target/);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
