import type { GameArticle } from './game-articles';

// STAR WARS ゼロ・カンパニー（PC版）の個別記事。
// 2026-09-27にEA公式ヘルプ（トラブルシューティング・動作環境）、Steamストア、
// PCGamingWikiで確認した内容だけを載せています。
// STEPのidは解決報告（D1）の集計キーなので、既存のidは変更しないでください。
const sources = {
  eaTroubleshoot: {
    label:
      'EA公式：「STAR WARS ゼロ・カンパニー」のよくある問題のトラブルシューティング',
    url: 'https://help.ea.com/ja/articles/star-wars/zero-company/troubleshoot-common-issues/',
  },
  eaSpecs: {
    label: 'EA公式：動作環境・プラットフォームガイド（英語）',
    url: 'https://help.ea.com/en/articles/star-wars/zero-company/platforms-pc-requirements-guide/',
  },
  steam: {
    label: 'Steamストア：STAR WARS ゼロ・カンパニー（動作環境・Steamクラウド）',
    url: 'https://store.steampowered.com/app/2075800/',
  },
  pcgw: {
    label: 'PCGamingWiki：Star Wars: Zero Company（保存場所・画面設定）',
    url: 'https://www.pcgamingwiki.com/wiki/Star_Wars_Zero_Company',
  },
};

type Draft = Omit<
  GameArticle,
  | 'gameSlug'
  | 'checkedAt'
  | 'symptoms'
  | 'seoTitle'
  | 'status'
  | 'targetVersion'
> & { seoTitle?: string };

const make = (draft: Draft): GameArticle => ({
  gameSlug: 'star-wars-zero-company',
  checkedAt: '2026-09-27',
  status: 'verified',
  targetVersion: 'PC版（EA app・Steam・Epic）・2026年9月27日時点のEA公式案内',
  symptoms: draft.steps.map((step) => ({ label: step.title, target: step.id })),
  seoTitle: draft.title,
  ...draft,
});

const minimumSpec = {
  label: '最低動作環境',
  value:
    'Windows 10/11（64bit）／GTX 1080・RX 5600 XT・Intel Arc B580／メモリ16GB（1080p・「低」・30fps）',
};
const recommendedSpec = {
  label: '推奨動作環境',
  value: 'RTX 3080・RX 7800 XT／メモリ32GB（1440p・「高」・60fps）',
};

const repairActions = [
  'EA app：「ライブラリ」でゲームタイルの3つのドット→「修復」を選び、完了したらPCを再起動する',
  'Steam：ライブラリでゲームを右クリック→「プロパティ」→「インストール済みファイル」→「ゲームファイルの整合性を確認」',
  'Epic Games Launcher：ライブラリでゲームの「…」→「管理」→「確認」',
];

export const verifiedReleaseArticles: GameArticle[] = [
  make({
    slug: 'not-launching',
    // Shorter <title> for search results; the page heading keeps the full title.
    seoTitle: 'ゼロ・カンパニーが起動しない・クラッシュする時の対処法【PC版】',
    category: 'launch',
    title:
      'STAR WARS ゼロ・カンパニーが起動しない・クラッシュする時の対処法【PC版】',
    shortTitle: '起動しない・クラッシュ',
    symptom:
      'EA app・Steam・Epicで起動しない、起動直後に落ちる、フリーズする、DLSS使用中に落ちる場合の確認手順です。',
    conclusion:
      'EA公式の案内に沿って、PCとランチャーの再起動・更新の適用、ゲームファイルの修復、GPUドライバーとWindowsの更新の順に試します。NVIDIAのDLSS使用中に落ちる場合はGame Readyドライバーが610.88以前でないか、Intel第13・14世代のデスクトップ向けCPUではBIOSの更新も確認します。',
    description:
      'EA公式は、起動しない原因として未適用のアップデート、古いグラフィックドライバー、最小動作環境を満たしていないことを挙げています。症状が分かっている場合は、早見表から該当するSTEPへ進めます。',
    causes: [
      'ゲーム・ランチャー・Windowsの更新が適用されていない',
      '破損・欠落したゲームファイル',
      '古いグラフィックドライバー（DLSS使用中のクラッシュを含む）',
      'バックグラウンドで動いている多数のアプリ',
      'Intel第13・14世代のデスクトップ向けCPUのBIOSが古い',
    ],
    quickFacts: [
      minimumSpec,
      recommendedSpec,
      {
        label: 'DLSS使用中に落ちる',
        value:
          'NVIDIA Game Readyドライバーが610.88以前なら最新版へ更新（EA公式）',
      },
      {
        label: 'Intel第13・14世代CPU',
        value: 'デスクトップ向けでクラッシュする場合はBIOSを最新へ（EA公式）',
      },
      {
        label: 'インターネット接続',
        value:
          'シングルプレイ専用。ダウンロード・更新・プラットフォーム機能の利用時のみ必要',
      },
    ],
    diagnosis: [
      {
        symptom: '更新後から起動しない',
        cause: '保留中の更新、ランチャーの状態',
        stepId: 'step-1',
      },
      {
        symptom: '起動直後に落ちる・エラーが出る',
        cause: '破損・欠落したゲームファイル',
        stepId: 'step-2',
      },
      {
        symptom: 'NVIDIAでDLSSを使うと落ちる',
        cause: 'Game Readyドライバー610.88以前',
        stepId: 'step-3',
      },
      {
        symptom: 'プレイ中にフリーズ・カクつく',
        cause: 'バックグラウンドのアプリ',
        stepId: 'step-4',
      },
      {
        symptom: 'Intel第13・14世代のCPUで落ちる',
        cause: '古いBIOS',
        stepId: 'step-5',
      },
      {
        symptom: 'VC++や.dllのエラーが出る',
        cause: 'Windowsのランタイムの不足・破損',
        stepId: 'step-6',
      },
    ],
    steps: [
      {
        id: 'step-1',
        title: 'PCとランチャーを再起動し、更新を適用する',
        summary:
          '保留中のアップデートがあると起動やプレイに問題が起きるおそれがあると、EA公式が案内しています。',
        time: '約5分',
        risk: 'low',
        actions: [
          'ゲームを終了し、PCを再起動する',
          'EA app・Steam・Epic Games Launcherを起動し、ゲームとランチャー本体の更新を適用する（EA appではゲームタイルの下に「アップデートが必要です」と表示される）',
          'Windows Updateに保留中の更新があればインストールする',
        ],
        note: 'ダウンロードや更新ができない場合は、EAサーバーのステータスページでEA・Steamのサービス状況も確認します。',
      },
      {
        id: 'step-2',
        title: 'ゲームファイルを修復・検証する',
        summary:
          '破損・欠落したファイルがあると、クラッシュ・フリーズ・起動失敗が起きるおそれがあります。',
        time: '5〜15分',
        risk: 'low',
        actions: [...repairActions, '完了後にゲームを起動し、同じ場面で比べる'],
      },
      {
        id: 'step-3',
        title: 'GPUドライバーとWindowsを更新する',
        summary:
          '古いドライバーはフレームレートの低下やクラッシュの原因になるとEA公式が案内しています。',
        time: '10〜20分',
        risk: 'low',
        actions: [
          'Windows＋Rキーで「dxdiag」を実行し、「ディスプレイ」タブでGPU名を確認する',
          'NVIDIAでDLSSを使っていて落ちる場合は、NVIDIAアプリで Game Ready ドライバーのバージョンを確認し、610.88以前なら最新版へ更新する',
          'AMD・Intelも各社公式サイトで新しいドライバーを確認し、インストール後にPCを再起動する',
        ],
      },
      {
        id: 'step-4',
        title: 'バックグラウンドのアプリを閉じる',
        summary:
          '多数のアプリが動いていると、EA appの接続問題・クラッシュ・遅延が起きる場合があります。',
        time: '約3分',
        risk: 'low',
        actions: [
          'タスクマネージャーで、録画・配信・ブラウザなど今使っていないアプリを終了する',
          'ゲームとランチャーだけの状態で起動して比べる',
          'インストールや起動の問題が続く場合は、EA公式が案内するクリーンブートで常駐ソフトを切り分ける',
        ],
      },
      {
        id: 'step-5',
        title: 'Intel第13・14世代CPUはBIOSを更新する',
        summary:
          'デスクトップ向けの第13・14世代Intel Coreで、クラッシュなどが起きる場合があるとEA公式が案内しています。',
        time: '20〜40分',
        risk: 'high',
        actions: [
          'Windows＋Rキーで「dxdiag」を実行し、「システム」タブでCPUの型番を確認する',
          '該当する場合は、PCメーカーまたはマザーボードメーカーの手順に従ってBIOSを最新にする',
          'それでも改善しない場合の追加手段（Intel XTUでのPerformance Core Ratioの引き下げ）は上級者向け。不明な場合はPCメーカーに相談する',
        ],
        note: 'BIOSの更新に失敗するとPCが起動しなくなるおそれがあります。保証に影響する変更は行わず、手順が分からない場合は専門家に相談してください。',
      },
      {
        id: 'step-6',
        title: 'VC++・.dllエラーを直す',
        summary:
          'VC++や.dllのエラーが出る場合は、Microsoftのランタイムの修復・再インストールが必要なことがあります。',
        time: '約10分',
        risk: 'medium',
        actions: [
          '表示されたエラーメッセージを、画面の写真やスクリーンショットで正確に残す',
          'Windowsの「設定」→「アプリ」で「Microsoft Visual C++ 再頒布可能パッケージ」を探し、「変更」→「修復」を選ぶ',
          'DirectXやEA appに関するエラーの場合は、EA公式ヘルプの該当ページの手順を確認する',
        ],
      },
    ],
    avoid: [
      '最小動作環境を満たしていないPCで、設定変更だけで解決しようとしない（EA公式も起動しない原因に挙げている）',
      'BIOSの変更やCPUの設定変更を、内容を理解しないまま行わない',
      '複数の対処を同時に行わない。1つ試すごとに起動を確認する',
    ],
    cautions: [
      'EA公式も、PC向けの手順には高度な内容が含まれるため、安全に実施できる手順だけを試すよう案内しています。',
    ],
    faqs: [
      {
        question: 'オフラインでも遊べますか？',
        answer:
          'シングルプレイ専用のゲームで、オンラインプレイはありません。ただしEA公式によると、ゲームのダウンロード、アップデートのインストール、プラットフォームのサービス利用時にはインターネット接続が必要な場合があります。',
      },
      {
        question: 'Windows 10でも動きますか？',
        answer:
          '動作環境は「64bit Windows 10/11（Windows 11推奨）」です（EA公式・Steamストア）。',
      },
      {
        question: 'EAに問い合わせる前に何を準備すればいいですか？',
        answer:
          'EA公式は、EA IDまたはメールアドレス、プレイしているプラットフォーム（EA app・Steam・Epic）とそのID、問題が起きた日時、詳細と試した対処、正確なエラーメッセージ、スクリーンショットや動画を準備するよう案内しています。',
      },
    ],
    sources: [sources.eaTroubleshoot, sources.eaSpecs, sources.steam],
    related: ['gtx10-rtx20-low-fps', 'black-screen', 'save-progress'],
    metaDescription:
      'STAR WARS ゼロ・カンパニーPC版が起動しない・クラッシュする時の対処法。EA公式の手順（更新・修復・ドライバー）、DLSS使用中のクラッシュ条件（610.88以前）、Intel第13・14世代CPUのBIOS更新、VC++エラーまで症状別に解説。',
  }),
  make({
    slug: 'black-screen',
    // Shorter <title> for search results; the page heading keeps the full title.
    seoTitle: 'ゼロ・カンパニーが黒い画面になる時の対処法【PC版】',
    category: 'settings',
    title:
      'STAR WARS ゼロ・カンパニーが黒い画面・真っ暗になる時の対処法【PC版】',
    shortTitle: '黒い画面',
    symptom:
      '起動後やプレイ中に画面が真っ暗になる時に、EA公式が案内する原因と確認項目です。',
    conclusion:
      'EA公式は、プレイ中に画面が真っ暗になる原因として、古いグラフィックドライバー、破損したゲームファイル、PCが最小動作環境を満たしていないことを挙げています。ドライバー更新→ファイルの修復→動作環境の確認の順に試します。',
    description:
      '黒い画面は原因が3つに絞られています。上から順に1つずつ確認すると、無駄な設定変更を減らせます。',
    causes: [
      '古いグラフィックドライバー',
      '破損・欠落したゲームファイル',
      'PCが最小動作環境（GTX 1080・RX 5600 XT・Intel Arc B580以上）を満たしていない',
    ],
    quickFacts: [
      {
        label: 'EA公式が挙げる原因',
        value: '古いドライバー／ゲームファイルの破損／最小動作環境の未達',
      },
      minimumSpec,
      {
        label: '動作環境の確認方法',
        value:
          'Windows＋R→「dxdiag」（「システム」タブと「ディスプレイ」タブ）',
      },
    ],
    diagnosis: [
      {
        symptom: 'ドライバーを長く更新していない',
        cause: '古いグラフィックドライバー',
        stepId: 'step-1',
      },
      {
        symptom: '更新後やインストール直後から黒い',
        cause: 'ゲームファイルの破損・欠落',
        stepId: 'step-2',
      },
      {
        symptom: 'GPUが古い・ノートPCで黒い',
        cause: '最小動作環境の未達',
        stepId: 'step-3',
      },
      {
        symptom: '録画・配信ソフトを動かしている時に起きる',
        cause: 'バックグラウンドのアプリ',
        stepId: 'step-4',
      },
    ],
    steps: [
      {
        id: 'step-1',
        title: 'グラフィックドライバーを更新する',
        summary:
          '古いドライバーは、黒い画面の原因の1つとしてEA公式が挙げています。',
        time: '10〜20分',
        risk: 'low',
        actions: [
          'Windows＋Rキーで「dxdiag」を実行し、「ディスプレイ」タブでGPU名とドライバーを確認する',
          'NVIDIA・AMD・Intelの公式サイト（ノートPCはPCメーカー）から新しいドライバーを入れる',
          'インストール後にPCを再起動し、同じ場面で確認する',
        ],
      },
      {
        id: 'step-2',
        title: 'ゲームファイルを修復・検証する',
        summary:
          '購入したランチャーで修復します。セーブデータの復元操作ではありません。',
        time: '5〜15分',
        risk: 'low',
        actions: repairActions,
      },
      {
        id: 'step-3',
        title: 'PCが最小動作環境を満たすか確認する',
        summary:
          '最小動作環境を満たさないと、起動しない・正常に動作しないおそれがあります。',
        time: '約3分',
        risk: 'low',
        actions: [
          'Windows＋Rキーで「dxdiag」を実行し、「システム」タブでOS・CPU・メモリを、「ディスプレイ」タブでGPUを確認する',
          '最低動作環境（GTX 1080・RX 5600 XT・Intel Arc B580、メモリ16GB）と比べる',
          'Intel Arcを使っている場合は、Resizable BARがオンか確認する（EA公式が推奨）',
        ],
      },
      {
        id: 'step-4',
        title: 'バックグラウンドのアプリを閉じて比べる',
        summary:
          '録画・配信ソフトやオーバーレイを止めて、ゲームだけで確認します。',
        time: '約3分',
        risk: 'low',
        actions: [
          '録画・配信・FPS表示などのアプリを終了する',
          'ゲームとランチャーだけの状態で起動して比べる',
          '改善しない場合は、エラーの有無と発生場面を控えてEAサポートへ相談する',
        ],
      },
    ],
    avoid: [
      '最小動作環境を満たしていないGPUで、画質設定の変更だけで解決しようとしない',
      '画面が見えない状態で当てずっぽうに設定を変えない',
    ],
    cautions: [
      '改善しない場合は、試した手順と発生場面をメモしてEA公式サポートへ相談してください。',
    ],
    faqs: [
      {
        question: 'GTX 1060やGTX 1070でも遊べますか？',
        answer:
          'EA公式の最低動作環境のGPUはGTX 1080（またはRX 5600 XT・Intel Arc B580）です。それより性能が低いGPUは最小動作環境を満たさず、起動しない・正常に動作しないおそれがあります。',
      },
      {
        question: 'Intel Arcで画面や動作がおかしいです。',
        answer:
          'EA公式は、Intel Arcを使っている場合はResizable BARをオンにするとFPSが向上すると案内しています。初期設定ではオフの場合があるため、PCまたはマザーボードのメーカーの説明書で有効にする方法を確認してください。',
      },
      {
        question: '修復するとセーブは消えますか？',
        answer:
          'ゲームファイルの修復・検証は、インストールされたゲームのファイルを確認する操作です。セーブデータは別の場所（%LOCALAPPDATA%\\SWZeroCompany\\Saved\\SaveGames）に保存されています（PCGamingWiki）。心配な場合は先にセーブをコピーしてください。',
      },
    ],
    sources: [sources.eaTroubleshoot, sources.eaSpecs, sources.pcgw],
    related: ['not-launching', 'gtx10-rtx20-low-fps', 'save-progress'],
    metaDescription:
      'STAR WARS ゼロ・カンパニーPC版が黒い画面・真っ暗になる時の対処法。EA公式が挙げる3つの原因（古いドライバー・ファイル破損・最小動作環境の未達）の確認手順と、Intel ArcのResizable BARを解説。',
  }),
  make({
    slug: 'save-progress',
    // Shorter <title> for search results; the page heading keeps the full title.
    seoTitle: 'ゼロ・カンパニーのセーブが消えた・保存されない原因【PC版】',
    category: 'save',
    title:
      'STAR WARS ゼロ・カンパニーのセーブが消えた・進行が保存されない原因とセーブデータの場所【PC版】',
    shortTitle: 'セーブ・進行が保存されない',
    symptom:
      '終了後に最新の進行が反映されない、セーブが消えたように見える、セーブデータの場所を知りたい・バックアップしたい人向けです。',
    conclusion:
      'EA公式によると、ホークスを操作していない時にゲームを終了すると、最新の進行状況の保存が完了しない場合があります。ホークスの操作に戻ってから、またはミッション開始から数秒待ってから終了してください。',
    description:
      'セーブは自動で保存されますが、終了のタイミングによって最新の状態が残らないことがあります。大切な進行は、セーブデータの場所をコピーしてバックアップしておくと安心です。',
    causes: [
      'ホークスを操作していない時にゲームを終了した',
      'ミッション開始直後、保存が終わる前に終了した',
    ],
    quickFacts: [
      {
        label: '安全に終了できるタイミング',
        value:
          'ホークスを操作できる状態、またはミッション開始から数秒後（EA公式）',
      },
      {
        label: 'セーブデータの場所',
        value: String.raw`%LOCALAPPDATA%\SWZeroCompany\Saved\SaveGames`,
        copy: true,
      },
      {
        label: '設定ファイルの場所',
        value: String.raw`%LOCALAPPDATA%\SWZeroCompany\Saved`,
        copy: true,
      },
      { label: 'Steamクラウド', value: '対応（Steamストアの表記）' },
    ],
    diagnosis: [
      {
        symptom: '終了したら最新の進行が消えていた',
        cause: 'ホークスを操作していない時に終了した',
        stepId: 'step-1',
      },
      {
        symptom: 'ミッション開始直後に終了した',
        cause: '保存が終わる前に終了した',
        stepId: 'step-2',
      },
      {
        symptom: 'セーブをバックアップしたい',
        cause: '万一の消失や入れ直しに備える',
        stepId: 'step-4',
      },
    ],
    steps: [
      {
        id: 'step-1',
        title: 'ホークスを操作できる状態に戻ってから終了する',
        summary: 'EA公式が案内している、進行を失わないための終了方法です。',
        time: '約1分',
        risk: 'low',
        actions: [
          '終了する前に、ホークスを操作できる状態へ戻る',
          '終了前に今いるミッション名と進行地点を控えておく',
        ],
      },
      {
        id: 'step-2',
        title: 'ミッション開始直後は数秒待ってから終了する',
        summary: '開始直後にすぐ終了すると、保存が完了しない場合があります。',
        time: '約1分',
        risk: 'low',
        actions: [
          'ミッションが始まったら、数秒待ってから終了する',
          '保存中の表示がある場合は、表示が消えてからゲーム内のメニューで終了する',
          'タスクマネージャーでの強制終了は避ける',
        ],
      },
      {
        id: 'step-3',
        title: '再起動して進行を確かめる',
        summary: '控えておいたミッションと進行地点を比べます。',
        time: '約3分',
        risk: 'low',
        actions: [
          '同じアカウント・同じランチャーでゲームを起動し、続きから再開する',
          '控えたミッション名と進行地点が残っているか確認する',
          'この手順は、すでに失われた進行を復元するものではない',
        ],
      },
      {
        id: 'step-4',
        title: 'セーブデータをバックアップする',
        summary: 'SaveGamesフォルダごと、別の場所へコピーしておきます。',
        time: '約2分',
        risk: 'low',
        actions: [
          'ゲームとランチャーを終了する',
          String.raw`Windows＋Rキーで「%LOCALAPPDATA%\SWZeroCompany\Saved\SaveGames」を開く`,
          'SaveGamesフォルダを丸ごと別のドライブやクラウドストレージへコピーし、フォルダ名に日付を付ける',
        ],
        note: 'Steam版はSteamクラウドにも対応していますが、クラウドは今の状態を同期する仕組みのため、手元にもコピーを残すと安心です。',
      },
    ],
    avoid: [
      'ミッション開始直後やホークスを操作していない時に、ゲームを強制終了しない',
      'ゲーム起動中にセーブファイルをコピー・上書きしない',
      '今のセーブを消してからバックアップを戻さない。必ず別名で残してから入れ替える',
    ],
    cautions: [
      'セーブデータを操作する前に、必ず別の場所へコピーを残してください。',
    ],
    faqs: [
      {
        question: '消えてしまった進行は元に戻せますか？',
        answer:
          '終了タイミングの手順は、これから進行を失わないための方法で、すでに失われた進行を復元するものではありません。バックアップがあれば、それを戻せます。困った場合はEA公式サポートへ相談してください。',
      },
      {
        question: 'セーブデータはどこにありますか？',
        answer: String.raw`PCGamingWikiによると、Windows版のセーブデータは「%LOCALAPPDATA%\SWZeroCompany\Saved\SaveGames」に「.sav」ファイルとして保存されます。Windows＋Rキーでこのパスを入力すると直接開けます。`,
      },
      {
        question: 'いつでもセーブできますか？',
        answer:
          'Steamストアには「いつでもセーブ可能」と表記されています。ただしEA公式は、ホークスを操作していない時に終了すると最新の進行状況の保存が完了しない場合があると案内しているため、終了するタイミングに注意してください。',
      },
    ],
    sources: [sources.eaTroubleshoot, sources.pcgw, sources.steam],
    related: ['not-launching', 'black-screen'],
    metaDescription:
      'STAR WARS ゼロ・カンパニーの進行が保存されない原因は終了のタイミング。EA公式が案内する安全な終了方法（ホークス操作中・ミッション開始から数秒後）と、セーブデータの場所・バックアップ方法を解説。',
  }),
  make({
    slug: 'gtx10-rtx20-low-fps',
    // Shorter <title> for search results; the page heading keeps the full title.
    seoTitle: 'ゼロ・カンパニーが重い・FPSが低い時の設定【PC版】',
    category: 'display',
    title:
      'STAR WARS ゼロ・カンパニーが重い・FPSが低い時の設定｜GTX 10・RTX 20・Intel Arc【PC版】',
    shortTitle: '重い・FPSが低い',
    symptom:
      'ゲームは起動するがFPSが低い、カクつく人向けです。GTX 10・RTX 20シリーズやIntel Arcの公式の最適化方法もまとめています。',
    conclusion:
      '最小動作環境を満たすGTX 10・RTX 20シリーズでは、EA公式が案内する「環境ジオメトリ詳細」をオフにします。Intel ArcはResizable BARをオンにします。それ以外のGPUは、グラフィックの「ディスプレイ」「アンチエイリアスとアップスケーリング」「品質」の設定を下げて比べます。',
    description:
      '公式の目安は、最低動作環境で1080p・「低」・30fps、推奨動作環境で1440p・「高」・60fpsです（EA公式）。自分のPCがどちらに近いかを先に確認すると、目指す設定が決めやすくなります。',
    causes: [
      '対象GPUでの「環境ジオメトリ詳細」の負荷',
      'Intel ArcでResizable BARがオフになっている',
      'PCの性能に対して高すぎる解像度・画質設定',
      '古いグラフィックドライバー',
    ],
    quickFacts: [
      minimumSpec,
      recommendedSpec,
      {
        label: 'GTX 10・RTX 20',
        value:
          '「環境ジオメトリ詳細」をオフ（最小動作環境を満たす場合・EA公式）',
      },
      { label: 'Intel Arc', value: 'Resizable BARをオン（EA公式）' },
      {
        label: 'フレームレート上限',
        value:
          '無制限・30・60・75・120・144・160・240から選べる（PCGamingWiki）',
      },
    ],
    diagnosis: [
      {
        symptom: 'GTX 1060・1070などで重い',
        cause: '最小動作環境（GTX 1080）未満',
        stepId: 'check-specs',
      },
      {
        symptom: 'GTX 10・RTX 20シリーズで重い',
        cause: '環境ジオメトリ詳細の負荷',
        stepId: 'geometry-detail',
      },
      {
        symptom: 'Intel Arcで重い',
        cause: 'Resizable BARがオフ',
        stepId: 'intel-arc-rebar',
      },
      {
        symptom: 'その他のGPUで全体的に重い',
        cause: '解像度・画質の設定',
        stepId: 'compare-quality',
      },
      {
        symptom: 'FPSが上下して安定しない',
        cause: 'フレームレート上限を決めていない',
        stepId: 'fps-limit',
      },
    ],
    steps: [
      {
        id: 'check-specs',
        title: '最小動作環境を満たしているか確認する',
        summary:
          '最低動作環境のGPUはGTX 1080です。GTX 10シリーズでもそれより下のGPUは対象外です。',
        time: '約3分',
        risk: 'low',
        actions: [
          'Windows＋Rキーで「dxdiag」を実行し、「ディスプレイ」タブでGPU名を確認する',
          '最低動作環境（GTX 1080・RX 5600 XT・Intel Arc B580、メモリ16GB）と比べる',
          'GPUドライバーを各社公式サイトの最新版へ更新し、PCを再起動する',
        ],
        note: '最小動作環境を満たしていても、すべての画質設定が快適に動くとは限らないとEA公式は案内しています。',
      },
      {
        id: 'geometry-detail',
        title: 'GTX 10・RTX 20は「環境ジオメトリ詳細」をオフにする',
        summary:
          '最小動作環境を満たすGTX 10・RTX 20シリーズ向けに、EA公式が案内している設定です。',
        time: '約2分',
        risk: 'low',
        actions: [
          '「オプション」→「グラフィックス」を開く',
          '「環境ジオメトリ詳細」の今の値を控え、「オフ」にする',
          '同じセーブ・同じ場所・同じ解像度でFPSを比べる',
        ],
      },
      {
        id: 'intel-arc-rebar',
        title: 'Intel ArcはResizable BARをオンにする',
        summary:
          'EA公式によると、Intel ArcではResizable BARをオンにするとFPSが向上します。',
        time: '10〜20分',
        risk: 'medium',
        actions: [
          'Resizable BARは初期設定でオフの場合がある',
          'PCまたはマザーボードのメーカーの説明書で、BIOS（UEFI）でResizable BARを有効にする方法を確認する',
          '有効にした後、同じ場面でFPSを比べる',
        ],
        note: 'BIOSの設定変更は、内容を理解してから行ってください。分からない場合はメーカーに問い合わせます。',
      },
      {
        id: 'compare-quality',
        title: 'グラフィック設定を1項目ずつ下げる',
        summary:
          'EA公式が下げる対象として挙げている「ディスプレイ」「アンチエイリアスとアップスケーリング」「品質」の順に見直します。',
        time: '約10分',
        risk: 'low',
        actions: [
          '今の設定をスクリーンショットで控える',
          '「オプション」→「グラフィック」で、「ディスプレイ」（解像度など）→「アンチエイリアスとアップスケーリング」→「品質」の順に1項目ずつ下げる',
          '変えるたびに同じ場面で比べ、効果がなければ元に戻す',
        ],
        note: 'アンチエイリアスとアップスケーリングでは、DLSS・FSR・XeSSなどを選べます（PCGamingWiki）。',
      },
      {
        id: 'fps-limit',
        title: 'フレームレート上限を決めて安定させる',
        summary: '上限を決めると、FPSの上下や発熱を抑えられます。',
        time: '約2分',
        risk: 'low',
        actions: [
          'グラフィック設定のフレームレート上限を、普段出ている値より少し低い値（例：60）にする',
          '同じ場面で、カクつきや発熱が減るか比べる',
          '変化がない場合は元に戻す',
        ],
      },
    ],
    avoid: [
      '最小動作環境を満たしていないGPUで、設定変更だけで快適になると期待しない',
      '画質設定をまとめて変えない。1項目ずつ変えて同じ場面で比べる',
      'BIOSの設定を、内容を理解しないまま変更しない',
    ],
    cautions: [
      '「環境ジオメトリ詳細」の設定は、最小動作環境を満たさないGPUの性能不足を補うものではありません。',
      'DLSS使用中に落ちる症状は別の問題です。「起動しない・クラッシュ」記事のドライバー条件を確認してください。',
    ],
    faqs: [
      {
        question: '「環境ジオメトリ詳細」をオフにすると何FPS上がりますか？',
        answer:
          'EA公式は「フレームレートを改善することができる」と案内していますが、具体的な数値は公表していません。ゲムなおでも独自の測定はまだ行っていないため、同じ場面で前後を比べて確認してください。',
      },
      {
        question: 'GTX 1060やGTX 1070でも遊べますか？',
        answer:
          '最低動作環境のGPUはGTX 1080です。それより性能が低いGPUは最小動作環境を満たさないため、設定を下げても快適に動くとは限りません。',
      },
      {
        question: '推奨環境なら何fpsで遊べますか？',
        answer:
          'EA公式の推奨動作環境（RTX 3080・RX 7800 XT、メモリ32GB）は、1440p・グラフィックプリセット「高」・60fpsが目安です。',
      },
    ],
    sources: [sources.eaTroubleshoot, sources.eaSpecs, sources.pcgw],
    related: ['not-launching', 'black-screen'],
    metaDescription:
      'STAR WARS ゼロ・カンパニーPC版が重い・FPSが低い時の設定。EA公式が案内するGTX 10・RTX 20の「環境ジオメトリ詳細」オフ、Intel ArcのResizable BAR、画質を下げる順番、最低・推奨環境のfpsの目安を解説。',
  }),
];
