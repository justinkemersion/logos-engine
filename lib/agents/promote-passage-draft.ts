import "server-only";

import { toDbConfidence } from "./decompose-passage-draft";
import { findConceptForDraft, matchTokenId } from "./promote-passage-draft-helpers";
import type { LogosPassageDraft } from "./logos-passage-draft";
import {
  findPromotedCommentaryNote,
  createCommentaryNote,
  updateCommentaryNote,
} from "@/lib/flux/commentary";
import {
  findPromotedConceptMention,
  createConceptMention,
  updateConceptMention,
} from "@/lib/flux/concepts";
import { updateAiRunStatus } from "@/lib/flux/ai-runs";
import {
  findPromotedTranslationLayer,
  findPromotedTranslationVariant,
  createTranslationLayer,
  createTranslationVariant,
  updateTranslationLayer,
  updateTranslationVariant,
} from "@/lib/flux/translations";
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

    const existing = await findPromotedTranslationLayer(
      sub,
      passageId,
      layer.layer,
      aiRunId,
    );

    if (existing) {
      await updateTranslationLayer(sub, existing.id, { content: layer.content });
    } else {
      await createTranslationLayer(sub, {
        passage_id: passageId,
        layer: layer.layer,
        content: layer.content,
        status: "draft",
        reviewer_note: "Promoted from ai_runs passage_draft",
        source_ai_run_id: aiRunId,
      });
    }
    result.layers += 1;
  }

  if (selection.variants) {
    for (const variant of draft.variants) {
      const tokenIndex = draft.tokens.findIndex((t) => t.surface === variant.sourcePhrase);
      const tokenId =
        tokenIndex >= 0
          ? matchTokenId(context.tokens, variant.sourcePhrase, tokenIndex)
          : null;

      const existing = await findPromotedTranslationVariant(
        sub,
        passageId,
        aiRunId,
        variant.sourcePhrase,
        variant.variant,
      );

      if (existing) {
        await updateTranslationVariant(sub, existing.id, {
          token_id: tokenId,
          variant_type: variant.variantType,
          rationale: variant.tradeoffNote,
          confidence: toDbConfidence(variant.confidence),
          tradeoff_note: variant.tradeoffNote,
        });
      } else {
        await createTranslationVariant(sub, {
          passage_id: passageId,
          token_id: tokenId,
          phrase: variant.sourcePhrase,
          variant: variant.variant,
          variant_type: variant.variantType,
          rationale: variant.tradeoffNote,
          confidence: toDbConfidence(variant.confidence),
          tradeoff_note: variant.tradeoffNote,
          source_ai_run_id: aiRunId,
        });
      }
      result.variants += 1;
    }
  }

  if (selection.commentary) {
    for (const note of draft.commentary) {
      const existing = await findPromotedCommentaryNote(
        sub,
        passageId,
        aiRunId,
        note.noteType,
        note.title,
      );

      if (existing) {
        await updateCommentaryNote(sub, existing.id, { body: note.body });
      } else {
        await createCommentaryNote(sub, {
          passage_id: passageId,
          note_type: note.noteType,
          title: note.title ?? null,
          body: note.body,
          source_ai_run_id: aiRunId,
        });
      }
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

      const existing = await findPromotedConceptMention(
        sub,
        passageId,
        aiRunId,
        thread.id,
      );

      if (existing) {
        await updateConceptMention(sub, existing.id, { note: concept.rationale });
      } else {
        await createConceptMention(sub, {
          concept_id: thread.id,
          passage_id: passageId,
          token_id: null,
          note: concept.rationale,
          source_ai_run_id: aiRunId,
        });
      }
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
