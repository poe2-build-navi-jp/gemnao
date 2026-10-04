'use client';
import { SupportWorkspace } from '@/components/support-workspace';
import type { SolutionDraft } from '@/lib/saved-solutions';
// One notebook flow for article saves, continued diagnosis and private support text.
export function SaveSolution({
  draft,
  steps = [],
}: {
  draft: SolutionDraft;
  steps?: { id: string; title: string }[];
}) {
  return <SupportWorkspace draft={draft} steps={steps} />;
}
