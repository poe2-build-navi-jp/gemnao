// Language-neutral facts for the translated game pages (/en, /zh, /es).
// Names, requirements and language support were read from each game's Steam
// store data (appdetails, English / Simplified Chinese / Spanish) on
// 2026-10-01. Re-check the store before editing; do not add estimates.

export type Spec = {
  os: string;
  cpu: string;
  gpu: string;
  ram: string;
  storage: string;
  /** Storage type note from the store listing. */
  ssd?: 'required' | 'recommended' | 'preferred';
};

/** Language support on Steam: ui = interface/subtitles, audio = full audio. */
export type LangSupport = { ui: boolean; audio: boolean };

export type GameFacts = {
  appId: string;
  /** Official store name per locale (Steam). */
  names: { en: string; zh: string; es: string };
  minimum: Spec;
  recommended?: Spec;
  languages: {
    ja: LangSupport;
    en: LangSupport;
    zh: LangSupport;
    es: LangSupport;
  };
  checkedAt: string;
};

const both = { ui: true, audio: true };
const text = { ui: true, audio: false };
const none = { ui: false, audio: false };

export const gameFacts: Record<string, GameFacts> = {
  // Steam appdetails (English), rechecked 2026-10-03. Only the English hub
  // is published; language-support facts do not imply translated site pages.
  'onimusha-way-of-the-sword': {
    appId: '2638890',
    names: {
      en: 'Onimusha: Way of the Sword',
      zh: 'Onimusha: Way of the Sword',
      es: 'Onimusha: Way of the Sword',
    },
    minimum: {
      os: 'Windows 11 (64-bit)',
      cpu: 'Core i5-8400 / Ryzen 3 3100',
      gpu: 'GeForce GTX 1660 (6 GB) / Radeon RX 5500 XT (8 GB)',
      ram: '16 GB',
      storage: '50 GB',
      ssd: 'required',
    },
    recommended: {
      os: 'Windows 11 (64-bit)',
      cpu: 'Core i5-10400 / Ryzen 5 3600',
      gpu: 'GeForce RTX 2060 SUPER (8 GB) / Radeon RX 6600 (8 GB)',
      ram: '16 GB',
      storage: '50 GB',
      ssd: 'required',
    },
    languages: { ja: both, en: both, zh: both, es: both },
    checkedAt: '2026-10-03',
  },
  'monster-hunter-wilds': {
    appId: '2246340',
    names: {
      en: 'Monster Hunter Wilds',
      zh: 'Monster Hunter Wilds（怪物猎人 荒野）',
      es: 'Monster Hunter Wilds',
    },
    minimum: {
      os: 'Windows 10 / 11 (64-bit)',
      cpu: 'Core i5-10400 / Core i3-12100 / Ryzen 5 3600',
      gpu: 'GeForce GTX 1660 (6 GB) / Radeon RX 5500 XT (8 GB)',
      ram: '16 GB',
      storage: '75 GB',
      ssd: 'required',
    },
    recommended: {
      os: 'Windows 10 / 11 (64-bit)',
      cpu: 'Core i5-10400 / Core i3-12100 / Ryzen 5 3600',
      gpu: 'GeForce RTX 2060 SUPER (8 GB) / Radeon RX 6600 (8 GB)',
      ram: '16 GB',
      storage: '75 GB',
      ssd: 'required',
    },
    languages: { ja: both, en: both, zh: both, es: both },
    checkedAt: '2026-10-01',
  },
  palworld: {
    appId: '1623730',
    names: { en: 'Palworld', zh: 'Palworld / 幻兽帕鲁', es: 'Palworld' },
    minimum: {
      os: 'Windows 10 (64-bit)',
      cpu: 'Core i5-9400F',
      gpu: 'GeForce GTX 1660',
      ram: '16 GB',
      storage: '40 GB',
      ssd: 'required',
    },
    recommended: {
      os: 'Windows 11 (64-bit)',
      cpu: 'Core i5-12400 / Ryzen 5 5600X',
      gpu: 'GeForce RTX 3060 Ti / Radeon RX 6700 XT',
      ram: '32 GB',
      storage: '40 GB',
      ssd: 'required',
    },
    languages: { ja: text, en: text, zh: text, es: text },
    checkedAt: '2026-10-01',
  },
  'elden-ring': {
    appId: '1245620',
    names: {
      en: 'ELDEN RING',
      zh: '艾尔登法环（ELDEN RING）',
      es: 'ELDEN RING',
    },
    minimum: {
      os: 'Windows 10',
      cpu: 'Core i5-8400 / Ryzen 3 3300X',
      gpu: 'GeForce GTX 1060 (3 GB) / Radeon RX 580 (4 GB)',
      ram: '12 GB',
      storage: '60 GB',
    },
    recommended: {
      os: 'Windows 10 / 11',
      cpu: 'Core i7-8700K / Ryzen 5 3600X',
      gpu: 'GeForce GTX 1070 (8 GB) / Radeon RX Vega 56 (8 GB)',
      ram: '16 GB',
      storage: '60 GB',
    },
    languages: { ja: text, en: both, zh: text, es: text },
    checkedAt: '2026-10-01',
  },
  'cyberpunk-2077': {
    appId: '1091500',
    names: { en: 'Cyberpunk 2077', zh: '赛博朋克 2077', es: 'Cyberpunk 2077' },
    minimum: {
      os: 'Windows 10 (64-bit)',
      cpu: 'Core i7-6700 / Ryzen 5 1600',
      gpu: 'GeForce GTX 1060 6 GB / Radeon RX 580 8 GB / Arc A380',
      ram: '12 GB',
      storage: '70 GB',
      ssd: 'required',
    },
    recommended: {
      os: 'Windows 10 (64-bit)',
      cpu: 'Core i7-12700 / Ryzen 7 7800X3D',
      gpu: 'GeForce RTX 2060 SUPER / Radeon RX 5700 XT / Arc A770',
      ram: '16 GB',
      storage: '70 GB',
      ssd: 'required',
    },
    languages: { ja: both, en: both, zh: both, es: both },
    checkedAt: '2026-10-01',
  },
  'baldurs-gate-3': {
    appId: '1086940',
    names: { en: "Baldur's Gate 3", zh: '博德之门3', es: "Baldur's Gate 3" },
    minimum: {
      os: 'Windows 10 (64-bit)',
      cpu: 'Core i5-4690 / FX 8350',
      gpu: 'GeForce GTX 970 / Radeon RX 480 / Arc A380 (4 GB+ VRAM)',
      ram: '8 GB',
      storage: '150 GB',
      ssd: 'required',
    },
    recommended: {
      os: 'Windows 10 (64-bit)',
      cpu: 'Core i7-8700K / Ryzen 5 3600',
      gpu: 'GeForce RTX 2060 SUPER / Radeon RX 5700 XT / Arc A580 (8 GB+ VRAM)',
      ram: '16 GB',
      storage: '150 GB',
      ssd: 'required',
    },
    languages: { ja: text, en: both, zh: text, es: text },
    checkedAt: '2026-10-01',
  },
  'helldivers-2': {
    appId: '553850',
    names: {
      en: 'HELLDIVERS 2',
      zh: 'HELLDIVERS 绝地潜兵2',
      es: 'HELLDIVERS 2',
    },
    minimum: {
      os: 'Windows 10',
      cpu: 'Core i7-4790K / Ryzen 5 1500X',
      gpu: 'GeForce GTX 1050 Ti / Radeon RX 470',
      ram: '8 GB',
      storage: '135 GB',
    },
    recommended: {
      os: 'Windows 10',
      cpu: 'Core i7-9700K / Ryzen 7 3700X',
      gpu: 'GeForce RTX 2060 / Radeon RX 6600 XT',
      ram: '16 GB',
      // The store's recommended listing shows 40 GB, which contradicts the
      // 135 GB minimum, so it is not repeated here.
      storage: '—',
      ssd: 'recommended',
    },
    languages: { ja: both, en: both, zh: both, es: both },
    checkedAt: '2026-10-01',
  },
  'hogwarts-legacy': {
    appId: '990080',
    names: { en: 'Hogwarts Legacy', zh: '霍格沃茨之遗', es: 'Hogwarts Legacy' },
    minimum: {
      os: 'Windows 10 (64-bit)',
      cpu: 'Core i5-6600 / Ryzen 5 1400',
      gpu: 'GeForce GTX 960 4 GB / Radeon RX 470 4 GB',
      ram: '16 GB',
      storage: '85 GB',
      ssd: 'preferred',
    },
    recommended: {
      os: 'Windows 10 (64-bit)',
      cpu: 'Core i7-8700 / Ryzen 5 3600',
      gpu: 'GeForce GTX 1080 Ti / Radeon RX 5700 XT / Arc A770',
      ram: '16 GB',
      storage: '85 GB',
      ssd: 'recommended',
    },
    languages: { ja: both, en: both, zh: text, es: both },
    checkedAt: '2026-10-01',
  },
  'gta-v-enhanced': {
    appId: '3240220',
    names: {
      en: 'Grand Theft Auto V Enhanced',
      zh: 'Grand Theft Auto V 增强版',
      es: 'Grand Theft Auto V Enhanced',
    },
    minimum: {
      os: 'Windows 10',
      cpu: 'Core i7-4770 / FX-9590',
      gpu: 'GeForce GTX 1630 (4 GB) / Radeon RX 6400 (4 GB)',
      ram: '8 GB',
      storage: '105 GB',
      ssd: 'required',
    },
    recommended: {
      os: 'Windows 11',
      cpu: 'Core i5-9600K / Ryzen 5 3600',
      gpu: 'GeForce RTX 3060 (8 GB) / Radeon RX 6600 XT (8 GB)',
      ram: '16 GB',
      storage: '105 GB',
      ssd: 'required',
    },
    languages: { ja: text, en: both, zh: text, es: text },
    checkedAt: '2026-10-01',
  },
  'skyrim-special-edition': {
    appId: '489830',
    names: {
      en: 'The Elder Scrolls V: Skyrim Special Edition',
      zh: 'The Elder Scrolls V: Skyrim Special Edition（上古卷轴5 特别版）',
      es: 'The Elder Scrolls V: Skyrim Special Edition',
    },
    minimum: {
      os: 'Windows 7 / 8.1 / 10 (64-bit)',
      cpu: 'Core i5-750 / Phenom II X4-945',
      gpu: 'GeForce GTX 470 1 GB / Radeon HD 7870 2 GB',
      ram: '8 GB',
      storage: '12 GB',
    },
    recommended: {
      os: 'Windows 7 / 8.1 / 10 (64-bit)',
      cpu: 'Core i5-2400 / FX-8320',
      gpu: 'GeForce GTX 780 3 GB / Radeon R9 290 4 GB',
      ram: '8 GB',
      storage: '12 GB',
    },
    languages: { ja: both, en: both, zh: none, es: both },
    checkedAt: '2026-10-01',
  },
  'stardew-valley': {
    appId: '413150',
    names: {
      en: 'Stardew Valley',
      zh: 'Stardew Valley（星露谷物语）',
      es: 'Stardew Valley',
    },
    minimum: {
      os: 'Windows Vista or later',
      cpu: '2 GHz',
      gpu: '256 MB VRAM, Shader Model 3.0+',
      ram: '2 GB',
      storage: '500 MB',
    },
    languages: { ja: text, en: text, zh: text, es: text },
    checkedAt: '2026-10-01',
  },
};
