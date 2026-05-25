import type {
  CommentaryNoteRow,
  ConceptMentionRow,
  TranslationLayerRow,
  TranslationVariantRow,
} from "@/lib/types/entities";

export type ReviewableRow =
  | TranslationLayerRow
  | TranslationVariantRow
  | CommentaryNoteRow
  | ConceptMentionRow;

export function isAiPromoted(row: { source_ai_run_id?: string | null }): boolean {
  return row.source_ai_run_id != null;
}

export function isLayerRow(row: ReviewableRow): row is TranslationLayerRow {
  return "layer" in row && "content" in row && "status" in row;
}

export function isReviewed(row: ReviewableRow): boolean {
  if (isLayerRow(row)) {
    return row.status === "accepted";
  }
  return row.review_status === "reviewed";
}

export function badgeLabel(row: ReviewableRow): string | null {
  if (!isAiPromoted(row)) return null;
  if (isReviewed(row)) return "Reviewed";
  return "AI Draft — not yet reviewed";
}

export function pickPreferredLayer(
  layers: TranslationLayerRow[],
  layerName: string,
): TranslationLayerRow | undefined {
  const candidates = layers.filter((l) => l.layer === layerName);
  if (candidates.length === 0) return undefined;

  return candidates.sort((a, b) => layerPriority(b) - layerPriority(a))[0];
}

function layerPriority(layer: TranslationLayerRow): number {
  if (layer.status === "accepted") return 3;
  if (layer.status === "draft" && layer.source_ai_run_id) return 2;
  return 1;
}
