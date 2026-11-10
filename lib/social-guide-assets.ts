import data from './social-guide-assets.json';
export const socialGuideAssets = data;
export type SocialGuideAsset = (typeof data)[number];
export function socialGuideUrl(item: SocialGuideAsset) {
  const url = new URL(item.path, 'https://gemnao.pages.dev');
  url.searchParams.set('utm_source', 'x');
  url.searchParams.set('utm_medium', 'social');
  url.searchParams.set('utm_campaign', 'quick_checks_202611');
  url.searchParams.set('utm_content', item.id);
  return url.href;
}
