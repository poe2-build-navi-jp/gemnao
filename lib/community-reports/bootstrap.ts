import { callGuard } from './guard-client';
import { reportHeaders, type ReportsEnv } from './service';
type BootstrapEnv = ReportsEnv & { REPORTS_BOOTSTRAP_ALLOWED?: string };
const reply = (value: unknown, status: number) =>
  new Response(JSON.stringify(value), { status, headers: reportHeaders });
// An explicit one-time setup, never called by cleanup or ordinary requests.
// The returned UUID identifies storage; it is not an authentication credential.
export async function bootstrapReports(
  request: Request,
  env: BootstrapEnv,
  admin: () => Promise<boolean>,
) {
  if (request.method !== 'POST') return reply({ error: 'method' }, 405);
  const url = new URL(request.url);
  if (
    request.headers.get('origin') !== url.origin ||
    request.headers.get('sec-fetch-site') === 'cross-site'
  )
    return reply({ error: 'origin' }, 403);
  if (url.search) return reply({ error: 'input' }, 400);
  // workerd can expose an empty stream for a bodyless HTTP POST. Inspect the
  // stream instead of treating its presence as submitted data; reject the first
  // chunk and never parse or accept a payload for this one-time operation.
  if (request.body) {
    const reader = request.body.getReader();
    try {
      if (!(await reader.read()).done) {
        await reader.cancel();
        return reply({ error: 'input' }, 400);
      }
    } catch {
      return reply({ error: 'input' }, 400);
    } finally {
      reader.releaseLock();
    }
  }
  if (!(await admin())) return reply({ error: 'unauthorized' }, 401);
  if (
    env.REPORTS_BOOTSTRAP_ALLOWED !== 'true' ||
    env.REPORTS_GUARD_INSTANCE ||
    [
      env.REPORTS_ENABLED,
      env.REPORTS_PUBLIC_ENABLED,
      env.REPORTS_BUDGET_VERIFIED,
    ].includes('true')
  )
    return reply({ error: 'setup-closed' }, 409);
  if (!env.REPORTS_DB || !env.REPORTS_GUARD)
    return reply({ error: 'unavailable' }, 503);
  try {
    const rows = await env.REPORTS_DB.prepare(
      'SELECT count(*) AS n FROM community_reports',
    ).first<{ n: number }>();
    if (rows?.n !== 0) return reply({ error: 'database-not-empty' }, 409);
    const result = await callGuard(env, '/initialize', {});
    return reply({ ok: true, instanceId: result.instanceId }, 200);
  } catch {
    return reply({ error: 'unavailable' }, 503);
  }
}
