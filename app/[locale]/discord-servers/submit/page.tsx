/* oxlint-disable next/no-html-link-for-pages -- Native links avoid the existing vinext client-link runtime issue. */
import { notFound } from 'next/navigation';
import { EnglishStaticPage } from '@/components/english-static-page';
import { DiscordServerSubmitForm } from '@/components/discord-server-submit-form';
import { englishEditorialMetadata } from '@/lib/localized/editorial-metadata';
const info = {
  title: 'Apply for a Free Discord Server Listing',
  description:
    'List a Japanese-speaking PC game community. Applications are reviewed before publication and do not appear immediately.',
  checkedAt: '2026-10-18',
};
export const generateStaticParams = () => [{ locale: 'en' }];
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return (await params).locale === 'en'
    ? {
        ...englishEditorialMetadata('/discord-servers/submit', info),
        robots: { index: false, follow: true },
      }
    : {};
}
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  if ((await params).locale !== 'en') notFound();
  return (
    <EnglishStaticPage path="/discord-servers/submit" {...info}>
      <div className="submission-policy">
        <strong>Before applying</strong>
        <ul>
          <li>You must be authorized to administer the server.</li>
          <li>
            The server must not promote dating/adult content, real-money
            trading, account sales, cheating or piracy.
          </li>
          <li>The invite and recruitment conditions must be accurate.</li>
          <li>
            You must be able to reconfirm ongoing recruitment periodically.
          </li>
        </ul>
      </div>
      <p>
        For server bots, see{' '}
        <a href="/en/discord/bot-add">adding a Discord bot</a> or{' '}
        <a href="/en/discord/bot-not-responding">
          checking bot and command permissions
        </a>
        .
      </p>
      <DiscordServerSubmitForm locale="en" />
    </EnglishStaticPage>
  );
}
