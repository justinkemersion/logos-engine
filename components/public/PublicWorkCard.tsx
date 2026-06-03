import Link from "next/link";
import { cn } from "@/lib/ui/cn";
import type { PassageRow, WorkRow } from "@/lib/types/entities";

const buttonPrimary =
  "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition bg-[var(--accent)] text-[var(--accent-fg)] hover:opacity-90";

export function PublicWorkCard({
  work,
  passages,
}: {
  work: WorkRow;
  passages: PassageRow[];
}) {
  const firstPassage = passages[0];
  const visibleCitations = passages.slice(0, 4);
  const extraCount = passages.length - visibleCitations.length;

  return (
    <article className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 shadow-none">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3
            className="text-xl font-semibold tracking-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {work.title}
            {work.original_title ? (
              <span className="ml-2 text-base font-normal text-[var(--muted-fg)]">
                {work.original_title}
              </span>
            ) : null}
          </h3>
          <p className="mt-1 text-[0.65rem] font-semibold uppercase tracking-widest text-[var(--muted-fg)]">
            {work.author}
            {work.tradition ? ` · ${work.tradition}` : ""}
          </p>
        </div>
        {firstPassage ? (
          <Link href={`/read/${firstPassage.id}`} className={cn(buttonPrimary, "shrink-0")}>
            Open
          </Link>
        ) : null}
      </div>

      {work.description ? (
        <p
          className="mt-4 text-base leading-relaxed text-[var(--foreground)] italic"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {work.description}
        </p>
      ) : null}

      <p className="mt-4 text-xs text-[var(--muted-fg)]">
        {passages.length === 1
          ? "1 passage available"
          : `${passages.length} passages available`}
      </p>

      {visibleCitations.length > 0 ? (
        <ul className="mt-3 flex flex-wrap gap-2">
          {visibleCitations.map((p) => (
            <li key={p.id}>
              <Link
                href={`/read/${p.id}`}
                className="inline-block rounded-md border border-[var(--border)] bg-[var(--background)] px-2.5 py-1 text-xs font-medium text-[var(--foreground)] transition hover:bg-[var(--muted)]"
              >
                {p.citation_ref}
              </Link>
            </li>
          ))}
          {extraCount > 0 ? (
            <li className="self-center text-xs text-[var(--muted-fg)]">+{extraCount} more</li>
          ) : null}
        </ul>
      ) : null}
    </article>
  );
}
