import type { DiscordArticle } from '@/lib/discord-articles';

const source = (label: string, id: string) => ({
  label: `Discord公式：${label}`,
  url: `https://support.discord.com/hc/en-us/articles/${id}`,
});
const status = { label: 'Discord Status（公式障害情報）', url: 'https://discordstatus.com/' };
const general = source('トラブルシューティングガイド', '31623498041623');
const installer = source('[Windows] インストーラーエラー', '209099387');
const corrupt = source('[Windows] インストールの破損', '115004307527');
const audioInput = source('オーディオ入力が見つかりません', '214925018');
const errorCodes = source('オーディオ・動画エラーコード', '30952914470807');
const overlay = source('ゲームオーバーレイ 101', '217659737');
const notifications = source('通知設定 101', '215253258');

export const discordExtraArticles: DiscordArticle[] = [
  {
    slug: 'update-failed',
    category: 'launch',
    title: 'DiscordがUpdate Failedで起動できないときの直し方【Windows】',
    shortTitle: 'Update Failedで起動できない',
    seoTitle: 'DiscordがUpdate Failedで起動できないときの直し方【Windows】',
    metaDescription: 'DiscordでUpdate Failedが繰り返されて起動できない時の対処法。完全終了、通信確認、公式手順での再インストールを順番に確認します。',
    symptom: 'Discord起動時に「Update failed」が繰り返され、通常画面まで進めない場合の手順です。',
    target: 'Windows版 Discordデスクトップアプリ',
    conclusion: 'Discordを完全終了して再起動し、VPN・プロキシなど通信経路を確認します。直らなければ公式のWindows修復手順で再インストールします。',
    quickFixes: [
      'タスクマネージャーでDiscord関連プロセスをすべて終了する',
      'VPN・プロキシを使っている場合は一度切って更新を試す',
      '直らなければ公式手順でDiscordを再インストールする',
    ],
    causes: [
      {
        title: '更新プロセスが残っている',
        description: '前回の更新や終了処理が残ると、次の起動時に更新が進まないことがあります。',
        actions: ['タスクマネージャーを開く', 'Discord関連プロセスをすべて終了する', 'Windowsを再起動する', 'Discordを起動して更新を確認する'],
      },
      {
        title: '通信経路またはローカルデータに問題がある',
        description: 'VPN・プロキシや破損したローカルデータが更新を妨げる場合があります。',
        actions: ['Discord Statusを確認する', 'VPN・プロキシを一度切る', '改善しなければ公式のWindows修復手順に従う', '公式サイトから最新インストーラーを取得する'],
        note: 'AppDataを整理する場合は、Discord公式の手順と削除対象を照合してから実行してください。',
      },
    ],
    ifNotFixed: '別回線と公式の再インストール手順でも直らない場合は、Update Failed画面を記録してDiscordサポートへ問い合わせてください。',
    faqs: [
      { question: 'Update Failedは待つだけで直りますか？', answer: '障害が原因なら復旧後に直る場合があります。繰り返す場合はStatus確認、完全終了、通信経路の確認を先に行ってください。' },
      { question: 'AppDataを消しても大丈夫？', answer: 'Discordを完全終了し、公式案内に記載されたDiscordフォルダーだけを対象にしてください。別アプリのフォルダーは削除しないでください。' },
    ],
    sources: [general, corrupt, status],
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
    metaDescription: 'DiscordでInstallation Failedが出てインストールできない時の対処法。残ったプロセスとAppDataを公式手順で整理します。',
    symptom: 'DiscordSetup.exeを実行しても「Installation has failed」などでセットアップが止まる場合の手順です。',
    target: 'Windows 10 / 11',
    conclusion: 'Discordの全プロセスを終了し、公式手順どおりAppDataとLocalAppDataのDiscordデータを整理して再起動後に再インストールします。',
    quickFixes: ['Discord関連プロセスをすべて終了する', '公式手順に沿って残ったDiscordデータを整理する', 'Windows再起動後に最新インストーラーを使う'],
    causes: [
      {
        title: 'Discordプロセスや古いデータが残っている',
        description: 'バックグラウンドプロセスや以前のインストールデータが新しいセットアップを妨げる場合があります。',
        actions: ['タスクトレイとタスクマネージャーからDiscordを終了する', 'Windows＋Rで%appdata%を開く', '公式手順に沿ってDiscordフォルダーを整理する', '%localappdata%側も同様に確認する', 'Windowsを再起動する'],
      },
      {
        title: '古いインストーラーを使っている',
        description: '保存済みの古いセットアップではなく、Discord公式サイトから現在のWindows版を取得します。',
        actions: ['以前のDiscordSetup.exeを使わない', 'Discord公式サイトからWindows版を再取得する', '再起動後にインストールする'],
      },
    ],
    ifNotFixed: '公式手順でも失敗する場合は、エラー画面とWindowsバージョンを記録してDiscordサポートへ問い合わせてください。',
    faqs: [
      { question: 'アンインストール後もInstallation Failedが出るのはなぜ？', answer: 'AppDataやLocalAppDataに以前のDiscordデータが残っている場合があります。公式手順に沿って確認してください。' },
      { question: 'DiscordSetup.exeはどこから入手する？', answer: 'Discord公式サイトから取得してください。非公式な再配布ファイルは使用しないでください。' },
    ],
    sources: [installer, corrupt],
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
    metaDescription: 'Discordでオーディオ入力が見つかりませんと表示される時の対処法。入力デバイス、接続、マイク権限、オーディオ設定を確認します。',
    symptom: 'Discordでマイクが一覧に出ない、または「オーディオ入力が見つかりません」と表示される場合の手順です。',
    target: 'Windows版 / ブラウザ版 Discord',
    conclusion: '入力デバイスを選び直し、外付けマイクの接続とOS側のマイク許可を確認します。Discordだけで認識しない場合は公式案内の音声設定も確認します。',
    quickFixes: ['音声・ビデオで入力デバイスを選び直す', 'USB・3.5mmマイクを挿し直し別ポートでも試す', 'Windowsのマイクアクセス許可を確認する'],
    causes: [
      {
        title: '入力デバイスまたは接続が認識されていない',
        description: '複数のマイクがある場合や接続が不安定な場合、Discordの入力一覧に目的の機器が出ないことがあります。',
        actions: ['Discordの音声・ビデオを開く', '入力デバイス一覧を確認する', '外付けマイクを挿し直す', '別のUSB・入力ポートでも試す', 'ハードウェア側のミュートも確認する'],
      },
      {
        title: 'OS権限またはDiscordの音声設定に問題がある',
        description: 'Windowsのマイク権限やDiscord側の音声設定が原因で入力を取得できない場合があります。',
        actions: ['Windowsのマイクアクセス許可を確認する', 'Discordを再起動する', '公式記事にあるオーディオサブシステム設定を確認する', '必要ならプッシュトゥトークと音声検出を切り替えてテストする'],
      },
    ],
    ifNotFixed: 'Windowsのボイスレコーダーなど他アプリでも認識しない場合はマイク本体・接続・ドライバー側を確認してください。Discordだけで起きる場合は公式サポートへ問い合わせます。',
    faqs: [
      { question: 'マイクがWindowsでは使えるのにDiscordだけ出ません', answer: 'Discordの入力デバイス選択とマイク権限を確認し、アプリを完全終了して再起動してください。' },
      { question: 'USBマイクは別ポートを試すべき？', answer: 'はい。Discord公式も外部入力機器について接続の確認と別ポートでのテストを案内しています。' },
    ],
    sources: [audioInput],
    related: ['mic-not-working', 'cant-hear-voice', 'robotic-voice'],
    checkedAt: '2026-09-17',
    status: 'verified',
  },
  {
    slug: 'robotic-voice',
    category: 'audio',
    title: 'Discordで声がロボットみたいになる・歪むときの直し方【エラー1003】',
    shortTitle: '声がロボットみたいになる',
    seoTitle: 'Discordで声がロボットみたいになる・歪むときの直し方【エラー1003】',
    metaDescription: 'Discordで声がロボット音声のように歪む、遅く聞こえる、エラー1003が出る時の対処法。入出力デバイスを切り分けます。',
    symptom: '通話中の声がロボットのように歪む、遅くなる、または音声入力レート不一致のエラー1003が表示される場合の手順です。',
    target: 'PC版 Discord',
    conclusion: 'Discord公式ではエラー1003について、入力と出力を別デバイスに切り替える、別のマイクや出力先を試す、ボイスチャンネルへ再参加する方法を案内しています。',
    quickFixes: ['ボイスチャンネルから退出して再参加する', '入力デバイスまたは出力デバイスを別の機器へ切り替える', '可能なら入力と出力を別々のデバイスにする'],
    causes: [
      {
        title: '入力と出力の音声レートが合っていない',
        description: 'Discordのエラー1003は音声入力レートの大きな不一致を検出した時に発生し、ロボット音声や遅い音声になることがあります。',
        actions: ['ボイスチャンネルを一度退出する', '入力デバイスを別のマイクへ切り替える', '出力デバイスも別の機器へ切り替える', '再参加して音声を確認する'],
      },
      {
        title: '同じヘッドセットの入出力で問題が起きている',
        description: 'Discord公式はゲームヘッドセットなど同一機器で入出力している環境で起きやすいと案内しています。',
        actions: ['可能ならUSBマイクとヘッドホンなど入力・出力を分ける', 'Discordの音声・ビデオで選択先を確認する', 'マイクテスト後に通話へ戻る'],
      },
    ],
    ifNotFixed: '複数のデバイスでも歪みが続く場合は、Discordの音声設定リセットとPC再起動を行い、それでも直らなければ公式サポートへ問い合わせてください。',
    faqs: [
      { question: 'Discordのエラー1003とは？', answer: 'Discord公式では「音声入力レートの不一致」と説明され、ロボット音声や遅い音声の原因になるエラーです。' },
      { question: 'まず何を変えればいい？', answer: 'ボイスチャンネルへ再参加し、次に入力・出力デバイスを別々に切り替えて確認してください。' },
    ],
    sources: [errorCodes],
    related: ['audio-input-not-found', 'mic-not-working', 'cant-hear-voice'],
    checkedAt: '2026-09-17',
    status: 'verified',
  },
  {
    slug: 'overlay-not-showing',
    category: 'screen',
    title: 'Discordのゲームオーバーレイが表示されないときの直し方【Windows】',
    shortTitle: 'ゲームオーバーレイが出ない',
    seoTitle: 'Discordのゲームオーバーレイが表示されないときの直し方【Windows】',
    metaDescription: 'Discordのゲームオーバーレイが表示されない時の対処法。オーバーレイ設定、表示モード、Windows対応状況を公式情報ベースで確認します。',
    symptom: 'ゲーム中にDiscordのチャット・通話オーバーレイが出ない、設定をオンにしても表示されない場合の手順です。',
    target: 'Windows 10 / 11版 Discord',
    conclusion: 'ゲームオーバーレイを有効にし、対象ゲームで表示されるか確認します。表示されない場合は、Discord公式が案内する