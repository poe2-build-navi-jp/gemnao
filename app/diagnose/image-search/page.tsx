import type { Metadata } from 'next';
import { ImageTextSearch } from '@/components/image-text-search';
import { ocrSearchIndexes } from '@/lib/ocr-search-index';
import './image-search.css';
export const metadata: Metadata = {
  title: '画像の文字から記事を探す | ゲムなお',
  description: '画像の文字を端末内で読み取り、確認・編集して関連記事を検索します。',
  robots: { index: false, follow: false },
  alternates: { canonical: '/diagnose/image-search' },
};
export default async function ImageSearchPage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const { lang } = await searchParams;
  const initialLocale = lang === 'en' || lang === 'zh' || lang === 'es' ? lang : 'ja';
  return <ImageTextSearch indexes={ocrSearchIndexes()} initialLocale={initialLocale} />;
}
