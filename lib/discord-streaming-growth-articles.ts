import type { DiscordArticle } from '@/lib/discord-articles';

const official = (id: string, label: string) => ({
  label: `Discord公式サポート：${label}`,
  url: `https://support.discord.com/hc/en-us/articles/${id}`,
});

const streamingGuide = official(
  '33030151293079-Discord-Voice-Video-Streaming-Guide',
  '音声・ビデオ・配信ガイド（英語）',
);

const voiceVideoGuide = official(
  '360045138471-Discord-Voice-and-Video-Troubleshooting-Guide',
  '音声・ビデオのトラブルシューティング（英語）',
);

const discordStatus = {
  label: 'Discord Status（公式障害情報）',
  url: 'https://discordstatus.com/',
};

export const discordStreamingGrowthArticles: DiscordArticle[] = [
  {
    slug: 'stream-stuttering',
    category: 'screen',
    title: 'Discord配信がカクカクする・重いときの対処法',
    shortTitle: 'Discord配信がカクカク・重い',
    seoTitle: 'Discord配信がカクカクする・重いときの対処法【PC】',
    metaDescription:
      'Discordのゲーム配信・画面共有がカクカクする、重い場合の対処法。配信品質、回線、PC負荷、ハードウェアアクセラレーションを順に確認します。',
    symptom:
      'Discordでゲームや画面を配信すると映像がカクつく、止まる、遅延する、または配信中だけゲームとDiscordが重くなる場合の切り分け手順です。視聴者側だけで起きているのか、配信者側の回線・PC負荷なのかを分けて確認します。',
    target: 'Windows 11 / Windows 10版 Discordデスクトップアプリ',
    conclusion:
      '最初にDiscord Statusを確認し、配信を720p・30fpsなど低い品質へ変更します。次に大容量通信と録画を止め、タスクマネージャーでCPU・GPU・メモリ・ネットワークの負荷を確認してください。',
    quickFixes: [
      'Discord Statusを確認し、配信品質を720p・30fpsなどへ下げる',
      'ダウンロード、クラウド同期、録画など回線とPCを使う処理を止める',
      'Discordのハードウェアアクセラレーションを切り替え、再起動して比較する',
    ],
    causes: [
      {
        title: '配信の解像度・フレームレートが回線に対して高い',
        description:
          '高い解像度やフレームレートは送信帯域を多く使います。視聴者全員でカクつく場合は、まず配信品質を下げて変化を確認します。',
        actions: [
          '配信中の画面から配信品質の設定を開く',
          '解像度を720p、フレームレートを30fpsなど現在より低くする',
          '数分間配信し、複数の視聴者へ映像が滑らかになったか確認する',
          '改善した場合は、回線が安定する範囲で品質を1段階ずつ戻す',
        ],
      },
      {
        title: 'アップロード回線またはDiscord側に問題がある',
        description:
          '配信はアップロード回線を使用します。ゲームのダウンロード、クラウド同期、別端末の動画送信が重なると映像が止まりやすくなります。',
        actions: [
          'Discord Statusで音声・配信関連の障害がないか確認する',
          'Steamなどのダウンロード、クラウド同期、バックアップを一時停止する',
          'Wi-Fiの場合はルーターへ近づくか、有線接続で改善するか確認する',
          '一人だけカクつく場合は、その視聴者側でも回線とDiscordの再起動を確認する',
        ],
        note: '公式障害がある場合は、再インストールや設定変更を繰り返さず復旧を待ってください。',
      },
      {
        title: 'ゲーム・録画・DiscordでPC負荷が高い',
        description:
          '高負荷のゲームと配信、録画を同時に行うと、CPU・GPU・メモリの余裕がなくなり、ゲームと配信の両方がカクつくことがあります。',
        actions: [
          'タスクマネージャーでCPU、GPU、メモリの使用率を確認する',
          '録画ソフト、不要なブラウザタブ、オーバーレイを一時的に終了する',
          'ゲームのFPS上限や画質を下げ、配信前後で負荷を比較する',
          'Discordだけ重い場合は、ユーザー設定でハードウェアアクセラレーションを切り替えて再起動する',
        ],
      },
      {
        title: '配信対象やGPUドライバーとの相性',
        description:
          'ゲーム画面の共有だけで問題が出る場合は、共有対象、全画面表示、GPUドライバーの組み合わせを切り分けます。',
        actions: [
          '画面全体ではなくゲームのウィンドウを直接選んで配信する',
          'ゲームをボーダーレスウィンドウへ変更して比較する',
          'DiscordとWindowsを更新して再起動する',
          'GPUメーカーまたはPCメーカーの公式手順でドライバーを更新する',
        ],
      },
    ],
    ifNotFixed:
      '別のゲームやデスクトップ共有でも再現するか確認してください。すべての配信で重い場合は回線・PC負荷・Discord側、特定ゲームだけならそのゲームの描画設定や既知問題の可能性があります。発生時刻、配信品質、PC構成、回線、タスクマネージャーの使用率を記録し、Discord公式サポートへ報告してください。',
    faqs: [
      {
        question: 'Discord配信は何fpsに下げればよいですか？',
        answer:
          'まず30fpsへ下げて改善するか確認してください。解像度も720pなどへ下げ、回線とPC負荷に余裕がある範囲で1段階ずつ戻します。',
      },
      {
        question: '自分のゲームも配信映像もカクつきます',
        answer:
          'CPU・GPU・メモリの負荷が高い可能性があります。録画や不要なアプリを止め、ゲームのFPS上限と画質、Discordの配信品質を下げてください。',
      },
      {
        question: '視聴者一人だけカクカクする場合も配信者の問題ですか？',
        answer:
          '一人だけなら視聴者側の回線やDiscord環境の可能性があります。複数人で同じ症状か確認し、その視聴者にもDiscordの再起動と通信状態の確認を依頼してください。',
      },
      {
        question: 'ハードウェアアクセラレーションはオフが正解ですか？',
        answer:
          '常にオフが正解ではありません。PCとGPUドライバーの組み合わせで変わるため、現在と反対の設定へ切り替えて再起動し、改善しなければ元に戻してください。',
      },
    ],
    sources: [streamingGuide, voiceVideoGuide, discordStatus],
    related: ['screen-share-not-working', 'slow-performance', 'stream-no-audio'],
    checkedAt: '2026-09-19',
    status: 'verified',
  },
];
