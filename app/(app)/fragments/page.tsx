import { auth } from "@/auth";
import { listFragments } from "@/lib/flux/commentary";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import type { CommentaryNoteRow } from "@/lib/types/entities";

export default async function FragmentsPage() {
  const session = await auth();
  const sub = session!.user!.id;

  let fragments: CommentaryNoteRow[] = [];
  try {
    fragments = await listFragments(sub);
  } catch {
    /* Flux may be unavailable during local UI dev */
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <PageHeader
        title="Fragments"
        description="Short, potent passages from the ancient world — offered as standalone thoughts."
      />
      {fragments.length === 0 ? (
        <EmptyState
          title="No fragments found"
          hint="Push migrations and seed data, then run pnpm flux:schema:sync."
        />
      ) : (
        <div className="space-y-8">
          {fragments.map((fragment) => (
            <FragmentCard key={fragment.id} fragment={fragment} />
          ))}
        </div>
      )}
    </div>
  );
}

function FragmentCard({ fragment }: { fragment: CommentaryNoteRow }) {
  const body = fragment.body;

  const [headerPart, ...rest] = body.split("\n\n");
  const [authorWork, ...quoteParts] = headerPart.split("\n");

  return (
    <article className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
      {authorWork ? (
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--muted-fg)]">
          {authorWork}
        </p>
      ) : null}

      {quoteParts.length > 0 ? (
        <blockquote
          className="mb-4 border-l-2 border-[var(--accent)] pl-4 text-base leading-relaxed italic"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {quoteParts.join("\n").replace(/^"|"$/g, "")}
        </blockquote>
      ) : null}

      {rest.length > 0 ? (
        <div className="space-y-3">
          {rest.map((para, i) => (
            <p key={i} className="text-sm text-[var(--foreground)] leading-relaxed">
              {para}
            </p>
          ))}
        </div>
      ) : null}
    </article>
  );
}
