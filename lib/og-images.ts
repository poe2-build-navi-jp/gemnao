import { ogImageManifest } from '@/lib/og-image-manifest';

// Social preview image for a page. Falls back when the card has not been
// rendered yet, so adding an article never breaks the build or the page.
export function ogImageFor(path: string, fallback = '/og-default.png') {
  const version = ogImageManifest[path];
  return version ? `/images/og${path}.png?v=${version}` : fallback;
}
