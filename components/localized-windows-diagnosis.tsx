import { PrivateIntakeNotice } from '@/components/private-intake-notice';
/* oxlint-disable next/no-html-link-for-pages -- Native document navigation. */
import { WikiFooter, WikiHeader } from '@/components/wiki-header';
import { windowsDiagnosisGuides } from '@/lib/windows-diagnosis-guide';
import { windowsDiagnosisRelease as release } from '@/lib/windows-diagnosis-release';
export function LocalizedWindowsDiagnosis({ locale }: { locale: 'zh' | 'es' }) {
  const t = windowsDiagnosisGuides[locale];
  const path = `/${locale}/tools/windows-diagnosis`;
  return (
    <main lang={locale === 'zh' ? 'zh-Hans' : locale}>
      <WikiHeader locale={locale} pagePath="/tools/windows-diagnosis" />
      <article className="static-page diagnosis-download">
        <nav aria-label={locale === 'zh' ? '面包屑导航' : 'Ruta de navegación'}>
          <a href={`/${locale}`}>{t.home}</a> › {t.title}
        </nav>
        <h1>{t.title}</h1>
        <p className="page-lead">{t.description}</p>
        <PrivateIntakeNotice locale={locale} />
        <section id="download">
          <h2>{t.download}</h2>
          <div className="download-caution">
            <p>
              <strong>{t.caution}</strong>
            </p>
            <p>{t.language}</p>
            <p>{t.requirements}</p>
          </div>
          {release ? (
            <>
              <p>
                <a
                  className="download-primary"
                  href={`/downloads/${release.file}`}
                  download
                >
                  {t.get} · v{release.version}
                </a>
              </p>
              <p className="download-small">
                {release.bytes.toLocaleString('en-US')} bytes · SHA-256:{' '}
                <code>{release.sha256}</code>
              </p>
            </>
          ) : null}
        </section>
        <section>
          <h2>{t.setup}</h2>
          <ol>
            {t.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>
        <section>
          <h2>{t.privacyTitle}</h2>
          <p>{t.privacy}</p>
          <p>{t.optional}</p>
          <p>{t.storage}</p>
          <p>{t.removal}</p>
        </section>
        <p>
          <a href="/en/tools/windows-diagnosis">{t.more} →</a>
        </p>
        <p>
          <a href={`/${locale}/guide/pc-game-crash`}>{t.fallback} →</a>
        </p>
        <p className="download-small">{t.checked}</p>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'WebPage',
                  name: t.title,
                  description: t.description,
                  url: `https://gemnao.pages.dev${path}`,
                  inLanguage: locale === 'zh' ? 'zh-Hans' : locale,
                },
                {
                  '@type': 'BreadcrumbList',
                  itemListElement: [
                    {
                      '@type': 'ListItem',
                      position: 1,
                      name: t.home,
                      item: `https://gemnao.pages.dev/${locale}`,
                    },
                    {
                      '@type': 'ListItem',
                      position: 2,
                      name: t.title,
                      item: `https://gemnao.pages.dev${path}`,
                    },
                  ],
                },
              ],
            }),
          }}
        />
      </article>
      <WikiFooter locale={locale} />
    </main>
  );
}
