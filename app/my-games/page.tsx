import type { Metadata } from 'next';
import { MyGamesPage } from '@/components/my-games-page';
import { myGamesCopy } from '@/lib/my-games-copy';
import { languageAlternates } from '@/lib/localized/index';
export const metadata: Metadata = {
  title: myGamesCopy.ja.title,
  description: myGamesCopy.ja.lead,
  alternates: {
    canonical: '/my-games',
    languages: languageAlternates('/my-games'),
  },
  robots: { index: false, follow: true },
};
export default function Page() {
  return <MyGamesPage />;
}
