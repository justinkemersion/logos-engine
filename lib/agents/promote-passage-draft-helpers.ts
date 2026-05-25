import type { ConceptThreadRow, TokenRow } from "@/lib/types/entities";

export function matchTokenId(tokens: TokenRow[], surface: string, index: number): string | null {
  const atIndex = tokens[index];
  if (atIndex?.surface === surface) return atIndex.id;
  return tokens.find((t) => t.surface === surface)?.id ?? null;
}

export function findConceptForDraft(
  concepts: ConceptThreadRow[],
  greekTerm: string,
): ConceptThreadRow | null {
  const normalized = greekTerm.trim();
  return (
    concepts.find((c) => c.greek_term === normalized) ??
    concepts.find((c) => c.label === normalized) ??
    null
  );
}
