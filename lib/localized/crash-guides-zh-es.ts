import type { TranslatedCommonGuide } from './save-guides-zh-es';
import { crashGuideEn } from './crash-guide-en';
export type CrashSection = {
  id: string;
  title: string;
  paragraphs?: string[];
  items?: string[];
  ordered?: boolean;
  table?: { headers: string[]; rows: string[][] };
  links?: { href: string; label: string }[];
};
const zh: CrashSection[] = [
  {
    id: 'crash-scope',
    title: '先确认是否只有游戏退出',
    paragraphs: [
      '本指南针对游戏关闭并返回 Windows 桌面。画面冻结、整台电脑关机或重启、带停止代码的蓝屏需要不同检查。没有中译版的相关链接会注明语言。',
      '记录游戏和版本、发生时间、启动后经过多久、完整错误、存档槽位和场景。在安全前提下比较同一操作；疑似存档损坏时先复制保全。',
    ],
  },
  {
    id: 'crash-timing',
    title: '按启动、载入或长时间游玩选择起点',
    table: {
      headers: ['退出时机', '先确认什么', '首次比较'],
      rows: [
        [
          '标志画面附近或启动后立即退出',
          '是否在安装 MOD/ReShade 后开始？更新前能否运行？',
          '用管理器停用 MOD 后比较，再单独比较关闭叠加层；无变化时考虑备份后重置设置。',
        ],
        [
          '载入存档或区域时',
          '只影响一个存档/场景，还是其他槽位或新游戏也失败？',
          '先复制存档。其他槽位也失败时验证 Steam 文件；只一个失败时保留原件并联系支持。',
        ],
        [
          '几十分钟或数小时后',
          '游玩中 RAM、独立显存余量是否下降，温度是否上升？',
          '正常关闭不必要应用再比较；显存紧张时把纹理降低一档。温度检查参见相关日文冻结指南。',
        ],
      ],
    },
    paragraphs: [
      '时间规律不能单独确定原因。文件损坏也可能影响启动，MOD 也可能影响载入，驱动失败也可能发生在长时间游玩后。依据记录和每次比较结果选择下一项。',
    ],
  },
  {
    id: 'step-1',
    title: '步骤 1：记录现象与时间',
    ordered: true,
    items: [
      '记录返回桌面的时间、发生在启动还是载入阶段、已游玩多久，以及同一操作是否复现。断电、自动重启和蓝屏使用各自的指南。',
      '按下方 Windows 历史说明查找同一时刻的目标游戏。没有记录时写明“无匹配记录”，不要只凭模块名推断原因。',
    ],
  },
  {
    id: 'step-2',
    title: '步骤 2：选择与发生时机相符的一项检查',
    ordered: true,
    items: [
      '启动时：用管理器停用 MOD 后比较；另一次比较时在 Steam 游戏属性的常规页关闭叠加层。不要覆盖依赖 MOD 的存档。',
      '载入时：先复制存档，再比较其他槽位或新游戏。Steam 中通过属性、已安装文件验证完整性；此操作可能恢复被 MOD 修改的文件。',
      '长时间游玩后：在相同场景比较任务管理器内存与独立 GPU 内存。内存余量下降时正常关闭不必要应用；显存紧张时把纹理降低一档。温度也上升时检查散热与通风。',
    ],
  },
  {
    id: 'step-3',
    title: '步骤 3：在相同条件下比较，再决定下一项',
    ordered: true,
    items: [
      '改变前后使用同一存档、场景和相近时长，记录崩溃时间、经过时间及唯一改变的项目。无改善时恢复该设置再比较下一项。',
      '一个游戏仍失败且始于更新后时，比较 GPU 驱动版本与变更日期。多个游戏失败时查看整机历史和制造商诊断，不要反复重装游戏。',
    ],
  },
  {
    id: 'crash-history',
    title: '没有错误提示时，检查 Windows 崩溃历史',
    ordered: true,
    items: [
      '按 Windows+R，输入 perfmon /rel。在可靠性监视器中选择当天的红色故障标记；目标游戏有停止工作记录时，打开技术详情并记录时间、应用名称和问题事件名称。',
      '没有时，右击开始菜单打开事件查看器，进入 Windows 日志的应用程序。检查崩溃时间附近的错误并核对游戏 EXE。Application Error 1000 与附近的 Windows Error Reporting 1001 可能提供线索。',
      '记录常规信息中的故障应用、故障模块、异常代码和时间。其他应用的错误或相隔数小时的警告不能证明原因。没有匹配时记录这一结果，再按发生时机比较。',
    ],
    paragraphs: [
      '例如 Game.exe 在相符时间停止且只有游戏退出，可优先比较更新、MOD 和存档。KERNELBASE.dll 等模块名不能确诊，更不是替换 DLL 的指令。多个游戏或 Windows 也失败时，同时调查电脑整体。',
    ],
  },
  {
    id: 'steam-client-case',
    title: '单条用户恢复报告：区分 Steam 扩展与游戏 MOD',
    paragraphs: [
      '2026年10月3日的原文章记录中，一位用户反馈（确切反馈时间未记录）Steam 版《怪物猎人：荒野》在临时停用第三方 Steam 客户端扩展后能够游玩；此前在标题画面前退出。关闭 OBS、Steam 叠加层、验证文件、确认未强制管理员模式，以及更新 GPU 驱动并重启均未解决。之后的只读检查发现 Steam 进程从安装根目录加载了额外 DLL。这是匿名用户报告，不是官方修复或受控因果证明。',
      '文件存在与实际加载到进程是不同事实。该报告没有确认文件加载到游戏进程，也未证明某个 DLL 是原因。不要按文件名删除；不认识安装内容时停止。System32 中的同名 Windows DLL 不属于检查范围。',
      '改变前复制并核对设置与存档；会重定向存档的扩展还需检查外部云存储和自定义位置。重要数据无法保全时不要继续。只检查目标游戏，出现同步冲突或存档缺失警告时停止，不覆盖。保留能工作的状态，不要为复现而重新启用扩展。',
      '所链接的英文 Wilds 报告记录 DLL 名称、只读检查、可逆暂停和用户报告结果。不要推广成其他游戏的相同原因或成功率。',
    ],
    links: [
      {
        href: '/en/games/monster-hunter-wilds/not-launching#steam-client-check',
        label: '查看 Wilds 标题前退出的用户报告（英文）',
      },
    ],
  },
  {
    id: 'crash-compare',
    title: '比较结果并决定下一步',
    table: {
      headers: ['结果', '下一步'],
      rows: [
        [
          '没有 MOD 时可以启动',
          '核对 MOD 来源的更新与游戏版本；恢复必要 MOD 前保全存档，并逐项比较。',
        ],
        [
          '只有一个存档无法载入',
          '保留副本，比较其他槽位，不删除原件；向游戏支持提供记录。',
        ],
        [
          '游玩越久，内存余量越低',
          '关闭不必要应用，在同样时长比较；独立显存紧张时降低一档纹理并记录。',
        ],
        [
          '多个游戏崩溃，或电脑也重启',
          '检查驱动变更与整机故障历史，不要反复重装单个游戏。',
        ],
      ],
    },
    paragraphs: [
      '示例记录：“改变前，同一存档载入后每次五分钟内退出；唯一改变是停用 MOD；改变后同一场景运行20分钟未退出。”这只是填写示例，不是实测结果。未再发生也不能认定永久修复，应在正常游玩中继续比较。求助时附游戏版本、崩溃时间、Windows 记录中的应用名与异常代码及已尝试检查。',
    ],
  },
  {
    id: 'cautions',
    title: '保全存档，避免猜测性的 DLL 修复',
    paragraphs: [
      '未先保全时不要覆盖依赖 MOD 的存档。不要因为日志提到某 DLL 就替换它，也不要从未知来源下载。保留设置与存档，每次只改变一项。',
    ],
  },
];
const es: CrashSection[] = [
  {
    id: 'crash-scope',
    title: 'Confirma primero si solo se cerró el juego',
    paragraphs: [
      'Esta guía trata un juego que se cierra y vuelve al escritorio de Windows. Una imagen congelada, el PC apagándose o reiniciándose y una pantalla azul con código requieren otras comprobaciones. Los enlaces sin traducción indican su idioma.',
      'Anota juego y versión, hora del cierre, tiempo desde el inicio, error completo, ranura y lugar del juego. Compara la misma acción solo si es seguro; conserva primero las partidas si sospechas corrupción.',
    ],
  },
  {
    id: 'crash-timing',
    title: 'Inicio, carga o sesión larga: por dónde empezar',
    table: {
      headers: [
        'Cuándo se cierra',
        'Qué comprobar primero',
        'Primera comparación',
      ],
      rows: [
        [
          'En el logotipo o nada más arrancar',
          '¿Empezó tras instalar un mod o ReShade? ¿Funcionaba antes de actualizar?',
          'Desactiva mods desde su gestor y compara. Prueba la superposición por separado. Si no cambia, considera respaldar y restablecer la configuración.',
        ],
        [
          'Al cargar una partida o zona',
          '¿Solo falla una partida o escena, o también otra ranura o partida nueva?',
          'Copia primero las partidas. Si fallan otras, verifica archivos de Steam. Si solo falla una, consérvala y consulta al soporte.',
        ],
        [
          'Tras decenas de minutos u horas',
          '¿Disminuye la RAM o memoria dedicada de GPU disponible o sube la temperatura?',
          'Cierra aplicaciones innecesarias normalmente y compara. Si falta VRAM, baja un nivel las texturas. Consulta la guía de bloqueos para temperaturas (japonés).',
        ],
      ],
    },
    paragraphs: [
      'El momento no demuestra la causa. Los archivos pueden afectar al inicio, los mods a la carga y los controladores fallar tras una sesión larga. Elige según registros y resultados de cada comparación.',
    ],
  },
  {
    id: 'step-1',
    title: 'PASO 1: registra el fallo y la hora',
    ordered: true,
    items: [
      'Anota cuándo apareció el escritorio, si fue al iniciar, cargar o tras cuántos minutos, y si la misma acción lo reproduce. Investiga apagados, reinicios automáticos y pantallas azules con sus guías específicas.',
      'Busca el juego a esa hora con las instrucciones de historial de Windows que siguen. Si no hay coincidencia, anota “sin registro coincidente”. No deduzcas la causa solo del módulo.',
    ],
  },
  {
    id: 'step-2',
    title: 'PASO 2: prueba una comprobación acorde con el momento',
    ordered: true,
    items: [
      'Al iniciar: desactiva mods desde su gestor y compara. Por separado, desactiva Steam Overlay en Propiedades, General del juego. No sobrescribas una partida dependiente de mods.',
      'Durante la carga: copia primero las partidas y compara otra ranura o una nueva. En Steam usa Propiedades, Archivos instalados y la verificación de integridad; puede restaurar archivos modificados por mods.',
      'Tras una sesión larga: compara Memoria y Memoria de GPU dedicada en el Administrador de tareas en la misma escena. Si baja la memoria disponible, cierra aplicaciones innecesarias normalmente; con poca VRAM, baja un nivel las texturas. Si sube la temperatura, comprueba refrigeración y ventilación.',
    ],
  },
  {
    id: 'step-3',
    title: 'PASO 3: compara en las mismas condiciones y elige qué sigue',
    ordered: true,
    items: [
      'Usa la misma partida, escena y duración aproximada antes y después. Registra hora del cierre, tiempo jugado y el único cambio. Si no ayuda, restaura ese ajuste antes del siguiente.',
      'Si falla un juego desde una actualización, compara versión y fecha del controlador gráfico. Si fallan varios, revisa el historial del PC y los diagnósticos del fabricante en vez de reinstalar juegos repetidamente.',
    ],
  },
  {
    id: 'crash-history',
    title: 'Sin mensaje de error, consulta el historial de Windows',
    ordered: true,
    items: [
      'Pulsa Windows+R e introduce perfmon /rel. En el Monitor de confiabilidad elige la marca roja del día del cierre. Si aparece el juego como aplicación que dejó de funcionar, abre los detalles técnicos y anota hora, aplicación y nombre del evento.',
      'Si no aparece, abre el Visor de eventos desde el menú contextual de Inicio y entra en Registros de Windows, Aplicación. Busca errores próximos al cierre y confirma el EXE. Application Error 1000 y un Windows Error Reporting 1001 cercano pueden aportar pistas.',
      'Anota aplicación, módulo, código de excepción y hora en General. Un error de otra aplicación o una advertencia de horas antes no demuestra la causa. Sin coincidencia, registra ese resultado y continúa comparando según el momento.',
    ],
    paragraphs: [
      'Por ejemplo, si Game.exe se detuvo a la hora correspondiente y solo se cerró el juego, prioriza actualizaciones, mods y partidas. KERNELBASE.dll no identifica la causa ni indica que debas reemplazar esa DLL. Si también fallan otros juegos o Windows, investiga el PC.',
    ],
  },
  {
    id: 'steam-client-case',
    title:
      'Un caso comunicado: distinguir extensiones de Steam y mods del juego',
    paragraphs: [
      'El artículo original fechado el 3 de octubre de 2026 recoge un informe de un usuario, sin fecha exacta de recepción registrada, que pudo jugar a Monster Hunter Wilds en Steam tras pausar extensiones de terceros del cliente. Antes se cerraba antes del título. Cerrar OBS, desactivar Steam Overlay, verificar archivos, confirmar que no se forzaba el modo administrador y actualizar el controlador gráfico y reiniciar no lo habían resuelto. Una comprobación de solo lectura encontró DLL adicionales cargadas en Steam desde su directorio raíz. Es un informe anónimo, no una solución oficial ni una demostración controlada de causalidad.',
      'Que un archivo exista y que esté cargado en un proceso son hechos distintos. No se verificó su carga en el proceso del juego ni se demostró que una DLL concreta fuera la causa. No borres por nombre y detente si no reconoces la instalación. Las DLL de Windows del mismo nombre en System32 quedan fuera del alcance.',
      'Antes de cambiar, copia y verifica ajustes y partidas. Si una extensión redirige guardados, comprueba también almacenamiento externo en la nube y destinos personalizados. No continúes si no puedes conservar datos importantes. Prueba solo el juego afectado y detente sin sobrescribir ante conflictos de sincronización o avisos de partidas ausentes. Conserva el estado funcional; no reactives extensiones solo para provocar otra vez el fallo.',
      'El caso de Wilds enlazado documenta nombres de DLL, comprobación de solo lectura, pausa reversible y resultado comunicado. No atribuyas la misma causa ni una supuesta tasa de éxito a otros juegos.',
    ],
    links: [
      {
        href: '/en/games/monster-hunter-wilds/not-launching#steam-client-check',
        label: 'Leer el caso de cierre antes del título de Wilds (inglés)',
      },
    ],
  },
  {
    id: 'crash-compare',
    title: 'Compara resultados y decide el siguiente paso',
    table: {
      headers: ['Resultado', 'Siguiente acción'],
      rows: [
        [
          'Arranca sin mods',
          'Comprueba las actualizaciones del mod para la versión del juego. Conserva partidas antes de restaurar mods necesarios y compáralos individualmente.',
        ],
        [
          'Solo una partida no carga',
          'Conserva una copia y compara otra ranura. No borres el original; facilita los registros al soporte.',
        ],
        [
          'La memoria disponible cae al seguir jugando',
          'Cierra aplicaciones innecesarias y compara durante el mismo tiempo. Si falta VRAM dedicada, baja un nivel las texturas y registra el resultado.',
        ],
        [
          'Fallan varios juegos o también se reinicia el PC',
          'Revisa historial de controladores y fallos del PC, no reinstales un solo juego repetidamente.',
        ],
      ],
    },
    paragraphs: [
      'Ejemplo: “Antes: se cierra en cinco minutos al cargar siempre la misma partida. Cambio: solo mods desactivados. Después: misma escena durante 20 minutos sin cierre”. Es un ejemplo de registro, no una medición. Que no se repita no demuestra una reparación permanente; compara durante el uso normal. Para pedir ayuda incluye juego y versión, hora, aplicación y código de excepción del registro y comprobaciones realizadas.',
    ],
  },
  {
    id: 'cautions',
    title: 'Conserva partidas y evita arreglos de DLL basados en suposiciones',
    paragraphs: [
      'No sobrescribas una partida dependiente de mods sin conservarla antes. No reemplaces una DLL solo por aparecer en un evento ni descargues archivos de fuentes desconocidas. Respalda ajustes y partidas y cambia un elemento cada vez.',
    ],
  },
];
const base = {
  slug: 'pc-game-crash',
  path: '/guide/pc-game-crash',
  topic: 'launch' as const,
  checkedAt: '2026-10-18',
  branches: [],
  cautions: [],
};
export const crashGuidesZhEs: TranslatedCommonGuide[] = [
  {
    ...base,
    locale: 'zh',
    category: 'PC 游戏通用排障',
    title: 'PC 游戏闪退到桌面：启动、载入与长时间游玩后的检查',
    shortTitle: '游戏闪退到桌面',
    description:
      '按启动、载入或长时间游玩区分闪退。核对 Windows 可靠性历史与事件，每次比较一项改动，并了解明确标注的 Steam 扩展用户报告。',
    lead: '先区分游戏退出与整台电脑重启。即使没有提示，也可结合时机、记录和单项比较决定下一步。',
    summary:
      '记录只有游戏关闭还是电脑重启，以及发生时机。启动时比较 MOD 与叠加层；载入时先保全存档并检查文件和场景差异；长时间游玩后观察 RAM、显存与温度变化。核对 Windows 记录中的游戏和时间，每次只改一项。',
    sourcePolicy:
      '根据日文与已核对的英文版改写官方 Windows/Steam 操作。Steam 扩展部分引用2026年10月3日原文章记录中的一条匿名用户恢复报告，确切反馈时间未记录，不是官方修复、受控因果证明或成功率统计。',
    steps: zh
      .filter((s) => s.id.startsWith('step-'))
      .map((s) => ({ id: s.id, title: s.title, actions: s.items!, next: '' })),
    crashSections: zh,
    faqs: [
      {
        question: '没有提示就返回桌面，先看哪里？',
        answer:
          '记录时间，打开可靠性历史查找目标游戏。没有时查看事件查看器中的 Windows 日志、应用程序。即使没有记录，也可按启动、载入、长时间游玩的时机选择比较。',
      },
      {
        question: '事件出现 KERNELBASE.dll，需要重装它吗？',
        answer:
          '不需要。故障模块只是记录故障位置的线索，不证明文件或硬件损坏。结合游戏、时间、复现条件和发行商说明判断，不要从文件分发站下载 DLL。',
      },
      {
        question: '只在载入时崩溃，可以删存档吗？',
        answer:
          '不要删除。关闭游戏并复制到其他位置，再比较其他槽位或新游戏；Steam 版可验证文件。只有一个存档失败时联系官方支持并保留原件。',
      },
      {
        question: '大约一小时后退出，原因就是温度吗？',
        answer:
          '仅凭时间不能确定。比较可用 RAM、独立显存和温度变化，每次只改一项，例如关闭不必要应用。多个游戏或正常桌面使用也失败时联系电脑制造商。',
      },
    ],
    sources: crashGuideEn.sources.map((s, i) => ({
      url: s.url,
      label: [
        'Microsoft：系统工具与事件查看器（日文）',
        'Microsoft Learn：应用崩溃及事件1000/1001（英文）',
        'Dell：使用可靠性监视器识别软件问题（英文）',
        'Steam：验证游戏文件（日文）',
      ][i],
    })),
    related: [
      { href: '/zh/guide/save-data-backup', label: '先保全存档' },
      {
        href: '/zh/guide/steam-cloud-sync-error',
        label: '云警告与候选版本保全',
      },
      {
        href: '/zh/guide/steam-game-not-launching',
        label: 'Steam 游戏无法启动',
      },
      { href: '/guide/pc-game-freezes', label: '游戏冻结与温度检查（日文）' },
      {
        href: '/guide/pc-shuts-down-while-gaming',
        label: '电脑关机或重启（日文）',
      },
      { href: '/guide/bsod-while-gaming', label: '游戏中蓝屏（日文）' },
      {
        href: '/en/guide/gpu-driver-update',
        label: '显卡驱动更新与回退（英文）',
      },
    ],
  },
  {
    ...base,
    locale: 'es',
    category: 'Problemas comunes de juegos de PC',
    title: 'Juegos de PC que se cierran: inicio, carga y sesiones largas',
    shortTitle: 'El juego se cierra al escritorio',
    description:
      'Distingue cierres al iniciar, cargar o tras jugar mucho tiempo. Compara registros de Windows y un cambio cada vez, con un caso de extensiones de Steam claramente identificado.',
    lead: 'Distingue el cierre del juego de un reinicio del PC. El momento, los registros y una comparación controlada ayudan a elegir qué revisar incluso sin mensaje de error.',
    summary:
      'Anota si se cerró solo el juego o se reinició el PC y cuándo. Al iniciar, compara mods y superposiciones; durante la carga, conserva partidas y comprueba archivos y escenas; tras sesiones largas, observa RAM, VRAM y temperatura. Busca juego y hora coincidentes en Windows y cambia un elemento cada vez.',
    sourcePolicy:
      'Adaptación de las guías japonesa e inglesa revisada sobre procedimientos oficiales de Windows y Steam. El caso de extensiones es un único informe anónimo del artículo original fechado el 3 de octubre de 2026, sin fecha exacta de recepción registrada; no es una solución oficial, una prueba controlada de causalidad ni una tasa de éxito.',
    steps: es
      .filter((s) => s.id.startsWith('step-'))
      .map((s) => ({ id: s.id, title: s.title, actions: s.items!, next: '' })),
    crashSections: es,
    faqs: [
      {
        question: 'Vuelve al escritorio sin mensaje. ¿Por dónde empiezo?',
        answer:
          'Anota la hora y busca el juego en el Monitor de confiabilidad. Si no aparece, consulta Visor de eventos, Registros de Windows, Aplicación. Sin registro también puedes elegir una comparación según si ocurre al iniciar, cargar o tras una sesión larga.',
      },
      {
        question: '¿Debo reinstalar KERNELBASE.dll si aparece en un evento?',
        answer:
          'No. El módulo señala dónde se registró un fallo, no demuestra daño en el archivo o hardware. Contrasta juego, hora y condiciones con el soporte del editor. No descargues DLL de sitios de distribución de archivos.',
      },
      {
        question: 'Solo se cierra al cargar. ¿Puedo borrar la partida?',
        answer:
          'No la borres. Cierra el juego y cópiala a otro lugar. Compara otra ranura o una partida nueva y verifica archivos si usas Steam. Si solo falla una, conserva el original y consulta al soporte oficial.',
      },
      {
        question: 'Se cierra tras una hora. ¿La causa es la temperatura?',
        answer:
          'El tiempo no basta para concluirlo. Comprueba RAM disponible, memoria dedicada de GPU y cambios de temperatura. Compara un cambio cada vez, como cerrar una aplicación innecesaria. Si también falla el escritorio u otros juegos, consulta al fabricante del PC.',
      },
    ],
    sources: crashGuideEn.sources.map((s, i) => ({
      url: s.url,
      label: [
        'Microsoft: herramientas del sistema y Visor de eventos (japonés)',
        'Microsoft Learn: cierres de aplicaciones y eventos 1000/1001 (inglés)',
        'Dell: identificar problemas con el Monitor de confiabilidad (inglés)',
        'Steam: verificar archivos del juego (japonés)',
      ][i],
    })),
    related: [
      {
        href: '/es/guide/save-data-backup',
        label: 'Conserva las partidas antes de cambiar archivos',
      },
      {
        href: '/es/guide/steam-cloud-sync-error',
        label: 'Avisos de nube y conservación de candidatos',
      },
      {
        href: '/es/guide/steam-game-not-launching',
        label: 'El juego de Steam no arranca',
      },
      {
        href: '/guide/pc-game-freezes',
        label: 'Bloqueos del juego y temperaturas (japonés)',
      },
      {
        href: '/guide/pc-shuts-down-while-gaming',
        label: 'Apagados y reinicios del PC (japonés)',
      },
      {
        href: '/guide/bsod-while-gaming',
        label: 'Pantallas azules al jugar (japonés)',
      },
      {
        href: '/en/guide/gpu-driver-update',
        label: 'Actualizar o revertir el controlador gráfico (inglés)',
      },
    ],
  },
];
