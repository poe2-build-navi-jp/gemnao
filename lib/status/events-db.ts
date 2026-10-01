import { env } from 'cloudflare:workers';

// Time-stamped "困っている" votes, used only to spot sudden increases on the
// status board. The cumulative counters in issue_feedback are unchanged.
// Rows older than 30 days are deleted when new rows are written.

function database() {
  return (env as unknown as { DB: D1Database }).DB;
}

let schemaReady: Promise<void> | undefined;
function ensureSchema() {
  if (!schemaReady) {
    const db = database();
    schemaReady = db
      .batch([
        db.prepare(`CREATE TABLE IF NOT EXISTS feedback_events (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          group_key TEXT NOT NULL,
          kind TEXT NOT NULL,
          created_at TEXT NOT NULL
        )`),
        db.prepare(
          'CREATE INDEX IF NOT EXISTS feedback_events_group_date ON feedback_events(group_key, created_at)',
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

export async function recordFeedbackEvent(groupKey: string, kind: string) {
  await ensureSchema();
  const now = new Date();
  const monthAgo = new Date(now.getTime() - 30 * 86_400_000).toISOString();
  await database().batch([
    database()
      .prepare(
        'INSERT INTO feedback_events (group_key, kind, created_at) VALUES (?, ?, ?)',
      )
      .bind(groupKey, kind, now.toISOString()),
    database()
      .prepare('DELETE FROM feedback_events WHERE created_at < ?')
      .bind(monthAgo),
  ]);
}

export type Spike = { groupKey: string; last24h: number; dailyAverage: number };

/**
 * Groups whose "困っている" votes in the last 24 hours are at least 3 and at
 * least 3 times their daily average over the 7 days before that.
 */
export async function readSpikes(): Promise<Spike[]> {
  await ensureSchema();
  const now = Date.now();
  const day = new Date(now - 86_400_000).toISOString();
  const week = new Date(now - 8 * 86_400_000).toISOString();
  const result = await database()
    .prepare(`
      SELECT group_key AS groupKey,
        SUM(CASE WHEN created_at >= ? THEN 1 ELSE 0 END) AS last24h,
        SUM(CASE WHEN created_at < ? THEN 1 ELSE 0 END) AS previous
      FROM feedback_events
      WHERE kind = 'struggling' AND created_at >= ?
      GROUP BY group_key
    `)
    .bind(day, day, week)
    .all<{ groupKey: string; last24h: number; previous: number }>();
  return result.results
    .map((row) => ({
      groupKey: row.groupKey,
      last24h: row.last24h,
      dailyAverage: Math.round((row.previous / 7) * 10) / 10,
    }))
    .filter((row) => row.last24h >= 3 && row.last24h >= row.dailyAverage * 3)
    .sort((a, b) => b.last24h - a.last24h)
    .slice(0, 5);
}
