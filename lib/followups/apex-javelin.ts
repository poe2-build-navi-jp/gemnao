import type { FollowupGuide } from './types';

export const apexJavelinGuide: FollowupGuide = {
  gameSlug: 'apex-legends',
  gameName: 'Apex Legends',
  slug: 'javelin-launch-error',
  category: 'launch',
  checkedAt: '2026-10-14',
  sources: [
    {
      url: 'https://www.ea.com/ja/games/apex-legends/apex-legends/news/javelin-anticheat-announcement',
      labels: {
        ja: 'EA：ApexのJavelin移行告知（2026年9月24日）',
        en: 'EA: Apex Javelin announcement, September 24, 2026 (Japanese)',
        zh: 'EA：Apex Javelin 公告，2026 年 9 月 24 日（日语）',
        es: 'EA: anuncio de Javelin para Apex, 24 de septiembre de 2026 (japonés)',
      },
    },
    {
      url: 'https://help.ea.com/ja/articles/platforms/pc-ea-anticheat/',
      labels: {
        ja: 'EA：Javelinのインストール・エラー別案内',
        en: 'EA: Javelin installation and error help (Japanese)',
        zh: 'EA：Javelin 安装与错误帮助（日语）',
        es: 'EA: instalación y errores de Javelin (japonés)',
      },
    },
  ],
  copy: {
    ja: {
      title: 'ApexのEA Javelin移行後に起動しない｜エラー全文から確認する手順',
      shortTitle: 'Javelin移行後の起動エラー',
      description:
        'ApexのEA Javelin起動エラーを更新失敗・非互換ソフト・ドライバー表示で切り分け。9月29日の移行とSecure Boot要件、公式インストーラーの使い分けを確認します。',
      lead: 'PC版ApexでEA Javelin Anticheatの画面が出て起動できない場合が対象です。r5apex.exeだけのエラーや試合中の切断とは入口を分けます。',
      summary:
        '2026年9月29日にPC版ApexはEACからEA Javelinへ移行しました。まず更新を完了し、ゲームを再起動してエラー全文を記録します。Apexの移行告知では現時点でSecure Bootは不要です。他ゲームの条件を流用せず、表示されたJavelinエラーに合う公式項目へ進みます。',
      quickFacts: [
        {
          label: '対象',
          value: 'PC版・Javelinと明記された起動エラー',
        },
        {
          label: '確認するもの',
          value: '全文・番号・ソフト名・利用ランチャー',
        },
        {
          label: 'Secure Boot',
          value: 'Apexの移行告知では現時点で不要',
        },
      ],
      diagnosis: [
        {
          symptom: '更新中に止まる',
          cause: '更新状況を確認',
          stepId: 'update-restart',
        },
        {
          symptom: 'ソフト名・ドライバー名・#119が出る',
          cause: '名指しされた製品を特定',
          stepId: 'named-conflict',
        },
        {
          symptom: 'インストールエラーが続く',
          cause: '公式の該当番号を確認',
          stepId: 'official-repair',
        },
      ],
      steps: [
        {
          id: 'update-restart',
          title: '更新とエラー全文を確認する',
          summary: 'EAC向けの古い手順を適用する前に表示を読みます。',
          actions: [
            'ゲーム・ランチャーの更新を完了し、Apexを終了して起動し直す。変わらなければ作業を保存してPCも再起動する。',
            '同じエラーが残る場合は全文、番号、時刻、Windowsの版、利用ランチャーを記録する。移行後という時期だけでは原因を断定しない。',
          ],
          time: '確認の目安：3〜5分',
          risk: 'low',
        },
        {
          id: 'named-conflict',
          title: '名指しされたソフト・ドライバーを確認する',
          summary: '#119などは表示された名前が次の手掛かりです。',
          actions: [
            'ソフト名やドライバー名を控え、EA公式のJavelinヘルプで該当する項目を読む。',
            '提供元と製品を確認できた場合はメーカーの正式な更新版と案内を確認する。名前が不明、セキュリティ製品、ストレージ関連なら変更せずメーカーへ相談する。',
            '更新後の再起動と起動結果を記録する。.sysの直接削除やセキュリティ無効化は行わない。',
          ],
          time: '確認の目安：3〜5分',
          risk: 'low',
        },
        {
          id: 'official-repair',
          title: '更新・インストール失敗は公式手順へ進む',
          summary:
            '公式インストーラーは該当エラーで必要とされる場合に使います。',
          actions: [
            'EA公式ヘルプの同じ番号・文面の項目を確認する。#41などを、別のエラーの対処として使い回さない。',
            '再導入が案内されている場合だけ、EAヘルプ内の公式インストーラーと対象ゲームを確認する。対象が特定できない場合は止める。「すべてをアンインストール」は選ばない。',
            '対象や手順が不明なら、実施した更新・再起動とエラー全文をEAへ伝える。修復を繰り返す前に結果を比較する。',
          ],
          time: '確認の目安：3〜5分',
          risk: 'medium',
        },
        {
          id: 'report-result',
          title: '起動結果と残る症状を分ける',
          summary: '起動エラーが消えて別の症状になったら入口を変えます。',
          actions: [
            'Javelin表示が残る場合は、全文・Windowsの版・ランチャー・更新結果をEA公式サポートへ伝える。',
            'r5apex.exeのみなら起動修復、Apex_crash.txtならクラッシュ、code:net／code:leafなら接続の記事へ進む。',
            '共有する画像・ログは個人情報を確認し、公式窓口に必要な範囲だけ送る。',
          ],
          time: '確認の目安：3〜5分',
          risk: 'low',
        },
      ],
      avoid: [
        'BF6のSecure Boot条件をApexへ流用しない',
        'EACの.sys削除、ストレージモード変更、BIOS変更を起動エラーの一律対処にしない',
        'ウイルス対策の停止や第三者配布のアンチチートを使わない',
      ],
      cautions: [
        '2026-10-14に公式資料を確認。実機での再現・解決率を示す記事ではありません。',
        '要件は更新される可能性があります。実際の表示とApexの最新公式告知を再確認してください。',
      ],
      faqs: [
        {
          question: 'Secure Bootを今すぐ有効にする必要がありますか？',
          answer:
            '移行告知ではApexについて現時点で不要とされています。異なる要求が実際に表示されたら全文をEAへ確認し、他ゲームのBIOS手順をそのまま使わないでください。',
        },
        {
          question: 'Javelinを削除すれば遊べますか？',
          answer:
            '保護を外して遊ぶための方法ではありません。再導入は公式の該当エラーで必要な場合に限り、対象を確認して行います。',
        },
      ],
      related: [
        {
          href: '/games/apex-legends/game-version-mismatch',
          label: 'ホストとのバージョン不一致：ゲーム更新の確認',
        },
        {
          href: '/games/apex-legends/r5apex-exe-launch-error',
          label: 'r5apex.exeのみの起動エラー',
        },
        {
          href: '/games/apex-legends/apex-crash-txt',
          label: 'Apex_crash.txt・クラッシュ',
        },
        {
          href: '/games/apex-legends/code-net-leaf',
          label: 'code:net・code:leafの切断',
        },
      ],
    },
    en: {
      title:
        'Apex Not Launching After the EA Javelin Switch: Check the Exact Error',
      shortTitle: 'Javelin launch errors',
      description:
        'Separate Apex Javelin update failures from named software or driver conflicts. Check the September 29 switch, Apex-specific Secure Boot guidance and official repair options.',
      lead: 'For PC Apex launches blocked by a message explicitly naming EA Javelin Anticheat. A lone r5apex.exe error or a match disconnection has a separate guide.',
      summary:
        'PC Apex moved from EAC to EA Javelin on September 29, 2026. Finish updates, restart the game and record the full error. The Apex announcement says Secure Boot is not currently required; match the message to EA’s Javelin help instead of borrowing another game’s requirements.',
      quickFacts: [
        {
          label: 'Scope',
          value: 'PC launch errors explicitly naming Javelin',
        },
        {
          label: 'Record',
          value: 'Full message, number, software name and launcher',
        },
        {
          label: 'Secure Boot',
          value: 'Not currently required in the Apex announcement',
        },
      ],
      diagnosis: [
        {
          symptom: 'Update stops',
          cause: 'Check update completion',
          stepId: 'update-restart',
        },
        {
          symptom: 'Software, driver or #119 named',
          cause: 'Identify the named product',
          stepId: 'named-conflict',
        },
        {
          symptom: 'Installation still fails',
          cause: 'Match the official error entry',
          stepId: 'official-repair',
        },
      ],
      steps: [
        {
          id: 'update-restart',
          title: 'Finish updates and capture the error',
          summary: 'Read the current message before using an old EAC guide.',
          actions: [
            'Finish game and launcher updates, then close and relaunch Apex. If unchanged, save your work and restart the PC.',
            'Record the full message, number, time, Windows version and launcher. Timing after the switch alone does not establish the cause.',
          ],
          time: 'Allow 3–5 min to check',
          risk: 'low',
        },
        {
          id: 'named-conflict',
          title: 'Identify the named software or driver',
          summary: 'A name in a message such as #119 is a useful lead.',
          actions: [
            'Record the software or driver name and find the matching entry in EA’s Javelin help.',
            'If you can identify the product and publisher, check its official update instructions. Stop and ask the vendor if the name is unknown or involves security or storage software.',
            'Record the result after an update and restart. Do not manually delete .sys files or disable security protection.',
          ],
          time: 'Allow 3–5 min to check',
          risk: 'low',
        },
        {
          id: 'official-repair',
          title: 'Use the matching official installation guidance',
          summary:
            'Use the official installer only when the relevant error calls for it.',
          actions: [
            'Match the exact number and wording in EA help. Do not apply an entry such as #41 to a different error.',
            'If reinstallation is indicated, use the installer linked from EA help and identify the target game. Stop if the target is unclear; do not select uninstall all.',
            'If unsure, give EA the full error and update/restart results. Compare results before repeating repairs.',
          ],
          time: 'Allow 3–5 min to check',
          risk: 'medium',
        },
        {
          id: 'report-result',
          title: 'Separate the remaining symptom',
          summary: 'Choose a different guide if the launch block has changed.',
          actions: [
            'For a remaining Javelin message, send EA support the error, Windows version, launcher and update results.',
            'Use the r5apex.exe guide for that error alone, the Apex_crash.txt guide for crashes, or code:net/code:leaf for disconnections.',
            'Check screenshots and logs for personal information and share only what the official support channel needs.',
          ],
          time: 'Allow 3–5 min to check',
          risk: 'low',
        },
      ],
      avoid: [
        'Do not transfer BF6 Secure Boot requirements to Apex.',
        'Do not routinely delete EAC .sys files, change storage mode or edit BIOS settings.',
        'Do not disable antivirus or download anticheat installers from third parties.',
      ],
      cautions: [
        'Official sources checked on 2026-10-14; no in-game reproduction or success-rate claim.',
        'Requirements can change. Recheck the actual message and the latest Apex announcement.',
      ],
      faqs: [
        {
          question: 'Should I enable Secure Boot immediately?',
          answer:
            'The Apex announcement says it is not currently required. If the game shows a different demand, ask EA about the full message before borrowing another game’s BIOS instructions.',
        },
        {
          question: 'Can I remove Javelin to play?',
          answer:
            'Removing protection is not a way to play. Reinstallation is only a repair option when the matching official entry calls for it and the target is clear.',
        },
      ],
      related: [
        {
          href: '/en/games/apex-legends/game-version-mismatch',
          label: 'Game version does not match host: update checks',
        },
        {
          href: '/en/games/apex-legends/r5apex-exe-launch-error',
          label: 'r5apex.exe launch errors',
        },
        {
          href: '/en/games/apex-legends/apex-crash-txt',
          label: 'Apex_crash.txt and crashes',
        },
        {
          href: '/en/games/apex-legends/code-net-leaf',
          label: 'code:net and code:leaf disconnections',
        },
      ],
    },
    zh: {
      title: 'Apex 转用 EA Javelin 后无法启动：按完整错误提示排查',
      shortTitle: 'Javelin 启动错误',
      description:
        '区分 Apex Javelin 更新失败、软件冲突和驱动程序提示。核对 9 月 29 日切换、安全启动要求及官方安装程序的适用情况。',
      lead: '适用于 PC 版 Apex 启动时明确显示 EA Javelin Anticheat 的情况。仅有 r5apex.exe 错误或对局断线请使用对应文章。',
      summary:
        'PC 版 Apex 于 2026 年 9 月 29 日从 EAC 转用 EA Javelin。先完成更新、重启游戏并记录完整错误。Apex 公告说明目前不要求安全启动；应按实际提示查阅 EA 帮助，不套用其他游戏的要求。',
      quickFacts: [
        {
          label: '适用范围',
          value: '明确提到 Javelin 的 PC 启动错误',
        },
        {
          label: '先记录',
          value: '完整提示、编号、软件名称及启动器',
        },
        {
          label: '安全启动',
          value: 'Apex 切换公告称目前不要求',
        },
      ],
      diagnosis: [
        {
          symptom: '更新停住',
          cause: '检查更新是否完成',
          stepId: 'update-restart',
        },
        {
          symptom: '显示软件、驱动名称或 #119',
          cause: '识别提示中的产品',
          stepId: 'named-conflict',
        },
        {
          symptom: '安装仍失败',
          cause: '核对官方对应错误',
          stepId: 'official-repair',
        },
      ],
      steps: [
        {
          id: 'update-restart',
          title: '完成更新并记录错误',
          summary: '先读当前提示，再判断旧 EAC 方法是否适用。',
          actions: [
            '完成游戏和启动器更新后关闭并重新启动 Apex。无变化时保存工作并重启电脑。',
            '记录完整提示、编号、时间、Windows 版本及启动器。不能仅凭发生在切换后就断定原因。',
          ],
          time: '检查约需 3–5 分钟',
          risk: 'low',
        },
        {
          id: 'named-conflict',
          title: '核对软件或驱动程序名称',
          summary: '例如 #119 中的名称是排查线索。',
          actions: [
            '记录软件或驱动名称，在 EA Javelin 官方帮助中查找相应条目。',
            '确认产品及发布者后，查看厂商正式更新说明。名称不明或涉及安全、存储软件时，先咨询厂商，不自行更改。',
            '更新并重启后记录结果。不直接删除 .sys 文件，不关闭安全保护。',
          ],
          time: '检查约需 3–5 分钟',
          risk: 'low',
        },
        {
          id: 'official-repair',
          title: '按对应错误查阅安装修复说明',
          summary: '仅在对应错误要求时使用官方安装程序。',
          actions: [
            '逐字核对 EA 帮助中的编号与提示，不将 #41 等条目套用到其他错误。',
            '如官方要求重新安装，通过 EA 帮助中的安装程序链接确认目标游戏。目标不明就停止，不选择卸载全部。',
            '步骤或对象不明时，将完整提示及更新、重启结果交给 EA；重复修复前先比较结果。',
          ],
          time: '检查约需 3–5 分钟',
          risk: 'medium',
        },
        {
          id: 'report-result',
          title: '按剩余症状选择下一步',
          summary: '启动恢复后出现另一种问题时应更换入口。',
          actions: [
            '仍显示 Javelin 错误时，向 EA 官方支持提供完整提示、Windows 版本、启动器及更新结果。',
            '仅有 r5apex.exe 提示看启动修复；Apex_crash.txt 看崩溃；code:net／code:leaf 看连接文章。',
            '检查截图和日志中的个人信息，只向官方支持提供必要内容。',
          ],
          time: '检查约需 3–5 分钟',
          risk: 'low',
        },
      ],
      avoid: [
        '不把 BF6 的安全启动要求套用到 Apex。',
        '不把删除 EAC .sys、切换存储模式或修改 BIOS 作为通用修复。',
        '不关闭杀毒保护，不使用第三方反作弊安装程序。',
      ],
      cautions: [
        '官方资料核对日期：2026-10-14；本文不声称已在实机复现或验证成功率。',
        '要求可能更新；以实际提示及 Apex 最新公告再次核对。',
      ],
      faqs: [
        {
          question: '现在就需要开启安全启动吗？',
          answer:
            'Apex 切换公告说明目前不要求。如果游戏出现不同要求，先将完整提示交给 EA 确认，不直接照搬其他游戏的 BIOS 步骤。',
        },
        {
          question: '删除 Javelin 就能玩吗？',
          answer:
            '不能通过移除保护来继续游戏。只有对应官方错误条目要求且目标明确时，才考虑重新安装。',
        },
      ],
      related: [
        {
          href: '/zh/games/apex-legends/game-version-mismatch',
          label: '与主机版本不匹配：检查更新',
        },
        {
          href: '/zh/games/apex-legends/r5apex-exe-launch-error',
          label: 'r5apex.exe 启动错误',
        },
        {
          href: '/zh/games/apex-legends/apex-crash-txt',
          label: 'Apex_crash.txt 与崩溃',
        },
        {
          href: '/zh/games/apex-legends/code-net-leaf',
          label: 'code:net 与 code:leaf 断线',
        },
      ],
    },
    es: {
      title:
        'Apex no inicia tras el cambio a EA Javelin: comprueba el error exacto',
      shortTitle: 'Errores de inicio de Javelin',
      description:
        'Distingue fallos de actualización de Apex Javelin y conflictos con software o controladores. Revisa el cambio del 29 de septiembre, el arranque seguro y la reparación oficial.',
      lead: 'Para Apex en PC cuando el mensaje de inicio menciona EA Javelin Anticheat. Un error solo de r5apex.exe o una desconexión tienen guías específicas.',
      summary:
        'Apex en PC pasó de EAC a EA Javelin el 29 de septiembre de 2026. Completa las actualizaciones, reinicia el juego y anota el error completo. El anuncio de Apex indica que actualmente no exige arranque seguro; busca el mensaje en la ayuda de EA sin trasladar requisitos de otro juego.',
      quickFacts: [
        {
          label: 'Ámbito',
          value: 'Errores de inicio en PC que mencionan Javelin',
        },
        {
          label: 'Anota',
          value: 'Mensaje completo, número, software y lanzador',
        },
        {
          label: 'Arranque seguro',
          value: 'El anuncio de Apex no lo exige actualmente',
        },
      ],
      diagnosis: [
        {
          symptom: 'Se detiene la actualización',
          cause: 'Comprueba si ha terminado',
          stepId: 'update-restart',
        },
        {
          symptom: 'Aparece software, controlador o #119',
          cause: 'Identifica el producto indicado',
          stepId: 'named-conflict',
        },
        {
          symptom: 'La instalación sigue fallando',
          cause: 'Busca el error oficial correspondiente',
          stepId: 'official-repair',
        },
      ],
      steps: [
        {
          id: 'update-restart',
          title: 'Completa las actualizaciones y anota el error',
          summary:
            'Lee el mensaje actual antes de usar una guía antigua de EAC.',
          actions: [
            'Completa las actualizaciones del juego y del lanzador; cierra y vuelve a abrir Apex. Si no cambia, guarda tu trabajo y reinicia el PC.',
            'Anota el mensaje completo, número, hora, versión de Windows y lanzador. Que ocurra tras el cambio no demuestra la causa.',
          ],
          time: 'Comprobación: unos 3–5 min',
          risk: 'low',
        },
        {
          id: 'named-conflict',
          title: 'Identifica el software o controlador indicado',
          summary:
            'El nombre en un mensaje como #119 ayuda a elegir la comprobación.',
          actions: [
            'Anota el nombre y busca la entrada correspondiente en la ayuda oficial de Javelin.',
            'Si identificas el producto y su editor, consulta sus actualizaciones oficiales. Si no lo reconoces o pertenece a seguridad o almacenamiento, consulta al fabricante antes de cambiarlo.',
            'Registra el resultado tras actualizar y reiniciar. No borres archivos .sys manualmente ni desactives la protección.',
          ],
          time: 'Comprobación: unos 3–5 min',
          risk: 'low',
        },
        {
          id: 'official-repair',
          title: 'Consulta la reparación del error concreto',
          summary:
            'Usa el instalador oficial solo cuando la entrada correspondiente lo indique.',
          actions: [
            'Comprueba el número y texto exactos en EA. No apliques instrucciones como las de #41 a otro error.',
            'Si se indica reinstalar, usa el enlace del instalador en la ayuda de EA e identifica el juego. Detente si no está claro; no elijas desinstalar todo.',
            'Si tienes dudas, comunica a EA el error y los resultados de actualizar y reiniciar. Compara antes de repetir reparaciones.',
          ],
          time: 'Comprobación: unos 3–5 min',
          risk: 'medium',
        },
        {
          id: 'report-result',
          title: 'Distingue el síntoma que queda',
          summary:
            'Cambia de guía si el bloqueo de inicio se convierte en otro problema.',
          actions: [
            'Si sigue apareciendo Javelin, facilita al soporte de EA el mensaje, Windows, lanzador y resultados de actualización.',
            'Para r5apex.exe sin Javelin, consulta su guía; para Apex_crash.txt, la de cierres; para code:net/code:leaf, la de conexión.',
            'Revisa los datos personales de capturas y registros y comparte solo lo necesario con el soporte oficial.',
          ],
          time: 'Comprobación: unos 3–5 min',
          risk: 'low',
        },
      ],
      avoid: [
        'No traslades los requisitos de arranque seguro de BF6 a Apex.',
        'No borres archivos .sys de EAC ni cambies el modo de almacenamiento o la BIOS como solución general.',
        'No desactives el antivirus ni descargues instaladores antitrampas de terceros.',
      ],
      cautions: [
        'Fuentes oficiales consultadas el 2026-10-14; no se afirma reproducción en un PC de juego ni tasa de éxito.',
        'Los requisitos pueden cambiar. Revisa el mensaje real y el anuncio más reciente de Apex.',
      ],
      faqs: [
        {
          question: '¿Debo activar ya el arranque seguro?',
          answer:
            'El anuncio de Apex indica que actualmente no es necesario. Si aparece otra exigencia, consulta a EA con el mensaje completo antes de seguir instrucciones de BIOS de otro juego.',
        },
        {
          question: '¿Puedo quitar Javelin para jugar?',
          answer:
            'Quitar la protección no permite jugar. Reinstalar solo es una opción cuando lo indica la entrada oficial del error y has identificado el juego.',
        },
      ],
      related: [
        {
          href: '/es/games/apex-legends/game-version-mismatch',
          label: 'Versión incompatible con el anfitrión: actualizaciones',
        },
        {
          href: '/es/games/apex-legends/r5apex-exe-launch-error',
          label: 'Errores de inicio r5apex.exe',
        },
        {
          href: '/es/games/apex-legends/apex-crash-txt',
          label: 'Apex_crash.txt y cierres',
        },
        {
          href: '/es/games/apex-legends/code-net-leaf',
          label: 'Desconexiones code:net y code:leaf',
        },
      ],
    },
  },
  relatedSlugs: [
    'game-version-mismatch',
    'r5apex-exe-launch-error',
    'apex-crash-txt',
    'code-net-leaf',
  ],
};
