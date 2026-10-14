import type { FollowupGuide } from './types';

export const overwatchRenderingGuide: FollowupGuide = {
  gameSlug: 'overwatch-2',
  gameName: 'Overwatch 2',
  slug: 'rendering-device-lost',
  category: 'launch',
  checkedAt: '2026-10-14',
  sources: [
    {
      url: 'https://us.forums.blizzard.com/en/overwatch/t/your-rendering-device-has-been-lost-application-closing/813964',
      labels: {
        ja: 'Blizzard公式フォーラム：Jambrixの回答（2023-05-04・英語）',
        en: 'Blizzard forum: Jambrix support reply (May 4, 2023)',
        zh: 'Blizzard 官方论坛：Jambrix 支持回复（2023-05-04，英语）',
        es: 'Foro de Blizzard: respuesta de Jambrix (4 de mayo de 2023, inglés)',
      },
    },
    {
      url: 'https://www.nvidia.com/ja-jp/drivers/',
      labels: {
        ja: 'NVIDIA：製品・OS別の公式ドライバー',
        en: 'NVIDIA: official driver selection (Japanese)',
        zh: 'NVIDIA：官方驱动选择（日语）',
        es: 'NVIDIA: selección oficial de controladores (japonés)',
      },
    },
    {
      url: 'https://www.amd.com/en/resources/support-articles/faqs/DH3-016.html',
      labels: {
        ja: 'AMD：GPU情報・ソフトウェア更新（英語）',
        en: 'AMD: graphics information and software updates',
        zh: 'AMD：显卡信息与软件更新（英语）',
        es: 'AMD: información gráfica y actualizaciones (inglés)',
      },
    },
  ],
  copy: {
    ja: {
      title:
        'OW2「レンダリングデバイスが失われました」で落ちる｜原因を絞る確認順',
      shortTitle: 'レンダリングデバイスが失われました',
      description:
        'OW2のRendering device lostをGPU故障と決めつけず、発生場面、GPU・ドライバー版、更新前後の違いで切り分け。TDR変更を使わず相談に必要な記録を揃えます。',
      lead: 'PC版Overwatch 2（OW2）で「レンダリングデバイスが失われました」や「Your rendering device has been lost」と表示され終了する場合向けです。',
      summary:
        'Blizzardのサポート回答は、GPUの停止・クラッシュに関わり、ドライバーやハードウェアなど複数の原因があり得ると説明しています。故障と即断せず、まず発生場面とGPU・ドライバー版を記録し、メーカーの正式な更新を一つずつ比較します。画面全体の異常やPC再起動を伴う場合はゲームだけの問題として繰り返し試さないでください。',
      quickFacts: [
        {
          label: '最初に記録',
          value: '全文・場面・GPU型番・ドライバー版',
        },
        {
          label: '切り分け',
          value: 'ゲームだけ終了／Windows画面も異常',
        },
        {
          label: '避ける対処',
          value: 'TDRレジストリ変更・保護機能の無効化',
        },
      ],
      diagnosis: [
        {
          symptom: 'ゲームだけ落ちてWindowsは動く',
          cause: '変更前の条件を記録',
          stepId: 'record-rendering',
        },
        {
          symptom: 'ドライバー更新後から起きる',
          cause: '版と時期をメーカーへ確認',
          stepId: 'check-driver',
        },
        {
          symptom: '画面全体の乱れ・PC再起動',
          cause: '反復テストを止めて機器側の相談',
          stepId: 'escalate-rendering',
        },
      ],
      steps: [
        {
          id: 'record-rendering',
          title: '終了時の表示と発生場面を控える',
          summary:
            'エラー名だけではGPU故障や特定バージョンの不具合は確定しません。',
          actions: [
            '全文、時刻、メニュー・練習場・試合中のどこで起きたか、ゲームだけ終了したかを記録する。Windowsが動くなら作業を保存してPCを再起動し、一度結果を比較する。',
            'GPU型番、ドライバー版、Windowsの版と直前の変更を控える。同じGPUの体験談を自分の原因の証拠にしない。',
          ],
          time: '確認の目安：3〜5分',
          risk: 'low',
        },
        {
          id: 'check-driver',
          title: '機種に合う正式なドライバーを確認する',
          summary: '更新前の版を控えてから、一つの変更として試します。',
          actions: [
            'ノートPC・メーカーPCは機種別サポート、その他はGPUメーカーの正式な入手先で対応GPUとOSを確認する。NVIDIA／AMDの出典と下の共通ガイドを参照する。',
            '公式更新を行った場合は再起動し、同じ条件で比較する。更新直後から悪化した場合は新旧バージョンと症状をメーカーへ伝え、復帰方法を確認する。非公式ドライバーや一括更新ツールは使わない。',
          ],
          time: '確認の目安：3〜5分',
          risk: 'medium',
          guideLink: {
            href: '/guide/gpu-driver-update',
            label: 'GPUドライバーを安全に更新する',
          },
        },
        {
          id: 'compare-one-change',
          title: '同じ条件で結果を比較する',
          summary: 'ドライバー以外の変更を同時に重ねません。',
          actions: [
            '一度の比較でゲームが開くか、同じ場面で同じ全文になるかを記録する。ゲームだけ落ちる状態が続けば共通クラッシュ記事で症状を整理する。',
            'オーバークロック等を自分で変更していた場合は元の設定を記録し、メーカーの標準設定への戻し方を確認する。電圧やBIOSの値を推測して変更しない。',
          ],
          time: '確認の目安：3〜5分',
          risk: 'low',
          guideLink: {
            href: '/guide/pc-game-crash',
            label: 'PCゲームが落ちる場合の切り分け',
          },
        },
        {
          id: 'escalate-rendering',
          title: '画面全体の異常とゲーム単体の終了を分けて相談する',
          summary: '繰り返し落ちる状態で長時間の負荷テストを続けません。',
          actions: [
            '画面全体の乱れ、異常な発熱、PC再起動を伴う場合はテストを止め、PC／GPUメーカーへ症状を伝える。ゲーム単体ならBlizzardへ全文と比較結果を伝える。',
            'GPU・ドライバー・Windowsの版、発生場面、変更前後、再起動結果をまとめる。ログは公式窓口から求められたものだけ、個人情報を確認して共有する。',
          ],
          time: '確認の目安：3〜5分',
          risk: 'low',
          guideLink: {
            href: '/guide/black-screen',
            label: '画面が黒い場合の確認',
          },
        },
      ],
      avoid: [
        'TdrDelay・TdrLevelなどのレジストリ変更を解決策として使わない',
        'ウイルス対策やWindows保護機能を恒久的に無効にしない',
        'エラー名だけでGPU交換や特定ドライバーの原因断定をしない',
      ],
      cautions: [
        '出典確認日：2026-10-14。実機再現・解決率の主張はありません。',
        'Blizzardの専用記事32553は今回取得できませんでした。ここでは確認できた2023年のサポート回答とメーカー資料を使い、2026年の個人投稿を大規模障害の証拠にしていません。',
      ],
      faqs: [
        {
          question: '新しいGPUでも出るならゲームだけが原因ですか？',
          answer:
            '新旧だけでは決まりません。公式回答も複数の原因を挙げています。ゲームだけ終了するか、Windowsや他の用途でも異常があるかを相談材料にします。',
        },
        {
          question: 'TDRの待ち時間を延ばせば直りますか？',
          answer:
            'このガイドでは推奨しません。原因が判別できないまま待ち時間を変えるより、版と発生場面、公式更新後の結果を記録して相談します。',
        },
      ],
      related: [
        {
          href: '/guide/gpu-driver-update',
          label: 'GPUドライバーを安全に更新する',
        },
        {
          href: '/guide/pc-game-crash',
          label: 'PCゲームが落ちる場合の切り分け',
        },
        {
          href: '/guide/black-screen',
          label: '画面が黒い場合の確認',
        },
      ],
    },
    en: {
      title: 'OW2 “Your Rendering Device Has Been Lost”: Narrow Down the Crash',
      shortTitle: 'Rendering device lost',
      description:
        'Separate an OW2 rendering-device error from a confirmed GPU fault. Record the scene and driver version, compare official updates and avoid TDR registry workarounds.',
      lead: 'For Overwatch 2 on PC closing with “Your rendering device has been lost” or an equivalent localized message.',
      summary:
        'Blizzard’s support reply describes a GPU hang or crash with multiple possible causes, including drivers and hardware. Record the scene, GPU and driver version before comparing an official vendor update. If the entire display fails or the PC restarts, stop treating it as a game-only crash.',
      quickFacts: [
        {
          label: 'Record first',
          value: 'Message, scene, GPU model and driver version',
        },
        {
          label: 'Distinguish',
          value: 'Game closes versus Windows/display failure',
        },
        {
          label: 'Avoid',
          value: 'TDR registry edits and disabled protection',
        },
      ],
      diagnosis: [
        {
          symptom: 'Only the game closes',
          cause: 'Record the starting conditions',
          stepId: 'record-rendering',
        },
        {
          symptom: 'Started after a driver update',
          cause: 'Check versions and timing with the vendor',
          stepId: 'check-driver',
        },
        {
          symptom: 'Display corruption or PC reboot',
          cause: 'Stop repeated tests and contact hardware support',
          stepId: 'escalate-rendering',
        },
      ],
      steps: [
        {
          id: 'record-rendering',
          title: 'Record the message and scene',
          summary:
            'The error alone does not confirm hardware failure or a specific faulty release.',
          actions: [
            'Note the full message, time and whether it happens in menus, practice or a match. If Windows remains usable, save your work, restart the PC and compare once.',
            'Record GPU model, driver version, Windows version and recent changes. Another person’s report about the same GPU is not proof of your cause.',
          ],
          time: 'Allow 3–5 min to check',
          risk: 'low',
        },
        {
          id: 'check-driver',
          title: 'Check an official driver for the exact device',
          summary: 'Record the old version and test one change at a time.',
          actions: [
            'For laptops or OEM systems, check the model’s support page; otherwise use the GPU manufacturer’s official driver source. Confirm GPU and OS compatibility with the NVIDIA/AMD references and the linked guide.',
            'After an official update, restart and compare under the same conditions. If it began immediately after updating, give the vendor the old/new versions and ask about a supported recovery procedure. Avoid unofficial drivers and bulk updater utilities.',
          ],
          time: 'Allow 3–5 min to check',
          risk: 'medium',
          guideLink: {
            href: '/guide/gpu-driver-update',
            label: 'GPU driver updates (Japanese)',
          },
        },
        {
          id: 'compare-one-change',
          title: 'Compare under the same conditions',
          summary: 'Do not combine driver changes with unrelated adjustments.',
          actions: [
            'Record whether the game opens and whether the same scene produces the same message. If only the game keeps closing, use the general crash guide to organize the symptoms.',
            'If you personally changed overclocking settings, record them and consult the vendor’s method for restoring defaults. Do not guess voltages or BIOS values.',
          ],
          time: 'Allow 3–5 min to check',
          risk: 'low',
          guideLink: {
            href: '/en/guide/pc-game-crash',
            label: 'PC game crash checks',
          },
        },
        {
          id: 'escalate-rendering',
          title: 'Separate display failure from a game-only crash',
          summary:
            'Do not keep running lengthy stress tests while it repeatedly fails.',
          actions: [
            'Stop testing for display corruption, abnormal heat or PC reboots and contact the PC/GPU vendor. For a game-only crash, give Blizzard the full message and comparison results.',
            'Include GPU, driver, Windows version, scene, changes and restart results. Share requested logs only through official support after checking personal information.',
          ],
          time: 'Allow 3–5 min to check',
          risk: 'low',
          guideLink: {
            href: '/guide/black-screen',
            label: 'Black-screen checks (Japanese)',
          },
        },
      ],
      avoid: [
        'Do not use TdrDelay or TdrLevel registry changes as a fix.',
        'Do not permanently disable antivirus or Windows protection.',
        'Do not infer a need for a new GPU or a specific faulty driver from the message alone.',
      ],
      cautions: [
        'Sources checked on 2026-10-14; no hands-on reproduction or success rate is claimed.',
        'Blizzard article 32553 could not be retrieved. This guide uses the accessible 2023 support reply and vendor documentation; a 2026 user post is not evidence of a widespread incident.',
      ],
      faqs: [
        {
          question: 'Does a new GPU prove the game is the only cause?',
          answer:
            'No. The support reply lists multiple possibilities. Record whether Windows or other uses are affected, rather than inferring a cause from the GPU’s age.',
        },
        {
          question: 'Will increasing the TDR timeout fix it?',
          answer:
            'This guide does not recommend that. Record versions, the scene and official-update results for support instead of changing the timeout without identifying the cause.',
        },
      ],
      related: [
        {
          href: '/guide/gpu-driver-update',
          label: 'GPU driver updates (Japanese)',
        },
        {
          href: '/en/guide/pc-game-crash',
          label: 'PC game crash checks',
        },
        {
          href: '/guide/black-screen',
          label: 'Black-screen checks (Japanese)',
        },
      ],
    },
    zh: {
      title: 'OW2「渲染设备已丢失」：逐步排查崩溃原因',
      shortTitle: '渲染设备已丢失',
      description:
        '区分 OW2 渲染设备错误与显卡故障。记录场景、GPU 和驱动版本，逐项比较官方更新结果，不使用 TDR 注册表修改。',
      lead: '适用于 PC 版 Overwatch 2（OW2）显示 Your rendering device has been lost 或对应语言提示后退出。',
      summary:
        'Blizzard 支持回复将其解释为 GPU 挂起或崩溃，可能涉及驱动或硬件等多种原因。先记录场景、GPU 和驱动版本，再逐项比较厂商正式更新结果。若整个屏幕异常或电脑重启，停止按游戏单独崩溃反复测试。',
      quickFacts: [
        {
          label: '先记录',
          value: '全文、场景、GPU 型号与驱动版本',
        },
        {
          label: '区分',
          value: '游戏退出／Windows 或整个画面异常',
        },
        {
          label: '避免',
          value: '修改 TDR 注册表或关闭安全保护',
        },
      ],
      diagnosis: [
        {
          symptom: '只有游戏退出',
          cause: '记录初始条件',
          stepId: 'record-rendering',
        },
        {
          symptom: '更新驱动后开始',
          cause: '向厂商核对版本与时间',
          stepId: 'check-driver',
        },
        {
          symptom: '花屏或电脑重启',
          cause: '停止反复测试并咨询硬件支持',
          stepId: 'escalate-rendering',
        },
      ],
      steps: [
        {
          id: 'record-rendering',
          title: '记录提示和发生场景',
          summary: '错误名称不能直接证明硬件损坏或某版驱动有问题。',
          actions: [
            '记录全文、时间、菜单／训练／对局场景及是否仅游戏退出。Windows 仍可用时保存工作，重启电脑后比较一次。',
            '记录 GPU 型号、驱动、Windows 版本和最近改动。同型号用户的经历不能证明自己的原因。',
          ],
          time: '检查约需 3–5 分钟',
          risk: 'low',
        },
        {
          id: 'check-driver',
          title: '查找适合设备的官方驱动',
          summary: '先记录旧版，再一次只改一项。',
          actions: [
            '笔记本或品牌整机先看对应机型支持，其他情况使用 GPU 厂商正式入口。结合 NVIDIA／AMD 来源和下方指南核对 GPU 与 OS。',
            '官方更新后重启并按相同条件比较。若更新后立即恶化，向厂商提供新旧版本并咨询支持的恢复方式。不使用第三方驱动或批量更新工具。',
          ],
          time: '检查约需 3–5 分钟',
          risk: 'medium',
          guideLink: {
            href: '/guide/gpu-driver-update',
            label: '安全更新显卡驱动（日语）',
          },
        },
        {
          id: 'compare-one-change',
          title: '在相同条件下比较结果',
          summary: '不同时叠加其他设置改动。',
          actions: [
            '记录游戏能否打开、同一场景是否仍报同一错误。若仅游戏持续退出，通过共通崩溃指南整理症状。',
            '若曾自行超频，记录设置并向厂商确认恢复默认的方法。不猜测或试改电压、BIOS 数值。',
          ],
          time: '检查约需 3–5 分钟',
          risk: 'low',
          guideLink: {
            href: '/guide/pc-game-crash',
            label: 'PC 游戏崩溃检查（日语）',
          },
        },
        {
          id: 'escalate-rendering',
          title: '区分全屏异常与游戏单独退出',
          summary: '反复失败时不继续长时间压力测试。',
          actions: [
            '伴随花屏、异常发热或电脑重启时停止测试，咨询 PC／GPU 厂商。仅游戏退出则向 Blizzard 提供全文和比较结果。',
            '汇总 GPU、驱动、Windows 版本、场景、改动和重启结果。仅通过官方支持提供所需日志，并先检查个人信息。',
          ],
          time: '检查约需 3–5 分钟',
          risk: 'low',
          guideLink: {
            href: '/guide/black-screen',
            label: '黑屏检查（日语）',
          },
        },
      ],
      avoid: [
        '不把 TdrDelay 或 TdrLevel 注册表修改当作修复。',
        '不永久关闭杀毒或 Windows 保护。',
        '不单凭错误名称断言需要换显卡或某驱动是原因。',
      ],
      cautions: [
        '资料核对日期：2026-10-14；不声称实机复现或成功率。',
        '本次无法读取 Blizzard 32553。依据可读取的2023年支持回复与厂商资料，不把2026年个人帖子当大规模故障证据。',
      ],
      faqs: [
        {
          question: '新显卡也报错就一定是游戏的问题吗？',
          answer:
            '不是。官方回复列出多种可能性。应记录 Windows 或其他用途是否也异常，而非按显卡新旧推断。',
        },
        {
          question: '延长 TDR 超时能修好吗？',
          answer:
            '本文不推荐。先记录版本、场景和官方更新后的结果，再向支持咨询，不在原因未明时修改超时。',
        },
      ],
      related: [
        {
          href: '/guide/gpu-driver-update',
          label: '安全更新显卡驱动（日语）',
        },
        {
          href: '/guide/pc-game-crash',
          label: 'PC 游戏崩溃检查（日语）',
        },
        {
          href: '/guide/black-screen',
          label: '黑屏检查（日语）',
        },
      ],
    },
    es: {
      title:
        'OW2: se ha perdido el dispositivo de renderizado, cómo acotar el fallo',
      shortTitle: 'Dispositivo de renderizado perdido',
      description:
        'Distingue un error de renderizado de OW2 de una avería confirmada. Anota escena, GPU y controlador; compara actualizaciones oficiales sin modificar TDR.',
      lead: 'Para Overwatch 2 en PC que se cierra con Your rendering device has been lost o su traducción.',
      summary:
        'La respuesta de soporte de Blizzard describe un bloqueo o fallo de la GPU con varias causas posibles, incluidos controladores y hardware. Anota escena, GPU y versión antes de comparar una actualización oficial. Si falla toda la pantalla o se reinicia el PC, deja de tratarlo como un cierre exclusivo del juego.',
      quickFacts: [
        {
          label: 'Anota primero',
          value: 'Mensaje, escena, GPU y versión del controlador',
        },
        {
          label: 'Distingue',
          value: 'Cierre del juego frente a fallo de Windows/pantalla',
        },
        {
          label: 'Evita',
          value: 'Cambios del registro TDR y desactivar protección',
        },
      ],
      diagnosis: [
        {
          symptom: 'Solo se cierra el juego',
          cause: 'Anota las condiciones iniciales',
          stepId: 'record-rendering',
        },
        {
          symptom: 'Comenzó tras actualizar el controlador',
          cause: 'Consulta versiones y fechas al fabricante',
          stepId: 'check-driver',
        },
        {
          symptom: 'Imagen corrupta o reinicio del PC',
          cause: 'Detén pruebas repetidas y consulta al fabricante',
          stepId: 'escalate-rendering',
        },
      ],
      steps: [
        {
          id: 'record-rendering',
          title: 'Anota el mensaje y la escena',
          summary:
            'El mensaje no confirma una avería o una versión defectuosa.',
          actions: [
            'Anota texto completo, hora y si ocurre en menú, práctica o partida. Si Windows responde, guarda tu trabajo, reinicia el PC y compara una vez.',
            'Anota GPU, controlador, Windows y cambios recientes. Un relato de otra persona con la misma GPU no demuestra tu causa.',
          ],
          time: 'Comprobación: unos 3–5 min',
          risk: 'low',
        },
        {
          id: 'check-driver',
          title: 'Comprueba el controlador oficial del dispositivo',
          summary: 'Anota la versión anterior y prueba un cambio cada vez.',
          actions: [
            'En portátiles o equipos de marca, consulta el soporte del modelo; en otros casos, la fuente oficial del fabricante de GPU. Confirma GPU y sistema con las referencias NVIDIA/AMD y la guía enlazada.',
            'Tras actualizar oficialmente, reinicia y compara en las mismas condiciones. Si empeoró justo después, comunica versiones anterior/nueva y consulta cómo recuperarlo de forma compatible. Evita controladores no oficiales y actualizadores masivos.',
          ],
          time: 'Comprobación: unos 3–5 min',
          risk: 'medium',
          guideLink: {
            href: '/guide/gpu-driver-update',
            label: 'Actualizar el controlador GPU (japonés)',
          },
        },
        {
          id: 'compare-one-change',
          title: 'Compara en las mismas condiciones',
          summary: 'No combines controladores con cambios ajenos.',
          actions: [
            'Anota si abre el juego y si la misma escena produce el mismo mensaje. Si solo se cierra el juego, organiza los síntomas con la guía general de cierres.',
            'Si modificaste overclocking, registra los ajustes y consulta cómo restaurar los valores predeterminados según el fabricante. No adivines voltajes o valores de BIOS.',
          ],
          time: 'Comprobación: unos 3–5 min',
          risk: 'low',
          guideLink: {
            href: '/guide/pc-game-crash',
            label: 'Comprobar cierres del juego (japonés)',
          },
        },
        {
          id: 'escalate-rendering',
          title: 'Separa fallo de pantalla y cierre del juego',
          summary: 'No prolongues pruebas de carga con fallos repetidos.',
          actions: [
            'Si hay imagen corrupta, calor anormal o reinicios, detén las pruebas y consulta al fabricante del PC/GPU. Si solo falla el juego, facilita a Blizzard el mensaje y los resultados.',
            'Incluye GPU, controlador, Windows, escena, cambios y reinicios. Comparte solo los registros solicitados por soporte oficial, tras revisar datos personales.',
          ],
          time: 'Comprobación: unos 3–5 min',
          risk: 'low',
          guideLink: {
            href: '/guide/black-screen',
            label: 'Comprobar pantalla negra (japonés)',
          },
        },
      ],
      avoid: [
        'No uses cambios de registro TdrDelay o TdrLevel como solución.',
        'No desactives permanentemente antivirus o protección de Windows.',
        'No deduzcas que necesitas otra GPU o que un controlador concreto es culpable solo por el mensaje.',
      ],
      cautions: [
        'Fuentes consultadas el 2026-10-14; sin afirmaciones de reproducción práctica ni tasa de éxito.',
        'No se pudo consultar el artículo 32553. Se usa la respuesta de soporte de 2023 accesible y documentación de fabricantes; una publicación individual de 2026 no demuestra un incidente generalizado.',
      ],
      faqs: [
        {
          question: '¿Una GPU nueva demuestra que solo falla el juego?',
          answer:
            'No. El soporte enumera varias posibilidades. Anota si afecta a Windows u otros usos en vez de inferirlo por la antigüedad de la GPU.',
        },
        {
          question: '¿Aumentar el tiempo de espera TDR lo arregla?',
          answer:
            'Esta guía no lo recomienda. Anota versiones, escena y resultados de actualizaciones oficiales para soporte antes de cambiar tiempos sin identificar la causa.',
        },
      ],
      related: [
        {
          href: '/guide/gpu-driver-update',
          label: 'Actualizar el controlador GPU (japonés)',
        },
        {
          href: '/guide/pc-game-crash',
          label: 'Comprobar cierres del juego (japonés)',
        },
        {
          href: '/guide/black-screen',
          label: 'Comprobar pantalla negra (japonés)',
        },
      ],
    },
  },
  relatedSlugs: [],
};
