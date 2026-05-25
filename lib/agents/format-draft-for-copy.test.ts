import { describe, expect, it } from "vitest";
import { odyssey11Fixture } from "./fixtures/odyssey-1-1";
import {
  formatDraftLayerForCopy,
  formatDraftTokensForCopy,
  formatDraftVariantsForCopy,
  formatDraftWarningsForCopy,
} from "./format-draft-for-copy";

describe("format-draft-for-copy", () => {
  it("formats tokens for clipboard", () => {
    const text = formatDraftTokensForCopy(odyssey11Fixture.tokens);
    expect(text).toContain("πολύτροπον");
    expect(text).toContain("many-turned");
  });

  it("extracts literal layer text", () => {
    expect(formatDraftLayerForCopy(odyssey11Fixture.translationLayers, "literal")).toContain(
      "many-turned",
    );
  });

  it("formats variants and warnings", () => {
    expect(formatDraftVariantsForCopy(odyssey11Fixture)).toContain("πολύτροπον");
    expect(formatDraftWarningsForCopy(odyssey11Fixture)).toContain("[low]");
  });
});
