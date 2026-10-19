import assert from 'node:assert/strict';
export function localOrigin(value) {
  const url = new URL(value);
  assert.ok(
    url.protocol === 'http:' &&
      ['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname),
    'QA requires an HTTP loopback origin',
  );
  assert.ok(
    !url.username &&
      !url.password &&
      url.pathname === '/' &&
      !url.search &&
      !url.hash,
    'QA base must be an origin without credentials, path or query',
  );
  return url.origin;
}
export function requestPolicy(url, method, base) {
  if (!['GET', 'HEAD'].includes(method)) return 'block-write';
  const target = new URL(url);
  if (target.origin !== localOrigin(base)) return 'block-external';
  if (target.pathname.startsWith('/api/')) return 'mock-api';
  return 'allow-read';
}
export async function readLocal(base, path) {
  const origin = localOrigin(base);
  let target = new URL(path, origin);
  const signal = AbortSignal.timeout(20000);
  for (let hop = 0; hop < 6; hop++) {
    assert.equal(
      target.origin,
      origin,
      `QA cannot follow an external target: ${path}`,
    );
    assert.ok(
      !target.username && !target.password,
      'QA URL cannot contain credentials',
    );
    const response = await fetch(target, { redirect: 'manual', signal });
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get('location');
      assert.ok(location, `Missing redirect destination: ${path}`);
      target = new URL(location, target);
      await response.body?.cancel();
      continue;
    }
    assert.equal(response.status, 200, path);
    return response.text();
  }
  throw new Error(`Too many local redirects: ${path}`);
}
