import type { DiscordArticle } from '@/lib/discord-articles';

const official = (label: string, url: string) => ({ label, url });

const discordStatus = official(
  'Discord Status（公式障害情報）',
  'https://discordstatus.com/',
);
const troubleshooting = official(
  'Discord公式：トラブルシューティングガイド',
  'https://support.discord.com/hc/ja/articles/31623498041623-Discord%E3%81%AE%E3%83%88%E3%83%A9%E3%83%96%E3%83%AB%E3%82%B7%E3%83%A5%E3%83%BC%E3%83%86%E3%82%A3%E3%83%B3%E3%82%B0%E3%82%AC%E3%82%A4%E3%83%89',
);
const installerError = official(
  'Discord公式：[Windows] インストーラーエラー',
  'https://support.discord.com/hc/ja/articles/209099387--Windows-%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%A9%E3%83%BC%E3%82%A8%E3%83%A9%E3%83%BC',
);
const corruptInstall = official(
  'Discord公式：[Windows] インストールの破損',
  'https://support.discord.com/hc/ja/articles/115004307527--Windows-%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB%E3%81%AE%E7%A0%B4%E6%90%8D',
);
const audioInput = official(
  'Discord公式：オーディオ入力が見つかりません',
  'https://support.discord.com/hc/ja/articles/214925018-%E3%82%AA%E3%83%BC%E3%83%87%E3%82%A3%E3%82%AA%E5%85%A5%E5%8A%9B%E3%81%8C%E8%A6%8B%E3%81%A4%E3%81%8B%E3%82%8A%E3%81%BE%E3%81%9B%E3%82%93-%E3%81%95%E3%81%BE%E3%81%96%E3%81%BE%E3%81%AA%E9%9F%B3%E5%A3%B0%E3%83%88%E3%83%A9%E3%83%96%E3%83%AB',
);
const errorCodes = official(
  'Discord公式：オーディオ・動画エラーコード',
  'https://support.discord.com/hc/ja/articles/30952914470807-Discord%E3%82%AA%E3%83%BC%E3%83%87%E3%82%A3%E3%82%AA%E3%81%8A%E3%82%88%E3%81%B3%E5%8B%95%E7%94%BB%E3%81%AE%E3%82%A8%E3%83%A9%E3%83%BC%E3%82%B3%E3%83%BC%E3%83%89-%E3%83%88%E3%83%A9%E3%83%96%E3%83%AB%E3%82%B7%E3%83%A5%E3%83%BC%E3%83%86%E3%82%A3%E3%83%B3%E3%82%B0%E3%82%AC%E3%82%A4%E3%83%89',
);
const streaming = official(
  'Discord公式：音声・ビデオ・配信ガイド',
  'https://support.discord.com/hc/ja/articles/33030151293079-Discord%E3%81%AE%E9%9F%B3%E5%A3%B0-%E3%83%93%E3%83%87%E3%82%AA-%E9%85%8D%E4%BF%A1%E3%82%AC%E3%82%A4%E3%83%89',
);
const overlay = official(
  'Discord公式：ゲームオーバーレイ 101',
  'https://support.discord.com/hc/ja/articles/217659737-%E3%82%B2%E3%83%BC%E3%83%A0%E3%82%AA%E3%83%BC%E3%83%90%E3%83%BC%E3%83%AC%E3%82%A4-101',
);
const notifications = official(
  'Discord公式：通知設定 101',
  'https://support.discord.com/hc/ja/articles/215253258-%E9%80%9A%E7%9F%A5%E8%A8%AD%E5%AE%9A-101',
);

export const discordExtraArticles: DiscordArticle[] = [
  {
    slug: 'update-failed',
    category: 'launch',
    title: 'DiscordがUpdate Failedで起動できないときの直し方【Windows】',
    shortTitle: 'Update Failedで起動できない',
    seoTitle: 'DiscordがUpdate Failedで起動できないときの直し方【Windows】',
    metaDescription:
      'Discordで「Update failed」が繰り返されて起動できない時の対処法。完全終了、ネットワーク確認、AppDataの整理、再インストールを安全な順番で確認します。',
    symptom:
      'Discord起動時に「Update failed」や再試行表示が繰り返され、通常の画面まで進めない場合の切り分け手順です。',
    target: 'Windows版 Discordデスクトップアプリ',
    conclusion:
      'まずDiscordを完全終了して再起動し、次にVPN・プロキシや通信状態を確認します。それでも更新できない場合は、公式手順に沿ってDiscordのローカルデータを整理して再インストールします。',
    quickFixes: [
      'タスクマネージャーでDiscord関連プロセスをすべて終了してから起動し直す',
      'VPNやプロキシを使用している場合は一度切り、通常回線で更新を試す',
      '改善しなければDiscord公式のWindows再インストール手順を行う',
    ],
    causes: [
      {
        title: 'Discordの更新プロセスが途中で残っている',
        description:
          '前回の更新や終了処理が完了していないと、次の起動時に更新が進まないことがあります。',
        actions: [
          'Ctrl＋Shift＋Escでタスクマネージャーを開く',
          'DiscordやUpdateに関連するDiscordプロセスを終了する',
          'Windowsを再起動する',
          'Discordを通常どおり起動し、更新が進むか確認する',
        ],
      },
      {
        title: 'VPN・プロキシ・ネットワークが更新通信を妨げている',
        description:
          'Discord公式の一般トラブルシューティングでは、更新問題でVPNやプロキシ、ファイアウォールなどの通信経路を確認するよう案内しています。',
        actions: [
          'Discord Statusで大規模障害がないか確認する',
          'VPNまたはプロキシを使用中なら一度切る',
          '可能なら別の通常回線でDiscordを起動して更新を試す',
          '社内・学校ネットワークの場合は管理者による通信制限がないか確認する',
        ],
      },
      {
        title: 'Discordのローカルインストールが壊れている',
        description:
          '完全終了と通信確認で直らない場合は、古いローカルデータが更新を妨げている可能性があります。',
        actions: [
          'Discordを完全に終了する',
          '必要な設定がある場合は事前に控える',
          'Discord公式のWindowsインストール修復手順に従ってAppDataとLocalAppDataのDiscordフォルダーを整理する',
          'Windowsを再起動する',
          'Discord公式サイトから最新インストーラーを取得して再インストールする',
        ],
        note: '削除対象を間違えないよう、公式手順を開いた状態で進めてください。',
      },
    ],
    ifNotFixed:
      '別回線でも同じ状態が続き、公式手順で再インストールしてもUpdate Failedになる場合は、エラー画面を記録してDiscordサポートへ問い合わせてください。',
    faqs: [
      {
        question: 'Update Failedが出たら何度も待てば直りますか？',
        answer:
          '一時的な障害なら復旧後に進む場合がありますが、繰り返す場合はDiscord Statusを確認し、完全終了と通信経路の確認を先に行う方が原因を切り分けやすいです。',
      },
      {
        question: 'AppDataを消す前に何を確認すべきですか？',
        answer:
          'Discordを完全終了し、削除する場所がDiscord公式の案内と一致していることを確認してください。別アプリのフォルダーは削除しないでください。',
      },
    ],
    sources: [troubleshooting, corruptInstall, discordStatus],
    related: ['not-opening', 'loading-stuck', 'installation-failed'],
    checkedAt: '2026-09-17',
    status: 'verified',
  },
  {
    slug: 'installation-failed',
    category: 'launch',
    title: 'DiscordのInstallation Failedでインストールできないときの対処法【Windows】',
    shortTitle: 'Installation Failedで入らない',
    seoTitle: 'DiscordのInstallation Failedでインストールできないときの対処法【Windows】',
    metaDescription:
      'Discordで「Installation has failed」「Installation Failed」が出てインストールできない時の対処法。残ったプロセスとAppDataを公式手順で整理します。',
    symptom:
      'DiscordSetup.exeを実行しても「Installation has failed」などのエラーでセットアップが止まり、WindowsへDiscordを導入できない場合の手順です。',
    target: 'Windows 10 / 11',
    conclusion:
      'Discordの全プロセスを終了し、公式手順どおりAppDataとLocalAppDataのDiscordフォルダーを整理してWindowsを再起動し、最新インストーラーで再試行します。',
    quickFixes: [
      'タスクマネージャーでDiscord関連プロセスをすべて終了する',
      '公式手順に従って%AppData%と%LocalAppData%のDiscordフォルダーを整理する',
      'Windows再起動後にDiscord公式サイトから最新インストーラーを取得する',
    ],
    causes: [
      {
        title: '古いDiscordプロセスが残っている',
        description:
          'Discordが画面上で閉じていてもバックグラウンドプロセスが残り、インストーラーがファイルを更新できない場合があります。',
        actions: [
          'タスクトレイからDiscordを終了する',
          'タスクマネージャーでDiscord関連プロセスをすべて終了する',
          'DiscordSetup.exeをもう一度実行する',
        ],
      },
      {
        title: '以前のインストールデータが残っている',
        description:
          'Discord公式はWindowsのインストーラーエラーでAppDataとLocalAppDataのDiscordフォルダーを削除して再インストールする手順を案内しています。',
        actions: [
          'Windows＋Rを押して%appdata%を開く',
          'Discordフォルダーを確認し、公式手順に従って削除する',
          'Windows＋Rで%localappdata%も開き、Discordフォルダーを同様に確認する',
          'Windowsを再起動する',
          '公式サイトからDiscordSetup.exeを再取得する',
        ],
      },
      {
        title: '古いインストーラーを使っている',
        description:
          '保存済みの古いDiscordSetup.exeではなく、公式サイトから現在のインストーラーを取得して試します。',
        actions: [
          '以前ダウンロードしたDiscordSetup.exeを使わない',
          'Discord公式サイトからWindows版を再ダウンロードする',
          'ダウンロード完了後にインストールを実行する',
        ],
      },
    ],
    ifNotFixed:
      '公式のWindowsインストーラーエラー手順をすべて試しても失敗する場合は、エラー画面とWindowsのバージョンを記録してDiscordサポートへ問い合わせてください。',
    faqs: [
      {
        question: 'DiscordをアンインストールしたのにInstallation Failedが出るのはなぜ？',
        answer:
          '通常のアンインストール後もAppDataやLocalAppDataに古いDiscordデータが残っている場合があります。Discord公式の手順に沿って残存フォルダーを確認してください。',
      },
      {
        question: 'DiscordSetup.exeはどこから入手すればいい？',
        answer:
          'Discordの公式サイトからWindows版を取得してください。非公式なミラーや再配布ファイルは使用しないでください。',
      },
    ],
    sources: [installerError, corruptInstall],
    related: ['update-failed', 'not-opening', 'loading-stuck'],
    checkedAt: '2026-09-17',
    status: 'verified',
  },
  {
    slug: 'audio-input-not-found',
    category: 'audio',
    title: 'Discordで「オーディオ入力が見つかりません」と出るときの直し方',
    shortTitle: 'オーディオ入力が見つからない',
    seoTitle: 'Discordで「オーディオ入力が見つかりません」と出るときの直し方',
    metaDescription:
      'Discordで「オーディオ入力が見つかりません」と表示される時の対処法。入力デバイス、接続、マイク権限、オーディオサブシステムを順番に確認します。',
    symptom:
      'Discordの音声・ビデオ設定でマイクが表示されない、または「オーディオ入力が見つかりません」と表示されて音声入力を選べない場合の手順です。',
    target: 'Windows版 / ブラウザ版 Discord',
    conclusion:
      '入力デバイスを選び直し、外付けマイクの接続とWindows側のマイク許可を確認します。Discordだけで認識しない場合は、公式案内にあるオーディオサブシステムの切り替えも確認します。',
    quickFixes: [
      '「音声・ビデオ」で入力デバイス一覧を開き、使うマイクが表示されるか確認する',
      'USB・3.5mmマイクを挿し直し、別ポートでも認識するか試す',
      'Windowsのマイクアクセス許可を確認してDiscordを再起動する',
    ],
    causes: [
      {
        title: 'Discordで別の入力デバイスが選ばれている',
        description:
          'マイクやヘッドセットを複数接続していると、Discordの入力先が意図しないデバイスへ切り替わることがあります。',
        actions: [
          'Discordのユーザー設定を開