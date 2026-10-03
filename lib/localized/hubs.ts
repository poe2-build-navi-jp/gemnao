import type { Locale } from '@/lib/i18n';

// Hand-written text for the translated game pages. Each checklist mirrors a
// verified Japanese article (same official sources); keep them in sync when
// the Japanese article changes. Games with a translated article link to it
// instead of repeating its steps here.

export type L10n = Record<Locale, string>;

export type LocalizedHub = {
  lead: L10n;
  intro: L10n;
  /** Short launch checklist for games without a translated article. */
  checklist?: Record<Locale, string[]>;
  sources: { label: L10n; url: string }[];
};

const steamFiles = {
  label: {
    en: 'Steam Support: Verify integrity of game files',
    zh: 'Steam 客服：验证游戏文件的完整性',
    es: 'Soporte de Steam: verificar la integridad de los archivos del juego',
  },
  url: 'https://help.steampowered.com/en/faqs/view/0C48-FCBD-DA71-93EB',
};

const store = (appId: string): LocalizedHub['sources'][number] => ({
  label: {
    en: 'Steam store page (requirements and languages)',
    zh: 'Steam 商店页面（配置需求与语言）',
    es: 'Página de Steam (requisitos e idiomas)',
  },
  url: `https://store.steampowered.com/app/${appId}/`,
});

export const localizedHubs: Record<string, LocalizedHub> = {
  'monster-hunter-wilds': {
    lead: {
      en: 'Save location, config.ini, official requirements and a launch-crash checklist for the PC version.',
      zh: 'PC 版的存档位置、config.ini、官方配置需求，以及启动崩溃时的检查顺序。',
      es: 'Ubicación de la partida, config.ini, requisitos oficiales y una lista para cierres al iniciar en PC.',
    },
    intro: {
      en: 'Monster Hunter Wilds stores saves in your Steam userdata folder, and its display settings live in config.ini inside the game folder. Before changing anything, note when the crash happens: at launch, during shader preparation, or after a long hunt. Each needs a different check.',
      zh: '《怪物猎人 荒野》的存档保存在 Steam 的 userdata 文件夹中，画面设置保存在游戏安装文件夹里的 config.ini。动手修改前，先记下崩溃发生在什么时候：启动时、着色器准备时，还是长时间狩猎之后。不同情况需要检查的地方不同。',
      es: 'Monster Hunter Wilds guarda la partida en la carpeta userdata de Steam y los ajustes de pantalla en config.ini, dentro de la carpeta del juego. Antes de cambiar nada, anota cuándo se cierra: al iniciar, durante la preparación de sombreadores o tras una cacería larga. Cada caso requiere una comprobación distinta.',
    },
    checklist: {
      en: [
        'After an update, remove mods and turn off overlays, then compare',
        'Verify the game files in Steam and note whether files were re-downloaded',
        'Record your GPU driver version, then compare an update or a rollback',
        'Check dedicated VRAM, especially with the high-resolution texture pack',
        'Move only config.ini out of the game folder so the display settings are recreated',
        'On PCs with two GPUs, make sure the game runs on the dedicated GPU',
      ],
      zh: [
        '更新后先移除 MOD、关闭叠加层，再进行比较',
        '在 Steam 中验证游戏文件，并记下是否重新下载了文件',
        '记下显卡驱动版本，再比较更新或回退后的结果',
        '确认专用显存，使用高清材质包时尤其要注意',
        '只把 config.ini 移出游戏文件夹，让游戏重新生成画面设置',
        '有两块显卡的电脑，确认游戏使用的是独立显卡',
      ],
      es: [
        'Tras una actualización, retira los mods y desactiva las superposiciones antes de comparar',
        'Verifica los archivos en Steam y anota si se volvieron a descargar archivos',
        'Anota la versión del controlador gráfico y compara al actualizar o volver atrás',
        'Comprueba la VRAM dedicada, sobre todo con el paquete de texturas en alta resolución',
        'Saca solo config.ini de la carpeta del juego para que se vuelva a crear la configuración de pantalla',
        'En equipos con dos GPU, asegúrate de que el juego usa la tarjeta dedicada',
      ],
    },
    sources: [
      {
        label: {
          en: 'Capcom: Monster Hunter Wilds support',
          zh: 'Capcom：《怪物猎人 荒野》支持页面',
          es: 'Capcom: soporte de Monster Hunter Wilds',
        },
        url: 'https://www.monsterhunter.com/support/wilds/',
      },
      steamFiles,
      store('2246340'),
    ],
  },
  palworld: {
    lead: {
      en: 'World save locations, a mod-free launch test after updates, and the official dedicated-server settings file.',
      zh: '世界存档位置、更新后不加载 MOD 的启动测试，以及官方专用服务器设置文件。',
      es: 'Ubicación de los mundos, prueba de inicio sin mods tras una actualización y el archivo oficial de ajustes del servidor dedicado.',
    },
    intro: {
      en: 'Palworld keeps each world in its own folder under SaveGames. When the game stops launching after an update, the usual suspects are mods: in-game mod management, Steam Workshop subscriptions and manually installed files such as UE4SS. Copy your saves first, then test the game without any of them.',
      zh: '《幻兽帕鲁》的每个世界都保存在 SaveGames 下的独立文件夹中。更新后无法启动时，最常见的原因是 MOD：包括游戏内的 MOD 管理、Steam 创意工坊订阅，以及手动安装的 UE4SS 等文件。请先复制存档，再在不加载任何 MOD 的状态下测试。',
      es: 'Palworld guarda cada mundo en su propia carpeta dentro de SaveGames. Si el juego deja de iniciar tras una actualización, revisa primero los mods: la gestión de mods del juego, las suscripciones de Steam Workshop y los archivos instalados a mano, como UE4SS. Copia antes tus partidas y prueba el juego sin ninguno de ellos.',
    },
    checklist: {
      en: [
        'Copy the SaveGames folder somewhere safe before testing',
        'Check the in-game mod management and your Steam Workshop subscriptions',
        'Move manually installed mods, UE4SS and deployed Workshop files out of the game folder',
        'Verify the game files in Steam and launch without mods',
        'If the title screen opens, compare with a temporary new world',
        'Once it works, add back only the mods you need, one at a time',
      ],
      zh: [
        '测试前先把 SaveGames 文件夹复制到安全位置',
        '检查游戏内的 MOD 管理和 Steam 创意工坊订阅',
        '把手动安装的 MOD、UE4SS 以及已部署的创意工坊文件移出游戏文件夹',
        '在 Steam 中验证游戏文件，并在不加载 MOD 的状态下启动',
        '如果能进入标题画面，用临时新建的世界进行比较',
        '恢复正常后，只把需要的 MOD 逐个加回去',
      ],
      es: [
        'Copia la carpeta SaveGames en un lugar seguro antes de probar',
        'Revisa la gestión de mods del juego y tus suscripciones de Steam Workshop',
        'Saca de la carpeta del juego los mods instalados a mano, UE4SS y los archivos de Workshop ya instalados',
        'Verifica los archivos en Steam e inicia el juego sin mods',
        'Si aparece la pantalla de título, compara con un mundo nuevo temporal',
        'Cuando funcione, vuelve a añadir solo los mods necesarios, de uno en uno',
      ],
    },
    sources: [
      {
        label: {
          en: 'Palworld official docs: server configuration',
          zh: '《幻兽帕鲁》官方文档：服务器设置',
          es: 'Documentación oficial de Palworld: configuración del servidor',
        },
        url: 'https://docs.palworldgame.com/settings-and-operation/configuration/',
      },
      {
        label: {
          en: 'Palworld official announcement on Steam (mods and updates)',
          zh: '《幻兽帕鲁》Steam 官方公告（MOD 与更新）',
          es: 'Anuncio oficial de Palworld en Steam (mods y actualizaciones)',
        },
        url: 'https://steamcommunity.com/games/1623730/announcements/detail/686383649529010210',
      },
      steamFiles,
      store('1623730'),
    ],
  },
  'elden-ring': {
    lead: {
      en: 'Save file location, GraphicsConfig.xml, official requirements and what to check when the game will not start.',
      zh: '存档位置、GraphicsConfig.xml、官方配置需求，以及游戏无法启动时的检查项目。',
      es: 'Ubicación del guardado, GraphicsConfig.xml, requisitos oficiales y qué revisar si el juego no arranca.',
    },
    intro: {
      en: 'ELDEN RING keeps your save as ER0000.sl2 inside a folder named after your Steam ID, and its graphics settings in GraphicsConfig.xml. The game runs at up to 60 FPS. Mods and external DLL files are a common cause of launch failures, and modded play should stay offline.',
      zh: '《艾尔登法环》的存档是以 Steam ID 命名的文件夹中的 ER0000.sl2，画面设置保存在 GraphicsConfig.xml。游戏的帧率上限为 60 FPS。MOD 和外部 DLL 文件是常见的启动失败原因，使用 MOD 时请保持离线游玩。',
      es: 'ELDEN RING guarda la partida como ER0000.sl2 en una carpeta con tu ID de Steam, y los ajustes gráficos en GraphicsConfig.xml. El juego funciona como máximo a 60 FPS. Los mods y los archivos DLL externos causan muchos fallos de inicio, y el juego con mods debe hacerse sin conexión.',
    },
    checklist: {
      en: [
        'Verify the game files in Steam',
        'Update Windows and your GPU driver',
        'Turn off the Steam overlay and other tools that run in the background',
        'Move only files you can identify as installed mods or their added DLLs out of the game folder; keep a copy and record their original locations',
        'Back up GraphicsConfig.xml and let the game recreate it',
      ],
      zh: [
        '在 Steam 中验证游戏文件',
        '更新 Windows 和显卡驱动',
        '关闭 Steam 叠加层及其他后台运行的工具',
        '把 MOD 和外部 DLL 文件移出游戏文件夹',
        '备份 GraphicsConfig.xml，让游戏重新生成',
      ],
      es: [
        'Verifica los archivos del juego en Steam',
        'Actualiza Windows y el controlador gráfico',
        'Desactiva la superposición de Steam y otras herramientas en segundo plano',
        'Saca los mods y los archivos DLL externos de la carpeta del juego',
        'Haz copia de GraphicsConfig.xml y deja que el juego lo vuelva a crear',
      ],
    },
    sources: [
      {
        label: {
          en: 'FromSoftware: game FAQ (Japanese)',
          zh: 'FromSoftware：游戏常见问题（日语）',
          es: 'FromSoftware: preguntas frecuentes (en japonés)',
        },
        url: 'https://www.fromsoftware.jp/jp/faq-games.html',
      },
      {
        label: {
          en: 'PCGamingWiki: ELDEN RING (community reference)',
          zh: 'PCGamingWiki：ELDEN RING（社区资料）',
          es: 'PCGamingWiki: ELDEN RING (referencia de la comunidad)',
        },
        url: 'https://www.pcgamingwiki.com/wiki/Elden_Ring',
      },
      steamFiles,
      store('1245620'),
    ],
  },
  'cyberpunk-2077': {
    lead: {
      en: 'Save location, official requirements and CD PROJEKT RED’s own steps for launch failures and crashes.',
      zh: '存档位置、官方配置需求，以及 CD PROJEKT RED 官方提供的无法启动与崩溃对策。',
      es: 'Ubicación de la partida, requisitos oficiales y los pasos de CD PROJEKT RED para fallos de inicio y cierres.',
    },
    intro: {
      en: 'Cyberpunk 2077 stores saves under Saved Games\\CD Projekt Red, outside the game installation folder. Back up your saves before reinstalling. If the game will not start or keeps crashing, test it without mods first, then follow the official order: GPU driver clean install, Visual C++ redistributables, file verification and overlays.',
      zh: '《赛博朋克 2077》的存档保存在“保存的游戏\\CD Projekt Red”中，与游戏文件夹分开，因此重新安装不会删除存档。无法启动或频繁崩溃时，先在不加载 MOD 的状态下测试，再按官方顺序检查：显卡驱动全新安装、Visual C++ 运行库、文件验证和叠加层。',
      es: 'Cyberpunk 2077 guarda las partidas en Saved Games\\CD Projekt Red, fuera de la carpeta del juego, así que reinstalar no las borra. Si no inicia o se cierra, pruébalo primero sin mods y después sigue el orden oficial: instalación limpia del controlador, paquetes de Visual C++, verificación de archivos y superposiciones.',
    },
    sources: [
      {
        label: {
          en: 'CD PROJEKT RED Support: Game is not launching',
          zh: 'CD PROJEKT RED 客服：游戏无法启动',
          es: 'Soporte de CD PROJEKT RED: el juego no se inicia',
        },
        url: 'https://support.cdprojektred.com/en/cyberpunk/pc/sp-technical/issue/1568/game-is-not-launching',
      },
      store('1091500'),
    ],
  },
  'baldurs-gate-3': {
    lead: {
      en: 'Save location, official requirements and Larian’s steps for crashes on startup.',
      zh: '存档位置、官方配置需求，以及 Larian 官方的启动崩溃对策。',
      es: 'Ubicación de la partida, requisitos oficiales y los pasos de Larian para cierres al iniciar.',
    },
    intro: {
      en: "Baldur’s Gate 3 keeps saves, settings and a level cache under %LocalAppData%\\Larian Studios\\Baldur's Gate 3. The game has two executables: bg3.exe for Vulkan and bg3_dx11.exe for DirectX 11. Larian’s support suggests switching between them, launching the executable directly, and removing old mods when the game crashes on startup.",
      zh: '《博德之门3》的存档、设置和关卡缓存都在 %LocalAppData%\\Larian Studios\\Baldur’s Gate 3 中。游戏有两个程序：Vulkan 用的 bg3.exe 和 DirectX 11 用的 bg3_dx11.exe。启动时崩溃的话，Larian 官方建议在两者之间切换、直接运行程序，并清除旧的 MOD。',
      es: 'Baldur’s Gate 3 guarda partidas, ajustes y caché de niveles en %LocalAppData%\\Larian Studios\\Baldur’s Gate 3. Tiene dos ejecutables: bg3.exe para Vulkan y bg3_dx11.exe para DirectX 11. Si se cierra al iniciar, el soporte de Larian recomienda alternar entre ellos, abrir el ejecutable directamente y quitar mods antiguos.',
    },
    sources: [
      {
        label: {
          en: 'Larian Support: Crashing upon startup (PC)',
          zh: 'Larian 客服：启动时崩溃（PC）',
          es: 'Soporte de Larian: cierres al iniciar (PC)',
        },
        url: 'https://larian.com/support/faqs/crashing-upon-startup-pc_59',
      },
      store('1086940'),
    ],
  },
  'helldivers-2': {
    lead: {
      en: 'Save location, official requirements and Arrowhead’s fix for GameGuard error 114.',
      zh: '存档位置、官方配置需求，以及 Arrowhead 官方针对 GameGuard 错误 114 的解决方法。',
      es: 'Ubicación de la partida, requisitos oficiales y la solución de Arrowhead para el error 114 de GameGuard.',
    },
    intro: {
      en: 'HELLDIVERS 2 uses the nProtect GameGuard anti-cheat system. For error 114, Arrowhead lists checks involving launch permissions and compatibility, reinstalling GameGuard, utility conflicts and security software. Keep protection enabled and review any detection with the security provider or Arrowhead before changing exclusions.',
      zh: '《绝地潜兵2》使用 nProtect GameGuard 反作弊程序。出现错误 114 时，Arrowhead 官方给出了固定的处理顺序：以管理员身份运行游戏（Windows 11 还需开启 Windows 8 兼容模式），从游戏的 tools 文件夹重新安装 GameGuard，关闭工具类程序，并在安全软件中添加例外。',
      es: 'HELLDIVERS 2 usa el antitrampas nProtect GameGuard. Ante el error 114, el soporte de Arrowhead indica un orden concreto: ejecutar el juego como administrador (con compatibilidad con Windows 8 en Windows 11), reinstalar GameGuard desde la carpeta tools, cerrar programas de utilidades y añadir excepciones en el antivirus.',
    },
    sources: [
      {
        label: {
          en: 'Arrowhead Support: Error 114 when launching HELLDIVERS 2',
          zh: 'Arrowhead 客服：启动《绝地潜兵2》时出现错误 114',
          es: 'Soporte de Arrowhead: error 114 al iniciar HELLDIVERS 2',
        },
        url: 'https://arrowhead.zendesk.com/hc/en-us/articles/14732747845020-I-receive-Error-114-when-attempting-to-launch-HELLDIVERS-2',
      },
      store('553850'),
    ],
  },
  'hogwarts-legacy': {
    lead: {
      en: 'Save and config locations, official requirements and WB Games’ steps for crashes on PC.',
      zh: '存档与配置文件位置、官方配置需求，以及 WB Games 官方的 PC 崩溃对策。',
      es: 'Ubicación de partidas y configuración, requisitos oficiales y los pasos de WB Games para cierres en PC.',
    },
    intro: {
      en: 'Hogwarts Legacy saves to %LOCALAPPDATA%\\Hogwarts Legacy\\Saved\\SaveGames. If you edited Engine.ini or installed mods, undo that first. The official troubleshooting then covers drivers, Windows Update (DirectX), overclocking, file verification and lower graphics settings.',
      zh: '《霍格沃茨之遗》的存档位于 %LOCALAPPDATA%\\Hogwarts Legacy\\Saved\\SaveGames。如果修改过 Engine.ini 或安装了 MOD，请先恢复原状。之后再按官方故障排除步骤检查：驱动、Windows 更新（DirectX）、超频、文件验证和降低画质设置。',
      es: 'Hogwarts Legacy guarda en %LOCALAPPDATA%\\Hogwarts Legacy\\Saved\\SaveGames. Si editaste Engine.ini o instalaste mods, deshaz esos cambios primero. Después, la guía oficial revisa controladores, Windows Update (DirectX), overclock, verificación de archivos y ajustes gráficos más bajos.',
    },
    sources: [
      {
        label: {
          en: 'Portkey Games Support: PC Troubleshooting (Steam)',
          zh: 'Portkey Games 客服：PC 故障排除（Steam）',
          es: 'Soporte de Portkey Games: solución de problemas en PC (Steam)',
        },
        url: 'https://portkeygamessupport.wbgames.com/hc/en-us/articles/10765467342099-PC-Troubleshooting-Steam',
      },
      store('990080'),
    ],
  },
  'gta-v-enhanced': {
    lead: {
      en: 'Save location, official requirements and Rockstar’s steps to move Story Mode progress from Legacy to Enhanced.',
      zh: '存档位置、官方配置需求，以及 Rockstar 官方将故事模式进度从传承版迁移到增强版的步骤。',
      es: 'Ubicación de la partida, requisitos oficiales y los pasos de Rockstar para pasar el modo historia de Legacy a Enhanced.',
    },
    intro: {
      en: 'GTA V Enhanced is a separate PC edition from GTA V Legacy. Story Mode progress moves through your Rockstar Games account: upload one save from Legacy, then download it in Enhanced. The transfer works once per account and only between PC versions.',
      zh: 'GTA V 增强版是与传承版（Legacy）分开的 PC 版本。故事模式进度通过 Rockstar Games 账户迁移：先在传承版上传一个存档，再在增强版下载。每个账户只能迁移一次，且仅限 PC 版本之间。',
      es: 'GTA V Enhanced es una edición de PC distinta de GTA V Legacy. El progreso del modo historia se traslada mediante tu cuenta de Rockstar Games: subes una partida desde Legacy y la descargas en Enhanced. Solo se puede hacer una vez por cuenta y entre versiones de PC.',
    },
    sources: [
      {
        label: {
          en: 'Rockstar Support: Migrating your Story Mode save to GTAV Enhanced',
          zh: 'Rockstar 客服：将故事模式存档迁移到 GTAV 增强版',
          es: 'Soporte de Rockstar: migrar la partida del modo historia a GTAV Enhanced',
        },
        url: 'https://support.rockstargames.com/articles/mmRgMVfuQC3xNzXK4Cq9b/migrating-your-story-mode-save-from-grand-theft-auto-v-legacy-to-grand-theft',
      },
      store('3240220'),
    ],
  },
  'skyrim-special-edition': {
    lead: {
      en: 'Save location, official requirements and what to do when SKSE stops working after a game update.',
      zh: '存档位置、官方配置需求，以及游戏更新后 SKSE 无法使用时的处理方法。',
      es: 'Ubicación de la partida, requisitos oficiales y qué hacer si SKSE deja de funcionar tras una actualización.',
    },
    intro: {
      en: 'Skyrim Special Edition saves to Documents\\My Games\\Skyrim Special Edition\\Saves. Each SKSE build supports one specific game version, so a game update can stop SKSE from loading. The SKSE team’s advice is to install the matching build and remove the files in Data\\SKSE\\Plugins until your plugin mods are updated.',
      zh: '《上古卷轴5 特别版》的存档位于“文档\\My Games\\Skyrim Special Edition\\Saves”。每个 SKSE 版本只支持一个特定的游戏版本，因此游戏更新后 SKSE 可能无法加载。SKSE 团队的建议是安装对应的版本，并在插件类 MOD 更新前先移走 Data\\SKSE\\Plugins 中的文件。注意：Steam 版官方未提供简体中文。',
      es: 'Skyrim Special Edition guarda en Documentos\\My Games\\Skyrim Special Edition\\Saves. Cada versión de SKSE admite una sola versión del juego, así que una actualización puede impedir que SKSE cargue. El equipo de SKSE recomienda instalar la versión correspondiente y retirar los archivos de Data\\SKSE\\Plugins hasta que se actualicen los mods con plugins.',
    },
    sources: [
      {
        label: {
          en: 'Skyrim Script Extender (SKSE) official site',
          zh: 'Skyrim Script Extender（SKSE）官方网站',
          es: 'Sitio oficial de Skyrim Script Extender (SKSE)',
        },
        url: 'https://skse.silverlock.org/',
      },
      store('489830'),
    ],
  },
  'stardew-valley': {
    lead: {
      en: 'Where saves are stored and how to recover one that disappeared or will not load.',
      zh: '存档的保存位置，以及存档消失或无法读取时的恢复方法。',
      es: 'Dónde se guardan las partidas y cómo recuperar una que desapareció o no carga.',
    },
    intro: {
      en: 'Stardew Valley only saves when the in-game day ends. Each farm has a folder under %appdata%\\StardewValley\\Saves, and the game needs both required save files in that folder to load it. The official wiki lists four ways to recover a save: fix a temporary file name, undo the last save, restore an SMAPI backup, or put back a save that Steam Cloud overwrote.',
      zh: '《星露谷物语》只在游戏内一天结束时存档。每个农场都是 %appdata%\\StardewValley\\Saves 下的一个文件夹，需要其中两个文件才能读取。官方 Wiki 列出了四种恢复方法：修正临时文件名、撤销上一次存档、从 SMAPI 备份恢复，以及恢复被 Steam 云覆盖的存档。',
      es: 'Stardew Valley solo guarda al terminar el día en el juego. Cada granja es una carpeta dentro de %appdata%\\StardewValley\\Saves y necesita dos archivos para cargar. La wiki oficial indica cuatro formas de recuperarla: corregir un nombre temporal, deshacer el último guardado, restaurar una copia de SMAPI o recuperar una partida que Steam Cloud sobrescribió.',
    },
    sources: [
      {
        label: {
          en: 'Stardew Valley Wiki (official): Saves',
          zh: '星露谷物语官方 Wiki：存档（英文）',
          es: 'Wiki oficial de Stardew Valley: partidas (en inglés)',
        },
        url: 'https://stardewvalleywiki.com/Saves',
      },
      store('413150'),
    ],
  },
};
