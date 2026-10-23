import { parseReport } from './contract';
import { privateHeaders, type PrivateDiagnosticEnv } from './service';
export async function handlePrivateAdmin(
  request: Request,
  env: PrivateDiagnosticEnv,
  authorize: () => Promise<boolean>,
  now = Math.floor(Date.now() / 1000),
) {
  const reply = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: privateHeaders });
  // Must verify that the existing key is held only by the intended owner before enabling this flag.
  if (
    env.PRIVATE_DIAGNOSTIC_OWNER_REVIEW_ENABLED !== 'true' ||
    !(await authorize().catch(() => false))
  )
    return reply({ error: 'Owner authentication required' }, 401);
  if (request.method !== 'GET') return reply({ error: 'method' }, 405);
  if (request.headers.get('sec-fetch-site') === 'cross-site')
    return reply({ error: 'origin' }, 403);
  if (!env.PRIVATE_DIAGNOSTIC_DB)
    return reply({ error: 'Private inbox unavailable' }, 503);
  try {
    const url = new URL(request.url);
    if (
      [...url.searchParams.keys()].some((k) => k !== 'id' && k !== 'before') ||
      url.searchParams.getAll('id').length > 1 ||
      url.searchParams.getAll('before').length > 1
    )
      return reply({ error: 'query' }, 400);
    const id = url.searchParams.get('id'),
      before = url.searchParams.get('before');
    if (id && before) return reply({ error: 'query' }, 400);
    if (
      (id && !/^[a-f0-9]{32}$/.test(id)) ||
      (before && !/^[a-f0-9]{32}$/.test(before))
    )
      return reply({ error: 'query' }, 400);
    const db = env.PRIVATE_DIAGNOSTIC_DB;
    if (id) {
      const row = await db
        .prepare(
          'SELECT receipt_id,report_json,created_at,expires_at FROM private_diagnostic_reports WHERE receipt_id=? AND expires_at>?',
        )
        .bind(id, now)
        .first<{
          receipt_id: string;
          report_json: string;
          created_at: number;
          expires_at: number;
        }>();
      if (!row) return reply({ error: 'Not found' }, 404);
      return reply({
        receipt_id: row.receipt_id,
        created_at: row.created_at,
        expires_at: row.expires_at,
        report: parseReport(JSON.parse(row.report_json)),
      });
    }
    const result = await db
      .prepare(
        'SELECT receipt_id,created_at,expires_at FROM private_diagnostic_reports WHERE expires_at>? AND receipt_id<? ORDER BY receipt_id DESC LIMIT 21',
      )
      .bind(now, before || 'g')
      .all<{ receipt_id: string; created_at: number; expires_at: number }>();
    if (!result.success) throw Error('storage');
    return reply({
      items: result.results.slice(0, 20),
      next: result.results.length > 20 ? result.results[19].receipt_id : null,
    });
  } catch {
    return reply({ error: 'Private inbox could not be read' }, 503);
  }
}
