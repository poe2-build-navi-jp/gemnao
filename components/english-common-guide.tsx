import {
  ArticleEvidence,
  evidenceReview,
  evidenceLabels,
} from './article-evidence';
import { EnglishResetConfigLocations } from './english-reset-config-locations';
import { ResetConfigChecklist } from './reset-config-checklist';
import { guideUi } from '@/lib/localized/guide-ui';
import type { Locale } from '@/lib/i18n';
import { EnglishGuideShell } from './english-guide-shell';
import {
  StepResultCollection,
  StepResultButtons,
} from './step-result-collection';
import type { EnglishCommonGuide as Guide } from '@/lib/localized/common-guides-en';
/* oxlint-disable next/no-html-link-for-pages -- Native links match existing guides. */
export function EnglishCommonGuide({
  guide,
  locale = 'en',
}: {
  guide: Guide;
  locale?: Locale;
}) {
  const t = guideUi[locale];
  const reset = locale === 'en' && guide.slug === 'reset-config-file';
  return (
    <EnglishGuideShell
      guide={guide}
      locale={locale}
      contents={[
        { id: 'choose-check', title: t.symptom },
        ...(reset ? [{id:'config-location',title:'Configuration locations'},{id:'reset-checklist',title:'Before you begin'}] : []),
        ...guide.steps,
        ...(evidenceReview(guide.path, locale)
          ? [{ id: 'article-evidence', title: evidenceLabels[locale].title }]
          : []),
        ...(guide.extraSections || []),
        { id: 'cautions', title: t.cautions },
      ]}
    >
      <section className="pc-step" id="choose-check">
        <h2>{t.symptom}</h2>
        <ul>
          {guide.branches.map((branch) => (
            <li key={branch.symptom}>
              <a href={`#${branch.step}`}>
                <strong>{branch.symptom}</strong>
              </a>{' '}
              — {branch.action}
            </li>
          ))}
        </ul>
      </section>
      {reset && <><EnglishResetConfigLocations /><ResetConfigChecklist english /></>}
      <StepResultCollection
        contextSlug={`guide-${guide.slug}`}
        topic={guide.topic}
        locale={locale}
        steps={guide.steps}
      >
        {guide.steps.map((step, index) => (
          <section className="pc-step" id={step.id} key={step.id}>
            <h2>
              {t.step} {index + 1}: {step.title}
            </h2>
            <ol>
              {step.actions.map((action) => (
                <li key={action}>{action}</li>
              ))}
            </ol>
            <p className="procedure-note">
              <strong>{t.result}: </strong>
              {step.next}
            </p>
            <StepResultButtons method={step.id} />
          </section>
        ))}
      </StepResultCollection>
      <ArticleEvidence path={guide.path} locale={locale} />
      {guide.extraSections?.map((section) => (
        <section className="pc-step" id={section.id} key={section.id}>
          <h2>{section.title}</h2>
          <ol>
            {section.actions.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ol>
        </section>
      ))}
      <section className="pc-step" id="cautions">
        <h2>{t.cautions}</h2>
        <ul>
          {guide.cautions.map((caution) => (
            <li key={caution}>{caution}</li>
          ))}
        </ul>
      </section>
    </EnglishGuideShell>
  );
}
