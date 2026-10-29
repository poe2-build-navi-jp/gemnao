import type { ArticleEvidenceReview } from './article-evidence-reviews';
export const localizedEvidenceReviews: Record<string, ArticleEvidenceReview> = {
  'en:/games/monster-hunter-wilds/not-launching': {
    scope:
      'Windows PC, retail Steam edition. The reported game, Steam, Windows and driver versions were not recorded; the case does not establish results for demos or consoles.',
    result:
      'One existing player report describes no files reacquired by verification and no improvement after closing OBS or disabling Steam Overlay. After added Steam DLL loaders were temporarily isolated, the player reported being able to launch and play, including after a PC restart. This was not an independent editorial hardware test.',
    limits:
      'The exact report time, play duration, restart count and long-term recurrence were not recorded. Multiple loaders were isolated together, so no single DLL was established as the cause. October 3, 2026 is the date of the prior article record, not a known experiment or report timestamp.',
    compare:
      'Distinguish failure before the title screen from a crash during a hunt. Change one item, repeat the same scene and duration, and match recurrence with the crash time. Do not remove a DLL by name if its origin, loaded path or restoration procedure is unknown.',
    sourceReview:
      'The Japanese evidence record reviewed the cited requirements on October 25, 2026. The player account reuses the existing public case reviewed on October 14; this translation adds no new test result.',
    official: [
      {
        text: 'Capcom documents minimum requirements and a 16 GB VRAM requirement for the high-resolution texture pack. These requirements do not prove that added DLLs caused this player’s crash.',
        label: 'Capcom: troubleshooting guide (Japanese)',
        url: 'https://steamcommunity.com/app/2246340/discussions/0/596267902352499417/',
      },
    ],
    reportPath: '/en/examples/wilds-steam-added-dll',
  },
  'en:/guide/directx-error': {
    scope:
      'Windows PC DirectX errors. Check the DirectX version, GPU feature level, optional libraries and game requirements separately; no game patch was tested here.',
    result:
      'No GPU-by-GPU reproduction, driver comparison or before/after runtime installation measurement is documented by the editors for this guide.',
    limits:
      'DEVICE_REMOVED alone does not prove a broken GPU. Installing older optional libraries does not add GPU feature levels or establish that every DirectX error is fixed.',
    compare:
      'Record the full message, active GPU, driver and game versions. Separate a feature-level requirement, missing legacy library and DXGI device error, then retest the same launch or rendering scene after one relevant change.',
    sourceReview:
      'The Japanese evidence record checked the DXGI definitions and June 2010 package description on October 25, 2026. That is a limited source review, not a new hardware test or a review of every step.',
    official: [
      {
        text: 'Microsoft defines device-error codes; the code alone is not a hardware diagnosis.',
        label: 'Microsoft Learn: DXGI_ERROR',
        url: 'https://learn.microsoft.com/en-us/windows/win32/direct3ddxgi/dxgi-error',
      },
      {
        text: 'The June 2010 package adds legacy libraries without changing the DirectX Runtime installed in Windows.',
        label: 'Microsoft: DirectX End-User Runtimes (June 2010)',
        url: 'https://www.microsoft.com/en-us/download/details.aspx?id=8109',
      },
    ],
  },
  'en:/guide/steam-game-not-launching': {
    scope:
      'Steam games on Windows. This is not confirmation that a particular title or build has been fixed. Record an external launcher’s name and version separately.',
    result:
      'No editorial reproduction and repair of a launch failure is documented for these general steps. The Wilds player report is not a success record for all Steam games.',
    limits:
      'The button state and matching failure log help choose what to inspect. A process missing from a brief observation does not prove it never started; a DLL name in a log does not establish the cause.',
    compare:
      'Compare the title/build, button state, complete message and failure time before and after one change. Distinguish one failing game from several. Do not disable protection or add unconditional exclusions.',
    sourceReview:
      'The Japanese source record is dated October 21, 2026. On October 25 only official search excerpts could be checked; the full Steam FAQ and current UI were not reverified. This is an alignment of the existing record, not a newer review date for the entire translation.',
    official: [
      {
        text: 'The Steam FAQ is the existing reference for launch-preparation checks. Grouping symptoms and ordering comparisons are editorial guidance, not a measured repair rate.',
        label: 'Steam: games do not run after preparing to launch',
        url: 'https://help.steampowered.com/en/faqs/view/5814-D9A3-BE42-62DF',
      },
    ],
  },
  'zh:/guide/steam-game-not-launching': {
    scope:
      '适用于 Windows 上的 Steam 游戏，不代表某款游戏或版本已修复。第三方启动器的名称与版本需单独记录。',
    result:
      '这些通用步骤没有编辑部实机复现并修复启动故障的记录。Wilds 的单个玩家反馈不能作为所有 Steam 游戏的成功案例。',
    limits:
      '按钮变化和同一时刻的停止日志只是选择检查方向的线索。短暂观察不到进程，不能证明它从未启动；日志里的 DLL 名也不能单独确定原因。',
    compare:
      '每次只改一项，对比游戏名称与版本、按钮状态、完整报错和停止时间。区分单款与多款游戏失败，不要关闭防护或无条件添加排除项。',
    sourceReview:
      '日文原稿的资料记录日期为 2026-10-21。10月25日仅核对到官方搜索摘要，未重新核对 Steam FAQ 全文与当前界面。本次语言整合不是整篇译文的新确认日期。',
    official: [
      {
        text: 'Steam FAQ 是启动准备问题的既有参考；症状分组和比较顺序是编辑建议，不是修复率测量。',
        label: 'Steam：准备启动后游戏不运行（英文）',
        url: 'https://help.steampowered.com/en/faqs/view/5814-D9A3-BE42-62DF',
      },
    ],
  },
  'es:/guide/steam-game-not-launching': {
    scope:
      'Juegos de Steam en Windows. No confirma una corrección para un título o compilación concreta. Anota por separado el nombre y la versión del lanzador externo.',
    result:
      'No hay una reproducción y reparación en hardware de la redacción documentada para estos pasos generales. El caso de Wilds no es un resultado de éxito para todos los juegos de Steam.',
    limits:
      'El estado del botón y el registro a la misma hora son pistas. No ver un proceso durante una observación breve no demuestra que nunca arrancó; un nombre de DLL tampoco demuestra la causa.',
    compare:
      'Compara título y versión, botón, mensaje completo y hora antes y después de un solo cambio. Distingue un juego de varios afectados. No desactives la protección ni añadas exclusiones indiscriminadas.',
    sourceReview:
      'El registro de fuentes japonés está fechado el 21 de octubre de 2026. El 25 de octubre solo se pudieron consultar extractos oficiales de búsqueda, no verificar de nuevo el texto completo ni la interfaz actual. Esta adaptación no cambia la fecha de revisión de toda la traducción.',
    official: [
      {
        text: 'La FAQ de Steam es la referencia existente para problemas al preparar el inicio. La agrupación y el orden son criterios editoriales, no una tasa de reparación medida.',
        label: 'Steam: el juego no arranca tras preparar el inicio (inglés)',
        url: 'https://help.steampowered.com/en/faqs/view/5814-D9A3-BE42-62DF',
      },
    ],
  },
  'en:/guide/verify-steam-files': {
    scope:
      'This guide covers checking Steam-managed installed game files. Save recovery, guaranteed mod compatibility and hardware fault diagnosis are outside these steps. No game or Steam build is specified.',
    result:
      'No before/after hardware comparison by the editors is documented here. The existing Wilds account records no files reacquired; that is not a clean bill of health or a repair result for every game.',
    limits:
      'Reacquisition and improvement in the original scene are different outcomes. Files being downloaded does not establish the cause; no download does not rule out factors outside those files.',
    compare:
      'Record completion, whether files were reacquired, download completion, launch outcome and the original symptom separately. If downloads recur, compare update, drive and protection histories rather than repeating without a record.',
    sourceReview:
      'The Japanese source record is dated September 27, 2026. On October 25 official search excerpts were available, but the full FAQ could not be rechecked. The page’s existing date is not a newly verified current-UI date.',
    official: [
      {
        text: 'The existing Steam FAQ supports the file-check procedure. The comparison record is editorial guidance, not a measured success rate.',
        label: 'Steam: verify integrity of game files',
        url: 'https://help.steampowered.com/en/faqs/view/0C48-FCBD-DA71-93EB',
      },
    ],
  },
  'zh:/guide/verify-steam-files': {
    scope:
      '本文处理 Steam 管理的已安装游戏文件核对，不把存档恢复、MOD 兼容性保证或硬件故障诊断作为这些步骤的范围。未指定游戏或 Steam 客户端版本。',
    result:
      '本文没有编辑部实机前后对比的测量记录。既有 Wilds 反馈只记录到未重新获取文件，不能视为所有游戏正常或修复成功。',
    limits:
      '重新获取文件与原场景的症状改善是两个结果。下载了文件不能确定原因；未下载也不能排除文件以外的因素。',
    compare:
      '分别记录验证完成提示、是否重新获取、下载是否完成、能否启动及原来的症状。反复下载时核对更新、磁盘与防护记录，不要不留记录地重复操作。',
    sourceReview:
      '日文原稿的资料记录日期为 2026-09-27。10月25日仅核对到官方搜索摘要，未重新核对 FAQ 全文。页面既有日期不代表刚验证过当前界面。',
    official: [
      {
        text: 'Steam FAQ 是文件核对操作的既有依据。结果记录方式是编辑建议，不是修复成功率测量。',
        label: 'Steam：验证游戏文件完整性（英文）',
        url: 'https://help.steampowered.com/en/faqs/view/0C48-FCBD-DA71-93EB',
      },
    ],
  },
  'es:/guide/verify-steam-files': {
    scope:
      'La guía trata de comprobar archivos instalados gestionados por Steam. Recuperar partidas, garantizar compatibilidad de mods o diagnosticar averías de hardware queda fuera de estos pasos. No se especifica una compilación del juego o de Steam.',
    result:
      'No se documenta una comparación antes y después en hardware de la redacción. El caso existente de Wilds indica que no se descargaron archivos de nuevo; eso no certifica todos los juegos ni una reparación.',
    limits:
      'Volver a descargar archivos y mejorar el síntoma original son resultados distintos. Una descarga no prueba la causa, y su ausencia no descarta factores externos a esos archivos.',
    compare:
      'Anota por separado el mensaje final, si hubo nuevos archivos, el fin de las descargas, el arranque y el síntoma original. Si se repite, compara historiales de actualizaciones, unidad y protección en lugar de repetir sin registro.',
    sourceReview:
      'El registro japonés de fuentes está fechado el 27 de septiembre de 2026. El 25 de octubre hubo extractos oficiales de búsqueda, pero no se pudo revisar el texto completo. La fecha existente de la página no indica una nueva comprobación de la interfaz actual.',
    official: [
      {
        text: 'La FAQ existente respalda la comprobación de archivos. El registro comparativo es orientación editorial, no una tasa de éxito medida.',
        label: 'Steam: verificar la integridad de los archivos (inglés)',
        url: 'https://help.steampowered.com/en/faqs/view/0C48-FCBD-DA71-93EB',
      },
    ],
  },
};
