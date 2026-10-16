import type { FollowupGuide } from './types';

export const aceCombatHotasGuide: FollowupGuide = {
  gameSlug: 'ace-combat-8',
  gameName: 'ACE COMBAT 8',
  slug: 'hotas-not-recognized',
  category: 'controller',
  checkedAt: '2026-10-16',
  relatedSlugs: [
    'stutter-audio-cutting-out',
    'not-launching',
    'error-st-3100001',
  ],
  sources: [
    {
      url: 'https://enso-order.acecombat.jp/',
      labels: {
        ja: 'ゲーム公式：機種別の動作確認済みコントローラー',
        en: 'Game publisher: tested controllers by platform (Japanese)',
        zh: '游戏官方：各平台已确认运行的控制器（日语）',
        es: 'Editor: mandos comprobados por plataforma (japonés)',
      },
    },
    {
      url: 'https://support.thrustmaster.com/en/kb/1904-en/',
      labels: {
        ja: 'Thrustmaster公式：NEO／LegacyモードとAC8対応（2026年10月3日・英語）',
        en: 'Thrustmaster: NEO/Legacy modes and AC8 compatibility, October 3, 2026',
        zh: 'Thrustmaster 官方：NEO／Legacy 模式与 AC8 兼容性（2026年10月3日，英语）',
        es: 'Thrustmaster: modos NEO/Legacy y compatibilidad con AC8, 3 de octubre de 2026 (inglés)',
      },
    },
    {
      url: 'https://support.thrustmaster.com/en/product/t-flight-hotas-neo-p-en/',
      labels: {
        ja: 'Thrustmaster公式：NEOのPCドライバー・入力テスト・AC8専用マッピング（英語）',
        en: 'Thrustmaster: NEO PC driver, input tests and AC8 native mapping',
        zh: 'Thrustmaster 官方：NEO 的 PC 驱动、输入测试及 AC8 原生映射（英语）',
        es: 'Thrustmaster: controlador de PC, pruebas y asignación nativa de NEO para AC8 (inglés)',
      },
    },
    {
      url: 'https://www.reddit.com/r/acecombat/comments/1x1hxwo/tfrp_not_working_on_ace_combat_8/',
      labels: {
        ja: '利用者報告：TFRPペダルが動かない相談（PS5環境・公式情報ではない）',
        en: 'Player report: TFRP pedals not working on PS5; not official guidance',
        zh: '玩家报告：PS5 上 TFRP 踏板不响应；非官方信息（英语）',
        es: 'Informe de un jugador: pedales TFRP sin respuesta en PS5; no es información oficial (inglés)',
      },
    },
  ],
  copy: {
    ja: {
      title:
        'エースコンバット8でHOTAS・フライトスティックが認識しない時の確認順【PC版】',
      shortTitle: 'HOTAS・フライトスティックが反応しない',
      description:
        'エスコン8でHOTASが動かない時は、型番・PC対応・入力テストから確認。T.Flight HOTAS NEOの公式ドライバーとNEOモード、ペダルだけ無反応、AC8だけ操作できない場合を分けて案内します。',
      lead: 'PC／Steam版でスティック・スロットル・ペダルが反応しない場合が対象です。資料を確認した手順であり、当サイトが各機器を実機で試した結果ではありません。',
      summary:
        'まず機器の正確な型番とPC対応を確認します。T.Flight HOTAS NEO／NEO Xは、メーカーによるとAC8ではNEOモードが必要で、PCでは対応ドライバーが必要です。次にメーカーの入力テストで軸とボタンを確かめ、反応しなければ接続・機器側、反応するのにAC8だけ動かなければAC8用マッピングと入力経路を調べます。',
      quickFacts: [
        {
          label: '最初に控える',
          value: '型番・製品のPS／Xbox／PC版・接続方法・反応しない軸やボタン',
        },
        {
          label: 'NEO専用の公式条件',
          value:
            'AC8はNEOモード。PCは対応ドライバーが必要。他のHOTASに一律適用しない',
        },
        {
          label: '認識と操作は別',
          value:
            'Windowsに機器名が出ても、ゲーム内で全軸が使える証明にはならない',
        },
      ],
      diagnosis: [
        {
          symptom: '機器名が出ない／入力テストでも動かない',
          cause: '先に接続・機種別ドライバーを確認',
          stepId: 'test-input-path',
        },
        {
          symptom: 'NEOで一部の軸やボタンが使えない',
          cause: 'PCドライバーとNEO／Legacyモードを確認',
          stepId: 'confirm-neo-mode',
        },
        {
          symptom: '入力テストは正常でAC8だけ反応しない',
          cause: 'AC8専用の対応情報とマッピングを確認',
          stepId: 'compare-game',
        },
        {
          symptom: 'スティックは動くがペダルだけ動かない',
          cause: 'ペダルの型番・接続先・軸を個別に比較',
          stepId: 'record-hotas',
        },
      ],
      steps: [
        {
          id: 'identify-hardware',
          title: '型番と、使う機種の対応表を照合する',
          summary: '同じシリーズ名でも製品版・対応機種が違います。',
          time: '約3分',
          risk: 'low',
          actions: [
            'ゲームを終了し、本体ラベルの型番とPS／Xbox／PCの製品版を控える。ゲーム公式サイトの「動作確認済みコントローラー」はSTEAMの列を見る。似た名前の別製品を同じ対応機器と扱わない。',
            '一覧にない機器は、メーカーのAC8対応案内も確認する。掲載がないだけで故障・絶対に使用不可とは断定せず、個別対応が確認できなければ購入や変換ツールの導入を急がない。',
          ],
        },
        {
          id: 'confirm-neo-mode',
          title: 'NEO／NEO XはPCドライバーとNEOモードを確認',
          summary: 'この条件はT.Flight HOTAS NEOシリーズ向けです。',
          time: '確認約5分・導入時間は別',
          risk: 'low',
          actions: [
            'メーカーのNEO／Legacy解説と、自分の製品のサポートページを開く。PCでは対応ドライバーを導入してNEOモードを使う案内です。PCでのNEOは緑LED、ドライバー未導入のLegacyは赤LEDと説明されています。PS5のLED色と混同しない。',
            'ドライバーが必要なら、型番が一致するメーカー公式ページの導入手順とUSBを接続するタイミングに従い、完了後は再起動する。汎用の自動更新ツールは使わない。導入済みの場合も、表示だけで正常とせず次の入力テストへ進む。',
          ],
          note: '2026年10月16日確認時、NEOの製品ページはファームウェア更新は不要と案内しています。ファームウェアの書き換えを最初の対処にしません。',
        },
        {
          id: 'test-input-path',
          title: 'ゲームの外で軸・ボタンの反応を確認する',
          summary: '接続の確認が済むまではゲーム設定を増やしません。',
          time: '約5分',
          risk: 'low',
          actions: [
            'メーカーの説明書に沿ってPC本体のUSBへ接続し、必要なら別ポートで比較する。メーカーのコントロールパネルや入力テストを開き、スティック・スロットル・ペダルの各軸とボタンを一つずつ動かして結果を控える。',
            '機器名がない、特定の軸が動かない場合は配線・動作モード・対応ドライバーを再確認し、メーカー窓口へ。全軸が動けば次へ進む。別製品用の軸モードやドライバーを流用しない。',
          ],
        },
        {
          id: 'compare-game',
          title: '入力テストが通ったらAC8用マッピングで比較する',
          summary:
            'NEOの製品ページにはAC8専用のネイティブマッピングがあります。',
          time: '約5〜10分',
          risk: 'low',
          actions: [
            '使用中の割り当てを記録し、型番に合うメーカーのAC8用マッピングと自分の画面を照合する。ゲーム内の表示に従って、同じ練習場面・同じ軸やボタンで確認する。AC7用のInput.iniや機器IDをコピーしない。',
            '外部マッパーをすでに使っている場合だけ、ゲームとマッパーを通常終了し、実機1組で起動して比較する。改善すれば入力経路の重複が候補、変化がなければ記録した状態へ戻す。Steam Inputの一律有効化や、新しいマッパーの導入を解決条件にしない。',
          ],
        },
        {
          id: 'record-hotas',
          title: 'ペダルだけの不調と、ゲーム側だけの不調を分けて相談する',
          summary: 'PS5の利用者報告をPCの確認済み不具合として扱いません。',
          time: '約5分',
          risk: 'low',
          actions: [
            'ペダルだけ無反応なら、ペダル型番・接続先・入力テストでの軸の動きと、AC8内の結果を分けて控える。接続先やモードの変更は、その組み合わせのメーカー説明書で確認してから行う。',
            '入力テストでも失敗ならメーカーへ、入力は正常でAC8だけ失敗ならゲーム窓口へ、型番・OS・ドライバー・モード・反応する操作／しない操作を伝える。ST-3100001やゲーム自体の終了は関連記事の別手順へ進む。',
          ],
          note: '参考のTFRP投稿はPS5での相談で、解決手順やPC版での再現は確認されていません。',
        },
      ],
      avoid: [
        'AC7の設定ファイルや未確認の機器IDをAC8へ流用しない。',
        'ドライバーの一括削除、保護機能の無効化、外部マッパーの追加を最初に行わない。',
      ],
      cautions: [
        '出典確認は2026年10月16日。機器の実機検証や、全HOTAS・全ペダルでの動作保証ではありません。',
        '公式の動作確認済み一覧、メーカーの機種別手順、利用者の体験談は別の情報です。コメント数を発生率や互換性の根拠にしません。',
      ],
      faqs: [
        {
          question: 'NEOモードなら、どのペダルもAC8で使えますか？',
          answer:
            'その保証はできません。機器のモードと、ペダルの接続・ゲーム側の割り当ては別です。メーカーの対応情報と入力テスト、AC8内の結果をそれぞれ確認してください。',
        },
        {
          question: 'AC7で使えたスティックも同じ設定で動きますか？',
          answer:
            'AC7での動作はAC8の対応確認の代わりになりません。AC8用の公式対応情報を確認し、保存場所やInput.iniの形式が同じと仮定してコピーしないでください。',
        },
      ],
      related: [],
    },
    en: {
      title: 'ACE COMBAT 8 HOTAS or Flight Stick Not Recognized: PC Checks',
      shortTitle: 'HOTAS or flight stick not responding',
      description:
        'Check the exact HOTAS model, PC support, NEO drivers and input tests before changing AC8 settings. Separate missing axes, pedals and a stick that works outside the game.',
      lead: 'For PC/Steam sticks, throttles or pedals that do not respond. These are source-based checks, not hands-on tests of every device by Gemnao.',
      summary:
        'Identify the exact model and PC compatibility first. Thrustmaster says AC8 requires NEO mode on T.Flight HOTAS NEO/NEO X, with the appropriate PC driver. Test axes and buttons in the manufacturer’s utility: failures there need device checks; inputs working there but not in AC8 need AC8 mapping and input-path checks.',
      quickFacts: [
        {
          label: 'Record first',
          value:
            'Exact model, PS/Xbox/PC edition, connection and missing axes/buttons',
        },
        {
          label: 'NEO-specific requirement',
          value:
            'AC8 needs NEO mode; PC needs the matching driver. Do not apply this to every HOTAS.',
        },
        {
          label: 'Detection is not full support',
          value:
            'A Windows device name does not prove that every axis works in AC8.',
        },
      ],
      diagnosis: [
        {
          symptom: 'Device absent or manufacturer input test fails',
          cause: 'Check connection and model-specific driver first',
          stepId: 'test-input-path',
        },
        {
          symptom: 'Some NEO axes or buttons are missing',
          cause: 'Check PC driver and NEO/Legacy mode',
          stepId: 'confirm-neo-mode',
        },
        {
          symptom: 'Input tests pass but AC8 does not respond',
          cause: 'Check AC8 compatibility and native mapping',
          stepId: 'compare-game',
        },
        {
          symptom: 'Stick works but pedals do not',
          cause: 'Compare pedal model, connection and axis separately',
          stepId: 'record-hotas',
        },
      ],
      steps: [
        {
          id: 'identify-hardware',
          title: 'Match the exact model to the platform list',
          summary:
            'Product editions within one series can support different platforms.',
          time: 'About 3 minutes',
          risk: 'low',
          actions: [
            'Close the game and record the label/model and PS, Xbox or PC edition. Check the STEAM column of the publisher’s tested-controller list. Similar product names are not interchangeable.',
            'For an unlisted device, check the manufacturer’s AC8 support too. Absence from the list alone does not prove failure or impossibility; confirm support before buying replacements or installing a mapper.',
          ],
        },
        {
          id: 'confirm-neo-mode',
          title: 'For NEO/NEO X, check the PC driver and NEO mode',
          summary:
            'This requirement applies specifically to the T.Flight HOTAS NEO family.',
          time: 'About 5 minutes; installation extra',
          risk: 'low',
          actions: [
            'Open the manufacturer’s NEO/Legacy article and your model’s support page. On PC, the matching driver enables NEO mode: the article identifies a green LED for NEO and a red LED for driver-free Legacy. Do not confuse PC indicators with PS5 indicators.',
            'If a driver is needed, follow the matching official installation instructions, including when to connect USB, then restart. Avoid generic driver updaters. If already installed, continue with an input test rather than assuming it works.',
          ],
          note: 'On October 16, 2026 the NEO product page said no firmware update was required. Flashing firmware is not the first check.',
        },
        {
          id: 'test-input-path',
          title: 'Test axes and buttons outside the game',
          summary: 'Confirm the connection before adding game-setting changes.',
          time: 'About 5 minutes',
          risk: 'low',
          actions: [
            'Follow the manual to connect to the PC’s USB port; compare another port if necessary. In the manufacturer’s control panel/input test, move each stick, throttle and pedal axis and test the buttons individually. Record what responds.',
            'If the device is absent or an axis fails, recheck wiring, operating mode and the matching driver, then contact the manufacturer. If all work, continue. Do not reuse another product’s axis modes or drivers.',
          ],
        },
        {
          id: 'compare-game',
          title: 'Compare AC8-specific mapping after input tests pass',
          summary: 'The NEO product page links an AC8 native-mapping diagram.',
          time: 'About 5–10 minutes',
          risk: 'low',
          actions: [
            'Record current assignments and compare the manufacturer’s AC8 mapping for your exact model with your screen. Use the same practice scene and input, following the game’s displayed controls. Do not copy AC7 Input.ini entries or device IDs.',
            'Only if you already use an external mapper, close the game and mapper normally and compare with one physical setup. Improvement suggests overlapping input paths; otherwise restore the recorded setup. Neither enabling Steam Input universally nor installing a new mapper is a required fix.',
          ],
        },
        {
          id: 'record-hotas',
          title: 'Separate pedal-only failures from game-only failures',
          summary: 'A PS5 player report is not a confirmed PC bug.',
          time: 'About 5 minutes',
          risk: 'low',
          actions: [
            'For pedals alone, record their model, connection point, axis movement in the input test and the separate AC8 result. Consult the manual for that combination before changing connections or modes.',
            'Contact the manufacturer if its test fails; contact game support if inputs work outside AC8. Include model, OS, driver, mode and working/failing inputs. Use the related guides for ST-3100001 or the game closing.',
          ],
          note: 'The linked TFRP post concerns PS5; neither a solution nor reproduction on PC is established there.',
        },
      ],
      avoid: [
        'Do not copy AC7 configuration files or unverified device IDs into AC8.',
        'Do not begin with bulk driver removal, security changes or a new external mapper.',
      ],
      cautions: [
        'Sources checked October 16, 2026. No hands-on device test or guarantee for all HOTAS/pedal combinations is claimed.',
        'Keep the publisher’s tested list, model-specific manufacturer guidance and player experiences distinct. Comment counts do not measure failure rates or compatibility.',
      ],
      faqs: [
        {
          question: 'Does NEO mode guarantee every pedal works in AC8?',
          answer:
            'No. Device mode, pedal connection and in-game mapping are separate checks. Compare manufacturer compatibility, the input test and the AC8 result.',
        },
        {
          question: 'Can I reuse a stick setup that worked in AC7?',
          answer:
            'AC7 operation does not confirm AC8 support. Check AC8-specific guidance; do not assume its configuration paths or Input.ini format are identical.',
        },
      ],
      related: [
        {
          href: '/en/games/ace-combat-8/stutter-audio-cutting-out',
          label: 'Stuttering or audio cutting out during play',
        },
        {
          href: '/en/games/ace-combat-8/not-launching',
          label: 'Not launching or crashing',
        },
        {
          href: '/en/games/ace-combat-8/error-st-3100001',
          label: 'Online error ST-3100001',
        },
      ],
    },
    zh: {
      title: 'ACE COMBAT 8 不识别 HOTAS／飞行摇杆：PC 排查顺序',
      shortTitle: 'HOTAS／飞行摇杆无响应',
      description:
        'AC8 飞行摇杆不响应时，先确认型号、PC 支持及输入测试。区分 NEO 驱动与模式、踏板单独失灵，以及游戏外正常而 AC8 内无法操作的情况。',
      lead: '适用于 PC／Steam 版的摇杆、油门或踏板无响应。本文依据资料整理，并非本站对各款设备进行的实机测试。',
      summary:
        '先核对完整型号和 PC 兼容性。Thrustmaster 说明 T.Flight HOTAS NEO／NEO X 在 AC8 中需要 NEO 模式，PC 上须安装对应驱动。再用厂商工具测试轴和按钮：测试也失败则检查设备；测试正常而 AC8 无响应，则检查 AC8 映射及输入路径。',
      quickFacts: [
        {
          label: '先记录',
          value: '完整型号、PS／Xbox／PC 版本、连接方式和失灵的轴／按钮',
        },
        {
          label: 'NEO 专用要求',
          value: 'AC8 需要 NEO 模式，PC 需要对应驱动；不要套用到所有 HOTAS',
        },
        {
          label: '识别不等于全面支持',
          value: 'Windows 显示设备名，不代表 AC8 中所有轴均可使用',
        },
      ],
      diagnosis: [
        {
          symptom: '没有设备名，或厂商输入测试失败',
          cause: '先查连接及型号对应驱动',
          stepId: 'test-input-path',
        },
        {
          symptom: 'NEO 的部分轴或按钮不可用',
          cause: '检查 PC 驱动与 NEO／Legacy 模式',
          stepId: 'confirm-neo-mode',
        },
        {
          symptom: '输入测试正常，只有 AC8 不响应',
          cause: '检查 AC8 兼容说明与原生映射',
          stepId: 'compare-game',
        },
        {
          symptom: '摇杆能用，只有踏板不响应',
          cause: '单独比较踏板型号、接口及轴',
          stepId: 'record-hotas',
        },
      ],
      steps: [
        {
          id: 'identify-hardware',
          title: '核对完整型号及平台对应表',
          summary: '同系列的不同版本可能支持不同平台。',
          time: '约3分钟',
          risk: 'low',
          actions: [
            '退出游戏，记录标签型号及 PS／Xbox／PC 版本。查看游戏官方已确认控制器列表中的 STEAM 栏，不要把名称相近的产品视为同一设备。',
            '未列出的设备还需查看厂商 AC8 说明。未列出不等于故障或绝对无法使用；无法确认支持时，不要急着购买替代品或安装映射工具。',
          ],
        },
        {
          id: 'confirm-neo-mode',
          title: 'NEO／NEO X：确认 PC 驱动及 NEO 模式',
          summary: '这项要求仅针对 T.Flight HOTAS NEO 系列。',
          time: '检查约5分钟，安装另计',
          risk: 'low',
          actions: [
            '打开厂商 NEO／Legacy 解说和对应型号支持页。PC 需用对应驱动启用 NEO 模式；资料说明 PC 的 NEO 为绿灯，未安装驱动的 Legacy 为红灯。不要混淆 PS5 指示灯。',
            '如需驱动，按型号匹配的官方安装说明操作，包括何时接入 USB，完成后重启。不要使用通用驱动更新工具。已安装也要继续做输入测试，不能仅凭显示判断正常。',
          ],
          note: '2026年10月16日核对时，NEO 产品页说明无需固件更新；不把刷固件作为首个步骤。',
        },
        {
          id: 'test-input-path',
          title: '先在游戏外测试轴和按钮',
          summary: '确认连接后再排查游戏设置。',
          time: '约5分钟',
          risk: 'low',
          actions: [
            '按说明书连接电脑本体 USB，必要时换端口比较。用厂商控制面板或输入测试，逐一操作摇杆、油门、踏板各轴和按钮，记录反应。',
            '没有设备名或某轴不动时，重查接线、模式及对应驱动，并联系厂商。全部正常再继续；不要套用其他型号的轴模式或驱动。',
          ],
        },
        {
          id: 'compare-game',
          title: '输入测试通过后再比较 AC8 专用映射',
          summary: 'NEO 产品页提供 AC8 原生映射图。',
          time: '约5～10分钟',
          risk: 'low',
          actions: [
            '记录现有分配，对照准确型号的 AC8 厂商映射与自己画面中的说明。在同一练习场景测试同一输入，不要复制 AC7 的 Input.ini 或设备 ID。',
            '仅在已经使用外部映射工具时，正常退出游戏及工具，用一组实体设备重试。改善是输入路径重叠的线索；无变化则恢复原状。不把统一启用 Steam Input 或新增映射工具作为必需修复。',
          ],
        },
        {
          id: 'record-hotas',
          title: '区分踏板单独失灵和仅游戏内失灵',
          summary: 'PS5 玩家帖子不能视为 PC 已确认缺陷。',
          time: '约5分钟',
          risk: 'low',
          actions: [
            '只有踏板不动时，分别记录踏板型号、接口、测试中的轴变化及 AC8 内的结果。更换接口或模式前，查看该组合的厂商说明书。',
            '厂商测试也失败则咨询厂商；游戏外正常而 AC8 失败则向游戏支持提供型号、OS、驱动、模式及有效／失灵输入。ST-3100001 或游戏退出请转到相关文章。',
          ],
          note: '引用的 TFRP 帖子是 PS5 上的咨询，未确认解决方案或 PC 复现。',
        },
      ],
      avoid: [
        '不要把 AC7 配置文件或未经确认的设备 ID 套用到 AC8。',
        '不要先批量删除驱动、关闭安全防护或新增外部映射工具。',
      ],
      cautions: [
        '资料核对日期：2026年10月16日。未实测设备，不保证所有 HOTAS／踏板组合均可使用。',
        '官方已确认列表、厂商型号说明和玩家经历应分开看待；评论数量不能代表故障率或兼容性。',
      ],
      faqs: [
        {
          question: 'NEO 模式能保证所有踏板在 AC8 中可用吗？',
          answer:
            '不能。设备模式、踏板连接与游戏映射是不同检查项，应分别核对厂商兼容信息、输入测试和 AC8 内的结果。',
        },
        {
          question: '可以沿用 AC7 中正常的摇杆设置吗？',
          answer:
            'AC7 正常不代表 AC8 已支持。先查 AC8 专用资料，不要假定配置路径或 Input.ini 格式相同。',
        },
      ],
      related: [
        {
          href: '/zh/games/ace-combat-8/stutter-audio-cutting-out',
          label: '游玩时卡顿或声音断续',
        },
        {
          href: '/zh/games/ace-combat-8/not-launching',
          label: '无法启动或崩溃',
        },
        {
          href: '/en/games/ace-combat-8/error-st-3100001',
          label: '联机错误 ST-3100001（英语）',
        },
      ],
    },
    es: {
      title:
        'ACE COMBAT 8 no reconoce el HOTAS o joystick: comprobaciones en PC',
      shortTitle: 'HOTAS o joystick sin respuesta',
      description:
        'Comprueba modelo, compatibilidad con PC, controlador y modo NEO antes de cambiar AC8. Separa ejes ausentes, pedales y entradas que funcionan fuera del juego.',
      lead: 'Para joystick, acelerador o pedales sin respuesta en PC/Steam. Son comprobaciones basadas en fuentes; Gemnao no ha probado físicamente cada dispositivo.',
      summary:
        'Identifica primero el modelo exacto y su compatibilidad con PC. Thrustmaster indica que AC8 requiere el modo NEO en T.Flight HOTAS NEO/NEO X, con el controlador correspondiente en PC. Prueba ejes y botones con la utilidad del fabricante: si falla, revisa el dispositivo; si funciona fuera de AC8, revisa la asignación y las rutas de entrada.',
      quickFacts: [
        {
          label: 'Anota primero',
          value:
            'Modelo exacto, edición PS/Xbox/PC, conexión y ejes/botones afectados',
        },
        {
          label: 'Requisito específico de NEO',
          value:
            'AC8 requiere modo NEO; PC necesita su controlador. No se aplica a todos los HOTAS.',
        },
        {
          label: 'Detección no es soporte completo',
          value:
            'Ver el nombre en Windows no demuestra que todos los ejes funcionen en AC8.',
        },
      ],
      diagnosis: [
        {
          symptom: 'No aparece el dispositivo o falla la prueba del fabricante',
          cause: 'Revisa conexión y controlador del modelo',
          stepId: 'test-input-path',
        },
        {
          symptom: 'Faltan ejes o botones en un NEO',
          cause: 'Comprueba controlador de PC y modo NEO/Legacy',
          stepId: 'confirm-neo-mode',
        },
        {
          symptom: 'La prueba funciona pero AC8 no responde',
          cause: 'Comprueba compatibilidad y asignación nativa para AC8',
          stepId: 'compare-game',
        },
        {
          symptom: 'El joystick funciona pero los pedales no',
          cause: 'Compara modelo, conexión y eje del pedal por separado',
          stepId: 'record-hotas',
        },
      ],
      steps: [
        {
          id: 'identify-hardware',
          title: 'Compara el modelo exacto con la lista por plataforma',
          summary:
            'Las ediciones de una misma familia pueden admitir plataformas distintas.',
          time: 'Unos 3 minutos',
          risk: 'low',
          actions: [
            'Cierra el juego y anota modelo y edición PS, Xbox o PC de la etiqueta. Consulta la columna STEAM de la lista del editor. Los nombres parecidos no identifican el mismo producto.',
            'Si no aparece, consulta también al fabricante sobre AC8. La ausencia no demuestra avería ni incompatibilidad absoluta; confirma el soporte antes de comprar otro equipo o instalar un mapeador.',
          ],
        },
        {
          id: 'confirm-neo-mode',
          title: 'NEO/NEO X: comprueba controlador de PC y modo NEO',
          summary:
            'Esta condición corresponde a la familia T.Flight HOTAS NEO.',
          time: 'Unos 5 minutos; instalación aparte',
          risk: 'low',
          actions: [
            'Abre la explicación NEO/Legacy y el soporte de tu modelo. En PC, el controlador correspondiente habilita NEO: la guía identifica LED verde para NEO y rojo para Legacy sin controlador. No confundas los indicadores de PC con los de PS5.',
            'Si necesitas el controlador, sigue las instrucciones oficiales del modelo, incluido cuándo conectar USB, y reinicia al terminar. Evita actualizadores genéricos. Aunque esté instalado, continúa con la prueba de entrada.',
          ],
          note: 'El 16 de octubre de 2026 la página de NEO indicaba que no hacía falta actualizar el firmware. Reprogramarlo no es la primera comprobación.',
        },
        {
          id: 'test-input-path',
          title: 'Prueba ejes y botones fuera del juego',
          summary: 'Confirma la conexión antes de añadir cambios en AC8.',
          time: 'Unos 5 minutos',
          risk: 'low',
          actions: [
            'Conecta al USB del PC según el manual y compara otro puerto si hace falta. En el panel o prueba del fabricante, mueve individualmente cada eje del joystick, acelerador y pedales y prueba los botones. Anota las respuestas.',
            'Si no aparece o falla un eje, revisa cableado, modo y controlador específico; consulta al fabricante. Continúa si todo responde. No uses modos de ejes ni controladores de otro modelo.',
          ],
        },
        {
          id: 'compare-game',
          title: 'Compara la asignación de AC8 tras superar la prueba',
          summary:
            'La página de NEO enlaza un esquema de asignación nativa para AC8.',
          time: 'Unos 5–10 minutos',
          risk: 'low',
          actions: [
            'Anota la asignación actual y compárala con el esquema de AC8 para tu modelo y las instrucciones de tu pantalla. Repite la misma escena de práctica y entrada. No copies Input.ini ni identificadores de AC7.',
            'Solo si ya utilizas un mapeador externo, cierra normalmente juego y herramienta y compara con un único conjunto físico. Una mejora apunta a rutas duplicadas; si no cambia, restaura lo anotado. No impongas activar Steam Input a todos ni instalar un mapeador nuevo.',
          ],
        },
        {
          id: 'record-hotas',
          title: 'Separa fallos de pedales y fallos exclusivos del juego',
          summary: 'Una consulta de PS5 no confirma un defecto de PC.',
          time: 'Unos 5 minutos',
          risk: 'low',
          actions: [
            'Si solo fallan los pedales, anota modelo, conexión, movimiento del eje en la prueba y resultado distinto dentro de AC8. Consulta el manual de esa combinación antes de cambiar conexión o modo.',
            'Acude al fabricante si también falla su prueba; al soporte del juego si funciona fuera de AC8. Incluye modelo, SO, controlador, modo y entradas que responden o fallan. Para ST-3100001 o cierres del juego, usa las guías relacionadas.',
          ],
          note: 'La consulta TFRP enlazada se refiere a PS5; no establece una solución ni reproducción en PC.',
        },
      ],
      avoid: [
        'No reutilices archivos de AC7 ni identificadores de dispositivo sin confirmar en AC8.',
        'No empieces eliminando controladores en masa, desactivando protección o instalando otro mapeador.',
      ],
      cautions: [
        'Fuentes revisadas el 16 de octubre de 2026. No se afirma una prueba física ni compatibilidad garantizada con todos los HOTAS/pedales.',
        'Distingue la lista del editor, las instrucciones del fabricante y las experiencias personales. El número de comentarios no mide fallos ni compatibilidad.',
      ],
      faqs: [
        {
          question: '¿El modo NEO garantiza que cualquier pedal funcione?',
          answer:
            'No. El modo, la conexión de pedales y la asignación del juego son comprobaciones distintas. Compara compatibilidad del fabricante, prueba de entrada y resultado en AC8.',
        },
        {
          question:
            '¿Puedo reutilizar una configuración que funcionaba en AC7?',
          answer:
            'Funcionar en AC7 no confirma soporte para AC8. Consulta documentación específica y no supongas que las rutas o el formato de Input.ini son iguales.',
        },
      ],
      related: [
        {
          href: '/es/games/ace-combat-8/stutter-audio-cutting-out',
          label: 'Tirones o cortes de audio durante el juego',
        },
        {
          href: '/es/games/ace-combat-8/not-launching',
          label: 'No inicia o se cierra',
        },
        {
          href: '/en/games/ace-combat-8/error-st-3100001',
          label: 'Error online ST-3100001 (inglés)',
        },
      ],
    },
  },
};
