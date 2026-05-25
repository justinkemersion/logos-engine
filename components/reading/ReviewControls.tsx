"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  markCommentaryNoteDraftAction,
  markCommentaryNoteReviewedAction,
  markConceptMentionDraftAction,
  markConceptMentionReviewedAction,
  markTranslationLayerDraftAction,
  markTranslationLayerReviewedAction,
  markTranslationVariantDraftAction,
  markTranslationVariantReviewedAction,
} from "@/app/(app)/passages/[id]/actions";
import { isAiPromoted, isReviewed, type ReviewableRow } from "@/lib/reading/review-display";

type ReviewTarget =
  | "translation_layer"
  | "translation_variant"
  | "commentary_note"
  | "concept_mention";

export function ReviewControls({
  passageId,
  target,
  row,
}: {
  passageId: string;
  target: ReviewTarget;
  row: ReviewableRow;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!isAiPromoted(row)) return null;

  function runAction(reviewed: boolean) {
    setError(null);
    startTransition(async () => {
      const result = reviewed
        ? await markReviewed(passageId, target, row)
        : await markDraft(passageId, target, row);
      if (!result.ok) {
        setError(result.error);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <div className="mt-2 flex flex-wrap items-center gap-2">
      {isReviewed(row) ? (
        <button
          type="button"
          disabled={isPending}
          onClick={() => runAction(false)}
          className="rounded border border-[var(--border)] px-2 py-0.5 text-[0.65rem] hover:bg-[var(--muted)] disabled:opacity-50"
        >
          Return to draft
        </button>
      ) : (
        <button
          type="button"
          disabled={isPending}
          onClick={() => runAction(true)}
          className="rounded border border-[var(--border)] px-2 py-0.5 text-[0.65rem] hover:bg-[var(--muted)] disabled:opacity-50"
        >
          Mark reviewed
        </button>
      )}
      {error ? <span className="text-[0.65rem] text-amber-700">{error}</span> : null}
    </div>
  );
}

async function markReviewed(
  passageId: string,
  target: ReviewTarget,
  row: ReviewableRow,
) {
  switch (target) {
    case "translation_layer":
      return markTranslationLayerReviewedAction(passageId, row.id);
    case "translation_variant":
      return markTranslationVariantReviewedAction(passageId, row.id);
    case "commentary_note":
      return markCommentaryNoteReviewedAction(passageId, row.id);
    case "concept_mention":
      return markConceptMentionReviewedAction(passageId, row.id);
  }
}

async function markDraft(passageId: string, target: ReviewTarget, row: ReviewableRow) {
  switch (target) {
    case "translation_layer":
      return markTranslationLayerDraftAction(passageId, row.id);
    case "translation_variant":
      return markTranslationVariantDraftAction(passageId, row.id);
    case "commentary_note":
      return markCommentaryNoteDraftAction(passageId, row.id);
    case "concept_mention":
      return markConceptMentionDraftAction(passageId, row.id);
  }
}
