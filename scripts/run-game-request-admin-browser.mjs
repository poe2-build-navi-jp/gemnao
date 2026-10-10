// Runs only a local synthetic fixture. This is not an application/API server.
import { build } from 'esbuild';
import { createServer } from 'node:http';

const result = await build({
  entryPoints: ['scripts/check-game-request-admin-browser.tsx'],
  platform: 'browser',
  format: 'esm',
  target: 'es2022',
  bundle: true,
  write: false,
  logLevel: 'warning',
  define: { 'process.env.NODE_ENV': '"development"' },
});
const html = `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Local manual review fixture</title><style>
*{box-sizing:border-box}body{margin:0;background:#f6f8fb;color:#18263d;font:16px/1.7 system-ui,sans-serif}main{max-width:960px;margin:24px auto;padding:0 20px}article{background:white;border:1px solid #d7dfeb;border-radius:12px;padding:24px}h1{font-size:26px}h2{font-size:20px;overflow-wrap:anywhere}button,select{font:inherit;padding:8px 14px;border:1px solid #abb9cf;border-radius:6px;background:#fff;color:#183d76;cursor:pointer}button:disabled{color:#687385;background:#e8edf4;cursor:not-allowed}button+button{margin-left:10px}button:focus-visible,a:focus-visible,select:focus-visible{outline:3px solid #2665e0;outline-offset:3px}a{color:#1248a7}fieldset{border:1px solid #d7dfeb;border-radius:8px;padding:10px 14px}legend{font-size:14px}ul{padding:0;list-style:none}li{padding:18px 0;border-top:1px solid #d7dfeb;overflow-wrap:anywhere}output{display:block;margin:16px 0;color:#194479}.fixture-banner{padding:12px 18px;background:#fff8da;border:1px solid #e7c965;border-radius:8px;margin-bottom:18px}.fixture-banner p{margin:4px 0}pre{white-space:pre-wrap;overflow-wrap:anywhere}@media(max-width:500px){main{padding:0 12px}article{padding:16px}h1{font-size:22px}}
</style></head><body><div id="root"></div><script type="module" src="/fixture.js"></script></body></html>`;
const port = Number(process.env.GAME_REQUEST_ADMIN_FIXTURE_PORT ?? 4375);
const server = createServer((request, response) => {
  response.setHeader('Cache-Control', 'no-store');
  if (request.url === '/fixture.js') {
    response.setHeader('Content-Type', 'text/javascript; charset=utf-8');
    response.end(result.outputFiles[0].contents);
  } else if (request.url?.startsWith('/api/')) {
    response.writeHead(404);
    response.end('No real APIs are available in this fixture.');
  } else {
    response.setHeader('Content-Type', 'text/html; charset=utf-8');
    response.end(html);
  }
});
server.listen(port, '127.0.0.1', () => {
  console.log(`Synthetic admin fixture: http://127.0.0.1:${port}/`);
  console.log(
    'Scenarios: ?scenario=manual|empty|unavailable|automatic|login|conflict|rate-limit|unavailable-on-save|network-error|login-expired',
  );
  console.log(
    'Stop with Ctrl+C. Login links simulate a login; no credentials or production actions.',
  );
});
