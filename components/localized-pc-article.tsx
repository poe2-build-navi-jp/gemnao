/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { ArrowRight, CheckCircle2, ExternalLink } from 'lucide-react';
import { ArticleToc } from '@/components/article-toc';
import { RepairCostTable } from '@/components/repair-cost-table';
import { SaveArticle } from '@/components/save-article';
import { ShareButtons } from '@/components/share-buttons';
import { SupportWorkspace } from '@/components/support-workspace';
import { WikiFooter, WikiHeader } from '@/components/wiki-header';
import { editorialAuthor, editorialPublisher } from '@/lib/editorial-identity';
import { languageTag } from '@/lib/localized/index';
import type { LocalizedPcArticle as Article } from '@/lib/localized/pc-repair-articles';
import { ui } from '@/lib/localized/ui';
import { ogImageFor } from '@/lib/og-images';
import { repairCostExamples } from '@/lib/repair-costs';

const copy = {
  en: {
    breadcrumb: 'Breadcrumb',
    editorial: 'Edited by Gemnao Editorial Team',
    label: 'PC repair and replacement | Windows PCs in Japan',
    firstCheck: 'Check this first',
    evidence: 'Official guidance behind these checks:',
    diagnosis: 'Choose your next check',
    diagnosisIntro:
      'Start with the row that matches your situation. Change one setting at a time so you can tell what helped.',
    compare: 'What to compare',
    steps: 'Check in this order',
    results: 'What the result means and what to do next',
    state: 'Situation',
    meaning: 'What it tells you',
    next: 'Next action',
    expected: 'Expected result or what you learned',
    unexpected: 'If something is wrong or unclear',
    revert: 'How to undo changes',
    escalation: 'When to ask for help',
    related: 'Related checks and guides',
    relatedLabel: 'Next check',
    costs: 'Repair cost examples',
    correction: 'Report an error in this guide',
  },
  zh: {
    breadcrumb: '当前位置',
    editorial: '编辑：Gemnao 编辑团队',
    label: '维修与换新比较｜日本的 Windows 电脑',
    firstCheck: '先确认这些事项',
    evidence: '上述判断参考的官方资料：',
    diagnosis: '选择下一步检查',
    diagnosisIntro:
      '从符合当前情况的一行开始。每次只调整一项设置，便于判断哪个变化有效。',
    compare: '需要比较的内容',
    steps: '按顺序核对',
    results: '结果含义与下一步',
    state: '当前情况',
    meaning: '能说明什么',
    next: '下一步',
    expected: '预期结果或已确认的事项',
    unexpected: '仍有异常或结果不明确时',
    revert: '如何恢复修改',
    escalation: '何时寻求帮助',
    related: '相关检查与指南',
    relatedLabel: '继续检查',
    costs: '维修费用示例',
    correction: '反馈文章中的错误',
  },
  es: {
    breadcrumb: 'Ruta de navegación',
    editorial: 'Edición: equipo editorial de Gemnao',
    label: 'Reparación y sustitución | PC Windows en Japón',
    firstCheck: 'Comprueba esto primero',
    evidence: 'Instrucciones oficiales que respaldan estas comprobaciones:',
    diagnosis: 'Elige la siguiente comprobación',
    diagnosisIntro:
      'Empieza por la fila que coincida con tu situación. Cambia un ajuste cada vez para saber qué ha ayudado.',
    compare: 'Qué comparar',
    steps: 'Comprueba en este orden',
    results: 'Qué significa el resultado y qué hacer después',
    state: 'Situación',
    meaning: 'Qué indica',
    next: 'Siguiente acción',
    expected: 'Resultado esperado o información obtenida',
    unexpected: 'Si hay un problema o no está claro',
    revert: 'Cómo deshacer los cambios',
    escalation: 'Cuándo pedir ayuda',
    related: 'Comprobaciones y guías relacionadas',
    relatedLabel: 'Siguiente comprobación',
    costs: 'Ejemplos de costes de reparación',
    correction: 'Comunicar un error de esta guía',
  },
};
const site = 'https://gemnao.pages.dev';

export function LocalizedPcArticle({ article }: { article: Article }) {
  const { locale, slug } = article;
  const t = ui[locale];
  const labels = copy[locale];
  const originalPath = `/pc/${slug}`;
  const path = `/${locale}${originalPath}`;
  const canonical = `${site}${path}`;
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: article.title,
      description: article.description,
      dateModified: article.checkedAt,
      inLanguage: languageTag[locale],
      author: editorialAuthor,
      publisher: editorialPublisher,
      mainEntityOfPage: canonical,
      about: 'Windows PC',
      citation: [
        ...new Set([
          ...article.sources.map((source) => source.url),
          ...(slug === 'repair-or-replace'
            ? repairCostExamples.map((example) => example.source)
            : []),
        ]),
      ],
      image: `${site}${ogImageFor(path).split('?')[0]}`,
      ...(article.evidenceSummary
        ? {
            hasPart: {
              '@type': 'WebPageElement',
              name: article.evidenceSummary.title,
              url: `${canonical}#signs`,
            },
          }
        : {}),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: article.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: t.home,
          item: `${site}/${locale}`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: `${t.pcWindows}${t.inJapanese}`,
          item: `${site}/pc`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: article.shortTitle,
          item: canonical,
        },
      ],
    },
  ];
  return (
    <main lang={languageTag[locale]}>
      <WikiHeader locale={locale} pagePath={originalPath} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <header className="article-hero issue-hero pc-hero">
        <div className="article-hero-inner">
          <nav className="breadcrumbs" aria-label={labels.breadcrumb}>
            <a href={`/${locale}`}>{t.home}</a>
            <span>›</span>
            <a href="/pc" hrefLang="ja">
              {t.pcWindows}
              {t.inJapanese}
            </a>
            <span>›</span>
            <b>{article.shortTitle}</b>
          </nav>
          <p className="article-label">{labels.label}</p>
          <h1>{article.title}</h1>
          <p className="article-lead">{article.lead}</p>
          <div className="article-meta">
            <span>
              {t.lastChecked}: {article.checkedAt}
            </span>
            <span>
              <a href="/about" hrefLang="ja">
                {labels.editorial}
                {t.inJapanese}
              </a>
            </span>
          </div>
          <SaveArticle path={path} title={article.title} locale={locale} />
        </div>
      </header>
      <div className="article-layout issue-layout">
        <ArticleToc title={t.contents} className="issue-toc">
          <a href="#answer">{t.summary}</a>
          {article.evidenceSummary && (
            <a href="#signs">
              {article.evidenceSummary.tocLabel ??
                article.evidenceSummary.title}
            </a>
          )}
          <a href="#diagnosis">{labels.diagnosis}</a>
          {article.steps.map((step, index) => (
            <a href={`#step-${index + 1}`} key={step.title}>
              {index + 1}. {step.title}
            </a>
          ))}
          {slug === 'repair-or-replace' && (
            <a href="#repair-costs">{labels.costs}</a>
          )}
          <a href="#escalation">{labels.escalation}</a>
          <a href="#faq">{t.faq}</a>
          <a href="#references">{t.references}</a>
        </ArticleToc>
        <article className="guide-article pc-guide">
          <section className="answer-summary" id="answer">
            <p className="evidence-label">{labels.firstCheck}</p>
            <h2>
              <CheckCircle2 size={23} /> {t.summary}
            </h2>
            <p>{article.answer}</p>
            <ol>
              {article.quickChecks.map((check) => (
                <li key={check}>{check}</li>
              ))}
            </ol>
          </section>
          {article.evidenceSummary && (
            <section
              className="guide-section"
              id="signs"
              aria-labelledby="signs-title"
            >
              <h2 id="signs-title">{article.evidenceSummary.title}</h2>
              <p>{article.evidenceSummary.intro}</p>
              <ol>
                {article.evidenceSummary.items.map((item) => (
                  <li key={item.label}>
                    <strong>{item.label}: </strong>
                    {item.explanation}
                  </li>
                ))}
              </ol>
              <p>{article.evidenceSummary.limitation}</p>
              <p className="source-note">{labels.evidence}</p>
              <ul>
                {article.evidenceSummary.sources.map((source) => (
                  <li key={source.url}>
                    <a href={source.url} target="_blank" rel="noreferrer">
                      {source.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <section
            className="diagnosis-table"
            id="diagnosis"
            aria-labelledby="diagnosis-title"
          >
            <h2 id="diagnosis-title">{labels.diagnosis}</h2>
            <p>{labels.diagnosisIntro}</p>
            <table aria-labelledby="diagnosis-title">
              <thead>
                <tr>
                  <th scope="col">{t.symptom}</th>
                  <th scope="col">{labels.compare}</th>
                  <th scope="col">{t.step}</th>
                </tr>
              </thead>
              <tbody>
                {article.diagnosis.map((row) => (
                  <tr key={row.symptom}>
                    <td data-label={t.symptom}>{row.symptom}</td>
                    <td data-label={labels.compare}>{row.check}</td>
                    <td data-label={t.step}>
                      <a href={`#step-${row.next}`}>
                        {t.stepLabel} {row.next}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          <section className="pc-steps" aria-label={labels.steps}>
            <h2>{labels.steps}</h2>
            <SupportWorkspace
              locale={locale}
              steps={article.steps.map((step, index) => ({
                id: `step-${index + 1}`,
                title: step.title,
              }))}
              draft={{
                title: article.title,
                gameSlug: '',
                status: 'investigating',
                diagnosis: '',
                settings: '',
                notes: '',
                articlePath: path,
                stepId: '',
                completedSteps: [],
              }}
            />
            {article.steps.map((step, index) => (
              <section
                className="pc-step"
                id={`step-${index + 1}`}
                key={step.title}
              >
                <h3>
                  {t.stepLabel} {index + 1}: {step.title}
                </h3>
                <ol>
                  {step.actions.map((action) => (
                    <li key={action}>{action}</li>
                  ))}
                </ol>
                {step.resultRows && (
                  <div className="diagnosis-table pc-result-guide">
                    <h4 id={`step-${index + 1}-results`}>{labels.results}</h4>
                    <table aria-labelledby={`step-${index + 1}-results`}>
                      <thead>
                        <tr>
                          <th scope="col">{labels.state}</th>
                          <th scope="col">{labels.meaning}</th>
                          <th scope="col">{labels.next}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {step.resultRows.map((row) => (
                          <tr key={row.state}>
                            <td data-label={labels.state}>{row.state}</td>
                            <td data-label={labels.meaning}>{row.meaning}</td>
                            <td data-label={labels.next}>{row.next}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <dl className="pc-step-results">
                  <div>
                    <dt>{labels.expected}</dt>
                    <dd>{step.expected}</dd>
                  </div>
                  <div>
                    <dt>{labels.unexpected}</dt>
                    <dd>{step.unexpected}</dd>
                  </div>
                  <div>
                    <dt>{labels.revert}</dt>
                    <dd>{step.revert}</dd>
                  </div>
                </dl>
              </section>
            ))}
          </section>
          {slug === 'repair-or-replace' && <RepairCostTable locale={locale} />}
          <section className="caution-block" id="escalation">
            <h2>{labels.escalation}</h2>
            <p>{article.escalation}</p>
          </section>
          <section className="faq-section" id="faq">
            <h2>{t.faq}</h2>
            <div>
              {article.faqs.map((faq) => (
                <details key={faq.question}>
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
          <section className="related-section">
            <h2>{labels.related}</h2>
            <div>
              {article.related.map((link) => (
                <a
                  href={link.href}
                  hrefLang={
                    link.href.startsWith(`/${locale}/`)
                      ? languageTag[locale]
                      : 'ja'
                  }
                  key={link.href}
                >
                  <span>{labels.relatedLabel}</span>
                  {link.label}
                  <ArrowRight size={15} />
                </a>
              ))}
            </div>
          </section>
          <ShareButtons
            title={article.title}
            path={path}
            locale={locale}
            hashtag="Windows"
          />
          <p className="correction-link">
            <a
              href={`/contact?url=${encodeURIComponent(canonical)}`}
              hrefLang="ja"
            >
              {labels.correction}
              {t.inJapanese}
            </a>
          </p>
          <section className="sources" id="references">
            <h2>{t.references}</h2>
            <p className="source-policy">{article.sourcePolicy}</p>
            {article.sources.map((source) => (
              <a
                href={source.url}
                key={source.url}
                target="_blank"
                rel="noreferrer"
              >
                {source.title}
                <ExternalLink size={15} />
              </a>
            ))}
          </section>
        </article>
      </div>
      <WikiFooter locale={locale} />
    </main>
  );
}
