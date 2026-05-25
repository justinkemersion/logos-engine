import { describe, expect, it } from "vitest";
import {
  badgeLabel,
  isAiPromoted,
  isReviewed,
  pickPreferredLayer,
} from "./review-display";
import type { TranslationLayerRow } from "@/lib/types/entities";

function layer(overrides: Partial<TranslationLayerRow>): TranslationLayerRow {
  return {
    id: "1",
    passage_id: "p1",
    layer: "readable",
    content: "content",
    status: "draft",
    reviewer_note: null,
    source_ai_run_id: null,
    reviewed_at: null,
    reviewed_by: null,
    created_at: "",
    updated_at: "",
    ...overrides,
  };
}

describe("review-display", () => {
  it("prefers accepted over AI draft over seed", () => {
    const layers = [
      layer({ id: "seed", status: "draft", source_ai_run_id: null }),
      layer({ id: "ai", status: "draft", source_ai_run_id: "run-1" }),
      layer({ id: "reviewed", status: "accepted", source_ai_run_id: "run-2" }),
    ];

    expect(pickPreferredLayer(layers, "readable")?.id).toBe("reviewed");
  });

  it("prefers AI draft over seed when no accepted", () => {
    const layers = [
      layer({ id: "seed", status: "accepted", source_ai_run_id: null }),
      layer({ id: "ai", status: "draft", source_ai_run_id: "run-1" }),
    ];

    expect(pickPreferredLayer(layers, "readable")?.id).toBe("seed");
  });

  it("shows AI draft badge for unreviewed promoted rows", () => {
    const row = layer({ source_ai_run_id: "run-1", status: "draft" });
    expect(isAiPromoted(row)).toBe(true);
    expect(isReviewed(row)).toBe(false);
    expect(badgeLabel(row)).toBe("AI Draft — not yet reviewed");
  });

  it("shows reviewed badge for accepted layers", () => {
    const row = layer({ source_ai_run_id: "run-1", status: "accepted" });
    expect(badgeLabel(row)).toBe("Reviewed");
  });
});
