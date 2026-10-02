'use client';

import { useState } from 'react';
import { games } from '@/lib/games';
import {
  readSolutions,
  solutionError,
  statusLabels,
  upsertSolution,
  type SavedSolution,
  type SolutionDraft,
  type SolutionStatus,
} from '@/lib/saved-solutions';
import { announceMyData } from '@/components/use-saved-solutions';

export function SolutionForm({
  initial,
  id,
  onSaved,
  onCancel,
}: {
  initial: SolutionDraft;
  id?: string;
  onSaved: (item: SavedSolution) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState(initial);
  const [error, setError] = useState('');
  function field<K extends keyof SolutionDraft>(
    key: K,
    value: SolutionDraft[K],
  ) {
    setDraft((previous) => ({ ...previous, [key]: value }));
  }
  return (
    <form
      className="solution-form"
      onSubmit={(event) => {
        event.preventDefault();
        try {
          const now = new Date().toISOString();
          const previous = id
            ? readSolutions(localStorage).find((item) => item.id === id)
            : undefined;
          const item: SavedSolution = {
            ...draft,
            title: draft.title.trim(),
            id: id || crypto.randomUUID(),
            createdAt: previous?.createdAt || now,
            updatedAt: now,
          };
          upsertSolution(localStorage, item);
          announceMyData();
          onSaved(item);
        } catch (caught) {
          setError(solutionError(caught));
        }
      }}
    >
      <label>
        記録のタイトル
        <input
          value={draft.title}
          maxLength={200}
          required
          onChange={(event) => field('title', event.target.value)}
        />
      </label>
      <div className="solution-form-row">
        <label>
          ゲーム・対象
          <select
            value={draft.gameSlug}
            onChange={(event) => field('gameSlug', event.target.value)}
          >
            <option value="">PC・Windows／Discord／その他</option>
            {games.map((game) => (
              <option value={game.slug} key={game.slug}>
                {game.shortTitle}
              </option>
            ))}
          </select>
        </label>
        <label>
          現在の状態
          <select
            value={draft.status}
            onChange={(event) =>
              field('status', event.target.value as SolutionStatus)
            }
          >
            {Object.entries(statusLabels).map(([value, label]) => (
              <option value={value} key={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label>
        診断結果・確認できたこと
        <textarea
          rows={3}
          value={draft.diagnosis}
          maxLength={4000}
          required
          placeholder="例：ゲームだけ無音。Windowsのテスト音は聞こえた。"
          onChange={(event) => field('diagnosis', event.target.value)}
        />
      </label>
      <label>
        変更した設定・解決した方法
        <textarea
          rows={3}
          value={draft.settings}
          maxLength={4000}
          placeholder="例：音量ミキサーのゲームの出力先を、モニターからヘッドセットへ変更。変更前→変更後を書いておくと戻せます。"
          onChange={(event) => field('settings', event.target.value)}
        />
      </label>
      <label>
        再確認した結果・メモ
        <textarea
          rows={3}
          value={draft.notes}
          maxLength={4000}
          placeholder="例：同じ場面で再確認し、再起動後もゲーム音が出た。パスワード・認証コードは書かないでください。"
          onChange={(event) => field('notes', event.target.value)}
        />
      </label>
      {draft.completedSteps.length ? (
        <p className="solution-hint">
          確認した手順：{draft.completedSteps.join('／')}
        </p>
      ) : null}
      <p className="solution-hint">
        入力内容はこのブラウザだけに保存します。匿名の「これで直った」の回答とは別で、ノートの内容を公開・送信しません。
      </p>
      <div className="my-pc-actions">
        <button type="submit">ノートに保存する</button>
        <button className="secondary" type="button" onClick={onCancel}>
          キャンセル
        </button>
      </div>
      {error ? (
        <p role="alert" className="solution-error">
          {error}
        </p>
      ) : null}
    </form>
  );
}
