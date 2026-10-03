// QA-only branch. This file must never be merged into production.
(() => {
  const status = document.getElementById('status');
  const preview = /^[a-z0-9-]+\.gemnao\.pages\.dev$/.test(location.hostname);
  if (!preview) {
    status.textContent =
      'Disabled: this harness runs only on a Gemnao branch/deployment preview host.';
    return;
  }
  const frame = document.getElementById('frame');
  const width = document.getElementById('width');
  const page = document.getElementById('page');
  const metrics = document.getElementById('metrics');
  document.getElementById('controls').hidden = false;
  document.getElementById('workspace').hidden = false;
  status.textContent =
    'Preview origin verified. Test data is local to this preview origin.';
  const measure = () => {
    try {
      const win = frame.contentWindow;
      const doc = frame.contentDocument;
      if (!doc?.body) return;
      const root = doc.documentElement;
      const overflows = [...doc.querySelectorAll('body *')]
        .flatMap((element) => {
          const rect = element.getBoundingClientRect();
          if (
            !rect.width ||
            !rect.height ||
            (rect.left >= -1 && rect.right <= win.innerWidth + 1)
          )
            return [];
          const scrollParent = element.closest(
            '.table-scroll, .diagnosis-table-wrap',
          );
          return [
            {
              tag: element.tagName,
              class: String(element.className).slice(0, 100),
              left: Math.round(rect.left),
              right: Math.round(rect.right),
              scrollParent: scrollParent?.className ?? null,
            },
          ];
        })
        .slice(0, 25);
      metrics.textContent = JSON.stringify(
        {
          path: win.location.pathname + win.location.search + win.location.hash,
          title: doc.title,
          innerWidth: win.innerWidth,
          innerHeight: win.innerHeight,
          clientWidth: root.clientWidth,
          documentScrollWidth: root.scrollWidth,
          bodyScrollWidth: doc.body.scrollWidth,
          mobileMediaMatches: win.matchMedia('(max-width: 760px)').matches,
          pageOverflow: root.scrollWidth > root.clientWidth + 1,
          focused:
            doc.activeElement?.tagName +
            ' ' +
            (doc.activeElement?.getAttribute('aria-label') ||
              doc.activeElement?.id ||
              ''),
          outOfViewportElements: overflows,
          summaryLinks: [...doc.querySelectorAll('.summary-step-link, .article-next-jump')].map((link) => ({
            text: link.textContent.trim(), href: link.getAttribute('href'),
            width: Math.round(link.getBoundingClientRect().width),
            height: Math.round(link.getBoundingClientRect().height),
            targetExists: Boolean(doc.querySelector(link.getAttribute('href'))),
            countedAsArticleOpen: link.hasAttribute('data-related'),
          })),
        },
        null,
        2,
      );
    } catch {
      metrics.textContent =
        'Measurement unavailable: frame navigated away from the same-origin preview.';
    }
  };
  width.addEventListener('change', () => {
    frame.style.width = `${width.value}px`;
    setTimeout(measure, 100);
  });
  document.getElementById('load').addEventListener('click', () => {
    frame.src = page.value;
  });
  document.getElementById('measure').addEventListener('click', measure);
  frame.addEventListener('load', () => {
    measure();
    setTimeout(measure, 1500);
  });
  frame.src = page.value;
})();
