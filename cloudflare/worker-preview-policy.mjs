import { timingSafeEqual } from 'node:crypto';
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
      if (!validOrigin || url.origin !== approvedOrigin || !env || env.QA_PREVIEW_ORIGIN !== approvedOrigin) {
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

const QA_ACCESS_MAX_WINDOW_MS = 60 * 60 * 1000;
const QA_ACCESS_DIGEST = /^[a-f0-9]{64}(?![\s\S])/;
const QA_ACCESS_TOKEN = /^[\x21-\x7e]{43,128}(?![\s\S])/;
const QA_ACCESS_TIMESTAMP = /^[1-9][0-9]{12}(?![\s\S])/;

function accessDenied(status, challenge = false) {
  const headers = { 'Content-Type': 'text/plain; charset=utf-8' };
  if (challenge) headers['WWW-Authenticate'] = 'Basic realm="Gemnao diagnostic QA", charset="UTF-8"';
  return privatePreviewResponse(new Response(status === 401 ? 'QA authentication required.' : 'QA access is unavailable.', { status, headers }));
}
export function qaAccessWindow(env, now = Date.now()) {
  if (!env || typeof env !== 'object' ||
      !['QA_ACCESS_SHA256', 'QA_ACCESS_NOT_BEFORE', 'QA_ACCESS_EXPIRES_AT'].every(key => typeof env[key] === 'string') ||
      !QA_ACCESS_DIGEST.test(env.QA_ACCESS_SHA256) ||
      !QA_ACCESS_TIMESTAMP.test(env.QA_ACCESS_NOT_BEFORE ?? '') ||
      !QA_ACCESS_TIMESTAMP.test(env.QA_ACCESS_EXPIRES_AT ?? '')) return false;
  const start = Number(env.QA_ACCESS_NOT_BEFORE), end = Number(env.QA_ACCESS_EXPIRES_AT);
  return Number.isSafeInteger(now) && Number.isSafeInteger(start) && Number.isSafeInteger(end) &&
    start <= now && now < end && end > start && end - start <= QA_ACCESS_MAX_WINDOW_MS;
}
// The owner supplies a unique password-manager/random-generator token. Length is
// only a format check: it does not establish entropy for a human-chosen phrase.
export async function qaAccessVerifier(passphrase) {
  if (typeof passphrase !== 'string' || !QA_ACCESS_TOKEN.test(passphrase))
    throw new Error('QA access credential format is invalid.');
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(passphrase));
  return Array.from(new Uint8Array(bytes), x => x.toString(16).padStart(2, '0')).join('');
}
function basicPassphrase(header) {
  if (typeof header !== 'string' || header.length > 256 || !/^Basic [A-Za-z0-9+/]+={0,2}$/.test(header)) return null;
  try {
    const encoded = header.slice(6);
    if (encoded.length % 4 !== 0) return null;
    const decoded = atob(encoded);
    if (btoa(decoded) !== encoded || !decoded.startsWith('qa:')) return null;
    const token = decoded.slice(3);
    return QA_ACCESS_TOKEN.test(token) ? token : null;
  } catch { return null; }
}
const digestBytes = hex => Uint8Array.from(hex.match(/../g), x => Number.parseInt(x, 16));

// Outermost wrapper. No application/asset/cache/redirect work precedes this gate.
// Node's runtime timingSafeEqual is used under the pinned nodejs_compat flag.
export function wrapQaAccess(application, approvedOrigin, clock = Date.now) {
  const validOrigin = /^https:\/\/gemnao-diagnostic-qa\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.workers\.dev$/.test(approvedOrigin);
  return {
    async fetch(request, env, context) {
      const url = new URL(request.url);
      if (!validOrigin || url.origin !== approvedOrigin || env.QA_PREVIEW_ORIGIN !== approvedOrigin ||
          !qaAccessWindow(env, clock())) return accessDenied(503);
      const token = basicPassphrase(request.headers.get('Authorization'));
      if (!token) return accessDenied(401, true);
      const actual = await qaAccessVerifier(token);
      if (!timingSafeEqual(digestBytes(actual), digestBytes(env.QA_ACCESS_SHA256))) return accessDenied(401, true);
      // Basic credentials are ambient browser authentication, not CSRF protection.
      if (!['GET', 'HEAD'].includes(request.method) &&
          (request.headers.get('Origin') !== approvedOrigin ||
           (request.headers.has('Sec-Fetch-Site') && request.headers.get('Sec-Fetch-Site') !== 'same-origin')))
        return accessDenied(403);
      // Do not forward the QA credential or its verifier to application code.
      const headers = new Headers(request.headers); headers.delete('Authorization');
      // Feedback uses independent receipt/key ownership, never diagnosis cookies.
      // Keep browser-managed Basic auth at the outer gate without forwarding
      // ambient cookies to this API; diagnosis routes still need their owner cookie.
      if (url.pathname === '/api/diagnostic-feedback') headers.delete('Cookie');
      const cleanRequest = new Request(request, { headers });
      const { QA_ACCESS_SHA256: _verifier, QA_ACCESS_NOT_BEFORE: _start,
        QA_ACCESS_EXPIRES_AT: _expiry, ...applicationEnv } = env;
      try {
        const response = await application.fetch(cleanRequest, applicationEnv, context);
        // Stop sending protected content if the window elapsed during application work.
        if (!qaAccessWindow(env, clock())) return accessDenied(503);
        return privatePreviewResponse(response);
      } catch { return accessDenied(503); }
    },
  };
}
