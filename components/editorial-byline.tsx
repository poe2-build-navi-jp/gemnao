/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { editorialAuthor } from '@/lib/editorial-identity';

export function EditorialByline() {
  return (
    <span>
      編集：<a href="/about">{editorialAuthor.name}</a>
    </span>
  );
}
