"use client";

import { cn } from "@/lib/ui/cn";
import type { TokenRow as TokenRowType } from "@/lib/types/entities";

export function TokenRow({
  token,
  isSelected,
  onClick,
}: {
  token: TokenRowType;
  isSelected: boolean;
  onClick: (token: TokenRowType) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onClick(token)}
      className={cn(
        "inline-flex flex-col items-center px-1.5 py-1 rounded cursor-pointer transition-colors text-left",
        isSelected
          ? "bg-[var(--accent)] text-[var(--accent-fg)]"
          : "hover:bg-[var(--muted)]",
      )}
    >
      <span
        className="text-lg leading-snug select-text"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        {token.surface}
      </span>
      {token.literal_gloss ? (
        <span
          className={cn(
            "text-[0.65rem] leading-tight mt-0.5",
            isSelected ? "text-[var(--accent-fg)] opacity-80" : "text-[var(--muted-fg)]",
          )}
        >
          {token.literal_gloss}
        </span>
      ) : null}
    </button>
  );
}
