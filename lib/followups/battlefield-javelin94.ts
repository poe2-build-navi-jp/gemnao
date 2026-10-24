import type { FollowupGuide } from './types';

export const battlefieldJavelin94Guide: FollowupGuide = {
  gameSlug: 'battlefield-6',
  gameName: 'Battlefield 6',
  slug: 'javelin-error-94',
  category: 'launch',
  checkedAt: '2026-10-13',
  sources: [
    {
      url: 'https://help.ea.com/en/articles/battlefield/battlefield-6/error-codes/',
      labels: {
        ja: 'EA：Battlefield 6のエラー別案内（英語）',
        en: 'EA: Battlefield 6 error messages',
        zh: 'EA：Battlefield 6 错误提示（英语）',
        es: 'EA: errores de Battlefield 6 (inglés)',
      },
    },
    {
      url: 'https://help.ea.com/en/articles/platforms/pc-ea-anticheat/',
      labels: {
        ja: 'EA：Javelinの導入とエラー別対処（英語）',
        en: 'EA: install and troubleshoot Javelin',
        zh: 'EA：安装与排查 Javelin（英语）',
        es: 'EA: instalación y errores de Javelin (inglés)',
      },
    },
  ],
  copy: {
    ja: {
      title: 'Battlefield 6のJavelinエラー94｜EA app起動と正規の再導入',
      shortTitle: 'Javelinエラー94',
      description:
        'BF6のJavelin (94)をSecure BootやBANと混同せず、EA appからの起動確認、対象ゲームだけの公式再導入、失敗時の相談記録を案内します。',
      lead: 'Battlefield 6でEA Javelin anticheat encountered an error (94)が表示されるPC向けです。Secure Bootを明示したエラーや別番号には、その症状の案内を使います。',
      summary:
        'EAは94について、アンチチートがゲームを起動できない、またはインストールフォルダーを見つけられない可能性を案内しています。EA appを一度管理者として起動し、そこからBF6を試します。続く場合は公式インストーラーでBF6だけを再導入します。94だけでBANやSecure Boot不良とは断定しません。',
      quickFacts: [
        {
          label: '意味',
          value: 'ゲーム起動・インストール先の確認が必要な可能性',
        },
        {
          label: '公式の初手',
          value: 'EA appを管理者として開き、EA appから起動',
        },
        {
          label: '再導入の対象',
          value: 'BF6だけ。Uninstall Allは使わない',
        },
      ],
      diagnosis: [
        {
          symptom: '全文にJavelin (94)',
          cause: '番号と起動経路を記録',
          stepId: 'record-javelin-94',
        },
        {
          symptom: 'EA appからの確認が未実施',
          cause: '公式の管理者起動を比較',
          stepId: 'launch-from-ea-app',
        },
        {
          symptom: '94が変わらない',
          cause: 'BF6だけ正規に再導入',
          stepId: 'reinstall-javelin-bf6',
        },
        {
          symptom: '別番号・Secure Bootが表示',
          cause: '対応する症状へ分岐',
          stepId: 'report-javelin-result',
        },
      ],
      steps: [
        {
          id: 'record-javelin-94',
          title: '番号と起動経路を記録',
          summary: '似たアンチチート表示を一括で扱いません。',
          actions: [
            'エラー全文と94、発生時刻、Windowsの版、EA app／Steam／Epicのどこから起動したかを控える。',
            '作業を保存してゲームとPCを再起動し、同じ番号が出るか確認する。ゲームの.exeを直接起動する方法へ変えない。',
            'Secure Bootの明示や別番号に変わった場合はSTEP 4へ。会社・学校のPCや管理者権限がない場合は管理者へ相談する。',
          ],
          risk: 'low',
          note: 'この確認ではファームウェアや保護設定を変更しません。',
          time: '確認・記録：約3〜5分',
        },
        {
          id: 'launch-from-ea-app',
          title: 'EA appから一度起動を比較',
          summary: 'EA公式はSteam・Epic所有者にもこの確認を案内しています。',
          actions: [
            'EA appを終了する。正規のEA appを右クリックし「管理者として実行」を選び、表示された確認を読んで起動する。',
            'EA appのライブラリからBattlefield 6を起動し、94が残るか、別のメッセージに変わるかを記録する。',
            '比較後はEA appを終了し、通常の起動に戻す。すべての.exeを常時管理者実行にする互換性設定は追加しない。',
          ],
          risk: 'medium',
          note: '権限を確認できない場合はそこで止めます。アカウントの権限やUACを変更する手順ではありません。',
          time: '処理時間は環境により異なります',
        },
        {
          id: 'reinstall-javelin-bf6',
          title: 'BF6だけJavelinを再導入',
          summary: '公式のインストーラーで対象を確認します。',
          actions: [
            'ゲームを終了し、EA公式記事のインストーラー案内を確認する。標準の場所例は C:\\Program Files\\EA\\AC\\EAAntiCheat.Installer.exe。見つからなければ公式記事の配布リンクを使い、検索結果の.exeで代用しない。',
            'インストーラーでBattlefield 6だけを選択してUninstall。続けて同じ対象を選びInstallし、Install successを確認する。Uninstall Allは選ばない。',
            '再導入完了後にEA appから起動して結果を記録する。対象がない・導入が失敗した場合は全文を控えて止め、アンチチートなしで起動を試さない。',
          ],
          risk: 'medium',
          note: '復元は同じBF6へ正規にInstallすることです。他ゲームの保護を削除せず、再導入失敗を任意の.sys削除で補いません。',
          time: '処理時間は環境により異なります',
        },
        {
          id: 'report-javelin-result',
          title: '残ったコードと結果を相談',
          summary: '初期化や別設定の変更を追加しません。',
          actions: [
            '94が残る場合は、全文、Windowsの版、起動経路、EA app管理者起動とJavelin再導入の結果をEAへ伝える。',
            '新しい番号はその公式項目へ。Secure Bootの表示ならWindows側の状態確認記事へ進む。',
            '導入ログや画像は必要な範囲だけ公式窓口へ共有し、ユーザー名などを公開の回答欄へ載せない。',
          ],
          risk: 'low',
          guideLink: {
            href: '/games/battlefield-6/secure-boot-enabled-not-launching',
            label: 'Secure Bootが有効なのに止まる場合',
          },
          time: '確認・記録：約3〜5分',
        },
      ],
      avoid: [
        '94だけでBAN・不正検出・Secure Boot故障と断定しない',
        'Uninstall Allやアンチチートなしの起動を使わない',
        '任意のDLL/.sys削除、保護停止、全EXEの常時昇格をしない',
      ],
      cautions: [],
      faqs: [
        {
          question: 'Steam版でもEA appから確認しますか？',
          answer:
            'はい。EAの94向け案内はSteam・Epicで購入した場合もEA appを管理者起動し、そこからゲームを起動する手順です。',
        },
        {
          question: '94を直すにはSecure Bootを入れ直しますか？',
          answer:
            '94の公式説明は起動やインストール先に関する可能性です。Secure Bootを明示した別の表示がない限り、94だけでファームウェアを切り替えません。',
        },
      ],
      related: [
        {
          href: '/games/battlefield-6/crash-after-update',
          label: '更新後のクラッシュ',
        },
        {
          href: '/games/battlefield-6/cannot-revive',
          label: 'BRで蘇生できない',
        },
        {
          href: '/games/battlefield-6/secure-boot-enabled-not-launching',
          label: 'Secure Boot有効でも起動しない',
        },
      ],
    },
    en: {
      title:
        'Battlefield 6 Javelin Error 94: EA App Launch and Official Reinstallation',
      shortTitle: 'Javelin error 94',
      description:
        'Separate BF6 Javelin (94) from Secure Boot or account bans. Compare EA app launch, reinstall Javelin for BF6 only and record unresolved results.',
      lead: 'For Battlefield 6 on PC showing EA Javelin anticheat encountered an error (94). Use separate guidance for an explicit Secure Boot message or another error number.',
      summary:
        'EA says error 94 may mean anticheat cannot start the game or locate its installation folder. Try one launch with EA app run as administrator, starting BF6 from that app. If it persists, use the official installer to reinstall Javelin for BF6 only. The number alone does not establish a ban or a Secure Boot fault.',
      quickFacts: [
        {
          label: 'Meaning',
          value: 'Possible game-start or installation-folder issue',
        },
        {
          label: 'Official first comparison',
          value: 'Run EA app as administrator and launch from it',
        },
        {
          label: 'Reinstallation scope',
          value: 'BF6 only; do not use Uninstall All',
        },
      ],
      diagnosis: [
        {
          symptom: 'The full message contains Javelin (94)',
          cause: 'Record code and launch route',
          stepId: 'record-javelin-94',
        },
        {
          symptom: 'EA app launch not yet compared',
          cause: 'Use the official admin-launch check',
          stepId: 'launch-from-ea-app',
        },
        {
          symptom: '94 is unchanged',
          cause: 'Reinstall for BF6 only',
          stepId: 'reinstall-javelin-bf6',
        },
        {
          symptom: 'Another code or Secure Boot appears',
          cause: 'Switch to its symptom',
          stepId: 'report-javelin-result',
        },
      ],
      steps: [
        {
          id: 'record-javelin-94',
          title: 'Record the code and launch route',
          summary: 'Do not group every anti-cheat message together.',
          actions: [
            'Record the complete message and 94, time, Windows version and whether you launched through EA app, Steam or Epic.',
            'Save work, restart the game and PC and check the number again. Do not switch to launching the game executable directly.',
            'If it now explicitly mentions Secure Boot or another number, use Step 4. Ask the administrator for work/school PCs or if you lack administrator access.',
          ],
          risk: 'low',
          note: 'This check makes no firmware or protection changes.',
          time: 'About 3–5 minutes to read and record',
        },
        {
          id: 'launch-from-ea-app',
          title: 'Compare one launch from EA app',
          summary: 'EA also gives this instruction to Steam and Epic owners.',
          actions: [
            'Exit EA app. Right-click the legitimate EA app and choose Run as administrator, checking the confirmation prompt before proceeding.',
            'Launch Battlefield 6 from the EA app library and record whether 94 persists or changes to another message.',
            'After comparison, exit EA app and return to a normal launch. Do not add compatibility settings that permanently elevate every executable.',
          ],
          risk: 'medium',
          note: 'Stop if you cannot confirm the required access. This does not call for changing account permissions or UAC.',
          time: 'Duration depends on the task and device',
        },
        {
          id: 'reinstall-javelin-bf6',
          title: 'Reinstall Javelin for BF6 only',
          summary: 'Confirm the target in the official installer.',
          actions: [
            'Close the game and consult EA’s installer instructions. A standard location is C:\\Program Files\\EA\\AC\\EAAntiCheat.Installer.exe. If absent, use the download linked by EA, not a replacement executable from search results.',
            'Select only Battlefield 6 and choose Uninstall. Select the same game, choose Install and confirm Install success. Do not choose Uninstall All.',
            'After installation completes, launch from EA app and record the result. If BF6 is absent or installation fails, stop with the full error; do not try to run without anti-cheat.',
          ],
          risk: 'medium',
          note: 'Restore protection by installing for the same BF6 target. Do not remove other games’ protection or compensate for failed installation by deleting .sys files.',
          time: 'Duration depends on the task and device',
        },
        {
          id: 'report-javelin-result',
          title: 'Report the remaining code and results',
          summary: 'Do not add resets or unrelated setting changes.',
          actions: [
            'If 94 remains, give EA the full message, Windows version, launch route and results of the EA app administrator launch and Javelin reinstallation.',
            'Use the matching official entry for a new number. For a Secure Boot message, use the Windows-state guide.',
            'Share only required installer logs or images through official support. Do not post usernames and other private information in public feedback.',
          ],
          risk: 'low',
          guideLink: {
            href: '/en/games/battlefield-6/secure-boot-enabled-not-launching',
            label: 'Check a block despite Secure Boot being enabled',
          },
          time: 'About 3–5 minutes to read and record',
        },
      ],
      avoid: [
        'Do not equate 94 with a ban, cheat detection or Secure Boot failure',
        'Do not use Uninstall All or launch without anti-cheat',
        'Do not delete arbitrary DLL/.sys files, stop protection or permanently elevate all executables',
      ],
      cautions: [],
      faqs: [
        {
          question: 'Should Steam owners also use EA app for this check?',
          answer:
            'Yes. EA’s error-94 guidance includes Steam and Epic purchases: run EA app as administrator and start the game from it.',
        },
        {
          question: 'Should I toggle Secure Boot to fix 94?',
          answer:
            'EA describes 94 as a possible game-start or installation-folder issue. Do not toggle firmware settings from that number alone; treat an explicit Secure Boot message separately.',
        },
      ],
      related: [
        {
          href: '/en/games/battlefield-6/crash-after-update',
          label: 'Crashes after updating',
        },
        {
          href: '/en/games/battlefield-6/cannot-revive',
          label: 'Cannot revive in Battle Royale',
        },
        {
          href: '/en/games/battlefield-6/secure-boot-enabled-not-launching',
          label: 'Secure Boot On but launch blocked',
        },
      ],
    },
    zh: {
      title: 'Battlefield 6 Javelin 错误 94：EA app 启动与正规重装',
      shortTitle: 'Javelin 错误 94',
      description:
        '区分 BF6 Javelin (94)、安全启动与封禁。比较 EA app 启动，仅为 BF6 正规重装 Javelin，并记录未解决结果。',
      lead: '适用于 PC 版 Battlefield 6 出现 EA Javelin anticheat encountered an error (94)。明确的安全启动提示或其他编号应使用对应说明。',
      summary:
        'EA 表示 94 可能是反作弊无法启动游戏或找不到安装目录。先以管理员身份运行一次 EA app，从中启动 BF6 比较。仍持续时，用官方安装器仅为 BF6 重装 Javelin。不能仅凭 94 认定封禁或安全启动故障。',
      quickFacts: [
        {
          label: '含义',
          value: '可能涉及启动游戏或安装目录',
        },
        {
          label: '官方首次比较',
          value: '以管理员身份运行 EA app，再从中启动',
        },
        {
          label: '重装范围',
          value: '仅 BF6，不使用 Uninstall All',
        },
      ],
      diagnosis: [
        {
          symptom: '全文含 Javelin (94)',
          cause: '记录编号与启动路径',
          stepId: 'record-javelin-94',
        },
        {
          symptom: '尚未比较 EA app 启动',
          cause: '按官方要求比较管理员启动',
          stepId: 'launch-from-ea-app',
        },
        {
          symptom: '94 未改变',
          cause: '仅为 BF6 正规重装',
          stepId: 'reinstall-javelin-bf6',
        },
        {
          symptom: '新编号或安全启动提示',
          cause: '切换到对应症状',
          stepId: 'report-javelin-result',
        },
      ],
      steps: [
        {
          id: 'record-javelin-94',
          title: '记录编号与启动方式',
          summary: '不要合并处理所有反作弊提示。',
          actions: [
            '记录完整提示、94、时间、Windows 版本，以及从 EA app、Steam 还是 Epic 启动。',
            '保存工作，重启游戏与 PC，再确认编号；不要改为直接运行游戏的可执行文件。',
            '出现明确安全启动提示或其他编号时转第 4 步。工作、学校电脑或没有管理员权限时，咨询管理员。',
          ],
          risk: 'low',
          note: '本项检查不修改固件或安全保护。',
          time: '检查与记录约 3–5 分钟',
        },
        {
          id: 'launch-from-ea-app',
          title: '从 EA app 比较一次启动',
          summary: 'EA 也向 Steam 和 Epic 购买者提供此步骤。',
          actions: [
            '退出 EA app，右键正规的 EA app，选择以管理员身份运行，先核对确认提示。',
            '从 EA app 游戏库启动 Battlefield 6，记录 94 是否持续或变为其他信息。',
            '比较后退出 EA app 并恢复普通启动，不添加让所有程序永久提权的兼容性设置。',
          ],
          risk: 'medium',
          note: '无法确认权限时停止，不修改账号权限或 UAC。',
          time: '耗时取决于操作和设备',
        },
        {
          id: 'reinstall-javelin-bf6',
          title: '仅为 BF6 重装 Javelin',
          summary: '在官方安装器内确认目标。',
          actions: [
            '退出游戏并查看 EA 官方安装器说明。标准位置示例为 C:\\Program Files\\EA\\AC\\EAAntiCheat.Installer.exe；不存在时使用 EA 文章中的下载链接，不从搜索结果获取替代程序。',
            '只选 Battlefield 6 后选择 Uninstall，再选择同一游戏并 Install，确认 Install success。不选 Uninstall All。',
            '安装完成后从 EA app 启动并记录。目标不存在或安装失败时保留完整提示并停止，不尝试绕过反作弊启动。',
          ],
          risk: 'medium',
          note: '恢复方式是为同一 BF6 目标正规 Install。不移除其他游戏的保护，也不靠删除 .sys 弥补安装失败。',
          time: '耗时取决于操作和设备',
        },
        {
          id: 'report-javelin-result',
          title: '提交剩余编号与结果',
          summary: '不追加重置或无关设置变更。',
          actions: [
            '94 仍存在时，向 EA 提供完整提示、Windows 版本、启动方式，以及管理员启动 EA app 和重装的结果。',
            '新编号对应官方新条目；安全启动提示则转到 Windows 状态检查指南。',
            '只通过官方支持提供所需安装日志或图片，不在公开反馈中发布用户名等隐私。',
          ],
          risk: 'low',
          guideLink: {
            href: '/zh/games/battlefield-6/secure-boot-enabled-not-launching',
            label: '检查安全启动已启用仍无法启动',
          },
          time: '检查与记录约 3–5 分钟',
        },
      ],
      avoid: [
        '不把 94 等同于封禁、作弊检测或安全启动故障',
        '不使用 Uninstall All 或无反作弊启动',
        '不随意删除 DLL/.sys、关闭保护或永久提权全部程序',
      ],
      cautions: [],
      faqs: [
        {
          question: 'Steam 版也要通过 EA app 检查吗？',
          answer:
            '是。EA 的 94 指南包括 Steam 与 Epic 购买者，建议以管理员身份运行 EA app 并从中启动游戏。',
        },
        {
          question: '修复 94 需要切换安全启动吗？',
          answer:
            'EA 的定义是可能无法启动游戏或找到安装目录。不要仅凭编号切换固件设置，应单独处理明确的安全启动提示。',
        },
      ],
      related: [
        {
          href: '/zh/games/battlefield-6/secure-boot-enabled-not-launching',
          label: '安全启动开启仍被阻止',
        },
      ],
    },
    es: {
      title:
        'Battlefield 6: error 94 de Javelin, inicio desde EA app y reinstalación',
      shortTitle: 'Error 94 de Javelin',
      description:
        'Distingue Javelin (94) de Secure Boot o un bloqueo de cuenta. Compara el inicio desde EA app, reinstala solo para BF6 y registra el resultado.',
      lead: 'Para Battlefield 6 en PC con EA Javelin anticheat encountered an error (94). Los mensajes explícitos de Secure Boot y otros números tienen sus propias comprobaciones.',
      summary:
        'EA indica que 94 puede significar que el antitrampas no inicia el juego o no encuentra su carpeta. Prueba una ejecución de EA app como administrador e inicia BF6 desde ella. Si persiste, reinstala Javelin solo para BF6 con el instalador oficial. El número no demuestra una sanción ni un fallo de Secure Boot.',
      quickFacts: [
        {
          label: 'Significado',
          value: 'Posible problema de inicio o carpeta de instalación',
        },
        {
          label: 'Primera comparación oficial',
          value: 'EA app como administrador e inicio desde ella',
        },
        {
          label: 'Alcance de reinstalación',
          value: 'Solo BF6; no uses Uninstall All',
        },
      ],
      diagnosis: [
        {
          symptom: 'El texto incluye Javelin (94)',
          cause: 'Registra código y vía de inicio',
          stepId: 'record-javelin-94',
        },
        {
          symptom: 'No has comparado EA app',
          cause: 'Prueba el inicio administrativo oficial',
          stepId: 'launch-from-ea-app',
        },
        {
          symptom: '94 permanece igual',
          cause: 'Reinstala solo para BF6',
          stepId: 'reinstall-javelin-bf6',
        },
        {
          symptom: 'Otro número o Secure Boot',
          cause: 'Cambia al síntoma correspondiente',
          stepId: 'report-javelin-result',
        },
      ],
      steps: [
        {
          id: 'record-javelin-94',
          title: 'Anota código y vía de inicio',
          summary: 'No agrupes todos los mensajes del antitrampas.',
          actions: [
            'Registra mensaje completo y 94, hora, versión de Windows y si iniciaste desde EA app, Steam o Epic.',
            'Guarda el trabajo, reinicia juego y PC y comprueba de nuevo el número. No pases a ejecutar directamente el archivo del juego.',
            'Si ahora menciona Secure Boot u otro código, ve al paso 4. Consulta al administrador en equipos laborales/escolares o sin acceso administrativo.',
          ],
          risk: 'low',
          note: 'Esta comprobación no modifica firmware ni protección.',
          time: 'Unos 3–5 minutos para consultar y anotar',
        },
        {
          id: 'launch-from-ea-app',
          title: 'Compara un inicio desde EA app',
          summary: 'EA también lo indica para compras en Steam y Epic.',
          actions: [
            'Cierra EA app. Haz clic derecho en la aplicación legítima y elige Ejecutar como administrador; comprueba el aviso antes de continuar.',
            'Inicia Battlefield 6 desde su Biblioteca y anota si permanece 94 o aparece otro mensaje.',
            'Al terminar, cierra EA app y vuelve al inicio normal. No añadas ajustes de compatibilidad que eleven permanentemente todos los ejecutables.',
          ],
          risk: 'medium',
          note: 'Detente si no puedes confirmar el acceso. No se pide cambiar permisos de cuenta ni UAC.',
          time: 'La duración depende de la tarea y el equipo',
        },
        {
          id: 'reinstall-javelin-bf6',
          title: 'Reinstala Javelin solo para BF6',
          summary: 'Comprueba el destino en el instalador oficial.',
          actions: [
            'Cierra el juego y consulta las instrucciones de EA. Una ubicación estándar es C:\\Program Files\\EA\\AC\\EAAntiCheat.Installer.exe. Si no existe, usa la descarga enlazada por EA, no un ejecutable de resultados de búsqueda.',
            'Selecciona únicamente Battlefield 6 y Uninstall. Selecciona el mismo juego, pulsa Install y confirma Install success. No elijas Uninstall All.',
            'Tras completar la instalación, inicia desde EA app y registra el resultado. Si falta BF6 o falla la instalación, detente con el error completo; no inicies sin antitrampas.',
          ],
          risk: 'medium',
          note: 'Restaura la protección instalando para el mismo BF6. No retires la de otros juegos ni borres .sys para compensar un fallo de instalación.',
          time: 'La duración depende de la tarea y el equipo',
        },
        {
          id: 'report-javelin-result',
          title: 'Comunica el código y resultado restantes',
          summary: 'No añadas restablecimientos ni cambios ajenos.',
          actions: [
            'Si sigue 94, entrega a EA el mensaje, versión de Windows, vía de inicio y resultados del inicio administrativo y la reinstalación.',
            'Consulta el apartado oficial de un nuevo número. Para un mensaje Secure Boot, usa la guía del estado de Windows.',
            'Comparte solo registros o imágenes necesarios mediante soporte oficial. No publiques nombres de usuario u otros datos privados.',
          ],
          risk: 'low',
          guideLink: {
            href: '/es/games/battlefield-6/secure-boot-enabled-not-launching',
            label: 'Comprobar un bloqueo con Secure Boot activado',
          },
          time: 'Unos 3–5 minutos para consultar y anotar',
        },
      ],
      avoid: [
        'No equipares 94 con sanción, detección de trampas o fallo de Secure Boot',
        'No uses Uninstall All ni inicies sin antitrampas',
        'No borres DLL/.sys arbitrarios, detengas protección o eleves todos los ejecutables',
      ],
      cautions: [],
      faqs: [
        {
          question: '¿También uso EA app si compré en Steam?',
          answer:
            'Sí. La guía de EA para 94 incluye compras en Steam y Epic: ejecutar EA app como administrador e iniciar el juego desde ella.',
        },
        {
          question: '¿Debo cambiar Secure Boot para corregir 94?',
          answer:
            'EA lo describe como posible problema de inicio o carpeta. No cambies firmware solo por ese número; trata aparte un mensaje explícito de Secure Boot.',
        },
      ],
      related: [
        {
          href: '/es/games/battlefield-6/secure-boot-enabled-not-launching',
          label: 'Secure Boot activado y bloqueo',
        },
      ],
    },
  },
  relatedSlugs: [
    'crash-after-update',
    'cannot-revive',
    'secure-boot-enabled-not-launching',
  ],
};
