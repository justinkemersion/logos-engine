import { AuthenticityCard } from "./AuthenticityCard";
import { CrossReferencesPanel } from "./CrossReferencesPanel";
import { TranslationLayerPanel } from "./TranslationLayerPanel";
import { ReviewBadge } from "./ReviewBadge";
import { ReviewControls } from "./ReviewControls";
import type {
  AuthenticityProfileRow,
  CommentaryNoteRow,
  ConceptMentionRow,
  ConceptThreadRow,
  CrossReferenceRow,
  PassageRow,
  TranslationLayerRow,
} from "@/lib/types/entities";

export function ReadingDeskRightRail({
  translationLayers,
  readableLayer,
  philosophicalLayer,
  philosophicalNotes,
  crossRefs,
  passage,
  passageMap,
  authenticity,
  uniqueConcepts,
  conceptMentions,
}: {
  translationLayers: TranslationLayerRow[];
  readableLayer: TranslationLayerRow | undefined;
  philosophicalLayer: TranslationLayerRow | undefined;
  philosophicalNotes: CommentaryNoteRow[];
  crossRefs: CrossReferenceRow[];
  passage: PassageRow;
  passageMap: Record<string, PassageRow>;
  authenticity: AuthenticityProfileRow | null;
  uniqueConcepts: ConceptThreadRow[];
  conceptMentions: ConceptMentionRow[];
}) {
  const aiPromotedMentions = conceptMentions.filter((m) => m.source_ai_run_id);

  return (
    <aside className="hidden xl:flex w-[280px] flex-shrink-0 flex-col overflow-y-auto border-l border-[var(--border)] bg-[var(--surface)]">
      {readableLayer ? (
        <RightSection title="Readable English">
          <TranslationLayerPanel
            passageId={passage.id}
            title=""
            layerName="readable"
            primaryLayer={readableLayer}
            allLayers={translationLayers}
            emptyMessage="No readable layer available."
            contentClassName="text-xs text-[var(--foreground)] leading-relaxed"
          />
        </RightSection>
      ) : null}

      {philosophicalLayer ? (
        <RightSection title="Philosophical Notes">
          <TranslationLayerPanel
            passageId={passage.id}
            title=""
            layerName="philosophical"
            primaryLayer={philosophicalLayer}
            allLayers={translationLayers}
            emptyMessage="No philosophical layer available."
            contentClassName="text-xs text-[var(--foreground)] leading-relaxed"
          />
        </RightSection>
      ) : philosophicalNotes.length > 0 ? (
        <RightSection title="Philosophical Notes">
          {philosophicalNotes.map((n) => (
            <div key={n.id} className="mb-2 last:mb-0">
              <p className="text-xs text-[var(--foreground)] leading-relaxed">{n.body}</p>
              <ReviewBadge row={n} />
              <ReviewControls
                passageId={passage.id}
                target="commentary_note"
                row={n}
              />
            </div>
          ))}
        </RightSection>
      ) : null}

      <RightSection title={`Cross References (${crossRefs.length})`}>
        <CrossReferencesPanel
          crossRefs={crossRefs}
          currentPassageId={passage.id}
          passageMap={passageMap}
        />
      </RightSection>

      {authenticity ? (
        <RightSection title="Authenticity & Transmission">
          <AuthenticityCard profile={authenticity} />
        </RightSection>
      ) : null}

      {uniqueConcepts.length > 0 ? (
        <RightSection title="Related Concepts">
          <div className="flex flex-wrap gap-1.5">
            {uniqueConcepts.map((c) => (
              <a
                key={c.id}
                href={`/concepts/${c.slug}`}
                className="rounded-full border border-[var(--border)] bg-[var(--muted)] px-2 py-0.5 text-xs hover:bg-[var(--accent)] hover:text-[var(--accent-fg)] hover:border-[var(--accent)] transition-colors"
              >
                {c.greek_term ?? c.label}
              </a>
            ))}
          </div>
          {aiPromotedMentions.length > 0 ? (
            <div className="mt-3 space-y-2 border-t border-[var(--border)] pt-3">
              {aiPromotedMentions.map((mention) => (
                <div key={mention.id}>
                  <ReviewBadge row={mention} />
                  <ReviewControls
                    passageId={passage.id}
                    target="concept_mention"
                    row={mention}
                  />
                </div>
              ))}
            </div>
          ) : null}
        </RightSection>
      ) : null}
    </aside>
  );
}

function RightSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-[var(--border)] px-4 py-4 last:border-0">
      {title ? (
        <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-widest text-[var(--muted-fg)]">
          {title}
        </p>
      ) : null}
      {children}
    </div>
  );
}
