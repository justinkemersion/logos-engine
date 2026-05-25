import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { getWork, getAuthenticity } from "@/lib/flux/works";
import { listPassagesByWork } from "@/lib/flux/passages";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { EmptyState } from "@/components/ui/EmptyState";
import Link from "next/link";

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await auth();
  const sub = session!.user!.id;

  let work: Awaited<ReturnType<typeof getWork>> = null;
  let passages: Awaited<ReturnType<typeof listPassagesByWork>> = [];
  let authenticity: Awaited<ReturnType<typeof getAuthenticity>> = null;
  try {
    work = await getWork(sub, slug);
    if (work) {
      [passages, authenticity] = await Promise.all([
        listPassagesByWork(sub, work.id),
        getAuthenticity(sub, work.id),
      ]);
    }
  } catch {
    /* Flux may be unavailable during local UI dev */
  }

  if (!work) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div className="mb-2 text-xs text-[var(--muted-fg)]">
        <Link href="/works" className="hover:underline">Library</Link>
        {" › "}
        {work.author}
        {" › "}
        {work.title}
      </div>
      <PageHeader
        title={work.title}
        description={work.original_title ?? undefined}
      />

      {authenticity ? (
        <Card className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-[var(--muted-fg)] uppercase tracking-wide">
              Authenticity
            </span>
            <StatusPill status={authenticity.status} />
          </div>
          <p className="text-sm text-[var(--muted-fg)] leading-relaxed">{authenticity.summary}</p>
        </Card>
      ) : null}

      <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--muted-fg)]">
        Passages
      </h2>

      {passages.length === 0 ? (
        <EmptyState title="No passages found" />
      ) : (
        <div className="space-y-2">
          {passages.map((passage) => (
            <Link key={passage.id} href={`/passages/${passage.id}`}>
              <Card className="transition hover:shadow-md">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs font-mono text-[var(--muted-fg)]">
                      {passage.citation_ref}
                    </span>
                    <p
                      className="mt-1 text-base leading-relaxed"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      {passage.greek_text}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
