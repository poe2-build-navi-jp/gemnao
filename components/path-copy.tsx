'use client';

import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

export function PathCopy({
  value,
  english = false,
}: {
  value: string;
  english?: boolean;
}) {
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
      aria-label={english ? 'Copy path' : 'パスをコピー'}
      aria-live="polite"
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
      {failed
        ? english
          ? 'Select the path and copy manually'
          : 'パスを選択して手動コピーしてください'
        : copied
          ? english
            ? 'Copied'
            : 'コピーしました'
          : english
            ? 'Copy'
            : 'コピー'}
    </button>
  );
}
