import type { PassageRow, WorkRow } from "@/lib/types/entities";

export function PublicPassageHeader({
  work,
  passage,
}: {
  work: WorkRow;
  passage: PassageRow;
}) {
  return (
    <div className="border-b border-[var(--border)] px-6 py-6">
      <p className="text-xs tracking-wide text-[var(--muted-fg)]">
        {work.author} › {work.title} › {passage.citation_ref}
      </p>
      <h1
        className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        {work.title} {passage.citation_ref}
      </h1>
      {passage.source_note ? (
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--muted-fg)]">
          {passage.source_note}
        </p>
      ) : null}
    </div>
  );
}
