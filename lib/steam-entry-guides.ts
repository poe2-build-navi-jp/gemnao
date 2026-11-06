import type { CommonGuide } from './common-guides';
import type { EnglishCommonGuide } from './localized/common-guides-en';
import type { TranslatedCommonGuide } from './localized/save-guides-zh-es';
type Lang = 'ja' | 'en' | 'zh' | 'es';
type Copy = {
  title: string;
  short: string;
  description: string;
  summary: string;
  steps: { title: string; actions: string[] }[];
  faqs: [string, string][];
  caution: string;
};
type Entry = {
  slug: string;
  topic: 'save' | 'launch';
  sources: [string, string][];
  related: string[];
  copy: Record<Lang, Copy>;
};
const entries: Entry[] = [
  {
    slug: 'steam-cloud-basics',
    topic: 'save',
    sources: [
      [
        'Steam Support: Steam Cloud',
        'https://help.steampowered.com/en/faqs/view/68D2-35AB-09A9-7678',
      ],
      [
        'Valve: Steamworks Cloud documentation',
        'https://partner.steamgames.com/doc/features/cloud',
      ],
      [
        'Steam: Remote Storage',
        'https://store.steampowered.com/account/remotestorage',
      ],
    ],
    related: [
      'steam-cloud-sync-error',
      'save-data-backup',
      'uninstall-save-data',
    ],
    copy: {
      ja: {
        title: 'Steamクラウドとは？設定・対応確認・保存先とPC移行前の確認',
        short: 'Steamクラウドの使い方・設定',
        description:
          'Steam Cloudの対応確認、全体設定とゲーム別設定、クラウドファイルの確認先を整理。PC買い替え時の同期確認と、手動バックアップ・競合対処の違いが分かります。',
        summary:
          'Steamクラウドは、対応ゲームが指定したデータを端末間で同期する機能です。まずストアのCloud対応表示、Steam全体とゲーム別の設定を確認します。正常な保存ならゲーム終了後の同期完了を待ち、PC移行前には手元のコピーも残してください。すでに競合や進行消失がある場合は、起動や設定変更より先に残ったデータを保全します。',
        steps: [
          {
            title: 'ゲームが何をCloudに保存するか確認する',
            actions: [
              '対象ゲームのSteamストアでSteam Cloudの対応表示を確認する。対応していても、セーブ・設定など何を同期するかは開発元が指定している。すべてのゲームや全ファイルが対象ではない。',
              '別ストア版・別アカウント・異なるOSとの引き継ぎは、Cloud対応表示だけで判断しない。使用するゲームと版の公式案内で、対象データと引き継ぎ条件を確認する。',
            ],
          },
          {
            title: 'Steam全体とゲーム別の設定を確認する',
            actions: [
              'Steamの設定のCloud項目と、ライブラリで対象ゲームを右クリック→プロパティ→一般のCloud同期項目を確認する。全体設定とゲーム別設定の両方を照合する。画面表記は版で変わる場合がある。',
              '設定が無効だった場合、その間の進行はその端末のローカルだけにある可能性がある。別PCにもデータがある、または競合中なら、すぐ有効化して同期させず先に各端末の候補をコピーする。',
            ],
          },
          {
            title: 'クラウドとローカルのファイルを区別する',
            actions: [
              '公式Remote Storageは、本人がSteamへログインして対象ゲームのクラウドファイルを確認する場所。表示されるファイルを保存する場合は別の日時付きフォルダーへダウンロードし、元データを上書きしない。',
              'WindowsのSteam\\userdata以下にはアカウント・アプリ別のCloud関連ファイルがある。ただし、すべてのゲームのセーブがここにあるわけではない。実際の保存先と必要なファイルはゲーム公式で確認する。',
            ],
          },
          {
            title: 'PC移行前は同期完了と手元のコピーを確認する',
            actions: [
              '正常な進行を移す場合は、古いPCで保存してゲームを終了し、Steamで同期が終わったことを確認する。保存先が確認できるローカルデータも、ゲームを閉じた状態で日付別にコピーしておく。',
              '新しいPCで確認する前に古いPCのデータを削除しない。ロード後の進行を上書き前に照合し、警告・競合・古い進行が出たら止めて同期エラーの記事へ。Steam Supportは失われた保存の復元を保証していない。',
            ],
          },
        ],
        faqs: [
          [
            'Steamクラウドはすべてのゲームで使えますか？',
            '使えるゲームと保存対象は開発元の設定によります。ストアの対応表示に加え、セーブまで対象かをゲーム公式で確認してください。',
          ],
          [
            'Steamクラウドがあればバックアップは不要？',
            '同期と、特定時点を別に残すコピーは役割が違います。変更されたファイルが同期されるため、いつでも好きな過去へ戻せるとは限りません。',
          ],
          [
            'userdataをコピーすればセーブは全部移りますか？',
            'その判断はできません。AppDataやSaved Gamesなど別の場所に保存するゲームもあります。対象ゲームの公式保存先とコピー対象を確認します。',
          ],
          [
            'Game Pass版や別OSへそのまま引き継げますか？',
            'Steam Cloud対応だけでは判定できません。ストア間・OS間の引き継ぎはゲームごとの対応条件が必要です。',
          ],
        ],
        caution:
          'このページは仕組みと確認手順の案内です。同期・コピー・復元を自動実行せず、本人のファイルやログイン情報を取得しません。競合時は一方をすぐ選ばず保全してください。',
      },
      en: {
        title:
          'Steam Cloud Explained: Settings, Save Files and Moving to a New PC',
        short: 'Steam Cloud settings and save checks',
        description:
          'Check Steam Cloud support, global and per-game settings, cloud files and what to preserve before changing PCs. Distinguish synchronization, a dated backup and conflict recovery.',
        summary:
          'Steam Cloud synchronizes files selected by the game developer. Check support on the store page and both global and per-game settings. For healthy saves, let synchronization finish after exiting and keep a separate dated copy before moving PCs. If a conflict or missing progress already exists, preserve available files before launching or changing settings.',
        steps: [
          {
            title: 'Check which files the game supports',
            actions: [
              'Look for Steam Cloud support on the game’s Steam store page. Developers choose whether saves, settings or other files are included; not every game or every file is covered.',
              'Do not infer transfers between stores, accounts or operating systems from the Cloud badge alone. Check the publisher’s conditions for the exact game and edition.',
            ],
          },
          {
            title: 'Review global and per-game settings',
            actions: [
              'Check Cloud in Steam Settings, then right-click the game in Library and open Properties, General, to review its Cloud synchronization setting. Compare both levels; wording can change with the client version.',
              'While Cloud is disabled, new progress may exist only on that PC. If another machine has different data or a conflict exists, preserve each candidate before enabling synchronization.',
            ],
          },
          {
            title: 'Distinguish cloud files from local saves',
            actions: [
              'Remote Storage is Steam’s official account page for checking available cloud files after signing in yourself. Download copies to a separate dated folder instead of replacing existing saves.',
              'Steam\\userdata on Windows contains account- and app-specific Cloud files. It is not the universal save location. Check the game publisher’s documented location and required files.',
            ],
          },
          {
            title: 'Confirm synchronization and keep a copy before moving PCs',
            actions: [
              'For healthy progress, save and exit on the old PC, then confirm Steam has finished synchronizing. With the game closed, also make a dated copy of the confirmed local save folder.',
              'Keep the old PC’s files until progress on the new PC is checked before saving over it. Stop on warnings, conflicts or older progress and use the conflict guide. Steam Support does not promise recovery of lost saves.',
            ],
          },
        ],
        faqs: [
          [
            'Does every Steam game use Cloud?',
            'No. Check the store badge and publisher documentation to learn which files are covered.',
          ],
          [
            'Does Cloud replace a backup?',
            'Synchronization and preserving a particular point in time are different. Changed files can synchronize, so Cloud is not a promise of access to any earlier version.',
          ],
          [
            'Does copying userdata transfer all saves?',
            'No. Games can use other locations, including AppData or Saved Games. Confirm the publisher’s paths and required files.',
          ],
          [
            'Can I transfer to Game Pass or another OS?',
            'A Steam Cloud badge alone cannot establish this. Store and operating-system transfers require game-specific support.',
          ],
        ],
        caution:
          'This guide does not run synchronization, copy files or collect credentials. Preserve conflicting candidates before choosing a version. No save recovery or hardware test is claimed.',
      },
      zh: {
        title: 'Steam 云存档怎么用：设置、文件位置与换电脑前的检查',
        short: 'Steam 云存档设置与检查',
        description:
          '核对 Steam 云存档支持、全局与单个游戏设置、云文件查看位置，以及更换电脑前的备份。区分同步、保留副本和冲突恢复。',
        summary:
          'Steam 云会同步游戏开发者指定的文件。先查看商店支持标记，再核对全局及单个游戏设置。进度正常时，退出游戏后等待同步完成，换电脑前另存带日期的本地副本。若已有冲突或进度丢失，应先保全现有文件，再考虑启动或改设置。',
        steps: [
          {
            title: '确认游戏支持哪些云文件',
            actions: [
              '查看游戏 Steam 商店页面的云支持标记。存档、设置等同步范围由开发者指定，并非所有游戏或全部文件均受支持。',
              '不要仅凭云标记判断跨商店、跨账号或跨系统能否继承。应查阅具体游戏与版本的官方说明。',
            ],
          },
          {
            title: '核对全局与游戏单独设置',
            actions: [
              '查看 Steam 设置的云选项，再在库中右键游戏，打开属性、常规，核对云同步设置。两层设置都要确认，具体文字可能随版本变化。',
              '关闭云功能期间的进度可能仅保存在当前电脑。若其他电脑有不同数据，或已发生冲突，应先分别保存候选文件，不要直接开启同步。',
            ],
          },
          {
            title: '区分云文件与本地存档',
            actions: [
              'Remote Storage 是 Steam 官方的云文件查看页面，需要本人登录。下载可用文件时另建日期文件夹，不要覆盖现有存档。',
              'Windows 的 Steam\\userdata 包含按账号与应用区分的云相关文件，但不是所有游戏的存档位置。保存路径和所需文件应以游戏官方说明为准。',
            ],
          },
          {
            title: '换电脑前确认同步并保留副本',
            actions: [
              '正常迁移时，在旧电脑保存并退出游戏，确认 Steam 同步完成。游戏关闭后，把已确认的本地存档目录另存为带日期的副本。',
              '在新电脑载入并核对进度前，不要删除旧电脑数据。若出现警告、冲突或旧进度，应暂停并查阅冲突指南。Steam 支持不保证能找回丢失的存档。',
            ],
          },
        ],
        faqs: [
          [
            '所有 Steam 游戏都支持云存档吗？',
            '不是。请同时确认商店标记与开发者公布的同步文件范围。',
          ],
          [
            '有云存档还要备份吗？',
            '同步与保留某个时间点的副本不同。改动后的文件可能同步，不能保证随时找回任意旧版本。',
          ],
          [
            '复制 userdata 就能迁移全部存档吗？',
            '不能据此判断。游戏可能使用 AppData、Saved Games 等其他位置，请核对官方路径与所需文件。',
          ],
          [
            '能直接继承到 Game Pass 或其他系统吗？',
            '仅凭 Steam 云标记无法确定，需要游戏对跨商店或跨系统继承提供支持。',
          ],
        ],
        caution:
          '本页不会执行同步、复制文件或收集登录信息。发生冲突时先保留各候选文件，再选择版本；不保证存档恢复，也未进行实机验证。',
      },
      es: {
        title: 'Cómo usar Steam Cloud: ajustes, partidas y cambio de PC',
        short: 'Ajustes y comprobaciones de Steam Cloud',
        description:
          'Comprueba la compatibilidad, los ajustes globales y por juego, los archivos en la nube y las copias antes de cambiar de PC. Distingue sincronización, copia fechada y conflictos.',
        summary:
          'Steam Cloud sincroniza los archivos que el desarrollador haya seleccionado. Revisa la compatibilidad en la tienda y los ajustes globales y por juego. Con partidas sanas, espera a que termine la sincronización al salir y guarda una copia fechada antes de cambiar de PC. Si ya hay conflictos o progreso perdido, conserva los archivos antes de iniciar o cambiar ajustes.',
        steps: [
          {
            title: 'Comprueba qué archivos admite el juego',
            actions: [
              'Busca la indicación de Steam Cloud en la página del juego en Steam. El desarrollador decide si incluye partidas, ajustes u otros datos; no cubre todos los juegos ni todos los archivos.',
              'La indicación de Cloud no confirma transferencias entre tiendas, cuentas o sistemas operativos. Consulta las condiciones oficiales del juego y la edición concretos.',
            ],
          },
          {
            title: 'Revisa los ajustes globales y por juego',
            actions: [
              'Revisa Nube en los ajustes de Steam; después, haz clic derecho en el juego de la Biblioteca y abre Propiedades, General, para revisar la sincronización. Comprueba ambos niveles; los nombres pueden variar según la versión.',
              'El progreso obtenido con Cloud desactivado puede existir solo en ese PC. Si hay datos distintos en otro equipo o un conflicto, conserva cada candidato antes de activar la sincronización.',
            ],
          },
          {
            title: 'Distingue los archivos de nube y las partidas locales',
            actions: [
              'Remote Storage es la página oficial de Steam para consultar los archivos disponibles tras iniciar sesión personalmente. Descarga las copias a otra carpeta fechada sin sustituir las partidas existentes.',
              'Steam\\userdata en Windows contiene archivos de Cloud separados por cuenta y aplicación. No es la ubicación universal de las partidas. Confirma las rutas y los archivos necesarios con el editor.',
            ],
          },
          {
            title:
              'Confirma la sincronización y conserva una copia al cambiar de PC',
            actions: [
              'Con progreso sano, guarda y cierra el juego en el PC antiguo y comprueba que Steam termine la sincronización. Con el juego cerrado, haz también una copia fechada de la carpeta local confirmada.',
              'Conserva los archivos antiguos hasta comprobar el progreso cargado en el PC nuevo antes de sobrescribirlo. Detente ante avisos, conflictos o progreso anterior y usa la guía de conflictos. Steam Support no garantiza recuperar partidas perdidas.',
            ],
          },
        ],
        faqs: [
          [
            '¿Todos los juegos de Steam usan Cloud?',
            'No. Comprueba la indicación de la tienda y la documentación del editor para conocer los archivos incluidos.',
          ],
          [
            '¿Cloud sustituye una copia de seguridad?',
            'Sincronizar y conservar un momento concreto son cosas distintas. Los archivos modificados pueden sincronizarse; no se garantiza el acceso a cualquier versión anterior.',
          ],
          [
            '¿Copiar userdata transfiere todas las partidas?',
            'No. Los juegos pueden usar AppData, Saved Games y otras rutas. Confirma las ubicaciones y archivos que indica el editor.',
          ],
          [
            '¿Puedo transferir a Game Pass u otro sistema?',
            'La indicación de Steam Cloud no lo confirma. La transferencia entre tiendas o sistemas requiere compatibilidad específica del juego.',
          ],
        ],
        caution:
          'Esta guía no sincroniza ni copia archivos ni recoge credenciales. Conserva los candidatos antes de resolver conflictos. No se garantiza recuperación ni se afirma haberlo probado en hardware.',
      },
    },
  },
  {
    slug: 'steam-client-not-opening',
    topic: 'launch',
    sources: [
      [
        'Steam Support: Steam Client Troubleshooting',
        'https://help.steampowered.com/en/faqs/view/29A6-F529-F956-6292',
      ],
      [
        'Valve: official Steam installer',
        'https://store.steampowered.com/about/',
      ],
    ],
    related: [
      'steam-game-not-launching',
      'steam-cloud-basics',
      'save-data-backup',
    ],
    copy: {
      ja: {
        title:
          'Steamが起動しない・開かない時の対処法｜WindowsのSteam本体を確認',
        short: 'Steam本体が起動しない',
        description:
          'Steam自体が開かない・起動直後に閉じる場合のWindows向け手順。ゲームだけ起動しない症状と分け、再起動・周辺機器・公式インストーラーを確認。データを削除しない進め方を案内。',
        summary:
          'Steamのライブラリ画面自体が開かない場合は、まずSteam本体の問題として確認します。ゲームを保存・終了できる状態なら同期を終え、PCを通常再起動。不要な入力機器や通常終了できる追加ソフトを一つずつ比較します。Steamフォルダーを削除せず、再インストールは保存を保全し、既存と同じ場所へ入れる公式手順を確認してから進めます。',
        steps: [
          {
            title: 'Steam本体とゲームの起動失敗を分ける',
            actions: [
              'Steamのライブラリ画面が開くかを確認する。Steamは開くがゲームの「プレイ」から先だけ進まないなら、この記事の再インストールへ進まず、ゲーム起動の記事へ。',
              'Steamを一度開こうとして、無反応・黒い画面・更新やログインで停止・すぐ終了、のどれかとエラー全文、時刻を控える。ブラウザーでストアが見えるだけでは、Steamアプリの動作確認にはならない。',
            ],
          },
          {
            title: '保存・更新の状態を確認して通常再起動する',
            actions: [
              'ほかの作業を保存する。ゲームの保存・Steamの更新・Cloud同期が進行中なら中断せず待つ。終了できるSteamは通常終了し、Windowsの再起動からやり直す。',
              '再起動後にSteamを一度開き、ライブラリ画面まで進むかを確認。同じ時刻のエラーが続く場合は、変更を重ねる前に記録する。原因不明のままuserdataやsteamappsを削除しない。',
            ],
          },
          {
            title: '追加機器とソフトを一つずつ比較する',
            actions: [
              '通常外して問題ないゲームパッドなど不要な入力機器を外して比較する。Steamやセーブが入った外付けドライブ、保存中の機器は対象にしない。',
              '録画・オーバーレイなど自分で通常終了できるソフトを一つずつ止め、変化がなければ戻す。Windowsとドライバーは公式の更新状態を確認。セキュリティや組織管理の保護を一括停止しない。',
            ],
          },
          {
            title: '再インストール前に場所と保存を保全する',
            actions: [
              'Steam公式は、公式インストーラーを既存と同じ場所へ再インストールする方法を案内している。先にログイン・二要素認証の手段とゲーム別のセーブを確認し、必要なローカルデータを別にコピーする。',
              '通常のアンインストールやフォルダー削除を先に行わない。公式は別の方法で削除するとゲームやuserdataが消えることがあると警告している。既存の場所が分からない、保存を保全できない、改善しない場合はSteam Supportへ状況を伝える。',
            ],
          },
        ],
        faqs: [
          [
            'Steamは開くのにゲームだけ起動しません。',
            'その場合はゲームの起動失敗の記事へ進みます。Steam本体の再インストールを最初の手順にはしません。',
          ],
          [
            'Steamフォルダーを消して入れ直せばよい？',
            '削除を先に行わないでください。公式の同じ場所への再インストールと、ゲーム・userdataを失う可能性があるアンインストールは別の操作です。',
          ],
          [
            '起動できない時もダウンロードキャッシュを消す？',
            'Steamの設定画面を開けない状態では、そのメニュー操作はできません。先に本体が開くかを確認し、更新・ダウンロードの問題とは分けます。',
          ],
          [
            'この手順で必ず直りますか？',
            '保証はありません。公式は利用環境以外のクライアント側問題もあると説明しています。残る場合は、時刻・表示・試した変更を添えて相談してください。',
          ],
        ],
        caution:
          'Steam本体が開かないWindows PC向けです。保存フォルダーの削除、出所不明のDLL導入、保護機能の無条件停止は行いません。編集部による実機修復の実績を示す記事ではありません。',
      },
      en: {
        title:
          'Steam Won’t Open on Windows: Check the Client Before Reinstalling',
        short: 'Steam client will not open',
        description:
          'Separate Steam itself failing to open from one game failing to launch. Check a normal restart, input devices and the official reinstall guidance while preserving saves and userdata.',
        summary:
          'If the Steam Library window itself will not open, investigate the client first. Finish any active save, update or sync before restarting normally. Compare non-essential input devices and ordinarily closable add-on apps one at a time. Do not delete the Steam folder; preserve saves and review the official same-location reinstall procedure before attempting it.',
        steps: [
          {
            title: 'Distinguish the Steam client from a game launch failure',
            actions: [
              'Check whether the Steam Library opens. If Steam works but a game will not pass Play, use the game-launch guide instead of immediately reinstalling the client.',
              'Try opening Steam once and record no response, a black window, an update/login stall or an immediate close, plus the exact message and time. Viewing the store in a web browser does not test the desktop client.',
            ],
          },
          {
            title: 'Check active writes, then restart normally',
            actions: [
              'Save other work. Let active game saves, Steam updates and Cloud synchronization finish rather than interrupting them. Exit Steam normally if possible, then restart Windows.',
              'Open Steam once after restarting and check whether Library becomes available. Record a recurring error before stacking changes. Do not delete userdata or steamapps without establishing what must be preserved.',
            ],
          },
          {
            title: 'Compare extra devices and software one at a time',
            actions: [
              'Compare without non-essential input devices, such as a controller that can safely be unplugged. Do not disconnect a drive containing Steam or saves, or a device currently writing data.',
              'Close recording or overlay apps normally, one at a time, and restore them if there is no change. Review Windows and driver updates from official sources. Do not broadly disable security or organization-managed protections.',
            ],
          },
          {
            title: 'Preserve data and confirm the location before reinstalling',
            actions: [
              'Steam documents running its official installer into the existing installation location. First confirm login and two-factor access, identify game-specific saves and copy the necessary local data separately.',
              'Do not start by uninstalling or deleting the folder. Valve warns other removal methods can delete games and userdata. If the location or preservation is unclear, or the issue remains, send the recorded symptoms and attempted changes to Steam Support.',
            ],
          },
        ],
        faqs: [
          [
            'Steam opens but one game will not. Which guide applies?',
            'Use the game-launch guide. Reinstalling the client is not the first step for this different symptom.',
          ],
          [
            'Should I delete the Steam folder first?',
            'No. The documented same-location reinstall and uninstalling in a way that can delete games or userdata are different operations.',
          ],
          [
            'Should I clear download cache when Steam will not open?',
            'The menu is unavailable until the client opens. Separate a client startup failure from an update or download failure.',
          ],
          [
            'Is a fix guaranteed?',
            'No. Valve notes some crashes require client updates rather than a change to your setup. Record the time, display and changes when seeking help.',
          ],
        ],
        caution:
          'For the Steam client on Windows. Do not delete save folders, download replacement DLLs from unknown sites or indiscriminately disable protection. No hands-on repair success is claimed.',
      },
      zh: {
        title: 'Steam 在 Windows 上打不开：先区分客户端与游戏启动失败',
        short: 'Steam 客户端无法启动',
        description:
          '区分 Steam 本身打不开与单个游戏无法启动。检查正常重启、输入设备和官方重装方法，先保留存档与 userdata，避免直接删除安装目录。',
        summary:
          '若 Steam 库窗口本身打不开，应先检查客户端。等待保存、更新或同步结束后正常重启电脑。逐一对比非必要输入设备及可正常退出的附加软件。不要删除 Steam 文件夹；重装前先保全存档并确认官方的原位置重装方法。',
        steps: [
          {
            title: '区分客户端与游戏的启动失败',
            actions: [
              '确认 Steam 库能否打开。若 Steam 正常但点击游戏开始后无反应，请转到游戏启动指南，不要先重装客户端。',
              '尝试打开 Steam 一次，记录无反应、黑窗口、更新或登录停住、立即退出，以及完整错误和时间。浏览器能打开商店不代表桌面客户端正常。',
            ],
          },
          {
            title: '确认写入状态后正常重启',
            actions: [
              '保存其他工作。游戏正在保存、Steam 更新或云同步时，先等待结束，不要中断。能正常退出 Steam 时先退出，再重启 Windows。',
              '重启后打开 Steam 一次，检查能否进入库。若仍出现相同错误，先记录再改设置，不要直接删除 userdata 或 steamapps。',
            ],
          },
          {
            title: '逐一对比附加设备与软件',
            actions: [
              '在可安全断开的前提下，暂时拔下非必要手柄等输入设备作比较。不要拔下存有 Steam 或存档的外置硬盘，也不要断开正在写入的设备。',
              '逐一正常退出录制或叠加软件，无变化就恢复。核对官方 Windows 及驱动更新，不要一并关闭安全防护或组织管理的保护。',
            ],
          },
          {
            title: '重装前确认位置并保留数据',
            actions: [
              'Steam 官方说明可将官方安装程序重新安装到原来的位置。先确认登录与双重验证方式，查明游戏存档并单独复制需要保留的本地数据。',
              '不要先卸载或删除文件夹。Valve 警告其他删除方式可能移除游戏和 userdata。若不清楚原位置、无法保全数据或仍未改善，请把症状与已试步骤提交 Steam 支持。',
            ],
          },
        ],
        faqs: [
          [
            'Steam 能开，只有游戏打不开怎么办？',
            '请用游戏启动指南，这与客户端本身打不开不同，不应首先重装客户端。',
          ],
          [
            '能先删除 Steam 目录再重装吗？',
            '不要先删除。官方所说的原位置重装，与可能删除游戏或 userdata 的卸载不同。',
          ],
          [
            '打不开时应该清理下载缓存吗？',
            '客户端设置打不开时，无法执行其中的菜单操作。请先区分客户端启动和下载更新故障。',
          ],
          [
            '这些步骤一定有效吗？',
            '不能保证。Valve 指出有些崩溃需要客户端更新处理。求助时记录时间、画面和已尝试的改变。',
          ],
        ],
        caution:
          '适用于 Windows 的 Steam 客户端。不删除存档目录、不从不明网站下载替代 DLL，也不无条件关闭保护；未声称经过实机修复验证。',
      },
      es: {
        title:
          'Steam no se abre en Windows: comprueba el cliente antes de reinstalar',
        short: 'Steam no abre el cliente',
        description:
          'Distingue Steam que no se abre de un juego que no inicia. Comprueba el reinicio normal, los dispositivos de entrada y la reinstalación oficial sin borrar partidas ni userdata.',
        summary:
          'Si no se abre la propia Biblioteca de Steam, investiga el cliente. Deja terminar los guardados, actualizaciones y sincronizaciones antes de reiniciar normalmente. Compara dispositivos no esenciales y aplicaciones adicionales de una en una. No borres la carpeta de Steam: conserva las partidas y revisa la reinstalación oficial en la misma ubicación.',
        steps: [
          {
            title: 'Distingue el cliente de un juego que no inicia',
            actions: [
              'Comprueba si abre la Biblioteca. Si Steam funciona pero un juego no pasa de Jugar, consulta la guía de inicio del juego antes de reinstalar el cliente.',
              'Intenta abrir Steam una vez y anota si no responde, muestra una ventana negra, se detiene al actualizar o iniciar sesión, o se cierra de inmediato, junto con el mensaje y la hora. Abrir la tienda web no prueba el cliente de escritorio.',
            ],
          },
          {
            title: 'Comprueba las escrituras activas y reinicia normalmente',
            actions: [
              'Guarda el resto del trabajo. Espera a que terminen los guardados, las actualizaciones de Steam y la sincronización Cloud; no los interrumpas. Cierra Steam normalmente si puedes y reinicia Windows.',
              'Abre Steam una vez tras reiniciar y comprueba la Biblioteca. Registra los errores repetidos antes de acumular cambios. No borres userdata ni steamapps.',
            ],
          },
          {
            title:
              'Compara dispositivos y aplicaciones adicionales por separado',
            actions: [
              'Prueba sin dispositivos de entrada no esenciales que puedan desconectarse con seguridad, como un mando. No desconectes una unidad que contenga Steam o partidas, ni dispositivos que estén escribiendo.',
              'Cierra normalmente las aplicaciones de grabación o superposición una a una y restaura las que no cambien el resultado. Revisa las actualizaciones oficiales de Windows y controladores. No desactives en bloque la seguridad o las protecciones de una organización.',
            ],
          },
          {
            title:
              'Conserva los datos y confirma la ubicación antes de reinstalar',
            actions: [
              'Steam documenta ejecutar el instalador oficial en la ubicación existente. Primero confirma el acceso a la cuenta y al segundo factor, identifica las partidas y copia aparte los datos locales necesarios.',
              'No empieces desinstalando ni borrando la carpeta. Valve advierte que otros métodos pueden eliminar juegos y userdata. Si no conoces la ubicación, no puedes conservar los datos o el fallo persiste, comunica los síntomas y cambios a Steam Support.',
            ],
          },
        ],
        faqs: [
          [
            'Steam abre, pero un juego no. ¿Qué hago?',
            'Consulta la guía de inicio de juegos. No es el mismo síntoma y reinstalar el cliente no es el primer paso.',
          ],
          [
            '¿Borro la carpeta de Steam antes?',
            'No. Reinstalar en la misma ubicación según la guía oficial no es lo mismo que una desinstalación que pueda borrar juegos o userdata.',
          ],
          [
            '¿Limpio la caché de descargas si no abre?',
            'No puedes usar ese menú hasta abrir el cliente. Distingue el inicio del cliente de un fallo de descarga o actualización.',
          ],
          [
            '¿Se garantiza que funcione?',
            'No. Valve indica que algunos cierres requieren actualizaciones del cliente. Registra la hora, la pantalla y los cambios al pedir ayuda.',
          ],
        ],
        caution:
          'Para el cliente de Steam en Windows. No borres carpetas de partidas, no descargues DLL de sitios desconocidos ni desactives la protección sin criterio. No se afirma haber reparado un equipo real.',
      },
    },
  },
];
const checkedAt = '2026-11-06';
const sourceCopy = {
  ja: {
    category: 'Steamの使い方と確認',
    policy:
      'Steam・Valveの一次資料に基づく確認手順です。分岐と保全順序は編集上の整理であり、実機修復・データ復元の成功を保証しません。出典は英語です。',
    english: '（英語）',
    next: '次の確認へ。条件が分からない場合は、操作を止めて公式の案内を確認してください。',
  },
  en: {
    category: 'Steam setup and checks',
    policy:
      'Based on primary Steam and Valve documentation. Branches and preservation order are editorial guidance, not proof of a successful hardware repair or save recovery. References are in English.',
    english: '',
    next: 'Continue to the next check. If the conditions are unclear, stop and consult the official guidance.',
  },
  zh: {
    category: 'Steam 使用与检查',
    policy:
      '依据 Steam 与 Valve 的官方资料。分支及保全顺序是编辑整理，不保证实机修复或存档恢复。来源为英文。',
    english: '（英语）',
    next: '继续下一项检查。条件不明确时，请停止操作并查阅官方说明。',
  },
  es: {
    category: 'Uso y comprobaciones de Steam',
    policy:
      'Basado en documentación oficial de Steam y Valve. Las bifurcaciones y el orden de conservación son criterios editoriales, no pruebas de reparación o recuperación garantizadas. Fuentes en inglés.',
    english: ' (inglés)',
    next: 'Continúa con la siguiente comprobación. Si las condiciones no están claras, detente y consulta las instrucciones oficiales.',
  },
};
const sources = (entry: Entry, locale: Lang) =>
  entry.sources.map(([label, url]) => ({
    label: label + sourceCopy[locale].english,
    url,
  }));
export const steamEntryGuides: CommonGuide[] = entries.map((entry) => {
  const copy = entry.copy.ja;
  return {
    slug: entry.slug,
    title: copy.title,
    shortTitle: copy.short,
    description: copy.description,
    conclusion: copy.summary,
    checkedAt,
    status: 'verified',
    causes:
      entry.slug === 'steam-cloud-basics'
        ? [
            '対象ゲームのCloud対応範囲と、保存先の取り違え',
            '全体設定・ゲーム別設定・使用アカウントの違い',
            '同期未完了や別端末の変更',
          ]
        : [
            'Steam本体の起動失敗と、ゲームだけの失敗の取り違え',
            '追加機器・常駐ソフト・更新状態の影響',
            'Steamクライアントのファイルや利用環境の問題',
          ],
    steps: copy.steps,
    sources: sources(entry, 'ja'),
    related: entry.related,
    faqs: copy.faqs.map(([question, answer]) => ({ question, answer })),
  };
});
function translated(
  entry: Entry,
  locale: 'en' | 'zh' | 'es',
): EnglishCommonGuide {
  const copy = entry.copy[locale],
    t = sourceCopy[locale];
  return {
    slug: entry.slug,
    path: `/guide/${entry.slug}`,
    topic: entry.topic,
    title: copy.title,
    shortTitle: copy.short,
    description: copy.description,
    lead: copy.description,
    summary: copy.summary,
    checkedAt,
    category: t.category,
    sourcePolicy: t.policy,
    branches: copy.steps.map((step, index) => ({
      symptom: step.title,
      action: step.actions[0],
      step: `step-${index + 1}`,
    })),
    steps: copy.steps.map((step, index) => ({
      ...step,
      id: `step-${index + 1}`,
      next: t.next,
    })),
    cautions: [copy.caution],
    faqs: copy.faqs.map(([question, answer]) => ({ question, answer })),
    sources: sources(entry, locale),
    related: entry.related.map((slug) => ({
      href:
        locale !== 'en' && slug === 'uninstall-save-data'
          ? `/guide/${slug}`
          : `/${locale}/guide/${slug}`,
      label:
        relatedCopy[locale][slug] +
        (locale !== 'en' && slug === 'uninstall-save-data'
          ? locale === 'zh'
            ? '（日语）'
            : ' (japonés)'
          : ''),
    })),
  };
}
const relatedCopy: Record<'en' | 'zh' | 'es', Record<string, string>> = {
  en: {
    'steam-cloud-sync-error': 'Cloud conflicts and sync errors',
    'save-data-backup': 'Back up and check save copies',
    'uninstall-save-data': 'Uninstalling and save preservation',
    'steam-game-not-launching': 'A Steam game will not launch',
    'steam-cloud-basics': 'Steam Cloud settings and files',
  },
  zh: {
    'steam-cloud-sync-error': '云同步失败与冲突',
    'save-data-backup': '备份存档并核对副本',
    'uninstall-save-data': '卸载与存档保全',
    'steam-game-not-launching': 'Steam 游戏无法启动',
    'steam-cloud-basics': 'Steam 云存档设置与文件',
  },
  es: {
    'steam-cloud-sync-error': 'Conflictos y errores de sincronización',
    'save-data-backup': 'Copias de partidas y comprobación',
    'uninstall-save-data': 'Desinstalar y conservar partidas',
    'steam-game-not-launching': 'Un juego de Steam no inicia',
    'steam-cloud-basics': 'Ajustes y archivos de Steam Cloud',
  },
};
export const steamEntryGuidesEn = entries.map((entry) =>
  translated(entry, 'en'),
);
export const steamEntryGuidesZhEs: TranslatedCommonGuide[] = entries.flatMap(
  (entry) =>
    (['zh', 'es'] as const).map((locale) => ({
      ...translated(entry, locale),
      locale,
    })),
);
