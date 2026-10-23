/* oxlint-disable next/no-html-link-for-pages -- Diagnosis uses native document navigation. */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { WikiHeader, WikiFooter } from '@/components/wiki-header';
import { WindowsDiagnosisEntry } from '@/components/windows-diagnosis-entry';
const copy = {
  en: {
    title: 'Choose a PC game diagnosis',
    heading: 'Browser questionnaire (Japanese)',
    body: 'Answer questions to organize the next checks. No download or automatic inspection of your PC. The questionnaire is currently available in Japanese only.',
    action: 'Open the Japanese questionnaire',
  },
  zh: {
    title: '选择 PC 游戏诊断方式',
    heading: '浏览器问卷（日语）',
    body: '回答问题，整理下一步检查顺序。无需下载，不会自动检查 PC 内部。目前问卷仅提供日语版。',
    action: '打开日语问卷',
  },
  es: {
    title: 'Elige un diagnóstico para tu juego de PC',
    heading: 'Cuestionario del navegador (en japonés)',
    body: 'Responde preguntas para organizar las siguientes comprobaciones. Sin descargas ni inspección automática del PC. El cuestionario solo está disponible en japonés por ahora.',
    action: 'Abrir el cuestionario en japonés',
  },
};
export function generateStaticParams() {
  return ['en', 'zh', 'es'].map((locale) => ({ locale }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!(locale in copy)) return {};
  return {
    title: copy[locale as keyof typeof copy].title,
    robots: { index: false, follow: false },
    alternates: { canonical: `/${locale}/diagnose` },
  };
}
export default async function DiagnosisEntry({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== 'en' && locale !== 'zh' && locale !== 'es') notFound();
  const t = copy[locale];
  return (
    <main lang={locale === 'zh' ? 'zh-Hans' : locale}>
      <WikiHeader locale={locale} pagePath="/diagnose" />
      <article className="static-page diagnosis-download">
        <h1>{t.title}</h1>
        <section>
          <h2>{t.heading}</h2>
          <p>{t.body}</p>
          <a href="/diagnose" lang="ja">
            {t.action} →
          </a>
        </section>
        <WindowsDiagnosisEntry locale={locale} />
      </article>
      <WikiFooter locale={locale} />
    </main>
  );
}
