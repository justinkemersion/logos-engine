import { describe, expect, it } from "vitest";
import { findConceptForDraft, matchTokenId } from "./promote-passage-draft-helpers";
import type { ConceptThreadRow, TokenRow } from "@/lib/types/entities";

const tokens: TokenRow[] = [
  {
    id: "t1",
    passage_id: "p1",
    token_index: 0,
    surface: "ἄνδρα",
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

describe("promote-passage-draft helpers", () => {
  it("matches token id by surface", () => {
    expect(matchTokenId(tokens, "ἄνδρα", 0)).toBe("t1");
    expect(matchTokenId(tokens, "missing", 0)).toBeNull();
  });

  it("finds concept thread by greek term", () => {
    expect(findConceptForDraft(concepts, "πολύτροπος")?.id).toBe("c1");
    expect(findConceptForDraft(concepts, "ψυχή")).toBeNull();
  });
});
