/* oxlint-disable next/no-html-link-for-pages -- Native links avoid the existing vinext client-link runtime issue. */
import { notFound } from 'next/navigation';
import { EnglishStaticPage } from '@/components/english-static-page';
import { englishEditorialMetadata } from '@/lib/localized/editorial-metadata';
const info = {
  title: 'Privacy Policy',
  description:
    'How Gemnao handles anonymous responses, browser-stored PC information and notes, inquiries, analytics, advertising and affiliate links.',
  checkedAt: '2026-10-18',
};
export const generateStaticParams = () => [{ locale: 'en' }];
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return (await params).locale === 'en'
    ? englishEditorialMetadata('/privacy', info)
    : {};
}
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  if ((await params).locale !== 'en') notFound();
  return (
    <EnglishStaticPage path="/privacy" {...info}>
      <h2>Problem and resolution response counts</h2>
      <p>
        “Having trouble” and “Fixed” buttons store counts by game, item and
        selected step. To display increases in problem reports, we also store
        the target, response type and recorded time. Records older than 30 days
        are removed when a new record is written. We do not store names, email
        addresses or identifying input with these responses. A marker in your
        browser helps reduce repeated responses from the same browser.
      </p>
      <p>
        On articles supporting per-method results, pressing “This fixed it” or
        “Tried it, not fixed” sends the article symptom, step and outcome to
        this site. Each response receives a random submission number used only
        for that response, to prevent duplicate counts after interruption or
        retry. The server stores that number, target, outcome and submission
        time; entries older than 30 days are removed when a new response is
        written. Your browser also stores a response marker and any unconfirmed
        submission number. We do not create a shared identifier or fingerprint
        to track a person or device. Anonymous cumulative counts remain stored.
        After receipt is confirmed, Google Analytics may receive an additional
        event containing only the fixed/not-fixed outcome and public article
        URL. It does not contain the submission number, step name, free text, PC
        information, notes, settings or diagnostic input.
      </p>
      <h2>My Games, diagnosis results and troubleshooting notes</h2>
      <p>
        Selected games, registered PC details, diagnosis results, changed
        settings and notes are stored in your browser’s localStorage. Note
        contents are not sent to this site’s server or analytics. Anonymous
        resolution responses are a separate feature. When fetching official news
        for selected games, the game identifiers are sent to this site, without
        your registered PC details or notes.
      </p>
      <p>
        These records do not automatically sync across browsers or devices.
        Clearing site data or ending private browsing can remove them. You can
        edit/delete notes and save or restore a backup file on your device from
        My page. Other users of a shared PC may see the records. Do not enter
        personal information, passwords or authentication codes.
      </p>
      <h2 id="game-requests">Game requests</h2>
      <p>
        When request intake is available, the requested game name,
        submission-screen language, receipt/processing times and handling status
        are stored in a private Cloudflare D1 database. Authorized operators and
        processing systems use them to identify games, consider articles and
        prevent duplicate intake. Submitted text is not published verbatim or
        sent to analytics. Do not enter names, contact details, addresses or
        passwords. Submission does not guarantee an article.
      </p>
      <p>
        To limit abuse, a temporary identifier is derived from the connecting IP
        address using a private value that changes daily, and stored with
        submission time/date. This intake database does not store the raw IP
        address. This is separate from Cloudflare delivery/security processing
        and ordinary analytics.
      </p>
      <p>
        Manually handled requests are retained privately without automatic
        deletion until the operator reviews the retention policy; no retention
        period is currently set. New intake stops at 500 stored requests,
        including existing requests. Marking a request accepted or deferred does
        not free a slot. During intake processing, count records older than 48
        hours and identifier-generation values more than 48 hours old are
        deleted. Deletion waits for the next successful database intake
        operation and is not guaranteed at exactly 48 hours. Cleanup may also
        wait while intake is disabled or capacity is full. Use the contact form
        for deletion inquiries. The request never includes your browser’s My
        Games list, PC details or troubleshooting notes.
      </p>
      <h2>User problem reports: published preparation policy</h2>
      <p>
        The Japanese policy describes this feature as not yet enabled for
        intake/publication. Its proposed fields are game, symptom article,
        attempted steps and self-reported outcome, with optional version, OS,
        GPU manufacturer, the reporter’s check date and source URL. It does not
        accept logs, attachments, names, contact details or other people’s
        personal information. Submission follows a public-content preview and
        consent; publication follows operator review. Corrections or changed
        evidence return the report to private review.
      </p>
      <p>
        Drafts and the owner key for editing are saved in this browser and
        excluded from existing My Games backups. A report ID alone cannot
        edit/delete it. Keys cannot be recovered after changing devices or
        clearing storage. Report screens do not load analytics or advertising
        and do not send report text, keys or optional fields to Google
        Analytics. Submission date, the reporter’s check date and the operator’s
        evidence-review date are distinct. Approval or report counts do not
        prove causation or independent verification.
      </p>
      <p>
        Report text is deleted 30 days after initial intake; updates do not
        extend this period. Owner deletion removes public content and previous
        text, although a browser draft may remain. A separate deletion ledger
        without report text records the report ID, accepted/deleted state and
        final expiry to prevent deleted content reappearing or intake slots
        being restored. Per-ID records last at most 31 days, covering the
        maximum period text accepted under that ID can remain; only the lifetime
        intake count persists. If the ledger is unavailable, content is not
        published and deletion is not shown as successful. Republishing into
        articles is disabled, and longer-term reuse requires separate consent,
        never inferred from the current consent. Existing data retention and
        deletion processes are not changed by this policy.
      </p>
      <h2>Read later and recently viewed articles</h2>
      <p>
        Saved article titles, paths and save times, plus recently viewed
        history, are stored in this browser’s localStorage. The complete saved
        list/history is not sent to this site’s server or analytics. You can
        remove saved items individually from My page. These records do not sync
        between devices and are lost when site data is cleared. This is separate
        from the browser’s own bookmarks.
      </p>
      <h2>Analytics</h2>
      <p>
        Gemnao uses Google Analytics to understand usage and improve the site.
        It uses cookies and similar technologies to collect browsing information
        without directly identifying you.
      </p>
      <p>
        After adding a game is successfully saved in the browser, an additional
        analytics event records that operation. It excludes the selected game’s
        name/identifier, PC details, notes and the originating page’s URL/title.
        Aggregated user counts are not published on the site.
      </p>
      <p>
        When an Amazon product link is clicked, an additional event sends the
        article path, public product identifier (ASIN) and link position. It
        excludes query strings, fragments, names and email addresses. This
        measures a click, not purchase completion or spending.
      </p>
      <p>
        Analytics also counts successful new read-later saves, opening saved
        articles and related-article clicks. Save/reuse events exclude saved
        article names/paths, history, PC details, notes and custom user IDs; the
        originating URL/title is replaced with fixed values. Related-article
        clicks use the public referring article URL without query
        strings/fragments. Note save/reuse events exclude game versions, note
        content and PC details. These are separate from ordinary page-view
        tracking. Share-link clicks and link copying may be measured, but
        completed social posts or browser bookmarking cannot be confirmed. These
        totals are not published on the site.
      </p>
      <h2>Advertising</h2>
      <p>
        Third-party vendors such as Google may use cookies, web beacons and IP
        addresses to display ads based on previous visits to this and other
        sites. Google and its partners use advertising cookies to serve ads
        based on browsing activity.
      </p>
      <p>
        You can disable personalized ads in{' '}
        <a
          href="https://adssettings.google.com/"
          target="_blank"
          rel="noreferrer"
        >
          Google Ad Settings
        </a>
        . See{' '}
        <a
          href="https://support.google.com/adsense/answer/9012903"
          target="_blank"
          rel="noreferrer"
        >
          Google’s information about third-party vendors
        </a>
        .
      </p>
      <h2>Affiliate programs</h2>
      <p>
        Gemnao participates in the Amazon Associates program, an affiliate
        advertising program designed to provide fees for advertising and linking
        to Amazon.co.jp. After following an Amazon link, Amazon may use cookies
        or similar technology to measure purchases. Purchases and
        personal-information handling on Amazon are governed by Amazon’s privacy
        notice.
      </p>
      <h2>Consent management in the EEA, UK and Switzerland</h2>
      <p>
        When serving ads in these regions, we use a configuration capable of
        obtaining required consent through a Google-certified consent management
        platform. Availability of the consent screen also depends on Google
        AdSense Privacy &amp; messaging settings.
      </p>
      <h2>Contact form</h2>
      <p>
        The form stores inquiry category, target page URL, message and optional
        reply email address. These are used as needed to handle the inquiry,
        review rights and improve article quality, and are not sold to third
        parties. Without a reply address, we cannot send an individual response.
      </p>
      <h2>Personal information and server applications</h2>
      <p>
        Discord listing applications store server name, invite URL, game,
        recruitment requirements, description, administrator Discord username
        and reply email. These are used for review, authority checks,
        reconfirming active recruitment and managing the listing. Administrator
        contact details are not shown publicly.
      </p>
      <p>
        Except where required by law, information obtained through forms is not
        used outside its purpose or provided to third parties without consent.
        For access, correction or deletion inquiries, use the{' '}
        <a href="/en/contact">contact form</a>.
      </p>
      <h2>External links</h2>
      <p>
        We are not responsible for information or personal-information handling
        provided by external sites.
      </p>
      <h2>Revisions</h2>
      <p>
        This policy may change in response to legal or operational changes.
        Established September 6, 2026; underlying Japanese policy revised
        October 6, 2026. English adaptation reviewed October 18, 2026.
      </p>
    </EnglishStaticPage>
  );
}
