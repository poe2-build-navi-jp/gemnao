/* oxlint-disable next/no-html-link-for-pages -- Native links avoid the existing vinext client-link runtime issue. */
import { notFound } from 'next/navigation';
import { EnglishStaticPage } from '@/components/english-static-page';
import { englishEditorialMetadata } from '@/lib/localized/editorial-metadata';
const info = {
  title: 'Discord Server Listing Guidelines',
  description:
    'Listing standards for PC gaming communities that remain open to new members.',
  checkedAt: '2026-10-18',
};
export const generateStaticParams = () => [{ locale: 'en' }];
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return (await params).locale === 'en'
    ? englishEditorialMetadata('/discord-servers/guidelines', info)
    : {};
}
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  if ((await params).locale !== 'en') notFound();
  return (
    <EnglishStaticPage path="/discord-servers/guidelines" {...info}>
      <h2>Eligible servers</h2>
      <p>
        Servers must primarily concern PC gaming and make participation
        requirements and prohibited conduct available in Japanese. Applicants
        must have authority to administer the server.
      </p>
      <h2>Excluded content</h2>
      <p>
        We do not list servers involving adult/dating content, harassment or
        raids, cheating, cracks, piracy, real-money trading, account sales,
        scams, malware, illegal activity or exposing individuals’ personal
        information.
      </p>
      <h2>Review and publication</h2>
      <p>
        We review the application, invite and participation conditions before
        publication. Applying does not guarantee a listing. False, incomplete or
        unverifiable-authority applications may be held or rejected.
      </p>
      <h2>Activity confirmation and suspension</h2>
      <p>
        The activity-confirmed date is when the administrator confirmed
        recruitment continues. Listings are suspended if confirmation is
        unavailable for 30 days or more, the invite is invalid or recruitment
        has ended. We do not collect Discord messages or DMs without
        authorization.
      </p>
      <h2>Reports and removal</h2>
      <p>
        Report expired invites, discrepancies, misconduct or scams. A report
        does not automatically delete a listing: we review it and decide whether
        to disable joining, request a correction or suspend the listing. Urgent
        cases may be temporarily suspended during review.
      </p>
      <h2>Unofficial service</h2>
      <p>
        Gemnao’s directory is unaffiliated with Discord Inc. Discord and game
        names/trademarks belong to their respective owners.
      </p>
      <h2>Applications and inquiries</h2>
      <p>
        Submit a free{' '}
        <a href="/en/discord-servers/submit">listing application</a>. For
        listing corrections/deletion or rights matters, use the{' '}
        <a href="/en/contact">contact form</a>.
      </p>
      <p>Established September 16, 2026.</p>
    </EnglishStaticPage>
  );
}
