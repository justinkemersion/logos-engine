import { describe, expect, it } from "vitest";
import { citationRefToSlug, citationSlugMatchesRef } from "./citation-slug";

describe("citationRefToSlug", () => {
  it("replaces book-line dots with dashes", () => {
    expect(citationRefToSlug("1.1")).toBe("1-1");
    expect(citationRefToSlug("1.10")).toBe("1-10");
  });

  it("preserves Stephanus-style citations", () => {
    expect(citationRefToSlug("327a")).toBe("327a");
    expect(citationRefToSlug("331e-336a")).toBe("331e-336a");
  });

  it("lowercases input", () => {
    expect(citationRefToSlug("327A")).toBe("327a");
  });
});

describe("citationSlugMatchesRef", () => {
  it("matches normalized refs", () => {
    expect(citationSlugMatchesRef("1-1", "1.1")).toBe(true);
    expect(citationSlugMatchesRef("327a", "327a")).toBe(true);
  });
});
