import type { GameArticle } from '@/lib/game-articles';

// モンスターハンターワイルズ（PC・Steam版）の個別記事。
// 2026-09-27にカプコン公式トラブルシューティングガイド、Steamの公式アップデート告知
// （Ver.1.042系・ドライバーのお知らせ）、Steamストア、PCGamingWikiで確認した内容だけを載せています。
// 起動トラブル記事には2026-10-03（日本時間）の匿名改善報告1件を追記しています。
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
> & { seoTitle?: string; checkedAt?: string; targetVersion?: string };

const make = (draft: Draft): GameArticle => ({
  gameSlug: 'monster-hunter-wilds',
  checkedAt: '2026-09-27',
  status: 'verified',
  targetVersion: 'Steam版 Ver.1.042.00.02（2026年9月27日時点の最新）',
  symptoms: draft.steps.map((step) => ({ label: step.title, target: step.id })),
  seoTitle: draft.title,
  ...draft,
});

const hdTextureFact = {
  label: '高解像度テクスチャパック',
  value: 'VRAM 16GB以上が必要。入れているだけで不安定になる場合がある（公式）',
};

export const monsterHunterArticles: GameArticle[] = [
  make({
    slug: 'not-launching',
    category: 'launch',
    checkedAt: '2026-10-03',
    targetVersion: 'PC・Steam製品版／公式案内を2026年9月30日に確認',
    title:
      'モンハンワイルズがクラッシュ・落ちる時の対処法｜起動直後・狩猟中・シェーダー準備別',
    seoTitle:
      'モンハンワイルズ クラッシュ対策｜起動直後・プレイ中に落ちる原因の切り分け',
    shortTitle: 'クラッシュ・起動しない',
    ogTitle: 'モンハンワイルズが落ちる',
    ogSteps: [
      '落ちる場面で切り分け',
      'MOD・ファイル・GPUを確認',
      '同じ場面で改善を比較',
    ],
    symptom:
      'PC・Steam版モンスターハンターワイルズが起動直後、ロード中、狩猟中、シェーダー準備中に落ちる人向け。エラーなしの強制終了と、PC全体の再起動も区別します。',
    conclusion:
      'モンハンワイルズがクラッシュしたら、まず落ちた時刻・場面・エラー全文を記録します。更新やMOD導入後ならMODを退避、起動直後や同じロードで落ちるならSteamの整合性確認、狩猟中ならGPUドライバーと画質設定を確認します。高解像度テクスチャパックはVRAM 16GB以上が条件です。対処は1つずつ行い、落ちた場面を再実行して判断してください。',
    description:
      'カプコンの公式案内を基に、確認する場所と結果による次の行動をまとめました。原因を断定する診断表ではありません。2026年10月3日（日本時間）に受け取った、Steamクライアントの外部拡張を一時停止した後に遊べたという1件の報告を追加しました。単独の原因や改善率を示すものではありません。PS5・Xbox版にはSteamやWindowsの操作を適用しないでください。',
    quickFacts: [
      {
        label: '最初に残す記録',
        value:
          '発生時刻／起動・ロード・狩猟・シェーダー準備のどこか／エラー全文／直前の更新',
      },
      hdTextureFact,
      {
        label: 'ゲームフォルダの開き方',
        value:
          'Steam → ライブラリ → ゲームを右クリック → 管理 → ローカルファイルを閲覧',
      },
      {
        label: 'クラッシュ記録',
        value: 'ゲームフォルダ内のCrashReport。生成されない場合もある',
      },
    ],
    diagnosis: [
      {
        symptom:
          '整合性・ドライバー確認後もタイトル前で落ちる／Steamに外部拡張がある',
        cause:
          'ゲーム側のMODと別に、Steam本体へ読み込まれた追加DLLを読み取りだけで確認',
        stepId: 'steam-client-check',
      },
      {
        symptom: '更新・MOD導入後から落ちる',
        cause:
          'まずMODと描画に介入するツールを外して比較。改善しなければファイル確認へ',
        stepId: 'remove-mods',
      },
      {
        symptom: '起動直後・同じロードで落ちる',
        cause:
          '整合性確認で不足ファイルを修復。再取得なし・改善なしならドライバーと履歴を確認',
        stepId: 'verify-files',
      },
      {
        symptom: '狩猟中に落ちる／GPU・DirectX関連の表示',
        cause:
          'ドライバーの変更前後を比較。新しい版でも必ず安定するとは限らない',
        stepId: 'update-driver',
      },
      {
        symptom: '高解像度テクスチャ導入後／ビデオメモリ不足',
        cause: '専用GPUメモリ容量とDLCを確認。共有メモリを足して16GBと数えない',
        stepId: 'check-vram',
      },
      {
        symptom: '画質や表示設定を変えた後から落ちる',
        cause: 'config.iniを退避し、新しい設定で起動できるか比較',
        stepId: 'reset-config',
      },
      {
        symptom: 'シェーダー準備中に落ちる',
        cause:
          'キャッシュが存在する場合だけ再生成。VRAM不足を繰り返す場合はメーカー相談も検討',
        stepId: 'shader-crash',
      },
      {
        symptom: '長時間の狩猟後に落ちる',
        cause:
          '同じ場面で画質・FPS上限を変えて比較。PC全体が落ちる場合は別の診断へ',
        stepId: 'compare-load',
      },
      {
        symptom: 'エラーなしで終了／どれを試しても改善しない',
        cause: 'Windowsの履歴とCrashReportを時刻で照合して相談用の記録を作る',
        stepId: 'crash-record',
      },
      {
        symptom: '起動時に保護・ブロックの通知が出る',
        cause:
          '保護履歴で対象ファイルを確認。セキュリティ機能の一括無効化はしない',
        stepId: 'security',
      },
      {
        symptom: '内蔵GPUで動いている疑いがある',
        cause: '複数GPUのPCだけ、実行ファイルのGPU割り当てを確認',
        stepId: 'gpu-select',
      },
    ],
    steps: [
      {
        id: 'remove-mods',
        title: '更新後はMOD・オーバーレイを外して比較する',
        summary:
          '整合性確認だけでは、手動追加したMODファイルが残る場合があります。',
        time: '約5〜10分',
        risk: 'medium',
        actions: [
          'ゲームを終了し、Steamの「管理」→「ローカルファイルを閲覧」で実際のインストール先を開く。導入時のファイル一覧・管理ツールの履歴を確認する',
          '管理ツールでMODを無効化・展開解除する。手動導入は自分で追加したと確認できるファイルだけ、元の場所を記録してゲームフォルダ外へ退避する',
          'ReShade、録画、性能表示など描画に介入するツールも一旦終了し、Steamから起動する',
          '同じセーブ・同じロード先で比較する。改善したらMODを1つずつ戻す。戻すと再発するものは対応版を待つ。変わらなければ次の整合性確認へ進む',
        ],
        note: '名前だけでDLLを削除しないでください。導入ファイルを特定できない場合は、関連する「MOD」記事で導入方法を確認します。',
      },
      {
        id: 'verify-files',
        title: 'Steamの整合性確認後、再取得と再発を分けて判断する',
        summary:
          '不足・破損ファイルの修復と、クラッシュの改善は別々に確認します。',
        time: '数分〜数十分',
        risk: 'low',
        actions: [
          'ゲームを閉じてPCを再起動。Steam → ライブラリ → モンスターハンターワイルズを右クリック → プロパティ → インストール済みファイル → ゲームファイルの整合性を確認',
          '再取得と表示された場合は「ダウンロード」で処理が完了したことを確認してから起動する',
          '同じロードや狩猟で改善したら、一旦その状態で継続する。再取得なし、または再取得しても落ちる場合は、ドライバーとクラッシュ記録へ進む',
          '毎回同じファイルが再取得され、起動のたびに再発する場合は、保護履歴と保存先ドライブのエラーを確認する。検証だけを繰り返さない',
        ],
        note: '検証に失敗するローカル設定ファイルもあります。「再取得がある＝今回の原因」「再取得なし＝PCは正常」とは断定できません。',
      },
      {
        id: 'update-driver',
        title: 'GPUドライバーの版を記録して更新・切り戻しを比較する',
        summary: '古い版だけでなく、更新後に相性が変わった場合も切り分けます。',
        time: '約10〜20分',
        risk: 'medium',
        actions: [
          'Windows＋R → dxdiag →「ディスプレイ」でGPU名・ドライバーのバージョンを記録する。ノートPCはPCメーカーの対応ドライバーも確認する',
          'NVIDIAはNVIDIAアプリの「ドライバー」、AMDはAMD Softwareの更新確認から対応版を確認する。カプコン公式ガイドがリンクする「Regarding your Video/Graphics Drivers」の条件と照合する',
          '更新後はWindowsを再起動し、MODなし・同じ画質・同じ場面で再実行する。更新した直後のシェーダー準備には時間がかかる場合がある',
          '更新後から悪化した場合は以前動いていた版をGPU・PCメーカーから入手して比較する。導入・戻し方は共通ガイド「GPUドライバー更新」を参照。変わらなければDLC・画質設定と記録を確認する',
        ],
        note: '特定の古い版を永久に推奨しません。DDUによる削除やBIOS変更は、最初に一律で行う手順にはしていません。',
      },
      {
        id: 'check-vram',
        title: '専用VRAMと高解像度テクスチャDLCを確認する',
        summary:
          '公式は高解像度テクスチャパックの条件をVRAM 16GB以上と案内しています。',
        time: '約3〜5分',
        risk: 'low',
        actions: [
          'Ctrl＋Shift＋Esc → タスクマネージャー → パフォーマンス → ゲームに使うGPU。「専用GPUメモリ」の容量を確認する。共有GPUメモリはRAMから借りる領域で、専用VRAMの増設分ではない',
          'ゲームを閉じ、Steam → ゲームのプロパティ → DLC →「モンスターハンターワイルズ - 高解像度テクスチャパック」のチェックを外し、Steamを再起動する',
          'ゲームが開くならオプション → GRAPHICS → グラフィックプリセットを「中」または「低」にして同じ場面を比較する',
          'DLCなしで改善したら、その状態で継続して設定を1つずつ戻す。DLCなしでもシェーダー準備中にVRAM不足を繰り返すなら「シェーダー準備」の手順へ進む',
        ],
        note: 'VRAM容量が16GB以上でもクラッシュしない保証にはなりません。エラー文だけでメモリ不足やGPU故障を確定しないでください。',
      },
      {
        id: 'reset-config',
        title: 'config.iniだけを退避して表示設定を作り直す',
        summary:
          '画質変更後に起動しなくなった場合の比較です。セーブの削除は不要です。',
        time: '約3分',
        risk: 'medium',
        actions: [
          'ゲームを終了し、Steam → 管理 → ローカルファイルを閲覧でMonsterHunterWilds.exeがあるフォルダを開く',
          'config.iniをバックアップしてからフォルダ外へ移動する。ファイルがない場合は推測して別のファイルを動かさず、次の記録確認へ進む',
          '起動して新しい設定で同じ場面を確認する。改善したら古いファイルを丸ごと戻さずゲーム内で設定を1つずつ調整する',
          '改善せず元に戻したい場合はゲームを終了し、新しく生成されたconfig.iniを別名で保管して、退避した元のconfig.iniを元の場所へ戻す',
        ],
      },
      {
        id: 'shader-crash',
        title: 'シェーダー準備中はキャッシュの有無とエラーを確認する',
        summary:
          '再生成はファイルが存在する場合に試します。「VRAM不足＝CPU故障」とは判断しません。',
        time: '再生成時間は環境による',
        risk: 'medium',
        actions: [
          '落ちた時刻とエラー全文を記録し、ゲームを閉じる。整合性確認・ドライバー確認・高解像度DLCなしの比較を先に済ませる',
          'Steam → 管理 → ローカルファイルを閲覧。公式が指定するshader.cacheとshader.cache2があれば、ゲームフォルダ外へ退避して再起動する。両方ない場合はこの作業を省略する',
          'シェーダーが再生成される場合は完了を待つ。準備中に処理が遅いことと、エラーを出して終了することを区別する。完了したら以前落ちたロード先で比較する',
          'シェーダー準備中のVRAM不足エラーが続く場合、公式はIntelまたはPC購入先への相談も案内している。CPU型番・エラー・試した操作を用意して相談し、BIOS対応や点検の必要性を確認する',
        ],
        note: 'CPUの型番はWindows＋R → msinfo32の「プロセッサ」で確認できます。改善しないからとBIOSの電圧設定を自己流で変えないでください。',
      },
      {
        id: 'compare-load',
        title: '長時間後のクラッシュは同じ狩猟・画質・時間で比較する',
        summary:
          '同時に複数の設定を変えると、どの変更が関係したか判断できません。',
        time: '以前落ちるまでの時間が目安',
        risk: 'low',
        actions: [
          '記録例：「同じクエスト、開始約20分後に終了、MODなし、プリセット高」。これは比較方法の例で、編集部の実測結果ではない',
          'オプション → GRAPHICSでプリセットを低に変更して同じクエストを比較する。改善しなければ設定を戻し、次はFPS上限だけを下げる。60fpsは比較例で、安定動作を保証する値ではない',
          '以前落ちた地点を越えて同程度の時間遊べたら「今回は再発なし」と記録する。1回成功しただけで完全解決と断定せず、次回も同じ条件で確認する',
          'PCが再起動・電源断・ブルースクリーンになる場合はゲーム単体の強制終了と分ける。共通ガイド「ゲーム中に電源が落ちる」「ゲーム中のブルースクリーン」でPC側を確認する',
        ],
      },
      {
        id: 'security',
        title: '起動をブロックした記録があるか確認する',
        summary: '除外を増やす前に、対象ファイルと時刻を確認します。',
        time: '約3分',
        risk: 'low',
        actions: [
          'Windows セキュリティ → ウイルスと脅威の防止 → 保護の履歴で、クラッシュや起動失敗の時刻に対応する項目を確認する。他社製品は検知履歴を確認する',
          '対象がSteam公式から取得したゲームファイルか確認する。MODや入手元不明のDLLの検知を、ゲーム本体の誤検知と決めつけない',
          '関連する検知がある場合は、表示された脅威名と対象をソフト提供元へ確認する。記録がなければ除外追加ではなくクラッシュ履歴の確認へ進む',
        ],
      },
      {
        id: 'gpu-select',
        title: '複数GPUのPCはゲームに使うGPUを確認する',
        summary: '内蔵GPUと外部GPUを搭載するPC向けです。',
        time: '約3分',
        risk: 'low',
        actions: [
          'Windows 設定 → システム → ディスプレイ → グラフィックでMonsterHunterWilds.exeを選ぶ。なければ実際のインストール先の実行ファイルを追加する',
          'オプションで高パフォーマンス側のGPU名を確認して保存し、ゲームを再起動する',
          '改善しなければ記録確認へ進む。戻す場合は同じ画面で「Windowsで自動的に選択する」にする',
        ],
        note: 'GPUの指定を変えても、公式の必要動作環境を満たすことや、モバイル・外付けGPUでの動作保証にはなりません。',
      },
      {
        id: 'crash-record',
        title: 'エラーなしで落ちる時も、履歴・CrashReportを残す',
        summary:
          '記録がある場合も、エラー名1つだけで故障部品を決めないでください。',
        time: '約5分',
        risk: 'low',
        actions: [
          'Windows検索で「信頼性履歴の表示」を開き、落ちた日・時刻のアプリケーションの停止から詳細を確認する。記録がなければWindows＋R → eventvwr.msc → Windowsログ → Applicationで同時刻のイベントを確認する',
          '問題のアプリ名、障害モジュール、例外コードを控える。関係する記録がない場合も、クラッシュしなかったことの証明にはならない',
          'Steam → 管理 → ローカルファイルを閲覧 → CrashReport。発生時刻に近いzipと、クラッシュレポート画面の番号を保管する。フォルダがない場合はエラーのスクリーンショットと再現手順を残す',
          'Windows＋R → dxdiag → 情報をすべて保存。公式サポートへDxDiag.txt、config.iniのコピー、発生場面、MODの有無、ドライバー版、試した操作と結果を伝える',
        ],
        note: 'ログやDxDiagにはPC名・ユーザー名・ファイルパスなどが含まれることがあります。SNSへ丸ごと公開せず、公式窓口の案内に沿って渡してください。',
      },
      {
        id: 'steam-client-check',
        title: '通常の対処で直らない時は、Steam本体の外部拡張を確認する',
        summary:
          'ゲームのMODなし・SteamオーバーレイOFFでも、Steam本体の追加DLLが停止するとは限りません。導入の心当たりがある場合の追加確認です。',
        time: '約5〜10分',
        risk: 'low',
        actions: [
          '2026年10月3日（日本時間）の改善報告1件：Windows 11／RTX 4060 Ti／Core i5-14400Fで、以前は体験版が動いたものの、Steam製品版はタイトル前に終了。MOD・ReShadeは使っていないとの申告だった',
          'この事例ではOBS終了、SteamオーバーレイOFF、405ファイルの整合性確認成功、管理者実行・互換モード指定なしの確認、公式NVIDIAドライバー更新と再起動だけでは改善しなかった。全員に同じ結果になるという意味ではない',
          '変更前の読み取り確認で、Steam本体のプロセスに、Steamのインストール先直下のHidden属性（隠し属性）の付いたOpenSteamTool.dll、cloud_redirect.dll、dwmapi.dllが読み込まれていた。ゲーム本体への読み込みを確認した結果ではない',
          '自分のPCでは、タスクマネージャーで実行中のSteamのファイルの場所を確認する。ゲームの「ローカルファイルを閲覧」で開く場所とは異なる。ファイル名が似ているという理由だけで操作しない',
          '読み取りだけで確認する場合は64ビットのPowerShellで Get-Process -Name steam -Module | Where-Object { $_.ModuleName -in @("OpenSteamTool.dll", "cloud_redirect.dll", "dwmapi.dll", "xinput1_4.dll") } | Select-Object ModuleName,FileName を実行し、名前だけでなく読み込み元を照合する。この4名称だけの確認では、他の追加物がすべて存在しないとは言えない。WindowsのSystem32由来の同名DLLは対象外。アクセス拒否・空欄・Steam終了中なら「未確認」とし、安全と判定したり削除したりしない',
        ],
        note: 'Windowsのイベント1000のC0000005（障害モジュール不明）と、別のクラッシュダンプで見つかったC000001Dは、同じ例外として扱いません。例外コードやCPU型番だけで故障・原因を断定できません。出力には個人のフォルダ名が含まれるため公開前に伏せてください。',
        guideLink: {
          href: '/guide/pc-game-crash#steam-client-case',
          label: 'PCゲーム共通：Steam本体の拡張とゲーム側のMODを分ける',
          description: '確認できた範囲と、変更を止める条件を確認します。',
        },
      },
      {
        id: 'steam-client-isolation',
        title: '追加物だと確認できた場合だけ、バックアップして一時停止する',
        summary:
          '上の1件では復元できる状態でSteam側のローダー2ファイルを一時停止した後、本人から「プレイできた」と報告がありました。原因DLLを1つに特定した実験ではありません。',
        time: '保存先とバックアップ量による',
        risk: 'high',
        actions: [
          '対象はSteamのインストール先直下に、自分で導入した外部拡張のローダーだと確認できたファイルだけ。心当たり・導入元・元に戻す方法が分からない場合はここで止め、DLL名と読み込み元を控えて相談する',
          'ゲームとSteamを終了してから、確認できるローカルのSteam設定・対象ゲームのセーブ・追加物の設定を別の場所へコピーし、ファイル数・サイズを照合する。この事例ではコピーと元データのハッシュを照合したが、PC内外の全セーブを保証するものではない',
          'cloud_redirect.dllなど保存先を変える拡張がある場合、Steamのuserdataだけで十分とは限らない。外部クラウド・別ドライブ・独自保存先と復元方法も確認し、大事なセーブを保全できるまで進まない',
          'この事例ではSteamとゲームを終了し、追加ローダーだと確認したSteam直下のdwmapi.dllとxinput1_4.dllだけを、元の場所・名前を記録しコピーを残してから、末尾に重複しない.disabled名を付けて一時停止した。削除やWindowsのSystem32、セーブの変更は行っていない',
          'Steamを起動し直して読み込み元を再確認する。この事例では追加DLLが一覧から消え、同名のWindows DLLはSystem32由来になった後、対象ゲームを起動してプレイできたとの報告を受けた。ファイルが存在するだけの確認と、実際の読み込み確認を区別する',
          '確認するのはまず対象ゲームだけ。クラウド競合、セーブが見つからない、同期先が違う場合は保存・上書きをせず中止する。改善した場合は動く状態を保ち、原因証明のために再び有効化しない。再発や未改善なら、その結果と変更記録を公式サポートへ伝える',
          '元へ戻す必要がある場合はゲームとSteamを終了し、記録した元の場所と名前へ対象だけを戻す。同名ファイルが新しくできていたら上書きせず止める。入手元が不明・安全性に疑問がある追加物は、再有効化する前に導入元やサポートへ確認する',
        ],
        note: 'これはSteamクライアント側の外部拡張の干渉が候補になった単一事例です。2つのローダーをまとめて停止しており、特定DLLが必ず原因、他のPCでも解決、長期安定を確認済みとは言えません。拡張の導入や権利確認の回避を案内する手順ではありません。',
      },
    ],
    avoid: [
      'Steam直下とWindowsのSystem32を混同する／DLLをまとめて削除する／セキュリティ機能を無効にする',
      '原因を断定してセーブやゲームフォルダを丸ごと削除する',
      '無関係なDLL配布サイトから不足ファイルを入れる',
      '同時にMOD・画質・ドライバー・BIOSを変更する',
    ],
    cautions: [
      '作業前にセーブを別の場所へコピーし、config.iniも保管します。設定ファイルとセーブは保存先が異なります。関連する「セーブデータの場所」記事を参照してください。',
      'この記事はPC・Steam製品版向けです。アップデートで案内が変わる場合があるため、公式の告知日と自分の版を照合してください。',
    ],
    faqs: [
      {
        question: 'モンハンワイルズがエラーなしで落ちる場合はどうすればいい？',
        answer:
          '落ちた時刻を控え、Windowsの信頼性履歴とイベントビューアーのApplicationログを確認します。ゲームフォルダのCrashReportがあれば同時刻のzipも保管してください。起動直後・ロード中・狩猟中のどこで落ちたかによって、本文の早見表から次の確認を選びます。',
      },
      {
        question: 'アップデート後だけクラッシュするのはなぜ？',
        answer:
          'MOD、描画ツール、ドライバー、更新したゲーム側の不具合などが候補です。まずMODなしで同じ場面を比較し、整合性確認後も続くならドライバー版と記録を確認します。更新後という理由だけで原因を1つに確定できません。',
      },
      {
        question: 'VRAMが8GBや12GBでも高解像度テクスチャパックを使える？',
        answer:
          'カプコンはこのDLCに16GB以上のVRAMを必要条件として案内しています。16GB未満ではインストールしているだけでも不安定になる場合があるため、Steamのプロパティ→DLCで無効にして比較します。共有GPUメモリを足して条件を満たしたとは数えません。',
      },
      {
        question: 'シェーダー準備中のVRAM不足はCPU故障？',
        answer:
          'エラー文だけでCPU故障とは確定できません。DLC、ドライバー、ゲームファイルを先に確認し、存在する場合だけ指定のシェーダーキャッシュを再生成します。同じエラーが続く場合、カプコンはIntelまたはPC購入先への相談も案内しています。',
      },
      {
        question: 'PS5やXboxでもこの手順を使える？',
        answer:
          'Steamの整合性確認、config.ini、Windowsの履歴確認はPC版専用です。家庭用ゲーム機ではゲーム本体とシステムの更新を確認し、対応機種の公式サポートへ発生場面とエラーを伝えてください。PC用ファイル操作を適用しないでください。',
      },
    ],
    sources: [
      {
        label:
          'Microsoft Learn：Get-Process（読み込みモジュールと64ビットでの確認）',
        url: 'https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/get-process',
      },
      {
        label:
          'OpenSteamTool 開発元資料：Steam直下のローダー構成を確認（導入の推奨ではありません）',
        url: 'https://github.com/OpenSteam001/OpenSteamTool/blob/main/README.md',
      },
      {
        label: 'CloudRedirect 開発元資料：保存先の転送とバックアップの警告',
        url: 'https://github.com/Selectively11/CloudRedirect#readme',
      },
      sources.capcom,
      {
        label:
          'カプコン公式：GPUドライバーのお知らせ（公式ガイドの現在のリンク先）',
        url: 'https://store.steampowered.com/news/app/2246340/view/534357354429284375',
      },
      {
        label: 'Steamサポート：ゲームファイルの整合性確認',
        url: 'https://help.steampowered.com/ja/faqs/view/0C48-FCBD-DA71-93EB',
      },
      {
        label:
          'Microsoft：Windowsのシステム構成ツール（タスクマネージャー・イベントビューアー・システム情報）',
        url: 'https://support.microsoft.com/ja-jp/windows/experience/system-configuration-tools-in-windows',
      },
      {
        label: 'カプコン：モンスターハンターワイルズの公式サポート窓口',
        url: 'https://www.monsterhunter.com/support/wilds/',
      },
    ],
    related: ['save-data', 'config-file', 'system-requirements', 'fps', 'mod'],
    metaDescription:
      'モンハンワイルズがクラッシュ・落ちる時の対処を起動直後、ロード中、狩猟中、シェーダー準備別に解説。MOD退避、整合性確認、GPUドライバー、VRAMとDLC、CrashReportの場所、改善しない時の次の行動を確認できます。',
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
