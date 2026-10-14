'use client';

import { useCallback, useEffect, useState } from 'react';

import { useBoundedRequest } from './use-bounded-request';

type Query = {
  query: string;
  last7Days: number;
  last30Days: number;
  lastSearchedAt: string;
};

export function SearchDemandAdmin() {
  const [queries, setQueries] = useState<Query[]>([]);
  const [state, setState] = useState('読み込み中…');
  const { send } = useBoundedRequest();
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    setLoading(true);
    setState('読み込み中…');
    const result = await send(
      '/api/admin/search-demand',
      { cache: 'no-store' },
      (response) => response.json() as Promise<unknown>,
    );
    if (!result) return;
    try {
      const response = result.response;
      if (response?.status === 401)
        throw new Error(
          'Discordサーバー掲載審査の管理画面でログインしてください。',
        );
      if (!response?.ok) throw new Error('集計を読み込めませんでした。');
      const data: unknown = result.data;
      if (
        !data ||
        typeof data !== 'object' ||
        !('queries' in data) ||
        !Array.isArray(data.queries)
      )
        throw new Error('集計を読み込めませんでした。');
      const rows = data.queries as Query[];
      if (
        rows.some(
          (row) =>
            !row ||
            typeof row.query !== 'string' ||
            typeof row.lastSearchedAt !== 'string' ||
            !Number.isSafeInteger(row.last7Days) ||
            !Number.isSafeInteger(row.last30Days),
        )
      )
        throw new Error('集計を読み込めませんでした。');
      setQueries(rows);
      setState('');
    } catch (error) {
      setState(
        error instanceof Error ? error.message : '集計を読み込めませんでした。',
      );
    }
    setLoading(false);
  }, [send]);
  useEffect(() => {
    void Promise.resolve().then(() => load());
  }, [load]);
  if (state)
    return (
      <div>
        <output role={loading ? 'status' : 'alert'}>{state}</output>
        {!loading && (
          <button type="button" onClick={() => void load()}>
            再読み込み
          </button>
        )}
      </div>
    );
  if (!queries.length) return <p>過去30日間に検索0件の記録はありません。</p>;
  return (
    <div className="search-demand-table">
      <table>
        <thead>
          <tr>
            <th>検索語</th>
            <th>7日</th>
            <th>30日</th>
            <th>最終検索</th>
          </tr>
        </thead>
        <tbody>
          {queries.map((item) => (
            <tr key={item.query}>
              <td>{item.query}</td>
              <td>{item.last7Days}</td>
              <td>{item.last30Days}</td>
              <td>
                <time dateTime={item.lastSearchedAt}>
                  {item.lastSearchedAt.slice(0, 10)}
                </time>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
