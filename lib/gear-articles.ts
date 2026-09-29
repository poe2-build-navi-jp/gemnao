// ゲーマー向けデバイスの紹介記事（/gear）。
// 事実はメーカー公式ページ・報道で確認したものだけを書き、sources に出典を載せる。
// 価格は販売店ごとに変わるため本文には書かない（Amazonアソシエイトの規約上も固定価格の表示はしない）。

export const AMAZON_ASSOCIATE_TAG = 'aquaponyo06-22';

export const amazonUrl = (asin: string) =>
  `https://www.amazon.co.jp/dp/${asin}?tag=${AMAZON_ASSOCIATE_TAG}`;

export type GearArticle = {
  slug: string;
  title: string;
  shortTitle: string;
  seoTitle: string;
  description: string;
  lead: string;
  answer: string;
  checkedAt: string;
  product: { name: string; maker: string; asin: string };
  fits: string[];
  notFits: string[];
  specs: { label: string; value: string }[];
  features: { title: string; body: string }[];
  beforeBuying: string[];
  compare?: { caption: string; headers: string[]; rows: string[][] };
  notice?: string;
  faqs: { question: string; answer: string }[];
  related: { href: string; label: string }[];
  sources: { title: string; url: string }[];
};

export const gearArticles: GearArticle[] = [
  {
    slug: 'stream-deck-plus-xl',
    title:
      'Elgato「Stream Deck + XL」でできること｜36キー・6ダイヤルの左手デバイスは誰向け？',
    shortTitle: 'Stream Deck + XL',
    seoTitle: 'Stream Deck + XLでできること・向いている人｜36キーの左手デバイス',
    description:
      'Elgatoの左手デバイス「Stream Deck + XL」を公式仕様から整理。36個のLCDキー・6つのダイヤル・タッチストリップでできること、Stream Deck +との違い、買う前に確認したいUSB-C 3.0端子や対応OS、置き場所のサイズをまとめました。',
    lead: 'ボタンの多さが話題の左手デバイスです。できることと、買う前に確かめたい条件を公式仕様からまとめました。よく使う操作が数個だけなら、小さいモデルで足りる場合もあります。',
    answer:
      'Stream Deck + XLは、表示を自由に変えられる36個のLCDキーと、押し込みもできる6つのダイヤル、タッチストリップを備えた、Stream Deckシリーズ最大のモデルです（Elgato公式）。配信・動画編集・シムゲームなど、登録したい操作が多い人向け。パソコン側にUSB-C 3.0の端子があり、Windows 11以降またはmacOS 13以降であることを先に確認してください。',
    checkedAt: '2026-09-30',
    product: { name: 'Elgato Stream Deck + XL', maker: 'Elgato', asin: 'B0GQRRF1LC' },
    fits: [
      '配信・動画編集・ゲームなどで、登録したい操作やショートカットが多い',
      'ボタンだけでなく、ダイヤルで細かい調整もしたい',
      'アプリごとにボタンの配置を切り替えて使いたい',
    ],
    notFits: [
      'よく使う操作が数個だけ（8キー・4ダイヤルの「Stream Deck +」など小さいモデルも検討）',
      '机の上に置き場所の余裕がない（奥行205mm・幅147mm・重さ約1.1kg）',
      'パソコンにUSB-C 3.0の端子がない',
    ],
    specs: [
      { label: 'キー', value: 'カスタマイズ可能なLCDキー×36' },
      { label: 'ダイヤル', value: 'プッシュ機能付き360°エンコーダー×6（交換可能）' },
      { label: 'タッチストリップ', value: 'LCDタッチストリップ（161×14mm）' },
      { label: '外形寸法', value: '奥行205×幅147×高さ175mm（スタンド一体型）' },
      { label: '重量', value: '1,085g' },
      { label: '接続', value: 'USB-C 3.0ポート（USB C-to-Cケーブル150cm付属）' },
      { label: '対応OS', value: 'Windows 11以降／macOS 13以降' },
      { label: 'ソフトウェア', value: 'Stream Deckアプリ（無料）' },
    ],
    features: [
      {
        title: 'キーごとにアイコンや表示を変えられる',
        body: '36個のキーはそれぞれが小さな画面（LCD）になっていて、割り当てた操作に合わせてアイコンを変えられます。何のボタンかをひと目で見分けやすいのが特長です。',
      },
      {
        title: '1回押すだけで複数の操作をまとめて実行',
        body: '「Multi Actions」で、1回のタッチで一連の操作を実行できます。さらに「Key Logic」を使うと、1つのキーに「押す」「2回押す」「長押し」の3つの別々の動作を割り当てられます。',
      },
      {
        title: 'アプリごとに配置を自動で切り替え',
        body: '「プロファイル」でアプリやワークフローごとのレイアウトを保存し、自動または手動で切り替えられます。「ページ」や「フォルダー」を使えば、36キーより多くの操作も整理して置けます。',
      },
      {
        title: 'ダイヤルとタッチストリップで細かい調整',
        body: '6つのダイヤルは回すだけでなく押し込みにも対応しています。公式は「素早いコマンドから繊細な微調整まで」と案内しています。タッチストリップでの画面切り替えにも対応しています（ASCII.jp）。',
      },
      {
        title: 'プラグインで対応するアプリを増やせる',
        body: 'Elgato Marketplaceで、コミュニティ製のプラグインやプロファイル、アイコンを探して追加できます。公式はシムゲームやライブ制作、音声、クリエイティブ作業などの使い方を紹介しています。',
      },
    ],
    beforeBuying: [
      'パソコンにUSB-C 3.0（以降）の端子があるか。公式は変換アダプターなしで使える推奨ポートとしてUSB-C 3.0を挙げています',
      'OSがWindows 11以降、またはmacOS 13以降か',
      '机に置けるか。奥行205mm・幅147mm・高さ175mm、重さ1,085gあります',
      '登録したい操作の数。数個なら小さいモデルで足りることもあります（下の比較表）',
    ],
    compare: {
      caption: 'Stream Deck + XL と Stream Deck + の違い（Elgato公式の比較表より）',
      headers: ['', 'Stream Deck + XL', 'Stream Deck +'],
      rows: [
        ['キー', '36', '8'],
        ['ダイヤル', '6（交換可能）', '4（交換可能）'],
        ['画面', 'LCDタッチストリップ', 'LCDタッチストリップ'],
        ['重量', '1,085g', '465g'],
        ['サイズ（奥行×幅×高さ）', '205×147×175mm', '140×138×110mm'],
      ],
    },
    notice:
      '2026年10月10日（土）に秋葉原の「LIFORK AKIHABARA II」で開催されるASCII主催の無料イベント「TOKYO Gaming-PC STREET 9」で、Stream Deck + XLが展示される予定です（13時〜17時30分予定・ASCII.jp 2026年9月26日の記事より）。',
    faqs: [
      {
        question: 'ゲームのキー操作やショートカットも登録できますか？',
        answer:
          'ショートカットなどの操作を登録して使えます（ASCII.jpのレビューでも紹介）。どのアプリやゲームに対応するかはプラグインによって変わるため、使いたいアプリ名でElgato Marketplaceを確認してください。ゲーム中に使うWindowsのキー操作は「ゲーム中に使えるショートカットキー」の記事にまとめています。',
      },
      {
        question: 'Stream Deck + とどちらを選べばいいですか？',
        answer:
          '登録したい操作の数で選ぶのが目安です。+ XLは36キー・6ダイヤル、+は8キー・4ダイヤルです。置き場所も+ XLの方が大きく、重さは約2.3倍あります。',
      },
    ],
    related: [
      { href: '/pc/gaming-shortcut-keys', label: 'ゲーム中に使えるショートカットキー' },
      { href: '/pc/refresh-rate-stuck-60hz', label: 'モニターが144Hzにならない' },
    ],
    sources: [
      {
        title: 'Elgato公式：Stream Deck + XL（技術仕様・比較表）',
        url: 'https://www.elgato.com/jp/ja/p/stream-deck-plus-xl',
      },
      {
        title: 'ASCII.jp：「Stream Deck + XL」は左手デバイス好きの理想型（2026年9月26日）',
        url: 'https://ascii.jp/elem/000/004/435/4435364/',
      },
    ],
  },
];

export const gearArticleBySlug = (slug: string) =>
  gearArticles.find((a) => a.slug === slug);
