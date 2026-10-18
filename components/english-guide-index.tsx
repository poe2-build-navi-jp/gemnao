/* oxlint-disable next/no-html-link-for-pages -- Native links match existing guides. */
import { ArrowRight } from 'lucide-react';
import { WikiFooter, WikiHeader } from './wiki-header';
import { guideIndexEn, guideGroupsEn } from '@/lib/localized/guide-index-en';
export function EnglishGuideIndex() {
  const guides = guideGroupsEn.flatMap((group) => group.guides);
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: guideIndexEn.title,
    description: guideIndexEn.description,
    url: 'https://gemnao.pages.dev/en/guide',
    inLanguage: 'en',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: guides.length,
      itemListElement: guides.map((guide, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: guide.shortTitle,
        url: `https://gemnao.pages.dev/en${guide.path}`,
      })),
    },
  };
  return (
    <main lang="en">
      <WikiHeader locale="en" pagePath="/guide" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <article className="static-page">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <a href="/en">Home</a>
          <span>›</span>
          <b>PC troubleshooting</b>
        </nav>
        <p className="page-kicker">PC GAME FIX GUIDES</p>
        <h1>{guideIndexEn.title}</h1>
        <p className="page-lead">
          Start with what you see, then compare one reversible change. These{' '}
          {guides.length} English guides cover common Windows PC game problems;
          use the publisher’s instructions for game-specific requirements.
        </p>
        <nav className="symptom-nav" aria-label="Guide categories">
          <strong>What happens?</strong>
          <div>
            {guideGroupsEn.map((group) => (
              <a href={`#${group.id}`} key={group.id}>
                {group.title}
              </a>
            ))}
          </div>
        </nav>
        {guideGroupsEn.map((group) => (
          <section className="guide-category" id={group.id} key={group.id}>
            <h2>{group.title}</h2>
            <p>{group.description}</p>
            <div className="guide-index-grid">
              {group.guides.map((guide) => (
                <a href={`/en${guide.path}`} key={guide.path}>
                  <strong>{guide.shortTitle}</strong>
                  <span>{guide.description}</span>
                  <small>
                    Read the steps <ArrowRight size={14} />
                  </small>
                </a>
              ))}
            </div>
          </section>
        ))}
        <section className="guide-category">
          <h2>Before changing files or drivers</h2>
          <p>
            Record the error and the last change. Keep a separate save backup,
            preserve mod records and avoid overwriting a mod-dependent save
            during a test. Restore settings that do not help. A repaired file or
            one successful launch is evidence to compare, not a guaranteed
            diagnosis.
          </p>
          <p>
            If the entire PC restarts, shows a stop code or loses its display,
            use the relevant Windows or device-maker guidance before repeating
            game-only fixes.
          </p>
          <p>
            <a href="/en/gear/save-backup-storage-guide">
              Choose a save-backup destination
            </a>{' '}
            · <a href="/en#games">Find an English game-specific guide</a>
          </p>
        </section>
      </article>
      <WikiFooter locale="en" />
    </main>
  );
}
