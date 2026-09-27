import type { CommonGuide } from './common-guides';
export const reshadeGuide: CommonGuide = {
  slug: 'reshade-uninstall',
  title: 'ReShadeのアンインストール方法｜消すファイルの見分け方・戻し方',
  shortTitle: 'ReShadeの削除・解除',
  description:
    'ReShadeを消したい、導入後にゲームが起動しない人向け。公式セットアップでのアンインストール、dxgi.dllなどの識別、プリセットの保全、Vulkanの注意点、削除後の確認と復元まで説明します。',
  conclusion:
    'ReShadeは、導入時に使ったゲームの実行ファイルと描画APIを公式セットアップで選び、アンインストールします。先にプリセットと設定をバックアップしてください。手動で外す場合は、ReShade製と確認したDLLだけをゲーム外へ退避します。エフェクトをオフにするだけでは、本体の読み込みは止まりません。',
  checkedAt: '2026-09-27',
  status: 'verified',
  causes: [
    'ReShade本体・エフェクト・アドオンとゲーム更新後の環境との相性',
    '別の描画MODやオーバーレイとの競合',
    '対象の実行ファイルや描画APIを取り違えた導入・解除',
  ],
  steps: [
    {
      title: '導入先とプリセットを控える',
      actions: [
        'ゲームを終了する。Steamならライブラリで対象ゲームを右クリック→「管理」→「ローカルファイルを閲覧」でインストール先を開く。ランチャーではなく、ReShade導入時に選んだゲームの.exeと、そのフォルダーを確認する。',
        'ReShade.ini、使用中のプリセット、reshade-shadersなど自分で追加した素材をゲーム外の「ReShade_backup_作業日」へコピーする。別の場所に保存したプリセットも対象。ReShade.iniのPresetPathが保存先の手がかりになる。',
        '選んだ.exeのフルパス、ReShadeの版、描画API、追加アドオンをメモする。DLLを手動で退避する場合は下の表で製品名を確認してからコピーする。',
      ],
    },
    {
      title: '導入方法に合わせてReShadeを解除する',
      actions: [
        '公式セットアップで入れた場合：reshade.meからセットアップを入手して実行し、導入時と同じゲーム.exeと描画APIを選ぶ。既存インストールが検出されたら「Uninstall ReShade and effects」を選んで進める。確認した6.8.0では初期選択が更新なので、アンインストールを明示的に選ぶ。',
        'MOD管理ツール・配布パック経由の場合：そのツールで該当MODを無効化・削除する。次回起動でファイルが再配置される場合もあるため、先に管理元から外す。',
        '手動配置のDirect3D・OpenGL版の場合：ReShade製と確認したDLLを元のフォルダーからバックアップとは別の退避先へ移す。DLLだけで読み込み停止を比較できる。関連設定・シェーダーの整理は起動確認後に行う。',
        'Vulkan・OpenXRの場合：公式セットアップで対象アプリを選んで解除する。共有レイヤーを扱うため、ゲームフォルダーのDLL退避だけで完了とは判断しない。',
      ],
    },
    {
      title: '起動を確認し、残すものを整理する',
      actions: [
        '普段と同じ起動方法でゲームを起動する。ReShadeの起動通知・オーバーレイの表示と、元のクラッシュや黒画面が変わったかを確認する。通知は非表示にもできるため、通知がないことだけで解除完了と決めない。',
        '起動できたら一度終了して再起動し、ReShadeが再び読み込まれないか確認する。不要なReShade.ini・ログ・シェーダーが残っていれば、下の表で所有元を確認して整理する。プリセットは再利用用に残してよい。',
        '変化がなければReShade以外のMOD・オーバーレイを1つずつ切り分ける。本体ファイルを誤って外した可能性がある場合は、まず退避先から戻す。必要に応じてSteamの「プロパティ」→「インストール済みファイル」→「ゲームファイルの整合性を確認」を行う。',
      ],
    },
  ],
  faqs: [
    {
      question: 'dxgi.dllを消せばReShadeは外れますか？',
      answer:
        'そのゲームの読み込み対象がReShade製のdxgi.dllなら、ゲーム外への退避で読み込みを止められます。ただし同名のDLLは別の描画ツールでも使います。ファイル名だけで判断せず、製品名と導入記録を照合してください。Vulkan版は別の仕組みです。',
    },
    {
      question: 'エフェクトをオフにするのとアンインストールは違いますか？',
      answer:
        '違います。エフェクトをオフにしてもReShade本体は読み込まれます。色味だけを比較したい時はオフで足りますが、起動時の競合を調べる時は本体の解除が必要です。',
    },
    {
      question:
        'プリセットの.iniファイルが残っています。削除に失敗しましたか？',
      answer:
        'プリセット単体はReShadeを読み込むプログラムではありません。残っているだけでは失敗とは判断できず、再利用用に保管できます。ゲーム自身の設定ファイルと混同しないよう、名前と保存先を控えてください。',
    },
    {
      question: 'Steamの整合性確認でReShadeも消えますか？',
      answer:
        '整合性確認だけで追加MODの全削除は保証できません。ReShadeはセットアップや導入元の管理ツールから解除し、ゲーム本体の修復とは分けて行います。',
    },
    {
      question: 'ReShadeを外した後も画面の色が変です',
      answer:
        'ゲーム内HDR・ガンマ、GPU側の色調整、別の描画MODなどを確認します。解除前後で同じ場面を比較すると、ReShadeの影響が残っているのかを切り分けやすくなります。',
    },
  ],
  related: [
    'remove-mods-safely',
    'steam-game-not-launching',
    'black-screen',
    'verify-steam-files',
    'reset-config-file',
  ],
  sources: [
    { label: 'ReShade公式：配布元・対応API', url: 'https://reshade.me/' },
    {
      label: '公式ソース v6.8.0：対象DLLの識別・アンインストール処理',
      url: 'https://github.com/crosire/reshade/blob/v6.8.0/setup/MainWindow.xaml.cs',
    },
    {
      label: '公式ソース v6.8.0：アンインストール画面の選択肢',
      url: 'https://github.com/crosire/reshade/blob/v6.8.0/setup/Pages/SelectOperationPage.xaml',
    },
    {
      label: '開発者crosireの説明：通常導入のDLL・設定・シェーダー',
      url: 'https://reshade.me/forum/troubleshooting/3407-how-to-uninstall-completely',
    },
    {
      label: 'Steam公式：ゲームファイルの整合性確認',
      url: 'https://help.steampowered.com/en/faqs/view/0C48-FCBD-DA71-93EB',
    },
  ],
};
