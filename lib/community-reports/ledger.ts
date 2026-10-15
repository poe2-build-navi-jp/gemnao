import { strictJson } from '../diagnostic-feedback/json';
import { ID } from './ids';
import {
  runtimeObservationAt,
  runtimeStateReady,
  runtimeAutomatic,
  runtimeFailure,
} from './runtime';
type Entry = { expiresAt: number; accepted: boolean; blocked: boolean };
type Ledger = {
  version: 1;
  instanceId: string;
  total: number;
  entries: Record<string, Entry>;
  runtime?: string;
  observation?: { at: number; raw: string | null; conflict: boolean };
  operations?: Partial<
    Record<'collection' | 'cleanup', { at: number; ok: boolean }>
  >;
};
const reply = (x: unknown, status = 200) =>
  new Response(JSON.stringify(x), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
// Only IDs and their last possible expiry; never report bodies or owner keys.
// Separate from D1, so restoring D1 cannot remove a completed deletion marker.
export class CommunityReportLedger {
  constructor(
    private state: DurableObjectState,
    _env?: unknown,
    private clock = () => Math.floor(Date.now() / 1000),
  ) {}
  async fetch(request: Request) {
    const path = new URL(request.url).pathname,
      now = this.clock();
    if (
      request.method !== 'POST' ||
      ![
        '/initialize',
        '/check',
        '/reserve',
        '/delete',
        '/observe',
        '/health',
        '/operation',
      ].includes(path)
    )
      return reply({ error: 'method' }, 405);
    const raw = await request.text();
    if (raw.length > 8192) return reply({ error: 'input' }, 400);
    let input: {
      ids?: unknown;
      id?: unknown;
      state?: unknown;
      kind?: unknown;
      at?: unknown;
      ok?: unknown;
    };
    try {
      input = strictJson(raw) as typeof input;
    } catch {
      return reply({ error: 'input' }, 400);
    }
    if (!input || typeof input !== 'object' || Array.isArray(input))
      return reply({ error: 'input' }, 400);
    const ids = path === '/check' ? input.ids : input.id;
    if (
      path === '/initialize' || path === '/health'
        ? Object.keys(input).length !== 0
        : path === '/operation'
          ? Object.keys(input).length !== 3 ||
            !['collection', 'cleanup'].includes(input.kind as string) ||
            !Number.isSafeInteger(input.at) ||
            (input.at as number) < 0 ||
            (input.at as number) > now ||
            typeof input.ok !== 'boolean'
          : path === '/observe'
            ? Object.keys(input).length !== 1 ||
              typeof input.state !== 'string' ||
              input.state.length > 8000
            : path === '/check'
              ? Object.keys(input).length !== 1 ||
                !Array.isArray(ids) ||
                ids.length > 200 ||
                !ids.every((x) => typeof x === 'string' && ID.test(x))
              : Object.keys(input).length !== 1 ||
                typeof ids !== 'string' ||
                !ID.test(ids)
    )
      return reply({ error: 'input' }, 400);
    try {
      return await this.state.storage.transaction(async (store) => {
        let ledger = await store.get<Ledger>('ledger');
        if (path === '/initialize') {
          if (ledger) return reply({ ok: true, instanceId: ledger.instanceId });
          ledger = {
            version: 1,
            instanceId: crypto.randomUUID(),
            total: 0,
            entries: {},
          };
          await store.put('ledger', ledger);
          return reply({ ok: true, instanceId: ledger.instanceId });
        }
        if (
          !ledger ||
          ledger.version !== 1 ||
          typeof ledger.instanceId !== 'string' ||
          !Number.isInteger(ledger.total) ||
          ledger.total < 0 ||
          ledger.total > 100 ||
          !ledger.entries
        )
          return reply({ error: 'uninitialized' }, 503);
        if (request.headers.get('x-report-instance') !== ledger.instanceId)
          return reply({ error: 'instance-mismatch' }, 503);
        if (path === '/operation') {
          const kind = input.kind as 'collection' | 'cleanup',
            at = input.at as number,
            previous = ledger.operations?.[kind];
          // Old completions never erase a newer failure; same-time failure wins.
          if (
            !previous ||
            at > previous.at ||
            (at === previous.at && input.ok === false)
          ) {
            ledger.operations ||= {};
            ledger.operations[kind] = { at, ok: input.ok as boolean };
            await store.put('ledger', ledger);
          }
          return reply({ ok: true, instanceId: ledger.instanceId });
        }
        const automatic = runtimeAutomatic(ledger.runtime, now),
          collection = ledger.operations?.collection;
        const cleanup = ledger.operations?.cleanup;
        const ready =
          runtimeStateReady(ledger.runtime, now) &&
          (!automatic ||
            (!!collection?.ok &&
              collection.at <= now &&
              collection.at >= now - 1800 &&
              !!cleanup?.ok &&
              cleanup.at <= now &&
              cleanup.at >= now - 7200));
        if (path === '/health') {
          const observedAt = runtimeObservationAt(
            ledger.observation?.raw ?? undefined,
            now,
          );
          // Pure storage read: no pruning, initialization or timestamp writes.
          return reply({
            ok: true,
            instanceId: ledger.instanceId,
            ready,
            automatic,
            observedAt,
            expiresAt: observedAt !== null ? observedAt + 1800000 : null,
            reason:
              runtimeFailure(ledger.observation?.raw ?? undefined, now) ||
              (!ready ? 'usage-unavailable' : null),
            collection: collection ?? null,
            cleanup: ledger.operations?.cleanup ?? null,
          });
        }
        if (path === '/observe') {
          const raw = input.state as string,
            at = runtimeObservationAt(raw, now),
            previous = ledger.observation;
          if (at !== null && previous && at < previous.at)
            return reply({ error: 'old-observation' }, 409);
          if (at !== null && previous && at === previous.at) {
            if (previous.raw === raw && !previous.conflict)
              return reply({
                ok: true,
                instanceId: ledger.instanceId,
                ready: runtimeStateReady(ledger.runtime, now),
              });
            // Conflicting measurements cannot reopen intake, even when an
            // earlier identical low-usage record is retried afterwards.
            previous.conflict = true;
            ledger.runtime = '';
            await store.put('ledger', ledger);
            return reply({ error: 'conflicting-observation' }, 409);
          }
          const ready = at !== null && runtimeStateReady(raw, now);
          ledger.runtime = ready ? raw : '';
          ledger.observation = {
            at: at ?? Math.max(previous?.at ?? 0, now * 1000),
            raw: at === null ? null : raw,
            conflict: at === null,
          };
          await store.put('ledger', ledger);
          return reply({ ok: true, instanceId: ledger.instanceId, ready });
        }
        let pruned = false;
        for (const [key, entry] of Object.entries(ledger.entries))
          if (entry.expiresAt <= now) {
            delete ledger.entries[key];
            pruned = true;
          }
        if (pruned) await store.put('ledger', ledger);
        if (path === '/check')
          return reply({
            ok: true,
            instanceId: ledger.instanceId,
            ready,
            automatic,
            known: (ids as string[]).filter(
              (id) => ledger!.entries[id]?.expiresAt > now,
            ),
            blocked: (ids as string[]).filter(
              (id) =>
                ledger!.entries[id]?.expiresAt > now &&
                ledger!.entries[id].blocked,
            ),
          });
        const id = ids as string,
          issued = parseInt(id.slice(0, 8), 16);
        if (issued > now + 300 || issued < now - 31 * 86400)
          return reply({ error: 'expired' }, 410);
        for (const [key, entry] of Object.entries(ledger.entries))
          if (entry.expiresAt <= now) delete ledger.entries[key];
        let entry = ledger.entries[id];
        if (path === '/reserve') {
          if (entry?.blocked) return reply({ error: 'deleted' }, 409);
          if (!entry?.accepted) {
            if (issued < now - 86400) return reply({ error: 'expired' }, 410);
            if (ledger.total >= 100) return reply({ error: 'capacity' }, 429);
            ledger.total++;
            entry = {
              expiresAt: issued + 31 * 86400,
              accepted: true,
              blocked: false,
            };
            ledger.entries[id] = entry;
          }
        } else {
          if (!entry && Object.keys(ledger.entries).length >= 300)
            return reply({ error: 'capacity' }, 429);
          entry ||= {
            expiresAt: issued + 31 * 86400,
            accepted: false,
            blocked: true,
          };
          entry.blocked = true;
          ledger.entries[id] = entry;
        }
        await store.put('ledger', ledger);
        return reply({ ok: true, instanceId: ledger.instanceId });
      });
    } catch {
      return reply({ error: 'unavailable' }, 503);
    }
  }
}
