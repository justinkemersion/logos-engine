"use client";

import { cn } from "@/lib/ui/cn";
import { GenerateDraftButton } from "./GenerateDraftButton";
import type { BottomTab } from "./reading-desk-types";
import type {
  AiRunRow,
  CommentaryNoteRow,
  PassageRow,
  TranslationVariantRow,
} from "@/lib/types/entities";

const BOTTOM_TABS: BottomTab[] = ["grammar", "notes", "variants"];

export function ReadingDeskBottomPanel({
  bottomTab,
  onBottomTabChange,
  grammarNotes,
  passage,
  translationVariants,
  latestPassageDraftRun,
}: {
  bottomTab: BottomTab;
  onBottomTabChange: (tab: BottomTab) => void;
  grammarNotes: CommentaryNoteRow[];
  passage: PassageRow;
  translationVariants: TranslationVariantRow[];
  latestPassageDraftRun: AiRunRow | null;
}) {
  return (
    <div
      className="border-t border-[var(--border)] bg-[var(--surface)]"
      style={{ minHeight: 160 }}
    >
      <div className="flex border-b border-[var(--border)] px-6">
        {BOTTOM_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => onBottomTabChange(tab)}
            className={cn(
              "mr-4 py-2 text-xs font-semibold uppercase tracking-widest transition-colors border-b-2 -mb-px",
              bottomTab === tab
                ? "border-[var(--accent)] text-[var(--accent)]"
                : "border-transparent text-[var(--muted-fg)] hover:text-[var(--foreground)]",
            )}
          >
            {tab}
          </button>
        ))}
        <GenerateDraftButton latestDraftRun={latestPassageDraftRun} />
      </div>
      <div className="overflow-y-auto p-4 text-sm" style={{ maxHeight: 160 }}>
        {bottomTab === "grammar" ? (
          grammarNotes.length > 0 ? (
            <ul className="space-y-2">
              {grammarNotes.map((n) => (
                <li key={n.id} className="text-xs leading-relaxed">
                  <span className="font-medium">{n.note_type}: </span>
                  {n.body}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-[var(--muted-fg)]">No grammar notes.</p>
          )
        ) : null}
        {bottomTab === "notes" ? (
          passage.source_note ? (
            <p className="text-xs text-[var(--muted-fg)] leading-relaxed">
              {passage.source_note}
            </p>
          ) : (
            <p className="text-xs text-[var(--muted-fg)]">No passage notes.</p>
          )
        ) : null}
        {bottomTab === "variants" ? (
          translationVariants.length > 0 ? (
            <ul className="space-y-2">
              {translationVariants.map((v) => (
                <li key={v.id} className="text-xs leading-relaxed">
                  <span className="font-medium">
                    {v.phrase} → {v.variant}
                  </span>
                  {v.tradeoff_note ? (
                    <span className="ml-2 text-[var(--muted-fg)]">
                      — {v.tradeoff_note.slice(0, 120)}…
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-[var(--muted-fg)]">No variants for this passage.</p>
          )
        ) : null}
      </div>
    </div>
  );
}
