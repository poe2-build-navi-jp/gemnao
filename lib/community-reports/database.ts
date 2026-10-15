export const reportStatement = (
  db: D1Database,
  q: string,
  ...args: (string | number | null)[]
) => db.prepare(q).bind(...args);
export async function reportBatch(
  db: D1Database,
  queries: D1PreparedStatement[],
) {
  const results = await db.batch(queries);
  if (results.length !== queries.length || results.some((r) => !r.success))
    throw Error('storage');
  return results;
}
