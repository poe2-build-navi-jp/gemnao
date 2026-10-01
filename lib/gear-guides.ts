// Buyer guides describe a decision, not a single-product review.
export type GearGuide = {
  slug: string;
  title: string;
  shortTitle: string;
  seoTitle: string;
  description: string;
  lead: string;
  answer: string;
  checkedAt: string;
  beforeBuying: string[];
  compare: { headers: string[]; rows: string[][] };
  sections: {
    id: string;
    title: string;
    paragraphs: string[];
    items?: string[];
  }[];
  example: {
    title: string;
    introduction: string;
    fits: string[];
    cautions: string[];
    specs: { label: string; value: string }[];
    asin: string;
  };
  setup: string[];
  faqs: { question: string; answer: string }[];
  related: { href: string; label: string }[];
  sources: { title: string; url: string }[];
};

export const gearGuides: GearGuide[] = [
  {
    slug: 'discord-microphone-guide',
    title: 'Discord用マイクの選び方｜内蔵・USB・ヘッドセットを比較',
    shortTitle: 'Discord用マイクの選び方',
    seoTitle: 'Discord用マイクの選び方｜内蔵・USB・ヘッドセットを比較',
    description:
      'Discord用マイクを買う前に、内蔵マイクで足りる条件、単体USBマイクとヘッドセットの違い、端子・置き場所・周囲の音の確認点を整理。USBクリップマイク400-MC017も公式仕様から紹介します。',
    checkedAt: '2026-10-01',
    lead: 'Discord用のマイクは、値段や「高音質」の表示だけで選ぶより、いま困っていること、使う端子、口元に置けるかを先に確認すると選びやすくなります。買わずに済む場合も含めて整理します。',
    answer:
      'いまの内蔵マイクで声が十分に届き、周囲の音にも困っていなければ、買い替えは不要です。気に入ったイヤホンを使い続けたいなら単体USBマイク、ゲーム中も口元との距離を保ちたいならブームマイク付きヘッドセットが候補。Discordだけ声が小さい・聞こえない場合は、先に入力設定を確認してください。',
    beforeBuying: [
      'PC版・ブラウザ版Discordの「音声・ビデオ」で、使いたいマイクが入力デバイスに選ばれているか確認。ミュートやOSのマイク許可も確認します。',
      '同じマイク・姿勢・文章で録音とDiscordのマイクテストを比較します。録音では十分なのにDiscordだけ小さいなら、入力設定や音声処理の切り分けを優先してください。詳しい手順は下の関連記事「マイク・声が小さい時の直し方」へ。',
      'マイクテスト中は、参加中の通話で自分のマイクと受信音声が一時的に無効になります。テストを終了してから、実際の通話で相手にも声を確認してもらいます。',
      'PC内蔵マイクや手持ちの別マイクで声が十分に届くなら、そのまま使って構いません。音量だけでなく、普段の姿勢やキーボード操作中も確認します。',
    ],
    compare: {
      headers: ['選択肢', '選びやすい条件', '買う前・使う前の確認'],
      rows: [
        [
          'PCの内蔵マイク',
          'いまの通話に不満がなく、機器を増やしたくない',
          '普段の姿勢で声が届くか。PCの位置を変えると聞こえ方が変わらないか',
        ],
        [
          '単体USBマイク',
          'イヤホンとマイクを別々に選びたい',
          'USB端子、対応OS、置き場所、収音する面・方向',
        ],
        [
          'ブームマイク付きヘッドセット',
          '頭を動かしても口元との距離を保ちたい',
          '装着感、マイク位置の調整範囲、端子、対応機器',
        ],
        [
          'USBクリップマイク（単体USBの一種）',
          '机を空けたい、胸元に装着できる',
          '服やケーブルが触れないか、ケーブルが届くか、周囲の音を拾う特性',
        ],
      ],
    },
    sections: [
      {
        id: 'direction-and-distance',
        title: '周囲の音・指向性・距離で選ぶ',
        paragraphs: [
          '「USB」は接続方法、「ヘッドセット」は形の違いです。USB接続のヘッドセットもあります。この表では、内蔵マイク・単体USBマイク・マイク付きヘッドセットの使い方を比べています。',
          '無（全）指向性は、さまざまな方向の音を拾う特性です。単一指向性は正面の音を拾いやすく、ほかの方向への感度が低い特性ですが、周囲の音を完全に消す機能ではありません（Shure公式）。',
          '単一指向性でも、声を拾う面が口を向いていなかったり、離して置いたりすると、期待した聞こえ方にならないことがあります。メーカーの説明に沿って位置と向きを決め、普段のゲーム姿勢で確認してください。',
          'DiscordのKrispは、自分側の背景雑音を減らすための処理です。相手側の雑音まで除去するものではありません。静かな環境では音質が下がる場合もあるため、オン・オフを比べて選びましょう（Discord公式）。',
        ],
      },
      {
        id: 'bluetooth-input',
        title: 'Bluetoothは買う前に別入力で比較',
        paragraphs: [
          '通話に参加したときだけBluetoothイヤホンの音がこもる場合、ヘッドセット用の音声モードへの切り替えが関係していることがあります（Discord公式）。',
          'PCでは、聞くための出力デバイスと話すための入力デバイスを分けて選べます。まず手持ちの内蔵マイクを入力に選んで比較し、普段のゲームと通話で問題なく使えるか確かめてください。改善するかどうかは機器やOSにもよります。別マイクを買えば必ず直るという意味ではありません。',
          '具体的な切り分けは下の関連記事「Bluetoothでゲーム音が消える・音質が悪い時の対処」で確認できます。内蔵マイクで十分に使える場合、追加購入は不要です。',
        ],
      },
      {
        id: 'purchase-checklist',
        title: '端子・置き場所・対応機器を確認',
        paragraphs: [
          '必要なタイプが決まってから、製品ごとの条件を確認します。',
        ],
        items: [
          '使う機器：PC・スマートフォン・ゲーム機では対応条件が違います。PC対応という説明だけで、ほかの機器でも使えるとは判断しないでください。',
          '端子：USB-A、USB-C、3.5mmのどれか。3.5mmの場合は接続先がマイク入力に対応するかも確認。変換アダプターを使う場合は、アダプター側の対応条件も必要です。',
          '口元との位置：卓上型なら設置位置、ヘッドセットならブームの調整範囲、クリップ式なら装着位置を確認。机の広さだけでなく、普段の姿勢で使えるかを考えましょう。',
          '聞くための機器：単体マイクにはイヤホンやヘッドホンが付属しない場合があります。いま使っている機器と組み合わせられるか確認してください。',
          '販売条件：対応OS、付属品、販売元、返品・保証条件を購入先で確認。価格や在庫は変わるため、販売ページの最新情報で判断してください。',
        ],
      },
    ],
    example: {
      title: '条件付きの製品例：サンワダイレクト 400-MC017',
      introduction:
        '400-MC017はUSB-A接続のクリップ式マイクです。机にスタンドを置かず、胸元に装着したい場合の候補になります。音質ランキングの1位や、すべてのDiscord利用者への推奨ではありません。',
      fits: [
        '対応PCにUSB-A端子があり、メーカーの対応機種・OSを確認できる',
        'いまのイヤホンを使いながら、マイクだけ追加したい',
        '胸元に装着でき、約2mのケーブルでPCまで届く',
      ],
      specs: [
        {
          label: '接続先',
          value: 'USB-Aポートを備えた対応PC',
        },
        {
          label: '形状',
          value: 'クリップ式',
        },
        {
          label: '指向性',
          value: '無（全）指向性',
        },
        {
          label: 'ケーブル長',
          value: '約2m',
        },
        {
          label: '重量',
          value: '約30g',
        },
        {
          label: 'イヤホン・ヘッドホン',
          value: '別途必要',
        },
      ],
      cautions: [
        '無（全）指向性なので周囲の音も拾います。家族の声や生活音をできるだけ拾いたくない人に、ノイズ対策だけを理由として勧める製品ではありません。',
        '服やケーブルがマイクに触れないように装着できるか確認してください。',
        'USB-C端子しかない機器やスマートフォンで使う場合、このページだけで互換性を判断しないでください。使用機器と変換アダプターを含めてメーカーの対応情報を確認してください。',
        'メーカーの対応OS・機種一覧を購入前に確認してください。本記事では全OSやゲーム機での動作を保証していません。',
      ],
      asin: 'B08H6X6G28',
    },
    setup: [
      '新しいマイクを接続したら、Discordの入力デバイスにその機器を選びます。聞くためのイヤホンは出力デバイス側で確認してください。',
      '普段の声で短い文章を話し、通常の姿勢・キーボード操作中・少し顔を動かしたときの聞こえ方を比べます。',
      'マイクテストを終了してから、実際の通話で相手にも確認してもらいましょう。テスト中は通話のマイクと受信音声が一時的に無効になります。これは使い方を確かめるための比較で、厳密な音質測定ではありません。',
    ],
    faqs: [
      {
        question: 'Discord用に高いマイクは必要ですか？',
        answer:
          '必須ではありません。いまのマイクで声が十分に届き、周囲の音にも困っていなければ、そのまま使えます。困りごとを切り分けてから必要な機器を選びましょう。',
      },
      {
        question: 'USBマイクとヘッドセットは、どちらを選べばいいですか？',
        answer:
          'いまのイヤホンを使い続けたいなら単体USBマイク、口元との距離を保ちたいならブームマイク付きヘッドセットが候補です。USBは接続方法なので、USB接続のヘッドセットもあります。',
      },
      {
        question: '単一指向性ならキーボード音は入らなくなりますか？',
        answer:
          '完全にはなくなりません。指向性は音を拾う方向の特性です。マイクと口の位置、キーボードの位置、音声処理も含めて確認してください。',
      },
      {
        question: '400-MC017はUSB-Cのスマートフォンでも使えますか？',
        answer:
          '本記事では確認していません。メーカーのPC向け対応表だけでは、スマートフォンでの動作は保証できません。使用機器と変換アダプターを含めて対応情報を確認してください。',
      },
      {
        question: '相手の声が小さい場合も、自分のマイクを替えるべきですか？',
        answer:
          'まず自分が聞く側の出力設定や、その相手のユーザー音量を確認します。自分のマイクを替える判断とは分けて、下の関連記事「相手の声が小さい時の直し方」を確認してください。',
      },
    ],
    related: [
      {
        href: '/discord/mic-volume-low',
        label: 'マイク・声が小さい時の直し方',
      },
      {
        href: '/discord/bluetooth-audio-problem',
        label: 'Bluetoothでゲーム音が消える・音質が悪い時の対処',
      },
      {
        href: '/discord/user-volume-low',
        label: '相手の声が小さい時の直し方',
      },
    ],
    sources: [
      {
        title: 'Discord公式：音声とビデオのトラブルシューティング',
        url: 'https://support.discord.com/hc/en-us/articles/360045138471-Discord-Voice-and-Video-Troubleshooting-Guide',
      },
      {
        title: 'Discord公式：マイクテスト（通話への一時的な影響を含む）',
        url: 'https://support.discord.com/hc/en-us/articles/360020641332-Mic-Testing',
      },
      {
        title: 'Discord公式：Krisp FAQ',
        url: 'https://support.discord.com/hc/en-us/articles/360040843952-Krisp-FAQ',
      },
      {
        title: 'Discord公式：通話参加時に音質が低下する既知の問題',
        url: 'https://support.discord.com/hc/en-us/articles/19850083499159--Known-Issue-Audio-Quality-Drops-When-Joining-A-Call',
      },
      {
        title: 'Discord公式：入力デバイスが見つからない場合',
        url: 'https://support.discord.com/hc/en-us/articles/214925018-Where-d-my-Audio-Input-go-Various-Voice-Issues',
      },
      {
        title: 'Shure公式：マイクの指向性の基礎',
        url: 'https://www.shure.com/en-GB/insights/microphone-directionality-polar-pattern-basics',
      },
      {
        title: 'サンワダイレクト公式：400-MC017の仕様・対応機種',
        url: 'https://direct.sanwa.co.jp/ItemPage/400-MC017',
      },
    ],
  },
];
export const gearGuideBySlug = (slug: string) =>
  gearGuides.find((guide) => guide.slug === slug);
