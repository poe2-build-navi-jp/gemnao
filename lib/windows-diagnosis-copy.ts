export type DiagnosisLocale = 'ja' | 'en' | 'zh' | 'es';
export const windowsDiagnosisPath = (locale: DiagnosisLocale) =>
  `${locale === 'ja' ? '' : `/${locale}`}/tools/windows-diagnosis#download`;
export const windowsDiagnosisCopy = {
  ja: {
    label: 'Windows版診断ツール（試作版）',
    action: '注意事項・ダウンロード',
    body: 'ブラウザ問診とは別のWindows x64用アプリです。PC内の記録を確認します。未署名・新版Windows実機検証前。',
  },
  en: {
    label: 'Windows diagnosis tool (prototype)',
    action: 'Read precautions and download',
    body: 'A Windows x64 app, separate from the browser questionnaire, that reviews local PC records. Unsigned; the new version has not been tested on a real Windows PC.',
  },
  zh: {
    label: 'Windows 诊断工具（试作版）',
    action: '查看注意事项与下载',
    body: '这是独立于浏览器问卷的 Windows x64 应用，用于查看本机记录。未签名；新版本尚未在 Windows 实机上验证。',
  },
  es: {
    label: 'Herramienta de diagnóstico para Windows (prototipo)',
    action: 'Ver precauciones y descarga',
    body: 'Aplicación para Windows x64 que revisa registros locales del PC, independiente del cuestionario del navegador. Sin firma digital; la nueva versión aún no se ha probado en un PC Windows real.',
  },
} as const;
