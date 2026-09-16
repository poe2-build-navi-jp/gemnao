export type DiscordServer = {
  slug: string;
  name: string;
  game: string;
  gameSlug: string;
  purposes: string[];
  styles: string[];
  voiceChat: 'required' | 'optional' | 'listen-only-ok' | 'none';
  activeTimes: string[];
  description: string;
  lastVerifiedAt: string;
  inviteStatus: 'valid' | 'invalid';
  status: 'active' | 'expired';
};

export const discordServerGames = [
  'VALORANT',
  'Apex Legends',
  'Path of Exile 2',
  'モンスターハンターワイルズ',
  'Minecraft',
  'FF14',
  'その他のPCゲーム',
] as const;

export const recruitmentPurposes = [
  'フレンド募集',
  '協力プレイ',
  '固定パーティ',
  'ランク',
  '初心者募集',
  'クラン・チーム',
  'レイド・高難度',
  '練習',
  'イベント',
  '雑談',
] as const;

export const playStyles = [
  'エンジョイ',
  'ガチ',
  '初心者歓迎',
  '復帰勢歓迎',
  '社会人中心',
  '聞き専OK',
] as const;

export const activeTimes = ['朝', '昼', '夜', '深夜', '平日', '土日'] as const;

// 審査・活動確認・招待URL確認を通過した掲載だけを追加する。
// 確認できないサーバーを、SEO目的で架空掲載してはならない。
export const discordServers: DiscordServer[] = [];
