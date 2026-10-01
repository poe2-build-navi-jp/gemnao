'use client';

import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

type Labels = { copy: string; copied: string; aria: string; failed: string };

const japanese: Labels = {
  copy: 'コピー',
  copied: 'コピーしました',
  aria: 'パスをコピー',
  failed: 'パスを選択して手動コピーしてください',
};
const englishLabels: Labels = {
  copy: 'Copy',
  copied: 'Copied',
  aria: 'Copy path',
  failed: 'Select the path and copy manually',
};

export function PathCopy({
  value,
  english = false,
  labels,
}: {
  value: string;
  english?: boolean;
  /** Button text for other languages; overrides `english`. */
  labels?: Labels;
}) {
  const text = labels ?? (english ? englishLabels : japanese);
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  async function copy() {
    setFailed(false);
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setFailed(true);
    }
  }
  return (
    <button
      className="copy-button"
      type="button"
      onClick={copy}
      aria-label={text.aria}
      aria-live="polite"
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
      {failed ? text.failed : copied ? text.copied : text.copy}
    </button>
  );
}
