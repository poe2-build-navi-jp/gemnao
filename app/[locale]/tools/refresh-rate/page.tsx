/* oxlint-disable next/no-html-link-for-pages -- Native links avoid the existing vinext client-link runtime issue. */
import { notFound } from 'next/navigation';
import { WikiHeader, WikiFooter } from '@/components/wiki-header';
import { RefreshRateCheck } from '@/components/refresh-rate-check';
import { englishEditorialMetadata } from '@/lib/localized/editorial-metadata';
const info = {
  title: 'Monitor Refresh Rate: Compare Browser Timing with Windows',
  description:
    'Measure browser frame intervals for about four seconds and compare them with Windows. This does not directly measure monitor Hz or game FPS.',
  checkedAt: '2026-10-18',
};
export const generateStaticParams = () => [{ locale: 'en' }];
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return (await params).locale === 'en'
    ? englishEditorialMetadata('/tools/refresh-rate', info)
    : {};
}
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  if ((await params).locale !== 'en') notFound();
  return (
    <main lang="en">
      <WikiHeader locale="en" pagePath="/tools/refresh-rate" />
      <article className="static-page">
        <p className="page-kicker">TOOLS</p>
        <h1>{info.title}</h1>
        <p className="page-lead">
          This tool estimates how often the browser updates its rendering. It
          cannot read the monitor’s configured or maximum refresh rate, or your
          game’s FPS. Check Windows first, then compare the two measurements
          separately.
        </p>
        <section>
          <h2>Choose the monitor and measure for about four seconds</h2>
          <ol>
            <li>
              In Windows Settings → System → Display → Advanced display, select
              the target monitor and record the configured refresh rate.
            </li>
            <li>
              Keep this window entirely on that monitor, not across displays.
              Use the same laptop power conditions for each comparison.
            </li>
            <li>
              Start the measurement and keep the tab visible. Cancel before
              moving the window to another monitor, then measure again.
            </li>
          </ol>
        </section>
        <RefreshRateCheck locale="en" />
        <p>
          If Windows remains at 60 Hz or differs from this estimate, use the{' '}
          <a href="/en/pc/refresh-rate-stuck-60hz#diagnosis">symptom table</a>,
          change one setting, then return here to measure again.
        </p>
        <section id="results">
          <h2>Compare Windows with the browser estimate</h2>
          <ul>
            <li>
              <strong>Windows also shows 60 Hz:</strong> if the monitor supports
              more, use the{' '}
              <a href="/en/pc/refresh-rate-stuck-60hz#diagnosis">
                Windows and connection checks
              </a>
              . This estimate alone does not diagnose a faulty cable.
            </li>
            <li>
              <strong>
                Windows shows 144 Hz or more, but the browser is near 60
                updates/second:
              </strong>{' '}
              repeat with the tab visible and check browser power-saving
              settings and PC load. The browser result alone does not prove
              Windows failed to apply the setting.
            </li>
            <li>
              <strong>
                Windows and browser are high, but only the game is slow:
              </strong>{' '}
              check{' '}
              <a href="/en/guide/low-fps">game FPS and graphics settings</a>.
              This page does not measure game FPS.
            </li>
            <li>
              <strong>Results vary or measurement is interrupted:</strong> keep
              the tab visible, on the same monitor and under the same power
              conditions. Values are rounded estimates; a difference such as 143
              versus 144 does not establish a fault.
            </li>
          </ul>
        </section>
        <section id="retest">
          <h2>Retest under the same conditions</h2>
          <ol>
            <li>
              Recheck the target monitor and configured Hz in Windows Advanced
              display.
            </li>
            <li>
              Place this page on the same monitor and measure again. Compare the
              Windows value and browser estimate separately.
            </li>
            <li>
              If Windows is now at a high rate but only the game is uneven, use
              the{' '}
              <a href="/en/pc/refresh-rate-stuck-60hz#step-2">
                game-only checks
              </a>
              . If a higher rate is still unavailable, check{' '}
              <a href="/en/pc/refresh-rate-stuck-60hz#step-3">
                cables and ports
              </a>
              .
            </li>
          </ol>
        </section>
        <section>
          <h2>Hz and FPS are different</h2>
          <p>
            Refresh rate is how often the monitor refreshes each second. FPS is
            how many frames the game produces. A 144-Hz screen does not make a
            60-FPS game produce 144 distinct frames. Use the{' '}
            <a href="/en/guide/low-fps">low-FPS guide</a> for the game itself.
          </p>
          <h2>How the estimate works and its limits</h2>
          <p>
            The tool collects browser animation-callback intervals for about
            four seconds and calculates updates per second from the median. It
            also shows the central 80% of intervals. This spread describes
            callback timing, not pixel response time or input latency.
          </p>
          <p>
            Browser load, power saving and hidden tabs affect timing. It does
            not certify variable-refresh-rate behavior or maximum panel
            performance. Measurement stops when the tab is hidden.
          </p>
          <p>
            The displayed value is a measurement in this browser now. It is not
            a claim that accuracy was validated on a particular 144-Hz or 240-Hz
            physical monitor.
          </p>
          <h2>References</h2>
          <ul>
            <li>
              <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame">
                MDN: requestAnimationFrame and hidden tabs
              </a>
            </li>
            <li>
              <a href="https://support.microsoft.com/en-us/windows/hardware/display-graphics/change-the-refresh-rate-on-your-monitor-in-windows">
                Microsoft: monitor refresh-rate settings
              </a>
            </li>
          </ul>
        </section>
      </article>
      <WikiFooter locale="en" />
    </main>
  );
}
