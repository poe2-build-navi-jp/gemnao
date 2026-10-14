// The real route, origin check, hash validator and cookie implementation.
// No credentials, Cloudflare bindings, D1 or external requests are used.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir } from 'node:fs/promises';
import { build } from 'esbuild';
import { NextRequest } from 'vinext/shims/server';
const fixtureToken = 'dummy-local-valid';
const fixtureHash = createHash('sha256')
  .update('gemnao-discord-admin:' + fixtureToken)
  .digest('hex');
await mkdir('.wrangler/site-audit', { recursive: true });
await build({
  stdin: {
    contents: `export {POST} from './app/api/admin/discord-servers/login/route';`,
    resolveDir: process.cwd(),
    loader: 'ts',
  },
  bundle: true,
  platform: 'node',
  format: 'esm',
  packages: 'external',
  alias: { 'next/server': 'vinext/shims/server' },
  outfile: '.wrangler/site-audit/login-input-fixture.mjs',
  plugins: [
    {
      name: 'synthetic-worker-environment',
      setup(b) {
        b.onResolve({ filter: /^cloudflare:workers$/ }, () => ({
          path: 'workers',
          namespace: 'local-test',
        }));
        b.onLoad({ filter: /.*/, namespace: 'local-test' }, () => ({
          contents: `export const env=${JSON.stringify({ DISCORD_ADMIN_TOKEN: fixtureToken, DISCORD_ADMIN_TOKEN_HASH: fixtureHash })};`,
        }));
      },
    },
  ],
});
const { POST } =
  await import('../.wrangler/site-audit/login-input-fixture.mjs');
const origin = 'https://local-test.invalid';
const request = (body, from = origin) =>
  new NextRequest(origin + '/api/admin/discord-servers/login', {
    method: 'POST',
    headers: { Origin: from, 'Content-Type': 'application/json' },
    body,
  });
let cases = 0;
for (const body of [
  null,
  {},
  [],
  123,
  true,
  { token: 123 },
  { token: {} },
  { token: [] },
  { token: null },
  { token: false },
  { token: 'wrong' },
  { token: '   ' },
]) {
  const response = await POST(request(JSON.stringify(body)));
  assert.equal(response.status, 401);
  assert.equal(response.headers.has('Set-Cookie'), false);
  cases++;
}
assert.equal((await POST(request('{broken'))).status, 401);
cases++;
assert.equal(
  (
    await POST(
      request('{"token":"dummy-local-valid"}', 'https://cross-origin.invalid'),
    )
  ).status,
  403,
);
cases++;
for (const token of [fixtureToken, '  ' + fixtureToken + '  ']) {
  const valid = await POST(request(JSON.stringify({ token })));
  assert.equal(valid.status, 200);
  assert.deepEqual(await valid.json(), { ok: true });
  const cookie = valid.headers.get('Set-Cookie');
  for (const pattern of [
    /gemnao_discord_admin=dummy-local-valid/,
    /HttpOnly/i,
    /SameSite=Strict/i,
    /Secure/i,
    /Max-Age=28800/i,
    /Path=\//,
  ])
    assert.match(cookie, pattern);
  cases++;
}
console.log(
  `PASS: ${cases} real-route/hash-validator input/cookie cases; malformed types deny without exceptions, plain/trimmed tokens and existing cookie attributes preserved. Synthetic worker environment only.`,
);
