import { beforeEach, describe, expect, it, vi } from "vitest";
import { odyssey11Fixture } from "./fixtures/odyssey-1-1";

const findPromotedTranslationLayer = vi.fn();
const findPromotedTranslationVariant = vi.fn();
const findPromotedCommentaryNote = vi.fn();
const findPromotedConceptMention = vi.fn();
const createTranslationLayer = vi.fn();
const createTranslationVariant = vi.fn();
const updateTranslationLayer = vi.fn();
const updateTranslationVariant = vi.fn();
const createCommentaryNote = vi.fn();
const updateCommentaryNote = vi.fn();
const createConceptMention = vi.fn();
const updateConceptMention = vi.fn();
const updateAiRunStatus = vi.fn();

vi.mock("@/lib/flux/translations", () => ({
  findPromotedTranslationLayer: (...args: unknown[]) =>
    findPromotedTranslationLayer(...args),
  findPromotedTranslationVariant: (...args: unknown[]) =>
    findPromotedTranslationVariant(...args),
  createTranslationLayer: (...args: unknown[]) => createTranslationLayer(...args),
  createTranslationVariant: (...args: unknown[]) => createTranslationVariant(...args),
  updateTranslationLayer: (...args: unknown[]) => updateTranslationLayer(...args),
  updateTranslationVariant: (...args: unknown[]) => updateTranslationVariant(...args),
}));

vi.mock("@/lib/flux/commentary", () => ({
  findPromotedCommentaryNote: (...args: unknown[]) =>
    findPromotedCommentaryNote(...args),
  createCommentaryNote: (...args: unknown[]) => createCommentaryNote(...args),
  updateCommentaryNote: (...args: unknown[]) => updateCommentaryNote(...args),
}));

vi.mock("@/lib/flux/concepts", () => ({
  findPromotedConceptMention: (...args: unknown[]) =>
    findPromotedConceptMention(...args),
  createConceptMention: (...args: unknown[]) => createConceptMention(...args),
  updateConceptMention: (...args: unknown[]) => updateConceptMention(...args),
}));

vi.mock("@/lib/flux/ai-runs", () => ({
  updateAiRunStatus: (...args: unknown[]) => updateAiRunStatus(...args),
}));

import { promotePassageDraft } from "./promote-passage-draft";
import type { ConceptThreadRow, TokenRow } from "@/lib/types/entities";

const passageId = "p1";
const aiRunId = "run-1";
const sub = "user-1";

const tokens: TokenRow[] = [
  {
    id: "t1",
    passage_id: passageId,
    token_index: 4,
    surface: "πολύτροπον",
    lemma: null,
    transliteration: null,
    morphology: null,
    literal_gloss: null,
    note: null,
    created_at: "",
  },
];

const concepts: ConceptThreadRow[] = [
  {
    id: "c1",
    slug: "polytropos",
    label: "many-turned",
    greek_term: "πολύτροπος",
    description: null,
    created_at: "",
  },
];

describe("promotePassageDraft", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    findPromotedTranslationLayer.mockResolvedValue(null);
    findPromotedTranslationVariant.mockResolvedValue(null);
    findPromotedCommentaryNote.mockResolvedValue(null);
    findPromotedConceptMention.mockResolvedValue(null);
    createTranslationLayer.mockResolvedValue({ id: "layer-1" });
    createTranslationVariant.mockResolvedValue({ id: "variant-1" });
    createCommentaryNote.mockResolvedValue({ id: "note-1" });
    createConceptMention.mockResolvedValue({ id: "mention-1" });
    updateTranslationLayer.mockResolvedValue({ id: "layer-1" });
    updateTranslationVariant.mockResolvedValue({ id: "variant-1" });
    updateCommentaryNote.mockResolvedValue({ id: "note-1" });
    updateConceptMention.mockResolvedValue({ id: "mention-1" });
    updateAiRunStatus.mockResolvedValue({ id: aiRunId, status: "revised" });
  });

  it("includes source_ai_run_id on promoted rows", async () => {
    await promotePassageDraft(sub, passageId, aiRunId, odyssey11Fixture, {
      literalLayer: true,
      variants: true,
      commentary: true,
      concepts: true,
    }, { tokens, concepts });

    expect(createTranslationLayer).toHaveBeenCalledWith(sub, expect.objectContaining({
      source_ai_run_id: aiRunId,
      status: "draft",
    }));
    expect(createTranslationVariant).toHaveBeenCalledWith(sub, expect.objectContaining({
      source_ai_run_id: aiRunId,
    }));
    expect(createCommentaryNote).toHaveBeenCalledWith(sub, expect.objectContaining({
      source_ai_run_id: aiRunId,
    }));
    expect(createConceptMention).toHaveBeenCalledWith(sub, expect.objectContaining({
      source_ai_run_id: aiRunId,
    }));
  });

  it("updates existing rows on re-promotion without changing provenance", async () => {
    findPromotedTranslationLayer.mockResolvedValue({
      id: "layer-existing",
      status: "accepted",
      source_ai_run_id: aiRunId,
    });
    findPromotedTranslationVariant.mockResolvedValue({
      id: "variant-existing",
      review_status: "reviewed",
      source_ai_run_id: aiRunId,
    });

    await promotePassageDraft(sub, passageId, aiRunId, odyssey11Fixture, {
      literalLayer: true,
      variants: true,
    }, { tokens, concepts });

    expect(createTranslationLayer).not.toHaveBeenCalled();
    expect(updateTranslationLayer).toHaveBeenCalledWith(sub, "layer-existing", {
      content: odyssey11Fixture.translationLayers[0]!.content,
    });
    expect(updateTranslationLayer.mock.calls[0]![2]).not.toHaveProperty("source_ai_run_id");

    expect(createTranslationVariant).not.toHaveBeenCalled();
    expect(updateTranslationVariant).toHaveBeenCalled();
    expect(updateTranslationVariant.mock.calls[0]![2]).not.toHaveProperty("source_ai_run_id");
  });

  it("marks ai run revised when anything is promoted", async () => {
    await promotePassageDraft(sub, passageId, aiRunId, odyssey11Fixture, {
      readableLayer: true,
    }, { tokens, concepts });

    expect(updateAiRunStatus).toHaveBeenCalledWith(sub, aiRunId, "revised");
  });

  it("does not update ai run when nothing selected", async () => {
    await promotePassageDraft(sub, passageId, aiRunId, odyssey11Fixture, {}, {
      tokens,
      concepts,
    });

    expect(updateAiRunStatus).not.toHaveBeenCalled();
  });
});
