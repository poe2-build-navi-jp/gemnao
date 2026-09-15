import type { GameArticle } from '@/lib/game-articles';
import { gameBySlug } from '@/lib/games';
const game = gameBySlug('onimusha-way-of-the-sword');
if (!game) throw new Error('Onimusha data is missing');
const source = {
  label: 'カプコン公式トラブルシューティング',
  url: 'https://steamcommunity.com/app/2638890/discussions/0/589562598193771782/',
};
const base: Pick<
  GameArticle,
  'gameSlug' | 'checkedAt' | 'cautions' | 'sources'
> = {
  gameSlug: game.slug,
  checkedAt: '2026-09-12',
  cautions: [
    'config.iniやキャッシュを変更する前に別の場所へコピーしてください。',
    'セキュリティソフトの除外設定は、公式の実行ファイルとフォルダだけを対象にしてください。',
  ],
  sources: [source],
};
export const currentGameArticles: GameArticle[] = [
  {
    ...base,
    slug: 'not-launching',
    category: 'launch',
    title:
      '鬼武者 Way of the Swordが起動しない・クラッシュする時の対処法【PC版】',
    shortTitle: '起動しない・クラッシュ',
    symptom:
      '起動しない、起動直後に落ちる、表示が乱れる場合をカプコン公式案内に沿って確認します。',
    conclusion:
      'GPUドライバー更新、整合性確認、描画に介入するアプリ停止の順で試します。',
    description:
      '公式が指定するドライバー下限とゲーム固有キャッシュを含め、原因を1項目ずつ切り分けます。',
    symptoms: [
      { label: '起動しない', target: 'driver' },
      { label: '起動直後に落ちる', target: 'verify' },
      { label: '表示が乱れる', target: 'overlay' },
    ],
    steps: [
      {
        id: 'driver',
        title: '公式指定以上のGPUドライバーへ更新する',
        summary: 'NVIDIA 596.49以上、AMD 26.5.1以上を確認します。',
        actions: [
          'GPUと現在の版を確認する',
          'メーカー公式サイトから対応版を入れる',
          'Windowsを再起動する',
        ],
      },
      {
        id: 'verify',
        title: 'Steamで整合性を確認する',
        summary: '不足・破損ファイルを再取得します。',
        actions: [
          'ゲームフォルダをバックアップする',
          'Steamのプロパティから整合性確認を実行する',
          '完了後にPCを再起動する',
        ],
      },
      {
        id: 'overlay',
        title: '描画に介入するアプリを終了する',
        summary: '録画、FPS表示、オーバーレイを切り分けます。',
        actions: [
          '録画ツールを終了する',
          'パフォーマンス表示をOFFにする',
          'ゲームだけを起動して確認する',
        ],
      },
    ],
    faqs: [
      {
        question: '鬼武者 Way of the Swordが起動しない時は何から試しますか？',
        answer:
          '対応GPUドライバーへ更新して再起動し、Steamの整合性確認を行います。',
      },
    ],
    related: ['crash-report'],
    seoTitle: '鬼武者 Way of the Swordが起動しない・クラッシュする時の対処法',
    metaDescription:
      'PC版鬼武者 Way of the Swordが起動しない、クラッシュする時の対処法。公式指定GPUドライバー、Steam整合性、オーバーレイを確認します。',
  },
  {
    ...base,
    slug: 'crash-report',
    category: 'launch',
    title: '鬼武者 Way of the SwordのCrashReport保存場所と確認方法',
    shortTitle: 'CrashReportの場所',
    symptom:
      'クラッシュ後にカプコンへ報告するzipファイルの場所を確認したい人向けです。',
    conclusion: String.raw`標準ではC:\Program Files(x86)\Steam\steamapps\common\OnimushaWotS\CrashReportに生成されます。`,
    description:
      '発生日時に最も近いzipを残し、DxDiagや再現手順と合わせて公式サポートへ伝えます。',
    symptoms: [
      { label: '保存場所を開く', target: 'open' },
      { label: '対象zipを選ぶ', target: 'choose' },
      { label: '報告情報をそろえる', target: 'report' },
    ],
    steps: [
      {
        id: 'open',
        title: 'CrashReportフォルダを開く',
        summary: 'Steamライブラリのインストール先から開きます。',
        actions: [
          'Steamでローカルファイルを表示する',
          'OnimushaWotSフォルダを開く',
          'CrashReportフォルダを確認する',
        ],
      },
      {
        id: 'choose',
        title: '発生日時に近いzipを残す',
        summary: 'クラッシュ時刻とファイル名を照合します。',
        actions: [
          'クラッシュした時刻を確認する',
          '最も近い日時のzipをコピーする',
          '元ファイルは削除しない',
        ],
      },
      {
        id: 'report',
        title: 'DxDiagと再現手順を用意する',
        summary: '公式サポートが調査しやすい情報をそろえます。',
        actions: [
          'Windows＋Rでdxdiagを開く',
          '情報をすべて保存する',
          '発生場所と操作、再現頻度をメモする',
        ],
      },
    ],
    faqs: [
      {
        question: 'CrashReportが見つからない場合は？',
        answer:
          'クラッシュによっては生成されません。ゲームのインストール先と、クラッシュツールに表示された保存先を確認してください。',
      },
    ],
    related: ['not-launching'],
    seoTitle: '鬼武者 Way of the SwordのCrashReport保存場所【PC版】',
    metaDescription:
      '鬼武者 Way of the Swordのクラッシュレポート保存場所、対象zipの選び方、DxDiagと再現手順の用意を公式案内に沿って解説します。',
  },
];
