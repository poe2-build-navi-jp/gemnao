export const locales = ['en', 'zh', 'es'] as const;
export type Locale = (typeof locales)[number];

export const isLocale = (value: string): value is Locale =>
  locales.includes(value as Locale);

export const localeNames: Record<'ja' | Locale, string> = {
  ja: '日本語',
  en: 'English',
  zh: '简体中文',
  es: 'Español',
};

export const copy = {
  en: {
    lang: 'English',
    home: 'Home',
    games: 'Games',
    basics: 'PC basics',
    about: 'About',
    tagline: 'Practical PC game fixes, in the order you should try them.',
    hero: 'Fix your PC game problems, fast.',
    heroBody:
      'Save locations, launch errors, FPS settings, controllers and mods—concise, practical guides for popular PC games.',
    selection: 'POPULAR GUIDES FOR 2026',
    listTitle: 'Games players need help with now',
    titles: 'guides',
    open: 'Open guide',
    articleLabel: 'PC TROUBLESHOOTING & SETTINGS GUIDE',
    lastChecked: 'Last checked',
    contents: 'On this page',
    backupTitle: 'Back up before making changes',
    backupBody:
      'Copy the entire save and configuration folders somewhere safe before editing or deleting files.',
    evidence: 'Evidence behind this guide',
    evidenceBody:
      'We cross-check store information and technical references, then summarize actionable steps in our own words.',
    demand: 'Relative demand',
    sourcesChecked: 'Sources checked',
    fixes: 'Prioritized fixes',
    demandNote: 'Based on play activity and public troubleshooting signals',
    sourceNote: 'Linked from this page',
    fixNote: 'Try from top to bottom',
    caveat:
      'Demand is not an exact user count or success rate. Those figures are not officially published, so we do not invent estimates.',
    save: 'Save and configuration locations',
    saveData: 'Save data',
    config: 'Configuration files',
    openPath:
      'Open Run with Windows + R, then paste paths beginning with %APPDATA% or %LOCALAPPDATA%.',
    display: 'FPS, ultrawide and HDR',
    controller: 'Controller support',
    launch: 'Launch and crash fixes',
    launchIntro:
      'Try one item at a time and test after each change so you can identify the cause.',
    mods: 'Mods and language support',
    specs: 'System requirements',
    minimum: 'Minimum',
    recommended: 'Recommended',
    storage: 'Storage',
    requirementsNote:
      'Requirements can change after updates. Check the latest store listing before buying.',
    references: 'References',
    genericDisplay:
      'Check the in-game frame cap first. Match it to your display, test ultrawide at native resolution, and enable Windows HDR before launching when HDR is supported.',
    genericController:
      'Xbox and PlayStation-style controllers are commonly supported. If inputs double or fail, test Steam Input and any controller mapper separately.',
    genericMods:
      'Back up saves first, confirm the mod matches the current game version, and test one mod at a time. Remove all mods immediately after a major update if the game stops launching.',
    footer: 'Game names and trademarks belong to their respective owners.',
  },
  zh: {
    lang: '简体中文',
    home: '首页',
    games: '游戏列表',
    basics: '电脑设置基础',
    about: '关于本站',
    tagline: '按推荐顺序整理的实用 PC 游戏故障解决 Wiki。',
    hero: '快速解决 PC 游戏问题。',
    heroBody:
      '汇总热门 PC 游戏的存档位置、启动故障、FPS 设置、手柄与 MOD，步骤简洁并可直接操作。',
    selection: '2026 热门指南',
    listTitle: '目前求助较多的游戏',
    titles: '篇指南',
    open: '查看指南',
    articleLabel: 'PC 版故障排查与设置指南',
    lastChecked: '最后核对',
    contents: '本页内容',
    backupTitle: '修改前请先备份',
    backupBody: '编辑或删除文件前，请把整个存档和配置文件夹复制到安全位置。',
    evidence: '本指南的依据',
    evidenceBody:
      '我们交叉核对商店信息与技术资料，并用自己的文字整理可执行步骤。',
    demand: '相对需求',
    sourcesChecked: '已核对来源',
    fixes: '按优先级排列的对策',
    demandNote: '根据游玩趋势与公开故障信息评估',
    sourceNote: '可从本页打开',
    fixNote: '请从上到下尝试',
    caveat:
      '需求等级不是准确人数或成功率。外部服务未公布相关官方统计，因此本站不会虚构数字。',
    save: '存档与配置文件位置',
    saveData: '存档数据',
    config: '配置文件',
    openPath:
      '按 Windows + R 打开“运行”，粘贴以上以 %APPDATA% 或 %LOCALAPPDATA% 开头的路径。',
    display: 'FPS、超宽屏与 HDR',
    controller: '手柄支持',
    launch: '无法启动与崩溃对策',
    launchIntro: '每次只修改一项并重新启动测试，以便确定真正原因。',
    mods: 'MOD 与语言支持',
    specs: '配置需求',
    minimum: '最低配置',
    recommended: '推荐配置',
    storage: '存储空间',
    requirementsNote:
      '游戏更新后配置需求可能变化，购买前请查看商店的最新说明。',
    references: '参考资料',
    genericDisplay:
      '先检查游戏内帧率上限，并按显示器刷新率调整。超宽屏请使用原生分辨率测试；支持 HDR 时，先开启 Windows HDR 再启动游戏。',
    genericController:
      '通常支持 Xbox 与 PlayStation 类型手柄。出现重复输入或无响应时，请分别测试 Steam Input 与其他映射工具，避免同时启用。',
    genericMods:
      '先备份存档，确认 MOD 与当前游戏版本匹配，并逐个测试。大型更新后若无法启动，应先移除全部 MOD。',
    footer: '游戏名称与商标归各自权利人所有。',
  },
  es: {
    lang: 'Español',
    home: 'Inicio',
    games: 'Juegos',
    basics: 'Ajustes básicos',
    about: 'Acerca del sitio',
    tagline: 'Soluciones prácticas para juegos de PC, en el orden recomendado.',
    hero: 'Resuelve rápido los problemas de tus juegos de PC.',
    heroBody:
      'Ubicación de partidas, errores de inicio, FPS, mandos y mods: guías prácticas y concisas para juegos populares.',
    selection: 'GUÍAS POPULARES DE 2026',
    listTitle: 'Juegos que más ayuda necesitan ahora',
    titles: 'guías',
    open: 'Abrir guía',
    articleLabel: 'GUÍA DE AJUSTES Y SOLUCIÓN DE PROBLEMAS',
    lastChecked: 'Última revisión',
    contents: 'Contenido',
    backupTitle: 'Haz una copia antes de cambiar nada',
    backupBody:
      'Copia las carpetas completas de partidas y configuración en un lugar seguro antes de editar o borrar archivos.',
    evidence: 'Base de esta guía',
    evidenceBody:
      'Contrastamos la tienda y fuentes técnicas, y resumimos con nuestras propias palabras solo los pasos aplicables.',
    demand: 'Demanda relativa',
    sourcesChecked: 'Fuentes revisadas',
    fixes: 'Soluciones priorizadas',
    demandNote: 'Evaluación basada en actividad y señales públicas',
    sourceNote: 'Enlazadas en esta página',
    fixNote: 'Pruébalas de arriba abajo',
    caveat:
      'La demanda no es un número exacto de usuarios ni una tasa de éxito. Esas cifras no se publican oficialmente, por lo que no inventamos estimaciones.',
    save: 'Ubicación de partidas y configuración',
    saveData: 'Partidas guardadas',
    config: 'Archivos de configuración',
    openPath:
      'Pulsa Windows + R y pega las rutas que empiezan por %APPDATA% o %LOCALAPPDATA%.',
    display: 'FPS, pantalla ultraancha y HDR',
    controller: 'Compatibilidad con mandos',
    launch: 'Problemas de inicio y cierres',
    launchIntro:
      'Prueba un paso cada vez y abre el juego después de cada cambio para identificar la causa.',
    mods: 'Mods e idioma',
    specs: 'Requisitos del sistema',
    minimum: 'Mínimos',
    recommended: 'Recomendados',
    storage: 'Almacenamiento',
    requirementsNote:
      'Los requisitos pueden cambiar con las actualizaciones. Revisa la ficha actual de la tienda antes de comprar.',
    references: 'Referencias',
    genericDisplay:
      'Comprueba primero el límite de FPS del juego. Ajústalo a tu monitor, prueba la resolución nativa en pantalla ultraancha y activa el HDR de Windows antes de iniciar cuando sea compatible.',
    genericController:
      'Normalmente se admiten mandos tipo Xbox y PlayStation. Si hay entradas dobles o no responde, prueba por separado Steam Input y cualquier programa de mapeo.',
    genericMods:
      'Haz copia de las partidas, confirma que el mod sea compatible con la versión actual y prueba uno cada vez. Tras una actualización grande, retira todos los mods si el juego deja de arrancar.',
    footer:
      'Los nombres y marcas de los juegos pertenecen a sus respectivos titulares.',
  },
} as const;

type LocalGameText = { lead: string; fixes: string[]; language: string };

const en: Record<string, LocalGameText> = {
  'monster-hunter-wilds': {
    lead: 'Work through launch failures and stutter, then protect saves and tune graphics safely.',
    fixes: [
      'Verify installed files in Steam',
      'Update the GPU driver and restart Windows',
      'Back up and move config.ini so the game recreates it',
      'Check VRAM and free disk space when using high-resolution textures',
    ],
    language:
      'Official Japanese, English, Chinese and Spanish interfaces are available; no fan translation is required.',
  },
  palworld: {
    lead: 'Find world saves, check server settings, and recover from update-related launch failures.',
    fixes: [
      'Move all mods out and test the unmodified game',
      'Verify files in Steam',
      'Back up and move the Windows configuration folder',
      'Make sure client and server versions match',
    ],
    language:
      'The game officially supports multiple languages, including Japanese, English, Simplified Chinese and Spanish.',
  },
  'elden-ring': {
    lead: 'Handle the 60 FPS cap, ultrawide black bars, white-screen launches and offline mod use.',
    fixes: [
      'Verify files in Steam',
      'Remove mods and injected DLL files',
      'Back up and regenerate GraphicsConfig.xml',
      'Repair Epic Online Services and Easy Anti-Cheat',
    ],
    language:
      'Official interface and subtitle languages include Japanese, English, Chinese and Spanish.',
  },
  'cyberpunk-2077': {
    lead: 'Protect saves and troubleshoot HDR, ultrawide, REDmod and launch errors.',
    fixes: [
      'Remove REDmod, CET and redscript mods temporarily',
      'Repair files in Steam or GOG',
      'Rebuild the GPU shader cache',
      'Move GamePipelineLibrary.cache and relaunch',
    ],
    language:
      'Official language availability varies by region; check the store language table for interface, subtitles and audio.',
  },
  'baldurs-gate-3': {
    lead: 'Switch DX11/Vulkan, repair save sync and resolve mismatched multiplayer mods.',
    fixes: [
      'Switch between DX11 and Vulkan',
      'Skip the launcher and start the game executable directly',
      'Move the Mods folder and modsettings.lsx',
      'Match game and mod versions for every multiplayer participant',
    ],
    language:
      'Official interface and subtitle support includes English, Japanese, Simplified Chinese and Spanish.',
  },
  'helldivers-2': {
    lead: 'Isolate startup crashes, GameGuard issues, matchmaking trouble and DualSense conflicts.',
    fixes: [
      'Restart the PC and Steam, then check server status',
      'Delete the GameGuard folder so it can be recreated',
      'Verify files and inspect antivirus quarantine',
      'Switch from fullscreen to borderless if display initialization freezes',
    ],
    language:
      'Official interface and subtitle support includes English, Japanese, Simplified Chinese and Spanish.',
  },
  'hogwarts-legacy': {
    lead: 'Reduce stutter and VRAM pressure, repair launch crashes and manage Unreal Engine mods.',
    fixes: [
      'Move any Engine.ini tweaks out',
      'Empty the ~mods folder and test',
      'Update the GPU driver and allow shader compilation to finish',
      'Restore default VRAM pool values',
    ],
    language:
      'Official language support varies by region and platform; confirm audio and subtitle availability in the store.',
  },
  'gta-v-enhanced': {
    lead: 'Handle Legacy save migration, HDR/RT, ERR_GFX_STATE and story-mode mods.',
    fixes: [
      'Check Rockstar Games Launcher cache and sign-in',
      'Back up and regenerate settings.xml',
      'Remove ASI loaders and all mods',
      'Update the driver, then regenerate settings for ERR_GFX_STATE',
    ],
    language:
      'Official interface and subtitle languages vary by storefront region; verify the current store listing.',
  },
  'skyrim-special-edition': {
    lead: 'Match SKSE versions, restore launch after mod updates and configure high refresh rates safely.',
    fixes: [
      'Match SKSE64 to the exact game runtime',
      'Update Address Library and other requirements',
      'Disable plugins in halves to isolate the conflict',
      'Back up and regenerate Skyrim.ini and SkyrimPrefs.ini',
    ],
    language:
      'Official languages differ by region. Some mod setups require English game files plus separate localized resources.',
  },
  'stardew-valley': {
    lead: 'Restore saves, read SMAPI errors, resolve mod conflicts and check controller settings.',
    fixes: [
      'Read red SMAPI console messages for missing requirements',
      'Remove Steam launch options and test vanilla',
      'Back up and regenerate startup_preferences',
      'Restore a damaged save from its matching _old file',
    ],
    language:
      'Official interface support includes Japanese, English, Simplified Chinese and Spanish; old translation mods are usually unnecessary.',
  },
};

const zh: Record<string, LocalGameText> = Object.fromEntries(
  Object.entries(en).map(([slug, value]) => [
    slug,
    {
      ...value,
      lead: (
        {
          'monster-hunter-wilds':
            '依次排查启动失败与卡顿，并安全备份存档、调整画质。',
          palworld: '查找世界存档、核对服务器设置，并处理更新后的启动故障。',
          'elden-ring': '处理 60 FPS 上限、超宽屏黑边、白屏启动与离线 MOD。',
          'cyberpunk-2077': '保护存档，并排查 HDR、超宽屏、REDmod 与启动错误。',
          'baldurs-gate-3': '切换 DX11/Vulkan，修复存档同步与联机 MOD 不一致。',
          'helldivers-2': '排查启动崩溃、GameGuard、匹配与 DualSense 冲突。',
          'hogwarts-legacy': '缓解卡顿和显存压力，修复启动崩溃并管理 UE MOD。',
          'gta-v-enhanced':
            '处理旧版存档迁移、HDR/光追、ERR_GFX_STATE 与剧情 MOD。',
          'skyrim-special-edition':
            '核对 SKSE 版本，修复 MOD 更新后的启动问题并安全设置高刷新率。',
          'stardew-valley':
            '恢复存档、读取 SMAPI 错误、排查 MOD 冲突与手柄设置。',
        } as Record<string, string>
      )[slug],
      fixes: (
        {
          'monster-hunter-wilds': [
            '在 Steam 验证文件完整性',
            '更新显卡驱动并重启 Windows',
            '备份并移走 config.ini，让游戏重新生成',
            '使用高清材质时检查显存和磁盘空间',
          ],
          palworld: [
            '移走全部 MOD 后测试原版游戏',
            '在 Steam 验证文件',
            '备份并移走 Windows 配置文件夹',
            '确认客户端与服务器版本一致',
          ],
          'elden-ring': [
            '在 Steam 验证文件',
            '移走 MOD 与注入的 DLL',
            '备份并重新生成 GraphicsConfig.xml',
            '修复 Epic Online Services 与 Easy Anti-Cheat',
          ],
          'cyberpunk-2077': [
            '暂时移除 REDmod、CET 与 redscript MOD',
            '在 Steam 或 GOG 修复文件',
            '重建显卡着色器缓存',
            '移走 GamePipelineLibrary.cache 后重启',
          ],
          'baldurs-gate-3': [
            '在 DX11 与 Vulkan 之间切换',
            '跳过启动器并直接运行游戏程序',
            '移走 Mods 文件夹与 modsettings.lsx',
            '让所有联机玩家的游戏和 MOD 版本一致',
          ],
          'helldivers-2': [
            '重启电脑和 Steam，并检查服务器状态',
            '删除 GameGuard 文件夹让其重建',
            '验证文件并检查杀毒软件隔离区',
            '全屏卡住时改用无边框窗口',
          ],
          'hogwarts-legacy': [
            '移走 Engine.ini 的自定义修改',
            '清空 ~mods 文件夹后测试',
            '更新显卡驱动并等待着色器编译完成',
            '恢复默认显存池数值',
          ],
          'gta-v-enhanced': [
            '检查 Rockstar Games Launcher 缓存与登录状态',
            '备份并重新生成 settings.xml',
            '移除 ASI 加载器与全部 MOD',
            '更新驱动，再为 ERR_GFX_STATE 重建设置',
          ],
          'skyrim-special-edition': [
            '让 SKSE64 与游戏运行时版本完全匹配',
            '更新 Address Library 等前置组件',
            '每次禁用一半插件以定位冲突',
            '备份并重新生成 Skyrim.ini 与 SkyrimPrefs.ini',
          ],
          'stardew-valley': [
            '查看 SMAPI 控制台红字中的缺失前置',
            '移除 Steam 启动参数并测试原版',
            '备份并重新生成 startup_preferences',
            '用同名 _old 文件恢复损坏存档',
          ],
        } as Record<string, string[]>
      )[slug],
      language:
        '语言支持会因游戏与商店地区而异，请以当前商店语言表为准；不要使用来源不明的翻译文件。',
    },
  ]),
) as Record<string, LocalGameText>;

const es: Record<string, LocalGameText> = Object.fromEntries(
  Object.entries(en).map(([slug, value]) => [
    slug,
    {
      ...value,
      lead: (
        {
          'monster-hunter-wilds':
            'Diagnostica fallos de inicio y tirones, protege las partidas y ajusta los gráficos.',
          palworld:
            'Localiza mundos guardados, revisa el servidor y repara fallos tras una actualización.',
          'elden-ring':
            'Gestiona el límite de 60 FPS, las bandas ultraanchas, la pantalla blanca y los mods sin conexión.',
          'cyberpunk-2077':
            'Protege las partidas y soluciona HDR, ultraancho, REDmod y errores de inicio.',
          'baldurs-gate-3':
            'Alterna DX11/Vulkan, repara la sincronización y resuelve mods incompatibles en multijugador.',
          'helldivers-2':
            'Aísla cierres al iniciar, problemas de GameGuard, emparejamiento y DualSense.',
          'hogwarts-legacy':
            'Reduce tirones y uso de VRAM, repara cierres y gestiona mods de Unreal Engine.',
          'gta-v-enhanced':
            'Resuelve la migración desde Legacy, HDR/RT, ERR_GFX_STATE y mods del modo historia.',
          'skyrim-special-edition':
            'Ajusta SKSE a la versión correcta y recupera el inicio tras actualizar mods.',
          'stardew-valley':
            'Restaura partidas, interpreta SMAPI y corrige conflictos de mods y mandos.',
        } as Record<string, string>
      )[slug],
      fixes: (
        {
          'monster-hunter-wilds': [
            'Verifica los archivos instalados en Steam',
            'Actualiza el controlador gráfico y reinicia Windows',
            'Guarda y aparta config.ini para regenerarlo',
            'Comprueba VRAM y espacio libre con texturas de alta resolución',
          ],
          palworld: [
            'Aparta todos los mods y prueba el juego original',
            'Verifica los archivos en Steam',
            'Guarda y aparta la carpeta de configuración de Windows',
            'Iguala las versiones del cliente y del servidor',
          ],
          'elden-ring': [
            'Verifica los archivos en Steam',
            'Retira mods y DLL inyectadas',
            'Guarda y regenera GraphicsConfig.xml',
            'Repara Epic Online Services y Easy Anti-Cheat',
          ],
          'cyberpunk-2077': [
            'Retira temporalmente REDmod, CET y redscript',
            'Repara archivos en Steam o GOG',
            'Regenera la caché de sombreadores de la GPU',
            'Aparta GamePipelineLibrary.cache y reinicia',
          ],
          'baldurs-gate-3': [
            'Alterna entre DX11 y Vulkan',
            'Omite el lanzador y ejecuta el juego directamente',
            'Aparta Mods y modsettings.lsx',
            'Iguala juego y mods en todos los participantes',
          ],
          'helldivers-2': [
            'Reinicia el PC y Steam y revisa el servidor',
            'Borra GameGuard para que se regenere',
            'Verifica archivos y la cuarentena del antivirus',
            'Cambia de pantalla completa a ventana sin bordes',
          ],
          'hogwarts-legacy': [
            'Aparta los cambios de Engine.ini',
            'Vacía ~mods y prueba',
            'Actualiza el controlador y espera la compilación de sombreadores',
            'Restaura los valores de VRAM predeterminados',
          ],
          'gta-v-enhanced': [
            'Revisa caché e inicio de sesión de Rockstar Launcher',
            'Guarda y regenera settings.xml',
            'Retira cargadores ASI y todos los mods',
            'Actualiza el controlador y regenera ajustes',
          ],
          'skyrim-special-edition': [
            'Haz coincidir SKSE64 con la versión exacta del juego',
            'Actualiza Address Library y requisitos',
            'Desactiva la mitad de los plugins cada vez',
            'Guarda y regenera Skyrim.ini y SkyrimPrefs.ini',
          ],
          'stardew-valley': [
            'Lee los errores rojos de SMAPI',
            'Quita las opciones de inicio y prueba sin mods',
            'Guarda y regenera startup_preferences',
            'Restaura la partida desde el archivo _old',
          ],
        } as Record<string, string[]>
      )[slug],
      language:
        'La disponibilidad de idiomas depende del juego y la región. Consulta la tabla actual de la tienda y evita archivos de traducción de origen desconocido.',
    },
  ]),
) as Record<string, LocalGameText>;

export const localizedGames: Record<Locale, Record<string, LocalGameText>> = {
  en,
  zh,
  es,
};

export function localizedRoot(locale: 'ja' | Locale) {
  return locale === 'ja' ? '/' : `/${locale}`;
}
