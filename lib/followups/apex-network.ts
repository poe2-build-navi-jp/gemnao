import type { FollowupGuide } from './types';

export const apexNetworkGuide: FollowupGuide = {
  gameSlug: 'apex-legends',
  gameName: 'Apex Legends',
  slug: 'code-net-leaf',
  category: 'server',
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
      url: 'https://help.ea.com/en/articles/technical-issues/problems-connecting-online/',
      labels: {
        ja: 'EA：接続トラブルの確認（英語）',
        en: 'EA: connection troubleshooting',
        zh: 'EA：连接问题排查（英语）',
        es: 'EA: problemas de conexión (inglés)',
      },
    },
    {
      url: 'https://help.ea.com/en/server-status/',
      labels: {
        ja: 'EA：公式サーバー状況（英語）',
        en: 'EA: official server status',
        zh: 'EA：官方服务器状态（英语）',
        es: 'EA: estado oficial de servidores (inglés)',
      },
    },
  ],
  copy: {
    ja: {
      title: 'Apexのcode:net・code:leafで切断される時｜障害確認と接続比較',
      shortTitle: 'code:net・code:leaf',
      description:
        'Apexのnet・leafはサーバー応答に関するエラー。公式状況の確認、障害未確認時の再起動・有線比較、元の接続へ戻す方法と相談記録を整理します。',
      lead: 'PC版Apexで接続が切れる、マッチへ入れずcode:net／code:leafが出る場合向けです。ゲームが終了するクラッシュとは分けます。',
      summary:
        'EAはnetをゲームへの応答停止、leafをマッチ接続時にサーバーが応答しない状態と説明しています。ただしコードだけで現在の全体障害や自宅回線の故障は断定できません。まず公式状況を確認し、障害情報がなければ再起動と有線接続を比較します。EA側の修正待ちが必要な場合もあります。',
      quickFacts: [
        {
          label: '最初に確認',
          value: 'EA公式のサーバー状況と発生時刻',
        },
        {
          label: '障害が告知されている',
          value: '復旧情報を待ち、再インストールを繰り返さない',
        },
        {
          label: '障害未確認',
          value: 'PC・ルーター再起動と有線を比較',
        },
      ],
      diagnosis: [
        {
          symptom: '公式に障害・メンテ告知がある',
          cause: '復旧案内を確認する',
          stepId: 'check-server-status',
        },
        {
          symptom: '障害告知がなく同じコードが続く',
          cause: '端末と接続を再起動して比較',
          stepId: 'restart-connection',
        },
        {
          symptom: 'Wi-Fi利用時に繰り返す',
          cause: '有線との違いを記録',
          stepId: 'compare-wired',
        },
        {
          symptom: '基本確認後も再発する',
          cause: '地域・時刻・比較結果を相談',
          stepId: 'report-connection',
        },
      ],
      steps: [
        {
          id: 'check-server-status',
          title: 'コードと公式状況を照合',
          summary: 'この記事は現在の稼働状況を表示するものではありません。',
          actions: [
            'Javelinと表示される場合は、このSTEPの専用記事リンクで現在のエラーを確認する。',
            'エラー全文、日時とタイムゾーン、地域、プラットフォーム、マッチ参加時か試合中かを記録する。',
            'EA公式サーバー状況でApexと利用プラットフォームを確認し、告知の対象と時間が一致するか読む。',
            '該当障害がある場合は公式の復旧案内を待つ。正常表示でも個別の接続問題まで否定できないため、未確認なら次の比較へ進む。',
          ],
          risk: 'low',
          note: '確認だけなので戻す設定はありません。障害の有無をコード名だけで断定しません。',
          time: '確認・記録：約3〜5分',
          guideLink: {
            href: '/games/apex-legends/javelin-launch-error',
            label: 'Javelinと表示される起動エラーはこちら',
          },
        },
        {
          id: 'restart-connection',
          title: 'ゲーム・PC・ルーターを順に確認',
          summary: '一度に複数の変更を加えません。',
          actions: [
            '作業を保存してApexとPCを再起動し、同じ接続で比較する。変化と時刻を記録する。',
            '共有回線への影響を確認できる場合だけ、メーカーの手順でルーターを再起動する。管理された回線は管理者へ相談する。',
            '回線が戻ってから再接続する。Resetボタンや工場出荷時初期化は使わず、DNS・ポート・保護設定を同時に変えない。',
          ],
          risk: 'low',
          note: 'ルーター再起動中は同じ回線の他端末も切断されます。復帰しない場合は繰り返さずメーカーや回線窓口へ。',
          time: '処理時間は環境により異なります',
        },
        {
          id: 'compare-wired',
          title: '可能なら有線接続と比較',
          summary: '回線の違いを手掛かりとして記録します。',
          actions: [
            '利用可能な既存のEthernet接続で試せる場合は、変更前の接続を記録して有線で同じ操作を試す。',
            'Wi-Fi／有線、発生時刻、他のサービスでも接続問題があるかを記録する。1回の成功だけで原因を決めない。',
            '比較を終えたら必要に応じて元の接続へ戻す。有線を使えない場合はその条件を記録してSTEP 4へ進む。',
          ],
          risk: 'low',
          note: '有線で改善しないことは機器故障の証明ではありません。新しい回線契約やネットワーク初期化は不要です。',
          time: '処理時間は環境により異なります',
        },
        {
          id: 'report-connection',
          title: '基本確認で残った結果を相談',
          summary: '無限に再起動や再インストールを繰り返しません。',
          actions: [
            '公式告知の確認結果、コード、地域、プラットフォーム、時刻・時差、PC／ルーター再起動と有線比較の結果をEAへ伝える。',
            '他サービスでも接続できない場合は、回線提供元や管理者にも症状を伝える。アカウント情報や公開IPを公開の回答欄へ貼らない。',
            'EAの修正待ちが必要な場合は案内に従う。ゲーム自体が終了してApex_crash.txtが出るなら、クラッシュ記事へ進む。',
          ],
          risk: 'low',
          guideLink: {
            href: '/games/apex-legends/apex-crash-txt',
            label: 'ゲームが落ちる場合の確認',
          },
          time: '確認・記録：約3〜5分',
        },
      ],
      avoid: [
        'コードだけでサーバー障害・回線故障を断定しない',
        'ルーターの初期化やポート開放を一律に行わない',
        'ファイアウォールやアンチチートを止めない',
      ],
      cautions: [],
      faqs: [
        {
          question: 'netとleafは別々の対処が必要ですか？',
          answer:
            '公式の基本手順は共通です。netはゲームへの応答、leafはマッチ接続時の応答という違いを記録し、同じ基本比較を使います。',
        },
        {
          question: 'サーバー状況が正常なら自宅回線の故障ですか？',
          answer:
            '断定できません。個別経路や一時的な問題もあり得ます。地域・時刻・他サービスの状況と比較結果を揃えて相談します。',
        },
      ],
      related: [
        {
          href: '/games/apex-legends/game-version-mismatch',
          label: 'ホストとのバージョン不一致：ゲーム更新の確認',
        },
        {
          href: '/games/apex-legends/javelin-launch-error',
          label: 'Javelinと表示される起動エラーはこちら',
        },
        {
          href: '/games/apex-legends/r5apex-exe-launch-error',
          label: 'r5apex.exe・起動エラー',
        },
        {
          href: '/games/apex-legends/apex-crash-txt',
          label: 'Apex_crash.txt・クラッシュ',
        },
      ],
    },
    en: {
      title:
        'Apex code:net and code:leaf: Check Status and Compare Connections',
      shortTitle: 'code:net and code:leaf',
      description:
        'Check official Apex status before troubleshooting net or leaf. Compare restarts and Ethernet only when appropriate, restore your connection and report the results.',
      lead: 'For Apex on PC disconnecting or failing to join a match with code:net or code:leaf. A game process closing is a separate crash symptom.',
      summary:
        'EA describes net as its servers stopping their response to the game, and leaf as no server response when joining a match. Neither code alone proves a current widespread outage or a broken home connection. Check official status first; without a matching incident, compare restarts and Ethernet. An EA-side fix may still be needed.',
      quickFacts: [
        {
          label: 'First check',
          value: 'Official EA status and the incident time',
        },
        {
          label: 'Matching outage announced',
          value: 'Follow recovery updates instead of reinstalling',
        },
        {
          label: 'No incident confirmed',
          value: 'Compare PC/router restarts and Ethernet',
        },
      ],
      diagnosis: [
        {
          symptom: 'An official incident matches',
          cause: 'Follow recovery information',
          stepId: 'check-server-status',
        },
        {
          symptom: 'No matching incident; code continues',
          cause: 'Restart and compare',
          stepId: 'restart-connection',
        },
        {
          symptom: 'Repeated on Wi-Fi',
          cause: 'Record an Ethernet comparison',
          stepId: 'compare-wired',
        },
        {
          symptom: 'Still happens after basic checks',
          cause: 'Report region, time and results',
          stepId: 'report-connection',
        },
      ],
      steps: [
        {
          id: 'check-server-status',
          title: 'Match the code to official status',
          summary: 'This article is not a live status display.',
          actions: [
            'If the message names Javelin, use this step’s dedicated guide link to check the current error.',
            'Record the complete error, date/time and time zone, region, platform and whether it occurs joining a match or during play.',
            'Open EA’s official server-status page, select Apex and check your platform. Compare the incident scope and times.',
            'For a matching incident, follow official recovery updates. A normal indicator does not rule out an individual issue; otherwise continue with comparisons.',
          ],
          risk: 'low',
          note: 'Reading status changes no settings. Do not diagnose an outage from the code alone.',
          time: 'About 3–5 minutes to read and record',
          guideLink: {
            href: '/en/games/apex-legends/javelin-launch-error',
            label: 'Launch error naming Javelin',
          },
        },
        {
          id: 'restart-connection',
          title: 'Check the game, PC and router in order',
          summary: 'Keep changes separate.',
          actions: [
            'Save work, restart Apex and the PC, then retry on the same connection. Record the result and time.',
            'Restart the router using its manufacturer’s procedure only if you can account for other users of the connection. Ask the administrator on managed networks.',
            'Reconnect after service returns. Do not use Reset/factory reset or change DNS, ports and protection together.',
          ],
          risk: 'low',
          note: 'Other devices lose connectivity during a router restart. If service does not return, contact the manufacturer or provider instead of repeating resets.',
          time: 'Duration depends on the task and device',
        },
        {
          id: 'compare-wired',
          title: 'Compare Ethernet if available',
          summary: 'Use the difference as evidence, not a verdict.',
          actions: [
            'If an existing Ethernet connection is available, note your current connection and repeat the same action over Ethernet.',
            'Record Wi-Fi versus Ethernet, time and whether other services also fail. One successful attempt is not enough to identify the cause.',
            'Return to your previous connection after comparison if needed. If Ethernet is unavailable, record that limitation and continue to Step 4.',
          ],
          risk: 'low',
          note: 'No improvement on Ethernet does not prove hardware failure. A new service contract or network reset is unnecessary for this comparison.',
          time: 'Duration depends on the task and device',
        },
        {
          id: 'report-connection',
          title: 'Report what remains after basic checks',
          summary: 'Avoid endless restarts and reinstalls.',
          actions: [
            'Give EA the official-status result, code, region, platform, time/time zone and PC/router restart and Ethernet results.',
            'If other services also fail, contact your network provider or administrator. Do not post account details or public IP addresses in article feedback.',
            'Follow EA guidance if a service-side fix is needed. If the game closes with Apex_crash.txt, switch to crash troubleshooting.',
          ],
          risk: 'low',
          guideLink: {
            href: '/en/games/apex-legends/apex-crash-txt',
            label: 'Check the game closing with Apex_crash.txt',
          },
          time: 'About 3–5 minutes to read and record',
        },
      ],
      avoid: [
        'Do not infer a widespread outage or broken connection from the code alone',
        'Do not routinely factory-reset routers or open ports',
        'Do not stop the firewall or anti-cheat',
      ],
      cautions: [],
      faqs: [
        {
          question: 'Do net and leaf need different procedures?',
          answer:
            'The official basic steps are shared. Record that net concerns response to the game and leaf concerns response when joining a match, then use the same basic comparisons.',
        },
        {
          question:
            'Does normal server status prove my home network is broken?',
          answer:
            'No. Individual paths or temporary issues may still be involved. Report region, time, other-service behavior and comparison results.',
        },
      ],
      related: [
        {
          href: '/en/games/apex-legends/game-version-mismatch',
          label: 'Game version does not match host: update checks',
        },
        {
          href: '/en/games/apex-legends/javelin-launch-error',
          label: 'Launch error naming Javelin',
        },
        {
          href: '/en/games/apex-legends/r5apex-exe-launch-error',
          label: 'r5apex.exe launch errors',
        },
        {
          href: '/en/games/apex-legends/apex-crash-txt',
          label: 'Apex_crash.txt and crashes',
        },
      ],
    },
    zh: {
      title: 'Apex code:net 与 code:leaf：服务器状态与连接比较',
      shortTitle: 'code:net 与 code:leaf',
      description:
        '先查 Apex 官方状态，再按条件重启或比较有线连接。区分 net 与 leaf，保留恢复原连接的方法与未解决时的求助记录。',
      lead: '适用于 PC 版 Apex 断线或无法进入比赛，并出现 code:net／code:leaf。游戏进程退出属于另一种崩溃症状。',
      summary:
        'EA 将 net 描述为服务器停止回应游戏，leaf 为进入比赛时服务器没有回应。仅凭代码不能断定当前存在大范围故障或家中网络损坏。先查官方状态；没有对应公告时再比较重启与有线连接。问题也可能需要等待 EA 修复。',
      quickFacts: [
        {
          label: '先检查',
          value: 'EA 官方状态与发生时间',
        },
        {
          label: '已有对应故障公告',
          value: '关注恢复信息，不反复重装',
        },
        {
          label: '故障尚未确认',
          value: '比较 PC／路由器重启与有线连接',
        },
      ],
      diagnosis: [
        {
          symptom: '有对应官方故障公告',
          cause: '查看恢复进展',
          stepId: 'check-server-status',
        },
        {
          symptom: '无对应公告但代码持续',
          cause: '重启并比较',
          stepId: 'restart-connection',
        },
        {
          symptom: 'Wi-Fi 下反复出现',
          cause: '记录有线比较',
          stepId: 'compare-wired',
        },
        {
          symptom: '基本检查后仍出现',
          cause: '提交地区、时间与结果',
          stepId: 'report-connection',
        },
      ],
      steps: [
        {
          id: 'check-server-status',
          title: '对照代码与官方状态',
          summary: '本文不显示实时服务器状态。',
          actions: [
            '提示包含 Javelin 时，先使用本步骤的专用文章链接核对当前错误。',
            '记录完整提示、日期时间与时区、地区、平台，以及发生在加入比赛时还是游玩中。',
            '打开 EA 官方服务器状态页，检查 Apex 和所用平台，核对公告范围与时间。',
            '有对应故障时关注官方恢复公告。正常标记也不能排除个别问题；没有对应公告时继续比较。',
          ],
          risk: 'low',
          note: '读取状态不会改变设置，不凭代码名称诊断全体故障。',
          time: '检查与记录约 3–5 分钟',
          guideLink: {
            href: '/zh/games/apex-legends/javelin-launch-error',
            label: '显示 Javelin 的启动错误',
          },
        },
        {
          id: 'restart-connection',
          title: '依次检查游戏、PC 和路由器',
          summary: '一次只进行一项改变。',
          actions: [
            '保存工作，重启 Apex 与 PC，在相同连接下重试，记录时间和结果。',
            '只有确认不会影响其他使用者后，才按厂商方法重启路由器；受管理网络先询问管理员。',
            '网络恢复后再连接。不要按 Reset 恢复出厂设置，也不要同时修改 DNS、端口和安全保护。',
          ],
          risk: 'low',
          note: '路由器重启会使其他设备断网。无法恢复时应咨询厂商或运营商，不反复重置。',
          time: '耗时取决于操作和设备',
        },
        {
          id: 'compare-wired',
          title: '可用时比较有线连接',
          summary: '将差异作为线索，不作故障定论。',
          actions: [
            '如果已有可用的 Ethernet 连接，先记录原连接，再用有线重复相同操作。',
            '记录 Wi-Fi／有线、时间以及其他服务是否也无法连接，不凭一次成功判断原因。',
            '比较完毕后按需恢复原连接。无法使用有线时记录条件并进入第 4 步。',
          ],
          risk: 'low',
          note: '有线没有改善也不证明硬件损坏。这项比较不要求购买新线路或重置网络。',
          time: '耗时取决于操作和设备',
        },
        {
          id: 'report-connection',
          title: '提交基本检查后的结果',
          summary: '避免无限重启与重装。',
          actions: [
            '向 EA 提供官方状态检查结果、代码、地区、平台、时间时区，以及 PC／路由器重启和有线比较结果。',
            '若其他服务同样无法连接，也应联系网络提供者或管理员。不要在公开反馈中发布账号信息或公网 IP。',
            '需要等待 EA 修复时遵循公告。游戏退出并提示 Apex_crash.txt 时，转到崩溃排查。',
          ],
          risk: 'low',
          guideLink: {
            href: '/zh/games/apex-legends/apex-crash-txt',
            label: '检查 Apex_crash.txt 崩溃',
          },
          time: '检查与记录约 3–5 分钟',
        },
      ],
      avoid: [
        '不凭代码断定服务器故障或线路损坏',
        '不统一要求路由器恢复出厂设置或开放端口',
        '不关闭防火墙或反作弊',
      ],
      cautions: [],
      faqs: [
        {
          question: 'net 和 leaf 必须分别处理吗？',
          answer:
            '官方基本步骤相同。记录 net 涉及对游戏的回应、leaf 涉及加入比赛时的回应，再进行同样的基本比较。',
        },
        {
          question: '官方状态正常就说明家中网络坏了吗？',
          answer:
            '不能这样判断。个别路径或临时问题仍可能存在。请整理地区、时间、其他服务情况和比较结果后求助。',
        },
      ],
      related: [
        {
          href: '/zh/games/apex-legends/game-version-mismatch',
          label: '与主机版本不匹配：检查更新',
        },
        {
          href: '/zh/games/apex-legends/javelin-launch-error',
          label: '显示 Javelin 的启动错误',
        },
        {
          href: '/zh/games/apex-legends/r5apex-exe-launch-error',
          label: 'r5apex.exe 启动错误',
        },
        {
          href: '/zh/games/apex-legends/apex-crash-txt',
          label: 'Apex_crash.txt 与崩溃',
        },
      ],
    },
    es: {
      title:
        'Apex code:net y code:leaf: estado del servicio y comparación de conexión',
      shortTitle: 'code:net y code:leaf',
      description:
        'Consulta el estado oficial antes de resolver net o leaf. Compara reinicios y Ethernet cuando corresponda, restaura la conexión y comunica los resultados.',
      lead: 'Para Apex en PC que se desconecta o no entra en una partida con code:net o code:leaf. El cierre del proceso del juego es un síntoma distinto.',
      summary:
        'EA describe net como la interrupción de respuesta al juego y leaf como falta de respuesta del servidor al entrar en una partida. El código no demuestra por sí solo una caída general ni una avería doméstica. Consulta el estado oficial; sin un incidente coincidente, compara reinicios y Ethernet. Puede ser necesaria una corrección de EA.',
      quickFacts: [
        {
          label: 'Primera comprobación',
          value: 'Estado oficial de EA y hora del incidente',
        },
        {
          label: 'Caída coincidente anunciada',
          value: 'Espera novedades sin reinstalar repetidamente',
        },
        {
          label: 'Sin incidente confirmado',
          value: 'Compara reinicios y conexión Ethernet',
        },
      ],
      diagnosis: [
        {
          symptom: 'Hay un incidente oficial coincidente',
          cause: 'Consulta su recuperación',
          stepId: 'check-server-status',
        },
        {
          symptom: 'Sin aviso coincidente y persiste',
          cause: 'Reinicia y compara',
          stepId: 'restart-connection',
        },
        {
          symptom: 'Se repite con Wi-Fi',
          cause: 'Registra una comparación con cable',
          stepId: 'compare-wired',
        },
        {
          symptom: 'Sigue tras las comprobaciones',
          cause: 'Comunica región, hora y resultados',
          stepId: 'report-connection',
        },
      ],
      steps: [
        {
          id: 'check-server-status',
          title: 'Contrasta el código con el estado oficial',
          summary: 'Esta guía no muestra el estado en directo.',
          actions: [
            'Si el mensaje menciona Javelin, consulta el enlace específico de este paso.',
            'Registra el error completo, fecha, hora y zona horaria, región, plataforma y si ocurre al entrar o durante una partida.',
            'Abre el estado oficial de servidores de EA, consulta Apex y tu plataforma, y compara alcance y horario del incidente.',
            'Si coincide una incidencia, sigue los avisos de recuperación. Un indicador normal no descarta problemas individuales; sin coincidencia continúa las comparaciones.',
          ],
          risk: 'low',
          note: 'Consultar el estado no cambia ajustes. No diagnostiques una caída solo por el código.',
          time: 'Unos 3–5 minutos para consultar y anotar',
          guideLink: {
            href: '/es/games/apex-legends/javelin-launch-error',
            label: 'Error de inicio que menciona Javelin',
          },
        },
        {
          id: 'restart-connection',
          title: 'Comprueba juego, PC y router en orden',
          summary: 'Separa cada cambio.',
          actions: [
            'Guarda el trabajo, reinicia Apex y el PC y repite con la misma conexión. Anota resultado y hora.',
            'Reinicia el router según su fabricante solo si puedes tener en cuenta a los demás usuarios. En redes gestionadas consulta al administrador.',
            'Reconecta cuando vuelva el servicio. No uses Reset/restauración de fábrica ni cambies DNS, puertos y protección a la vez.',
          ],
          risk: 'low',
          note: 'Los demás dispositivos perderán conexión durante el reinicio. Si no vuelve, consulta al fabricante o proveedor en vez de repetirlo.',
          time: 'La duración depende de la tarea y el equipo',
        },
        {
          id: 'compare-wired',
          title: 'Compara Ethernet si está disponible',
          summary: 'La diferencia es una pista, no un diagnóstico.',
          actions: [
            'Si tienes una conexión Ethernet disponible, anota la anterior y repite la misma acción con cable.',
            'Registra Wi-Fi frente a Ethernet, hora y si fallan otros servicios. Un intento correcto no identifica la causa.',
            'Vuelve a tu conexión anterior después si lo necesitas. Si no puedes usar cable, anótalo y continúa al paso 4.',
          ],
          risk: 'low',
          note: 'La falta de mejora con cable no demuestra una avería. Esta comparación no exige contratar otra línea ni restablecer la red.',
          time: 'La duración depende de la tarea y el equipo',
        },
        {
          id: 'report-connection',
          title: 'Comunica los resultados restantes',
          summary: 'Evita reinicios y reinstalaciones sin límite.',
          actions: [
            'Entrega a EA el resultado del estado oficial, código, región, plataforma, hora y zona horaria, y las comparaciones de reinicio y Ethernet.',
            'Si también fallan otros servicios, consulta al proveedor o administrador de red. No publiques datos de cuenta ni direcciones IP públicas.',
            'Sigue los avisos si hace falta una corrección de EA. Si el juego se cierra con Apex_crash.txt, consulta la guía de cierres.',
          ],
          risk: 'low',
          guideLink: {
            href: '/es/games/apex-legends/apex-crash-txt',
            label: 'Comprobar cierres con Apex_crash.txt',
          },
          time: 'Unos 3–5 minutos para consultar y anotar',
        },
      ],
      avoid: [
        'No deduzcas una caída general o una avería por el código',
        'No restaures routers de fábrica ni abras puertos de forma general',
        'No detengas el cortafuegos ni el antitrampas',
      ],
      cautions: [],
      faqs: [
        {
          question: '¿Net y leaf necesitan procedimientos distintos?',
          answer:
            'Comparten los pasos básicos oficiales. Registra que net afecta a la respuesta al juego y leaf a la respuesta al entrar en una partida, y realiza las mismas comparaciones.',
        },
        {
          question: '¿Un estado normal prueba que mi red está averiada?',
          answer:
            'No. Puede haber problemas de rutas individuales o temporales. Comunica región, hora, comportamiento de otros servicios y comparaciones.',
        },
      ],
      related: [
        {
          href: '/es/games/apex-legends/game-version-mismatch',
          label: 'Versión incompatible con el anfitrión: actualizaciones',
        },
        {
          href: '/es/games/apex-legends/javelin-launch-error',
          label: 'Error de inicio que menciona Javelin',
        },
        {
          href: '/es/games/apex-legends/r5apex-exe-launch-error',
          label: 'Errores de inicio de r5apex.exe',
        },
        {
          href: '/es/games/apex-legends/apex-crash-txt',
          label: 'Apex_crash.txt y cierres',
        },
      ],
    },
  },
  relatedSlugs: [
    'game-version-mismatch',
    'javelin-launch-error',
    'apex-crash-txt',
    'r5apex-exe-launch-error',
  ],
};
