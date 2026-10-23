# private-qa-readiness: 一度だけの手動起動

既存protected controllerに追加した読み取り専用mode。`gemnao-preview-data` の本人承認、正確なhead/run、試行1、既存branch制限を維持する。新しいsecret・権限・承認記録は不要。Cloudflareは固定3要求のみ。raw設定、verifier、秘密、本文、受付ID、運用数値を出力しない。GET設定応答には他のplain-text設定も含まれ得るが、projectionは許可された設定項目だけを参照し、生応答をログ/成果物に保存しない。

- branch: `prepare/feedback-preview-controller-20261007`
- operation: `private-qa-readiness`
- plan SHA256: `1f46a71c9ea466c8c1d0243948e3dcbdd493c9811b97f4e4bfa4cf694e852faa`
- workflow: `.github/workflows/feedback-preview-control.yml`
- workflow page: https://github.com/poe2-build-navi-jp/gemnao/actions/workflows/feedback-preview-control.yml

起動前にbranch headが今回レビューしたcommitと一致することを確認する。default branchの選択肢登録はこの候補には含まない。ブラウザでbranch選択後にoperationが表示されるなら、そのbranch/operationでRun workflowを1回だけ押す。表示されない場合、本人が既に認証したGitHub CLIから次の固定入力で1回だけ起動する（新規認証やtokenをチャットで受け渡さない）:

```sh
gh workflow run feedback-preview-control.yml --repo poe2-build-navi-jp/gemnao --ref prepare/feedback-preview-controller-20261007 -f operation=private-qa-readiness
```

コマンドが失敗/不確実なら繰り返さず履歴を確認する。エージェントは過去のdispatch拒否を再試行しない。起動後は該当run URL、head、operation、gate出力planhashを読み取り照合し、本人がそのrunのReview deploymentsで `gemnao-preview-data` を承認する。起動前にはrun番号・承認URLを捏造しない。承認を代行しない。

固定要求:
1. QA WorkerのGET settings（既存2 D1 binding一致、ゲート期間、受付OFFをboolean判定）。
2. QA feedback DBのcleanup singletonだけSELECT（2時間以内かboolean判定）。
3. 同DBのsqlite_schemaでprivate_diagnostic_ namespaceが空かSELECT（boolean判定）。

401/403、redirect、期限切れ、応答不明、write-marked SQL結果では停止し再試行しない。namespace衝突/不明、binding不一致、heartbeat異常は有効化禁止。成功でも無料契約/共有残枠/QA再利用同意/メール送信元/Windows実機は別確認。DB migration、binding変更、受付開始、cron変更を含まない。
