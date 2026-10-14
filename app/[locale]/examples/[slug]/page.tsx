import { notFound } from 'next/navigation';
import { ReportedCasePage, caseMetadata } from '@/components/reported-case';
import { reportedCases, reportedCaseBySlug } from '@/lib/reported-cases';
import { locales, isLocale } from '@/lib/i18n';
export function generateStaticParams() {
  return locales.flatMap((locale) =>
    reportedCases.map((item) => ({ locale, slug: item.slug })),
  );
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  return isLocale(locale) ? caseMetadata(slug, locale) : {};
}
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const item = reportedCaseBySlug(slug);
  if (!item) notFound();
  return <ReportedCasePage item={item} locale={locale} />;
}
