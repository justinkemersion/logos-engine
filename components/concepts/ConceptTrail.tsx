import type { ConceptThreadRow } from "@/lib/types/entities";

/**
 * Renders the semantic trail embedded in a concept's description field.
 * For MVP, this is the description paragraph rendered with semantic structure.
 * The component name and structure anticipate the future graph/timeline expansion
 * (e.g. λόγος → Heraclitus → Plato → Stoics → John 1:1).
 */
export function ConceptTrail({ concept }: { concept: ConceptThreadRow }) {
  if (!concept.description) return null;

  return (
    <div>
      <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-widest text-[var(--muted-fg)]">
        Semantic trail
      </p>
      <p className="text-sm text-[var(--foreground)] leading-relaxed whitespace-pre-line">
        {concept.description}
      </p>
    </div>
  );
}
