import { FREE_BUDGET_MODE } from './admission';
import { strictJson } from '../diagnostic-feedback/json';
import { callGuard, GuardFailure } from './guard-client';
import { reportHeaders, type ReportsEnv } from './service';
const reply = (x: unknown, status: number) =>
  new Response(JSON.stringify(x), { status, headers: reportHeaders });
// Manual observations use existing admin auth; no metrics API key is created.
export async function observeReports(
  request: Request,
  env: ReportsEnv,
  admin: () => Promise<boolean>,
) {
  if (request.method !== 'POST') return reply({ error: 'method' }, 405);
  const url = new URL(request.url);
  if (
    request.headers.get('origin') !== url.origin ||
    request.headers.get('sec-fetch-site') === 'cross-site'
  )
    return reply({ error: 'origin' }, 403);
  if (env.REPORTS_REVIEW_ENABLED !== 'true' || !(await admin()))
    return reply({ error: 'unauthorized' }, 401);
  if (
    url.search ||
    !request.headers.get('content-type')?.startsWith('application/json') ||
    !request.body
  )
    return reply({ error: 'input' }, 400);
  try {
    const reader = request.body.getReader();
    let size = 0;
    const chunks: Uint8Array[] = [];
    for (;;) {
      const r = await reader.read();
      if (r.done) break;
      size += r.value.length;
      if (size > 8192) {
        await reader.cancel();
        return reply({ error: 'input' }, 400);
      }
      chunks.push(r.value);
    }
    const bytes = new Uint8Array(size);
    let at = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, at);
      at += chunk.length;
    }
    const input = strictJson(
      new TextDecoder('utf-8', { fatal: true }).decode(bytes),
    ) as { state?: unknown };
    if (
      !input ||
      typeof input !== 'object' ||
      Array.isArray(input) ||
      Object.keys(input).length !== 1 ||
      typeof input.state !== 'string' ||
      input.state.length > 8000
    )
      return reply({ error: 'input' }, 400);
    if (input.state !== '') {
      // Only the internal collector can claim provider-derived observations.
      // In automatic mode this HTTP endpoint is an emergency stop only.
      const state = strictJson(input.state) as {
        usage?: { source?: unknown };
        monitoringVerifiedAt?: unknown;
        monitoringMode?: unknown;
      };
      if (
        env.REPORTS_BUDGET_MODE === FREE_BUDGET_MODE ||
        env.REPORTS_AUTO_OBSERVATION_ENABLED === 'true' ||
        state?.usage?.source !== 'operator-transcribed-dashboard' ||
        typeof state?.monitoringVerifiedAt !== 'string' ||
        state?.monitoringMode !== undefined
      )
        return reply({ error: 'manual-observation-disabled' }, 409);
    }
    const result = await callGuard(env, '/observe', { state: input.state });
    return reply({ ok: true, ready: result.ready }, 200);
  } catch (error) {
    if (error instanceof GuardFailure && error.status === 409)
      return reply({ error: error.message }, 409);
    return reply({ error: 'unavailable' }, 503);
  }
}
