import { releaseRoundups, type ReleaseRoundup } from '@/lib/release-roundups';
// Preserve the Japanese editions' dated requirements and structured fit inputs.
// English names are reconciled with the linked store pages; regional dates are not silently substituted.
const rows: Record<
  string,
  {
    name: string;
    date: string;
    os: string;
    minGpu: string;
    storage: string;
    must: string[];
    gtx1660Note: string;
    win10Note: string;
  }[]
> = {
  '2026-10': [
    {
      name: 'DYNASTY WARRIORS 3: Complete Edition Remastered',
      date: 'October 1 (Japanese schedule)',
      os: 'Windows 11',
      minGpu: 'GTX 1060 / RX 5600 XT / Arc A380 (6 GB VRAM)',
      storage: '60 GB',
      must: ['At least 6 GB VRAM', 'Windows 11'],
      gtx1660Note:
        '6 GB VRAM; estimated at or above the minimum GTX 1060 (6 GB).',
      win10Note: 'The minimum OS is Windows 11.',
    },
    {
      name: 'ACE COMBAT 8: WINGS OF THEVE',
      date: 'October 2 (early access September 29)',
      os: 'Windows 11',
      minGpu: 'RTX 2060 (6 GB) / RX 6600 XT (8 GB)',
      storage: '150 GB (SSD)',
      must: ['Hardware ray tracing GPU', 'SSD', 'Windows 11'],
      gtx1660Note:
        'Does not meet the required hardware ray tracing capability.',
      win10Note: 'The minimum OS is Windows 11.',
    },
    {
      name: 'AION2 (free to play)',
      date: 'October 5 (early access September 30)',
      os: 'Windows 10/11',
      minGpu: 'GTX 1050 Ti / RX 470 (4 GB)',
      storage: '100 GB',
      must: ['Persistent internet connection'],
      gtx1660Note: 'Estimated above the minimum GTX 1050 Ti (4 GB).',
      win10Note: 'Windows 10/11, 64-bit.',
    },
    {
      name: 'Gears of War: E-Day',
      date: 'October 7',
      os: 'Windows 10 22H2 or later',
      minGpu: 'RTX 2060 / RTX 5050 / RX 6600 / RX 9060',
      storage: '115 GB (SSD)',
      must: ['Hardware ray tracing GPU', 'SSD'],
      gtx1660Note: 'A GPU with hardware ray tracing is required.',
      win10Note: 'Windows 10 22H2 or later; Windows 11 recommended.',
    },
    {
      name: 'Dragon’s Dogma 2: Dark Arisen',
      date: 'October 9',
      os: 'Windows 11',
      minGpu: 'GTX 1660 / RX 5500 XT (8 GB)',
      storage: 'Not listed (SSD recommended)',
      must: ['Windows 11 (base-game requirements)'],
      gtx1660Note:
        'GTX 1660 is listed in the base game’s minimum requirements.',
      win10Note: 'The base game lists Windows 11, 64-bit required.',
    },
    {
      name: 'Castlevania: Belmont’s Curse',
      date: 'October 15',
      os: 'Windows 11',
      minGpu: 'GTX 1650',
      storage: '10 GB',
      must: ['Windows 11'],
      gtx1660Note: 'Estimated above the minimum GTX 1650.',
      win10Note: 'The listed OS is Windows 11.',
    },
    {
      name: 'Tales of Eternia Remastered',
      date: 'October 16',
      os: 'Windows 11',
      minGpu: 'GTX 650 Ti / Radeon HD 7770 / Arc A310',
      storage: '8 GB',
      must: ['Windows 11'],
      gtx1660Note: 'Estimated above the minimum GTX 650 Ti.',
      win10Note:
        'Minimum and recommended OS fields list Windows 11, but the recommended DX12 note mentions Windows 10 1809 or later and 4 GB VRAM. Windows 10 support is unconfirmed because the wording conflicts. Ask the publisher before buying (reviewed October 13).',
    },
    {
      name: 'Stupid Never Dies',
      date: 'October 22',
      os: 'Windows 11 (minimum and recommended)',
      minGpu: 'GTX 1070 / RTX 3050 / RX 580 (8 GB)',
      storage: '22 GB',
      must: ['8 GB VRAM', 'Windows 11'],
      gtx1660Note:
        'The minimum GPUs list 8 GB VRAM; GTX 1660 has 6 GB and falls short.',
      win10Note:
        'Steam lists Windows 11 for minimum and recommended OS. Windows 10 does not meet the listed minimum (reviewed October 13).',
    },
    {
      name: 'Call of Duty: Modern Warfare 4',
      date: 'October 23; official digital-preorder campaign early access starts October 16 PT',
      os: 'Windows 10 22H2 or later',
      minGpu:
        'GTX 970 / GTX 1060 / RX 470 / Arc A580 (3 GB VRAM; full release)',
      storage: '115 GB free on SSD at launch; updates need additional space',
      must: [
        'Ryzen 5 1400 / Core i5-6600 or better',
        'TPM 2.0 and Secure Boot',
        'Check phone-verification requirements for your storefront and the displayed instructions',
        'SSD',
      ],
      gtx1660Note:
        'Estimated above the full-release minimum GTX 1060. Check CPU, TPM and other requirements separately.',
      win10Note:
        'Windows 10 must be 22H2 or later, with TPM 2.0 and Secure Boot enabled.',
    },
    {
      name: 'FINAL FANTASY RESONANCE',
      date: 'October 23 (Japanese schedule)',
      os: 'Windows 11',
      minGpu: 'GTX 1650 / RX 6400 / Arc A580',
      storage: '15 GB',
      must: ['Windows 11'],
      gtx1660Note: 'Estimated above the minimum GTX 1650.',
      win10Note: 'The listed OS is Windows 11.',
    },
    {
      name: 'Phantom Blade Zero',
      date: 'October 28',
      os: 'Windows 10/11 (64-bit)',
      minGpu: 'GTX 1660 (6 GB) / RX 5500 XT (8 GB)',
      storage: 'Not listed (SSD required)',
      must: ['SSD'],
      gtx1660Note:
        'Listed in the minimum requirements, targeting 1080p at 30 fps with upscaling.',
      win10Note: 'Windows 10/11, 64-bit, is listed.',
    },
  ],
  '2026-11': [
    {
      name: 'Godzilla: Destroy All Monsters Melee Remastered',
      date: 'November 3 (demo available until October 27)',
      os: 'Windows 10 (64-bit); Windows 11 preferred',
      minGpu: 'GTX 1060 (6 GB) / RX 580 (8 GB)',
      storage: '6 GB',
      must: ['DirectX 12 / Shader Model 6 capable GPU'],
      gtx1660Note: 'Estimated above the minimum GTX 1060 (6 GB).',
      win10Note: 'Windows 10, 64-bit; Windows 11 preferred.',
    },
    {
      name: 'CRYMELIGHT',
      date: 'November 4 (Steam listing; demo available)',
      os: 'Windows 10 (64-bit)',
      minGpu: 'RTX 2060 (6 GB) / RX 5600',
      storage: '10 GB',
      must: ['Minimum GPU: RTX 2060'],
      gtx1660Note:
        'Below the minimum RTX 2060 (6 GB). Try the demo to assess your system.',
      win10Note: 'Windows 10, 64-bit.',
    },
    {
      name: 'Edge of Memories',
      date: 'Moved to December 3 (Steam listing, October 25 check)',
      os: 'Windows 10/11',
      minGpu: 'GTX 1060 (6 GB) / RX 590 (8 GB) / Arc A580 (8 GB)',
      storage: '22 GB',
      must: ['Requirements are not final, according to the official note'],
      gtx1660Note: 'Estimated above the minimum GTX 1060 (6 GB).',
      win10Note: 'Windows 10–11 minimum; Windows 11 recommended.',
    },
    {
      name: 'Where the Seeds Fall',
      date: 'November 5 (Steam listing; demo available)',
      os: 'Windows 11',
      minGpu: 'GTX 1660 (6 GB) / RX 6600 (8 GB)',
      storage: '5 GB (SSD required)',
      must: ['Windows 11', 'SSD'],
      gtx1660Note: 'GTX 1660 (6 GB) is the listed minimum.',
      win10Note: 'Both minimum and recommended OS are Windows 11.',
    },
    {
      name: 'Football Manager 27',
      date: 'November 10; free Launch Preview from October 29 to November 3, 18:00 GMT',
      os: 'Windows 10/11 with all updates',
      minGpu: 'GTX 960 / R9 380 / Intel HD 530 (1 GB VRAM)',
      storage: '20 GB',
      must: [
        'CPU with SSE4.2 and SSSE3',
        'Denuvo with a limit of five machine activations a day',
      ],
      gtx1660Note: 'Estimated above the minimum GTX 960.',
      win10Note: 'Windows 10/11 minimum; Windows 11 recommended.',
    },
    {
      name: 'Moomin: Midsummer Madness',
      date: 'November 12 (demo available)',
      os: 'Windows 10',
      minGpu: 'GTX 780',
      storage: '3 GB',
      must: [],
      gtx1660Note: 'Estimated above the minimum GTX 780.',
      win10Note: 'Windows 10.',
    },
    {
      name: 'Prinny Party: Going Overboard!',
      date: 'November 11 (Steam listing, October 25 check)',
      os: 'Windows 10/11',
      minGpu: 'GTX 1050 Ti',
      storage: '1 GB',
      must: [],
      gtx1660Note: 'Estimated above the minimum GTX 1050 Ti.',
      win10Note: 'Windows 10/11 minimum; Windows 11 recommended.',
    },
    {
      name: 'SONIC PICO PARK',
      date: 'November 12',
      os: 'Windows 11 (64-bit)',
      minGpu: 'Not listed',
      storage: 'Not listed',
      must: ['Windows 11'],
      gtx1660Note: 'The minimum GPU is not listed.',
      win10Note: 'The listed OS is Windows 11.',
    },
    {
      name: 'Rakuen Tsuihou -The Stellar Angel- (romanized Japanese title)',
      date: 'November 25 (Steam listing, October 25 check)',
      os: 'Windows 11 (64-bit)',
      minGpu: 'DirectX 11-compatible GPU',
      storage: '1 GB',
      must: ['Windows 11'],
      gtx1660Note: 'The minimum is a DirectX 11-compatible GPU.',
      win10Note: 'The listed OS is Windows 11.',
    },
  ],
};
const faq: Record<string, { question: string; answer: string }[]> = {
  '2026-10': [
    {
      question: 'Which October releases exceed GTX 1660 requirements?',
      answer:
        'ACE COMBAT 8 and Gears of War: E-Day require hardware ray tracing in their minimum specifications, which GTX 1660 does not provide. Stupid Never Dies lists GPUs with 8 GB VRAM, above the GTX 1660’s 6 GB.',
    },
    {
      question: 'Which October releases list Windows 10?',
      answer:
        'AION2, Gears of War: E-Day (22H2 or later), Modern Warfare 4 (22H2 or later, with TPM 2.0 and Secure Boot) and Phantom Blade Zero (64-bit) list it. An OS listing does not guarantee operation. Tales of Eternia’s OS and DX12 notes conflict, so Windows 10 support is unconfirmed. Stupid Never Dies lists Windows 11 for both minimum and recommended OS.',
    },
    {
      question: 'What should I check before buying to avoid launch failures?',
      answer:
        'Check hardware ray tracing support, Windows version, SSD requirements and VRAM capacity. MW4 additionally requires TPM 2.0 and Secure Boot. If a demo is available, try it on your system before buying; it does not guarantee identical full-release performance.',
    },
  ],
  '2026-11': [
    {
      question: 'Are any November releases above GTX 1660 specifications?',
      answer:
        'CRYMELIGHT lists RTX 2060 (6 GB) as its minimum GPU, above GTX 1660. The original specification review did not list mandatory ray tracing; try the demo to assess your system.',
    },
    {
      question: 'Which November releases list Windows 11?',
      answer:
        'Where the Seeds Fall, SONIC PICO PARK and Rakuen Tsuihou -The Stellar Angel- list Windows 11.',
    },
    {
      question: 'Is Edge of Memories still a November release?',
      answer:
        'Steam now lists December 3, 2026 (October 25 check). The table keeps it as a record of the earlier November schedule.',
    },
    {
      question: 'Does this roundup list a PC release for GTA VI?',
      answer:
        'GTA VI is scheduled for November 19, 2026 on PS5 and Xbox Series X|S. Rockstar Games had not officially announced a PC version as of October 25, 2026.',
    },
  ],
};
// Linked articles without an English edition yet; the English table must not
// point to a missing /en page. Remove an entry when its translation is added.
const japaneseOnlyArticles = new Set([
  '/games/godzilla-destroy-all-monsters-melee/not-launching',
  '/games/where-the-seeds-fall/not-launching',
  '/games/football-manager-27/not-launching',
]);
export const releaseRoundupsEn: ReleaseRoundup[] = releaseRoundups.map((r) => {
  const month = r.slug === '2026-10' ? 'October' : 'November';
  const translated = rows[r.slug];
  if (translated.length !== r.games.length)
    throw Error(`Roundup parity: ${r.slug}`);
  return {
    ...r,
    title: `${month} 2026 PC Releases: Requirements, GTX 1660 and Windows 10`,
    shortTitle: `${month} 2026 releases`,
    description: `Compare the listed minimum requirements for ${r.games.length} ${month} releases, including GPU, Windows, memory, storage and launch-blocking requirements. GPU comparisons are editorial estimates.`,
    lead:
      r.slug === '2026-10'
        ? 'Check essential requirements before buying. This English edition preserves the Japanese review: Tales and Stupid Never Dies OS notes were reviewed October 13; MW4 full-release specifications and launch information were reviewed October 18.'
        : 'A dated requirements roundup based on the Japanese edition, with dates and requirements rechecked against Steam on October 25. Three listed games require Windows 11. Check current official requirements before buying.',
    games: r.games.map((g, i) => ({
      ...g,
      ...translated[i],
      memory: g.memory === '記載なし' ? 'Not listed' : g.memory,
      article:
        g.article && !japaneseOnlyArticles.has(g.article.href)
          ? {
              href: `/en${g.article.href}`,
              label: 'Requirements and troubleshooting',
            }
          : undefined,
    })),
    faqs: faq[r.slug],
    sources: r.sources.map((s, i) => ({
      ...s,
      label:
        r.slug === '2026-10'
          ? [
              'Famitsu: late August–October PC release schedule (Japanese)',
              'Activision: editions, release dates and early access (updated October 13)',
              'Activision: TPM 2.0 and Secure Boot',
              'Activision: full-release PC requirements (updated October 1)',
            ][i]
          : [
              'Famitsu: November 2026 PC release schedule (Japanese)',
              'PC Gamer: 2026 PC release calendar',
            ][i],
    })),
  };
});
