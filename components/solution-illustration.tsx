/* oxlint-disable next/no-img-element -- Preoptimized static WebP uses a stable img URL for image crawlers. */
import type { GuideVisual } from '@/lib/visual-guides';

export function SolutionIllustration({ visual }: { visual: GuideVisual }) {
  return (
    <figure className="solution-illustration">
      <a href={visual.image} aria-label={`${visual.title}の図解を拡大して見る`}>
        <img
          src={visual.image}
          alt={visual.alt}
          width={1080}
          height={1350}
          loading="lazy"
          decoding="async"
        />
      </a>
      <figcaption>
        {visual.caption} <a href={visual.image}>図解を拡大して見る</a>
      </figcaption>
    </figure>
  );
}
