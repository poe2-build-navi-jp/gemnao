import type { FollowupGuide } from './types';

export const connectionGuide: FollowupGuide = {
  gameSlug: 'ace-combat-8',
  gameName: 'ACE COMBAT 8',
  slug: 'connection-after-time-sync',
  category: 'server',
  checkedAt: '2026-10-13',
  relatedSlugs: ['error-st-3100001', 'time-sync-failed', 'not-launching'],
  sources: [
    {
      url: 'https://steamcommunity.com/gid/103582791475413357/announcements/detail/695400360681933547',
      labels: {
        ja: 'ACE COMBAT公式：更新予定とONLINEのマッチメイキング状況（2026年10月9日・英語）',
        en: 'ACE COMBAT: upcoming update plans and ONLINE matchmaking status, October 9, 2026',
        zh: 'ACE COMBAT 官方：更新计划与 ONLINE 匹配情况（2026年10月9日，英语）',
        es: 'ACE COMBAT: planes de actualización y estado del emparejamiento ONLINE, 9 de octubre de 2026 (inglés)',
      },
    },
    {
      url: 'https://steamcommunity.com/ogg/2288340/announcements/detail/695399726270382124',
      labels: {
        ja: 'ACE COMBAT公式：ST-3100001と時刻確認の案内（2026年9月30日・英語）',
        en: 'ACE COMBAT: ST-3100001 and clock checks, September 30, 2026',
        zh: 'ACE COMBAT 官方：ST-3100001 与时钟检查（2026年9月30日，英语）',
        es: 'ACE COMBAT: ST-3100001 y comprobación del reloj, 30 de septiembre de 2026 (inglés)',
      },
    },
    {
      url: 'https://support.microsoft.com/en-us/windows/experience/connectivity-networking/fix-wi-fi-connection-issues-in-windows',
      labels: {
        ja: 'Microsoft：WindowsのWi-Fi接続問題を確認する（英語）',
        en: 'Microsoft: troubleshoot Wi-Fi connection issues in Windows',
        zh: 'Microsoft：排查 Windows Wi-Fi 连接问题（英语）',
        es: 'Microsoft: problemas de conexión Wi-Fi en Windows (inglés)',
      },
    },
  ],
  copy: {
    ja: {
      title:
        'ST-3100001が時刻同期後も出る時は？回線・公式告知・発生場面の切り分け',
      shortTitle: '時刻同期後も接続が切れる',
      description:
        'ACE COMBAT 8でWindows時刻同期後も接続が切れる場合、ロビー・試合・結果画面を区別。日付付きの公式告知、別端末、有線とWi-Fiの比較から次の確認先を絞ります。',
      lead: 'Windowsの時刻同期成功を確認しても、ACE COMBAT ONLINEでST-3100001や切断が続く場合向けです。アプリ自体が終了するクラッシュ、Windowsの同期自体の失敗は別に確認します。',
      summary:
        '発生場面と時刻を記録し、該当する最新の公式告知を確認します。次に同じ回線の別端末や有線接続と比べ、ゲームだけ・このPCだけ・回線全体のどこまで影響するかを整理してください。ゲームだけ失敗してもサーバー障害とは断定できず、告知がないことも正常の証明にはなりません。',
      quickFacts: [
        {
          label: '最初に分ける',
          value: 'ロビー／試合開始／試合中／結果画面／アプリ自体の終了',
        },
        {
          label: '公式情報の扱い',
          value: '告知の日付・対象症状・更新内容を確認し、自分の症状と照合',
        },
        {
          label: '比較で分かること',
          value: '調べる範囲を狭める材料。原因や故障箇所の確定ではない',
        },
      ],
      diagnosis: [
        {
          symptom: '同期成功を確認できていない',
          cause: '先にWindowsの同期結果を確認',
          stepId: 'confirm-phase',
        },
        {
          symptom: 'このゲームだけマッチングや試合が失敗',
          cause: '対象症状に合う公式告知と環境を確認',
          stepId: 'check-official-scope',
        },
        {
          symptom: '別の通信も切れる／Wi-Fiだけ不安定',
          cause: '同じ回線の端末と接続方法を比較',
          stepId: 'compare-network',
        },
        {
          symptom: '比較しても原因が分からない',
          cause: '分かった範囲を記録して公式窓口へ',
          stepId: 'connection-record',
        },
      ],
      steps: [
        {
          id: 'confirm-phase',
          title: '同期結果と、接続が失敗する場面を分ける',
          summary: '時刻同期の成功とゲーム接続の成功は別です。',
          time: '約2分',
          risk: 'low',
          actions: [
            'Windowsの最終同期成功時刻と、ゲームのエラー全文・発生時刻を記録する。時計が見た目で合っているだけなら、まず同期結果を確認する。',
            'ロビーに入れない、試合開始で失敗、対戦中に切断、結果画面に進めない、アプリが終了した、のどれかを控える。違う症状を同じ原因としてまとめない。',
            'アプリ自体が終了する場合は起動・クラッシュ記事へ。同期失敗なら時計の確認へ戻り、確認のために対戦への参加を繰り返さない。',
          ],
          guideLink: {
            href: '/games/ace-combat-8/time-sync-failed',
            label: 'Windowsの時刻同期に失敗する場合',
            description: '同期成功が未確認ならこちらから確認します。',
          },
        },
        {
          id: 'check-official-scope',
          title: '日付付きの公式告知と自分の環境を照合する',
          summary: '告知に書かれた対象と、実際の症状が一致するかを確認します。',
          time: '約3分',
          risk: 'low',
          actions: [
            '公式SteamニュースとPROJECT_ACESの案内で、同じモード・発生場面の告知と、その後の解消・更新情報を探す。記事末尾の出典から確認できる。',
            '2026年10月9日の公式告知は一部環境のONLINEマッチメイキング問題に触れ、公式対応OSのWindows 11とSSDへのインストールを推奨した。更新内容と日程は確定次第発表すると案内している。現在の進捗は後続の告知で確認する。',
            'Windowsの版とインストール先がSSDかを記録する。これらの条件を満たすだけで切断が直るとは扱わず、すべてのST-3100001を同じ告知の不具合とも決めつけない。',
          ],
          note: '告知を読むだけなら戻す設定はありません。過去の告知を「現在障害中」や「修正済み」の根拠に使わず、追記された日付も確認してください。',
        },
        {
          id: 'compare-network',
          title: '別端末と有線・Wi-Fiで、影響する範囲を比較する',
          summary: 'この比較は故障箇所を確定する検査ではありません。',
          time: '約5分',
          risk: 'low',
          actions: [
            '同じ回線の別端末で通常のWeb閲覧なども不安定か確認する。複数端末・複数サービスで失敗するなら、ルーターや回線の公式障害情報も調べる。',
            '自分で管理する接続で可能なら、同じPCを有線で比較する。有線だけ改善した結果はWi-Fi経路を調べる材料だが、ゲームサーバーの正常性までは証明しない。',
            'このゲームだけ失敗する場合は、ゲーム・環境・経路のどれか未確定として記録する。管理ネットワークのVPNを止めたり、ルーター初期化・ポート開放・ネットワークリセットを一括実行したりしない。',
          ],
          note: '戻し方：有線比較の終了後は元の接続へ戻します。WindowsのネットワークリセットはVPN等の再設定が必要になる場合があるため、この確認では行いません。',
        },
        {
          id: 'connection-record',
          title: '切断の範囲と比較結果を、適切な窓口へ渡す',
          summary: '不明な項目は不明のまま記録します。',
          time: '約3分',
          risk: 'low',
          actions: [
            '発生日時とタイムゾーン、モード・場面、エラー全文、Windows版、インストール先の種類、同期成功時刻、別端末と有線比較の結果を1件の記録にまとめる。',
            'ゲームだけなら公式ゲームサポート、同じ回線の複数端末でも通信できないなら回線事業者やルーターのサポート、このPCだけならPC・ネットワークの担当者へ相談する。これは相談先を選ぶ目安で、原因確定ではない。',
            '公式更新後に確認する時も、以前の場面と結果を比べる。ログや画面を渡す際はアカウント名・IPアドレスなどを公開せず、公式窓口が求める範囲だけを送る。',
          ],
        },
      ],
      avoid: [
        'ゲームだけの失敗を直ちにサーバー障害と断定しない',
        '告知がないことを正常の証明にしない',
        'ファイアウォール無効化、無差別なポート開放、ネットワークリセットを最初の手順にしない',
      ],
      cautions: [
        '公式告知は日付付き情報です。更新予定は配信完了や個々の切断原因の証明ではありません。',
        'ルーターの再起動でも同居人の通信を中断します。初期化とは区別し、管理していない機器は変更しないでください。',
      ],
      faqs: [
        {
          question: '他のサイトが見られるなら、ゲームサーバーが原因ですか？',
          answer:
            '断定できません。通常のWeb閲覧とゲームでは通信先や条件が違います。ゲームの環境、アカウント、経路なども未確定として、発生場面と比較結果を公式窓口へ渡します。',
        },
        {
          question: '有線で切れなければWi-Fiが故障していますか？',
          answer:
            '有線比較はWi-Fi経路を調べる手掛かりですが、故障の確定ではありません。同じ条件での結果を記録し、ルーターやPCの案内に沿って確認してください。',
        },
      ],
      related: [
        {
          href: '/games/ace-combat-8/time-sync-failed',
          label: '時刻同期が失敗する場合',
        },
        {
          href: '/games/ace-combat-8/not-launching',
          label: 'アプリが起動しない・クラッシュする場合',
        },
      ],
    },
    en: {
      title:
        'ST-3100001 After Time Sync: Compare Connection Scope and Official Notices',
      shortTitle: 'Disconnects after time sync',
      description:
        'If ACE COMBAT 8 still disconnects after Windows time sync, separate lobby, match and results-screen failures. Compare dated official notices, another device and Ethernet versus Wi-Fi.',
      lead: 'For ST-3100001 or disconnections in ACE COMBAT ONLINE after confirming successful Windows time synchronization. A closing game application and failed Windows synchronization need different checks.',
      summary:
        'Record the phase and time, then check relevant official notices and later updates. Compare another device on the same connection or Ethernet to narrow the scope: one game, this PC or the connection generally. A game-only failure does not prove a server outage, and no published notice does not prove normal service.',
      quickFacts: [
        {
          label: 'Separate the phase',
          value:
            'Lobby / match start / mid-match / results screen / application closing',
        },
        {
          label: 'Use dated notices',
          value:
            'Match the notice date, affected symptom and subsequent updates to your case',
        },
        {
          label: 'What comparison tells you',
          value:
            'Where to investigate next, not a confirmed cause or failed component',
        },
      ],
      diagnosis: [
        {
          symptom: 'Successful synchronization is unverified',
          cause: 'Confirm the Windows sync result first',
          stepId: 'confirm-phase',
        },
        {
          symptom: 'Only this game fails to match or play',
          cause:
            'Compare the affected symptom and environment with official notices',
          stepId: 'check-official-scope',
        },
        {
          symptom: 'Other connections fail or only Wi-Fi is unstable',
          cause: 'Compare devices and connection methods',
          stepId: 'compare-network',
        },
        {
          symptom: 'The cause remains unclear after comparison',
          cause: 'Give official support the observations you could verify',
          stepId: 'connection-record',
        },
      ],
      steps: [
        {
          id: 'confirm-phase',
          title: 'Separate the sync result from the failing game phase',
          summary:
            'Clock synchronization and game connectivity are different results.',
          time: 'About 2 minutes',
          risk: 'low',
          actions: [
            'Record the last successful Windows sync, full game error and event time. A clock that looks right is not enough; verify the sync result first.',
            'Distinguish failure to enter the lobby, failure at match start, a mid-match disconnect, missing results and the application closing. Do not combine different symptoms into one assumed cause.',
            'For the application closing, use launch/crash checks. For a failed sync, return to clock checks. Do not repeatedly enter matches just to reproduce the error.',
          ],
          guideLink: {
            href: '/en/games/ace-combat-8/time-sync-failed',
            label: 'Windows time synchronization fails',
            description:
              'Start here if successful synchronization is unverified.',
          },
        },
        {
          id: 'check-official-scope',
          title: 'Match dated official notices to your environment',
          summary:
            'Check whether the described scope matches what you observe.',
          time: 'About 3 minutes',
          risk: 'low',
          actions: [
            'Check official Steam news and PROJECT_ACES notices for the same mode and phase, followed by resolution or update information. The sources below link to the notices.',
            'The October 9, 2026 notice described ONLINE matchmaking issues in some environments and recommended Windows 11, the officially supported OS, and installation on an SSD. It said details of the release schedule and update contents would be announced once finalized. Check subsequent notices for the current status.',
            'Record your Windows version and whether the game is installed on an SSD. Meeting those conditions does not guarantee a fix, and the notice does not establish one cause for every ST-3100001 occurrence.',
          ],
          note: 'Reading notices needs no rollback. A historical notice alone cannot establish a current outage or completed repair; check the dates of later updates.',
        },
        {
          id: 'compare-network',
          title: 'Compare another device and Ethernet versus Wi-Fi',
          summary:
            'This narrows the investigation; it does not identify a failed part.',
          time: 'About 5 minutes',
          risk: 'low',
          actions: [
            'Check whether ordinary browsing is also unstable on another device using the same connection. If several devices and services fail, also check official router or internet-provider outage information.',
            'If available on a connection you manage, compare the same PC over Ethernet. Improvement only on Ethernet is a reason to investigate the Wi-Fi path, not proof that the game service is healthy.',
            'If only this game fails, record the game, environment and route as still unresolved. Do not stop a required managed-network VPN or batch router resets, port forwarding and Windows network resets.',
          ],
          note: 'Return to your original connection after comparison. A Windows network reset can require VPN and other software to be set up again, so it is not part of this check.',
        },
        {
          id: 'connection-record',
          title:
            'Send the scope and comparison results to the right support team',
          summary: 'Leave unknown information marked as unknown.',
          time: 'About 3 minutes',
          risk: 'low',
          actions: [
            'Prepare one record with event time and time zone, mode/phase, exact error, Windows version, installation-drive type, successful sync time and results from the other device and Ethernet comparison.',
            'For a game-only issue, start with official game support; for several devices on one connection, contact the provider/router support; for this PC alone, consult its PC or network support. These are routing choices, not confirmed causes.',
            'After an official update, compare with the original phase and result. Do not publicly expose account names or IP addresses in screenshots or logs; share only what the official support channel requests.',
          ],
        },
      ],
      avoid: [
        'Do not immediately label a game-only failure a server outage',
        'Do not treat the absence of a notice as proof of normal service',
        'Do not begin by disabling the firewall, opening arbitrary ports or resetting the network',
      ],
      cautions: [
        'Official notices are dated evidence. An update plan is not confirmation of release or of an individual disconnect’s cause.',
        'Even restarting a router interrupts other users. Distinguish restart from factory reset and do not change equipment you do not manage.',
      ],
      faqs: [
        {
          question: 'If websites work, must the game server be at fault?',
          answer:
            'No. Web browsing and the game use different destinations and conditions. The game environment, account and route may still matter; give official support the phase and comparison results.',
        },
        {
          question:
            'Does a stable Ethernet test prove the Wi-Fi hardware is faulty?',
          answer:
            'No. It is a clue to investigate the Wi-Fi path, not a hardware diagnosis. Record the conditions and follow the router or PC maker’s guidance.',
        },
      ],
      related: [
        {
          href: '/en/games/ace-combat-8/time-sync-failed',
          label: 'Windows synchronization itself fails',
        },
        {
          href: '/en/games/ace-combat-8/not-launching',
          label: 'The application will not start or crashes',
        },
      ],
    },
    zh: {
      title: '时间同步后仍出现 ST-3100001：比较网络范围与官方公告',
      shortTitle: '时间同步后仍断线',
      description:
        'ACE COMBAT 8 在同步 Windows 时间后仍断线时，区分大厅、对局和结算画面，结合有日期的官方公告、另一台设备以及有线／Wi-Fi 比较，确定下一步。',
      lead: '适用于确认 Windows 时间同步成功后，ACE COMBAT ONLINE 仍出现 ST-3100001 或断线。应用本身退出和 Windows 同步失败需要分别排查。',
      summary:
        '记录发生阶段和时间，查看对应的官方公告及后续更新，再比较同一网络上的其他设备或有线连接，缩小到单个游戏、这台电脑或整个连接的范围。只有游戏失败不能证明服务器故障，没有公告也不代表服务一定正常。',
      quickFacts: [
        {
          label: '先区分阶段',
          value: '大厅／开始对局／对局中／结算画面／应用退出',
        },
        { label: '公告要看日期', value: '对照发布日期、受影响症状和后续更新' },
        {
          label: '比较能说明什么',
          value: '帮助选择下一项检查，不能直接确定原因或损坏部件',
        },
      ],
      diagnosis: [
        {
          symptom: '尚未确认同步成功',
          cause: '先查看 Windows 同步结果',
          stepId: 'confirm-phase',
        },
        {
          symptom: '只有本游戏匹配或对局失败',
          cause: '对照官方公告的症状与环境',
          stepId: 'check-official-scope',
        },
        {
          symptom: '其他连接也中断，或只有 Wi-Fi 不稳定',
          cause: '比较设备与连接方式',
          stepId: 'compare-network',
        },
        {
          symptom: '比较后原因仍不明确',
          cause: '把可确认的观察交给官方支持',
          stepId: 'connection-record',
        },
      ],
      steps: [
        {
          id: 'confirm-phase',
          title: '区分同步结果与游戏出错阶段',
          summary: '时钟同步和游戏连接是不同结果。',
          time: '约 2 分钟',
          risk: 'low',
          actions: [
            '记录 Windows 上次同步成功时间、完整游戏错误和发生时间。时钟看起来正确还不够，应先确认同步结果。',
            '区分无法进入大厅、开局失败、对局中断线、无法进入结算和应用退出，不要把不同症状合成一个推测原因。',
            '应用退出时查看启动／崩溃排查；同步失败则回到时钟检查。不要只为复现而反复进入对局。',
          ],
          guideLink: {
            href: '/zh/games/ace-combat-8/time-sync-failed',
            label: 'Windows 时间同步失败的检查',
            description: '尚未确认同步成功时从这里开始。',
          },
        },
        {
          id: 'check-official-scope',
          title: '对照有日期的官方公告与自己的环境',
          summary: '确认公告描述的范围是否符合实际观察。',
          time: '约 3 分钟',
          risk: 'low',
          actions: [
            '在官方 Steam 新闻和 PROJECT_ACES 公告中寻找同一模式、阶段的问题，以及后续修复或更新信息。本文末尾列有公告链接。',
            '2026 年 10 月 9 日公告说明部分环境存在 ONLINE 匹配问题，推荐使用官方支持的 Windows 11，并将游戏安装在 SSD 上。公告表示，更新内容和发布时间将在确定后公布。当前进展应查看后续公告。',
            '记录 Windows 版本和游戏是否装在 SSD 上。满足这些条件不保证解决断线，公告也不能说明每一次 ST-3100001 都有同一个原因。',
          ],
          note: '阅读公告无需恢复设置。历史公告本身不能证明当前仍有故障或已完成修复，要看后续更新日期。',
        },
        {
          id: 'compare-network',
          title: '比较另一台设备以及有线与 Wi-Fi',
          summary: '用于缩小调查范围，不是硬件故障鉴定。',
          time: '约 5 分钟',
          risk: 'low',
          actions: [
            '查看同一网络上的另一台设备是否连普通网页也不稳定。多个设备和服务都失败时，同时检查路由器或网络运营商的官方故障信息。',
            '在自己管理的网络上，条件允许时用同一台电脑比较有线连接。只有有线改善，说明可继续检查 Wi-Fi 路径，但不能证明游戏服务正常。',
            '只有本游戏失败时，将游戏、环境和路径记为仍待确认。不要关闭受管理网络要求的 VPN，也不要批量执行路由器重置、端口转发和 Windows 网络重置。',
          ],
          note: '比较后恢复原来的连接方式。Windows 网络重置可能需要重新配置 VPN 等软件，本检查不执行该操作。',
        },
        {
          id: 'connection-record',
          title: '把影响范围与比较结果交给对应支持',
          summary: '不确定的项目就保留为未知。',
          time: '约 3 分钟',
          risk: 'low',
          actions: [
            '整理一份记录：发生时间和时区、模式／阶段、完整错误、Windows 版本、安装盘类型、同步成功时间，以及其他设备和有线比较结果。',
            '仅游戏有问题先联系游戏官方支持；同一网络多个设备异常可联系运营商或路由器支持；仅这台电脑异常可联系电脑或网络支持。这只是选择咨询对象，不代表原因已确定。',
            '官方更新后仍按原来的阶段比较结果。截图和日志中的账号名、IP 地址不要公开，只按官方渠道的要求提供必要范围。',
          ],
        },
      ],
      avoid: [
        '不要立刻把游戏单独失败判定为服务器故障',
        '没有公告不是正常运行的证明',
        '不要一开始就关闭防火墙、开放任意端口或重置网络',
      ],
      cautions: [
        '官方公告是带日期的依据。更新计划不等于已发布，也不能证明单次断线的原因。',
        '重启路由器也会中断他人连接，应与恢复出厂设置区分，不要更改自己不管理的设备。',
      ],
      faqs: [
        {
          question: '网页能打开，就一定是游戏服务器的问题吗？',
          answer:
            '不能这样判断。网页和游戏的目标与连接条件不同，游戏环境、账号和路径仍可能有关。请向官方提供阶段与比较结果。',
        },
        {
          question: '有线稳定能证明 Wi-Fi 硬件坏了吗？',
          answer:
            '不能。它只是检查 Wi-Fi 路径的线索。记录比较条件，再按路由器或电脑厂商的指引排查。',
        },
      ],
      related: [
        {
          href: '/zh/games/ace-combat-8/time-sync-failed',
          label: 'Windows 时间同步本身失败',
        },
        {
          href: '/zh/games/ace-combat-8/not-launching',
          label: '应用无法启动或崩溃',
        },
      ],
    },
    es: {
      title:
        'ST-3100001 después de sincronizar la hora: conexión y avisos oficiales',
      shortTitle: 'Desconexiones tras sincronizar',
      description:
        'Si ACE COMBAT 8 sigue desconectándose tras sincronizar Windows, distingue sala, partida y resultados. Compara avisos oficiales fechados, otro dispositivo y Ethernet frente a Wi-Fi.',
      lead: 'Para ST-3100001 o desconexiones de ACE COMBAT ONLINE tras confirmar la sincronización de Windows. El cierre de la aplicación y un fallo de sincronización requieren comprobaciones distintas.',
      summary:
        'Anota la fase y la hora, y revisa los avisos oficiales pertinentes y sus actualizaciones. Compara otro dispositivo de la misma conexión o Ethernet para delimitar si afecta al juego, a este PC o a la conexión general. Un fallo solo del juego no prueba una caída del servidor; la ausencia de avisos tampoco demuestra que funcione normalmente.',
      quickFacts: [
        {
          label: 'Distingue la fase',
          value:
            'Sala / inicio de partida / durante la partida / resultados / cierre de la aplicación',
        },
        {
          label: 'Avisos con fecha',
          value:
            'Compara fecha, síntoma afectado y actualizaciones posteriores con tu caso',
        },
        {
          label: 'Qué aporta la comparación',
          value:
            'Indica qué investigar después, sin confirmar una causa o componente averiado',
        },
      ],
      diagnosis: [
        {
          symptom: 'No has confirmado que la hora se sincronizó',
          cause: 'Comprueba primero el resultado de Windows',
          stepId: 'confirm-phase',
        },
        {
          symptom: 'Solo este juego falla al emparejar o jugar',
          cause: 'Compara síntoma y entorno con los avisos oficiales',
          stepId: 'check-official-scope',
        },
        {
          symptom: 'Falla otra comunicación o solo Wi-Fi es inestable',
          cause: 'Compara dispositivos y métodos de conexión',
          stepId: 'compare-network',
        },
        {
          symptom: 'La causa sigue sin estar clara',
          cause: 'Entrega a soporte las observaciones verificadas',
          stepId: 'connection-record',
        },
      ],
      steps: [
        {
          id: 'confirm-phase',
          title: 'Separa la sincronización y la fase del fallo',
          summary:
            'Sincronizar el reloj y conectar con el juego son resultados diferentes.',
          time: 'Unos 2 minutos',
          risk: 'low',
          actions: [
            'Anota la última sincronización correcta, el error completo del juego y la hora del suceso. Que el reloj parezca correcto no basta: confirma el resultado de sincronización.',
            'Distingue no entrar en la sala, fallar al iniciar, desconectarse durante la partida, no ver los resultados y que la aplicación se cierre. No agrupes síntomas distintos bajo una causa supuesta.',
            'Si la aplicación se cierra, consulta inicio/cierres. Si falla la sincronización, vuelve al reloj. No entres repetidamente en partidas solo para reproducir el error.',
          ],
          guideLink: {
            href: '/es/games/ace-combat-8/time-sync-failed',
            label: 'Falla la sincronización de hora de Windows',
            description: 'Empieza aquí si no has confirmado la sincronización.',
          },
        },
        {
          id: 'check-official-scope',
          title: 'Compara los avisos oficiales fechados con tu entorno',
          summary: 'Comprueba si su alcance coincide con lo que observas.',
          time: 'Unos 3 minutos',
          risk: 'low',
          actions: [
            'Busca en las noticias oficiales de Steam y PROJECT_ACES avisos del mismo modo y fase, y después información de resolución o actualización. Las fuentes al final enlazan los avisos.',
            'El aviso del 9 de octubre de 2026 describía problemas de emparejamiento ONLINE en algunos entornos y recomendaba Windows 11, el sistema operativo admitido oficialmente, e instalar el juego en un SSD. Indicaba que los detalles del calendario y el contenido de la actualización se anunciarían una vez definidos. Consulta los avisos posteriores para conocer el estado actual.',
            'Anota la versión de Windows y si el juego está instalado en un SSD. Cumplir esas condiciones no garantiza una solución, ni el aviso establece una única causa para todos los ST-3100001.',
          ],
          note: 'Leer avisos no requiere revertir ajustes. Un aviso histórico no demuestra una caída actual ni una reparación terminada; revisa las fechas posteriores.',
        },
        {
          id: 'compare-network',
          title: 'Compara otro dispositivo y Ethernet frente a Wi-Fi',
          summary:
            'Sirve para acotar la investigación, no para identificar una pieza averiada.',
          time: 'Unos 5 minutos',
          risk: 'low',
          actions: [
            'Comprueba si navegar normalmente también falla en otro dispositivo de la misma conexión. Si fallan varios dispositivos y servicios, revisa además los avisos oficiales del proveedor o router.',
            'Si es posible en una conexión que administras, compara el mismo PC por Ethernet. Mejorar solo por cable justifica revisar la ruta Wi-Fi, pero no demuestra que el servicio del juego esté bien.',
            'Si solo falla este juego, deja juego, entorno y ruta como no resueltos. No pares una VPN obligatoria ni combines restablecimientos del router, apertura de puertos y restablecimiento de red de Windows.',
          ],
          note: 'Vuelve a tu conexión original al terminar. Restablecer la red de Windows puede requerir configurar de nuevo VPN y otro software; no forma parte de esta comprobación.',
        },
        {
          id: 'connection-record',
          title: 'Entrega el alcance y los resultados al soporte adecuado',
          summary: 'Mantén los datos desconocidos como desconocidos.',
          time: 'Unos 3 minutos',
          risk: 'low',
          actions: [
            'Prepara un registro con hora y zona horaria, modo/fase, error exacto, versión de Windows, tipo de unidad de instalación, hora de sincronización y resultados del otro dispositivo y Ethernet.',
            'Si solo falla el juego, empieza por su soporte oficial; si afecta a varios dispositivos de la conexión, consulta al proveedor/router; si solo afecta a este PC, a su soporte de PC o red. Son opciones de contacto, no causas confirmadas.',
            'Después de una actualización oficial, compara la fase y el resultado originales. No publiques nombres de cuentas ni direcciones IP en capturas o registros; facilita solo lo solicitado por el canal oficial.',
          ],
        },
      ],
      avoid: [
        'No atribuyas inmediatamente un fallo solo del juego al servidor',
        'No interpretes la ausencia de avisos como prueba de normalidad',
        'No empieces desactivando el firewall, abriendo puertos arbitrarios o restableciendo la red',
      ],
      cautions: [
        'Los avisos son información fechada. Un plan de actualización no confirma su publicación ni la causa de una desconexión concreta.',
        'Reiniciar el router también interrumpe a otras personas. No lo confundas con restablecerlo de fábrica ni cambies equipos que no administras.',
      ],
      faqs: [
        {
          question:
            'Si funcionan las webs, ¿debe fallar el servidor del juego?',
          answer:
            'No. La navegación y el juego usan destinos y condiciones diferentes. El entorno, la cuenta y la ruta aún pueden influir; entrega a soporte la fase y los resultados.',
        },
        {
          question:
            '¿Una prueba estable por Ethernet confirma una avería de Wi-Fi?',
          answer:
            'No. Es una pista para investigar la ruta Wi-Fi, no un diagnóstico de hardware. Anota las condiciones y sigue las indicaciones del fabricante del router o PC.',
        },
      ],
      related: [
        {
          href: '/es/games/ace-combat-8/time-sync-failed',
          label: 'Falla la sincronización de Windows',
        },
        {
          href: '/es/games/ace-combat-8/not-launching',
          label: 'La aplicación no inicia o se cierra',
        },
      ],
    },
  },
};
