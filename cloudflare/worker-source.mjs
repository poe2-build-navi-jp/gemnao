import application from '../dist/server/index.js';
import { handleDiagnosis, privateHeaders, readShare, isShareActive } from '../lib/diagnosis/server';

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
  /^\/(?:games|guide|trouble|discord|new-releases|pc|status|tools|my)(?:\/|$)/.test(pathname) ||
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
  if (/^\/diagnos(?:e|is)(?:\/|$)/.test(pathname)) {
    const protectedResponse = new Response(response.body, response);
    protectedResponse.headers.set('Cache-Control', 'private, no-store');
    protectedResponse.headers.set('Referrer-Policy', 'no-referrer');
    protectedResponse.headers.set('X-Content-Type-Options', 'nosniff');
    protectedResponse.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'");
    if (pathname.startsWith('/diagnosis')) protectedResponse.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return protectedResponse;
  }
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
    if (/^\/api\/diagnosis(?:\/|$)/.test(pathname)) return handleDiagnosis(request, env);
    if (/^\/diagnose(?:\/|$)/.test(pathname) && env.DIAGNOSIS_ENABLED === 'false') return new Response('診断は現在停止しています。既存の記事をご利用ください。', { status: 503, headers: { ...privateHeaders, 'Content-Type': 'text/plain; charset=utf-8' } });
    const sharedId = pathname.match(/^\/diagnosis\/([a-f0-9]{32})\/?$/)?.[1];
    if (sharedId) {
      if (env.DIAGNOSIS_STORAGE_ENABLED !== 'true' || env.DIAGNOSIS_ENABLED === 'false' || env.DIAGNOSIS_SHARING_ENABLED !== 'true') return new Response('共有は現在停止しています。', { status: 503, headers: { ...privateHeaders, 'Content-Type': 'text/plain; charset=utf-8' } });
      try {
        if (!env.DB || !isShareActive(await readShare(env.DB, sharedId), Date.now())) return new Response('共有ページは見つからないか、期限切れ・失効・削除されています。', { status: 404, headers: { ...privateHeaders, 'Content-Type': 'text/plain; charset=utf-8' } });
      } catch { return new Response('共有結果を確認できません。', { status: 503, headers: privateHeaders }); }
    }

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
