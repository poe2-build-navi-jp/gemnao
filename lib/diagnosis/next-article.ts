import type { ActionStatus, DiagnosisResult } from './model';

// Only promote an already matched rule. Never substitute an unrelated guide.
export function nextDiagnosisArticle(
  result: DiagnosisResult,
  records: Record<string, ActionStatus>,
) {
  if (result.scope !== 'game' || result.decision?.urgency !== 'normal')
    return undefined;
  if (
    result.recommendations.some(
      ({ action }) => records[action.id] === 'improved',
    )
  )
    return undefined;
  return result.recommendations.find(
    ({ action }) => !records[action.id] || records[action.id] === 'untried',
  );
}
