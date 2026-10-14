# 管理ログインのタップ後に進まない不具合

2026-10-14。対象は `/admin/discord-servers` の「管理画面を開く」。開始HEADと最新リモートは `d09e229a288268e852dc7884a24bbcbcac8a9718` で一致し、既存差分なし。原因特定・修正・検証後の本番反映について、ユーザーの「いいよ」の承認を受領。

## 原因と証拠

元の `components/discord-server-admin.tsx` は、ログインの `fetch` をawaitした後に `event.currentTarget.reset()` を実行していた。Reactのイベント配送終了後にはcurrentTargetがnullになるため、認証応答が成功してもフォームのリセットで例外が発生し、一覧読込の `load()` に到達しない。

変更前ビルドをローカルPagesにコピーし、390px・タッチ入力、非秘密のダミー管理キーとモックAPIで再現。POSTは1件送られたが一覧GETは初期確認の1件だけで、`Cannot read properties of null (reading 'reset')` が発生し、ログインフォームが残った。

同じ画面でボタンのdisabledはfalse、pointer-eventsはauto、高さ44px、中央のヒット対象もボタン自身だった。入力欄は非制御で、送信時にFormDataからDOM値を読む方式であり、キーのReact stateをdisabled条件にしていなかった。したがって、確認できた原因は自動入力のstate反映漏れやCSSの重なりではなく、非同期処理後のイベント参照である。これはローカル再現であり、ユーザーの実iPhone Safariで同じ条件を観察したものではない。

## 修正

- await前に実際のフォーム要素を保持し、その要素でresetする。貼り付け・入力イベントなしの自動入力相当でもFormDataの実値を読む。
- 空・空白だけのキーは送信しない。disabledはキー入力stateに依存せず、送信中に限る。
- refで二重送信を防ぎ、確認中表示とaria-busyを追加。15秒で通信を中止し、finallyで送信状態を解除。誤ったキー・通信失敗時には入力を保持して再試行可能にする。
- 一覧の初期確認・認証後読込にも15秒の期限と再試行を追加。壊れたJSONや読込失敗を例外のまま放置せず、Cookieが確認できない場合はログイン画面へ戻る。
- 非制御入力と `autocomplete=current-password` を維持。Enterのgoヒント、送信時のblur、44px以上の入力/ボタン、折返し、フォーカス表示を追加。

API、キー、認証検証、Cookie、SameSite/HttpOnly/Secure、有効期限、管理権限は変更していない。実際のキー・Cookieを取得/入力/ログ出力せず、全て非秘密のダミーとローカルモックで確認した。

## 検証

- `pnpm lint`、`pnpm typecheck`、`pnpm build`：PASS。426静的HTML、405 sitemap URL、345 OGが最新。`git diff --check` PASS。
- `scripts/check-admin-login-browser.mjs`：320/360/390/1440px×通常入力・貼り付け相当・イベントなしDOM値反映・Enter＝16ケースPASS。短い390×420ビューポート、空入力、誤入力/503/接続失敗と再試行、連打、POST期限と遅い応答、GETの不正JSON/500/401/期限、初回認証確認の期限と再試行＝追加12ケースPASS。ボタンのヒットテスト、44px、文字サイズ、横はみ出し、JS例外・CSS/JS失敗なし。短いビューポートはソフトウェアキーボードの近似であり、実iOSキーボードの検証ではない。
- `node scripts/test-diagnosis.mjs tests/diagnosis/qa.test.ts`：認証・Cookie・権限制御を含む14件PASS。
- `node scripts/check-game-request-api.mjs`：管理認証・公開側の制限・永続化/重複/lease等の既存ローカルAPI回帰PASS。
- `node scripts/check-game-request-manual.mjs`：手動審査・認証/CSRF/CAS等はPASS。最後の時間依存検査で、fixture初期化込みの2.5秒期限が切れて `available=false` となり原版は失敗。一時コピーで期限を10秒、期限を越す遅延を10.2秒にし、同じ全assertionを再実行してPASS。原版テスト・本番コード・設定は変更していない。一時検査のランナーは `/tmp/gemnao-qa/run-manual-review-timing.mjs`。
- 多言語184ページ、editorial snapshot426ページ、既存My Games表示/計測、全体バックアップ、続き/候補/タスク/対処、設定比較、実験、公式変更の各ロジック回帰PASS。
- ローカル390pxの入力画面と確認中画面を撮影し、確認中画面を目視。

証跡：`.wrangler/admin-login-review/baseline.json`、`results.json`、`form-390.png`、`busy-390.png`。ログ：`/tmp/admin-login-build.log`、`/tmp/admin-login-browser-final.log`、`/tmp/admin-login-manual-retimed.log`。ローカルPagesはD1を継承しない一時設定で、ブラウザーの外部通信を遮断している。

## 範囲と公開

変更は `components/discord-server-admin.tsx`、管理ログインのCSS、専用ブラウザー検査、この報告書の4ファイルのみ。管理ログイン修正の公開承認済み。ゲーム追加リクエスト件数の本番調査は未確認のままで、今回のモックの空一覧を本番の0件とは扱わない。

DB・認証設定・管理キー・他の設定・IndexNow/Bing/GSCは変更しない。実iPhone Safari、実キーでのログイン、本番Cookieの実動作は未検証。配信成功と公開画面/CSS/JSの直接確認ができたかは、公開記録で分けて報告する。
