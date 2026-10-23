# 読み取り400の静的照合とローカル再現

## 再現できた不具合

旧照会は6表の `SELECT count(*)` をUNION ALLで連結していた。固定したローカルMiniflare/D1に正確なmigration全文を適用し、6表が存在する状態でも同じ照会が `too many terms in compound SELECT: SQLITE_ERROR` で失敗する。5項のcompound SELECTは成功する。したがってテーブル欠落を前提にしなくても旧照会自体が失敗する。remoteの400本文は未記録なので、この再現をremoteエラー本文の実測とは呼ばないが、修正が必要な具体的原因として確認できる。

元のテストはquery結果をmockしており、実D1でこの6項SQLを実行していなかった。`local-sql-check.mjs` に実行する回帰試験を追加した。一般的なSQLiteだけでは同じ制限を再現できないため、MiniflareのD1を使う。

## migrationとHTTP形式

[Cloudflare公式Query D1 Database](https://developers.cloudflare.com/api/resources/d1/subresources/database/methods/query/) はPOST queryのJSON `{sql}`、任意のparams、セミコロン区切りの複数文をサポートする。既存コードのJSON.stringify/Content-Type/URL形式はこの仕様と一致する。複数文という理由だけで不正とはしない。

元のmigration全文はSQLite complete_statementでtrigger本文を保って13文に分解でき、ローカルD1 batch適用は13文すべて成功した。schemaの6表名確認と単独COUNTは成功する。これはremote migrationの全完了の証明ではない。既存実行コードは結果配列の非空・期待件数と適用後schemaを照合しておらず、空配列にもeveryがtrueになる検証上の不足がある。有限試験の書込みコードは今回変更・再実行しない。

## 先のdriver失敗との関係

固定driverはUNIONを使わず、各表を個別COUNTする。したがって今回再現したcompound SELECT制限はdriver失敗の直接原因ではない。実ローカルD1から合成tableを1つ除くと、driverは事前COUNTで503、報告行作成前に停止することも再現した。ただしremoteでtableが欠けていると判明したわけではない。

driverのHTTP結果チェックはstatus非200、redirect、URL不一致を同じエラーにまとめ、応答status自体を記録していなかった。配備反映、認証、runtime/D1制限などを残存ログから区別できず、原因は未確定。今回の読み取りで再POSTして再現を試みない。

## 修正版の検証

- 設定の安全な判定をDBより前に独立checkpoint保存。
- 既知の6表名だけschema照合。実在表だけ個別COUNT、欠落はnull。最大8要求、各1回。
- 全schema、部分schema、空schema、書込みを示すmeta、不正結果、400、401/403、途中失敗、credential getter未参照、error message/result未参照を検証。
- 正確な件数、本文、識別子、秘密、provider messageを公開ログに出さない。
- `node ops/private-diagnostic-review/local-sql-check.mjs`：13文migration、6項UNION失敗/5項成功、修正版COUNT成功、合成欠落時driver503を実ローカルD1で確認。

remoteの再実行・承認・DB変更・設定変更・削除は行っていない。期限切れ、データ残存、DO永続closeは依然それぞれ未確認で、ローカル成功から推測しない。
