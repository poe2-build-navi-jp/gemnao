import type { Metadata } from 'next';
import { CommunityReportsPage } from '@/components/community-reports-page';
import { reportCopy } from '@/lib/community-reports/copy';
import { languageAlternates } from '@/lib/localized/index';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: reportCopy.ja.title,
  description: reportCopy.ja.intro,
  alternates: {
    canonical: '/reports',
    languages: languageAlternates('/reports'),
  },
  robots: { index: false, follow: false, noarchive: true },
};
export default function Page() {
  return <CommunityReportsPage />;
}
