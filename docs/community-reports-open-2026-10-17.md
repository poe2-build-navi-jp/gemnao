# 受付設定の本番成功記録とソース追随

open-free run39020582512（source797f97e48108ff89942cb71067cdd76de430a32b）、本人Environment承認後にgate/control成功。2026-10-17 09:24:40 UTCのcontrol receiptはok=true、phase=open、intakeEnabled=true、nextWrite=null、completed=[pages-open]。

- Pages deployment: 5293628c-46c5-4291-b4a7-2822f071b7d0
- desiredConfigSha256: 5d52eaf0453081707974630c52afdbd216364f8f685585804a3d761fca5c2500
- health checkedAt: 2026-10-17T09:24:40.000Z、cleanupAt: 2026-10-17T09:15:23.000Z、schemaVersion2/free-small-v1
- 投稿/改訂/監査/通報/参照・期限切れ関連・古いrateは0件、D1 cleanup記録1792228523。
- start-free run39019508301、staged deployment d6761a23-5a31-4d93-9da0-487a2ee71516でcron開始。初回cleanup実成功を確認してからopen-freeが配備した。
- 親から提供されたreceipt artifact SHA256: 9f42c52d34f9dd4f4c125cf3dd22108af7b81a4f1fc35b87cccf5507f386b7c8。こちらはcontrolログのJSONを照合した。artifact本体を再ダウンロードしてhash照合したとは主張しない。

wrangler.jsonは上記desiredConfigSha256に一致するlaunchConfig(base,true)へ同期。既存DB/service/preview/他機能設定はそのまま。bootstrap/verification/automatic analyticsはOFF。新しい本番操作ではなく、既に成功した設定のソース追随。commitは[CF-Pages-Skip]で、通常Pages配備は今回しない。初回launch controllerはこの追随後HEADの再実行用ではない。

## UIの証拠と未完了事項

共通closed-setup receiptはgeneralReportingUiIncludedをfalseで初期化し、free-launch経路では更新しない。この値はUI不在を検査した結果ではない。実receiptの値は改竄せずfalseのまま記録する。

復旧38ファイルのcommit f6e928cb7e7548cf7f51b6846580ab33c04cbc2eは公開797f97eの祖先。fa5f0f5で閉鎖状態のUI配備、8f964ad/code-only run39003076598のPages7215d9ee-cfc7-45a2-89cc-a06849a2ca28へ継承し、start/openも同じruntimeを配備した。app/reports、app/[locale]/reports、components/community-reports.tsx、community-reports-page.tsxは復旧commitから公開SHAまで差分なし。UIを重複実装する必要は確認されていない。

既存入口は /reports（日本語）、/en/reports、/zh/reports、/es/reports。記事のReportEntryLink、マイゲームのMyReportLinksも既存。フォームはstatusのenabled、公開候補プレビュー、同意などを満たしたとき送信を有効化する。初期HTMLだけではenabledを判定できず、ブラウザの実status取得とhydrationが必要。

**本番利用者の送信入口確認は未完了。** 親ブラウザで記事リンク→/reportsの表示、JS/CSS、statusのenabled/publicEnabled/canDelete、フォーム入力→プレビュー→同意後の送信ボタン有効を確認する（送信は押さず、試験下書きは他の保存データに触れず処理）。statusのGETは既存設計で日次枠/rate記録を使うため、繰り返し検査しない。公開healthのJSONは親ブラウザでok/intake/public trueを確認したがHTTP番号自体は報告されていない。controlのreadyHealthはHTTP200を要求して通過した、という機械検査の証拠と区別する。

監視通知は旧SHA122a79dのmanual run39017990097の端末受領確認。confirmedAt08:37:42 UTC、deliveredAt=null、scheduleVerified=false。定期監視欠落時の通知不達リスクは引き続き残る。

## 親ブラウザの続報

2026-10-17 18:26 JSTの「準備中」表示は初期ロード中で、読込完了後に消えたと親が訂正。ゲーム・症状・状態フォーム、「下書きを保存」「公開候補を確認」が表示される。status初期値false→取得後更新という既存実装と一致し、UI/API不一致の確定報告は取り消す。UIコードの修正は不要。実投稿なし。プレビュー・同意後の最終送信ボタン状態は、まだ親から確認結果を受領していない。
