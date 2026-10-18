import { siteConfig } from '@/lib/site-config';

// Google Analytics events. gtag() is defined inline in <head> (app/layout.tsx)
// and is absent on /admin and when analytics is disabled, so every call is
// a no-op there. Event names are what GA shows; keep them stable once they
// are marked as key events.

export type AnalyticsEvent =
  | 'step_result_saved'
  | 'step_result_controls_viewed'
  | 'step_result_failed'
  | 'solution_saved'
  | 'solution_reused'
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
export const untrackedPath = (path: string) =>
  /^\/(?:admin|diagnostic-feedback|diagnose|diagnosis)(?:\/|$)/.test(path) ||
  /^\/(?:(?:en|zh|es)\/)?reports(?:\/|$)/.test(path);

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

// Only public editorial URL paths; never query strings, fragments or notebook data.
export function editorialAnalyticsPath(path: string) {
  return /^\/(?:en\/|zh\/|es\/)?(?:games\/[a-z0-9-]+(?:\/[a-z0-9-]+)?|(?:guide|discord|pc|gear|trouble|examples|weekly)\/[a-z0-9-]+)$/.test(
    path,
  )
    ? path
    : null;
}
type StepOutcome = 'resolved' | 'not-resolved';
export type StepFailure =
  | 'network'
  | 'rate_limited'
  | 'rejected'
  | 'unavailable'
  | 'invalid_response';
function stepParams(sourcePath: string, method: string) {
  const path = editorialAnalyticsPath(sourcePath);
  if (!path || !/^[a-z0-9][a-z0-9-]{0,99}$/.test(method)) return null;
  return {
    step_id: method,
    page_location: `${analyticsOrigin}${path}`,
    page_title: 'Troubleshooting result',
    page_referrer: '',
  };
}
export function trackStepResultSaved(
  outcome: StepOutcome,
  sourcePath: string,
  method: string,
) {
  const params = stepParams(sourcePath, method);
  if (!params || !['resolved', 'not-resolved'].includes(outcome)) return;
  trackEvent('step_result_saved', { ...params, outcome });
}
export function trackStepResultFailed(
  outcome: StepOutcome,
  sourcePath: string,
  method: string,
  failure: StepFailure,
) {
  const params = stepParams(sourcePath, method);
  if (
    !params ||
    !['resolved', 'not-resolved'].includes(outcome) ||
    ![
      'network',
      'rate_limited',
      'rejected',
      'unavailable',
      'invalid_response',
    ].includes(failure)
  )
    return;
  trackEvent('step_result_failed', { ...params, outcome, failure });
}
// Once per public path/STEP in this document, including React remounts.
const viewedStepControls = new Set<string>();
export function trackStepControlsViewed(sourcePath: string, method: string) {
  const params = stepParams(sourcePath, method);
  const key = `${sourcePath}:${method}`;
  if (
    !params ||
    !canTrackAnalytics() ||
    typeof (window as unknown as { gtag?: unknown }).gtag !== 'function' ||
    viewedStepControls.has(key)
  )
    return;
  viewedStepControls.add(key);
  trackEvent('step_result_controls_viewed', params);
}
export function trackSolutionSaved() {
  trackEvent('solution_saved', {
    page_location: `${analyticsOrigin}/my-games`,
    page_title: 'My Games',
    page_referrer: '',
  });
}
export function trackSolutionReused() {
  trackEvent('solution_reused', {
    page_location: `${analyticsOrigin}/my-games`,
    page_title: 'My Games',
    page_referrer: '',
  });
}
export function trackRelatedArticleOpened(href: string) {
  if (typeof location === 'undefined') return;
  const source = editorialAnalyticsPath(location.pathname);
  if (!source) return;
  let target: URL;
  try {
    target = new URL(href, analyticsOrigin);
  } catch {
    return;
  }
  if (
    target.origin !== analyticsOrigin ||
    !editorialAnalyticsPath(target.pathname)
  )
    return;
  trackEvent('related_article_opened', {
    page_location: `${analyticsOrigin}${source}`,
    page_title: 'Article navigation',
    page_referrer: '',
  });
}
