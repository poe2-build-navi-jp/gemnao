import type { GameArticle } from '@/lib/game-articles';
import { gameBySlug } from '@/lib/games';

const game = gameBySlug('elden-ring');
if (!game) throw new Error('ELDEN RING guide data is missing');

// Facts below were checked on 2026-09-27 against the linked sources.
// Do not add game-specific claims without a primary or well-documented source.
const sources = {
  pcgw: {
    label: 'PCGamingWiki：ELDEN RING（保存場所・既知の不具合）',
    url: 'https://www.pcgamingwiki.com/wiki/Elden_Ring',
  },
  fromFaq: {
    label: 'フロム・ソフトウェア公式：ゲームタイトルに関するご質問',
    url: 'https://www.fromsoftware.jp/jp/faq-games.html',
  },
  steam: {
    label: 'Steamストア：ELDEN RING（動作環境・Steamクラウド）',
    url: 'https://store.steampowered.com/app/1245620/ELDEN_RING/',
  },
  bandaiSteam: {
    label: 'バンダイナムコ公式FAQ：Steamでゲームが起動できない',
    url: 'https://bnfaq.channel.or.jp/faq/detail/2836/7485',
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
  'gameSlug' | 'checkedAt' | 'symptoms' | 'seoTitle' | 'status'
> & { seoTitle?: string };

const make = (draft: Draft): GameArticle => ({
  gameSlug: game.slug,
  checkedAt: '2026-09-27',
  status: 'verified',
  symptoms: draft.steps.map((step) => ({ label: step.title, target: step.id })),
  seoTitle: draft.title,
  ...draft,
});

const verifyFilesStep = {
  id: 'verify-files',
  title: 'Steamでゲームファイルの整合性を確認する',
  summary:
    '不足・破損したファイルをSteamが自動で入れ直します。セーブデータは消えません。',
  time: '5〜15分',
  risk: 'low' as const,
  actions: [
    'Steamのライブラリで「ELDEN RING」を右クリックし「プロパティ」を開く',
    '「インストール済みファイル」→「ゲームファイルの整合性を確認」を押す',
    '完了したらPCを再起動し、同じ操作で症状が出るか確認する',
  ],
  note: 'MODで置き換えたファイルも元に戻ります。MODを使っている場合は、先に導入ファイルの場所を控えてください。',
};

export const eldenArticles: GameArticle[] = [
  make({
    slug: 'save-data',
    // Shorter <title> for search results; the page heading keeps the full title.
    seoTitle: 'エルデンリングのセーブデータの場所とバックアップ方法【Steam版】',
    category: 'save',
    title:
      'エルデンリング（ELDEN RING）のセーブデータの場所｜バックアップと復元手順【PC・Steam版】',
    shortTitle: 'セーブデータの場所',
    symptom:
      'セーブデータの保存先を開きたい、MOD導入やPC移行の前にバックアップしたい、消えたセーブを戻したい人向けです。',
    conclusion: String.raw`Steam版のセーブは「%APPDATA%\EldenRing」の中にある、数字だけの名前のフォルダ（SteamID）に入っています。本体のファイルは「ER0000.sl2」です。ゲームとSteamを終了してから、数字のフォルダごと別のドライブへコピーすればバックアップは完了です。`,
    description:
      'AppDataは隠しフォルダのため、エクスプローラーで探すより保存場所を直接入力する方が確実です。下の「30秒でわかる要点」のパスをコピーして使えます。',
    quickFacts: [
      { label: '保存場所', value: String.raw`%APPDATA%\EldenRing`, copy: true },
      {
        label: 'セーブファイル',
        value: '数字のフォルダ内の「ER0000.sl2」（フォルダごと保存する）',
      },
      {
        label: '設定ファイル',
        value: String.raw`%APPDATA%\EldenRing\GraphicsConfig.xml`,
        copy: true,
      },
      {
        label: 'Steamクラウド',
        value: '対応（Steamストアの表記）。ただし破損した状態も同期される',
      },
      { label: 'バックアップの所要時間', value: '約2〜3分' },
    ],
    diagnosis: [
      {
        symptom: '「%APPDATA%\\EldenRing」が見つからない',
        cause: '一度もゲームを起動していない、またはパスの入力ミス',
        stepId: 'open-save',
      },
      {
        symptom: '数字のフォルダが2つ以上ある',
        cause: '複数のSteamアカウントでプレイした',
        stepId: 'open-save',
      },
      {
        symptom: 'MOD導入・PC移行・再インストールの前',
        cause: '作業中の上書きや削除でセーブを失うおそれ',
        stepId: 'backup-save',
      },
      {
        symptom: 'セーブが巻き戻った・読み込めない',
        cause: 'ファイルの破損、またはSteamクラウドとの同期',
        stepId: 'restore-save',
      },
    ],
    steps: [
      {
        id: 'open-save',
        title: 'セーブデータの場所を開く',
        summary:
          '環境変数「%APPDATA%」を使うと、ユーザー名を調べずに直接開けます。',
        time: '約1分',
        risk: 'low',
        actions: [
          'ゲームを終了し、Steamもタスクトレイから終了する',
          String.raw`Windows＋Rキーを押し、「%APPDATA%\EldenRing」と入力してEnterを押す`,
          '数字だけの名前のフォルダを開き、「ER0000.sl2」の更新日時が最後に遊んだ日時と合うか確認する',
        ],
        note: '更新日時だけでは使用中のアカウントを特定できません。元のパスと数字のフォルダ名、対応するSteamアカウントを記録してください。不明なら全フォルダを保全し、推測で上書きしないでください。',
      },
      {
        id: 'backup-save',
        title: '数字のフォルダを丸ごと別の場所へコピーする',
        summary:
          'ER0000.sl2だけでなく、同じフォルダにあるファイルもまとめて残します。',
        time: '約2分',
        risk: 'low',
        actions: [
          '数字のフォルダを右クリックして「コピー」を選ぶ',
          '別のドライブ、USBメモリ、クラウドストレージのいずれかに、日付付きの親フォルダ（例：EldenRing_2026-09-27）を作る',
          'その親フォルダの中へ数字のフォルダを元の名前のまま貼り付ける',
        ],
        note: '同じPCの同じドライブだけに置くと、故障や初期化の時に一緒に失われます。',
      },
      {
        id: 'restore-save',
        title: 'バックアップから復元する',
        summary:
          '復元中にSteamクラウドが古いデータで上書きしないよう、同期を一時的に止めます。',
        time: '約3分',
        risk: 'medium',
        actions: [
          'Steamのライブラリで「ELDEN RING」を右クリック→「プロパティ」→「一般」で、Steamクラウドへの保存を一時的にオフにする',
          'ゲームとSteamを終了する。記録した元のパスと同じSteamアカウントであることを確認し、今ある数字のフォルダを別の保存先へコピーして残す。不明なら復元を中止する',
          String.raw`バックアップの数字のフォルダを「%APPDATA%\EldenRing」へ貼り付け、ゲームを起動してロードを確認する`,
          '問題なく遊べたら、Steamクラウドへの保存をオンに戻す',
        ],
        note: '復元は、同じSteamアカウントのフォルダへ戻すのが前提です。クラウドの競合が出た場合は、内容を確認できるまで同期するデータを選ばず、両方の控えを保全してください。',
      },
    ],
    avoid: [
      'ゲームやSteamが起動したままセーブファイルをコピー・上書きしない（書き込み途中のデータになることがある）',
      '今のセーブを消してから復元しない。必ず別名で残してから入れ替える',
      'Steamクラウドの同期中にファイルを入れ替えない',
    ],
    cautions: [
      'セーブデータを移動・変更する前に、必ず別の場所へコピーを残してください。',
    ],
    faqs: [
      {
        question: 'Steamクラウドに対応しているなら、バックアップは不要ですか？',
        answer:
          'Steamストアでは「Steamクラウド」対応と表記されています。ただしクラウドは今の状態を同期する仕組みのため、破損したセーブや巻き戻った状態もそのまま同期されます。MODの導入や大型アップデートの前は、手元にもコピーを残すと安全です。',
      },
      {
        question: '新しいPCへセーブを移すには？',
        answer: String.raw`同じSteamアカウントでSteamクラウドが有効なら、新しいPCでゲームを起動すると同期されます。念のため旧PCで数字のフォルダをコピーしておき、同期されない場合は新しいPCで一度ゲームを起動してから「%APPDATA%\EldenRing」へ戻します。`,
      },
      {
        question: '「%APPDATA%」とは何ですか？',
        answer: String.raw`Windowsのユーザーごとの設定フォルダ（通常は「C:\Users\ユーザー名\AppData\Roaming」）を表す環境変数です。AppDataは隠しフォルダのため、Windows＋Rキーで直接入力すると迷わず開けます。`,
      },
    ],
    sources: [sources.pcgw, sources.steam],
    related: ['mod', 'not-launching', 'fps', 'hdr'],
    metaDescription: String.raw`エルデンリングPC版のセーブデータの場所は「%APPDATA%\EldenRing\数字のフォルダ\ER0000.sl2」。コピーできるパス、Steamクラウドとの注意点、消えた時の復元手順まで解説。`,
  }),
  make({
    slug: 'not-launching',
    category: 'launch',
    title:
      'エルデンリングが起動しない・白い画面で落ちる時の対処法【PC・Steam版】',
    shortTitle: '起動しない・白い画面',
    symptom:
      '「プレイ」を押しても起動しない、白い画面にカーソルだけ表示されて落ちる、バンダイナムコのロゴで落ちる、MOD導入後に起動しない場合の切り分け手順です。',
    conclusion:
      'まずSteamの整合性確認を行い、白い画面で落ちるならWindowsとGPUドライバーの更新、ロゴで落ちるならSteamオーバーレイと常駐ツールの停止を試します。MODを入れている場合は、すべて退避して本体だけで起動を確認します。',
    description:
      '症状が出るタイミングで原因の候補が変わります。下の早見表で自分の症状に近いSTEPから始めても構いません。',
    causes: [
      'ゲームファイルの不足・破損（整合性確認で修復できる）',
      'Windowsが古く、DirectX 12の必要な機能が使えない',
      'Steamオーバーレイや、CPUの割り当てを変更するツールとの競合',
      'MOD・外部DLLの残り、または壊れたグラフィック設定ファイル',
    ],
    quickFacts: [
      {
        label: '最低動作環境',
        value:
          'Windows 10（64bit）／DirectX 12／GTX 1060 3GB・RX 580 4GB／メモリ12GB（Steamストア）',
      },
      {
        label: '推奨環境',
        value:
          'Windows 10/11／GTX 1070 8GB・RX Vega 56 8GB／メモリ16GB（Steamストア）',
      },
      {
        label: '設定ファイル',
        value: String.raw`%APPDATA%\EldenRing\GraphicsConfig.xml`,
        copy: true,
      },
      {
        label: '「不正な挙動が検出されました」',
        value: '公式FAQはゲームファイルの確認（整合性確認）を案内',
      },
    ],
    diagnosis: [
      {
        symptom: '白い画面にカーソルだけ表示され、その後落ちる',
        cause: 'Windowsが古くDirectX 12の機能が不足',
        stepId: 'update-windows',
      },
      {
        symptom: 'バンダイナムコのロゴで落ちる',
        cause: 'Steamオーバーレイとの競合',
        stepId: 'overlay',
      },
      {
        symptom: '「不正な挙動が検出されました」と表示される',
        cause: 'ゲームファイルの破損・改変',
        stepId: 'verify-files',
      },
      {
        symptom: 'MODを入れてから起動しない',
        cause: 'MOD・外部DLLの競合、本体との版の不一致',
        stepId: 'remove-mods',
      },
      {
        symptom: '画面設定を変えてから映らない・落ちる',
        cause: 'グラフィック設定ファイルの不整合',
        stepId: 'reset-config',
      },
    ],
    steps: [
      verifyFilesStep,
      {
        id: 'update-windows',
        title: 'WindowsとGPUドライバーを更新する',
        summary:
          '白い画面で落ちる症状は、DirectX 12の機能が足りない古いWindowsで起きると報告されています。',
        time: '10〜30分',
        risk: 'medium',
        actions: [
          'Windows＋Rキーで「winver」と入力し、Windowsのバージョンを確認する',
          '「設定」→「Windows Update」で更新を確認し、再起動まで済ませる',
          'NVIDIA・AMD・Intelの公式サイト（ノートPCはPCメーカー）から最新のGPUドライバーを入れる',
        ],
        note: 'PCGamingWikiは、この症状の対処としてWindows 10 21H1（少なくとも1909）以降への更新を挙げています。',
      },
      {
        id: 'overlay',
        title: 'Steamオーバーレイと常駐ツールを止める',
        summary:
          'ロゴ表示中に落ちる場合は、ゲームへ割り込む機能を外して比較します。',
        time: '約2分',
        risk: 'low',
        actions: [
          'Steamの「設定」→「ゲーム中」で、Steamオーバーレイをオフにする',
          'Process LassoなどでCPUの割り当て（アフィニティ）を設定していれば解除する',
          '録画・FPS表示・画面キャプチャのツールを終了してから起動する',
        ],
      },
      {
        id: 'remove-mods',
        title: 'MODと外部DLLを退避する',
        summary:
          '削除せずゲームフォルダの外へ移し、本体だけで起動できるか確認します。',
        time: '約3分',
        risk: 'medium',
        actions: [
          '追加したファイルの名前と場所をメモする',
          'MODのファイルをゲームフォルダの外（デスクトップなど）へ移す',
          'STEP 1の整合性確認をもう一度行い、MODを戻さずに起動する',
        ],
      },
      {
        id: 'reset-config',
        title: 'GraphicsConfig.xmlを作り直す',
        summary:
          '壊れた画面設定をリセットします。ファイルがなければ起動時に新しく作られます。',
        time: '約2分',
        risk: 'medium',
        actions: [
          String.raw`Windows＋Rキーで「%APPDATA%\EldenRing」を開く`,
          'GraphicsConfig.xmlをデスクトップへ移動する（削除しない）',
          'ゲームを起動し、新しいGraphicsConfig.xmlが作られるか確認する。変化がなければ元のファイルを戻す',
        ],
      },
    ],
    avoid: [
      'Easy Anti-Cheatのファイル（start_protected_game.exeなど）を削除・改名して起動しようとしない。EACを無効にするとオンラインプレイは使えません',
      '複数の対処を同時に行わない。1つ試すごとに起動を確認する',
      'セキュリティソフトの無効化を最初に試さない',
    ],
    cautions: [
      'セーブデータは「セーブデータの場所」記事の手順で、作業前にコピーしてください。',
      'ゲームやドライバーの更新で状況が変わるため、出典の最新情報も確認してください。',
    ],
    faqs: [
      {
        question: '「プレイ」を押してもすぐ「プレイ」に戻ってしまいます。',
        answer:
          'まずSTEP 1の整合性確認、次にSTEP 3のSteamオーバーレイと常駐ツールの停止を1つずつ試します。MODを入れている場合はSTEP 4で本体だけの状態にしてから確認してください。',
      },
      {
        question: '自分のPCが動作環境を満たしているか確認する方法は？',
        answer:
          'Windows＋Rキーで「dxdiag」と入力すると、Windowsのバージョン・メモリ容量・GPU名を確認できます。最低環境はGTX 1060 3GBまたはRX 580 4GB、メモリ12GB、DirectX 12です（Steamストア）。',
      },
      {
        question: 'Windows 11でも動きますか？',
        answer:
          'Steamストアの推奨環境には「Windows 10/11」と記載されています。',
      },
    ],
    sources: [
      sources.pcgw,
      sources.fromFaq,
      sources.steam,
      sources.bandaiSteam,
    ],
    related: ['save-data', 'mod', 'fps', 'ultrawide'],
    metaDescription:
      'エルデンリングPC版が起動しない、白い画面で落ちる、バンダイナムコのロゴで落ちる時の原因別の対処法。症状別の早見表で、整合性確認・Windows更新・オーバーレイ停止・MOD退避を順番に試せます。',
  }),
  make({
    slug: 'fps',
    category: 'display',
    title: 'エルデンリングのFPSが60で止まる・カクつく原因と対処法【PC版】',
    shortTitle: '60FPS上限・カクつき',
    symptom:
      '60FPSより上がらない、144Hzモニターなのに60Hzになる、戦闘や初めての場所で一瞬止まる、全体的にFPSが低い場合の確認手順です。',
    conclusion:
      'PC版は60FPSが上限の仕様で、60FPS前後で止まるのは不具合ではありません。FPSが低い時は、公式FAQが挙げる3点（GPUドライバーの更新、ゲームファイルの整合性確認、モニターをグラフィックボード側の端子へ接続）から試します。',
    description:
      '「上限で止まる」「全体的に低い」「一瞬だけ止まる」は原因が別です。早見表で症状を分けてから進めると、無駄な設定変更を減らせます。',
    causes: [
      '60FPS上限（公式仕様）',
      'フルスクリーン表示では60Hzに固定される',
      'DirectX 12のシェーダーを、初めて必要になった時にその場で作る仕組み',
      '古いGPUドライバー、破損ファイル、映像ケーブルの接続先',
    ],
    quickFacts: [
      { label: 'フレームレート上限', value: '60FPS（公式仕様）' },
      {
        label: '高リフレッシュレート',
        value:
          'フルスクリーンでは60Hzに固定。ボーダーレスウィンドウなら固定されない',
      },
      {
        label: '公式FAQの改善策',
        value:
          'GPUドライバー更新／整合性確認／映像ケーブルをグラフィックボード側へ',
      },
      {
        label: '一瞬止まるカクつき',
        value: '初回のシェーダー生成が原因。同じ場所は2回目以降に軽くなる',
      },
    ],
    diagnosis: [
      {
        symptom: '60FPSから上がらない',
        cause: '60FPS上限の仕様',
        stepId: 'understand-limit',
      },
      {
        symptom: '全体的にFPSが低い',
        cause: '古いドライバー、破損ファイル、映像ケーブルの接続先',
        stepId: 'official-fixes',
      },
      {
        symptom: '144Hzなどのモニターなのに60Hzになる',
        cause: 'フルスクリーン表示の60Hz固定',
        stepId: 'borderless',
      },
      {
        symptom: '初めての場所や戦闘で一瞬止まる',
        cause: 'シェーダーの初回生成',
        stepId: 'shader',
      },
      {
        symptom: 'GPUドライバーを更新した直後からカクつく',
        cause: '保存済みシェーダーの作り直し',
        stepId: 'shader',
      },
    ],
    steps: [
      {
        id: 'understand-limit',
        title: '60FPSで止まっているだけか確認する',
        summary: '60FPS前後で安定しているなら正常です。',
        time: '約1分',
        risk: 'low',
        actions: [
          'Steamの「設定」→「ゲーム中」でFPSカウンターの表示をオンにする',
          '見晴らしの良い場所で、FPSが60前後で安定しているか確認する',
          '60を大きく下回る、または一瞬止まる場合は次のSTEPへ進む',
        ],
      },
      {
        id: 'official-fixes',
        title: '公式FAQの3つの改善策を試す',
        summary:
          'フロム・ソフトウェア公式FAQで「大幅に改善する場合がある」と案内されている方法です。',
        time: '10〜20分',
        risk: 'low',
        actions: [
          'NVIDIA・AMD・Intelの公式サイトから最新のGPUドライバーを入れる',
          'Steamでゲームファイルの整合性を確認する',
          'モニターのケーブルがマザーボード側の端子ではなく、グラフィックボード側の端子に挿さっているか確認する',
        ],
        note: 'マザーボード側の端子につなぐと、グラフィックボードではなくCPU内蔵のGPUで描画されることがあります。',
      },
      {
        id: 'borderless',
        title: '画面モードをボーダーレスウィンドウにする',
        summary:
          'フルスクリーンでは60Hzに固定されるため、高リフレッシュレートのモニターで違和感がある場合に試します。',
        time: '約1分',
        risk: 'low',
        actions: [
          'ゲーム内の画面設定を開く',
          '画面モードを、枠のないウィンドウ表示（ボーダーレス）に変更する',
          'デスクトップに戻った時の表示や操作感を、フルスクリーンと比べる',
        ],
        note: 'ゲーム自体のフレームレート上限は60FPSのままです。',
      },
      {
        id: 'shader',
        title: '一瞬止まるカクつきの性質を知る',
        summary:
          '本作はシェーダーを事前に作らず、初めて必要になった時に作ります。一度作ったものはPCに保存されます。',
        time: 'プレイしながら',
        risk: 'low',
        actions: [
          '同じ場所を2回目以降に通った時、カクつきが減るか確認する',
          'GPUドライバーの更新直後は保存済みのシェーダーが使えず、しばらくカクつきが戻ることを把握しておく',
          'Steamオーバーレイをオフにして比べる',
        ],
        note: 'この種類のカクつきは、画質設定を下げても消えにくいことがあります。',
      },
      {
        id: 'offline-only',
        title: '60FPS上限の解除はオフライン専用と割り切る',
        summary:
          '上限を外すには非公式ツールが必要で、Easy Anti-Cheat（EAC）を無効化する必要があります。',
        time: '15分〜',
        risk: 'high',
        actions: [
          'セーブデータを別の場所へコピーする',
          'ツールが今のゲームバージョンに対応しているか配布ページで確認する',
          'EACを無効化したオフライン環境だけで使い、オンラインへ戻す時はツールを外して整合性確認を行う',
        ],
        note: 'EACを無効にしている間は、オンラインプレイは使えません。',
      },
    ],
    avoid: [
      'FPS上限解除ツールを入れたまま、オンラインに接続しようとしない',
      'BIOSの設定変更（ハイパースレッディングの無効化など）を最初に行わない。元に戻し忘れると他のソフトにも影響する',
      '画質設定をまとめて変えない。1項目ずつ変えて同じ場所で比べる',
    ],
    cautions: [
      '設定を変える前に、今の設定をスクリーンショットなどで控えてください。',
    ],
    faqs: [
      {
        question: '120FPSや144FPSで遊べますか？',
        answer:
          '公式には60FPSが上限です。上限を外すには非公式ツールが必要で、Easy Anti-Cheatを無効化するためオンラインプレイはできなくなります。',
      },
      {
        question: '画質を最低にしてもカクつくのはなぜですか？',
        answer:
          'シェーダーの初回生成や背景での読み込みによる一瞬の停止は、GPUの負荷とは別の原因のため、画質を下げても消えにくいことがあります。同じ場所を2回目以降に通って軽くなるか確認してください。',
      },
      {
        question: 'モニターのケーブルの挿し場所で変わるのですか？',
        answer:
          'フロム・ソフトウェアの公式FAQでは、映像ケーブルがビデオカード側の出力端子に接続されていない場合は接続し直すよう案内されています。マザーボード側の端子では、グラフィックボードの性能が使われないことがあります。',
      },
    ],
    sources: [sources.fromFaq, sources.pcgw],
    related: ['not-launching', 'ultrawide', 'hdr', 'mod'],
    metaDescription:
      'エルデンリングPC版は60FPS上限の仕様。FPSが低い時に公式FAQが案内する3つの改善策、144Hzモニターで60Hzになる原因、初めての場所で一瞬止まるカクつきの正体まで症状別に解説。',
  }),
  make({
    slug: 'ultrawide',
    // Shorter <title> for search results; the page heading keeps the full title.
    seoTitle: 'エルデンリングはウルトラワイド非対応｜21:9の黒帯は仕様【PC版】',
    category: 'settings',
    title:
      'エルデンリングはウルトラワイド非対応｜21:9・32:9の黒帯は公式仕様【PC版】',
    shortTitle: '21:9・黒帯',
    symptom:
      '3440×1440などのウルトラワイドモニターで左右に黒帯が出る、21:9や32:9で遊べるか知りたい、画面が引き伸ばされる場合の確認用です。',
    conclusion:
      'フロム・ソフトウェアの公式FAQで「PC（Steam）版はウルトラワイドモニター非対応」と案内されています。21:9・32:9のモニターでは、16:9の映像の左右に黒帯が入るのが正常な表示です。',
    description:
      '黒帯そのものは故障ではありません。引き伸ばしやUIの欠けがある場合だけ、表示設定を見直します。',
    causes: [
      'ゲームの表示が16:9のみ（公式にウルトラワイド非対応）',
      'GPUやモニター側の拡大設定で、16:9の映像が横に引き伸ばされている',
    ],
    quickFacts: [
      {
        label: 'ウルトラワイド',
        value: '非対応（フロム・ソフトウェア公式FAQ）',
      },
      { label: '表示される比率', value: '16:9（21:9・32:9では左右に黒帯）' },
      {
        label: '黒帯を消す方法',
        value: '非公式ツールのみ。EAC無効化が必要でオンライン不可',
      },
    ],
    diagnosis: [
      {
        symptom: '左右に黒帯が出る',
        cause: '16:9表示の仕様',
        stepId: 'confirm-spec',
      },
      {
        symptom: '映像が横に引き伸ばされる・丸が楕円に見える',
        cause: 'GPUやモニター側の拡大設定',
        stepId: 'check-resolution',
      },
      {
        symptom: 'どうしても全画面で遊びたい',
        cause: '公式機能がないため非公式ツールが必要',
        stepId: 'offline-only',
      },
    ],
    steps: [
      {
        id: 'confirm-spec',
        title: '黒帯が左右だけか確認する',
        summary: '左右だけの黒帯なら公式の表示どおりです。',
        time: '約1分',
        risk: 'low',
        actions: [
          'Windowsの「設定」→「ディスプレイ」でモニターの解像度を確認する',
          'ゲーム内の画面設定で解像度を確認する',
          '上下ではなく左右だけに黒帯があるか確認する',
        ],
      },
      {
        id: 'check-resolution',
        title: '引き伸ばされる場合は拡大設定を見直す',
        summary:
          '16:9の映像が横に引き伸ばされる時は、比率を保つ設定に変えます。',
        time: '約3分',
        risk: 'low',
        actions: [
          '今の設定をスクリーンショットで控える',
          'NVIDIAコントロールパネルの「デスクトップのサイズと位置の調整」、またはAMD Softwareのディスプレイ設定で、拡大方法を「アスペクト比を維持」にする',
          'モニター本体のメニューに「全画面拡大」などがあれば、比率を保つ設定にする',
        ],
      },
      {
        id: 'offline-only',
        title: '黒帯を消すツールはオフライン専用で使う',
        summary:
          'Flawless Widescreenなどの非公式ツールで黒帯を消せますが、Easy Anti-Cheatの無効化が必要です。',
        time: '15分〜',
        risk: 'high',
        actions: [
          'セーブデータを別の場所へコピーする',
          'ツールが今のゲームバージョンに対応しているか配布ページで確認する',
          'EACを無効化したオフライン環境だけで使う',
        ],
        note: 'EACを無効にしている間はオンラインプレイは使えません。オンラインに戻す時はツールを外し、Steamで整合性確認を行います。',
      },
    ],
    avoid: [
      '黒帯解除ツールを入れたまま、オンラインに接続しようとしない',
      'ツールを入れる前のセーブのバックアップを省略しない',
    ],
    cautions: ['表示設定を変える前に、今の設定を控えてください。'],
    faqs: [
      {
        question: '32:9（5120×1440など）のモニターでも同じですか？',
        answer:
          'はい。ゲームの表示は16:9のため、32:9でも左右に黒帯が入ります。黒帯の幅は21:9より広くなります。',
      },
      {
        question: 'ボーダーレスウィンドウにすると黒帯は消えますか？',
        answer:
          '消えません。表示の比率は画面モードに関係なく16:9です。ただしフルスクリーンでは60Hzに固定されるため、リフレッシュレートを気にする場合はボーダーレスウィンドウの方が向いています。',
      },
      {
        question: '将来、公式にウルトラワイドへ対応しますか？',
        answer:
          '2026年9月27日時点で、公式FAQは「ウルトラワイドモニター非対応」と案内しています。対応状況が変わった場合は公式の更新情報を確認してください。',
      },
    ],
    sources: [sources.fromFaq, sources.pcgw],
    related: ['fps', 'hdr', 'mod', 'not-launching'],
    metaDescription:
      'エルデンリングPC版は公式FAQでウルトラワイド非対応と案内されており、21:9・32:9の左右の黒帯は正常な表示です。引き伸ばされる時の直し方と、黒帯解除ツールをオフライン専用で使う注意点を解説。',
  }),
  make({
    slug: 'hdr',
    category: 'settings',
    title: 'エルデンリングのHDR設定｜白っぽい・色が薄い時の直し方【PC版】',
    shortTitle: 'HDR設定・白っぽい',
    symptom:
      'HDRを有効にしたい、HDRにすると画面が白っぽい・色が薄い、ゲーム内でHDRを選べない場合の確認手順です。',
    conclusion:
      'ELDEN RINGはHDRに対応しています。先にWindowsの「設定」→「システム」→「ディスプレイ」でHDRを有効にし、Windows 11用のWindows HDR 調整アプリで明るさを合わせてから、ゲームを再起動してゲーム内のHDRを設定します。',
    description:
      'HDRの見え方はモニターの性能とWindows側の設定で大きく変わります。ゲームより先にWindows側を整えるのが近道です。',
    causes: [
      'Windows側のHDRが無効、またはHDRに対応していないモニター',
      'Windows・モニター・ゲームの明るさ設定が合っていない',
      'HDR表示時に色が白っぽくなる現象（PCGamingWikiに記載）',
    ],
    quickFacts: [
      { label: 'HDR', value: '対応（PCGamingWiki）' },
      {
        label: '先に行う設定',
        value: 'Windowsの「設定」→「システム」→「ディスプレイ」→「HDR」',
      },
      { label: '明るさの調整', value: 'Windows 11用のMicrosoft「Windows HDR 調整」アプリ' },
      {
        label: '直らない時の選択肢',
        value: 'HDRをオフにしてSDRで遊ぶ（見やすい方を選んでよい）',
      },
    ],
    diagnosis: [
      {
        symptom: 'ゲーム内でHDRを選べない',
        cause: 'Windows側のHDRが無効、またはモニターが非対応',
        stepId: 'enable-windows-hdr',
      },
      {
        symptom: 'HDRにすると白っぽい・色が薄い',
        cause: '明るさ設定の不一致',
        stepId: 'calibrate-hdr',
      },
      {
        symptom: '調整しても白っぽさが残る',
        cause: 'HDR表示時の既知の現象',
        stepId: 'compare-sdr',
      },
    ],
    steps: [
      {
        id: 'enable-windows-hdr',
        title: 'WindowsのHDRを先に有効にする',
        summary: 'ゲームを終了した状態で、使うモニターのHDRをオンにします。',
        time: '約2分',
        risk: 'low',
        actions: [
          'ゲームを終了する',
          '「設定」→「システム」→「ディスプレイ」を開き、ゲームを表示するモニターを選ぶ',
          '「HDRを使用する」をオンにする。項目がない場合は、モニターのHDR対応・接続方法・表示モード・ドライバーを確認する。項目がないだけでは原因を特定できない',
        ],
      },
      {
        id: 'calibrate-hdr',
        title: 'Windows 11用のWindows HDR 調整アプリで明るさを合わせる',
        summary: 'モニターが表示できる明るさを、Windowsに正しく伝えます。',
        time: '約5分',
        risk: 'low',
        actions: [
          'Windows 11の場合だけ、Microsoft Storeから「Windows HDR 調整」アプリを入手する。Windows 10ではこのアプリの手順を飛ばし、ゲーム内とモニター本体の明るさを調整する',
          '画面の案内に沿って、暗い部分・明るい部分・色の濃さを調整する',
          '作成したプロファイルを保存し、有効になっていることを確認する',
        ],
      },
      {
        id: 'restart-game',
        title: 'ゲームを再起動してHDRを設定する',
        summary:
          'Windows側の設定を変えた後は、ゲームを起動し直してから比べます。',
        time: '約5分',
        risk: 'low',
        actions: [
          'ゲームを起動し、画面設定でHDRをオンにする',
          'ゲーム内のHDR関連の明るさ項目を、暗い洞窟と明るい屋外の両方で見ながら調整する',
          'モニター本体のHDRモード（プリセット）も確認する',
        ],
      },
      {
        id: 'compare-sdr',
        title: 'HDRをオフにして見比べる',
        summary:
          'HDRが常にきれいとは限りません。見やすい方を選んで大丈夫です。',
        time: '約2分',
        risk: 'low',
        actions: [
          'ゲーム内のHDRをオフにし、同じ場所で見え方を比べる',
          '白っぽさが気になる場合は、SDRで遊ぶ',
          'HDRの色を補正する非公式MODもありますが、EAC無効化が必要なためオフライン専用です',
        ],
      },
    ],
    avoid: [
      'ゲーム起動中にWindows側のHDRを切り替えて比べない（再起動してから比べる）',
      '色補正MODを入れたままオンラインに接続しない',
    ],
    cautions: [
      'HDRの見え方はモニターの性能で変わります。モニターの取扱説明書のHDR設定も確認してください。',
    ],
    faqs: [
      {
        question: 'HDRにするとデスクトップが暗く・白っぽくなりました。',
        answer:
          'WindowsでHDRを有効にすると、通常の画面（SDR）の見え方も変わります。Windowsの「ディスプレイ」→「HDR」にある「SDRコンテンツの明るさ」で調整できます。',
      },
      {
        question: 'どうしても白っぽさが直りません。',
        answer:
          'PCGamingWikiには、HDR時に色が白っぽくなる現象と、それを補正する非公式MODが記載されています。MODはEasy Anti-Cheatの無効化が必要でオンラインでは使えないため、気になる場合はSDRで遊ぶのが確実です。',
      },
      {
        question: 'HDR対応モニターか分かりません。',
        answer:
          'Windowsの「設定」→「システム」→「ディスプレイ」で、そのモニターに「HDRを使用する」の項目があるか確認してください。項目がない場合は、モニターのHDR対応に加え、ケーブル・端子・表示モード・ドライバーを確認してください。項目がないだけでは非対応と断定できません。',
      },
    ],
    sources: [sources.pcgw, sources.msHdr, sources.msHdrCalibration],
    related: ['fps', 'ultrawide', 'not-launching', 'mod'],
    metaDescription:
      'エルデンリングPC版のHDRを正しく設定する手順。Windows側のHDR有効化とWindows 11用のWindows HDR 調整アプリでの明るさ合わせ、白っぽい・色が薄い時の見直し方、HDRを選べない時の確認まで解説。',
  }),
  make({
    slug: 'mod',
    category: 'mods',
    title:
      'エルデンリングのMOD導入前の準備と戻し方｜起動しない時の対処【PC版】',
    shortTitle: 'MOD導入・戻し方',
    symptom:
      'MODを入れる前に準備したい、MOD導入後に起動しない、本体アップデート後にMODが動かない、オンラインに戻したい場合の手順です。',
    conclusion:
      'ELDEN RINGのMODの多くは、Easy Anti-Cheat（EAC）を無効化しないと読み込めません。EACを無効にするとオンラインプレイはできないため、セーブを別の場所へ複製し、オフライン専用として1個ずつ導入します。',
    description:
      'MODで困った時は、足すより先に「本体だけの状態」へ戻すのが最短です。戻し方を先に決めてから導入すると、失敗しても慌てずに済みます。',
    causes: [
      '本体のバージョンとMODの対応バージョンの不一致',
      '前提ツール（MODローダーなど）の不足',
      '複数MODの競合',
      'EACが無効なままでオンラインに接続しようとしている',
    ],
    quickFacts: [
      { label: 'MODの前提', value: 'EACの無効化が必要（PCGamingWiki）' },
      { label: 'オンライン', value: 'EAC無効中は利用できない' },
      {
        label: '元に戻す方法',
        value: 'MODファイルを退避してから、Steamで整合性確認',
      },
      {
        label: '導入前に必須',
        value: String.raw`セーブのバックアップ（%APPDATA%\EldenRing）`,
      },
    ],
    diagnosis: [
      {
        symptom: 'MOD導入後に起動しない',
        cause: 'MODの競合、前提ツールの不足',
        stepId: 'remove-mods',
      },
      {
        symptom: '本体のアップデート後にMODが動かない',
        cause: 'MODが新しいバージョンに未対応',
        stepId: 'check-version',
      },
      {
        symptom: 'オンラインに接続できない',
        cause: 'EACが無効な状態',
        stepId: 'restore-online',
      },
    ],
    steps: [
      {
        id: 'prepare',
        title: 'セーブを複製し、戻し方を決めておく',
        summary: '導入前の状態をいつでも再現できるようにします。',
        time: '約5分',
        risk: 'low',
        actions: [
          String.raw`「%APPDATA%\EldenRing」の数字のフォルダを、日付を付けて別の場所へコピーする`,
          'MODで追加・置き換えるファイルの名前と場所をメモする',
          'MODを使う間はオフラインで遊ぶと決め、オンライン用とは分けて考える',
        ],
      },
      {
        id: 'remove-mods',
        title: 'MODと外部DLLをすべて退避する',
        summary: '本体だけで起動できるかを最初に確認します。',
        time: '約5分',
        risk: 'medium',
        actions: [
          '追加したファイルを削除せず、ゲームフォルダの外へ移す',
          'Steamでゲームファイルの整合性を確認する',
          'MODなしで起動できるか確認する',
        ],
      },
      {
        id: 'check-version',
        title: 'MODを1個ずつ戻す',
        summary: '対応バージョンと前提ツールを確認しながら戻します。',
        time: '1個につき約3分',
        risk: 'medium',
        actions: [
          '配布ページで、今のゲームバージョンに対応しているか確認する',
          '1個だけ戻して起動し、問題がなければ次を追加する',
          '本体の更新直後に動かない場合は、MOD側の更新を待つ',
        ],
        note: 'Steamでは通常、ゲームを旧バージョンへ戻せません。',
      },
      {
        id: 'restore-online',
        title: 'オンライン用に元へ戻す',
        summary: 'MODを外し、ゲームファイルを元の状態に戻してから接続します。',
        time: '約10分',
        risk: 'medium',
        actions: [
          'MODのファイルと、MOD用の起動設定をゲームフォルダの外へ移す',
          'Steamでゲームファイルの整合性を確認し、元のファイルに戻す',
          'Steamから通常どおり起動し、オンラインに接続できるか確認する',
        ],
      },
    ],
    avoid: [
      'MODを入れたまま、またはEACを回避してオンラインに接続しない',
      '配布元がはっきりしない実行ファイル（.exe・.dll）を入れない',
      '複数のMODを一度に入れない。問題が起きた時に原因を特定できなくなる',
    ],
    cautions: [
      'MODは公式のサポート対象外です。利用規約を確認し、自己責任で扱ってください。',
    ],
    faqs: [
      {
        question: 'MODを入れるとオンラインで遊べなくなりますか？',
        answer:
          '多くのMODはEasy Anti-Cheatの無効化が必要で、EACが無効な間はオンラインプレイを利用できません。オンラインに戻す時は、STEP 4の手順でMODを外してから接続してください。',
      },
      {
        question: 'アップデート後にMODが動かなくなりました。',
        answer:
          '本体の更新でMODが未対応になることがあります。Steamでは通常ゲームを旧バージョンへ戻せないため、MODの配布ページで新しいバージョンへの対応を待つのが基本です。',
      },
      {
        question: 'MODを消したのに起動しません。',
        answer:
          'MODのファイルが残っていたり、置き換えたファイルが戻っていなかったりする可能性があります。Steamで整合性確認を行うと、本体のファイルが元の状態に戻ります。',
      },
    ],
    sources: [sources.pcgw],
    related: ['save-data', 'not-launching', 'fps', 'ultrawide'],
    metaDescription:
      'エルデンリングPC版のMODは多くがEasy Anti-Cheatの無効化を必要とし、その間オンラインは使えません。導入前のセーブ保全、起動しない時に本体だけへ戻す手順、オンラインへの戻し方を解説。',
  }),
];
