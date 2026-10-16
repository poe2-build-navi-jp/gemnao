import { ID, SECRET, type Content } from './model';
export const REPORT_OWNER_KEY = 'gemnao-report-owner-v1';
export const REPORT_DRAFT_KEY = 'gemnao-report-draft-v1';
export type Pending = {
  method: 'POST' | 'PATCH' | 'DELETE';
  path: string;
  body: Record<string, unknown>;
};
export type Ticket = {
  id: string;
  key: string;
  gameSlug: string;
  createdAt: number;
  pending: Pending | null;
};
type Store = Pick<Storage, 'getItem' | 'setItem'>;
export function randomHex(bytes = 16) {
  return Array.from(crypto.getRandomValues(new Uint8Array(bytes)), (v) =>
    v.toString(16).padStart(2, '0'),
  ).join('');
}
export function readTickets(storage: Store): Ticket[] {
  const raw = storage.getItem(REPORT_OWNER_KEY);
  if (raw === null) return [];
  const x = JSON.parse(raw);
  if (x?.version !== 1 || !Array.isArray(x.tickets) || x.tickets.length > 100)
    throw Error('local');
  const ids = new Set();
  for (const t of x.tickets) {
    if (
      !ID.test(t?.id) ||
      !SECRET.test(t?.key) ||
      typeof t.gameSlug !== 'string' ||
      !Number.isFinite(t.createdAt) ||
      ids.has(t.id)
    )
      throw Error('local');
    ids.add(t.id);
    if (
      t.pending !== null &&
      (!t.pending ||
        !['POST', 'PATCH', 'DELETE'].includes(t.pending.method) ||
        !/^\/api\/reports(?:\/[a-f0-9]{32})?$/.test(t.pending.path) ||
        !t.pending.body ||
        !ID.test(t.pending.body.requestId))
    )
      throw Error('local');
  }
  return x.tickets;
}
export function writeTickets(storage: Store, tickets: Ticket[]) {
  const raw = JSON.stringify({ version: 1, tickets });
  const test = { getItem: () => raw, setItem: () => {} };
  readTickets(test);
  storage.setItem(REPORT_OWNER_KEY, raw);
}
export async function prepareCreate(
  storage: Store,
  content: Content,
  now = Math.floor(Date.now() / 1000),
) {
  const tickets = readTickets(storage);
  if (tickets.length >= 100) throw Error('local');
  const key = randomHex(32);
  const hash = Array.from(
    new Uint8Array(
      await crypto.subtle.digest('SHA-256', new TextEncoder().encode(key)),
    ),
    (v) => v.toString(16).padStart(2, '0'),
  ).join('');
  const id = now.toString(16).padStart(8, '0') + hash.slice(0, 24);
  const ticket: Ticket = {
    id,
    key,
    gameSlug: content.articlePath.split('/')[2],
    createdAt: now,
    pending: {
      method: 'POST',
      path: '/api/reports',
      body: { id, requestId: randomHex(), content, consent: 1 },
    },
  };
  writeTickets(storage, [...tickets, ticket]); // Preserve ownership BEFORE any request.
  return ticket;
}
export function prepareChange(
  storage: Store,
  ticket: Ticket,
  method: 'PATCH' | 'DELETE',
  content?: Content,
  revision?: number,
) {
  const tickets = readTickets(storage),
    previous = tickets.find((t) => t.id === ticket.id);
  if (!previous || previous.key !== ticket.key) throw Error('local');
  if (previous.pending && method !== 'DELETE') throw Error('pending');
  const next: Ticket = {
    ...previous,
    pending: {
      method,
      path: `/api/reports/${previous.id}`,
      body: {
        requestId: randomHex(),
        ...(method === 'PATCH' ? { content, revision, consent: 1 } : {}),
      },
    },
  };
  writeTickets(
    storage,
    tickets.map((t) => (t.id === next.id ? next : t)),
  );
  return next;
}
export async function sendPending(ticket: Ticket) {
  const p = ticket.pending;
  if (!p) throw Error('pending');
  const response = await fetch(p.path, {
    method: p.method,
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      'X-Report-Owner': ticket.key,
    },
    body: JSON.stringify(p.body),
    cache: 'no-store',
    signal: AbortSignal.timeout(10000),
  });
  const result = (await response.json().catch(() => ({}))) as {
    ok?: boolean;
    error?: string;
    deleted?: boolean;
    id?: string;
    revision?: number;
  };
  if (!response.ok || result.ok !== true)
    throw new ReportRequestError(
      typeof result.error === 'string' ? result.error : 'unavailable',
      response.status,
    );
  if (
    p.method === 'DELETE'
      ? result.deleted !== true
      : result.id !== ticket.id ||
        !Number.isInteger(result.revision) ||
        (result.revision || 0) < 1 ||
        (result.revision || 0) > 20
  )
    throw Error('unavailable');
  return result as {
    ok: true;
    id?: string;
    revision?: number;
    deleted?: true;
    withdrawalPending?: boolean;
  };
}
export function acknowledge(storage: Store, ticket: Ticket, deleted = false) {
  const tickets = readTickets(storage);
  // A newer operation/cancellation must not be cleared by a late acknowledgement.
  const current = tickets.find((t) => t.id === ticket.id);
  if (
    !current ||
    current.key !== ticket.key ||
    JSON.stringify(current.pending) !== JSON.stringify(ticket.pending)
  )
    return;
  writeTickets(
    storage,
    deleted
      ? tickets.filter((t) => t.id !== ticket.id)
      : tickets.map((t) => (t.id === ticket.id ? { ...t, pending: null } : t)),
  );
}

export class ReportRequestError extends Error {
  constructor(
    code: string,
    public status: number,
  ) {
    super(code);
  }
}
export function releaseRejectedUpdate(
  storage: Store,
  ticket: Ticket,
  error: unknown,
) {
  if (
    !(error instanceof ReportRequestError) ||
    error.status !== 409 ||
    error.message !== 'revision-conflict' ||
    ticket.pending?.method !== 'PATCH'
  )
    return false;
  const current = readTickets(storage).find((t) => t.id === ticket.id);
  if (
    !current ||
    current.key !== ticket.key ||
    JSON.stringify(current.pending) !== JSON.stringify(ticket.pending)
  )
    return false;
  storage.setItem(
    REPORT_DRAFT_KEY,
    JSON.stringify({ version: 1, content: ticket.pending.body.content }),
  );
  acknowledge(storage, ticket);
  return true;
}
