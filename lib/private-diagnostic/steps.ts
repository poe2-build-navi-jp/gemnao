// Fixed labels mirrored from the existing native step catalog; never free text.
export const stepLabels: Record<string, readonly [string, string]> = {
  observe: [
    '発生場面と対象を確認',
    'Check the target and when the problem occurs',
  ],
  files: [
    '配布ファイルの検証手順を確認',
    'Check how to verify the distributed files',
  ],
  graphics: [
    '描画環境とドライバー版を照合',
    'Cross-check the graphics environment and driver version',
  ],
  runtime: [
    '必要ランタイムの公式要件を照合',
    'Cross-check the official runtime requirements',
  ],
  space: [
    '対象ドライブの空き容量を確認',
    'Check free space on the target drive',
  ],
  memory: [
    '不要なアプリを閉じた条件で比較',
    'Compare with unnecessary applications closed',
  ],
  stop: ['PC全体の異常なら再現を中止', 'Stop reproducing system-wide problems'],
  'wilds-steam-client-review': [
    'Steam側の追加構成を導入元と照合',
    'Cross-check Steam-side add-ons with their source',
  ],
  'wilds-stop': [
    'PC全体の異常があるので再現を止める',
    'Stop reproducing the issue because it affects the whole PC',
  ],
  'wilds-security': [
    'ブロック通知がある場合は保護履歴を確認',
    'Check Protection history if there is a blocking notification',
  ],
  'wilds-compatibility': [
    '互換モードが設定されているか確認',
    'Check whether compatibility mode is enabled',
  ],
  'wilds-admin-flag': [
    '管理者実行の登録を現在の画面で照合',
    'Cross-check the administrator setting in the current UI',
  ],
  'wilds-mods': [
    '自分で入れたMOD・描画ツールを確認',
    'Check mods and graphics tools you installed yourself',
  ],
  'wilds-capture': [
    '録画/オーバーレイを終了した条件と1回比較',
    'Compare once with recording tools/overlays closed',
  ],
  'wilds-traces': [
    '見つかった追加ツール名の痕跡を確認',
    'Check the detected traces of add-on tool names',
  ],
  'wilds-files': [
    'Steamの整合性確認を1回行う',
    'Verify file integrity in Steam once',
  ],
  'wilds-textures': [
    '高解像度テクスチャDLCを確認',
    'Check the high-resolution texture DLC',
  ],
  'wilds-driver': [
    '実際のGPUドライバー版と公式情報を照合',
    'Cross-check the actual GPU driver version with official information',
  ],
  'wilds-requirements': [
    '公式の必要環境との未確認点を照合',
    'Cross-check unverified points in the official system requirements',
  ],
  'wilds-records': [
    'CrashReportと試した結果を保管して相談',
    'Keep CrashReports and test results, then seek support',
  ],
  'game-context': [
    '選んだ本体・発生場面と公式情報を照合',
    'Cross-check the selected executable and scene with official information',
  ],
  'game-black-screen': [
    '黒画面がゲーム内かPC全体かを分ける',
    'Determine whether the black screen affects the game or the whole PC',
  ],
  'game-freeze': [
    'ゲームの応答停止と処理待ちを分ける',
    'Distinguish a game hang from waiting for processing',
  ],
  'game-performance': [
    '同じ場面で1項目だけ画質を比較',
    'Compare one graphics setting in the same scene',
  ],
  'game-stutter': [
    'カクつく条件と処理待ちを確認',
    'Check when stuttering occurs and whether processing is still underway',
  ],
  'game-capture': [
    '利用中の録画/オーバーレイを1つずつ比較',
    'Compare recording tools and overlays one at a time',
  ],
  'game-mods': [
    '追加ツールの導入元と対応版を確認',
    'Check the source and supported versions of add-on tools',
  ],
  'game-compatibility': [
    '互換モード/管理者実行の登録を確認',
    'Check registered compatibility and administrator settings',
  ],
  'game-steam-client': [
    'Steam側の追加構成を導入元と照合',
    'Cross-check Steam-side add-ons with their source',
  ],
  'game-records': [
    '記録を保管してゲームの公式窓口へ',
    "Keep the records and consult the game's official support",
  ],
};
