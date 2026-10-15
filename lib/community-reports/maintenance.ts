import type { ReportsEnv } from './service';
import { cleanupReports } from './retention';
import { callGuard } from './guard-client';

export type MaintenanceEnv = ReportsEnv & { REPORTS_MONITOR_URL?: string };
// The receiver must accept this documented JSON heartbeat and alert if it stops.
// URLs can contain a receiver credential; never log the URL or request errors.
async function notify(
  env: MaintenanceEnv,
  state: 'ok' | 'error',
  now: number,
  fetcher: typeof fetch,
) {
  if (!env.REPORTS_MONITOR_URL) throw Error('monitor-unconfigured');
  const url = new URL(env.REPORTS_MONITOR_URL);
  if (url.protocol !== 'https:' || url.username || url.password || url.hash)
    throw Error('monitor-config');
  const r = await fetcher(url.href, {
    method: 'POST',
    redirect: 'error',
    signal: AbortSignal.timeout(5000),
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      feature: 'community-reports-cleanup',
      state,
      checkedAt: new Date(now * 1000).toISOString(),
    }),
  });
  if (!r.ok) throw Error('monitor-unavailable');
  await r.body?.cancel();
}
// Shared erasure phase only: no notification, collection or healthy guard stamp.
export async function eraseReportsContent(
  env: MaintenanceEnv,
  now = Math.floor(Date.now() / 1000),
) {
  if (!env.REPORTS_DB) throw Error('Separate REPORTS_DB required');
  const rows = await env.REPORTS_DB.prepare(
    'SELECT id,expires_at,state FROM community_reports LIMIT 201',
  ).all<{ id: string; expires_at: number; state: string }>();
  if (!rows.success || rows.results.length > 200) throw Error('storage');
  const guard = await callGuard(env, '/check', {
    ids: rows.results.map((r) => r.id),
  });
  if (
    rows.results.some(
      (r) =>
        r.expires_at > now &&
        r.state !== 'deleted' &&
        !guard.known.includes(r.id),
    )
  )
    throw Error('ledger-integrity');
  const blocked = JSON.stringify(guard.blocked);
  const erased = await env.REPORTS_DB.batch([
    env.REPORTS_DB.prepare(
      "UPDATE community_reports SET state='deleted',content_json='{}',public_json=NULL,approved_revision=NULL WHERE id IN (SELECT value FROM json_each(?))",
    ).bind(blocked),
    env.REPORTS_DB.prepare(
      "UPDATE community_revisions SET content_json='{}',payload_hash='' WHERE report_id IN (SELECT value FROM json_each(?))",
    ).bind(blocked),
    env.REPORTS_DB.prepare(
      'UPDATE community_audit SET evidence_json=NULL WHERE report_id IN (SELECT value FROM json_each(?))',
    ).bind(blocked),
    env.REPORTS_DB.prepare(
      'DELETE FROM community_flags WHERE report_id IN (SELECT value FROM json_each(?))',
    ).bind(blocked),
    env.REPORTS_DB.prepare(
      'UPDATE community_article_refs SET withdrawal_at=?,completed_at=NULL WHERE report_id IN (SELECT value FROM json_each(?)) AND withdrawal_at IS NULL',
    ).bind(now, blocked),
  ]);
  if (erased.length !== 5 || erased.some((r) => !r.success))
    throw Error('storage');
  await cleanupReports(env.REPORTS_DB, now);
}
export async function runReportsMaintenance(
  env: MaintenanceEnv,
  now = Math.floor(Date.now() / 1000),
  fetcher: typeof fetch = fetch,
) {
  if (!env.REPORTS_DB) throw Error('Separate REPORTS_DB required');
  try {
    await eraseReportsContent(env, now);
    if (env.REPORTS_MONITOR_MODE === 'public-status') {
      if (
        env.REPORTS_PUBLIC_MONITOR_VERIFIED !== 'true' ||
        env.REPORTS_AUTO_OBSERVATION_ENABLED !== 'true'
      )
        throw Error('monitor-unverified');
      await callGuard(env, '/operation', {
        kind: 'cleanup',
        at: now,
        ok: true,
      });
      return;
    }
    await notify(env, 'ok', now, fetcher);
    const r = await env.REPORTS_DB.prepare(
      "INSERT INTO community_operations(key,value) VALUES('monitor',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value",
    )
      .bind(String(now))
      .run();
    if (!r.success) throw Error('monitor-receipt');
  } catch {
    try {
      await callGuard(env, '/operation', {
        kind: 'cleanup',
        at: now,
        ok: false,
      });
    } catch {
      /* Health cannot claim success when the guard is down. */
    }
    try {
      await env.REPORTS_DB.prepare(
        "INSERT INTO community_operations(key,value) VALUES('monitor','0') ON CONFLICT(key) DO UPDATE SET value='0'",
      ).run();
    } catch {
      /* Runtime observation and heartbeat expiry still close intake. */
    }
    try {
      if (env.REPORTS_MONITOR_MODE !== 'public-status')
        await notify(env, 'error', now, fetcher);
    } catch {
      /* No receiver URL, payload or secrets in logs. */
    }
    console.error('community_reports_maintenance_failed');
    throw Error('Community reports maintenance failed');
  }
}
