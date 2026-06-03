"use client";

import { cn } from "@/lib/ui/cn";

export type PublicTab = "greek" | "literal" | "readable" | "commentary" | "variants";

const TABS: { id: PublicTab; label: string }[] = [
  { id: "greek", label: "Greek" },
  { id: "literal", label: "Literal" },
  { id: "readable", label: "Readable" },
  { id: "commentary", label: "Commentary" },
  { id: "variants", label: "Tradeoffs" },
];

export function PublicReadingTabs({
  activeTab,
  onTabChange,
}: {
  activeTab: PublicTab;
  onTabChange: (tab: PublicTab) => void;
}) {
  return (
    <div className="-mx-6 overflow-x-auto border-b border-[var(--border)] px-6">
      <div className="flex flex-nowrap">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "mr-4 shrink-0 py-2.5 text-xs font-semibold uppercase tracking-widest border-b-2 -mb-px transition-colors",
              activeTab === tab.id
                ? "border-[var(--accent)] text-[var(--accent)]"
                : "border-transparent text-[var(--muted-fg)] hover:text-[var(--foreground)]",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
