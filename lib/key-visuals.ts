// Keyboard diagrams for keyboard-shortcut guides. Each image is an original
// drawing (no screenshots or vendor marks) rendered by
// scripts/render-key-visuals.py; run `pnpm visuals:keys` after editing.
// Images are listed in image-sitemap.xml by scripts/prepare-pages.mjs.

/** Key ids understood by the renderer (left-hand modifier keys). */
export type KeyId =
  | 'Win'
  | 'Ctrl'
  | 'Shift'
  | 'Alt'
  | 'Esc'
  | 'Tab'
  | 'Enter'
  | 'F12'
  | 'B'
  | 'G'
  | 'P'
  | 'R';

export type KeyVisual = {
  /** Page the image is embedded in. */
  page: string;
  /** STEP number (1-based) the image belongs to; omitted for the summary. */
  step?: number;
  image: string;
  width: number;
  height: number;
  title: string;
  /** Key combinations; each inner array is pressed together. */
  combos: KeyId[][];
  alt: string;
  caption: string;
};

export type KeyCheatSheet = {
  page: string;
  image: string;
  width: number;
  height: number;
  title: string;
  rows: { scene: string; combos: KeyId[][] }[];
  alt: string;
  caption: string;
};

const page = '/pc/gaming-shortcut-keys';

export const keyCheatSheets: KeyCheatSheet[] = [
  {
    page,
    image: '/images/pc-gaming-shortcut-keys-cheatsheet.webp',
    width: 1080,
    height: 1350,
    title: 'ゲーム中に困った時のショートカットキー',
    rows: [
      {
        scene: '画面が固まった・真っ黒',
        combos: [['Win', 'Ctrl', 'Shift', 'B']],
      },
      { scene: 'ゲームが応答しない', combos: [['Ctrl', 'Shift', 'Esc']] },
      { scene: 'フルスクリーン⇔ウィンドウ', combos: [['Alt', 'Enter']] },
      { scene: 'HDRのオン・オフ', combos: [['Win', 'Alt', 'B']] },
      { scene: 'Steamでスクリーンショット', combos: [['F12']] },
      { scene: 'セーブのフォルダを開く', combos: [['Win', 'R']] },
    ],
    alt: 'ゲーム中に困った時のショートカットキー早見表。画面が固まった時はWindows＋Ctrl＋Shift＋B、応答しない時はCtrl＋Shift＋Esc、表示の切り替えはAlt＋Enter、HDRはWindows＋Alt＋B、SteamのスクリーンショットはF12、フォルダを開くのはWindows＋R',
    caption:
      '場面ごとのショートカットキーの早見表です。保存してゲーム中に見返せます。',
  },
];

export const keyVisuals: KeyVisual[] = [
  {
    page,
    step: 1,
    image: '/images/pc-shortcut-win-ctrl-shift-b.webp',
    width: 1200,
    height: 675,
    title: 'グラフィックスドライバーをリセット',
    combos: [['Win', 'Ctrl', 'Shift', 'B']],
    alt: 'Windowsキー＋Ctrl＋Shift＋Bのキーの位置を示したキーボードの図。左下のCtrl・Windows・Shiftと、中央下段のBを同時に押す',
    caption: '左手でCtrl・Windowsキー・Shiftを押さえたまま、Bを押します。',
  },
  {
    page,
    step: 2,
    image: '/images/pc-shortcut-ctrl-shift-esc.webp',
    width: 1200,
    height: 675,
    title: 'タスクマネージャーを開く',
    combos: [['Ctrl', 'Shift', 'Esc']],
    alt: 'Ctrl＋Shift＋Escのキーの位置を示したキーボードの図。左下のCtrlとShiftを押したまま、左上のEscを押す',
    caption: 'CtrlとShiftを押さえたまま、左上のEscを押します。',
  },
  {
    page,
    step: 3,
    image: '/images/pc-shortcut-alt-enter.webp',
    width: 1200,
    height: 675,
    title: 'フルスクリーンとウィンドウを切り替える',
    combos: [['Alt', 'Enter']],
    alt: 'Alt＋Enterのキーの位置を示したキーボードの図。スペースキー左のAltを押したまま、右側のEnterを押す',
    caption:
      'スペースキーの左のAltを押さえたまま、Enterを押します。ゲームによっては効きません。',
  },
  {
    page,
    step: 4,
    image: '/images/pc-shortcut-win-alt-b.webp',
    width: 1200,
    height: 675,
    title: 'HDRのオン・オフを切り替える',
    combos: [['Win', 'Alt', 'B']],
    alt: 'Windowsキー＋Alt＋Bのキーの位置を示したキーボードの図。左下のWindowsキーとAltを押したまま、Bを押す',
    caption: 'WindowsキーとAltを押さえたまま、Bを押します。',
  },
  {
    page,
    step: 5,
    image: '/images/pc-shortcut-f12-win-r.webp',
    width: 1200,
    height: 675,
    title: 'スクリーンショットとフォルダを開くキー',
    combos: [['F12'], ['Win', 'R']],
    alt: 'F12とWindowsキー＋Rのキーの位置を示したキーボードの図。右上のF12でSteamのスクリーンショット、Windowsキー＋Rで「ファイル名を指定して実行」',
    caption:
      'F12はSteamのスクリーンショット（既定のキー）。Windowsキー＋Rで「ファイル名を指定して実行」を開きます。',
  },
];

export const keyCheatSheetFor = (path: string) =>
  keyCheatSheets.find((sheet) => sheet.page === path);

export const keyVisualFor = (path: string, step: number) =>
  keyVisuals.find((visual) => visual.page === path && visual.step === step);

/** Every keyboard diagram embedded in `path`, for JSON-LD and the image sitemap. */
export const keyImagesFor = (path: string) => [
  ...keyCheatSheets
    .filter((item) => item.page === path)
    .map((item) => item.image),
  ...keyVisuals.filter((item) => item.page === path).map((item) => item.image),
];
