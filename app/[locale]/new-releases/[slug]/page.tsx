/* oxlint-disable next/no-html-link-for-pages -- Native links avoid the existing vinext client-link runtime issue. */
import type { RoundupGame } from '@/lib/release-roundups';
import { notFound } from 'next/navigation';
import { EnglishGuideShell } from '@/components/english-guide-shell';
import { MyPcFit } from '@/components/my-pc-fit';
import { englishEditorialMetadata } from '@/lib/localized/editorial-metadata';
import { releaseRoundupsEn } from '@/lib/localized/release-roundups-en';
const marks = { yes: '○', no: '×', partial: '△', unknown: '?' };
const special = /ray tracing|TPM|8 GB VRAM|RTX 2060|SSD/;
type Props = { params: Promise<{ locale: string; slug: string }> };
export const generateStaticParams = () =>
  releaseRoundupsEn.map((r) => ({ locale: 'en', slug: r.slug }));
export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const r =
    locale === 'en'
      ? releaseRoundupsEn.find((r) => r.slug === slug)
      : undefined;
  return r ? englishEditorialMetadata(`/new-releases/${slug}`, r) : {};
}
export default async function Page({ params }: Props) {
  const { locale, slug } = await params;
  const r =
    locale === 'en'
      ? releaseRoundupsEn.find((r) => r.slug === slug)
      : undefined;
  if (!r) notFound();
  const names = (test: (g: RoundupGame) => boolean) =>
    r.games
      .filter(test)
      .map((g) => g.name)
      .join(', ');
  return (
    <EnglishGuideShell
      guide={{
        ...r,
        path: `/new-releases/${slug}`,
        category: 'New PC releases · Minimum requirements',
        summary: r.description,
        sourcePolicy: `This English adaptation preserves the Japanese edition’s review date (${r.checkedAt}), requirement values and editorial GPU estimates, except corrections explicitly dated October 18. Each game name in the comparison table links to its source. Release dates follow the Japanese schedule unless stated otherwise; English storefront dates can differ. Requirements may change.`,
        related: [
          {
            href: '/en/guide/ray-tracing-gpu',
            label: 'Check hardware ray tracing support',
          },
          {
            href: '/en/guide/windows-11-required',
            label: 'Games requiring Windows 11',
          },
          {
            href: '/en/guide/tpm-secure-boot',
            label: 'TPM 2.0 and Secure Boot',
          },
          {
            href: '/en/guide/steam-game-not-launching',
            label: 'Steam game launch troubleshooting',
          },
        ],
      }}
      contents={[
        { id: 'requirements', title: 'Minimum requirements' },
        { id: 'fit', title: 'GTX 1660, Windows 10 and your PC' },
      ]}
    >
      <section className="quick-facts">
        <h2>At a glance</h2>
        <dl>
          <div>
            <dt>GTX 1660 below listed requirements</dt>
            <dd>{names((g) => g.gtx1660 === 'no')}</dd>
          </div>
          <div>
            <dt>Windows 10 listed, subject to the conditions in the table</dt>
            <dd>{names((g) => g.win10 === 'yes' || g.win10 === 'partial')}</dd>
          </div>
          {r.games.some((g) => g.win10 === 'unknown') && (
            <div>
              <dt>Windows 10 support unconfirmed</dt>
              <dd>
                {names((g) => g.win10 === 'unknown')}. Missing or conflicting
                wording is not confirmation of support.
              </dd>
            </div>
          )}
          <div>
            <dt>Additional essential requirements</dt>
            <dd>
              {r.games
                .filter((g) => g.must.some((x) => special.test(x)))
                .map(
                  (g) =>
                    `${g.name}: ${g.must.filter((x) => special.test(x)).join(', ')}`,
                )
                .join('; ') || 'None listed'}
            </dd>
          </div>
        </dl>
      </section>
      <nav className="article-parent-links" aria-label="Other months">
        {releaseRoundupsEn
          .filter((x) => x.slug !== slug)
          .map((x) => (
            <a key={x.slug} href={`/en/new-releases/${x.slug}`}>
              {x.shortTitle}: requirements
            </a>
          ))}
      </nav>
      <section className="diagnosis-table" id="requirements">
        <h2>Minimum requirements</h2>
        <p>
          Dates follow the original Japanese schedule unless a different
          storefront date is explicitly noted. Essential requirements can
          prevent launch or play when unmet.
        </p>
        <table>
          <thead>
            <tr>
              {[
                'Game / release date',
                'OS',
                'Minimum GPU',
                'RAM / storage',
                'Essential requirements',
              ].map((x) => (
                <th scope="col" key={x}>
                  {x}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {r.games.map((g) => (
              <tr key={g.name}>
                <td data-label="Game">
                  <b>{g.name}</b>
                  <br />
                  {g.date}
                  {g.article && (
                    <>
                      <br />
                      <a href={g.article.href}>{g.article.label}</a>
                    </>
                  )}
                </td>
                <td data-label="OS">{g.os}</td>
                <td data-label="Minimum GPU">{g.minGpu}</td>
                <td data-label="RAM / storage">
                  {g.memory} / {g.storage}
                </td>
                <td data-label="Essential requirements">
                  {g.must.join(', ') || 'No additional condition listed'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section className="diagnosis-table" id="fit">
        <h2>GTX 1660, Windows 10 and your PC: estimates</h2>
        <p>
          ○ = estimated to meet the listed minimum; △ = conditional; × = below
          requirements; ? = unconfirmed, including missing or conflicting
          information. An OS listing is not an operation guarantee. GPU
          comparisons are editorial estimates based on generation and VRAM. Also
          check recommended requirements for comfortable play. Your PC compares
          the GPU, RAM and Windows version saved on{' '}
          <a href="/en/my#my-pc">My page</a>; TPM, SSD and other conditions need
          separate checks.
        </p>
        <table>
          <thead>
            <tr>
              {[
                'Game / source',
                'GTX 1660 (6 GB)',
                'Windows 10',
                'Your PC',
              ].map((x) => (
                <th scope="col" key={x}>
                  {x}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {r.games.map((g) => (
              <tr key={g.name}>
                <td data-label="Game / source">
                  <a href={g.source} target="_blank" rel="noreferrer">
                    {g.name}
                  </a>
                </td>
                <td data-label="GTX 1660">
                  <b>{marks[g.gtx1660]}</b> {g.gtx1660Note}
                </td>
                <td data-label="Windows 10">
                  <b>{marks[g.win10]}</b> {g.win10Note}
                </td>
                <td data-label="Your PC">
                  <MyPcFit spec={g.spec} locale="en" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section className="caution-block">
        <h2>Before changing your setup</h2>
        <ul>
          <li>
            Requirements can change around release. Check the current Steam or
            publisher listing before buying.
          </li>
          <li>
            Check Windows version with Windows + R → winver. Find the GPU name
            in Task Manager → Performance → GPU.
          </li>
        </ul>
      </section>
    </EnglishGuideShell>
  );
}
