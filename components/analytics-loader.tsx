'use client';

import { useEffect } from 'react';
import { afterPageLoad } from '@/components/deferred-load';
import { trackEvent, untrackedPath } from '@/lib/analytics';

// The gtag() queue is set up inline in <head>, so page views are recorded
// even though gtag.js itself is only fetched after the page has loaded.
// The admin screens are skipped so the owner's visits are not counted.
export function AnalyticsLoader({ id }: { id: string }) {
  useEffect(() => {
    if (untrackedPath(location.pathname)) return;
    // Share links are plain <a data-share="x"> so they work without
    // JavaScript; count them with one delegated listener.
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.('a[data-share]');
      if (!(link instanceof HTMLAnchorElement)) return;
      trackEvent('share', {
        method: link.dataset.share || 'link',
        content_type: 'article',
        item_id: location.pathname,
      });
    };
    document.addEventListener('click', onClick);
    const cancel = afterPageLoad(() => {
      if (document.querySelector('script[src*="googletagmanager.com/gtag"]'))
        return;
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
      document.head.appendChild(script);
    });
    return () => {
      document.removeEventListener('click', onClick);
      cancel();
    };
  }, [id]);
  return null;
}
