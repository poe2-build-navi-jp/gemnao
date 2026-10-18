import type { GearArticle } from '@/lib/gear-articles';
export const gearArticlesEn: GearArticle[] = [
  {
    slug: 'stream-deck-plus-xl',
    title: 'Elgato Stream Deck + XL: What 36 Keys and Six Dials Can Do',
    shortTitle: 'Stream Deck + XL',
    seoTitle: 'Stream Deck + XL: Features, Compatibility and Who It Suits',
    description:
      'Compare the official specifications, controls and desk space requirements of Stream Deck + XL and Stream Deck + before buying.',
    lead: 'This control deck offers many assignable buttons. Check what you actually need, the official specifications and your available space; a smaller model may cover a handful of frequent actions.',
    answer:
      'Stream Deck + XL combines 36 customizable LCD keys, six push rotary encoders and a touch strip. Elgato describes it as the largest Stream Deck model. It suits workflows with many actions, including streaming, editing and simulation games. First check for a USB-C 3.0 port and Windows 11 or later, or macOS 13 or later.',
    checkedAt: '2026-10-18',
    product: {
      name: 'Elgato Stream Deck + XL',
      maker: 'Elgato',
      asin: 'B0GQRRF1LC',
    },
    fits: [
      'You want many actions or shortcuts for streaming, editing or gaming.',
      'You need fine adjustments with dials as well as buttons.',
      'You want layouts that switch between applications.',
    ],
    notFits: [
      'You use only a few actions: consider a smaller model such as Stream Deck + with eight keys and four dials.',
      'Desk space is limited: the XL is 205 mm deep, 147 mm wide and approximately 1.1 kg.',
      'Your computer does not have a USB-C 3.0 port.',
    ],
    specs: [
      { label: 'Keys', value: '36 customizable LCD keys' },
      {
        label: 'Dials',
        value: 'Six replaceable 360° encoders with push function',
      },
      { label: 'Touch strip', value: 'LCD touch strip, 161 × 14 mm' },
      {
        label: 'Dimensions',
        value: '205 D × 147 W × 175 H mm, integrated stand',
      },
      { label: 'Weight', value: '1,085 g' },
      {
        label: 'Connection',
        value: 'USB-C 3.0; 150 cm USB C-to-C cable included',
      },
      {
        label: 'Operating systems',
        value: 'Windows 11 or later / macOS 13 or later',
      },
      { label: 'Software', value: 'Free Stream Deck app' },
    ],
    features: [
      {
        title: 'Custom icons on each key',
        body: 'Each of the 36 keys has its own LCD. Change the icon to match its assigned action and identify controls at a glance.',
      },
      {
        title: 'Several actions from one press',
        body: 'Multi Actions runs a sequence from one touch. Key Logic allows separate actions for a press, double press and long press on the same key.',
      },
      {
        title: 'Layouts for different applications',
        body: 'Profiles store layouts for applications and workflows, with automatic or manual switching. Pages and folders organize more actions than the 36 visible keys.',
      },
      {
        title: 'Dials and touch controls for fine adjustments',
        body: 'The six dials support rotation and pressing. Elgato describes both quick commands and fine adjustments; ASCII.jp also describes switching displays with the touch strip.',
      },
      {
        title: 'Expand support with plugins',
        body: 'Elgato Marketplace offers community plugins, profiles and icons. Elgato illustrates uses including simulation games, live production, audio and creative work.',
      },
    ],
    beforeBuying: [
      'Check for USB-C 3.0 or later. Elgato lists USB-C 3.0 as the recommended port for use without an adapter.',
      'Check for Windows 11 or later, or macOS 13 or later.',
      'Measure desk space for 205 D × 147 W × 175 H mm and a weight of 1,085 g.',
      'List the actions you want to assign. A smaller model may be enough for a few actions.',
    ],
    compare: {
      caption:
        'Stream Deck + XL versus Stream Deck +, from Elgato’s comparison',
      headers: ['Feature', 'Stream Deck + XL', 'Stream Deck +'],
      rows: [
        ['Keys', '36', '8'],
        ['Dials', '6, replaceable', '4, replaceable'],
        ['Display', 'LCD touch strip', 'LCD touch strip'],
        ['Weight', '1,085 g', '465 g'],
        ['Size (D × W × H)', '205 × 147 × 175 mm', '140 × 138 × 110 mm'],
      ],
    },
    notice:
      'Historical event notice: ASCII.jp’s September 26, 2026 article announced a Stream Deck + XL exhibit at the free TOKYO Gaming-PC STREET 9 event at LIFORK AKIHABARA II, scheduled for October 10, 13:00–17:30. That date has passed; this records the announcement and does not confirm that the exhibit took place.',
    faqs: [
      {
        question: 'Can I assign game controls and shortcuts?',
        answer:
          'Shortcuts can be assigned, as illustrated in ASCII.jp’s review. Application and game support varies by plugin, so search Elgato Marketplace for the application you use. Check the game’s rules before using automated actions. Our gaming keyboard shortcuts guide covers useful Windows key combinations.',
      },
      {
        question: 'Should I choose Stream Deck + or + XL?',
        answer:
          'Start with how many actions you need: + XL has 36 keys and six dials, while + has eight keys and four dials. The XL also takes more desk space and weighs about 2.3 times as much.',
      },
    ],
    related: [
      {
        href: '/en/pc/gaming-shortcut-keys',
        label: 'Keyboard shortcuts for gaming',
      },
      {
        href: '/en/pc/refresh-rate-stuck-60hz',
        label: 'Monitor stuck at 60 Hz',
      },
    ],
    sources: [
      {
        title:
          'Elgato: Stream Deck + XL specifications and comparison (Japanese)',
        url: 'https://www.elgato.com/jp/ja/p/stream-deck-plus-xl',
      },
      {
        title:
          'ASCII.jp: Stream Deck + XL review, September 26, 2026 (Japanese)',
        url: 'https://ascii.jp/elem/000/004/435/4435364/',
      },
    ],
  },
];
