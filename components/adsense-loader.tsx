'use client';

import { useEffect } from 'react';
import { afterPageLoad } from '@/components/deferred-load';

// AdSense may only run on screens with substantial publisher content.
// Forms, legal pages, the partial translations and error pages stay ad-free.
const adFreePath =
  /^\/(?:en|zh|es|admin|contact|privacy|terms|about|diagnose|diagnosis)(?:\/|$)|^\/discord-servers\/submit(?:\/|$)/;

export function AdsenseLoader({ client }: { client: string }) {
  useEffect(() => {
    if (adFreePath.test(window.location.pathname)) return;
    const navigation = performance.getEntriesByType?.('navigation')[0] as
      | (PerformanceEntry & { responseStatus?: number })
      | undefined;
    if (navigation?.responseStatus && navigation.responseStatus !== 200) return;
    // Ads load on the first scroll/tap or shortly after the page has loaded,
    // so they do not delay the article text (mobile LCP).
    return afterPageLoad(
      () => {
        if (document.querySelector('script[src*="adsbygoogle.js"]')) return;
        const script = document.createElement('script');
        script.async = true;
        script.crossOrigin = 'anonymous';
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
        document.head.appendChild(script);
      },
      { untilInteraction: true },
    );
  }, [client]);
  return null;
}
