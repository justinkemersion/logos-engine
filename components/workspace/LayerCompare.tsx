"use client";

import { cn } from "@/lib/ui/cn";

export type LayerViewMode = "public" | "mine" | "compare";

export function LayerCompare({
  mode,
  onModeChange,
}: {
  mode: LayerViewMode;
  onModeChange: (mode: LayerViewMode) => void;
}) {
  const modes: { id: LayerViewMode; label: string }[] = [
    { id: "public", label: "Public layer" },
    { id: "mine", label: "My layer" },
    { id: "compare", label: "Compare" },
  ];

  return (
    <div className="flex gap-2 flex-wrap">
      {modes.map((m) => (
        <button
          key={m.id}
          type="button"
          onClick={() => onModeChange(m.id)}
          className={cn(
            "rounded-md px-3 py-1.5 text-xs font-medium border transition-colors",
            mode === m.id
              ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-fg)]"
              : "border-[var(--border)] text-[var(--muted-fg)] hover:bg-[var(--muted)]",
          )}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
