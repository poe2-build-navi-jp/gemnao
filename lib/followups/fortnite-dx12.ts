import type { FollowupGuide } from './types';

export const fortniteDx12Guide: FollowupGuide = {
  gameSlug: 'fortnite',
  gameName: 'Fortnite',
  slug: 'dx12-black-screen',
  category: 'settings',
  checkedAt: '2026-10-13',
  sources: [
    {
      url: 'https://www.epicgames.com/help/c-34254770/c-38015632/a14140539',
      labels: {
        ja: 'Epic：Fortniteの描画問題とPerformance Mode（英語）',
        en: 'Epic: Fortnite graphics and Performance Mode',
        zh: 'Epic：Fortnite 图形问题与性能模式（英语）',
        es: 'Epic: gráficos y modo Rendimiento de Fortnite (inglés)',
      },
    },
  ],
  copy: {
    ja: {
      title: 'FortniteのDX12で黒画面になる時｜Performance Mode比較と戻し方',
      shortTitle: 'DX12・黒画面',
      description:
        'FortniteのDirectX 12使用時の黒画面をWindows全体の表示不良と分け、現行公式のPerformance Modeを比較。引数の保存・解除と未解決時の確認を案内します。',
      lead: 'Fortniteのウィンドウは開くものの、DX12使用中に黒画面・フリーズになるPC向けです。Epicで実行中と出るだけで窓がない場合は、起動の記事から確認します。',
      summary:
        'まずWindowsの画面が表示できるか確認します。ゲーム側のDX12黒画面には、Epicの描画問題ページがPerformance Modeの「-d3d12 -es31」を案内しています。元の起動引数と設定を記録し、一組の描画指定だけで比較します。改善しなければ追加した引数を除き、変更前の状態へ戻してください。',
      quickFacts: [
        {
          label: '対象',
          value: 'Windowsは映るがFortniteが黒い',
        },
        {
          label: '今回の公式比較',
          value: 'Performance Mode：-d3d12 -es31',
        },
        {
          label: '戻し方',
          value: '追加分を除き、元の引数と有効状態へ',
        },
      ],
      diagnosis: [
        {
          symptom: 'デスクトップも映らない',
          cause: 'Windows・接続側の症状を分ける',
          stepId: 'record-display-state',
        },
        {
          symptom: 'DX12でゲームだけ黒い',
          cause: '公式の描画モード比較',
          stepId: 'try-performance-mode',
        },
        {
          symptom: '比較後も変化がない',
          cause: '元の指定に戻して記録',
          stepId: 'restore-render-mode',
        },
        {
          symptom: '戻した後も続く',
          cause: 'GPU情報と結果を相談',
          stepId: 'report-graphics',
        },
      ],
      steps: [
        {
          id: 'record-display-state',
          title: 'ゲームだけの黒画面か確認',
          summary: '変更前の状態を先に残します。',
          actions: [
            'Alt＋TabでWindowsへ切り替えられるか確認。デスクトップも見えない、信号なし、PC再起動はゲームだけのDX12問題と決めつけない。',
            'Windowsが操作できる場合は、発生場面、音や進捗の有無、現在の描画設定、直前の更新を記録する。',
            'Epicの追加コマンドライン引数の文字列と有効・無効を保存する。既存の描画指定や意味の不明な引数がある場合は重ねず、公式案内で確認する。',
          ],
          risk: 'low',
          note: 'ウィンドウ自体が出ない場合は「実行中なのに開かない」の記事が対象です。',
          time: '確認・記録：約3〜5分',
        },
        {
          id: 'try-performance-mode',
          title: '公式のPerformance Modeを比較',
          summary: '描画方式を同時に複数指定しません。',
          actions: [
            'Fortniteを終了し、Epic Games Launcher→設定→Fortniteの項目を開く。公式ページの画面と異なる場合はそこで確認する。',
            '追加コマンドライン引数を有効にし、今回の比較用の描画指定として -d3d12 -es31 を入力する。別の描画指定へ継ぎ足さない。',
            'Fortniteを起動し、同じ場面で表示・フリーズ・エラーの変化を記録する。ほかの映像設定やドライバーは同時に変えない。',
          ],
          risk: 'low',
          note: 'これはEpicの描画問題ページに対応する表記です。他のモード記事にある別表記と混ぜて入力しません。',
          time: '処理時間は環境により異なります',
        },
        {
          id: 'restore-render-mode',
          title: '結果を比較し元の指定へ戻す',
          summary: '改善しない設定を積み重ねません。',
          actions: [
            '比較後にゲームを終了し、追加した -d3d12 -es31 を除去して保存した元の文字列・有効状態へ戻す。無関係な引数を削除しない。',
            '通常起動でもう一度確認する。表示が改善した場合も、比較に使ったモードと再起動後の結果を記録する。',
            'ゲーム内の描画設定が比較後に変わっていたら、表示できる状態で保存した元の値を確認する。画面が見えないまま設定ファイルを一括削除しない。',
          ],
          risk: 'low',
          note: 'Performance Modeで映ることだけでは、GPUの故障やDX12全体の不具合とは断定できません。',
          time: '処理時間は環境により異なります',
        },
        {
          id: 'report-graphics',
          title: 'GPU情報と比較結果で次を選ぶ',
          summary: '同じ引数を何度も追加しません。',
          actions: [
            'Epicの公式描画案内から、自分のGPUメーカーのドライバー情報を確認する。変更が必要なら対象機種の公式手順に従い、元の版を記録して別の比較として扱う。',
            'GPU名・ドライバー版、Windowsの版、元の描画指定、Performance Modeの結果、戻した結果をEpicへ伝える。',
            'PC全体の表示不良はメーカーの表示トラブル案内へ。窓がなく実行中のままなら起動記事へ進む。',
          ],
          risk: 'low',
          guideLink: {
            href: '/games/fortnite/running-not-opening',
            label: '実行中表示だけで窓がない場合',
          },
          time: '確認・記録：約3〜5分',
        },
      ],
      avoid: [
        '異なる描画モードの引数を同時指定しない',
        '保護機能の無効化やDLL取得で回避しない',
        '設定ファイル・シェーダーを手当たり次第に削除しない',
      ],
      cautions: [],
      faqs: [
        {
          question: '左右の黒い帯もこの症状ですか？',
          answer:
            'Epicは競技モードの16:9制限による左右の帯を通常の動作として説明しています。映像全体が出ない黒画面とは分けてください。',
        },
        {
          question: '元へ戻すには何を消しますか？',
          answer:
            '今回追加した -d3d12 -es31 を取り除き、保存しておいた引数の文字列と有効状態へ戻します。元からある無関係な指定まで消しません。',
        },
      ],
      related: [
        {
          href: '/games/fortnite/running-not-opening',
          label: '実行中なのに開かない',
        },
      ],
    },
    en: {
      title:
        'Fortnite DX12 Black Screen: Compare Performance Mode and Restore Settings',
      shortTitle: 'DX12 black screen',
      description:
        'Separate a Fortnite DX12 black screen from a Windows display failure. Compare the current official Performance Mode argument and restore the previous setup.',
      lead: 'For Fortnite on PC opening a window that stays black or freezes while using DX12. Running status with no window belongs to the launch guide.',
      summary:
        'First check whether Windows can still display. Epic’s graphics-troubleshooting page suggests Performance Mode using -d3d12 -es31 for DX12 black screens. Record the original launch arguments and settings and compare one rendering mode at a time. If it does not help, remove the added arguments and restore the previous setup.',
      quickFacts: [
        {
          label: 'Scope',
          value: 'Windows displays; Fortnite stays black',
        },
        {
          label: 'Official comparison used here',
          value: 'Performance Mode: -d3d12 -es31',
        },
        {
          label: 'Restore',
          value:
            'Remove the added arguments; restore the original text and toggle',
        },
      ],
      diagnosis: [
        {
          symptom: 'The desktop is also invisible',
          cause: 'Separate the Windows/display symptom',
          stepId: 'record-display-state',
        },
        {
          symptom: 'Only the game is black on DX12',
          cause: 'Compare the official rendering mode',
          stepId: 'try-performance-mode',
        },
        {
          symptom: 'No improvement after comparison',
          cause: 'Restore and record',
          stepId: 'restore-render-mode',
        },
        {
          symptom: 'Still happens after restoration',
          cause: 'Report GPU details and results',
          stepId: 'report-graphics',
        },
      ],
      steps: [
        {
          id: 'record-display-state',
          title: 'Check whether only the game is black',
          summary: 'Preserve the starting state.',
          actions: [
            'Try Alt + Tab to switch to Windows. An invisible desktop, No Signal or a PC restart is not automatically a Fortnite-only DX12 problem.',
            'If Windows is usable, record the scene, sound/progress, current rendering settings and recent updates.',
            'Save the existing Additional Command Line Arguments text and enabled state in Epic. If rendering arguments or unfamiliar options already exist, consult official guidance instead of stacking them.',
          ],
          risk: 'low',
          note: 'If no game window exists, use the Running but not opening guide.',
          time: 'About 3–5 minutes to read and record',
        },
        {
          id: 'try-performance-mode',
          title: 'Compare official Performance Mode',
          summary: 'Do not request multiple rendering modes together.',
          actions: [
            'Close Fortnite. In Epic Games Launcher open Settings and expand Fortnite. If the interface differs from the official page, check it before proceeding.',
            'Enable Additional Command Line Arguments and enter -d3d12 -es31 as the rendering choice for this comparison. Do not append it to another mode selection.',
            'Launch Fortnite and record display, freezing and error changes in the same scene. Do not change other graphics settings or drivers at the same time.',
          ],
          risk: 'low',
          note: 'This spelling follows Epic’s graphics-troubleshooting page. Do not combine it with alternative spellings from another mode article.',
          time: 'Duration depends on the task and device',
        },
        {
          id: 'restore-render-mode',
          title: 'Compare and restore the previous mode',
          summary: 'Avoid accumulating unhelpful settings.',
          actions: [
            'Close the game after comparison. Remove the added -d3d12 -es31 and restore the saved argument text and enabled state without deleting unrelated options.',
            'Launch normally and compare again. If display improved, record which mode was used and what happens after restart.',
            'If in-game rendering settings changed, check them against the saved values when the display is usable. Do not delete all configuration files while unable to see the screen.',
          ],
          risk: 'low',
          note: 'An improvement in Performance Mode alone does not establish GPU failure or a universal DX12 defect.',
          time: 'Duration depends on the task and device',
        },
        {
          id: 'report-graphics',
          title: 'Use GPU details to choose the next check',
          summary: 'Do not keep adding the same arguments.',
          actions: [
            'Use Epic’s graphics guide to find your GPU manufacturer’s driver information. If an update is needed, follow the exact model’s official instructions, record the old version and test separately.',
            'Give Epic the GPU, driver and Windows versions, original rendering choice, Performance Mode result and restored-state result.',
            'For a PC-wide display failure, use the manufacturer’s display guidance. For Running with no window, switch to the launch guide.',
          ],
          risk: 'low',
          guideLink: {
            href: '/en/games/fortnite/running-not-opening',
            label: 'Check Running status without a window',
          },
          time: 'About 3–5 minutes to read and record',
        },
      ],
      avoid: [
        'Do not combine arguments for different rendering modes',
        'Do not disable protection or download replacement DLLs',
        'Do not indiscriminately delete configuration or shader files',
      ],
      cautions: [],
      faqs: [
        {
          question: 'Are black bars at the sides the same issue?',
          answer:
            'No. Epic describes side bars from the 16:9 restriction in competitive modes as expected. Distinguish those from the entire game image being absent.',
        },
        {
          question: 'What should I remove to restore the setup?',
          answer:
            'Remove the -d3d12 -es31 added for this comparison and restore your saved argument text and toggle. Keep unrelated pre-existing options.',
        },
      ],
      related: [
        {
          href: '/en/games/fortnite/running-not-opening',
          label: 'Running but no window',
        },
      ],
    },
    zh: {
      title: 'Fortnite DX12 黑屏：比较性能模式并恢复原设置',
      shortTitle: 'DX12 黑屏',
      description:
        '区分 Fortnite DX12 黑屏与 Windows 整体显示故障，使用当前官方性能模式参数比较，保存并恢复原有启动设置。',
      lead: '适用于 PC 上 Fortnite 窗口已打开，但使用 DX12 时黑屏或卡死。只有运行中标记却无窗口时，应使用启动指南。',
      summary:
        '先确认 Windows 是否仍能显示。Epic 的图形问题页建议对 DX12 黑屏比较性能模式参数 -d3d12 -es31。记录原启动参数和设置，每次只指定一种渲染模式。没有改善时，移除本次参数并恢复原状态。',
      quickFacts: [
        {
          label: '适用范围',
          value: 'Windows 能显示，Fortnite 黑屏',
        },
        {
          label: '本次官方比较',
          value: '性能模式：-d3d12 -es31',
        },
        {
          label: '恢复方法',
          value: '去掉新增参数，还原原文本与开关',
        },
      ],
      diagnosis: [
        {
          symptom: '桌面也无法显示',
          cause: '区分 Windows 或显示连接问题',
          stepId: 'record-display-state',
        },
        {
          symptom: '仅 DX12 游戏画面黑屏',
          cause: '比较官方渲染模式',
          stepId: 'try-performance-mode',
        },
        {
          symptom: '比较后无改善',
          cause: '恢复并记录',
          stepId: 'restore-render-mode',
        },
        {
          symptom: '恢复后仍持续',
          cause: '提交 GPU 信息和结果',
          stepId: 'report-graphics',
        },
      ],
      steps: [
        {
          id: 'record-display-state',
          title: '确认是否只有游戏黑屏',
          summary: '先保留修改前状态。',
          actions: [
            '尝试 Alt＋Tab 切换到 Windows。桌面也不显示、无信号或整机重启，不应直接当作 Fortnite 的 DX12 问题。',
            'Windows 可操作时，记录场景、声音或进度、当前渲染设置及最近更新。',
            '保存 Epic 额外命令行参数的原文本和启用状态。已有渲染指定或不理解的选项时，不叠加参数，先核对官方说明。',
          ],
          risk: 'low',
          note: '游戏窗口根本没出现时，请使用“运行中但打不开”指南。',
          time: '检查与记录约 3–5 分钟',
        },
        {
          id: 'try-performance-mode',
          title: '比较官方性能模式',
          summary: '不要同时指定多个渲染模式。',
          actions: [
            '退出 Fortnite，打开 Epic Games Launcher→设置→展开 Fortnite。界面与官方说明不同时先核对。',
            '启用额外命令行参数，将 -d3d12 -es31 作为本次比较的渲染指定，不追加到另一种模式后面。',
            '启动 Fortnite，在同一场景记录画面、卡死和错误变化，不同时更改其他画质或驱动。',
          ],
          risk: 'low',
          note: '此写法对应 Epic 图形排查页面，不与其他模式文章的不同写法混合。',
          time: '耗时取决于操作和设备',
        },
        {
          id: 'restore-render-mode',
          title: '比较结果并恢复原模式',
          summary: '不累积没有帮助的设置。',
          actions: [
            '比较后退出游戏，移除新增的 -d3d12 -es31，恢复保存的参数文本与开关，不删除无关选项。',
            '正常启动再比较。若画面改善，也记录使用的模式和重启后的结果。',
            '若游戏内渲染设置也改变，在能够显示时对照记录恢复原值，不因看不见画面就删除全部配置。',
          ],
          risk: 'low',
          note: '性能模式能显示，并不能证明显卡损坏或 DX12 普遍存在故障。',
          time: '耗时取决于操作和设备',
        },
        {
          id: 'report-graphics',
          title: '用 GPU 信息选择下一步',
          summary: '不要反复添加相同参数。',
          actions: [
            '从 Epic 图形指南查找对应 GPU 厂商的驱动信息。需要更新时按具体型号的官方步骤操作，记录旧版并单独比较。',
            '向 Epic 提供 GPU 名称、驱动和 Windows 版本、原渲染指定、性能模式及恢复后的结果。',
            '整机显示问题应参考厂商显示排查说明；只有运行中而无窗口时，转到启动指南。',
          ],
          risk: 'low',
          guideLink: {
            href: '/zh/games/fortnite/running-not-opening',
            label: '检查运行中但没有窗口',
          },
          time: '检查与记录约 3–5 分钟',
        },
      ],
      avoid: [
        '不同时指定不同渲染模式的参数',
        '不关闭安全保护或下载替代 DLL',
        '不随意删除配置或着色器文件',
      ],
      cautions: [],
      faqs: [
        {
          question: '两侧黑边也是这个问题吗？',
          answer:
            '不是。Epic 将竞技模式 16:9 限制形成的两侧黑边视为正常行为，应与整幅游戏画面不显示区分。',
        },
        {
          question: '恢复时应删除什么？',
          answer:
            '仅移除本次新增的 -d3d12 -es31，并还原保存的参数文本与开关状态，不删除原有无关选项。',
        },
      ],
      related: [
        {
          href: '/zh/games/fortnite/running-not-opening',
          label: '运行中但没有窗口',
        },
      ],
    },
    es: {
      title:
        'Pantalla negra en Fortnite DX12: comparar Rendimiento y restaurar ajustes',
      shortTitle: 'DX12 y pantalla negra',
      description:
        'Distingue el negro de Fortnite DX12 de un fallo de Windows. Compara el argumento oficial actual de Rendimiento y restaura la configuración anterior.',
      lead: 'Para Fortnite en PC que abre una ventana negra o se bloquea usando DX12. Si solo aparece En ejecución sin ventana, consulta la guía de inicio.',
      summary:
        'Comprueba primero si Windows sigue mostrando imagen. La página de problemas gráficos de Epic propone Rendimiento con -d3d12 -es31 para pantallas negras en DX12. Guarda argumentos y ajustes originales y compara un modo cada vez. Si no mejora, retira los argumentos añadidos y restaura el estado anterior.',
      quickFacts: [
        {
          label: 'Alcance',
          value: 'Windows se ve; Fortnite queda negro',
        },
        {
          label: 'Comparación oficial utilizada',
          value: 'Rendimiento: -d3d12 -es31',
        },
        {
          label: 'Restaurar',
          value: 'Retira lo añadido y recupera texto y activación originales',
        },
      ],
      diagnosis: [
        {
          symptom: 'Tampoco se ve el escritorio',
          cause: 'Separa el problema de Windows/pantalla',
          stepId: 'record-display-state',
        },
        {
          symptom: 'Solo el juego queda negro en DX12',
          cause: 'Compara el modo oficial',
          stepId: 'try-performance-mode',
        },
        {
          symptom: 'No mejora al comparar',
          cause: 'Restaura y registra',
          stepId: 'restore-render-mode',
        },
        {
          symptom: 'Persiste después de restaurar',
          cause: 'Comunica GPU y resultados',
          stepId: 'report-graphics',
        },
      ],
      steps: [
        {
          id: 'record-display-state',
          title: 'Comprueba si solo el juego queda negro',
          summary: 'Conserva el estado inicial.',
          actions: [
            'Prueba Alt + Tab para ver Windows. Escritorio invisible, Sin señal o reinicio del PC no demuestran un problema exclusivo de Fortnite DX12.',
            'Si puedes usar Windows, registra escena, sonido/progreso, ajustes de renderizado y actualizaciones recientes.',
            'Guarda el texto y estado de activación de los argumentos adicionales de Epic. Si ya hay argumentos de renderizado u opciones desconocidas, consulta la guía oficial sin acumularlos.',
          ],
          risk: 'low',
          note: 'Si no existe ventana del juego, usa la guía En ejecución pero no abre.',
          time: 'Unos 3–5 minutos para consultar y anotar',
        },
        {
          id: 'try-performance-mode',
          title: 'Compara el modo Rendimiento oficial',
          summary: 'No solicites varios modos de renderizado a la vez.',
          actions: [
            'Cierra Fortnite. Abre Ajustes de Epic Games Launcher y despliega Fortnite. Si no coincide la interfaz oficial, compruébala antes de continuar.',
            'Activa los argumentos adicionales de línea de comandos e introduce -d3d12 -es31 como modo para esta comparación. No lo añadas a otra selección de modo.',
            'Inicia Fortnite y registra imagen, bloqueos y errores en la misma escena. No cambies otros ajustes gráficos o controladores simultáneamente.',
          ],
          risk: 'low',
          note: 'Esta escritura corresponde a la página de problemas gráficos de Epic. No la mezcles con otra variante de un artículo de modos.',
          time: 'La duración depende de la tarea y el equipo',
        },
        {
          id: 'restore-render-mode',
          title: 'Compara y restaura el modo anterior',
          summary: 'No acumules ajustes que no ayudan.',
          actions: [
            'Cierra el juego tras comparar. Retira el -d3d12 -es31 añadido y restaura texto y activación guardados sin borrar opciones ajenas.',
            'Inicia normalmente y compara de nuevo. Si mejora la imagen, registra el modo y lo que ocurre tras reiniciar.',
            'Si cambió el modo dentro del juego, revisa los valores guardados cuando puedas ver la pantalla. No borres toda la configuración por no ver imagen.',
          ],
          risk: 'low',
          note: 'Que funcione Rendimiento no demuestra una GPU averiada ni un defecto general de DX12.',
          time: 'La duración depende de la tarea y el equipo',
        },
        {
          id: 'report-graphics',
          title: 'Elige el siguiente paso con los datos de GPU',
          summary: 'No sigas añadiendo los mismos argumentos.',
          actions: [
            'Usa la guía gráfica de Epic para encontrar información oficial del controlador de tu GPU. Si necesita actualizarse, sigue la guía del modelo, anota la versión anterior y compara por separado.',
            'Entrega a Epic GPU, versiones de controlador y Windows, modo original, resultado de Rendimiento y resultado tras restaurar.',
            'Para un fallo de imagen de todo el PC, consulta al fabricante. Para En ejecución sin ventana, usa la guía de inicio.',
          ],
          risk: 'low',
          guideLink: {
            href: '/es/games/fortnite/running-not-opening',
            label: 'Comprobar En ejecución sin ventana',
          },
          time: 'Unos 3–5 minutos para consultar y anotar',
        },
      ],
      avoid: [
        'No combines argumentos de distintos modos de renderizado',
        'No desactives protección ni descargues DLL de sustitución',
        'No borres configuraciones o sombreadores indiscriminadamente',
      ],
      cautions: [],
      faqs: [
        {
          question: '¿Las barras negras laterales son lo mismo?',
          answer:
            'No. Epic considera normales las barras debidas a la restricción 16:9 en modos competitivos. Distínguelas de la ausencia de toda la imagen.',
        },
        {
          question: '¿Qué retiro para restaurar los ajustes?',
          answer:
            'Retira el -d3d12 -es31 añadido en esta comparación y recupera el texto y activación guardados. Conserva las opciones anteriores no relacionadas.',
        },
      ],
      related: [
        {
          href: '/es/games/fortnite/running-not-opening',
          label: 'En ejecución sin ventana',
        },
      ],
    },
  },
  relatedSlugs: ['running-not-opening'],
};
