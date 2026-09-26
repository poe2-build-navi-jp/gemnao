import { env } from 'cloudflare:workers';

function database() {
  return (env as unknown as { DB: D1Database }).DB;
}

let schemaReady: Promise<void> | undefined;
function ensureSchema() {
  if (!schemaReady) {
    const db = database();
    schemaReady = db
      .batch([
        db.prepare(`CREATE TABLE IF NOT EXISTS zero_searches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        query TEXT NOT NULL,
        normalized_query TEXT NOT NULL,
        locale TEXT NOT NULL,
        result_count INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL
      )`),
        db.prepare(
          'CREATE INDEX IF NOT EXISTS zero_searches_query_date ON zero_searches(normalized_query, created_at)',
        ),
      ])
      .then(() => undefined)
      .catch((error: unknown) => {
        schemaReady = undefined;
        throw error;
      });
  }
  return schemaReady;
}

export async function recordZeroSearch(
  query: string,
  normalizedQuery: string,
  locale: string,
) {
  await ensureSchema();
  await database()
    .prepare(
      'INSERT INTO zero_searches (query, normalized_query, locale, result_count, created_at) VALUES (?, ?, ?, 0, ?)',
    )
    .bind(query, normalizedQuery, locale, new Date().toISOString())
    .run();
}

export async function readZeroSearchDemand() {
  await ensureSchema();
  const week = new Date(Date.now() - 7 * 86_400_000).toISOString();
  const month = new Date(Date.now() - 30 * 86_400_000).toISOString();
  const result = await database()
    .prepare(`
    SELECT normalized_query AS query,
      SUM(CASE WHEN created_at >= ? THEN 1 ELSE 0 END) AS last7Days,
      COUNT(*) AS last30Days,
      MAX(created_at) AS lastSearchedAt
    FROM zero_searches WHERE created_at >= ?
    GROUP BY normalized_query
    ORDER BY last30Days DESC, lastSearchedAt DESC LIMIT 50
  `)
    .bind(week, month, month)
    .all<{
      query: string;
      last7Days: number;
      last30Days: number;
      lastSearchedAt: string;
    }>();
  return result.results;
}
