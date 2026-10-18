import type { EnglishCommonGuide } from './common-guides-en';
import { saveGuidesEn } from './save-guides-en';
export type TranslatedCommonGuide = EnglishCommonGuide & {
  locale: 'zh' | 'es';
};
const original = saveGuidesEn.find((g) => g.slug === 'save-data-backup')!;
const urls = original.sources.map((s) => s.url);
const base = {
  slug: 'save-data-backup',
  path: '/guide/save-data-backup',
  topic: 'save' as const,
  checkedAt: '2026-10-18',
};
export const translatedCommonGuides: TranslatedCommonGuide[] = [
  {
    ...base,
    locale: 'zh',
    category: '存档保护与恢复',
    title: 'PC 游戏存档备份：找到文件、核对副本与安全恢复',
    shortTitle: '备份与恢复游戏存档',
    description:
      '更新、修复或调整 MOD 前，先备份 PC 游戏存档。确认保存位置、核对副本，并在恢复前保留当前数据，避免云同步覆盖。',
    lead: '适用于 Windows 本地游戏存档。复制游戏安装目录不一定包含存档。Steam 云同步会同步受支持的数据，但不保证能找回任意历史版本。',
    summary:
      '存档正常时，先正常保存并退出游戏，等待常规同步结束，再退出启动器。将确认过的存档目录复制到新的日期文件夹，保留原件。如果进度已经丢失或出现云冲突，应先保全现有文件，不要先启动游戏或重试同步。副本内容相同不等于游戏一定能读取。',
    sourcePolicy:
      '根据日文原稿和已核对的英文版改写。所列官方资料支持具体保存位置和工具行为；保全顺序与判断条件是编辑建议，并非恢复成功保证。操作前请确认游戏、商店、账号与版本对应的官方说明。资料链接主要为英文。',
    branches: [
      {
        symptom: '准备更新、调整 MOD 或修复游戏',
        action: '在进度正常时确认正确的存档位置。',
        step: 'step-1',
      },
      {
        symptom: '进度丢失或出现云同步冲突',
        action: '停止新建存档和同步选择，先保全候选文件。',
        step: 'step-1',
      },
      {
        symptom: '已经复制，但不确定是否完整',
        action: '核对目录结构和文件内容。',
        step: 'step-3',
      },
      {
        symptom: '需要恢复以前的副本',
        action: '先阅读恢复条件，不要直接替换当前文件。',
        step: 'safe-restore',
      },
    ],
    steps: [
      {
        id: 'step-1',
        title: '确认存档位置，关闭会写入文件的程序',
        actions: [
          '进度正常时，正常保存并退出游戏；等待常规云同步完成后退出启动器，也要关闭其他设备上的同一游戏。边写入边复制可能得到不一致的文件组合。',
          '如果进度已丢失、损坏或存在冲突，不要先新建存档、启动游戏“看一眼”或重试同步。分别保全各设备上剩余的本地文件。即使不按保存键，启动或载入也可能触发自动保存。',
          '按照发行商资料确认 Windows 用户、游戏版本和商店对应的位置。《赛博朋克 2077》的 Windows 官方支持列出 %USERPROFILE%\\Saved Games\\CD Projekt Red\\Cyberpunk 2077。应保留对应的存档目录结构，游戏程序或截图不能替代存档。',
          '《星露谷物语》的 Windows 官方说明列出 %APPDATA%\\StardewValley\\Saves。保留完整角色文件夹，包括同名存档、SaveGameInfo 和已有的 _old 文件；备份时不要改名或编辑。其他游戏的结构可能完全不同。',
        ],
        next: '账号、版本或所需文件不明确时，先向发行商确认。确认位置且游戏已关闭后进入步骤 2。存在云冲突时，应先阅读 Steam 官方云同步说明（资料来源），不要急于选择覆盖方向。',
      },
      {
        id: 'step-2',
        title: '复制到新的日期文件夹，保留旧备份',
        actions: [
          '新建外层文件夹，记录游戏、设备和日期时间，例如 Game_PC-A_2026-10-18_1800。使用 Ctrl+C、Ctrl+V 复制已确认的存档目录，保留内部文件名和结构。不要剪切，保留当前原件。',
          '每次备份使用新的外层日期文件夹，另存一份已知正常的旧版本。最新文件也可能包含不希望保留的进度。记录游戏版本、商店/账号对应关系及所需 MOD，但不要公开账号标识。',
          '备份目的地应位于游戏活动存档目录和同步目录之外。独立物理设备能降低原硬盘故障造成的损失；同一硬盘上的另一文件夹不能防止硬盘故障。不要把唯一副本移到移动设备，也不要在复制时拔出设备。',
        ],
        next: '保留源文件和副本，继续步骤 3。出现复制错误或源文件无法读取时，不要认定备份完成，也不要删除源文件重新开始。',
      },
      {
        id: 'step-3',
        title: '检查副本，并记录实际验证了什么',
        actions: [
          '在资源管理器中分别打开源目录和备份目录的属性，等统计完成后比较文件/文件夹数量与大小（字节）。不同存储格式的“占用空间”可能不同。打开副本，确认所需存档和配套文件都在。',
          '预期的存档为零字节、复制报错或数量/大小不同，都应先调查再恢复。数量与大小相同只能排除部分遗漏，不能证明内容完全一致。调查时保留原件及旧备份。',
          '如需对已确认的单个文件进行只读校验，可在 PowerShell 运行 Get-FileHash -LiteralPath "C:\\your-source\\actual-save-file" -Algorithm SHA256，再对备份路径运行同样命令。将示例路径替换为真实文件，比较每对文件的 Hash 值。只检查一个文件不等于核对整个目录。',
          '分别记录“已核对数量和大小”“对应文件哈希一致”或“已在匹配的游戏环境中成功载入”。哈希一致表明复制内容相同，也包括原有的损坏；不能证明存档完整、兼容或可读取。',
        ],
        next: '副本检查通过后保留它，不必为了测试健康备份立即改动当前游戏。确需恢复时，先按下面的条件准备；载入测试可能自动保存并修改活动文件。',
      },
    ],
    extraSections: [
      {
        id: 'safe-restore',
        title: '恢复之前：保全当前状态并控制同步',
        actions: [
          '只有发行商支持对应游戏、商店、账号和版本的文件恢复时才继续。不要假定可跨商店或跨账号转移。目标位置、版本或 MOD 条件不明确时，应先询问支持人员。',
          '关闭所有设备上的游戏。即使当前进度看起来不对，也先另存一份带日期的当前本地状态，并保持待恢复备份不变。出现云冲突时，先保全双方可取得的候选文件，不要为关闭弹窗随便选一项。',
          '进行受支持的恢复前，记录并在游戏属性中关闭该游戏的 Steam 云同步（若提供此项）。发行商跨平台进度、文件夹同步服务应分别按其官方说明处理，Steam 设置不一定控制它们。无法安全阻止自动覆盖时，不要替换文件。',
          '退出启动器，按发行商恢复流程把选定备份的工作副本放入确认过的活动位置。独立保留恢复前快照，不要混合不同时间的文件，也不要删除整个用户数据目录。不要直接操作唯一保留副本。',
          '保持同步受控，查看载入界面的角色、槽位和进度。启动和载入可能自动保存，因此独立副本必须提前存在。进度不对时关闭游戏，保留快照，不要换设备启动或连续猜测。',
          '确认目标进度后退出游戏，再备份这份已确认的本地状态。不要立刻恢复同步并接受不明的上传/下载提示。依据 Steam 与发行商说明核对版本；覆盖方向不清楚时保留所有候选文件并求助。',
        ],
      },
    ],
    cautions: [
      '不要删除存档、清空 Steam userdata 或修改云同步元数据来强制制造冲突。',
      '不要覆盖唯一正常备份，不要只按最新时间判断进度，也不要运行批量恢复脚本。',
      '仅存在服务器上的进度可能无法通过复制本地文件恢复，应询问发行商实际支持的备份方式。',
    ],
    faqs: [
      {
        question: 'Steam 云同步能代替日期备份吗？',
        answer:
          '不能。同步当前状态与保留某个历史状态是不同用途。更新、调整 MOD 和修复前，应保留独立快照，尤其是在目标状态可能被覆盖时。',
      },
      {
        question: '哈希一致就表示游戏能读取吗？',
        answer:
          '不能。哈希比较的是文件内容，不是游戏兼容性或存档是否有效。完整复制损坏的存档，得到的仍然是损坏存档。请只记录实际完成的检查。',
      },
      {
        question: '需要立刻恢复一次来测试正常备份吗？',
        answer:
          '不一定。恢复或载入测试可能改变活动数据。只有在有官方支持的方案、当前状态的独立副本，并能控制相关同步机制时，才考虑这种测试。',
      },
    ],
    sources: urls.map((url, i) => ({
      url,
      label: [
        'CD PROJEKT RED：Windows 存档位置（英文）',
        '星露谷物语官方：存档位置与配套文件（英文）',
        'Microsoft：Get-FileHash 内容校验（英文）',
        'Steam：云冲突与同步（英文）',
        'Steamworks：单个游戏的云设置（英文）',
      ][i],
    })),
    related: [
      {
        href: '/en/guide/steam-cloud-sync-error',
        label: 'Steam 云冲突：选择版本前保全文件（英文）',
      },
      {
        href: '/en/gear/save-backup-storage-guide',
        label: '选择独立备份存储位置（英文）',
      },
    ],
  },
  {
    ...base,
    locale: 'es',
    category: 'Protección y recuperación de partidas',
    title:
      'Copias de seguridad de partidas de PC: localizar, comprobar y restaurar',
    shortTitle: 'Copias y restauración de partidas',
    description:
      'Protege las partidas de PC antes de actualizar o reparar. Localiza los archivos, comprueba la copia y conserva el estado actual antes de restaurar o resolver un conflicto de nube.',
    lead: 'Para partidas locales de Windows. Copiar la instalación del juego no siempre copia las partidas. Steam Cloud sincroniza los datos compatibles, pero no garantiza recuperar cualquier versión anterior.',
    summary:
      'Si la partida está bien, guarda, cierra el juego, deja terminar la sincronización normal y sal del lanzador. Copia la carpeta confirmada a una nueva carpeta con fecha sin mover el original. Si ya falta progreso o hay un conflicto, conserva primero los archivos disponibles; no abras el juego ni reintentes la sincronización. Una copia idéntica no demuestra que el juego pueda cargarla.',
    sourcePolicy:
      'Adaptación de la guía japonesa y su edición inglesa revisada. Las fuentes oficiales respaldan las ubicaciones y el funcionamiento de las herramientas; el orden de conservación y las condiciones de decisión son recomendaciones editoriales. No se garantiza la recuperación. Confirma las instrucciones para tu juego, tienda, cuenta y versión. Las fuentes enlazadas están principalmente en inglés.',
    branches: [
      {
        symptom: 'Vas a actualizar, cambiar mods o reparar',
        action:
          'Identifica la ubicación correcta mientras la partida sigue bien.',
        step: 'step-1',
      },
      {
        symptom: 'Falta progreso o aparece un conflicto de nube',
        action:
          'Evita nuevos guardados y decisiones de sincronización; conserva los candidatos.',
        step: 'step-1',
      },
      {
        symptom: 'Tienes una copia, pero no sabes si está completa',
        action: 'Compara la estructura y el contenido.',
        step: 'step-3',
      },
      {
        symptom: 'Necesitas restaurar una copia anterior',
        action:
          'Lee las condiciones de restauración antes de sustituir archivos.',
        step: 'safe-restore',
      },
    ],
    steps: [
      {
        id: 'step-1',
        title:
          'Identifica la partida y cierra los programas que escriben en ella',
        actions: [
          'Si el progreso está bien, guarda normalmente y cierra el juego. Deja terminar su sincronización habitual y sal del lanzador. Cierra también ese juego en los demás dispositivos. Copiar mientras se escribe puede producir un conjunto incoherente de archivos.',
          'Si ya falta progreso, hay corrupción o un conflicto, no crees una partida, no abras el juego para comprobarlo ni reintentes primero la sincronización. Conserva por separado los archivos locales restantes de cada dispositivo. Abrir o cargar puede activar el guardado automático sin pulsar Guardar.',
          'Consulta la ubicación oficial para tu usuario de Windows, edición y tienda. El soporte de Cyberpunk 2077 indica %USERPROFILE%\\Saved Games\\CD Projekt Red\\Cyberpunk 2077 en Windows. Conserva la estructura de las carpetas de partidas; el ejecutable o una captura no la sustituyen.',
          'La guía oficial de Stardew Valley indica %APPDATA%\\StardewValley\\Saves en Windows. Conserva toda la carpeta del personaje: el archivo del mismo nombre, SaveGameInfo y los archivos _old que existan. No los renombres ni edites al copiar. Otros juegos pueden organizar los datos de otra forma.',
        ],
        next: 'Si no conoces la cuenta, edición o archivos necesarios, detente y consulta al editor. Con los datos identificados y el juego cerrado, sigue con el PASO 2. Si hay un conflicto, consulta primero la documentación de Steam Cloud enlazada en las fuentes, sin elegir todavía qué sobrescribir.',
      },
      {
        id: 'step-2',
        title:
          'Copia a una carpeta nueva con fecha sin reemplazar copias anteriores',
        actions: [
          'Crea una carpeta exterior con juego, dispositivo y fecha/hora, por ejemplo Game_PC-A_2026-10-18_1800. Copia dentro la carpeta confirmada con Ctrl+C y Ctrl+V, manteniendo nombres y estructura internos. Usa Copiar, no Cortar, y conserva el original activo.',
          'Para cada copia nueva, crea otra carpeta exterior con fecha. Mantén aparte una versión anterior que sepas que funcionaba: el archivo más reciente puede contener un cambio no deseado. Anota versión, tienda/cuenta y mods necesarios sin publicar identificadores de cuenta.',
          'Elige un destino fuera de las carpetas activas de partidas y sincronización. Otro dispositivo físico protege frente al fallo de la unidad original; otra carpeta en esa misma unidad no. No traslades la única copia a un dispositivo extraíble ni lo desconectes durante la transferencia.',
        ],
        next: 'Mantén intactos el origen y el destino y continúa con el PASO 3. Un error de copia o de lectura impide dar la copia por completa; no borres el origen para empezar de cero.',
      },
      {
        id: 'step-3',
        title: 'Comprueba la copia y anota qué has verificado',
        actions: [
          'Abre por separado las Propiedades de las carpetas de origen y destino en el Explorador. Espera a que termine el recuento y compara archivos/carpetas y Tamaño en bytes. Tamaño en disco puede variar por el formato de almacenamiento. Abre la copia y busca los archivos de partida y sus acompañantes.',
          'Investiga antes de restaurar si un archivo esperado tiene cero bytes, aparece un error o difieren cantidades y tamaños. Que coincidan detecta algunas omisiones, pero no demuestra contenido idéntico. Conserva el original y las copias anteriores mientras investigas.',
          'Como comprobación opcional de solo lectura, ejecuta en PowerShell Get-FileHash -LiteralPath "C:\\your-source\\actual-save-file" -Algorithm SHA256 y repítelo con la ruta de la copia. Sustituye las rutas de ejemplo por archivos reales y compara los campos Hash de cada pareja. Comprobar un archivo no verifica toda la carpeta.',
          'Distingue entre “cantidades y tamaños comprobados”, “hashes de archivos correspondientes iguales” y “carga correcta en el entorno de juego correspondiente”. Un hash igual confirma el contenido copiado, incluida una corrupción previa; no demuestra integridad, compatibilidad ni que la partida cargue.',
        ],
        next: 'Si las comprobaciones pasan, conserva la copia sin cambiar el juego activo solo para probarla. Si necesitas restaurar, prepara primero las condiciones siguientes: una prueba de carga puede modificar archivos mediante guardado automático.',
      },
    ],
    extraSections: [
      {
        id: 'safe-restore',
        title:
          'Antes de restaurar: conserva el estado actual y controla la sincronización',
        actions: [
          'Continúa solo si el editor admite restaurar archivos para ese juego, tienda, cuenta y versión. No supongas compatibilidad entre tiendas o cuentas. Si dudas del destino, la versión o los mods necesarios, consulta al soporte antes de sustituir archivos.',
          'Cierra el juego en todos los dispositivos. Haz una nueva copia fechada del estado local actual, aunque parezca incorrecto, y conserva intacta la copia elegida. Ante un conflicto, preserva primero ambos candidatos disponibles; no elijas uno solo para cerrar el aviso.',
          'Antes de una restauración admitida, anota y desactiva Steam Cloud para ese juego en sus Propiedades, cuando exista la opción. Comprueba por separado la progresión compartida del editor y los servicios que sincronizan carpetas: la opción de Steam no los controla necesariamente. Si no puedes evitar una sobrescritura automática con seguridad, detente.',
          'Sal del lanzador y sigue el procedimiento del editor para colocar una copia de trabajo del respaldo en la ubicación activa confirmada. Mantén aparte el estado previo. No mezcles archivos de momentos distintos ni borres todo un directorio de datos de usuario. Nunca trabajes sobre la única copia conservada.',
          'Con la sincronización aún controlada, revisa personaje, ranura y progreso en la pantalla de carga. Abrir o cargar puede guardar automáticamente, así que las copias independientes deben existir antes. Si el progreso es incorrecto, cierra el juego y conserva las copias; no pruebes en otro dispositivo ni encadenes intentos a ciegas.',
          'Tras confirmar el progreso deseado, cierra el juego y guarda una nueva copia de ese estado local. No actives inmediatamente la sincronización aceptando una subida o descarga que no entiendes. Sigue las instrucciones de Steam y del editor para reconciliar versiones; si la dirección es incierta, conserva los candidatos y pide ayuda.',
        ],
      },
    ],
    cautions: [
      'No borres partidas, vacíes Steam userdata ni edites metadatos de nube para provocar un conflicto.',
      'No sobrescribas la única copia válida, no decidas solo por la fecha más reciente y no ejecutes una restauración masiva mediante scripts.',
      'Si el progreso existe solo en servidores, copiar carpetas locales puede no recuperarlo. Consulta al editor qué puede respaldarse realmente.',
    ],
    faqs: [
      {
        question: '¿Steam Cloud sustituye a las copias con fecha?',
        answer:
          'No. Sincronizar el estado actual y conservar un momento anterior tienen objetivos distintos. Mantén copias independientes antes de actualizaciones, cambios de mods y reparaciones, sobre todo cuando el estado deseado pueda sobrescribirse.',
      },
      {
        question: '¿Un hash idéntico demuestra que la partida cargará?',
        answer:
          'No. Compara contenido, no compatibilidad ni validez de la partida. Una copia exacta de un archivo corrupto sigue estando corrupta. Describe únicamente la comprobación que has realizado.',
      },
      {
        question:
          '¿Debo restaurar enseguida para probar una copia de una partida que funciona?',
        answer:
          'No necesariamente. Restaurar o cargar puede modificar los datos activos. Considera esa prueba solo con un procedimiento admitido por el editor, una copia separada del estado actual y control de los mecanismos de sincronización.',
      },
    ],
    sources: urls.map((url, i) => ({
      url,
      label: [
        'CD PROJEKT RED: ubicación de partidas en Windows (inglés)',
        'Stardew Valley: ubicación y archivos necesarios (inglés)',
        'Microsoft: comparación de contenido con Get-FileHash (inglés)',
        'Steam: conflictos y sincronización en la nube (inglés)',
        'Steamworks: ajustes de nube por juego (inglés)',
      ][i],
    })),
    related: [
      {
        href: '/en/guide/steam-cloud-sync-error',
        label:
          'Conflictos de Steam Cloud: conserva las versiones antes de elegir (inglés)',
      },
      {
        href: '/en/gear/save-backup-storage-guide',
        label: 'Elegir un destino independiente para las copias (inglés)',
      },
    ],
  },
];
