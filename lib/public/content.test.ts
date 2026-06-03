import { describe, expect, it } from "vitest";
import { filterPublicLayers, pickPublicLayer, isPublicLayer } from "./content";
import type { TranslationLayerRow } from "@/lib/types/entities";

function layer(partial: Partial<TranslationLayerRow> & { layer: string }): TranslationLayerRow {
  return {
    id: partial.id ?? "1",
    passage_id: "p1",
    layer: partial.layer,
    content: partial.content ?? "text",
    status: partial.status ?? "draft",
    reviewer_note: null,
    source_ai_run_id: partial.source_ai_run_id ?? null,
    reviewed_at: null,
    reviewed_by: null,
    created_at: "",
    updated_at: "",
  };
}

describe("public content filters", () => {
  it("isPublicLayer accepts only accepted", () => {
    expect(isPublicLayer(layer({ layer: "literal", status: "accepted" }))).toBe(true);
    expect(isPublicLayer(layer({ layer: "literal", status: "draft" }))).toBe(false);
  });

  it("pickPublicLayer ignores draft layers", () => {
    const layers = [
      layer({ id: "draft", layer: "readable", status: "draft", content: "draft text" }),
      layer({ id: "ok", layer: "readable", status: "accepted", content: "public text" }),
    ];
    expect(pickPublicLayer(layers, "readable")?.content).toBe("public text");
    expect(filterPublicLayers(layers)).toHaveLength(1);
  });
});
