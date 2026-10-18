/* oxlint-disable next/no-html-link-for-pages -- Native links avoid the existing vinext client-link runtime issue. */
import { notFound } from 'next/navigation';
import { EnglishStaticPage } from '@/components/english-static-page';
import { DiscordServerDirectory } from '@/components/discord-server-directory';
import { englishEditorialMetadata } from '@/lib/localized/editorial-metadata';
export const dynamic = 'force-dynamic';
const info = {
  title: 'Find Japanese-Speaking PC Gaming Discord Servers',
  description:
    'Compare games, play times, voice-chat requirements and joining conditions. If no reviewed listing is available, use Discord’s official directory. Administrators can apply for a free listing.',
  checkedAt: '2026-10-18',
};
const faq = [
  [
    'Why does an invite fail?',
    'Check the administrator’s current invite if it is expired or invalid. For a server-limit warning, follow Discord’s official instructions. An application-based server may require approval. Do not evade a ban with another account; follow the server’s appeal instructions.',
  ],
  [
    'What is a Discord server?',
    'A community using text and voice channels. PC gaming servers can help players find friends, regular parties and shared information.',
  ],
  [
    'How do I find a server?',
    'Filter listed communities by game, purpose, schedule and voice requirements. Otherwise use Discord’s official web directory or Discover → Servers where available. Discord’s reviewed guide describes a limited-user experiment and desktop search; use the web directory or an administrator’s public invite if the feature is absent.',
  ],
  [
    'How do I join?',
    'Open a valid invite or use the + in Discord’s server list → Join a Server and paste the invite. Check the rules and privacy settings first.',
  ],
  [
    'Can I create a server?',
    'Yes. Use + in the server list, choose Create My Own or a template, and name the server. Creation is free.',
  ],
  [
    'Does using the directory cost anything?',
    'Gemnao charges no fee to browse listings, inspect details or follow a Discord invite. Check each server’s own joining conditions.',
  ],
  [
    'Can I list a server for free?',
    'An authorized administrator can apply with the server name, game, purpose, activity times, voice requirements, joining conditions, rules and invite. Review is required; publication is not immediate.',
  ],
  [
    'What does recruitment confirmed mean?',
    'The displayed date is when the administrator confirmed that recruitment continues. We do not collect Discord message counts or member behavior to determine this.',
  ],
  [
    'What should I do with an expired invite?',
    'Invites can expire, reach their use limit or be paused. Report the server name and listing URL through Contact. After review we may disable joining or suspend the listing.',
  ],
  [
    'Can I find servers without speaking?',
    'When listings exist, choose No voice chat or Listening only allowed. The former does not use calls; the latter permits participation without speaking. Check the server’s actual rules.',
  ],
];
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return (await params).locale === 'en'
    ? englishEditorialMetadata('/discord-servers', info)
    : {};
}
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  if ((await params).locale !== 'en') notFound();
  return (
    <EnglishStaticPage path="/discord-servers" type="CollectionPage" {...info}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faq.map(([question, answer]) => ({
              '@type': 'Question',
              name: question,
              acceptedAnswer: { '@type': 'Answer', text: answer },
            })),
          }),
        }}
      />
      <div className="server-hero-actions server-hero-actions-light">
        <a
          href="https://discord.com/servers/gaming"
          target="_blank"
          rel="noopener noreferrer"
        >
          Discord’s gaming directory
        </a>
        <a href="#server-search-title">Find a listing →</a>
        <a href="/en/discord-servers/submit">Apply for a free listing</a>
      </div>
      <section className="server-intro" aria-labelledby="server-intro-title">
        <div>
          <h2 id="server-intro-title">Discord server basics</h2>
          <p>
            A server listing invites players into a community for playing
            together and sharing information. Compare the game, schedule,
            purpose, voice requirements and joining conditions. If no listing
            fits, use Discord’s public directory or an administrator’s published
            invitation for a private community.
          </p>
          <a
            href="https://support.discord.com/hc/ja/articles/33023827550359"
            target="_blank"
            rel="noopener noreferrer"
          >
            Discord’s server setup guide (Japanese)
          </a>
        </div>
        <ul>
          <li>Filter by game and purpose.</li>
          <li>
            Compare required, optional or listening-only voice participation.
          </li>
          <li>See when recruitment was reconfirmed.</li>
          <li>Report expired invites or inappropriate listings.</li>
        </ul>
      </section>
      <DiscordServerDirectory
        locale="en"
        initialServers={[]}
        initialLoading
        initialLoadFailed={false}
      />
      <section className="server-howto" aria-labelledby="server-howto-title">
        <h2 id="server-howto-title">Find, join or create a server</h2>
        <div className="server-howto-grid">
          <article>
            <h3>Find a server</h3>
            <p>
              Use the filters above. If listings are absent, open Discover →
              Servers where available: the reviewed official guidance places
              Discover below the desktop server list or at the bottom on mobile.
              Availability is experimental for some users; name search is
              described for desktop, with mobile category browsing. If absent,
              use the web directory or an administrator’s public invite.
            </p>
            <a
              href="https://discord.com/servers/gaming"
              target="_blank"
              rel="noopener noreferrer"
            >
              Official gaming directory →
            </a>
            <a
              href="https://support.discord.com/hc/en-us/articles/25323248535319-Discover-Tab"
              target="_blank"
              rel="noopener noreferrer"
            >
              Discord: Discover Tab →
            </a>
          </article>
          <article>
            <h3>Join a server</h3>
            <p>
              Open an invite, or select + in the server list → Join a Server and
              paste the invite. Read the rules and privacy settings before
              joining.
            </p>
            <a
              href="https://support.discord.com/hc/ja/articles/360034842871"
              target="_blank"
              rel="noopener noreferrer"
            >
              Official joining instructions (Japanese) →
            </a>
          </article>
          <article>
            <h3>Create a server</h3>
            <p>
              Use +, choose Create My Own or a template, then name the server.
              Creating one is free. Review invite settings before public
              recruitment.
            </p>
            <a
              href="https://support.discord.com/hc/ja/articles/33023827550359"
              target="_blank"
              rel="noopener noreferrer"
            >
              Official creation instructions (Japanese) →
            </a>
          </article>
        </div>
      </section>
      <section className="server-match" aria-labelledby="server-match-title">
        <h2 id="server-match-title">Compare the listing before joining</h2>
        <p>
          A large member count alone does not show whether a server suits you.
          For example, a beginner available at 21:00 on weekdays can compare
          these four points.
        </p>
        <div className="server-match-table">
          <table>
            <thead>
              <tr>
                <th scope="col">Check</th>
                <th scope="col">Example details</th>
                <th scope="col">If it does not fit</th>
              </tr>
            </thead>
            <tbody>
              {[
                [
                  'Game and play style',
                  'PC edition, cross-play, beginner support, ranked or co-op',
                  'Filter by purpose as well as game.',
                ],
                [
                  'Schedule',
                  'Weekdays/weekends, start time, region and timezone',
                  'Choose times you can actually attend.',
                ],
                [
                  'Voice and requirements',
                  'Required/optional/listening-only voice, age and rank',
                  'If you cannot speak, choose listening-only or no voice.',
                ],
                [
                  'Ongoing recruitment and rules',
                  'Confirmation date, valid invite, rules and first-read channel',
                  'Report an expired invite and look for another listing.',
                ],
              ].map((r) => (
                <tr key={r[0]}>
                  <th scope="row">{r[0]}</th>
                  <td data-label="Example details">{r[1]}</td>
                  <td data-label="If it does not fit">{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Recruitment confirmation is an administrator statement, not a
          guarantee of concurrent players or daily conversation volume.
        </p>
      </section>
      <section
        className="server-recruitment"
        aria-labelledby="server-recruitment-title"
      >
        <h2 id="server-recruitment-title">Recruit for your own server</h2>
        <ol>
          <li>
            Open the target server and use its Invite option, such as beside a
            channel name. Check expiry and use limits for the recruitment
            period.
          </li>
          <li>
            State the game, purpose, days/times, voice conditions, joining
            requirements and rules. Example only: “PC co-op / weekdays
            21:00–23:00 / beginners welcome / voice optional / no abuse.” This
            is not a real listing.
          </li>
          <li>
            Enter the invite and conditions in the{' '}
            <a href="/en/discord-servers/submit">free application form</a>.
            Administration and contact details are reviewed before publication.
          </li>
        </ol>
        <p>
          See{' '}
          <a
            href="https://support.discord.com/hc/ja/articles/208866998"
            target="_blank"
            rel="noopener noreferrer"
          >
            Discord: Invites 101 (Japanese)
          </a>{' '}
          for invite settings.
        </p>
      </section>
      <section className="server-safety" aria-labelledby="server-safety-title">
        <div>
          <h2 id="server-safety-title">Before joining</h2>
          <p>
            Do not give strangers your real name, address, phone number or
            account details. Avoid and report listings demanding external
            downloads, money, account trading or cheats.
          </p>
          <a href="/en/discord-servers/guidelines">
            Read the listing guidelines →
          </a>
        </div>
      </section>
      <section className="server-faq" aria-labelledby="server-faq-title">
        <h2 id="server-faq-title">Frequently asked questions</h2>
        <div>
          {faq.map(([q, a]) => (
            <details key={q}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>
      <section className="server-related">
        <h2>Discord and bot troubleshooting</h2>
        <p>
          Find voice/screen-sharing checks and administrator steps for bot
          installation and permissions.
        </p>
        <a href="/en/discord/bot-add">Add a Discord bot →</a>
        <a href="/en/discord/bot-not-responding">
          Bot or commands not responding →
        </a>
        <a href="/en/discord">All Discord troubleshooting →</a>
      </section>
    </EnglishStaticPage>
  );
}

export const generateStaticParams = () => [{ locale: "en" }];
