'use client';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { useEffect, useRef, useState } from 'react';
import { NotebookPen } from 'lucide-react';
import { games } from '@/lib/games';
import {
  deleteSolution,
  importSolutions,
  MAX_BACKUP_BYTES,
  readSolutions,
  serializeSolutions,
  solutionError,
  statusLabels,
  type SavedSolution,
  type SolutionDraft,
} from '@/lib/saved-solutions';
import {
  announceMyData,
  useSavedSolutions,
} from '@/components/use-saved-solutions';
import { SolutionForm } from '@/components/solution-form';

const empty: SolutionDraft = {
  title: '',
  gameSlug: '',
  status: 'investigating',
  diagnosis: '',
  settings: '',
  notes: '',
  articlePath: '',
  stepId: '',
  completedSteps: [],
};
const date = new Intl.DateTimeFormat('ja-JP', {
  timeZone: 'Asia/Tokyo',
  dateStyle: 'medium',
});

export function SolutionNotebook() {
  const { items, error, ready } = useSavedSolutions();
  const [editing, setEditing] = useState<SavedSolution | 'new' | null>(null);
  const [deleting, setDeleting] = useState('');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');
  const [actionError, setActionError] = useState('');
  const [importing, setImporting] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const editor = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (editing) editor.current?.focus();
  }, [editing]);
  const visible = [...items]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .filter(
      (item) =>
        (!status || item.status === status) &&
        [
          item.title,
          item.diagnosis,
          item.settings,
          item.notes,
          games.find((game) => game.slug === item.gameSlug)?.shortTitle || '',
        ]
          .join(' ')
          .toLocaleLowerCase()
          .includes(query.toLocaleLowerCase().trim()),
    );
  function successful(text: string) {
    announceMyData();
    setMessage(text);
    setActionError('');
  }
  async function restore(file: File) {
    setImporting(true);
    setMessage('');
    setActionError('');
    try {
      if (file.size > MAX_BACKUP_BYTES)
        throw new Error('2MB以下のノートのバックアップを選んでください。');
      const count = importSolutions(localStorage, await file.text());
      successful(
        `${count}件を取り込みました。同じ記録は上書きせず、既存のノートを残しています。`,
      );
    } catch (caught) {
      setActionError(solutionError(caught));
    } finally {
      setImporting(false);
      if (input.current) input.current.value = '';
    }
  }
  return (
    <section
      id="my-solutions"
      className="solution-notebook"
      aria-labelledby="my-solutions-title"
    >
      <h2 id="my-solutions-title">
        <NotebookPen size={21} aria-hidden="true" />{' '}
        診断結果・解決した設定のノート
      </h2>
      <p>
        結果と変更前→変更後の設定を残して、同じ不具合が出た時に見返せます。記事の「診断結果・設定を保存」からも追加できます（最大100件）。診断ツールなどの結果は「新しい記録」へ書き写せます。
      </p>
      <p className="solution-hint">
        ログイン不要・このブラウザのみ。別の端末とは自動同期しません。サイトデータの削除やプライベートブラウズ終了で失われることがあるため、大切なノートはバックアップしてください。ゲーム・PCの登録はこのバックアップに含みません。
      </p>
      <div className="my-pc-actions">
        <button
          type="button"
          disabled={!ready || Boolean(error)}
          onClick={() => {
            setEditing('new');
            setMessage('');
          }}
        >
          新しい記録
        </button>
        <button
          type="button"
          className="secondary"
          disabled={!ready || Boolean(error) || !items.length}
          onClick={() => {
            let url = '';
            try {
              const raw = serializeSolutions(readSolutions(localStorage));
              url = URL.createObjectURL(
                new Blob([raw], { type: 'application/json' }),
              );
              const link = document.createElement('a');
              link.href = url;
              link.download = `gemnao-notes-${new Date().toISOString().slice(0, 10)}.json`;
              document.body.appendChild(link);
              link.click();
              link.remove();
              setMessage(
                'バックアップのダウンロードを開始しました。ファイルが保存されたことを確認してください。',
              );
              setActionError('');
            } catch (caught) {
              setActionError(solutionError(caught));
            } finally {
              if (url) setTimeout(() => URL.revokeObjectURL(url), 1000);
            }
          }}
        >
          ノートをバックアップ
        </button>
        <button
          type="button"
          className="secondary"
          disabled={!ready || Boolean(error) || importing}
          onClick={() => input.current?.click()}
        >
          {importing ? '取り込み中…' : 'バックアップから復元'}
        </button>
        <input
          type="file"
          ref={input}
          accept=".json,application/json"
          hidden
          aria-label="ノートのバックアップファイル"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void restore(file);
          }}
        />
      </div>
      {message ? <output className="solution-message">{message}</output> : null}
      {error || actionError ? (
        <p role="alert" className="solution-error">
          {error || actionError}
        </p>
      ) : null}
      {editing ? (
        <div className="solution-editor">
          <h3 ref={editor} tabIndex={-1}>
            {editing === 'new' ? '新しい記録を作る' : '保存した記録を編集'}
          </h3>
          <SolutionForm
            key={editing === 'new' ? 'new' : editing.id}
            initial={editing === 'new' ? empty : editing}
            id={editing === 'new' ? undefined : editing.id}
            onCancel={() => setEditing(null)}
            onSaved={() => {
              setEditing(null);
              setQuery('');
              setStatus('');
              successful('このブラウザにノートを保存しました。');
            }}
          />
        </div>
      ) : null}
      <div className="solution-filters">
        <label>
          ノートを検索
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="ゲーム名・症状・設定"
          />
        </label>
        <label>
          状態で絞り込み
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="">すべて</option>
            {Object.entries(statusLabels).map(([value, label]) => (
              <option value={value} key={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>
      {!ready ? (
        <p>保存したノートを読み込んでいます…</p>
      ) : !error && !visible.length ? (
        <p className="status-empty">
          {items.length
            ? '条件に合うノートがありません。検索・絞り込みを変更してください。'
            : 'まだ記録はありません。記事から保存するか、「新しい記録」で追加してください。'}
        </p>
      ) : null}
      <div className="solution-cards">
        {visible.map((item) => (
          <article className="solution-card" key={item.id}>
            <div className="solution-card-meta">
              <b>{statusLabels[item.status]}</b>
              <span>更新 {date.format(new Date(item.updatedAt))}</span>
            </div>
            <h3>{item.title}</h3>
            {item.gameSlug ? (
              <p>
                {games.find((game) => game.slug === item.gameSlug)
                  ?.shortTitle || item.gameSlug}
              </p>
            ) : null}
            <dl>
              <dt>診断結果・確認できたこと</dt>
              <dd>{item.diagnosis || '未記入'}</dd>
              <dt>変更した設定・解決した方法</dt>
              <dd>{item.settings || '未記入'}</dd>
              {item.notes ? (
                <>
                  <dt>再確認した結果・メモ</dt>
                  <dd>{item.notes}</dd>
                </>
              ) : null}
              {item.completedSteps.length ? (
                <>
                  <dt>確認した手順</dt>
                  <dd>{item.completedSteps.join('／')}</dd>
                </>
              ) : null}
            </dl>
            {item.articlePath ? (
              <p>
                <a
                  href={`${item.articlePath}${item.stepId ? `#${item.stepId}` : ''}`}
                >
                  参照した記事・手順を開く →
                </a>
              </p>
            ) : null}
            <div className="my-pc-actions">
              <button
                type="button"
                className="secondary"
                aria-label={`${item.title}を編集`}
                onClick={() => {
                  setEditing(item);
                  setDeleting('');
                }}
              >
                編集
              </button>
              <button
                type="button"
                className="secondary"
                aria-label={`${item.title}を削除`}
                onClick={() => {
                  setDeleting(item.id);
                  setEditing(null);
                }}
              >
                削除
              </button>
            </div>
            {deleting === item.id ? (
              <div className="solution-delete">
                <p>
                  このノートを削除しますか？元に戻すにはバックアップが必要です。
                </p>
                <div className="my-pc-actions">
                  <button
                    type="button"
                    onClick={() => {
                      try {
                        deleteSolution(localStorage, item.id);
                        setDeleting('');
                        successful(
                          'ノートを削除しました。バックアップがあれば復元できます。',
                        );
                      } catch (caught) {
                        setActionError(solutionError(caught));
                      }
                    }}
                  >
                    このノートを削除する
                  </button>
                  <button
                    type="button"
                    className="secondary"
                    onClick={() => setDeleting('')}
                  >
                    削除しない
                  </button>
                </div>
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
