/* oxlint-disable next/no-html-link-for-pages -- Native links avoid the existing vinext client-link runtime issue. */
import { notFound } from 'next/navigation';
import { EnglishStaticPage } from '@/components/english-static-page';
import { englishEditorialMetadata } from '@/lib/localized/editorial-metadata';
import { weeklyReportsEn } from '@/lib/localized/weekly-reports-en';
const title = 'PC Gaming Weekly: Official Patches, Outages and Error Notices';
const description =
  'Weekly archives of official PC game patches, maintenance, error codes and release notices, with links to the original announcements and troubleshooting guides.';
export const generateStaticParams = () => [{ locale: 'en' }];
export const generateMetadata = () =>
  englishEditorialMetadata('/weekly', {
    title,
    description,
    checkedAt: '2026-10-18',
  });
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  if ((await params).locale !== 'en') notFound();
  return (
    <EnglishStaticPage
      path="/weekly"
      title={title}
      description={description}
      type="CollectionPage"
    >
      <section className="related-section">
        <h2>Past editions</h2>
        <div>
          {weeklyReportsEn.map((r) => (
            <a key={r.slug} href={`/en/weekly/${r.slug}`}>
              <span>{r.period}</span>
              {r.title}
            </a>
          ))}
        </div>
      </section>
      <p className="source-policy">
        The editorial schedule is to summarize the previous Monday–Sunday period
        around the following Monday. These are historical editions; their
        statements and planned dates describe that reporting period. For current
        service information, check <a href="/en/status">service status</a> and
        the linked official sources.
      </p>
    </EnglishStaticPage>
  );
}
