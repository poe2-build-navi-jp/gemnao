import type { ArticleCategory, GameArticle } from '@/lib/game-articles';
import { gameBySlug } from '@/lib/games';
type Draft = {
  gameSlug: string;
  slug: string;
  category: ArticleCategory;
  title: string;
  shortTitle: string;
  symptom: string;
  conclusion: string;
  steps: [string, string, string];
  sources: { label: string; url: string }[];
  related: string[];
  causes: string[];
  checkedAt?: string;
  targetVersion?: string;
  actions: [string[], string[], string[]];
};
const targetVersions: Record<string, string> = {
  'the-blood-of-dawnwalker': 'PC版 1.0.2・2026年9月13日時点',
  'star-wars-zero-company': 'PC版・2026年9月9日時点のEA公式案内',
  wardogs: 'Steam版・2026年9月10日の発売直後情報',
};
const make = (d: Draft): GameArticle => ({
  gameSlug: d.gameSlug,
  slug: d.slug,
  category: d.category,
  title: d.title,
  shortTitle: d.shortTitle,
  symptom: d.symptom,
  conclusion: d.conclusion,
  // No generic filler: the same sentence on every article is what ad
  // reviewers flag as low-value, templated content.
  description: '',
  checkedAt: d.checkedAt || '2026-09-13',
  status: 'verified',
  targetVersion: d.targetVersion || targetVersions[d.gameSlug],
  causes: d.causes,
  symptoms: d.steps.map((label, i) => ({ label, target: `step-${i + 1}` })),
  steps: d.steps.map((title, i) => ({
    id: `step-${i + 1}`,
    title,
    summary: '',
    actions: d.actions[i],
  })),
  cautions: [
    'セーブ・設定・キャッシュを変更する前にバックアップしてください。',
    '公式の更新で手順が変わる場合があるため、出典の最新情報も確認してください。',
  ],
  faqs: [],
  sources: d.sources,
  related: d.related,
  seoTitle: d.title,
  metaDescription: d.symptom,
});
const dawn = gameBySlug('the-blood-of-dawnwalker')!;
const zero = gameBySlug('star-wars-zero-company')!;
const wardogs = gameBySlug('wardogs')!;
const dawnKnown = {
  label: 'Dawnwalker公式コミュニティ：既知問題',
  url: 'https://www.reddit.com/r/DawnwalkerOfficial/comments/1w615p8/known_issues_fixes_workarounds_03092026/',
};
const dawnHotfix = {
  label: '公式Hotfix 1.0.2',
  url: 'https://dawnwalkergame.com/us/en/news/hotfix-102',
};
const ea = {
  label: 'EA公式トラブルシューティング',
  url: 'https://help.ea.com/ja/articles/star-wars/zero-company/troubleshoot-common-issues/',
};
export const newReleaseArticles: GameArticle[] = [
  make({
    gameSlug: dawn.slug,
    slug: 'shader-compilation-crash',
    category: 'launch',
    title:
      'The Blood of Dawnwalkerがシェーダーコンパイル中にクラッシュする時の対処',
    shortTitle: 'シェーダーコンパイルでクラッシュ',
    symptom:
      'PC版Dawnwalkerが初回シェーダーコンパイル中に落ちる既知問題の確認手順です。',
    conclusion:
      'マザーボードのBIOSが最新か確認し、更新はメーカー公式手順に従って行います。',
    steps: [
      'クラッシュ位置がシェーダー構築中か確認する',
      'BIOSの現在版と公式最新版を比較する',
      '更新後にシェーダー構築を完了させる',
    ],
    checkedAt: '2026-09-23',
    actions: [
      [
        '起動時の表示を確認し、シェーダー構築中に停止するか記録する',
        'エラー全文、CPU名、ゲームのバージョンを控える。プレイ中だけ落ちる場合は通常のクラッシュ対策へ進む',
      ],
      [
        'Windows＋Rでmsinfo32を開き、システムモデル・ベースボード製品・BIOSバージョンを控える',
        'PCまたはマザーボードメーカーの該当型番のサポートページでBIOS更新内容を比較する',
        '別型番のBIOSは使わない。更新操作は機種ごとに異なるため、電源・回復キーの準備を含むメーカー手順を確認できない場合はサポートに相談する',
      ],
      [
        '必要な更新をメーカー手順で完了した後、ゲームを起動する',
        'シェーダー構築完了まで待つ。再び落ちる場合は連続で再試行せず、エラーと構成を公式サポートへ伝える',
      ],
    ],
    sources: [dawnKnown, dawnHotfix],
    related: ['stutter-windowed', 'controller-sprint'],
    causes: [
      '一部環境でのBIOS・CPUマイクロコード互換性',
      '初回シェーダーコンパイル中の既知クラッシュ',
      '旧Hotfixのまま起動している状態',
    ],
  }),
  make({
    gameSlug: dawn.slug,
    slug: 'stutter-windowed',
    category: 'display',
    title: 'The Blood of Dawnwalkerがカクつく時はフルスクリーンを試す【PC版】',
    shortTitle: 'ウィンドウ表示でカクつく',
    symptom:
      'ウィンドウ・ボーダーレス表示でスタッターが出る公式既知問題の回避策です。',
    conclusion:
      '表示モードをフルスクリーンへ変更し、同じ場所でカクつきが減るか比較します。',
    steps: [
      '現在の表示モードを記録する',
      'フルスクリーンへ変更する',
      '同じ場面でフレーム時間を比較する',
    ],
    checkedAt: '2026-09-23',
    actions: [
      [
        'ゲームの画面設定を開き、表示モード・解像度・FPS上限を控える',
        '同じ場所を移動し、カクつくタイミングを確認する',
      ],
      [
        '表示モードだけをフルスクリーンへ変更して適用する',
        '解像度や画質は変えず、同じ場所で再確認する',
      ],
      [
        '変更前と同じ経路を同じ時間だけ移動し、引っかかりの回数を比較する',
        '既にフレーム時間表示を使っている場合は突出の頻度も比較する。改善しなければ元の表示モードへ戻す',
      ],
    ],
    sources: [dawnKnown, dawnHotfix],
    related: ['shader-compilation-crash', 'controller-sprint'],
    causes: [
      'ウィンドウまたはボーダーレス表示の既知スタッター',
      'シェーダー構築直後の一時的な負荷',
      '表示モード変更後にゲームを再起動していない状態',
    ],
  }),
  make({
    gameSlug: dawn.slug,
    slug: 'controller-sprint',
    category: 'controller',
    title: 'The Blood of Dawnwalkerで走行が止まる・PS5ボタン設定がない時の対処',
    shortTitle: 'コントローラーで走行が止まる',
    symptom:
      '方向転換時に走行が止まる、PS5コントローラーのボタン割り当てがない既知問題です。',
    conclusion:
      '公式Hotfix 1.0.2でPC版の走行入力・デッドゾーンが調整されています。まず1.0.2以降へ更新して再確認してください。PS5ボタン割り当て未対応は、この告知では別の既知問題です。',
    steps: [
      'コントローラーを1台だけ接続する',
      'Hotfix 1.0.2以降へ更新して走行を比較する',
      '最新Hotfixとボタン割り当て対応を確認する',
    ],
    checkedAt: '2026-09-22',
    actions: [
      [
        '余分なコントローラーを外し、いつもの1台で方向転換時に走行が止まるか記録する',
        'ゲームのバージョンとSteam Inputの現在設定を控える',
      ],
      [
        'ランチャーでゲーム更新を確認し、Hotfix 1.0.2以降を適用する',
        '公式1.0.2告知の走行入力・デッドゾーン調整を確認する',
        '同じコントローラー・同じ場所で方向転換し、症状を比較する',
      ],
      [
        'PS5コントローラーのボタン割り当ては1.0.2告知では未解決の別項目です',
        '公式ニュースで後続の修正告知を確認する',
        '走行だけ改善した場合は、ボタン割り当ても修正済みとは判断しない',
      ],
    ],
    sources: [dawnKnown, dawnHotfix],
    related: ['stutter-windowed', 'shader-compilation-crash'],
    causes: [
      'Hotfix 1.0.2の走行入力調整が未適用の状態',
      '複数入力機器または入力変換の競合',
      'PS5コントローラーの割り当て機能が未対応の版',
    ],
  }),
  make({
    gameSlug: zero.slug,
    slug: 'not-launching',
    category: 'launch',
    title:
      'STAR WARS Zero Companyが起動しない・クラッシュする時の対処法【PC版】',
    shortTitle: '起動しない・クラッシュ',
    symptom:
      'EA app・Steam・Epicで起動しない、フリーズ、エラーが出る時の公式手順です。',
    conclusion:
      'PC再起動とゲームファイル修復から確認します。DLSS使用中のクラッシュは、EAが案内するNVIDIAドライバーの条件をSTEP3で確認してください。',
    steps: [
      'PCとランチャーを再起動する',
      'ゲームファイルを修復する',
      'GPUドライバーとWindowsを更新する',
    ],
    checkedAt: '2026-09-24',
    targetVersion: 'PC版・2026年9月24日確認のEA公式トラブルシューティング',
    actions: [
      [
        'ゲームを終了し、PCを再起動する',
        '購入元のランチャーを起動し、保留中のゲーム更新を完了させる',
        '同じ起動方法で再現するか確認する',
      ],
      [
        'EA appではライブラリのゲームタイルの3点メニューから「修復」を選ぶ',
        'Steamではプロパティ→インストール済みファイル→整合性を確認を選ぶ',
        'Epicではライブラリのゲームのメニューから管理→確認を選ぶ',
        '処理完了後に同じ場面で比較する。セーブ復元の操作ではありません',
      ],
      [
        'Windows＋R→dxdiag→ディスプレイでGPU名を確認する。NVIDIAアプリ→ドライバーで現在のGame Readyドライバー版を確認する',
        '公式確認状況（2026年9月24日）：EAはDLSS使用中のクラッシュについて、Game Readyドライバー610.88以前なら対応する新しい版への更新を案内しています。全クラッシュの原因をこの条件に限定するものではありません',
        '該当する場合はNVIDIAアプリ→ドライバーで対応する更新を確認し、インストール後にWindowsを再起動する。AMD・Intelなど別のGPUにはこの版番号の条件を適用しない',
        'Windows更新は設定→Windows Update→更新プログラムのチェックから確認し、完了後に同じ場面で比較する',
        '改善しなければ版番号・エラー全文・再現場面を添えてEA公式サポートへ相談する',
      ],
    ],
    sources: [ea],
    related: ['gtx10-rtx20-low-fps', 'black-screen', 'save-progress'],
    causes: [
      'EA app・Steam・Epicの更新または認証状態',
      '破損・不足したゲームファイル',
      '古いGPUドライバーまたはWindows更新',
    ],
  }),
  make({
    gameSlug: zero.slug,
    slug: 'black-screen',
    category: 'settings',
    title: 'STAR WARS Zero Companyが黒い画面になる時の対処法【PC版】',
    shortTitle: '黒い画面',
    symptom:
      '起動後またはプレイ中に画面が黒くなる時にEA公式が案内する確認項目です。',
    conclusion:
      'GPUドライバー、破損ファイル、PC最小要件の3点を順番に確認します。',
    steps: [
      'GPUドライバーを更新する',
      'ゲームファイルを修復する',
      'PCが最小要件を満たすか確認する',
    ],
    checkedAt: '2026-09-23',
    actions: [
      [
        'Windows＋Rでdxdiagを実行し、ディスプレイ欄のGPU名・ドライバー版を控える',
        'ノートPCは製品メーカー、それ以外はGPUメーカーの公式配布で型番とWindows版に合うドライバーを選ぶ',
        'インストール後にWindowsを再起動し、同じ場面を比較する',
      ],
      [
        'Steamはライブラリのゲームを右クリック→プロパティ→インストール済みファイル→ゲームファイルの整合性を確認を選ぶ',
        'EA appはライブラリのゲームの三点メニュー→修復、Epicはライブラリの三点メニュー→管理→確認を選ぶ',
        '処理完了まで起動せず、完了後にゲームを起動する',
      ],
      [
        'Windows＋Rでdxdiagを開き、CPU・メモリ・GPUを記録する',
        '利用ストアの製品ページの最小動作環境と照合する',
        '不足する項目があれば画質変更だけで起動できるとは限らない。構成とエラーを控えてサポートへ相談する',
      ],
    ],
    sources: [ea],
    related: ['not-launching', 'save-progress'],
    causes: [
      'GPUドライバーと描画処理の不整合',
      '破損・不足したゲームファイル',
      'PCが公式の最小要件を満たしていない状態',
    ],
  }),
  make({
    gameSlug: zero.slug,
    slug: 'save-progress',
    category: 'save',
    title: 'STAR WARS Zero Companyのセーブが消えた・進行が保存されない時の注意',
    shortTitle: '進行が保存されない',
    symptom:
      '終了後に最新の進行が反映されない場合の、EA公式が案内する終了タイミングです。',
    conclusion:
      'Hawksを操作できる状態へ戻るかミッション開始後、数秒待ってからゲームを終了します。',
    steps: [
      'Hawksを操作中か確認する',
      'ミッション開始後に数秒待つ',
      '終了後に再起動して進行を確認する',
    ],
    checkedAt: '2026-09-23',
    actions: [
      [
        'ゲームを終了する前に、ホークスを操作できる状態へ戻る',
        '終了前のミッション名と進行地点を控える。保存前に強制終了しない',
      ],
      [
        'ミッション開始直後はすぐに終了せず、数秒待つ',
        '保存中の表示がある場合は表示が終わってからゲーム内メニューで終了する',
      ],
      [
        '同じアカウントでゲームを起動し、続きから再開する',
        '控えたミッションと進行地点を比較する。失われた進行をこの手順で復元できるわけではない',
      ],
    ],
    sources: [ea],
    related: ['not-launching', 'black-screen'],
    causes: [
      'オートセーブ完了前にゲームを終了した',
      'Hawksを再操作できる前に強制終了した',
      'ミッション開始直後の保存処理が完了していない状態',
    ],
  }),
  make({
    gameSlug: wardogs.slug,
    slug: 'server-connection',
    category: 'server',
    title: 'WARDOGSでサーバー接続できない・ログイン待ちになる時の確認',
    shortTitle: 'サーバー接続・ログイン待ち',
    symptom:
      '発売直後に確認されたサーバー停止、ログイン待ち、接続エラーを切り分けます。',
    conclusion:
      'まず公式の稼働告知を確認し、障害中は設定を変えず復旧を待ちます。待機列表示中は抜けると順番が戻る可能性があります。',
    steps: [
      '公式のサーバー告知を確認する',
      'ログイン待ちなら列を維持する',
      '復旧後にSteamとPCを再起動する',
    ],
    checkedAt: '2026-09-23',
    actions: [
      [
        'ゲーム内のエラー全文と発生時刻を控える',
        'SteamライブラリのWARDOGSのニュースで運営の障害・メンテナンス告知を確認する',
      ],
      [
        '待機列が表示されている場合は連続でキャンセル・再接続せず、そのまま待つ',
        '障害告知中は再インストールやルーター設定変更を進めない',
      ],
      [
        '運営の復旧案内後も接続できない場合はゲームとSteamを終了する',
        'Windowsを再起動してSteamから接続する。改善しなければエラー全文と時刻を運営へ伝える',
      ],
    ],
    sources: [
      {
        label: 'Steamストア',
        url: 'https://store.steampowered.com/app/1867240/WARDOGS/',
      },
      {
        label: '発売日の障害と運営発言',
        url: 'https://www.pcgamer.com/games/fps/wardogs-servers-go-down-as-over-300-000-people-rush-to-play-on-launch-day/',
      },
    ],
    related: [],
    causes: [
      '発売直後のアクセス集中によるサーバー停止',
      'ログインキュー待機中の再接続',
      '復旧直後にSteam側の接続情報が残っている状態',
    ],
  }),
];
