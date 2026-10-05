'use client';

import { useState } from 'react';
import { SolutionForm } from './solution-form';
import { useSavedSolutions } from './use-saved-solutions';
import type { SolutionDraft } from '@/lib/saved-solutions';
import type { Attempt } from '@/lib/support-record';
import { supportCopy, type SupportLocale } from '@/lib/support-copy';

const copy = {
  ja: { resolved: '直った手順を、このブラウザの解決ノートに残せます。', unresolved: '試した内容を保存すると、次回は続きから確認できます。', open: 'ノートを確認して保存', close: '案内を閉じる', target: '保存先のノート', fresh: '新しいノート' },
  en: { resolved: 'Keep the fix in your issue notebook in this browser.', unresolved: 'Save what you tried so you can continue next time.', open: 'Review and save a note', close: 'Dismiss', target: 'Save to notebook', fresh: 'New note' },
  zh: { resolved: '可以将解决方法保存在此浏览器的问题笔记中。', unresolved: '保存已尝试的内容，下次可以继续排查。', open: '查看并保存笔记', close: '关闭提示', target: '保存到笔记', fresh: '新建笔记' },
  es: { resolved: 'Guarda la solución en el cuaderno de este navegador.', unresolved: 'Guarda lo que probaste para continuar la próxima vez.', open: 'Revisar y guardar una nota', close: 'Cerrar aviso', target: 'Guardar en el cuaderno', fresh: 'Nueva nota' },
};

// Reuses the notebook form and storage. Nothing is written until its submit.
export function ResultNote({ draft, attempt, locale = 'ja', onClose }: {
  draft: SolutionDraft;
  attempt?: Attempt;
  locale?: SupportLocale;
  onClose: () => void;
}) {
  const t = copy[locale];
  const { items, ready, error } = useSavedSolutions();
  const [editing, setEditing] = useState(false);
  const [target, setTarget] = useState('');
  const [saved, setSaved] = useState(false);
  const previous = items.find(item => item.id === target);
  const initial = previous ? {
    ...previous,
    status: draft.status,
    articlePath: draft.articlePath,
    stepId: draft.stepId,
    completedSteps: [...new Set([...previous.completedSteps, ...draft.completedSteps])],
  } : draft;
  return <aside className="result-note" aria-label={t.open}>
    <p role="status">{saved ? supportCopy[locale].saved : t[draft.status === 'resolved' ? 'resolved' : 'unresolved']}</p>
    <p>{supportCopy[locale].local}</p>
    <div className="my-pc-actions">
      {!saved && !editing && <button type="button" disabled={!ready || !!error} onClick={() => setEditing(true)}>{t.open}</button>}
      <button type="button" onClick={onClose}>{t.close}</button>
    </div>
    {editing && <>
      <label>{t.target}<select value={target} onChange={e => setTarget(e.target.value)}>
        <option value="">{t.fresh}</option>
        {items.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}
      </select></label>
      <SolutionForm key={target} locale={locale} initial={initial} id={previous?.id} attempt={attempt}
        onCancel={() => setEditing(false)} onSaved={() => { setEditing(false); setSaved(true); }} />
    </>}
    {error && <p role="alert">{supportCopy[locale].error}</p>}
  </aside>;
}
