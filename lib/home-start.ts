// Update only when the home page's guidance changes substantially.
export const homeContentUpdatedAt = '2026-11-09';
export const homeDescription =
  'PCゲームが起動しない・落ちる・セーブが見つからないときの確認を、Steam本体・ゲーム・Windowsの症状から選べます。ゲムなおは公式情報の出典と本人報告を分け、手順と次の確認を案内します。';

export const homeStartChecks = [
  {
    title: 'Steam本体と、ゲームだけの不具合を分ける',
    description:
      'Steamの画面自体が開かない場合と、ライブラリは開くのにゲームが始まらない場合では、最初に読む手順が違います。どこまで進めるかで選んでください。',
    links: [
      { slug: 'steam-client-not-opening', label: 'Steam本体が開かない' },
      { slug: 'steam-game-not-launching', label: 'Steamは開くが、ゲームが起動しない' },
    ],
  },
  {
    title: 'ゲームの終了と、PC全体の停止を分ける',
    description:
      'ゲームだけが終了するのか、Windowsも青い画面になるのかを確認します。表示されたエラーと発生した場面を控えて、症状に合う記事へ進みます。',
    links: [
      { slug: 'pc-game-crash', label: 'ゲームが落ちる・強制終了する' },
      { slug: 'bsod-while-gaming', label: 'ゲーム中にブルースクリーンになる' },
    ],
  },
  {
    title: 'セーブは、書き換える前に残っているものを保全する',
    description:
      '復元や同期の前に、現在のファイルを別の場所へコピーして確認します。Steam Cloudの競合では、どちらを残すかを選ぶ前に保存時刻とコピーの有無を確かめてください。',
    links: [
      { slug: 'save-data-backup', label: 'セーブのコピー・確認・復元' },
      { slug: 'steam-cloud-basics', label: 'Steam Cloudの設定・競合・保存先' },
    ],
  },
] as const;
