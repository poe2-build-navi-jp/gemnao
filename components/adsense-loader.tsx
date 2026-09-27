'use client';

import { useEffect } from 'react';

// AdSense may only run on screens with substantial publisher content.
// Forms, legal pages, the partial translations and error pages stay ad-free.
const adFreePath =
  /^\/(?:en|zh|es|admin|contact|privacy|terms|about)(?:\/|$)|^\/discord-servers\/submit(?:\/|$)/;

export function AdsenseLoader({ client }: { client: string }) {
  useEffect(() => {
    if (adFreePath.test(window.location.pathname)) return;
    const navigation = performance.getEntriesByType?.('navigation')[0] as
      | (PerformanceEntry & { responseStatus?: number })
      | undefined;
    if (navigation?.responseStatus && navigation.responseStatus !== 200) return;
    if (document.querySelector('script[src*="adsbygoogle.js"]')) return;
    const script = document.createElement('script');
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
    document.head.appendChild(script);
  }, [client]);
  return null;
}
