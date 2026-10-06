type Method = { methodId: string; responses: number; notResolved?: number };

export function validMethodSnapshot(
  methods: unknown,
  requireOutcomes: boolean,
): methods is Method[] {
  if (!Array.isArray(methods)) return false;
  const ids = new Set<string>();
  for (const method of methods) {
    if (
      !method ||
      typeof method.methodId !== 'string' ||
      !method.methodId ||
      ids.has(method.methodId) ||
      !Number.isSafeInteger(method.responses) ||
      method.responses < 0 ||
      ((requireOutcomes || method.notResolved !== undefined) &&
        (!Number.isSafeInteger(method.notResolved) || method.notResolved < 0))
    )
      return false;
    ids.add(method.methodId);
  }
  return true;
}

// GET /api/feedback returns the complete method snapshot for one article/topic.
// A missing row is zero only after that snapshot and the new schema are confirmed.
export function stepOutcomeCounts(
  methods: Method[],
  methodId: string,
  available: boolean,
) {
  if (!available || !validMethodSnapshot(methods, true)) return null;
  const row = methods.find((method) => method.methodId === methodId);
  if (!row) return { resolved: 0, notResolved: 0, total: 0 };
  return {
    resolved: row.responses,
    notResolved: row.notResolved as number,
    total: row.responses + (row.notResolved as number),
  };
}
