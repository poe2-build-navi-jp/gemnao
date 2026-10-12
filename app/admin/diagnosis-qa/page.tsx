import type { Metadata } from 'next';
import { DiagnosisQa } from '@/components/diagnosis-qa';
export const metadata: Metadata = {
  title: '診断の限定テスト',
  robots: { index: false, follow: false, noarchive: true },
};
export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <h1 className="mb-4 text-3xl font-bold">診断の限定テスト</h1>
      <DiagnosisQa />
    </main>
  );
}
