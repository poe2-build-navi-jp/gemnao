// The production host stays indexable. Deployment hashes and branch aliases
// are alternate review URLs, never separate search destinations.
export function applyPreviewIndexing(request, response) {
  if (!/^[a-z0-9-]+\.gemnao\.pages\.dev$/i.test(new URL(request.url).hostname))
    return response;
  const headers = new Headers(response.headers);
  const existing = headers.get('X-Robots-Tag');
  if (
    !existing ||
    !existing
      .split(',')
      .some((value) => value.trim().toLowerCase() === 'noindex')
  )
    headers.set('X-Robots-Tag', existing ? `${existing}, noindex` : 'noindex');
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
