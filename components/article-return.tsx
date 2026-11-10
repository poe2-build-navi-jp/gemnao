import { SaveGame } from './save-game';
import type { MyGamesLocale } from '@/lib/my-games-copy';
export function ArticleReturn({
  gameSlug,
  locale = 'ja',
}: {
  gameSlug: string;
  locale?: MyGamesLocale;
}) {
  const t = {
    ja: {
      title: '次に困ったとき、ここから再開する',
      body: '試した結果は解決ノートへ。このゲームを保存すると、対処法と記事の更新をマイゲームから見返せます。',
    },
    en: {
      title: 'Keep a starting point for next time',
      body: 'Keep your result in the private notebook. Save this game to return to its fixes and guide updates from My Games.',
    },
    zh: {
      title: '下次需要时，从这里继续',
      body: '可在私人笔记中保留结果。保存游戏后，可在“我的游戏”中再次查看排查指南与文章更新。',
    },
    es: {
      title: 'Un punto de partida para la próxima vez',
      body: 'Guarda el resultado en tu cuaderno privado. Añade el juego para volver a sus guías y actualizaciones desde Mis juegos.',
    },
  }[locale];
  return (
    <aside className="article-return">
      <h2>{t.title}</h2>
      <p>{t.body}</p>
      <SaveGame slug={gameSlug} locale={locale} />
    </aside>
  );
}
