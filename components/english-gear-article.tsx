import { EnglishGuideShell } from './english-guide-shell';
import { AffiliateLink } from './affiliate-link';
import type { GearArticle } from '@/lib/gear-articles';
export function EnglishGearArticle({ article: a }: { article: GearArticle }) {
  const offer = (position: 'after-fit-check' | 'after-faq') => (
    <aside className="affiliate-box" aria-label="Advertisement">
      <span className="affiliate-label">Advertisement / affiliate link</span>
      <p>
        Check the exact model, compatibility, price and stock at the seller.
        This link opens Amazon Japan.
      </p>
      <AffiliateLink
        asin={a.product.asin}
        articlePath={`/en/gear/${a.slug}`}
        position={position}
        className="affiliate-button"
      >
        View Stream Deck + XL on Amazon Japan
      </AffiliateLink>
      <small>
        As an Amazon Associate, Gemnao earns from qualifying purchases.
      </small>
    </aside>
  );
  return (
    <EnglishGuideShell
      guide={{
        ...a,
        path: `/gear/${a.slug}`,
        category: 'Gaming equipment',
        summary: a.answer,
        sourcePolicy:
          'English adaptation of the Japanese specification guide reviewed September 30, 2026. Manufacturer specifications and the comparison table are the basis of this guide; this is not a hands-on test. Prices are omitted because they vary by seller and date. The event announcement is historical.',
        sources: a.sources.map((s) => ({ label: s.title, url: s.url })),
      }}
      affiliate
      contents={[
        { id: 'fit', title: 'Who it suits' },
        { id: 'specs', title: 'Specifications' },
        { id: 'features', title: 'Features' },
        { id: 'before-buying', title: 'Before buying' },
        { id: 'compare', title: 'Compare models' },
      ]}
    >
      <section className="pc-step" id="fit">
        <h2>Who it suits</h2>
        <ul>
          {a.fits.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
        <h3>When to consider something else</h3>
        <ul>
          {a.notFits.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </section>
      {offer('after-fit-check')}
      <section className="pc-step" id="specs">
        <h2>Specifications</h2>
        <div className="diagnosis-table spec-table">
          <table>
            <caption>Elgato Stream Deck + XL</caption>
            <tbody>
              {a.specs.map((x) => (
                <tr key={x.label}>
                  <th scope="row">{x.label}</th>
                  <td>{x.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="pc-step" id="features">
        <h2>Features</h2>
        {a.features.map((x) => (
          <div key={x.title}>
            <h3>{x.title}</h3>
            <p>{x.body}</p>
          </div>
        ))}
      </section>
      <section className="caution-block" id="before-buying">
        <h2>Before buying</h2>
        <ul>
          {a.beforeBuying.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </section>
      {a.compare && (
        <section className="diagnosis-table" id="compare">
          <h2>Compare models</h2>
          <table>
            <caption>{a.compare.caption}</caption>
            <thead>
              <tr>
                {a.compare.headers.map((x) => (
                  <th scope="col" key={x}>
                    {x}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {a.compare.rows.map((row) => (
                <tr key={row[0]}>
                  {row.map((x, i) =>
                    i === 0 ? (
                      <th scope="row" key={i}>
                        {x}
                      </th>
                    ) : (
                      <td key={i} data-label={a.compare!.headers[i]}>
                        {x}
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
      <p className="source-policy">{a.notice}</p>
    </EnglishGuideShell>
  );
}
