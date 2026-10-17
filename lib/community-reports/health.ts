import { FREE_BUDGET_MODE } from './admission';
import { callGuard } from './guard-client';
import { type ReportsEnv, reportHeaders } from './service';
const reply = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), { status, headers: reportHeaders });
const iso = (at: unknown, now: number) =>
  typeof at === 'number' &&
  Number.isSafeInteger(at) &&
  at >= 0 &&
  at <= now * 1000
    ? new Date(at).toISOString()
    : null;
// Public read-only health. No initialization/pruning, quotas, GraphQL, lease
// renewal, report rows, credentials, counts or database identities are read.
export async function reportsHealth(
  request: Request,
  env: ReportsEnv,
  now = Math.floor(Date.now() / 1000),
) {
  const url = new URL(request.url);
  if (request.method !== 'GET') return reply({ error: 'method' }, 405);
  if (url.search) return reply({ error: 'input' }, 400);
  let reason: string | null = null,
    observedAt: string | null = null,
    validUntil: string | null = null,
    cleanupAt: string | null = null;
  const freeBudget = env.REPORTS_BUDGET_MODE === FREE_BUDGET_MODE;
  const configured =
    (!env.REPORTS_BUDGET_MODE || freeBudget) &&
    !!env.REPORTS_DB &&
    !!env.REPORTS_GUARD &&
    !!env.REPORTS_GUARD_INSTANCE &&
    (freeBudget ||
      (env.REPORTS_AUTO_OBSERVATION_ENABLED === 'true' &&
        env.REPORTS_USAGE_PROFILE_VERIFIED === 'true')) &&
    env.REPORTS_MONITOR_MODE === 'public-status';
  if (!configured) reason = 'not-configured';
  else if (env.REPORTS_PUBLIC_MONITOR_VERIFIED !== 'true')
    reason = 'monitor-unverified';
  else
    try {
      const g = await callGuard(env, '/health', {});
      observedAt = freeBudget ? null : iso(g.observedAt, now);
      validUntil =
        !freeBudget &&
        typeof g.expiresAt === 'number' &&
        Number.isSafeInteger(g.expiresAt) &&
        g.expiresAt >= 0 &&
        g.expiresAt <= (now + 1800) * 1000
          ? new Date(g.expiresAt).toISOString()
          : null;
      cleanupAt = iso(g.cleanup ? g.cleanup.at * 1000 : null, now);
      if (freeBudget) {
        if (!g.ready) reason = 'budget-unavailable';
        else if (!g.budgetAvailable) reason = 'daily-budget';
      } else if (
        !g.ready ||
        !g.automatic ||
        !observedAt ||
        !validUntil ||
        Date.parse(validUntil) < now * 1000
      )
        reason = ['usage-stale', 'usage-limit'].includes(g.reason || '')
          ? g.reason
          : 'usage-unavailable';
      const rows = await env
        .REPORTS_DB!.prepare(
          "SELECT value FROM community_operations WHERE key='cleanup'",
        )
        .first<{ value: string }>();
      const stamp = Number(rows?.value);
      if (
        !g.cleanup?.ok ||
        !cleanupAt ||
        !Number.isSafeInteger(stamp) ||
        stamp > now ||
        stamp < now - 7200 ||
        g.cleanup.at < now - 7200
      )
        reason = 'cleanup-unavailable';
    } catch {
      reason = 'storage-unavailable';
    }
  const intakeEnabled =
    !reason &&
    env.REPORTS_ENABLED === 'true' &&
    env.REPORTS_BUDGET_VERIFIED === 'true';
  const publicEnabled =
    !reason &&
    env.REPORTS_PUBLIC_ENABLED === 'true' &&
    env.REPORTS_BUDGET_VERIFIED === 'true';
  if (!reason && (!intakeEnabled || !publicEnabled)) reason = 'intake-disabled';
  return reply(
    {
      schemaVersion: freeBudget ? 2 : 1,
      ...(freeBudget ? { budgetMode: FREE_BUDGET_MODE } : {}),
      ok: reason === null,
      intakeEnabled: !!intakeEnabled,
      publicEnabled: !!publicEnabled,
      checkedAt: new Date(now * 1000).toISOString(),
      observedAt,
      validUntil,
      cleanupAt,
      reason,
    },
    reason ? 503 : 200,
  );
}
