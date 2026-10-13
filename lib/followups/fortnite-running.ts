import type { FollowupGuide } from './types';

export const fortniteRunningGuide: FollowupGuide = {
  gameSlug: 'fortnite',
  gameName: 'Fortnite',
  slug: 'running-not-opening',
  category: 'launch',
  checkedAt: '2026-10-13',
  sources: [
    {
      url: 'https://www.epicgames.com/help/c-34254770/c-38015632/fortnite-shows-running-in-epic-games-launcher-and-it-is-not-opening-a23382825',
      labels: {
        ja: 'Epic：実行中なのに開かない（英語）',
        en: 'Epic: Fortnite shows running but does not open',
        zh: 'Epic：显示运行中但无法打开（英语）',
        es: 'Epic: Fortnite aparece en ejecución pero no abre (inglés)',
      },
    },
    {
      url: 'https://www.epicgames.com/help/c-34254770/a17813569',
      labels: {
        ja: 'Epic：ゲームファイルの確認（英語）',
        en: 'Epic: verify game files',
        zh: 'Epic：验证游戏文件（英语）',
        es: 'Epic: verificar archivos del juego (inglés)',
      },
    },
    {
      url: 'https://www.epicgames.com/help/c-34254770/a20611857',
      labels: {
        ja: 'Epic：Fortnite用Easy Anti-Cheatの導入（英語）',
        en: 'Epic: install Easy Anti-Cheat for Fortnite',
        zh: 'Epic：安装 Fortnite 所需的 Easy Anti-Cheat（英语）',
        es: 'Epic: instalar Easy Anti-Cheat para Fortnite (inglés)',
      },
    },
  ],
  copy: {
    ja: {
      title: 'Fortniteが「実行中」のまま開かない時｜Epicの確認とEAC導入',
      shortTitle: '実行中なのに開かない',
      description:
        'EpicでFortniteが実行中なのに画面が出ずエラーもない時の確認。再起動、ファイル確認、正規のEasy Anti-Cheat導入確認と未解決時の記録を案内します。',
      lead: 'Epic Games Launcherは「実行中」なのにFortniteのウィンドウが開かず、エラーコードも出ていないPC向けです。画面は開くが真っ黒、という症状は別に扱います。',
      summary:
        'まず作業を保存してPCを再起動し、Epicのライブラリから一度起動します。変わらなければ管理→確認でゲームファイルを検証します。EACの導入が必要な場合は正規の導入画面と公式案内を確認し、保護機能の除外・停止で回避しないでください。',
      quickFacts: [
        {
          label: '対象',
          value: '実行中・窓なし・エラーコードなし',
        },
        {
          label: '最初の確認',
          value: '再起動後、Epicの管理→確認',
        },
        {
          label: 'EAC',
          value: '必要な保護機能。削除したまま遊ばない',
        },
      ],
      diagnosis: [
        {
          symptom: '実行中表示だけで画面がない',
          cause: '再起動後の起動を比較',
          stepId: 'record-running-state',
        },
        {
          symptom: '再起動後も変わらない',
          cause: 'Epicのファイル確認',
          stepId: 'verify-fortnite-files',
        },
        {
          symptom: 'EAC導入の表示が出る',
          cause: '正規の導入案内を確認',
          stepId: 'check-eac-install',
        },
        {
          symptom: '窓が黒い／別コードが出た',
          cause: '症状別に切り替える',
          stepId: 'report-running-state',
        },
      ],
      steps: [
        {
          id: 'record-running-state',
          title: '窓なしと黒画面を分ける',
          summary: '起動ボタンを何度も押さず、状態を記録します。',
          actions: [
            '実行中表示、ウィンドウの有無、経過時間、更新中の表示、エラーの有無を記録する。進捗が動いているインストールを中断しない。',
            '他の作業を保存してPCを再起動し、Epic Games LauncherのライブラリからFortniteを一度起動する。',
            '窓が出て黒い場合はDX12黒画面の記事へ。エラーコードが出た場合は全文を控え、その公式案内を確認する。',
          ],
          risk: 'low',
          note: 'ゲームを終了できない時にWindowsやアンチチートのプロセスを手当たり次第に停止しません。',
          time: '確認・記録：約3〜5分',
        },
        {
          id: 'verify-fortnite-files',
          title: 'Epicでゲームファイルを確認',
          summary: '確認が完了してから再度起動します。',
          actions: [
            'Fortniteを終了し、Epic Games Launcher→ライブラリ→Fortniteの三点メニュー→管理→確認を選ぶ。',
            '確認・必要な修復が完了するまで待つ。実行中扱いで開始できない場合は、再起動後にゲームを開く前に確認する。',
            '同じ起動操作で比較する。確認自体が失敗したらそのエラーを記録し、繰り返す前にEpicへ相談する。',
          ],
          risk: 'low',
          note: 'Epicは確認でセーブデータは影響を受けないと説明しています。修復は管理ファイルを書き直す場合があるため、手動削除で代用しません。',
          time: '処理時間は環境により異なります',
        },
        {
          id: 'check-eac-install',
          title: 'EACの正規導入を確認する',
          summary: '古い修復画面やパスを推測しません。',
          actions: [
            'EpicはFortniteにEasy Anti-Cheatが必要と案内しています。再起動後の起動で期待したEAC導入画面が出た場合は、正規のものと確認できる範囲で案内に従う。',
            '職場・学校のPCや権限がない場合は管理者へ。導入画面がない・表示やファイル名が公式説明と違う場合は操作を止め、Epicの現行導入記事を参照する。',
            '手動導入は環境別の公式手順に従い、対象を確認できない実行ファイルや修復コマンドを試さない。失敗した場合はその全文を記録する。',
          ],
          risk: 'medium',
          note: 'EACの導入はファイルを変更します。不要になったショートカット等も公式手順の対象を確認し、EACそのものを削除した状態を回避策にしません。',
          time: '処理時間は環境により異なります',
        },
        {
          id: 'report-running-state',
          title: '残る表示をEpicへ伝える',
          summary: '窓なし・黒画面・コード付きエラーを区別します。',
          actions: [
            'Windowsの版、発生時刻、実行中表示の時間、再起動・確認・EAC導入の結果をEpic公式サポートへまとめる。',
            'コードやEAC導入エラーが新たに出た場合は、その番号と全文を伝える。パスに含まれるユーザー名は公開前に確認する。',
            'ウィンドウが出るようになって黒い場合は描画記事へ。全体のフォルダー除外や保護停止を追加せず、公式窓口の次の案内を待つ。',
          ],
          risk: 'low',
          guideLink: {
            href: '/games/fortnite/dx12-black-screen',
            label: 'ウィンドウは開くが黒い場合',
          },
          time: '確認・記録：約3〜5分',
        },
      ],
      avoid: [
        'Defenderの広範な除外や保護停止をしない',
        'DLL・.sysやアンチチートを任意に削除しない',
        '未確認のRepair Service画面や固定パスを使わない',
      ],
      cautions: [],
      faqs: [
        {
          question: '実行中表示なら正常に起動していますか？',
          answer:
            '表示だけでは画面やゲームの状態を確定できません。ウィンドウの有無・経過時間・エラー全文と再起動後の結果を確認します。',
        },
        {
          question: 'EACの修復ボタンが見つかりません',
          answer:
            '古い画面の手順を当てはめません。現在のEpic導入案内を確認し、説明と合わなければそこで止めてサポートへ相談します。',
        },
      ],
      related: [
        {
          href: '/games/fortnite/dx12-black-screen',
          label: 'DX12・黒画面',
        },
      ],
    },
    en: {
      title:
        'Fortnite Shows Running but Will Not Open: Verify Files and Check EAC',
      shortTitle: 'Running but no window',
      description:
        'For Fortnite marked Running in Epic with no window and no error code. Restart, verify files, check legitimate EAC installation and report unresolved results.',
      lead: 'For a PC where Epic Games Launcher says Running but no Fortnite window or error code appears. A window that opens black is a different symptom.',
      summary:
        'Save work, restart the PC and launch once from the Epic library. If unchanged, use Manage → Verify to check game files. If EAC installation is needed, follow the expected legitimate prompt and current official guidance instead of disabling or excluding protection.',
      quickFacts: [
        {
          label: 'Scope',
          value: 'Running, no window and no error code',
        },
        {
          label: 'First check',
          value: 'Restart, then Epic Manage → Verify',
        },
        {
          label: 'EAC',
          value: 'Required protection; do not leave it removed',
        },
      ],
      diagnosis: [
        {
          symptom: 'Running without a window',
          cause: 'Compare after restarting',
          stepId: 'record-running-state',
        },
        {
          symptom: 'Unchanged after restart',
          cause: 'Verify through Epic',
          stepId: 'verify-fortnite-files',
        },
        {
          symptom: 'An EAC installation prompt appears',
          cause: 'Check legitimate installation',
          stepId: 'check-eac-install',
        },
        {
          symptom: 'Black window or a new code',
          cause: 'Switch to that symptom',
          stepId: 'report-running-state',
        },
      ],
      steps: [
        {
          id: 'record-running-state',
          title: 'Separate no window from a black window',
          summary: 'Record the state instead of repeatedly pressing Launch.',
          actions: [
            'Record Running status, whether a window exists, elapsed time, update progress and any error. Do not interrupt an installation whose progress is changing.',
            'Save other work, restart the PC and launch Fortnite once from the Epic Games Launcher library.',
            'If a window opens black, use the DX12 black-screen guide. If a code appears, record the full message and use its official guidance.',
          ],
          risk: 'low',
          note: 'Do not end arbitrary Windows or anti-cheat processes when the game cannot be closed.',
          time: 'About 3–5 minutes to read and record',
        },
        {
          id: 'verify-fortnite-files',
          title: 'Verify the game through Epic',
          summary: 'Wait for verification before another launch.',
          actions: [
            'Close Fortnite. Open Epic Games Launcher → Library → Fortnite’s three-dot menu → Manage → Verify.',
            'Wait for verification and any repair to finish. If Running status prevents it, restart and verify before opening the game.',
            'Compare the same launch. If verification fails, record its error and contact Epic before repeating it.',
          ],
          risk: 'low',
          note: 'Epic says verification does not affect saved data. It can repair managed files; manual deletion is not a substitute.',
          time: 'Duration depends on the task and device',
        },
        {
          id: 'check-eac-install',
          title: 'Check legitimate EAC installation',
          summary: 'Do not guess old repair screens or paths.',
          actions: [
            'Epic requires Easy Anti-Cheat for Fortnite. If an expected EAC installation prompt appears when launching after a restart, follow it only when you can verify it is legitimate.',
            'Ask the administrator on work/school PCs or without permission. If no prompt appears or names/screens differ from the instructions, stop and open Epic’s current installation article.',
            'Follow environment-specific official steps for manual installation. Do not try unidentified executables or repair commands; record any complete installation error.',
          ],
          risk: 'medium',
          note: 'EAC installation changes files. Check any temporary shortcut against the official procedure; leaving EAC removed is not a workaround.',
          time: 'Duration depends on the task and device',
        },
        {
          id: 'report-running-state',
          title: 'Give Epic the remaining state',
          summary: 'Keep no window, black screen and coded errors separate.',
          actions: [
            'Summarize Windows version, time, duration of Running status and restart, verification and EAC results for official Epic support.',
            'Include any new code and the full EAC installation error. Review usernames in paths before sharing publicly.',
            'If a window now opens but stays black, use the graphics guide. Do not add broad folder exclusions or disable protection while waiting for further support.',
          ],
          risk: 'low',
          guideLink: {
            href: '/en/games/fortnite/dx12-black-screen',
            label: 'Check a window that opens black',
          },
          time: 'About 3–5 minutes to read and record',
        },
      ],
      avoid: [
        'Do not add broad Defender exclusions or stop protection',
        'Do not arbitrarily delete DLLs, .sys files or anti-cheat',
        'Do not assume an old Repair Service screen or fixed path',
      ],
      cautions: [],
      faqs: [
        {
          question: 'Does Running mean Fortnite started correctly?',
          answer:
            'The label alone cannot establish the state of the window or game. Compare the window, elapsed time, complete error and result after restart.',
        },
        {
          question: 'What if I cannot find an EAC repair button?',
          answer:
            'Do not apply an old interface guide. Check Epic’s current installation instructions; if your screen differs, stop and contact support.',
        },
      ],
      related: [
        {
          href: '/en/games/fortnite/dx12-black-screen',
          label: 'DX12 black screen',
        },
      ],
    },
    zh: {
      title: 'Fortnite 显示运行中却打不开：验证文件与检查 EAC 安装',
      shortTitle: '运行中但没有窗口',
      description:
        'Epic 显示 Fortnite 运行中但没有窗口或错误代码时，检查重启、游戏文件验证及正规 EAC 安装，并记录未解决的结果。',
      lead: '适用于 Epic Games Launcher 显示运行中，但 PC 上没有 Fortnite 窗口或错误代码。窗口已经打开却黑屏是另一种症状。',
      summary:
        '先保存工作并重启 PC，再从 Epic 游戏库启动一次。没有变化时，使用管理→验证检查游戏文件。需要安装 EAC 时，核对预期的正规安装提示和当前官方说明，不通过关闭保护或添加排除项绕过。',
      quickFacts: [
        {
          label: '适用范围',
          value: '运行中、无窗口、无错误代码',
        },
        {
          label: '首先检查',
          value: '重启后使用 Epic 管理→验证',
        },
        {
          label: 'EAC',
          value: '必要保护，不能卸载后继续游玩',
        },
      ],
      diagnosis: [
        {
          symptom: '运行中但无窗口',
          cause: '比较重启后的状态',
          stepId: 'record-running-state',
        },
        {
          symptom: '重启后仍然相同',
          cause: '通过 Epic 验证文件',
          stepId: 'verify-fortnite-files',
        },
        {
          symptom: '出现 EAC 安装提示',
          cause: '核对正规安装',
          stepId: 'check-eac-install',
        },
        {
          symptom: '窗口黑屏或出现新代码',
          cause: '转到对应症状',
          stepId: 'report-running-state',
        },
      ],
      steps: [
        {
          id: 'record-running-state',
          title: '区分没有窗口与窗口黑屏',
          summary: '记录状态，不反复点击启动。',
          actions: [
            '记录运行中标记、是否有窗口、已等待时间、更新进度和错误。不要中断进度仍在变化的安装。',
            '保存其他工作并重启 PC，从 Epic Games Launcher 游戏库启动 Fortnite 一次。',
            '窗口打开但黑屏时查看 DX12 黑屏指南；出现代码时记录完整提示并查看该代码的官方说明。',
          ],
          risk: 'low',
          note: '无法退出时，不要随意结束 Windows 或反作弊进程。',
          time: '检查与记录约 3–5 分钟',
        },
        {
          id: 'verify-fortnite-files',
          title: '通过 Epic 验证文件',
          summary: '验证完成后再启动。',
          actions: [
            '退出 Fortnite。进入 Epic Games Launcher→游戏库→Fortnite 三点菜单→管理→验证。',
            '等待验证及必要修复结束。运行中状态阻止验证时，重启后先验证，不先启动游戏。',
            '重复相同启动操作。如果验证本身失败，记录提示并先咨询 Epic，不反复重试。',
          ],
          risk: 'low',
          note: 'Epic 表示验证不会影响存档，但可能修复受管理文件；不要用手动删除代替。',
          time: '耗时取决于操作和设备',
        },
        {
          id: 'check-eac-install',
          title: '检查正规 EAC 安装',
          summary: '不要猜测旧修复界面或固定路径。',
          actions: [
            'Epic 说明 Fortnite 必须使用 Easy Anti-Cheat。重启后启动游戏出现预期的 EAC 安装提示时，只有确认来自正规程序才按提示操作。',
            '工作或学校电脑、没有权限时请找管理员。没有提示，或名称、画面与说明不同，应停止并查看 Epic 当前安装文章。',
            '手动安装应按实际环境遵循官方步骤，不尝试来源不明的可执行文件或修复命令；失败时记录完整提示。',
          ],
          risk: 'medium',
          note: '安装 EAC 会修改文件。临时快捷方式也要按官方说明确认；不能把卸载后保留空缺当作绕过办法。',
          time: '耗时取决于操作和设备',
        },
        {
          id: 'report-running-state',
          title: '向 Epic 提交剩余状态',
          summary: '区分无窗口、黑屏与带代码的错误。',
          actions: [
            '向 Epic 官方支持整理 Windows 版本、时间、运行中持续多久，以及重启、验证、EAC 安装结果。',
            '补充新出现的代码和完整安装错误，公开分享前检查路径中的用户名。',
            '如果窗口已打开但黑屏，转到图形指南。不要添加大范围文件夹排除或关闭保护，等待支持人员的下一步。',
          ],
          risk: 'low',
          guideLink: {
            href: '/zh/games/fortnite/dx12-black-screen',
            label: '检查窗口打开后的黑屏',
          },
          time: '检查与记录约 3–5 分钟',
        },
      ],
      avoid: [
        '不添加大范围 Defender 排除或停止保护',
        '不随意删除 DLL、.sys 或反作弊',
        '不套用未确认的 Repair Service 界面与路径',
      ],
      cautions: [],
      faqs: [
        {
          question: '显示运行中就代表启动正常吗？',
          answer:
            '标记本身不能确定游戏或窗口状态。应比较是否有窗口、等待时间、完整提示与重启后的结果。',
        },
        {
          question: '找不到 EAC 修复按钮怎么办？',
          answer:
            '不要套用旧界面。查看 Epic 当前安装说明；画面不一致时停止并咨询支持。',
        },
      ],
      related: [
        {
          href: '/zh/games/fortnite/dx12-black-screen',
          label: 'DX12 黑屏',
        },
      ],
    },
    es: {
      title:
        'Fortnite aparece en ejecución pero no abre: verificar archivos y EAC',
      shortTitle: 'En ejecución sin ventana',
      description:
        'Si Epic indica que Fortnite se ejecuta sin ventana ni código, reinicia, verifica archivos y comprueba la instalación legítima de EAC antes de contactar con soporte.',
      lead: 'Para PC donde Epic Games Launcher muestra En ejecución pero no aparece ventana ni código de Fortnite. Una ventana que abre en negro es un síntoma distinto.',
      summary:
        'Guarda el trabajo, reinicia el PC e inicia una vez desde la Biblioteca de Epic. Si sigue igual, usa Administrar → Verificar. Si hace falta instalar EAC, comprueba el aviso legítimo esperado y la guía oficial actual; no desactives ni excluyas protecciones.',
      quickFacts: [
        {
          label: 'Alcance',
          value: 'En ejecución, sin ventana y sin código',
        },
        {
          label: 'Primera comprobación',
          value: 'Reinicia y usa Administrar → Verificar',
        },
        {
          label: 'EAC',
          value: 'Protección necesaria; no lo dejes desinstalado',
        },
      ],
      diagnosis: [
        {
          symptom: 'En ejecución sin ventana',
          cause: 'Compara después del reinicio',
          stepId: 'record-running-state',
        },
        {
          symptom: 'Sin cambios tras reiniciar',
          cause: 'Verifica desde Epic',
          stepId: 'verify-fortnite-files',
        },
        {
          symptom: 'Aparece un aviso de EAC',
          cause: 'Comprueba la instalación legítima',
          stepId: 'check-eac-install',
        },
        {
          symptom: 'Ventana negra o nuevo código',
          cause: 'Cambia al síntoma correspondiente',
          stepId: 'report-running-state',
        },
      ],
      steps: [
        {
          id: 'record-running-state',
          title: 'Distingue ausencia de ventana y pantalla negra',
          summary: 'Anota el estado sin pulsar Iniciar repetidamente.',
          actions: [
            'Registra el estado, existencia de ventana, tiempo transcurrido, progreso de actualización y errores. No interrumpas una instalación que sigue avanzando.',
            'Guarda otros trabajos, reinicia el PC e inicia Fortnite una vez desde la Biblioteca de Epic Games Launcher.',
            'Si abre una ventana negra, consulta la guía DX12. Si aparece un código, anota el mensaje completo y consulta su ayuda oficial.',
          ],
          risk: 'low',
          note: 'No finalices procesos arbitrarios de Windows o antitrampas cuando no puedas cerrar el juego.',
          time: 'Unos 3–5 minutos para consultar y anotar',
        },
        {
          id: 'verify-fortnite-files',
          title: 'Verifica los archivos con Epic',
          summary: 'Espera a que termine antes de iniciar.',
          actions: [
            'Cierra Fortnite. Abre Epic Games Launcher → Biblioteca → menú de tres puntos de Fortnite → Administrar → Verificar.',
            'Espera a que terminen verificación y reparación. Si En ejecución lo impide, reinicia y verifica antes de abrir el juego.',
            'Compara el mismo inicio. Si falla la verificación, anota el error y consulta a Epic antes de repetirla.',
          ],
          risk: 'low',
          note: 'Epic indica que verificar no afecta a las partidas guardadas. Puede reparar archivos gestionados; borrarlos manualmente no sustituye este proceso.',
          time: 'La duración depende de la tarea y el equipo',
        },
        {
          id: 'check-eac-install',
          title: 'Comprueba la instalación legítima de EAC',
          summary: 'No adivines rutas ni pantallas antiguas.',
          actions: [
            'Epic exige Easy Anti-Cheat para Fortnite. Si al iniciar tras reiniciar aparece el aviso esperado de instalación, síguelo solo si puedes confirmar que es legítimo.',
            'Consulta al administrador en equipos laborales/escolares o sin permisos. Si no aparece el aviso o no coinciden nombres y pantallas, detente y abre la guía actual de Epic.',
            'Sigue los pasos oficiales adecuados para una instalación manual. No pruebes ejecutables ni comandos desconocidos; registra cualquier error completo.',
          ],
          risk: 'medium',
          note: 'Instalar EAC cambia archivos. Revisa también los accesos directos temporales según la guía; dejar EAC desinstalado no es una solución.',
          time: 'La duración depende de la tarea y el equipo',
        },
        {
          id: 'report-running-state',
          title: 'Comunica a Epic el estado restante',
          summary: 'Separa ausencia de ventana, pantalla negra y códigos.',
          actions: [
            'Resume versión de Windows, hora, duración de En ejecución y resultados de reinicio, verificación e instalación de EAC.',
            'Incluye nuevos códigos y el error completo de instalación. Revisa nombres de usuario en rutas antes de compartirlos públicamente.',
            'Si ahora abre una ventana negra, usa la guía gráfica. No añadas exclusiones amplias ni desactives protección mientras esperas ayuda.',
          ],
          risk: 'low',
          guideLink: {
            href: '/es/games/fortnite/dx12-black-screen',
            label: 'Comprobar una ventana que abre en negro',
          },
          time: 'Unos 3–5 minutos para consultar y anotar',
        },
      ],
      avoid: [
        'No añadas exclusiones amplias de Defender ni detengas protección',
        'No borres DLL, archivos .sys o antitrampas arbitrariamente',
        'No supongas una pantalla Repair Service o ruta antigua',
      ],
      cautions: [],
      faqs: [
        {
          question:
            '¿En ejecución significa que Fortnite inició correctamente?',
          answer:
            'La etiqueta no confirma el estado del juego o ventana. Compara ventana, tiempo transcurrido, mensaje completo y resultado tras reiniciar.',
        },
        {
          question: '¿Y si no encuentro un botón de reparación de EAC?',
          answer:
            'No apliques una guía de interfaz antigua. Consulta las instrucciones actuales de Epic; si no coinciden, detente y contacta con soporte.',
        },
      ],
      related: [
        {
          href: '/es/games/fortnite/dx12-black-screen',
          label: 'DX12 y pantalla negra',
        },
      ],
    },
  },
  relatedSlugs: ['dx12-black-screen'],
};
