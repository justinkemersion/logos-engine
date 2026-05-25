import type { LogosPassageDraft } from "@/lib/agents/logos-passage-draft";

/** Odyssey 1.1 fixture for unit tests — not live agent output. */
export const odyssey11Fixture: LogosPassageDraft = {
  tokens: [
    {
      surface: "ἄνδρα",
      transliteration: "andra",
      lemma: "ἀνήρ",
      morphology: "acc. sg. m.",
      literalGloss: "man",
    },
    {
      surface: "μοι",
      transliteration: "moi",
      lemma: "ἐγώ",
      morphology: "dat. sg.",
      literalGloss: "to-me",
    },
    {
      surface: "ἔννεπε",
      transliteration: "ennepe",
      lemma: "ἐνέπω",
      morphology: "impv. sg.",
      literalGloss: "tell",
    },
    {
      surface: "Μοῦσα",
      transliteration: "Mousa",
      lemma: "Μοῦσα",
      morphology: "voc. sg.",
      literalGloss: "Muse",
    },
    {
      surface: "πολύτροπον",
      transliteration: "polytropon",
      lemma: "πολύτροπος",
      morphology: "acc. sg. m.",
      literalGloss: "many-turned",
      note: "Semantically dense; resists single English equivalent.",
    },
  ],
  translationLayers: [
    {
      layer: "literal",
      content: "Man to-me tell, Muse, many-turned.",
      confidence: 0.85,
    },
    {
      layer: "readable",
      content: "Tell me, Muse, of the man of many turns.",
      confidence: 0.7,
    },
    {
      layer: "philosophical",
      content:
        "Muse, narrate the man whose path unfolds through many turnings — identity as motion.",
      confidence: 0.55,
    },
  ],
  variants: [
    {
      sourcePhrase: "πολύτροπον",
      variant: "many-turned",
      variantType: "literal",
      confidence: 0.8,
      tradeoffNote:
        "Preserves the compound's rotational imagery; may sound awkward in English.",
    },
    {
      sourcePhrase: "πολύτροπον",
      variant: "of many turns",
      variantType: "readable",
      confidence: 0.65,
      tradeoffNote: "Smoother English; loses explicit compound structure.",
    },
    {
      sourcePhrase: "πολύτροπον",
      variant: "wily",
      variantType: "poetic",
      confidence: 0.4,
      tradeoffNote: "Captures cunning but flattens the many-turned semantic range.",
    },
  ],
  concepts: [
    {
      greekTerm: "πολύτροπος",
      label: "many-turned / adaptable",
      rationale:
        "The compound foregrounds multiplicity of turning — wandering, cunning, adaptability.",
    },
  ],
  crossReferences: [],
  commentary: [
    {
      noteType: "grammatical",
      title: "Opening invocation",
      body:
        "The Muse is invoked before the subject; the adjective πολύτροπον is deferred to the line end, emphasizing the hero's defining quality.",
    },
  ],
  editorialWarnings: [
    {
      level: "low",
      message: "Readable layer required minor syntactic smoothing.",
    },
  ],
};
