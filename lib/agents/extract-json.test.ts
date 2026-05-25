import { describe, expect, it } from "vitest";
import { extractJsonFromAgentOutput } from "./extract-json";

describe("extractJsonFromAgentOutput", () => {
  it("parses bare JSON", () => {
    const result = extractJsonFromAgentOutput('{"tokens":[]}') as { tokens: unknown[] };
    expect(result.tokens).toEqual([]);
  });

  it("parses JSON inside markdown fences", () => {
    const raw = 'Here is the result:\n```json\n{"tokens":[{"surface":"α"}]}\n```\n';
    const result = extractJsonFromAgentOutput(raw) as {
      tokens: Array<{ surface: string }>;
    };
    expect(result.tokens[0]?.surface).toBe("α");
  });

  it("extracts JSON object from prose wrapper", () => {
    const raw = 'Sorry for the delay. {"tokens":[{"surface":"β"}]} Hope this helps.';
    const result = extractJsonFromAgentOutput(raw) as {
      tokens: Array<{ surface: string }>;
    };
    expect(result.tokens[0]?.surface).toBe("β");
  });
});
