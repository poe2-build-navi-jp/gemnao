import type { TranslatedCommonGuide } from './save-guides-zh-es';
const base = {
  slug: 'steam-cloud-sync-error',
  path: '/guide/steam-cloud-sync-error',
  topic: 'launch' as const,
  checkedAt: '2026-10-18',
};
const urls = [
  'https://help.steampowered.com/en/faqs/view/68D2-35AB-09A9-7678',
  'https://partner.steamgames.com/doc/features/cloud',
  'https://store.steampowered.com/account/remotestorage',
];
export const cloudGuidesZhEs: TranslatedCommonGuide[] = [
  {
    ...base,
    locale: 'zh',
    category: '存档保护与恢复',
    title: 'Steam 云同步失败或冲突：选择版本前先保全存档',
    shortTitle: 'Steam 云同步失败与冲突',
    description:
      '先保全各设备的本地存档和可下载的云文件，再处理 Steam 云冲突。结合游玩记录判断目标进度与覆盖方向，不要只看最新时间。',
    lead: '适用于 Windows 上的 Steam 云警告。“无法同步”和需要选择本地/云端版本的冲突是不同情况。两者都不是删除文件、强制新建存档或默认选择最新时间的理由。',
    summary:
      '不要跳过同步警告启动游戏，也不要立即选择冲突版本。记录提示，分别备份各设备的本地存档，并在可用时下载云文件。核对最后一次确认正常保存的游玩记录和目标进度。如果无法确定应保留的版本及覆盖方向，保持副本不变并停止选择。',
    sourcePolicy:
      '根据日文原稿和已核对的英文版改写。Steam 官方资料支持同步行为与警告说明；保全顺序和判断示例是编辑建议，并非恢复保证。请结合具体游戏、商店和账号的官方说明。下列资料为英文，Remote Storage 需要本人登录。',
    branches: [
      {
        symptom: 'Steam 提示无法同步',
        action: '保持游戏关闭，保全本地文件后检查账号和连接。',
        step: 'step-1',
      },
      {
        symptom: '要求选择本地或云端版本',
        action: '先记录并保全双方可取得的候选文件。',
        step: 'step-1',
      },
      {
        symptom: '用过两台电脑或离线游玩',
        action: '分别整理各设备的游玩和同步记录。',
        step: 'step-2',
      },
      {
        symptom: '选了版本，但进度不对',
        action: '停止继续保存，其他设备也不要启动游戏。',
        step: 'step-4',
      },
    ],
    steps: [
      {
        id: 'step-1',
        title: '保持游戏关闭，保全所有可取得的候选文件',
        actions: [
          '记录完整警告以及显示的本地/云端时间。不要通过“继续游戏”或覆盖选择来关闭提示。Steam 提醒，在同步失败时继续游玩可能产生冲突变化并丢失进度，应先解决不确定性。',
          '游戏关闭后，按发行商资料找到存档，复制到独立的日期文件夹。多设备时，先分别保全各设备的本地数据，并标记设备名称，再考虑启动游戏。不要为了强制同步而连接并启动原本离线的设备。',
          '如果 Steam 官方 Remote Storage 页面列出该游戏的文件，在 Steam 自己的网站由本人登录，将文件下载到另一个保全文件夹。保留原文件名，并记录页面列出的路径与时间。列表为空不能单独证明进度已无法恢复。',
          '如果只是同步失败而没有版本选择，记录当前 Steam 账号、游戏是否支持云同步以及该游戏的云设置。保持游戏关闭，检查正常网络连接和官方服务公告。不要关闭安全防护、清空存档目录或反复切换云开关作为修复方法。',
        ],
        next: '保全副本后进入步骤 2。相关设备或文件无法访问时，不要认定缺失的候选版本可以丢弃；保留现有资料并联系支持人员。',
      },
      {
        id: 'step-2',
        title: '核对各设备的进度与同步记录',
        actions: [
          '只有一台电脑时，记录最后一次确认保存成功的游玩、是否离线，以及想保留的角色、槽位或章节。使用当时的截图和笔记，不要重新启动游戏获取信息，以免自动保存。',
          '有多台设备时，为每台分别记录最后游玩时间、已知进度，以及退出后是否完成同步。即使文件同名，也要分开保存本地备份。第一台尚未处理清楚时，不要在下一台启动游戏。',
          '将记录与冲突时间比较，并考虑时钟或时区差异。时间戳表示文件事件，不一定代表目标章节。后来新建的空进度也可能比要保留的存档更新；云同步状态本身也不能证明所选存档可正确载入。',
        ],
        next: '如果记录能明确指出目标版本，且其他候选文件已保全，再阅读步骤 3 的条件示例。否则应在选择任一版本前停止。',
      },
      {
        id: 'step-3',
        title: '只有明确版本与覆盖方向时才选择',
        actions: [
          '条件示例，不是通用规则：如果只在电脑 A 游玩，且确认保全的本地存档包含较新的离线进度，而云端版本早于这次游玩，本地版本可能是目标。确认哪个选项会上传或保留它，再决定是否继续。',
          '另一种情况：电脑 B 完成了目标进度并成功同步，电脑 A 的本地状态较旧，此时 A 上显示的云端版本可能是目标。判断依赖实际记录和保全副本，不是因为“云端”天然更安全。',
          '较晚时间可能对应新游戏、其他槽位、错误的自动保存或不同账号时，不要猜测。保留副本，向发行商或 Steam 支持确认文件和选项。不要删除云元数据或用空文件替换存档来制造冲突。',
          '普通同步失败在连接恢复后消失时，可能根本没有版本选择窗口。不要刻意制造一个。保留备份，只有警告已解决、预期版本明确时，才谨慎检查进度。',
        ],
        next: '能够确认目标版本及屏幕上操作的效果时，按已确认的选择处理，再进入步骤 4。方向或进度仍不明时停止；不要自动覆盖本地或云端版本。',
      },
      {
        id: 'step-4',
        title: '核对目标进度，避免把错误版本同步到其他设备',
        actions: [
          '载入前保留全部选择前的副本。在游戏提供信息的载入界面查看角色、槽位、游玩时间或章节。启动或载入可能自动保存，不按保存键也不能保证文件不变。',
          '目标进度正确时，只进行必要确认后正常退出。另存一份带日期的已确认本地状态，并在使用其他设备前确认 Steam 正常同步完成。同步成功不代表旧的独立备份已无用途。',
          '进度错误时关闭游戏，不再继续游玩，其他设备也保持关闭。将当前结果另存为有标记的新快照，不要删除原始候选文件。按备份指南和发行商支持的恢复流程处理，在替换前控制同步。',
          '向支持人员提供准确警告、平台/商店、受影响设备和时间顺序，不要公开密码、账号令牌或私密存档内容。恢复的本地文件仍可能需要匹配版本或 MOD。如果会覆盖唯一剩余副本，应停止。',
        ],
        next: '进度正确且同步完成后，每次只在一台设备继续游玩并保留备份。进度错误或不明时，保留全部候选文件并联系官方支持，不要反复选择同步或覆盖。',
      },
    ],
    cautions: [
      '不要只按最新时间、“本地”或“云端”标签决定；这些信息都不能保证目标进度。',
      '不要删除 Steam userdata、remotecache 文件、本地存档或云文件来强制重置。',
      '没有独立副本且覆盖方向不明确时，不要接受破坏性覆盖或关闭安全防护。部分游戏还有发行商独立的跨平台存档，Steam 云设置不一定控制它。',
    ],
    faqs: [
      {
        question: 'Steam 提示无法同步时可以继续玩吗？',
        answer:
          '先保持游戏关闭，保全存档并解决警告。继续游玩可能产生另一个变化版本，让后续冲突判断更困难并增加进度损失风险。',
      },
      {
        question: '本地和云端哪个总是更安全？',
        answer:
          '都不是。应结合已知游玩记录和保全的候选文件判断。文中的示例都有前提，不代表应始终上传本地或下载云端。',
      },
      {
        question: 'Remote Storage 没有文件，是否代表进度没了？',
        answer:
          '仅凭列表不能下结论。检查账号、游戏云支持和本地副本。服务器端或发行商管理的进度可能采用不同恢复流程。',
      },
      {
        question: '选错后能再选另一项撤销吗？',
        answer:
          '不要依赖这种做法。一次选择或后续自动保存可能改变可用文件。选择前保留独立副本；已经选错时，停止游玩并寻找受支持的恢复方式。',
      },
    ],
    sources: urls.map((url, i) => ({
      url,
      label: [
        'Steam：云冲突与同步失败警告（英文）',
        'Steamworks：同步与单个游戏设置（英文）',
        'Steam Remote Storage：本人登录后查看文件（英文）',
      ][i],
    })),
    related: [
      {
        href: '/zh/guide/save-data-backup',
        label: '备份核对与恢复前的停止条件',
      },
      {
        href: '/en/gear/save-backup-storage-guide',
        label: '选择独立备份存储位置（英文）',
      },
      {
        href: '/en/guide/steam-game-not-launching',
        label: '云警告解决后仍无法启动（英文）',
      },
    ],
  },
  {
    ...base,
    locale: 'es',
    category: 'Protección y recuperación de partidas',
    title:
      'Error o conflicto de Steam Cloud: conserva las partidas antes de elegir',
    shortTitle: 'Errores y conflictos de Steam Cloud',
    description:
      'Conserva las partidas locales y los archivos de nube disponibles antes de resolver un conflicto de Steam Cloud. Compara el historial de juego y confirma qué versión se sobrescribirá.',
    lead: 'Para avisos de Steam Cloud en Windows. Un fallo de sincronización y una elección entre versiones locales y de nube son situaciones distintas. Ninguna justifica borrar archivos, forzar una partida nueva o asumir que la fecha más reciente contiene el progreso deseado.',
    summary:
      'No abras el juego ignorando un aviso de sincronización ni elijas inmediatamente una versión. Anota el mensaje, conserva las partidas locales de cada dispositivo y descarga los archivos de nube cuando estén disponibles. Compara la última sesión cuyo guardado conoces y el progreso deseado. Si no identificas el candidato correcto y la dirección de sobrescritura, detente con las copias intactas.',
    sourcePolicy:
      'Adaptación de la guía japonesa y de su edición inglesa revisada. La documentación oficial de Steam respalda el comportamiento y los avisos; el orden de conservación y los ejemplos de decisión son recomendaciones editoriales, sin garantía de recuperación. Consulta las instrucciones del juego, tienda y cuenta correspondientes. Las fuentes están en inglés y Remote Storage requiere que inicies sesión personalmente.',
    branches: [
      {
        symptom: 'Steam indica que no puede sincronizar',
        action:
          'Cierra el juego, conserva los datos locales y comprueba cuenta y conexión.',
        step: 'step-1',
      },
      {
        symptom: 'Aparece una elección entre versión local y nube',
        action:
          'Registra y conserva ambos candidatos disponibles antes de elegir.',
        step: 'step-1',
      },
      {
        symptom: 'Has usado dos PC o jugado sin conexión',
        action:
          'Compara el historial real de juego y sincronización de cada equipo.',
        step: 'step-2',
      },
      {
        symptom: 'Elegiste una versión y el progreso es incorrecto',
        action:
          'Evita más guardados y deja el juego cerrado en los otros equipos.',
        step: 'step-4',
      },
    ],
    steps: [
      {
        id: 'step-1',
        title:
          'Mantén el juego cerrado y conserva todos los candidatos disponibles',
        actions: [
          'Anota el aviso completo y las fechas locales o de nube mostradas. No pulses una opción de continuar jugando o sobrescribir solo para cerrarlo. Steam advierte que jugar tras un fallo de sincronización puede crear cambios incompatibles y pérdida de progreso; aclara la situación antes de jugar.',
          'Con el juego cerrado, localiza las partidas mediante la documentación del editor y cópialas a una carpeta independiente con fecha. Si hay varios equipos, conserva primero los datos locales de cada uno, identificando el dispositivo. No conectes y abras un equipo que estaba sin conexión solo para forzar la sincronización.',
          'Si la página oficial Steam Remote Storage muestra archivos del juego, inicia sesión personalmente en el sitio de Steam y descárgalos a otra carpeta de conservación. Mantén los nombres originales y anota rutas y fechas indicadas. Una lista vacía no demuestra por sí sola que el progreso sea irrecuperable.',
          'Si solo hay un error sin elección de versiones, anota la cuenta de Steam, si el juego admite Steam Cloud y su ajuste de nube. Comprueba la conexión habitual y los avisos oficiales manteniendo el juego cerrado. No desactives la protección, vacíes carpetas de partidas ni actives y desactives Cloud repetidamente como reparación.',
        ],
        next: 'Con las copias conservadas, compara el historial en el PASO 2. Si no puedes acceder a un dispositivo o archivo relevante, no des por descartable ese candidato: conserva lo disponible y consulta al soporte.',
      },
      {
        id: 'step-2',
        title:
          'Compara el progreso y el historial de sincronización de los equipos',
        actions: [
          'Con un solo PC, anota la última sesión que sabes que guardó correctamente, si fue sin conexión y el personaje, ranura o capítulo que querías conservar. Usa capturas o notas de esa sesión, no una apertura nueva que pueda guardar automáticamente.',
          'Con varios dispositivos, registra por separado la última sesión, el progreso conocido y si la sincronización terminó al salir. Mantén separadas las copias locales aunque compartan nombres. No abras el juego en otro equipo mientras el primero siga sin aclararse.',
          'Compara esos registros con las fechas del conflicto, teniendo en cuenta relojes y zonas horarias diferentes. Una fecha describe un evento del archivo, no necesariamente el capítulo deseado. Una partida nueva posterior puede ser más reciente que tu progreso. El estado de Cloud tampoco demuestra que la partida elegida cargue bien.',
        ],
        next: 'Si el historial identifica claramente el candidato deseado y has conservado las alternativas, lee los ejemplos condicionales del PASO 3. En caso contrario, detente antes de elegir una versión.',
      },
      {
        id: 'step-3',
        title:
          'Elige solo cuando conozcas el candidato y la dirección del cambio',
        actions: [
          'Ejemplo condicionado, no regla general: si solo usaste el PC A y sabes que su copia local conservada contiene progreso posterior sin conexión, mientras que la nube es anterior a esa sesión, el candidato local puede ser el deseado. Confirma qué opción lo sube o lo conserva antes de aceptar.',
          'Otro ejemplo: si el PC B terminó la sesión deseada y sincronizó correctamente, mientras A conserva un estado local anterior, la versión de nube mostrada en A puede ser la correcta. Depende del historial real y de las copias, no de que la nube sea siempre más segura.',
          'Si una fecha posterior puede corresponder a una partida nueva, otra ranura, un autoguardado incorrecto o una cuenta distinta, no adivines. Conserva las copias y consulta al editor o a Steam Support qué archivos y opción corresponden. Nunca provoques un conflicto borrando metadatos de nube o sustituyendo archivos por datos vacíos.',
          'Un error normal que desaparece al volver la conexión puede no ofrecer ninguna elección entre candidatos. No la provoques deliberadamente. Conserva el respaldo y comprueba el progreso con cautela solo cuando el aviso esté resuelto y entiendas qué versión esperas.',
        ],
        next: 'Si identificas la versión deseada y el efecto de la acción mostrada, sigue esa elección confirmada y pasa al PASO 4. Si el progreso o la dirección siguen siendo inciertos, detente: no sobrescribas automáticamente la versión local ni la nube.',
      },
      {
        id: 'step-4',
        title: 'Comprueba el progreso y evita propagar una versión incorrecta',
        actions: [
          'Antes de cargar, conserva todas las copias previas a la selección. Revisa personaje, ranura, tiempo o capítulo en la pantalla de carga cuando el juego lo permita. Abrir o cargar puede guardar automáticamente; no pulsar Guardar no mantiene necesariamente los archivos intactos.',
          'Si aparece el progreso esperado, comprueba solo lo necesario y sal normalmente. Guarda una copia nueva con fecha del estado local confirmado y verifica que Steam termine la sincronización normal antes de usar otro dispositivo. Una sincronización correcta no vuelve innecesarios los respaldos anteriores.',
          'Si el progreso es incorrecto, cierra el juego, no sigas jugando y déjalo cerrado en los otros equipos. Conserva el resultado actual como otra copia identificada sin borrar los candidatos originales. Sigue la guía de copias y el procedimiento admitido por el editor, controlando la sincronización antes de reemplazar archivos.',
          'Para pedir ayuda, facilita el aviso exacto, plataforma/tienda, dispositivos y cronología sin publicar contraseñas, tokens ni contenido privado de las partidas. Un archivo recuperado puede requerir la versión o los mods correspondientes. Detente si restaurar sobrescribiría la única copia restante.',
        ],
        next: 'Con progreso correcto y sincronización terminada, vuelve a jugar en un dispositivo cada vez y conserva las copias. Con progreso incorrecto o incierto, mantén los candidatos y consulta al soporte oficial en vez de repetir elecciones de sincronización o sobrescritura.',
      },
    ],
    cautions: [
      'No elijas solo por la fecha más reciente ni por las etiquetas local o nube: ninguna garantiza el progreso deseado.',
      'No borres Steam userdata, archivos remotecache, partidas locales ni archivos de nube para forzar un reinicio.',
      'No desactives la protección ni aceptes una sobrescritura destructiva sin copias independientes y una dirección confirmada. Algunos juegos tienen un sistema propio de guardado compartido que Steam Cloud no controla.',
    ],
    faqs: [
      {
        question: '¿Puedo jugar mientras Steam dice que no puede sincronizar?',
        answer:
          'Mantén el juego cerrado hasta conservar las partidas y resolver el aviso. Jugar puede generar otra versión modificada, complicar la decisión posterior y poner en riesgo el progreso.',
      },
      {
        question: '¿Es siempre más segura la versión local o la nube?',
        answer:
          'Ninguna. Usa el historial conocido y los candidatos conservados. Los ejemplos tienen condiciones; no recomiendan subir siempre la copia local ni descargar siempre la nube.',
      },
      {
        question:
          'Remote Storage no muestra archivos. ¿He perdido el progreso?',
        answer:
          'La lista no basta para determinarlo. Comprueba cuenta, compatibilidad con Cloud y copias locales. El progreso en servidores o gestionado por el editor puede usar procedimientos distintos.',
      },
      {
        question:
          '¿Puedo deshacer una elección incorrecta eligiendo la otra opción después?',
        answer:
          'No cuentes con ello. La elección o un autoguardado posterior pueden cambiar lo que queda disponible. Conserva copias independientes antes de elegir; si ya elegiste mal, deja de jugar y busca una restauración admitida.',
      },
    ],
    sources: urls.map((url, i) => ({
      url,
      label: [
        'Steam: conflictos y avisos de sincronización (inglés)',
        'Steamworks: sincronización y ajustes por juego (inglés)',
        'Steam Remote Storage: consultar archivos tras iniciar sesión (inglés)',
      ][i],
    })),
    related: [
      {
        href: '/es/guide/save-data-backup',
        label: 'Comprobar copias y saber cuándo detener una restauración',
      },
      {
        href: '/en/gear/save-backup-storage-guide',
        label: 'Elegir un destino independiente para copias (inglés)',
      },
      {
        href: '/en/guide/steam-game-not-launching',
        label: 'El juego no arranca tras resolver el aviso de nube (inglés)',
      },
    ],
  },
];
