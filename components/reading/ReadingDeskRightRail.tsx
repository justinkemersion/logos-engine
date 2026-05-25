import { AuthenticityCard } from "./AuthenticityCard";
import { CrossReferencesPanel } from "./CrossReferencesPanel";
import type {
  AuthenticityProfileRow,
  CommentaryNoteRow,
  ConceptThreadRow,
  CrossReferenceRow,
  PassageRow,
  TranslationLayerRow,
} from "@/lib/types/entities";

export function ReadingDeskRightRail({
  readableLayer,
  philosophicalLayer,
  philosophicalNotes,
  crossRefs,
  passage,
  passageMap,
  authenticity,
  uniqueConcepts,
}: {
  readableLayer: TranslationLayerRow | undefined;
  philosophicalLayer: TranslationLayerRow | undefined;
  philosophicalNotes: CommentaryNoteRow[];
  crossRefs: CrossReferenceRow[];
  passage: PassageRow;
  passageMap: Record<string, PassageRow>;
  authenticity: AuthenticityProfileRow | null;
  uniqueConcepts: ConceptThreadRow[];
}) {
  return (
    <aside className="hidden xl:flex w-[280px] flex-shrink-0 flex-col overflow-y-auto border-l border-[var(--border)] bg-[var(--surface)]">
      {readableLayer ? (
        <RightSection title="Readable English">
          <p className="text-xs text-[var(--foreground)] leading-relaxed">
            {readableLayer.content}
          </p>
        </RightSection>
      ) : null}

      {philosophicalLayer ? (
        <RightSection title="Philosophical Notes">
          <p className="text-xs text-[var(--foreground)] leading-relaxed">
            {philosophicalLayer.content}
          </p>
        </RightSection>
      ) : philosophicalNotes.length > 0 ? (
        <RightSection title="Philosophical Notes">
          {philosophicalNotes.map((n) => (
            <p
              key={n.id}
              className="text-xs text-[var(--foreground)] leading-relaxed mb-2 last:mb-0"
            >
              {n.body}
            </p>
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
      <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-widest text-[var(--muted-fg)]">
        {title}
      </p>
      {children}
    </div>
  );
}
