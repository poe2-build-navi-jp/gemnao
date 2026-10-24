import { myGamesCopy, type MyGamesLocale } from '@/lib/my-games-copy';
import type { MyGamesNotice as Notice } from '@/lib/my-games-selection';

export function MyGamesNotice({
  notice,
  locale,
}: {
  notice: Notice | null;
  locale: MyGamesLocale;
}) {
  const t = myGamesCopy[locale];
  const urgent = notice?.kind === 'error' || notice?.kind === 'warning';
  const text = notice
    ? `${t.noticeLabels[notice.kind]}: ${t[notice.message]}`
    : '';
  return (
    <div className="my-games-notice" data-kind={notice?.kind}>
      <output aria-live="polite" aria-atomic="true">
        {!urgent ? text : ''}
      </output>
      <div role="alert" aria-atomic="true">
        {urgent ? text : ''}
      </div>
    </div>
  );
}
