import type { Locale } from '@/lib/i18n';

const copy = {
  ja: {
    title: '次回すぐ開けるように、ブックマークする方法',
    intro:
      '症状を探し直したり、設定を変えた後に確認したりする時の入口として、このページをブラウザに保存できます。',
    desktop:
      'PC：Windowsは Ctrl + D、Macは Command + D でブックマーク画面を開き、保存します。',
    mobile:
      'スマートフォン：ブラウザのメニューや共有メニューから、ブックマークを追加します。表示名と操作はブラウザ・バージョンで異なります。',
    note: 'ここでは操作方法をご案内しています。開くだけでブックマークに追加されることはありません。',
  },
  en: {
    title: 'How to bookmark this page for next time',
    intro:
      'Keep this page in your browser so you can find a guide again when a problem returns or after changing a setting.',
    desktop:
      'On a computer: press Ctrl + D on Windows or Command + D on Mac, then save the bookmark.',
    mobile:
      'On a phone: use your browser’s menu or share menu to add a bookmark. Names and steps vary by browser and version.',
    note: 'These are instructions only. Opening this section does not add a bookmark.',
  },
  zh: {
    title: '如何将此页加入书签，方便下次打开',
    intro:
      '将此页保存到浏览器，方便问题再次出现或更改设置后，回来查找排查指南。',
    desktop: '电脑：Windows 按 Ctrl + D，Mac 按 Command + D，然后保存书签。',
    mobile:
      '手机：在浏览器菜单或分享菜单中添加书签。选项名称和操作步骤因浏览器及版本而异。',
    note: '这里仅说明操作方法。展开此区域不会自动添加书签。',
  },
  es: {
    title: 'Cómo guardar esta página en tus marcadores',
    intro:
      'Guarda esta página en el navegador para volver a encontrar una guía si el problema reaparece o después de cambiar un ajuste.',
    desktop:
      'En un ordenador: pulsa Ctrl + D en Windows o Command + D en Mac y guarda el marcador.',
    mobile:
      'En un móvil: añade un marcador desde el menú del navegador o el menú para compartir. Los nombres y los pasos varían según el navegador y la versión.',
    note: 'Estas son solo instrucciones. Abrir esta sección no añade un marcador.',
  },
};

/** Native disclosure only: no automatic bookmarking or bookmark-success tracking. */
export function HomeBookmarkHelp({
  locale = 'ja',
}: {
  locale?: 'ja' | Locale;
}) {
  const t = copy[locale];
  return (
    <details className="home-bookmark-help">
      <summary>{t.title}</summary>
      <div>
        <p>{t.intro}</p>
        <ul>
          <li>{t.desktop}</li>
          <li>{t.mobile}</li>
        </ul>
        <p>{t.note}</p>
      </div>
    </details>
  );
}
