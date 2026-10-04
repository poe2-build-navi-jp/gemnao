import { supportCopy, type SupportLocale } from './support-copy';
import type { SavedSolution } from './saved-solutions';
import { gpus, type MyPc } from './my-pc';
export type ShareFields = {
  game: boolean;
  symptoms: boolean;
  pc: boolean;
  attempts: boolean;
  notes: boolean;
};
export const defaultShareFields: ShareFields = {
  game: true,
  symptoms: false,
  pc: false,
  attempts: false,
  notes: false,
};
// Best-effort aid only. Free text is excluded by default and the preview is editable.
export function redact(text: string) {
  return text
    .replace(/\b[A-Z]:[\\/][^\s\n]+/gi, '[path]')
    .replace(/\/(?:Users|home)\/[^\s\n]+/g, '[path]')
    .replace(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi, '[email]')
    .replace(
      /(?:password|token|api[_ -]?key|account|username|パスワード|アカウント|用户名|密码|contraseña)\s*[:=：]\s*[^\n]+/gi,
      '[private]',
    );
}
export function supportSummary(
  item: SavedSolution,
  fields: ShareFields,
  locale: SupportLocale,
  game: string,
  pc: MyPc | null,
) {
  const t = supportCopy[locale];
  const lines = [t.summary];
  if (fields.game) lines.push(`${t.game}: ${game}`);
  if (fields.pc && pc) {
    // Allowlisted specifications only; no arbitrary object keys/values.
    const gpu = gpus.find((g) => g.id === pc.gpu);
    if (gpu) lines.push(`GPU: ${gpu.name}`);
    if ([10, 11].includes(pc.windows)) lines.push(`Windows: ${pc.windows}`);
    if (Number.isFinite(pc.ramGb) && pc.ramGb > 0 && pc.ramGb <= 4096)
      lines.push(`RAM: ${pc.ramGb} GB`);
  }
  if (fields.symptoms || fields.attempts || fields.notes)
    lines.push(t.untranslated);
  if (fields.symptoms) lines.push(`${t.diagnosis}: ${redact(item.diagnosis)}`);
  if (fields.attempts) {
    lines.push(t.history);
    for (const a of item.support?.attempts || [])
      lines.push(`${redact(a.label)}: ${t[a.result]} (${a.at.slice(0, 10)})`);
    if (item.completedSteps.length)
      lines.push(`${t.completed}: ${redact(item.completedSteps.join(' / '))}`);
  }
  if (fields.notes)
    lines.push(
      `${t.settings}: ${redact(item.settings)}`,
      `${t.notes}: ${redact(item.notes)}`,
    );
  return lines.join('\n\n');
}
