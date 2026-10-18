import type { TranslatedCommonGuide } from './save-guides-zh-es';
const base = {
  slug: 'steam-game-not-launching',
  path: '/guide/steam-game-not-launching',
  topic: 'launch' as const,
  checkedAt: '2026-10-18',
};
const urls = [
  'https://help.steampowered.com/en/faqs/view/5814-D9A3-BE42-62DF',
  'https://help.steampowered.com/en/faqs/view/0C48-FCBD-DA71-93EB',
  'https://help.steampowered.com/en/faqs/view/6AD7-820D-8BE5-E51F',
  'https://support.microsoft.com/en-us/windows/experience/system-configuration-tools-in-windows',
  'https://support.microsoft.com/en-us/windows/security/windows-security/protection-history-in-the-windows-security-app',
];
export const launchGuidesZhEs: TranslatedCommonGuide[] = [
  {
    ...base,
    locale: 'zh',
    category: 'PC 游戏通用排障',
    title: 'Steam 游戏无法启动：没有反应、启动报错或重新显示“开始游戏”',
    shortTitle: 'Steam 游戏无法启动',
    description:
      '区分 Steam 启动报错、点击无反应和启动后退出。保留存档，按错误检查文件与 Windows 记录，再根据结果选择下一步。',
    lead: '适用于 Windows 上的 Steam 游戏。先观察只点击一次开始游戏后发生什么。其他启动器的登录失败、持续黑屏和游戏进程退出，需要不同检查。',
    summary:
      '记录完整错误，以及按钮是否从开始游戏变为停止后又恢复。多个游戏失败时先检查 Steam 和电脑；单个游戏失败时检查文件与配置要求；立即退出时核对 Windows 中同一时刻的记录。每次只比较一项变化，保留存档并保持安全防护开启。',
    sourcePolicy:
      '根据日文原稿和已核对的英文版改写。Steam 与 Microsoft 官方资料支持相关操作；症状分组与比较顺序是编辑建议，不是确诊或修复保证。以下资料为英文。',
    branches: [
      {
        symptom: '点击没有反应，其他游戏也一样',
        action: '确认下载与同步后正常重启。',
        step: 'step-2',
      },
      {
        symptom: '缺少可执行文件或显示详细错误',
        action: '记录完整提示，比较文件验证和保护历史。',
        step: 'step-2',
      },
      {
        symptom: '短暂显示运行中，然后恢复开始游戏',
        action: '按退出时间核对应用程序记录。',
        step: 'step-3',
      },
      {
        symptom: '第三方启动器要求登录',
        action: '检查商店要求与该启动器官方帮助，不要猜测解绑账号。',
        step: 'step-1',
      },
    ],
    steps: [
      {
        id: 'step-1',
        title: '改动前先确定启动状态',
        actions: [
          '如果从未在这台电脑成功运行，先比较 Steam 商店列出的操作系统和最低配置。重装不能让不受支持的配置自动达标。',
          '只点击一次开始游戏，记录时间、完整错误、启动器名称，以及窗口是否出现或关闭。Steam 提示已运行时，可用 Ctrl+Shift+Esc 查看任务管理器，但先寻找被遮住的游戏或启动器窗口。',
          '如有其他已安装的 Steam 游戏，比较是否也无法启动，记录单个或多个游戏受影响。不要中断保存、下载或云同步来重复测试。',
        ],
        next: '没有反应或启动报错时进入步骤 2；立即退出时进入步骤 3。窗口持续黑屏时，向支持人员明确说明这一差别。',
      },
      {
        id: 'step-2',
        title: '正常重启后，只检查与错误相符的项目',
        actions: [
          'Steam 本身或多个游戏无反应时，等待下载和正常云同步完成，正常退出 Steam 并重启 Windows，再尝试启动一次。仍失败时按 Steam 官方的 Windows/驱动更新说明处理，只用硬件厂商或电脑制造商渠道，不用第三方驱动工具。',
          '缺少可执行文件或只有一个游戏失败时，先关闭游戏。在 Steam 库打开该游戏属性，进入已安装文件并验证文件完整性，等待验证及下载结束。不要同时验证多个游戏。',
          '文件再次消失或出现安全提示时，打开 Windows 安全中心的保护历史，匹配文件路径与时间。不明确的文件继续保持阻止，向发行商或安全软件厂商核实。不要关闭防护、添加宽泛排除项或下载替代 DLL。',
          '可正常关闭一个非安全类录制/叠加应用后比较。MOD 按原管理器或安装记录处理，不要只按 DLL 名称删除文件。先保全存档，原版测试时不要覆盖依赖 MOD 的存档。',
        ],
        next: '能够启动时记录改善前的单项变化，并在同样条件下比较；仍退出或恢复开始游戏时进入步骤 3。文件反复缺失需要调查，不要无限重复验证。',
      },
      {
        id: 'step-3',
        title: '退出时查看相符的 Windows 记录',
        actions: [
          '在开始菜单搜索事件查看器，进入 Windows 日志中的应用程序，比较退出时间附近的记录。记录应用名称和错误详情；附近其他程序的事件不能证明是该游戏的问题。',
          '故障模块名称只是线索，不能证明 Windows DLL 或硬件损坏，不要按名称替换系统文件。没有匹配记录时仍保留现象与时间；无事件也不能排除游戏问题。',
        ],
        next: '可按相关的崩溃指南区分启动、载入与长时间游玩。原因仍不明时，按步骤 4 整理记录，不要尝试无关改动。',
      },
      {
        id: 'step-4',
        title: '复测结果或准备支持请求',
        actions: [
          '每次改变后使用同样的启动方式、存档与载入位置。记录“本次成功启动”“相同失败”或新的错误。一次成功不能证明永久修复。',
          '无改善时先恢复可逆设置，再比较下一项。之后要重装或处理文件前，将存档备份到游戏目录之外；Steam 云同步不能替代独立副本。',
          '单个游戏失败时，向其官方支持提供版本、Windows/GPU 版本、完整错误、时间、其他游戏对比和已尝试步骤。多个游戏或 Steam 客户端失败时联系 Steam 支持。公开内容中去除账号信息和个人路径。',
        ],
        next: '使用下方官方资料或相关崩溃指南，保留排障记录。不要把没有变化的同一诊断重复作为新结果提交。',
      },
    ],
    cautions: [
      '不要将删除存档、Steam userdata、整个 MOD 文件夹或 Windows DLL 作为通用启动修复。',
      '没有适用的官方流程时，不要关闭杀毒、防火墙或反作弊，也不要解绑账号、修改注册表或 BIOS。',
      '清除下载缓存针对下载问题，不适合所有启动失败，并需要重新登录；考虑前先阅读 Steam 说明。',
    ],
    faqs: [
      {
        question: '验证替换了文件就证明找到了原因吗？',
        answer:
          '不能。应另行比较下次启动。Steam 说明部分本地配置可能无法通过验证，该提示本身不证明损坏。同样文件反复消失时，核对保护历史并联系支持。',
      },
      {
        question: '在 Steam 买的游戏要求其他启动器，是错误吗？',
        answer:
          '部分游戏确实要求其他账号或启动器。检查 Steam 商店列出的要求和发行商帮助，保留完整错误，不要为了验证猜测而解绑账号。',
      },
      {
        question: '应该先重装再检查错误吗？',
        answer:
          '先记录现象并进行相关检查。重装耗时，也可能留下额外添加的文件。重装前保全本地存档及依赖 MOD 的存档。',
      },
    ],
    sources: urls.map((url, i) => ({
      url,
      label: [
        'Steam：准备启动后无法运行（英文）',
        'Steam：验证游戏文件（英文）',
        'Steam：清除下载缓存（英文）',
        'Microsoft：任务管理器与事件查看器（英文）',
        'Microsoft：保护历史与不确定检测（英文）',
      ][i],
    })),
    related: [
      { href: '/zh/guide/save-data-backup', label: '改动前保全存档' },
      {
        href: '/zh/guide/steam-cloud-sync-error',
        label: '云警告：选择前保护候选文件',
      },
      { href: '/zh/guide/pc-game-crash', label: '游戏退出到桌面：按时机检查' },
      {
        href: '/zh/guide/verify-steam-files',
        label: '验证文件并判断结果',
      },
      { href: '/en/guide/black-screen', label: '窗口持续黑屏（英文）' },
    ],
  },
  {
    ...base,
    locale: 'es',
    category: 'Problemas comunes de juegos de PC',
    title:
      'Un juego de Steam no arranca: sin respuesta, error o vuelta a Jugar',
    shortTitle: 'El juego de Steam no arranca',
    description:
      'Distingue un error de inicio, la falta de respuesta y un juego que se cierra enseguida. Conserva las partidas, comprueba archivos y registros de Windows y decide según el resultado.',
    lead: 'Para juegos de Steam en Windows. Observa qué ocurre tras pulsar Jugar una vez. Un fallo de acceso en otro lanzador, una ventana negra que permanece abierta y un juego que se cierra requieren comprobaciones distintas.',
    summary:
      'Anota el error completo y si Jugar cambia a Detener y vuelve a Jugar. Si fallan varios juegos, empieza por Steam y el PC; si falla uno, revisa archivos y requisitos. Si se cierra enseguida, busca un registro de Windows a esa hora. Compara un cambio cada vez, conservando partidas y protección de seguridad.',
    sourcePolicy:
      'Adaptación de la guía japonesa y su edición inglesa revisada. Las fuentes oficiales de Steam y Microsoft respaldan los procedimientos; la agrupación de síntomas y el orden de comparación son recomendaciones editoriales, no un diagnóstico ni una garantía. Las fuentes están en inglés.',
    branches: [
      {
        symptom: 'Jugar no responde, tampoco en otros juegos',
        action: 'Comprueba descargas y sincronización y reinicia normalmente.',
        step: 'step-2',
      },
      {
        symptom: 'Falta el ejecutable o aparece un error detallado',
        action:
          'Anota el aviso y compara verificación e historial de protección.',
        step: 'step-2',
      },
      {
        symptom: 'Se ejecuta brevemente y vuelve a Jugar',
        action: 'Busca registros de aplicación a la hora del cierre.',
        step: 'step-3',
      },
      {
        symptom: 'Otro lanzador pide iniciar sesión',
        action:
          'Consulta los requisitos de la tienda y la ayuda oficial; no desvincules cuentas por intuición.',
        step: 'step-1',
      },
    ],
    steps: [
      {
        id: 'step-1',
        title: 'Identifica el estado de inicio antes de cambiar nada',
        actions: [
          'Si nunca funcionó en ese PC, compara el sistema operativo y los requisitos mínimos de la tienda de Steam con el equipo. Reinstalar no convierte una configuración no admitida en compatible.',
          'Pulsa Jugar una vez. Anota hora, error completo, nombre del lanzador y si aparece o se cierra una ventana. Usa Ctrl+Mayús+Esc para consultar el Administrador de tareas si Steam dice que sigue ejecutándose, pero busca primero una ventana oculta del juego o lanzador.',
          'Prueba otro juego de Steam ya instalado, si lo tienes, y registra si falla uno o varios. No interrumpas guardados, descargas ni sincronizaciones para repetir la prueba.',
        ],
        next: 'Sin respuesta o con error de inicio: PASO 2. Si se cierra inmediatamente: PASO 3. Si la ventana permanece negra, indica esa diferencia al soporte.',
      },
      {
        id: 'step-2',
        title:
          'Reinicia normalmente y comprueba solo lo relacionado con el error',
        actions: [
          'Si Steam o varios juegos no responden, deja terminar descargas y sincronización normal, sal de Steam y reinicia Windows. Prueba un inicio más. Si falla, sigue la orientación oficial de Steam sobre actualizaciones de Windows y controladores, usando el fabricante del equipo o hardware, no herramientas de controladores de terceros.',
          'Si falta el ejecutable o solo falla un juego, ciérralo. En la biblioteca abre sus Propiedades, Archivos instalados y la verificación de integridad. Espera a que terminen la verificación y las descargas. No verifiques varios juegos a la vez.',
          'Si vuelven a desaparecer archivos o aparece un aviso de seguridad, abre el Historial de protección de Seguridad de Windows y compara ruta y hora. Mantén bloqueados los archivos dudosos y pide al editor o proveedor de seguridad que los verifique. No desactives la protección, añadas exclusiones amplias ni descargues DLL de reemplazo.',
          'Puedes cerrar normalmente una aplicación de grabación o superposición que no sea de seguridad y comparar. Para mods usa su gestor o registro de instalación; no borres archivos solo por su nombre DLL. Conserva las partidas y no sobrescribas una que dependa de mods durante una prueba sin ellos.',
        ],
        next: 'Si arranca, anota el único cambio anterior a la mejora y compara en las mismas condiciones. Si vuelve a cerrarse o a Jugar, sigue con el PASO 3. La desaparición repetida de archivos requiere investigación, no verificaciones interminables.',
      },
      {
        id: 'step-3',
        title: 'Consulta el registro de Windows que coincida con el cierre',
        actions: [
          'Busca Visor de eventos en Inicio y abre Registros de Windows, Aplicación. Compara los eventos próximos al cierre y anota aplicación y detalles del error. Un evento cercano de otro programa no es evidencia sobre este juego.',
          'El módulo con errores es una pista, no prueba de una DLL de Windows o hardware dañado. No sustituyas archivos del sistema por su nombre. Si no hay registro coincidente, conserva comportamiento y hora; la ausencia de eventos no descarta un problema del juego.',
        ],
        next: 'La guía de cierres distingue inicio, carga y sesiones largas. Si no se aclara la causa, prepara el registro del PASO 4 en vez de probar cambios sin relación.',
      },
      {
        id: 'step-4',
        title: 'Repite la comprobación o prepara una solicitud de ayuda',
        actions: [
          'Compara el mismo inicio, partida y punto de carga tras cada cambio. Anota “arrancó esta vez”, “mismo fallo” o el nuevo error. Una ejecución correcta no demuestra una solución permanente.',
          'Si no mejora, restaura los ajustes reversibles antes de la siguiente comparación. Antes de reinstalar o manipular archivos, copia las partidas fuera de la carpeta del juego; Steam Cloud no sustituye una copia independiente.',
          'Si falla un juego, facilita a su soporte oficial edición, versiones de Windows/GPU, error completo, hora, comparación con otros juegos y pasos intentados. Para varios juegos o errores del cliente, acude a Steam Support. Elimina datos de cuenta y rutas personales de lo que publiques.',
        ],
        next: 'Consulta las fuentes oficiales o la guía de cierres. Conserva el registro y no envíes repetidamente un diagnóstico sin cambios como si fuera un resultado nuevo.',
      },
    ],
    cautions: [
      'No borres partidas, Steam userdata, carpetas enteras de mods ni DLL de Windows como arreglo genérico.',
      'No desactives antivirus, cortafuegos o antitrampas, desvincules cuentas ni cambies registro o BIOS sin un procedimiento oficial pertinente.',
      'Vaciar la caché de descargas sirve para problemas de descarga, no para cualquier fallo de inicio, y requiere volver a iniciar sesión. Consulta primero las instrucciones de Steam.',
    ],
    faqs: [
      {
        question: '¿Que la verificación reemplace archivos demuestra la causa?',
        answer:
          'No. Compara el siguiente inicio por separado. Steam indica que algunos archivos de configuración local pueden no superar la verificación; ese aviso no demuestra daño por sí solo. Si desaparecen otra vez, compara el historial de protección y pide ayuda.',
      },
      {
        question:
          '¿Es un error que un juego comprado en Steam pida otro lanzador?',
        answer:
          'Algunos requieren otra cuenta o lanzador. Consulta los requisitos de su tienda de Steam y la ayuda del editor. Conserva el error y no desvincules cuentas para probar una suposición.',
      },
      {
        question: '¿Conviene reinstalar antes de comprobar el error?',
        answer:
          'Primero registra el comportamiento y realiza las comprobaciones pertinentes. Reinstalar lleva tiempo y puede dejar archivos añadidos. Conserva las partidas locales y las dependientes de mods antes de hacerlo.',
      },
    ],
    sources: urls.map((url, i) => ({
      url,
      label: [
        'Steam: el juego no se ejecuta tras preparar el inicio (inglés)',
        'Steam: verificar archivos del juego (inglés)',
        'Steam: borrar la caché de descargas (inglés)',
        'Microsoft: Administrador de tareas y Visor de eventos (inglés)',
        'Microsoft: historial de protección y detecciones dudosas (inglés)',
      ][i],
    })),
    related: [
      {
        href: '/es/guide/save-data-backup',
        label: 'Conserva las partidas antes de cambiar archivos',
      },
      {
        href: '/es/guide/steam-cloud-sync-error',
        label: 'Avisos de nube: conserva los candidatos antes de elegir',
      },
      {
        href: '/es/guide/pc-game-crash',
        label: 'Cierres al escritorio según el momento del fallo',
      },
      {
        href: '/es/guide/verify-steam-files',
        label: 'Verificar archivos e interpretar el resultado',
      },
      {
        href: '/en/guide/black-screen',
        label: 'Ventana negra que permanece abierta (inglés)',
      },
    ],
  },
];
