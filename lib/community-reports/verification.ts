import { strictJson } from '../diagnostic-feedback/json';
import { ID } from './ids';
import { callGuard, admitReports } from './guard-client';
import { eraseReportsContent, type MaintenanceEnv } from './maintenance';
import { reportHeaders } from './service';

export type VerificationEnv = MaintenanceEnv & {
  REPORTS_VERIFICATION_ALLOWED?: string;
  REPORTS_VERIFICATION_DB_ID?: string;
  REPORTS_BOOTSTRAP_ALLOWED?: string;
};
const UUID = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
const closedFlags = [
  'REPORTS_ENABLED',
  'REPORTS_PUBLIC_ENABLED',
  'REPORTS_REVIEW_ENABLED',
  'REPORTS_BUDGET_VERIFIED',
  'REPORTS_AUTO_OBSERVATION_ENABLED',
  'REPORTS_USAGE_PROFILE_VERIFIED',
  'REPORTS_PUBLIC_MONITOR_VERIFIED',
  'REPORTS_BOOTSTRAP_ALLOWED',
] as const;
const reply = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), { status, headers: reportHeaders });
async function input(request: Request) {
  if (
    !request.headers.get('content-type')?.startsWith('application/json') ||
    !request.body
  )
    throw Error('input');
  const reader = request.body.getReader(),
    chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const part = await reader.read();
    if (part.done) break;
    size += part.value.byteLength;
    if (size > 512) {
      await reader.cancel();
      throw Error('input');
    }
    chunks.push(part.value);
  }
  const bytes = new Uint8Array(size);
  let at = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, at);
    at += chunk.length;
  }
  const value = strictJson(
    new TextDecoder('utf8', { fatal: true }).decode(bytes),
  );
  if (
    !value ||
    typeof value !== 'object' ||
    Array.isArray(value) ||
    Object.keys(value).length !== 2 ||
    !Object.hasOwn(value, 'operation') ||
    !Object.hasOwn(value, 'fixtureId')
  )
    throw Error('input');
  const body = value as { operation: unknown; fixtureId: unknown };
  if (
    !['inspect', 'erase'].includes(body.operation as string) ||
    typeof body.fixtureId !== 'string' ||
    !ID.test(body.fixtureId)
  )
    throw Error('input');
  return body as { operation: 'inspect' | 'erase'; fixtureId: string };
}
// Prelaunch, existing-admin-only verification. This does not initialize storage,
// create reports, restore D1, observe usage, enable intake, or send notifications.
// The UUID sentinel must be installed only after provider-side binding readback;
// it guards accidental rebinding and is not proof of provider identity by itself.
export async function verifyClosedReports(
  request: Request,
  env: VerificationEnv,
  admin: () => Promise<boolean>,
  now = Math.floor(Date.now() / 1000),
) {
  const url = new URL(request.url);
  if (request.method !== 'POST') return reply({ error: 'method' }, 405);
  if (
    request.headers.get('origin') !== url.origin ||
    (request.headers.get('sec-fetch-site') &&
      request.headers.get('sec-fetch-site') !== 'same-origin')
  )
    return reply({ error: 'origin' }, 403);
  if (url.search) return reply({ error: 'input' }, 400);
  try {
    if (!(await admin())) return reply({ error: 'unauthorized' }, 401);
    if (
      env.REPORTS_VERIFICATION_ALLOWED !== 'true' ||
      closedFlags.some((flag) => env[flag] === 'true')
    )
      return reply({ error: 'verification-closed' }, 409);
    if (
      !env.REPORTS_DB ||
      !env.REPORTS_GUARD ||
      !UUID.test(env.REPORTS_GUARD_INSTANCE || '') ||
      !UUID.test(env.REPORTS_VERIFICATION_DB_ID || '')
    )
      return reply({ error: 'unavailable' }, 503);
    const body = await input(request).catch(() => null);
    if (!body) return reply({ error: 'input' }, 400);
    await admitReports(env, body.operation === 'erase' ? 'cleanup' : 'admin');
    const operations = await env.REPORTS_DB.prepare(
      "SELECT key,value FROM community_operations WHERE key IN ('total','verification-db-id')",
    ).all<{ key: string; value: string }>();
    const rows = await env.REPORTS_DB.prepare(
      'SELECT id FROM community_reports LIMIT 2',
    ).all<{ id: string }>();
    if (!operations.success || !rows.success) throw Error('storage');
    if (
      operations.results.find((row) => row.key === 'total')?.value !== '0' ||
      operations.results.find((row) => row.key === 'verification-db-id')
        ?.value !== env.REPORTS_VERIFICATION_DB_ID ||
      rows.results.length > 1 ||
      rows.results.some((row) => row.id !== body.fixtureId)
    )
      return reply({ error: 'fixture-scope' }, 409);
    const health = await callGuard(env, '/health', {});
    if (health.ready || health.automatic)
      return reply({ error: 'runtime-not-closed' }, 409);
    if (body.operation === 'inspect')
      return reply(
        {
          ok: true,
          operation: 'inspect',
          closed: true,
          bindingsChecked: true,
          fixturePresent: rows.results.length === 1,
          fixtureErased: null,
          operationalHealthVerified: false,
          authorizesActivation: false,
        },
        200,
      );
    if (rows.results.length !== 1)
      return reply({ error: 'fixture-missing' }, 409);
    const guard = await callGuard(env, '/check', { ids: [body.fixtureId] });
    if (
      !guard.known.includes(body.fixtureId) ||
      !guard.blocked.includes(body.fixtureId)
    )
      return reply({ error: 'fixture-not-deleted' }, 409);
    await eraseReportsContent(env, now);
    const remaining = await env.REPORTS_DB.prepare(
      "SELECT (SELECT count(*) FROM community_reports WHERE id=? AND (content_json<>'{}' OR public_json IS NOT NULL OR state<>'deleted'))+(SELECT count(*) FROM community_revisions WHERE report_id=? AND (content_json<>'{}' OR payload_hash<>''))+(SELECT count(*) FROM community_audit WHERE report_id=? AND evidence_json IS NOT NULL) AS n",
    )
      .bind(body.fixtureId, body.fixtureId, body.fixtureId)
      .first<{ n: number }>();
    if (remaining?.n !== 0) throw Error('storage');
    return reply(
      {
        ok: true,
        operation: 'erase',
        closed: true,
        bindingsChecked: true,
        fixtureErased: true,
        operationalHealthVerified: false,
        authorizesActivation: false,
      },
      200,
    );
  } catch {
    return reply({ error: 'unavailable' }, 503);
  }
}
