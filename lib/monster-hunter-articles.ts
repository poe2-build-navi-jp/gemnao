import type { GameArticle } from '@/lib/game-articles';

// モンスターハンターワイルズ（PC・Steam版）の個別記事。
// 2026-09-27にカプコン公式トラブルシューティングガイド、Steamの公式アップデート告知
// （Ver.1.042系・ドライバーのお知らせ）、Steamストア、PCGamingWikiで確認した内容だけを載せています。
// STEPのidは解決報告（D1）の集計キーなので、既存のidは変更しないでください。
const sources = {
  capcom: {
    label: 'カプコン公式：Monster Hunter Wilds トラブルシューティングガイド',
    url: 'https://steamcommunity.com/app/2246340/discussions/0/596267902352499417/',
  },
  driverNotice: {
    label: 'Steam公式お知らせ：Regarding your Video/Graphics Drivers',
    url: 'https://store.steampowered.com/news/app/2246340/view/1811772772359267',
  },
  update1042: {
    label: 'Steam公式：Update Summary (Ver.1.042.00.00)',
    url: 'https://store.steampowered.com/news/app/2246340/view/1839676055896017',
  },
  update104202: {
    label: 'Steam公式：Update Summary (Ver.1.042.00.02)',
    url: 'https://store.steampowered.com/news/app/2246340/view/1840944183778483',
  },
  steam: {
    label: 'Steamストア：モンスターハンターワイルズ（動作環境・対応機能）',
    url: 'https://store.steampowered.com/app/2246340',
  },
  pcgw: {
    label: 'PCGamingWiki：Monster Hunter Wilds（保存場所・画面設定・入力）',
    url: 'https://www.pcgamingwiki.com/wiki/Monster_Hunter_Wilds',
  },
  msHdr: {
    label: 'Microsoft：Windows の HDR 設定',
    url: 'https://support.microsoft.com/ja-jp/windows/hardware/display-graphics/hdr-settings-in-windows',
  },
  msHdrCalibration: {
    label: 'Microsoft：Windows HDR 調整アプリ',
    url: 'https://support.microsoft.com/ja-jp/windows/hardware/display-graphics/calibrate-your-hdr-display-using-the-windows-hdr-calibration-app',
  },
};

type Draft = Omit<
  GameArticle,
  | 'gameSlug'
  | 'checkedAt'
  | 'symptoms'
  | 'seoTitle'
  | 'status'
  | 'targetVersion'
> & { seoTitle?: string };

const make = (draft: Draft): GameArticle => ({
  gameSlug: 'monster-hunter-wilds',
  checkedAt: '2026-09-27',
  status: 'verified',
  targetVersion: 'Steam版 Ver.1.042.00.02（2026年9月27日時点の最新）',
  symptoms: draft.steps.map((step) => ({ label: step.title, target: step.id })),
  seoTitle: draft.title,
  ...draft,
});

const installDir = String.raw`C:\Program Files (x86)\Steam\steamapps\common\MonsterHunterWilds`;
const driverFact = {
  label: '公式の推奨ドライバー',
  value: 'NVIDIA GeForce 581.57以降／AMD Radeon 25.9.1以降',
};
const hdTextureFact = {
  label: '高解像度テクスチャパック',
  value: 'VRAM 16GB以上が必要。入れているだけで不安定になる場合がある（公式）',
};

export const monsterHunterArticles: GameArticle[] = [
  make({
    slug: 'not-launching',
    category: 'launch',
    title:
      'モンハンワイルズが起動しない・クラッシュする時の対処法【PC・Steam版】',
    shortTitle: '起動しない・クラッシュ',
    symptom:
      '起動しない、起動直後やシェーダー準備中に落ちる、プレイ中にクラッシュする、アップデートやMOD導入の後から動かない場合の切り分け手順です。',
    conclusion:
      'MODを入れている場合は、まずすべて退避して本体だけにします。次にSteamの整合性確認、GPUドライバーの更新（公式推奨はNVIDIA 581.57以降・AMD 25.9.1以降）を行います。VRAM 16GB未満で高解像度テクスチャパックを入れている場合は、無効にすると安定することがあります。',
    description:
      'カプコンの公式トラブルシューティングガイドの項目を、多くの人に関係する順に並べ直しました。症状が分かっている場合は、早見表から該当するSTEPへ進めます。',
    causes: [
      'MODや外部ツールが本体の更新に対応していない',
      'ゲームファイルの不足・破損',
      '公式推奨より古いGPUドライバー（AMDは一部の新しい版にも問題あり）',
      'VRAM 16GB未満で高解像度テクスチャパックを入れている',
      'セキュリティソフトの誤検知、ノートPCで内蔵GPUが使われている',
    ],
    quickFacts: [
      driverFact,
      {
        label: 'AMDの注意',
        value:
          '25.10.2以降の一部の版で、RX 5500 XT・7800 XTなど一部のPCに問題が確認されている（公式）',
      },
      hdTextureFact,
      { label: 'インストール先（標準）', value: installDir, copy: true },
      {
        label: 'CPUの条件',
        value: 'AVX2命令に対応したCPUが必要（PCGamingWiki）',
      },
    ],
    diagnosis: [
      {
        symptom: 'MODを入れてから・更新してから起動しない',
        cause: 'MODが最新版に対応していない',
        stepId: 'remove-mods',
      },
      {
        symptom: '起動直後に落ちる、エラーが出る',
        cause: 'ゲームファイルの破損',
        stepId: 'verify-files',
      },
      {
        symptom: 'プレイ中に強制終了する',
        cause: '古いGPUドライバー',
        stepId: 'update-driver',
      },
      {
        symptom: '高解像度テクスチャパックを入れてから不安定',
        cause: 'VRAM不足（16GB未満）',
        stepId: 'check-vram',
      },
      {
        symptom: '画面設定を変えてから起動しない',
        cause: 'config.iniの設定',
        stepId: 'reset-config',
      },
      {
        symptom: 'シェーダー準備中に「VRAM不足」で落ちる',
        cause: 'CPUの破損の可能性（公式）',
        stepId: 'shader-crash',
      },
    ],
    steps: [
      {
        id: 'remove-mods',
        title: 'MODをすべて退避して、本体だけで起動する',
        summary: '更新後は、以前動いていたMODでも起動を妨げることがあります。',
        time: '約5分',
        risk: 'medium',
        actions: [
          'ゲームを終了する',
          'MOD管理ツールを使っている場合は、すべて無効にする',
          '手動で入れたファイルは、元の場所を記録してからゲームフォルダの外へ移す',
          'Steamからゲームを起動して確認する',
        ],
        note: '削除ではなく「退避」にすると元に戻せます。',
      },
      {
        id: 'verify-files',
        title: 'Steamでゲームファイルの整合性を確認する',
        summary:
          'インストール直後でも修復が必要な場合があると、公式ガイドが案内しています。',
        time: '5〜15分',
        risk: 'low',
        actions: [
          'PCを再起動する',
          'Steamのライブラリでゲームを右クリック→「プロパティ」→「インストール済みファイル」→「ゲームファイルの整合性を確認」を押す',
          '完了後にゲームを起動する',
        ],
        note: '「1つ以上のファイルの検証に失敗」と出ても、ローカルの設定ファイルであれば無視してよいと公式ガイドに記載されています。',
      },
      {
        id: 'update-driver',
        title: 'GPUドライバーを公式推奨の版へ更新する',
        summary:
          'カプコンはNVIDIA 581.57以降、AMD 25.9.1以降を推奨しています。',
        time: '10〜20分',
        risk: 'low',
        actions: [
          'NVIDIAはNVIDIAアプリの「ドライバー」、AMDはAMD Softwareから更新する',
          'NVIDIAアプリでは「カスタムインストール」で「クリーンインストール」を選ぶと、古い設定を消して入れ直せる（公式お知らせの手順）',
          'インストール後、ゲームとSteamを閉じてからPCを再起動する',
        ],
        note: 'AMDは25.10.2以降の一部の版で、RX 5500 XT・7800 XTなど一部のPCに問題が確認されています。新しい版で不安定な場合は、25.9.1以降の範囲で別の版も試してください。',
      },
      {
        id: 'check-vram',
        title: '高解像度テクスチャパックを無効にする',
        summary:
          '公式によると、VRAMが16GB未満だと、入れているだけで動作や表示が不安定になる場合があります。',
        time: '約3分',
        risk: 'low',
        actions: [
          'Steamのライブラリでゲームを右クリック→「プロパティ」→「DLC」を開く',
          '「モンスターハンターワイルズ - 高解像度テクスチャパック」のインストール欄のチェックを外す',
          'Steamを再起動してからゲームを起動する',
        ],
        note: 'ゲームを入れているドライブの空き容量も確認してください。高解像度テクスチャパックを入れると約150GBが必要です（PCGamingWiki）。',
      },
      {
        id: 'reset-config',
        title: 'config.iniを退避して設定を作り直す',
        summary: '壊れた表示設定が原因の場合に、初期設定へ戻して確認できます。',
        time: '約3分',
        risk: 'medium',
        actions: [
          'ゲームを終了する',
          'Steamでゲームを右クリック→「管理」→「ローカルファイルを閲覧」でインストール先を開く',
          'config.iniをデスクトップなどへコピーしてから、元のファイルをゲームフォルダの外へ移す',
          'ゲームを起動し、新しいconfig.iniが作られるか確認する',
        ],
        note: '起動できたら、古い設定を一度に戻さず、ゲーム内の設定を少しずつ調整してください。',
      },
      {
        id: 'security',
        title: 'セキュリティソフトの除外リストに追加する',
        summary:
          '誤検知で起動しない・FPSが下がる可能性があるとして、公式が除外設定を案内しています。',
        time: '約5分',
        risk: 'medium',
        actions: [
          String.raw`MonsterHunterWilds.exe（標準：C:\Program Files (x86)\Steam\steamapps\common\MonsterHunterWilds）を除外リストに追加する`,
          String.raw`Steam.exe（標準：C:\Program Files (x86)\Steam）と、Steamのデータフォルダ（標準：C:\Users\%USERNAME%\AppData\Local\Steam）も追加する`,
          '以前に追加済みの場合は、一度削除してから追加し直す',
        ],
      },
      {
        id: 'gpu-select',
        title: 'ゲームを高パフォーマンスGPUで動かす',
        summary:
          '内蔵GPUと外部GPUがあるノートPCなどでは、ゲームが内蔵GPUで動くことがあります。',
        time: '約3分',
        risk: 'low',
        actions: [
          'Windowsの「設定」→「システム」→「ディスプレイ」→「グラフィック」を開く',
          '一覧からゲームを選ぶ（ない場合は「参照」でMonsterHunterWilds.exeを登録する）',
          '「オプション」で「高パフォーマンス」を選び、ゲームを再起動する',
        ],
        note: '公式ガイドでは、モバイルGPU・外付けGPUは基本的に動作保証の対象外とされています。',
      },
      {
        id: 'shader-crash',
        title: 'シェーダー準備中にVRAM不足で落ちる場合はメーカーに相談する',
        summary:
          '公式ガイドは、この症状ではCPUが破損している可能性があるとして、Intel社またはPCの購入先への問い合わせを案内しています。',
        time: '—',
        risk: 'low',
        actions: [
          'Windows＋Rキーで「msinfo32」を実行し、CPUの型番を確認する',
          'Intel製CPUの場合は、Intel社またはPCの購入先に症状と型番を伝えて相談する',
          'あわせてPCメーカー・マザーボードメーカーのBIOSが最新か確認する',
        ],
      },
    ],
    avoid: [
      'MODを入れたまま原因を探さない。まず本体だけの状態にする',
      'Windows Insider Programなど一般提供前のWindowsで切り分けない（公式に動作保証外）',
      'セキュリティソフトを無効にしたまま遊ばない',
    ],
    cautions: [
      '作業前にセーブデータをバックアップしてください（「セーブデータの場所」記事を参照）。',
      '公式の推奨ドライバーは変わることがあります。最新のお知らせも確認してください。',
    ],
    faqs: [
      {
        question: 'グラフィックドライバーはどの版を使えばいいですか？',
        answer:
          'カプコンの公式お知らせでは、NVIDIA GeForceは581.57以降、AMD Radeonは25.9.1以降が推奨されています。AMDは25.10.2以降の一部の版で、一部のPCに問題が確認されています。',
      },
      {
        question: 'クラッシュした時の記録はどこにありますか？',
        answer: String.raw`公式ガイドによると、クラッシュ時には標準で「C:\Program Files (x86)\Steam\steamapps\common\MonsterHunterWilds」に「CrashReport」フォルダが作られ、発生日時のzipがほとんどの場合に出力されます。問い合わせる時のために、発生日時に一番近いzipを残しておきます。`,
      },
      {
        question: 'どこに問い合わせればいいですか？',
        answer:
          '公式ガイドは、モンスターハンター公式サイトのサポート窓口を案内しています。PCのスペック（DxDiag.txt）、config.iniのコピー、現象の詳細と再現手順、CrashReportを用意すると調査がスムーズです。',
      },
    ],
    sources: [sources.capcom, sources.driverNotice, sources.pcgw],
    related: ['config-file', 'system-requirements', 'fps', 'mod'],
    metaDescription:
      'モンハンワイルズPC版が起動しない・クラッシュする時の対処法。公式推奨ドライバー（NVIDIA 581.57・AMD 25.9.1以降）、高解像度テクスチャパックの無効化、MOD退避、整合性確認、セキュリティソフト除外を症状別に解説。',
  }),
  make({
    slug: 'save-data',
    category: 'save',
    title:
      'モンハンワイルズのセーブデータの場所｜バックアップと復元方法【Steam版】',
    shortTitle: 'セーブデータの場所',
    symptom:
      'セーブデータの保存先を開きたい、MOD導入やPC移行の前にバックアップしたい、消えたセーブを戻したい、体験版のデータを引き継ぎたい人向けです。',
    conclusion: String.raw`Steam版のセーブは「<Steamのインストール先>\userdata\<数字のアカウントID>\2246340\remote\win64_save」にあります（標準のSteamの場所は「C:\Program Files (x86)\Steam」）。win64_saveフォルダを丸ごと別の場所へコピーすればバックアップ完了です。`,
    description:
      'セーブはゲームのインストール先ではなく、Steamのuserdataフォルダにあります。Steamクラウドにも対応していますが、手元にもコピーを残すと安心です。',
    causes: [],
    quickFacts: [
      {
        label: 'userdataの場所（標準）',
        value: String.raw`C:\Program Files (x86)\Steam\userdata`,
        copy: true,
      },
      {
        label: 'その先のフォルダ',
        value: String.raw`<数字のアカウントID>\2246340\remote\win64_save`,
      },
      { label: 'Steamクラウド', value: '対応（Steamストアの表記）' },
      {
        label: '体験版からの引き継ぎ',
        value:
          '製品版のセーブがない状態で製品版を起動すると引き継げる（Ver.1.042）',
      },
    ],
    diagnosis: [
      {
        symptom: 'セーブの場所が分からない',
        cause: 'Steamのuserdataフォルダの中にある',
        stepId: 'open-save',
      },
      {
        symptom: 'MOD導入・PC移行・再インストールの前',
        cause: '作業中の上書きや削除でセーブを失うおそれ',
        stepId: 'backup-save',
      },
      {
        symptom: 'セーブが巻き戻った・読み込めない',
        cause: 'ファイルの破損、Steamクラウドとの同期',
        stepId: 'restore-save',
      },
      {
        symptom: '画質や操作の設定も残したい',
        cause: '設定はconfig.iniに別に保存されている',
        stepId: 'backup-config',
      },
    ],
    steps: [
      {
        id: 'open-save',
        title: 'セーブデータのフォルダを開く',
        summary: 'Steamのuserdataフォルダをたどって開きます。',
        time: '約2分',
        risk: 'low',
        actions: [
          'ゲームとSteamを終了する',
          String.raw`Windows＋Rキーで「C:\Program Files (x86)\Steam\userdata」を開く（Steamを別の場所に入れた場合はその中のuserdata）`,
          '数字のフォルダ（アカウントID）→「2246340」→「remote」→「win64_save」の順に開き、更新日時が最後に遊んだ日時と合うか確認する',
        ],
        note: '数字のフォルダが複数ある場合は、「2246340」フォルダが入っている方、更新日時が新しい方が普段使っているアカウントです。',
      },
      {
        id: 'backup-save',
        title: 'win64_saveフォルダを丸ごとバックアップする',
        summary: '個別のファイルではなく、フォルダ全体をコピーします。',
        time: '約2分',
        risk: 'low',
        actions: [
          'win64_saveフォルダを右クリックして「コピー」を選ぶ',
          '別のドライブ、USBメモリ、クラウドストレージのいずれかへ貼り付ける',
          'フォルダ名に日付を付ける（例：MHWilds_save_2026-09-27）',
        ],
      },
      {
        id: 'backup-config',
        title: '設定ファイルも一緒に保全する',
        summary: '画質や操作設定を戻せるよう、config.iniもコピーします。',
        time: '約1分',
        risk: 'low',
        actions: [
          'Steamでゲームを右クリック→「管理」→「ローカルファイルを閲覧」でインストール先を開く',
          'config.iniをコピーし、セーブとは別だと分かる名前でバックアップ先へ保存する',
        ],
      },
      {
        id: 'restore-save',
        title: 'バックアップから復元する',
        summary:
          '復元中にSteamクラウドが古いデータで上書きしないよう、同期を一時的に止めます。',
        time: '約3分',
        risk: 'medium',
        actions: [
          'Steamでゲームを右クリック→「プロパティ」→「一般」で、Steamクラウドへの保存を一時的にオフにする',
          '今あるwin64_saveフォルダを消さずに、名前の末尾へ「_old」を付けて残す',
          'バックアップのwin64_saveフォルダを同じ場所へ貼り付け、ゲームを起動してロードを確認する',
          '問題がなければ、Steamクラウドへの保存をオンに戻す',
        ],
        note: '同じSteamアカウントのフォルダへ戻すのが前提です。',
      },
    ],
    avoid: [
      'ゲームやSteamを起動したままセーブをコピー・上書きしない',
      '今のセーブを消してから復元しない。必ず別名で残してから入れ替える',
      'Steamクラウドの同期中にファイルを入れ替えない',
    ],
    cautions: [
      'セーブデータを操作する前に、必ず別の場所へコピーを残してください。',
    ],
    faqs: [
      {
        question: '体験版のセーブデータを製品版に引き継げますか？',
        answer:
          'Ver.1.042.00.00で対応しました。公式のアップデート告知によると、製品版のセーブデータがない状態で製品版を起動すると、体験版（プロローグ体験版）のセーブを引き継げます。',
      },
      {
        question: 'Steamクラウドがあればバックアップは不要ですか？',
        answer:
          'Steamクラウドには対応していますが、クラウドは今の状態を同期する仕組みです。破損した状態も同期されるため、MOD導入や大型アップデートの前は手元にもコピーを残すと安全です。',
      },
      {
        question: 'config.iniを初期化するとセーブも消えますか？',
        answer:
          '消えません。config.iniはゲームのインストール先、セーブはSteamのuserdataフォルダと、別の場所に保存されています。',
      },
    ],
    sources: [sources.pcgw, sources.steam, sources.update1042],
    related: ['config-file', 'not-launching', 'mod', 'system-requirements'],
    metaDescription:
      'モンハンワイルズSteam版のセーブデータの場所は「Steam\\userdata\\数字のID\\2246340\\remote\\win64_save」。コピーできるパス、バックアップと復元の手順、Steamクラウドの注意、体験版からの引き継ぎ方を解説。',
  }),
  make({
    slug: 'fps',
    // Shorter <title> for search results; the page heading keeps the full title.
    seoTitle: 'モンハンワイルズのFPSが低い・カクつく時の設定【PC版】',
    category: 'display',
    title:
      'モンハンワイルズのFPSが低い・カクつく時の設定｜FPS上限とフレーム生成【PC版】',
    shortTitle: 'FPS上限・カクつき',
    symptom:
      'FPSが低い、カクつく、FPS上限の決め方が分からない、フレーム生成がグレーアウトしてオンにできない場合の確認手順です。',
    conclusion:
      '公式の推奨環境の目安は「中」設定・1080p・60fpsで、これはフレーム生成を使った状態です。安定しない時は、公式ガイドのとおりグラフィックプリセットを「中」や「低」に下げます。フレーム生成を選べない場合は、Windowsの「ハードウェアアクセラレータによるGPUスケジューリング」をオンにします。',
    description:
      'FPSの表示が高くても、フレーム生成で増えた分は操作の反応には反映されません。「実際の重さ」と「表示のなめらかさ」を分けて考えると、設定を決めやすくなります。',
    causes: [
      'PCの性能に対して高すぎる画質設定',
      'フレーム生成の前提（推奨環境の60fpsはフレーム生成を使った目安）',
      '古いドライバーやゲームのバージョン',
      '高解像度テクスチャパックによるVRAM不足',
      'ノートPCの省電力状態や排熱不足',
    ],
    quickFacts: [
      {
        label: '推奨環境の目安',
        value:
          'RTX 2060 Super・RX 6600で「中」1080p・60fps（フレーム生成使用）',
      },
      {
        label: '最低環境の目安',
        value:
          'GTX 1660・RX 5500 XTで「最低」1080p（720pからアップスケール）・30fps',
      },
      {
        label: 'FPS上限の範囲',
        value:
          'ゲーム中30〜360fps、ムービー30〜60fps、バックグラウンド15〜60fps（PCGamingWiki）',
      },
      {
        label: 'フレーム生成を選べない',
        value:
          'Windowsで「ハードウェアアクセラレータによるGPUスケジューリング」をオン（公式）',
      },
    ],
    diagnosis: [
      {
        symptom: 'FPS上限の決め方が分からない',
        cause: 'モニターのリフレッシュレートと合っていない',
        stepId: 'set-limit',
      },
      {
        symptom: '全体的にFPSが低い',
        cause: '画質設定が高すぎる',
        stepId: 'reduce-load',
      },
      {
        symptom: 'フレーム生成がグレーアウトしている',
        cause: 'GPUスケジューリングがオフ、古いドライバー',
        stepId: 'frame-generation',
      },
      {
        symptom: 'アップデート後から重くなった',
        cause: 'ゲーム・ドライバーのバージョン',
        stepId: 'update-game',
      },
      {
        symptom: 'ノートPCで重い、長く遊ぶと重くなる',
        cause: '省電力状態、排熱不足',
        stepId: 'heat-power',
      },
    ],
    steps: [
      {
        id: 'set-limit',
        title: 'モニターとゲームのFPS上限を合わせる',
        summary: '先にWindows側のリフレッシュレートを確認します。',
        time: '約3分',
        risk: 'low',
        actions: [
          'Windowsの「設定」→「システム」→「ディスプレイ」→「ディスプレイの詳細設定」でリフレッシュレートを確認する',
          'ゲーム内のフレームレート上限を、モニターと同じか少し低い値（60・120・144など）にする',
          '同じ場所で数分プレイし、安定性を比べる',
        ],
      },
      {
        id: 'reduce-load',
        title: 'グラフィックプリセットを「中」や「低」に下げる',
        summary:
          '公式ガイドが、FPSが安定しない場合や起動できない場合に案内している方法です。',
        time: '約5分',
        risk: 'low',
        actions: [
          '今の設定をスクリーンショットで控える',
          'オプション→「GRAPHICS」の「グラフィックプリセット」を「中」や「低」にする',
          '改善したら、1項目ずつ上げて重くなる項目を見つける。VRAM 16GB未満なら高解像度テクスチャパックを外す',
        ],
      },
      {
        id: 'frame-generation',
        title: 'フレーム生成を使う・選べない時の対処',
        summary:
          'フレーム生成がグレーアウトしてオンにできない場合の、公式の対処法です。',
        time: '約5分',
        risk: 'low',
        actions: [
          'Windowsの「設定」→「システム」→「ディスプレイ」→「グラフィック」で、「ハードウェアアクセラレータによるGPUスケジューリング」をオンにしてPCを再起動する',
          '改善しない場合は、GPUドライバーを最新にする',
          'フレーム生成をオン・オフで比べ、表示FPSだけでなく操作の遅れや映像の乱れも確認する',
        ],
        note: 'DLSSのマルチフレーム生成はVer.1.020.00.00で追加されました（PCGamingWiki）。',
      },
      {
        id: 'update-game',
        title: 'ゲームとドライバーを最新にする',
        summary:
          'Ver.1.042.00.02では、一部の環境でフレームレートが下がる問題への対策が行われています。',
        time: '10〜20分',
        risk: 'low',
        actions: [
          'Steamでゲームの更新を確認し、最新版にする',
          'GPUドライバーを公式推奨（NVIDIA 581.57以降・AMD 25.9.1以降）にしてPCを再起動する',
          '同じ場所でFPSを比べる',
        ],
      },
      {
        id: 'heat-power',
        title: '電源設定と排熱を確認する',
        summary:
          '公式ガイドは、電源設定と排熱環境の確認、FPS上限を抑えて発熱を減らすことも案内しています。',
        time: '約5分',
        risk: 'low',
        actions: [
          'ノートPCは充電器をつなぎ、コントロールパネルの「電源オプション」で「高パフォーマンス」を選ぶ',
          'PCを壁から離して通気を確保する',
          'FPS上限を少し下げて、発熱と安定性が改善するか比べる',
        ],
      },
    ],
    avoid: [
      '画質設定をまとめて変えない。1項目ずつ変えて同じ場所で比べる',
      'VRAMが16GB未満なのに高解像度テクスチャパックを入れたままにしない',
    ],
    cautions: [
      '設定を変える前に、今の設定をスクリーンショットで控えてください。',
    ],
    faqs: [
      {
        question: '推奨スペックでも60fpsが安定しないのはなぜですか？',
        answer:
          'Steamストアの推奨環境の60fpsは、「中」設定・1080p・フレーム生成を使った状態の目安です。フレーム生成を使わない場合や、負荷の大きい場面では下がることがあります。',
      },
      {
        question: 'ムービーだけFPSが低いです。',
        answer:
          'ムービーのフレームレートは、ゲーム中とは別に30〜60fpsの範囲で設定します（PCGamingWiki）。ムービー用の上限設定を確認してください。',
      },
      {
        question: 'フレーム生成を使うと操作が重く感じます。',
        answer:
          'フレーム生成は表示をなめらかにする機能で、増えた分のフレームは操作の反応には反映されません。操作感を重視する場合は、フレーム生成をオフにして画質を下げる方法も比べてください。',
      },
    ],
    sources: [
      sources.capcom,
      sources.steam,
      sources.pcgw,
      sources.update104202,
    ],
    related: ['system-requirements', 'hdr', 'ultrawide', 'not-launching'],
    metaDescription:
      'モンハンワイルズPC版のFPSが低い・カクつく時の設定。推奨環境の60fpsはフレーム生成前提という注意点、公式が案内するプリセットの下げ方、フレーム生成が選べない時のGPUスケジューリング設定、FPS上限の決め方を解説。',
  }),
  make({
    slug: 'controller',
    // Shorter <title> for search results; the page heading keeps the full title.
    seoTitle: 'モンハンワイルズでコントローラーが反応しない時の設定【PC版】',
    category: 'controller',
    title:
      'モンハンワイルズでコントローラーが反応しない・ボタン表示が違う時の設定【PC版】',
    shortTitle: 'コントローラー',
    symptom:
      'コントローラーが反応しない、二重に入力される、ボタン表示がXboxのまま、DualSenseが振動しない場合の確認手順です。',
    conclusion:
      'PC版のコントローラー操作はSteam入力（Steam Input）が前提です。Steam入力をオンにし、DS4Windowsなど他の変換ツールは止めます。ボタン表示は自動で切り替わらないため、オプションの操作設定にあるボタン表示の項目で、手動で選びます。',
    description:
      'コントローラーの問題は「入力が届かない」「表示が違う」「振動しない」で原因が別です。症状に合わせてSTEPを選んでください。',
    causes: [
      'Steam入力がオフになっている、または他の変換ツールと二重になっている',
      'ボタン表示がコントローラーの種類に合わせて自動で切り替わらない',
      'DualSenseをBluetoothで接続している（振動しない）',
    ],
    quickFacts: [
      { label: 'Steam入力', value: '必須（PCGamingWiki）' },
      {
        label: 'ボタン表示',
        value: '自動で切り替わらない。オプションで手動で選ぶ',
      },
      {
        label: 'DualSenseの振動',
        value:
          'Bluetooth接続では振動しない。アダプティブトリガー・ハプティクスはUSB接続のみ',
      },
      {
        label: '名前の入力',
        value: 'ハンター・オトモの名前入力にはキーボードが必要',
      },
    ],
    diagnosis: [
      {
        symptom: 'コントローラーがまったく反応しない',
        cause: '接続・認識の問題',
        stepId: 'connection',
      },
      {
        symptom: '入力が二重になる・反応しない',
        cause: 'Steam入力がオフ、変換ツールとの二重入力',
        stepId: 'steam-input',
      },
      {
        symptom: 'ボタン表示がXboxのまま',
        cause: '表示は手動で選ぶ仕様',
        stepId: 'button-icons',
      },
      {
        symptom: 'DualSenseが振動しない',
        cause: 'Bluetooth接続',
        stepId: 'dualsense-usb',
      },
      {
        symptom: '設定を変えても直らない',
        cause: '接続情報が残っている',
        stepId: 'reconnect',
      },
    ],
    steps: [
      {
        id: 'connection',
        title: '接続を1台だけにして認識を確認する',
        summary: '複数の入力機器や無線接続を一度切り分けます。',
        time: '約3分',
        risk: 'low',
        actions: [
          'ゲームを終了し、使わないコントローラーをPCから外す',
          '対象のコントローラーをUSBケーブルで接続してSteamを再起動する',
          'Steamの「設定」→「コントローラー」で入力が認識されるか確認する',
        ],
      },
      {
        id: 'steam-input',
        title: 'Steam入力をオンにし、他の変換ツールを止める',
        summary:
          'PC版のコントローラー操作にはSteam入力が必要です（PCGamingWiki）。',
        time: '約3分',
        risk: 'low',
        actions: [
          'Steamのライブラリでゲームを右クリック→「プロパティ」→「コントローラー」を開き、Steam入力が無効になっていないか確認する',
          'DS4Windowsなど外部の変換ツールを使っている場合は終了する',
          'ゲームを起動して、入力が1回ずつ正しく反応するか確認する',
        ],
        note: '変更前の設定をメモしておくと、元に戻せます。',
      },
      {
        id: 'button-icons',
        title: 'ボタン表示を手動で選ぶ',
        summary:
          '本作は接続したコントローラーの種類を自動で判別しないため、表示を手動で選びます（PCGamingWiki）。',
        time: '約1分',
        risk: 'low',
        actions: [
          'ゲーム内のオプションの操作設定で、コントローラーのボタン表示の項目を開く',
          'Xbox系・PlayStation系（DualSense／DualShock 4）・Nintendo系から、使っているコントローラーに合う表示を選ぶ',
        ],
      },
      {
        id: 'dualsense-usb',
        title: 'DualSenseの振動はUSB接続で使う',
        summary:
          'Bluetooth接続では振動が無効になり、アダプティブトリガーとハプティクスはUSB接続でのみ動作します（PCGamingWiki）。',
        time: '約2分',
        risk: 'low',
        actions: [
          'DualSenseをUSBケーブルで接続する',
          'Steam入力がオンになっているか確認する',
          'ゲーム内で振動を確認する',
        ],
      },
      {
        id: 'reconnect',
        title: 'SteamとPCを再起動して再接続する',
        summary: '設定を変えても直らない場合は、接続情報を読み直します。',
        time: '約5分',
        risk: 'low',
        actions: [
          'ゲームとSteamを終了し、コントローラーを取り外す',
          'PCを再起動し、Steamを起動してからコントローラーを接続する',
          'ゲームを起動して確認する',
        ],
      },
    ],
    avoid: [
      'Steam入力とDS4Windowsなどの変換ツールを同時に使わない（二重入力の原因）',
      '複数の設定を同時に変えない',
    ],
    cautions: ['Steam入力の設定を変える前に、今の設定をメモしてください。'],
    faqs: [
      {
        question: 'ボタン配置を自由に変えられますか？',
        answer:
          'PCGamingWikiによると、コントローラーの割り当ては変更できない4種類のプリセットから選ぶ形です。ダッシュ操作や決定ボタンなど、一部の項目は個別に切り替えられます。',
      },
      {
        question:
          'キーボードとコントローラーを両方つないでいると不具合がありますか？',
        answer:
          'PCGamingWikiには、両方を同時に使うとメニューのショートカットが正しく動かない場合があると記載されています。コントローラーで遊ぶ時は、キーボード・マウスの操作を混ぜないようにしてください。',
      },
      {
        question: 'ジャイロ操作は使えますか？',
        answer:
          'Steam入力を有効にしている場合に、カメラのジャイロ操作を使えます（PCGamingWiki）。設定はオプションのカメラ設定にあります。',
      },
    ],
    sources: [sources.pcgw, sources.steam],
    related: ['not-launching', 'save-data', 'fps', 'mod'],
    metaDescription:
      'モンハンワイルズPC版でコントローラーが反応しない・二重入力・ボタン表示が違う・DualSenseが振動しない時の設定。Steam入力が必須な理由、ボタン表示の手動切り替え、USB接続が必要な機能を解説。',
  }),
  make({
    slug: 'mod',
    category: 'mods',
    title: 'モンハンワイルズのMOD導入前の準備と、起動しない時の戻し方【PC版】',
    shortTitle: 'MOD導入・戻し方',
    symptom:
      'MODを入れる前に準備したい、MOD導入後やアップデート後に起動しない、MODを外して元に戻したい場合の手順です。',
    conclusion:
      'MODを入れる前に、セーブ（Steamのuserdata内のwin64_save）とconfig.iniをバックアップします。MODは1個ずつ追加し、起動しない時は全MODを退避して本体だけで確認します。オンラインのマルチプレイには最新版のゲームが必要なため、アップデート後はMODの対応を待つのが基本です。',
    description:
      'MODはカプコンの公式サポートの対象外です。困った時にすぐ本体だけの状態に戻せるよう、導入前の準備が一番大切です。',
    causes: [
      'ゲームのアップデートにMODが対応していない',
      '前提となるツール（MODローダーなど）の不足',
      '複数のMODの競合',
    ],
    quickFacts: [
      {
        label: '導入前に保存するもの',
        value: 'セーブ（win64_save）とconfig.ini',
      },
      {
        label: 'アップデートとの関係',
        value:
          'オンラインのマルチプレイには最新版が必要（公式）。Steamでは通常、旧バージョンに戻せない',
      },
      {
        label: '戻し方',
        value: 'MODを退避→Steamで整合性確認→本体だけで起動',
      },
      {
        label: '日本語化MOD',
        value: '不要（日本語に公式対応）',
      },
    ],
    diagnosis: [
      {
        symptom: 'MODを入れる前',
        cause: '失敗しても戻せる準備が必要',
        stepId: 'prepare',
      },
      {
        symptom: 'MOD導入後・アップデート後に起動しない',
        cause: 'MODが未対応、競合',
        stepId: 'remove-all',
      },
      {
        symptom: 'どのMODが原因か分からない',
        cause: '複数のMODを同時に入れている',
        stepId: 'isolate',
      },
    ],
    steps: [
      {
        id: 'prepare',
        title: '導入前に元へ戻せる状態を作る',
        summary: 'セーブと設定、変更するゲームファイルを保全します。',
        time: '約5分',
        risk: 'low',
        actions: [
          'ゲームを終了する',
          String.raw`Steamのuserdata内「<数字のアカウントID>\2246340\remote\win64_save」を別の場所へコピーする`,
          'インストール先のconfig.iniもコピーする',
          'MOD名・配布元・対応するゲームのバージョンをメモする',
        ],
      },
      {
        id: 'remove-all',
        title: 'すべてのMODを退避して本体だけで起動する',
        summary: '問題が本体側かMOD側かを最初に分けます。',
        time: '約10分',
        risk: 'medium',
        actions: [
          'MOD管理ツール上ですべて無効にする',
          '手動で入れたファイルは削除せずゲームフォルダの外へ移す',
          'Steamでゲームファイルの整合性を確認し、PCを再起動してゲームを起動する',
        ],
      },
      {
        id: 'isolate',
        title: 'MODを1個ずつ戻して原因を切り分ける',
        summary: '本体だけで起動できた場合に行います。',
        time: '1個につき約3分',
        risk: 'medium',
        actions: [
          '今のゲームのバージョンに対応していることが確認できるMODを1個だけ戻す',
          'ゲームを起動して確認し、問題がなければ次のMODを1個追加する',
          '起動しなくなったら、直前に追加したMODを外す',
        ],
        note: '大型アップデートの直後は、MOD側の対応版が出るまで外したままにするのが安全です。',
      },
    ],
    avoid: [
      '配布元がはっきりしない実行ファイル（.exe・.dll）を入れない',
      'MODを一度に複数入れない。原因を特定できなくなる',
      'セーブのバックアップを取らずにMODを入れない',
    ],
    cautions: [
      'MODはカプコンの公式サポート対象外です。利用規約を確認し、自己責任で扱ってください。',
    ],
    faqs: [
      {
        question: 'MODを入れた後に起動しない場合は？',
        answer:
          'すべてのMODを削除せずゲームフォルダの外へ退避し、Steamで整合性確認を行ってから本体だけで起動します。',
      },
      {
        question: '日本語化MODは必要ですか？',
        answer: '必要ありません。PC版は日本語に公式対応しています。',
      },
      {
        question: 'アップデート後、MODのために古いバージョンで遊べますか？',
        answer:
          '公式のアップデート告知では、オンラインのマルチプレイやダウンロードコンテンツを使うには最新版が必要とされています。Steamでは通常、旧バージョンを選べないため、MODの対応を待つのが基本です。',
      },
    ],
    sources: [sources.update1042, sources.pcgw],
    related: ['not-launching', 'save-data', 'config-file', 'fps'],
    metaDescription:
      'モンハンワイルズPC版のMOD導入前にやるべきセーブとconfig.iniのバックアップ、起動しない時に本体だけへ戻す手順、MODを1個ずつ切り分ける方法、アップデート後の注意点を解説。',
  }),
  make({
    slug: 'config-file',
    // Shorter <title> for search results; the page heading keeps the full title.
    seoTitle: 'モンハンワイルズのconfig.iniの場所と初期化方法【Steam版】',
    category: 'settings',
    title:
      'モンハンワイルズのconfig.iniはどこ？設定ファイルの場所と初期化方法【Steam版】',
    shortTitle: 'config.iniの場所・初期化',
    symptom:
      '設定ファイルの場所を知りたい、画面設定を変えてから起動しない・映らない、設定を初期化したい、サポートに設定を送りたい人向けです。',
    conclusion: String.raw`config.iniは、ゲームのインストール先（標準は「C:\Program Files (x86)\Steam\steamapps\common\MonsterHunterWilds」）の直下にあります。初期化する時は、削除せずゲームフォルダの外へ移すと、起動時に新しいファイルが作られます。`,
    description:
      'カプコンの公式ガイドでも、問い合わせ時にグラフィック設定としてconfig.iniのコピーを送るよう案内されています。',
    causes: [
      'モニターに合わない解像度・表示方式が保存されている',
      'PCの性能に対して重すぎる設定が保存されている',
    ],
    quickFacts: [
      {
        label: 'config.iniの場所（標準）',
        value: String.raw`C:\Program Files (x86)\Steam\steamapps\common\MonsterHunterWilds\config.ini`,
        copy: true,
      },
      {
        label: '確実に開く方法',
        value: 'Steamでゲームを右クリック→「管理」→「ローカルファイルを閲覧」',
      },
      {
        label: '初期化の方法',
        value: 'ファイルをゲームフォルダの外へ移す→起動すると作り直される',
      },
      {
        label: 'セーブへの影響',
        value: 'なし（セーブはSteamのuserdataに別保存）',
      },
    ],
    diagnosis: [
      {
        symptom: 'config.iniの場所が分からない',
        cause: 'Steamを別のドライブに入れている',
        stepId: 'open-config',
      },
      {
        symptom: '設定を変えてから起動しない・映らない',
        cause: '保存された画面設定の問題',
        stepId: 'reset-config',
      },
      {
        symptom: '初期化後に同じ問題がまた起きる',
        cause: '重い設定や合わない解像度に戻した',
        stepId: 'safe-start',
      },
    ],
    steps: [
      {
        id: 'open-config',
        title: 'Steamからゲームのインストール先を開く',
        summary:
          'ドライブが分からなくても、Steamから正しいフォルダを開けます。',
        time: '約1分',
        risk: 'low',
        actions: [
          'Steamのライブラリでゲームを右クリックする',
          '「管理」→「ローカルファイルを閲覧」を選ぶ',
          '開いたフォルダの直下にあるconfig.iniを確認する',
        ],
      },
      {
        id: 'reset-config',
        title: 'config.iniを退避して作り直す',
        summary: '元に戻せるようにしたうえで、設定だけを初期状態にします。',
        time: '約3分',
        risk: 'medium',
        actions: [
          'ゲームとSteamを終了する',
          'config.iniをデスクトップなどへコピーしてから、元のファイルをゲームフォルダの外へ移す',
          'Steamからゲームを起動し、新しいconfig.iniが作られて起動できるか確認する',
        ],
        note: '新しいファイルが作られない場合は、Steamの整合性確認を行ってからもう一度試してください。',
      },
      {
        id: 'safe-start',
        title: '起動できたら軽い設定から始める',
        summary:
          '合わない解像度や重すぎる画質を、もう一度読み込まないようにします。',
        time: '約5分',
        risk: 'low',
        actions: [
          '解像度をモニターの標準の値に合わせる',
          'グラフィックプリセットを「中」や「低」にし、高解像度テクスチャパックはVRAM 16GB未満なら使わない',
          'ゲームを一度終了し、もう一度正常に起動できるか確認する',
        ],
        note: '本作は排他的フルスクリーンではなく、ボーダーレスウィンドウで全画面表示します（PCGamingWiki）。',
      },
      {
        id: 'restore-config',
        title: '必要な設定だけゲーム内で戻す',
        summary:
          '古いconfig.iniを丸ごと上書きせず、原因を見つけられる状態を保ちます。',
        time: '約10分',
        risk: 'low',
        actions: [
          '退避したconfig.iniはバックアップとして残す',
          'ゲーム内のメニューから設定を1項目ずつ戻す',
          '変えるたびに再起動し、問題が再発しないか確認する',
        ],
      },
    ],
    avoid: [
      'config.iniをいきなり削除しない。必ずコピーを残す',
      '古いconfig.iniを丸ごと上書きして戻さない（同じ問題が再発する）',
    ],
    cautions: [
      'config.iniを手で編集する場合は、必ず編集前のコピーを残してください。',
    ],
    faqs: [
      {
        question: 'config.iniを消しても大丈夫ですか？',
        answer:
          '先にコピーを作り、削除ではなくゲームフォルダの外へ退避してください。次の起動時に作り直されます。',
      },
      {
        question: 'config.iniを初期化するとセーブデータも消えますか？',
        answer:
          '消えません。セーブはSteamのuserdataフォルダにあります。ただし作業前にはセーブもバックアップしておくと安全です。',
      },
      {
        question: 'カプコンに問い合わせる時にconfig.iniは必要ですか？',
        answer:
          '公式ガイドでは、問い合わせ時にグラフィック設定としてconfig.iniのコピーを用意するよう案内されています。DxDiag.txtや再現手順と一緒に送ると調査がスムーズです。',
      },
    ],
    sources: [sources.capcom, sources.pcgw],
    related: ['not-launching', 'save-data', 'fps', 'system-requirements'],
    metaDescription:
      'モンハンワイルズSteam版のconfig.iniはゲームのインストール先の直下。コピーできるパス、Steamから確実に開く方法、起動しない時の初期化（退避して作り直す）手順と、セーブへの影響がない理由を解説。',
  }),
  make({
    slug: 'system-requirements',
    // Shorter <title> for search results; the page heading keeps the full title.
    seoTitle: 'モンハンワイルズの推奨スペック｜VRAM・メモリ・SSD要件【PC版】',
    category: 'specs',
    title:
      'モンハンワイルズの推奨スペックは？VRAM・メモリ・SSD・CPU要件【PC版】',
    shortTitle: '推奨スペック',
    symptom:
      '自分のPCで遊べるか知りたい、推奨環境でどのくらい動くか知りたい、高解像度テクスチャパックを使えるか確認したい人向けです。',
    conclusion:
      '公式の推奨環境は、RTX 2060 SuperまたはRX 6600（VRAM 8GB）、メモリ16GB、SSD 75GB以上です。この環境の目安は「中」設定・1080p・60fpsで、フレーム生成を使った状態です。高解像度テクスチャパックはVRAM 16GB以上が必要です。',
    description:
      '「推奨環境なら60fps」と思われがちですが、条件はフレーム生成の使用です。自分のPCとどの条件で比べるかを知っておくと、買い替えや設定の判断を間違えません。',
    causes: [],
    quickFacts: [
      {
        label: '推奨環境',
        value:
          'Core i5-10400・Ryzen 5 3600／RTX 2060 Super・RX 6600（VRAM 8GB）／メモリ16GB',
      },
      {
        label: '最低環境',
        value: 'GTX 1660（VRAM 6GB）・RX 5500 XT（VRAM 8GB）／メモリ16GB',
      },
      { label: 'ストレージ', value: 'SSD必須・75GB以上（DirectStorage対応）' },
      hdTextureFact,
      {
        label: 'CPUの条件',
        value: 'AVX2命令に対応したCPUが必要（PCGamingWiki）',
      },
    ],
    diagnosis: [
      {
        symptom: '推奨環境で何fps出るか知りたい',
        cause: '60fpsはフレーム生成を使った目安',
        stepId: 'recommended',
      },
      {
        symptom: '最低環境ぎりぎりのPC',
        cause: '最低画質・アップスケールで30fpsの目安',
        stepId: 'minimum',
      },
      {
        symptom: 'テクスチャの表示が遅れる・カクつく',
        cause: 'VRAM不足',
        stepId: 'check-vram',
      },
      {
        symptom: '自分のPCの構成が分からない',
        cause: 'dxdiagで確認できる',
        stepId: 'check-pc',
      },
    ],
    steps: [
      {
        id: 'recommended',
        title: '公式の推奨環境を確認する',
        summary:
          '「中」設定・1080p・60fps（フレーム生成使用）を想定した条件です。',
        time: '約2分',
        risk: 'low',
        actions: [
          'CPU：Core i5-10400 / Core i3-12100 / Ryzen 5 3600',
          'GPU：RTX 2060 Super（VRAM 8GB）またはRX 6600（VRAM 8GB）、メモリ16GB',
          'OS：Windows 10/11（64bit）、DirectX 12、SSD 75GB以上',
        ],
        note: 'Steamストアに記載の推奨環境の60fpsは、フレーム生成を使った「中」設定の目安です。',
      },
      {
        id: 'minimum',
        title: '最低環境との違いを確認する',
        summary: '最低環境は、高画質・高fps向けではありません。',
        time: '約2分',
        risk: 'low',
        actions: [
          'GPUはGTX 1660（VRAM 6GB）またはRX 5500 XT（VRAM 8GB）が最低の目安',
          '想定は「最低」設定・ネイティブ720pから1080pへのアップスケール・30fps',
          '最低環境に近い場合は高解像度テクスチャパックを使わない',
        ],
        note: 'カプコンは、最低要件を満たさないPCへの技術サポートを正式には提供していません。',
      },
      {
        id: 'check-vram',
        title: 'VRAMの容量を確認する',
        summary: 'カクつきやテクスチャの表示の遅れがある場合に確認します。',
        time: '約2分',
        risk: 'low',
        actions: [
          'Windows＋Rキーで「dxdiag」を実行し、「ディスプレイ」タブの「ディスプレイ メモリ（VRAM）」を確認する',
          'VRAMが16GB未満なら高解像度テクスチャパックを使わない',
          'ゲーム内のVRAM使用量の表示が上限を超えないよう、テクスチャ品質を下げる',
        ],
      },
      {
        id: 'check-pc',
        title: 'CPU・メモリ・ストレージを確認する',
        summary: 'Windowsの標準機能で主な構成を確認できます。',
        time: '約3分',
        risk: 'low',
        actions: [
          'dxdiagの「システム」タブでCPU名とメモリの容量を確認する',
          'CPUのメーカーの製品ページで、AVX2に対応しているか確認する',
          'ゲームを入れるドライブがSSDで、75GB以上（高解像度テクスチャパックを使うなら約150GB）空いているか確認する',
        ],
        note: 'DirectStorage 1.2を使うため、SATA接続のSSDよりM.2 NVMe SSDが推奨されています（PCGamingWiki）。',
      },
    ],
    avoid: [
      '推奨環境の60fpsを「フレーム生成なしでも出る」と思い込まない',
      'HDD（ハードディスク）にインストールしない（SSD必須）',
    ],
    cautions: [
      '動作環境は変わることがあります。購入前にSteamストアの最新の表記も確認してください。',
    ],
    faqs: [
      {
        question: 'メモリ16GBで足りますか？',
        answer:
          '公式の最低・推奨環境はいずれもメモリ16GBです。ほかのアプリを同時にたくさん開く場合は、空きメモリも確認してください。',
      },
      {
        question: 'RTX 2060 Superなら60fpsで遊べますか？',
        answer:
          '推奨環境の60fpsは、1080p・「中」設定・フレーム生成を使った状態の目安です。場面やPCの構成によって実際のfpsは変わります。',
      },
      {
        question: 'HDDでも遊べますか？',
        answer:
          'Steamストアの最低・推奨環境はいずれも「SSD必須」と記載されています。',
      },
    ],
    sources: [sources.steam, sources.capcom, sources.pcgw],
    related: ['fps', 'not-launching', 'config-file', 'hdr'],
    metaDescription:
      'モンハンワイルズPC版の推奨スペックはRTX 2060 Super・RX 6600（VRAM 8GB）、メモリ16GB、SSD 75GB。推奨の60fpsはフレーム生成前提という注意点、高解像度テクスチャパックのVRAM 16GB、AVX2対応CPUの条件まで解説。',
  }),
  make({
    slug: 'hdr',
    category: 'display',
    title:
      'モンハンワイルズのHDR設定｜白っぽい・暗い・映らない時の直し方【PC版】',
    shortTitle: 'HDR設定',
    symptom:
      'HDRを有効にしたい、HDRにすると白っぽい・暗い、HDRの項目が出ない、HDRにすると映らない・ちらつく場合の確認手順です。',
    conclusion:
      '先にWindowsで使うモニターのHDRをオンにし、Windows HDR 調整アプリで明るさを合わせてから、ゲームを再起動してゲーム内のHDRを設定します。映らない・ちらつく場合は、公式ガイドのとおりオプション「GRAPHICS」の「HDR出力設定」「垂直同期」「ディスプレイ周波数」を見直します。',
    description:
      'HDRの見え方は、モニターの性能・ケーブル・Windowsの設定・ゲームの設定がすべてそろって初めて正しくなります。Windows側から順に整えるのが近道です。',
    causes: [
      'Windowsまたはモニター側でHDRが無効',
      'SDRとHDRの明るさのバランス、キャリブレーションが合っていない',
      'ケーブルが4K・HDRに対応していない',
    ],
    quickFacts: [
      { label: 'HDR', value: '対応（Steamストア「HDR使用可能」）' },
      {
        label: '映らない・ちらつく時に見直す項目',
        value:
          'GRAPHICSの「ディスプレイ周波数」「垂直同期」「HDR出力設定」（公式）',
      },
      {
        label: '先に行う設定',
        value: 'Windowsの「設定」→「システム」→「ディスプレイ」→「HDR」',
      },
      {
        label: '見落としやすい原因',
        value: 'ケーブルの規格（4K・HDRに準拠しているか）',
      },
    ],
    diagnosis: [
      {
        symptom: 'HDRの項目が出ない・選べない',
        cause: 'モニターやWindows側の設定',
        stepId: 'check-display',
      },
      {
        symptom: 'ゲーム内のHDRが効かない',
        cause: 'Windows側のHDRがオフ',
        stepId: 'enable-windows-hdr',
      },
      {
        symptom: '全体が白っぽい・暗い',
        cause: '明るさのバランス',
        stepId: 'balance-brightness',
      },
      {
        symptom: 'HDRにすると映らない・ちらつく',
        cause: '表示設定やケーブル',
        stepId: 'display-settings',
      },
    ],
    steps: [
      {
        id: 'check-display',
        title: 'HDR対応の画面と接続を確認する',
        summary:
          '複数の画面がある場合は、設定する画面を間違えないようにします。',
        time: '約3分',
        risk: 'low',
        actions: [
          'モニター本体のメニューでHDR入力を有効にする',
          'Windowsの「設定」→「システム」→「ディスプレイ」で、ゲームを表示するモニターを選ぶ',
          '画面を複製表示している場合は「表示画面を拡張する」に切り替えて比べる',
        ],
      },
      {
        id: 'enable-windows-hdr',
        title: 'WindowsのHDRを先に有効にする',
        summary: 'ゲームを起動する前にWindows側のHDRを確定させます。',
        time: '約2分',
        risk: 'low',
        actions: [
          '「設定」→「システム」→「ディスプレイ」→「HDR」で「HDRを使用する」をオンにする',
          'ゲームが起動中なら一度終了する',
          'ゲームを起動し、オプションのHDR出力設定を確認する',
        ],
      },
      {
        id: 'balance-brightness',
        title: '白っぽさはSDRとHDRの明るさから見直す',
        summary: 'Windowsの通常画面だけ白っぽい場合も切り分けます。',
        time: '約5分',
        risk: 'low',
        actions: [
          'WindowsのHDR設定で「SDRコンテンツの明るさ」を少しずつ調整する',
          'モニターのダイナミックコントラストなどの補正機能を一度オフにして比べる',
          'ゲームを再起動して同じ場面で確認する',
        ],
      },
      {
        id: 'calibrate-hdr',
        title: 'Windows HDR 調整アプリで調整する',
        summary: 'モニターが表示できる明るさを、Windowsに正しく伝えます。',
        time: '約5分',
        risk: 'low',
        actions: [
          'Microsoft Storeから「Windows HDR 調整」アプリを入手する',
          '案内に沿って暗い部分・最大の明るさ・色の濃さを調整し、プロファイルを保存する',
          'ゲームを再起動し、ゲーム内の明るさを調整し直す',
        ],
      },
      {
        id: 'display-settings',
        title: '映らない・ちらつく時は表示設定とケーブルを見直す',
        summary:
          '公式ガイドが、表示が安定しない場合に調整を案内している項目です。',
        time: '約5分',
        risk: 'low',
        actions: [
          'オプション「GRAPHICS」の「HDR出力設定」「垂直同期」「ディスプレイ周波数」を1つずつ変えて比べる',
          'モニターの説明書で、HDRで使える入力端子と設定を確認する',
          'ケーブルが4K・HDRの規格に準拠した製品か確認する',
        ],
      },
    ],
    avoid: [
      'Windows側とゲーム側のHDR設定を同時に変えない',
      'ゲーム起動中にWindowsのHDRを切り替えて比べない（再起動してから比べる）',
    ],
    cautions: [
      'HDRの見え方はモニターの性能で大きく変わります。モニターの取扱説明書も確認してください。',
    ],
    faqs: [
      {
        question: 'PC版はHDRに対応していますか？',
        answer:
          'はい。Steamストアで「HDR使用可能」と表記されています。HDR対応のモニターとWindows側の設定も必要です。',
      },
      {
        question: 'HDRにすると白っぽくなるのはなぜですか？',
        answer:
          'SDRとHDRの明るさのバランス、モニターの補正機能、キャリブレーションが合っていない可能性があります。STEP 3とSTEP 4の順に確認してください。',
      },
      {
        question: 'HDRにすると画面が映らなくなりました。',
        answer:
          '公式ガイドは、表示に問題がある場合に「ディスプレイ周波数」「垂直同期」「HDR出力設定」の調整と、モニター側の設定確認を案内しています。問い合わせる時は、ケーブルの規格と長さ、4K・HDRへの対応も伝えるよう求めています。',
      },
    ],
    sources: [
      sources.steam,
      sources.capcom,
      sources.msHdr,
      sources.msHdrCalibration,
    ],
    related: ['fps', 'system-requirements', 'config-file', 'ultrawide'],
    metaDescription:
      'モンハンワイルズPC版のHDR設定。Windows側のHDR有効化とWindows HDR 調整アプリ、白っぽい・暗い時の明るさの見直し、映らない・ちらつく時に公式が案内する「HDR出力設定」「垂直同期」「ディスプレイ周波数」とケーブルの確認を解説。',
  }),
  make({
    slug: 'ultrawide',
    // Shorter <title> for search results; the page heading keeps the full title.
    seoTitle: 'モンハンワイルズのウルトラワイド設定｜3440×1440の黒帯【PC版】',
    category: 'display',
    title:
      'モンハンワイルズのウルトラワイド設定｜3440×1440の黒帯・21:9・32:9対応【PC版】',
    shortTitle: 'ウルトラワイド・21:9',
    symptom:
      '3440×1440などのウルトラワイドモニターで遊びたい、左右に細い黒帯が出る、32:9に対応しているか知りたい、画面が引き伸ばされる場合の確認用です。',
    conclusion:
      'PC版は21:9までのウルトラワイドに対応し、ゲームプレイもムービーも横に広がって表示されます。ただし3440×1440などの一般的なウルトラワイド解像度は、正確な21:9に合わせて表示されるため、画面の端に小さな黒帯が出るのは正常です（PCGamingWiki）。32:9は対応していません。',
    description:
      '「3440×1440は21:9」と言われますが、厳密には21:9より少し横長です。その差の分が小さな黒帯になります。',
    causes: [
      '3440×1440は正確な21:9より少し横長（端に小さな黒帯が出る）',
      '32:9には対応していない',
      'ボーダーレスウィンドウで、モニターと違う縦横比の解像度を選んでいる（引き伸ばされる）',
    ],
    quickFacts: [
      { label: 'ウルトラワイド', value: '21:9まで対応（PCGamingWiki）' },
      {
        label: '3440×1440の小さな黒帯',
        value: '正確な21:9に合わせるため。正常な表示',
      },
      { label: '32:9', value: '非対応' },
      {
        label: '引き伸ばされる原因',
        value: 'モニターと違う縦横比の解像度をボーダーレスで選んでいる',
      },
    ],
    diagnosis: [
      {
        symptom: '左右の端に細い黒帯が出る',
        cause: '正確な21:9に合わせた表示（正常）',
        stepId: 'check-black-bars',
      },
      {
        symptom: '映像が横に引き伸ばされる',
        cause: 'モニターと違う縦横比の解像度',
        stepId: 'check-aspect',
      },
      {
        symptom: '21:9の解像度が選べない',
        cause: 'Windows側の解像度が合っていない',
        stepId: 'set-resolution',
      },
      {
        symptom: '横に広くなってFPSが下がった',
        cause: '描画する範囲が増えた',
        stepId: 'adjust-ui',
      },
    ],
    steps: [
      {
        id: 'set-resolution',
        title: 'Windowsをモニターの標準の解像度に合わせる',
        summary:
          'ゲームを起動する前に、3440×1440などの標準の解像度を選びます。',
        time: '約2分',
        risk: 'low',
        actions: [
          'Windowsの「設定」→「システム」→「ディスプレイ」で、ウルトラワイドモニターを選ぶ',
          '「ディスプレイの解像度」を「推奨」と表示される値にする',
          '「ディスプレイの詳細設定」でリフレッシュレートも確認する',
        ],
      },
      {
        id: 'check-aspect',
        title: 'ゲーム内でモニターと同じ縦横比の解像度を選ぶ',
        summary:
          'ボーダーレスウィンドウでモニターと違う縦横比の解像度を選ぶと、映像が引き伸ばされます（PCGamingWiki）。',
        time: '約2分',
        risk: 'low',
        actions: [
          'ゲームのオプションで表示方式と解像度を開く',
          'モニターと同じ解像度（例：3440×1440）を選んで適用する',
          '実際のゲームプレイ画面で、丸いものが楕円になっていないか確認する',
        ],
        note: '本作は排他的フルスクリーンの代わりにボーダーレスウィンドウで全画面表示します（PCGamingWiki）。',
      },
      {
        id: 'check-black-bars',
        title: '黒帯の出方を確認する',
        summary: '端の小さな黒帯は、正確な21:9に合わせるための表示です。',
        time: '約2分',
        risk: 'low',
        actions: [
          'ゲームプレイ中とムービー中の両方で、黒帯の幅を確認する',
          '左右の端の細い黒帯だけなら、正常な表示',
          '大きな黒帯が出る場合は、解像度スケールを100%に戻し、一度16:9を選んでから21:9に戻して読み直す',
        ],
      },
      {
        id: 'adjust-ui',
        title: 'UIの位置と画質の負荷を調整する',
        summary: '横幅が増えた分の視線の移動と、GPUの負荷を調整します。',
        time: '約5分',
        risk: 'low',
        actions: [
          'HUDの設定で、表示を見やすく調整する',
          'FPSが下がった場合は、アップスケーラーの品質を1段階下げる',
          '同じ場所でFPSと操作感を比べる',
        ],
      },
    ],
    avoid: [
      'モニターと違う縦横比の解像度をボーダーレスで選ばない（引き伸ばされる）',
      '32:9で全面表示できる前提で設定しない',
    ],
    cautions: ['表示設定を変える前に、今の設定を控えてください。'],
    faqs: [
      {
        question: '3440×1440に対応していますか？',
        answer:
          'はい。PC版は21:9までのウルトラワイドに対応しています。3440×1440では、正確な21:9に合わせるため、画面の端に小さな黒帯が出ます（PCGamingWiki）。',
      },
      {
        question: '32:9のモニターでは遊べますか？',
        answer:
          'PCGamingWikiによると、対応しているのは21:9までです。32:9のモニターでは、21:9または16:9の範囲で表示されます。',
      },
      {
        question: 'ムービーも横に広がりますか？',
        answer:
          'はい。PCGamingWikiによると、ゲームプレイもムービーも横に広がる表示（Hor+）に対応しています。',
      },
    ],
    sources: [sources.pcgw],
    related: ['fps', 'hdr', 'config-file', 'system-requirements'],
    metaDescription:
      'モンハンワイルズPC版は21:9までのウルトラワイドに対応。3440×1440で端に小さな黒帯が出る理由、32:9非対応、映像が引き伸ばされる時の直し方、UIとFPSの調整を解説。',
  }),
];
