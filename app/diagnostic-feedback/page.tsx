import type { Metadata } from 'next';
import { DiagnosticFeedbackForm } from '@/components/diagnostic-feedback-form';
export const metadata: Metadata = {
  title: '診断結果の任意報告',
  robots: { index: false, follow: false, noarchive: true },
};
// A full document navigation keeps the private form's restrictive CSP isolated.
/* oxlint-disable next/no-html-link-for-pages */
export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <a href="/">ゲムなお</a>
      <h1 className="my-6 text-3xl font-bold">診断結果の任意報告</h1>
      <p>
        改善した・変わらなかった体験を、今後の手順見直しの参考にします。結果は本人の申告であり、原因や効果の証明ではありません。自動的な順位変更・ツール更新には使いません。
      </p>
      <DiagnosticFeedbackForm />
    </main>
  );
}
