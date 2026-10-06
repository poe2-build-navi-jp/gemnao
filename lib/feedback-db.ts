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
  notResolved?: number;
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
  topic?: string,
): Promise<SolutionMethodRow[]> {
  const sql =
    'SELECT method_id AS methodId, method_label AS methodLabel, response_count AS responses' +
    ((await stepResultsAvailable())
      ? ', not_resolved_count AS notResolved'
      : '') +
    ' FROM solution_method_feedback WHERE context_slug = ?' +
    (topic ? ' AND topic = ?' : '') +
    ' ORDER BY response_count DESC, method_label ASC';
  const query = database().prepare(sql);
  const result = await (
    topic ? query.bind(contextSlug, topic) : query.bind(contextSlug)
  ).all<SolutionMethodRow>();
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

// No runtime migration: old deployments continue to read/write their old schema.
export async function stepResultsAvailable(): Promise<boolean> {
  type Column = {
    name: string;
    type: string;
    notnull: number;
    pk: number;
    dflt_value: string | null;
  };
  const [columns, receipts, indexes, indexColumns, definition] =
    await Promise.all([
      database()
        .prepare('PRAGMA table_info(solution_method_feedback)')
        .all<Column>(),
      database()
        .prepare('PRAGMA table_info(step_result_receipts)')
        .all<Column>(),
      database()
        .prepare('PRAGMA index_list(step_result_receipts)')
        .all<{ name: string }>(),
      database()
        .prepare('PRAGMA index_info(step_result_receipts_requested_at)')
        .all<{ name: string }>(),
      database()
        .prepare(
          "SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'step_result_receipts'",
        )
        .first<{ sql: string }>(),
    ]);
  const counter = columns.results.find(
    (column) => column.name === 'not_resolved_count',
  );
  const expected: Record<string, string> = {
    request_id: 'TEXT',
    requested_at: 'TEXT',
    context_slug: 'TEXT',
    topic: 'TEXT',
    method_id: 'TEXT',
    outcome: 'TEXT',
    report_struggling: 'INTEGER',
  };
  const sql = (definition?.sql || '')
    .toLowerCase()
    .replace(/[\s"`[\]]/g, '')
    .replaceAll('step_result_receipts.', '');
  return Boolean(
    counter &&
    counter.type.toUpperCase() === 'INTEGER' &&
    counter.notnull === 1 &&
    String(counter.dflt_value) === '0' &&
    Object.entries(expected).every(([name, type]) =>
      receipts.results.some(
        (column) =>
          column.name === name &&
          column.type.toUpperCase() === type &&
          column.notnull === 1 &&
          column.pk === (name === 'request_id' ? 1 : 0),
      ),
    ) &&
    receipts.results.filter((column) => column.pk > 0).length === 1 &&
    indexes.results.some(
      (index) => index.name === 'step_result_receipts_requested_at',
    ) &&
    indexColumns.results.length === 1 &&
    indexColumns.results[0].name === 'requested_at' &&
    sql.includes("check(outcomein('resolved','not-resolved'))") &&
    sql.includes('check(report_strugglingin(0,1))'),
  );
}

export async function recordStepResult(
  contextSlug: string,
  topic: string,
  methodId: string,
  methodLabel: string,
  outcome: 'resolved' | 'not-resolved',
  requestId: string,
  reportStruggling: boolean,
  requestedAt: string,
): Promise<{
  accepted: boolean;
  created: boolean;
  expired: boolean;
  limited: boolean;
}> {
  const db = database();
  const now = new Date().toISOString();
  const resolved = outcome === 'resolved' ? 1 : 0;
  const notResolved = outcome === 'not-resolved' ? 1 : 0;
  const struggling = reportStruggling ? 1 : 0;
  // One transactional admission decision handles both expiry and replay.
  // SQLite changes() carries the admitted receipt -> method -> article chain;
  // every accepted outcome changes a method row, even an intermediate failure.
  // D1 rolls the entire batch back if any statement fails.
  const result = await db.batch([
    db.prepare(
      "DELETE FROM step_result_receipts WHERE requested_at < strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-30 days')",
    ),
    db
      .prepare(`
      INSERT INTO step_result_receipts (request_id, context_slug, topic, method_id, outcome, report_struggling, requested_at)
      SELECT ?, ?, ?, ?, ?, ?, ?
      WHERE ? >= strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-30 days')
        AND ? <= strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '+5 minutes')
        AND (EXISTS (SELECT 1 FROM step_result_receipts WHERE request_id = ?)
          OR (SELECT COUNT(*) FROM (SELECT request_id FROM step_result_receipts LIMIT 50000)) < 50000)
      ON CONFLICT(request_id) DO NOTHING
    `)
      .bind(
        requestId,
        contextSlug,
        topic,
        methodId,
        outcome,
        struggling,
        requestedAt,
        requestedAt,
        requestedAt,
        requestId,
      ),
    db
      .prepare(`
      INSERT INTO solution_method_feedback (context_slug, topic, method_id, method_label, response_count, not_resolved_count, updated_at)
      SELECT ?, ?, ?, ?, ?, ?, ? WHERE changes() = 1
      ON CONFLICT(context_slug, topic, method_id) DO UPDATE SET
        method_label = excluded.method_label,
        response_count = response_count + excluded.response_count,
        not_resolved_count = not_resolved_count + excluded.not_resolved_count,
        updated_at = excluded.updated_at
    `)
      .bind(
        contextSlug,
        topic,
        methodId,
        methodLabel,
        resolved,
        notResolved,
        now,
      ),
    db
      .prepare(`
      INSERT INTO issue_feedback (game_slug, topic, struggling_count, resolved_count, updated_at)
      SELECT ?, ?, ?, ?, ? WHERE changes() = 1 AND (? = 1 OR ? = 1)
      ON CONFLICT(game_slug, topic) DO UPDATE SET
        struggling_count = struggling_count + excluded.struggling_count,
        resolved_count = resolved_count + excluded.resolved_count,
        updated_at = excluded.updated_at
    `)
      .bind(
        contextSlug,
        topic,
        struggling,
        resolved,
        now,
        struggling,
        resolved,
      ),
    db
      .prepare(
        "SELECT ? < strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-30 days') OR ? > strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '+5 minutes') AS expired",
      )
      .bind(requestedAt, requestedAt),
  ]);
  const receipt = await db
    .prepare(
      'SELECT context_slug, topic, method_id, outcome, report_struggling, requested_at FROM step_result_receipts WHERE request_id = ?',
    )
    .bind(requestId)
    .first<{
      context_slug: string;
      topic: string;
      method_id: string;
      outcome: string;
      report_struggling: number;
      requested_at: string;
    }>();
  const created = result[1].meta.changes === 1;
  const expired =
    !created &&
    Boolean(
      (result.at(-1)?.results?.[0] as { expired?: number } | undefined)
        ?.expired,
    );
  return {
    created,
    // A request admitted before the boundary still succeeds even if it ages
    // during the batch. Later retries fail DB admission rather than count.
    accepted:
      created ||
      Boolean(
        receipt &&
        receipt.context_slug === contextSlug &&
        receipt.topic === topic &&
        receipt.method_id === methodId &&
        receipt.outcome === outcome &&
        receipt.report_struggling === struggling &&
        receipt.requested_at === requestedAt,
      ),
    expired,
    limited: !created && !receipt && !expired,
  };
}
