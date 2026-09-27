import type { CommonGuide } from './common-guides';
export const saveBackupGuide: CommonGuide = {
  slug: 'save-data-backup',
  title: 'PCゲームのセーブデータをバックアップする方法｜保存先・確認・復元手順',
  shortTitle: 'セーブデータのバックアップ',
  description:
    'Windows版ゲームのセーブ保存先3例とコピー対象を掲載。ファイル数・サイズ・ハッシュでコピー成功を確認する方法、Steam Cloudとの違い、元データを残して復元する手順を解説します。',
  conclusion:
    'ゲームを終了し、セーブを含むフォルダーを日付付きの別フォルダーへコピーします。コピー元とコピー先のファイル数・サイズを照合し、必要ならハッシュで内容の一致も確認してください。ただし「正しくコピーできた」と「ゲームで読み込める」は別です。復元時は現在のセーブを退避し、同期を止めてバックアップを元の保存先へ戻します。',
  checkedAt: '2026-09-27',
  status: 'verified',
  causes: [
    'ゲーム本体・設定ファイルとセーブ保存先の取り違え',
    '書き込み中のコピー、必要なファイルやフォルダーの取り漏れ',
    'クラウド同期による上書き、保存した版・MOD環境の違い',
  ],
  steps: [
    {
      title: '保存先とコピー対象を確認する',
      actions: [
        '正常に遊べている時のバックアップなら、ゲーム内で保存してタイトルへ戻り、ゲームを終了する。Steam Cloudを使う場合は同期完了を確認してからSteamも終了する。ほかのPC・端末でも同じゲームを終了しておく。',
        '下の表のパスをエクスプローラーのアドレスバーへ貼り付ける。使用中のWindowsユーザー・購入ストア・ゲーム名を確認し、コピーするフォルダーを特定する。',
        'すでにセーブが消えた・壊れた場合は、新規セーブの作成や同期のやり直しを先に行わず、残っているローカルデータを別の場所へコピーして保全する。',
      ],
    },
    {
      title: '元の名前で日付別にコピーする',
      actions: [
        'バックアップ先に「ゲーム名_2026-09-27_1700」のような日付・時刻付きの外側フォルダーを作る。その中へ、表のコピー対象をCtrl＋C→Ctrl＋Vでコピーする。切り取りは使わず、元のフォルダー名と内部構造を保つ。',
        '例：StardewValley_2026-09-27_1700の中にSavesを保存する。次回は新しい日付の外側フォルダーを作り、正常だった前回分を上書きしない。',
        'PC故障にも備えるなら外付けSSD・USBなど別の機器にも複製する。同じ物理ドライブ内の別フォルダーは、誤操作への備えにはなってもドライブ故障には備えられない。',
      ],
    },
    {
      title: 'コピーの一致を確認して記録する',
      actions: [
        'コピー元とコピー先の対象フォルダーをそれぞれ右クリック→「プロパティ」。集計完了後のファイル数・フォルダー数・「サイズ」のバイト数を比較する。「ディスク上のサイズ」は保存先の形式で変わるため一致条件にしない。',
        'コピー先を開き、主要セーブと付随ファイルがあるか確認する。コピーのエラー、主要ファイルが0バイト、数やサイズの不一致があれば完了扱いにせず、元データを残して原因を確認する。',
        '内容まで照合したい場合は下のハッシュ確認を使う。ゲームで読み込めるかの確認は復元手順に沿って行い、「目視照合のみ」「ハッシュ一致」「読み込み確認済み」を区別して記録する。',
      ],
    },
  ],
  faqs: [
    {
      question: 'Steam Cloudがあれば手動バックアップは不要ですか？',
      answer:
        '別の役割です。Steam Cloudは対応データを端末間で同期しますが、自分で選んだ過去の状態を必ず残す仕組みではありません。更新・MOD導入・PC移行前の状態を残すには、日付別の手元コピーも用意します。',
    },
    {
      question: 'Steamのゲームバックアップでセーブも保存されますか？',
      answer:
        'ゲーム本体のバックアップだけで、AppDataやSaved Gamesなどにあるセーブまで保存できたとは判断できません。この記事の保存先を別途コピーし、コピー先に対象データがあることを確認してください。',
    },
    {
      question: 'ファイル数と容量が同じなら成功ですか？',
      answer:
        'コピー漏れを見つける目安ですが、内容の一致までは保証しません。対応する全ファイルのハッシュを比較するとコピー内容を照合できます。それでも元から壊れたセーブを直すことはできず、読み込み可能かはゲーム側で確認します。',
    },
    {
      question: '最新のバックアップだけ残せばよいですか？',
      answer:
        '最新分が破損後のデータという場合もあります。直近分と正常に遊べていた過去の分を分けて残し、大型更新・MOD導入前の分は復旧を確認するまで保管すると、戻す時点を選べます。',
    },
    {
      question: '別のPC・ストア・アカウントにもそのまま戻せますか？',
      answer:
        '同じとは限りません。この記事は同じPC版・ストア・アカウント環境へ戻す手順を基本にしています。ストア間移行やクロスセーブは、ゲームごとの対応が必要です。',
    },
  ],
  related: [
    'steam-cloud-sync-error',
    'uninstall-save-data',
    'remove-mods-safely',
    'reset-config-file',
  ],
  sources: [
    {
      label: 'CD PROJEKT RED公式：Cyberpunk 2077のセーブ保存先',
      url: 'https://support.cdprojektred.com/ja/cyberpunk/pc/sp-technical/issue/1706/sebudetanobao-cun-chang-suo-wojiao-etekudasai',
    },
    {
      label: 'Larian公式：Baldur’s Gate 3の保存先・セーブ単位',
      url: 'https://larian.com/support/faqs/multiplayer-issues_84',
    },
    {
      label: 'Stardew Valley公式：保存先・必要ファイル・前日バックアップ',
      url: 'https://www.stardewvalley.net/missing-corrupt-save-file-troubleshooting-guide/',
    },
    {
      label: 'Steam公式：クラウド同期・ゲームごとの設定・競合',
      url: 'https://help.steampowered.com/ja/faqs/view/68D2-35AB-09A9-7678',
    },
    {
      label: 'Microsoft公式：Get-FileHashによる内容の比較',
      url: 'https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/get-filehash?view=powershell-5.1',
    },
  ],
};
