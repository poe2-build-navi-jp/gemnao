'use client';

import { ChevronRight, Clock3 } from 'lucide-react';
import { useEffect, useState } from 'react';

type RecentItem = {
  contextSlug: string;
  title: string;
  path: string;
  viewedAt: string;
};

export function RecentTroubles() {
  const [items, setItems] = useState<RecentItem[]>([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem('gemnao-recent-troubles') || '[]',
      ) as RecentItem[];
      queueMicrotask(() => setItems(saved.slice(0, 3)));
    } catch {
      localStorage.removeItem('gemnao-recent-troubles');
    }
  }, []);

  if (!items.length) return null;
  return (
    <section className="content recent-troubles" aria-labelledby="recent-title">
      <div className="section-heading compact-heading">
        <div>
          <p>CONTINUE</p>
          <h2 id="recent-title">最近見たトラブル</h2>
        </div>
      </div>
      <div className="recent-trouble-list">
        {items.map((item) => (
          <a href={item.path} key={item.contextSlug}>
            <Clock3 size={17} />
            <span>{item.title}</span>
            <ChevronRight size={16} />
          </a>
        ))}
      </div>
    </section>
  );
}
