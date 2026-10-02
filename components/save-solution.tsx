'use client';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { useState } from 'react';
import { NotebookPen } from 'lucide-react';
import { SolutionForm } from '@/components/solution-form';
import { useSavedSolutions } from '@/components/use-saved-solutions';
import type { SolutionDraft } from '@/lib/saved-solutions';

// Also reusable by the diagnostic tool: pass its actual result in `draft`.
// Saving is explicit, never an automatic claim that a proposed fix worked.
export function SaveSolution({
  draft,
  recordId,
}: {
  draft: SolutionDraft;
  recordId?: string;
}) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [savedId, setSavedId] = useState<string>();
  const { items, error, ready } = useSavedSolutions();
  const id =
    recordId ||
    savedId ||
    (draft.articlePath ? `article:${draft.articlePath}` : undefined);
  const existing = items.find((item) => item.id === id);
  return (
    <aside className="save-solution" aria-label="診断・対処の保存">
      <div className="my-pc-actions">
        <button
          type="button"
          disabled={!ready || Boolean(error)}
          aria-expanded={open}
          onClick={() => {
            setOpen(!open);
            setMessage('');
          }}
        >
          <NotebookPen size={18} aria-hidden="true" />
          {existing ? '保存したノートを編集' : '診断結果・設定を保存'}
        </button>
        <a href="/my#my-solutions">保存したノートを見る →</a>
      </div>
      {open ? (
        <SolutionForm
          initial={existing || draft}
          id={id}
          onSaved={(item) => {
            setSavedId(item.id);
            setOpen(false);
            setMessage('このブラウザに保存しました。マイページで見返せます。');
          }}
          onCancel={() => setOpen(false)}
        />
      ) : null}
      {message ? <output className="solution-message">{message}</output> : null}
      {error ? (
        <p role="alert" className="solution-error">
          {error}
        </p>
      ) : null}
    </aside>
  );
}
