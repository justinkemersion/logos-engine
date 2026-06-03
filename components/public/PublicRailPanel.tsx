import { PublicConceptTrail } from "./PublicConceptTrail";
import { PublicTransmissionCard } from "./PublicTransmissionCard";
import type {
  AuthenticityProfileRow,
  CommentaryNoteRow,
  ConceptThreadRow,
} from "@/lib/types/entities";

function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return `${text.slice(0, maxLen - 1)}…`;
}

function RailSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section>
      <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-widest text-[var(--muted-fg)]">
        {label}
      </p>
      {children}
    </section>
  );
}

export function PublicRailPanel({
  concepts,
  authenticity,
  commentaryNotes,
}: {
  concepts: ConceptThreadRow[];
  authenticity: AuthenticityProfileRow | null;
  commentaryNotes: CommentaryNoteRow[];
}) {
  const notes = commentaryNotes.filter((n) => n.note_type !== "fragment").slice(0, 2);

  return (
    <aside className="space-y-8 lg:order-none">
      <RailSection label="Concepts">
        <PublicConceptTrail concepts={concepts} />
      </RailSection>

      {authenticity ? (
        <RailSection label="Transmission">
          <PublicTransmissionCard profile={authenticity} />
        </RailSection>
      ) : null}

      <RailSection label="Related notes">
        {notes.length === 0 ? (
          <p className="text-sm text-[var(--muted-fg)]">No notes for this passage yet.</p>
        ) : (
          <ul className="space-y-4">
            {notes.map((note) => (
              <li
                key={note.id}
                className="border-l border-[var(--border)] pl-3 text-sm leading-relaxed"
              >
                {note.title ? (
                  <p
                    className="mb-1 font-medium text-[var(--foreground)]"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {note.title}
                  </p>
                ) : null}
                <p className="text-[var(--muted-fg)]">{truncate(note.body, 160)}</p>
              </li>
            ))}
          </ul>
        )}
      </RailSection>
    </aside>
  );
}
