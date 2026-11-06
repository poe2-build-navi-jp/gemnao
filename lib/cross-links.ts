import type { GameArticle } from '@/lib/game-articles';

// Links between the game troubleshooting articles and the Windows (/pc)
// guides, so a reader whose problem turns out to be Windows-wide (or the
// other way round) lands on the right page. Only link where the symptom
// genuinely overlaps; every href here must exist.

export type CrossLink = { href: string; label: string };

const pc = {
  wifi: {
    href: '/pc/wifi-connected-no-internet',
    label: 'Wi-Fiは接続済みなのにインターネットが使えない',
  },
  wifiMissing: {
    href: '/pc/wifi-option-missing',
    label: 'Wi-Fiの項目が消えた',
  },
  audio: {
    href: '/pc/audio-after-update',
    label: 'Windowsの更新後に音が出ない',
  },
  bluetoothAudio: {
    href: '/pc/bluetooth-connected-no-sound',
    label: 'Bluetoothは接続済みなのに音が出ない',
  },
  mic: {
    href: '/pc/microphone-after-update',
    label: '更新後にマイクが反応しない',
  },
  callAudio: {
    href: '/pc/call-starts-audio-disappears',
    label: '通話を始めるとゲームの音が小さくなる',
  },
  usbC: {
    href: '/pc/usb-c-device-not-recognized',
    label: 'USB機器が認識されない',
  },
  monitor: {
    href: '/pc/second-monitor-not-detected',
    label: '2台目のモニターが認識されない',
  },
  refresh: {
    href: '/pc/refresh-rate-stuck-60hz',
    label: 'モニターが144Hzにならない・60Hzのまま',
  },
  signInBlack: {
    href: '/pc/black-screen-after-sign-in',
    label: 'サインイン後に画面が真っ黒',
  },
  update: {
    href: '/pc/windows-update-0x800f081f',
    label: 'Windows Updateが0x800f081fで失敗する',
  },
} satisfies Record<string, CrossLink>;

const text = (article: GameArticle) =>
  [article.title, article.symptom, article.shortTitle].join(' ');

/** Windows guides worth checking from a game article. */
export function pcLinksForGameArticle(article: GameArticle): CrossLink[] {
  if (
    (article.gameSlug === 'valorant' &&
      ['van9003', 'van9001'].includes(article.slug)) ||
    (article.gameSlug === 'battlefield-6' &&
      article.slug === 'secure-boot-enabled-not-launching') ||
    (article.gameSlug === 'call-of-duty-modern-warfare-4' &&
      article.slug === 'tpm-secure-boot')
  ) {
    return [
      {
        href: '/guide/tpm-secure-boot',
        label: 'TPM・セキュアブートの状態と変更前の確認',
      },
    ];
  }
  const t = text(article);
  const links: CrossLink[] = [];
  const windowsUpdate = /Windows.*(?:更新|アップデート)|(?:更新|アップデート).*Windows/i.test(t);
  // Match the actual Windows symptom; a game-only error is not evidence of a
  // missing monitor, Windows Update failure, or Bluetooth problem.
  if (/Wi-Fi|インターネット|ほかの通信|他の通信/.test(t)) links.push(pc.wifi);
  if (windowsUpdate && /音|サウンド/.test(t)) links.push(pc.audio);
  if (/Bluetooth|ブルートゥース/.test(t) && /音|サウンド/.test(t)) links.push(pc.bluetoothAudio);
  if (windowsUpdate && /マイク/.test(t)) links.push(pc.mic);
  if (/通話.*(?:音|小さ)|ボイスチャット.*(?:音|小さ)/.test(t)) links.push(pc.callAudio);
  if (/USB|USB-C/.test(t) && /認識|接続/.test(t)) links.push(pc.usbC);
  if (/144Hz|60Hz|リフレッシュレート/.test(t)) links.push(pc.refresh);
  if (/モニター|ディスプレイ/.test(t) && /2台|二台|2枚|二枚|セカンド|認識され/.test(t)) links.push(pc.monitor);
  if (/サインイン後/.test(t) && /黒|真っ暗/.test(t)) links.push(pc.signInBlack);
  if (/0x800f081f/i.test(t)) links.push(pc.update);
  const seen = new Set<string>();
  return links.filter((l) => !seen.has(l.href) && seen.add(l.href)).slice(0, 3);
}

/** Game-side pages worth checking from a Windows guide. */
const gameLinksByPcSlug: Record<string, CrossLink[]> = {
  'wifi-connected-no-internet': [
    {
      href: '/games/apex-legends/code-net-leaf',
      label: 'Apexのcode:net・code:leafと接続比較',
    },
    {
      href: '/trouble/server',
      label: 'ゲームのサーバーに接続できない時の対処法',
    },
    { href: '/games/aion2/login-error', label: 'AION2にログインできない' },
  ],
  'wifi-option-missing': [
    {
      href: '/trouble/server',
      label: 'ゲームのサーバーに接続できない時の対処法',
    },
  ],
  'audio-after-update': [
    { href: '/guide/no-game-audio', label: 'PCゲームだけ音が出ない時の直し方' },
  ],
  'bluetooth-connected-no-sound': [
    { href: '/guide/no-game-audio', label: 'PCゲームだけ音が出ない時の直し方' },
  ],
  'call-starts-audio-disappears': [
    { href: '/guide/no-game-audio', label: 'PCゲームだけ音が出ない時の直し方' },
    { href: '/discord', label: 'Discordのトラブル一覧' },
  ],
  'microphone-after-update': [
    { href: '/discord', label: 'Discordのトラブル一覧' },
  ],
  'usb-c-device-not-recognized': [
    {
      href: '/guide/steam-input-controller',
      label: 'Steamでコントローラーが反応しない時の設定',
    },
    {
      href: '/guide/controller-double-input',
      label: 'コントローラーが二重入力になる',
    },
  ],
  'second-monitor-not-detected': [
    { href: '/pc/refresh-rate-stuck-60hz', label: 'モニターが144Hzにならない' },
    { href: '/guide/black-screen', label: 'ゲームが黒画面になる時の直し方' },
  ],
  'black-screen-after-sign-in': [
    { href: '/guide/black-screen', label: 'ゲームが黒画面になる時の直し方' },
    { href: '/guide/gpu-driver-update', label: 'GPUドライバーの更新方法' },
  ],
  'windows-update-0x800f081f': [],
  'sleep-wakes-up-by-itself': [],
  'file-explorer-freezes-on-right-click': [],
  'refresh-rate-stuck-60hz': [
    { href: '/guide/stutter-fix', label: 'ゲームがカクつく・一瞬止まる' },
    { href: '/guide/low-fps', label: 'ゲームのFPSが低い' },
    {
      href: '/new-releases/2026-10',
      label: '10月の新作PCゲーム 動作環境まとめ',
    },
  ],
};

export function gameLinksForPcArticle(slug: string): CrossLink[] {
  return gameLinksByPcSlug[slug] ?? [];
}
