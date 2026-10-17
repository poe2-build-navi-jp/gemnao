import { collectReportsUsage, type CollectorEnv } from './collector';
import { runReportsMaintenance, type MaintenanceEnv } from './maintenance';
import { FREE_BUDGET_MODE } from './admission';
import { callGuard } from './guard-client';
export type CycleEnv = CollectorEnv & MaintenanceEnv;
// One dedicated 15-minute trigger. Cleanup runs initially, hourly, and retries
// after failure. Neither operation depends on the other succeeding.
export async function runReportsCycle(
  env: CycleEnv,
  now = Math.floor(Date.now() / 1000),
  fetcher: typeof fetch = fetch,
  cron = '*/15 * * * *',
) {
  let previous: Awaited<ReturnType<typeof callGuard>> | undefined;
  try {
    previous = await callGuard(env, '/health', {});
  } catch {
    /* Both operations fail closed without the pinned ledger. */
  }
  if (env.REPORTS_BUDGET_MODE && env.REPORTS_BUDGET_MODE !== FREE_BUDGET_MODE)
    return {
      collectionOk: false,
      budgetOk: false,
      cleanupRan: false,
      cleanupOk: false,
    };
  if (env.REPORTS_BUDGET_MODE === FREE_BUDGET_MODE) {
    if (
      !previous ||
      previous.budgetMode !== FREE_BUDGET_MODE ||
      cron !== '*/15 * * * *'
    )
      return {
        collectionOk: null,
        budgetOk: false,
        cleanupRan: false,
        cleanupOk: false,
      };
    const due =
      !previous.cleanup?.ok ||
      previous.cleanup.at > now ||
      previous.cleanup.at <= now - 3600;
    let cleanupOk = !due;
    if (due) {
      try {
        await runReportsMaintenance(env, now, fetcher);
        cleanupOk = true;
      } catch {
        cleanupOk = false;
      }
    }
    return { collectionOk: null, budgetOk: true, cleanupRan: due, cleanupOk };
  }
  if (cron !== '*/15 * * * *') {
    try {
      await callGuard(env, '/observe', { state: '' });
    } catch {
      /* Closed. */
    }
  }
  const collection =
    previous && cron === '*/15 * * * *'
      ? await collectReportsUsage(env, now, fetcher)
      : { ok: false, reason: 'storage' };
  const due =
    !previous?.cleanup?.ok ||
    previous.cleanup.at > now ||
    previous.cleanup.at <= now - 3600;
  let cleanupOk = !due;
  if (due) {
    try {
      await runReportsMaintenance(env, now, fetcher);
      cleanupOk = true;
    } catch {
      cleanupOk = false;
    }
  }
  return { collectionOk: collection.ok, cleanupRan: due, cleanupOk };
}
