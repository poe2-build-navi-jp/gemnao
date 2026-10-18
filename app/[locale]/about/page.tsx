/* oxlint-disable next/no-html-link-for-pages -- Native links avoid the existing vinext client-link runtime issue. */
import { notFound } from 'next/navigation';
import { EnglishStaticPage } from '@/components/english-static-page';
import { englishEditorialMetadata } from '@/lib/localized/editorial-metadata';
import { siteConfig } from '@/lib/site-config';
const info = {
  title: 'About Gemnao: Operator and Editorial Policy',
  description:
    'Gemnao is a PC game, Discord and Windows troubleshooting site operated by Okapi Research Institute. Find symptom-based checks, settings and next steps based on the result.',
  checkedAt: '2026-10-18',
};
export const generateStaticParams = () => [{ locale: 'en' }];
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return (await params).locale === 'en'
    ? englishEditorialMetadata('/about', info)
    : {};
}
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  if ((await params).locale !== 'en') notFound();
  return (
    <EnglishStaticPage path="/about" type="AboutPage" {...info}>
      <h2>What you can find here</h2>
      <p>
        Search by game or symptom for how to open a setting, interpret a check
        and choose the next step if it does not help. Articles are free to read.
        We do not perform individual repairs or data recovery on your behalf.
      </p>
      <ul>
        <li>
          <a href="/en/guide">General PC game guides</a>: launch, crashes, FPS,
          saves and mods.
        </li>
        <li>
          <a href="/en/discord">Discord troubleshooting</a>: audio, connections,
          screen sharing and bots.
        </li>
        <li>
          <a href="/en/pc">PC and Windows troubleshooting</a>: audio after
          updates, Wi-Fi, USB and displays.
        </li>
        <li>
          <a href="/en/discord-servers">Discord server directory</a>: finding
          Japanese-speaking PC game communities and free listing applications
          for administrators.
        </li>
      </ul>
      <h2>Site operator</h2>
      <dl>
        <dt>Operator</dt>
        <dd>Okapi Research Institute</dd>
        <dt>Email</dt>
        <dd>
          <a href={`mailto:${siteConfig.contactEmail}`}>
            {siteConfig.contactEmail}
          </a>
        </dd>
      </dl>
      <h2>Editing and sources</h2>
      <p>
        We prioritize official support, developers and official stores. When
        additional evidence is needed, we compare reliable technical
        documentation or multiple user reports. We summarize in our own words
        and link to sources rather than reproducing external text or images.
      </p>
      <h2>Updates and corrections</h2>
      <p>
        Articles show their last review date. We recheck material when major
        updates or official fixes change it. When an error is reported, we
        review the sources and test conditions and correct the text and review
        date as needed.
      </p>
      <h2>Reading the numbers</h2>
      <p>
        Demand is a relative editorial estimate based on play trends and public
        information, not an exact player count. “Having trouble” and “Fixed”
        totals count anonymous responses on Gemnao, not guaranteed distinct
        people.
      </p>
      <h2>Advertising and affiliate links</h2>
      <p>
        We may display advertising such as Google AdSense to support operation,
        clearly separated from editorial content. We participate in the Amazon
        Associates program. As an Amazon Associate, Gemnao earns from qualifying
        purchases. Pages or links containing affiliate advertising are labeled
        Ad or PR. Product descriptions are edited from verified facts such as
        official manufacturer information.
      </p>
      <h2 id="contact">Contact</h2>
      <p>
        For corrections, rights matters or other inquiries, email{' '}
        <a href={`mailto:${siteConfig.contactEmail}`}>
          {siteConfig.contactEmail}
        </a>{' '}
        or use the <a href="/en/contact">contact form</a>. A reply email address
        on the form is optional.
      </p>
      <section id="business">
        <h2>For PC and peripheral manufacturers</h2>
        <p>
          We publish usage and troubleshooting guides for readers investigating
          PC gaming problems. You may contact us about corrections to official
          product information or proposals for testing loan equipment. We review
          the scope, equipment and timing before deciding whether we can accept
          a project.
        </p>
        <h3>Published content and features</h3>
        <ul>
          <li>
            <a href="/en/guide">Symptom-based checks</a> and related game,
            Windows and Discord guides.
          </li>
          <li>
            <a href="/en/tools/windows-diagnosis">
              Windows diagnostic tool and instructions
            </a>
            , with its scope and limits on the download page.
          </li>
          <li>
            <a href="/en/gear/discord-microphone-guide">Checks before buying</a>
            , including when existing equipment or free settings changes may
            suffice.
          </li>
        </ul>
        <h3>Testing and disclosure</h3>
        <ul>
          <li>
            We distinguish official specifications from hands-on testing. We do
            not present an unused product as a hands-on review.
          </li>
          <li>
            For hands-on testing, we state the equipment, settings, software
            version, date and scope. We do not invent measurements or
            experience.
          </li>
          <li>
            We disclose advertising, payment, supplied products and loans in the
            article.
          </li>
          <li>
            We include limits and unsuccessful results relevant to readers. We
            do not guarantee positive coverage, search ranking, views or sales.
          </li>
          <li>
            We separate factual checks from editorial decisions and correct
            errors when found.
          </li>
        </ul>
        <p>
          <a href="/en/contact?category=business#business">
            Send a project inquiry
          </a>
          . An inquiry alone does not establish a contract or guarantee
          publication.
        </p>
      </section>
      <p className="source-note">
        Underlying business and editorial policy reviewed October 3, 2026;
        English adaptation October 18.
      </p>
    </EnglishStaticPage>
  );
}
