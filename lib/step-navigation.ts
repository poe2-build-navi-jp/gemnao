// Optional, editorial prerequisites. Confirmation is local UI state, not a solution vote.
export type AdvanceCheck = {
  prompt: string;
  confirmedLabel: string;
  unresolvedLabel: string;
  unresolvedHref: string;
  resolvedLabel: string;
};

// The visual order may include independent symptoms. Explicit endpoints must
// retain the current STEP when saving an unresolved attempt or resuming it.
export function nextStepIndex(
  steps: { id: string }[],
  step: { nextStepId?: string; endpoint?: unknown },
  index: number,
) {
  if (step.endpoint) return index;
  const target = steps.findIndex(
    (candidate) => candidate.id === step.nextStepId,
  );
  return target > index ? target : Math.min(index + 1, steps.length - 1);
}
