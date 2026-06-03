import Link from "next/link";
import { publicPassageHref } from "@/lib/public/routes";
import type { PassageRow, WorkRow } from "@/lib/types/entities";

function firstSentence(text: string, maxLen = 80): string {
  const match = text.match(/^[^.!?]+[.!?]?/);
  const sentence = (match?.[0] ?? text).trim();
  return sentence.length > maxLen ? `${sentence.slice(0, maxLen - 1)}…` : sentence;
}

export function PublicContinueReading({
  work,
  passage,
  siblings,
}: {
  work: WorkRow;
  passage: PassageRow;
  siblings: PassageRow[];
}) {
  if (siblings.length <= 1) return null;

  const index = siblings.findIndex((p) => p.id === passage.id);
  const prev = index > 0 ? siblings[index - 1] : null;
  const next = index >= 0 && index < siblings.length - 1 ? siblings[index + 1] : null;

  if (!prev && !next) return null;

  return (
    <section className="border-t border-[var(--border)] px-6 py-10">
      <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-[var(--muted-fg)]">
        Continue reading
      </p>
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {prev ? (
          <Link
            href={publicPassageHref(work, prev)}
            className="text-sm text-[var(--muted-fg)] transition hover:text-[var(--foreground)]"
          >
            ← {work.title} {prev.citation_ref}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={publicPassageHref(work, next)}
            className="text-sm text-[var(--accent)] transition hover:opacity-80 sm:text-right"
          >
            Next: {work.title} {next.citation_ref}
            {next.source_note ? ` — ${firstSentence(next.source_note)}` : ""} →
          </Link>
        ) : null}
      </div>
    </section>
  );
}
