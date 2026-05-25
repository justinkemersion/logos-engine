import type {
  LogosPassageDraft,
  TokenDraft,
  TranslationLayerDraft,
} from "@/lib/agents/logos-passage-draft";

export function formatDraftTokensForCopy(tokens: TokenDraft[]): string {
  return tokens
    .map((t) => {
      const parts = [t.surface];
      if (t.literalGloss) parts.push(t.literalGloss);
      if (t.lemma) parts.push(`(${t.lemma})`);
      if (t.morphology) parts.push(`[${t.morphology}]`);
      return parts.join(" — ");
    })
    .join("\n");
}

export function formatDraftLayerForCopy(
  layers: TranslationLayerDraft[],
  layer: TranslationLayerDraft["layer"],
): string | null {
  const match = layers.find((l) => l.layer === layer);
  return match?.content ?? null;
}

export function formatDraftVariantsForCopy(draft: LogosPassageDraft): string {
  return draft.variants
    .map(
      (v) =>
        `${v.sourcePhrase} → ${v.variant} (${v.variantType}, ${Math.round(v.confidence * 100)}%)\n  ${v.tradeoffNote}`,
    )
    .join("\n\n");
}

export function formatDraftWarningsForCopy(draft: LogosPassageDraft): string {
  return (draft.editorialWarnings ?? [])
    .map((w) => `[${w.level}] ${w.message}`)
    .join("\n");
}
