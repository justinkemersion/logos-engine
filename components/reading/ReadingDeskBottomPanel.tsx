"use client";

import { cn } from "@/lib/ui/cn";
import { GenerateDraftButton } from "./GenerateDraftButton";
import { AiDraftReviewPanel } from "./AiDraftReviewPanel";
import { ReviewBadge } from "./ReviewBadge";
import { ReviewControls } from "./ReviewControls";
import type { BottomTab } from "./reading-desk-types";
import type { LogosPassageDraft } from "@/lib/agents/logos-passage-draft";
import type {
  AiRunRow,
  CommentaryNoteRow,
  PassageRow,
  TranslationVariantRow,
} from "@/lib/types/entities";

const BASE_BOTTOM_TABS: BottomTab[] = ["grammar", "notes", "variants"];

export function ReadingDeskBottomPanel({
  bottomTab,
  onBottomTabChange,
  grammarNotes,
  passage,
  translationVariants,
  latestPassageDraftRun,
  passageDraft,
  draftParseError,
}: {
  bottomTab: BottomTab;
  onBottomTabChange: (tab: BottomTab) => void;
  grammarNotes: CommentaryNoteRow[];
  passage: PassageRow;
  translationVariants: TranslationVariantRow[];
  latestPassageDraftRun: AiRunRow | null;
  passageDraft: LogosPassageDraft | null;
  draftParseError: string | null;
}) {
  const hasDraftTab = Boolean(latestPassageDraftRun);
  const bottomTabs: BottomTab[] = hasDraftTab
    ? [...BASE_BOTTOM_TABS, "ai-draft"]
    : BASE_BOTTOM_TABS;
  const expanded = bottomTab === "ai-draft";

  return (
    <div
      className="border-t border-[var(--border)] bg-[var(--surface)]"
      style={{ minHeight: expanded ? 320 : 160 }}
    >
      <div className="flex border-b border-[var(--border)] px-6">
        {bottomTabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => onBottomTabChange(tab)}
            className={cn(
              "mr-4 py-2 text-xs font-semibold uppercase tracking-widest transition-colors border-b-2 -mb-px",
              bottomTab === tab
                ? "border-[var(--accent)] text-[var(--accent)]"
                : "border-transparent text-[var(--muted-fg)] hover:text-[var(--foreground)]",
              tab === "ai-draft" && bottomTab !== "ai-draft" && "text-amber-700",
            )}
          >
            {tab === "ai-draft" ? "AI Draft" : tab}
          </button>
        ))}
        <GenerateDraftButton
          latestDraftRun={latestPassageDraftRun}
          onViewDraft={
            hasDraftTab ? () => onBottomTabChange("ai-draft") : undefined
          }
        />
      </div>
      <div
        className="overflow-y-auto p-4 text-sm"
        style={{ maxHeight: expanded ? "min(50vh, 480px)" : 160 }}
      >
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
                  <ReviewBadge row={v} />
                  <ReviewControls
                    passageId={passage.id}
                    target="translation_variant"
                    row={v}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-[var(--muted-fg)]">No variants for this passage.</p>
          )
        ) : null}
        {bottomTab === "ai-draft" ? (
          <AiDraftReviewPanel
            passageId={passage.id}
            draft={passageDraft}
            run={latestPassageDraftRun}
            parseError={draftParseError}
          />
        ) : null}
      </div>
    </div>
  );
}
