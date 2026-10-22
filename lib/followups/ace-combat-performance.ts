import type { FollowupGuide } from './types';

export const aceCombatPerformanceGuide: FollowupGuide = {
  gameSlug: 'ace-combat-8',
  gameName: 'ACE COMBAT 8',
  slug: 'stutter-audio-cutting-out',
  category: 'display',
  checkedAt: '2026-10-16',
  relatedSlugs: [
    'crashing-memory',
    'not-launching',
    'hotas-not-recognized',
    'error-st-3100001',
    'connection-after-time-sync',
  ],
  sources: [
    {
      url: 'https://enso-order.acecombat.jp/',
      labels: {
        ja: 'ゲーム公式：PC版システム要件（Windows 11・SSDなど）',
        en: 'Publisher: PC system requirements, including Windows 11 and SSD (Japanese)',
        zh: '游戏官方：PC 配置要求，包括 Windows 11 与 SSD（日语）',
        es: 'Editor: requisitos de PC, incluidos Windows 11 y SSD (japonés)',
      },
    },
    {
      url: 'https://steamcommunity.com/app/2288340/allnews/',
      labels: {
        ja: '公式告知本文：10月9日の更新予定・マッチメイキング、10月2日の報告項目（英語）',
        en: 'Official notices: October 9 update plans/matchmaking and October 2 report details',
        zh: '官方公告正文：10月9日更新计划／匹配、10月2日报告项目（英语）',
        es: 'Avisos oficiales: planes del 9 de octubre e información para informes del 2 de octubre (inglés)',
      },
    },
    {
      url: 'https://steamcommunity.com/app/2288340/discussions/0/594068631729510380/',
      labels: {
        ja: '利用者報告：長く遊ぶと音が途切れる・カクつく相談（公式情報ではない・英語）',
        en: 'Player discussion: audio cuts and stutter during longer play; not official guidance',
        zh: '玩家讨论：游玩较久后声音断续与卡顿；非官方信息（英语）',
        es: 'Debate de jugadores: cortes de audio y tirones con el tiempo; no es información oficial (inglés)',
      },
    },
    {
      url: 'https://www.reddit.com/r/acecombat/comments/1x6sqh4/ace_combat_8_immensely_slow_laggy_and_stuttery/',
      labels: {
        ja: '利用者報告：再インストール後の低速化相談（原因・解決は未確定・英語）',
        en: 'Player report: slowdown after reinstalling; cause and solution unconfirmed',
        zh: '玩家报告：重装后变慢；原因与解决办法未确认（英语）',
        es: 'Informe de un jugador: lentitud tras reinstalar; causa y solución sin confirmar (inglés)',
      },
    },
    {
      url: 'https://support.microsoft.com/en-us/windows/experience/system-configuration-tools-in-windows',
      labels: {
        ja: 'Microsoft公式：タスクマネージャーで負荷を確認する（英語）',
        en: 'Microsoft: observe resource use with Task Manager',
        zh: 'Microsoft 官方：使用任务管理器查看资源使用情况（英语）',
        es: 'Microsoft: observar recursos con el Administrador de tareas (inglés)',
      },
    },
    {
      url: 'https://support.microsoft.com/en-us/windows/hardware/audio/fix-sound-or-audio-problems-in-windows',
      labels: {
        ja: 'Microsoft公式：Windowsの出力先・接続・音量・音声拡張を確認する（英語）',
        en: 'Microsoft: sound output, connections, volume and audio enhancements',
        zh: 'Microsoft 官方：声音输出、连接、音量与音频增强（英语）',
        es: 'Microsoft: salida de sonido, conexiones, volumen y mejoras de audio (inglés)',
      },
    },
  ],
  copy: {
    ja: {
      title:
        'エースコンバット8がプレイ中に重くなる・カクつく・音が途切れる時の確認【PC版】',
      shortTitle: 'プレイ中のカクつき・音切れ',
      description:
        'エスコン8で長く遊ぶほど重くなる、ムービーやミッション中にカクつく・音が途切れる場合を切り分け。Windows 11・SSDの要件、同じ場面での負荷比較、音声だけの不調、報告に必要な記録を案内します。',
      lead: 'PC／Steam版でゲームは起動するものの、映像や音声が不安定な場合向けです。出典と比較手順を整理した記事で、当サイトの実機検証による修正方法ではありません。',
      summary:
        '最初から重いのか、遊び続けると悪化するのか、音声だけが途切れるのかを分けます。Windows 11・SSDなどの要件と更新を確認し、同じ場面で設定を1項目ずつ比較してください。映像が滑らかで音だけ切れるなら出力機器を確認します。利用者報告はありますが、メモリリークや特定パッチが原因・修正済みとは確認できません。',
      quickFacts: [
        {
          label: '区別する症状',
          value:
            '起動直後から重い／時間とともに悪化／音だけ途切れる／アプリが終了する',
        },
        {
          label: '公式で確認できること',
          value:
            'Windows 11・SSDなどの要件。10月9日告知は更新の予定で、今回の症状の修正完了ではない',
        },
        {
          label: '利用者報告の範囲',
          value:
            '長時間プレイ中の音切れ、ミッション進行に伴うカクつき、再インストール後の低速化。原因は未確定',
        },
      ],
      diagnosis: [
        {
          symptom: '起動直後から低FPS・読み込みが遅い',
          cause: '実際のインストール先・要件・更新を確認',
          stepId: 'check-requirements-updates',
        },
        {
          symptom: '最初は滑らかで、時間がたつとカクつく',
          cause: '経過時間と同じ場面の負荷を比較',
          stepId: 'compare-session-load',
        },
        {
          symptom: '映像も音も同時に乱れる',
          cause: '設定や常駐アプリを1項目ずつ比較',
          stepId: 'compare-session-load',
        },
        {
          symptom: '映像は正常で音だけ途切れる／別アプリも無音',
          cause: '音声の出力先・機器・Windowsを切り分け',
          stepId: 'compare-audio-path',
        },
        {
          symptom: 'ゲームが終了する／ST-3100001が出る',
          cause: 'クラッシュ・通信エラーを別記事で確認',
          stepId: 'record-performance',
        },
      ],
      steps: [
        {
          id: 'record-session',
          title: '悪くなるタイミングと、映像・音声の状態を記録する',
          summary: '遅いという感覚だけで原因を決めません。',
          time: '確認約3分・再現時間は別',
          risk: 'low',
          actions: [
            '起動直後からか、何分ほど遊ぶと悪化するか、ミッション名・ムービー・ロード中・オンラインのどこで起きるかを控える。安全に再現できる場面で比較し、対戦参加を繰り返して調べない。',
            '映像の停止、操作の遅れ、音切れ、アプリ自体の終了を分ける。FPS表示が使えるなら同じ条件で数値を控える。シェーダー準備など進捗が表示される場合は完了を待ち、再起動を繰り返して進捗を妨げない。',
          ],
        },
        {
          id: 'check-requirements-updates',
          title: '要件とインストール先を確認し、公式更新を照合する',
          summary: '要件を満たしていることと、今回の症状が直ることは別です。',
          time: '確認約5分・更新時間は別',
          risk: 'low',
          actions: [
            'Windowsの版、GPU、メモリと実際のインストール先ドライブを控え、公式のPC要件と照合する。Windows 11・SSDなどの必須条件は起動不良記事も参照。再インストール後は、元と同じSSDに戻したかを確かめる。',
            'Steamの更新状況と、公式ニュースの対象機種・日付・修正内容を確認する。10月9日告知は今後の更新を準備中とする案内で、音切れや低速化の原因・修正完了を断定するものではない。適用後も同じ場面で比較する。',
          ],
        },
        {
          id: 'compare-session-load',
          title: '同じ場面で、描画設定と負荷を一つずつ比べる',
          summary:
            'これは一般的な切り分けで、AC8で効果を実測した設定集ではありません。',
          time: '確認約5〜10分・再現時間は別',
          risk: 'low',
          actions: [
            '現在の描画設定を控え、画面にある解像度や画質のうち1項目だけを一段下げて同じ場面を比較する。改善したら変更を記録し、変わらなければ戻す。録画やブラウザなど不要なアプリも通常終了して一つずつ比べ、セキュリティ保護は止めない。',
            'Ctrl＋Shift＋Escでタスクマネージャーを開き、滑らかな時と悪化時のCPU・GPU・メモリ・ディスクの使用状況を控える。使用量の増加だけでメモリリークとは断定しない。保存完了後にゲームを通常終了・起動し直して一時的に戻るかも記録するが、恒久修正とは扱わない。',
          ],
          note: '再インストール後に遅くなったという投稿には複数の推測がありますが、原因・解決は未確定です。キャッシュの一括削除やWindows更新の削除をこの相談だけで勧めません。',
        },
        {
          id: 'compare-audio-path',
          title: '音だけ途切れるなら、ゲームとWindowsの出力を比較する',
          summary: '映像と同時に悪化する場合は、先に負荷比較の記録を残します。',
          time: '約5分',
          risk: 'low',
          actions: [
            'Windows「設定」→「システム」→「サウンド」で使う出力機器名を確認し、音量ミキサーとケーブルの接続を確認する。別アプリの短い音声も同じ機器で聞き、AC8だけか全体かを分ける。音量は小さめから確認する。',
            '別の有線イヤホンやUSB端子で比較できれば、変更前後を記録する。Windowsの「オーディオの拡張機能」がある場合は現在値を控え、その項目だけオフで比較し、変わらなければ戻す。全体で続く場合はMicrosoftの音声トラブル手順や機器メーカーへ。ドライバーの一括削除はしない。',
          ],
          note: 'Windows側の一般的な確認で、AC8固有の修正保証ではありません。Steamの音切れスレッドにある原因の推測を、公式見解とは扱いません。',
        },
        {
          id: 'record-performance',
          title: '残る症状を整理して、別の入口や公式窓口へ進む',
          summary: '直った操作だけでなく、変わらなかった比較も残します。',
          time: '約5分',
          risk: 'low',
          actions: [
            'PC構成、Windows・ゲーム・ドライバーの版、インストール先、発生までの時間、場面、負荷の変化、音声機器、試した設定と結果をまとめてゲーム窓口へ相談する。公開投稿にはアカウント名や診断ファイル内の個人情報を載せない。',
            'ゲームが終了するなら起動・クラッシュ記事、ST-3100001で通信が切れるならST記事へ。映像と音声は正常でHOTASだけ反応しない場合は、機器の認識手順へ進む。別症状を同じ不具合と決めつけない。',
          ],
        },
      ],
      avoid: [
        '利用者の推測だけで、メモリリーク・ドライバー・Windows更新を原因と断定しない。',
        'AC7の設定値、未確認の起動オプション、非公式DLL、BIOS変更や保護機能の無効化を試さない。',
        'セーブや正体不明のキャッシュをまとめて削除しない。',
      ],
      cautions: [
        '出典確認：2026年10月16日。公式の要件・告知と利用者報告を区別しています。実機での改善率や、特定機種での再現は測定していません。',
        '一度改善しても長時間の安定性までは確認できません。元の発生条件で再確認し、再発した場合も記録してください。',
      ],
      faqs: [
        {
          question: '再起動で一時的に戻るならメモリリークですか？',
          answer:
            'それだけでは確定できません。経過時間、同じ場面の負荷、常駐アプリ、描画設定を記録して比較します。使用量が増えたことと、ゲーム側の欠陥が確認されたことは別です。',
        },
        {
          question: '音切れはすべてサウンドドライバーが原因ですか？',
          answer:
            '断定できません。映像も同時に乱れるか、他のアプリも途切れるか、別の出力機器で変わるかを比較し、確認できた範囲に合わせて相談先を選びます。',
        },
      ],
      related: [],
    },
    en: {
      title:
        'ACE COMBAT 8 Gets Slower, Stutters or Cuts Audio During Play: PC Checks',
      shortTitle: 'Stutter and audio cuts during play',
      description:
        'Separate slow performance from the start, worsening stutter and audio-only dropouts in AC8. Check requirements, compare the same scene and record useful evidence without assuming a memory leak.',
      lead: 'For PC/Steam sessions that launch but develop unstable video or audio. This guide organizes sources and comparisons; it is not a fix established by Gemnao gameplay tests.',
      summary:
        'Separate poor performance from launch, deterioration over time and audio-only cuts. Check Windows 11/SSD requirements and updates, then change one condition at a time in the same scene. If video stays smooth, compare audio outputs. Player reports exist, but they do not confirm a memory leak, a particular patch as the cause or a completed fix.',
      quickFacts: [
        {
          label: 'Distinguish',
          value:
            'Slow immediately / worse over time / audio only / application closes',
        },
        {
          label: 'Official information',
          value:
            'Windows 11/SSD requirements. The October 9 notice describes update plans, not a completed fix for these symptoms.',
        },
        {
          label: 'Player reports',
          value:
            'Audio cuts during longer play, mission-progress stutter and slowdown after reinstalling; causes unconfirmed.',
        },
      ],
      diagnosis: [
        {
          symptom: 'Low FPS or slow loading immediately',
          cause: 'Check actual install drive, requirements and updates',
          stepId: 'check-requirements-updates',
        },
        {
          symptom: 'Smooth at first, then deteriorates',
          cause: 'Compare elapsed time and load in the same scene',
          stepId: 'compare-session-load',
        },
        {
          symptom: 'Video and audio deteriorate together',
          cause: 'Compare graphics and background apps one at a time',
          stepId: 'compare-session-load',
        },
        {
          symptom: 'Smooth video but audio cuts; or other apps lose audio',
          cause: 'Separate output-device and Windows audio issues',
          stepId: 'compare-audio-path',
        },
        {
          symptom: 'The game closes or shows ST-3100001',
          cause: 'Use the separate crash or connection guide',
          stepId: 'record-performance',
        },
      ],
      steps: [
        {
          id: 'record-session',
          title: 'Record when it worsens and what video/audio do',
          summary: 'A feeling of lag alone does not establish a cause.',
          time: 'About 3 minutes; reproduction extra',
          risk: 'low',
          actions: [
            'Record whether it starts immediately or after roughly how many minutes, plus mission, cutscene, loading screen or online phase. Use a safely repeatable scene instead of repeatedly joining matches for diagnosis.',
            'Separate frozen video, delayed controls, audio cuts and the application closing. If an FPS display is available, record comparable numbers. Let visible shader/preparation progress finish instead of interrupting it with repeated restarts.',
          ],
        },
        {
          id: 'check-requirements-updates',
          title: 'Check requirements, install location and official updates',
          summary:
            'Meeting requirements is not proof that this symptom is fixed.',
          time: 'About 5 minutes; updates extra',
          risk: 'low',
          actions: [
            'Record Windows version, GPU, RAM and the actual installation drive, then compare with official PC requirements. The launch guide covers required Windows 11 and SSD checks. After reinstalling, confirm it went back onto the intended SSD.',
            'Check Steam update progress and dated publisher notices for platform and fix scope. The October 9 notice says an update is being prepared; it does not identify the cause of these audio/slowdown reports or confirm their resolution. Compare the same scene after updating.',
          ],
        },
        {
          id: 'compare-session-load',
          title: 'Compare graphics and resource use in the same scene',
          summary:
            'These are general comparisons, not measured AC8 optimization presets.',
          time: 'About 5–10 minutes; reproduction extra',
          risk: 'low',
          actions: [
            'Record graphics settings, lower one available resolution/quality option by one step and repeat the same scene. Keep a record if it helps; restore it if unchanged. Close unnecessary recording/browser apps normally, one at a time. Keep security protection enabled.',
            'Use Ctrl+Shift+Esc to observe CPU, GPU, memory and disk use in Task Manager when smooth and when affected. Rising usage alone does not prove a memory leak. After saving finishes, a normal game restart can be compared for temporary recovery; it is not a permanent fix.',
          ],
          note: 'The reinstall discussion contains competing suggestions without a confirmed cause or solution. It does not justify bulk cache deletion or removing Windows updates.',
        },
        {
          id: 'compare-audio-path',
          title: 'If only audio cuts, compare game and Windows output',
          summary:
            'If video worsens too, preserve the resource comparison first.',
          time: 'About 5 minutes',
          risk: 'low',
          actions: [
            'In Windows Settings > System > Sound, confirm the output device, volume mixer and connections. Play a short sound from another app on that device to distinguish AC8-only from system-wide problems. Start at a low volume.',
            'If available, compare wired headphones or another USB port and record the difference. If Audio enhancements appears, note its state and compare with only that setting off; restore if unchanged. For system-wide trouble, follow Microsoft/device support. Do not remove drivers in bulk.',
          ],
          note: 'These are general Windows checks, not a guaranteed AC8 fix. Guesses in the Steam audio discussion are not publisher findings.',
        },
        {
          id: 'record-performance',
          title: 'Summarize remaining symptoms and choose the next route',
          summary:
            'Include unsuccessful comparisons, not just apparent improvements.',
          time: 'About 5 minutes',
          risk: 'low',
          actions: [
            'Provide game support with PC specs, Windows/game/driver versions, install drive, time until failure, scene, resource changes, audio device and settings/results. Remove account details and private information from public diagnostic material.',
            'Use launch/crash guidance if the game closes, ST guidance for ST-3100001 disconnections, or HOTAS checks if video/audio remain normal and only the stick fails. Do not merge different symptoms into one assumed bug.',
          ],
        },
      ],
      avoid: [
        'Do not identify a memory leak, driver or Windows update as the cause from player speculation alone.',
        'Do not reuse AC7 values, unverified launch options, unofficial DLLs, BIOS changes or disabled protection.',
        'Do not bulk-delete saves or unidentified caches.',
      ],
      cautions: [
        'Sources checked October 16, 2026. Official requirements/notices and player reports remain distinct. No improvement rate or hardware reproduction was measured.',
        'One successful comparison does not establish long-session stability. Recheck the original conditions and record recurrence too.',
      ],
      faqs: [
        {
          question:
            'Does temporary recovery after restarting prove a memory leak?',
          answer:
            'No. Record elapsed time, comparable resource use, background apps and graphics settings. Increased use and a confirmed game defect are different findings.',
        },
        {
          question: 'Is every audio cut a sound-driver problem?',
          answer:
            'No. Compare whether video also suffers, other apps cut out or another output device changes the result. Choose support based on what you observed.',
        },
      ],
      related: [
        { href: '/en/games/ace-combat-8/crashing-memory', label: 'Gameplay crashes and memory guidance' },
        {
          href: '/en/games/ace-combat-8/not-launching',
          label: 'Not launching or crashing',
        },
        {
          href: '/en/games/ace-combat-8/hotas-not-recognized',
          label: 'HOTAS or flight stick not responding',
        },
        {
          href: '/en/games/ace-combat-8/error-st-3100001',
          label: 'Online error ST-3100001',
        },
        {
          href: '/en/games/ace-combat-8/connection-after-time-sync',
          label: 'Connections still fail after time sync',
        },
      ],
    },
    zh: {
      title: 'ACE COMBAT 8 越玩越慢、卡顿或声音断续：PC 排查方法',
      shortTitle: '游玩中卡顿与声音断续',
      description:
        '区分 AC8 从启动就慢、游玩后恶化及仅声音断续。核对配置、同场景比较负载与音频设备，记录可用于支持咨询的信息，不凭猜测认定内存泄漏。',
      lead: '适用于 PC／Steam 版能够启动，但画面或声音不稳定的情况。本文整理资料与比较方法，并非本站实机确认有效的修复方案。',
      summary:
        '先区分从一开始就慢、随时间恶化和只有声音断续。核对 Windows 11／SSD 等要求及更新，再在同一场景每次只改变一项。画面流畅而声音中断时，比较音频输出。虽有玩家报告，但不能据此确认内存泄漏、某补丁是原因或问题已修复。',
      quickFacts: [
        {
          label: '区分症状',
          value: '启动就慢／随时间恶化／仅声音断续／程序退出',
        },
        {
          label: '官方已知信息',
          value:
            'Windows 11／SSD 等要求；10月9日公告是更新计划，不是这些症状已修复的确认',
        },
        {
          label: '玩家报告范围',
          value: '游玩较久后声音断续、任务推进时卡顿、重装后变慢；原因未确定',
        },
      ],
      diagnosis: [
        {
          symptom: '启动就低帧率或加载慢',
          cause: '核对实际安装盘、配置及更新',
          stepId: 'check-requirements-updates',
        },
        {
          symptom: '开始流畅，之后逐渐卡顿',
          cause: '在同一场景比较经过时间及负载',
          stepId: 'compare-session-load',
        },
        {
          symptom: '画面和声音同时异常',
          cause: '逐一比较画质及后台程序',
          stepId: 'compare-session-load',
        },
        {
          symptom: '画面正常但音频断续，或其他程序也无声',
          cause: '区分输出设备和 Windows 音频问题',
          stepId: 'compare-audio-path',
        },
        {
          symptom: '游戏退出或出现 ST-3100001',
          cause: '转到崩溃或连接专用文章',
          stepId: 'record-performance',
        },
      ],
      steps: [
        {
          id: 'record-session',
          title: '记录何时恶化及画面／声音的状态',
          summary: '仅凭“很卡”的感受不能确定原因。',
          time: '检查约3分钟，复现另计',
          risk: 'low',
          actions: [
            '记录从启动就发生，还是约游玩几分钟后发生，以及任务、过场、加载或联机阶段。使用能够安全重复的场景，不要为排查反复加入对局。',
            '区分画面停顿、操作延迟、声音中断和程序退出。如有 FPS 显示，在相同条件记录数值。若显示着色器或准备进度，应等待完成，不要反复重启打断。',
          ],
        },
        {
          id: 'check-requirements-updates',
          title: '核对配置、安装位置与官方更新',
          summary: '满足要求不等于本次症状已解决。',
          time: '检查约5分钟，更新另计',
          risk: 'low',
          actions: [
            '记录 Windows 版本、GPU、内存和实际安装盘，并对照官方 PC 要求。Windows 11、SSD 等必要条件也可查看启动文章。重装后确认仍装在预期的 SSD。',
            '查看 Steam 更新进度和有日期的官方公告，核对平台及修复范围。10月9日公告表示正在准备更新，并未确认这些声音断续／低速报告的原因或已解决。更新后仍需用同一场景比较。',
          ],
        },
        {
          id: 'compare-session-load',
          title: '同场景逐项比较画质与资源使用',
          summary: '这是通用排查，不是实测过的 AC8 最佳设置。',
          time: '检查约5～10分钟，复现另计',
          risk: 'low',
          actions: [
            '记录现有画质，只把画面提供的一个分辨率或质量选项降低一档后重试。有改善则记下变化，无变化则恢复。录屏、浏览器等非必需程序也应逐个正常退出比较；保持安全防护开启。',
            '按 Ctrl＋Shift＋Esc 打开任务管理器，记录流畅与恶化时 CPU、GPU、内存及磁盘使用。使用量上升不能单独证明内存泄漏。保存结束后可正常退出再启动，记录是否暂时恢复，但不视为永久修复。',
          ],
          note: '重装后变慢的帖子存在不同建议，未确认原因与解决办法；不据此建议批量删除缓存或卸载 Windows 更新。',
        },
        {
          id: 'compare-audio-path',
          title: '只有声音断续时，比较游戏和 Windows 输出',
          summary: '画面也恶化时，先保留负载比较记录。',
          time: '约5分钟',
          risk: 'low',
          actions: [
            '在 Windows“设置→系统→声音”确认输出设备名、音量混合器及线缆连接。用同一设备播放其他程序的短音频，区分只有 AC8 异常还是全系统异常；从低音量开始。',
            '有条件可比较有线耳机或另一 USB 端口，并记录结果。如有“音频增强”，先记录原值，只关闭该项比较，无变化则恢复。全系统持续异常时按 Microsoft 或设备厂商说明排查，不批量删除驱动。',
          ],
          note: '这些是 Windows 通用检查，不保证修复 AC8；Steam 音频讨论中的猜测不是官方结论。',
        },
        {
          id: 'record-performance',
          title: '整理残留症状，选择后续文章或官方支持',
          summary: '无改善的比较结果也应记录。',
          time: '约5分钟',
          risk: 'low',
          actions: [
            '向游戏支持提供 PC 配置、Windows／游戏／驱动版本、安装盘、发生前经过时间、场景、负载变化、音频设备及设置比较结果。公开资料中应去掉账号及诊断文件里的个人信息。',
            '游戏退出则查启动／崩溃文章，ST-3100001 断线则查 ST 文章。画面声音正常，仅 HOTAS 不响应则查设备识别流程。不要把不同症状认定为同一缺陷。',
          ],
        },
      ],
      avoid: [
        '不凭玩家推测认定内存泄漏、驱动或 Windows 更新是原因。',
        '不套用 AC7 设置值、未确认启动参数、非官方 DLL、BIOS 改动或关闭安全防护。',
        '不批量删除存档或不明缓存。',
      ],
      cautions: [
        '资料核对：2026年10月16日。区分官方要求／公告和玩家报告，未测量改善率或特定硬件复现情况。',
        '一次改善不代表长时间稳定，应按原发生条件复查，并记录复发。',
      ],
      faqs: [
        {
          question: '重启后暂时恢复就能证明内存泄漏吗？',
          answer:
            '不能。应记录经过时间、同场景负载、后台程序和画质。使用量增加与确认游戏缺陷是两件事。',
        },
        {
          question: '所有音频中断都是声卡驱动问题吗？',
          answer:
            '不能断定。比较画面是否同时异常、其他程序是否断音、换输出设备是否变化，再按观察结果选择支持渠道。',
        },
      ],
      related: [
        {
          href: '/zh/games/ace-combat-8/not-launching',
          label: '无法启动或崩溃',
        },
        {
          href: '/zh/games/ace-combat-8/hotas-not-recognized',
          label: 'HOTAS／飞行摇杆不响应',
        },
        {
          href: '/en/games/ace-combat-8/error-st-3100001',
          label: '联机错误 ST-3100001（英语）',
        },
        {
          href: '/zh/games/ace-combat-8/connection-after-time-sync',
          label: '同步时间后仍无法连接',
        },
      ],
    },
    es: {
      title:
        'ACE COMBAT 8 se ralentiza, da tirones o corta el audio: comprobaciones en PC',
      shortTitle: 'Tirones y cortes de audio durante el juego',
      description:
        'Distingue lentitud desde el inicio, empeoramiento con el tiempo y cortes solo de audio en AC8. Compara requisitos, carga y salida de sonido sin dar por demostrada una fuga de memoria.',
      lead: 'Para PC/Steam cuando el juego inicia pero el vídeo o el audio son inestables. Se organizan fuentes y comparaciones; no son arreglos demostrados mediante pruebas de juego de Gemnao.',
      summary:
        'Distingue lentitud inicial, deterioro progresivo y cortes solo de sonido. Revisa los requisitos de Windows 11/SSD y las actualizaciones; cambia una condición cada vez en la misma escena. Si la imagen sigue fluida, compara las salidas de audio. Los informes de jugadores no confirman una fuga de memoria, un parche como causa ni una solución completada.',
      quickFacts: [
        {
          label: 'Distingue',
          value:
            'Lento desde el inicio / empeora con el tiempo / solo audio / la aplicación se cierra',
        },
        {
          label: 'Información oficial',
          value:
            'Requisitos de Windows 11/SSD. El aviso del 9 de octubre anuncia planes, no una solución completada para estos síntomas.',
        },
        {
          label: 'Informes de jugadores',
          value:
            'Audio entrecortado con el tiempo, tirones al avanzar y lentitud tras reinstalar; causas sin confirmar.',
        },
      ],
      diagnosis: [
        {
          symptom: 'Pocos FPS o cargas lentas desde el inicio',
          cause:
            'Revisa unidad real de instalación, requisitos y actualizaciones',
          stepId: 'check-requirements-updates',
        },
        {
          symptom: 'Empieza fluido y empeora después',
          cause: 'Compara tiempo transcurrido y carga en la misma escena',
          stepId: 'compare-session-load',
        },
        {
          symptom: 'Imagen y sonido empeoran a la vez',
          cause: 'Compara gráficos y aplicaciones de una en una',
          stepId: 'compare-session-load',
        },
        {
          symptom:
            'Imagen fluida pero cortes de audio; u otras apps pierden sonido',
          cause: 'Separa el dispositivo de salida y el audio de Windows',
          stepId: 'compare-audio-path',
        },
        {
          symptom: 'El juego se cierra o muestra ST-3100001',
          cause: 'Usa la guía de cierres o conexión',
          stepId: 'record-performance',
        },
      ],
      steps: [
        {
          id: 'record-session',
          title: 'Anota cuándo empeora y qué ocurre con imagen y sonido',
          summary:
            'La sensación de retraso no identifica por sí sola la causa.',
          time: 'Unos 3 minutos; reproducción aparte',
          risk: 'low',
          actions: [
            'Anota si empieza al abrir o tras cuántos minutos, y la misión, cinemática, carga o fase online. Compara una escena reproducible con seguridad, sin entrar repetidamente en partidas para diagnosticar.',
            'Separa imagen congelada, controles lentos, cortes de sonido y cierre de la aplicación. Si hay indicador de FPS, anota cifras comparables. Deja terminar el progreso visible de sombreadores/preparación sin interrumpirlo reiniciando constantemente.',
          ],
        },
        {
          id: 'check-requirements-updates',
          title: 'Revisa requisitos, instalación y actualizaciones oficiales',
          summary:
            'Cumplir requisitos no demuestra que este problema esté resuelto.',
          time: 'Unos 5 minutos; actualizaciones aparte',
          risk: 'low',
          actions: [
            'Anota Windows, GPU, RAM y unidad real de instalación y compáralos con los requisitos oficiales. La guía de inicio explica Windows 11 y SSD obligatorios. Tras reinstalar, comprueba que elegiste el SSD previsto.',
            'Revisa progreso de Steam y avisos oficiales fechados, plataforma y alcance de las correcciones. El aviso del 9 de octubre habla de una actualización en preparación; no determina la causa ni confirma resueltos estos cortes o ralentizaciones. Compara la misma escena después de actualizar.',
          ],
        },
        {
          id: 'compare-session-load',
          title: 'Compara gráficos y recursos en la misma escena',
          summary:
            'Son comprobaciones generales, no ajustes óptimos medidos en AC8.',
          time: 'Unos 5–10 minutos; reproducción aparte',
          risk: 'low',
          actions: [
            'Anota la configuración y baja un nivel una sola opción disponible de resolución/calidad. Repite la escena y registra mejoras; restaura si no cambia. Cierra normalmente aplicaciones innecesarias, como grabación o navegador, una cada vez. Mantén la protección de seguridad.',
            'Con Ctrl+Mayús+Esc observa CPU, GPU, memoria y disco en el Administrador de tareas, tanto con fluidez como con fallos. Un uso creciente no demuestra una fuga de memoria. Tras finalizar el guardado, compara cerrar y abrir el juego normalmente: una recuperación temporal no es una solución permanente.',
          ],
          note: 'La consulta tras reinstalar contiene sugerencias distintas sin causa ni arreglo confirmados. No justifica borrar cachés en masa ni quitar actualizaciones de Windows.',
        },
        {
          id: 'compare-audio-path',
          title: 'Si solo falla el sonido, compara AC8 y la salida de Windows',
          summary:
            'Si también empeora la imagen, conserva primero la comparación de carga.',
          time: 'Unos 5 minutos',
          risk: 'low',
          actions: [
            'En Configuración de Windows > Sistema > Sonido, comprueba dispositivo de salida, mezclador y conexiones. Reproduce un sonido breve de otra aplicación en el mismo dispositivo para distinguir AC8 de un fallo general. Empieza con volumen bajo.',
            'Si puedes, compara auriculares con cable u otro puerto USB y anota el resultado. Si aparece Mejoras de audio, registra su estado y prueba solo esa opción desactivada; restaura si no cambia. Para problemas generales, sigue Microsoft o al fabricante. No elimines controladores en masa.',
          ],
          note: 'Son comprobaciones generales de Windows, sin garantía para AC8. Las conjeturas del debate de Steam no son conclusiones del editor.',
        },
        {
          id: 'record-performance',
          title: 'Resume lo que queda y elige la siguiente guía o soporte',
          summary: 'Incluye las comparaciones sin mejora.',
          time: 'Unos 5 minutos',
          risk: 'low',
          actions: [
            'Comunica al soporte especificaciones, versiones de Windows/juego/controlador, unidad, tiempo hasta el fallo, escena, cambios de carga, dispositivo de audio y ajustes/resultados. Quita datos de cuenta e información privada de diagnósticos públicos.',
            'Para cierres, usa la guía de inicio; para desconexión ST-3100001, la de ST. Si imagen y audio son normales y solo falla el HOTAS, sigue su guía de reconocimiento. No agrupes síntomas distintos como un único defecto supuesto.',
          ],
        },
      ],
      avoid: [
        'No declares una fuga de memoria, controlador o actualización de Windows como causa basándote solo en conjeturas.',
        'No reutilices valores de AC7, opciones de inicio sin confirmar, DLL no oficiales, cambios de BIOS ni protección desactivada.',
        'No borres partidas ni cachés sin identificar en masa.',
      ],
      cautions: [
        'Fuentes revisadas el 16 de octubre de 2026. Se distinguen requisitos/avisos oficiales e informes personales. No se midió una tasa de mejora ni reproducción por hardware.',
        'Una mejora puntual no demuestra estabilidad prolongada. Repite las condiciones originales y registra si vuelve a ocurrir.',
      ],
      faqs: [
        {
          question:
            '¿Recuperarse temporalmente al reiniciar demuestra una fuga de memoria?',
          answer:
            'No. Anota tiempo, recursos comparables, aplicaciones y gráficos. Un aumento de uso y un defecto confirmado son cosas distintas.',
        },
        {
          question:
            '¿Todo corte de audio es un problema del controlador de sonido?',
          answer:
            'No. Compara si también falla el vídeo, otras aplicaciones pierden audio o cambia al usar otra salida. Elige soporte según lo observado.',
        },
      ],
      related: [
        {
          href: '/es/games/ace-combat-8/not-launching',
          label: 'No inicia o se cierra',
        },
        {
          href: '/es/games/ace-combat-8/hotas-not-recognized',
          label: 'HOTAS o joystick sin respuesta',
        },
        {
          href: '/en/games/ace-combat-8/error-st-3100001',
          label: 'Error online ST-3100001 (inglés)',
        },
        {
          href: '/es/games/ace-combat-8/connection-after-time-sync',
          label: 'La conexión sigue fallando tras sincronizar la hora',
        },
      ],
    },
  },
};
