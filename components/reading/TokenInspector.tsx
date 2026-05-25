"use client";

import type { TokenRow, TranslationVariantRow } from "@/lib/types/entities";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/ui/cn";

const confidenceStyles: Record<string, string> = {
  high: "border-green-300 text-green-800 bg-green-50",
  medium: "border-amber-300 text-amber-800 bg-amber-50",
  contested: "border-red-300 text-red-800 bg-red-50",
};

export function TokenInspector({
  token,
  variants,
  onClose,
}: {
  token: TokenRow;
  variants: TranslationVariantRow[];
  onClose: () => void;
}) {
  const tokenVariants = variants.filter((v) => v.token_id === token.id);

  return (
    <Card className="mt-3 border-[var(--accent)] border-opacity-30">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <span
            className="text-2xl font-semibold"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {token.surface}
          </span>
          {token.transliteration ? (
            <span className="text-sm text-[var(--muted-fg)] italic">
              {token.transliteration}
            </span>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-[var(--muted-fg)] hover:text-[var(--foreground)] transition mt-1"
          aria-label="Close inspector"
        >
          ✕
        </button>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {token.lemma ? (
          <Field label="Lemma" value={token.lemma} serif />
        ) : null}
        {token.literal_gloss ? (
          <Field label="Literal gloss" value={token.literal_gloss} />
        ) : null}
        {token.morphology ? (
          <Field label="Morphology" value={token.morphology} />
        ) : null}
      </div>

      {token.note ? (
        <p className="mt-3 text-sm text-[var(--foreground)] leading-relaxed border-t border-[var(--border)] pt-3">
          {token.note}
        </p>
      ) : null}

      {tokenVariants.length > 0 ? (
        <div className="mt-4 border-t border-[var(--border)] pt-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted-fg)]">
            Variants
          </p>
          <div className="space-y-3">
            {tokenVariants.map((v) => (
              <div key={v.id} className="rounded-md border border-[var(--border)] p-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium">{v.variant}</span>
                  <Badge className="text-[0.65rem]">{v.variant_type}</Badge>
                  {v.confidence ? (
                    <span
                      className={cn(
                        "rounded-full border px-2 py-0.5 text-[0.65rem] font-medium",
                        confidenceStyles[v.confidence] ?? "bg-[var(--muted)] text-[var(--muted-fg)]",
                      )}
                    >
                      {v.confidence}
                    </span>
                  ) : null}
                </div>
                {v.tradeoff_note ? (
                  <p className="mt-2 text-xs text-[var(--muted-fg)] leading-relaxed">
                    {v.tradeoff_note}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </Card>
  );
}

function Field({
  label,
  value,
  serif,
}: {
  label: string;
  value: string;
  serif?: boolean;
}) {
  return (
    <div>
      <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-[var(--muted-fg)]">
        {label}
      </p>
      <p
        className="mt-0.5 text-sm"
        style={serif ? { fontFamily: "var(--font-serif)" } : undefined}
      >
        {value}
      </p>
    </div>
  );
}
