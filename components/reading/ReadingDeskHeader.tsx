import type { PassageRow, WorkRow } from "@/lib/types/entities";

export function ReadingDeskHeader({
  work,
  passage,
}: {
  work: WorkRow;
  passage: PassageRow;
}) {
  return (
    <div className="border-b border-[var(--border)] bg-[var(--surface)] px-6 py-4">
      <p className="mb-1 text-xs text-[var(--muted-fg)]">
        {work.author} › {work.title} › {passage.citation_ref}
      </p>
      <h1
        className="text-xl font-semibold tracking-tight"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        {work.title} {passage.citation_ref}
      </h1>
    </div>
  );
}
