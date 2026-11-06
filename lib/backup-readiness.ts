export type BackupCondition = '' | 'normal' | 'conflict' | 'missing';
export const backupCheckIds = [
  'closed',
  'location',
  'copy',
  'verified',
  'original',
] as const;
export function backupReadiness(condition: BackupCondition, checked: string[]) {
  const completed = backupCheckIds.filter((id) => checked.includes(id)).length;
  const state =
    condition === ''
      ? 'choose'
      : condition !== 'normal'
        ? 'preserve'
        : completed === backupCheckIds.length
          ? 'reviewed'
          : 'checking';
  return { state, completed, total: backupCheckIds.length };
}
