import type { CommonGuide } from '@/lib/common-guides';
import type { GameArticle } from '@/lib/game-articles';

export type TroubleHub = {
  slug: string;
  label: string;
  title: string;
  description: string;
  quickChecks: string[];
  guideSlugs: string[];
  relatedSlugs: string[];
};

export const troubleHubs: TroubleHub[] = [
  {
    slug: 'not-launching',
    label: '起動しない',
    title: 'PCゲームが起動しない時の対処法',
    description:
      'ゲームが無反応、起動直後に終了、ランチャーから進まない時に、共通手順とゲーム固有の対処法を探せます。',
    quickChecks: [
      'PCとランチャーを完全に再起動する',
      'ゲームファイルの整合性・修復を1回だけ実行する',
      'MOD、オーバーレイ、外部DLLを一時的に外す',
    ],
    guideSlugs: [
      'steam-game-not-launching',
      'verify-steam-files',
      'directx-error',
      'visual-c-runtime-error',
    ],
    relatedSlugs: ['crash', 'fps', 'mod'],
  },
  {
    slug: 'crash',
    label: 'クラッシュ',
    title: 'PCゲームがクラッシュ・強制終了する時の対処法',
    description:
      '起動直後やプレイ中にデスクトップへ戻る、フリーズして応答しない時の切り分け先をまとめています。',
    quickChecks: [
      '発生場面とエラー表示を記録する',
      'MOD・オーバーレイ・録画ツールを外す',
      '整合性確認とGPUドライバーを確認する',
    ],
    guideSlugs: [
      'pc-game-crash',
      'pc-game-freezes',
      'gpu-driver-update',
      'vram-shortage',
    ],
    relatedSlugs: ['not-launching', 'fps', 'mod'],
  },
  {
    slug: 'fps',
    label: 'FPS・カクつき',
    title: 'PCゲームのFPS低下・カクつき・表示問題を直す',
    description:
      'FPSが低い、一瞬止まる、VRAM不足や描画設定が原因と思われる時のゲーム別・共通対処を探せます。',
    quickChecks: [
      '解像度とアップスケーラーを確認する',
      'FPS上限、レイトレーシング、影を1項目ずつ比較する',
      'VRAM使用量とシェーダー構築状況を確認する',
    ],
    guideSlugs: ['low-fps', 'stutter-fix', 'vram-shortage', 'low-gpu-usage'],
    relatedSlugs: ['crash', 'controller', 'not-launching'],
  },
  {
    slug: 'save',
    label: 'セーブ',
    title: 'PCゲームのセーブ場所・バックアップを探す',
    description:
      'セーブデータの保存場所、バックアップ、進行が保存されない問題をゲーム別に確認できます。',
    quickChecks: [
      'ゲームとランチャーを終了してから操作する',
      'フォルダを削除せず、別ドライブへ丸ごとコピーする',
      'クラウド同期が完了しているか確認する',
    ],
    guideSlugs: ['save-data-backup', 'uninstall-save-data'],
    relatedSlugs: ['mod', 'not-launching'],
  },
  {
    slug: 'mod',
    label: 'MOD',
    title: 'PCゲームのMOD不具合を安全に切り分ける',
    description:
      'MOD導入後やゲーム更新後に起動しない、クラッシュする時に、安全に元へ戻す方法を探せます。',
    quickChecks: [
      'セーブと導入ファイルの記録を残す',
      'MODを削除せずゲームフォルダ外へ退避する',
      '本体だけの状態で整合性確認と起動を試す',
    ],
    guideSlugs: ['remove-mods-safely', 'reshade-uninstall', 'save-data-backup'],
    relatedSlugs: ['not-launching', 'crash', 'save'],
  },
  {
    slug: 'controller',
    label: 'コントローラー',
    title: 'PCゲームのコントローラー不具合を直す',
    description:
      'コントローラーが反応しない、二重入力、表示やボタン設定がおかしい時の対処法を探せます。',
    quickChecks: [
      '入力機器を有線1台だけにする',
      'Steam InputをON・OFFで比較する',
      'DS4Windowsなどの入力変換を同時使用しない',
    ],
    guideSlugs: ['steam-input-controller', 'controller-double-input'],
    relatedSlugs: ['fps', 'not-launching'],
  },
  {
    slug: 'server',
    label: 'サーバー・接続',
    title: 'PCゲームのサーバー接続・ログイン問題を確認する',
    description:
      'サーバーへ接続できない、ログイン待ち、専用サーバー設定で困った時のゲーム固有記事を探せます。',
    quickChecks: [
      '公式のお知らせでメンテナンス・障害を確認する',
      'ゲームとランチャーを終了して再認証する',
      'VPNや通信経路を変える前に別回線で比較する',
    ],
    guideSlugs: ['steam-game-not-launching'],
    relatedSlugs: ['not-launching', 'crash'],
  },
];

export const troubleHubBySlug = (slug: string) =>
  troubleHubs.find((hub) => hub.slug === slug);

function searchableArticle(article: GameArticle) {
  return [
    article.title,
    article.shortTitle,
    article.symptom,
    article.description,
    article.metaDescription,
  ].join(' ');
}

export function articleMatchesTrouble(article: GameArticle, slug: string) {
  const text = searchableArticle(article);
  if (slug === 'not-launching') return article.category === 'launch';
  if (slug === 'crash')
    return (
      article.category === 'launch' &&
      /クラッシュ|強制終了|落ちる|フリーズ|CrashReport/i.test(text)
    );
  if (slug === 'fps')
    return (
      article.category === 'display' ||
      article.category === 'settings' ||
      /FPS|カクつ|スタッター|重い|VRAM|ビデオメモリ/i.test(text)
    );
  if (slug === 'save') return article.category === 'save';
  if (slug === 'mod') return article.category === 'mods';
  if (slug === 'controller') return article.category === 'controller';
  if (slug === 'server') return article.category === 'server';
  return false;
}

export function troubleHubForArticle(article: GameArticle) {
  const preferred =
    article.category === 'launch'
      ? /not-launching/i.test(article.slug)
        ? 'not-launching'
        : /クラッシュ|強制終了|落ちる|フリーズ|CrashReport/i.test(
          searchableArticle(article),
        )
          ? 'crash'
          : 'not-launching'
      : article.category === 'display' || article.category === 'settings'
        ? 'fps'
        : article.category === 'mods'
          ? 'mod'
          : article.category;
  return troubleHubBySlug(preferred);
}

export function troubleHubForGuide(guide: CommonGuide) {
  const text = [guide.slug, guide.title, guide.description].join(' ');
  if (/controller|input/i.test(text)) return troubleHubBySlug('controller');
  if (/save|uninstall/i.test(text)) return troubleHubBySlug('save');
  if (/mod|reshade/i.test(text)) return troubleHubBySlug('mod');
  if (/fps|stutter|vram|gpu-usage|shader/i.test(text))
    return troubleHubBySlug('fps');
  if (/crash|freez/i.test(text)) return troubleHubBySlug('crash');
  return troubleHubBySlug('not-launching');
}
