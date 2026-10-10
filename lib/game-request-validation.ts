// Explicit, public validation mode; never an authentication or quota bypass.
export function parseGameRequestValidationWindow(start: unknown, end: unknown) {
  if (typeof start !== 'string' || typeof end !== 'string') return null;
  const canonical = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
  if (!canonical.test(start) || !canonical.test(end)) return null;
  const from = Date.parse(start),
    until = Date.parse(end);
  if (
    !Number.isFinite(from) ||
    !Number.isFinite(until) ||
    new Date(from).toISOString() !== start ||
    new Date(until).toISOString() !== end ||
    from >= until ||
    until - from > 5 * 60_000
  )
    return null;
  return { from, until };
}
