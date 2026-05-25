import "server-only";

import { toDbConfidence } from "./decompose-passage-draft";
import { findConceptForDraft, matchTokenId } from "./promote-passage-draft-helpers";
import type { LogosPassageDraft } from "./logos-passage-draft";
import { createCommentaryNote } from "@/lib/flux/commentary";
import { createConceptMention } from "@/lib/flux/concepts";
import { updateAiRunStatus } from "@/lib/flux/ai-runs";
import { createTranslationLayer, createTranslationVariant } from "@/lib/flux/translations";
import type { ConceptThreadRow, TokenRow } from "@/lib/types/entities";

export type PromotePassageDraftSelection = {
  literalLayer?: boolean;
  readableLayer?: boolean;
  philosophicalLayer?: boolean;
  variants?: boolean;
  commentary?: boolean;
  concepts?: boolean;
};

export type PromotionResult = {
  layers: number;
  variants: number;
  commentary: number;
  conceptMentions: number;
  skippedConcepts: string[];
};

export async function promotePassageDraft(
  sub: string,
  passageId: string,
  aiRunId: string,
  draft: LogosPassageDraft,
  selection: PromotePassageDraftSelection,
  context: {
    tokens: TokenRow[];
    concepts: ConceptThreadRow[];
  },
): Promise<PromotionResult> {
  const result: PromotionResult = {
    layers: 0,
    variants: 0,
    commentary: 0,
    conceptMentions: 0,
    skippedConcepts: [],
  };

  const layerFlags: Array<[keyof PromotePassageDraftSelection, LogosPassageDraft["translationLayers"][number]["layer"]]> =
    [
      ["literalLayer", "literal"],
      ["readableLayer", "readable"],
      ["philosophicalLayer", "philosophical"],
    ];

  for (const [flag, layerName] of layerFlags) {
    if (!selection[flag]) continue;
    const layer = draft.translationLayers.find((l) => l.layer === layerName);
    if (!layer) continue;
    await createTranslationLayer(sub, {
      passage_id: passageId,
      layer: layer.layer,
      content: layer.content,
      status: "draft",
      reviewer_note: "Promoted from ai_runs passage_draft",
    });
    result.layers += 1;
  }

  if (selection.variants) {
    for (const variant of draft.variants) {
      const tokenIndex = draft.tokens.findIndex((t) => t.surface === variant.sourcePhrase);
      await createTranslationVariant(sub, {
        passage_id: passageId,
        token_id:
          tokenIndex >= 0
            ? matchTokenId(context.tokens, variant.sourcePhrase, tokenIndex)
            : null,
        phrase: variant.sourcePhrase,
        variant: variant.variant,
        variant_type: variant.variantType,
        rationale: variant.tradeoffNote,
        confidence: toDbConfidence(variant.confidence),
        tradeoff_note: variant.tradeoffNote,
      });
      result.variants += 1;
    }
  }

  if (selection.commentary) {
    for (const note of draft.commentary) {
      await createCommentaryNote(sub, {
        passage_id: passageId,
        note_type: note.noteType,
        title: note.title ?? null,
        body: note.body,
      });
      result.commentary += 1;
    }
  }

  if (selection.concepts) {
    for (const concept of draft.concepts) {
      const thread = findConceptForDraft(context.concepts, concept.greekTerm);
      if (!thread) {
        result.skippedConcepts.push(concept.greekTerm);
        continue;
      }
      await createConceptMention(sub, {
        concept_id: thread.id,
        passage_id: passageId,
        token_id: null,
        note: concept.rationale,
      });
      result.conceptMentions += 1;
    }
  }

  const promoted =
    result.layers + result.variants + result.commentary + result.conceptMentions > 0;

  if (promoted) {
    await updateAiRunStatus(sub, aiRunId, "revised");
  }

  return result;
}
