import { describe, expect, it } from "vitest";
import {
  decomposePassageDraft,
  toDbConfidence,
} from "./decompose-passage-draft";
import { odyssey11Fixture } from "./fixtures/odyssey-1-1";
import type { LogosPassageDraft } from "./logos-passage-draft";

describe("decomposePassageDraft", () => {
  it("always includes passage_draft master payload", () => {
    const payloads = decomposePassageDraft(odyssey11Fixture);
    expect(payloads[0]?.runType).toBe("passage_draft");
    const master = JSON.parse(payloads[0]!.output) as LogosPassageDraft;
    expect(master.tokens).toHaveLength(5);
  });

  it("decomposes full draft into granular run types", () => {
    const payloads = decomposePassageDraft(odyssey11Fixture);
    const runTypes = payloads.map((p) => p.runType);
    expect(runTypes).toContain("token_gloss");
    expect(runTypes).toContain("literal_translation");
    expect(runTypes).toContain("readable_translation");
    expect(runTypes).toContain("philosophical_note");
    expect(runTypes).toContain("concept_linking");
    expect(runTypes).not.toContain("cross_reference_scan");
    expect(runTypes).not.toContain("authenticity_summary");
  });

  it("emits only passage_draft and token_gloss for tokens-only draft", () => {
    const minimal: LogosPassageDraft = {
      tokens: odyssey11Fixture.tokens,
      translationLayers: [],
      variants: [],
      concepts: [],
      crossReferences: [],
      commentary: [],
    };
    const payloads = decomposePassageDraft(minimal);
    expect(payloads.map((p) => p.runType)).toEqual(["passage_draft", "token_gloss"]);
  });
});

describe("toDbConfidence", () => {
  it("maps numeric confidence to DB categories", () => {
    expect(toDbConfidence(0.9)).toBe("high");
    expect(toDbConfidence(0.6)).toBe("medium");
    expect(toDbConfidence(0.2)).toBe("contested");
  });
});
