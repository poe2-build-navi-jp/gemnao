/* oxlint-disable next/no-html-link-for-pages -- Native links avoid the existing vinext client-link runtime issue. */
import { notFound } from 'next/navigation';
import { EnglishStaticPage } from '@/components/english-static-page';
import { englishEditorialMetadata } from '@/lib/localized/editorial-metadata';
const info = {
  title: 'Terms of Use and Disclaimer',
  description: 'Read these conditions before using information on Gemnao.',
  checkedAt: '2026-10-18',
};
export const generateStaticParams = () => [{ locale: 'en' }];
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return (await params).locale === 'en'
    ? englishEditorialMetadata('/terms', info)
    : {};
}
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  if ((await params).locale !== 'en') notFound();
  return (
    <EnglishStaticPage path="/terms" {...info}>
      <h2>Accuracy of information</h2>
      <p>
        We aim to publish accurate information at the time of writing. Game, OS,
        driver and mod updates may make instructions outdated.
      </p>
      <h2>Your responsibility</h2>
      <p>
        You are responsible for configuration changes, mod installation and save
        transfers. Make backups first. For online games, follow the game’s terms
        and anti-cheat requirements.
      </p>
      <h2>Copyright and trademarks</h2>
      <p>
        Game names, images and trademarks belong to their respective owners.
        Gemnao is not an official site affiliated with the developers or
        publishers.
      </p>
      <h2>Prohibited conduct</h2>
      <p>
        Unauthorized copying or redistribution of this site’s text, unauthorized
        access and interference with its operation are prohibited.
      </p>
      <h2>Discord server listings</h2>
      <p>
        Listings are reviewed before publication. False information, adult or
        dating content, real-money trading, account sales, cheats, piracy,
        scams, malware and illegal activity are prohibited. See the{' '}
        <a href="/en/discord-servers/guidelines">listing guidelines</a>. This is
        an unofficial service unaffiliated with Discord Inc.
      </p>
      <h2>Mods and external tools</h2>
      <p>
        We cover ordinary mods from legitimate distributors, configuration
        changes and conflict resolution. We do not publish instructions for
        cracks, DRM circumvention, piracy, unauthorized unlocking of paid
        content or online cheating.
      </p>
      <h2>Contact</h2>
      <p>
        Use the <a href="/en/contact">contact form</a> to report rights
        infringements, incorrect information or privacy concerns.
      </p>
    </EnglishStaticPage>
  );
}
