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
const wardogs = gameBySlug('wardogs')!;
export const newReleaseArticles: GameArticle[] = [
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
