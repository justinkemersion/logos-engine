import "server-only";

import {
  getCommentaryNote,
  updateCommentaryNote,
} from "@/lib/flux/commentary";
import {
  getConceptMention,
  updateConceptMention,
} from "@/lib/flux/concepts";
import {
  getTranslationLayer,
  getTranslationVariant,
  updateTranslationLayer,
  updateTranslationVariant,
} from "@/lib/flux/translations";
import type {
  CommentaryNoteRow,
  ConceptMentionRow,
  TranslationLayerRow,
  TranslationVariantRow,
} from "@/lib/types/entities";

export class ReviewPromotedContentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ReviewPromotedContentError";
  }
}

function assertAiPromoted(sourceAiRunId: string | null): void {
  if (!sourceAiRunId) {
    throw new ReviewPromotedContentError("Only AI-promoted rows can be reviewed");
  }
}

export async function markTranslationLayerReviewed(
  sub: string,
  id: string,
  reviewedBy: string,
  reviewerNote?: string,
): Promise<TranslationLayerRow> {
  const row = await getTranslationLayer(sub, id);
  if (!row) throw new ReviewPromotedContentError("Translation layer not found");
  assertAiPromoted(row.source_ai_run_id);

  return updateTranslationLayer(sub, id, {
    status: "accepted",
    reviewed_at: new Date().toISOString(),
    reviewed_by: reviewedBy,
    ...(reviewerNote !== undefined ? { reviewer_note: reviewerNote } : {}),
  });
}

export async function markTranslationLayerDraft(
  sub: string,
  id: string,
): Promise<TranslationLayerRow> {
  const row = await getTranslationLayer(sub, id);
  if (!row) throw new ReviewPromotedContentError("Translation layer not found");
  assertAiPromoted(row.source_ai_run_id);

  return updateTranslationLayer(sub, id, {
    status: "draft",
    reviewed_at: null,
    reviewed_by: null,
  });
}

export async function markTranslationVariantReviewed(
  sub: string,
  id: string,
  reviewedBy: string,
  reviewerNote?: string,
): Promise<TranslationVariantRow> {
  const row = await getTranslationVariant(sub, id);
  if (!row) throw new ReviewPromotedContentError("Translation variant not found");
  assertAiPromoted(row.source_ai_run_id);

  return updateTranslationVariant(sub, id, {
    review_status: "reviewed",
    reviewed_at: new Date().toISOString(),
    reviewed_by: reviewedBy,
    ...(reviewerNote !== undefined ? { reviewer_note: reviewerNote } : {}),
  });
}

export async function markTranslationVariantDraft(
  sub: string,
  id: string,
): Promise<TranslationVariantRow> {
  const row = await getTranslationVariant(sub, id);
  if (!row) throw new ReviewPromotedContentError("Translation variant not found");
  assertAiPromoted(row.source_ai_run_id);

  return updateTranslationVariant(sub, id, {
    review_status: "draft",
    reviewed_at: null,
    reviewed_by: null,
  });
}

export async function markCommentaryNoteReviewed(
  sub: string,
  id: string,
  reviewedBy: string,
  reviewerNote?: string,
): Promise<CommentaryNoteRow> {
  const row = await getCommentaryNote(sub, id);
  if (!row) throw new ReviewPromotedContentError("Commentary note not found");
  assertAiPromoted(row.source_ai_run_id);

  return updateCommentaryNote(sub, id, {
    review_status: "reviewed",
    reviewed_at: new Date().toISOString(),
    reviewed_by: reviewedBy,
    ...(reviewerNote !== undefined ? { reviewer_note: reviewerNote } : {}),
  });
}

export async function markCommentaryNoteDraft(
  sub: string,
  id: string,
): Promise<CommentaryNoteRow> {
  const row = await getCommentaryNote(sub, id);
  if (!row) throw new ReviewPromotedContentError("Commentary note not found");
  assertAiPromoted(row.source_ai_run_id);

  return updateCommentaryNote(sub, id, {
    review_status: "draft",
    reviewed_at: null,
    reviewed_by: null,
  });
}

export async function markConceptMentionReviewed(
  sub: string,
  id: string,
  reviewedBy: string,
  reviewerNote?: string,
): Promise<ConceptMentionRow> {
  const row = await getConceptMention(sub, id);
  if (!row) throw new ReviewPromotedContentError("Concept mention not found");
  assertAiPromoted(row.source_ai_run_id);

  return updateConceptMention(sub, id, {
    review_status: "reviewed",
    reviewed_at: new Date().toISOString(),
    reviewed_by: reviewedBy,
    ...(reviewerNote !== undefined ? { reviewer_note: reviewerNote } : {}),
  });
}

export async function markConceptMentionDraft(
  sub: string,
  id: string,
): Promise<ConceptMentionRow> {
  const row = await getConceptMention(sub, id);
  if (!row) throw new ReviewPromotedContentError("Concept mention not found");
  assertAiPromoted(row.source_ai_run_id);

  return updateConceptMention(sub, id, {
    review_status: "draft",
    reviewed_at: null,
    reviewed_by: null,
  });
}
