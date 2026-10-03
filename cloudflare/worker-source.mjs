import application from '../dist/server/index.js';
import editorialSnapshots from '../dist/editorial-snapshots.json';
import { snapshotAssetFor } from './prerender-policy.mjs';

const staticFiles = new Set([
  '/ads.txt',
  // Versioned, audited native distributable. Keep routing explicit.
  '/downloads/gemnao-wilds-diagnosis-0.4.0-windows-x64.zip',
  '/downloads/gemnao-game-diagnosis-0.5.0-windows-x64.zip',
  '/downloads/gemnao-game-diagnosis-0.6.0-windows-x64.zip',
  '/favicon.svg',
  '/gemnao-logo.png',
  '/robots.txt',
  '/sitemap.xml',
  '/image-sitemap.xml',
  // IndexNow key (scripts/ping-index.mjs)
  '/8a431ad6b1d387ce80049b38cc6a027a.txt',
]);

// Replaced at build time (scripts/prepare-pages.mjs). Cache keys include it
// so a new deployment never serves HTML that points at old CSS/JS files.
const buildId = typeof __BUILD_ID__ === 'string' ? __BUILD_ID__ : 'dev';
const edgeCacheSeconds = 3600;

// Pages rendered only from the article registries. `/discord-servers`,
// `/contact`, `/admin` and `/api` read D1 or the request and are excluded.
const cacheablePath = (pathname) =>
  pathname === '/' ||
  /^\/(?:games|guide|trouble|discord|new-releases|weekly|pc|status|tools|my)(?:\/|$)/.test(
    pathname,
  ) ||
  /^\/(?:en|zh|es)(?:\/|$)/.test(pathname) ||
  ['/about', '/privacy', '/terms'].includes(pathname);

function edgeCacheKey(request) {
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.search || !cacheablePath(url.pathname))
    return null;
  // Client-side navigation requests share the URL but return RSC payloads.
  for (const header of [
    'rsc',
    'next-router-state-tree',
    'next-router-prefetch',
  ])
    if (request.headers.has(header)) return null;
  url.searchParams.set('__build', buildId);
  return new Request(url.toString(), { method: 'GET' });
}

async function render(request, env, context, pathname) {
  const response = await application.fetch(request, env, context);
  const locale = pathname.match(/^\/(en|zh|es)(?:\/|$)/)?.[1];
  if (locale && response.headers.get('content-type')?.includes('text/html')) {
    return new HTMLRewriter()
      .on('html', {
        element(element) {
          element.setAttribute('lang', locale === 'zh' ? 'zh-Hans' : locale);
        },
      })
      .transform(response);
  }
  return response;
}

const worker = {
  async fetch(request, env, context) {
    const { pathname } = new URL(request.url);

    // Internal asset URLs are not alternate public article URLs.
    if (pathname.startsWith('/_gemnao-snapshots/')) {
      return new Response('Not found', {
        status: 404,
        headers: { 'X-Robots-Tag': 'noindex' },
      });
    }

    const snapshot = snapshotAssetFor(request, editorialSnapshots);
    if (snapshot) {
      const assetUrl = new URL(snapshot, request.url);
      const asset = await env.ASSETS.fetch(
        new Request(assetUrl, {
          method: request.method,
          headers: request.headers,
        }),
      );
      if (asset.status === 200 || asset.status === 304) {
        const response = new Response(asset.body, asset);
        response.headers.set('Content-Type', 'text/html; charset=utf-8');
        response.headers.set(
          'Cache-Control',
          'public, max-age=0, must-revalidate',
        );
        response.headers.set('X-Gemnao-Cache', 'STATIC');
        return response;
      }
      // A missing deployment asset must not expose an internal path or make
      // articles unavailable; the existing renderer remains the fallback.
    }

    if (
      pathname.startsWith('/_next/static/') ||
      pathname.startsWith('/images/') ||
      staticFiles.has(pathname)
    ) {
      return env.ASSETS.fetch(request);
    }

    const cacheKey =
      typeof caches === 'undefined' ? null : edgeCacheKey(request);
    if (!cacheKey) return render(request, env, context, pathname);

    try {
      const cached = await caches.default.match(cacheKey);
      if (cached) {
        const hit = new Response(cached.body, cached);
        hit.headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
        hit.headers.set('X-Gemnao-Cache', 'HIT');
        return hit;
      }
    } catch {
      // Cache problems must never break the page; fall through to render.
    }

    const response = await render(request, env, context, pathname);
    if (
      response.status !== 200 ||
      response.headers.has('set-cookie') ||
      !response.headers.get('content-type')?.includes('text/html')
    )
      return response;

    const [forClient, forCache] = response.body
      ? response.body.tee()
      : [null, null];
    const stored = new Response(forCache, response);
    stored.headers.set('Cache-Control', `public, s-maxage=${edgeCacheSeconds}`);
    stored.headers.delete('vary');
    context.waitUntil(caches.default.put(cacheKey, stored).catch(() => {}));

    const fresh = new Response(forClient, response);
    // Browsers revalidate so readers see a new deployment immediately.
    fresh.headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
    fresh.headers.set('X-Gemnao-Cache', 'MISS');
    return fresh;
  },
};

export default worker;
