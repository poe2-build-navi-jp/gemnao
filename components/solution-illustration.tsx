/* oxlint-disable next/no-img-element -- Preoptimized static WebP uses a stable img URL for image crawlers. */
import type { GuideVisual } from '@/lib/visual-guides';

export function SolutionIllustration({ visual }: { visual: GuideVisual }) {
  return (
    <figure className="solution-illustration">
      <img
        src={visual.image}
        alt={visual.alt}
        width={1080}
        height={1350}
        loading="lazy"
        decoding="async"
      />
      <figcaption>{visual.caption}</figcaption>
    </figure>
  );
}
