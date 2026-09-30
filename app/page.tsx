import type { Metadata } from 'next';
import { WikiHome } from '@/components/wiki-home';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  description: siteConfig.description,
  openGraph: {
    title: 'ゲムなお｜PCゲームのお直しWiki',
    description: siteConfig.description,
    siteName: siteConfig.name,
    url: '/',
    images: ['/og-default.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ゲムなお｜PCゲームのお直しWiki',
    description: siteConfig.description,
    images: ['/og-default.png'],
  },
  alternates: {
    canonical: '/',
  },
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const { view } = await searchParams;
  return (
    <WikiHome
      view={view === 'games' || view === 'articles' ? view : undefined}
    />
  );
}
