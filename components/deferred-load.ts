// Run `callback` once the page has finished loading, so third-party scripts
// (analytics, ads) do not compete with the article for the first paint.
// With `untilInteraction`, it waits for the first scroll/tap/key press or
// `fallbackMs` after load, whichever comes first.
export function afterPageLoad(
  callback: () => void,
  { untilInteraction = false, fallbackMs = 3500 } = {},
) {
  let done = false;
  const events = ['scroll', 'pointerdown', 'keydown', 'touchstart'] as const;
  let timer: number | undefined;
  const run = () => {
    if (done) return;
    done = true;
    window.clearTimeout(timer);
    for (const event of events) window.removeEventListener(event, run);
    callback();
  };
  const schedule = () => {
    if (untilInteraction) {
      for (const event of events)
        window.addEventListener(event, run, { once: true, passive: true });
      timer = window.setTimeout(run, fallbackMs);
    } else if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(run, { timeout: 2000 });
    } else {
      timer = window.setTimeout(run, 1);
    }
  };
  if (document.readyState === 'complete') schedule();
  else window.addEventListener('load', schedule, { once: true });
  return () => {
    done = true;
    window.clearTimeout(timer);
    window.removeEventListener('load', schedule);
    for (const event of events) window.removeEventListener(event, run);
  };
}
