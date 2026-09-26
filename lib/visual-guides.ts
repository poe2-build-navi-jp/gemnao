import { commonGuideBySlug } from '@/lib/common-guides';

export type GuideVisual = {
  key: string;
  page: string;
  title: string;
  alt: string;
  caption: string;
  steps: string[];
  image: string;
  ogImage: string;
};

const specs = [
  ['steam-game-not-launching', 'pc-game-not-launching-fix-flow', 'PCゲームが起動しない時の確認順'],
  ['pc-game-crash', 'pc-game-crash-fix-flow', 'PCゲームがクラッシュする時の確認順'],
  ['low-fps', 'pc-game-low-fps-checklist', 'FPSが低い時の確認順'],
  ['steam-cloud-sync-error', 'steam-cloud-sync-error-fix', 'Steam Cloudが同期できない時の確認順'],
  ['steam-disk-write-error', 'steam-disk-write-error-fix', 'Steamのディスク書き込みエラー確認順'],
  ['pc-shuts-down-while-gaming', 'gaming-pc-restart-shutdown-checklist', 'ゲーム中にPCの電源が落ちる時の確認順'],
  ['bsod-while-gaming', 'gaming-blue-screen-fix-flow', 'ゲーム中にブルースクリーンが出る時の確認順'],
  ['save-data-backup', 'pc-game-save-backup-guide', 'PCゲームのセーブデータを守る確認順'],
  ['steam-input-controller', 'steam-input-controller-fix-flow', 'コントローラーが反応しない時の確認順'],
] as const;

const guideVisuals = specs.map(([key, filename, title]) => {
  const guide = commonGuideBySlug(key);
  if (!guide || guide.status !== 'verified') throw new Error(`Missing verified visual guide: ${key}`);
  return {
    key,
    page: `/guide/${key}`,
    title,
    alt: `${title}を示すゲムなおの図解`,
    caption: `「${guide.shortTitle}」の記事のSTEP順です。詳しい操作と注意事項は本文を確認してください。`,
    steps: guide.steps.map((step) => step.title),
    image: `/images/${filename}.webp`,
    ogImage: `/images/${filename}-og.png`,
  } satisfies GuideVisual;
});

const discordVisual: GuideVisual = {
  key: 'discord',
  page: '/discord',
  title: 'Discordトラブル症状早見表',
  alt: 'Discordの音声・接続・画面共有・起動トラブルを症状から探す早見表',
  caption: '症状に合わせて下の各記事へ進んでください。障害中は公式のDiscord Statusを確認します。',
  steps: [
    '相手の声が聞こえない',
    '自分の声が届かない',
    'RTC接続中で止まる',
    '画面共有が黒い',
    '配信の音が出ない',
    'Discordが起動しない',
  ],
  image: '/images/discord-troubleshooting-chart.webp',
  ogImage: '/images/discord-troubleshooting-chart-og.png',
};

export const visualGuides: GuideVisual[] = [...guideVisuals, discordVisual];
export const guideVisualBySlug = (slug: string) => guideVisuals.find((item) => item.key === slug);
export const discordHubVisual = discordVisual;
export const troubleVisualBySlug = (slug: string) =>
  ({
    'not-launching': guideVisualBySlug('steam-game-not-launching'),
    crash: guideVisualBySlug('pc-game-crash'),
    fps: guideVisualBySlug('low-fps'),
    save: guideVisualBySlug('save-data-backup'),
    controller: guideVisualBySlug('steam-input-controller'),
  })[slug as 'not-launching' | 'crash' | 'fps' | 'save' | 'controller'];
