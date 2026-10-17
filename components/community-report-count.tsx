'use client';
import { useEffect, useRef, useState } from 'react';
import { reportCopy } from '@/lib/community-reports/copy';
import type { MyGamesLocale } from '@/lib/my-games-copy';

// Explicit reads protect the shared 128/day allowance. No polling, cached HTML
// counts, persistent browser cache, or implicit request on every hub page view.
export function CommunityReportCount({
  gameSlug,
  locale,
}: {
  gameSlug: string;
  locale: MyGamesLocale;
}) {
  const t = reportCopy[locale];
  const [result, setResult] = useState<{
    count: number;
    checkedAt: number;
  } | null>(null);
  const [state, setState] = useState<
    'idle' | 'busy' | 'ready' | 'error' | 'expired'
  >('idle');
  const pending = useRef<AbortController | null>(null);
  useEffect(() => {
    return () => {
      pending.current?.abort();
      pending.current = null;
    };
  }, [gameSlug]);
  useEffect(() => {
    if (!result) return;
    const expire = () => {
      setResult(null);
      setState('expired');
    };
    const timer = setTimeout(
      expire,
      Math.max(0, (result.checkedAt + 60) * 1000 - Date.now()),
    );
    const onVisibility = () => {
      if (Date.now() / 1000 - result.checkedAt >= 60) expire();
    };
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pageshow', onVisibility);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pageshow', onVisibility);
    };
  }, [result]);
  async function check() {
    if (pending.current) return;
    const controller = new AbortController();
    pending.current = controller;
    setResult(null);
    setState('busy');
    const timer = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch(
        `/api/reports/public?game=${encodeURIComponent(gameSlug)}&count=true`,
        {
          cache: 'no-store',
          credentials: 'same-origin',
          signal: controller.signal,
        },
      );
      const data = (await response.json()) as {
        count?: unknown;
        checkedAt?: unknown;
      };
      const now = Date.now() / 1000;
      if (
        !response.ok ||
        typeof data.count !== 'number' ||
        !Number.isInteger(data.count) ||
        data.count < 0 ||
        data.count > 200 ||
        typeof data.checkedAt !== 'number' ||
        !Number.isInteger(data.checkedAt) ||
        data.checkedAt > now + 5 ||
        data.checkedAt < now - 60
      )
        throw Error('unavailable');
      if (pending.current !== controller) return;
      setResult({ count: data.count, checkedAt: data.checkedAt });
      setState('ready');
    } catch {
      if (pending.current === controller) setState('error');
    } finally {
      clearTimeout(timer);
      if (pending.current === controller) pending.current = null;
    }
  }
  return (
    <div className="report-count">
      <output aria-live="polite">
        {result && (
          <>
            <strong>
              {t.countLabel.replace('{count}', String(result.count))}
            </strong>
            <br />
            <small>
              {t.countAt}:{' '}
              <time dateTime={new Date(result.checkedAt * 1000).toISOString()}>
                {new Date(result.checkedAt * 1000).toLocaleTimeString(locale)}
              </time>
            </small>
          </>
        )}
        {state === 'error' && t.countUnavailable}
        {state === 'expired' && t.countExpired}
      </output>
      <button
        type="button"
        disabled={state === 'busy'}
        onClick={() => void check()}
      >
        {state === 'busy' ? t.busy : t.countCheck}
      </button>
      <small>{t.countNote}</small>
    </div>
  );
}
