import type { DiscordArticle } from '@/lib/discord-articles';

const official = (id: string, label: string) => ({
  label: `Discord公式サポート：${label}`,
  url: `https://support.discord.com/hc/ja/articles/${id}`,
});

const status = {
  label: 'Discord Status（公式障害情報）',
  url: 'https://discordstatus.com/',
};

const installerGuide = official('209099387', 'Windowsのインストーラーエラー');
const damagedInstallGuide = official(
  '115004307527',
  'Windowsのインストールの破損',
);
const voiceVideoGuide = official(
  '360045138471',
  '音声・ビデオのトラブルシューティング',
);
const missingInputGuide = official(
  '214925018',
  '音声入力が見つからない・音声トラブル',
);
const errorCodeGuide = official('30952914470807', '音声・動画のエラーコード');
const systemHelperGuide = official('34853435033367', 'Discordシステムヘルパー');
const overlayGuide = official('217659737', 'ゲームオーバーレイ101');

export const discordP0Articles: DiscordArticle[] = [
  {
    slug: 'update-failed',
    category: 'launch',
    title: 'Discordで「Update Failed」が繰り返されるときの直し方',
    shortTitle: 'Update Failed・更新ループ',
    seoTitle: 'Discord「Update Failed」の直し方｜更新ループから進まない場合',
    metaDescription:
      'DiscordのUpdate Failedが繰り返され、更新ループから進まないときのWindows向け対処法。完全終了、障害確認、残存フォルダー削除と再インストールを順に説明します。',
    symptom:
      'Discordを開くと「Update Failed」と表示され、再試行を繰り返してアプリが起動しない、または更新が完了しない場合の手順です。',
    target: 'Windows 11 / Windows 10版 Discordデスクトップアプリ',
    conclusion:
      'まずDiscordをタスクトレイとタスクマネージャーから完全終了し、公式ステータスを確認してください。直らなければ、残っているDiscordフォルダーを削除して公式インストーラーから入れ直します。',
    quickFixes: [
      'タスクトレイとタスクマネージャーからDiscordを完全終了して起動し直す',
      'Discord Statusとインターネット接続を確認する',
      'Discordの残存フォルダーを削除し、公式サイトから再インストールする',
    ],
    causes: [
      {
        title: 'Discordの更新プロセスが残っている',
        description:
          'DiscordやUpdate.exeがバックグラウンドに残っていると、更新ファイルを置き換えられずループすることがあります。',
        actions: [
          '通知領域のDiscordアイコンを右クリックし「Discordを終了」を選ぶ',
          'Ctrl＋Shift＋Escでタスクマネージャーを開く',
          'DiscordやUpdateに関する実行中の項目を終了する',
          'Discordをもう一度起動し、更新が進むか確認する',
        ],
      },
      {
        title: '障害またはネットワークで更新先へ接続できない',
        description:
          'Discord側の障害や一時的な通信不良では、PC内のファイルを変更しても改善しません。',
        actions: [
          'Discord Statusで障害やメンテナンスが出ていないか確認する',
          'ブラウザでほかのサイトが開けるか確認する',
          'VPNまたはプロキシを使用中なら一度切り、Discordを再起動する',
        ],
        note: '障害が発表されている場合は、再インストールせず復旧を待ってください。',
      },
      {
        title: 'ローカルの更新ファイルが破損している',
        description:
          '完全終了しても更新できない場合は、公式のWindowsインストーラーエラー手順で残存データを整理します。',
        actions: [
          '必要な会話内容はサーバー側に保存されますが、ローカル設定を戻せるよう現在の設定を確認する',
          'Windows＋Rで%appdata%を開き、Discordフォルダーを削除する',
          'Windows＋Rで%localappdata%を開き、Discordフォルダーを削除する',
          'PCを再起動し、discord.com/downloadから最新版を再インストールする',
        ],
        note: 'フォルダーを削除できない場合は、Discordのプロセスが残っていないか再確認してください。',
      },
    ],
    ifNotFixed:
      'ブラウザ版が使えるか確認して、アカウントやサービス全体ではなくWindowsアプリ側の問題かを切り分けます。公式手順後もUpdate Failedが続く場合は、表示されたエラーと試した手順を添えてDiscordサポートへ連絡してください。',
    faqs: [
      {
        question: 'Update Failedの画面で待ち続ければ直りますか？',
        answer:
          '一時的な障害や通信不良なら復旧後に進む場合があります。ただし同じ表示が繰り返される場合は、完全終了と公式ステータス確認から切り分けてください。',
      },
      {
        question:
          'AppDataのDiscordフォルダーを削除してもアカウントは消えませんか？',
        answer:
          'Discordアカウントやサーバー上のメッセージは削除されません。ただし端末内のキャッシュや一部のローカル設定は作り直されます。',
      },
      {
        question: 'Update.exeの名前変更は必要ですか？',
        answer:
          'Discord公式のWindowsインストーラーエラー手順は、Discordの完全終了、AppDataとLocalAppDataのDiscordフォルダー削除、再起動、再インストールです。まずは公式手順を優先してください。',
      },
    ],
    sources: [installerGuide, damagedInstallGuide, status],
    related: ['installation-failed', 'not-opening', 'loading-stuck'],
    checkedAt: '2026-09-17',
    status: 'verified',
  },
  {
    slug: 'installation-failed',
    category: 'launch',
    title:
      'Discordで「Installation has failed」が出てインストールできないときの対処法',
    shortTitle: 'Installation has failed',
    seoTitle:
      'Discord「Installation has failed」の直し方｜インストールできない場合',
    metaDescription:
      'DiscordでInstallation has failedが出てインストールできない場合のWindows向け手順。残存プロセス、AppData、再起動、公式インストーラーの順に確認します。',
    symptom:
      'DiscordSetup.exeを実行すると「Installation has failed」などのエラーが出て、インストールまたは再インストールを完了できない場合の手順です。',
    target: 'Windows 11 / Windows 10版 Discordインストーラー',
    conclusion:
      'Discordのプロセスをすべて終了し、%AppData%と%LocalAppData%に残ったDiscordフォルダーを削除してから、PCを再起動して公式インストーラーを実行します。',
    quickFixes: [
      'タスクマネージャーでDiscord関連プロセスをすべて終了する',
      '%AppData%と%LocalAppData%のDiscordフォルダーを削除する',
      'PCを再起動し、公式サイトから入手したインストーラーを実行する',
    ],
    causes: [
      {
        title: '古いDiscordプロセスがファイルを使用している',
        description:
          '以前のDiscordがバックグラウンドに残ると、インストーラーがファイルを更新できません。',
        actions: [
          '通知領域にDiscordがあれば右クリックして終了する',
          'Ctrl＋Shift＋Escでタスクマネージャーを開く',
          'Discordに関するプロセスをすべて終了する',
          'DiscordSetup.exeをもう一度実行する',
        ],
      },
      {
        title: '以前のインストールデータが残っている',
        description:
          'アンインストール後も残るデータが、新しいインストールと競合する場合があります。',
        actions: [
          'Windows＋Rを押して%appdata%を開く',
          'Discordフォルダーを削除する',
          'Windows＋Rを押して%localappdata%を開く',
          'Discordフォルダーを削除する',
        ],
      },
      {
        title: '再起動前の状態または古いインストーラーを使っている',
        description:
          'プロセスや一時ファイルを確実に解放し、公式配布の新しいファイルで試します。',
        actions: [
          'Windowsを再起動する',
          'discord.com/downloadからWindows版をダウンロードする',
          'ダウンロードしたDiscordSetup.exeを実行する',
        ],
        note: '非公式のダウンロードサイトから入手したインストーラーは使用しないでください。',
      },
    ],
    ifNotFixed:
      '公式手順を完了しても失敗する場合は、エラー画面の「Open Setup Log」などから内容を確認し、スクリーンショットとログ、Windowsのバージョン、試した手順を添えてDiscordサポートへ連絡してください。',
    faqs: [
      {
        question: 'Discordをアンインストールしただけでは不十分ですか？',
        answer:
          '以前のデータがAppDataやLocalAppDataに残ることがあります。公式サポートも両方のDiscordフォルダーを削除してから再起動・再インストールする手順を案内しています。',
      },
      {
        question: 'Microsoft Store版へ切り替えてもよいですか？',
        answer:
          '切り分けには使えますが、まずは公式サポートが案内するWindows版のクリーン再インストールを行い、同じエラーが再現するか確認してください。',
      },
      {
        question: 'Discordフォルダーを削除できません',
        answer:
          'Discordのプロセスが残っている可能性があります。タスクマネージャーとスタートアップ項目を確認し、難しければPC再起動直後に削除してください。',
      },
    ],
    sources: [installerGuide, damagedInstallGuide],
    related: ['update-failed', 'not-opening', 'loading-stuck'],
    checkedAt: '2026-09-17',
    status: 'verified',
  },
  {
    slug: 'audio-input-not-found',
    category: 'audio',
    title: 'Discordで「オーディオ入力が見つかりません」と出るときの直し方',
    shortTitle: 'オーディオ入力が見つからない',
    seoTitle: 'Discordでオーディオ入力が見つからない・マイクを認識しない場合',
    metaDescription:
      'Discordでオーディオ入力が見つからない、入力デバイスが表示されない、マイクを認識しない場合のWindows向け切り分け手順です。',
    symptom:
      'Discordの音声設定に「オーディオ入力が見つかりません」と表示される、入力デバイス一覧にマイクが出ない、またはマイクテストへ音が入らない場合の手順です。',
    target: 'Windows 11 / Windows 10版 Discordデスクトップアプリ・ブラウザ版',
    conclusion:
      'まずWindowsがマイクを認識しているかを確認し、Discordの入力デバイスを明示的に選びます。ブラウザ版ではサイトのマイク権限も確認してください。',
    quickFixes: [
      'Windowsのサウンド設定で対象マイクに入力レベルが表示されるか確認する',
      'Discordの「音声・ビデオ」で正しい入力デバイスを選ぶ',
      'Windowsまたはブラウザのマイク権限を許可してDiscordを再起動する',
    ],
    causes: [
      {
        title: 'Windowsがマイクを認識していない',
        description:
          'Discordより前の段階で入力がない場合は、接続やWindows側を先に確認します。',
        actions: [
          'Windowsの「設定」から「システム」→「サウンド」を開く',
          '入力欄に使用するマイクが表示されるか確認する',
          '話したときに入力音量のメーターが動くか確認する',
          'USBマイクなら接続し直し、別のUSBポートでも試す',
        ],
      },
      {
        title: 'Discordで別の入力デバイスが選ばれている',
        description:
          '既定デバイスの変更後もDiscordが以前のマイクを選び続けることがあります。',
        actions: [
          'Discordのユーザー設定を開く',
          '「音声・ビデオ」の音声タブを開く',
          '入力デバイスで実際に使うマイクを選ぶ',
          'マイクテストで自分の声が再生されるか確認する',
        ],
      },
      {
        title: 'マイク権限または音声設定が崩れている',
        description:
          'Windowsのプライバシー設定やブラウザのサイト権限で入力が止められている場合があります。',
        actions: [
          'Windowsの「プライバシーとセキュリティ」→「マイク」を開く',
          'マイクへのアクセスとデスクトップアプリのアクセスを許可する',
          'ブラウザ版はアドレスバーのサイト設定でdiscord.comのマイクを許可する',
          '直らなければDiscordの音声・ビデオ設定をリセットして再設定する',
        ],
      },
    ],
    ifNotFixed:
      'Windowsのボイスレコーダーなど別アプリでも入力できない場合は、Discordではなく機器・接続・ドライバー側の問題です。別アプリでは使える場合は、Discordの設定画面とマイクテスト結果を添えて公式サポートへ連絡してください。',
    faqs: [
      {
        question: '入力デバイスを「Default」のままにしてよいですか？',
        answer:
          '既定デバイスが正しければ使えますが、切り分け時はマイク名を明示的に選ぶと、別デバイスへ切り替わっている問題を除外できます。',
      },
      {
        question: 'ブラウザ版だけマイクが見つかりません',
        answer:
          'ブラウザのサイト権限でdiscord.comのマイク利用が拒否されていないか確認し、許可後にページを再読み込みしてください。',
      },
      {
        question: 'Bluetoothヘッドセットが入力に出ません',
        answer:
          'Windowsのサウンド設定でヘッドセットの入力デバイス自体が表示されるか確認してください。表示されない場合はBluetoothの再接続とWindows側の入力確認を先に行います。',
      },
    ],
    sources: [missingInputGuide, voiceVideoGuide],
    related: ['mic-not-working', 'cant-hear-voice', 'error-1003'],
    checkedAt: '2026-09-17',
    status: 'verified',
  },
  {
    slug: 'error-1001',
    category: 'screen',
    title: 'Discordエラー1001の直し方｜配信・画面共有で音が出ない場合',
    shortTitle: 'エラー1001・配信音が出ない',
    seoTitle: 'Discordエラー1001の直し方｜配信・画面共有で音が出ない場合',
    metaDescription:
      'Discordの画面共有でエラー1001が出て配信音が共有できない場合の対処法。サウンド共有権限、共有対象、アプリ再起動を順に確認します。',
    symptom:
      'Go Liveや画面共有の映像は見えるのに音が出ず、エラー1001やサウンドを配信できない旨の表示が出る場合の手順です。',
    target: 'Windows版 DiscordデスクトップアプリのGo Live・画面共有',
    conclusion:
      'エラー1001は、Discordが共有対象アプリの音声を取得できないときの公式エラーです。表示されたサウンド共有権限を許可し、画面全体ではなく音を出しているアプリを選び直します。',
    quickFixes: [
      '配信開始時に表示されるサウンド共有の権限を許可する',
      '画面全体ではなく、音を出しているゲームやアプリを共有対象にする',
      '配信を止め、Discordと共有対象アプリを再起動してからやり直す',
    ],
    causes: [
      {
        title: 'サウンド共有の権限が許可されていない',
        description:
          'Discord公式は、アプリ音声を取得するためにシステムレベルの権限が必要と案内しています。',
        actions: [
          'いったん画面共有を停止する',
          '同じゲームまたはアプリを選んで配信を開始する',
          'サウンド共有の許可画面が出たら「アクセスを許可」を選ぶ',
          '視聴者にアプリ音声が聞こえるか確認する',
        ],
      },
      {
        title: '音声を取得できない共有対象を選んでいる',
        description:
          '画面全体の共有ではなく、音を再生しているアプリのウィンドウを選ぶと切り分けやすくなります。',
        actions: [
          '共有するゲームまたはアプリを起動する',
          'Discordの「画面を共有する」を開く',
          '画面全体ではなく対象アプリを選ぶ',
          'サウンド共有が有効になっていることを確認して配信する',
        ],
      },
      {
        title: '配信セッションまたはアプリの音声取得が止まっている',
        description:
          '権限を許可済みなら、配信とアプリを作り直して一時的な状態をリセットします。',
        actions: [
          '画面共有を停止してボイスチャンネルから退出する',
          'Discordをタスクトレイから完全終了する',
          '共有するゲームまたはアプリも終了する',
          '両方を起動し直してから配信を開始する',
        ],
      },
    ],
    ifNotFixed:
      '別のアプリを共有したときにも1001が出るか確認してください。特定のゲームだけなら、そのゲームの音声取得との相性である可能性があります。すべてのアプリで出る場合は、公式エラーコードガイドと一般の配信音声記事を確認し、エラー画面を添えてサポートへ連絡します。',
    faqs: [
      {
        question: 'エラー1001はマイクのエラーですか？',
        answer:
          'Discord公式では「サウンド共有の問題」とされ、配信するアプリの音声をDiscordが取得できない場合のエラーです。マイク入力とは分けて確認します。',
      },
      {
        question: '映像が見えていてもサウンド共有権限は必要ですか？',
        answer:
          'はい。公式案内では、権限がない場合も映像の配信は続きますが、視聴者は共有アプリの音声を聞けません。',
      },
      {
        question: '画面全体の共有で音を出せますか？',
        answer:
          '環境や共有方法で音声の扱いが異なるため、切り分け時は音を出しているアプリ単体を共有対象にしてください。',
      },
    ],
    sources: [errorCodeGuide, status],
    related: ['stream-no-audio', 'screen-share-not-working', 'error-1002'],
    checkedAt: '2026-09-17',
    status: 'verified',
  },
  {
    slug: 'error-1002',
    category: 'audio',
    title: 'Discordエラー1002の直し方｜ノイズキャンセラーエラーの対処法',
    shortTitle: 'エラー1002・ノイズキャンセラー',
    seoTitle: 'Discordエラー1002の直し方｜ノイズキャンセラーエラー',
    metaDescription:
      'Discordエラー1002が出たときの対処法。通話への再参加、Discordの完全再起動、ノイズ抑制の切り分けを公式案内に沿って説明します。',
    symptom:
      'Discordの通話中にエラー1002が表示され、ノイズキャンセラーまたはノイズ抑制が正常に動作しない場合の手順です。',
    target: 'Windows版 Discordデスクトップアプリの音声通話',
    conclusion:
      'エラー1002は、Discord公式ではバックグラウンドノイズキャンセラーの内部エラーです。まず通話から退出して再参加し、続く場合はDiscordを最小化ではなく完全終了して再起動します。',
    quickFixes: [
      'ボイスチャンネルまたは通話から退出して再参加する',
      'Discordをタスクトレイから完全終了して再起動する',
      'ノイズ抑制を一時的にオフにして通話できるか確認する',
    ],
    causes: [
      {
        title: 'ノイズキャンセラーの接続状態が一時的に崩れている',
        description:
          'Discord公式が最初に案内しているのは、通話への再参加による接続のリセットです。',
        actions: [
          '現在のボイスチャンネルまたは通話から退出する',
          '数秒待って同じ通話へ再参加する',
          'エラー1002が再表示されるか確認する',
        ],
      },
      {
        title: 'Discordの音声処理が残ったままになっている',
        description:
          'ウィンドウを閉じただけではDiscordが通知領域に残るため、完全終了して再読み込みします。',
        actions: [
          '通知領域のDiscordアイコンを右クリックする',
          '「Discordを終了」を選ぶ',
          'タスクマネージャーにDiscordが残っていないか確認する',
          'Discordを起動し直して通話へ入る',
        ],
      },
      {
        title: 'ノイズ抑制機能との相性を切り分ける',
        description:
          '再参加と再起動で直らない場合は、公式の音声トラブル手順に沿ってノイズ抑制を一時的に無効化します。',
        actions: [
          'Discordのユーザー設定から「音声・ビデオ」を開く',
          '音声タブのノイズ抑制を一時的にオフにする',
          '同じ通話へ参加して1002が出るか確認する',
          '確認後、必要に応じて設定を戻す',
        ],
      },
    ],
    ifNotFixed:
      'Discordを最新版へ更新し、別の入力デバイスでも1002が出るか確認してください。発生時刻、使用デバイス、ノイズ抑制の設定、エラー画面を添えてDiscordサポートへ連絡すると状況を伝えやすくなります。',
    faqs: [
      {
        question: 'エラー1002が出ても通話は続けられますか？',
        answer:
          '通話できる場合でも、ノイズキャンセラーが正常に動作していない可能性があります。まず退出・再参加と完全再起動でエラーが消えるか確認してください。',
      },
      {
        question: 'ノイズ抑制をオフにしたままでよいですか？',
        answer:
          '一時的な切り分けとしては問題ありません。周囲の音が入りやすくなるため、エラー解消後は必要に応じてオンへ戻してください。',
      },
      {
        question: '1002と1003は同じエラーですか？',
        answer:
          '異なります。1002はノイズキャンセラーの内部エラー、1003はマイク入力レートの重大な不一致による音声の歪みとして公式に案内されています。',
      },
    ],
    sources: [errorCodeGuide, voiceVideoGuide],
    related: ['error-1003', 'mic-not-working', 'cant-hear-voice'],
    checkedAt: '2026-09-17',
    status: 'verified',
  },
  {
    slug: 'error-1003',
    category: 'audio',
    title: 'Discordエラー1003の直し方｜声がロボットのようになる場合',
    shortTitle: 'エラー1003・ロボット声',
    seoTitle: 'Discordエラー1003の直し方｜ロボット声・音声入力エラー',
    metaDescription:
      'Discordエラー1003で声がロボットのように歪む、遅くなる場合の対処法。入出力デバイスの分離、マイク変更、通話への再参加を説明します。',
    symptom:
      'Discordの通話でエラー1003が表示され、自分の声がロボットのように歪む、遅くなる、または音声がおかしくなる場合の手順です。',
    target: 'Windows版 Discordデスクトップアプリの音声通話',
    conclusion:
      'エラー1003は、Discordがマイク入力レートの重大な不一致を検出したときの公式エラーです。入力と出力に別々のデバイスを使い、別マイクまたは別出力へ切り替えて確認します。',
    quickFixes: [
      'ボイスチャンネルから退出して再参加する',
      '入力と出力に別々のデバイスを選ぶ',
      '別のマイクまたは別の出力デバイスへ切り替える',
    ],
    causes: [
      {
        title: '通話セッション内で入力レートの不一致が起きている',
        description:
          '最初にボイスチャンネルへ入り直し、現在の音声接続を作り直します。',
        actions: [
          '現在のボイスチャンネルまたは通話から退出する',
          '数秒待ってから同じ通話へ再参加する',
          '相手に声の歪みが消えたか確認してもらう',
        ],
      },
      {
        title: '同じヘッドセットの入出力で不一致が起きている',
        description:
          'Discord公式は、入力と出力を別々のデバイスに分ける方法を案内しています。',
        actions: [
          'Discordのユーザー設定から「音声・ビデオ」を開く',
          '入力デバイスにUSBマイクなどを選ぶ',
          '出力デバイスに別のヘッドフォンまたはスピーカーを選ぶ',
          'マイクテストまたは通話で音声を確認する',
        ],
      },
      {
        title: '使用中のマイクまたは出力デバイス側で再現している',
        description:
          '利用できる別デバイスへ切り替え、特定のヘッドセットだけで起きるかを確認します。',
        actions: [
          '入力デバイスを別のマイクへ切り替える',
          '直らなければ出力デバイスも別の機器へ切り替える',
          '変更後にボイスチャンネルへ入り直す',
          'どの組み合わせで1003が消えるか記録する',
        ],
      },
    ],
    ifNotFixed:
      '別の入出力デバイスの組み合わせでも1003が続く場合は、Discordを完全再起動し、音声・ビデオ設定のリセットを試します。エラーが出るデバイス名と組み合わせ、発生時刻を添えて公式サポートへ連絡してください。',
    faqs: [
      {
        question: 'エラー1003は回線が遅いことが原因ですか？',
        answer:
          'Discord公式では、マイク入力レートの重大な不一致により音声が歪むエラーと説明されています。まず入出力デバイスを分ける切り分けを優先してください。',
      },
      {
        question: 'ゲームヘッドセットで起きやすいですか？',
        answer:
          '公式案内では、同じデバイスが入力と出力を兼ねるゲームヘッドセットなどでよく起きるとされています。別マイクと別ヘッドフォンの組み合わせを試してください。',
      },
      {
        question: 'Windowsのサンプルレートを変更する必要がありますか？',
        answer:
          'Discord公式の1003向け手順は、入出力デバイスの分離、別マイク・別出力への変更、通話への再参加です。まずは公式手順を優先してください。',
      },
    ],
    sources: [errorCodeGuide, voiceVideoGuide],
    related: ['audio-input-not-found', 'mic-not-working', 'error-1002'],
    checkedAt: '2026-09-17',
    status: 'verified',
  },
  {
    slug: 'system-helper',
    category: 'game',
    title:
      'Discordシステムヘルパーとは？ゲーム中にキー割り当てが効かない場合の対処法',
    shortTitle: 'システムヘルパー・キー割り当て',
    seoTitle:
      'Discordシステムヘルパーとは？ゲーム中にキー割り当てが効かない場合',
    metaDescription:
      'Discordシステムヘルパーの役割と、ゲーム中にPush-to-Talkやオーバーレイのキー割り当てが効かない場合のWindows向け手順を説明します。',
    symptom:
      '管理者権限で動くゲーム中だけDiscordのPush-to-Talk、オーバーレイ切り替え、ゲーム用ショートカットが反応しない場合の手順です。',
    target: '一部ユーザー向けWindows版 Discordデスクトップアプリ',
    conclusion:
      'Discordシステムヘルパーは、権限が異なるゲームでキー割り当てを動作させるための公式の実験的機能です。Discord内に案内が表示された場合だけ、内容を確認して管理者権限を許可しインストールします。',
    quickFixes: [
      'Discordのキー割り当てが通常画面では動くか確認する',
      'ゲームオーバーレイ、キー割り当て、音声・ビデオ、Windows設定に案内があるか確認する',
      '公式の案内が表示された場合だけシステムヘルパーをインストールする',
    ],
    causes: [
      {
        title: 'ゲームとDiscordの権限レベルが異なる',
        description:
          '権限の高いゲームでは、通常権限のDiscordがキー入力を登録できない場合があります。',
        actions: [
          'Discordのキー割り当て設定で対象ショートカットを確認する',
          'ゲームを閉じた状態でショートカットが反応するか確認する',
          'ゲーム中だけ効かない場合はDiscord内のシステムヘルパー案内を確認する',
        ],
      },
      {
        title: 'Discordシステムヘルパーをインストールする',
        description:
          '公式案内が表示される一部ユーザーは、プロンプトから実験的なシステムヘルパーを導入できます。',
        actions: [
          'ゲームオーバーレイ、キー割り当て、音声・ビデオ、Windows設定のいずれかを開く',
          'システムヘルパーの案内が表示されたら「インストールする」を選ぶ',
          'Windowsの管理者権限プロンプトの発行元と内容を確認して許可する',
          'インストール後に対応ゲームでキー割り当てを確認する',
        ],
        note: '公式によると現在は実験段階で、Windowsデスクトップ版の一部ユーザーだけが利用できます。表示されない場合に外部サイトから入手しないでください。',
      },
      {
        title: 'キー割り当て自体を作り直す',
        description:
          'ヘルパー導入後も反応しない場合は、競合するキーや設定を切り分けます。',
        actions: [
          'Discordの「キー割り当て」を開く',
          '対象のPush-to-Talkまたはオーバーレイ操作を削除する',
          'ゲーム内ショートカットと重複しないキーで登録し直す',
          'Discordとゲームを再起動して確認する',
        ],
      },
    ],
    ifNotFixed:
      'システムヘルパーが表示されない場合は、未提供のアカウント・環境である可能性があります。Discordを最新版にし、通常権限のゲームでもキー割り当てが効かないか確認して、利用環境と症状を公式サポートへ伝えてください。',
    faqs: [
      {
        question: 'Discordシステムヘルパーは全員に必要ですか？',
        answer:
          'いいえ。公式では、権限の異なるゲームでキー割り当てなどを動作させるための実験的機能で、Windowsデスクトップ版の一部ユーザーだけに提供されています。',
      },
      {
        question: 'ブラウザ版やスマホ版にも必要ですか？',
        answer:
          '必要ありません。Discord公式はモバイル版とウェブ版には対応しておらず、必要でもないと案内しています。',
      },
      {
        question: 'システムヘルパーが見つかりません',
        answer:
          '一部ユーザー向けの実験機能です。Discord内に公式の案内がない場合は、外部サイトからファイルを入手せず、通常のキー割り当て確認を行ってください。',
      },
    ],
    sources: [systemHelperGuide, overlayGuide],
    related: ['overlay-not-showing', 'mic-not-working', 'not-opening'],
    checkedAt: '2026-09-17',
    status: 'verified',
  },
  {
    slug: 'overlay-not-showing',
    category: 'game',
    title: 'Discordのゲームオーバーレイが表示されないときの直し方',
    shortTitle: 'ゲームオーバーレイが表示されない',
    seoTitle: 'Discordのオーバーレイが表示されないときの対処法【PC】',
    metaDescription:
      'Discordのゲームオーバーレイが表示されない、ショートカットが効かない場合のWindows向け対処法。機能の有効化、キー割り当て、システムヘルパーを確認します。',
    symptom:
      'ゲーム中にDiscordのオーバーレイが表示されない、通知やボイス参加者が出ない、オーバーレイのショートカットが反応しない場合の手順です。',
    target: 'Windows版 Discordデスクトップアプリのゲームオーバーレイ',
    conclusion:
      'まずDiscordのゲームオーバーレイを有効にし、表示用キー割り当てを確認します。管理者権限のゲーム中だけ効かない場合は、Discord内にシステムヘルパーの案内があるか確認してください。',
    quickFixes: [
      'ユーザー設定の「ゲームオーバーレイ」で機能を有効にする',
      'オーバーレイの表示・非表示ショートカットを確認する',
      '権限の高いゲームならDiscordシステムヘルパーの案内を確認する',
    ],
    causes: [
      {
        title: 'ゲームオーバーレイが無効になっている',
        description:
          'Discord公式の案内に沿って、Windows版のオーバーレイ機能を有効にします。',
        actions: [
          'Discord左下の歯車からユーザー設定を開く',
          '「ゲームオーバーレイ」を開く',
          'オーバーレイを有効にするトグルをオンにする',
          'ゲームへ戻り、表示されるか確認する',
        ],
        note: '公式ではゲームオーバーレイはWindowsのみ対応で、macOSとLinuxでは動作しません。',
      },
      {
        title: 'ショートカットまたは通知設定が合っていない',
        description:
          'オーバーレイが有効でも、表示用キーや表示する内容の設定で見えない場合があります。',
        actions: [
          'ゲームオーバーレイ設定で表示・非表示のキー割り当てを確認する',
          'ゲーム内操作と重複しないキーへ変更する',
          'メッセージを表示したい場合はメッセージ設定を有効にする',
          'サーバーやDMがミュートされていないか確認する',
        ],
      },
      {
        title: 'ゲームの権限がDiscordより高い',
        description:
          'ゲーム中だけキー割り当てが効かない場合は、公式のシステムヘルパー対象かを確認します。',
        actions: [
          'ゲームを閉じた状態でオーバーレイのキー割り当てが反応するか確認する',
          'Discordのゲームオーバーレイ設定にシステムヘルパーの案内があるか確認する',
          '案内がある場合だけ、公式プロンプトからインストールする',
          'Discordとゲームを再起動して確認する',
        ],
      },
    ],
    ifNotFixed:
      '特定のゲームだけで表示されないか確認してください。また、オーバーレイを有効にするとラグやクラッシュが起きるゲームでは、Discord公式もそのゲームでの無効化を推奨しています。ゲーム名、表示されない機能、試したキー割り当てを添えてサポートへ連絡してください。',
    faqs: [
      {
        question: 'DiscordオーバーレイはMacやLinuxで使えますか？',
        answer:
          'Discord公式ではゲームオーバーレイはWindows OSのみ対応で、macOSとLinuxでは動作しないと案内されています。',
      },
      {
        question: 'オーバーレイを有効にするとゲームが重くなります',
        answer:
          'Discord公式は、オーバーレイ有効時にラグやクラッシュが起きる場合、そのゲームでは無効にすることを推奨しています。',
      },
      {
        question: '通知だけ表示されません',
        answer:
          'ゲームオーバーレイのメッセージ設定に加え、対象サーバー・DMのミュート状態と配信モードの設定を確認してください。',
      },
    ],
    sources: [overlayGuide, systemHelperGuide],
    related: ['system-helper', 'screen-share-not-working', 'not-opening'],
    checkedAt: '2026-09-17',
    status: 'verified',
  },
  {
    slug: 'notifications-not-working',
    category: 'launch',
    title:
      'Discordの通知が来ない・メンションに気づかないときの設定確認【PC版】',
    shortTitle: '通知が来ない',
    seoTitle:
      'Discordの通知が来ない・メンションに気づかないときの設定確認【PC版】',
    metaDescription:
      'Discordの通知が来ない、メンション通知が表示されない場合の確認方法。サーバーのミュート、通知レベル、チャンネルごとの上書き、Windows通知を順に確認します。',
    symptom:
      'Discordにメッセージやメンションは届いているのにデスクトップ通知が出ない、または特定のサーバー・チャンネルだけ通知されない場合の手順です。',
    target: 'Windows版 Discordデスクトップアプリ',
    conclusion:
      '特定のサーバーだけ通知が来ない場合は、そのサーバーのミュート、通知レベル、チャンネルごとの通知上書きを順に確認します。全体で来ない場合はWindowsの通知設定も確認してください。',
    quickFixes: [
      '対象サーバーがミュートされていないか確認する',
      'サーバーの通知レベルとチャンネルごとの通知上書きを確認する',
      'WindowsでDiscordの通知が許可されているか確認する',
    ],
    causes: [
      {
        title: 'サーバー全体がミュートされている',
        description:
          'サーバーをミュートすると、そのサーバー内のチャンネル通知がまとめて抑制されます。',
        actions: [
          '対象サーバー名を右クリックする',
          '「通知設定」を開く',
          'サーバー全体のミュート状態を確認する',
          '必要な通知レベルへ変更してテストする',
        ],
      },
      {
        title: 'チャンネル単位の通知設定で上書きされている',
        description:
          'サーバー設定が有効でも、個別チャンネルが「通知なし」やミュートに上書きされている場合があります。',
        actions: [
          '対象サーバーの通知設定を開く',
          '通知設定の上書き一覧を確認する',
          '該当チャンネルの設定を確認する',
          '「すべて」または「メンション」など必要な設定へ変更する',
        ],
      },
      {
        title: 'Windows側でDiscordの通知が止められている',
        description:
          'すべてのサーバーで通知が出ない場合は、OS側の通知許可や集中モードを切り分けます。',
        actions: [
          'Windowsの「設定」から「システム」→「通知」を開く',
          'Discordの通知が許可されているか確認する',
          '集中モードまたは通知を抑制する設定が有効でないか確認する',
          'Discordを完全終了して起動し直し、通知をテストする',
        ],
      },
    ],
    ifNotFixed:
      'DiscordとWindowsの設定が正しい場合は、別のサーバー・DMでも通知されないか確認してください。発生する通知種別、サーバー、Windowsの通知設定を記録してDiscordサポートへ連絡します。',
    faqs: [
      {
        question: '特定のサーバーだけ通知が来ません',
        answer:
          'そのサーバーのミュート状態、通知レベル、チャンネルごとの通知上書きを順に確認してください。',
      },
      {
        question: 'メンションだけ通知を受ける設定はできますか？',
        answer:
          'Discordのサーバー通知設定では、メンションのみを受ける通知レベルを選べます。チャンネル単位の上書きもあわせて確認してください。',
      },
      {
        question: 'Discordを開いている間だけ通知が出ません',
        answer:
          '通知の表示条件やWindows側の通知設定が影響する場合があります。DMとサーバー通知を分けてテストし、どの状態で出ないか切り分けてください。',
      },
    ],
    sources: [official('215253258', '通知設定101')],
    related: ['overlay-not-showing', 'loading-stuck', 'not-opening'],
    checkedAt: '2026-09-17',
    status: 'verified',
  },
  {
    slug: 'screen-share-black-screen',
    category: 'screen',
    title: 'Discordの画面共有が真っ黒・黒画面になるときの確認方法',
    shortTitle: '画面共有が真っ黒になる',
    seoTitle: 'Discordの画面共有が真っ黒・黒画面になるときの確認方法',
    metaDescription:
      'Discordの画面共有が真っ黒で相手に映らない場合の確認方法。共有対象、Discordの再起動、OS権限、保護コンテンツかを順に切り分けます。',
    symptom:
      'Discordの画面共有は開始できるのに相手側では映像が黒い、または特定のゲーム・アプリだけ真っ黒になる場合の手順です。',
    target: 'Windows版 Discordデスクトップアプリの画面共有・Go Live',
    conclusion:
      '共有対象を選び直し、Discordと共有アプリを再起動します。通常のアプリは映るのに特定コンテンツだけ黒い場合は、コンテンツ側のキャプチャ制限も切り分けてください。',
    quickFixes: [
      '画面共有を止め、共有するゲームまたはアプリを選び直す',
      'Discordと共有対象アプリを完全終了して起動し直す',
      '通常アプリも黒いか、特定コンテンツだけ黒いか確認する',
    ],
    causes: [
      {
        title: '共有対象が正しく選ばれていない',
        description:
          '画面全体とアプリ単体では取得方法が異なるため、共有したいアプリを選び直します。',
        actions: [
          'いったん画面共有を停止する',
          '共有したいゲームまたはアプリを先に起動する',
          'Discordで対象アプリのウィンドウを選ぶ',
          '共有を開始し、相手側の映像を確認する',
        ],
      },
      {
        title: 'Discordまたは共有アプリの描画状態が止まっている',
        description:
          '一時的な描画・取得の状態をリセットするため、両方のアプリを完全終了します。',
        actions: [
          'Discordを通知領域から完全終了する',
          '共有するゲームまたはアプリも終了する',
          'Discordを起動してから共有対象アプリを起動する',
          'もう一度アプリ単体を共有する',
        ],
      },
      {
        title: '特定コンテンツで画面キャプチャが制限されている',
        description:
          '著作権保護などにより、特定の動画だけ画面キャプチャが制限される場合があります。',
        actions: [
          'ブラウザの通常ページや別アプリが共有できるか確認する',
          '特定の動画・サービスだけ黒いか切り分ける',
          '制限を回避せず、提供元が認める視聴・共有方法を利用する',
        ],
      },
    ],
    ifNotFixed:
      '通常のアプリやデスクトップも黒い場合は、Discordを最新版へ更新し、別の共有対象でも再現するか確認してください。ゲーム名・アプリ名、共有方法、黒画面のスクリーンショットを添えて公式サポートへ連絡します。',
    faqs: [
      {
        question: '音は出るのに画面だけ黒い場合は？',
        answer:
          '共有対象をアプリ単体で選び直し、通常アプリでも同じ症状か確認してください。音声共有のエラーとは分けて切り分けます。',
      },
      {
        question: '特定の動画サービスだけ真っ黒です',
        answer:
          '保護されたコンテンツでは画面キャプチャが制限される場合があります。制限を回避する方法ではなく、提供元の正式な視聴・共有方法を利用してください。',
      },
      {
        question: 'ゲームだけ黒画面になります',
        answer:
          'ゲームを起動してからアプリ単体を共有し直し、別のゲームやアプリでは映るか確認してください。特定タイトルだけならゲーム固有の描画方式との相性が考えられます。',
      },
    ],
    sources: [official('33030151293079', '音声・ビデオ・配信ガイド')],
    related: ['screen-share-not-working', 'stream-no-audio', 'error-1001'],
    checkedAt: '2026-09-17',
    status: 'verified',
  },
];
