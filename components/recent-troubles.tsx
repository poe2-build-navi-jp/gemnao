'use client';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { ChevronRight, Clock3 } from 'lucide-react';
import { useMemo, useSyncExternalStore } from 'react';
import {
  parseRecentTroubles,
  RECENT_TROUBLES_KEY,
} from '@/lib/recent-troubles';
import { MY_DATA_EVENT } from '@/lib/saved-solutions';

function subscribe(callback: () => void) {
  window.addEventListener(MY_DATA_EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(MY_DATA_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}
export function RecentTroubles({
  variant = 'home',
}: {
  variant?: 'home' | 'my';
}) {
  const raw = useSyncExternalStore(
    subscribe,
    () => {
      try {
        return localStorage.getItem(RECENT_TROUBLES_KEY) ?? '';
      } catch {
        return '';
      }
    },
    () => '',
  );
  const items = useMemo(
    () => parseRecentTroubles(raw).slice(0, variant === 'my' ? 5 : 3),
    [raw, variant],
  );
  if (!items.length) return null;
  return (
    <section
      className={`${variant === 'home' ? 'content ' : ''}recent-troubles`}
      aria-labelledby="recent-title"
    >
      <div className="section-heading compact-heading">
        <div>
          <p>CONTINUE</p>
          <h2 id="recent-title">最近見た記事から再開</h2>
        </div>
      </div>
      <div className="recent-trouble-list">
        {items.map((item) => (
          <a href={item.path} key={item.path}>
            <Clock3 size={17} aria-hidden="true" />
            <span>{item.title}</span>
            <ChevronRight size={16} aria-hidden="true" />
          </a>
        ))}
      </div>
    </section>
  );
}
