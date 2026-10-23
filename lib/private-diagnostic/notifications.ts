import { timingSafeEqual } from 'node:crypto';
import { privateHeaders } from './service';
export type NotificationEnv = {
  PRIVATE_DIAGNOSTIC_DB?: D1Database;
  PRIVATE_DIAGNOSTIC_NOTIFY_ENABLED?: string;
  PRIVATE_DIAGNOSTIC_NOTIFY_TOKEN_SHA256?: string;
};
export async function handleNotificationMetadata(request: Request, env: NotificationEnv, now = Math.floor(Date.now()/1000)) {
  const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), {status, headers:privateHeaders});
  // Independent switch/credential. No owner cookie or admin-key fallback.
  if (env.PRIVATE_DIAGNOSTIC_NOTIFY_ENABLED !== 'true') return reply({error:'unavailable'},404);
  if (request.method !== 'GET') return reply({error:'method'},405);
  if (new URL(request.url).search || request.headers.has('cookie') || request.headers.has('origin')) return reply({error:'request'},400);
  const token = request.headers.get('authorization')?.match(/^Bearer ([a-f0-9]{64})$/)?.[1];
  const expected = env.PRIVATE_DIAGNOSTIC_NOTIFY_TOKEN_SHA256;
  if (!token || !expected || !/^[a-f0-9]{64}$/.test(expected)) return reply({error:'unauthorized'},401);
  const actual = new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(token)));
  const verifier = Uint8Array.from(expected.match(/../g)!, b=>parseInt(b,16));
  if (!timingSafeEqual(actual,verifier)) return reply({error:'unauthorized'},401);
  if (!env.PRIVATE_DIAGNOSTIC_DB) return reply({error:'unavailable'},503);
  try {
    const row = await env.PRIVATE_DIAGNOSTIC_DB.prepare('SELECT cursor FROM private_diagnostic_notification_state WHERE singleton=1 AND expires_at>?').bind(now).first<{cursor:string}>();
    if (row && !/^[a-f0-9]{32}$/.test(row.cursor)) throw Error('shape');
    return reply({version:1,cursor:row?.cursor ?? null});
  } catch { return reply({error:'unavailable'},503); }
}
