/* oxlint-disable next/no-html-link-for-pages -- Native links avoid the existing vinext client-link runtime issue. */
import { notFound } from 'next/navigation';
import { EnglishStaticPage } from '@/components/english-static-page';
import { englishEditorialMetadata } from '@/lib/localized/editorial-metadata';
import { gearArticlesEn } from '@/lib/localized/gear-articles-en';
import { gearGuidesEn } from '@/lib/localized/gear-guides-en';
const title = 'Gaming Equipment: Features and Checks Before Buying';
const description =
  'Start with the problem and check whether your existing equipment is enough. If you need something extra, compare ports, operating systems, desk space and your intended use.';
export const generateStaticParams = () => [{ locale: 'en' }];
export const generateMetadata = () =>
  englishEditorialMetadata('/gear', {
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
      path="/gear"
      title={title}
      description={description}
      type="CollectionPage"
    >
      <section className="caution-block">
        <h2>Start with the problem before buying</h2>
        <ul>
          <li>
            Quiet or missing voice: try{' '}
            <a href="/en/discord/mic-volume-low">free input-setting checks</a>,
            then use the{' '}
            <a href="/en/gear/discord-microphone-guide">microphone guide</a> to
            decide whether another microphone is needed.
          </li>
          <li>
            Keep a separate save copy:{' '}
            <a href="/en/tools/save-locations">find the save folder</a> and
            compare{' '}
            <a href="/en/gear/save-backup-storage-guide">
              existing storage and required capacity
            </a>
            .
          </li>
          <li>
            Combine streaming or editing controls: list frequent actions and
            check whether keyboard shortcuts suffice, then compare{' '}
            <a href="/en/gear/stream-deck-plus-xl">
              Stream Deck + XL with a smaller model
            </a>
            .
          </li>
          <li>
            Crashes or poor performance: work through{' '}
            <a href="/en/guide">troubleshooting by symptom</a> before replacing
            a GPU or PC without knowing the cause.
          </li>
        </ul>
      </section>
      <h2>Choosing equipment and checking compatibility</h2>
      <div className="guide-index-grid">
        {[...gearGuidesEn, ...gearArticlesEn].map((a) => (
          <a href={`/en/gear/${a.slug}`} key={a.slug}>
            <strong>{a.shortTitle}</strong>
            <span>{a.lead}</span>
            <small>View features and checks</small>
          </a>
        ))}
      </div>
      <p className="source-policy">
        Some articles contain advertising through Amazon Associate links.
        Specifications are based on manufacturer information. Prices are omitted
        because they vary by seller and date.
      </p>
    </EnglishStaticPage>
  );
}
