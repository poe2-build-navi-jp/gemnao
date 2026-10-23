import type { Metadata } from 'next';
import { PrivateDiagnosticForm } from '@/components/private-diagnostic-form';
export const metadata: Metadata = {
  title: '診断結果の非公開受付 / Private diagnostic intake',
  robots: { index: false, follow: false, noarchive: true },
};
export default function Page() {
  return (
    <main className="mx-auto max-w-3xl space-y-5 px-5 py-10">
      <PrivateDiagnosticForm />
    </main>
  );
}
