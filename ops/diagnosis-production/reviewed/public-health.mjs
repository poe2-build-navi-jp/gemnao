// Local proposal: anonymous metadata only. Fixed SELECTs, no cleanup or write path.
export const PUBLIC_HEALTH_URL = 'https://gemnao-retention-health.soykururu143.workers.dev/health';
export const CACHE_TTL_MS = 300_000;
export const READ_LIMIT_KEY = 'gemnao-production-cleanup-heartbeats-v1';
export const HEALTH_READS = Object.freeze([
  Object.freeze({ feature: 'sharing', binding: 'DIAGNOSIS_DB', firstScheduledAt: Date.parse('2026-10-12T07:17:00Z'),
    sql: "SELECT value,expires_at FROM diagnosis_operations WHERE key='cleanup_success' LIMIT 1;" }),
  Object.freeze({ feature: 'feedback', binding: 'FEEDBACK_DB', firstScheduledAt: Date.parse('2026-10-12T07:43:00Z'),
    sql: 'SELECT last_cleanup FROM diagnostic_retention_health WHERE singleton=1 LIMIT 1;' }),
]);
const keysAre = (value, keys) => value && typeof value === 'object' && !Array.isArray(value)
  && Object.keys(value).length === keys.length && keys.every(k => Object.hasOwn(value, k));
const validStamp = (stamp, target, now) => Number.isSafeInteger(stamp)
  && stamp >= target.firstScheduledAt && stamp <= now;

function successStamp(target, result, now) {
  if (result?.success !== true || !Array.isArray(result.results) || result.results.length !== 1
    || result.meta?.rows_written !== 0 || result.meta.changed_db !== false) return null;
  const row = result.results[0]; let stamp;
  if (target.feature === 'sharing') {
    if (!keysAre(row, ['value', 'expires_at']) || typeof row.value !== 'string'
      || !/^[0-9]{13}$/.test(row.value)) return null;
    stamp = Number(row.value);
    if (row.expires_at !== stamp + 7_200_000) return null;
  } else {
    if (!keysAre(row, ['last_cleanup']) || !Number.isSafeInteger(row.last_cleanup)) return null;
    stamp = row.last_cleanup * 1000;
  }
  return validStamp(stamp, target, now) ? stamp : null;
}
function validSnapshot(value, now) {
  return keysAre(value, ['version', 'observedAt', 'lastSuccess']) && value.version === 1
    && Number.isSafeInteger(value.observedAt) && value.observedAt <= now && now - value.observedAt < CACHE_TTL_MS
    && keysAre(value.lastSuccess, ['sharing', 'feedback'])
    && HEALTH_READS.every(t => value.lastSuccess[t.feature] === null || validStamp(value.lastSuccess[t.feature], t, value.observedAt));
}
export function publicHealth(snapshot, now) {
  return Object.fromEntries(HEALTH_READS.map(t => {
    const stamp = snapshot?.lastSuccess[t.feature] ?? null;
    const valid = validStamp(stamp, t, now);
    const age = valid ? now - stamp : Infinity;
    return [t.feature, { lastSuccessAt: valid ? new Date(stamp).toISOString() : null,
      status: !valid ? 'unknown' : age >= 7_200_000 ? 'stale' : age >= 5_400_000 ? 'delayed' : 'ok' }];
  }));
}
function reply(snapshot, now) {
  return new Response(JSON.stringify(publicHealth(snapshot, now)), { status: snapshot ? 200 : 503,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow, noarchive', 'X-Content-Type-Options': 'nosniff',
      ...(!snapshot ? { 'Retry-After': '60' } : {}) } });
}

// The cache is per Cloudflare location; the rate limiter is also per location
// and eventually consistent. Neither is a strict global accounting limit.
export function createPublicHealthWorker({ now = Date.now, cache = () => globalThis.caches?.default } = {}) {
  let memory = null; let pending = null;
  const key = new Request(PUBLIC_HEALTH_URL); // No client-controlled cache key or headers.
  async function refresh(env) {
    let edgeCache;
    try {
      edgeCache = cache();
      if (typeof edgeCache?.match !== 'function' || typeof edgeCache?.put !== 'function') return null;
      const hit = await edgeCache.match(key);
      if (hit) {
        const text = await hit.text();
        const snapshot = text.length <= 1024 ? JSON.parse(text) : null;
        if (validSnapshot(snapshot, now())) { memory = snapshot; return snapshot; }
      }
    } catch { return null; } // Missing/failed cache never falls through to D1.
    try {
      if ((await env.HEALTH_READ_LIMIT?.limit({ key: READ_LIMIT_KEY }))?.success !== true) return null;
    } catch { return null; } // Missing/failed limiter never falls through to D1.
    const stamps = await Promise.all(HEALTH_READS.map(async target => {
      try {
        const result = await env[target.binding].prepare(target.sql).all();
        return successStamp(target, result, now());
      } catch { return null; } // No raw SQL, row or provider error enters output/logs.
    }));
    const snapshot = { version: 1, observedAt: now(),
      lastSuccess: Object.fromEntries(HEALTH_READS.map((t, i) => [t.feature, stamps[i]])) };
    memory = snapshot;
    try {
      await edgeCache?.put(key, new Response(JSON.stringify(snapshot), {
        headers: { 'Content-Type': 'application/json', 'Cache-Control': `public, max-age=${CACHE_TTL_MS / 1000}` },
      }));
    } catch { /* In-isolate cache and the mandatory rate limit remain active. */ }
    return snapshot;
  }
  return Object.freeze({ async fetch(request, env) {
    if (request.method !== 'GET' || request.url !== PUBLIC_HEALTH_URL)
      return new Response('Not found', { status: 404, headers: { 'Cache-Control': 'no-store' } });
    if (validSnapshot(memory, now())) return reply(memory, now());
    // Concurrent requests in the same isolate share one refresh, including errors.
    if (!pending) pending = refresh(env).finally(() => { pending = null; });
    return reply(await pending, now());
  } });
}
export default createPublicHealthWorker();
