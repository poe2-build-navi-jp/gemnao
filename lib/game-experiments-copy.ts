import type { MyGamesLocale } from './my-games-copy';
const en = {
  heading: 'Settings experiment log',
  intro:
    'Your measurements and impressions, not results verified by this site or proof of a cause or effect. No device settings are detected or changed.',
  retention:
    'Only in this browser: up to 20 per game and 100 overall. Removing and re-adding a game keeps logs. No device sync; clearing site data deletes them. Saved logs stay fixed; add a new log for later results.',
  empty: 'No experiments recorded for this game yet.',
  create: 'Record an experiment',
  changed: 'What you changed',
  purpose: 'Goal',
  purposeHint: 'For example: FPS, image quality, quiet operation',
  before: 'Before snapshot',
  after: 'After snapshot',
  none: 'No reference',
  fpsBefore: 'FPS you measured before',
  fpsAfter: 'FPS you measured after',
  fpsHint:
    'Leave blank if not measured. Blank is stored separately from zero. Describe the test scene and conditions in your results.',
  unmeasured: 'Not measured',
  result: 'Your results, impressions and test conditions',
  performedOn: 'Date performed (your record)',
  decision: 'Your decision',
  pending: 'Pending',
  adopt: 'Decision to adopt',
  revert: 'Decision to revert',
  revertHint:
    '“Revert” records your decision only. It does not restore PC or game settings.',
  optional: 'Enter what changed or your results. Other fields are optional.',
  save: 'Save log',
  saved: 'Experiment saved in this browser. Device settings have not changed.',
  createdAt: 'Saved at',
  blank: 'Not entered',
  snapshotNone: 'No snapshot reference',
  archived:
    'Values captured when the experiment was saved. Deleting the original snapshot does not remove these values from this log.',
  referenceMissing:
    'The original snapshot is missing. Showing the captured values.',
  referenceUnknown:
    'The original snapshot status is unavailable. Showing the captured values.',
  referenceError:
    'The selected reference could not be read. Choose again or select “No reference”. Your draft and existing logs are preserved.',
  delete: 'Delete this log',
  confirmDelete: 'Delete log and captured values',
  deleteHint:
    'Deletes only this log and its captured values. Original snapshots and device settings stay unchanged.',
  cancel: 'Cancel',
  deleted:
    'Experiment deleted. Original snapshots and device settings have not changed.',
  error:
    'Browser storage is unavailable. Your draft and existing data are preserved.',
  invalid:
    'Check the data format or text length. Existing data was not overwritten.',
  emptyError: 'Enter what you changed or your results.',
  date: 'Use a real date no later than today, or leave it blank.',
  fps: 'FPS must be blank or a number from 0 to 99999.99, with up to two decimal places.',
  limit: 'Limit reached. Delete an unwanted log before saving.',
  missing: 'This log is no longer available. Check the list.',
  loading: 'Loading saved logs…',
  untitled: 'Results and impressions',
  snapshotsEmpty:
    'No snapshots available. You can save a log without references.',
  snapshotId: 'Source snapshot ID',
  legacy: 'Open existing solution notes and restore checklist',
};
export const gameExperimentsCopy: Record<MyGamesLocale, typeof en> = {
  ja: {
    heading: '設定変更の実験ログ',
    intro:
      '本人が測った数値や感想の記録です。サイトで検証した結果ではなく、変化の原因や効果を証明するものではありません。実機の設定取得・変更は行いません。',
    retention:
      'このブラウザだけにゲームごと20件、全体100件まで保存。ゲームを外しても残り、再追加で表示します。別端末には同期せず、サイトデータ削除で消えます。保存済みログは固定し、追加の結果は新しいログに記録します。',
    empty: 'このゲームの実験ログはまだありません。',
    create: '実験を記録',
    changed: '変更した項目',
    purpose: '目的',
    purposeHint: '例：FPS、画質、静音',
    before: '変更前のスナップショット',
    after: '変更後のスナップショット',
    none: '参照しない',
    fpsBefore: '本人が測ったFPS（変更前）',
    fpsAfter: '本人が測ったFPS（変更後）',
    fpsHint:
      '未測定なら空欄にしてください。0とは区別して保存します。測った場面や条件は結果・感想に残せます。',
    unmeasured: '未測定',
    result: '本人の結果・感想、測定条件',
    performedOn: '実施日（本人の記録）',
    decision: '本人の判断',
    pending: '保留',
    adopt: '採用する判断',
    revert: '戻す判断',
    revertHint:
      '「戻す」は本人の判断の記録です。PCやゲームの設定を実際に戻す操作ではありません。',
    optional: '変更した項目か結果・感想を1つ入力。他の項目は任意です。',
    save: 'ログを保存',
    saved: '実験ログをこのブラウザに保存しました。実機設定は変更していません。',
    createdAt: '保存日時',
    blank: '未入力',
    snapshotNone: 'スナップショットの参照なし',
    archived:
      '実験保存時点の参照値です。元のスナップショットを削除しても、このログ内の値は保持します。',
    referenceMissing:
      '元のスナップショットはありません。保存時点の値を表示しています。',
    referenceUnknown:
      '元のスナップショットの状態を確認できません。保存時点の値を表示しています。',
    referenceError:
      '選択した参照を読み取れません。選び直すか「参照しない」にしてください。入力と既存ログは保持しています。',
    delete: 'このログを削除',
    confirmDelete: 'ログと参照値を削除する',
    deleteHint:
      'このログとログ内の参照値だけを削除します。元のスナップショットや実機設定は変更しません。',
    cancel: 'キャンセル',
    deleted:
      '実験ログを削除しました。元のスナップショットや実機設定は変更していません。',
    error: '保存領域を利用できません。入力と既存データは保持しています。',
    invalid:
      '保存データの形式・文字数を確認してください。既存データは上書きしていません。',
    emptyError: '変更した項目か結果・感想を入力してください。',
    date: '実施日は実在する今日以前の日付にしてください。空欄にもできます。',
    fps: 'FPSは0以上の数値（小数2桁まで、99999.99以下）か空欄にしてください。',
    limit: '保存上限です。不要なログを削除してから保存してください。',
    missing: '対象のログが見つかりません。表示を確認してください。',
    loading: '保存したログを確認中…',
    untitled: '結果・感想の記録',
    snapshotsEmpty:
      '選べる設定記録はありません。参照なしでもログを保存できます。',
    snapshotId: '参照元ID',
    legacy: '既存の解決ノート・復元チェックを開く',
  },
  en: {
    heading: 'Settings experiment log',
    intro:
      'Your measurements and impressions, not results verified by this site or proof of a cause or effect. No device settings are detected or changed.',
    retention:
      'Only in this browser: up to 20 per game and 100 overall. Removing and re-adding a game keeps logs. No device sync; clearing site data deletes them. Saved logs stay fixed; add a new log for later results.',
    empty: 'No experiments recorded for this game yet.',
    create: 'Record an experiment',
    changed: 'What you changed',
    purpose: 'Goal',
    purposeHint: 'For example: FPS, image quality, quiet operation',
    before: 'Before snapshot',
    after: 'After snapshot',
    none: 'No reference',
    fpsBefore: 'FPS you measured before',
    fpsAfter: 'FPS you measured after',
    fpsHint:
      'Leave blank if not measured. Blank is stored separately from zero. Describe the test scene and conditions in your results.',
    unmeasured: 'Not measured',
    result: 'Your results, impressions and test conditions',
    performedOn: 'Date performed (your record)',
    decision: 'Your decision',
    pending: 'Pending',
    adopt: 'Decision to adopt',
    revert: 'Decision to revert',
    revertHint:
      '“Revert” records your decision only. It does not restore PC or game settings.',
    optional: 'Enter what changed or your results. Other fields are optional.',
    save: 'Save log',
    saved:
      'Experiment saved in this browser. Device settings have not changed.',
    createdAt: 'Saved at',
    blank: 'Not entered',
    snapshotNone: 'No snapshot reference',
    archived:
      'Values captured when the experiment was saved. Deleting the original snapshot does not remove these values from this log.',
    referenceMissing:
      'The original snapshot is missing. Showing the captured values.',
    referenceUnknown:
      'The original snapshot status is unavailable. Showing the captured values.',
    referenceError:
      'The selected reference could not be read. Choose again or select “No reference”. Your draft and existing logs are preserved.',
    delete: 'Delete this log',
    confirmDelete: 'Delete log and captured values',
    deleteHint:
      'Deletes only this log and its captured values. Original snapshots and device settings stay unchanged.',
    cancel: 'Cancel',
    deleted:
      'Experiment deleted. Original snapshots and device settings have not changed.',
    error:
      'Browser storage is unavailable. Your draft and existing data are preserved.',
    invalid:
      'Check the data format or text length. Existing data was not overwritten.',
    emptyError: 'Enter what you changed or your results.',
    date: 'Use a real date no later than today, or leave it blank.',
    fps: 'FPS must be blank or a number from 0 to 99999.99, with up to two decimal places.',
    limit: 'Limit reached. Delete an unwanted log before saving.',
    missing: 'This log is no longer available. Check the list.',
    loading: 'Loading saved logs…',
    untitled: 'Results and impressions',
    snapshotsEmpty:
      'No snapshots available. You can save a log without references.',
    snapshotId: 'Source snapshot ID',
    legacy: 'Open existing solution notes and restore checklist',
  },
  zh: {
    heading: '设置变更实验日志',
    intro:
      '记录你本人测量的数据和感受，不是本站验证的结果，也不能证明原因或效果。不会自动读取或修改设备设置。',
    retention:
      '仅保存在此浏览器：每款游戏最多20条，总共100条。移除并重新添加游戏会保留日志。不跨设备同步，清除网站数据会删除日志。已保存内容固定，后续结果请新增日志。',
    empty: '此游戏还没有实验日志。',
    create: '记录实验',
    changed: '更改的项目',
    purpose: '目的',
    purposeHint: '例如：FPS、画质、静音',
    before: '更改前的快照',
    after: '更改后的快照',
    none: '不引用',
    fpsBefore: '本人测量的FPS（更改前）',
    fpsAfter: '本人测量的FPS（更改后）',
    fpsHint: '未测量请留空，与0分开保存。可在结果中注明测试场景及条件。',
    unmeasured: '未测量',
    result: '本人结果、感受及测试条件',
    performedOn: '实施日期（本人记录）',
    decision: '本人判断',
    pending: '待定',
    adopt: '决定采用',
    revert: '决定恢复原设置',
    revertHint: '“恢复”仅记录你的判断，不会实际恢复电脑或游戏设置。',
    optional: '至少填写更改项目或结果感受，其他项目可留空。',
    save: '保存日志',
    saved: '已将实验保存到此浏览器，未修改设备设置。',
    createdAt: '保存时间',
    blank: '未填写',
    snapshotNone: '未引用快照',
    archived: '这是保存实验时捕获的值。删除原快照不会删除此日志内的值。',
    referenceMissing: '原快照已不存在，显示保存时的值。',
    referenceUnknown: '无法确认原快照状态，显示保存时的值。',
    referenceError:
      '无法读取所选引用，请重新选择或不引用。已保留草稿和已有日志。',
    delete: '删除此日志',
    confirmDelete: '删除日志及引用值',
    deleteHint: '仅删除此日志及其中的引用值，不修改原快照或设备设置。',
    cancel: '取消',
    deleted: '已删除实验，未修改原快照或设备设置。',
    error: '无法使用浏览器存储，已保留草稿及已有数据。',
    invalid: '请检查格式或文字长度，未覆盖已有数据。',
    emptyError: '请填写更改项目或结果感受。',
    date: '请输入不晚于今天的有效日期，也可留空。',
    fps: 'FPS请留空或填写0至99999.99的数值，最多两位小数。',
    limit: '已达上限，请先删除不需要的日志。',
    missing: '找不到该日志，请检查列表。',
    loading: '正在读取日志…',
    untitled: '结果与感受记录',
    snapshotsEmpty: '没有可选快照，也可不引用快照保存日志。',
    snapshotId: '源快照ID',
    legacy: '打开已有解决笔记及恢复检查表',
  },
  es: {
    heading: 'Registro de experimentos con ajustes',
    intro:
      'Tus mediciones e impresiones, no resultados verificados por el sitio ni pruebas de una causa o efecto. No se detectan ni cambian ajustes del dispositivo.',
    retention:
      'Solo en este navegador: hasta 20 por juego y 100 en total. Quitar y volver a añadir un juego conserva los registros. Sin sincronización; borrar los datos del sitio los elimina. Los registros guardados quedan fijos; añade otro para resultados posteriores.',
    empty: 'Aún no hay experimentos para este juego.',
    create: 'Registrar un experimento',
    changed: 'Qué cambiaste',
    purpose: 'Objetivo',
    purposeHint: 'Por ejemplo: FPS, calidad de imagen, silencio',
    before: 'Captura de ajustes anterior',
    after: 'Captura de ajustes posterior',
    none: 'Sin referencia',
    fpsBefore: 'FPS que mediste antes',
    fpsAfter: 'FPS que mediste después',
    fpsHint:
      'Déjalo vacío si no lo mediste. Vacío se guarda por separado de cero. Describe la escena y condiciones en los resultados.',
    unmeasured: 'Sin medir',
    result: 'Tus resultados, impresiones y condiciones',
    performedOn: 'Fecha de realización (tu registro)',
    decision: 'Tu decisión',
    pending: 'Pendiente',
    adopt: 'Decisión de adoptar',
    revert: 'Decisión de revertir',
    revertHint:
      '«Revertir» solo registra tu decisión. No restaura ajustes del PC ni del juego.',
    optional:
      'Introduce qué cambiaste o tus resultados. Los demás campos son opcionales.',
    save: 'Guardar experimento',
    saved:
      'Experimento guardado en este navegador. No han cambiado los ajustes del dispositivo.',
    createdAt: 'Guardado el',
    blank: 'Sin rellenar',
    snapshotNone: 'Sin referencia a ajustes',
    archived:
      'Valores capturados al guardar el experimento. Eliminar la captura original no elimina estos valores del registro.',
    referenceMissing:
      'La captura original ya no está. Se muestran los valores guardados.',
    referenceUnknown:
      'No se puede comprobar la captura original. Se muestran los valores guardados.',
    referenceError:
      'No se pudo leer la referencia. Elige otra o «Sin referencia». Se conservan el borrador y los registros existentes.',
    delete: 'Eliminar este experimento',
    confirmDelete: 'Eliminar registro y valores capturados',
    deleteHint:
      'Solo elimina este registro y sus valores capturados. No cambia las capturas originales ni el dispositivo.',
    cancel: 'Cancelar',
    deleted:
      'Experimento eliminado. No cambiaron las capturas originales ni los ajustes del dispositivo.',
    error:
      'No se puede usar el almacenamiento. Se conservan el borrador y los datos existentes.',
    invalid:
      'Comprueba el formato o la longitud del texto. No se sobrescribieron los datos existentes.',
    emptyError: 'Introduce qué cambiaste o tus resultados.',
    date: 'Usa una fecha real que no sea posterior a hoy, o déjala vacía.',
    fps: 'Los FPS deben estar vacíos o entre 0 y 99999.99, con hasta dos decimales.',
    limit:
      'Límite alcanzado. Elimina un registro que no necesites antes de guardar.',
    missing: 'Este registro ya no está disponible. Revisa la lista.',
    loading: 'Cargando registros…',
    untitled: 'Resultados e impresiones',
    snapshotsEmpty:
      'No hay capturas disponibles. Puedes guardar sin referencias.',
    snapshotId: 'ID de la captura original',
    legacy: 'Abrir notas de soluciones y lista de restauración existentes',
  },
};
