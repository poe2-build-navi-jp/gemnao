import type { GameArticle } from './game-articles';
export const verifiedReleaseArticles: GameArticle[] = [
  {
    gameSlug: 'star-wars-zero-company',
    slug: 'gtx10-rtx20-low-fps',
    category: 'display',
    title: 'ゼロ・カンパニーが重い｜GTX 10・RTX 20のFPS設定【PC版】',
    shortTitle: 'GTX 10・RTX 20で重い',
    symptom:
      'STAR WARS Zero Companyは起動するが、GTX 10・RTX 20シリーズでFPSが低い人向け。起動できない問題やセーブ消失とは分けて確認します。',
    conclusion:
      '最小要件を満たす対象GPUでは、EA公式が案内する「環境ジオメトリ詳細」をオフにし、同じ場面で比較してください。改善幅の実測値はまだありません。',
    description:
      '公式の推奨設定と、ゲムなおが提案する比較手順を区別して掲載します。設定を一度に変えると原因が分からなくなるため、変更前の値を残して1項目ずつ試します。',
    checkedAt: '2026-09-22',
    status: 'verified',
    targetVersion:
      'PC版／EA公式サポートを2026年9月22日に確認。全環境での解決保証ではありません。',
    causes: [
      '対象GPUでの環境ジオメトリ詳細の負荷',
      '解像度・画質設定に対して不足する描画性能',
    ],
    symptoms: [
      {
        label: 'GTX 10・RTX 20でFPSが低い',
        target: 'geometry-detail',
      },
    ],
    steps: [
      {
        id: 'geometry-detail',
        title: '環境ジオメトリ詳細をオフにする',
        summary: 'EA公式が対象GPU向けに案内している設定です。',
        actions: [
          'GPU名を確認し、GTX 10またはRTX 20シリーズか、公式の最小要件を満たすか確認する',
          'ゲームのオプションからグラフィックスを開く',
          '環境ジオメトリ詳細の変更前の値をメモし、オフにする',
          '同じセーブ・同じ場所・同じ解像度で再比較する',
        ],
      },
      {
        id: 'compare-quality',
        title: '解像度と画質を1項目ずつ比較する',
        summary: 'ここからは効果を切り分けるための編集部の確認手順です。',
        actions: [
          '同じ場所で一瞬だけ止まるのか、継続してFPSが低いのか記録する',
          'グラフィックスの品質設定を1項目下げ、同じ場所を歩いて比較する',
          '改善がなければ元の値に戻し、結果とGPU・ドライバー版を控える',
        ],
      },
    ],
    cautions: [
      'この設定は未達の最小要件を補うものではありません。',
      'DLSS中に落ちる症状は別問題です。EA公式のドライバー条件も確認してください。',
    ],
    faqs: [
      {
        question: 'この設定で何FPS上がりますか？',
        answer:
          'ゲムなお独自の比較測定はまだありません。固定の改善幅や全PCでの解決は断言できません。',
      },
      {
        question: '起動しない場合も同じ設定ですか？',
        answer:
          'ゲーム内設定を開けない場合は、起動しない記事の修復手順から確認してください。',
      },
    ],
    sources: [
      {
        label: 'EA公式：対象GPUの最適化・DLSSクラッシュ条件（2026-09-22確認）',
        url: 'https://help.ea.com/ja/articles/star-wars/zero-company/troubleshoot-common-issues/',
      },
    ],
    related: ['not-launching', 'black-screen'],
    seoTitle: 'ゼロ・カンパニーが重い｜GTX 10・RTX 20のFPS設定【PC版】',
    metaDescription:
      'STAR WARS Zero CompanyがGTX 10・RTX 20で重い時の設定。EA公式の環境ジオメトリ詳細と、同じ場面で効果を比較する手順を解説。実測値・解決報告と公式情報を区別します。',
  },
];
