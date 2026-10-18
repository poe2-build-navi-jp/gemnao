import type { TranslatedCommonGuide } from './save-guides-zh-es';
import { moreCommonGuidesEn } from './common-guides-more-en';
type Copy = Omit<
  TranslatedCommonGuide,
  | 'locale'
  | 'slug'
  | 'path'
  | 'topic'
  | 'checkedAt'
  | 'sources'
  | 'category'
  | 'sourcePolicy'
> & { sourceLabels: string[] };
function guide(
  slug: string,
  locale: 'zh' | 'es',
  copy: Copy,
): TranslatedCommonGuide {
  const en = moreCommonGuidesEn.find((g) => g.slug === slug)!;
  const { sourceLabels, ...body } = copy;
  return {
    ...body,
    slug,
    locale,
    path: en.path,
    topic: en.topic,
    checkedAt: '2026-10-18',
    category:
      locale === 'zh' ? 'PC 游戏通用排障' : 'Problemas comunes de juegos de PC',
    sourcePolicy:
      locale === 'zh'
        ? '根据日文原稿与已核对的英文版改写。以下官方资料支持操作与工具行为；比较顺序和结果解读是编辑建议，不是成功率或修复保证。界面可能因版本与硬件不同。资料链接为英文。'
        : 'Adaptación de la guía japonesa y su edición inglesa revisada. Las fuentes oficiales respaldan los procedimientos; el orden y la interpretación son recomendaciones editoriales, no tasas de éxito ni garantías. Las pantallas varían según versión y hardware. Fuentes en inglés.',
    sources: en.sources.map((s, i) => ({ url: s.url, label: sourceLabels[i] })),
  };
}
export const verifyFpsGuidesZhEs: TranslatedCommonGuide[] = [
  guide('verify-steam-files', 'zh', {
    title: 'Steam 游戏文件完整性验证：修复结果、MOD 与反复下载',
    shortTitle: '验证 Steam 游戏文件',
    description:
      '安全验证 Steam 安装文件，先保全存档和 MOD 记录，再结合启动结果判断文件修复、无变化或反复下载。',
    lead: '适用于文件缺失、启动报错或更新后问题。验证只检查 Steam 管理的游戏文件，不能诊断所有崩溃，也不保证用户设置或额外 MOD 已清除。',
    summary:
      '等待下载结束、关闭游戏并保全存档和 MOD 记录。在游戏属性的已安装文件中验证完整性，等待后续下载，再比较原来的问题。依据游戏实际表现判断，不要只看修复文件数量。',
    branches: [
      {
        symptom: '缺少可执行文件或更新中断',
        action: '先完成下载或记录下载错误。',
        step: 'step-1',
      },
      {
        symptom: '准备开始验证',
        action: '只验证该游戏的已安装文件。',
        step: 'step-2',
      },
      {
        symptom: '验证全部通过但问题仍在',
        action: '比较启动表现，并调查其他因素。',
        step: 'step-3',
      },
      {
        symptom: '相同文件反复下载',
        action: '核对更新、MOD 与保护历史。',
        step: 'step-4',
      },
    ],
    steps: [
      {
        id: 'step-1',
        title: '关闭游戏，保全存档与 MOD 记录',
        actions: [
          '正常保存并退出游戏，在 Steam 下载页查看是否仍在更新或安装。等待完成，记录下载错误以及要比较的启动失败或场景。',
          '改动文件前，按发行商资料找到存档并复制到独立位置，保持原件不变。云同步不能替代独立副本，尤其是测试可能覆盖进度时。',
          '记录 MOD 管理器配置、加载顺序和手工安装文件。验证可能恢复被 MOD 修改的 Steam 文件，但不能可靠地清除所有附加文件。不要为测试修复安装而载入并覆盖依赖 MOD 的存档。',
        ],
        next: '更新完成且记录已保存后进入步骤 2。下载本身失败时，保留完整错误用于步骤 4，不要反复验证代替排查。',
      },
      {
        id: 'step-2',
        title: '运行验证，等待后续下载',
        actions: [
          '在 Steam 库右击游戏或使用齿轮菜单，打开属性、已安装文件并验证完整性。操作完成前不要启动游戏。',
          '每次只验证一个游戏，避免同时进行高负载磁盘扫描。保留完成提示与重新取得的文件数量；这个数字不能单独证明硬盘损坏。',
          '再次查看下载页。Steamworks 说明验证也可能触发创意工坊项目下载；验证窗口完成不代表后续下载已经结束。',
        ],
        next: '下载结束后进入步骤 3，比较原先的场景。出现安装或写入错误时，按步骤 4 整理详情。',
      },
      {
        id: 'step-3',
        title: '结合实际启动结果解读验证',
        actions: [
          '重新应用改动的 MOD 前，用相同方式启动并比较同一场景。文件修复与改善同时发生时可能有关，但应再次比较，不要立即认定已解决；也要区分同期游戏更新的影响。',
          '所有文件通过但症状仍在时，记录“验证完成，症状无变化”，继续启动或崩溃指南。其他位置的设置、不兼容 MOD、配置要求和其他软件都未被排除。',
          'Steam 说明部分本地配置文件可能验证失败却不需要替换，不要仅因提示删除它们。重新取得文件却无改善时，确认下载结束并转向具体症状检查。',
        ],
        next: '改善时记录条件并保留可工作的配置；无变化时查看启动/崩溃指南；重启或调整 MOD 后复发时进入步骤 4。',
      },
      {
        id: 'step-4',
        title: '调查反复下载或问题复发',
        actions: [
          '记录复发是否发生在游戏更新、创意工坊下载或重新应用 MOD 后。查看相关项目是否仍被订阅；删除本地副本不等于取消订阅，改变前保留项目名称。',
          '出现写入或下载错误时，在 Steam 存储设置中确认安装盘和剩余空间，记录准确错误并使用官方安装支持页。重新下载本身不能证明硬件故障。',
          '文件反复消失时，按路径和时间核对安全软件的保护历史。不明确的文件继续阻止并向发行商或安全厂商确认，不要关闭防护或设置宽泛排除项。',
          '向官方支持提供游戏版本、错误、验证结果、下载状态和前后启动比较。公开前移除个人路径和账号信息；之后要修复存储前先备份重要文件。',
        ],
        next: '停止重复无变化的测试。安装失败联系 Steam 支持，游戏特有问题联系发行商，并附已整理记录。',
      },
    ],
    cautions: [
      '验证不需要删除用户数据或存档目录。',
      '不要认为所有 MOD 都已移除，也不要测试成功后一次恢复全部 MOD。',
      '重新取得文件不是存储健康诊断，不要为阻止重新下载而关闭安全防护。',
    ],
    faqs: [
      {
        question: '验证会删除所有 MOD 吗？',
        answer:
          '不会。它可能替换被修改的 Steam 文件，但额外文件可以保留，创意工坊订阅也可能再次下载。按原管理器或安装记录确认改动。',
      },
      {
        question: '能保证存档不受影响吗？',
        answer:
          '保存位置和 MOD 依赖因游戏不同。验证针对安装文件，但不是备份保证。先独立复制存档，测试时避免覆盖依赖 MOD 的进度。',
      },
      {
        question: '验证通过为什么还崩溃？',
        answer:
          '它只检查安装的一部分。保留具体表现并继续崩溃指南，不要据此认定整个电脑或游戏配置正常。',
      },
    ],
    sourceLabels: [
      'Steam：验证文件完整性（英文）',
      'Steam：更新与安装问题（英文）',
      'Steamworks：订阅与创意工坊下载（英文）',
      'Steam：云同步与存档（英文）',
    ],
    related: [
      { href: '/zh/guide/save-data-backup', label: '先保全存档' },
      {
        href: '/zh/guide/steam-game-not-launching',
        label: 'Steam 游戏无法启动',
      },
      { href: '/zh/guide/pc-game-crash', label: '游戏启动后闪退' },
      { href: '/zh/guide/steam-cloud-sync-error', label: '云同步错误与冲突' },
    ],
  }),
  guide('verify-steam-files', 'es', {
    title:
      'Verificar archivos de Steam: reparaciones, mods y descargas repetidas',
    shortTitle: 'Verificar archivos de Steam',
    description:
      'Verifica la instalación conservando partidas y registros de mods. Interpreta archivos reparados, resultados sin cambios y descargas repetidas junto con la prueba de inicio.',
    lead: 'Para archivos ausentes, errores de inicio o problemas tras actualizar. La verificación comprueba archivos gestionados por Steam; no diagnostica todos los cierres ni garantiza limpiar ajustes de usuario o mods añadidos.',
    summary:
      'Termina descargas, cierra el juego y conserva partidas y registros de mods. Abre Propiedades, Archivos instalados y la verificación de integridad. Espera a las descargas y repite la prueba original. Juzga el comportamiento, no solo la cantidad de archivos reparados.',
    branches: [
      {
        symptom: 'Falta el ejecutable o se interrumpió una actualización',
        action: 'Termina la descarga o registra su error antes de verificar.',
        step: 'step-1',
      },
      {
        symptom: 'Todo está preparado para verificar',
        action: 'Usa Archivos instalados únicamente para este juego.',
        step: 'step-2',
      },
      {
        symptom: 'La verificación pasa pero el fallo sigue',
        action: 'Compara el inicio e investiga otros factores.',
        step: 'step-3',
      },
      {
        symptom: 'Los mismos archivos se descargan otra vez',
        action:
          'Relaciona la repetición con actualizaciones, mods y protección.',
        step: 'step-4',
      },
    ],
    steps: [
      {
        id: 'step-1',
        title: 'Cierra el juego y conserva partidas y registros de mods',
        actions: [
          'Termina de guardar y sal normalmente. En Descargas de Steam comprueba si sigue actualizándose o instalándose. Espera y anota cualquier error y la escena o fallo que quieres comparar.',
          'Antes de cambiar archivos, localiza las partidas según el editor y cópialas a un destino independiente sin alterar el original. La nube no sustituye esa copia, sobre todo si una prueba puede sobrescribir progreso.',
          'Registra perfil del gestor de mods, orden de carga y archivos manuales. Verificar puede restaurar archivos de Steam modificados, pero no elimina de forma fiable todos los añadidos. No cargues y sobrescribas una partida dependiente de mods para probar la reparación.',
        ],
        next: 'Con actualizaciones terminadas y registros a salvo, sigue con el PASO 2. Si falla la descarga, conserva el error para el PASO 4: repetir verificaciones puede no resolverlo.',
      },
      {
        id: 'step-2',
        title: 'Verifica y deja terminar las descargas',
        actions: [
          'En la biblioteca, haz clic derecho en el juego o usa el engranaje. Abre Propiedades, Archivos instalados y la verificación de integridad. Espera a que termine antes de jugar.',
          'Verifica un juego cada vez y evita otro análisis intensivo de disco simultáneo. Guarda el mensaje y la cantidad de archivos recuperados; ese número no demuestra daño en la unidad.',
          'Vuelve a Descargas. Steamworks indica que verificar puede activar descargas de Workshop. Que termine el diálogo no significa que hayan acabado todas las descargas posteriores.',
        ],
        next: 'Después, compara la situación original en el PASO 3. Ante errores de instalación o escritura, recoge los detalles del PASO 4.',
      },
      {
        id: 'step-3',
        title: 'Interpreta el resultado junto con una prueba de inicio',
        actions: [
          'Antes de reaplicar mods modificados, inicia igual y compara la misma escena. Si reparar coincide con mejorar, puede haber contribuido, pero repite antes de darlo por resuelto. Separa ese cambio de una actualización recibida a la vez.',
          'Si todo verifica pero el fallo sigue, anota “verificación terminada; síntoma sin cambios”. Consulta la guía de inicio o cierres. No se descartan ajustes guardados aparte, mods incompatibles, requisitos ni otros programas.',
          'Steam indica que algunas configuraciones locales pueden fallar la verificación sin requerir reemplazo. No las borres solo por ese aviso. Si recuperar archivos no cambia el síntoma, confirma que terminaron las descargas y pasa a una comprobación específica.',
        ],
        next: 'Si mejora, registra condiciones y conserva la configuración funcional. Sin cambio, consulta inicio o cierres. Si reaparece tras reiniciar o cambiar mods, PASO 4.',
      },
      {
        id: 'step-4',
        title: 'Investiga descargas repetidas o la reaparición del fallo',
        actions: [
          'Anota si reaparece tras actualizar, descargar Workshop o reaplicar mods. Comprueba si sigues suscrito al elemento: borrar su copia local no cambia la suscripción. Conserva su nombre antes de modificarla.',
          'Ante errores de escritura o descarga, identifica unidad y espacio libre en los ajustes de almacenamiento de Steam. Registra el error exacto y consulta su soporte de instalación. Recuperar archivos no diagnostica hardware averiado.',
          'Si desaparecen archivos, compara ruta y hora en el historial de protección. Mantén bloqueados los dudosos y consulta al editor o proveedor de seguridad; no desactives protección ni añadas exclusiones amplias.',
          'Facilita a soporte edición, error, resultado de verificación, estado de descarga y comparación de inicio. Elimina rutas personales y datos de cuenta antes de publicar. Respalda archivos importantes antes de reparar almacenamiento.',
        ],
        next: 'No repitas una prueba sin cambios. Contacta con Steam por problemas de instalación o con el editor por fallos del juego y aporta los registros.',
      },
    ],
    cautions: [
      'No borres carpetas de usuario ni partidas como parte de la verificación.',
      'No supongas que desaparecieron todos los mods ni los restaures todos a la vez tras una prueba correcta.',
      'Los archivos recuperados no diagnostican la salud del disco; no desactives seguridad para impedir otra descarga.',
    ],
    faqs: [
      {
        question: '¿La verificación elimina todos los mods?',
        answer:
          'No. Puede reemplazar archivos gestionados por Steam y dejar archivos añadidos. Las suscripciones de Workshop pueden descargarlos otra vez. Usa el gestor original o el registro de instalación.',
      },
      {
        question: '¿Está garantizado que no afecte a mis partidas?',
        answer:
          'Las ubicaciones y dependencias de mods varían. La verificación se centra en archivos instalados, pero no garantiza una copia de seguridad. Conserva un respaldo separado y evita sobrescribir partidas dependientes de mods.',
      },
      {
        question: '¿Por qué sigue cerrándose si todos los archivos pasan?',
        answer:
          'Solo se comprueba una parte de la instalación. Conserva el comportamiento exacto y sigue la guía de cierres; no concluyas que todo el PC o la configuración funcionan bien.',
      },
    ],
    sourceLabels: [
      'Steam: verificar integridad (inglés)',
      'Steam: problemas de actualización e instalación (inglés)',
      'Steamworks: suscripciones y descargas de Workshop (inglés)',
      'Steam: nube y partidas (inglés)',
    ],
    related: [
      { href: '/es/guide/save-data-backup', label: 'Conserva las partidas' },
      {
        href: '/es/guide/steam-game-not-launching',
        label: 'El juego no arranca',
      },
      {
        href: '/es/guide/pc-game-crash',
        label: 'El juego arranca y se cierra',
      },
      {
        href: '/es/guide/steam-cloud-sync-error',
        label: 'Errores y conflictos de nube',
      },
    ],
  }),
  guide('low-fps', 'zh', {
    title: 'PC 游戏 FPS 低：检查帧率上限、GPU 负载与 CPU 限制',
    shortTitle: '低 FPS：上限与渲染负载',
    description:
      '在相同场景比较帧率上限、渲染分辨率与 CPU 侧工作，核对实际 GPU，区分持续低 FPS 和偶发卡顿。',
    lead: '适用于游玩中持续低帧率。平均 FPS 尚可但偶发停顿时先看卡顿指南；只有其他玩家跳动而自己的镜头流畅时，应检查游戏网络说明，而非先改画质。',
    summary:
      '记录同一场景的 FPS 范围、上限和实际 GPU。接近设定上限时先检查上限；否则只降低渲染分辨率比较。明显改善说明该场景的渲染负载可能重要；变化小则核对上限、CPU、GPU 选择和供电。任何单项观察都不能证明部件故障。',
    branches: [
      {
        symptom: 'FPS 固定在60等数值附近',
        action: '先检查上限与同步设置。',
        step: 'step-2',
      },
      {
        symptom: '同一高负载场景持续低帧',
        action: '记录基准，再单独降低分辨率比较。',
        step: 'step-1',
      },
      {
        symptom: '降低分辨率几乎不改变 FPS',
        action: '检查上限、实际 GPU 与 CPU 工作。',
        step: 'step-4',
      },
      {
        symptom: '平均 FPS 高但偶尔停顿',
        action: '记录停顿规律并查看卡顿指南。',
        step: 'step-1',
      },
    ],
    steps: [
      {
        id: 'step-1',
        title: '记录可重复的场景与实际 GPU',
        actions: [
          '选择可安全重复的存档、练习区或路线，保持显示模式、路线和时长一致。使用游戏 FPS 显示或 Steam 性能监视器，两次保持相同监视方式，记录大致范围而非单次峰值。',
          '记录渲染分辨率、FPS 上限、垂直同步、超分辨率和帧生成设置。首次载入/着色器准备与重复场景分开比较。显示或生成的 FPS 与实际新渲染帧率，不是同一种响应性指标。',
          'Ctrl+Shift+Esc 打开任务管理器，在性能中识别 GPU 并查看3D等相关引擎，不要把所有 GPU 图表都当渲染。也记录 CPU 与内存。切出游戏会改变负载，因此只能作为背景观察。',
        ],
        next: '明确达到上限时进入步骤 2；低于目标且无明显上限时进入步骤 3。偶发卡顿保留基准并使用相关指南，不要一次更改所有画质。',
      },
      {
        id: 'step-2',
        title: '降低画质前先检查上限',
        actions: [
          '比较游戏 FPS 上限、垂直同步与观察值。Windows 的系统、显示、高级显示中核对目标显示器刷新率，只使用支持的数值。刷新率不代表电脑能渲染同样数量的帧。',
          '上限低于目标时，在同场景比较一个更高且支持的上限，不要同时关闭全部限制和同步。记住原值；噪声、温度、撕裂或响应变差时恢复。',
          '游戏没有相关上限时，检查自己曾在该游戏驱动配置中设置的限制，按厂商说明操作，避免叠加多个限帧器。移除上限不会增加运算能力。',
        ],
        next: 'FPS 随新上限变化且符合需求时复测并停止。仍低时恢复无效改动，进入步骤 3；限帧时 GPU 利用率低不等于故障。',
      },
      {
        id: 'step-3',
        title: '只改变渲染分辨率进行比较',
        actions: [
          '记录原值。支持渲染比例时可比较100%到80%等较低值，否则使用一个较低且受支持的游戏分辨率。这是诊断示例，不是所有游戏的推荐设置。',
          '保持上限、垂直同步、帧生成、纹理、阴影与路线不变，确认设置已应用；游戏要求时重启。比较同一高负载位置，同时记录画质和操作感。',
          'FPS 明显提高说明该场景渲染工作可能重要。变化小可能是上限或其他限制，不证明 CPU 坏了或 GPU 没工作。选择下一项前恢复基准。',
        ],
        next: '分辨率有效时按步骤 4 比较 GPU 相关设置；变化小则核对上限和CPU/GPU选择。只有首次经过卡顿时转向卡顿指南。',
      },
      {
        id: 'step-4',
        title: '依据比较结果选择下一项',
        actions: [
          '分辨率有效时，单独比较光追、阴影或超分辨率等已有选项，在同场景判断画质代价。出现显存警告或纹理缺失时记录并核对要求，不要只按 FPS 推断容量问题。',
          '分辨率作用小时，再查上限与实际 GPU。Windows 11 系统、显示、图形在支持的设备上提供每应用偏好；确认正确游戏 EXE 和列出的 GPU 再改变。混合显卡笔记本还需遵循制造商说明。',
          '整体 CPU 百分比不高也可能掩盖逻辑处理器间的不均衡。应结合分辨率比较，不单凭图表断定瓶颈。游戏提供视距、人群或模拟设置时，一次比较一个相关选项。',
          '笔记本可在正确电源适配器和制造商预期电源模式下比较。安全关闭一个非必要录制或后台负载，不中断云同步、更新或安全防护。随时间变慢时记录时长，咨询机型对应散热/供电说明，不改电压。',
          '恢复无效改动。单个游戏仍慢时向支持提供场景、设置、硬件、驱动与比较记录。之后修复或重装前保全存档；低 FPS 本身不是删存档的理由。',
        ],
        next: '只有重复改善和画质代价均可接受时才保留设置。单游戏不明原因慢联系游戏支持；整机变慢或重启联系电脑支持。驱动变化或偶发卡顿使用相关指南。',
      },
    ],
    cautions: [
      '不要根据单个百分比或高负载场景判断 CPU/GPU 损坏。',
      '比较期间不要清除着色器缓存、叠加限帧器，或为测试一个原因而改变整套画质预设。',
      '不要把注册表修改、超频、安全排除项或驱动清理工具当作通用 FPS 修复。',
    ],
    faqs: [
      {
        question: '低 FPS 和卡顿一样吗？',
        answer:
          '持续低帧率与偶发长帧可能体验不同，需要不同比较，也可能同时发生。分别记录持续帧率和停顿规律。',
      },
      {
        question: 'GPU 100% 就必须降画质吗？',
        answer:
          '如果达到目标且响应正常，不必仅凭利用率降画质。高利用率本身不是故障。速度不足时再比较分辨率和单项画质。',
      },
      {
        question: '帧生成提高数字就代表解决了吗？',
        answer:
          '显示数字可能包括生成帧。诊断时保持此设置不变并比较操作感，不要把定义不同的计数器当相同工作量。',
      },
    ],
    sourceLabels: [
      'Microsoft DirectX：CPU 与 GPU 工作限制（英文）',
      'Microsoft DirectX：任务管理器 GPU 引擎（英文）',
      'Steam：游戏内性能监视器（英文）',
      'Microsoft：显示器刷新率（英文）',
      'Microsoft DirectX：每应用图形偏好（英文）',
    ],
    related: [
      { href: '/en/guide/stutter-fix', label: '高 FPS 但偶发卡顿（英文）' },
      {
        href: '/en/guide/gpu-driver-update',
        label: '记录并比较驱动变化（英文）',
      },
      { href: '/en/guide/black-screen', label: '画面消失而非速度变慢（英文）' },
      { href: '/zh/guide/save-data-backup', label: '保全存档' },
    ],
  }),
  guide('low-fps', 'es', {
    title: 'FPS bajos en juegos de PC: límites de fotogramas, GPU y CPU',
    shortTitle: 'FPS bajos: límites y carga gráfica',
    description:
      'Compara la misma escena para distinguir un límite de FPS, carga de renderizado y trabajo de CPU. Comprueba resolución y GPU activa y separa lentitud constante de tirones.',
    lead: 'Para una tasa de fotogramas baja de forma sostenida. Con una media aceptable pero tirones ocasionales, consulta la guía de tirones. Si saltan otros jugadores mientras tu cámara es fluida, sigue la ayuda de red del juego antes de cambiar gráficos.',
    summary:
      'Anota escena, intervalo de FPS, límite y GPU activa. Si alcanzas el techo configurado, revísalo primero; si no, reduce solo la resolución de renderizado. Mejorar apunta a la carga gráfica en esa escena; cambiar poco invita a revisar límites, CPU, GPU y alimentación. Ninguna observación aislada demuestra una pieza averiada.',
    branches: [
      {
        symptom: 'Se mantiene cerca de un número fijo como 60',
        action: 'Comprueba límite y sincronización.',
        step: 'step-2',
      },
      {
        symptom: 'Una escena exigente mantiene FPS bajos',
        action: 'Registra una referencia y compara solo la resolución.',
        step: 'step-1',
      },
      {
        symptom: 'Bajar resolución apenas cambia los FPS',
        action: 'Revisa límite, GPU activa y trabajo de CPU.',
        step: 'step-4',
      },
      {
        symptom: 'Media alta con tirones ocasionales',
        action: 'Registra el patrón y consulta la guía de tirones.',
        step: 'step-1',
      },
    ],
    steps: [
      {
        id: 'step-1',
        title: 'Registra una escena repetible y la GPU activa',
        actions: [
          'Elige una partida, zona de práctica o recorrido seguro. Mantén modo de pantalla, ruta y duración. Usa el contador del juego o el monitor de rendimiento de Steam con la misma configuración en ambas pruebas. Anota un intervalo aproximado, no un pico.',
          'Registra resolución de renderizado, límite, V-Sync, reescalado y generación de fotogramas. Separa primera carga o preparación de sombreadores de visitas repetidas. Los FPS mostrados o generados y los fotogramas nuevos renderizados no miden igual la respuesta.',
          'Abre el Administrador de tareas con Ctrl+Mayús+Esc. En Rendimiento identifica la GPU y el motor pertinente, por ejemplo 3D; no todos los gráficos miden renderizado. Registra CPU y memoria. Cambiar de ventana altera la carga, así que toma esas lecturas como contexto.',
        ],
        next: 'En un techo claro, PASO 2. Por debajo de lo deseado sin límite evidente, PASO 3. Para tirones aislados conserva la referencia y usa su guía, sin cambiar todas las opciones.',
      },
      {
        id: 'step-2',
        title: 'Comprueba el techo antes de reducir calidad',
        actions: [
          'Compara límite de FPS y V-Sync con la tasa observada. En Windows, Sistema, Pantalla, Pantalla avanzada, revisa la frecuencia del monitor correcto y usa solo valores admitidos. La frecuencia no demuestra que el PC renderice ese número de fotogramas.',
          'Si el límite queda por debajo del objetivo, compara uno mayor admitido en la misma escena. No desactives todos los límites y sincronizaciones a la vez. Conserva el valor anterior para volver atrás si empeoran ruido, calor, desgarro o respuesta.',
          'Si el juego no tiene ese límite, revisa los que configuraste en su perfil del controlador usando instrucciones oficiales. Evita apilar limitadores. Quitar el techo no añade capacidad de cálculo.',
        ],
        next: 'Si sigue el nuevo límite y te sirve, repite y termina ahí. Si sigue bajo, restaura lo que no ayudó y pasa al PASO 3. Poco uso de GPU con límite activo no prueba un defecto.',
      },
      {
        id: 'step-3',
        title: 'Cambia solo la resolución de renderizado',
        actions: [
          'Anota el original. Si existe escala de renderizado, compara un valor menor, por ejemplo de 100% a 80%; si no, una resolución de juego inferior admitida. Es un ejemplo diagnóstico, no una recomendación universal.',
          'Mantén límite, V-Sync, generación, texturas, sombras y recorrido. Confirma que se aplicó, reiniciando si el juego lo exige. Compara la misma zona exigente y anota calidad e interacción además de FPS.',
          'Una subida clara sugiere que el renderizado pesaba en esa escena. Poco cambio puede reflejar límites u otros factores; no demuestra CPU dañada ni GPU inactiva. Restaura la referencia antes de elegir otra opción.',
        ],
        next: 'Si ayuda, compara ajustes gráficos en el PASO 4. Si cambia poco, revisa límites y selección CPU/GPU. Si solo hay tirones en la primera visita, usa la guía de tirones.',
      },
      {
        id: 'step-4',
        title: 'Elige la siguiente comprobación según el resultado',
        actions: [
          'Si ayudó la resolución, compara una opción disponible como trazado de rayos, sombras o reescalado. Valora la calidad en la misma escena. Ante avisos de memoria de vídeo o texturas ausentes, registra el mensaje y consulta requisitos; los FPS solos no identifican falta de capacidad.',
          'Si ayudó poco, comprueba límite y GPU activa. Windows 11 ofrece preferencias gráficas por aplicación en Sistema, Pantalla, Gráficos en equipos compatibles. Selecciona el EXE correcto y revisa las GPU nombradas antes de cambiarlo; los portátiles híbridos pueden necesitar instrucciones del fabricante.',
          'Una media modesta de CPU puede ocultar trabajo desigual entre procesadores lógicos. Usa el gráfico junto con la comparación de resolución, no como veredicto aislado. Compara una opción pertinente de distancia, población o simulación cuando exista.',
          'En portátiles, compara con el adaptador correcto y el modo previsto por el fabricante. Cierra con seguridad un grabador o trabajo no esencial, sin interrumpir nube, actualizaciones ni protección. Si empeora con el tiempo, registra duración y consulta orientación térmica/energética del modelo, sin cambiar voltajes.',
          'Restaura lo que no ayude. Si solo falla un título, entrega a soporte escena, ajustes, hardware, controlador y comparación. Respalda partidas antes de reparar o reinstalar; FPS bajos no justifican borrarlas.',
        ],
        next: 'Mantén ajustes solo si la mejora repetible y el coste visual te sirven. Para lentitud de un juego consulta su soporte; para todo el PC o reinicios, el del equipo. Usa las guías relacionadas para controladores y tirones.',
      },
    ],
    cautions: [
      'No diagnostiques una CPU o GPU averiada con un porcentaje o una escena exigente.',
      'No borres cachés de sombreadores entre pruebas, apiles limitadores ni cambies todo un preajuste al comprobar una causa.',
      'Evita cambios de registro, overclocking, exclusiones de seguridad y limpiadores de controladores como soluciones genéricas.',
    ],
    faqs: [
      {
        question: '¿FPS bajos y tirones son lo mismo?',
        answer:
          'No. Una tasa sostenida baja y un fotograma ocasional largo pueden sentirse distinto y requieren comparaciones diferentes. Pueden coexistir; registra ambos patrones por separado.',
      },
      {
        question: '¿Usar la GPU al 100% obliga a bajar calidad?',
        answer:
          'No si cumples el objetivo y la respuesta es adecuada. El uso alto no es un fallo. Si la tasa es insuficiente, compara resolución y una opción visual cada vez.',
      },
      {
        question: '¿La generación de fotogramas demuestra que se solucionó?',
        answer:
          'Una cifra mayor puede incluir fotogramas generados. Mantén ese ajuste durante el diagnóstico y compara también la respuesta. No equipares contadores con definiciones distintas.',
      },
    ],
    sourceLabels: [
      'Microsoft DirectX: límites de trabajo CPU/GPU (inglés)',
      'Microsoft DirectX: motores GPU en el Administrador de tareas (inglés)',
      'Steam: monitor de rendimiento (inglés)',
      'Microsoft: frecuencia de pantalla (inglés)',
      'Microsoft DirectX: preferencias gráficas por aplicación (inglés)',
    ],
    related: [
      {
        href: '/en/guide/stutter-fix',
        label: 'Media alta con tirones (inglés)',
      },
      {
        href: '/en/guide/gpu-driver-update',
        label: 'Registrar y comparar controladores (inglés)',
      },
      {
        href: '/en/guide/black-screen',
        label: 'La imagen desaparece en vez de ir lenta (inglés)',
      },
      { href: '/es/guide/save-data-backup', label: 'Conservar las partidas' },
    ],
  }),
];
