import type { FollowupGuide } from './types';

export const pubgAnticheatGuide: FollowupGuide = {
  gameSlug: 'pubg',
  gameName: 'PUBG: BATTLEGROUNDS',
  slug: 'anti-cheat-conflict-warning',
  category: 'launch',
  checkedAt: '2026-10-14',
  sources: [
    {
      url: 'https://www.pubg.com/ja/news/9001',
      labels: {
        ja: 'PUBG：新アンチチート導入レター（2025-08-11・37.1）',
        en: 'PUBG: anti-cheat introduction letter (August 11, 2025; 37.1; Japanese)',
        zh: 'PUBG：反作弊引入说明（2025-08-11、37.1，日语）',
        es: 'PUBG: carta de introducción antitrampas (11 de agosto de 2025; 37.1; japonés)',
      },
    },
  ],
  copy: {
    ja: {
      title: 'PUBGのアンチチート競合警告・ロビーに入れない時の確認手順',
      shortTitle: 'アンチチート競合警告・ロビー',
      description:
        'PUBGのアンチチート競合警告は全文と同時起動中のゲームを確認。37.1導入時の公式範囲を踏まえ、ゲームを一つにして比較し、別のロビー障害と分けます。',
      lead: 'ロビー入室時にアンチチートや別のセキュリティソフトとの競合を示す警告が出るPC向けです。警告なしの接続失敗や利用制限は同じ原因と扱いません。',
      summary:
        'PUBGの2025年8月11日の公式レターは、37.1以降、独自セキュリティ付きの別ゲームとの同時起動時にロビーで警告が出る場合を説明しています。まず全文を記録し、もう一方のゲームを通常終了してPUBGだけで比較します。特定製品を原因と断定せず、セキュリティ機能は停止しません。',
      quickFacts: [
        {
          label: '対象',
          value: 'ロビー入室時の競合を示す警告',
        },
        {
          label: '公式の時点',
          value: '2025-08-11の37.1導入告知',
        },
        {
          label: '最初の比較',
          value: '他のゲームを閉じ、PUBGのみ起動',
        },
      ],
      diagnosis: [
        {
          symptom: '別ゲームも起動中で警告',
          cause: 'ゲームクライアントを一つにする',
          stepId: 'close-other-game',
        },
        {
          symptom: 'ほかのゲームは開いていない',
          cause: '再起動後と警告全文を確認',
          stepId: 'retest-lobby',
        },
        {
          symptom: '警告がなく単に入れない',
          cause: '別の症状として相談',
          stepId: 'report-conflict',
        },
      ],
      steps: [
        {
          id: 'record-warning',
          title: '警告全文と発生段階を記録する',
          summary: '単なるロビー失敗から競合と決めつけません。',
          actions: [
            '表示文を省略せず控え、時刻、利用ランチャー、起動中の別ゲームを記録する。公式レターは競合警告の場面を説明するもので、すべての接続失敗を説明するものではない。',
            '警告の固定文言を推測せず、実際の画面を優先する。利用制限や別番号のエラーなら、その全文に合う公式サポートへ。',
          ],
          time: '確認の目安：3〜5分',
          risk: 'low',
        },
        {
          id: 'close-other-game',
          title: 'もう一方のゲームを通常終了する',
          summary: 'アンチチートのサービスを直接止める手順ではありません。',
          actions: [
            '別のゲームを開いている場合は、そのゲームの終了操作で閉じ、PUBGだけを起動した状態でロビーに進む。ゲーム終了前に必要な進行を保存する。',
            '閉じ方が不明、または未知のプロセスだけが残る場合は強制削除せず、そのゲームの公式案内へ。アンチチートやウイルス対策のサービス停止・アンインストールは行わない。',
          ],
          time: '確認の目安：3〜5分',
          risk: 'low',
        },
        {
          id: 'retest-lobby',
          title: '単独起動でも警告が残るか比較する',
          summary: '一つの変更で何が変わったかを記録します。',
          actions: [
            '警告が消えてロビーへ入れた場合は、その時の同時起動状況を記録する。別のPCやすべてのセキュリティ製品にも同じ原因があるとは一般化しない。',
            '残る場合は作業を保存してPCを再起動し、他のゲームを開かずにPUBGを一度起動する。まだ同じ警告なら、さらに保護設定を変えず次の相談へ進む。',
          ],
          time: '確認の目安：3〜5分',
          risk: 'low',
        },
        {
          id: 'report-conflict',
          title: '警告が残る場合と別症状を分けて相談する',
          summary: '改善しない結果も、サポートに必要な情報です。',
          actions: [
            'PUBG公式サイトの利用プラットフォーム別サポートへ、全文・時刻・Windowsの版・ランチャー・同時起動したゲーム・終了と再起動の結果を伝える。スクリーンショットの個人情報を確認する。',
            '警告が消えても接続できないなら、競合とは別に公式のお知らせと接続状況を確認する。ゲーム自体が開かない場合だけ起動しないガイドへ進み、修復を無条件に繰り返さない。',
          ],
          time: '確認の目安：3〜5分',
          risk: 'low',
          guideLink: {
            href: '/guide/steam-game-not-launching',
            label: 'Steamゲーム自体が起動しない場合',
          },
        },
      ],
      avoid: [
        '特定のアンチチート製品を名指しして原因と決めつけない',
        '保護機能の恒久無効化や.sysファイル削除を行わない',
        '2025年の告知を最近の急増や現在の大規模障害の証拠にしない',
      ],
      cautions: [
        '公式資料の確認日：2026-10-14。実機での警告再現や解決率は確認していません。',
        '公式本文で確認した警告の場面を扱います。告知内の画像にある警告全文は取得確認できていないため、固定の警告文を引用していません。',
      ],
      faqs: [
        {
          question: 'この警告は利用禁止の証拠ですか？',
          answer:
            '競合を示す警告だけで利用禁止とは断定しません。公式レターも同時起動時の警告と不正ソフトへの措置を別に説明しています。実際に利用制限と出る場合はその案内を確認してください。',
        },
        {
          question: 'ほかのゲームを開いていないのに出ます。',
          answer:
            'その条件を記録し、再起動後の単独起動でも同じかを確認してPUBGへ相談します。未知のサービスを止める操作へ飛ばないでください。',
        },
      ],
      related: [
        {
          href: '/guide/steam-game-not-launching',
          label: 'Steamゲーム自体が起動しない場合',
        },
      ],
    },
    en: {
      title:
        'PUBG Anti-Cheat Conflict Warning or Lobby Entry Failure: What to Check',
      shortTitle: 'Anti-cheat conflict warning',
      description:
        'Record the PUBG warning and other running games. Apply the limited scope of the 37.1 announcement, compare with one game open and separate unrelated lobby failures.',
      lead: 'For a PC warning about anti-cheat or security-software conflicts when entering the lobby. A connection failure without that warning or an account restriction is a different symptom.',
      summary:
        'PUBG’s August 11, 2025 letter describes a lobby warning from update 37.1 when another game with its own security software is running. Record the message, close the other game normally and compare with PUBG alone. Do not name a particular product as the cause or stop security protection.',
      quickFacts: [
        {
          label: 'Scope',
          value: 'A lobby warning describing a conflict',
        },
        {
          label: 'Source date',
          value: 'August 11, 2025 introduction of 37.1',
        },
        {
          label: 'First comparison',
          value: 'Close other games and run PUBG alone',
        },
      ],
      diagnosis: [
        {
          symptom: 'Another game is open with the warning',
          cause: 'Keep one game client running',
          stepId: 'close-other-game',
        },
        {
          symptom: 'No other game is open',
          cause: 'Compare after restarting and record the message',
          stepId: 'retest-lobby',
        },
        {
          symptom: 'Cannot enter without a warning',
          cause: 'Treat it as a separate symptom',
          stepId: 'report-conflict',
        },
      ],
      steps: [
        {
          id: 'record-warning',
          title: 'Record the warning and stage',
          summary: 'A lobby failure alone does not prove a conflict.',
          actions: [
            'Record the full message, time, launcher and other running games. The official letter describes a conflict-warning scenario, not every connection failure.',
            'Use the text actually displayed rather than guessing a fixed warning string. For a restriction or different error number, follow the matching official help.',
          ],
          time: 'Allow 3–5 min to check',
          risk: 'low',
        },
        {
          id: 'close-other-game',
          title: 'Close the other game normally',
          summary: 'This does not mean stopping an anticheat service directly.',
          actions: [
            'If another game is open, save any progress and close it through its normal exit option. Try the lobby with only PUBG running.',
            'If you do not know how to close it or only an unfamiliar process remains, use that game’s official guidance. Do not stop or uninstall anticheat or antivirus services.',
          ],
          time: 'Allow 3–5 min to check',
          risk: 'low',
        },
        {
          id: 'retest-lobby',
          title: 'Compare with PUBG running alone',
          summary: 'Record what changed after one adjustment.',
          actions: [
            'If the warning clears and the lobby opens, record the simultaneous-game state. Do not generalize that result to every PC or security product.',
            'If it remains, save your work and restart the PC, then launch PUBG once without opening another game. If the same warning remains, proceed to support without further security changes.',
          ],
          time: 'Allow 3–5 min to check',
          risk: 'low',
        },
        {
          id: 'report-conflict',
          title: 'Report persistent warnings separately from other symptoms',
          summary: 'An unsuccessful comparison is useful support information.',
          actions: [
            'Use the platform-specific support linked by PUBG’s official site. Include message, time, Windows version, launcher, other games and exit/restart results. Check screenshots for private information.',
            'If the warning clears but connection still fails, check official notices and connectivity separately. Use the launch guide only if the game itself will not open; do not repeat repairs indiscriminately.',
          ],
          time: 'Allow 3–5 min to check',
          risk: 'low',
          guideLink: {
            href: '/guide/steam-game-not-launching',
            label: 'Steam launch checks (Japanese)',
          },
        },
      ],
      avoid: [
        'Do not identify a particular anticheat product as the cause without evidence.',
        'Do not permanently disable protection or delete .sys files.',
        'Do not portray a 2025 announcement as evidence of a recent surge or current widespread outage.',
      ],
      cautions: [
        'Official source checked on 2026-10-14; no hands-on warning reproduction or success rate was verified.',
        'The scope comes from the official text. The full wording inside the announcement’s warning image could not be verified, so no fixed warning string is quoted.',
      ],
      faqs: [
        {
          question: 'Does this warning prove I am banned?',
          answer:
            'A conflict warning alone does not establish a ban. The letter discusses simultaneous-game warnings separately from penalties for illicit software. Follow the actual restriction notice if one appears.',
        },
        {
          question: 'It appears without another game open.',
          answer:
            'Record that fact, compare a single PUBG launch after restarting and contact PUBG. Do not jump to stopping unknown services.',
        },
      ],
      related: [
        {
          href: '/guide/steam-game-not-launching',
          label: 'Steam launch checks (Japanese)',
        },
      ],
    },
    zh: {
      title: 'PUBG 反作弊冲突警告、无法进入大厅：检查顺序',
      shortTitle: '反作弊冲突警告与大厅',
      description:
        '记录 PUBG 完整警告和同时运行的游戏。按37.1公告的适用范围，关闭其他游戏后比较，并区分无警告的大厅连接失败。',
      lead: '适用于 PC 进入大厅时提示反作弊或安全软件冲突。没有该警告的连接失败或账号限制应另行判断。',
      summary:
        'PUBG 在2025年8月11日的说明中介绍：37.1起，与带独立安全软件的其他游戏同时运行时，进入大厅可能出现警告。先记录全文，正常退出另一个游戏，再只运行 PUBG 比较。不认定某个特定产品是原因，不停止安全保护。',
      quickFacts: [
        {
          label: '适用范围',
          value: '大厅出现冲突相关警告',
        },
        {
          label: '来源时间',
          value: '2025-08-11的37.1引入公告',
        },
        {
          label: '先比较',
          value: '关闭其他游戏，仅运行 PUBG',
        },
      ],
      diagnosis: [
        {
          symptom: '另一个游戏也在运行',
          cause: '只运行一个游戏客户端',
          stepId: 'close-other-game',
        },
        {
          symptom: '没有其他游戏',
          cause: '重启后比较并记录全文',
          stepId: 'retest-lobby',
        },
        {
          symptom: '没有警告却进不去',
          cause: '按其他症状处理',
          stepId: 'report-conflict',
        },
      ],
      steps: [
        {
          id: 'record-warning',
          title: '记录警告与发生阶段',
          summary: '大厅失败本身不能证明冲突。',
          actions: [
            '记录完整提示、时间、启动器及同时运行的游戏。官方说明针对冲突警告场景，不解释所有连接失败。',
            '以实际画面为准，不猜测固定警告文本。若是账号限制或其他编号，查阅对应官方帮助。',
          ],
          time: '检查约需 3–5 分钟',
          risk: 'low',
        },
        {
          id: 'close-other-game',
          title: '正常退出另一个游戏',
          summary: '不是直接停止反作弊服务。',
          actions: [
            '另一个游戏还开着时，先保存必要进度，通过正常退出操作关闭它，只运行 PUBG 尝试进入大厅。',
            '不知道如何退出或只剩不认识的进程时，查阅该游戏官方说明。不停止或卸载反作弊、杀毒服务。',
          ],
          time: '检查约需 3–5 分钟',
          risk: 'low',
        },
        {
          id: 'retest-lobby',
          title: '比较单独启动是否仍有警告',
          summary: '记录一次调整后的变化。',
          actions: [
            '警告消失且能进入大厅时，记录之前同时运行的游戏。不将此结果推广到所有电脑或安全产品。',
            '仍出现时保存工作并重启电脑，不开其他游戏，只启动 PUBG 一次。相同警告仍在就联系支持，不继续改安全设置。',
          ],
          time: '检查约需 3–5 分钟',
          risk: 'low',
        },
        {
          id: 'report-conflict',
          title: '区分残留警告与其他问题后咨询',
          summary: '无改善的比较结果同样有用。',
          actions: [
            '通过 PUBG 官网进入对应平台支持，提供全文、时间、Windows 版本、启动器、其他游戏及退出和重启结果。检查截图中的隐私信息。',
            '警告消失却仍连接失败时，另查官方公告与连接状况。仅游戏本身打不开时使用启动指南，不无条件反复修复。',
          ],
          time: '检查约需 3–5 分钟',
          risk: 'low',
          guideLink: {
            href: '/guide/steam-game-not-launching',
            label: 'Steam 游戏无法启动（日语）',
          },
        },
      ],
      avoid: [
        '不无依据认定某个特定反作弊产品是原因。',
        '不永久关闭保护或删除 .sys 文件。',
        '不把2025年公告当作近期激增或当前大规模故障证据。',
      ],
      cautions: [
        '官方资料核对日期：2026-10-14；未验证实机警告复现或成功率。',
        '以官方正文说明的场景为准；未能确认公告警告图片中的完整措辞，因此不引用固定警告文本。',
      ],
      faqs: [
        {
          question: '警告说明我被封禁了吗？',
          answer:
            '冲突警告本身不能证明封禁。官方将同时运行游戏的警告与非法软件处罚分别说明；若实际出现限制通知，应按该通知处理。',
        },
        {
          question: '没有其他游戏也出现怎么办？',
          answer:
            '记录这一条件，重启后只运行 PUBG 比较，再咨询 PUBG。不直接停止陌生服务。',
        },
      ],
      related: [
        {
          href: '/guide/steam-game-not-launching',
          label: 'Steam 游戏无法启动（日语）',
        },
      ],
    },
    es: {
      title:
        'PUBG: aviso de conflicto antitrampas y problemas al entrar en la sala',
      shortTitle: 'Conflicto antitrampas al entrar',
      description:
        'Anota el aviso de PUBG y otros juegos abiertos. Aplica el alcance limitado del anuncio 37.1, compara con un solo juego y distingue otros fallos de conexión.',
      lead: 'Para un aviso de conflicto antitrampas o de seguridad al entrar en la sala en PC. Un fallo sin ese aviso o una restricción de cuenta son síntomas distintos.',
      summary:
        'La carta de PUBG del 11 de agosto de 2025 describe un aviso desde la actualización 37.1 al ejecutar otro juego con seguridad propia. Anota el mensaje, cierra normalmente el otro juego y compara con PUBG solo. No atribuyas la causa a un producto concreto ni detengas la protección.',
      quickFacts: [
        {
          label: 'Ámbito',
          value: 'Aviso de conflicto al entrar en la sala',
        },
        {
          label: 'Fecha de la fuente',
          value: '11 de agosto de 2025, introducción de 37.1',
        },
        {
          label: 'Primera comparación',
          value: 'Cierra otros juegos y abre solo PUBG',
        },
      ],
      diagnosis: [
        {
          symptom: 'Hay otro juego abierto y aparece el aviso',
          cause: 'Deja un solo cliente de juego',
          stepId: 'close-other-game',
        },
        {
          symptom: 'No hay otro juego abierto',
          cause: 'Compara tras reiniciar y anota el mensaje',
          stepId: 'retest-lobby',
        },
        {
          symptom: 'No entra pero no hay aviso',
          cause: 'Trátalo como otro síntoma',
          stepId: 'report-conflict',
        },
      ],
      steps: [
        {
          id: 'record-warning',
          title: 'Anota el aviso y la fase',
          summary: 'Un fallo de sala no demuestra por sí solo un conflicto.',
          actions: [
            'Anota texto completo, hora, lanzador y otros juegos abiertos. La carta describe un aviso de conflicto, no todos los fallos de conexión.',
            'Usa el texto real de la pantalla sin suponer una frase fija. Para restricciones u otros códigos, consulta la ayuda correspondiente.',
          ],
          time: 'Comprobación: unos 3–5 min',
          risk: 'low',
        },
        {
          id: 'close-other-game',
          title: 'Cierra el otro juego normalmente',
          summary: 'No significa detener directamente un servicio antitrampas.',
          actions: [
            'Si hay otro juego abierto, guarda el progreso necesario y usa su salida normal. Prueba la sala con solo PUBG.',
            'Si no sabes cerrarlo o queda un proceso desconocido, consulta la ayuda oficial de ese juego. No detengas ni desinstales servicios antitrampas o antivirus.',
          ],
          time: 'Comprobación: unos 3–5 min',
          risk: 'low',
        },
        {
          id: 'retest-lobby',
          title: 'Compara con solo PUBG',
          summary: 'Anota el efecto de un único cambio.',
          actions: [
            'Si desaparece el aviso y abre la sala, registra qué juegos estaban abiertos. No generalices a todos los equipos o productos de seguridad.',
            'Si continúa, guarda tu trabajo, reinicia el PC y abre PUBG una vez sin otros juegos. Si persiste el mismo aviso, consulta al soporte sin seguir cambiando seguridad.',
          ],
          time: 'Comprobación: unos 3–5 min',
          risk: 'low',
        },
        {
          id: 'report-conflict',
          title: 'Separa avisos persistentes de otros fallos',
          summary: 'Los resultados sin mejora también ayudan al soporte.',
          actions: [
            'Usa el soporte de tu plataforma enlazado desde PUBG. Facilita mensaje, hora, Windows, lanzador, otros juegos y resultados de cerrar y reiniciar. Revisa datos privados en capturas.',
            'Si desaparece el aviso pero falla la conexión, revisa avisos oficiales y conectividad por separado. Usa la guía de inicio solo si no abre el juego; no repitas reparaciones indiscriminadamente.',
          ],
          time: 'Comprobación: unos 3–5 min',
          risk: 'low',
          guideLink: {
            href: '/guide/steam-game-not-launching',
            label: 'El juego no inicia en Steam (japonés)',
          },
        },
      ],
      avoid: [
        'No atribuyas sin pruebas la causa a un antitrampas concreto.',
        'No desactives permanentemente la protección ni borres .sys.',
        'No presentes el anuncio de 2025 como prueba de un aumento reciente o una caída general actual.',
      ],
      cautions: [
        'Fuente consultada el 2026-10-14; sin reproducción del aviso en un equipo ni tasa de éxito verificada.',
        'El alcance procede del texto oficial. No se pudo verificar el texto completo de la imagen del aviso; no se cita una frase fija.',
      ],
      faqs: [
        {
          question: '¿El aviso demuestra que estoy suspendido?',
          answer:
            'Un aviso de conflicto no demuestra una suspensión. La carta distingue los avisos por juegos simultáneos de las sanciones por software ilícito. Sigue la notificación real si aparece una restricción.',
        },
        {
          question: 'Aparece sin otro juego abierto.',
          answer:
            'Anota esa condición, compara con solo PUBG tras reiniciar y consulta al soporte. No pases directamente a detener servicios desconocidos.',
        },
      ],
      related: [
        {
          href: '/guide/steam-game-not-launching',
          label: 'El juego no inicia en Steam (japonés)',
        },
      ],
    },
  },
  relatedSlugs: [],
};
