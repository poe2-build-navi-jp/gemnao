import { gameBySlug } from '@/lib/games';
import { eldenArticles } from '@/lib/elden-articles';
import { currentGameArticles } from '@/lib/current-game-articles';
import { newReleaseArticles } from '@/lib/new-release-articles';

export type ArticleCategory =
  | 'save'
  | 'launch'
  | 'display'
  | 'settings'
  | 'server'
  | 'controller'
  | 'mods'
  | 'specs';

export type ContentStatus = 'verified' | 'needs-review' | 'draft' | 'thin';

export type ArticleStep = {
  id: string;
  title: string;
  summary: string;
  actions: string[];
  note?: string;
};

export type GameArticle = {
  gameSlug: string;
  slug: string;
  category: ArticleCategory;
  title: string;
  shortTitle: string;
  symptom: string;
  conclusion: string;
  description: string;
  checkedAt: string;
  status?: ContentStatus;
  targetVersion?: string;
  causes?: string[];
  symptoms: { label: string; target: string }[];
  steps: ArticleStep[];
  cautions: string[];
  faqs?: { question: string; answer: string }[];
  sources?: { label: string; url: string }[];
  related: string[];
  seoTitle: string;
  metaDescription: string;
};

export const categoryLabels: Record<ArticleCategory, string> = {
  save: 'セーブデータ',
  launch: '起動しない',
  display: 'FPS',
  settings: '画面・設定',
  server: '専用サーバー',
  controller: 'コントローラー',
  mods: 'MOD',
  specs: '推奨スペック',
};

const monsterHunter = gameBySlug('monster-hunter-wilds');
if (!monsterHunter)
  throw new Error('Monster Hunter Wilds guide data is missing');
const palworld = gameBySlug('palworld');
if (!palworld) throw new Error('Palworld guide data is missing');

const originalGameArticles: GameArticle[] = [
  {
    gameSlug: monsterHunter.slug,
    slug: 'not-launching',
    category: 'launch',
    title: 'モンハンワイルズが起動しない・クラッシュする時の対処法【PC版】',
    shortTitle: '起動しない・クラッシュ',
    symptom:
      '起動直後に落ちる、黒い画面で止まる、更新後やMOD導入後から起動できない場合の切り分け手順です。',
    conclusion:
      '最初にMODを外し、Steamの整合性確認、PC再起動、設定ファイルの再生成を1項目ずつ試します。',
    description:
      '原因を特定できるよう、元に戻せる確認から順番に進めます。複数の設定を同時に変えないことが重要です。',
    checkedAt: '2026-09-08',
    symptoms: [
      { label: '起動直後に落ちる', target: 'verify-files' },
      { label: '黒い画面のまま', target: 'reset-config' },
      { label: 'アップデート後', target: 'verify-files' },
      { label: 'MOD導入後', target: 'remove-mods' },
      { label: '動作が極端に重い', target: 'check-vram' },
    ],
    steps: [
      {
        id: 'remove-mods',
        title: 'MODをすべて退避して、本体だけで起動する',
        summary: '更新後は、以前動いていたMODでも起動を妨げることがあります。',
        actions: [
          'ゲームを終了する',
          'MOD管理ツールを使っている場合は、すべて無効にする',
          '手動導入したファイルがある場合は、元の場所を記録してからゲームフォルダ外へ移す',
          'Steamからゲームを起動して確認する',
        ],
        note: '削除ではなく「退避」にすると元へ戻せます。オンライン機能やアンチチートの規約を優先してください。',
      },
      {
        id: 'verify-files',
        title: 'Steamでゲームファイルの整合性を確認する',
        summary: '不足・破損したファイルをSteamに確認させます。',
        actions: [
          'Steamを開く',
          '「ライブラリ」を開く',
          'モンスターハンターワイルズを右クリックする',
          '「プロパティ」を開く',
          '「インストール済みファイル」を選ぶ',
          '「ゲームファイルの整合性を確認」を押す',
          '完了後にPCを再起動し、ゲームを起動する',
        ],
      },
      {
        id: 'update-driver',
        title: 'GPUドライバーを更新してWindowsを再起動する',
        summary:
          'ドライバー更新は、インストール後の再起動まで行って確認します。',
        actions: [
          '使用中のGPUがNVIDIA・AMD・Intelのどれかを確認する',
          'GPUメーカーの公式アプリまたは公式サイトから対応ドライバーを入れる',
          'インストール完了後にWindowsを再起動する',
          'ほかの設定を変えずにゲームを起動する',
        ],
      },
      {
        id: 'reset-config',
        title: 'config.iniを退避して設定を再生成する',
        summary: '壊れた表示設定が原因の場合に、初期設定へ戻して確認できます。',
        actions: [
          `ゲームを終了する`,
          `「${monsterHunter.configPath}」を開く`,
          'config.iniをデスクトップなどへコピーしてバックアップする',
          '元のconfig.iniをゲームフォルダ外へ移す',
          'ゲームを起動し、新しい設定ファイルが作られるか確認する',
        ],
        note: '起動できた場合は、古い設定を一度に戻さず、ゲーム内設定を少しずつ調整してください。',
      },
      {
        id: 'check-vram',
        title: '高解像度テクスチャと空き容量を確認する',
        summary: 'VRAMやストレージの不足が疑われる場合の確認です。',
        actions: [
          '高解像度テクスチャを使用している場合は一度外して確認する',
          'テクスチャ品質を下げる',
          'ゲームを入れているドライブの空き容量を確認する',
          '変更後にゲームを再起動する',
        ],
      },
    ],
    cautions: [
      '設定ファイルを削除する前に必ずバックアップしてください。',
      'MODや改変ファイルを使う場合は、ゲームの利用規約とオンライン機能の制限を確認してください。',
    ],
    faqs: [
      {
        question: 'モンハンワイルズが起動直後に落ちる時は何から試しますか？',
        answer:
          'MODをすべて退避し、Steamのゲームファイル整合性確認を行ってからPCを再起動します。複数の対策を同時に行わず、1項目ずつ確認してください。',
      },
      {
        question: '黒い画面のまま進まない場合は？',
        answer:
          'config.iniをバックアップ後にゲームフォルダ外へ退避し、安全な初期設定が再生成されるか確認します。',
      },
    ],
    related: ['config-file', 'system-requirements', 'fps', 'mod'],
    seoTitle: 'モンハンワイルズが起動しない・クラッシュする時の対処法【PC版】',
    metaDescription:
      'PC版モンハンワイルズが起動しない、黒い画面で止まる、クラッシュする時の対処法。MODの退避、Steam整合性確認、GPUドライバー、config.ini再生成を順番に解説します。',
  },
  {
    gameSlug: monsterHunter.slug,
    slug: 'save-data',
    category: 'save',
    title: 'モンハンワイルズのセーブデータ場所とバックアップ方法【Steam版】',
    shortTitle: 'セーブデータの場所',
    symptom:
      'セーブデータの保存先を開きたい、アップデートや設定変更前にバックアップしたい人向けです。',
    conclusion: `Steam版の確認先は「${monsterHunter.savePath}」です。フォルダを丸ごと別の場所へコピーして保全します。`,
    description:
      'Steam IDごとにフォルダが分かれるため、複数アカウントを使っている場合は更新日時も確認してください。',
    checkedAt: '2026-09-08',
    symptoms: [
      { label: '保存場所を開きたい', target: 'open-save' },
      { label: 'バックアップしたい', target: 'backup-save' },
      { label: '設定も保存したい', target: 'backup-config' },
    ],
    steps: [
      {
        id: 'open-save',
        title: 'セーブデータのフォルダを開く',
        summary: 'エクスプローラーからSteamのuserdataフォルダをたどります。',
        actions: [
          'Steamを終了する',
          'エクスプローラーでSteamのインストール先を開く',
          'userdata → 自分のSteam ID → 2246340 → remote → win64_save の順に開く',
          '更新日時を確認し、使用中のデータか確かめる',
        ],
        note: `保存先の表記：${monsterHunter.savePath}`,
      },
      {
        id: 'backup-save',
        title: 'セーブフォルダを丸ごとバックアップする',
        summary: '個別ファイルではなく、対象フォルダ全体をコピーします。',
        actions: [
          'win64_saveフォルダを選ぶ',
          '右クリックして「コピー」を選ぶ',
          '別ドライブや分かりやすいバックアップ先へ貼り付ける',
          'フォルダ名にバックアップ日を付ける',
          'コピー先を開き、ファイルが入っていることを確認する',
        ],
      },
      {
        id: 'backup-config',
        title: '設定ファイルも一緒に保全する',
        summary: '画質や操作設定を戻せるよう、config.iniもコピーします。',
        actions: [
          `「${monsterHunter.configPath}」を開く`,
          'config.iniをコピーする',
          'セーブデータとは別だと分かる名前でバックアップ先へ保存する',
        ],
      },
    ],
    cautions: [
      'ゲームやSteam Cloudの同期中にファイルを移動・上書きしないでください。',
      '復元前にも現在のデータを別名で残してください。',
    ],
    faqs: [
      {
        question: 'モンハンワイルズのセーブデータはどこですか？',
        answer:
          'Steamのuserdataフォルダ内にある、Steam ID、2246340、remote、win64_saveの順に開いた場所です。',
      },
      {
        question: 'バックアップはどのファイルをコピーしますか？',
        answer:
          '個別ファイルではなくwin64_saveフォルダを丸ごとコピーし、バックアップ日を付けて別の場所へ保存します。',
      },
    ],
    related: ['config-file', 'not-launching', 'mod', 'system-requirements'],
    seoTitle: 'モンハンワイルズのセーブデータ場所とバックアップ方法【Steam版】',
    metaDescription:
      'Steam版モンハンワイルズのセーブデータとconfig.iniの場所、フォルダの開き方、アップデート前に安全にバックアップする手順を解説します。',
  },
  {
    gameSlug: monsterHunter.slug,
    slug: 'fps',
    category: 'display',
    title: 'モンハンワイルズのFPS上限設定とカクつき確認手順【PC版】',
    shortTitle: 'FPS上限・カクつき',
    symptom:
      'FPSが安定しない、上限値を変えたい、フレーム生成後の表示が分かりにくい場合の確認手順です。',
    conclusion:
      'モニターのリフレッシュレートを確認し、ゲーム内の上限を60・120・144など環境に合わせて設定します。',
    description: monsterHunter.fps,
    checkedAt: '2026-09-08',
    symptoms: [
      { label: 'FPS上限を変えたい', target: 'set-limit' },
      { label: 'カクつく', target: 'reduce-load' },
      { label: '表示FPSが合わない', target: 'frame-generation' },
    ],
    steps: [
      {
        id: 'set-limit',
        title: 'モニターとゲームのFPS上限を合わせる',
        summary: '先にWindows側のリフレッシュレートを確認します。',
        actions: [
          'Windowsの「設定」を開く',
          '「システム」→「ディスプレイ」→「ディスプレイの詳細設定」を開く',
          '現在のリフレッシュレートを確認する',
          'ゲーム内のグラフィック設定を開く',
          'フレームレート上限を60・120・144などモニターに近い値へ設定する',
          '同じ場所で数分プレイし、安定性を比較する',
        ],
      },
      {
        id: 'reduce-load',
        title: '負荷の高い設定を1項目ずつ下げる',
        summary: '一度に全部変えず、効果のあった設定を判別します。',
        actions: [
          '現在のグラフィック設定をメモまたは画面撮影で残す',
          '高解像度テクスチャを使用している場合はVRAM使用量を確認する',
          'テクスチャ品質など負荷の高い項目を1つ下げる',
          '同じ場面でFPSとカクつきを比較する',
        ],
      },
      {
        id: 'frame-generation',
        title: '実FPSとフレーム生成後の表示を分けて確認する',
        summary: 'フレーム生成のON/OFFで体感と表示値を比較します。',
        actions: [
          'フレーム生成をOFFにして基準の動作を確認する',
          'フレーム生成をONにして同じ場面を確認する',
          '表示FPSだけでなく操作の遅れや映像の乱れも比較する',
        ],
      },
    ],
    cautions: [
      '非公式の上限解除ツールは、オンライン機能やアップデートとの互換性を必ず確認してください。',
    ],
    faqs: [
      {
        question: 'モンハンワイルズのFPS上限はどう設定しますか？',
        answer:
          'Windowsのリフレッシュレートを確認し、ゲーム内の上限を60、120、144などモニターに合う値へ設定します。',
      },
      {
        question: '推奨スペックでも60fpsが安定しないのはなぜですか？',
        answer:
          '公式推奨の60fps想定は1080p、中設定、フレーム生成ONの条件です。場面やVRAM使用量によって実際のfpsは変わります。',
      },
    ],
    related: ['system-requirements', 'hdr', 'ultrawide', 'not-launching'],
    seoTitle: 'モンハンワイルズのFPS上限設定とカクつき確認手順【PC版】',
    metaDescription:
      'PC版モンハンワイルズのFPS上限、カクつき、フレーム生成を確認する手順。Windowsのリフレッシュレート確認からゲーム内設定の比較まで解説します。',
  },
  {
    gameSlug: monsterHunter.slug,
    slug: 'controller',
    category: 'controller',
    title: 'モンハンワイルズでコントローラーが反応しない時の設定【PC版】',
    shortTitle: 'コントローラー設定',
    symptom:
      'コントローラーが反応しない、二重入力になる、ボタン表示が合わない場合の確認手順です。',
    conclusion:
      'Steam Inputと外部の変換ツールを同時に使わず、接続と入力方式を1つずつ比較します。',
    description: monsterHunter.controller,
    checkedAt: '2026-09-08',
    symptoms: [
      { label: '反応しない', target: 'connection' },
      { label: '二重入力になる', target: 'steam-input' },
      { label: 'ボタン表示が違う', target: 'steam-input' },
    ],
    steps: [
      {
        id: 'connection',
        title: '接続を1台だけにして認識を確認する',
        summary: '複数の入力機器や無線接続を一度切り分けます。',
        actions: [
          'ゲームを終了する',
          '使わないコントローラーをPCから外す',
          '対象コントローラーをUSBケーブルで接続する',
          'Steamを再起動する',
          'Steamのコントローラー設定画面で入力が認識されるか確認する',
        ],
      },
      {
        id: 'steam-input',
        title: 'Steam InputをON・OFFで比較する',
        summary: '二重変換を避け、どちらか一方の入力方式にします。',
        actions: [
          'Steamの「ライブラリ」を開く',
          'モンスターハンターワイルズを右クリックする',
          '「プロパティ」→「コントローラー」を開く',
          'Steam Inputの設定を変更する',
          'DS4Windowsなど外部ツールを使う場合は、Steam Inputとの同時使用を避ける',
          'ゲームを起動して入力とボタン表示を確認する',
        ],
        note: '最初の状態へ戻せるよう、変更前の設定をメモしてください。',
      },
      {
        id: 'reconnect',
        title: 'SteamとPCを再起動して再接続する',
        summary: '設定変更後に認識が残っている場合は、接続情報を読み直します。',
        actions: [
          'ゲームとSteamを終了する',
          'コントローラーを取り外す',
          'PCを再起動する',
          'Steam起動後にコントローラーを接続する',
          'ゲームを起動して確認する',
        ],
      },
    ],
    cautions: ['コントローラー変換ツールは複数を同時に起動しないでください。'],
    faqs: [
      {
        question: 'モンハンワイルズでコントローラーが反応しない時は？',
        answer:
          'ほかの入力機器を外してUSB接続で認識を確認し、Steam InputのONとOFFを切り替えて比較します。',
      },
      {
        question: '二重入力になる原因は？',
        answer:
          'Steam InputとDS4Windowsなど複数の変換手段が同時に動いている可能性があります。入力変換は1つだけにします。',
      },
    ],
    related: ['not-launching', 'save-data', 'fps', 'mod'],
    seoTitle: 'モンハンワイルズでコントローラーが反応しない時の設定【PC版】',
    metaDescription:
      'PC版モンハンワイルズでコントローラーが反応しない、二重入力になる時の対処法。USB接続、Steam Input、外部変換ツールを順番に確認します。',
  },
  {
    gameSlug: monsterHunter.slug,
    slug: 'mod',
    category: 'mods',
    title: 'モンハンワイルズのMOD導入前準備と起動しない時の戻し方【PC版】',
    shortTitle: 'MOD導入・戻し方',
    symptom:
      'MOD導入前に準備したい、アップデート後やMOD追加後に起動しなくなった場合の安全な切り分けです。',
    conclusion:
      'セーブとゲームフォルダを先にバックアップし、MODは1個ずつ追加します。問題時は全MODを退避して本体だけで確認します。',
    description: monsterHunter.mod,
    checkedAt: '2026-09-08',
    symptoms: [
      { label: '導入前に準備したい', target: 'prepare' },
      { label: 'MOD後に起動しない', target: 'remove-all' },
      { label: '原因MODを探したい', target: 'isolate' },
    ],
    steps: [
      {
        id: 'prepare',
        title: '導入前に元へ戻せる状態を作る',
        summary: 'セーブと設定、変更するゲームファイルを保全します。',
        actions: [
          'ゲームを終了する',
          `「${monsterHunter.savePath}」を別の場所へコピーする`,
          'ゲームフォルダ内で変更するファイルの元の場所を記録する',
          'MOD名・配布元・対応ゲームバージョンをメモする',
          'ゲームの利用規約とオンライン機能の制限を確認する',
        ],
      },
      {
        id: 'remove-all',
        title: 'すべてのMODを退避して本体だけで起動する',
        summary: '問題が本体側かMOD側かを最初に分けます。',
        actions: [
          'MOD管理ツール上ですべて無効にする',
          '手動導入ファイルは削除せずゲームフォルダ外へ移す',
          'Steamでゲームファイルの整合性を確認する',
          'PCを再起動してゲームを起動する',
        ],
      },
      {
        id: 'isolate',
        title: 'MODを1個ずつ戻して原因を切り分ける',
        summary: '本体だけで起動できた場合に行います。',
        actions: [
          '対応バージョンが確認できるMODを1個だけ戻す',
          'ゲームを起動して確認する',
          '問題がなければ次のMODを1個追加する',
          '起動しなくなった直前に追加したMODを再び外す',
        ],
        note: '大型アップデート直後は、MOD側の対応版が出るまで外したままにするのが安全です。',
      },
    ],
    cautions: [
      '配布元が不明な実行ファイルや翻訳ファイルは使用しないでください。',
      'MOD使用によりオンライン機能やサポートの対象外になる場合があります。公式の利用規約を優先してください。',
      monsterHunter.japanese,
    ],
    faqs: [
      {
        question: 'MODを入れた後にモンハンワイルズが起動しない場合は？',
        answer:
          '全MODを削除せずゲームフォルダ外へ退避し、Steamの整合性確認後に本体だけで起動します。',
      },
      {
        question: 'モンハンワイルズに日本語化MODは必要ですか？',
        answer:
          '必要ありません。PC版はインターフェース、音声、字幕が公式に日本語対応しています。',
      },
    ],
    related: ['not-launching', 'save-data', 'config-file', 'fps'],
    seoTitle: 'モンハンワイルズのMOD導入前準備と起動しない時の戻し方【PC版】',
    metaDescription:
      'PC版モンハンワイルズへMODを導入する前のバックアップ、アップデート後に起動しない時の外し方、原因MODを1個ずつ切り分ける方法を解説します。',
  },
  {
    gameSlug: monsterHunter.slug,
    slug: 'config-file',
    category: 'settings',
    title:
      'モンハンワイルズのconfig.iniはどこ？設定ファイルの場所と初期化方法【Steam版】',
    shortTitle: 'config.iniの場所・初期化',
    symptom:
      'config.iniの保存場所を開きたい、画面設定を初期化したい、設定変更後に黒い画面で止まる人向けです。',
    conclusion: `config.iniは「${monsterHunter.configPath}」にあります。編集前にコピーし、初期化するときは削除せずゲームフォルダ外へ退避します。`,
    description:
      'config.iniにはPC版の表示設定などが保存されます。値の直接編集は入力ミスの原因になるため、まずはバックアップと自動再生成で切り分けます。',
    checkedAt: '2026-09-09',
    symptoms: [
      { label: 'config.iniが見つからない', target: 'open-config' },
      { label: '設定を初期化したい', target: 'reset-config' },
      { label: '黒い画面で起動しない', target: 'safe-start' },
      { label: '元の設定へ戻したい', target: 'restore-config' },
    ],
    steps: [
      {
        id: 'open-config',
        title: 'Steamからゲームのインストール先を開く',
        summary:
          'ドライブ文字が分からなくてもSteamから正しいフォルダを開けます。',
        actions: [
          'Steamの「ライブラリ」を開く',
          'モンスターハンターワイルズを右クリックする',
          '「管理」→「ローカルファイルを閲覧」を選ぶ',
          '開いたゲームフォルダ直下のconfig.iniを確認する',
        ],
        note: `場所の表記：${monsterHunter.configPath}`,
      },
      {
        id: 'reset-config',
        title: 'config.iniを退避して自動再生成する',
        summary: '元へ戻せるようにしたうえで、設定だけを初期状態にします。',
        actions: [
          'ゲームとSteamを終了する',
          'config.iniをデスクトップなどへコピーする',
          '元のconfig.iniをゲームフォルダ外へ移す',
          'Steamからゲームを起動する',
          '新しいconfig.iniが作成され、起動できるか確認する',
        ],
        note: '新しいファイルが作られない場合は、Steamの整合性確認を行ってから再試行してください。',
      },
      {
        id: 'safe-start',
        title: '起動できたら低負荷設定から戻す',
        summary:
          '壊れた解像度や重すぎる画質設定を再び読み込まないようにします。',
        actions: [
          '最初はウィンドウまたはボーダーレス表示で起動する',
          '解像度をモニターの標準値に合わせる',
          'フレーム生成や高解像度テクスチャはOFFのまま確認する',
          'ゲームを一度終了し、もう一度正常に起動できるか確認する',
        ],
      },
      {
        id: 'restore-config',
        title: '必要な設定だけゲーム内で戻す',
        summary:
          '古いconfig.iniを丸ごと上書きせず、原因を特定できる状態を保ちます。',
        actions: [
          '退避したconfig.iniはバックアップとして残す',
          'ゲーム内メニューから設定を1項目ずつ戻す',
          '各変更後に再起動して問題が再発しないか確認する',
        ],
      },
    ],
    cautions: [
      'config.iniを編集・移動する前にゲームとSteamを終了してください。',
      '直接編集した値が公式設定画面の範囲外だと、更新後に起動できなくなる場合があります。',
    ],
    faqs: [
      {
        question: 'モンハンワイルズのconfig.iniはどこにありますか？',
        answer:
          'Steamのゲームインストールフォルダ直下にあります。Steamライブラリでゲームを右クリックし、「管理」から「ローカルファイルを閲覧」を選ぶと開けます。',
      },
      {
        question: 'config.iniを消しても大丈夫ですか？',
        answer:
          '先にコピーを作り、削除ではなくゲームフォルダ外へ退避してください。次回起動時に再生成されるか確認し、問題時は元へ戻します。',
      },
      {
        question: 'config.iniの初期化でセーブデータも消えますか？',
        answer:
          'セーブデータは別のSteam userdataフォルダにあります。ただし作業前にはセーブ側もバックアップしておくと安全です。',
      },
    ],
    sources: [
      {
        label: 'Monster Hunter Wilds公式トラブルシューティング（Steam）',
        url: 'https://steamcommunity.com/app/2246340/discussions/0/596267902352499417/',
      },
      {
        label: 'PCGamingWiki（設定ファイル場所）',
        url: 'https://www.pcgamingwiki.com/wiki/Monster_Hunter_Wilds',
      },
    ],
    related: ['not-launching', 'save-data', 'fps', 'system-requirements'],
    seoTitle: 'モンハンワイルズのconfig.iniはどこ？場所と初期化方法【Steam版】',
    metaDescription:
      'モンハンワイルズのconfig.iniの場所をSteamから開く方法、設定ファイルのバックアップ、黒い画面や起動不良時に安全に初期化・再生成する手順を解説します。',
  },
  {
    gameSlug: monsterHunter.slug,
    slug: 'system-requirements',
    category: 'specs',
    title: 'モンハンワイルズの推奨スペックは？VRAM・メモリ・SSD要件【PC版】',
    shortTitle: '推奨スペック・VRAM',
    symptom:
      '自分のPCで動くか、メモリ16GBで足りるか、VRAM 6GB・8GBのどちらが必要か確認したい人向けです。',
    conclusion:
      '公式推奨はメモリ16GB、RTX 2060 SuperまたはRX 6600のVRAM 8GB、空き容量75GB、SSD必須です。推奨条件の60fpsはフレーム生成ONが前提です。',
    description:
      '「最低」と「推奨」は画質と想定fpsが異なります。GPU名だけでなくVRAM容量、SSD、DirectX 12、フレーム生成の条件まで合わせて確認します。',
    checkedAt: '2026-09-09',
    symptoms: [
      { label: '推奨スペックを知りたい', target: 'recommended' },
      { label: '最低スペックを知りたい', target: 'minimum' },
      { label: 'VRAM不足を確認したい', target: 'check-vram' },
      { label: '自分のPC構成を調べたい', target: 'check-pc' },
    ],
    steps: [
      {
        id: 'recommended',
        title: '公式の推奨動作環境を確認する',
        summary: '1080p・中設定・60fpsを想定した公式条件です。',
        actions: [
          'CPU：Core i5-10400 / Core i3-12100 / Ryzen 5 3600以上を目安にする',
          'メモリ：16GB RAMを確認する',
          'GPU：RTX 2060 Super（VRAM 8GB）またはRX 6600（VRAM 8GB）以上を目安にする',
          'ストレージ：75GB以上の空きがあるSSDを用意する',
          'DirectX 12が使用できることを確認する',
        ],
        note: 'Steam記載の推奨60fpsはフレーム生成ON、中画質設定の条件です。常時60fpsを保証する表記ではありません。',
      },
      {
        id: 'minimum',
        title: '最低動作環境との違いを確認する',
        summary: '最低条件は高画質・高fps向けではありません。',
        actions: [
          'GPUはGTX 1660（VRAM 6GB）またはRX 5500 XT（VRAM 8GB）が最低目安',
          'メモリは最低条件でも16GB',
          '想定は720pから1080pへのアップスケール、最低画質、30fps',
          '最低条件に近い場合は高解像度テクスチャを使わない',
        ],
      },
      {
        id: 'check-vram',
        title: 'VRAM容量とゲーム内使用量を確認する',
        summary: 'カクつきやテクスチャ表示の遅れがある場合に確認します。',
        actions: [
          'Windowsの「設定」→「システム」→「ディスプレイ」を開く',
          '「ディスプレイの詳細設定」→「ディスプレイ アダプターのプロパティ」を開く',
          '専用ビデオメモリの容量を確認する',
          'ゲーム内のVRAM表示が上限を超えないようテクスチャ品質を下げる',
        ],
      },
      {
        id: 'check-pc',
        title: 'CPU・メモリ・DirectXをdxdiagで確認する',
        summary: 'Windows標準機能だけで主要な構成を確認できます。',
        actions: [
          'WindowsキーとRを同時に押す',
          'dxdiagと入力してEnterを押す',
          '「システム」タブでCPUとメモリを確認する',
          '「ディスプレイ」タブでGPU名とDirectX機能を確認する',
          'Steamストアの最新要件と照合する',
        ],
      },
    ],
    cautions: [
      '公式要件はアップデートで変更される場合があります。購入・増設前はSteamストアの最新表示を確認してください。',
      'GPUの製品名が近くても、ノートPC版やVRAM容量の違いで性能は変わります。',
    ],
    faqs: [
      {
        question: 'モンハンワイルズはメモリ16GBで足りますか？',
        answer:
          '公式の最低・推奨はいずれも16GBです。ほかのアプリを同時に多く開く場合は空きメモリも確認してください。',
      },
      {
        question: 'モンハンワイルズにSSDは必須ですか？',
        answer:
          'Steamストアの最低・推奨要件はいずれもSSD必須と記載されています。75GB以上の空き容量も必要です。',
      },
      {
        question: 'RTX 2060 Superなら60fpsで遊べますか？',
        answer:
          '公式推奨の60fps想定は1080p、中設定、フレーム生成ONという条件です。場面やPC構成によって実際のfpsは変わります。',
      },
    ],
    sources: [
      {
        label: 'Steamストア（公式システム要件）',
        url: 'https://store.steampowered.com/app/2246340/Monster_Hunter_Wilds/',
      },
    ],
    related: ['fps', 'not-launching', 'config-file', 'hdr'],
    seoTitle: 'モンハンワイルズの推奨スペック｜VRAM・メモリ・SSD要件【PC版】',
    metaDescription:
      'PC版モンハンワイルズの最低・推奨スペックを解説。メモリ16GB、VRAM 6GB/8GB、SSD 75GB、RTX 2060 Superで60fpsを狙う際の条件を確認できます。',
  },
  {
    gameSlug: monsterHunter.slug,
    slug: 'hdr',
    category: 'display',
    title: 'モンハンワイルズのHDR設定｜白っぽい・暗い時の直し方【PC版】',
    shortTitle: 'HDRが白っぽい・暗い',
    symptom:
      'HDRを有効にできない、画面が白っぽい・暗い、色が薄いと感じる場合のWindows 11とゲーム内設定の確認手順です。',
    conclusion:
      'HDR対応ディスプレイを選んでWindows側のHDRを先にONにし、ゲームを再起動してからゲーム内のHDRと明るさを調整します。',
    description:
      'Steam版はHDR対応です。表示がおかしいときは、Windows、ディスプレイ本体、ゲームの3か所を順番に確認します。',
    checkedAt: '2026-09-09',
    symptoms: [
      { label: 'HDRを選べない', target: 'enable-windows-hdr' },
      { label: '画面が白っぽい', target: 'balance-brightness' },
      { label: '画面が暗い', target: 'calibrate-hdr' },
      { label: '別モニターだけ映らない', target: 'check-display' },
    ],
    steps: [
      {
        id: 'check-display',
        title: 'HDR対応画面と接続を確認する',
        summary:
          '複数画面では、設定対象のディスプレイを間違えないようにします。',
        actions: [
          'ディスプレイ本体のメニューでHDR入力を有効にする',
          'Windowsの「設定」→「システム」→「ディスプレイ」を開く',
          '画面上部でHDR対応ディスプレイを選ぶ',
          '複製表示で使っている場合は「表示画面を拡張する」へ切り替えて比較する',
        ],
      },
      {
        id: 'enable-windows-hdr',
        title: 'WindowsのHDRを先に有効にする',
        summary: 'ゲームを起動する前にOS側のHDR状態を確定します。',
        actions: [
          '「設定」→「システム」→「ディスプレイ」→「HDR」を開く',
          '選択中ディスプレイの「HDRを使用する」をONにする',
          'モンハンワイルズが起動中なら一度終了する',
          'ゲームを起動し、ゲーム内のHDR出力設定を確認する',
        ],
      },
      {
        id: 'balance-brightness',
        title: '白っぽさはSDR/HDRの明るさバランスから確認する',
        summary: 'Windows上のSDR表示だけが白く見える場合も切り分けます。',
        actions: [
          'WindowsのHDR設定を開く',
          'SDRコンテンツの明るさスライダーを少しずつ調整する',
          'ディスプレイのダイナミックコントラスト等を一度OFFにして比較する',
          'ゲームを再起動して同じ場面で確認する',
        ],
      },
      {
        id: 'calibrate-hdr',
        title: 'Windows HDR Calibrationで画面を調整する',
        summary:
          'Windows 11では公式アプリで黒レベルと最大輝度を合わせられます。',
        actions: [
          'Microsoft StoreからWindows HDR Calibrationを入れる',
          '調整対象のHDRディスプレイでアプリを全画面表示する',
          '案内に従って暗部・最大輝度・彩度を調整する',
          'プロファイル保存後にゲームを再起動する',
        ],
        note: 'ゲーム内の明るさ調整は、Windows側のキャリブレーション後に行います。',
      },
    ],
    cautions: [
      'HDRの見え方はディスプレイのピーク輝度、接続方式、カラープロファイルで変わります。',
      '比較するときはWindows側とゲーム側を同時に変更せず、1項目ずつ確認してください。',
    ],
    faqs: [
      {
        question: 'モンハンワイルズはPC版でHDRに対応していますか？',
        answer:
          'はい。SteamストアではHDR対応機能が明記されています。HDR対応ディスプレイとWindows側の設定も必要です。',
      },
      {
        question: 'HDRをONにすると白っぽくなるのはなぜですか？',
        answer:
          'SDRとHDRの明るさバランス、ディスプレイ側の画質補正、キャリブレーションが合っていない可能性があります。WindowsのHDR設定から順番に確認します。',
      },
      {
        question: 'HDR設定が表示されない場合は？',
        answer:
          'WindowsでHDR対応ディスプレイが選ばれているか、画面の複製ではなく拡張表示になっているか、ディスプレイ本体でHDR入力が有効かを確認してください。',
      },
    ],
    sources: [
      {
        label: 'Steamストア（HDR対応表記）',
        url: 'https://store.steampowered.com/app/2246340/Monster_Hunter_Wilds/',
      },
      {
        label: 'Microsoft サポート（WindowsのHDR設定）',
        url: 'https://support.microsoft.com/ja-jp/windows/hdr-settings-in-windows-2d767185-38ec-7fdc-6f97-bbc6c5ef24e6',
      },
      {
        label: 'Microsoft サポート（HDR Calibration）',
        url: 'https://support.microsoft.com/ja-jp/windows/calibrate-your-hdr-display-using-the-windows-hdr-calibration-app-f30f4809-3369-43e4-9b02-9eabebd23f19',
      },
    ],
    related: ['fps', 'system-requirements', 'config-file', 'ultrawide'],
    seoTitle: 'モンハンワイルズのHDR設定｜白っぽい・暗い時の直し方【PC版】',
    metaDescription:
      'PC版モンハンワイルズのHDR設定を解説。HDRを選べない、白っぽい、暗い時にWindows 11、ディスプレイ、ゲーム内設定を確認する順番をまとめました。',
  },
  {
    gameSlug: monsterHunter.slug,
    slug: 'ultrawide',
    category: 'display',
    title:
      'モンハンワイルズのウルトラワイド設定｜3440×1440・黒帯・21:9対応【PC版】',
    shortTitle: 'ウルトラワイド・黒帯',
    symptom:
      '3440×1440を選べない、21:9で左右に黒帯が出る、UI位置や視野の見え方を確認したい人向けです。',
    conclusion:
      'PC版は21:9までのウルトラワイド表示に対応します。Windows解像度を先に3440×1440へ合わせ、ゲーム内で21:9とUI位置を確認します。',
    description:
      '21:9のゲームプレイ表示と、ムービー・メニュー・画面端の余白は別に確認します。32:9は公式設定だけで全面表示できる前提にしないでください。',
    checkedAt: '2026-09-09',
    symptoms: [
      { label: '3440×1440を選べない', target: 'set-resolution' },
      { label: '左右に黒帯が出る', target: 'check-black-bars' },
      { label: 'UIが端すぎる', target: 'adjust-ui' },
      { label: '32:9で表示したい', target: 'check-aspect' },
    ],
    steps: [
      {
        id: 'set-resolution',
        title: 'Windowsをモニターの標準解像度に合わせる',
        summary: 'ゲーム起動前に3440×1440などのネイティブ解像度を選びます。',
        actions: [
          'Windowsの「設定」→「システム」→「ディスプレイ」を開く',
          '対象のウルトラワイドモニターを選ぶ',
          'ディスプレイ解像度を「推奨」と表示される値へ変更する',
          '「ディスプレイの詳細設定」でリフレッシュレートも確認する',
        ],
      },
      {
        id: 'check-aspect',
        title: 'ゲーム内で21:9の解像度を選ぶ',
        summary: 'PC版の対応範囲に合わせて表示モードを確認します。',
        actions: [
          'ゲームのオプションからディスプレイ設定を開く',
          'ボーダーレスまたはフルスクリーンを選ぶ',
          '3440×1440など21:9の解像度を選ぶ',
          '設定を適用し、実際のゲームプレイ画面を確認する',
        ],
        note: '32:9は21:9とは対応状況が異なります。画面全体に引き伸ばさず、まず公式設定の表示範囲で確認してください。',
      },
      {
        id: 'check-black-bars',
        title: '黒帯が出る場面を切り分ける',
        summary: 'プレイ中、ムービー、メニューで黒帯の有無を分けて確認します。',
        actions: [
          '通常のゲームプレイ画面で左右の表示を確認する',
          'ムービーやメニューだけ黒帯になるか確認する',
          '解像度スケールを100%へ戻して比較する',
          '一度16:9へ変更後、21:9へ戻して設定を読み直す',
        ],
      },
      {
        id: 'adjust-ui',
        title: 'UI位置と画質負荷を調整する',
        summary: '横幅が増えた分の視線移動とGPU負荷を個別に調整します。',
        actions: [
          'ゲーム内にUI位置補正がある場合は中央寄りへ調整する',
          '3440×1440でFPSが落ちる場合はアップスケーラーの品質を1段階下げる',
          'テクスチャ品質はVRAM使用量を見て調整する',
          '同じ場所でFPSと操作感を比較する',
        ],
      },
    ],
    cautions: [
      '非公式のアスペクト比変更MODは、ゲーム更新やオンライン機能との互換性を確認してください。',
      '黒帯がムービーだけに出る場合は、ゲームプレイ時の21:9対応とは別の仕様である可能性があります。',
    ],
    faqs: [
      {
        question: 'モンハンワイルズは3440×1440に対応していますか？',
        answer:
          'PC版は21:9までのウルトラワイド表示に対応しており、3440×1440は代表的な21:9解像度です。Windows側でも同じ解像度を選んでください。',
      },
      {
        question: '21:9なのに左右に黒帯が出る場合は？',
        answer:
          '通常プレイ中かムービー・メニューだけかを分けて確認し、解像度スケールを100%へ戻して21:9を選び直します。',
      },
      {
        question: 'モンハンワイルズは32:9に対応していますか？',
        answer:
          '確認できる技術資料では公式表示は21:9までです。32:9で全面表示できることを前提にせず、公式設定の範囲で確認してください。',
      },
    ],
    sources: [
      {
        label: 'PCGamingWiki（21:9対応状況）',
        url: 'https://www.pcgamingwiki.com/wiki/Monster_Hunter_Wilds',
      },
    ],
    related: ['fps', 'hdr', 'config-file', 'system-requirements'],
    seoTitle:
      'モンハンワイルズのウルトラワイド設定｜3440×1440・黒帯対策【PC版】',
    metaDescription:
      'PC版モンハンワイルズのウルトラワイド設定を解説。3440×1440が選べない、21:9で黒帯が出る、UI位置や32:9対応を確認したい時の手順です。',
  },
  {
    gameSlug: palworld.slug,
    slug: 'save-data',
    category: 'save',
    title: 'パルワールドのセーブデータ場所はどこ？バックアップ方法【Steam版】',
    shortTitle: 'Steam版セーブ場所',
    symptom:
      'Steam版パルワールドのSaveGamesフォルダを開きたい、1.0更新やMOD導入前にワールドをバックアップしたい人向けです。',
    conclusion: `Steam版の保存先は「${palworld.savePath}」です。ゲーム終了後に使用中のワールドフォルダを丸ごと別の場所へコピーします。`,
    description:
      'SaveGames内はSteam IDとワールドIDごとに分かれます。フォルダ名だけで判断せず、更新日時を見て現在遊んでいるワールドを確認します。',
    checkedAt: '2026-09-09',
    symptoms: [
      { label: '保存場所を開きたい', target: 'open-save' },
      { label: 'ワールドをバックアップしたい', target: 'backup-world' },
      { label: 'どのフォルダか分からない', target: 'identify-world' },
      { label: '復元前に保全したい', target: 'prepare-restore' },
    ],
    steps: [
      {
        id: 'open-save',
        title: 'Steam版のSaveGamesフォルダを開く',
        summary: 'Windowsの環境変数を使えばユーザー名を入力せずに開けます。',
        actions: [
          'パルワールドとSteamを終了する',
          'WindowsキーとRを同時に押す',
          String.raw`%LOCALAPPDATA%\Pal\Saved\SaveGames と入力してEnterを押す`,
          'Steam IDと思われる数字のフォルダを開く',
        ],
        note: `保存先の表記：${palworld.savePath}`,
      },
      {
        id: 'identify-world',
        title: '現在使っているワールドを更新日時で確認する',
        summary:
          '複数のワールドがある場合に、誤ったデータを操作しないための確認です。',
        actions: [
          'SaveGamesフォルダを詳細表示にする',
          '「更新日時」で新しい順に並べる',
          '最後にプレイした時刻と近いワールドフォルダを確認する',
          '判断できない場合はSaveGames全体をバックアップする',
        ],
      },
      {
        id: 'backup-world',
        title: 'ワールドフォルダを丸ごとコピーする',
        summary:
          '個別のsavファイルではなく、関連ファイルをまとめて保存します。',
        actions: [
          '対象のワールドフォルダを選択する',
          '別ドライブまたはドキュメント内のバックアップ先へコピーする',
          'フォルダ名に日付と「更新前」などの目的を付ける',
          'コピー先を開き、ファイルとPlayersフォルダが含まれるか確認する',
        ],
      },
      {
        id: 'prepare-restore',
        title: '復元前にも現在の状態を残す',
        summary: '復元結果が違ったときに元へ戻せるようにします。',
        actions: [
          'パルワールドとSteamを終了する',
          '現在のSaveGamesを別名でコピーする',
          'Steam Cloudの同期状態を確認する',
          'バックアップと現在データを混ぜず、フォルダ単位で管理する',
        ],
      },
    ],
    cautions: [
      'プレイ中やSteam Cloud同期中にセーブデータを上書きしないでください。',
      'Steam版とXbox／Microsoft Store版は保存形式と場所が異なるため、この手順をそのまま流用しないでください。',
    ],
    faqs: [
      {
        question: 'Steam版パルワールドのセーブデータはどこですか？',
        answer:
          'Windowsでは%LOCALAPPDATA%\\Pal\\Saved\\SaveGames内です。その下にSteam IDとワールドごとのフォルダがあります。',
      },
      {
        question: 'どのワールドフォルダをコピーすればいいですか？',
        answer:
          '最後にプレイした時刻と更新日時が近いフォルダを確認します。判別できない場合はSaveGamesフォルダ全体をコピーしてください。',
      },
      {
        question: 'バックアップはLevel.savだけで大丈夫ですか？',
        answer:
          'ワールドとプレイヤー情報の組み合わせを保つため、個別ファイルではなく対象ワールドのフォルダ全体をコピーしてください。',
      },
    ],
    sources: [
      {
        label: 'PCGamingWiki（Steam版保存場所）',
        url: 'https://www.pcgamingwiki.com/wiki/Palworld',
      },
    ],
    related: [
      'dedicated-server-backup',
      'not-launching',
      'system-requirements',
      'dedicated-server-settings',
    ],
    seoTitle:
      'パルワールドのセーブデータ場所はどこ？バックアップ方法【Steam版】',
    metaDescription:
      'Steam版パルワールドのセーブデータ場所を開く方法を解説。SaveGames内のワールドを見分け、1.0更新やMOD導入前に安全にバックアップする手順です。',
  },
  {
    gameSlug: palworld.slug,
    slug: 'dedicated-server-settings',
    category: 'server',
    title: 'パルワールドのPalWorldSettings.iniはどこ？専用サーバー設定方法',
    shortTitle: 'PalWorldSettings.iniの場所',
    symptom:
      '専用サーバーの設定ファイルが見つからない、DefaultPalWorldSettings.iniを変更しても反映されない人向けです。',
    conclusion: String.raw`Windows版の実設定は「PalServer\Pal\Saved\Config\WindowsServer\PalWorldSettings.ini」です。DefaultPalWorldSettings.iniをコピーしてから実設定側を編集します。`,
    description:
      '公式サーバーガイドでは、設定用ディレクトリは専用サーバーを一度起動した後に作成されると案内されています。テンプレートと実際に読み込まれるファイルを混同しないことが重要です。',
    checkedAt: '2026-09-09',
    symptoms: [
      { label: 'iniが見つからない', target: 'create-directory' },
      { label: '設定が反映されない', target: 'copy-default' },
      { label: 'Windowsの保存先を知りたい', target: 'open-settings' },
      { label: '変更前に保全したい', target: 'backup-settings' },
    ],
    steps: [
      {
        id: 'create-directory',
        title: '専用サーバーを一度起動して終了する',
        summary:
          '初回起動前はConfig配下の必要なフォルダが存在しない場合があります。',
        actions: [
          'Palworld Dedicated Serverを起動する',
          '起動ログが落ち着くまで待つ',
          '参加者がいない状態でサーバーを正常終了する',
          'PalServerフォルダ内にPal\\Saved\\Configが作られたか確認する',
        ],
      },
      {
        id: 'copy-default',
        title: 'デフォルト設定を実設定ファイルへコピーする',
        summary:
          'DefaultPalWorldSettings.iniはテンプレートであり、直接編集しても反映されません。',
        actions: [
          String.raw`PalServer直下のDefaultPalWorldSettings.iniをコピーする`,
          String.raw`Pal\Saved\Config\WindowsServerフォルダを開く`,
          'コピーしたファイルを貼り付ける',
          'ファイル名をPalWorldSettings.iniにする',
        ],
        note: '拡張子が非表示の場合は、エクスプローラーの「表示」からファイル名拡張子をONにしてください。',
      },
      {
        id: 'open-settings',
        title: 'PalWorldSettings.iniを編集する',
        summary: 'サーバー停止中に、必要なパラメータだけを変更します。',
        actions: [
          'PalWorldSettings.iniを別名でコピーして保全する',
          'テキストエディターで実設定ファイルを開く',
          'ServerNameやServerPasswordなど必要な値だけを変更する',
          '引用符やカンマを崩さず保存する',
          '専用サーバーを再起動して反映を確認する',
        ],
      },
      {
        id: 'backup-settings',
        title: '反映しない場合は読み込み先と書式を確認する',
        summary:
          'テンプレート側を編集していないか、1行の構文が崩れていないかを確認します。',
        actions: [
          '編集先がWindowsServer\\PalWorldSettings.iniか確認する',
          'DefaultPalWorldSettings.iniだけを編集していないか確認する',
          '変更前バックアップと比較して括弧・引用符・カンマを確認する',
          '変更を1項目に戻して再起動する',
        ],
      },
    ],
    cautions: [
      '設定変更前にセーブデータとPalWorldSettings.iniをバックアップしてください。',
      'AdminPasswordやServerPasswordを記事、画像、公開リポジトリへ載せないでください。',
    ],
    faqs: [
      {
        question: 'PalWorldSettings.iniが見つからないのはなぜですか？',
        answer:
          '設定用ディレクトリは専用サーバーを一度起動した後に作成されます。起動して正常終了した後にWindowsServerフォルダを確認してください。',
      },
      {
        question:
          'DefaultPalWorldSettings.iniを編集しても反映されないのはなぜですか？',
        answer:
          'DefaultPalWorldSettings.iniはコピー元のテンプレートです。実際に編集するのはPal\\Saved\\Config\\WindowsServer\\PalWorldSettings.iniです。',
      },
      {
        question: '設定変更後に再起動は必要ですか？',
        answer:
          'はい。サーバーを停止して設定を保存し、再起動後に変更内容を確認してください。',
      },
    ],
    sources: [
      {
        label: 'Palworld公式サーバーガイド（設定パラメータ）',
        url: 'https://docs.palworldgame.com/ja/settings-and-operation/configuration/',
      },
    ],
    related: [
      'dedicated-server-backup',
      'dedicated-server-port',
      'save-data',
      'not-launching',
    ],
    seoTitle: 'PalWorldSettings.iniはどこ？パルワールド専用サーバー設定方法',
    metaDescription:
      'パルワールド専用サーバーのPalWorldSettings.iniの場所、初回作成、DefaultPalWorldSettings.iniを編集しても反映されない時の確認方法を解説します。',
  },
  {
    gameSlug: palworld.slug,
    slug: 'dedicated-server-backup',
    category: 'server',
    title: 'パルワールド専用サーバーのセーブ場所と自動バックアップ設定',
    shortTitle: 'サーバー保存・バックアップ',
    symptom:
      '専用サーバーのワールド保存先を確認したい、自動バックアップを有効にしたい、更新前に手動保全したい管理者向けです。',
    conclusion: String.raw`実設定でbIsUseBackupSaveData=Trueにすると、セーブデータ内にbackupフォルダが作成されます。更新前は/Save後に正常終了し、WorldIDフォルダ全体も別の場所へコピーします。`,
    description:
      '公式の自動バックアップはサーバー内に保存されるため、同じストレージの障害には備えられません。内蔵履歴と別ドライブへの手動コピーを分けて考えます。',
    checkedAt: '2026-09-09',
    symptoms: [
      { label: 'サーバーの保存先を知りたい', target: 'locate-world' },
      { label: '自動バックアップを有効にしたい', target: 'enable-backup' },
      { label: '更新前に手動保存したい', target: 'save-and-stop' },
      { label: '安全にコピーしたい', target: 'copy-world' },
    ],
    steps: [
      {
        id: 'locate-world',
        title: '使用中のWorldIDフォルダを確認する',
        summary: '専用サーバーのワールドとプレイヤーデータをまとめて扱います。',
        actions: [
          String.raw`PalServer\Pal\Saved\SaveGames\0を開く`,
          'ランダムな文字列のWorldIDフォルダを確認する',
          '複数ある場合はサーバー停止後の更新日時で使用中フォルダを判別する',
          'フォルダ内のPlayersとワールド関連ファイルを確認する',
        ],
      },
      {
        id: 'enable-backup',
        title: '公式の自動バックアップを有効にする',
        summary: 'PalWorldSettings.iniのバックアップ設定をONにします。',
        actions: [
          '専用サーバーを停止する',
          'PalWorldSettings.iniをコピーして保全する',
          'bIsUseBackupSaveData=Trueに設定する',
          '保存してサーバーを起動する',
          'セーブデータ内にbackupフォルダが作成されるか確認する',
        ],
        note: '公式資料では30秒ごと5個、10分ごと6個、1時間ごと12個、1日ごと7個のバックアップが案内されています。',
      },
      {
        id: 'save-and-stop',
        title: '更新前に/Saveして正常終了する',
        summary: 'コピー中にサーバーが書き込まない状態を作ります。',
        actions: [
          'PalWorldSettings.iniでAdminPasswordを設定する',
          'ゲーム内で/AdminPassword <パスワード>を実行する',
          '/Saveを実行する',
          '/Shutdown [秒] [メッセージ]で参加者へ告知して終了する',
          'サーバープロセスが完全に停止したことを確認する',
        ],
      },
      {
        id: 'copy-world',
        title: 'WorldIDフォルダ全体を別ストレージへコピーする',
        summary: '内蔵backupと同じ場所だけに残さず、独立したコピーを作ります。',
        actions: [
          '停止中のWorldIDフォルダを丸ごとコピーする',
          'サーバー外の別ドライブまたは独立した保管先へ貼り付ける',
          '日付・サーバーバージョン・WorldIDを記録する',
          'コピー先にPlayersとワールド関連ファイルがあるか確認する',
        ],
      },
    ],
    cautions: [
      'サーバー稼働中にWorldIDフォルダを直接上書きしないでください。',
      'AdminPasswordは秘密情報です。コマンド履歴、配信画面、公開ファイルへ表示しないでください。',
      '自動バックアップを有効にするとディスク負荷が増えます。空き容量も確認してください。',
    ],
    faqs: [
      {
        question: 'パルワールド専用サーバーのセーブ場所はどこですか？',
        answer:
          '通常はPalServer\\Pal\\Saved\\SaveGames\\0の下にあるWorldIDフォルダです。環境やホスティングサービスにより上位のパスは異なります。',
      },
      {
        question: 'bIsUseBackupSaveDataを有効にするとどうなりますか？',
        answer:
          'セーブデータフォルダ内にbackupフォルダが作成され、複数の間隔でバックアップが保存されます。ディスク負荷は増加します。',
      },
      {
        question: '自動バックアップだけで十分ですか？',
        answer:
          '同じサーバーストレージ内にあるため、重要な更新前にはWorldIDフォルダ全体を別の保管先にもコピーしてください。',
      },
    ],
    sources: [
      {
        label: 'Palworld公式サーバーガイド（バックアップ設定）',
        url: 'https://docs.palworldgame.com/ja/settings-and-operation/configuration/',
      },
      {
        label: 'Palworld公式サーバーガイド（管理コマンド）',
        url: 'https://docs.palworldgame.com/ja/settings-and-operation/commands/',
      },
    ],
    related: [
      'dedicated-server-settings',
      'dedicated-server-port',
      'save-data',
      'not-launching',
    ],
    seoTitle: 'パルワールド専用サーバーのセーブ場所・自動バックアップ設定',
    metaDescription:
      'パルワールド専用サーバーのセーブデータ場所、bIsUseBackupSaveDataの自動バックアップ、/Saveと/Shutdownを使った更新前の安全な保全方法を解説します。',
  },
  {
    gameSlug: palworld.slug,
    slug: 'dedicated-server-port',
    category: 'server',
    title: 'パルワールド専用サーバーのポート8211設定と接続できない時の確認',
    shortTitle: 'ポート8211・接続できない',
    symptom:
      '専用サーバーの待受ポートを変更したい、PublicPortを変えても接続先が変わらない、外部から接続できない場合の切り分けです。',
    conclusion:
      '待受ポートは起動引数の-port=8211で指定します。PalWorldSettings.iniのPublicPortは公開情報用で、サーバーが実際に待ち受けるポートを変更しません。',
    description:
      '「起動引数」「PalWorldSettings.ini」「ルーター・ファイアウォール」を分けて確認します。公開IPや管理APIをむやみに外部公開しないことも重要です。',
    checkedAt: '2026-09-09',
    symptoms: [
      { label: '待受ポートを設定したい', target: 'set-listen-port' },
      { label: 'PublicPortが反映されない', target: 'public-port' },
      { label: 'LANではつながる', target: 'check-network' },
      { label: '外部から接続できない', target: 'check-network' },
    ],
    steps: [
      {
        id: 'set-listen-port',
        title: '起動引数で待受ポートを指定する',
        summary: 'Steam版またはSteamCMDの起動方法に合わせて-portを追加します。',
        actions: [
          '専用サーバーを停止する',
          'Steam版はPalworld Dedicated Serverのプロパティを開く',
          '起動オプションへ-port=8211を追加する',
          'SteamCMD版はPalServer.exeの起動コマンドへ-port=8211を追加する',
          '再起動後に指定ポートで待ち受けているか確認する',
        ],
      },
      {
        id: 'public-port',
        title: 'PublicPortとの役割の違いを確認する',
        summary: 'PublicPortだけを変更しても待受ポートは変わりません。',
        actions: [
          'PalWorldSettings.iniのPublicPort値を確認する',
          '待受ポートを変える場合は-portの起動引数を確認する',
          'コミュニティサーバー公開時だけPublicPortとの整合を確認する',
          '設定変更後にサーバーを再起動する',
        ],
      },
      {
        id: 'check-network',
        title: '接続範囲をLAN内から順に切り分ける',
        summary:
          'いきなり全公開せず、サーバー自身、LAN、外部の順に確認します。',
        actions: [
          'サーバーが正常起動しエラーを出していないか確認する',
          'LAN内の別PCからローカルIPと指定ポートで接続を試す',
          'Windows DefenderファイアウォールでPalServerの通信許可を確認する',
          '外部接続が必要な場合だけルーター側の転送先IPとポートを確認する',
          '接続先へ入力したIPとポートがサーバー設定と一致するか確認する',
        ],
        note: 'ルーターの画面名や契約回線の仕様は機種・事業者で異なります。共有回線やCGNATでは、利用者側で外部公開できない場合があります。',
      },
    ],
    cautions: [
      'RCONやREST APIをインターネットへ直接公開しないでください。公式ガイドはREST APIをLAN内での利用に限定するよう警告しています。',
      '不要なポートをまとめて開放せず、使用するポートだけを対象にしてください。',
      '管理パスワードとグローバルIPを公開記事や画面共有へ載せないでください。',
    ],
    faqs: [
      {
        question: 'パルワールド専用サーバーのポートはどこで変更しますか？',
        answer:
          'サーバーの起動引数に-port=8211の形式で指定します。8211部分は使用するポート番号へ置き換えます。',
      },
      {
        question: 'PublicPortを変えても接続ポートが変わらないのはなぜですか？',
        answer:
          'PublicPortはコミュニティサーバーで外部公開ポートを明示する設定で、実際の待受ポートは変更しません。待受側は-port起動引数で指定します。',
      },
      {
        question: 'LAN内では接続できるのに外部から接続できません',
        answer:
          'ルーターの転送先、Windowsファイアウォール、契約回線のCGNATやポート制限を確認します。まず指定ポートとサーバーのローカルIPが一致しているか確認してください。',
      },
    ],
    sources: [
      {
        label: 'Palworld公式サーバーガイド（起動引数）',
        url: 'https://docs.palworldgame.com/ja/settings-and-operation/arguments/',
      },
      {
        label: 'Palworld公式サーバーガイド（PublicPort）',
        url: 'https://docs.palworldgame.com/ja/settings-and-operation/configuration/',
      },
    ],
    related: [
      'dedicated-server-settings',
      'dedicated-server-backup',
      'not-launching',
      'system-requirements',
    ],
    seoTitle: 'パルワールド専用サーバーのポート8211設定｜接続できない時の確認',
    metaDescription:
      'パルワールド専用サーバーの-port=8211起動引数、PublicPortとの違い、LANではつながるのに外部から接続できない時の確認順を解説します。',
  },
  {
    gameSlug: palworld.slug,
    slug: 'not-launching',
    category: 'launch',
    title: 'パルワールド1.0が起動しない・クラッシュする時の対処法【Steam版】',
    shortTitle: '1.0で起動しない・クラッシュ',
    symptom:
      '1.0更新後に起動直後で落ちる、ワールド読み込み中にクラッシュする、古いMODを無効化しても直らない場合の確認手順です。',
    conclusion:
      '最初にセーブを保全し、Steam Workshopと手動導入を含む古いMODを完全に退避してから、ゲームファイルの整合性を確認します。',
    description:
      '公式告知では、1.0で基盤システムが大きく変わり、古いMODがクラッシュやセーブ破損の原因になり得ると案内されています。MOD管理画面でOFFにするだけでなく、導入元ごとに残存ファイルを確認します。',
    checkedAt: '2026-09-09',
    symptoms: [
      { label: '1.0更新後に落ちる', target: 'remove-mods' },
      { label: 'MODを無効化しても直らない', target: 'remove-remnants' },
      { label: '起動直後にクラッシュする', target: 'verify-files' },
      { label: 'ワールド読み込みで落ちる', target: 'test-new-world' },
    ],
    steps: [
      {
        id: 'backup-save',
        title: '作業前にセーブデータをバックアップする',
        summary: 'MOD削除や整合性確認の前に、現在のワールドを保全します。',
        actions: [
          'パルワールドとSteamを終了する',
          String.raw`%LOCALAPPDATA%\Pal\Saved\SaveGamesを開く`,
          'SaveGamesフォルダを別の場所へ丸ごとコピーする',
          'バックアップに日付と「1.0起動確認前」と付ける',
        ],
      },
      {
        id: 'remove-mods',
        title: 'Steam WorkshopのMODをすべて無効化する',
        summary: '公式のMod Management画面で有効なWorkshop MODを外します。',
        actions: [
          'SteamでパルワールドのMOD管理画面を開く',
          '有効なWorkshop MODをすべて無効化する',
          'Workshopの購読状況も確認する',
          'ゲームを起動せず次の残存ファイル確認へ進む',
        ],
      },
      {
        id: 'remove-remnants',
        title: '手動導入MODとローダーをゲーム外へ退避する',
        summary: '管理ツールでOFFにしても残るファイルを切り分けます。',
        actions: [
          'Steamからパルワールドのローカルファイルを開く',
          '手動で追加したMOD、UE4SS、外部ローダーの場所を確認する',
          '削除せずゲームフォルダ外の退避用フォルダへ移す',
          '導入元とファイル名を記録する',
        ],
        note: '公式告知では、MODを管理画面で無効にするだけでは不十分な場合があると案内されています。',
      },
      {
        id: 'verify-files',
        title: 'Steamでゲームファイルの整合性を確認する',
        summary: '不足・破損・改変された本体ファイルをSteamに確認させます。',
        actions: [
          'Steamライブラリでパルワールドを右クリックする',
          '「プロパティ」→「インストール済みファイル」を開く',
          '「ゲームファイルの整合性を確認」を実行する',
          '完了後にPCを再起動する',
          'MODを戻さずゲーム本体だけで起動する',
        ],
      },
      {
        id: 'test-new-world',
        title: '新規ワールドで本体と既存セーブを切り分ける',
        summary:
          'タイトル画面まで起動できる場合に、既存ワールド固有の問題か確認します。',
        actions: [
          'バックアップがあることを再確認する',
          'MODなしで一時的な新規ワールドを作成する',
          '新規ワールドが読み込めるか確認する',
          '新規だけ動く場合は既存セーブへ無理な上書きをせず公式サポート情報を確認する',
        ],
      },
    ],
    cautions: [
      'MODに依存する内容を含むセーブは、MODを外すと正常に読み込めない場合があります。バックアップを残してください。',
      '配布元不明の修復ツールや実行ファイルを使用しないでください。',
    ],
    faqs: [
      {
        question: 'パルワールド1.0で起動直後にクラッシュする時は？',
        answer:
          'セーブをバックアップし、Workshopと手動導入のMODをすべて退避してからSteamの整合性確認とPC再起動を行います。',
      },
      {
        question: 'MODをOFFにしたのに起動しないのはなぜですか？',
        answer:
          'MODローダーや手動導入ファイルがゲームフォルダに残っている可能性があります。管理画面だけでなく導入元ごとの残存ファイルを確認してください。',
      },
      {
        question: '新規ワールドは起動するのに既存ワールドだけ落ちます',
        answer:
          '既存セーブ固有またはMOD依存の可能性があります。バックアップへ上書きせず、使用していたMODの1.0対応と公式の最新告知を確認してください。',
      },
    ],
    sources: [
      {
        label: 'Pocketpair公式告知（1.0とMODの注意）',
        url: 'https://steamcommunity.com/games/1623730/announcements/',
      },
      {
        label: 'Steamサポート（ゲームが起動しない場合）',
        url: 'https://help.steampowered.com/ja/faqs/view/5814-D9A3-BE42-62DF',
      },
    ],
    related: [
      'save-data',
      'system-requirements',
      'dedicated-server-settings',
      'dedicated-server-backup',
    ],
    seoTitle: 'パルワールド1.0が起動しない・クラッシュする時の対処法【Steam】',
    metaDescription:
      'パルワールド1.0が起動しない、更新後にクラッシュする時の対処法。古いMODの完全退避、Steam整合性確認、セーブ保全、新規ワールドでの切り分けを解説します。',
  },
  {
    gameSlug: palworld.slug,
    slug: 'system-requirements',
    category: 'specs',
    title: 'パルワールド1.0の推奨スペック｜メモリ32GB・SSD要件【PC版】',
    shortTitle: '1.0推奨スペック',
    symptom:
      'メモリ16GBで足りるか、RTX 3060 Tiが必要か、SSDや空き容量を購入前に確認したい人向けです。',
    conclusion:
      '公式推奨はWindows 11、メモリ32GB、RTX 3060 TiまたはRX 6700 XT、40GB以上の空き容量、SSD必須です。最低条件のメモリは16GBです。',
    description:
      '最低動作環境と推奨環境を分け、CPU・GPUだけでなくメモリ、SSD、活動中のパル数による性能差まで確認します。',
    checkedAt: '2026-09-09',
    symptoms: [
      { label: '推奨スペックを知りたい', target: 'recommended' },
      { label: 'メモリ16GBで足りるか知りたい', target: 'memory' },
      { label: '最低スペックを知りたい', target: 'minimum' },
      { label: '自分のPC構成を確認したい', target: 'check-pc' },
    ],
    steps: [
      {
        id: 'recommended',
        title: '公式の推奨動作環境を確認する',
        summary: '快適さを重視する場合の公式目安です。',
        actions: [
          'OS：Windows 11 64-bitを確認する',
          'CPU：Core i5-12400またはRyzen 5 5600X以上を目安にする',
          'メモリ：32GB RAMを確認する',
          'GPU：RTX 3060 TiまたはRX 6700 XT以上を目安にする',
          '40GB以上の空きがあるSSDを用意する',
        ],
      },
      {
        id: 'memory',
        title: '16GBと32GBの違いを確認する',
        summary: '16GBは最低条件、32GBは公式推奨です。',
        actions: [
          'タスクマネージャーの「パフォーマンス」→「メモリ」を開く',
          '搭載容量とゲーム起動前の使用量を確認する',
          '16GB環境ではブラウザなど不要なアプリを終了する',
          '大規模拠点や活動中のパルが多い場面で使用量を再確認する',
        ],
      },
      {
        id: 'minimum',
        title: '最低動作環境を確認する',
        summary:
          '起動条件の目安であり、高画質や高fpsを保証するものではありません。',
        actions: [
          'OS：Windows 10 64-bit',
          'CPU：Core i5-9400F',
          'メモリ：16GB RAM',
          'GPU：GTX 1660',
          'DirectX 11、40GBのSSD空き容量を確認する',
        ],
      },
      {
        id: 'check-pc',
        title: 'Windowsで自分の構成を調べる',
        summary: '標準機能でCPU、メモリ、GPUを確認します。',
        actions: [
          'WindowsキーとRを押す',
          'dxdiagと入力してEnterを押す',
          'システムタブでCPUとメモリを確認する',
          'ディスプレイタブでGPUを確認する',
          'Steamストアの最新要件と比較する',
        ],
      },
    ],
    cautions: [
      '公式要件は更新される場合があります。PC購入・増設前はSteamストアの最新表示を確認してください。',
      'Steamは活動中のパル数により性能が変わると案内しています。拠点規模やマルチ人数も考慮してください。',
    ],
    faqs: [
      {
        question: 'パルワールドはメモリ16GBで遊べますか？',
        answer:
          '16GBは公式の最低条件です。公式推奨は32GBで、活動中のパル数や同時起動アプリによって使用量が変わります。',
      },
      {
        question: 'パルワールドにSSDは必要ですか？',
        answer:
          'はい。Steamストアの最低・推奨要件はいずれもSSD必須で、40GBの空き容量が必要です。',
      },
      {
        question: 'パルワールド1.0の推奨GPUは何ですか？',
        answer: '公式推奨はGeForce RTX 3060 TiまたはRadeon RX 6700 XTです。',
      },
    ],
    sources: [
      {
        label: 'Steamストア（公式システム要件）',
        url: 'https://store.steampowered.com/app/1623730/Palworld/',
      },
    ],
    related: [
      'not-launching',
      'save-data',
      'dedicated-server-settings',
      'dedicated-server-port',
    ],
    seoTitle: 'パルワールド1.0の推奨スペック｜メモリ32GB・SSD要件【PC版】',
    metaDescription:
      'パルワールド1.0の最低・推奨スペックを解説。メモリ16GBと32GB、RTX 3060 Ti、SSD 40GB、活動中のパル数による性能差を確認できます。',
  },
];

export const gameArticles: GameArticle[] = [
  ...originalGameArticles,
  ...eldenArticles,
  ...currentGameArticles,
  ...newReleaseArticles,
];

export function articlesForGame(gameSlug: string) {
  return gameArticles.filter((article) => article.gameSlug === gameSlug);
}

export function articleBySlug(gameSlug: string, articleSlug: string) {
  return gameArticles.find(
    (article) => article.gameSlug === gameSlug && article.slug === articleSlug,
  );
}
