// Google Analytics events. gtag() is defined inline in <head> (app/layout.tsx)
// and is absent on /admin and when analytics is disabled, so every call is
// a no-op there. Event names are what GA shows; keep them stable once they
// are marked as key events.

export type AnalyticsEvent =
  | 'issue_resolved'
  | 'issue_struggling'
  | 'solution_method'
  | 'share'
  | 'affiliate_click';

type Gtag = (
  command: 'event',
  name: string,
  params: Record<string, string>,
) => void;

/** Paths that must never be counted (the admin screens). */
export const untrackedPath = (path: string) => /^\/(?:admin|diagnose|diagnosis)(?:\/|$)/.test(path);

export function trackEvent(
  name: AnalyticsEvent,
  params: Record<string, string> = {},
) {
  if (typeof window === 'undefined') return;
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  if (typeof gtag !== 'function' || untrackedPath(location.pathname)) return;
  try {
    gtag('event', name, params);
  } catch {
    // Analytics must never break the underlying interaction or navigation.
  }
}
