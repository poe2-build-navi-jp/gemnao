const CSP = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'";

export function privatePreviewResponse(response) {
  const result = new Response(response.body, response);
  result.headers.set('Cache-Control', 'private, no-store');
  result.headers.set('CDN-Cache-Control', 'no-store');
  result.headers.set('Cloudflare-CDN-Cache-Control', 'no-store');
  result.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  result.headers.set('Referrer-Policy', 'no-referrer');
  result.headers.set('X-Content-Type-Options', 'nosniff');
  // Suppress external ads/analytics on every QA route, not only feature pages.
  result.headers.set('Content-Security-Policy', CSP);
  return result;
}

export function blockedPreviewPath(pathname) {
  let decoded;
  try { decoded = decodeURIComponent(pathname); } catch { return true; }
  return pathname.includes('%') || pathname.includes('//') || decoded.includes('\\') || decoded.includes('%') ||
    decoded.split('/').some((part) => part.startsWith('.')) ||
    /^\/(?:_worker(?:\.|\/)|_gemnao-snapshots(?:\/|$)|server(?:\/|$)|cloudflare(?:\/|$)|ops(?:\/|$)|node_modules(?:\/|$)|src(?:\/|$))/.test(decoded) ||
    /(?:\.map|\.sql|\.toml|\.jsonc|\.ya?ml|\.tsx?)$/i.test(decoded) ||
    /(?:^|\/)(?:wrangler[^/]*|package[^/]*\.json|.*manifest[^/]*\.json|_headers|_redirects|_routes\.json)$/i.test(decoded);
}

// The caller supplies the build-pinned origin, never a user-controlled value.
export function wrapPreviewApplication(application, approvedOrigin) {
  const validOrigin = /^https:\/\/gemnao-diagnostic-qa\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.workers\.dev$/.test(approvedOrigin);
  return {
    async fetch(request, env, context) {
      const url = new URL(request.url);
      if (!validOrigin || url.origin !== approvedOrigin || env.QA_PREVIEW_ORIGIN !== approvedOrigin) {
        return privatePreviewResponse(new Response('Preview origin is not configured.', { status: 503 }));
      }
      if (blockedPreviewPath(url.pathname)) return privatePreviewResponse(new Response('Not found', { status: 404 }));
      if (url.pathname === '/robots.txt') return privatePreviewResponse(new Response('User-agent: *\nDisallow: /\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }));
      if (url.pathname.startsWith('/api/') && !/^\/api\/diagnosis(?:\/|$)/.test(url.pathname) && url.pathname !== '/api/diagnostic-feedback') {
        return privatePreviewResponse(new Response('This API is not available on the diagnostic QA site.', { status: 404 }));
      }
      // Reject accidental ordinary DB inheritance rather than silently using it.
      if (env.DB !== undefined) return privatePreviewResponse(new Response('Invalid preview bindings.', { status: 503 }));
      if (url.pathname === '/') return privatePreviewResponse(new Response(null, { status: 302, headers: { Location: '/diagnose' } }));
      // Expose only diagnostic QA pages/APIs and their frontend assets. Ordinary
      // articles, status fetchers, votes, contact and admin features stay outside
      // this test service; their production implementation is unchanged.
      if (!/^\/(?:diagnose|diagnosis)(?:\/|$)/.test(url.pathname) &&
          url.pathname !== '/diagnostic-feedback' &&
          !/^\/api\/diagnosis(?:\/|$)/.test(url.pathname) &&
          url.pathname !== '/api/diagnostic-feedback' &&
          !/^\/(?:_next\/static|images)\//.test(url.pathname) &&
          !['/favicon.svg', '/gemnao-logo.png', '/og-default.png', '/og-default.svg'].includes(url.pathname)) {
        return privatePreviewResponse(new Response('Not found', { status: 404 }));
      }
      try {
        return privatePreviewResponse(await application.fetch(request, env, context));
      } catch {
        return privatePreviewResponse(new Response('Preview temporarily unavailable.', { status: 503 }));
      }
    },
  };
}
