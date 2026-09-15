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
};
const targetVersions: Record<string, string> = {
  'onimusha-way-of-the-sword': 'Steam版・2026年9月13日時点のカプコン公式案内',
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
  description:
    '原因を特定できるよう、上から1項目ずつ試し、毎回同じ条件で結果を確認します。',
  checkedAt: '2026-09-13',
  status: 'verified',
  targetVersion: targetVersions[d.gameSlug],
  causes: d.causes,
  symptoms: d.steps.map((label, i) => ({ label, target: `step-${i + 1}` })),
  steps: d.steps.map((title, i) => ({
    id: `step-${i + 1}`,
    title,
    summary: `${d.shortTitle}の原因を分けるため、「${title}」だけを実施します。`,
    actions: [
      `${d.gameSlug === 'star-wars-zero-company' ? 'EA app・Steam・Epic' : d.gameSlug === 'wardogs' ? 'Steam' : 'ゲームとランチャー'}を終了し、変更前の状態を記録する`,
      `「${title}」を実施し、ほかの設定は変更しない`,
      `同じ起動方法・場面で症状を比較し、改善しなければ元へ戻す`,
    ],
    note:
      i === 2
        ? '公式案内やHotfixが更新されている場合は、新しい内容を優先してください。'
        : undefined,
  })),
  cautions: [
    'セーブ・設定・キャッシュを変更する前にバックアップしてください。',
    '公式の更新で手順が変わる場合があるため、出典の最新情報も確認してください。',
  ],
  faqs: [
    { question: `${d.shortTitle}は何から試しますか？`, answer: d.conclusion },
  ],
  sources: d.sources,
  related: d.related,
  seoTitle: d.title,
  metaDescription: d.symptom,
});
const onimusha = gameBySlug('onimusha-way-of-the-sword')!;
const dawn = gameBySlug('the-blood-of-dawnwalker')!;
const zero = gameBySlug('star-wars-zero-company')!;
const wardogs = gameBySlug('wardogs')!;
const capcom = {
  label: 'カプコン公式トラブルシューティング',
  url: 'https://steamcommunity.com/app/2638890/discussions/0/589562598193771782/',
};
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
    gameSlug: onimusha.slug,
    slug: 'low-fps',
    category: 'display',
    title: '鬼武者 Way of the SwordのFPSが低い・安定しない時の設定【PC版】',
    shortTitle: 'FPS低下・不安定',
    symptom:
      'フレームレートが低い、場面によって急に重くなる時の公式確認手順です。',
    conclusion:
      'GPUドライバーを公式指定以上へ更新し、グラフィックプリセット「最低」で安定性を確認します。',
    steps: [
      'GPUドライバー版を確認する',
      'グラフィックプリセットを最低へ下げる',
      '排熱と電源設定を確認する',
    ],
    sources: [capcom],
    related: ['not-launching', 'shader-cache', 'black-screen', 'crash-report'],
    causes: [
      'カプコン指定より古いGPUドライバー',
      '高い描画設定によるGPU・VRAM負荷',
      '電源制限や排熱不足によるクロック低下',
    ],
  }),
  make({
    gameSlug: onimusha.slug,
    slug: 'shader-cache',
    category: 'settings',
    title: '鬼武者 Way of the Swordのshader.cache削除・再構築方法',
    shortTitle: 'shader.cache再構築',
    symptom:
      '更新後の描画不良やクラッシュで、ゲーム固有シェーダーキャッシュを再構築したい人向けです。',
    conclusion:
      'インストール先のshader.cacheとshader.cache2をバックアップ後に退避し、ゲーム起動で再生成します。',
    steps: [
      'ゲームとSteamを終了する',
      'shader.cacheとshader.cache2を退避する',
      'ゲームを起動して再構築を待つ',
    ],
    sources: [capcom],
    related: ['not-launching', 'low-fps', 'black-screen', 'crash-report'],
    causes: [
      'アップデート前に生成されたshader.cacheの不整合',
      'シェーダー再構築が完了していない状態',
      '描画へ介入するオーバーレイや外部ツール',
    ],
  }),
  make({
    gameSlug: onimusha.slug,
    slug: 'black-screen',
    category: 'settings',
    title: '鬼武者 Way of the Swordが黒画面・映らない時の対処法',
    shortTitle: '黒画面・映らない',
    symptom:
      'ゲームは起動するのに画面が真っ黒、ちらつく、一部しか映らない時の対処です。',
    conclusion:
      'スクリーンモード、解像度、垂直同期を1項目ずつ変更して比較します。HDRだけに問題がある場合は専用記事で切り分けます。',
    steps: [
      'Alt＋Enterで表示方式を切り替える',
      '解像度とVSyncを安全な値へ戻す',
      '外部ディスプレイとオーバーレイを外す',
    ],
    sources: [capcom],
    related: ['not-launching', 'low-fps', 'hdr', 'shader-cache'],
    causes: [
      '保存された解像度・画面モードと現在のモニターの不一致',
      'VSyncや外部ディスプレイ構成の競合',
      '録画・FPS表示など描画へ介入するアプリ',
    ],
  }),
  make({
    gameSlug: onimusha.slug,
    slug: 'hdr',
    category: 'settings',
    title: '鬼武者 Way of the SwordのHDRが白っぽい・有効にならない時の対処',
    shortTitle: 'HDRが白っぽい・有効にならない',
    symptom:
      'HDRを有効にできない、画面が白っぽい・暗い、HDR切替後に表示が不安定な場合の記事です。',
    conclusion:
      'Windowsとモニター側のHDRを確認し、ゲーム内のHDR出力を切り替えてから明るさを調整します。',
    steps: [
      'WindowsとモニターのHDRを確認する',
      'ゲーム内HDR出力を切り替える',
      '明るさを調整して同じ場面で比較する',
    ],
    sources: [capcom],
    related: ['black-screen', 'low-fps', 'not-launching'],
    causes: [
      'Windowsまたはモニター側でHDRが無効',
      'ゲーム内HDR出力とWindows設定の組み合わせ',
      'モニターの最大輝度に合わない明るさ設定',
    ],
  }),
  make({
    gameSlug: onimusha.slug,
    slug: 'gpu-driver-version',
    category: 'launch',
    title: '鬼武者 Way of the SwordのGPUドライバー条件｜NVIDIA・AMD対応版',
    shortTitle: 'GPUドライバー対応版',
    symptom:
      '起動前に必要なNVIDIA・AMDドライバー版を確認したい、更新後も不具合が続く場合の記事です。',
    conclusion:
      'カプコン案内の下限はNVIDIA 596.49以上、AMD 26.5.1以上です。メーカー公式版へ更新後、Windowsを再起動します。',
    steps: [
      'GPU名と現在のドライバー版を確認する',
      'メーカー公式から対応版へ更新する',
      'Windows再起動後にゲームだけを起動する',
    ],
    sources: [capcom],
    related: ['not-launching', 'low-fps', 'black-screen'],
    causes: [
      'NVIDIA 596.49またはAMD 26.5.1より古いドライバー',
      '更新後にWindowsを再起動していない状態',
      'GPU自動判定やドライバー導入の不整合',
    ],
  }),
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
      '一時回避としてコントローラー感度を1.0から0.8へ下げ、本体更新も確認します。',
    steps: [
      'コントローラーを1台だけ接続する',
      '感度を0.8へ下げて比較する',
      '最新Hotfixとボタン割り当て対応を確認する',
    ],
    sources: [dawnKnown, dawnHotfix],
    related: ['stutter-windowed', 'shader-compilation-crash'],
    causes: [
      'コントローラー感度1.0で方向転換時に走行が止まる既知問題',
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
      'PC再起動、ランチャー更新、ゲームファイル修復、GPUドライバー更新の順で試します。',
    steps: [
      'PCとランチャーを再起動する',
      'ゲームファイルを修復する',
      'GPUドライバーとWindowsを更新する',
    ],
    sources: [ea],
    related: ['black-screen', 'save-progress'],
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
