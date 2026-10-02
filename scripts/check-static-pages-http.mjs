import assert from 'node:assert/strict';
import { cp, mkdir, mkdtemp, readFile, readdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { createWriteStream } from 'node:fs';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { once } from 'node:events';

const root = process.cwd();
const resultDir = path.join(root, '.wrangler/static-delivery-test');
await mkdir(resultDir, { recursive: true });
// Keep config AND copied assets outside the repository. Otherwise the inner
// Pages runtime rediscovers the repository config and inherits its local D1.
const dir = await mkdtemp(path.join(tmpdir(), 'gemnao-static-local-test-'));
await writeFile(path.join(resultDir, 'runtime-directory.txt'), dir);
await cp(path.join(root, 'dist/client'), path.join(dir, 'assets'), { recursive: true });
// Local-only Pages runtime; no D1 binding or account in this configuration.
await writeFile(path.join(dir, 'wrangler.json'), JSON.stringify({ name: 'gemnao-static-local-test', pages_build_output_dir: './assets', compatibility_date: '2026-05-22', compatibility_flags: ['nodejs_compat'] }));
await writeFile(path.join(dir, 'bootstrap.mjs'), `import os from 'node:os'; const original=os.networkInterfaces; os.networkInterfaces=()=>{try{return original()}catch{return {lo:[{address:'127.0.0.1',netmask:'255.0.0.0',family:'IPv4',mac:'00:00:00:00:00:00',internal:true,cidr:'127.0.0.1/8'}]}}};`);
const localEnv = { ...process.env };
for (const name of Object.keys(localEnv)) {
  if (/^(CLOUDFLARE_|CF_API_|CF_ACCOUNT_|CF_ZONE_)/.test(name)) delete localEnv[name];
}
const server = spawn(path.join(root, 'node_modules/.bin/wrangler'), ['pages', 'dev', './assets', '--ip', '127.0.0.1', '--port', '8795', '--persist-to', path.join(dir, 'state')], {
  cwd: dir,
  env: { ...localEnv, WRANGLER_SEND_METRICS: 'false', WRANGLER_LOG_PATH: path.join(dir, 'logs'), MINIFLARE_REGISTRY_PATH: path.join(dir, 'registry'), XDG_CONFIG_HOME: path.join(dir, 'config'), NODE_OPTIONS: `${process.env.NODE_OPTIONS || ''} --import=${path.join(dir, 'bootstrap.mjs')}` },
  stdio: ['ignore', 'pipe', 'pipe'],
});
const log = createWriteStream(path.join(resultDir, 'server.log'));
server.stdout.pipe(log);
server.stderr.pipe(log);
const base = 'http://127.0.0.1:8795';
let serverOutput = '';
server.stdout.on('data', chunk => { serverOutput += chunk; });
server.stderr.on('data', chunk => { serverOutput += chunk; });
const request = (pathname, init) => fetch(`${base}${pathname}`, { ...init, signal: AbortSignal.timeout(15000) });
try {
  let ready = false;
  for (let i = 0; i < 60; i++) {
    if (server.exitCode !== null) throw Error('Local server exited; see .wrangler/static-delivery-test/server.log');
    try { if ((await request('/ads.txt')).status === 200) { ready = true; break; } } catch { /* Wait for local startup only. */ }
    await new Promise((r) => setTimeout(r, 1000));
  }
  assert.ok(ready, 'Local Pages server started');
  assert.ok(!/D1 Database|env\.DB/.test(serverOutput), 'QA worker must not inherit a D1 binding');
  const manifest = JSON.parse(await readFile('dist/editorial-snapshots.json', 'utf8'));
  const result = [];
  for (const pathname of Object.keys(manifest)) {
    const response = await request(pathname);
    const html = await response.text();
    assert.equal(response.status, 200, pathname);
    assert.equal(response.headers.get('x-gemnao-cache'), 'STATIC', pathname);
    assert.match(response.headers.get('content-type'), /text\/html/);
    assert.ok(html.includes('<h1') && html.includes('</html>'), pathname);
    result.push({ pathname, status: response.status, delivery: 'STATIC', bytes: Buffer.byteLength(html) });
  }
  const target = '/pc/disk-usage-100';
  const head = await request(target, { method: 'HEAD' });
  assert.equal(head.status, 200);
  assert.equal(head.headers.get('x-gemnao-cache'), 'STATIC');
  assert.equal(await head.text(), '');
  for (const { pathname, options } of [
    { pathname: target + '?check=1', options: {} },
    { pathname: target, options: { headers: { rsc: '1' } } },
    { pathname: target, options: { method: 'POST' } },
    { pathname: '/contact?category=business', options: {} },
    { pathname: '/my', options: {} },
  ]) {
    const response = await request(pathname, options);
    assert.notEqual(response.headers.get('x-gemnao-cache'), 'STATIC', `${pathname} bypass`);
    const body = await response.text();
    if (pathname.startsWith('/contact')) {
      assert.equal(response.status, 200);
      assert.match(body, /value="business" selected/);
    }
  }
  assert.equal((await request('/pc/not-a-real-article')).status, 404);
  assert.equal((await request(Object.values(manifest)[0])).status, 404);
  const invalidContact = await request('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ category: 1 }) });
  assert.equal(invalidContact.status, 400);
  const downloads = (await readdir('dist/client/downloads')).filter(name => name.endsWith('.zip')).map(name => `/downloads/${name}`);
  for (const asset of ['/ads.txt', '/robots.txt', '/sitemap.xml', ...downloads]) {
    const response = await request(asset);
    assert.equal(response.status, 200, asset);
    const bytes = Buffer.from(await response.arrayBuffer());
    if (asset.startsWith('/downloads/')) assert.deepEqual(bytes, await readFile(`dist/client${asset}`), `Download bytes: ${asset}`);
  }
  await writeFile(path.join(resultDir, 'results.json'), JSON.stringify(result, null, 2));
  console.log(`PASS: ${result.length} real local Pages HTML routes; HEAD/query/RSC/non-GET/privacy separation; missing route/internal asset 404; invalid contact 400; robots/ads/sitemap and ${downloads.length} byte-identical native ZIPs retained; no D1 bound`);
} finally {
  server.kill('SIGTERM');
  await Promise.race([once(server, 'exit'), new Promise((r) => setTimeout(r, 3000))]);
  log.end();
}
