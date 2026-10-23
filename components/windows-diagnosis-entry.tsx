/* oxlint-disable next/no-html-link-for-pages -- Keep native document navigation for diagnosis. */
import {
  windowsDiagnosisCopy,
  windowsDiagnosisPath,
  type DiagnosisLocale,
} from '@/lib/windows-diagnosis-copy';
export function WindowsDiagnosisEntry({
  locale = 'ja',
  id,
}: {
  locale?: DiagnosisLocale;
  id?: string;
}) {
  const t = windowsDiagnosisCopy[locale];
  return (
    <aside id={id} className="windows-diagnosis-entry">
      <strong>{t.label}</strong>
      <p>{t.body}</p>
      <a href={windowsDiagnosisPath(locale)}>{t.action} →</a>
    </aside>
  );
}
