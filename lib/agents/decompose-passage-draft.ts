import type { LogosPassageDraft } from "./logos-passage-draft";

export const AI_RUN_TYPES = [
  "passage_draft",
  "token_gloss",
  "literal_translation",
  "readable_translation",
  "philosophical_note",
  "concept_linking",
  "authenticity_summary",
  "cross_reference_scan",
] as const;

export type AiRunType = (typeof AI_RUN_TYPES)[number];

export type DbConfidence = "high" | "medium" | "contested";

export type GranularRunPayload = {
  runType: AiRunType;
  output: string;
};

/** Map numeric confidence (0–1) to DB categorical confidence for future persistence. */
export function toDbConfidence(confidence: number): DbConfidence {
  if (confidence >= 0.75) return "high";
  if (confidence >= 0.45) return "medium";
  return "contested";
}

function payload(runType: AiRunType, data: unknown): GranularRunPayload {
  return { runType, output: JSON.stringify(data, null, 2) };
}

export function decomposePassageDraft(draft: LogosPassageDraft): GranularRunPayload[] {
  const results: GranularRunPayload[] = [payload("passage_draft", draft)];

  if (draft.tokens.length > 0) {
    results.push(payload("token_gloss", { tokens: draft.tokens }));
  }

  const literalLayers = draft.translationLayers.filter((l) => l.layer === "literal");
  if (literalLayers.length > 0) {
    results.push(payload("literal_translation", { layers: literalLayers }));
  }

  const readableLayers = draft.translationLayers.filter((l) => l.layer === "readable");
  if (readableLayers.length > 0) {
    results.push(payload("readable_translation", { layers: readableLayers }));
  }

  const philosophicalLayers = draft.translationLayers.filter(
    (l) => l.layer === "philosophical",
  );
  if (philosophicalLayers.length > 0) {
    results.push(payload("philosophical_note", { layers: philosophicalLayers }));
  }

  if (draft.concepts.length > 0) {
    results.push(payload("concept_linking", { concepts: draft.concepts }));
  }

  if (draft.crossReferences.length > 0) {
    results.push(
      payload("cross_reference_scan", { crossReferences: draft.crossReferences }),
    );
  }

  if (draft.authenticityNotes && draft.authenticityNotes.length > 0) {
    results.push(
      payload("authenticity_summary", { authenticityNotes: draft.authenticityNotes }),
    );
  }

  return results;
}
