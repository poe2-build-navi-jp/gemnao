import { EnglishGuideShell } from './english-guide-shell';
import {
  StepResultCollection,
  StepResultButtons,
} from './step-result-collection';
import type { EnglishCommonGuide as Guide } from '@/lib/localized/common-guides-en';
/* oxlint-disable next/no-html-link-for-pages -- Native links match existing guides. */
export function EnglishCommonGuide({ guide }: { guide: Guide }) {
  return (
    <EnglishGuideShell
      guide={guide}
      contents={[
        { id: 'choose-check', title: 'Choose your symptom' },
        ...guide.steps,
        { id: 'cautions', title: 'Protect saves and keep changes reversible' },
      ]}
    >
      <section className="pc-step" id="choose-check">
        <h2>Choose your symptom</h2>
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
      <StepResultCollection
        contextSlug={`guide-${guide.slug}`}
        topic={guide.topic}
        locale="en"
        steps={guide.steps}
      >
        {guide.steps.map((step, index) => (
          <section className="pc-step" id={step.id} key={step.id}>
            <h2>
              STEP {index + 1}: {step.title}
            </h2>
            <ol>
              {step.actions.map((action) => (
                <li key={action}>{action}</li>
              ))}
            </ol>
            <p className="procedure-note">
              <strong>Result and next action: </strong>
              {step.next}
            </p>
            <StepResultButtons method={step.id} />
          </section>
        ))}
      </StepResultCollection>
      <section className="pc-step" id="cautions">
        <h2>Protect saves and keep changes reversible</h2>
        <ul>
          {guide.cautions.map((caution) => (
            <li key={caution}>{caution}</li>
          ))}
        </ul>
      </section>
    </EnglishGuideShell>
  );
}
