import type { ConceptThreadRow } from "@/lib/types/entities";

export function PublicConceptTrail({ concepts }: { concepts: ConceptThreadRow[] }) {
  if (concepts.length === 0) {
    return <p className="text-sm text-[var(--muted-fg)]">No linked concepts.</p>;
  }

  return (
    <ul className="space-y-3">
      {concepts.map((c) => (
        <li
          key={c.id}
          className="border-l border-[var(--border)] pl-3 text-sm leading-relaxed"
          title={c.description ?? undefined}
        >
          <span className="text-[var(--foreground)]">{c.label}</span>
          {c.greek_term ? (
            <span className="mt-0.5 block text-[var(--muted-fg)]">{c.greek_term}</span>
          ) : null}
          {c.description ? (
            <span className="mt-1 block text-xs text-[var(--muted-fg)]">{c.description}</span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

/** Concepts with login-gated detail pages are listed without links on public reader. */
export function PublicConceptTrailNote() {
  return (
    <p className="mt-2 text-xs text-[var(--muted-fg)]">
      Sign in to explore full concept trails across works.
    </p>
  );
}
