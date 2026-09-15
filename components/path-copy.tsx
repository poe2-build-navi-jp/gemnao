'use client';

import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

export function PathCopy({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }
  return (
    <button
      className="copy-button"
      type="button"
      onClick={copy}
      aria-label="パスをコピー"
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
      {copied ? 'コピーしました' : 'コピー'}
    </button>
  );
}
