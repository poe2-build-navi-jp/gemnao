'use client';

import { useEffect } from 'react';
import { afterPageLoad } from '@/components/deferred-load';

// The gtag() queue is set up inline in <head>, so page views are recorded
// even though gtag.js itself is only fetched after the page has loaded.
export function AnalyticsLoader({ id }: { id: string }) {
  useEffect(
    () =>
      afterPageLoad(() => {
        if (document.querySelector('script[src*="googletagmanager.com/gtag"]'))
          return;
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
        document.head.appendChild(script);
      }),
    [id],
  );
  return null;
}
