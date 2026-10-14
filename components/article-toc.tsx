'use client';

import { useEffect, useId, useState, type ReactNode } from 'react';

// One set of native anchor links: expanded on desktop, opt-in on narrow screens.
export function ArticleToc({
  title,
  children,
  className = '',
}: {
  title: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const id = useId();
  useEffect(() => {
    // The browser initially positions a fragment using SSR geometry. Nearby
    // saved-reading/feedback controls can change height during hydration.
    const hash = location.hash;
    if (!hash) return;
    let target: HTMLElement | null;
    try {
      target = document.getElementById(decodeURIComponent(hash.slice(1)));
    } catch {
      return;
    }
    if (!target?.closest('.article-layout')) return;
    let cancelled = false;
    let frame = 0;
    const cancel = () => {
      cancelled = true;
    };
    const events = ['pointerdown', 'touchstart', 'wheel', 'keydown'] as const;
    for (const event of events)
      window.addEventListener(event, cancel, { once: true, passive: true });
    void document.fonts.ready.then(() => {
      if (cancelled) return;
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => {
          if (!cancelled && location.hash === hash && target?.isConnected)
            target.scrollIntoView({ behavior: 'instant', block: 'start' });
        });
      });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      for (const event of events) window.removeEventListener(event, cancel);
    };
  }, []);
  return (
    <aside
      className={`toc article-toc ${className}${expanded ? ' toc-expanded' : ''}`}
    >
      <strong className="toc-title">{title}</strong>
      <button
        className="toc-toggle"
        type="button"
        aria-expanded={expanded}
        aria-controls={id}
        onClick={() => setExpanded((value) => !value)}
      >
        {title}
        <span aria-hidden="true">{expanded ? '−' : '+'}</span>
      </button>
      <div className="toc-links" id={id}>
        {children}
      </div>
    </aside>
  );
}
