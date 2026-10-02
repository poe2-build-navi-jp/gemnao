import { ogImageFor } from '@/lib/og-images';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { WikiFooter, WikiHeader } from '@/components/wiki-header';
import { languageAlternates } from '@/lib/localized/index';
import { windowsDiagnosisRelease } from '@/lib/windows-diagnosis-release';

const pagePath = '/tools/windows-diagnosis';
const path = `/en${pagePath}`;
const title = 'PC Game Diagnosis for Windows: download and English guide';
const description =
  'Choose your game and symptom, review local Windows records, and keep track of one change at a time. Download information, setup instructions in English, results, history, privacy and the unsigned prototype’s limitations.';
// An older Japanese-only ZIP must never become an English download by relabeling it.
const release = windowsDiagnosisRelease?.languages.includes('en')
  ? windowsDiagnosisRelease
  : null;

export function generateStaticParams() {
  return [{ locale: 'en' }];
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  if ((await params).locale !== 'en') return {};
  return {
    title: { absolute: `${title} | Gemnao` },
    description,
    alternates: { canonical: path, languages: languageAlternates(pagePath) },
    openGraph: {
      type: 'website',
      title,
      description,
      locale: 'en_US',
      url: path,
      images: [ogImageFor('/en/tools/windows-diagnosis')],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageFor('/en/tools/windows-diagnosis')],
    },
  };
}

const symptoms = [
  [
    'Will not launch',
    'The game does not start. Review records around the launch attempt and information about the executable you selected.',
  ],
  [
    'Crashes or closes unexpectedly',
    'The game exits at startup or during play. Review errors associated with the selected game and relevant PC information.',
  ],
  [
    'Black screen',
    'For example, sound continues but no picture appears. You need to describe what was actually on screen.',
  ],
  [
    'Freezes or stops responding',
    'The picture or controls stop responding. Windows may not record an application-hang event.',
  ],
  [
    'Low FPS',
    'Performance is consistently slow. This tool does not measure FPS; it uses your observations.',
  ],
  [
    'Stuttering or brief pauses',
    'Brief pauses or uneven movement. Average FPS alone may not describe this symptom.',
  ],
];

export default async function EnglishWindowsDiagnosis({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  if ((await params).locale !== 'en') notFound();
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://gemnao.pages.dev';
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${siteUrl}${path}#page`,
        url: `${siteUrl}${path}`,
        name: title,
        description,
        inLanguage: 'en',
        dateModified: '2026-10-03',
        isPartOf: { '@id': `${siteUrl}/#website` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${siteUrl}/en`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Tools',
            item: `${siteUrl}/en/tools`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'PC Game Diagnosis',
            item: `${siteUrl}${path}`,
          },
        ],
      },
    ],
  };
  return (
    <main lang="en">
      <WikiHeader locale="en" pagePath={pagePath} />
      <article className="static-page diagnosis-download">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
          }}
        />
        <nav aria-label="Breadcrumb">
          <a href="/en">Home</a> › <a href="/en/tools">Tools</a> › PC Game
          Diagnosis
        </nav>
        <p className="page-kicker">PC GAME DIAGNOSIS · WINDOWS PROTOTYPE</p>
        <h1>
          PC Game Diagnosis for Windows
          <br />
          Choose your game and symptom
        </h1>
        <p className="page-lead">
          If a game will not launch, crashes, shows a black screen, freezes or
          runs poorly, review local diagnostic records and find the next checks
          to try.
        </p>
        <p>
          The general profile lets you select an installed game’s executable.
          Additional game-specific checks are available only for supported
          profiles. Monster Hunter Wilds findings are kept separate from general
          game diagnosis.
        </p>
        <p>
          Guide checked: October 3, 2026 (Japan time) · Gemnao / Okapi
          Laboratory
        </p>
        <aside className="download-caution" aria-labelledby="trial-title">
          <h2 id="trial-title">Before you start: scope and safety</h2>
          <p>
            <strong>
              This is an unsigned prototype. The new version has not been
              verified on a real Windows PC.
            </strong>{' '}
            It cannot guarantee support for every game, identify every cause or
            repair a problem. It does not change PC settings or perform
            automatic repairs. If you are unsure, use the{' '}
            <a href="/en/guide/pc-game-crash">
              written crash troubleshooting guide
            </a>
            .
          </p>
          <p>
            <strong>
              If your game already works again, do not deliberately reproduce
              the problem.
            </strong>{' '}
            Keep the working state. Stop if the whole PC powers off, shows a
            blue screen or becomes unusually hot. Do not repeatedly launch a
            game to reproduce those symptoms.
          </p>
        </aside>
        <nav className="download-toc" aria-label="On this page">
          <a href="#symptoms">Symptoms</a>
          <a href="#download">Download</a>
          <a href="#start">Extract and start</a>
          <a href="#use">Run a check</a>
          <a href="#results">Read results</a>
          <a href="#history">History and removal</a>
          <a href="#privacy">Privacy</a>
          <a href="#help">Help</a>
        </nav>
        <section id="symptoms">
          <h2>What is happening?</h2>
          <p>
            Select the game executable and the closest symptom. There is also an
            “Other / not sure” choice. Sound, controller, network and save
            issues do not have dedicated checks in this version. Selecting that
            option does not add checks for them.
          </p>
          <div className="download-grid">
            {symptoms.map(([name, body]) => (
              <div key={name}>
                <h3>{name}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
          <p>
            Prefer a browser guide? Start with{' '}
            <a href="/en/guide/pc-game-crash">PC game crash troubleshooting</a>{' '}
            or <a href="/en/#games">choose a game</a>. Some other{' '}
            <a href="/#symptoms">symptom guides are currently in Japanese</a>.
          </p>
        </section>
        <section
          className="download-box"
          id="download"
          aria-labelledby="download-title"
        >
          <h2 id="download-title">
            Windows x64 download · English and Japanese
          </h2>
          {release ? (
            <>
              <a
                className="download-primary"
                href={`/downloads/${release.file}`}
                download={release.file}
              >
                Download prototype {release.version} ZIP
              </a>
              <p className="download-small">
                Free · {release.bytes.toLocaleString('en-US')} bytes · No
                installer · No account
              </p>
              <details>
                <summary>Filename and SHA-256</summary>
                <p>
                  <code>{release.file}</code>
                </p>
                <p>
                  <code>{release.sha256}</code>
                </p>
                <p>
                  This hash covers the entire ZIP. SHA256SUMS.txt inside the ZIP
                  covers the packaged files. A matching hash is not a publisher
                  signature or a guarantee of safety.
                </p>
              </details>
            </>
          ) : (
            <p>
              <strong>
                The bilingual package is being verified and is not available
                here yet.
              </strong>{' '}
              Version 0.5.0 is Japanese-only; it is not an English download. Use
              the written guides while the English build is being checked.
            </p>
          )}
          <dl className="download-facts">
            <div>
              <dt>Required environment</dt>
              <dd>
                Windows 11 x64 and .NET Framework 4.8 or later. Windows 10,
                ARM64 and 32-bit Windows have not been verified.
              </dd>
            </div>
            <div>
              <dt>Language</dt>
              <dd>
                The app starts in Japanese on a Japanese Windows UI and English
                otherwise. Use its language selector to switch between English
                and Japanese while idle. The choice lasts for this launch only;
                it does not change Windows settings. Switching preserves the
                current game, answers, consents, findings and step history.
              </dd>
            </div>
            <div>
              <dt>Supported target</dt>
              <dd>
                A local game executable you select. Launchers, protected
                installation folders and network locations may not be selectable
                or readable. Compatibility with every game has not been tested.
              </dd>
            </div>
            <div>
              <dt>General checks</dt>
              <dd>
                Relevant Windows records, PC information, your selected symptom,
                attempted steps and reported outcome. The app does not inspect
                the picture on screen or measure FPS.
              </dd>
            </div>
            <div>
              <dt>Game-specific checks</dt>
              <dd>
                Wilds trace checks and limited CrashReport analysis belong only
                to the supported Wilds profile. Their meaning is not applied to
                unrelated games.
              </dd>
            </div>
            <div>
              <dt>What has been verified</dt>
              <dd>
                {release
                  ? `Version ${release.version} has passed compilation, ${release.syntheticTests} synthetic checks and package verification.`
                  : 'Bilingual build and package verification is still in progress.'}{' '}
                These checks are separate from real Windows testing. The new UI,
                data collection from real games, protection for saved diagnosis
                history and Recycle Bin operations have not been verified on a
                real Windows PC.
              </dd>
            </div>
          </dl>
        </section>
        <section id="start">
          <h2>1. Save the ZIP, extract it, then start</h2>
          <ol className="download-steps">
            <li>
              <h3>Save the ZIP from the download button</h3>
              <p>
                It will usually be in Downloads. If choosing a location, use a
                local PC folder outside OneDrive or other sync folders.
              </p>
            </li>
            <li>
              <h3>Right-click the ZIP and choose “Extract All”</h3>
              <p>
                Extract the whole folder. Do not run the executable from the ZIP
                preview. You do not need another extraction app or a PowerShell
                command.
              </p>
            </li>
            <li>
              <h3>Read READ-ME-FIRST.txt and open the app normally</h3>
              <p>
                Double-click <code>Gemnao.Diagnostics.exe</code>. If file
                extensions are hidden, its name may appear as
                “Gemnao.Diagnostics”. Keep the accompanying .exe.config in the
                same folder. No installation or administrator launch is
                required. Save other unfinished work first.
              </p>
            </li>
          </ol>
          <aside className="download-caution">
            <h3>Stop if Windows protection blocks it</h3>
            <p>
              If SmartScreen, antivirus or an organization policy blocks the
              app, cancel or close the warning. Do not disable protection, add
              exclusions, restore a quarantined executable, run as administrator
              or change execution policy to bypass it.
            </p>
          </aside>
        </section>
        <section id="use">
          <h2>2. Choose your game, then read the relevant records</h2>
          <ol className="download-steps" start={4}>
            <li>
              <h3>
                Choose the general PC game profile, symptom and game source
              </h3>
              <p>
                Read the collection explanation and consent before selecting the
                game executable yourself. For Steam, right-click the game →
                Manage → Browse local files to find its installation. For other
                launchers, use their official instructions.
              </p>
              <p>
                Do not select Steam.exe, CrashReport.exe, an uninstaller or a
                different game as the target. If you cannot identify the game
                executable or cannot select it in a protected folder, use the
                written guides without changing permissions.
              </p>
            </li>
            <li>
              <h3>
                Review what the app will read and choose any optional checks
              </h3>
              <p>
                Opening the app does not start scanning the whole PC. You start
                the check yourself after giving consent. Enable only the
                optional checks you need. Answer questions about when and how
                often the problem occurs, and whether the whole PC is affected,
                as far as you know. Record a graphics-setting change only if you
                actually tried it; you do not need to try every action.
              </p>
            </li>
            <li>
              <h3>Read the last 10 minutes, or make one safe observation</h3>
              <p>
                If the symptom just happened, use the recent-records action. If
                another check is necessary and safe, start recording immediately
                before the attempt, launch the game once in your usual way,
                observe the symptom, wait for any crash report to finish, and
                then read the records. The app does not launch the game
                automatically.
              </p>
              <p>
                Wait while CrashReport is still being written. Do not reproduce
                a problem that is already fixed, or a problem accompanied by
                whole-PC instability.
              </p>
            </li>
            <li>
              <h3>
                If records are missing or delayed, read them again without
                relaunching
              </h3>
              <p>
                Use “Read the same records again without relaunching.” This
                preserves the original start time and the steps you have
                recorded. It is available for up to 30 minutes from the original
                start. If you launch again or change settings in between, save
                anything needed and start a new diagnosis instead of treating it
                as the same observation.
              </p>
            </li>
          </ol>
        </section>
        <section id="results">
          <h2>
            3. Separate observations, your answers and possible explanations
          </h2>
          <div className="download-grid">
            <div>
              <h3>Observed records</h3>
              <p>
                PC information and errors or hangs linked to the selected game.
                Zero records do not prove the game is healthy or the problem is
                fixed.
              </p>
            </div>
            <div>
              <h3>Your symptom and outcome</h3>
              <p>
                You need to describe black screens, performance, stuttering and
                any improvement yourself. A log cannot tell the app what you saw
                or automatically measure FPS.
              </p>
            </div>
            <div>
              <h3>Game-specific evidence</h3>
              <p>
                Use this only when the selected profile explains it. A DLL being
                present, a module being loaded or improvement during one attempt
                does not establish the cause.
              </p>
            </div>
          </div>
          <p>
            Read the suggested next check and try one change at a time. Record
            steps you have already tried without improvement instead of
            repeating them. When a retest is justified, use the same scene and
            record what changed. Stop if things worsen or the whole PC becomes
            unstable. Stop making additional changes once the problem improves.
          </p>
          <p>
            Device names, module names and other original technical values may
            remain in their original language. The app does not determine
            whether your driver is the latest release, automatically fix game
            settings or guarantee support for every game.
          </p>
        </section>
        <section id="history">
          <h2>4. Save history or export only when you need to</h2>
          <p>
            You can record attempted steps and your outcome. To retain them for
            another launch, separately consent to history storage and press the
            save-history action. Checking the consent box alone does not save
            anything. History holds up to 64 records; replacing an existing
            history file requires confirmation.
          </p>
          <p>
            The file is{' '}
            <code>%LOCALAPPDATA%\Gemnao\GameDiagnosis\history-v2.dat</code>. An
            interrupted write may leave history-v2.tmp. Old 0.4 history in
            WildsDiagnosis is not automatically read or migrated. History is
            offered only when the game executable, diagnostic profile and
            symptom match, and you review it before loading. Old observations
            are not reused as a current comparison baseline. Unsaved results
            disappear when you close the app.
          </p>
          <h3>Diagnosis text and feedback JSON are different exports</h3>
          <p>
            Preview the full report text, then choose where to save it locally.
            Feedback JSON is disabled for general games. The Wilds
            Steam-specific profile offers feedback JSON only for the “Will not
            launch” symptom; it also requires you to review the contents
            separately before saving the file locally.
          </p>
          <p>
            <strong>
              Web feedback submission is not available. Saving a file does not
              send it to the website.
            </strong>{' '}
            There is no automatic upload, automatic update or automatic
            learning. JSON field names, enum values and rule IDs stay
            language-neutral technical identifiers so switching the display
            language does not change their meaning.
          </p>
          <h3>Remove history and stop using the app</h3>
          <ol>
            <li>
              Use “Move saved history to Recycle Bin” if you no longer need it.
              Read the app and Windows confirmations. Cancel any warning that
              says the deletion will be permanent. On-screen history remains
              until a new diagnosis or app exit.
            </li>
            <li>
              Close the app, then move the extracted folder and downloaded ZIP
              to the Recycle Bin using File Explorer. There is no installer,
              background service or startup registration.
            </li>
            <li>
              Deleting the app folder does not remove saved history or text/JSON
              exported elsewhere. Recycle unwanted exports separately. Synced
              copies and backups must be managed separately.
            </li>
          </ol>
        </section>
        <section id="privacy">
          <h2>What does it read, save and send?</h2>
          <p>
            <strong>
              The app does not upload data, contact an AI service, collect
              telemetry or submit reports automatically.
            </strong>{' '}
            Browser traffic when you choose to open an official guide and
            syncing caused by saving into a sync folder are separate. Diagnosis
            data is not placed in guide URLs. The website itself is covered by
            the <a href="/privacy">site privacy policy (Japanese)</a>.
          </p>
          <details>
            <summary>What the general checks read</summary>
            <p>
              The selected executable version, Windows version, CPU, GPU,
              driver, RAM, disk capacity, matching compatibility-mode entries
              and limited Windows events (1000, 1002, 4101 and 41). It does not
              scan every drive, read your saved games or read login credentials.
              Unavailable values remain unknown; the app does not elevate
              privileges to obtain them.
            </p>
          </details>
          <details>
            <summary>Optional and game-specific checks</summary>
            <p>
              Only the Monster Hunter Wilds Steam-specific profile enables Wilds
              discovery and its additional checks. The general profile does not
              scan the game folder or arbitrary log/ZIP files. Separately
              consented Wilds checks can inspect known file traces, LastPlayed
              metadata for the retail game and limited CrashReport data. Wilds
              launch-failure recommendations are not applied with the same
              meaning to other symptoms. Presence, loading, causation and normal
              gameplay remain distinct. Any Steam-client check is separate from
              the game executable.
            </p>
            <p>
              Limited CrashReport ZIP analysis temporarily decompresses dump
              data into memory. That data may contain personal information.
              Memory contents, registers, stacks and instructions are not
              analyzed, saved or exported. This is not a general-purpose ZIP or
              crash-dump analyzer.
            </p>
          </details>
          <details>
            <summary>Saving and sharing precautions</summary>
            <p>
              Shareable exports use limited fixed fields and omit usernames,
              full paths and raw logs, but they are not fully anonymous. Windows
              and driver versions, capacities and selected steps may remain.
              Read the whole file before saving or sharing. Screenshots may show
              paths and CPU/GPU names.
            </p>
            <p>
              Optional saved history uses Windows DPAPI protection for the
              current Windows user. It does not guarantee secrecy from other
              software running as that user or from a compromised PC. The app
              does not control Windows backups, the pagefile or sync software.
              See the included privacy documentation for details.
            </p>
          </details>
        </section>
        <section id="help">
          <h2>If something goes wrong</h2>
          <details>
            <summary>The executable is missing or blocked</summary>
            <p>
              Check the fully extracted folder, not the ZIP preview. If
              antivirus quarantined a file, stop instead of restoring it or
              creating an exclusion.
            </p>
          </details>
          <details>
            <summary>A .NET error appears</summary>
            <p>
              The requirement is .NET Framework 4.8 or later, not .NET 8/10 or a
              developer SDK. Windows 11 normally includes Framework 4.8 or
              4.8.1. Check{' '}
              <a href="https://learn.microsoft.com/en-us/dotnet/framework/install/on-windows-and-server">
                Microsoft’s Windows installation guidance
              </a>{' '}
              first. Only if needed, use the{' '}
              <a href="https://dotnet.microsoft.com/en-us/download/dotnet-framework/net48">
                official Framework runtime guidance
              </a>
              . Do not downgrade a newer Framework version.
            </p>
          </details>
          <details>
            <summary>I cannot identify or read the game executable</summary>
            <p>
              Use the game’s official instructions or its launcher’s
              installation-location display. Do not change protected-folder
              permissions or launch as administrator to bypass the restriction.
              Use written guides for games whose executable you cannot select.
            </p>
          </details>
          <details>
            <summary>I see a black screen or low FPS, but no errors</summary>
            <p>
              Those symptoms do not always leave a Windows event. Zero events do
              not mean there is no problem. Record what happened, where it
              happened and what changed after a step. The app does not measure
              screen contents or FPS.
            </p>
          </details>
          <details>
            <summary>The app seems stuck or the whole PC is unstable</summary>
            <p>
              Some Windows APIs or environments may respond slowly. Cancel or
              close the window. If the PC powers off, blue-screens or becomes
              unusually hot, stop; do not repeatedly relaunch the game to
              reproduce it.
            </p>
          </details>
        </section>
        <section id="older-version">
          <h2>Older downloads</h2>
          <p>
            Version 0.5.0 is the previous Japanese-only general-game prototype.
            Version 0.4.0 is an older Japanese-only Wilds-specific prototype; it
            does not provide general-game checks or an English interface. These
            older packages are listed on the{' '}
            <a href="/tools/windows-diagnosis#older-version">
              Japanese download page
            </a>
            . They are unsigned and do not have the new bilingual interface.
          </p>
        </section>
        <p className="download-small">
          This guide is checked against the included source and documentation.
          It is not illustrated with real Windows screenshots, and it does not
          imply that all Windows actions have been tested.
        </p>
        <p>
          <a href="/en/tools">Back to tools</a>
        </p>
      </article>
      <WikiFooter locale="en" />
    </main>
  );
}
