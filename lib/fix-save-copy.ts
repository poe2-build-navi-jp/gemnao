export const fixSaveCopy = {
  ja: {
    jaGuide: '（日本語）',
    heading: '効いた対処をマイゲームに残す',
    save: 'ゲームと効いた対処を保存',
    saveNote: '効いた対処を保存',
    version: 'あなたのゲーム版（任意）',
    notesLimit:
      'メモは{count}文字まで。版・記事確認日の記録用に余白を確保します。',
    unknown: '未記録',
    checked: '保存時の記事確認日',
    caution: '保存時の記録です。更新後も同じ条件で有効とは限りません。',
    reported: '本人がこの手順で解決したと記録。原因の証明ではありません。',
    privacy:
      'このブラウザだけに保存します。ゲーム版やノートはGAへ送信しません。',
    saved: '対処を保存しました。',
    already:
      '同じ記事・手順の解決ノートが保存済みです。既存の内容は変更していません。',
    open: 'マイゲームで見返す',
    error: '保存できませんでした。既存データを上書きせず、入力を残しています。',
    gameError:
      'ノートは保存済みですが、ゲームを登録できませんでした。保存設定を確認して登録だけ再試行できます。',
    limit:
      'ノートは保存済みです。ゲーム登録は10本までのため、1本外して登録だけ再試行してください。',
    retry: 'ゲーム登録だけ再試行',
    history: '前回の対処',
    recorded: '記録日',
    current: '現在の記事確認日',
    recheck: '現在の手順を確認',
    noFixes: '保存した解決ノートはまだありません。',
    details: '保存時の版・確認日・メモ',
    step: '効いた手順',
  },
  en: {
    jaGuide: ' (Japanese)',
    heading: 'Keep the fix in My Games',
    save: 'Save the game and fix',
    saveNote: 'Save this fix',
    version: 'Your game version (optional)',
    notesLimit:
      'Notes: up to {count} characters, leaving room for the version and guide review date.',
    unknown: 'Not recorded',
    checked: 'Guide review date at save time',
    caution:
      'This is a past record. An update may change whether it applies to your setup.',
    reported:
      'The player recorded that this step fixed the issue; this is not proof of cause.',
    privacy:
      'Saved in this browser only. Game versions and notes are not sent to GA.',
    saved: 'Fix saved.',
    already:
      'A solved note for this article and step already exists. Its content was not changed.',
    open: 'Review in My Games',
    error:
      'Could not save. Existing data was not overwritten and your input remains.',
    gameError:
      'The note is saved, but the game could not be registered. Check storage and retry game registration only.',
    limit:
      'The note is saved. The game list is limited to 10: remove a game and retry registration only.',
    retry: 'Retry game registration only',
    history: 'Your previous fix',
    recorded: 'Recorded on',
    current: 'Current guide review date',
    recheck: 'Review the current steps',
    noFixes: 'No solved notes saved yet.',
    details: 'Version, review date and notes at save time',
    step: 'Step that helped',
  },
  zh: {
    jaGuide: '（日语）',
    heading: '把有效方法保存在我的游戏',
    save: '保存游戏和有效方法',
    saveNote: '保存此方法',
    version: '你的游戏版本（可选）',
    notesLimit: '笔记最多{count}个字符，已为版本和文章核对日期预留空间。',
    unknown: '未记录',
    checked: '保存时的文章核对日期',
    caution: '这是过去的记录，更新后不一定仍适用于你的环境。',
    reported: '本人记录此步骤解决了问题，但这不是原因证明。',
    privacy: '仅保存在此浏览器中。游戏版本和笔记不会发送到GA。',
    saved: '已保存方法。',
    already: '已存在此文章和步骤的解决笔记，没有更改原有内容。',
    open: '在我的游戏查看',
    error: '无法保存，未覆盖原有数据，输入仍保留。',
    gameError: '笔记已保存，但无法登记游戏。请检查存储设置，仅重试游戏登记。',
    limit: '笔记已保存。最多登记10款游戏，请先移除一款，再仅重试登记。',
    retry: '仅重试游戏登记',
    history: '上次的有效方法',
    recorded: '记录日期',
    current: '当前文章核对日期',
    recheck: '查看当前步骤',
    noFixes: '还没有保存解决笔记。',
    details: '保存时的版本、核对日期和笔记',
    step: '有效的步骤',
  },
  es: {
    jaGuide: ' (japonés)',
    heading: 'Conserva la solución en Mis juegos',
    save: 'Guardar juego y solución',
    saveNote: 'Guardar esta solución',
    version: 'Tu versión del juego (opcional)',
    notesLimit:
      'Notas: hasta {count} caracteres, con espacio reservado para la versión y la fecha de revisión.',
    unknown: 'No registrada',
    checked: 'Fecha de revisión de la guía al guardar',
    caution:
      'Es un registro anterior. Una actualización puede cambiar si se aplica a tu equipo.',
    reported:
      'El jugador registró que este paso resolvió el problema; no demuestra la causa.',
    privacy:
      'Solo en este navegador. No enviamos versiones del juego ni notas a GA.',
    saved: 'Solución guardada.',
    already:
      'Ya existe una nota resuelta para este artículo y paso. No cambiamos su contenido.',
    open: 'Consultar en Mis juegos',
    error:
      'No se pudo guardar. No se sobrescribieron datos y conservamos tu entrada.',
    gameError:
      'La nota está guardada, pero no se pudo registrar el juego. Revisa el almacenamiento y reintenta solo el registro.',
    limit:
      'La nota está guardada. El límite es de 10 juegos: quita uno y reintenta solo el registro.',
    retry: 'Reintentar solo el registro del juego',
    history: 'Tu solución anterior',
    recorded: 'Fecha del registro',
    current: 'Revisión actual de la guía',
    recheck: 'Revisar los pasos actuales',
    noFixes: 'Aún no hay notas resueltas guardadas.',
    details: 'Versión, revisión y notas al guardar',
    step: 'Paso que ayudó',
  },
} as const;
