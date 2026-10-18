// Only registry-backed, public editorial pages. Request/D1/personalized routes
// must remain live even if the framework's speculative render succeeds.
export function isEditorialSnapshotPath(pathname) {
  return (
    /^\/(?:games|guide|trouble|discord|pc|gear|new-releases|weekly|tools|examples)(?:\/[a-z0-9-]+)*$/.test(
      pathname,
    ) ||
    /^\/(?:en|zh|es)(?:\/games\/[a-z0-9-]+(?:\/[a-z0-9-]+)?)?$/.test(
      pathname,
    ) ||
    /^\/(?:en|zh|es)\/(?:discord|examples)\/[a-z0-9-]+$/.test(pathname) ||
    [
      '/en/pc/microphone-after-update',
      '/en/pc/call-starts-audio-disappears',
      '/en/pc/bluetooth-connected-no-sound',
      '/en/pc',
      '/en/pc/disk-usage-100',
      '/en/pc/pc-broken',
      '/en/pc/pc-hacked-signs',
      '/en/pc/windows-update-stuck',
      '/en/pc/windows-update-0x800f081f',
      '/en/pc/file-explorer-freezes-on-right-click',
      '/en/pc/sleep-wakes-up-by-itself',
      '/en/pc/black-screen-after-sign-in',
      '/en/pc/wifi-option-missing',
      '/en/pc/wifi-connected-no-internet',
      '/en/pc/refresh-rate-stuck-60hz',
      '/en/pc/gaming-shortcut-keys',
      '/en/pc/usb-c-device-not-recognized',
      '/en/pc/second-monitor-not-detected',
      '/en/pc/audio-after-update',
      '/en/pc/bluetooth-option-missing',
      '/en/pc/repair-or-replace',
      '/zh/pc/repair-or-replace',
      '/es/pc/repair-or-replace',
      '/en/discord',
      '/en/guide',
      '/zh/guide',
      '/zh/guide/verify-steam-files',
      '/es/guide/verify-steam-files',
      '/zh/guide/low-fps',
      '/es/guide/low-fps',
      '/zh/guide/steam-game-not-launching',
      '/es/guide/steam-game-not-launching',
      '/zh/guide/pc-game-crash',
      '/es/guide/pc-game-crash',
      '/es/guide',
      '/zh/guide/save-data-backup',
      '/zh/guide/steam-cloud-sync-error',
      '/es/guide/steam-cloud-sync-error',
      '/es/guide/save-data-backup',
      '/en/guide/save-data-backup',
      '/en/guide/steam-cloud-sync-error',
      '/en/guide/pc-game-freezes',
  '/en/guide/pc-shuts-down-while-gaming',
  '/en/guide/bsod-while-gaming',
  '/en/guide/reshade-uninstall',
  '/en/guide/tpm-secure-boot',
  '/en/guide/windows-11-required',
  '/en/guide/ray-tracing-gpu',
  '/en/guide/reset-config-file',
  '/en/guide/remove-mods-safely',
  '/en/guide/uninstall-save-data',
  '/en/guide/shader-cache-delete',
  '/en/guide/steam-disk-write-error',
      '/en/guide/vram-shortage',
      '/en/guide/low-gpu-usage',
      '/en/guide/directx-error',
      '/en/guide/visual-c-runtime-error',
      '/en/guide/no-game-audio',
      '/en/guide/steam-input-controller',
      '/en/guide/controller-double-input',
      '/en/guide/verify-steam-files',
      '/en/guide/gpu-driver-update',
      '/en/guide/black-screen',
      '/en/guide/low-fps',
      '/en/guide/pc-game-crash',
      '/en/guide/steam-game-not-launching',
      '/en/guide/stutter-fix',
      '/en/gear/save-backup-storage-guide',
      '/en/gear/discord-microphone-guide',
      '/en/tools',
      '/en/tools/windows-diagnosis',
    ].includes(pathname) ||
    ['/about', '/privacy', '/terms'].includes(pathname)
  );
}

export function snapshotAssetFor(request, manifest) {
  const url = new URL(request.url);
  if (
    !['GET', 'HEAD'].includes(request.method) ||
    url.search ||
    !isEditorialSnapshotPath(url.pathname)
  )
    return null;
  if (
    [
      'rsc',
      'next-router-state-tree',
      'next-router-prefetch',
      'next-router-segment-prefetch',
    ].some((name) => request.headers.has(name))
  )
    return null;
  if (request.headers.get('accept')?.includes('text/x-component')) return null;
  // Draft/preview cookies must never receive a public snapshot.
  if (
    /__(?:prerender_bypass|next_preview_data)=/.test(
      request.headers.get('cookie') || '',
    )
  )
    return null;
  return Object.hasOwn(manifest, url.pathname) ? manifest[url.pathname] : null;
}
