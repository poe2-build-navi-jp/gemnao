import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';

// These public files need no application code, D1, cookies, or authentication.
// Keep every other path on the existing Worker, including internal snapshots.
const paths = ['/sitemap.xml', '/image-sitemap.xml', '/robots.txt'];
const expectedRoutes = { version: 1, include: ['/*'], exclude: paths };
const expectedRedirects = paths.map((path) => `${path}/ ${path} 308`);

for (const directory of ['public', 'dist/client']) {
  const routes = JSON.parse(
    await readFile(`${directory}/_routes.json`, 'utf8'),
  );
  assert.deepEqual(
    routes,
    expectedRoutes,
    `${directory}: unexpected route scope`,
  );
  const redirects = (await readFile(`${directory}/_redirects`, 'utf8'))
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'));
  assert.deepEqual(
    redirects,
    expectedRedirects,
    `${directory}: preserve the three canonical trailing-slash redirects`,
  );
}

for (const path of paths) {
  const asset = await stat(`dist/client${path}`);
  assert.ok(
    asset.isFile() && asset.size > 0,
    `Missing static search asset: ${path}`,
  );
}

console.log(
  'Static search assets: routes, redirects, and three output files verified',
);
