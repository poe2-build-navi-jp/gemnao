import type { LocalizedArticle } from '@/lib/localized/types';
import { rocketLeagueSourceUrls as urls } from '@/lib/rocket-league-articles';

// Same scope, step IDs, evidence and safety boundaries as the Japanese edition.
export const rocketLeagueLocalizedArticles: LocalizedArticle[] = [
  {
    locale: 'en',
    gameSlug: 'rocket-league',
    gameName: 'Rocket League',
    slug: 'dualsense-not-working',
    checkedAt: '2026-10-03',
    title: 'Rocket League PS5 Controller Not Working on PC: DualSense Checks',
    shortTitle: 'DualSense not working',
    description:
      'Check a DualSense that will not work in Rocket League on Windows. Separate Epic and Steam, USB and Bluetooth, Player 2 behavior and failures after updates.',
    lead: 'For the standard DualSense controller on Windows when it is missing, works outside Rocket League but not in-game, or joins as Player 2. Epic Games Launcher and Steam have separate branches. This is not a guide for every controller model.',
    summary:
      'Check the controller software, close the game, disconnect the DualSense, restart the PC and reconnect it. If input also fails outside the game, investigate the connection first. If Windows receives input but only the Steam edition fails, compare its per-game Steam Input setting. Repeat the same test after each change and restore settings that do not help.',
    sourcePolicy:
      'This guide synthesizes Epic, Sony, Microsoft and Valve documentation. The comparison tests and interpretation are editorial troubleshooting steps, not hands-on proof of a fix or a measured success rate. Follow newer official guidance if it changes.',
    quickFacts: [
      {
        label: 'Controller covered',
        value: 'Standard DualSense (PS5 controller)',
      },
      { label: 'Windows controller list', value: 'joy.cpl', copy: true },
      {
        label: 'Firmware app',
        value: 'Sony’s official PlayStation Accessories',
      },
      {
        label: 'Connection types',
        value:
          'Epic’s DualSense-specific instructions include both USB and Bluetooth',
      },
    ],
    diagnosis: [
      {
        symptom: 'The PC cannot detect the device or its button input',
        cause: 'Check the connection before changing game settings',
        stepId: 'check-connection',
      },
      {
        symptom: 'DualSense fails with Epic or Steam',
        cause: 'Start with the official controller-software check',
        stepId: 'update-dualsense',
      },
      {
        symptom: 'It joins as Player 2 or one press registers twice',
        cause:
          'Distinguish this from no detection; compare with one physical controller',
        stepId: 'restart-reconnect',
      },
      {
        symptom: 'Input works on the PC but only the Steam edition fails',
        cause: 'Compare the input settings between Steam and the game',
        stepId: 'steam-input',
      },
      {
        symptom: 'The problem began after an update and persists',
        cause:
          'Preserve the reproduction details and check official known issues',
        stepId: 'report-result',
      },
    ],
    steps: [
      {
        id: 'identify-environment',
        title: 'Identify the controller, launcher and exact symptom',
        summary:
          'A connection failure, missing in-game input and Player 2 behavior call for different checks.',
        time: 'About 2 minutes',
        risk: 'low',
        actions: [
          'Confirm that this is a standard DualSense. Do not automatically apply its model-specific instructions to a DualShock 4, Xbox controller, Switch Pro controller or DualSense Edge.',
          'Record whether you launch directly from Epic Games Launcher or from the Steam library, whether the connection is USB or Bluetooth, and when it last worked. Note any existing setup that launches the Epic edition through Steam.',
          'Describe the result: no input, menus only, two actions from one press, or joining as Player 2. If it began after an update, distinguish game, Windows and controller updates.',
        ],
        note: 'If you can control Player 2, some input is reaching the game. Do not treat that as proof that Windows cannot detect the controller or start deleting drivers.',
      },
      {
        id: 'check-connection',
        title: 'Check detection and input outside the game',
        summary:
          'Establish whether the PC receives the device and its input before changing Rocket League settings.',
        time: 'About 3 minutes',
        risk: 'low',
        actions: [
          'Close the game. Press Windows+R, enter joy.cpl and check the controller list. If the device properties offer a test panel, try its buttons and sticks. A device name alone does not establish whether it is physical or virtual.',
          'If it is missing, compare a data-capable USB cable and another USB port. For Bluetooth, check the PC connection and use Sony’s PC pairing instructions if needed. A charging light alone does not prove that input is arriving.',
          'If USB input works but wireless input does not, investigate the wireless connection. If the PC input test works but Rocket League does not, investigate the game’s input path. If no test panel is available, compare the same buttons in a compatible game you already use.',
        ],
        note: 'USB is a comparison test, not proof that Bluetooth is unsupported. Record any existing input-remapping software or settings that hide a physical device.',
      },
      {
        id: 'update-dualsense',
        title: 'Check firmware with Sony’s official app',
        summary:
          'Epic’s DualSense-specific guidance starts with the controller software.',
        time: 'About 5–10 minutes',
        risk: 'medium',
        actions: [
          'Open PlayStation Accessories from the official Sony source below. Its official requirements are Windows 10 (64-bit) or Windows 11, at least 250 MB of free space and a display resolution of at least 1280 × 800. If needed, install it on a compatible PC from that official page. A third-party driver updater is unnecessary.',
          'Connect the DualSense and record the firmware version shown. If an update is offered, follow the on-screen instructions to completion. If it is already current, continue without reinstalling it.',
          'Keep the PC powered on and the controller connected throughout the update. Close the app after the update finishes.',
        ],
        note: 'Firmware is not a setting you can simply toggle back. If an unstable connection prevents completion, consult Sony’s guidance rather than repeatedly unplugging the controller.',
      },
      {
        id: 'restart-reconnect',
        title: 'Restart, reconnect and repeat a consistent test',
        summary:
          'Epic’s official sequence covers both launchers and allows reconnection by USB or Bluetooth.',
        time: 'About 3–5 minutes',
        risk: 'low',
        actions: [
          'With the game closed, disconnect the DualSense and restart the PC. Reconnect the controller, confirm the connection, then launch Rocket League from your usual launcher.',
          'Briefly press a direction once in a menu. Then test movement and jumping in Free Play or another non-competitive setting. Working menus alone do not establish that gameplay input is fixed.',
          'If Player 2 behavior or double input remains, close the game and compare with just one physical gamepad, disconnecting only extra gamepads. If you already use a remapping tool, record its settings and separately compare with that tool normally closed. Restore it if the result is worse.',
        ],
        note: 'The one-controller comparison is an editorial diagnostic, not an official universal Player 2 fix. Keep your keyboard, mouse, external drives and necessary accessibility devices connected.',
      },
      {
        id: 'steam-input',
        title: 'Steam edition only: compare the per-game Steam Input setting',
        summary:
          'Use this branch when PC input works and the Steam edition still fails after the official reconnect sequence.',
        time: 'About 3–5 minutes',
        risk: 'low',
        actions: [
          'Skip this step when launching directly from Epic Games Launcher. Do not add the Epic edition to Steam or install a new remapping tool solely for this repair.',
          'Select Rocket League in the Steam library and open the controller configuration near the play controls. Record its per-game Steam Input setting. Compare disabled if it was enabled, or enabled if it was disabled. If it uses the default, record that original value before comparing explicit settings. Names and placement vary by Steam version.',
          'Close and relaunch the game after each change, repeating the same menu and Free Play tests. Restore the original if input disappears or duplication worsens. If neither setting changes the result, continue without piling on more changes.',
        ],
        note: 'This uses Valve’s per-device and per-game input controls as a diagnostic. Neither enabled nor disabled is a guaranteed answer for every Rocket League setup.',
      },
      {
        id: 'report-result',
        title: 'Separate update-related symptoms from device problems',
        summary:
          'A clear comparison record is more useful than repeatedly changing the same settings.',
        time: 'About 5 minutes',
        risk: 'low',
        actions: [
          'Collect the launcher, controller model, USB/Bluetooth result, firmware, Windows version, last working time and each test result. Say whether the failure occurs only in Rocket League or also in another game or PC input test.',
          'For a problem that started after a game update, use Epic’s live-issues page below to reach the official known-issues information. Timing alone does not prove that the update or anti-cheat caused it.',
          'If the official DualSense sequence does not help, follow Epic’s referral to PlayStation Controllers Support. For Rocket League-only failures, Epic’s bug-reporting instructions point to public Reddit/X posts. Initially share only the symptom and comparison results without private information. Never post logs or unredacted images or videos publicly. If an image is needed, keep the original and use opaque masking on a local copy to remove names, email addresses and account identifiers. Never send credentials.',
        ],
        note: 'These are documented checks, not a repair reproduced by our editors on the same hardware. Give newer official instructions priority.',
      },
    ],
    avoid: [
      'Do not delete saves or configuration folders solely to fix controller input.',
      'Do not disable anti-cheat or security protection, or install unofficial DLLs or driver-updater tools.',
      'Do not turn older Steam-only advice or guidance for another model into a blanket claim that Bluetooth cannot work.',
      'Do not power off the PC or disconnect the controller during a firmware update.',
    ],
    cautions: [
      'Change one thing at a time, record settings and results, and undo setting changes that do not help.',
      'Test in menus and Free Play rather than an active match. Times are estimates.',
    ],
    faqs: [
      {
        question: 'Is a Bluetooth DualSense unsupported?',
        answer:
          'There is no blanket prohibition in the current DualSense-specific guidance: both Epic and Sony cover USB and Bluetooth. If wired input works and only wireless fails, isolate the PC’s wireless connection first.',
      },
      {
        question:
          'Does appearing in PlayStation Accessories mean the game receives input?',
        answer:
          'No. Device detection and Rocket League receiving button presses are separate checks. Compare PC input, the game menu and Free Play in that order.',
      },
      {
        question: 'Should I change Steam Input for the Epic edition?',
        answer:
          'Not when launching directly from Epic Games Launcher. If you already launch that edition through Steam, record that extra layer and do not confuse it with a direct Epic launch.',
      },
      {
        question:
          'Should I disable anti-cheat if this started after an update?',
        answer:
          'This guide does not recommend disabling it. Record the last working time, what was updated and the connection-specific results, then compare them with official issue reports. An update preceding a failure does not establish its cause.',
      },
    ],
    sources: [
      {
        label:
          'Epic: PlayStation 5 controller not working in Rocket League on PC',
        url: urls.epicDualSense,
      },
      {
        label: 'Sony: PlayStation Accessories and firmware updates',
        url: urls.sonyFirmware,
      },
      {
        label: 'Sony: DualSense USB and Bluetooth connections on PC',
        url: urls.sonyConnection,
      },
      {
        label: 'Microsoft: open controller settings with joy.cpl',
        url: urls.windowsControllers,
      },
      {
        label:
          'Valve: per-game Steam Input and controller-support display (November 2023)',
        url: urls.steamInput,
      },
      {
        label: 'Epic: Rocket League live issues and system status',
        url: urls.liveIssues,
      },
      { label: 'Sony: PlayStation Controllers Support', url: urls.sonySupport },
      {
        label: 'Epic: reporting Rocket League bugs on public social media',
        url: urls.bugReport,
      },
    ],
    related: [
      {
        href: '/en/games/rocket-league',
        label: 'Rocket League PC troubleshooting',
      },
    ],
  },
  {
    locale: 'zh',
    gameSlug: 'rocket-league',
    gameName: 'Rocket League',
    slug: 'dualsense-not-working',
    checkedAt: '2026-10-03',
    title: 'Rocket League PC 版 PS5 手柄没反应：DualSense 排查指南',
    shortTitle: 'DualSense 没反应',
    description:
      '排查 Windows 版 Rocket League 的 DualSense 输入问题，区分 Epic 与 Steam、USB 与蓝牙、变成玩家 2 和更新后才出现的故障。',
    lead: '适用于 Windows 上的标准版 DualSense：无法识别、其他程序能用但 Rocket League 没反应，或以玩家 2 的身份加入。Epic Games Launcher 版和 Steam 版分别处理，不适用于所有型号的手柄。',
    summary:
      '先检查手柄软件，退出游戏，断开 DualSense，重启电脑后重新连接。游戏外也没有输入时先查连接；电脑能收到输入、只有 Steam 版游戏没反应时，再比较该游戏的 Steam 输入设置。每次只改一项，用同一操作测试，无效的设置改回原值。',
    sourcePolicy:
      '本文依据 Epic、Sony、Microsoft 和 Valve 的官方资料整理。对照测试及结果判断属于编辑整理的排查方法，并非同型号实机修复记录，也不代表成功率。官方说明更新时，以新说明为准。',
    quickFacts: [
      { label: '适用手柄', value: '标准版 DualSense（PS5 手柄）' },
      { label: 'Windows 手柄列表', value: 'joy.cpl', copy: true },
      { label: '固件更新应用', value: 'Sony 官方 PlayStation Accessories' },
      {
        label: '连接方式',
        value: 'Epic 的 DualSense 专用说明同时列出 USB 和蓝牙',
      },
    ],
    diagnosis: [
      {
        symptom: '电脑也检测不到设备或按键输入',
        cause: '先排查连接，再调整游戏设置',
        stepId: 'check-connection',
      },
      {
        symptom: '在 Epic 或 Steam 版中没有反应',
        cause: '从官方的手柄软件检查开始',
        stepId: 'update-dualsense',
      },
      {
        symptom: '变成玩家 2，或按一次触发两次',
        cause: '与完全未识别分开处理，用一个实体手柄对照测试',
        stepId: 'restart-reconnect',
      },
      {
        symptom: '电脑能收到输入，只有 Steam 版没反应',
        cause: '比较 Steam 向游戏传递输入的设置',
        stepId: 'steam-input',
      },
      {
        symptom: '更新后才出现，且对照测试后仍存在',
        cause: '保留复现条件，检查官方已知问题',
        stepId: 'report-result',
      },
    ],
    steps: [
      {
        id: 'identify-environment',
        title: '确认型号、启动方式和具体症状',
        summary: '连接失败、游戏不接收输入和玩家 2 问题，需要检查的环节不同。',
        time: '约 2 分钟',
        risk: 'low',
        actions: [
          '确认是标准版 DualSense。不要把型号专用的操作直接套用于 DualShock 4、Xbox、Switch Pro 或 DualSense Edge。',
          '记录是直接从 Epic Games Launcher 启动，还是从 Steam 库启动；连接是 USB 还是蓝牙，以及最后一次正常使用的时间。如果已设置通过 Steam 启动 Epic 版，也要注明。',
          '区分完全无输入、仅菜单可用、按一次触发两次、以玩家 2 加入。若出现在更新后，分别记录更新的是游戏、Windows 还是手柄软件。',
        ],
        note: '能控制玩家 2，说明已有部分输入传入游戏。这与完全未识别不同，不要据此认定 Windows 检测不到手柄并删除驱动。',
      },
      {
        id: 'check-connection',
        title: '先在游戏外检查识别和输入',
        summary: '调整 Rocket League 前，先确定电脑能否收到设备和按键输入。',
        time: '约 3 分钟',
        risk: 'low',
        actions: [
          '退出游戏，按 Windows+R，输入 joy.cpl，查看手柄列表。如果设备属性中有测试界面，检查按键和摇杆的反应。不要仅凭名称判断它是实体设备还是虚拟设备。',
          '列表中没有设备时，换用可传输数据的 USB 线和另一个 USB 接口对比。蓝牙连接则检查电脑上的连接状态，必要时按 Sony 的 PC 配对说明操作。充电灯亮不代表输入已传入电脑。',
          '只有 USB 能收到输入时，接着查无线连接；电脑输入测试正常而 Rocket League 不正常时，接着查游戏的输入路径。没有可用测试界面时，可在已经使用的兼容游戏中测试同样的按键。',
        ],
        note: 'USB 是对照条件，不能仅凭有线恢复就断言蓝牙不受支持。如果使用了输入映射工具或隐藏实体设备的设置，也要记录。',
      },
      {
        id: 'update-dualsense',
        title: '用 Sony 官方应用检查固件',
        summary: 'Epic 的 DualSense 专用说明首先要求检查手柄软件。',
        time: '约 5–10 分钟',
        risk: 'medium',
        actions: [
          '从下方 Sony 官方来源打开 PlayStation Accessories。官方要求为 Windows 10（64 位）或 Windows 11、至少 250 MB 可用空间、1280 × 800 或更高分辨率。尚未安装时，在满足条件的电脑上从官方页面下载安装。不需要第三方驱动更新工具。',
          '连接 DualSense，记录应用显示的固件版本。仅在提示有更新时，按屏幕说明完成更新；已经是最新版就继续下一步，不要反复重装。',
          '更新期间保持电脑开机，不要断开手柄。更新完成后退出应用。',
        ],
        note: '固件更新不像普通设置那样能轻松切回原值。如果连接不稳定导致更新无法完成，请查看 Sony 的说明，不要反复拔插。',
      },
      {
        id: 'restart-reconnect',
        title: '重启、重连，再用相同操作测试',
        summary:
          'Epic 的官方顺序适用于两个启动器，并允许通过 USB 或蓝牙重新连接。',
        time: '约 3–5 分钟',
        risk: 'low',
        actions: [
          '保持游戏关闭，断开 DualSense 并重启电脑。重新连接手柄，确认连接成功后，再用平时的启动器打开 Rocket League。',
          '在菜单里短按一次方向键，再到自由训练等不影响对局的场景测试移动和跳跃。菜单能操作，不代表游玩时的输入也已恢复。',
          '仍以玩家 2 加入或出现重复输入时，退出游戏，只断开多余的游戏手柄，用一个实体手柄重试。若你本来就在使用输入映射工具，记录设置后，另做一次正常退出该工具的对照测试；情况变差就恢复原状。',
        ],
        note: '单手柄对照属于编辑整理的诊断方法，不是官方保证有效的玩家 2 通用修复。无需拔下键盘、鼠标、外置硬盘或必要的辅助设备。',
      },
      {
        id: 'steam-input',
        title: '仅 Steam 版：比较游戏专用的 Steam 输入设置',
        summary:
          '电脑能收到输入，但按官方顺序重连后 Steam 版仍无反应时，再进入此分支。',
        time: '约 3–5 分钟',
        risk: 'low',
        actions: [
          '直接从 Epic Games Launcher 启动时跳过本步。不要仅为修复此问题把 Epic 版添加到 Steam，也不要额外安装输入映射工具。',
          '在 Steam 库中选择 Rocket League，打开开始游戏区域附近的控制器配置。记录该游戏的 Steam 输入设置：已启用则对比禁用，已禁用则对比启用；使用默认值时，先记下原值，再分别测试明确的选项。名称和位置可能随 Steam 版本变化。',
          '每改一项都退出并重新启动游戏，重复相同的菜单和自由训练测试。若变成无输入或重复输入加重，恢复原值；两种设置都没改变结果时，继续下一步，不要叠加更多修改。',
        ],
        note: '这是利用 Valve 的设备及游戏专用输入设置进行诊断，不能保证所有 Rocket League 环境都应该统一启用或禁用。',
      },
      {
        id: 'report-result',
        title: '区分更新后的症状与设备问题，再联系支持',
        summary: '清楚的对照记录比重复修改同一设置更有助于继续排查。',
        time: '约 5 分钟',
        risk: 'low',
        actions: [
          '汇总启动器、手柄型号、USB／蓝牙结果、固件、Windows 版本、最后正常时间及各步结果。说明问题仅在 Rocket League 出现，还是其他游戏和电脑输入测试也会出现。',
          '仅在游戏更新后出现时，从下方 Epic 的实时问题页面进入官方已知问题说明。时间先后本身不能证明更新或反作弊组件就是原因。',
          '官方 DualSense 步骤无效时，按 Epic 指引联系 PlayStation 手柄支持。仅 Rocket League 出问题时，Epic 的错误报告说明会引导至公开的 Reddit／X 帖子。先只发布不含私人信息的症状和对照结果，不要公开上传日志或未经遮盖的图片、视频。如需图片，保留原文件，在本地副本上用不透明色块遮住姓名、邮箱、账号标识等信息。不要发送任何认证凭据。',
        ],
        note: '本文是官方资料整理，并非编辑在相同硬件上复现成功的修复记录。官方提供新说明时，请优先遵循。',
      },
    ],
    avoid: [
      '不要仅为手柄输入问题删除存档或配置文件夹。',
      '不要禁用反作弊或安全防护，不要安装非官方 DLL 或驱动更新工具。',
      '不要把旧版 Steam 专用说明或其他型号的说明概括成“蓝牙一律不支持”。',
      '固件更新期间不要关闭电脑或断开手柄。',
    ],
    cautions: [
      '每次只改一项，保留设置与结果；无效的设置修改应还原。',
      '在菜单和自由训练中测试，不要影响正在进行的对局。耗时仅供参考。',
    ],
    faqs: [
      {
        question: 'DualSense 不能通过蓝牙使用吗？',
        answer:
          '不能一概而论。当前 Epic 的 DualSense 专用说明及 Sony 的 PC 连接说明都包含 USB 和蓝牙。有线输入正常、只有无线失败时，先排查与电脑的无线连接。',
      },
      {
        question:
          'PlayStation Accessories 显示了设备，就说明游戏收到输入了吗？',
        answer:
          '不是。设备被识别与 Rocket League 收到按键是两回事。请依次对比电脑输入、游戏菜单和自由训练。',
      },
      {
        question: 'Epic 版也需要修改 Steam 输入吗？',
        answer:
          '直接从 Epic Games Launcher 启动时不需要。如果本来就通过 Steam 启动 Epic 版，请记录这一额外输入路径，不要与直接启动混为一谈。',
      },
      {
        question: '更新后才失灵，可以关闭反作弊吗？',
        answer:
          '本文不建议关闭。请记录最后正常时间、更新内容及不同连接方式的测试结果，再与官方问题说明核对。先更新后出问题，并不能单独证明故障原因。',
      },
    ],
    sources: [
      {
        label: 'Epic 官方：PC 版 Rocket League 的 PS5 手柄问题（英语）',
        url: urls.epicDualSense,
      },
      {
        label: 'Sony 官方：PlayStation Accessories 与固件更新（英语）',
        url: urls.sonyFirmware,
      },
      {
        label: 'Sony 官方：DualSense 在 PC 上的 USB 与蓝牙连接（英语）',
        url: urls.sonyConnection,
      },
      {
        label: 'Microsoft 官方：通过 joy.cpl 打开手柄设置（英语）',
        url: urls.windowsControllers,
      },
      {
        label:
          'Valve 官方：游戏专用 Steam 输入与手柄支持显示（2023 年 11 月，英语）',
        url: urls.steamInput,
      },
      {
        label: 'Epic 官方：Rocket League 实时问题与系统状态（英语）',
        url: urls.liveIssues,
      },
      {
        label: 'Sony 官方：PlayStation 手柄支持（英语）',
        url: urls.sonySupport,
      },
      {
        label: 'Epic 官方：在公开社交平台报告 Rocket League 错误（英语）',
        url: urls.bugReport,
      },
    ],
    related: [
      { href: '/zh/games/rocket-league', label: 'Rocket League PC 问题排查' },
    ],
  },
  {
    locale: 'es',
    gameSlug: 'rocket-league',
    gameName: 'Rocket League',
    slug: 'dualsense-not-working',
    checkedAt: '2026-10-03',
    title:
      'El mando de PS5 no funciona en Rocket League para PC: guía de DualSense',
    shortTitle: 'DualSense no funciona',
    description:
      'Comprueba un DualSense que no responde en Rocket League para Windows. Distingue Epic y Steam, USB y Bluetooth, jugador 2 y fallos posteriores a una actualización.',
    lead: 'Para el DualSense estándar en Windows cuando no se detecta, funciona fuera de Rocket League pero no dentro, o entra como jugador 2. Las versiones de Epic Games Launcher y Steam tienen comprobaciones distintas. No es una guía para todos los modelos de mando.',
    summary:
      'Comprueba el software del mando, cierra el juego, desconecta el DualSense, reinicia el PC y vuelve a conectarlo. Si tampoco hay respuesta fuera del juego, revisa primero la conexión. Si el PC recibe las pulsaciones y solo falla la versión de Steam, compara su ajuste de Steam Input por juego. Repite la misma prueba tras cada cambio y restaura los ajustes que no ayuden.',
    sourcePolicy:
      'Esta guía reúne documentación oficial de Epic, Sony, Microsoft y Valve. Las pruebas comparativas y su interpretación son propuestas editoriales de diagnóstico, no reparaciones reproducidas en el mismo equipo ni una tasa de éxito medida. Da prioridad a las instrucciones oficiales más recientes.',
    quickFacts: [
      { label: 'Modelo cubierto', value: 'DualSense estándar (mando de PS5)' },
      { label: 'Lista de mandos en Windows', value: 'joy.cpl', copy: true },
      {
        label: 'Aplicación de firmware',
        value: 'PlayStation Accessories, oficial de Sony',
      },
      {
        label: 'Conexiones',
        value:
          'La guía de Epic específica para DualSense contempla USB y Bluetooth',
      },
    ],
    diagnosis: [
      {
        symptom: 'El PC tampoco detecta el dispositivo o sus pulsaciones',
        cause: 'Revisa la conexión antes de modificar el juego',
        stepId: 'check-connection',
      },
      {
        symptom: 'DualSense no responde en Epic o Steam',
        cause: 'Empieza por la comprobación oficial del software del mando',
        stepId: 'update-dualsense',
      },
      {
        symptom: 'Entra como jugador 2 o una pulsación se registra dos veces',
        cause:
          'No equivale a falta de detección; compara con un solo mando físico',
        stepId: 'restart-reconnect',
      },
      {
        symptom:
          'El PC recibe las pulsaciones y solo falla la versión de Steam',
        cause: 'Compara los ajustes de entrada entre Steam y el juego',
        stepId: 'steam-input',
      },
      {
        symptom: 'Empezó tras una actualización y sigue fallando',
        cause:
          'Conserva los pasos de reproducción y consulta los problemas conocidos',
        stepId: 'report-result',
      },
    ],
    steps: [
      {
        id: 'identify-environment',
        title: 'Identifica el mando, el lanzador y el síntoma concreto',
        summary:
          'Una conexión fallida, la ausencia de respuesta en el juego y entrar como jugador 2 requieren comprobaciones diferentes.',
        time: 'Unos 2 minutos',
        risk: 'low',
        actions: [
          'Confirma que es un DualSense estándar. No apliques automáticamente sus instrucciones específicas a un DualShock 4, un mando Xbox, un Switch Pro o un DualSense Edge.',
          'Anota si inicias directamente desde Epic Games Launcher o desde la biblioteca de Steam, si usas USB o Bluetooth y cuándo funcionó por última vez. Indica también si ya tienes una configuración para abrir la versión de Epic a través de Steam.',
          'Distingue entre ninguna respuesta, respuesta solo en menús, dos acciones por pulsación o entrada como jugador 2. Si empezó tras actualizar, aclara si se actualizó el juego, Windows o el software del mando.',
        ],
        note: 'Si puedes controlar al jugador 2, alguna entrada sí llega al juego. Eso no demuestra que Windows sea incapaz de detectar el mando ni justifica borrar controladores.',
      },
      {
        id: 'check-connection',
        title: 'Comprueba la detección y las pulsaciones fuera del juego',
        summary:
          'Antes de cambiar Rocket League, comprueba si el PC recibe el dispositivo y sus entradas.',
        time: 'Unos 3 minutos',
        risk: 'low',
        actions: [
          'Cierra el juego. Pulsa Windows+R, escribe joy.cpl y revisa la lista de mandos. Si las propiedades del dispositivo ofrecen un panel de prueba, comprueba botones y palancas. El nombre por sí solo no distingue un dispositivo físico de uno virtual.',
          'Si no aparece, compara con un cable USB que transmita datos y otro puerto USB. Para Bluetooth, comprueba la conexión con el PC y utiliza las instrucciones de emparejamiento de Sony si hace falta. Una luz de carga no demuestra que lleguen las pulsaciones.',
          'Si responde por USB pero no de forma inalámbrica, revisa la conexión inalámbrica. Si la prueba del PC funciona y Rocket League no, revisa cómo llega la entrada al juego. Si no hay panel de prueba, compara los mismos botones en un juego compatible que ya utilices.',
        ],
        note: 'USB sirve como comparación; no demuestra que Bluetooth sea incompatible. Anota cualquier programa de reasignación o ajuste existente que oculte el dispositivo físico.',
      },
      {
        id: 'update-dualsense',
        title: 'Comprueba el firmware con la aplicación oficial de Sony',
        summary:
          'La guía específica de Epic para DualSense empieza por el software del mando.',
        time: 'Unos 5–10 minutos',
        risk: 'medium',
        actions: [
          'Abre PlayStation Accessories desde la fuente oficial de Sony enlazada abajo. Los requisitos oficiales son Windows 10 de 64 bits o Windows 11, al menos 250 MB libres y una resolución mínima de 1280 × 800. Si hace falta, instálala en un PC compatible desde esa página oficial. No necesitas un actualizador de controladores de terceros.',
          'Conecta el DualSense y anota la versión de firmware indicada. Si se ofrece una actualización, sigue las instrucciones hasta terminar. Si ya está actualizado, continúa sin reinstalarlo.',
          'Mantén el PC encendido y el mando conectado durante toda la actualización. Cierra la aplicación cuando termine.',
        ],
        note: 'El firmware no es un ajuste que puedas devolver fácilmente al valor anterior. Si una conexión inestable impide terminar, consulta las instrucciones de Sony en lugar de desconectar y reconectar repetidamente.',
      },
      {
        id: 'restart-reconnect',
        title: 'Reinicia, reconecta y repite una prueba consistente',
        summary:
          'La secuencia oficial de Epic cubre ambos lanzadores y permite reconectar por USB o Bluetooth.',
        time: 'Unos 3–5 minutos',
        risk: 'low',
        actions: [
          'Con el juego cerrado, desconecta el DualSense y reinicia el PC. Reconecta el mando, confirma la conexión y abre Rocket League desde tu lanzador habitual.',
          'Pulsa brevemente una dirección una sola vez en un menú. Después prueba movimiento y salto en Juego libre u otro entorno que no afecte a una partida competitiva. Que funcionen los menús no demuestra que se haya resuelto la entrada durante el juego.',
          'Si sigue entrando como jugador 2 o hay entradas duplicadas, cierra el juego y compara con un solo mando físico, desconectando únicamente los mandos adicionales. Si ya utilizas una herramienta de reasignación, anota sus ajustes y haz otra comparación con ella cerrada normalmente. Restáurala si empeora.',
        ],
        note: 'La comparación con un solo mando es un diagnóstico editorial, no una solución oficial universal para el jugador 2. Conserva conectados teclado, ratón, discos externos y dispositivos de accesibilidad necesarios.',
      },
      {
        id: 'steam-input',
        title: 'Solo Steam: compara el ajuste de Steam Input por juego',
        summary:
          'Usa esta opción si el PC recibe entradas y la versión de Steam sigue fallando tras la reconexión oficial.',
        time: 'Unos 3–5 minutos',
        risk: 'low',
        actions: [
          'Omite este paso si inicias directamente desde Epic Games Launcher. No añadas la versión de Epic a Steam ni instales otra herramienta de reasignación solo para intentar esta reparación.',
          'Selecciona Rocket League en la biblioteca de Steam y abre la configuración del mando cerca de los controles para jugar. Anota el ajuste de Steam Input para ese juego: compara desactivado si estaba activado, o activado si estaba desactivado. Si utiliza el valor predeterminado, anótalo antes de probar opciones explícitas. Los nombres y la ubicación cambian según la versión de Steam.',
          'Cierra y vuelve a iniciar el juego después de cada cambio, repitiendo las pruebas de menú y Juego libre. Restaura el valor anterior si desaparece la respuesta o empeoran las duplicaciones. Si ninguna opción cambia el resultado, continúa sin acumular más modificaciones.',
        ],
        note: 'Es una prueba con los controles de entrada por dispositivo y juego de Valve. Ni activar ni desactivar Steam Input garantiza resolver todos los casos de Rocket League.',
      },
      {
        id: 'report-result',
        title:
          'Distingue los fallos tras actualizar de los problemas del dispositivo',
        summary:
          'Un registro claro de las comparaciones ayuda más que modificar una y otra vez los mismos ajustes.',
        time: 'Unos 5 minutos',
        risk: 'low',
        actions: [
          'Reúne el lanzador, modelo de mando, resultados por USB y Bluetooth, firmware, versión de Windows, último funcionamiento correcto y resultado de cada prueba. Indica si solo falla Rocket League o también otro juego o la prueba de entrada del PC.',
          'Si empezó tras actualizar el juego, utiliza la página de incidencias de Epic enlazada abajo para consultar los problemas conocidos oficiales. El orden temporal no demuestra que la actualización o el sistema antitrampas sea la causa.',
          'Si la secuencia oficial de DualSense no ayuda, sigue la indicación de Epic de acudir al soporte de mandos de PlayStation. Para fallos exclusivos de Rocket League, Epic dirige los informes a publicaciones públicas en Reddit/X. Comparte primero solo el síntoma y las comparaciones, sin información privada. No publiques registros. Tampoco publiques imágenes ni vídeos sin ocultar los datos privados. Si hace falta una imagen, conserva el original y tapa nombres, correos e identificadores de cuenta con bloques opacos en una copia local. Nunca envíes credenciales.',
        ],
        note: 'Son comprobaciones documentadas, no una reparación reproducida por la redacción con el mismo equipo. Da prioridad a las instrucciones oficiales más recientes.',
      },
    ],
    avoid: [
      'No borres partidas ni carpetas de configuración solo por un problema de entrada del mando.',
      'No desactives el sistema antitrampas ni la protección de seguridad, y no instales DLL no oficiales ni actualizadores de controladores de terceros.',
      'No conviertas una guía antigua exclusiva de Steam o de otro modelo en una afirmación de que Bluetooth nunca funciona.',
      'No apagues el PC ni desconectes el mando durante una actualización de firmware.',
    ],
    cautions: [
      'Cambia una sola cosa cada vez, conserva ajustes y resultados, y revierte los cambios de configuración que no ayuden.',
      'Prueba en los menús y en Juego libre, no durante una partida. Los tiempos son orientativos.',
    ],
    faqs: [
      {
        question: '¿DualSense no es compatible por Bluetooth?',
        answer:
          'No se puede afirmar de forma general. Las instrucciones actuales de Epic específicas para DualSense y las de conexión de Sony contemplan USB y Bluetooth. Si funciona por cable y solo falla de forma inalámbrica, aísla primero la conexión inalámbrica con el PC.',
      },
      {
        question:
          '¿Aparecer en PlayStation Accessories confirma que el juego recibe pulsaciones?',
        answer:
          'No. Detectar el dispositivo y recibir sus botones en Rocket League son comprobaciones distintas. Compara la entrada del PC, el menú del juego y Juego libre, en ese orden.',
      },
      {
        question: '¿Debo cambiar Steam Input para la versión de Epic?',
        answer:
          'No si la abres directamente desde Epic Games Launcher. Si ya la ejecutas mediante Steam, anota esa capa adicional y no la confundas con un inicio directo desde Epic.',
      },
      {
        question:
          '¿Debo desactivar el sistema antitrampas si empezó tras actualizar?',
        answer:
          'Esta guía no recomienda desactivarlo. Anota cuándo funcionó por última vez, qué se actualizó y los resultados de cada conexión, y compáralos con las incidencias oficiales. Que el fallo aparezca después de una actualización no demuestra su causa.',
      },
    ],
    sources: [
      {
        label:
          'Epic: el mando de PS5 no funciona en Rocket League para PC (en inglés)',
        url: urls.epicDualSense,
      },
      {
        label:
          'Sony: PlayStation Accessories y actualización de firmware (en inglés)',
        url: urls.sonyFirmware,
      },
      {
        label:
          'Sony: conexión de DualSense por USB y Bluetooth en PC (en inglés)',
        url: urls.sonyConnection,
      },
      {
        label: 'Microsoft: abrir los ajustes del mando con joy.cpl (en inglés)',
        url: urls.windowsControllers,
      },
      {
        label:
          'Valve: Steam Input por juego e información de compatibilidad (noviembre de 2023, en inglés)',
        url: urls.steamInput,
      },
      {
        label: 'Epic: incidencias y estado de Rocket League (en inglés)',
        url: urls.liveIssues,
      },
      {
        label: 'Sony: soporte de mandos de PlayStation (en inglés)',
        url: urls.sonySupport,
      },
      {
        label:
          'Epic: informar de errores de Rocket League en redes sociales públicas (en inglés)',
        url: urls.bugReport,
      },
    ],
    related: [
      {
        href: '/es/games/rocket-league',
        label: 'Solución de problemas de Rocket League para PC',
      },
    ],
  },
];
