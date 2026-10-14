import type { FollowupGuide } from './types';

export const apexCrashGuide: FollowupGuide = {
  gameSlug: 'apex-legends',
  gameName: 'Apex Legends',
  slug: 'apex-crash-txt',
  category: 'launch',
  checkedAt: '2026-10-13',
  sources: [
    {
      url: 'https://help.ea.com/en/articles/apex-legends/error-codes/',
      labels: {
        ja: 'EA：Apexのエラーコード（英語）',
        en: 'EA: Apex error codes',
        zh: 'EA：Apex 错误代码（英语）',
        es: 'EA: códigos de Apex (inglés)',
      },
    },
    {
      url: 'https://help.ea.com/en/articles/platforms/fix-crashing-and-freezing/',
      labels: {
        ja: 'EA：PCのクラッシュ・フリーズ（英語）',
        en: 'EA: PC crashes and freezes',
        zh: 'EA：PC 崩溃与卡死（英语）',
        es: 'EA: cierres y bloqueos en PC (inglés)',
      },
    },
    {
      url: 'https://help.steampowered.com/en/faqs/view/0C48-FCBD-DA71-93EB',
      labels: {
        ja: 'Steam：ゲームファイルの整合性確認（英語）',
        en: 'Steam: verify game files',
        zh: 'Steam：验证游戏文件（英语）',
        es: 'Steam: verificar archivos (inglés)',
      },
    },
  ],
  copy: {
    ja: {
      title: 'Apex_crash.txtが出て落ちる時の確認｜修復・常駐アプリの比較',
      shortTitle: 'Apex_crash.txt・クラッシュ',
      description:
        'Apex_crash.txtを原因と決めつけず、発生場面・再起動・EA app/Steamの修復・常駐アプリ比較で切り分け。元へ戻す方法と未解決時の相談記録を案内します。',
      lead: 'Apexが起動後やプレイ中に落ち、Apex_crash.txtが示されるPC向けです。起動前のr5apex.exeエラーや通信切断は別に確認します。',
      summary:
        'Apex_crash.txtはクラッシュの手掛かりで、壊れた部品や原因を特定する名前ではありません。発生時刻と場面を記録し、再起動後にランチャー別の修復を実行します。続く場合は自分で開いた不要なアプリを1つずつ閉じて比較し、結果をEAへ伝えます。',
      quickFacts: [
        {
          label: '最初に記録',
          value: '発生時刻・場面・全文・利用ランチャー',
        },
        {
          label: '修復の入口',
          value: 'EA appは修復、Steamは整合性確認',
        },
        {
          label: '比較後の戻し方',
          value: '閉じたアプリを戻し、変更を重ねない',
        },
      ],
      diagnosis: [
        {
          symptom: '起動後に落ちてApex_crash.txt',
          cause: 'クラッシュの条件を記録',
          stepId: 'record-crash',
        },
        {
          symptom: '修復が未実施',
          cause: 'ランチャー別に確認',
          stepId: 'repair-crash-files',
        },
        {
          symptom: '録画などの使用中に再発',
          cause: '不要なアプリだけ比較',
          stepId: 'compare-background-apps',
        },
        {
          symptom: '起動前のエラー／通信切断',
          cause: '症状に合う記事へ分岐',
          stepId: 'report-crash',
        },
      ],
      steps: [
        {
          id: 'record-crash',
          title: '発生場面と再起動後を記録',
          summary: 'ログの名前だけで原因を決めません。',
          actions: [
            'Javelinと表示される場合は、このSTEPの専用記事リンクで現在のエラーを確認する。',
            '時刻とタイムゾーン、ロビー・試合中などの場面、エラー全文、EA app／Steamを控える。直前の更新や追加アプリも記録する。',
            '他の作業を保存してゲームとPCを再起動し、同じ操作で再発するか確認する。起動前から進まないならr5apex.exeの記事へ。',
            'Apex_crash.txtが実際に作成されている場合は相談用に保持する。ファイル名だけで場所を推測して検索結果のファイルを削除しない。',
          ],
          risk: 'low',
          note: 'PC自体が再起動・停止する場合は、ゲームだけのクラッシュとして試行を続けず、その症状も記録します。',
          time: '確認・記録：約3〜5分',
          guideLink: {
            href: '/games/apex-legends/javelin-launch-error',
            label: 'Javelinと表示される起動エラーはこちら',
          },
        },
        {
          id: 'repair-crash-files',
          title: '利用ランチャーで修復する',
          summary: '修復結果とクラッシュの有無を別々に見ます。',
          actions: [
            'Apexを終了。EA appはライブラリ→Apex Legends→管理→修復を選び、完了まで待つ。',
            'SteamはライブラリのApexを右クリック→プロパティ→インストール済みファイル→ゲームファイルの整合性を確認。重いディスク処理を並行しない。',
            '完了後に同じ場面を試す。修復自体が失敗した場合は、その全文を記録してランチャーの公式サポートへ進む。',
          ],
          risk: 'low',
          note: '管理対象のゲームファイルが再取得される場合があります。変更前の状態を完全に戻す操作ではなく、設定ファイルを一括削除する手順でもありません。',
          time: '処理時間は環境により異なります',
        },
        {
          id: 'compare-background-apps',
          title: '不要な常駐アプリを1つずつ比較',
          summary: '閉じたアプリ名と結果を残します。',
          actions: [
            '自分で起動した録画・配信など、今回不要なアプリの作業を保存し、アプリ自身の終了操作で1つだけ閉じる。',
            '同じ場面で比較し、変化がなければ閉じたアプリを再度開いて元の状態へ戻す。複数の設定を同時に変えない。',
            'Windowsのサービス、アンチチート、ウイルス対策は停止しない。管理されたPCや役割が不明なアプリは変更せず管理者へ相談する。',
          ],
          risk: 'low',
          note: '1回成功しても原因確定とは限りません。再発条件と通常再起動後の結果も添えて相談します。',
          time: '処理時間は環境により異なります',
        },
        {
          id: 'report-crash',
          title: '残る症状と記録をEAへ伝える',
          summary: '繰り返す修復より、比較結果をまとめます。',
          actions: [
            'ランチャー、Windowsの版、場面、時刻、再起動・修復・アプリ比較の結果をEAの公式窓口へまとめる。',
            'ログや画像はユーザー名などを確認し、公式窓口が求めるものだけ共有する。公開の回答欄へログ全文を貼らない。',
            '通信のcode:net／leafなら接続記事へ。起動前のr5apex.exeなら起動記事へ進み、同じ修復を無制限に繰り返さない。',
          ],
          risk: 'low',
          guideLink: {
            href: '/games/apex-legends/r5apex-exe-launch-error',
            label: '起動前のr5apex.exeエラーを確認',
          },
          time: '確認・記録：約3〜5分',
        },
      ],
      avoid: [
        'Apex_crash.txtを消せば直ると考えない',
        'DLLや実行ファイルを第三者サイトから取得しない',
        '保護機能やアンチチートを停止しない',
      ],
      cautions: [],
      faqs: [
        {
          question: 'Apex_crash.txtはGPU故障の証拠ですか？',
          answer:
            'いいえ。クラッシュの記録だけでは原因を特定できません。発生条件と修復・比較結果を揃えて相談します。',
        },
        {
          question: '修復後に1回起動できれば解決ですか？',
          answer:
            '同じ場面での再発と通常再起動後も確認します。改善した操作は記録しますが、1回の成功だけで原因を断定しません。',
        },
      ],
      related: [
        {
          href: '/games/apex-legends/javelin-launch-error',
          label: 'Javelinと表示される起動エラーはこちら',
        },
        {
          href: '/games/apex-legends/r5apex-exe-launch-error',
          label: 'r5apex.exe・起動エラー',
        },
        {
          href: '/games/apex-legends/code-net-leaf',
          label: 'code:net・code:leaf',
        },
      ],
    },
    en: {
      title:
        'Apex_crash.txt: Check Crashes, Repair Files and Compare Background Apps',
      shortTitle: 'Apex_crash.txt and crashes',
      description:
        'Separate Apex_crash.txt from a diagnosis. Record the crash, restart, repair through EA app or Steam, compare optional apps and prepare evidence for support.',
      lead: 'For Apex on PC closing after launch or during play with an Apex_crash.txt reference. Pre-launch r5apex.exe errors and connection failures need different checks.',
      summary:
        'Apex_crash.txt is a crash clue, not proof of a failed component or a specific cause. Record the time and scene, restart, then repair through your launcher. If it continues, close one optional app at a time, compare and give EA the results.',
      quickFacts: [
        {
          label: 'Record first',
          value: 'Time, scene, full message and launcher',
        },
        {
          label: 'Repair route',
          value: 'EA app Repair or Steam file verification',
        },
        {
          label: 'Restore after comparison',
          value: 'Reopen the app you closed; avoid stacking changes',
        },
      ],
      diagnosis: [
        {
          symptom: 'Apex_crash.txt after launch',
          cause: 'Record the crash conditions',
          stepId: 'record-crash',
        },
        {
          symptom: 'Files not yet checked',
          cause: 'Use your launcher’s repair',
          stepId: 'repair-crash-files',
        },
        {
          symptom: 'Returns while recording or streaming',
          cause: 'Compare optional apps',
          stepId: 'compare-background-apps',
        },
        {
          symptom: 'Pre-launch error or disconnection',
          cause: 'Switch to the matching symptom',
          stepId: 'report-crash',
        },
      ],
      steps: [
        {
          id: 'record-crash',
          title: 'Record the scene and restart result',
          summary: 'A log name does not establish the cause.',
          actions: [
            'If the message names Javelin, use this step’s dedicated guide link to check the current error.',
            'Note the time and time zone, lobby or match scene, full message and EA app or Steam. Include recent updates or newly added apps.',
            'Save other work, restart the game and PC, then repeat the same action. If it never reaches the game, use the r5apex.exe launch guide.',
            'Keep an existing Apex_crash.txt for support. Do not guess its location or delete search results based only on the name.',
          ],
          risk: 'low',
          note: 'If the whole PC restarts or stops, record that separate symptom instead of continuing as a game-only crash.',
          time: 'About 3–5 minutes to read and record',
          guideLink: {
            href: '/en/games/apex-legends/javelin-launch-error',
            label: 'Launch error naming Javelin',
          },
        },
        {
          id: 'repair-crash-files',
          title: 'Repair with your launcher',
          summary: 'Record both repair completion and the next crash result.',
          actions: [
            'Close Apex. In EA app, open Library → Apex Legends → Manage → Repair and wait for completion.',
            'In Steam, right-click Apex in Library → Properties → Installed Files → Verify integrity of game files. Avoid intensive disk tasks at the same time.',
            'Retry the same scene. If repair itself fails, record its complete error and use the launcher’s official support.',
          ],
          risk: 'low',
          note: 'Repair may download managed files again. It is not a full rollback and does not require deleting all configuration files.',
          time: 'Duration depends on the task and device',
        },
        {
          id: 'compare-background-apps',
          title: 'Compare one optional app at a time',
          summary: 'Keep a record of what you closed.',
          actions: [
            'Save work in a recording, streaming or other optional app you opened, then close just that app through its own controls.',
            'Compare the same scene. If nothing changes, reopen it to restore your previous setup before another comparison.',
            'Do not stop Windows services, anti-cheat or antivirus. For managed PCs or unfamiliar software, ask the administrator.',
          ],
          risk: 'low',
          note: 'One successful launch is not proof. Include recurrence and ordinary-restart results when reporting.',
          time: 'Duration depends on the task and device',
        },
        {
          id: 'report-crash',
          title: 'Give EA the remaining symptom and evidence',
          summary:
            'A concise comparison record is more useful than repeated repairs.',
          actions: [
            'Summarize the launcher, Windows version, scene, time and results of restart, repair and app comparisons for official EA support.',
            'Review logs and images for usernames or private details. Share only what official support requests, not complete logs in public feedback.',
            'For code:net or code:leaf, use the connection guide. For r5apex.exe before launch, use the launch guide rather than repeating repair indefinitely.',
          ],
          risk: 'low',
          guideLink: {
            href: '/en/games/apex-legends/r5apex-exe-launch-error',
            label: 'Check a pre-launch r5apex.exe error',
          },
          time: 'About 3–5 minutes to read and record',
        },
      ],
      avoid: [
        'Do not treat deleting Apex_crash.txt as a fix',
        'Do not download DLLs or executables from third parties',
        'Do not stop protection or anti-cheat',
      ],
      cautions: [],
      faqs: [
        {
          question: 'Does Apex_crash.txt prove GPU failure?',
          answer:
            'No. A crash record alone cannot identify the cause. Include the conditions and repair/comparison results in your support request.',
        },
        {
          question: 'Is one successful launch after repair enough?',
          answer:
            'Recheck the original scene and after a normal restart. Record what improved, but do not assign a cause from one successful attempt.',
        },
      ],
      related: [
        {
          href: '/en/games/apex-legends/javelin-launch-error',
          label: 'Launch error naming Javelin',
        },
        {
          href: '/en/games/apex-legends/r5apex-exe-launch-error',
          label: 'r5apex.exe launch errors',
        },
        {
          href: '/en/games/apex-legends/code-net-leaf',
          label: 'code:net and code:leaf',
        },
      ],
    },
    zh: {
      title: 'Apex_crash.txt 崩溃排查：修复文件与比较后台应用',
      shortTitle: 'Apex_crash.txt 与崩溃',
      description:
        'Apex_crash.txt 不是故障诊断。记录场景与时间，重启后按 EA app 或 Steam 修复，逐项比较后台应用，并整理未解决时的求助信息。',
      lead: '适用于 PC 版 Apex 启动后或游玩中退出，并提示 Apex_crash.txt。启动前的 r5apex.exe 错误和连接中断应分开处理。',
      summary:
        'Apex_crash.txt 是崩溃线索，不能凭文件名判断硬件损坏或具体原因。先记录时间与场景、重启，再用当前启动器修复。仍然崩溃时，每次只关闭一个自己打开的非必要应用，比较后把结果交给 EA。',
      quickFacts: [
        {
          label: '先记录',
          value: '时间、场景、完整提示及启动器',
        },
        {
          label: '修复入口',
          value: 'EA app 修复或 Steam 验证文件',
        },
        {
          label: '恢复比较前状态',
          value: '重新打开已关闭的应用，不叠加修改',
        },
      ],
      diagnosis: [
        {
          symptom: '启动后提示 Apex_crash.txt',
          cause: '记录崩溃条件',
          stepId: 'record-crash',
        },
        {
          symptom: '尚未检查文件',
          cause: '使用当前启动器修复',
          stepId: 'repair-crash-files',
        },
        {
          symptom: '录制或直播时复发',
          cause: '比较非必要应用',
          stepId: 'compare-background-apps',
        },
        {
          symptom: '启动前错误或断线',
          cause: '转到对应症状',
          stepId: 'report-crash',
        },
      ],
      steps: [
        {
          id: 'record-crash',
          title: '记录场景并重启比较',
          summary: '日志名称不能确定原因。',
          actions: [
            '提示包含 Javelin 时，先使用本步骤的专用文章链接核对当前错误。',
            '记录时间与时区、大厅或比赛中的场景、完整提示，以及 EA app 或 Steam。补充最近更新和新增应用。',
            '保存其他工作，重启游戏与 PC，再重复相同操作。尚未进入游戏就失败时，转到 r5apex.exe 启动指南。',
            '若确实生成了 Apex_crash.txt，保留它供支持人员使用。不要猜测位置或仅凭文件名删除搜索结果。',
          ],
          risk: 'low',
          note: '若整台 PC 重启或停止响应，应记录为另一种症状，不继续当作单纯游戏崩溃处理。',
          time: '检查与记录约 3–5 分钟',
          guideLink: {
            href: '/zh/games/apex-legends/javelin-launch-error',
            label: '显示 Javelin 的启动错误',
          },
        },
        {
          id: 'repair-crash-files',
          title: '使用当前启动器修复',
          summary: '分别记录修复完成情况与后续崩溃。',
          actions: [
            '退出 Apex。EA app 中进入游戏库→Apex Legends→管理→修复，等待结束。',
            'Steam 游戏库中右键 Apex→属性→已安装文件→验证游戏文件的完整性；期间避免其他大量磁盘操作。',
            '完成后重复原场景。如果修复本身失败，记录完整提示并联系启动器官方支持。',
          ],
          risk: 'low',
          note: '修复可能重新下载受管理文件，并非完整回滚，也不要求删除全部配置文件。',
          time: '耗时取决于操作和设备',
        },
        {
          id: 'compare-background-apps',
          title: '逐个比较非必要应用',
          summary: '记录关闭的应用名称。',
          actions: [
            '保存自己打开的录制、直播等非必要应用中的工作，通过应用自身的退出操作只关闭一个。',
            '在相同场景比较。没有变化时，重新打开它以恢复原有状态，再考虑下一项。',
            '不要停止 Windows 服务、反作弊或杀毒保护。受管理电脑或不认识的软件应咨询管理员。',
          ],
          risk: 'low',
          note: '一次成功不代表确定原因。求助时补充是否复发以及正常重启后的结果。',
          time: '耗时取决于操作和设备',
        },
        {
          id: 'report-crash',
          title: '向 EA 提交剩余症状与结果',
          summary: '整理比较记录，避免反复修复。',
          actions: [
            '向 EA 官方支持说明启动器、Windows 版本、场景、时间，以及重启、修复和应用比较的结果。',
            '检查日志和图片中的用户名等隐私，只提供官方支持要求的信息，不在公开反馈栏粘贴完整日志。',
            'code:net 或 code:leaf 请查看连接指南；启动前的 r5apex.exe 请查看启动指南，不无限重复修复。',
          ],
          risk: 'low',
          guideLink: {
            href: '/zh/games/apex-legends/r5apex-exe-launch-error',
            label: '检查启动前的 r5apex.exe 错误',
          },
          time: '检查与记录约 3–5 分钟',
        },
      ],
      avoid: [
        '不要把删除 Apex_crash.txt 当作修复',
        '不要从第三方下载 DLL 或可执行文件',
        '不要停止安全保护或反作弊',
      ],
      cautions: [],
      faqs: [
        {
          question: 'Apex_crash.txt 能证明显卡坏了吗？',
          answer:
            '不能。崩溃记录本身无法确定原因。请将发生条件与修复、比较结果一起交给官方支持。',
        },
        {
          question: '修复后成功启动一次就算解决了吗？',
          answer:
            '还要检查原来的场景和正常重启后的情况。记录改善，但不要仅凭一次成功认定原因。',
        },
      ],
      related: [
        {
          href: '/zh/games/apex-legends/javelin-launch-error',
          label: '显示 Javelin 的启动错误',
        },
        {
          href: '/zh/games/apex-legends/r5apex-exe-launch-error',
          label: 'r5apex.exe 启动错误',
        },
        {
          href: '/zh/games/apex-legends/code-net-leaf',
          label: 'code:net 与 code:leaf',
        },
      ],
    },
    es: {
      title:
        'Apex_crash.txt: comprobar cierres, reparar y comparar aplicaciones',
      shortTitle: 'Apex_crash.txt y cierres',
      description:
        'Apex_crash.txt no identifica la causa. Registra el cierre, reinicia, repara con EA app o Steam y compara aplicaciones antes de contactar con soporte.',
      lead: 'Para Apex en PC que se cierra después de iniciar o al jugar y menciona Apex_crash.txt. Los errores r5apex.exe previos al inicio y las desconexiones se comprueban aparte.',
      summary:
        'Apex_crash.txt es una pista de un cierre, no una prueba de avería ni de una causa concreta. Registra la hora y escena, reinicia y repara desde tu lanzador. Si continúa, cierra una aplicación opcional cada vez, compara y entrega los resultados a EA.',
      quickFacts: [
        {
          label: 'Anota primero',
          value: 'Hora, escena, mensaje completo y lanzador',
        },
        {
          label: 'Ruta de reparación',
          value: 'Reparar en EA app o verificar en Steam',
        },
        {
          label: 'Restaurar tras comparar',
          value: 'Vuelve a abrir la aplicación cerrada',
        },
      ],
      diagnosis: [
        {
          symptom: 'Apex_crash.txt tras iniciar',
          cause: 'Registra las condiciones',
          stepId: 'record-crash',
        },
        {
          symptom: 'Archivos sin comprobar',
          cause: 'Repara desde tu lanzador',
          stepId: 'repair-crash-files',
        },
        {
          symptom: 'Reaparece al grabar o transmitir',
          cause: 'Compara aplicaciones opcionales',
          stepId: 'compare-background-apps',
        },
        {
          symptom: 'Fallo previo al inicio o desconexión',
          cause: 'Elige el síntoma correspondiente',
          stepId: 'report-crash',
        },
      ],
      steps: [
        {
          id: 'record-crash',
          title: 'Anota la escena y reinicia',
          summary: 'El nombre del registro no demuestra la causa.',
          actions: [
            'Si el mensaje menciona Javelin, consulta el enlace específico de este paso.',
            'Anota hora y zona horaria, escena en sala o partida, mensaje completo y EA app o Steam. Incluye actualizaciones o aplicaciones recientes.',
            'Guarda otros trabajos, reinicia juego y PC y repite la misma acción. Si no llega a abrir el juego, consulta la guía r5apex.exe.',
            'Conserva Apex_crash.txt si se ha generado para la consulta. No adivines su ubicación ni borres resultados de búsqueda solo por el nombre.',
          ],
          risk: 'low',
          note: 'Si se reinicia o bloquea todo el PC, registra ese síntoma aparte y no sigas tratándolo como un cierre exclusivo del juego.',
          time: 'Unos 3–5 minutos para consultar y anotar',
          guideLink: {
            href: '/es/games/apex-legends/javelin-launch-error',
            label: 'Error de inicio que menciona Javelin',
          },
        },
        {
          id: 'repair-crash-files',
          title: 'Repara desde tu lanzador',
          summary: 'Separa el resultado de la reparación del siguiente cierre.',
          actions: [
            'Cierra Apex. En EA app abre Biblioteca → Apex Legends → Administrar → Reparar y espera a que termine.',
            'En Steam, clic derecho en Apex de la Biblioteca → Propiedades → Archivos instalados → Verificar integridad de los archivos. Evita otras tareas intensivas de disco.',
            'Repite la escena. Si falla la propia reparación, registra su mensaje completo y consulta el soporte oficial del lanzador.',
          ],
          risk: 'low',
          note: 'La reparación puede descargar de nuevo archivos gestionados. No es una restauración completa ni exige borrar toda la configuración.',
          time: 'La duración depende de la tarea y el equipo',
        },
        {
          id: 'compare-background-apps',
          title: 'Compara una aplicación opcional',
          summary: 'Anota qué aplicación has cerrado.',
          actions: [
            'Guarda el trabajo de una aplicación de grabación, emisión u otra opcional que hayas abierto y ciérrala desde sus propios controles.',
            'Compara la misma escena. Si no cambia nada, vuelve a abrirla para recuperar el estado anterior antes de otra prueba.',
            'No detengas servicios de Windows, antitrampas ni antivirus. Consulta al administrador en equipos gestionados o ante software desconocido.',
          ],
          risk: 'low',
          note: 'Un inicio correcto no demuestra la causa. Añade si reaparece y qué ocurre tras reiniciar normalmente.',
          time: 'La duración depende de la tarea y el equipo',
        },
        {
          id: 'report-crash',
          title: 'Comunica a EA el síntoma restante',
          summary: 'Resume las comparaciones en lugar de reparar sin límite.',
          actions: [
            'Entrega al soporte oficial de EA el lanzador, versión de Windows, escena, hora y resultados del reinicio, reparación y comparación de aplicaciones.',
            'Revisa nombres de usuario y datos privados en registros e imágenes. Comparte solo lo solicitado por soporte, no registros completos en comentarios públicos.',
            'Para code:net o code:leaf, consulta la guía de conexión. Para r5apex.exe antes del inicio, usa la guía de arranque sin repetir reparaciones indefinidamente.',
          ],
          risk: 'low',
          guideLink: {
            href: '/es/games/apex-legends/r5apex-exe-launch-error',
            label: 'Comprobar r5apex.exe antes del inicio',
          },
          time: 'Unos 3–5 minutos para consultar y anotar',
        },
      ],
      avoid: [
        'No uses borrar Apex_crash.txt como solución',
        'No descargues DLL ni ejecutables de terceros',
        'No detengas las protecciones ni el antitrampas',
      ],
      cautions: [],
      faqs: [
        {
          question: '¿Apex_crash.txt demuestra un fallo de GPU?',
          answer:
            'No. El registro de un cierre por sí solo no identifica la causa. Envía las condiciones y resultados de reparación y comparación al soporte.',
        },
        {
          question: '¿Basta con iniciar una vez después de reparar?',
          answer:
            'Comprueba la escena original y tras un reinicio normal. Registra qué mejoró, pero no atribuyas la causa a un único intento correcto.',
        },
      ],
      related: [
        {
          href: '/es/games/apex-legends/javelin-launch-error',
          label: 'Error de inicio que menciona Javelin',
        },
        {
          href: '/es/games/apex-legends/r5apex-exe-launch-error',
          label: 'Errores de inicio de r5apex.exe',
        },
        {
          href: '/es/games/apex-legends/code-net-leaf',
          label: 'code:net y code:leaf',
        },
      ],
    },
  },
  relatedSlugs: [
    'javelin-launch-error',
    'r5apex-exe-launch-error',
    'code-net-leaf',
  ],
};
