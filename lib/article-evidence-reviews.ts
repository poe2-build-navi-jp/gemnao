// Editorial records, not hardware test results. Dates refer only to the stated source scope.
export type ArticleEvidenceReview = {
  scope: string;
  result: string;
  limits: string;
  sourceReview: string;
  official: { text: string; label: string; url: string }[];
  compare: string;
  reportPath?: string;
};
const verifySource = {
  label: 'Steam公式：ゲームファイルの整合性確認',
  url: 'https://help.steampowered.com/ja/faqs/view/0C48-FCBD-DA71-93EB',
};
export const articleEvidenceReviews: Record<string, ArticleEvidenceReview> = {
  '/games/monster-hunter-wilds/not-launching': {
    scope:
      'Windows PC・Steam製品版。本人報告のゲーム・Steam・Windows・ドライバーの版は未記録。体験版や家庭用機の結果へは広げません。',
    result:
      '既存の本人報告1件では、整合性確認で再取得なし、OBS終了・SteamオーバーレイOFFでも改善なし。Steam側の追加DLLを復元可能な形で切り離した後、起動・プレイでき、PC再起動後も遊べたと報告されています。編集部の実機テストではありません。',
    limits:
      '正確な報告日時、プレイ時間、再起動回数、長期の再発状況は未記録です。複数のローダーを同時に切り離したため原因DLLは特定できず、ほかのPCでの改善率も分かりません。2026-10-03は元記事の記録日で、実験日ではありません。',
    sourceReview:
      '公式ガイドの動作要件・高解像度テクスチャ条件は2026-10-25に本文を照合。本人報告は既存公開記録（資料確認日2026-10-14）を再利用し、新しい検証結果は追加していません。',
    official: [
      {
        text: 'Capcomは最低動作要件の確認を案内し、高解像度テクスチャパックにはVRAM 16GB以上が必要としています。この案内は追加DLLが原因だったことの証明ではありません。',
        label: 'Capcom：公式トラブルシューティングガイド',
        url: 'https://steamcommunity.com/app/2246340/discussions/0/596267902352499417/',
      },
    ],
    compare:
      '起動前に終了する場合と狩猟中の再発を分け、変更は1項目ずつ。同じ場面・設定・経過時間で比較し、再発したら時刻とCrashReportを対応させます。追加DLLの導入元・読み込み元・戻し方が分からない場合は、名前だけで削除せず操作を止めてください。',
    reportPath: '/examples/wilds-steam-added-dll',
  },
  '/guide/steam-game-not-launching': {
    scope:
      'Windows上のSteamゲーム。特定タイトル・ビルドの修正済み情報ではありません。外部ランチャーを使うゲームでは、ランチャー名と版も分けて記録します。',
    result:
      'この共通手順について、編集部の実機で起動失敗を再現・修復した結果はありません。Wildsの本人報告を、Steam全体での成功実績として転用していません。',
    limits:
      '「プレイ」が戻るまでの秒数や停止履歴は調べる場所を選ぶ手掛かりです。プロセスが見えないだけでは起動処理の有無を断定できず、履歴のDLL名だけでも原因は決まりません。',
    sourceReview:
      '既存記事の資料確認日は2026-10-21。2026-10-25はSteam公式ページの検索抜粋まで確認できましたが、本文を再取得できていないため最新の画面・手順の再確認済みとはしていません。',
    official: [
      {
        text: 'Steamの公式FAQは、起動準備後に動かない場合のWindows・ドライバー・ファイル整合性・競合ソフト・要件の確認先です。本文の症状別の順序は編集上の整理です。',
        label: 'Steam公式：起動準備後にゲームが動かない',
        url: 'https://help.steampowered.com/ja/faqs/view/5814-D9A3-BE42-62DF',
      },
    ],
    compare:
      '試す前後でゲーム名・版、プレイから終了までの状態、エラー全文、停止時刻を比較します。別ゲームも失敗するかを分け、何を1つ変えたかを残してください。保護の無効化や無条件の除外設定はこの比較に含めません。',
  },
  '/guide/verify-steam-files': {
    scope:
      'Steamのインストール済みゲームファイル。セーブの復旧、MOD互換性、ドライバーや機器の故障を検査する機能ではありません。ゲーム・Steamクライアントの対象ビルドは特定していません。',
    result:
      'この解説の手順を編集部の実機で比較した結果はありません。既存Wilds本人報告では再取得がなかったことまで記録されていますが、全ゲームでの正常判定や修復成功を示しません。',
    limits:
      '再取得の有無と、同じ場面で症状が改善したかは別の結果です。再取得があっても原因は確定せず、再取得なしでもゲーム以外の要因は除外できません。',
    sourceReview:
      '既存記事の資料確認日は2026-09-27。2026-10-25は公式ページの検索抜粋を確認しましたが、本文を再取得できず、手順全体の再確認日は更新していません。',
    official: [
      {
        ...verifySource,
        text: 'Steamの公式案内は、インストール済みゲームファイルを確認する操作の根拠です。以下の結果の記録方法は編集部の比較手順であり、修復率の測定ではありません。',
      },
    ],
    compare:
      '完了表示、再取得の有無、ダウンロード完了、起動結果、元の症状が出た場面の5点を分けて記録します。毎回再取得するなら更新・ドライブ・保護履歴を照合し、結果を控えず何度も繰り返すことは避けます。',
  },
  '/guide/directx-error': {
    scope:
      'Windows PCのDirectX関連エラー。DirectXの版、GPUの機能レベル、追加ライブラリ、ゲームの要求条件は別々に照合します。特定ゲームの修正パッチを検証した記事ではありません。',
    result:
      '編集部によるGPU別・ドライバー別の再現テストや、ランタイム導入前後の改善測定は行っていません。DLL名やDXGIコードの説明と、このPCでの原因特定は別です。',
    limits:
      'DXGI_ERROR_DEVICE_REMOVEDだけでGPU故障とは判断できません。古い追加ランタイムの導入でGPUの機能レベルが増える、すべてのDirectXエラーが直るとはいえません。',
    sourceReview:
      '2026-10-25にMicrosoftのDXGIエラー定義とJune 2010追加ランタイムの説明を照合。これは引用箇所の資料確認であり、記事全体や実機の最新動作確認ではありません。',
    official: [
      {
        text: 'MicrosoftはDEVICE_REMOVEDをデバイスが削除された状態として説明し、ドライバーの更新も挙げています。コードだけでハードウェア故障と決めつける根拠にはなりません。',
        label: 'Microsoft Learn：DXGI_ERROR',
        url: 'https://learn.microsoft.com/ja-jp/windows/win32/direct3ddxgi/dxgi-error',
      },
      {
        text: 'June 2010パッケージは旧SDKを使うゲーム向けの追加ライブラリで、Windowsに入っているDirectX Runtimeの版は変更しません。',
        label: 'Microsoft：DirectX End-User Runtimes (June 2010)',
        url: 'https://www.microsoft.com/en-us/download/details.aspx?id=8109',
      },
    ],
    compare:
      'エラー全文と使用GPU、ドライバー版、ゲームの版を残します。機能レベル不足・追加DLL不足・DXGIエラーを分け、該当する手順だけを試した後、同じ起動や描画場面で比較してください。',
  },
};
