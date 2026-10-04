/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { hasWindowsDiagnosisEntry } from '@/lib/article-diagnosis';

const copy = {
  ja: {
    title: '手順を試しても、まだ解決しませんか？',
    body: 'Windowsのゲームが起動しない・落ちる・黒画面になる・フリーズする・低FPS・カクつく場合は、既存のPCゲーム診断ツールで記録と次の確認を整理できます。',
    environment: 'Windows 11 x64／.NET Framework 4.8以降向け。ZIPをダウンロード・展開してPCで実行します（インストーラー不要）。スマホやブラウザー上では実行できません。アプリは日本語・英語対応です。',
    limit: '未署名の試作版で、原因の確定・自動修復・全ゲーム対応は保証しません。PC全体の電源断・ブルースクリーン・異常な発熱がある場合や、すでに直った場合は再現させないでください。',
    link: 'Windows診断の使い方・ダウンロードへ',
  },
  en: {
    title: 'Still not fixed after trying the steps?',
    body: 'For a Windows game that will not launch, crashes, shows a black screen, freezes, has low FPS or stutters, the existing PC game diagnosis tool can help organize records and the next checks.',
    environment: 'Requires Windows 11 x64 and .NET Framework 4.8 or later. Download and extract the ZIP, then run it on your PC; no installer is needed. It does not run on a phone or in a browser. The app supports Japanese and English.',
    limit: 'This unsigned prototype does not guarantee a cause, automatic repair or support for every game. Do not reproduce an issue if the whole PC shuts down, shows a blue screen, overheats, or the issue is already fixed.',
    link: 'Windows diagnosis: instructions and download',
  },
  zh: {
    title: '按步骤操作后，问题仍未解决？',
    body: '如果 Windows 游戏无法启动、崩溃、黑屏、无响应、帧率低或卡顿，可以使用现有的 PC 游戏诊断工具整理记录和后续排查项目。',
    environment: '需要 Windows 11 x64 和 .NET Framework 4.8 或更高版本。下载并解压 ZIP 后在电脑上运行，无需安装程序；不能在手机或浏览器中运行。应用仅支持日语和英语，下方链接为英文说明页。',
    limit: '这是未签名的试作版，不保证确定原因、自动修复或支持所有游戏。如果整台电脑断电、蓝屏、异常发热，或问题已经解决，请勿再次复现。',
    link: 'Windows 诊断：使用说明与下载（英语）',
  },
  es: {
    title: '¿Sigue sin resolverse después de seguir los pasos?',
    body: 'Si un juego de Windows no inicia, se cierra, muestra una pantalla negra, se congela, tiene pocos FPS o tirones, la herramienta de diagnóstico existente permite organizar los registros y las siguientes comprobaciones.',
    environment: 'Requiere Windows 11 x64 y .NET Framework 4.8 o posterior. Descarga y extrae el ZIP y ejecútalo en el PC; no necesita instalador. No funciona en el móvil ni en el navegador. La aplicación solo está en japonés e inglés; la página enlazada está en inglés.',
    limit: 'Es un prototipo sin firma: no garantiza identificar la causa, reparar automáticamente ni ser compatible con todos los juegos. No reproduzcas el fallo si el PC se apaga, muestra una pantalla azul, se sobrecalienta o el problema ya está resuelto.',
    link: 'Diagnóstico de Windows: instrucciones y descarga (inglés)',
  },
};

export function ArticleDiagnosisEntry({ path, locale = 'ja' }: {
  path: string;
  locale?: keyof typeof copy;
}) {
  if (!hasWindowsDiagnosisEntry(path)) return null;
  const t = copy[locale];
  const language = locale === 'ja' ? 'ja' : 'en';
  return (
    <aside className="diagnosis-article-entry" aria-labelledby="article-diagnosis-title">
      <h2 id="article-diagnosis-title">{t.title}</h2>
      <p>{t.body}</p>
      <p>{t.environment}</p>
      <p>{t.limit}</p>
      <a href={`${language === 'en' ? '/en' : ''}/tools/windows-diagnosis`} hrefLang={language}>
        {t.link} →
      </a>
    </aside>
  );
}
