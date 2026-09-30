import type { DiscordArticle } from '@/lib/discord-articles';

export type BotRecommendation = {
  id: string;
  name: string;
  purpose: string;
  useCase: string;
  fit: string;
  skip: string;
  cost: string;
  entry: { label: string; url: string };
  dashboard: string;
  manual: string;
  steps: string[];
  example: string;
  success: string;
  failure: string;
  undo: string;
};

export const recommendedBotArticle: DiscordArticle = {
  slug: 'recommended-bots',
  category: 'bot',
  title: 'DiscordおすすめBot 4選｜ゲームサーバー向けの選び方・導入手順',
  shortTitle: 'ゲームサーバーにおすすめのBot',
  seoTitle: 'DiscordおすすめBot 4選｜ゲームサーバーへ導入・設定する方法',
  metaDescription:
    'DiscordのおすすめBotをゲームサーバーの用途別に比較。sesh・Carl-bot・Dyno・Ticket Toolの公式導入口、初期設定、一般メンバーでの動作確認と戻し方を掲載。日程調整・ロール・荒らし対策・相談窓口から選べます。',
  symptom:
    'ゲーム用DiscordサーバーにBotを入れたい管理者向け。遊ぶ日時を決める、ゲーム別にメンバーを分ける、荒らしを防ぐ、運営に個別相談する、の4用途から選び、公式サイトで追加して最初の1機能を設定します。',
  target: 'DiscordのPC・ブラウザ版／ゲームサーバーの所有者・管理者',
  conclusion:
    'DiscordでゲームサーバーにおすすめのBotは、日程調整ならsesh、ゲーム別ロールならCarl-bot、管理・荒らし対策ならDyno、個別相談窓口ならTicket Toolです。まず不足している用途の1つだけを追加し、一般メンバーで使えるか確認しましょう。単発の投票・イベント・基本的な投稿制限ならDiscord標準機能で足りる場合もあります。',
  quickFixes: [
    '下の比較表で用途を1つ選び、該当Botの「設定手順へ」を開く',
    '共通の導入手順で追加先と要求権限を確認し、公式サイトから追加する',
    '各Botの設定例を1つ作り、管理者以外のメンバーで期待結果を確認する',
  ],
  showStatusCheck: false,
  botRecommendations: [
    {
      id: 'sesh',
      name: 'sesh',
      purpose: '日程調整・参加表明',
      useCase: '遊ぶ日が決まらない・参加予定をまとめたい',
      fit: 'パルワールドの協力プレイや固定パーティーの集合日時を決めたい。複数のタイムゾーンにいるメンバーにも日時を伝えたい。',
      skip: '1回の告知と参加予定の確認だけなら、Discordのイベント機能から始められます。',
      cost: '基本のイベント・投票から開始。定期開催・参加枠制限などはPremium対象。',
      entry: {
        label: 'sesh公式で「Add to Discord」を開く',
        url: 'https://sesh.fyi/',
      },
      dashboard: 'https://sesh.fyi/dashboard/',
      manual: 'https://sesh.fyi/manual/',
      steps: [
        '公式サイトの「Add to Discord」から追加し、Dashboardで対象サーバーを選ぶ。サーバーのタイムゾーン設定を確認し、日本時間で開催するならAsia/Tokyoなど日本時間の選択肢に合わせる。',
        'Discordに「#日程調整」を作り、seshと参加者が閲覧・投稿できるようにする。ここで半角「/」を入力し、seshの「/create」を候補から選ぶ。',
        'titleにイベント名、datetimeに未来の日付と時刻を入力する。日本語の日時を自動認識すると決めつけず、公式例の形式を使い、投稿後の表示時刻を必ず確認する。',
        '一般メンバーにイベントの参加表明を操作してもらう。リマインダーを使いたい人は参加確認DMの案内も確認する。DMが閉じている場合は、参加表明とDM通知を別々に判定する。',
      ],
      example:
        '設定例：title＝「パルワールド協力プレイ」、datetime＝「10/03 at 21:00」（開催年の未来日へ変更）。投稿に日本時間の21時が表示されることを確認。日時が決まっていない場合はseshの「/poll」で候補を募る。',
      success:
        'イベント日時が予定どおりで、一般メンバーの参加表明が一覧に反映される。通知を希望した人だけDMのリマインダーも確認する。',
      failure:
        '時刻だけ違う→Dashboardのタイムゾーンと入力日時を確認。/createがない→サーバーへの追加とコマンド利用権限を確認。参加はできるがDMなし→メンバー側のDM受信設定を確認。',
      undo: 'テストイベントの歯車メニュー、またはDashboardでそのイベントだけ編集・取り消す。繰り返し開催の設定を使った場合は、残っている予定も確認する。',
    },
    {
      id: 'carl-bot',
      name: 'Carl-bot',
      purpose: 'ゲーム別のロール付与',
      useCase: '遊ぶゲームをメンバー自身で選んでもらいたい',
      fit: '「パルワールド」「PoE2」など遊ぶゲームをメンバー自身で選び、ロールで募集先を分けたい。',
      skip: '少人数でロール変更がたまにしかないなら、管理者の手動付与でも運用できます。',
      cost: '通常のロール選択から開始。設定数の上限拡張や一部機能はPremium対象。',
      entry: {
        label: 'Carl-bot公式でログイン・導入を始める',
        url: 'https://carl.gg/',
      },
      dashboard: 'https://carl.gg/',
      manual: 'https://docs.carl.gg/',
      steps: [
        'Discordの「サーバー設定」→「ロール」で「パルワールド」「PoE2」を作る。ゲーム選択ロールには管理者・サーバー管理・ロール管理の権限を付けない。',
        'Carl-botを追加し、同じロール画面でCarl-botのロールを配布するゲームロールより上へ移動する。Botに「ロールの管理」があることを確認する。',
        'carl.ggでログインし対象サーバーを選び、Reaction Roles（リアクションロール）の作成画面を開く。投稿先を「#ゲーム選択」にし、説明文と絵文字・ロールの組み合わせを登録する。メニュー表記が違う場合は公式マニュアルのReaction Rolesを参照する。',
        '投稿したメッセージで一般メンバーに絵文字を選んでもらい、プロフィールのロールを確認する。複数ゲームを選べる運用なら、選択を1つに限定するモードを使わない。解除操作後もロールが残らないか確認する。',
      ],
      example:
        '設定例：「遊ぶゲームを選んでください。複数選択可」という説明に、🎮＝パルワールド、⚔️＝PoE2を登録。募集チャンネルの閲覧許可をロールに連動させる場合は、@everyoneの権限も別途確認する。',
      success:
        '選択したゲームロールだけが付く。解除すると外れる。チャンネル制限も設定した場合は、選択したゲームの募集場所が見える。',
      failure:
        '反応は付くがロールなし→Botのロール位置・ロール管理権限・絵文字との対応を確認。ロールは付くがチャンネルが見えない→そのチャンネルの閲覧権限を確認。',
      undo: 'Dashboardでテスト用のReaction Roles設定を解除し、配布済みロールを必要に応じて手動で外す。Botを削除しても付与済みロールが自動で消えるとは限らない。',
    },
    {
      id: 'dyno',
      name: 'Dyno',
      purpose: '管理・荒らし対策',
      useCase: '投稿ルールと管理記録をまとめたい',
      fit: 'メンバーが増え、禁止語・スパムへの対応と管理記録をまとめたい。すでにある標準AutoModのルールに不足がある。',
      skip: '禁止語・大量メンションの制限だけなら、「サーバー設定」→「AutoMod」を先に確認してください。',
      cost: '無料機能と有料モジュールを区別。設定画面・公式Premium比較表で必要な機能を照合。',
      entry: {
        label: 'Dyno公式で導入・Dashboardを開く',
        url: 'https://dyno.gg/',
      },
      dashboard: 'https://dyno.gg/account',
      manual: 'https://docs.dyno.gg/en/modules/automod',
      steps: [
        'Dynoを追加し、dyno.gg/accountで対象サーバーを選ぶ。「Modules」→「Automod」の設定を開く。使わない管理機能は一度に有効にしない。',
        '動作確認用のテキストチャンネルとログ確認先を用意する。Botの閲覧・投稿・履歴閲覧と、選ぶ処理に必要な権限を確認する。投稿削除ならメッセージ管理など、公式Automodの権限一覧と照合する。',
        '最初はBanned Words（exact／完全一致）でテスト語「gemnao_test_123」を設定し、Warnなど警告の処理から試す。自動BAN・キック・長時間のタイムアウトをテストには選ばない。',
        '一般メンバーにテスト語を1回投稿してもらい、警告やログを確認する。免除ロール・免除チャンネルでは検出されない場合があるため、管理者の投稿だけで合否を決めない。確認後はテスト語を外し、必要なルールを1つずつ追加する。',
      ],
      example:
        '設定例：最初はテスト語1個と警告だけ。募集文・ゲーム用語が誤検出されないか確認してから対象語を増やす。Discord標準AutoModと同じルールを重ねると、通知や処理が二重になることがあります。',
      success:
        '一般メンバーのテスト投稿に設定した処理が1回働き、通常の募集文は処理されない。記録を設定した場合は、対象投稿・時刻・処理内容を追える。',
      failure:
        '反応なし→ルール有効化、完全一致の入力、免除設定、Bot権限を確認。二重通知→標準AutoModや別Botの同じルールを確認。誤検出→そのルールだけ停止して条件を狭める。',
      undo: 'Dashboardでテスト語・対象ルールを無効化し、記録した変更前の設定へ戻す。すでに削除された投稿はルールを戻しても復元されない。',
    },
    {
      id: 'ticket-tool',
      name: 'Ticket Tool',
      purpose: '運営への個別相談',
      useCase: '公開チャットに書きにくい相談を受けたい',
      fit: '参加トラブルやメンバー間の相談を、公開チャットに書かせず担当者と話せる窓口にしたい。',
      skip: '相談がほぼなく、管理者へのDMで対応できる小規模サーバーなら後から追加できます。',
      cost: 'まず標準のパネルで試す。追加機能・上限・Premium表示は契約前にDashboardで確認。',
      entry: {
        label: 'Ticket Tool公式の招待画面を開く',
        url: 'https://tickettool.xyz/invite',
      },
      dashboard: 'https://tickettool.xyz/manage-servers',
      manual: 'https://docs.tickettool.xyz/general/setup',
      steps: [
        '所有者など管理者権限を持つ人が公式招待から導入する。公式Setupは管理者権限での設定を前提とするため、共通の「サーバー管理」だけで設定できるとは限らない。要求権限に同意できない場合は追加を止める。',
        'Discordの「サーバー設定」→「ロール」で相談対応者用の「運営サポート」を作り、担当者に付与する。相談窓口を公開するテキストチャンネル「#運営に相談」を用意する。',
        'Dashboardで対象サーバーの「Manage」→「Panel Configs」を開き、「Create Panel」または「＋」でパネルを作る。General OptionsのSupport Team Rolesに対応者ロールを登録し、作成先カテゴリの権限も確認する。',
        '「Send」で「#運営に相談」へパネルを投稿する。一般メンバーにチケット作成ボタンを押してもらい、相談者・担当者がチャンネルを見られ、無関係の一般メンバーは見られないことを確認してから公開する。',
      ],
      example:
        '設定例：パネル名は「参加・運営相談」、本文は「参加トラブルや運営への相談はこちら。パスワードや認証コードは送らないでください」。相談チャンネルは管理者も閲覧し得るため、「完全な秘密のDM」とは案内しない。',
      success:
        '相談者がチケットを作成でき、運営サポートが返答できる。他の一般メンバーからは相談内容が見えない。管理者は別扱いであることも確認する。',
      failure:
        'ボタンはあるが作成失敗→Botのチャンネル作成・カテゴリ権限を確認。担当者だけ見えない→Support Team Rolesと担当者へのロール付与を確認。全員に見える→公開を止め、カテゴリと作成チャンネルの権限を修正する。',
      undo: '窓口の案内を取り下げ、必要な相談記録を保全してからテストチケットを閉じる。パネル設定のDeleteは取り消せないため、運用中の設定をテスト目的で削除しない。',
    },
  ],
  causes: [
    {
      title: '導入前：標準機能と既存Botで足りるか確認する',
      description:
        '選定基準は知名度ではなく、ゲームサーバーで必要な作業と導入後に確認できる結果です。4つすべてを入れる必要はありません。',
      actions: [
        '集合日の告知だけならサーバー名のメニューからイベント作成、候補日の投票だけならチャット入力欄の「＋」から投票作成を確認する。日時・候補・参加条件を入力し、標準機能で足りるか試す。日程調整や参加表明をまとめたい時にseshを選ぶ。',
        '投稿制限は「サーバー設定」→「AutoMod」を確認する。既存のBotで同じ処理があるなら担当を決め、二重の削除・通知を防ぐ。',
        'ロール付与を手動で行う負担があるならCarl-bot、管理ルールをまとめるならDyno、相談窓口が必要ならTicket Toolを選ぶ。',
        '音楽Botやレベル・ランキングBotは、今回の4用途とは別。通話中の音楽再生が必要なら対応する音源・利用条件・音声権限を個別に確認する。古い記事の「YouTube対応」「完全無料」をそのまま判断材料にしない。',
      ],
    },
    {
      title: '共通の入れ方：公式リンクから追加先・権限を確認する',
      description:
        '通常のサーバー追加は所有者または「サーバー管理」権限が必要です。Bot独自のDashboard設定では追加の管理権限を求める場合があります。',
      actions: [
        '下の比較表から公式の導入口を開く。Discordでログインする際は、認証画面のドメインがdiscord.comで、対象Botの名前が合っていることを確認する。',
        '追加先は「自分のアカウント」ではなく目的のサーバーを選ぶ。サーバーが一覧にない場合は、ログイン中のアカウントとサーバー管理権限を確認する。',
        '要求権限を読み、用途と対応させる。ロール管理はロール付与、メッセージ管理は投稿処理、チャンネル管理は相談窓口の作成などに使う。理由が理解できない強い権限を承認する前に公式説明を読む。',
        '承認後、Discordのメンバー一覧と「サーバー設定」→「連携サービス」で対象Botを確認する。追加完了は初期設定完了ではないため、下の用途別手順へ進む。',
      ],
      note: '料金・機能上限・画面表記は変わります。本記事は公式情報に基づく導入案内で、4つのBotを実サーバーで比較測定したランキングではありません。テスト用チャンネルで1機能だけ設定し、保存前の画面を記録してから変更してください。',
    },
    {
      title: '導入後：管理者以外で、期待した結果を確認する',
      description:
        '「Botがメンバー一覧にいる」だけでは成功と判断できません。管理者は権限や免除の条件が違うため、一般メンバーと確認します。',
      actions: [
        'seshは参加表明と日時、Carl-botはロールの付与・解除、Dynoはテスト語と通常文、Ticket Toolは相談者・担当者・無関係の人の見え方を確認する。各Bot欄の「導入成功の目安」と照合する。',
        'コマンドが出ない場合は、利用者にアプリコマンドの使用権限があるか、対象チャンネルと連携サービスのコマンド制限を確認する。Botを再招待する前に、サーバーへ追加済みか確認する。',
        'コマンドは出るが応答しない場合は、同じ利用者・別チャンネル、同じチャンネル・別利用者の順に比較する。全員・全チャンネルで対象Botだけ失敗する場合は提供者の障害・サポートを確認する。',
        'テスト後はテストイベント・テスト語・相談チケットを整理する。追加日時、担当者、用途、有効な機能を運営メモに残し、不要になったBotは関連記事の解除手順で見直す。',
      ],
    },
  ],
  ifNotFixed:
    '追加先がないなら管理権限、設定画面へ入れないならBot独自の管理条件、コマンド候補がないなら利用権限、実行後の失敗なら各Bot欄の「動かない時」を確認します。強い権限を一律に付けたり、削除・再追加を繰り返したりせず、Bot名・操作・エラー・チャンネル別の比較結果を控えて公式サポートへ相談してください。',
  faqs: [
    {
      question: 'ゲームサーバーにはBotを何個入れるのがおすすめですか？',
      answer:
        '最初は不足している用途の1個から始めることをおすすめします。例えば集合日時で困っているサーバーならseshだけを追加し、一般メンバーが参加表明できるか確認します。ゲーム別ロールや相談窓口が必要になった段階で追加すれば、機能の重複と設定の管理負担を減らせます。',
    },
    {
      question: '初心者のゲームサーバーに最初に入れるおすすめBotは？',
      answer:
        '日程が決まらないならsesh、ゲームごとの募集先を分けたいならCarl-botが候補です。目的がないうちはBotなしでも始められます。まずDiscord標準のイベント・投票・AutoModを確認し、不足している用途だけ補ってください。',
    },
    {
      question: '無料で使えるDiscord Botですか？',
      answer:
        '無料で始める候補は、基本の日程調整ならsesh、通常のゲーム別ロール選択ならCarl-bot、管理・荒らし対策ならDynoです。定期イベントや設定上限の拡張などは有料になる場合があります。Ticket Toolは必要なパネル機能と上限を設定画面で確認してください。契約前に、使いたい機能のPremium表示を確認します。',
    },
    {
      question: 'MEE6など有名なBotを入れれば全部できますか？',
      answer:
        '多機能Botで用途をまとめられる場合はありますが、必要な機能が有料だったり既存Botと重複したりします。この記事は人気順ではなく、ゲームサーバーの4用途と最初の確認結果を基準に選んでいます。すでに使っているBotで足りるなら追加は不要です。',
    },
    {
      question: 'スマホからBotを追加・設定できますか？',
      answer:
        '公式招待やWebのDashboardから操作できる場合があります。App DirectoryはDiscord公式ではPC・ブラウザ向けです。ロールの順序やチャンネル権限を確認する初期設定は、PC版またはPCのブラウザ版で進めると画面を見比べやすくなります。',
    },
    {
      question: 'Botを追加すると全メンバーに管理者権限が必要ですか？',
      answer:
        '必要ありません。追加・設定する運営者と、イベント参加やロール選択をするメンバーの権限は別です。Ticket Toolなど設定者に管理者権限を求めるサービスもありますが、一般メンバーへ管理者権限を配る理由にはなりません。',
    },
  ],
  sources: [
    {
      label: 'Discord公式：標準の投票の作成方法',
      url: 'https://support.discord.com/hc/en-us/articles/22163184112407-Polls-FAQ',
    },
    {
      label: 'Discord公式：標準のイベントの作成方法',
      url: 'https://support.discord.com/hc/en-us/articles/4409494125719-Scheduled-Events',
    },
    {
      label: 'Discord公式：アプリの追加・利用場所・管理権限',
      url: 'https://support.discord.com/hc/en-us/articles/21334461140375-Using-Apps-on-Discord',
    },
    {
      label: 'Discord公式：AutoMod FAQ・設定場所',
      url: 'https://support.discord.com/hc/en-us/articles/4421269296535-AutoMod-FAQ',
    },
    { label: 'sesh公式：機能とPremium対象', url: 'https://sesh.fyi/' },
    {
      label: 'sesh公式Manual：/create・/poll・日時・参加表明',
      url: 'https://sesh.fyi/manual/',
    },
    { label: 'Carl-bot公式：機能・Dashboard', url: 'https://carl.gg/about' },
    {
      label: 'Carl-bot公式ドキュメント：ロール設定',
      url: 'https://github.com/botlabs-gg/carlbot-docs/blob/master/docs/roles.md',
    },
    {
      label: 'Dyno公式：Automodの設定と権限',
      url: 'https://docs.dyno.gg/en/modules/automod',
    },
    {
      label: 'Dyno公式：無料・Premiumの比較',
      url: 'https://docs.dyno.gg/en/premium',
    },
    {
      label: 'Ticket Tool公式：導入・担当者ロール・パネル投稿',
      url: 'https://docs.tickettool.xyz/general/setup',
    },
    {
      label: 'Ticket Tool公式：パネルの管理・設定項目',
      url: 'https://docs.tickettool.xyz/dashboard/panel-configs',
    },
  ],
  related: ['bot-add', 'bot-not-responding', 'bot-remove'],
  checkedAt: '2026-09-30',
  status: 'verified',
  ogTitle: 'ゲームサーバーにおすすめのBot 4選',
  ogSteps: [
    '日程調整 → sesh',
    'ゲーム別ロール → Carl-bot',
    '管理・荒らし対策 → Dyno',
    '個別相談 → Ticket Tool',
  ],
};
