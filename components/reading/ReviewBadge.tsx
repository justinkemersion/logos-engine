"use client";

import { badgeLabel, isAiPromoted, isReviewed, type ReviewableRow } from "@/lib/reading/review-display";
import { provenanceSummary } from "@/lib/reading/provenance-display";

export function ReviewBadge({ row }: { row: ReviewableRow }) {
  if (!isAiPromoted(row)) return null;

  const label = badgeLabel(row);
  if (!label) return null;

  const provenance = provenanceSummary(row);

  return (
    <div className="mt-1.5 space-y-0.5">
      <p
        className={`text-xs ${isReviewed(row) ? "text-green-800" : "text-amber-600"}`}
      >
        {label}
      </p>
      {provenance ? (
        <p className="text-[0.65rem] text-[var(--muted-fg)]">{provenance}</p>
      ) : null}
    </div>
  );
}
