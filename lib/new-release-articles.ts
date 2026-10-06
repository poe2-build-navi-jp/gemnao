import type { GameArticle } from '@/lib/game-articles';

// WARDOGS（PC版・Steam早期アクセス）の個別記事。
// 2026-09-27に開発元Bulkheadの公式告知（Steamニュース）、Steamストア、
// PCGamingWiki、報道（PC Gamer・PCGamesN）で確認した内容だけを載せています。
// STEPのidは解決報告（D1）の集計キーなので、既存のidは変更しないでください。
const sources = {
  steamNews: {
    label:
      'Steamニュース（公式）：Launch Stability Hotfix #1、SCHEDULED MAINTENANCE & PATCH 0.11',
    url: 'https://store.steampowered.com/news/app/1867240',
  },
  steam: {
    label: 'Steamストア：WARDOGS（動作環境・対応言語）',
    url: 'https://store.steampowered.com/app/1867240/WARDOGS/',
  },
  pcgamer: {
    label: 'PC Gamer：発売日のサーバー障害と開発元のコメント（英語）',
    url: 'https://www.pcgamer.com/games/fps/wardogs-servers-go-down-as-over-300-000-people-rush-to-play-on-launch-day/',
  },
  familySharing: {
    label: 'PCGamesN：Steamファミリーシェアリングの無効化（英語）',
    url: 'https://www.pcgamesn.com/wardogs/steam-family-sharing-disabled',
  },
  pcgw: {
    label: 'PCGamingWiki：WARDOGS（常時オンライン・アンチチート・設定）',
    url: 'https://www.pcgamingwiki.com/wiki/Wardogs',
  },
};

export const newReleaseArticles: GameArticle[] = [
  {
    gameSlug: 'wardogs',
    slug: 'server-connection',
    category: 'server',
    title:
      'WARDOGSがサーバーに接続できない・ログイン待ちが終わらない時の対処法【PC版】',
    shortTitle: 'サーバー接続・ログイン待ち',
    symptom:
      'ログイン待ち（待機列）が進まない、サーバーに入れない、試合中に切断される、サーバー一覧に目的のサーバーが出ない、家族のアカウントで遊べなくなった場合の確認手順です。',
    conclusion:
      'WARDOGSは常時オンライン接続が必要なゲームです。接続できない時は、まず公式のお知らせで障害・メンテナンスを確認します。通常の混雑時はログイン待ちの列を抜けずに待つのが基本ですが、公式が更新・再起動を案内している場合はその手順を優先します。開発元のCEOも「列を抜けずに待つように」と呼びかけていました。Steamファミリーシェアリングは2026年9月18日から使えなくなっています。',
    description:
      '接続の問題は、自分のPCではなく運営側の混雑・障害が原因のことが多くあります。自分の設定をいじる前に、運営側の状況を確認するのが近道です。',
    checkedAt: '2026-09-27',
    status: 'verified',
    targetVersion: 'Steam版（早期アクセス）・2026年9月27日時点',
    causes: [
      'アクセス集中によるログイン待ち・サーバー障害（発売日には一時的にサーバーが停止）',
      'クライアントの更新が適用されていない',
      'サーバーブラウザの表示条件（公式サーバーとコミュニティサーバーが別のタブに分かれた）',
      'Steamファミリーシェアリングで遊んでいる（2026年9月18日に無効化）',
    ],
    quickFacts: [
      { label: 'インターネット接続', value: '常時必須（PCGamingWiki）' },
      {
        label: 'ログイン待ちの時',
        value: '通常は列を抜けずに待つ。公式の更新・再起動指示がある場合は優先',
      },
      {
        label: 'ファミリーシェアリング',
        value:
          '2026年9月18日から利用不可（BAN回避への対策）。自分のアカウントでの購入が必要',
      },
      {
        label: '最低動作環境',
        value:
          'Windows 10／GTX 1660・RX 590／メモリ16GB（1080p・低・アップスケールで60fps）',
      },
      {
        label: '次の大型更新',
        value: 'シーズン2：2026年10月15日（公式告知）',
      },
    ],
    diagnosis: [
      {
        symptom: 'ログイン待ちの列が進まない',
        cause: 'アクセスの集中',
        stepId: 'step-2',
      },
      {
        symptom: 'エラーが出てまったく入れない',
        cause: 'サーバー障害・メンテナンス',
        stepId: 'step-1',
      },
      {
        symptom: '更新の案内の後から入れない',
        cause: 'クライアントの更新が未適用',
        stepId: 'step-3',
      },
      {
        symptom: 'サーバー一覧に目的のサーバーが出ない',
        cause: '公式・コミュニティのタブ、表示条件',
        stepId: 'step-5',
      },
      {
        symptom: '家族のアカウントの購入で遊んでいた',
        cause: 'ファミリーシェアリングの無効化',
        stepId: 'step-6',
      },
      {
        symptom: '他のオンラインゲームにもつながらない',
        cause: '自宅のネットワーク',
        stepId: 'step-4',
      },
    ],
    symptoms: [
      { label: '公式のお知らせを確認する', target: 'step-1' },
      { label: 'ログイン待ちの列を抜けずに待つ', target: 'step-2' },
      { label: '更新を適用して再起動する', target: 'step-3' },
      { label: 'ゲームファイルとネットワークを確認する', target: 'step-4' },
      { label: 'サーバーブラウザの表示を見直す', target: 'step-5' },
      {
        label: 'ファミリーシェアリングで遊んでいないか確認する',
        target: 'step-6',
      },
    ],
    steps: [
      {
        id: 'step-1',
        title: '公式のお知らせで障害・メンテナンスを確認する',
        summary:
          '運営側の障害やメンテナンス中は、自分のPCで何をしても接続できません。',
        time: '約2分',
        risk: 'low',
        actions: [
          'エラーの文章と発生した時刻を控える',
          'SteamのWARDOGSのページで「ニュース」を開き、障害やメンテナンスのお知らせを確認する',
          'メンテナンスは各地域の時刻付きで告知される（例：2026年9月14日は日本時間17時から約1時間）',
        ],
      },
      {
        id: 'step-2',
        title: 'ログイン待ちの列は抜けずに待つ',
        summary:
          '発売日の混雑時、開発元のCEOは「列を抜けず、そのまま待つように」と呼びかけていました。',
        time: '混雑状況による',
        risk: 'low',
        actions: [
          '通常の混雑で待機列が表示されている間は、キャンセルや再接続を繰り返さない。公式から更新・再起動の案内が出ている場合は、手順3を優先する',
          '障害のお知らせが出ている間は、再インストールやルーターの設定変更をしない',
          '発売日の長い列について、開発元のCEOはValve側の接続数の制限も一因だとの見方を示していた',
        ],
      },
      {
        id: 'step-3',
        title: '更新を適用して再起動する',
        summary:
          '発売日には安定化のためのクライアント更新が配信され、ログイン中のプレイヤーは一度ゲームを閉じて更新する必要がありました。',
        time: '約5分',
        risk: 'low',
        actions: [
          'ゲームを終了し、Steamのダウンロード画面で更新を適用する',
          '更新後にゲームを起動すると、ログイン待ちの列に戻る場合がある（順番に入場させる仕組み）',
          '復旧後も入れない場合は、SteamとWindowsを再起動してから接続する',
        ],
        note: 'この更新は、サーバーに入れない・プレイ中に予期せず切断される・ログイン待ちが長い、という問題への対策として配信されました。',
      },
      {
        id: 'step-4',
        title: 'ゲームファイルと自宅のネットワークを確認する',
        summary: '運営側に問題がないのに自分だけ入れない場合に確認します。',
        time: '約10分',
        risk: 'low',
        actions: [
          'Steamのライブラリでゲームを右クリック→「プロパティ」→「インストール済みファイル」→「ゲームファイルの整合性を確認」',
          '他のオンラインゲームやWebサイトにつながるか確認する',
          'つながらない場合はルーターを再起動する。VPNを使っている場合は切って比べる',
        ],
      },
      {
        id: 'step-5',
        title: 'サーバーブラウザの表示を見直す',
        summary:
          'Patch 0.11で、サーバーブラウザが「公式」と「コミュニティ」に分かれました。',
        time: '約3分',
        risk: 'low',
        actions: [
          '公式サーバーとコミュニティサーバーのタブを切り替えて探す',
          '空きのないサーバーや空のサーバーを表示する切り替え（Show Empty/Full）を確認する',
          'コミュニティサーバーは名前で検索でき、サーバーIDでも参加できる（IDは再起動後も変わらない）',
        ],
      },
      {
        id: 'step-6',
        title: 'ファミリーシェアリングで遊んでいないか確認する',
        summary:
          '開発元は、BANの回避に悪用されたとして、2026年9月18日にSteamファミリーシェアリングを無効にしました。',
        time: '約1分',
        risk: 'low',
        actions: [
          '自分のSteamアカウントでWARDOGSを購入しているか、ライブラリで確認する',
          '家族のアカウントの購入で遊んでいた場合は、自分のアカウントで購入する必要がある',
        ],
      },
    ],
    avoid: [
      'ログイン待ちの列を何度も抜けて並び直さない',
      '障害のお知らせが出ている間に、再インストールやルーターの設定変更をしない',
      '経験値やお金を稼ぐための「ファーム」サーバーに長く滞在しない（開発元が追跡し、厳しく対処すると表明）',
    ],
    cautions: [
      '早期アクセス中のため、仕様や告知は頻繁に変わります。最新のお知らせも確認してください。',
    ],
    faqs: [
      {
        question: 'オフラインで遊べますか？',
        answer:
          'PCGamingWikiによると、WARDOGSはすべてのモードで常時インターネット接続が必要です。最大100人のオンライン対戦ゲームのため、オフラインでは遊べません。',
      },
      {
        question: 'ファミリーシェアリングはまた使えるようになりますか？',
        answer:
          '2026年9月27日時点で、開発元は再開の予定を示していません（PCGamesNの報道）。家族と一緒に遊ぶ場合は、それぞれのアカウントでの購入が必要です。',
      },
      {
        question: '試合中に「キックされた」と表示されました。',
        answer:
          'Season 1の変更で、キックされた旨のメッセージは実際にBANされた場合にだけ表示されるようになりました。予期しない切断は、発売日の安定化ホットフィックスでも対策されています。心当たりがない場合は、表示された文章と時刻を控えて運営に問い合わせてください。',
      },
    ],
    sources: [
      sources.steamNews,
      sources.pcgamer,
      sources.familySharing,
      sources.pcgw,
      sources.steam,
    ],
    related: [],
    seoTitle: 'WARDOGSでサーバーに接続できない・ログイン待ちの対処法',
    metaDescription:
      'WARDOGSでサーバーに接続できない・ログイン待ちが進まない時の対処法。公式のお知らせの確認、列を抜けずに待つ理由、更新の適用、公式・コミュニティに分かれたサーバーブラウザ、9月18日に無効化されたファミリーシェアリングまで解説。',
  },
];
