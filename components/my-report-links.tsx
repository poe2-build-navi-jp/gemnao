'use client';
/* oxlint-disable next/no-html-link-for-pages -- Privacy boundary uses full document navigation. */
import { useEffect, useState } from 'react';
import type { MyGamesLocale } from '@/lib/my-games-copy';
import { reportCopy } from '@/lib/community-reports/copy';
import { readTickets } from '@/lib/community-reports/local';
export function MyReportLinks({ locale = 'ja' }: { locale?: MyGamesLocale }) {
  const [count, setCount] = useState(0),
    [error, setError] = useState(false);
  useEffect(() => {
    const load = () => {
      try {
        setCount(readTickets(localStorage).length);
        setError(false);
      } catch {
        setError(true);
      }
    };
    load();
    window.addEventListener('storage', load);
    window.addEventListener('gemnao-reports-updated', load);
    return () => {
      window.removeEventListener('storage', load);
      window.removeEventListener('gemnao-reports-updated', load);
    };
  }, []);
  return (
    <section className="my-report-links">
      <h2>{reportCopy[locale].mine}</h2>
      <p>
        <a href={`${locale === 'ja' ? '' : '/' + locale}/reports#mine`}>
          {reportCopy[locale].open} ({count}) →
        </a>
      </p>
      {error && <p role="alert">{reportCopy[locale].failure}</p>}
    </section>
  );
}
