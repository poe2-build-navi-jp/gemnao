'use client';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid the existing vinext client-link runtime issue. */

import { useStatus } from './status-board';
import { maintenancePeriod } from '@/lib/status/policy';
const fmt = (s: string) =>
  new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Tokyo',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(s));
const states = {
  upcoming: 'Scheduled',
  'scheduled-window': 'Scheduled window',
  ongoing: 'In progress',
  unconfirmed: 'Completion unconfirmed',
};
const discordStates: Record<string, string> = {
  none: 'Operational',
  minor: 'Minor disruption',
  major: 'Major outage',
  critical: 'Critical outage',
  maintenance: 'Under maintenance',
};
const incidentStates: Record<string, string> = {
  investigating: 'Investigating',
  identified: 'Identified',
  monitoring: 'Monitoring',
  scheduled: 'Scheduled',
  in_progress: 'In progress',
  verifying: 'Verifying recovery',
};
export function EnglishStatusBoard({
  names,
  links,
  hubs,
}: {
  names: Record<string, string>;
  hubs: Record<string,string>;
  links: Record<string, { href: string; label: string }>;
}) {
  const { data, failed, viewedAt } = useStatus();
  if (failed && !data)
    return (
      <p className="status-empty">
        Information could not be loaded. Reload later or check the official
        links below. Current service status is unknown.
      </p>
    );
  if (!data)
    return <p className="status-empty">Checking official information…</p>;
  const failedSources = data.steamSources.filter((s) => !s.available);
  return (
    <div className="status-board">
      <p className="status-updated">
        Last fetched: {fmt(data.checkedAt)} JST. Refreshes about every ten
        minutes while this page is visible.
      </p>
      {failed ? (
        <output className="status-empty">
          Refresh failed. Previously fetched information is shown; check
          official sources for current recovery or ongoing disruption.
        </output>
      ) : null}
      <p className="status-note">
        Confirmed recovery/completion is removed on the next fetch or reviewed
        update. Passing a scheduled end time does not prove recovery. Game
        maintenance entries are editorially reviewed; Discord status and Steam
        announcements are fetched automatically. Announcement titles are shown
        in their original published language.
      </p>
      {(['today', 'future', 'past'] as const).map((period) => {
        const items = data.maintenance.filter(
          (i) => maintenancePeriod(i, viewedAt) === period,
        );
        return (
          <section
            key={period}
            aria-labelledby={`status-maintenance-${period}`}
          >
            <h2 id={`status-maintenance-${period}`}>
              {period === 'past'
                ? 'Past schedules: completion unconfirmed'
                : period === 'future'
                  ? 'Upcoming maintenance'
                  : 'Today’s maintenance (JST)'}
            </h2>
            {period === 'past' ? (
              <p>
                These are past schedules, not evidence of a current outage or
                ongoing work. Completion/recovery has not been confirmed.
              </p>
            ) : null}
            {items.length ? (
              <ul className="status-list">
                {items.map((i) => (
                  <li key={i.gameSlug + i.start}>
                    <span className={`status-badge status-${i.state}`}>
                      {states[i.state]}
                    </span>
                    <div>
                      <b>{hubs[i.gameSlug] ? <a href={hubs[i.gameSlug]}>{names[i.gameSlug] || i.gameSlug}{hubs[i.gameSlug].startsWith('/en/') ? '' : ' (Japanese overview)'}</a> : (names[i.gameSlug] || i.gameSlug)}</b>
                      <p>
                        {i.gameSlug === 'aion2' &&
                        i.start === '2026-10-05T14:00:00+09:00'
                          ? 'Global Steam/PURPLE maintenance before full-service launch'
                          : i.title}
                      </p>
                      <p>
                        {fmt(i.start)}–{fmt(i.end)} JST.{' '}
                        {i.state === 'unconfirmed'
                          ? 'The planned time has passed; an official completion/recovery notice has not been confirmed.'
                          : i.state === 'scheduled-window'
                            ? 'This is the scheduled window. Check the official notice for actual work or extensions.'
                            : ''}
                      </p>
                      {i.note ? (
                        <p>
                          {i.gameSlug === 'aion2' && i.start === '2026-10-05T14:00:00+09:00'
                            ? 'The original schedule covers the global version, including Japan, and was subject to change.'
                            : i.note}
                        </p>
                      ) : null}
                      <p>Notice reviewed: {fmt(i.verifiedAt)} JST</p>
                      <a href={i.source.url} target="_blank" rel="noreferrer">
                        Official maintenance source →
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="status-empty">
                No maintenance information is registered in this category.
              </p>
            )}
          </section>
        );
      })}
      <section aria-labelledby="status-discord">
        <h2 id="status-discord">Discord</h2>
        {data.discord ? (
          <div className="status-list">
            <p>
              <b>
                {discordStates[data.discord.indicator] ||
                  data.discord.description}
              </b>{' '}
              (official Discord status)
              <br />
              Successfully fetched: {fmt(data.discord.checkedAt)} JST
            </p>
            {data.discord.incidents.map((i) => (
              <p key={i.url}>
                <a href={i.url} target="_blank" rel="noreferrer">
                  {i.name} — {incidentStates[i.status] || i.status}; updated{' '}
                  {fmt(i.updatedAt)} JST →
                </a>
              </p>
            ))}
            {data.discord.maintenances.map((i) => (
              <p key={i.url}>
                {incidentStates[i.status] || 'Maintenance status under review'}:{' '}
                <a href={i.url} target="_blank" rel="noreferrer">
                  {i.name} ({fmt(i.start)}–{fmt(i.end)} JST) →
                </a>
              </p>
            ))}
          </div>
        ) : (
          <p className="status-empty">
            Discord information could not be fetched (attempt:{' '}
            {fmt(data.discordSource.checkedAt)} JST).{' '}
            {data.discordSource.lastSuccessfulAt
              ? `Last successful fetch: ${fmt(data.discordSource.lastSuccessfulAt)} JST.`
              : 'No successful result is available; current status is unknown.'}{' '}
            <a
              href="https://discordstatus.com/"
              target="_blank"
              rel="noreferrer"
            >
              Check Discord Status
            </a>
            .
          </p>
        )}
      </section>
      <section aria-labelledby="status-notices">
        <h2 id="status-notices">
          Official game announcements from the last three days
        </h2>
        <p className="status-note">
          Maintenance, issues, fixes and updates from official Steam
          announcements: up to twelve items selected from each game’s latest
          five. These may discuss fixed problems and are reference news, not a
          list of active server outages. Recovery/completion announcements are
          excluded.
        </p>
        <details className="status-note">
          <summary>
            Sources and check times (
            {data.steamSources.length - failedSources.length}/
            {data.steamSources.length} games fetched successfully)
          </summary>
          <ul>
            {data.steamSources.map((s) => (
              <li key={s.gameSlug}>
                <a href={s.url} target="_blank" rel="noreferrer">
                  {names[s.gameSlug] || s.gameSlug}
                </a>
                : {s.available ? 'Fetched successfully' : 'Unavailable'} —{' '}
                {fmt(s.checkedAt)} JST
                {!s.available && s.lastSuccessfulAt
                  ? `; last successful fetch ${fmt(s.lastSuccessfulAt)} JST`
                  : ''}
              </li>
            ))}
          </ul>
        </details>
        {failedSources.length ? (
          <p className="status-empty">
            Unavailable sources:{' '}
            {failedSources
              .map((s) => names[s.gameSlug] || s.gameSlug)
              .join(', ')}
            . We cannot determine whether announcements or recovery updates
            exist for them.
          </p>
        ) : null}
        {data.notices.length ? (
          <ul className="status-list">
            {data.notices.map((n) => (
              <li key={n.url}>
                <span className="status-badge">{fmt(n.date)} JST</span>
                <div>
                  <b>{names[n.gameSlug] || n.gameSlug}</b>
                  <p>
                    <a href={n.url} target="_blank" rel="noreferrer">
                      {n.title} →
                    </a>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="status-empty">
            No matching announcement from the last three days was found in the
            sources successfully retrieved.
          </p>
        )}
      </section>
      <section aria-labelledby="status-spikes">
        <h2 id="status-spikes">
          Pages with an increase in “Having trouble” responses
        </h2>
        <p className="status-note">
          At least three responses in the last 24 hours and at least three times
          the daily average of the preceding week. This indicates increased
          reader responses, not a confirmed outage or a count of distinct
          people.
        </p>
        {data.spikes.length ? (
          <ul className="status-list">
            {data.spikes.map((s) => (
              <li key={s.href}>
                <span className="status-badge status-ongoing">
                  {s.last24h} responses in 24 hours
                </span>
                <div>
                  <a href={links[s.href]?.href || s.href}>
                    {links[s.href]?.label || `${s.label} (Japanese)`}
                  </a>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="status-empty">No page meets the increase threshold.</p>
        )}
      </section>
    </div>
  );
}
