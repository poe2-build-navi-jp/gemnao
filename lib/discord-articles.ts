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
  causes: DiscordCause[];
  ifNotFixed: string;
  faqs: { question: string; answer: string }[];
  sources: { label: string; url: string }[];
  related: string[];
  checkedAt: string;
  status: ContentStatus;
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
    title: 'Discordで画面共有できないときの対処法',
    shortTitle: '画面共有できない',
    seoTitle: 'Discordで画面共有できないときの対処法',
    metaDescription:
      '画面共有を開始できない、共有しても相手に映らない時の対処法です。ウィンドウモードへの切り替え、権限、ハードウェアアクセラレーションを確認します。',
    symptom:
      '通話中に画面共有ボタンを押しても共有が始まらない、共有はできても相手の画面に何も映らない場合の手順です。',
    target: 'Windows版 Discordデスクトップアプリ',
    conclusion:
      '共有したいウィンドウをフルスクリーンではなくウィンドウモードに切り替え、それでも直らない場合はDiscordを管理者として実行し、ハードウェアアクセラレーション設定を確認します。',
    quickFixes: [
      '共有したいアプリやゲームをフルスクリーンからウィンドウモード（または境界のないウィンドウ）に切り替える',
      'Discordを右クリックし「管理者として実行」で起動し直す',
      'Discordを再起動し、ボイスチャンネルに入り直してから共有を開始する',
    ],
    causes: [
      {
        title: '共有対象がフルスクリーン表示で認識されていない',
        description:
          '一部のゲームやアプリは、フルスクリーンのままだと画面共有機能から正しく検出できないことがあります。',
        actions: [
          '共有したいゲーム・アプリの表示設定を「ウィンドウモード」または「境界のないウィンドウ」に変更する',
          '通話画面の共有ボタンから、対象アプリの一覧に表示されるか確認する',
          '個別アプリで映らない場合は「画面」タブから対象のディスプレイを選んで試す',
        ],
      },
      {
        title: 'ハードウェアアクセラレーションや実験的なキャプチャ機能との競合',
        description:
          '環境によっては、画面キャプチャに関する設定がグラフィック機能と競合し、共有できなくなることがあります。',
        actions: [
          'ユーザー設定の「音声・ビデオ」を開く',
          '画面共有に関する項目（ハードウェアアクセラレーション／キャプチャ方式）を一度オフにして共有を試す',
          '改善しない場合はオンに戻し、別の組み合わせで比較する',
          '変更後は必ずDiscordを再起動してから確認する',
        ],
      },
      {
        title: 'GPUドライバーが古い、または権限が不足している',
        description:
          '古いGPUドライバーや、Discordの実行権限不足により画面キャプチャが正しく動作しないことがあります。',
        actions: [
          '使用しているGPUのメーカー公式サイトから最新ドライバーを導入する',
          'Discordを「管理者として実行」で起動し直す',
          'PCを再起動してから、あらためて画面共有を試す',
        ],
      },
    ],
    ifNotFixed:
      'ここまでの手順で直らない場合は、Discordのキャッシュを削除してから再起動してください（手順は「起動しない」の記事を参照）。他の通話相手の環境でも同様に共有できないかを確認すると、自分側かDiscord側かの切り分けに役立ちます。',
    faqs: [
      {
        question: '特定のゲームだけ画面共有できません',
        answer:
          'そのゲームがフルスクリーン専用の描画方式を使っている可能性があります。ゲーム側の設定でウィンドウモードや境界のないウィンドウに変更できないか確認してください。',
      },
      {
        question: 'ブラウザ版Discordでも同じ症状が出ます',
        answer:
          'ブラウザ版は使用しているブラウザの画面共有許可が必要です。ブラウザのアドレスバー付近に表示される共有許可の確認、またはブラウザの設定からDiscordの画面共有権限を確認してください。',
      },
    ],
    sources: [streamingGuide, discordStatus],
    related: ['error-1001', 'stream-no-audio', 'overlay-not-showing'],
    checkedAt: '2026-09-16',
    status: 'verified',
  },
  {
    slug: 'stream-no-audio',
    category: 'screen',
    title: 'Discord配信でゲーム音が入らないときの直し方',
    shortTitle: '配信に音が入らない',
    seoTitle: 'Discord配信でゲーム音が入らないときの直し方',
    metaDescription:
      '画面共有・配信で自分のマイクは届いているのにゲーム音やアプリ音が相手に聞こえない時の対処法です。マイクの問題とは切り分けて確認します。',
    symptom:
      '画面共有や配信中に、自分の声（マイク）は相手に届いているのに、ゲーム音やアプリの音声だけが聞こえないと言われる場合の手順です。マイクが反応しない症状とは原因が異なります。',
    target: 'Windows版 Discordデスクトップアプリ',
    conclusion:
      '共有開始時の「音声を共有」設定を確認し、次に共有範囲を画面全体ではなくアプリ単体に切り替え、最後にWindowsのアプリ別音量設定を確認します。',
    quickFixes: [
      '画面共有を開始する際に「音声を共有」がオンになっているか確認する',
      '画面全体ではなく、対象アプリを個別に選んで共有し直す',
      'Discordを再起動してから、共有をやり直す',
    ],
    causes: [
      {
        title: '共有時に音声の共有がオンになっていない',
        description:
          '画面共有はデフォルトで映像のみのことがあり、音声を一緒に送るには別途オンにする必要があります。',
        actions: [
          '通話画面の共有ボタンを押し、共有対象を選ぶ画面を開く',
          '「音声を共有」のトグルがオンになっているか確認する',
          'オフだった場合はオンにしてから共有を開始する',
        ],
      },
      {
        title:
          '共有範囲が「画面全体」になっていて、アプリの音声を取得できていない',
        description:
          'アプリ単体ではなく画面全体を共有している場合、環境によってはアプリの音声だけが取得できないことがあります。',
        actions: [
          '共有を止めて、共有対象の選択画面を開き直す',
          '「画面」ではなく、対象のゲーム・アプリのウィンドウを個別に選ぶ',
          'ユーザー設定の「音声・ビデオ」にある画面共有の音声取得に関する項目（実験的な取得方式）を切り替えて再度試す',
        ],
      },
      {
        title: 'Windows側のアプリ別音量設定でミュート・出力先違いになっている',
        description:
          'Windowsのボリュームミキサーで対象アプリがミュートになっていたり、別の出力デバイスに割り当てられている場合、Discordが音声を拾えません。',
        actions: [
          'タスクバーのスピーカーアイコンを右クリックし「音量ミキサーを開く」を選ぶ',
          '対象のゲーム・アプリの音量がミュートになっていないか確認する',
          '出力先がDiscordの取得したい機器と同じになっているか確認する',
        ],
      },
    ],
    ifNotFixed:
      'ここまでの手順で直らない場合は、対象のゲームをDiscordの「アクティビティ」またはゲーム検出の一覧に手動で追加し、ゲームとして認識させたうえで共有を試してください。それでも改善しない場合は、視聴側の環境（相手の出力デバイス）が原因の可能性もあるため、別の参加者でも同じ症状が出るか確認してください。',
    faqs: [
      {
        question:
          'マイクの声は聞こえるのに、ゲーム音だけ聞こえません。原因は同じですか？',
        answer:
          'いいえ、別の問題です。マイク音声はマイク入力の設定、ゲーム音は画面共有時の「音声を共有」設定が原因のことが多く、それぞれ別に確認する必要があります。',
      },
      {
        question: 'ブラウザ版でもアプリ音声を共有できますか？',
        answer:
          'ブラウザやOSによって対応状況が異なります。共有時に音声共有のオプションが表示されない場合は、デスクトップアプリでの利用を検討してください。',
      },
    ],
    sources: [streamingGuide],
    related: ['error-1001', 'screen-share-not-working', 'error-1002'],
    checkedAt: '2026-09-16',
    status: 'verified',
  },
  {
    slug: 'loading-stuck',
    category: 'launch',
    title: 'Discordが読み込み中から進まないときの対処法',
    shortTitle: '読み込み中から進まない',
    seoTitle: 'Discordが読み込み中から進まないときの対処法',
    metaDescription:
      'Discord起動後にロゴやグレー画面の読み込み表示から進まない時の対処法です。多重起動プロセスの終了、キャッシュ削除、接続確認を順に行います。',
    symptom:
      'Discordを起動するとロゴやくるくる回るアイコンの読み込み画面が表示されたまま、ログイン画面やチャット画面に進まない場合の手順です。',
    target: 'Windows版 Discordデスクトップアプリ',
    conclusion:
      'タスクマネージャーで常駐しているDiscordのプロセスをすべて終了してから起動し直し、次にインターネット接続、最後にキャッシュを確認します。',
    quickFixes: [
      'タスクマネージャーでDiscordのプロセスをすべて終了してから起動し直す',
      '別のサイトやアプリでインターネットに接続できているか確認する',
      'Discordのキャッシュフォルダーを削除してから起動する',
    ],
    causes: [
      {
        title: '常駐プロセスが競合している、または多重起動している',
        description:
          '前回の終了処理が完了しないまま次の起動が始まると、読み込みが途中で止まることがあります。',
        actions: [
          'Ctrl＋Shift＋Escでタスクマネージャーを開く',
          '「プロセス」タブと「詳細」タブの両方でDiscordに関する項目をすべて終了する',
          'PCを再起動してから、あらためてDiscordを起動する',
        ],
      },
      {
        title: 'インターネット接続、またはDNSの問題',
        description:
          '読み込み画面はDiscordのサーバーへの接続を待っている状態のため、回線やDNSの問題で止まることがあります。',
        actions: [
          'ブラウザで別のサイトが問題なく開けるか確認する',
          'Wi-Fiとルーターを再起動する',
          'コマンドプロンプトを管理者として開き、ipconfig /flushdns を実行する',
          '可能であればスマートフォンのテザリングなど別回線で起動できるか確認する',
        ],
      },
      {
        title: 'キャッシュファイルが壊れている',
        description:
          '更新の失敗や強制終了によってキャッシュが壊れ、読み込みが完了しないことがあります。',
        actions: [
          'Discordを完全に終了する',
          'Windows＋Rで「ファイル名を指定して実行」を開き、%appdata%\\discord\\Cache を入力する',
          'Cacheフォルダーの中身を削除する',
          'Discordを起動し、読み込みが完了するか確認する',
        ],
      },
    ],
    ifNotFixed:
      '改善しない場合は「起動しない」の記事の手順（管理者として実行、再インストール）もあわせて確認してください。特定の時間帯だけ発生する場合は、Discord Statusで大規模障害が発表されていないか確認してください。',
    faqs: [
      {
        question: 'グレー画面とロゴ画面では原因が違いますか？',
        answer:
          'ロゴ画面のまま止まる場合はアプリ自体の読み込み、グレー画面でログイン欄すら出ない場合は接続待ちであることが多いです。どちらもプロセスの終了と接続確認を先に試してください。',
      },
      {
        question: 'ブラウザ版のDiscordも同じ手順で直りますか？',
        answer:
          'ブラウザ版の場合はキャッシュ削除の代わりに、ブラウザの閲覧データ削除とページの強制再読み込み（Ctrl＋F5）を試してください。拡張機能が影響することもあるため、シークレットウィンドウでの動作確認も有効です。',
      },
    ],
    sources: [generalTroubleshooting, discordStatus],
    related: ['login-error', 'slow-performance', 'not-opening'],
    checkedAt: '2026-09-16',
    status: 'verified',
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
