/** Report slugs are Monday calendar dates in JST, not publication timestamps. */
const DAY = 86_400_000;
export function weeklyPeriod(slug: string): { start: number; end: number } | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(slug)) return null;
  const utcDate = Date.parse(`${slug}T00:00:00Z`);
  if (!Number.isFinite(utcDate)) return null;
  const date = new Date(utcDate);
  if (date.toISOString().slice(0, 10) !== slug || date.getUTCDay() !== 1) return null;
  const start = utcDate - 9 * 3_600_000;
  return { start, end: start + 7 * DAY };
}
export const weeklyLabels = {
  ja: { current: '今週の不具合まとめ', past: '過去のまとめ', dated: '週刊まとめ' },
  en: { current: 'This week’s roundup', past: 'Past roundups', dated: 'Weekly roundup' },
  zh: { current: '本周问题汇总', past: '往期汇总', dated: '每周汇总' },
  es: { current: 'Resumen de esta semana', past: 'Resúmenes anteriores', dated: 'Resumen semanal' },
};
export function weeklyPeriodLabel(slug: string, locale: keyof typeof weeklyLabels, now: number | null) {
  const period = weeklyPeriod(slug);
  const labels = weeklyLabels[locale];
  if (!period || now === null || !Number.isFinite(now) || now < period.start) return labels.dated;
  return now < period.end ? labels.current : labels.past;
}
