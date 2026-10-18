# 英語版：音声・Steam Input・二重入力

日本語既存3記事の英語版を追加。英語共通一覧は9→12件。英語ホーム検索・関連記事・OG・sitemap・相互hreflangに接続。既存 `/en/pc/repair-or-replace` の検索・ホームカードの欠落も補った。

日本語版とSTEP ID・操作数（音声2/3/2/3、Steam Input 2/3/2、二重入力3/3/3）・FAQ数（5/7/5）・同一出典（言語違いを正規化）を照合。Steamの認識はゲームでの解決とは扱わず、名前とボタン反応の両方を確認する前提を明示。入力経路の比較はゲーム終了後、既存設定を記録し、一項目ずつ行う。HidHideの新規導入やドライバー削除を標準対処にしない。

Microsoftのapp audio / Bluetooth audio資料、ValveのGetting Started for Players / Legacy Modeを本文確認。Valveの旧画面例を現行の全機種共通画面とは断定しない。DS4Windows community documentationはコミュニティ資料として明記し、Microsoft公式資料とは扱わない。出典URLは各記事内に保存。

検証成功: localized221、対象lint、全体strict型、隔離production build、469静的HTML、448 sitemap URL、388OG。英語20記事の915内部リンク・アンカー、双方向metadata、言語切替、架空翻訳なし。Chromiumで375/390/1440pxの一覧と3記事12組、検索12件（既存PC記事を含む）、JS例外・CSS/JS失敗・横スクロール・切れたアンカー・API書き込み0。モバイル画面とOGの目視確認済み。

公開ページのHTML/CSS/JS確認は親ブラウザ担当へ渡す。実行環境から公開PagesはCONNECT403で取得できないため、この部分は未確認とする。公開後確認対象:

- https://gemnao.pages.dev/en
- https://gemnao.pages.dev/en/guide
- https://gemnao.pages.dev/en/guide/no-game-audio
- https://gemnao.pages.dev/en/guide/steam-input-controller
- https://gemnao.pages.dev/en/guide/controller-double-input
- https://gemnao.pages.dev/en/pc/repair-or-replace

全英語版のQAは `english-full-qa-2026-10-18.md` の別工程であり、今回のバッチ合格で完了とはしない。無関係collectorの未公開3ファイルと未公開スペイン語版・中国語版branchを除外。
