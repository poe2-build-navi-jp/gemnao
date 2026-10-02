import { ExternalLink } from 'lucide-react';
import { AffiliateLink } from '@/components/affiliate-link';
import { EnglishGuideShell } from '@/components/english-guide-shell';
import type { GearGuide } from '@/lib/gear-guides';

export function EnglishGearGuide({ guide }: { guide: GearGuide }) {
  const path = `/en/gear/${guide.slug}`;
  return (
    <EnglishGuideShell
      guide={{
        ...guide,
        path: `/gear/${guide.slug}`,
        category: 'Gaming equipment · Before-you-buy guide',
        summary: guide.answer,
        sourcePolicy:
          'We used the linked sources to explain what to check before buying. This is not a hands-on comparison, product test or ranking. Prices and stock are omitted because they change.',
        sources: guide.sources.map((source) => ({
          label: source.title,
          url: source.url,
        })),
      }}
      affiliate={Boolean(guide.example)}
      contents={[
        {
          id: 'before-buying',
          title: 'Check whether you need to buy anything',
        },
        { id: 'compare', title: 'Compare the options' },
        ...guide.sections,
        ...(guide.example
          ? [
              {
                id: 'product-example',
                title: 'Product example for a specific setup',
              },
            ]
          : []),
        { id: 'setup', title: guide.setupTitle || 'After connecting' },
      ]}
    >
      <section className="caution-block" id="before-buying">
        <h2>First check whether you need to buy anything</h2>
        <ul>
          {guide.beforeBuying.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
      <section className="diagnosis-table" id="compare">
        <h2>{guide.compareTitle}</h2>
        <p>
          Choose based on the problem you want to solve and how you will use the
          equipment. This is not a performance ranking.
        </p>
        <table>
          <thead>
            <tr>
              {guide.compare.headers.map((header) => (
                <th scope="col" key={header}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {guide.compare.rows.map((row) => (
              <tr key={row[0]}>
                {row.map((cell, index) =>
                  index === 0 ? (
                    <th scope="row" key={index}>
                      {cell}
                    </th>
                  ) : (
                    <td data-label={guide.compare.headers[index]} key={index}>
                      {cell}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      {guide.sections.map((section) => (
        <section className="pc-step" id={section.id} key={section.id}>
          <h2>{section.title}</h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {section.items ? (
            <ul>
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}
      {guide.example ? (
        <section className="pc-step" id="product-example">
          <h2>{guide.example.title}</h2>
          <p>{guide.example.introduction}</p>
          <h3>When it may suit your setup</h3>
          <ul>
            {guide.example.fits.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="diagnosis-table spec-table">
            <table>
              <caption>
                Details checked in the manufacturer’s specifications
              </caption>
              <tbody>
                {guide.example.specs.map((spec) => (
                  <tr key={spec.label}>
                    <th scope="row">{spec.label}</th>
                    <td>{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h3>
            When to choose something else, and what to check before buying
          </h3>
          <ul>
            {guide.example.cautions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p>
            This example is based on the manufacturer’s specifications. It is
            not a recommendation based on hands-on testing or recording
            comparisons.
          </p>
          <aside
            className="affiliate-box"
            aria-label="Advertisement: consider only if it fits your needs"
          >
            <span className="affiliate-label">
              Advertisement / affiliate link
            </span>
            <p>
              Consider it only if it suits the setup described above and the
              microphone you already have is insufficient. Verify the exact
              model, compatibility, price and stock at the seller. This link
              opens Amazon Japan.
            </p>
            <AffiliateLink
              asin={guide.example.asin}
              articlePath={path}
              position="after-fit-check"
              className="affiliate-button"
            >
              View 400-MC017 details on Amazon Japan <ExternalLink size={15} />
            </AffiliateLink>
            <small>
              As an Amazon Associate, Gemnao earns from qualifying purchases.
            </small>
          </aside>
        </section>
      ) : null}
      <section className="pc-step" id="setup">
        <h2>{guide.setupTitle}</h2>
        <ol>
          {guide.setup.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </section>
    </EnglishGuideShell>
  );
}
