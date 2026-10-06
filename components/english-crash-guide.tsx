import {
  StepResultCollection,
  StepResultButtons,
} from '@/components/step-result-collection';
/* oxlint-disable next/no-html-link-for-pages -- Native links match the guide shell. */
import { EnglishGuideShell } from '@/components/english-guide-shell';
import { crashGuideEn, crashSectionsEn } from '@/lib/localized/crash-guide-en';

export function EnglishCrashGuide() {
  return (
    <EnglishGuideShell guide={crashGuideEn} contents={crashSectionsEn}>
      <StepResultCollection
        key="guide-pc-game-crash:en"
        contextSlug="guide-pc-game-crash"
        topic="launch"
        locale="en"
        steps={crashSectionsEn
          .filter((section) => /^step-[123]$/.test(section.id))
          .map(({ id, title }) => ({ id, title }))}
      >
        {crashSectionsEn.map((section) => (
          <section className="pc-step" id={section.id} key={section.id}>
            <h2>{section.title}</h2>
            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {section.items ? (
              section.ordered ? (
                <ol>
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ol>
              ) : (
                <ul>
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )
            ) : null}
            {section.table ? (
              <div className="diagnosis-table">
                <table>
                  <thead>
                    <tr>
                      {section.table.headers.map((header) => (
                        <th scope="col" key={header}>
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section.table.rows.map((row) => (
                      <tr key={row[0]}>
                        {row.map((cell, index) => (
                          <td
                            data-label={section.table.headers[index]}
                            key={index}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
            {section.links?.map((link) => (
              <p key={link.href}>
                <a href={link.href}>{link.label}</a>
              </p>
            ))}
            {/^step-[123]$/.test(section.id) && (
              <StepResultButtons method={section.id} />
            )}
          </section>
        ))}
      </StepResultCollection>
    </EnglishGuideShell>
  );
}
