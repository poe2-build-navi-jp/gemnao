/* oxlint-disable next/no-html-link-for-pages -- Existing and translated guide routes. */
import type { MyGamesLocale } from '@/lib/my-games-copy';
const copy = {
  ja: {
    client: 'Steamの画面自体が開かない場合：Steam本体の起動手順へ',
    cloud: 'Steamクラウドの仕組み・対応・設定を確認する',
  },
  en: {
    client: 'Steam itself will not open: check the client instead',
    cloud: 'Understand Steam Cloud support, settings and files',
  },
  zh: {
    client: 'Steam 界面本身打不开：查看客户端启动步骤',
    cloud: '了解 Steam 云的支持范围、设置与文件',
  },
  es: {
    client: 'Steam no abre su propia ventana: comprueba el cliente',
    cloud: 'Entender compatibilidad, ajustes y archivos de Steam Cloud',
  },
};
export function SteamIntentLinks({
  slug,
  locale = 'ja',
}: {
  slug: string;
  locale?: MyGamesLocale;
}) {
  const target =
    slug === 'steam-game-not-launching'
      ? { slug: 'steam-client-not-opening', label: copy[locale].client }
      : slug === 'steam-cloud-sync-error'
        ? { slug: 'steam-cloud-basics', label: copy[locale].cloud }
        : null;
  if (!target) return null;
  return (
    <p className="procedure-note">
      <a href={`${locale === 'ja' ? '' : `/${locale}`}/guide/${target.slug}`}>
        {target.label} →
      </a>
    </p>
  );
}
