// Run built Pages locally with no D1/credentials. No remote intake is contacted.
import assert from 'node:assert/strict';
import { cp, mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
const root = process.cwd(),
  dir = await mkdtemp(path.join(tmpdir(), 'gemnao-private-http-'));
await cp(path.join(root, 'dist/client'), path.join(dir, 'assets'), {
  recursive: true,
});
await writeFile(
  path.join(dir, 'wrangler.json'),
  JSON.stringify({
    name: 'gemnao-private-local-test',
    pages_build_output_dir: './assets',
    compatibility_date: '2026-05-22',
    compatibility_flags: ['nodejs_compat'],
  }),
);
const env = {
  ...process.env,
  WRANGLER_SEND_METRICS: 'false',
  WRANGLER_LOG_PATH: path.join(dir, 'logs'),
  XDG_CONFIG_HOME: path.join(dir, 'config'),
  MINIFLARE_REGISTRY_PATH: path.join(dir, 'registry'),
};
for (const key of Object.keys(env))
  if (
    /^(CLOUDFLARE_|CF_API_|CF_ACCOUNT_|CF_ZONE_|DISCORD_ADMIN_|PRIVATE_DIAGNOSTIC_)/.test(
      key,
    )
  )
    delete env[key];
const server = spawn(
  path.join(root, 'node_modules/.bin/wrangler'),
  [
    'pages',
    'dev',
    './assets',
    '--ip',
    '127.0.0.1',
    '--port',
    '8796',
    '--persist-to',
    path.join(dir, 'state'),
  ],
  { cwd: dir, env, stdio: ['ignore', 'pipe', 'pipe'] },
);
let output = '';
server.stdout.on('data', (b) => (output += b));
server.stderr.on('data', (b) => (output += b));
const base = 'http://127.0.0.1:8796',
  request = (p, options = {}) =>
    fetch(base + p, { ...options, signal: AbortSignal.timeout(10000) });
try {
  let ready = false;
  for (let i = 0; i < 40; i++) {
    if (server.exitCode !== null) throw Error('local Pages exited');
    try {
      if ((await request('/ads.txt')).status === 200) {
        ready = true;
        break;
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  assert(ready);
  assert(!/D1 Database|env\.DB/.test(output));
  for (const route of ['/private-diagnostic', '/admin/private-diagnostic']) {
    const r = await request(route),
      html = await r.text();
    assert.equal(r.status, 200);
    assert.match(r.headers.get('cache-control'), /private, no-store/);
    assert.match(r.headers.get('x-robots-tag'), /noindex/);
    assert.match(
      r.headers.get('content-security-policy'),
      /connect-src 'self'/,
    );
    assert(html.includes('<h1'));
    assert(!html.includes('SYNTHETIC_PRIVATE'));
    for (const match of html.matchAll(
      /(?:src|href)="([^"?#]+\.(?:js|css))(?:\?[^" ]*)?"/g,
    )) {
      if (match[1].startsWith('/'))
        assert.equal((await request(match[1])).status, 200);
    }
  }
  const status = await request('/api/private-diagnostic');
  assert.deepEqual(await status.json(), { enabled: false, canDelete: false });
  assert.match(status.headers.get('cache-control'), /no-store/);
  assert.equal(
    (
      await request('/api/private-diagnostic', {
        method: 'POST',
        headers: { origin: base, 'Content-Type': 'application/json' },
        body: '{}',
      })
    ).status,
    503,
  );
  const admin = await request('/api/admin/private-diagnostic');
  assert.equal(admin.status, 401);
  assert.match(admin.headers.get('cache-control'), /no-store/);
  console.log(
    'PASS built local Pages private screens, CSS/JS 200, noindex/no-store/CSP, intake disabled and owner API 401; no DB bound',
  );
} finally {
  server.kill('SIGTERM');
}
