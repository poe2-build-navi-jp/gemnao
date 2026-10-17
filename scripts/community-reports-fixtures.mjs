// Synthetic local-only runtime and external storage fixtures. Never deployed.
import { usageLimits } from '../ops/community-reports/operating-plan.mjs';
export function runtimeFixture(now) {
  return JSON.stringify({
    usage: {
      source: 'operator-transcribed-dashboard',
      observedAt: new Date(now * 1000).toISOString(),
      utcDay: new Date(now * 1000).toISOString().slice(0, 10),
      phase: 'after-setup',
      ...Object.fromEntries(Object.keys(usageLimits).map((k) => [k, 0])),
      databaseCount: 4,
      workerCount: 5,
      cronCount: 3,
    },
    monitoringVerifiedAt: new Date(now * 1000).toISOString(),
    restorePolicy: 'no-past-db-restore',
  });
}
export async function guardFixture(Ledger, clock, seedObservation = true, env) {
  const values = new Map();
  let chain = Promise.resolve();
  const control = { fail: false };
  const storage = {
    transaction(fn) {
      const work = chain.then(async () => {
        if (control.fail) throw Error('synthetic external guard unavailable');
        const staged = structuredClone(values);
        const result = await fn({
          async get(k) {
            return structuredClone(staged.get(k));
          },
          async put(k, v) {
            staged.set(k, structuredClone(v));
          },
        });
        values.clear();
        for (const [k, v] of staged) values.set(k, v);
        return result;
      });
      chain = work.catch(() => {});
      return work;
    },
  };
  let ledger = new Ledger({ storage }, env, clock);
  const binding = { fetch: (request) => ledger.fetch(request) };
  const r = await binding.fetch(
    new Request('https://guard.test/initialize', {
      method: 'POST',
      body: '{}',
    }),
  );
  if (!r.ok) throw Error('synthetic initialize failed');
  const instanceId = (await r.json()).instanceId;
  const observe = async (state) =>
    binding.fetch(
      new Request('https://guard.test/observe', {
        method: 'POST',
        headers: { 'X-Report-Instance': instanceId },
        body: JSON.stringify({ state }),
      }),
    );
  if (seedObservation) await observe(runtimeFixture(clock()));
  return {
    binding,
    control,
    values,
    instanceId,
    observe,
    restart() {
      ledger = new Ledger({ storage }, env, clock);
    },
  };
}
