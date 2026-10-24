import { timingSafeEqual } from 'node:crypto';
export type InboxNotifyEnv = {
  DB?: D1Database;
  INBOX_NOTIFY_ENABLED?: string;
  INBOX_NOTIFY_READ_TOKEN_HASH_V2?: string;
};
const headers = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store',
  'X-Robots-Tag': 'noindex',
  'Referrer-Policy': 'no-referrer',
};
const reply = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers });
const integer = (n: unknown): n is number =>
  Number.isSafeInteger(n) && Number(n) >= 0;
const domain = new TextEncoder().encode('gemnao-private-inbox-cursor-v1');
const digest = (value: string) =>
  crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
type Position = [number, number];
async function cursorKey(verifier: string) {
  return crypto.subtle.importKey(
    'raw',
    await digest('inbox-cursor:' + verifier),
    'AES-GCM',
    false,
    ['encrypt', 'decrypt'],
  );
}
async function encode(position: Position, verifier: string) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = new Uint8Array(
    await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv, additionalData: domain },
      await cursorKey(verifier),
      new TextEncoder().encode(JSON.stringify(position)),
    ),
  );
  return Buffer.concat([iv, encrypted]).toString('base64url');
}
async function decode(cursor: string, verifier: string): Promise<Position> {
  if (!/^[A-Za-z0-9_-]{40,160}$/.test(cursor)) throw Error('cursor');
  const raw = Buffer.from(cursor, 'base64url');
  const bytes = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: raw.subarray(0, 12), additionalData: domain },
    await cursorKey(verifier),
    raw.subarray(12),
  );
  const value: unknown = JSON.parse(new TextDecoder().decode(bytes));
  if (!Array.isArray(value) || value.length !== 2 || !value.every(integer))
    throw Error('cursor');
  return value as Position;
}
// One snapshot, four scalar reads. Never calls legacy Discord ensureSchema().
// Only IDs/counts enter the database result, never message/title/email/invite fields.
export const INBOX_METADATA_SQL = `SELECT
 (SELECT COALESCE(MAX(id),0) FROM contact_submissions) AS contact_max,
 (SELECT COUNT(*) FROM contact_submissions WHERE id > ?) AS contact_count,
 (SELECT COALESCE(MAX(id),0) FROM discord_server_submissions) AS server_max,
 (SELECT COUNT(*) FROM discord_server_submissions WHERE id > ?) AS server_count`;
export async function handleInboxNotifications(
  request: Request,
  env: InboxNotifyEnv,
) {
  if (env.INBOX_NOTIFY_ENABLED !== 'true')
    return reply({ error: 'unavailable' }, 404);
  if (request.method !== 'GET') return reply({ error: 'method' }, 405);
  const url = new URL(request.url);
  if (
    url.origin !== 'https://gemnao.pages.dev' ||
    url.search ||
    request.headers.has('cookie') ||
    request.headers.has('origin') ||
    request.headers.has('sec-fetch-site')
  )
    return reply({ error: 'request' }, 400);
  const token = request.headers
    .get('authorization')
    ?.match(/^Bearer ([a-f0-9]{64})$/)?.[1];
  const verifier = env.INBOX_NOTIFY_READ_TOKEN_HASH_V2;
  if (!token || !verifier || !/^[a-f0-9]{64}$/.test(verifier))
    return reply({ error: 'unauthorized' }, 401);
  if (
    !timingSafeEqual(
      new Uint8Array(await digest(token)),
      Buffer.from(verifier, 'hex'),
    )
  )
    return reply({ error: 'unauthorized' }, 401);
  const incoming = request.headers.get('x-inbox-cursor');
  let previous: Position = [0, 0];
  if (incoming !== null) {
    try {
      previous = await decode(incoming, verifier);
    } catch {
      return reply({ error: 'cursor' }, 400);
    }
  }
  if (!env.DB) return reply({ error: 'unavailable' }, 503);
  try {
    const row = await env.DB.prepare(INBOX_METADATA_SQL)
      .bind(...previous)
      .first<{
        contact_max: number;
        contact_count: number;
        server_max: number;
        server_count: number;
      }>();
    if (
      !row ||
      ![
        row.contact_max,
        row.contact_count,
        row.server_max,
        row.server_count,
      ].every(integer)
    )
      throw Error('shape');
    const next: Position = [
      Math.max(previous[0], row.contact_max),
      Math.max(previous[1], row.server_max),
    ];
    // First successful read establishes a baseline; historical rows are not new arrivals.
    const baseline = incoming === null;
    const cursor =
      incoming && next.every((n, i) => n === previous[i])
        ? incoming
        : await encode(next, verifier);
    return reply({
      version: 1,
      baseline,
      cursor,
      counts: {
        contact: baseline ? 0 : row.contact_count,
        discord_listing: baseline ? 0 : row.server_count,
      },
    });
  } catch {
    return reply({ error: 'unavailable' }, 503);
  }
}
