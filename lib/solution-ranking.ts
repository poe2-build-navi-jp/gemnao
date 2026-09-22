export type MethodReport = {
  methodId: string;
  methodLabel: string;
  responses: number;
};
export function solutionRanking(
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
  // Require ten attributable reports, not ten unrelated historical votes.
  if (reports < 10 || resolved < reports) return [];
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
