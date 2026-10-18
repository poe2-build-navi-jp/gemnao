import { notFound } from 'next/navigation';
import {
  EnglishDiscordIndex,
  discordIndexEn,
} from '@/components/english-discord-index';
import { englishEditorialMetadata } from '@/lib/localized/editorial-metadata';
type Props = { params: Promise<{ locale: string }> };
export const generateStaticParams = () => [{ locale: 'en' }];
export async function generateMetadata({ params }: Props) {
  if ((await params).locale !== 'en') return {};
  const metadata = englishEditorialMetadata('/discord', discordIndexEn);
  return { ...metadata, openGraph: { ...metadata.openGraph, type: 'website' } };
}
export default async function Page({ params }: Props) {
  if ((await params).locale !== 'en') notFound();
  return <EnglishDiscordIndex />;
}
