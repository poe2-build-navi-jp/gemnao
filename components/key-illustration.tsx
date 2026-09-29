/* oxlint-disable next/no-img-element -- Preoptimized static WebP uses a stable img URL for image crawlers. */
import type { KeyCheatSheet, KeyVisual } from '@/lib/key-visuals';

// Keyboard diagrams for shortcut guides. Plain <img> with explicit size so
// Google Images can index the file and the layout does not shift.
export function KeyIllustration({
  visual,
  eager = false,
}: {
  visual?: KeyVisual | KeyCheatSheet;
  eager?: boolean;
}) {
  if (!visual) return null;
  const portrait = visual.height > visual.width;
  return (
    <figure className={portrait ? 'solution-illustration' : 'key-illustration'}>
      <a href={visual.image} aria-label={`${visual.title}の図を拡大して見る`}>
        <img
          src={visual.image}
          alt={visual.alt}
          width={visual.width}
          height={visual.height}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
        />
      </a>
      <figcaption>{visual.caption}</figcaption>
    </figure>
  );
}
