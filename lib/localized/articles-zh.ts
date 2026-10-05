import type { LocalizedArticle } from '@/lib/localized/types';

// 七款经典游戏文章的简体中文版。所有步骤均来自各发行商的官方支持页面
// （2026-09-29／10-01 核对），见 sources。

const verify = (name: string) =>
  `在 Steam 库中右键点击“${name}”→“属性”→“已安装文件”→“验证游戏文件的完整性”。`;

const base = { locale: 'zh' as const, checkedAt: '2026-10-01' };

export const articlesZh: LocalizedArticle[] = [
  {
    ...base,
    gameSlug: 'cyberpunk-2077',
    slug: 'not-launching',
    title: '《赛博朋克 2077》PC 版无法启动、闪退的解决方法｜按官方顺序排查',
    shortTitle: '无法启动・闪退',
    description:
      '《赛博朋克 2077》PC 版无法启动或频繁崩溃？先在不加载 MOD 的状态下测试，再按 CD PROJEKT RED 官方顺序排查：显卡驱动全新安装、Visual C++ 运行库、验证文件、叠加层与超频。',
    lead: '适用于 Windows 上的 Steam、GOG、Epic 版：点击“开始”后没有反应、REDlauncher 之后闪退，或游玩中突然回到桌面。',
    summary:
      '参考 CD PROJEKT RED 官方支持的检查项目，本文依次检查配置需求与 Windows、显卡驱动、Visual C++ 运行库和游戏文件。本文保留安全防护，仅逐一比较非必要叠加层。如果安装了 MOD，请先确认在不加载 MOD 的状态下能否启动。',
    quickFacts: [
      {
        label: '查看 Windows 版本',
        value: 'Windows + R →输入“winver”（Windows 10 需为 1909 或更高版本）',
      },
      {
        label: '存档位置',
        value: String.raw`%USERPROFILE%\Saved Games\CD Projekt Red\Cyberpunk 2077`,
        copy: true,
      },
      {
        label: '更新驱动后开始崩溃',
        value: '改装上一个版本的驱动（官方建议）',
      },
      { label: '使用了 MOD', value: '先在不加载 MOD 的状态下测试' },
    ],
    diagnosis: [
      {
        symptom: '安装 MOD 或大型更新后无法启动',
        cause: 'MOD 不支持当前游戏版本',
        stepId: 'mods-off',
      },
      {
        symptom: '更新显卡驱动后立刻开始崩溃',
        cause: '驱动问题',
        stepId: 'gpu-driver',
      },
      {
        symptom: '出现“找不到 MSVCP140.dll”等错误',
        cause: 'Visual C++ 运行库缺失或损坏',
        stepId: 'vcredist',
      },
      {
        symptom: '游玩中随机崩溃',
        cause: '文件损坏、叠加层或超频',
        stepId: 'verify-files',
      },
    ],
    steps: [
      {
        id: 'mods-off',
        title: '移除 MOD，并确认配置需求与 Windows 版本',
        summary: '先排除 MOD 的影响。',
        time: '约 5 分钟',
        actions: [
          '使用 MOD 管理器时，禁用全部 MOD；手动安装的 MOD，请把添加的文件移到其他文件夹。',
          '按 Windows + R，输入“winver”查看 Windows 版本。Windows 10 低于 1909 时请先更新（官方要求）。',
          '对照 Steam 商店的配置需求，确认显卡和内存。',
        ],
        note: '如果不加载 MOD 能正常启动，请把各个 MOD 更新到支持当前游戏版本的版本，再逐个加回。',
      },
      {
        id: 'gpu-driver',
        title: '全新安装显卡驱动',
        summary: '官方步骤是先删除旧驱动，再安装最新驱动。',
        time: '约 15 分钟',
        actions: [
          '先从 NVIDIA、AMD 或 Intel 官网下载最新驱动。',
          'NVIDIA 和 Intel：用 Display Driver Uninstaller（DDU）删除旧驱动，再安装下载好的驱动。AMD：用 AMD Cleanup Utility 删除后再安装。',
          '如果是更新驱动后才开始崩溃，请改装上一个版本。',
        ],
        note: '删除驱动时屏幕分辨率可能会变低，请事先在其他设备上打开本页步骤。',
      },
      {
        id: 'vcredist',
        title: '重新安装 Visual C++ 运行库',
        summary: '出现 DLL 错误，或启动后没有任何提示就关闭时检查。',
        time: '约 5 分钟',
        actions: [
          '从 Microsoft 官网下载 Visual C++ 运行库的 x64 版和 x86 版。',
          '分别右键点击安装程序 →“以管理员身份运行”。',
          '重启电脑后再启动游戏。',
        ],
      },
      {
        id: 'verify-files',
        title: '验证游戏文件，逐一比较非必要叠加层',
        summary: '修复损坏的文件，仅逐一比较非必要叠加层，并保持安全防护开启。',
        time: '10～20 分钟',
        actions: [
          verify('Cyberpunk 2077'),
          'GOG GALAXY 或 Epic Games 版本，请使用各启动器的验证/修复功能。',
          '仅逐一关闭 Discord、Ubisoft Connect、GOG GALAXY 等非必要叠加层，再比较启动结果。保持杀毒软件和防火墙开启。',
          '以管理员身份运行启动器（Steam、GOG GALAXY 或 Epic），再启动游戏。',
          'CPU 或显卡超频、降频时，请恢复默认设置（官方建议）。',
        ],
        note: '不要仅为启动游戏而恢复隔离文件或添加排除项。如果怀疑官方游戏文件被误报，请记录防护历史中的检测名称和目标文件，向安全软件官方支持或 CD PROJEKT RED 客服确认。',
      },
    ],
    avoid: [
      '不要在 MOD 仍然安装的状态下重新安装游戏，MOD 文件可能会残留。',
      '不要删除存档文件夹，开始前请先复制到其他位置。',
      '不要在超频状态下排查问题。',
    ],
    cautions: [
      '如果以上方法都无效，请带上显示的错误信息或错误代码联系 CD PROJEKT RED 客服（官方建议）。',
    ],
    faqs: [
      {
        question: 'REDlauncher 打不开。',
        answer:
          'CD PROJEKT RED 建议以管理员身份运行 Steam、Epic Games 或 GOG GALAXY 等商店程序，再从中启动游戏。',
      },
      {
        question: '重新安装会删除存档吗？',
        answer: String.raw`存档保存在 %USERPROFILE%\Saved Games\CD Projekt Red\Cyberpunk 2077，与游戏文件夹分开。为保险起见，开始前请把这个文件夹复制到安全位置。`,
      },
    ],
    sources: [
      {
        label:
          'CD PROJEKT RED 客服：Game is not launching — Cyberpunk 2077（英文）',
        url: 'https://support.cdprojektred.com/en/cyberpunk/pc/sp-technical/issue/1568/game-is-not-launching',
      },
      {
        label: 'CD PROJEKT RED 客服：Game crashes — Cyberpunk 2077（英文）',
        url: 'https://support.cdprojektred.com/en/cyberpunk/pc/sp-technical/issue/1700/my-game-crashes-7',
      },
      {
        label: 'CD PROJEKT RED 客服：找不到 MSVCP140_1.dll（英文）',
        url: 'https://support.cdprojektred.com/en/cyberpunk/pc/sp-technical/issue/1915/error-the-code-execution-cannot-proceed-because-msvcp140-1-dll-was-not-found',
      },
    ],
  },
  {
    ...base,
    gameSlug: 'baldurs-gate-3',
    slug: 'crash-on-startup',
    title: '《博德之门3》启动时闪退、无法启动的解决方法｜Larian 官方步骤（PC）',
    shortTitle: '启动时闪退',
    description:
      '《博德之门3》启动时崩溃或打不开？按 Larian 官方支持步骤：切换 DirectX 11 与 Vulkan、直接运行程序、彻底移除旧 MOD、重建配置文件夹。',
    lead: '适用于 Windows 上的 Steam、GOG 版：在启动器中点击“Play”后没有反应、在标志画面前后闪退，或打补丁后无法启动。',
    summary:
      'Larian 官方支持建议按以下顺序处理：关闭非必要程序、验证文件、在启动器中切换 DirectX 11 与 Vulkan、不经启动器直接运行程序、彻底移除旧 MOD。重建配置文件夹放在最后，并且用“改名”代替“删除”，以免丢失存档。',
    quickFacts: [
      {
        label: '程序文件',
        value: 'Vulkan：bg3.exe／DirectX 11：bg3_dx11.exe（bin 文件夹内）',
      },
      {
        label: 'MOD 文件夹',
        value: String.raw`%LocalAppData%\Larian Studios\Baldur's Gate 3\Mods`,
        copy: true,
      },
      {
        label: '存档与设置',
        value: String.raw`%LocalAppData%\Larian Studios\Baldur's Gate 3`,
        copy: true,
      },
      {
        label: '已知问题',
        value: 'ASUS Sonic Studio Virtual Mixer 会导致启动时崩溃（官方）',
      },
    ],
    diagnosis: [
      {
        symptom: '在启动器点击 Play 后闪退',
        cause: '后台程序或图形 API',
        stepId: 'switch-api',
      },
      {
        symptom: '启动器本身空白或无法操作',
        cause: '启动器问题',
        stepId: 'direct-exe',
      },
      {
        symptom: '打补丁后无法启动（曾使用 MOD）',
        cause: '残留的旧 MOD',
        stepId: 'remove-mods',
      },
      {
        symptom: '新开游戏也在启动时崩溃',
        cause: '设置或缓存损坏',
        stepId: 'reset-profile',
      },
    ],
    steps: [
      {
        id: 'switch-api',
        title: '关闭后台程序、验证文件，并切换 DirectX 11／Vulkan',
        summary: '这是 Larian 列表中最先进行、可随时还原的检查。',
        time: '10～15 分钟',
        actions: [
          '关闭杀毒软件、防火墙、显卡调节或监控工具的叠加层以及聊天软件。',
          '使用 ASUS Sonic Studio Virtual Mixer 时，请禁用或卸载它（Larian 列出的已知问题）。',
          verify("Baldur's Gate 3"),
          '在启动器中切换 DirectX 11 与 Vulkan 后再试。',
        ],
      },
      {
        id: 'direct-exe',
        title: '不经启动器，以管理员身份直接运行程序',
        summary: '退出 Steam 或 GOG GALAXY，从 bin 文件夹启动游戏。',
        time: '约 3 分钟',
        actions: [
          '退出 Steam（GOG 版退出 GOG GALAXY）。',
          String.raw`打开“…\SteamApps\common\Baldurs Gate 3\bin”（也可在 Steam 中右键点击游戏 →“管理”→“浏览本地文件”）。`,
          '右键点击 bg3.exe（Vulkan）或 bg3_dx11.exe（DirectX 11）→“以管理员身份运行”。',
          'Larian 还建议：右键点击后按住 Shift 选择“以管理员身份运行”，一直按住 Shift 直到出现启动画面。',
        ],
        note: '出现 Visual C++ 的 DLL 错误时，请从 Microsoft 官网安装最新的 64 位 Visual C++ 运行库。',
      },
      {
        id: 'remove-mods',
        title: '彻底移除旧 MOD',
        summary: '旧版本补丁时期的 MOD 文件残留，可能导致启动时崩溃。',
        time: '约 5 分钟',
        actions: [
          '退出游戏和启动器。',
          String.raw`在文件资源管理器地址栏输入“%LocalAppData%\Larian Studios\Baldur's Gate 3\Mods”，把里面的内容移到其他位置。`,
          String.raw`如果安装目录“…\Baldurs Gate 3\Data”中有“Mods”或“Public”文件夹，也一并移走（Larian 表示两者都可以删除）。`,
          '确认不加载 MOD 时能否启动。',
        ],
      },
      {
        id: 'reset-profile',
        title: '给配置文件夹改名，让游戏重新生成',
        summary:
          '让游戏重新创建存档、设置和缓存文件夹。只是改名，所以可以还原。',
        time: '约 5 分钟',
        actions: [
          String.raw`先删除“%LocalAppData%\Larian Studios\Baldur's Gate 3\LevelCache”中的内容后再试（官方）。`,
          String.raw`仍然不行时，打开“%LocalAppData%\Larian Studios”，给“Baldur's Gate 3”文件夹改名（例如在末尾加上 _old）。`,
          '如果能够启动，请确认能新建游戏并正常存档、读档。',
          '想恢复存档时，删除新生成的文件夹，再把改过名的文件夹改回原名。',
        ],
        note: '开启 Steam 云时，启动游戏可能会下载云端数据。Larian 也提到可以根据需要暂时关闭本游戏的 Steam 云。',
      },
    ],
    avoid: [
      '不要删除配置文件夹，请改名——里面有你的存档。',
      '多人游戏时，不要在各玩家 MOD 或其版本不一致的状态下测试。',
    ],
    cautions: [
      '仍然崩溃时，Larian 会请你提供 DxDiag 报告（Windows + R →“dxdiag”→“保存所有信息”），以及 bin 文件夹中的 gold.log 和崩溃转储文件。',
    ],
    faqs: [
      {
        question: '应该用 DirectX 11 还是 Vulkan？',
        answer:
          '其中一个无法启动时，Larian 建议改用另一个。请使用在你的电脑上能启动且运行稳定的那个。',
      },
      {
        question: '存档在哪里？',
        answer: String.raw`存档、设置文件和关卡缓存都在 %LocalAppData%\Larian Studios\Baldur's Gate 3 中（官方）。`,
      },
    ],
    sources: [
      {
        label: 'Larian 客服：Crashing upon startup (PC)（英文）',
        url: 'https://larian.com/support/faqs/crashing-upon-startup-pc_59',
      },
      {
        label: 'Larian 客服：The Larian Launcher is crashing（英文）',
        url: 'https://larian.com/support/faqs/the-larian-launcher-is-crashing_63',
      },
      {
        label: '《博德之门3》官方支持（英文）',
        url: 'https://baldursgate3.game/support',
      },
    ],
  },
  {
    ...base,
    gameSlug: 'helldivers-2',
    slug: 'gameguard-error-114',
    title: '《绝地潜兵2》GameGuard 错误 114 无法启动的解决方法（PC）',
    shortTitle: 'GameGuard 错误 114',
    description:
      '《绝地潜兵2》因 nProtect GameGuard 错误 114 无法启动？按 Arrowhead 官方步骤：管理员与兼容模式、重新安装 GameGuard、关闭工具类程序、在安全软件中添加例外。',
    lead: '启动时 nProtect GameGuard 显示错误 114、游戏无法开始时，Arrowhead 官方给出的处理步骤（Steam 版）。',
    summary:
      'Arrowhead 官方支持列出了五种方法：以管理员身份运行（Windows 11 还需 Windows 8 兼容模式）、卸载并重新安装 GameGuard、关闭工具类程序、在安全软件中添加例外、断开老旧的机械硬盘。',
    quickFacts: [
      {
        label: '打开游戏文件夹',
        value: 'Steam：右键点击游戏 →“管理”→“浏览本地文件”',
      },
      { label: '游戏程序', value: 'bin 文件夹中的“helldivers2”' },
      {
        label: '重新安装 GameGuard',
        value: '以管理员身份运行 tools 文件夹中的“gguninst”，再运行“GGSetup”',
      },
      { label: 'Windows 11', value: '还需开启“Windows 8”兼容模式（官方）' },
    ],
    diagnosis: [
      {
        symptom: '每次都出现错误 114',
        cause: '权限或兼容性',
        stepId: 'run-as-admin',
      },
      {
        symptom: '以管理员身份运行仍出现 114',
        cause: 'GameGuard 安装状态异常',
        stepId: 'reinstall-gameguard',
      },
      {
        symptom: '只在打开某些程序时出现',
        cause: '工具类程序或安全软件干扰',
        stepId: 'utilities',
      },
    ],
    steps: [
      {
        id: 'run-as-admin',
        title: '以管理员身份运行 helldivers2（Windows 11 同时开启兼容模式）',
        summary: '这是 Arrowhead 列出的第一个方法。',
        time: '约 3 分钟',
        actions: [
          '在 Steam 库中右键点击 HELLDIVERS 2 →“管理”→“浏览本地文件”。',
          '打开“bin”文件夹，右键点击“helldivers2”→“属性”→“兼容性”选项卡。',
          '勾选“以管理员身份运行此程序”。',
          'Windows 11 还要勾选“以兼容模式运行这个程序”，并选择“Windows 8”。',
          '点击“确定”，再从 Steam 启动游戏。',
        ],
        note: '如果之后出现其他问题，取消勾选即可还原。',
      },
      {
        id: 'reinstall-gameguard',
        title: '卸载并重新安装 GameGuard',
        summary: '使用游戏自带的 GameGuard 工具。',
        time: '约 5 分钟',
        actions: [
          '按第 1 步的方法打开游戏文件夹。',
          '在“tools”文件夹中右键点击“gguninst”→“以管理员身份运行”。',
          '卸载完成后，右键点击同一文件夹中的“GGSetup”→“以管理员身份运行”。',
          '重启电脑后再启动游戏。',
        ],
      },
      {
        id: 'utilities',
        title: '关闭工具类程序，并在安全软件中添加例外',
        summary: 'Arrowhead 说明，即使不是作弊程序，也可能触发错误 114。',
        time: '约 10 分钟',
        actions: [
          '逐个关闭叠加层、宏工具、RGB 灯效软件、监控工具等常驻程序，确认能否启动。',
          '在安全软件（包括 Microsoft Defender）中为 nProtect GameGuard 和 HELLDIVERS 2 添加例外。',
          '极少数情况下，连接的老旧机械硬盘也会导致问题。如果接有不用的旧硬盘，请断开后再试（官方）。',
        ],
        note: '如果找到了引起问题的程序，Arrowhead 希望玩家告知该程序的名称。',
      },
    ],
    avoid: [
      '不要在关闭安全软件的状态下游玩，添加例外后请重新开启。',
      '不要使用修改器或作弊工具，反作弊程序会对其作出反应。',
    ],
    cautions: ['以上步骤都无效时，请联系 Arrowhead 客服。'],
    faqs: [
      {
        question: '我只用 Windows Defender，也需要添加例外吗？',
        answer:
          '需要。Arrowhead 官方支持说明，即使只使用 Microsoft Defender，也要为 nProtect GameGuard 和 HELLDIVERS 2 添加例外。',
      },
      {
        question: '重新安装 GameGuard 会删除进度吗？',
        answer:
          '重新安装 GameGuard 只是重装游戏文件夹中的反作弊程序，官方步骤中不包含删除存档数据的操作。',
      },
    ],
    sources: [
      {
        label: 'Arrowhead 客服：启动 HELLDIVERS 2 时出现错误 114（英文）',
        url: 'https://arrowhead.zendesk.com/hc/en-us/articles/14732747845020-I-receive-Error-114-when-attempting-to-launch-HELLDIVERS-2',
      },
      {
        label: 'Steam 商店：HELLDIVERS 绝地潜兵2',
        url: 'https://store.steampowered.com/app/553850/',
      },
    ],
  },
  {
    ...base,
    gameSlug: 'hogwarts-legacy',
    slug: 'crash',
    title: '《霍格沃茨之遗》PC 版闪退、无法启动的解决方法｜官方故障排除',
    shortTitle: '闪退・无法启动',
    description:
      '《霍格沃茨之遗》PC 版闪退？先还原 Engine.ini 修改和 MOD，再按 WB Games 官方步骤检查：驱动、Windows 更新、超频、文件验证、画质设置和安全软件。',
    lead: 'Steam 版启动后关闭、游玩中回到桌面或读取时卡住时，WB Games（Portkey Games）官方支持给出的步骤。',
    summary:
      '官方支持的检查顺序是：更新显卡和声卡驱动、执行 Windows 更新（DirectX 也随之更新）、把超频的硬件恢复默认、验证游戏文件、降低画质设置、在安全软件中添加例外并关闭不需要的程序。如果修改过 Engine.ini 或安装了 MOD，请先还原。',
    quickFacts: [
      {
        label: '存档位置',
        value: String.raw`%LOCALAPPDATA%\Hogwarts Legacy\Saved\SaveGames`,
        copy: true,
      },
      {
        label: '配置文件位置',
        value: String.raw`%LOCALAPPDATA%\Hogwarts Legacy\Saved\Config\WindowsNoEditor`,
        copy: true,
      },
      { label: '更新 DirectX', value: '通过 Windows 更新完成（官方）' },
      {
        label: '仍然闪退时',
        value: '在官方漏洞反馈网站搜索同类报告，投票或补充信息',
      },
    ],
    diagnosis: [
      {
        symptom: '修改 Engine.ini 或安装 MOD 后开始闪退',
        cause: '配置修改或 MOD',
        stepId: 'undo-changes',
      },
      {
        symptom: '很久没有更新驱动或 Windows',
        cause: '驱动或 DirectX 过旧',
        stepId: 'drivers-windows',
      },
      {
        symptom: '能启动，但在特定场景闪退',
        cause: '文件损坏或画质设置',
        stepId: 'verify-settings',
      },
      {
        symptom: '安全软件弹出了提示',
        cause: '游戏文件被隔离',
        stepId: 'background-apps',
      },
    ],
    steps: [
      {
        id: 'undo-changes',
        title: '还原 Engine.ini 的修改，移除 MOD',
        summary: '官方故障排除以未修改的游戏为前提，请先还原。',
        time: '约 5 分钟',
        actions: [
          String.raw`打开“%LOCALAPPDATA%\Hogwarts Legacy\Saved\Config\WindowsNoEditor”。如果修改过 Engine.ini，请恢复原样，或把修改过的文件移到其他位置。`,
          '安装了 MOD 时，把 MOD 文件移出游戏文件夹。',
          '启动游戏，确认是否仍然闪退。',
        ],
      },
      {
        id: 'drivers-windows',
        title: '更新显卡、声卡驱动和 Windows',
        summary: 'DirectX 通过 Windows 更新来更新；驱动请从厂商官网获取。',
        time: '10～20 分钟',
        actions: [
          '从 NVIDIA、AMD、Intel 或电脑厂商官网安装最新的显卡驱动。',
          '在电脑或主板厂商官网确认是否有更新的声卡驱动。',
          '打开“设置”→“Windows 更新”→“检查更新”。',
          'CPU 或显卡超频（包括“睿频加速”类工具）时，请恢复厂商默认设置（官方）。',
        ],
      },
      {
        id: 'verify-settings',
        title: '验证游戏文件，降低画质设置',
        summary: '先排除文件损坏，再排除画质设置带来的负载。',
        time: '10～20 分钟',
        actions: [
          verify('Hogwarts Legacy'),
          '在游戏中选择较低的画质预设，确认在同一场景是否仍然闪退。',
          '仍然闪退时，卸载后重新安装游戏。存档保存在其他位置，但为保险起见请先复制。',
        ],
      },
      {
        id: 'background-apps',
        title: '在安全软件中添加例外，关闭不需要的程序',
        summary:
          '检查文件是否被隔离、是否与其他程序冲突。干净启动只是临时测试。',
        time: '约 10 分钟',
        actions: [
          '查看安全软件的隔离记录，把游戏文件夹添加为例外。',
          '启动游戏前尽量关闭不用的程序。',
          '仍然闪退时，按 Microsoft 的官方步骤进行“干净启动”来比较；测试结束后务必恢复正常启动。',
        ],
        note: 'WB Games 提醒：干净启动操作有误可能影响电脑的正常启动，请严格按照 Microsoft 的步骤进行。',
      },
    ],
    avoid: [
      '不要删除存档文件夹，重新安装前请先复制。',
      '不要一直在干净启动状态下使用 Windows。',
    ],
    cautions: [
      '都无效时，WB Games 建议在《霍格沃茨之遗》漏洞反馈网站寻找相同的报告，并投票或补充截图。',
    ],
    faqs: [
      {
        question: '电脑满足最低配置，但还是会闪退。',
        answer:
          '官方支持说明，即使满足配置需求，较高的画质设置也可能影响性能和稳定性。请尝试降低画质设置。',
      },
      {
        question: '怎样更新 DirectX？',
        answer:
          'DirectX 通过 Windows 更新来更新：“设置”→“Windows 更新”→“检查更新”。',
      },
    ],
    sources: [
      {
        label: 'Portkey Games 客服：PC Troubleshooting (Steam)（英文）',
        url: 'https://portkeygamessupport.wbgames.com/hc/en-us/articles/10765467342099-PC-Troubleshooting-Steam',
      },
      {
        label: 'Portkey Games 客服：Hogwarts Legacy（英文）',
        url: 'https://portkeygamessupport.wbgames.com/hc/en-us/categories/360004524734-Hogwarts-Legacy',
      },
    ],
  },
  {
    ...base,
    gameSlug: 'gta-v-enhanced',
    slug: 'story-save-migration',
    title: 'GTA V 故事模式存档从传承版迁移到增强版的方法（PC）',
    shortTitle: '迁移故事模式存档',
    description:
      '把 GTA V 故事模式进度从传承版（Legacy）迁移到增强版（Enhanced）：在传承版上传一个存档，在增强版下载。每个账户一次、90 天内有效、仅限 PC——Rockstar 官方步骤。',
    lead: '适合在 GTA V 传承版中玩过故事模式、想在 GTA V 增强版中继续的玩家，按 Rockstar 官方流程说明。',
    summary:
      '在 GTA V 传承版中打开暂停菜单，选择“Game”（游戏）→“Upload Save Game”（上传存档）。然后在 GTA V 增强版中，通过开始页面的“Story”（故事）标签，或暂停菜单的“Game”→“Download Save Game”（下载存档）下载。每个账户只能迁移一次，下载后即确定。',
    quickFacts: [
      { label: '迁移次数', value: '每个账户一次（下载后即确定）' },
      { label: '上传后的有效期', value: '90 天（过期需重新上传）' },
      { label: '适用平台', value: '仅限 PC 之间；不支持 PC 与主机之间迁移' },
      {
        label: '增强版存档位置',
        value: String.raw`%USERPROFILE%\Documents\Rockstar Games\GTAV Enhanced\Profiles`,
        copy: true,
      },
    ],
    diagnosis: [
      {
        symptom: '无法使用“上传存档”或上传失败',
        cause: '账户关联',
        stepId: 'link-account',
      },
      {
        symptom: '不确定该上传哪个存档',
        cause: '只能上传一个存档',
        stepId: 'upload-save',
      },
      {
        symptom: '增强版的开始页面没有迁移提示',
        cause: '增强版中已经有故事模式存档',
        stepId: 'download-save',
      },
    ],
    steps: [
      {
        id: 'link-account',
        title: '确认 Rockstar Games 账户已关联',
        summary: '迁移通过你登录的 Rockstar Games 账户进行。',
        time: '约 3 分钟',
        actions: [
          '确认传承版和增强版登录的是同一个 Rockstar Games 账户。',
          '确认该账户已关联你游玩所用的 PC 平台账户（例如 Steam）。',
        ],
        note: '账户被停用或封禁、进度不正当或不足等情况下，部分个人资料可能无法迁移（官方）。',
      },
      {
        id: 'upload-save',
        title: '从 GTA V 传承版上传存档',
        summary: '只能上传一个存档，请选择想保留的那个。',
        time: '约 5 分钟',
        actions: [
          '在电脑上启动 GTA V 传承版，在故事模式中打开暂停菜单。',
          '选择“Game”（游戏）→“Upload Save Game”（上传存档）。',
          '选择要迁移的存档，在确认画面中确认。',
          '等待显示上传完成的消息。',
        ],
        note: '在增强版下载之前，可以随时用其他存档重新上传覆盖。上传后在传承版中的进度不会同步。',
      },
      {
        id: 'download-save',
        title: '在 GTA V 增强版中下载存档',
        summary: '通过开始页面的“Story”标签或暂停菜单下载。下载即完成迁移。',
        time: '约 5 分钟',
        actions: [
          '增强版中还没有故事模式存档时：在开始页面选择“Story”（故事）标签，在确认画面中下载。',
          '增强版中已有故事模式存档时：在故事模式中打开暂停菜单 →“Game”→“Download Save Game”（下载存档）→选择存档并确认。',
          '下载完成后，游戏会自动读取该存档。',
        ],
        note: '下载后，该账户就不能再迁移故事模式了。请先确认上传的存档正确无误。',
      },
    ],
    avoid: [
      '确认上传的存档正确之前，不要在增强版中下载——只有一次机会。',
      '上传后不要放置超过 90 天。',
    ],
    cautions: [
      '根据存档大小和服务器负载，迁移可能需要一些时间（官方）。',
      '菜单名称为英文界面的写法，中文界面的名称可能略有不同。',
    ],
    faqs: [
      {
        question: '可以把 PS5 或 Xbox 的故事模式存档迁移到 PC 吗？',
        answer:
          '不可以。Rockstar 官方支持说明，从传承版到增强版的迁移只能在 PC 之间进行，不支持 PC 与主机之间的迁移。',
      },
      {
        question: '迁移后在传承版玩的进度会同步过来吗？',
        answer:
          '不会。迁移后在传承版中的故事模式进度不会同步到增强版（官方）。',
      },
      {
        question: '能更换已上传的存档吗？',
        answer:
          '在增强版下载之前可以——从传承版上传另一个存档即可覆盖。下载之后就不能更换了。',
      },
    ],
    sources: [
      {
        label:
          'Rockstar 客服：将故事模式存档从 GTAV 传承版迁移到增强版（英文）',
        url: 'https://support.rockstargames.com/articles/mmRgMVfuQC3xNzXK4Cq9b/migrating-your-story-mode-save-from-grand-theft-auto-v-legacy-to-grand-theft',
      },
      {
        label: 'Rockstar 客服：Grand Theft Auto V（英文）',
        url: 'https://support.rockstargames.com/gta-v',
      },
    ],
  },
  {
    ...base,
    gameSlug: 'skyrim-special-edition',
    slug: 'skse-after-update',
    title: '上古卷轴5（Skyrim）更新后 SKSE 无法使用的解决方法（PC）',
    shortTitle: '更新后 SKSE 失效',
    description:
      '《上古卷轴5 特别版》更新后无法通过 SKSE 启动？确认游戏版本、安装对应的 SKSE 版本，并在 MOD 更新前移走 SKSE 插件——依据 SKSE 官方网站说明。',
    lead: '适用于 Steam 版和 GOG 版：游戏更新后无法通过 SKSE 启动，或启动后立即崩溃。',
    summary:
      '每个 SKSE 版本只对应特定的游戏版本。游戏更新后，请从 SKSE 官方网站安装对应的版本。如果打补丁后仍然在启动时崩溃，SKSE 团队建议移走 Data/SKSE/Plugins 中的文件再试，因为使用插件的 MOD 通常也需要更新。',
    quickFacts: [
      {
        label: '支持的版本',
        value: 'Steam 版和 GOG 版（不支持 Game Pass 和 Epic 版）',
      },
      {
        label: '打补丁后启动崩溃',
        value: '移走 Data/SKSE/Plugins 中的文件后再试（SKSE 团队）',
      },
      {
        label: '求助时附带的日志',
        value:
          'skse.log、skse_loader.log、skse_steam_loader.log（位于 My Games）',
      },
      {
        label: '存档位置',
        value: String.raw`%USERPROFILE%\Documents\My Games\Skyrim Special Edition\Saves`,
        copy: true,
      },
    ],
    diagnosis: [
      {
        symptom: 'SKSE 加载器提示游戏版本不受支持',
        cause: 'SKSE 与新游戏版本不匹配',
        stepId: 'check-version',
      },
      {
        symptom: 'SKSE 已是新版，但游戏立即崩溃',
        cause: '插件类 MOD 尚未支持新版本',
        stepId: 'plugins-off',
      },
      {
        symptom: '不使用 SKSE 也无法启动',
        cause: '游戏本体的问题',
        stepId: 'vanilla-check',
      },
    ],
    steps: [
      {
        id: 'vanilla-check',
        title: '确认不使用 SKSE 时游戏能否启动',
        summary: 'SKSE 团队要求在求助前先确认不使用 SKSE 时游戏能正常启动。',
        time: '约 5 分钟',
        actions: [
          '先把存档文件夹复制到其他位置。',
          '不使用 SKSE 加载器，直接从 Steam 正常启动“The Elder Scrolls V: Skyrim Special Edition”。',
          '如果无法启动：' +
            verify('The Elder Scrolls V: Skyrim Special Edition'),
        ],
        note: '验证文件也会还原被 MOD 替换的游戏文件。使用 MOD 管理器时，也请参照管理器的说明。',
      },
      {
        id: 'check-version',
        title: '安装与游戏版本对应的 SKSE',
        summary:
          'SKSE 只支持 Steam 上的最新游戏版本，每个版本都对应特定的游戏版本。',
        time: '约 10 分钟',
        actions: [
          '在游戏文件夹中（Steam：右键 →“管理”→“浏览本地文件”）右键点击“SkyrimSE.exe”→“属性”→“详细信息”，记下“文件版本”。',
          '在 SKSE 官方网站（skse.silverlock.org）找到对应版本：Steam 版用 Anniversary Edition 版本，GOG 版用 GOG 版本。',
          '按照网站说明重新安装 SKSE。',
          '如果还没有对应你游戏版本的 SKSE，请等待 SKSE 更新。',
        ],
        note: 'SKSE 团队提醒不要使用 Windows 应用商店里的工具解压，请按网站说明使用 Steam 安装、安装程序或 7-Zip。',
      },
      {
        id: 'plugins-off',
        title: '移走 SKSE 插件，再加回已更新的 MOD',
        summary: '游戏更新后，使用 SKSE 插件的 MOD 几乎都需要一起更新。',
        time: '约 10 分钟',
        actions: [
          String.raw`把游戏文件夹中“Data\SKSE\Plugins”的内容移到其他位置（使用 MOD 管理器时，禁用包含插件的 MOD）。`,
          '确认能否通过 SKSE 加载器启动。',
          '能够启动后，在各个 MOD 的发布页面确认是否已有支持新版本的版本，再逐个加回。',
        ],
      },
    ],
    avoid: [
      '覆盖旧存档之前请先备份——不带 MOD 保存的存档可能无法还原。',
      '不要从非官方网站下载 SKSE。',
    ],
    cautions: [
      '联系 SKSE 团队时，请附上 My Games 中 SKSE 文件夹里的 skse.log、skse_loader.log 和 skse_steam_loader.log（官方建议）。',
      '本文的版本号为核对时的信息，最新情况请以 SKSE 官方网站为准。',
      'Steam 版《上古卷轴5 特别版》官方未提供简体中文。',
    ],
    faqs: [
      {
        question: 'Game Pass 版或 Epic 版能用 SKSE 吗？',
        answer:
          '不能。SKSE 官方网站说明不支持 Windows 应用商店/Game Pass 版和 Epic Games Store 版。',
      },
      {
        question: '能继续使用旧版本的游戏吗？',
        answer:
          'SKSE 网站仍为降级到 1.5.97 的玩家保留了对应版本，但建议使用面向当前 Steam 版的 Anniversary Edition 版本。',
      },
    ],
    sources: [
      {
        label: 'Skyrim Script Extender（SKSE）官方网站（英文）',
        url: 'https://skse.silverlock.org/',
      },
      {
        label: 'Steam 商店：The Elder Scrolls V: Skyrim Special Edition',
        url: 'https://store.steampowered.com/app/489830/',
      },
    ],
  },
  {
    ...base,
    gameSlug: 'stardew-valley',
    slug: 'save-restore',
    title: '星露谷物语存档位置｜存档消失、无法读取时的恢复方法（PC）',
    shortTitle: '存档位置与恢复',
    description:
      '《星露谷物语》PC 版存档在哪里？存档消失或无法读取时：去掉 _STARDEWVALLEYSAVETMP、用 _old 文件撤销上次存档、从 SMAPI 备份或被 Steam 云覆盖前的存档恢复。',
    lead: '适合想找存档文件夹、存档从列表中消失或无法读取、想回到前一天的玩家。',
    summary: String.raw`存档位于“%appdata%\StardewValley\Saves”，每个农场是一个“农场名_数字”文件夹。存档消失或无法读取时，请按顺序尝试：去掉文件名中的“_STARDEWVALLEYSAVETMP”、用 _old 文件撤销上一次存档、从 SMAPI 备份恢复。动手前务必先复制整个文件夹。`,
    quickFacts: [
      {
        label: '存档位置',
        value: String.raw`%appdata%\StardewValley\Saves`,
        copy: true,
      },
      {
        label: '需要的文件',
        value: '“农场名_数字”文件和 SaveGameInfo（整个文件夹一起处理）',
      },
      {
        label: '存档时机',
        value: '只在游戏内一天结束时（睡觉、晕倒或凌晨 2 点）',
      },
      {
        label: 'SMAPI 备份',
        value: '游戏文件夹中的“save-backups”（最多 10 天）',
      },
    ],
    diagnosis: [
      {
        symptom: '文件名末尾带有“_STARDEWVALLEYSAVETMP”',
        cause: '存档过程被中断',
        stepId: 'tmp-name',
      },
      {
        symptom: '读档时崩溃，或想回到前一天',
        cause: '上一次存档出了问题',
        stepId: 'undo-save',
      },
      {
        symptom: '存档文件夹不见了（使用 SMAPI）',
        cause: '文件被删除或损坏',
        stepId: 'smapi-backup',
      },
      {
        symptom: '已经玩过的天数不见了',
        cause: 'Steam 云用旧存档覆盖了本地存档',
        stepId: 'cloud-overwrite',
      },
    ],
    steps: [
      {
        id: 'open-backup',
        title: '打开存档文件夹并备份',
        summary: '尝试任何恢复操作前，先复制当前状态。',
        time: '约 2 分钟',
        actions: [
          '关闭游戏。',
          String.raw`按 Windows + R，输入“%appdata%\StardewValley\Saves”，点击“确定”。`,
          '右键点击“农场名_数字”文件夹，压缩为 ZIP 文件，保存到桌面等其他位置。',
        ],
        note: '不要把备份文件夹放在 Saves 文件夹里——游戏会尝试读取它们（官方 Wiki）。',
      },
      {
        id: 'tmp-name',
        title: '去掉文件名中的“_STARDEWVALLEYSAVETMP”',
        summary: '这是官方 Wiki 列出的第一个恢复方法。',
        time: '约 3 分钟',
        actions: [
          '打开存档文件夹，查找名称中带有“_STARDEWVALLEYSAVETMP”的文件。',
          '把这部分从文件名中删除，然后启动游戏。',
          '如果每次启动名称都会变回去，请在 Steam 中打开《星露谷物语》的“属性”（齿轮图标）→“通用”，关闭 Steam 云同步，再重新修改名称。',
          '同时确认文件夹名称与“农场名_数字”文件的名称完全一致。',
        ],
      },
      {
        id: 'undo-save',
        title: '用 _old 文件撤销上一次存档',
        summary: '如果文件夹中有两个以“_old”结尾的文件，就可以回到前一天。',
        time: '约 3 分钟',
        actions: [
          '确认文件夹中有“SaveGameInfo_old”和“农场名_数字_old”（没有的话无法使用此方法）。',
          '确认已经完成第 1 步的备份。',
          '删除“SaveGameInfo”和“农场名_数字”（不带 _old 的文件）。',
          '把“SaveGameInfo_old”和“农场名_数字_old”名称中的“_old”删除。',
        ],
      },
      {
        id: 'smapi-backup',
        title: '从 SMAPI 备份恢复',
        summary:
          '安装了 SMAPI 时，其自带的 SaveBackup 会保留最多 10 天的备份。',
        time: '约 5 分钟',
        actions: [
          '打开游戏文件夹（Steam：右键 →“管理”→“浏览本地文件”）。',
          '打开“save-backups”，解压包含你的存档的最新 ZIP 文件。',
          '把其中的存档文件夹复制到 Saves 文件夹。',
        ],
      },
      {
        id: 'cloud-overwrite',
        title: '存档被 Steam 云覆盖时',
        summary: '手头有备份，但游戏总是变回云端的旧存档时使用。',
        time: '约 3 分钟',
        actions: [
          '启动游戏，但先不要读取存档。',
          '保持游戏运行，删除 Saves 中的存档文件夹，把备份放回去。',
          '在游戏中读取该存档。由于存档在游戏运行时发生了变化，云端会把它当作新版本（官方 Wiki）。',
        ],
      },
    ],
    avoid: [
      '备份之前不要删除或重命名文件。',
      '不要把备份文件夹放在 Saves 文件夹中。',
      '避免使用自动存档编辑工具——官方 Wiki 提醒它们经常损坏存档。',
    ],
    cautions: [
      '多人游戏的存档只保存在房主的电脑上（官方 Wiki）。',
      '旧版本的游戏无法读取新版本保存的存档。',
    ],
    faqs: [
      {
        question: '一天没过完就退出，进度没了。',
        answer:
          '《星露谷物语》只在游戏内一天结束时存档（睡觉、因疲劳晕倒或凌晨 2 点晕倒）。一天结束前退出，当天的进度不会保存（官方 Wiki）。',
      },
      {
        question: '我在 Steam 和 GOG 上都有这款游戏，存档是分开的吗？',
        answer:
          '在 PC 上，存档与游戏分开保存，Steam 和 GOG 等不同商店的游戏会共用同一份存档（官方 Wiki）。',
      },
      {
        question: '移除 MOD 后存档读不出来。',
        answer:
          '官方 Wiki 说明，根据所用的 MOD，部分存档无法在原版游戏中读取。请重新安装 SMAPI 并玩一天，SMAPI 会从存档中移除自定义内容（背包里残留的自定义物品可能会变成错误物品）。',
      },
    ],
    sources: [
      {
        label: '星露谷物语官方 Wiki：Saves（英文）',
        url: 'https://stardewvalleywiki.com/Saves',
      },
      {
        label: 'Steam 商店：Stardew Valley',
        url: 'https://store.steampowered.com/app/413150/',
      },
    ],
  },
];
