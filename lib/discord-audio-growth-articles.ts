import type { DiscordArticle } from '@/lib/discord-articles';

const official = (id: string, label: string) => ({
  label: `Discord公式サポート：${label}`,
  url: `https://support.discord.com/hc/en-us/articles/${id}`,
});

const voiceGuide = official(
  '360045138471-Discord-Voice-and-Video-Troubleshooting-Guide',
  '音声とビデオのトラブルシューティング（英語）',
);
const micTest = official('360020641332-Mic-Testing', 'マイクテスト（英語）');
const attenuation = official(
  '206342888-How-do-I-stop-Discord-from-lowering-my-app-volume-when-someone-else-is-talking',
  '通話中にほかのアプリの音量が下がる場合（英語）',
);
const gameInvites = official('115001557452-Game-Invites', 'ゲーム招待とゲーム検出（英語）');
const activityStatus = official(
  '7931156448919-Activity-Sharing-on-Discord-FAQ',
  'アクティビティステータス（英語）',
);
const discordSupportRequest = {
  label: 'Discord公式サポート：問い合わせフォーム',
  url: 'https://support.discord.com/hc/en-us/requests/new',
};
const discordStatus = {
  label: 'Discord Status（公式障害情報）',
  url: 'https://discordstatus.com/',
};
const windowsBluetooth = {
  label: 'Microsoft公式：WindowsのBluetooth問題を解決する',
  url: 'https://support.microsoft.com/windows/fix-bluetooth-problems-in-windows-723e092f-03fa-858b-5c80-131ec3fba75c',
};

export const discordAudioGrowthArticles: DiscordArticle[] = [
  {
    slug: 'game-volume-lowers', category: 'audio',
    title: 'Discord通話中にゲーム音が小さくなる・音量が下がるときの直し方',
    shortTitle: '通話中にゲーム音が小さくなる',
    seoTitle: 'Discord通話中にゲーム音が小さくなる原因と直し方【PC】',
    metaDescription: 'Discord通話中にゲーム音やほかのアプリの音量が自動で下がる場合の対処法。Discordの減衰とWindowsの通信設定を切り分けます。',
    symptom: 'Discordで誰かが話すとゲーム音だけが小さくなる、通話へ参加した直後にBGMや効果音の音量が下がる場合の手順です。',
    target: 'Windows 11 / Windows 10版 Discordデスクトップアプリ',
    conclusion: 'Discordの「減衰」を0%にし、直らなければWindowsの通信設定を「何もしない」に変更します。ゲーム内音量と出力先も確認してください。',
    quickFixes: ['Discordの「音声・ビデオ」→「減衰」を0%にする', 'Windowsのサウンド通信設定を「何もしない」にする', 'ゲームとDiscordの出力デバイスを同じ機器へそろえる'],
    causes: [
      { title: 'Discordの減衰機能が有効になっている', description: 'ほかの人が話した時に別アプリの音量を下げる機能です。', actions: ['ユーザー設定から「音声・ビデオ」を開く', '詳細設定付近の「減衰」を探す', 'スライダーを0%にして通話で確認する'] },
      { title: 'Windowsが通話を検出して音量を下げている', description: 'Windowsにも通信中に他の音を下げる設定があります。', actions: ['Windowsのサウンド設定から「その他のサウンド設定」を開く', '「通信」タブを開く', '「何もしない」を選択して適用する'] },
      { title: 'ゲームとDiscordで出力先が分かれている', description: '既定の出力先が変わると、片方だけ音量や音質が変化します。', actions: ['Windowsの音量ミキサーを開く', 'ゲームとDiscordの出力デバイスを確認する', '同じヘッドセットまたはスピーカーへそろえる'] },
    ],
    ifNotFixed: 'Bluetooth使用時だけ発生する場合はBluetooth音声の記事で通話用プロファイルを確認してください。特定ゲームだけなら、そのゲーム内の出力デバイスとボイスチャット設定も確認します。',
    faqs: [
      { question: '減衰を0%にしてもゲーム音が小さくなります', answer: 'Windows側の「通信」設定と音量ミキサーを確認してください。Bluetooth機器では通話開始時の音声モード切り替えが原因の場合もあります。' },
      { question: '相手が話した時だけ小さくなるのは故障ですか？', answer: '故障とは限りません。Discordの減衰は、相手が話している間だけ他のアプリ音量を下げる機能です。' },
    ],
    sources: [attenuation, voiceGuide], related: ['bluetooth-audio-problem', 'cant-hear-voice', 'slow-performance'], checkedAt: '2026-09-19', status: 'verified',
  },
  {
    slug: 'mic-volume-low', category: 'audio',
    title: 'Discordでマイクの音が小さい・声が小さいときの直し方',
    shortTitle: 'マイク・自分の声が小さい',
    seoTitle: 'Discordでマイクの音・声が小さいときの直し方【Windows】',
    metaDescription: 'Discordで自分のマイク音量が小さいと言われる場合の対処法。入力音量、Windowsのマイクレベル、距離や接続を順に確認します。',
    symptom: 'マイクは認識されているのに相手から声が小さいと言われる、Discordのマイクテストで波形が小さい場合の手順です。',
    target: 'Windows 11 / Windows 10版 Discordデスクトップアプリ',
    conclusion: 'Discordの入力音量を上げてマイクテストを行い、足りなければWindows側のマイクレベルと機器の位置を確認します。',
    quickFixes: ['Discordの入力音量を上げてマイクテストする', 'Windowsの入力音量・マイクレベルを確認する', 'マイクの距離、物理ゲイン、接続端子を確認する'],
    causes: [
      { title: 'Discordの入力音量が低い', description: '入力デバイスは正しくても入力音量が低いと、相手には小さく届きます。', actions: ['「音声・ビデオ」で使用中の入力デバイスを選ぶ', '入力音量を少しずつ上げる', 'マイクテストで音割れしない範囲を確認する'] },
      { title: 'Windows側のマイクレベルが低い', description: 'Discordより前段のWindows設定で音量が抑えられている場合があります。', actions: ['Windowsの「システム」→「サウンド」→「入力」を開く', '使用中のマイクを選択する', '入力音量を調整してテストする'] },
      { title: 'マイクの距離・向き・物理ゲインが合っていない', description: 'USBマイクやオーディオインターフェースでは本体側のゲインも影響します。', actions: ['マイクの収音方向を確認する', '口元との距離を調整する', '本体ゲインを少しずつ上げ、音割れしないか確認する'] },
    ],
    ifNotFixed: 'Windowsのボイスレコーダーでも小さい場合は機器・ドライバー側です。Discordだけ小さい場合は音声設定をリセットし、入力デバイスを選び直してください。',
    faqs: [
      { question: '入力音量を100%にしても小さい場合は？', answer: 'Windows側の入力音量、マイク本体のゲイン、接続端子を確認します。別の録音アプリでも小さいか比較すると切り分けできます。' },
      { question: 'マイクブーストは上げても大丈夫ですか？', answer: 'ノイズや音割れも増えるため、必要な場合だけ少しずつ上げ、録音を聞きながら調整してください。' },
    ],
    sources: [micTest, voiceGuide], related: ['mic-not-working', 'audio-input-not-found', 'voice-cutting-out'], checkedAt: '2026-09-19', status: 'verified',
  },
  {
    slug: 'call-disconnects', category: 'connection',
    title: 'Discordの通話が切れる・勝手に落ちるときの対処法',
    shortTitle: '通話が切れる・落ちる',
    seoTitle: 'Discordの通話が切れる・勝手に落ちるときの直し方',
    metaDescription: 'Discord通話が頻繁に切れる、ボイスチャンネルから落ちる場合の対処法。障害、回線、VPN、ルーター、音声設定を順に確認します。',
    symptom: 'ボイスチャンネルへ入れても数秒・数分で切断される、ゲーム中だけ通話が落ちる、再接続を繰り返す場合の手順です。',
    target: 'Windows版 Discordデスクトップアプリ / ブラウザ版',
    conclusion: 'Discord Statusを確認し、VPNを切って有線接続または別回線で比較します。次にDiscordとルーターを再起動します。',
    quickFixes: ['Discord Statusで障害の有無を確認する', 'VPN・プロキシを止め、有線または別回線で試す', 'Discordとルーターを再起動する'],
    causes: [
      { title: 'Discord側で音声障害が発生している', description: '複数人が同時に切断される場合はサービス側の可能性があります。', actions: ['Discord Statusを開く', 'VoiceやAPIに障害表示がないか確認する', '障害中は設定を変えず復旧を待つ'] },
      { title: 'Wi-Fi・VPN・ルーターの通信が不安定', description: '短い通信断でもリアルタイム通話は切断されることがあります。', actions: ['VPNやプロキシを一時停止する', '可能なら有線LANまたは別回線で比較する', 'ルーターとPCを再起動する'] },
      { title: 'セキュリティソフトやネットワーク制限', description: 'ファイアウォールや学校・会社のネットワークが音声通信を制限することがあります。', actions: ['家庭の別回線で再現するか確認する', 'Discordをセキュリティソフトの許可対象にする', '管理された回線では管理者へ利用可否を確認する'] },
    ],
    ifNotFixed: 'RTC接続中やNo Routeが表示される場合は、それぞれの専用記事へ進んでください。切断時刻、利用回線、VPNの有無を記録して公式サポートへ伝えると切り分けしやすくなります。',
    faqs: [
      { question: 'ゲーム中だけ通話が切れます', answer: 'ゲームの通信量だけでなく、PC負荷やセキュリティソフトも確認してください。まず有線接続と不要なバックグラウンド通信の停止で比較します。' },
      { question: '特定のサーバーだけ切れる場合は？', answer: '別のボイスチャンネルやDM通話で比較し、サーバー側の地域・権限・チャンネル固有問題か切り分けてください。' },
    ],
    sources: [voiceGuide, discordStatus], related: ['rtc-connecting', 'no-route', 'loading-stuck'], checkedAt: '2026-09-19', status: 'verified',
  },
  {
    slug: 'echo-double-voice', category: 'audio',
    title: 'Discordで自分の声が聞こえる・声が二重になる・エコーする時の直し方',
    shortTitle: '自分の声が返る・二重・エコー',
    seoTitle: 'Discordで自分の声が聞こえる・二重になる時の直し方',
    metaDescription: 'Discordで自分の声が返る、二重に聞こえる、エコーやハウリングが起きる場合の対処法。スピーカー回り込み、モニタリング、二重入力を確認します。',
    symptom: '通話中に自分の声が遅れて返る、相手から声が二重だと言われる、スピーカー使用時に反響やハウリングが起きる場合の手順です。',
    target: 'Windows版 Discordデスクトップアプリ',
    conclusion: 'ヘッドホンで回り込みを止め、Windowsの「このデバイスを聴く」やマイクのダイレクトモニター、OBS等の二重入力を確認します。',
    quickFixes: ['スピーカーを止めてヘッドホンで通話する', 'Windowsの「このデバイスを聴く」をオフにする', 'OBS・ミキサー・仮想音声機器の二重入力を止める'],
    causes: [
      { title: 'スピーカー音をマイクが拾っている', description: '相手の声がスピーカーから出てマイクへ戻るとエコーになります。', actions: ['ヘッドホンまたはイヤホンへ切り替える', 'スピーカー音量を下げる', 'マイクをスピーカーから離して向きを調整する'] },
      { title: 'マイクモニタリングが有効', description: 'Windowsやオーディオ機器のモニター機能で自分の声が直接返っている場合があります。', actions: ['Windowsの録音デバイスのプロパティを開く', '「聴く」タブの「このデバイスを聴く」をオフにする', 'マイクやインターフェースのダイレクトモニターも確認する'] },
      { title: '同じ音声を二つの経路でDiscordへ送っている', description: 'OBS、VoiceMeeter、仮想ケーブルなどで入力が重複すると二重音声になります。', actions: ['Discordの入力デバイスを一つに固定する', 'OBS等のモニター出力を一時停止する', '仮想音声機器を外して通常のマイクで比較する'] },
    ],
    ifNotFixed: '自分だけが返り音を聞くのか、通話相手全員が二重に聞くのか確認してください。特定の相手との通話だけなら、相手側のスピーカー回り込みも確認してもらいます。',
    faqs: [
      { question: 'Discordのマイクテスト中に自分の声が聞こえるのは異常ですか？', answer: 'マイクテストでは確認のため自分の声が再生されることがあります。通常通話でも返る場合にこの記事の設定を確認してください。' },
      { question: 'ノイズ抑制をオンにすれば直りますか？', answer: '軽い回り込みが減る場合はありますが、ヘッドホン利用や二重入力の解消を先に行う方が確実です。' },
    ],
    sources: [voiceGuide, micTest], related: ['voice-cutting-out', 'mic-volume-low', 'cant-hear-voice'], checkedAt: '2026-09-19', status: 'verified',
  },
  {
    slug: 'voice-cutting-out', category: 'audio',
    title: 'Discordで音声・マイクが途切れる、語尾が切れるときの直し方',
    shortTitle: '音声・マイク・語尾が途切れる',
    seoTitle: 'Discordで音声・マイクが途切れる、語尾が切れる時の対処法',
    metaDescription: 'Discordで声が途切れる、マイクの語尾が切れる場合の対処法。入力感度、ノイズ抑制、回線、CPU負荷を順番に切り分けます。',
    symptom: '話し始めや語尾が消える、長く話すと声が断続的に切れる、ゲーム中だけ相手へ声が届かなくなる場合の手順です。',
    target: 'Windows版 Discordデスクトップアプリ',
    conclusion: '入力感度を手動調整してマイクテストを行い、ノイズ抑制を切り替えます。続く場合は回線とPC負荷を確認してください。',
    quickFixes: ['入力感度の自動調整を切り、手動で下げてテストする', 'ノイズ抑制・エコー除去を一つずつ切り替える', '有線接続で試し、PCのCPU使用率を確認する'],
    causes: [
      { title: '入力感度のしきい値が高すぎる', description: '小さい声や語尾を無音と判定すると途中で切れます。', actions: ['「音声・ビデオ」で入力感度を確認する', '自動調整をオフにしてしきい値を少し下げる', 'マイクテストで話し始めと語尾を確認する'] },
      { title: 'ノイズ抑制・音声処理が声まで除去している', description: '環境や声質によって音声処理が強く働く場合があります。', actions: ['ノイズ抑制を一時的にオフにする', 'エコー除去や自動ゲイン制御を一つずつ切り替える', '変更ごとに通話相手へ確認する'] },
      { title: '回線またはPC負荷が不安定', description: 'パケット損失やCPU高負荷でも音声が断続的になります。', actions: ['有線LANまたは別回線で比較する', 'ダウンロードとクラウド同期を止める', 'タスクマネージャーでCPU使用率を確認する'] },
    ],
    ifNotFixed: 'Windowsの録音でも途切れる場合はマイク・USB接続・ドライバー側です。Discordだけなら音声設定をリセットして入力機器を選び直してください。',
    faqs: [
      { question: '語尾だけ切れる原因は何ですか？', answer: '入力感度のしきい値またはノイズ抑制が、弱くなった語尾を無音と判断している可能性があります。' },
      { question: 'ゲーム中だけ途切れます', answer: 'ゲームによるCPU負荷、キー割り当て、回線使用量を確認してください。プッシュトゥトークの場合はシステムヘルパーの記事も参照してください。' },
    ],
    sources: [voiceGuide, micTest], related: ['mic-not-working', 'mic-volume-low', 'system-helper'], checkedAt: '2026-09-19', status: 'verified',
  },
  {
    slug: 'bluetooth-audio-problem', category: 'audio',
    title: 'DiscordでBluetooth接続中にゲーム音が聞こえない・音質が悪いときの対処法',
    shortTitle: 'Bluetoothでゲーム音が消える・音質が悪い',
    seoTitle: 'DiscordでBluetoothのゲーム音が聞こえない・音質が悪い時の直し方',
    metaDescription: 'Discord通話を始めるとBluetoothイヤホンのゲーム音が消える、音質が悪くなる場合の対処法。入出力機器と通話用音声モードを確認します。',
    symptom: 'BluetoothイヤホンでDiscord通話へ入るとゲーム音が聞こえない、音がモノラルのように悪化する、別のスピーカーへ切り替わる場合の手順です。',
    target: 'Windows 11 / Windows 10版 Discordデスクトップアプリ',
    conclusion: 'WindowsとDiscordの入出力先を確認し、Bluetooth機器を再接続します。改善しなければ別マイクまたは有線機器で切り分けます。',
    quickFixes: ['WindowsとDiscordの出力先を同じBluetooth機器へそろえる', 'Bluetooth機器を削除して再ペアリングする', '別マイクか有線ヘッドセットで症状が消えるか確認する'],
    causes: [
      { title: '通話開始時に出力先が切り替わっている', description: '通話用デバイスと音楽用デバイスが別に表示される環境があります。', actions: ['Windowsの音量ミキサーを開く', 'ゲームとDiscordの出力先を確認する', '意図したBluetooth機器へそろえる'] },
      { title: 'Bluetooth接続またはドライバーが不安定', description: '再接続やWindows更新後にデバイス構成が崩れる場合があります。', actions: ['Bluetooth機器の電源を入れ直す', 'Windowsから機器を削除して再ペアリングする', 'PCメーカー公式のBluetoothドライバーを確認する'] },
      { title: 'マイク使用時の音声モードに制約がある', description: '機器とWindowsの組み合わせによっては、マイク使用中に再生音質が変化します。', actions: ['ノートPC内蔵マイクを入力に選びBluetooth機器を出力専用で試す', '有線ヘッドセットまたはUSBマイクで比較する', 'Windows 11とデバイスドライバーを更新する'] },
    ],
    ifNotFixed: '機種固有の対応プロファイルやドライバーが関係するため、イヤホン・PCメーカーの公式サポートも確認してください。Bluetooth以外でも音が出ない場合はPCゲーム音声の共通ガイドで切り分けます。',
    faqs: [
      { question: '通話を始めた瞬間だけ音質が悪くなります', answer: 'マイクを使用する通話用の音声モードへ切り替わっている可能性があります。別マイクを入力に設定して変化を確認してください。' },
      { question: 'Bluetooth 5以降なら必ず高音質になりますか？', answer: 'バージョン番号だけでは判断できません。PC、イヤホン、Windows、ドライバーが対応する機能をメーカー仕様で確認してください。' },
    ],
    sources: [voiceGuide, windowsBluetooth], related: ['game-volume-lowers', 'cant-hear-voice', 'stream-no-audio'], checkedAt: '2026-09-19', status: 'verified',
  },
  {
    slug: 'game-not-detected', category: 'game',
    title: 'Discordがゲームを認識しない・アクティビティに表示されないときの直し方',
    shortTitle: 'ゲームを認識しない・表示されない',
    seoTitle: 'Discordがゲームを認識しない・アクティビティに出ない時の対処法',
    metaDescription: 'Discordが起動中のゲームを認識しない、プレイ中表示が出ない場合の対処法。アクティビティ共有、登録済みゲーム、権限を確認します。',
    symptom: 'ゲームを起動してもプロフィールにプレイ中と表示されない、ゲーム招待で「ゲームが検出されません」と出る場合の手順です。',
    target: 'Windows版 Discordデスクトップアプリ',
    conclusion: 'ゲームを一度起動した状態でDiscordのアクティビティ設定を確認し、必要なら実行中のゲームを登録済みゲームへ追加します。',
    quickFixes: ['ゲームを起動してからDiscordを再起動する', 'アクティビティの共有設定をオンにする', '実行中のゲームを登録済みゲームへ追加する'],
    causes: [
      { title: 'ゲームを起動後にDiscordが検出していない', description: 'Discord公式も、検出には対象ゲームを一度起動するよう案内しています。', actions: ['対象ゲームを起動してタイトル画面まで進む', 'Discordを完全終了して再起動する', 'アクティビティ設定を再確認する'] },
      { title: 'アクティビティ共有がオフ', description: '検出されていても、現在のアクティビティを共有しない設定では表示されません。', actions: ['ユーザー設定のアクティビティ関連項目を開く', '現在のアクティビティを共有する設定を確認する', 'カスタムステータスと混同していないか確認する'] },
      { title: 'ゲームが自動検出対象になっていない', description: '一部ゲームやランチャーは手動登録が必要な場合があります。', actions: ['登録済みゲームの画面を開く', '実行中のアプリから対象ゲームを追加する', '管理者権限が異なる場合はDiscordとゲームの権限をそろえる'] },
    ],
    ifNotFixed: 'ゲーム側がDiscord連携に対応していない場合や、アンチチート・ランチャー構成により表示されない場合があります。表示名だけを目的に不明な外部ツールを導入しないでください。',
    faqs: [
      { question: '「ゲームが検出されません」と表示されます', answer: 'まずゲームを一度起動し、Discordを再起動してください。公式のゲーム招待案内でも、機能追加後に一度ゲームを起動する必要があると説明されています。' },
      { question: '登録したゲーム名を変更できますか？', answer: 'Discordの現在の画面仕様で編集できる場合がありますが、公式機能や表示項目は更新されるため、アプリ内の登録済みゲーム画面を確認してください。' },
    ],
    sources: [gameInvites, activityStatus], related: ['overlay-not-showing', 'system-helper', 'not-opening'], checkedAt: '2026-09-19', status: 'verified',
  },
  {
    slug: 'user-volume-low', category: 'audio',
    title: 'Discordで相手の声が小さいときの音量調整と対処法',
    shortTitle: '相手の声が小さい',
    seoTitle: 'Discordで相手の声が小さいときの直し方｜個別音量を確認',
    metaDescription: 'Discordで特定の相手または全員の声が小さい場合の対処法。ユーザー別音量、出力音量、Windows音量ミキサーを順番に確認します。',
    symptom: '声自体は聞こえるが小さい、特定の一人だけ聞き取りにくい、ゲーム音にDiscord通話が負ける場合の手順です。',
    target: 'Windows版 Discordデスクトップアプリ',
    conclusion: '特定の相手だけならユーザー別音量を上げ、全員が小さいならDiscordの出力音量とWindowsの音量ミキサーを確認します。',
    quickFixes: ['相手を右クリックしてユーザー音量を確認する', 'Discordの出力音量と出力デバイスを確認する', 'Windows音量ミキサーでDiscordの音量を確認する'],
    causes: [
      { title: '特定ユーザーの個別音量が低い', description: 'Discordでは相手ごとに再生音量を変更できます。', actions: ['通話中の相手を右クリックする', 'ユーザー音量のスライダーを確認する', '少しずつ上げて聞こえ方を確認する'] },
      { title: 'Discordの出力音量・出力先が合っていない', description: '全員の声が小さい場合はアプリ全体の出力設定を確認します。', actions: ['「音声・ビデオ」を開く', '出力デバイスを選び直す', '出力音量を上げて通話で確認する'] },
      { title: 'Windows音量ミキサーでDiscordだけ低い', description: 'アプリごとの音量がDiscordだけ下がっている場合があります。', actions: ['Windowsの音量ミキサーを開く', 'Discordの音量と出力先を確認する', 'ゲーム音とのバランスを調整する'] },
    ],
    ifNotFixed: '特定の相手だけ小さく、ユーザー音量を上げても変わらない場合は、相手側でマイク音量を確認してもらってください。全員聞こえない場合は「相手の声が聞こえない」記事へ進みます。',
    faqs: [
      { question: '特定の人だけ声が小さいのは自分の設定ですか？', answer: 'ユーザー別音量が低い可能性があります。それが正常なら、相手側のマイク入力音量も確認してもらってください。' },
      { question: 'ゲーム音を下げずに相手の声だけ大きくできますか？', answer: 'ユーザー別音量またはDiscordの出力音量を上げ、Windows音量ミキサーでゲームとのバランスを調整できます。' },
    ],
    sources: [voiceGuide], related: ['cant-hear-voice', 'mic-volume-low', 'game-volume-lowers'], checkedAt: '2026-09-19', status: 'verified',
  },
  {
    slug: 'phone-verification-error', category: 'launch',
    title: 'Discordで電話番号認証できない・SMSが届かないときの対処法',
    shortTitle: '電話番号認証できない',
    seoTitle: 'Discordで電話番号認証できない・SMSが届かない時の対処法',
    metaDescription: 'Discordで電話番号が無効と出る、認証SMSが届かない場合の確認事項。国番号、入力形式、既存アカウントとの紐付け、時間制限を安全に確認します。',
    symptom: '電話番号認証で「無効な電話番号」と表示される、SMSの確認コードが届かない、同じ番号を使用できない場合の手順です。',
    target: 'Discordデスクトップ版 / ブラウザ版 / モバイル版',
    conclusion: '国番号と入力形式を確認し、短時間の再送を止めて待ちます。同じ番号が別アカウントに登録されていないか確認し、解決しなければ公式サポートへ問い合わせます。',
    quickFixes: ['国番号と電話番号の入力形式を確認する', 'SMS拒否設定と通信状態を確認し、再送を連打せず待つ', '別アカウントに同じ番号が登録されていないか確認する'],
    causes: [
      { title: '国番号または番号の入力形式が違う', description: '国の選択と国内番号の入力方法が合わないと無効と判定されます。', actions: ['国・地域に日本が選ばれているか確認する', '画面の入力例に従って番号を入れ直す', '空白や不要な記号が入っていないか確認する'] },
      { title: 'SMSを受信できない・短時間に再送している', description: '通信会社の迷惑SMS設定や一時的な送信制限が影響する場合があります。', actions: ['端末の電波状態とSMS受信を確認する', '迷惑SMS拒否設定を確認する', '再送を繰り返さず時間を置いて再試行する'] },
      { title: '番号が別のDiscordアカウントに紐付いている', description: '同じ電話番号を複数アカウントで同時に利用できない場合があります。', actions: ['以前使ったDiscordアカウントを確認する', 'アクセス可能なら古いアカウント側の登録状況を確認する', '不明な場合は公式サポートへ状況を伝える'] },
    ],
    ifNotFixed: '使い捨て・仮想番号などで認証を回避せず、Discord公式サポートへ問い合わせてください。確認コードや個人の電話番号を第三者へ送らないでください。',
    faqs: [
      { question: '認証コードを何度送っても届きません', answer: '短時間の再送を止め、SMS拒否設定と通信状態を確認してください。時間を置いても届かない場合は通信会社またはDiscord公式サポートへ確認します。' },
      { question: '使い捨て番号で認証してもよいですか？', answer: 'アカウントへ再アクセスできなくなる危険があるため案内しません。本人が継続して利用できる番号と公式手順を使用してください。' },
    ],
    sources: [discordSupportRequest, discordStatus], related: ['login-error', 'loading-stuck', 'not-opening'], checkedAt: '2026-09-19', status: 'verified',
  },
];
