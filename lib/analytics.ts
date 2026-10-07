import { siteConfig } from '@/lib/site-config';

// Google Analytics events. gtag() is defined inline in <head> (app/layout.tsx)
// and is absent on /admin and when analytics is disabled, so every call is
// a no-op there. Event names are what GA shows; keep them stable once they
// are marked as key events.

export type AnalyticsEvent =
  | 'issue_resolved'
  | 'issue_struggling'
  | 'solution_method'
  | 'share'
  | 'affiliate_click'
  | 'my_game_added'
  | 'article_saved'
  | 'saved_article_opened'
  | 'related_article_opened';

type Gtag = (
  command: 'event',
  name: string,
  params: Record<string, string>,
) => void;

export const analyticsOrigin = new URL(siteConfig.url).origin;

export function canTrackAnalytics() {
  return (
    typeof window !== 'undefined' &&
    location.origin === analyticsOrigin &&
    !untrackedPath(location.pathname)
  );
}

/** Paths that must never be counted (the admin screens). */
export const untrackedPath = (path: string) => /^\/(?:admin|diagnostic-feedback|diagnose|diagnosis)(?:\/|$)/.test(path);

export function trackEvent(
  name: AnalyticsEvent,
  params: Record<string, string> = {},
) {
  if (!canTrackAnalytics()) return;
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  if (typeof gtag !== 'function' || untrackedPath(location.pathname)) return;
  try {
    gtag('event', name, params);
  } catch {
    // Analytics must never break the underlying interaction or navigation.
  }
}

/** Call only after a new My Games selection has been persisted successfully.
 * No game/PC/note data or custom user identifier is sent. Fixed page metadata
 * also prevents GA's defaults from including the source game's title or URL.
 */
export function trackMyGameAdded() {
  trackEvent('my_game_added', {
    page_location: 'https://gemnao.pages.dev/my',
    page_title: 'My Games',
    page_referrer: '',
  });
}

/** Aggregate action counts only. Never send saved titles, paths, notes, or IDs. */
export function trackReadingAction(
  name: 'article_saved' | 'saved_article_opened' | 'related_article_opened',
) {
  trackEvent(name, {
    page_location: 'https://gemnao.pages.dev/my',
    page_title: 'Reading list',
    page_referrer: '',
  });
}
