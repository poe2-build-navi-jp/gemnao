import type { DiscordArticle } from '@/lib/discord-articles';

const source = (label: string, id: string) => ({
  label: `Discord公式：${label}`,
  url: `https://support.discord.com/hc/en-us/articles/${id}`,
});
const overlay = source('ゲームオーバーレイ 101', '217659737');
const notifications = source('通知設定 101', '215253258');
const streaming = source('音声・ビデオ・配信ガイド', '33030151293079');

export const discordExtraUiArticles: DiscordArticle[] = [
  {
    slug: 'overlay-not-showing', category: 'screen',
    title: 'Discordのゲームオーバーレイが表示されないときの直し方【Windows】',
    shortTitle: 'ゲームオーバーレイが出ない',
    seoTitle: 'Discordのゲームオーバーレイが表示されないときの直し方【Windows】',
    metaDescription: 'Discordのゲームオーバーレイが表示されない時の対処法。オーバーレイ設定、表示モード、Windows対応状況を公式情報ベースで確認します。',
    symptom: 'ゲーム中にDiscordのチャット・通話オーバーレイが出ない、設定をオンにしても表示されない場合の手順です。',
    target: 'Windows 10 / 11版 Discord',
    conclusion: 'ゲームオーバーレイを有効にし、表示されない場合はゲームの表示モードをウィンドウまたはボーダーレスへ切り替えて確認します。',
    quickFixes: ['Discordのゲームオーバーレイ設定をオンにする', 'ゲームをウィンドウまたはボーダーレス表示へ切り替える', 'Mac・LinuxではなくWindows 10 / 11か確認する'],
    causes: [
      { title: 'ゲームオーバーレイが無効になっている', description: 'Discordのゲームオーバーレイはユーザー設定から有効化できます。', actions: ['Discordのユーザー設定を開く', 'ゲームオーバーレイを開く', 'オーバーレイを有効にする', 'ゲームへ戻って表示を確認する'] },
      { title: 'ゲームの表示モードと相性が悪い', description: 'Discord公式はオーバーレイが動作しない場合にウィンドウ・ボーダーレスウィンドウの切り替えを案内しています。', actions: ['ゲームの表示設定を開く', 'フルスクリーンからウィンドウまたはボーダーレスへ変更する', 'ゲームを再表示してオーバーレイを確認する'] },
    ],
    ifNotFixed: 'オーバーレイはWindows 10 / 11向けです。使用中にゲームがクラッシュする場合は無効化し、Discord公式が案内するログを添えてサポートへ問い合わせてください。',
    faqs: [
      { question: 'DiscordのオーバーレイはMacでも使えますか？', answer: 'Discord公式ではゲームオーバーレイはWindows 10 / 11のみ互換と案内しています。MacやLinuxでは機能しません。' },
      { question: 'オーバーレイをオンにするとゲームが落ちます', answer: 'Discord公式はオーバーレイ有効時にラグやクラッシュが起きるゲームでは無効化を推奨しています。' },
    ],
    sources: [overlay], related: ['screen-share-not-working', 'screen-share-black-screen', 'not-opening'], checkedAt: '2026-09-17', status: 'verified',
  },
  {
    slug: 'notifications-not-working', category: 'launch',
    title: 'Discordの通知が来ない・メンションに気づかないときの設定確認【PC版】',
    shortTitle: '通知が来ない',
    seoTitle: 'Discordの通知が来ない・メンションに気づかないときの設定確認【PC版】',
    metaDescription: 'Discordの通知が来ない、メンション通知が表示されない時の確認方法。サーバー・チャンネルのミュートと通知上書きを順番に確認します。',
    symptom: 'Discordのメッセージやメンションが届いているのにデスクトップ通知が出ない、特定サーバーやチャンネルだけ通知されない場合の手順です。',
    target: 'PC版 Discord',
    conclusion: 'サーバー全体のミュート、通知レベル、チャンネルごとの通知上書きを順番に確認します。特定サーバーだけ来ない場合は、そのサーバー設定から見るのが最短です。',
    quickFixes: ['対象サーバーがミュートされていないか確認する', 'サーバー通知設定の通知レベルを確認する', '該当チャンネルの通知上書きを確認する'],
    causes: [
      { title: 'サーバー全体がミュートされている', description: 'サーバーをミュートすると、そのサーバー内のチャンネル通知がまとめて抑制されます。', actions: ['対象サーバー名を右クリックする', '通知設定を開く', 'サーバー全体のミュート状態を確認する', '必要な通知レベルへ変更する'] },
      { title: 'チャンネル単位の通知設定で上書きされている', description: 'サーバー設定が有効でも、個別チャンネル側で通知なし・ミュートに上書きされている場合があります。', actions: ['サーバー通知設定を開く', '通知設定の上書き一覧を確認する', '該当チャンネルの設定を確認する', '「すべて」「メンション」など必要な設定へ変更する'] },
    ],
    ifNotFixed: 'Discord側の設定が正しい場合はWindowsの通知許可と集中モードも確認してください。特定の通知種別だけ来ない場合は、Discord公式の通知設定ページで現在の仕様を確認します。',
    faqs: [
      { question: '特定のサーバーだけ通知が来ません', answer: 'そのサーバーのミュート状態と通知レベル、チャンネルごとの通知上書きを確認してください。' },
      { question: 'メンションだけ通知を受ける設定はできますか？', answer: 'Discordのサーバー通知設定ではメンションのみを受ける通知レベルを選べます。' },
    ],
    sources: [notifications], related: ['overlay-not-showing', 'loading-stuck', 'not-opening'], checkedAt: '2026-09-17', status: 'verified',
  },
  {
    slug: 'screen-share-black-screen', category: 'screen',
    title: 'Discordの画面共有が真っ黒・黒画面になるときの確認方法',
    shortTitle: '画面共有が真っ黒になる',
    seoTitle: 'Discordの画面共有が真っ黒・黒画面になるときの確認方法',
    metaDescription: 'Discordの画面共有が真っ黒で相手に映らない時の確認方法。共有対象、画面録画権限、アプリ更新、保護コンテンツかを切り分けます。',
    symptom: 'Discordで画面共有は開始できるのに、相手側では映像が黒い、特定アプリだけ真っ黒になる場合の手順です。',
    target: 'PC版 Discord',
    conclusion: '共有対象を選び直し、DiscordとOSの画面共有権限を確認します。特定の保護された動画だけ黒い場合は、設定不良ではなくコンテンツ側の制限も考えます。',
    quickFixes: ['画面共有を止めて共有するアプリ・ウィンドウを選び直す', 'Discordを最新版へ更新して再起動する', 'OS側でDiscordの画面共有・画面録画権限を確認する'],
    causes: [
      { title: '共有対象または権限が正しくない', description: 'Discordの配信ガイドでは共有する画面・アプリの選択と、OS側の画面録画権限を確認するよう案内しています。', actions: ['一度画面共有を停止する', '共有したいアプリまたは画面を選び直す', 'Discordを再起動する', 'OS側でDiscordの画面共有・画面録画権限を確認する'] },
      { title: '特定コンテンツだけ黒く表示される', description: '著作権保護などにより画面キャプチャが制限されるコンテンツがあります。通常アプリは映るのに特定動画だけ黒い場合は、Discord設定だけでは解決できないことがあります。', actions: ['通常のアプリ画面が共有できるか確認する', '特定コンテンツだけ黒いか切り分ける', '保護されたコンテンツの制限を回避しようとせず、提供元の利用条件に従う'] },
    ],
    ifNotFixed: '通常のアプリやデスクトップも黒い場合は、Discordの音声・ビデオ・配信ガイドを確認し、アプリ更新とOS権限を再確認してください。',
    faqs: [
      { question: '音は出るのに画面だけ黒い場合は？', answer: '共有対象とOS側の画面共有権限を確認し、通常アプリでも同じ症状か切り分けてください。' },
      { question: '特定の動画サービスだけ真っ黒です', answer: '保護されたコンテンツでは画面キャプチャが制限される場合があります。制限を回避する方法ではなく、提供元の正式な視聴・共有方法を利用してください。' },
    ],
    sources: [streaming], related: ['screen-share-not-working', 'stream-no-audio', 'overlay-not-showing'], checkedAt: '2026-09-17', status: 'verified',
  },
];
