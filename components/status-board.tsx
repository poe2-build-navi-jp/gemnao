'use client';
import { maintenanceLabels } from '@/lib/status/policy';

/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Wrench,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import type { StatusData } from '@/lib/status/data';

const discordLabel: Record<string, string> = {
  none: '正常に稼働中',
  minor: '一部で不具合あり',
  major: '大きな障害が発生中',
  critical: '重大な障害が発生中',
  maintenance: 'メンテナンス中',
};

const time = new Intl.DateTimeFormat('ja-JP', {
  timeZone: 'Asia/Tokyo',
  month: 'numeric',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});
const fmt = (iso: string) => time.format(new Date(iso));
const refreshMs = 10 * 60 * 1000;
const discordMaintenanceLabels: Record<string, string> = {
  scheduled: 'メンテ予定',
  in_progress: 'メンテ実施中',
  verifying: '復旧確認中',
};
const incidentLabels: Record<string, string> = {
  investigating: '調査中',
  identified: '原因特定',
  monitoring: '復旧を監視中',
};

function useStatus() {
  const [data, setData] = useState<StatusData | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let controller: AbortController | null = null;
    let lastAttempt = 0;
    let disposed = false;
    const refresh = async () => {
      if (
        disposed ||
        document.visibilityState === 'hidden' ||
        (controller && !controller.signal.aborted)
      )
        return;
      const requestController = new AbortController();
      controller = requestController;
      lastAttempt = Date.now();
      try {
        const response = await fetch('/api/status?v=2', {
          signal: requestController.signal,
        });
        if (!response.ok) throw new Error(String(response.status));
        const value = (await response.json()) as StatusData;
        if (!value.discordSource || !Array.isArray(value.steamSources))
          throw new Error('Invalid status response');
        if (!disposed && !requestController.signal.aborted) {
          setData((previous) => ({
            ...value,
            discordSource: {
              ...value.discordSource,
              lastSuccessfulAt:
                value.discordSource.lastSuccessfulAt ??
                previous?.discordSource.lastSuccessfulAt ??
                null,
            },
            steamSources: value.steamSources.map((source) => ({
              ...source,
              lastSuccessfulAt:
                source.lastSuccessfulAt ??
                previous?.steamSources.find(
                  (old) => old.gameSlug === source.gameSlug,
                )?.lastSuccessfulAt ??
                null,
            })),
          }));
          setFailed(false);
        }
      } catch (error: unknown) {
        if (
          !disposed &&
          !(error instanceof DOMException && error.name === 'AbortError')
        )
          setFailed(true);
      } finally {
        if (controller === requestController) controller = null;
      }
    };
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') {
        if (controller) {
          controller.abort();
          lastAttempt = 0;
        }
        return;
      }
      if (
        document.visibilityState === 'visible' &&
        Date.now() - lastAttempt >= refreshMs
      )
        void refresh();
    };
    void refresh();
    const interval = window.setInterval(() => {
      void refresh();
    }, refreshMs);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      disposed = true;
      controller?.abort();
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);
  return { data, failed };
}

/** One-glance version for the top page. */
export function StatusTicker() {
  const { data, failed } = useStatus();
  const unavailable =
    failed ||
    (data &&
      (!data.discord || data.steamSources.some((source) => !source.available)));
  const discordIssues = data?.discord
    ? Math.max(
        data.discord.incidents.length + data.discord.maintenances.length,
        data.discord.indicator !== 'none' ? 1 : 0,
      )
    : 0;
  const issues = (data?.maintenance.length ?? 0) + discordIssues;
  return (
    <section className="status-ticker" aria-labelledby="status-ticker-title">
      <div>
        <h2 id="status-ticker-title">
          <Wrench size={18} /> 今日、落ちてる？
        </h2>
        {data ? (
          <p>
            {failed
              ? `前回取得した情報：${fmt(data.checkedAt)}（日本時間）｜`
              : ''}
            {issues
              ? `公式の障害・メンテナンス情報 ${issues}件（予定・終了未確認を含む）`
              : unavailable
                ? '取得できない公式情報があります。現在の状況は確認できません'
                : '現在表示できる障害・メンテナンス情報はありません'}
            {data.discord && !failed
              ? `｜Discord：${discordLabel[data.discord.indicator] ?? data.discord.description}`
              : ''}
          </p>
        ) : (
          <p>
            {failed
              ? '公式の情報を取得できませんでした。公式ページを確認してください'
              : '公式の障害情報を確認しています…'}
          </p>
        )}
        {data && unavailable && issues > 0 ? (
          <p>
            一部の最新情報を取得できません。詳細で確認日時をご確認ください。
          </p>
        ) : null}
        {data?.maintenance[0] ? (
          <p className="status-ticker-item">
            <b>{maintenanceLabels[data.maintenance[0].state]}</b>{' '}
            {data.maintenance[0].game}：{fmt(data.maintenance[0].start)}〜
            {fmt(data.maintenance[0].end)}（日本時間）
          </p>
        ) : null}
      </div>
      <a href="/status">障害・メンテ情報を見る</a>
    </section>
  );
}

export function StatusBoard() {
  const { data, failed } = useStatus();
  if (failed && !data)
    return (
      <p className="status-empty">
        情報を読み込めませんでした。時間をおいて再読み込みするか、下の公式ページを確認してください。
      </p>
    );
  if (!data) return <p className="status-empty">公式の情報を確認しています…</p>;
  const failedSources = data.steamSources.filter((source) => !source.available);
  return (
    <div className="status-board">
      <p className="status-updated">
        最終取得：{fmt(data.checkedAt)}
        （日本時間／ページを開いている間は約10分ごとに更新）
      </p>

      {failed ? (
        <output className="status-empty">
          最新情報への更新に失敗しました。前回取得した情報を表示しています。復旧・継続状況は公式ページで確認してください。
        </output>
      ) : null}
      <p className="status-note">
        公式が復旧・完了を発表した情報は、次の取得時または確認後の更新で一覧から外します。予定の終了時刻を過ぎただけでは復旧扱いにしません。ゲームの公式告知は編集部が確認して登録し、DiscordとSteamのお知らせは自動取得しています。
      </p>
      <section aria-labelledby="status-maintenance">
        <h2 id="status-maintenance">メンテナンス</h2>
        {data.maintenance.length ? (
          <ul className="status-list">
            {data.maintenance.map((item) => (
              <li key={item.gameSlug + item.start}>
                <span className={`status-badge status-${item.state}`}>
                  {maintenanceLabels[item.state]}
                </span>
                <div>
                  <b>
                    <a href={`/games/${item.gameSlug}`}>{item.game}</a>：
                    {item.title}
                  </b>
                  <p>
                    {fmt(item.start)}〜{fmt(item.end)}（日本時間）
                    {item.note ? ` ${item.note}` : ''}
                    {item.state === 'unconfirmed'
                      ? ' 予定時刻は過ぎていますが、公式の終了・復旧発表は未確認です。'
                      : item.state === 'scheduled-window'
                        ? ' 予定の時間帯です。実施・延長状況は公式告知をご確認ください。'
                        : ''}
                  </p>
                  <p>告知確認：{fmt(item.verifiedAt)}（日本時間）</p>
                  <a href={item.source.url} target="_blank" rel="noreferrer">
                    {item.source.label} <ExternalLink size={13} />
                  </a>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="status-empty">
            確認済みのメンテナンス情報の登録はありません。
          </p>
        )}
      </section>

      <section aria-labelledby="status-discord">
        <h2 id="status-discord">Discord</h2>
        {data.discord ? (
          <div className="status-list">
            <p>
              {data.discord.indicator === 'none' ? (
                <CheckCircle2 size={17} />
              ) : (
                <AlertTriangle size={17} />
              )}{' '}
              <b>
                {discordLabel[data.discord.indicator] ??
                  data.discord.description}
              </b>
              （Discord公式の稼働状況）
              <br />
              取得成功：{fmt(data.discord.checkedAt)}（日本時間）
            </p>
            {data.discord.incidents.map((incident) => (
              <p key={incident.url}>
                <a href={incident.url} target="_blank" rel="noreferrer">
                  {incident.name}（
                  {incidentLabels[incident.status] ?? incident.status}・
                  {fmt(incident.updatedAt)}
                  更新／日本時間）
                  <ExternalLink size={13} />
                </a>
              </p>
            ))}
            {data.discord.maintenances.map((item) => (
              <p key={item.url}>
                {discordMaintenanceLabels[item.status] ??
                  'メンテナンス状況確認中'}
                ：
                <a href={item.url} target="_blank" rel="noreferrer">
                  {item.name}（{fmt(item.start)}〜{fmt(item.end)}／日本時間）
                  <ExternalLink size={13} />
                </a>
              </p>
            ))}
          </div>
        ) : (
          <p className="status-empty">
            Discordの稼働状況を取得できませんでした（取得を試みた日時：
            {fmt(data.discordSource.checkedAt)}／日本時間）。
            {data.discordSource.lastSuccessfulAt
              ? ` 前回の取得成功：${fmt(data.discordSource.lastSuccessfulAt)}（日本時間）。`
              : ' 取得成功した情報がないため、現在の状況は確認できません。'}
            <a
              href="https://discordstatus.com/"
              target="_blank"
              rel="noreferrer"
            >
              Discord Status
            </a>
            を確認してください。
          </p>
        )}
      </section>

      <section aria-labelledby="status-notices">
        <h2 id="status-notices">ゲームの公式のお知らせ（直近3日）</h2>
        <p className="status-note">
          各ゲームの運営元がSteamに公開した公式アナウンスのうち、直近3日のメンテナンス・不具合・修正・アップデートを掲載しています（各ゲーム最新5件から最大12件）。修正済みの内容を含む参考情報で、現在のサーバー障害を示す一覧ではありません。復旧・完了を表す告知は除外しています。
        </p>
        <details className="status-note">
          <summary>
            取得元と確認日時（{data.steamSources.length - failedSources.length}/
            {data.steamSources.length}ゲーム取得成功）
          </summary>
          <ul>
            {data.steamSources.map((source) => (
              <li key={source.gameSlug}>
                <a href={source.url} target="_blank" rel="noreferrer">
                  {source.game}
                </a>
                ：{source.available ? '取得成功' : '取得できませんでした'}{' '}
                {fmt(source.checkedAt)}（日本時間）
                {!source.available && source.lastSuccessfulAt
                  ? `／前回の取得成功：${fmt(source.lastSuccessfulAt)}（日本時間）`
                  : ''}
              </li>
            ))}
          </ul>
        </details>
        {failedSources.length ? (
          <p className="status-empty">
            {failedSources.map((source) => source.game).join('、')}{' '}
            のお知らせを取得できませんでした。お知らせの有無や復旧状況は判断できません。
          </p>
        ) : null}
        {data.notices.length ? (
          <ul className="status-list">
            {data.notices.map((notice) => (
              <li key={notice.url}>
                <span className="status-badge">{fmt(notice.date)}</span>
                <div>
                  <b>
                    <a href={`/games/${notice.gameSlug}`}>{notice.game}</a>
                  </b>
                  <p>
                    <a href={notice.url} target="_blank" rel="noreferrer">
                      {notice.title} <ExternalLink size={13} />
                    </a>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="status-empty">
            {failedSources.length
              ? '取得できた公式情報には、直近3日の該当するお知らせはありません。'
              : '取得した範囲に直近3日の該当するお知らせはありません。'}
          </p>
        )}
      </section>

      <section aria-labelledby="status-spikes">
        <h2 id="status-spikes">
          ゲムなおで「困っている」が急に増えているページ
        </h2>
        <p className="status-note">
          過去24時間の「困っている」の回答が3件以上で、その前の1週間の1日平均の3倍以上になったページです。障害を確認したものではなく、読者の報告が増えている目安です。
        </p>
        {data.spikes.length ? (
          <ul className="status-list">
            {data.spikes.map((spike) => (
              <li key={spike.href}>
                <span className="status-badge status-ongoing">
                  24時間で{spike.last24h}件
                </span>
                <div>
                  <a href={spike.href}>{spike.label}</a>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="status-empty">急に増えているページはありません。</p>
        )}
      </section>
    </div>
  );
}
