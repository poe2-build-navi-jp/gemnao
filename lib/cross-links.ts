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
  const t = text(article);
  const links: CrossLink[] = [];
  if (article.category === 'server' || /接続|ログイン|切断|オンライン/.test(t))
    links.push(pc.wifi);
  if (/音|サウンド|ボイス/.test(t)) links.push(pc.audio, pc.bluetoothAudio);
  if (/マイク|通話|ボイスチャット/.test(t)) links.push(pc.mic, pc.callAudio);
  if (article.category === 'controller' || /コントローラー/.test(t))
    links.push(pc.usbC);
  if (
    article.category === 'display' ||
    /fps|FPS|重い|カクつ|ウルトラワイド|モニター/.test(t)
  )
    links.push(pc.refresh);
  if (/黒画面|真っ黒/.test(t)) links.push(pc.monitor);
  if (/Windows 11|TPM|セキュアブート/.test(t)) links.push(pc.update);
  const seen = new Set<string>();
  return links.filter((l) => !seen.has(l.href) && seen.add(l.href)).slice(0, 3);
}

/** Game-side pages worth checking from a Windows guide. */
const gameLinksByPcSlug: Record<string, CrossLink[]> = {
  'wifi-connected-no-internet': [
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
  'windows-update-0x800f081f': [
    {
      href: '/guide/windows-11-required',
      label: 'Windows 11が必要なゲームの確認方法',
    },
    {
      href: '/guide/tpm-secure-boot',
      label: 'TPM 2.0・セキュアブートの有効化',
    },
  ],
  'sleep-wakes-up-by-itself': [
    {
      href: '/guide/pc-shuts-down-while-gaming',
      label: 'ゲーム中にPCの電源が落ちる',
    },
  ],
  'file-explorer-freezes-on-right-click': [
    { href: '/guide/pc-game-freezes', label: 'ゲーム中にPCが固まる' },
  ],
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
