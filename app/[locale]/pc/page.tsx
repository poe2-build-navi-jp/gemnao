import { notFound } from 'next/navigation';
import {
  EnglishPcIndex,
  pcIndexEn,
} from '@/components/english-pc-index';
import { englishEditorialMetadata } from '@/lib/localized/editorial-metadata';
type Props = { params: Promise<{ locale: string }> };
export const generateStaticParams = () => [{ locale: 'en' }];
export async function generateMetadata({ params }: Props) {
  if ((await params).locale !== 'en') return {};
  const metadata = englishEditorialMetadata('/pc', pcIndexEn);
  return { ...metadata, openGraph: { ...metadata.openGraph, type: 'website' } };
}
export default async function Page({ params }: Props) {
  if ((await params).locale !== 'en') notFound();
  return <EnglishPcIndex />;
}
