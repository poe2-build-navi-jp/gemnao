'use client';
import { useState } from 'react';
export function CaseCitation({
  url,
  title,
  labels,
}: {
  url: string;
  title: string;
  labels: { cite: string; copied: string; copyError: string; link: string };
}) {
  const [message, setMessage] = useState('');
  return (
    <div className="case-citation">
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(`${title}\n${url}`);
            setMessage(labels.copied);
          } catch {
            setMessage(labels.copyError);
          }
        }}
      >
        {labels.cite}
      </button>
      <p>
        {labels.link}: <a href={new URL(url).pathname}>{url}</a>
      </p>
      <output aria-live="polite">{message}</output>
    </div>
  );
}
