import type { MyGamesLocale } from './my-games-copy';
const en = {
  heading: 'Official changes to check',
  scope:
    'A few manually reviewed announcements for saved games. Not a complete or continuously monitored feed. Your device and settings are not detected; check the conditions before acting.',
  empty:
    'No reviewed change cards are registered for this game. This does not mean there have been no changes.',
  rules:
    'Unread means not marked as read in this browser, not recently announced. First visits and new cards start unread. Removing and re-adding a game keeps its read state. Clearing site data removes it.',
  published: 'Official announcement',
  checked: 'Last checked',
  condition: 'Applies when',
  change: 'What changed',
  check: 'What to check',
  source: 'Official source (Japanese)',
  guide: 'Related troubleshooting guide',
  notes: 'Open saved settings and notes — choose the relevant game',
  ja: ' (Japanese)',
  fallback: 'This card is available in Japanese.',
  unread: 'Unread',
  read: 'Read',
  markRead: 'Mark as read',
  markUnread: 'Mark as unread',
  loading: 'Checking read state…',
  unknown: 'Read state unavailable',
  error:
    'Could not read or save the read state. Existing data was not replaced. Check browser storage settings.',
  saved: 'Read state saved in this browser.',
};
export const gameChangesCopy: Record<MyGamesLocale, typeof en> = {
  en,
  ja: {
    heading: '公式変更と、確認すること',
    scope:
      '保存ゲームに関する、一部の公式発表を手動確認して掲載しています。全件収集や常時監視はしていません。端末や設定は検出していないため、対象条件を確認してからご利用ください。',
    empty:
      'このゲームの確認済み変更カードは未登録です。「変更なし」を意味しません。',
    rules:
      '「未読」はこのブラウザで既読にしていない意味で、最近の発表とは限りません。初回と新しいカードは未読です。ゲームを外して再追加しても既読は保持され、サイトデータの削除で消えます。',
    published: '公式発表日',
    checked: '最終確認日',
    condition: '対象条件',
    change: '何が変わったか',
    check: '確認すること',
    source: '公式出典（日本語）',
    guide: '関連する解決記事',
    notes: '保存した設定・ノートを開く — 対象ゲームを選択',
    ja: '（日本語）',
    fallback: 'このカードは日本語で表示しています。',
    unread: '未読',
    read: '既読',
    markRead: '既読にする',
    markUnread: '未読に戻す',
    loading: '既読状態を確認中…',
    unknown: '既読状態を取得できません',
    error:
      '既読状態を読み取り・保存できませんでした。既存データは上書きしていません。ブラウザの保存設定を確認してください。',
    saved: '既読状態をこのブラウザに保存しました。',
  },
  zh: {
    heading: '官方变更与检查事项',
    scope:
      '仅收录人工核对过的部分已保存游戏公告，不是完整资讯或持续监测。不会检测设备或设置，请先核对适用条件。',
    empty: '尚未登记此游戏的已核对变更卡片，不代表没有变更。',
    rules:
      '“未读”指未在此浏览器标为已读，不表示近期公告。首次访问和新卡片均为未读。移除后重新添加游戏会保留已读状态，清除网站数据会将其删除。',
    published: '官方发布日期',
    checked: '最后核对日期',
    condition: '适用条件',
    change: '变更内容',
    check: '检查事项',
    source: '官方来源（日语）',
    guide: '相关排查指南',
    notes: '打开已保存设置与笔记 — 选择对应游戏',
    ja: '（日语）',
    fallback: '此卡片以日语显示。',
    unread: '未读',
    read: '已读',
    markRead: '标为已读',
    markUnread: '标为未读',
    loading: '正在读取已读状态…',
    unknown: '无法读取已读状态',
    error: '无法读取或保存已读状态，未覆盖已有数据。请检查浏览器存储设置。',
    saved: '已在此浏览器保存阅读状态。',
  },
  es: {
    heading: 'Cambios oficiales y qué comprobar',
    scope:
      'Algunos anuncios revisados manualmente para tus juegos guardados. No es un registro completo ni una vigilancia continua. No detectamos tu equipo ni ajustes; comprueba las condiciones antes de actuar.',
    empty:
      'No hay tarjetas de cambios verificados registradas para este juego. No significa que no haya cambios.',
    rules:
      '«Sin leer» significa que no lo has marcado como leído en este navegador, no que sea reciente. La primera visita y las tarjetas nuevas empiezan sin leer. Quitar y volver a añadir un juego conserva el estado; borrar los datos del sitio lo elimina.',
    published: 'Anuncio oficial',
    checked: 'Última comprobación',
    condition: 'Se aplica cuando',
    change: 'Qué cambió',
    check: 'Qué comprobar',
    source: 'Fuente oficial (japonés)',
    guide: 'Guía de solución relacionada',
    notes: 'Abrir ajustes y notas guardados — elige el juego correspondiente',
    ja: ' (japonés)',
    fallback: 'Esta tarjeta se muestra en japonés.',
    unread: 'Sin leer',
    read: 'Leído',
    markRead: 'Marcar como leído',
    markUnread: 'Marcar como no leído',
    loading: 'Consultando el estado de lectura…',
    unknown: 'Estado de lectura no disponible',
    error:
      'No se pudo leer o guardar el estado. No se reemplazaron los datos existentes. Revisa el almacenamiento del navegador.',
    saved: 'Estado de lectura guardado en este navegador.',
  },
};
