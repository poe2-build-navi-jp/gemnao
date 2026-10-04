'use client';

import { useId, useState, type ReactNode } from 'react';

// One set of native anchor links: expanded on desktop, opt-in on narrow screens.
export function ArticleToc({ title, children, className = '' }: {
  title: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const id = useId();
  return (
    <aside className={`toc article-toc ${className}${expanded ? ' toc-expanded' : ''}`}>
      <strong className="toc-title">{title}</strong>
      <button className="toc-toggle" type="button" aria-expanded={expanded}
        aria-controls={id} onClick={() => setExpanded(value => !value)}>
        {title}<span aria-hidden="true">{expanded ? '−' : '+'}</span>
      </button>
      <div className="toc-links" id={id}>{children}</div>
    </aside>
  );
}
