'use client';

import { useEffect, useState } from 'react';

type Query = {
  query: string;
  last7Days: number;
  last30Days: number;
  lastSearchedAt: string;
};

export function SearchDemandAdmin() {
  const [queries, setQueries] = useState<Query[]>([]);
  const [state, setState] = useState('読み込み中…');
  useEffect(() => {
    fetch('/api/admin/search-demand', { cache: 'no-store' })
      .then(async (response) => {
        if (response.status === 401)
          throw new Error(
            'Discordサーバー掲載審査の管理画面でログインしてください。',
          );
        if (!response.ok) throw new Error('集計を読み込めませんでした。');
        return (await response.json()) as { queries: Query[] };
      })
      .then(({ queries: rows }) => {
        setQueries(rows);
        setState('');
      })
      .catch((error: Error) => setState(error.message));
  }, []);
  if (state) return <output>{state}</output>;
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
