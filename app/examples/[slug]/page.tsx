import { notFound } from 'next/navigation';
import { ReportedCasePage, caseMetadata } from '@/components/reported-case';
import { reportedCases, reportedCaseBySlug } from '@/lib/reported-cases';
export function generateStaticParams() {
  return reportedCases.map((item) => ({ slug: item.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return caseMetadata((await params).slug, 'ja');
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const item = reportedCaseBySlug((await params).slug);
  if (!item) notFound();
  return <ReportedCasePage item={item} />;
}
