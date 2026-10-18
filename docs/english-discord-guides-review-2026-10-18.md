# English Discord guides — 2026-10-18

対象: `/en/discord` と `mic-not-working`、`stream-no-audio`、`screen-share-black-screen`。既存 upload-failed を含め一覧4記事。共通ナビ、検索、関連記事、実在する双方向hreflang、sitemap、OGを接続。

公式DiscordのVoice & Video、Mic Testing、Go Live、Windows capture、Microsoftのマイク・アプリ音声・Desktop Duplication資料を再確認。Mic Testing中のmute/deafenを明記。全画面共有で必ず無音になるとは断定せず、Linux等の音声共有制限と閲覧側の音量を分離。旧capture資料の制約は全バージョン保証にしない。機密画面共有や保護コンテンツの回避、セキュリティ停止を標準対処にしない。

日本語との原因ID・手順数・注意書き・FAQ数を既存検査で照合。言語違いの公式URLはDiscord記事IDとMicrosoftページパスで同じ出典を照合する。

検証: localized 203件、変更ファイルlint、全体strict型検査、隔離production build成功。451静的HTML、430 sitemap URL、370 OG、英語16組・内部リンク751件の回帰検査成功。375/390/1440pxで一覧＋3記事の12組をChromium確認、検索9件、モバイルナビ、未翻訳zh/esルート404を確認。JS例外・CSS/JS配信失敗・横スクロール・壊れたアンカーなし。APIはローカルfixture、外部送信遮断、本番投票なし。

公開HTML/CSS/JSの直接取得はこの環境のCONNECT403制限により親ブラウザ担当での確認が必要。Pages配備成功とは分けて扱う。
