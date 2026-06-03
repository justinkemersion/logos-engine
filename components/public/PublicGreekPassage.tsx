"use client";

import { useState } from "react";
import { PublicTokenAnnotation } from "./PublicTokenAnnotation";
import { cn } from "@/lib/ui/cn";
import type { TokenRow, TranslationVariantRow } from "@/lib/types/entities";

function PublicTokenButton({
  token,
  isSelected,
  showGloss,
  onClick,
}: {
  token: TokenRow;
  isSelected: boolean;
  showGloss: boolean;
  onClick: (token: TokenRow) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onClick(token)}
      className={cn(
        "inline-flex flex-col items-center rounded px-1.5 py-1 text-left transition-colors",
        isSelected
          ? "border-b-2 border-[var(--accent)] bg-[var(--muted)]"
          : "hover:bg-[var(--muted)]/60",
      )}
    >
      <span
        className="text-xl leading-loose select-text md:text-2xl"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        {token.surface}
      </span>
      {showGloss && token.literal_gloss ? (
        <span className="mt-0.5 text-[0.7rem] leading-tight text-[var(--muted-fg)]">
          {token.literal_gloss}
        </span>
      ) : null}
    </button>
  );
}

export function PublicGreekPassage({
  passage,
  tokens,
  translationVariants,
  selectedToken,
  onTokenClick,
  onCloseAnnotation,
  mode,
}: {
  passage: { greek_text: string; citation_ref: string };
  tokens: TokenRow[];
  translationVariants: TranslationVariantRow[];
  selectedToken: TokenRow | null;
  onTokenClick: (token: TokenRow) => void;
  onCloseAnnotation: () => void;
  mode: "greek" | "literal";
}) {
  const [showHints, setShowHints] = useState(false);
  const showGlosses = mode === "literal" || showHints;

  if (tokens.length === 0) {
    return (
      <p className="text-xl leading-loose md:text-2xl" style={{ fontFamily: "var(--font-serif)" }}>
        {passage.greek_text}
      </p>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <div className="flex flex-wrap items-start gap-x-1 gap-y-2 break-words">
          {tokens.map((token) => (
            <PublicTokenButton
              key={token.id}
              token={token}
              isSelected={selectedToken?.id === token.id}
              showGloss={showGlosses}
              onClick={onTokenClick}
            />
          ))}
        </div>
      </div>

      {mode === "greek" ? (
        <button
          type="button"
          onClick={() => setShowHints((v) => !v)}
          className="mt-4 text-xs text-[var(--muted-fg)] transition hover:text-[var(--foreground)]"
        >
          {showHints ? "Hide word hints" : "Show word hints"}
        </button>
      ) : null}

      {selectedToken ? (
        <PublicTokenAnnotation
          token={selectedToken}
          variants={translationVariants}
          onClose={onCloseAnnotation}
        />
      ) : null}
    </div>
  );
}
