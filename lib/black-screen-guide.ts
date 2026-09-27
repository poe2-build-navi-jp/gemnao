import type { CommonGuide } from './common-guides';
export const blackScreenGuide: CommonGuide = {
  slug: 'black-screen',
  title: 'PCゲームが黒い画面になる時の対処法｜音だけ出る・起動後に真っ暗',
  shortTitle: '黒い画面・音だけ出る',
  description:
    'ゲームだけ黒い、音だけ出る、モニターに信号なしと出る場合を切り分け。Windowsの反応確認、画面モード・HDRの戻し方、設定ファイルの退避例、直らない時の次の対処を説明します。',
  conclusion:
    'まずAlt＋TabやCtrl＋Alt＋DeleteでWindowsの画面が出るか確認します。Windowsが映るならゲームの画面モード・解像度・直前に変えた設定を確認し、デスクトップまで映らないならモニターの入力先・接続・Windowsの表示を先に調べます。音だけ出ることは原因を断定する材料にはなりません。設定初期化はバックアップ後に対象ファイルだけを退避して比較します。',
  checkedAt: '2026-09-27',
  status: 'verified',
  causes: [
    '画面モード・解像度・HDRなど、変更した表示設定との不一致',
    'ゲームの設定ファイル、描画方式、MOD・オーバーレイの影響',
    'モニターの入力先・接続、GPUドライバー、Windows全体の表示問題',
  ],
  steps: [
    {
      title: 'Windowsの画面が出るか確認',
      actions: [
        'Alt＋Tabで他のアプリへ切り替える。見えなければCtrl＋Alt＋Deleteを押し、Windowsの画面が出るか確認する。音が鳴るだけでゲームが正常とは判断しない。',
        'Windowsが映る場合は下のゲーム側の手順へ。モニターに「信号なし」が出る場合やデスクトップも見えない場合は、下の接続・表示復旧の手順を先に試す。',
        '停止コードが出る、PCが再起動する、全操作に反応しない場合は、それぞれの関連記事へ進む。黒画面という見た目だけで同じ対処を繰り返さない。',
      ],
    },
    {
      title: '画面モードと直前の設定を戻す',
      actions: [
        'Windowsが操作できるなら、ゲームを選択した状態でAlt＋Enterを一度試す。対応ゲームで表示方式が変わり映ったら、ゲーム内の映像設定を開く。',
        'ウィンドウまたはボーダーレス、対象モニター、対応解像度を確認する。直前にHDRを変えた場合は下の手順でその項目だけ戻す。',
        '設定画面へ入れない場合は下のゲーム別例を参照し、対象が確認できた設定ファイルだけをバックアップして退避する。再生成されるかと表示の変化を確認し、直らなければ元に戻す。',
      ],
    },
    {
      title: '修復と追加機能を1つずつ比較',
      actions: [
        'Steam版はゲーム終了後、ライブラリ→対象を右クリック→プロパティ→インストール済みファイル→ゲームファイルの整合性を確認。完了後、同じ起動方法で比較する。',
        'Steamオーバーレイは対象ゲームのプロパティ→一般でオフにして比較する。直らなければ元へ戻し、次に自分で追加した録画・画面加工・MODを導入元の手順で1つずつ外す。',
        '複数ゲームでも同じ症状が出るなら、直前のGPUドライバー更新やモニター接続変更を確認する。改善した場合も、通常終了と再起動後に再発しないか確認する。',
      ],
    },
  ],
  faqs: [
    {
      question: '音だけ出るなら、ゲームは正常に動いていますか？',
      answer:
        '音が続いていても、映像処理やゲームの一部が止まっている場合があります。Alt＋TabやCtrl＋Alt＋DeleteでWindowsが映るかを確認し、ゲームだけの問題か表示全体の問題かを分けます。',
    },
    {
      question: 'Alt＋Enterを押しても変わりません',
      answer:
        'すべてのゲームがこのショートカットに対応するわけではありません。ゲームが選択されているかを確認し、一度試して変化がなければ、ゲーム内設定または対象を確認できる設定ファイルの退避へ進みます。',
    },
    {
      question: '「信号なし」と黒いゲーム画面は同じですか？',
      answer:
        '異なります。「信号なし」はモニター側が選択中の入力から映像信号を受け取れていない表示です。入力先・ケーブル・接続先を確認します。これだけでGPU故障やゲームの不具合とは断定できません。',
    },
    {
      question: '整合性確認をすれば画面設定も初期化されますか？',
      answer:
        '必ずしも初期化されません。整合性確認はゲームファイルの検証で、別の場所に保存されたユーザー設定が残る場合があります。設定変更直後の黒画面は、対象の設定ファイルを確認して別に切り分けます。',
    },
    {
      question: '黒い画面は何分待てばよいですか？',
      answer:
        '全ゲーム共通の待ち時間はありません。初回起動・更新後で読み込みやシェーダー構築の進捗が変化しているなら待ちます。進捗がなく毎回同じ場所で止まる場合は、経過時間とWindowsの反応を記録して切り分けます。',
    },
    {
      question: 'HDR切り替えで一瞬だけ黒くなるのも不具合ですか？',
      answer:
        '表示方式の切り替えに伴って一時的に画面が黒くなることがあります。自然に戻る一瞬の暗転と、そのまま映らなくなる症状を分けてください。HDR変更後から戻らない場合は、変更前の状態で比較します。',
    },
  ],
  related: [
    'reset-config-file',
    'pc-game-freezes',
    'gpu-driver-update',
    'pc-game-crash',
    'verify-steam-files',
    'reshade-uninstall',
  ],
  sources: [
    {
      label: 'Microsoft：Windowsの黒い画面・接続と表示復旧',
      url: 'https://support.microsoft.com/ja-jp/windows/hardware/display-graphics/troubleshooting-blank-screens-in-windows',
    },
    {
      label: 'Microsoft：HDRの設定と切り替え時の表示',
      url: 'https://support.microsoft.com/ja-jp/windows/hardware/display-graphics/hdr-settings-in-windows',
    },
    {
      label: 'Microsoft：リフレッシュレートと対応する表示設定',
      url: 'https://support.microsoft.com/en-us/windows/hardware/display-graphics/change-the-refresh-rate-on-your-monitor-in-windows',
    },
    {
      label: 'Epic公式：Fortniteの黒画面・描画方式・設定の保存',
      url: 'https://www.epicgames.com/help/c-34254770/c-38015632/a14140539?lang=ja',
    },
    {
      label:
        'ELDEN RING MOD作者の記録：GraphicsConfig.xmlの保存先（メーカー公式ではありません）',
      url: 'https://www.nexusmods.com/eldenring/mods/135',
    },
    {
      label: 'Steam：ゲームファイルの整合性確認',
      url: 'https://help.steampowered.com/ja/faqs/view/0C48-FCBD-DA71-93EB',
    },
  ],
};
