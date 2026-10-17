/* oxlint-disable next/no-html-link-for-pages -- Existing guide destinations use native links. */
const source =
  'https://learn.microsoft.com/en-us/troubleshoot/windows-server/performance/troubleshoot-application-service-crashing-behavior';
const copy = {
  ja: {
    title: 'ログ・診断結果の読み取り例',
    note: '説明用サンプルです。実際のゲームの障害記録・実測結果・画面の再現ではありません。SampleGame.exeとOtherApp.exeは架空の名前です。時刻は同じ日の同じタイムゾーンとして比較します。',
    where:
      '信頼性の履歴では発生日時・アプリ名、イベントビューアーでは「全般」の障害が発生したアプリケーション名・モジュール名・例外コードを見ます。診断ツールでは選択した本体EXE、読み取った時間帯、対象ゲームのエラー・応答停止の観測を照合します。欄名はWindowsや表示箇所によって異なります。',
    read: '見る欄（サンプル）',
    know: '分かること・断定できないこと',
    next: '次の確認',
    cases: [
      {
        title: '1. ゲーム名と発生時刻が一致',
        fields: [
          ['本人のメモ', 'SampleGame.exeが20:15に閉じた'],
          ['記録の日時・アプリ名', '20:15／SampleGame.exe'],
          ['イベント', 'Application Error／1000'],
        ],
        meaning:
          '対象ゲームの停止と関連する記録の候補です。同じ時刻・名前でも原因までは確定できません。障害モジュール名や例外コードだけで、DLLの交換やドライバーの故障を判断しません。',
        href: '/guide/pc-game-crash#crash-timing',
        link: '落ちたタイミングから、比較する対処を1つ選ぶ',
      },
      {
        title: '2. 同時刻でも別アプリのエラー',
        fields: [
          ['本人のメモ', 'SampleGame.exeが20:15に閉じた'],
          ['記録の日時・アプリ名', '20:15／OtherApp.exe'],
        ],
        meaning:
          '時刻は近くても対象ゲームの停止記録とは一致しません。この記録だけでゲームの原因とは言えません。対象EXEやランチャーを取り違えていないか確認し、ゲーム名が一致する記録を探します。',
        href: '/guide/pc-game-crash#crash-history',
        link: '信頼性の履歴・イベントビューアーで対象を照合する',
      },
      {
        title: '3. 一致する記録が見つからない',
        fields: [
          ['本人のメモ', '20:15にゲームが閉じた'],
          ['確認した範囲', '20:10〜20:20／対象ゲームの一致記録0件'],
        ],
        meaning:
          'この範囲で一致記録を確認できなかった、という結果です。正常・解決済みの証明ではありません。診断の取得失敗・対象違い・時間帯違い・反映待ちを区別し、エラー表示がある場合は「0件」と混同しません。',
        href: '/tools/windows-diagnosis#use',
        link: '対象EXEと読み取り範囲を確認する',
      },
    ],
    stop: '記録がなくても、発生時刻・落ち方・試した1項目をメモして比較できます。PC全体の異常やセーブ破損が疑われる時は再現を繰り返さず、中止して該当する対処へ進みます。共有前にユーザー名、PC名、フルパスなどを除き、生ログをそのまま投稿しないでください。',
    source: '出典：Microsoft Learn — アプリケーションのクラッシュ記録の読み方',
  },
  en: {
    title: 'Reading logs and diagnosis results: three examples',
    note: 'Illustrative samples only: these are not real game incidents, measurements or screenshots. SampleGame.exe and OtherApp.exe are fictional names. Compare times on the same date and in the same time zone.',
    where:
      'In Reliability Monitor, inspect the event time and application. In Event Viewer, read the faulting application, module and exception code under General. In the diagnosis tool, compare the selected game executable, collection window and observed game errors or hangs. Field labels vary by Windows version and view.',
    read: 'Fields to compare (sample)',
    know: 'What this tells you—and its limits',
    next: 'Next check',
    cases: [
      {
        title: '1. The game and time match',
        fields: [
          ['Your observation', 'SampleGame.exe closed at 20:15'],
          ['Recorded time and application', '20:15 / SampleGame.exe'],
          ['Event', 'Application Error / 1000'],
        ],
        meaning:
          'This is a candidate record related to the game closing. Matching names and times do not establish the cause. A module name or exception code alone does not justify replacing a DLL or blaming the driver.',
        href: '/en/guide/pc-game-crash#crash-timing',
        link: 'Choose one comparison based on when the crash happens',
      },
      {
        title: '2. The error belongs to another app',
        fields: [
          ['Your observation', 'SampleGame.exe closed at 20:15'],
          ['Recorded time and application', '20:15 / OtherApp.exe'],
        ],
        meaning:
          'The time is close, but the application does not match. This record alone cannot explain the game crash. Check that you selected the game executable rather than its launcher, then look for matching records.',
        href: '/en/guide/pc-game-crash#crash-history',
        link: 'Match the application in Windows crash history',
      },
      {
        title: '3. No matching record is found',
        fields: [
          ['Your observation', 'The game closed at 20:15'],
          ['Range checked', '20:10–20:20 / 0 matching game records'],
        ],
        meaning:
          'No matching record was found in this range. That does not prove the game is healthy or fixed. Distinguish collection failures, a wrong executable or time window, and delayed records. An error reading data is not a zero-result observation.',
        href: '/en/tools/windows-diagnosis#use',
        link: 'Check the game executable and collection window',
      },
    ],
    stop: 'Without a record, you can still note the time, what closed and the one change tested. Do not repeatedly reproduce a problem if the whole PC is unstable or saves may be damaged. Before sharing, remove usernames, PC names and full paths; do not post raw logs.',
    source: 'Source: Microsoft Learn — reading application crash events',
  },
};
export function CrashRecordExamples({
  locale = 'ja',
}: {
  locale?: 'ja' | 'en';
}) {
  const t = copy[locale];
  return (
    <section className="crash-record-examples" id="crash-record-examples">
      <h2>{t.title}</h2>
      <p className="safety-note">{t.note}</p>
      <p>{t.where}</p>
      <div className="crash-record-cards">
        {t.cases.map((item) => (
          <article key={item.title}>
            <h3>{item.title}</h3>
            <h4>{t.read}</h4>
            <dl>
              {item.fields.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            <h4>{t.know}</h4>
            <p>{item.meaning}</p>
            <p>
              <strong>{t.next}: </strong>
              <a href={item.href}>{item.link}</a>
            </p>
          </article>
        ))}
      </div>
      <p>{t.stop}</p>
      <p>
        <a href={source} rel="noreferrer" target="_blank">
          {t.source}
        </a>
      </p>
    </section>
  );
}
