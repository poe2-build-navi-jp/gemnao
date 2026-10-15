import { strictJson } from '../diagnostic-feedback/json';
import { assessUsage } from '../../ops/community-reports/operating-plan.mjs';
export type RuntimeState = {
  usage: Record<string, unknown>;
  restorePolicy: 'no-past-db-restore';
} & ({ monitoringVerifiedAt: string } | { monitoringMode: 'public-status' });
function stateRecord(raw: string | undefined, now: number) {
  if (!raw || raw.length > 8192 || !Number.isSafeInteger(now)) return null;
  try {
    const s = strictJson(raw) as RuntimeState;
    if (
      !s ||
      typeof s !== 'object' ||
      Array.isArray(s) ||
      Object.keys(s).length !== 3 ||
      s.restorePolicy !== 'no-past-db-restore' ||
      s.usage?.phase !== 'after-setup' ||
      assessUsage(s.usage, now * 1000).reasons.includes(
        'invalid-or-missing-usage',
      )
    )
      return null;
    if ('monitoringMode' in s) {
      if (
        s.monitoringMode !== 'public-status' ||
        s.usage.source !== 'cloudflare-graphql'
      )
        return null;
    } else {
      const verified = Date.parse(s.monitoringVerifiedAt);
      if (
        s.usage.source !== 'operator-transcribed-dashboard' ||
        !Number.isFinite(verified) ||
        new Date(verified).toISOString() !== s.monitoringVerifiedAt ||
        verified > now * 1000
      )
        return null;
    }
    const at = Date.parse(s.usage.observedAt as string);
    if (
      !Number.isFinite(at) ||
      new Date(at).toISOString() !== s.usage.observedAt ||
      at > now * 1000 ||
      s.usage.utcDay !== new Date(at).toISOString().slice(0, 10)
    )
      return null;
    return { state: s, at };
  } catch {
    return null;
  }
}
// Even stopped observations keep their timestamp. Invalid/future input cannot
// advance the durable watermark beyond the server clock.
export function runtimeObservationAt(raw: string | undefined, now: number) {
  return stateRecord(raw, now)?.at ?? null;
}
export function runtimeAutomatic(raw: string | undefined, now: number) {
  return stateRecord(raw, now)?.state.usage.source === 'cloudflare-graphql';
}
export function runtimeFailure(raw: string | undefined, now: number) {
  const s = stateRecord(raw, now);
  if (!s) return 'usage-unavailable';
  const reasons = assessUsage(s.state.usage, now * 1000).reasons;
  if (
    reasons.some(
      (r: string) => r.includes('80-percent') || r.includes('no-free-slot'),
    )
  )
    return 'usage-limit';
  if (reasons.length) return 'usage-stale';
  if (
    'monitoringVerifiedAt' in s.state &&
    Date.parse(s.state.monitoringVerifiedAt) < (now - 86400) * 1000
  )
    return 'monitor-unverified';
  return null;
}
export function runtimeStateReady(raw: string | undefined, now: number) {
  return runtimeFailure(raw, now) === null;
}
