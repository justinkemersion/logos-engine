import { auth } from "@/auth";
import { listWorks } from "@/lib/flux/works";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import Link from "next/link";

export default async function WorksPage() {
  const session = await auth();
  const sub = session!.user!.id;

  let works: Awaited<ReturnType<typeof listWorks>> = [];
  try {
    works = await listWorks(sub);
  } catch {
    /* Flux may be unavailable during local UI dev */
  }

  const byAuthor = works.reduce<Record<string, typeof works>>(
    (acc, w) => {
      (acc[w.author] ??= []).push(w);
      return acc;
    },
    {},
  );

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <PageHeader
        title="Library"
        description="Ancient Greek texts from the original outward."
      />
      {Object.keys(byAuthor).length === 0 ? (
        <EmptyState
          title="No works found"
          hint="Push migrations and seed data, then run pnpm flux:schema:sync."
        />
      ) : (
        <div className="space-y-8">
          {Object.entries(byAuthor).map(([author, authorWorks]) => (
            <div key={author}>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--muted-fg)]">
                {author}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {authorWorks.map((work) => (
                  <Link key={work.id} href={`/works/${work.slug}`}>
                    <Card className="transition hover:shadow-md">
                      <p className="font-medium" style={{ fontFamily: "var(--font-serif)" }}>
                        {work.title}
                      </p>
                      {work.original_title ? (
                        <p className="mt-0.5 text-sm text-[var(--muted-fg)]">
                          {work.original_title}
                        </p>
                      ) : null}
                      {work.description ? (
                        <p className="mt-2 text-xs text-[var(--muted-fg)] leading-relaxed line-clamp-2">
                          {work.description}
                        </p>
                      ) : null}
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
