// Synthetic credentials and mocked fetch only. No Cloudflare network or DB writes.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  Blocked,
  cloudflareClient,
  execute,
  target,
} from '../ops/d1/control.mjs';
const token = 'SYNTHETIC_PRIVATE_SENTINEL';
const base = `/accounts/${target.account}`;
const paths = [
  [`${base}/pages/projects/${target.project}`, 'pagesproject'],
  [`${base}/d1/database/${target.database}`, 'd1identity'],
  [`${base}/d1/database/${target.database}/query`, 'd1schema'],
  [
    `${base}/d1/database/${target.database}/time_travel/bookmark`,
    'restorebookmark',
  ],
];
const env = {
  GITHUB_ACTIONS: 'true',
  GITHUB_REPOSITORY: target.repository,
  GITHUB_REF: `refs/heads/${target.branch}`,
  GITHUB_EVENT_NAME: 'workflow_dispatch',
  D1_PROTECTED_ENVIRONMENT: target.environment,
  D1_OPERATION: 'preflight',
  CLOUDFLARE_API_TOKEN: token,
};
for (const [value, code] of [
  ['', 'NOT_CONFIGURED'],
  [undefined, 'NOT_CONFIGURED'],
  [' ' + token, 'WHITESPACE'],
  [token + ' ', 'WHITESPACE'],
  [token + '\n', 'WHITESPACE'],
  [token + '\r\n', 'WHITESPACE'],
  [token + '\t', 'WHITESPACE'],
  [token + '\u00a0', 'WHITESPACE'],
  [token + '日', 'NON_ASCII'],
  [token + '\u200b', 'NON_ASCII'],
  [token + '\x00', 'INVALID_HEADER'],
  [token + '\x7f', 'INVALID_HEADER'],
]) {
  const expected = `CLOUDFLARE_CREDENTIAL_${code}`;
  let calls = 0;
  assert.throws(
    () =>
      cloudflareClient(value, async () => {
        calls++;
      }),
    { message: expected },
  );
  await assert.rejects(
    execute(
      { ...env, CLOUDFLARE_API_TOKEN: value },
      {
        verify: async () => {},
        api: async () => {
          calls++;
        },
      },
    ),
    { message: expected },
  );
  assert.equal(
    calls,
    0,
    'bad credentials must stop before requests, without trimming',
  );
}
/** @type {Array<[object | null, string]>} */
const cases = [
  [{ name: 'TimeoutError' }, 'TIMEOUT'],
  [{ name: 'AbortError' }, 'TIMEOUT'],
  [{ code: 'ETIMEDOUT' }, 'TIMEOUT'],
  [{ cause: { code: 'UND_ERR_CONNECT_TIMEOUT' } }, 'TIMEOUT'],
  [{ cause: { code: 'ENOTFOUND' } }, 'DNS'],
  [{ code: 'EAI_AGAIN' }, 'DNS'],
  [{ cause: { code: 'ECONNREFUSED' } }, 'CONNECT'],
  [{ cause: { errors: [{ code: 'ENETUNREACH' }] } }, 'CONNECT'],
  [{ cause: { code: 'CERT_HAS_EXPIRED' } }, 'TLS'],
  [{ code: 'ERR_TLS_CERT_ALTNAME_INVALID' }, 'TLS'],
  [{ code: 'ERR_INVALID_CHAR' }, 'INVALID_HEADER'],
  [{ cause: { code: 'ERR_HTTP_INVALID_HEADER_VALUE' } }, 'INVALID_HEADER'],
  [{ code: token, name: token }, 'OTHER'],
  [new TypeError(token), 'OTHER'],
  [null, 'OTHER'],
];
const cyclic = { code: token };
cyclic.cause = cyclic;
cases.push([cyclic, 'OTHER']);
for (const [path, stage] of paths) {
  for (const [fixture, category] of cases) {
    if (fixture) {
      fixture.message = token;
      fixture.stack = token;
    }
    const client = cloudflareClient(token, async () => {
      throw fixture;
    });
    await assert.rejects(client(path), (error) => {
      assert.ok(error instanceof Blocked);
      assert.equal(error.code, `CLOUDFLARE_REQUEST_${category}`);
      assert.equal(error.stage, stage);
      assert.equal(error.cause, undefined);
      assert.ok(!JSON.stringify(error).includes(token));
      assert.ok(!error.stack.includes(token));
      return true;
    });
  }
  for (const status of [401, 403, 429, 500]) {
    await assert.rejects(
      cloudflareClient(
        token,
        async () => new Response(token, { status }),
      )(path),
      { code: `CLOUDFLARE_HTTP_${status}`, stage },
    );
  }
  await assert.rejects(
    cloudflareClient(token, async () => new Response(token))(path),
    { code: 'CLOUDFLARE_RESPONSE_INVALID', stage },
  );
  await assert.rejects(
    cloudflareClient(token, async () =>
      Response.json({ success: false, errors: [{ message: token }] }),
    )(path),
    { code: 'CLOUDFLARE_OPERATION_FAILED', stage },
  );
  assert.deepEqual(
    await cloudflareClient(token, async (url, options) => {
      assert.equal(url, `https://api.cloudflare.com/client/v4${path}`);
      assert.equal(options.headers.Authorization, `Bearer ${token}`);
      assert.equal(options.redirect, 'error');
      return Response.json({ success: true, result: { safe: true } });
    })(path),
    { safe: true },
  );
}
let calls = 0;
await assert.rejects(
  cloudflareClient(token, async () => {
    calls++;
  })(`${base}/unknown`),
  { code: 'UNEXPECTED_API_TARGET' },
);
assert.equal(calls, 0);
// Exercise the real CLI logging boundary. Child env is explicitly synthetic;
// never pass through Cloudflare, GitHub or other real credentials.
const preload = `globalThis.fetch = async () => { const error = new TypeError('${token}'); error.cause = { code: 'ENOTFOUND', message: '${token}', stack: '${token}' }; throw error; };`;
const child = spawnSync(
  process.execPath,
  [
    '--import',
    `data:text/javascript,${encodeURIComponent(preload)}`,
    'ops/d1/control.mjs',
  ],
  { encoding: 'utf8', env, timeout: 10000 },
);
assert.equal(child.status, 1);
assert.equal(child.stdout, '');
assert.deepEqual(JSON.parse(child.stderr), {
  status: 'blocked',
  stage: 'pagesproject',
  code: 'CLOUDFLARE_REQUEST_DNS',
});
assert.ok(!child.stderr.includes(token));
console.log(
  'PASS: credential rejection before network; fixed request stages and error categories; HTTP status preservation; mocked success; CLI secret/error sanitization. No real credentials or network.',
);
