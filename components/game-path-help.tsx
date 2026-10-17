/* oxlint-disable next/no-html-link-for-pages -- Existing article shell uses native links. */
import type { MyGamesLocale } from '@/lib/my-games-copy';
import { hasTranslation } from '@/lib/localized/index';

const copy = {
  ja: {
    steam:
      'Steam本体のインストール先にあるuserdataを開き、表示した数字のフォルダをたどります。ゲームのインストール先とは別です。<Steam>・<Steam ID>は実際の場所・使用アカウントの数字に置き換え、記号付きのままWindows＋Rに貼り付けないでください。不明なアカウントのデータは上書きしません。',
    install:
      'Steamライブラリでゲームを右クリック→「管理」→「ローカルファイルを閲覧」で実際のインストール先を開き、表示したファイルを探します。<インストール先>などは置き換え用の表記で、そのままWindows＋Rへ貼り付けるパスではありません。編集前にファイルをコピーして保管してください。',
    env: 'エクスプローラーのアドレス欄で、上の%…%から始まるフォルダを開きます。<Steam ID>・<ID>などは使用アカウントの実際のフォルダに置き換えてください。末尾がファイル名なら、その手前のフォルダを開きます。変更前にコピーを保管してください。',
    unknown:
      'この表示は、そのまま実行できるパスとは限りません。場所を確認できない場合は推測で作成・削除せず、詳細記事や公式サポートを確認してください。',
    detail: 'Wildsのセーブ場所・バックアップ・復元手順を読む',
    japanese: '（日本語）',
  },
  en: {
    steam:
      'Open userdata inside the Steam client installation, then follow the numbered folders shown above. This is separate from the game installation. Replace <Steam> and <Steam ID> with the actual location and account folder; do not paste placeholders into Run. Do not overwrite data for an account you cannot identify.',
    install:
      'In the Steam Library, right-click the game → Manage → Browse local files, then find the listed file in the actual installation. Installation-folder placeholders are not literal paths to paste into Run. Keep a copy before editing.',
    env: 'Use the File Explorer address bar to open the folder beginning with %…% above. Replace <Steam ID> or <ID> with the actual account folder. If the path ends in a filename, open its containing folder. Keep a copy before making changes.',
    unknown:
      'This text may not be a directly usable path. If the location is unknown, do not guess, create or delete folders; consult the detailed guide or official support.',
    detail: 'Read the Wilds save-location, backup and restoration guide',
    japanese: ' (Japanese)',
  },
  zh: {
    steam:
      '打开Steam客户端安装目录中的userdata，再按上方路径进入数字文件夹。这与游戏安装目录不同。将<Steam>和<Steam ID>替换为实际位置及账户文件夹，不要将占位符直接粘贴到“运行”。无法确认账户时不要覆盖数据。',
    install:
      '在Steam库中右键点击游戏→管理→浏览本地文件，打开实际安装目录并查找上方文件。安装目录占位符不能直接粘贴到“运行”。编辑前请保留副本。',
    env: '在文件资源管理器地址栏打开上方以%…%开头的文件夹。将<Steam ID>或<ID>替换为实际账户文件夹。若路径末尾是文件名，请打开其所在文件夹。修改前保留副本。',
    unknown:
      '此处文字不一定是可直接使用的路径。位置不明时不要猜测、创建或删除文件夹，请查阅详细指南或官方支持。',
    detail: '查看Wilds存档位置、备份与恢复指南',
    japanese: '（日语）',
  },
  es: {
    steam:
      'Abre userdata dentro de la instalación del cliente Steam y sigue las carpetas numéricas indicadas. No es la carpeta del juego. Sustituye <Steam> y <Steam ID> por la ubicación real y la carpeta de la cuenta; no pegues marcadores en Ejecutar. No sobrescribas datos de una cuenta que no puedas identificar.',
    install:
      'En la biblioteca de Steam, haz clic derecho en el juego → Administrar → Ver archivos locales y busca el archivo indicado. Los marcadores de instalación no son rutas literales para Ejecutar. Conserva una copia antes de editar.',
    env: 'Abre la carpeta que empieza por %…% en la barra de direcciones del Explorador de archivos. Sustituye <Steam ID> o <ID> por la carpeta real de la cuenta. Si la ruta termina en un archivo, abre la carpeta que lo contiene. Guarda una copia antes de cambiar nada.',
    unknown:
      'Este texto puede no ser una ruta utilizable directamente. Si desconoces la ubicación, no adivines, crees ni borres carpetas; consulta la guía detallada o el soporte oficial.',
    detail:
      'Leer la guía de ubicación, copia y restauración de partidas de Wilds',
    japanese: ' (japonés)',
  },
};

export function GamePathHelp({
  path,
  locale = 'ja',
}: {
  path: string;
  locale?: MyGamesLocale;
}) {
  const kind = /\\userdata\\/i.test(path)
    ? 'steam'
    : /<インストール先>|<Steam game library>|\\steamapps\\common\\/i.test(path)
      ? 'install'
      : /^%[^%]+%\\/.test(path)
        ? 'env'
        : 'unknown';
  return (
    <p className="tip" data-path-kind={kind}>
      {copy[locale][kind]}
    </p>
  );
}

export function WildsSaveGuideLink({
  locale = 'ja',
}: {
  locale?: MyGamesLocale;
}) {
  const path = '/games/monster-hunter-wilds/save-data';
  const translated = locale !== 'ja' && hasTranslation(locale, path);
  return (
    <p>
      <a href={`${translated ? `/${locale}` : ''}${path}`}>
        {copy[locale].detail}
        {locale !== 'ja' && !translated ? copy[locale].japanese : ''} →
      </a>
    </p>
  );
}
