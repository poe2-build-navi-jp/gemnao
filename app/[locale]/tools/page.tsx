import { ogImageFor } from '@/lib/og-images';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { ArrowRight } from 'lucide-react';
import { WikiFooter, WikiHeader } from '@/components/wiki-header';
import { languageAlternates } from '@/lib/localized/index';

const title = 'PC gaming tools and quick references';
const description =
  'The Windows PC Game Diagnosis prototype, save-backup guidance and quick references. English resources are listed first; Japanese-only tools are clearly labeled.';
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
    alternates: {
      canonical: '/en/tools',
      languages: languageAlternates('/tools'),
    },
    openGraph: {
      title,
      description,
      url: '/en/tools',
      locale: 'en_US',
      images: [ogImageFor('/en/tools')],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageFor('/en/tools')],
    },
  };
}
const tools = [
  {
    href: '/en/tools/windows-diagnosis',
    title: 'PC Game Diagnosis for Windows',
    body: 'Choose an installed game and its symptoms, review diagnostic information and keep track of the steps you try. Read the unsigned prototype’s limits before downloading.',
  },
  {
    href: '/en/guide/pc-game-crash',
    title: 'PC game crash troubleshooting',
    body: 'Work through safe checks one at a time without downloading the diagnosis app.',
  },
  {
    href: '/en/gear/save-backup-storage-guide',
    title: 'Save backups and storage',
    body: 'Learn how to keep a separate copy of your saves and choose suitable storage before changing files.',
  },
];
const japaneseTools = [
  {
    href: '/status',
    title: 'Service status and maintenance',
    body: 'Discord status, official game maintenance schedules and announcements.',
  },
  {
    href: '/my',
    title: 'My PC and games',
    body: 'A hardware checklist saved in your browser to help estimate whether your PC meets each listed game’s requirements.',
  },
  {
    href: '/tools/save-locations',
    title: 'Save-file locations',
    body: 'Copyable save and configuration paths for popular PC games.',
  },
  {
    href: '/pc/gaming-shortcut-keys',
    title: 'Gaming keyboard shortcuts',
    body: 'Keyboard shortcuts for unresponsive games and display problems.',
  },
  {
    href: '/tools/refresh-rate',
    title: 'Refresh-rate check',
    body: 'A browser-based estimate to help check the display’s refresh rate.',
  },
  {
    href: '/new-releases/2026-10',
    title: 'New-release PC requirements',
    body: 'System requirements for the listed October 2026 PC releases in one place.',
  },
];
export default async function EnglishTools({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  if ((await params).locale !== 'en') notFound();
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://gemnao.pages.dev';
  return (
    <main lang="en">
      <WikiHeader locale="en" pagePath="/tools" />
      <article className="static-page">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'CollectionPage',
              name: title,
              description,
              url: `${siteUrl}/en/tools`,
              inLanguage: 'en',
              dateModified: '2026-10-03',
            }).replace(/</g, '\\u003c'),
          }}
        />
        <nav aria-label="Breadcrumb">
          <a href="/en">Home</a> › Tools
        </nav>
        <p className="page-kicker">TOOLS</p>
        <h1>{title}</h1>
        <p className="page-lead">
          Useful pages to keep nearby when a game stops working or before you
          change files.
        </p>
        <h2>English tools and guides</h2>
        <div className="related-section">
          <div>
            {tools.map((tool) => (
              <a href={tool.href} key={tool.href}>
                <span>{tool.title}</span>
                {tool.body}
                <ArrowRight size={15} />
              </a>
            ))}
          </div>
        </div>
        <h2>More tools, currently in Japanese</h2>
        <p>
          These pages open the existing Japanese tools. They do not have an
          English interface yet.
        </p>
        <div className="related-section">
          <div>
            {japaneseTools.map((tool) => (
              <a href={tool.href} key={tool.href}>
                <span>{tool.title} (Japanese)</span>
                {tool.body}
                <ArrowRight size={15} />
              </a>
            ))}
          </div>
        </div>
      </article>
      <WikiFooter locale="en" />
    </main>
  );
}
