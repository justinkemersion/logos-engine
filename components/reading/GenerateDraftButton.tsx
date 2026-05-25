"use client";

import type { AiRunRow } from "@/lib/types/entities";

export function GenerateDraftButton({
  latestDraftRun,
}: {
  latestDraftRun: AiRunRow | null;
}) {
  return (
    <div className="ml-auto flex items-center gap-2">
      {latestDraftRun ? (
        <span className="text-xs text-amber-600">
          Latest AI draft — {formatDraftDate(latestDraftRun.created_at)}
        </span>
      ) : null}
      <button
        type="button"
        disabled
        className="rounded-md border border-[var(--border)] px-3 py-1 text-xs text-[var(--muted-fg)] opacity-50 cursor-not-allowed"
        title="AI draft persistence is ready (ai_runs). UI generation stays disabled until operator review of persisted drafts."
      >
        Generate Draft
      </button>
    </div>
  );
}

function formatDraftDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "saved";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
