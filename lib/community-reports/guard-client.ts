import { ID } from './ids';
import { FREE_BUDGET_MODE, type AdmissionKind } from './admission';
export type GuardEnv = {
  REPORTS_BUDGET_MODE?: string;
  REPORTS_GUARD?: Fetcher;
  REPORTS_GUARD_INSTANCE?: string;
  REPORTS_AUTO_OBSERVATION_ENABLED?: string;
};
export class GuardFailure extends Error {
  constructor(
    public status: number,
    code: string,
  ) {
    super(code);
  }
}
export async function callGuard(
  env: GuardEnv,
  path:
    | '/initialize'
    | '/check'
    | '/reserve'
    | '/delete'
    | '/observe'
    | '/health'
    | '/operation'
    | '/admit',
  input: Record<string, unknown>,
) {
  if (
    !env.REPORTS_GUARD ||
    (path !== '/initialize' && !env.REPORTS_GUARD_INSTANCE)
  )
    throw new GuardFailure(503, 'unavailable');
  const r = await env.REPORTS_GUARD.fetch(
    new Request('https://reports-guard.internal' + path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(path === '/initialize'
          ? {}
          : { 'X-Report-Instance': env.REPORTS_GUARD_INSTANCE! }),
      },
      body: JSON.stringify(input),
      signal: AbortSignal.timeout(5000),
    }),
  );
  const d = (await r.json()) as {
    budgetMode?: string | null;
    budgetAvailable?: boolean;
    ok?: boolean;
    error?: string;
    known?: string[];
    blocked?: string[];
    instanceId?: string;
    ready?: boolean;
    automatic?: boolean;
    observedAt?: number | null;
    expiresAt?: number | null;
    reason?: string | null;
    collection?: { at: number; ok: boolean } | null;
    cleanup?: { at: number; ok: boolean } | null;
  };
  if (!r.ok || d.ok !== true)
    throw new GuardFailure(
      [409, 410, 429].includes(r.status) ? r.status : 503,
      [
        'deleted',
        'expired',
        'capacity',
        'daily-budget',
        'old-observation',
        'conflicting-observation',
      ].includes(d.error || '')
        ? d.error!
        : 'unavailable',
    );
  if (
    typeof d.instanceId !== 'string' ||
    (path !== '/initialize' && d.instanceId !== env.REPORTS_GUARD_INSTANCE)
  )
    throw new GuardFailure(503, 'unavailable');
  if (path === '/check') {
    const ids = input.ids as string[];
    if (
      typeof d.ready !== 'boolean' ||
      typeof d.automatic !== 'boolean' ||
      !Array.isArray(d.known) ||
      !Array.isArray(d.blocked) ||
      ![...d.known, ...d.blocked].every(
        (id) => ID.test(id) && ids.includes(id),
      ) ||
      d.blocked.some((id) => !d.known!.includes(id))
    )
      throw new GuardFailure(503, 'unavailable');
  }
  if (
    path === '/health' &&
    (typeof d.ready !== 'boolean' || typeof d.automatic !== 'boolean')
  )
    throw new GuardFailure(503, 'unavailable');
  if (
    (path === '/check' || path === '/health') &&
    (env.REPORTS_BUDGET_MODE === FREE_BUDGET_MODE
      ? d.budgetMode !== FREE_BUDGET_MODE ||
        typeof d.budgetAvailable !== 'boolean'
      : d.budgetMode === FREE_BUDGET_MODE ||
        (env.REPORTS_AUTO_OBSERVATION_ENABLED === 'true'
          ? !d.automatic
          : d.automatic))
  )
    d.ready = false;
  if (path === '/admit' && d.budgetMode !== FREE_BUDGET_MODE)
    throw new GuardFailure(503, 'unavailable');
  if (path === '/observe' && typeof d.ready !== 'boolean')
    throw new GuardFailure(503, 'unavailable');
  return d as {
    budgetMode: string | null;
    budgetAvailable: boolean;
    ok: true;
    known: string[];
    blocked: string[];
    instanceId: string;
    ready: boolean;
    automatic: boolean;
    observedAt: number | null;
    expiresAt: number | null;
    reason: string | null;
    collection: { at: number; ok: boolean } | null;
    cleanup: { at: number; ok: boolean } | null;
  };
}

export async function admitReports(env: GuardEnv, kind: AdmissionKind) {
  if (env.REPORTS_BUDGET_MODE === FREE_BUDGET_MODE)
    await callGuard(env, '/admit', { kind });
  else if (env.REPORTS_BUDGET_MODE) throw new GuardFailure(503, 'unavailable');
}
