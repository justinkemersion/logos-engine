import { describe, expect, it } from "vitest";
import { odyssey11Fixture } from "./fixtures/odyssey-1-1";
import {
  logosPassageDraftSchema,
  parseLogosPassageDraft,
} from "./logos-passage-draft";

describe("logosPassageDraftSchema", () => {
  it("accepts a valid Odyssey 1.1 fixture", () => {
    const draft = parseLogosPassageDraft(odyssey11Fixture);
    expect(draft.tokens).toHaveLength(5);
    expect(draft.variants.some((v) => v.sourcePhrase === "πολύτροπον")).toBe(true);
    expect(draft.editorialWarnings?.[0]?.level).toBe("low");
  });

  it("rejects missing tokens", () => {
    const result = logosPassageDraftSchema.safeParse({
      ...odyssey11Fixture,
      tokens: [],
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid layer enum", () => {
    const result = logosPassageDraftSchema.safeParse({
      ...odyssey11Fixture,
      translationLayers: [{ layer: "poetic", content: "x", confidence: 0.5 }],
    });
    expect(result.success).toBe(false);
  });

  it("rejects confidence out of range", () => {
    const result = logosPassageDraftSchema.safeParse({
      ...odyssey11Fixture,
      variants: [
        {
          sourcePhrase: "x",
          variant: "y",
          variantType: "literal",
          confidence: 1.5,
          tradeoffNote: "note",
        },
      ],
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid editorial warning level", () => {
    const result = logosPassageDraftSchema.safeParse({
      ...odyssey11Fixture,
      editorialWarnings: [{ level: "critical", message: "bad" }],
    });
    expect(result.success).toBe(false);
  });
});
