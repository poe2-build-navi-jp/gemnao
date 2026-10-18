/* oxlint-disable next/no-html-link-for-pages -- Native, crawlable editorial links. */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { WikiHeader, WikiFooter } from '@/components/wiki-header';
import { EnglishHomeSearch } from '@/components/english-home-search';
import { englishSearchEntries } from '@/lib/localized/home-en';
import { englishDirectoryCopy } from '@/lib/localized/home-copy-en';
import { ogImageFor } from '@/lib/og-images';
type Props = { params: Promise<{ locale: string }> };
export const generateStaticParams = () => [{ locale: 'en' }];
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if ((await params).locale !== 'en') return {};
  return {
    title: { absolute: `${englishDirectoryCopy.title} | Gemnao` },
    description: englishDirectoryCopy.description,
    alternates: {
      canonical: '/en/articles',
      languages: { en: '/en/articles', 'x-default': '/en/articles' },
    },
    openGraph: {
      type: 'website',
      title: englishDirectoryCopy.title,
      description: englishDirectoryCopy.description,
      url: '/en/articles',
      locale: 'en_US',
      images: [ogImageFor('/en/articles')],
    },
    twitter: {
      card: 'summary_large_image',
      title: englishDirectoryCopy.title,
      description: englishDirectoryCopy.description,
      images: [ogImageFor('/en/articles')],
    },
  };
}
const groups = [
  {
    id: 'games',
    title: 'Game troubleshooting',
    test: (p: string) => p.startsWith('/en/games/'),
  },
  {
    id: 'general',
    title: 'PC game checks and symptoms',
    test: (p: string) => /^\/en\/(guide|trouble)(\/|$)/.test(p),
  },
  {
    id: 'windows',
    title: 'Windows and devices',
    test: (p: string) => /^\/en\/pc(\/|$)/.test(p),
  },
  {
    id: 'discord',
    title: 'Discord troubleshooting',
    test: (p: string) => /^\/en\/discord(\/|$)/.test(p),
  },
  {
    id: 'tools',
    title: 'Tools and equipment',
    test: (p: string) => /^\/en\/(tools|gear)(\/|$)/.test(p),
  },
  {
    id: 'reference',
    title: 'Release requirements and weekly archives',
    test: (p: string) => /^\/en\/(new-releases|weekly)(\/|$)/.test(p),
  },
];
export default async function Page({ params }: Props) {
  if ((await params).locale !== 'en') notFound();
  const sections = [
    ...groups.map((g) => ({
      ...g,
      entries: englishSearchEntries.filter((e) => g.test(e.href)),
    })),
    {
      id: 'site',
      title: 'Community and site information',
      entries: englishSearchEntries.filter(
        (e) => !groups.some((g) => g.test(e.href)),
      ),
    },
  ];
  return (
    <main lang="en" className="english-directory">
      <WikiHeader
        locale="en"
        pagePath="/articles"
        japanesePath="/?view=articles#articles"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: englishDirectoryCopy.title,
            url: 'https://gemnao.pages.dev/en/articles',
            description: englishDirectoryCopy.description,
            inLanguage: 'en',
            isPartOf: { '@id': 'https://gemnao.pages.dev/#website' },
          }),
        }}
      />
      <header className="content english-directory-header">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <a href="/en">Home</a>
          <span>›</span>
          <b>All English guides</b>
        </nav>
        <h1>{englishDirectoryCopy.title}</h1>
        <p>{englishDirectoryCopy.description}</p>
        <EnglishHomeSearch entries={englishSearchEntries} />
        <nav aria-label="Guide categories">
          <ul>
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`}>
                  {s.title} ({s.entries.length})
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      {sections.map((s) => (
        <section
          className="content english-directory-group"
          id={s.id}
          key={s.id}
          aria-labelledby={`${s.id}-title`}
        >
          <h2 id={`${s.id}-title`}>{s.title}</h2>
          <ul>
            {[...s.entries]
              .sort((a, b) => a.title.localeCompare(b.title, 'en'))
              .map((e) => (
                <li key={e.href}>
                  <a href={e.href}>{e.title}</a>
                  <span>{e.label}</span>
                </li>
              ))}
          </ul>
        </section>
      ))}
      <WikiFooter locale="en" />
    </main>
  );
}
