import application from '../dist/server/index.js';

const staticFiles = new Set([
  '/ads.txt',
  '/favicon.svg',
  '/gemnao-logo.png',
  '/robots.txt',
  '/sitemap.xml',
  '/image-sitemap.xml',
]);

// Replaced at build time (scripts/prepare-pages.mjs). Cache keys include it
// so a new deployment never serves HTML that points at old CSS/JS files.
const buildId = typeof __BUILD_ID__ === 'string' ? __BUILD_ID__ : 'dev';
const edgeCacheSeconds = 3600;

// Pages rendered only from the article registries. `/discord-servers`,
// `/contact`, `/admin` and `/api` read D1 or the request and are excluded.
const cacheablePath = (pathname) =>
  pathname === '/' ||
  /^\/(?:games|guide|trouble|discord)(?:\/|$)/.test(pathname) ||
  /^\/(?:en|zh|es)(?:\/|$)/.test(pathname) ||
  ['/about', '/privacy', '/terms'].includes(pathname);

function edgeCacheKey(request) {
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.search || !cacheablePath(url.pathname))
    return null;
  // Client-side navigation requests share the URL but return RSC payloads.
  for (const header of ['rsc', 'next-router-state-tree', 'next-router-prefetch'])
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
          element.setAttribute('lang', locale === 'zh' ? 'zh-CN' : locale);
        },
      })
      .transform(response);
  }
  return response;
}

const worker = {
  async fetch(request, env, context) {
    const { pathname } = new URL(request.url);

    if (pathname.startsWith('/_next/static/') || pathname.startsWith('/images/') || staticFiles.has(pathname)) {
      return env.ASSETS.fetch(request);
    }

    const cacheKey = typeof caches === 'undefined' ? null : edgeCacheKey(request);
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

    const [forClient, forCache] = response.body ? response.body.tee() : [null, null];
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
