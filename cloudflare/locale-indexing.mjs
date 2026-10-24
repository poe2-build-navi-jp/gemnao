// Chinese and Spanish pages stay public but are kept out of search results so
// a new site's limited crawling goes to Japanese and English first. Keep the
// path rule in sync with isIndexedPath in lib/i18n.ts.
const secondaryLocale = /^\/(zh|es)(\/|$)/;

export function applyLocaleIndexing(request, response) {
  if (!secondaryLocale.test(new URL(request.url).pathname)) return response;
  const headers = new Headers(response.headers);
  const existing = headers.get('X-Robots-Tag');
  if (
    existing &&
    existing
      .split(',')
      .some((value) => value.trim().toLowerCase() === 'noindex')
  )
    return response;
  headers.set('X-Robots-Tag', existing ? `${existing}, noindex` : 'noindex');
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
