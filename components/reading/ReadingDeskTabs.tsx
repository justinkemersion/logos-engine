import { cn } from "@/lib/ui/cn";
import type { TranslationTab } from "./reading-desk-types";

const TABS: TranslationTab[] = ["greek", "literal", "readable", "commentary"];

export function ReadingDeskTabs({
  activeTab,
  onTabChange,
}: {
  activeTab: TranslationTab;
  onTabChange: (tab: TranslationTab) => void;
}) {
  return (
    <div className="flex border-b border-[var(--border)] bg-[var(--surface)] px-6">
      {TABS.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onTabChange(tab)}
          className={cn(
            "mr-4 py-2.5 text-xs font-semibold uppercase tracking-widest transition-colors border-b-2 -mb-px",
            activeTab === tab
              ? "border-[var(--accent)] text-[var(--accent)]"
              : "border-transparent text-[var(--muted-fg)] hover:text-[var(--foreground)]",
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
