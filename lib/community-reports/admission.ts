// A small application allowance, not an account-wide provider quota/reservation.
export const FREE_BUDGET_MODE = 'free-small-v1';
export const dailyLimits = {
  general: 128,
  deletion: 32,
  admin: 32,
  cleanup: 48,
} as const;
export type AdmissionKind = keyof typeof dailyLimits;
export type DailyBudget = {
  day: number;
  lastAt: number;
  used: Record<AdmissionKind, number>;
};
export function validBudget(value: DailyBudget, now: number) {
  return (
    value &&
    Number.isSafeInteger(value.day) &&
    value.day >= 0 &&
    Number.isSafeInteger(value.lastAt) &&
    value.lastAt >= 0 &&
    value.lastAt <= now &&
    Math.floor(value.lastAt / 86400) === value.day &&
    value.used &&
    Object.keys(value.used).length === 4 &&
    Object.entries(dailyLimits).every(([key, limit]) => {
      const used = value.used[key as AdmissionKind];
      return Number.isSafeInteger(used) && used >= 0 && used <= limit;
    })
  );
}
export function freshBudget(now: number): DailyBudget {
  return {
    day: Math.floor(now / 86400),
    lastAt: now,
    used: { general: 0, deletion: 0, admin: 0, cleanup: 0 },
  };
}
