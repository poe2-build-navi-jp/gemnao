// Only registry-backed, public editorial pages. Request/D1/personalized routes
// must remain live even if the framework's speculative render succeeds.
export function isEditorialSnapshotPath(pathname) {
  return /^\/(?:games|guide|trouble|discord|pc|gear|new-releases|tools)(?:\/[a-z0-9-]+)*$/.test(pathname) ||
    /^\/(?:en|zh|es)(?:\/games\/[a-z0-9-]+(?:\/[a-z0-9-]+)?)?$/.test(pathname) ||
    ['/en/guide/pc-game-crash', '/en/gear/save-backup-storage-guide', '/en/gear/discord-microphone-guide', '/en/tools', '/en/tools/windows-diagnosis'].includes(pathname) ||
    ['/about', '/privacy', '/terms'].includes(pathname);
}

export function snapshotAssetFor(request, manifest) {
  const url = new URL(request.url);
  if (!['GET', 'HEAD'].includes(request.method) || url.search || !isEditorialSnapshotPath(url.pathname)) return null;
  if (['rsc', 'next-router-state-tree', 'next-router-prefetch', 'next-router-segment-prefetch'].some((name) => request.headers.has(name))) return null;
  if (request.headers.get('accept')?.includes('text/x-component')) return null;
  // Draft/preview cookies must never receive a public snapshot.
  if (/__(?:prerender_bypass|next_preview_data)=/.test(request.headers.get('cookie') || '')) return null;
  return Object.hasOwn(manifest, url.pathname) ? manifest[url.pathname] : null;
}
