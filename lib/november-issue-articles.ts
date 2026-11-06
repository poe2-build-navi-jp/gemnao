import { recentOfficialChanges } from './recent-official-changes';
import type { GameArticle } from '@/lib/game-articles';
import type { LocalizedArticle } from '@/lib/localized/types';

type Language = 'ja' | 'en' | 'zh' | 'es';
type StepCopy = { title: string; summary: string; actions: string[] };
type Copy = {
  title: string;
  short: string;
  lead: string;
  answer: string;
  steps: [StepCopy, StepCopy, StepCopy];
  avoid: string;
  faq: [string, string];
};
type Guide = {
  gameSlug: string;
  gameName: string;
  slug: string;
  category: GameArticle['category'];
  ids: [string, string, string];
  sources: { label: string; url: string }[];
  related: string;
  relatedEn: string;
  copy: Record<Language, Copy>;
};
const checkedAt = '2026-11-04';

const guides: Guide[] = [
  {
    gameSlug: 'planet-zoo-2',
    gameName: 'Planet Zoo 2',
    slug: 'franchise-save-not-loading',
    category: 'save',
    ids: ['check-version', 'open-franchise', 'report-load-failure'],
    sources: [
      {
        label:
          'Frontier Developments · Planet Zoo 2 Official Announcements (1.0.7, 1.0.8, Under Investigation)',
        url: 'https://steamcommunity.com/app/3219030/announcements',
      },
      {
        label: 'Frontier Developments · Planet Zoo 2 Issue Tracker',
        url: 'https://issues.frontierstore.net/reported-issues/planet-zoo-2',
      },
    ],
    related: 'crashing-autosave',
    relatedEn: '/en/games/planet-zoo-2/crashing-autosave',
    copy: {
      ja: {
        title:
          'Planet Zoo 2のフランチャイズのセーブが開けない時｜再開エラーと読み込み失敗',
        short: 'フランチャイズのセーブが開けない',
        lead: 'PC版で「再開」から動物園に戻れない、接続エラーが出る、動物園が一覧に見当たらないときの確認手順です。',
        answer:
          '1.0.6の「再開」ボタンで接続エラーになり、ほかのモードも開けなくなる不具合は1.0.7で修正されました。この不具合でセーブは失われていないとFrontierが案内しています。最新版に更新し、ゲームを再起動してフランチャイズのモードボタンから入れるか確認してください。',
        steps: [
          {
            title: 'ゲームの版とエラーが出る画面を確認',
            summary: '修正済みの1.0.6固有の症状かを切り分けます。',
            actions: [
              'Steamで更新を完了し、確認できる版番号を控える。11月4日のFrontier告知では1.0.8が配信済みで、セーブ関連は継続対応項目です。',
              '「再開」の直後に接続エラーが出る、一覧に動物園がない、読み込み中にゲーム自体が終了する、のどれかを記録する。',
            ],
          },
          {
            title: 'フランチャイズのモードボタンから入る',
            summary: '「再開」とモード一覧の結果を比べます。',
            actions: [
              'ゲームを再起動し、メインメニューのフランチャイズのモードボタンを選ぶ。Frontierが1.0.6向けに案内した回避手順です。',
              '動物園が表示されるかと、選択して開けるかを別々に確認する。接続が拒否される場合は、個人で管理する回線に限り、VPNを使っていればVPNなしで比較する。',
            ],
          },
          {
            title: '最新版でも開けない場合は再現情報を添える',
            summary: 'セーブを保全したまま、止まる位置を伝えます。',
            actions: [
              '動物園名、版、時刻、操作順、エラー全文、ほかのモードが開けるかを控える。個人情報を隠した画面を添えてFrontierのIssue Trackerで既報を確認する。',
              '保存中にゲームが落ちる場合は、関連記事のオートセーブ時クラッシュの手順へ進む。',
            ],
          },
        ],
        avoid: '動物園が見えないだけでセーブフォルダを削除・上書きしない。',
        faq: [
          '「再開」でエラーが出たらセーブは消えた？',
          'Frontierは1.0.6の該当不具合ではセーブが失われていないと案内しています。別の原因で一覧に出ないケースまで復元できると確認したわけではありません。',
        ],
      },
      en: {
        title:
          'Planet Zoo 2 Franchise Save Won’t Load: Resume Error and Save Checks',
        short: 'Franchise save won’t load',
        lead: 'For a PC player who gets a connection error, cannot reopen a zoo, or cannot find it in the Franchise list.',
        answer:
          'Hotfix 1.0.7 fixed the 1.0.6 bug that blocked game modes after resuming a Franchise save. Frontier said this specific bug did not delete saves. Update and restart, then open Franchise from its mode button.',
        steps: [
          {
            title: 'Record the version and where loading fails',
            summary: 'Identify the symptoms of the historical 1.0.6 bug.',
            actions: [
              'Finish pending Steam updates and note the version. Frontier listed 1.0.8 as released and save issues as ongoing on November 4.',
              'Distinguish a Resume connection error, a missing zoo in the list and the game closing while loading.',
            ],
          },
          {
            title: 'Enter through the Franchise mode button',
            summary: 'Compare this route with Resume.',
            actions: [
              'Restart and choose Franchise from the main menu. This was Frontier’s workaround for 1.0.6.',
              'Check separately whether the zoo is listed and whether it opens. On a network you manage, compare without a VPN if you use one and the server refuses the connection.',
            ],
          },
          {
            title: 'Report a failure that persists after updating',
            summary: 'Preserve your saves and capture the failure.',
            actions: [
              'Record the zoo name, game version, time, exact error, sequence and whether other modes open. Remove personal information from screenshots before checking Frontier’s issue tracker.',
              'If the game closes while saving, use the related autosave-crash guide.',
            ],
          },
        ],
        avoid:
          'Keep your saves folder intact if the zoo is missing from the menu.',
        faq: [
          'Did a Resume error delete my save?',
          'Frontier confirmed that the specific 1.0.6 Resume bug did not delete saves. Other causes of a missing zoo need separate investigation.',
        ],
      },
      zh: {
        title: '《动物园之星2》特许经营存档无法加载：继续游戏报错怎么办',
        short: '特许经营存档无法加载',
        lead: '适用于 PC 版继续游戏时连接报错、打不开动物园，或列表中找不到动物园的情况。',
        answer:
          '1.0.6 中，继续特许经营存档后可能出现连接错误，继而无法进入其他模式。1.0.7 已修复这个问题，Frontier 确认该故障不会删除存档。更新并重启后，从主菜单的特许经营模式按钮进入。',
        steps: [
          {
            title: '核对版本及出错画面',
            summary: '判断是否符合 1.0.6 的已修复症状。',
            actions: [
              '等待 Steam 更新完成，记下版本。Frontier 11 月 4 日的公告称 1.0.8 已发布，存档问题仍在持续处理。',
              '区分点击继续后连接报错、列表缺少动物园和加载中游戏退出。',
            ],
          },
          {
            title: '通过特许经营模式按钮进入',
            summary: '对比从模式按钮和从继续按钮进入的结果。',
            actions: [
              '重启游戏，通过主菜单的模式按钮进入。这是 Frontier 为 1.0.6 提供的临时办法。',
              '分别确认动物园是否出现在列表中以及能否打开。若服务器拒绝连接且自己管理网络，可对比使用和不使用 VPN 的结果。',
            ],
          },
          {
            title: '更新后仍无法打开时提交复现信息',
            summary: '保留存档，记录故障发生的位置。',
            actions: [
              '记录动物园名称、游戏版本、时间、操作顺序、完整报错及其他模式能否进入。截图请遮盖个人信息，再查看 Frontier 的问题追踪器。',
              '若游戏是在保存过程中退出，查看相关文章中的自动保存崩溃指南。',
            ],
          },
        ],
        avoid: '不要因为列表看不到动物园就删除或覆盖存档文件夹。',
        faq: [
          '点击继续报错是不是存档丢了？',
          'Frontier 确认 1.0.6 的这一故障不会导致存档丢失。其他原因造成的存档不可见需要另行排查。',
        ],
      },
      es: {
        title:
          'Planet Zoo 2 no carga la partida de Franquicia: error al continuar',
        short: 'La partida de Franquicia no carga',
        lead: 'Para PC cuando aparece un error de conexión al continuar o no encuentras tu zoo en la lista de Franquicia.',
        answer:
          'El parche 1.0.7 corrigió un fallo de la versión 1.0.6 que impedía abrir otros modos tras intentar continuar una partida de Franquicia. Frontier confirmó que ese fallo no borraba las partidas. Actualiza, reinicia y entra por el botón del modo Franquicia.',
        steps: [
          {
            title: 'Comprueba la versión y la pantalla del error',
            summary: 'Identifica los síntomas del fallo de la versión 1.0.6.',
            actions: [
              'Termina las descargas de Steam y anota la versión. El 4 de noviembre Frontier indicaba que 1.0.8 ya estaba disponible y que seguía trabajando en problemas de guardado.',
              'Distingue un error de conexión al continuar, un zoo ausente y un cierre del juego mientras carga.',
            ],
          },
          {
            title: 'Entra por el botón del modo Franquicia',
            summary: 'Compara este acceso con la opción de continuar.',
            actions: [
              'Reinicia y elige Franquicia en el menú principal. Era la solución provisional de Frontier para la versión 1.0.6.',
              'Comprueba por separado si el zoo aparece y si se abre. Si el servidor rechaza la conexión y usas una VPN en una red que administras, prueba sin ella.',
            ],
          },
          {
            title: 'Documenta el fallo si sigue ocurriendo',
            summary: 'Conserva los archivos y anota dónde se detiene la carga.',
            actions: [
              'Anota el zoo, la versión, la hora, los pasos, el error completo y si funcionan los demás modos. Oculta datos personales de las capturas y consulta el rastreador de Frontier.',
              'Si el juego se cierra al guardar, consulta la guía relacionada sobre cierres durante el autoguardado.',
            ],
          },
        ],
        avoid:
          'No borres ni sobrescribas la carpeta de partidas solo porque el zoo no aparece.',
        faq: [
          '¿Perdí mi partida si falló la opción de continuar?',
          'Frontier confirmó que ese fallo de la versión 1.0.6 no borraba las partidas. Si el zoo no aparece por otra causa, investiga ese caso por separado.',
        ],
      },
    },
  },
  {
    gameSlug: 'enshrouded',
    gameName: 'Enshrouded',
    slug: 'crash-multiplayer-performance',
    category: 'launch',
    ids: ['verify-patch', 'compare-scene', 'collect-details'],
    sources: [
      {
        label: 'Keen Games · Patch 1.0.1.0 (November 2)',
        url: 'https://enshrouded.com/en-us/news/changelog-for-patch-1',
      },
      {
        label: 'Keen Games · Hotfix 1.0.1.1 (November 3)',
        url: 'https://enshrouded.com/ja-JP/news/changelog-for-hotfix-4-v1011',
      },
    ],
    related: 'black-screen-save-migration',
    relatedEn: '/en/games/enshrouded/black-screen-save-migration',
    copy: {
      ja: {
        title:
          'Enshrouded 1.0で落ちる・マルチだけ重い時｜水辺と大規模拠点の確認',
        short: '1.0のクラッシュ・マルチの重さ',
        lead: '正式版のPCで、水辺や大規模拠点で落ちる、マルチプレイ中だけ重い場合を扱います。',
        answer:
          '11月2日の1.0.1.0はランダムクラッシュと大規模拠点のマルチホスト時の安定性を改善。11月3日の1.0.1.1は水シミュレーションに関連するクラッシュと、ログが大量に出て重くなる問題を修正しました。更新後も続く場合は、場所とホスト・参加側を分けて比べます。',
        steps: [
          {
            title: 'PC版の更新と版番号を確認',
            summary: '1.0.1.0と1.0.1.1の修正対象を照合します。',
            actions: [
              'Steamの更新が終わっているか確認。公式の1.0.1.1はVersion 1285601です。',
              '水辺で終了する、拠点で画面が重い、接続時に黒画面になる、のどれかを控える。専用サーバー検索時のクラッシュ修正は告知ではPS5向けです。',
            ],
          },
          {
            title: '水辺・拠点・接続直後で症状を比べる',
            summary: '発生場面と参加形態を一つずつ変えます。',
            actions: [
              '水辺や大規模拠点で発生したなら、危険のない場面で同じ場所と別の場所を比べる。設定を変える前に再現条件を控える。',
              'マルチだけならホスト側と参加側のどちらで起きるか、全員が重いかを確認。ゲーム終了、フレーム低下、接続切断を区別する。',
            ],
          },
          {
            title: '再現情報を公式サポートへ渡す',
            summary: '直った条件と残る症状を分けて記録します。',
            actions: [
              '版、場所、人数、ホストか参加側か、発生時刻、エラー全文を控える。パッチページのサポート窓口から、分かった範囲で報告する。',
              '接続直後の黒画面や旧セーブの移行問題は、関連記事の該当手順に進む。',
            ],
          },
        ],
        avoid:
          '原因を調べるためだけに元のワールドを消したり、唯一のセーブで移行や復元を繰り返したりしない。',
        faq: [
          '水辺で落ちるなら1.0.1.1で必ず直る？',
          '公式は水シミュレーションに関連する一つのクラッシュを修正と告知しています。更新後も同じ場所で続くなら、位置と操作を記録して別の再現例として報告してください。',
        ],
      },
      en: {
        title:
          'Enshrouded 1.0 Crashes or Multiplayer Stutters: Water and Large Bases',
        short: 'Crashes and multiplayer stutter',
        lead: 'For PC crashes near water, slowdowns in large bases or performance issues that occur only in multiplayer.',
        answer:
          'Patch 1.0.1.0 improved stability for hosts with large bases and fixed random crashes. Hotfix 1.0.1.1 fixed a water simulation crash and log spam that could hurt performance. If symptoms persist after updating, compare the scene and who is affected.',
        steps: [
          {
            title: 'Check the installed PC update',
            summary: 'Match the symptom to the appropriate patch notes.',
            actions: [
              'Finish pending Steam updates. The official build for 1.0.1.1 is 1285601.',
              'Record whether the game closes near water, slows at a base or goes black while connecting. The dedicated-server search crash fix in that note is marked PS5.',
            ],
          },
          {
            title: 'Compare the scene and multiplayer role',
            summary: 'Change one condition at a time.',
            actions: [
              'Compare the affected location with a different safe location before changing settings.',
              'If it happens only in multiplayer, check whether the host, a guest or everyone is affected. Separate a game crash, lower frame rate and a disconnect.',
            ],
          },
          {
            title: 'Send reproducible details to support',
            summary: 'Record what still fails and when it works.',
            actions: [
              'Include build, location, player count, host or guest role, time and the exact error. Use the support contact on the patch page.',
              'For a black screen on join or an old-save migration issue, see the related guide.',
            ],
          },
        ],
        avoid:
          'Keep the original world and avoid retrying migration or restoration on your only save.',
        faq: [
          'Does 1.0.1.1 fix every crash near water?',
          'Keen fixed a crash linked to water simulation. If your updated game still crashes there, report the location and exact action as a reproducible case.',
        ],
      },
      zh: {
        title: 'Enshrouded 1.0 崩溃或联机卡顿：水域与大型基地排查',
        short: '崩溃与联机卡顿',
        lead: '适用于 PC 版在水边崩溃、大型基地卡顿或只在多人游戏中出现的性能问题。',
        answer:
          '11 月 2 日的 1.0.1.0 改善了大型基地房主的联机稳定性，并修复随机崩溃。11 月 3 日的 1.0.1.1 修复了与水体模拟有关的崩溃和大量日志造成的性能问题。更新后若仍复现，请比较地点及受影响的玩家。',
        steps: [
          {
            title: '确认 PC 版更新已安装',
            summary: '对照两个补丁的修复范围。',
            actions: [
              '等待 Steam 更新完成。1.0.1.1 的官方内部版本为 1285601。',
              '记下是在水边退出、在基地掉帧，还是联机时黑屏。更新公告中的专用服务器搜索崩溃修复标注为 PS5。',
            ],
          },
          {
            title: '对比地点与多人游戏身份',
            summary: '一次只改变一个条件。',
            actions: [
              '先在安全情况下比较故障地点和其他地点，再调整设置。',
              '仅联机时发生就确认是房主、加入者还是所有人受影响，区分游戏退出、帧率下降和断开连接。',
            ],
          },
          {
            title: '向官方支持提供复现信息',
            summary: '记录能正常运行的条件和仍出现的故障。',
            actions: [
              '记下版本、地点、人数、房主或加入者、时间和完整报错。可通过补丁页面的支持联系方式报告。',
              '进入多人游戏时黑屏或旧存档迁移异常，请查看相关文章。',
            ],
          },
        ],
        avoid: '保留原世界，避免在唯一的存档上反复迁移或恢复。',
        faq: [
          '1.0.1.1 能修好所有水边崩溃吗？',
          '官方修复了一项与水体模拟有关的崩溃。如果更新后仍在同一位置退出，请记录位置和具体操作并提交复现报告。',
        ],
      },
      es: {
        title:
          'Enshrouded 1.0 se cierra o va lento en multijugador: agua y bases grandes',
        short: 'Cierres y tirones en multijugador',
        lead: 'Para PC si el juego se cierra cerca del agua, pierde fluidez en una base grande o falla solo en multijugador.',
        answer:
          'El parche 1.0.1.0 mejoró la estabilidad al alojar partidas con bases grandes y corrigió cierres aleatorios. La versión 1.0.1.1 corrigió un cierre relacionado con la simulación del agua y un exceso de mensajes de registro que afectaba al rendimiento. Si persiste, compara la escena y quién sufre el problema.',
        steps: [
          {
            title: 'Comprueba la actualización de PC',
            summary: 'Consulta el alcance de las dos correcciones.',
            actions: [
              'Termina la actualización de Steam. La compilación oficial de 1.0.1.1 es 1285601.',
              'Anota si el juego se cierra cerca del agua, va lento en la base o muestra una pantalla negra al conectarte. La corrección del cierre al buscar servidores dedicados figura como exclusiva de PS5.',
            ],
          },
          {
            title: 'Compara la escena y tu papel en la partida',
            summary: 'Cambia un solo factor cada vez.',
            actions: [
              'Antes de cambiar ajustes, compara el lugar afectado con otro lugar seguro.',
              'Si ocurre solo en multijugador, comprueba si afecta al anfitrión, a un invitado o a todos. Distingue entre un cierre, una caída de FPS y una desconexión.',
            ],
          },
          {
            title: 'Envía un informe reproducible',
            summary: 'Anota cuándo funciona y cuándo sigue fallando.',
            actions: [
              'Incluye versión, ubicación, número de jugadores, tu papel, hora y error exacto. Usa el contacto de soporte de las notas del parche.',
              'Si falla al entrar con pantalla negra o al migrar una partida antigua, consulta la guía relacionada.',
            ],
          },
        ],
        avoid:
          'Conserva el mundo original y evita repetir migraciones o restauraciones con tu única partida.',
        faq: [
          '¿1.0.1.1 corrige todos los cierres cerca del agua?',
          'Keen corrigió un cierre relacionado con la simulación del agua. Si vuelve a ocurrir en la versión actualizada, informa de la ubicación y de la acción exacta.',
        ],
      },
    },
  },
  {
    gameSlug: 'call-of-duty-modern-warfare-4',
    gameName: 'Call of Duty: Modern Warfare 4',
    slug: 'dmz-prestige-trait-missing',
    category: 'server',
    ids: ['match-symptom', 'record-items', 'report-prestige'],
    sources: [
      {
        label: 'Activision · Modern Warfare 4 Known Issues (October 30)',
        url: 'https://support.activision.com/ja/modern-warfare-4/articles/known-issues-in-modern-warfare-4',
      },
      {
        label: 'Activision · Modern Warfare 4 Support',
        url: 'https://support.activision.com/modern-warfare-4',
      },
    ],
    related: 'crash',
    relatedEn: '/games/call-of-duty-modern-warfare-4/crash',
    copy: {
      ja: {
        title: 'CoD MW4のDMZでプレステージ特性が付かない｜アイテムだけ消えた時',
        short: 'DMZの特性が付かない・アイテム消費',
        lead: 'DMZのオペレーターをプレステージした後、保管庫のアイテムが減ったのに特性が付かない場合の確認手順です。',
        answer:
          'Activisionは10月30日更新の既知の問題で、保管庫のアイテムが減ったのにDMZオペレーターのPrestige Traitが付かない問題を全機種で調査中と案内しています。手順を繰り返してアイテムを追加消費する前に、オペレーター名と表示を控えてください。',
        steps: [
          {
            title: 'アイテムの消費と特性の付与を別々に確認',
            summary: '公式の調査対象に一致するかを見ます。',
            actions: [
              '操作したオペレーターの特性欄と保管庫を確認する。操作自体を開始できない、消費なしで反映されない、ゲームが終了した、という症状も別に記録する。',
              '既知の問題ページの更新日と、該当する項目が調査中か修正済みかを確認する。',
            ],
          },
          {
            title: '再試行の前に記録を残す',
            summary: '追加の消費を避けながら、報告に使える情報を残します。',
            actions: [
              '日時とタイムゾーン、機種・ストア、オペレーター名、分かる範囲で消費した品と数量を控える。操作前の画面がなければ不明と書く。',
              '特性欄と保管庫の画面を撮り、共有する場合はアカウントの個人情報を隠す。',
            ],
          },
          {
            title: '公式窓口へ報告する',
            summary: '操作の順番と、期待した結果・実際の結果を伝えます。',
            actions: [
              'ActivisionのMW4サポートから報告先を選び、上の記録を添える。アイテムの返還や特性付与の可否は公式の案内を待つ。',
              'ゲームの強制終了が主症状なら、関連記事のPC版クラッシュの手順へ進む。',
            ],
          },
        ],
        avoid:
          '報告に使う証拠を集めるために、アイテムを消費する操作を繰り返さない。',
        faq: [
          '消えたアイテムは戻る？',
          '10月30日更新の告知は調査中という案内です。返還方法や補償が確定したとは確認できていません。',
        ],
      },
      en: {
        title: 'MW4 DMZ Prestige Trait Missing After Stash Items Were Consumed',
        short: 'DMZ Prestige Trait missing',
        lead: 'For a DMZ Operator prestige attempt that consumed Stash items without awarding the Prestige Trait.',
        answer:
          'Activision’s October 30 known-issues update lists this as an investigation affecting all platforms. Record the Operator and what the game shows before risking more items on another attempt.',
        steps: [
          {
            title: 'Check the trait and item consumption separately',
            summary: 'Confirm whether this matches the tracked symptom.',
            actions: [
              'Check the trait slot for the Operator you used and the Stash. Record separately if you could not start the action, no items were consumed or the game closed.',
              'Check the date of the known-issues page and whether the issue is still being investigated.',
            ],
          },
          {
            title: 'Record details before retrying',
            summary:
              'Preserve what you can document without spending more items.',
            actions: [
              'Record the time and time zone, platform or store, Operator and item quantities if known. Mark unknown details as unknown.',
              'Capture the trait screen and Stash. Remove personal account information before sharing screenshots.',
            ],
          },
          {
            title: 'Report the issue to Activision',
            summary:
              'Include the exact sequence, expected outcome and observed outcome.',
            actions: [
              'Use the relevant option on the MW4 support page and include your notes. Check official updates for any guidance on refunds or trait grants.',
              'If the main symptom is the game closing, see the related PC crash guide.',
            ],
          },
        ],
        avoid:
          'Avoid spending more items solely to reproduce the problem for a report.',
        faq: [
          'Will I get my items back?',
          'The October 30 entry describes an investigation. It does not announce a confirmed recovery or compensation process.',
        ],
      },
      zh: {
        title: 'CoD MW4 DMZ 未获得声望特性但仓库物品已消耗',
        short: 'DMZ 声望特性未获得',
        lead: '适用于 DMZ 干员进行声望操作后仓库物品减少，但没有获得对应特性的情况。',
        answer:
          'Activision 在 10 月 30 日更新的已知问题中，将此列为正在调查的全平台故障。再次尝试可能消耗更多物品，请先记下干员和界面显示。',
        steps: [
          {
            title: '分别核对特性和物品消耗',
            summary: '确认是否符合官方正在调查的症状。',
            actions: [
              '查看所用干员的特性和仓库。若操作无法开始、物品没有消耗或游戏退出，请单独记录。',
              '核对已知问题页面的日期与调查状态。',
            ],
          },
          {
            title: '再次尝试前保留信息',
            summary: '先记录现有证据，避免额外消耗。',
            actions: [
              '记下时间和时区、平台或商店、干员及已知的物品数量。不确定的数据标为未知。',
              '截取特性和仓库界面，分享前遮盖账号个人信息。',
            ],
          },
          {
            title: '向 Activision 报告',
            summary: '写清操作顺序、预期结果与实际结果。',
            actions: [
              '在 MW4 支持页面选择适合的入口，附上记录。物品返还或补发特性请以官方后续说明为准。',
              '若主要症状是游戏退出，请查看相关的 PC 崩溃指南。',
            ],
          },
        ],
        avoid: '不要为了报告而重复消耗仓库物品。',
        faq: [
          '消耗的物品会返还吗？',
          '10 月 30 日的公告显示仍在调查，未公布已经确定的找回或补偿流程。',
        ],
      },
      es: {
        title:
          'CoD MW4: falta el rasgo de prestigio de DMZ tras consumir objetos',
        short: 'Falta el rasgo de prestigio de DMZ',
        lead: 'Si el alijo pierde objetos al intentar el prestigio de un operador de DMZ y el rasgo no aparece.',
        answer:
          'La lista de problemas conocidos de Activision del 30 de octubre indica que se está investigando en todas las plataformas. Anota el operador y lo que muestra el juego antes de arriesgar más objetos.',
        steps: [
          {
            title: 'Comprueba por separado el rasgo y el alijo',
            summary: 'Verifica si coincide con el problema investigado.',
            actions: [
              'Revisa el rasgo del operador utilizado y el alijo. Anota por separado si no pudiste iniciar la acción, no se consumieron objetos o el juego se cerró.',
              'Revisa la fecha y el estado del problema en la lista oficial.',
            ],
          },
          {
            title: 'Guarda los datos antes de volver a intentarlo',
            summary: 'Conserva pruebas sin gastar más objetos.',
            actions: [
              'Anota hora y zona horaria, plataforma o tienda, operador y cantidad de objetos si la conoces. Indica lo que no puedas comprobar.',
              'Captura las pantallas del rasgo y del alijo. Oculta datos personales de la cuenta antes de compartirlas.',
            ],
          },
          {
            title: 'Informa a Activision',
            summary:
              'Indica los pasos, el resultado esperado y lo que ocurrió.',
            actions: [
              'Selecciona la opción pertinente del soporte de MW4 y adjunta tus notas. Consulta futuras indicaciones oficiales sobre recuperación de objetos o concesión del rasgo.',
              'Si el síntoma principal es el cierre del juego, consulta la guía relacionada de PC.',
            ],
          },
        ],
        avoid:
          'Evita gastar objetos adicionales solo para reproducir el problema.',
        faq: [
          '¿Me devolverán los objetos?',
          'La entrada del 30 de octubre indica que el fallo se investiga. No anuncia un proceso confirmado de recuperación ni de compensación.',
        ],
      },
    },
  },
];

const minutes: Record<Language, string> = {
  ja: '約2〜5分',
  en: 'About 2–5 min',
  zh: '约 2–5 分钟',
  es: 'Unos 2–5 min',
};
const relatedLabels: Record<Language, string> = {
  ja: '関連する症状の確認手順',
  en: 'Troubleshoot the related symptom',
  zh: '相关症状的排查指南',
  es: 'Guía del síntoma relacionado',
};
const sourceNotes: Record<Language, string> = {
  ja: '公式告知に基づく案内です。個別環境での実機再現は確認していません。',
  en: 'Based on official notices. Individual PC configurations were not tested.',
  zh: '依据官方公告整理，未对个别电脑配置进行实机验证。',
  es: 'Guía basada en avisos oficiales, sin pruebas en configuraciones individuales.',
};
const sourceLanguage: Record<Language, string> = {
  ja: '公式資料',
  en: 'Official source',
  zh: '官方资料',
  es: 'Fuente oficial',
};

function content(guide: Guide, locale: Language) {
  const path = `/games/${guide.gameSlug}/${guide.slug}`;
  const updates = recentOfficialChanges.filter((change) => change.articlePath === path || change.additionalArticlePaths?.includes(path));
  const latest = updates[0]?.copy[locale];
  const original = guide.copy[locale];
  const copy = latest ? { ...original, answer: `${latest.condition} ${latest.change} ${original.answer}` } : original;
  const reviewedOn = [checkedAt, ...updates.map((change) => change.checkedOn)].sort().at(-1)!;
  const sourceEntries = [...guide.sources, ...updates.map((change) => ({url: change.sourceUrl, label: change.copy[locale]?.title || change.copy.en!.title}))];
  const sources = sourceEntries.filter((source, index, all) => all.findIndex((item) => item.url === source.url) === index).map((source) => ({
    ...source,
    label: sourceLanguage[locale] + ' · ' + source.label,
  }));
  const steps = copy.steps.map((step, index) => ({
    ...step,
    id: guide.ids[index],
    time: minutes[locale],
    risk: 'low' as const,
  }));
  return {
    copy,
    reviewedOn,
    sources,
    steps,
    faqs: [{ question: copy.faq[0], answer: copy.faq[1] }],
  };
}

export const novemberIssueArticles: GameArticle[] = guides.map((guide) => {
  const { copy, reviewedOn, sources, steps, faqs } = content(guide, 'ja');
  return {
    gameSlug: guide.gameSlug,
    slug: guide.slug,
    category: guide.category,
    checkedAt: reviewedOn,
    status: 'verified',
    title: copy.title,
    seoTitle: copy.title,
    shortTitle: copy.short,
    symptom: copy.lead,
    conclusion: copy.answer,
    description: copy.lead,
    metaDescription: copy.answer,
    steps,
    faqs,
    sources,
    symptoms: steps.map((step) => ({ label: step.title, target: step.id })),
    avoid: [copy.avoid],
    cautions: [sourceNotes.ja],
    related: [guide.related],
  };
});

const translatedLanguages = ['en', 'zh', 'es'] as const;

export const novemberIssueTranslations: LocalizedArticle[] = guides.flatMap(
  (guide) =>
    translatedLanguages.map((locale): LocalizedArticle => {
      const { copy, reviewedOn, sources, steps, faqs } = content(guide, locale);
      const relatedLanguage = guide.relatedEn.startsWith('/en/')
        ? { en: 'English', zh: '英语', es: 'inglés' }[locale]
        : { en: 'Japanese', zh: '日语', es: 'japonés' }[locale];
      return {
        locale,
        gameSlug: guide.gameSlug,
        gameName: guide.gameName,
        slug: guide.slug,
        checkedAt: reviewedOn,
        title: copy.title,
        shortTitle: copy.short,
        description: copy.answer,
        lead: copy.lead,
        summary: copy.answer,
        steps,
        faqs,
        sources,
        quickFacts: [],
        diagnosis: [],
        avoid: [copy.avoid],
        cautions: [sourceNotes[locale]],
        related: [
          {
            href: guide.relatedEn,
            label: relatedLabels[locale] + ' (' + relatedLanguage + ')',
          },
        ],
      };
    }),
);
