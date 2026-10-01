'use client';

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

function useStatus() {
  const [data, setData] = useState<StatusData | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/status', { signal: controller.signal })
      .then((response) =>
        response.ok
          ? (response.json() as Promise<StatusData>)
          : Promise.reject(new Error(String(response.status))),
      )
      .then((value) => setData(value))
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === 'AbortError'))
          setFailed(true);
      });
    return () => controller.abort();
  }, []);
  return { data, failed };
}

/** One-glance version for the top page. */
export function StatusTicker() {
  const { data, failed } = useStatus();
  if (failed) return null;
  const discordOk = !data?.discord || data.discord.indicator === 'none';
  const issues =
    (data?.maintenance.length ?? 0) +
    (data?.notices.length ?? 0) +
    (data?.spikes.length ?? 0) +
    (discordOk ? 0 : 1);
  return (
    <section className="status-ticker" aria-labelledby="status-ticker-title">
      <div>
        <h2 id="status-ticker-title">
          <Wrench size={18} /> 今日、落ちてる？
        </h2>
        {data ? (
          <p>
            {issues
              ? `公式の告知・メンテナンスなど ${issues}件`
              : '公式に告知された障害・メンテナンスはありません'}
            {data.discord
              ? `｜Discord：${discordLabel[data.discord.indicator] ?? data.discord.description}`
              : ''}
          </p>
        ) : (
          <p>公式の障害情報を確認しています…</p>
        )}
        {data?.maintenance[0] ? (
          <p className="status-ticker-item">
            <b>
              {data.maintenance[0].state === 'ongoing'
                ? 'メンテ中'
                : 'メンテ予定'}
            </b>{' '}
            {data.maintenance[0].game}：{fmt(data.maintenance[0].start)}〜
            {fmt(data.maintenance[0].end)}
          </p>
        ) : null}
      </div>
      <a href="/status">障害・メンテ情報を見る</a>
    </section>
  );
}

export function StatusBoard() {
  const { data, failed } = useStatus();
  if (failed)
    return (
      <p className="status-empty">
        情報を読み込めませんでした。時間をおいて再読み込みするか、下の公式ページを確認してください。
      </p>
    );
  if (!data) return <p className="status-empty">公式の情報を確認しています…</p>;
  return (
    <div className="status-board">
      <p className="status-updated">
        最終確認：{fmt(data.checkedAt)}（約10分ごとに更新）
      </p>

      <section aria-labelledby="status-maintenance">
        <h2 id="status-maintenance">メンテナンス</h2>
        {data.maintenance.length ? (
          <ul className="status-list">
            {data.maintenance.map((item) => (
              <li key={item.gameSlug + item.start}>
                <span className={`status-badge status-${item.state}`}>
                  {item.state === 'ongoing' ? '実施中' : '予定'}
                </span>
                <div>
                  <b>
                    <a href={`/games/${item.gameSlug}`}>{item.game}</a>：
                    {item.title}
                  </b>
                  <p>
                    {fmt(item.start)}〜{fmt(item.end)}（日本時間）
                    {item.note ? ` ${item.note}` : ''}
                  </p>
                  <a href={item.source.url} target="_blank" rel="noreferrer">
                    {item.source.label} <ExternalLink size={13} />
                  </a>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="status-empty">
            予定されているメンテナンスの登録はありません。
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
            </p>
            {data.discord.incidents.map((incident) => (
              <p key={incident.url}>
                <a href={incident.url} target="_blank" rel="noreferrer">
                  {incident.name}（{incident.status}・{fmt(incident.updatedAt)}
                  更新）
                  <ExternalLink size={13} />
                </a>
              </p>
            ))}
            {data.discord.maintenances.map((item) => (
              <p key={item.url}>
                メンテ予定：
                <a href={item.url} target="_blank" rel="noreferrer">
                  {item.name}（{fmt(item.start)}〜{fmt(item.end)}）
                  <ExternalLink size={13} />
                </a>
              </p>
            ))}
          </div>
        ) : (
          <p className="status-empty">
            Discordの稼働状況を取得できませんでした。
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
          各ゲームのSteam公式アナウンスから、メンテナンス・障害・修正・アップデートに関するものを表示しています。原文のタイトルのまま載せています。
        </p>
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
            直近3日の該当するお知らせはありません。
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
