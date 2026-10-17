/* oxlint-disable next/no-html-link-for-pages -- Official dated sources use native links. */
const notices = [
  {
    date: '2026-09-29',
    url: 'https://x.com/PROJECT_ACES/status/2104739973396373623',
    source: 'PROJECT_ACES / X',
    ja: [
      'ミッション終了後のエラー・ペナルティ',
      '本記事で紹介していた対応・ペナルティ解除予定の告知。今回は投稿全文を再確認できておらず、解除完了も未確認です。',
    ],
    en: [
      'Mission-end errors and penalties',
      'The notice previously cited here for the response and planned penalty clearance. Its full text could not be rechecked in this review, and completion of penalty clearance is unconfirmed.',
    ],
  },
  {
    date: '2026-09-30',
    url: 'https://steamcommunity.com/ogg/2288340/announcements/detail/695399726270382124',
    source: 'Steam / About Error Code: ST-3100001',
    ja: [
      'ST-3100001・ゲームサーバーとの通信切断',
      '18:31 JST（09:31 UTC）発表。汎用的な通信切断エラーの説明とWindows時刻同期の確認案内です。修正完了の発表ではありません。',
    ],
    en: [
      'ST-3100001 and loss of server communication',
      'Published at 09:31 UTC (18:31 JST). Explains the general disconnection code and recommends checking Windows time synchronization. It does not announce a completed fix.',
    ],
  },
  {
    date: '2026-10-09',
    url: 'https://steamcommunity.com/ogg/2288340/announcements/detail/695400360681933547',
    source: 'Steam / Official notice',
    ja: [
      'マッチメイキング',
      '16:46 JST発表。一部環境のマッチメイキング問題についてWindows 11・SSDの案内と更新準備中の説明があります。ST-3100001全体の解消や、9月29日のペナルティ解除完了を示す根拠とは分けて扱います。',
    ],
    en: [
      'Matchmaking',
      'Published at 16:46 JST. Reports matchmaking problems in some environments, gives Windows 11 / SSD guidance and says an update is being prepared. Treat it separately from evidence that all ST-3100001 errors are fixed or that the September 29 penalty-clearance plan is complete.',
    ],
  },
  {
    date: '2026-10-16',
    url: 'https://steamcommunity.com/games/2288340/announcements/detail/667253496651711938',
    source: 'Steam / Product Notice ②',
    ja: [
      'メモリ関連のクラッシュ',
      '20:10 JST発表の暫定案内です。クラッシュと通信切断は別の症状で、ST-3100001の修正確認には使えません。',
    ],
    en: [
      'Memory-related crashes',
      'Interim guidance published at 20:10 JST. A crash and a server disconnection are different symptoms; this is not confirmation of an ST-3100001 fix.',
    ],
  },
];
export function AceCombatNoticeHistory({
  locale = 'ja',
}: {
  locale?: 'ja' | 'en';
}) {
  const en = locale === 'en';
  return (
    <section className="diagnosis-table" id="official-notice-history">
      <h2>
        {en
          ? 'Official notice history: keep the symptoms separate'
          : '公式告知の履歴：対象症状を分けて確認'}
      </h2>
      <p>
        {en
          ? 'The earlier October 2 date described the initial notice review; October 13 described the Windows time-sync procedure update. This history was organized on October 18, 2026 (JST). A page review date is not the date a game issue was fixed.'
          : '従来の本文の10月2日は告知の初回確認、ヘッダーの10月13日はWindows時刻同期手順の更新を指していました。今回は2026年10月18日（日本時間）に履歴を整理しています。記事の確認日はゲームの修正日ではありません。'}
      </p>
      <table>
        <thead>
          <tr>
            {(en
              ? ['Announcement date', 'Symptom', 'Status and scope', 'Source']
              : ['発表日', '対象症状', '状態・確認範囲', '出典']
            ).map((x) => (
              <th scope="col" key={x}>
                {x}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {notices.map((row) => (
            <tr key={row.date}>
              <td data-label={en ? 'Date' : '発表日'}>
                <time dateTime={row.date}>{row.date}</time>
              </td>
              <td data-label={en ? 'Symptom' : '対象症状'}>{row[locale][0]}</td>
              <td data-label={en ? 'Status' : '状態'}>{row[locale][1]}</td>
              <td data-label={en ? 'Source' : '出典'}>
                <a href={row.url} target="_blank" rel="noreferrer">
                  {row.source}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        {en
          ? 'Among the 37 official Steam announcements checked in this review, we found no announcement confirming a completed ST-3100001 fix or completion of the affected penalty-clearance plan. Lack of confirmation is not proof that the issue remains unfixed. Compare your symptom and date; do not repeatedly deploy just to test an error.'
          : '今回確認した公式Steam告知37件では、ST-3100001の修正完了・対象ペナルティ解除完了の発表を確認できませんでした。確認できないことは「未修正」の証明ではありません。自分の発生場面・日時と照合し、エラーの確認だけのために再出撃を繰り返さないでください。'}
      </p>
    </section>
  );
}
