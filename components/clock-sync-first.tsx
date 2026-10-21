/* oxlint-disable next/no-html-link-for-pages -- Same-page procedure anchor. */
export function ClockSyncFirst({ locale = 'ja' }: { locale?: 'ja' | 'en' }) {
  return (
    <section className="clock-sync-first" aria-label={locale === 'en' ? 'First check' : 'まず試す対処'}>
      <p>{locale === 'en'
        ? 'First check: synchronize Windows time, then restart Steam and the game. The publisher recommends this check for ST-3100001; it is not a guaranteed fix.'
        : 'まずWindowsの時刻を同期し、Steamとゲームを再起動してください。ST-3100001で公式が案内する確認手順です。必ず直るとは限りません。'}</p>
      <a href="#sync-time">{locale === 'en' ? 'Try Windows time sync →' : '時刻同期の手順を試す →'}</a>
    </section>
  );
}
