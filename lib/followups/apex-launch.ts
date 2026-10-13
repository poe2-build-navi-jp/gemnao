import type { FollowupGuide } from './types';

export const apexLaunchGuide: FollowupGuide = {
  gameSlug: 'apex-legends',
  gameName: 'Apex Legends',
  slug: 'r5apex-exe-launch-error',
  category: 'launch',
  checkedAt: '2026-10-13',
  sources: [
    {
      url: 'https://help.ea.com/ja/articles/apex-legends/error-codes/',
      labels: {
        ja: 'EA：Apexのエラーコード・r5apex.exe',
        en: 'EA: Apex error codes and r5apex.exe (Japanese)',
        zh: 'EA：Apex 错误代码与 r5apex.exe（日语）',
        es: 'EA: códigos de Apex y r5apex.exe (japonés)',
      },
    },
    {
      url: 'https://help.ea.com/ja/articles/orders-and-rewards/ea-app-game-download-installation-loading-not-working/',
      labels: {
        ja: 'EA：EA appのダウンロード・インストール・読込み',
        en: 'EA: EA app download, installation and loading help (Japanese)',
        zh: 'EA：EA app 下载、安装与加载帮助（日语）',
        es: 'EA: descargas, instalación y carga en EA app (japonés)',
      },
    },
    {
      url: 'https://help.steampowered.com/en/faqs/view/0C48-FCBD-DA71-93EB',
      labels: {
        ja: 'Steam：ゲームファイルの整合性確認（英語）',
        en: 'Steam: verify integrity of game files',
        zh: 'Steam：验证游戏文件完整性（英语）',
        es: 'Steam: verificar integridad de los archivos (inglés)',
      },
    },
  ],
  copy: {
    ja: {
      title:
        'Apexがr5apex.exeで起動エラーになる時の確認｜EA app・Steam別の修復',
      shortTitle: 'r5apex.exe・起動エラー',
      description:
        'Apexのr5apex.exeを含む起動エラーを、全文・発生段階・ランチャーで切り分け。EA appの修復とSteamの整合性確認、Windows更新後の比較、相談記録を案内します。',
      lead: 'PC版Apex Legendsでr5apex.exeを含むエラーが出る、または起動時に止まる場合の案内です。ファイル名だけで原因を決めず、起動前・ゲーム終了・別コードを分けます。',
      summary:
        'EAはr5apex.exeエラーにインストール不整合の可能性を挙げ、ゲーム修復とWindows更新を案内しています。まず全文と利用ランチャーを記録し、EA appなら修復、Steamなら整合性確認を行って結果を比較します。実行ファイルを別サイトから入手したり、保護機能を無効にしたりしないでください。',
      quickFacts: [
        {
          label: '最初に記録',
          value: 'エラー全文・ランチャー・止まった段階',
        },
        {
          label: 'EA app／Steam',
          value: 'EA appは修復、Steamはインストール済みファイルの整合性確認',
        },
        {
          label: '同じ症状が残る',
          value: '修復結果・Windows更新・時刻を揃えてEAへ相談',
        },
      ],
      diagnosis: [
        {
          symptom: 'r5apex.exeを含む起動エラー',
          cause: 'インストール整合性をランチャー別に確認',
          stepId: 'repair-launcher-files',
        },
        {
          symptom: 'EA appのPreparingで止まる',
          cause: 'ゲーム実行前のEA app側の案内を確認',
          stepId: 'record-launch-error',
        },
        {
          symptom: '30005や別のチート対策コード',
          cause: 'r5apex.exeと同じ原因とせず公式の該当項目へ',
          stepId: 'record-launch-error',
        },
        {
          symptom: 'Apex_crash.txtや起動後のクラッシュ',
          cause: '起動修復後の状態とクラッシュ記録を整理',
          stepId: 'report-launch-result',
        },
      ],
      steps: [
        {
          id: 'record-launch-error',
          title: '全文・ランチャー・発生段階を記録する',
          summary:
            '名前が同じファイルでも、エラー内容が違えば次の確認が変わります。',
          time: '確認に約3〜5分',
          risk: 'low',
          actions: [
            'エラー全文、発生時刻、EA appかSteamか、プレイ前・ゲーム画面表示後のどこで止まったかを記録する。',
            'PreparingのままならEA appの読込み・インストールの公式案内へ。30005など別コードならEAのエラー一覧でその項目を確認し、この手順を一括適用しない。',
            'r5apex.exeだけでファイル破損やウイルスと断定しない。Apex_crash.txtはゲームのクラッシュ側の確認として記録し、STEP 4でも区別する。',
          ],
        },
        {
          id: 'repair-launcher-files',
          title: '使っているランチャーで修復する',
          summary: 'EA appとSteamで同じボタンを探す必要はありません。',
          time: '確認に約3〜5分',
          risk: 'low',
          actions: [
            'ゲームを終了する。EA appの場合はライブラリ→Apex Legends→管理メニュー（三点など）→修復を選び、完了まで待つ。',
            'Steamの場合はライブラリでApex Legendsを右クリック→プロパティ→インストール済みファイル→ゲームファイルの整合性を確認する。ほかの重いディスク処理を同時に行わない。',
            '修復・再取得の結果を記録し、同じランチャーから起動して比較する。終わらない・修復自体が失敗する場合は、そのエラーを記録し、繰り返す前に該当ランチャーの公式案内へ進む。',
          ],
          note: 'ランチャーの修復は管理対象のファイルを再取得する場合があります。手動で.exeや.sysを消したり、別サイトのファイルに置き換えたりしません。',
        },
        {
          id: 'update-and-retest',
          title: 'Windows更新と再起動後に比較する',
          summary: '修復と更新を分け、どこまで進むようになったかを記録します。',
          time: '確認に約3〜5分',
          risk: 'low',
          actions: [
            'Windows Updateで更新状況と再起動待ちを確認する。職場・学校のPCや更新エラーは管理者・Microsoftの案内に従い、保護設定を無効化しない。',
            '必要な更新と再起動を終えたら、同じランチャーで同じ起動操作を試し、エラー全文や発生段階の変化を記録する。',
            'セキュリティ製品がファイルを隔離した表示がある場合は、対象と検出内容を記録してEA・製品の公式サポートへ。検出を無視して除外や復元を一律に行わない。',
          ],
          note: 'この手順ではファームウェア、ウイルス対策の除外、起動オプションを変更しません。Windows更新の失敗は別の症状として扱います。',
        },
        {
          id: 'report-launch-result',
          title: '残る症状に合わせて相談する',
          summary: '解決しなかった結果も、次の確認を選ぶための情報です。',
          time: '確認に約3〜5分',
          risk: 'low',
          actions: [
            'r5apex.exeの起動エラーが残る場合は、全文、時刻、Windowsの版、ランチャー、修復結果、更新と再起動の結果をEA公式サポートへまとめる。',
            'ゲームが起動してから落ちる場合は、Apex_crash.txtなどの名称と発生場面を記録し、クラッシュの確認へ進む。30005やPreparingが残る場合は該当する公式項目へ戻る。',
            '画像やログのユーザー名・アカウント情報を確認し、公式窓口が必要とする情報だけを共有する。修復で直らないことをハード故障と断定しない。',
          ],
          guideLink: {
            href: '/guide/pc-game-crash',
            label: '起動後のクラッシュを確認する',
          },
        },
      ],
      avoid: [
        'r5apex.exeやDLLを第三者サイトからダウンロードしない',
        'アンチチートの.sysファイルを削除したり保護機能を停止したりしない',
        '古いOriginの保存場所やウイルス対策の除外設定をすべてのPCへ流用しない',
      ],
      cautions: [
        'EA appとSteamで修復の操作が異なります。実際に使っているランチャーに合わせてください。',
        '公式ページの確認日は2026年10月13日です。修復や更新による解決を保証するものではありません。',
      ],
      faqs: [
        {
          question: 'r5apex.exeと出たら必ずファイル破損ですか？',
          answer:
            'EAはインストール不整合を可能性として挙げています。ファイル名だけでは原因が確定しないため、全文と修復結果、発生段階を記録します。',
        },
        {
          question:
            'EA appのPreparingや30005にも同じ修復を繰り返してよいですか？',
          answer:
            '一括して扱いません。Preparingはランチャーの読込み、30005は別コードとして公式の該当項目を確認します。削除や保護無効化を先に試さないでください。',
        },
      ],
      related: [
        {
          href: '/guide/steam-game-not-launching',
          label: 'Steamゲームが起動しない時の共通確認',
        },
        {
          href: '/guide/pc-game-crash',
          label: '起動後に落ちる場合のクラッシュ確認',
        },
      ],
    },
    en: {
      title:
        'Apex r5apex.exe Launch Errors: Repair Checks for EA app and Steam',
      shortTitle: 'r5apex.exe launch errors',
      description:
        'Separate Apex r5apex.exe errors by full message, launch stage and launcher. Use EA app Repair or Steam verification, compare after Windows updates and prepare a support record.',
      lead: 'For r5apex.exe errors or a failed Apex Legends launch on PC. The executable name alone does not identify the cause; distinguish launcher loading, a game crash and a different error code.',
      summary:
        'EA lists installation inconsistency as a possible cause of r5apex.exe errors and recommends game repair and Windows updates. Record the full error and launcher first, then use EA app Repair or Steam file verification and compare the result. Do not replace executables from third-party sites or disable security protection.',
      quickFacts: [
        {
          label: 'Record first',
          value: 'Full error, launcher and the stage where it stops',
        },
        {
          label: 'EA app / Steam',
          value: 'Repair in EA app; verify installed files in Steam',
        },
        {
          label: 'Still failing',
          value:
            'Give EA the repair result, Windows update state and event time',
        },
      ],
      diagnosis: [
        {
          symptom: 'r5apex.exe appears in a launch error',
          cause: 'Check installation integrity in the correct launcher',
          stepId: 'repair-launcher-files',
        },
        {
          symptom: 'EA app stays on Preparing',
          cause: 'Use EA app loading/installation guidance first',
          stepId: 'record-launch-error',
        },
        {
          symptom: '30005 or another anti-cheat code',
          cause: 'Use its specific official entry, not an assumed r5apex cause',
          stepId: 'record-launch-error',
        },
        {
          symptom: 'Apex_crash.txt or a crash after launch',
          cause: 'Separate crash records from a launch repair',
          stepId: 'report-launch-result',
        },
      ],
      steps: [
        {
          id: 'record-launch-error',
          title: 'Record the message, launcher and stage',
          summary: 'The same file name can appear in different failures.',
          time: 'About 3–5 minutes to check',
          risk: 'low',
          actions: [
            'Record the complete error, time, EA app or Steam, and whether it stops before play or after the game window appears.',
            'For a launcher stuck on Preparing, use EA’s loading/installation help. For 30005 or another code, find that entry in EA’s error list instead of applying all these steps indiscriminately.',
            'Do not infer corruption or malware from r5apex.exe alone. Record Apex_crash.txt as a game-crash symptom to distinguish again in Step 4.',
          ],
        },
        {
          id: 'repair-launcher-files',
          title: 'Repair through the launcher you use',
          summary: 'EA app and Steam expose different controls.',
          time: 'About 3–5 minutes to check',
          risk: 'low',
          actions: [
            'Close the game. In EA app, open Library → Apex Legends → the Manage menu, shown as three dots in some views → Repair, and wait for completion.',
            'In Steam, right-click Apex Legends in Library → Properties → Installed Files → Verify integrity of game files. Avoid other intensive disk tasks while verification runs.',
            'Record the repair/download result and try the same launch again. If repair itself fails or never completes, record that error and use the launcher’s official help before repeating it.',
          ],
          note: 'Repair can download managed files again. Do not manually delete .exe or .sys files or replace them with downloads from another site.',
        },
        {
          id: 'update-and-retest',
          title: 'Compare after Windows updates and restart',
          summary: 'Keep repair and update results separate.',
          time: 'About 3–5 minutes to check',
          risk: 'low',
          actions: [
            'Check Windows Update for update status and a pending restart. For managed PCs or update errors, follow administrator/Microsoft guidance without disabling protection.',
            'After necessary updates and restart, repeat the same launch and record whether the full error or failure stage changed.',
            'If security software reports a quarantined file, record the detection and consult EA and the product’s official support. Do not ignore detection and automatically restore or exclude the file.',
          ],
          note: 'This workflow does not change firmware, antivirus exclusions or launch options. A Windows update failure is a separate problem.',
        },
        {
          id: 'report-launch-result',
          title: 'Report the remaining symptom',
          summary:
            'An unsuccessful repair still gives useful evidence for the next check.',
          time: 'About 3–5 minutes to check',
          risk: 'low',
          actions: [
            'For a remaining r5apex.exe launch error, give EA the full message, time, Windows version, launcher, repair result and update/restart results.',
            'If the game starts then closes, record the scene and any Apex_crash.txt reference and use crash troubleshooting. For remaining 30005 or Preparing, return to the corresponding official entry.',
            'Check screenshots and logs for usernames and account details. Share only what official support needs; a failed repair does not establish hardware failure.',
          ],
          guideLink: {
            href: '/en/guide/pc-game-crash',
            label: 'Check a crash after the game starts',
          },
        },
      ],
      avoid: [
        'Do not download r5apex.exe or DLLs from third-party sites',
        'Do not delete anti-cheat .sys files or turn off protection',
        'Do not reuse old Origin paths or antivirus exclusions across all PCs',
      ],
      cautions: [
        'Use the repair controls for your actual launcher; EA app and Steam differ.',
        'Official material was checked on October 13, 2026. Repair and updates are checks, not a guaranteed solution.',
      ],
      faqs: [
        {
          question: 'Does r5apex.exe always mean file corruption?',
          answer:
            'No. EA describes installation inconsistency as a possibility. Record the full message, stage and repair result instead of assigning a cause from the executable name alone.',
        },
        {
          question: 'Should I repeat repair for Preparing or 30005?',
          answer:
            'Treat them separately. Preparing concerns launcher loading, while 30005 has its own official error entry. Do not begin with file deletion or disabling protection.',
        },
      ],
      related: [
        {
          href: '/en/guide/pc-game-crash',
          label: 'When the game starts and then crashes',
        },
        {
          href: '/en/games/apex-legends',
          label: 'Apex Legends launch guide',
        },
      ],
    },
    zh: {
      title: 'Apex r5apex.exe 启动错误：EA app 与 Steam 修复检查',
      shortTitle: 'r5apex.exe 启动错误',
      description:
        '按完整提示、启动阶段和启动器区分 Apex r5apex.exe 错误。分别使用 EA app 修复或 Steam 文件验证，再比较 Windows 更新后的结果。',
      lead: '适用于 PC 版 Apex Legends 出现 r5apex.exe 错误或启动受阻的情况。仅凭文件名不能确定原因，应区分启动器加载、游戏崩溃与其他错误代码。',
      summary:
        'EA 将安装不一致列为 r5apex.exe 错误的可能原因，并建议修复游戏和更新 Windows。先记录完整提示与启动器，再用 EA app 修复或 Steam 验证文件并比较结果。不要从第三方网站替换可执行文件，也不要禁用安全防护。',
      quickFacts: [
        {
          label: '先记录',
          value: '完整错误、启动器、停止的阶段',
        },
        {
          label: 'EA app／Steam',
          value: 'EA app 使用修复；Steam 验证已安装文件',
        },
        {
          label: '仍然失败',
          value: '向 EA 提供修复结果、Windows 更新状态和时间',
        },
      ],
      diagnosis: [
        {
          symptom: '启动错误含 r5apex.exe',
          cause: '在对应启动器检查安装完整性',
          stepId: 'repair-launcher-files',
        },
        {
          symptom: 'EA app 停在 Preparing',
          cause: '先查看 EA app 加载与安装说明',
          stepId: 'record-launch-error',
        },
        {
          symptom: '30005 或其他反作弊代码',
          cause: '查看对应官方条目，不套用同一原因',
          stepId: 'record-launch-error',
        },
        {
          symptom: 'Apex_crash.txt 或启动后崩溃',
          cause: '区分崩溃记录与启动修复',
          stepId: 'report-launch-result',
        },
      ],
      steps: [
        {
          id: 'record-launch-error',
          title: '记录全文、启动器与阶段',
          summary: '相同文件名可能出现在不同故障中。',
          time: '检查约需 3–5 分钟',
          risk: 'low',
          actions: [
            '记录完整提示、时间、使用 EA app 还是 Steam，以及是在进入游戏前还是窗口出现后停止。',
            '停在 Preparing 时查看 EA 的加载／安装帮助；30005 等代码应查看错误列表对应条目，不把本流程一律套用。',
            '不要只凭 r5apex.exe 判断文件损坏或病毒。Apex_crash.txt 属于游戏崩溃线索，第 4 步也应单独区分。',
          ],
        },
        {
          id: 'repair-launcher-files',
          title: '使用当前启动器修复',
          summary: 'EA app 与 Steam 的操作入口不同。',
          time: '检查约需 3–5 分钟',
          risk: 'low',
          actions: [
            '关闭游戏。在 EA app 中进入游戏库→Apex Legends→管理菜单（部分界面为三点）→修复，等待完成。',
            'Steam 中右键点击库里的 Apex Legends→属性→已安装文件→验证游戏文件的完整性；同时避免其他大量磁盘操作。',
            '记录修复或重新下载的结果，用相同启动器再次启动。修复失败或长期不完成时，先记录其错误并查看该启动器的官方帮助，不反复重试。',
          ],
          note: '修复可能重新下载启动器管理的文件。不要手动删除 .exe 或 .sys，也不要用第三方下载替换。',
        },
        {
          id: 'update-and-retest',
          title: '更新 Windows 并重启后比较',
          summary: '分别记录修复与更新的结果。',
          time: '检查约需 3–5 分钟',
          risk: 'low',
          actions: [
            '在 Windows 更新中查看状态及是否等待重启。受管理电脑或更新错误应按管理员／Microsoft 指引处理，不禁用防护。',
            '完成所需更新和重启后，重复相同启动操作，记录错误全文或停止阶段是否变化。',
            '安全软件提示文件被隔离时，记录检测结果并咨询 EA 与安全软件官方支持，不忽略检测后一律恢复或添加排除项。',
          ],
          note: '本流程不更改固件、杀毒排除或启动选项；Windows 更新失败另行处理。',
        },
        {
          id: 'report-launch-result',
          title: '按剩余症状联系支持',
          summary: '修复无效的结果也能帮助选择下一步。',
          time: '检查约需 3–5 分钟',
          risk: 'low',
          actions: [
            'r5apex.exe 启动错误仍在时，向 EA 整理完整提示、时间、Windows 版本、启动器、修复与更新／重启结果。',
            '若游戏已启动再退出，记录场景和 Apex_crash.txt 等提示并进入崩溃排查；仍为 30005 或 Preparing 时回到对应官方条目。',
            '检查截图与日志中的用户名及账户信息，只分享官方支持所需内容。修复无效不等于硬件故障。',
          ],
          guideLink: {
            href: '/en/guide/pc-game-crash',
            label: '检查启动后的崩溃（英语）',
          },
        },
      ],
      avoid: [
        '不要从第三方网站下载 r5apex.exe 或 DLL',
        '不要删除反作弊 .sys 文件或关闭防护',
        '不要把旧 Origin 路径或杀毒排除项套用于所有电脑',
      ],
      cautions: [
        'EA app 与 Steam 修复操作不同，请按实际使用的启动器选择。',
        '官方资料核对日期为 2026 年 10 月 13 日，修复和更新不保证一定解决问题。',
      ],
      faqs: [
        {
          question: 'r5apex.exe 一定意味着文件损坏吗？',
          answer:
            '不是。EA 只把安装不一致列为可能原因，应记录完整提示、阶段和修复结果，不只凭文件名确定原因。',
        },
        {
          question: 'Preparing 或 30005 也应反复修复吗？',
          answer:
            '应分别处理。Preparing 涉及启动器加载，30005 有对应官方错误条目，不先删除文件或关闭防护。',
        },
      ],
      related: [
        {
          href: '/en/guide/pc-game-crash',
          label: '游戏启动后崩溃的检查（英语）',
        },
        {
          href: '/zh/games/apex-legends',
          label: 'Apex Legends 启动指南',
        },
      ],
    },
    es: {
      title:
        'Apex y r5apex.exe: errores de inicio y reparación en EA app o Steam',
      shortTitle: 'Errores de inicio de r5apex.exe',
      description:
        'Distingue el mensaje completo, la fase y el lanzador. Repara Apex desde EA app o verifica archivos en Steam, compara tras actualizar Windows y prepara los datos para soporte.',
      lead: 'Para errores con r5apex.exe o un inicio bloqueado de Apex Legends en PC. El nombre del ejecutable no identifica la causa; distingue la carga del lanzador, un cierre del juego y otro código.',
      summary:
        'EA cita una instalación incoherente como posible causa de errores r5apex.exe y recomienda reparar el juego y actualizar Windows. Anota el mensaje y el lanzador; después usa Reparar en EA app o la verificación de Steam y compara. No sustituyas ejecutables de sitios externos ni desactives la protección.',
      quickFacts: [
        {
          label: 'Primero anota',
          value: 'Mensaje completo, lanzador y fase del fallo',
        },
        {
          label: 'EA app / Steam',
          value: 'Reparar en EA app; verificar archivos instalados en Steam',
        },
        {
          label: 'Si sigue fallando',
          value: 'Comunica a EA reparación, actualizaciones de Windows y hora',
        },
      ],
      diagnosis: [
        {
          symptom: 'Error de inicio con r5apex.exe',
          cause: 'Revisa la instalación desde el lanzador correcto',
          stepId: 'repair-launcher-files',
        },
        {
          symptom: 'EA app queda en Preparing',
          cause: 'Consulta primero la ayuda de carga e instalación',
          stepId: 'record-launch-error',
        },
        {
          symptom: '30005 u otro código antitrampas',
          cause: 'Usa su apartado oficial, sin asumir la misma causa',
          stepId: 'record-launch-error',
        },
        {
          symptom: 'Apex_crash.txt o cierre tras iniciar',
          cause: 'Separa los registros de cierre de la reparación de inicio',
          stepId: 'report-launch-result',
        },
      ],
      steps: [
        {
          id: 'record-launch-error',
          title: 'Anota el mensaje, lanzador y fase',
          summary: 'El mismo archivo puede aparecer en errores diferentes.',
          time: 'Unos 3–5 minutos para comprobar',
          risk: 'low',
          actions: [
            'Anota el error completo, la hora, EA app o Steam y si falla antes de jugar o después de aparecer la ventana.',
            'Si queda en Preparing, consulta la ayuda de carga/instalación de EA app. Para 30005 u otro código, busca su apartado en la lista oficial, sin aplicar todos estos pasos indiscriminadamente.',
            'No deduzcas corrupción o malware solo por r5apex.exe. Registra Apex_crash.txt como síntoma de cierre del juego y distínguelo de nuevo en el paso 4.',
          ],
        },
        {
          id: 'repair-launcher-files',
          title: 'Repara desde tu lanzador',
          summary: 'EA app y Steam tienen controles diferentes.',
          time: 'Unos 3–5 minutos para comprobar',
          risk: 'low',
          actions: [
            'Cierra el juego. En EA app entra en Biblioteca→Apex Legends→menú de gestión, con tres puntos en algunas vistas→Reparar, y espera a que termine.',
            'En Steam, pulsa con el botón derecho en Apex Legends en la biblioteca→Propiedades→Archivos instalados→Verificar integridad de los archivos. Evita otras tareas intensivas de disco.',
            'Anota el resultado de la reparación/descarga e inicia del mismo modo. Si la reparación falla o no termina, registra ese error y consulta al lanzador antes de repetir.',
          ],
          note: 'La reparación puede descargar archivos gestionados de nuevo. No borres .exe o .sys manualmente ni los sustituyas por descargas externas.',
        },
        {
          id: 'update-and-retest',
          title: 'Compara tras actualizar Windows y reiniciar',
          summary: 'Separa los resultados de reparación y actualización.',
          time: 'Unos 3–5 minutos para comprobar',
          risk: 'low',
          actions: [
            'Revisa Windows Update y si falta reiniciar. En equipos gestionados o con errores de actualización, sigue las indicaciones del administrador o Microsoft sin desactivar protección.',
            'Tras las actualizaciones necesarias y el reinicio, repite el mismo inicio y anota si cambió el mensaje o la fase del fallo.',
            'Si el antivirus informa de cuarentena, registra la detección y consulta a EA y al soporte oficial del producto. No ignores la detección para restaurar o excluir automáticamente el archivo.',
          ],
          note: 'Este proceso no modifica firmware, exclusiones antivirus ni opciones de inicio. Un fallo de Windows Update se trata por separado.',
        },
        {
          id: 'report-launch-result',
          title: 'Comunica el síntoma que permanece',
          summary: 'Una reparación fallida también aporta información útil.',
          time: 'Unos 3–5 minutos para comprobar',
          risk: 'low',
          actions: [
            'Si continúa el error r5apex.exe al iniciar, da a EA el mensaje, hora, Windows, lanzador, resultado de reparación y de actualización/reinicio.',
            'Si inicia y después se cierra, registra la escena y referencias a Apex_crash.txt y consulta la guía de cierres. Si sigue 30005 o Preparing, vuelve a su apartado oficial.',
            'Revisa nombres de usuario y datos de cuenta en capturas o registros. Comparte solo lo solicitado por soporte; una reparación fallida no demuestra avería del hardware.',
          ],
          guideLink: {
            href: '/en/guide/pc-game-crash',
            label: 'Revisar cierres tras iniciar (en inglés)',
          },
        },
      ],
      avoid: [
        'No descargues r5apex.exe ni DLL de sitios externos',
        'No borres archivos .sys antitrampas ni desactives la protección',
        'No reutilices rutas antiguas de Origin o exclusiones antivirus para todos los PC',
      ],
      cautions: [
        'Elige la reparación de tu lanzador real: EA app y Steam son distintos.',
        'Fuentes oficiales comprobadas el 13 de octubre de 2026; reparar o actualizar no garantiza resolver el problema.',
      ],
      faqs: [
        {
          question: '¿r5apex.exe siempre indica archivos dañados?',
          answer:
            'No. EA describe la incoherencia de instalación como posibilidad. Registra el mensaje completo, fase y reparación, sin concluir una causa solo por el nombre.',
        },
        {
          question: '¿Debo repetir la reparación para Preparing o 30005?',
          answer:
            'Trátalos por separado. Preparing afecta a la carga del lanzador y 30005 tiene su propia entrada oficial. No empieces borrando archivos o desactivando protección.',
        },
      ],
      related: [
        {
          href: '/en/guide/pc-game-crash',
          label: 'Cuando inicia y luego se cierra (en inglés)',
        },
        {
          href: '/es/games/apex-legends',
          label: 'Guía de inicio de Apex Legends',
        },
      ],
    },
  },
  relatedSlugs: [],
};
