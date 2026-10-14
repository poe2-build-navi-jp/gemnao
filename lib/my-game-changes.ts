import type { MyGamesLocale } from './my-games-copy';
import { hasTranslation } from './localized/index';

export type ChangeCopy = {
  title: string;
  condition: string;
  change: string;
  check: string;
};
export type OfficialGameChange = {
  // Bump the stable revision ID only when the user needs to review changed advice.
  id: string;
  gameSlug: string;
  publishedOn: string;
  checkedOn: string;
  sourceUrl: string;
  articlePath: string;
  copy: Partial<Record<MyGamesLocale, ChangeCopy>>;
};
// A small, manually verified registry, not a feed or proof that other games have no changes.
// Source pages are Japanese. Dates are publication and editorial check dates, not article updatedAt.
export const officialGameChanges: OfficialGameChange[] = [
  {
    id: 'apex-javelin-20260929-v1',
    gameSlug: 'apex-legends',
    publishedOn: '2026-09-24',
    checkedOn: '2026-10-14',
    sourceUrl:
      'https://www.ea.com/ja/games/apex-legends/apex-legends/news/javelin-anticheat-announcement',
    articlePath: '/games/apex-legends/javelin-launch-error',
    copy: {
      ja: {
        title: 'PC版のアンチチートがJavelinへ移行',
        condition: 'PC版Apex。更新後にJavelinの起動エラーが出る場合。',
        change:
          'EAは2026年9月29日からEACをJavelinへ切り替えると発表。ゲーム更新後の起動で移行します。',
        check:
          'まず更新完了とエラー全文を確認。告知ではApexにSecure Bootは現時点で不要とされています。他ゲームのBIOS手順を流用せず、該当エラーの案内へ。',
      },
      en: {
        title: 'PC anti-cheat moves to Javelin',
        condition:
          'Apex on PC, if a Javelin launch error appears after updating.',
        change:
          'EA announced a switch from EAC to Javelin from September 29, 2026, applied when launching after the game update.',
        check:
          'Check that the update finished and record the exact error. The announcement says Apex does not currently require Secure Boot. Do not reuse another game’s BIOS instructions; follow the matching error guide.',
      },
      zh: {
        title: 'PC 版反作弊改为 Javelin',
        condition: 'PC 版 Apex，更新后出现 Javelin 启动错误时。',
        change:
          'EA 宣布自2026年9月29日起由 EAC 切换至 Javelin，完成游戏更新后启动即可迁移。',
        check:
          '先确认更新完成并记录完整错误。公告表示 Apex 当时不要求 Secure Boot。不要套用其他游戏的 BIOS 操作，按具体错误查看指南。',
      },
      es: {
        title: 'El antitrampas de PC pasa a Javelin',
        condition:
          'Apex en PC, si aparece un error de inicio de Javelin tras actualizar.',
        change:
          'EA anunció el cambio de EAC a Javelin desde el 29 de septiembre de 2026, al iniciar después de actualizar el juego.',
        check:
          'Confirma que terminó la actualización y anota el error completo. El anuncio indica que Apex no requiere Secure Boot por ahora. No copies instrucciones de BIOS de otro juego; consulta la guía del error.',
      },
    },
  },
  {
    id: 'pubg-conflict-371-v1',
    gameSlug: 'pubg',
    publishedOn: '2025-08-11',
    checkedOn: '2026-10-14',
    sourceUrl: 'https://www.pubg.com/ja/news/9001',
    articlePath: '/games/pubg/anti-cheat-conflict-warning',
    copy: {
      ja: {
        title: '37.1で導入された同時起動時の警告',
        condition:
          'PC版PUBGと、独自セキュリティ付きの別ゲームを同時起動し、ロビーで競合警告が出る場合。',
        change:
          '2025年8月の公式レターは、37.1以降にこの条件でロビー入室時の警告を表示すると説明しています。最近の障害告知ではありません。',
        check:
          '警告全文を記録し、もう一方のゲームを通常終了してPUBGのみで比較。アンチチートや保護機能は停止せず、特定製品を原因と決めつけないでください。',
      },
      en: {
        title: 'Concurrent-game warning introduced with 37.1',
        condition:
          'PUBG on PC, with another game using its own security software open, when a conflict warning appears at the lobby.',
        change:
          'The August 2025 official letter describes a lobby warning under these conditions from 37.1. This is not a recent outage notice.',
        check:
          'Record the message, exit the other game normally and compare with PUBG alone. Do not stop anti-cheat or security protection, or assume a particular product is responsible.',
      },
      zh: {
        title: '37.1引入同时运行游戏时的警告',
        condition:
          'PC 版 PUBG 与带独立安全软件的其他游戏同时运行，进入大厅出现冲突警告时。',
        change:
          '2025年8月官方说明介绍了37.1起在此条件下显示大厅警告。这不是近期故障公告。',
        check:
          '记录完整警告，正常退出另一个游戏，只运行 PUBG 比较。不停止反作弊或安全保护，不认定特定产品是原因。',
      },
      es: {
        title: 'Aviso al ejecutar varios juegos, introducido en 37.1',
        condition:
          'PUBG en PC y otro juego con seguridad propia abiertos a la vez, si aparece un aviso de conflicto al entrar en la sala.',
        change:
          'La carta oficial de agosto de 2025 describe este aviso desde 37.1. No es un anuncio de una incidencia reciente.',
        check:
          'Anota el mensaje, cierra normalmente el otro juego y compara con PUBG solo. No detengas el antitrampas ni la protección, ni atribuyas la causa a un producto concreto.',
      },
    },
  },
];
export function validChangeDate(value: string) {
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    Number.isFinite(Date.parse(value)) &&
    new Date(value).toISOString().slice(0, 10) === value
  );
}
export function changesForGame(
  gameSlug: string,
  locale: MyGamesLocale,
  today = new Date().toISOString().slice(0, 10),
  registry = officialGameChanges,
) {
  return registry
    .filter(
      (item) =>
        item.gameSlug === gameSlug &&
        validChangeDate(item.publishedOn) &&
        validChangeDate(item.checkedOn) &&
        item.publishedOn <= item.checkedOn &&
        item.checkedOn <= today &&
        item.sourceUrl.startsWith('https://') &&
        item.id &&
        /^\/games\/[a-z0-9-]+\/[a-z0-9-]+$/.test(item.articlePath),
    )
    .flatMap((item) => {
      const complete = (c?: ChangeCopy): c is ChangeCopy =>
        !!c &&
        [c.title, c.condition, c.change, c.check].every(
          (v) => typeof v === 'string' && v.trim(),
        );
      const copyLocale = complete(item.copy[locale]) ? locale : 'ja';
      const copy = item.copy[copyLocale];
      if (!complete(copy)) return [];
      const articleJapanese =
        locale !== 'ja' && !hasTranslation(locale, item.articlePath);
      return [
        {
          ...item,
          copy,
          copyLocale,
          articleJapanese,
          articleHref:
            locale === 'ja' || articleJapanese
              ? item.articlePath
              : `/${locale}${item.articlePath}`,
        },
      ];
    })
    .sort((a, b) => b.publishedOn.localeCompare(a.publishedOn));
}
export type VisibleGameChange = ReturnType<typeof changesForGame>[number];
