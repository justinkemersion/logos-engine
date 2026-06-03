"use client";

import type { TokenRow, TranslationVariantRow } from "@/lib/types/entities";

export function PublicTokenAnnotation({
  token,
  variants,
  onClose,
}: {
  token: TokenRow;
  variants: TranslationVariantRow[];
  onClose: () => void;
}) {
  const tokenVariants = variants.filter((v) => v.token_id === token.id);
  const hasDetails = token.lemma || token.morphology;

  return (
    <aside
      className="mt-6 rounded-md border-l-2 border-[var(--accent)] bg-[var(--surface)] py-4 pl-4 pr-3 md:ml-4 md:max-w-md"
      aria-label="Word annotation"
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className="text-2xl font-semibold leading-tight"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {token.surface}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 text-xs text-[var(--muted-fg)] transition hover:text-[var(--foreground)]"
        >
          Close
        </button>
      </div>

      {token.transliteration ? (
        <p className="mt-1 text-sm italic text-[var(--muted-fg)]">{token.transliteration}</p>
      ) : null}

      {token.literal_gloss ? (
        <p className="mt-3 text-base leading-relaxed text-[var(--foreground)]">
          {token.literal_gloss}
        </p>
      ) : null}

      {token.note ? (
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted-fg)]">{token.note}</p>
      ) : null}

      {hasDetails ? (
        <div className="mt-4 border-t border-[var(--border)] pt-3">
          <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-[var(--muted-fg)]">
            Details
          </p>
          <dl className="mt-2 space-y-1.5 text-sm text-[var(--muted-fg)]">
            {token.lemma ? (
              <div>
                <dt className="inline">Lemma </dt>
                <dd
                  className="inline text-[var(--foreground)]"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {token.lemma}
                </dd>
              </div>
            ) : null}
            {token.morphology ? (
              <div>
                <dt className="inline">Morphology </dt>
                <dd className="inline text-[var(--foreground)]">{token.morphology}</dd>
              </div>
            ) : null}
          </dl>
        </div>
      ) : null}

      {tokenVariants.length > 0 ? (
        <div className="mt-4 space-y-2 border-t border-[var(--border)] pt-3">
          {tokenVariants.map((v) => (
            <p key={v.id} className="text-sm leading-relaxed text-[var(--muted-fg)]">
              <span className="text-[var(--foreground)]">{v.variant}</span>
              {v.tradeoff_note ? ` — ${v.tradeoff_note}` : null}
            </p>
          ))}
        </div>
      ) : null}
    </aside>
  );
}
