import { discordCompatibilityArticles } from './discord-compatibility-articles';
import type { ContentStatus } from '@/lib/game-articles';
import { discordGrowthArticles } from '@/lib/discord-growth-articles';
import { discordP0Articles } from '@/lib/discord-p0-articles';
import { discordStreamingGrowthArticles } from '@/lib/discord-streaming-growth-articles';
import { discordAudioGrowthArticles } from '@/lib/discord-audio-growth-articles';
import { discordBotArticles } from '@/lib/discord-bot-articles';

export type DiscordCategory =
  | 'launch'
  | 'audio'
  | 'connection'
  | 'screen'
  | 'game'
  | 'bot';

export type DiscordCause = {
  title: string;
  description: string;
  actions: string[];
  note?: string;
};

export type DiscordArticle = {
  slug: string;
  category: DiscordCategory;
  title: string;
  shortTitle: string;
  seoTitle: string;
  metaDescription: string;
  symptom: string;
  target: string;
  conclusion: string;
  quickFixes: string[];
  /** Where sharing fails, how to confirm it, and the cause section to follow. */
  diagnosis?: { symptom: string; check: string; causeIndex: number }[];
  diagnosisTitle?: string;
  diagnosisIntro?: string;
  /** Omit the generic outage notice when a specific account or device error needs priority. */
  showStatusCheck?: boolean;
  causes: DiscordCause[];
  ifNotFixed: string;
  followUp?: {
    title: string;
    description: string;
    href: string;
    label: string;
  };
  faqs: { question: string; answer: string }[];
  sources: { label: string; url: string }[];
  related: string[];
  checkedAt: string;
  status: ContentStatus;
  ogTitle?: string;
  ogSteps?: string[];
};

export const discordCategoryLabels: Record<DiscordCategory, string> = {
  launch: '起動・アップデート',
  audio: '音声',
  connection: '接続',
  screen: '画面共有・配信',
  game: 'ゲーム連携',
  bot: 'Bot・アプリ',
};

const support = (path: string, label: string) => ({
  label: `Discord公式サポート：${label}`,
  url: `https://support.discord.com/hc/en-us/articles/${path}`,
});
const discordStatus = {
  label: 'Discord Status（公式障害情報）',
  url: 'https://discordstatus.com/',
};
const voiceVideoGuide = support(
  '360045138471-Discord-Voice-and-Video-Troubleshooting-Guide',
  '音声とビデオのトラブルシューティングガイド（英語）',
);
const micTesting = support('360020641332-Mic-Testing', 'マイクテスト（英語）');
const audioInputGone = support(
  '214925018-Where-d-my-Audio-Input-go-Various-Voice-Issues',
  '音声入力が表示されない・その他の音声トラブル（英語）',
);
const errorCodesGuide = support(
  '30952914470807-Discord-Audio-and-Video-Error-Codes-Troubleshooting-Guide',
  '音声・ビデオのエラーコード トラブルシューティングガイド（英語）',
);
const amdRtcGuide = support(
  '4978019693463-AMD-GPU-CPU-RTC-CONNECTING-Troubleshooting',
  'AMD GPU/CPU環境でのRTC CONNECTINGトラブルシューティング（英語）',
);
const generalTroubleshooting = support(
  '31623498041623-Discord-Troubleshooting-Guide',
  'Discordトラブルシューティングガイド（英語）',
);
const streamingGuide = support(
  '33030151293079-Discord-Voice-Video-Streaming-Guide',
  '音声・ビデオ・配信ガイド（英語）',
);

const existingDiscordArticles: DiscordArticle[] = [
  {
    slug: 'not-opening',
    category: 'launch',
    title: 'Discordが起動しないときの対処法【Windows版】',
    shortTitle: 'Discordが起動しない',
    seoTitle: 'Discordが起動しないときの対処法【Windows版】',
    metaDescription:
      'Discordのアイコンを押しても画面が開かない、無反応になる時の切り分け手順です。プロセスの終了、キャッシュ削除、管理者権限での起動を順番に確認します。',
    symptom:
      'デスクトップアイコンやタスクトレイのDiscordをクリックしても、ウィンドウが表示されない。クリック後に反応がない、またはすぐに閉じてしまう場合の手順です。',
    target: 'Windows版 Discordデスクトップアプリ',
    conclusion:
      'タスクマネージャーでDiscordの全プロセスを終了してから起動し直し、直らなければキャッシュを削除し、それでも直らなければ管理者として実行します。',
    quickFixes: [
      'タスクマネージャーでDiscordのプロセスをすべて終了してから、もう一度起動する',
      'Discordを右クリックし「管理者として実行」で起動する',
      'Discordのキャッシュフォルダーを削除してから起動する',
    ],
    causes: [
      {
        title: '起動プロセスが残ったまま多重起動している',
        description:
          '前回の終了時にプロセスが残っていると、新しく起動しようとしても画面が開きません。',
        actions: [
          'Ctrl＋Shift＋Escでタスクマネージャーを開く',
          '「プロセス」タブでDiscordに関する項目をすべて選び「タスクの終了」を押す',
          'タスクトレイのDiscordアイコンも右クリックして終了する',
          'あらためてDiscordを起動して確認する',
        ],
      },
      {
        title: 'キャッシュやローカルストレージが壊れている',
        description:
          '更新や強制終了の後、キャッシュファイルが壊れて読み込みに失敗することがあります。',
        actions: [
          'Discordを完全に終了する（タスクトレイも確認）',
          'Windows＋Rで「ファイル名を指定して実行」を開き、%appdata%\\discord\\Cache を入力してフォルダーを開く',
          'Cacheフォルダーの中身を削除する（フォルダー自体は残してよい）',
          '同じ階層のCode Cache、GPUCacheがあれば同様に中身を削除する',
          'Discordを起動して読み込まれるか確認する',
        ],
        note: '削除するのはキャッシュのみです。ログイン情報やサーバーの並び順はDiscordのアカウント側に保存されているため、通常は消えません。',
      },
      {
        title: 'セキュリティソフトやファイアウォールが起動をブロックしている',
        description:
          'ウイルス対策ソフトがDiscordの実行ファイルを隔離・ブロックしている場合、起動画面自体が表示されません。',
        actions: [
          'セキュリティソフトの隔離・ブロック履歴にDiscordが含まれていないか確認する',
          '含まれている場合は許可リストに追加する（設定内容はソフトごとに異なるため、各ソフトのヘルプに従う）',
          '社給PCや制限されたネットワークの場合は、管理者に起動許可を確認する',
        ],
      },
    ],
    ifNotFixed:
      'ここまでで直らない場合は、Discordを完全にアンインストールしてから公式サイト（discord.com）から最新のインストーラーを取得し、再インストールしてください。再インストール後もサーバーの参加履歴や設定はアカウントに保存されているため、通常は引き継がれます。',
    faqs: [
      {
        question: 'キャッシュを削除するとログイン情報も消えますか？',
        answer:
          '通常は消えません。ログイン状態やサーバー設定はDiscordのアカウント側（クラウド側）で管理されているため、キャッシュ削除後に再ログインを求められる場合はありますが、サーバーの参加履歴などは残ります。',
      },
      {
        question: '再インストールしても起動しない場合は？',
        answer:
          'PC自体の再起動を試し、それでも直らない場合はDiscord Statusで大規模障害が起きていないか確認したうえで、公式サポートへの問い合わせを検討してください。',
      },
    ],
    sources: [generalTroubleshooting, discordStatus],
    related: ['update-failed', 'installation-failed', 'crashing'],
    checkedAt: '2026-09-16',
    status: 'verified',
  },
  {
    slug: 'mic-not-working',
    category: 'audio',
    title: 'Discordでマイクが反応しないときの直し方【Windows】',
    shortTitle: 'マイクが反応しない',
    seoTitle: 'Discordでマイクが反応しないときの直し方【Windows】',
    metaDescription:
      'Discordで自分の声が相手に届かない、マイクテストで反応しない時の対処法です。入力デバイスの選び直し、Windowsのマイク権限、入力感度を順に確認します。',
    symptom:
      '通話中に「聞こえない」と言われる、設定画面のマイクテストでバーが反応しない、マイクアイコンにミュート表示がないのに声が届かない場合の手順です。',
    target: 'Windows版 Discordデスクトップアプリ',
    conclusion:
      '「音声・ビデオ」設定で入力デバイスを選び直してマイクテストを行い、次にWindowsのマイクアクセス許可、最後に入力感度とミュート状態を確認します。',
    quickFixes: [
      'ユーザー設定の「音声・ビデオ」で入力デバイスを選び直し、マイクテストで反応を確認する',
      'Windowsの設定でDiscordのマイクアクセスが許可されているか確認する',
      'Discordを完全に終了し、ヘッドセットを挿し直してから再起動する',
    ],
    causes: [
      {
        title:
          '入力デバイスの選択が違っている、またはOS側で規定デバイスが変わった',
        description:
          '別のマイクを接続したりWindows更新後に、Discordが選んでいる入力デバイスが実際に使いたい機器と違っていることがあります。',
        actions: [
          'Discordの歯車アイコンからユーザー設定を開く',
          '「音声・ビデオ」タブを開く',
          '「入力デバイス」で使用中のマイクを選び直す',
          '「マイクをテストする」ボタンを押し、話した時に入力レベルのバーが動くか確認する',
        ],
      },
      {
        title: 'WindowsのマイクアクセスがDiscordに許可されていない',
        description:
          'Windowsのプライバシー設定でマイクへのアクセスがオフになっていると、Discord側の設定は正しくても音が届きません。',
        actions: [
          'Windowsの「設定」を開く',
          '「プライバシーとセキュリティ」→「マイク」を開く',
          '「マイクへのアクセス」がオンになっているか確認する',
          '「デスクトップ アプリがマイクにアクセスできるようにする」をオンにする。デスクトップ版Discordは個別の許可一覧に出ない場合がある',
          'Discordを再起動して反映させる',
        ],
      },
      {
        title: '入力感度が低すぎる、または外部ミュートが有効になっている',
        description:
          '入力モードが「感度に応じて自動的に判定」になっている場合、感度が低いと声を拾いません。ヘッドセット側の物理ミュートスイッチも見落としやすい原因です。',
        actions: [
          '「音声・ビデオ」の「入力モード」を確認する（自動感度／プッシュトゥトーク）',
          '自動感度の場合は「自動的に感度を決定する」をオフにし、スライダーを手動で調整する',
          'ヘッドセットやマイク本体に物理ミュートボタンがないか確認する',
          '画面下部のマイクアイコンがミュートになっていないか確認する',
        ],
      },
    ],
    ifNotFixed:
      'ボイスレコーダーなど他のアプリでもマイクが反応しない場合は、Discordではなくマイク本体・ドライバー・OS側の問題です。Windowsのサウンド設定でマイクの音量とドライバーの状態を確認してください。Discord側だけの問題と分かっている場合は、「音声・ビデオ」設定の下部から音声設定をリセットし、再度デバイスを選び直してください。',
    faqs: [
      {
        question: 'マイクテストのバーは動くのに、通話中だけ声が届きません',
        answer:
          '通話中の入力デバイスが設定画面と異なる可能性があります。通話に参加した状態で改めて「音声・ビデオ」設定を開き、入力デバイスの選択を確認してください。サーバー側でミュートにされていないかも確認してください。',
      },
      {
        question: 'Bluetoothヘッドセットだけ反応しません',
        answer:
          'Bluetooth機器は通話用プロファイルへの切り替えが必要な場合があります。Windowsのサウンド設定でマイクとして認識されているか確認し、それでも反応しない場合は有線接続やUSBマイクで切り分けてください。',
      },
    ],
    sources: [voiceVideoGuide, micTesting, audioInputGone],
    related: ['audio-input-not-found', 'error-1002', 'error-1003'],
    checkedAt: '2026-09-23',
    status: 'verified',
  },
  {
    slug: 'cant-hear-voice',
    category: 'audio',
    title: 'Discordで相手の声が聞こえないときの原因と対処法',
    shortTitle: '相手の声が聞こえない',
    seoTitle: 'Discordで相手の声が聞こえないときの原因と対処法',
    metaDescription:
      'ボイスチャンネルで特定の相手、または全員の声が聞こえない時の切り分け方です。出力デバイスとユーザー別音量、相手側のマイク設定を順に確認します。',
    symptom:
      'ボイスチャンネルに参加しているのに音が聞こえない、特定の1人だけ聞こえない、通話中に急に無音になる場合の手順です。',
    target: 'Windows版 Discordデスクトップアプリ',
    conclusion:
      'まず出力デバイスを確認し、次に聞こえない相手のユーザー別音量を確認します。自分だけの症状か全員に共通する症状かで、切り分ける相手が変わります。',
    quickFixes: [
      '「音声・ビデオ」設定で出力デバイスを選び直し、テスト音を再生して確認する',
      '聞こえない相手のアイコンを右クリックし、ユーザー個別の音量が0になっていないか確認する',
      'ボイスチャンネルから一度退出し、入り直す',
    ],
    causes: [
      {
        title: '出力デバイスの選択違い、または音量が絞られている',
        description:
          'スピーカーとヘッドセットなど複数の出力機器がある場合、Discordが選んでいる出力先が実際に使っている機器と違うことがあります。',
        actions: [
          'ユーザー設定の「音声・ビデオ」を開く',
          '「出力デバイス」で使用中のスピーカーやヘッドセットを選び直す',
          '出力デバイス欄の「テスト音を再生する」で音が鳴るか確認する',
          'Windows側の音量ミキサーでDiscordがミュートになっていないか確認する',
        ],
      },
      {
        title: '特定ユーザーの個別音量が下がっている',
        description:
          'Discordはユーザーごとに個別の音量を設定でき、誤って0近くまで下げてしまっていることがあります。',
        actions: [
          '聞こえない相手のアイコンまたは名前を右クリックする',
          '表示される音量スライダーの値を確認し、適切な値に戻す',
          'メンバーリストのユーザーを右クリックし、「ミュート」がオンになっていないか確認する',
        ],
      },
      {
        title: '相手側のマイクや入力設定に問題がある',
        description:
          '全員に相手の声が聞こえない場合、原因は自分ではなく発言している相手側にあることが多いです。',
        actions: [
          '他の参加者にも同じ相手の声が聞こえているか確認する',
          '全員に聞こえていない場合は、相手に「マイクが反応しない」記事の手順を試してもらう',
          '相手のマイクアイコンにミュート表示が出ていないか、通話画面で確認する',
        ],
      },
    ],
    ifNotFixed:
      '出力デバイスも個別音量も問題なく、それでも1人だけ聞こえない場合は、いったんボイスチャンネルから退出し、Discordを再起動してから入り直してください。全員の声が同時に聞こえなくなる場合はDiscord側の一時的な問題の可能性があるため、Discord Statusを確認してください。',
    faqs: [
      {
        question: '自分の声は届いているのに、相手の声だけ聞こえません',
        answer:
          '出力デバイスの選択ミスか、その相手個人の音量設定が下がっている可能性が高いです。まず出力デバイスのテスト音で自分の環境を確認し、次に相手のユーザー個別音量を確認してください。',
      },
      {
        question: '画面共有中だけ音声が聞こえにくくなります',
        answer:
          '画面共有や配信は通話より通信量が多く、回線状況によって音声が不安定になることがあります。回線が安定しているか確認し、改善しない場合は共有を一度止めて再開してください。',
      },
    ],
    sources: [voiceVideoGuide, audioInputGone],
    related: ['mic-not-working', 'audio-input-not-found', 'error-1003'],
    checkedAt: '2026-09-16',
    status: 'verified',
  },
  {
    slug: 'rtc-connecting',
    category: 'connection',
    title: 'DiscordがRTC接続中から進まないときの直し方',
    shortTitle: 'RTC接続中から進まない',
    seoTitle: 'DiscordがRTC接続中から進まないときの直し方',
    metaDescription:
      'ボイスチャンネル参加時に「RTC Connecting」の表示から進まない時の対処法です。AMD環境での既知の問題とネットワーク側の原因を切り分けます。',
    symptom:
      'ボイスチャンネルに参加しようとすると「RTC接続中（RTC Connecting）」の表示のまま進まず、通話が始まらない場合の手順です。',
    target: 'Windows版 Discordデスクトップアプリ',
    conclusion:
      'AMD製GPU・CPU環境では既知の互換性問題があるため、公式手順に沿って設定を1つ変更します。該当しない場合はVPN・ファイアウォールなどネットワーク側を順に確認します。',
    quickFixes: [
      'Discordを完全に終了し、ボイスチャンネルに入り直す',
      'AMD製GPU・CPUの場合はDiscordのユーザー設定→音声・ビデオでOpenH264をオフにして接続を試す',
      'VPNを使用している場合は無効にしてから再接続する',
    ],
    causes: [
      {
        title: 'AMD製GPU・CPU環境での既知の互換性問題',
        description:
          'Discord公式サポートは、AMD製GPU・CPUを使用する一部の環境でRTC接続中から進まなくなる問題を案内しています。',
        actions: [
          'ユーザー設定の「音声・ビデオ」を開く',
          '「詳細設定」の一覧から「OpenH264 Video Codec provided by Cisco Systems, Inc.」を探し、オフにする',
          '切り替え後に通話を比較する。改善しなければWindows＋Rでdxdiagを開きGPU名を確認して、AMD公式の対応ドライバーを更新する',
          'PCを再起動してからボイスチャンネルに再度参加する',
        ],
      },
      {
        title: 'VPN・ファイアウォール・QoS設定によるネットワークの阻害',
        description:
          '通話に必要な通信がVPNやファイアウォールで妨げられていると、接続確立の途中で止まります。',
        actions: [
          'VPNを使用している場合は一時的に無効にして接続できるか確認する',
          'ユーザー設定の「音声・ビデオ」にある「Quality of Serviceの高packet priorityを有効にする」をオフにする',
          'セキュリティソフトやファイアウォールでDiscordの通信が許可されているか確認する',
          'ルーターとPCを再起動する',
        ],
      },
      {
        title: 'Discord側の一時的な問題',
        description:
          '自分の環境に問題がなくても、Discordのボイスサーバー側で障害が起きている場合があります。',
        actions: [
          'Discord Statusで大規模障害が発表されていないか確認する',
          '障害が確認できる場合は、PC側の設定変更を進めずに復旧を待つ',
          '別のボイスチャンネルやサーバーでも同じ症状が出るか確認する',
        ],
      },
    ],
    ifNotFixed:
      'ここまでの手順を1つずつ試しても直らない場合は、使用している音声リージョン（サーバーの設定からボイスチャンネルのリージョンを変更可能）を変えて接続できるか確認してください。学校・職場のネットワークでは、管理者がUDP通信を制限している場合があるため、別のネットワークでの再現有無も確認すると原因を絞り込めます。',
    faqs: [
      {
        question: 'AMD環境ではないのに発生します。原因は何ですか？',
        answer:
          'VPN、ファイアウォール、ルーターのQoS設定、または一時的なDiscord側の問題が主な原因です。上から順に、ネットワーク関連の設定を1つずつ確認してください。',
      },
      {
        question: '「No Route」という表示との違いは何ですか？',
        answer:
          'どちらも接続確立の途中で止まる症状ですが、「No Route」は通信経路が見つからない状態を指すエラー表示です。詳しくはNo Routeの記事を確認してください。',
      },
    ],
    sources: [amdRtcGuide, errorCodesGuide, discordStatus],
    related: ['no-route', 'call-disconnects', 'cant-hear-voice'],
    checkedAt: '2026-09-25',
    status: 'verified',
  },
  {
    slug: 'no-route',
    category: 'connection',
    title: 'DiscordでNo Routeが出る原因と対処法',
    shortTitle: 'No Routeが出る',
    seoTitle: 'DiscordでNo Routeが出る原因と対処法',
    metaDescription:
      'ボイスチャンネル接続時に「No Route」と表示されて接続できない時の対処法です。VPNやルーターのUDP通信の制限を中心に切り分けます。',
    symptom:
      'ボイスチャンネルに参加しようとすると「No Route」と表示され、通話に接続できない場合の手順です。',
    target: 'Windows版 Discordデスクトップアプリ',
    conclusion:
      'VPNの無効化、ルーターの再起動、QoS設定の見直しの順に、通信経路を妨げている要因を1つずつ取り除きます。',
    quickFixes: [
      'ルーターとPCを再起動する',
      'VPNを使用している場合は無効にする',
      'ユーザー設定の「音声・ビデオ」でQoSの高packet priorityをオフにする',
    ],
    causes: [
      {
        title: 'VPNがUDP通信に対応していない、または経路を塞いでいる',
        description:
          'DiscordのボイスチャンネルはUDP通信を使うため、VPNの設定によっては経路が確立できません。',
        actions: [
          'VPNを一時的に無効にしてから、ボイスチャンネルへの接続を試す',
          '無効化で直る場合は、VPN側でUDP通信を許可する設定があるか確認する',
          '職場・学校支給のVPNの場合は、ネットワーク管理者に相談する',
        ],
      },
      {
        title: 'ルーターやセキュリティソフトがUDP通信を制限している',
        description:
          '家庭用ルーターやセキュリティソフトの設定によっては、Discordの通信が制限・遮断されることがあります。',
        actions: [
          'ルーターとPCを両方再起動する',
          'ユーザー設定の「音声・ビデオ」にある「Quality of Serviceの高packet priorityを有効にする」をオフにする',
          'セキュリティソフトのファイアウォール設定でDiscordの通信が許可されているか確認する',
          '公衆Wi-Fiやテザリングなど別のネットワークでも同じ症状が出るか確認する',
        ],
      },
      {
        title: '動的IPアドレスの切り替わりやDNSの問題',
        description:
          '回線のIPアドレスが不安定な場合や、DNSキャッシュが古い場合に経路が正しく解決できないことがあります。',
        actions: [
          'コマンドプロンプトを管理者として開く',
          'ipconfig /flushdns と入力してDNSキャッシュを消去する',
          'チャンネル管理権限がある場合だけ、チャンネルの編集→概要→リージョンオーバーライドで別地域を試す。権限がなければ管理者に依頼し、比較後に元へ戻す',
        ],
      },
    ],
    ifNotFixed:
      'すべて試しても改善しない場合、契約している回線・ルーターの仕様でUDP通信が制限されている可能性があります。ルーターの詳細設定（ポート制限やファイアウォール機能）を確認するか、別のネットワーク環境で同じ症状が出るかを確認してください。あわせてDiscord Statusで障害情報がないか確認してください。',
    faqs: [
      {
        question: 'No RouteとRTC接続中は同じ問題ですか？',
        answer:
          'どちらも接続確立の途中で止まる症状で、原因が重なることも多いです。No Routeは通信経路そのものが見つからない場合に表示され、VPNやルーターなどネットワーク側の要因が中心になります。',
      },
      {
        question: 'スマートフォンのテザリングでは接続できます',
        answer:
          '自宅回線やルーター側にUDP通信を制限する設定がある可能性が高いです。ルーターのファイアウォールやQoS設定を見直してください。',
      },
    ],
    sources: [errorCodesGuide, discordStatus],
    related: ['rtc-connecting', 'loading-stuck', 'mic-not-working'],
    checkedAt: '2026-09-23',
    status: 'verified',
  },
  {
    slug: 'screen-share-not-working',
    category: 'screen',
    title: 'Discordで画面共有できない・相手に映らない時の直し方【PC版】',
    shortTitle: '画面共有できない',
    seoTitle: 'Discordで画面共有できない・相手に映らない時の直し方【PC】',
    metaDescription:
      'Discordで画面共有が始まらない・相手に映らない原因を、開始前／共有対象／視聴者側に分けて診断。画面とアプリの比較、動画権限、プレビューと黒画面の違いを解説。',
    symptom:
      '画面共有のボタンを押せない、開始しても相手に配信が見えない、特定のゲームだけ黒く映る。失敗する地点を確かめ、配信者側と視聴者側を順番に比べます。',
    target: 'Windows版 Discordデスクトップアプリ',
    conclusion:
      'まず「配信開始前に止まる」のか「Go Liveは始まるが映らない」のかを確認します。開始できなければ通話とサーバーの動画権限を、開始できたら視聴者に「配信を見る」を押してもらい、通常アプリとゲーム、アプリ単体と画面全体を比べてください。',
    quickFixes: [
      '通話に入って「画面を共有」→対象を選ぶ→「配信開始（Go Live）」まで進めるか確認する',
      '配信が始まったら相手にボイスチャンネルの自分の名前から「配信を見る」を選んでもらい、実際の映像を確認する',
      '全員に黒く映る場合は、普通のアプリのウィンドウとゲーム、アプリ単体と画面全体を一つずつ切り替えて比べる',
    ],
    diagnosis: [
      {
        symptom: '共有ボタンがない・押せない／Go Liveが始まらない',
        check: 'DM通話では開始できるか。同じサーバーの別チャンネルではどうか',
        causeIndex: 1,
      },
      {
        symptom: '配信は始まるが、相手に表示されない',
        check:
          '相手は「配信を見る」を押したか。配信一覧の小さなプレビューだけを見ていないか',
        causeIndex: 2,
      },
      {
        symptom: '配信者の小窓だけ止まる',
        check:
          'ゲームを前面にしている時だけ止まるか。相手の実際の視聴画面も止まるか',
        causeIndex: 2,
      },
      {
        symptom: 'ゲームだけ黒い・選択一覧に出ない',
        check: 'メモ帳など別のウィンドウ、画面全体では映るか',
        causeIndex: 3,
      },
      {
        symptom: '一人だけ黒い・見られない',
        check: '同じ通話にいる別の人は同じ配信を視聴できるか',
        causeIndex: 4,
      },
      {
        symptom: '複数人に、通常アプリも画面全体も黒い',
        check: '共有対象を変えても続くか。Discord再起動後も同じか',
        causeIndex: 5,
      },
    ],
    causes: [
      {
        title: '共有を始められない：通話への参加と「動画」権限を調べる',
        description:
          'サーバーのボイスチャンネルで配信するには「動画」権限が必要です。DM通話では始められるのに特定チャンネルでは始められない場合、権限の違いを確かめます。',
        actions: [
          'サーバーなら対象ボイスチャンネルに参加する。DMなら先に通話を開始し、「画面を共有」から対象を選んで「配信開始（Go Live）」まで進む',
          'サーバーでだけ押せない・開始できない時は、管理者に「サーバー設定→ロール」と「ボイスチャンネルを右クリック→チャンネルの編集→権限」の「動画」を確認してもらう。自分にない管理権限は変更しない',
          'DM通話では始められるか、権限の異なる別チャンネルではどうかを比べる。どこでも始まらない場合はDiscordを完全終了して開き直し、Discord Statusも確認する',
        ],
        note: 'ボタンを押せても「配信開始」直後に止まる場合は、止まった場所とエラー文を控えてください。ボタンの有無だけで権限が原因とは断定できません。',
      },
      {
        title: '配信中なのに見えない：視聴画面とプレビューを区別する',
        description:
          'サーバー一覧の小さなプレビューを隠す設定があります。また、配信者の小窓はゲームが前面にある間、自動的に一時停止することがあります。相手の実際の視聴画面で判定します。',
        actions: [
          '配信者は「Go Live」表示が続いているかを見る。視聴者は同じボイスチャンネルに入り、配信者の名前→「配信を見る」を選ぶ',
          '一覧のプレビューが空でも、実際の視聴画面が映れば共有は正常。配信開始時の「配信プレビューを隠す」やユーザー設定のプレビュー設定を確認する',
          '配信者の小窓だけがゲーム操作中に止まる場合は、視聴者の映像も止まるか尋ねる。視聴者には映っていれば小窓を理由にGPU設定を変えない',
          '視聴画面が黒い、または止まるなら次の手順で共有対象を比較する',
        ],
      },
      {
        title: '特定アプリだけ映らない：アプリ単体と画面全体を比べる',
        description:
          '共有対象を取り違えているか、ゲームの表示方式が原因の可能性があります。配信者と視聴者が同じ順序で、見える対象と見えない対象を記録します。',
        actions: [
          'メモ帳など個人情報が映らない普通のアプリを開き、そのアプリのウィンドウを選んで共有する。相手に文字を入力する様子が映るか確認する',
          'メモ帳が映るならゲームを起動し、共有するアプリの一覧からそのゲームを選ぶ。一覧に出なければゲームをウィンドウ／ボーダーレス表示に変更して選び直す',
          'ゲームだけ黒い場合は共有を止め、「画面」側から対象ディスプレイを選んで比較する。映るならアプリ単体の取得方法が原因候補。画面全体には通知や個人情報も映るので共有前に隠す',
          '途中で別ウィンドウへ切り替えた場合は配信中の「ウィンドウを変更」から対象を選び直す。どちらの方法でも黒い場合は手順5へ進む',
        ],
      },
      {
        title: '一人だけ見えない：二人目の視聴者で切り分ける',
        description:
          '配信は続いているのに一人だけ見られない場合、配信者の画面取得と、その人の視聴環境を分けて確認します。',
        actions: [
          '同じボイスチャンネルにもう一人参加してもらい、二人とも配信者の名前→「配信を見る」から同じ配信を開く',
          '二人目に映るなら一人目は配信を閉じて同じチャンネルに入り直す。別のボイスチャンネルへ移動すると配信から外れるので、戻って視聴を選び直す',
          '二人とも同じ対象で黒いなら、視聴者だけの設定変更を続けず手順3で共有対象を、手順5で配信者側の描画設定を比較する',
        ],
      },
      {
        title: '通常アプリも全員に黒い：描画設定と通信を一つずつ比較する',
        description:
          '対象アプリ・画面全体の両方が複数の視聴者に黒く映る場合に、Discordの映像処理や通信を確認します。',
        actions: [
          'Discordと共有対象を完全終了して起動し直し、同じメモ帳ウィンドウを同じ相手に共有して、再現するか確認する',
          '続く場合はDiscordの歯車→「音声・ビデオ」→「ビデオ」の「ハードウェアアクセラレーション」を一度オフにし、Discordを再起動して同じ対象で比較する。変化がなければ元へ戻す',
          '配信は見えるが頻繁に固まる場合は配信中の小窓の歯車→配信品質から解像度またはフレームレートを一段下げ、同じ相手に確認する',
          '全員に黒い状態が続くならWindowsとGPUメーカーのドライバー更新を確認し、エラー文・共有対象・相手の人数・試した結果を控えてDiscord公式サポートへ伝える',
        ],
        note: '公式の「ハードウェアアクセラレーション」は「音声・ビデオ」の「ビデオ」内です。表示されない実験的なキャプチャ項目を探す必要はありません。',
      },
    ],
    ifNotFixed:
      'Discord公式サポートへは、①Go Liveまで進めるか、②通常アプリ／ゲーム／画面全体での違い、③何人の視聴者に黒く見えるか、④Discord Statusと再起動の結果、⑤エラー文をまとめて伝えると状況が伝わります。映像は映るが音だけ聞こえない場合は、下の「配信に音が入らない」記事を確認してください。',
    faqs: [
      {
        question:
          '共有中の小窓に「一時停止」と表示されます。相手にも映っていませんか？',
        answer:
          'ゲームが前面にあると配信者の小窓は自動で一時停止することがあります。まず相手に「配信を見る」から開いた映像が動いているか確認してもらってください。小窓だけでは不具合と判断できません。',
      },
      {
        question: '配信一覧のプレビューが黒いのに、相手は映像を見られます',
        answer:
          'プレビューだけが隠されている可能性があります。Discordは配信一覧のプレビュー表示をオフにできます。相手が「配信を見る」で開いた実際の映像が正常なら、そのまま共有できます。',
      },
      {
        question: 'DMでは画面共有できるのに、サーバーでは開始できません',
        answer:
          'サーバー側の「動画」権限が関係する可能性があります。管理者にロールと対象ボイスチャンネルの権限を確認してもらってください。DMでの成功だけでは、サーバー側に障害があるとは判断できません。',
      },
    ],
    sources: [
      support(
        '360040816151-Go-Live-and-Screen-Share',
        'Go Liveと画面共有・動画権限・視聴方法（英語）',
      ),
      support(
        '360045138471-Discord-Voice-and-Video-Troubleshooting-Guide',
        '音声・映像・画面共有のトラブルシューティング（英語）',
      ),
      streamingGuide,
      discordStatus,
    ],
    related: [
      'screen-share-black-screen',
      'stream-no-audio',
      'stream-stuttering',
    ],
    checkedAt: '2026-09-27',
    status: 'verified',
    ogTitle: 'Discordの画面共有、どこで止まる？',
    ogSteps: [
      '配信開始できるか確認',
      '相手が配信を開けるか',
      'アプリと画面全体を比較',
      '一人だけか全員かを確認',
    ],
  },
  {
    slug: 'stream-no-audio',
    category: 'screen',
    title: 'Discord配信でゲーム音が入らない・相手に聞こえない時の直し方',
    shortTitle: '配信でゲーム音が入らない',
    seoTitle: 'Discord配信でゲーム音が入らない時の直し方｜視聴者側も確認',
    metaDescription:
      'Discord配信でゲーム音が相手に聞こえないときは、全員か一人だけかを確認。共有するアプリ、配信者のWindows音量ミキサー、視聴者の配信音量を分けて解決します。音声共有の項目がない場合も案内。',
    symptom:
      '映像や自分の声は届くのに、ゲームの音だけ相手に聞こえない。まず同じ配信を2人に開いてもらい、全員が無音か1人だけ無音かを比べます。原因が違うので、設定を変える人も変わります。',
    target: '配信者：Windows版Discordデスクトップアプリ／視聴者：Discord',
    conclusion:
      '配信者もゲーム音が聞こえなければWindowsの音量ミキサーへ。配信者には聞こえるのに全員が無音なら、共有対象をゲームのアプリに選び直して比較。1人だけ無音なら、その視聴者が配信のミュートと音量を確認します。',
    quickFixes: [
      '配信者がゲーム音を聞けるか、同じ配信を見ている2人には聞こえるか比べる',
      '全員が無音なら、ゲームを起動したまま「アプリケーション」からそのウィンドウを選び直す',
      '1人だけ無音なら、視聴者が配信画面を右クリックし、ミュートと配信の音量を確認する',
    ],
    diagnosisTitle: '誰に聞こえない？ 共有方法・配信者・視聴者の確認表',
    diagnosisIntro:
      '同じ場面でゲーム音を鳴らし、配信者本人と視聴者2人に聞こえるか確かめてください。マイクの声と配信のゲーム音は分けて判定します。',
    diagnosis: [
      {
        symptom: '配信者本人もゲーム音が聞こえない',
        check:
          'ゲーム中にWindowsの音量ミキサーを開き、ゲームのミュート・出力先を確認',
        causeIndex: 1,
      },
      {
        symptom: '配信者には聞こえるが、視聴者全員は無音',
        check:
          '「画面全体」とゲームの「アプリケーション」を1回ずつ共有して比べる',
        causeIndex: 2,
      },
      {
        symptom: '「音声を共有」が見つからない',
        check:
          'Windows版デスクトップアプリか確認。項目がない場合もゲームのウィンドウを選んで比較',
        causeIndex: 2,
      },
      {
        symptom: '同じ配信で1人だけゲーム音が聞こえない',
        check: 'その人の配信画面のミュート・配信音量・Discordの出力先を確認',
        causeIndex: 3,
      },
      {
        symptom: '別のアプリの音は届くが、このゲームだけ無音',
        check:
          'ゲーム内音量とWindowsのゲーム別出力先、共有するウィンドウを照合',
        causeIndex: 4,
      },
    ],
    causes: [
      {
        title: '配信者側：ゲームの音量と出力先を確認する',
        description:
          '配信者本人にもゲーム音が聞こえないなら、共有設定を変える前にゲーム側の音を出します。Windowsではアプリごとにミュートや出力先を設定できます。',
        actions: [
          'ゲームで音が出る場面を再生し、配信者自身のヘッドホンやスピーカーで聞こえるか確認する',
          'Windows 11の「スタート」→「設定」→「システム」→「サウンド」→「音量ミキサー」を開く',
          '「アプリ」のゲームがミュートなら解除し、音量を上げる。見当たらない場合はゲームで音を再生したまま一覧を見直す',
          'ゲームの「出力デバイス」が聞いているヘッドホンなどと違えば正しい機器を選び、本人に聞こえる状態にしてから配信で再確認する',
        ],
        note: 'ゲーム音が本人に聞こえても、Discordが必ず取得できているとは限りません。全員に届かなければ次の共有方法を比較します。',
      },
      {
        title: '共有方法：ゲームのアプリと画面全体を比べる',
        description:
          '配信者はゲーム音を聞けるのに全員に届かない場合は、共有している対象と音声の取得を比べます。画面全体が必ず無音になるわけではありません。',
        actions: [
          'ゲームを起動したまま共有を停止し、Discordの画面共有アイコンから対象の選択画面を開く',
          '共有対象にゲームの「アプリケーション」ウィンドウがあればそれを選んで配信し、視聴者に同じ場面の音を確認してもらう',
          'まだ無音なら一度止めて「画面」から画面全体を選び、同じゲーム場面を比較する。片方だけ届けば届いた方法を使う',
          '開始画面に「音声を共有」などの項目が表示される場合だけオンを確認する。見当たらなくても探し続けず、共有対象と利用環境を確認する',
        ],
        note: 'Discord公式によると音声取得に対応するのはWindows/macOSのデスクトップ版、Chrome、モバイル版です。LinuxやChrome以外のブラウザはアプリ音声を共有できません。対象のWindowsアプリを選べない場合は、ゲームを起動し直してから選択画面を再確認します。',
      },
      {
        title: '視聴者側：配信のミュート・配信音量を確認する',
        description:
          '同じ配信を見ている別の人には聞こえる場合、その視聴者の配信ごとの音量設定や出力先を先に見ます。ボイスチャンネルに入るだけでは配信の視聴開始になりません。',
        actions: [
          '視聴者が配信者の名前を選んで配信を開き、映像が動いていることを確認する',
          '配信の映像を右クリックし、「ミュート」が有効なら解除。「配信の音量」のスライダーを上げる。表示される場合は映像上の音量アイコンも確認する',
          'まだ聞こえなければ、視聴者のDiscord「ユーザー設定」→「音声・ビデオ」で出力デバイスを確認する',
          '視聴者のWindows「設定」→「システム」→「サウンド」→「音量ミキサー」でDiscordがミュートされていないか確認し、再び同じ配信を開いて聞き比べる',
        ],
        note: '2人とも同じ配信が無音なら、個々の視聴者設定より共有方法と配信者の出力を先に確認します。',
      },
      {
        title: '特定のゲームだけ無音：ゲーム内設定と共有対象を照合する',
        description:
          '別のアプリの音が同じ視聴者に届くなら、このゲームの音量・出力先・共有対象を個別に比べます。',
        actions: [
          'ゲーム内の「サウンド」や「オーディオ」でマスター音量と出力先を確認し、ゲーム内で音の出る場面を再生する',
          '配信者のWindows音量ミキサーで、このゲームだけミュート・別の出力デバイスになっていないか確認する',
          'Discordで共有中のアプリ名が実際に音を出しているゲームのウィンドウか照合する。起動ランチャーや別アプリを選んでいた場合は選び直す',
          '同じ視聴者に他のアプリとこのゲームを順番に見てもらい、他は聞こえてこのゲームだけ無音か記録する',
        ],
      },
    ],
    ifNotFixed:
      '配信者には聞こえ、共有方法を切り替えても全員に届かない場合はDiscordを再起動し、ゲームを起動してから共有を試してください。ゲームのウィンドウが選べない場合は「ユーザー設定」→「登録済みのゲーム」で対象ゲームの登録状況を確認します。改善しなければ、Discordのバージョン、共有した対象、ゲーム名、全員か1人だけか、マイクとゲーム音のどちらが届くかを記録してDiscordサポートに相談できます。',
    faqs: [
      {
        question: '「音声を共有」が表示されない場合、どこを直せばいい？',
        answer:
          '表示されない項目を探し続ける必要はありません。Windows版Discordデスクトップアプリでゲームのアプリウィンドウを共有し、視聴者に音が届くか試します。画面全体との差も比較してください。LinuxとChrome以外のブラウザではアプリ音声共有に対応していません。',
      },
      {
        question: 'マイクの声は聞こえるのにゲーム音だけ無音なのはなぜ？',
        answer:
          'マイク通話とゲームの配信音声は確認する場所が異なります。マイクが聞こえてもゲーム音の共有成功は保証されません。配信者自身に音があるか、視聴者全員か1人だけかを判定し、上の表の該当手順を進めてください。',
      },
      {
        question: '画面全体の共有では必ずゲーム音が消えますか？',
        answer:
          '必ず消えるわけではありません。Discordはアプリのウィンドウと画面全体の共有を案内しています。ゲームを起動したまま両方を同じ視聴者に試してもらい、実際に音が届く方法を選んでください。',
      },
    ],
    sources: [
      {
        label:
          'Discord公式：Go Liveと画面共有（共有方法・音声対応・視聴者の音量）',
        url: 'https://support.discord.com/hc/ja/articles/360040816151-Go-Live%E3%81%A8%E7%94%BB%E9%9D%A2%E5%85%B1%E6%9C%89',
      },
      {
        label:
          'Microsoft公式：Windowsでアプリの音が出ない場合の音量ミキサー・出力先',
        url: 'https://support.microsoft.com/ja-jp/windows/hardware/audio/fix-app-audio-not-working-while-system-sounds-work-in-windows',
      },
      streamingGuide,
    ],
    related: ['screen-share-not-working', 'error-1001', 'error-1002'],
    checkedAt: '2026-09-27',
    status: 'verified',
    ogTitle: 'Discord配信、ゲーム音が聞こえない？',
    ogSteps: [
      '配信者本人には聞こえる？',
      'ゲームの画面を共有し直す',
      '視聴者の配信音量を確認',
      '2人で同じ配信を比較',
    ],
  },
  {
    slug: 'loading-stuck',
    category: 'launch',
    title: 'Discordが読み込み中から進まないときの直し方【ロゴ・灰色画面】',
    shortTitle: '読み込み中から進まない',
    seoTitle: 'Discordが読み込み中から進まない原因と直し方【ロゴ・灰色画面】',
    metaDescription:
      'Discordのロゴや灰色画面から進まないときは、同じPCのブラウザ版でチャットが開くか先に比較。結果別に接続・常駐プロセス・キャッシュを確認するWindows向け手順です。',
    symptom:
      'Discordのロゴや回転するアイコンで止まる、または灰色の画面だけが表示される。ログイン後もサーバー・チャットの一覧が出ない場合を含めて切り分けます。',
    target: 'Windows版 Discordデスクトップアプリ',
    conclusion:
      '最初に同じPC・同じ回線でDiscordのブラウザ版を開き、同じアカウントのチャット一覧まで表示されるか比較します。ブラウザ版だけ動くならアプリを完全終了して再起動、それでも止まる場合に限ってアプリのキャッシュを退避。両方止まるなら障害情報と接続環境を先に確認します。',
    quickFixes: [
      '同じPCのブラウザで discord.com/app にアクセスし、同じアカウントでチャット一覧まで開けるか試す',
      'ブラウザ版が動く場合：Discordを完全終了してアプリを起動し直す',
      'ブラウザ版も止まる場合：Discord Statusを確認し、別サイト・別回線でも接続を比較する',
    ],
    diagnosisTitle: 'ロゴ・灰色画面で止まるときの結果別チェック表',
    diagnosisIntro:
      '画面の色だけでは原因を決められません。まず同じPC・同じ回線のブラウザ版で「ログイン画面が出た」ではなく「チャット一覧が開いた」かを比べてください。',
    diagnosis: [
      {
        symptom: 'ロゴで停止／ブラウザ版は開く',
        check: 'アプリを完全終了して起動し直すと進む？',
        causeIndex: 2,
      },
      {
        symptom: '灰色画面で停止／ブラウザ版は開く',
        check: 'アプリを完全終了しても灰色のまま？',
        causeIndex: 2,
      },
      {
        symptom: '再起動してもアプリだけ停止',
        check: 'Cacheフォルダーの退避後に改善する？',
        causeIndex: 4,
      },
      {
        symptom: 'アプリもブラウザ版も開かない',
        check: '障害情報・別サイト・別回線を確認',
        causeIndex: 3,
      },
      {
        symptom: 'アプリは動く／ブラウザ版だけ停止',
        check: 'プライベートウィンドウか別ブラウザでは開く？',
        causeIndex: 1,
      },
      {
        symptom: 'Update Failed・破損のエラー表示',
        check: '文言を控えて専用の手順へ',
        causeIndex: 5,
      },
    ],
    causes: [
      {
        title: 'まずブラウザ版と同じアカウントで比較する',
        description:
          'ブラウザ版でチャットが開けば、その時点で同じ回線からDiscordを利用できます。ただしアプリだけが止まる理由は、この比較だけでは確定しません。',
        actions: [
          '止まっているPCのブラウザで https://discord.com/app を開き、可能ならデスクトップ版と同じアカウントでログインする',
          'サーバーやチャット一覧が表示され、実際に会話を開けるか確認する。ログイン画面が出ただけでは比較完了としない',
          'ブラウザ版が動きアプリだけ止まる場合は手順2へ。両方止まる場合は手順3へ進む',
          'アプリだけ動きブラウザ版が止まる場合は、プライベートウィンドウや別ブラウザで比較する。ブラウザの拡張機能や保存済みデータを確認する',
        ],
        note: 'ログインできずブラウザ版の会話画面を確認できない場合は判定保留です。画面の色だけから原因を決めないでください。',
      },
      {
        title: 'ブラウザ版は開く：Discordアプリを完全終了する',
        description:
          'ロゴでも灰色画面でも、アプリのプロセスが残っていれば再起動だけで改善する場合があります。画面の色にかかわらず最初に試します。',
        actions: [
          '画面右下の通知領域（隠れている場合は「∧」）でDiscordアイコンを右クリックし「Discordを終了」を選ぶ',
          'Ctrl＋Shift＋Escでタスクマネージャーを開き、「プロセス」で残っているDiscordを選んで「タスクの終了」を押す',
          'Discordを起動し直し、チャット一覧まで進むか確認する。直ればここで終了する',
          'まだ止まる場合はPCを再起動してもう一度試し、それでもアプリだけ止まるなら手順4へ進む',
        ],
      },
      {
        title: 'ブラウザ版も止まる：障害情報と接続を確認する',
        description:
          '両方でチャットが開けない場合、アプリのキャッシュだけを消しても原因を絞れません。公式の障害状況とPCの接続条件を比較します。',
        actions: [
          'discordstatus.com で障害が報告されていれば復旧を待つ。報告がなくても障害がないと断定せず、次を比較する',
          '同じブラウザで別サイトを開けるか確認する。別サイトも開けなければWi-Fiとルーター、PCの回線接続を確認する',
          '可能ならスマートフォンのテザリングなど別回線で、同じPCのブラウザ版を試す。別回線だけ動くなら元の回線・ルーター・ネットワーク制限を確認する',
          '別サイトは動きDiscordだけ止まる場合は、Windowsの「設定 → 時刻と言語 → 日付と時刻」で時刻を自動設定にし、VPN・プロキシ・ファイアウォールによるDiscordへの接続制限を確認する',
        ],
        note: '会社・学校のネットワークでは管理者の制限がある場合があります。セキュリティ機能を無効化したまま使わず、管理者に確認してください。',
      },
      {
        title: 'アプリだけ止まる：キャッシュを退避して比較する',
        description:
          'ブラウザ版は動くのにアプリの完全終了・PC再起動でも止まる場合に、Discord公式が案内するCacheの対処を試します。先にフォルダー名を変えれば元に戻せます。',
        actions: [
          '手順2の方法でDiscordを完全終了し、タスクマネージャーにDiscordが残っていないことを確かめる',
          'Windows＋Rを押し「%APPDATA%\\discord」と入力して開く',
          '中の「Cache」フォルダーを「Cache_before_loading_fix」に名前変更する。Cacheが見当たらなければ無理に別のフォルダーを消さない',
          'Discordを起動してチャット一覧まで表示されるか確認する。直らなければ、再びアプリを終了し、新しくできたCacheを削除して退避したフォルダー名をCacheに戻せる',
        ],
        note: 'Cacheの外にある設定やデータをまとめて削除する操作ではありません。変更前にパスと退避名を控えてください。',
      },
      {
        title: '更新・破損エラーが表示された場合は専用の対処へ',
        description:
          '「Update Failed」やインストール破損の表示がある場合、単なる読み込み停止とは確認先が異なります。表示された文字列を手掛かりにします。',
        actions: [
          '画面に表示されたエラーの文言と発生時刻を控える',
          '「Update Failed」なら関連する「Discordのアップデートが終わらない」の記事で更新処理を確認する',
          'インストール破損が明示される場合は、Discord公式の破損インストール向け手順を確認してから再インストールする。設定フォルダー全体の削除はキャッシュ退避とは別の操作なので、案内を読んでから行う',
        ],
      },
    ],
    ifNotFixed:
      'ブラウザ版とアプリ版の両方で止まり、別回線でも同じなら、障害情報とログイン時のエラー表示を控えてください。ブラウザ版は動き、完全終了・キャッシュ退避後もアプリだけ止まるなら、Windowsの版、Discordのエラー文言、試した手順と各結果をまとめ、関連する「Discordが起動しない」も確認してください。',
    faqs: [
      {
        question: 'ロゴ画面と灰色画面で直し方は変わりますか？',
        answer:
          '画面の色だけでは原因を確定できません。どちらも同じPCのブラウザ版でチャットまで開けるかを先に比べ、ブラウザ版だけ動くならアプリの完全終了、両方止まるなら障害・接続確認へ進みます。',
      },
      {
        question: 'ブラウザ版でログイン画面が出れば、アプリ側が原因ですか？',
        answer:
          'いいえ。サーバー・チャット一覧まで開けて初めて接続の比較になります。ログインできない場合はアカウントの問題もあり得るため、表示されたエラーを控え、公式障害情報も確認してください。',
      },
      {
        question: 'キャッシュを消すとサーバーやメッセージも消えますか？',
        answer:
          'ここで操作するのはWindowsのDiscordアプリ内のCacheフォルダーです。サーバーやメッセージの削除操作ではありません。退避したフォルダーは動作確認が終わるまで残し、アプリの設定フォルダー全体と取り違えないでください。',
      },
    ],
    sources: [
      generalTroubleshooting,
      support(
        '115001130052-Stuck-on-the-Main-Connecting-Screen',
        '接続画面で止まる場合（英語）',
      ),
      {
        label: 'Discord公式サポート：破損したインストールの対処',
        url: 'https://support.discord.com/hc/ja/articles/115004307527',
      },
      discordStatus,
    ],
    related: [
      'update-failed',
      'installation-failed',
      'login-error',
      'not-opening',
    ],
    checkedAt: '2026-09-27',
    status: 'verified',
    ogTitle: 'Discordの読み込みが終わらない？',
    ogSteps: [
      '先にブラウザ版でチャットを確認',
      'アプリだけ停止 → 完全終了',
      '両方停止 → 障害・回線を確認',
      'アプリだけ続く → Cacheを退避',
    ],
  },
];

export const discordArticles: DiscordArticle[] = [
  ...existingDiscordArticles,
  ...discordP0Articles,
  ...discordGrowthArticles,
  ...discordStreamingGrowthArticles,
  ...discordAudioGrowthArticles,
  ...discordBotArticles,
  ...discordCompatibilityArticles,
];

for (const article of discordArticles) {
  if (['rtc-connecting', 'no-route'].includes(article.slug)) {
    article.related = ['voice-client-outdated', ...article.related];
  }
}

export const discordArticleBySlug = (slug: string) =>
  discordArticles.find((item) => item.slug === slug);
