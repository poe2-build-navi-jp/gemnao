import type { GameArticle } from '@/lib/game-articles';
import type { GameGuide } from '@/lib/games';

const sources = {
  matchmaking: { label: 'Embark公式：マッチングのトラブルシューティング', url: 'https://id.embark.games/arc-raiders/support/faq/148-matchmaking-troubleshooting---pc-console' },
  clock: { label: 'Embark公式：端末の時計を同期する', url: 'https://id.embark.games/arc-raiders/support/faq/223-syncing-your-device-clock' },
  voice: { label: 'Embark公式：PC版ボイスチャットのトラブルシューティング', url: 'https://id.embark.games/arc-raiders/support/faq/156-troubleshooting-voice-chat---pc' },
  communication: { label: 'Embark公式：ゲーム内コミュニケーション', url: 'https://id.embark.games/arc-raiders/support/faq/159-in-game-communication' },
  patch: { label: 'Embark公式：Frozen Trail 2.0更新と既知の問題（2026年10月8日）', url: 'https://arcraiders.com/news/frozen-trail-2-0-update' },
  support: { label: 'Embark公式：ARC Raidersサポート', url: 'https://id.embark.games/arc-raiders/support' },
  specs: { label: 'Embark公式：PC動作環境', url: 'https://id.embark.games/arc-raiders/support/faq/154-pc-system-requirements-1759329994' },
};

export const arcRaidersGuide: GameGuide = {
  slug: 'arc-raiders', title: 'ARC Raiders（アークレイダース）', shortTitle: 'ARC Raiders',
  hubTitle: 'ARC Raidersでマッチングしない・VCが使えない時のPC版ガイド',
  lead: '出撃が始まらない時は時計・クロスプレイ・地域設定を、声が届かない時はパーティ／近接VCと入力マイクを確認。症状に合う記事から、変更前後の結果を比べながら切り分けます。',
  accent: '#b06c35', demand: 'PC版のマッチング・ボイスチャットを症状別に確認', updated: '2026-10-08',
  tags: ['マッチングしない', '近接VC', 'パーティVC', 'マイク', 'クロスプレイ', '時計同期'], focused: true,
  savePath: '', configPath: '', fps: '', ultrawide: '', hdr: '', controller: '', mod: '', japanese: '',
  launchFixes: ['通常マップとマップ条件付きの出撃で症状が違うなら、端末の時計を同期する', 'パーティ全員のクロスプレイ設定と、Gameplay → ServerのAutomaticを確認する', '声だけが届かないなら、ボイスチャット記事で入力機器・送信方式・Windowsのマイク権限を確認する'],
  specs: { minimum: 'Windows 10以降64bit／Core i5-6600K・Ryzen 5 1600／メモリ12GB／GTX 1050 Ti・RX 580・Arc A380', recommended: 'Core i5-9600K・Ryzen 5 3600／メモリ16GB／RTX 2070・RX 5700 XT・Arc B570', storage: 'リンク先の公式PC要件には容量の記載なし。インストール時の最新表示を確認' },
  sources: [sources.matchmaking, sources.voice, sources.specs, sources.patch],
};

type Draft = Omit<GameArticle, 'gameSlug' | 'checkedAt' | 'status' | 'symptoms' | 'seoTitle'>;
const make = (draft: Draft): GameArticle => ({ gameSlug: 'arc-raiders', checkedAt: '2026-10-08', status: 'verified', symptoms: draft.steps.map(s => ({ label: s.title, target: s.id })), seoTitle: draft.title, ...draft });

export const arcRaidersArticles: GameArticle[] = [
  make({
    slug: 'matchmaking', category: 'server', title: 'ARC Raidersでマッチングしない時の対処法｜時計・クロスプレイ・地域設定【PC】', shortTitle: 'マッチングしない',
    symptom: 'ロビーには入れるのに出撃先が決まらない、フレンドと組むと待ち時間が長い、通常マップには入れるがマップ条件付きの出撃ができない人向けです。',
    conclusion: 'まず通常マップと条件付きマップ、ソロとパーティで症状が違うか記録します。時計同期、パーティ全員のクロスプレイ設定、サーバー地域のAutomaticを順に確認し、変えた項目と結果を残してください。',
    description: 'Embark公式が案内するPC版の設定を、症状別に選べるよう整理しました。ログイン自体が失敗する場合や、公式に障害が案内されている場合は、同じ設定変更を繰り返さず該当する公式案内を優先します。',
    targetVersion: 'PC版／公式サポートと2026年10月8日の更新情報を確認',
    quickFacts: [{ label: '条件付きマップだけ入れない', value: '端末の時計同期を確認' }, { label: 'フレンドと組んだ時だけ遅い', value: 'クロスプレイ設定はパーティ内の制限が強い側にそろう' }, { label: '地域設定', value: 'Gameplay → Server → Automatic（公式の英語表記）' }],
    diagnosis: [{ symptom: '通常マップは入れるが条件付きマップに入れない', cause: '端末の時計ずれが原因候補', stepId: 'sync-clock' }, { symptom: 'パーティで待ち時間が長くなる', cause: 'メンバーのクロスプレイ設定が原因候補', stepId: 'crossplay' }, { symptom: '地域を手動指定している', cause: '地域設定を公式推奨のAutomaticと比較する', stepId: 'server-region' }],
    steps: [
      { id: 'record-symptom', title: '出撃できない範囲と公式のお知らせを確認する', summary: '同じ「入れない」でも、ログイン失敗とマッチング待ちは分けて記録します。', time: '約2分', risk: 'low', nextStepId: 'sync-clock', actions: ['ロビーが開くか、マッチング開始後に止まるか、表示されたエラーの全文を控える', 'すでに試した範囲で、通常マップ／条件付きマップ、ソロ／パーティの違いをメモする。比較のために進行中のレイドを退出しない', '記事末尾の公式サポートと更新情報を開く。該当する障害・メンテナンスが案内されていれば、その復旧案内を優先する'], note: '本記事の確認日を「今サーバーが正常」という意味には使えません。リアルタイムの稼働状態を保証する記事ではありません。' },
      { id: 'sync-clock', title: 'Windowsの時計を同期してPCを再起動する', summary: '条件付きマップに入れない場合にも公式が案内している確認です。', time: '約3〜5分', risk: 'low', nextStepId: 'crossplay', actions: ['ゲームを終了し、作業中のファイルを保存する', 'Windowsの「設定」→「時刻と言語」→「日付と時刻」を開き、「時刻を自動的に設定する」をオンにする', '「今すぐ同期」を実行する。表記や位置はWindowsの版で異なる場合がある', '同期完了後にPCを再起動し、ARC Raidersで同じ症状が残るか確認する'], note: '管理されたPCで変更できない場合は無理に制限を外さず、管理者へ相談してください。' },
      { id: 'crossplay', title: 'パーティ全員のクロスプレイ設定を確認する', summary: '自分だけオンでも、ほかのメンバーがオフならパーティの検索条件は制限されます。', time: '約2分', risk: 'low', nextStepId: 'server-region', actions: ['クロスプレイを無効にしているメンバーがいないか、パーティ内で確認する', 'メンバーが異なるプラットフォームとの対戦を許容する場合だけ、各自の設定でクロスプレイを有効にして比較する', 'オフを維持したい場合はその選択を尊重し、次の地域設定へ進む。オンへの変更は即時マッチングを保証しない'], note: 'クロスプレイ項目までの日本語メニュー名は未確認のため、ここでは断定していません。' },
      { id: 'server-region', title: 'サーバー地域をAutomaticで比較する', summary: '公式PC案内はGameplay → Server → Automaticです。', time: '約1分', risk: 'low', nextStepId: 'support-record', actions: ['ゲーム画面右下の歯車から設定を開く', 'Gameplay → Serverを開き、変更前の値を控えてAutomaticを選ぶ（公式の英語表記）', 'ほかの条件を一度に変えず、出撃待ちの状態が変わるか確認する'] },
      { id: 'support-record', title: '直らなければ結果を整理して公式サポートへ進む', summary: '効果がなかった変更を増やすより、どこまで進むかを伝えます。', time: '約3分', risk: 'low', actions: ['発生日時とタイムゾーン、PC版の利用ストア、エラー文を整理する', '時計同期の成否、クロスプレイの状態、Automaticでの結果をそれぞれ1行で控える', '記事末尾のEmbark公式サポートから問い合わせ方法を確認する。スクリーンショットに個人情報や別の会話が映っていれば隠す'], note: '待ち時間だけで回線故障やアカウント制限を断定することはできません。' },
    ],
    avoid: ['出撃を早めようとしてルーターの初期化やファイアウォールの全面無効化をしない', '進行中のレイドから退出して比較用の記録を作らない', '別タイトルのエラー番号の対処をARC Raidersに流用しない'],
    cautions: ['この記事はPC版の設定手順です。コンソールのメニューは公式サポートの対応欄を参照してください。', '2026年10月8日の2.0更新ではマップ選択画面が変更されています。古い画面の位置だけを頼りに操作せず、項目の意味を確認してください。'],
    faqs: [{ question: '自分のクロスプレイがオンなのに、パーティだと遅いのはなぜ？', answer: '公式によると、パーティ内で最も制限の強いクロスプレイ設定が適用されます。自分以外のメンバーの設定も確認してください。設定が原因と確定するわけではないので、変えた後の結果を比較します。' }, { question: 'ソロ対スクワッドの項目がありません。設定が壊れましたか？', answer: '2026年10月8日の2.0公式パッチでは「Solo vs. Squads」をマッチングの選択肢から取り除いたと案内されています。この項目がないことを理由に設定ファイルを削除する必要はありません。今後の変更は公式更新情報で確認してください。' }],
    sources: [sources.matchmaking, sources.clock, sources.patch, sources.support], related: ['voice-chat'],
    metaDescription: 'ARC Raidersでマッチングしない、条件付きマップに入れない時のPC版ガイド。時計同期、パーティ全員のクロスプレイ、サーバー地域のAutomaticを公式情報から切り分けます。',
    ogTitle: 'ARC Raiders マッチングしない？', ogSteps: ['症状の範囲を記録', '時計を同期', '全員のクロスプレイ確認', '地域をAutomaticで比較'],
  }),
  make({
    slug: 'voice-chat', category: 'settings', title: 'ARC RaidersのVCが使えない・声が届かない時の対処法【PC・近接VC】', shortTitle: 'VC・マイクが使えない',
    symptom: 'ゲームの音は聞こえるのに自分の声が届かない、パーティVCは使えるが近接VCだけ使えない、別のアプリではマイクが動く人向けのPC版ガイドです。',
    conclusion: 'ゲーム内のVC有効化とパーティ／近接の送信方式、選択中の入力マイクを先に確認します。続いてWindowsのマイク権限と、同時にマイクを使うアプリを確認。オープンマイクで比較する場合は周囲の会話が送信されることに注意してください。',
    description: '声を送る問題と出撃・接続の問題を分け、変更前の値を控えながら確認します。ゲーム内項目は公式が示す英語名を併記し、未確認の日本語UI表記や固定の送信キーは断定しません。',
    targetVersion: 'PC版／公式サポートと2026年10月8日の更新情報を確認',
    quickFacts: [{ label: '近接VC', value: '分隊の外のレイダーにも話しかける機能。パーティVCとは設定を分けて確認' }, { label: '入力マイク', value: 'Settings → Audio → Voice Chat Input Device' }, { label: '送信方式の比較', value: 'Push-to-TalkとOpen Microphone。比較後は元の方式へ戻せる' }],
    diagnosis: [{ symptom: '近接VCだけ声が届かない', cause: 'Proximity Voice Chat側の設定を確認', stepId: 'voice-mode' }, { symptom: '複数のマイクを接続している', cause: 'ゲームが別の入力機器を選んでいる可能性', stepId: 'input-device' }, { symptom: 'VCが両方とも使えない', cause: 'マイク権限・同時使用アプリも確認', stepId: 'microphone-permission' }],
    steps: [
      { id: 'voice-mode', title: 'パーティVCと近接VCの有効化・送信方式を確認する', summary: '近接VCだけの問題なら、パーティVCの設定だけを変えても切り分けになりません。', time: '約2分', risk: 'low', nextStepId: 'input-device', actions: ['Settings → Audioのボイスチャット設定を開き、Enable Voice Chatが有効か確認する', 'Party Voice ChatとProximity Voice Chatをそれぞれ確認し、現在の送信方式を控える', 'Push-to-Talkの場合は現在のキー割り当てを確認する。必要なら、周囲に聞かれて困る会話がない場所でOpen Microphoneと比較する', '比較が終わったら普段使いたい送信方式へ戻す'], note: '近接VCは分隊外のレイダーにも声を届ける機能です。マイクテストのために個人情報を読み上げないでください。' },
      { id: 'input-device', title: 'ゲームが使うマイクを明示的に選ぶ', summary: 'ヘッドセット以外にWebカメラなどのマイクがある場合は、別の機器が選ばれていないか確認します。', time: '約1分', risk: 'low', nextStepId: 'microphone-permission', actions: ['Settings → Audio → Voice Chat Input Deviceを開く', '使用するマイク名を選択し、送信方式はそのままで結果を比較する', '目的の機器が候補にない場合は、Windows側でその機器が認識されているか確認してから先へ進む'] },
      { id: 'microphone-permission', title: 'Windowsでデスクトップアプリのマイク権限を確認する', summary: 'マイクの利用がWindows側で拒否されていると、ゲーム内設定だけでは解消しません。', time: '約2分', risk: 'medium', nextStepId: 'close-other-apps', actions: ['Windowsの設定で「マイク」を検索し、マイクのプライバシー設定を開く', 'ARC Raidersで音声を送信してよい場合は、デスクトップアプリによるマイクへのアクセスが許可されているか確認する', '変更する場合は表示された適用範囲を確認する。これはARC Raidersだけを個別に許可するスイッチとは限らない', 'ゲームを再起動して比較する。会社・学校などが管理するPCで変更できない場合は管理者へ相談する'], note: 'Windowsの版で画面名が異なります。権限を広げたくない場合はこの操作を省略し、その状態を問い合わせ時に伝えてください。' },
      { id: 'close-other-apps', title: '同時にマイクを使っているアプリを終了して比較する', summary: 'ほかの音声アプリの影響を、アンインストールせずに確認します。', time: '約2〜3分', risk: 'low', nextStepId: 'support-record', actions: ['通話や録音を終えてよいか確認し、Discord・録画ソフトなど不要な音声アプリを通常の終了操作で閉じる', 'ARC Raidersを再起動し、入力機器と送信方式を変えずに結果を比較する', '改善した場合はアプリを1つずつ再開し、同じ症状が戻る組み合わせを記録する'], note: '会議や録音を強制終了したり、Windowsのシステムプロセスを終了したりする必要はありません。' },
      { id: 'support-record', title: '改善しなければ公式サポートへ伝える情報をまとめる', summary: 'マイク入力・送信方式・接続のどこまで確認できたかを残します。', time: '約3分', risk: 'low', actions: ['マイクの機種名、Windowsの版、パーティVC／近接VCのどちらが使えないかを記録する', '相手の声は聞こえるか、自分の声だけ届かないか、別のアプリでも入力できないかを区別する', '入力機器、マイク権限、ほかのアプリを終了した時の結果を添えて、記事末尾の公式サポートを確認する', 'ゲームへの接続や出撃自体も失敗するなら、関連記事のマッチング手順で症状を分ける'], note: '公式には追加のネットワーク対処もありますが、共用回線の設定を自己判断で変更せず、管理者やサポートと必要性を確認してください。' },
    ],
    avoid: ['近接VCをオープンマイクにしたまま私的な会話や認証コードを読み上げない', 'VCを直す目的でファイアウォールを全面無効化したり、出所不明の音声ドライバーを導入したりしない', '最初からIPv6・DNS・ルーターをまとめて変更しない'],
    cautions: ['PC版の入力・送信確認が中心です。コンソール版へWindowsの操作を当てはめないでください。', '2.0の公式パッチには一部VC不具合、とくにPS5／Xboxでの修正が記載されています。PCの症状がすべて解消済み、または同じ不具合だとは判断できません。'],
    faqs: [{ question: 'Discordでは話せるのに、ARC Raidersだけ声が届きません', answer: 'マイク本体が使えていても、ゲームが違う入力機器を選んでいたり、別の送信方式になっていたりする可能性があります。Voice Chat Input DeviceとParty／Proximityそれぞれの設定を確認し、必要ならDiscordを終了した状態と比較します。' }, { question: 'アップデート後、Push-to-Talkのキーが毎回戻ります', answer: '2026年10月8日の2.0既知問題には、非英語キーボード配列でレイド後にキー割り当てが初期値に戻る問題が掲載されています。公式の確実な回避策は確認できていません。現在の割り当てを確認し、独自の設定ファイル改変ではなく公式の修正案内を確認してください。' }],
    sources: [sources.voice, sources.communication, { label: 'Microsoft公式：Windowsのマイクとプライバシー（英語）', url: 'https://support.microsoft.com/en-us/windows/privacy/windows-camera-microphone-and-privacy' }, sources.patch, sources.support], related: ['matchmaking'],
    metaDescription: 'ARC RaidersでVCが使えない・声が届かない時のPC版確認手順。近接／パーティVC、入力マイク、Push-to-Talk、Windowsの権限、同時使用アプリを安全に切り分けます。',
    ogTitle: 'ARC Raiders VCが使えない？', ogSteps: ['近接・パーティを区別', '入力マイクを選択', 'Windowsの権限確認', '音声アプリを比較'],
  }),
];
