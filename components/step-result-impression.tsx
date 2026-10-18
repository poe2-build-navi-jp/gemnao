'use client';
import { useEffect, useRef, type ReactNode } from 'react';
import { trackStepControlsViewed } from '@/lib/analytics';

export function StepResultImpression({
  method,
  enabled,
  children,
}: {
  method: string;
  enabled: boolean;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!enabled || !ref.current || typeof IntersectionObserver === 'undefined')
      return;
    const path = location.pathname;
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries.some(
            (entry) => entry.isIntersecting && entry.intersectionRatio >= 0.25,
          )
        ) {
          trackStepControlsViewed(path, method);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [enabled, method]);
  return (
    <div className="step-actions" ref={ref}>
      {children}
    </div>
  );
}
