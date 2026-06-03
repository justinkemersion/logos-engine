import type { TranslationVariantRow } from "@/lib/types/entities";

export function PublicVariantList({ variants }: { variants: TranslationVariantRow[] }) {
  if (variants.length === 0) {
    return (
      <p className="text-sm text-[var(--muted-fg)]">No translation tradeoffs for this passage.</p>
    );
  }

  return (
    <ul className="space-y-6">
      {variants.map((v) => (
        <li key={v.id} className="border-l border-[var(--border)] pl-4">
          {v.tradeoff_note ? (
            <p className="text-base leading-relaxed text-[var(--foreground)]">{v.tradeoff_note}</p>
          ) : null}
          <p className="mt-2 text-sm text-[var(--foreground)]">
            <span className="text-[var(--muted-fg)]">{v.phrase}</span>
            {" → "}
            {v.variant}
          </p>
          <p className="mt-1 text-xs text-[var(--muted-fg)]">
            {v.variant_type}
            {v.confidence ? ` · ${v.confidence}` : ""}
          </p>
          {v.rationale ? (
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted-fg)]">{v.rationale}</p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
