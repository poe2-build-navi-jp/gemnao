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
      '起動後に接続できない時は、現在の公式告知とゲーム版を確認します。通常の混雑時は列を抜ける操作を繰り返さず、公式の更新・再起動指示を優先してください。起動時のWD-L020は補完記事へ。10月15日の0.2.0では地域別ping上限が導入されており、キックが必ずBANとは限りません。',
    description:
      '起動コード、ログイン待ち、特定サーバーからの切断を区別します。発売当時の混雑や10月15日の復旧告知は、現在の障害・正常性を証明するものではありません。',
    checkedAt: '2026-10-22',
    status: 'verified',
    targetVersion: 'Steam版（早期アクセス）・10月22日に更新履歴と接続症状を再確認',
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
          '9月の確認時に無効化を報道。現在の利用資格と所有権を購入前に確認',
      },
      {
        label: '最低動作環境',
        value:
          'Windows 10／GTX 1660・RX 590／メモリ16GB（1080p・低・アップスケールで60fps）',
      },
      {
        label: '配信済み更新',
        value: 'シーズン2／0.2.0：10月15日に配信告知。現在の稼働状態とは別',
      },
    ],
    diagnosis: [
      {
        symptom: 'ログイン待ちの列が進まない',
        cause: '混雑の可能性。現在の告知と表示を確認',
        stepId: 'step-2',
      },
      {
        symptom: 'エラーが出てまったく入れない',
        cause: '障害・メンテナンスの有無を確認',
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
          '告知の日時・対象地域・終了予定を確認する。過去のメンテナンスを現在の障害と判断しない。',
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
        summary: '現在の告知だけで説明できない場合の一般的な切り分けです。告知がないことだけで障害なしとは断定しません。',
        time: '約10分',
        risk: 'low',
        actions: [
          'Steamのライブラリでゲームを右クリック→「プロパティ」→「インストール済みファイル」→「ゲームファイルの整合性を確認」',
          '他のオンラインゲームやWebサイトにつながるか確認する',
          '他の通信も不調なら、自分が管理するルーターをメーカー手順で再起動する。VPNの比較は利用規則が許す場合だけ行い、結果に関係なく元へ戻す。初期化や保護機能の無効化はしない。',
        ],
      },
      {
        id: 'step-5',
        title: 'サーバーブラウザの表示を見直す',
        summary:
          '0.2.0では地域別ping上限と最大pingタグ・フィルターが追加されています。',
        time: '約3分',
        risk: 'low',
        actions: [
          '公式・コミュニティの区分、地域、最大pingのタグやフィルターを確認し、自分の接続に合うサーバーを選ぶ。',
          '空きのないサーバーや空のサーバーを表示する切り替え（Show Empty/Full）を確認する',
          '上限を継続して超えるとキックされ、同じサーバーへは次のマップ切替まで再参加できないと公式が案内している。固定のms値はこの記事では断定しない。',
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
          '家族のライブラリ経由だった場合は、現在の共有対象と所有権を確認する。通信エラーだけを理由に買い直さない',
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
          '2026年9月27日時点で、開発元は再開の予定を示していません（PCGamesNの報道）。現在の共有可否は公式告知とストアで確認し、購入前に利用資格を確かめてください。',
      },
      {
        question: '試合中に「キックされた」と表示されました。',
        answer:
          '0.2.0には高pingが続いた場合のキックと再参加制限があります。キックだけでBANとは断定できません。表示文、地域、時刻を記録し、上限に合うサーバーを確認してください。',
      },
    ],
    sources: [
      sources.steamNews,
      sources.pcgamer,
      sources.familySharing,
      sources.pcgw,
      sources.steam,
      { label: '公式：0.2.0配信・地域別ping上限（10月22日確認）', url: 'https://steamcommunity.com/app/1867240/allnews/' },
    ],
    related: ['error-wd-l020'],
    nextChecks: { heading: '起動エラー・ゲーム終了・PC再起動の場合', links: [{ href: '/games/wardogs/error-wd-l020', label: 'WD-L020と別の起動コードを確認' }, { href: '/guide/pc-game-crash', label: 'ゲームだけが終了する場合' }, { href: '/guide/pc-shuts-down-while-gaming', label: 'PCごと再起動・電源断する場合（危険な反復テストをしない）' }] },
    seoTitle: 'WARDOGSでサーバーに接続できない・ログイン待ちの対処法',
    metaDescription:
      'WARDOGSのログイン待ち・接続不可・高ping切断を切り分け。現在の公式告知、クライアント更新、0.2.0の地域別ping上限を確認し、起動時のWD-L020は専用記事へ案内します。',
  },
];
