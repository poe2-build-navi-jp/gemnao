import type { Metadata } from 'next';
import { WikiHome } from '@/components/wiki-home';

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
    languages: {
      'ja-JP': '/',
      en: '/en',
      'zh-CN': '/zh',
      es: '/es',
      'x-default': '/',
    },
  },
};

export default function Home() {
  return <WikiHome />;
}
