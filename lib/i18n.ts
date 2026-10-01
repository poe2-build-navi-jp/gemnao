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
    selection: 'WINDOWS GAME CHECKLISTS',
    listTitle: 'Choose your game',
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

export function localizedRoot(locale: 'ja' | Locale) {
  return locale === 'ja' ? '/' : `/${locale}`;
}
