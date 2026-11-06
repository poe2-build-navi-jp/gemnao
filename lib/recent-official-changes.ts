import type { OfficialGameChange } from './my-game-changes';

// Editorial summaries of primary sources, checked on 2026-11-06 (Japan time).
// Release notes describe fixes; they are not independently reproduced results.
export const recentOfficialChanges: OfficialGameChange[] = [
  {
    id: 'planet-zoo-2-109-20261105-v1',
    gameSlug: 'planet-zoo-2',
    publishedOn: '2026-11-05',
    checkedOn: '2026-11-06',
    sourceUrl: 'https://steamcommunity.com/app/3219030/announcements/',
    sourceLanguage: 'en',
    articlePath: '/games/planet-zoo-2/franchise-save-not-loading',
    additionalArticlePaths: ['/games/planet-zoo-2/crashing-autosave'],
    copy: {
      ja: {
        title: '1.0.9：ショップ関連・動物園ロード時のクラッシュ修正',
        condition:
          'Loony Bloons（ショップ・カウンター）やSouvenirショップの利用後、動物園の読み込みでも落ちる場合。',
        change:
          'Frontierは1.0.9を配信し、この事象の修正と対象セーブの再読み込みが可能になることを案内しています。すべてのセーブ障害の修正ではありません。',
        check:
          '更新完了と版を確認し、元のセーブを消さずに結果を比較。続く場合はショップの種類・落ちる場面・版を控え、公式Issue Trackerへ。',
      },
      en: {
        title: '1.0.9: shop-related and zoo-loading crash fix',
        condition:
          'A crash after using Loony Bloons shops/counters or Souvenir shops, including when loading the affected zoo.',
        change:
          'Frontier released 1.0.9 for this incident and says affected zoos should load again. This is not a fix for every save problem.',
        check:
          'Finish the update and record the version. Keep the original save, compare the result, and report remaining failures with the shop type and crash stage to the official issue tracker.',
      },
      zh: {
        title: '1.0.9：商店相关及动物园加载崩溃修复',
        condition:
          '使用 Loony Bloons 商店、柜台或 Souvenir 商店后崩溃，之后加载该动物园时也退出。',
        change:
          'Frontier 已发布 1.0.9，表示受此问题影响的动物园应能再次加载。这并不代表所有存档问题均已修复。',
        check:
          '完成更新并记录版本，保留原存档后比较结果。若仍失败，记录商店种类、崩溃阶段及版本，再提交官方问题追踪器。',
      },
      es: {
        title: '1.0.9: corrección de cierres por tiendas y al cargar zoos',
        condition:
          'Cierre tras usar tiendas o mostradores Loony Bloons o tiendas Souvenir, incluso al cargar el zoo afectado.',
        change:
          'Frontier publicó 1.0.9 para este fallo e indica que los zoos afectados deberían volver a cargar. No corrige todos los problemas de guardado.',
        check:
          'Completa la actualización y anota la versión. Conserva la partida original, compara el resultado y comunica los fallos restantes con el tipo de tienda y el momento del cierre al registro oficial.',
      },
    },
  },
  {
    id: 'enshrouded-1012-20261104-v1',
    gameSlug: 'enshrouded',
    publishedOn: '2026-11-04',
    checkedOn: '2026-11-06',
    sourceUrl: 'https://enshrouded.com/en-US/news/changelog-for-hotfix-5-v1012',
    sourceLanguage: 'en',
    articlePath: '/games/enshrouded/black-screen-save-migration',
    additionalArticlePaths: ['/games/enshrouded/crash-multiplayer-performance'],
    copy: {
      ja: {
        title: '1.0.1.2：特定ワールドの無限黒画面・クラッシュ修正',
        condition:
          '特定ワールドへのログイン時の無限黒画面、水関連、旧アイテムや旧設計図の使用時に落ちる場合。',
        change:
          '11/4のHotfix #5（公式Version 1287369）は、これらのまれな不具合の修正を告知しています。一般の通信エラーまで直るとは案内していません。',
        check:
          '10月の1.0.0.3だけで判断せず、導入版を今回の履歴と照合。更新後も続く場合は場面と版を控え、ゲーム内F1のバグ報告へ。',
      },
      en: {
        title: '1.0.1.2: certain-world black screens and crash fixes',
        condition:
          'Endless loading into certain worlds, or crashes involving water, deprecated items or deprecated blueprints.',
        change:
          'The November 4 Hotfix #5 (Version 1287369) announces fixes for these rare cases, not all connection errors.',
        check:
          'Compare your installed build with these notes rather than relying only on October’s 1.0.0.3. If it persists after updating, record the build and situation and use the in-game F1 bug-report option.',
      },
      zh: {
        title: '1.0.1.2：特定世界无限黑屏及崩溃修复',
        condition: '登录特定世界时无限黑屏，或与水、旧物品及旧蓝图有关的崩溃。',
        change:
          '11 月 4 日 Hotfix #5（Version 1287369）公告修复这些少见情况，并非所有连接错误。',
        check:
          '不要只依据 10 月的 1.0.0.3，应核对当前安装版本与本次更新。更新后仍发生时，记录版本及场景，通过游戏内 F1 提交错误报告。',
      },
      es: {
        title: '1.0.1.2: pantallas negras en ciertos mundos y cierres',
        condition:
          'Carga interminable en ciertos mundos o cierres relacionados con agua, objetos antiguos o planos obsoletos.',
        change:
          'El Hotfix #5 del 4 de noviembre (Version 1287369) anuncia correcciones para estos casos poco frecuentes, no para todos los errores de conexión.',
        check:
          'Compara la versión instalada con estas notas, sin basarte solo en la 1.0.0.3 de octubre. Si continúa, anota la versión y la situación y usa la opción de informar de errores con F1 en el juego.',
      },
    },
  },
  {
    id: 'enshrouded-1010-20261102-v1',
    gameSlug: 'enshrouded',
    publishedOn: '2026-11-02',
    checkedOn: '2026-11-06',
    sourceUrl: 'https://enshrouded.com/en-US/news/changelog-for-patch-1',
    sourceLanguage: 'en',
    articlePath: '/games/enshrouded/black-screen-save-migration',
    copy: {
      ja: {
        title: '1.0.1.0：セーブ移行エラーの追加修正',
        condition:
          'Early Accessのセーブ移行がエラーになる、または拠点数が多い保存で移行に失敗する場合。',
        change:
          '11/2のPatch #1（Version 1283531）は移行エラーの複数ケースと、多数の拠点を持つ保存の移行用メモリ枠を改善しています。',
        check:
          'バックアップと元の保存を保ち、導入版を確認して公式案内を照合。失敗が続く唯一のセーブで変換を繰り返さず、状況を報告してください。',
      },
      en: {
        title: '1.0.1.0: additional save-migration fixes',
        condition:
          'An Early Access save fails migration, including saves with many player bases.',
        change:
          'The November 2 Patch #1 (Version 1283531) fixes several migration-error cases and increases the migration memory budget for saves with many bases.',
        check:
          'Keep backups and the original save, check the installed build and follow the official notes. If conversion still fails, report it rather than repeatedly risking your only copy.',
      },
      zh: {
        title: '1.0.1.0：追加存档迁移修复',
        condition: '抢先体验存档迁移失败，包含玩家基地数量很多的存档。',
        change:
          '11 月 2 日 Patch #1（Version 1283531）修复多种迁移错误，并提高多基地存档迁移时的内存预算。',
        check:
          '保留备份与原存档，核对已安装版本及官方说明。若仍失败，请报告，不要反复用唯一的存档尝试转换。',
      },
      es: {
        title: '1.0.1.0: más correcciones de migración de partidas',
        condition:
          'Fallo al migrar partidas de acceso anticipado, incluidas partidas con muchas bases.',
        change:
          'El Patch #1 del 2 de noviembre (Version 1283531) corrige varios errores de migración y amplía la memoria para migrar partidas con muchas bases.',
        check:
          'Conserva copias y la partida original, comprueba la versión y sigue las notas oficiales. Si falla, informa del caso en vez de repetir la conversión con tu única copia.',
      },
    },
  },
];
