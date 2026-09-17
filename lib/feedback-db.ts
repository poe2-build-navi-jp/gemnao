import { env } from 'cloudflare:workers';

export type FeedbackRow = {
  topic: string;
  struggling: number;
  resolved: number;
};

export type SolutionMethodRow = {
  methodId: string;
  methodLabel: string;
  responses: number;
};

function database() {
  return (env as unknown as { DB: D1Database }).DB;
}

export async function readFeedback(gameSlug: string): Promise<FeedbackRow[]> {
  const result = await database()
    .prepare(
      'SELECT topic, struggling_count AS struggling, resolved_count AS resolved FROM issue_feedback WHERE game_slug = ?',
    )
    .bind(gameSlug)
    .all<FeedbackRow>();
  return result.results;
}

export async function readSolutionMethods(
  contextSlug: string,
): Promise<SolutionMethodRow[]> {
  const result = await database()
    .prepare(
      'SELECT method_id AS methodId, method_label AS methodLabel, response_count AS responses FROM solution_method_feedback WHERE context_slug = ? ORDER BY response_count DESC, method_label ASC',
    )
    .bind(contextSlug)
    .all<SolutionMethodRow>();
  return result.results;
}

export async function incrementFeedback(
  gameSlug: string,
  topic: string,
  kind: 'struggling' | 'resolved',
) {
  const struggling = kind === 'struggling' ? 1 : 0;
  const resolved = kind === 'resolved' ? 1 : 0;
  await database()
    .prepare(`
    INSERT INTO issue_feedback (game_slug, topic, struggling_count, resolved_count, updated_at)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(game_slug, topic) DO UPDATE SET
      struggling_count = struggling_count + excluded.struggling_count,
      resolved_count = resolved_count + excluded.resolved_count,
      updated_at = excluded.updated_at
  `)
    .bind(gameSlug, topic, struggling, resolved, new Date().toISOString())
    .run();
}

export async function incrementSolutionMethod(
  contextSlug: string,
  topic: string,
  methodId: string,
  methodLabel: string,
) {
  await database()
    .prepare(`
    INSERT INTO solution_method_feedback (context_slug, topic, method_id, method_label, response_count, updated_at)
    VALUES (?, ?, ?, ?, 1, ?)
    ON CONFLICT(context_slug, topic, method_id) DO UPDATE SET
      method_label = excluded.method_label,
      response_count = response_count + 1,
      updated_at = excluded.updated_at
  `)
    .bind(contextSlug, topic, methodId, methodLabel, new Date().toISOString())
    .run();
}

export async function recordStepSolved(
  contextSlug: string,
  topic: string,
  methodId: string,
  methodLabel: string,
) {
  const now = new Date().toISOString();
  await database().batch([
    database()
      .prepare(`
        INSERT INTO issue_feedback (game_slug, topic, struggling_count, resolved_count, updated_at)
        VALUES (?, ?, 0, 1, ?)
        ON CONFLICT(game_slug, topic) DO UPDATE SET
          resolved_count = resolved_count + 1,
          updated_at = excluded.updated_at
      `)
      .bind(contextSlug, topic, now),
    database()
      .prepare(`
        INSERT INTO solution_method_feedback (context_slug, topic, method_id, method_label, response_count, updated_at)
        VALUES (?, ?, ?, ?, 1, ?)
        ON CONFLICT(context_slug, topic, method_id) DO UPDATE SET
          method_label = excluded.method_label,
          response_count = response_count + 1,
          updated_at = excluded.updated_at
      `)
      .bind(contextSlug, topic, methodId, methodLabel, now),
  ]);
}
