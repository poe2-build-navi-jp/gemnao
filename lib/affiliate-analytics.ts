import { trackEvent } from './analytics';

export type AffiliatePosition =
  | 'after-answer'
  | 'after-faq'
  | 'after-fit-check'
  | `diagnostic-step-${number}`;

/** Only editorial paths and public product IDs belong in this event. */
export function affiliateClickParams(data: DOMStringMap) {
  const path = data.affiliatePath ?? '';
  const asin = data.affiliateAsin ?? '';
  const position = data.affiliatePosition ?? '';
  if (
    (!/^\/(?:discord|guide|pc|gear)\/[a-z0-9-]{1,100}$/.test(path) &&
      path !== '/en/gear/discord-microphone-guide') ||
    !/^[A-Z0-9]{10}$/.test(asin) ||
    !/^(?:after-answer|after-faq|after-fit-check|diagnostic-step-(?:[1-9]|[1-9][0-9]))$/.test(
      position,
    )
  )
    return null;
  return {
    affiliate_partner: 'amazon',
    article_path: path,
    product_id: asin,
    link_position: position,
    // Override GA's automatic current URL for this event: no query or fragment.
    page_location: `https://gemnao.pages.dev${path}`,
    page_referrer: '',
  };
}

/** Native clicks include keyboard activation and Ctrl/Cmd clicks. Middle clicks
 * arrive as auxclick; listen to each once, without delaying/preventing navigation.
 * Right clicks and opening a context menu are not counted as link activations.
 */
export function trackAffiliateClick(event: MouseEvent) {
  if (event.defaultPrevented) return;
  if (
    !(
      (event.type === 'click' && event.button === 0) ||
      (event.type === 'auxclick' && event.button === 1)
    )
  )
    return;
  const link = (event.target as Element | null)?.closest?.(
    'a[data-affiliate-asin]',
  );
  if (!(link instanceof HTMLAnchorElement)) return;
  const params = affiliateClickParams(link.dataset);
  if (!params) return;
  trackEvent('affiliate_click', params);
}

export function listenForAffiliateClicks(target: Document = document) {
  target.addEventListener('click', trackAffiliateClick);
  target.addEventListener('auxclick', trackAffiliateClick);
  return () => {
    target.removeEventListener('click', trackAffiliateClick);
    target.removeEventListener('auxclick', trackAffiliateClick);
  };
}
