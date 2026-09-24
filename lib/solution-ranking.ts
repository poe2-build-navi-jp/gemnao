export type MethodReport = {
  methodId: string;
  methodLabel: string;
  responses: number;
};
export function stepSolutionReports(
  methods: MethodReport[],
  steps: { id: string; title: string }[],
  resolved: number,
) {
  const valid = steps.flatMap((step) => {
    const report = methods.find((method) => method.methodId === step.id);
    return report &&
      Number.isSafeInteger(report.responses) &&
      report.responses > 0
      ? [{ ...report, methodLabel: step.title }]
      : [];
  });
  const reports = valid.reduce((sum, method) => sum + method.responses, 0);
  if (!Number.isSafeInteger(resolved) || resolved < reports) return [];
  return valid;
}

export function solutionRanking(
  methods: MethodReport[],
  steps: { id: string; title: string }[],
  resolved: number,
) {
  const valid = stepSolutionReports(methods, steps, resolved);
  if (valid.reduce((sum, method) => sum + method.responses, 0) < 10) return [];
  return valid
    .sort(
      (a, b) =>
        b.responses - a.responses || a.methodId.localeCompare(b.methodId),
    )
    .map((method, _, all) => ({
      ...method,
      rank: all.findIndex((other) => other.responses === method.responses) + 1,
      tied:
        all.filter((other) => other.responses === method.responses).length > 1,
    }));
}

export function feedbackSummary(row: { resolved: number; struggling: number }) {
  const total = row.resolved + row.struggling;
  return {
    total,
    percentage: total >= 10 ? Math.round((row.resolved / total) * 100) : null,
  };
}
