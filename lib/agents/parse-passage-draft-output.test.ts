import { describe, expect, it } from "vitest";
import { odyssey11Fixture } from "./fixtures/odyssey-1-1";
import { parsePassageDraftOutput } from "./parse-passage-draft-output";

describe("parsePassageDraftOutput", () => {
  it("parses stored passage_draft JSON", () => {
    const result = parsePassageDraftOutput(JSON.stringify(odyssey11Fixture));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.draft.tokens).toHaveLength(5);
    }
  });

  it("rejects empty output", () => {
    expect(parsePassageDraftOutput(null).ok).toBe(false);
    expect(parsePassageDraftOutput("  ").ok).toBe(false);
  });

  it("rejects invalid JSON", () => {
    const result = parsePassageDraftOutput("{not json");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain("JSON");
  });

  it("rejects schema-invalid payload", () => {
    const result = parsePassageDraftOutput(JSON.stringify({ tokens: [] }));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain("validation");
  });
});
