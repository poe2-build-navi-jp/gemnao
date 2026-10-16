// Read-only release checks: GET health/editorial/UI/assets only. No status/list
// API, cookies, authentication, submissions, owner keys, cleanup or mutations.
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const PUBLIC = 'https://gemnao.pages.dev';
const stages = ['backend-closed', 'ready-closed', 'ui-closed', 'open'];
const fields = [
  'schemaVersion',
  'ok',
  'intakeEnabled',
  'publicEnabled',
  'checkedAt',
  'observedAt',
  'validUntil',
  'cleanupAt',
  'reason',
];
const closedReasons = [
  'not-configured',
  'monitor-unverified',
  'usage-unavailable',
  'usage-stale',
  'usage-limit',
  'cleanup-unavailable',
  'storage-unavailable',
  'intake-disabled',
];
class CheckFailure extends Error {}
const requireValue = (ok, code) => {
  if (!ok) throw new CheckFailure(code);
};
const iso = (value) =>
  typeof value === 'string' &&
  Number.isFinite(Date.parse(value)) &&
  new Date(Date.parse(value)).toISOString() === value;
function originValue(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new CheckFailure('FIXED_ORIGIN_REQUIRED');
  }
  requireValue(
    !url.username &&
      !url.password &&
      !url.search &&
      !url.hash &&
      url.pathname === '/' &&
      (url.origin === PUBLIC ||
        (url.protocol === 'http:' &&
          ['127.0.0.1', 'localhost'].includes(url.hostname) &&
          Number(url.port) >= 1 &&
          Number(url.port) <= 65535)),
    'FIXED_ORIGIN_REQUIRED',
  );
  return url.origin;
}
async function textBody(response, maximum) {
  requireValue(response.body, 'EMPTY_BODY');
  const reader = response.body.getReader();
  const parts = [];
  let size = 0;
  for (;;) {
    const part = await reader.read();
    if (part.done) break;
    size += part.value.byteLength;
    if (size > maximum) {
      await reader.cancel();
      throw new CheckFailure('RESPONSE_TOO_LARGE');
    }
    parts.push(part.value);
  }
  const bytes = new Uint8Array(size);
  let at = 0;
  for (const part of parts) {
    bytes.set(part, at);
    at += part.length;
  }
  return new TextDecoder('utf8', { fatal: true }).decode(bytes);
}
const attrs = (tag) =>
  Object.fromEntries(
    [...tag.matchAll(/([a-zA-Z:-]+)\s*=\s*["']([^"']*)["']/g)].map((match) => [
      match[1].toLowerCase(),
      match[2].replaceAll('&amp;', '&'),
    ]),
  );
export async function checkPublication({
  origin = PUBLIC,
  stage,
  fetcher = fetch,
  now,
}) {
  const base = originValue(origin);
  requireValue(stages.includes(stage), 'FIXED_STAGE_REQUIRED');
  const requests = [],
    assets = new Set();
  async function get(path) {
    const url = new URL(path, base);
    requireValue(
      url.origin === base &&
        !url.username &&
        !url.password &&
        !url.search &&
        !url.hash,
      'SAME_ORIGIN_GET_REQUIRED',
    );
    let response;
    try {
      response = await fetcher(url.href, {
        method: 'GET',
        redirect: 'error',
        credentials: 'omit',
        cache: 'no-store',
        signal: AbortSignal.timeout(10000),
        headers: { Accept: 'text/html,application/json,text/plain;q=0.9' },
      });
    } catch {
      throw new CheckFailure('HTTP_UNAVAILABLE');
    }
    requests.push({ path: url.pathname, status: response.status });
    return response;
  }
  async function page(path, expected, editorial = false, privatePage = false) {
    const response = await get(path);
    requireValue(response.status === expected, 'PAGE_STATUS');
    const text = await textBody(response, 2_000_000);
    if (privatePage) {
      requireValue(
        /no-store/i.test(response.headers.get('cache-control') || ''),
        'PRIVATE_PAGE_CACHE',
      );
      requireValue(
        /noindex/i.test(response.headers.get('x-robots-tag') || ''),
        'PRIVATE_PAGE_INDEX',
      );
      const policy = response.headers.get('content-security-policy') || '';
      requireValue(
        policy.includes("connect-src 'self'") &&
          policy.includes("frame-ancestors 'none'"),
        'PRIVATE_PAGE_CSP',
      );
    }
    if (editorial) {
      const head = text.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] || '';
      const canonical = [...head.matchAll(/<link\b[^>]*>/gi)]
        .map((match) => attrs(match[0]))
        .find((link) => link.rel === 'canonical')?.href;
      let canonicalUrl = null;
      try {
        canonicalUrl = new URL(canonical).href;
      } catch {
        /* Invalid or relative canonical stays invalid. */
      }
      requireValue(
        canonicalUrl === new URL(path, PUBLIC).href &&
          /<title>[^<]+<\/title>/i.test(head),
        'EDITORIAL_HEAD',
      );
      requireValue(
        [...head.matchAll(/<meta\b[^>]*>/gi)].some(
          (match) => attrs(match[0]).property === 'og:image',
        ),
        'EDITORIAL_OG',
      );
    }
    for (const match of text.matchAll(/<(?:link|script)\b[^>]*>/gi)) {
      const tag = attrs(match[0]),
        raw = tag.src || tag.href;
      if (!raw) continue;
      let url;
      try {
        url = new URL(raw, base);
      } catch {
        continue;
      }
      if (url.origin !== base || !/\.(?:css|js)$/.test(url.pathname)) continue;
      requireValue(
        !url.search &&
          !url.hash &&
          /^\/_next\/static\/[A-Za-z0-9_./-]+\.(css|js)$/.test(url.pathname) &&
          !url.pathname.split('/').includes('..'),
        'STATIC_ASSET_PATH',
      );
      assets.add(url.pathname);
      requireValue(assets.size <= 80, 'ASSET_REQUEST_BUDGET');
    }
    return text;
  }
  for (const path of [
    '/',
    '/games/apex-legends/javelin-launch-error',
    '/games/valorant/van-restriction-5',
    '/games/valorant/van9005',
    '/en/examples/wilds-steam-added-dll',
    '/zh/examples/wilds-steam-added-dll',
    '/es/examples/wilds-steam-added-dll',
  ])
    await page(path, 200, true);
  await page('/my', 200);
  const sitemap = await page('/sitemap.xml', 200);
  requireValue(!sitemap.includes('/reports'), 'REPORTS_IN_SITEMAP');
  for (const path of ['/robots.txt', '/ads.txt']) await page(path, 200);
  for (const path of [
    '/reports',
    '/en/reports',
    '/zh/reports',
    '/es/reports',
    '/admin/reports',
  ])
    await page(
      path,
      ['backend-closed', 'ready-closed'].includes(stage) ? 404 : 200,
      false,
      !['backend-closed', 'ready-closed'].includes(stage),
    );
  const response = await get('/api/reports/health');
  requireValue(
    response.status === (stage === 'open' ? 200 : 503),
    'HEALTH_HTTP_STATUS',
  );
  requireValue(
    /no-store/i.test(response.headers.get('cache-control') || '') &&
      /noindex/i.test(response.headers.get('x-robots-tag') || ''),
    'HEALTH_HEADERS',
  );
  let health;
  try {
    health = JSON.parse(await textBody(response, 16384));
  } catch {
    throw new CheckFailure('HEALTH_JSON');
  }
  const healthNow = now ?? Date.now();
  requireValue(
    health &&
      typeof health === 'object' &&
      !Array.isArray(health) &&
      Object.keys(health).length === fields.length &&
      fields.every((field) => Object.hasOwn(health, field)) &&
      health.schemaVersion === 1 &&
      iso(health.checkedAt) &&
      Date.parse(health.checkedAt) >= healthNow - 120000 &&
      Date.parse(health.checkedAt) <= healthNow + 30000 &&
      ['observedAt', 'validUntil', 'cleanupAt'].every(
        (field) => health[field] === null || iso(health[field]),
      ),
    'HEALTH_SCHEMA',
  );
  const freshOperations =
    iso(health.observedAt) &&
    iso(health.validUntil) &&
    iso(health.cleanupAt) &&
    Date.parse(health.observedAt) <= healthNow + 30000 &&
    Date.parse(health.validUntil) > healthNow &&
    Date.parse(health.validUntil) - Date.parse(health.observedAt) === 1800000 &&
    Date.parse(health.cleanupAt) >= healthNow - 7200000 &&
    Date.parse(health.cleanupAt) <= healthNow + 30000;
  if (stage === 'open') {
    requireValue(
      health.ok === true &&
        health.intakeEnabled === true &&
        health.publicEnabled === true &&
        health.reason === null &&
        freshOperations,
      'OPERATIONAL_HEALTH_NOT_PROVEN',
    );
  } else {
    requireValue(
      health.ok === false &&
        health.intakeEnabled === false &&
        health.publicEnabled === false &&
        closedReasons.includes(health.reason),
      'CLOSED_FLAGS_NOT_PROVEN',
    );
    if (stage === 'ready-closed')
      requireValue(
        health.reason === 'intake-disabled' && freshOperations,
        'CLOSED_OPERATIONAL_READINESS_NOT_PROVEN',
      );
  }
  for (const path of assets) {
    const asset = await get(path);
    requireValue(asset.status === 200, 'ASSET_HTTP_STATUS');
    requireValue(
      !/text\/html/i.test(asset.headers.get('content-type') || ''),
      'ASSET_HTML_RESPONSE',
    );
    await asset.body?.cancel();
  }
  return {
    stage,
    origin: base === PUBLIC ? 'production' : 'loopback',
    urlsChecked: requests.length - assets.size,
    assetsChecked: assets.size,
    health,
    requestMethods: ['GET'],
    credentialsSent: false,
    reportBodiesFetched: false,
    acceptanceWrites: 0,
  };
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  const [stage, origin] = process.argv.slice(2);
  checkPublication({ stage, origin })
    .then((result) => console.log(JSON.stringify(result, null, 2)))
    .catch((error) => {
      console.error(
        JSON.stringify({
          ok: false,
          error: error instanceof CheckFailure ? error.message : 'CHECK_FAILED',
        }),
      );
      process.exitCode = 1;
    });
}
