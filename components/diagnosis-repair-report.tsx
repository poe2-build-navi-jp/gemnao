'use client';
import { useRef, useState } from 'react';

/** Changes to the parent report remount this preview and invalidate its approval. */
export function DiagnosisRepairReport({ report }: { report: string }) {
  const [open, setOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [notice, setNotice] = useState('');
  const preview = useRef<HTMLTextAreaElement>(null);
  const copy = async () => {
    if (!confirmed) return;
    try {
      await navigator.clipboard.writeText(report);
      setNotice('相談用メモをコピーしました。送付先と内容を確認してから、自分で共有してください。');
    } catch {
      preview.current?.focus();
      preview.current?.select();
      setNotice('自動コピーできませんでした。下の全文を選択しました。端末のコピー操作を使ってください。');
    }
  };
  const download = () => {
    if (!confirmed) return;
    const url = URL.createObjectURL(new Blob([report], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'gemnao-repair-consultation.txt';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice('相談用メモのテキスト保存を開始しました。サーバーへの送信は行っていません。');
  };
  return <section className="diag-handoff" aria-labelledby="diag-handoff-title">
    <h3 id="diag-handoff-title">修理店・メーカーに見せる相談用メモ</h3>
    <p>回答と対処の記録を、この端末でテキストにまとめます。すべて自己申告で、実機検査結果ではありません。相談先で点検が不要になることを保証するものではありません。</p>
    <p className="diag-small">ゲーム名の自由入力・製造番号・ログ・パスは含めません。送付は自動で行いません。</p>
    {!open ? <button type="button" onClick={() => setOpen(true)}>相談用メモの全文を確認する</button> : <>
      <label htmlFor="diag-report-preview">保存・コピーする内容の全文</label>
      <textarea id="diag-report-preview" className="diag-report-preview" ref={preview} value={report} readOnly rows={18} />
      <label className="diag-confirm">
        <input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} />
        内容と未確認項目を確認しました
      </label>
      <div className="diag-toolbar">
        <button type="button" disabled={!confirmed} onClick={() => void copy()}>確認したメモをコピー</button>
        <button type="button" disabled={!confirmed} onClick={download}>確認したメモをテキスト保存</button>
        <button type="button" onClick={() => { setOpen(false); setConfirmed(false); setNotice(''); }}>閉じる</button>
      </div>
      {notice && <output className="diag-notice">{notice}</output>}
    </>}
  </section>;
}
