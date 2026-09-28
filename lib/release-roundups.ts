// Monthly roundups of the PC requirements for new releases.
// Every value comes from the Steam store or the publisher's official site
// (checked on `checkedAt`); Japanese release dates follow the publisher or
// ファミ通.com's schedule. Do not fill gaps with guesses: use '記載なし'.

export type Fit = 'yes' | 'no' | 'partial' | 'unknown';

export type RoundupGame = {
  name: string;
  date: string;
  os: string;
  minGpu: string;
  memory: string;
  storage: string;
  /** Requirements that most often stop a PC from launching the game. */
  must: string[];
  /** Does a GeForce GTX 1660 (6GB) meet the minimum GPU? An editorial estimate. */
  gtx1660: Fit;
  gtx1660Note: string;
  /** Can Windows 10 be used according to the listed minimum OS? */
  win10: Fit;
  win10Note: string;
  article?: { href: string; label: string };
  source: string;
};

export type ReleaseRoundup = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  lead: string;
  checkedAt: string;
  games: RoundupGame[];
  faqs: { question: string; answer: string }[];
  sources: { label: string; url: string }[];
};

const steam = (id: string) => `https://store.steampowered.com/app/${id}/`;

export const releaseRoundups: ReleaseRoundup[] = [
  {
    slug: '2026-10',
    title:
      '2026年10月発売の新作PCゲーム 動作環境まとめ｜GTX 1660・Windows 10で遊べる？',
    shortTitle: '2026年10月の新作',
    description:
      '2026年10月に発売・サービス開始する新作PCゲーム10本の動作環境を1つの表に整理。レイトレーシング対応GPU、Windows 11、TPM 2.0など「起動できない」原因になる必須条件と、GTX 1660・Windows 10で遊べるかの目安をまとめました。',
    lead: '発売日に「起動しない」と困らないように、購入前に確認したい必須条件をまとめました。',
    checkedAt: '2026-09-28',
    games: [
      {
        name: '真・三國無双２ with 猛将伝 Remastered',
        date: '10月1日',
        os: 'Windows 11',
        minGpu: 'GTX 1060・RX 5600 XT・Arc A380（VRAM 6GB）',
        memory: '16GB',
        storage: '60GB',
        must: ['VRAM 6GB以上', 'Windows 11'],
        gtx1660: 'yes',
        gtx1660Note: 'VRAM 6GBで、最低環境のGTX 1060（6GB）と同等以上',
        win10: 'no',
        win10Note: '最低環境からWindows 11',
        article: {
          href: '/games/shin-sangoku-musou-2-remastered/not-launching',
          label: '起動しない・重い時の対処法',
        },
        source: steam('3841510'),
      },
      {
        name: 'エースコンバット8 ウイングス・オブ・シーヴ',
        date: '10月2日（アーリーアクセス9月29日）',
        os: 'Windows 11',
        minGpu: 'RTX 2060（6GB）・RX 6600 XT（8GB）',
        memory: '16GB',
        storage: '150GB（SSD）',
        must: ['ハードウェアレイトレーシング対応GPU', 'SSD', 'Windows 11'],
        gtx1660: 'no',
        gtx1660Note: 'レイトレーシング非対応のため起動できない',
        win10: 'no',
        win10Note: '最低環境からWindows 11',
        article: {
          href: '/games/ace-combat-8/not-launching',
          label: '起動しない・クラッシュする時の対処法',
        },
        source: 'https://enso-order.acecombat.jp/',
      },
      {
        name: 'AION2（基本無料）',
        date: '10月5日（アーリーアクセス9月30日）',
        os: 'Windows 10/11',
        minGpu: 'GTX 1050 Ti・RX 470（4GB）',
        memory: '8GB',
        storage: '100GB',
        must: ['常時インターネット接続'],
        gtx1660: 'yes',
        gtx1660Note: '最低環境のGTX 1050 Ti（4GB）より上',
        win10: 'yes',
        win10Note: 'Windows 10/11（64bit）',
        article: {
          href: '/games/aion2/login-error',
          label: 'ログイン・接続できない時の対処法',
        },
        source: steam('3393110'),
      },
      {
        name: 'Gears of War: E-Day',
        date: '10月7日',
        os: 'Windows 10（22H2）以降',
        minGpu: 'RTX 2060・RTX 5050・RX 6600・RX 9060',
        memory: '12GB',
        storage: '115GB（SSD）',
        must: ['ハードウェアレイトレーシング対応GPU', 'SSD'],
        gtx1660: 'no',
        gtx1660Note: 'レイトレーシング対応GPUが必須',
        win10: 'yes',
        win10Note: 'Windows 10 22H2以降（推奨はWindows 11）',
        article: {
          href: '/games/gears-of-war-e-day/not-launching',
          label: '起動しない・落ちる時の対処法',
        },
        source: steam('3010850'),
      },
      {
        name: 'ドラゴンズドグマ 2：ダークアリズン',
        date: '10月9日',
        os: 'Windows 11',
        minGpu: 'GTX 1660・RX 5500 XT（8GB）',
        memory: '16GB',
        storage: '記載なし（SSD推奨）',
        must: ['Windows 11（本編の動作環境）'],
        gtx1660: 'yes',
        gtx1660Note: '最低環境がGTX 1660（本編の動作環境）',
        win10: 'no',
        win10Note: '本編の動作環境はWindows 11（64bit必須）',
        article: {
          href: '/games/dragons-dogma-2/performance',
          label: '重い・カクつく時の設定と対処法',
        },
        source: steam('2054970'),
      },
      {
        name: 'Castlevania: Belmont’s Curse',
        date: '10月15日',
        os: 'Windows 11',
        minGpu: 'GTX 1650',
        memory: '16GB',
        storage: '10GB',
        must: ['Windows 11'],
        gtx1660: 'yes',
        gtx1660Note: '最低環境のGTX 1650より上',
        win10: 'no',
        win10Note: '動作環境の表記はWindows 11',
        source: steam('4231820'),
      },
      {
        name: 'テイルズ オブ エターニア リマスター',
        date: '10月16日',
        os: 'Windows 11',
        minGpu: 'GTX 650 Ti・Radeon HD 7770・Arc A310',
        memory: '4GB',
        storage: '8GB',
        must: ['Windows 11'],
        gtx1660: 'yes',
        gtx1660Note: '最低環境のGTX 650 Tiより上',
        win10: 'partial',
        win10Note:
          '動作環境の表記はWindows 11。DirectX 12にはWindows 10（1809以降）とVRAM 4GB以上が必要との注記あり',
        source: steam('3470960'),
      },
      {
        name: 'ステューピッド・ネバー・ダイズ',
        date: '10月22日',
        os: '記載なし（推奨はWindows 11）',
        minGpu: 'GTX 1070・RTX 3050・RX 580（8GB）',
        memory: '16GB',
        storage: '記載なし',
        must: ['VRAM 8GB'],
        gtx1660: 'no',
        gtx1660Note: '最低環境のGPUはVRAM 8GBで、GTX 1660（6GB）は下回る',
        win10: 'unknown',
        win10Note: '最低環境のOSは記載なし',
        source: steam('3486530'),
      },
      {
        name: 'Call of Duty: Modern Warfare 4',
        date: '10月23日（デジタル版予約でキャンペーン早期アクセス10月17日）',
        os: 'Windows 10（22H2）以降',
        minGpu: 'GTX 970・GTX 1060・RX 470・Arc A580（VRAM 3GB）※ベータ版の値',
        memory: '12GB',
        storage: 'SSD必須',
        must: ['TPM 2.0とセキュアブート', 'Steamアカウントに電話番号', 'SSD'],
        gtx1660: 'yes',
        gtx1660Note: 'ベータ版の最低環境（GTX 1060）より上',
        win10: 'partial',
        win10Note:
          'Windows 10は22H2以降で、TPM 2.0とセキュアブートの有効化が必要',
        article: {
          href: '/games/call-of-duty-modern-warfare-4/tpm-secure-boot',
          label: 'TPM 2.0・セキュアブートの有効化',
        },
        source: steam('4435490'),
      },
      {
        name: 'ファイナルファンタジー レゾナンス',
        date: '10月23日',
        os: 'Windows 11',
        minGpu: 'GTX 1650・RX 6400・Arc A580',
        memory: '8GB',
        storage: '15GB',
        must: ['Windows 11'],
        gtx1660: 'yes',
        gtx1660Note: '最低環境のGTX 1650より上',
        win10: 'no',
        win10Note: '動作環境の表記はWindows 11',
        article: {
          href: '/games/final-fantasy-resonance/not-launching',
          label: '起動しない・特典・体験版の引き継ぎ',
        },
        source: steam('3259780'),
      },
    ],
    faqs: [
      {
        question: 'GTX 1660では遊べない10月の新作はどれですか？',
        answer:
          'エースコンバット8とGears of War: E-Dayは、ハードウェアレイトレーシング対応GPUが最低環境から必須のため、GTX 1660では起動できません。ステューピッド・ネバー・ダイズは最低環境のGPUがVRAM 8GBで、GTX 1660（6GB）は下回ります。',
      },
      {
        question: 'Windows 10で遊べる10月の新作はどれですか？',
        answer:
          '動作環境の表記上、Windows 10で遊べるのはAION2、Gears of War: E-Day（22H2以降）、Call of Duty: Modern Warfare 4（22H2以降で、TPM 2.0とセキュアブートが必要）です。ほかの多くはWindows 11と記載されています。',
      },
      {
        question:
          '「起動しない」を防ぐために、購入前に何を確認すればいいですか？',
        answer:
          'GPUがレイトレーシングに対応しているか、OSのバージョン、SSDかどうか、VRAMの容量の4つです。CoD MW4はさらにTPM 2.0とセキュアブートの有効化が必要です。体験版がある作品は、体験版で動作を確かめるのが確実です。',
      },
    ],
    sources: [
      {
        label: 'ファミ通.com：2026年8月下旬～10月発売のPC新作ゲーム（発売日）',
        url: 'https://www.famitsu.com/article/202608/84258',
      },
      {
        label: 'Activision公式サポート：TPM 2.0とセキュアブート（英語）',
        url: 'https://support.activision.com/articles/trusted-platform-module-and-secure-boot',
      },
      {
        label: 'Call of Duty公式ブログ：ベータ版のPC動作環境（英語）',
        url: 'https://www.callofduty.com/blog/2026/08/call-of-duty-modern-warfare-4-next-early-intel-pc-specs',
      },
    ],
  },
];

export const releaseRoundupBySlug = (slug: string) =>
  releaseRoundups.find((roundup) => roundup.slug === slug);
