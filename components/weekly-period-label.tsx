'use client';
import { useEffect, useState } from 'react';
import { weeklyPeriodLabel, type weeklyLabels } from '@/lib/weekly-period';

export function WeeklyPeriodLabel({ slug, locale = 'ja' }: { slug: string; locale?: keyof typeof weeklyLabels }) {
  // Static/cached HTML never claims "this week" before the browser checks JST.
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const refresh = () => {
      clearTimeout(timer);
      const time = Date.now();
      setNow(time);
      const day = 86_400_000;
      timer = setTimeout(refresh, day - ((time + 9 * 3_600_000) % day) + 1);
    };
    refresh();
    document.addEventListener('visibilitychange', refresh);
    return () => { clearTimeout(timer); document.removeEventListener('visibilitychange', refresh); };
  }, [slug]);
  return <span>{weeklyPeriodLabel(slug, locale, now)}</span>;
}
