import type { LocalizedArticle } from './types';

// Same seven step IDs as the existing Japanese guide; no new game-specific fixes.
const sourceUrls = [
  'https://store.steampowered.com/app/2288340/',
  'https://enso-order.acecombat.jp/',
  'https://steamcommunity.com/app/2288340/allnews/',
  'https://help.steampowered.com/en/faqs/view/0C48-FCBD-DA71-93EB',
];
const common = {
  gameSlug: 'ace-combat-8',
  gameName: 'ACE COMBAT 8',
  slug: 'not-launching',
  checkedAt: '2026-10-04',
};

export const aceCombatLaunchArticles: LocalizedArticle[] = [
  {
    ...common,
    locale: 'en',
    title:
      'ACE COMBAT 8 Not Launching or Crashing on PC: Requirements and Official Checks',
    shortTitle: 'Not launching or crashing',
    description:
      'Check Windows 11, hardware ray tracing, SSD space and the publisher’s driver and virtual-memory advice. Separate launch crashes from ST-3100001 online disconnections.',
    lead: 'For the PC/Steam version failing to start, closing at launch, getting stuck loading or crashing in flight. These are source-based checks, not fixes verified on our own gaming PC.',
    summary:
      'Check the minimum requirements first: Windows 11, an SSD, a hardware ray tracing GPU and DirectX 12 with Shader Model 6.6. For a PC that meets them, the September 29 publisher notice recommends the driver indicated at launch, at least 16 GB free on the installation SSD, and enabled Windows virtual memory. Change one condition at a time and repeat the same scene. ST-3100001 is a separate online connection check.',
    sourcePolicy:
      'Requirements and the September 29–October 2, 2026 notices were rechecked on October 4. The publisher was investigating crashes in those notices; these checks are not a universal fix or evidence that a later update solved them. File verification and one-at-a-time comparisons are general troubleshooting, not confirmed causes for your PC. Follow newer publisher guidance.',
    quickFacts: [
      {
        label: 'Required',
        value:
          'Windows 11; SSD; hardware ray tracing; DirectX 12 with Shader Model 6.6 or later',
      },
      {
        label: 'Minimum GPU / RAM',
        value:
          'RTX 2060 6 GB or RX 6600 XT 8 GB; 16 GB RAM. The store’s 1080p/Low/30 FPS estimate uses upscaling.',
      },
      {
        label: 'Storage: two different numbers',
        value:
          '150 GB required for installation. The crash notice also recommends keeping at least 16 GB free on that SSD after installation.',
      },
      {
        label: 'Recommended RAM',
        value:
          '32 GB. Meeting requirements does not guarantee a crash-free session.',
      },
    ],
    diagnosis: [
      {
        symptom: 'An older GPU or an OS other than Windows 11',
        cause: 'Compare the actual PC against the minimum requirements',
        stepId: 'step-1',
      },
      {
        symptom: 'Installed on an HDD, or storage is nearly full',
        cause: 'Check the installation drive and remaining SSD space',
        stepId: 'step-3',
      },
      {
        symptom: 'Crashes despite meeting the requirements',
        cause:
          'Check the recommended driver; a crash alone does not prove the driver is at fault',
        stepId: 'step-4',
      },
      {
        symptom: 'Closes after an update or while an overlay is running',
        cause: 'Verify files, then compare overlays separately',
        stepId: 'step-5',
      },
      {
        symptom: 'Crashes during play',
        cause: 'Check virtual memory and compare graphics load',
        stepId: 'step-6',
      },
      {
        symptom: 'ST-3100001 while playing online',
        cause:
          'Check Windows clock synchronization before repeating crash fixes',
        stepId: 'step-7',
      },
    ],
    steps: [
      {
        id: 'step-1',
        title: 'Check GPU requirements',
        summary:
          'Hardware ray tracing support is required by the official minimum specification.',
        time: 'About 2 minutes',
        risk: 'low',
        actions: [
          'Open Task Manager with Ctrl + Shift + Esc, choose Performance → GPU and record the model.',
          'Compare it with the Steam requirements, including RTX 2060 6 GB / RX 6600 XT 8 GB and DirectX 12 Shader Model 6.6. A settings edit does not make unsupported hardware meet the specification.',
        ],
      },
      {
        id: 'step-2',
        title: 'Check Windows 11',
        summary: 'The minimum OS is Windows 11.',
        time: 'About 1 minute',
        risk: 'low',
        actions: [
          'Press Windows + R, enter winver and read the Windows edition.',
          'If the PC does not meet the OS requirement, confirm its supported upgrade options before changing the system. Do not reinstall Windows as the first crash fix.',
        ],
      },
      {
        id: 'step-3',
        title: 'Check the SSD and remaining space',
        summary:
          'Installation space and the additional free-space recommendation are different checks.',
        time: 'Depends on the amount of data moved',
        risk: 'low',
        actions: [
          'Use Steam’s storage management to confirm the game’s installation drive. If moving it, choose an SSD with enough capacity and wait for Steam to finish.',
          'After installation, check remaining space on that SSD. The September 29 notice recommends 16 GB or more free; this does not replace the 150 GB installation requirement.',
        ],
      },
      {
        id: 'step-4',
        title: 'Use the driver recommended by the game',
        summary:
          'The official notice refers to the recommended version shown at launch, not automatically the newest driver.',
        time: 'About 10 minutes',
        risk: 'low',
        actions: [
          'Record the current GPU driver and any recommended version shown by the game. Obtain the appropriate driver from NVIDIA or AMD’s official software or site.',
          'Restart the PC after the update and retry the same launch or scene. Record whether the symptom changed; do not assume an update guarantees stability.',
        ],
      },
      {
        id: 'step-5',
        title: 'Verify files, then compare overlays',
        summary: 'Make one change at a time so the comparison remains useful.',
        time: 'About 10 minutes',
        risk: 'low',
        actions: [
          'Steam Library → right-click the game → Properties → Installed Files → Verify integrity of game files. Wait for completion and retry.',
          'If unchanged, temporarily turn off an overlay or recording/FPS tool and retry the same scene. Restore settings that do not help. Do not disable security software or download replacement DLL files.',
        ],
      },
      {
        id: 'step-6',
        title: 'Check virtual memory and in-flight load',
        summary:
          'The publisher recommends enabled virtual memory. Lower graphics load is a comparison, not a proven diagnosis.',
        time: 'About 5 minutes',
        risk: 'low',
        actions: [
          'Windows Settings → System → About → Advanced system settings → Performance Settings → Advanced → Virtual memory. Check whether paging is enabled; automatic management avoids guessing a custom size. Record changes and restart if Windows asks.',
          'Compare one lower graphics setting or the game’s upscaling option in the same mission. Close unnecessary applications; the recommended specification lists 32 GB RAM.',
          'If extra input hardware is involved, exit the game before disconnecting it and test separately. Record the result rather than concluding that a flight stick caused the crash.',
        ],
      },
      {
        id: 'step-7',
        title: 'For ST-3100001, check Windows time',
        summary:
          'The publisher describes this as loss of communication with the game server, not a launch-crash diagnosis.',
        time: 'About 2 minutes',
        risk: 'low',
        actions: [
          'Open Settings → Time & language → Date & time and use Sync now.',
          'Restart the game and retry online play. If synchronization fails or the code remains, use the dedicated ST-3100001 guide; do not repeatedly reinstall the game.',
        ],
        guideLink: {
          href: '/en/games/ace-combat-8/error-st-3100001',
          label: 'ST-3100001: clock checks and the separate mission-end notice',
        },
      },
    ],
    avoid: [
      'Do not bypass hardware requirements with unofficial patches or replacement DLLs.',
      'Do not delete saves, reinstall Windows or permanently disable protection as a first troubleshooting step.',
    ],
    cautions: [
      'The October 2 PC Crash Report Thread requests PC specifications, Windows/system software versions, error messages, reproduction steps and other running apps. Remove account names and other private information from screenshots or logs before sharing.',
      'The September 30 flight-stick notice acknowledges missing configuration options compared with some ACE COMBAT 7 devices; it does not establish that a stick causes crashes.',
    ],
    faqs: [
      {
        question: 'Does running ACE COMBAT 7 prove my PC can run 8?',
        answer:
          'No. Compare the new requirements, especially Windows 11, hardware ray tracing, SSD and Shader Model 6.6. Prior performance does not establish compatibility.',
      },
      {
        question: 'Do I need 150 GB or 16 GB free?',
        answer:
          'The store lists 150 GB for installation. The separate crash notice recommends leaving at least 16 GB free on the installation SSD afterwards.',
      },
      {
        question: 'Is there a guaranteed crash fix?',
        answer:
          'The checked notices describe an investigation and checks that may help some environments. If the issue remains, send the publisher a specific reproduction record rather than treating a suggested check as a confirmed cause.',
      },
    ],
    related: [
      {
        href: '/en/games/ace-combat-8/error-st-3100001',
        label: 'Online error ST-3100001',
      },
      {
        href: '/en/guide/pc-game-crash',
        label: 'PC crash records and general troubleshooting',
      },
    ],
    sources: [
      'Steam: system requirements',
      'Publisher website: PC requirements (Japanese)',
      'Publisher notices: crashes, online errors and flight sticks',
      'Steam Support: verify game files',
    ].map((label, i) => ({ label, url: sourceUrls[i] })),
  },
  {
    ...common,
    locale: 'zh',
    title: 'ACE COMBAT 8 无法启动或崩溃：PC 配置与官方排查步骤',
    shortTitle: '无法启动或崩溃',
    description:
      '核对 Windows 11、硬件光线追踪、SSD 空间，以及官方建议的驱动和虚拟内存设置。区分启动崩溃与 ST-3100001 联机错误。',
    lead: '适用于 PC／Steam 版无法启动、启动后退出、加载卡住或飞行中崩溃。本文依据资料整理，并非编辑部在游戏实机上验证成功的修复记录。',
    summary:
      '先核对 Windows 11、SSD、支持硬件光线追踪的显卡及支持 Shader Model 6.6 的 DirectX 12。满足配置后，按发行商 9 月 29 日公告，检查启动时提示的推荐驱动、安装游戏的 SSD 是否仍有至少 16 GB 空闲空间，以及 Windows 虚拟内存是否启用。一次只改一项，在相同场景复测。ST-3100001 属于另一类联机通信排查。',
    sourcePolicy:
      '2026 年 10 月 4 日重新核对配置要求及 9 月 29 日至 10 月 2 日的官方公告。公告中的崩溃调查不代表后来已修复，也不保证这些检查适用于所有电脑。文件验证和逐项对比属于通用排查，不能直接认定为你的故障原因；请优先查看后续官方说明。',
    quickFacts: [
      {
        label: '必需条件',
        value:
          'Windows 11、SSD、硬件光线追踪、DirectX 12（Shader Model 6.6 或更高）',
      },
      {
        label: '最低显卡／内存',
        value:
          'RTX 2060 6 GB 或 RX 6600 XT 8 GB；16 GB 内存。官方 1080p／低画质／30 FPS 参考值使用了超分辨率。',
      },
      {
        label: '两个不同的空间数值',
        value:
          '安装需求为 150 GB；崩溃公告另建议安装后在该 SSD 保留至少 16 GB 空闲空间。',
      },
      { label: '推荐内存', value: '32 GB；满足配置不等于保证不会崩溃。' },
    ],
    diagnosis: [
      {
        symptom: '旧显卡或不是 Windows 11',
        cause: '先比较实际配置与最低要求',
        stepId: 'step-1',
      },
      {
        symptom: '装在 HDD 或空间快满了',
        cause: '检查安装盘及 SSD 剩余空间',
        stepId: 'step-3',
      },
      {
        symptom: '满足配置仍然退出',
        cause: '检查推荐驱动；崩溃本身不能证明驱动有问题',
        stepId: 'step-4',
      },
      {
        symptom: '更新后或使用叠加层时退出',
        cause: '验证文件，再单独比较叠加层',
        stepId: 'step-5',
      },
      {
        symptom: '飞行中崩溃',
        cause: '检查虚拟内存并比较画面负载',
        stepId: 'step-6',
      },
      {
        symptom: '联机出现 ST-3100001',
        cause: '先检查 Windows 时间同步',
        stepId: 'step-7',
      },
    ],
    steps: [
      {
        id: 'step-1',
        title: '核对显卡要求',
        summary: '官方最低配置要求硬件光线追踪支持。',
        time: '约 2 分钟',
        risk: 'low',
        actions: [
          '按 Ctrl + Shift + Esc 打开任务管理器，在“性能 → GPU”记录显卡型号。',
          '与 Steam 的 RTX 2060 6 GB／RX 6600 XT 8 GB 及 DirectX 12 Shader Model 6.6 要求比较。修改配置文件不能让不支持的硬件满足要求。',
        ],
      },
      {
        id: 'step-2',
        title: '确认 Windows 11',
        summary: '最低操作系统为 Windows 11。',
        time: '约 1 分钟',
        risk: 'low',
        actions: [
          '按 Windows + R，输入 winver，查看系统版本。',
          '不符合要求时先确认电脑支持的升级方案，不要把重装 Windows 当作第一步。',
        ],
      },
      {
        id: 'step-3',
        title: '检查 SSD 和剩余空间',
        summary: '安装容量与安装后保留的空闲空间是两项检查。',
        time: '取决于移动的数据量',
        risk: 'low',
        actions: [
          '在 Steam 的存储管理中确认安装盘。需要移动时选择容量足够的 SSD，并等待 Steam 完成。',
          '9 月 29 日公告建议在安装游戏的 SSD 保留至少 16 GB 空闲空间，这不替代 150 GB 安装需求。',
        ],
      },
      {
        id: 'step-4',
        title: '检查游戏提示的推荐驱动',
        summary: '官方要求的是启动时提示的推荐版本，并非无条件安装最新版本。',
        time: '约 10 分钟',
        risk: 'low',
        actions: [
          '记录当前显卡驱动及游戏提示的推荐版本，从 NVIDIA 或 AMD 官方软件或网站获取对应驱动。',
          '更新并重启电脑后，在相同场景复测。记录是否变化，不要假定更新必然有效。',
        ],
      },
      {
        id: 'step-5',
        title: '验证文件，再比较叠加层',
        summary: '一次只更改一项，便于判断结果。',
        time: '约 10 分钟',
        risk: 'low',
        actions: [
          'Steam 库中右键游戏 → 属性 → 已安装文件 → 验证游戏文件的完整性，完成后再启动。',
          '无变化时，暂时关闭一个叠加层、录制或 FPS 工具再试。无效设置应恢复；不要关闭安全防护或从第三方下载替换 DLL。',
        ],
      },
      {
        id: 'step-6',
        title: '检查虚拟内存与飞行时的负载',
        summary: '官方建议启用虚拟内存；降低画质只是对比，并非已确认的诊断。',
        time: '约 5 分钟',
        risk: 'low',
        actions: [
          'Windows 设置 → 系统 → 系统信息 → 高级系统设置 → 性能的设置 → 高级 → 虚拟内存。确认分页文件启用；自动管理可避免随意设置自定义大小。记录修改，系统提示时重启。',
          '在同一任务中单独降低一项画质或比较超分辨率设置，并关闭不需要的程序；推荐配置为 32 GB 内存。',
          '涉及额外输入设备时，先退出游戏再断开设备单独测试。不能仅凭一次变化认定飞行摇杆导致崩溃。',
        ],
      },
      {
        id: 'step-7',
        title: 'ST-3100001：同步 Windows 时间',
        summary: '官方将此错误解释为与服务器的通信中断，不等于启动崩溃。',
        time: '约 2 分钟',
        risk: 'low',
        actions: [
          '打开“设置 → 时间和语言 → 日期和时间”，选择“立即同步”。',
          '重启游戏后重新尝试联机。同步失败或错误仍存在时，查看专门的 ST-3100001 文章，不要重复重装游戏。',
        ],
        guideLink: {
          href: '/en/games/ace-combat-8/error-st-3100001',
          label: 'ST-3100001 时间检查与任务结束错误说明（英语）',
        },
      },
    ],
    avoid: [
      '不要使用非官方补丁或替换 DLL 绕过硬件要求。',
      '不要一开始就删除存档、重装 Windows 或长期关闭安全防护。',
    ],
    cautions: [
      '10 月 2 日官方崩溃报告帖要求电脑配置、系统及软件版本、错误信息、复现步骤和同时运行的程序。分享日志或截图前隐藏账号及个人信息。',
      '9 月 30 日官方确认部分飞行摇杆缺少前作的某些配置选项，这不代表摇杆就是崩溃原因。',
    ],
    faqs: [
      {
        question: '能运行 ACE COMBAT 7，就一定能运行 8 吗？',
        answer:
          '不一定。应重新核对 Windows 11、硬件光线追踪、SSD 和 Shader Model 6.6 等要求，不能用前作表现证明兼容性。',
      },
      {
        question: '需要 150 GB 还是 16 GB 空间？',
        answer:
          '150 GB 是商店列出的安装需求；16 GB 是官方崩溃公告建议安装后在该 SSD 保留的空闲空间。',
      },
      {
        question: '有保证有效的修复方法吗？',
        answer:
          '核对的公告表示正在调查，并列出可能对部分环境有效的检查。问题仍存在时应提交具体复现记录，不能将建议直接当作已确认原因。',
      },
    ],
    related: [
      {
        href: '/en/games/ace-combat-8/error-st-3100001',
        label: 'ST-3100001 联机错误（英语）',
      },
      {
        href: '/en/guide/pc-game-crash',
        label: '电脑崩溃记录与通用检查（英语）',
      },
    ],
    sources: [
      'Steam：系统要求',
      '发行商网站：PC 配置（日语）',
      '官方公告：崩溃、联机错误与飞行摇杆（英语）',
      'Steam 客服：验证游戏文件（英语）',
    ].map((label, i) => ({ label, url: sourceUrls[i] })),
  },
  {
    ...common,
    locale: 'es',
    title:
      'ACE COMBAT 8 no inicia o se cierra en PC: requisitos y comprobaciones oficiales',
    shortTitle: 'No inicia o se cierra',
    description:
      'Comprueba Windows 11, trazado de rayos por hardware, espacio SSD, controlador recomendado y memoria virtual. Distingue los cierres del error online ST-3100001.',
    lead: 'Para la versión PC/Steam que no inicia, se cierra al arrancar, se atasca al cargar o falla durante el vuelo. Son comprobaciones basadas en fuentes, no arreglos probados por nosotros en un PC de juego.',
    summary:
      'Revisa primero Windows 11, SSD, GPU con trazado de rayos por hardware y DirectX 12 con Shader Model 6.6. Si cumples los requisitos, el aviso del editor del 29 de septiembre recomienda el controlador indicado al iniciar, al menos 16 GB libres en el SSD de instalación y memoria virtual activada. Cambia una sola condición y repite la misma escena. ST-3100001 requiere una comprobación de conexión aparte.',
    sourcePolicy:
      'Los requisitos y los avisos del 29 de septiembre al 2 de octubre de 2026 se revisaron el 4 de octubre. El editor investigaba los cierres en esos avisos; no confirman una solución universal ni que una actualización posterior los haya corregido. Verificar archivos y comparar ajustes son pruebas generales, no causas demostradas en tu PC. Consulta los avisos oficiales más recientes.',
    quickFacts: [
      {
        label: 'Obligatorio',
        value:
          'Windows 11; SSD; trazado de rayos por hardware; DirectX 12 con Shader Model 6.6 o posterior',
      },
      {
        label: 'GPU / RAM mínimas',
        value:
          'RTX 2060 de 6 GB o RX 6600 XT de 8 GB; 16 GB de RAM. La referencia de 1080p/Bajo/30 FPS de la tienda utiliza reescalado.',
      },
      {
        label: 'Dos cifras de espacio distintas',
        value:
          '150 GB para instalar. El aviso de cierres recomienda además mantener 16 GB libres como mínimo en ese SSD después de instalar.',
      },
      {
        label: 'RAM recomendada',
        value:
          '32 GB. Cumplir los requisitos no garantiza una sesión sin cierres.',
      },
    ],
    diagnosis: [
      {
        symptom: 'GPU antigua o sistema distinto de Windows 11',
        cause: 'Compara el PC con los requisitos mínimos',
        stepId: 'step-1',
      },
      {
        symptom: 'Instalado en HDD o unidad casi llena',
        cause: 'Comprueba la unidad y el espacio libre del SSD',
        stepId: 'step-3',
      },
      {
        symptom: 'Se cierra aunque cumple los requisitos',
        cause:
          'Revisa el controlador recomendado; el cierre no demuestra que sea la causa',
        stepId: 'step-4',
      },
      {
        symptom: 'Se cierra tras actualizar o con una superposición',
        cause: 'Verifica archivos y compara las superposiciones por separado',
        stepId: 'step-5',
      },
      {
        symptom: 'Se cierra durante el vuelo',
        cause: 'Comprueba memoria virtual y carga gráfica',
        stepId: 'step-6',
      },
      {
        symptom: 'ST-3100001 en el modo online',
        cause: 'Comprueba la sincronización horaria de Windows',
        stepId: 'step-7',
      },
    ],
    steps: [
      {
        id: 'step-1',
        title: 'Comprueba los requisitos de la GPU',
        summary: 'Los requisitos mínimos exigen trazado de rayos por hardware.',
        time: 'Unos 2 minutos',
        risk: 'low',
        actions: [
          'Abre el Administrador de tareas con Ctrl + Mayús + Esc y anota el modelo en Rendimiento → GPU.',
          'Compáralo con los requisitos de Steam: RTX 2060 de 6 GB / RX 6600 XT de 8 GB y DirectX 12 con Shader Model 6.6. Editar un archivo no hace que un hardware incompatible cumpla el requisito.',
        ],
      },
      {
        id: 'step-2',
        title: 'Comprueba Windows 11',
        summary: 'El sistema mínimo es Windows 11.',
        time: 'Un minuto',
        risk: 'low',
        actions: [
          'Pulsa Windows + R, escribe winver y consulta la edición.',
          'Si no cumple, comprueba las opciones de actualización compatibles antes de modificar el sistema. No reinstales Windows como primer intento.',
        ],
      },
      {
        id: 'step-3',
        title: 'Revisa el SSD y su espacio libre',
        summary:
          'El espacio de instalación y el margen libre posterior son comprobaciones distintas.',
        time: 'Depende de los datos que se muevan',
        risk: 'low',
        actions: [
          'Comprueba la unidad de instalación en la gestión de almacenamiento de Steam. Para mover el juego, elige un SSD con capacidad suficiente y espera a que Steam termine.',
          'El aviso del 29 de septiembre recomienda 16 GB libres o más en ese SSD después de instalar. No sustituye los 150 GB de instalación.',
        ],
      },
      {
        id: 'step-4',
        title: 'Usa el controlador recomendado por el juego',
        summary:
          'El aviso se refiere a la versión indicada al iniciar, no necesariamente a la más nueva.',
        time: 'Unos 10 minutos',
        risk: 'low',
        actions: [
          'Anota el controlador actual y la versión recomendada que muestre el juego. Obtén el controlador adecuado desde el software o sitio oficial de NVIDIA o AMD.',
          'Reinicia el PC y repite el mismo inicio o escena. Anota el cambio; actualizar no garantiza estabilidad.',
        ],
      },
      {
        id: 'step-5',
        title: 'Verifica archivos y después compara superposiciones',
        summary: 'Cambia una sola cosa cada vez.',
        time: 'Unos 10 minutos',
        risk: 'low',
        actions: [
          'Biblioteca de Steam → clic derecho en el juego → Propiedades → Archivos instalados → Verificar integridad de los archivos. Espera a que termine y vuelve a probar.',
          'Si no cambia, desactiva temporalmente una superposición o herramienta de grabación/FPS y repite la escena. Restaura los ajustes que no ayuden. No desactives la protección ni descargues DLL de sustitución.',
        ],
      },
      {
        id: 'step-6',
        title: 'Comprueba memoria virtual y carga durante el vuelo',
        summary:
          'El editor recomienda activar la memoria virtual. Bajar gráficos es una comparación, no un diagnóstico confirmado.',
        time: 'Unos 5 minutos',
        risk: 'low',
        actions: [
          'Configuración de Windows → Sistema → Información → Configuración avanzada del sistema → Rendimiento, Configuración → Opciones avanzadas → Memoria virtual. Comprueba que la paginación esté activada; la gestión automática evita adivinar un tamaño personalizado. Anota cambios y reinicia si Windows lo pide.',
          'Compara un ajuste gráfico menor o el reescalado en la misma misión y cierra aplicaciones innecesarias. La especificación recomendada indica 32 GB de RAM.',
          'Si hay dispositivos de entrada adicionales, cierra el juego antes de desconectarlos y prueba por separado. No deduzcas que el joystick causó el cierre a partir de una sola comparación.',
        ],
      },
      {
        id: 'step-7',
        title: 'Para ST-3100001, sincroniza la hora de Windows',
        summary:
          'El editor lo describe como pérdida de comunicación con el servidor, no como diagnóstico de cierre al iniciar.',
        time: 'Unos 2 minutos',
        risk: 'low',
        actions: [
          'Abre Configuración → Hora e idioma → Fecha y hora y pulsa Sincronizar ahora.',
          'Reinicia el juego y prueba online de nuevo. Si no sincroniza o el código continúa, consulta la guía específica; no reinstales el juego repetidamente.',
        ],
        guideLink: {
          href: '/en/games/ace-combat-8/error-st-3100001',
          label:
            'ST-3100001: reloj y aviso sobre errores al finalizar misiones (inglés)',
        },
      },
    ],
    avoid: [
      'No eludas requisitos con parches no oficiales o DLL de sustitución.',
      'No borres partidas, reinstales Windows ni desactives la protección permanentemente como primer paso.',
    ],
    cautions: [
      'El hilo oficial de informes del 2 de octubre pide componentes del PC, versiones de Windows y software, errores, pasos de reproducción y otras aplicaciones abiertas. Oculta cuentas y datos personales antes de compartir capturas o registros.',
      'El aviso del 30 de septiembre reconoce opciones de configuración de ciertos joysticks ausentes respecto a ACE COMBAT 7; no demuestra que provoquen cierres.',
    ],
    faqs: [
      {
        question: '¿Si mi PC ejecuta ACE COMBAT 7 también ejecutará el 8?',
        answer:
          'No necesariamente. Revisa Windows 11, trazado de rayos por hardware, SSD y Shader Model 6.6. El rendimiento del juego anterior no demuestra compatibilidad.',
      },
      {
        question: '¿Necesito 150 GB o 16 GB libres?',
        answer:
          'La tienda indica 150 GB para instalar. El aviso de cierres recomienda mantener al menos 16 GB libres en ese SSD después de la instalación.',
      },
      {
        question: '¿Hay un arreglo garantizado?',
        answer:
          'Los avisos revisados describen una investigación y comprobaciones que pueden ayudar en algunos equipos. Si sigue fallando, comunica una reproducción concreta al editor; una sugerencia no es una causa demostrada.',
      },
    ],
    related: [
      {
        href: '/en/games/ace-combat-8/error-st-3100001',
        label: 'Error online ST-3100001 (inglés)',
      },
      {
        href: '/en/guide/pc-game-crash',
        label: 'Registros y diagnóstico general de cierres en PC (inglés)',
      },
    ],
    sources: [
      'Steam: requisitos del sistema',
      'Sitio del editor: requisitos de PC (japonés)',
      'Avisos oficiales: cierres, errores online y joysticks (inglés)',
      'Soporte de Steam: verificar archivos (inglés)',
    ].map((label, i) => ({ label, url: sourceUrls[i] })),
  },
];
