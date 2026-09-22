import type { DiscordArticle } from './discord-articles';
export const discordCompatibilityArticles: DiscordArticle[] = [
  {
    slug: 'voice-client-outdated',
    category: 'connection',
    title: 'Discordで通話に参加できない｜古いバージョン・DAVE非対応の確認',
    shortTitle: '古いバージョンで通話できない',
    seoTitle: 'Discordで通話できない｜古いバージョン・DAVE対応を確認',
    metaDescription:
      'チャットは使えるのにDiscordの通話・Go Liveへ参加できない時、古いアプリやブラウザを確認。Windows版とFirefoxの対応条件、更新後も直らない場合の切り分けを説明します。',
    symptom:
      '文字チャットは使えるのに音声・ビデオ通話へ参加できない、古いアプリやブラウザを長く使っている人向けです。RTC接続中や無音の原因すべてがDAVEとは限りません。',
    target: 'Windows版Discord・PCブラウザ版／バージョン非対応が疑われる場合',
    conclusion:
      'Discord公式は2026年3月2日以降の通話に暗号化対応を必須と案内しています。まずアプリとブラウザを現行版へ更新し、同じ通話へ参加できるか確認してください。',
    quickFixes: [
      'Discordのユーザー設定の最下部でバージョンを確認する',
      'アプリ・ブラウザを更新して再起動する',
      '更新済みでも直らない場合はRTC接続や音声設定を切り分ける',
    ],
    causes: [
      {
        title: 'Discordを対応バージョンへ更新する',
        description:
          '公式の最低条件はWindows版1.0.9164です。これは最新推奨版を意味しないため、利用可能な更新を適用してください。',
        actions: [
          '歯車からユーザー設定を開き、最下部のバージョン番号を控える',
          'Discordを完全終了して起動し直し、更新が完了したことを確認する',
          '更新後の番号を確認して、同じボイスチャンネルへ参加する',
        ],
      },
      {
        title: 'ブラウザを更新して通話を比較する',
        description:
          'Firefoxの公式最低条件は142です。古いブラウザでは文字チャットが使えても通話に参加できない場合があります。',
        actions: [
          'ブラウザのヘルプ・バージョン情報で更新を確認する',
          '更新後にブラウザを再起動し、Discordへ再アクセスする',
          '同じアカウント・同じチャンネルで、公式アプリとブラウザの結果を比較する',
        ],
      },
      {
        title: '更新後の症状を分ける',
        description:
          '対応版でも直らない場合は、非対応バージョン以外の原因を確認します。ここは編集部の切り分け手順です。',
        actions: [
          '接続が始まらないならRTC接続中・No Routeの関連記事を確認する',
          '参加できて相手の声だけ聞こえないなら出力先と個別音量を確認する',
          '一部の音声Botだけ使えないならBot提供者のDAVE対応状況を確認する',
        ],
      },
    ],
    ifNotFixed:
      'OS、Discordとブラウザの版、表示メッセージ、公式アプリとブラウザの比較結果を控えてDiscord公式サポートへ相談してください。DAVEを無効化する方法での回避は案内していません。',
    faqs: [
      {
        question: 'チャットが使えても通話だけできなくなりますか？',
        answer:
          '暗号化に非対応の版ではその可能性があります。ただしネットワークや音声設定にも原因があるため、更新後に症状を再確認します。',
      },
      {
        question: '音楽Botだけ使えない場合もアプリの更新で直りますか？',
        answer:
          '音声接続するBot側にもDAVE対応が必要です。Bot提供者の公式告知を確認してください。',
      },
    ],
    sources: [
      {
        label: 'Discord公式：通話に必要な最低バージョン（2026-09-22確認）',
        url: 'https://support.discord.com/hc/en-us/articles/38025123604631-Minimum-Client-Version-Requirements-for-Voice-Chat',
      },
    ],
    related: [
      'rtc-connecting',
      'no-route',
      'cant-hear-voice',
      'bot-not-responding',
    ],
    checkedAt: '2026-09-22',
    status: 'verified',
  },
];
