'use client';
import { useCallback, useEffect, useRef } from 'react';

// A timeout restores local controls; it cannot establish whether a write was
// accepted by the server. Callers must not automatically retry uncertain writes.
export function useBoundedRequest() {
  const pending = useRef<AbortController | null>(null);
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      pending.current?.abort();
    };
  }, []);
  const isPending = useCallback(() => Boolean(pending.current), []);
  const send = useCallback(
    async <T = never>(
      url: string,
      options: RequestInit = {},
      read?: (response: Response) => Promise<T>,
    ) => {
      if (!mounted.current || pending.current) return null;
      const controller = new AbortController();
      pending.current = controller;
      const timeout = setTimeout(() => controller.abort(), 15_000);
      let response: Response | null = null;
      let data: T | undefined;
      try {
        response = await fetch(url, { ...options, signal: controller.signal });
        if (read) data = await read(response);
      } catch {
        // An absent response is an uncertain write, not proof of rejection.
      } finally {
        clearTimeout(timeout);
        if (pending.current === controller) pending.current = null;
      }
      return mounted.current ? { response, data } : null;
    },
    [],
  );
  return { send, isPending };
}
