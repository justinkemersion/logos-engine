import { beforeEach, describe, expect, it, vi } from "vitest";

const getTranslationLayer = vi.fn();
const getTranslationVariant = vi.fn();
const getCommentaryNote = vi.fn();
const getConceptMention = vi.fn();
const updateTranslationLayer = vi.fn();
const updateTranslationVariant = vi.fn();
const updateCommentaryNote = vi.fn();
const updateConceptMention = vi.fn();

vi.mock("@/lib/flux/translations", () => ({
  getTranslationLayer: (...args: unknown[]) => getTranslationLayer(...args),
  getTranslationVariant: (...args: unknown[]) => getTranslationVariant(...args),
  updateTranslationLayer: (...args: unknown[]) => updateTranslationLayer(...args),
  updateTranslationVariant: (...args: unknown[]) => updateTranslationVariant(...args),
}));

vi.mock("@/lib/flux/commentary", () => ({
  getCommentaryNote: (...args: unknown[]) => getCommentaryNote(...args),
  updateCommentaryNote: (...args: unknown[]) => updateCommentaryNote(...args),
}));

vi.mock("@/lib/flux/concepts", () => ({
  getConceptMention: (...args: unknown[]) => getConceptMention(...args),
  updateConceptMention: (...args: unknown[]) => updateConceptMention(...args),
}));

import {
  markCommentaryNoteDraft,
  markCommentaryNoteReviewed,
  markConceptMentionDraft,
  markConceptMentionReviewed,
  markTranslationLayerDraft,
  markTranslationLayerReviewed,
  markTranslationVariantDraft,
  markTranslationVariantReviewed,
  ReviewPromotedContentError,
} from "./review-promoted-content";

const sub = "editor-1";

describe("review-promoted-content", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("marks translation layer reviewed with accepted and reviewed_by", async () => {
    getTranslationLayer.mockResolvedValue({
      id: "layer-1",
      source_ai_run_id: "run-1",
    });
    updateTranslationLayer.mockResolvedValue({ id: "layer-1", status: "accepted" });

    await markTranslationLayerReviewed(sub, "layer-1", sub, "Looks good");

    expect(updateTranslationLayer).toHaveBeenCalledWith(
      sub,
      "layer-1",
      expect.objectContaining({
        status: "accepted",
        reviewed_by: sub,
        reviewer_note: "Looks good",
        reviewed_at: expect.any(String),
      }),
    );
    expect(updateTranslationLayer.mock.calls[0]![2]).not.toHaveProperty("source_ai_run_id");
  });

  it("returns translation layer to draft and clears reviewed_by", async () => {
    getTranslationLayer.mockResolvedValue({
      id: "layer-1",
      source_ai_run_id: "run-1",
    });
    updateTranslationLayer.mockResolvedValue({ id: "layer-1", status: "draft" });

    await markTranslationLayerDraft(sub, "layer-1");

    expect(updateTranslationLayer).toHaveBeenCalledWith(sub, "layer-1", {
      status: "draft",
      reviewed_at: null,
      reviewed_by: null,
    });
  });

  it("marks translation variant reviewed", async () => {
    getTranslationVariant.mockResolvedValue({
      id: "variant-1",
      source_ai_run_id: "run-1",
    });
    updateTranslationVariant.mockResolvedValue({ id: "variant-1" });

    await markTranslationVariantReviewed(sub, "variant-1", sub);

    expect(updateTranslationVariant).toHaveBeenCalledWith(
      sub,
      "variant-1",
      expect.objectContaining({
        review_status: "reviewed",
        reviewed_by: sub,
        reviewed_at: expect.any(String),
      }),
    );
  });

  it("returns translation variant to draft", async () => {
    getTranslationVariant.mockResolvedValue({
      id: "variant-1",
      source_ai_run_id: "run-1",
    });
    updateTranslationVariant.mockResolvedValue({ id: "variant-1" });

    await markTranslationVariantDraft(sub, "variant-1");

    expect(updateTranslationVariant).toHaveBeenCalledWith(sub, "variant-1", {
      review_status: "draft",
      reviewed_at: null,
      reviewed_by: null,
    });
  });

  it("marks commentary note reviewed", async () => {
    getCommentaryNote.mockResolvedValue({
      id: "note-1",
      source_ai_run_id: "run-1",
    });
    updateCommentaryNote.mockResolvedValue({ id: "note-1" });

    await markCommentaryNoteReviewed(sub, "note-1", sub);

    expect(updateCommentaryNote).toHaveBeenCalledWith(
      sub,
      "note-1",
      expect.objectContaining({
        review_status: "reviewed",
        reviewed_by: sub,
      }),
    );
  });

  it("marks concept mention reviewed", async () => {
    getConceptMention.mockResolvedValue({
      id: "mention-1",
      source_ai_run_id: "run-1",
    });
    updateConceptMention.mockResolvedValue({ id: "mention-1" });

    await markConceptMentionReviewed(sub, "mention-1", sub);

    expect(updateConceptMention).toHaveBeenCalledWith(
      sub,
      "mention-1",
      expect.objectContaining({
        review_status: "reviewed",
        reviewed_by: sub,
      }),
    );
  });

  it("rejects review of non-AI-promoted rows", async () => {
    getTranslationLayer.mockResolvedValue({
      id: "layer-seed",
      source_ai_run_id: null,
    });

    await expect(markTranslationLayerReviewed(sub, "layer-seed", sub)).rejects.toThrow(
      ReviewPromotedContentError,
    );
  });
});
