/* oxlint-disable next/no-html-link-for-pages -- Full document navigation isolates diagnostic pages from third-party scripts. */
import type { Metadata } from 'next';
import { DiagnosisPrivacyContent } from '@/components/diagnosis-privacy-content';
import '../diagnosis.css';
export const metadata: Metadata = {
  title: '診断データの保存・共有・削除',
  robots: { index: false, follow: true },
};
export default function DiagnosisPrivacy() {
  return <DiagnosisPrivacyContent />;
}
