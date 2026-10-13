import type { FollowupGuide } from './types';

export const timeSyncGuide: FollowupGuide = {
  gameSlug: 'ace-combat-8',
  gameName: 'ACE COMBAT 8',
  slug: 'time-sync-failed',
  category: 'server',
  checkedAt: '2026-10-13',
  relatedSlugs: ['error-st-3100001', 'connection-after-time-sync'],
  sources: [
    {
      url: 'https://learn.microsoft.com/en-us/windows-server/networking/windows-time-service/windows-time-service-tools-and-settings',
      labels: {
        ja: 'Microsoft Learn：Windows 11対応の時刻サービスとw32tm（英語）',
        en: 'Microsoft Learn: Windows Time tools and settings, including Windows 11',
        zh: 'Microsoft Learn：Windows 时间服务与 w32tm，适用于 Windows 11（英语）',
        es: 'Microsoft Learn: herramientas de hora de Windows, también para Windows 11 (inglés)',
      },
    },
    {
      url: 'https://learn.microsoft.com/en-us/troubleshoot/windows-client/active-directory/w32time-not-start-on-workgroup',
      labels: {
        ja: 'Microsoft Learn：ワークグループPCのW32Timeとトリガー起動（英語）',
        en: 'Microsoft Learn: W32Time trigger-start behavior on workgroup PCs',
        zh: 'Microsoft Learn：工作组电脑上 W32Time 的触发启动行为（英语）',
        es: 'Microsoft Learn: inicio por desencadenador de W32Time en grupos de trabajo (inglés)',
      },
    },
  ],
  copy: {
    ja: {
      title:
        'Windowsの時刻同期ができない時の確認｜ST-3100001の対処で止まった場合',
      shortTitle: 'Windowsの時刻同期に失敗',
      description:
        '「今すぐ同期」が失敗する時に、実際のエラー・最終同期時刻・同期元を確認。W32Timeの停止表示と同期失敗を区別し、管理PCでは設定を変更せず相談します。',
      lead: 'ST-3100001の時刻確認で、Windows 11の同期自体が失敗する人向けです。同期は成功したのにゲームだけ切断される場合は、接続の切り分け記事へ進んでください。',
      summary:
        '同期画面のエラーと最終成功時刻を先に確認します。自分で管理するPCならw32tmのstatusとsourceで状況を読み、必要な場合だけ再同期します。「サービスが停止中」や時差測定の結果だけで原因・成功を決めず、同期成功後もゲームが切れる場合は回線と公式告知の確認へ切り替えます。',
      quickFacts: [
        {
          label: '控えるもの',
          value: '失敗した時刻、エラー全文、最終成功時刻、PCが管理対象か',
        },
        {
          label: 'まず読み取るコマンド',
          value: 'w32tm /query /status → w32tm /query /source',
        },
        {
          label: '停止表示の意味',
          value:
            'ワークグループPCでは通常のトリガー起動でもManual／Stoppedになる',
        },
      ],
      diagnosis: [
        {
          symptom: '設定が無効・組織で管理と表示される',
          cause: '管理方針を変えず担当者へ確認',
          stepId: 'sync-settings',
        },
        {
          symptom: '同期失敗・最終成功時刻が分からない',
          cause: 'エラーと同期元を読み取る',
          stepId: 'read-time-status',
        },
        {
          symptom: '個人PCで再同期が必要',
          cause: '一度だけ再同期し、成功時刻を確認',
          stepId: 'retry-time-sync',
        },
        {
          symptom: '時刻同期は成功、ゲームだけ切れる',
          cause: '時刻の操作を繰り返さず接続を比較',
          stepId: 'time-next-check',
        },
      ],
      steps: [
        {
          id: 'sync-settings',
          title: '同期画面とPCの管理状況を確認する',
          summary: '時刻の表示と同期処理の結果を分けます。',
          time: '約2分',
          risk: 'low',
          actions: [
            '設定 → 時刻と言語 → 日付と時刻で、自動設定、現在地に合うタイムゾーン、最終同期表示とエラーを控える。',
            '学校・会社のPCや組織で管理される設定は変更せず、エラーと時刻を管理者へ渡す。個人PCでは「今すぐ同期」を一度試し、表示された結果を残す。',
            'タイムゾーンを誤って変更した場合は実際の地域へ戻す。ゲームを通すために時計を手動でずらさない。',
          ],
        },
        {
          id: 'read-time-status',
          title: '同期状態と同期元を読み取る',
          summary: '次のコマンドは設定変更ではなく確認用です。',
          time: '約3分',
          risk: 'low',
          actions: [
            '自分で管理するPCで、コマンドプロンプトを「管理者として実行」。w32tm /query /status と w32tm /query /source をそれぞれ実行する。',
            '最終成功時刻（Last Successful Sync Time）、Source、実際のエラーを控える。取得に失敗したら「未確認」とし、古い時刻を今回の同期成功と扱わない。',
            'W32TimeがManual／Stoppedでも、それだけでは故障ではない。ドメインの同期元が表示された場合は勝手に公開サーバーへ変更せず管理者へ相談する。',
          ],
          note: '読み取りだけなら戻す設定はありません。出力を公開する時は端末名や組織名を隠してください。',
        },
        {
          id: 'retry-time-sync',
          title: '必要な場合だけ再同期し、成功した時刻を確認する',
          summary: '個人PCで同期が必要と分かった場合の追加確認です。',
          time: '約3分',
          risk: 'low',
          actions: [
            '作業を保存し、管理者のコマンドプロンプトで w32tm /resync を一度実行する。権限・サービス・時刻データのエラーが出たら全文を残し、設定を次々変えない。',
            '完了表示が出たら w32tm /query /status で最終成功時刻が今回の試行に対応するか確認する。成功確認後にSteamとゲームを再起動する。',
            'stripchartは相手との時差測定です。W32Timeとは送信元ポートが異なるため、測定成功だけでは同期成功を証明しません。',
          ],
          note: '同期後は正しい自動時刻を維持します。以前のずれた時計に戻したり、サービス再登録・レジストリ変更・ファイアウォール無効化を行ったりしません。',
        },
        {
          id: 'time-next-check',
          title: '同期失敗と、同期後のゲーム切断を分けて相談する',
          summary: '同じ操作を繰り返す前に次の担当を決めます。',
          time: '約3分',
          risk: 'low',
          actions: [
            '同期できない場合は、Windowsのバージョン、エラー、status/sourceで確認できた範囲、最後に成功した日時をPCメーカーまたは管理者へ渡す。',
            '同期は成功したのにゲームだけ切れる場合は、ロビー・試合開始・試合中・結果画面のどこかを記録し、次の接続確認へ進む。',
            '同期元を強制変更したり、サーバー向けレジストリ手順を家庭用PCへ流用したりしない。ネットワークの変更が必要かは管理者に確認する。',
          ],
          guideLink: {
            href: '/games/ace-combat-8/connection-after-time-sync',
            label: '時刻同期後も切断される場合の切り分け',
            description: '同期成功後の次の確認です。',
          },
        },
      ],
      avoid: [
        '停止表示だけでサービスの起動方式を変更しない',
        'ゲームのために時計を手動でずらさない',
        'レジストリ修正・再登録・保護機能の無効化を一括実行しない',
      ],
      cautions: [
        '時刻同期の成功は、ST-3100001の解消やゲームサーバーの正常性を保証しません。',
        '管理PCでは会社・学校の同期方針を優先し、権限がない操作は担当者に依頼してください。',
      ],
      faqs: [
        {
          question: 'Windows Timeが停止中なら、それが原因ですか？',
          answer:
            '停止表示だけでは判断できません。ワークグループPCではトリガー起動の既定動作で停止している場合があります。実際の同期結果と成功時刻を確認します。',
        },
        {
          question: 'stripchartが0秒に近ければ同期できていますか？',
          answer:
            '測定時の相手との時差が小さいことは分かりますが、Windowsの同期処理が成功した証明にはなりません。同期状態と最終成功時刻を別に確認してください。',
        },
      ],
      related: [
        {
          href: '/games/ace-combat-8/connection-after-time-sync',
          label: '同期後も切断される場合',
        },
        {
          href: '/games/ace-combat-8/error-st-3100001',
          label: 'ST-3100001の最初の確認',
        },
      ],
    },
    en: {
      title: 'Windows Time Sync Fails: Checks Before Retrying ST-3100001',
      shortTitle: 'Windows time sync fails',
      description:
        'Check the actual sync error, last successful sync and time source in Windows 11. Distinguish a stopped W32Time service from a failed sync and avoid changing managed-PC policy.',
      lead: 'Use this when Windows 11 time synchronization itself fails while checking ST-3100001. If synchronization succeeded but the game still disconnects, use the connection guide instead.',
      summary:
        'Check the sync error and last successful time first. On a PC you manage, read w32tm status and source before requesting another sync. A stopped service or a successful offset measurement alone cannot identify the cause or prove synchronization. Move to connection checks once time sync succeeds.',
      quickFacts: [
        {
          label: 'Record first',
          value:
            'Attempt time, exact error, last successful sync and whether the PC is managed',
        },
        {
          label: 'Read-only checks',
          value: 'w32tm /query /status → w32tm /query /source',
        },
        {
          label: 'Stopped does not prove failure',
          value:
            'Manual/Stopped can be normal trigger-start behavior on a workgroup PC',
        },
      ],
      diagnosis: [
        {
          symptom: 'Settings are disabled or managed by an organization',
          cause: 'Ask the administrator without changing policy',
          stepId: 'sync-settings',
        },
        {
          symptom: 'Sync fails or its last success is unclear',
          cause: 'Read the error and time source',
          stepId: 'read-time-status',
        },
        {
          symptom: 'Your personal PC still needs a sync',
          cause: 'Request one sync and verify its time',
          stepId: 'retry-time-sync',
        },
        {
          symptom: 'Time sync succeeded; only the game disconnects',
          cause: 'Compare connections instead of repeating clock changes',
          stepId: 'time-next-check',
        },
      ],
      steps: [
        {
          id: 'sync-settings',
          title: 'Check the sync screen and who manages the PC',
          summary:
            'Separate the displayed clock from the result of synchronization.',
          time: 'About 2 minutes',
          risk: 'low',
          actions: [
            'Open Settings → Time & language → Date & time. Record automatic-time settings, the correct local time zone, the last sync shown and any error.',
            'For a work or school PC, leave managed settings unchanged and give the administrator the error and attempt time. On your own PC, try Sync now once and record its result.',
            'If you changed the time zone by mistake, restore your actual region. Do not offset the clock manually to get into the game.',
          ],
        },
        {
          id: 'read-time-status',
          title: 'Read the sync status and time source',
          summary: 'These queries inspect settings; they do not replace them.',
          time: 'About 3 minutes',
          risk: 'low',
          actions: [
            'On a PC you manage, open Command Prompt as administrator. Run w32tm /query /status and w32tm /query /source separately.',
            'Record Last Successful Sync Time, Source and any actual error. Mark failed queries as unverified; an old timestamp is not proof that this attempt succeeded.',
            'Manual/Stopped for W32Time alone does not mean it is broken. If a domain source appears, consult its administrator rather than switching to a public server.',
          ],
          note: 'Read-only queries need no rollback. Remove computer and organization names before posting output publicly.',
        },
        {
          id: 'retry-time-sync',
          title: 'Request a sync only when needed, then verify its time',
          summary:
            'An additional check for a personal PC that still needs synchronization.',
          time: 'About 3 minutes',
          risk: 'low',
          actions: [
            'Save your work, then run w32tm /resync once in an administrator Command Prompt. If it reports an access, service or time-data error, keep the full message and stop changing settings.',
            'After a completion message, run w32tm /query /status and check that Last Successful Sync Time matches this attempt. Restart Steam and the game after confirming success.',
            'stripchart measures an offset. It uses a different source port from the W32Time client, so a successful measurement does not prove a successful clock sync.',
          ],
          note: 'Keep the corrected automatic time. Do not restore an inaccurate clock, re-register the service, edit the registry or disable the firewall.',
        },
        {
          id: 'time-next-check',
          title: 'Separate Windows sync failure from a game disconnection',
          summary: 'Choose the next check before repeating the same operation.',
          time: 'About 3 minutes',
          risk: 'low',
          actions: [
            'If sync still fails, give the PC maker or administrator your Windows version, error, available status/source information and last successful sync time.',
            'If sync succeeds but the game disconnects, record whether it happens in the lobby, at match start, during play or on the results screen, then continue to connection checks.',
            'Do not force a new time source or copy Windows Server registry procedures onto a home PC. Ask the administrator whether any network change is necessary.',
          ],
          guideLink: {
            href: '/en/games/ace-combat-8/connection-after-time-sync',
            label: 'Connection checks after successful time sync',
            description: 'Continue here once Windows synchronization works.',
          },
        },
      ],
      avoid: [
        'Do not change startup policy based only on a stopped service',
        'Do not deliberately offset the clock for a game',
        'Do not batch registry, service-registration or security changes',
      ],
      cautions: [
        'Successful time sync does not guarantee that ST-3100001 is fixed or that the game service is healthy.',
        'On managed PCs, follow the organization’s time policy and ask its administrator to handle restricted actions.',
      ],
      faqs: [
        {
          question: 'Does a stopped Windows Time service explain the failure?',
          answer:
            'Not by itself. A workgroup PC can stop the service as part of its default trigger-start behavior. Check the actual sync result and last successful time.',
        },
        {
          question: 'Does a near-zero stripchart result prove synchronization?',
          answer:
            'It shows a small measured difference from that source at that moment, not that the Windows sync operation succeeded. Check status and the last successful sync separately.',
        },
      ],
      related: [
        {
          href: '/en/games/ace-combat-8/connection-after-time-sync',
          label: 'Still disconnecting after time sync',
        },
        {
          href: '/en/games/ace-combat-8/error-st-3100001',
          label: 'ST-3100001: the first checks',
        },
      ],
    },
    zh: {
      title: 'Windows 时间同步失败：排查 ST-3100001 前先确认同步结果',
      shortTitle: 'Windows 时间同步失败',
      description:
        '在 Windows 11 中查看同步错误、上次成功时间和时间源。区分 W32Time 停止状态与真正的同步失败，受管理的电脑不要自行修改策略。',
      lead: '适用于排查 ST-3100001 时，Windows 11 的时间同步本身失败的情况。如果已经同步成功但游戏仍断线，请转到连接排查。',
      summary:
        '先看同步错误和上次成功时间。自己管理的电脑可用 w32tm 查询状态与时间源，确有需要时再请求同步。服务停止或偏差测量成功都不能单独证明原因或同步成功；确认同步成功后，应转查游戏连接。',
      quickFacts: [
        {
          label: '先记录',
          value: '尝试时间、完整错误、上次成功同步时间、电脑是否受管理',
        },
        {
          label: '只读查询',
          value: 'w32tm /query /status → w32tm /query /source',
        },
        {
          label: '停止不等于故障',
          value: '工作组电脑采用触发启动时，Manual／Stopped 可能是正常状态',
        },
      ],
      diagnosis: [
        {
          symptom: '设置不可用或显示由组织管理',
          cause: '不改变策略，先联系管理员',
          stepId: 'sync-settings',
        },
        {
          symptom: '同步失败或不清楚上次成功时间',
          cause: '读取错误与时间源',
          stepId: 'read-time-status',
        },
        {
          symptom: '个人电脑仍需要同步',
          cause: '尝试一次后核对成功时间',
          stepId: 'retry-time-sync',
        },
        {
          symptom: '同步成功，但游戏仍断线',
          cause: '停止反复调整时钟，比较连接范围',
          stepId: 'time-next-check',
        },
      ],
      steps: [
        {
          id: 'sync-settings',
          title: '查看同步页面和电脑的管理方式',
          summary: '区分时钟显示与同步操作的结果。',
          time: '约 2 分钟',
          risk: 'low',
          actions: [
            '打开设置 → 时间和语言 → 日期和时间，记录自动设置、所在地正确时区、上次同步显示与错误。',
            '公司或学校电脑不要改变受管理设置，将错误与尝试时间交给管理员。自己的电脑可点击一次立即同步，并记录结果。',
            '如果误改时区，恢复实际所在地。不要为了进入游戏而故意调整时钟偏差。',
          ],
        },
        {
          id: 'read-time-status',
          title: '读取同步状态与时间源',
          summary: '这些命令用于查询，不会替换配置。',
          time: '约 3 分钟',
          risk: 'low',
          actions: [
            '在自己管理的电脑上，以管理员身份打开命令提示符，分别运行 w32tm /query /status 和 w32tm /query /source。',
            '记录 Last Successful Sync Time、Source 和实际错误。查询失败就记为未确认，不要把旧时间当成本次同步成功。',
            'W32Time 显示 Manual／Stopped 不代表已经损坏。出现域时间源时，应联系管理员，不要擅自改成公共服务器。',
          ],
          note: '只读查询无需恢复设置。公开输出前隐藏电脑名和组织名。',
        },
        {
          id: 'retry-time-sync',
          title: '必要时请求同步，并核对成功时间',
          summary: '仅适用于确实仍需同步的个人电脑。',
          time: '约 3 分钟',
          risk: 'low',
          actions: [
            '保存工作后，在管理员命令提示符中运行一次 w32tm /resync。如果出现权限、服务或时间数据错误，保留完整消息，不要连续更改设置。',
            '出现完成消息后，用 w32tm /query /status 确认上次成功时间是否对应本次尝试。确认成功后重启 Steam 和游戏。',
            'stripchart 测量的是时差，使用的源端口与 W32Time 客户端不同，因此测量成功不等于时钟同步成功。',
          ],
          note: '保留正确的自动时间，不要恢复错误时钟，也不要重新注册服务、修改注册表或关闭防火墙。',
        },
        {
          id: 'time-next-check',
          title: '区分 Windows 同步失败和游戏断线',
          summary: '先确定下一步，不要重复相同操作。',
          time: '约 3 分钟',
          risk: 'low',
          actions: [
            '仍无法同步时，把 Windows 版本、错误、可读取的 status/source 信息和上次成功时间交给电脑厂商或管理员。',
            '同步成功但游戏断线时，记录发生在大厅、开局、对局中还是结算画面，再进入连接排查。',
            '不要强制替换时间源，也不要把 Windows Server 的注册表步骤照搬到家用电脑。是否需要更改网络，请先询问管理员。',
          ],
          guideLink: {
            href: '/zh/games/ace-combat-8/connection-after-time-sync',
            label: '时间同步成功后的连接排查',
            description: 'Windows 已能同步时继续这里。',
          },
        },
      ],
      avoid: [
        '不要仅凭停止状态修改启动策略',
        '不要为了游戏故意调错时钟',
        '不要批量执行注册表、服务注册或安全设置更改',
      ],
      cautions: [
        '时间同步成功不保证 ST-3100001 消失，也不能证明游戏服务正常。',
        '受管理的电脑应遵守组织的时间策略，受限制操作交给管理员处理。',
      ],
      faqs: [
        {
          question: 'Windows Time 停止就说明它导致了失败吗？',
          answer:
            '不能单独这样判断。工作组电脑可能按默认的触发启动机制停止服务，需要查看实际同步结果与上次成功时间。',
        },
        {
          question: 'stripchart 接近零就说明已同步吗？',
          answer:
            '只能说明测量时与该时间源的差距较小，不能证明 Windows 同步操作成功。请单独查看状态与上次成功时间。',
        },
      ],
      related: [
        {
          href: '/zh/games/ace-combat-8/connection-after-time-sync',
          label: '时间同步后仍然断线',
        },
        {
          href: '/zh/games/ace-combat-8/not-launching',
          label: 'ACE COMBAT 8 无法启动或崩溃',
        },
      ],
    },
    es: {
      title:
        'Falla la sincronización de hora de Windows: qué revisar antes de reintentar ST-3100001',
      shortTitle: 'Falla la sincronización de hora',
      description:
        'Comprueba el error, la última sincronización y el origen de hora en Windows 11. Un servicio W32Time detenido no demuestra un fallo; respeta las directivas de los equipos administrados.',
      lead: 'Para cuando falla la sincronización de Windows 11 al comprobar ST-3100001. Si la hora ya se sincronizó pero el juego se desconecta, consulta la guía de conexión.',
      summary:
        'Revisa primero el error y la última sincronización correcta. En un PC que administras, consulta el estado y el origen con w32tm antes de solicitar otra sincronización. Un servicio detenido o una medición correcta del desfase no bastan para demostrar la causa ni el éxito. Tras sincronizar, pasa a comprobar la conexión.',
      quickFacts: [
        {
          label: 'Anota primero',
          value:
            'Hora del intento, error completo, última sincronización y si el PC está administrado',
        },
        {
          label: 'Consultas de solo lectura',
          value: 'w32tm /query /status → w32tm /query /source',
        },
        {
          label: 'Detenido no implica avería',
          value:
            'Manual/Stopped puede ser normal con el inicio por desencadenador en un grupo de trabajo',
        },
      ],
      diagnosis: [
        {
          symptom: 'Ajustes bloqueados o administrados por una organización',
          cause: 'Consulta al administrador sin cambiar directivas',
          stepId: 'sync-settings',
        },
        {
          symptom: 'La sincronización falla o su último éxito no está claro',
          cause: 'Lee el error y el origen de hora',
          stepId: 'read-time-status',
        },
        {
          symptom: 'Tu PC personal aún necesita sincronizarse',
          cause: 'Solicita una sincronización y comprueba su hora',
          stepId: 'retry-time-sync',
        },
        {
          symptom: 'La hora se sincronizó, pero el juego se desconecta',
          cause: 'Compara conexiones sin seguir cambiando el reloj',
          stepId: 'time-next-check',
        },
      ],
      steps: [
        {
          id: 'sync-settings',
          title:
            'Revisa la pantalla de sincronización y quién administra el PC',
          summary:
            'Distingue el reloj mostrado del resultado de sincronizarlo.',
          time: 'Unos 2 minutos',
          risk: 'low',
          actions: [
            'Abre Configuración → Hora e idioma → Fecha y hora. Anota los ajustes automáticos, la zona horaria correcta de tu ubicación, la última sincronización y cualquier error.',
            'En un PC de trabajo o estudios, no cambies ajustes administrados: entrega el error y la hora al administrador. En tu propio PC, pulsa Sincronizar ahora una vez y anota el resultado.',
            'Si cambiaste la zona horaria por error, restaura la de tu ubicación real. No desajustes manualmente el reloj para entrar en el juego.',
          ],
        },
        {
          id: 'read-time-status',
          title: 'Consulta el estado y el origen de hora',
          summary: 'Estas consultas leen la configuración; no la sustituyen.',
          time: 'Unos 3 minutos',
          risk: 'low',
          actions: [
            'En un PC que administras, abre Símbolo del sistema como administrador. Ejecuta por separado w32tm /query /status y w32tm /query /source.',
            'Anota Last Successful Sync Time, Source y cualquier error. Marca las consultas fallidas como no verificadas: una fecha antigua no demuestra que este intento funcionara.',
            'Manual/Stopped en W32Time no significa por sí solo que esté averiado. Si aparece un origen de dominio, consulta al administrador antes de cambiarlo por un servidor público.',
          ],
          note: 'Las consultas no necesitan reversión. Oculta nombres de equipos y organizaciones antes de publicar la salida.',
        },
        {
          id: 'retry-time-sync',
          title:
            'Solicita una sincronización solo si hace falta y comprueba su hora',
          summary:
            'Comprobación adicional para un PC personal que todavía necesita sincronizarse.',
          time: 'Unos 3 minutos',
          risk: 'low',
          actions: [
            'Guarda el trabajo y ejecuta w32tm /resync una vez como administrador. Si aparece un error de acceso, servicio o datos de hora, conserva el mensaje completo y deja de cambiar ajustes.',
            'Tras el mensaje de finalización, consulta w32tm /query /status y comprueba que Last Successful Sync Time corresponde al intento. Reinicia Steam y el juego después de confirmar el éxito.',
            'stripchart mide el desfase y usa un puerto de origen distinto del cliente W32Time. Una medición correcta no demuestra que el reloj se haya sincronizado.',
          ],
          note: 'Mantén la hora automática correcta. No restaures un reloj incorrecto, registres de nuevo el servicio, edites el Registro ni desactives el firewall.',
        },
        {
          id: 'time-next-check',
          title: 'Separa el fallo de Windows de la desconexión del juego',
          summary:
            'Elige el siguiente paso antes de repetir la misma operación.',
          time: 'Unos 3 minutos',
          risk: 'low',
          actions: [
            'Si sigue fallando, entrega al fabricante o administrador la versión de Windows, el error, la información disponible de status/source y la última sincronización correcta.',
            'Si la sincronización funciona pero el juego se desconecta, anota si ocurre en la sala, al empezar, durante la partida o en los resultados y pasa a comprobar la conexión.',
            'No fuerces otro origen de hora ni copies procedimientos del Registro de Windows Server en un PC doméstico. Consulta si hace falta algún cambio de red.',
          ],
          guideLink: {
            href: '/es/games/ace-combat-8/connection-after-time-sync',
            label: 'Comprobar la conexión después de sincronizar',
            description: 'Continúa aquí cuando Windows ya pueda sincronizarse.',
          },
        },
      ],
      avoid: [
        'No cambies el inicio del servicio solo porque esté detenido',
        'No desajustes el reloj para un juego',
        'No apliques cambios de Registro, servicio y seguridad en bloque',
      ],
      cautions: [
        'Sincronizar la hora no garantiza que desaparezca ST-3100001 ni que el servicio del juego funcione correctamente.',
        'En equipos administrados, respeta la política horaria y deja las acciones restringidas al administrador.',
      ],
      faqs: [
        {
          question: '¿Un servicio Windows Time detenido explica el fallo?',
          answer:
            'No por sí solo. En un grupo de trabajo puede detenerse como parte del inicio por desencadenador predeterminado. Comprueba el resultado real y la última sincronización correcta.',
        },
        {
          question:
            '¿Un resultado de stripchart cercano a cero demuestra la sincronización?',
          answer:
            'Muestra una diferencia pequeña con ese origen en ese momento, pero no demuestra que Windows haya sincronizado. Consulta el estado y la última sincronización por separado.',
        },
      ],
      related: [
        {
          href: '/es/games/ace-combat-8/connection-after-time-sync',
          label: 'Desconexiones después de sincronizar',
        },
        {
          href: '/es/games/ace-combat-8/not-launching',
          label: 'ACE COMBAT 8 no inicia o se cierra',
        },
      ],
    },
  },
};
