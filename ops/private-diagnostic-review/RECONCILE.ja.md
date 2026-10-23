# 失敗した有限QAの読み取り照合

既存operation `private-qa-readiness` を、このrevisionでは失敗した有限QAの照合用に限定する。以前の3要求のreadiness確認とは異なるplan hashとmodeを表示する。新しいメニューやworkflow、credentialは追加しない。元のfinite実行・driver POSTは再送しない。

固定2要求のみ：新しいQA Workerのsettings GETと、承認対象の既存QA DBに対する6個のprivate表のCOUNTを一つにまとめたSELECT。SQLは固定、本文/receipt ID/delete hash/cursor/個別日時/legacy行をSELECTしない。settingsのcredential/verifier値を参照・表示しない。新規resource、設定変更、削除、cron、メール、本番操作なし。401/403・不確実応答ではその場で停止し、別経路や再試行なし。

countsはメモリ内で空/非空へ射影し、公開Actionsログには正確な件数を保存しない。6表の期待結果が欠けた場合は空と推測せず失敗する。gateの実設定は最大15分か、現在その期限が切れているか、guard時刻との整合を検査する。public gateが閉じていても、DOの永続closeやデータ削除を証明したとは扱わない。DO内部の状態を読む既存入口はないので `doPersistedCloseVerified:false` を維持する。

過去driver呼出しのHTTP status/bodyは保存されていないため、この読み取りで過去のHTTP失敗原因を断定しない。再POSTして原因を再現しない。結果に応じて、残存なし、合成状態残存、構成不一致を区別して次の復旧範囲を決める。

実行は既存controller branchを選び、operation `private-qa-readiness` を一回起動して、表示されたexact head/planを確認した本人が `gemnao-preview-data` を承認する。`private-qa-finite` は選ばない。
