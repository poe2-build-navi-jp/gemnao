export const windowsDiagnosisGuides = {
  zh: {
    title: 'Windows PC 游戏诊断工具：下载与使用说明',
    description:
      'Windows x64 试作诊断工具的下载、使用方法、隐私说明与限制。应用界面仅支持日语和英语。',
    home: '首页',
    download: '下载前请先阅读',
    caution:
      '这是未签名的试作版。新版本尚未在 Windows 实机上验证，不能保证支持所有游戏、确定故障原因或解决问题。不会自动修复或更改 PC 设置。',
    language:
      '默认下载仍为 v0.6.0。EXE 选择指引、结果摘要及经本人同意的非公开接收用 JSON 导出仍是候选功能，接收尚未启用，也尚待 Windows 实机验证，不包含在默认下载中。本页为中文说明；v0.6.0 应用界面和诊断文本仅支持日语、英语，不含中文或西班牙语。',
    requirements:
      '适用于 Windows 11 x64；Windows 10、ARM64 和 32 位版本未经验证。需要 .NET Framework 4.8 或更高版本。请先阅读 ZIP 内的说明。不要关闭 Defender、绕过 SmartScreen、添加排除项或以管理员身份强行运行；遇到拦截或无法确认来源时请停止使用。',
    get: '下载 Windows x64 ZIP',
    setup: '解压与检查',
    steps: [
      '将 ZIP 全部解压到普通文件夹，再打开 Gemnao.Diagnostics.exe。不要直接从 ZIP 内启动。',
      '选择游戏本体 EXE 和症状：无法启动、崩溃、黑屏、无响应、低 FPS 或卡顿。不确定时选择相应选项；无法访问文件时不要修改文件夹权限。',
      '一般模式查看选定游戏和本机记录；Monster Hunter Wilds Steam 版的专用检查与一般模式分开。检查结果是线索，不是原因确认。工具不会自动测量 FPS。',
      '如需尝试建议，一次只改一项并记录结果。问题已解决时不要刻意复现。整机断电、蓝屏或异常发热时停止，不要反复启动游戏。',
    ],
    privacyTitle: '读取、保存与隐私',
    privacy:
      '工具会查看所选 EXE 的版本、OS、CPU、GPU、驱动、RAM、磁盘容量、相关兼容性设置和限定的 Windows 事件。不会扫描所有驱动器或读取存档、登录信息。无法取得的信息保持未知，不会自动提升权限。',
    optional:
      'Steam 附加检查需单独同意并选择 Steam 本体：仅检查固定文件的存在及隐藏属性、匹配 Steam 进程中的已知 DLL 名称和位置，不读取文件内容、进程内存或账号信息。Wilds 专用检查另有范围和同意步骤；CrashReport 的限定分析可能在内存中暂时展开含个人信息的转储，请先读随附说明。',
    storage:
      '应用不会自动上传、发送遥测、调用 AI 或自动更新。主动打开官方网页、保存到同步文件夹产生的通信另计。历史记录需本人同意并点击保存；仅勾选不会保存。共享文本或 JSON 只保存到本人选择的本地位置，不代表已提交给网站。保存或分享前请检查全文，输出并非完全匿名。',
    removal:
      '关闭应用即可结束。可将解压文件夹和 ZIP 移至回收站；没有安装器、常驻服务或自动启动注册。已保存历史位于 %LOCALAPPDATA%\\Gemnao\\GameDiagnosis\\history-v2.dat，不随应用文件夹一起删除。可使用应用内的历史回收站功能；单独导出的文件需分别处理。',
    more: '完整英文使用说明',
    fallback: '无需下载的游戏崩溃排查指南',
    checked:
      '说明核对：2026-10-22。依据现有日语及英语说明；不代表 Windows 实机验证。',
  },
  es: {
    title: 'Diagnóstico de juegos para Windows: descarga e instrucciones',
    description:
      'Descarga, uso, privacidad y limitaciones del prototipo para Windows x64. La aplicación solo está disponible en japonés e inglés.',
    home: 'Inicio',
    download: 'Antes de descargar',
    caution:
      'Es un prototipo sin firma digital. La nueva versión aún no se ha probado en un PC Windows real. No garantiza compatibilidad con todos los juegos, identificar la causa ni resolver el problema. No repara ni modifica los ajustes del PC automáticamente.',
    language:
      'La descarga sigue siendo v0.6.0. Las mejoras de selección del EXE, del resumen y de exportación JSON para envío privado con consentimiento están en revisión; la recepción privada no está habilitada y faltan pruebas en Windows real, y no se incluyen en la descarga predeterminada. Esta guía está en español; la interfaz y los textos de diagnóstico de v0.6.0 solo están en japonés e inglés. No incluye interfaz en español ni chino.',
    requirements:
      'Para Windows 11 x64; Windows 10, ARM64 y 32 bits no están verificados. Requiere .NET Framework 4.8 o posterior. Lee primero las instrucciones del ZIP. No desactives Defender, no eludas SmartScreen, no añadas exclusiones ni fuerces la ejecución como administrador. Si se bloquea o no puedes confirmar su procedencia, deja de usarlo.',
    get: 'Descargar ZIP para Windows x64',
    setup: 'Extraer y revisar',
    steps: [
      'Extrae todo el ZIP en una carpeta normal y abre Gemnao.Diagnostics.exe. No lo ejecutes dentro del ZIP.',
      'Selecciona el ejecutable del juego y el síntoma: no arranca, se cierra, pantalla negra, bloqueo, pocos FPS o tirones. Usa la opción de duda si corresponde. No cambies permisos para acceder a un archivo protegido.',
      'El perfil general revisa el juego seleccionado y registros locales. Las comprobaciones específicas de Monster Hunter Wilds en Steam se mantienen separadas. Los resultados son indicios, no una causa confirmada. La herramienta no mide los FPS automáticamente.',
      'Si pruebas una recomendación, cambia una sola cosa y anota el resultado. Si el juego ya funciona, no reproduzcas el fallo deliberadamente. Detente ante apagados del PC, pantallazos azules o calor anormal; no reinicies el juego repetidamente.',
    ],
    privacyTitle: 'Lectura de datos, guardado y privacidad',
    privacy:
      'Revisa la versión del EXE seleccionado, sistema operativo, CPU, GPU, controlador, RAM, capacidad de disco, ajustes de compatibilidad pertinentes y eventos de Windows limitados. No explora todas las unidades ni lee partidas o credenciales. Lo que no puede obtener queda como desconocido; no eleva permisos automáticamente.',
    optional:
      'Las comprobaciones adicionales de Steam requieren consentimiento aparte y seleccionar Steam: revisan la presencia y el atributo oculto de archivos concretos, y nombres y ubicaciones de DLL conocidas en procesos de Steam coincidentes. No leen el contenido de archivos, memoria de procesos ni cuentas. El perfil de Wilds tiene su propio alcance y consentimiento; el análisis limitado de CrashReport puede descomprimir temporalmente en memoria volcados que contengan datos personales. Lee las instrucciones incluidas.',
    storage:
      'La aplicación no sube datos, envía telemetría, llama a una IA ni se actualiza automáticamente. Abrir páginas oficiales o guardar en carpetas sincronizadas puede generar comunicaciones por separado. Guardar el historial requiere consentimiento y pulsar el botón de guardar; marcar una casilla no basta. Exportar texto o JSON solo guarda un archivo local donde elijas, no lo envía al sitio. Revisa todo el contenido antes de guardar o compartir: no es completamente anónimo.',
    removal:
      'Cierra la aplicación para terminar. Puedes enviar la carpeta extraída y el ZIP a la papelera; no hay instalador, servicio residente ni registro de inicio automático. El historial guardado está en %LOCALAPPDATA%\\Gemnao\\GameDiagnosis\\history-v2.dat y no se borra al quitar la carpeta de la aplicación. Usa la función de la aplicación para enviar el historial a la papelera; los archivos exportados se gestionan por separado.',
    more: 'Guía completa en inglés',
    fallback: 'Guía de cierres inesperados sin descargar aplicaciones',
    checked:
      'Guía revisada: 2026-10-22, a partir de las instrucciones existentes en japonés e inglés. No equivale a una prueba en un PC Windows real.',
  },
} as const;
