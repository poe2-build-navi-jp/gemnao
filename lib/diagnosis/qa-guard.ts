/** Internal-only permit. Never constructed from public request bodies. */
export type QaWriteGuard = {
  recordId?: string;
  key: string;
  value: string;
  stopKey: string;
  startsAt: number;
  expiresAt: number;
};

export const diagnosisQaCondition = ` AND EXISTS(SELECT 1 FROM diagnosis_operations WHERE key=? AND value=?)
 AND NOT EXISTS(SELECT 1 FROM diagnosis_operations WHERE key=?)
 AND unixepoch()*1000>=? AND unixepoch()*1000<?`;
export const feedbackQaCondition = ` AND NOT EXISTS(SELECT 1 FROM diagnostic_report_tombstones WHERE receipt_id=?)
 AND unixepoch()*1000>=? AND unixepoch()*1000<?`;
