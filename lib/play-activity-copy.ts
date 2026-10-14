import type { MyGamesLocale } from './my-games-copy';
const en = {
  tasks: 'Small checklist',
  tasksHint:
    'Up to 8 optional tasks. Up to 20 deleted tasks stay available to restore, including after reload.',
  taskText: 'Task to add',
  add: 'Add',
  done: 'Done',
  remove: 'Delete',
  trash: 'Deleted tasks',
  restore: 'Restore',
  purge: 'Delete permanently',
  confirmPurge: 'Confirm permanent deletion (cannot undo)',
  taskSaved: 'Checklist saved.',
  status: 'Check official service information',
  unknown:
    'Live service status has not been retrieved. This screen does not declare a service healthy or recovered.',
  official: 'Official service-status page',
  linkChecked: 'Link checked on (not a live status check)',
  checkItems:
    'On the official page, check the game, region, platform and publication time against when your issue occurred. If current information is unavailable, status is unknown.',
  noLink:
    'No verified status link is registered for this game. Use the game guide below to find official support.',
  trouble: 'Resume troubleshooting',
  tried: 'What you tried and the result',
  nextFix: 'Next fix to try',
  note: 'Related existing support note (optional)',
  noteMissing:
    'The referenced support note is missing. Your troubleshooting record is retained.',
  noteError:
    'Support notes cannot be read. Keep the reference unchanged and edit your troubleshooting record.',
  openNote: 'Go to support notes',
  editTrouble: 'Edit troubleshooting',
  savedTrouble: 'Troubleshooting progress saved.',
  attempts: 'Attempts already saved in the support note',
  emptyTasks: 'No tasks yet.',
  limit:
    'Limit reached: 8 active and 20 deleted tasks. Keep a copy of anything you need before clearing items.',
  newTab: 'New tab; choose language at destination',
};
export const playActivityCopy: Record<MyGamesLocale, typeof en> = {
  ja: {
    tasks: 'やることリスト',
    tasksHint:
      '任意の小さなタスクを8件まで。削除した項目は20件まで保持し、再読み込み後も復元できます。',
    taskText: '追加するタスク',
    add: '追加',
    done: '完了',
    remove: '削除',
    trash: '削除した項目',
    restore: '復元',
    purge: '完全に削除',
    confirmPurge: '完全削除を確定（復元不可）',
    taskSaved: 'リストを保存しました。',
    status: '公式障害情報の確認',
    unknown:
      '現在の障害状況は未取得です。この画面では正常・復旧済みと判定しません。',
    official: '公式の障害確認ページ',
    linkChecked: 'リンク先確認日（現在の稼働状況の確認日ではありません）',
    checkItems:
      '公式ページで対象ゲーム・地域・プラットフォーム・掲載時刻を確認し、自分の発生時刻と照合してください。最新の案内が表示されない場合は状況不明です。',
    noLink:
      'このゲームの確認済み障害リンクは未登録です。下のゲーム総合ガイドから公式サポートを確認してください。',
    trouble: '対処の途中から再開',
    tried: '試した対処と結果',
    nextFix: '次に試す対処',
    note: '関連する既存の相談メモ（任意）',
    noteMissing:
      '参照した相談メモが見つかりません。対処の記録は保持しています。',
    noteError:
      '相談メモを読み取れません。メモの参照は変更せず、対処のみ記録できます。',
    openNote: '相談メモの一覧へ',
    editTrouble: '対処を編集',
    savedTrouble: '対処の続きを保存しました。',
    attempts: '相談メモに保存済みの対処',
    emptyTasks: 'タスクはまだありません。',
    limit:
      '上限です。有効タスクは8件、削除済みは20件まで。必要な内容を控えてから整理してください。',
    newTab: '新しいタブ・リンク先で言語を選択',
  },
  en: {
    tasks: 'Small checklist',
    tasksHint:
      'Up to 8 optional tasks. Up to 20 deleted tasks stay available to restore, including after reload.',
    taskText: 'Task to add',
    add: 'Add',
    done: 'Done',
    remove: 'Delete',
    trash: 'Deleted tasks',
    restore: 'Restore',
    purge: 'Delete permanently',
    confirmPurge: 'Confirm permanent deletion (cannot undo)',
    taskSaved: 'Checklist saved.',
    status: 'Check official service information',
    unknown:
      'Live service status has not been retrieved. This screen does not declare a service healthy or recovered.',
    official: 'Official service-status page',
    linkChecked: 'Link checked on (not a live status check)',
    checkItems:
      'On the official page, check the game, region, platform and publication time against when your issue occurred. If current information is unavailable, status is unknown.',
    noLink:
      'No verified status link is registered for this game. Use the game guide below to find official support.',
    trouble: 'Resume troubleshooting',
    tried: 'What you tried and the result',
    nextFix: 'Next fix to try',
    note: 'Related existing support note (optional)',
    noteMissing:
      'The referenced support note is missing. Your troubleshooting record is retained.',
    noteError:
      'Support notes cannot be read. Keep the reference unchanged and edit your troubleshooting record.',
    openNote: 'Go to support notes',
    editTrouble: 'Edit troubleshooting',
    savedTrouble: 'Troubleshooting progress saved.',
    attempts: 'Attempts already saved in the support note',
    emptyTasks: 'No tasks yet.',
    limit:
      'Limit reached: 8 active and 20 deleted tasks. Keep a copy of anything you need before clearing items.',
    newTab: 'New tab; choose language at destination',
  },
  zh: {
    tasks: '小型待办清单',
    tasksHint: '最多8个可选任务。最多保留20个已删除任务，重新加载后仍可恢复。',
    taskText: '要添加的任务',
    add: '添加',
    done: '完成',
    remove: '删除',
    trash: '已删除的任务',
    restore: '恢复',
    purge: '永久删除',
    confirmPurge: '确认永久删除（无法恢复）',
    taskSaved: '已保存清单。',
    status: '查看官方服务信息',
    unknown: '尚未获取实时服务状态。此页面不会判定服务正常或已恢复。',
    official: '官方服务状态页面',
    linkChecked: '链接检查日期（并非实时状态检查日期）',
    checkItems:
      '在官方页面核对游戏、地区、平台、发布时间与自己的故障时间。如果没有最新信息，状态就是未知。',
    noLink: '尚未登记此游戏已验证的状态链接。请从下方游戏指南查找官方支持。',
    trouble: '继续排查问题',
    tried: '已尝试的处理及结果',
    nextFix: '接下来尝试的处理',
    note: '关联已有的问题笔记（可选）',
    noteMissing: '找不到引用的问题笔记。排查记录仍然保留。',
    noteError: '无法读取问题笔记。可保持引用不变，仅编辑排查记录。',
    openNote: '前往问题笔记列表',
    editTrouble: '编辑排查记录',
    savedTrouble: '已保存排查进度。',
    attempts: '问题笔记中已保存的尝试',
    emptyTasks: '还没有任务。',
    limit: '已达上限：8个有效任务和20个已删除任务。清理前请保存需要的内容。',
    newTab: '新标签页；在目标网站选择语言',
  },
  es: {
    tasks: 'Lista breve de tareas',
    tasksHint:
      'Hasta 8 tareas opcionales. Se conservan hasta 20 tareas eliminadas para restaurarlas, incluso tras recargar.',
    taskText: 'Tarea que añadir',
    add: 'Añadir',
    done: 'Hecho',
    remove: 'Eliminar',
    trash: 'Tareas eliminadas',
    restore: 'Restaurar',
    purge: 'Eliminar definitivamente',
    confirmPurge: 'Confirmar eliminación definitiva (sin deshacer)',
    taskSaved: 'Lista guardada.',
    status: 'Consultar información oficial del servicio',
    unknown:
      'No se ha consultado el estado en directo. Esta pantalla no declara que el servicio funcione ni se haya recuperado.',
    official: 'Página oficial de estado',
    linkChecked:
      'Enlace comprobado el (no es una consulta de estado en directo)',
    checkItems:
      'En la página oficial, comprueba juego, región, plataforma y hora de publicación frente a la hora del problema. Sin información actual, el estado es desconocido.',
    noLink:
      'No hay un enlace de estado verificado para este juego. Busca el soporte oficial en la guía del juego que aparece debajo.',
    trouble: 'Retomar la solución del problema',
    tried: 'Qué probaste y su resultado',
    nextFix: 'Próxima solución que probar',
    note: 'Nota de soporte existente relacionada (opcional)',
    noteMissing:
      'Falta la nota referenciada. Se conserva tu registro de resolución.',
    noteError:
      'No se pueden leer las notas. Mantén la referencia y edita solo el registro de resolución.',
    openNote: 'Ir a las notas de soporte',
    editTrouble: 'Editar resolución',
    savedTrouble: 'Progreso de resolución guardado.',
    attempts: 'Intentos guardados en la nota de soporte',
    emptyTasks: 'Todavía no hay tareas.',
    limit:
      'Límite: 8 tareas activas y 20 eliminadas. Copia lo que necesites antes de borrar elementos.',
    newTab: 'Pestaña nueva; elige idioma en el destino',
  },
};
