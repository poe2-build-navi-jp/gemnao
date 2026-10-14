import type { MyGamesLocale } from './my-games-copy';
const en = {
  homeNext: 'Next step for your game',
  homeOpen: 'Continue this game',
  heading: 'Back up and restore all My Games records',
  scope:
    'Protect saved games, My PC, support notes, settings, experiments, progress and next steps, tasks and troubleshooting, read changes and today’s choices.',
  privacy:
    'Files are saved and read on this device, without uploading. They may contain personal notes; choose where to keep them carefully.',
  excluded:
    'Article bookmarks, browsing history, unsaved diagnosis answers and credentials are excluded.',
  export: 'Save full backup',
  exported: 'Download started. Check that the file was saved.',
  choose: 'Choose a restore file',
  file: 'Backup file',
  busy: 'Reading…',
  preview: 'Review before restoring',
  legacy: 'Legacy notes format: only support notes will be imported.',
  merge:
    'Existing records take priority. Only additions are imported. Identical records are not added twice; different records with the same ID or game keep the existing version and are not imported. Keep the source file if there are conflicts.',
  category: 'Category',
  existing: 'Current',
  incoming: 'File',
  added: 'Add',
  duplicate: 'Duplicate',
  conflict: 'Conflict (not imported)',
  games: 'Saved games',
  pc: 'My PC',
  notes: 'Support notes',
  snapshots: 'Settings records',
  experiments: 'Experiments',
  plans: 'Progress and conditions',
  activity: 'Tasks and troubleshooting',
  read: 'Read official changes',
  today: 'Today’s choices',
  confirm: 'Restore the reviewed additions',
  cancel: 'Cancel',
  restored: 'Additions restored. Existing records were kept.',
  currentInvalid:
    'Current saved data cannot be read. Restore has stopped without overwriting it.',
  invalid: 'This is not a supported backup format. Existing data is unchanged.',
  size: 'Choose a file no larger than 5MB.',
  limit:
    'The merged count or size exceeds a limit. Restore stopped without dropping records.',
  changed:
    'Saved data changed after preview. Choose the file again and review it.',
  rolledBack:
    'Save failed and the pre-restore state was recovered. You can still use the file.',
  storage:
    'Storage is unavailable. Restore could not complete; check the recovery instructions.',
  pending:
    'An interrupted restore is recorded. Return to the previous state before starting another restore.',
  recover: 'Return to the pre-restore state',
  recovered:
    'The pre-restore state is restored. You can choose the file again.',
  recoveryFile: 'Save pre-restore data to a file',
  recoveryConflict:
    'Other changes occurred after restore began. Recovery stopped without overwriting them. Save a copy of the pre-restore data.',
  recoveryInvalid:
    'The recovery record cannot be read. Existing data and the recovery record were kept.',
  check: 'I have checked the additions, duplicates, conflicts and scope above',
  refs: 'References without a source setting or note keep their captured values or IDs. Conflicting settings with the same ID receive a distinct reference ID so they are not linked to different current settings.',
  share: 'Copy settings for sharing',
  shareHint:
    'Copy the game name, values and checked date. This does not change device settings. Review the text first.',
  includeMemo: 'Include the free-text memo (optional)',
  sharePreview: 'Text to copy',
  copy: 'Copy the displayed text',
  copied: 'Copied. Paste it yourself wherever you choose to share.',
  manual: 'Automatic copy failed. Select the text below and copy it manually.',
  manualSelect: 'Select the text for copying',
};
export const myGamesTransferCopy: Record<MyGamesLocale, typeof en> = {
  ja: {
    homeNext: 'ゲームの次の一歩',
    homeOpen: 'このゲームの続きへ',
    heading: 'マイゲーム全体をバックアップ・復元',
    scope:
      'ゲーム登録・マイPC・相談ノート・設定記録・実験ログ・進捗と次行動・チェックリストと対処・公式変更の既読・今日の選択条件を保護します。',
    privacy:
      'ファイルの保存・読み込みはこの端末内だけ。サーバーへ送信しません。自由記述や個人情報が含まれる場合があるため、保管先を確認してください。',
    excluded:
      '記事のブックマーク、閲覧履歴、診断ツールの未保存の回答、認証情報は対象外です。',
    export: '全体バックアップを保存',
    exported:
      'ダウンロードを開始しました。ファイルが保存されたことを確認してください。',
    choose: '復元ファイルを選ぶ',
    file: 'バックアップファイル',
    busy: '読み込み中…',
    preview: '復元前の確認',
    legacy: '旧ノート形式：相談ノートのみ取り込みます。',
    merge:
      '既存記録を優先し、追加分だけ取り込みます。同じ記録は追加せず、内容が異なる同じID・同じゲームの記録は既存を残して取り込みません。競合がある場合は元ファイルも保管してください。',
    category: '種類',
    existing: '現在',
    incoming: 'ファイル',
    added: '追加',
    duplicate: '重複',
    conflict: '競合（取り込まない）',
    games: 'ゲーム登録',
    pc: 'マイPC',
    notes: '相談ノート',
    snapshots: '設定記録',
    experiments: '実験ログ',
    plans: '続き・候補条件',
    activity: 'タスク・対処再開',
    read: '公式変更の既読',
    today: '今日の選択条件',
    confirm: '確認した内容で復元する',
    cancel: 'キャンセル',
    restored: '追加分を復元しました。既存記録を保持しています。',
    currentInvalid:
      '現在の保存データを読み取れません。既存データを上書きせず復元を止めました。',
    invalid:
      '対応する形式のバックアップではありません。既存データは変更していません。',
    size: 'ファイルは5MB以下にしてください。',
    limit:
      '復元後の件数または容量が上限を超えます。記録を省略せず復元を止めました。',
    changed:
      'プレビュー後に保存データが変わりました。ファイルを選び直して確認してください。',
    rolledBack:
      '保存に失敗したため、復元前の状態へ戻しました。ファイルは引き続き使えます。',
    storage:
      '保存領域を利用できません。復元を完了できなかったため、回復の案内を確認してください。',
    pending:
      '途中で終了した復元の記録があります。新しい復元を始める前に、復元前の状態へ戻してください。',
    recover: '復元前の状態へ戻す',
    recovered: '復元前の状態に戻しました。ファイルを選び直してやり直せます。',
    recoveryFile: '復元前のデータをファイルに保存',
    recoveryConflict:
      '復元開始後に別の変更があります。その変更を上書きせず回復を止めました。復元前のデータをファイルに保存して保管してください。',
    recoveryInvalid:
      '回復記録を読み取れません。既存データと回復記録を保持しています。',
    check: '上の追加・重複・競合と対象を確認しました',
    refs: '元の設定や相談ノートが含まれない参照は、保存された参照値やIDを残します。設定が異なる同じIDには別の参照IDを付け、現在の設定へ誤って結び付けません。',
    share: '設定を共有用にコピー',
    shareHint:
      'ゲーム名・設定値・確認日をコピーします。実機設定は変更しません。コピー内容を先に確認してください。',
    includeMemo: '自由記述メモも含める（任意）',
    sharePreview: 'コピーする内容',
    copy: '表示した文章をコピー',
    copied: 'コピーしました。自分で共有先へ貼り付けてください。',
    manual:
      '自動コピーできませんでした。下の文章を選択して手動でコピーできます。',
    manualSelect: 'コピー用の文章を選択',
  },
  en: {
    homeNext: 'Next step for your game',
    homeOpen: 'Continue this game',
    heading: 'Back up and restore all My Games records',
    scope:
      'Protect saved games, My PC, support notes, settings, experiments, progress and next steps, tasks and troubleshooting, read changes and today’s choices.',
    privacy:
      'Files are saved and read on this device, without uploading. They may contain personal notes; choose where to keep them carefully.',
    excluded:
      'Article bookmarks, browsing history, unsaved diagnosis answers and credentials are excluded.',
    export: 'Save full backup',
    exported: 'Download started. Check that the file was saved.',
    choose: 'Choose a restore file',
    file: 'Backup file',
    busy: 'Reading…',
    preview: 'Review before restoring',
    legacy: 'Legacy notes format: only support notes will be imported.',
    merge:
      'Existing records take priority. Only additions are imported. Identical records are not added twice; different records with the same ID or game keep the existing version and are not imported. Keep the source file if there are conflicts.',
    category: 'Category',
    existing: 'Current',
    incoming: 'File',
    added: 'Add',
    duplicate: 'Duplicate',
    conflict: 'Conflict (not imported)',
    games: 'Saved games',
    pc: 'My PC',
    notes: 'Support notes',
    snapshots: 'Settings records',
    experiments: 'Experiments',
    plans: 'Progress and conditions',
    activity: 'Tasks and troubleshooting',
    read: 'Read official changes',
    today: 'Today’s choices',
    confirm: 'Restore the reviewed additions',
    cancel: 'Cancel',
    restored: 'Additions restored. Existing records were kept.',
    currentInvalid:
      'Current saved data cannot be read. Restore has stopped without overwriting it.',
    invalid:
      'This is not a supported backup format. Existing data is unchanged.',
    size: 'Choose a file no larger than 5MB.',
    limit:
      'The merged count or size exceeds a limit. Restore stopped without dropping records.',
    changed:
      'Saved data changed after preview. Choose the file again and review it.',
    rolledBack:
      'Save failed and the pre-restore state was recovered. You can still use the file.',
    storage:
      'Storage is unavailable. Restore could not complete; check the recovery instructions.',
    pending:
      'An interrupted restore is recorded. Return to the previous state before starting another restore.',
    recover: 'Return to the pre-restore state',
    recovered:
      'The pre-restore state is restored. You can choose the file again.',
    recoveryFile: 'Save pre-restore data to a file',
    recoveryConflict:
      'Other changes occurred after restore began. Recovery stopped without overwriting them. Save a copy of the pre-restore data.',
    recoveryInvalid:
      'The recovery record cannot be read. Existing data and the recovery record were kept.',
    check:
      'I have checked the additions, duplicates, conflicts and scope above',
    refs: 'References without a source setting or note keep their captured values or IDs. Conflicting settings with the same ID receive a distinct reference ID so they are not linked to different current settings.',
    share: 'Copy settings for sharing',
    shareHint:
      'Copy the game name, values and checked date. This does not change device settings. Review the text first.',
    includeMemo: 'Include the free-text memo (optional)',
    sharePreview: 'Text to copy',
    copy: 'Copy the displayed text',
    copied: 'Copied. Paste it yourself wherever you choose to share.',
    manual:
      'Automatic copy failed. Select the text below and copy it manually.',
    manualSelect: 'Select the text for copying',
  },
  zh: {
    homeNext: '游戏的下一步',
    homeOpen: '继续此游戏',
    heading: '备份与恢复全部游戏记录',
    scope:
      '保护游戏登记、我的电脑、问题笔记、设置、实验、进度与下一步、任务与排查、已读官方更新和今天的选择条件。',
    privacy:
      '文件仅在此设备保存和读取，不上传服务器。可能含有私人笔记，请谨慎选择保存位置。',
    excluded: '不包含文章收藏、浏览历史、诊断工具未保存的回答或认证信息。',
    export: '保存完整备份',
    exported: '已开始下载，请确认文件已保存。',
    choose: '选择恢复文件',
    file: '备份文件',
    busy: '读取中…',
    preview: '恢复前确认',
    legacy: '旧笔记格式：仅导入问题笔记。',
    merge:
      '已有记录优先，仅导入新增内容。相同记录不重复添加；同一ID或游戏内容不同则保留当前版本，不导入冲突记录。有冲突时请保留原文件。',
    category: '类型',
    existing: '当前',
    incoming: '文件',
    added: '新增',
    duplicate: '重复',
    conflict: '冲突（不导入）',
    games: '游戏登记',
    pc: '我的电脑',
    notes: '问题笔记',
    snapshots: '设置记录',
    experiments: '实验记录',
    plans: '进度与条件',
    activity: '任务与排查',
    read: '已读官方更新',
    today: '今天的选择条件',
    confirm: '恢复已确认的新增内容',
    cancel: '取消',
    restored: '已恢复新增内容，已有记录保留。',
    currentInvalid: '无法读取当前保存数据，已停止恢复，不会覆盖已有数据。',
    invalid: '不支持此备份格式，未更改已有数据。',
    size: '请选择不超过5MB的文件。',
    limit: '合并后的数量或容量超限，已停止恢复，不会省略记录。',
    changed: '预览后保存数据已变化，请重新选择文件并确认。',
    rolledBack: '保存失败，已回到恢复前状态。备份文件仍可使用。',
    storage: '无法使用存储，恢复未完成，请查看恢复说明。',
    pending: '有中断的恢复记录。开始新的恢复前，请回到恢复之前的状态。',
    recover: '回到恢复前的状态',
    recovered: '已回到恢复前状态，可重新选择文件重试。',
    recoveryFile: '将恢复前的数据保存为文件',
    recoveryConflict:
      '恢复开始后有其他修改，已停止恢复以免覆盖。请保存恢复前的数据副本。',
    recoveryInvalid: '无法读取恢复记录，已保留现有数据及恢复记录。',
    check: '我已确认以上新增、重复、冲突及范围',
    refs: '没有源设置或笔记的引用会保留保存的值或ID。同一ID的设置不同会使用独立引用ID，避免关联到当前不同的设置。',
    share: '复制设置以便分享',
    shareHint: '复制游戏名称、设置值和检查日期，不改变设备设置。请先检查文本。',
    includeMemo: '包含自由备注（可选）',
    sharePreview: '要复制的内容',
    copy: '复制显示的文本',
    copied: '已复制，请自行粘贴到需要分享的位置。',
    manual: '自动复制失败，可选中下面的文本并手动复制。',
    manualSelect: '选中复制用文本',
  },
  es: {
    homeNext: 'Próximo paso de tu juego',
    homeOpen: 'Continuar este juego',
    heading: 'Guardar y restaurar todos los registros de Mis juegos',
    scope:
      'Protege juegos guardados, Mi PC, notas, ajustes, experimentos, progreso y próximos pasos, tareas y resolución, cambios leídos y elecciones de hoy.',
    privacy:
      'Los archivos se guardan y leen en este dispositivo, sin enviarlos al servidor. Pueden contener notas privadas; elige dónde guardarlos.',
    excluded:
      'No incluye marcadores de artículos, historial, respuestas sin guardar del diagnóstico ni credenciales.',
    export: 'Guardar copia completa',
    exported: 'Descarga iniciada. Comprueba que se guardó el archivo.',
    choose: 'Elegir archivo para restaurar',
    file: 'Archivo de copia',
    busy: 'Leyendo…',
    preview: 'Revisar antes de restaurar',
    legacy:
      'Formato antiguo de notas: solo se importarán las notas de soporte.',
    merge:
      'Se da prioridad a los registros existentes y solo se añaden los nuevos. No se duplican registros idénticos; si el mismo ID o juego tiene contenido distinto, se conserva el existente y no se importa el conflicto. Conserva el archivo original si hay conflictos.',
    category: 'Categoría',
    existing: 'Actual',
    incoming: 'Archivo',
    added: 'Añadir',
    duplicate: 'Duplicado',
    conflict: 'Conflicto (no se importa)',
    games: 'Juegos guardados',
    pc: 'Mi PC',
    notes: 'Notas de soporte',
    snapshots: 'Registros de ajustes',
    experiments: 'Experimentos',
    plans: 'Progreso y condiciones',
    activity: 'Tareas y resolución',
    read: 'Cambios oficiales leídos',
    today: 'Elecciones de hoy',
    confirm: 'Restaurar las adiciones revisadas',
    cancel: 'Cancelar',
    restored: 'Adiciones restauradas. Se conservaron los registros existentes.',
    currentInvalid:
      'No se pueden leer los datos guardados actuales. Se detuvo la restauración sin sobrescribirlos.',
    invalid:
      'No es un formato de copia compatible. Los datos existentes no cambiaron.',
    size: 'Elige un archivo de hasta 5MB.',
    limit:
      'La cantidad o tamaño resultante supera un límite. Se detuvo la restauración sin descartar registros.',
    changed:
      'Los datos cambiaron tras la vista previa. Vuelve a elegir el archivo y revísalo.',
    rolledBack:
      'Falló el guardado y se recuperó el estado previo. Puedes seguir usando el archivo.',
    storage:
      'No se puede usar el almacenamiento. La restauración no terminó; revisa las instrucciones de recuperación.',
    pending:
      'Hay una restauración interrumpida. Vuelve al estado anterior antes de iniciar otra.',
    recover: 'Volver al estado previo',
    recovered:
      'Se recuperó el estado previo. Puedes volver a elegir el archivo.',
    recoveryFile: 'Guardar datos previos en un archivo',
    recoveryConflict:
      'Hubo otros cambios después de iniciar la restauración. Se detuvo la recuperación para no sobrescribirlos. Guarda una copia de los datos previos.',
    recoveryInvalid:
      'No se puede leer el registro de recuperación. Se conservaron los datos y el registro.',
    check: 'He revisado las adiciones, duplicados, conflictos y alcance',
    refs: 'Las referencias sin ajustes o notas de origen conservan sus valores o ID. Los ajustes distintos con el mismo ID reciben un ID de referencia diferente para no vincularse a otros ajustes actuales.',
    share: 'Copiar ajustes para compartir',
    shareHint:
      'Copia nombre del juego, valores y fecha de comprobación. No cambia ajustes del equipo. Revisa el texto primero.',
    includeMemo: 'Incluir la nota libre (opcional)',
    sharePreview: 'Texto que se copiará',
    copy: 'Copiar el texto mostrado',
    copied: 'Copiado. Pégalo tú donde decidas compartirlo.',
    manual:
      'Falló la copia automática. Selecciona el texto y cópialo manualmente.',
    manualSelect: 'Seleccionar texto para copiar',
  },
};
