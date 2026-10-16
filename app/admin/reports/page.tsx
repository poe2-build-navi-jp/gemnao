import type { Metadata } from 'next';
import { CommunityReportsAdmin } from '@/components/community-reports-admin';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: '不具合報告の審査',
  robots: { index: false, follow: false, noarchive: true },
};
export default function Page() {
  return (
    <main className="static-page">
      <CommunityReportsAdmin />
    </main>
  );
}
